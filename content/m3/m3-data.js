/* Modül 3 — ortak kod parçaları
 * Ücret dünyası (40 değişken), dersin 4. hafta notebook'undaki dünyayla aynıdır (aynı katsayılar ve yapı).
 * Enflasyon verisi data/fred/ altındaki 13 FRED serisinden okunur (GitHub Actions ile aylık güncellenir).
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 */
(function () {
  "use strict";
  const D = (window.M3_DATA = {});

  D.WAGE = {
    tr: `import numpy as np
import warnings
from sklearn.exceptions import ConvergenceWarning
warnings.filterwarnings("ignore", category=FutureWarning)      # bilinen arayüz uyarıları susturulur
warnings.filterwarnings("always", category=ConvergenceWarning)  # yakınsama uyarısı görünür kalır:
# görürsen max_iter'i artır, λ ızgarasını ve ölçeklemeyi kontrol et.
from sklearn.linear_model import LinearRegression, Ridge, Lasso, RidgeCV, LassoCV
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import KFold, GridSearchCV
rng = np.random.default_rng(2026)
# Sentetik dünya: bütün sütunlar standart normal göstergeler, hedef log ücret gibi düşünülür.
# Sütun adları yalnızca etiket: "Deneyim²" deneyimin karesi olarak, "Büyükşehir" 0/1 olarak üretilmedi.
P, SIG = 40, 0.30                    # 40 değişken; gürültü varyansı (indirgenemez hata) = 0,09
adlar = ["Eğitim", "Deneyim", "Deneyim²", "Kıdem", "Büyükşehir", "Yaş"] + [f"Anket {i}" for i in range(1, 35)]
beta = np.zeros(P); beta[:5] = [0.30, 0.25, -0.12, 0.10, 0.12]    # yalnızca ilk beşinin etkisi var
def ciz(n, rho=0.97):
    Z = rng.normal(size=(n, P)); X = Z.copy()
    X[:, 5] = rho * X[:, 1] + np.sqrt(1 - rho**2) * Z[:, 5]            # yaş ≈ deneyim
    for j in range(6, P):
        X[:, j] = 0.5 * X[:, j % 5] + np.sqrt(0.75) * Z[:, j]          # anket soruları
    return X, 2.5 + X @ beta + rng.normal(0, SIG, n)
def hko(a, b): return float(np.mean((a - b) ** 2))
X_egt, y_egt = ciz(100)              # eğitim: 100 kişi
X_tst, y_tst = ciz(5000)             # test: 5.000 yeni kişi`,
    en: `import numpy as np
import warnings
from sklearn.exceptions import ConvergenceWarning
warnings.filterwarnings("ignore", category=FutureWarning)      # known interface warnings are silenced
warnings.filterwarnings("always", category=ConvergenceWarning)  # convergence warnings stay visible:
# if you see one, raise max_iter and check the λ grid and the scaling.
from sklearn.linear_model import LinearRegression, Ridge, Lasso, RidgeCV, LassoCV
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import KFold, GridSearchCV
rng = np.random.default_rng(2026)
# Synthetic world: every column is a standard normal indicator; think of the target as a log wage.
# Column names are labels only: "Experience²" was not generated as experience squared, nor "Big city" as 0/1.
P, SIG = 40, 0.30                    # 40 variables; noise variance (irreducible error) = 0.09
names = ["Education", "Experience", "Experience²", "Tenure", "Big city", "Age"] + [f"Survey {i}" for i in range(1, 35)]
beta = np.zeros(P); beta[:5] = [0.30, 0.25, -0.12, 0.10, 0.12]    # only the first five have an effect
def draw(n, rho=0.97):
    Z = rng.normal(size=(n, P)); X = Z.copy()
    X[:, 5] = rho * X[:, 1] + np.sqrt(1 - rho**2) * Z[:, 5]            # age ≈ experience
    for j in range(6, P):
        X[:, j] = 0.5 * X[:, j % 5] + np.sqrt(0.75) * Z[:, j]          # survey questions
    return X, 2.5 + X @ beta + rng.normal(0, SIG, n)
def mse(a, b): return float(np.mean((a - b) ** 2))
X_tr, y_tr = draw(100)               # training: 100 people
X_te, y_te = draw(5000)              # test: 5,000 new people`
  };

  /* Ham FRED serileri → aylık dönüşümler */
  D.INF = {
    tr: `import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)
def oku(kod):
    s = pd.read_csv(f"fred/{kod}.csv", names=["tarih", kod], header=0, parse_dates=["tarih"], na_values=["."])
    return s.set_index("tarih")
kodlar = ["CPIAUCSL", "CPILFESL", "PPIACO", "M2SL", "WTISPLC", "AHETPI", "PAYEMS", "INDPRO", "UNRATE", "FEDFUNDS", "T10Y3MM", "UMCSENT", "HOUST"]
ham = pd.concat([oku(k) for k in kodlar], axis=1).asfreq("MS")      # aylık; eksik ay satır olarak kalır
G = pd.DataFrame(index=ham.index)
G["enf"] = ham["CPIAUCSL"].pct_change(12, fill_method=None) * 100   # yıllık enflasyon (%)
G["aylik"] = ham["CPIAUCSL"].pct_change(1, fill_method=None) * 100  # aylık enflasyon (%)
for k in ["CPILFESL", "PPIACO", "M2SL", "WTISPLC", "AHETPI", "PAYEMS", "INDPRO"]:
    G[k] = ham[k].pct_change(12, fill_method=None) * 100            # yıllık değişim (%)
for k in ["UNRATE", "FEDFUNDS", "T10Y3MM", "UMCSENT"]:
    G[k] = ham[k]                                                    # düzey
G["HOUST"] = np.log(ham["HOUST"])                                    # konut başlangıcı (log)`,
    en: `import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)
def read(code):
    s = pd.read_csv(f"fred/{code}.csv", names=["date", code], header=0, parse_dates=["date"], na_values=["."])
    return s.set_index("date")
codes = ["CPIAUCSL", "CPILFESL", "PPIACO", "M2SL", "WTISPLC", "AHETPI", "PAYEMS", "INDPRO", "UNRATE", "FEDFUNDS", "T10Y3MM", "UMCSENT", "HOUST"]
raw = pd.concat([read(k) for k in codes], axis=1).asfreq("MS")      # monthly; a missing month stays as a row
G = pd.DataFrame(index=raw.index)
G["inf"] = raw["CPIAUCSL"].pct_change(12, fill_method=None) * 100   # annual inflation (%)
G["monthly"] = raw["CPIAUCSL"].pct_change(1, fill_method=None) * 100  # monthly inflation (%)
for k in ["CPILFESL", "PPIACO", "M2SL", "WTISPLC", "AHETPI", "PAYEMS", "INDPRO"]:
    G[k] = raw[k].pct_change(12, fill_method=None) * 100            # annual change (%)
for k in ["UNRATE", "FEDFUNDS", "T10Y3MM", "UMCSENT"]:
    G[k] = raw[k]                                                    # level
G["HOUST"] = np.log(raw["HOUST"])                                    # housing starts (log)`
  };

  /* Özellikler, hedef ve zamana göre bölme */
  D.INFX = {
    tr: D.INF.tr + `
oz = {}
for k in G.columns:
    if k != "aylik":
        for g in range(3):
            oz[f"{k}_g{g}"] = G[k].shift(g)          # g ay önceki değer (g = 0: bu ay)
for g in range(12):
    oz[f"aylik_g{g}"] = G["aylik"].shift(g)
X = pd.DataFrame(oz)
y = G["enf"].shift(-1).rename("hedef")             # hedef: GELECEK ayın yıllık enflasyonu
tablo = pd.concat([X, y], axis=1).loc["1984-01-01":].dropna()
tablo["hedef_ayi"] = tablo.index + pd.DateOffset(months=1)   # indeks: özellik ayı t; hedef_ayi: t+1
ozellikler = list(X.columns)
KESIM = pd.Timestamp("2015-01-01")                            # ilk test hedefi: Ocak 2015
egitim, test = tablo[tablo["hedef_ayi"] < KESIM], tablo[tablo["hedef_ayi"] >= KESIM]
def kok_hko(a, b): return float(np.sqrt(np.mean((np.asarray(a) - np.asarray(b)) ** 2)))`,
    en: D.INF.en + `
ft = {}
for k in G.columns:
    if k != "monthly":
        for g in range(3):
            ft[f"{k}_l{g}"] = G[k].shift(g)          # value g months ago (g = 0: this month)
for g in range(12):
    ft[f"monthly_l{g}"] = G["monthly"].shift(g)
X = pd.DataFrame(ft)
y = G["inf"].shift(-1).rename("target")            # target: NEXT month's annual inflation
table = pd.concat([X, y], axis=1).loc["1984-01-01":].dropna()
table["target_month"] = table.index + pd.DateOffset(months=1)   # index: feature month t; target_month: t+1
features = list(X.columns)
CUT = pd.Timestamp("2015-01-01")                                 # first test target: January 2015
train, test = table[table["target_month"] < CUT], table[table["target_month"] >= CUT]
def rmse(a, b): return float(np.sqrt(np.mean((np.asarray(a) - np.asarray(b)) ** 2)))`
  };

  D.FILES = ["CPIAUCSL", "CPILFESL", "PPIACO", "M2SL", "WTISPLC", "AHETPI", "PAYEMS", "INDPRO", "UNRATE", "FEDFUNDS", "T10Y3MM", "UMCSENT", "HOUST"].map((k) => "fred/" + k + ".csv");
  /* Tek dizide verilen kod satırında işaretin geçtiği satırın numarası (1'den başlar) */
  D.line = (code, mark) => code.split("\n").findIndex((l) => l.includes(mark)) + 1;
  window.M3_UNITS = window.M3_UNITS || [];
})();
