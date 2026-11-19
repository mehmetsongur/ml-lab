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
    d["onceki"] = d["oran"].shift(1)
    egt = d[d["tarih"] < KESIM].dropna()
    tst = d[d["tarih"] >= KESIM].dropna()
    saf = float(np.sqrt(((tst["oran"] - tst["onceki"]) ** 2).mean()))
    b, a = np.polyfit(egt["onceki"], egt["oran"], 1)
    model = float(np.sqrt(((tst["oran"] - (a + b * tst["onceki"])) ** 2).mean()))
    hepsi = d.dropna()
    b_hepsi, a_hepsi = np.polyfit(hepsi["onceki"], hepsi["oran"], 1)
    return dict(saf=saf, a=a, b=b, model=model, a_hepsi=a_hepsi, b_hepsi=b_hepsi)

def kontrol_A(egitim, test, kok_hko_saf):
    for ad, t in [("egitim", egitim), ("test", test)]:
        if "tarih" not in t.columns or "oran" not in t.columns:
            print(f"❌ '{ad}' tablosunda 'tarih' ve 'oran' sütunları olmalı."); return
    if pd.Timestamp(egitim["tarih"].max()) >= KESIM or pd.Timestamp(test["tarih"].min()) < KESIM:
        print("❌ Bölme zamana göre değil: eğitim 2015 öncesi, test 2015 ve sonrası olmalı. Veri karıştırılmış olabilir."); return
    if pd.Timestamp(egitim["tarih"].min()) > _kopya["tarih"].min() + pd.Timedelta(days=40):
        print("❌ Eğitim verisi serinin başından başlamıyor; bazı yıllar kaybolmuş."); return
    if len(test) < (_kopya["tarih"] >= KESIM).sum() - 2:
        print("❌ Test verisinde beklenenden az ay var."); return
    e = _beklenen()
    if abs(float(kok_hko_saf) - e["saf"]) > 0.02:
        print(f"❌ Saf öngörünün kök HKO'su beklenenden farklı. Öngörü 'geçen ayın oranı' mı? Hata kare alınıp ortalanıp karekökü alındı mı?"); return
    print(f"✅ Tüm kontroller geçti (saf öngörü kök HKO ≈ {e['saf']:.3f}). Tamamlama kodun: " + _k("''' + b64(CODES["A"]) + '''"))

def kontrol_B(a, b, kok_hko_model):
    e = _beklenen()
    if abs(float(b) - e["b_hepsi"]) < 0.002 and abs(float(b) - e["b"]) > 0.002:
        print("❌ Katsayılar tüm veriyle (test dönemi dahil) kestirilmiş görünüyor: bu bir sızıntı. Yalnızca eğitim verisini kullan."); return
    if abs(float(b) - e["b"]) > 0.005 or abs(float(a) - e["a"]) > 0.03:
        print("❌ Katsayılar beklenenden farklı. Model 'oran_t = a + b · oran_t-1' mi? Yalnızca eğitim verisiyle mi kestirildi?"); return
    if abs(float(kok_hko_model) - e["model"]) > 0.02:
        print("❌ Modelin test kök HKO'su beklenenden farklı. Test döneminde mi hesaplandı?"); return
    print(f"✅ Tüm kontroller geçti (model ≈ {e['model']:.3f}, saf öngörü ≈ {e['saf']:.3f}). Tamamlama kodun: " + _k("''' + b64(CODES["B"]) + '''"))
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
    d["prev"] = d["rate"].shift(1)
    trn = d[d["date"] < CUT].dropna()
    tst = d[d["date"] >= CUT].dropna()
    naive = float(np.sqrt(((tst["rate"] - tst["prev"]) ** 2).mean()))
    b, a = np.polyfit(trn["prev"], trn["rate"], 1)
    model = float(np.sqrt(((tst["rate"] - (a + b * tst["prev"])) ** 2).mean()))
    alld = d.dropna()
    b_all, a_all = np.polyfit(alld["prev"], alld["rate"], 1)
    return dict(naive=naive, a=a, b=b, model=model, a_all=a_all, b_all=b_all)

def check_A(train, test, rmse_naive):
    for name, t in [("train", train), ("test", test)]:
        if "date" not in t.columns or "rate" not in t.columns:
            print(f"❌ '{name}' should have 'date' and 'rate' columns."); return
    if pd.Timestamp(train["date"].max()) >= CUT or pd.Timestamp(test["date"].min()) < CUT:
        print("❌ The split is not by time: training should be before 2015 and test 2015 onwards. The data may have been shuffled."); return
    if pd.Timestamp(train["date"].min()) > _copy["date"].min() + pd.Timedelta(days=40):
        print("❌ The training data do not start at the beginning of the series; some years were lost."); return
    if len(test) < (_copy["date"] >= CUT).sum() - 2:
        print("❌ The test data have fewer months than expected."); return
    e = _expected()
    if abs(float(rmse_naive) - e["naive"]) > 0.02:
        print("❌ The naive forecast's RMSE differs from the expected value. Is the forecast 'last month's rate'? Were the errors squared, averaged and square-rooted?"); return
    print(f"✅ All checks passed (naive RMSE ≈ {e['naive']:.3f}). Your completion code: " + _k("''' + b64(CODES["A"]) + '''"))

def check_B(a, b, rmse_model):
    e = _expected()
    if abs(float(b) - e["b_all"]) < 0.002 and abs(float(b) - e["b"]) > 0.002:
        print("❌ The coefficients seem to have been estimated on all the data (including the test period): that is leakage. Use the training data only."); return
    if abs(float(b) - e["b"]) > 0.005 or abs(float(a) - e["a"]) > 0.03:
        print("❌ The coefficients differ from the expected ones. Is the model 'rate_t = a + b · rate_t-1'? Was it estimated on the training data only?"); return
    if abs(float(rmse_model) - e["model"]) > 0.02:
        print("❌ The model's test RMSE differs from the expected value. Was it computed over the test period?"); return
    print(f"✅ All checks passed (model ≈ {e['model']:.3f}, naive ≈ {e['naive']:.3f}). Your completion code: " + _k("''' + b64(CODES["B"]) + '''"))
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

1. `issizlik` tablosunu **zamana göre** böl: `tarih < 2015-01-01` → `egitim`, `tarih >= 2015-01-01` → `test`. Karıştırma yok.
2. Test döneminde **saf öngörünün** (bu ay = geçen ay) kök HKO'sunu hesapla ve `kok_hko_saf` adlı değişkene ata.

**Denetim soruları:** `train_test_split` ya da `sample` var mı? Kesim tarihi doğru mu? Eksik ay hatayı bozuyor mu?""",
        taskA_code="# Görev A: Gemini ile kodu burada üret, oku, sonra çalıştır.\n",
        checkA_md="### Kontrol A — çalıştır, değiştirme",
        checkA="kontrol_A(egitim, test, kok_hko_saf)",
        taskB="""## Görev B — Basit bir regresyon

`oran_t = a + b · oran_t-1` modelini **yalnızca `egitim` verisiyle** kestir. Katsayıları `a` ve `b` değişkenlerine, test dönemindeki kök HKO'yu `kok_hko_model` değişkenine ata ve saf öngörüyle karşılaştır.

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

1. Split the `unemp` table **by time**: `date < 2015-01-01` → `train`, `date >= 2015-01-01` → `test`. No shuffling.
2. Over the test period, compute the RMSE of the **naive forecast** (this month = last month) and store it in `rmse_naive`.

**Audit questions:** Is there a `train_test_split` or `sample`? Is the cut-off date right? Does the missing month distort the error?""",
        taskA_code="# Task A: generate the code with Gemini here, read it, then run it.\n",
        checkA_md="### Check A — run it, do not change it",
        checkA="check_A(train, test, rmse_naive)",
        taskB="""## Task B — A simple regression

Estimate the model `rate_t = a + b · rate_t-1` **using the `train` data only**. Store the coefficients in `a` and `b`, the RMSE over the test period in `rmse_model`, and compare it with the naive forecast.

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
