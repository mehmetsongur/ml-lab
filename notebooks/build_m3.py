"""ML Laboratuvarı — Modül 3 Colab notebook üretici (TR/EN).
Çıktı: modul3/*.ipynb (TR) ve module3/*.ipynb (EN). Veri: 13 FRED serisi (API anahtarı gerekmez)."""
import os, json
from build_notebooks import nb, FRED_HELPER, b64, OUT

CODES = {"A": "ML3-ENF-4KQZ", "B": "ML3-LSO-7XPD"}
KODLAR = ["CPIAUCSL", "CPILFESL", "PPIACO", "M2SL", "WTISPLC", "AHETPI", "PAYEMS", "INDPRO", "UNRATE", "FEDFUNDS", "T10Y3MM", "UMCSENT", "HOUST"]


def fnv(s):
    x = 0x811c9dc5
    for ch in s:
        x ^= ord(ch); x = (x * 0x01000193) & 0xFFFFFFFF
    return f"{x:08x}"


EN_SETUP = """
import io, base64, urllib.request, warnings, datetime
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression, Lasso, LassoCV
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline, make_pipeline
from sklearn.model_selection import GridSearchCV, TimeSeriesSplit, KFold
from sklearn.exceptions import ConvergenceWarning
warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("always", category=ConvergenceWarning)   # convergence warnings stay visible
LAST_MONTH = None   # For a fixed data vintage write a month (e.g. "2025-12-01"): later observations are dropped. None: latest data.
""" + FRED_HELPER["en"] + """
codes = """ + repr(KODLAR) + """
print("Download time (UTC):", datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M"))
raw = pd.concat([fred_download(k).set_index("date") for k in codes], axis=1).sort_index().asfreq("MS")
if LAST_MONTH is not None:
    raw = raw.loc[:pd.Timestamp(LAST_MONTH)]
    print("Fixed vintage: observations after", LAST_MONTH, "were dropped.")
G = pd.DataFrame(index=raw.index)
G["inf"] = raw["CPIAUCSL"].pct_change(12, fill_method=None) * 100     # annual inflation (%)
G["monthly"] = raw["CPIAUCSL"].pct_change(1, fill_method=None) * 100  # monthly inflation (%)
for k in ["CPILFESL", "PPIACO", "M2SL", "WTISPLC", "AHETPI", "PAYEMS", "INDPRO"]:
    G[k] = raw[k].pct_change(12, fill_method=None) * 100              # annual change (%)
for k in ["UNRATE", "FEDFUNDS", "T10Y3MM", "UMCSENT"]:
    G[k] = raw[k]                                                      # level
G["HOUST"] = np.log(raw["HOUST"])                                      # housing starts (log)
_G = G.copy()
START, CUT = pd.Timestamp("1984-01-01"), pd.Timestamp("2015-01-01")   # CUT: first test TARGET month
_REF = {}

def _k(s):
    return base64.b64decode(s).decode()

def _rm(a, b):
    return float(np.sqrt(np.mean((np.asarray(a, dtype=float) - np.asarray(b, dtype=float)) ** 2)))

def _reference():
    if _REF:
        return _REF
    ft = {}
    for k in _G.columns:
        if k != "monthly":
            for g in range(3):
                ft[f"{k}_l{g}"] = _G[k].shift(g)
    for g in range(12):
        ft[f"monthly_l{g}"] = _G["monthly"].shift(g)
    X = pd.DataFrame(ft)
    t = pd.concat([X, _G["inf"].shift(-1).rename("target")], axis=1).loc[START:].dropna()
    t["target_month"] = t.index + pd.DateOffset(months=1)
    e, s = t[t["target_month"] < CUT], t[t["target_month"] >= CUT]
    c = list(X.columns)
    ols = make_pipeline(StandardScaler(), LinearRegression()).fit(e[c], e["target"])
    las = GridSearchCV(make_pipeline(StandardScaler(), Lasso(max_iter=50000)), {"lasso__alpha": np.logspace(-4, 0.5, 60)},
                       cv=TimeSeriesSplit(5), scoring="neg_mean_squared_error").fit(e[c], e["target"])
    _REF.update(n_test=len(s), n_train=len(e), naive=_rm(s["inf_l0"], s["target"]), ols=_rm(ols.predict(s[c]), s["target"]),
                lasso=_rm(las.predict(s[c]), s["target"]), last_row=t.index.max(), last_target=t["target_month"].max())
    return _REF

def check_A(table, train, test, rmse_naive, rmse_ols):
    if "target" not in table.columns:
        print("❌ No column called 'target' in 'table'."); return
    h = table["target"]
    if np.allclose(h.values, _G["inf"].reindex(h.index).values, equal_nan=True):
        print("❌ The target is not shifted: 'target' is this month's inflation. Next month's value needs shift(-1) (target leakage)."); return
    if not np.allclose(h.values, _G["inf"].shift(-1).reindex(h.index).values, equal_nan=True):
        print("❌ 'target' does not match next month's annual inflation (inf.shift(-1)). The target may be built differently or missing months may have been filled."); return
    if "target_month" not in table.columns:
        print("❌ No 'target_month' column. Add the month each row's target belongs to: table['target_month'] = table.index + pd.DateOffset(months=1)"); return
    if not (pd.to_datetime(table["target_month"]).values == (table.index + pd.DateOffset(months=1)).values).all():
        print("❌ 'target_month' should be one month after the feature month (the index)."); return
    if table.drop(columns=["target_month"]).isna().sum().sum() > 0:
        print("❌ The table has missing values; rows with missing months should be left out (dropna)."); return
    if len(table.columns) - 2 != 51:
        print(f"❌ 51 features expected, found {len(table.columns) - 2} (excluding target and target_month). Re-read the recipe: 13 series × 3 lags + 12 lags of monthly inflation."); return
    for name, d in [("train", train), ("test", test)]:
        if "target_month" not in d.columns or not d.index.is_monotonic_increasing:
            print(f"❌ '{name}' must be in date order and contain the 'target_month' column; no shuffling."); return
    if train["target_month"].max() >= CUT:
        print(f"❌ Training contains a row whose target is {train['target_month'].max():%Y-%m}. Split by TARGET month: the December 2014 row's target is January 2015 and belongs to the test."); return
    if test["target_month"].min() < CUT:
        print("❌ The test contains rows whose target is before 2015; test target months must be 2015-01 or later."); return
    r = _reference()
    if len(test) > r["n_test"]:
        print("❌ The test period has more months than expected: missing months may have been filled. Don't fill; leave them out."); return
    if len(test) < r["n_test"] or len(train) < r["n_train"]:
        print(f"❌ Fewer rows than expected (training {len(train)}/{r['n_train']}, test {len(test)}/{r['n_test']}). The cut-off or start date may differ."); return
    if train.index.min() > START + pd.Timedelta(days=40):
        print("❌ The training data do not start in 1984."); return
    if abs(float(rmse_naive) - r["naive"]) > 0.005:
        print("❌ The naive forecast's RMSE differs from the expected value. Is the forecast 'this month's annual inflation' (inf_l0), compared with the target?"); return
    if abs(float(rmse_ols) - r["ols"]) > 0.02:
        print("❌ OLS's test RMSE differs from the expected value. Were all 51 features used? Was the model built on training data only?"); return
    print(f"Last training target: {train['target_month'].max():%Y-%m} · first test target: {test['target_month'].min():%Y-%m} · test rows: {len(test)}")
    print(f"Data vintage: last complete feature row {r['last_row']:%Y-%m}, last target month {r['last_target']:%Y-%m}")
    print(f"✅ All checks passed (naive ≈ {r['naive']:.3f}, OLS ≈ {r['ols']:.3f}). Your completion code: " + _k(\"""" + b64(CODES["A"]) + """\"))

def check_B(search, rmse_lasso, selected, train, test):
    if not isinstance(search, GridSearchCV):
        print("❌ 'search' should be a GridSearchCV object. Feeding pre-scaled data to LassoCV carries each validation fold's own mean and deviation into the scaling; use Pipeline(StandardScaler, Lasso) + GridSearchCV."); return
    est = search.estimator
    if not (isinstance(est, Pipeline) and isinstance(est.steps[0][1], StandardScaler) and isinstance(est.steps[-1][1], Lasso)):
        print("❌ The searched model should be Pipeline(StandardScaler, Lasso): the scaler must be fitted in each fold on that fold's training part only."); return
    if isinstance(search.cv, KFold) or not isinstance(search.cv, TimeSeriesSplit):
        print("❌ λ was not chosen with time-respecting cross-validation. Use cv=TimeSeriesSplit(5); shuffled KFold shows the future."); return
    if search.scoring != "neg_mean_squared_error":
        print("❌ State the selection measure explicitly: scoring='neg_mean_squared_error' (MSE)."); return
    if not hasattr(search, "best_estimator_"):
        print("❌ The search is not finished or refit=False: the model must be refitted on all training data with the chosen λ."); return
    final = search.best_estimator_
    names = list(getattr(final, "feature_names_in_", []))
    if len(names) != 51:
        print("❌ The model should be fitted with the 51 feature names (train[features])."); return
    if train["target_month"].max() >= CUT or test["target_month"].min() < CUT:
        print("❌ 'train' and 'test' are not split by target month (Task A)."); return
    if final[0].n_samples_seen_ != len(train) or not np.allclose(final[0].mean_, train[names].mean().values):
        print("❌ The final model was not fitted on the 'train' rows only: it should be fit(train[features], train['target'])."); return
    if abs(_rm(search.predict(test[names]), test["target"]) - float(rmse_lasso)) > 1e-6:
        print("❌ 'rmse_lasso' should be computed between search.predict(test[features]) and test['target'] (predictions on the test rows)."); return
    r = _reference()
    if abs(float(rmse_lasso) - r["lasso"]) > 0.01:
        print("❌ Lasso's test RMSE differs from the expected value. Do the λ grid ({'lasso__alpha': np.logspace(-4, 0.5, 60)}) and max_iter=50000 match the prompt?"); return
    nz = int(np.sum(np.abs(final[-1].coef_) > 0))
    if len(selected) != nz:
        print(f"❌ 'selected' has {len(selected)} items, but there are {nz} non-zero coefficients. Count negative coefficients too (coef_ != 0)."); return
    if "monthly_l11" not in selected:
        print("ℹ️ Note: monthly_l11 (base effect) is not on the list; check the feature names.")
    print(f"Chosen λ: {search.best_params_['lasso__alpha']:.4f} · selected variables: {nz} / 51 · test rows: {len(test)}")
    print(f"✅ All checks passed (Lasso ≈ {r['lasso']:.3f}, naive ≈ {r['naive']:.3f}). Your completion code: " + _k(\"""" + b64(CODES["B"]) + """\"))
"""

SETUP = {
    "tr": """
import io, base64, urllib.request, warnings, datetime
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression, Lasso, LassoCV
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline, make_pipeline
from sklearn.model_selection import GridSearchCV, TimeSeriesSplit, KFold
from sklearn.exceptions import ConvergenceWarning
warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("always", category=ConvergenceWarning)   # yakınsama uyarısı görünür kalır
SON_AY = None   # Sabit veri kesiti için bir ay yaz (ör. "2025-12-01"): bu aydan sonraki gözlemler atılır. None: en güncel veri.
""" + FRED_HELPER["tr"] + """
kodlar = """ + repr(KODLAR) + """
print("İndirme zamanı (UTC):", datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M"))
ham = pd.concat([fred_indir(k).set_index("tarih") for k in kodlar], axis=1).sort_index().asfreq("MS")
if SON_AY is not None:
    ham = ham.loc[:pd.Timestamp(SON_AY)]
    print("Sabit kesit:", SON_AY, "sonrasındaki gözlemler atıldı.")
G = pd.DataFrame(index=ham.index)
G["enf"] = ham["CPIAUCSL"].pct_change(12, fill_method=None) * 100     # yıllık enflasyon (%)
G["aylik"] = ham["CPIAUCSL"].pct_change(1, fill_method=None) * 100    # aylık enflasyon (%)
for k in ["CPILFESL", "PPIACO", "M2SL", "WTISPLC", "AHETPI", "PAYEMS", "INDPRO"]:
    G[k] = ham[k].pct_change(12, fill_method=None) * 100              # yıllık değişim (%)
for k in ["UNRATE", "FEDFUNDS", "T10Y3MM", "UMCSENT"]:
    G[k] = ham[k]                                                      # düzey
G["HOUST"] = np.log(ham["HOUST"])                                      # konut başlangıcı (log)
_G = G.copy()
BASLA, KESIM = pd.Timestamp("1984-01-01"), pd.Timestamp("2015-01-01")   # KESIM: ilk test HEDEF ayı
_REF = {}

def _k(s):
    return base64.b64decode(s).decode()

def _kh(a, b):
    return float(np.sqrt(np.mean((np.asarray(a, dtype=float) - np.asarray(b, dtype=float)) ** 2)))

def _referans():
    if _REF:
        return _REF
    oz = {}
    for k in _G.columns:
        if k != "aylik":
            for g in range(3):
                oz[f"{k}_g{g}"] = _G[k].shift(g)
    for g in range(12):
        oz[f"aylik_g{g}"] = _G["aylik"].shift(g)
    X = pd.DataFrame(oz)
    t = pd.concat([X, _G["enf"].shift(-1).rename("hedef")], axis=1).loc[BASLA:].dropna()
    t["hedef_ayi"] = t.index + pd.DateOffset(months=1)
    e, s = t[t["hedef_ayi"] < KESIM], t[t["hedef_ayi"] >= KESIM]
    c = list(X.columns)
    ekk = make_pipeline(StandardScaler(), LinearRegression()).fit(e[c], e["hedef"])
    las = GridSearchCV(make_pipeline(StandardScaler(), Lasso(max_iter=50000)), {"lasso__alpha": np.logspace(-4, 0.5, 60)},
                       cv=TimeSeriesSplit(5), scoring="neg_mean_squared_error").fit(e[c], e["hedef"])
    _REF.update(n_test=len(s), n_egitim=len(e), saf=_kh(s["enf_g0"], s["hedef"]), ekk=_kh(ekk.predict(s[c]), s["hedef"]),
                lasso=_kh(las.predict(s[c]), s["hedef"]), son_satir=t.index.max(), son_hedef=t["hedef_ayi"].max())
    return _REF

def kontrol_A(tablo, egitim, test, kok_hko_saf, kok_hko_ekk):
    if "hedef" not in tablo.columns:
        print("❌ 'tablo' içinde 'hedef' adlı bir sütun bulunamadı."); return
    h = tablo["hedef"]
    if np.allclose(h.values, _G["enf"].reindex(h.index).values, equal_nan=True):
        print("❌ Hedef kaydırılmamış: 'hedef' bu ayın enflasyonu. Gelecek ayın değeri için shift(-1) gerekir (hedef sızıntısı)."); return
    if not np.allclose(h.values, _G["enf"].shift(-1).reindex(h.index).values, equal_nan=True):
        print("❌ 'hedef' gelecek ayın yıllık enflasyonu (enf.shift(-1)) ile uyuşmuyor. Hedef farklı kurulmuş ya da eksik aylar doldurulmuş olabilir."); return
    if "hedef_ayi" not in tablo.columns:
        print("❌ 'hedef_ayi' sütunu yok. Her satırın hedefinin ait olduğu ayı ekle: tablo['hedef_ayi'] = tablo.index + pd.DateOffset(months=1)"); return
    if not (pd.to_datetime(tablo["hedef_ayi"]).values == (tablo.index + pd.DateOffset(months=1)).values).all():
        print("❌ 'hedef_ayi' özellik ayının (indeks) bir ay sonrası olmalı."); return
    if tablo.drop(columns=["hedef_ayi"]).isna().sum().sum() > 0:
        print("❌ Tabloda eksik değer var; eksik ayları içeren satırlar dışarıda bırakılmalı (dropna)."); return
    if len(tablo.columns) - 2 != 51:
        print(f"❌ 51 özellik bekleniyordu, {len(tablo.columns) - 2} var (hedef ve hedef_ayi hariç). Tarifi yeniden oku: 13 seri × 3 gecikme + aylık enflasyonun 12 gecikmesi."); return
    for ad, d in [("egitim", egitim), ("test", test)]:
        if "hedef_ayi" not in d.columns or not d.index.is_monotonic_increasing:
            print(f"❌ '{ad}' tarih sırasında olmalı ve 'hedef_ayi' sütununu içermeli; karıştırma olmamalı."); return
    if egitim["hedef_ayi"].max() >= KESIM:
        print(f"❌ Eğitimde hedefi {egitim['hedef_ayi'].max():%Y-%m} olan bir satır var. Bölme HEDEF ayına göre yapılmalı: Aralık 2014 satırının hedefi Ocak 2015'tir ve teste aittir."); return
    if test["hedef_ayi"].min() < KESIM:
        print("❌ Testte hedefi 2015 öncesine ait satır var; test, hedef ayı 2015-01 ve sonrası olmalı."); return
    r = _referans()
    if len(test) > r["n_test"]:
        print("❌ Test döneminde beklenenden fazla ay var: eksik aylar doldurulmuş olabilir. Doldurma; dışarıda bırak."); return
    if len(test) < r["n_test"] or len(egitim) < r["n_egitim"]:
        print(f"❌ Beklenenden az satır var (eğitim {len(egitim)}/{r['n_egitim']}, test {len(test)}/{r['n_test']}). Kesim ya da başlangıç tarihi farklı olabilir."); return
    if egitim.index.min() > BASLA + pd.Timedelta(days=40):
        print("❌ Eğitim verisi 1984'ten başlamıyor."); return
    if abs(float(kok_hko_saf) - r["saf"]) > 0.005:
        print("❌ Saf öngörünün kök HKO'su beklenenden farklı. Öngörü 'bu ayın yıllık enflasyonu' (enf_g0) mı, hedefle mi karşılaştırıldı?"); return
    if abs(float(kok_hko_ekk) - r["ekk"]) > 0.02:
        print("❌ EKK'nın test kök HKO'su beklenenden farklı. 51 özelliğin hepsi kullanıldı mı? Model yalnızca eğitimle mi kuruldu?"); return
    print(f"Son eğitim hedefi: {egitim['hedef_ayi'].max():%Y-%m} · ilk test hedefi: {test['hedef_ayi'].min():%Y-%m} · test satırı: {len(test)}")
    print(f"Veri kesiti: son tam özellik satırı {r['son_satir']:%Y-%m}, son hedef ayı {r['son_hedef']:%Y-%m}")
    print(f"✅ Tüm kontroller geçti (saf ≈ {r['saf']:.3f}, EKK ≈ {r['ekk']:.3f}). Tamamlama kodun: " + _k(\"""" + b64(CODES["A"]) + """\"))

def kontrol_B(arama, kok_hko_lasso, secilenler, egitim, test):
    if not isinstance(arama, GridSearchCV):
        print("❌ 'arama' bir GridSearchCV nesnesi olmalı. LassoCV'ye önceden ölçeklenmiş veri vermek, her doğrulama katının kendi ortalama ve sapmasını ölçeklemeye taşır; Pipeline(StandardScaler, Lasso) + GridSearchCV kullan."); return
    est = arama.estimator
    if not (isinstance(est, Pipeline) and isinstance(est.steps[0][1], StandardScaler) and isinstance(est.steps[-1][1], Lasso)):
        print("❌ Aranan model Pipeline(StandardScaler, Lasso) olmalı: ölçekleyici her katta yalnızca o katın eğitim kısmıyla kurulmalı."); return
    if isinstance(arama.cv, KFold) or not isinstance(arama.cv, TimeSeriesSplit):
        print("❌ λ zamana saygılı çapraz doğrulamayla seçilmemiş. cv=TimeSeriesSplit(5) kullan; karıştırılmış KFold geleceği gösterir."); return
    if arama.scoring != "neg_mean_squared_error":
        print("❌ Seçim ölçüsünü açıkça yaz: scoring='neg_mean_squared_error' (HKO)."); return
    if not hasattr(arama, "best_estimator_"):
        print("❌ Arama tamamlanmamış ya da refit=False: seçilen λ ile tüm eğitim verisinde yeniden kurulmalı."); return
    son = arama.best_estimator_
    adlar = list(getattr(son, "feature_names_in_", []))
    if len(adlar) != 51:
        print("❌ Model 51 özellik adıyla (egitim[ozellikler]) kurulmalı."); return
    if egitim["hedef_ayi"].max() >= KESIM or test["hedef_ayi"].min() < KESIM:
        print("❌ 'egitim' ve 'test' hedef ayına göre bölünmemiş (Görev A)."); return
    if son[0].n_samples_seen_ != len(egitim) or not np.allclose(son[0].mean_, egitim[adlar].mean().values):
        print("❌ Son model yalnızca 'egitim' satırlarıyla kurulmamış: fit(egitim[ozellikler], egitim['hedef']) olmalı."); return
    if abs(_kh(arama.predict(test[adlar]), test["hedef"]) - float(kok_hko_lasso)) > 1e-6:
        print("❌ 'kok_hko_lasso', arama.predict(test[ozellikler]) ile test['hedef'] arasında hesaplanmalı (test satırlarındaki öngörüler)."); return
    r = _referans()
    if abs(float(kok_hko_lasso) - r["lasso"]) > 0.01:
        print("❌ Lasso'nun test kök HKO'su beklenenden farklı. λ ızgarası ({'lasso__alpha': np.logspace(-4, 0.5, 60)}) ve max_iter=50000 isteğe uygun mu?"); return
    nz = int(np.sum(np.abs(son[-1].coef_) > 0))
    if len(secilenler) != nz:
        print(f"❌ 'secilenler' {len(secilenler)} öğe içeriyor, ama sıfırdan farklı katsayı sayısı {nz}. Negatif katsayıları da say (coef_ != 0)."); return
    if "aylik_g11" not in secilenler:
        print("ℹ️ Bilgi: aylik_g11 (baz etkisi) listede yok; özellik adlarını kontrol et.")
    print(f"Seçilen λ: {arama.best_params_['lasso__alpha']:.4f} · seçilen değişken: {nz} / 51 · test satırı: {len(test)}")
    print(f"✅ Tüm kontroller geçti (Lasso ≈ {r['lasso']:.3f}, saf ≈ {r['saf']:.3f}). Tamamlama kodun: " + _k(\"""" + b64(CODES["B"]) + """\"))
""",
    "en": EN_SETUP,
}

T = {
    "tr": dict(
        title="# ML Laboratuvarı · Modül 3, Ünite 9: Enflasyonu öngörmek",
        intro="""**Prof. Dr. Mehmet Songur** · ML Laboratuvarı, Modül 3

Veri: 13 aylık ABD serisi (FRED). Kurulum hücresi `G` adlı aylık bir tablo hazırlar (indeks: tarih). Sütunlar: `enf` (yıllık enflasyon, %), `aylik` (aylık enflasyon, %), 7 serinin yıllık değişimi (`CPILFESL`, `PPIACO`, `M2SL`, `WTISPLC`, `AHETPI`, `PAYEMS`, `INDPRO`), 4 serinin düzeyi (`UNRATE`, `FEDFUNDS`, `T10Y3MM`, `UMCSENT`) ve `HOUST` (log). Kodu **Gemini'ye yazdır**, sonra **denetle**.

**Başlamadan:** GitHub'dan açılan bu notebook'u düzenleyebilmek için **Dosya → Drive'a kopya kaydet**'i seç ve açılan kopyada çalış.

**Kurallar ve sıra**
1. **Kurulum** ve **Kontrol** hücrelerini değiştirme; yalnızca çalıştır.
2. Görev hücrelerinde kodu Gemini ile üret; çalıştırmadan önce oku. Gemini kodu yorum satırının altına yeni bir hücre olarak ekleyebilir; sırayla çalıştır.
3. Görev kodu hatasız çalışınca ilgili **Kontrol** hücresini çalıştır. Hata gösterirse düzelt, görev hücresini ve kontrolü yeniden çalıştır.
4. Kontrol geçerse bir **tamamlama kodu** verir; onu ve görev kodunu ML Laboratuvarı'ndaki kutuya yapıştır.

> **Veri kesiti:** Kurulum hücresi indirme zamanını ve her serinin son ayını yazdırır. Canlı FRED verisiyle sayılar Lab'dakilerden biraz farklı olabilir; sabit bir kesitle çalışmak için Kurulum hücresindeki `SON_AY` ayarını kullan (yalnızca o satırı değiştir).
>
> **Geriye dönük deney:** Ekim 2025'in TÜFE verisi yok (ABD federal hükümetinin kapanması); eksik ayları doldurma, içeren satırları dışarıda bırak. Basitlik için “bu ayın verisi ay sonunda biliniyor” varsayıyoruz; gerçekte TÜFE bir sonraki ayın ortasında yayımlanır, diğer serilerin de yayın gecikmeleri ve revizyonları vardır. Gerçek zamanlı bir öngörü, tahmin günü bilinen veri sürümlerini (ALFRED) kullanmalıdır.""",
        setup_title="#@title Kurulum — çalıştır, değiştirme",
        after_setup='\nprint("G tablosu:", G.shape)\nG.tail(3).round(2)',
        taskA="""## Görev A — Problem ve kıyas ölçütü

1. **Özellikler:** `G`'nin `aylik` dışındaki her sütunu için 0, 1 ve 2 ay gecikmeli değerler (`{sütun}_g0`, `{sütun}_g1`, `{sütun}_g2`) ve `aylik`'in 0–11 ay gecikmeli değerleri (`aylik_g0` … `aylik_g11`): toplam 51.
2. **Hedef:** gelecek ayın yıllık enflasyonu, `hedef` adlı sütun: `G["enf"].shift(-1)`.
3. Özellikleri ve hedefi `tablo` adlı bir tabloda birleştir, `1984-01-01`'den başlat ve eksik değerli satırları at. Sonra hedefin ait olduğu ayı ekle: `tablo["hedef_ayi"] = tablo.index + pd.DateOffset(months=1)` (indeks özellik ayıdır).
4. **Hedef ayına göre böl:** `hedef_ayi` `pd.Timestamp("2015-01-01")`'den önce olan satırlar `egitim`, diğerleri `test`. Özellik adlarını `ozellikler` listesine yaz. Son eğitim hedefini ve ilk test hedefini yazdır.
5. Test döneminde **saf öngörünün** (`enf_g0`) ve eğitim verisiyle standartlaştırıp kurduğun **51 değişkenli EKK**'nın kök HKO'sunu hesapla: `kok_hko_saf`, `kok_hko_ekk`.

**Denetim soruları:** Hedef `shift(-1)` mi? Özelliklerde negatif kaydırma var mı? Kesim hedef ayına göre mi (Aralık 2014 satırının hedefi Ocak 2015'tir)? Tarih metninden `pd.Timedelta` çıkarılıyor mu (`TypeError`; önce `pd.Timestamp`)? Bölmede karıştırma var mı? Eksik aylar doldurulmuş mu?""",
        taskA_code="# Görev A: Gemini ile kodu burada üret, oku, sonra çalıştır.\n",
        checkA_md="### Kontrol A — çalıştır, değiştirme",
        checkA="kontrol_A(tablo, egitim, test, kok_hko_saf, kok_hko_ekk)",
        taskB="""## Görev B — Lasso

1. `StandardScaler` ile `Lasso(max_iter=50000)`'yu `make_pipeline` ile bir `Pipeline`'a koy: ölçekleme her doğrulama katında yalnızca o katın eğitim kısmından öğrenilsin.
2. λ'yı `GridSearchCV(boru, {"lasso__alpha": np.logspace(-4, 0.5, 60)}, cv=TimeSeriesSplit(5), scoring="neg_mean_squared_error")` ile seç; arama nesnesini `arama` değişkenine ata ve `egitim[ozellikler]`, `egitim["hedef"]` ile `fit` et (arama bitince seçilen λ ile tüm eğitim verisinde yeniden kurulur).
3. `arama.predict(test[ozellikler])` ile test kök HKO'sunu hesapla, `kok_hko_lasso`'ya ata ve saf öngörüyle karşılaştır.
4. Son modelin (`arama.best_estimator_[-1]`) katsayısı sıfırdan farklı özelliklerini `secilenler` listesine yaz; mutlak değere göre ilk 8'ini katsayılarıyla yazdır.

**Denetim soruları:** Ölçekleyici katların içinde mi? `cv` ne? `scoring` açıkça HKO mu? Seçilen değişkenler iktisadi olarak ne anlatıyor (baz etkisi: `aylik_g11`)?""",
        taskB_code="# Görev B: Gemini ile kodu burada üret, oku, sonra çalıştır.\n",
        checkB_md="### Kontrol B — çalıştır, değiştirme",
        checkB="kontrol_B(arama, kok_hko_lasso, secilenler, egitim, test)",
        notes="""## Denetim notların

- Gemini hedefi ve bölmeyi nasıl kurdu? Değiştirmen gerekti mi?
- Ölçekleme ve çapraz doğrulama nasıl yapıldı?
- Lasso saf öngörüyü ne kadar geçiyor? Hangi veri kesitiyle (indirme zamanı, son hedef ayı)? Hangi değişkenler seçildi, ne anlama geliyor?
- Kontroller neyi sınamadı? (ör. yayın takvimi, veri revizyonları)""",
    ),
    "en": dict(
        title="# ML Lab · Module 3, Unit 9: Forecasting inflation",
        intro="""**Prof. Dr. Mehmet Songur** · ML Lab, Module 3

Data: 13 monthly US series (FRED). The setup cell prepares a monthly table `G` (index: date). Columns: `inf` (annual inflation, %), `monthly` (monthly inflation, %), the annual change of 7 series (`CPILFESL`, `PPIACO`, `M2SL`, `WTISPLC`, `AHETPI`, `PAYEMS`, `INDPRO`), the level of 4 series (`UNRATE`, `FEDFUNDS`, `T10Y3MM`, `UMCSENT`) and `HOUST` (log). **Have Gemini write the code**, then **audit it**.

**Before you start:** to edit this notebook opened from GitHub, choose **File → Save a copy in Drive** and work in the copy that opens.

**Rules and order**
1. Do not change the **Setup** and **Check** cells; just run them.
2. Generate code with Gemini in the task cells; read it before running. Gemini may add its code as a new cell below the comment; run the cells in order.
3. When the task code runs without errors, run the matching **Check** cell. If it reports a problem, fix it and rerun the task cell and the check.
4. If a check passes, it gives you a **completion code**; paste it and the task code into the box in ML Lab.

> **Data vintage:** the setup cell prints the download time and each series' last month. With live FRED data the numbers may differ slightly from the Lab's; to work on a fixed vintage use the `LAST_MONTH` setting in the setup cell (change only that line).
>
> **Retrospective experiment:** there is no CPI for October 2025 (the US federal government shutdown); don't fill missing months, leave out the rows that contain them. For simplicity we assume “this month's data are known at month end”; in reality CPI is published in the middle of the following month, and the other series have their own publication lags and revisions. A real-time forecast must use the data vintages known on the forecast date (ALFRED).""",
        setup_title="#@title Setup — run it, do not change it",
        after_setup='\nprint("G table:", G.shape)\nG.tail(3).round(2)',
        taskA="""## Task A — Problem and benchmark

1. **Features:** for every column of `G` except `monthly`, its values lagged 0, 1 and 2 months (`{column}_l0`, `{column}_l1`, `{column}_l2`), and `monthly` lagged 0–11 months (`monthly_l0` … `monthly_l11`): 51 in total.
2. **Target:** next month's annual inflation, a column called `target`: `G["inf"].shift(-1)`.
3. Combine the features and the target in a table called `table`, start it at `1984-01-01` and drop rows with missing values. Then add the month the target belongs to: `table["target_month"] = table.index + pd.DateOffset(months=1)` (the index is the feature month).
4. **Split by target month:** rows whose `target_month` is before `pd.Timestamp("2015-01-01")` → `train`, the rest → `test`. Put the feature names in a `features` list. Print the last training target and the first test target.
5. Over the test period, compute the RMSE of the **naive forecast** (`inf_l0`) and of a **51-variable OLS** standardised and fitted on the training data: `rmse_naive`, `rmse_ols`.

**Audit questions:** Is the target `shift(-1)`? Any negative shifts in the features? Is the cut-off by target month (the December 2014 row's target is January 2015)? Is a `pd.Timedelta` subtracted from a date string (`TypeError`; use `pd.Timestamp` first)? Any shuffling in the split? Were missing months filled?""",
        taskA_code="# Task A: generate the code with Gemini here, read it, then run it.\n",
        checkA_md="### Check A — run it, do not change it",
        checkA="check_A(table, train, test, rmse_naive, rmse_ols)",
        taskB="""## Task B — Lasso

1. Put `StandardScaler` and `Lasso(max_iter=50000)` in a `Pipeline` with `make_pipeline`: in each validation fold the scaling should be learned from that fold's training part only.
2. Choose λ with `GridSearchCV(pipe, {"lasso__alpha": np.logspace(-4, 0.5, 60)}, cv=TimeSeriesSplit(5), scoring="neg_mean_squared_error")`; store the search object in `search` and `fit` it on `train[features]`, `train["target"]` (after the search it is refitted on all training data with the chosen λ).
3. Compute the test RMSE with `search.predict(test[features])`, store it in `rmse_lasso` and compare it with the naive forecast.
4. Put the final model's (`search.best_estimator_[-1]`) features with non-zero coefficients in a `selected` list; print the top 8 by absolute value with their coefficients.

**Audit questions:** Is the scaler inside the folds? What is `cv`? Is `scoring` explicitly MSE? What do the selected variables say economically (base effect: `monthly_l11`)?""",
        taskB_code="# Task B: generate the code with Gemini here, read it, then run it.\n",
        checkB_md="### Check B — run it, do not change it",
        checkB="check_B(search, rmse_lasso, selected, train, test)",
        notes="""## Your audit notes

- How did Gemini build the target and the split? Did you need to change it?
- How were scaling and cross-validation done?
- By how much does Lasso beat the naive forecast? With which data vintage (download time, last target month)? Which variables were selected, and what do they mean?
- What did the checks not test? (e.g. release calendars, data revisions)""",
    ),
}


def workshop(lang):
    L = T[lang]
    return nb([
        ("markdown", L["title"] + "\n\n" + L["intro"]),
        ("code", L["setup_title"] + "\n" + SETUP[lang] + L["after_setup"]),
        ("markdown", L["taskA"]), ("code", L["taskA_code"]),
        ("markdown", L["checkA_md"]), ("code", L["checkA"]),
        ("markdown", L["taskB"]), ("code", L["taskB_code"]),
        ("markdown", L["checkB_md"]), ("code", L["checkB"]),
        ("markdown", L["notes"]),
    ])


if __name__ == "__main__":
    files = {
        "modul3/09_enflasyon_ongoru_atolyesi_tr.ipynb": workshop("tr"),
        "module3/09_inflation_forecasting_workshop_en.ipynb": workshop("en"),
    }
    for rel, data in files.items():
        p = os.path.join(OUT, rel)
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=1)
        print("yazıldı:", rel)
    print("hash A:", fnv(CODES["A"]), "hash B:", fnv(CODES["B"]))
