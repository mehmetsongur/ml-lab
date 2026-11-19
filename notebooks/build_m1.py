"""ML Laboratuvarı — Modül 1 Colab notebook üretici (TR/EN).
Çıktı: modul1/*.ipynb (TR) ve module1/*.ipynb (EN).
Veri: FRED (UNRATE, FEDFUNDS, T10Y3MM); API anahtarı gerekmez."""
import os
from build_notebooks import nb, FRED_HELPER, b64, OUT

CODES = {"A": "ML1-BRL-6PWN", "B": "ML1-OLC-3KJV"}

SETUP = {
    "tr": '''
import io, base64, urllib.request
import numpy as np
import pandas as pd
''' + FRED_HELPER["tr"] + '''
issizlik = fred_indir("UNRATE").rename(columns={"UNRATE": "issizlik"})
faiz = fred_indir("FEDFUNDS").rename(columns={"FEDFUNDS": "faiz"})
vade_farki = fred_indir("T10Y3MM").rename(columns={"T10Y3MM": "vade_farki"})
_kopya = {"issizlik": issizlik.copy(), "faiz": faiz.copy(), "vade_farki": vade_farki.copy()}
SUTUNLAR = ["issizlik", "faiz", "vade_farki"]

def _k(s):
    return base64.b64decode(s).decode()

def _beklenen():
    d = _kopya["issizlik"].merge(_kopya["faiz"], on="tarih", how="outer").merge(_kopya["vade_farki"], on="tarih", how="outer")
    return d.sort_values("tarih").reset_index(drop=True)

def kontrol_A(veri):
    b = _beklenen()
    yok = [c for c in ["tarih"] + SUTUNLAR if c not in veri.columns]
    if yok:
        print("❌ Şu sütunlar bulunamadı:", yok); return
    if len(veri) < len(b):
        print(f"❌ Satır sayısı eksik: {len(b)} olmalıydı, {len(veri)} oldu. İç birleştirme (inner) yapılmış olabilir; how='outer' kullandın mı?"); return
    if len(veri) > len(b):
        print(f"❌ Satır sayısı fazla: {len(b)} olmalıydı, {len(veri)} oldu. Tekrarlanan tarihler var mı?"); return
    if not pd.Series(veri["tarih"]).is_monotonic_increasing:
        print("❌ Tablo tarihe göre sıralı değil."); return
    v = veri.reset_index(drop=True)
    if v["tarih"].duplicated().any():
        print("❌ Bazı tarihler birden çok kez geçiyor; tarih anahtarı tekil olmalı."); return
    if not (pd.to_datetime(v["tarih"]).to_numpy() == b["tarih"].to_numpy()).all():
        print("❌ Tarih anahtarları beklenen tabloyla birebir eşleşmiyor (eksik, fazla ya da kaymış aylar)."); return
    for c in SUTUNLAR:
        if int(v[c].isna().sum()) != int(b[c].isna().sum()):
            print(f"❌ '{c}' sütunundaki eksik sayısı beklenenden farklı. Eksikleri doldurdun ya da sildin mi?"); return
        if not np.allclose(v[c].to_numpy(dtype=float), b[c].to_numpy(dtype=float), equal_nan=True):
            print(f"❌ '{c}' sütunundaki değerler beklenenden farklı."); return
    print("✅ Tüm kontroller geçti. Tamamlama kodun: " + _k("''' + b64(CODES["A"]) + '''"))

def kontrol_B(ortak, olcekli):
    b = _beklenen().dropna(subset=SUTUNLAR).reset_index(drop=True)
    yok = [c for c in ["tarih"] + SUTUNLAR if c not in ortak.columns]
    if yok:
        print("❌ 'ortak' tablosunda şu sütunlar yok:", yok); return
    if len(ortak) > len(b):
        print("❌ 'ortak' beklenenden uzun: eksikleri doldurmuş olabilirsin (fillna, ffill). Ortak dönem, üç serinin de gözlendiği aylardır."); return
    if len(ortak) < len(b):
        print("❌ 'ortak' beklenenden kısa: üç serinin de bulunduğu bazı aylar kaybolmuş."); return
    if ortak[SUTUNLAR].isna().any().any():
        print("❌ 'ortak' tablosunda hâlâ eksik değer var."); return
    if pd.Timestamp(ortak["tarih"].min()) != pd.Timestamp(b["tarih"].min()):
        print("❌ Ortak dönemin başlangıcı beklenenden farklı."); return
    ot = ortak.sort_values("tarih").reset_index(drop=True)
    if ot["tarih"].duplicated().any():
        print("❌ 'ortak' tablosunda bazı aylar birden çok kez geçiyor."); return
    if not (pd.to_datetime(ot["tarih"]).to_numpy() == b["tarih"].to_numpy()).all():
        print("❌ 'ortak' tablosundaki aylar, üç serinin birlikte gözlendiği aylarla birebir eşleşmiyor."); return
    if not np.allclose(ot[SUTUNLAR].to_numpy(dtype=float), b[SUTUNLAR].to_numpy(dtype=float)):
        print("❌ 'ortak' tablosundaki ham değerler kaynakla eşleşmiyor. Değerler değiştirilmiş ya da sütunlar karışmış olabilir."); return
    yok = [c for c in SUTUNLAR if c not in olcekli.columns]
    if yok:
        print("❌ 'olcekli' tablosunda şu sütunlar yok:", yok); return
    if len(olcekli) != len(ortak):
        print("❌ 'olcekli' ile 'ortak' aynı sayıda satır içermeli."); return
    if "tarih" in olcekli.columns:
        olcekli = olcekli.sort_values("tarih")
        if not (pd.to_datetime(olcekli["tarih"]).to_numpy() == b["tarih"].to_numpy()).all():
            print("❌ 'olcekli' tablosunun tarihleri 'ortak' ile hizalı değil."); return
    o = olcekli[SUTUNLAR].astype(float).reset_index(drop=True)
    if (o.mean().abs() > 1e-6).any():
        print("❌ Ölçeklenmiş sütunların ortalaması 0 değil."); return
    if ((o.std() - 1).abs() > 0.01).any():
        print("❌ Ölçeklenmiş sütunların standart sapması 1 değil. var() yerine std() mi kullanılmalıydı?"); return
    z = (b[SUTUNLAR] - b[SUTUNLAR].mean()) / b[SUTUNLAR].std()
    if not np.allclose(o.to_numpy(), z.to_numpy(), atol=0.01):
        print("❌ Ölçeklenmiş değerler beklenenden farklı. Tablo tarihe göre sıralı mı?"); return
    _aylar = pd.period_range(b["tarih"].min(), b["tarih"].max(), freq="M")
    _bos = list(_aylar.difference(pd.PeriodIndex(b["tarih"].dt.to_period("M"))).astype(str))
    print(f"Ortak gözlemler: {b['tarih'].min():%Y-%m} – {b['tarih'].max():%Y-%m}, {len(b)} ay; dönem içinde eksik aylar: {_bos or 'yok'}")
    print("✅ Tüm kontroller geçti. Tamamlama kodun: " + _k("''' + b64(CODES["B"]) + '''"))
''',
    "en": '''
import io, base64, urllib.request
import numpy as np
import pandas as pd
''' + FRED_HELPER["en"] + '''
unemployment = fred_download("UNRATE").rename(columns={"UNRATE": "unemployment"})
fed_funds = fred_download("FEDFUNDS").rename(columns={"FEDFUNDS": "fed_funds"})
term_spread = fred_download("T10Y3MM").rename(columns={"T10Y3MM": "term_spread"})
_copy = {"unemployment": unemployment.copy(), "fed_funds": fed_funds.copy(), "term_spread": term_spread.copy()}
COLS = ["unemployment", "fed_funds", "term_spread"]

def _k(s):
    return base64.b64decode(s).decode()

def _expected():
    d = _copy["unemployment"].merge(_copy["fed_funds"], on="date", how="outer").merge(_copy["term_spread"], on="date", how="outer")
    return d.sort_values("date").reset_index(drop=True)

def check_A(data):
    e = _expected()
    absent = [c for c in ["date"] + COLS if c not in data.columns]
    if absent:
        print("❌ These columns were not found:", absent); return
    if len(data) < len(e):
        print(f"❌ Rows are missing: there should be {len(e)}, there are {len(data)}. An inner join may have been used; did you set how='outer'?"); return
    if len(data) > len(e):
        print(f"❌ Too many rows: there should be {len(e)}, there are {len(data)}. Are there duplicated dates?"); return
    if not pd.Series(data["date"]).is_monotonic_increasing:
        print("❌ The table is not sorted by date."); return
    v = data.reset_index(drop=True)
    if v["date"].duplicated().any():
        print("❌ Some dates appear more than once; the date key must be unique."); return
    if not (pd.to_datetime(v["date"]).to_numpy() == e["date"].to_numpy()).all():
        print("❌ The date keys do not match the expected table one to one (missing, extra or shifted months)."); return
    for c in COLS:
        if int(v[c].isna().sum()) != int(e[c].isna().sum()):
            print(f"❌ The number of missing values in '{c}' differs from the expected one. Did you fill or drop gaps?"); return
        if not np.allclose(v[c].to_numpy(dtype=float), e[c].to_numpy(dtype=float), equal_nan=True):
            print(f"❌ The values in '{c}' differ from the expected ones."); return
    print("✅ All checks passed. Your completion code: " + _k("''' + b64(CODES["A"]) + '''"))

def check_B(common, scaled):
    e = _expected().dropna(subset=COLS).reset_index(drop=True)
    absent = [c for c in ["date"] + COLS if c not in common.columns]
    if absent:
        print("❌ 'common' is missing these columns:", absent); return
    if len(common) > len(e):
        print("❌ 'common' is longer than expected: you may have filled gaps (fillna, ffill). The common period is the months in which all three series are observed."); return
    if len(common) < len(e):
        print("❌ 'common' is shorter than expected: some months in which all three series exist were lost."); return
    if common[COLS].isna().any().any():
        print("❌ 'common' still has missing values."); return
    if pd.Timestamp(common["date"].min()) != pd.Timestamp(e["date"].min()):
        print("❌ The start of the common period differs from the expected one."); return
    ct = common.sort_values("date").reset_index(drop=True)
    if ct["date"].duplicated().any():
        print("❌ Some months appear more than once in 'common'."); return
    if not (pd.to_datetime(ct["date"]).to_numpy() == e["date"].to_numpy()).all():
        print("❌ The months in 'common' do not match one to one the months in which all three series are observed."); return
    if not np.allclose(ct[COLS].to_numpy(dtype=float), e[COLS].to_numpy(dtype=float)):
        print("❌ The raw values in 'common' do not match the source. Values may have been changed or columns mixed up."); return
    absent = [c for c in COLS if c not in scaled.columns]
    if absent:
        print("❌ 'scaled' is missing these columns:", absent); return
    if len(scaled) != len(common):
        print("❌ 'scaled' and 'common' should have the same number of rows."); return
    if "date" in scaled.columns:
        scaled = scaled.sort_values("date")
        if not (pd.to_datetime(scaled["date"]).to_numpy() == e["date"].to_numpy()).all():
            print("❌ The dates of 'scaled' are not aligned with 'common'."); return
    o = scaled[COLS].astype(float).reset_index(drop=True)
    if (o.mean().abs() > 1e-6).any():
        print("❌ The scaled columns do not have mean 0."); return
    if ((o.std() - 1).abs() > 0.01).any():
        print("❌ The scaled columns do not have standard deviation 1. Should std() have been used instead of var()?"); return
    z = (e[COLS] - e[COLS].mean()) / e[COLS].std()
    if not np.allclose(o.to_numpy(), z.to_numpy(), atol=0.01):
        print("❌ The scaled values differ from the expected ones. Is the table sorted by date?"); return
    _months = pd.period_range(e["date"].min(), e["date"].max(), freq="M")
    _gaps = list(_months.difference(pd.PeriodIndex(e["date"].dt.to_period("M"))).astype(str))
    print(f"Common observations: {e['date'].min():%Y-%m} – {e['date'].max():%Y-%m}, {len(e)} months; months missing inside the period: {_gaps or 'none'}")
    print("✅ All checks passed. Your completion code: " + _k("''' + b64(CODES["B"]) + '''"))
''',
}

T = {
    "tr": dict(
        title="# ML Laboratuvarı · Modül 1, Ünite 10: Gerçek veriyi hazırlamak",
        intro="""**Prof. Dr. Mehmet Songur** · ML Laboratuvarı, Modül 1

Bu atölyede FRED'den aylık frekansta üç ABD serisini birleştirecek, eksik değerleri doğru ele alacak ve değişkenleri standartlaştıracaksın. Kodu **Gemini'ye yazdır**, sonra **denetle**.

| Tablo | FRED kodu | Değişken | Başlangıç |
|---|---|---|---|
| `issizlik` | UNRATE | İşsizlik oranı (%) | 1948 |
| `faiz` | FEDFUNDS | Federal fon faizi (%) | 1954 |
| `vade_farki` | T10Y3MM | 10 yıllık − 3 aylık tahvil faizi (puan) | 1982 |

**Kurallar**
1. **Kurulum** ve **Kontrol** hücrelerini değiştirme; yalnızca çalıştır.
2. Görev hücrelerinde kodu Gemini ile üret (hücredeki Gemini düğmesi ya da Gemini paneli; adı Colab'ın arayüzüne göre değişebilir).
3. Gemini'nin kodunu **çalıştırmadan önce oku**.
4. Kontrol hücresi geçerse bir **tamamlama kodu** verir; onu ML Laboratuvarı'ndaki ilgili kutuya yapıştır.

> Kendi kopyanı kaydetmek için: *Dosya → Drive'a kopya kaydet*.""",
        setup_title="#@title Kurulum — çalıştır, değiştirme",
        after_setup='\nprint("Tablolar hazır: issizlik, faiz, vade_farki")\nissizlik.head()',
        taskA="""## Görev A — Birleştir

Üç tabloyu `tarih` sütunu üzerinden, **hiçbir ay kaybolmayacak biçimde** birleştir, tarihe göre sırala ve sonucu `veri` adlı tabloya ata. Eksik değerleri **doldurma ya da silme**; her sütundaki eksik sayısını yazdır.

**Gemini'ye örnek istek (kendi isteğini yazman daha iyi):**
> issizlik, faiz ve vade_farki adlı üç pandas tablosu var; her birinde 'tarih' (aylık, datetime) ve bir değer sütunu bulunuyor. Üçünü 'tarih' üzerinden dış birleştirmeyle (how='outer') birleştir, tarihe göre sırala ve 'veri' adlı tabloya ata. Eksikleri doldurma veya silme. Satır sayısını ve her sütundaki eksik değer sayısını yazdır.

**Denetim soruları:** `how` ne? Satır sayısı en uzun seriden az mı? Eksik sayıları, serilerin başlangıç tarihleriyle tutarlı mı?""",
        taskA_code="# Görev A: Gemini ile kodu burada üret, oku, sonra çalıştır.\n",
        checkA_md="### Kontrol A — çalıştır, değiştirme",
        checkA="kontrol_A(veri)",
        taskB="""## Görev B — Ortak dönem ve ölçek

1. `veri` tablosundan **üç serinin de bulunduğu ayları** al ve `ortak` adlı tabloya ata. Eksikleri **doldurma**: 1954 öncesi federal fon faizi yok; doldurmak, var olmayan bir geçmiş uydurmak olur.
2. `ortak` tablosundaki üç değişkeni standartlaştır (z = (x − ortalama) / standart sapma) ve `olcekli` adlı tabloya yaz. `tarih` sütunu kalabilir.

**Denetim soruları:** `fillna` ya da `ffill` var mı? Ortak dönem hangi ayda başlıyor ve hangi ayda bitiyor? Dönem içinde eksik ay var mı? Ölçeklemede `std()` mi kullanılmış? Ortalamalar 0, standart sapmalar 1 mi?

**Ortak gözlem kümesi kesintisiz bir dönem değildir.** Bir seride dönem içinde tek bir ay eksikse o ay ortak tablodan düşer. Sonraki bir gecikme hesabında satır sırası her zaman takvim ayı demek değildir. Kontrol etmek için:
```python
aylar = pd.period_range(ortak["tarih"].min(), ortak["tarih"].max(), freq="M")
print(ortak["tarih"].min(), ortak["tarih"].max(), len(ortak), list(aylar.difference(pd.PeriodIndex(ortak["tarih"].dt.to_period("M")))))
```

**Kontrol B neyi sınar?** `ortak` tablosundaki ayların üç serinin birlikte gözlendiği aylarla birebir eşleştiğini (tekrar yok), ham değerlerin kaynakla aynı olduğunu, `olcekli` tablosunun aynı aylara hizalı olduğunu (varsa `tarih` sütunu), ortalamaların 0 ve standart sapmaların 1 olduğunu (pandas `std()`, ddof=1).""",
        taskB_code="# Görev B: Gemini ile kodu burada üret, oku, sonra çalıştır.\n",
        checkB_md="### Kontrol B — çalıştır, değiştirme",
        checkB="kontrol_B(ortak, olcekli)",
        notes="""## Denetim notların

ML Laboratuvarı'ndaki **denetim defterine** geçmeden önce burada kısaca not al:
- Gemini birleştirmede hangi türü kullandı? Değiştirmen gerekti mi?
- Eksik değerlerle ne yaptın ve neden?
- Ölçeklemeyi nasıl doğruladın?""",
    ),
    "en": dict(
        title="# ML Lab · Module 1, Unit 10: Preparing real data",
        intro="""**Prof. Dr. Mehmet Songur** · ML Lab, Module 1

In this workshop you merge three US series at monthly frequency from FRED, handle the missing values correctly and standardise the variables. **Have Gemini write the code**, then **audit it**.

| Table | FRED code | Variable | Starts |
|---|---|---|---|
| `unemployment` | UNRATE | Unemployment rate (%) | 1948 |
| `fed_funds` | FEDFUNDS | Federal funds rate (%) | 1954 |
| `term_spread` | T10Y3MM | 10-year minus 3-month Treasury yield (points) | 1982 |

**Rules**
1. Do not change the **Setup** and **Check** cells; just run them.
2. Generate code with Gemini in the task cells (the Gemini button in a cell or the Gemini panel; the name may vary with Colab's interface).
3. **Read** Gemini's code **before running it**.
4. If a check cell passes, it gives you a **completion code**; paste it into the matching box in ML Lab.

> To keep your own copy: *File → Save a copy in Drive*.""",
        setup_title="#@title Setup — run it, do not change it",
        after_setup='\nprint("Tables ready: unemployment, fed_funds, term_spread")\nunemployment.head()',
        taskA="""## Task A — Merge

Merge the three tables on the `date` column **so that no month is lost**, sort by date and store the result in a table called `data`. **Do not fill or drop** missing values; print the number missing in each column.

**Sample prompt for Gemini (writing your own is better):**
> There are three pandas tables called unemployment, fed_funds and term_spread; each has a 'date' column (monthly, datetime) and one value column. Merge the three on 'date' with an outer join (how='outer'), sort by date and store the result in 'data'. Do not fill or drop missing values. Print the row count and the number of missing values in each column.

**Audit questions:** What is `how`? Is the row count smaller than the longest series? Are the missing counts consistent with the series' start dates?""",
        taskA_code="# Task A: generate the code with Gemini here, read it, then run it.\n",
        checkA_md="### Check A — run it, do not change it",
        checkA="check_A(data)",
        taskB="""## Task B — Common period and scale

1. From `data`, keep **the months in which all three series exist** and store them in a table called `common`. **Do not fill** gaps: there was no federal funds rate before 1954; filling would mean inventing a past that does not exist.
2. Standardise the three variables in `common` (z = (x − mean) / standard deviation) and store them in a table called `scaled`. The `date` column may stay.

**Audit questions:** Is there a `fillna` or `ffill`? In which month does the common period start, and in which does it end? Is any month missing inside it? Does the scaling use `std()`? Are the means 0 and the standard deviations 1?

**The set of common observations is not an unbroken period.** If one series lacks a single month inside the period, that month drops out of the common table. In a later lag calculation the row order does not always mean the calendar month. To check:
```python
months = pd.period_range(common["date"].min(), common["date"].max(), freq="M")
print(common["date"].min(), common["date"].max(), len(common), list(months.difference(pd.PeriodIndex(common["date"].dt.to_period("M")))))
```

**What does Check B test?** That the months in `common` match exactly the months in which all three series are observed (no repeats), that the raw values equal the source, that `scaled` is aligned to the same months (if it has a `date` column), and that the means are 0 and the standard deviations 1 (pandas `std()`, ddof=1).""",
        taskB_code="# Task B: generate the code with Gemini here, read it, then run it.\n",
        checkB_md="### Check B — run it, do not change it",
        checkB="check_B(common, scaled)",
        notes="""## Your audit notes

Before moving to the **audit log** in ML Lab, jot down briefly:
- Which join type did Gemini use? Did you need to change it?
- What did you do with the missing values, and why?
- How did you verify the scaling?""",
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
    import json
    files = {
        "modul1/10_veri_hazirlama_atolyesi_tr.ipynb": workshop("tr"),
        "module1/10_data_preparation_workshop_en.ipynb": workshop("en"),
    }
    for rel, data in files.items():
        p = os.path.join(OUT, rel)
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=1)
        print("yazıldı:", rel)
