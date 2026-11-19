"""Modül 7 kavram anlatımındaki şekilleri (satır içi SVG) üretir → content/m7/m7-figs.js
Ayrıca oyun alanı için NMF konularını yazar → data/fomc/nmf_topics.json
Veri: data/wb/countries.csv (Dünya Bankası), data/fred/TB3MS…GS10, FEDFUNDS (FRED), data/fomc/statements.csv (FOMC).
Çalıştırma: python3 tools/m7_figs.py   (depo kökünden)"""
import os, sys, json, re
import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings("ignore")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from figlib import Fig, Panel, L, num, legend, flow, write, ROOT
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.decomposition import PCA, NMF
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import KFold, TimeSeriesSplit, cross_val_score

FIGS, NUMS = {}, {}
DATA = os.path.join(ROOT, "data")


def both(name, fn):
    FIGS[name] = {lang: fn(lang) for lang in ("tr", "en")}


def P(v, d, lang):
    return ("%" + num(v, d, lang)) if lang == "tr" else num(v, d, lang) + "%"


# ---------------------------------------------------------------- veri
u = pd.read_csv(os.path.join(DATA, "wb/countries.csv"))
DEG = ["gdppc_ppp", "inflation", "unemployment", "trade", "agriculture", "urban", "life_exp", "fertility"]
X = u[DEG].copy(); X["gdppc_ppp"] = np.log(X["gdppc_ppp"])
Z = StandardScaler().fit_transform(X)
X2 = X.copy(); X2["inflation"] = np.log(X2["inflation"]); Z2 = StandardScaler().fit_transform(X2)

MATS = ["TB3MS", "TB6MS", "GS1", "GS2", "GS3", "GS5", "GS7", "GS10"]
yc = pd.concat([pd.read_csv(os.path.join(DATA, f"fred/{m}.csv"), index_col=0, parse_dates=True).iloc[:, 0] for m in MATS], axis=1)
yc.columns = MATS; yc = yc.apply(pd.to_numeric, errors="coerce").dropna()
MY = np.array([0.25, 0.5, 1, 2, 3, 5, 7, 10])

st = pd.read_csv(os.path.join(DATA, "fomc/statements.csv"), parse_dates=["date"])
ff = pd.read_csv(os.path.join(DATA, "fred/FEDFUNDS.csv"), index_col=0, parse_dates=True).iloc[:, 0]
SA = ["tighten", "tightening", "firming", "raise", "increase", "elevated", "pressures", "upside", "strong", "robust", "solid", "reduce"]
GU = ["accommodative", "accommodation", "ease", "easing", "lower", "decline", "weak", "weakened", "slack", "downside", "subdued", "purchases"]


def say(m, ks):
    return sum(len(re.findall(r"\b" + k + r"\b", m)) for k in ks)


low = st.text.str.lower()
s_, g_ = low.map(lambda m: say(m, SA)), low.map(lambda m: say(m, GU))
st["ton"] = (s_ - g_) / (s_ + g_).clip(lower=1)


def chg(t, m):
    e = (t + pd.DateOffset(months=m)).replace(day=1)
    return ff.asof(e) - ff.asof(t.replace(day=1)) if e <= ff.index[-1] else np.nan


def pay(lab, v):
    return (v.groupby(lab).transform("mean").var() / v.var())


VL = {"tr": ["gelir", "enflasyon", "işsizlik", "dış ticaret", "tarım", "kentleşme", "yaşam süresi", "doğurganlık"],
      "en": ["income", "inflation", "unemployment", "trade", "agriculture", "urban", "life exp.", "fertility"]}


# ============================================================ Ünite 1
def u1_steps(lang):
    rng = np.random.default_rng(4)
    pts = np.vstack([rng.normal(c, 0.8, (18, 2)) for c in [(2.5, 2.5), (2.5, 7.5), (7.5, 5)]])
    C0 = np.array([[1.5, 4.5], [4.5, 8.5], [5, 4.0]])
    f = Fig(660, 250)
    titles = L(["1. Başlangıç merkezleri", "2. En yakın merkeze ata", "3. Merkezleri taşı, tekrarla"],
               ["1. Starting centres", "2. Assign to nearest centre", "3. Move centres, repeat"])[lang]
    C = C0.copy()
    lab = np.argmin(((pts[:, None, :] - C[None]) ** 2).sum(2), 1)
    states = [(None, C0), (lab, C0)]
    for _ in range(10):
        C = np.array([pts[lab == j].mean(0) for j in range(3)])
        lab = np.argmin(((pts[:, None, :] - C[None]) ** 2).sum(2), 1)
    states.append((lab, C))
    cls = ["d0", "d1", "d4"]; bx = ["bar b0", "bar b1", "bar b4"]
    for k, (lb, cc) in enumerate(states):
        p = Panel(f, 20 + k * 215, 30, 190, 190, (0, 10), (0, 10))
        f.rect(p.x, p.y, p.w, p.h, "box soft", 6)
        f.text(p.x + p.w / 2, 20, titles[k], "lb")
        for i, (a, b) in enumerate(pts):
            f.circle(p.sx(a), p.sy(b), 3.5, "d6" if lb is None else cls[lb[i]])
        for j, (a, b) in enumerate(cc):
            f.rect(p.sx(a) - 6, p.sy(b) - 6, 12, 12, bx[j], 2)
        if k == 2:
            for j in range(3):
                f.arrow(p.sx(C0[j, 0]), p.sy(C0[j, 1]), p.sx(cc[j, 0]), p.sy(cc[j, 1]), "arr dash", 6)
    f.text(330, 244, L("Kareler merkezler. Atamalar değişmeyince durur.", "Squares are centres. It stops when the assignments no longer change.")[lang], "ann")
    return f.svg("kmeans")


def u1_scale(lang):
    a = pay(KMeans(4, n_init=10, random_state=0).fit(X).labels_, X).values
    b = pay(KMeans(4, n_init=10, random_state=0).fit(Z).labels_, X).values
    NUMS["u1_raw"] = a.round(2).tolist(); NUMS["u1_z"] = b.round(2).tolist()
    f = Fig(660, 290)
    for k, (v, tt) in enumerate([(a, L("Ölçeklemeden", "Without scaling")), (b, L("Standartlaştırılmış", "Standardised"))]):
        x0 = 120 + k * 280
        f.text(x0 + 110, 20, tt[lang], "lb")
        for i in range(8):
            y = 36 + i * 28
            if k == 0:
                f.text(x0 - 8, y + 14, VL[lang][i], "tk", "end")
            f.rect(x0, y, 220, 18, "box soft", 3)
            f.rect(x0, y, 220 * v[i], 18, "bar " + ("b3" if v[i] > 0.6 else "b1"), 3)
            f.text(x0 + 220 * v[i] + 4 if v[i] < 0.85 else x0 + 220 * v[i] - 4, y + 13, P(100 * v[i], 0, lang), "val" if v[i] < 0.85 else "lbw", "start" if v[i] < 0.85 else "end")
    f.text(330, 282, L("Her değişkenin varyansının dört kümece açıklanan payı (157 ülke)", "Share of each variable's variance explained by the four clusters (157 countries)")[lang], "ann")
    return f.svg("scale")


# ============================================================ Ünite 2
def u2_select(lang):
    rows = []
    for k in range(2, 9):
        l1 = KMeans(k, n_init=10, random_state=0).fit(Z); l2 = KMeans(k, n_init=10, random_state=0).fit(Z2)
        rows.append((k, l1.inertia_, silhouette_score(Z, l1.labels_), silhouette_score(Z2, l2.labels_)))
    r = np.array(rows)
    f = Fig(660, 285)
    p1 = Panel(f, 60, 30, 240, 190, (2, 8), (250, 800))
    p1.frame(xt=list(range(2, 9)), yt=[300, 500, 700], xl="k", yl="inertia", xfmt=str, yfmt=str)
    p1.curve(r[:, 0], r[:, 1], "l1 thick"); p1.dots(r[:, 0], r[:, 1], "d1", 4)
    f.text(180, 20, L("Inertia: hep düşer", "Inertia: always falls")[lang], "lb")
    p2 = Panel(f, 390, 30, 240, 190, (2, 8), (0.18, 0.42))
    p2.frame(xt=list(range(2, 9)), yt=[0.2, 0.3, 0.4], xl="k", yl=L("siluet", "silhouette")[lang], xfmt=str, yfmt=lambda v: num(v, 1, lang))
    p2.curve(r[:, 0], r[:, 2], "l4 thick"); p2.dots(r[:, 0], r[:, 2], "d4", 4)
    p2.curve(r[:, 0], r[:, 3], "l0 thick dash"); p2.dots(r[:, 0], r[:, 3], "d0", 4)
    f.circle(p2.sx(3), p2.sy(r[1, 2]), 8, "dh")
    f.text(p2.sx(3) + 10, p2.sy(r[1, 2]) - 8, L("3 ülkelik küme", "3-country cluster")[lang], "ann bad", "start")
    f.text(510, 20, L("Siluet: en yüksek k", "Silhouette: highest k")[lang], "lb")
    f.line(400, 274, 418, 274, "l4"); f.text(424, 278, L("ham enflasyon", "raw inflation")[lang], "lg", "start")
    f.line(520, 274, 538, 274, "l0 dash"); f.text(544, 278, L("log enflasyon", "log inflation")[lang], "lg", "start")
    return f.svg("select")


def u2_outlier(lang):
    inf = u.inflation.values
    f = Fig(660, 200)
    for k, (v, xr, xt, tt, fm) in enumerate([(inf, (0, 190), [0, 50, 100, 150], L("Enflasyon (%), 2019–2023 ortalaması", "Inflation (%), 2019–2023 average"), str),
                                              (np.log(inf), (-2.5, 5.5), [-2, 0, 2, 4], L("Enflasyonun logaritması", "Logarithm of inflation"), lambda v: num(v, 0, lang))]):
        p = Panel(f, 40 + k * 320, 40, 280, 90, xr, (0, 1))
        f.text(p.x + p.w / 2, 24, tt[lang], "lb")
        f.line(p.x, p.y + p.h, p.x + p.w, p.y + p.h, "ax")
        for x in xt:
            f.text(p.sx(x), p.y + p.h + 15, fm(x), "tk")
        rng = np.random.default_rng(1)
        for i, x in enumerate(v):
            hot = u.iso3.iloc[i] in ("LBN", "SDN", "ZWE")
            f.circle(p.sx(x), p.sy(0.15 + 0.7 * rng.random()), 4.5 if hot else 3, "d4" if hot else "d1")
        zz = (v - v.mean()) / v.std()
        f.text(p.x + p.w, p.y + p.h + 34, L(f"en uç: ortalamadan {num(zz.max(), 1, lang)} std uzak", f"most extreme: {num(zz.max(), 1, 'en')} sd from the mean")[lang], "ann", "end")
    f.text(330, 194, L("Pembe: Lübnan, Sudan, Zimbabve", "Pink: Lebanon, Sudan, Zimbabwe")[lang], "ann")
    return f.svg("outlier")


# ============================================================ Ünite 3
def u3_curves(lang):
    f = Fig(660, 280)
    p = Panel(f, 60, 20, 440, 210, (0, np.sqrt(10)), (0, 16))
    p.frame(xt=list(np.sqrt([0.25, 1, 2, 5, 10])), yt=[0, 5, 10, 15], xl=L("vade (yıl, karekök ölçek)", "maturity (years, square-root scale)")[lang], yl=L("faiz (%)", "yield (%)")[lang],
            xfmt=lambda v: num(v ** 2, 2 if v < 0.6 else 0, lang), yfmt=str)
    picks = [("1980-12", "l3", L("ters, çok yüksek", "inverted, very high")), ("2013-06", "l1", L("dik, sıfıra yakın", "steep, near zero")),
             ("2023-06", "l4", L("ters", "inverted")), (yc.index[-1].strftime("%Y-%m"), "l0", L("son ay", "latest month"))]
    for k, (d, c, lab) in enumerate(picks):
        y = yc.loc[d].values.ravel()[:8]
        p.curve(np.sqrt(MY), y, c + " thick"); p.dots(np.sqrt(MY), y, "d6", 2.5)
        f.line(520, 50 + k * 30, 545, 50 + k * 30, c + " thick")
        f.text(552, 54 + k * 30, d, "lb", "start"); f.text(552, 68 + k * 30, lab[lang], "tk", "start")
    return f.svg("curves")


def u3_load(lang):
    pca = PCA(3).fit(yc); V = pca.components_ * np.sign(pca.components_[:, -1:])
    ev = pca.explained_variance_ratio_
    NUMS["u3_ev"] = ev.round(4).tolist()
    f = Fig(660, 270)
    p = Panel(f, 60, 20, 400, 200, (0, np.sqrt(10)), (-0.6, 0.6))
    p.frame(xt=list(np.sqrt([0.25, 1, 2, 5, 10])), yt=[-0.5, 0, 0.5], xl=L("vade (yıl)", "maturity (years)")[lang], yl=L("yükleme", "loading")[lang],
            xfmt=lambda v: num(v ** 2, 2 if v < 0.6 else 0, lang), yfmt=lambda v: num(v, 1, lang))
    f.line(p.x, p.sy(0), p.x + p.w, p.sy(0), "ax")
    names = L(["düzey", "eğim", "eğrilik"], ["level", "slope", "curvature"])[lang]
    for j, c in enumerate(["l0", "l1", "l4"]):
        p.curve(np.sqrt(MY), V[j], c + " thick"); p.dots(np.sqrt(MY), V[j], "d" + c[1], 3)
    for j, c in enumerate(["l0", "l1", "l4"]):
        yy = 60 + j * 52
        f.line(490, yy - 4, 512, yy - 4, c + " thick")
        f.text(520, yy, f"PC{j + 1}: {names[j]}", "lb", "start")
        f.text(520, yy + 17, P(100 * ev[j], 1 if ev[j] > 0.01 else 2, lang) + L(" varyans", " of variance")[lang], "tk", "start")
    return f.svg("load")


# ============================================================ Ünite 4
def u4_map(lang):
    pca = PCA(2).fit(Z); S = pca.transform(Z)
    sg = np.sign([pca.components_[0][0], pca.components_[1][2]]); S = S * sg
    inc = ["High income", "Upper middle income", "Lower middle income", "Low income"]
    cls = ["d0", "d1", "d3", "d4"]
    f = Fig(660, 380)
    p = Panel(f, 50, 15, 450, 300, (S[:, 0].min() - 0.3, S[:, 0].max() + 0.3), (S[:, 1].min() - 0.3, S[:, 1].max() + 0.3))
    p.frame(xl=L("PC1: kalkınma →", "PC1: development →")[lang], yl=L("PC2: işsizlik, enflasyon →", "PC2: unemployment, inflation →")[lang], grid=False)
    f.line(p.sx(0), p.y, p.sx(0), p.y + p.h, "gr"); f.line(p.x, p.sy(0), p.x + p.w, p.sy(0), "gr")
    for i in range(len(u)):
        f.circle(p.sx(S[i, 0]), p.sy(S[i, 1]), 3.6, cls[inc.index(u.income.iloc[i].strip())])
    for iso in ["TUR", "USA", "IND", "NGA", "ZAF", "JPN", "ARG", "ZWE"]:
        i = u.index[u.iso3 == iso]
        if len(i):
            i = i[0]; f.text(p.sx(S[i, 0]) + 5, p.sy(S[i, 1]) - 5, u.country.iloc[i] if iso != "TUR" else "Türkiye", "lb" if iso == "TUR" else "tk", "start")
    legend(f, 520, 40, list(zip(cls, L(["Yüksek gelir", "Üst orta gelir", "Alt orta gelir", "Düşük gelir"], ["High income", "Upper middle", "Lower middle", "Low income"])[lang])), 20)
    ev = PCA().fit(Z).explained_variance_ratio_
    f.text(520, 150, L("Açıklanan varyans", "Explained variance")[lang], "lb", "start")
    f.text(520, 170, f"PC1 {P(100 * ev[0], 0, lang)} · PC2 {P(100 * ev[1], 0, lang)}", "tk", "start")
    f.text(520, 188, L(f"harita: {P(100 * ev[:2].sum(), 0, lang)}", f"map: {P(100 * ev[:2].sum(), 0, lang)}")[lang], "tk", "start")
    f.text(275, 372, L("Renkler gelir grubu; gelir grubu PCA'ya verilmedi.", "Colours are income groups; the income group was not given to PCA.")[lang], "ann")
    return f.svg("map")


def u4_units(lang):
    raw = PCA().fit(u[DEG]).explained_variance_ratio_; sc = PCA().fit(Z).explained_variance_ratio_
    f = Fig(660, 210)
    for k, (v, tt, c) in enumerate([(raw, L("Ham göstergeler (farklı birimler)", "Raw indicators (different units)"), "b3"), (sc, L("Standartlaştırılmış", "Standardised"), "b1")]):
        x0 = 50 + k * 320
        f.text(x0 + 130, 22, tt[lang], "lb")
        p = Panel(f, x0, 36, 260, 130, (0.5, 8.5), (0, 1))
        p.frame(xt=list(range(1, 9)), yt=[0, 0.5, 1], xfmt=lambda v: f"PC{v}", yfmt=lambda v: P(100 * v, 0, lang))
        for j in range(8):
            f.rect(p.sx(j + 1) - 11, p.sy(v[j]), 22, p.sy(0) - p.sy(v[j]), "bar " + c, 2)
        f.text(p.sx(1) + 14, p.sy(v[0]) + 12, P(100 * v[0], 4 if v[0] > 0.99 else 0, lang), "val", "start")
    f.text(330, 202, L("Ham veride ilk bileşen yalnızca kişi başı gelirdir (en büyük varyans).", "In the raw data the first component is just income per head (the largest variance).")[lang], "ann")
    return f.svg("units")


# ============================================================ Ünite 5
def u5_dtm(lang):
    docs = ["The Committee decided to raise the target range", "Inflation remains elevated", "The Committee decided to lower the target range"]
    cv = CountVectorizer(stop_words="english"); B = cv.fit_transform(docs).toarray(); voc = cv.get_feature_names_out()
    f = Fig(660, 230)
    f.text(20, 20, L("Belgeler", "Documents")[lang], "lb", "start")
    for i, d in enumerate(docs):
        f.text(20, 44 + i * 26, f"{i + 1}. {d}", "mono", "start")
    x0, y0, cw = 20, 140, 640 / (len(voc) + 1.3)
    f.text(x0, y0 - 14, L("Belge-terim matrisi (durak kelimeler atıldı)", "Document-term matrix (stop words dropped)")[lang], "lb", "start")
    for j, w in enumerate(voc):
        f.text(x0 + (j + 1.3) * cw, y0 + 8, w, "tk")
    for i in range(3):
        f.text(x0, y0 + 32 + i * 22, f"{i + 1}", "lb", "start")
        for j in range(len(voc)):
            v = B[i, j]
            f.text(x0 + (j + 1.3) * cw, y0 + 32 + i * 22, str(v), "val" if v else "tk")
    return f.svg("dtm")


def u5_bars(lang):
    cv = CountVectorizer(stop_words="english", min_df=3); Bm = cv.fit_transform(st.text)
    tv = TfidfVectorizer(stop_words="english", min_df=3); T = tv.fit_transform(st.text); voc = tv.get_feature_names_out()
    i = st.index[st.date == "2020-03-15"][0]
    b, w = Bm[i].toarray().ravel(), T[i].toarray().ravel()
    f = Fig(660, 270)
    for k, (v, tt, c, d) in enumerate([(b, L("Sayım", "Count"), "b1", 0), (w, "TF-IDF", "b4", 2)]):
        top = v.argsort()[::-1][:8]; mx = v[top[0]]; x0 = 130 + k * 320
        f.text(x0 + 80, 20, tt if isinstance(tt, str) else tt[lang], "lb")
        for r, j in enumerate(top):
            y = 34 + r * 27
            f.text(x0 - 6, y + 13, voc[j], "tk", "end")
            f.rect(x0, y, 170 * v[j] / mx, 18, "bar " + c, 3)
            f.text(x0 + 170 * v[j] / mx + 4, y + 13, num(v[j], d, lang), "val", "start")
    f.text(330, 262, L("15 Mart 2020 açıklaması: en sık kelimeler ve en ayırt edici kelimeler", "The 15 March 2020 statement: most frequent and most distinctive words")[lang], "ann")
    return f.svg("bars")


# ============================================================ Ünite 6
def u6_tone(lang):
    yr = st.groupby(st.date.dt.year).ton.mean(); fy = ff.groupby(ff.index.year).mean().reindex(yr.index)
    f = Fig(660, 270)
    p = Panel(f, 50, 20, 540, 200, (yr.index.min() - 0.5, yr.index.max() + 0.5), (-1, 1))
    p.frame(xt=[2002, 2006, 2010, 2014, 2018, 2022, 2026], yt=[-1, -0.5, 0, 0.5, 1], yl=L("ton", "tone")[lang], yfmt=lambda v: num(v, 1, lang))
    f.line(p.x, p.sy(0), p.x + p.w, p.sy(0), "ax")
    for y, v in yr.items():
        f.rect(p.sx(y) - 8, min(p.sy(v), p.sy(0)), 16, abs(p.sy(v) - p.sy(0)), "bar " + ("b3" if v >= 0 else "b1"), 2)
    q = Panel(f, 50, 20, 540, 200, (yr.index.min() - 0.5, yr.index.max() + 0.5), (0, 6))
    q.curve(fy.index, fy.values, "l6 thick")
    for v in [0, 3, 6]:
        f.text(p.x + p.w + 6, q.sy(v) + 4, P(v, 0, lang), "tk", "start")
    f.text(p.x + p.w + 6, 14, L("faiz", "rate")[lang], "tk", "start")
    f.text(320, 262, L("Turuncu: şahin yıllar · mavi: güvercin yıllar · gri: federal fon oranı (sağ eksen)", "Orange: hawkish years · blue: dovish years · grey: federal funds rate (right axis)")[lang], "ann")
    return f.svg("tone")


def u6_corr(lang):
    hs = [1, 3, 6, 12]; c = [st.ton.corr(st.date.map(lambda t: chg(t, m))) for m in hs]
    pre = st.ton.corr(st.date.map(lambda t: ff.asof(t.replace(day=1)) - ff.asof((t - pd.DateOffset(months=3)).replace(day=1))))
    NUMS["u6_corr"] = [round(x, 3) for x in c] + [round(pre, 3)]
    f = Fig(660, 230)
    p = Panel(f, 60, 20, 520, 160, (-0.5, 4.5), (-0.05, 0.4))
    p.frame(yt=[0, 0.1, 0.2, 0.3], yl=L("korelasyon", "correlation")[lang], yfmt=lambda v: num(v, 1, lang))
    labs = L(["önceki 3 ay", "sonraki 1 ay", "sonraki 3 ay", "sonraki 6 ay", "sonraki 12 ay"], ["previous 3 m", "next 1 m", "next 3 m", "next 6 m", "next 12 m"])[lang]
    for k, v in enumerate([pre] + c):
        f.rect(p.sx(k) - 30, p.sy(max(v, 0)), 60, abs(p.sy(v) - p.sy(0)), "bar " + ("b6" if k == 0 else "b0"), 3)
        f.text(p.sx(k), p.sy(max(v, 0)) - 6, num(v, 2, lang), "val")
        f.text(p.sx(k), p.y + p.h + 16, labs[k], "tk")
    f.text(320, 222, L("Tonun faiz değişimiyle korelasyonu: geçmişle en yüksek, ufuk uzadıkça sıfıra iniyor", "Correlation of tone with the rate change: highest with the past, falling to zero as the horizon grows")[lang], "ann")
    return f.svg("corr")


# ============================================================ Ünite 7
TV7 = TfidfVectorizer(stop_words="english", min_df=3, max_df=0.7, ngram_range=(1, 2)); T7 = TV7.fit_transform(st.text); V7 = TV7.get_feature_names_out()
years = sorted(st.date.dt.year.unique().tolist())
TOP = {"years": years}
for k in range(3, 7):
    nmf = NMF(k, init="nndsvda", random_state=0, max_iter=800); W = nmf.fit_transform(T7)
    order = np.argsort([st.date[W.argmax(1) == j].mean() if (W.argmax(1) == j).any() else pd.Timestamp("2100") for j in range(k)])
    W = W[:, order]; comps = nmf.components_[order]
    Wn = W / np.maximum(W.sum(1, keepdims=True), 1e-12)
    share = [Wn[(st.date.dt.year == y).values].mean(0).round(4).tolist() for y in years]
    TOP[str(k)] = {"words": [[V7[i] for i in c.argsort()[::-1][:6]] for c in comps], "share": share}
with open(os.path.join(DATA, "fomc/nmf_topics.json"), "w", encoding="utf-8") as fh:
    json.dump(TOP, fh, ensure_ascii=False)
print("yazıldı: data/fomc/nmf_topics.json")


def u7_eras(lang):
    M = TOP["5"]; f = Fig(660, 300)
    p = Panel(f, 50, 20, 560, 170, (years[0] - 0.5, years[-1] + 0.5), (0, 1))
    p.frame(xt=[2002, 2006, 2010, 2014, 2018, 2022, 2026], yt=[0, 0.5, 1], yfmt=lambda v: P(100 * v, 0, lang))
    cls = ["b0", "b1", "b4", "b3", "b2"]
    for a, y in enumerate(years):
        acc = 0
        for j, v in enumerate(M["share"][a]):
            f.rect(p.sx(y) - 9, p.sy(acc + v), 18, p.sy(acc) - p.sy(acc + v), "bar " + cls[j]); acc += v
    for j, ws in enumerate(M["words"]):
        f.rect(50, 216 + j * 16, 10, 10, "bar " + cls[j], 2)
        f.text(66, 225 + j * 16, L("Konu ", "Topic ")[lang] + f"{j + 1}: " + ", ".join(ws[:5]), "lg", "start")
    return f.svg("eras")


# ============================================================ Ünite 8
def u8_split(lang):
    s = st.copy(); s["d3"] = s.date.map(lambda t: chg(t, 3)); s = s.dropna(subset=["d3"]).reset_index(drop=True)
    s["y"] = np.select([s.d3 > 0.1, s.d3 < -0.1], ["up", "down"], "flat")
    s["ready"] = s.date.map(lambda t: (t + pd.DateOffset(months=4)).replace(day=1))     # etiketin bilindiği ilk gün
    mdl = make_pipeline(TfidfVectorizer(stop_words="english", min_df=3, max_df=0.7, ngram_range=(1, 2)), LogisticRegression(max_iter=2000))
    rk = cross_val_score(mdl, s.text, s.y, cv=KFold(5, shuffle=True, random_state=0)).mean()
    tr = s.ready <= "2015-01-01"; tt = s.date >= "2015-01-01"
    mdl.fit(s.text[tr], s.y[tr]); te = (mdl.predict(s.text[tt]) == s.y[tt]).mean(); base = (s.y[tt] == "flat").mean()
    folds = [(a[s.ready.values[a] <= s.date.values[b[0]]], b) for a, b in TimeSeriesSplit(5).split(s)]
    ts = cross_val_score(mdl, s.text, s.y, cv=folds).mean(); bts = np.mean([(s.y.values[b] == "flat").mean() for _, b in folds])
    NUMS["u8"] = [round(rk, 3), round(te, 3), round(ts, 3), round(base, 3), round(bts, 3)]
    f = Fig(660, 230)
    p = Panel(f, 60, 20, 560, 160, (-0.5, 4.5), (0, 1))
    p.frame(yt=[0, 0.5, 1], yl=L("doğruluk", "accuracy")[lang], yfmt=lambda v: P(100 * v, 0, lang))
    labs = L(["rastgele KFold", "2015 kesimi (arındırılmış)", "hep “sabit” (2015–)", "TSS(5), arındırılmış", "hep “sabit” (aynı katlar)"], ["random KFold", "2015 cut (purged)", "always “hold” (2015–)", "TSS(5), purged", "always “hold” (same folds)"])[lang]
    for k, (v, c) in enumerate([(rk, "b3"), (te, "b0"), (base, "b6"), (ts, "b0"), (bts, "b6")]):
        f.rect(p.sx(k) - 34, p.sy(v), 68, p.sy(0) - p.sy(v), "bar " + c, 3)
        f.text(p.sx(k), p.sy(v) - 6, P(100 * v, 0, lang), "val")
        f.text(p.sx(k), p.y + p.h + 16, labs[k], "tk")
    f.text(330, 222, L("Sonraki 3 aydaki ortalama faiz farkının sınıfını (artış/indirim/sabit) metinden öngörmek", "Forecasting the class of the 3-month average rate difference (hike/cut/hold) from the text")[lang], "ann")
    return f.svg("split")


def u8_llm(lang):
    f = Fig(660, 180)
    steps = L(["Elle etiketli\nbir örnek ayır", "İstemi yaz,\nörnekleri seç", "LLM ile\netiketle", "Ayrılan örnekte\nuyumu ölç", "Sürümü, istemi,\nsıcaklığı kaydet"],
              ["Set aside a\nhand-labelled set", "Write the prompt,\npick examples", "Label with\nthe LLM", "Measure agreement\non the set aside", "Record version,\nprompt, temperature"])[lang]
    flow(f, steps, 8, 30, 116, 74, 17)
    f.text(330, 140, L("İleriye bakma: LLM, eğitim tarihinden önceki metinlerin “geleceğini” biliyor olabilir.", "Look-ahead: the LLM may know the “future” of texts from before its training date.")[lang], "ann bad")
    f.text(330, 162, L("Dürüst öngörü sınaması, modelin eğitim tarihinden sonraki metinlerle yapılır.", "An honest forecasting test uses texts from after the model's training date.")[lang], "ann")
    return f.svg("llm")


def u9_flow(lang):
    f = Fig(660, 130)
    steps = L(["Ülke verisi:\nlog gelir, log enfl.", "Standartlaştır,\nk = 2…8", "Siluetle k seç,\nARI ile kontrol", "FOMC metni:\nküçük harf, \\b", "Ton ve 3 aylık\nfaiz değişimi"],
              ["Country data:\nlog income, log infl.", "Standardise,\nk = 2…8", "Pick k by silhouette,\ncheck with ARI", "FOMC text:\nlower case, \\b", "Tone and 3-month\nrate change"])[lang]
    flow(f, steps, 8, 26, 116, 70, 17)
    f.text(330, 122, L("Görev A: adım 1–3 · Görev B: adım 4–5", "Task A: steps 1–3 · Task B: steps 4–5")[lang], "ann")
    return f.svg("wsflow")


for n, fn in [("u1_steps", u1_steps), ("u1_scale", u1_scale), ("u2_select", u2_select), ("u2_outlier", u2_outlier), ("u3_curves", u3_curves), ("u3_load", u3_load),
              ("u4_map", u4_map), ("u4_units", u4_units), ("u5_dtm", u5_dtm), ("u5_bars", u5_bars), ("u6_tone", u6_tone), ("u6_corr", u6_corr),
              ("u7_eras", u7_eras), ("u8_split", u8_split), ("u8_llm", u8_llm), ("u9_flow", u9_flow)]:
    print("…", n, flush=True)
    both(n, fn)

write(os.path.join(ROOT, "content/m7/m7-figs.js"), "M7", FIGS, NUMS, "Modül 7 kavram şekilleri")
print(json.dumps(NUMS, ensure_ascii=False, default=float))
print(json.dumps({k: TOP[k]["words"] for k in ["4", "5", "6"]}, ensure_ascii=False))
