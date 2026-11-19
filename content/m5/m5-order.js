/* Modül 5 — kayıt, bölümler ve modül tanıtımı
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 */
(function () {
  "use strict";
  const units = window.M5_UNITS || [];
  const ids = (arr) => arr.map((u) => u.id);
  window.LAB.registerModule({
    id: "m5",
    num: 5,
    title: { tr: "Ağaçlar, Topluluklar ve Açıklanabilirlik", en: "Trees, Ensembles and Explainability" },
    summary: {
      tr: "Karar ağaçları, aşırı uyum ve kararsızlık, bagging ve rassal orman, boosting, SHAP ile açıklama ve Tayvan kart verisinde lojistik regresyonla karşılaştırma.",
      en: "Decision trees, overfitting and instability, bagging and random forests, boosting, explanation with SHAP, and a comparison with logistic regression on Taiwanese card data."
    },
    intro: {
      tr: "<p>Bu modülün sorusu: <b>risk doğrusal değilse ne yaparız ve karmaşık bir modelin kararını nasıl açıklarız?</b> Gerçek kredi riskinde eşikler (borç belli bir düzeyi aşınca riskin sıçraması), etkileşimler (gecikmenin yalnızca borcu yüksek olanlarda tehlikeli olması) ve U biçimli ilişkiler vardır. Karar ağaçları bunları veriden sorular öğrenerek kendiliğinden yakalar. Tek bir ağacın ezberleme ve kararsızlık sorunlarını, yüzlerce ağacı birleştiren topluluk yöntemleriyle (rassal orman, boosting) çözeceksin. Sonra bu modellerin tahminlerini SHAP ile açıklamayı ve açıklamanın sınırlarını göreceksin.</p><p>İlk yedi ünitede dersin 6. haftasındaki doğrusal olmayan kredi dünyasını kullanıyoruz. Sekizinci ünitede Modül 4'teki <b>Tayvan kart müşterileri verisine</b> dönüp ağaçların lojistik regresyona göre gerçekte ne kazandırdığını ölçüyoruz. Son ünitede boosting modelini kurup SHAP kütüphanesiyle Google Colab ve Gemini üzerinde açıklayacaksın. (SHAP kütüphanesi tarayıcıdaki Python'da çalışmadığı için SHAP kodu Colab atölyesinde.)</p>",
      en: "<p>This module's question: <b>what do we do when risk is not linear, and how do we explain a complex model's decision?</b> Real credit risk has thresholds (risk jumping once debt passes a certain level), interactions (delinquency being dangerous only for high-debt applicants) and U-shaped relationships. Decision trees capture these on their own by learning questions from the data. You will solve a single tree's memorisation and instability problems with ensemble methods that combine hundreds of trees (random forests, boosting). Then you will see how to explain these models' predictions with SHAP, and the limits of explanation.</p><p>The first seven units use the nonlinear credit world from week 6 of the course. In the eighth unit we return to Module 4's <b>Taiwanese card customer data</b> and measure what trees really gain over logistic regression. In the last unit you will build the boosting model and explain it with the SHAP library on Google Colab and Gemini. (Because the SHAP library does not run in the browser's Python, the SHAP code is in the Colab workshop.)</p>"
    },
    lessons: units,
    sections: [
      { title: { tr: "Ağaçlar", en: "Trees" }, ids: ids(units.slice(0, 3)) },
      { title: { tr: "Topluluklar", en: "Ensembles" }, ids: ids(units.slice(3, 5)) },
      { title: { tr: "Açıklanabilirlik", en: "Explainability" }, ids: ids(units.slice(5, 7)) },
      { title: { tr: "Uygulama: kredi riski", en: "Application: credit risk" }, ids: ids(units.slice(7, 9)) }
    ],
    required: ids(units)
  });
})();
