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
kur = pd.read_csv("fred/DEXUSEU.csv", index_col=0, parse_dates=True).iloc[:, 0]   # 1 euro kaç dolar; New York öğle alış kuru (kapanış değil)
kur = pd.to_numeric(kur, errors="coerce").dropna()                                 # tatil günleri boş: at
r = 100 * np.log(kur).diff().dropna()                                               # günlük log getiri, yüzde (ardışık iki mevcut kotasyon arası)`,
    en: `import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings("ignore")
fx = pd.read_csv("fred/DEXUSEU.csv", index_col=0, parse_dates=True).iloc[:, 0]    # dollars per euro; New York noon buying rate (not a close)
fx = pd.to_numeric(fx, errors="coerce").dropna()                                    # holidays are empty: drop them
r = 100 * np.log(fx).diff().dropna()                                                # daily log return, percent (between two consecutive available quotes)`
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
tablo["y_v"] = np.sqrt((r ** 2).rolling(20).mean().shift(-20))   # hedef 2: sonraki 20 mevcut gözlemin volatilitesi (günlük ölçü, %)
tablo["hedef_son"] = pd.Series(r.index, index=r.index).shift(-20)   # y_v'nin son gözleminin tarihi
tablo = tablo.dropna()
egt = tablo["hedef_son"] < "2015-01-01"                     # eğitim: hedefi 2015'ten önce tamamen gözlenmiş kararlar
tst = pd.Series(tablo.index >= "2015-01-01", index=tablo.index)   # test: 2015 ve sonrasındaki kararlar`,
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
table["y_v"] = np.sqrt((r ** 2).rolling(20).mean().shift(-20))   # target 2: volatility over the next 20 available observations (daily, %)
table["target_end"] = pd.Series(r.index, index=r.index).shift(-20)   # date of y_v's last observation
table = table.dropna()
trn = table["target_end"] < "2015-01-01"                    # training: decisions whose target was fully observed before 2015
tst = pd.Series(table.index >= "2015-01-01", index=table.index)   # test: decisions from 2015 on`
  };

  /* Bir günlük VaR tablosu: 20 günlük hedef tablosundan ayrı, yalnızca gereken sütunlar */
  D.VAR = {
    tr: `
vt = pd.DataFrame({"y_r": r.shift(-1), "v20": np.sqrt((r ** 2).rolling(20).mean()), "v60": np.sqrt((r ** 2).rolling(60).mean())})
vt["gerceklesme"] = pd.Series(r.index, index=r.index).shift(-1)   # yarının getirisinin tarihi (sonraki mevcut gözlem)
vt = vt.dropna()
v_egt = vt["gerceklesme"] < "2015-01-01"                    # kalibrasyon: getirisi 2015'ten önce gerçekleşmiş kararlar
v_tst = pd.Series(vt.index >= "2015-01-01", index=vt.index) # test: 2015 ve sonrasındaki kararlar
print(f"Test: {v_tst.sum()} karar, {vt.index[v_tst][0].date()} – {vt.index[v_tst][-1].date()}; son gerçekleşme {vt.loc[v_tst, 'gerceklesme'].iloc[-1].date()}")`,
    en: `
vt = pd.DataFrame({"y_r": r.shift(-1), "v20": np.sqrt((r ** 2).rolling(20).mean()), "v60": np.sqrt((r ** 2).rolling(60).mean())})
vt["realised_on"] = pd.Series(r.index, index=r.index).shift(-1)   # date of tomorrow's return (next available observation)
vt = vt.dropna()
v_trn = vt["realised_on"] < "2015-01-01"                    # calibration: decisions whose return was realised before 2015
v_tst = pd.Series(vt.index >= "2015-01-01", index=vt.index) # test: decisions from 2015 on
print(f"Test: {v_tst.sum()} decisions, {vt.index[v_tst][0].date()} – {vt.index[v_tst][-1].date()}; last realisation {vt.loc[v_tst, 'realised_on'].iloc[-1].date()}")`
  };

  D.FILES = ["fred/DEXUSEU.csv"];
  D.line = (code, mark) => code.split("\n").findIndex((l) => l.includes(mark)) + 1;
  window.M6_UNITS = [];
})();
