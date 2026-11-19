"""Modül 5 kavram anlatımındaki şekilleri (satır içi SVG) üretir → content/m5/m5-figs.js
Veriler: 6. hafta notebook'unun doğrusal olmayan kredi dünyası (aynı tohum ve tarif) ve data/credit/taiwan_default.csv.
SHAP değerleri için shap kütüphanesi gerekir (pip install shap).
Çalıştırma: python3 tools/m5_figs.py   (depo kökünden)"""
import os, sys, json
import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings("ignore")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from figlib import Fig, Panel, L, num, legend, flow, write, ROOT
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, HistGradientBoostingClassifier
from sklearn.model_selection import KFold, cross_val_score, train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.metrics import roc_auc_score
import shap

FIGS, NUMS = {}, {}


def both(name, fn):
    FIGS[name] = {lang: fn(lang) for lang in ("tr", "en")}


rng = np.random.default_rng(2026)


def ciz(n):
    X = rng.normal(size=(n, 6))
    X[:, 1] = (rng.random(n) < 0.15).astype(float)
    X[:, 4] = 0.4 * X[:, 0] + np.sqrt(1 - 0.16) * X[:, 4]
    X[:, 5] = 0.5 * X[:, 3] + np.sqrt(0.75) * X[:, 5]
    b, g, gel, cal, kart, yas = X.T
    lo = (-2.9 + 1.5 * (b > 0.7) + 0.5 * g + 1.2 * g * (b > 0) - 0.5 * gel + 0.8 * (cal < -0.8) + 0.35 * kart + 0.45 * (yas ** 2 - 1))
    p = 1 / (1 + np.exp(-lo))
    return X, (rng.random(n) < p).astype(int), p


X_egt, y_egt, _ = ciz(3000)
X_tst, y_tst, p_gercek = ciz(20000)
kf = KFold(5, shuffle=True, random_state=1)
A = lambda m, X=X_tst: roc_auc_score(y_tst, m.predict_proba(X)[:, 1])
logit = LogisticRegression(C=1e6, max_iter=2000).fit(X_egt, y_egt)
AUC_LOGIT, AUC_MAX = A(logit), roc_auc_score(y_tst, p_gercek)
NAMES = {"tr": ["Borç/gelir", "Önceki gecikme", "Gelir", "Çalışma süresi", "Kart harcaması/gelir", "Yaş"],
         "en": ["Debt/income", "Past delinquency", "Income", "Years employed", "Card spending/income", "Age"]}


# ============================================================ Ünite 1
def u1_shapes(lang):
    f = Fig(660, 250)
    xs = np.linspace(-2.5, 2.5, 200)
    specs = [
        (L("Eşik: borç/gelir", "Threshold: debt/income")[lang], [(1.5 * (xs > 0.7), "l0 thick")], (-0.2, 2.2)),
        (L("Etkileşim: gecikmenin etkisi", "Interaction: effect of delinquency")[lang], [(0.5 + 1.2 * (xs > 0), "l4 thick")], (-0.2, 2.2)),
        (L("U biçimi: yaş", "U shape: age")[lang], [(0.45 * (xs ** 2 - 1), "l2 thick")], (-0.6, 2.4)),
    ]
    for k, (title, curves, yr) in enumerate(specs):
        p = Panel(f, 80 + k * 200, 34, 160, 160, (-2.5, 2.5), yr)
        p.frame(xt=[-2, 0, 2], yt=[0, 1, 2], xl=[L("borç/gelir", "debt/income"), L("borç/gelir", "debt/income"), L("yaş", "age")][k][lang], yl=L("log-odds etkisi", "log-odds effect")[lang] if k == 0 else None, xfmt=str, yfmt=str)
        for ys, c in curves:
            p.curve(xs, ys, c)
        f.text(p.x + p.w / 2, 22, title, "lb")
    f.text(360, 184, L("(gecikmesi olanlar için)", "(for those with a delinquency)")[lang], "ann", "middle")
    return f.svg("shapes")


def u1_tree(lang):
    t = DecisionTreeClassifier(max_depth=3, min_samples_leaf=100, random_state=0).fit(X_egt, y_egt)
    T = t.tree_
    nm = NAMES[lang]
    f = Fig(660, 300)
    pos = {}

    def place(node, depth, lo, hi):
        pos[node] = ((lo + hi) / 2, 30 + depth * 82)
        if T.children_left[node] >= 0:
            mid = (lo + hi) / 2
            place(T.children_left[node], depth + 1, lo, mid)
            place(T.children_right[node], depth + 1, mid, hi)
    place(0, 0, 0, 660)
    for node, (x, y) in pos.items():
        for ch, lab in [(T.children_left[node], L("evet", "yes")), (T.children_right[node], L("hayır", "no"))]:
            if ch >= 0:
                cx, cy = pos[ch]
                f.line(x, y + 18, cx, cy - 18, "gr")
                f.text((x + cx) / 2 + (-8 if cx < x else 8), (y + cy) / 2 + 2, lab[lang], "ann", "end" if cx < x else "start")
    for node, (x, y) in pos.items():
        v = T.value[node][0]; n = T.n_node_samples[node]; pr = v[1] / v.sum() if v.sum() else 0
        if T.children_left[node] >= 0:
            s = f"{nm[T.feature[node]]} ≤ {num(T.threshold[node], 2, lang)}"
            w = max(120, 7.2 * len(s))
            f.rect(x - w / 2, y - 16, w, 32, "box c1s", 8)
            f.text(x, y + 5, s, "lb")
        else:
            cls = "box c4s" if pr >= 0.3 else ("box c3s" if pr >= 0.18 else "box c0s")
            f.rect(x - 38, y - 18, 76, 40, cls, 8)
            f.text(x, y - 1, ("%" + num(100 * pr, 0, lang)) if lang == "tr" else num(100 * pr, 0, lang) + "%", "val")
            f.text(x, y + 15, f"n = {n}", "ann")
    NUMS["u1"] = dict(auc3=A(t), logit=AUC_LOGIT, max=AUC_MAX)
    return f.svg("tree")


# ============================================================ Ünite 2
def u2_depth(lang):
    ds = list(range(1, 16)); tr, te, cv = [], [], []
    for d in ds:
        m = DecisionTreeClassifier(max_depth=d, random_state=0).fit(X_egt, y_egt)
        tr.append(roc_auc_score(y_egt, m.predict_proba(X_egt)[:, 1])); te.append(A(m))
        cv.append(cross_val_score(DecisionTreeClassifier(max_depth=d, random_state=0), X_egt, y_egt, cv=kf, scoring="roc_auc").mean())
    best = ds[int(np.argmax(cv))]
    f = Fig(660, 280)
    p = Panel(f, 70, 20, 430, 210, (1, 15), (0.5, 1.0))
    p.frame(xt=[1, 3, 5, 7, 9, 11, 13, 15], yt=[0.5, 0.6, 0.7, 0.8, 0.9, 1.0], xl=L("ağacın derinliği", "tree depth")[lang], yl="AUC", xfmt=str, yfmt=lambda v: num(v, 1, lang))
    p.curve(ds, tr, "ref"); p.curve(ds, cv, "l3 thick"); p.curve(ds, te, "l0 thick")
    f.line(p.sx(best), p.y, p.sx(best), p.y + p.h, "l2 dash")
    legend(f, 520, 60, [("ref", L("eğitim", "training")[lang]), ("l3 thick", L("çapraz doğrulama", "cross-validation")[lang]), ("l0 thick", L("test", "test")[lang])], 24)
    f.mtext(580, 170, L(f"Seçilen derinlik {best}\ntest AUC {num(te[best - 1], 3, lang)}\n\nDerinlik 15:\neğitim {num(tr[-1], 3, lang)}\ntest {num(te[-1], 3, lang)}", f"Chosen depth {best}\ntest AUC {num(te[best - 1], 3, lang)}\n\nDepth 15:\ntraining {num(tr[-1], 3, lang)}\ntest {num(te[-1], 3, lang)}")[lang], "ann", "middle")
    return f.svg("depth")


# ============================================================ Ünite 4
RF = RandomForestClassifier(n_estimators=500, min_samples_leaf=10, max_features="sqrt", random_state=1, n_jobs=-1).fit(X_egt, y_egt)
BAG = RandomForestClassifier(n_estimators=500, min_samples_leaf=10, max_features=None, random_state=1, n_jobs=-1).fit(X_egt, y_egt)


def u4_forest(lang):
    ap = np.array([a.predict_proba(X_tst)[:, 1] for a in RF.estimators_])
    bp = np.array([a.predict_proba(X_tst)[:, 1] for a in BAG.estimators_])
    ns = [1, 2, 3, 5, 7, 10, 15, 20, 30, 50, 70, 100, 150, 200, 300, 500]
    rf = [roc_auc_score(y_tst, ap[:k].mean(0)) for k in ns]
    bg = [roc_auc_score(y_tst, bp[:k].mean(0)) for k in ns]
    tek = np.mean([roc_auc_score(y_tst, ap[k]) for k in range(50)])
    lx = np.log10(ns)
    f = Fig(660, 280)
    p = Panel(f, 70, 20, 430, 210, (0, np.log10(500)), (0.65, 0.83))
    p.frame(yt=[0.65, 0.7, 0.75, 0.8], yl="AUC", yfmt=lambda v: num(v, 2, lang))
    for v in [1, 10, 100, 500]:
        f.text(p.sx(np.log10(v)), p.y + p.h + 16, str(v), "tk")
    f.text(p.x + p.w / 2, p.y + p.h + 34, L("ağaç sayısı (logaritmik)", "number of trees (log scale)")[lang], "lb")
    for val, cls in [(AUC_MAX, "l2 dash"), (AUC_LOGIT, "ref"), (tek, "gr")]:
        p.curve([0, np.log10(500)], [val, val], cls)
    p.curve(lx, bg, "l1 thick"); p.curve(lx, rf, "l0 thick")
    legend(f, 520, 50, [("l0 thick", L(f"rassal orman ({num(rf[-1], 3, lang)})", f"random forest ({num(rf[-1], 3, lang)})")[lang]), ("l1 thick", L(f"bagging ({num(bg[-1], 3, lang)})", f"bagging ({num(bg[-1], 3, lang)})")[lang]),
                        ("l2 dash", L(f"tavan ({num(AUC_MAX, 3, lang)})", f"ceiling ({num(AUC_MAX, 3, lang)})")[lang]), ("ref", L(f"lojistik ({num(AUC_LOGIT, 3, lang)})", f"logistic ({num(AUC_LOGIT, 3, lang)})")[lang]), ("gr", L(f"tek ağaç ({num(tek, 3, lang)})", f"single tree ({num(tek, 3, lang)})")[lang])], 24)
    NUMS["u4"] = dict(rf=rf[-1], bag=bg[-1], tek=tek)
    return f.svg("forest")


# ============================================================ Ünite 5
def u5_boost(lang):
    curves = {}
    for lr in [0.05, 0.5]:
        m = GradientBoostingClassifier(n_estimators=600, learning_rate=lr, max_depth=3, subsample=0.8, random_state=1).fit(X_egt, y_egt)
        curves[lr] = [roc_auc_score(y_tst, p[:, 1]) for p in m.staged_predict_proba(X_tst)]
    f = Fig(660, 280)
    p = Panel(f, 70, 20, 430, 210, (1, 600), (0.68, 0.83))
    p.frame(xt=[1, 100, 200, 300, 400, 500, 600], yt=[0.7, 0.75, 0.8], xl=L("eklenen ağaç sayısı", "number of trees added")[lang], yl=L("test AUC", "test AUC")[lang], xfmt=str, yfmt=lambda v: num(v, 2, lang))
    xs = np.arange(1, 601)
    p.curve(xs, curves[0.5], "l3 thick"); p.curve(xs, curves[0.05], "l0 thick")
    p.curve([1, 600], [AUC_LOGIT, AUC_LOGIT], "ref")
    for lr, cls in [(0.05, "d0"), (0.5, "d3")]:
        i = int(np.argmax(curves[lr])); p.dots([i + 1], [curves[lr][i]], cls, 5)
    legend(f, 520, 60, [("l0 thick", L("öğrenme oranı 0,05", "learning rate 0.05")[lang]), ("l3 thick", L("öğrenme oranı 0,5", "learning rate 0.5")[lang]), ("ref", L("lojistik regresyon", "logistic regression")[lang])], 24)
    b5, b05 = int(np.argmax(curves[0.5])) + 1, int(np.argmax(curves[0.05])) + 1
    f.mtext(580, 170, L(f"0,05: tepe {num(max(curves[0.05]), 3, lang)}\n({b05}. ağaçta)\n0,5: tepe {num(max(curves[0.5]), 3, lang)}\n({b5}. ağaçta), sonra düşüş", f"0.05: peak {num(max(curves[0.05]), 3, lang)}\n(at tree {b05})\n0.5: peak {num(max(curves[0.5]), 3, lang)}\n(at tree {b5}), then decline")[lang], "ann", "middle")
    return f.svg("boost")


# ============================================================ Ünite 6–7 (SHAP)
GBF = GradientBoostingClassifier(n_estimators=100, learning_rate=0.05, max_depth=3, subsample=0.8, random_state=1).fit(X_egt, y_egt)
EX = shap.TreeExplainer(GBF)
XS = X_tst[:2000]
SV = EX.shap_values(XS)
BASE = float(np.ravel(EX.expected_value)[0])


def u6_waterfall(lang):
    k = 27; s = SV[k]; order = np.argsort(-np.abs(s)); nm = NAMES[lang]
    f = Fig(660, 300)
    lo, hi = -2.4, 0.9
    x0, x1 = 220, 600
    sx = lambda v: x0 + (v - lo) / (hi - lo) * (x1 - x0)
    row = 30; y0 = 30
    for v in [-2, -1, 0]:
        f.line(sx(v), y0 - 10, sx(v), y0 + 7 * row, "gr"); f.text(sx(v), y0 + 7 * row + 16, num(v, 0, lang), "tk")
    f.line(sx(BASE), y0 - 10, sx(BASE), y0 + 7 * row, "ref")
    f.text(sx(BASE), y0 - 14, L(f"taban {num(BASE, 2, lang)} (%{num(100 / (1 + np.exp(-BASE)), 0, lang)})", f"base {num(BASE, 2, lang)} ({num(100 / (1 + np.exp(-BASE)), 0, lang)}%)")[lang], "ann")
    cur = BASE
    for r, j in enumerate(order):
        y = y0 + r * row
        nx = cur + s[j]
        f.rect(sx(min(cur, nx)), y + 4, max(2, abs(sx(nx) - sx(cur))), row - 8, "bar " + ("b4" if s[j] > 0 else "b0"), 3)
        f.text(x0 - 8, y + row / 2 + 4, f"{nm[j]} = {num(XS[k, j], 2, lang)}", "tk", "end")
        f.text(sx(max(cur, nx)) + 6, y + row / 2 + 4, ("+" if s[j] > 0 else "") + num(s[j], 2, lang), "val", "start")
        cur = nx
    y = y0 + 6 * row
    f.line(sx(cur), y0, sx(cur), y + row - 4, "l3 dash")
    p = 1 / (1 + np.exp(-cur))
    f.text(sx(cur) - 6, y + row / 2 + 6, L(f"tahmin {num(cur, 2, lang)} → %{num(100 * p, 0, lang)}", f"prediction {num(cur, 2, lang)} → {num(100 * p, 0, lang)}%")[lang], "lb", "end")
    f.text(410, 292, L("log-odds (pembe: riski artıran, yeşil: azaltan)", "log-odds (pink: raises risk, green: lowers it)")[lang], "ann")
    NUMS["u6"] = dict(base=BASE, A=SV[27].round(2).tolist(), B=SV[52].round(2).tolist())
    return f.svg("waterfall")


def u7_dep(lang):
    f = Fig(660, 290)
    g = np.random.default_rng(2).choice(2000, 900, replace=False)
    p1 = Panel(f, 60, 30, 250, 200, (-3, 3), (-0.6, 2.2))
    p1.frame(xt=[-2, 0, 2], yt=[-0.5, 0, 0.5, 1, 1.5, 2], xl=L("yaş", "age")[lang], yl=L("SHAP katkısı (log-odds)", "SHAP contribution (log-odds)")[lang], xfmt=str, yfmt=lambda v: num(v, 1, lang))
    for i in g:
        f.circle(p1.sx(np.clip(XS[i, 5], -3, 3)), p1.sy(SV[i, 5]), 2, "d1 sm")
    f.text(p1.x + p1.w / 2, 20, L("Yaş: U biçimi", "Age: U shape")[lang], "lb")
    p2 = Panel(f, 380, 30, 250, 200, (-3, 3), (-0.6, 2.2))
    p2.frame(xt=[-2, 0, 0.7, 2], yt=[-0.5, 0, 0.5, 1, 1.5, 2], xl=L("borç/gelir", "debt/income")[lang], xfmt=lambda v: num(v, 1, lang) if v == 0.7 else str(int(v)), yfmt=lambda v: num(v, 1, lang))
    for i in g:
        f.circle(p2.sx(np.clip(XS[i, 0], -3, 3)), p2.sy(SV[i, 0]), 2, "d4 sm" if XS[i, 1] == 1 else "d0 sm")
    f.line(p2.sx(0.7), p2.y, p2.sx(0.7), p2.y + p2.h, "l2 dash")
    f.text(p2.x + p2.w / 2, 20, L("Borç/gelir: eşikte sıçrama", "Debt/income: jump at the threshold")[lang], "lb")
    f.circle(400, 278, 4, "d4"); f.text(408, 282, L("gecikmesi olanlar", "with a delinquency")[lang], "lg", "start")
    f.circle(540, 278, 4, "d0"); f.text(548, 282, L("olmayanlar", "without")[lang], "lg", "start")
    imp = np.abs(SV).mean(0)
    NUMS["u7"] = dict(imp=imp.round(2).tolist())
    return f.svg("dep")


def u7_imp(lang):
    imp = np.abs(SV).mean(0); order = np.argsort(-imp); nm = NAMES[lang]
    f = Fig(660, 230)
    x0, x1 = 200, 560
    for r, j in enumerate(order):
        y = 20 + r * 32
        w = imp[j] / imp.max() * (x1 - x0)
        f.rect(x0, y, w, 22, "bar b0", 3)
        f.text(x0 - 8, y + 16, nm[j], "tk", "end")
        f.text(x0 + w + 6, y + 16, num(imp[j], 2, lang), "val", "start")
    f.text(380, 222, L("ortalama |SHAP| (log-odds), 2.000 test başvurusu", "mean |SHAP| (log-odds), 2,000 test applications")[lang], "ann")
    return f.svg("imp")


# ============================================================ Ünite 8 (Tayvan)
kredi = pd.read_csv(os.path.join(ROOT, "data/credit/taiwan_default.csv"))
egitim, test = train_test_split(kredi, test_size=0.3, random_state=0, stratify=kredi["default"])
ye, yt = egitim["default"], test["default"]
ham = lambda d: d.drop(columns=["default", "sex", "marriage"])


def hazirla(df):
    X = ham(df).copy()
    for k in ["pay_0", "pay_2", "pay_3", "pay_4", "pay_5", "pay_6"]:
        X[k + "_g"] = X[k].clip(lower=0); X[k + "_t"] = (X[k] == -1).astype(int); X[k + "_y"] = (X[k] == -2).astype(int)
        X = X.drop(columns=[k])
    for k in [c for c in X.columns if "amt" in c]:
        X[k] = np.sign(X[k]) * np.log1p(np.abs(X[k]))
    return X


def u8_compare(lang):
    At = lambda m, X: roc_auc_score(yt, m.predict_proba(X)[:, 1])
    res = [
        (L("Lojistik, ham kodlar", "Logistic, raw codes")[lang], At(make_pipeline(StandardScaler(), LogisticRegression(C=1e6, max_iter=5000)).fit(ham(egitim), ye), ham(test)), "bar b6"),
        (L("Lojistik, kodlar çözülmüş", "Logistic, codes decoded")[lang], At(make_pipeline(StandardScaler(), LogisticRegression(C=1e6, max_iter=5000)).fit(hazirla(egitim), ye), hazirla(test)), "bar b1"),
        (L("Tek ağaç (derinlik 6)", "Single tree (depth 6)")[lang], At(DecisionTreeClassifier(max_depth=6, min_samples_leaf=50, random_state=0).fit(ham(egitim), ye), ham(test)), "bar b6"),
        (L("Rassal orman", "Random forest")[lang], At(RandomForestClassifier(n_estimators=100, min_samples_leaf=20, max_samples=0.5, random_state=1).fit(ham(egitim), ye), ham(test)), "bar b0"),
        (L("Boosting", "Boosting")[lang], At(HistGradientBoostingClassifier(max_iter=200, learning_rate=0.05, max_leaf_nodes=8, early_stopping=False, random_state=1).fit(ham(egitim), ye), ham(test)), "bar b0"),
    ]
    f = Fig(660, 240)
    x0, x1, lo, hi = 230, 600, 0.70, 0.79
    sx = lambda v: x0 + (v - lo) / (hi - lo) * (x1 - x0)
    for v in [0.70, 0.72, 0.74, 0.76, 0.78]:
        f.line(sx(v), 12, sx(v), 20 + 5 * 36, "gr"); f.text(sx(v), 20 + 5 * 36 + 16, num(v, 2, lang), "tk")
    for r, (lab, v, cls) in enumerate(res):
        y = 18 + r * 36
        f.rect(x0, y, sx(v) - x0, 24, cls, 3)
        f.text(x0 - 8, y + 17, lab, "tk", "end")
        f.text(sx(v) + 6, y + 17, num(v, 3, lang), "val", "start")
    f.text(415, 234, L("test AUC (9.000 müşteri); eksen 0,70'ten başlıyor", "test AUC (9,000 customers); the axis starts at 0.70")[lang], "ann")
    NUMS["u8"] = {k[0]: k[1] for k in res}
    return f.svg("compare")


def u9_flow(lang):
    f = Fig(660, 130)
    steps = L(["Veriyi indir,\ntabakalı böl", "Ham sütunlar,\nkorunanlar hariç", "Ağaç sayısını\neğitimde seç", "Test AUC,\nlojistikle kıyas", "SHAP: toplama,\nönem, grafik"],
              ["Download data,\nstratified split", "Raw columns,\nno protected ones", "Choose trees\non training", "Test AUC vs\nlogistic", "SHAP: additivity,\nimportance, plots"])[lang]
    flow(f, steps, 8, 26, 116, 70, 17)
    f.text(330, 122, L("Görev A: adım 1–4 · Görev B: adım 5", "Task A: steps 1–4 · Task B: step 5")[lang], "ann")
    return f.svg("wsflow")


for n, fn in [("u1_shapes", u1_shapes), ("u1_tree", u1_tree), ("u2_depth", u2_depth), ("u4_forest", u4_forest), ("u5_boost", u5_boost),
              ("u6_waterfall", u6_waterfall), ("u7_dep", u7_dep), ("u7_imp", u7_imp), ("u8_compare", u8_compare), ("u9_flow", u9_flow)]:
    print("…", n, flush=True)
    both(n, fn)

import sklearn, shap as _shap
NUMS["meta"] = {"sklearn": sklearn.__version__, "numpy": np.__version__, "shap": _shap.__version__,
                "not": "Tarayıcıdaki Pyodide 0.26.4 ile aynı sürümler (scikit-learn 1.4.2, numpy 1.26.4); tohumlar kodda sabit."}
write(os.path.join(ROOT, "content/m5/m5-figs.js"), "M5", FIGS, NUMS, "Modül 5 kavram şekilleri")
print(json.dumps(NUMS, ensure_ascii=False, default=float)[:2500])
