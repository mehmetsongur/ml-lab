/* Modül 3 — kayıt, bölümler ve modül tanıtımı
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 */
(function () {
  "use strict";
  const units = window.M3_UNITS || [];
  const ids = (arr) => arr.map((u) => u.id);
  window.LAB.registerModule({
    id: "m3",
    num: 3,
    title: { tr: "Regresyon ve Düzenlileştirme: Enflasyonu Öngörmek", en: "Regression and Regularisation: Forecasting Inflation" },
    summary: {
      tr: "EKK'yı öngörü aracı olarak kullanmak, çok değişkenin bedeli, Ridge ve Lasso, λ'yı çapraz doğrulamayla seçmek ve gerçek FRED verisiyle enflasyon öngörüsü.",
      en: "Using OLS as a prediction tool, the cost of many variables, Ridge and Lasso, choosing λ by cross-validation and inflation forecasting with real FRED data."
    },
    intro: {
      tr: "<p>Bu modülün sorusu: <b>çok sayıda aday değişken varken iyi bir öngörü modeli nasıl kurulur?</b> Ekonometriden bildiğin doğrusal regresyonu bir öngörü aracı olarak kullanacak, değişken sayısı arttıkça neden bozulduğunu görecek ve katsayılara ceza keserek bu sorunu çözen iki yöntemi öğreneceksin: Ridge ve Lasso. Ceza gücünü (λ) test verisine dokunmadan, çapraz doğrulamayla seçeceksin.</p><p>İlk altı ünitede dersin 4. haftasındaki 40 değişkenli ücret dünyasını kullanıyoruz: gerçekte yalnızca 5 değişken etkili, gerisi ilgisiz. Gerçek ilişkiyi bildiğimiz için yöntemlerin doğruyu ne kadar bulduğunu ölçebiliyoruz. Son üç ünitede <b>gerçek veriyle</b> çalışıyoruz: 13 FRED serisinden 51 aday özellikle ABD'de gelecek ayın yıllık enflasyonunu öngöreceksin. Son ünitede aynı analizi Google Colab ve Gemini ile yapacaksın.</p>",
      en: "<p>This module's question: <b>how do you build a good forecasting model when there are many candidate variables?</b> You will use the linear regression you know from econometrics as a prediction tool, see why it breaks down as the number of variables grows, and learn two methods that fix this by penalising the coefficients: Ridge and Lasso. You will choose the penalty strength (λ) by cross-validation, without touching the test data.</p><p>The first six units use the 40-variable wage world from week 4 of the course: in truth only 5 variables matter and the rest are irrelevant. Because we know the true relationship, we can measure how well each method finds it. The last three units work with <b>real data</b>: with 51 candidate features from 13 FRED series you will forecast next month's annual inflation in the US. In the last unit you will do the same analysis with Google Colab and Gemini.</p>"
    },
    lessons: units,
    sections: [
      { title: { tr: "Doğrusal regresyonla öngörü", en: "Prediction with linear regression" }, ids: ids(units.slice(0, 2)) },
      { title: { tr: "Katsayılara ceza", en: "Penalising coefficients" }, ids: ids(units.slice(2, 6)) },
      { title: { tr: "Uygulama: enflasyon", en: "Application: inflation" }, ids: ids(units.slice(6, 9)) }
    ],
    required: ids(units)
  });
})();
