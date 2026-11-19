/* Modül 7 — ortak kod parçaları
 * Veri:
 *   wb/countries.csv     Dünya Bankası, Dünya Kalkınma Göstergeleri (CC BY 4.0), 2019–2023 ortalamaları, 157 ülke
 *   fred/TB3MS … GS10    FRED, ABD Hazine faizleri, aylık (kamu malı)
 *   fomc/statements.csv  FOMC para politikası açıklamaları, 2002–2026 (ABD kamu malı)
 *   fred/FEDFUNDS.csv    FRED, federal fon oranı, aylık (kamu malı)
 * Dosyalar GitHub Actions ile her ay güncellenir.
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 */
(function () {
  "use strict";
  const D = (window.M7_DATA = {});

  /* Ülkeler: sekiz gösterge, ölçeklenmiş matris Z */
  D.WB = {
    tr: `import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings("ignore")
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
ulke = pd.read_csv("wb/countries.csv")                    # 157 ülke, 2019–2023 ortalamaları
deg = ["gdppc_ppp", "inflation", "unemployment", "trade", "agriculture", "urban", "life_exp", "fertility"]
X = ulke[deg].copy()
X["gdppc_ppp"] = np.log(X["gdppc_ppp"])                   # kişi başı gelir (SGP, $): logaritması
Z = StandardScaler().fit_transform(X)                     # her değişken: ortalama 0, standart sapma 1`,
    en: `import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings("ignore")
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
ctry = pd.read_csv("wb/countries.csv")                    # 157 countries, 2019–2023 averages
cols = ["gdppc_ppp", "inflation", "unemployment", "trade", "agriculture", "urban", "life_exp", "fertility"]
X = ctry[cols].copy()
X["gdppc_ppp"] = np.log(X["gdppc_ppp"])                   # income per head (PPP, $): its logarithm
Z = StandardScaler().fit_transform(X)                     # every variable: mean 0, standard deviation 1`
  };

  /* Getiri eğrisi: sekiz vade, aylık */
  D.YC = {
    tr: `import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings("ignore")
from sklearn.decomposition import PCA
vade = ["TB3MS", "TB6MS", "GS1", "GS2", "GS3", "GS5", "GS7", "GS10"]
egri = pd.concat([pd.read_csv(f"fred/{v}.csv", index_col=0, parse_dates=True).iloc[:, 0] for v in vade], axis=1)
egri.columns = ["3a", "6a", "1y", "2y", "3y", "5y", "7y", "10y"]     # a = ay, y = yıl
egri = egri.apply(pd.to_numeric, errors="coerce").dropna()           # sekiz vadenin hepsinin olduğu aylar`,
    en: `import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings("ignore")
from sklearn.decomposition import PCA
mats = ["TB3MS", "TB6MS", "GS1", "GS2", "GS3", "GS5", "GS7", "GS10"]
curve = pd.concat([pd.read_csv(f"fred/{v}.csv", index_col=0, parse_dates=True).iloc[:, 0] for v in mats], axis=1)
curve.columns = ["3m", "6m", "1y", "2y", "3y", "5y", "7y", "10y"]    # m = month, y = year
curve = curve.apply(pd.to_numeric, errors="coerce").dropna()         # months with all eight maturities`
  };

  /* FOMC açıklamaları ve federal fon oranı */
  D.TX = {
    tr: `import re
import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings("ignore")
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
bildiri = pd.read_csv("fomc/statements.csv", parse_dates=["date"])          # 2002–2026 FOMC açıklamaları
faiz = pd.read_csv("fred/FEDFUNDS.csv", index_col=0, parse_dates=True).iloc[:, 0]   # federal fon oranı, aylık`,
    en: `import re
import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings("ignore")
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
stmt = pd.read_csv("fomc/statements.csv", parse_dates=["date"])             # 2002–2026 FOMC statements
ff = pd.read_csv("fred/FEDFUNDS.csv", index_col=0, parse_dates=True).iloc[:, 0]     # federal funds rate, monthly`
  };

  /* Faizin açıklamadan sonraki m aylık değişimi (açıklama ayından m ay sonrasına) */
  D.CHG = {
    tr: `
def degisim(t, m):
    son = (t + pd.DateOffset(months=m)).replace(day=1)
    return faiz.asof(son) - faiz.asof(t.replace(day=1)) if son <= faiz.index[-1] else np.nan`,
    en: `
def change(t, m):
    end = (t + pd.DateOffset(months=m)).replace(day=1)
    return ff.asof(end) - ff.asof(t.replace(day=1)) if end <= ff.index[-1] else np.nan`
  };

  /* Şahin/güvercin sözlüğü (öğretim amaçlı, Modül 7 için hazırlandı) */
  D.DICT = {
    tr: `
sahin = ["tighten", "tightening", "firming", "raise", "increase", "elevated", "pressures", "upside", "strong", "robust", "solid", "reduce"]
guvercin = ["accommodative", "accommodation", "ease", "easing", "lower", "decline", "weak", "weakened", "slack", "downside", "subdued", "purchases"]
def say(metin, kelimeler):
    return sum(len(re.findall(r"\\b" + k + r"\\b", metin)) for k in kelimeler)     # \\b: kelime sınırı`,
    en: `
hawk = ["tighten", "tightening", "firming", "raise", "increase", "elevated", "pressures", "upside", "strong", "robust", "solid", "reduce"]
dove = ["accommodative", "accommodation", "ease", "easing", "lower", "decline", "weak", "weakened", "slack", "downside", "subdued", "purchases"]
def count(text, words):
    return sum(len(re.findall(r"\\b" + w + r"\\b", text)) for w in words)       # \\b: word boundary`
  };

  D.F_WB = ["wb/countries.csv"];
  D.F_YC = ["fred/TB3MS.csv", "fred/TB6MS.csv", "fred/GS1.csv", "fred/GS2.csv", "fred/GS3.csv", "fred/GS5.csv", "fred/GS7.csv", "fred/GS10.csv"];
  D.F_TX = ["fomc/statements.csv", "fred/FEDFUNDS.csv"];
  D.line = (code, mark) => code.split("\n").findIndex((l) => l.includes(mark)) + 1;
  window.M7_UNITS = [];
})();
