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
    gun = pd.Series(r.index, index=r.index)
    t = pd.DataFrame(index=r.index)
    for w in [5, 20, 60]:
        t[f"v{w}"] = np.sqrt((r ** 2).rolling(w).mean())
    t["y_v"] = np.sqrt((r ** 2).rolling(20).mean().shift(-20))
    t["son"] = gun.shift(-20)
    t = t.dropna()
    X, y = t[["v5", "v20", "v60"]], t["y_v"]
    e, s = t["son"] < "2015-01-01", t.index >= "2015-01-01"
    e_eski = t.index < "2015-01-01"
    cv = lambda m, XX, yy, c: cross_val_score(m, XX, yy, cv=c, scoring="r2").mean()
    out = dict(r=r, t=t, e=e, s=s,
               cv=cv(LinearRegression(), X[e], y[e], TimeSeriesSplit(5, gap=20)),
               cv_full=cv(LinearRegression(), X, y, TimeSeriesSplit(5, gap=20)),
               cv_nogap=cv(LinearRegression(), X[e], y[e], TimeSeriesSplit(5)),
               cv_rand=cv(LinearRegression(), X[e], y[e], KFold(5, shuffle=True, random_state=0)),
               test=r2_score(y[s], LinearRegression().fit(X[e], y[e]).predict(X[s])),
               test_eski=r2_score(y[s], LinearRegression().fit(X[e_eski], y[e_eski]).predict(X[s])),
               naive=r2_score(y[s], t.loc[s, "v60"]))
    v = pd.DataFrame({"y_r": r.shift(-1), "v60": np.sqrt((r ** 2).rolling(60).mean())})
    v["g"] = gun.shift(-1)
    v = v.dropna()
    ve, vs = v["g"] < "2015-01-01", v.index >= "2015-01-01"
    oran = v["y_r"] / v["v60"]
    q = np.quantile(oran[ve], 0.01)
    out.update(v=v, ve=ve, vs=vs, q=q, q_all=np.quantile(oran, 0.01), q_eski=np.quantile(oran[v.index < "2015-01-01"], 0.01),
               exc=(v.loc[vs, "y_r"] < q * v.loc[vs, "v60"]).mean(), exc_n=(v.loc[vs, "y_r"] < -2.326 * v.loc[vs, "v60"]).mean(),
               n_exc=int((v.loc[vs, "y_r"] < q * v.loc[vs, "v60"]).sum()), n_exc_n=int((v.loc[vs, "y_r"] < -2.326 * v.loc[vs, "v60"]).sum()))
    return out
'''

SETUP = {
    "tr": COMMON + '''
kur = pd.read_csv("''' + URL + '''", index_col=0, parse_dates=True).iloc[:, 0]
kur = pd.to_numeric(kur, errors="coerce").dropna()                  # 1 sterlin kaç dolar; New York öğle alış kuru
print(f"Veri sürümü: kur {kur.index[0].date()} – {kur.index[-1].date()}, {len(kur)} gözlem (FRED her iş günü güncellenir; sonuçların son basamakları veri sürümüne bağlıdır)")
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
        print("❌ y_v beklenenden farklı: sonraki 20 gözlemin volatilitesi, np.sqrt((r ** 2).rolling(20).mean().shift(-20))."); return
    t, e = _R["t"], _R["e"]
    print(f"Eğitim: {e.sum()} karar, son karar {t.index[e][-1].date()}, son hedef bitişi {t['son'][e].iloc[-1].date()} | test: {_R['s'].sum()} karar, ilk karar {t.index[_R['s']][0].date()}")
    for k, (a, b) in enumerate(TimeSeriesSplit(5, gap=20).split(t[e])):
        print(f"  CV kat {k + 1}: eğitim son hedef {t['son'][e].iloc[a[-1]].date()} | doğrulama {t.index[e][b[0]].date()} – {t.index[e][b[-1]].date()}")
    if abs(float(cv_r2) - _R["cv"]) > 1e-6:
        if abs(float(cv_r2) - _R["cv_full"]) < 1e-6:
            print("❌ cv_r2 bütün tabloyla (2015 sonrası dâhil) hesaplanmış. Model seçimi için çapraz doğrulama yalnızca eğitim bölümünde (egt) yapılır; saklı test en sona kalır."); return
        if abs(float(cv_r2) - _R["cv_rand"]) < 1e-3:
            print("❌ cv_r2 rastgele bölmeyle (KFold, shuffle) hesaplanmış: zaman serisinde TimeSeriesSplit(5, gap=20) kullan."); return
        if abs(float(cv_r2) - _R["cv_nogap"]) < 1e-6 and abs(_R["cv_nogap"] - _R["cv"]) > 1e-6:
            print("❌ cv_r2'de boşluk yok: TimeSeriesSplit(n_splits=5, gap=20)."); return
        print("❌ cv_r2 beklenenden farklı: yalnızca eğitim satırlarında (egt) LinearRegression, X = v5, v20, v60; cv=TimeSeriesSplit(n_splits=5, gap=20), scoring='r2', ortalama."); return
    if abs(float(test_r2) - _R["test"]) > 1e-6:
        if abs(float(test_r2) - _R["test_eski"]) < 1e-6:
            print("❌ Eğitim kesimi tarihle yapılmış ama hedefin bitişi denetlenmemiş: 2014'ün son 20 kararının hedefi 2015'e taşıyor. egt = tablo['hedef_son'] < '2015-01-01' kullan."); return
        print("❌ test_r2 beklenenden farklı: model yalnızca egt (hedefi 2015'ten önce biten kararlar) ile kurulmalı, R² 2015 ve sonrasındaki kararlarda hesaplanmalı."); return
    if abs(float(naif_r2) - _R["naive"]) > 1e-6:
        print("❌ naif_r2 beklenenden farklı: test döneminde r2_score(y, tablo['v60'])."); return
    print(f"✅ Tüm kontroller geçti (eğitimde cv R² {_R['cv']:.3f}, test R² {_R['test']:.3f}, saf v60 {_R['naive']:.3f}). Tamamlama kodun: " + _k("''' + b64(CODES["A"]) + '''"))

def kontrol_B(vt, q, asim_orani, asim_normal):
    v = _R["v"]
    if "y_r" not in vt.columns or "v60" not in vt.columns:
        print("❌ vt'de y_r ve v60 sütunları olmalı (20 günlük tablodan ayrı, bir günlük VaR tablosu)."); return
    if len(vt) != len(v) or not vt.index.equals(v.index):
        if len(vt) < len(v):
            print(f"❌ vt'nin {len(vt)} satırı var, {len(v)} bekleniyor: y_v gibi gereksiz sütunlar yüzünden son kararlar atılmış olabilir. Yalnızca y_r ve v60 (ve gerçekleşme tarihi) ile kur, sonra dropna()."); return
        print("❌ vt'nin satırları beklenenden farklı."); return
    if not np.allclose(vt["y_r"].values, v["y_r"].values):
        print("❌ vt['y_r'] yarının getirisi olmalı: r.shift(-1)."); return
    print(f"Kalibrasyon: son karar {v.index[_R['ve']][-1].date()}, son gerçekleşme {v['g'][_R['ve']].iloc[-1].date()} | test: {_R['vs'].sum()} karar, {v.index[_R['vs']][0].date()} – {v.index[_R['vs']][-1].date()}, son gerçekleşme {v['g'][_R['vs']].iloc[-1].date()}")
    if abs(float(q) - _R["q"]) > 1e-9:
        if abs(float(q) - _R["q_all"]) < 1e-9:
            print("❌ Çarpan bütün veriden (test dâhil) öğrenilmiş: yalnızca getirisi 2015'ten önce gerçekleşen kararların y_r / v60 oranını kullan."); return
        if abs(float(q) - _R["q_eski"]) < 1e-9:
            print("❌ Çarpan karar tarihine göre kesilmiş: son kararın getirisi 2 Ocak 2015'e ait. Gerçekleşme tarihine göre kes: vt['gerceklesme'] < '2015-01-01'."); return
        print("❌ q beklenenden farklı: getirisi 2015'ten önce gerçekleşen kararlarda (y_r / v60) oranının %1 yüzdeliği, np.quantile(..., 0.01)."); return
    if abs(float(asim_orani) - _R["exc"]) > 1e-9:
        print("❌ asim_orani beklenenden farklı: 2015 ve sonrasındaki kararlarda (y_r < q * v60) ortalaması."); return
    if abs(float(asim_normal) - _R["exc_n"]) > 1e-9:
        print("❌ asim_normal beklenenden farklı: 2015 ve sonrasındaki kararlarda (y_r < -2.326 * v60) ortalaması."); return
    print(f"✅ Tüm kontroller geçti (çarpan {_R['q']:.4f}; aşım {_R['n_exc']}/{_R['vs'].sum()} = %{100 * _R['exc']:.2f}, normal çarpanla {_R['n_exc_n']}/{_R['vs'].sum()} = %{100 * _R['exc_n']:.2f}). Tamamlama kodun: " + _k("''' + b64(CODES["B"]) + '''"))
''',
    "en": COMMON + '''
fx = pd.read_csv("''' + URL + '''", index_col=0, parse_dates=True).iloc[:, 0]
fx = pd.to_numeric(fx, errors="coerce").dropna()                    # dollars per pound; New York noon buying rate
print(f"Data version: fx {fx.index[0].date()} – {fx.index[-1].date()}, {len(fx)} observations (FRED updates every business day; the last digits of the results depend on the data version)")
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
        print("❌ y_v differs from the expected one: the volatility of the next 20 observations, np.sqrt((r ** 2).rolling(20).mean().shift(-20))."); return
    t, e = _R["t"], _R["e"]
    print(f"Training: {e.sum()} decisions, last decision {t.index[e][-1].date()}, last target end {t['son'][e].iloc[-1].date()} | test: {_R['s'].sum()} decisions, first decision {t.index[_R['s']][0].date()}")
    for k, (a, b) in enumerate(TimeSeriesSplit(5, gap=20).split(t[e])):
        print(f"  CV fold {k + 1}: training last target {t['son'][e].iloc[a[-1]].date()} | validation {t.index[e][b[0]].date()} – {t.index[e][b[-1]].date()}")
    if abs(float(cv_r2) - _R["cv"]) > 1e-6:
        if abs(float(cv_r2) - _R["cv_full"]) < 1e-6:
            print("❌ cv_r2 was computed with the whole table (post-2015 included). Cross-validation for model choice is done on the training part (trn) only; the held-out test comes last."); return
        if abs(float(cv_r2) - _R["cv_rand"]) < 1e-3:
            print("❌ cv_r2 was computed with a random split (KFold, shuffle): with time series use TimeSeriesSplit(5, gap=20)."); return
        if abs(float(cv_r2) - _R["cv_nogap"]) < 1e-6 and abs(_R["cv_nogap"] - _R["cv"]) > 1e-6:
            print("❌ cv_r2 has no gap: TimeSeriesSplit(n_splits=5, gap=20)."); return
        print("❌ cv_r2 differs from the expected value: on the training rows (trn) only, LinearRegression, X = v5, v20, v60; cv=TimeSeriesSplit(n_splits=5, gap=20), scoring='r2', mean."); return
    if abs(float(test_r2) - _R["test"]) > 1e-6:
        if abs(float(test_r2) - _R["test_eski"]) < 1e-6:
            print("❌ The training cut was made by date without checking where the target ends: the targets of the last 20 decisions of 2014 reach into 2015. Use trn = table['target_end'] < '2015-01-01'."); return
        print("❌ test_r2 differs from the expected value: the model should be fitted on trn only (decisions whose target ends before 2015) and R² computed on decisions from 2015 on."); return
    if abs(float(naive_r2) - _R["naive"]) > 1e-6:
        print("❌ naive_r2 differs from the expected value: r2_score(y, table['v60']) in the test period."); return
    print(f"✅ All checks passed (training cv R² {_R['cv']:.3f}, test R² {_R['test']:.3f}, naive v60 {_R['naive']:.3f}). Your completion code: " + _k("''' + b64(CODES["A"]) + '''"))

def check_B(vt, q, exc_rate, exc_normal):
    v = _R["v"]
    if "y_r" not in vt.columns or "v60" not in vt.columns:
        print("❌ vt should have the columns y_r and v60 (a one-day VaR table, separate from the 20-day table)."); return
    if len(vt) != len(v) or not vt.index.equals(v.index):
        if len(vt) < len(v):
            print(f"❌ vt has {len(vt)} rows, {len(v)} expected: the last decisions may have been dropped because of unneeded columns such as y_v. Build it with y_r and v60 (and the realisation date) only, then dropna()."); return
        print("❌ vt's rows differ from the expected ones."); return
    if not np.allclose(vt["y_r"].values, v["y_r"].values):
        print("❌ vt['y_r'] should be tomorrow's return: r.shift(-1)."); return
    print(f"Calibration: last decision {v.index[_R['ve']][-1].date()}, last realisation {v['g'][_R['ve']].iloc[-1].date()} | test: {_R['vs'].sum()} decisions, {v.index[_R['vs']][0].date()} – {v.index[_R['vs']][-1].date()}, last realisation {v['g'][_R['vs']].iloc[-1].date()}")
    if abs(float(q) - _R["q"]) > 1e-9:
        if abs(float(q) - _R["q_all"]) < 1e-9:
            print("❌ The multiplier was learned from all the data (test included): use only the y_r / v60 ratio of decisions whose return was realised before 2015."); return
        if abs(float(q) - _R["q_eski"]) < 1e-9:
            print("❌ The multiplier was cut by decision date: the last decision's return belongs to 2 January 2015. Cut by realisation date: vt['realised_on'] < '2015-01-01'."); return
        print("❌ q differs from the expected value: the 1% quantile of (y_r / v60) for decisions whose return was realised before 2015, np.quantile(..., 0.01)."); return
    if abs(float(exc_rate) - _R["exc"]) > 1e-9:
        print("❌ exc_rate differs from the expected value: the mean of (y_r < q * v60) for decisions from 2015 on."); return
    if abs(float(exc_normal) - _R["exc_n"]) > 1e-9:
        print("❌ exc_normal differs from the expected value: the mean of (y_r < -2.326 * v60) for decisions from 2015 on."); return
    print(f"✅ All checks passed (multiplier {_R['q']:.4f}; exceedances {_R['n_exc']}/{_R['vs'].sum()} = {100 * _R['exc']:.2f}%, with the normal multiplier {_R['n_exc_n']}/{_R['vs'].sum()} = {100 * _R['exc_n']:.2f}%). Your completion code: " + _k("''' + b64(CODES["B"]) + '''"))
''',
}

T = {
    "tr": dict(
        title="# ML Laboratuvarı · Modül 6, Ünite 9: Sterlin volatilitesi ve VaR",
        intro="""**Prof. Dr. Mehmet Songur** · ML Laboratuvarı, Modül 6

Veri: sterlin/dolar kuru, günlük, 1971'den bu yana (FRED: DEXUSUK, ABD Merkez Bankası H.10 serisi, kamu malı). Kurulum hücresi `kur` adlı seriyi (tarih indeksli) indirir ve veri sürümünü (ilk ve son tarih) yazar. Kur New York öğle alış kurudur, kapanış değil; getiri ardışık iki mevcut kotasyon arasını ölçer.

**Önce kopyala:** **Dosya → Drive'a kopya kaydet** ile kendi kopyanda çalış. Hücrelere başlıklarıyla başvuruyoruz: Kurulum, Görev A, Kontrol A, Görev B, Kontrol B. Kodu **Gemini'ye yazdır**, sonra **denetle**.

**Kurallar**
1. **Kurulum** ve **Kontrol** hücrelerini değiştirme; yalnızca çalıştır.
2. Görev hücrelerinde kodu Gemini ile üret; çalıştırmadan önce oku.
3. Kontrol hücresi geçerse bir **tamamlama kodu** verir; onu ML Laboratuvarı'ndaki kutuya yapıştır.""",
        setup_title="#@title Kurulum — çalıştır, değiştirme",
        after_setup="\nkur.tail(3)",
        taskA="""## Görev A — Volatilite öngörüsü

1. Günlük log getiri: `r = 100 * np.log(kur).diff().dropna()`.
2. `tablo` adlı bir DataFrame: w = 5, 20, 60 için `v{w} = np.sqrt((r ** 2).rolling(w).mean())` (yalnızca geçmiş); hedef `y_v = np.sqrt((r ** 2).rolling(20).mean().shift(-20))` (sonraki 20 mevcut gözlem); hedefin bittiği tarih `tablo["hedef_son"] = pd.Series(r.index, index=r.index).shift(-20)`; sonra `dropna()`.
3. Eğitim ve test: `egt = tablo["hedef_son"] < "2015-01-01"` (hedefi 2015'ten önce tamamen gözlenmiş kararlar), `tst = tablo.index >= "2015-01-01"`. 2014'ün son 20 kararı ikisine de girmez.
4. `X = tablo[["v5", "v20", "v60"]]`, `y = tablo["y_v"]`. Model seçimi için çapraz doğrulama **yalnızca eğitim bölümünde**: `cross_val_score(LinearRegression(), X[egt], y[egt], cv=TimeSeriesSplit(n_splits=5, gap=20), scoring="r2")` ortalaması `cv_r2`.
5. Modeli yalnızca `egt` ile kur; `tst` için R²: `test_r2`. Saf tahmin olarak `tablo.loc[tst, "v60"]`'ın R²'si: `naif_r2`. Kontrol hücresi kat tarihlerini, son eğitim hedefini ve ilk test kararını yazar.

**Denetim soruları:** Rastgele bölme (`train_test_split`, `KFold(shuffle=True)`) var mı? Pencereler geçmişe mi bakıyor? Hedef geleceğe mi? Son eğitim hedefi ilk test kararından önce mi bitiyor?""",
        taskA_code="# Görev A: Gemini ile kodu burada üret, oku, sonra çalıştır.\n",
        checkA_md="### Kontrol A — çalıştır, değiştirme",
        checkA="kontrol_A(r, tablo, cv_r2, test_r2, naif_r2)",
        taskB="""## Görev B — Riske maruz değer (%1 VaR)

1. VaR için 20 günlük tablodan **ayrı** bir tablo kur (yoksa `y_v`'nin eksikleri son 19 kararı atar): `vt = pd.DataFrame({"y_r": r.shift(-1), "v60": np.sqrt((r ** 2).rolling(60).mean())})`, getirinin gerçekleştiği tarih `vt["gerceklesme"] = pd.Series(r.index, index=r.index).shift(-1)`, sonra `dropna()`.
2. Çarpan: **getirisi 2015'ten önce gerçekleşen** kararlarda (`vt["gerceklesme"] < "2015-01-01"`) `y_r / v60` oranının %1 yüzdeliği: `q = np.quantile(..., 0.01)`. Bu, %1 alt getiri eşiğinin çarpanıdır (negatif); kayıp cinsinden VaR = −q × v60.
3. Aşım: `vt["y_r"] < q * vt["v60"]`. 2015 ve sonrasındaki kararlarda ortalaması: `asim_orani`.
4. Aynısını normal dağılım çarpanıyla (−2.326) yap: `asim_normal`. İkisini %1 hedefiyle karşılaştır; aşım sayısını, n'yi ve aşımların yıllara göre dağılımını da yazdır.

**Denetim soruları:** Çarpan yalnızca eğitim döneminden mi öğrenildi? Kalibrasyondaki son getiri 2015'ten önce mi? Aşımlar hangi yıllarda yığılıyor?""",
        taskB_code="# Görev B: Gemini ile kodu burada üret, oku, sonra çalıştır.\n",
        checkB_md="### Kontrol B — çalıştır, değiştirme",
        checkB="kontrol_B(vt, q, asim_orani, asim_normal)",
        notes="""## Denetim notların

- Gemini zamana saygılı mı çalıştı? Neyi düzeltmen gerekti?
- Sterlin sonuçları euro/dolarla nasıl karşılaştırılıyor? (cv_r2, test_r2, naif_r2)
- VaR sonuçlarını bir risk komitesine nasıl anlatırsın? (aşım oranı, normal çarpanla fark, sınırlılıklar)""",
    ),
    "en": dict(
        title="# ML Lab · Module 6, Unit 9: Sterling volatility and VaR",
        intro="""**Prof. Dr. Mehmet Songur** · ML Lab, Module 6

Data: the sterling/dollar rate, daily since 1971 (FRED: DEXUSUK, the US Federal Reserve's H.10 series, public domain). The setup cell downloads a series called `fx` (date-indexed) and prints the data version (first and last date). The rate is the New York noon buying rate, not a close; the return measures the change between two consecutive available quotes.

**Copy first:** work in your own copy via **File → Save a copy in Drive**. We refer to the cells by their titles: Setup, Task A, Check A, Task B, Check B. **Have Gemini write the code**, then **audit it**.

**Rules**
1. Do not change the **Setup** and **Check** cells; just run them.
2. Generate code with Gemini in the task cells; read it before running.
3. If a check cell passes, it gives you a **completion code**; paste it into the box in ML Lab.""",
        setup_title="#@title Setup — run it, do not change it",
        after_setup="\nfx.tail(3)",
        taskA="""## Task A — Volatility forecast

1. Daily log return: `r = 100 * np.log(fx).diff().dropna()`.
2. A DataFrame called `table`: for w = 5, 20, 60, `v{w} = np.sqrt((r ** 2).rolling(w).mean())` (past only); target `y_v = np.sqrt((r ** 2).rolling(20).mean().shift(-20))` (the next 20 available observations); the date the target ends `table["target_end"] = pd.Series(r.index, index=r.index).shift(-20)`; then `dropna()`.
3. Training and test: `trn = table["target_end"] < "2015-01-01"` (decisions whose target was fully observed before 2015), `tst = table.index >= "2015-01-01"`. The last 20 decisions of 2014 enter neither.
4. `X = table[["v5", "v20", "v60"]]`, `y = table["y_v"]`. Cross-validation for model choice **on the training part only**: the mean of `cross_val_score(LinearRegression(), X[trn], y[trn], cv=TimeSeriesSplit(n_splits=5, gap=20), scoring="r2")` is `cv_r2`.
5. Fit the model on `trn` only; R² on `tst`: `test_r2`. The R² of `table.loc[tst, "v60"]` as the naive forecast: `naive_r2`. The check cell prints the fold dates, the last training target and the first test decision.

**Audit questions:** Is there a random split (`train_test_split`, `KFold(shuffle=True)`)? Do the windows look backward? Does the target look forward? Does the last training target end before the first test decision?""",
        taskA_code="# Task A: generate the code with Gemini here, read it, then run it.\n",
        checkA_md="### Check A — run it, do not change it",
        checkA="check_A(r, table, cv_r2, test_r2, naive_r2)",
        taskB="""## Task B — Value at risk (1% VaR)

1. Build a table for VaR **separate** from the 20-day table (otherwise the missing values of `y_v` drop the last 19 decisions): `vt = pd.DataFrame({"y_r": r.shift(-1), "v60": np.sqrt((r ** 2).rolling(60).mean())})`, the date the return is realised `vt["realised_on"] = pd.Series(r.index, index=r.index).shift(-1)`, then `dropna()`.
2. Multiplier: the 1% quantile of `y_r / v60` for decisions **whose return was realised before 2015** (`vt["realised_on"] < "2015-01-01"`): `q = np.quantile(..., 0.01)`. This is the multiplier of the 1% lower return threshold (negative); VaR in loss terms = −q × v60.
3. Exceedance: `vt["y_r"] < q * vt["v60"]`. Its mean over decisions from 2015 on: `exc_rate`.
4. Do the same with the normal multiplier (−2.326): `exc_normal`. Compare both with the 1% target; also print the number of exceedances, n and how exceedances are spread across years.

**Audit questions:** Was the multiplier learned from the training period only? Is the last return in the calibration before 2015? In which years do exceedances pile up?""",
        taskB_code="# Task B: generate the code with Gemini here, read it, then run it.\n",
        checkB_md="### Check B — run it, do not change it",
        checkB="check_B(vt, q, exc_rate, exc_normal)",
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
