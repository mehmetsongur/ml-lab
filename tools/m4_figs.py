"""Modül 4 kavram anlatımındaki şekilleri (satır içi SVG) üretir → content/m4/m4-figs.js
Veriler: modülün kredi dünyası (5. hafta notebook'uyla aynı tohum ve tarif) ve data/credit/taiwan_default.csv.
Çalıştırma: python3 tools/m4_figs.py   (depo kökünden)"""
import os, sys, json
import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from figlib import Fig, Panel, L, num, legend, flow, write, ROOT
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.metrics import roc_auc_score, roc_curve, confusion_matrix
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split

FIGS, NUMS = {}, {}


def both(name, fn):
    FIGS[name] = {lang: fn(lang) for lang in ("tr", "en")}


# ------------------------------------------------------------ kredi dünyası (m4-data.js ile aynı)
rng = np.random.default_rng(2026)
BETA = np.array([0.9, 1.1, -0.6, -0.4, 0.5, 0.0])


def ciz(n, sabit=-3.0):
    X = rng.normal(size=(n, 6))
    X[:, 1] = (rng.random(n) < 0.15).astype(float)
    X[:, 4] = 0.4 * X[:, 0] + np.sqrt(1 - 0.16) * X[:, 4]
    X[:, 5] = 0.5 * X[:, 3] + np.sqrt(0.75) * X[:, 5]
    p = 1 / (1 + np.exp(-(sabit + X @ BETA)))
    return X, (rng.random(n) < p).astype(int), p


X_egt, y_egt, _ = ciz(3000)
X_tst, y_tst, p_gercek = ciz(20000)
X_e2, y_e2, _ = ciz(3000, sabit=-4.9)
X_t2, y_t2, _ = ciz(20000, sabit=-4.9)
logit = LogisticRegression(C=1e6, max_iter=2000).fit(X_egt, y_egt)
p_hat = logit.predict_proba(X_tst)[:, 1]
sig = lambda z: 1 / (1 + np.exp(-z))


def olcu(y, p, e):
    yh = (p >= e).astype(int)
    tn, fp, fn, tp = confusion_matrix(y, yh, labels=[0, 1]).ravel()
    return dict(tp=int(tp), fp=int(fp), fn=int(fn), tn=int(tn), acc=(tp + tn) / len(y), rec=tp / (tp + fn), prec=tp / (tp + fp) if tp + fp else 0.0, spec=tn / (tn + fp))


NUMS["cm"] = {str(e): olcu(y_tst, p_hat, e) for e in (0.2, 0.5)}


# ============================================================ Ünite 1
def u1_lpm(lang):
    x, y = X_egt[:, 0], y_egt
    lpm = LinearRegression().fit(x[:, None], y)
    lg = LogisticRegression(C=1e6).fit(x[:, None], y)
    f = Fig(660, 310)
    p = Panel(f, 70, 24, 560, 210, (-3.2, 3.2), (-0.3, 1.12))
    f.rect(p.x, p.sy(0), p.w, p.sy(-0.3) - p.sy(0), "zone z3")
    p.frame(xt=[-3, -2, -1, 0, 1, 2, 3], yt=[0, 0.5, 1], xl=L("borç/gelir oranı (standartlaştırılmış)", "debt/income ratio (standardised)")[lang], yl=L("temerrüt (0/1) ve olasılık", "default (0/1) and probability")[lang], yfmt=lambda v: num(v, 1, lang), xfmt=str)
    g = np.random.default_rng(3)
    idx = g.choice(len(x), 500, replace=False)
    for i in idx:
        if -3.2 < x[i] < 3.2:
            f.circle(p.sx(x[i]), p.sy(y[i]) + (g.random() - 0.5) * 10, 2.2, "d4" if y[i] else "d0 sm")
    xs = np.linspace(-3.2, 3.2, 120)
    p.curve(xs, lpm.predict(xs[:, None]), "l3 thick")
    p.curve(xs, lg.predict_proba(xs[:, None])[:, 1], "l0 thick")
    f.text(p.sx(-3.0), p.sy(-0.2), L("olasılık olamayacak bölge (< 0)", "region no probability can be in (< 0)")[lang], "ann bad", "start")
    legend(f, 90, 300, [("l3 thick", L("EKK: doğrusal olasılık modeli", "OLS: linear probability model")[lang])])
    legend(f, 360, 300, [("l0 thick", L("lojistik regresyon", "logistic regression")[lang])])
    NUMS["u1"] = dict(neg=float((LinearRegression().fit(X_egt, y_egt).predict(X_tst) < 0).mean()))
    return f.svg("lpm")


# ============================================================ Ünite 2
def u2_odds(lang):
    f = Fig(660, 280)
    p = Panel(f, 70, 24, 360, 200, (-5, 3), (0, 1))
    p.frame(xt=[-4, -2, 0, 2], yt=[0, 0.25, 0.5, 0.75, 1], xl=L("doğrusal skor z", "linear score z")[lang], yl=L("olasılık", "probability")[lang], yfmt=lambda v: num(v, 2, lang), xfmt=str)
    zs = np.linspace(-5, 3, 160)
    p.curve(zs, sig(zs), "l0 thick")
    b = np.log(2.23)
    for p0, cls in [(0.05, "d3"), (0.5, "d4")]:
        z0 = np.log(p0 / (1 - p0)); z1 = z0 + b
        f.line(p.sx(z0), p.sy(sig(z0)), p.sx(z1), p.sy(sig(z0)), "ref")
        f.arrow(p.sx(z1), p.sy(sig(z0)), p.sx(z1), p.sy(sig(z1)) + 4, "arr")
        p.dots([z0, z1], [sig(z0), sig(z1)], cls, 5)
    t = L(["Aynı odds oranı (2,23):", "%5 → %10,5", "  +5,5 puan, 2,1 kat", "%50 → %69,0", "  +19 puan, 1,38 kat", "", "Odds çarpılır,", "olasılık değil."],
          ["Same odds ratio (2.23):", "5% → 10.5%", "  +5.5 points, 2.1x", "50% → 69.0%", "  +19 points, 1.38x", "", "The odds are multiplied,", "not the probability."])[lang]
    for i, s in enumerate(t):
        f.text(460, 60 + i * 22, s, "lb" if i in (0, 6, 7) else ("val" if i in (1, 3) else "tk"), "start")
    f.circle(452, 60 + 22 - 4, 5, "d3"); f.circle(452, 60 + 66 - 4, 5, "d4")
    return f.svg("odds")


# ============================================================ Ünite 3
def hist_panel(f, p, y, pr, bins=30, top=0.8):
    edges = np.linspace(0, top, bins + 1)
    h0, _ = np.histogram(pr[y == 0], edges); h1, _ = np.histogram(pr[y == 1], edges)
    f0, f1 = h0 / (y == 0).sum(), h1 / (y == 1).sum()
    bw = p.w / bins
    for k in range(bins):
        f.rect(p.x + k * bw + 1, p.sy(f0[k]), bw / 2 - 1, p.sy(0) - p.sy(f0[k]), "bar b0")
        f.rect(p.x + k * bw + bw / 2, p.sy(f1[k]), bw / 2 - 1, p.sy(0) - p.sy(f1[k]), "bar b4")


def u3_dist(lang):
    f = Fig(660, 290)
    p = Panel(f, 70, 24, 560, 200, (0, 0.8), (0, 0.32))
    p.frame(xt=[0, 0.2, 0.4, 0.6, 0.8], yt=[0, 0.1, 0.2, 0.3], xl=L("öngörülen temerrüt olasılığı (20.000 test başvurusu)", "predicted default probability (20,000 test applications)")[lang], yl=L("grup içindeki pay", "share within group")[lang], xfmt=lambda v: num(v, 1, lang), yfmt=lambda v: num(v, 1, lang))
    hist_panel(f, p, y_tst, p_hat)
    for e, lab in [(0.2, "0,2" if lang == "tr" else "0.2"), (0.5, "0,5" if lang == "tr" else "0.5")]:
        f.line(p.sx(e), p.y, p.sx(e), p.y + p.h, "ref thick")
        f.text(p.sx(e) + 5, p.y + 14, L("eşik ", "threshold ")[lang] + lab, "lb", "start")
    legend(f, 470, 70, [("bar b0", L("ödeyenler", "payers")[lang]), ("bar b4", L("temerrüde düşenler", "defaulters")[lang])])
    f.text(520, 126, L("Eşiğin sağı: “temerrüt” → ret", "Right of the threshold: “default” → reject")[lang], "ann", "middle")
    return f.svg("dist")


# ============================================================ Ünite 4
def u4_curves(lang):
    th = np.round(np.arange(0.02, 0.81, 0.01), 2)
    M = [olcu(y_tst, p_hat, e) for e in th]
    f = Fig(660, 290)
    p = Panel(f, 70, 24, 420, 210, (0, 0.8), (0, 1))
    p.frame(xt=[0, 0.2, 0.4, 0.6, 0.8], yt=[0, 0.25, 0.5, 0.75, 1], xl=L("eşik", "threshold")[lang], xfmt=lambda v: num(v, 1, lang), yfmt=lambda v: num(v, 2, lang))
    for k, cls in [("acc", "ref"), ("rec", "l3 thick"), ("prec", "l0 thick"), ("spec", "l2 thick")]:
        p.curve(th, [m[k] for m in M], cls)
    f.line(p.sx(0.2), p.y, p.sx(0.2), p.y + p.h, "gr")
    legend(f, 510, 60, [("ref", L("doğruluk", "accuracy")[lang]), ("l3 thick", L("duyarlılık", "recall")[lang]), ("l0 thick", L("kesinlik", "precision")[lang]), ("l2 thick", L("özgüllük", "specificity")[lang])], 24)
    f.mtext(570, 190, L("Eşik yükseldikçe\nkesinlik artar,\nduyarlılık düşer.", "As the threshold rises\nprecision rises,\nrecall falls.")[lang], "ann", "middle")
    return f.svg("curves")


# ============================================================ Ünite 5
def u5_roc(lang):
    weak = LogisticRegression(C=1e6, max_iter=2000).fit(X_egt[:, [2, 5]], y_egt)
    pw = weak.predict_proba(X_tst[:, [2, 5]])[:, 1]
    f = Fig(660, 330)
    p = Panel(f, 70, 20, 260, 260, (0, 1), (0, 1))
    p.frame(xt=[0, 0.5, 1], yt=[0, 0.5, 1], xl=L("yanlış pozitif oranı", "false positive rate")[lang], yl=L("duyarlılık", "recall")[lang], xfmt=lambda v: num(v, 1, lang), yfmt=lambda v: num(v, 1, lang))
    p.curve([0, 1], [0, 1], "ref")
    for pr, cls in [(pw, "l1 thick"), (p_hat, "l0 thick")]:
        a, b, _ = roc_curve(y_tst, pr)
        keep = np.linspace(0, len(a) - 1, 300).astype(int)
        p.curve(a[keep], b[keep], cls)
    for e, lab in [(0.5, "0,5"), (0.2, "0,2")]:
        m = olcu(y_tst, p_hat, e)
        p.dots([1 - m["spec"]], [m["rec"]], "d4", 5)
        f.text(p.sx(1 - m["spec"]) + 8, p.sy(m["rec"]) + 4, L("eşik ", "threshold ")[lang] + (lab if lang == "tr" else lab.replace(",", ".")), "tk", "start")
    A, AW = roc_auc_score(y_tst, p_hat), roc_auc_score(y_tst, pw)
    legend(f, 380, 60, [("l0 thick", L(f"altı özellik (AUC {num(A, 3, lang)})", f"six features (AUC {num(A, 3, lang)})")[lang]), ("l1 thick", L(f"gelir + yaş (AUC {num(AW, 3, lang)})", f"income + age (AUC {num(AW, 3, lang)})")[lang]), ("ref", L("yazı tura (AUC 0,5)", "coin toss (AUC 0.5)")[lang])], 26)
    f.mtext(500, 200, L("AUC = eğrinin altındaki alan\n= rastgele bir temerrütçünün\nrastgele bir ödeyenden yüksek\nolasılık alma şansı\n(eşit olasılıklar ½ sayılır)", "AUC = area under the curve\n= the chance that a random\ndefaulter gets a higher\nprobability than a random payer\n(ties count as ½)")[lang], "ann", "middle")
    NUMS["u5"] = dict(auc=A, weak=AW, true=roc_auc_score(y_tst, p_gercek))
    return f.svg("roc")


# ============================================================ Ünite 6
def u6_cost(lang):
    th = np.round(np.arange(0.0, 0.61, 0.01), 2)
    cost = lambda e, k=10: (k * olcu(y_tst, p_hat, e)["fn"] + olcu(y_tst, p_hat, e)["fp"]) / len(y_tst)
    cs = [cost(e) for e in th]
    allc = 10 * y_tst.mean()
    f = Fig(660, 290)
    p = Panel(f, 70, 24, 420, 210, (0, 0.6), (0.4, 1.15))
    p.frame(xt=[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6], yt=[0.4, 0.6, 0.8, 1.0], xl=L("eşik", "threshold")[lang], yl=L("başvuru başına maliyet", "cost per application")[lang], xfmt=lambda v: num(v, 1, lang), yfmt=lambda v: num(v, 1, lang))
    p.curve(th, cs, "l0 thick")
    p.curve([0, 0.6], [allc, allc], "ref")
    f.text(p.sx(0.59), p.sy(allc) - 6, L("herkesi onayla", "approve everyone")[lang], "tk", "end")
    f.line(p.sx(1 / 11), p.y, p.sx(1 / 11), p.y + p.h, "l2 dash")
    i = int(np.argmin(cs))
    p.dots([th[i]], [cs[i]], "d4", 6)
    p.dots([0.5], [cost(0.5)], "d3", 6)
    f.mtext(570, 80, L("Maliyetler\nkaçan temerrüt (YN) = 10\nreddedilen iyi müşteri (YP) = 1", "Costs\nmissed default (FN) = 10\nrejected good customer (FP) = 1")[lang], "tk", "middle")
    f.text(570, 150, L(f"en ucuz eşik {num(th[i], 2, lang)}: {num(cs[i], 3, lang)}", f"cheapest threshold {num(th[i], 2, lang)}: {num(cs[i], 3, lang)}")[lang], "ann good", "middle")
    f.text(570, 172, L(f"eşik 0,5: {num(cost(0.5), 3, lang)}", f"threshold 0.5: {num(cost(0.5), 3, lang)}")[lang], "ann bad", "middle")
    f.text(570, 194, L("mor kesikli: 1/(1+10) ≈ 0,09", "purple dashed: 1/(1+10) ≈ 0.09")[lang], "ann", "middle")
    return f.svg("cost")


# ============================================================ Ünite 7
def u7_imb(lang):
    m1 = LogisticRegression(C=1e6, max_iter=2000).fit(X_e2, y_e2)
    m2 = LogisticRegression(C=1e6, max_iter=2000, class_weight="balanced").fit(X_e2, y_e2)
    p1, p2 = m1.predict_proba(X_t2)[:, 1], m2.predict_proba(X_t2)[:, 1]
    rec = lambda p, e: ((p >= e) & (y_t2 == 1)).sum() / y_t2.sum()
    groups = [
        (L("Yakalanan temerrüt", "Defaults caught")[lang], [rec(p1, 0.5), rec(p1, 0.05), rec(p2, 0.5)]),
        (L("Ortalama olasılık", "Average probability")[lang], [p1.mean(), p1.mean(), p2.mean()]),
        ("AUC", [roc_auc_score(y_t2, p1), roc_auc_score(y_t2, p1), roc_auc_score(y_t2, p2)]),
    ]
    labs = L(["ağırlıksız, eşik 0,5", "ağırlıksız, eşik 0,05", "dengeli ağırlık, eşik 0,5"], ["unweighted, threshold 0.5", "unweighted, threshold 0.05", "balanced weights, threshold 0.5"])[lang]
    cls = ["bar b6", "bar b0", "bar b3"]
    f = Fig(660, 290)
    p = Panel(f, 60, 24, 570, 200, (0, 3), (0, 1))
    p.frame(yt=[0, 0.25, 0.5, 0.75, 1], yfmt=lambda v: num(v, 2, lang))
    for g, (gl, vals) in enumerate(groups):
        cx = p.sx(g + 0.5)
        for k, v in enumerate(vals):
            x = cx - 75 + k * 52
            f.rect(x, p.sy(v), 46, p.sy(0) - p.sy(v), cls[k], 3)
            lab = num(v, 3, lang) if g == 2 else ("%" + num(100 * v, 1, lang) if lang == "tr" else num(100 * v, 1, lang) + "%")
            f.text(x + 23, p.sy(v) - 5, lab, "val")
        f.text(cx, p.y + p.h + 16, gl, "lb")
    f.line(p.sx(1), p.sy(y_t2.mean()), p.sx(2), p.sy(y_t2.mean()), "leak")
    f.text(p.sx(1.5), p.sy(0.42), L(f"gerçek oran %{num(100 * y_t2.mean(), 1, lang)} (kırmızı kesikli)", f"true rate {num(100 * y_t2.mean(), 1, lang)}% (red dashed)")[lang], "ann bad")
    for i, (lab, c) in enumerate(zip(labs, cls)):
        f.rect(60 + i * 200, 266, 12, 12, c, 2); f.text(78 + i * 200, 276, lab, "lg", "start")
    NUMS["u7"] = dict(rate=float(y_t2.mean()), rec=[float(rec(p1, 0.5)), float(rec(p1, 0.05)), float(rec(p2, 0.5))], mean=[float(p1.mean()), float(p2.mean())])
    return f.svg("imb")


# ============================================================ Ünite 8 (Tayvan)
kredi = pd.read_csv(os.path.join(ROOT, "data/credit/taiwan_default.csv"))
egitim, test = train_test_split(kredi, test_size=0.3, random_state=0, stratify=kredi["default"])


def hazirla(df):
    X = df.drop(columns=["default", "sex", "marriage"]).copy()
    for k in ["pay_0", "pay_2", "pay_3", "pay_4", "pay_5", "pay_6"]:
        X[k + "_gecikme"] = X[k].clip(lower=0); X[k + "_tam"] = (X[k] == -1).astype(int); X[k + "_yok"] = (X[k] == -2).astype(int)
        X = X.drop(columns=[k])
    for k in [c for c in X.columns if "amt" in c]:
        X[k] = np.sign(X[k]) * np.log1p(np.abs(X[k]))
    return X


def fitp(Xe, Xt):
    m = make_pipeline(StandardScaler(), LogisticRegression(C=1e6, max_iter=5000)).fit(Xe, egitim["default"])
    return m.predict_proba(Xt)[:, 1]


ham = lambda d: d.drop(columns=["default", "sex", "marriage"])
P_HAM, P_HZ = fitp(ham(egitim), ham(test)), fitp(hazirla(egitim), hazirla(test))


def u8_pay(lang):
    g = kredi.groupby("pay_0")["default"].agg(["count", "mean"])
    g = g[g["count"] >= 300]
    codes = list(g.index)
    names = {-2: L("−2\nkullanmadı", "−2\nnot used"), -1: L("−1\ntamamını\nödedi", "−1\npaid in\nfull"), 0: L("0\nasgari\nödedi", "0\npaid the\nminimum"), 1: L("1\n1 ay\ngecikme", "1\n1 month\nlate"), 2: L("2\n2 ay\ngecikme", "2\n2 months\nlate"), 3: L("3\n3 ay\ngecikme", "3\n3 months\nlate")}
    f = Fig(660, 300)
    p = Panel(f, 70, 20, 560, 190, (0, len(codes)), (0, 0.8))
    p.frame(yt=[0, 0.2, 0.4, 0.6, 0.8], yl=L("temerrüt oranı", "default rate")[lang], yfmt=lambda v: num(v, 1, lang))
    for i, c in enumerate(codes):
        v = g.loc[c, "mean"]; x = p.sx(i + 0.5)
        f.rect(x - 30, p.sy(v), 60, p.sy(0) - p.sy(v), "bar " + ("b0" if c <= 0 else "b4"), 3)
        f.text(x, p.sy(v) - 6, ("%" + num(100 * v, 1, lang)) if lang == "tr" else num(100 * v, 1, lang) + "%", "val")
        f.mtext(x, p.y + p.h + 30, names[c][lang], "tk", "middle", 13)
    f.text(p.sx(1.5), p.y + 18, L("−1'den 0'a oran düşüyor: kodlar bir sayı ölçeği değil", "The rate falls from −1 to 0: the codes are not a numeric scale")[lang], "ann bad")
    f.text(330, 296, L("Eylül 2005 ödeme durumu (pay_0); 300'den az gözlemli kodlar gösterilmedi", "September 2005 payment status (pay_0); codes with fewer than 300 observations not shown")[lang], "ann")
    return f.svg("pay")


def u8_calib(lang):
    f = Fig(660, 300)
    p = Panel(f, 70, 20, 250, 230, (0, 0.75), (0, 0.75))
    p.frame(xt=[0, 0.25, 0.5, 0.75], yt=[0, 0.25, 0.5, 0.75], xl=L("öngörülen (on grup)", "predicted (ten groups)")[lang], yl=L("gerçekleşen temerrüt oranı", "realised default rate")[lang], xfmt=lambda v: num(v, 2, lang), yfmt=lambda v: num(v, 2, lang))
    p.curve([0, 0.75], [0, 0.75], "ref")
    yt = test["default"].values
    out = {}
    for pr, cls, lcls, key in [(P_HAM, "d3", "l3", "ham"), (P_HZ, "d0", "l0", "hz")]:
        q = pd.qcut(pr, 10, labels=False)
        d = pd.DataFrame({"q": q, "p": pr, "y": yt}).groupby("q").mean()
        p.curve(d["p"].values, d["y"].values, lcls)
        p.dots(d["p"].values, d["y"].values, cls, 4)
        out[key] = dict(p=d["p"].round(3).tolist(), y=d["y"].round(3).tolist(), auc=roc_auc_score(yt, pr))
    legend(f, 370, 70, [("d3", L(f"ham kodlar (AUC {num(out['ham']['auc'], 3, lang)})", f"raw codes (AUC {num(out['ham']['auc'], 3, lang)})")[lang]), ("d0", L(f"kodlar çözülmüş (AUC {num(out['hz']['auc'], 3, lang)})", f"codes decoded (AUC {num(out['hz']['auc'], 3, lang)})")[lang]), ("ref", L("kusursuz kalibrasyon", "perfect calibration")[lang])], 26)
    f.mtext(500, 190, L("Ham kodlarla en güvenli gruba %4\ndeniyor, gerçekleşen %11.\nKodlar çözülünce noktalar köşegene\nyaklaşıyor; en riskli iki grupta\n2–3 puan fark kalıyor (n = 900).", "With raw codes the safest group\nis given 4%, the realised rate is 11%.\nOnce the codes are decoded the dots\napproach the diagonal; a 2–3 point gap\nremains in the two riskiest groups (n = 900).")[lang], "ann", "middle")
    NUMS["u8"] = out
    return f.svg("calib")


def u9_flow(lang):
    f = Fig(660, 130)
    steps = L(["Veriyi indir,\ntabakalı böl", "pay_0–6 kodlarını\nçöz, korunanları at", "Pipeline:\nölçek + logit", "Test AUC, on\ngruplu kalibrasyon", "Eşik: eğitimde seç\n(5:1), 1/6 ile kıyasla"],
              ["Download data,\nstratified split", "Decode pay_0–6,\ndrop protected", "Pipeline:\nscale + logit", "Test AUC, ten-\ngroup calibration", "Threshold on training\n(5:1), compare with 1/6"])[lang]
    flow(f, steps, 8, 26, 116, 70, 17)
    f.text(330, 122, L("Görev A: adım 1–4 · Görev B: adım 5", "Task A: steps 1–4 · Task B: step 5")[lang], "ann")
    return f.svg("wsflow")


for n, fn in [("u1_lpm", u1_lpm), ("u2_odds", u2_odds), ("u3_dist", u3_dist), ("u4_curves", u4_curves), ("u5_roc", u5_roc), ("u6_cost", u6_cost),
              ("u7_imb", u7_imb), ("u8_pay", u8_pay), ("u8_calib", u8_calib), ("u9_flow", u9_flow)]:
    print("…", n, flush=True)
    both(n, fn)

write(os.path.join(ROOT, "content/m4/m4-figs.js"), "M4", FIGS, NUMS, "Modül 4 kavram şekilleri")
print(json.dumps(NUMS, ensure_ascii=False, default=float)[:2500])
