/* Modül 5 — ortak kod parçaları
 * Kredi dünyası, dersin 6. hafta notebook'undaki doğrusal olmayan dünyayla aynıdır (aynı tohum, aynı tarif, aynı sonuçlar).
 * Gerçek veri: UCI "Default of Credit Card Clients" (Yeh ve Lien, 2009; CC BY 4.0), data/credit/taiwan_default.csv.
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 */
(function () {
  "use strict";
  const D = (window.M5_DATA = {});

  D.WORLD = {
    tr: `import numpy as np
import warnings
warnings.filterwarnings("ignore")
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import KFold, cross_val_score
from sklearn.metrics import roc_auc_score
rng = np.random.default_rng(2026)
adlar = ["Borç/gelir", "Önceki gecikme", "Gelir", "Çalışma süresi", "Kart harcaması/gelir", "Yaş"]
def ciz(n):
    X = rng.normal(size=(n, 6))
    X[:, 1] = (rng.random(n) < 0.15).astype(float)            # önceki gecikme: 0/1
    X[:, 4] = 0.4 * X[:, 0] + np.sqrt(1 - 0.16) * X[:, 4]    # kart harcaması borçla ilişkili
    X[:, 5] = 0.5 * X[:, 3] + np.sqrt(0.75) * X[:, 5]        # yaş çalışma süresiyle ilişkili
    b, g, gel, cal, kart, yas = X.T
    lo = (-2.9 + 1.5 * (b > 0.7)                 # eşik: borç/gelir 0,7'yi aşınca risk sıçrıyor
          + 0.5 * g + 1.2 * g * (b > 0)          # etkileşim: gecikme, borcu yüksek olanlarda daha tehlikeli
          - 0.5 * gel + 0.35 * kart              # doğrusal etkiler
          + 0.8 * (cal < -0.8)                   # işe yeni başlayanlar riskli
          + 0.45 * (yas ** 2 - 1))               # U biçimi: çok genç ve çok yaşlılar riskli
    p = 1 / (1 + np.exp(-lo))
    return X, (rng.random(n) < p).astype(int), p
X_egt, y_egt, _ = ciz(3000)                 # eğitim: 3.000 geçmiş başvuru
X_tst, y_tst, p_gercek = ciz(20000)         # test: 20.000 yeni başvuru
kf = KFold(5, shuffle=True, random_state=1)`,
    en: `import numpy as np
import warnings
warnings.filterwarnings("ignore")
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import KFold, cross_val_score
from sklearn.metrics import roc_auc_score
rng = np.random.default_rng(2026)
names = ["Debt/income", "Past delinquency", "Income", "Years employed", "Card spending/income", "Age"]
def draw(n):
    X = rng.normal(size=(n, 6))
    X[:, 1] = (rng.random(n) < 0.15).astype(float)            # past delinquency: 0/1
    X[:, 4] = 0.4 * X[:, 0] + np.sqrt(1 - 0.16) * X[:, 4]    # card spending related to debt
    X[:, 5] = 0.5 * X[:, 3] + np.sqrt(0.75) * X[:, 5]        # age related to years employed
    b, g, inc, emp, card, age = X.T
    lo = (-2.9 + 1.5 * (b > 0.7)                 # threshold: risk jumps once debt/income exceeds 0.7
          + 0.5 * g + 1.2 * g * (b > 0)          # interaction: delinquency is more dangerous for high-debt applicants
          - 0.5 * inc + 0.35 * card              # linear effects
          + 0.8 * (emp < -0.8)                   # recent starters are risky
          + 0.45 * (age ** 2 - 1))               # U shape: the very young and the very old are risky
    p = 1 / (1 + np.exp(-lo))
    return X, (rng.random(n) < p).astype(int), p
X_tr, y_tr, _ = draw(3000)                  # training: 3,000 past applications
X_te, y_te, p_true = draw(20000)            # test: 20,000 new applications
kf = KFold(5, shuffle=True, random_state=1)`
  };

  /* Seçilen boosting modeli (6. haftadaki gibi: 100 ağaç, öğrenme oranı 0,05) */
  D.GB = {
    tr: `
gb = GradientBoostingClassifier(n_estimators=100, learning_rate=0.05, max_depth=3, subsample=0.8, random_state=1).fit(X_egt, y_egt)`,
    en: `
gb = GradientBoostingClassifier(n_estimators=100, learning_rate=0.05, max_depth=3, subsample=0.8, random_state=1).fit(X_tr, y_tr)`
  };

  /* Gerçek veri: Tayvan kart müşterileri (Modül 4'teki bölme ve özellik hazırlığı) */
  D.TW = {
    tr: `import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings("ignore")
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score
kredi = pd.read_csv("credit/taiwan_default.csv")      # 30.000 kart müşterisi; hedef: 'default' (Ekim 2005)
egitim, test = train_test_split(kredi, test_size=0.3, random_state=0, stratify=kredi["default"])
y_e, y_t = egitim["default"], test["default"]
def ham(df):                                          # ağaçlar için: kodlar olduğu gibi, korunan özellikler dışarıda
    return df.drop(columns=["default", "sex", "marriage"])
def hazirla(df):                                      # lojistik regresyon için: Modül 4'teki hazırlık
    X = ham(df).copy()
    for k in ["pay_0", "pay_2", "pay_3", "pay_4", "pay_5", "pay_6"]:
        X[k + "_gecikme"] = X[k].clip(lower=0)
        X[k + "_tam"] = (X[k] == -1).astype(int)
        X[k + "_yok"] = (X[k] == -2).astype(int)
        X = X.drop(columns=[k])
    for k in [c for c in X.columns if "amt" in c]:
        X[k] = np.sign(X[k]) * np.log1p(np.abs(X[k]))
    return X`,
    en: `import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings("ignore")
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score
credit = pd.read_csv("credit/taiwan_default.csv")     # 30,000 card customers; target: 'default' (October 2005)
train, test = train_test_split(credit, test_size=0.3, random_state=0, stratify=credit["default"])
y_tr, y_te = train["default"], test["default"]
def raw(df):                                          # for trees: codes as they are, protected attributes left out
    return df.drop(columns=["default", "sex", "marriage"])
def prepare(df):                                      # for logistic regression: the Module 4 preparation
    X = raw(df).copy()
    for k in ["pay_0", "pay_2", "pay_3", "pay_4", "pay_5", "pay_6"]:
        X[k + "_delay"] = X[k].clip(lower=0)
        X[k + "_full"] = (X[k] == -1).astype(int)
        X[k + "_none"] = (X[k] == -2).astype(int)
        X = X.drop(columns=[k])
    for k in [c for c in X.columns if "amt" in c]:
        X[k] = np.sign(X[k]) * np.log1p(np.abs(X[k]))
    return X`
  };

  /* Dört model (Ünite 8) */
  D.TWM = {
    tr: `
logit = make_pipeline(StandardScaler(), LogisticRegression(C=1e6, max_iter=5000)).fit(hazirla(egitim), y_e)
agac = DecisionTreeClassifier(max_depth=6, min_samples_leaf=50, random_state=0).fit(ham(egitim), y_e)
orman = RandomForestClassifier(n_estimators=100, min_samples_leaf=20, max_samples=0.5, random_state=1).fit(ham(egitim), y_e)
boost = HistGradientBoostingClassifier(max_iter=200, learning_rate=0.05, max_leaf_nodes=8, early_stopping=False, random_state=1).fit(ham(egitim), y_e)
p = {"lojistik": logit.predict_proba(hazirla(test))[:, 1], "ağaç": agac.predict_proba(ham(test))[:, 1],
     "orman": orman.predict_proba(ham(test))[:, 1], "boosting": boost.predict_proba(ham(test))[:, 1]}`,
    en: `
logit = make_pipeline(StandardScaler(), LogisticRegression(C=1e6, max_iter=5000)).fit(prepare(train), y_tr)
tree = DecisionTreeClassifier(max_depth=6, min_samples_leaf=50, random_state=0).fit(raw(train), y_tr)
forest = RandomForestClassifier(n_estimators=100, min_samples_leaf=20, max_samples=0.5, random_state=1).fit(raw(train), y_tr)
boost = HistGradientBoostingClassifier(max_iter=200, learning_rate=0.05, max_leaf_nodes=8, early_stopping=False, random_state=1).fit(raw(train), y_tr)
p = {"logistic": logit.predict_proba(prepare(test))[:, 1], "tree": tree.predict_proba(raw(test))[:, 1],
     "forest": forest.predict_proba(raw(test))[:, 1], "boosting": boost.predict_proba(raw(test))[:, 1]}`
  };

  D.FILES = ["credit/taiwan_default.csv"];
  D.line = (code, mark) => code.split("\n").findIndex((l) => l.includes(mark)) + 1;
  window.M5_UNITS = [];
})();
