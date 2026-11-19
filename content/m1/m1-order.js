/* Modül 1 — kayıt, bölümler ve modül tanıtımı
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 */
(function () {
  "use strict";
  const units = window.M1_UNITS || [];
  const ids = (arr) => arr.map((u) => u.id);
  window.LAB.registerModule({
    id: "m1",
    num: 1,
    title: { tr: "Öngörü, Nedensellik ve Veriyi Hazırlamak", en: "Prediction, Causality and Preparing Data" },
    summary: {
      tr: "Makine öğrenmesinin ekonometriden farkı, öngörü ile nedenselliğin ayrımı, öğrenme türleri ve verinin modele hazırlanması: eksik ve olağandışı değerler, ölçekleme, kukla değişkenler.",
      en: "How machine learning differs from econometrics, prediction versus causality, types of learning, and getting data ready for a model: missing and unusual values, scaling, dummy variables."
    },
    intro: {
      tr: "<p>Bu modülde iki şey öğreneceksin. Önce makine öğrenmesinin hangi soruyu sorduğunu: katsayıyı değil öngörüyü, nedenselliği değil tahmini. Sonra bir veri tablosunu modele hazırlamayı: hedefi ve özellikleri ayırmayı, eksik ve olağandışı değerleri görmeyi ve doğru ele almayı, değişkenleri ölçeklemeyi, kategorileri kukla değişkenlere çevirmeyi.</p><p>Modül 0'daki yöntemle çalışmaya devam ediyoruz: YZ kodu yazar, sen denetlersin. Alıştırmalardaki YZ yanıtları öğretim amacıyla hazırlanmıştır ve veri hazırlamada sık görülen sessiz hataları içerir. Son ünitede aynı adımları gerçek veriyle (FRED) Google Colab ve Gemini ile uygulayacaksın.</p>",
      en: "<p>In this module you will learn two things. First, what question machine learning asks: prediction rather than coefficients, forecasting rather than causality. Then, how to get a data table ready for a model: separating target and features, spotting and properly handling missing and unusual values, scaling variables and turning categories into dummy variables.</p><p>We keep working with the Module 0 method: the AI writes the code, you audit it. The AI answers in the exercises were prepared for teaching and contain silent errors that are common in data preparation. In the last unit you will apply the same steps to real data (FRED) with Google Colab and Gemini.</p>"
    },
    lessons: units,
    sections: [
      { title: { tr: "Temel kavramlar", en: "Core ideas" }, ids: ids(units.slice(0, 4)) },
      { title: { tr: "Veriyi hazırlamak", en: "Preparing data" }, ids: ids(units.slice(4, 9)) },
      { title: { tr: "Uygulama", en: "Practice" }, ids: ids(units.slice(9, 10)) }
    ],
    required: ids(units)
  });
})();
