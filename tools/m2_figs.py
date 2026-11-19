"""Modül 2 kavram anlatımındaki şekilleri (satır içi SVG) üretir → content/m2/m2-figs.js
Veriler: dersin 3. hafta notebook'uyla aynı ücret–deneyim simülasyonu ve data/fred/UNRATE.csv.
Çalıştırma: python3 tools/m2_figs.py   (depo kökünden)"""
import json, os, math
import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings("ignore")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FIGS = {}


def esc(s):
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def num(x, d, lang):
    s = f"{x:.{d}f}"
    return s.replace(".", ",") if lang == "tr" else s


class Fig:
    def __init__(self, w, h):
        self.w, self.h, self.parts = w, h, []

    def add(self, s):
        self.parts.append(s)

    def svg(self, label):
        return (f'<svg class="cfig" viewBox="0 0 {self.w} {self.h}" role="img" aria-label="{esc(label)}" '
                f'xmlns="http://www.w3.org/2000/svg">' + "".join(self.parts) + "</svg>")

    def text(self, x, y, s, cls="tk", anchor="middle", extra=""):
        self.add(f'<text x="{x:.1f}" y="{y:.1f}" class="{cls}" text-anchor="{anchor}" {extra}>{esc(s)}</text>')

    def line(self, x1, y1, x2, y2, cls="ax"):
        self.add(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" class="{cls}"/>')

    def rect(self, x, y, w, h, cls="box", rx=0):
        self.add(f'<rect x="{x:.1f}" y="{y:.1f}" width="{max(w, 0):.1f}" height="{max(h, 0):.1f}" rx="{rx}" class="{cls}"/>')

    def circle(self, x, y, r, cls="d1"):
        self.add(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" class="{cls}"/>')

    def path(self, pts, cls="l1"):
        if not pts:
            return
        d = "M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in pts)
        self.add(f'<path d="{d}" class="{cls}"/>')


class Panel:
    """Bir koordinat sistemi: veri → piksel."""
    def __init__(self, fig, x, y, w, h, xr, yr):
        self.f, self.x, self.y, self.w, self.h, self.xr, self.yr = fig, x, y, w, h, xr, yr

    def sx(self, v):
        return self.x + (v - self.xr[0]) / (self.xr[1] - self.xr[0]) * self.w

    def sy(self, v):
        v = min(max(v, self.yr[0]), self.yr[1])
        return self.y + self.h - (v - self.yr[0]) / (self.yr[1] - self.yr[0]) * self.h

    def frame(self, xt=None, yt=None, xl=None, yl=None, xfmt=str, yfmt=str):
        f = self.f
        if yt:
            for v in yt:
                f.line(self.x, self.sy(v), self.x + self.w, self.sy(v), "gr")
                f.text(self.x - 6, self.sy(v) + 4, yfmt(v), "tk", "end")
        if xt:
            for v in xt:
                f.text(self.sx(v), self.y + self.h + 15, xfmt(v), "tk")
        f.line(self.x, self.y + self.h, self.x + self.w, self.y + self.h, "ax")
        f.line(self.x, self.y, self.x, self.y + self.h, "ax")
        if xl:
            f.text(self.x + self.w / 2, self.y + self.h + 32, xl, "lb")
        if yl:
            cx, cy = self.x - 38, self.y + self.h / 2
            f.text(cx, cy, yl, "lb", "middle", f'transform="rotate(-90 {cx:.1f} {cy:.1f})"')

    def curve(self, xs, ys, cls):
        self.f.path([(self.sx(a), self.sy(b)) for a, b in zip(xs, ys)], cls)

    def dots(self, xs, ys, cls="d1", r=3):
        for a, b in zip(xs, ys):
            self.f.circle(self.sx(a), self.sy(b), r, cls)


def legend(fig, x, y, items):
    for i, (cls, lab) in enumerate(items):
        yy = y + i * 18
        if cls.startswith("d"):
            fig.circle(x + 9, yy - 4, 4, cls)
        else:
            fig.line(x, yy - 4, x + 18, yy - 4, cls)
        fig.text(x + 25, yy, lab, "lg", "start")


def both(name, builder):
    FIGS[name] = {lang: builder(lang) for lang in ("tr", "en")}


# ------------------------------------------------------------------ veri
rng = np.random.default_rng(2026)
SIG = 0.25
def gercek(e): return 2.0 + 0.08 * e - 0.0014 * e ** 2
def orneklem(n, r=None):
    r = r or rng
    e = r.uniform(0, 40, n)
    return e, gercek(e) + r.normal(0, SIG, n)
def kur(e, y, d): return np.polyfit(e / 20 - 1, y, d)
def ongor(k, e): return np.polyval(k, e / 20 - 1)
def hko(a, b): return float(np.mean((a - b) ** 2))
e_egt, y_egt = orneklem(30)
e_tst, y_tst = orneklem(2000)
grid = np.linspace(0, 40, 90)
grid_s = np.linspace(0, 40, 41)

ur = pd.read_csv(os.path.join(ROOT, "data/fred/UNRATE.csv"), names=["t", "v"], header=0, parse_dates=["t"])
ur2000 = ur[ur["t"] >= "2000-01-01"].reset_index(drop=True)

L = lambda tr, en: {"tr": tr, "en": en}


# ============================================================ Ünite 1
def u1_series(lang):
    f = Fig(640, 260)
    d = ur2000.dropna()
    p = Panel(f, 52, 14, 560, 196, (2000, 2027), (0, 16))
    p.frame(xt=list(range(2000, 2027, 5)), yt=[0, 4, 8, 12, 16], yl=L("işsizlik (%)", "unemployment (%)")[lang])
    xs = d["t"].dt.year + (d["t"].dt.month - 1) / 12
    p.curve(xs, d["v"], "l1")
    p.curve(xs + 1 / 12, d["v"], "l3 dash")
    f.text(p.sx(2020.3), p.sy(14.8) - 6, L("Nisan 2020: %14,8", "April 2020: 14.8%")[lang], "ann", "start")
    f.text(p.sx(2025.8), p.sy(4.1) - 18, L("Ekim 2025: veri yok", "Oct 2025: no data")[lang], "ann", "end")
    legend(f, 70, 32, [("l1", L("gerçek oran", "actual rate")[lang]), ("l3 dash", L("saf öngörü (geçen ayın oranı)", "naive forecast (last month's rate)")[lang])])
    return f.svg("UNRATE")


def u1_errors(lang):
    f = Fig(640, 230)
    d = ur2000.copy()
    d["h"] = d["v"] - d["v"].shift(1)
    d = d.dropna()
    p = Panel(f, 52, 14, 560, 170, (2000, 2027), (-3, 11))
    p.frame(xt=list(range(2000, 2027, 5)), yt=[-2, 0, 2, 4, 6, 8, 10], yl=L("hata (puan)", "error (points)")[lang])
    p.f.line(p.x, p.sy(0), p.x + p.w, p.sy(0), "ax")
    bw = p.w / len(ur2000) * 0.8
    for t, h in zip(d["t"], d["h"]):
        x = p.sx(t.year + (t.month - 1) / 12)
        y0, y1 = p.sy(0), p.sy(h)
        f.rect(x - bw / 2, min(y0, y1), bw, abs(y1 - y0), "bar " + ("b4" if abs(h) > 2 else ("b1" if h > 0 else "b0")))
    f.text(p.sx(2020.4), p.sy(10.4) + 4, L("+10,4", "+10.4")[lang], "ann", "start")
    f.text(p.sx(2001), p.sy(9.5), L("artı: öngörü düşük kaldı", "positive: forecast too low")[lang], "ann", "start")
    f.text(p.sx(2001), p.sy(-2.2), L("eksi: öngörü yüksek kaldı", "negative: forecast too high")[lang], "ann", "start")
    return f.svg("errors")


def u1_measures(lang):
    h = ur2000["v"] - ur2000["v"].shift(1)
    h = h.dropna()
    vals = [abs(h.mean()), h.abs().mean(), (h ** 2).mean(), math.sqrt((h ** 2).mean())]
    labs = L(["ortalama hata", "ort. mutlak hata", "HKO", "kök HKO"], ["mean error", "mean abs. error", "MSE", "RMSE"])[lang]
    f = Fig(640, 200)
    p = Panel(f, 150, 10, 420, 170, (0, 0.7), (0, 4))
    for i, (v, lab) in enumerate(zip(vals, labs)):
        y = 18 + i * 44
        f.text(140, y + 18, lab, "lb", "end")
        f.rect(150, y, p.sx(v) - 150, 26, "bar b" + str(i), 4)
        f.text(p.sx(v) + 8, y + 18, num(v, 3, lang) + (L(" puan²", " points²")[lang] if i == 2 else L(" puan", " points")[lang]), "val", "start")
    return f.svg("measures")


# ============================================================ Ünite 2
def u2_split(lang):
    f = Fig(640, 150)
    f.rect(20, 40, 600, 50, "box soft", 10)
    f.rect(20, 40, 150, 50, "box c0f", 10)
    f.rect(170, 40, 450, 50, "box c3f", 0)
    f.text(95, 70, L("eğitim: 30 kişi", "training: 30 people")[lang], "lbw")
    f.text(395, 70, L("test: 2.000 yeni kişi", "test: 2,000 new people")[lang], "lbw")
    f.text(95, 115, L("modeli kurmak için", "to build the model")[lang], "tk")
    f.text(395, 115, L("modelin hiç görmediği veride başarıyı ölçmek için", "to measure success on data the model has never seen")[lang], "tk")
    f.text(320, 24, L("Aynı dünyadan iki ayrı örneklem", "Two separate samples from the same world")[lang], "lb")
    return f.svg("split")


def three_fits(lang, degs=(1, 2, 12)):
    f = Fig(660, 250)
    names = L({1: "Derece 1: çok basit", 2: "Derece 2: yerinde", 12: "Derece 12: çok esnek"}, {1: "Degree 1: too simple", 2: "Degree 2: just right", 12: "Degree 12: too flexible"})[lang]
    for i, d in enumerate(degs):
        p = Panel(f, 40 + i * 212, 34, 180, 160, (0, 40), (1.4, 3.6))
        p.frame(xt=[0, 20, 40], yt=[1.5, 2.5, 3.5] if i == 0 else None, yfmt=lambda v: num(v, 1, lang))
        k = kur(e_egt, y_egt, d)
        p.curve(grid, gercek(grid), "ref")
        p.dots(e_egt, y_egt, "d0", 2.6)
        p.curve(grid, np.clip(ongor(k, grid), 1.4, 3.6), "l1 thick")
        egt, tst = hko(ongor(k, e_egt), y_egt), hko(ongor(k, e_tst), y_tst)
        f.text(p.x + 90, 20, names[d], "lb")
        f.text(p.x + 90, 230, L("eğitim ", "training ")[lang] + num(egt, 3, lang) + L(" · test ", " · test ")[lang] + (num(tst, 1, lang) if tst > 1 else num(tst, 3, lang)), "val")
    return f.svg("fits")


# ============================================================ Ünite 3
def u3_curve(lang):
    f = Fig(640, 260)
    tr, te = [], []
    for d in range(1, 13):
        k = kur(e_egt, y_egt, d)
        tr.append(hko(ongor(k, e_egt), y_egt)); te.append(hko(ongor(k, e_tst), y_tst))
    p = Panel(f, 60, 16, 540, 190, (1, 12), (0, 0.2))
    p.frame(xt=list(range(1, 13)), yt=[0, 0.05, 0.1, 0.15, 0.2], xl=L("polinom derecesi (esneklik)", "polynomial degree (flexibility)")[lang], yl="HKO" if lang == "tr" else "MSE", yfmt=lambda v: num(v, 2, lang))
    p.curve(range(1, 13), tr, "l0 thick"); p.dots(range(1, 13), tr, "d0", 3)
    p.curve(range(1, 13), te, "l3 thick"); p.dots(range(1, 13), te, "d3", 3)
    p.f.line(p.x, p.sy(0.0625), p.x + p.w, p.sy(0.0625), "ref")
    f.text(p.sx(8.2), p.sy(0.2) + 12, L("test hatası grafiğin dışına çıkıyor (derece 12: 18,2)", "test error leaves the chart (degree 12: 18.2)")[lang], "ann", "start")
    legend(f, 80, 36, [("l0", L("eğitim hatası", "training error")[lang]), ("l3", L("test hatası", "test error")[lang]), ("ref", L("indirgenemez hata (0,0625)", "irreducible error (0.0625)")[lang])])
    return f.svg("curve")


# ============================================================ Ünite 4
def avg_curves(n, R=150, seed=11):
    r = np.random.default_rng(seed)
    TR, TE = np.zeros(10), np.zeros(10)
    for _ in range(R):
        e, y = orneklem(n, r)
        for i, d in enumerate(range(1, 11)):
            k = kur(e, y, d)
            TR[i] += hko(ongor(k, e), y) / R
            TE[i] += min(hko(ongor(k, e_tst), y_tst), 5) / R
    return TR, TE


A30 = avg_curves(30)
A150 = avg_curves(150)


def u4_u(lang):
    f = Fig(640, 270)
    TR, TE = A30
    p = Panel(f, 60, 30, 540, 186, (1, 10), (0.03, 0.2))
    p.frame(xt=list(range(1, 11)), yt=[0.05, 0.1, 0.15, 0.2], xl=L("polinom derecesi (esneklik)", "polynomial degree (flexibility)")[lang], yl=L("ortalama HKO", "average MSE")[lang], yfmt=lambda v: num(v, 2, lang))
    b = int(np.argmin(TE)) + 1
    f.rect(p.sx(1), p.y, p.sx(b) - p.sx(1), p.h, "zone z0")
    f.rect(p.sx(b), p.y, p.sx(10) - p.sx(b), p.h, "zone z3")
    f.text((p.sx(1) + p.sx(b)) / 2, p.y - 8, L("eksik uyum", "underfitting")[lang], "lb")
    f.text((p.sx(b) + p.sx(10)) / 2, p.y - 8, L("aşırı uyum", "overfitting")[lang], "lb")
    p.f.line(p.x, p.sy(0.0625), p.x + p.w, p.sy(0.0625), "ref")
    p.curve(range(1, 11), TR, "l0 thick")
    p.curve(range(1, 11), TE, "l3 thick")
    p.f.circle(p.sx(b), p.sy(TE[b - 1]), 6, "d4")
    f.text(p.sx(b) + 8, p.sy(TE[b - 1]) + 18, L("en düşük test hatası", "lowest test error")[lang], "ann", "start")
    legend(f, p.x + 330, 60, [("l0", L("ortalama eğitim hatası", "average training error")[lang]), ("l3", L("ortalama test hatası", "average test error")[lang]), ("ref", L("indirgenemez hata", "irreducible error")[lang])])
    return f.svg("U")


def u4_n(lang):
    f = Fig(640, 240)
    p = Panel(f, 60, 16, 540, 170, (1, 10), (0.05, 0.2))
    p.frame(xt=list(range(1, 11)), yt=[0.05, 0.1, 0.15, 0.2], xl=L("polinom derecesi", "polynomial degree")[lang], yl=L("ortalama test HKO", "average test MSE")[lang], yfmt=lambda v: num(v, 2, lang))
    p.curve(range(1, 11), A30[1], "l3 thick")
    p.curve(range(1, 11), A150[1], "l2 thick")
    p.f.line(p.x, p.sy(0.0625), p.x + p.w, p.sy(0.0625), "ref")
    legend(f, 90, 36, [("l3", L("30 kişilik eğitim verisi", "30-person training data")[lang]), ("l2", L("150 kişilik eğitim verisi", "150-person training data")[lang])])
    return f.svg("n")


# ============================================================ Ünite 5
def u5_dart(lang):
    f = Fig(660, 200)
    r = np.random.default_rng(42)
    sets = [(0, .1), (0, .38), (.5, .1), (.5, .38)]
    labs = L(["düşük yanlılık\ndüşük varyans", "düşük yanlılık\nyüksek varyans", "yüksek yanlılık\ndüşük varyans", "yüksek yanlılık\nyüksek varyans"],
             ["low bias\nlow variance", "low bias\nhigh variance", "high bias\nlow variance", "high bias\nhigh variance"])[lang]
    for i, (b, v) in enumerate(sets):
        cx, cy = 85 + i * 163, 88
        for rr, cls in [(70, "ring"), (47, "ring"), (24, "ring in")]:
            f.circle(cx, cy, rr, cls)
        f.circle(cx, cy, 3, "d4")
        for _ in range(18):
            f.circle(cx + (b + v * r.normal()) * 70, cy - (b * .6 + v * r.normal()) * 70, 3.4, "d1")
        for j, part in enumerate(labs[i].split("\n")):
            f.text(cx, 176 + j * 14, part, "tk")
    return f.svg("dart")


def u5_curves(lang):
    f = Fig(660, 250)
    r = np.random.default_rng(2026)
    for i, d in enumerate([1, 12]):
        p = Panel(f, 46 + i * 316, 30, 280, 180, (0, 40), (1.4, 3.6))
        p.frame(xt=[0, 10, 20, 30, 40], yt=[1.5, 2.5, 3.5] if i == 0 else None, yfmt=lambda v: num(v, 1, lang))
        for _ in range(25):
            e, y = orneklem(30, r)
            p.curve(grid_s, np.clip(ongor(kur(e, y, d), grid_s), 1.4, 3.6), "l1 thin")
        p.curve(grid, gercek(grid), "ref thick")
        f.text(p.x + 140, 18, L({1: "Derece 1: hep benzer, hep yanlış", 12: "Derece 12: her örneklemde bambaşka"}, {1: "Degree 1: always similar, always wrong", 12: "Degree 12: different every time"})[lang][d], "lb")
        f.text(p.x + 140, 240, L("deneyim (yıl)", "experience (years)")[lang], "tk")
    return f.svg("curves25")


def u5_decomp(lang):
    r = np.random.default_rng(5)
    xs = np.linspace(2, 38, 19)
    rows = []
    for d in range(1, 9):
        P = np.array([ongor(kur(*orneklem(30, r), d), xs) for _ in range(300)])
        b2 = float(np.mean((P.mean(0) - gercek(xs)) ** 2)); var = float(np.mean(P.var(0)))
        rows.append((d, b2, min(var, 0.2)))
    f = Fig(640, 270)
    p = Panel(f, 60, 20, 540, 196, (0.5, 8.5), (0, 0.16))
    p.frame(xt=list(range(1, 9)), yt=[0, 0.04, 0.08, 0.12, 0.16], xl=L("polinom derecesi", "polynomial degree")[lang], yl=L("beklenen test hatası", "expected test error")[lang], yfmt=lambda v: num(v, 2, lang))
    for d, b2, v in rows:
        x = p.sx(d) - 22
        parts = [(SIG ** 2, "b6"), (b2, "b4"), (v, "b1")]
        base = 0
        for val, cls in parts:
            top = min(base + val, 0.16)
            f.rect(x, p.sy(top), 44, p.sy(base) - p.sy(top), "bar " + cls)
            base = top
    legend(f, p.x + 95, 30, [("d6", L("indirgenemez hata (0,0625)", "irreducible error (0.0625)")[lang]), ("d4", L("yanlılık²", "bias²")[lang]), ("d1", L("varyans", "variance")[lang])])
    f.text(p.sx(7.6), p.sy(0.16) + 14, L("↑ kesildi", "↑ clipped")[lang], "ann")
    return f.svg("decomp")


# ============================================================ Ünite 6
def u6_folds(lang):
    f = Fig(640, 230)
    f.text(320, 18, L("5-katlı çapraz doğrulama: 30 gözlem, 5 tur", "5-fold cross-validation: 30 observations, 5 rounds")[lang], "lb")
    for r_ in range(5):
        y = 34 + r_ * 36
        f.text(60, y + 19, L("Tur ", "Round ")[lang] + str(r_ + 1), "tk", "end")
        for k in range(5):
            x = 72 + k * 92
            f.rect(x, y, 86, 26, "box " + ("c3f" if k == r_ else "c1s"), 6)
            f.text(x + 43, y + 17, (L("doğrulama", "validation")[lang] if k == r_ else L("eğitim", "training")[lang]), "lbw" if k == r_ else "tk")
        f.text(560, y + 18, "→ " + L("hata ", "error ")[lang] + str(r_ + 1), "tk", "start")
    f.text(320, 222, L("Çapraz doğrulama hatası = 5 hatanın ortalaması", "Cross-validation error = average of the 5 errors")[lang], "lb")
    return f.svg("folds")


def u6_flow(lang):
    f = Fig(660, 150)
    steps = L(["Veriyi ayır:\neğitim + test", "Eğitimde çapraz\ndoğrulamayla\nmodelleri karşılaştır", "En iyi modeli seç,\ntüm eğitim verisiyle\nyeniden kur", "Test verisinde\nbir kez değerlendir"],
              ["Split the data:\ntraining + test", "Compare models with\ncross-validation\non training data", "Choose the best,\nrebuild it on all\ntraining data", "Evaluate once\non the test data"])[lang]
    for i, s in enumerate(steps):
        x = 10 + i * 164
        f.rect(x, 30, 146, 84, "box " + ["c0s", "c1s", "c2s", "c3s"][i], 10)
        f.text(x + 14, 22, str(i + 1), "num", "start")
        for j, part in enumerate(s.split("\n")):
            f.text(x + 73, 60 + j * 16 - (len(s.split("\n")) - 2) * 8, part, "tk")
        if i < 3:
            f.text(x + 155, 77, "→", "lb")
    f.text(330, 140, L("Test verisi 1–3. adımlarda hiç kullanılmaz.", "The test data are not used at all in steps 1–3.")[lang], "ann")
    return f.svg("flow")


def u6_table_rows():
    r = np.random.default_rng(2026)
    e1, y1 = orneklem(30, r); orneklem(2000, r)
    katlar = np.array_split(r.permutation(30), 5)
    out = []
    for d in range(1, 9):
        h = []
        for i in range(5):
            dog = katlar[i]; egt = np.concatenate([katlar[j] for j in range(5) if j != i])
            h.append(hko(ongor(kur(e1[egt], y1[egt], d), e1[dog]), y1[dog]))
        k = kur(e1, y1, d)
        out.append((d, hko(ongor(k, e1), y1), float(np.mean(h)), hko(ongor(k, e_tst), y_tst)))
    return out


# ============================================================ Ünite 7
def u7_types(lang):
    f = Fig(660, 210)
    cols = L([("Hedef sızıntısı", "Özellik, hedefin\nsonucunu içeriyor", "“tahsilat bürosuna\ndevredildi” sütunu"),
              ("Test → eğitim", "Hazırlık değerleri\ntüm veriden hesaplanıyor", "ortalama, medyan,\nstd tüm veriden"),
              ("Gelecekten bilgi", "Öngörü anından sonraki\nbilgi kullanılıyor", "gelecek ayı içeren\nortalama")],
             [("Target leakage", "A feature contains\nthe target's outcome", "a “sent to collection\nagency” column"),
              ("Test → training", "Preparation values are\ncomputed from all data", "mean, median,\nsd from all data"),
              ("Future information", "Information from after\nprediction time is used", "an average that\nincludes next month")])[lang]
    for i, (t, d, ex) in enumerate(cols):
        x = 12 + i * 216
        f.rect(x, 12, 204, 186, "box " + ["c4s", "c2s", "c3s"][i], 12)
        f.text(x + 102, 40, t, "lb")
        for j, part in enumerate(d.split("\n")):
            f.text(x + 102, 74 + j * 16, part, "tk")
        f.line(x + 20, 112, x + 184, 112, "gr")
        f.text(x + 102, 136, L("örnek", "example")[lang], "ann")
        for j, part in enumerate(ex.split("\n")):
            f.text(x + 102, 158 + j * 16, part, "tk")
    return f.svg("leaktypes")


def u7_timeline(lang):
    f = Fig(640, 170)
    f.line(30, 80, 610, 80, "ax thick")
    f.rect(30, 60, 330, 40, "box c0f", 6); f.rect(360, 60, 250, 40, "box c3f", 6)
    f.text(195, 85, L("eğitim (2015 öncesi)", "training (before 2015)")[lang], "lbw")
    f.text(485, 85, L("test (2015 ve sonrası)", "test (2015 onwards)")[lang], "lbw")
    f.path([(360, 56), (360, 104)], "ax thick")
    f.text(360, 120, L("öngörü anı", "prediction time")[lang], "ann")
    f.path([(480, 52), (480, 30), (200, 30), (200, 52)], "leak")
    f.text(340, 22, L("✗ sızıntı: ortalama ve std test dönemini de görerek hesaplanırsa", "✗ leakage: if the mean and sd are computed seeing the test period")[lang], "ann bad")
    f.path([(200, 108), (200, 140), (480, 140), (480, 108)], "ok")
    f.text(340, 158, L("✓ doğru: değerler eğitimden öğrenilir, teste aynen uygulanır", "✓ right: values are learned on training and applied to test as is")[lang], "ann good")
    return f.svg("timeline")


# ============================================================ Ünite 8
def u8_split(lang):
    d = ur2000.dropna().reset_index(drop=True)
    s = d["v"].to_numpy(); T = len(s); n = T // 5
    perm = np.random.default_rng(2026).permutation(T)
    f = Fig(660, 250)
    for i, (te, name) in enumerate([(set(perm[:n]), L("Rastgele bölme", "Random split")[lang]), (set(range(T - n, T)), L("Zamana göre bölme", "Split by time")[lang])]):
        p = Panel(f, 40 + i * 320, 30, 290, 170, (0, T - 1), (0, 16))
        p.frame(yt=[0, 5, 10, 15] if i == 0 else None)
        tr = [j for j in range(T) if j not in te]
        p.dots(tr, s[tr], "d0 sm", 1.6)
        tt = sorted(te); p.dots(tt, s[tt], "d4", 2.6)
        f.text(p.x + 145, 18, name, "lb")
        for yr in (2000, 2010, 2020):
            j = int(np.argmax(d["t"].dt.year.to_numpy() >= yr)); f.text(p.sx(j), 216, str(yr), "tk")
        tri = np.array(tr)
        pred = np.array([s[tri[np.argmin(np.abs(tri - t))]] for t in tt])
        rm = float(np.sqrt(np.mean((pred - s[tt]) ** 2)))
        f.text(p.x + 145, 240, L("test hatası (kök HKO): ", "test error (RMSE): ")[lang] + num(rm, 2, lang), "val")
    return f.svg("tsplit")


def u8_window(lang):
    f = Fig(640, 200)
    f.text(320, 16, L("Genişleyen pencere: her turda eğitim uzar, hemen sonraki dönem doğrulanır", "Expanding window: training grows each round; the next period is validated")[lang], "lb")
    for r_ in range(4):
        y = 30 + r_ * 38
        f.text(60, y + 19, L("Tur ", "Round ")[lang] + str(r_ + 1), "tk", "end")
        w = 160 + r_ * 90
        f.rect(72, y, w, 26, "box c0f", 6)
        f.rect(72 + w + 4, y, 86, 26, "box c3f", 6)
        f.text(72 + w / 2, y + 17, L("eğitim", "training")[lang], "lbw")
        f.text(72 + w + 47, y + 17, L("doğrulama", "validation")[lang], "lbw")
    f.line(72, 188, 610, 188, "ax"); f.text(610, 182, L("zaman →", "time →")[lang], "tk", "end")
    return f.svg("window")


# ============================================================ Ünite 9
def u9_flow(lang):
    f = Fig(660, 130)
    steps = L(["UNRATE'i indir", "2015'te zamana\ngöre böl", "Saf öngörü:\nkıyas ölçütü", "Regresyon:\nyalnızca eğitimle", "Test hatalarını\nkarşılaştır"],
              ["Download UNRATE", "Split by time\nat 2015", "Naive forecast:\nbenchmark", "Regression:\ntraining only", "Compare the\ntest errors"])[lang]
    for i, s in enumerate(steps):
        x = 8 + i * 131
        f.rect(x, 24, 118, 72, "box " + ["c0s", "c1s", "c2s", "c3s", "c4s"][i], 10)
        parts = s.split("\n")
        for j, part in enumerate(parts):
            f.text(x + 59, 62 + j * 16 - (len(parts) - 1) * 8, part, "tk")
        if i < 4:
            f.text(x + 125, 64, "→", "lb")
    f.text(330, 120, L("Görev A: adım 1–3 · Görev B: adım 4–5", "Task A: steps 1–3 · Task B: steps 4–5")[lang], "ann")
    return f.svg("wsflow")


for name, fn in [("u1_series", u1_series), ("u1_errors", u1_errors), ("u1_measures", u1_measures), ("u2_split", u2_split), ("u2_fits", three_fits),
                 ("u3_curve", u3_curve), ("u4_u", u4_u), ("u4_n", u4_n), ("u5_dart", u5_dart), ("u5_curves", u5_curves), ("u5_decomp", u5_decomp),
                 ("u6_folds", u6_folds), ("u6_flow", u6_flow), ("u7_types", u7_types), ("u7_timeline", u7_timeline), ("u8_split", u8_split),
                 ("u8_window", u8_window), ("u9_flow", u9_flow)]:
    both(name, fn)

# Tablolar için sayılar
h = (ur2000["v"] - ur2000["v"].shift(1)).dropna()
NUMS = {
    "u1": {"me": float(h.mean()), "mae": float(h.abs().mean()), "mse": float((h ** 2).mean()), "rmse": float(math.sqrt((h ** 2).mean())),
           "first5": [[str(t.date()), float(v)] for t, v in zip(ur2000["t"][:6], ur2000["v"][:6])]},
    "u6": u6_table_rows(),
    "u4_best30": int(np.argmin(A30[1])) + 1, "u4_best150": int(np.argmin(A150[1])) + 1,
}

out = os.path.join(ROOT, "content/m2/m2-figs.js")
with open(out, "w", encoding="utf-8") as fh:
    fh.write("/* Modül 2 kavram şekilleri — tools/m2_figs.py tarafından üretildi, elle düzenlemeyin.\n * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt) */\n")
    fh.write("window.M2_FIGS = " + json.dumps(FIGS, ensure_ascii=False) + ";\n")
    fh.write("window.M2_NUMS = " + json.dumps(NUMS, ensure_ascii=False) + ";\n")
print("yazıldı:", out, round(os.path.getsize(out) / 1024), "KB")
print(json.dumps(NUMS, ensure_ascii=False)[:800])
