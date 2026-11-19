/* Modül 4 — kayıt, bölümler ve modül tanıtımı
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 */
(function () {
  "use strict";
  const units = window.M4_UNITS || [];
  const ids = (arr) => arr.map((u) => u.id);
  window.LAB.registerModule({
    id: "m4",
    num: 4,
    title: { tr: "Sınıflandırma: Kredi Riskini Öngörmek", en: "Classification: Predicting Credit Risk" },
    summary: {
      tr: "Lojistik regresyon, olasılıktan karara geçiş, karışıklık matrisi, ROC ve AUC, maliyete göre eşik, dengesiz veri ve gerçek kart verisiyle kredi riski.",
      en: "Logistic regression, from probability to decision, the confusion matrix, ROC and AUC, cost-based thresholds, imbalanced data and credit risk with real card data."
    },
    intro: {
      tr: "<p>Bu modülün sorusu: <b>bir kredi başvurusunun temerrüde düşme olasılığı nasıl öngörülür ve bu olasılık nasıl bir karara çevrilir?</b> Hedef artık bir sayı değil, bir sınıf: öder ya da ödemez. Önce olasılığı 0–1 arasında tutan lojistik regresyonu öğrenecek, sonra olasılığı bir eşikle karara çevirecek ve kararların dört olası sonucunu ölçeceksin. Doğruluğun neden yanıltıcı olduğunu, ROC eğrisini ve AUC'yi, eşiği hataların maliyetine göre seçmeyi ve temerrüdün nadir olduğu durumları göreceksin.</p><p>İlk yedi ünitede dersin 5. haftasındaki benzetilmiş kredi dünyasını kullanıyoruz: gerçek temerrüt olasılıklarını bildiğimiz için modelin ne kadar iyi olduğunu ölçebiliyoruz. Son iki ünitede <b>gerçek veriyle</b> çalışıyoruz: Tayvan'da 30.000 kredi kartı müşterisinin altı aylık ödeme geçmişinden ertesi ayın temerrüdünü öngöreceksin. Son ünitede aynı analizi Google Colab ve Gemini ile yapacaksın. Karar ağaçları ve rastgele ormanlar Modül 5'te.</p>",
      en: "<p>This module's question: <b>how do you predict the probability that a loan application defaults, and how do you turn that probability into a decision?</b> The target is no longer a number but a class: pays or does not pay. You will first learn logistic regression, which keeps the probability between 0 and 1, then turn the probability into a decision with a threshold and measure the four possible outcomes of decisions. You will see why accuracy misleads, the ROC curve and AUC, choosing the threshold by the cost of errors, and situations where default is rare.</p><p>The first seven units use the simulated credit world from week 5 of the course: because we know the true default probabilities, we can measure how good the model is. The last two units work with <b>real data</b>: from 30,000 Taiwanese credit card customers' six-month payment histories you will predict next month's default. In the last unit you will do the same analysis with Google Colab and Gemini. Decision trees and random forests come in Module 5.</p>"
    },
    lessons: units,
    sections: [
      { title: { tr: "Olasılık modeli", en: "The probability model" }, ids: ids(units.slice(0, 2)) },
      { title: { tr: "Olasılıktan karara", en: "From probability to decision" }, ids: ids(units.slice(2, 7)) },
      { title: { tr: "Uygulama: kredi riski", en: "Application: credit risk" }, ids: ids(units.slice(7, 9)) }
    ],
    required: ids(units)
  });
})();
