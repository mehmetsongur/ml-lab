/* Modül 5 — Ağaçlar, topluluklar ve açıklanabilirlik · Üniteler 1–5
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 * "Örnek YZ yanıtları" öğretim amacıyla hazırlanmıştır.
 */
(function () {
  "use strict";
  const D = window.M5_DATA, U = window.M5_UNITS, ln = D.line;
  const W = D.WORLD;
  const PK = ["numpy", "scikit-learn"];
  const C0 = { tr: "", en: "" };

  /* =================================================================== */
  /* Ünite 1 — Sorularla bölmek: karar ağacı                               */
  /* =================================================================== */
  U.push({
    id: "m5-u1", minutes: 25, packages: PK,
    title: { tr: "Sorularla bölmek: karar ağacı", en: "Splitting with questions: the decision tree" },
    blurb: { tr: "Risk her zaman düz bir çizgi değildir: eşikler, etkileşimler, U biçimleri. Karar ağacı veriden bir soru dizisi öğrenir ve bunları kendiliğinden yakalar.", en: "Risk is not always a straight line: thresholds, interactions, U shapes. A decision tree learns a sequence of questions from the data and captures them on its own." },
    terms: [{ tr: "karar ağacı", en: "decision tree" }, { tr: "bölme (soru)", en: "split (question)" }, { tr: "yaprak", en: "leaf" }, { tr: "etkileşim", en: "interaction" }],
    concept: C0,
    playground: { type: "treeSplit", intro: { tr: "Borç/gelir oranına göre tek bir soru sor: eşiği kaydır ve iki gruptaki temerrüt oranlarına bak. Sonra en iyi eşiği ağaca buldur.", en: "Ask a single question about the debt/income ratio: slide the threshold and look at the default rates in the two groups. Then let the tree find the best threshold." }, takeaway: { tr: "Ağaç, iki grubu birbirinden en çok ayıran soruyu seçer; sonra her grupta aynı işi tekrarlar.", en: "The tree picks the question that best separates the two groups; then it repeats the job within each group." } },
    cells: [
      {
        id: "m5-u1-c1", kind: "run",
        task: { tr: "Bu modülün kredi dünyasında risk doğrusal değil: borç/gelir 0,7'yi aşınca sıçrıyor, gecikme yalnızca borcu yüksek olanlarda çok tehlikeli, yaşın etkisi U biçimli. Modül 4'ün lojistik regresyonunu deniyoruz. Önce tahmin et.", en: "In this module's credit world risk is not linear: it jumps once debt/income exceeds 0.7, delinquency is very dangerous only for high-debt applicants, and age has a U-shaped effect. We try Module 4's logistic regression. Predict first." },
        predict: { q: { tr: "Gerçek olasılıklarla ulaşılabilecek en yüksek AUC 0,818. Lojistik regresyon ne alır?", en: "The highest AUC reachable with the true probabilities is 0.818. What does logistic regression get?" }, options: { tr: ["0,81 civarı", "0,73 civarı", "0,50 civarı"], en: ["Around 0.81", "Around 0.73", "Around 0.50"] }, answer: 1, explain: { tr: "Doğrusal bir skor eşiği, etkileşimi ve U biçimini yakalayamaz; bilginin bir kısmı kaçar.", en: "A linear score cannot capture the threshold, the interaction or the U shape; part of the information is lost." } },
        code: { tr: W.tr + `\nprint(f"Temerrüt oranı: eğitim %{100 * y_egt.mean():.1f}, test %{100 * y_tst.mean():.1f}")\nprint("En yüksek AUC (gerçek olasılıklar):", round(roc_auc_score(y_tst, p_gercek), 3))\nlogit = LogisticRegression(C=1e6, max_iter=2000).fit(X_egt, y_egt)\nprint("Lojistik regresyon test AUC     :", round(roc_auc_score(y_tst, logit.predict_proba(X_tst)[:, 1]), 3))\nprint("Yaşın katsayısı:", round(logit.coef_[0][5], 2))`, en: W.en + `\nprint(f"Default rate: training {100 * y_tr.mean():.1f}%, test {100 * y_te.mean():.1f}%")\nprint("Highest AUC (true probabilities):", round(roc_auc_score(y_te, p_true), 3))\nlogit = LogisticRegression(C=1e6, max_iter=2000).fit(X_tr, y_tr)\nprint("Logistic regression test AUC   :", round(roc_auc_score(y_te, logit.predict_proba(X_te)[:, 1]), 3))\nprint("Age coefficient:", round(logit.coef_[0][5], 2))` },
        after: { tr: "Lojistik regresyon 0,735; tavan 0,818. Yaşın katsayısı −0,06, yani “yaşın etkisi yok” diyor. Oysa bu dünyada yaş önemli: U biçimini düz bir çizgi ortalayıp sıfırlıyor.", en: "Logistic regression gets 0.735; the ceiling is 0.818. The age coefficient is −0.06, i.e. it says “age has no effect”. Yet in this world age matters: a straight line averages the U shape out to zero." }
      },
      {
        id: "m5-u1-c2", kind: "run",
        task: { tr: "Derinliği 3 olan, her yaprağında en az 100 kişi bulunan bir ağaç kuruyor ve sorularını yazdırıyoruz. Önce tahmin et.", en: "We build a tree of depth 3 with at least 100 people in each leaf and print its questions. Predict first." },
        predict: { q: { tr: "Ağacın ilk sorusu hangi değişkenle ilgili olur?", en: "Which variable is the tree's first question about?" }, options: { tr: ["Yaş", "Borç/gelir", "Gelir"], en: ["Age", "Debt/income", "Income"] }, answer: 1, explain: { tr: "Riskteki en büyük sıçrama borç/gelir 0,7'yi aşınca oluyor; iki grubu en çok ayıran soru bu.", en: "The biggest jump in risk happens when debt/income exceeds 0.7; that is the question that separates the groups most." } },
        code: { tr: W.tr + `\nagac = DecisionTreeClassifier(max_depth=3, min_samples_leaf=100, random_state=0).fit(X_egt, y_egt)\nprint("Test AUC:", round(roc_auc_score(y_tst, agac.predict_proba(X_tst)[:, 1]), 3))\nprint(export_text(agac, feature_names=adlar, show_weights=True))   # weights: [öder, temerrüt] sayıları`, en: W.en + `\ntree = DecisionTreeClassifier(max_depth=3, min_samples_leaf=100, random_state=0).fit(X_tr, y_tr)\nprint("Test AUC:", round(roc_auc_score(y_te, tree.predict_proba(X_te)[:, 1]), 3))\nprint(export_text(tree, feature_names=names, show_weights=True))   # weights: [pays, default] counts` },
        after: { tr: "Yalnızca sekiz yaprakla AUC 0,733: lojistik regresyonla aynı düzeyde. Üç bulgu: ilk soru borç/gelir ≤ 0,68 (gerçek eşik 0,7); gecikme sorusu yalnızca borcu yüksek dalda soruluyor (etkileşim); sol dalda yaş iki kez soruluyor ve hem çok gençlerin hem çok yaşlıların temerrüt oranı yüksek (U biçimi). Bunların hiçbirini modele biz söylemedik.", en: "With only eight leaves AUC is 0.733: the same level as logistic regression. Three findings: the first question is debt/income ≤ 0.68 (true threshold 0.7); the delinquency question is asked only in the high-debt branch (interaction); in the left branch age is asked twice, and both the very young and the very old have high default rates (U shape). We told the model none of this." }
      },
      {
        id: "m5-u1-c3", kind: "fill",
        task: { tr: "Ağacın bir başvurana verdiği olasılık, düştüğü yapraktaki temerrüt oranıdır. Borç/gelir 1,0 ve önceki gecikmesi olan (diğer özellikler ortalama) bir başvuranın temerrüt olasılığını al.", en: "The probability a tree gives an applicant is the default rate in the leaf they land in. Get the default probability of an applicant with debt/income 1.0 and a past delinquency (other features average)." },
        code: { tr: W.tr + `\nagac = DecisionTreeClassifier(max_depth=3, min_samples_leaf=100, random_state=0).fit(X_egt, y_egt)\nbasvuran = np.array([[1.0, 1, 0, 0, 0, 0]])\np = agac.predict_proba(basvuran)[0, ___]\nprint("Temerrüt olasılığı:", round(p, 3))`, en: W.en + `\ntree = DecisionTreeClassifier(max_depth=3, min_samples_leaf=100, random_state=0).fit(X_tr, y_tr)\napplicant = np.array([[1.0, 1, 0, 0, 0, 0]])\np = tree.predict_proba(applicant)[0, ___]\nprint("Default probability:", round(p, 3))` },
        solution: { tr: W.tr + `\nagac = DecisionTreeClassifier(max_depth=3, min_samples_leaf=100, random_state=0).fit(X_egt, y_egt)\nbasvuran = np.array([[1.0, 1, 0, 0, 0, 0]])\np = agac.predict_proba(basvuran)[0, 1]\nprint("Temerrüt olasılığı:", round(p, 3))`, en: W.en + `\ntree = DecisionTreeClassifier(max_depth=3, min_samples_leaf=100, random_state=0).fit(X_tr, y_tr)\napplicant = np.array([[1.0, 1, 0, 0, 0, 0]])\np = tree.predict_proba(applicant)[0, 1]\nprint("Default probability:", round(p, 3))` },
        hints: [{ tr: "<code>predict_proba</code>'nın ikinci sütunu (indeks 1) temerrüt sınıfının olasılığıdır.", en: "The second column (index 1) of <code>predict_proba</code> is the default class's probability." }],
        checks: [{ py: { tr: "abs(p - agac.predict_proba(basvuran)[0, 1]) < 1e-12", en: "abs(p - tree.predict_proba(applicant)[0, 1]) < 1e-12" }, msg: { tr: "<code>p</code>, temerrüt sınıfının olasılığı (ikinci sütun) olmalı.", en: "<code>p</code> should be the default class's probability (second column)." } }],
        after: { tr: "0,548: bu başvuran “borç > 0,68, çalışma süresi > −1,06, gecikme var” yaprağına düşüyor; oradaki 104 kişiden 57'si temerrüde düşmüş. Aynı yapraktaki herkes aynı olasılığı alır: ağacın olasılıkları basamaklıdır.", en: "0.548: this applicant lands in the leaf “debt > 0.68, years employed > −1.06, delinquent”; 57 of the 104 people there defaulted. Everyone in the same leaf gets the same probability: a tree's probabilities come in steps." }
      },
      {
        id: "m5-u1-c4", kind: "interpret",
        task: { tr: "YZ karar ağacını yorumladı. Hangi cümleler yanlış?", en: "The AI interpreted the decision tree. Which sentences are wrong?" },
        prompt: { tr: "Derinliği 3 olan ağacın sorularını ve yapraklarını yorumlar mısın?", en: "Can you interpret the questions and leaves of the depth-3 tree?" },
        sentences: {
          tr: ["Ağaç, borç/gelir oranında 0,68 civarında bir eşik buldu; gerçek dünyadaki eşik 0,7.", "Gecikme sorusunun yalnızca borcu yüksek dalda sorulması, iki değişken arasında bir etkileşime işaret ediyor.", "İlk soru borç/gelir olduğuna göre temerrüdün nedeni borç/gelir oranıdır.", "Ağaç değişkenleri ölçeklemeden çalıştığı için sonuçları lojistik regresyondan her zaman daha güvenilirdir."],
          en: ["The tree found a threshold around 0.68 in the debt/income ratio; the true threshold is 0.7.", "The delinquency question being asked only in the high-debt branch points to an interaction between the two variables.", "Since the first question is debt/income, the debt/income ratio is the cause of default.", "Because the tree works without scaling the variables, its results are always more reliable than logistic regression's."]
        },
        bad: [2, 3],
        explain: {
          tr: ["Doğru.", "Doğru.", "<b>Yanlış:</b> ağaç bir öngörü modelidir; ilk soru en çok ayıran değişkendir, neden olduğu anlamına gelmez (Modül 1).", "<b>Yanlış:</b> ölçeklemeye gerek olmaması bir kolaylıktır, güvenilirlik değil. Tek bir ağaç kararsızdır (Ünite 3) ve AUC'si burada lojistik regresyonla aynı."],
          en: ["Correct.", "Correct.", "<b>Wrong:</b> a tree is a prediction model; the first question is the variable that separates most, which does not make it the cause (Module 1).", "<b>Wrong:</b> not needing scaling is a convenience, not reliability. A single tree is unstable (Unit 3), and its AUC here equals logistic regression's."]
        }
      }
    ],
    quiz: [
      { q: { tr: "Bir karar ağacı bir başvurana olasılığı nasıl verir?", en: "How does a decision tree give an applicant a probability?" }, options: { tr: ["Düştüğü yapraktaki temerrüt oranı olarak", "Katsayıları toplayarak", "Rastgele"], en: ["As the default rate in the leaf they land in", "By adding up coefficients", "At random"] }, answer: 0, explain: { tr: "Aynı yapraktaki herkes aynı olasılığı alır.", en: "Everyone in the same leaf gets the same probability." } },
      { q: { tr: "Ağaçların doğrusal modellere göre kendiliğinden yakaladığı şey hangisi?", en: "What do trees capture on their own, compared with linear models?" }, options: { tr: ["Eşikler ve etkileşimler", "Nedensel etkiler", "Zaman eğilimleri"], en: ["Thresholds and interactions", "Causal effects", "Time trends"] }, answer: 0, explain: { tr: "Sorular eşiktir; bir dalda sorulan soru etkileşimdir.", en: "Questions are thresholds; a question asked in one branch is an interaction." } },
      { q: { tr: "Lojistik regresyonun yaş katsayısı neden sıfıra yakın çıktı?", en: "Why did logistic regression's age coefficient come out near zero?" }, options: { tr: ["U biçimli etkiyi düz bir çizgi ortalayıp sıfırlıyor", "Yaşın hiçbir etkisi yok", "Veri yetersiz"], en: ["A straight line averages the U-shaped effect to zero", "Age has no effect at all", "Not enough data"] }, answer: 0, explain: { tr: "Doğrusal model yanlış biçimde kurulmuş.", en: "The linear model has the wrong functional form." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 2 — Derinlik ve aşırı uyum                                        */
  /* =================================================================== */
  const U2A = { tr: W.tr + `\nderinlikler = list(range(1, 16))\ntest_auc = [roc_auc_score(y_tst, DecisionTreeClassifier(max_depth=d, random_state=0).fit(X_egt, y_egt).predict_proba(X_tst)[:, 1]) for d in derinlikler]\nsecilen = derinlikler[int(np.argmax(test_auc))]\nprint("Seçilen derinlik:", secilen, "| beklenen AUC:", round(max(test_auc), 3))`, en: W.en + `\ndepths = list(range(1, 16))\ntest_auc = [roc_auc_score(y_te, DecisionTreeClassifier(max_depth=d, random_state=0).fit(X_tr, y_tr).predict_proba(X_te)[:, 1]) for d in depths]\nchosen = depths[int(np.argmax(test_auc))]\nprint("Chosen depth:", chosen, "| expected AUC:", round(max(test_auc), 3))` };
  U.push({
    id: "m5-u2", minutes: 25, packages: PK,
    title: { tr: "Derinlik ve aşırı uyum", en: "Depth and overfitting" },
    blurb: { tr: "Soru sayısı sınırsızsa ağaç eğitim verisini ezberler. Derinliği Modül 2'deki gibi eğitim verisinde çapraz doğrulamayla seçmek.", en: "With unlimited questions a tree memorises the training data. Choosing the depth by cross-validation on the training data, as in Module 2." },
    terms: [{ tr: "derinlik", en: "depth" }, { tr: "aşırı uyum", en: "overfitting" }, { tr: "hiperparametre", en: "hyperparameter" }],
    concept: C0,
    playground: { type: "treeDepth", intro: { tr: "Derinliği artır; eğitim, çapraz doğrulama ve test AUC'sinin nasıl ayrıştığına bak.", en: "Increase the depth; watch the training, cross-validation and test AUC drift apart." }, takeaway: { tr: "Eğitim AUC'si derinlikle hep artar; yeni veride başarı bir noktadan sonra düşer. Doğru derinliği çapraz doğrulama bulur.", en: "Training AUC always rises with depth; success on new data falls after some point. Cross-validation finds the right depth." } },
    cells: [
      {
        id: "m5-u2-c1", kind: "run",
        task: { tr: "Derinliği 15 olan, yani neredeyse sınırsız soru soran bir ağaç kuruyoruz. Önce tahmin et.", en: "We build a tree of depth 15, i.e. one that asks almost unlimited questions. Predict first." },
        predict: { q: { tr: "Eğitim ve test AUC'leri ne olur?", en: "What are the training and test AUCs?" }, options: { tr: ["İkisi de 0,80 civarı", "Eğitim 0,98, test 0,58", "Eğitim 0,60, test 0,98"], en: ["Both around 0.80", "Training 0.98, test 0.58", "Training 0.60, test 0.98"] }, answer: 1, explain: { tr: "Derin bir ağaç yapraklarına birkaç kişi kalana kadar böler: eğitim verisindeki gürültüyü ezberler.", en: "A deep tree splits until only a few people are left in its leaves: it memorises the noise in the training data." } },
        code: { tr: W.tr + `\nderin = DecisionTreeClassifier(max_depth=15, random_state=0).fit(X_egt, y_egt)\nprint("Yaprak sayısı:", derin.get_n_leaves())\nprint("Eğitim AUC:", round(roc_auc_score(y_egt, derin.predict_proba(X_egt)[:, 1]), 3))\nprint("Test AUC  :", round(roc_auc_score(y_tst, derin.predict_proba(X_tst)[:, 1]), 3))`, en: W.en + `\ndeep = DecisionTreeClassifier(max_depth=15, random_state=0).fit(X_tr, y_tr)\nprint("Number of leaves:", deep.get_n_leaves())\nprint("Training AUC:", round(roc_auc_score(y_tr, deep.predict_proba(X_tr)[:, 1]), 3))\nprint("Test AUC    :", round(roc_auc_score(y_te, deep.predict_proba(X_te)[:, 1]), 3))` },
        after: { tr: "Eğitim 0,983, test 0,583. Ağaç 3.000 başvuruya yüzlerce yaprak ayırıp gürültüyü ezberlemiş; yeni başvurularda yazı turadan biraz iyi. Modül 2'deki aşırı uyumun en çarpıcı örneği.", en: "Training 0.983, test 0.583. The tree has given hundreds of leaves to 3,000 applications and memorised the noise; on new applications it is barely better than a coin toss. The starkest example of Module 2's overfitting." }
      },
      {
        id: "m5-u2-c2", kind: "audit",
        task: { tr: "YZ'den en iyi derinliği seçmesini istedik. Hatalı satırı bul ve düzelt: derinlik, test verisine dokunmadan, eğitim verisinde <code>cross_val_score(..., cv=kf, scoring=\"roc_auc\")</code> ortalamasıyla seçilsin.", en: "We asked the AI to choose the best depth. Find the faulty line and fix it: the depth should be chosen without touching the test data, by the mean of <code>cross_val_score(..., cv=kf, scoring=\"roc_auc\")</code> on the training data." },
        ai: {
          prompt: { tr: "Karar ağacı için en iyi derinliği seç ve yeni verideki beklenen AUC'yi söyle.", en: "Choose the best depth for the decision tree and state the expected AUC on new data." },
          reply: { tr: "Derinlikleri tek tek deneyip en iyisini seçelim:", en: "Let us try the depths one by one and choose the best:" },
          code: U2A,
          claim: { tr: "En iyi derinlik 5; yeni başvurularda AUC 0,737 bekleyebiliriz.", en: "The best depth is 5; we can expect an AUC of 0.737 on new applications." }
        },
        bugLines: [ln(U2A.tr, "test_auc = [")],
        lineExplain: { tr: "Derinlik, test verisinde en iyi sonucu veren değer olarak seçilmiş. Test verisi bir seçim için kullanılınca raporlanan AUC iyimser olur ve artık yeni veriyi temsil etmez (Modül 2). Seçim eğitim verisinde çapraz doğrulamayla yapılmalı.", en: "The depth was chosen as the value that does best on the test data. Once the test data are used for a choice, the reported AUC is optimistic and no longer represents new data (Module 2). The choice should be made by cross-validation on the training data." },
        hints: [{ tr: "<code>test_auc = [cross_val_score(DecisionTreeClassifier(max_depth=d, random_state=0), X_egt, y_egt, cv=kf, scoring=\"roc_auc\").mean() for d in derinlikler]</code> (adı aynı kalabilir; artık çapraz doğrulama AUC'si).", en: "<code>test_auc = [cross_val_score(DecisionTreeClassifier(max_depth=d, random_state=0), X_tr, y_tr, cv=kf, scoring=\"roc_auc\").mean() for d in depths]</code> (the name can stay; it is now the cross-validation AUC)." }],
        solution: { tr: U2A.tr.replace(`test_auc = [roc_auc_score(y_tst, DecisionTreeClassifier(max_depth=d, random_state=0).fit(X_egt, y_egt).predict_proba(X_tst)[:, 1]) for d in derinlikler]`, `test_auc = [cross_val_score(DecisionTreeClassifier(max_depth=d, random_state=0), X_egt, y_egt, cv=kf, scoring="roc_auc").mean() for d in derinlikler]`), en: U2A.en.replace(`test_auc = [roc_auc_score(y_te, DecisionTreeClassifier(max_depth=d, random_state=0).fit(X_tr, y_tr).predict_proba(X_te)[:, 1]) for d in depths]`, `test_auc = [cross_val_score(DecisionTreeClassifier(max_depth=d, random_state=0), X_tr, y_tr, cv=kf, scoring="roc_auc").mean() for d in depths]`) },
        checks: [{ py: { tr: "secilen == 4", en: "chosen == 4" }, msg: { tr: "Eğitim verisinde 5 katlı çapraz doğrulamayla (<code>cv=kf</code>) seçilen derinlik farklı çıkmalı. Seçimi test verisiyle değil, eğitim verisiyle yap.", en: "The depth chosen by 5-fold cross-validation on the training data (<code>cv=kf</code>) should come out differently. Make the choice with the training data, not the test data." } }],
        after: { tr: "Çapraz doğrulama derinlik 4'ü seçiyor (AUC 0,719); bu derinliğin test AUC'si 0,730. YZ'nin 0,737'si, test verisinde 15 derinlik arasından en şanslısını seçmekten geliyordu.", en: "Cross-validation picks depth 4 (AUC 0.719); this depth's test AUC is 0.730. The AI's 0.737 came from picking the luckiest of 15 depths on the test data." }
      },
      {
        id: "m5-u2-c3", kind: "fill",
        task: { tr: "Derinliği sınırlamanın bir yolu da her yaprakta en az kaç kişi kalacağını belirlemektir. Derinliği 15 olan ağaca her yaprakta en az 100 kişi koşulunu ekle ve test AUC'sine bak.", en: "Another way to restrain a tree is to set the minimum number of people in each leaf. Add the condition “at least 100 people in each leaf” to the depth-15 tree and look at the test AUC." },
        code: { tr: W.tr + `\nagac = DecisionTreeClassifier(max_depth=15, min_samples_leaf=___, random_state=0).fit(X_egt, y_egt)\nprint("Yaprak sayısı:", agac.get_n_leaves(), "| test AUC:", round(roc_auc_score(y_tst, agac.predict_proba(X_tst)[:, 1]), 3))`, en: W.en + `\ntree = DecisionTreeClassifier(max_depth=15, min_samples_leaf=___, random_state=0).fit(X_tr, y_tr)\nprint("Number of leaves:", tree.get_n_leaves(), "| test AUC:", round(roc_auc_score(y_te, tree.predict_proba(X_te)[:, 1]), 3))` },
        solution: { tr: W.tr + `\nagac = DecisionTreeClassifier(max_depth=15, min_samples_leaf=100, random_state=0).fit(X_egt, y_egt)\nprint("Yaprak sayısı:", agac.get_n_leaves(), "| test AUC:", round(roc_auc_score(y_tst, agac.predict_proba(X_tst)[:, 1]), 3))`, en: W.en + `\ntree = DecisionTreeClassifier(max_depth=15, min_samples_leaf=100, random_state=0).fit(X_tr, y_tr)\nprint("Number of leaves:", tree.get_n_leaves(), "| test AUC:", round(roc_auc_score(y_te, tree.predict_proba(X_te)[:, 1]), 3))` },
        hints: [{ tr: "<code>min_samples_leaf=100</code>", en: "<code>min_samples_leaf=100</code>" }],
        checks: [{ py: { tr: "agac.min_samples_leaf == 100", en: "tree.min_samples_leaf == 100" }, msg: { tr: "<code>min_samples_leaf</code> 100 olmalı.", en: "<code>min_samples_leaf</code> should be 100." } }],
        after: { tr: "Aynı derinlik sınırıyla ama küçük yapraklar yasaklanınca yaprak sayısı 314'ten 22'ye iniyor, ağaç ezberleyemiyor ve test AUC'si 0,583'ten 0,760'a çıkıyor. Derinlik ve yaprak büyüklüğü, ağacın karmaşıklığını ayarlayan iki düğmedir; ikisi de çapraz doğrulamayla seçilir.", en: "With the same depth limit but small leaves forbidden, the number of leaves drops from 314 to 22, the tree cannot memorise, and the test AUC rises from 0.583 to 0.760. Depth and leaf size are two knobs that set a tree's complexity; both are chosen by cross-validation." }
      },
      {
        id: "m5-u2-c4", kind: "interpret",
        task: { tr: "YZ derinlik seçimini yorumladı. Hangi cümleler yanlış?", en: "The AI interpreted the depth choice. Which sentences are wrong?" },
        prompt: { tr: "Derinlik 15'te eğitim AUC 0,983, test 0,583; çapraz doğrulamanın seçtiği derinlik 4, test 0,730. Yorumlar mısın?", en: "At depth 15 training AUC is 0.983, test 0.583; cross-validation chose depth 4, test 0.730. Can you interpret this?" },
        sentences: {
          tr: ["Eğitim ve test AUC'si arasındaki büyük fark aşırı uyumun işaretidir.", "Derin ağaç eğitim verisinde neredeyse kusursuz olduğuna göre en iyi model odur.", "Çapraz doğrulama, test verisini kullanmadan yeni verideki başarıyı tahmin etmemizi sağlar.", "Derinlik 4 her veri setinde en iyi derinliktir."],
          en: ["The large gap between training and test AUC is a sign of overfitting.", "Since the deep tree is almost perfect on the training data, it is the best model.", "Cross-validation lets us estimate success on new data without using the test data.", "Depth 4 is the best depth in every data set."]
        },
        bad: [1, 3],
        explain: {
          tr: ["Doğru.", "<b>Yanlış:</b> eğitim başarısı ezberi de ölçer. Önemli olan yeni veri: 0,583.", "Doğru.", "<b>Yanlış:</b> en iyi derinlik verinin büyüklüğüne ve ilişkinin karmaşıklığına bağlıdır; her problemde yeniden seçilir."],
          en: ["Correct.", "<b>Wrong:</b> training success also measures memorisation. What matters is new data: 0.583.", "Correct.", "<b>Wrong:</b> the best depth depends on the data size and the complexity of the relationship; it is chosen again for every problem."]
        }
      }
    ],
    quiz: [
      { q: { tr: "Derinlik arttıkça eğitim AUC'si ne olur?", en: "What happens to training AUC as depth increases?" }, options: { tr: ["Hep artar", "Hep düşer", "Değişmez"], en: ["It always rises", "It always falls", "It does not change"] }, answer: 0, explain: { tr: "Daha çok soru, eğitim verisine daha iyi uyum demektir.", en: "More questions mean a better fit to the training data." } },
      { q: { tr: "Derinlik hangi veriyle seçilmeli?", en: "With which data should the depth be chosen?" }, options: { tr: ["Eğitim verisinde çapraz doğrulamayla", "Test verisiyle", "Tüm veriyle"], en: ["By cross-validation on the training data", "With the test data", "With all the data"] }, answer: 0, explain: { tr: "Test verisi yalnızca en sonda bir kez kullanılır.", en: "The test data are used only once, at the end." } },
      { q: { tr: "<code>min_samples_leaf</code> neyi sınırlar?", en: "What does <code>min_samples_leaf</code> limit?" }, options: { tr: ["Bir yapraktaki en az gözlem sayısını", "Ağaç sayısını", "Değişken sayısını"], en: ["The minimum number of observations in a leaf", "The number of trees", "The number of variables"] }, answer: 0, explain: { tr: "Küçük yapraklar ezberin kaynağıdır.", en: "Small leaves are the source of memorisation." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 3 — Tek ağacın kararsızlığı                                       */
  /* =================================================================== */
  const BOOT = { tr: `\nolasiliklar = []\nfor k in range(5):\n    idx = np.random.default_rng(k).integers(0, 3000, 3000)         # yerine koyarak 3.000 gözlem (bootstrap)\n    m = DecisionTreeClassifier(max_depth=4, random_state=0).fit(X_egt[idx], y_egt[idx])\n    olasiliklar.append(m.predict_proba(X_tst)[:, 1])`, en: `\nprobs = []\nfor k in range(5):\n    idx = np.random.default_rng(k).integers(0, 3000, 3000)         # 3,000 observations with replacement (bootstrap)\n    m = DecisionTreeClassifier(max_depth=4, random_state=0).fit(X_tr[idx], y_tr[idx])\n    probs.append(m.predict_proba(X_te)[:, 1])` };
  U.push({
    id: "m5-u3", minutes: 20, packages: PK,
    title: { tr: "Tek ağacın kararsızlığı", en: "The instability of a single tree" },
    blurb: { tr: "Veri biraz değişince ağacın soruları da değişir. Birçok ağacın ortalaması ise çok daha kararlı ve isabetlidir: toplulukların çıkış noktası.", en: "When the data change a little, the tree's questions change too. The average of many trees is far more stable and accurate: the starting point of ensembles." },
    terms: [{ tr: "kararsızlık (yüksek varyans)", en: "instability (high variance)" }, { tr: "bootstrap örneklemi", en: "bootstrap sample" }],
    concept: C0, playground: null,
    cells: [
      {
        id: "m5-u3-c1", kind: "run",
        task: { tr: "Eğitim verisinden yerine koyarak beş farklı örneklem çekip her birine derinliği 4 olan bir ağaç kuruyoruz. Önce tahmin et.", en: "We draw five different samples with replacement from the training data and build a depth-4 tree on each. Predict first." },
        predict: { q: { tr: "Beş ağacın ilk ve ikinci düzeydeki soruları aynı mı olur?", en: "Are the five trees' first- and second-level questions the same?" }, options: { tr: ["Hepsi tıpatıp aynı", "İlk soru aynı, ikinci düzey değişiyor", "Hepsi tamamen farklı"], en: ["All exactly the same", "The first question is the same, the second level varies", "All completely different"] }, answer: 1, explain: { tr: "En güçlü sinyal (borç/gelir eşiği) her örneklemde öne çıkar; daha zayıf sinyaller örneklemden örnekleme yer değiştirir.", en: "The strongest signal (the debt/income threshold) stands out in every sample; weaker signals swap places from sample to sample." } },
        code: { tr: W.tr + `\nfor k in range(5):\n    idx = np.random.default_rng(k).integers(0, 3000, 3000)         # bootstrap örneklemi\n    m = DecisionTreeClassifier(max_depth=4, random_state=0).fit(X_egt[idx], y_egt[idx])\n    t = m.tree_\n    ikinci = [adlar[t.feature[c]] for c in (t.children_left[0], t.children_right[0]) if t.feature[c] >= 0]\n    print(f"Örneklem {k + 1}: ilk soru {adlar[t.feature[0]]} ≤ {t.threshold[0]:.2f} | ikinci düzey: {' · '.join(ikinci):32s} | test AUC {roc_auc_score(y_tst, m.predict_proba(X_tst)[:, 1]):.3f}")`, en: W.en + `\nfor k in range(5):\n    idx = np.random.default_rng(k).integers(0, 3000, 3000)         # bootstrap sample\n    m = DecisionTreeClassifier(max_depth=4, random_state=0).fit(X_tr[idx], y_tr[idx])\n    t = m.tree_\n    second = [names[t.feature[c]] for c in (t.children_left[0], t.children_right[0]) if t.feature[c] >= 0]\n    print(f"Sample {k + 1}: first question {names[t.feature[0]]} ≤ {t.threshold[0]:.2f} | second level: {' · '.join(second):36s} | test AUC {roc_auc_score(y_te, m.predict_proba(X_te)[:, 1]):.3f}")` },
        after: { tr: "İlk soru beşinde de borç/gelir (eşik 0,67–0,74), ama ikinci düzeyde sağ dalın sorusu çalışma süresi, yaş ve gecikme arasında değişiyor; test AUC'leri 0,687 ile 0,741 arasında. Küçük bir veri değişikliği farklı bir ağaç, farklı bir hikâye üretiyor.", en: "The first question is debt/income in all five (threshold 0.67–0.74), but at the second level the right branch's question switches between years employed, age and delinquency; test AUCs range from 0.687 to 0.741. A small change in the data produces a different tree and a different story." }
      },
      {
        id: "m5-u3-c2", kind: "run",
        task: { tr: "Aynı beş ağacın olasılıklarının ortalamasını alıyoruz. Önce tahmin et.", en: "We average the probabilities of the same five trees. Predict first." },
        predict: { q: { tr: "Beş ağacın ortalamasının AUC'si, tek tek ağaçlara göre nasıl olur?", en: "How does the AUC of the five trees' average compare with the individual trees?" }, options: { tr: ["En kötü ağaç kadar", "Ortalamaları kadar", "En iyi ağaçtan da yüksek"], en: ["As low as the worst tree", "As their average", "Higher than even the best tree"] }, answer: 2, explain: { tr: "Her ağacın hatası kısmen rastgele; ortalama alınca rastgele hatalar birbirini götürür, ortak sinyal kalır.", en: "Each tree's error is partly random; averaging cancels the random errors and leaves the shared signal." } },
        code: { tr: W.tr + BOOT.tr + `\nfor k, o in enumerate(olasiliklar):\n    print(f"Ağaç {k + 1}: test AUC {roc_auc_score(y_tst, o):.3f}")\nprint(f"Beş ağacın ortalaması: test AUC {roc_auc_score(y_tst, np.mean(olasiliklar, axis=0)):.3f}")`, en: W.en + BOOT.en + `\nfor k, o in enumerate(probs):\n    print(f"Tree {k + 1}: test AUC {roc_auc_score(y_te, o):.3f}")\nprint(f"Average of the five trees: test AUC {roc_auc_score(y_te, np.mean(probs, axis=0)):.3f}")` },
        after: { tr: "Ortalama 0,771: en iyi ağaçtan (0,741) bile belirgin biçimde yüksek ve lojistik regresyonu (0,735) geçiyor. Yalnızca beş ağaçla. Peki yüzlerce ağaçla ne olur? Ünite 4.", en: "The average gets 0.771: clearly higher than even the best tree (0.741) and above logistic regression (0.735). With only five trees. What happens with hundreds? Unit 4." }
      },
      {
        id: "m5-u3-c3", kind: "interpret",
        task: { tr: "YZ kararsızlık deneyini yorumladı. Hangi cümleler yanlış?", en: "The AI interpreted the instability experiment. Which sentences are wrong?" },
        prompt: { tr: "Beş bootstrap ağacının ikinci düzey soruları farklı çıktı; ortalamaları en iyi ağaçtan iyi. Yorumlar mısın?", en: "The five bootstrap trees' second-level questions differed; their average beats the best tree. Can you interpret this?" },
        sentences: {
          tr: ["Tek bir ağacın soruları verideki küçük değişikliklere duyarlıdır; buna yüksek varyans denir.", "Ağaçlardan biri doğru, diğerleri yanlış; doğru olanı bulmalıyız.", "Ortalama almak, ağaçların birbirinden bağımsız rastgele hatalarını azaltır.", "Tek bir ağacın sorularını “bankanın kredi kuralları” diye yayımlamak, veri biraz değişince kuralların da değişebileceğini gizler."],
          en: ["A single tree's questions are sensitive to small changes in the data; this is called high variance.", "One of the trees is right and the others are wrong; we should find the right one.", "Averaging reduces the trees' mutually independent random errors.", "Publishing a single tree's questions as “the bank's credit rules” hides that the rules may change when the data change a little."]
        },
        bad: [1],
        explain: {
          tr: ["Doğru.", "<b>Yanlış:</b> her ağaç gerçeğin gürültülü bir tahminidir; hiçbiri “doğru ağaç” değildir. Ortalama, tek tek hepsinden iyidir.", "Doğru: ağaçlar ne kadar az ilişkiliyse kazanç o kadar büyük (Ünite 4).", "Doğru: yorumlanabilirlik ile kararlılık arasında bir gerilim var."],
          en: ["Correct.", "<b>Wrong:</b> each tree is a noisy estimate of the truth; none is “the right tree”. The average beats all of them individually.", "Correct: the less correlated the trees, the bigger the gain (Unit 4).", "Correct: there is a tension between interpretability and stability."]
        }
      }
    ],
    quiz: [
      { q: { tr: "Bootstrap örneklemi nedir?", en: "What is a bootstrap sample?" }, options: { tr: ["Veriden yerine koyarak aynı büyüklükte çekilen örneklem", "Verinin ilk yarısı", "Test verisi"], en: ["A sample of the same size drawn with replacement from the data", "The first half of the data", "The test data"] }, answer: 0, explain: { tr: "Bazı gözlemler birden çok kez, bazıları hiç gelmez.", en: "Some observations appear several times, some not at all." } },
      { q: { tr: "Ağaçların ortalaması neden tek bir ağaçtan iyidir?", en: "Why is the average of trees better than a single tree?" }, options: { tr: ["Rastgele hatalar birbirini götürür", "Daha derin olduğu için", "Ezberlediği için"], en: ["Random errors cancel out", "Because it is deeper", "Because it memorises"] }, answer: 0, explain: { tr: "Ortak sinyal kalır, gürültü azalır.", en: "The shared signal stays, the noise shrinks." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 4 — Bagging ve rassal orman                                       */
  /* =================================================================== */
  const U4A = { tr: W.tr + `\norman = RandomForestClassifier(n_estimators=200, min_samples_leaf=10, max_features=None, random_state=1).fit(X_egt, y_egt)\nprint("Rassal orman test AUC:", round(roc_auc_score(y_tst, orman.predict_proba(X_tst)[:, 1]), 3))`, en: W.en + `\nforest = RandomForestClassifier(n_estimators=200, min_samples_leaf=10, max_features=None, random_state=1).fit(X_tr, y_tr)\nprint("Random forest test AUC:", round(roc_auc_score(y_te, forest.predict_proba(X_te)[:, 1]), 3))` };
  U.push({
    id: "m5-u4", minutes: 25, packages: PK,
    title: { tr: "Bagging ve rassal orman", en: "Bagging and random forests" },
    blurb: { tr: "Yüzlerce bootstrap ağacının ortalaması (bagging) ve her soruda değişkenlerin yalnızca bir kısmını deneyerek ağaçları birbirinden farklılaştırmak (rassal orman).", en: "The average of hundreds of bootstrap trees (bagging), and making the trees differ by trying only some of the variables at each question (random forest)." },
    terms: [{ tr: "bagging", en: "bagging" }, { tr: "rassal orman", en: "random forest" }, { tr: "max_features", en: "max_features" }],
    concept: C0,
    playground: { type: "forestGrow", intro: { tr: "Ağaç sayısını artır ve ormanın test AUC'sinin nasıl yükseldiğine bak. Her soruda denenen değişken sayısını değiştir.", en: "Increase the number of trees and watch the forest's test AUC rise. Change the number of variables tried at each question." }, takeaway: { tr: "Ağaç eklemek aşırı uyuma yol açmaz; kazanç önce hızlı, sonra yavaş. Ağaçlar birbirinden ne kadar farklıysa ortalama o kadar iyi.", en: "Adding trees does not cause overfitting; the gain is fast at first, then slow. The more the trees differ from each other, the better the average." } },
    cells: [
      {
        id: "m5-u4-c1", kind: "run",
        task: { tr: "200 ağaçlık iki topluluk kuruyoruz: her soruda bütün değişkenleri deneyen (bagging) ve her soruda rastgele 2 değişken deneyen (rassal orman, <code>max_features=\"sqrt\"</code>). Birkaç saniye sürebilir. Önce tahmin et.", en: "We build two ensembles of 200 trees: one that tries all variables at each question (bagging) and one that tries 2 random variables at each question (random forest, <code>max_features=\"sqrt\"</code>). It may take a few seconds. Predict first." },
        predict: { q: { tr: "Değişkenlerin bir kısmını gizlemek ormanı nasıl etkiler?", en: "How does hiding some variables affect the forest?" }, options: { tr: ["Kötüleştirir: bilgi kaybı", "Biraz iyileştirir: ağaçlar birbirine daha az benzer", "Hiç etkilemez"], en: ["Worse: information is lost", "Slightly better: the trees resemble each other less", "No effect at all"] }, answer: 1, explain: { tr: "Bagging'de her ağaç ilk soruyu borç/gelirle sorar; ağaçlar birbirine benzer ve hataları da benzer. Değişkenleri rastgele gizlemek ağaçları çeşitlendirir.", en: "In bagging every tree asks its first question about debt/income; the trees are alike and so are their errors. Hiding variables at random diversifies the trees." } },
        code: { tr: W.tr + `\nbag = RandomForestClassifier(n_estimators=200, min_samples_leaf=10, max_features=None, random_state=1).fit(X_egt, y_egt)\norman = RandomForestClassifier(n_estimators=200, min_samples_leaf=10, max_features="sqrt", random_state=1).fit(X_egt, y_egt)\ntek = np.mean([roc_auc_score(y_tst, a.predict_proba(X_tst)[:, 1]) for a in orman.estimators_[:30]])\nprint(f"Tek ağaç (ortalama): {tek:.3f}")\nprint(f"Bagging            : {roc_auc_score(y_tst, bag.predict_proba(X_tst)[:, 1]):.3f}")\nprint(f"Rassal orman       : {roc_auc_score(y_tst, orman.predict_proba(X_tst)[:, 1]):.3f}")`, en: W.en + `\nbag = RandomForestClassifier(n_estimators=200, min_samples_leaf=10, max_features=None, random_state=1).fit(X_tr, y_tr)\nforest = RandomForestClassifier(n_estimators=200, min_samples_leaf=10, max_features="sqrt", random_state=1).fit(X_tr, y_tr)\nsingle = np.mean([roc_auc_score(y_te, a.predict_proba(X_te)[:, 1]) for a in forest.estimators_[:30]])\nprint(f"Single tree (average): {single:.3f}")\nprint(f"Bagging              : {roc_auc_score(y_te, bag.predict_proba(X_te)[:, 1]):.3f}")\nprint(f"Random forest        : {roc_auc_score(y_te, forest.predict_proba(X_te)[:, 1]):.3f}")` },
        after: { tr: "Tek ağaç 0,70; bagging 0,79; rassal orman 0,80. Ormanın tek tek ağaçları zayıf, ama ortalamaları lojistik regresyonu (0,735) açıkça geçiyor ve tavana (0,818) yaklaşıyor.", en: "Single tree 0.70; bagging 0.79; random forest 0.80. The forest's individual trees are weak, but their average clearly beats logistic regression (0.735) and approaches the ceiling (0.818)." }
      },
      {
        id: "m5-u4-c2", kind: "run",
        task: { tr: "Ormanın ilk k ağacının ortalamasını alarak ağaç sayısı arttıkça test AUC'sinin nasıl değiştiğine bakıyoruz. Önce tahmin et.", en: "By averaging the forest's first k trees we see how the test AUC changes as the number of trees grows. Predict first." },
        predict: { q: { tr: "200 ağaçtan sonra daha çok ağaç eklersek ne olur?", en: "What happens if we add more trees beyond 200?" }, options: { tr: ["Aşırı uyum başlar, AUC düşer", "AUC neredeyse hiç değişmez", "AUC 1'e yaklaşır"], en: ["Overfitting starts and AUC falls", "AUC barely changes", "AUC approaches 1"] }, answer: 1, explain: { tr: "Her yeni ağaç ortalamaya giderek daha az katkı yapar; ortalama bir sınıra yaklaşır. Ağaç sayısı ormanda aşırı uyum düğmesi değildir.", en: "Each new tree adds less and less to the average; the average approaches a limit. The number of trees is not an overfitting knob in a forest." } },
        code: { tr: W.tr + `\norman = RandomForestClassifier(n_estimators=200, min_samples_leaf=10, max_features="sqrt", random_state=1).fit(X_egt, y_egt)\nagac_p = np.array([a.predict_proba(X_tst)[:, 1] for a in orman.estimators_])     # her ağacın olasılıkları\nfor k in [1, 2, 5, 10, 20, 50, 100, 200]:\n    print(f"ilk {k:3d} ağaç: test AUC {roc_auc_score(y_tst, agac_p[:k].mean(axis=0)):.3f}")`, en: W.en + `\nforest = RandomForestClassifier(n_estimators=200, min_samples_leaf=10, max_features="sqrt", random_state=1).fit(X_tr, y_tr)\ntree_p = np.array([a.predict_proba(X_te)[:, 1] for a in forest.estimators_])     # each tree's probabilities\nfor k in [1, 2, 5, 10, 20, 50, 100, 200]:\n    print(f"first {k:3d} trees: test AUC {roc_auc_score(y_te, tree_p[:k].mean(axis=0)):.3f}")` },
        after: { tr: "1 ağaçta 0,70; 5'te 0,77; 20'de 0,79; 100'den sonra 0,80 civarında sabit. Ağaç eklemek yalnızca hesap süresine mal olur; AUC'yi düşürmez.", en: "0.70 with 1 tree; 0.77 with 5; 0.79 with 20; flat around 0.80 after 100. Adding trees only costs computing time; it does not lower AUC." }
      },
      {
        id: "m5-u4-c3", kind: "audit",
        task: { tr: "YZ bir rassal orman kurduğunu söylüyor. Hatalı satırı bul ve düzelt: her soruda değişkenlerin yalnızca bir kısmı denensin (<code>max_features=\"sqrt\"</code>).", en: "The AI says it built a random forest. Find the faulty line and fix it: only some of the variables should be tried at each question (<code>max_features=\"sqrt\"</code>)." },
        ai: {
          prompt: { tr: "200 ağaçlık bir rassal orman kur ve test AUC'sini raporla.", en: "Build a random forest with 200 trees and report the test AUC." },
          reply: { tr: "Rassal ormanı kuralım:", en: "Let us build the random forest:" },
          code: U4A,
          claim: { tr: "Rassal orman, ağaçları çeşitlendirmek için her soruda değişkenlerin bir kısmını rastgele seçti; test AUC 0,79.", en: "The random forest picked a random subset of variables at each question to diversify the trees; test AUC is 0.79." }
        },
        bugLines: [ln(U4A.tr, "orman = RandomForestClassifier")],
        lineExplain: { tr: "<code>max_features=None</code>, her soruda bütün değişkenlerin denenmesi demektir: bu bagging'dir, rassal orman değil. YZ'nin “değişkenlerin bir kısmını rastgele seçti” iddiası koda uymuyor. Rassal orman için <code>max_features=\"sqrt\"</code> (6 değişkenden 2'si).", en: "<code>max_features=None</code> means every variable is tried at each question: that is bagging, not a random forest. The AI's claim “picked a random subset of variables” does not match the code. For a random forest use <code>max_features=\"sqrt\"</code> (2 of the 6 variables)." },
        hints: [{ tr: "Satırdaki <code>max_features=None</code>'ı <code>max_features=\"sqrt\"</code> yap.", en: "Change <code>max_features=None</code> in that line to <code>max_features=\"sqrt\"</code>." }],
        solution: { tr: U4A.tr.replace('max_features=None', 'max_features="sqrt"'), en: U4A.en.replace('max_features=None', 'max_features="sqrt"') },
        checks: [{ py: { tr: "orman.max_features == 'sqrt' and orman.n_estimators == 200", en: "forest.max_features == 'sqrt' and forest.n_estimators == 200" }, msg: { tr: "Orman 200 ağaçlı olmalı ve her soruda <code>max_features=\"sqrt\"</code> kullanmalı.", en: "The forest should have 200 trees and use <code>max_features=\"sqrt\"</code> at each question." } }],
        after: { tr: "AUC 0,79'dan 0,80'e çıktı. Fark küçük, ama asıl ders şu: YZ'nin yöntem hakkındaki iddiasını kodun parametreleriyle karşılaştır. Ad “RandomForestClassifier” olsa da parametreler başka bir yöntemi tanımlayabilir.", en: "AUC rose from 0.79 to 0.80. The gap is small, but the real lesson is this: compare the AI's claim about the method with the code's parameters. The name may be “RandomForestClassifier” while the parameters describe another method." }
      },
      {
        id: "m5-u4-c4", kind: "interpret",
        task: { tr: "YZ rassal ormanı yorumladı. Hangi cümleler yanlış?", en: "The AI interpreted the random forest. Which sentences are wrong?" },
        prompt: { tr: "Rassal orman AUC 0,80, lojistik regresyon 0,735. Yorumlar mısın?", en: "Random forest AUC is 0.80, logistic regression 0.735. Can you interpret this?" },
        sentences: {
          tr: ["Orman, lojistik regresyonun kaçırdığı eşik, etkileşim ve U biçimi gibi doğrusal olmayan ilişkileri yakalıyor.", "Ormanda ağaç sayısını artırmak aşırı uyuma yol açar; bu yüzden az ağaç kullanmalıyız.", "200 ağacın ortalamasını tek bir soru dizisi olarak okumak mümkün değil; yorum için başka araçlar gerekir.", "Orman lojistik regresyondan iyi olduğuna göre katsayılarını raporlayabiliriz."],
          en: ["The forest captures nonlinear relationships such as the threshold, interaction and U shape that logistic regression misses.", "Increasing the number of trees in a forest causes overfitting, so we should use few trees.", "The average of 200 trees cannot be read as a single sequence of questions; interpretation needs other tools.", "Since the forest beats logistic regression, we can report its coefficients."]
        },
        bad: [1, 3],
        explain: {
          tr: ["Doğru.", "<b>Yanlış:</b> ağaç eklemek AUC'yi düşürmez, yalnızca bir sınıra yaklaştırır.", "Doğru: bu yüzden Ünite 6–7'de SHAP'i göreceğiz.", "<b>Yanlış:</b> ormanın katsayısı yoktur. Değişkenlerin rolünü anlamak için açıklama yöntemleri gerekir."],
          en: ["Correct.", "<b>Wrong:</b> adding trees does not lower AUC; it only brings it closer to a limit.", "Correct: that is why we will see SHAP in Units 6–7.", "<b>Wrong:</b> a forest has no coefficients. Understanding the variables' roles needs explanation methods."]
        }
      }
    ],
    quiz: [
      { q: { tr: "Bagging ile rassal orman arasındaki fark nedir?", en: "What is the difference between bagging and a random forest?" }, options: { tr: ["Orman her soruda değişkenlerin yalnızca bir kısmını dener", "Orman bootstrap kullanmaz", "Bagging tek ağaçtır"], en: ["The forest tries only some of the variables at each question", "The forest does not use bootstrap", "Bagging is a single tree"] }, answer: 0, explain: { tr: "Bu, ağaçları çeşitlendirir.", en: "This diversifies the trees." } },
      { q: { tr: "Ormanın ağaç sayısını artırmak neye mal olur?", en: "What does increasing the forest's number of trees cost?" }, options: { tr: ["Yalnızca hesap süresine", "Aşırı uyuma", "AUC kaybına"], en: ["Only computing time", "Overfitting", "Loss of AUC"] }, answer: 0, explain: { tr: "AUC bir sınıra yaklaşır.", en: "AUC approaches a limit." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 5 — Boosting                                                      */
  /* =================================================================== */
  const U5A = { tr: W.tr + `\ngb = GradientBoostingClassifier(n_estimators=600, learning_rate=0.5, max_depth=3, subsample=0.8, random_state=1).fit(X_egt, y_egt)\nprint("Boosting test AUC:", round(roc_auc_score(y_tst, gb.predict_proba(X_tst)[:, 1]), 3))`, en: W.en + `\ngb = GradientBoostingClassifier(n_estimators=600, learning_rate=0.5, max_depth=3, subsample=0.8, random_state=1).fit(X_tr, y_tr)\nprint("Boosting test AUC:", round(roc_auc_score(y_te, gb.predict_proba(X_te)[:, 1]), 3))` };
  U.push({
    id: "m5-u5", minutes: 30, packages: PK,
    title: { tr: "Boosting: öğrenme oranı ve ağaç sayısı", en: "Boosting: learning rate and number of trees" },
    blurb: { tr: "Ormanın tersine: küçük ağaçlar art arda eklenir, her biri öncekilerin hatasını biraz düzeltir. Ağaç sayısı bu kez aşırı uyum düğmesidir.", en: "The opposite of a forest: small trees are added one after another, each correcting a little of the previous ones' error. This time the number of trees is an overfitting knob." },
    terms: [{ tr: "boosting", en: "boosting" }, { tr: "öğrenme oranı", en: "learning rate" }, { tr: "ağaç sayısı", en: "number of trees" }],
    concept: C0,
    playground: { type: "boostSteps", intro: { tr: "Tek bir değişkenle (yaş) boosting'i adım adım izle: her yeni küçük ağaç, kalan hatayı biraz düzeltir. Öğrenme oranını değiştir.", en: "Follow boosting step by step with a single variable (age): each new small tree corrects a little of the remaining error. Change the learning rate." }, takeaway: { tr: "Küçük öğrenme oranı yavaş ama temkinli öğrenir; büyük öğrenme oranı hızla öğrenip gürültüyü de öğrenmeye başlar.", en: "A small learning rate learns slowly but carefully; a large one learns fast and starts learning the noise too." } },
    cells: [
      {
        id: "m5-u5-c1", kind: "run",
        task: { tr: "İki öğrenme oranıyla (0,05 ve 0,5) 300'er küçük ağaç (derinlik 3) ekliyoruz ve her ağaç eklendikten sonra test AUC'sini ölçüyoruz. Bu modülün en uzun hücresi, birkaç saniye sürebilir. Önce tahmin et.", en: "With two learning rates (0.05 and 0.5) we add 300 small trees (depth 3) each and measure the test AUC after every tree. This is the module's longest cell; it may take a few seconds. Predict first." },
        predict: { q: { tr: "Öğrenme oranı 0,5'te ağaç sayısı arttıkça test AUC'si ne olur?", en: "At learning rate 0.5, what happens to test AUC as trees are added?" }, options: { tr: ["Sürekli artar", "Birkaç ağaçta tepe yapıp düşer", "Hiç değişmez"], en: ["It keeps rising", "It peaks after a few trees and then falls", "It does not change"] }, answer: 1, explain: { tr: "Her ağaç kalan hatayı düzeltir; sinyal bitince düzeltecek yalnızca gürültü kalır. Büyük adımlarla bu nokta çok çabuk gelir.", en: "Each tree corrects the remaining error; once the signal is used up only noise is left to correct. With big steps this point comes very quickly." } },
        code: { tr: W.tr + `\nfor oran in [0.05, 0.5]:\n    m = GradientBoostingClassifier(n_estimators=300, learning_rate=oran, max_depth=3, subsample=0.8, random_state=1).fit(X_egt, y_egt)\n    egri = [roc_auc_score(y_tst, p[:, 1]) for p in m.staged_predict_proba(X_tst)]   # her ağaçtan sonra test AUC\n    en_iyi = int(np.argmax(egri)) + 1\n    print(f"öğrenme oranı {oran}: 1 ağaç {egri[0]:.3f} | 10 ağaç {egri[9]:.3f} | 100 ağaç {egri[99]:.3f} | 300 ağaç {egri[-1]:.3f} | en iyi {max(egri):.3f} ({en_iyi}. ağaçta)")`, en: W.en + `\nfor rate in [0.05, 0.5]:\n    m = GradientBoostingClassifier(n_estimators=300, learning_rate=rate, max_depth=3, subsample=0.8, random_state=1).fit(X_tr, y_tr)\n    curve = [roc_auc_score(y_te, p[:, 1]) for p in m.staged_predict_proba(X_te)]   # test AUC after each tree\n    best = int(np.argmax(curve)) + 1\n    print(f"learning rate {rate}: 1 tree {curve[0]:.3f} | 10 trees {curve[9]:.3f} | 100 trees {curve[99]:.3f} | 300 trees {curve[-1]:.3f} | best {max(curve):.3f} (at tree {best})")` },
        after: { tr: "Oran 0,05: 93. ağaçta 0,807'lik tepe, 300 ağaçta 0,801. Oran 0,5: 8. ağaçta 0,792'lik tepe, 300 ağaçta 0,736'ya düşüş. Ormanın tersine, boosting'de ağaç sayısı aşırı uyumu belirler ve öğrenme oranıyla birlikte seçilmelidir.", en: "Rate 0.05: a peak of 0.807 at tree 93, 0.801 at 300 trees. Rate 0.5: a peak of 0.792 at tree 8, falling to 0.736 at 300 trees. Unlike a forest, in boosting the number of trees determines overfitting and must be chosen together with the learning rate." }
      },
      {
        id: "m5-u5-c2", kind: "audit",
        task: { tr: "YZ “en güçlü” boosting modelini kurdu ve boosting'in işe yaramadığı sonucuna vardı. Hatalı satırı bul ve düzelt: 6. haftadaki gibi öğrenme oranı 0,05 ve 100 ağaç kullan (bu ağaç sayısı eğitim verisinde çapraz doğrulamayla seçilmişti).", en: "The AI built the “strongest” boosting model and concluded that boosting does not work. Find the faulty line and fix it: as in week 6, use a learning rate of 0.05 and 100 trees (this number of trees was chosen by cross-validation on the training data)." },
        ai: {
          prompt: { tr: "Mümkün olan en güçlü boosting modelini kur ve lojistik regresyonla (0,735) karşılaştır.", en: "Build the strongest possible boosting model and compare it with logistic regression (0.735)." },
          reply: { tr: "En güçlü model için çok sayıda ağaç ve hızlı öğrenme seçelim:", en: "For the strongest model let us choose many trees and fast learning:" },
          code: U5A,
          claim: { tr: "600 ağaçla bile test AUC 0,735: boosting bu veride lojistik regresyondan iyi değil.", en: "Even with 600 trees the test AUC is 0.735: on these data boosting is no better than logistic regression." }
        },
        bugLines: [ln(U5A.tr, "gb = GradientBoostingClassifier")],
        lineExplain: { tr: "“Daha çok ağaç = daha güçlü” varsayımı boosting'de yanlıştır. Yüksek öğrenme oranı ve 600 ağaçla model 8. ağaçtan sonra gürültüyü öğrenmeye başlamış. Öğrenme oranı küçük (0,05) ve ağaç sayısı çapraz doğrulamayla seçilmiş (100) olmalı.", en: "The assumption “more trees = stronger” is wrong for boosting. With a high learning rate and 600 trees the model starts learning noise after the 8th tree. The learning rate should be small (0.05) and the number of trees chosen by cross-validation (100)." },
        hints: [{ tr: "<code>GradientBoostingClassifier(n_estimators=100, learning_rate=0.05, max_depth=3, subsample=0.8, random_state=1)</code>", en: "<code>GradientBoostingClassifier(n_estimators=100, learning_rate=0.05, max_depth=3, subsample=0.8, random_state=1)</code>" }],
        solution: { tr: U5A.tr.replace("n_estimators=600, learning_rate=0.5", "n_estimators=100, learning_rate=0.05"), en: U5A.en.replace("n_estimators=600, learning_rate=0.5", "n_estimators=100, learning_rate=0.05") },
        checks: [{ py: "gb.learning_rate == 0.05 and gb.n_estimators == 100", msg: { tr: "Öğrenme oranı 0,05 ve ağaç sayısı 100 olmalı.", en: "The learning rate should be 0.05 and the number of trees 100." } }],
        after: { tr: "Test AUC 0,807: lojistik regresyondan (0,735) açıkça, rassal ormandan (0,80) biraz iyi. YZ'nin “boosting işe yaramıyor” sonucu, ayarı yanlış bir modelden çıkmıştı. Bir yöntemi yargılamadan önce hiperparametrelerinin nasıl seçildiğine bak.", en: "Test AUC is 0.807: clearly better than logistic regression (0.735) and slightly better than the random forest (0.80). The AI's “boosting does not work” came from a badly tuned model. Before judging a method, check how its hyperparameters were chosen." }
      },
      {
        id: "m5-u5-c3", kind: "interpret",
        task: { tr: "YZ orman ile boosting'i karşılaştırdı. Hangi cümleler yanlış?", en: "The AI compared the forest and boosting. Which sentences are wrong?" },
        prompt: { tr: "Rassal orman ile boosting arasındaki farkı anlatır mısın?", en: "Can you explain the difference between a random forest and boosting?" },
        sentences: {
          tr: ["Ormandaki ağaçlar birbirinden bağımsız kurulur ve ortalaması alınır; boosting'deki ağaçlar sırayla, öncekilerin hatasını düzeltmek için kurulur.", "Ormanda ağaç sayısı aşırı uyuma yol açmaz; boosting'de açar.", "Boosting her zaman ormandan iyidir.", "Öğrenme oranı küçüldükçe gereken ağaç sayısı artar."],
          en: ["The trees in a forest are built independently and averaged; the trees in boosting are built in sequence, to correct the previous ones' error.", "In a forest the number of trees does not cause overfitting; in boosting it does.", "Boosting is always better than a forest.", "As the learning rate shrinks, the number of trees needed grows."]
        },
        bad: [2],
        explain: {
          tr: ["Doğru.", "Doğru.", "<b>Yanlış:</b> burada fark küçük (0,807'ye karşı 0,800) ve iyi ayarlanmış bir boosting gerektiriyor. Veriye göre sonuç değişir; karşılaştırma her zaman aynı test verisiyle yapılmalı.", "Doğru: her ağaç daha küçük bir adım atar."],
          en: ["Correct.", "Correct.", "<b>Wrong:</b> here the gap is small (0.807 against 0.800) and needs well-tuned boosting. The result depends on the data; the comparison must always use the same test data.", "Correct: each tree takes a smaller step."]
        }
      }
    ],
    quiz: [
      { q: { tr: "Boosting'de her yeni ağaç neyi öğrenir?", en: "What does each new tree learn in boosting?" }, options: { tr: ["Önceki ağaçların bıraktığı hatayı", "Verinin rastgele bir parçasını, diğerlerinden bağımsız", "Test verisini"], en: ["The error left by the previous trees", "A random part of the data, independently of the others", "The test data"] }, answer: 0, explain: { tr: "Ağaçlar sırayla eklenir.", en: "Trees are added in sequence." } },
      { q: { tr: "Boosting'de ağaç sayısı nasıl seçilir?", en: "How is the number of trees chosen in boosting?" }, options: { tr: ["Eğitim verisinde çapraz doğrulamayla, öğrenme oranıyla birlikte", "Mümkün olduğunca çok", "Test verisinde en iyi olan"], en: ["By cross-validation on the training data, together with the learning rate", "As many as possible", "The one that does best on the test data"] }, answer: 0, explain: { tr: "Fazla ağaç gürültüyü öğrenir.", en: "Too many trees learn the noise." } },
      { q: { tr: "Öğrenme oranı 0,5 iken test AUC'si neden 8. ağaçtan sonra düştü?", en: "Why did the test AUC fall after the 8th tree at learning rate 0.5?" }, options: { tr: ["Büyük adımlarla sinyal çabuk bitti, model gürültüyü öğrenmeye başladı", "Ağaçlar çok küçüktü", "Veri dengesizdi"], en: ["With big steps the signal ran out fast and the model started learning noise", "The trees were too small", "The data were imbalanced"] }, answer: 0, explain: { tr: "Aşırı uyum.", en: "Overfitting." } }
    ]
  });
})();
