/* Modül 1 — genişletilmiş kavram anlatımları (şekil, tablo, çözümlü örnek, sık hatalar, özet)
 * Şekiller tools/m1_figs.py ile üretilir (window.M1_FIGS). Bileşenler: content/concept-kit.js
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 */
(function () {
  "use strict";
  const K = window.CK, F = window.M1_FIGS || {}, N = window.M1_NUMS || {};
  const U = window.M1_UNITS || [];
  if (!K) return;
  const { sec, cards, pit, sum, analogy, formula, steps, table, code, vs, wrap, nf, link } = K;
  const fig = (name, lang, cap) => K.fig(F, name, lang, cap);
  const B = {};

  /* ------------------------------------------------------------ Ünite 1 */
  B["m1-u1"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Yapay zekâ, makine öğrenmesi ve derin öğrenme çoğu zaman birbirinin yerine kullanılır ama aynı şey değildir. Bu ünitede üçünü yerli yerine koyuyor ve makine öğrenmesinin ekonometriyle ilişkisini görüyoruz.",
      "Artificial intelligence, machine learning and deep learning are often used interchangeably, but they are not the same thing. In this unit we put the three in their place and see how machine learning relates to econometrics.")}</p>
${sec(1, 0, t("Sezgi: kredi memuru ve deneyim", "Intuition: the loan officer and experience"), analogy("🏦", t(
      "Yeni bir kredi memuruna bir kural kitabı verebilirsin: “gelir 20.000 TL'nin altındaysa reddet.” Ya da ona geçmiş binlerce başvuruyu ve hangilerinin borcunu ödediğini gösterip <b>kendi kuralını çıkarmasını</b> isteyebilirsin. Birincisi kurallı bir sistemdir; ikincisi makine öğrenmesinin özüdür.",
      "You can give a new loan officer a rule book: “reject if income is below 20,000.” Or you can show them thousands of past applications and which ones were repaid, and ask them to <b>work out their own rule</b>. The first is a rule-based system; the second is the essence of machine learning.")))}
${sec(2, 1, t("İç içe üç halka", "Three nested rings"), fig("u1_rings", lang, t("<b>Şekil 1.</b> Derin öğrenme makine öğrenmesinin, makine öğrenmesi de yapay zekânın bir alt kümesidir.", "<b>Figure 1.</b> Deep learning is a subset of machine learning, which is a subset of artificial intelligence.")) + cards([
      [0, "🤖", t("Yapay zekâ (YZ)", "Artificial intelligence (AI)"), t("İnsan zekâsı gerektiren işleri yapan her türlü bilgisayar sistemi. Elle yazılmış kurallarla çalışan bir program da bu geniş tanıma girer.", "Any computer system doing tasks that need human intelligence. A program running on hand-written rules also fits this broad definition.")],
      [1, "📈", t("Makine öğrenmesi (MÖ)", "Machine learning (ML)"), t("Kuralları insan yazmaz; bilgisayar veriden öğrenir. Geçmiş başvurulardan bir karar kuralı çıkarmak bir MÖ işidir.", "People don't write the rules; the computer learns them from data. Extracting a decision rule from past applications is an ML task.")],
      [2, "🧠", t("Derin öğrenme", "Deep learning"), t("Çok katmanlı yapay sinir ağlarıyla öğrenen MÖ. Görüntü, ses ve metinde güçlüdür. Modül 0'daki büyük dil modelleri bu halkadadır.", "ML that learns with many-layered artificial neural networks. Strong on images, sound and text. The large language models in Module 0 sit in this ring.")]
    ]))}
${sec(3, 2, t("Kuralı kim yazıyor?", "Who writes the rule?"), fig("u1_rules", lang, t("<b>Şekil 2.</b> Geleneksel programlamada kuralları insan yazar; makine öğrenmesinde veri ve doğru cevaplardan bilgisayar çıkarır.", "<b>Figure 2.</b> In traditional programming people write the rules; in machine learning the computer infers them from data and the right answers.")))}
${sec(4, 3, t("Peki ekonometri nerede?", "So where is econometrics?"), table([t("", ""), t("Ekonometri (çoğunlukla)", "Econometrics (mostly)"), t("Makine öğrenmesi (çoğunlukla)", "Machine learning (mostly)")], [
      [t("<b>Ana soru</b>", "<b>Main question</b>"), t("Bir katsayının değeri ve anlamı ne?", "What is a coefficient's value and meaning?"), t("Yeni gözlemler için öngörü ne kadar iyi?", "How good are predictions for new observations?")],
      [t("<b>Başarı ölçütü</b>", "<b>Measure of success</b>"), t("Kestirimin yansızlığı, standart hata, anlamlılık", "Unbiased estimates, standard errors, significance"), t("Görülmemiş veride öngörü hatası", "Prediction error on unseen data")],
      [t("<b>Tipik model</b>", "<b>Typical model</b>"), t("Az sayıda, kuramla seçilmiş değişken", "Few variables, chosen by theory"), t("Çok sayıda değişken, esnek biçim", "Many variables, flexible form")],
      [t("<b>Ortak araç</b>", "<b>Shared tool</b>"), t("Doğrusal regresyon her ikisinde de var.", "Linear regression appears in both."), t("Aynı model, farklı soru.", "Same model, different question.")]
    ]) + `<p>${t("Fark çoğu zaman araçta değil, <b>sorulan soruda</b>. Bir sonraki ünitede bu farkı kendi gözünle göreceksin.", "The difference is usually not the tool but <b>the question asked</b>. You will see this difference for yourself in the next unit.")}</p>`)}
${sec(5, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Her YZ'yi “öğrenen” sanmak", "Thinking all AI “learns”"), t("Elle yazılmış kurallarla çalışan sistemler de YZ sayılır.", "Systems running on hand-written rules also count as AI."), t("“Kural veriden mi geliyor?” diye sor.", "Ask “does the rule come from data?”")],
      [t("MÖ'yü yalnızca derin öğrenme sanmak", "Equating ML with deep learning"), t("Ekonomide en çok kullanılan MÖ yöntemlerinin çoğu sinir ağı değildir.", "Most ML methods used in economics are not neural networks."), t("Derin öğrenme, MÖ'nün bir alt kümesidir.", "Deep learning is one subset of ML.")],
      [t("Ekonometri ile MÖ'yü rakip görmek", "Seeing econometrics and ML as rivals"), t("Araçların bir kısmı ortaktır; amaçlar farklıdır.", "Some tools are shared; the goals differ."), t("Soruna göre doğru çerçeveyi seç.", "Choose the frame that fits the question.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("YZ ⊃ MÖ ⊃ derin öğrenme.", "AI ⊃ ML ⊃ deep learning."), t("MÖ'de kuralları bilgisayar veriden öğrenir.", "In ML the computer learns the rules from data."), t("Ekonometri katsayıyla, MÖ öngörüyle daha çok ilgilenir.", "Econometrics cares more about coefficients, ML about predictions.")])}
${link(lang, 1, t("YZ, MÖ ve derin öğrenme", "AI, ML and deep learning"))}`);
  };

  /* ------------------------------------------------------------ Ünite 2 */
  B["m1-u2"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    const a = (N.u2 || {})["0.0"] || { sd_b1: 0.15, sd_y: 0.2 }, b = (N.u2 || {})["0.97"] || { sd_b1: 0.58, sd_y: 0.15, corr_b: -0.97 };
    return wrap(`
<p class="c-lead">${t("Bir regresyon iki şey üretir: katsayılar ve öngörüler. Ekonometri çoğunlukla birincisiyle, makine öğrenmesi ikincisiyle ilgilenir. Bu ünitede ikisinin neden farklı sorular olduğunu bir simülasyonla görüyoruz.",
      "A regression produces two things: coefficients and predictions. Econometrics mostly cares about the first, machine learning about the second. In this unit a simulation shows why these are different questions.")}</p>
${sec(1, 0, t("Sezgi: metrekare ve oda sayısı", "Intuition: floor area and number of rooms"), analogy("🏠", t(
      "Konut fiyatını metrekare ve oda sayısıyla açıklamak istiyorsun. Büyük evlerin odası da fazla; iki değişken neredeyse birlikte hareket ediyor. Fiyatı artıran metrekare mi, oda mı? Veri bunu ayırt etmekte zorlanır. Ama “bu evin fiyatı ne olur?” sorusunu yanıtlamak için <b>ayırt etmesine gerek yoktur</b>.",
      "You want to explain house prices with floor area and number of rooms. Big houses have more rooms; the two variables move almost together. Is it the area or the rooms that raise the price? The data struggle to tell. But to answer “what will this house cost?” they <b>don't need to tell</b>.")))}
${sec(2, 1, t("İki çıktı: β̂ ve ŷ", "Two outputs: β̂ and ŷ"), formula("ŷ = β̂<sub>1</sub> x<sub>1</sub> + β̂<sub>2</sub> x<sub>2</sub>", [["β̂ (" + t("beta şapka", "beta hat") + ")", t("katsayı kestirimi: “x₁ bir birim artınca, x₂ sabitken y ne kadar değişir?”", "coefficient estimate: “how much does y change when x₁ rises one unit, holding x₂ fixed?”")], ["ŷ (" + t("y şapka", "y hat") + ")", t("öngörü: “bu özelliklere sahip bir gözlemin y'si ne olur?”", "prediction: “what is y for an observation with these features?”")]]) +
      cards([[0, "β̂", t("Ekonometrinin sorusu", "The econometric question"), t("Tek bir katsayıyı doğru kestirmek ve yorumlamak.", "Estimating and interpreting a single coefficient correctly.")], [3, "ŷ", t("Makine öğrenmesinin sorusu", "The machine learning question"), t("Yeni gözlemler için iyi öngörü yapmak.", "Making good predictions for new observations.")]]))}
${sec(3, 2, t("Simülasyon: 200 örneklem, 200 regresyon", "Simulation: 200 samples, 200 regressions"), `
${formula("y = 1 · x<sub>1</sub> + 1 · x<sub>2</sub> + u", [["x₁, x₂", t("ortalaması 0, varyansı 1 olan iki değişken; aralarındaki korelasyonu biz seçiyoruz", "two variables with mean 0 and variance 1; we choose their correlation")], ["u", t("rastgele hata", "random error")], [t("örneklem", "sample"), t("her seferinde 50 gözlem; 200 kez tekrar", "50 observations each time; repeated 200 times")]])}
${fig("u2_coef", lang, t("<b>Şekil 1.</b> Solda iki değişken ilişkisiz: kestirimler gerçek değerin (1, 1) etrafında küçük bir bulut. Sağda korelasyon 0,97: kestirimler kesikli çizgi boyunca savruluyor; biri büyüyünce öteki küçülüyor. Ama toplamları, yani öngörü, yerinde duruyor.", "<b>Figure 1.</b> Left: the two variables are unrelated, and estimates form a small cloud around the true value (1, 1). Right: correlation 0.97, and estimates are flung along the dashed line; when one grows the other shrinks. But their sum, the prediction, stays put."))}
${table([t("Korelasyon", "Correlation"), t("β̂₁'in yayılımı (std. sapma)", "Spread of β̂₁ (std. dev.)"), t("β̂₁ ile β̂₂ arasındaki korelasyon", "Correlation of β̂₁ and β̂₂"), t("Öngörünün yayılımı", "Spread of the prediction")], [
      [nf(0, 2, lang), nf(a.sd_b1, 2, lang), nf(a.corr_b || 0, 2, lang), nf(a.sd_y, 2, lang)],
      { cls: "hl", cells: [nf(0.97, 2, lang), nf(b.sd_b1, 2, lang) + t(" (yaklaşık 4 kat)", " (about 4 times)"), nf(b.corr_b, 2, lang), nf(b.sd_y, 2, lang)] }
    ], { num: [1, 2, 3] })}`)}
${sec(4, 3, t("Tabloyu okumak", "Reading the table"), steps([
      t("Korelasyon 0,97 olunca tek bir katsayının yayılımı yaklaşık dört katına çıkıyor: bir örneklemde β̂₁ = 0,3, başka birinde 1,8 çıkabilir. Buna <b>çoklu doğrusal bağlantı</b> denir.", "With correlation 0.97 the spread of a single coefficient roughly quadruples: β̂₁ may be 0.3 in one sample and 1.8 in another. This is called <b>multicollinearity</b>."),
      t("İki katsayının kestirimleri birbirini telafi ediyor (korelasyonları " + nf(b.corr_b, 2, "tr") + "): biri artınca öteki düşüyor.", "The two estimates compensate each other (their correlation is " + nf(b.corr_b, 2, "en") + "): when one rises the other falls."),
      t("Öngörünün yayılımı ise artmıyor; bu örnekte biraz azalıyor bile. Veri, toplam etkiyi iyi biliyor; yalnızca onu ikiye nasıl bölüştüreceğini bilmiyor.", "The spread of the prediction does not grow; in this example it even falls slightly. The data know the total effect well; they just don't know how to split it in two."),
      t("<b>Sonuç:</b> tek bir katsayıyı yorumlamak istiyorsan ciddi bir sorun; fiyatı öngörmek istiyorsan pek değil.", "<b>Conclusion:</b> a serious problem if you want to interpret a single coefficient; hardly one if you want to predict the price.")
    ]))}
${sec(5, 4, t("Bu ayrım neyi değiştirir?", "What does this distinction change?"), cards([
      [1, "🎯", t("Değerlendirme", "Evaluation"), t("MÖ modelleri katsayılarının ne kadar “anlamlı” olduğuna göre değil, yeni gözlemlerde ne kadar iyi öngördüklerine göre değerlendirilir.", "ML models are judged not by how “significant” their coefficients are but by how well they predict new observations.")],
      [2, "🧩", t("Model seçimi", "Model choice"), t("Öngörü için katsayıları yorumlanamayan esnek modeller de kabul edilebilir.", "For prediction, flexible models whose coefficients cannot be interpreted can be acceptable.")],
      [3, "⚖️", t("Sınırlar", "Limits"), t("İyi öngören bir model, katsayıları hakkında güvenilir bir şey söylemeyebilir.", "A model that predicts well may say nothing reliable about its coefficients.")]
    ]))}
${sec(6, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Öngörü iyi diye katsayıyı yorumlamak", "Interpreting a coefficient because predictions are good"), t("Öngörü istikrarlıyken tek tek katsayılar savrulabilir.", "Individual coefficients can swing while predictions are stable."), t("Katsayı sorusu ayrı bir sorudur; ayrıca incele.", "The coefficient question is separate; examine it on its own.")],
      [t("Katsayı istikrarsız diye modeli çöpe atmak", "Discarding the model because coefficients are unstable"), t("Amaç öngörüyse model işini görüyor olabilir.", "If the goal is prediction, the model may be doing its job."), t("Önce amacını belirle.", "Decide your goal first.")],
      [t("İşaretin “ters” çıkmasına şaşırmak", "Being surprised by a “wrong” sign"), t("Çoklu bağlantıda katsayılar işaret bile değiştirebilir.", "With multicollinearity coefficients can even change sign."), t("Değişkenler arasındaki korelasyona bak.", "Look at the correlation between the variables.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("β̂ katsayıdır, ŷ öngörüdür.", "β̂ is the coefficient, ŷ is the prediction."), t("Çoklu doğrusal bağlantı katsayıları istikrarsızlaştırır, öngörüyü pek etkilemez.", "Multicollinearity destabilises coefficients but barely affects predictions."), t("Ekonometri çoğunlukla β̂ ile, MÖ ŷ ile ilgilenir.", "Econometrics mostly cares about β̂, ML about ŷ.")])}
${link(lang, 1, t("katsayı ve öngörü", "coefficients and prediction"))}`);
  };

  /* ------------------------------------------------------------ Ünite 3 */
  B["m1-u3"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    const Q = [[t("Bu müşteri kredisini geri öder mi?", "Will this customer repay the loan?"), t("Öngörü", "Prediction")], [t("Gelecek ay enflasyon kaç olur?", "What will inflation be next month?"), t("Öngörü", "Prediction")],
      [t("Faizi artırırsak enflasyon ne olur?", "What happens to inflation if we raise rates?"), t("Nedensel", "Causal")], [t("Kart limitini yükseltmek harcamayı artırır mı?", "Does raising the card limit increase spending?"), t("Nedensel", "Causal")],
      [t("Hangi firmalar gelecek yıl iflas eder?", "Which firms will go bankrupt next year?"), t("Öngörü", "Prediction")], [t("Asgari ücret artışı istihdamı azaltır mı?", "Does a minimum wage rise reduce employment?"), t("Nedensel", "Causal")]];
    return wrap(`
<p class="c-lead">${t("İki soru türünü ayırmak bu dersin en önemli becerilerinden biri: öngörü soruları ve nedensel sorular. Makine öğrenmesi birincisinde çok güçlüdür; ikincisi için tek başına yeterli değildir.",
      "Telling two kinds of question apart is one of the most important skills in this course: prediction questions and causal questions. Machine learning is very strong at the first; on its own it is not enough for the second.")}</p>
${sec(1, 0, t("Sezgi: hava durumu ve yağmur duası", "Intuition: the weather forecast and the rain dance"), analogy("☔", t(
      "Barometredeki düşüş yağmuru iyi öngörür. Ama barometrenin ibresini elle aşağı itmek yağmur yağdırmaz. <b>Öngörü</b>, “ne olacak?” sorusudur; <b>nedensellik</b>, “bir şeyi değiştirirsem ne olur?” sorusudur. Politika ve karar soruları ikincisinin dilindedir.",
      "A falling barometer predicts rain well. But pushing the barometer's needle down by hand does not make it rain. <b>Prediction</b> asks “what will happen?”; <b>causation</b> asks “what happens if I change something?”. Policy and decision questions speak the second language.")))}
${sec(2, 1, t("İki soru türü", "Two kinds of question"), cards([
      [1, "🔭", t("Öngörü sorusu", "Prediction question"), t("Doğru tahmin önemli. Hangi değişkenin neden işe yaradığı ikinci planda.", "Accurate guesses matter. Why a variable helps is secondary."), t("“ne olacak?”", "“what will happen?”")],
      [3, "🔧", t("Nedensel soru", "Causal question"), t("Bir şeyi değiştirdiğimizde sonucun ne olacağını soruyoruz.", "We ask what happens to the outcome when we change something."), t("“değiştirirsem ne olur?”", "“what if I change it?”")]
    ]) + table([t("Soru", "Question"), t("Tür", "Kind")], Q.map(([q, k]) => ({ cls: k === t("Nedensel", "Causal") ? "hl" : "", cells: [q, `<b>${k}</b>`] }))))}
${sec(3, 2, t("İyi bir öngörücü neden olmak zorunda değil", "A good predictor need not be a cause"), fig("u3_dag", lang, t("<b>Şekil 1.</b> Yeşil oklar gerçek neden-sonuç ilişkisini, kırmızı kesikli oklar yalnızca öngörü gücünü gösteriyor. Solda yön ters; sağda iki değişkeni de üçüncü bir etken yönlendiriyor.", "<b>Figure 1.</b> Green arrows show the real cause-and-effect relationship; red dashed arrows show only predictive power. Left: the direction is reversed. Right: a third factor drives both variables.")) + table([t("Durum", "Situation"), t("Örnek", "Example"), t("Öngörür mü?", "Predicts?"), t("Neden olur mu?", "Causes?")], [
      [t("Ters nedensellik", "Reverse causality"), t("Şemsiye satışları → yağmur", "Umbrella sales → rain"), "✓", "✗"], [t("Ortak neden", "Common cause"), t("Lüks rezervasyonlar → büyüme (ikisini de gelir artırır)", "Luxury bookings → growth (income drives both)"), "✓", "✗"], { cls: "hl", cells: [t("Gerçek neden", "Real cause"), t("Yağmur → şemsiye satışları", "Rain → umbrella sales"), "✓", "✓"] }
    ]))}
${sec(4, 3, t("Çözümlü örnek: bir modelin yorumu", "Worked example: interpreting a model"), `
<p>${t("Bir banka, temerrüdü öngören bir model kuruyor. Modelde “son ay müşteri hizmetlerini arama sayısı” en güçlü değişken çıkıyor. Yönetici soruyor: “Arama sayısını azaltırsak temerrüt düşer mi?”", "A bank builds a model that predicts default. “Number of calls to customer service last month” turns out to be the strongest variable. A manager asks: “If we reduce the number of calls, will defaults fall?”")}</p>
${steps([
      t("<b>Soru türü:</b> yönetici nedensel bir soru soruyor (“azaltırsak”); model ise öngörü için kuruldu.", "<b>Kind of question:</b> the manager asks a causal question (“if we reduce”); the model was built for prediction."),
      t("<b>Olası mekanizma:</b> ödeme güçlüğü çeken müşteri bankayı daha çok arıyor. Arama, zorluğun <b>sonucu</b>; nedeni değil (ters nedensellik).", "<b>Likely mechanism:</b> customers in payment difficulty call the bank more. Calls are a <b>consequence</b> of the difficulty, not its cause (reverse causality)."),
      t("<b>Yanıt:</b> aramaları zorlaştırmak temerrüdü azaltmaz; muhtemelen erken uyarı sinyalini kaybettirir. Model öngörü için değerli, bu politika sorusu için yanıltıcı.", "<b>Answer:</b> making calls harder will not reduce defaults; it will probably lose an early-warning signal. The model is valuable for prediction, misleading for this policy question.")
    ])}`)}
${sec(5, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Önemli değişkeni “neden” diye okumak", "Reading an important variable as a “cause”"), t("Öngörü gücü, nedensellik kanıtı değildir.", "Predictive power is not evidence of causation."), t("Önce sor: soru öngörü mü, nedensellik mi?", "First ask: is the question prediction or causation?")],
      [t("Öngörü modeliyle politika önermek", "Recommending policy from a prediction model"), t("Politika bir şeyi değiştirir; model değişikliğin etkisini ölçmek için kurulmadı.", "Policy changes something; the model was not built to measure the effect of a change."), t("Nedensel soru için uygun bir araştırma tasarımı gerekir.", "A causal question needs a suitable research design.")],
      [t("Nedensel soruları küçümsemek", "Belittling causal questions"), t("Ekonomi politikası nedensel sorularla doludur.", "Economic policy is full of causal questions."), t("İki soru türü de değerlidir; araçları farklıdır.", "Both kinds are valuable; their tools differ.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Öngörü: “ne olacak?” Nedensellik: “değiştirirsem ne olur?”", "Prediction: “what will happen?” Causation: “what if I change it?”"), t("Ters nedensellik ve ortak neden, iyi öngörücüleri yanıltıcı nedenlere çevirir.", "Reverse causality and common causes turn good predictors into misleading “causes”."), t("Nedensel soru için verinin nasıl üretildiğine dair varsayımlar ve uygun bir araştırma tasarımı gerekir.", "A causal question needs assumptions about how the data were generated and a suitable research design.")])}
${link(lang, 1, t("öngörü ve nedensellik", "prediction and causality"))}`);
  };

  /* ------------------------------------------------------------ Ünite 4 */
  B["m1-u4"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Bir makine öğrenmesi problemine başlarken ilk soru şudur: verimde öğrenilecek bir “doğru cevap” sütunu var mı? Bu sorunun yanıtı, problemin hangi öğrenme türüne girdiğini belirler.",
      "The first question when starting a machine learning problem is: does my data have a “right answer” column to learn from? The answer decides which kind of learning the problem belongs to.")}</p>
${sec(1, 0, t("Sezgi: cevap anahtarlı ve cevap anahtarsız çalışmak", "Intuition: studying with and without an answer key"), analogy("📚", t(
      "Cevap anahtarı olan bir test kitabıyla çalışırsan her sorudan sonra doğruyu görür, hatandan öğrenirsin: <b>denetimli öğrenme</b>. Cevap anahtarı yoksa soruları benzerliklerine göre gruplayabilirsin: <b>denetimsiz öğrenme</b>. Bir oyunu oynayarak, kazandıkça ve kaybettikçe öğrenmek ise <b>pekiştirmeli öğrenmedir</b>.",
      "Study with a test book that has an answer key and you see the right answer after each question and learn from your mistakes: <b>supervised learning</b>. Without an answer key you can still group the questions by similarity: <b>unsupervised learning</b>. Learning a game by playing it, from wins and losses, is <b>reinforcement learning</b>.")))}
${sec(2, 1, t("Karar ağacı: hangi tür?", "Decision tree: which kind?"), fig("u4_tree", lang, t("<b>Şekil 1.</b> Öğrenme türünü belirleyen iki soru: hedef sütunu var mı, varsa ne tür?", "<b>Figure 1.</b> Two questions decide the kind of learning: is there a target column, and if so, what kind?")))}
${sec(3, 2, t("Üç problemin görünüşü", "What the three problems look like"), fig("u4_panels", lang, t("<b>Şekil 2.</b> Regresyonda hedef bir sayıdır; sınıflandırmada bir etiket; denetimsiz öğrenmede etiket yoktur, model yapıyı kendisi arar.", "<b>Figure 2.</b> In regression the target is a number; in classification a label; in unsupervised learning there is no label and the model finds the structure itself.")))}
${sec(4, 3, t("Çözümlü örnek: ekonomi ve finanstan problemler", "Worked example: problems from economics and finance"), table([t("Problem", "Problem"), t("Hedef sütunu", "Target column"), t("Tür", "Kind")], [
      [t("Gelecek ayın enflasyonunu öngörmek", "Predict next month's inflation"), t("enflasyon (%)", "inflation (%)"), t("Denetimli · regresyon", "Supervised · regression")],
      [t("Başvuranın temerrüde düşüp düşmeyeceği", "Whether an applicant will default"), t("temerrüt (0/1)", "default (0/1)"), t("Denetimli · sınıflandırma", "Supervised · classification")],
      [t("Konut fiyatı tahmini", "Estimating house prices"), t("fiyat (TL)", "price (TL)"), t("Denetimli · regresyon", "Supervised · regression")],
      [t("Şirket tahvillerinin kredi notu (AAA … BB)", "Corporate bond credit grades (AAA … BB)"), t("not (kategori)", "grade (category)"), t("Denetimli · sınıflandırma", "Supervised · classification")],
      { cls: "hl", cells: [t("Benzer harcama davranışlı müşteri grupları", "Groups of customers with similar spending"), "—", t("Denetimsiz", "Unsupervised")] },
      { cls: "hl", cells: [t("Onlarca göstergeyi birkaç özet göstergede toplamak", "Summarising dozens of indicators in a few", ), "—", t("Denetimsiz", "Unsupervised")] },
      [t("Fiyatı sürekli ayarlayıp kârı gözlemleyen sistem", "A system that keeps adjusting prices and watches profit"), t("ödül (kâr)", "reward (profit)"), t("Pekiştirmeli", "Reinforcement")]
    ]) + `<p>${t("Aynı veriyle farklı sorular farklı türlere girebilir: kredi tablosunda temerrüdü öngörmek sınıflandırma, müşterileri gruplamak denetimsiz öğrenmedir.", "The same data can serve different kinds: predicting default from a loan table is classification, grouping its customers is unsupervised learning.")}</p>`)}
${sec(5, 4, t("Kelime tuzağı: “regresyon”", "A word trap: “regression”"), formula(t("regresyon (problem türü) ≠ doğrusal regresyon (yöntem)", "regression (a problem type) ≠ linear regression (a method)"), [[t("problem türü", "problem type"), t("hedef sayısal olduğunda verilen ad", "the name when the target is numeric")], [t("yöntem", "method"), t("ekonometriden bildiğin doğrusal regresyon, bu problem için kullanılabilecek yöntemlerden yalnızca biri", "the linear regression you know from econometrics is only one of the methods for this problem")]]))}
${sec(6, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Sayı gibi görünen kategoriyi regresyon sanmak", "Treating a numeric-looking category as regression"), t("Temerrüt 0/1 sayıdır ama bir kategoridir.", "Default 0/1 is a number but it is a category."), t("Hedefin anlamına bak, biçimine değil.", "Look at what the target means, not how it looks.")],
      [t("Hedef yokken denetimli yöntem aramak", "Looking for a supervised method without a target"), t("Öğrenilecek doğru cevap yoksa denetimli öğrenme kurulamaz.", "Without a right answer to learn, supervised learning is impossible."), t("Denetimsiz bir soru sor ya da hedefi oluştur.", "Ask an unsupervised question or construct the target.")],
      [t("“Regresyon” kelimesini tek yönteme indirgemek", "Reducing “regression” to one method"), t("Regresyon problemleri birçok farklı yöntemle çözülebilir.", "Regression problems can be solved with many different methods."), t("Problem türü ile yöntemi ayrı düşün.", "Think of the problem type and the method separately.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Hedef varsa denetimli; yoksa denetimsiz; ödülle deneme-yanılma ise pekiştirmeli.", "With a target: supervised; without: unsupervised; trial and error with reward: reinforcement."), t("Denetimli öğrenmede hedef sayıysa regresyon, kategoriyse sınıflandırma.", "In supervised learning, a numeric target means regression, a category means classification."), t("“Regresyon” bir problem türünün adıdır.", "“Regression” is the name of a problem type.")])}
${link(lang, 2, t("öğrenme türleri", "types of learning"))}`);
  };

  /* ------------------------------------------------------------ Ünite 5 */
  B["m1-u5"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Denetimli öğrenmede veri tablosu iki parçaya ayrılır: özellikler ve hedef. Her sütunun türü de onunla nasıl çalışılacağını belirler. Bu ünite, modele veri vermeden önceki ilk okumayı anlatıyor.",
      "In supervised learning the data table splits into two parts: features and target. Each column's type also decides how to work with it. This unit covers the first reading of the data before anything goes into a model.")}</p>
${sec(1, 0, t("Sezgi: sınav kâğıdı ve cevap", "Intuition: the exam paper and the answer"), analogy("📝", t(
      "Özellikler sınav sorusudur, hedef cevaptır. Model soruya bakarak cevabı tahmin etmeyi öğrenir. Cevap sorunun içine yazılmışsa (hedef özelliklerin arasında kalmışsa) model hiçbir şey öğrenmeden “tam puan” alır; <b>ve gerçek hayatta çuvallar</b>.",
      "Features are the exam question, the target is the answer. The model learns to guess the answer by looking at the question. If the answer is written inside the question (the target left among the features), the model gets “full marks” without learning anything, <b>and fails in real life</b>.")))}
${sec(2, 1, t("Tablonun anatomisi", "Anatomy of the table"), fig("u5_table", lang, t("<b>Şekil 1.</b> Modülün kredi tablosu (ilk 5 müşteri, kurgusal; not sütunu bu şekil için eklendi). Satırlar gözlem; kimlik sütunu dışarıda kalır; özellikler X, hedef y.", "<b>Figure 1.</b> The module's loan table (first 5 customers, fictional; the grade column was added for this figure). Rows are observations; the ID column is left out; features are X, the target is y.")) + table([t("Makine öğrenmesi", "Machine learning"), t("Ekonometri", "Econometrics"), t("Örnek", "Example")], [
      [t("Özellik (X)", "Feature (X)"), t("Açıklayıcı değişken", "Explanatory variable"), t("yaş, gelir, bölge", "age, income, region")], [t("Hedef (y)", "Target (y)"), t("Bağımlı değişken", "Dependent variable"), t("temerrüt", "default")], [t("Gözlem (satır)", "Observation (row)"), t("Gözlem", "Observation"), t("bir müşteri, bir ay, bir ülke", "a customer, a month, a country")]
    ]))}
${sec(3, 2, t("Beş veri türü", "Five data types"), cards([
      [0, "🔢", t("Sayısal", "Numeric"), t("Gelir, yaş, enflasyon. Sürekli ya da kesikli olabilir.", "Income, age, inflation. Continuous or discrete.")],
      [1, "🏷️", t("Kategorik", "Categorical"), t("Bölge, sektör. Kategoriler arasında sıra yok.", "Region, sector. No order between categories.")],
      [2, "🪜", t("Sıralı", "Ordinal"), t("Kredi notu (AAA > AA > A), eğitim düzeyi. Sıra var, aralıklar eşit değil.", "Credit grade (AAA > AA > A), education level. Ordered, unequal gaps.")],
      [3, "📅", t("Zaman", "Time"), t("Tarih ve saat. Sıra ve aralık önemlidir.", "Date and time. Order and spacing matter.")],
      [4, "💬", t("Metin", "Text"), t("Haber, açıklama, toplantı metni. Sayıya dönüştürülmeden kullanılamaz.", "News, statements, meeting minutes. Unusable until turned into numbers.")]
    ]))}
${sec(4, 3, t("Çözümlü örnek: iki tuzak", "Worked example: two traps"), table([t("Sütun", "Column"), t("Bilgisayar ne sanıyor?", "What the computer thinks"), t("Gerçekte ne?", "What it really is"), t("Ne yapmalı?", "What to do")], [
      { cls: "bad", cells: [t("il plaka kodu (06, 21, 34)", "province plate code (06, 21, 34)"), t("sayı: 34 > 21 > 06", "a number: 34 > 21 > 06"), t("kategori: İstanbul Ankara'nın “5,7 katı” değil", "a category: Istanbul is not “5.7 times” Ankara"), t("kategorik olarak işaretle", "mark it as categorical")] },
      { cls: "bad", cells: [t("“45.000 TL”", "“45,000 TL”"), t("metin", "text"), t("sayı", "a number"), t("“TL” ve ayırıcıları temizleyip sayıya çevir", "strip “TL” and separators, convert to a number")] },
      [t("temerrüt (0/1)", "default (0/1)"), t("sayı", "a number"), t("kategori (iki sınıf)", "a category (two classes)"), t("hedef olarak sınıflandırma problemi", "a classification target")]
    ]) + code(t('kredi.dtypes          # her sütunun türü\nkredi["plaka"] = kredi["plaka"].astype("category")\nkredi["gelir"] = kredi["gelir"].str.replace(" TL", "").str.replace(".", "").astype(float)', 'loans.dtypes          # each column\'s type\nloans["plate"] = loans["plate"].astype("category")\nloans["income"] = loans["income"].str.replace(" TL", "").str.replace(",", "").astype(float)')))}
${sec(5, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Hedefi X'te bırakmak", "Leaving the target in X"), t("Model cevabı soruda görür ve olağanüstü başarılı görünür.", "The model sees the answer in the question and looks extraordinarily successful."), t("<code>X = veri.drop(columns=[\"temerrut\", \"musteri\"])</code>", "<code>X = data.drop(columns=[\"default\", \"customer\"])</code>")],
      [t("Kimlik sütununu özellik yapmak", "Using the ID column as a feature"), t("Kimlik hiçbir şeyi öngörmez; ama tesadüfi örüntüler yakalanabilir.", "An ID predicts nothing, but spurious patterns can be picked up."), t("Kimliği dışarıda bırak.", "Leave the ID out.")],
      [t("<code>dtypes</code>'a bakmamak", "Not checking <code>dtypes</code>"), t("Sayı gibi görünen metin ve kategori gibi davranan sayı fark edilmez.", "Text that looks numeric and numbers that act as categories go unnoticed."), t("İlk iş türlere bak.", "Check the types first.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("X özellikler, y hedef; her satır bir gözlem.", "X is the features, y the target; each row is an observation."), t("Hedef asla X'in içinde kalmamalı; kimlik sütunları dışarıda bırakılır.", "The target must never stay in X; ID columns are left out."), t("Sütunun türü biçimine değil anlamına göre belirlenir.", "A column's type depends on its meaning, not its appearance.")])}
${link(lang, 2, t("özellikler, hedef ve veri türleri", "features, target and data types"))}`);
  };

  /* ------------------------------------------------------------ Ünite 6 */
  B["m1-u6"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    const s = N.u6 || { q1: 5375, q3: 6775, iqr: 1400, lo: 3275, hi: 8875, mean: 10040, median: 6000, mean_wo: 5822, median_wo: 5900 };
    const n0 = (x) => nf(x, 0, lang);
    return wrap(`
<p class="c-lead">${t("Bir modele veri vermeden önce o veriyi tanımalısın. Buna <b>keşifsel veri analizi</b> denir: birkaç basit soru, birkaç komut ve bolca dikkat. Bu ünitede eksik ve olağandışı değerleri görmeyi öğreniyoruz; onlarla ne yapacağımız bir sonraki ünitenin konusu.",
      "Before giving data to a model you must get to know them. This is called <b>exploratory data analysis</b>: a few simple questions, a few commands and plenty of attention. In this unit we learn to see missing and unusual values; what to do with them is the next unit's topic.")}</p>
${sec(1, 0, t("Sezgi: doktorun ilk muayenesi", "Intuition: the doctor's first examination"), analogy("🩺", t(
      "İyi bir doktor tedaviye başlamadan önce ateşi, nabzı ve tansiyonu ölçer. Değerlerden biri olağandışıysa önce ölçümü tekrarlar: <b>cihaz mı hatalı, hasta mı?</b> Veri de böyledir: olağandışı bir değer bir yazım hatası da olabilir, çok önemli bir gerçek de.",
      "A good doctor measures temperature, pulse and blood pressure before starting treatment. If a value is unusual, they first repeat the measurement: <b>is the device wrong, or the patient?</b> Data are the same: an unusual value may be a typo, or a very important fact.")))}
${sec(2, 1, t("Üç ilk soru", "Three first questions"), cards([
      [0, "📐", t("Kaç satır, kaç sütun? Türleri ne?", "How many rows and columns? What types?"), t("Beklediğin boyutta mı? Sayısal olması gereken sütun metin mi gelmiş?", "Is the size what you expected? Has a numeric column arrived as text?"), "veri.shape · veri.dtypes"],
      [1, "🕳️", t("Eksik değer var mı?", "Any missing values?"), t("Her sütundaki eksik sayısı. pandas eksikleri NaN olarak gösterir.", "The number missing in each column. pandas shows gaps as NaN."), "veri.isna().sum()"],
      [2, "📊", t("Değerler makul mü?", "Are the values plausible?"), t("Ortalama, medyan, en küçük ve en büyük değer. Bir değer diğerlerinden çok mu farklı?", "Mean, median, minimum and maximum. Is any value very different from the rest?"), "veri.describe()"]
    ].map((c) => (lang === "en" ? [c[0], c[1], c[2], c[3], c[4].replace(/veri/g, "data")] : c))))}
${sec(3, 2, t("Aykırı değeri bulmak: çeyrekler arası açıklık kuralı", "Finding outliers: the interquartile range rule"), formula(t("alt sınır = Q1 − 1,5 × (Q3 − Q1)&nbsp;&nbsp;&nbsp;&nbsp;üst sınır = Q3 + 1,5 × (Q3 − Q1)", "lower fence = Q1 − 1.5 × (Q3 − Q1)&nbsp;&nbsp;&nbsp;&nbsp;upper fence = Q3 + 1.5 × (Q3 − Q1)"), [["Q1, Q3", t("birinci ve üçüncü çeyrek: verinin %25'i Q1'in altında, %25'i Q3'ün üstünde", "first and third quartile: 25% of the data lie below Q1, 25% above Q3")], ["Q3 − Q1", t("çeyrekler arası açıklık: verinin ortadaki yarısının genişliği", "interquartile range: the width of the middle half of the data")]]) +
      fig("u6_box", lang, t("<b>Şekil 1.</b> Kredi tablosundaki 10 müşterinin kart harcaması. Kutu, verinin ortadaki yarısı; kırmızı kesikli çizgi üst sınır. 48.000 TL sınırın çok üstünde.", "<b>Figure 1.</b> Card spending of the 10 customers in the loan table. The box is the middle half of the data; the red dashed line is the upper fence. 48,000 is far above it.")))}
${sec(4, 3, t("Çözümlü örnek: sınırları elle hesaplamak", "Worked example: computing the fences by hand"), steps([
      t("Sırala: 4.200 · 5.000 · 5.300 · 5.600 · 5.900 · 6.100 · 6.400 · 6.900 · 7.000 · 48.000.", "Sort: 4,200 · 5,000 · 5,300 · 5,600 · 5,900 · 6,100 · 6,400 · 6,900 · 7,000 · 48,000."),
      t(`Çeyrekler (pandas'ın varsayılan yöntemiyle): Q1 = ${n0(s.q1)}, Q3 = ${n0(s.q3)}; açıklık = ${n0(s.iqr)}.`, `Quartiles (pandas' default method): Q1 = ${n0(s.q1)}, Q3 = ${n0(s.q3)}; IQR = ${n0(s.iqr)}.`),
      t(`Sınırlar: alt = ${n0(s.q1)} − 1,5 × ${n0(s.iqr)} = ${n0(s.lo)}; üst = ${n0(s.q3)} + 1,5 × ${n0(s.iqr)} = ${n0(s.hi)}.`, `Fences: lower = ${n0(s.q1)} − 1.5 × ${n0(s.iqr)} = ${n0(s.lo)}; upper = ${n0(s.q3)} + 1.5 × ${n0(s.iqr)} = ${n0(s.hi)}.`),
      t("Sınır dışında yalnızca 48.000 var: <b>incelemeye alınacak</b> tek gözlem.", "Only 48,000 lies outside: the single observation <b>to investigate</b>.")
    ]) + table([t("Ölçü", "Measure"), t("10 müşteri", "10 customers"), t("48.000 olmadan", "Without 48,000"), t("Değişim", "Change")], [
      { cls: "bad", cells: [t("Ortalama", "Mean"), n0(s.mean), n0(s.mean_wo), "+" + nf((s.mean / s.mean_wo - 1) * 100, 0, lang) + " %"] },
      { cls: "hl", cells: [t("Medyan", "Median"), n0(s.median), n0(s.median_wo), "+" + nf((s.median / s.median_wo - 1) * 100, 0, lang) + " %"] }
    ], { num: [1, 2, 3] }) + `<p>${t("Tek bir gözlem ortalamayı yüzde 70'ten fazla yukarı çekiyor; medyan ise ortadaki değer olduğu için neredeyse kıpırdamıyor.", "A single observation pulls the mean up by more than 70 percent; the median, being the middle value, barely moves.")}</p>`)}
${sec(5, 4, t("Aykırı değer hata mı?", "Is an outlier an error?"), table([t("Olasılık", "Possibility"), t("Örnek", "Example"), t("Ne yapılır?", "What to do")], [
      [t("Yazım hatası", "Typo"), t("4.800 yerine 48.000", "48,000 instead of 4,800"), t("kaynağı kontrol et, düzelt", "check the source, correct it")],
      [t("Gerçek ve önemli", "Real and important"), t("kriz ayı, dolandırıcılık, büyük bir alım", "a crisis month, fraud, a large purchase"), t("koru; belki asıl ilgilendiğin şey budur", "keep it; it may be exactly what you care about")],
      [t("Farklı bir kitle", "A different population"), t("bireysel müşteriler arasında bir şirket kartı", "a company card among personal customers"), t("ayrı ele al", "treat it separately")]
    ]) + `<p>${t("Kural: aykırı değeri <b>otomatik olarak silme</b>. Önce kaynağını sorgula.", "Rule: don't <b>automatically delete</b> an outlier. Question its source first.")}</p>`)}
${sec(6, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Veriye bakmadan modele geçmek", "Jumping to the model without looking"), t("Eksikler ve aykırılar modeli sessizce bozar.", "Gaps and outliers silently distort the model."), t("<code>shape</code>, <code>dtypes</code>, <code>isna().sum()</code>, <code>describe()</code>.", "<code>shape</code>, <code>dtypes</code>, <code>isna().sum()</code>, <code>describe()</code>.")],
      [t("Aykırı değeri refleksle silmek", "Deleting outliers by reflex"), t("Krizler ve dolandırıcılık da aykırıdır.", "Crises and fraud are outliers too."), t("Silmeden önce açıkla.", "Explain before deleting.")],
      [t("Yalnızca ortalamaya bakmak", "Looking only at the mean"), t("Ortalama tek bir uç değerle sürüklenir.", "The mean is dragged by a single extreme value."), t("Medyanı da raporla.", "Report the median too.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Üç soru: boyut ve türler, eksikler, makullük.", "Three questions: size and types, gaps, plausibility."), t("Çeyrekler arası açıklık kuralı, incelenecek değerleri işaretler; silinecekleri değil.", "The IQR rule flags values to investigate, not values to delete."), t("Ortalama aykırı değere duyarlı, medyan dayanıklıdır.", "The mean is sensitive to outliers; the median is robust.")])}
${link(lang, 2, t("veriyi tanımak", "getting to know the data"))}`);
  };

  /* ------------------------------------------------------------ Ünite 7 */
  B["m1-u7"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    const m = N.u7 || { mean: 46625, median: 47500 };
    return wrap(`
<p class="c-lead">${t("Eksik değerle ne yapılacağı, verinin <b>neden</b> eksik olduğuna bağlıdır (Rubin, 1976). Bu ünitede üç eksiklik mekanizmasını ve üç yaygın seçeneği görüyoruz: silmek, doldurmak ve doldurup işaretlemek.",
      "What to do with a missing value depends on <b>why</b> it is missing (Rubin, 1976). In this unit we see three missingness mechanisms and three common options: drop, fill, and fill plus flag.")}</p>
${sec(1, 0, t("Sezgi: boş bırakılan anket sorusu", "Intuition: the blank survey question"), analogy("📮", t(
      "Bir anket formu postada kaybolduysa, kaybolanlar diğerlerinden farklı değildir. Ama “aylık geliriniz?” sorusunu özellikle geliri düşük olanlar boş bırakıyorsa, <b>boşluğun kendisi bir bilgidir</b>: o kişilerin gelirini ortalamayla doldurursan onları olduğundan zengin gösterirsin.",
      "If a survey form is lost in the post, the lost ones are no different from the rest. But if it is mainly low earners who leave “monthly income?” blank, <b>the blank itself is information</b>: fill their income with the average and you make them look richer than they are.")))}
${sec(2, 1, t("Üç eksiklik mekanizması", "Three missingness mechanisms"), fig("u7_mech", lang, t("<b>Şekil 1.</b> Simüle veri: yaş ile gelir. İçi boş kırmızı daireler, gerçek değeri olan ama veride eksik görünen gözlemler. Eksiklik değerin kendisine bağlıysa, gözlenen gelir ortalaması gerçeğinden belirgin biçimde yüksek çıkıyor.", "<b>Figure 1.</b> Simulated data: age and income. Hollow red circles are observations that have a true value but appear missing. When missingness depends on the value itself, the observed mean income is clearly higher than the true one.")) + table([t("Mekanizma", "Mechanism"), t("Örnek", "Example"), t("Sonuç", "Consequence")], [
      [t("Tamamen rastgele", "Completely at random"), t("form postada kayboldu", "the form was lost in the post"), t("eksikler diğerlerinden farklı değil; silmek yalnızca bilgi kaybettirir", "the missing are no different; dropping only loses information")],
      [t("Gözlenen bir şeye bağlı", "Depends on something observed"), t("gençler geliri daha sık boş bırakıyor", "young people leave income blank more often"), t("yaşı bildiğimiz için hesaba katabiliriz", "we know age, so we can account for it")],
      { cls: "bad", cells: [t("Değerin kendisine bağlı", "Depends on the value itself"), t("geliri düşük olanlar bildirmek istemiyor", "low earners don't want to report"), t("eksiklik başlı başına bilgi taşır; basit doldurma yanıltır", "missingness itself carries information; simple filling misleads")] }
    ]))}
${sec(3, 2, t("Üç seçenek", "Three options"), table([t("Seçenek", "Option"), t("Artısı", "Pro"), t("Eksisi", "Con")], [
      [t("Satırı silmek", "Drop the row"), t("basit", "simple"), t("bilgi kaybı; eksikler rastgele değilse sonuçlar yanlı", "information loss; biased results if gaps aren't random")],
      [t("Ortalama ya da medyanla doldurmak", "Fill with mean or median"), t("satırlar korunur; medyan aykırılara dayanıklı", "rows are kept; the median resists outliers"), t("“eksikti” bilgisi kaybolur; dağılım daralır", "the “was missing” information is lost; the spread narrows")],
      { cls: "hl", cells: [t("Doldur + eksiklik göstergesi", "Fill + missingness indicator"), t("satırlar korunur, eksiklik bilgisi 0/1 sütunda saklanır", "rows kept, missingness stored in a 0/1 column"), t("bir sütun daha", "one more column")] }
    ]))}
${sec(4, 3, t("Çözümlü örnek: kredi tablosunda eksik gelir", "Worked example: missing income in the loan table"), fig("u7_impute", lang, t("<b>Şekil 2.</b> Önce gösterge sütunu oluşturulur, sonra eksikler medyanla doldurulur. Sıra önemlidir: doldurduktan sonra hangi değerin eksik olduğunu ayırt edemezsin.", "<b>Figure 2.</b> First the indicator column is created, then the gaps are filled with the median. The order matters: after filling you cannot tell which values were missing.")) +
      code(t('kredi["eksik_gelir"] = kredi["gelir"].isna().astype(int)   # 1) önce gösterge\nmedyan = kredi["gelir"].median()                           # 2) medyan: ' + nf(m.median, 0, "tr") + '\nkredi["gelir"] = kredi["gelir"].fillna(medyan)             # 3) sonra doldur',
        'loans["missing_income"] = loans["income"].isna().astype(int)   # 1) indicator first\nmedian = loans["income"].median()                               # 2) median: ' + nf(m.median, 0, "en") + '\nloans["income"] = loans["income"].fillna(median)                # 3) then fill')) +
      steps([t(`Gözlenen 8 gelirin ortalaması ${nf(m.mean, 0, "tr")}, medyanı ${nf(m.median, 0, "tr")} TL.`, `The 8 observed incomes have mean ${nf(m.mean, 0, "en")} and median ${nf(m.median, 0, "en")}.`),
        t("Geliri eksik iki müşterinin <b>ikisi de</b> temerrüde düşmüş. Gözlenen 8 müşteride temerrüt oranı 2/8 = %25.", "<b>Both</b> customers with missing income defaulted. Among the 8 observed customers the default rate is 2/8 = 25%."),
        t("Eksiklik bilgi taşıyor gibi görünüyor (10 gözlemle kesin konuşulamaz). Gösterge sütunu, model bu bilgiyi kullanabilsin diye saklanır.", "Missingness seems to carry information (10 observations are too few to be sure). The indicator column keeps it so the model can use it.")]))}
${sec(5, 4, t("İki kural", "Two rules"), cards([
      [1, "1️⃣", t("Gösterge önce", "Indicator first"), t("Gösterge sütununu doldurmadan <b>önce</b> oluştur; sonra eksikleri ayırt edemezsin.", "Create the indicator <b>before</b> filling; afterwards you can't tell which were missing.")],
      [4, "2️⃣", t("Hedefi asla doldurma", "Never fill the target"), t("Sonucu bilinmeyen bir gözlemin hedefine değer yazmak uydurma bir cevap üretmektir. Hedefi eksik satırlar öğrenmede kullanılmaz; öngörü yapılacak gözlemlerdir.", "Writing a value into an unknown target invents an answer. Rows with a missing target are not used for learning; they are the ones to predict.")]
    ]))}
${sec(6, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Nedenini sormadan doldurmak", "Filling without asking why"), t("Eksiklik değere bağlıysa doldurma sistematik bir yanlılık yaratır.", "If missingness depends on the value, filling creates systematic bias."), t("Önce eksiklerin diğerlerinden farklı olup olmadığına bak.", "First check whether the missing differ from the rest.")],
      [t("Sıfırla doldurmak", "Filling with zero"), t("Gelir “bilinmiyor” ile “sıfır” çok farklıdır.", "Income “unknown” and “zero” are very different."), t("Medyan + gösterge.", "Median + indicator.")],
      [t("Göstergeyi doldurduktan sonra oluşturmak", "Creating the indicator after filling"), t("Artık hiçbir değer eksik görünmez; gösterge hep 0 olur.", "No value looks missing any more; the indicator is always 0."), t("Önce gösterge, sonra doldurma.", "Indicator first, then fill.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Ne yapacağın verinin neden eksik olduğuna bağlıdır.", "What you do depends on why the data are missing."), t("Medyan aykırılara dayanıklıdır; gösterge sütunu eksiklik bilgisini saklar.", "The median resists outliers; the indicator column keeps the missingness information."), t("Gösterge önce oluşturulur; hedef asla doldurulmaz.", "The indicator comes first; the target is never filled.")])}
${link(lang, 2, t("eksik veri", "missing data"))}`);
  };

  /* ------------------------------------------------------------ Ünite 8 */
  B["m1-u8"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    const S = N.u8 || { raw: { AB: 1000.6, AC: 15000 }, std: { AB: 3.5, AC: 1.5 }, z: { A: [-1.5, -1], B: [2, -0.9], C: [-1.4, 0.5] } };
    const z = (k, i) => nf(S.z[k][i], 1, lang);
    return wrap(`
<p class="c-lead">${t("Bazı yöntemler gözlemler arasındaki uzaklığa ya da değişkenlerin büyüklüğüne bakar. O zaman değişkenlerin <b>birimi</b>, sonucu verinin kendisinden daha çok belirleyebilir. Ölçekleme bu sorunu giderir.",
      "Some methods look at the distance between observations or the size of variables. Then the variables' <b>units</b> can decide the result more than the data themselves. Scaling fixes this.")}</p>
${sec(1, 0, t("Sezgi: metre ve kilometre", "Intuition: metres and kilometres"), analogy("📏", t(
      "İki şehrin benzerliğini nüfus (kişi) ve ortalama sıcaklık (°C) ile ölçmeye çalıştığını düşün. Nüfus farkı yüz binlerle, sıcaklık farkı birkaç dereceyle ifade edilir. Ham sayılarla hesap yaparsan sıcaklık hiç önemsenmez. Nüfusu milyon kişi cinsinden yazsan sonuç değişir. <b>Sonuç verinin değil, seçtiğin birimin eseri olur.</b>",
      "Imagine measuring how similar two cities are by population (people) and average temperature (°C). Population gaps are in the hundreds of thousands, temperature gaps a few degrees. Compute with raw numbers and temperature is ignored. Write population in millions and the answer changes. <b>The result is an artefact of your units, not the data.</b>")))}
${sec(2, 1, t("A kime benziyor?", "Who does A resemble?"), table([t("Kişi", "Person"), t("Yaş", "Age"), t("Gelir (TL)", "Income (TL)")], [["A", "25", nf(30000, 0, lang)], ["B", "60", nf(31000, 0, lang)], ["C", "26", nf(45000, 0, lang)]], { num: [1, 2] }) +
      `<p>${t("Sezgimiz A'nın C'ye benzediğini söyler: neredeyse aynı yaştalar, gelir farkı makul. Peki ham birimlerle hesaplanan uzaklık ne diyor?", "Intuition says A resembles C: almost the same age, a reasonable income gap. What does distance in raw units say?")}</p>` +
      fig("u8_scale", lang, t("<b>Şekil 1.</b> Solda ham birimler: gelir farkının binleri yaş farkının onlarını ezer ve A, B'ye “yakın” çıkar. Sağda standartlaştırılmış değerler: iki değişken eşit söz hakkına sahip ve A, C'ye yakın.", "<b>Figure 1.</b> Left, raw units: the thousands in the income gap swamp the tens in the age gap, and A comes out “close” to B. Right, standardised values: both variables have an equal say and A is close to C.")))}
${sec(3, 2, t("Standartlaştırma", "Standardisation"), formula("z = (x − " + t("ortalama", "mean") + ") / " + t("standart sapma", "standard deviation"), [["z", t("değerin ortalamadan kaç standart sapma uzakta olduğu", "how many standard deviations the value is from the mean")], [t("sonuç", "result"), t("her sütunun ortalaması 0, standart sapması 1 olur", "every column has mean 0 and standard deviation 1")], ["z = 1,5".replace(",", lang === "tr" ? "," : "."), t("“ortalamanın 1,5 standart sapma üstünde”", "“1.5 standard deviations above the mean”")]]))}
${sec(4, 3, t("Çözümlü örnek: z değerleri ve uzaklıklar", "Worked example: z values and distances"), `<p>${t("Referans: müşteri tabanında yaş ortalaması 40 (s = 10), gelir ortalaması 40.000 (s = 10.000).", "Reference: in the customer base, mean age 40 (sd = 10), mean income 40,000 (sd = 10,000).")}</p>` +
      table([t("Kişi", "Person"), t("z (yaş)", "z (age)"), t("z (gelir)", "z (income)")], [["A", t("(25 − 40) / 10 = ", "(25 − 40) / 10 = ") + z("A", 0), "(30.000 − 40.000) / 10.000 = ".replace(/\./g, lang === "tr" ? "." : ",") + z("A", 1)], ["B", "(60 − 40) / 10 = " + z("B", 0), z("B", 1)], ["C", "(26 − 40) / 10 = " + z("C", 0), z("C", 1)]]) +
      table([t("Uzaklık", "Distance"), t("Ham birimler", "Raw units"), t("Standartlaştırılmış", "Standardised")], [
        ["A–B", nf(S.raw.AB, 0, lang), nf(S.std.AB, 2, lang)], { cls: "hl", cells: ["A–C", nf(S.raw.AC, 0, lang), nf(S.std.AC, 2, lang)] }, { cls: "bad", cells: [t("A'ya en yakın", "Closest to A"), "B", "C"] }
      ], { num: [1, 2] }) +
      steps([t("Uzaklık, iki noktanın farklarının karelerinin toplamının köküdür: √(Δyaş² + Δgelir²).", "Distance is the square root of the sum of squared differences: √(Δage² + Δincome²)."),
        t("Ham birimlerde A–B: √(35² + 1.000²) ≈ 1.001; A–C: √(1² + 15.000²) ≈ 15.000. Yaş farkı hesaba neredeyse hiç girmiyor.", "In raw units A–B: √(35² + 1,000²) ≈ 1,001; A–C: √(1² + 15,000²) ≈ 15,000. The age gap barely enters."),
        t(`Standartlaştırılmış: A–B = ${nf(S.std.AB, 2, "tr")}, A–C = ${nf(S.std.AC, 2, "tr")}. Karar sezgimizle uyumlu hâle geldi.`, `Standardised: A–B = ${nf(S.std.AB, 2, "en")}, A–C = ${nf(S.std.AC, 2, "en")}. The decision now agrees with intuition.`)]))}
${sec(5, 4, t("Ölçekleme neyi değiştirmez?", "What does scaling not change?"), cards([
      [0, "🔗", t("İlişkiler", "Relationships"), t("Değişkenler arasındaki korelasyon aynı kalır; değişen yalnızca birim.", "The correlation between variables stays the same; only the unit changes.")],
      [1, "↕️", t("Sıralama", "Ordering"), t("Bir sütun içindeki gözlemlerin sırası değişmez.", "The order of observations within a column does not change.")],
      [2, "🧭", t("Hangi yöntem için?", "For which methods?"), t("Hangi yöntemlerin ölçeklemeye ihtiyaç duyduğunu, o yöntemleri öğrendiğinde göreceksin.", "You will see which methods need scaling when you learn those methods.")]
    ]))}
${sec(6, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Uzaklık hesabında birimleri karıştırmak", "Mixing units in a distance"), t("Büyük rakamlı değişken kararı tek başına verir.", "The variable with big numbers makes the decision alone."), t("Önce standartlaştır.", "Standardise first.")],
      [t("Ölçeklemenin ilişkiyi değiştirdiğini sanmak", "Thinking scaling changes the relationship"), t("Korelasyon ve sıralama aynı kalır.", "Correlation and ordering stay the same."), t("Ölçekleme yalnızca birimi değiştirir.", "Scaling only changes the unit.")],
      [t("Ortalama ve sapmayı rastgele bir gruptan almak", "Taking the mean and sd from an arbitrary group"), t("Üç kişiden hesaplanan sapma çok gürültülüdür.", "An sd from three people is very noisy."), t("Yeterince büyük bir referans veri kullan.", "Use a large enough reference set.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Ham birimlerle uzaklık, büyük rakamlı değişkenin egemenliğidir.", "Distance in raw units is ruled by the variable with big numbers."), t("z = (x − ortalama) / standart sapma; ortalama 0, sapma 1.", "z = (x − mean) / sd; mean 0, sd 1."), t("Ölçekleme ilişkileri değil, birimleri değiştirir.", "Scaling changes units, not relationships.")])}
${link(lang, 2, t("ölçekleme", "scaling"))}`);
  };

  /* ------------------------------------------------------------ Ünite 9 */
  B["m1-u9"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Modeller sayılarla çalışır; “Doğu”, “Batı”, “Merkez” gibi kategorileri doğrudan kullanamaz. Kategorileri sayıya çevirmenin doğru ve yanlış yolları var; bu ünite ikisini de gösteriyor.",
      "Models work with numbers; they cannot use categories like “East”, “West”, “Central” directly. There are right and wrong ways to turn categories into numbers; this unit shows both.")}</p>
${sec(1, 0, t("Sezgi: forma numaraları", "Intuition: shirt numbers"), analogy("⚽", t(
      "Bir futbol takımında 10 numaralı oyuncu, 5 numaralının “iki katı” değildir. Numara yalnızca bir etikettir. Bölgelere 1, 2, 3 numarası verdiğinde de modele tam tersini söylemiş olursun: <b>sanki aralarında bir büyüklük ve sıra varmış gibi</b>.",
      "In a football team, the number 10 player is not “twice” the number 5. The number is just a label. Giving regions the numbers 1, 2, 3 tells the model the opposite: <b>as if there were size and order between them</b>.")))}
${sec(2, 1, t("Yanlış ve doğru kodlama", "Wrong and right encoding"), fig("u9_order", lang, t("<b>Şekil 1.</b> Sırası olmayan kategorilere sayı vermek, verinin söylemediği bir sıra uydurur. Doğal bir sırası olan kategorilerde ise sırayı koruyan sayılar kullanılabilir.", "<b>Figure 1.</b> Numbering categories that have no order invents an order the data do not contain. For categories with a natural order, order-preserving numbers can be used.")))}
${sec(3, 2, t("Kukla değişkenler (one-hot kodlama)", "Dummy variables (one-hot encoding)"), fig("u9_onehot", lang, t("<b>Şekil 2.</b> Her kategori için bir 0/1 sütunu. Her satırda tam olarak bir sütun 1'dir; bu yüzden toplamları hep 1'dir.", "<b>Figure 2.</b> One 0/1 column per category. Exactly one column is 1 in each row, so they always sum to 1.")) +
      `<p>${t("Bir müşteri Doğu'daysa <code>bolge_Doğu</code> = 1, diğerleri 0. Ekonometrideki kukla değişkenlerin aynısı.", "If a customer is in the East, <code>region_East</code> = 1 and the others 0. Exactly the dummy variables of econometrics.")}</p>`)}
${sec(4, 3, t("Kukla tuzağı ve referans grup", "The dummy trap and the reference group"), formula(t("bolge_Batı + bolge_Doğu + bolge_Merkez = 1 = sabit terim", "region_Central + region_East + region_West = 1 = the constant"), [[t("sorun", "problem"), t("bir sütun diğerlerinden tam olarak hesaplanabilir; doğrusal bir model katsayıları ayıramaz (Ünite 2'deki sorunun en uç hâli)", "one column can be computed exactly from the others; a linear model cannot separate the coefficients (the extreme case of the problem in Unit 2)")], [t("çözüm", "fix"), t("bir kategoriyi dışarıda bırak: <code>drop_first=True</code>", "leave one category out: <code>drop_first=True</code>")], [t("yorum", "reading"), t("dışarıda kalan kategori referans grup olur; diğer katsayılar ona göre yorumlanır", "the omitted category becomes the reference group; other coefficients are read relative to it")]]))}
${sec(5, 4, t("Çözümlü örnek: kodla", "Worked example: in code"), code(t('kukla = pd.get_dummies(kredi["bolge"], prefix="bolge", drop_first=True, dtype=int)\nkukla.columns.tolist()     # [\'bolge_Doğu\', \'bolge_Merkez\']  → Batı referans\nassert len(kukla) == len(kredi)\n\nnot_sira = {"BBB": 1, "A": 2, "AA": 3, "AAA": 4}     # sırayı elle, bilerek ver\nkredi["not_sayi"] = kredi["not"].map(not_sira)\nassert kredi["not_sayi"].notna().all()            # eşleşmeyen not kalmadı',
      'dummies = pd.get_dummies(loans["region"], prefix="region", drop_first=True, dtype=int)\ndummies.columns.tolist()   # [\'region_East\', \'region_West\']  → Central is the reference\nassert len(dummies) == len(loans)\n\ngrade_order = {"BBB": 1, "A": 2, "AA": 3, "AAA": 4}   # assign the order by hand, on purpose\nloans["grade_num"] = loans["grade"].map(grade_order)\nassert loans["grade_num"].notna().all()            # no unmatched grade left')) +
      table([t("Değişken", "Variable"), t("Doğal sıra var mı?", "Natural order?"), t("Kodlama", "Encoding")], [
        [t("bölge, sektör, il", "region, sector, province"), t("hayır", "no"), t("kukla değişkenler", "dummy variables")], [t("kredi notu, eğitim düzeyi", "credit grade, education level"), t("evet", "yes"), t("sırayı koruyan sayılar (elle)", "order-preserving numbers (by hand)")], { cls: "bad", cells: [t("bölge → 1, 2, 3", "region → 1, 2, 3"), t("hayır", "no"), t("yanlış: sahte sıra", "wrong: a fake order")] }
      ]))}
${sec(6, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Kategorilere sırayla numara vermek", "Numbering categories in sequence"), t("Model “Merkez = 3 × Doğu” gibi anlamsız bir ilişki öğrenebilir.", "The model may learn a meaningless relation like “Central = 3 × East”."), t("Sırası olmayan kategoride kukla kullan.", "Use dummies for categories without order.")],
      [t("Tüm kuklaları sabitle birlikte modele koymak", "Putting all dummies in with a constant"), t("Kukla tuzağı: katsayılar ayrılamaz.", "The dummy trap: coefficients cannot be separated."), t("<code>drop_first=True</code>; referans grubu yaz.", "<code>drop_first=True</code>; state the reference group.")],
      [t("Sıralı kodlamayı otomatik yapmak", "Encoding ordinal categories automatically"), t("Alfabetik sıra (A, AA, AAA, BBB) gerçek sırayı bozar.", "Alphabetical order (A, AA, AAA, BBB) breaks the real order."), t("Eşleştirme sözlüğünü elle yaz.", "Write the mapping dictionary by hand.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Sırası olmayan kategori → kukla değişkenler; her kategori için bir 0/1 sütunu.", "Category without order → dummy variables, one 0/1 column per category."), t("Sabit terimle birlikte bir kategoriyi dışarıda bırak; o referans grup olur.", "With a constant, leave one category out; it becomes the reference group."), t("Doğal sırası olan kategoride sırayı elle ve bilerek kodla.", "For a category with a natural order, encode the order by hand and on purpose.")])}
${link(lang, 2, t("kategorik değişkenler", "categorical variables"))}`);
  };

  const C = {};
  const hat = (s) => s.replace(/β̂/g, '<span class="hat">β</span>');
  Object.keys(B).forEach((id) => { C[id] = { tr: hat(B[id]("tr")), en: hat(B[id]("en")) }; });
  K.apply(U, C, 8);
  K.prepend(U, "m1-u10", F, "u10_avail", { tr: "<b>Şekil 1.</b> Üç serinin başlangıç tarihleri. Ortak dönem 1982'de başlıyor.", en: "<b>Figure 1.</b> The three series' start dates. The common period starts in 1982." });
})();
