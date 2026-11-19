/* Modül 7 — kayıt, bölümler ve modül tanıtımı
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 */
(function () {
  "use strict";
  const units = window.M7_UNITS || [];
  const ids = (arr) => arr.map((u) => u.id);
  window.LAB.registerModule({
    id: "m7",
    num: 7,
    title: { tr: "Gözetimsiz Öğrenme ve Metin: Ülkeler, Getiri Eğrisi ve Fed Açıklamaları", en: "Unsupervised Learning and Text: Countries, the Yield Curve and Fed Statements" },
    summary: {
      tr: "Hedefsiz öğrenme ve metinden veri: k-ortalamalar ve ölçekleme, küme sayısı seçimi, temel bileşenler analizi, kelime torbası ve TF-IDF, sözlükle ton, konu modelleri, metin sınıflandırma ve büyük dil modellerinin denetimi.",
      en: "Learning without a target and data from text: k-means and scaling, choosing the number of clusters, principal component analysis, bag of words and TF-IDF, dictionary tone, topic models, text classification and auditing large language models."
    },
    intro: {
      tr: "<p>Önceki modüllerde her modelin öngöreceği bir hedefi vardı. Bu modülün ilk yarısında hedef yok: <b>verideki yapıyı keşfetmek</b> istiyoruz. 157 ülkeyi Dünya Bankası'nın sekiz kalkınma göstergesiyle k-ortalamalar yöntemiyle kümeleyecek, küme sayısının nasıl seçildiğini ve aykırı değerlerin sonucu nasıl ele geçirdiğini göreceksin. Temel bileşenler analiziyle (PCA) ABD getiri eğrisinin sekiz faizini üç faktöre (düzey, eğim, eğrilik) indirgeyecek, sonra ülkeleri iki boyutlu bir haritaya yerleştireceksin.</p><p>İkinci yarıda veri bir tablo değil, metin: 2002'den bu yana 201 FOMC (ABD Merkez Bankası) para politikası açıklaması. Metni kelime torbası ve TF-IDF ile sayıya çevirecek, bir şahin/güvercin sözlüğüyle ton endeksi kurup faizle sınayacak, konu modelleriyle temaları bulacak ve metin sınıflandırmanın (bir büyük dil modeliyle yapılanı dâhil) tuzaklarını göreceksin. Atölyede ülke kümelerini ve ton endeksini Google Colab ve Gemini ile kuracaksın.</p>",
      en: "<p>In earlier modules every model had a target to predict. In the first half of this module there is no target: we want to <b>discover the structure in the data</b>. You will cluster 157 countries with eight World Bank development indicators using k-means, and see how the number of clusters is chosen and how outliers can take over the result. With principal component analysis (PCA) you will reduce the eight yields of the US yield curve to three factors (level, slope, curvature), then place the countries on a two-dimensional map.</p><p>In the second half the data are not a table but text: 201 FOMC (US Federal Reserve) monetary policy statements since 2002. You will turn the text into numbers with the bag of words and TF-IDF, build a tone index with a hawkish/dovish dictionary and test it against the rate, find themes with topic models, and see the traps of text classification (including classification by a large language model). In the workshop you will build the country clusters and the tone index with Google Colab and Gemini.</p>"
    },
    lessons: units,
    sections: [
      { title: { tr: "Kümeleme", en: "Clustering" }, ids: ids(units.slice(0, 2)) },
      { title: { tr: "Boyut indirgeme", en: "Dimension reduction" }, ids: ids(units.slice(2, 4)) },
      { title: { tr: "Metinden veriye", en: "From text to data" }, ids: ids(units.slice(4, 7)) },
      { title: { tr: "Sınıflandırma ve atölye", en: "Classification and workshop" }, ids: ids(units.slice(7, 9)) }
    ],
    required: ids(units)
  });
})();
