"""Modül 6 kavram anlatımındaki şekilleri (satır içi SVG) üretir → content/m6/m6-figs.js
Veri: data/fred/DEXUSEU.csv (FRED, Federal Reserve H.10).
Çalıştırma: python3 tools/m6_figs.py   (depo kökünden)"""
import os, sys, json
import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings("ignore")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from figlib import Fig, Panel, L, num, legend, flow, write, ROOT
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import KFold, TimeSeriesSplit, cross_val_score
from sklearn.metrics import r2_score
from scipy import stats

FIGS, NUMS = {}, {}


def both(name, fn):
    FIGS[name] = {lang: fn(lang) for lang in ("tr", "en")}


kur = pd.to_numeric(pd.read_csv(os.path.join(ROOT, "data/fred/DEXUSEU.csv"), index_col=0, parse_dates=True).iloc[:, 0], errors="coerce").dropna()
r = 100 * np.log(kur).diff().dropna()
t = pd.DataFrame({"r": r})
for k in range(1, 6):
    t[f"r_l{k}"] = r.shift(k - 1)
t["mom20"] = r.rolling(20).sum()
for w in [5, 20, 60]:
    t[f"v{w}"] = np.sqrt((r ** 2).rolling(w).mean())
t["y_r"] = r.shift(-1)
t["y_v"] = np.sqrt((r ** 2).rolling(20).mean().shift(-20))
t = t.dropna()
egt = t.index < "2015-01-01"; tst = ~egt
YRS = (t.index.year + (t.index.dayofyear - 1) / 365.25).values
KY = (kur.index.year + (kur.index.dayofyear - 1) / 365.25).values
RY = (r.index.year + (r.index.dayofyear - 1) / 365.25).values


def yfrac(idx):
    return (idx.year + (idx.dayofyear - 1) / 365.25).values


def thin(x, y, step):
    return x[::step], y[::step]


# ============================================================ Ünite 1
def u1_price(lang):
    f = Fig(660, 300)
    p1 = Panel(f, 60, 20, 570, 110, (1999, 2027), (0.8, 1.65))
    p1.frame(xt=[2000, 2005, 2010, 2015, 2020, 2025], yt=[0.9, 1.2, 1.5], yl=L("kur ($/€)", "rate ($/€)")[lang], xfmt=str, yfmt=lambda v: num(v, 1, lang))
    xs, ys = thin(KY, kur.values, 3); p1.curve(xs, ys, "l0 thick")
    p2 = Panel(f, 60, 160, 570, 110, (1999, 2027), (-4, 4))
    p2.frame(xt=[2000, 2005, 2010, 2015, 2020, 2025], yt=[-4, 0, 4], yl=L("getiri (%)", "return (%)")[lang], xfmt=str, yfmt=str)
    f.add('<path class="l1 hair" d="' + "".join(f"M{p2.sx(x):.1f} {p2.sy(0):.1f}V{p2.sy(max(-4, min(4, y))):.1f}" for x, y in zip(RY[::3], r.values[::3])) + '"/>')
    f.text(620, 34, L("Fiyat: sürüklenir, durağan değil", "Price: drifts, not stationary")[lang], "ann", "end")
    f.text(620, 174, L("Getiri: sıfır etrafında, durağana yakın", "Return: around zero, close to stationary")[lang], "ann", "end")
    return f.svg("price")


# ============================================================ Ünite 2
def u2_hist(lang):
    z = ((r - r.mean()) / r.std()).values
    f = Fig(660, 280)
    p = Panel(f, 70, 20, 380, 210, (-5, 5), (0, 0.55))
    p.frame(xt=[-4, -2, 0, 2, 4], yt=[0, 0.2, 0.4], xl=L("standartlaştırılmış getiri (z)", "standardised return (z)")[lang], yl=L("yoğunluk", "density")[lang], xfmt=str, yfmt=lambda v: num(v, 1, lang))
    edges = np.linspace(-5, 5, 61); hcount, _ = np.histogram(z, edges); dens = hcount / len(z) / (edges[1] - edges[0])
    bw = p.w / 60
    for k in range(60):
        f.rect(p.x + k * bw + 0.5, p.sy(dens[k]), bw - 1, p.sy(0) - p.sy(dens[k]), "bar b1", 1)
    xs = np.linspace(-5, 5, 200); p.curve(xs, stats.norm.pdf(xs), "l3 thick")
    tbl = [(3, (np.abs(z) > 3).mean(), 2 * stats.norm.sf(3)), (4, (np.abs(z) > 4).mean(), 2 * stats.norm.sf(4))]
    f.text(470, 50, L("Aşırı günlerin sıklığı", "Frequency of extreme days")[lang], "lb", "start")
    f.text(530, 74, L("veri", "data")[lang], "lb", "middle"); f.text(600, 74, "normal", "lb", "middle")
    P = lambda v, d: ("%" + num(v, d, lang)) if lang == "tr" else num(v, d, lang) + "%"
    for i, (k, a, b) in enumerate(tbl):
        y = 96 + i * 22
        f.text(470, y, f"|z| > {k}", "tk", "start"); f.text(530, y, P(100 * a, 2), "val", "middle"); f.text(600, y, P(100 * b, 3), "tk", "middle")
    f.mtext(540, 170, L(f"4σ'lık günler\nnormalin öngördüğünden\n{tbl[1][1] / tbl[1][2]:.0f} kat sık", f"4σ days are\n{tbl[1][1] / tbl[1][2]:.0f} times as frequent\nas the normal predicts")[lang], "ann bad", "middle")
    legend(f, 470, 240, [("bar b1", L("euro/dolar (1999–)", "euro/dollar (1999–)")[lang]), ("l3 thick", L("normal dağılım", "normal distribution")[lang])])
    return f.svg("hist")


def u2_acf(lang):
    lags = np.arange(1, 31)
    a1 = [r.autocorr(k) for k in lags]; a2 = [r.abs().autocorr(k) for k in lags]
    f = Fig(660, 260)
    p = Panel(f, 70, 20, 430, 190, (0, 31), (-0.06, 0.2))
    p.frame(xt=[1, 5, 10, 15, 20, 25, 30], yt=[0, 0.1, 0.2], xl=L("gecikme (gün)", "lag (days)")[lang], yl=L("otokorelasyon", "autocorrelation")[lang], xfmt=str, yfmt=lambda v: num(v, 1, lang))
    for k, a, b in zip(lags, a1, a2):
        f.rect(p.sx(k) - 6, min(p.sy(a), p.sy(0)), 5, abs(p.sy(a) - p.sy(0)), "bar b6", 1)
        f.rect(p.sx(k) + 1, p.sy(b), 5, p.sy(0) - p.sy(b), "bar b4", 1)
    band = 1.96 / np.sqrt(len(r))
    for v in [band, -band]:
        f.line(p.x, p.sy(v), p.x + p.w, p.sy(v), "ref")
    legend(f, 520, 70, [("bar b6", L("getiri", "return")[lang]), ("bar b4", L("|getiri|", "|return|")[lang]), ("ref", L("%95 güven bandı", "95% band")[lang])], 24)
    f.mtext(580, 170, L("Yön: hafızasız\nBüyüklük: kalıcı", "Direction: memoryless\nSize: persistent")[lang], "ann", "middle")
    return f.svg("acf")


# ============================================================ Ünite 3
def u3_leak(lang):
    X, y = t[["v5", "v20", "v60"]], t["y_v"]
    res = {}
    for cn, cv in [("r", KFold(5, shuffle=True, random_state=0)), ("t", TimeSeriesSplit(5))]:
        for mn, m in [("l", LinearRegression()), ("f", RandomForestRegressor(n_estimators=100, min_samples_leaf=5, random_state=0, n_jobs=-1))]:
            res[cn + mn] = cross_val_score(m, X, y, cv=cv, scoring="r2").mean()
    f = Fig(660, 250)
    p = Panel(f, 70, 20, 400, 180, (0, 2), (0, 0.8))
    p.frame(yt=[0, 0.2, 0.4, 0.6, 0.8], yl="R²", yfmt=lambda v: num(v, 1, lang))
    groups = [(L("Doğrusal (HAR)", "Linear (HAR)")[lang], res["rl"], res["tl"]), (L("Rassal orman", "Random forest")[lang], res["rf"], res["tf"])]
    for g, (lab, a, b) in enumerate(groups):
        cx = p.sx(g + 0.5)
        for k, (v, cls) in enumerate([(a, "bar b3"), (b, "bar b0")]):
            x = cx - 52 + k * 56
            f.rect(x, p.sy(v), 48, p.sy(0) - p.sy(v), cls, 3)
            f.text(x + 24, p.sy(v) - 6, num(v, 2, lang), "val")
        f.text(cx, p.y + p.h + 18, lab, "lb")
    legend(f, 500, 70, [("bar b3", L("rastgele KFold", "random KFold")[lang]), ("bar b0", "TimeSeriesSplit")], 24)
    f.mtext(570, 160, L("Aynı model, aynı veri:\nfark yalnızca bölmede", "Same model, same data:\nthe only difference is the split")[lang], "ann", "middle")
    NUMS["u3"] = res
    return f.svg("leak")


# ============================================================ Ünite 4
def u4_folds(lang):
    f = Fig(660, 210)
    splits = list(TimeSeriesSplit(5, gap=20).split(t))
    x0, x1 = 80, 640
    d0, d1 = YRS[0], YRS[-1]
    sx = lambda v: x0 + (v - d0) / (d1 - d0) * (x1 - x0)
    for k, (a, b) in enumerate(splits):
        y = 20 + k * 30
        f.text(x0 - 8, y + 15, L(f"kat {k + 1}", f"fold {k + 1}")[lang], "tk", "end")
        f.rect(sx(YRS[a[0]]), y + 4, sx(YRS[a[-1]]) - sx(YRS[a[0]]), 18, "bar b0", 3)
        f.rect(sx(YRS[b[0]]), y + 4, sx(YRS[b[-1]]) - sx(YRS[b[0]]), 18, "bar b4", 3)
    for yy in [2000, 2005, 2010, 2015, 2020, 2025]:
        f.text(sx(yy), 190, str(yy), "tk")
    legend(f, 90, 205 - 2, [("bar b0", L("eğitim", "training")[lang])]); legend(f, 220, 203, [("bar b4", L("test", "test")[lang])])
    f.text(640, 203, L("eğitim ile test arasında 20 günlük boşluk", "a 20-day gap between training and test")[lang], "ann", "end")
    return f.svg("folds")


# ============================================================ Ünite 5
def u5_dir(lang):
    R = ["r_l1", "r_l2", "r_l3", "r_l4", "r_l5", "mom20", "v20"]
    ye, yt = t.loc[egt, "y_r"], t.loc[tst, "y_r"]
    lin = LinearRegression().fit(t.loc[egt, R], ye).predict(t.loc[tst, R])
    rf = RandomForestRegressor(200, min_samples_leaf=50, random_state=0, n_jobs=-1).fit(t.loc[egt, R], ye).predict(t.loc[tst, R])
    vals = [(L("Doğrusal model", "Linear model")[lang], (np.sign(lin) == np.sign(yt)).mean(), "bar b1"), (L("Rassal orman", "Random forest")[lang], (np.sign(rf) == np.sign(yt)).mean(), "bar b0"),
            (L("“Hep yükselir”", "“Always up”")[lang], (yt > 0).mean(), "bar b6"), (L("“Hep düşer”", "“Always down”")[lang], (yt < 0).mean(), "bar b6")]
    f = Fig(660, 230)
    x0, x1, lo, hi = 220, 600, 0.44, 0.54
    sx = lambda v: x0 + (v - lo) / (hi - lo) * (x1 - x0)
    for v in [0.44, 0.46, 0.48, 0.50, 0.52, 0.54]:
        f.line(sx(v), 14, sx(v), 20 + 4 * 40, "gr"); f.text(sx(v), 20 + 4 * 40 + 16, ("%" + num(100 * v, 0, lang)) if lang == "tr" else num(100 * v, 0, lang) + "%", "tk")
    f.line(sx(0.5), 14, sx(0.5), 20 + 4 * 40, "l3 dash")
    for i, (lab, v, cls) in enumerate(vals):
        y = 22 + i * 40
        f.rect(x0, y, sx(v) - x0, 26, cls, 3)
        f.text(x0 - 8, y + 18, lab, "tk", "end")
        f.text(sx(v) + 6, y + 18, ("%" + num(100 * v, 1, lang)) if lang == "tr" else num(100 * v, 1, lang) + "%", "val", "start")
    f.text(410, 224, L("yön isabeti, 2015 sonrası (eksen %44'ten başlıyor; kesikli çizgi yazı tura)", "direction hit rate after 2015 (axis starts at 44%; dashed line = coin toss)")[lang], "ann")
    return f.svg("dir")


# ============================================================ Ünite 6
def u6_vol(lang):
    V = ["v5", "v20", "v60"]
    har = LinearRegression().fit(t.loc[egt, V], t.loc[egt, "y_v"])
    pr = har.predict(t.loc[tst, V]) * np.sqrt(252); yv = t.loc[tst, "y_v"].values * np.sqrt(252); xs = YRS[tst]
    f = Fig(660, 270)
    p = Panel(f, 60, 20, 570, 200, (2015, 2026.9), (0, 16))
    p.frame(xt=[2015, 2017, 2019, 2021, 2023, 2025], yt=[0, 5, 10, 15], yl=L("volatilite (yıllık, %)", "volatility (annual, %)")[lang], xfmt=str, yfmt=str)
    a, b = thin(xs, yv, 3); p.curve(a, b, "l6")
    a, b = thin(xs, pr, 3); p.curve(a, b, "l0 thick")
    legend(f, 80, 262, [("l6", L("gerçekleşen (gelecek 20 gün)", "realised (next 20 days)")[lang])]); legend(f, 340, 262, [("l0 thick", L(f"HAR tahmini (test R² {num(r2_score(t.loc[tst, 'y_v'], har.predict(t.loc[tst, V])), 2, lang)})", f"HAR forecast (test R² {num(r2_score(t.loc[tst, 'y_v'], har.predict(t.loc[tst, V])), 2, lang)})")[lang])])
    return f.svg("vol")


# ============================================================ Ünite 7
def u7_snoop(lang):
    sh = lambda g: g.mean() / g.std() * np.sqrt(252)
    res = []
    for k in range(200):
        pos = pd.Series(np.random.default_rng(k).choice([1, -1], len(t)), index=t.index); g = pos * t["y_r"]
        res.append((sh(g[egt]), sh(g[tst])))
    res = np.array(res); b = res[:, 0].argmax()
    mom = np.sign(t["mom20"]) * t["y_r"]; m = (sh(mom[egt]), sh(mom[tst]))
    f = Fig(660, 300)
    p = Panel(f, 70, 20, 300, 240, (-1, 1), (-1, 1))
    p.frame(xt=[-1, -0.5, 0, 0.5, 1], yt=[-1, -0.5, 0, 0.5, 1], xl=L("eğitim Sharpe'ı (1999–2014)", "training Sharpe (1999–2014)")[lang], yl=L("test Sharpe'ı (2015–)", "test Sharpe (2015–)")[lang], xfmt=lambda v: num(v, 1, lang), yfmt=lambda v: num(v, 1, lang))
    f.line(p.sx(0), p.y, p.sx(0), p.y + p.h, "gr"); f.line(p.x, p.sy(0), p.x + p.w, p.sy(0), "gr")
    for i, (a, c) in enumerate(res):
        f.circle(p.sx(a), p.sy(c), 2.6, "d6 sm")
    f.circle(p.sx(res[b, 0]), p.sy(res[b, 1]), 6, "d4")
    f.circle(p.sx(m[0]), p.sy(m[1]), 6, "d3")
    legend(f, 410, 60, [("d6", L("200 yazı tura kuralı", "200 coin-toss rules")[lang]), ("d4", L(f"eğitimde en iyisi: {num(res[b, 0], 2, lang)} → {num(res[b, 1], 2, lang)}", f"best in training: {num(res[b, 0], 2, lang)} → {num(res[b, 1], 2, lang)}")[lang]), ("d3", L(f"20 günlük momentum: {num(m[0], 2, lang)} → {num(m[1], 2, lang)}", f"20-day momentum: {num(m[0], 2, lang)} → {num(m[1], 2, lang)}")[lang])], 24)
    f.mtext(520, 190, L("Eğitim başarısı test\nbaşarısını öngörmüyor:\nnoktalar yatay bir bulut", "Training success does not\npredict test success:\nthe dots form a flat cloud")[lang], "ann", "middle")
    return f.svg("snoop")


# ============================================================ Ünite 8
def u8_var(lang):
    sig = r[r.index < "2015-01-01"].std()
    q = np.quantile((t["y_r"] / t["v20"])[egt], 0.01)
    yr = t.loc[tst, "y_r"].values; xs = YRS[tst]; vc = -2.326 * sig; vd = (q * t.loc[tst, "v20"]).values
    f = Fig(660, 290)
    p = Panel(f, 60, 20, 570, 210, (2015, 2026.9), (-3.2, 3.2))
    p.frame(xt=[2015, 2017, 2019, 2021, 2023, 2025], yt=[-3, -2, -1, 0, 1, 2, 3], yl=L("günlük getiri (%)", "daily return (%)")[lang], xfmt=str, yfmt=str)
    f.add('<path class="l6 hair" d="' + "".join(f"M{p.sx(x):.1f} {p.sy(0):.1f}V{p.sy(max(-3.2, min(3.2, y))):.1f}" for x, y in zip(xs[::2], yr[::2])) + '"/>')
    p.curve([2015, 2026.9], [vc, vc], "l3 thick")
    a, b = thin(xs, vd, 2); p.curve(a, b, "l0")
    ex_c = yr < vc; ex_d = yr < vd
    for x, y in zip(xs[ex_d], yr[ex_d]):
        f.circle(p.sx(x), p.sy(max(-3.2, y)), 3, "d0")
    for x, y in zip(xs[ex_c], yr[ex_c]):
        f.circle(p.sx(x), p.sy(max(-3.2, y)), 3, "d3")
    legend(f, 80, 282, [("l3 thick", L(f"sabit VaR: aşım %{num(100 * ex_c.mean(), 2, lang)}", f"constant VaR: {num(100 * ex_c.mean(), 2, lang)}% exceedances")[lang])])
    legend(f, 340, 282, [("l0", L(f"v20 × eğitim çarpanı: aşım %{num(100 * ex_d.mean(), 2, lang)}", f"v20 × training multiplier: {num(100 * ex_d.mean(), 2, lang)}% exceedances")[lang])])
    return f.svg("var")


def u9_flow(lang):
    f = Fig(660, 130)
    steps = L(["Sterlin verisi,\nlog getiri", "v5, v20, v60 ve\nhedef y_v", "TimeSeriesSplit\n(gap=20)", "2015 öncesi kur,\nsonrası sına", "VaR: eğitimden\nçarpan, aşım"],
              ["Sterling data,\nlog return", "v5, v20, v60 and\ntarget y_v", "TimeSeriesSplit\n(gap=20)", "Fit before 2015,\ntest after", "VaR: multiplier\nfrom training"])[lang]
    flow(f, steps, 8, 26, 116, 70, 17)
    f.text(330, 122, L("Görev A: adım 1–4 · Görev B: adım 5", "Task A: steps 1–4 · Task B: step 5")[lang], "ann")
    return f.svg("wsflow")


for n, fn in [("u1_price", u1_price), ("u2_hist", u2_hist), ("u2_acf", u2_acf), ("u3_leak", u3_leak), ("u4_folds", u4_folds), ("u5_dir", u5_dir),
              ("u6_vol", u6_vol), ("u7_snoop", u7_snoop), ("u8_var", u8_var), ("u9_flow", u9_flow)]:
    print("…", n, flush=True)
    both(n, fn)

write(os.path.join(ROOT, "content/m6/m6-figs.js"), "M6", FIGS, NUMS, "Modül 6 kavram şekilleri")
print(json.dumps(NUMS, ensure_ascii=False, default=float)[:1500])
