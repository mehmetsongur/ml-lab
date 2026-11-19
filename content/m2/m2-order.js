/* Modül 2 — kayıt, bölümler ve modül tanıtımı
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 */
(function () {
  "use strict";
  const units = window.M2_UNITS || [];
  const ids = (arr) => arr.map((u) => u.id);
  window.LAB.registerModule({
    id: "m2",
    num: 2,
    title: { tr: "Model Başarısı: Ezberlemek ve Öğrenmek", en: "Model Performance: Memorising and Learning" },
    summary: {
      tr: "Bir model ne kadar iyi? Hatayı ölçmek, eğitim ve test verisi, aşırı uyum, yanlılık ve varyans, çapraz doğrulama, veri sızıntısı ve zaman serisinde doğru değerlendirme.",
      en: "How good is a model? Measuring error, training and test data, overfitting, bias and variance, cross-validation, data leakage and honest evaluation with time series."
    },
    intro: {
      tr: "<p>Bu modülün sorusu tek: <b>bir model ne kadar iyi?</b> Yanıtı bulmak sanıldığından zor, çünkü bir modelin kurulduğu verideki başarısı yeni verideki başarısını söylemez. Hatayı ölçmeyi, modeli görmediği veride sınamayı, ezberleyen modeli öğrenen modelden ayırmayı, test verisine dokunmadan model seçmeyi ve sonucu sessizce iyimser yapan sızıntıları yakalamayı öğreneceksin.</p><p>Esneklik ve yanlılık–varyans ünitelerinde dersin 3. haftasındaki ücret–deneyim simülasyonunu kullanıyoruz; gerçek ilişkiyi bildiğimiz için hatayı tam ölçebiliyoruz. Hata ölçüleri, sızıntı ve zaman serisi ünitelerinde ise <b>gerçek veriyle</b> (FRED: ABD işsizlik oranı) çalışıyoruz. Son ünitede bir öngörüyü Google Colab ve Gemini ile dürüstçe değerlendireceksin.</p>",
      en: "<p>This module asks a single question: <b>how good is a model?</b> Answering it is harder than it looks, because a model's success on the data it was built on says nothing about its success on new data. You will learn to measure error, test a model on data it has not seen, tell a memorising model from a learning one, choose a model without touching the test data, and catch the leaks that silently make results optimistic.</p><p>In the units on flexibility and bias–variance we use the wage–experience simulation from week 3 of the course; because we know the true relationship we can measure error exactly. In the units on error measures, leakage and time series we work with <b>real data</b> (FRED: the US unemployment rate). In the last unit you will evaluate a forecast honestly with Google Colab and Gemini.</p>"
    },
    lessons: units,
    sections: [
      { title: { tr: "Hatayı ölçmek", en: "Measuring error" }, ids: ids(units.slice(0, 2)) },
      { title: { tr: "Esneklik ve genelleme", en: "Flexibility and generalisation" }, ids: ids(units.slice(2, 5)) },
      { title: { tr: "Doğru değerlendirme", en: "Honest evaluation" }, ids: ids(units.slice(5, 8)) },
      { title: { tr: "Uygulama", en: "Practice" }, ids: ids(units.slice(8, 9)) }
    ],
    required: ids(units)
  });
})();
