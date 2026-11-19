"""Modül 0 kavram anlatımındaki şekilleri (satır içi SVG) üretir → content/m0/m0-figs.js
Veriler: data/fred/CPIAUCSL.csv ve UNRATE.csv (FRED anlık görüntüleri) + küçük kurgusal örnekler.
Çalıştırma: python3 tools/m0_figs.py   (depo kökünden)"""
import os, sys
import numpy as np
import pandas as pd
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from figlib import Fig, Panel, L, num, legend, flow, write, ROOT

FIGS, NUMS = {}, {}


def both(name, fn):
    FIGS[name] = {lang: fn(lang) for lang in ("tr", "en")}


def fred(code):
    d = pd.read_csv(os.path.join(ROOT, f"data/fred/{code}.csv"), names=["t", "v"], header=0, parse_dates=["t"], na_values=["."])
    d = d.sort_values("t").set_index("t").asfreq("MS")  # eksik ay (Ekim 2025) satır olarak kalsın: pct_change ay kaymasın
    return d.reset_index()


cpi, ur = fred("CPIAUCSL"), fred("UNRATE")


# ------------------------------------------------------------ Ünite 1
def u1_loop(lang):
    f = Fig(660, 170)
    steps = L([("Tarif et", "soru, veri, birim,\nyöntem, çıktı"), ("Ürettir", "kodu YZ yazar;\nhenüz güvenme"), ("Denetle", "oku, sına,\nhatayı bul"), ("Yorumla", "iktisatçı gözüyle,\nsınırlarıyla")],
              [("Specify", "question, data, unit,\nmethod, output"), ("Generate", "the AI writes the code;\ndon't trust it yet"), ("Audit", "read, test,\nfind the mistake"), ("Interpret", "as an economist,\nwith its limits")])[lang]
    for i, (t, b) in enumerate(steps):
        x = 12 + i * 162
        f.card(x, 34, 140, 92, t, b, "box " + ["c0s", "c1s", "c2s", "c3s"][i], "lb", "tk")
        f.text(x + 12, 26, str(i + 1), "num", "start")
        if i < 3:
            f.arrow(x + 143, 80, x + 159, 80)
    f.path([(570, 128), (570, 150), (82, 150), (82, 130)], "arr dash")
    f.add('<polygon points="82,127 78,135 86,135" class="ah"/>')
    f.text(326, 164, L("Denetim bir sorun bulursa isteğe geri dön.", "If the audit finds a problem, go back to the request.")[lang], "ann")
    return f.svg("loop")


def u1_types(lang):
    f = Fig(660, 250)
    T = L(dict(run="Kod çalışıyor mu?", ok="Sonuç doğru mu?", yes="Evet", no="Hayır",
               good="İstenen durum", goodb="ama yine de denetlemeden\nbunu bilemezsin",
               silent="Sessiz hata", silentb="düzgün bir sayı ya da grafik,\nama yanlış · EN TEHLİKELİSİ",
               vis="Görünür hata", visb="Python bir hata mesajı verir · can sıkıcı ama zararsız: fark edersin",
               fab="Uydurma", fabb="var olmayan\nfonksiyon, seri\nya da kaynak;\nbazen sahte veri",
               fabn="her iki satırda da\nkarşına çıkabilir"),
          dict(run="Does the code run?", ok="Is the result right?", yes="Yes", no="No",
               good="What you want", goodb="but you cannot know it\nwithout auditing",
               silent="Silent error", silentb="a neat number or chart,\nbut wrong · THE MOST DANGEROUS",
               vis="Visible error", visb="Python shows an error message · annoying but harmless: you notice",
               fab="Fabrication", fabb="a non-existent\nfunction, series\nor source;\nsometimes fake data",
               fabn="can show up in\neither row"))[lang]
    f.text(300, 18, T["ok"], "lb")
    f.text(195, 40, T["yes"], "tk"); f.text(405, 40, T["no"], "tk")
    cx, cy = 34, 145
    f.text(cx, cy, T["run"], "lb", "middle", f'transform="rotate(-90 {cx} {cy})"')
    f.text(76, 102, T["yes"], "tk", "end"); f.text(76, 200, T["no"], "tk", "end")
    f.card(90, 50, 205, 100, T["good"], T["goodb"], "box c0s")
    f.card(305, 50, 205, 100, T["silent"], T["silentb"], "box c4s", "lb", "tk")
    f.card(90, 160, 420, 72, T["vis"], T["visb"], "box c1s")
    f.card(530, 50, 120, 182, T["fab"], T["fabb"] + "\n\n" + T["fabn"], "box c2s")
    return f.svg("errtypes")


def u1_compound(lang):
    f = Fig(640, 250)
    p = Panel(f, 70, 30, 520, 170, (0, 3), (0, 90))
    p.frame(yt=[0, 20, 40, 60, 80], yl=L("12 aylık değişim (%)", "12-month change (%)")[lang], yfmt=lambda v: f"{v}")
    rows = []
    for i, m in enumerate([1, 3, 5]):
        s, c = 12 * m, ((1 + m / 100) ** 12 - 1) * 100
        rows.append((m, s, c))
        x = p.sx(i + 0.5)
        f.rect(x - 52, p.sy(s), 48, p.sy(0) - p.sy(s), "bar b6", 3)
        f.rect(x + 4, p.sy(c), 48, p.sy(0) - p.sy(c), "bar b1", 3)
        f.text(x - 28, p.sy(s) - 6, num(s, 1, lang), "val")
        f.text(x + 28, p.sy(c) - 6, num(c, 1, lang), "val")
        f.text(x, 218, L(f"her ay %{m}", f"{m}% every month")[lang].replace("%1", "%1").replace("%3", "%3").replace("%5", "%5"), "lb")
        f.text(x + 28, p.sy(c) - 22, L("fark ", "gap ")[lang] + num(c - s, 1, lang), "ann bad")
    legend(f, 90, 46, [("bar b6", L("aylık oranları toplamak (yanlış)", "adding the monthly rates (wrong)")[lang]), ("bar b1", L("bileşik: (1 + r) çarpımı (doğru)", "compound: product of (1 + r) (right)")[lang])])
    f.text(330, 244, L("Enflasyon yükseldikçe sessiz hatanın büyüklüğü de artar.", "The higher the inflation, the larger the silent error.")[lang], "ann")
    NUMS["compound"] = rows
    return f.svg("compound")


# ------------------------------------------------------------ Ünite 2
def u2_index(lang):
    f = Fig(640, 190)
    vals = ["2,1", "3,4", "2,9", "1,8", "2,5"] if lang == "tr" else ["2.1", "3.4", "2.9", "1.8", "2.5"]
    name = "aylik_enf" if lang == "tr" else "monthly_inf"
    f.text(40, 30, f"{name} = [{', '.join(v.replace(',', '.') for v in vals)}]", "mono", "start")
    for i, v in enumerate(vals):
        x = 150 + i * 72
        f.rect(x, 64, 64, 46, "box " + ("c1s" if 1 <= i < 4 else "soft"), 8)
        f.text(x + 32, 93, v, "lb")
        f.text(x + 32, 56, str(i), "num")
        f.text(x + 32, 128, str(i - 5), "tk")
    f.text(140, 56, L("indeks →", "index →")[lang], "tk", "end")
    f.text(140, 128, L("sondan →", "from end →")[lang], "tk", "end")
    f.line(222, 140, 438, 140, "l1 thick")
    f.text(330, 158, f"{name}[1:4]  →  [{', '.join(v.replace(',', '.') for v in vals[1:4])}]", "mono")
    f.text(330, 180, L("başlangıç dahil, bitiş hariç: 1, 2, 3", "start included, stop excluded: 1, 2, 3")[lang], "ann")
    f.text(560, 93, f"len = 5", "mono", "start")
    return f.svg("index")


# ------------------------------------------------------------ Ünite 3
def mini_table(f, x, y, header, rows, colw=58, rh=22, marks=None, title=None, tcls="lb"):
    marks = marks or {}
    if title:
        f.text(x + colw * len(header) / 2, y - 10, title, tcls)
    for j, h in enumerate(header):
        f.rect(x + j * colw, y, colw, rh, "box soft")
        f.text(x + j * colw + colw / 2, y + 15, h, "tk")
    for i, r in enumerate(rows):
        cls = marks.get(i, "")
        for j, v in enumerate(r):
            c = "box" + (" c4s" if cls == "bad" else (" c0s" if cls == "new" else ""))
            f.rect(x + j * colw, y + (i + 1) * rh, colw, rh, c)
            f.text(x + j * colw + colw / 2, y + (i + 1) * rh + 15, v, "tk" if v != "NaN" else "ann bad")


def u3_rows(lang):
    f = Fig(660, 340)
    T = L(dict(a="df.dropna()", b="df.merge(fiyat, on=\"il\")", n6="6 satır", n4="4 satır kaldı",
               why="tek bir sütunda bile eksik\nolan satırın tamamı gider", l="satis", r="fiyat",
               dup="anahtar tekrar ediyor:\n“Ankara” iki kez", res="4 satır oldu (3 değil)",
               il="il", s="satış", p="fiyat", ay="ay", inf="enf", gr="büyüme"),
          dict(a="df.dropna()", b="df.merge(prices, on=\"city\")", n6="6 rows", n4="4 rows left",
               why="a row goes entirely if even\none column is missing", l="sales", r="prices",
               dup="the key repeats:\n“Ankara” twice", res="4 rows now (not 3)",
               il="city", s="sales", p="price", ay="month", inf="inf", gr="growth"))[lang]
    f.text(165, 18, T["a"], "mono")
    rows = [["1", "2,1", "0,4"], ["2", "NaN", "0,5"], ["3", "1,8", "0,3"], ["4", "2,2", "NaN"], ["5", "2,0", "0,6"], ["6", "1,9", "0,2"]]
    if lang == "en":
        rows = [[a, b.replace(",", "."), c.replace(",", ".")] for a, b, c in rows]
    mini_table(f, 20, 40, [T["ay"], T["inf"], T["gr"]], rows, 46, 22, {1: "bad", 3: "bad"})
    f.arrow(166, 117, 196, 117)
    keep = [r for i, r in enumerate(rows) if i not in (1, 3)]
    mini_table(f, 200, 62, [T["ay"], T["inf"], T["gr"]], keep, 46, 22)
    f.text(89, 210, T["n6"], "val"); f.text(269, 190, T["n4"], "ann bad")
    f.mtext(165, 240, T["why"], "ann", "middle")
    f.line(345, 20, 345, 330, "gr")
    f.text(505, 18, T["b"], "mono")
    mini_table(f, 365, 40, [T["il"], T["s"]], [["İzmir", "40"], ["Ankara", "55"], ["Van", "12"]], 52, 22, title=None)
    mini_table(f, 490, 40, [T["il"], T["p"]], [["İzmir", "9"], ["Ankara", "8"], ["Ankara", "11"], ["Van", "7"]], 52, 22, {1: "bad", 2: "bad"})
    f.mtext(556, 180, T["dup"], "ann bad", "middle")
    f.arrow(505, 202, 505, 222)
    mini_table(f, 427, 226, [T["il"], T["s"], T["p"]], [["İzmir", "40", "9"], ["Ankara", "55", "8"], ["Ankara", "55", "11"], ["Van", "12", "7"]], 52, 18, {1: "new", 2: "new"})
    f.text(505, 334, T["res"], "ann bad")
    return f.svg("rows")


# ------------------------------------------------------------ Ünite 4
def u4_prompt(lang):
    f = Fig(660, 300)
    parts = L([("Bağlam", "Ne için?", "“Bir enflasyon raporu için…”"),
               ("Veri", "Hangi tablo, sütun, dönem?", "“cpi.csv: tarih, endeks; 2000–2024. Veri yoksa uydurma, sor.”"),
               ("Birim ve frekans", "Yüzde mi oran mı? Aylık mı?", "“Aylık endeksten, yüzde olarak”"),
               ("Yöntem", "Hangi hesap, hangi araç?", "“12 ay önceye göre değişim; yalnızca pandas”"),
               ("Çıktı", "Ne bekliyorsun?", "“yeni sütun yillik_enf, tek ondalık; çizgi grafiği”"),
               ("Kontrol", "Nasıl sınanacak?", "“satır sayısını yazdır; varsayımlarını listele”")],
              [("Context", "What for?", "“For an inflation report…”"),
               ("Data", "Which table, columns, period?", "“cpi.csv: date, index; 2000–2024. If no data, don't invent, ask.”"),
               ("Unit and frequency", "Percent or ratio? Monthly?", "“From the monthly index, in percent”"),
               ("Method", "Which calculation, which tool?", "“Change on 12 months earlier; pandas only”"),
               ("Output", "What do you expect?", "“a new column annual_inf, one decimal; a line chart”"),
               ("Check", "How will it be tested?", "“print the row count; list your assumptions”")])[lang]
    cls = ["c0s", "c1s", "c2s", "c3s", "c4s", "c0s"]
    for i, (t, q, ex) in enumerate(parts):
        y = 12 + i * 47
        f.rect(10, y, 640, 40, "box " + cls[i], 8)
        f.text(26, y + 25, str(i + 1), "num", "start")
        f.text(48, y + 18, t, "lb", "start")
        f.text(48, y + 33, q, "tk", "start")
        f.text(250, y + 25, ex, "lg", "start")
    return f.svg("prompt")


# ------------------------------------------------------------ Ünite 5
def u5_assert(lang):
    d = cpi.copy()
    d["y"] = d["v"].pct_change(12, fill_method=None) * 100
    d = d[d["t"] >= "2000-01-01"].dropna()
    f = Fig(660, 260)
    # Sol: doğru
    p = Panel(f, 54, 34, 260, 160, (2000, 2027), (-6, 22))
    f.rect(p.x, p.sy(20), p.w, p.sy(-5) - p.sy(20), "zone z0")
    p.frame(xt=[2000, 2010, 2020], yt=[-5, 0, 5, 10, 15, 20], yl=L("yıllık enflasyon (%)", "annual inflation (%)")[lang])
    yr = d["t"].dt.year + (d["t"].dt.month - 1) / 12
    p.curve(yr, d["y"], "l1")
    f.text(p.x + p.w / 2, 20, L("Doğru hesap: pct_change(12) * 100", "Right: pct_change(12) * 100")[lang], "lb")
    f.text(p.x + p.w / 2, 230, L("assert -5 < enf < 20 → geçti ✓", "assert -5 < inf < 20 → passes ✓")[lang], "ann good")
    # Sağ: yanlış
    q = Panel(f, 384, 34, 260, 160, (2000, 2027), (-900, 2200))
    f.rect(q.x, q.sy(20), q.w, q.sy(-5) - q.sy(20), "zone z0")
    q.frame(xt=[2000, 2010, 2020], yt=[0, 500, 1000, 1500, 2000], yfmt=lambda v: num(v, 0, lang))
    q.curve(yr, d["y"] * 100, "l3")
    f.text(q.x + q.w / 2, 20, L("YZ'nin kodu: … * 100 * 100", "AI's code: … * 100 * 100")[lang], "lb")
    f.text(q.x + q.w / 2, 230, L("assert -5 < enf < 20 → AssertionError ✗", "assert -5 < inf < 20 → AssertionError ✗")[lang], "ann bad")
    f.text(q.x + q.w / 2, q.sy(-650), L("↑ makul aralık (−5 ile 20): bu ölçekte ince bir şerit", "↑ plausible range (−5 to 20): a thin strip at this scale")[lang], "ann")
    f.text(330, 252, L("Veri: ABD TÜFE (FRED: CPIAUCSL), 12 aylık değişim", "Data: US CPI (FRED: CPIAUCSL), 12-month change")[lang], "tk")
    NUMS["cpi"] = {"max": float(d["y"].max()), "maxdate": str(d.loc[d["y"].idxmax(), "t"].date()), "min": float(d["y"].min()), "mindate": str(d.loc[d["y"].idxmin(), "t"].date()), "last": float(d["y"].iloc[-1]), "lastdate": str(d["t"].iloc[-1].date())}
    return f.svg("assert")


# ------------------------------------------------------------ Ünite 6
def u6_geo(lang):
    f = Fig(640, 240)
    p = Panel(f, 70, 30, 300, 160, (-0.5, 2.5), (0, 170))
    p.frame(yt=[0, 50, 100, 150], yl=L("portföy değeri", "portfolio value")[lang])
    vals = [100, 150, 75]
    labs = L(["başlangıç", "1. yıl: +%50", "2. yıl: −%50"], ["start", "year 1: +50%", "year 2: −50%"])[lang]
    for i, v in enumerate(vals):
        f.rect(p.sx(i) - 30, p.sy(v), 60, p.sy(0) - p.sy(v), "bar " + ["b6", "b0", "b4"][i], 4)
        f.text(p.sx(i), p.sy(v) - 6, str(v), "val")
        f.text(p.sx(i), 206, labs[i], "tk")
    p.curve([0, 2], [100, 100], "ref")
    f.text(p.sx(2) + 36, p.sy(100) + 4, L("aritmetik ortalama\n“%0 büyüme” der", "")[lang].split("\n")[0] if lang == "tr" else "arithmetic mean", "ann", "start")
    f.text(p.sx(2) + 36, p.sy(100) + 18, "“%0 büyüme” der" if lang == "tr" else "says “0% growth”", "ann", "start")
    x0 = 470
    f.card(x0, 40, 160, 66, L("Aritmetik ortalama", "Arithmetic mean")[lang], "(+50 − 50) / 2 = %0" if lang == "tr" else "(+50 − 50) / 2 = 0%", "box c4s")
    f.card(x0, 120, 160, 76, L("Geometrik ortalama", "Geometric mean")[lang], "√(1,5 × 0,5) − 1\n= −%13,4" if lang == "tr" else "√(1.5 × 0.5) − 1\n= −13.4%", "box c0s")
    f.text(x0 + 80, 222, L("100 → 75: gerçekten kaybettin", "100 → 75: you really lost")[lang], "ann bad")
    return f.svg("geo")


def u6_sort(lang):
    f = Fig(660, 200)
    T = L(dict(t="tarih", v="endeks", c="pct_change()", wrong="Sıralanmamış", right="Önce sort_values(\"tarih\")"),
          dict(t="date", v="index", c="pct_change()", wrong="Unsorted", right="sort_values(\"date\") first"))[lang]
    dates = ["2024-03", "2024-01", "2024-04", "2024-02"]
    vals = [102.0, 100.0, 103.0, 101.0]
    def ch(vs):
        out = ["NaN"]
        for a, b in zip(vs[:-1], vs[1:]):
            out.append(num((b / a - 1) * 100, 1, lang))
        return out
    c1 = ch(vals)
    mini_table(f, 20, 40, [T["t"], T["v"], T["c"]], [[d, num(v, 1, lang), c] for d, v, c in zip(dates, vals, c1)], 90, 24, {1: "bad", 3: "bad"}, T["wrong"])
    s = sorted(zip(dates, vals))
    c2 = ch([v for _, v in s])
    mini_table(f, 370, 40, [T["t"], T["v"], T["c"]], [[d, num(v, 1, lang), c] for (d, v), c in zip(s, c2)], 90, 24, {}, T["right"])
    f.arrow(298, 100, 362, 100)
    f.text(155, 180, L("−%2 ve −%1,9: hiç yaşanmamış düşüşler", "−2% and −1.9%: falls that never happened")[lang], "ann bad")
    f.text(505, 180, L("her ay yaklaşık +%1", "about +1% every month")[lang], "ann good")
    return f.svg("sort")


# ------------------------------------------------------------ Ünite 7
def u7_trace(lang):
    f = Fig(660, 230)
    f.rect(20, 14, 470, 150, "box code", 10)
    lines = ["Traceback (most recent call last):",
             '  File "<ipython-input-4>", line 3, in <module>',
             '    df["buyume"] = df["gsyh"].pct_change() * 100' if lang == "tr" else '    df["growth"] = df["gdp"].pct_change() * 100',
             "  ...",
             "KeyError: 'gsyh'" if lang == "tr" else "KeyError: 'gdp'"]
    for i, s in enumerate(lines):
        f.text(36, 40 + i * 26, s, "mono" + (" bad" if i == 4 else ""), "start")
    f.arrow(500, 144, 470, 144, "arr bad")
    f.mtext(578, 140, L("1 · son satırdan başla:\nhatanın türü ve nedeni", "1 · start at the last line:\nthe type and cause")[lang], "ann bad", "middle")
    f.arrow(500, 66, 470, 66)
    f.mtext(578, 62, L("2 · satır numarası:\nhata nerede?", "2 · the line number:\nwhere is it?")[lang], "ann", "middle")
    f.text(255, 190, L("KeyError: tabloda böyle bir sütun adı yok. Sütun adlarına bak: df.columns", "KeyError: there is no column with that name. Look at the names: df.columns")[lang], "lg")
    f.text(255, 212, L("Belki sütunun adı “GSYH” ya da “gsyh ” (sonda boşluk).", "Perhaps the column is called “GDP” or “gdp ” (trailing space).")[lang], "ann")
    return f.svg("trace")


def u7_flow(lang):
    f = Fig(660, 190)
    steps = L(["Hata mesajı", "Mesajı sondan\noku", "YZ'ye bağlam ver:\nhata + kod +\ndf.head()", "Düzeltmeyi\ndenetle", "Hata gitti.\nSonuç doğru mu?"],
              ["Error message", "Read it from\nthe end", "Give the AI context:\nerror + code +\ndf.head()", "Audit the\nfix", "The error is gone.\nIs the result right?"])[lang]
    flow(f, steps, 8, 30, 116, 74, 18)
    f.path([(620, 106), (620, 150), (330, 150), (330, 108)], "arr bad dash")
    f.add('<polygon points="330,106 326,114 334,114" class="ah bad"/>')
    f.text(475, 166, L("hayır: kök nedene dön", "no: back to the root cause")[lang], "ann bad")
    f.text(620, 182, L("evet: bitti ✓", "yes: done ✓")[lang], "ann good")
    return f.svg("dflow")


# ------------------------------------------------------------ Ünite 8
def u8_scatter(lang):
    c = cpi.copy(); c["y"] = c["t"].dt.year
    c["inf"] = c["v"].pct_change(12, fill_method=None) * 100
    a = c[c["t"].dt.month == 12][["y", "inf"]]
    u = ur.copy(); u["y"] = u["t"].dt.year
    ua = u.dropna().groupby("y")["v"].mean().reset_index()
    m = a.merge(ua, on="y")
    m = m[(m["y"] >= 2000) & (m["y"] <= 2024)]
    f = Fig(640, 295)
    p = Panel(f, 64, 30, 400, 200, (3, 9.5), (-1, 8))
    p.frame(xt=[3, 4, 5, 6, 7, 8, 9], yt=[0, 2, 4, 6, 8], xl=L("işsizlik oranı, yıllık ortalama (%)", "unemployment rate, annual average (%)")[lang], yl=L("enflasyon, Aralık, 12 aylık (%)", "inflation, December, 12-month (%)")[lang])
    g1, g2 = m[m["y"] <= 2019], m[m["y"] >= 2020]
    p.dots(g1["v"], g1["inf"], "d1", 4)
    p.dots(g2["v"], g2["inf"], "d4", 5)
    for _, r in g2.iterrows():
        f.text(p.sx(r["v"]) + 8, p.sy(r["inf"]) + 4, str(int(r["y"])), "tk", "start")
    r1 = float(np.corrcoef(g1["v"], g1["inf"])[0, 1]); r2 = float(np.corrcoef(m["v"], m["inf"])[0, 1])
    legend(f, 480, 50, [("d1", "2000–2019"), ("d4", "2020–2024")])
    f.mtext(552, 120, L(f"korelasyon\n2000–2019: {num(r1, 2, lang)}\n2000–2024: {num(r2, 2, lang)}", f"correlation\n2000–2019: {num(r1, 2, lang)}\n2000–2024: {num(r2, 2, lang)}")[lang], "val", "middle", 17)
    f.mtext(552, 200, L("Dönem değişince\nilişki de değişiyor", "Change the period and\nthe relationship changes")[lang], "ann", "middle")
    f.text(320, 290, L("Veri: FRED CPIAUCSL ve UNRATE, 2000–2024", "Data: FRED CPIAUCSL and UNRATE, 2000–2024")[lang], "tk")
    g3 = m[~m["y"].between(2020, 2022)]
    r3 = float(np.corrcoef(g3["v"], g3["inf"])[0, 1])
    NUMS["phillips"] = {"r_2000_2019": r1, "r_2000_2024": r2, "r_excl_2020_2022": r3, "n": int(len(m)),
                       "y2020": [float(g2.iloc[0]["v"]), float(g2.iloc[0]["inf"])], "y2022": [float(g2[g2["y"] == 2022]["v"].iloc[0]), float(g2[g2["y"] == 2022]["inf"].iloc[0])]}
    return f.svg("scatter")


# ------------------------------------------------------------ Ünite 9–10
def u9_flow(lang):
    f = Fig(660, 130)
    steps = L(["Colab'da aç,\nDrive'a kopyala", "Kurulum hücresi:\nveri + kontroller", "Gemini'ye\nşablonla istek", "Kodu oku,\nkatalogla denetle", "Kontrol hücresi →\ntamamlama kodu"],
              ["Open in Colab,\ncopy to Drive", "Setup cell:\ndata + checks", "Prompt Gemini\nwith the template", "Read the code,\naudit with the catalogue", "Check cell →\ncompletion code"])[lang]
    flow(f, steps, 8, 26, 116, 70, 17)
    f.text(330, 122, L("Not, Gemini'nin koduna değil kontrol hücresinin sonucuna dayanır.", "Marking rests on the check cell, not on Gemini's code.")[lang], "ann")
    return f.svg("wsflow")


def u10_flow(lang):
    f = Fig(660, 130)
    steps = L(["Soruyu seç:\nA, B ya da C", "Tarif et:\n6 parçalı istek", "Ürettir ve\nher adımı denetle", "Grafik +\nözet sayı", "Dört parçalı\nsonuç + defter"],
              ["Choose a\nquestion: A, B, C", "Specify:\nsix-part prompt", "Generate and\naudit every step", "Chart +\nsummary number", "Four-part\nconclusion + log"])[lang]
    flow(f, steps, 8, 26, 116, 70, 17, ["c0s", "c1s", "c2s", "c3s", "c4s"])
    f.text(330, 122, L("Ölçüt: YZ'nin hatasızlığı değil, senin onu nasıl denetlediğin.", "The criterion: not the AI being error-free, but how you audited it.")[lang], "ann")
    return f.svg("capflow")


for n, fn in [("u1_loop", u1_loop), ("u1_types", u1_types), ("u1_compound", u1_compound), ("u2_index", u2_index), ("u3_rows", u3_rows),
              ("u4_prompt", u4_prompt), ("u5_assert", u5_assert), ("u6_geo", u6_geo), ("u6_sort", u6_sort), ("u7_trace", u7_trace),
              ("u7_flow", u7_flow), ("u8_scatter", u8_scatter), ("u9_flow", u9_flow), ("u10_flow", u10_flow)]:
    both(n, fn)

write(os.path.join(ROOT, "content/m0/m0-figs.js"), "M0", FIGS, NUMS, "Modül 0 kavram şekilleri")
import json; print(json.dumps(NUMS, ensure_ascii=False))
