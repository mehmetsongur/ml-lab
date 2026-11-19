# ML Laboratuvarı · ML Lab

**Ekonomi ve Finansta Makine Öğrenmesi** dersi için tarayıcıda çalışan, kurulumsuz bir kendi kendine öğrenme ortamı.
A no-install, in-browser self-study lab for the course **Machine Learning in Economics and Finance**.

**▶ Laboratuvarı aç / Open the lab:** https://www.songurmehmet.com/ml-lab/ · Colab notebook'ları / notebooks: [notebooks/](notebooks/) · Ders / Course: [Machine-Learning-in-Economics-and-Finance](https://github.com/mehmetsongur/Machine-Learning-in-Economics-and-Finance)

🇹🇷 [Türkçe](#türkçe) · 🇬🇧 [English](#english)

---

## Türkçe

Ekonomi ve finansla ilgilenen, daha önce hiç kod yazmamış herkesin kendi başına çalışabileceği bir ortam. Dersin öğrencileri için geliştirildi, ama herkese açıktır. Her ders dört adımdan oluşur:

Yöntem: **Tarif et → Ürettir → Denetle → Yorumla.** Öğrenci kodu YZ'ye yazdırır, YZ'nin kodunu okuyup denetler, hatalarını bulup düzeltir ve sonucu sınırlarıyla yorumlar. Alıştırma türleri: YZ kodunu denetle, iki yanıtı karşılaştır, isteği güçlendir, kontrol yaz, yorumu denetle, Colab + Gemini görevi, denetim defteri. Örnek YZ yanıtları öğretim amacıyla hazırlanmıştır ve sitede bu şekilde etiketlenir. Colab notebook'ları `notebooks/` klasöründedir.

Her ünite dört adımdan oluşur:

1. **Kavram:** kısa açıklama ve bir iktisat örneği
2. **Oyun alanı:** kod yazmadan, kaydırıcılarla deneme
3. **Kod laboratuvarı:** tarayıcıda çalışan gerçek Python (Pyodide); otomatik kontrol, kademeli ipucu, çözüm
4. **Kendini sına:** kısa test

Python, [Pyodide](https://pyodide.org) sayesinde doğrudan tarayıcıda çalışır; numpy, pandas ve matplotlib kullanılabilir. İlerleme yalnızca öğrencinin tarayıcısında saklanır; sunucu, hesap ya da veri toplama yoktur.

### Modüller

| Modül | Konu | Durum |
|:--:|---|:--:|
| 0 | **YZ ile Ekonomik Analize Giriş** (10 ünite, 40 alıştırma): YZ'ye kod yazdırmak, denetlemek ve yorumlamak; Colab + Gemini atölyeleri. Ek: 14 derslik isteğe bağlı Python pratiği | ✅ |
| 1 | **Öngörü, Nedensellik ve Veriyi Hazırlamak** (10 ünite, 36 alıştırma): MÖ ile ekonometrinin farkı (β̂ ve ŷ), öngörü ve nedensellik, öğrenme türleri, özellik ve hedef, eksik ve olağandışı değerler, ölçekleme, kukla değişkenler; FRED verisiyle Colab + Gemini atölyesi | ✅ |
| 2 | **Model Başarısı: Ezberlemek ve Öğrenmek** (9 ünite, 30 alıştırma): hata ölçüleri, eğitim ve test verisi, aşırı uyum, yanlılık ve varyans, çapraz doğrulama, veri sızıntısı, zaman serisinde doğrulama; FRED işsizlik verisiyle Colab + Gemini atölyesi | ✅ |
| 3 | **Regresyon ve Düzenlileştirme: Enflasyonu Öngörmek** (9 ünite, 35 alıştırma): EKK ile öngörü ve test R², çok değişkenin bedeli, Ridge ve Lasso, λ'yı çapraz doğrulamayla seçmek, Lasso'nun sınırları; 13 FRED serisiyle ABD enflasyon öngörüsü ve Colab + Gemini atölyesi | ✅ |
| 4 | **Sınıflandırma: Kredi Riskini Öngörmek** (9 ünite, 37 alıştırma): lojistik regresyon ve odds oranı, eşik ve karışıklık matrisi, duyarlılık ve kesinlik, ROC ve AUC, maliyete göre eşik, dengesiz veri; Tayvan kart müşterileri verisiyle (UCI) kredi riski ve Colab + Gemini atölyesi | ✅ |
| 5 | **Ağaçlar, Topluluklar ve Açıklanabilirlik** (9 ünite, 35 alıştırma): karar ağaçları, derinlik ve aşırı uyum, kararsızlık, bagging ve rassal orman, boosting, SHAP ile açıklama ve sınırları; Tayvan kart verisinde lojistik regresyonla karşılaştırma ve Colab + Gemini atölyesi (boosting + SHAP) | ✅ |
| 6 | **Finansal Zaman Serileri: Kur Getirileri ve Zamana Saygılı Doğrulama** (9 ünite, 35 alıştırma): euro/dolar günlük verisiyle (FRED) fiyat ve getiri, kalın kuyruklar, zamansal sızıntı, TimeSeriesSplit ve yürüyen pencere, getirinin öngörülemezliği, volatilite öngörüsü (HAR), al-sat kurallarının tuzakları, riske maruz değer; sterlin/dolar ile Colab + Gemini atölyesi | ✅ |
| 7 | **Gözetimsiz Öğrenme ve Metin: Ülkeler, Getiri Eğrisi ve Fed Açıklamaları** (9 ünite, 37 alıştırma): Dünya Bankası verisiyle 157 ülkenin k-ortalamalarla kümelenmesi, ölçekleme, küme sayısı ve aykırı değerler; ABD getiri eğrisinin PCA'sı (düzey, eğim, eğrilik) ve ülke haritası; 201 FOMC açıklamasıyla kelime torbası, TF-IDF, sözlükle şahin/güvercin tonu, NMF konu modelleri, metin sınıflandırma ve LLM etiketlerinin denetimi; Colab + Gemini atölyesi | ✅ |

### Çalıştırma

Statik bir sitedir; derleme adımı yoktur.

```bash
python3 -m http.server 8000
# tarayıcıda: http://localhost:8000
```

GitHub Pages'te yayımlamak için depoyu açıp **Settings → Pages → Deploy from a branch** seçmek yeterlidir. Dil `?lang=tr` / `?lang=en` ile seçilebilir.

### Hesap ve ilerleme

Laboratuvar hesapsız çalışır; ilerleme tarayıcıda saklanır. Yalnızca [songurmehmet.com/ml-lab](https://www.songurmehmet.com/ml-lab/index.html) kopyasında ana sayfa herkese açıktır, modül ve derslere girmek için giriş gerekir (e-posta veya Google, Wix üyelik altyapısı). Giriş yapanın ad-soyadı, e-postası ve ünite ilerlemesi buluta kaydedilir ve cihazlar arasında birleştirilir. Bu kopyada modüller sırayla açılır: bir modül, öncekinin zorunlu üniteleri (Colab atölyeleri hariç) bitince açılır. Kod `assets/auth.js` ve `giris.html` içindedir; başka adreslerde (GitHub Pages, kendi kopyanız) hiçbir şey yapmaz.

### Yeni modül eklemek

Site tek sayfadır; her modülün içeriği `content/<modül>/` klasöründedir ve yalnızca o modül açıldığında yüklenir. Modüller `content/catalog.js` dosyasında listelenir. Modül 0'ın üniteleri `content/m0/m0-ai1.js` ve `m0-ai2.js`, sıralama ve bölümler `m0-order.js`, isteğe bağlı Python pratiği `m0.js`, `m0-cells.js` ve `m0-lessons.js` dosyalarındadır. Yeni modül eklemek için `content/<id>/` klasörü oluşturulur, dosyalardan biri `LAB.registerModule({...})` çağırır ve modül kataloğa eklenir. Colab notebook'ları `notebooks/` klasöründedir. Tarayıcıdaki alıştırmaların kullandığı FRED verileri `data/fred/` klasöründedir ve GitHub Actions ile her ay otomatik güncellenir (`.github/workflows/fred-data.yml`). Modül 4 ve 5'in kredi verisi `data/credit/` klasöründedir (UCI, CC BY 4.0). Modül 7'nin ülke verisi `data/wb/` (Dünya Bankası, CC BY 4.0), FOMC açıklamaları `data/fomc/` (ABD kamu malı) klasöründedir; ikisi de `.github/workflows/m7-data.yml` ile her ay yenilenir. Bir hücrenin yapısı:

```js
{
  id: "m0-l3-c3",            // benzersiz kimlik (ilerleme bu kimlikle saklanır)
  kind: "fill",              // "run" | "fill" | "edit" | "debug" | "challenge"
  task: { tr: "...", en: "..." },
  code: { tr: "...___...", en: "..." },     // ___ = öğrencinin dolduracağı boşluk
  solution: { tr: "...", en: "..." },
  hints: [{ tr: "...", en: "..." }],
  predict: { q, options, answer, explain }, // isteğe bağlı: "önce tahmin et"
  checks: [{ py: "python ifadesi", msg: { tr: "...", en: "..." } }],
  after: { tr: "...", en: "..." }           // başarıdan sonra gösterilen not
}
```

`checks` içindeki ifadeler hücrenin ad alanında değerlendirilir; `_out` hücrenin yazdırdığı metni, `_figs` çizilen grafiklerin özelliklerini (başlık, eksen adları, çizgi sayısı, lejant) içerir. Oyun alanı bileşenleri `assets/playgrounds.js` içindedir.

### Doğrulama

Tüm çözümler ve kontroller CPython ile otomatik test edilir (`tests/`): her alıştırmanın çözümü çalıştırılır ve tüm kontrollerin geçtiği doğrulanır; "hatayı bul" ve "meydan okuma" alıştırmalarında başlangıç kodunun kontrolleri geçmediği de sınanır.

### Lisans

© 2026 Prof. Dr. Mehmet Songur. **Kod** (platformun yapısı: `index.html`, `assets/`, oyun alanları, `tools/`, `tests/`): [PolyForm Strict 1.0.0](LICENSE-CODE.md) — ticari olmayan amaçlarla okunabilir ve çalıştırılabilir; kopyalanıp dağıtılamaz, değiştirilemez. **İçerik** (ders metinleri, alıştırmalar, şekiller, notebook'lar): [CC BY-NC-SA 4.0](LICENSE-CONTENT.txt) — ad verilerek, ticari olmayan amaçlarla paylaşılabilir ve uyarlanabilir. Ayrıntılar: [LICENSE](LICENSE). Ticari kullanım için izin gerekir. Dahil edilen üçüncü taraf yazılım: CodeMirror 5 (MIT, `assets/vendor/CODEMIRROR_LICENSE`). Pyodide çalışma anında jsDelivr CDN'den yüklenir (MPL-2.0).

Ders örneklerindeki veriler (ör. "Örnekistan", simüle TÜFE) **kurgusaldır**, gerçek bir ekonomiyi temsil etmez.

---

## English

A place where anyone interested in economics and finance who has never written code can study alone. It was built for the course's students but is open to everyone. Every lesson has four steps:

Method: **Specify → Generate → Audit → Interpret.** Learners have AI write the code, read and audit it, find and fix its mistakes, and interpret the result with its limits. Exercise types: audit the AI's code, compare two answers, strengthen the prompt, write a check, audit the interpretation, Colab + Gemini task, audit log. Sample AI answers are prepared for teaching and labelled as such on the site. The Colab notebooks live in the `notebooks/` folder.

Every unit has four steps:

1. **Idea:** a short explanation with an economics example
2. **Playground:** try it with sliders, no code
3. **Code lab:** real Python running in the browser (Pyodide), with automatic checks, step-by-step hints and solutions
4. **Check yourself:** a short quiz

Python runs directly in the browser via [Pyodide](https://pyodide.org); numpy, pandas and matplotlib are available. Progress is stored only in the student's browser: no server, no account, no data collection.

### Modules

| Module | Topic | Status |
|:--:|---|:--:|
| 0 | **Introduction to Economic Analysis with AI** (10 units, 40 exercises): having AI write code, auditing it and interpreting results; Colab + Gemini workshops. Appendix: optional 14-lesson Python practice | ✅ |
| 1 | **Prediction, Causality and Preparing Data** (10 units, 36 exercises): how ML differs from econometrics (β̂ and ŷ), prediction and causality, types of learning, features and target, missing and unusual values, scaling, dummy variables; Colab + Gemini workshop with FRED data | ✅ |
| 2 | **Model Performance: Memorising and Learning** (9 units, 30 exercises): error measures, training and test data, overfitting, bias and variance, cross-validation, data leakage, validation with time series; Colab + Gemini workshop with FRED unemployment data | ✅ |
| 3 | **Regression and Regularisation: Forecasting Inflation** (9 units, 35 exercises): prediction with OLS and test R², the cost of many variables, Ridge and Lasso, choosing λ by cross-validation, the limits of Lasso; US inflation forecasting with 13 FRED series and a Colab + Gemini workshop | ✅ |
| 4 | **Classification: Predicting Credit Risk** (9 units, 37 exercises): logistic regression and odds ratios, threshold and confusion matrix, recall and precision, ROC and AUC, cost-based thresholds, imbalanced data; credit risk with Taiwanese card customer data (UCI) and a Colab + Gemini workshop | ✅ |
| 5 | **Trees, Ensembles and Explainability** (9 units, 35 exercises): decision trees, depth and overfitting, instability, bagging and random forests, boosting, explanation with SHAP and its limits; a comparison with logistic regression on Taiwanese card data and a Colab + Gemini workshop (boosting + SHAP) | ✅ |
| 6 | **Financial Time Series: Exchange-Rate Returns and Time-Respecting Validation** (9 units, 35 exercises): with daily euro/dollar data (FRED), prices and returns, fat tails, temporal leakage, TimeSeriesSplit and walk-forward, the unpredictability of returns, volatility forecasting (HAR), the traps of trading rules, value at risk; a Colab + Gemini workshop with sterling/dollar | ✅ |
| 7 | **Unsupervised Learning and Text: Countries, the Yield Curve and Fed Statements** (9 units, 37 exercises): k-means clustering of 157 countries with World Bank data, scaling, the number of clusters and outliers; PCA of the US yield curve (level, slope, curvature) and a country map; with 201 FOMC statements, bag of words, TF-IDF, a dictionary hawkish/dovish tone, NMF topic models, text classification and auditing LLM labels; a Colab + Gemini workshop | ✅ |

### Account and progress

The lab works without an account; progress is kept in the browser. Only the copy at [songurmehmet.com/ml-lab](https://www.songurmehmet.com/ml-lab/index.html) keeps the home page open and asks for a login to open modules and lessons (email or Google, via Wix members). For logged-in learners, name, email and unit progress are saved to the cloud and merged across devices. On this copy modules open in order: a module unlocks once the previous module's required units (excluding the Colab workshops) are done. The code lives in `assets/auth.js` and `giris.html`; on any other host (GitHub Pages, your own copy) it does nothing.

### Running locally

It is a static site with no build step.

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

To publish on GitHub Pages, enable **Settings → Pages → Deploy from a branch**. Choose the language with `?lang=tr` / `?lang=en`.

### Adding a module

The site is a single page; each module's content lives in `content/<module>/` and is loaded only when that module is opened. Modules are listed in `content/catalog.js`. To add a module, create `content/<id>/`, have one of its files call `LAB.registerModule({...})` and add it to the catalogue. Colab notebooks live in `notebooks/`. The FRED data used by the in-browser exercises are in `data/fred/` and are updated automatically every month by GitHub Actions (`.github/workflows/fred-data.yml`). The credit data for Modules 4 and 5 are in `data/credit/` (UCI, CC BY 4.0). Module 7's country data are in `data/wb/` (World Bank, CC BY 4.0) and the FOMC statements in `data/fomc/` (US public domain); both are refreshed monthly by `.github/workflows/m7-data.yml`. See the cell schema in the Turkish section above; all text fields take `{ tr, en }`. Check expressions are evaluated in the cell's namespace, where `_out` holds the printed text and `_figs` describes the charts drawn (title, axis labels, number of lines, legend).

### License

© 2026 Prof. Dr. Mehmet Songur. **Code** (the platform: `index.html`, `assets/`, playgrounds, `tools/`, `tests/`): [PolyForm Strict 1.0.0](LICENSE-CODE.md) — may be read and run for noncommercial purposes; may not be copied for distribution or changed. **Content** (lesson texts, exercises, figures, notebooks): [CC BY-NC-SA 4.0](LICENSE-CONTENT.txt) — may be shared and adapted with attribution for noncommercial purposes. Details: [LICENSE](LICENSE). Commercial use requires permission. Bundled third-party software: CodeMirror 5 (MIT). Pyodide is loaded at runtime from the jsDelivr CDN (MPL-2.0).

Data in the lesson examples (e.g. "Exampleland", the simulated CPI) are **fictional** and do not represent a real economy.

---

**Prof. Dr. Mehmet Songur** · [songurmehmet.com](https://www.songurmehmet.com)
