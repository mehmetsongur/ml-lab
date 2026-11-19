/* Modül 4 — Sınıflandırma ve kredi riski · Üniteler 1–4
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 * "Örnek YZ yanıtları" öğretim amacıyla hazırlanmıştır.
 */
(function () {
  "use strict";
  const D = window.M4_DATA, U = window.M4_UNITS, ln = D.line;
  const W = D.CREDIT, WM = { tr: D.CREDIT.tr + D.MODEL.tr, en: D.CREDIT.en + D.MODEL.en };
  const PK = ["numpy", "scikit-learn"];
  const C0 = { tr: "", en: "" };

  /* =================================================================== */
  /* Ünite 1 — Neden EKK değil?                                            */
  /* =================================================================== */
  const U1A = { tr: W.tr + `\nmodel = LinearRegression().fit(X_egt, y_egt)\np = model.predict(X_tst)                     # temerrüt olasılıkları\nprint("En düşük olasılık:", round(p.min(), 4), "| en yüksek:", round(p.max(), 3))`, en: W.en + `\nmodel = LinearRegression().fit(X_tr, y_tr)\np = model.predict(X_te)                      # default probabilities\nprint("Lowest probability:", round(p.min(), 4), "| highest:", round(p.max(), 3))` };
  U.push({
    id: "m4-u1", minutes: 25, packages: PK,
    title: { tr: "Neden EKK değil? Olasılığı modellemek", en: "Why not OLS? Modelling a probability" },
    blurb: { tr: "Temerrüdü 0/1 kodlayıp EKK kurmak olasılığı 0–1 dışına taşırır. Lojistik regresyon doğrusal skoru S eğrisinden geçirir.", en: "Coding default as 0/1 and running OLS pushes probabilities outside 0–1. Logistic regression passes a linear score through an S curve." },
    terms: [{ tr: "sınıflandırma", en: "classification" }, { tr: "doğrusal olasılık modeli", en: "linear probability model" }, { tr: "lojistik regresyon", en: "logistic regression" }, { tr: "lojistik (S) fonksiyon", en: "logistic (S) function" }],
    concept: C0,
    playground: { type: "lpmVsLogit", intro: { tr: "Aynı veriye iki model: düz çizgi (EKK) ve S eğrisi (lojistik). Borç/gelir oranının etkisini değiştir ve 0–1 dışına taşan öngörülere bak.", en: "Two models on the same data: a straight line (OLS) and an S curve (logistic). Change the effect of the debt/income ratio and watch predictions spill outside 0–1." }, takeaway: { tr: "Bir olasılık 0 ile 1 arasında kalmalı. Lojistik fonksiyon bunu her durumda garanti eder.", en: "A probability must stay between 0 and 1. The logistic function guarantees this in every case." } },
    cells: [
      {
        id: "m4-u1-c1", kind: "run",
        task: { tr: "Temerrüdü 0/1 kodlayıp EKK kuruyoruz (doğrusal olasılık modeli) ve 20.000 yeni başvuru için “olasılık” öngörüyoruz. Önce tahmin et.", en: "We code default as 0/1 and run OLS (the linear probability model), predicting a “probability” for 20,000 new applications. Predict first." },
        predict: { q: { tr: "Başvuruların yüzde kaçına negatif bir olasılık verilir?", en: "What share of applications get a negative probability?" }, options: { tr: ["Hiçbirine", "Yaklaşık %16'sına", "Yarısına"], en: ["None", "About 16%", "Half"] }, answer: 1, explain: { tr: "Düz bir çizgi sınır tanımaz: riski çok düşük başvuranlar için çizgi sıfırın altına iner.", en: "A straight line knows no bounds: for very low-risk applicants it goes below zero." } },
        code: { tr: W.tr + `\nlpm = LinearRegression().fit(X_egt, y_egt)\np_lpm = lpm.predict(X_tst)\nprint(f"Temerrüt oranı: %{100 * y_egt.mean():.1f}")\nprint(f"Negatif olasılık: %{100 * (p_lpm < 0).mean():.1f}   1'den büyük: %{100 * (p_lpm > 1).mean():.1f}")`, en: W.en + `\nlpm = LinearRegression().fit(X_tr, y_tr)\np_lpm = lpm.predict(X_te)\nprint(f"Default rate: {100 * y_tr.mean():.1f}%")\nprint(f"Negative probability: {100 * (p_lpm < 0).mean():.1f}%   above 1: {100 * (p_lpm > 1).mean():.1f}%")` },
        after: { tr: "Başvuruların %16,5'ine negatif “olasılık” verildi. Bir bankaya “bu müşterinin temerrüt olasılığı −%8” demek anlamsızdır. Temerrüt oranı yalnızca %10,7 olduğu için çizgi 1'i hiç geçmiyor.", en: "16.5% of applications got a negative “probability”. Telling a bank “this customer's default probability is −8%” is meaningless. Because the default rate is only 10.7%, the line never goes above 1." }
      },
      {
        id: "m4-u1-c2", kind: "audit",
        task: { tr: "YZ'den temerrüt olasılıklarını öngörmesini istedik. Hatalı satırı bul ve düzelt: <code>p</code> her zaman 0 ile 1 arasında kalan olasılıklar olsun (lojistik regresyon, <code>C=1e6, max_iter=2000</code>).", en: "We asked the AI to predict default probabilities. Find the faulty line and fix it: <code>p</code> should be probabilities that always stay between 0 and 1 (logistic regression, <code>C=1e6, max_iter=2000</code>)." },
        ai: {
          prompt: { tr: "Altı özellikle her başvurunun temerrüt olasılığını öngören bir model kur.", en: "Build a model that predicts each application's default probability from six features." },
          reply: { tr: "Temerrüt 0/1 olduğuna göre bir regresyon yeter:", en: "Since default is 0/1, a regression is enough:" },
          code: U1A,
          claim: { tr: "En riskli müşterinin olasılığı %56, en güvenlisininki −%32: bu müşteri kesinlikle öder.", en: "The riskiest customer's probability is 56%, the safest's −32%: this customer will certainly pay." }
        },
        bugLines: [ln(U1A.tr, "LinearRegression().fit")],
        lineExplain: { tr: "<code>LinearRegression</code> 0/1 hedefe düz bir çizgi uydurur; öngörüleri olasılık değildir ve 0–1 dışına taşar. Olasılık için lojistik regresyon ve <code>predict_proba</code> gerekir.", en: "<code>LinearRegression</code> fits a straight line to a 0/1 target; its predictions are not probabilities and spill outside 0–1. A probability needs logistic regression and <code>predict_proba</code>." },
        hints: [{ tr: "<code>model = LogisticRegression(C=1e6, max_iter=2000).fit(X_egt, y_egt)</code> ve <code>p = model.predict_proba(X_tst)[:, 1]</code> (ikinci sütun: <code>model.classes_</code> = [0, 1] olduğu için temerrüt sınıfının olasılığı).", en: "<code>model = LogisticRegression(C=1e6, max_iter=2000).fit(X_tr, y_tr)</code> and <code>p = model.predict_proba(X_te)[:, 1]</code> (second column: because <code>model.classes_</code> = [0, 1], the probability of the default class)." }],
        solution: { tr: W.tr + `\nmodel = LogisticRegression(C=1e6, max_iter=2000).fit(X_egt, y_egt)\np = model.predict_proba(X_tst)[:, 1]         # temerrüt olasılıkları\nprint("En düşük olasılık:", round(p.min(), 4), "| en yüksek:", round(p.max(), 3))`, en: W.en + `\nmodel = LogisticRegression(C=1e6, max_iter=2000).fit(X_tr, y_tr)\np = model.predict_proba(X_te)[:, 1]          # default probabilities\nprint("Lowest probability:", round(p.min(), 4), "| highest:", round(p.max(), 3))` },
        checks: [{ py: { tr: "p.min() >= 0 and p.max() <= 1 and np.allclose(p, LogisticRegression(C=1e6, max_iter=2000).fit(X_egt, y_egt).predict_proba(X_tst)[:, 1])", en: "p.min() >= 0 and p.max() <= 1 and np.allclose(p, LogisticRegression(C=1e6, max_iter=2000).fit(X_tr, y_tr).predict_proba(X_te)[:, 1])" }, msg: { tr: "<code>p</code>, lojistik regresyonun temerrüt sınıfı için verdiği olasılıklar olmalı (<code>predict_proba(...)[:, 1]</code>).", en: "<code>p</code> should be the logistic regression's probabilities for the default class (<code>predict_proba(...)[:, 1]</code>)." } }],
        after: { tr: "Artık en düşük olasılık sıfıra yakın ama pozitif. YZ'nin “kesinlikle öder” iddiası, olasılık olmayan bir sayıdan çıkarılmış bir kesinlikti.", en: "Now the lowest probability is close to zero but positive. The AI's “will certainly pay” was certainty drawn from a number that was not a probability." }
      },
      {
        id: "m4-u1-c3", kind: "fill",
        task: { tr: "Lojistik fonksiyonu kendin yaz: doğrusal skor <code>z</code> ne olursa olsun sonuç 0 ile 1 arasında kalsın.", en: "Write the logistic function yourself: whatever the linear score <code>z</code>, the result must stay between 0 and 1." },
        code: { tr: `import numpy as np\nz = np.array([-10, -2, 0, 2, 10])\np = 1 / (1 + np.exp(___))\nprint(np.round(p, 4))`, en: `import numpy as np\nz = np.array([-10, -2, 0, 2, 10])\np = 1 / (1 + np.exp(___))\nprint(np.round(p, 4))` },
        solution: { tr: `import numpy as np\nz = np.array([-10, -2, 0, 2, 10])\np = 1 / (1 + np.exp(-z))\nprint(np.round(p, 4))`, en: `import numpy as np\nz = np.array([-10, -2, 0, 2, 10])\np = 1 / (1 + np.exp(-z))\nprint(np.round(p, 4))` },
        hints: [{ tr: "p = 1 / (1 + e<sup>−z</sup>): üstel fonksiyonun içinde <code>-z</code> var.", en: "p = 1 / (1 + e<sup>−z</sup>): inside the exponential is <code>-z</code>." }],
        checks: [{ py: "np.allclose(p, 1 / (1 + np.exp(-z)))", msg: { tr: "<code>p</code>, 1 / (1 + e<sup>−z</sup>) olmalı.", en: "<code>p</code> should be 1 / (1 + e<sup>−z</sup>)." } }],
        after: { tr: "z = 0'da olasılık 0,5; z büyüdükçe 1'e, küçüldükçe 0'a yaklaşıyor ama hiç ulaşmıyor. S eğrisinin ortası dik, uçları yatık: aynı skor artışı, olasılığı ortada çok, uçlarda az değiştirir.", en: "At z = 0 the probability is 0.5; as z grows it approaches 1, as z falls it approaches 0, never reaching either. The S curve is steep in the middle and flat at the ends: the same rise in score changes the probability a lot in the middle and little at the ends." }
      },
      {
        id: "m4-u1-c4", kind: "interpret",
        task: { tr: "YZ iki modeli karşılaştırdı. Hangi cümleler yanlış?", en: "The AI compared the two models. Which sentences are wrong?" },
        prompt: { tr: "Doğrusal olasılık modeli başvuruların %16,5'ine negatif olasılık verdi; lojistik regresyon hiçbirine. Yorumlar mısın?", en: "The linear probability model gave 16.5% of applications a negative probability; logistic regression gave none. Can you interpret this?" },
        sentences: {
          tr: ["Negatif bir olasılık anlamsızdır; doğrusal olasılık modeli bu yüzden kredi kararı için uygun değil.", "Lojistik regresyon, doğrusal bir skoru S eğrisinden geçirerek olasılığı 0–1 aralığında tutar.", "Lojistik regresyonun olasılıkları 0 ve 1'e ulaşabildiği için kesin kararlar verir.", "İki model aynı veriyi kullandığına göre öngörüleri aynı olmalıdır."],
          en: ["A negative probability is meaningless; that is why the linear probability model is unsuitable for credit decisions.", "Logistic regression keeps the probability within 0–1 by passing a linear score through an S curve.", "Because logistic probabilities can reach 0 and 1, it gives certain decisions.", "Since the two models use the same data, their predictions should be the same."]
        },
        bad: [2, 3],
        explain: {
          tr: ["Doğru.", "Doğru.", "<b>Yanlış:</b> lojistik fonksiyon 0 ve 1'e yaklaşır ama ulaşmaz. Her olasılık bir belirsizlik taşır; karar ise ayrı bir adımdır (Ünite 3).", "<b>Yanlış:</b> aynı veri, farklı fonksiyon biçimi: öngörüler özellikle uçlarda belirgin biçimde farklıdır."],
          en: ["Correct.", "Correct.", "<b>Wrong:</b> the logistic function approaches 0 and 1 but never reaches them. Every probability carries uncertainty; the decision is a separate step (Unit 3).", "<b>Wrong:</b> same data, different functional form: predictions differ clearly, especially at the extremes."]
        }
      }
    ],
    quiz: [
      { q: { tr: "Doğrusal olasılık modelinin temel sorunu nedir?", en: "What is the main problem of the linear probability model?" }, options: { tr: ["Öngörüleri 0–1 dışına taşabilir", "Katsayıları kestirilemez", "Yalnızca iki değişkenle çalışır"], en: ["Its predictions can go outside 0–1", "Its coefficients cannot be estimated", "It works with only two variables"] }, answer: 0, explain: { tr: "Düz çizgi sınır tanımaz.", en: "A straight line knows no bounds." } },
      { q: { tr: "Lojistik fonksiyon z = 0'da hangi olasılığı verir?", en: "What probability does the logistic function give at z = 0?" }, options: { tr: ["0", "0,5", "1"], en: ["0", "0.5", "1"] }, answer: 1, explain: { tr: "1 / (1 + e⁰) = 1/2.", en: "1 / (1 + e⁰) = 1/2." } },
      { q: { tr: "<code>predict_proba(X)[:, 1]</code> neyi verir?", en: "What does <code>predict_proba(X)[:, 1]</code> give?" }, options: { tr: ["Her gözlemin 1 sınıfına (temerrüt) ait olma olasılığını", "Tahmin edilen sınıfı (0/1)", "Katsayıları"], en: ["Each observation's probability of belonging to class 1 (default)", "The predicted class (0/1)", "The coefficients"] }, answer: 0, explain: { tr: "Sütunların sırası <code>model.classes_</code>'a göredir. Etiketler 0/1 olduğu için ilk sütun 0'ın, ikinci sütun 1'in (temerrüt) olasılığı. Başka etiketlerle (ör. \"öder\"/\"temerrüt\") çalışan yeniden kullanılabilir kodda sütunu ezberleme: <code>list(model.classes_).index(\"temerrüt\")</code> ile bul.", en: "The column order follows <code>model.classes_</code>. Because the labels are 0/1, the first column is class 0's probability and the second class 1's (default). In reusable code with other labels (e.g. \"pays\"/\"default\") don't memorise the column: find it with <code>list(model.classes_).index(\"default\")</code>." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 2 — Lojistik regresyonu okumak                                   */
  /* =================================================================== */
  const U2A = { tr: W.tr + `\nlogit = LogisticRegression(C=1e6, max_iter=2000).fit(X_egt, y_egt)\nodds_orani = logit.coef_[0]\nfor ad, o in zip(adlar, odds_orani):\n    print(f"{ad:22s} odds oranı {o:5.2f}")`, en: W.en + `\nlogit = LogisticRegression(C=1e6, max_iter=2000).fit(X_tr, y_tr)\nodds_ratio = logit.coef_[0]\nfor name, o in zip(names, odds_ratio):\n    print(f"{name:22s} odds ratio {o:5.2f}")` };
  U.push({
    id: "m4-u2", minutes: 25, packages: PK,
    title: { tr: "Lojistik regresyonu okumak: log-odds ve odds oranı", en: "Reading logistic regression: log-odds and odds ratios" },
    blurb: { tr: "Katsayılar log-odds cinsindendir; üsteli odds oranıdır. Odds oranı olasılık oranı değildir ve öngörü modelinin katsayısı nedensel etki değildir.", en: "Coefficients are in log-odds; their exponential is the odds ratio. An odds ratio is not a probability ratio, and a prediction model's coefficient is not a causal effect." },
    terms: [{ tr: "odds", en: "odds" }, { tr: "log-odds", en: "log-odds" }, { tr: "odds oranı", en: "odds ratio" }],
    concept: C0,
    playground: { type: "logitCurve", intro: { tr: "Sabiti ve katsayıyı değiştir; S eğrisinin nasıl kaydığına ve dikleştiğine bak. Aynı odds oranının farklı başlangıç olasılıklarında olasılığı ne kadar değiştirdiğini karşılaştır.", en: "Change the constant and the coefficient; watch the S curve shift and steepen. Compare how much the same odds ratio changes the probability at different starting probabilities." }, takeaway: { tr: "Odds oranı sabittir; olasılıktaki değişim ise başlangıç noktasına bağlıdır.", en: "The odds ratio is constant; the change in probability depends on the starting point." } },
    cells: [
      {
        id: "m4-u2-c1", kind: "run",
        task: { tr: "Lojistik regresyonun katsayılarını ve odds oranlarını gerçek katsayılarla karşılaştırıyoruz. Önce tahmin et.", en: "We compare the logistic regression's coefficients and odds ratios with the true coefficients. Predict first." },
        predict: { q: { tr: "Gerçek etkisi sıfır olan Yaş'ın odds oranı kaç çıkar?", en: "What odds ratio does Age, whose true effect is zero, get?" }, options: { tr: ["Tam 1,00", "1'e yakın ama tam 1 değil", "2'nin üzerinde"], en: ["Exactly 1.00", "Close to 1 but not exactly", "Above 2"] }, answer: 1, explain: { tr: "Sıfır etki, odds oranı 1 demektir. Ama 3.000 başvuruluk örneklemde kestirim gürültülüdür; üstelik Yaş, Çalışma süresiyle ilişkili.", en: "Zero effect means an odds ratio of 1. But in a sample of 3,000 applications the estimate is noisy; Age is also related to Years employed." } },
        code: { tr: W.tr + `\nlogit = LogisticRegression(C=1e6, max_iter=2000).fit(X_egt, y_egt)\nfor ad, b, g in zip(adlar, logit.coef_[0], BETA):\n    print(f"{ad:22s} katsayı {b:6.3f}   odds oranı {np.exp(b):5.2f}   (gerçek katsayı {g:4.1f})")`, en: W.en + `\nlogit = LogisticRegression(C=1e6, max_iter=2000).fit(X_tr, y_tr)\nfor name, b, g in zip(names, logit.coef_[0], BETA):\n    print(f"{name:22s} coefficient {b:6.3f}   odds ratio {np.exp(b):5.2f}   (true coefficient {g:4.1f})")` },
        after: { tr: "Borç/gelir 2,23, önceki gecikme 2,59, gelir 0,55. Her odds oranı, diğer özellikler sabitken okunur (kısmi etki). Yaş 1,06: gerçek etkisi sıfır olduğu hâlde 1'den biraz büyük. Bu, 3.000 gözlemlik bir örneklemin gürültüsü; Yaş'ın Çalışma süresiyle ilişkili olması da iki katsayıyı birbirinden ayırmayı zorlaştırıp kestirimin belirsizliğini artırır. Başka bir tohumla çekilen örneklemde 1'in altında da çıkabilirdi. Öngörü modelinin katsayıları nedensel etki değildir (Modül 1).", en: "Debt/income 2.23, past delinquency 2.59, income 0.55. Each odds ratio is read holding the other features fixed (a partial effect). Age 1.06: slightly above 1 although its true effect is zero. This is noise in a 3,000-observation sample; Age being related to Years employed also makes the two coefficients harder to separate and raises the estimate's uncertainty. In a sample drawn with another seed it could come out below 1. A prediction model's coefficients are not causal effects (Module 1)." }
      },
      {
        id: "m4-u2-c2", kind: "audit",
        task: { tr: "YZ odds oranlarını raporladı. Hatalı satırı bul ve düzelt: <code>odds_orani</code>, katsayıların üstel değeri olsun.", en: "The AI reported odds ratios. Find the faulty line and fix it: <code>odds_ratio</code> should be the exponential of the coefficients." },
        ai: {
          prompt: { tr: "Lojistik regresyonu kur ve her değişkenin odds oranını ver.", en: "Build the logistic regression and give each variable's odds ratio." },
          reply: { tr: "Odds oranları şöyle:", en: "Here are the odds ratios:" },
          code: U2A,
          claim: { tr: "Gelirin odds oranı −0,59: gelir arttıkça odds eksiye düşüyor.", en: "Income's odds ratio is −0.59: as income rises the odds become negative." }
        },
        bugLines: [ln(U2A.tr, "= logit.coef_[0]")],
        lineExplain: { tr: "Katsayılar log-odds cinsindendir. Odds oranı katsayının üstel değeridir: e<sup>b</sup>. Negatif bir odds oranı olamaz; odds oranı her zaman pozitiftir, 1'in altı riski azaltan değişkeni gösterir.", en: "Coefficients are in log-odds. The odds ratio is the coefficient's exponential: e<sup>b</sup>. A negative odds ratio is impossible; odds ratios are always positive, and below 1 marks a variable that lowers risk." },
        hints: [{ tr: "<code>odds_orani = np.exp(logit.coef_[0])</code>", en: "<code>odds_ratio = np.exp(logit.coef_[0])</code>" }],
        solution: { tr: U2A.tr.replace("odds_orani = logit.coef_[0]", "odds_orani = np.exp(logit.coef_[0])"), en: U2A.en.replace("odds_ratio = logit.coef_[0]", "odds_ratio = np.exp(logit.coef_[0])") },
        checks: [{ py: { tr: "np.allclose(odds_orani, np.exp(logit.coef_[0]))", en: "np.allclose(odds_ratio, np.exp(logit.coef_[0]))" }, msg: { tr: "<code>odds_orani</code>, katsayıların üstel değeri olmalı.", en: "<code>odds_ratio</code> should be the exponential of the coefficients." } }],
        after: { tr: "Gelirin odds oranı 0,55: gelir bir standart sapma artınca temerrüt odds'u yaklaşık yarıya iniyor. Katsayı (−0,59) log-odds, odds oranı (0,55) ise çarpandır.", en: "Income's odds ratio is 0.55: a one-standard-deviation rise in income roughly halves the odds of default. The coefficient (−0.59) is in log-odds; the odds ratio (0.55) is a multiplier." }
      },
      {
        id: "m4-u2-c3", kind: "run",
        task: { tr: "Borç/gelir oranının odds oranı 2,23. Bu, temerrüt olasılığını hep aynı miktarda mı artırır? İki farklı başlangıç olasılığında deniyoruz. Önce tahmin et.", en: "The debt/income ratio's odds ratio is 2.23. Does it always raise the default probability by the same amount? We try two different starting probabilities. Predict first." },
        predict: { q: { tr: "Başlangıç olasılığı %5 ve %50 olan iki kişide, aynı odds oranı olasılığı nasıl değiştirir?", en: "For two people with starting probabilities of 5% and 50%, how does the same odds ratio change the probability?" }, options: { tr: ["İkisinde de aynı miktarda (puan)", "%50'dekinde çok daha fazla puan", "%5'tekinde çok daha fazla puan"], en: ["By the same amount (points) in both", "By many more points at 50%", "By many more points at 5%"] }, answer: 1, explain: { tr: "Odds çarpılır, olasılık değil. S eğrisinin ortası dik olduğu için aynı çarpan ortada olasılığı çok, uçlarda az değiştirir.", en: "The odds are multiplied, not the probability. Because the S curve is steep in the middle, the same multiplier changes the probability a lot in the middle and little at the ends." } },
        code: { tr: `import numpy as np\nodds_orani = 2.23\nfor p0 in [0.05, 0.50]:\n    odds0 = p0 / (1 - p0)\n    odds1 = odds0 * odds_orani\n    p1 = odds1 / (1 + odds1)\n    print(f"başlangıç %{100*p0:.0f} → %{100*p1:.1f}   (artış {100*(p1-p0):.1f} puan, oran {p1/p0:.2f} kat)")`, en: `import numpy as np\nodds_ratio = 2.23\nfor p0 in [0.05, 0.50]:\n    odds0 = p0 / (1 - p0)\n    odds1 = odds0 * odds_ratio\n    p1 = odds1 / (1 + odds1)\n    print(f"start {100*p0:.0f}% → {100*p1:.1f}%   (rise {100*(p1-p0):.1f} points, ratio {p1/p0:.2f}x)")` },
        after: { tr: "%5 → %10,5 (5,5 puan, 2,1 kat); %50 → %69,0 (19 puan, 1,38 kat). Odds oranı aynı, olasılıktaki değişim farklı. “Odds oranı 2,23 = olasılık 2,23 kat” demek yanlıştır.", en: "5% → 10.5% (5.5 points, 2.1x); 50% → 69.0% (19 points, 1.38x). Same odds ratio, different change in probability. Saying “odds ratio 2.23 = probability 2.23 times” is wrong." }
      },
      {
        id: "m4-u2-c4", kind: "interpret",
        task: { tr: "YZ odds oranlarını yorumladı. Hangi cümleler yanlış?", en: "The AI interpreted the odds ratios. Which sentences are wrong?" },
        prompt: { tr: "Önceki gecikmenin odds oranı 2,59, Yaş'ın 1,06. Yorumlar mısın?", en: "Past delinquency's odds ratio is 2.59, Age's 1.06. Can you interpret this?" },
        sentences: {
          tr: ["Daha önce gecikme yaşamış bir başvuranın temerrüt odds'u, diğer özellikler sabitken yaklaşık 2,6 katı.", "Önceki gecikmesi olanların temerrüt olasılığı 2,59 kat daha yüksek.", "Yaş arttıkça temerrüt riski artıyor; bankalar yaşlı başvuranlara daha temkinli yaklaşmalı.", "Odds oranının 1'den büyük olması, değişkenin temerrüt odds'unu artırdığını gösterir."],
          en: ["An applicant with a past delinquency has about 2.6 times the odds of default, other features held fixed.", "Those with a past delinquency have a 2.59 times higher probability of default.", "Risk rises with age; banks should be more cautious with older applicants.", "An odds ratio above 1 shows that the variable raises the odds of default."]
        },
        bad: [1, 2],
        explain: {
          tr: ["Doğru.", "<b>Yanlış:</b> odds oranı olasılık oranı değildir. Olasılıktaki değişim başlangıç noktasına bağlıdır.", "<b>Yanlış:</b> bu dünyada yaşın gerçek etkisi sıfır. 1,06, diğer özellikler sabitken okunan bir kısmi odds oranı ve sonlu örneklemin gürültüsünü taşıyor; Çalışma süresiyle korelasyon bu belirsizliği artırıyor. Üstelik yaşa göre ayrım yasal ve etik sorunlar doğurur.", "Doğru."],
          en: ["Correct.", "<b>Wrong:</b> an odds ratio is not a probability ratio. The change in probability depends on the starting point.", "<b>Wrong:</b> in this world age has zero true effect. 1.06 is a partial odds ratio read with the other features fixed, and it carries the noise of a finite sample; the correlation with years employed increases that uncertainty. Moreover, discriminating by age raises legal and ethical issues.", "Correct."]
        }
      }
    ],
    quiz: [
      { q: { tr: "Odds nedir?", en: "What are the odds?" }, options: { tr: ["p / (1 − p)", "p × (1 − p)", "1 − p"], en: ["p / (1 − p)", "p × (1 − p)", "1 − p"] }, answer: 0, explain: { tr: "p = 0,2 ise odds = 0,2 / 0,8 = 0,25: 1 temerrüde karşı 4 ödeme (temerrüt : ödeme = 1 : 4).", en: "If p = 0.2 the odds are 0.2 / 0.8 = 0.25: 1 default against 4 payments (default : payment = 1 : 4)." } },
      { q: { tr: "Lojistik regresyon katsayısı b ise odds oranı nedir?", en: "If a logistic coefficient is b, what is the odds ratio?" }, options: { tr: ["e<sup>b</sup>", "b²", "1/b"], en: ["e<sup>b</sup>", "b²", "1/b"] }, answer: 0, explain: { tr: "Katsayılar log-odds cinsindendir.", en: "Coefficients are in log-odds." } },
      { q: { tr: "Odds oranı 0,55 ne anlama gelir?", en: "What does an odds ratio of 0.55 mean?" }, options: { tr: ["Değişken bir birim artınca odds yaklaşık yarıya iner", "Olasılık %55 düşer", "Değişkenin etkisi yoktur"], en: ["A one-unit rise roughly halves the odds", "The probability falls by 55%", "The variable has no effect"] }, answer: 0, explain: { tr: "1'in altındaki odds oranı riski azaltır.", en: "An odds ratio below 1 lowers risk." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 3 — Eşik ve karışıklık matrisi                                   */
  /* =================================================================== */
  const U3A = { tr: WM.tr + `\nkarar = (p_hat >= 0.2).astype(int)\ndp = int(np.sum((karar == 1) & (y_tst == 1)))\nyp = int(np.sum((karar == 1) & (y_tst == 0)))\nyn = int(np.sum((karar == 0) & (y_tst == 1)))\nduyarlilik = dp / (dp + yp)\nprint(f"Model temerrüde düşenlerin %{100 * duyarlilik:.0f}'ini yakalıyor")`, en: WM.en + `\ndecision = (p_hat >= 0.2).astype(int)\ntp = int(np.sum((decision == 1) & (y_te == 1)))\nfp = int(np.sum((decision == 1) & (y_te == 0)))\nfn = int(np.sum((decision == 0) & (y_te == 1)))\nrecall = tp / (tp + fp)\nprint(f"The model catches {100 * recall:.0f}% of defaulters")` };
  U.push({
    id: "m4-u3", minutes: 30, packages: PK,
    title: { tr: "Olasılıktan karara: eşik ve karışıklık matrisi", en: "From probability to decision: threshold and confusion matrix" },
    blurb: { tr: "Bir olasılık kendi başına karar değildir; eşik gerekir. Dört sonuç, doğruluk ve “herkes öder” kuralının tuzağı.", en: "A probability is not a decision by itself; it needs a threshold. Four outcomes, accuracy, and the trap of the “everyone pays” rule." },
    terms: [{ tr: "eşik", en: "threshold" }, { tr: "karışıklık matrisi", en: "confusion matrix" }, { tr: "doğru/yanlış pozitif", en: "true/false positive" }, { tr: "doğruluk", en: "accuracy" }],
    concept: C0,
    playground: { type: "thresholdMatrix", intro: { tr: "Eşiği kaydır. İki grubun olasılık dağılımına, karışıklık matrisine ve doğruluğa bak.", en: "Slide the threshold. Watch the two groups' probability distributions, the confusion matrix and accuracy." }, takeaway: { tr: "Eşik indikçe daha çok temerrüt yakalanır ama daha çok iyi müşteri reddedilir. Doğruluk bu takası göstermez.", en: "As the threshold falls more defaults are caught but more good customers are rejected. Accuracy does not show this trade-off." } },
    cells: [
      {
        id: "m4-u3-c1", kind: "run",
        task: { tr: "Hiç model kurmadan en basit kural: “herkes öder”. Doğruluğu ne olur? Önce tahmin et.", en: "The simplest rule, without any model: “everyone pays”. What is its accuracy? Predict first." },
        predict: { q: { tr: "“Herkes öder” kuralının doğruluğu kaç?", en: "What is the accuracy of the “everyone pays” rule?" }, options: { tr: ["%50", "Yaklaşık %89", "%0"], en: ["50%", "About 89%", "0%"] }, answer: 1, explain: { tr: "Başvuranların %89'u zaten ödüyor. Hiçbir temerrüdü yakalamayan bir kural bile %89 doğru görünür.", en: "89% of applicants pay anyway. Even a rule that catches no default looks 89% accurate." } },
        code: { tr: WM.tr + `\nprint(f"“Herkes öder” doğruluğu: %{100 * (1 - y_tst.mean()):.1f}")\nm = olcu(y_tst, p_hat, 0.5)\nprint(f"Model, eşik 0,5: doğruluk %{100 * m['doğruluk']:.1f}   yakalanan temerrüt %{100 * m['duyarlılık']:.1f}")`, en: WM.en + `\nprint(f"“Everyone pays” accuracy: {100 * (1 - y_te.mean()):.1f}%")\nm = metrics(y_te, p_hat, 0.5)\nprint(f"Model, threshold 0.5: accuracy {100 * m['accuracy']:.1f}%   defaults caught {100 * m['recall']:.1f}%")` },
        after: { tr: "“Herkes öder” %89,3; model eşik 0,5'te %90,0. Model doğrulukta neredeyse hiç fark yaratmıyor gibi görünüyor, ama temerrüdlerin %14'ünü yakalıyor. Dengesiz veride doğruluk yanıltıcı bir ölçüdür.", en: "“Everyone pays” 89.3%; the model at threshold 0.5 90.0%. The model seems to add almost nothing in accuracy, yet it catches 14% of defaults. With imbalanced data accuracy is a misleading measure." }
      },
      {
        id: "m4-u3-c2", kind: "run",
        task: { tr: "Eşiği 0,5'ten 0,2'ye indiriyoruz. Önce tahmin et.", en: "We lower the threshold from 0.5 to 0.2. Predict first." },
        predict: { q: { tr: "Eşik 0,2'ye inince doğruluk ve yakalanan temerrüt sayısı nasıl değişir?", en: "When the threshold drops to 0.2, how do accuracy and the number of defaults caught change?" }, options: { tr: ["Doğruluk düşer, yakalanan temerrüt neredeyse dört katına çıkar", "İkisi de artar", "İkisi de düşer"], en: ["Accuracy falls, defaults caught almost quadruple", "Both rise", "Both fall"] }, answer: 0, explain: { tr: "Daha düşük eşik daha çok başvuruyu “riskli” sayar: daha çok temerrüt yakalanır, ama daha çok iyi müşteri de reddedilir.", en: "A lower threshold marks more applications as “risky”: more defaults are caught, but more good customers are rejected too." } },
        code: { tr: WM.tr + `\nfor esik in [0.5, 0.2]:\n    m = olcu(y_tst, p_hat, esik)\n    print(f"eşik {esik}:  DP {m['DP']:5d}  YN {m['YN']:5d}  YP {m['YP']:5d}  DN {m['DN']:5d}   doğruluk %{100*m['doğruluk']:.1f}")`, en: WM.en + `\nfor thr in [0.5, 0.2]:\n    m = metrics(y_te, p_hat, thr)\n    print(f"threshold {thr}:  TP {m['TP']:5d}  FN {m['FN']:5d}  FP {m['FP']:5d}  TN {m['TN']:5d}   accuracy {100*m['accuracy']:.1f}%")` },
        after: { tr: "Eşik 0,5: 308 temerrüt yakalandı, 1.826'sı kaçtı. Eşik 0,2: 1.147 yakalandı, 987'si kaçtı; ama reddedilen iyi müşteri 168'den 2.122'ye çıktı. Doğruluk %90,0'dan %84,5'e düştü. Hangisi daha iyi? Bu, hataların maliyetine bağlı (Ünite 6).", en: "Threshold 0.5: 308 defaults caught, 1,826 missed. Threshold 0.2: 1,147 caught, 987 missed; but rejected good customers rose from 168 to 2,122. Accuracy fell from 90.0% to 84.5%. Which is better? It depends on the cost of the errors (Unit 6)." }
      },
      {
        id: "m4-u3-c3", kind: "audit",
        task: { tr: "YZ modelin temerrüdleri ne kadar yakaladığını hesapladı. Hatalı satırı bul ve düzelt: <code>duyarlilik</code>, gerçekten temerrüde düşenlerin ne kadarının yakalandığını ölçsün.", en: "The AI computed how well the model catches defaults. Find the faulty line and fix it: <code>recall</code> should measure what share of actual defaulters were caught." },
        ai: {
          prompt: { tr: "Eşik 0,2'de model temerrüde düşenlerin yüzde kaçını yakalıyor?", en: "At threshold 0.2, what share of defaulters does the model catch?" },
          reply: { tr: "Karışıklık matrisinin hücrelerinden hesaplayalım:", en: "Let us compute it from the confusion matrix cells:" },
          code: U3A,
          claim: { tr: "Model temerrüde düşenlerin %35'ini yakalıyor; eşik 0,2 işe yaramıyor.", en: "The model catches 35% of defaulters; threshold 0.2 is useless." }
        },
        bugLines: [ln(U3A.tr, "duyarlilik = dp /")],
        lineExplain: { tr: "<code>dp / (dp + yp)</code> kesinliktir: “riskli dediklerimin ne kadarı gerçekten temerrüde düştü?” Duyarlılık ise “temerrüde düşenlerin ne kadarını yakaladım?” sorusudur: <code>dp / (dp + yn)</code>.", en: "<code>tp / (tp + fp)</code> is precision: “of those I called risky, how many actually defaulted?” Recall asks “of those who defaulted, how many did I catch?”: <code>tp / (tp + fn)</code>." },
        hints: [{ tr: "Payda, gerçekten temerrüde düşenlerin tamamı olmalı: yakalananlar (DP) + kaçanlar (YN).", en: "The denominator should be all actual defaulters: caught (TP) + missed (FN)." }],
        solution: { tr: U3A.tr.replace("duyarlilik = dp / (dp + yp)", "duyarlilik = dp / (dp + yn)"), en: U3A.en.replace("recall = tp / (tp + fp)", "recall = tp / (tp + fn)") },
        checks: [{ py: { tr: "abs(duyarlilik - olcu(y_tst, p_hat, 0.2)['duyarlılık']) < 1e-12", en: "abs(recall - metrics(y_te, p_hat, 0.2)['recall']) < 1e-12" }, msg: { tr: "<code>duyarlilik</code> değişkeni DP / (DP + YN) olmalı. Yalnızca <code>duyarlilik = …</code> satırını değiştir; <code>dp</code>, <code>yp</code> ve <code>yn</code> sayımlarına dokunma.", en: "The variable <code>recall</code> should be TP / (TP + FN). Change only the <code>recall = …</code> line; leave the <code>tp</code>, <code>fp</code> and <code>fn</code> counts alone." } }],
        after: { tr: "Doğru duyarlılık %54: eşik 0,2 temerrüdlerin yarısından fazlasını yakalıyor. %35 ise kesinlikti: “riskli” denenlerin %35'i gerçekten temerrüde düştü. İki ölçünün adını karıştırmak, kararı tersine çevirebilir.", en: "The right recall is 54%: threshold 0.2 catches more than half of defaults. 35% was precision: 35% of those called “risky” actually defaulted. Confusing the two names can reverse the decision." }
      },
      {
        id: "m4-u3-c4", kind: "fill",
        task: { tr: "Yanlış pozitifleri say: model “temerrüt” dediği hâlde aslında ödeyen başvurular (eşik 0,2).", en: "Count the false positives: applications the model calls “default” that actually pay (threshold 0.2)." },
        code: { tr: WM.tr + `\nkarar = (p_hat >= 0.2).astype(int)\nyp = int(np.sum((karar == 1) & (y_tst == ___)))\nprint("Reddedilen iyi müşteri (YP):", yp)`, en: WM.en + `\ndecision = (p_hat >= 0.2).astype(int)\nfp = int(np.sum((decision == 1) & (y_te == ___)))\nprint("Good customers rejected (FP):", fp)` },
        solution: { tr: WM.tr + `\nkarar = (p_hat >= 0.2).astype(int)\nyp = int(np.sum((karar == 1) & (y_tst == 0)))\nprint("Reddedilen iyi müşteri (YP):", yp)`, en: WM.en + `\ndecision = (p_hat >= 0.2).astype(int)\nfp = int(np.sum((decision == 1) & (y_te == 0)))\nprint("Good customers rejected (FP):", fp)` },
        hints: [{ tr: "Yanlış pozitif: karar 1, gerçek 0.", en: "False positive: decision 1, actual 0." }],
        checks: [{ py: { tr: "yp == olcu(y_tst, p_hat, 0.2)['YP']", en: "fp == metrics(y_te, p_hat, 0.2)['FP']" }, msg: { tr: "<code>yp</code>, karar 1 ve gerçek 0 olan başvuruların sayısı olmalı.", en: "<code>fp</code> should count applications with decision 1 and actual 0." } }],
        after: { tr: "2.122 iyi müşteri reddediliyor. Bir banka için bu, kaybedilen faiz geliridir; bir başvuran için reddedilen bir kredi. Her hücrenin bir iktisadi bedeli var.", en: "2,122 good customers are rejected. For a bank that is lost interest income; for an applicant, a refused loan. Every cell has an economic cost." }
      }
    ],
    quiz: [
      { q: { tr: "Yanlış negatif (YN) kredi bağlamında nedir?", en: "What is a false negative (FN) in credit?" }, options: { tr: ["Temerrüde düşecek birine kredi vermek", "Ödeyecek birini reddetmek", "Ödeyecek birine kredi vermek"], en: ["Lending to someone who will default", "Rejecting someone who would pay", "Lending to someone who will pay"] }, answer: 0, explain: { tr: "Model “öder” dedi, kişi temerrüde düştü.", en: "The model said “pays”, the person defaulted." } },
      { q: { tr: "Dengesiz veride doğruluk neden yanıltıcıdır?", en: "Why is accuracy misleading with imbalanced data?" }, options: { tr: ["Hiçbir temerrüdü yakalamayan bir kural bile yüksek doğruluk alır", "Hesaplanması zordur", "Her zaman %50'dir"], en: ["Even a rule that catches no default scores high accuracy", "It is hard to compute", "It is always 50%"] }, answer: 0, explain: { tr: "“Herkes öder” %89.", en: "“Everyone pays” scores 89%." } },
      { q: { tr: "Eşik düşürülünce ne olur?", en: "What happens when the threshold is lowered?" }, options: { tr: ["Daha çok temerrüt yakalanır, daha çok iyi müşteri reddedilir", "Hiçbir şey değişmez", "Daha az temerrüt yakalanır"], en: ["More defaults caught, more good customers rejected", "Nothing changes", "Fewer defaults caught"] }, answer: 0, explain: { tr: "Takas vardır; doğru eşik maliyetlere bağlıdır.", en: "There is a trade-off; the right threshold depends on costs." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 4 — Duyarlılık, kesinlik, özgüllük                               */
  /* =================================================================== */
  U.push({
    id: "m4-u4", minutes: 25, packages: PK,
    title: { tr: "Duyarlılık, kesinlik ve özgüllük", en: "Recall, precision and specificity" },
    blurb: { tr: "Dört ölçü, dört farklı soru. Eşik değiştikçe birbirlerini nasıl çektikleri ve hangi soruda hangisinin önemli olduğu.", en: "Four measures, four different questions. How they pull against each other as the threshold changes, and which one matters for which question." },
    terms: [{ tr: "duyarlılık (recall)", en: "recall (sensitivity)" }, { tr: "kesinlik (precision)", en: "precision" }, { tr: "özgüllük", en: "specificity" }],
    concept: C0,
    playground: { type: "thresholdMatrix", config: { curves: true }, intro: { tr: "Eşiği kaydır ve dört ölçünün eğrisinde nerede durduğuna bak.", en: "Slide the threshold and see where you stand on the four measures' curves." }, takeaway: { tr: "Eşik yükseldikçe duyarlılık hiç artmaz, özgüllük hiç düşmez; kesinlik genellikle artar ama her adımda değil. Tek bir eşik duyarlılık ile kesinliği birden en yüksek yapamaz.", en: "As the threshold rises recall never rises and specificity never falls; precision usually rises, but not at every step. No single threshold maximises recall and precision together." } },
    cells: [
      {
        id: "m4-u4-c1", kind: "run",
        task: { tr: "Dört ölçüyü yedi farklı eşikte hesaplıyoruz. Önce tahmin et.", en: "We compute the four measures at seven thresholds. Predict first." },
        predict: { q: { tr: "Eşik 0,1'den 0,7'ye çıkarken kesinlik ve duyarlılık nasıl değişir?", en: "As the threshold rises from 0.1 to 0.7, how do precision and recall change?" }, options: { tr: ["Kesinlik artar, duyarlılık düşer", "İkisi de artar", "Kesinlik düşer, duyarlılık artar"], en: ["Precision rises, recall falls", "Both rise", "Precision falls, recall rises"] }, answer: 0, explain: { tr: "Yüksek eşik yalnızca çok riskli başvuruları “temerrüt” sayar: bunların çoğu gerçekten temerrüde düşer (kesinlik genellikle yükselir), ama temerrüdlerin çoğu kaçar (duyarlılık düşer). Duyarlılık eşik yükseldikçe hiç artmaz; kesinlik ise her adımda artmak zorunda değildir.", en: "A high threshold calls only very risky applications “default”: most of them really default (precision usually rises), but most defaults are missed (recall falls). Recall never rises as the threshold rises; precision need not rise at every step." } },
        code: { tr: WM.tr + `\nprint("eşik  doğruluk  duyarlılık  kesinlik  özgüllük")\nfor esik in [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]:\n    m = olcu(y_tst, p_hat, esik)\n    print(f"{esik:.1f}   {m['doğruluk']:8.3f}  {m['duyarlılık']:10.3f}  {m['kesinlik']:8.3f}  {m['özgüllük']:8.3f}")`, en: WM.en + `\nprint("thr   accuracy  recall  precision  specificity")\nfor thr in [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]:\n    m = metrics(y_te, p_hat, thr)\n    print(f"{thr:.1f}   {m['accuracy']:8.3f}  {m['recall']:6.3f}  {m['precision']:9.3f}  {m['specificity']:11.3f}")` },
        after: { tr: "Eşik 0,1'de duyarlılık yüksek, kesinlik düşük; 0,7'de tersi. Bu tabloda kesinlik her adımda artıyor, ama bu bir kural değil: az sayıda pozitif kararın kaldığı yüksek eşiklerde bir iki başvuru kesinliği aşağı çekebilir (oyun alanında dene). Eşik 0,7'nin üstünde hiç “temerrüt” kararı kalmazsa kesinlik tanımsızdır; <code>olcu</code> o zaman <code>nan</code> döndürür. Doğruluk eşik yükseldikçe “herkes öder” kuralının %89'una yaklaşıyor. Hangi ölçünün önemli olduğu, sorunun kendisine bağlı.", en: "At 0.1 recall is high and precision low; at 0.7 the reverse. In this table precision rises at every step, but that is not a rule: at high thresholds where few positive decisions remain, one or two applications can pull precision down (try it in the playground). If no “default” decision remains, precision is undefined; <code>metrics</code> then returns <code>nan</code>. As the threshold rises accuracy approaches the 89% of “everyone pays”. Which measure matters depends on the question itself." }
      },
      {
        id: "m4-u4-c2", kind: "interpret",
        task: { tr: "YZ hangi durumda hangi ölçünün önemli olduğunu anlattı. Hangi cümleler yanlış?", en: "The AI explained which measure matters in which situation. Which sentences are wrong?" },
        prompt: { tr: "Kredi, dolandırıcılık ve kampanya örnekleriyle duyarlılık, kesinlik ve özgüllüğü karşılaştırır mısın?", en: "Can you compare recall, precision and specificity using credit, fraud and marketing examples?" },
        sentences: {
          tr: ["Dolandırıcılık tespitinde kaçan her vaka pahalıysa duyarlılık öne çıkar.", "Pahalı bir inceleme ekibine yalnızca güçlü şüphelileri göndermek istiyorsak kesinlik önemlidir.", "Özgüllük, temerrüde düşenlerin ne kadarının yakalandığını gösterir.", "En iyi model her zaman doğruluğu en yüksek olandır."],
          en: ["In fraud detection, if every missed case is costly, recall comes first.", "If we only want to send strong suspects to an expensive investigation team, precision matters.", "Specificity shows what share of defaulters were caught.", "The best model is always the one with the highest accuracy."]
        },
        bad: [2, 3],
        explain: {
          tr: ["Doğru.", "Doğru.", "<b>Yanlış:</b> bu duyarlılıktır. Özgüllük, ödeyenlerin ne kadarının doğru biçimde “öder” sayıldığıdır: DN / (DN + YP).", "<b>Yanlış:</b> dengesiz veride “herkes öder” bile yüksek doğruluk alır. Ölçü, hataların maliyetine göre seçilir."],
          en: ["Correct.", "Correct.", "<b>Wrong:</b> that is recall. Specificity is the share of payers correctly classed as “pays”: TN / (TN + FP).", "<b>Wrong:</b> with imbalanced data even “everyone pays” scores high accuracy. The measure is chosen by the cost of errors."]
        }
      },
      {
        id: "m4-u4-c3", kind: "fill",
        task: { tr: "Özgüllüğü hücrelerden hesapla: ödeyenlerin ne kadarı doğru biçimde “öder” sayıldı (eşik 0,2)?", en: "Compute specificity from the cells: what share of payers were correctly classed as “pays” (threshold 0.2)?" },
        code: { tr: WM.tr + `\nm = olcu(y_tst, p_hat, 0.2)\nozgulluk = m["DN"] / (m["DN"] + ___)\nprint("Özgüllük:", round(ozgulluk, 3))`, en: WM.en + `\nm = metrics(y_te, p_hat, 0.2)\nspecificity = m["TN"] / (m["TN"] + ___)\nprint("Specificity:", round(specificity, 3))` },
        solution: { tr: WM.tr + `\nm = olcu(y_tst, p_hat, 0.2)\nozgulluk = m["DN"] / (m["DN"] + m["YP"])\nprint("Özgüllük:", round(ozgulluk, 3))`, en: WM.en + `\nm = metrics(y_te, p_hat, 0.2)\nspecificity = m["TN"] / (m["TN"] + m["FP"])\nprint("Specificity:", round(specificity, 3))` },
        hints: [{ tr: "Payda: bütün ödeyenler = doğru biçimde onaylananlar (DN) + yanlışlıkla reddedilenler (YP).", en: "Denominator: all payers = correctly approved (TN) + wrongly rejected (FP)." }],
        checks: [{ py: { tr: "abs(ozgulluk - m['özgüllük']) < 1e-12", en: "abs(specificity - m['specificity']) < 1e-12" }, msg: { tr: "<code>ozgulluk</code> = DN / (DN + YP) olmalı.", en: "<code>specificity</code> should be TN / (TN + FP)." } }],
        after: { tr: "Özgüllük 0,881: ödeyenlerin %88'i onaylanıyor, %12'si (YP) reddediliyor. 1 − özgüllük, Ünite 5'teki ROC eğrisinin yatay eksenidir.", en: "Specificity is 0.881: 88% of payers are approved, 12% (FP) rejected. 1 − specificity is the horizontal axis of the ROC curve in Unit 5." }
      }
    ],
    quiz: [
      { q: { tr: "Duyarlılık hangi soruyu yanıtlar?", en: "Which question does recall answer?" }, options: { tr: ["Temerrüde düşenlerin ne kadarını yakaladım?", "Riskli dediklerimin ne kadarı temerrüde düştü?", "Ödeyenlerin ne kadarını onayladım?"], en: ["What share of defaulters did I catch?", "What share of those I called risky defaulted?", "What share of payers did I approve?"] }, answer: 0, explain: { tr: "DP / (DP + YN).", en: "TP / (TP + FN)." } },
      { q: { tr: "Kesinlik hangi soruyu yanıtlar?", en: "Which question does precision answer?" }, options: { tr: ["Riskli dediklerimin ne kadarı gerçekten temerrüde düştü?", "Temerrüde düşenlerin ne kadarını yakaladım?", "Toplam doğru karar oranı nedir?"], en: ["What share of those I called risky actually defaulted?", "What share of defaulters did I catch?", "What is the overall share of right decisions?"] }, answer: 0, explain: { tr: "DP / (DP + YP).", en: "TP / (TP + FP)." } },
      { q: { tr: "Eşik yükseldikçe genellikle ne olur?", en: "What usually happens as the threshold rises?" }, options: { tr: ["Kesinlik artar, duyarlılık düşer", "Duyarlılık artar", "İkisi de artar"], en: ["Precision rises, recall falls", "Recall rises", "Both rise"] }, answer: 0, explain: { tr: "Daha az ama daha emin “temerrüt” kararı. Duyarlılık hiç artmaz; kesinlik genellikle artar ama örneklemden örnekleme küçük düşüşler görülebilir.", en: "Fewer but more confident “default” calls. Recall never rises; precision usually rises, but small dips can occur from sample to sample." } }
    ]
  });
})();
