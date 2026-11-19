"""ML Laboratuvarı — Colab notebook üretici (TR/EN).
Çıktı: colab/modul0/*.ipynb (TR) ve colab/module0/*.ipynb (EN)."""
import json, base64, os

OUT = os.path.dirname(os.path.abspath(__file__))
CODES = {"A": "ML0-ENF-7QK2", "B": "ML0-ZRV-4MTX", "F": "ML0-BTR-9HDZ"}
b64 = lambda s: base64.b64encode(s.encode()).decode()


def nb(cells):
    out = []
    for kind, src in cells:
        src = src.strip("\n")
        c = {"cell_type": kind, "metadata": {}, "source": src.splitlines(keepends=True)}
        if kind == "code":
            c.update({"execution_count": None, "outputs": []})
            if src.startswith("#@title"):
                c["metadata"] = {"cellView": "form"}
        out.append(c)
    return {"cells": out, "metadata": {"colab": {"provenance": []}, "kernelspec": {"display_name": "Python 3", "name": "python3"}, "language_info": {"name": "python"}}, "nbformat": 4, "nbformat_minor": 0}


# ---------------------------------------------------------------- ortak kod
FRED_HELPER = {
    "tr": '''
def fred_indir(seri_kodu):
    """FRED'den bir seriyi indirir; sütunlar: tarih, <seri_kodu>. FRED eksik değerleri '.' ile gösterir;
    bunlar bilerek NaN yapılır ve sayısı yazdırılır."""
    url = "https://fred.stlouisfed.org/graph/fredgraph.csv?id=" + seri_kodu
    with urllib.request.urlopen(url) as yanit:
        df = pd.read_csv(io.BytesIO(yanit.read()))
    df.columns = ["tarih", seri_kodu]
    df["tarih"] = pd.to_datetime(df["tarih"])
    df[seri_kodu] = pd.to_numeric(df[seri_kodu], errors="coerce")
    print(f"{seri_kodu}: {len(df)} satır, {df[seri_kodu].isna().sum()} eksik değer, {df['tarih'].min():%Y-%m} – {df['tarih'].max():%Y-%m}")
    return df
''',
    "en": '''
def fred_download(series_id):
    """Downloads a series from FRED; columns: date, <series_id>. FRED marks missing values with '.';
    they are deliberately turned into NaN and counted."""
    url = "https://fred.stlouisfed.org/graph/fredgraph.csv?id=" + series_id
    with urllib.request.urlopen(url) as response:
        df = pd.read_csv(io.BytesIO(response.read()))
    df.columns = ["date", series_id]
    df["date"] = pd.to_datetime(df["date"])
    df[series_id] = pd.to_numeric(df[series_id], errors="coerce")
    print(f"{series_id}: {len(df)} rows, {df[series_id].isna().sum()} missing, {df['date'].min():%Y-%m} – {df['date'].max():%Y-%m}")
    return df
'''
}

T = {
    "tr": dict(
        title="# ML Laboratuvarı · Ünite 9: Colab + Gemini atölyesi",
        intro="""**Prof. Dr. Mehmet Songur** · ML Laboratuvarı, Modül 0

Bu atölyede gerçek veriyle (ABD TÜFE, FRED: `CPIAUCNS`) çalışacak, kodu **Gemini'ye yazdıracak** ve **denetleyeceksin**.

**Kurallar**
1. **Kurulum** ve **Kontrol** hücrelerini değiştirme; yalnızca çalıştır.
2. Görev hücrelerinde kodu Gemini ile üret (hücredeki Gemini düğmesi ya da Gemini paneli; Colab'ın arayüzüne göre adı değişebilir).
3. Gemini'nin kodunu **çalıştırmadan önce oku**. Ünite 6'daki hata kataloğunu hatırla.
4. Kontrol hücresi geçerse bir **tamamlama kodu** verir; onu ML Laboratuvarı'ndaki ilgili kutuya yapıştır.

> Kendi kopyanı kaydetmek için: *Dosya → Drive'a kopya kaydet*.""",
        setup_title="#@title Kurulum — çalıştır, değiştirme",
        data_note='# Not: satırlar indirildikleri sırada değil. Denetimde bunu hatırla.\ntufe = ham.sample(frac=1, random_state=7).reset_index(drop=True)\nprint("tufe tablosu:", tufe.shape)\ntufe.head()',
        taskA="""## Görev A — Yıllık enflasyon

`tufe` tablosuna (sütunlar: `tarih`, `endeks`; aylık) **yıllık enflasyonu yüzde olarak** `yillik` adlı yeni bir sütun olarak ekle.

**Gemini'ye örnek istek (kendi isteğini yazman daha iyi):**
> tufe adlı pandas tablosunda 'tarih' (aylık, datetime) ve 'endeks' sütunları var. Tabloyu tarihe göre sırala; her ay için 12 ay önceye göre yüzde değişimi hesaplayıp 'yillik' adlı yeni sütuna yaz. Başka veri indirme veya uydurma. Satır sayısını ve eksik değer sayısını yazdır.

**Denetim soruları:** Tablo sıralandı mı? Sonuç yüzde mi? `periods=12` mi kullanıldı? Satır kaybı var mı?""",
        taskA_code="# Görev A: Gemini ile kodu burada üret, oku, sonra çalıştır.\n",
        checkA_md="### Kontrol A — çalıştır, değiştirme",
        checkA="kontrol_A(tufe)",
        taskB="""## Görev B — Zirve ay

2000-01 ve sonrasında yıllık enflasyonun **en yüksek** olduğu ayı `zirve_ay` (tarih), değerini `zirve_deger` (yüzde) adlı değişkenlere ata.

**Denetim soruları:** 2000 öncesi dışarıda mı? Eksik değerler (ilk 12 ay) sorun yaratıyor mu? Değer yüzde mi?""",
        taskB_code="# Görev B: Gemini ile kodu burada üret, oku, sonra çalıştır.\n",
        checkB_md="### Kontrol B — çalıştır, değiştirme",
        checkB="kontrol_B(zirve_ay, zirve_deger)",
        notes="""## Denetim notların

ML Laboratuvarı'ndaki **denetim defterine** geçmeden önce burada kısaca not al:
- Gemini'ye ne istedin?
- Kodunda neyi kontrol ettin?
- Neyi düzelttin, ya da neden değiştirmedin?""",
    ),
    "en": dict(
        title="# ML Lab · Unit 9: Colab + Gemini workshop",
        intro="""**Prof. Dr. Mehmet Songur** · ML Lab, Module 0

In this workshop you work with real data (US CPI, FRED: `CPIAUCNS`), have **Gemini write the code** and **audit it**.

**Rules**
1. Do not change the **Setup** and **Check** cells; just run them.
2. Generate code with Gemini in the task cells (the Gemini button in a cell or the Gemini panel; the name may vary with Colab's interface).
3. **Read** Gemini's code **before running it**. Remember the error catalogue from unit 6.
4. If a check cell passes, it gives you a **completion code**; paste it into the matching box in ML Lab.

> To keep your own copy: *File → Save a copy in Drive*.""",
        setup_title="#@title Setup — run it, do not change it",
        data_note='# Note: the rows are not in the order they were downloaded. Remember this when auditing.\ncpi = raw.sample(frac=1, random_state=7).reset_index(drop=True)\nprint("cpi table:", cpi.shape)\ncpi.head()',
        taskA="""## Task A — Annual inflation

Add **annual inflation in percent** to the `cpi` table (columns: `date`, `index`; monthly) as a new column called `annual`.

**Sample prompt for Gemini (writing your own is better):**
> A pandas table called cpi has 'date' (monthly, datetime) and 'index' columns. Sort the table by date; for each month compute the percentage change against 12 months earlier and store it in a new column 'annual'. Do not download or invent other data. Print the row count and the number of missing values.

**Audit questions:** Was the table sorted? Is the result in percent? Was `periods=12` used? Were any rows lost?""",
        taskA_code="# Task A: generate the code with Gemini here, read it, then run it.\n",
        checkA_md="### Check A — run it, do not change it",
        checkA="check_A(cpi)",
        taskB="""## Task B — The peak month

From 2000-01 onwards, store the month with the **highest** annual inflation in `peak_month` (a date) and its value in `peak_value` (percent).

**Audit questions:** Is everything before 2000 excluded? Do the missing values (first 12 months) cause problems? Is the value in percent?""",
        taskB_code="# Task B: generate the code with Gemini here, read it, then run it.\n",
        checkB_md="### Check B — run it, do not change it",
        checkB="check_B(peak_month, peak_value)",
        notes="""## Your audit notes

Before moving to the **audit log** in ML Lab, jot down briefly:
- What did you ask Gemini?
- What did you check in its code?
- What did you fix, or why did you change nothing?""",
    ),
}

SETUP_WS = {
    "tr": '''
import io, base64, urllib.request
import pandas as pd
''' + FRED_HELPER["tr"] + '''
ham = fred_indir("CPIAUCNS").rename(columns={"CPIAUCNS": "endeks"})

def _k(s):
    return base64.b64decode(s).decode()

def _dogru_yillik():
    d = ham.sort_values("tarih").set_index("tarih")["endeks"]
    y = d.pct_change(periods=12, fill_method=None) * 100
    temiz = d.isna().astype(int).rolling(13, min_periods=1).max() == 0   # eksik değer içeren pencereler karşılaştırılmaz
    return y[temiz]

def kontrol_A(df):
    if "yillik" not in df.columns:
        print("❌ 'yillik' adlı bir sütun bulunamadı."); return
    if len(df) != len(ham):
        print(f"❌ Satır sayısı değişmiş: {len(ham)} olmalıydı, {len(df)} oldu. Hangi satırlar silindi ya da çoğaldı?"); return
    s = df.set_index("tarih")["yillik"].sort_index()
    dogru = _dogru_yillik().dropna()
    ortak = s.reindex(dogru.index)
    if ((ortak * 100 - dogru).abs().dropna() < 1e-6).mean() > 0.95:
        print("❌ Değerler oran olarak hesaplanmış. Yüzdeye çevirdin mi?"); return
    fark = (ortak - dogru).abs().dropna()
    if len(fark) < 0.9 * len(dogru) or fark.max() > 1e-6:
        print("❌ Bazı aylarda değer beklenenden farklı. Hesaptan önce tarihe göre sıraladın mı? periods=12 kullandın mı?"); return
    print("✅ Tüm kontroller geçti. Tamamlama kodun: " + _k("''' + b64(CODES["A"]) + '''"))

def kontrol_B(zirve_ay, zirve_deger):
    d = _dogru_yillik()
    d = d[d.index >= "2000-01-01"].dropna()
    ay = pd.Timestamp(zirve_ay)
    if ay.to_period("M") != d.idxmax().to_period("M"):
        print("❌ Zirve ay beklenenden farklı. 2000 öncesini çıkardın mı? Yıllık seriyi mi kullandın?"); return
    if abs(float(zirve_deger) - d.max()) > 0.05:
        print("❌ Zirve değeri beklenenden farklı. Birim yüzde mi?"); return
    print("✅ Tüm kontroller geçti. Tamamlama kodun: " + _k("''' + b64(CODES["B"]) + '''"))

''',
    "en": '''
import io, base64, urllib.request
import pandas as pd
''' + FRED_HELPER["en"] + '''
raw = fred_download("CPIAUCNS").rename(columns={"CPIAUCNS": "index"})

def _k(s):
    return base64.b64decode(s).decode()

def _true_annual():
    d = raw.sort_values("date").set_index("date")["index"]
    y = d.pct_change(periods=12, fill_method=None) * 100
    clean = d.isna().astype(int).rolling(13, min_periods=1).max() == 0   # windows containing a gap are not compared
    return y[clean]

def check_A(df):
    if "annual" not in df.columns:
        print("❌ No column called 'annual' was found."); return
    if len(df) != len(raw):
        print(f"❌ The row count changed: it should be {len(raw)}, it is {len(df)}. Which rows were dropped or duplicated?"); return
    s = df.set_index("date")["annual"].sort_index()
    true = _true_annual().dropna()
    common = s.reindex(true.index)
    if ((common * 100 - true).abs().dropna() < 1e-6).mean() > 0.95:
        print("❌ The values were computed as ratios. Did you convert to percent?"); return
    diff = (common - true).abs().dropna()
    if len(diff) < 0.9 * len(true) or diff.max() > 1e-6:
        print("❌ Some months differ from the expected values. Did you sort by date before computing? Did you use periods=12?"); return
    print("✅ All checks passed. Your completion code: " + _k("''' + b64(CODES["A"]) + '''"))

def check_B(peak_month, peak_value):
    d = _true_annual()
    d = d[d.index >= "2000-01-01"].dropna()
    m = pd.Timestamp(peak_month)
    if m.to_period("M") != d.idxmax().to_period("M"):
        print("❌ The peak month differs from the expected one. Did you exclude data before 2000? Did you use the annual series?"); return
    if abs(float(peak_value) - d.max()) > 0.05:
        print("❌ The peak value differs from the expected one. Is it in percent?"); return
    print("✅ All checks passed. Your completion code: " + _k("''' + b64(CODES["B"]) + '''"))

''',
}


def workshop(lang):
    L = T[lang]
    return nb([
        ("markdown", L["title"] + "\n\n" + L["intro"]),
        ("code", L["setup_title"] + "\n" + SETUP_WS[lang] + L["data_note"]),
        ("markdown", L["taskA"]),
        ("code", L["taskA_code"]),
        ("markdown", L["checkA_md"]),
        ("code", L["checkA"]),
        ("markdown", L["taskB"]),
        ("code", L["taskB_code"]),
        ("markdown", L["checkB_md"]),
        ("code", L["checkB"]),
        ("markdown", L["notes"]),
    ])


# ---------------------------------------------------------------- bitirme
CAP = {
    "tr": dict(
        title="# ML Laboratuvarı · Ünite 10: Bitirme projesi",
        intro="""**Prof. Dr. Mehmet Songur** · ML Laboratuvarı, Modül 0

Bir soruyu gerçek veriyle **Gemini'nin yardımıyla** yanıtla, her adımı **denetle** ve **belgele**.

| Soru | Seriler (FRED) | Odak |
|---|---|---|
| **A** | `CPIAUCNS`, `UNRATE` | Enflasyon ve işsizlik birlikte nasıl hareket etti? |
| **B** | `FEDFUNDS`, `CPIAUCNS` | Politika faizi ve enflasyon; reel faizin negatif olduğu dönemler |
| **C** | `GDPC1`, `UNRATE` | Çeyreklik reel büyüme ve işsizlikteki değişim |

Dönem: **2000–2024**. Veriyi indirmek için hazır `fred_indir("SERI_KODU")` fonksiyonunu kullan; Gemini'nin başka kaynak ya da seri kodu uydurmasına izin verme.

**Teslim:** `veri` tablosu, en az bir grafik, `yorum` paragrafı ve `denetim` sözlüğü. Son hücre bunları kontrol eder ve tamamlama kodunu verir.""",
        setup_title="#@title Kurulum — çalıştır, değiştirme",
        choose="#@title Sorunu seç\nSORU = \"A\"  #@param [\"A\", \"B\", \"C\"]\nprint(\"Seçilen soru:\", SORU)",
        s1="""## 1. Veri

Gemini'den, seçtiğin sorunun iki serisini `fred_indir` ile indirmesini, **ortak frekansa** getirmesini (gerekirse aylıktan çeyreğe), tarihe göre birleştirmesini ve **2000–2024** dönemiyle sınırlamasını iste. Sonuç tablonun adı `veri` olsun ve `tarih` sütunu bulunsun.

**Denetim:** satır sayısı, ilk ve son tarih, eksik değerler, frekans, birimler (yüzde mi düzey mi?).""",
        s2="""## 2. Analiz ve grafik

Sorunun gerektirdiği dönüşümleri (yıllık enflasyon, reel faiz, büyüme oranı, işsizlikteki değişim…) Gemini'ye yaptır, en az bir **özet sayı** (ör. korelasyon) ve bir **grafik** üret.

**Denetim:** Birim hatası? Sıralama? Geometrik/aritmetik ortalama? Grafiğin başlığı ve eksen adları var mı?""",
        s3="""## 3. Yorum

Dört parçalı bir paragraf yaz: **bulgu, büyüklük, bağlam, sınırlar**. Gemini'ye yazdırırsan Ünite 8'deki gibi denetle. Nedensellik iddia etme.""",
        s3_code='yorum = """\nBuraya en az 4 cümlelik yorumunu yaz.\n"""',
        s4="""## 4. Denetim

Her alana en az bir iki cümle yaz. Bu alanları ML Laboratuvarı'ndaki denetim defterine de aktaracaksın.""",
        s4_code='denetim = {\n    "veri": "",        # Hangi seriler, dönem, frekans? Satır sayısı ve eksikler?\n    "istekler": "",    # Gemini\'ye verdiğin en önemli istekler ve neden öyle yazdığın\n    "kontroller": "",  # Uyguladığın doğrulama soruları ve sonuçları\n    "hatalar": "",     # Bulduğun hatalar ve düzeltmeler (ya da "bulmadım, çünkü...")\n    "sinirlar": "",    # Sonucun neyi göstermediği\n}',
        s5="### 5. Son kontrol — çalıştır, değiştirme",
        s5_code="kontrol_bitirme(veri, yorum, denetim)",
    ),
    "en": dict(
        title="# ML Lab · Unit 10: Capstone project",
        intro="""**Prof. Dr. Mehmet Songur** · ML Lab, Module 0

Answer one question with real data **with Gemini's help**, **audit** every step and **document** it.

| Question | Series (FRED) | Focus |
|---|---|---|
| **A** | `CPIAUCNS`, `UNRATE` | How did inflation and unemployment move together? |
| **B** | `FEDFUNDS`, `CPIAUCNS` | The policy rate and inflation; periods of negative real rates |
| **C** | `GDPC1`, `UNRATE` | Quarterly real growth and the change in unemployment |

Period: **2000–2024**. Use the ready-made `fred_download("SERIES_ID")` function to get the data; do not let Gemini invent other sources or series IDs.

**Deliverables:** a `data` table, at least one chart, an `interpretation` paragraph and an `audit` dictionary. The final cell checks them and gives your completion code.""",
        setup_title="#@title Setup — run it, do not change it",
        choose="#@title Choose your question\nQUESTION = \"A\"  #@param [\"A\", \"B\", \"C\"]\nprint(\"Chosen question:\", QUESTION)",
        s1="""## 1. Data

Ask Gemini to download the two series for your question with `fred_download`, bring them to a **common frequency** (monthly to quarterly if needed), merge them by date and restrict them to **2000–2024**. Call the result `data` and make sure it has a `date` column.

**Audit:** row count, first and last dates, missing values, frequency, units (percent or level?).""",
        s2="""## 2. Analysis and chart

Have Gemini do the transformations your question needs (annual inflation, real rate, growth rate, change in unemployment…), and produce at least one **summary number** (e.g. a correlation) and one **chart**.

**Audit:** unit mistakes? Sorting? Geometric vs arithmetic mean? Does the chart have a title and axis labels?""",
        s3="""## 3. Interpretation

Write a four-part paragraph: **finding, magnitude, context, limits**. If Gemini writes it, audit it as in unit 8. Do not claim causality.""",
        s3_code='interpretation = """\nWrite your interpretation of at least 4 sentences here.\n"""',
        s4="""## 4. Audit

Write at least a sentence or two in each field. You will also copy them into the audit log in ML Lab.""",
        s4_code='audit = {\n    "data": "",       # Which series, period, frequency? Row count and gaps?\n    "prompts": "",    # Your most important prompts to Gemini and why you wrote them that way\n    "checks": "",     # The verification questions you applied and their results\n    "mistakes": "",   # Mistakes found and fixes (or "none found, because...")\n    "limits": "",     # What the result does not show\n}',
        s5="### 5. Final check — run it, do not change it",
        s5_code="check_capstone(data, interpretation, audit)",
    ),
}

SETUP_CAP = {
    "tr": '''
import io, base64, urllib.request
import pandas as pd
''' + FRED_HELPER["tr"] + '''
def _k(s):
    return base64.b64decode(s).decode()

_SINIR = ["nedensel", "neden-sonuç", "neden sonuç", "sınır", "genelle", "kısıt", "göstermez"]

def kontrol_bitirme(veri, yorum, denetim):
    sorun = []
    if not isinstance(veri, pd.DataFrame) or len(veri) < 60:
        sorun.append("'veri' en az 60 satırlık bir pandas tablosu olmalı.")
    else:
        t = pd.to_datetime(veri["tarih"]) if "tarih" in veri.columns else pd.to_datetime(pd.Series(veri.index))
        if not t.is_monotonic_increasing:
            sorun.append("'veri' tarihe göre artan sırada değil.")
        if t.min() < pd.Timestamp("2000-01-01") or t.max() > pd.Timestamp("2024-12-31"):
            sorun.append("Dönem 2000–2024 ile sınırlı değil.")
        if veri.select_dtypes("number").isna().any().any():
            sorun.append("Sayısal sütunlarda eksik değer var; nedenini anla ve açıkça ele al.")
    if not isinstance(yorum, str) or len(yorum.strip()) < 300:
        sorun.append("'yorum' en az 300 karakter olmalı.")
    elif not any(k in yorum.lower() for k in _SINIR):
        sorun.append("Yorumda sonucun sınırlarına (nedensellik, genelleme…) değinilmemiş.")
    beklenen = ["veri", "istekler", "kontroller", "hatalar", "sinirlar"]
    if not isinstance(denetim, dict) or any(len(str(denetim.get(k, "")).strip()) < 30 for k in beklenen):
        sorun.append("'denetim' sözlüğünün beş alanının her biri en az 30 karakter olmalı.")
    if sorun:
        print("❌ Henüz değil:")
        for s in sorun:
            print("  •", s)
        return
    print("✅ Tüm kontroller geçti. Tamamlama kodun: " + _k("''' + b64(CODES["F"]) + '''"))
    print("Not: Bu kontrol biçimi denetler; analizin doğruluğundan ve yorumun dürüstlüğünden sen sorumlusun.")
''',
    "en": '''
import io, base64, urllib.request
import pandas as pd
''' + FRED_HELPER["en"] + '''
def _k(s):
    return base64.b64decode(s).decode()

_LIMITS = ["causal", "cause", "limit", "generali", "caveat", "does not show"]

def check_capstone(data, interpretation, audit):
    problems = []
    if not isinstance(data, pd.DataFrame) or len(data) < 60:
        problems.append("'data' should be a pandas table with at least 60 rows.")
    else:
        t = pd.to_datetime(data["date"]) if "date" in data.columns else pd.to_datetime(pd.Series(data.index))
        if not t.is_monotonic_increasing:
            problems.append("'data' is not sorted by date in ascending order.")
        if t.min() < pd.Timestamp("2000-01-01") or t.max() > pd.Timestamp("2024-12-31"):
            problems.append("The period is not restricted to 2000–2024.")
        if data.select_dtypes("number").isna().any().any():
            problems.append("Numeric columns contain missing values; understand why and handle them explicitly.")
    if not isinstance(interpretation, str) or len(interpretation.strip()) < 300:
        problems.append("'interpretation' should be at least 300 characters.")
    elif not any(k in interpretation.lower() for k in _LIMITS):
        problems.append("The interpretation does not address the result's limits (causality, generalisation…).")
    expected = ["data", "prompts", "checks", "mistakes", "limits"]
    if not isinstance(audit, dict) or any(len(str(audit.get(k, "")).strip()) < 30 for k in expected):
        problems.append("Each of the five fields in 'audit' should be at least 30 characters.")
    if problems:
        print("❌ Not yet:")
        for p in problems:
            print("  •", p)
        return
    print("✅ All checks passed. Your completion code: " + _k("''' + b64(CODES["F"]) + '''"))
    print("Note: this check tests form; you are responsible for the analysis being right and the interpretation honest.")
''',
}


def capstone(lang):
    L = CAP[lang]
    gen = "# Gemini ile kodu burada üret, oku, sonra çalıştır.\n" if lang == "tr" else "# Generate the code with Gemini here, read it, then run it.\n"
    return nb([
        ("markdown", L["title"] + "\n\n" + L["intro"]),
        ("code", L["setup_title"] + "\n" + SETUP_CAP[lang]),
        ("code", L["choose"]),
        ("markdown", L["s1"]), ("code", gen),
        ("markdown", L["s2"]), ("code", gen),
        ("markdown", L["s3"]), ("code", L["s3_code"]),
        ("markdown", L["s4"]), ("code", L["s4_code"]),
        ("markdown", L["s5"]), ("code", L["s5_code"]),
    ])


if __name__ == "__main__":
    files = {
        "modul0/09_colab_atolyesi_tr.ipynb": workshop("tr"),
        "module0/09_colab_workshop_en.ipynb": workshop("en"),
        "modul0/10_bitirme_projesi_tr.ipynb": capstone("tr"),
        "module0/10_capstone_project_en.ipynb": capstone("en"),
    }
    for rel, data in files.items():
        p = os.path.join(OUT, rel)
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=1)
        print("yazıldı:", rel)
