/* Modül 5 — Ağaçlar, topluluklar ve açıklanabilirlik · Üniteler 6–9
 * SHAP kütüphanesi tarayıcıdaki Python'da çalışmadığı için Ünite 6–7'nin SHAP değerleri, 6. hafta notebook'unda
 * shap.TreeExplainer'ın verdiği değerlerdir; SHAP kodu Ünite 9'daki Colab atölyesindedir.
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 * "Örnek YZ yanıtları" öğretim amacıyla hazırlanmıştır.
 */
(function () {
  "use strict";
  const D = window.M5_DATA, U = window.M5_UNITS, ln = D.line;
  const W = D.WORLD, WG = { tr: D.WORLD.tr + D.GB.tr, en: D.WORLD.en + D.GB.en };
  const PK = ["numpy", "scikit-learn"], PKI = ["numpy", "pandas", "scikit-learn"];
  const C0 = { tr: "", en: "" };
  const TWM = { tr: D.TW.tr + D.TWM.tr, en: D.TW.en + D.TWM.en };

  /* =================================================================== */
  /* Ünite 6 — SHAP ile tek bir başvuruyu açıklamak                          */
  /* =================================================================== */
  U.push({
    id: "m5-u6", minutes: 25, packages: PK,
    title: { tr: "SHAP ile tek bir başvuruyu açıklamak", en: "Explaining a single application with SHAP" },
    blurb: { tr: "Yüz ağaçlık bir model bir başvurana %62 dedi. Neden? SHAP, tahmini ortalama başvurandan başlayıp her değişkenin katkısına böler; katkılar tahmine tam olarak toplanır.", en: "A hundred-tree model told an applicant 62%. Why? SHAP splits the prediction into each variable's contribution, starting from the average applicant; the contributions add up exactly to the prediction." },
    terms: [{ tr: "SHAP değeri", en: "SHAP value" }, { tr: "taban değer", en: "base value" }, { tr: "toplama özelliği", en: "additivity" }, { tr: "şelale grafiği", en: "waterfall plot" }],
    concept: C0,
    playground: { type: "shapWaterfall", intro: { tr: "İki başvuranın SHAP katkılarını (6. hafta notebook'undaki boosting modeli) adım adım topla: taban değerden başlayıp her değişkenin katkısını ekle ve log-odds'un olasılığa nasıl dönüştüğüne bak.", en: "Add up two applicants' SHAP contributions (the boosting model from the week 6 notebook) step by step: start from the base value, add each variable's contribution, and watch the log-odds turn into a probability." }, takeaway: { tr: "Katkılar log-odds ölçeğindedir ve tahmine tam olarak toplanır; olasılıktaki etkileri sıraya ve başlangıç noktasına bağlıdır.", en: "Contributions are on the log-odds scale and add up exactly to the prediction; their effect on the probability depends on the order and starting point." } },
    cells: [
      {
        id: "m5-u6-c1", kind: "run",
        task: { tr: "6. haftadaki boosting modelini (100 ağaç, öğrenme oranı 0,05) kurup iki başvurana bakıyoruz: A borcu yüksek ve gecikmesi olan biri, B modelin en düşük riskli bulduğu biri. Önce tahmin et.", en: "We build the week 6 boosting model (100 trees, learning rate 0.05) and look at two applicants: A has high debt and a past delinquency, B is the one the model finds least risky. Predict first." },
        predict: { q: { tr: "A'nın temerrüt olasılığı yaklaşık kaç?", en: "What is A's default probability, roughly?" }, options: { tr: ["%15", "%60", "%95"], en: ["15%", "60%", "95%"] }, answer: 1, explain: { tr: "Borç/gelir eşiğin çok üzerinde ve gecikme var: iki büyük risk bir arada. Ama gelir yüksek ve yaş orta, bu da riski biraz azaltıyor.", en: "Debt/income is far above the threshold and there is a delinquency: two big risks together. But income is high and age is moderate, which lowers the risk a little." } },
        code: { tr: WG.tr + `\nfor ad, k in [("A", 27), ("B", 52)]:\n    x = X_tst[[k]]\n    print(f"Başvuran {ad}:", {a: float(v) for a, v in zip(adlar, x[0].round(2))})\n    print(f"   log-odds {gb.decision_function(x)[0]:.2f}  →  olasılık %{100 * gb.predict_proba(x)[0, 1]:.0f}")`, en: WG.en + `\nfor name, k in [("A", 27), ("B", 52)]:\n    x = X_te[[k]]\n    print(f"Applicant {name}:", {a: float(v) for a, v in zip(names, x[0].round(2))})\n    print(f"   log-odds {gb.decision_function(x)[0]:.2f}  →  probability {100 * gb.predict_proba(x)[0, 1]:.0f}%")` },
        after: { tr: "A: log-odds 0,50, olasılık %62. B: log-odds −3,42, olasılık %3. Model bize yalnızca bu iki sayıyı veriyor; nedenini söylemiyor. Bir banka reddettiği başvurana gerekçe göstermek zorundaysa bu yetmez.", en: "A: log-odds 0.50, probability 62%. B: log-odds −3.42, probability 3%. The model gives us only these two numbers; it does not say why. If a bank must give reasons to an applicant it rejects, that is not enough." }
      },
      {
        id: "m5-u6-c2", kind: "fill",
        task: { tr: "Colab'da <code>shap.TreeExplainer</code> bu model için taban değeri (ortalama başvuranın log-odds'u) −1,93 ve A'nın katkılarını aşağıdaki gibi verdi. Toplama özelliğini sına: taban + katkılar, modelin log-odds tahminine eşit mi?", en: "In Colab, <code>shap.TreeExplainer</code> gave this model a base value (the average applicant's log-odds) of −1.93 and A's contributions as below. Test the additivity property: does base + contributions equal the model's log-odds prediction?" },
        code: { tr: WG.tr + `\ntaban = -1.93                                                # ortalama başvuranın log-odds'u (olasılık %13)\nkatkilar = np.array([1.56, 1.06, -0.40, -0.11, 0.21, 0.12])  # A için SHAP katkıları (Colab'daki shap'ten, iki basamak)\nlog_odds = taban + katkilar.___()\nprint(f"taban + katkılar = {log_odds:.2f}   modelin log-odds'u = {gb.decision_function(X_tst[[27]])[0]:.2f}")\nprint(f"olasılık: %{100 / (1 + np.exp(-log_odds)):.1f}   model: %{100 * gb.predict_proba(X_tst[[27]])[0, 1]:.1f}")`, en: WG.en + `\nbase = -1.93                                                 # the average applicant's log-odds (probability 13%)\ncontrib = np.array([1.56, 1.06, -0.40, -0.11, 0.21, 0.12])   # SHAP contributions for A (from shap in Colab, two decimals)\nlog_odds = base + contrib.___()\nprint(f"base + contributions = {log_odds:.2f}   model's log-odds = {gb.decision_function(X_te[[27]])[0]:.2f}")\nprint(f"probability: {100 / (1 + np.exp(-log_odds)):.1f}%   model: {100 * gb.predict_proba(X_te[[27]])[0, 1]:.1f}%")` },
        solution: { tr: WG.tr + `\ntaban = -1.93                                                # ortalama başvuranın log-odds'u (olasılık %13)\nkatkilar = np.array([1.56, 1.06, -0.40, -0.11, 0.21, 0.12])  # A için SHAP katkıları (Colab'daki shap'ten, iki basamak)\nlog_odds = taban + katkilar.sum()\nprint(f"taban + katkılar = {log_odds:.2f}   modelin log-odds'u = {gb.decision_function(X_tst[[27]])[0]:.2f}")\nprint(f"olasılık: %{100 / (1 + np.exp(-log_odds)):.1f}   model: %{100 * gb.predict_proba(X_tst[[27]])[0, 1]:.1f}")`, en: WG.en + `\nbase = -1.93                                                 # the average applicant's log-odds (probability 13%)\ncontrib = np.array([1.56, 1.06, -0.40, -0.11, 0.21, 0.12])   # SHAP contributions for A (from shap in Colab, two decimals)\nlog_odds = base + contrib.sum()\nprint(f"base + contributions = {log_odds:.2f}   model's log-odds = {gb.decision_function(X_te[[27]])[0]:.2f}")\nprint(f"probability: {100 / (1 + np.exp(-log_odds)):.1f}%   model: {100 * gb.predict_proba(X_te[[27]])[0, 1]:.1f}%")` },
        hints: [{ tr: "Katkıları toplamak için <code>.sum()</code>.", en: "Use <code>.sum()</code> to add up the contributions." }],
        checks: [{ py: { tr: "abs(log_odds - 0.51) < 1e-9", en: "abs(log_odds - 0.51) < 1e-9" }, msg: { tr: "<code>log_odds</code>, taban ile katkıların toplamı olmalı.", en: "<code>log_odds</code> should be the base plus the sum of the contributions." } }],
        after: { tr: "−1,93 + 2,44 = 0,51; model 0,50 diyor (fark yalnızca iki basamağa yuvarlamadan). Olasılık %62,5'e karşı %62,3. SHAP'in temel özelliği bu: katkılar tahmini tam olarak paylaştırır. A'nın riskini en çok borç/gelir (+1,56) ve gecikme (+1,06) artırıyor; yüksek gelir (−0,40) biraz azaltıyor.", en: "−1.93 + 2.44 = 0.51; the model says 0.50 (the gap is only rounding to two decimals). Probability 62.5% against 62.3%. This is SHAP's key property: the contributions share out the prediction exactly. A's risk is raised most by debt/income (+1.56) and delinquency (+1.06); high income (−0.40) lowers it a little." }
      },
      {
        id: "m5-u6-c3", kind: "interpret",
        task: { tr: "YZ, A'nın şelale grafiğini kredi komitesine yorumladı. Hangi cümleler yanlış?", en: "The AI interpreted A's waterfall plot for the credit committee. Which sentences are wrong?" },
        prompt: { tr: "Taban −1,93 (%13); borç/gelir +1,56, gecikme +1,06, gelir −0,40, çalışma süresi −0,11, kart +0,21, yaş +0,12; tahmin 0,50 (%62). Yorumlar mısın?", en: "Base −1.93 (13%); debt/income +1.56, delinquency +1.06, income −0.40, years employed −0.11, card +0.21, age +0.12; prediction 0.50 (62%). Can you interpret this?" },
        sentences: {
          tr: ["Modelin bu başvurana verdiği riski ortalama başvurana göre en çok yüksek borç/gelir oranı artırıyor.", "Borç/gelir oranı temerrüt olasılığını 1,56 puan artırıyor.", "Katkılar, bu başvuranın değerlerinin modelin tahmini üzerindeki etkisini ortalama başvurana göre ölçer.", "Bu başvuran borcunu azaltırsa temerrüt olasılığı kesinlikle 1,56 log-odds düşer."],
          en: ["Compared with the average applicant, the model's risk for this applicant is raised most by the high debt/income ratio.", "The debt/income ratio raises the probability of default by 1.56 points.", "The contributions measure how this applicant's values move the model's prediction, relative to the average applicant.", "If this applicant reduces their debt, their default probability will certainly fall by 1.56 log-odds."]
        },
        bad: [1, 3],
        explain: {
          tr: ["Doğru.", "<b>Yanlış:</b> katkılar log-odds cinsindendir, olasılık puanı değildir (Modül 4, Ünite 2).", "Doğru.", "<b>Yanlış:</b> SHAP modelin tahminini açıklar, gerçek dünyada bir değişiklik yapılırsa ne olacağını söylemez. Borcu azaltmak başka değişkenleri de değiştirebilir; nedensel bir iddia için nedensel bir tasarım gerekir."],
          en: ["Correct.", "<b>Wrong:</b> contributions are in log-odds, not probability points (Module 4, Unit 2).", "Correct.", "<b>Wrong:</b> SHAP explains the model's prediction; it does not say what would happen if something were changed in the real world. Reducing debt may change other variables too; a causal claim needs a causal design."]
        }
      }
    ],
    quiz: [
      { q: { tr: "SHAP'in toplama özelliği nedir?", en: "What is SHAP's additivity property?" }, options: { tr: ["Taban değer + bütün katkılar = modelin tahmini", "Katkıların toplamı her zaman sıfırdır", "Katkılar olasılık puanlarıdır"], en: ["Base value + all contributions = the model's prediction", "The contributions always sum to zero", "The contributions are probability points"] }, answer: 0, explain: { tr: "Bu modelde ölçek log-odds.", en: "In this model the scale is log-odds." } },
      { q: { tr: "Taban değer neyi temsil eder?", en: "What does the base value represent?" }, options: { tr: ["Ortalama başvuranın tahminini", "En riskli başvuranı", "Eşiği"], en: ["The average applicant's prediction", "The riskiest applicant", "The threshold"] }, answer: 0, explain: { tr: "Katkılar bu noktadan sapmayı ölçer.", en: "Contributions measure the departure from this point." } },
      { q: { tr: "SHAP katkısı nedensel etki midir?", en: "Is a SHAP contribution a causal effect?" }, options: { tr: ["Hayır; modelin tahminini açıklar", "Evet, her zaman", "Yalnızca boosting'de"], en: ["No; it explains the model's prediction", "Yes, always", "Only in boosting"] }, answer: 0, explain: { tr: "Modül 1'deki öngörü–nedensellik ayrımı.", en: "Module 1's prediction–causality distinction." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 7 — SHAP ile genel resim ve sınırları                             */
  /* =================================================================== */
  U.push({
    id: "m5-u7", minutes: 25, packages: PKI,
    title: { tr: "SHAP ile genel resim ve sınırları", en: "The big picture with SHAP, and its limits" },
    blurb: { tr: "Binlerce başvurunun SHAP değerleri, modelin hangi değişkenlere ve hangi biçimde (eşik, U, etkileşim) dayandığını gösterir. Ama ilişkili değişkenler katkıyı paylaşır ve SHAP nedensellik göstermez.", en: "Thousands of applications' SHAP values show which variables the model relies on and in what shape (threshold, U, interaction). But correlated variables share credit and SHAP does not show causality." },
    terms: [{ tr: "ortalama |SHAP|", en: "mean |SHAP|" }, { tr: "bağımlılık grafiği", en: "dependence plot" }, { tr: "ilişkili değişkenler", en: "correlated variables" }],
    concept: C0, playground: null,
    cells: [
      {
        id: "m5-u7-c1", kind: "run",
        task: { tr: "Colab'daki SHAP özetine göre yaş, boosting modelinin en önemli ikinci değişkeni (ortalama |SHAP| 0,33); lojistik regresyonun yaş katsayısı ise −0,06. Hangisine inanmalı? Veriye doğrudan bakıyoruz: yaş dilimlerine göre gerçekleşen temerrüt oranı ve modelin ortalama olasılığı. Önce tahmin et.", en: "According to the SHAP summary in Colab, age is the boosting model's second most important variable (mean |SHAP| 0.33), while logistic regression's age coefficient is −0.06. Which to believe? We look at the data directly: the realised default rate by age band and the model's average probability. Predict first." },
        predict: { q: { tr: "Yaş dilimlerine göre temerrüt oranı nasıl bir biçim çizer?", en: "What shape does the default rate by age band trace?" }, options: { tr: ["Düz: yaş önemsiz", "U: en genç ve en yaşlı dilimlerde yüksek", "Sürekli artan"], en: ["Flat: age does not matter", "U: high in the youngest and oldest bands", "Steadily rising"] }, answer: 1, explain: { tr: "Bu dünyada yaşın etkisi U biçimli; ortalama alınca iki uç birbirini götürür ve doğrusal katsayı sıfıra yaklaşır.", en: "In this world age has a U-shaped effect; on average the two ends cancel and the linear coefficient approaches zero." } },
        code: { tr: WG.tr + `\nimport pandas as pd\ndilim = pd.qcut(X_tst[:, 5], 10, labels=range(1, 11))\ntablo = pd.DataFrame({"gerçekleşen": y_tst, "boosting": gb.predict_proba(X_tst)[:, 1],\n                      "lojistik": LogisticRegression(C=1e6, max_iter=2000).fit(X_egt, y_egt).predict_proba(X_tst)[:, 1]}).groupby(dilim, observed=True).mean()\nprint("Yaş dilimi (1 = en genç)")\nprint(tablo.round(3).T.to_string())`, en: WG.en + `\nimport pandas as pd\nband = pd.qcut(X_te[:, 5], 10, labels=range(1, 11))\ntable = pd.DataFrame({"realised": y_te, "boosting": gb.predict_proba(X_te)[:, 1],\n                      "logistic": LogisticRegression(C=1e6, max_iter=2000).fit(X_tr, y_tr).predict_proba(X_te)[:, 1]}).groupby(band, observed=True).mean()\nprint("Age band (1 = youngest)")\nprint(table.round(3).T.to_string())` },
        after: { tr: "Gerçekleşen oran en genç dilimde %34, ortada %9–11, en yaşlı dilimde %27: açık bir U. Boosting bu biçimi izliyor; lojistik regresyon ise uçlarda riski olduğundan düşük gösteriyor. SHAP'in “yaş önemli” bulgusu veriyle tutarlı. Ham veriyle sağlamasını yapmak, açıklamaya körü körüne güvenmekten iyidir.", en: "The realised rate is 34% in the youngest band, 9–11% in the middle, 27% in the oldest: a clear U. Boosting tracks this shape; logistic regression understates the risk at the ends. SHAP's finding “age matters” is consistent with the data. Checking against the raw data beats trusting an explanation blindly." }
      },
      {
        id: "m5-u7-c2", kind: "run",
        task: { tr: "Yaş ile çalışma süresi ilişkili (bu dünyada yaşlılar daha uzun süredir çalışıyor). Modeli bir kez yaş olmadan, bir kez çalışma süresi olmadan yeniden kuruyoruz. Önce tahmin et.", en: "Age and years employed are correlated (in this world older people have worked longer). We rebuild the model once without age and once without years employed. Predict first." },
        predict: { q: { tr: "Hangisini çıkarmak AUC'yi daha çok düşürür?", en: "Which removal lowers AUC more?" }, options: { tr: ["Yaşı", "Çalışma süresini", "İkisi aynı"], en: ["Age", "Years employed", "The same"] }, answer: 0, explain: { tr: "Çalışma süresinin bilgisinin bir kısmını yaş taşıyor (ilişki); ama yaşın U biçimini hiçbir değişken yerine koyamıyor.", en: "Age carries part of the information in years employed (correlation); but no variable can stand in for age's U shape." } },
        code: { tr: WG.tr + `\nprint("Yaş–çalışma süresi korelasyonu:", round(np.corrcoef(X_tst[:, 3], X_tst[:, 5])[0, 1], 2))\nprint("Bütün değişkenler    : AUC", round(roc_auc_score(y_tst, gb.predict_proba(X_tst)[:, 1]), 3))\nfor ad, j in [("yaş", 5), ("çalışma süresi", 3)]:\n    s = [c for c in range(6) if c != j]\n    m = GradientBoostingClassifier(n_estimators=100, learning_rate=0.05, max_depth=3, subsample=0.8, random_state=1).fit(X_egt[:, s], y_egt)\n    print(f"{ad:15s} olmadan: AUC {roc_auc_score(y_tst, m.predict_proba(X_tst[:, s])[:, 1]):.3f}")`, en: WG.en + `\nprint("Age–years employed correlation:", round(np.corrcoef(X_te[:, 3], X_te[:, 5])[0, 1], 2))\nprint("All variables          : AUC", round(roc_auc_score(y_te, gb.predict_proba(X_te)[:, 1]), 3))\nfor name, j in [("age", 5), ("years employed", 3)]:\n    s = [c for c in range(6) if c != j]\n    m = GradientBoostingClassifier(n_estimators=100, learning_rate=0.05, max_depth=3, subsample=0.8, random_state=1).fit(X_tr[:, s], y_tr)\n    print(f"without {name:15s}: AUC {roc_auc_score(y_te, m.predict_proba(X_te[:, s])[:, 1]):.3f}")` },
        after: { tr: "Korelasyon 0,51. Yaş olmadan AUC 0,807'den 0,767'ye düşüyor; çalışma süresi olmadan yalnızca 0,802'ye. Çalışma süresinin SHAP önemi (0,24) bu değişkene özgü bilginin ölçüsü değildir: ilişkili değişkenler katkıyı paylaşır. Bir değişkenin “önemi”, modelde başka hangi değişkenlerin bulunduğuna bağlıdır.", en: "The correlation is 0.51. Without age AUC drops from 0.807 to 0.767; without years employed only to 0.802. Years employed's SHAP importance (0.24) is not a measure of information unique to that variable: correlated variables share credit. A variable's “importance” depends on which other variables are in the model." }
      },
      {
        id: "m5-u7-c3", kind: "interpret",
        task: { tr: "YZ, Colab'daki SHAP özetini yorumladı. Hangi cümleler yanlış?", en: "The AI interpreted the SHAP summary from Colab. Which sentences are wrong?" },
        prompt: { tr: "Ortalama |SHAP|: borç/gelir 0,45, yaş 0,33, gelir 0,29, çalışma süresi 0,24, gecikme 0,20, kart 0,20. Gecikmesi olanlarda gecikmenin katkısı borç ≤ 0 iken 0,58, borç > 0 iken 0,75. Yorumlar mısın?", en: "Mean |SHAP|: debt/income 0.45, age 0.33, income 0.29, years employed 0.24, delinquency 0.20, card 0.20. Among delinquent applicants, delinquency's contribution is 0.58 when debt ≤ 0 and 0.75 when debt > 0. Can you interpret this?" },
        sentences: {
          tr: ["Gecikmenin katkısının borcu yüksek olanlarda daha büyük olması, modelin etkileşimi yakaladığını gösteriyor.", "Gecikmenin ortalama |SHAP| değeri düşük olduğuna göre gecikme önemsiz bir değişkendir.", "Yaş ikinci sırada olduğuna göre banka başvuruları yaşa göre ayırmalıdır.", "Ortalama |SHAP|, bir değişkenin modelin tahminlerini ortalamada ne kadar oynattığını gösterir, yönünü göstermez."],
          en: ["Delinquency's contribution being larger for high-debt applicants shows that the model captured the interaction.", "Since delinquency's mean |SHAP| is low, delinquency is an unimportant variable.", "Since age ranks second, the bank should sort applications by age.", "Mean |SHAP| shows how much a variable moves the model's predictions on average, not its direction."]
        },
        bad: [1, 2],
        explain: {
          tr: ["Doğru.", "<b>Yanlış:</b> başvuranların yalnızca %15'inde gecikme var. Ortalama, gecikmesi olmayan %85'in küçük katkılarıyla düşüyor; gecikmesi olanlar için katkı çok büyük (0,58–0,75). Ortalama önem, nadir ama güçlü etkileri gizleyebilir.", "<b>Yanlış:</b> SHAP modelin neye dayandığını gösterir; neyin adil ya da yasal olduğunu söylemez. Yaşa göre ayrım birçok ülkede yasal kısıtlara tabidir ve U biçimi başka etkenlerin (gelir dalgalanması, emeklilik) vekili olabilir.", "Doğru."],
          en: ["Correct.", "<b>Wrong:</b> only 15% of applicants have a delinquency. The average is pulled down by the small contributions of the 85% without one; for those with one the contribution is very large (0.58–0.75). Average importance can hide rare but strong effects.", "<b>Wrong:</b> SHAP shows what the model relies on; it does not say what is fair or legal. Age discrimination is legally restricted in many countries, and the U shape may proxy for other factors (income volatility, retirement).", "Correct."]
        }
      }
    ],
    quiz: [
      { q: { tr: "İlişkili iki değişken SHAP'te ne yapar?", en: "What do two correlated variables do in SHAP?" }, options: { tr: ["Katkıyı paylaşır", "Katkılarını ikiye katlar", "Hiçbir şey"], en: ["They share credit", "They double their contributions", "Nothing"] }, answer: 0, explain: { tr: "Önem, modeldeki diğer değişkenlere bağlıdır.", en: "Importance depends on the other variables in the model." } },
      { q: { tr: "Ortalama |SHAP| neyi gizleyebilir?", en: "What can mean |SHAP| hide?" }, options: { tr: ["Az sayıda kişide görülen güçlü etkileri", "Toplama özelliğini", "Taban değeri"], en: ["Strong effects seen in few people", "Additivity", "The base value"] }, answer: 0, explain: { tr: "Gecikme örneği.", en: "The delinquency example." } },
      { q: { tr: "Bir SHAP bulgusunu sınamanın iyi bir yolu nedir?", en: "What is a good way to check a SHAP finding?" }, options: { tr: ["Ham veride (örneğin dilimlere göre oranlar) sağlamasını yapmak", "Daha çok ağaç eklemek", "Test verisini silmek"], en: ["Checking it in the raw data (e.g. rates by band)", "Adding more trees", "Deleting the test data"] }, answer: 0, explain: { tr: "Açıklama modeli anlatır; veriyle tutarlılığı ayrıca sınanır.", en: "The explanation describes the model; its consistency with the data is checked separately." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 8 — Gerçek veriyle: Tayvan                                        */
  /* =================================================================== */
  const U8A = { tr: TWM.tr + `\nauc_lojistik = roc_auc_score(y_t, p["lojistik"])\nauc_orman = roc_auc_score(y_e, orman.predict_proba(ham(egitim))[:, 1])\nprint(f"Lojistik regresyon: {auc_lojistik:.3f}   rassal orman: {auc_orman:.3f}")`, en: TWM.en + `\nauc_logistic = roc_auc_score(y_te, p["logistic"])\nauc_forest = roc_auc_score(y_tr, forest.predict_proba(raw(train))[:, 1])\nprint(f"Logistic regression: {auc_logistic:.3f}   random forest: {auc_forest:.3f}")` };
  U.push({
    id: "m5-u8", minutes: 35, packages: PKI, data: D.FILES,
    title: { tr: "Gerçek veriyle: Tayvan kart müşterilerinde ağaçlar", en: "With real data: trees on Taiwanese card customers" },
    blurb: { tr: "Modül 4'ün lojistik regresyonu (AUC 0,762) ile tek ağaç, rassal orman ve boosting'i aynı test verisinde karşılaştırmak: kazanç ne kadar, bedeli ne?", en: "Comparing Module 4's logistic regression (AUC 0.762) with a single tree, a random forest and boosting on the same test data: how big is the gain, and at what cost?" },
    terms: [{ tr: "hızlı boosting (HistGradientBoosting)", en: "fast boosting (HistGradientBoosting)" }, { tr: "model karşılaştırması", en: "model comparison" }],
    concept: C0, playground: null,
    cells: [
      {
        id: "m5-u8-c1", kind: "run",
        task: { tr: "Dört modeli aynı eğitim verisiyle kurup aynı test verisinde karşılaştırıyoruz. Ağaçlar ham kodlarla, lojistik regresyon Modül 4'teki hazırlıkla çalışıyor. 21.000 eğitim gözlemi olduğu için boosting'in hızlı sürümünü (<code>HistGradientBoostingClassifier</code>: değişkenleri önce 255 gruba ayırır) kullanıyoruz. Birkaç saniye sürebilir. Önce tahmin et.", en: "We build four models on the same training data and compare them on the same test data. The trees work with the raw codes, logistic regression with the Module 4 preparation. Because there are 21,000 training observations we use the fast version of boosting (<code>HistGradientBoostingClassifier</code>: it first sorts each variable into 255 bins). It may take a few seconds. Predict first." },
        predict: { q: { tr: "Simülasyonda boosting lojistik regresyonu 0,07 AUC geçmişti. Gerçek veride fark ne olur?", en: "In the simulation boosting beat logistic regression by 0.07 AUC. What is the gap on real data?" }, options: { tr: ["Daha büyük (0,10'dan fazla)", "Benzer (0,07 civarı)", "Çok daha küçük (0,01–0,02)"], en: ["Bigger (more than 0.10)", "Similar (around 0.07)", "Much smaller (0.01–0.02)"] }, answer: 2, explain: { tr: "Simülasyonu güçlü doğrusal olmayan etkilerle biz kurduk. Gerçek veride ilişki çoğunlukla ödeme geçmişinin “daha çok gecikme = daha çok risk” biçiminde; Modül 4'te kodları çözünce lojistik regresyon bunun çoğunu yakalamıştı.", en: "We built the simulation with strong nonlinear effects. In the real data the relationship is mostly “more delay = more risk” in the payment history; once the codes were decoded in Module 4, logistic regression captured most of it." } },
        code: { tr: TWM.tr + `\nfor ad, pr in p.items():\n    print(f"{ad:10s} test AUC {roc_auc_score(y_t, pr):.3f}")`, en: TWM.en + `\nfor name, pr in p.items():\n    print(f"{name:10s} test AUC {roc_auc_score(y_te, pr):.3f}")` },
        after: { tr: "Lojistik 0,762; tek ağaç 0,749; orman 0,778; boosting 0,773. Topluluklar kazanıyor ama fark yalnızca 0,01–0,02. Tek ağaç lojistik regresyonun bile gerisinde. Gerçek tablo verisinde iyi hazırlanmış basit bir model çoğu zaman güçlü bir rakiptir.", en: "Logistic 0.762; single tree 0.749; forest 0.778; boosting 0.773. The ensembles win, but by only 0.01–0.02. The single tree is even behind logistic regression. On real tabular data a well-prepared simple model is often a strong competitor." }
      },
      {
        id: "m5-u8-c2", kind: "run",
        task: { tr: "Modül 4'te ödeme kodlarını çözmek lojistik regresyonun AUC'sini 0,713'ten 0,762'ye çıkarmıştı. Rassal orman için aynı hazırlık ne kazandırır? Önce tahmin et.", en: "In Module 4 decoding the payment codes raised logistic regression's AUC from 0.713 to 0.762. What does the same preparation gain a random forest? Predict first." },
        predict: { q: { tr: "Orman ham kodlarla ve çözülmüş kodlarla nasıl karşılaştırılır?", en: "How does the forest compare with raw and decoded codes?" }, options: { tr: ["Çözülmüş kodlarla çok daha iyi", "Neredeyse aynı", "Ham kodlarla çalışmaz"], en: ["Much better with decoded codes", "Almost the same", "It does not work with raw codes"] }, answer: 1, explain: { tr: "Ağaç “pay_0 ≤ 0” ya da “pay_0 ≤ −1” gibi sorularla kategorileri kendisi ayırabilir; kodların sayı ölçeği olmaması onu rahatsız etmez.", en: "A tree can separate the categories itself with questions such as “pay_0 ≤ 0” or “pay_0 ≤ −1”; the codes not being a numeric scale does not bother it." } },
        code: { tr: D.TW.tr + `\nfor ad, X_e, X_t in [("ham kodlar", ham(egitim), ham(test)), ("çözülmüş kodlar", hazirla(egitim), hazirla(test))]:\n    lj = make_pipeline(StandardScaler(), LogisticRegression(C=1e6, max_iter=5000)).fit(X_e, y_e)\n    om = RandomForestClassifier(n_estimators=100, min_samples_leaf=20, max_samples=0.5, random_state=1).fit(X_e, y_e)\n    print(f"{ad:16s} lojistik {roc_auc_score(y_t, lj.predict_proba(X_t)[:, 1]):.3f}   orman {roc_auc_score(y_t, om.predict_proba(X_t)[:, 1]):.3f}")`, en: D.TW.en + `\nfor name, X_a, X_b in [("raw codes", raw(train), raw(test)), ("decoded codes", prepare(train), prepare(test))]:\n    lg = make_pipeline(StandardScaler(), LogisticRegression(C=1e6, max_iter=5000)).fit(X_a, y_tr)\n    fo = RandomForestClassifier(n_estimators=100, min_samples_leaf=20, max_samples=0.5, random_state=1).fit(X_a, y_tr)\n    print(f"{name:14s} logistic {roc_auc_score(y_te, lg.predict_proba(X_b)[:, 1]):.3f}   forest {roc_auc_score(y_te, fo.predict_proba(X_b)[:, 1]):.3f}")` },
        after: { tr: "Lojistik: 0,713 → 0,762. Orman: 0,778 → 0,777, fark yok. Ağaçların asıl avantajı burada: eşikleri ve kategorileri kendileri bulurlar, bu yüzden özellik hazırlığına daha az bağımlıdırlar. Lojistik regresyon için bu işi biz yapmak zorundayız.", en: "Logistic: 0.713 → 0.762. Forest: 0.778 → 0.777, no difference. Here is trees' real advantage: they find thresholds and categories themselves, so they depend less on feature preparation. For logistic regression we have to do that work ourselves." }
      },
      {
        id: "m5-u8-c3", kind: "audit",
        task: { tr: "YZ lojistik regresyon ile rassal ormanı karşılaştırdı. Hatalı satırı bul ve düzelt: iki model de aynı test verisiyle değerlendirilsin.", en: "The AI compared logistic regression with the random forest. Find the faulty line and fix it: both models should be evaluated on the same test data." },
        ai: {
          prompt: { tr: "Lojistik regresyon ile rassal ormanı karşılaştır; hangisi çok daha iyi?", en: "Compare logistic regression with the random forest; which is much better?" },
          reply: { tr: "İki modelin AUC'sini hesaplayalım:", en: "Let us compute the two models' AUCs:" },
          code: U8A,
          claim: { tr: "Rassal orman 0,857, lojistik regresyon 0,762: orman neredeyse 0,1 daha iyi; kredi kararlarında hemen ormana geçmeliyiz.", en: "Random forest 0.857, logistic regression 0.762: the forest is almost 0.1 better; we should switch credit decisions to the forest right away." }
        },
        bugLines: [ln(U8A.tr, "auc_orman = ")],
        lineExplain: { tr: "Ormanın AUC'si eğitim verisinde hesaplanmış; lojistiğinki test verisinde. Orman eğitim verisini kısmen ezberlediği için eğitim AUC'si iyimserdir. Karşılaştırma yalnızca aynı test verisiyle anlamlıdır.", en: "The forest's AUC was computed on the training data, logistic regression's on the test data. Because the forest partly memorises the training data, its training AUC is optimistic. A comparison is only meaningful on the same test data." },
        hints: [{ tr: "<code>auc_orman = roc_auc_score(y_t, p[\"orman\"])</code>", en: "<code>auc_forest = roc_auc_score(y_te, p[\"forest\"])</code>" }],
        solution: { tr: U8A.tr.replace(`auc_orman = roc_auc_score(y_e, orman.predict_proba(ham(egitim))[:, 1])`, `auc_orman = roc_auc_score(y_t, p["orman"])`), en: U8A.en.replace(`auc_forest = roc_auc_score(y_tr, forest.predict_proba(raw(train))[:, 1])`, `auc_forest = roc_auc_score(y_te, p["forest"])`) },
        checks: [{ py: { tr: "abs(auc_orman - roc_auc_score(y_t, p['orman'])) < 1e-9", en: "abs(auc_forest - roc_auc_score(y_te, p['forest'])) < 1e-9" }, msg: { tr: "Ormanın AUC'si test verisinde hesaplanmalı.", en: "The forest's AUC should be computed on the test data." } }],
        after: { tr: "Test verisinde orman 0,778: lojistikten 0,016 iyi, 0,1 değil. YZ'nin “hemen geçelim” önerisi eğitim–test karışıklığından çıkmıştı. Gerçek kararda küçük bir AUC kazancı; açıklanabilirlik, kararlılık ve bakım maliyetiyle birlikte tartılmalıdır.", en: "On the test data the forest gets 0.778: 0.016 better than logistic, not 0.1. The AI's “switch right away” came from mixing up training and test. In a real decision a small AUC gain must be weighed together with explainability, stability and maintenance cost." }
      },
      {
        id: "m5-u8-c4", kind: "run",
        task: { tr: "Boosting'in olasılıkları ne kadar güvenilir ve 5:1 maliyette (Modül 4) ne kazandırır? Kalibrasyon tablosuna ve kuramsal eşik 1/6'daki maliyete bakıyoruz. Önce tahmin et.", en: "How reliable are boosting's probabilities, and what does it gain at the 5:1 cost (Module 4)? We look at the calibration table and the cost at the theoretical threshold 1/6. Predict first." },
        predict: { q: { tr: "Boosting, 5:1 maliyette lojistik regresyona göre maliyeti ne kadar düşürür?", en: "At the 5:1 cost, how much does boosting lower the cost compared with logistic regression?" }, options: { tr: ["Yarıya indirir", "Biraz (yaklaşık %1)", "Artırır"], en: ["It halves it", "A little (about 1%)", "It raises it"] }, answer: 1, explain: { tr: "AUC farkı küçük olduğu için karar kalitesindeki fark da küçük.", en: "Because the AUC gap is small, the gap in decision quality is small too." } },
        code: { tr: TWM.tr + `\ngrup = pd.qcut(p["boosting"], 10, labels=range(1, 11))\nprint(pd.DataFrame({"öngörülen": p["boosting"], "gerçekleşen": y_t.values}).groupby(grup, observed=True).mean().round(3).T.to_string())\ndef maliyet(y, pr, esik, c_yn=5, c_yp=1):\n    karar = pr >= esik\n    return (c_yn * np.sum(~karar & (y == 1)) + c_yp * np.sum(karar & (y == 0))) / len(y)\nfor ad in ["lojistik", "boosting"]:\n    print(f"{ad:9s} eşik 1/6 maliyeti {maliyet(y_t.values, p[ad], 1 / 6):.3f}")\nprint(f"herkesi onayla      {maliyet(y_t.values, p['boosting'], 2):.3f}")`, en: TWM.en + `\ngroup = pd.qcut(p["boosting"], 10, labels=range(1, 11))\nprint(pd.DataFrame({"predicted": p["boosting"], "realised": y_te.values}).groupby(group, observed=True).mean().round(3).T.to_string())\ndef cost(y, pr, thr, c_fn=5, c_fp=1):\n    decision = pr >= thr\n    return (c_fn * np.sum(~decision & (y == 1)) + c_fp * np.sum(decision & (y == 0))) / len(y)\nfor name in ["logistic", "boosting"]:\n    print(f"{name:9s} cost at threshold 1/6 {cost(y_te.values, p[name], 1 / 6):.3f}")\nprint(f"approve everyone           {cost(y_te.values, p['boosting'], 2):.3f}")` },
        after: { tr: "Boosting'in olasılıkları iyi kalibre (en riskli grupta öngörülen %69,5, gerçekleşen %70,6). Maliyet: boosting 0,570, lojistik 0,576, herkesi onayla 1,106. Kazanç %1 civarında. 100.000 başvuruluk bir portföyde bu fark, kaçan temerrüt maliyetine göre anlamlı bir para olabilir; ama yine de ölçülerek savunulmalı.", en: "Boosting's probabilities are well calibrated (riskiest group: predicted 69.5%, realised 70.6%). Cost: boosting 0.570, logistic 0.576, approve everyone 1.106. The gain is about 1%. In a portfolio of 100,000 applications this gap may be meaningful money, depending on the cost of a missed default; but it must still be argued with measurements." }
      },
      {
        id: "m5-u8-c5", kind: "interpret",
        task: { tr: "YZ sonuçları bir kredi komitesi notuna çevirdi. Hangi cümleler yanlış?", en: "The AI turned the results into a note for the credit committee. Which sentences are wrong?" },
        prompt: { tr: "Test AUC: lojistik 0,762, ağaç 0,749, orman 0,778, boosting 0,773; 5:1 maliyette boosting 0,570, lojistik 0,576. Bir paragraf yazar mısın?", en: "Test AUC: logistic 0.762, tree 0.749, forest 0.778, boosting 0.773; at 5:1 cost boosting 0.570, logistic 0.576. Can you write a paragraph?" },
        sentences: {
          tr: ["Topluluk modelleri lojistik regresyona göre küçük ama tutarlı bir kazanç sağlıyor.", "Tek ağaç en kolay okunan model, ama burada en zayıf olanı.", "Orman ve boosting arasındaki 0,005'lik fark, ormanın kesin olarak daha iyi olduğunu kanıtlar.", "Ağaç modelleri korunan özellikleri kullanmadığı için gruplar arasında hata oranlarını ölçmeye gerek yoktur."],
          en: ["The ensemble models provide a small but consistent gain over logistic regression.", "The single tree is the easiest model to read, but here it is the weakest.", "The 0.005 gap between the forest and boosting proves that the forest is definitely better.", "Since the tree models do not use protected attributes, there is no need to measure error rates across groups."]
        },
        bad: [2, 3],
        explain: {
          tr: ["Doğru.", "Doğru.", "<b>Yanlış:</b> 9.000 test gözleminde 0,005'lik bir fark başka bir bölme ya da tohumla yer değiştirebilir. Bu kadar küçük farklar için belirsizlik ölçülmeli (örneğin çapraz doğrulamayla).", "<b>Yanlış:</b> ağaçlar etkileşimleri kendiliğinden yakaladığı için vekil değişkenlerden korunan özelliklerin izini lojistik regresyondan bile daha kolay sürebilir. Adillik ayrıca ölçülmelidir."],
          en: ["Correct.", "Correct.", "<b>Wrong:</b> on 9,000 test observations a 0.005 gap may reverse with another split or seed. For such small gaps the uncertainty must be measured (for example by cross-validation).", "<b>Wrong:</b> because trees capture interactions on their own, they may trace protected attributes through proxy variables even more easily than logistic regression. Fairness must be measured separately."]
        }
      }
    ],
    quiz: [
      { q: { tr: "Ağaçlar neden özellik hazırlığına daha az bağımlıdır?", en: "Why do trees depend less on feature preparation?" }, options: { tr: ["Eşikleri ve kategorileri sorularla kendileri bulurlar", "Daha çok veri kullandıkları için", "Ölçekleme yaptıkları için"], en: ["They find thresholds and categories themselves through questions", "Because they use more data", "Because they scale the data"] }, answer: 0, explain: { tr: "Orman ham ve çözülmüş kodlarla aynı AUC'yi aldı.", en: "The forest got the same AUC with raw and decoded codes." } },
      { q: { tr: "Modeller hangi veriyle karşılaştırılmalı?", en: "On which data should models be compared?" }, options: { tr: ["Aynı test verisiyle", "Her biri kendi eğitim verisiyle", "Fark etmez"], en: ["The same test data", "Each on its own training data", "It does not matter"] }, answer: 0, explain: { tr: "Eğitim AUC'si ezberi de ölçer.", en: "Training AUC also measures memorisation." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 9 — Colab + Gemini atölyesi                                       */
  /* =================================================================== */
  const NB = { tr: "modul5/09_agaclar_shap_atolyesi_tr.ipynb", en: "module5/09_trees_shap_workshop_en.ipynb" };
  U.push({
    id: "m5-u9", minutes: 50,
    title: { tr: "Colab + Gemini atölyesi: boosting ve SHAP", en: "Colab + Gemini workshop: boosting and SHAP" },
    blurb: { tr: "Tayvan verisiyle bir boosting modeli kur, ağaç sayısını eğitim verisinde seç, sonra SHAP kütüphanesiyle modeli açıkla. Kodu Gemini yazar, sen denetlersin.", en: "With the Taiwan data, build a boosting model, choose the number of trees on the training data, then explain the model with the SHAP library. Gemini writes the code, you audit it." },
    terms: [{ tr: "shap.TreeExplainer", en: "shap.TreeExplainer" }, { tr: "cross_val_score", en: "cross_val_score" }],
    concept: {
      tr: `<p>Bu atölyede modülün iki büyük fikrini gerçek veriyle birleştireceksin: iyi ayarlanmış bir topluluk modeli ve onu açıklayan SHAP değerleri. Notebook, Tayvan kart müşterileri verisini bu sitenin GitHub deposundan indirir; SHAP kütüphanesi Colab'da yoksa kurulum hücresi yükler.</p>
<p><b>Görevler</b></p>
<ol>
<li><b>Görev A — Boosting:</b> Veriyi Modül 4'teki gibi böl; <code>sex</code>, <code>marriage</code> ve <code>default</code> dışındaki ham sütunları kullan. <code>HistGradientBoostingClassifier(learning_rate=0.05, max_leaf_nodes=8, early_stopping=False, random_state=1)</code> için ağaç sayısını (<code>max_iter</code>: 100, 200, 400, 800) eğitim verisinde 5 katlı çapraz doğrulamayla seç; test AUC'sini lojistik regresyonun 0,762'siyle karşılaştır.</li>
<li><b>Görev B — SHAP:</b> İlk 2.000 test müşterisi için <code>shap.TreeExplainer</code> ile SHAP değerlerini hesapla; toplama özelliğini sına; değişkenleri ortalama |SHAP| değerine göre sırala ve en önemli değişkenin bağımlılık grafiğini çiz.</li>
</ol>
<div class="box"><b>Gemini'nin sık yaptığı hatalar:</b> cinsiyet ve medeni durumu modele almak; ağaç sayısını test verisinde seçmek; <code>early_stopping</code>'i açık bırakıp seçimi gizlice başka bir veriyle yapmak; SHAP değerlerini olasılık puanı diye yorumlamak; SHAP önemini nedensel etki gibi anlatmak. Kontrol hücreleri hesap hatalarını yakalar; yorum hataları senin denetimine kalıyor.</div>
<p>Colab ve Gemini'yi kullanma kuralları Modül 0'daki atölyeyle aynı.</p>`,
      en: `<p>In this workshop you combine the module's two big ideas with real data: a well-tuned ensemble model and the SHAP values that explain it. The notebook downloads the Taiwanese card customers data from this site's GitHub repository; if the SHAP library is missing in Colab, the setup cell installs it.</p>
<p><b>Tasks</b></p>
<ol>
<li><b>Task A — Boosting:</b> split the data as in Module 4; use the raw columns except <code>sex</code>, <code>marriage</code> and <code>default</code>. For <code>HistGradientBoostingClassifier(learning_rate=0.05, max_leaf_nodes=8, early_stopping=False, random_state=1)</code>, choose the number of trees (<code>max_iter</code>: 100, 200, 400, 800) by 5-fold cross-validation on the training data; compare the test AUC with logistic regression's 0.762.</li>
<li><b>Task B — SHAP:</b> compute SHAP values with <code>shap.TreeExplainer</code> for the first 2,000 test customers; test the additivity property; rank the variables by mean |SHAP| and draw the dependence plot of the most important variable.</li>
</ol>
<div class="box"><b>Mistakes Gemini often makes:</b> putting sex and marital status in the model; choosing the number of trees on the test data; leaving <code>early_stopping</code> on and quietly making the choice with other data; interpreting SHAP values as probability points; describing SHAP importance as a causal effect. The check cells catch computational errors; interpretation errors are left to your audit.</div>
<p>The rules for using Colab and Gemini are the same as in the Module 0 workshop.</p>`
    },
    playground: null,
    cells: [
      {
        id: "m5-u9-c1", kind: "prompt",
        task: { tr: "Görev A için Gemini'ye vereceğin isteği burada hazırla. Notebook'ta <code>kredi</code> tablosu hazır; hedef sütunu <code>default</code>.", en: "Prepare the prompt for Task A here. The notebook has the <code>credit</code> table ready; the target column is <code>default</code>." },
        weak: {
          prompt: { tr: "Kredi temerrüdü için en iyi boosting modelini kur.", en: "Build the best boosting model for credit default." },
          reply: { tr: "Ağaç sayısını test verisinde deneyerek seçelim:", en: "Let us choose the number of trees by trying them on the test data:" },
          code: { tr: "X = kredi.drop(columns=[\"default\"])\nX_e, X_t, y_e, y_t = train_test_split(X, kredi[\"default\"], test_size=0.3)\nfor n in [100, 200, 400, 800]:\n    m = HistGradientBoostingClassifier(max_iter=n).fit(X_e, y_e)\n    print(n, roc_auc_score(y_t, m.predict_proba(X_t)[:, 1]))", en: "X = credit.drop(columns=[\"default\"])\nX_e, X_t, y_e, y_t = train_test_split(X, credit[\"default\"], test_size=0.3)\nfor n in [100, 200, 400, 800]:\n    m = HistGradientBoostingClassifier(max_iter=n).fit(X_e, y_e)\n    print(n, roc_auc_score(y_t, m.predict_proba(X_t)[:, 1]))" },
          claim: { tr: "En iyi model 200 ağaçlı; test AUC'si yeni verideki başarıyı gösteriyor.", en: "The best model has 200 trees; its test AUC shows the success on new data." }
        },
        checklist: [
          { label: { tr: "Bölme ayrıntıları", en: "Split details" }, why: { tr: "test_size=0.3, random_state=0, stratify; tablo adları egitim ve test.", en: "test_size=0.3, random_state=0, stratify; table names train and test." }, re: { tr: "random_state|stratify|tabakalı", en: "random_state|stratif" } },
          { label: { tr: "Korunan özellikler", en: "Protected attributes" }, why: { tr: "sex ve marriage modele girmesin.", en: "sex and marriage must not enter the model." }, re: { tr: "sex|marriage|cinsiyet|medeni", en: "sex|marriage|marital" } },
          { label: { tr: "Ağaç sayısını eğitimde seçmek", en: "Choosing the number of trees on training" }, why: { tr: "max_iter adayları 5 katlı cross_val_score ile yalnızca eğitim verisinde karşılaştırılsın; early_stopping kapalı.", en: "The max_iter candidates are compared by 5-fold cross_val_score on the training data only; early_stopping off." }, re: { tr: "cross_val|çapraz doğrulama|early_stopping", en: "cross_val|cross-validation|early_stopping" } },
          { label: { tr: "Doğru ölçü ve sabit tohum", en: "The right metric and a fixed seed" }, why: { tr: "scoring=\"roc_auc\", predict_proba ile test AUC; random_state=1.", en: "scoring=\"roc_auc\", test AUC with predict_proba; random_state=1." }, re: { tr: "roc_auc|predict_proba", en: "roc_auc|predict_proba" } }
        ],
        minLen: 120,
        strong: { prompt: { tr: "kredi adlı pandas tablosunu train_test_split(kredi, test_size=0.3, random_state=0, stratify=kredi[\"default\"]) ile egitim ve test olarak böl. Özellikler X_e ve X_t: default, sex ve marriage dışındaki bütün sütunlar (ham hâlleriyle). HistGradientBoostingClassifier(learning_rate=0.05, max_leaf_nodes=8, early_stopping=False, random_state=1) için max_iter değerlerini [100, 200, 400, 800] yalnızca eğitim verisinde cross_val_score(..., cv=5, scoring=\"roc_auc\") ortalamasıyla karşılaştır; en iyisini secilen_n değişkenine ata. Modeli bu değerle egitim verisinin tamamında kurup model değişkenine ata. Test olasılıklarını predict_proba(...)[:, 1] ile p_test'e, test AUC'sini auc_test'e ata. Test verisini seçim için kullanma.", en: "Split the pandas table credit into train and test with train_test_split(credit, test_size=0.3, random_state=0, stratify=credit[\"default\"]). Features X_tr and X_te: every column except default, sex and marriage (in raw form). For HistGradientBoostingClassifier(learning_rate=0.05, max_leaf_nodes=8, early_stopping=False, random_state=1), compare the max_iter values [100, 200, 400, 800] by the mean of cross_val_score(..., cv=5, scoring=\"roc_auc\") on the training data only; store the best in n_chosen. Fit the model with this value on all of the training data and store it in model. Store the test probabilities from predict_proba(...)[:, 1] in p_test and the test AUC in auc_test. Do not use the test data for the choice." } }
      },
      {
        id: "m5-u9-c2", kind: "colab",
        task: { tr: "<b>Görev A — Boosting.</b> Notebook'u aç, hazırladığın istekle <code>egitim</code>, <code>test</code>, <code>X_e</code>, <code>X_t</code>, <code>secilen_n</code>, <code>model</code>, <code>p_test</code> ve <code>auc_test</code> değişkenlerini oluştur, kontrol hücresini çalıştır ve verdiği kodu buraya yapıştır.", en: "<b>Task A — Boosting.</b> Open the notebook, create <code>train</code>, <code>test</code>, <code>X_tr</code>, <code>X_te</code>, <code>n_chosen</code>, <code>model</code>, <code>p_test</code> and <code>auc_test</code> with the prompt you prepared, run the check cell and paste the code it gives you here." },
        notebook: NB,
        steps: {
          tr: ["Notebook'u aç ve <b>Kurulum</b> hücresini çalıştır (veri indirilir, gerekirse <code>shap</code> kurulur).", "<b>Görev A</b> hücresinde Gemini'ye isteğini ver.", "Kodu denetle: sex ve marriage dışarıda mı? Ağaç sayısı eğitim verisinde mi seçiliyor? <code>early_stopping=False</code> mı?", "<b>Kontrol A</b> hücresini çalıştır; geçerse <code>ML5-…</code> kodunu yapıştır."],
          en: ["Open the notebook and run the <b>Setup</b> cell (the data are downloaded, <code>shap</code> is installed if needed).", "In the <b>Task A</b> cell, give Gemini your prompt.", "Audit the code: are sex and marriage left out? Is the number of trees chosen on the training data? Is <code>early_stopping=False</code>?", "Run the <b>Check A</b> cell; if it passes, paste the <code>ML5-…</code> code."]
        },
        codeHashes: ["4e65deb2"]
      },
      {
        id: "m5-u9-c3", kind: "colab",
        task: { tr: "<b>Görev B — SHAP.</b> Gemini ile ilk 2.000 test müşterisinin SHAP değerlerini (<code>sv</code>), taban değeri (<code>taban</code>) ve ortalama |SHAP| sıralamasını (<code>onem</code>) hesaplat, kontrol hücresini çalıştır ve kodu buraya yapıştır.", en: "<b>Task B — SHAP.</b> Have Gemini compute the SHAP values (<code>sv</code>), the base value (<code>base</code>) and the mean |SHAP| ranking (<code>importance</code>) for the first 2,000 test customers, run the check cell and paste the code here." },
        notebook: NB,
        steps: {
          tr: ["<b>Görev B</b> hücresinde Gemini'den iste: <code>ex = shap.TreeExplainer(model)</code>, <code>sv = ex.shap_values(X_t.iloc[:2000])</code>, <code>taban</code>, <code>onem</code> (sütun adlarıyla, büyükten küçüğe sıralı bir pandas Series).", "Toplama özelliğini sına: <code>taban + sv.sum(1)</code> ile <code>model.decision_function(X_t.iloc[:2000])</code> aynı mı?", "En önemli değişken için <code>shap.dependence_plot</code> çizdir ve yorumla.", "<b>Kontrol B</b> hücresini çalıştır ve kodu buraya yapıştır."],
          en: ["In the <b>Task B</b> cell, ask Gemini for: <code>ex = shap.TreeExplainer(model)</code>, <code>sv = ex.shap_values(X_te.iloc[:2000])</code>, <code>base</code>, <code>importance</code> (a pandas Series with the column names, sorted from largest to smallest).", "Test additivity: are <code>base + sv.sum(1)</code> and <code>model.decision_function(X_te.iloc[:2000])</code> the same?", "Have it draw <code>shap.dependence_plot</code> for the most important variable and interpret it.", "Run the <b>Check B</b> cell and paste the code here."]
        },
        codeHashes: ["9469b6d4"],
        after: { tr: "SHAP sana modelin hangi değişkenlere dayandığını gösterdi. Ama hatırla: bu, modelin bir betimlemesidir; gecikmeyi önlemenin temerrüdü önleyeceği anlamına gelmez ve korunan özelliklerin izini taşıyan değişkenleri ayrıca denetlemen gerekir.", en: "SHAP showed you which variables the model relies on. But remember: this is a description of the model; it does not mean that preventing delays will prevent default, and you must separately audit variables that may carry traces of protected attributes." }
      },
      {
        id: "m5-u9-c4", kind: "auditlog",
        task: { tr: "Atölyeyi bir denetim notuyla kapat.", en: "Close the workshop with an audit note." },
        fields: {
          tr: [
            { label: "Gemini ağaç sayısını nasıl seçti? Değiştirmen gerekti mi?", help: "Test verisi, early_stopping, korunan özellikler", ph: "Örnek: Gemini önce adayları test verisinde karşılaştırmıştı…" },
            { label: "Boosting lojistik regresyona göre ne kazandırdı?", help: "Test AUC farkı; bu farkın büyüklüğü bir kararı değiştirir mi?", ph: "Örnek: test AUC 0,773, lojistik 0,762…" },
            { label: "SHAP sonuçlarını bir kredi komitesine nasıl anlatırsın?", help: "En önemli değişkenler, log-odds ölçeği, nedensellik değil, adillik", ph: "Örnek: modelin en çok dayandığı değişken Eylül ödeme durumu…" }
          ],
          en: [
            { label: "How did Gemini choose the number of trees? Did you need to change anything?", help: "Test data, early_stopping, protected attributes", ph: "Example: Gemini first compared the candidates on the test data…" },
            { label: "What did boosting gain over logistic regression?", help: "Test AUC gap; would a gap of this size change a decision?", ph: "Example: test AUC 0.773, logistic 0.762…" },
            { label: "How would you explain the SHAP results to a credit committee?", help: "Most important variables, log-odds scale, not causality, fairness", ph: "Example: the variable the model relies on most is the September payment status…" }
          ]
        }
      }
    ],
    quiz: [
      { q: { tr: "<code>early_stopping</code> açık bırakılırsa ne olur?", en: "What happens if <code>early_stopping</code> is left on?" }, options: { tr: ["Model ağaç sayısını eğitim verisinden ayırdığı bir parçayla kendi seçer; bizim seçimimiz geçersizleşir", "Hiçbir şey", "Test AUC'si iki katına çıkar"], en: ["The model chooses the number of trees itself with a part it sets aside from the training data; our choice is overridden", "Nothing", "Test AUC doubles"] }, answer: 0, explain: { tr: "21.000 gözlemde varsayılan olarak açıktır.", en: "It is on by default with 21,000 observations." } },
      { q: { tr: "SHAP'in toplama özelliği bu modelde hangi ölçekte geçerlidir?", en: "On which scale does SHAP's additivity hold in this model?" }, options: { tr: ["Log-odds (decision_function)", "Olasılık", "AUC"], en: ["Log-odds (decision_function)", "Probability", "AUC"] }, answer: 0, explain: { tr: "taban + katkılar = log-odds.", en: "base + contributions = log-odds." } }
    ]
  });
})();
