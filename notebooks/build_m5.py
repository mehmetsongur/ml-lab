"""ML Laboratuvarı — Modül 5 Colab notebook üretici (TR/EN).
Çıktı: modul5/*.ipynb (TR) ve module5/*.ipynb (EN).
Veri: UCI "Default of Credit Card Clients" (Yeh ve Lien, 2009; CC BY 4.0), bu deponun data/credit/ klasöründen."""
import os, json
from build_notebooks import nb, b64, OUT
from build_m4 import fnv

CODES = {"A": "ML5-BST-6QRM", "B": "ML5-SHP-9XKD"}
URL = "https://raw.githubusercontent.com/mehmetsongur/ml-lab/main/data/credit/taiwan_default.csv"

COMMON = '''
import base64, subprocess, sys, warnings
try:
    import shap
except ImportError:
    subprocess.run([sys.executable, "-m", "pip", "install", "-q", "shap"], check=True)
    import shap
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import roc_auc_score
warnings.filterwarnings("ignore")
'''

SETUP = {
    "tr": COMMON + '''
kredi = pd.read_csv("''' + URL + '''")
print("kredi:", kredi.shape, "| temerrüt oranı:", round(kredi["default"].mean(), 3), "| shap", shap.__version__)
_E, _T = train_test_split(kredi.copy(), test_size=0.3, random_state=0, stratify=kredi["default"])
_SUTUN = [c for c in kredi.columns if c not in ("default", "sex", "marriage")]
_ADAY = [100, 200, 400, 800]

def _k(s):
    return base64.b64decode(s).decode()

def _hgb(n):
    return HistGradientBoostingClassifier(max_iter=n, learning_rate=0.05, max_leaf_nodes=8, early_stopping=False, random_state=1)

def kontrol_A(egitim, test, X_e, X_t, secilen_n, model, p_test, auc_test):
    if len(test) != len(_T) or set(test.index) != set(_T.index) or set(egitim.index) != set(_E.index):
        print("❌ Bölme beklenenden farklı: train_test_split(kredi, test_size=0.3, random_state=0, stratify=kredi['default'])."); return
    if {"sex", "marriage"} & set(X_e.columns):
        print("❌ Korunan özellikler (sex, marriage) modelde. Bunları dışarıda bırak."); return
    if "default" in X_e.columns:
        print("❌ Hedef ('default') özelliklerin içinde: hedef sızıntısı."); return
    if set(X_e.columns) != set(_SUTUN) or list(X_t.columns) != list(X_e.columns):
        print("❌ Özellikler beklenenden farklı: default, sex ve marriage dışındaki bütün ham sütunlar, eğitim ve testte aynı sırayla."); return
    if not isinstance(model, HistGradientBoostingClassifier):
        print("❌ model bir HistGradientBoostingClassifier olmalı."); return
    if model.early_stopping is not False:
        print("❌ early_stopping açık: model ağaç sayısını eğitim verisinden ayırdığı bir parçayla kendisi seçiyor. early_stopping=False yap."); return
    if model.learning_rate != 0.05 or model.max_leaf_nodes != 8:
        print("❌ Ayarlar beklenenden farklı: learning_rate=0.05, max_leaf_nodes=8."); return
    print("Kontrol: ağaç sayısı adayları eğitim verisinde çapraz doğrulanıyor (birkaç saniye)…")
    cv = {n: cross_val_score(_hgb(n), X_e, egitim["default"], cv=5, scoring="roc_auc").mean() for n in _ADAY}
    ref = max(cv, key=cv.get)
    if int(secilen_n) != ref:
        tst = {n: roc_auc_score(test["default"], _hgb(n).fit(X_e, egitim["default"]).predict_proba(X_t)[:, 1]) for n in _ADAY}
        if int(secilen_n) == max(tst, key=tst.get):
            print(f"❌ Ağaç sayısı ({secilen_n}) test verisinde seçilmiş. Seçimi eğitim verisinde cross_val_score(..., cv=5, scoring='roc_auc') ile yap."); return
        print(f"❌ Seçilen ağaç sayısı ({secilen_n}) beklenenden farklı. Adaylar {_ADAY}, eğitim verisinde 5 katlı çapraz doğrulama, ölçü roc_auc."); return
    if model.max_iter != int(secilen_n):
        print("❌ model, seçilen ağaç sayısıyla (max_iter=secilen_n) kurulmamış."); return
    p = np.asarray(p_test, dtype=float)
    if len(p) != len(test) or len(np.unique(p)) <= 2:
        print("❌ p_test olasılık değil. predict yerine predict_proba(...)[:, 1] kullan."); return
    if not np.allclose(p, model.predict_proba(X_t)[:, 1]):
        print("❌ p_test, modelin X_t için verdiği temerrüt olasılıklarıyla uyuşmuyor."); return
    a = roc_auc_score(test["default"], p)
    if abs(float(auc_test) - a) > 1e-6:
        print("❌ auc_test, roc_auc_score(test['default'], p_test) ile uyuşmuyor."); return
    print(f"✅ Tüm kontroller geçti (ağaç sayısı {ref}, test AUC ≈ {a:.3f}; Modül 4'ün lojistik regresyonu 0,762). Tamamlama kodun: " + _k("''' + b64(CODES["A"]) + '''"))

def kontrol_B(model, X_t, sv, taban, onem):
    Xs = X_t.iloc[:2000]
    sv = np.asarray(sv)
    if sv.shape != Xs.shape:
        print(f"❌ sv'nin boyutu {sv.shape}; ilk 2.000 test müşterisi için {Xs.shape} olmalı (X_t.iloc[:2000])."); return
    fark = np.abs(float(taban) + sv.sum(1) - model.decision_function(Xs)).max()
    if fark > 1e-6:
        print(f"❌ Toplama özelliği tutmuyor (en büyük fark {fark:.2g}): taban + sv.sum(1), model.decision_function(X_t.iloc[:2000]) ile aynı olmalı. taban için shap.TreeExplainer(model).expected_value kullan."); return
    ref = shap.TreeExplainer(model).shap_values(Xs)
    if not np.allclose(sv, ref, atol=1e-6):
        print("❌ sv, shap.TreeExplainer(model).shap_values(X_t.iloc[:2000]) ile uyuşmuyor."); return
    if not isinstance(onem, pd.Series) or set(onem.index) != set(Xs.columns):
        print("❌ onem, indeksinde sütun adları olan bir pandas Series olmalı."); return
    beklenen = pd.Series(np.abs(sv).mean(0), index=Xs.columns)
    if not np.allclose(onem.reindex(beklenen.index).values, beklenen.values):
        print("❌ onem, her sütunun ortalama |SHAP| değeri olmalı: np.abs(sv).mean(axis=0)."); return
    if not onem.is_monotonic_decreasing:
        print("❌ onem büyükten küçüğe sıralı olmalı (sort_values(ascending=False))."); return
    print(f"✅ Tüm kontroller geçti (en önemli değişken {onem.index[0]}, ortalama |SHAP| {onem.iloc[0]:.2f}). Tamamlama kodun: " + _k("''' + b64(CODES["B"]) + '''"))
''',
    "en": COMMON + '''
credit = pd.read_csv("''' + URL + '''")
print("credit:", credit.shape, "| default rate:", round(credit["default"].mean(), 3), "| shap", shap.__version__)
_E, _T = train_test_split(credit.copy(), test_size=0.3, random_state=0, stratify=credit["default"])
_COLS = [c for c in credit.columns if c not in ("default", "sex", "marriage")]
_CAND = [100, 200, 400, 800]

def _k(s):
    return base64.b64decode(s).decode()

def _hgb(n):
    return HistGradientBoostingClassifier(max_iter=n, learning_rate=0.05, max_leaf_nodes=8, early_stopping=False, random_state=1)

def check_A(train, test, X_tr, X_te, n_chosen, model, p_test, auc_test):
    if len(test) != len(_T) or set(test.index) != set(_T.index) or set(train.index) != set(_E.index):
        print("❌ The split differs from the expected one: train_test_split(credit, test_size=0.3, random_state=0, stratify=credit['default'])."); return
    if {"sex", "marriage"} & set(X_tr.columns):
        print("❌ Protected attributes (sex, marriage) are in the model. Leave them out."); return
    if "default" in X_tr.columns:
        print("❌ The target ('default') is among the features: target leakage."); return
    if set(X_tr.columns) != set(_COLS) or list(X_te.columns) != list(X_tr.columns):
        print("❌ The features differ from the expected ones: every raw column except default, sex and marriage, in the same order in training and test."); return
    if not isinstance(model, HistGradientBoostingClassifier):
        print("❌ model should be a HistGradientBoostingClassifier."); return
    if model.early_stopping is not False:
        print("❌ early_stopping is on: the model chooses the number of trees itself with a part it sets aside from the training data. Set early_stopping=False."); return
    if model.learning_rate != 0.05 or model.max_leaf_nodes != 8:
        print("❌ The settings differ from the expected ones: learning_rate=0.05, max_leaf_nodes=8."); return
    print("Check: cross-validating the candidate numbers of trees on the training data (a few seconds)…")
    cv = {n: cross_val_score(_hgb(n), X_tr, train["default"], cv=5, scoring="roc_auc").mean() for n in _CAND}
    ref = max(cv, key=cv.get)
    if int(n_chosen) != ref:
        tst = {n: roc_auc_score(test["default"], _hgb(n).fit(X_tr, train["default"]).predict_proba(X_te)[:, 1]) for n in _CAND}
        if int(n_chosen) == max(tst, key=tst.get):
            print(f"❌ The number of trees ({n_chosen}) was chosen on the test data. Choose it on the training data with cross_val_score(..., cv=5, scoring='roc_auc')."); return
        print(f"❌ The chosen number of trees ({n_chosen}) differs from the expected one. Candidates {_CAND}, 5-fold cross-validation on the training data, metric roc_auc."); return
    if model.max_iter != int(n_chosen):
        print("❌ model was not fitted with the chosen number of trees (max_iter=n_chosen)."); return
    p = np.asarray(p_test, dtype=float)
    if len(p) != len(test) or len(np.unique(p)) <= 2:
        print("❌ p_test is not a probability. Use predict_proba(...)[:, 1] instead of predict."); return
    if not np.allclose(p, model.predict_proba(X_te)[:, 1]):
        print("❌ p_test does not match the model's default probabilities for X_te."); return
    a = roc_auc_score(test["default"], p)
    if abs(float(auc_test) - a) > 1e-6:
        print("❌ auc_test does not match roc_auc_score(test['default'], p_test)."); return
    print(f"✅ All checks passed (number of trees {ref}, test AUC ≈ {a:.3f}; Module 4's logistic regression 0.762). Your completion code: " + _k("''' + b64(CODES["A"]) + '''"))

def check_B(model, X_te, sv, base, importance):
    Xs = X_te.iloc[:2000]
    sv = np.asarray(sv)
    if sv.shape != Xs.shape:
        print(f"❌ sv has shape {sv.shape}; for the first 2,000 test customers it should be {Xs.shape} (X_te.iloc[:2000])."); return
    gap = np.abs(float(base) + sv.sum(1) - model.decision_function(Xs)).max()
    if gap > 1e-6:
        print(f"❌ Additivity does not hold (largest gap {gap:.2g}): base + sv.sum(1) should equal model.decision_function(X_te.iloc[:2000]). For base use shap.TreeExplainer(model).expected_value."); return
    ref = shap.TreeExplainer(model).shap_values(Xs)
    if not np.allclose(sv, ref, atol=1e-6):
        print("❌ sv does not match shap.TreeExplainer(model).shap_values(X_te.iloc[:2000])."); return
    if not isinstance(importance, pd.Series) or set(importance.index) != set(Xs.columns):
        print("❌ importance should be a pandas Series with the column names in its index."); return
    expected = pd.Series(np.abs(sv).mean(0), index=Xs.columns)
    if not np.allclose(importance.reindex(expected.index).values, expected.values):
        print("❌ importance should be each column's mean |SHAP|: np.abs(sv).mean(axis=0)."); return
    if not importance.is_monotonic_decreasing:
        print("❌ importance should be sorted from largest to smallest (sort_values(ascending=False))."); return
    print(f"✅ All checks passed (most important variable {importance.index[0]}, mean |SHAP| {importance.iloc[0]:.2f}). Your completion code: " + _k("''' + b64(CODES["B"]) + '''"))
''',
}

T = {
    "tr": dict(
        title="# ML Laboratuvarı · Modül 5, Ünite 9: Boosting ve SHAP",
        intro="""**Prof. Dr. Mehmet Songur** · ML Laboratuvarı, Modül 5

Veri: Tayvan'da bir bankanın 30.000 kredi kartı müşterisi (UCI, Yeh ve Lien 2009, CC BY 4.0). Kurulum hücresi `kredi` adlı tabloyu indirir ve gerekirse `shap` kütüphanesini kurar. Hedef `default`: Ekim 2005'te temerrüt (1). Ağaçlar ödeme kodlarını (`pay_0` … `pay_6`) ham hâlleriyle kullanabilir; korunan özellikler (`sex`, `marriage`) dışarıda kalır. Kodu **Gemini'ye yazdır**, sonra **denetle**.

**Kurallar**
1. **Kurulum** ve **Kontrol** hücrelerini değiştirme; yalnızca çalıştır.
2. Görev hücrelerinde kodu Gemini ile üret; çalıştırmadan önce oku.
3. Kontrol hücresi geçerse bir **tamamlama kodu** verir; onu ML Laboratuvarı'ndaki kutuya yapıştır.""",
        setup_title="#@title Kurulum — çalıştır, değiştirme",
        after_setup="\nkredi.head(3)",
        taskA="""## Görev A — Boosting

1. `kredi`'yi `train_test_split(kredi, test_size=0.3, random_state=0, stratify=kredi["default"])` ile `egitim` ve `test` olarak böl.
2. Özellikler: `X_e` ve `X_t`, `default`, `sex` ve `marriage` dışındaki bütün sütunlar (ham hâlleriyle).
3. `HistGradientBoostingClassifier(learning_rate=0.05, max_leaf_nodes=8, early_stopping=False, random_state=1)` için `max_iter` adaylarını `[100, 200, 400, 800]` **yalnızca eğitim verisinde** `cross_val_score(..., cv=5, scoring="roc_auc")` ortalamasıyla karşılaştır; en iyisi `secilen_n`.
4. Modeli bu değerle eğitim verisinin tamamında kur: `model`. Test olasılıkları `p_test`, test AUC'si `auc_test`. Modül 4'teki lojistik regresyonun 0,762'siyle karşılaştır.

**Denetim soruları:** sex ve marriage dışarıda mı? Ağaç sayısı test verisiyle mi seçildi? `early_stopping=False` mı?""",
        taskA_code="# Görev A: Gemini ile kodu burada üret, oku, sonra çalıştır.\n",
        checkA_md="### Kontrol A — çalıştır, değiştirme (yarım dakika kadar sürebilir)",
        checkA="kontrol_A(egitim, test, X_e, X_t, secilen_n, model, p_test, auc_test)",
        taskB="""## Görev B — SHAP

1. `ex = shap.TreeExplainer(model)` ile ilk 2.000 test müşterisinin SHAP değerlerini hesapla: `sv = ex.shap_values(X_t.iloc[:2000])`. Taban değer `taban = float(np.ravel(ex.expected_value)[0])`.
2. Toplama özelliğini sına: `taban + sv.sum(1)` ile `model.decision_function(X_t.iloc[:2000])` arasındaki en büyük fark.
3. `onem`: her sütunun ortalama |SHAP| değeri, sütun adlarıyla, büyükten küçüğe sıralı bir pandas Series.
4. En önemli değişken için `shap.dependence_plot(onem.index[0], sv, X_t.iloc[:2000])` çiz ve bir cümleyle yorumla. İstersen bir müşterinin şelale grafiğini de çiz: `shap.plots.waterfall(ex(X_t.iloc[:2000])[0])`.

**Denetim soruları:** Katkılar hangi ölçekte (log-odds mu, olasılık mı)? Gemini'nin yorumu “model bu değişkene dayanıyor” mu diyor, yoksa “bu değişken temerrüde yol açıyor” mu?""",
        taskB_code="# Görev B: Gemini ile kodu burada üret, oku, sonra çalıştır.\n",
        checkB_md="### Kontrol B — çalıştır, değiştirme",
        checkB="kontrol_B(model, X_t, sv, taban, onem)",
        notes="""## Denetim notların

- Gemini ağaç sayısını nasıl seçti? Değiştirmen gerekti mi?
- Boosting lojistik regresyona göre ne kazandırdı? Bu fark bir kararı değiştirir mi?
- SHAP sonuçlarını bir kredi komitesine nasıl anlatırsın? (en önemli değişkenler, log-odds ölçeği, nedensellik değil, adillik)""",
    ),
    "en": dict(
        title="# ML Lab · Module 5, Unit 9: Boosting and SHAP",
        intro="""**Prof. Dr. Mehmet Songur** · ML Lab, Module 5

Data: 30,000 credit card customers of a bank in Taiwan (UCI, Yeh and Lien 2009, CC BY 4.0). The setup cell downloads a table called `credit` and installs the `shap` library if needed. The target `default`: default in October 2005 (1). Trees can use the payment codes (`pay_0` … `pay_6`) in raw form; the protected attributes (`sex`, `marriage`) are left out. **Have Gemini write the code**, then **audit it**.

**Rules**
1. Do not change the **Setup** and **Check** cells; just run them.
2. Generate code with Gemini in the task cells; read it before running.
3. If a check cell passes, it gives you a **completion code**; paste it into the box in ML Lab.""",
        setup_title="#@title Setup — run it, do not change it",
        after_setup="\ncredit.head(3)",
        taskA="""## Task A — Boosting

1. Split `credit` into `train` and `test` with `train_test_split(credit, test_size=0.3, random_state=0, stratify=credit["default"])`.
2. Features: `X_tr` and `X_te`, every column except `default`, `sex` and `marriage` (in raw form).
3. For `HistGradientBoostingClassifier(learning_rate=0.05, max_leaf_nodes=8, early_stopping=False, random_state=1)`, compare the `max_iter` candidates `[100, 200, 400, 800]` by the mean of `cross_val_score(..., cv=5, scoring="roc_auc")` **on the training data only**; the best is `n_chosen`.
4. Fit the model with this value on all of the training data: `model`. Test probabilities `p_test`, test AUC `auc_test`. Compare with Module 4's logistic regression, 0.762.

**Audit questions:** Are sex and marriage left out? Was the number of trees chosen with the test data? Is `early_stopping=False`?""",
        taskA_code="# Task A: generate the code with Gemini here, read it, then run it.\n",
        checkA_md="### Check A — run it, do not change it (it may take about half a minute)",
        checkA="check_A(train, test, X_tr, X_te, n_chosen, model, p_test, auc_test)",
        taskB="""## Task B — SHAP

1. With `ex = shap.TreeExplainer(model)` compute the SHAP values of the first 2,000 test customers: `sv = ex.shap_values(X_te.iloc[:2000])`. Base value `base = float(np.ravel(ex.expected_value)[0])`.
2. Test additivity: the largest gap between `base + sv.sum(1)` and `model.decision_function(X_te.iloc[:2000])`.
3. `importance`: each column's mean |SHAP|, as a pandas Series with the column names, sorted from largest to smallest.
4. Draw `shap.dependence_plot(importance.index[0], sv, X_te.iloc[:2000])` for the most important variable and interpret it in one sentence. If you like, also draw one customer's waterfall plot: `shap.plots.waterfall(ex(X_te.iloc[:2000])[0])`.

**Audit questions:** On which scale are the contributions (log-odds or probability)? Does Gemini's interpretation say “the model relies on this variable” or “this variable causes default”?""",
        taskB_code="# Task B: generate the code with Gemini here, read it, then run it.\n",
        checkB_md="### Check B — run it, do not change it",
        checkB="check_B(model, X_te, sv, base, importance)",
        notes="""## Your audit notes

- How did Gemini choose the number of trees? Did you need to change anything?
- What did boosting gain over logistic regression? Would this gap change a decision?
- How would you explain the SHAP results to a credit committee? (most important variables, log-odds scale, not causality, fairness)""",
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
        "modul5/09_agaclar_shap_atolyesi_tr.ipynb": workshop("tr"),
        "module5/09_trees_shap_workshop_en.ipynb": workshop("en"),
    }
    for rel, data in files.items():
        p = os.path.join(OUT, rel)
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=1)
        print("yazıldı:", rel)
    print("hash A:", fnv(CODES["A"]), "hash B:", fnv(CODES["B"]))
