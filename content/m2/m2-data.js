/* Modül 2 — ortak kod parçaları
 * Ücret–deneyim simülasyonu, dersin 3. hafta notebook'uyla aynıdır (aynı tohum, aynı sonuçlar).
 * FRED işsizlik verisi data/fred/UNRATE.csv dosyasından okunur (GitHub Actions ile aylık güncellenir).
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 */
(function () {
  "use strict";
  const D = (window.M2_DATA = {});
  D.WAGE = {
    tr: `import numpy as np
import warnings
warnings.filterwarnings("ignore")
rng = np.random.default_rng(2026)
SIG = 0.25                                   # gürültü: indirgenemez hata = 0,0625
def gercek(e): return 2.0 + 0.08 * e - 0.0014 * e**2      # gerçek ilişki (log ücret)
def orneklem(n):
    e = rng.uniform(0, 40, n)                # deneyim (yıl)
    return e, gercek(e) + rng.normal(0, SIG, n)
def kur(e, y, d): return np.polyfit(e / 20 - 1, y, d)     # d. dereceden polinom
def ongor(k, e): return np.polyval(k, e / 20 - 1)
def hko(a, b): return float(np.mean((a - b) ** 2))        # hata kareleri ortalaması
e_egt, y_egt = orneklem(30)                  # eğitim: 30 kişi
e_tst, y_tst = orneklem(2000)                # test: 2.000 yeni kişi`,
    en: `import numpy as np
import warnings
warnings.filterwarnings("ignore")
rng = np.random.default_rng(2026)
SIG = 0.25                                   # noise: irreducible error = 0.0625
def true_f(e): return 2.0 + 0.08 * e - 0.0014 * e**2      # true relationship (log wage)
def draw(n):
    e = rng.uniform(0, 40, n)                # experience (years)
    return e, true_f(e) + rng.normal(0, SIG, n)
def fit(e, y, d): return np.polyfit(e / 20 - 1, y, d)     # degree-d polynomial
def predict(k, e): return np.polyval(k, e / 20 - 1)
def mse(a, b): return float(np.mean((a - b) ** 2))        # mean squared error
e_tr, y_tr = draw(30)                        # training: 30 people
e_te, y_te = draw(2000)                      # test: 2,000 new people`
  };
  D.UNRATE = {
    tr: `import numpy as np
import pandas as pd
issizlik = pd.read_csv("fred/UNRATE.csv", names=["tarih", "oran"], header=0, parse_dates=["tarih"])
issizlik = issizlik[issizlik["tarih"] >= "2000-01-01"].reset_index(drop=True)
issizlik["ongoru"] = issizlik["oran"].shift(1)      # saf öngörü: bu ay = geçen ay
hata = issizlik["oran"] - issizlik["ongoru"]`,
    en: `import numpy as np
import pandas as pd
unemp = pd.read_csv("fred/UNRATE.csv", names=["date", "rate"], header=0, parse_dates=["date"])
unemp = unemp[unemp["date"] >= "2000-01-01"].reset_index(drop=True)
unemp["forecast"] = unemp["rate"].shift(1)          # naive forecast: this month = last month
error = unemp["rate"] - unemp["forecast"]`
  };
  window.M2_UNITS = window.M2_UNITS || [];
})();
