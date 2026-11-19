/* Modül 1 — ortak veri parçaları (kurgusal) ve modül kaydı
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 */
(function () {
  "use strict";
  const D = (window.M1_DATA = {});

  // Kurgusal kredi başvuru tablosu: 2 eksik gelir (ikisi de temerrüt), 1 olağandışı kart harcaması.
  D.KREDI = {
    tr: `import numpy as np
import pandas as pd
kredi = pd.DataFrame({
    "musteri": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "yas": [25, 41, 33, 52, 29, 47, 38, 60, 35, 44],
    "gelir": [30000, 52000, 41000, np.nan, 36000, 61000, 45000, 58000, np.nan, 50000],
    "kart_harcamasi": [4200, 6100, 5300, 7000, 48000, 6900, 5600, 6400, 5000, 5900],
    "bolge": ["Doğu", "Batı", "Merkez", "Doğu", "Batı", "Merkez", "Doğu", "Batı", "Merkez", "Doğu"],
    "temerrut": [1, 0, 0, 1, 1, 0, 0, 0, 1, 0],
})`,
    en: `import numpy as np
import pandas as pd
loans = pd.DataFrame({
    "customer": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "age": [25, 41, 33, 52, 29, 47, 38, 60, 35, 44],
    "income": [30000, 52000, 41000, np.nan, 36000, 61000, 45000, 58000, np.nan, 50000],
    "card_spending": [4200, 6100, 5300, 7000, 48000, 6900, 5600, 6400, 5000, 5900],
    "region": ["East", "West", "Central", "East", "West", "Central", "East", "West", "Central", "East"],
    "default": [1, 0, 0, 1, 1, 0, 0, 0, 1, 0],
})`
  };
  D.SPENDING = [4200, 6100, 5300, 7000, 48000, 6900, 5600, 6400, 5000, 5900];
  D.INCOMES = [30000, 52000, 41000, null, 36000, 61000, 45000, 58000, null, 50000];
  D.DEFAULTS = [1, 0, 0, 1, 1, 0, 0, 0, 1, 0];

  window.M1_UNITS = window.M1_UNITS || [];
})();
