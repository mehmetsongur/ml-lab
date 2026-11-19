/* Modül 5 — genişletilmiş kavram anlatımları (şekil, tablo, çözümlü örnek, sık hatalar, özet)
 * Şekiller tools/m5_figs.py ile üretilir (window.M5_FIGS). Bileşenler: content/concept-kit.js
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 */
(function () {
  "use strict";
  const K = window.CK, F = window.M5_FIGS || {};
  const U = window.M5_UNITS || [];
  if (!K) return;
  const { sec, cards, pit, sum, analogy, formula, steps, table, code, vs, wrap, nf, link } = K;
  const fig = (name, lang, cap) => K.fig(F, name, lang, cap);
  const B = {};

  /* ------------------------------------------------------------ Ünite 1 */
  B["m5-u1"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Modül 4'teki lojistik regresyon riskin doğrusal bir skorla arttığını varsayıyordu. Gerçek kredi riskinde ise eşikler, etkileşimler ve U biçimli ilişkiler vardır. Bu ünitede, bunları kendiliğinden yakalayan ilk modeli görüyoruz: <b>karar ağacı</b>.", "Module 4's logistic regression assumed that risk rises with a linear score. Real credit risk, though, has thresholds, interactions and U-shaped relationships. In this unit we meet the first model that captures them on its own: the <b>decision tree</b>.")}</p>
${sec(1, 0, t("Sezgi: kredi uzmanının soruları", "Intuition: the loan officer's questions"), analogy("🧑‍💼", t("Deneyimli bir kredi uzmanı formül kullanmaz, soru sorar: “Borcu gelirine göre yüksek mi? Evetse, daha önce gecikmiş mi?” Her yanıt başvuranı daha küçük, daha benzer bir gruba gönderir. Karar ağacı aynı soru dizisini veriden öğrenir.", "An experienced loan officer does not use a formula; they ask questions: “Is the debt high relative to income? If so, has the applicant been late before?” Each answer sends the applicant to a smaller, more similar group. A decision tree learns the same sequence of questions from the data.")))}
${sec(2, 1, t("Bu modülün kredi dünyası", "This module's credit world"), fig("u1_shapes", lang, t("<b>Şekil 1.</b> 6. haftanın kredi dünyasında üç doğrusal olmayan etki: borç/gelir 0,7'yi aşınca risk sıçrıyor; gecikmenin etkisi borcu yüksek olanlarda çok daha büyük; yaşın etkisi U biçimli.", "<b>Figure 1.</b> Three nonlinear effects in the week 6 credit world: risk jumps once debt/income exceeds 0.7; delinquency's effect is much larger for high-debt applicants; age's effect is U-shaped.")) +
      table([t("Model", "Model"), t("Test AUC", "Test AUC"), t("Not", "Note")], [
        [t("Gerçek olasılıklar", "True probabilities"), nf(0.818, 3, lang), t("tavan", "ceiling")],
        { cls: "bad", cells: [t("Lojistik regresyon", "Logistic regression"), nf(0.735, 3, lang), t("yaş katsayısı −0,06: U biçimi düz çizgide kayboluyor", "age coefficient −0.06: the U shape is lost in a straight line")] },
        [t("Derinliği 3 olan ağaç (8 yaprak)", "Depth-3 tree (8 leaves)"), nf(0.733, 3, lang), t("yalnızca üç soru düzeyiyle aynı düzey", "the same level with only three levels of questions")]
      ], { num: [1] }))}
${sec(3, 2, t("Ağacın öğrendiği sorular", "The questions the tree learned"), fig("u1_tree", lang, t("<b>Şekil 2.</b> Derinliği 3 olan, her yaprağında en az 100 kişi bulunan ağaç. Kutulardaki yüzde, o yapraktaki temerrüt oranı.", "<b>Figure 2.</b> The depth-3 tree with at least 100 people in each leaf. The percentage in each box is the default rate in that leaf.")) +
      steps([t("<b>Eşik:</b> ilk soru “borç/gelir ≤ 0,68”; gerçek eşik 0,7.", "<b>Threshold:</b> the first question is “debt/income ≤ 0.68”; the true threshold is 0.7."), t("<b>Etkileşim:</b> gecikme sorusu yalnızca borcu yüksek dalda soruluyor; o dalda gecikmesi olanların oranı %55.", "<b>Interaction:</b> the delinquency question is asked only in the high-debt branch; there the rate for delinquent applicants is 55%."), t("<b>U biçimi:</b> sol dalda yaş iki kez soruluyor: hem çok gençlerin hem çok yaşlıların oranı yüksek.", "<b>U shape:</b> in the left branch age is asked twice: both the very young and the very old have high rates.")]))}
${sec(4, 3, t("Ağaç nasıl kurulur?", "How is a tree built?"), cards([
      [0, "❓", t("En iyi soru", "The best question"), t("Her değişken ve her eşik denenir; iki grubu birbirinden en çok ayıran (Gini safsızlığını en çok azaltan) soru seçilir.", "Every variable and threshold is tried; the question that best separates the two groups (reduces Gini impurity most) is chosen.")],
      [1, "🔁", t("Tekrar", "Repeat"), t("Her alt grupta aynı iş yinelenir: ağaç böyle büyür.", "The same job is repeated in each subgroup: that is how the tree grows.")],
      [2, "🍂", t("Yaprak", "Leaf"), t("Durunca, yapraktaki temerrüt oranı o yaprağa düşen herkesin olasılığı olur.", "When it stops, the default rate in the leaf becomes the probability for everyone landing there.")],
      [3, "📏", t("Ölçekleme yok", "No scaling"), t("Sorular yalnızca sıralamaya bakar; değişkenleri standartlaştırmaya gerek yoktur.", "Questions only look at the ordering; variables need no standardising.")]
    ]) + code(t(`agac = DecisionTreeClassifier(max_depth=3, min_samples_leaf=100, random_state=0).fit(X_egt, y_egt)
print(export_text(agac, feature_names=adlar, show_weights=True))   # soruları metin olarak yazdır`, `tree = DecisionTreeClassifier(max_depth=3, min_samples_leaf=100, random_state=0).fit(X_tr, y_tr)
print(export_text(tree, feature_names=names, show_weights=True))   # print the questions as text`)))}
${sec(5, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("İlk soruyu “neden” saymak", "Treating the first question as the “cause”"), t("Ağaç en çok ayıran değişkeni seçer; bu bir öngörü ölçütüdür.", "The tree picks the variable that separates most; that is a prediction criterion."), t("Nedensel yorum için nedensel tasarım (Modül 1).", "A causal interpretation needs a causal design (Module 1).")],
      [t("Ağacın olasılıklarını pürüzsüz sanmak", "Thinking a tree's probabilities are smooth"), t("Aynı yapraktaki herkes aynı olasılığı alır; olasılıklar basamaklıdır.", "Everyone in the same leaf gets the same probability; probabilities come in steps."), t("Toplulukların ortalaması daha ince ayrım yapar (Ünite 4–5).", "Ensemble averages discriminate more finely (Units 4–5).")],
      [t("Tek bir ağacı kesin kural sanmak", "Taking a single tree as a fixed rule"), t("Veri biraz değişince sorular da değişir (Ünite 3).", "When the data change a little, the questions change too (Unit 3)."), t("Kararlılığı sına.", "Test stability.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Karar ağacı veriden bir soru dizisi öğrenir.", "A decision tree learns a sequence of questions from the data."), t("Eşikleri, etkileşimleri ve U biçimlerini kendiliğinden yakalar.", "It captures thresholds, interactions and U shapes on its own."), t("Olasılık, yapraktaki temerrüt oranıdır.", "The probability is the default rate in the leaf.")])}
${link(lang, 6, t("karar ağaçları", "decision trees"))}`);
  };

  /* ------------------------------------------------------------ Ünite 2 */
  B["m5-u2"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Ağaç sormaya devam ettikçe gruplar küçülür. Sonunda her yaprakta birkaç kişi kalır ve ağaç, eğitim verisindeki gürültüyü kural sanmaya başlar. Modül 2'deki aşırı uyumun en çarpıcı örneği budur.", "As the tree keeps asking, the groups shrink. Eventually only a few people are left in each leaf and the tree starts mistaking the noise in the training data for rules. This is the starkest example of Module 2's overfitting.")}</p>
${sec(1, 0, t("Sezgi: her başvurana özel kural", "Intuition: a rule for every applicant"), analogy("🧩", t("“Borcu 0,68'den yüksek, 34 yaşında, geliri 0,41, kart harcaması 1,12 olanlar temerrüde düşer” gibi bir kural, eğitim verisindeki tek bir kişiyi tarif eder. Yeni başvurularda hiçbir anlamı yoktur. Derin bir ağaç yüzlerce böyle kural yazar.", "A rule such as “those with debt above 0.68, aged 34, income 0.41 and card spending 1.12 default” describes a single person in the training data. It means nothing for new applications. A deep tree writes hundreds of such rules.")))}
${sec(2, 1, t("Derinlik ve AUC", "Depth and AUC"), fig("u2_depth", lang, t("<b>Şekil 1.</b> Eğitim AUC'si derinlikle hep artar; çapraz doğrulama ve test eğrileri derinlik 4–5 civarında tepe yapıp düşer. Çapraz doğrulama, test verisine dokunmadan derinlik 4'ü seçiyor.", "<b>Figure 1.</b> Training AUC always rises with depth; the cross-validation and test curves peak around depth 4–5 and then fall. Cross-validation picks depth 4 without touching the test data.")) +
      table([t("Ağaç", "Tree"), t("Yaprak", "Leaves"), t("Eğitim AUC", "Training AUC"), t("Test AUC", "Test AUC")], [
        { cls: "bad", cells: [t("derinlik 15", "depth 15"), "314", nf(0.983, 3, lang), nf(0.583, 3, lang)] },
        { cls: "hl", cells: [t("derinlik 4 (çapraz doğrulamayla seçildi)", "depth 4 (chosen by cross-validation)"), "15", "—", nf(0.730, 3, lang)] },
        [t("derinlik 15, yaprakta en az 100 kişi", "depth 15, at least 100 people per leaf"), "22", "—", nf(0.760, 3, lang)]
      ], { num: [1, 2, 3] }))}
${sec(3, 2, t("Karmaşıklığı ayarlayan düğmeler", "The knobs that set complexity"), cards([
      [0, "📐", "max_depth", t("En fazla kaç soru üst üste sorulabilir.", "How many questions can be asked in a row, at most.")],
      [1, "👥", "min_samples_leaf", t("Bir yaprakta en az kaç kişi kalmalı. Küçük yapraklar ezberin kaynağıdır.", "The minimum number of people left in a leaf. Small leaves are the source of memorisation.")],
      [2, "🧪", t("Seçim", "Choice"), t("İkisi de hiperparametredir: eğitim verisinde çapraz doğrulamayla seçilir (Modül 2).", "Both are hyperparameters: chosen by cross-validation on the training data (Module 2).")]
    ]) + code(t(`for d in range(1, 16):
    cv = cross_val_score(DecisionTreeClassifier(max_depth=d, random_state=0), X_egt, y_egt, cv=kf, scoring="roc_auc").mean()`, `for d in range(1, 16):
    cv = cross_val_score(DecisionTreeClassifier(max_depth=d, random_state=0), X_tr, y_tr, cv=kf, scoring="roc_auc").mean()`)))}
${sec(4, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Derinliği test verisinde seçmek", "Choosing the depth on the test data"), t("15 derinlik arasından en şanslısı seçilir; raporlanan AUC iyimserdir.", "The luckiest of 15 depths is picked; the reported AUC is optimistic."), t("Eğitimde çapraz doğrulama.", "Cross-validation on training.")],
      [t("Eğitim AUC'siyle övünmek", "Boasting of training AUC"), t("0,983 ezberin ölçüsüdür.", "0.983 is a measure of memorisation."), t("Yalnızca yeni veriye bak.", "Look only at new data.")],
      [t("Sınırsız ağaç kurmak", "Building an unrestricted tree"), t("scikit-learn'de <code>max_depth</code> varsayılan olarak sınırsızdır.", "In scikit-learn <code>max_depth</code> is unlimited by default."), t("Derinliği ya da yaprak büyüklüğünü her zaman bilinçli ayarla.", "Always set the depth or leaf size deliberately.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Derin ağaç eğitim verisini ezberler.", "A deep tree memorises the training data."), t("Derinlik ve yaprak büyüklüğü karmaşıklığı ayarlar.", "Depth and leaf size set the complexity."), t("İkisi de eğitim verisinde çapraz doğrulamayla seçilir.", "Both are chosen by cross-validation on the training data.")])}
${link(lang, 6, t("derinlik ve aşırı uyum", "depth and overfitting"))}`);
  };

  /* ------------------------------------------------------------ Ünite 3 */
  B["m5-u3"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Ağaçların en kolay okunan model olması bir avantaj gibi görünür. Ama okuduğumuz soruların ne kadar sağlam olduğunu sormalıyız: veri biraz değişince aynı ağacı mı buluruz?", "Trees being the easiest model to read looks like an advantage. But we should ask how solid the questions we read are: do we find the same tree when the data change a little?")}</p>
${sec(1, 0, t("Sezgi: bir anketi yeniden yapmak", "Intuition: running a survey again"), analogy("🗳️", t("Aynı nüfusa aynı anketi iki kez yapsan sonuçlar birkaç puan oynar. Ağaçta bu oynama çok daha büyüktür: üstteki soru biraz değişince, altındaki bütün sorular başka bir alt grupta sorulur.", "Run the same survey twice on the same population and the results move by a few points. In a tree this movement is much bigger: when the question at the top changes a little, every question below it is asked in a different subgroup.")))}
${sec(2, 1, t("Beş bootstrap ağacı", "Five bootstrap trees"), table([t("Örneklem", "Sample"), t("İlk soru", "First question"), t("İkinci düzey", "Second level"), t("Test AUC", "Test AUC")], [
      ["1", t("Borç/gelir ≤ 0,68", "Debt/income ≤ 0.68"), t("Yaş · Çalışma süresi", "Age · Years employed"), nf(0.728, 3, lang)],
      ["2", t("Borç/gelir ≤ 0,69", "Debt/income ≤ 0.69"), t("Yaş · Yaş", "Age · Age"), nf(0.741, 3, lang)],
      ["3", t("Borç/gelir ≤ 0,74", "Debt/income ≤ 0.74"), t("Yaş · Çalışma süresi", "Age · Years employed"), nf(0.731, 3, lang)],
      ["4", t("Borç/gelir ≤ 0,67", "Debt/income ≤ 0.67"), t("Yaş · Çalışma süresi", "Age · Years employed"), nf(0.724, 3, lang)],
      ["5", t("Borç/gelir ≤ 0,68", "Debt/income ≤ 0.68"), t("Yaş · Önceki gecikme", "Age · Past delinquency"), nf(0.687, 3, lang)],
      { cls: "hl", cells: [t("Beşinin ortalaması", "Average of the five"), "—", "—", nf(0.771, 3, lang)] }
    ], { num: [3] }) + `<p>${t("<b>Bootstrap örneklemi</b>: eğitim verisinden yerine koyarak, aynı büyüklükte çekilen örneklem. Bazı başvurular birden çok kez gelir, yaklaşık üçte biri hiç gelmez.", "<b>Bootstrap sample</b>: a sample of the same size drawn from the training data with replacement. Some applications appear several times; about a third do not appear at all.")}</p>`)}
${sec(3, 2, t("Ortalamanın gücü", "The power of averaging"), formula(t("Var(ortalama) = ρσ² + (1 − ρ)σ² / B", "Var(average) = ρσ² + (1 − ρ)σ² / B"), [["σ²", t("tek bir ağacın tahminindeki varyans", "the variance in a single tree's prediction")], ["B", t("ağaç sayısı", "number of trees")], ["ρ", t("ağaçların tahminleri arasındaki korelasyon", "the correlation between the trees' predictions")]]) +
      `<p>${t("Ağaç sayısı arttıkça ikinci terim sıfıra iner; geriye ağaçların ortak hatası (ρσ²) kalır. Bu yüzden iki şey önemlidir: çok sayıda ağaç ve <b>birbirine benzemeyen</b> ağaçlar. Ünite 4'teki rassal orman tam olarak bunu yapar.", "As the number of trees grows the second term goes to zero; what remains is the trees' shared error (ρσ²). So two things matter: many trees, and trees that are <b>unlike each other</b>. The random forest in Unit 4 does exactly this.")}</p>`)}
${sec(4, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("“Doğru ağacı” aramak", "Looking for “the right tree”"), t("Her ağaç gerçeğin gürültülü bir tahminidir.", "Each tree is a noisy estimate of the truth."), t("Çok sayıda ağacı birleştir.", "Combine many trees.")],
      [t("Tek ağacın sorularını politika diye yayımlamak", "Publishing a single tree's questions as policy"), t("Veri güncellenince kurallar değişebilir.", "The rules may change when the data are updated."), t("Kararlılığı bootstrap ile sına.", "Test stability with the bootstrap.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Tek bir ağaç yüksek varyanslıdır: veri biraz değişince sorular değişir.", "A single tree has high variance: when the data change a little, the questions change."), t("Ağaçların ortalaması daha kararlı ve daha isabetlidir.", "The average of trees is more stable and more accurate."), t("Kazanç, ağaçlar birbirine ne kadar az benzerse o kadar büyüktür.", "The gain is bigger the less the trees resemble each other.")])}
${link(lang, 6, t("kararsızlık", "instability"))}`);
  };

  /* ------------------------------------------------------------ Ünite 4 */
  B["m5-u4"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Ünite 3'ün dersini sonuna kadar götürelim: yüzlerce bootstrap ağacı kur ve ortalamalarını al. Bu <b>bagging</b>'dir. Ağaçları birbirinden daha da farklı kılmak için her soruda değişkenlerin yalnızca bir kısmını dene: bu da <b>rassal orman</b>.", "Let us take Unit 3's lesson all the way: build hundreds of bootstrap trees and average them. That is <b>bagging</b>. To make the trees even more different, try only some of the variables at each question: that is the <b>random forest</b>.")}</p>
${sec(1, 0, t("Sezgi: kalabalığın bilgeliği", "Intuition: the wisdom of crowds"), analogy("👥", t("Bir kavanozdaki şeker sayısını tahmin eden yüz kişinin ortalaması, çoğu zaman tek tek hepsinden isabetlidir; yeter ki herkes birbirinden bağımsız tahmin etsin. Herkes aynı kişiye bakarak tahmin ederse ortalama bir şey kazandırmaz. Rassal ormandaki değişken gizleme, ağaçların “birbirine bakmasını” engeller.", "The average of a hundred people guessing the number of sweets in a jar is often more accurate than any of them individually, as long as everyone guesses independently. If everyone copies the same person, averaging gains nothing. Hiding variables in a random forest stops the trees from “copying each other”.")))}
${sec(2, 1, t("Ağaç sayısı ve AUC", "Number of trees and AUC"), fig("u4_forest", lang, t("<b>Şekil 1.</b> Ormanın ilk k ağacının ortalaması. Tek ağaç 0,70; bagging 0,79; rassal orman 0,80, tavana (0,818) yakın. Ağaç eklemek eğriyi hiç aşağı indirmiyor.", "<b>Figure 1.</b> The average of the forest's first k trees. Single tree 0.70; bagging 0.79; random forest 0.80, close to the ceiling (0.818). Adding trees never pulls the curve down.")))}
${sec(3, 2, t("Bagging ve rassal orman", "Bagging and random forest"), table([t("Yöntem", "Method"), t("Her ağaç", "Each tree"), t("Her soruda", "At each question"), "scikit-learn"], [
      ["Bagging", t("bootstrap örneklemi", "bootstrap sample"), t("bütün değişkenler", "all variables"), "<code>max_features=None</code>"],
      { cls: "hl", cells: [t("Rassal orman", "Random forest"), t("bootstrap örneklemi", "bootstrap sample"), t("rastgele √p değişken (6'dan 2'si)", "random √p variables (2 of 6)"), "<code>max_features=\"sqrt\"</code>"] }
    ]) + code(t(`orman = RandomForestClassifier(n_estimators=200, min_samples_leaf=10, max_features="sqrt", random_state=1).fit(X_egt, y_egt)
p = orman.predict_proba(X_tst)[:, 1]      # 200 ağacın olasılıklarının ortalaması`, `forest = RandomForestClassifier(n_estimators=200, min_samples_leaf=10, max_features="sqrt", random_state=1).fit(X_tr, y_tr)
p = forest.predict_proba(X_te)[:, 1]      # the average of the 200 trees' probabilities`)) +
      `<p>${t("Bagging'de her ağaç ilk soruyu borç/gelirle sorar; ağaçlar birbirine benzer, hataları da. Rassal ormanda bazı ağaçlar ilk soruda borç/gelir'i göremez ve başka bir yoldan gider: ağaçlar çeşitlenir, ortalama iyileşir.", "In bagging every tree asks its first question about debt/income; the trees are alike, and so are their errors. In a random forest some trees cannot see debt/income at the first question and go another way: the trees diversify and the average improves.")}</p>`)}
${sec(4, 3, t("Ormanın bedeli", "The forest's price"), cards([
      [0, "✅", t("Kazanç", "Gain"), t("Lojistik regresyona göre +0,065 AUC; az ayar gerektirir.", "+0.065 AUC over logistic regression; needs little tuning.")],
      [3, "🌫️", t("Okunabilirlik", "Readability"), t("200 ağacın ortalaması tek bir soru dizisi olarak okunamaz.", "The average of 200 trees cannot be read as a single sequence of questions.")],
      [1, "⏱️", t("Hesap", "Computation"), t("Ağaç sayısı yalnızca süreyi artırır; aşırı uyum düğmesi değildir.", "The number of trees only adds time; it is not an overfitting knob.")]
    ]))}
${sec(5, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("<code>max_features=None</code> ile “rassal orman” demek", "Calling it a “random forest” with <code>max_features=None</code>"), t("Bu bagging'dir.", "That is bagging."), t("Parametreleri iddiayla karşılaştır.", "Compare the parameters with the claim.")],
      [t("Ağaç sayısını aşırı uyumdan korkup azaltmak", "Cutting trees for fear of overfitting"), t("Ormanda ağaç eklemek AUC'yi düşürmez.", "In a forest adding trees does not lower AUC."), t("Yeterince ağaç (100–500).", "Enough trees (100–500).")],
      [t("Ormanın katsayılarını aramak", "Looking for the forest's coefficients"), t("Ormanın katsayısı yoktur.", "A forest has no coefficients."), t("Açıklama için SHAP (Ünite 6–7).", "For explanation, SHAP (Units 6–7).")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Bagging: bootstrap ağaçlarının ortalaması.", "Bagging: the average of bootstrap trees."), t("Rassal orman: her soruda değişkenlerin bir kısmı, böylece daha çeşitli ağaçlar.", "Random forest: some of the variables at each question, hence more diverse trees."), t("Ormanda ağaç sayısı aşırı uyuma yol açmaz.", "In a forest the number of trees does not cause overfitting.")])}
${link(lang, 6, t("rassal orman", "random forest"))}`);
  };

  /* ------------------------------------------------------------ Ünite 5 */
  B["m5-u5"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Orman birbirinden bağımsız derin ağaçların ortalamasıdır. <b>Boosting</b> başka bir yol izler: küçük ağaçlar sırayla eklenir ve her yeni ağaç, öncekilerin bıraktığı hatayı biraz düzeltir.", "A forest is the average of independent deep trees. <b>Boosting</b> takes another route: small trees are added one after another, and each new tree corrects a little of the error left by the previous ones.")}</p>
${sec(1, 0, t("Sezgi: taslağı adım adım düzeltmek", "Intuition: correcting a draft step by step"), analogy("✍️", t("Bir metni tek seferde kusursuz yazmak yerine kaba bir taslak yazar, sonra her okumada en göze batan hataları düzeltirsin. Ama düzeltmeye sonsuza kadar devam edersen sonunda doğru cümleleri de bozmaya başlarsın. Boosting'de “ne zaman durmalı?” sorusu bu yüzden önemlidir.", "Instead of writing a perfect text in one go, you write a rough draft and fix the most glaring errors on each read. But if you keep correcting forever, you eventually start spoiling correct sentences too. That is why “when to stop?” matters in boosting.")))}
${sec(2, 1, t("Nasıl çalışır?", "How does it work?"), steps([t("Herkese ortalama riski (log-odds) ver.", "Give everyone the average risk (log-odds)."), t("Her başvuru için kalan hatayı hesapla (gerçekleşen − öngörülen olasılık).", "Compute the remaining error for each application (realised − predicted probability)."), t("Bu hatayı öngören küçük bir ağaç (derinlik 3) kur.", "Build a small tree (depth 3) that predicts this error."), t("Ağacın öngörüsünü öğrenme oranıyla (örneğin 0,05) çarpıp modele ekle.", "Multiply the tree's prediction by the learning rate (e.g. 0.05) and add it to the model."), t("2–4. adımları seçilen ağaç sayısı kadar tekrarla.", "Repeat steps 2–4 for the chosen number of trees.")]) +
      code(t(`gb = GradientBoostingClassifier(n_estimators=100, learning_rate=0.05, max_depth=3, subsample=0.8, random_state=1).fit(X_egt, y_egt)`, `gb = GradientBoostingClassifier(n_estimators=100, learning_rate=0.05, max_depth=3, subsample=0.8, random_state=1).fit(X_tr, y_tr)`)))}
${sec(3, 2, t("Öğrenme oranı ve ağaç sayısı", "Learning rate and number of trees"), fig("u5_boost", lang, t("<b>Şekil 1.</b> Her ağaç eklendikten sonra test AUC'si. Öğrenme oranı 0,05 yavaş yükselir ve 93. ağaçta 0,807'de tepe yapar; 0,5 hızla 8. ağaçta tepe yapar ve sonra gürültüyü öğrenerek düşer.", "<b>Figure 1.</b> Test AUC after each tree is added. Learning rate 0.05 rises slowly and peaks at 0.807 at tree 93; 0.5 peaks quickly at tree 8 and then falls as it learns the noise.")) +
      table([t("Özellik", "Feature"), t("Rassal orman", "Random forest"), "Boosting"], [
        [t("Ağaçlar", "Trees"), t("bağımsız, derin", "independent, deep"), t("sıralı, küçük", "sequential, small")],
        [t("Birleştirme", "Combining"), t("ortalama", "average"), t("toplam (öğrenme oranıyla)", "sum (with the learning rate)")],
        [t("Ağaç sayısı artınca", "As trees are added"), t("AUC bir sınıra yaklaşır", "AUC approaches a limit"), t("bir noktadan sonra aşırı uyum", "overfitting after some point")],
        [t("Seçilecek", "To choose"), t("az (yaprak büyüklüğü)", "little (leaf size)"), t("öğrenme oranı + ağaç sayısı (çapraz doğrulama)", "learning rate + number of trees (cross-validation)")],
        { cls: "hl", cells: [t("Bu dünyada test AUC", "Test AUC in this world"), nf(0.800, 3, lang), nf(0.807, 3, lang)] }
      ]))}
${sec(4, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("“Daha çok ağaç = daha iyi” sanmak", "Thinking “more trees = better”"), t("Boosting'de fazla ağaç gürültüyü öğrenir.", "In boosting too many trees learn the noise."), t("Ağaç sayısını çapraz doğrulamayla seç.", "Choose the number of trees by cross-validation.")],
      [t("Büyük öğrenme oranı", "A large learning rate"), t("Tepe çok erken gelir ve daha düşüktür (0,792).", "The peak comes very early and is lower (0.792)."), t("Küçük oran (0,05–0,1) ve daha çok ağaç.", "A small rate (0.05–0.1) and more trees.")],
      [t("Ayarı kötü modelle yöntemi yargılamak", "Judging a method by a badly tuned model"), t("600 ağaç ve oran 0,5 ile AUC 0,735: “boosting işe yaramıyor” yanlış sonucu.", "With 600 trees and rate 0.5, AUC is 0.735: the false conclusion “boosting does not work”."), t("Hiperparametrelerin nasıl seçildiğine bak.", "Check how the hyperparameters were chosen.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Boosting küçük ağaçları sırayla ekler; her biri kalan hatayı düzeltir.", "Boosting adds small trees in sequence; each corrects the remaining error."), t("Ağaç sayısı ve öğrenme oranı birlikte seçilir.", "The number of trees and the learning rate are chosen together."), t("İyi ayarlanırsa bu dünyada en iyi model: 0,807.", "Well tuned, it is the best model in this world: 0.807.")])}
${link(lang, 6, "boosting")}`);
  };

  /* ------------------------------------------------------------ Ünite 6 */
  B["m5-u6"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Yüz ağaçlık bir boosting modeli bir başvurana %62 dedi. Bir banka bu başvuruyu reddederse nedenini söyleyebilmeli; bir denetçi modelin mantıklı davranıp davranmadığını görmek ister. <b>SHAP</b>, tek bir tahmini değişkenlerin katkılarına bölerek bu soruyu yanıtlar.", "A hundred-tree boosting model told an applicant 62%. If a bank rejects the application it should be able to say why; an auditor wants to see whether the model behaves sensibly. <b>SHAP</b> answers this by splitting a single prediction into the variables' contributions.")}</p>
${sec(1, 0, t("Sezgi: ortak bir kazancı paylaştırmak", "Intuition: sharing out a joint gain"), analogy("🤝", t("Altı kişilik bir ekip bir projeden kâr etti. Kim ne kadar pay almalı? Oyun teorisindeki Shapley değeri şöyle yanıtlar: her kişinin, ekibe katıldığı bütün olası sıralarda kazanca yaptığı ortalama katkı. SHAP aynı fikri modele uygular: “kazanç” tahminin ortalamadan sapması, “ekip” değişkenlerdir.", "A team of six made a profit on a project. How much should each get? The Shapley value from game theory answers: each person's average contribution to the gain over all possible orders in which they could join the team. SHAP applies the same idea to a model: the “gain” is the prediction's departure from the average, the “team” is the variables.")))}
${sec(2, 1, t("Toplama özelliği", "Additivity"), formula(t("modelin tahmini (log-odds) = taban + φ<sub>borç</sub> + φ<sub>gecikme</sub> + … + φ<sub>yaş</sub>", "the model's prediction (log-odds) = base + φ<sub>debt</sub> + φ<sub>delinquency</sub> + … + φ<sub>age</sub>"), [[t("taban", "base"), t("ortalama başvuranın tahmini: −1,93 (olasılık %13)", "the average applicant's prediction: −1.93 (probability 13%)")], ["φ", t("değişkenin bu başvuru için katkısı; pozitif riski artırır", "the variable's contribution for this application; positive raises risk")], [t("ölçek", "scale"), t("sınıflandırmada log-odds; olasılık en sonda 1/(1+e<sup>−z</sup>) ile hesaplanır", "log-odds in classification; the probability is computed at the end with 1/(1+e<sup>−z</sup>)")]]))}
${sec(3, 2, t("Çözümlü örnek: başvuran A", "Worked example: applicant A"), fig("u6_waterfall", lang, t("<b>Şekil 1.</b> Şelale grafiği: taban değerden başlayıp her değişkenin katkısı ekleniyor. Borç/gelir 1,96 ve gecikme riski en çok artırıyor; yüksek gelir biraz azaltıyor. Toplam 0,50 log-odds, yani %62.", "<b>Figure 1.</b> Waterfall plot: starting from the base value, each variable's contribution is added. Debt/income of 1.96 and the delinquency raise the risk most; high income lowers it a little. The total is 0.50 log-odds, i.e. 62%.")) +
      steps([t("Taban: −1,93.", "Base: −1.93."), t("Katkılar: +1,56 + 1,06 − 0,40 − 0,11 + 0,21 + 0,12 = +2,44.", "Contributions: +1.56 + 1.06 − 0.40 − 0.11 + 0.21 + 0.12 = +2.44."), t("Tahmin: −1,93 + 2,44 = 0,51 ≈ modelin 0,50'si (yuvarlama farkı).", "Prediction: −1.93 + 2.44 = 0.51 ≈ the model's 0.50 (rounding)."), t("Olasılık: 1/(1 + e<sup>−0,50</sup>) = %62.", "Probability: 1/(1 + e<sup>−0.50</sup>) = 62%.")]))}
${sec(4, 3, t("Colab'da", "In Colab"), code(t(`import shap
ex = shap.TreeExplainer(gb)                     # ağaç modelleri için hızlı ve kesin SHAP
sv = ex.shap_values(X_tst[:2000])               # 2.000 × 6 katkı matrisi
taban = float(np.ravel(ex.expected_value)[0])
shap.plots.waterfall(shap.Explanation(values=sv[27], base_values=taban, data=X_tst[27], feature_names=adlar))`, `import shap
ex = shap.TreeExplainer(gb)                     # fast, exact SHAP for tree models
sv = ex.shap_values(X_te[:2000])                # 2,000 × 6 contribution matrix
base = float(np.ravel(ex.expected_value)[0])
shap.plots.waterfall(shap.Explanation(values=sv[27], base_values=base, data=X_te[27], feature_names=names))`)) +
      `<p class="c-note">${t("SHAP kütüphanesi tarayıcıdaki Python'da çalışmadığı için bu ünitenin katkıları 6. hafta notebook'undan alınmıştır; kodu Ünite 9'daki Colab atölyesinde kendin çalıştıracaksın.", "Because the SHAP library does not run in the browser's Python, this unit's contributions are taken from the week 6 notebook; you will run the code yourself in the Unit 9 Colab workshop.")}</p>`)}
${sec(5, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Katkıyı olasılık puanı sanmak", "Taking a contribution for probability points"), t("Katkılar log-odds cinsindendir.", "Contributions are in log-odds."), t("Olasılığa yalnızca toplamı çevir.", "Convert only the total to a probability.")],
      [t("Katkıyı nedensel etki sanmak", "Taking a contribution for a causal effect"), t("SHAP modelin tahminini açıklar; dünyada bir değişiklik yapılırsa ne olacağını söylemez.", "SHAP explains the model's prediction; it does not say what would happen if something changed in the world."), t("“Model için” de; “gerçekte” deme.", "Say “for the model”, not “in reality”.")],
      [t("Tabanı sıfır sanmak", "Assuming the base is zero"), t("Katkılar ortalama başvurana göredir.", "Contributions are relative to the average applicant."), t("Tabanı her zaman raporla.", "Always report the base.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("SHAP tek bir tahmini değişkenlerin katkılarına böler.", "SHAP splits a single prediction into the variables' contributions."), t("Taban + katkılar = tahmin (log-odds).", "Base + contributions = prediction (log-odds)."), t("Katkılar modeli açıklar, dünyayı değil.", "Contributions explain the model, not the world.")])}
${link(lang, 6, "SHAP")}`);
  };

  /* ------------------------------------------------------------ Ünite 7 */
  B["m5-u7"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Tek bir başvurunun şelalesi bir hikâye anlatır. Binlerce başvurunun SHAP değerleri bir araya gelince modelin genel davranışı görünür: hangi değişkenlere dayandığı ve hangi biçimde. Ama bu resmi okurken sınırlarını da bilmek gerekir.", "One application's waterfall tells a story. Put thousands of applications' SHAP values together and the model's overall behaviour appears: which variables it relies on and in what shape. But reading this picture requires knowing its limits too.")}</p>
${sec(1, 0, t("Genel önem", "Overall importance"), fig("u7_imp", lang, t("<b>Şekil 1.</b> Ortalama |SHAP|: bir değişkenin tahminleri ortalamada ne kadar oynattığı. Yaş ikinci sırada; lojistik regresyonun neredeyse sıfır gördüğü değişken.", "<b>Figure 1.</b> Mean |SHAP|: how much a variable moves the predictions on average. Age ranks second: the variable logistic regression saw as almost zero.")))}
${sec(2, 1, t("Biçim: bağımlılık grafikleri", "Shape: dependence plots"), fig("u7_dep", lang, t("<b>Şekil 2.</b> Her nokta bir başvuru. Solda yaşın katkısı U biçimi çiziyor; sağda borç/gelirin katkısı 0,7'de sıçrıyor. Gecikmesi olanlarda (pembe) borç yüksekken katkı daha da büyük: etkileşim.", "<b>Figure 2.</b> Each dot is an application. On the left, age's contribution traces a U shape; on the right, debt/income's contribution jumps at 0.7. For delinquent applicants (pink) the contribution is even larger when debt is high: interaction.")) +
      `<p>${t("Model bu üç biçimi bizim söylememize gerek kalmadan öğrenmiş; SHAP da onları görünür kılıyor. Bunu bildiğimiz bir simülasyonda sınayabiliyoruz: gerçek veride bu sağlamayı ham veriyle (örneğin dilimlere göre oranlarla) yapmak gerekir.", "The model learned all three shapes without us telling it; SHAP makes them visible. We can check this because it is a simulation we know: on real data this check must be done against the raw data (for example, rates by band).")}</p>`)}
${sec(3, 2, t("Sınırlar", "Limits"), cards([
      [3, "🔗", t("İlişkili değişkenler", "Correlated variables"), t("Yaş ve çalışma süresi ilişkili (0,51). Katkıyı paylaşırlar: çalışma süresini çıkarınca AUC yalnızca 0,807'den 0,802'ye iniyor, çünkü bilgisinin bir kısmını yaş taşıyor.", "Age and years employed are correlated (0.51). They share credit: removing years employed lowers AUC only from 0.807 to 0.802, because age carries part of its information.")],
      [4, "🎯", t("Nedensellik değil", "Not causality"), t("SHAP modelin neye dayandığını gösterir; bir değişkeni değiştirmenin temerrüdü değiştireceğini göstermez.", "SHAP shows what the model relies on; it does not show that changing a variable will change default.")],
      [1, "📊", t("Ortalama gizler", "Averages hide"), t("Gecikme yalnızca başvuranların %15'inde var; ortalama |SHAP|'i düşük (0,20), ama gecikmesi olanlarda katkısı 0,58–0,75.", "Only 15% of applicants have a delinquency; its mean |SHAP| is low (0.20), but for those with one the contribution is 0.58–0.75.")],
      [0, "🧭", t("Modele özgü", "Model-specific"), t("SHAP bu modeli açıklar. Başka bir model aynı veride başka değişkenlere dayanabilir.", "SHAP explains this model. Another model may rely on other variables in the same data.")]
    ]))}
${sec(4, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Önemi “neden” diye okumak", "Reading importance as “cause”"), t("“Yaş temerrüdün ikinci büyük nedeni” yanlıştır.", "“Age is the second biggest cause of default” is wrong."), t("“Modelin en çok dayandığı ikinci değişken” de.", "Say “the variable the model relies on second most”.")],
      [t("Önemi adillik yargısına çevirmek", "Turning importance into a fairness verdict"), t("Önemli olması, kullanılmasının yasal ya da adil olduğu anlamına gelmez.", "Being important does not mean using it is legal or fair."), t("Adilliği ayrıca değerlendir.", "Evaluate fairness separately.")],
      [t("Düşük ortalama önemi “önemsiz” saymak", "Calling a low average importance “unimportant”"), t("Nadir ama güçlü etkiler gizlenebilir.", "Rare but strong effects can be hidden."), t("Bağımlılık grafiğine ve alt gruplara bak.", "Look at the dependence plot and subgroups.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Ortalama |SHAP| genel önemi, bağımlılık grafiği biçimi gösterir.", "Mean |SHAP| shows overall importance; the dependence plot shows shape."), t("İlişkili değişkenler katkıyı paylaşır.", "Correlated variables share credit."), t("SHAP modeli açıklar; nedensellik ve adillik ayrı sorulardır.", "SHAP explains the model; causality and fairness are separate questions.")])}
${link(lang, 6, t("SHAP'in sınırları", "the limits of SHAP"))}`);
  };

  /* ------------------------------------------------------------ Ünite 8 */
  B["m5-u8"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Simülasyonda ağaçlar lojistik regresyonu 0,07 AUC geçti, çünkü o dünyayı güçlü doğrusal olmayan etkilerle biz kurduk. Gerçek veride kazanç ne kadar? Modül 4'teki Tayvan kart verisine dönüyoruz: aynı bölme, aynı test verisi.", "In the simulation trees beat logistic regression by 0.07 AUC, because we built that world with strong nonlinear effects. How big is the gain on real data? We return to Module 4's Taiwanese card data: the same split, the same test data.")}</p>
${sec(1, 0, t("Karşılaştırma", "The comparison"), fig("u8_compare", lang, t("<b>Şekil 1.</b> 9.000 test müşterisinde AUC. Lojistik regresyon kodlar çözülünce 0,713'ten 0,762'ye çıkıyor; topluluklar ham kodlarla 0,773–0,778 alıyor. Eksen 0,70'ten başlıyor: farklar küçük.", "<b>Figure 1.</b> AUC on 9,000 test customers. Logistic regression rises from 0.713 to 0.762 once the codes are decoded; the ensembles get 0.773–0.778 with the raw codes. The axis starts at 0.70: the gaps are small.")))}
${sec(2, 1, t("Ne öğrendik?", "What did we learn?"), steps([t("<b>Ağaçlar hazırlığa daha az bağımlı:</b> orman ham kodlarla da çözülmüş kodlarla da 0,778 alıyor; kategorileri kendisi ayırıyor.", "<b>Trees depend less on preparation:</b> the forest gets 0.778 with raw and decoded codes alike; it separates the categories itself."), t("<b>Kazanç küçük:</b> iyi hazırlanmış lojistik regresyona göre +0,01–0,02 AUC; 5:1 maliyette maliyet 0,576'dan 0,570'e.", "<b>The gain is small:</b> +0.01–0.02 AUC over a well-prepared logistic regression; at 5:1 cost, the cost goes from 0.576 to 0.570."), t("<b>Tek ağaç zayıf:</b> 0,749, lojistiğin bile gerisinde.", "<b>A single tree is weak:</b> 0.749, behind even logistic."), t("<b>Kalibrasyon iyi:</b> boosting'in olasılıkları gerçekleşen oranları yakından izliyor.", "<b>Calibration is good:</b> boosting's probabilities closely track realised rates.")]))}
${sec(3, 2, t("Hızlı boosting", "Fast boosting"), code(t(`boost = HistGradientBoostingClassifier(max_iter=200, learning_rate=0.05, max_leaf_nodes=8,
                                       early_stopping=False, random_state=1).fit(ham(egitim), y_e)`, `boost = HistGradientBoostingClassifier(max_iter=200, learning_rate=0.05, max_leaf_nodes=8,
                                       early_stopping=False, random_state=1).fit(raw(train), y_tr)`)) +
      `<p>${t("Aynı yöntemin büyük veri için sürümü: her değişkeni önce 255 gruba ayırır, böylece eşik aramak çok hızlanır. <code>max_iter</code> ağaç sayısıdır. 10.000'den fazla gözlemde <code>early_stopping</code> varsayılan olarak açıktır: model eğitim verisinin bir parçasını ayırıp ağaç sayısını kendisi seçer. Seçimi kendimiz yapacaksak kapatmalıyız.", "The version of the same method for large data: it first sorts each variable into 255 bins, which makes the threshold search much faster. <code>max_iter</code> is the number of trees. With more than 10,000 observations <code>early_stopping</code> is on by default: the model sets aside part of the training data and chooses the number of trees itself. If we are making the choice ourselves, we should turn it off.")}</p>`)}
${sec(4, 3, t("Hangisini seçmeli?", "Which to choose?"), table([t("Ölçüt", "Criterion"), t("Lojistik regresyon", "Logistic regression"), t("Orman / boosting", "Forest / boosting")], [
      ["AUC", nf(0.762, 3, lang), nf(0.773, 3, lang) + "–" + nf(0.778, 3, lang)],
      [t("Özellik hazırlığı", "Feature preparation"), t("gerekli (kodları çözmek)", "needed (decoding the codes)"), t("daha az", "less")],
      [t("Açıklama", "Explanation"), t("katsayılar, doğrudan", "coefficients, directly"), t("SHAP gerekir", "needs SHAP")],
      [t("Kararlılık ve bakım", "Stability and maintenance"), t("yüksek", "high"), t("daha karmaşık", "more complex")]
    ]) + `<p>${t("Doğru yanıt bağlama bağlıdır. Küçük bir AUC kazancı büyük bir portföyde anlamlı olabilir; ama açıklanabilirlik ve denetim yükü de bir maliyettir. Karar ölçülerek ve gerekçelendirilerek verilmelidir.", "The right answer depends on the context. A small AUC gain may matter in a large portfolio; but explainability and audit burden are costs too. The decision should be made with measurements and reasons.")}</p>`)}
${sec(5, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Modelleri farklı verilerle karşılaştırmak", "Comparing models on different data"), t("Ormanın eğitim AUC'si 0,857; test 0,778.", "The forest's training AUC is 0.857; test 0.778."), t("Hepsini aynı test verisiyle.", "All on the same test data.")],
      [t("Küçük farkları kesin saymak", "Treating small gaps as certain"), t("0,005'lik fark başka bir bölmede tersine dönebilir.", "A 0.005 gap may reverse in another split."), t("Belirsizliği ölç.", "Measure the uncertainty.")],
      [t("Simülasyon sonucunu gerçeğe taşımak", "Carrying a simulation result into reality"), t("Simülasyondaki 0,07'lik kazanç orada kurduğumuz etkilerden geliyordu.", "The 0.07 gain in the simulation came from the effects we built in."), t("Gerçek veride yeniden ölç.", "Measure again on real data.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Gerçek veride topluluklar küçük ama tutarlı bir kazanç sağladı.", "On real data the ensembles gave a small but consistent gain."), t("Ağaçlar özellik hazırlığına daha az bağımlıdır.", "Trees depend less on feature preparation."), t("Model seçimi yalnızca AUC değil; açıklama, kararlılık ve adillik de tartılır.", "Model choice is not only AUC; explanation, stability and fairness are weighed too.")])}`);
  };

  const C = {};
  Object.keys(B).forEach((id) => { C[id] = { tr: B[id]("tr"), en: B[id]("en") }; });
  K.apply(U, C, 10);
  K.prepend(U, "m5-u9", F, "u9_flow", { tr: "<b>Şekil 1.</b> Atölyenin akışı.", en: "<b>Figure 1.</b> The workshop's flow." });
})();
