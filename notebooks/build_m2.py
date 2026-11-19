"""ML Laboratuvarı — Modül 2 Colab notebook üretici (TR/EN).
Çıktı: modul2/*.ipynb (TR) ve module2/*.ipynb (EN). Veri: FRED UNRATE (API anahtarı gerekmez)."""
import os, json
from build_notebooks import nb, FRED_HELPER, b64, OUT

CODES = {"A": "ML2-SAF-8RTQ", "B": "ML2-MDL-5HWC"}

SETUP = {
    "tr": '''
import io, base64, urllib.request
import numpy as np
import pandas as pd
''' + FRED_HELPER["tr"] + '''
issizlik = fred_indir("UNRATE").rename(columns={"UNRATE": "oran"}).sort_values("tarih").reset_index(drop=True)
_kopya = issizlik.copy()
KESIM = pd.Timestamp("2015-01-01")

def _k(s):
    return base64.b64decode(s).decode()

def _beklenen():
    d = _kopya.copy()
    # Takvim korunur: eksik ay satırı silinmeden gecikme oluşturulur
    d["onceki"] = d["oran"].shift(1)
    gecerli = d["oran"].notna() & d["onceki"].notna()
    egt = d[(d["tarih"] < KESIM) & gecerli]
    tst = d[(d["tarih"] >= KESIM) & gecerli]
    saf = float(np.sqrt(((tst["oran"] - tst["onceki"]) ** 2).mean()))
    b, a = np.polyfit(egt["onceki"], egt["oran"], 1)
    model = float(np.sqrt(((tst["oran"] - (a + b * tst["onceki"])) ** 2).mean()))
    hepsi = d[gecerli]
    b_hepsi, a_hepsi = np.polyfit(hepsi["onceki"], hepsi["oran"], 1)
    disari = d[(d["tarih"] >= KESIM) & ~gecerli]
    return dict(saf=saf, a=a, b=b, model=model, a_hepsi=a_hepsi, b_hepsi=b_hepsi, egt=egt, tst=tst, disari=disari)

def _sonlu(x):
    try:
        return np.isfinite(float(x))
    except Exception:
        return False

def _takvim_kontrol():
    t = _kopya["tarih"]
    if not t.is_monotonic_increasing or t.duplicated().any():
        return "kaynak tarih dizisi artan ve tekil değil"
    aylar = pd.period_range(t.min(), t.max(), freq="M")
    if not pd.PeriodIndex(t.dt.to_period("M")).equals(aylar):
        return "kaynak takvimde atlanan ay var"
    return None

def _gecikme_kontrol(tablo, ad, beklenen):
    if "onceki" not in tablo.columns:
        return f"❌ '{ad}' tablosunda 'onceki' sütunu yok (takvimde bir önceki ayın oranı)."
    if tablo["tarih"].duplicated().any():
        return f"❌ '{ad}' tablosunda bazı aylar birden çok kez geçiyor."
    s = tablo.set_index("tarih")
    ok = s["oran"].notna() & s["onceki"].notna()
    ogr = set(pd.to_datetime(s.index[ok]))
    bek = set(pd.to_datetime(beklenen["tarih"]))
    fazla = sorted(ogr - bek)
    if fazla:
        return f"❌ '{ad}' tablosunda gecikmesi geçerli olmaması gereken aylar var: {[f'{x:%Y-%m}' for x in fazla[:3]]}. Eksik ay satırı gecikmeden önce silindiyse bir sonraki ay yanlış aya bağlanır; önce takvimi koru, sonra shift(1) uygula."
    eksik = sorted(bek - ogr)
    if eksik:
        return f"❌ '{ad}' tablosunda hesaplanabilir {len(eksik)} ay eksik ya da gecikmesi boş (ilki {eksik[0]:%Y-%m})."
    v = s.loc[beklenen["tarih"], "onceki"].to_numpy(dtype=float)
    fark = np.abs(v - beklenen["onceki"].to_numpy(dtype=float)) > 1e-9
    if fark.any():
        ay = pd.Timestamp(beklenen["tarih"].iloc[int(np.argmax(fark))])
        return f"❌ '{ad}' tablosunda {ay:%Y-%m} için 'onceki' değeri takvimde bir önceki ayın oranı değil. Gecikme yanlış aya bağlanmış."
    return None

def kontrol_A(egitim, test, kok_hko_saf):
    for ad, t in [("egitim", egitim), ("test", test)]:
        if "tarih" not in t.columns or "oran" not in t.columns:
            print(f"❌ '{ad}' tablosunda 'tarih' ve 'oran' sütunları olmalı."); return
    sorun = _takvim_kontrol()
    if sorun:
        print("❌ Beklenmeyen kaynak durumu: " + sorun); return
    if pd.Timestamp(egitim["tarih"].max()) >= KESIM or pd.Timestamp(test["tarih"].min()) < KESIM:
        print("❌ Bölme zamana göre değil: eğitim 2015 öncesi, test 2015 ve sonrası olmalı. Veri karıştırılmış olabilir."); return
    e = _beklenen()
    for ad, t, bek in [("egitim", egitim, e["egt"]), ("test", test, e["tst"])]:
        sorun = _gecikme_kontrol(t, ad, bek)
        if sorun:
            print(sorun); return
    if not _sonlu(kok_hko_saf):
        print("❌ 'kok_hko_saf' sonlu bir sayı değil (NaN ya da sonsuz)."); return
    if abs(float(kok_hko_saf) - e["saf"]) > 1e-4:
        print("❌ Saf öngörünün kök HKO'su beklenenden farklı. Öngörü 'onceki' mi? Hata kare alınıp ortalanıp karekökü alındı mı?"); return
    dis = [f"{x:%Y-%m}" for x in e["disari"]["tarih"]]
    print(f"Test: {len(e['tst'])} ay değerlendirildi. Hesaplanamayan aylar: {dis} (gerçekleşme ya da önceki ay değeri eksik).")
    print(f"✅ Tüm kontroller geçti (saf öngörü kök HKO ≈ {e['saf']:.4f}). Tamamlama kodun: " + _k("''' + b64(CODES["A"]) + '''"))

def kontrol_B(a, b, kok_hko_model):
    for ad, x in [("a", a), ("b", b), ("kok_hko_model", kok_hko_model)]:
        if not _sonlu(x):
            print(f"❌ '{ad}' sonlu bir sayı değil (NaN ya da sonsuz). Eksik değerler kestirime girmiş olabilir."); return
    e = _beklenen()
    egitim, test = globals().get("egitim"), globals().get("test")
    if abs(float(b) - e["b_hepsi"]) < 0.002 and abs(float(b) - e["b"]) > 0.002:
        print("❌ Katsayılar tüm veriyle (test dönemi dahil) kestirilmiş görünüyor: bu bir sızıntı. Yalnızca eğitim verisini kullan."); return
    if abs(float(b) - e["b"]) > 1e-6 or abs(float(a) - e["a"]) > 1e-6:
        print("❌ Katsayılar beklenenden farklı. Model 'oran_t = a + b · oran_t-1' mi? Yalnızca eğitimdeki geçerli aylarla mı kestirildi?"); return
    if test is None or "tahmin" not in test.columns:
        print("❌ 'test' tablosunda 'tahmin' sütunu yok (a + b · onceki)."); return
    s = test.set_index("tarih")
    t = s.loc[e["tst"]["tarih"], "tahmin"].to_numpy(dtype=float)
    if not np.allclose(t, float(a) + float(b) * e["tst"]["onceki"].to_numpy(dtype=float), atol=1e-9):
        print("❌ 'tahmin' sütunu bazı aylarda a + b · onceki değil. Satırlar kaymış ya da yanlış katsayılar kullanılmış olabilir."); return
    if abs(float(kok_hko_model) - e["model"]) > 1e-4:
        print("❌ Modelin test kök HKO'su beklenenden farklı. Test dönemindeki geçerli aylarda mı hesaplandı?"); return
    print(f"Eğitim: {len(e['egt'])} ay ({e['egt']['tarih'].min():%Y-%m} – {e['egt']['tarih'].max():%Y-%m}); test: {len(e['tst'])} ay.")
    print(f"Model ≈ {e['model']:.4f}, saf öngörü ≈ {e['saf']:.4f}; fark ≈ {e['saf'] - e['model']:.4f} yüzde puan. Bir ay ileri, koşullu değerlendirme: her ay önceki ayın gerçekleşmesi biliniyor varsayılıyor.")
    print("✅ Tüm kontroller geçti. Tamamlama kodun: " + _k("''' + b64(CODES["B"]) + '''"))
''',
    "en": '''
import io, base64, urllib.request
import numpy as np
import pandas as pd
''' + FRED_HELPER["en"] + '''
unemp = fred_download("UNRATE").rename(columns={"UNRATE": "rate"}).sort_values("date").reset_index(drop=True)
_copy = unemp.copy()
CUT = pd.Timestamp("2015-01-01")

def _k(s):
    return base64.b64decode(s).decode()

def _expected():
    d = _copy.copy()
    # The calendar is kept: the lag is built before any missing month row is dropped
    d["prev"] = d["rate"].shift(1)
    valid = d["rate"].notna() & d["prev"].notna()
    trn = d[(d["date"] < CUT) & valid]
    tst = d[(d["date"] >= CUT) & valid]
    naive = float(np.sqrt(((tst["rate"] - tst["prev"]) ** 2).mean()))
    b, a = np.polyfit(trn["prev"], trn["rate"], 1)
    model = float(np.sqrt(((tst["rate"] - (a + b * tst["prev"])) ** 2).mean()))
    alld = d[valid]
    b_all, a_all = np.polyfit(alld["prev"], alld["rate"], 1)
    out = d[(d["date"] >= CUT) & ~valid]
    return dict(naive=naive, a=a, b=b, model=model, a_all=a_all, b_all=b_all, trn=trn, tst=tst, out=out)

def _finite(x):
    try:
        return np.isfinite(float(x))
    except Exception:
        return False

def _calendar_check():
    t = _copy["date"]
    if not t.is_monotonic_increasing or t.duplicated().any():
        return "the source date sequence is not increasing and unique"
    months = pd.period_range(t.min(), t.max(), freq="M")
    if not pd.PeriodIndex(t.dt.to_period("M")).equals(months):
        return "the source calendar skips a month"
    return None

def _lag_check(table, name, expected):
    if "prev" not in table.columns:
        return f"❌ '{name}' has no 'prev' column (the rate of the previous calendar month)."
    if table["date"].duplicated().any():
        return f"❌ Some months appear more than once in '{name}'."
    s = table.set_index("date")
    ok = s["rate"].notna() & s["prev"].notna()
    got = set(pd.to_datetime(s.index[ok]))
    exp = set(pd.to_datetime(expected["date"]))
    extra = sorted(got - exp)
    if extra:
        return f"❌ '{name}' has months whose lag should not be valid: {[f'{x:%Y-%m}' for x in extra[:3]]}. If a missing month's row is dropped before the lag, the next month is tied to the wrong month; keep the calendar first, then apply shift(1)."
    missing = sorted(exp - got)
    if missing:
        return f"❌ '{name}' lacks {len(missing)} computable months or their lag is empty (first {missing[0]:%Y-%m})."
    v = s.loc[expected["date"], "prev"].to_numpy(dtype=float)
    diff = np.abs(v - expected["prev"].to_numpy(dtype=float)) > 1e-9
    if diff.any():
        m = pd.Timestamp(expected["date"].iloc[int(np.argmax(diff))])
        return f"❌ In '{name}', 'prev' for {m:%Y-%m} is not the rate of the previous calendar month. The lag is tied to the wrong month."
    return None

def check_A(train, test, rmse_naive):
    for name, t in [("train", train), ("test", test)]:
        if "date" not in t.columns or "rate" not in t.columns:
            print(f"❌ '{name}' should have 'date' and 'rate' columns."); return
    problem = _calendar_check()
    if problem:
        print("❌ Unexpected source state: " + problem); return
    if pd.Timestamp(train["date"].max()) >= CUT or pd.Timestamp(test["date"].min()) < CUT:
        print("❌ The split is not by time: training should be before 2015 and test 2015 onwards. The data may have been shuffled."); return
    e = _expected()
    for name, t, exp in [("train", train, e["trn"]), ("test", test, e["tst"])]:
        problem = _lag_check(t, name, exp)
        if problem:
            print(problem); return
    if not _finite(rmse_naive):
        print("❌ 'rmse_naive' is not a finite number (NaN or infinite)."); return
    if abs(float(rmse_naive) - e["naive"]) > 1e-4:
        print("❌ The naive forecast's RMSE differs from the expected value. Is the forecast 'prev'? Were the errors squared, averaged and square-rooted?"); return
    out = [f"{x:%Y-%m}" for x in e["out"]["date"]]
    print(f"Test: {len(e['tst'])} months evaluated. Months that cannot be computed: {out} (actual or previous month's value missing).")
    print(f"✅ All checks passed (naive RMSE ≈ {e['naive']:.4f}). Your completion code: " + _k("''' + b64(CODES["A"]) + '''"))

def check_B(a, b, rmse_model):
    for name, x in [("a", a), ("b", b), ("rmse_model", rmse_model)]:
        if not _finite(x):
            print(f"❌ '{name}' is not a finite number (NaN or infinite). Missing values may have entered the estimation."); return
    e = _expected()
    train, test = globals().get("train"), globals().get("test")
    if abs(float(b) - e["b_all"]) < 0.002 and abs(float(b) - e["b"]) > 0.002:
        print("❌ The coefficients seem to have been estimated on all the data (including the test period): that is leakage. Use the training data only."); return
    if abs(float(b) - e["b"]) > 1e-6 or abs(float(a) - e["a"]) > 1e-6:
        print("❌ The coefficients differ from the expected ones. Is the model 'rate_t = a + b · rate_t-1'? Was it estimated on the valid training months only?"); return
    if test is None or "forecast" not in test.columns:
        print("❌ 'test' has no 'forecast' column (a + b · prev)."); return
    s = test.set_index("date")
    f = s.loc[e["tst"]["date"], "forecast"].to_numpy(dtype=float)
    if not np.allclose(f, float(a) + float(b) * e["tst"]["prev"].to_numpy(dtype=float), atol=1e-9):
        print("❌ In some months 'forecast' is not a + b · prev. Rows may be shifted or the wrong coefficients used."); return
    if abs(float(rmse_model) - e["model"]) > 1e-4:
        print("❌ The model's test RMSE differs from the expected value. Was it computed over the valid test months?"); return
    print(f"Training: {len(e['trn'])} months ({e['trn']['date'].min():%Y-%m} – {e['trn']['date'].max():%Y-%m}); test: {len(e['tst'])} months.")
    print(f"Model ≈ {e['model']:.4f}, naive ≈ {e['naive']:.4f}; difference ≈ {e['naive'] - e['model']:.4f} percentage points. One-month-ahead conditional evaluation: each month assumes the previous month's actual is known.")
    print("✅ All checks passed. Your completion code: " + _k("''' + b64(CODES["B"]) + '''"))
''',
}

T = {
    "tr": dict(
        title="# ML Laboratuvarı · Modül 2, Ünite 9: Bir öngörüyü dürüstçe değerlendirmek",
        intro="""**Prof. Dr. Mehmet Songur** · ML Laboratuvarı, Modül 2

Veri: ABD işsizlik oranı (FRED: `UNRATE`, aylık, %). Tablo: `issizlik` (sütunlar: `tarih`, `oran`). Kodu **Gemini'ye yazdır**, sonra **denetle**.

**Kurallar**
1. **Kurulum** ve **Kontrol** hücrelerini değiştirme; yalnızca çalıştır.
2. Görev hücrelerinde kodu Gemini ile üret; çalıştırmadan önce oku.
3. Kontrol hücresi geçerse bir **tamamlama kodu** verir; onu ML Laboratuvarı'ndaki kutuya yapıştır.

> Not: 2025 Ekim'in değeri eksik (ABD federal hükümetinin kapanması sırasında anket derlenemedi). Doldurma; nasıl ele alındığını denetle.""",
        setup_title="#@title Kurulum — çalıştır, değiştirme",
        after_setup='\nprint("issizlik tablosu:", issizlik.shape)\nissizlik.tail()',
        taskA="""## Görev A — Zamana göre bölme ve kıyas ölçütü

1. Önce **takvimi doğrula**: tarihler artan ve tekil mi, hiçbir ay atlanmamış mı? Ekim 2025 satırı değeri boş olarak duruyor; **silme**.
2. Tam takvim üzerinde gecikmeyi oluştur: `issizlik["onceki"] = issizlik["oran"].shift(1)`. Gecikmeyi eksik satırları sildikten sonra kurarsan Kasım 2025'in “önceki ayı” Eylül olur.
3. Tabloyu **zamana göre** böl: `tarih < 2015-01-01` → `egitim`, `tarih >= 2015-01-01` → `test`. Karıştırma yok. İki tabloda da `onceki` sütunu kalsın.
4. Test döneminde `oran` ve `onceki` değerinin ikisi de bulunan aylarda **saf öngörünün** (bu ay = önceki ay) kök HKO'sunu hesapla ve `kok_hko_saf` adlı değişkene ata. Hesaplanamayan ayları ve değerlendirilen ay sayısını yazdır.

**Öngörü anı:** Her ay için öngörü, bir önceki ayın verisi **yayımlandıktan sonra** yapılıyor varsayılıyor (bir ay ileri, koşullu değerlendirme). Gerçekte ilk açıklanan rakamlar sonradan revize edilebilir; FRED'in bugünkü serisi revize edilmiş değerleri içerir.

**Kontrol A neyi sınar?** Bölmenin zamana göre olduğunu; iki tablodaki her geçerli ayın `onceki` değerinin takvimde bir önceki ayın oranı olduğunu (satır satır); geçerli olmaması gereken bir ayın (Kasım 2025) hesaba girmediğini; kök HKO'nun sonlu ve doğru olduğunu.

**Denetim soruları:** `train_test_split` ya da `sample` var mı? Kesim tarihi doğru mu? Gecikme eksik satır silinmeden önce mi kuruldu?""",
        taskA_code="# Görev A: Gemini ile kodu burada üret, oku, sonra çalıştır.\n",
        checkA_md="### Kontrol A — çalıştır, değiştirme",
        checkA="kontrol_A(egitim, test, kok_hko_saf)",
        taskB="""## Görev B — Basit bir regresyon

`oran_t = a + b · oran_t-1` modelini **yalnızca `egitim` tablosunun geçerli aylarıyla** (`oran` ve `onceki` dolu) kestir. Katsayıları `a` ve `b` değişkenlerine ata. Test tablosuna `tahmin = a + b · onceki` sütununu ekle; test dönemindeki kök HKO'yu `kok_hko_model` değişkenine ata ve saf öngörüyle karşılaştır.

**Kıyasın kapsamı:** Bu, bir ay ileri koşullu bir değerlendirmedir: her test ayında bir önceki ayın gerçekleşmesi biliniyor sayılır. 2015 başında tek seferde bütün test dönemini öngörmek farklı (ve çok daha zor) bir sorudur. Fark küçükse, test dönemini ve veri sürümünü (indirme tarihi) birlikte raporla.

**Kontrol B neyi sınar?** Katsayıların sonlu olduğunu ve yalnızca eğitimdeki geçerli aylarla kestirildiğini; `tahmin` sütununun her geçerli test ayında a + b · onceki olduğunu; kök HKO'nun doğru olduğunu.

**Denetim soruları:** Katsayılar hangi veriyle kestirildi (`pd.concat` var mı)? Test döneminin ilk ayı için geçen ayın değeri nereden geliyor? Model saf öngörüyü ne kadar geçiyor?""",
        taskB_code="# Görev B: Gemini ile kodu burada üret, oku, sonra çalıştır.\n",
        checkB_md="### Kontrol B — çalıştır, değiştirme",
        checkB="kontrol_B(a, b, kok_hko_model)",
        notes="""## Denetim notların

- Gemini veriyi nasıl böldü? Değiştirmen gerekti mi?
- Regresyon katsayıları hangi veriyle kestirildi?
- Model saf öngörüyü geçiyor mu, ne kadar?""",
    ),
    "en": dict(
        title="# ML Lab · Module 2, Unit 9: Evaluating a forecast honestly",
        intro="""**Prof. Dr. Mehmet Songur** · ML Lab, Module 2

Data: the US unemployment rate (FRED: `UNRATE`, monthly, %). Table: `unemp` (columns: `date`, `rate`). **Have Gemini write the code**, then **audit it**.

**Rules**
1. Do not change the **Setup** and **Check** cells; just run them.
2. Generate code with Gemini in the task cells; read it before running.
3. If a check cell passes, it gives you a **completion code**; paste it into the box in ML Lab.

> Note: the value for October 2025 is missing (the survey could not be collected during the US federal government shutdown). Do not fill it; audit how it is handled.""",
        setup_title="#@title Setup — run it, do not change it",
        after_setup='\nprint("unemp table:", unemp.shape)\nunemp.tail()',
        taskA="""## Task A — Split by time and a benchmark

1. First **verify the calendar**: are the dates increasing and unique, with no month skipped? The October 2025 row stays with an empty value; **do not drop it**.
2. Build the lag on the full calendar: `unemp["prev"] = unemp["rate"].shift(1)`. If you build the lag after dropping missing rows, the “previous month” of November 2025 becomes September.
3. Split the table **by time**: `date < 2015-01-01` → `train`, `date >= 2015-01-01` → `test`. No shuffling. Keep the `prev` column in both tables.
4. Over the test months where both `rate` and `prev` exist, compute the RMSE of the **naive forecast** (this month = previous month) and store it in `rmse_naive`. Print the months that cannot be computed and the number of months evaluated.

**Forecast time:** each month's forecast is assumed to be made **after** the previous month's figure is published (a one-month-ahead conditional evaluation). In reality first releases can be revised later; FRED's current series contains revised values.

**What does Check A test?** That the split is by time; that every valid month's `prev` in both tables is the rate of the previous calendar month (row by row); that a month that should not be valid (November 2025) does not enter the calculation; that the RMSE is finite and correct.

**Audit questions:** Is there a `train_test_split` or `sample`? Is the cut-off date right? Was the lag built before any missing row was dropped?""",
        taskA_code="# Task A: generate the code with Gemini here, read it, then run it.\n",
        checkA_md="### Check A — run it, do not change it",
        checkA="check_A(train, test, rmse_naive)",
        taskB="""## Task B — A simple regression

Estimate the model `rate_t = a + b · rate_t-1` **using only the valid months of `train`** (`rate` and `prev` both present). Store the coefficients in `a` and `b`. Add a `forecast = a + b · prev` column to the test table; store the RMSE over the test period in `rmse_model` and compare it with the naive forecast.

**Scope of the comparison:** this is a one-month-ahead conditional evaluation: in each test month the previous month's actual is taken as known. Forecasting the whole test period in one go at the start of 2015 is a different (and much harder) question. If the difference is small, report it together with the test period and the data vintage (download date).

**What does Check B test?** That the coefficients are finite and estimated on the valid training months only; that `forecast` equals a + b · prev in every valid test month; that the RMSE is correct.

**Audit questions:** Which data were the coefficients estimated on (is there a `pd.concat`)? Where does last month's value for the first test month come from? By how much does the model beat the naive forecast?""",
        taskB_code="# Task B: generate the code with Gemini here, read it, then run it.\n",
        checkB_md="### Check B — run it, do not change it",
        checkB="check_B(a, b, rmse_model)",
        notes="""## Your audit notes

- How did Gemini split the data? Did you need to change it?
- Which data were the regression coefficients estimated on?
- Does the model beat the naive forecast, and by how much?""",
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
    files = {
        "modul2/09_ongoru_degerlendirme_atolyesi_tr.ipynb": workshop("tr"),
        "module2/09_forecast_evaluation_workshop_en.ipynb": workshop("en"),
    }
    for rel, data in files.items():
        p = os.path.join(OUT, rel)
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=1)
        print("yazıldı:", rel)
