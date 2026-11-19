"""Modül 1 kavram anlatımındaki şekilleri (satır içi SVG) üretir → content/m1/m1-figs.js
Veriler: modülün kurgusal kredi tablosu (m1-data.js), oyun alanıyla aynı çoklu bağlantı simülasyonu
ve data/fred/ (UNRATE, FEDFUNDS) anlık görüntüleri. Çalıştırma: python3 tools/m1_figs.py"""
import os, sys
import numpy as np
import pandas as pd
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from figlib import Fig, Panel, L, num, legend, flow, write, ROOT

FIGS, NUMS = {}, {}


def both(name, fn):
    FIGS[name] = {lang: fn(lang) for lang in ("tr", "en")}


# Modülün kredi tablosu (m1-data.js ile aynı)
YAS = [25, 41, 33, 52, 29, 47, 38, 60, 35, 44]
GELIR = [30000, 52000, 41000, None, 36000, 61000, 45000, 58000, None, 50000]
KART = [4200, 6100, 5300, 7000, 48000, 6900, 5600, 6400, 5000, 5900]
BOLGE = ["Doğu", "Batı", "Merkez", "Doğu", "Batı", "Merkez", "Doğu", "Batı", "Merkez", "Doğu"]
BOLGE_EN = {"Doğu": "East", "Batı": "West", "Merkez": "Central"}
TEM = [1, 0, 0, 1, 1, 0, 0, 0, 1, 0]


# ------------------------------------------------------------ Ünite 1
def u1_rings(lang):
    f = Fig(660, 270)
    f.ellipse(250, 135, 235, 125, "ring")
    f.ellipse(290, 152, 160, 90, "ring in")
    f.ellipse(330, 168, 82, 50, "ring deep")
    f.text(250, 32, L("Yapay zekâ", "Artificial intelligence")[lang], "lb")
    f.text(250, 48, L("insan zekâsı gerektiren işleri yapan her sistem", "any system doing tasks that need human intelligence")[lang], "tk")
    f.text(290, 82, L("Makine öğrenmesi", "Machine learning")[lang], "lb")
    f.text(290, 98, L("kuralları veriden öğrenir", "learns the rules from data")[lang], "tk")
    f.text(330, 164, L("Derin öğrenme", "Deep learning")[lang], "lb")
    f.text(330, 180, L("çok katmanlı sinir ağları", "many-layered neural networks")[lang], "tk")
    ex = L([("Elle yazılmış kural:", "“gelir < 20.000 ise reddet”", 70, 150),
            ("Veriden öğrenilen kural:", "geçmiş başvurulardan eşik", 180, 222)],
           [("Hand-written rule:", "“reject if income < 20,000”", 70, 150),
            ("Rule learned from data:", "a threshold from past applications", 180, 222)])[lang]
    f.text(500, 70, ex[0][0], "val", "start"); f.text(500, 86, ex[0][1], "tk", "start")
    f.arrow(496, 80, 62, 135) if False else None
    f.card(500, 110, 150, 52, ex[0][0], ex[0][1].replace(" ise ", "\nise ").replace(" if ", "\nif "), "box soft", "val", "tk")
    f.card(500, 172, 150, 52, ex[1][0], ex[1][1].replace(" from ", "\nfrom ").replace("başvurulardan ", "başvurulardan\n"), "box c0s", "val", "tk")
    f.card(500, 234, 150, 30, L("Gemini, ChatGPT, Claude", "Gemini, ChatGPT, Claude")[lang], "", "box c1s", "tk")
    f.arrow(498, 136, 470, 136); f.arrow(498, 198, 445, 198); f.arrow(498, 249, 395, 205)
    # temizle: üstteki geçici metinleri kaldır
    f.parts = [p for p in f.parts if not (p.startswith('<text x="500.0" y="70.0"') or p.startswith('<text x="500.0" y="86.0"'))]
    return f.svg("rings")


def u1_rules(lang):
    f = Fig(660, 200)
    T = L(dict(a="Geleneksel programlama", b="Makine öğrenmesi", r="Kurallar", d="Veri", p="Program", ans="Cevaplar", lr="Öğrenme", m="Kurallar\n(model)",
               ea="insan yazar", eb="bilgisayar çıkarır"),
          dict(a="Traditional programming", b="Machine learning", r="Rules", d="Data", p="Program", ans="Answers", lr="Learning", m="Rules\n(model)",
               ea="a person writes them", eb="the computer infers them"))[lang]
    for k, (ttl, i1, i2, mid, out, cls, note) in enumerate([(T["a"], T["r"], T["d"], T["p"], T["ans"], "c1s", T["ea"]), (T["b"], T["d"], T["ans"], T["lr"], T["m"], "c0s", T["eb"])]):
        x0 = 10 + k * 330
        f.text(x0 + 155, 20, ttl, "lb")
        f.card(x0, 40, 80, 36, i1, "", "box soft", "tk")
        f.card(x0, 90, 80, 36, i2, "", "box soft", "tk")
        f.card(x0 + 116, 58, 84, 50, mid, "", "box " + cls, "lb")
        f.card(x0 + 234, 58, 76, 50, out, "", "box " + ("c3s" if k else "soft"), "lb" if k else "tk")
        f.arrow(x0 + 82, 58, x0 + 113, 74); f.arrow(x0 + 82, 108, x0 + 113, 92); f.arrow(x0 + 202, 83, x0 + 231, 83)
        f.text(x0 + 155, 150, ("↑ " if k == 0 else "↑ ") + note, "ann", "middle")
    f.line(330, 30, 330, 160, "gr")
    f.text(330, 190, L("Ekonometride de katsayıları veriden kestiririz; fark çoğu zaman amaçtadır (Ünite 2).", "Econometrics also estimates coefficients from data; the difference is usually the goal (Unit 2).")[lang], "ann")
    return f.svg("rules")


# ------------------------------------------------------------ Ünite 2 — oyun alanıyla aynı tasarım
def colsim(rho, R=200, N=50, seed=7):
    r = np.random.default_rng(seed)
    B, Y = [], []
    for _ in range(R):
        z1, z2 = r.normal(size=N), r.normal(size=N)
        x1, x2 = z1, rho * z1 + np.sqrt(1 - rho ** 2) * z2
        y = x1 + x2 + r.normal(size=N)
        X = np.column_stack([x1, x2])
        b = np.linalg.lstsq(X, y, rcond=None)[0]
        B.append(b); Y.append(b.sum())
    return np.array(B), np.array(Y)


def u2_coef(lang):
    f = Fig(660, 330)
    res = {}
    for k, rho in enumerate([0.0, 0.97]):
        B, Y = colsim(rho)
        res[str(rho)] = {"sd_b1": float(B[:, 0].std(ddof=1)), "sd_b2": float(B[:, 1].std(ddof=1)), "sd_y": float(Y.std(ddof=1)), "corr_b": float(np.corrcoef(B[:, 0], B[:, 1])[0, 1])}
        p = Panel(f, 62 + k * 300, 40, 220, 190, (-1.0, 3.0), (-1.0, 3.0))
        p.frame(xt=[0, 1, 2, 3], yt=[0, 1, 2, 3], xl=L("β₁ kestirimi", "estimate of β₁")[lang], yl=L("β₂ kestirimi", "estimate of β₂")[lang] if k == 0 else None, xfmt=str, yfmt=str)
        p.curve([-1.0, 3.0], [3.0, -1.0], "ref")
        p.dots(B[:, 0], B[:, 1], "d1" if k == 0 else "d3", 2.4)
        p.dots([1], [1], "d4", 5)
        f.text(p.x + 110, 22, L(f"Korelasyon {num(rho, 2, 'tr')}", f"Correlation {rho:.2f}")[lang], "lb")
        f.text(p.x + 110, 290, L("β₁ kestiriminin yayılımı ", "spread of the β₁ estimate ")[lang] + "±" + num(B[:, 0].std(ddof=1), 2, lang) + L("  ·  öngörü ", "  ·  prediction ")[lang] + "±" + num(Y.std(ddof=1), 2, lang), "val")
    f.mtext(605, 120, L("kesikli çizgi:\nβ₁ + β₂ = 2\n(öngörü sabit)", "dashed line:\nβ₁ + β₂ = 2\n(same prediction)")[lang], "ann", "middle")
    f.mtext(605, 190, L("pembe nokta:\ngerçek değerler\n(1, 1)", "pink dot:\ntrue values\n(1, 1)")[lang], "ann", "middle")
    f.text(330, 322, L("Her nokta 50 gözlemlik farklı bir örneklemle kurulan bir regresyon (200 örneklem). Öngörü: x₁ = x₂ = 1 için ŷ.", "Each dot is a regression on a different 50-observation sample (200 samples). Prediction: ŷ at x₁ = x₂ = 1.")[lang], "tk")
    NUMS["u2"] = res
    return f.svg("coef")


# ------------------------------------------------------------ Ünite 3
def u3_dag(lang):
    f = Fig(660, 210)
    T = L(dict(a="Ters nedensellik", b="Ortak neden", rain="Yağmur", umb="Şemsiye\nsatışları", inc="Gelir artışı", res="Lüks restoran\nrezervasyonları", gr="Ekonomik\nbüyüme",
               cause="neden olur", pred="öngörür ama\nneden olmaz"),
          dict(a="Reverse causality", b="Common cause", rain="Rain", umb="Umbrella\nsales", inc="Income growth", res="Luxury restaurant\nbookings", gr="Economic\ngrowth",
               cause="causes", pred="predicts but\ndoes not cause"))[lang]
    f.text(160, 20, T["a"], "lb")
    f.card(30, 70, 100, 50, T["rain"], "", "box c1s", "lb")
    f.card(190, 70, 100, 50, T["umb"], "", "box soft", "lb")
    f.arrow(132, 88, 187, 88, "arr good"); f.text(160, 80, T["cause"], "ann good")
    f.arrow(187, 106, 132, 106, "arr bad dash"); f.mtext(160, 140, T["pred"], "ann bad")
    f.line(330, 20, 330, 200, "gr")
    f.text(495, 20, T["b"], "lb")
    f.card(435, 38, 120, 40, T["inc"], "", "box c0s", "lb")
    f.card(355, 130, 130, 50, T["res"], "", "box soft", "lb")
    f.card(520, 130, 120, 50, T["gr"], "", "box soft", "lb")
    f.arrow(470, 80, 430, 127, "arr good"); f.arrow(520, 80, 570, 127, "arr good")
    f.arrow(487, 155, 517, 155, "arr bad dash"); f.mtext(502, 198, T["pred"], "ann bad")
    return f.svg("dag")


# ------------------------------------------------------------ Ünite 4
def u4_tree(lang):
    f = Fig(660, 230)
    T = L(dict(q="Verinde öğrenilecek bir “doğru cevap”\n(hedef) sütunu var mı?", y="evet", n="hayır", sup="Denetimli öğrenme", uns="Denetimsiz öğrenme", rl="Pekiştirmeli öğrenme",
               q2="Hedef ne tür?", reg="Regresyon", regb="sayı: enflasyon,\nkonut fiyatı", cls="Sınıflandırma", clsb="kategori: temerrüt\nvar/yok, not A/B/C",
               unsb="yapıyı kendisi arar:\nbenzer müşterileri grupla", rlb="ödüle göre\ndeneme-yanılma"),
          dict(q="Does your data have a “right answer”\n(target) column to learn?", y="yes", n="no", sup="Supervised learning", uns="Unsupervised learning", rl="Reinforcement learning",
               q2="What kind of target?", reg="Regression", regb="a number: inflation,\nhouse price", cls="Classification", clsb="a category: default\nyes/no, grade A/B/C",
               unsb="finds structure itself:\ngroup similar customers", rlb="trial and error\nguided by reward"))[lang]
    f.card(170, 8, 300, 46, T["q"], "", "box c1s", "lb")
    f.card(80, 86, 170, 34, T["sup"], "", "box c0s", "lb")
    f.card(390, 86, 170, 34, T["uns"], "", "box c2s", "lb")
    f.arrow(250, 56, 175, 84); f.text(196, 70, T["y"], "ann", "end")
    f.arrow(390, 56, 470, 84); f.text(444, 70, T["n"], "ann", "start")
    f.card(390, 128, 170, 44, T["unsb"], "", "box soft", "tk")
    f.card(10, 150, 140, 72, T["reg"], T["regb"], "box c0s")
    f.card(180, 150, 140, 72, T["cls"], T["clsb"], "box c3s")
    f.arrow(140, 122, 90, 147); f.arrow(190, 122, 245, 147)
    f.card(500, 186, 150, 40, T["rl"], "", "box c4s", "tk")
    f.text(495, 218, T["rlb"].replace("\n", " "), "ann", "end")
    return f.svg("tree")


def u4_panels(lang):
    r = np.random.default_rng(4)
    f = Fig(660, 230)
    titles = L(["Regresyon: sayı öngör", "Sınıflandırma: sınıf öngör", "Denetimsiz: grupları bul"], ["Regression: predict a number", "Classification: predict a class", "Unsupervised: find groups"])[lang]
    for k in range(3):
        p = Panel(f, 30 + k * 215, 34, 180, 150, (0, 10), (0, 10))
        p.frame()
        f.text(p.x + 90, 22, titles[k], "lb")
        if k == 0:
            x = r.uniform(0.5, 9.5, 40); y = 1 + 0.8 * x + r.normal(0, 0.8, 40)
            p.dots(x, y, "d1", 2.8); p.curve([0, 10], [1, 9], "l3 thick")
            f.text(p.x + 90, 204, L("hedef: sürekli (y ekseni)", "target: continuous (y axis)")[lang], "ann")
        elif k == 1:
            a = r.normal([3, 3.5], 1.1, (22, 2)); b = r.normal([7, 6.8], 1.1, (22, 2))
            p.dots(a[:, 0], a[:, 1], "d0", 3); p.dots(b[:, 0], b[:, 1], "d4", 3)
            p.curve([1, 9.5], [10, 0.5], "ref")
            f.text(p.x + 90, 204, L("hedef: etiket (renk)", "target: a label (colour)")[lang], "ann")
        else:
            cs = [(2.5, 7.5), (7.5, 7), (5, 2.5)]
            for cx, cy in cs:
                g = r.normal([cx, cy], 0.8, (14, 2)); p.dots(g[:, 0], g[:, 1], "d6", 3)
                f.ellipse(p.sx(cx), p.sy(cy), 30, 28, "ring dash")
            f.text(p.x + 90, 204, L("etiket yok; gruplar veriden", "no labels; groups from the data")[lang], "ann")
    return f.svg("panels")


# ------------------------------------------------------------ Ünite 5
def u5_table(lang):
    f = Fig(660, 285)
    hdr = L(["musteri", "yas", "gelir", "bolge", "not", "temerrut"], ["customer", "age", "income", "region", "grade", "default"])[lang]
    grade = ["A", "BBB", "A", "BB", "BB", "AA", "A", "AA", "BBB", "A"]
    rows = []
    for i in range(5):
        g = GELIR[i]
        rows.append([str(i + 1), str(YAS[i]), "NaN" if g is None else num(g, 0, lang), BOLGE[i] if lang == "tr" else BOLGE_EN[BOLGE[i]], grade[i], str(TEM[i])])
    cw, x0, y0, rh = 90, 80, 64, 26
    cls = ["box soft", "box c0s", "box c0s", "box c0s", "box c0s", "box c3s"]
    for j, h in enumerate(hdr):
        f.rect(x0 + j * cw, y0, cw, rh, cls[j]); f.text(x0 + j * cw + cw / 2, y0 + 17, h, "lb")
        for i, rr in enumerate(rows):
            f.rect(x0 + j * cw, y0 + (i + 1) * rh, cw, rh, "box")
            f.text(x0 + j * cw + cw / 2, y0 + (i + 1) * rh + 17, rr[j], "tk" if rr[j] != "NaN" else "ann bad")
    # parantezler
    f.line(x0 + cw + 4, 52, x0 + 5 * cw - 4, 52, "l0 thick"); f.text(x0 + 3 * cw, 44, L("Özellikler (X)", "Features (X)")[lang], "lb")
    f.line(x0 + 5 * cw + 4, 52, x0 + 6 * cw - 4, 52, "l3 thick"); f.text(x0 + 5.5 * cw, 44, L("Hedef (y)", "Target (y)")[lang], "lb")
    f.text(x0 + cw / 2, 44, L("kimlik: dışarıda", "ID: left out")[lang], "ann")
    f.arrow(64, y0 + 2 * rh + 13, 77, y0 + 2 * rh + 13); f.text(60, y0 + 2 * rh + 17, L("gözlem", "observation")[lang], "ann", "end")
    types = L(["—", "sayısal", "sayısal", "kategorik", "sıralı", "kategorik\n(0/1)"], ["—", "numeric", "numeric", "categorical", "ordinal", "categorical\n(0/1)"])[lang]
    for j, t in enumerate(types):
        f.mtext(x0 + j * cw + cw / 2, y0 + 6 * rh + 24, t, "val")
    f.text(330, 278, L("Kural: hedef sütunu asla X'in içinde kalmasın; kalırsa model cevabı soruda görür.", "Rule: the target column must never stay inside X, or the model sees the answer in the question.")[lang], "ann bad")
    return f.svg("xy")


# ------------------------------------------------------------ Ünite 6
def u6_box(lang):
    s = pd.Series(KART, dtype=float)
    q1, q3 = s.quantile(0.25), s.quantile(0.75); iqr = q3 - q1
    lo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr
    NUMS["u6"] = {"q1": q1, "q3": q3, "iqr": iqr, "lo": lo, "hi": hi, "mean": float(s.mean()), "median": float(s.median()),
                  "mean_wo": float(s.drop(4).mean()), "median_wo": float(s.drop(4).median())}
    f = Fig(660, 250)
    p = Panel(f, 40, 30, 580, 120, (3000, 50000), (0, 1))
    for v in [5000, 10000, 20000, 30000, 40000, 50000]:
        f.line(p.sx(v), p.y, p.sx(v), p.y + p.h, "gr"); f.text(p.sx(v), p.y + p.h + 15, num(v, 0, lang), "tk")
    f.line(p.x, p.y + p.h, p.x + p.w, p.y + p.h, "ax")
    yb = p.y + 55
    f.rect(p.sx(q1), yb - 18, p.sx(q3) - p.sx(q1), 36, "box c1s", 4)
    f.line(p.sx(s.median()), yb - 18, p.sx(s.median()), yb + 18, "l1 thick")
    f.line(p.sx(hi), yb - 26, p.sx(hi), yb + 26, "leak")
    f.text(p.sx(hi) + 4, yb - 30, L("üst sınır = Q3 + 1,5 × açıklık", "upper fence = Q3 + 1.5 × IQR")[lang] + " ≈ " + num(hi, 0, lang), "ann bad", "start")
    for v in KART:
        f.circle(p.sx(v), yb + 36, 4, "d4" if v > hi else "d0")
    f.text(p.sx(48000), yb + 60, L("48.000: aykırı (yazım hatası mı, gerçek mi?)", "48,000: outlier (typo or real?)")[lang], "ann bad", "end")
    f.text(p.sx(q1) - 4, yb - 22, "Q1", "val", "end"); f.text(p.sx(q3) + 4, yb - 22, "Q3", "val", "start")
    f.text(p.x + p.w / 2, 186, L("Kart harcaması (TL), modülün kredi tablosundaki 10 müşteri", "Card spending (TL), the 10 customers in the module's loan table")[lang], "lb")
    m, md, mw = s.mean(), s.median(), s.drop(4).mean()
    f.text(p.x + p.w / 2, 210, L(f"Ortalama {num(m, 0, lang)} TL (aykırı olmadan {num(mw, 0, lang)})  ·  Medyan {num(md, 0, lang)} TL (aykırı olmadan {num(s.drop(4).median(), 0, lang)})",
                                 f"Mean {num(m, 0, lang)} TL (without the outlier {num(mw, 0, lang)})  ·  Median {num(md, 0, lang)} TL (without it {num(s.drop(4).median(), 0, lang)})")[lang], "val")
    f.text(p.x + p.w / 2, 232, L("Tek bir gözlem ortalamayı yukarı sürüklüyor; medyan neredeyse kıpırdamıyor.", "A single observation drags the mean up; the median barely moves.")[lang], "ann")
    return f.svg("box")


# ------------------------------------------------------------ Ünite 7
def u7_mech(lang):
    r = np.random.default_rng(12)
    n = 70
    age = r.uniform(20, 65, n); inc = 18 + 0.6 * age + r.normal(0, 6, n)
    masks = [r.uniform(size=n) < 0.25,
             r.uniform(size=n) < np.where(age < 35, 0.6, 0.08),
             inc < np.quantile(inc, 0.25) + r.normal(0, 2, n)]
    titles = L(["Tamamen rastgele", "Gözlenen bir şeye bağlı\n(gençler daha sık boş bırakıyor)", "Değerin kendisine bağlı\n(düşük gelirliler bildirmiyor)"],
               ["Completely at random", "Depends on something observed\n(the young leave it blank more)", "Depends on the value itself\n(low earners don't report)"])[lang]
    f = Fig(660, 270)
    out = []
    for k in range(3):
        p = Panel(f, 64 + k * 202, 52, 165, 150, (18, 67), (15, 70))
        p.frame(xt=[20, 40, 60], yt=[20, 40, 60] if k == 0 else None, xl=L("yaş", "age")[lang], yl=L("gelir (bin TL)", "income (thousand TL)")[lang] if k == 0 else None)
        mk = masks[k]
        p.dots(age[~mk], inc[~mk], "d1", 2.8)
        for a, b in zip(age[mk], inc[mk]):
            f.circle(p.sx(a), p.sy(b), 3, "dh")
        f.mtext(p.x + 82, 22, titles[k], "lb" if k == 0 else "val", "middle", 14)
        bias = inc[~mk].mean() - inc.mean()
        out.append(float(bias))
        f.text(p.x + 82, 250, L("gözlenen ort. − gerçek ort. = ", "observed mean − true mean = ")[lang] + ("+" if bias >= 0 else "−") + num(abs(bias), 1, lang), "ann" + (" bad" if abs(bias) > 1.5 else ""))
    legend(f, 470, 266, []) if False else None
    NUMS["u7_bias"] = out
    return f.svg("mech")


def u7_impute(lang):
    obs = [g for g in GELIR if g is not None]
    mean, med = float(np.mean(obs)), float(np.median(obs))
    NUMS["u7"] = {"mean": mean, "median": med, "n_obs": len(obs)}
    f = Fig(660, 250)
    T = L(dict(t="gelir", m="eksik_gelir", c1="Ham veri", c2="Önce gösterge, sonra medyanla doldur", tm="temerrut"),
          dict(t="income", m="missing_income", c1="Raw data", c2="Indicator first, then fill with the median", tm="default"))[lang]
    rows = [(i, GELIR[i], TEM[i]) for i in range(10)]
    show = [0, 1, 3, 4, 8]
    def tbl(x, cols, data, title, marks, cw=96):
        f.text(x + len(cols) * cw / 2, 20, title, "lb")
        for j, c in enumerate(cols):
            f.rect(x + j * cw, 32, cw, 24, "box soft"); f.text(x + j * cw + cw / 2, 48, c, "tk")
        for i, rr in enumerate(data):
            for j, v in enumerate(rr):
                cl = marks.get((i, j), "box")
                f.rect(x + j * cw, 56 + i * 24, cw, 24, cl)
                f.text(x + j * cw + cw / 2, 72 + i * 24, v, "ann bad" if v == "NaN" else "tk")
    d1 = [[str(i + 1), "NaN" if g is None else num(g, 0, lang), str(t)] for i, g, t in [rows[k] for k in show]]
    tbl(10, ["#", T["t"], T["tm"]], d1, T["c1"], {}, 92)
    d2, mk = [], {}
    for ii, (i, g, t) in enumerate([rows[k] for k in show]):
        d2.append([str(i + 1), num(med if g is None else g, 0, lang), "1" if g is None else "0", str(t)])
        if g is None:
            mk[(ii, 1)] = "box c1s"; mk[(ii, 2)] = "box c3s"
    tbl(330, ["#", T["t"], T["m"], T["tm"]], d2, T["c2"], mk, 80)
    f.line(330 + 100, 32, 330 + 100, 32, "gr")
    f.arrow(312, 120, 326, 120)
    f.text(330, 210, L(f"Medyan (8 gözlem) = {num(med, 0, lang)} TL. Eksik geliri olan iki müşterinin ikisi de temerrüde düşmüş:", f"Median (8 observations) = {num(med, 0, lang)} TL. Both customers with missing income defaulted:")[lang], "val")
    f.text(330, 230, L("eksiklik bilgi taşıyor; gösterge sütunu bu bilgiyi saklar.", "the missingness carries information; the indicator column keeps it.")[lang], "ann")
    return f.svg("impute")


# ------------------------------------------------------------ Ünite 8
def u8_scale(lang):
    P = {"A": (25, 30000), "B": (60, 31000), "C": (26, 45000)}
    ref = (40, 10, 40000, 10000)
    z = {k: ((a - ref[0]) / ref[1], (g - ref[2]) / ref[3]) for k, (a, g) in P.items()}
    d = lambda u, v: float(np.hypot(u[0] - v[0], u[1] - v[1]))
    raw = {"AB": d(P["A"], P["B"]), "AC": d(P["A"], P["C"])}
    std = {"AB": d(z["A"], z["B"]), "AC": d(z["A"], z["C"])}
    NUMS["u8"] = {"raw": raw, "std": std, "z": z}
    f = Fig(660, 292)
    # Sol: ham birimler, eşit ölçek çubukları
    f.text(165, 20, L("Ham birimler", "Raw units")[lang], "lb")
    f.text(495, 20, L("Standartlaştırılmış (z)", "Standardised (z)")[lang], "lb")
    p = Panel(f, 60, 40, 220, 160, (20, 65), (28000, 47000))
    p.frame(xt=[20, 40, 60], yt=[30000, 35000, 40000, 45000], xl=L("yaş", "age")[lang], yl=L("gelir (TL)", "income (TL)")[lang], yfmt=lambda v: num(v / 1000, 0, lang) + L(" bin", "k")[lang])
    q = Panel(f, 400, 40, 220, 160, (-2, 2.5), (-1.5, 1))
    q.frame(xt=[-2, -1, 0, 1, 2], yt=[-1, 0, 1], xl=L("yaş (z)", "age (z)")[lang], yl=L("gelir (z)", "income (z)")[lang], xfmt=lambda v: num(v, 0, lang), yfmt=lambda v: num(v, 0, lang))
    for k in "ABC":
        a, g = P[k]; za, zg = z[k]
        p.dots([a], [g], "d4" if k == "A" else "d1", 6); f.text(p.sx(a) + 9, p.sy(g) + 4, k, "lb", "start")
        q.dots([za], [zg], "d4" if k == "A" else "d1", 6); f.text(q.sx(za) + 9, q.sy(zg) + 4, k, "lb", "start")
    f.mtext(170, 266, L(f"uzaklık A–B = {num(raw['AB'], 0, lang)}\nuzaklık A–C = {num(raw['AC'], 0, lang)}  → A, B'ye “yakın”", f"distance A–B = {num(raw['AB'], 0, lang)}\ndistance A–C = {num(raw['AC'], 0, lang)}  → A is “close” to B")[lang], "val", "middle")
    f.mtext(510, 266, L(f"uzaklık A–B = {num(std['AB'], 2, lang)}\nuzaklık A–C = {num(std['AC'], 2, lang)}  → A, C'ye yakın", f"distance A–B = {num(std['AB'], 2, lang)}\ndistance A–C = {num(std['AC'], 2, lang)}  → A is close to C")[lang], "val", "middle")
    return f.svg("scale")


# ------------------------------------------------------------ Ünite 9
def u9_onehot(lang):
    f = Fig(660, 230)
    B = [BOLGE[i] if lang == "tr" else BOLGE_EN[BOLGE[i]] for i in range(5)]
    cats = L(["Batı", "Doğu", "Merkez"], ["Central", "East", "West"])[lang]
    pref = L("bolge_", "region_")[lang]
    f.text(70, 20, L("bolge", "region")[lang] if True else "", "mono")
    for i, b in enumerate(B):
        f.rect(20, 32 + i * 26, 100, 26, "box"); f.text(70, 50 + i * 26, b, "tk")
    f.arrow(130, 95, 218, 95)
    f.text(174, 84, "get_dummies", "mono")
    allc = cats
    for j, c in enumerate(allc):
        x = 226 + j * 100
        drop = j == 0
        f.rect(x, 6, 100, 26, "box " + ("soft" if drop else "c1s")); f.text(x + 50, 24, pref + c, "tk")
        for i, b in enumerate(B):
            v = "1" if b == c else "0"
            f.rect(x, 32 + i * 26, 100, 26, "box" + (" c4s" if drop else ""))
            f.text(x + 50, 50 + i * 26, v, "lb" if v == "1" else "tk")
    x = 226 + 3 * 100
    f.rect(x, 6, 70, 26, "box soft"); f.text(x + 35, 24, L("toplam", "sum")[lang], "tk")
    for i in range(5):
        f.rect(x, 32 + i * 26, 70, 26, "box"); f.text(x + 35, 50 + i * 26, "1", "ann bad")
    f.mtext(330, 186, L("Her satırda kuklaların toplamı 1 = sabit terim. Biri diğerlerinden tam hesaplanır: kukla tuzağı.", "In every row the dummies sum to 1 = the constant. One is fully determined by the others: the dummy trap.")[lang], "ann bad")
    f.mtext(330, 212, L(f"Çözüm: drop_first=True ile ilk kategoriyi ({cats[0]}) çıkar; o referans grup olur (pembe sütun).", f"Fix: drop_first=True removes the first category ({cats[0]}); it becomes the reference group (pink column).")[lang], "ann")
    return f.svg("onehot")


def u9_order(lang):
    f = Fig(660, 150)
    f.text(165, 18, L("Etiket kodlama (bölge): yanlış", "Label encoding (region): wrong")[lang], "lb")
    f.text(495, 18, L("Sıralı kodlama (kredi notu): uygun", "Ordinal encoding (credit grade): fine")[lang], "lb")
    p = [L(("Doğu", 1), ("East", 1))[lang], L(("Batı", 2), ("West", 2))[lang], L(("Merkez", 3), ("Central", 3))[lang]]
    f.line(40, 70, 290, 70, "ax")
    for name, v in p:
        x = 40 + (v - 1) * 110 + 15
        f.circle(x, 70, 6, "d4"); f.text(x, 56, str(v), "num"); f.text(x, 92, name, "tk")
    f.mtext(165, 125, L("“Merkez = 3 × Doğu”, “Batı ortada” gibi\nverinin söylemediği bir sıra uydurur", "invents an order the data do not have:\n“Central = 3 × East”, “West in the middle”")[lang], "ann bad")
    g = ["BBB", "A", "AA", "AAA"]
    f.line(370, 70, 630, 70, "ax")
    for i, name in enumerate(g):
        x = 385 + i * 78
        f.circle(x, 70, 6, "d0"); f.text(x, 56, str(i + 1), "num"); f.text(x, 92, name, "tk")
    f.mtext(495, 125, L("sıra gerçek; sayıları elle, bilerek ver\n(aralıklar eşit olmayabilir)", "the order is real; assign numbers by hand, on purpose\n(gaps may not be equal)")[lang], "ann good")
    return f.svg("order")


# ------------------------------------------------------------ Ünite 10
def u10_avail(lang):
    f = Fig(660, 200)
    series = [("UNRATE", 1948, L("işsizlik oranı", "unemployment rate")[lang], "bar b0"),
              ("FEDFUNDS", 1954.5, L("federal fon faizi", "federal funds rate")[lang], "bar b1"),
              ("T10Y3MM", 1982, L("10 yıl − 3 ay faiz farkı", "10-year − 3-month spread")[lang], "bar b2")]
    p = Panel(f, 150, 30, 480, 110, (1945, 2027), (0, 3))
    for yv in [1950, 1970, 1990, 2010]:
        f.line(p.sx(yv), p.y, p.sx(yv), p.y + p.h, "gr"); f.text(p.sx(yv), p.y + p.h + 15, str(yv), "tk")
    f.rect(p.sx(1982), p.y - 6, p.sx(2027) - p.sx(1982), p.h + 12, "zone z0")
    for i, (code, start, lab, cls) in enumerate(series):
        y = p.y + 12 + i * 34
        f.rect(p.sx(start), y, p.sx(2026.9) - p.sx(start), 20, cls, 4)
        f.text(140, y + 10, code, "mono", "end"); f.text(140, y + 23, lab, "tk", "end")
        if start > 1950:
            f.rect(p.sx(1948), y, p.sx(start) - p.sx(1948), 20, "bar b6s", 4)
            f.text((p.sx(1948) + p.sx(start)) / 2, y + 14, "NaN", "ann bad")
    f.text(p.sx(2004), p.y - 10, L("ortak dönem: 1982 →", "common period: 1982 →")[lang], "ann good")
    f.text(330, 188, L("Dış birleştirmede 1982 öncesi eksikler hata değil: o seriler henüz yoktu. Doldurma; ortak dönemle çalış.", "In an outer merge, the gaps before 1982 are not errors: those series did not exist yet. Don't fill; use the common period.")[lang], "ann")
    return f.svg("avail")


for n, fn in [("u1_rings", u1_rings), ("u1_rules", u1_rules), ("u2_coef", u2_coef), ("u3_dag", u3_dag), ("u4_tree", u4_tree), ("u4_panels", u4_panels),
              ("u5_table", u5_table), ("u6_box", u6_box), ("u7_mech", u7_mech), ("u7_impute", u7_impute), ("u8_scale", u8_scale),
              ("u9_onehot", u9_onehot), ("u9_order", u9_order), ("u10_avail", u10_avail)]:
    both(n, fn)

write(os.path.join(ROOT, "content/m1/m1-figs.js"), "M1", FIGS, NUMS, "Modül 1 kavram şekilleri")
import json; print(json.dumps(NUMS, ensure_ascii=False, default=float))
