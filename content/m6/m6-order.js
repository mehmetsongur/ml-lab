/* Modül 6 — kayıt, bölümler ve modül tanıtımı
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 */
(function () {
  "use strict";
  const units = window.M6_UNITS || [];
  const ids = (arr) => arr.map((u) => u.id);
  window.LAB.registerModule({
    id: "m6",
    num: 6,
    title: { tr: "Finansal Zaman Serileri: Kur Getirileri ve Zamana Saygılı Doğrulama", en: "Financial Time Series: Exchange-Rate Returns and Time-Respecting Validation" },
    summary: {
      tr: "Fiyat yerine getiri, kalın kuyruklar ve volatilite kümelenmesi, zamansal sızıntı, TimeSeriesSplit ve yürüyen pencere, getiri ve volatilite öngörüsü, al-sat kurallarının tuzakları ve riske maruz değer.",
      en: "Returns instead of prices, fat tails and volatility clustering, temporal leakage, TimeSeriesSplit and walk-forward, forecasting returns and volatility, the traps of trading rules, and value at risk."
    },
    intro: {
      tr: "<p>Bu modülün sorusu: <b>finansal piyasalarda makine öğrenmesi neyi öngörebilir, neyi öngöremez ve bunu dürüstçe nasıl ölçeriz?</b> Gerçek veriyle çalışıyoruz: euro/dolar kurunun 1999'dan bu yana günlük değerleri (FRED, ABD Merkez Bankası H.10 serisi). Önce fiyat ile getiri arasındaki farkı ve getirilerin iki temel özelliğini (kalın kuyruklar, volatilite kümelenmesi) göreceksin. Sonra Modül 2'deki rastgele çapraz doğrulamanın zaman serilerinde neden geleceği sızdırdığını ve yerine ne kullanılacağını öğreneceksin.</p><p>Modülün ana bulgusu dürüst bir bulgudur: geçmiş getirilerle yarının getirisini öngörmek neredeyse imkânsızdır (etkin piyasalar), ama riskin büyüklüğü, yani volatilite, öngörülebilir. Son ünitelerde al-sat kurallarını sınarken düşülen tuzakları (ileriye bakma, veri madenciliği) ve bankaların günlük risk ölçüsü olan riske maruz değeri (VaR) kuracaksın. Atölyede aynı analizi sterlin/dolar kuruyla Google Colab ve Gemini üzerinde yapacaksın.</p>",
      en: "<p>This module's question: <b>what can machine learning forecast in financial markets, what can it not, and how do we measure this honestly?</b> We work with real data: daily values of the euro/dollar rate since 1999 (FRED, the US Federal Reserve's H.10 series). First you will see the difference between prices and returns and the two basic properties of returns (fat tails, volatility clustering). Then you will learn why Module 2's random cross-validation leaks the future with time series, and what to use instead.</p><p>The module's main finding is an honest one: forecasting tomorrow's return from past returns is almost impossible (efficient markets), but the size of risk, i.e. volatility, is predictable. In the last units you will see the traps of testing trading rules (look-ahead, data snooping) and build value at risk (VaR), banks' daily risk measure. In the workshop you will do the same analysis with the sterling/dollar rate on Google Colab and Gemini.</p>"
    },
    lessons: units,
    sections: [
      { title: { tr: "Zaman serisi temelleri", en: "Time-series basics" }, ids: ids(units.slice(0, 2)) },
      { title: { tr: "Zamana saygılı doğrulama", en: "Time-respecting validation" }, ids: ids(units.slice(2, 4)) },
      { title: { tr: "Ne öngörülebilir?", en: "What is predictable?" }, ids: ids(units.slice(4, 7)) },
      { title: { tr: "Uygulama: risk", en: "Application: risk" }, ids: ids(units.slice(7, 9)) }
    ],
    required: ids(units)
  });
})();
