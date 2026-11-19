"""Modül 3 kavram anlatımındaki şekilleri (satır içi SVG) ve oyun alanı verilerini üretir → content/m3/m3-figs.js
Veriler: modülün 40 değişkenli ücret dünyası (4. hafta notebook'uyla aynı yapı) ve data/fred/ altındaki 13 seri.
Çalıştırma: python3 tools/m3_figs.py   (depo kökünden; birkaç dakika sürebilir)"""
import os, sys, json, math, subprocess
import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings("ignore")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from figlib import Fig, Panel, L, num, legend, flow, write, ROOT
from sklearn.linear_model import LinearRegression, Ridge, Lasso, RidgeCV, LassoCV
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import KFold, TimeSeriesSplit, GridSearchCV
from sklearn.pipeline import make_pipeline

FIGS, NUMS = {}, {}
FAST = "--fast" in sys.argv


def both(name, fn):
    FIGS[name] = {lang: fn(lang) for lang in ("tr", "en")}


# ------------------------------------------------------------ ücret dünyası (m3-data.js ile aynı)
P, SIG = 40, 0.30
ADLAR = L(["Eğitim", "Deneyim", "Deneyim²", "Kıdem", "Büyükşehir", "Yaş"], ["Education", "Experience", "Experience²", "Tenure", "Big city", "Age"])
beta = np.zeros(P); beta[:5] = [0.30, 0.25, -0.12, 0.10, 0.12]


def ciz(n, rho=0.97, g=None):
    Z = g.normal(size=(n, P)); X = Z.copy()
    X[:, 5] = rho * X[:, 1] + np.sqrt(1 - rho ** 2) * Z[:, 5]
    for j in range(6, P):
        X[:, j] = 0.5 * X[:, j % 5] + np.sqrt(0.75) * Z[:, j]
    return X, 2.5 + X @ beta + g.normal(0, SIG, n)


hko = lambda a, b: float(np.mean((a - b) ** 2))
rng = np.random.default_rng(2026)
X_egt, y_egt = ciz(100, g=rng)
X_tst, y_tst = ciz(5000, g=rng)
sc = StandardScaler().fit(X_egt); Xs, Xt = sc.transform(X_egt), sc.transform(X_tst)
KAT = KFold(5, shuffle=True, random_state=1)
IZ = np.logspace(-3.5, 0.5, 60)
COL6 = ["l0", "l1", "l3", "l2", "l4", "l1 dash"]
MSE = "neg_mean_squared_error"


def gs_lasso(X, y, grid, cv, it=20000):
    """Kat içi ölçeklemeli λ seçimi: Pipeline(StandardScaler, Lasso) + GridSearchCV (HKO)."""
    return GridSearchCV(make_pipeline(StandardScaler(), Lasso(max_iter=it)), {"lasso__alpha": grid}, cv=cv, scoring=MSE).fit(X, y)


def gs_ridge(X, y, grid, cv):
    return GridSearchCV(make_pipeline(StandardScaler(), Ridge()), {"ridge__alpha": grid}, cv=cv, scoring=MSE).fit(X, y)


# ============================================================ Ünite 1
def u1_scatter(lang):
    m = LinearRegression().fit(Xs, y_egt)
    from sklearn.metrics import r2_score
    f = Fig(660, 280)
    out = {}
    for k, (XX, yy, ttl) in enumerate([(Xs, y_egt, L("Eğitim verisi (100 kişi)", "Training data (100 people)")[lang]), (Xt[:400], y_tst[:400], L("Test verisi (ilk 400 / 5.000 kişi)", "Test data (first 400 of 5,000 people)")[lang])]):
        p = Panel(f, 60 + k * 320, 34, 230, 190, (1.0, 4.0), (1.0, 4.0))
        p.frame(xt=[1.5, 2.5, 3.5], yt=[1.5, 2.5, 3.5], xl=L("gerçek log ücret", "actual log wage")[lang], yl=L("öngörü", "prediction")[lang] if k == 0 else None, xfmt=lambda v: num(v, 1, lang), yfmt=lambda v: num(v, 1, lang))
        p.curve([1.0, 4.0], [1.0, 4.0], "ref")
        pr = m.predict(XX); ok = (yy > 1.0) & (yy < 4.0) & (pr > 1.0) & (pr < 4.0)
        p.dots(yy[ok], pr[ok], "d1" if k == 0 else "d3", 2.6 if k == 0 else 2)
        f.text(p.x + 115, 22, ttl, "lb")
        r2 = r2_score(y_egt if k == 0 else y_tst, m.predict(Xs if k == 0 else Xt)); h = hko(m.predict(Xs if k == 0 else Xt), y_egt if k == 0 else y_tst)
        out["egt" if k == 0 else "tst"] = {"r2": float(r2), "hko": h}
        f.text(p.x + 115, 270, f"R² = {num(r2, 2, lang)}  ·  " + L("HKO", "MSE")[lang] + f" = {num(h, 3, lang)}", "val")
    NUMS["u1"] = out
    return f.svg("scatter")


# ============================================================ Ünite 2
def u2_pcurve(lang):
    R = 30 if FAST else 120
    g = np.random.default_rng(31)
    ps = [5, 8, 12, 16, 20, 25, 30, 35, 40]
    TR, TE = np.zeros(len(ps)), np.zeros(len(ps))
    Xte, yte = ciz(3000, g=g)
    for _ in range(R):
        X, y = ciz(100, g=g); s = StandardScaler().fit(X); a, b = s.transform(X), s.transform(Xte)
        for i, p_ in enumerate(ps):
            m = LinearRegression().fit(a[:, :p_], y)
            TR[i] += hko(m.predict(a[:, :p_]), y); TE[i] += hko(m.predict(b[:, :p_]), yte)
    TR /= R; TE /= R
    NUMS["u2_p"] = {"p": ps, "train": TR.tolist(), "test": TE.tolist()}
    f = Fig(640, 270)
    p = Panel(f, 70, 24, 480, 190, (3, 42), (0.04, 0.16))
    p.frame(xt=ps, yt=[0.06, 0.09, 0.12, 0.15], xl=L("modeldeki değişken sayısı (ilk 5'i gerçek, gerisi ilgisiz)", "variables in the model (first 5 real, the rest irrelevant)")[lang], yl=L("ortalama HKO", "average MSE")[lang], yfmt=lambda v: num(v, 2, lang))
    f.line(p.x, p.sy(0.09), p.x + p.w, p.sy(0.09), "ref")
    f.text(p.x + p.w - 4, p.sy(0.09) + 14, L("indirgenemez hata 0,09", "irreducible error 0.09")[lang], "ann", "end")
    p.curve(ps, TR, "l0 thick"); p.dots(ps, TR, "d0", 3.5)
    p.curve(ps, TE, "l3 thick"); p.dots(ps, TE, "d3", 3.5)
    legend(f, p.x + 14, 44, [("l3 thick", L("test hatası", "test error")[lang]), ("l0 thick", L("eğitim hatası", "training error")[lang])])
    f.text(320, 262, L(f"Her nokta {R} farklı 100 kişilik örneklemin ortalaması; EKK.", f"Each point averages {R} different 100-person samples; OLS.")[lang], "tk")
    return f.svg("pcurve")


# ============================================================ Ünite 3
ridge_iz = np.logspace(-2, 4.5, 70)
RP = np.array([Ridge(alpha=a).fit(Xs, y_egt).coef_ for a in ridge_iz])
lasso_iz = IZ
LP = np.array([Lasso(alpha=a, max_iter=20000).fit(Xs, y_egt).coef_ for a in lasso_iz])


def path_fig(lang, lam, path, title, xr, note):
    f = Fig(640, 280)
    p = Panel(f, 64, 30, 470, 190, (math.log10(xr[0]), math.log10(xr[1])), (-0.25, 0.5))
    ticks = [t for t in range(int(math.ceil(math.log10(xr[0]))), int(math.floor(math.log10(xr[1]))) + 1)]
    p.frame(xt=ticks, yt=[-0.2, 0, 0.2, 0.4], xl=L("λ (ceza gücü, log ölçek)", "λ (penalty strength, log scale)")[lang], yl=L("katsayı", "coefficient")[lang],
            xfmt=lambda v: num(10 ** v, 0 if v >= 0 else -v, lang), yfmt=lambda v: num(v, 1, lang))
    lx = np.log10(lam)
    for j in range(6, P):
        p.curve(lx, path[:, j], "thin l1")
    for j in range(6):
        p.curve(lx, path[:, j], COL6[j] + " thick")
    f.line(p.x, p.sy(0), p.x + p.w, p.sy(0), "ax")
    legend(f, 545, 50, [(COL6[j] + " thick", ADLAR[lang][j]) for j in range(6)] + [("thin l1", L("34 anket sorusu", "34 survey items")[lang])])
    f.text(p.x + p.w / 2, 18, title, "lb")
    f.text(320, 274, note, "ann")
    return f


def u3_path(lang):
    f = path_fig(lang, ridge_iz, RP, L("Ridge: λ büyüdükçe katsayı vektörü küçülür", "Ridge: the coefficient vector shrinks as λ grows")[lang], (0.01, 30000),
                 L("Büyük λ'da hepsi sıfıra yaklaşır; yolda bazıları önce büyüyebilir ya da işaret değiştirebilir.", "With a large λ all approach zero; along the way some may first grow or change sign.")[lang])
    return f.svg("rpath")


def u3_norm(lang):
    L2 = np.sqrt((RP ** 2).sum(axis=1))
    lx = np.log10(ridge_iz)
    nonmono = [j for j in range(P) if np.any(np.diff(np.abs(RP[:, j])) > 1e-6)]
    sign = [j for j in range(P) if np.any(np.sign(RP[:-1, j]) != np.sign(RP[1:, j]))]
    NUMS["u3_norm"] = {"l2_ols": float(L2[0]), "nonmono": len(nonmono), "sign": len(sign)}
    f = Fig(640, 266)
    p = Panel(f, 64, 28, 470, 170, (math.log10(0.01), math.log10(30000)), (0, 0.6))
    p.frame(xt=list(range(-2, 5)), yt=[0, 0.2, 0.4, 0.6], xl=L("λ (log ölçek)", "λ (log scale)")[lang], yl=L("L2 normu √Σβ²", "L2 norm √Σβ²")[lang],
            xfmt=lambda v: num(10 ** v, 0 if v >= 0 else -v, lang), yfmt=lambda v: num(v, 1, lang))
    p.curve(lx, L2, "l0 thick")
    j = nonmono[0] if nonmono else 6
    p.curve(lx, np.abs(RP[:, j]), "l3 dash")
    legend(f, p.x + 250, p.y + 16, [("l0 thick", L("katsayı vektörünün normu (hiç artmaz)", "norm of the coefficient vector (never rises)")[lang]), ("l3 dash", L(f"tek bir katsayının mutlak değeri ({(ADLAR[lang] + [('Anket ' if lang == 'tr' else 'Survey ') + str(i) for i in range(1, 35)])[j]})", f"absolute value of one coefficient ({(ADLAR[lang] + [('Anket ' if lang == 'tr' else 'Survey ') + str(i) for i in range(1, 35)])[j]})")[lang])])
    f.text(320, 18, L("Ridge toplam büyüklüğü küçültür; tek tek katsayılar küçülmek zorunda değil", "Ridge shrinks the total size; individual coefficients need not shrink")[lang], "lb")
    f.text(320, 258, L(f"40 katsayının {len(nonmono)}'sinin mutlak değeri yol boyunca en az bir kez artıyor; {len(sign)}'i işaret değiştiriyor.", f"{len(nonmono)} of the 40 coefficients rise in absolute value at least once along the path; {len(sign)} change sign.")[lang], "ann")
    return f.svg("rnorm")


def err_vs_lambda(lang, model, grid, title, xr, cv=False):
    tr, te, cvv = [], [], []
    for a in grid:
        m = model(a).fit(Xs, y_egt); tr.append(hko(m.predict(Xs), y_egt)); te.append(hko(m.predict(Xt), y_tst))
    if cv:
        gs = gs_lasso(X_egt, y_egt, grid, KAT)
        cvv = list(-gs.cv_results_["mean_test_score"])
        lc_alpha = float(gs.best_params_["lasso__alpha"]); lc_model = gs.best_estimator_
    f = Fig(640, 270)
    p = Panel(f, 64, 28, 470, 186, (math.log10(xr[0]), math.log10(xr[1])), (0.04, 0.30))
    ticks = [t for t in range(int(math.ceil(math.log10(xr[0]))), int(math.floor(math.log10(xr[1]))) + 1)]
    p.frame(xt=ticks, yt=[0.06, 0.1, 0.14, 0.18, 0.22, 0.26, 0.30], xl=L("λ (log ölçek)   ← EKK'ya yakın  |  çok basit →", "λ (log scale)   ← close to OLS  |  too simple →")[lang], yl=L("HKO", "MSE")[lang],
            xfmt=lambda v: num(10 ** v, 0 if v >= 0 else -v, lang), yfmt=lambda v: num(v, 2, lang))
    lx = np.log10(grid)
    f.line(p.x, p.sy(0.09), p.x + p.w, p.sy(0.09), "ref")
    p.curve(lx, tr, "l0 thick"); p.curve(lx, te, "l3 thick")
    items = [("l3 thick", L("test hatası (5.000 kişi)", "test error (5,000 people)")[lang]), ("l0 thick", L("eğitim hatası", "training error")[lang])]
    best = int(np.argmin(te))
    if cv:
        p.curve(lx, cvv, "l1 thick dash"); items.insert(1, ("l1 thick dash", L("çapraz doğrulama hatası", "cross-validation error")[lang]))
        sel = math.log10(lc_alpha)
        f.line(p.sx(sel), p.y, p.sx(sel), p.y + p.h, "leak")
        f.text(p.sx(sel) + 4, p.y + 12, L("seçilen λ = ", "chosen λ = ")[lang] + num(lc_alpha, 3, lang), "ann bad", "start")
        NUMS["u5_cv"] = {"alpha": lc_alpha, "test": hko(lc_model.predict(X_tst), y_tst), "nz": int((lc_model[-1].coef_ != 0).sum()), "cv": float(min(cvv)), "test_best_alpha": float(grid[best]), "test_best": float(te[best])}
    else:
        p.dots([lx[best]], [te[best]], "d3", 5)
        NUMS["u3_ridge"] = {"best_alpha": float(grid[best]), "best_test": float(te[best]), "ols_test": te[0], "const_test": hko(np.full(len(y_tst), y_egt.mean()), y_tst)}
    legend(f, p.x + 14, p.y + 16, items)
    f.text(p.x + p.w - 4, p.sy(0.09) + 14, L("indirgenemez hata", "irreducible error")[lang], "ann", "end")
    f.text(320, 18, title, "lb")
    return f


def u3_err(lang):
    return err_vs_lambda(lang, lambda a: Ridge(alpha=a), ridge_iz, L("Ridge: hata λ'ya göre U çizer", "Ridge: error traces a U in λ")[lang], (0.01, 30000)).svg("rerr")


# ============================================================ Ünite 4
def u4_geo(lang):
    merkez = np.array([1.4, 0.5]); aci = -50; eksen = np.array([1.25, 0.65])
    th = np.deg2rad(aci); Rm = np.array([[np.cos(th), -np.sin(th)], [np.sin(th), np.cos(th)]])
    hata = lambda Q: np.sqrt((((Q - merkez) @ Rm / eksen) ** 2).sum(axis=1))
    t = np.linspace(0, 2 * np.pi, 4000); birim = np.c_[np.cos(t), np.sin(t)]
    S = {0: birim, 1: birim / np.abs(birim).sum(axis=1, keepdims=True)}
    f = Fig(660, 300)
    res = {}
    for k in (0, 1):
        p = Panel(f, 40 + k * 330, 34, 260, 214, (-1.4, 2.8), (-1.4, 2.0))
        f.line(p.sx(-1.4), p.sy(0), p.sx(2.8), p.sy(0), "ax"); f.line(p.sx(0), p.sy(-1.4), p.sx(0), p.sy(2.0), "ax")
        Q = S[k]; hh = hata(Q); coz = Q[np.argmin(hh)]; lev = hh.min()
        res["ridge" if k == 0 else "lasso"] = coz.round(2).tolist()
        pts = [(p.sx(a), p.sy(b)) for a, b in Q[::20]]
        f.add('<polygon points="' + " ".join(f"{x:.1f},{y:.1f}" for x, y in pts) + f'" class="zone {"z0" if k == 0 else "z3"}"/>')
        for s_, cls in [(0.3, "gr"), (0.6, "gr"), (lev, "leak"), (lev * 1.35, "gr")]:
            tt = np.linspace(0, 2 * np.pi, 120)
            E = (np.c_[np.cos(tt) * eksen[0], np.sin(tt) * eksen[1]] * s_) @ Rm.T + merkez
            p.curve(E[:, 0], E[:, 1], cls)
        p.dots([merkez[0]], [merkez[1]], "d6", 4); f.text(p.sx(merkez[0]) + 6, p.sy(merkez[1]) - 6, L("EKK çözümü", "OLS solution")[lang], "tk", "start")
        p.dots([coz[0]], [coz[1]], "d4", 6)
        f.text(p.sx(2.75), p.sy(0) + 14, "β₁", "val", "end"); f.text(p.sx(0) + 6, p.sy(1.95), "β₂", "val", "start")
        f.text(p.x + 130, 22, L(["Ridge: β₁² + β₂² ≤ t", "Lasso: |β₁| + |β₂| ≤ t"][k], ["Ridge: β₁² + β₂² ≤ t", "Lasso: |β₁| + |β₂| ≤ t"][k])[lang], "lb")
        f.text(p.x + 130, 270, L(f"çözüm: β₁ = {num(coz[0], 2, 'tr')}, β₂ = {num(coz[1], 2, 'tr')}", f"solution: β₁ = {coz[0]:.2f}, β₂ = {coz[1]:.2f}")[lang], "val")
    f.text(330, 292, L("Elipsler eşit hata eğrileri; renkli bölge katsayı bütçesi. Bu bütçede Lasso'nun çözümü köşeye düşer: β₂ = 0.", "Ellipses are equal-error contours; the coloured region is the coefficient budget. At this budget Lasso's solution lands on a corner: β₂ = 0.")[lang], "ann")
    NUMS["u4_geo"] = res
    return f.svg("geo")


def u4_geo3(lang):
    merkez = np.array([1.4, 0.5]); th = np.deg2rad(-50); eksen = np.array([1.25, 0.65])
    Rm = np.array([[np.cos(th), -np.sin(th)], [np.sin(th), np.cos(th)]])
    hata = lambda Q: np.sqrt((((Q - merkez) @ Rm / eksen) ** 2).sum(axis=1))
    t = np.linspace(0, 2 * np.pi, 4000); birim = np.c_[np.cos(t), np.sin(t)]; D = birim / np.abs(birim).sum(axis=1, keepdims=True)
    f = Fig(660, 290)
    out = []
    for k, (T, ttl) in enumerate([(1.0, L("t = 1,0: köşe çözümü", "t = 1.0: corner solution")[lang]), (1.5, L("t = 1,5: kenar çözümü", "t = 1.5: edge solution")[lang]), (2.2, L("t = 2,2: bütçe bağlamıyor", "t = 2.2: budget not binding")[lang])]):
        p = Panel(f, 20 + k * 215, 34, 190, 170, (-0.6, 2.4), (-0.6, 1.6))
        cid = f"g3c{k}{lang}"
        f.add(f'<clipPath id="{cid}"><rect x="{p.x:.1f}" y="{p.y:.1f}" width="{p.w:.1f}" height="{p.h:.1f}"/></clipPath><g clip-path="url(#{cid})">')
        f.line(p.sx(-0.6), p.sy(0), p.sx(2.4), p.sy(0), "ax"); f.line(p.sx(0), p.sy(-0.6), p.sx(0), p.sy(1.6), "ax")
        Q = D * T
        inside = np.abs(merkez).sum() <= T
        coz = merkez if inside else Q[np.argmin(hata(Q))]
        lev = hata(coz[None, :])[0]
        pts = [(p.sx(a), p.sy(b)) for a, b in Q[::20]]
        f.add('<polygon points="' + " ".join(f"{x:.1f},{y:.1f}" for x, y in pts) + '" class="zone z3"/>')
        for s_, cls in ([(0.3, "gr"), (lev, "leak")] if lev > 0.05 else [(0.3, "gr"), (0.6, "gr")]):
            tt = np.linspace(0, 2 * np.pi, 120)
            E = (np.c_[np.cos(tt) * eksen[0], np.sin(tt) * eksen[1]] * s_) @ Rm.T + merkez
            p.curve(E[:, 0], E[:, 1], cls)
        p.dots([merkez[0]], [merkez[1]], "d6", 3.5)
        p.dots([coz[0]], [coz[1]], "d4", 5.5)
        f.add("</g>")
        f.text(p.x + 95, 22, ttl, "lb")
        f.text(p.x + 95, 226, L(f"β = ({num(coz[0], 2, 'tr')}; {num(coz[1], 2, 'tr')})", f"β = ({coz[0]:.2f}, {coz[1]:.2f})")[lang], "val")
        out.append([round(float(coz[0]), 3), round(float(coz[1]), 3)])
    f.text(330, 254, L("Gri nokta EKK çözümü (1,40; 0,50). Kenarda iki katsayı da sıfırdan farklı ama ikisi de küçülmüş;", "Grey dot: OLS solution (1.40, 0.50). At the edge both coefficients are non-zero but both have shrunk;")[lang], "ann")
    f.text(330, 272, L("bütçe yeterince büyükse kısıt bağlamaz ve Lasso = EKK.", "with a large enough budget the constraint does not bind and Lasso = OLS.")[lang], "ann")
    NUMS["u4_geo3"] = out
    return f.svg("geo3")


def u4_path(lang):
    f = path_fig(lang, lasso_iz, LP, L("Lasso: λ büyüdükçe katsayılar teker teker tam sıfıra düşer", "Lasso: as λ grows coefficients drop to exactly zero one by one")[lang], (10 ** -3.5, 10 ** 0.5),
                 L("Sağda yalnızca en güçlü birkaç değişken kalır; λ yeterince büyükse hepsi sıfırdır.", "On the right only the strongest few variables remain; with a large enough λ all are zero.")[lang])
    nz = (LP != 0).sum(axis=1)
    NUMS["u4_nz"] = {"lam": lasso_iz.tolist(), "nz": nz.tolist()}
    return f.svg("lpath")


# ============================================================ Ünite 5
def u5_cv(lang):
    return err_vs_lambda(lang, lambda a: Lasso(alpha=a, max_iter=20000), IZ, L("Lasso: λ'yı çapraz doğrulama seçer", "Lasso: cross-validation chooses λ")[lang], (10 ** -3.5, 10 ** 0.5), cv=True).svg("cv")


def u5_coefs(lang):
    ekk = LinearRegression().fit(Xs, y_egt)
    rcg = gs_ridge(X_egt, y_egt, np.logspace(-2, 4, 60), KAT); rc = rcg.best_estimator_[-1]
    lcg = gs_lasso(X_egt, y_egt, IZ, KAT); lc = lcg.best_estimator_[-1]
    f = Fig(660, 345)
    rows = [("EKK", ekk.coef_, "OLS"), ("Ridge", rc.coef_, "Ridge"), ("Lasso", lc.coef_, "Lasso")]
    out = {}
    for k, (tr_, c, en_) in enumerate(rows):
        p = Panel(f, 60, 18 + k * 98, 560, 76, (-0.5, 39.5), (-0.25, 0.5))
        f.line(p.x, p.sy(0), p.x + p.w, p.sy(0), "ax")
        for v in (-0.2, 0.2, 0.4):
            f.line(p.x, p.sy(v), p.x + p.w, p.sy(v), "gr"); f.text(p.x - 6, p.sy(v) + 4, num(v, 1, lang), "tk", "end")
        bw = p.w / 40 * 0.7
        for j in range(P):
            v = float(c[j]); y0, y1 = p.sy(max(v, 0)), p.sy(min(v, 0))
            f.rect(p.sx(j) - bw / 2, y0, bw, max(y1 - y0, 0.6), "bar " + ("b1" if j < 5 else ("b3" if j == 5 else "b6")), 1)
        for j in range(5):
            f.line(p.sx(j) - bw, p.sy(beta[j]), p.sx(j) + bw, p.sy(beta[j]), "ax thick")
        f.text(p.x + p.w, p.y + 8, tr_ if lang == "tr" else en_, "lb", "end")
        out[en_] = {"nz": int((np.abs(c) > 1e-8).sum()), "test": hko(ekk.predict(Xt), y_tst) if k == 0 else hko((rcg if k == 1 else lcg).predict(X_tst), y_tst),
                    "alpha": None if k == 0 else float(list((rcg if k == 1 else lcg).best_params_.values())[0])}
    f.line(p.sx(-0.4), 306, p.sx(4.4), 306, "l1 thick"); f.text(p.sx(2), 322, L("5 gerçek değişken", "5 real variables")[lang], "tk")
    f.text(p.sx(5), 338, L("Yaş", "Age")[lang], "tk")
    f.text(p.sx(22), 322, L("← 34 anket sorusu (gerçek etkisi sıfır) →", "← 34 survey items (true effect zero) →")[lang], "tk")
    f.text(p.x + p.w, 14, L("siyah çizgiler: gerçek katsayılar", "black ticks: true coefficients")[lang], "ann", "end")
    NUMS["u5_three"] = out
    return f.svg("coefs")


# ============================================================ Ünite 6
def u6_select(lang):
    R = 40 if FAST else 150
    g = np.random.default_rng(7)
    res = {}
    for rho in (0.97, 0.995):
        say = {"d": 0, "a": 0, "b": 0, "n": 0}
        for _ in range(R):
            X, y = ciz(100, rho=rho, g=g)
            c_ = gs_lasso(X, y, np.logspace(-2.5, -0.5, 12), KAT).best_estimator_[-1].coef_
            d, a = abs(c_[1]) > 1e-8, abs(c_[5]) > 1e-8
            say["b" if d and a else "d" if d else "a" if a else "n"] += 1
        res[str(rho)] = {k: v / R for k, v in say.items()}
        res[str(rho)]["count"] = dict(say); res[str(rho)]["R"] = R
    NUMS["u6_sel"] = res
    f = Fig(640, 230)
    labs = L(["yalnızca Deneyim", "ikisi birden", "yalnızca Yaş", "hiçbiri"], ["Experience only", "both", "Age only", "neither"])[lang]
    cls = ["bar b1", "bar b2", "bar b3", "bar b6"]
    for k, rho in enumerate(("0.97", "0.995")):
        y = 40 + k * 80
        f.text(118, y + 22, L("korelasyon ", "correlation ")[lang] + num(float(rho), 3 if rho == "0.995" else 2, lang), "lb", "end")
        x = 130
        for i, key in enumerate(["d", "b", "a", "n"]):
            w = res[rho][key] * 480
            if w > 0:
                f.rect(x, y, w, 34, cls[i], 3)
                if w > 34:
                    f.text(x + w / 2, y + 22, str(res[rho]["count"][key]), "lbw")
            x += w
    legend(f, 130, 214, [], 0)
    for i, (lab, c) in enumerate(zip(labs, cls)):
        f.rect(130 + i * 125, 200, 12, 12, c, 2); f.text(148 + i * 125, 210, lab, "lg", "start")
    f.text(320, 20, L(f"Lasso, Deneyim ile Yaş'tan hangisini seçiyor? (çubuk içi: {R} örneklemden kaçında)", f"Which of Experience and Age does Lasso select? (in bars: how many of {R} samples)")[lang], "lb")
    return f.svg("select")


def u6_n(lang):
    R = 10 if FAST else 40
    g = np.random.default_rng(61)
    Xte, yte = ciz(3000, g=g)
    ns = [60, 100, 200, 500, 1000]
    out = {"n": ns, "ols": [], "lasso": []}
    for n in ns:
        e, l_ = [], []
        for _ in range(R):
            X, y = ciz(n, g=g); s = StandardScaler().fit(X); a, b = s.transform(X), s.transform(Xte)
            e.append(hko(LinearRegression().fit(a, y).predict(b), yte))
            l_.append(hko(gs_lasso(X, y, np.logspace(-3.5, 0.5, 40), KAT).predict(Xte), yte))
        out["ols"].append(float(np.mean(e))); out["lasso"].append(float(np.mean(l_)))
    NUMS["u6_n"] = out
    f = Fig(640, 260)
    p = Panel(f, 70, 24, 480, 180, (-0.5, len(ns) - 0.5), (0.06, 0.32))
    p.frame(yt=[0.1, 0.15, 0.2, 0.25, 0.3], yl=L("ortalama test HKO", "average test MSE")[lang], xl=L("eğitim örneklemindeki gözlem sayısı (40 değişken)", "observations in the training sample (40 variables)")[lang], yfmt=lambda v: num(v, 2, lang))
    f.line(p.x, p.sy(0.09), p.x + p.w, p.sy(0.09), "ref")
    for i, n in enumerate(ns):
        x = p.sx(i)
        f.rect(x - 34, p.sy(out["ols"][i]), 32, p.sy(0.06) - p.sy(out["ols"][i]), "bar b6", 3)
        f.rect(x + 2, p.sy(out["lasso"][i]), 32, p.sy(0.06) - p.sy(out["lasso"][i]), "bar b0", 3)
        f.text(x - 18, p.sy(out["ols"][i]) - 5, num(out["ols"][i], 3, lang), "tk")
        f.text(x + 18, p.sy(out["lasso"][i]) - 5, num(out["lasso"][i], 3, lang), "tk")
        f.text(x, p.y + p.h + 15, "n = " + num(n, 0, lang), "tk")
    legend(f, p.x + 300, 44, [("bar b6", "EKK" if lang == "tr" else "OLS"), ("bar b0", "Lasso"), ("ref", L("indirgenemez hata (0,09)", "irreducible error (0.09)")[lang])])
    f.text(320, 254, L(f"Her çubuk {R} örneklemin ortalaması.", f"Each bar averages {R} samples.")[lang], "tk")
    return f.svg("ngain")


# ============================================================ Ünite 7–8: enflasyon
def build_inflation():
    js = "global.window={};require('%s/content/m3/m3-data.js');process.stdout.write(window.M3_DATA.INFX.tr)" % ROOT
    code = subprocess.run(["node", "-e", js], capture_output=True, text=True).stdout
    cwd = os.getcwd(); os.chdir(os.path.join(ROOT, "data")); ns = {}
    exec(code, ns); os.chdir(cwd)
    return ns


INF = build_inflation()
G, egitim, test, oz, tablo = INF["G"], INF["egitim"], INF["test"], INF["ozellikler"], INF["tablo"]
kh = INF["kok_hko"]
XeI, XtI = egitim[oz], test[oz]
olsI = make_pipeline(StandardScaler(), LinearRegression()).fit(XeI, egitim["hedef"])
IZI = np.logspace(-4, 0.5, 60)
lasG = gs_lasso(XeI, egitim["hedef"], IZI, TimeSeriesSplit(5), 50000); lasI = lasG.best_estimator_[-1]
ridG = gs_ridge(XeI, egitim["hedef"], np.logspace(-2, 4, 60), TimeSeriesSplit(5))
kfG = gs_lasso(XeI, egitim["hedef"], IZI, KFold(5, shuffle=True, random_state=1), 50000)
bazI = LinearRegression().fit(egitim[["enf_g0", "aylik_g11"]], egitim["hedef"])
PRED = {"saf": test["enf_g0"].to_numpy(), "ekk": olsI.predict(XtI), "ridge": ridG.predict(XtI), "lasso": lasG.predict(XtI), "baz": bazI.predict(test[["enf_g0", "aylik_g11"]])}
act = test["hedef"].to_numpy()
hedef_tarih = [d.strftime("%Y-%m") for d in test["hedef_ayi"]]
res = {k: kh(v, act) for k, v in PRED.items()}
sub, sub_n = {}, {}
for a, b in [("2015", "2019"), ("2020", "2026")]:
    m_ = (test["hedef_ayi"] >= a + "-01-01").to_numpy() & (test["hedef_ayi"] <= b + "-12-31").to_numpy()   # hedef ayına göre
    sub[a + "-" + b] = {k: kh(v[m_], act[m_]) for k, v in PRED.items()}; sub_n[a + "-" + b] = int(m_.sum())
sel = sorted([(oz[i], float(c)) for i, c in enumerate(lasI.coef_) if abs(c) > 1e-10], key=lambda x: -abs(x[1]))
NUMS["inf"] = {"rmse": res, "sub": sub, "sub_n": sub_n, "alpha": float(lasG.best_params_["lasso__alpha"]), "cv": float(np.sqrt(-lasG.best_score_)), "nz": len(sel), "sel": sel,
               "n_train": len(egitim), "n_test": len(test), "p": len(oz), "train_first_target": str(egitim["hedef_ayi"].min().date()), "test_first_target": str(test["hedef_ayi"].min().date()),
               "test_last_target": str(test["hedef_ayi"].max().date()), "ekk_train": kh(olsI.predict(XeI), egitim["hedef"]),
               "baz_coef": bazI.coef_.tolist(), "baz_int": float(bazI.intercept_), "ridge_alpha": float(ridG.best_params_["ridge__alpha"]),
               "kfold": {"alpha": float(kfG.best_params_["lasso__alpha"]), "cv": float(np.sqrt(-kfG.best_score_)), "test": kh(kfG.predict(XtI), act)}}
NUMS["race"] = {"d": hedef_tarih, "y": [round(float(v), 3) for v in act], **{k: [round(float(x), 3) for x in v] for k, v in PRED.items()}}


def u7_series(lang):
    s = G["enf"].loc["1984-01-01":].dropna()
    f = Fig(660, 250)
    p = Panel(f, 50, 20, 580, 180, (1984, 2027), (-3, 10))
    yr = s.index.year + (s.index.month - 1) / 12
    f.rect(p.sx(1984), p.y, p.sx(2015) - p.sx(1984), p.h, "zone z0")
    f.rect(p.sx(2015), p.y, p.sx(2026.9) - p.sx(2015), p.h, "zone z3")
    p.frame(xt=[1985, 1995, 2005, 2015, 2025], yt=[-2, 0, 2, 4, 6, 8, 10], yl=L("yıllık enflasyon (%)", "annual inflation (%)")[lang])
    f.line(p.x, p.sy(0), p.x + p.w, p.sy(0), "ax")
    p.curve(yr, s.values, "l1 thick")
    f.text(p.sx(1999.5), p.y + 16, L(f"eğitim hedefleri: 1984–2014 ({len(egitim)} ay)", f"training targets: 1984–2014 ({len(egitim)} months)")[lang], "lb")
    f.text(p.sx(2019), p.sy(6), L(f"test hedefleri: {len(test)} ay", f"test targets: {len(test)} months")[lang], "lb")
    pk = s.loc["2021":"2023"].idxmax()
    f.text(p.sx(pk.year + (pk.month - 1) / 12) - 8, p.sy(s.loc[pk]) + 6, L(f"{pk.strftime('%m/%Y')}: %{num(s.loc[pk], 1, 'tr')}", f"{pk.strftime('%m/%Y')}: {s.loc[pk]:.1f}%")[lang], "ann", "end")
    f.text(330, 240, L("ABD TÜFE (FRED: CPIAUCSL), 12 aylık değişim", "US CPI (FRED: CPIAUCSL), 12-month change")[lang], "tk")
    NUMS["u7_peak"] = [pk.strftime("%Y-%m"), float(s.loc[pk])]
    return f.svg("infseries")


def u7_timeline(lang):
    f = Fig(660, 210)
    T = L(dict(known="Öngörü anında bilinenler (t ayının sonunda)", tgt="Hedef", out="pencereden çıkan ay", inn="pencereye giren ay",
               f1="bu ayın ve son 2 ayın değerleri: g0, g1, g2", f2="son 12 ayın aylık enflasyonu: aylik_g0 … aylik_g11",
               note="yıllık enflasyon(t+1) − yıllık enflasyon(t) ≈ aylık(t+1) − aylık(t−11)  (yaklaşık)", base="baz etkisi"),
          dict(known="Known when forecasting (end of month t)", tgt="Target", out="month leaving the window", inn="month entering the window",
               f1="this month's and the last 2 months' values: l0, l1, l2", f2="monthly inflation of the last 12 months: monthly_l0 … monthly_l11",
               note="annual inflation(t+1) − annual inflation(t) ≈ monthly(t+1) − monthly(t−11)  (approx.)", base="base effect"))[lang]
    x0, w = 30, 44
    for i in range(14):
        k = i - 12
        lab = "t" if k == 0 else (f"t{k}" if k < 0 else "t+1")
        cls = "box c3s" if k == 1 else ("box c4s" if k == -11 else ("box c0s" if -11 <= k <= 0 else "box soft"))
        f.rect(x0 + i * w, 70, w - 4, 34, cls, 6)
        f.text(x0 + i * w + (w - 4) / 2, 92, lab.replace("-", "−"), "tk")
    f.rect(x0 + 1 * w - 3, 64, 12 * w + 2, 46, "ring", 8)
    f.text(x0 + 6.5 * w, 58, T["known"], "lb")
    f.text(x0 + 13 * w + 20, 58, T["tgt"], "lb")
    f.arrow(x0 + 1 * w + 20, 130, x0 + 1 * w + 20, 108, "arr bad"); f.text(x0 + 1 * w + 20, 144, T["out"], "ann bad")
    f.arrow(x0 + 13 * w + 20, 130, x0 + 13 * w + 20, 108, "arr good"); f.text(650, 144, T["inn"], "ann good", "end")
    f.text(330, 172, T["note"], "val")
    f.text(330, 194, "(" + T["base"] + ")", "ann")
    f.text(x0 + 6.5 * w, 24, T["f1"] + "  ·  " + T["f2"], "tk")
    return f.svg("timeline")


def u8_race(lang):
    f = Fig(660, 280)
    d = pd.to_datetime(NUMS["race"]["d"])
    x = d.year + (d.month - 1) / 12
    p = Panel(f, 50, 24, 580, 200, (2015, 2026), (-1, 10))
    p.frame(xt=[2015, 2017, 2019, 2021, 2023, 2025], yt=[0, 2, 4, 6, 8, 10], yl=L("yıllık enflasyon (%)", "annual inflation (%)")[lang])
    p.curve(x, act, "ref thick")
    p.curve(x, PRED["saf"], "l3")
    p.curve(x, PRED["lasso"], "l0 thick")
    legend(f, p.x + 14, 44, [("ref thick", L("gerçekleşen", "actual")[lang]), ("l3", L("saf öngörü (bu ayki değer)", "naive (this month's value)")[lang]), ("l0 thick", "Lasso")])
    f.text(330, 252, L(f"Test kök HKO (yüzde puan, {len(test)} hedef ayı): saf {num(res['saf'], 3, lang)} · EKK {num(res['ekk'], 3, lang)} · Ridge {num(res['ridge'], 3, lang)} · Lasso {num(res['lasso'], 3, lang)}",
                       f"Test RMSE (percentage points, {len(test)} target months): naive {num(res['saf'], 3, lang)} · OLS {num(res['ekk'], 3, lang)} · Ridge {num(res['ridge'], 3, lang)} · Lasso {num(res['lasso'], 3, lang)}")[lang], "val")
    f.text(330, 272, L("Saf öngörü bir ay geriden geliyor. Modeller 2014 sonunda bir kez kuruldu (sabit eğitim penceresi).", "The naive forecast lags one month. The models were built once at the end of 2014 (fixed training window).")[lang], "ann")
    return f.svg("race")


def u8_bars(lang):
    f = Fig(660, 250)
    keys = ["saf", "ekk", "ridge", "lasso", "baz"]
    labs = L(["Saf", "EKK (51)", "Ridge", "Lasso", "2 değişken"], ["Naive", "OLS (51)", "Ridge", "Lasso", "2 variables"])[lang]
    cls = ["bar b6", "bar b4", "bar b2", "bar b0", "bar b1"]
    groups = [("all", L(f"Tüm test (n = {len(test)})", f"Whole test (n = {len(test)})")[lang], res), ("2015-2019", f"2015–2019 (n = {sub_n['2015-2019']})", sub["2015-2019"]), ("2020-2026", L(f"2020 → (n = {sub_n['2020-2026']})", f"2020 → (n = {sub_n['2020-2026']})")[lang], sub["2020-2026"])]
    p = Panel(f, 60, 30, 560, 170, (0, 3), (0, 0.65))
    p.frame(yt=[0, 0.2, 0.4, 0.6], yl=L("test kök HKO (yüzde puan)", "test RMSE (percentage points)")[lang], yfmt=lambda v: num(v, 1, lang))
    for gi, (_, gl, R_) in enumerate(groups):
        cx = p.sx(gi + 0.5)
        for i, k in enumerate(keys):
            x = cx - 2.5 * 30 + i * 30
            f.rect(x, p.sy(R_[k]), 26, p.sy(0) - p.sy(R_[k]), cls[i], 3)
            f.text(x + 13, p.sy(R_[k]) - 4 - (i % 2) * 12, num(R_[k], 3, lang), "tk")   # komşu etiketler çakışmasın
        f.text(cx, p.y + p.h + 16, gl, "lb")
    for i, (lab, c) in enumerate(zip(labs, cls)):
        f.rect(70 + i * 112, 236, 12, 12, c, 2); f.text(88 + i * 112, 246, lab, "lg", "start")
    return f.svg("bars")


def u8_sel(lang):
    top = NUMS["inf"]["sel"][:10]
    f = Fig(640, 30 + 24 * len(top) + 40)
    mx = max(abs(c) for _, c in top)
    x0 = 330
    f.line(x0, 20, x0, 20 + 24 * len(top), "ax")
    for i, (n_, c) in enumerate(top):
        y = 26 + i * 24
        w = abs(c) / mx * 260
        f.rect(x0 if c > 0 else x0 - w, y, w, 16, "bar " + ("b0" if c > 0 else "b4"), 3)
        name = n_ if lang == "tr" else n_.replace("_g", "_l").replace("aylik", "monthly").replace("enf", "inf")
        f.text(x0 - 6 if c > 0 else x0 - w - 6, y + 12, name, "mono", "end")
        f.text((x0 + w + 6) if c > 0 else (x0 + 6), y + 12, num(c, 3, lang), "tk", "start")
    f.text(320, 30 + 24 * len(top) + 26, L(f"Lasso 51 adaydan {NUMS['inf']['nz']} değişken seçti; en büyük 10 katsayı (standartlaştırılmış).", f"Lasso kept {NUMS['inf']['nz']} of 51 candidates; the 10 largest coefficients (standardised).")[lang], "ann")
    return f.svg("sel")


def u9_flow(lang):
    f = Fig(660, 130)
    steps = L(["13 seriyi indir,\naylığa çevir", "Özellik + hedef (t+1),\nhedef ayına göre böl", "Saf öngörü\nve EKK", "Pipeline + Grid-\nSearchCV + TSS", "Seçilenleri\nyorumla"],
              ["Download 13 series,\nmake monthly", "Features + target (t+1),\nsplit by target month", "Naive forecast\nand OLS", "Pipeline + Grid-\nSearchCV + TSS", "Interpret the\nselected variables"])[lang]
    flow(f, steps, 8, 26, 116, 70, 17)
    f.text(330, 122, L("Görev A: adım 1–3 · Görev B: adım 4–5", "Task A: steps 1–3 · Task B: steps 4–5")[lang], "ann")
    return f.svg("wsflow")


for n, fn in [("u1_scatter", u1_scatter), ("u2_pcurve", u2_pcurve), ("u3_path", u3_path), ("u3_norm", u3_norm), ("u3_err", u3_err), ("u4_geo", u4_geo), ("u4_geo3", u4_geo3), ("u4_path", u4_path),
              ("u5_cv", u5_cv), ("u5_coefs", u5_coefs), ("u6_select", u6_select), ("u6_n", u6_n), ("u7_series", u7_series), ("u7_timeline", u7_timeline),
              ("u8_race", u8_race), ("u8_bars", u8_bars), ("u8_sel", u8_sel), ("u9_flow", u9_flow)]:
    print("…", n, flush=True)
    both(n, fn)

write(os.path.join(ROOT, "content/m3/m3-figs.js"), "M3", FIGS, NUMS, "Modül 3 kavram şekilleri ve oyun alanı verileri")
print(json.dumps({k: v for k, v in NUMS.items() if k not in ("race", "u4_nz")}, ensure_ascii=False, default=float)[:3000])
