/* Modül 4 — ortak kod parçaları
 * Kredi dünyası, dersin 5. hafta notebook'undaki dünyayla aynıdır (aynı tohum, aynı katsayılar, aynı sonuçlar).
 * Gerçek veri: UCI "Default of Credit Card Clients" (Yeh ve Lien, 2009; CC BY 4.0), data/credit/taiwan_default.csv.
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 */
(function () {
  "use strict";
  const D = (window.M4_DATA = {});

  D.CREDIT = {
    tr: `import numpy as np
import warnings
warnings.filterwarnings("ignore")
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.metrics import roc_auc_score, confusion_matrix
rng = np.random.default_rng(2026)
adlar = ["Borç/gelir", "Önceki gecikme", "Gelir (log)", "Çalışma süresi", "Kart harcaması/gelir", "Yaş"]
BETA = np.array([0.9, 1.1, -0.6, -0.4, 0.5, 0.0])   # gerçek log-odds katsayıları; yaşın etkisi yok
def ciz(n, sabit=-3.0):
    X = rng.normal(size=(n, 6))
    X[:, 1] = (rng.random(n) < 0.15).astype(float)            # önceki gecikme: 0/1
    X[:, 4] = 0.4 * X[:, 0] + np.sqrt(1 - 0.16) * X[:, 4]    # kart harcaması borçla ilişkili
    X[:, 5] = 0.5 * X[:, 3] + np.sqrt(0.75) * X[:, 5]        # yaş çalışma süresiyle ilişkili
    p = 1 / (1 + np.exp(-(sabit + X @ BETA)))                # gerçek temerrüt olasılığı
    return X, (rng.random(n) < p).astype(int), p
X_egt, y_egt, _ = ciz(3000)                 # eğitim: 3.000 geçmiş başvuru
X_tst, y_tst, p_gercek = ciz(20000)         # test: 20.000 yeni başvuru`,
    en: `import numpy as np
import warnings
warnings.filterwarnings("ignore")
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.metrics import roc_auc_score, confusion_matrix
rng = np.random.default_rng(2026)
names = ["Debt/income", "Past delinquency", "Income (log)", "Years employed", "Card spending/income", "Age"]
BETA = np.array([0.9, 1.1, -0.6, -0.4, 0.5, 0.0])   # true log-odds coefficients; age has no effect
def draw(n, const=-3.0):
    X = rng.normal(size=(n, 6))
    X[:, 1] = (rng.random(n) < 0.15).astype(float)            # past delinquency: 0/1
    X[:, 4] = 0.4 * X[:, 0] + np.sqrt(1 - 0.16) * X[:, 4]    # card spending related to debt
    X[:, 5] = 0.5 * X[:, 3] + np.sqrt(0.75) * X[:, 5]        # age related to years employed
    p = 1 / (1 + np.exp(-(const + X @ BETA)))                # true default probability
    return X, (rng.random(n) < p).astype(int), p
X_tr, y_tr, _ = draw(3000)                  # training: 3,000 past applications
X_te, y_te, p_true = draw(20000)            # test: 20,000 new applications`
  };

  /* Model ve ölçü fonksiyonu (Ünite 3'ten itibaren) */
  D.MODEL = {
    tr: `
logit = LogisticRegression(C=1e6, max_iter=2000).fit(X_egt, y_egt)   # C=1e6: ceza fiilen yok (ekonometrideki logit)
p_hat = logit.predict_proba(X_tst)[:, 1]                             # her başvuru için temerrüt olasılığı
def olcu(y, p, esik):
    yh = (p >= esik).astype(int)
    dn, yp, yn, dp = confusion_matrix(y, yh, labels=[0, 1]).ravel()
    return {"DP": dp, "YP": yp, "YN": yn, "DN": dn, "doğruluk": (dp + dn) / len(y),
            "duyarlılık": dp / (dp + yn) if dp + yn else 0.0, "kesinlik": dp / (dp + yp) if dp + yp else 0.0,
            "özgüllük": dn / (dn + yp)}`,
    en: `
logit = LogisticRegression(C=1e6, max_iter=2000).fit(X_tr, y_tr)     # C=1e6: effectively no penalty (the econometric logit)
p_hat = logit.predict_proba(X_te)[:, 1]                              # default probability for each application
def metrics(y, p, thr):
    yh = (p >= thr).astype(int)
    tn, fp, fn, tp = confusion_matrix(y, yh, labels=[0, 1]).ravel()
    return {"TP": tp, "FP": fp, "FN": fn, "TN": tn, "accuracy": (tp + tn) / len(y),
            "recall": tp / (tp + fn) if tp + fn else 0.0, "precision": tp / (tp + fp) if tp + fp else 0.0,
            "specificity": tn / (tn + fp)}`
  };

  /* Gerçek veri: Tayvan kart müşterileri (Nisan–Eylül 2005 → Ekim 2005 temerrüdü) */
  D.TW = {
    tr: `import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings("ignore")
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, cross_val_predict
from sklearn.metrics import roc_auc_score
kredi = pd.read_csv("credit/taiwan_default.csv")      # 30.000 kart müşterisi; hedef: 'default' (Ekim 2005)
egitim, test = train_test_split(kredi, test_size=0.3, random_state=0, stratify=kredi["default"])`,
    en: `import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings("ignore")
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, cross_val_predict
from sklearn.metrics import roc_auc_score
credit = pd.read_csv("credit/taiwan_default.csv")     # 30,000 card customers; target: 'default' (October 2005)
train, test = train_test_split(credit, test_size=0.3, random_state=0, stratify=credit["default"])`
  };

  /* Ödeme durumu kodlarını anlamlarına göre çözen özellik hazırlığı */
  D.TWX = {
    tr: `
def hazirla(df):
    X = df.drop(columns=["default", "sex", "marriage"]).copy()     # korunan özellikler dışarıda
    for k in ["pay_0", "pay_2", "pay_3", "pay_4", "pay_5", "pay_6"]:
        X[k + "_gecikme"] = X[k].clip(lower=0)      # 1, 2, …: kaç ay gecikmiş
        X[k + "_tam"] = (X[k] == -1).astype(int)    # −1: borcun tamamını ödedi
        X[k + "_yok"] = (X[k] == -2).astype(int)    # −2: kart kullanılmadı
        X = X.drop(columns=[k])
    for k in [c for c in X.columns if "amt" in c]:
        X[k] = np.sign(X[k]) * np.log1p(np.abs(X[k]))   # tutarlar çok çarpık: işaretli log
    return X`,
    en: `
def prepare(df):
    X = df.drop(columns=["default", "sex", "marriage"]).copy()     # protected attributes left out
    for k in ["pay_0", "pay_2", "pay_3", "pay_4", "pay_5", "pay_6"]:
        X[k + "_delay"] = X[k].clip(lower=0)        # 1, 2, …: months of delay
        X[k + "_full"] = (X[k] == -1).astype(int)   # −1: paid the balance in full
        X[k + "_none"] = (X[k] == -2).astype(int)   # −2: card not used
        X = X.drop(columns=[k])
    for k in [c for c in X.columns if "amt" in c]:
        X[k] = np.sign(X[k]) * np.log1p(np.abs(X[k]))   # amounts are very skewed: signed log
    return X`
  };

  D.FILES = ["credit/taiwan_default.csv"];
  D.line = (code, mark) => code.split("\n").findIndex((l) => l.includes(mark)) + 1;
  window.M4_UNITS = window.M4_UNITS || [];
})();
