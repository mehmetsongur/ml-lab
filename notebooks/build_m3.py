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


SETUP = {
    "tr": '''
import io, base64, urllib.request, warnings
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression, LassoCV
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import TimeSeriesSplit, KFold
warnings.filterwarnings("ignore")
''' + FRED_HELPER["tr"] + '''
kodlar = ''' + repr(KODLAR) + '''
ham = pd.concat([fred_indir(k).set_index("tarih") for k in kodlar], axis=1).sort_index().asfreq("MS")
G = pd.DataFrame(index=ham.index)
G["enf"] = ham["CPIAUCSL"].pct_change(12, fill_method=None) * 100     # yıllık enflasyon (%)
G["aylik"] = ham["CPIAUCSL"].pct_change(1, fill_method=None) * 100    # aylık enflasyon (%)
for k in ["CPILFESL", "PPIACO", "M2SL", "WTISPLC", "AHETPI", "PAYEMS", "INDPRO"]:
    G[k] = ham[k].pct_change(12, fill_method=None) * 100              # yıllık değişim (%)
for k in ["UNRATE", "FEDFUNDS", "T10Y3MM", "UMCSENT"]:
    G[k] = ham[k]                                                      # düzey
G["HOUST"] = np.log(ham["HOUST"])                                      # konut başlangıcı (log)
_G = G.copy()
BASLA, KESIM = pd.Timestamp("1984-01-01"), pd.Timestamp("2015-01-01")

def _k(s):
    return base64.b64decode(s).decode()

def _referans():
    oz = {}
    for k in _G.columns:
        if k != "aylik":
            for g in range(3):
                oz[f"{k}_g{g}"] = _G[k].shift(g)
    for g in range(12):
        oz[f"aylik_g{g}"] = _G["aylik"].shift(g)
    X = pd.DataFrame(oz)
    t = pd.concat([X, _G["enf"].shift(-1).rename("hedef")], axis=1).loc[BASLA:].dropna()
    e, s = t.loc[:KESIM - pd.Timedelta(days=1)], t.loc[KESIM:]
    c = list(X.columns)
    kh = lambda a, b: float(np.sqrt(np.mean((np.asarray(a) - np.asarray(b)) ** 2)))
    sc = StandardScaler().fit(e[c])
    ekk = LinearRegression().fit(sc.transform(e[c]), e["hedef"])
    las = LassoCV(alphas=np.logspace(-4, 0.5, 60), cv=TimeSeriesSplit(5), max_iter=50000).fit(sc.transform(e[c]), e["hedef"])
    return dict(n_test=len(s), saf=kh(s["enf_g0"], s["hedef"]), ekk=kh(ekk.predict(sc.transform(s[c])), s["hedef"]),
                lasso=kh(las.predict(sc.transform(s[c])), s["hedef"]))

def kontrol_A(tablo, egitim, test, kok_hko_saf, kok_hko_ekk):
    if "hedef" not in tablo.columns:
        print("❌ 'tablo' içinde 'hedef' adlı bir sütun bulunamadı."); return
    h = tablo["hedef"]
    if np.allclose(h.values, _G["enf"].reindex(h.index).values, equal_nan=True):
        print("❌ Hedef kaydırılmamış: 'hedef' bu ayın enflasyonu. Gelecek ayın değeri için shift(-1) gerekir (hedef sızıntısı)."); return
    if not np.allclose(h.values, _G["enf"].shift(-1).reindex(h.index).values, equal_nan=True):
        print("❌ 'hedef' gelecek ayın yıllık enflasyonu (enf.shift(-1)) ile uyuşmuyor. Hedef farklı kurulmuş ya da eksik aylar doldurulmuş olabilir."); return
    if tablo.isna().sum().sum() > 0:
        print("❌ Tabloda eksik değer var; eksik ayları içeren satırlar dışarıda bırakılmalı (dropna)."); return
    if len(tablo.columns) - 1 != 51:
        print(f"❌ 51 özellik bekleniyordu, {len(tablo.columns) - 1} var. Tarifi yeniden oku: 13 seri × 3 gecikme + aylık enflasyonun 12 gecikmesi."); return
    if not egitim.index.is_monotonic_increasing or not test.index.is_monotonic_increasing or egitim.index.max() >= KESIM or test.index.min() < KESIM:
        print("❌ Bölme zamana göre değil: eğitim 2015 öncesi, test 2015 ve sonrası olmalı; karıştırma olmamalı."); return
    r = _referans()
    if len(test) > r["n_test"]:
        print("❌ Test döneminde beklenenden fazla ay var: eksik aylar doldurulmuş olabilir. Doldurma; dışarıda bırak."); return
    if egitim.index.min() > BASLA + pd.Timedelta(days=40):
        print("❌ Eğitim verisi 1984'ten başlamıyor."); return
    if abs(float(kok_hko_saf) - r["saf"]) > 0.005:
        print("❌ Saf öngörünün kök HKO'su beklenenden farklı. Öngörü 'bu ayın yıllık enflasyonu' (enf_g0) mı, hedefle mi karşılaştırıldı?"); return
    if abs(float(kok_hko_ekk) - r["ekk"]) > 0.02:
        print("❌ EKK'nın test kök HKO'su beklenenden farklı. 51 özelliğin hepsi kullanıldı mı? Model yalnızca eğitimle mi kuruldu?"); return
    print(f"✅ Tüm kontroller geçti (saf ≈ {r['saf']:.3f}, EKK ≈ {r['ekk']:.3f}). Tamamlama kodun: " + _k("''' + b64(CODES["A"]) + '''"))

def kontrol_B(lasso, kok_hko_lasso, secilenler):
    if isinstance(getattr(lasso, "cv", None), KFold) or not isinstance(getattr(lasso, "cv", None), TimeSeriesSplit):
        print("❌ λ zamana saygılı çapraz doğrulamayla seçilmemiş. cv=TimeSeriesSplit(5) kullan; karıştırılmış KFold geleceği gösterir."); return
    r = _referans()
    if abs(float(kok_hko_lasso) - r["lasso"]) > 0.01:
        print("❌ Lasso'nun test kök HKO'su beklenenden farklı. Ölçekleyici yalnızca eğitim verisiyle mi kuruldu? alphas ızgarası ve max_iter isteğe uygun mu?"); return
    nz = int(np.sum(np.abs(lasso.coef_) > 0))
    if len(secilenler) != nz:
        print(f"❌ 'secilenler' {len(secilenler)} öğe içeriyor, ama sıfırdan farklı katsayı sayısı {nz}. Negatif katsayıları da say (coef_ != 0)."); return
    if "aylik_g11" not in secilenler:
        print("ℹ️ Bilgi: aylik_g11 (baz etkisi) listede yok; özellik adlarını kontrol et.")
    print(f"✅ Tüm kontroller geçti (Lasso ≈ {r['lasso']:.3f}, saf ≈ {r['saf']:.3f}). Tamamlama kodun: " + _k("''' + b64(CODES["B"]) + '''"))
''',
    "en": '''
import io, base64, urllib.request, warnings
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression, LassoCV
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import TimeSeriesSplit, KFold
warnings.filterwarnings("ignore")
''' + FRED_HELPER["en"] + '''
codes = ''' + repr(KODLAR) + '''
raw = pd.concat([fred_download(k).set_index("date") for k in codes], axis=1).sort_index().asfreq("MS")
G = pd.DataFrame(index=raw.index)
G["inf"] = raw["CPIAUCSL"].pct_change(12, fill_method=None) * 100     # annual inflation (%)
G["monthly"] = raw["CPIAUCSL"].pct_change(1, fill_method=None) * 100  # monthly inflation (%)
for k in ["CPILFESL", "PPIACO", "M2SL", "WTISPLC", "AHETPI", "PAYEMS", "INDPRO"]:
    G[k] = raw[k].pct_change(12, fill_method=None) * 100              # annual change (%)
for k in ["UNRATE", "FEDFUNDS", "T10Y3MM", "UMCSENT"]:
    G[k] = raw[k]                                                      # level
G["HOUST"] = np.log(raw["HOUST"])                                      # housing starts (log)
_G = G.copy()
START, CUT = pd.Timestamp("1984-01-01"), pd.Timestamp("2015-01-01")

def _k(s):
    return base64.b64decode(s).decode()

def _reference():
    ft = {}
    for k in _G.columns:
        if k != "monthly":
            for g in range(3):
                ft[f"{k}_l{g}"] = _G[k].shift(g)
    for g in range(12):
        ft[f"monthly_l{g}"] = _G["monthly"].shift(g)
    X = pd.DataFrame(ft)
    t = pd.concat([X, _G["inf"].shift(-1).rename("target")], axis=1).loc[START:].dropna()
    e, s = t.loc[:CUT - pd.Timedelta(days=1)], t.loc[CUT:]
    c = list(X.columns)
    r = lambda a, b: float(np.sqrt(np.mean((np.asarray(a) - np.asarray(b)) ** 2)))
    sc = StandardScaler().fit(e[c])
    ols = LinearRegression().fit(sc.transform(e[c]), e["target"])
    las = LassoCV(alphas=np.logspace(-4, 0.5, 60), cv=TimeSeriesSplit(5), max_iter=50000).fit(sc.transform(e[c]), e["target"])
    return dict(n_test=len(s), naive=r(s["inf_l0"], s["target"]), ols=r(ols.predict(sc.transform(s[c])), s["target"]),
                lasso=r(las.predict(sc.transform(s[c])), s["target"]))

def check_A(table, train, test, rmse_naive, rmse_ols):
    if "target" not in table.columns:
        print("❌ No column called 'target' in 'table'."); return
    h = table["target"]
    if np.allclose(h.values, _G["inf"].reindex(h.index).values, equal_nan=True):
        print("❌ The target is not shifted: 'target' is this month's inflation. Next month's value needs shift(-1) (target leakage)."); return
    if not np.allclose(h.values, _G["inf"].shift(-1).reindex(h.index).values, equal_nan=True):
        print("❌ 'target' does not match next month's annual inflation (inf.shift(-1)). The target may be built differently or missing months may have been filled."); return
    if table.isna().sum().sum() > 0:
        print("❌ The table has missing values; rows with missing months should be left out (dropna)."); return
    if len(table.columns) - 1 != 51:
        print(f"❌ 51 features expected, found {len(table.columns) - 1}. Re-read the recipe: 13 series × 3 lags + 12 lags of monthly inflation."); return
    if not train.index.is_monotonic_increasing or not test.index.is_monotonic_increasing or train.index.max() >= CUT or test.index.min() < CUT:
        print("❌ The split is not by time: training before 2015, test 2015 onwards; no shuffling."); return
    r = _reference()
    if len(test) > r["n_test"]:
        print("❌ The test period has more months than expected: missing months may have been filled. Don't fill; leave them out."); return
    if train.index.min() > START + pd.Timedelta(days=40):
        print("❌ The training data do not start in 1984."); return
    if abs(float(rmse_naive) - r["naive"]) > 0.005:
        print("❌ The naive forecast's RMSE differs from the expected value. Is the forecast 'this month's annual inflation' (inf_l0), compared with the target?"); return
    if abs(float(rmse_ols) - r["ols"]) > 0.02:
        print("❌ OLS's test RMSE differs from the expected value. Were all 51 features used? Was the model built on training data only?"); return
    print(f"✅ All checks passed (naive ≈ {r['naive']:.3f}, OLS ≈ {r['ols']:.3f}). Your completion code: " + _k("''' + b64(CODES["A"]) + '''"))

def check_B(lasso, rmse_lasso, selected):
    if isinstance(getattr(lasso, "cv", None), KFold) or not isinstance(getattr(lasso, "cv", None), TimeSeriesSplit):
        print("❌ λ was not chosen with time-respecting cross-validation. Use cv=TimeSeriesSplit(5); shuffled KFold shows the future."); return
    r = _reference()
    if abs(float(rmse_lasso) - r["lasso"]) > 0.01:
        print("❌ Lasso's test RMSE differs from the expected value. Was the scaler fitted on training data only? Do the alphas grid and max_iter match the prompt?"); return
    nz = int(np.sum(np.abs(lasso.coef_) > 0))
    if len(selected) != nz:
        print(f"❌ 'selected' has {len(selected)} items, but there are {nz} non-zero coefficients. Count negative coefficients too (coef_ != 0)."); return
    if "monthly_l11" not in selected:
        print("ℹ️ Note: monthly_l11 (base effect) is not on the list; check the feature names.")
    print(f"✅ All checks passed (Lasso ≈ {r['lasso']:.3f}, naive ≈ {r['naive']:.3f}). Your completion code: " + _k("''' + b64(CODES["B"]) + '''"))
''',
}

T = {
    "tr": dict(
        title="# ML Laboratuvarı · Modül 3, Ünite 9: Enflasyonu öngörmek",
        intro="""**Prof. Dr. Mehmet Songur** · ML Laboratuvarı, Modül 3

Veri: 13 aylık ABD serisi (FRED). Kurulum hücresi `G` adlı aylık bir tablo hazırlar (indeks: tarih). Sütunlar: `enf` (yıllık enflasyon, %), `aylik` (aylık enflasyon, %), 7 serinin yıllık değişimi (`CPILFESL`, `PPIACO`, `M2SL`, `WTISPLC`, `AHETPI`, `PAYEMS`, `INDPRO`), 4 serinin düzeyi (`UNRATE`, `FEDFUNDS`, `T10Y3MM`, `UMCSENT`) ve `HOUST` (log). Kodu **Gemini'ye yazdır**, sonra **denetle**.

**Kurallar**
1. **Kurulum** ve **Kontrol** hücrelerini değiştirme; yalnızca çalıştır.
2. Görev hücrelerinde kodu Gemini ile üret; çalıştırmadan önce oku.
3. Kontrol hücresi geçerse bir **tamamlama kodu** verir; onu ML Laboratuvarı'ndaki kutuya yapıştır.

> Not: Ekim 2025'in TÜFE verisi yok (ABD federal hükümetinin kapanması). Eksik ayları doldurma; içeren satırları dışarıda bırak. Basitlik için “bu ayın verisi ay sonunda biliniyor” varsayıyoruz; gerçekte TÜFE bir sonraki ayın ortasında yayımlanır.""",
        setup_title="#@title Kurulum — çalıştır, değiştirme",
        after_setup='\nprint("G tablosu:", G.shape)\nG.tail(3).round(2)',
        taskA="""## Görev A — Problem ve kıyas ölçütü

1. **Özellikler:** `G`'nin `aylik` dışındaki her sütunu için 0, 1 ve 2 ay gecikmeli değerler (`{sütun}_g0`, `{sütun}_g1`, `{sütun}_g2`) ve `aylik`'in 0–11 ay gecikmeli değerleri (`aylik_g0` … `aylik_g11`): toplam 51.
2. **Hedef:** gelecek ayın yıllık enflasyonu, `hedef` adlı sütun: `G["enf"].shift(-1)`.
3. Özellikleri ve hedefi `tablo` adlı bir tabloda birleştir, `1984-01-01`'den başlat ve eksik değerli satırları at.
4. **Zamana göre böl:** `2015-01-01` öncesi `egitim`, sonrası `test`. Özellik adlarını `ozellikler` listesine yaz.
5. Test döneminde **saf öngörünün** (`enf_g0`) ve eğitim verisiyle standartlaştırıp kurduğun **51 değişkenli EKK**'nın kök HKO'sunu hesapla: `kok_hko_saf`, `kok_hko_ekk`.

**Denetim soruları:** Hedef `shift(-1)` mi? Özelliklerde negatif kaydırma var mı? Bölmede karıştırma var mı? Eksik aylar doldurulmuş mu?""",
        taskA_code="# Görev A: Gemini ile kodu burada üret, oku, sonra çalıştır.\n",
        checkA_md="### Kontrol A — çalıştır, değiştirme",
        checkA="kontrol_A(tablo, egitim, test, kok_hko_saf, kok_hko_ekk)",
        taskB="""## Görev B — Lasso

1. `StandardScaler`'ı **yalnızca** `egitim[ozellikler]` ile kur; test verisine yalnızca `transform` uygula.
2. `LassoCV(alphas=np.logspace(-4, 0.5, 60), cv=TimeSeriesSplit(5), max_iter=50000)` ile λ'yı seç; modeli `lasso` değişkenine ata.
3. Test kök HKO'sunu `kok_hko_lasso`'ya ata ve saf öngörüyle karşılaştır.
4. Katsayısı sıfırdan farklı özellikleri `secilenler` listesine yaz; mutlak değere göre ilk 8'ini katsayılarıyla yazdır.

**Denetim soruları:** Ölçekleyici neyle kuruldu? `cv` ne? Seçilen değişkenler iktisadi olarak ne anlatıyor (baz etkisi: `aylik_g11`)?""",
        taskB_code="# Görev B: Gemini ile kodu burada üret, oku, sonra çalıştır.\n",
        checkB_md="### Kontrol B — çalıştır, değiştirme",
        checkB="kontrol_B(lasso, kok_hko_lasso, secilenler)",
        notes="""## Denetim notların

- Gemini hedefi ve bölmeyi nasıl kurdu? Değiştirmen gerekti mi?
- Ölçekleme ve çapraz doğrulama nasıl yapıldı?
- Lasso saf öngörüyü ne kadar geçiyor? Hangi değişkenler seçildi, ne anlama geliyor?""",
    ),
    "en": dict(
        title="# ML Lab · Module 3, Unit 9: Forecasting inflation",
        intro="""**Prof. Dr. Mehmet Songur** · ML Lab, Module 3

Data: 13 monthly US series (FRED). The setup cell prepares a monthly table `G` (index: date). Columns: `inf` (annual inflation, %), `monthly` (monthly inflation, %), the annual change of 7 series (`CPILFESL`, `PPIACO`, `M2SL`, `WTISPLC`, `AHETPI`, `PAYEMS`, `INDPRO`), the level of 4 series (`UNRATE`, `FEDFUNDS`, `T10Y3MM`, `UMCSENT`) and `HOUST` (log). **Have Gemini write the code**, then **audit it**.

**Rules**
1. Do not change the **Setup** and **Check** cells; just run them.
2. Generate code with Gemini in the task cells; read it before running.
3. If a check cell passes, it gives you a **completion code**; paste it into the box in ML Lab.

> Note: there is no CPI for October 2025 (the US federal government shutdown). Don't fill missing months; leave out the rows that contain them. For simplicity we assume “this month's data are known at month end”; in reality CPI is published in the middle of the following month.""",
        setup_title="#@title Setup — run it, do not change it",
        after_setup='\nprint("G table:", G.shape)\nG.tail(3).round(2)',
        taskA="""## Task A — Problem and benchmark

1. **Features:** for every column of `G` except `monthly`, its values lagged 0, 1 and 2 months (`{column}_l0`, `{column}_l1`, `{column}_l2`), and `monthly` lagged 0–11 months (`monthly_l0` … `monthly_l11`): 51 in total.
2. **Target:** next month's annual inflation, a column called `target`: `G["inf"].shift(-1)`.
3. Combine the features and the target in a table called `table`, start it at `1984-01-01` and drop rows with missing values.
4. **Split by time:** before `2015-01-01` → `train`, from then on → `test`. Put the feature names in a `features` list.
5. Over the test period, compute the RMSE of the **naive forecast** (`inf_l0`) and of a **51-variable OLS** standardised and fitted on the training data: `rmse_naive`, `rmse_ols`.

**Audit questions:** Is the target `shift(-1)`? Any negative shifts in the features? Any shuffling in the split? Were missing months filled?""",
        taskA_code="# Task A: generate the code with Gemini here, read it, then run it.\n",
        checkA_md="### Check A — run it, do not change it",
        checkA="check_A(table, train, test, rmse_naive, rmse_ols)",
        taskB="""## Task B — Lasso

1. Fit `StandardScaler` on `train[features]` **only**; apply only `transform` to the test data.
2. Choose λ with `LassoCV(alphas=np.logspace(-4, 0.5, 60), cv=TimeSeriesSplit(5), max_iter=50000)`; store the model in `lasso`.
3. Store the test RMSE in `rmse_lasso` and compare it with the naive forecast.
4. Put the features with non-zero coefficients in a `selected` list; print the top 8 by absolute value with their coefficients.

**Audit questions:** What was the scaler fitted on? What is `cv`? What do the selected variables say economically (base effect: `monthly_l11`)?""",
        taskB_code="# Task B: generate the code with Gemini here, read it, then run it.\n",
        checkB_md="### Check B — run it, do not change it",
        checkB="check_B(lasso, rmse_lasso, selected)",
        notes="""## Your audit notes

- How did Gemini build the target and the split? Did you need to change it?
- How were scaling and cross-validation done?
- By how much does Lasso beat the naive forecast? Which variables were selected, and what do they mean?""",
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
