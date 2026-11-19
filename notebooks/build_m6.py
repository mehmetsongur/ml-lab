"""ML Laboratuvarı — Modül 6 Colab notebook üretici (TR/EN).
Çıktı: modul6/*.ipynb (TR) ve module6/*.ipynb (EN).
Veri: FRED DEXUSUK (Federal Reserve H.10, kamu malı), bu deponun data/fred/ klasöründen."""
import os, json
from build_notebooks import nb, b64, OUT
from build_m4 import fnv

CODES = {"A": "ML6-VOL-4TZC", "B": "ML6-VAR-7BHN"}
URL = "https://raw.githubusercontent.com/mehmetsongur/ml-lab/main/data/fred/DEXUSUK.csv"

COMMON = '''
import base64, warnings
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import KFold, TimeSeriesSplit, cross_val_score
from sklearn.metrics import r2_score
warnings.filterwarnings("ignore")

def _k(s):
    return base64.b64decode(s).decode()

def _referans(seri):
    r = 100 * np.log(seri).diff().dropna()
    t = pd.DataFrame(index=r.index)
    for w in [5, 20, 60]:
        t[f"v{w}"] = np.sqrt((r ** 2).rolling(w).mean())
    t["y_v"] = np.sqrt((r ** 2).rolling(20).mean().shift(-20))
    t = t.dropna()
    X, y = t[["v5", "v20", "v60"]], t["y_v"]
    e = t.index < "2015-01-01"
    out = dict(r=r, t=t,
               cv=cross_val_score(LinearRegression(), X, y, cv=TimeSeriesSplit(5, gap=20), scoring="r2").mean(),
               cv_nogap=cross_val_score(LinearRegression(), X, y, cv=TimeSeriesSplit(5), scoring="r2").mean(),
               cv_rand=cross_val_score(LinearRegression(), X, y, cv=KFold(5, shuffle=True, random_state=0), scoring="r2").mean(),
               test=r2_score(y[~e], LinearRegression().fit(X[e], y[e]).predict(X[~e])),
               naive=r2_score(y[~e], t.loc[~e, "v60"]))
    yr = r.shift(-1).reindex(t.index)
    oran = (yr / t["v60"]).dropna()
    ee = oran.index < "2015-01-01"
    q = np.quantile(oran[ee], 0.01)
    out.update(q=q, q_all=np.quantile(oran, 0.01), exc=(yr[~e] < q * t.loc[~e, "v60"]).mean(), exc_n=(yr[~e] < -2.326 * t.loc[~e, "v60"]).mean())
    return out
'''

SETUP = {
    "tr": COMMON + '''
kur = pd.read_csv("''' + URL + '''", index_col=0, parse_dates=True).iloc[:, 0]
kur = pd.to_numeric(kur, errors="coerce").dropna()                  # 1 sterlin kaç dolar, günlük
print(f"kur: {kur.index[0].date()} – {kur.index[-1].date()}, {len(kur)} gün")
_R = _referans(kur)

def kontrol_A(r, tablo, cv_r2, test_r2, naif_r2):
    if len(r) != len(_R["r"]) or not np.allclose(np.asarray(r), _R["r"].values):
        print("❌ r beklenenden farklı: r = 100 * np.log(kur).diff().dropna() (yüzde log getiri)."); return
    for c in ["v5", "v20", "v60", "y_v"]:
        if c not in tablo.columns:
            print(f"❌ tabloda {c} sütunu yok."); return
    if len(tablo) != len(_R["t"]) or not tablo.index.equals(_R["t"].index):
        print("❌ tablonun satırları beklenenden farklı: bütün sütunlar kurulduktan sonra dropna() uygula."); return
    for c in ["v5", "v20", "v60"]:
        if not np.allclose(tablo[c].values, _R["t"][c].values):
            print(f"❌ {c} beklenenden farklı: np.sqrt((r ** 2).rolling(w).mean()), yalnızca geçmişe bakan pencere (center=True yok)."); return
    if not np.allclose(tablo["y_v"].values, _R["t"]["y_v"].values):
        print("❌ y_v beklenenden farklı: önümüzdeki 20 günün volatilitesi, np.sqrt((r ** 2).rolling(20).mean().shift(-20))."); return
    if abs(float(cv_r2) - _R["cv"]) > 1e-6:
        if abs(float(cv_r2) - _R["cv_rand"]) < 1e-3:
            print("❌ cv_r2 rastgele bölmeyle (KFold, shuffle) hesaplanmış: zaman serisinde TimeSeriesSplit(5, gap=20) kullan."); return
        if abs(float(cv_r2) - _R["cv_nogap"]) < 1e-6 and abs(_R["cv_nogap"] - _R["cv"]) > 1e-6:
            print("❌ cv_r2'de boşluk yok: TimeSeriesSplit(n_splits=5, gap=20)."); return
        print("❌ cv_r2 beklenenden farklı: LinearRegression, X = v5, v20, v60; cv=TimeSeriesSplit(n_splits=5, gap=20), scoring='r2', ortalama."); return
    if abs(float(test_r2) - _R["test"]) > 1e-6:
        print("❌ test_r2 beklenenden farklı: model yalnızca 2015 öncesiyle kurulmalı, R² 2015 ve sonrasında hesaplanmalı."); return
    if abs(float(naif_r2) - _R["naive"]) > 1e-6:
        print("❌ naif_r2 beklenenden farklı: test döneminde r2_score(y, tablo['v60'])."); return
    print(f"✅ Tüm kontroller geçti (cv R² {_R['cv']:.3f}, test R² {_R['test']:.3f}, saf v60 {_R['naive']:.3f}). Tamamlama kodun: " + _k("''' + b64(CODES["A"]) + '''"))

def kontrol_B(tablo, q, asim_orani, asim_normal):
    if "y_r" not in tablo.columns or not np.allclose(tablo["y_r"].values, _R["r"].shift(-1).reindex(tablo.index).values, equal_nan=True):
        print("❌ tablo['y_r'] yarının getirisi olmalı: r.shift(-1)."); return
    if abs(float(q) - _R["q"]) > 1e-9:
        if abs(float(q) - _R["q_all"]) < 1e-9:
            print("❌ Çarpan bütün veriden (test dâhil) öğrenilmiş: yalnızca 2015 öncesindeki y_r / v60 oranının %1 yüzdeliğini kullan."); return
        print("❌ q beklenenden farklı: 2015 öncesinde (y_r / v60) oranının %1 yüzdeliği, np.quantile(..., 0.01)."); return
    if abs(float(asim_orani) - _R["exc"]) > 1e-9:
        print("❌ asim_orani beklenenden farklı: 2015 ve sonrasında (y_r < q * v60) ortalaması."); return
    if abs(float(asim_normal) - _R["exc_n"]) > 1e-9:
        print("❌ asim_normal beklenenden farklı: 2015 ve sonrasında (y_r < -2.326 * v60) ortalaması."); return
    print(f"✅ Tüm kontroller geçti (çarpan {_R['q']:.2f}; aşım oranı %{100 * _R['exc']:.2f}, normal çarpanla %{100 * _R['exc_n']:.2f}). Tamamlama kodun: " + _k("''' + b64(CODES["B"]) + '''"))
''',
    "en": COMMON + '''
fx = pd.read_csv("''' + URL + '''", index_col=0, parse_dates=True).iloc[:, 0]
fx = pd.to_numeric(fx, errors="coerce").dropna()                    # dollars per pound, daily
print(f"fx: {fx.index[0].date()} – {fx.index[-1].date()}, {len(fx)} days")
_R = _referans(fx)

def check_A(r, table, cv_r2, test_r2, naive_r2):
    if len(r) != len(_R["r"]) or not np.allclose(np.asarray(r), _R["r"].values):
        print("❌ r differs from the expected one: r = 100 * np.log(fx).diff().dropna() (percent log return)."); return
    for c in ["v5", "v20", "v60", "y_v"]:
        if c not in table.columns:
            print(f"❌ table has no {c} column."); return
    if len(table) != len(_R["t"]) or not table.index.equals(_R["t"].index):
        print("❌ table's rows differ from the expected ones: apply dropna() after building all the columns."); return
    for c in ["v5", "v20", "v60"]:
        if not np.allclose(table[c].values, _R["t"][c].values):
            print(f"❌ {c} differs from the expected one: np.sqrt((r ** 2).rolling(w).mean()), a backward-looking window only (no center=True)."); return
    if not np.allclose(table["y_v"].values, _R["t"]["y_v"].values):
        print("❌ y_v differs from the expected one: the volatility of the next 20 days, np.sqrt((r ** 2).rolling(20).mean().shift(-20))."); return
    if abs(float(cv_r2) - _R["cv"]) > 1e-6:
        if abs(float(cv_r2) - _R["cv_rand"]) < 1e-3:
            print("❌ cv_r2 was computed with a random split (KFold, shuffle): with time series use TimeSeriesSplit(5, gap=20)."); return
        if abs(float(cv_r2) - _R["cv_nogap"]) < 1e-6 and abs(_R["cv_nogap"] - _R["cv"]) > 1e-6:
            print("❌ cv_r2 has no gap: TimeSeriesSplit(n_splits=5, gap=20)."); return
        print("❌ cv_r2 differs from the expected value: LinearRegression, X = v5, v20, v60; cv=TimeSeriesSplit(n_splits=5, gap=20), scoring='r2', mean."); return
    if abs(float(test_r2) - _R["test"]) > 1e-6:
        print("❌ test_r2 differs from the expected value: the model should be fitted before 2015 only and R² computed from 2015 on."); return
    if abs(float(naive_r2) - _R["naive"]) > 1e-6:
        print("❌ naive_r2 differs from the expected value: r2_score(y, table['v60']) in the test period."); return
    print(f"✅ All checks passed (cv R² {_R['cv']:.3f}, test R² {_R['test']:.3f}, naive v60 {_R['naive']:.3f}). Your completion code: " + _k("''' + b64(CODES["A"]) + '''"))

def check_B(table, q, exc_rate, exc_normal):
    if "y_r" not in table.columns or not np.allclose(table["y_r"].values, _R["r"].shift(-1).reindex(table.index).values, equal_nan=True):
        print("❌ table['y_r'] should be tomorrow's return: r.shift(-1)."); return
    if abs(float(q) - _R["q"]) > 1e-9:
        if abs(float(q) - _R["q_all"]) < 1e-9:
            print("❌ The multiplier was learned from all the data (test included): use only the 1% quantile of y_r / v60 before 2015."); return
        print("❌ q differs from the expected value: the 1% quantile of (y_r / v60) before 2015, np.quantile(..., 0.01)."); return
    if abs(float(exc_rate) - _R["exc"]) > 1e-9:
        print("❌ exc_rate differs from the expected value: the mean of (y_r < q * v60) from 2015 on."); return
    if abs(float(exc_normal) - _R["exc_n"]) > 1e-9:
        print("❌ exc_normal differs from the expected value: the mean of (y_r < -2.326 * v60) from 2015 on."); return
    print(f"✅ All checks passed (multiplier {_R['q']:.2f}; exceedance rate {100 * _R['exc']:.2f}%, with the normal multiplier {100 * _R['exc_n']:.2f}%). Your completion code: " + _k("''' + b64(CODES["B"]) + '''"))
''',
}

T = {
    "tr": dict(
        title="# ML Laboratuvarı · Modül 6, Ünite 9: Sterlin volatilitesi ve VaR",
        intro="""**Prof. Dr. Mehmet Songur** · ML Laboratuvarı, Modül 6

Veri: sterlin/dolar kuru, günlük, 1971'den bu yana (FRED: DEXUSUK, ABD Merkez Bankası H.10 serisi, kamu malı). Kurulum hücresi `kur` adlı serileri (tarih indeksli) indirir. Kodu **Gemini'ye yazdır**, sonra **denetle**.

**Kurallar**
1. **Kurulum** ve **Kontrol** hücrelerini değiştirme; yalnızca çalıştır.
2. Görev hücrelerinde kodu Gemini ile üret; çalıştırmadan önce oku.
3. Kontrol hücresi geçerse bir **tamamlama kodu** verir; onu ML Laboratuvarı'ndaki kutuya yapıştır.""",
        setup_title="#@title Kurulum — çalıştır, değiştirme",
        after_setup="\nkur.tail(3)",
        taskA="""## Görev A — Volatilite öngörüsü

1. Günlük log getiri: `r = 100 * np.log(kur).diff().dropna()`.
2. `tablo` adlı bir DataFrame: w = 5, 20, 60 için `v{w} = np.sqrt((r ** 2).rolling(w).mean())` (yalnızca geçmiş); hedef `y_v = np.sqrt((r ** 2).rolling(20).mean().shift(-20))` (önümüzdeki 20 gün); sonra `dropna()`.
3. `X = tablo[["v5", "v20", "v60"]]`, `y = tablo["y_v"]`. `LinearRegression` için `cross_val_score(..., cv=TimeSeriesSplit(n_splits=5, gap=20), scoring="r2")` ortalaması: `cv_r2`.
4. `egt = tablo.index < "2015-01-01"`, `tst = ~egt`. Modeli yalnızca `egt` ile kur; `tst` için R²: `test_r2`. Saf tahmin olarak `tablo.loc[tst, "v60"]`'ın R²'si: `naif_r2`.

**Denetim soruları:** Rastgele bölme (`train_test_split`, `KFold(shuffle=True)`) var mı? Pencereler geçmişe mi bakıyor? Hedef geleceğe mi?""",
        taskA_code="# Görev A: Gemini ile kodu burada üret, oku, sonra çalıştır.\n",
        checkA_md="### Kontrol A — çalıştır, değiştirme",
        checkA="kontrol_A(r, tablo, cv_r2, test_r2, naif_r2)",
        taskB="""## Görev B — Riske maruz değer (%1 VaR)

1. Tabloya yarının getirisini ekle: `tablo["y_r"] = r.shift(-1)`.
2. Çarpan: 2015 öncesinde `tablo["y_r"] / tablo["v60"]` oranının %1 yüzdeliği: `q = np.quantile(..., 0.01)` (eksik değerleri at).
3. Aşım: `tablo["y_r"] < q * tablo["v60"]`. 2015 ve sonrasındaki ortalaması: `asim_orani`.
4. Aynısını normal dağılım çarpanıyla (−2.326) yap: `asim_normal`. İkisini %1 hedefiyle karşılaştır ve aşımların yıllara göre dağılımına bak.

**Denetim soruları:** Çarpan yalnızca eğitim döneminden mi öğrenildi? Aşımlar hangi yıllarda yığılıyor?""",
        taskB_code="# Görev B: Gemini ile kodu burada üret, oku, sonra çalıştır.\n",
        checkB_md="### Kontrol B — çalıştır, değiştirme",
        checkB="kontrol_B(tablo, q, asim_orani, asim_normal)",
        notes="""## Denetim notların

- Gemini zamana saygılı mı çalıştı? Neyi düzeltmen gerekti?
- Sterlin sonuçları euro/dolarla nasıl karşılaştırılıyor? (cv_r2, test_r2, naif_r2)
- VaR sonuçlarını bir risk komitesine nasıl anlatırsın? (aşım oranı, normal çarpanla fark, sınırlılıklar)""",
    ),
    "en": dict(
        title="# ML Lab · Module 6, Unit 9: Sterling volatility and VaR",
        intro="""**Prof. Dr. Mehmet Songur** · ML Lab, Module 6

Data: the sterling/dollar rate, daily since 1971 (FRED: DEXUSUK, the US Federal Reserve's H.10 series, public domain). The setup cell downloads a series called `fx` (date-indexed). **Have Gemini write the code**, then **audit it**.

**Rules**
1. Do not change the **Setup** and **Check** cells; just run them.
2. Generate code with Gemini in the task cells; read it before running.
3. If a check cell passes, it gives you a **completion code**; paste it into the box in ML Lab.""",
        setup_title="#@title Setup — run it, do not change it",
        after_setup="\nfx.tail(3)",
        taskA="""## Task A — Volatility forecast

1. Daily log return: `r = 100 * np.log(fx).diff().dropna()`.
2. A DataFrame called `table`: for w = 5, 20, 60, `v{w} = np.sqrt((r ** 2).rolling(w).mean())` (past only); target `y_v = np.sqrt((r ** 2).rolling(20).mean().shift(-20))` (the next 20 days); then `dropna()`.
3. `X = table[["v5", "v20", "v60"]]`, `y = table["y_v"]`. The mean of `cross_val_score(..., cv=TimeSeriesSplit(n_splits=5, gap=20), scoring="r2")` for `LinearRegression`: `cv_r2`.
4. `trn = table.index < "2015-01-01"`, `tst = ~trn`. Fit the model on `trn` only; R² on `tst`: `test_r2`. The R² of `table.loc[tst, "v60"]` as the naive forecast: `naive_r2`.

**Audit questions:** Is there a random split (`train_test_split`, `KFold(shuffle=True)`)? Do the windows look backward? Does the target look forward?""",
        taskA_code="# Task A: generate the code with Gemini here, read it, then run it.\n",
        checkA_md="### Check A — run it, do not change it",
        checkA="check_A(r, table, cv_r2, test_r2, naive_r2)",
        taskB="""## Task B — Value at risk (1% VaR)

1. Add tomorrow's return to the table: `table["y_r"] = r.shift(-1)`.
2. Multiplier: the 1% quantile of the ratio `table["y_r"] / table["v60"]` before 2015: `q = np.quantile(..., 0.01)` (drop missing values).
3. Exceedance: `table["y_r"] < q * table["v60"]`. Its mean from 2015 on: `exc_rate`.
4. Do the same with the normal multiplier (−2.326): `exc_normal`. Compare both with the 1% target and look at how exceedances are spread across years.

**Audit questions:** Was the multiplier learned from the training period only? In which years do exceedances pile up?""",
        taskB_code="# Task B: generate the code with Gemini here, read it, then run it.\n",
        checkB_md="### Check B — run it, do not change it",
        checkB="check_B(table, q, exc_rate, exc_normal)",
        notes="""## Your audit notes

- Did Gemini work in a time-respecting way? What did you need to fix?
- How do the sterling results compare with euro/dollar? (cv_r2, test_r2, naive_r2)
- How would you explain the VaR results to a risk committee? (exceedance rate, gap with the normal multiplier, limitations)""",
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
        "modul6/09_kur_volatilite_atolyesi_tr.ipynb": workshop("tr"),
        "module6/09_fx_volatility_workshop_en.ipynb": workshop("en"),
    }
    for rel, data in files.items():
        p = os.path.join(OUT, rel)
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=1)
        print("yazıldı:", rel)
    print("hash A:", fnv(CODES["A"]), "hash B:", fnv(CODES["B"]))
