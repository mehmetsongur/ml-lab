/* Modül 6 — ortak kod parçaları
 * Veri: FRED, Federal Reserve H.10 günlük döviz kurları (kamu malı). DEXUSEU: 1 euro kaç ABD doları (1999–).
 * Dosyalar data/fred/ klasöründedir ve GitHub Actions ile her ay güncellenir.
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 */
(function () {
  "use strict";
  const D = (window.M6_DATA = {});

  /* Kur ve günlük log getiri */
  D.FX = {
    tr: `import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings("ignore")
kur = pd.read_csv("fred/DEXUSEU.csv", index_col=0, parse_dates=True).iloc[:, 0]   # 1 euro kaç dolar, günlük
kur = pd.to_numeric(kur, errors="coerce").dropna()                                 # tatil günleri boş: at
r = 100 * np.log(kur).diff().dropna()                                               # günlük log getiri, yüzde`,
    en: `import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings("ignore")
fx = pd.read_csv("fred/DEXUSEU.csv", index_col=0, parse_dates=True).iloc[:, 0]    # dollars per euro, daily
fx = pd.to_numeric(fx, errors="coerce").dropna()                                    # holidays are empty: drop them
r = 100 * np.log(fx).diff().dropna()                                                # daily log return, percent`
  };

  /* Özellik tablosu: yalnızca geçmişe bakan özellikler ve iki hedef */
  D.TAB = {
    tr: `
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import KFold, TimeSeriesSplit, cross_val_score
from sklearn.metrics import r2_score
tablo = pd.DataFrame({"r": r})
for k in range(1, 6):
    tablo[f"r_l{k}"] = r.shift(k - 1)                       # bugünün ve önceki günlerin getirisi (r_l1 = bugün)
tablo["mom20"] = r.rolling(20).sum()                        # son 20 günün toplam getirisi (momentum)
for w in [5, 20, 60]:
    tablo[f"v{w}"] = np.sqrt((r ** 2).rolling(w).mean())    # son w günün volatilitesi (günlük, %)
tablo["y_r"] = r.shift(-1)                                  # hedef 1: yarının getirisi
tablo["y_v"] = np.sqrt((r ** 2).rolling(20).mean().shift(-20))   # hedef 2: önümüzdeki 20 günün volatilitesi
tablo = tablo.dropna()
egt = tablo.index < "2015-01-01"                            # eğitim: 1999–2014
tst = ~egt                                                  # test: 2015 ve sonrası`,
    en: `
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import KFold, TimeSeriesSplit, cross_val_score
from sklearn.metrics import r2_score
table = pd.DataFrame({"r": r})
for k in range(1, 6):
    table[f"r_l{k}"] = r.shift(k - 1)                       # today's and earlier days' returns (r_l1 = today)
table["mom20"] = r.rolling(20).sum()                        # total return over the last 20 days (momentum)
for w in [5, 20, 60]:
    table[f"v{w}"] = np.sqrt((r ** 2).rolling(w).mean())    # volatility over the last w days (daily, %)
table["y_r"] = r.shift(-1)                                  # target 1: tomorrow's return
table["y_v"] = np.sqrt((r ** 2).rolling(20).mean().shift(-20))   # target 2: volatility over the next 20 days
table = table.dropna()
trn = table.index < "2015-01-01"                            # training: 1999–2014
tst = ~trn                                                  # test: 2015 onwards`
  };

  D.FILES = ["fred/DEXUSEU.csv"];
  D.line = (code, mark) => code.split("\n").findIndex((l) => l.includes(mark)) + 1;
  window.M6_UNITS = [];
})();
