/* Modül 4 — genişletilmiş kavram anlatımları (şekil, tablo, çözümlü örnek, sık hatalar, özet)
 * Şekiller tools/m4_figs.py ile üretilir (window.M4_FIGS). Bileşenler: content/concept-kit.js
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 */
(function () {
  "use strict";
  const K = window.CK, F = window.M4_FIGS || {};
  const U = window.M4_UNITS || [];
  if (!K) return;
  const { sec, cards, pit, sum, analogy, formula, steps, table, code, vs, wrap, nf, link } = K;
  const fig = (name, lang, cap) => K.fig(F, name, lang, cap);
  const B = {};
  const pc = (x, d, lang) => (lang === "tr" ? "%" + nf(x, d, lang) : nf(x, d, lang) + "%");

  /* ------------------------------------------------------------ Ünite 1 */
  B["m4-u1"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Şimdiye kadar hedef bir sayıydı: ücret, enflasyon. Bu modülde hedef bir <b>sınıf</b>: başvuran krediyi öder mi, ödemez mi? Bankanın asıl istediği ise bir “evet/hayır” değil, bir <b>olasılık</b>: bu başvurunun temerrüde düşme olasılığı ne?", "So far the target was a number: wages, inflation. In this module the target is a <b>class</b>: will the applicant repay or not? What the bank really wants, though, is not a yes/no but a <b>probability</b>: how likely is this application to default?")}</p>
${sec(1, 0, t("Sezgi: hava durumu gibi", "Intuition: like a weather forecast"), analogy("🌦️", t("Meteoroloji “yarın yağmur yağacak” demez; “yağış olasılığı %70” der. Şemsiye alıp almamak sana kalır. Kredi riski de böyle: model bir olasılık verir, kararı (onay ya da ret) bir eşik verir. Bu ünite olasılığı, sonraki üniteler kararı anlatıyor.", "A forecaster does not say “it will rain tomorrow”; they say “a 70% chance of rain”. Whether to take an umbrella is up to you. Credit risk works the same way: the model gives a probability, a threshold gives the decision (approve or reject). This unit is about the probability; the following units are about the decision.")))}
${sec(2, 1, t("İlk deneme: EKK ile 0/1 hedef", "First attempt: OLS with a 0/1 target"), fig("u1_lpm", lang, t("<b>Şekil 1.</b> 3.000 başvuruda borç/gelir oranı ve temerrüt (üstte 1, altta 0). Düz çizgi (EKK) düşük borçlularda sıfırın altına iniyor; S eğrisi (lojistik regresyon) hep 0 ile 1 arasında.", "<b>Figure 1.</b> Debt/income ratio and default for 3,000 applications (1 at the top, 0 at the bottom). The straight line (OLS) goes below zero for low-debt applicants; the S curve (logistic regression) always stays between 0 and 1.")) +
      `<p>${t("Temerrüdü 0/1 kodlayıp EKK kurmaya <b>doğrusal olasılık modeli</b> denir. Ekonometride sık kullanılır ve ortalama etkiyi kestirmek için çoğu zaman iş görür. Ama öngörü aracı olarak bir kusuru var: 20.000 yeni başvurunun %16,5'ine negatif “olasılık” veriyor.", "Coding default as 0/1 and running OLS is called the <b>linear probability model</b>. It is common in econometrics and often works for estimating an average effect. As a prediction tool, though, it has a flaw: it gives 16.5% of 20,000 new applications a negative “probability”.")}</p>`)}
${sec(3, 2, t("Lojistik regresyon: skoru S eğrisinden geçirmek", "Logistic regression: passing the score through an S curve"), formula("p = 1 / (1 + e<sup>−z</sup>),   z = β<sub>0</sub> + β<sub>1</sub>x<sub>1</sub> + … + β<sub>k</sub>x<sub>k</sub>", [["z", t("doğrusal skor (EKK'daki gibi), −∞ ile +∞ arasında", "linear score (as in OLS), between −∞ and +∞")], ["p", t("temerrüt olasılığı, her zaman 0 ile 1 arasında", "default probability, always between 0 and 1")], [t("kestirim", "estimation"), t("en çok olabilirlik: gözlenen 0/1'leri en olası kılan β'lar", "maximum likelihood: the βs that make the observed 0/1s most likely")]]) +
      table(["z", "−4", "−2", "0", "2", "4"], [["p", nf(0.018, 3, lang), nf(0.119, 3, lang), nf(0.5, 3, lang), nf(0.881, 3, lang), nf(0.982, 3, lang)]], { num: [1, 2, 3, 4, 5] }) +
      `<p>${t("Skor sıfırken olasılık 0,5. Skor büyüdükçe olasılık 1'e, küçüldükçe 0'a yaklaşır ama hiç ulaşmaz. Eğrinin ortası dik, uçları yatık.", "At a score of zero the probability is 0.5. As the score grows the probability approaches 1, as it falls it approaches 0, never reaching either. The curve is steep in the middle and flat at the ends.")}</p>`)}
${sec(4, 3, t("scikit-learn'de", "In scikit-learn"), code(t(`logit = LogisticRegression(C=1e6, max_iter=2000).fit(X_egt, y_egt)
p = logit.predict_proba(X_tst)[:, 1]    # [:, 0] ödeme, [:, 1] temerrüt olasılığı
k = logit.predict(X_tst)                # eşik 0,5'te 0/1 karar (Ünite 3)`, `logit = LogisticRegression(C=1e6, max_iter=2000).fit(X_tr, y_tr)
p = logit.predict_proba(X_te)[:, 1]     # [:, 0] repayment, [:, 1] default probability
k = logit.predict(X_te)                 # 0/1 decision at threshold 0.5 (Unit 3)`)) + cards([
      [0, "🎚️", "C=1e6", t("scikit-learn lojistik regresyona varsayılan olarak bir ceza (Modül 3'teki Ridge gibi) ekler. C çok büyük olunca ceza fiilen kalkar: ekonometrideki logit.", "scikit-learn adds a penalty to logistic regression by default (like Ridge in Module 3). With a very large C the penalty effectively disappears: the econometric logit.")],
      [1, "📊", "predict_proba", t("Her satır için iki sütun: 0 ve 1 sınıflarının olasılıkları. Toplamları 1.", "Two columns per row: the probabilities of classes 0 and 1. They add up to 1.")],
      [3, "⚠️", "predict", t("Olasılığı 0,5'te keser. Kararın eşiği her zaman 0,5 olmak zorunda değil.", "Cuts the probability at 0.5. The decision threshold need not always be 0.5.")]
    ]))}
${sec(5, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Doğrusal olasılık modelinin öngörüsünü olasılık diye sunmak", "Presenting LPM predictions as probabilities"), t("0–1 dışına taşabilir.", "They can go outside 0–1."), t("Olasılık için lojistik regresyon ve <code>predict_proba</code>.", "For a probability use logistic regression and <code>predict_proba</code>.")],
      [t("<code>predict_proba</code>'nın ilk sütununu almak", "Taking the first column of <code>predict_proba</code>"), t("İlk sütun 0 (ödeme) sınıfının olasılığıdır.", "The first column is the probability of class 0 (repayment)."), t("<code>[:, 1]</code>.", "<code>[:, 1]</code>.")],
      [t("Olasılığı kesinlik sanmak", "Mistaking a probability for certainty"), t("%3 olasılık “ödeyecek” demek değildir; yüz benzer başvurudan üçü temerrüde düşer.", "A 3% probability does not mean “will repay”; three in a hundred similar applications default."), t("Olasılık ile kararı ayrı tut.", "Keep the probability and the decision apart.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Sınıflandırmada model önce bir olasılık üretir.", "In classification the model first produces a probability."), t("Lojistik fonksiyon olasılığı 0 ile 1 arasında tutar.", "The logistic function keeps the probability between 0 and 1."), t("Olasılık ile karar ayrı adımlardır.", "The probability and the decision are separate steps.")])}
${link(lang, 5, t("lojistik regresyon", "logistic regression"))}`);
  };

  /* ------------------------------------------------------------ Ünite 2 */
  B["m4-u2"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Lojistik regresyonun katsayıları EKK katsayıları gibi okunmaz: “x bir birim artınca olasılık β artar” <b>yanlıştır</b>. Katsayılar <b>log-odds</b> cinsindendir. Bu ünite onları doğru okumayı anlatıyor.", "Logistic regression coefficients are not read like OLS coefficients: “when x rises by one unit the probability rises by β” is <b>wrong</b>. The coefficients are in <b>log-odds</b>. This unit is about reading them correctly.")}</p>
${sec(1, 0, t("Sezgi: bahis oranları", "Intuition: betting odds"), analogy("🎲", t("Bahisçiler olasılık yerine <b>odds</b> konuşur: “4'e 1” demek dört kez kaybetmeye karşı bir kez kazanmak, yani p = 0,2 demektir. Odds = p / (1 − p) = 0,25. Lojistik regresyon, odds'un logaritmasını doğrusal bir skorla modeller.", "Bookmakers talk in <b>odds</b> rather than probabilities: “4 to 1” means one win against four losses, i.e. p = 0.2. Odds = p / (1 − p) = 0.25. Logistic regression models the logarithm of the odds with a linear score.")))}
${sec(2, 1, t("Üç ölçek", "Three scales"), table([t("Ölçek", "Scale"), t("Tanım", "Definition"), t("Aralık", "Range"), t("p = 0,2 için", "For p = 0.2")], [
      [t("olasılık", "probability"), "p", "0 – 1", nf(0.2, 2, lang)], ["odds", "p / (1 − p)", "0 – ∞", nf(0.25, 2, lang)], ["log-odds", "ln(p / (1 − p)) = z", "−∞ – +∞", nf(-1.386, 3, lang)]
    ]) + formula("ln(odds) = β<sub>0</sub> + β<sub>1</sub>x<sub>1</sub> + …   ⇒   odds(x<sub>1</sub> + 1) / odds(x<sub>1</sub>) = e<sup>β<sub>1</sub></sup>", [[t("katsayı β", "coefficient β"), t("x bir birim artınca log-odds'taki değişim", "the change in log-odds when x rises by one unit")], [t("odds oranı e<sup>β</sup>", "odds ratio e<sup>β</sup>"), t("x bir birim artınca odds'un çarpıldığı sayı; 1'in üstü riski artırır, altı azaltır", "the number the odds are multiplied by when x rises by one unit; above 1 raises risk, below 1 lowers it")]]))}
${sec(3, 2, t("Çözümlü örnek: kredi dünyasının katsayıları", "Worked example: the credit world's coefficients"), table([t("Değişken", "Variable"), t("Gerçek β", "True β"), t("Kestirilen β", "Estimated β"), t("Odds oranı", "Odds ratio")], [
      [t("Borç/gelir", "Debt/income"), nf(0.9, 1, lang), nf(0.802, 3, lang), nf(2.23, 2, lang)], [t("Önceki gecikme (0/1)", "Past delinquency (0/1)"), nf(1.1, 1, lang), nf(0.951, 3, lang), nf(2.59, 2, lang)],
      [t("Gelir (log)", "Income (log)"), nf(-0.6, 1, lang), nf(-0.594, 3, lang), nf(0.55, 2, lang)], [t("Çalışma süresi", "Years employed"), nf(-0.4, 1, lang), nf(-0.487, 3, lang), nf(0.61, 2, lang)],
      [t("Kart harcaması/gelir", "Card spending/income"), nf(0.5, 1, lang), nf(0.456, 3, lang), nf(1.58, 2, lang)], { cls: "bad", cells: [t("Yaş", "Age"), "0", nf(0.057, 3, lang), nf(1.06, 2, lang)] }
    ], { num: [1, 2, 3] }) + steps([t("Önceki gecikmesi olan bir başvuranın temerrüt odds'u, diğer özellikler sabitken yaklaşık 2,6 katıdır.", "An applicant with a past delinquency has about 2.6 times the odds of default, other features held fixed."), t("Gelir bir standart sapma artınca odds 0,55 ile çarpılır: neredeyse yarıya iner.", "When income rises by one standard deviation the odds are multiplied by 0.55: almost halved."), t("Yaşın gerçek etkisi sıfır ama kestirilen odds oranı 1,06: örneklem gürültüsü ve çalışma süresiyle ilişkisi. Öngörü modelinin katsayısı nedensel etki değildir.", "Age's true effect is zero but its estimated odds ratio is 1.06: sample noise and its link to years employed. A prediction model's coefficient is not a causal effect.")]))}
${sec(4, 3, t("Odds oranı olasılık oranı değildir", "An odds ratio is not a probability ratio"), fig("u2_odds", lang, t("<b>Şekil 1.</b> Aynı odds oranı (2,23) S eğrisinin farklı yerlerinde olasılığı çok farklı miktarlarda değiştirir.", "<b>Figure 1.</b> The same odds ratio (2.23) changes the probability by very different amounts at different points on the S curve.")) +
      vs(t("“Borç/gelir oranı temerrüt olasılığını 2,23 kat artırır.”", "“The debt/income ratio raises the probability of default 2.23 times.”"), `<p>${t("Olasılık %50'den %111'e çıkamaz.", "A probability cannot go from 50% to 111%.")}</p>`, t("“Borç/gelir oranı bir standart sapma artınca temerrüt odds'u 2,23 ile çarpılır.”", "“When the debt/income ratio rises by one standard deviation, the odds of default are multiplied by 2.23.”"), `<p>${t("Olasılıktaki değişim başlangıç noktasına bağlıdır: %5 → %10,5; %50 → %69.", "The change in probability depends on the starting point: 5% → 10.5%; 50% → 69%.")}</p>`))}
${sec(5, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Katsayıyı olasılıktaki değişim diye okumak", "Reading the coefficient as a change in probability"), t("Katsayı log-odds cinsindendir.", "The coefficient is in log-odds."), t("Odds oranını (e<sup>β</sup>) ya da belirli noktalardaki olasılık farkını raporla.", "Report the odds ratio (e<sup>β</sup>) or the probability difference at specific points.")],
      [t("Odds oranını olasılık oranı sanmak", "Mistaking the odds ratio for a probability ratio"), t("İkisi yalnızca olay nadirken birbirine yakındır.", "The two are close only when the event is rare."), t("“Odds … ile çarpılır” de.", "Say “the odds are multiplied by …”.")],
      [t("Değişkenlerin ölçeğini unutmak", "Forgetting the variables' scale"), t("“Bir birim” standartlaştırılmış değişkende bir standart sapmadır.", "“One unit” of a standardised variable is one standard deviation."), t("Birimi her yorumda yaz.", "State the unit in every interpretation.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Katsayılar log-odds, e<sup>β</sup> odds oranıdır.", "Coefficients are log-odds; e<sup>β</sup> is the odds ratio."), t("Odds oranı sabittir; olasılıktaki değişim başlangıç noktasına bağlıdır.", "The odds ratio is constant; the change in probability depends on the starting point."), t("Öngörü modelinin katsayısı nedensel etki değildir.", "A prediction model's coefficient is not a causal effect.")])}
${link(lang, 5, t("odds ve odds oranı", "odds and odds ratios"))}`);
  };

  /* ------------------------------------------------------------ Ünite 3 */
  B["m4-u3"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Banka bir olasılıkla iş yapamaz; bir <b>karar</b> vermesi gerekir: onay ya da ret. Olasılığı karara çeviren şey bir <b>eşiktir</b>: olasılık eşiğin üstündeyse “temerrüt” deyip reddederiz.", "A bank cannot act on a probability; it has to make a <b>decision</b>: approve or reject. What turns the probability into a decision is a <b>threshold</b>: if the probability is above it we say “default” and reject.")}</p>
${sec(1, 0, t("Sezgi: duman dedektörü", "Intuition: a smoke detector")
      , analogy("🚨", t("Çok hassas bir dedektör her tost yandığında öter (yanlış alarm); hassasiyeti düşük bir dedektör gerçek yangını kaçırabilir. Hassasiyet ayarı bir eşiktir. Hiçbir ayar iki hatayı birden sıfırlamaz; yalnızca birini diğerine tercih edersin.", "A very sensitive detector beeps every time the toast burns (false alarm); a less sensitive one may miss a real fire. The sensitivity setting is a threshold. No setting eliminates both errors at once; you can only trade one for the other.")))}
${sec(2, 1, t("Dört olası sonuç: karışıklık matrisi", "Four possible outcomes: the confusion matrix"), table(["", t("Karar: temerrüt (ret)", "Decision: default (reject)"), t("Karar: öder (onay)", "Decision: pays (approve)")], [
      [t("<b>Gerçek: temerrüt</b>", "<b>Actual: default</b>"), t("<b>Doğru pozitif (DP)</b><br>riskli müşteri yakalandı", "<b>True positive (TP)</b><br>risky customer caught"), t("<b>Yanlış negatif (YN)</b><br>kredi verildi, geri dönmedi", "<b>False negative (FN)</b><br>loan granted, not repaid")],
      [t("<b>Gerçek: öder</b>", "<b>Actual: pays</b>"), t("<b>Yanlış pozitif (YP)</b><br>iyi müşteri reddedildi", "<b>False positive (FP)</b><br>good customer rejected"), t("<b>Doğru negatif (DN)</b><br>iyi müşteri onaylandı", "<b>True negative (TN)</b><br>good customer approved")]
    ]) + `<p>${t("“Pozitif”, aradığımız olaydır (temerrüt); iyi ya da kötü anlamına gelmez. scikit-learn'de <code>confusion_matrix(y, karar)</code> bu tabloyu [[DN, YP], [YN, DP]] sırasıyla verir.", "“Positive” is the event we are looking for (default); it does not mean good or bad. In scikit-learn <code>confusion_matrix(y, decision)</code> gives this table in the order [[TN, FP], [FN, TP]].")}</p>`)}
${sec(3, 2, t("Eşik kayınca ne olur?", "What happens when the threshold moves?"), fig("u3_dist", lang, t("<b>Şekil 1.</b> Modelin test başvurularına verdiği olasılıkların dağılımı. Ödeyenler (yeşil) solda yığılıyor ama iki grup iç içe. Eşik 0,5'ten 0,2'ye inince çok daha fazla pembe çubuk ret bölgesine giriyor, ama yeşillerin bir kısmı da.", "<b>Figure 1.</b> The distribution of the probabilities the model gives to test applications. Payers (green) pile up on the left, but the two groups overlap. When the threshold drops from 0.5 to 0.2 many more pink bars enter the rejection region, but so do some green ones.")) +
      table(["", "DP", "YN", "YP", "DN", t("Doğruluk", "Accuracy")].map((x, j) => (lang === "en" ? ["", "TP", "FN", "FP", "TN", "Accuracy"][j] : x)), [
        [t("eşik 0,5", "threshold 0.5"), "308", "1.826".replace(".", lang === "tr" ? "." : ","), "168", "17.698".replace(".", lang === "tr" ? "." : ","), pc(90.0, 1, lang)],
        { cls: "hl", cells: [t("eşik 0,2", "threshold 0.2"), "1.147".replace(".", lang === "tr" ? "." : ","), "987", "2.122".replace(".", lang === "tr" ? "." : ","), "15.744".replace(".", lang === "tr" ? "." : ","), pc(84.5, 1, lang)] },
        { cls: "bad", cells: [t("“herkes öder”", "“everyone pays”"), "0", "2.134".replace(".", lang === "tr" ? "." : ","), "0", "17.866".replace(".", lang === "tr" ? "." : ","), pc(89.3, 1, lang)] }
      ], { num: [1, 2, 3, 4, 5] }))}
${sec(4, 3, t("Doğruluğun tuzağı", "The accuracy trap"), cards([
      [3, "🎯", t("Doğruluk", "Accuracy"), t("(DP + DN) / hepsi. Her hatayı aynı sayar.", "(TP + TN) / all. Counts every error the same.")],
      [4, "🙈", t("“Herkes öder”", "“Everyone pays”"), t("Hiçbir temerrüdü yakalamadan %89,3 doğruluk. Temerrüt nadir olduğu için.", "89.3% accuracy without catching a single default. Because default is rare.")],
      [1, "⚖️", t("Eşik 0,2", "Threshold 0.2"), t("Doğruluk düşüyor (%84,5), ama temerrüdlerin yarısından fazlası yakalanıyor. Hangisi iyi? Hataların maliyetine bağlı (Ünite 6).", "Accuracy falls (84.5%), but more than half of the defaults are caught. Which is better? It depends on the cost of errors (Unit 6).")]
    ]))}
${sec(5, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Eşiği hep 0,5 almak", "Always using 0.5 as the threshold"), t("<code>predict()</code> varsayılan olarak bunu yapar; problem bunu gerektirmez.", "<code>predict()</code> does this by default; the problem does not require it."), t("<code>predict_proba</code> ve bilinçli bir eşik.", "<code>predict_proba</code> and a deliberate threshold.")],
      [t("Dengesiz veride doğruluğa bakmak", "Looking at accuracy with imbalanced data"), t("Hiçbir şey yapmayan kural bile yüksek puan alır.", "Even a do-nothing rule scores high."), t("Karışıklık matrisinin tamamına bak.", "Look at the whole confusion matrix.")],
      [t("Matrisin satır-sütun sırasını karıştırmak", "Mixing up the matrix's row and column order"), t("Kütüphaneler farklı sıra kullanabilir.", "Libraries may use different orders."), t("Etiketleri (<code>labels=[0, 1]</code>) açıkça ver ve hücreleri adlandır.", "Pass the labels (<code>labels=[0, 1]</code>) explicitly and name the cells.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Eşik, olasılığı karara çevirir.", "The threshold turns the probability into a decision."), t("Karışıklık matrisinin dört hücresi dört farklı iktisadi sonuçtur.", "The four cells of the confusion matrix are four different economic outcomes."), t("Dengesiz veride doğruluk yanıltıcıdır.", "With imbalanced data accuracy misleads.")])}
${link(lang, 5, t("karışıklık matrisi", "confusion matrix"))}`);
  };

  /* ------------------------------------------------------------ Ünite 4 */
  B["m4-u4"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Karışıklık matrisinin dört hücresinden dört oran çıkar. Her biri farklı bir soruyu yanıtlar. Hangisine bakacağın, bankanın (ya da kurumun) neyi önemsediğine bağlı.", "Four rates come from the four cells of the confusion matrix. Each answers a different question. Which one to look at depends on what the bank (or institution) cares about.")}</p>
${sec(1, 0, t("Dört ölçü, dört soru", "Four measures, four questions"), table([t("Ölçü", "Measure"), t("Formül", "Formula"), t("Soru", "Question"), t("Eşik 0,2", "Threshold 0.2")], [
      [t("Duyarlılık (recall)", "Recall"), t("DP / (DP + YN)", "TP / (TP + FN)"), t("Temerrüde düşenlerin ne kadarını yakaladım?", "What share of defaulters did I catch?"), nf(0.537, 3, lang)],
      [t("Kesinlik (precision)", "Precision"), t("DP / (DP + YP)", "TP / (TP + FP)"), t("“Riskli” dediklerimin ne kadarı gerçekten temerrüde düştü?", "What share of those I called “risky” actually defaulted?"), nf(0.351, 3, lang)],
      [t("Özgüllük", "Specificity"), t("DN / (DN + YP)", "TN / (TN + FP)"), t("Ödeyenlerin ne kadarını onayladım?", "What share of payers did I approve?"), nf(0.881, 3, lang)],
      [t("Doğruluk", "Accuracy"), t("(DP + DN) / hepsi", "(TP + TN) / all"), t("Kararların ne kadarı doğru?", "What share of decisions are right?"), nf(0.845, 3, lang)]
    ], { num: [3] }))}
${sec(2, 1, t("Eşik değişince", "When the threshold changes"), fig("u4_curves", lang, t("<b>Şekil 1.</b> Dört ölçü eşiğe göre. Duyarlılık ile kesinlik ters yönde hareket ediyor; doğruluk yüksek eşiklerde “herkes öder” kuralının %89'una yaklaşıyor.", "<b>Figure 1.</b> The four measures against the threshold. Recall and precision move in opposite directions; at high thresholds accuracy approaches the 89% of the “everyone pays” rule.")))}
${sec(3, 2, t("Hangi ölçü, hangi problem?", "Which measure for which problem?"), cards([
      [4, "🕵️", t("Dolandırıcılık", "Fraud"), t("Kaçan her vaka pahalı: <b>duyarlılık</b>. Yanlış alarmlar bir telefonla düzeltilebilir.", "Every missed case is expensive: <b>recall</b>. False alarms can be cleared with a phone call.")],
      [0, "🔍", t("Pahalı inceleme", "Costly investigation"), t("Vergi müfettişi sayısı az: yalnızca güçlü şüphelileri göndermek istersin: <b>kesinlik</b>.", "Few tax inspectors: you want to send only strong suspects: <b>precision</b>.")],
      [2, "🤝", t("Müşteri kaybı", "Losing customers"), t("İyi müşteriyi reddetmek rakibe göndermektir: <b>özgüllük</b>.", "Rejecting a good customer sends them to a competitor: <b>specificity</b>.")]
    ]) + `<p>${t("Gerçek kararlar bu ölçülerin bir dengesini ister. Dengeyi kurmanın en açık yolu, her hatanın bedelini para cinsinden yazmaktır (Ünite 6).", "Real decisions need a balance of these measures. The clearest way to strike it is to write down each error's cost in money (Unit 6).")}</p>`)}
${sec(4, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Duyarlılık ile kesinliği karıştırmak", "Confusing recall and precision"), t("Paydaları farklı: biri gerçek temerrütçüler, diğeri “riskli” denenler.", "Their denominators differ: one is actual defaulters, the other those called “risky”."), t("Formülü yaz, paydayı söyle.", "Write the formula, say the denominator.")],
      [t("Tek bir ölçüyü en yükseğe çıkarmak", "Maximising a single measure"), t("Eşik 0'da duyarlılık 1, ama herkes reddedilir.", "At threshold 0 recall is 1, but everyone is rejected."), t("Ölçüleri birlikte ve maliyetle birlikte oku.", "Read the measures together and with costs.")],
      [t("Ölçüleri eşiği söylemeden raporlamak", "Reporting measures without the threshold"), t("Hepsi eşiğe bağlıdır.", "They all depend on the threshold."), t("Eşiği her zaman yaz.", "Always state the threshold.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Duyarlılık: yakaladıklarım / gerçek temerrütçüler.", "Recall: caught / actual defaulters."), t("Kesinlik: gerçekten temerrüde düşenler / “riskli” dediklerim.", "Precision: actual defaulters / those I called “risky”."), t("Eşik yükselince kesinlik artar, duyarlılık düşer.", "As the threshold rises, precision rises and recall falls.")])}
${link(lang, 5, t("duyarlılık ve kesinlik", "recall and precision"))}`);
  };

  /* ------------------------------------------------------------ Ünite 5 */
  B["m4-u5"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Her eşik bir karışıklık matrisi verir. Bir modeli eşikten bağımsız değerlendirmek istersek bütün eşikleri tek bir resimde görmemiz gerekir: <b>ROC eğrisi</b>. Altındaki alan (<b>AUC</b>) modelin sıralama gücünü tek bir sayıda özetler.", "Every threshold gives a confusion matrix. To evaluate a model independently of the threshold we need to see all thresholds in one picture: the <b>ROC curve</b>. The area under it (<b>AUC</b>) summarises the model's ranking power in a single number.")}</p>
${sec(1, 0, t("Sezgi: sıraya dizmek", "Intuition: lining up")
      , analogy("📋", t("Bütün başvuruları modelin verdiği olasılığa göre sıraya diz. İyi bir modelde temerrüde düşenler sıranın başında toplanır. AUC şunu sorar: rastgele bir temerrütçü ile rastgele bir ödeyen seçsek, model temerrütçüye daha yüksek olasılık verir mi? AUC 0,82 ise bu çiftlerin %82'sinde evet.", "Line up all applications by the probability the model gives them. In a good model defaulters cluster at the front. AUC asks: if we pick a random defaulter and a random payer, does the model give the defaulter a higher probability? If AUC is 0.82, it does in 82% of such pairs.")))}
${sec(2, 1, t("ROC eğrisi", "The ROC curve"), fig("u5_roc", lang, t("<b>Şekil 1.</b> Her nokta bir eşik: yatay eksende ödeyenlerin ne kadarını yanlışlıkla reddettiğimiz, dikeyde temerrütçülerin ne kadarını yakaladığımız. Eğri sol üst köşeye ne kadar yakınsa model o kadar iyi.", "<b>Figure 1.</b> Each point is a threshold: horizontally, the share of payers we wrongly reject; vertically, the share of defaulters we catch. The closer the curve to the top-left corner, the better the model.")) +
      formula(t("YPO = YP / (YP + DN) = 1 − özgüllük,   duyarlılık = DP / (DP + YN)", "FPR = FP / (FP + TN) = 1 − specificity,   recall = TP / (TP + FN)"), [["AUC = 1", t("kusursuz sıralama", "perfect ranking")], ["AUC = 0,5".replace(",", lang === "tr" ? "," : "."), t("yazı tura", "coin toss")], ["AUC < 0,5".replace(",", lang === "tr" ? "," : "."), t("sıralama ters: büyük ihtimalle bir kod hatası", "the ranking is reversed: most likely a coding error")]]))}
${sec(3, 2, t("Çözümlü örnek: üç AUC", "Worked example: three AUCs"), table([t("Model", "Model"), "AUC", t("Yorum", "Interpretation")], [
      { cls: "hl", cells: [t("Altı özellik", "Six features"), nf(0.822, 3, lang), t("Gerçek olasılıklara çok yakın", "Very close to the true probabilities")] },
      [t("Yalnızca gelir + yaş", "Income + age only"), nf(0.644, 3, lang), t("Önemli bilgiler eksik", "Important information is missing")],
      [t("Gerçek olasılıklar", "True probabilities"), nf(0.823, 3, lang), t("Bu dünyadaki tavan: temerrüt kısmen şansa bağlı", "The ceiling in this world: default is partly chance")],
      { cls: "bad", cells: [t("<code>predict()</code> ile hesaplanan", "Computed from <code>predict()</code>"), nf(0.567, 3, lang), t("Hata: 0/1 kararlar sıralama bilgisini atar", "Error: 0/1 decisions discard the ranking information")] }
    ], { num: [1] }))}
${sec(4, 3, t("AUC'nin söylemediği", "What AUC does not say"), cards([
      [3, "🎚️", t("Eşik", "Threshold"), t("AUC eşikten bağımsızdır; bu yüzden hangi eşiğin seçileceğini söylemez.", "AUC is threshold-free; that is exactly why it does not say which threshold to choose.")],
      [4, "📏", t("Kalibrasyon", "Calibration"), t("Bütün olasılıkları ikiye katlasan AUC değişmez. Olasılıkların düzeyinin doğru olup olmadığını AUC göstermez (Ünite 7).", "Doubling every probability leaves AUC unchanged. AUC does not show whether the level of the probabilities is right (Unit 7).")],
      [1, "💰", t("Maliyet", "Cost"), t("İki model aynı AUC'ye sahipken farklı eşiklerde farklı maliyet doğurabilir.", "Two models with the same AUC can produce different costs at different thresholds.")]
    ]))}
${sec(5, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("AUC'yi <code>predict()</code> ile hesaplamak", "Computing AUC with <code>predict()</code>"), t("ROC eğrisi tek noktaya iner, AUC düşük çıkar.", "The ROC curve collapses to one point and AUC comes out low."), t("<code>predict_proba(...)[:, 1]</code>.", "<code>predict_proba(...)[:, 1]</code>.")],
      [t("AUC'yi doğruluk gibi okumak", "Reading AUC like accuracy"), t("AUC 0,82 “kararların %82'si doğru” demek değildir.", "AUC 0.82 does not mean “82% of decisions are right”."), t("Sıralama yorumunu kullan.", "Use the ranking interpretation.")],
      [t("AUC'yi eğitim verisinde raporlamak", "Reporting AUC on the training data"), t("İyimserdir.", "It is optimistic."), t("Test verisi ya da çapraz doğrulama (Modül 2).", "Test data or cross-validation (Module 2).")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("ROC eğrisi bütün eşikleri bir arada gösterir.", "The ROC curve shows all thresholds together."), t("AUC, rastgele bir temerrütçünün rastgele bir ödeyenden yüksek olasılık alma şansıdır.", "AUC is the chance that a random defaulter gets a higher probability than a random payer."), t("AUC eşik ve kalibrasyon hakkında bir şey söylemez.", "AUC says nothing about the threshold or calibration.")])}
${link(lang, 5, "ROC – AUC")}`);
  };

  /* ------------------------------------------------------------ Ünite 6 */
  B["m4-u6"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Bir temerrüt bankaya kredinin anaparasını kaybettirir; reddedilen iyi bir müşteri ise yalnızca kazanılmamış bir faiz gelirine mal olur. Hatalar eşit maliyetli değilse eşik 0,5 olmamalı. Bu ünite eşiği maliyetten türetmeyi anlatıyor.", "A default costs the bank the loan's principal; a rejected good customer costs only forgone interest income. If errors are not equally costly the threshold should not be 0.5. This unit shows how to derive the threshold from costs.")}</p>
${sec(1, 0, t("Sezgi: kuramsal eşik", "Intuition: the theoretical threshold"), formula(t("onayın beklenen maliyeti = c<sub>YN</sub> · p,   reddin beklenen maliyeti = c<sub>YP</sub> · (1 − p)", "expected cost of approving = c<sub>FN</sub> · p,   expected cost of rejecting = c<sub>FP</sub> · (1 − p)"), [[t("eşik", "threshold"), t("ikisi eşitken: p* = c<sub>YP</sub> / (c<sub>YP</sub> + c<sub>YN</sub>)", "where they are equal: p* = c<sub>FP</sub> / (c<sub>FP</sub> + c<sub>FN</sub>)")], [t("örnek", "example"), t("c<sub>YN</sub> = 10, c<sub>YP</sub> = 1 ⇒ p* = 1/11 ≈ 0,09", "c<sub>FN</sub> = 10, c<sub>FP</sub> = 1 ⇒ p* = 1/11 ≈ 0.09")], [t("koşul", "condition"), t("olasılıklar iyi ayarlı (kalibre) olmalı", "the probabilities must be well calibrated")]]) +
      `<p>${t("Mantık bir iktisatçıya tanıdık gelecek: marjinal karar. Temerrüt olasılığı %9'u geçen bir başvuruyu onaylamanın beklenen zararı, reddetmenin beklenen zararından büyüktür.", "The logic will be familiar to an economist: a marginal decision. For an application whose default probability exceeds 9%, the expected loss from approving is larger than the expected loss from rejecting.")}</p>`)}
${sec(2, 1, t("Maliyet eğrisi", "The cost curve"), fig("u6_cost", lang, t("<b>Şekil 1.</b> 20.000 test başvurusunda eşiğe göre başvuru başına ortalama maliyet. En ucuz eşik kuramsal eşiğin hemen yanında; eşik 0,5'in maliyeti neredeyse herkesi onaylamak kadar yüksek.", "<b>Figure 1.</b> Average cost per application against the threshold for 20,000 test applications. The cheapest threshold sits right next to the theoretical one; the cost at threshold 0.5 is almost as high as approving everyone.")) +
      table([t("Kural", "Rule"), t("Maliyet", "Cost")], [[t("Herkesi onayla", "Approve everyone"), nf(1.067, 3, lang)], [t("Herkesi reddet", "Reject everyone"), nf(0.893, 3, lang)], { cls: "bad", cells: [t("Eşik 0,5", "Threshold 0.5"), nf(0.921, 3, lang)] }, { cls: "hl", cells: [t("Eşik 0,12 (eğitimde çapraz doğrulamayla seçildi)", "Threshold 0.12 (chosen by cross-validation on training)"), nf(0.505, 3, lang)] }, [t("Eşik 0,09 (kuramsal)", "Threshold 0.09 (theoretical)"), nf(0.498, 3, lang)]], { num: [1] }))}
${sec(3, 2, t("Eşiği eğitim verisinde seçmek", "Choosing the threshold on the training data"), steps([t("Eğitim verisinde <code>cross_val_predict(..., cv=5, method=\"predict_proba\")</code> ile her başvuru için, o başvuruyu görmemiş bir modelin olasılığını üret.", "On the training data, use <code>cross_val_predict(..., cv=5, method=\"predict_proba\")</code> to produce, for each application, the probability from a model that did not see it."), t("Bir eşik ızgarasında (0,02, 0,03, …) eğitim maliyetini hesapla, en düşüğünü seç.", "Compute the training cost on a grid of thresholds (0.02, 0.03, …) and choose the lowest."), t("Test verisinde yalnızca bir kez, seçilen eşikle maliyeti raporla.", "On the test data, report the cost once, at the chosen threshold.")]) +
      vs(t("Eşiği test verisinde seçmek", "Choosing the threshold on the test data"), `<p>${t("Test maliyeti 0,498. Ama test verisi bir seçim için kullanıldı: rakam iyimser.", "Test cost 0.498. But the test data were used for a choice: the figure is optimistic.")}</p>`, t("Eşiği eğitimde seçmek", "Choosing the threshold on training"), `<p>${t("Eşik 0,12, test maliyeti 0,505. Biraz daha yüksek ama dürüst.", "Threshold 0.12, test cost 0.505. Slightly higher, but honest.")}</p>`))}
${sec(4, 3, t("Maliyetler nereden gelir?", "Where do the costs come from?"), cards([
      [4, "💸", t("Kaçan temerrüt (YN)", "Missed default (FN)"), t("Kayıp anapara × (1 − geri kazanım oranı). Teminatlı kredide düşük, teminatsız kartta yüksek.", "Lost principal × (1 − recovery rate). Low for a secured loan, high for an unsecured card.")],
      [0, "🚪", t("Reddedilen iyi müşteri (YP)", "Rejected good customer (FP)"), t("Kazanılmayan faiz ve ücretler; uzun vadede kaybedilen müşteri ilişkisi.", "Forgone interest and fees; in the long run a lost customer relationship.")],
      [2, "📝", t("Oranı belirlemek", "Setting the ratio"), t("Oran bir iş kararıdır; analiz farklı oranlara duyarlılığı göstermelidir (oyun alanını dene).", "The ratio is a business decision; the analysis should show sensitivity to different ratios (try the playground).")]
    ]))}
${sec(5, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Doğruluğu en yükseğe çıkaran eşiği seçmek", "Choosing the threshold that maximises accuracy"), t("Doğruluk hataları eşit sayar.", "Accuracy counts errors equally."), t("Maliyeti en aza indiren eşik.", "The threshold that minimises cost.")],
      [t("Eşiği test verisinde seçmek", "Choosing the threshold on the test data"), t("Raporlanan maliyet iyimser olur.", "The reported cost becomes optimistic."), t("Eğitimde çapraz doğrulama olasılıklarıyla.", "On training, with cross-validation probabilities.")],
      [t("Kuramsal eşiği bozuk olasılıklarla kullanmak", "Using the theoretical threshold with distorted probabilities"), t("Olasılıklar şişikse (Ünite 7) 1/(1+k) yanlış yere düşer.", "If the probabilities are inflated (Unit 7), 1/(1+k) lands in the wrong place."), t("Önce kalibrasyonu kontrol et.", "Check calibration first.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Eşik bir iktisadi karardır: hataların maliyetine göre seçilir.", "The threshold is an economic decision: it is chosen by the cost of errors."), t("Kalibre olasılıklarla en iyi eşik ≈ c<sub>YP</sub> / (c<sub>YP</sub> + c<sub>YN</sub>).", "With calibrated probabilities the best threshold ≈ c<sub>FP</sub> / (c<sub>FP</sub> + c<sub>FN</sub>)."), t("Eşik eğitim verisinde seçilir, test verisinde bir kez raporlanır.", "The threshold is chosen on training data and reported once on test data.")])}
${link(lang, 5, t("eşik seçimi", "choosing the threshold"))}`);
  };

  /* ------------------------------------------------------------ Ünite 7 */
  B["m4-u7"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Gerçek kredi portföylerinde temerrüt çoğu zaman nadirdir: yüzde birkaç. Bu ünite nadir olayların üç sonucunu gösteriyor: doğruluk anlamsızlaşır, eşik 0,5 hiçbir şey yakalamaz ve popüler “dengeleme” çözümleri olasılıkları bozar.", "In real credit portfolios default is often rare: a few percent. This unit shows three consequences of rare events: accuracy becomes meaningless, threshold 0.5 catches nothing, and popular “balancing” fixes distort the probabilities.")}</p>
${sec(1, 0, t("Sezgi: samanlıkta iğne", "Intuition: a needle in a haystack"), analogy("🪡", t("50 başvurudan yalnızca biri temerrüde düşüyorsa, model en riskli başvuruya bile çoğu zaman %50'den düşük olasılık verir. Bu bir hata değil, gerçekçiliktir: en riskli grupta bile çoğunluk öder. Sorun 0,5 eşiğindedir.", "If only one application in 50 defaults, the model gives even the riskiest application a probability below 50% most of the time. That is not a mistake, it is realism: even in the riskiest group most people pay. The problem is the 0.5 threshold.")))}
${sec(2, 1, t("Çözümlü örnek: temerrüt oranı %2,2", "Worked example: a 2.2% default rate"), fig("u7_imb", lang, t("<b>Şekil 1.</b> Aynı kredi dünyası, sabit −4,9: eğitimde yalnızca 63 temerrüt. Eşiği düşürmek ve sınıf ağırlığı benzer sayıda temerrüt yakalıyor; AUC değişmiyor. Ama ağırlıklı modelin ortalama olasılığı gerçek orandan on kat büyük.", "<b>Figure 1.</b> The same credit world with constant −4.9: only 63 defaults in training. Lowering the threshold and class weights catch similar numbers of defaults; AUC does not change. But the weighted model's average probability is ten times the true rate.")) +
      table([t("Seçenek", "Option"), t("Yakalanan", "Caught"), t("Ortalama olasılık", "Average probability"), "AUC"], [
        { cls: "bad", cells: [t("ağırlıksız, eşik 0,5", "unweighted, threshold 0.5"), pc(3.7, 1, lang), pc(2.1, 1, lang), nf(0.817, 3, lang)] },
        { cls: "hl", cells: [t("ağırlıksız, eşik 0,05", "unweighted, threshold 0.05"), pc(48.0, 1, lang), pc(2.1, 1, lang), nf(0.817, 3, lang)] },
        [t("<code>class_weight=\"balanced\"</code>, eşik 0,5", "<code>class_weight=\"balanced\"</code>, threshold 0.5"), pc(67.2, 1, lang), pc(28.5, 1, lang), nf(0.815, 3, lang)]
      ], { num: [1, 2, 3] }))}
${sec(3, 2, t("Sınıf ağırlıkları ne yapar?", "What do class weights do?"), `<p>${t("<code>class_weight=\"balanced\"</code>, her temerrüdü yaklaşık (ödeyen sayısı / temerrüt sayısı) kez saymak gibidir. Model iki sınıf eşit sıklıktaymış gibi öğrenir: sıralama neredeyse aynı kalır, ama bütün olasılıklar yukarı kayar. Etkisi, eşiği gizlice düşürmeye benzer.", "<code>class_weight=\"balanced\"</code> is like counting each default about (number of payers / number of defaults) times. The model learns as if the two classes were equally frequent: the ranking stays almost the same, but all probabilities shift up. Its effect is like secretly lowering the threshold.")}</p>` +
      vs(t("Olasılığın kendisi kullanılacaksa ağırlık", "Weights when the probability itself is used"), `<p>${t("Beklenen temerrüt 5.700; gerçekleşen 433. Karşılık, fiyatlama ve beklenen kayıp hesapları bozulur.", "Expected defaults 5,700; realised 433. Provisions, pricing and expected-loss calculations break.")}</p>`, t("Ağırlıksız model + uygun eşik", "Unweighted model + a suitable threshold"), `<p>${t("Beklenen temerrüt 423, gerçekleşen 433. Olasılıklar kalibre; eşik maliyete göre seçilir.", "Expected defaults 423, realised 433. The probabilities are calibrated; the threshold is chosen by cost.")}</p>`))}
${sec(4, 3, t("Dengesiz veride ne yapmalı?", "What to do with imbalanced data?"), cards([
      [0, "📏", t("Doğru ölçü", "The right measure"), t("Doğruluk yerine AUC, duyarlılık, kesinlik ve maliyet.", "AUC, recall, precision and cost instead of accuracy.")],
      [1, "🎚️", t("Doğru eşik", "The right threshold"), t("Eşiği maliyetle seç (Ünite 6). Çoğu zaman tek gereken budur.", "Choose the threshold by cost (Unit 6). Often that is all you need.")],
      [2, "🧪", t("Yeterli veri", "Enough data"), t("63 temerrütle kestirim gürültülüdür; daha uzun bir geçmiş ya da tabakalı bölme yardımcı olur.", "With 63 defaults estimation is noisy; a longer history or a stratified split helps.")],
      [3, "⚖️", t("Ağırlık kullanılırsa", "If you use weights"), t("Olasılıkları raporlamadan önce yeniden kalibre et.", "Recalibrate the probabilities before reporting them.")]
    ]))}
${sec(5, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("%98 doğrulukla övünmek", "Boasting of 98% accuracy"), t("“Herkes öder” de %98 alır.", "“Everyone pays” also scores 98%."), t("Yakalanan temerrüt oranına ve AUC'ye bak.", "Look at the share of defaults caught and AUC.")],
      [t("Dengeleme yöntemini AUC artırıcı sanmak", "Thinking balancing raises AUC"), t("Sıralama neredeyse değişmez.", "The ranking hardly changes."), t("Etkinin eşik kaydırmaya benzediğini bil.", "Know that the effect resembles shifting the threshold.")],
      [t("Ağırlıklı olasılıkları raporlamak", "Reporting weighted probabilities"), t("Sistematik olarak şişiktir.", "They are systematically inflated."), t("Ağırlıksız model ya da yeniden kalibrasyon.", "An unweighted model or recalibration.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Nadir olaylarda sorun çoğunlukla eşiktir, model değil.", "With rare events the problem is usually the threshold, not the model."), t("Sınıf ağırlıkları sıralamayı değiştirmez, olasılıkları şişirir.", "Class weights do not change the ranking; they inflate the probabilities."), t("Olasılık kullanılacaksa kalibrasyon şarttır.", "If the probability will be used, calibration is essential.")])}
${link(lang, 5, t("dengesiz veri", "imbalanced data"))}`);
  };

  /* ------------------------------------------------------------ Ünite 8 */
  B["m4-u8"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Şimdi gerçek veri: Tayvan'da bir bankanın 30.000 kredi kartı müşterisi. Nisan–Eylül 2005 arasındaki kredi limiti, ekstre ve ödeme bilgileriyle, Ekim 2005'te temerrüde düşüp düşmeyeceklerini öngörüyoruz. Veri UCI Makine Öğrenmesi Deposu'nda açık lisansla (CC BY 4.0) yayımlanıyor (Yeh ve Lien, 2009).", "Now real data: 30,000 credit card customers of a bank in Taiwan. With their credit limits, statements and payments from April–September 2005, we predict whether they default in October 2005. The data are published openly (CC BY 4.0) in the UCI Machine Learning Repository (Yeh and Lien, 2009).")}</p>
${sec(1, 0, t("Veri", "The data"), table([t("Sütun", "Column"), t("İçerik", "Content")], [
      ["limit_bal", t("Kredi limiti (Yeni Tayvan doları)", "Credit limit (New Taiwan dollars)")], ["sex, marriage", t("Cinsiyet, medeni durum: <b>korunan özellikler</b>, modele girmiyor", "Sex, marital status: <b>protected attributes</b>, kept out of the model")],
      ["education, age", t("Eğitim düzeyi, yaş", "Education level, age")], ["pay_0, pay_2 … pay_6", t("Eylül … Nisan ödeme durumu (kod)", "Payment status for September … April (code)")],
      ["bill_amt1 … 6", t("Ekstre tutarları", "Statement amounts")], ["pay_amt1 … 6", t("Ödenen tutarlar", "Amounts paid")], ["default", t("Ekim 2005'te temerrüt (1) — oran %22,1", "Default in October 2005 (1) — rate 22.1%")]
    ]) + `<p class="c-note">${t("Bağlam: 2005–2006'da Tayvan bir kart borcu krizinin içindeydi; temerrüt oranı olağan bir portföyden çok yüksek. Sonuçları başka ülkelere ve dönemlere aktarırken dikkatli ol.", "Context: in 2005–2006 Taiwan was in the middle of a card debt crisis; the default rate is much higher than in a normal portfolio. Be careful when carrying the results over to other countries and periods.")}</p>`)}
${sec(2, 1, t("Kodları anlamak", "Understanding the codes"), fig("u8_pay", lang, t("<b>Şekil 1.</b> Eylül ödeme durumuna göre ertesi ayın temerrüt oranı. −2, −1 ve 0 bir sayı ölçeği değil, kategoridir; gecikme 2 aya ulaşınca oran %69'a sıçrıyor.", "<b>Figure 1.</b> Next month's default rate by September payment status. −2, −1 and 0 are categories, not a numeric scale; once the delay reaches 2 months the rate jumps to 69%.")) +
      code(t(`X[k + "_gecikme"] = X[k].clip(lower=0)      # 1, 2, …: kaç ay gecikmiş
X[k + "_tam"] = (X[k] == -1).astype(int)    # −1: borcun tamamını ödedi
X[k + "_yok"] = (X[k] == -2).astype(int)    # −2: kart kullanılmadı`, `X[k + "_delay"] = X[k].clip(lower=0)        # 1, 2, …: months of delay
X[k + "_full"] = (X[k] == -1).astype(int)   # −1: paid the balance in full
X[k + "_none"] = (X[k] == -2).astype(int)   # −2: card not used`)) +
      `<p class="c-note">${t("Verinin resmî açıklaması yalnızca −1 ve 1–9 kodlarını tanımlar; −2 ve 0 için literatürdeki yaygın yorumu kullanıyoruz. Tutarlar çok çarpık olduğu için işaretli log (sign(x)·log(1+|x|)) uygulanıyor.", "The data's official description defines only codes −1 and 1–9; for −2 and 0 we use the common reading in the literature. Because the amounts are very skewed, a signed log (sign(x)·log(1+|x|)) is applied.")}</p>`)}
${sec(3, 2, t("Sonuçlar", "Results"), fig("u8_calib", lang, t("<b>Şekil 2.</b> Kalibrasyon: test müşterileri öngörülen olasılığa göre on gruba ayrıldı. Kodlar çözülünce hem sıralama (AUC) hem de olasılıkların düzeyi iyileşiyor.", "<b>Figure 2.</b> Calibration: test customers were split into ten groups by predicted probability. Once the codes are decoded both the ranking (AUC) and the level of the probabilities improve.")) +
      table([t("Adım", "Step"), t("Sonuç", "Result")], [
        [t("Ham kodlarla lojistik regresyon", "Logistic regression on raw codes"), "AUC " + nf(0.713, 3, lang)], { cls: "hl", cells: [t("Kodlar çözülmüş, tutarlar log", "Codes decoded, amounts logged"), "AUC " + nf(0.762, 3, lang)] },
        [t("+ cinsiyet ve medeni durum", "+ sex and marital status"), "AUC " + nf(0.764, 3, lang) + t(" (yalnızca +0,002)", " (only +0.002)")],
        [t("5:1 maliyet, eğitimde seçilen eşik", "5:1 cost, threshold chosen on training"), t("0,17 (kuramsal 1/6); test maliyeti 0,580", "0.17 (theoretical 1/6); test cost 0.580")],
        [t("Karşılaştırma", "Comparison"), t("herkesi onayla 1,106; eşik 0,5 0,778", "approve everyone 1.106; threshold 0.5 0.778")]
      ]))}
${sec(4, 3, t("Adillik ve sınırlılıklar", "Fairness and limitations"), cards([
      [4, "⚖️", t("Korunan özellikler", "Protected attributes"), t("Cinsiyet ya da medeni duruma göre kredi kararı birçok ülkede yasaktır. Burada öngörü kazancı da önemsiz (0,002).", "Credit decisions by sex or marital status are prohibited in many countries. Here the predictive gain is negligible as well (0.002).")],
      [3, "🕸️", t("Vekil değişkenler", "Proxy variables"), t("Bir özelliği çıkarmak adilliği garanti etmez: başka değişkenler onu temsil edebilir. Gruplar arası hata oranları ayrıca ölçülmeli.", "Removing an attribute does not guarantee fairness: other variables can stand in for it. Error rates across groups must be measured separately.")],
      [1, "🧭", t("Öngörü ≠ politika", "Prediction ≠ policy"), t("Gecikme temerrüdün habercisidir; gecikmeyi engellemek temerrüdü önler demek değildir.", "Delay is a harbinger of default; preventing delay does not mean preventing default.")]
    ]))}
${sec(5, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Kategorik kodları sayı gibi kullanmak", "Using categorical codes as numbers"), t("Model −1 → 0'ı bir gecikme ayı gibi okur.", "The model reads −1 → 0 as one month of delay."), t("Anlamlarına göre ayrı değişkenler.", "Separate variables by meaning.")],
      [t("Ölçekleyiciyi tüm veriyle kurmak", "Fitting the scaler on all the data"), t("Test bilgisi sızar.", "Test information leaks."), t("<code>make_pipeline(StandardScaler(), LogisticRegression(...))</code>.", "<code>make_pipeline(StandardScaler(), LogisticRegression(...))</code>.")],
      [t("Sonuçları evrensel sanmak", "Treating the results as universal"), t("Tek banka, tek ülke, kriz dönemi.", "One bank, one country, a crisis period."), t("Dış geçerliliği tartış.", "Discuss external validity.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Yöntemden önce veriyi anla: kodları doğru okumak AUC'yi 0,71'den 0,76'ya çıkardı.", "Understand the data before the method: reading the codes correctly raised AUC from 0.71 to 0.76."), t("Kalibre olasılıklarla kuramsal eşik gerçek veride de işe yarıyor.", "With calibrated probabilities the theoretical threshold works on real data too."), t("Korunan özellikleri dışarıda bırakmak gerekli ama yeterli değil.", "Leaving protected attributes out is necessary but not sufficient.")])}
<p class="c-note">${t("Kaynak: Yeh, I-C. ve Lien, C-H. (2009). The comparisons of data mining techniques for the predictive accuracy of probability of default of credit card clients. <i>Expert Systems with Applications</i>, 36(2), 2473–2480. Veri: UCI Machine Learning Repository, “Default of Credit Card Clients”, CC BY 4.0.", "Source: Yeh, I-C. and Lien, C-H. (2009). The comparisons of data mining techniques for the predictive accuracy of probability of default of credit card clients. <i>Expert Systems with Applications</i>, 36(2), 2473–2480. Data: UCI Machine Learning Repository, “Default of Credit Card Clients”, CC BY 4.0.")}</p>`);
  };

  const C = {};
  Object.keys(B).forEach((id) => { C[id] = { tr: B[id]("tr"), en: B[id]("en") }; });
  K.apply(U, C, 10);
  K.prepend(U, "m4-u9", F, "u9_flow", { tr: "<b>Şekil 1.</b> Atölyenin akışı.", en: "<b>Figure 1.</b> The workshop's flow." });
})();
