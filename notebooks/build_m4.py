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
warnings.filterwarnings("ignore")

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

def kontrol_A(egitim, test, hazirla, model, p_test, auc_test):
    if len(test) != len(_T) or set(test.index) != set(_T.index) or set(egitim.index) != set(_E.index):
        print("❌ Bölme beklenenden farklı: train_test_split(kredi, test_size=0.3, random_state=0, stratify=kredi['default'])."); return
    Xe = hazirla(egitim)
    if {"sex", "marriage"} & set(Xe.columns):
        print("❌ Korunan özellikler (sex, marriage) modelde. Bunları dışarıda bırak."); return
    if "default" in Xe.columns:
        print("❌ Hedef ('default') özelliklerin içinde: hedef sızıntısı."); return
    ham = [k for k in ["pay_0", "pay_2", "pay_3", "pay_4", "pay_5", "pay_6"] if k in Xe.columns]
    if ham:
        print(f"❌ Ödeme durumu kodları sayı olarak duruyor ({', '.join(ham)}). −2 ve −1 kategoridir: gecikme ayı, tam ödeme ve kullanılmama ayrı değişkenler olmalı."); return
    if not isinstance(model, Pipeline) or not any(isinstance(s, StandardScaler) for _, s in model.steps):
        print("❌ Ölçekleme ve lojistik regresyon bir pipeline içinde değil (make_pipeline(StandardScaler(), LogisticRegression(...)))."); return
    son = _son_adim(model)
    if not isinstance(son, LogisticRegression):
        print("❌ Pipeline'ın son adımı LogisticRegression olmalı."); return
    if son.class_weight is not None:
        print("❌ class_weight kullanılmış: olasılıklar şişer ve artık temerrüt olasılığı değildir. class_weight'i kaldır."); return
    if son.C < 1e4:
        print("ℹ️ Bilgi: C küçük; lojistik regresyon cezalı. İstek C=1e6 idi.")
    p = np.asarray(p_test, dtype=float)
    if len(p) != len(test) or len(np.unique(p)) <= 2:
        print("❌ p_test olasılık değil (yalnızca 0/1 içeriyor ya da uzunluğu yanlış). predict yerine predict_proba(...)[:, 1] kullan."); return
    if not np.allclose(p, model.predict_proba(hazirla(test))[:, 1]):
        print("❌ p_test, modelin hazirla(test) için verdiği temerrüt olasılıklarıyla (predict_proba(...)[:, 1]) uyuşmuyor."); return
    a = roc_auc_score(test["default"], p)
    if abs(float(auc_test) - a) > 1e-6:
        print("❌ auc_test, roc_auc_score(test['default'], p_test) ile uyuşmuyor."); return
    if a < 0.75:
        print(f"❌ Test AUC {a:.3f}: beklenenden düşük (≈ 0,76). Kodlar doğru çözülmüş mü? Tutarlar işaretli log ile dönüştürülmüş mü?"); return
    print(f"✅ Tüm kontroller geçti (test AUC ≈ {a:.3f}). Tamamlama kodun: " + _k("''' + b64(CODES["A"]) + '''"))

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
    print(f"✅ Tüm kontroller geçti (eşik {e:.2f}, kuramsal 1/6 ≈ 0,17; test maliyeti {m:.3f}, herkesi onayla {_maliyet(yt, np.asarray(p_test), 2):.3f}). Tamamlama kodun: " + _k("''' + b64(CODES["B"]) + '''"))
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
warnings.filterwarnings("ignore")

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

def check_A(train, test, prepare, model, p_test, auc_test):
    if len(test) != len(_T) or set(test.index) != set(_T.index) or set(train.index) != set(_E.index):
        print("❌ The split differs from the expected one: train_test_split(credit, test_size=0.3, random_state=0, stratify=credit['default'])."); return
    Xe = prepare(train)
    if {"sex", "marriage"} & set(Xe.columns):
        print("❌ Protected attributes (sex, marriage) are in the model. Leave them out."); return
    if "default" in Xe.columns:
        print("❌ The target ('default') is among the features: target leakage."); return
    raw = [k for k in ["pay_0", "pay_2", "pay_3", "pay_4", "pay_5", "pay_6"] if k in Xe.columns]
    if raw:
        print(f"❌ The payment status codes are still numbers ({', '.join(raw)}). −2 and −1 are categories: months of delay, full payment and non-use should be separate variables."); return
    if not isinstance(model, Pipeline) or not any(isinstance(s, StandardScaler) for _, s in model.steps):
        print("❌ Scaling and logistic regression are not in a pipeline (make_pipeline(StandardScaler(), LogisticRegression(...)))."); return
    last = _last_step(model)
    if not isinstance(last, LogisticRegression):
        print("❌ The pipeline's last step should be LogisticRegression."); return
    if last.class_weight is not None:
        print("❌ class_weight was used: the probabilities inflate and are no longer default probabilities. Remove class_weight."); return
    if last.C < 1e4:
        print("ℹ️ Info: C is small; the logistic regression is penalised. The request was C=1e6.")
    p = np.asarray(p_test, dtype=float)
    if len(p) != len(test) or len(np.unique(p)) <= 2:
        print("❌ p_test is not a probability (it only contains 0/1 or has the wrong length). Use predict_proba(...)[:, 1] instead of predict."); return
    if not np.allclose(p, model.predict_proba(prepare(test))[:, 1]):
        print("❌ p_test does not match the model's default probabilities for prepare(test) (predict_proba(...)[:, 1])."); return
    a = roc_auc_score(test["default"], p)
    if abs(float(auc_test) - a) > 1e-6:
        print("❌ auc_test does not match roc_auc_score(test['default'], p_test)."); return
    if a < 0.75:
        print(f"❌ Test AUC {a:.3f}: lower than expected (≈ 0.76). Were the codes decoded correctly? Were the amounts transformed with a signed log?"); return
    print(f"✅ All checks passed (test AUC ≈ {a:.3f}). Your completion code: " + _k("''' + b64(CODES["A"]) + '''"))

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
    print(f"✅ All checks passed (threshold {e:.2f}, theoretical 1/6 ≈ 0.17; test cost {m:.3f}, approve everyone {_cost(yt, np.asarray(p_test), 2):.3f}). Your completion code: " + _k("''' + b64(CODES["B"]) + '''"))
''',
}

T = {
    "tr": dict(
        title="# ML Laboratuvarı · Modül 4, Ünite 9: Kredi riski",
        intro="""**Prof. Dr. Mehmet Songur** · ML Laboratuvarı, Modül 4

Veri: Tayvan'da bir bankanın 30.000 kredi kartı müşterisi (UCI, Yeh ve Lien 2009, CC BY 4.0). Kurulum hücresi `kredi` adlı tabloyu indirir. Hedef `default`: Ekim 2005'te temerrüt (1). Sütunlar: `limit_bal` (kredi limiti), `sex`, `education`, `marriage`, `age`, `pay_0`, `pay_2` … `pay_6` (Eylül … Nisan ödeme durumu), `bill_amt1` … `bill_amt6` (ekstre tutarı), `pay_amt1` … `pay_amt6` (ödenen tutar). Kodu **Gemini'ye yazdır**, sonra **denetle**.

**Ödeme durumu kodları:** −2 kart kullanılmadı, −1 borcun tamamı ödendi, 0 asgari ödeme yapıldı, 1, 2, … kaç ay gecikildiği. (−2 ve 0 verinin resmî açıklamasında yok; literatürdeki yaygın yorum.)

**Kurallar**
1. **Kurulum** ve **Kontrol** hücrelerini değiştirme; yalnızca çalıştır.
2. Görev hücrelerinde kodu Gemini ile üret; çalıştırmadan önce oku.
3. Kontrol hücresi geçerse bir **tamamlama kodu** verir; onu ML Laboratuvarı'ndaki kutuya yapıştır.""",
        setup_title="#@title Kurulum — çalıştır, değiştirme",
        after_setup="\nkredi.head(3)",
        taskA="""## Görev A — Model

1. `kredi`'yi `train_test_split(kredi, test_size=0.3, random_state=0, stratify=kredi["default"])` ile `egitim` ve `test` olarak böl.
2. `hazirla(df)` adlı bir fonksiyon yaz: `default`, `sex` ve `marriage` sütunlarını at; her `pay_` sütunu için `_gecikme` (0'ın altı 0'a kırpılmış), `_tam` (değer −1 ise 1) ve `_yok` (değer −2 ise 1) değişkenlerini üret ve özgün `pay_` sütununu sil; adında `amt` geçen tutarları işaretli log ile dönüştür: `sign(x)·log(1+|x|)`.
3. `make_pipeline(StandardScaler(), LogisticRegression(C=1e6, max_iter=5000))`'i yalnızca `hazirla(egitim)` ile kur: `model`.
4. Test olasılıkları `p_test = model.predict_proba(hazirla(test))[:, 1]`, test AUC'si `auc_test`.

**Denetim soruları:** sex ve marriage dışarıda mı? `pay_` kodları çözülmüş mü? Ölçekleyici pipeline içinde mi? AUC `predict_proba` ile mi hesaplandı? `class_weight` var mı?""",
        taskA_code="# Görev A: Gemini ile kodu burada üret, oku, sonra çalıştır.\n",
        checkA_md="### Kontrol A — çalıştır, değiştirme",
        checkA="kontrol_A(egitim, test, hazirla, model, p_test, auc_test)",
        taskB="""## Görev B — Maliyete göre eşik

Kaçan bir temerrüt (YN) 5, reddedilen iyi bir müşteri (YP) 1 birim maliyetli. Başvuru başına ortalama maliyet: (5·YN + YP) / n.

1. Eğitim verisinde `cross_val_predict(make_pipeline(StandardScaler(), LogisticRegression(C=1e6, max_iter=5000)), hazirla(egitim), egitim["default"], cv=5, method="predict_proba")[:, 1]` ile çapraz doğrulama olasılıklarını üret.
2. 0,05'ten 0,70'e 0,01 adımlı bir eşik ızgarasında eğitim maliyetini hesapla; en düşüğünü `esik` olarak seç.
3. Test verisinde, seçilen eşikle maliyeti hesapla: `maliyet_test`. “Herkesi onayla” ve eşik 0,5 ile karşılaştır.

**Denetim soruları:** Eşik test verisiyle mi seçildi? Seçilen eşik kuramsal eşiğe (1/6) yakın mı?""",
        taskB_code="# Görev B: Gemini ile kodu burada üret, oku, sonra çalıştır.\n",
        checkB_md="### Kontrol B — çalıştır, değiştirme (birkaç saniye sürebilir)",
        checkB="kontrol_B(egitim, test, hazirla, model, p_test, esik, maliyet_test)",
        notes="""## Denetim notların

- Gemini özellikleri nasıl hazırladı? Değiştirmen gerekti mi?
- Ölçekleme, AUC ve eşik seçimi nasıl yapıldı?
- Sonucu bir kredi komitesine nasıl anlatırsın? (AUC, kalibrasyon, eşik, maliyet; sınırlılıklar ve adillik)""",
    ),
    "en": dict(
        title="# ML Lab · Module 4, Unit 9: Credit risk",
        intro="""**Prof. Dr. Mehmet Songur** · ML Lab, Module 4

Data: 30,000 credit card customers of a bank in Taiwan (UCI, Yeh and Lien 2009, CC BY 4.0). The setup cell downloads a table called `credit`. The target `default`: default in October 2005 (1). Columns: `limit_bal` (credit limit), `sex`, `education`, `marriage`, `age`, `pay_0`, `pay_2` … `pay_6` (payment status for September … April), `bill_amt1` … `bill_amt6` (statement amount), `pay_amt1` … `pay_amt6` (amount paid). **Have Gemini write the code**, then **audit it**.

**Payment status codes:** −2 card not used, −1 balance paid in full, 0 minimum payment made, 1, 2, … months of delay. (−2 and 0 are not in the data's official description; this is the common reading in the literature.)

**Rules**
1. Do not change the **Setup** and **Check** cells; just run them.
2. Generate code with Gemini in the task cells; read it before running.
3. If a check cell passes, it gives you a **completion code**; paste it into the box in ML Lab.""",
        setup_title="#@title Setup — run it, do not change it",
        after_setup="\ncredit.head(3)",
        taskA="""## Task A — Model

1. Split `credit` into `train` and `test` with `train_test_split(credit, test_size=0.3, random_state=0, stratify=credit["default"])`.
2. Write a function `prepare(df)`: drop the `default`, `sex` and `marriage` columns; for each `pay_` column create `_delay` (clipped below at 0), `_full` (1 if the value is −1) and `_none` (1 if the value is −2) and drop the original `pay_` column; transform the amounts whose names contain `amt` with a signed log: `sign(x)·log(1+|x|)`.
3. Fit `make_pipeline(StandardScaler(), LogisticRegression(C=1e6, max_iter=5000))` on `prepare(train)` only: `model`.
4. Test probabilities `p_test = model.predict_proba(prepare(test))[:, 1]`, test AUC `auc_test`.

**Audit questions:** Are sex and marriage left out? Are the `pay_` codes decoded? Is the scaler inside the pipeline? Was AUC computed with `predict_proba`? Is there any `class_weight`?""",
        taskA_code="# Task A: generate the code with Gemini here, read it, then run it.\n",
        checkA_md="### Check A — run it, do not change it",
        checkA="check_A(train, test, prepare, model, p_test, auc_test)",
        taskB="""## Task B — A cost-based threshold

A missed default (FN) costs 5 units, a rejected good customer (FP) 1. Average cost per application: (5·FN + FP) / n.

1. On the training data, produce cross-validation probabilities with `cross_val_predict(make_pipeline(StandardScaler(), LogisticRegression(C=1e6, max_iter=5000)), prepare(train), train["default"], cv=5, method="predict_proba")[:, 1]`.
2. Compute the training cost on a threshold grid from 0.05 to 0.70 in steps of 0.01; choose the lowest as `thr`.
3. On the test data, compute the cost at the chosen threshold: `cost_test`. Compare with “approve everyone” and threshold 0.5.

**Audit questions:** Was the threshold chosen with the test data? Is the chosen threshold close to the theoretical one (1/6)?""",
        taskB_code="# Task B: generate the code with Gemini here, read it, then run it.\n",
        checkB_md="### Check B — run it, do not change it (it may take a few seconds)",
        checkB="check_B(train, test, prepare, model, p_test, thr, cost_test)",
        notes="""## Your audit notes

- How did Gemini prepare the features? Did you need to change anything?
- How were scaling, AUC and the threshold choice done?
- How would you explain the result to a credit committee? (AUC, calibration, threshold, cost; limitations and fairness)""",
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
