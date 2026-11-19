"""ML Laboratuvarı — Modül 4 Colab notebook üretici (TR/EN).
Çıktı: modul4/*.ipynb (TR) ve module4/*.ipynb (EN).
Veri: UCI "Default of Credit Card Clients" (Yeh ve Lien, 2009; CC BY 4.0), bu deponun data/credit/ klasöründen."""
import os, json
from build_notebooks import nb, b64, OUT

CODES = {"A": "ML4-KRD-8NWT", "B": "ML4-ESK-3HJV"}
URL = "https://raw.githubusercontent.com/mehmetsongur/ml-lab/main/data/credit/taiwan_default.csv"


def fnv(s):
    x = 0x811c9dc5
    for ch in s:
        x ^= ord(ch); x = (x * 0x01000193) & 0xFFFFFFFF
    return f"{x:08x}"


SETUP = {
    "tr": '''
import base64, warnings
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline, make_pipeline
from sklearn.model_selection import train_test_split, cross_val_predict
from sklearn.metrics import roc_auc_score
from sklearn.base import clone
from sklearn.exceptions import ConvergenceWarning
warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("always", category=ConvergenceWarning)   # yakınsama uyarısı görünür kalır / convergence warnings stay visible

kredi = pd.read_csv("''' + URL + '''")
print("kredi:", kredi.shape, "| temerrüt oranı:", round(kredi["default"].mean(), 3))
_K = kredi.copy()
_E, _T = train_test_split(_K, test_size=0.3, random_state=0, stratify=_K["default"])

def _k(s):
    return base64.b64decode(s).decode()

def _maliyet(y, p, e):
    k = p >= e
    return (5 * np.sum(~k & (y == 1)) + np.sum(k & (y == 0))) / len(y)

def _son_adim(model):
    return model.steps[-1][1] if isinstance(model, Pipeline) else model

_DURUM = ["pay_0", "pay_2", "pay_3", "pay_4", "pay_5", "pay_6"]

def _ref_hazirla(df):
    X = df.drop(columns=["default", "sex", "marriage"]).copy()
    for k in _DURUM:
        X[k + "_gecikme"] = X[k].clip(lower=0); X[k + "_tam"] = (X[k] == -1).astype(int); X[k + "_yok"] = (X[k] == -2).astype(int)
        X = X.drop(columns=[k])
    for k in [c for c in X.columns if "amt" in c]:
        X[k] = np.sign(X[k]) * np.log1p(np.abs(X[k]))
    return X

def _ornek():
    o = _K.head(3).copy()
    o[_DURUM] = [[-2, -1, 0, 2, 1, 3], [0, 4, -2, -1, 0, 1], [1, -2, -1, 0, 5, -2]]   # her kod türü
    o["bill_amt1"] = [-1500, 0, 82000]; o["pay_amt1"] = [0, 2500, 17]                  # işaretli tutarlar
    return o

def _dogrula(hazirla):
    v = pd.concat([_ornek(), _E.head(3000)])
    Xs, Xr = hazirla(v.copy()), _ref_hazirla(v)
    if len(Xs) != len(Xr):
        return "satır sayısı değişmiş", None
    S = {c: np.asarray(Xs[c], dtype=float) for c in Xs.columns if pd.api.types.is_numeric_dtype(Xs[c])}
    eslesen, eksik = set(), []
    for c in Xr.columns:
        r = Xr[c].to_numpy(dtype=float)
        m = next((sc for sc, sv in S.items() if sc not in eslesen and np.allclose(sv, r)), None)
        if m is None: eksik.append(c)
        else: eslesen.add(m)
    fazla = [c for c in Xs.columns if c not in eslesen]
    return eksik, fazla

def kontrol_A(egitim, test, hazirla, model, p_test, auc_test):
    if len(test) != len(_T) or set(test.index) != set(_T.index) or set(egitim.index) != set(_E.index):
        print("❌ Bölme beklenenden farklı: train_test_split(kredi, test_size=0.3, random_state=0, stratify=kredi['default'])."); return
    Xe = hazirla(egitim.copy())
    if {"sex", "marriage"} & set(Xe.columns):
        print("❌ Korunan özellikler (sex, marriage) modelde. Bunları dışarıda bırak."); return
    if "default" in Xe.columns:
        print("❌ Hedef ('default') özelliklerin içinde: hedef sızıntısı."); return
    ham = [k for k in _DURUM if k in Xe.columns]
    if ham:
        print(f"❌ Ödeme durumu kodları sayı olarak duruyor ({', '.join(ham)}). −2 ve −1 kategoridir: gecikme ayı, tam ödeme ve kullanılmama ayrı değişkenler olmalı."); return
    eksik, fazla = _dogrula(hazirla)
    if fazla is None:
        print("❌ hazirla() satır sayısını değiştirmiş; satır silme ya da çoğaltma olmamalı."); return
    if eksik or fazla:
        tutar = [c for c in eksik if "amt" in c]
        if any(str(c).startswith("pay_amt") and len(str(c)) > 8 for c in fazla):
            print("❌ pay_amt1–6 tutarları durum kodu gibi işlenmiş görünüyor (pay_ ile başlayan bütün sütunlar seçilmiş olabilir). Yalnızca pay_0, pay_2 … pay_6 kodlarını çöz; pay_amt tutarlarını koru ve işaretli log ile dönüştür.")
        elif tutar:
            print(f"❌ Şu tutarlar beklenen işaretli log dönüşümüyle uyuşmuyor: {', '.join(tutar[:6])}{' …' if len(tutar) > 6 else ''}. Dönüşüm sign(x)·log(1+|x|) olmalı.")
        else:
            print(f"❌ Özellikler beklenen 33 sütunla uyuşmuyor. Eksik ya da farklı hesaplanan: {', '.join(eksik[:6]) or '—'}; fazladan: {', '.join(map(str, fazla[:6])) or '—'}. Gecikme = değerin 0'ın altını 0'a kırp; tam = (değer == −1); yok = (değer == −2).")
        return
    if not isinstance(model, Pipeline) or not any(isinstance(s, StandardScaler) for _, s in model.steps):
        print("❌ Ölçekleme ve lojistik regresyon bir pipeline içinde değil (make_pipeline(StandardScaler(), LogisticRegression(...)))."); return
    son = _son_adim(model)
    if not isinstance(son, LogisticRegression):
        print("❌ Pipeline'ın son adımı LogisticRegression olmalı."); return
    if son.class_weight is not None:
        print("❌ class_weight kullanılmış: olasılıklar şişer ve artık temerrüt olasılığı değildir. class_weight'i kaldır."); return
    if son.C < 1e4:
        print("ℹ️ Bilgi: C küçük; lojistik regresyon belirgin biçimde cezalı. İstek C=1e6 idi (çok küçük ceza).")
    p = np.asarray(p_test, dtype=float)
    if len(p) != len(test) or len(np.unique(p)) <= 2:
        print("❌ p_test olasılık değil (yalnızca 0/1 içeriyor ya da uzunluğu yanlış). predict yerine predict_proba(...)[:, 1] kullan."); return
    if list(son.classes_) != [0, 1] or not np.allclose(p, model.predict_proba(hazirla(test.copy()))[:, 1]):
        print("❌ p_test, modelin hazirla(test) için verdiği temerrüt (1) olasılıklarıyla (predict_proba(...)[:, 1]) uyuşmuyor."); return
    a = roc_auc_score(test["default"], p)
    if abs(float(auc_test) - a) > 1e-6:
        print("❌ auc_test, roc_auc_score(test['default'], p_test) ile uyuşmuyor."); return
    if a < 0.75:
        print(f"❌ Test AUC {a:.3f}: beklenenden düşük (≈ 0,76)."); return
    print("Doğrulanan dönüşümler (33 özellik, örnek satırlarda −2, −1, 0, pozitif gecikme ve işaretli tutarlar dahil): 6 gecikme, 6 tam ödeme, 6 kullanılmama göstergesi, 12 işaretli log tutar, 3 diğer (limit_bal, education, age).")
    g = pd.qcut(p, 10, labels=range(1, 11))
    k = pd.DataFrame({"p": p, "y": test["default"].values}).groupby(g, observed=True).agg(n=("y", "size"), ortalama_olasilik=("p", "mean"), gerceklesen=("y", "mean"))
    print("Karşılaştırma için kalibrasyon tablosu (senin tablonla aynı olmalı):"); print(k.round(3).to_string())
    print(f"✅ Görev A kontrolleri geçti (test AUC ≈ {a:.3f}). Görev A tamamlama kodun: " + _k("''' + b64(CODES["A"]) + '''"))

def kontrol_B(egitim, test, hazirla, model, p_test, esik, maliyet_test):
    izgara = np.round(np.arange(0.05, 0.71, 0.01), 2)
    ye, yt = egitim["default"].values, test["default"].values
    p_cv = cross_val_predict(clone(model), hazirla(egitim), ye, cv=5, method="predict_proba")[:, 1]
    ref = izgara[np.argmin([_maliyet(ye, p_cv, e) for e in izgara])]
    tst = izgara[np.argmin([_maliyet(yt, np.asarray(p_test), e) for e in izgara])]
    e = float(esik)
    if abs(e - ref) > 0.006:
        if abs(e - tst) < 0.006 and abs(tst - ref) > 0.006:
            print(f"❌ Eşik test verisinde seçilmiş ({e:.2f}). Eşiği eğitim verisinde cross_val_predict olasılıklarıyla seç."); return
        print(f"❌ Eşik ({e:.2f}) beklenenden farklı. Maliyetler: kaçan temerrüt 5, reddedilen iyi müşteri 1; ızgara 0,05–0,70; eğitimde cv=5 (karıştırmasız) ile cross_val_predict."); return
    m = _maliyet(yt, np.asarray(p_test), e)
    if abs(float(maliyet_test) - m) > 0.002:
        print("❌ maliyet_test beklenenden farklı: test verisinde, seçilen eşikle başvuru başına ortalama maliyet (5·YN + YP) / n olmalı."); return
    pt = np.asarray(p_test)
    print(f"Izgaradan (0,01 adım) eğitimde seçilen eşik {e:.2f}: test maliyeti {m:.4f}")
    print(f"Önceden belirlenen tam 1/6 = 0,1667: test maliyeti {_maliyet(yt, pt, 1 / 6):.4f}  ·  eşik 0,5: {_maliyet(yt, pt, 0.5):.4f}  ·  herkesi onayla: {_maliyet(yt, pt, 2):.4f}")
    print("Not: tek bir saklı testteki küçük bir fark, bir eşiğin genel üstünlüğünün kanıtı değildir.")
    print("✅ Görev B kontrolleri geçti. Görev B tamamlama kodun: " + _k("''' + b64(CODES["B"]) + '''"))
''',
    "en": '''
import base64, warnings
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline, make_pipeline
from sklearn.model_selection import train_test_split, cross_val_predict
from sklearn.metrics import roc_auc_score
from sklearn.base import clone
from sklearn.exceptions import ConvergenceWarning
warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("always", category=ConvergenceWarning)   # yakınsama uyarısı görünür kalır / convergence warnings stay visible

credit = pd.read_csv("''' + URL + '''")
print("credit:", credit.shape, "| default rate:", round(credit["default"].mean(), 3))
_K = credit.copy()
_E, _T = train_test_split(_K, test_size=0.3, random_state=0, stratify=_K["default"])

def _k(s):
    return base64.b64decode(s).decode()

def _cost(y, p, e):
    k = p >= e
    return (5 * np.sum(~k & (y == 1)) + np.sum(k & (y == 0))) / len(y)

def _last_step(model):
    return model.steps[-1][1] if isinstance(model, Pipeline) else model

_STATUS = ["pay_0", "pay_2", "pay_3", "pay_4", "pay_5", "pay_6"]

def _ref_prepare(df):
    X = df.drop(columns=["default", "sex", "marriage"]).copy()
    for k in _STATUS:
        X[k + "_delay"] = X[k].clip(lower=0); X[k + "_full"] = (X[k] == -1).astype(int); X[k + "_none"] = (X[k] == -2).astype(int)
        X = X.drop(columns=[k])
    for k in [c for c in X.columns if "amt" in c]:
        X[k] = np.sign(X[k]) * np.log1p(np.abs(X[k]))
    return X

def _example():
    o = _K.head(3).copy()
    o[_STATUS] = [[-2, -1, 0, 2, 1, 3], [0, 4, -2, -1, 0, 1], [1, -2, -1, 0, 5, -2]]   # every code type
    o["bill_amt1"] = [-1500, 0, 82000]; o["pay_amt1"] = [0, 2500, 17]                  # signed amounts
    return o

def _verify(prepare):
    v = pd.concat([_example(), _E.head(3000)])
    Xs, Xr = prepare(v.copy()), _ref_prepare(v)
    if len(Xs) != len(Xr):
        return "row count changed", None
    S = {c: np.asarray(Xs[c], dtype=float) for c in Xs.columns if pd.api.types.is_numeric_dtype(Xs[c])}
    matched, missing = set(), []
    for c in Xr.columns:
        r = Xr[c].to_numpy(dtype=float)
        m = next((sc for sc, sv in S.items() if sc not in matched and np.allclose(sv, r)), None)
        if m is None: missing.append(c)
        else: matched.add(m)
    extra = [c for c in Xs.columns if c not in matched]
    return missing, extra

def check_A(train, test, prepare, model, p_test, auc_test):
    if len(test) != len(_T) or set(test.index) != set(_T.index) or set(train.index) != set(_E.index):
        print("❌ The split differs from the expected one: train_test_split(credit, test_size=0.3, random_state=0, stratify=credit['default'])."); return
    Xe = prepare(train.copy())
    if {"sex", "marriage"} & set(Xe.columns):
        print("❌ Protected attributes (sex, marriage) are in the model. Leave them out."); return
    if "default" in Xe.columns:
        print("❌ The target ('default') is among the features: target leakage."); return
    raw = [k for k in _STATUS if k in Xe.columns]
    if raw:
        print(f"❌ The payment status codes are still numbers ({', '.join(raw)}). −2 and −1 are categories: months of delay, full payment and non-use should be separate variables."); return
    missing, extra = _verify(prepare)
    if extra is None:
        print("❌ prepare() changed the number of rows; no rows should be dropped or duplicated."); return
    if missing or extra:
        amts = [c for c in missing if "amt" in c]
        if any(str(c).startswith("pay_amt") and len(str(c)) > 8 for c in extra):
            print("❌ The pay_amt1–6 amounts appear to have been treated as status codes (every column starting with pay_ may have been selected). Decode only pay_0, pay_2 … pay_6; keep the pay_amt amounts and apply the signed log.")
        elif amts:
            print(f"❌ These amounts do not match the expected signed log transform: {', '.join(amts[:6])}{' …' if len(amts) > 6 else ''}. The transform should be sign(x)·log(1+|x|).")
        else:
            print(f"❌ The features do not match the expected 33 columns. Missing or computed differently: {', '.join(missing[:6]) or '—'}; extra: {', '.join(map(str, extra[:6])) or '—'}. Delay = clip the value below at 0; full = (value == −1); none = (value == −2).")
        return
    if not isinstance(model, Pipeline) or not any(isinstance(s, StandardScaler) for _, s in model.steps):
        print("❌ Scaling and logistic regression are not in a pipeline (make_pipeline(StandardScaler(), LogisticRegression(...)))."); return
    last = _last_step(model)
    if not isinstance(last, LogisticRegression):
        print("❌ The pipeline's last step should be LogisticRegression."); return
    if last.class_weight is not None:
        print("❌ class_weight was used: the probabilities inflate and are no longer default probabilities. Remove class_weight."); return
    if last.C < 1e4:
        print("ℹ️ Info: C is small; the logistic regression is clearly penalised. The request was C=1e6 (a very small penalty).")
    p = np.asarray(p_test, dtype=float)
    if len(p) != len(test) or len(np.unique(p)) <= 2:
        print("❌ p_test is not a probability (only 0/1, or the wrong length). Use predict_proba(...)[:, 1] instead of predict."); return
    if list(last.classes_) != [0, 1] or not np.allclose(p, model.predict_proba(prepare(test.copy()))[:, 1]):
        print("❌ p_test does not match the model's default (1) probabilities for prepare(test) (predict_proba(...)[:, 1])."); return
    a = roc_auc_score(test["default"], p)
    if abs(float(auc_test) - a) > 1e-6:
        print("❌ auc_test does not match roc_auc_score(test['default'], p_test)."); return
    if a < 0.75:
        print(f"❌ Test AUC {a:.3f}: lower than expected (≈ 0.76)."); return
    print("Transformations verified (33 features, including example rows with −2, −1, 0, positive delays and signed amounts): 6 delay, 6 full-payment, 6 non-use indicators, 12 signed-log amounts, 3 others (limit_bal, education, age).")
    g = pd.qcut(p, 10, labels=range(1, 11))
    k = pd.DataFrame({"p": p, "y": test["default"].values}).groupby(g, observed=True).agg(n=("y", "size"), mean_probability=("p", "mean"), realised=("y", "mean"))
    print("Calibration table for comparison (yours should match):"); print(k.round(3).to_string())
    print(f"✅ Task A checks passed (test AUC ≈ {a:.3f}). Your Task A completion code: " + _k("''' + b64(CODES["A"]) + '''"))

def check_B(train, test, prepare, model, p_test, thr, cost_test):
    grid = np.round(np.arange(0.05, 0.71, 0.01), 2)
    ye, yt = train["default"].values, test["default"].values
    p_cv = cross_val_predict(clone(model), prepare(train), ye, cv=5, method="predict_proba")[:, 1]
    ref = grid[np.argmin([_cost(ye, p_cv, e) for e in grid])]
    tst = grid[np.argmin([_cost(yt, np.asarray(p_test), e) for e in grid])]
    e = float(thr)
    if abs(e - ref) > 0.006:
        if abs(e - tst) < 0.006 and abs(tst - ref) > 0.006:
            print(f"❌ The threshold was chosen on the test data ({e:.2f}). Choose it on the training data with cross_val_predict probabilities."); return
        print(f"❌ The threshold ({e:.2f}) differs from the expected one. Costs: missed default 5, rejected good customer 1; grid 0.05–0.70; cross_val_predict with cv=5 (no shuffling) on training."); return
    m = _cost(yt, np.asarray(p_test), e)
    if abs(float(cost_test) - m) > 0.002:
        print("❌ cost_test differs from the expected value: it should be the average cost per application (5·FN + FP) / n on the test data at the chosen threshold."); return
    pt = np.asarray(p_test)
    print(f"Threshold chosen on training from the grid (step 0.01) {e:.2f}: test cost {m:.4f}")
    print(f"Exact 1/6 = 0.1667 set in advance: test cost {_cost(yt, pt, 1 / 6):.4f}  ·  threshold 0.5: {_cost(yt, pt, 0.5):.4f}  ·  approve everyone: {_cost(yt, pt, 2):.4f}")
    print("Note: a small gap on a single held-out test is not evidence that one threshold is better in general.")
    print("✅ Task B checks passed. Your Task B completion code: " + _k("''' + b64(CODES["B"]) + '''"))
''',
}

T = {
    "tr": dict(
        title="# ML Laboratuvarı · Modül 4, Ünite 9: Kredi riski",
        intro="""**Prof. Dr. Mehmet Songur** · ML Laboratuvarı, Modül 4

Veri: Tayvan'da bir bankanın 30.000 kredi kartı müşterisi (UCI, Yeh ve Lien 2009, CC BY 4.0). Kurulum hücresi `kredi` adlı tabloyu indirir. Hedef `default`: Ekim 2005'te temerrüt (1). Sütunlar: `limit_bal` (kredi limiti), `sex`, `education`, `marriage`, `age`, `pay_0`, `pay_2` … `pay_6` (Eylül … Nisan ödeme durumu), `bill_amt1` … `bill_amt6` (ekstre tutarı), `pay_amt1` … `pay_amt6` (ödenen tutar). Kodu **Gemini'ye yazdır**, sonra **denetle**.

**Ödeme durumu kodları (`pay_0`, `pay_2` … `pay_6`):** UCI veri sözlüğü −1'i “zamanında ödeme”, 1, 2, …'yi “kaç ay gecikme” olarak tanımlar; −2 ve 0 için açıklama vermez. **Ders varsayımı** (literatürdeki yaygın yorum): −2 kart kullanılmadı, −1 borcun tamamı ödendi, 0 asgari ödeme yapıldı. `pay_amt1` … `pay_amt6` ise kod değil, tutardır. Kaynak: Yeh (2009), UCI, doi.org/10.24432/C55S3H.

**Başlamadan:** GitHub'dan açılan bu notebook'u düzenleyebilmek için **Dosya → Drive'a kopya kaydet**'i seç ve kopyada çalış.

**Akış ve kurallar**
1. **Kurulum** ve **Kontrol** hücrelerini değiştirme; yalnızca çalıştır.
2. Görev hücrelerinde kodu Gemini ile üret; çalıştırmadan önce oku. Gemini kodu yeni bir hücreye ekleyebilir; sırayla çalıştır.
3. Görev kodu hatasız çalışınca o görevin **Kontrol** hücresini çalıştır; hata gösterirse düzelt, görevi ve kontrolü yeniden çalıştır.
4. Kontrol geçerse bir **tamamlama kodu** verir: Görev A `ML4-KRD-…`, Görev B `ML4-ESK-…`. Kodu ve görev kodunu ML Laboratuvarı'ndaki ilgili kutuya yapıştır.

> **Kapsam:** Bu, 2005'teki mevcut kart müşterilerinde geriye dönük, tek dönemli bir kıyastır; yeni kredi başvuruları ya da sonraki aylar için ayrıca sınanmalıdır.""",
        setup_title="#@title Kurulum — çalıştır, değiştirme",
        after_setup="\nkredi.head(3)",
        taskA="""## Görev A — Model

1. `kredi`'yi `train_test_split(kredi, test_size=0.3, random_state=0, stratify=kredi["default"])` ile `egitim` ve `test` olarak böl.
2. `hazirla(df)` adlı bir fonksiyon yaz: `default`, `sex` ve `marriage` sütunlarını at; **yalnızca** `pay_0`, `pay_2` … `pay_6` durum kodlarının her biri için `_gecikme` (0'ın altı 0'a kırpılmış), `_tam` (değer −1 ise 1) ve `_yok` (değer −2 ise 1) değişkenlerini üret ve özgün durum sütununu sil (`pay_amt1–6` tutardır, ona dokunma); adında `amt` geçen 12 tutarı (`bill_amt1–6`, `pay_amt1–6`) işaretli log ile dönüştür: `sign(x)·log(1+|x|)`. Sonuç 33 özellik.
3. `make_pipeline(StandardScaler(), LogisticRegression(C=1e6, max_iter=5000))`'i yalnızca `hazirla(egitim)` ile kur: `model`.
4. Test olasılıkları `p_test = model.predict_proba(hazirla(test))[:, 1]` (ikinci sütun: `model.classes_` = [0, 1]), test AUC'si `auc_test`.
5. **Kalibrasyon tablosu:** `p_test`'i `pd.qcut` ile on gruba ayır; her grubun gözlem sayısını, ortalama olasılığını ve gerçekleşen temerrüt oranını yazdır.

**Denetim soruları:** sex ve marriage dışarıda mı? Yalnızca durum kodları mı çözülmüş (`pay_amt` tutarları değil)? 33 özellik mi var? Ölçekleyici pipeline içinde mi? AUC `predict_proba` ile mi hesaplandı? `class_weight` var mı?""",
        taskA_code="# Görev A: Gemini ile kodu burada üret, oku, sonra çalıştır.\n",
        checkA_md="### Kontrol A — çalıştır, değiştirme",
        checkA="kontrol_A(egitim, test, hazirla, model, p_test, auc_test)",
        taskB="""## Görev B — Maliyete göre eşik

Kaçan bir temerrüt (YN) 5, reddedilen iyi bir müşteri (YP) 1 birim maliyetli. Başvuru başına ortalama maliyet: (5·YN + YP) / n.

1. Eğitim verisinde `cross_val_predict(make_pipeline(StandardScaler(), LogisticRegression(C=1e6, max_iter=5000)), hazirla(egitim), egitim["default"], cv=5, method="predict_proba")[:, 1]` ile çapraz doğrulama olasılıklarını üret.
2. 0,05'ten 0,70'e 0,01 adımlı bir eşik ızgarasında eğitim maliyetini hesapla; en düşüğünü `esik` olarak seç.
3. Test verisinde, seçilen eşikle maliyeti hesapla: `maliyet_test`.
4. Ayrı satırlarda karşılaştır: “herkesi onayla”, eşik 0,5, ızgaradan seçilen eşik ve önceden belirlenen tam 1/6 (≈ 0,1667; 0,17 ile aynı değil).

**Denetim soruları:** Eşik test verisiyle mi seçildi? Izgara eşiği ile 1/6 arasındaki küçük maliyet farkı genellenebilir bir üstünlük mü, yoksa tek bir testin gürültüsü mü?""",
        taskB_code="# Görev B: Gemini ile kodu burada üret, oku, sonra çalıştır.\n",
        checkB_md="### Kontrol B — çalıştır, değiştirme (birkaç saniye sürebilir)",
        checkB="kontrol_B(egitim, test, hazirla, model, p_test, esik, maliyet_test)",
        notes="""## Denetim notların

- Gemini özellikleri nasıl hazırladı? Değiştirmen gerekti mi?
- Ölçekleme, AUC ve eşik seçimi nasıl yapıldı?
- Sonucu bir kredi komitesine nasıl anlatırsın? (AUC, gruplu kalibrasyon, eşik, maliyet; sınırlılıklar, kapsam ve adillik)""",
    ),
    "en": dict(
        title="# ML Lab · Module 4, Unit 9: Credit risk",
        intro="""**Prof. Dr. Mehmet Songur** · ML Lab, Module 4

Data: 30,000 credit card customers of a bank in Taiwan (UCI, Yeh and Lien 2009, CC BY 4.0). The setup cell downloads a table called `credit`. The target `default`: default in October 2005 (1). Columns: `limit_bal` (credit limit), `sex`, `education`, `marriage`, `age`, `pay_0`, `pay_2` … `pay_6` (payment status for September … April), `bill_amt1` … `bill_amt6` (statement amount), `pay_amt1` … `pay_amt6` (amount paid). **Have Gemini write the code**, then **audit it**.

**Payment status codes (`pay_0`, `pay_2` … `pay_6`):** the UCI data dictionary defines −1 as “pay duly” and 1, 2, … as “months of delay”; it gives no description for −2 and 0. **Course assumption** (the common reading in the literature): −2 card not used, −1 balance paid in full, 0 minimum payment made. `pay_amt1` … `pay_amt6`, by contrast, are amounts, not codes. Source: Yeh (2009), UCI, doi.org/10.24432/C55S3H.

**Before you start:** to edit this notebook opened from GitHub, choose **File → Save a copy in Drive** and work in the copy.

**Flow and rules**
1. Do not change the **Setup** and **Check** cells; just run them.
2. Generate code with Gemini in the task cells; read it before running. Gemini may add its code in a new cell; run the cells in order.
3. When the task code runs without errors, run that task's **Check** cell; if it reports a problem, fix it and rerun the task and the check.
4. If a check passes it gives a **completion code**: Task A `ML4-KRD-…`, Task B `ML4-ESK-…`. Paste it and the task code into the matching box in ML Lab.

> **Scope:** this is a retrospective, single-period comparison on existing card customers in 2005; it must be tested separately for new credit applications or later months.""",
        setup_title="#@title Setup — run it, do not change it",
        after_setup="\ncredit.head(3)",
        taskA="""## Task A — Model

1. Split `credit` into `train` and `test` with `train_test_split(credit, test_size=0.3, random_state=0, stratify=credit["default"])`.
2. Write a function `prepare(df)`: drop the `default`, `sex` and `marriage` columns; **only** for each status code `pay_0`, `pay_2` … `pay_6` create `_delay` (clipped below at 0), `_full` (1 if the value is −1) and `_none` (1 if the value is −2) and drop the original status column (`pay_amt1–6` are amounts; leave them alone); transform the 12 amounts whose names contain `amt` (`bill_amt1–6`, `pay_amt1–6`) with a signed log: `sign(x)·log(1+|x|)`. The result is 33 features.
3. Fit `make_pipeline(StandardScaler(), LogisticRegression(C=1e6, max_iter=5000))` on `prepare(train)` only: `model`.
4. Test probabilities `p_test = model.predict_proba(prepare(test))[:, 1]` (second column: `model.classes_` = [0, 1]), test AUC `auc_test`.
5. **Calibration table:** split `p_test` into ten groups with `pd.qcut`; print each group's count, mean probability and realised default rate.

**Audit questions:** Are sex and marriage left out? Are only the status codes decoded (not the `pay_amt` amounts)? Are there 33 features? Is the scaler inside the pipeline? Was AUC computed with `predict_proba`? Is there any `class_weight`?""",
        taskA_code="# Task A: generate the code with Gemini here, read it, then run it.\n",
        checkA_md="### Check A — run it, do not change it",
        checkA="check_A(train, test, prepare, model, p_test, auc_test)",
        taskB="""## Task B — A cost-based threshold

A missed default (FN) costs 5 units, a rejected good customer (FP) 1. Average cost per application: (5·FN + FP) / n.

1. On the training data, produce cross-validation probabilities with `cross_val_predict(make_pipeline(StandardScaler(), LogisticRegression(C=1e6, max_iter=5000)), prepare(train), train["default"], cv=5, method="predict_proba")[:, 1]`.
2. Compute the training cost on a threshold grid from 0.05 to 0.70 in steps of 0.01; choose the lowest as `thr`.
3. On the test data, compute the cost at the chosen threshold: `cost_test`.
4. Compare on separate rows: “approve everyone”, threshold 0.5, the grid threshold and the exact 1/6 set in advance (≈ 0.1667; not the same as 0.17).

**Audit questions:** Was the threshold chosen with the test data? Is the small cost gap between the grid threshold and 1/6 a general advantage, or the noise of a single test?""",
        taskB_code="# Task B: generate the code with Gemini here, read it, then run it.\n",
        checkB_md="### Check B — run it, do not change it (it may take a few seconds)",
        checkB="check_B(train, test, prepare, model, p_test, thr, cost_test)",
        notes="""## Your audit notes

- How did Gemini prepare the features? Did you need to change anything?
- How were scaling, AUC and the threshold choice done?
- How would you explain the result to a credit committee? (AUC, grouped calibration, threshold, cost; limitations, scope and fairness)""",
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
        "modul4/09_kredi_riski_atolyesi_tr.ipynb": workshop("tr"),
        "module4/09_credit_risk_workshop_en.ipynb": workshop("en"),
    }
    for rel, data in files.items():
        p = os.path.join(OUT, rel)
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=1)
        print("yazıldı:", rel)
    print("hash A:", fnv(CODES["A"]), "hash B:", fnv(CODES["B"]))
