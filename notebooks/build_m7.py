"""ML Laboratuvarı — Modül 7 Colab notebook üretici (TR/EN).
Çıktı: modul7/*.ipynb (TR) ve module7/*.ipynb (EN).
Veri (bu deponun data/ klasöründen): Dünya Bankası ülke göstergeleri (CC BY 4.0), FOMC açıklamaları ve
FRED federal fon oranı (ABD kamu malı)."""
import os, json
from build_notebooks import nb, b64, OUT
from build_m4 import fnv

CODES = {"A": "ML7-KUM-5RWD", "B": "ML7-TON-8GPL"}
RAW = "https://raw.githubusercontent.com/mehmetsongur/ml-lab/main/data/"

COMMON = '''
import base64, re, warnings
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, adjusted_rand_score
warnings.filterwarnings("ignore")

def _k(s):
    return base64.b64decode(s).decode()

_D = ["gdppc_ppp", "inflation", "unemployment", "trade", "agriculture", "urban", "life_exp", "fertility"]
_S = ["tighten", "tightening", "firming", "raise", "increase", "elevated", "pressures", "upside", "strong", "robust", "solid", "reduce"]
_G = ["accommodative", "accommodation", "ease", "easing", "lower", "decline", "weak", "weakened", "slack", "downside", "subdued", "purchases"]

def _kume(X):
    Z = StandardScaler().fit_transform(X)
    sil = {k: silhouette_score(Z, KMeans(n_clusters=k, n_init=10, random_state=0).fit_predict(Z)) for k in range(2, 9)}
    k = max(sil, key=sil.get)
    return Z, k, sil[k], KMeans(n_clusters=k, n_init=10, random_state=0).fit_predict(Z)

def _referans(u, b, f):
    X = u[_D].copy()
    X["gdppc_ppp"] = np.log(X["gdppc_ppp"]); X["inflation"] = np.log(X["inflation"])
    Z, k, s, e = _kume(X)
    out = dict(Z=Z, k=k, sil=s, ari=adjusted_rand_score(u["income"], e))
    e3 = KMeans(n_clusters=3, n_init=10, random_state=0).fit_predict(Z)
    out.update(sil3=silhouette_score(Z, e3), ari3=adjusted_rand_score(u["income"], e3), boy=np.bincount(e).tolist())
    ine = {k: KMeans(n_clusters=k, n_init=10, random_state=0).fit(Z).inertia_ for k in range(2, 9)}
    out["k_inertia"] = min(ine, key=ine.get)
    def say(m, ks, sinir=True):
        return sum(len(re.findall(r"\\b" + w + r"\\b", m)) if sinir else m.count(w) for w in ks)
    def ton(metinler, sinir=True):
        s = metinler.map(lambda m: say(m, _S, sinir)); g = metinler.map(lambda m: say(m, _G, sinir))
        return (s - g) / (s + g).clip(lower=1)
    def deg(t, m):
        son = (t + pd.DateOffset(months=m)).replace(day=1)
        return f.asof(son) - f.asof(t.replace(day=1)) if son <= f.index[-1] else np.nan
    once = b["date"].map(lambda t: f.asof(t.replace(day=1)) - f.asof((t - pd.DateOffset(months=3)).replace(day=1)))
    d3 = b["date"].map(lambda t: deg(t, 3))
    out["ton"] = ton(b["text"].str.lower())
    low = b["text"].str.lower()
    out["bos"] = int(((low.map(lambda m: say(m, _S)) + low.map(lambda m: say(m, _G))) == 0).sum())
    out["ton_sub"] = ton(b["text"].str.lower(), False)
    out["ton_case"] = ton(b["text"])
    out["d3"] = d3
    out["kor"] = out["ton"].corr(d3)
    out["kor_once"] = out["ton"].corr(once)
    return out
'''

SETUP = {
    "tr": COMMON + '''
ulke = pd.read_csv("''' + RAW + '''wb/countries.csv")
bildiri = pd.read_csv("''' + RAW + '''fomc/statements.csv", parse_dates=["date"])
faiz = pd.read_csv("''' + RAW + '''fred/FEDFUNDS.csv", index_col=0, parse_dates=True).iloc[:, 0]
deg = list(_D)
sahin, guvercin = list(_S), list(_G)

def degisim(t, m):
    """Açıklama ayından m ay sonraki ayın ortalama federal fon oranı eksi açıklama ayının ortalaması (puan).
    FEDFUNDS aylık ortalamadır: bu, hedef aralıktaki bir kararın yönü değil, iki aylık ortalamanın farkıdır."""
    son = (t + pd.DateOffset(months=m)).replace(day=1)
    return faiz.asof(son) - faiz.asof(t.replace(day=1)) if son <= faiz.index[-1] else np.nan

print(f"ulke: {len(ulke)} ülke · bildiri: {len(bildiri)} açıklama ({bildiri['date'].min():%Y-%m} – {bildiri['date'].max():%Y-%m}) · faiz: {faiz.index[-1]:%Y-%m}'e kadar")
_R = _referans(ulke, bildiri, faiz)

def kontrol_A(Z, k_en_iyi, siluet, ari):
    Z = np.asarray(Z)
    if Z.shape != _R["Z"].shape:
        print(f"❌ Z'nin boyutu {Z.shape}, beklenen {_R['Z'].shape}: sekiz göstergenin hepsi, 157 ülke."); return
    if not np.allclose(Z, _R["Z"]):
        if np.allclose(Z, StandardScaler().fit_transform(ulke[deg])):
            print("❌ Z'de logaritma yok: önce gdppc_ppp ve inflation için np.log, sonra StandardScaler."); return
        print("❌ Z beklenenden farklı: X'te gdppc_ppp ve inflation'ın np.log'u alınmalı, sonra StandardScaler().fit_transform(X)."); return
    if int(k_en_iyi) != _R["k"]:
        if int(k_en_iyi) == _R["k_inertia"]:
            print("❌ k inertia ile seçilmiş: en iyi ulaşılabilir inertia k arttıkça artmaz, bu yüzden hep aralığın sonunu seçer. Siluet skoru en yüksek k'yı seç."); return
        print("❌ k_en_iyi beklenenden farklı: k = 2…8, KMeans(n_clusters=k, n_init=10, random_state=0), silhouette_score en yüksek k."); return
    if abs(float(siluet) - _R["sil"]) > 1e-6:
        print("❌ siluet beklenenden farklı: seçilen k için silhouette_score(Z, etiketler)."); return
    if abs(float(ari) - _R["ari"]) > 1e-6:
        print("❌ ari beklenenden farklı: seçilen k'nın etiketleriyle adjusted_rand_score(ulke['income'], etiketler)."); return
    print(f"Siluete göre seçilen k = {_R['k']} (küme büyüklükleri {_R['boy']}): siluet {_R['sil']:.3f}, ARI {_R['ari']:.3f}. Karşılaştırma: k = 3 için siluet {_R['sil3']:.3f}, ARI {_R['ari3']:.3f}. “En iyi k” seçilen ölçüte bağlıdır; denetim notunda iki çözümü tartış.")
    print(f"✅ Tüm kontroller geçti (siluete göre k = {_R['k']}, siluet {_R['sil']:.3f}, ARI {_R['ari']:.3f}). Tamamlama kodun: " + _k("''' + b64(CODES["A"]) + '''"))

def kontrol_B(ton, korelasyon):
    ton = pd.Series(np.asarray(ton, dtype=float))
    if len(ton) != len(bildiri):
        print(f"❌ ton {len(ton)} değer içeriyor; her açıklama için bir değer olmalı ({len(bildiri)})."); return
    if not np.allclose(ton.values, _R["ton"].values, equal_nan=True):
        if np.allclose(ton.values, _R["ton_sub"].values, equal_nan=True):
            print("❌ Kelimeler str.count ile sayılmış: 'increase' içindeki 'ease' de sayılıyor. re.findall(r'\\\\b' + k + r'\\\\b', metin) kullan."); return
        if np.allclose(ton.values, _R["ton_case"].values, equal_nan=True):
            print("❌ Metinler küçük harfe çevrilmemiş: str.lower()."); return
        print("❌ ton beklenenden farklı: (şahin − güvercin) / (şahin + güvercin), kelime yoksa 0; küçük harf ve kelime sınırları."); return
    if abs(float(korelasyon) - _R["kor"]) > 1e-6:
        if abs(float(korelasyon) - _R["kor_once"]) < 1e-6:
            print("❌ Faiz değişimi açıklamadan ÖNCEKİ 3 ayla hesaplanmış: sonraki 3 ay, degisim(t, 3)."); return
        print("❌ korelasyon beklenenden farklı: ton ile bildiri['date'].map(lambda t: degisim(t, 3)) arasındaki korelasyon (pandas corr)."); return
    print(f"Toplam {len(bildiri)} açıklama; 3 aylık faiz farkı hesaplanabilen {int(_R['d3'].notna().sum())}; hiç sözlük kelimesi olmayan (ton = 0, payda sıfır kuralı) {_R['bos']}.")
    print(f"✅ Tüm kontroller geçti (ortalama ton {_R['ton'].mean():.3f}, 3 aylık korelasyon {_R['kor']:.3f}). Tamamlama kodun: " + _k("''' + b64(CODES["B"]) + '''"))
''',
    "en": COMMON + '''
ctry = pd.read_csv("''' + RAW + '''wb/countries.csv")
stmt = pd.read_csv("''' + RAW + '''fomc/statements.csv", parse_dates=["date"])
ff = pd.read_csv("''' + RAW + '''fred/FEDFUNDS.csv", index_col=0, parse_dates=True).iloc[:, 0]
cols = list(_D)
hawk, dove = list(_S), list(_G)

def change(t, m):
    """The average federal funds rate of the month m months after the statement month minus the statement month's average (points).
    FEDFUNDS is a monthly average: this is the difference of two monthly averages, not the direction of a decision on the target range."""
    end = (t + pd.DateOffset(months=m)).replace(day=1)
    return ff.asof(end) - ff.asof(t.replace(day=1)) if end <= ff.index[-1] else np.nan

print(f"ctry: {len(ctry)} countries · stmt: {len(stmt)} statements ({stmt['date'].min():%Y-%m} – {stmt['date'].max():%Y-%m}) · ff: up to {ff.index[-1]:%Y-%m}")
_R = _referans(ctry, stmt, ff)

def check_A(Z, k_best, silh, ari):
    Z = np.asarray(Z)
    if Z.shape != _R["Z"].shape:
        print(f"❌ Z has shape {Z.shape}, expected {_R['Z'].shape}: all eight indicators, 157 countries."); return
    if not np.allclose(Z, _R["Z"]):
        if np.allclose(Z, StandardScaler().fit_transform(ctry[cols])):
            print("❌ Z has no logarithm: first np.log for gdppc_ppp and inflation, then StandardScaler."); return
        print("❌ Z differs from the expected one: take np.log of gdppc_ppp and inflation in X, then StandardScaler().fit_transform(X)."); return
    if int(k_best) != _R["k"]:
        if int(k_best) == _R["k_inertia"]:
            print("❌ k was chosen by inertia: the best achievable inertia does not increase as k grows, so it always picks the end of the range. Choose the k with the highest silhouette score."); return
        print("❌ k_best differs from the expected value: k = 2…8, KMeans(n_clusters=k, n_init=10, random_state=0), the k with the highest silhouette_score."); return
    if abs(float(silh) - _R["sil"]) > 1e-6:
        print("❌ silh differs from the expected value: silhouette_score(Z, labels) for the chosen k."); return
    if abs(float(ari) - _R["ari"]) > 1e-6:
        print("❌ ari differs from the expected value: adjusted_rand_score(ctry['income'], labels) with the chosen k's labels."); return
    print(f"k chosen by the silhouette = {_R['k']} (cluster sizes {_R['boy']}): silhouette {_R['sil']:.3f}, ARI {_R['ari']:.3f}. For comparison: k = 3 gives silhouette {_R['sil3']:.3f}, ARI {_R['ari3']:.3f}. The “best k” depends on the chosen criterion; discuss both solutions in your audit notes.")
    print(f"✅ All checks passed (k chosen by the silhouette = {_R['k']}, silhouette {_R['sil']:.3f}, ARI {_R['ari']:.3f}). Your completion code: " + _k("''' + b64(CODES["A"]) + '''"))

def check_B(tone, corr):
    tone = pd.Series(np.asarray(tone, dtype=float))
    if len(tone) != len(stmt):
        print(f"❌ tone has {len(tone)} values; there should be one per statement ({len(stmt)})."); return
    if not np.allclose(tone.values, _R["ton"].values, equal_nan=True):
        if np.allclose(tone.values, _R["ton_sub"].values, equal_nan=True):
            print("❌ The words were counted with str.count: the 'ease' inside 'increase' is counted too. Use re.findall(r'\\\\b' + w + r'\\\\b', text)."); return
        if np.allclose(tone.values, _R["ton_case"].values, equal_nan=True):
            print("❌ The texts were not lower-cased: str.lower()."); return
        print("❌ tone differs from the expected one: (hawkish − dovish) / (hawkish + dovish), 0 if there are no words; lower case and word boundaries."); return
    if abs(float(corr) - _R["kor"]) > 1e-6:
        if abs(float(corr) - _R["kor_once"]) < 1e-6:
            print("❌ The rate change was computed over the 3 months BEFORE the statement: use the next 3 months, change(t, 3)."); return
        print("❌ corr differs from the expected value: the correlation between tone and stmt['date'].map(lambda t: change(t, 3)) (pandas corr)."); return
    print(f"{len(stmt)} statements in total; {int(_R['d3'].notna().sum())} with a computable 3-month rate difference; {_R['bos']} with no dictionary word (tone = 0, the zero-denominator rule).")
    print(f"✅ All checks passed (average tone {_R['ton'].mean():.3f}, 3-month correlation {_R['kor']:.3f}). Your completion code: " + _k("''' + b64(CODES["B"]) + '''"))
''',
}

T = {
    "tr": dict(
        title="# ML Laboratuvarı · Modül 7, Ünite 9: Ülke kümeleri ve FOMC tonu",
        intro="""**Prof. Dr. Mehmet Songur** · ML Laboratuvarı, Modül 7

Veri: Dünya Bankası Dünya Kalkınma Göstergeleri, 157 ülkenin 2019–2023 ortalamaları (CC BY 4.0); 2002'den bu yana FOMC para politikası açıklamaları ve aylık federal fon oranı (FRED; ABD kamu malı). Kurulum hücresi `ulke`, `bildiri` ve `faiz`'i indirir; `deg`, `sahin`, `guvercin` listeleri ve `degisim(t, m)` fonksiyonu hazırdır. Kodu **Gemini'ye yazdır**, sonra **denetle**.

**Önce kopyala:** **Dosya → Drive'a kopya kaydet** ile kendi kopyanda çalış. Hücrelere başlıklarıyla başvuruyoruz: Kurulum, Görev A, Kontrol A, Görev B, Kontrol B.

**Kurallar**
1. **Kurulum** ve **Kontrol** hücrelerini değiştirme; yalnızca çalıştır.
2. Görev hücrelerinde kodu Gemini ile üret; çalıştırmadan önce oku.
3. Kontrol hücresi geçerse bir **tamamlama kodu** verir; onu ML Laboratuvarı'ndaki kutuya yapıştır.""",
        setup_title="#@title Kurulum — çalıştır, değiştirme",
        after_setup="\nulke.head(3)",
        taskA="""## Görev A — Ülke kümeleri

1. `X = ulke[deg].copy()`; `X`'te `gdppc_ppp` ve `inflation` sütunlarının `np.log`'unu al.
2. `Z = StandardScaler().fit_transform(X)`.
3. k = 2'den 8'e kadar `KMeans(n_clusters=k, n_init=10, random_state=0)` kur ve `silhouette_score(Z, etiketler)`'i hesapla. Skoru en yüksek k: `k_en_iyi`; onun skoru: `siluet`.
4. Seçilen k'nın etiketleriyle `adjusted_rand_score(ulke["income"], etiketler)`: `ari`.
5. Seçilen çözümün küme büyüklüklerine ve her kümedeki birkaç ülkeye bak.

**Denetim soruları:** Logaritma ölçeklemeden önce mi alındı? k inertia ile mi seçildi? Küme büyüklükleri makul mü?""",
        taskA_code="# Görev A: Gemini ile kodu burada üret, oku, sonra çalıştır.\n",
        checkA_md="### Kontrol A — çalıştır, değiştirme",
        checkA="kontrol_A(Z, k_en_iyi, siluet, ari)",
        taskB="""## Görev B — Ton endeksi

1. Metinleri küçük harfe çevir: `bildiri["text"].str.lower()`.
2. Her açıklamada `sahin` ve `guvercin` listelerindeki kelimeleri **kelime sınırlarıyla** say: `len(re.findall(r"\\b" + k + r"\\b", metin))`.
3. `ton = (şahin − güvercin) / (şahin + güvercin)`; iki sayı da sıfırsa ton 0 (`(s + g).clip(lower=1)` ile böl).
4. Sonraki 3 ayda faiz değişimi: `bildiri["date"].map(lambda t: degisim(t, 3))`. `ton` ile korelasyonu (pandas `corr`): `korelasyon`.
5. Tonun yıllık ortalamasını faizle yan yana koy.

**Denetim soruları:** `str.count` var mı? Değişim açıklamadan sonrasına mı bakıyor? Bu korelasyon bir öngörü kanıtı mı?""",
        taskB_code="# Görev B: Gemini ile kodu burada üret, oku, sonra çalıştır.\n",
        checkB_md="### Kontrol B — çalıştır, değiştirme",
        checkB="kontrol_B(ton, korelasyon)",
        notes="""## Denetim notların

- Gemini'nin kümeleme kodunda neyi düzeltmen gerekti?
- Siluete göre seçilen k ile k = 3'ü karşılaştır: k = 3'ün siluet skoru düşük ama gelir gruplarıyla uyumu (ARI) yüksek. Analizin iktisadi amacı değişirse hangi ölçüt önem kazanır?
- Seçtiğin küme çözümünü bir politika raporunda nasıl anlatırsın? (k, siluet, ARI, küme üyeleri, sınırlılıklar)
- Ton endeksi faizle ilişkili mi? Bu ilişki öngörü mü, yoksa kararın duyurulması mı?""",
    ),
    "en": dict(
        title="# ML Lab · Module 7, Unit 9: Country clusters and FOMC tone",
        intro="""**Prof. Dr. Mehmet Songur** · ML Lab, Module 7

Data: World Bank World Development Indicators, 2019–2023 averages for 157 countries (CC BY 4.0); FOMC monetary policy statements since 2002 and the monthly federal funds rate (FRED; US public domain). The setup cell downloads `ctry`, `stmt` and `ff`; the `cols`, `hawk`, `dove` lists and the `change(t, m)` function are ready. **Have Gemini write the code**, then **audit it**.

**Copy first:** work in your own copy via **File → Save a copy in Drive**. We refer to the cells by their titles: Setup, Task A, Check A, Task B, Check B.

**Rules**
1. Do not change the **Setup** and **Check** cells; just run them.
2. Generate code with Gemini in the task cells; read it before running.
3. If a check cell passes, it gives you a **completion code**; paste it into the box in ML Lab.""",
        setup_title="#@title Setup — run it, do not change it",
        after_setup="\nctry.head(3)",
        taskA="""## Task A — Country clusters

1. `X = ctry[cols].copy()`; take `np.log` of the `gdppc_ppp` and `inflation` columns in `X`.
2. `Z = StandardScaler().fit_transform(X)`.
3. For k from 2 to 8 fit `KMeans(n_clusters=k, n_init=10, random_state=0)` and compute `silhouette_score(Z, labels)`. The k with the highest score: `k_best`; its score: `silh`.
4. With the chosen k's labels, `adjusted_rand_score(ctry["income"], labels)`: `ari`.
5. Look at the cluster sizes of the chosen solution and a few countries in each cluster.

**Audit questions:** Was the log taken before scaling? Was k chosen by inertia? Are the cluster sizes reasonable?""",
        taskA_code="# Task A: generate the code with Gemini here, read it, then run it.\n",
        checkA_md="### Check A — run it, do not change it",
        checkA="check_A(Z, k_best, silh, ari)",
        taskB="""## Task B — Tone index

1. Lower-case the texts: `stmt["text"].str.lower()`.
2. In each statement count the words in the `hawk` and `dove` lists **with word boundaries**: `len(re.findall(r"\\b" + w + r"\\b", text))`.
3. `tone = (hawkish − dovish) / (hawkish + dovish)`; if both counts are zero the tone is 0 (divide by `(h + d).clip(lower=1)`).
4. The rate change over the next 3 months: `stmt["date"].map(lambda t: change(t, 3))`. Its correlation with `tone` (pandas `corr`): `corr`.
5. Put the annual average tone next to the rate.

**Audit questions:** Is there `str.count`? Does the change look after the statement? Is this correlation proof of forecasting?""",
        taskB_code="# Task B: generate the code with Gemini here, read it, then run it.\n",
        checkB_md="### Check B — run it, do not change it",
        checkB="check_B(tone, corr)",
        notes="""## Your audit notes

- What did you need to fix in Gemini's clustering code?
- Compare the k chosen by the silhouette with k = 3: k = 3 has a lower silhouette but higher agreement with the income groups (ARI). If the economic purpose of the analysis changes, which criterion gains importance?
- How would you present your chosen clustering in a policy report? (k, silhouette, ARI, cluster members, limitations)
- Is the tone index related to the rate? Is the relation a forecast, or the announcement of the decision?""",
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
        "modul7/09_kumeleme_ve_metin_atolyesi_tr.ipynb": workshop("tr"),
        "module7/09_clustering_and_text_workshop_en.ipynb": workshop("en"),
    }
    for rel, data in files.items():
        p = os.path.join(OUT, rel)
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=1)
        print("yazıldı:", rel)
    print("hash A:", fnv(CODES["A"]), "hash B:", fnv(CODES["B"]))
