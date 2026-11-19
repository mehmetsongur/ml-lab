/* Modül kataloğu / Module catalogue
 * Her modülün içerik dosyaları yalnızca o modül açıldığında yüklenir; ana sayfa yalnızca bu özeti kullanır.
 * Yeni modül eklemek için: content/<id>/ klasörünü oluşturup buraya bir kayıt ekleyin.
 * units / exercises / minutes alanları tests/check_catalog.js ile içerikle karşılaştırılır.
 * Each module's content files are loaded only when the module is opened; the home page uses only this summary.
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 */
(function () {
  "use strict";
  const LAB = (window.LAB = window.LAB || {});
  LAB.catalog = [
    {
      id: "m0",
      num: 0,
      title: { tr: "YZ ile Ekonomik Analize Giriş", en: "Introduction to Economic Analysis with AI" },
      summary: {
        tr: "YZ'den kod istemek, üretilen kodu okumak ve denetlemek, hataları bulmak ve sonucu ölçülü yorumlamak. Kodlama geçmişi gerekmez.",
        en: "Asking AI for code, reading and auditing what it produces, finding mistakes and interpreting results with care. No coding background needed."
      },
      topics: {
        tr: ["YZ kod asistanı ve sessiz hatalar", "Kod okuryazarlığı: Python ve pandas", "İyi istek yazmak ve doğrulama", "Hata kataloğu ve hata ayıklama", "FRED verisiyle Colab + Gemini atölyesi"],
        en: ["The AI coding assistant and silent errors", "Code literacy: Python and pandas", "Writing good prompts and verification", "Error catalogue and debugging", "Colab + Gemini workshop with FRED data"]
      },
      units: 10, exercises: 40, minutes: 404,
      workshops: [9, 10],   // Colab atölyeleri modül kilidini etkilemez / Colab workshops do not affect the module lock
      files: ["../concept-kit.js", "m0-figs.js", "m0.js", "m0-cells.js", "m0-lessons.js", "m0-ai1.js", "m0-ai2.js", "m0-concepts.js", "m0-order.js"]
    },
    {
      id: "m1",
      num: 1,
      title: { tr: "Öngörü, Nedensellik ve Veriyi Hazırlamak", en: "Prediction, Causality and Preparing Data" },
      summary: {
        tr: "Makine öğrenmesinin ekonometriden farkı, öngörü ile nedensellik, öğrenme türleri ve verinin modele hazırlanması: eksik ve olağandışı değerler, ölçekleme, kukla değişkenler.",
        en: "How machine learning differs from econometrics, prediction versus causality, types of learning, and getting data ready for a model: missing and unusual values, scaling, dummy variables."
      },
      topics: {
        tr: ["Katsayı mı, öngörü mü?", "Öngörü ve nedensellik", "Öğrenme türleri, özellik ve hedef", "Eksik ve olağandışı değerler", "Ölçekleme ve kukla değişkenler"],
        en: ["Coefficient or prediction?", "Prediction and causality", "Types of learning, features and target", "Missing and unusual values", "Scaling and dummy variables"]
      },
      units: 10, exercises: 36, minutes: 352,
      files: ["../concept-kit.js", "m1-figs.js", "m1-pg.js", "m1-data.js", "m1-a.js", "m1-b.js", "m1-concepts.js", "m1-order.js"]
    },
    {
      id: "m2",
      num: 2,
      title: { tr: "Model Başarısı: Ezberlemek ve Öğrenmek", en: "Model Performance: Memorising and Learning" },
      summary: {
        tr: "Bir model ne kadar iyi? Hatayı ölçmek, eğitim ve test verisi, aşırı uyum, yanlılık ve varyans, çapraz doğrulama, veri sızıntısı ve zaman serisinde doğru değerlendirme.",
        en: "How good is a model? Measuring error, training and test data, overfitting, bias and variance, cross-validation, data leakage and honest evaluation with time series."
      },
      topics: {
        tr: ["Hata ölçüleri (FRED işsizlik verisi)", "Eğitim ve test, aşırı uyum", "Yanlılık ve varyans", "Çapraz doğrulama ve veri sızıntısı", "Zaman serisinde doğrulama"],
        en: ["Error measures (FRED unemployment data)", "Training and test, overfitting", "Bias and variance", "Cross-validation and data leakage", "Validation with time series"]
      },
      units: 9, exercises: 30, minutes: 340,
      files: ["../m1/m1-pg.js", "m2-pg.js", "m2-figs.js", "m2-data.js", "m2-a.js", "m2-b.js", "m2-concepts.js", "m2-order.js"]
    },
    {
      id: "m3",
      num: 3,
      title: { tr: "Regresyon ve Düzenlileştirme: Enflasyonu Öngörmek", en: "Regression and Regularisation: Forecasting Inflation" },
      summary: {
        tr: "Çok sayıda aday değişkenle öngörü: EKK'nın sınırları, Ridge ve Lasso, λ'yı çapraz doğrulamayla seçmek ve 13 FRED serisiyle ABD enflasyonunu öngörmek.",
        en: "Forecasting with many candidate variables: the limits of OLS, Ridge and Lasso, choosing λ by cross-validation and forecasting US inflation with 13 FRED series."
      },
      topics: {
        tr: ["EKK ile öngörü ve test R²", "Çok değişken, az gözlem", "Ridge ve Lasso", "λ seçimi ve Lasso'nun sınırları", "FRED verisiyle enflasyon öngörüsü"],
        en: ["Prediction with OLS and test R²", "Many variables, few observations", "Ridge and Lasso", "Choosing λ and the limits of Lasso", "Inflation forecasting with FRED data"]
      },
      units: 9, exercises: 35, minutes: 355,
      files: ["../concept-kit.js", "m3-figs.js", "m3-pg.js", "m3-data.js", "m3-a.js", "m3-b.js", "m3-concepts.js", "m3-order.js"]
    },
    {
      id: "m4",
      num: 4,
      title: { tr: "Sınıflandırma: Kredi Riskini Öngörmek", en: "Classification: Predicting Credit Risk" },
      summary: {
        tr: "Temerrüt olasılığını öngörmek ve karara çevirmek: lojistik regresyon, karışıklık matrisi, ROC ve AUC, maliyete göre eşik, dengesiz veri ve Tayvan kart verisiyle kredi riski.",
        en: "Predicting the probability of default and turning it into a decision: logistic regression, the confusion matrix, ROC and AUC, cost-based thresholds, imbalanced data and credit risk with Taiwanese card data."
      },
      topics: {
        tr: ["Lojistik regresyon ve odds oranı", "Eşik ve karışıklık matrisi", "Duyarlılık, kesinlik, ROC ve AUC", "Maliyete göre eşik ve dengesiz veri", "Gerçek kart verisiyle kredi riski"],
        en: ["Logistic regression and odds ratios", "Threshold and confusion matrix", "Recall, precision, ROC and AUC", "Cost-based thresholds and imbalanced data", "Credit risk with real card data"]
      },
      units: 9, exercises: 37, minutes: 350,
      files: ["../concept-kit.js", "m4-figs.js", "m4-pg.js", "m4-data.js", "m4-a.js", "m4-b.js", "m4-concepts.js", "m4-order.js"]
    },
    {
      id: "m5",
      num: 5,
      title: { tr: "Ağaçlar, Topluluklar ve Açıklanabilirlik", en: "Trees, Ensembles and Explainability" },
      summary: {
        tr: "Doğrusal olmayan riski yakalamak ve açıklamak: karar ağaçları, aşırı uyum ve kararsızlık, rassal orman, boosting, SHAP ve Tayvan kart verisinde lojistik regresyonla karşılaştırma.",
        en: "Capturing and explaining nonlinear risk: decision trees, overfitting and instability, random forests, boosting, SHAP, and a comparison with logistic regression on Taiwanese card data."
      },
      topics: {
        tr: ["Karar ağaçları: eşik, etkileşim, U biçimi", "Derinlik, aşırı uyum ve kararsızlık", "Bagging ve rassal orman", "Boosting: öğrenme oranı ve ağaç sayısı", "SHAP ile açıklama ve sınırları"],
        en: ["Decision trees: threshold, interaction, U shape", "Depth, overfitting and instability", "Bagging and random forests", "Boosting: learning rate and number of trees", "Explanation with SHAP and its limits"]
      },
      units: 9, exercises: 35, minutes: 340,
      files: ["../concept-kit.js", "m5-figs.js", "m5-pg.js", "m5-data.js", "m5-a.js", "m5-b.js", "m5-concepts.js", "m5-order.js"]
    },
    {
      id: "m6",
      num: 6,
      title: { tr: "Finansal Zaman Serileri: Kur Getirileri ve Zamana Saygılı Doğrulama", en: "Financial Time Series: Exchange-Rate Returns and Time-Respecting Validation" },
      summary: {
        tr: "Euro/dolar günlük verisiyle getiri ve risk: zamansal sızıntı, TimeSeriesSplit ve yürüyen pencere, getirinin öngörülemezliği, volatilite öngörüsü, al-sat kurallarının tuzakları ve riske maruz değer.",
        en: "Returns and risk with daily euro/dollar data: temporal leakage, TimeSeriesSplit and walk-forward, the unpredictability of returns, volatility forecasting, the traps of trading rules, and value at risk."
      },
      topics: {
        tr: ["Fiyat değil getiri; kalın kuyruklar", "Zamansal sızıntı ve TimeSeriesSplit", "Getiri öngörülebilir mi?", "Volatilite öngörüsü (HAR)", "Al-sat kuralları ve VaR"],
        en: ["Returns, not prices; fat tails", "Temporal leakage and TimeSeriesSplit", "Are returns predictable?", "Volatility forecasting (HAR)", "Trading rules and VaR"]
      },
      units: 9, exercises: 35, minutes: 355,
      files: ["../concept-kit.js", "m6-figs.js", "m6-pg.js", "m6-data.js", "m6-a.js", "m6-b.js", "m6-concepts.js", "m6-order.js"]
    },
    {
      id: "m7",
      num: 7,
      title: { tr: "Gözetimsiz Öğrenme ve Metin: Ülkeler, Getiri Eğrisi ve Fed Açıklamaları", en: "Unsupervised Learning and Text: Countries, the Yield Curve and Fed Statements" },
      summary: {
        tr: "Dünya Bankası ülke verisi, ABD getiri eğrisi ve FOMC açıklamalarıyla: k-ortalamalar, küme sayısı seçimi, PCA, TF-IDF, sözlükle ton endeksi, konu modelleri ve büyük dil modelleriyle metin sınıflandırmanın denetimi.",
        en: "With World Bank country data, the US yield curve and FOMC statements: k-means, choosing the number of clusters, PCA, TF-IDF, a dictionary tone index, topic models and auditing text classification with large language models."
      },
      topics: {
        tr: ["k-ortalamalar ve ölçekleme", "Küme sayısı ve aykırı değerler", "PCA: getiri eğrisi ve ülke haritası", "TF-IDF ve sözlükle ton", "Konu modelleri, metin sınıflandırma ve LLM"],
        en: ["k-means and scaling", "Number of clusters and outliers", "PCA: yield curve and country map", "TF-IDF and dictionary tone", "Topic models, text classification and LLMs"]
      },
      units: 9, exercises: 37, minutes: 350,
      files: ["../concept-kit.js", "m7-figs.js", "m7-pg.js", "m7-data.js", "m7-a.js", "m7-b.js", "m7-concepts.js", "m7-order.js"]
    }
  ];
})();
