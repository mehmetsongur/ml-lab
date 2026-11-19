/* Modül 4 — Sınıflandırma ve kredi riski · Üniteler 5–9
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 * "Örnek YZ yanıtları" öğretim amacıyla hazırlanmıştır.
 */
(function () {
  "use strict";
  const D = window.M4_DATA, U = window.M4_UNITS, ln = D.line;
  const W = D.CREDIT, WM = { tr: D.CREDIT.tr + D.MODEL.tr, en: D.CREDIT.en + D.MODEL.en };
  const PK = ["numpy", "scikit-learn"], PKI = ["numpy", "pandas", "scikit-learn"];
  const C0 = { tr: "", en: "" };
  const FILES = D.FILES;

  /* =================================================================== */
  /* Ünite 5 — ROC eğrisi ve AUC                                            */
  /* =================================================================== */
  const U5A = { tr: WM.tr + `\nauc = roc_auc_score(y_tst, logit.predict(X_tst))\nprint("AUC:", round(auc, 3))`, en: WM.en + `\nauc = roc_auc_score(y_te, logit.predict(X_te))\nprint("AUC:", round(auc, 3))` };
  U.push({
    id: "m4-u5", minutes: 25, packages: PK,
    title: { tr: "ROC eğrisi ve AUC", en: "The ROC curve and AUC" },
    blurb: { tr: "Bütün eşikleri tek bir eğride görmek. AUC, modelin sıralama gücüdür: eşikten bağımsızdır ama hangi eşiğin seçileceğini söylemez.", en: "Seeing every threshold on one curve. AUC is the model's ranking power: it does not depend on the threshold, but it does not say which threshold to choose." },
    terms: [{ tr: "ROC eğrisi", en: "ROC curve" }, { tr: "AUC", en: "AUC" }, { tr: "yanlış pozitif oranı", en: "false positive rate" }],
    concept: C0,
    playground: { type: "rocPlay", intro: { tr: "Eşiği kaydır ve ROC eğrisi üzerinde nerede durduğuna bak. Güçlü ve zayıf modeli karşılaştır.", en: "Slide the threshold and see where you stand on the ROC curve. Compare the strong and the weak model." }, takeaway: { tr: "Her eşik eğri üzerinde bir noktadır. Eğrinin altındaki alan, modelin iki grubu ne kadar iyi ayırdığını özetler.", en: "Every threshold is a point on the curve. The area under the curve summarises how well the model separates the two groups." } },
    cells: [
      {
        id: "m4-u5-c1", kind: "run",
        task: { tr: "Üç “model”in AUC'sini karşılaştırıyoruz: altı özellikli lojistik regresyon, yalnızca gelir ve yaşla kurulan zayıf bir model ve gerçek olasılıklar (bunları yalnızca simülasyonda biliyoruz). Önce tahmin et.", en: "We compare the AUC of three “models”: the six-feature logistic regression, a weak model built only on income and age, and the true probabilities (which we only know in a simulation). Predict first." },
        predict: { q: { tr: "Altı özellikli model, gerçek olasılıkların AUC'sine ne kadar yaklaşır?", en: "How close does the six-feature model get to the AUC of the true probabilities?" }, options: { tr: ["Çok uzak kalır (0,6 civarı)", "Neredeyse aynı (fark 0,01'den az)", "Gerçek olasılıkları geçer"], en: ["Far behind (around 0.6)", "Almost the same (gap under 0.01)", "It beats the true probabilities"] }, answer: 1, explain: { tr: "Model doğru biçimde kurulmuş (doğru değişkenler, lojistik biçim) ve 3.000 gözlem var: sıralama gücü neredeyse gerçek olasılıklarınki kadar.", en: "The model is correctly specified (right variables, logistic form) and there are 3,000 observations: its ranking power is almost that of the true probabilities." } },
        code: { tr: WM.tr + `\nzayif = LogisticRegression(C=1e6, max_iter=2000).fit(X_egt[:, [2, 5]], y_egt)\np_zayif = zayif.predict_proba(X_tst[:, [2, 5]])[:, 1]\nprint("AUC, altı özellik       :", round(roc_auc_score(y_tst, p_hat), 3))\nprint("AUC, yalnızca gelir+yaş :", round(roc_auc_score(y_tst, p_zayif), 3))\nprint("AUC, gerçek olasılıklar :", round(roc_auc_score(y_tst, p_gercek), 3))`, en: WM.en + `\nweak = LogisticRegression(C=1e6, max_iter=2000).fit(X_tr[:, [2, 5]], y_tr)\np_weak = weak.predict_proba(X_te[:, [2, 5]])[:, 1]\nprint("AUC, six features       :", round(roc_auc_score(y_te, p_hat), 3))\nprint("AUC, income+age only    :", round(roc_auc_score(y_te, p_weak), 3))\nprint("AUC, true probabilities :", round(roc_auc_score(y_te, p_true), 3))` },
        after: { tr: "0,822; 0,644; 0,823. Gerçek olasılıklar bile 1'e ulaşmıyor: temerrüt kısmen şansa bağlı, hiçbir model onu kusursuz öngöremez. AUC'nin tavanı problemin kendisinde gizli.", en: "0.822; 0.644; 0.823. Even the true probabilities do not reach 1: default is partly down to chance and no model can predict it perfectly. The ceiling on AUC lies in the problem itself." }
      },
      {
        id: "m4-u5-c2", kind: "audit",
        task: { tr: "YZ modelin AUC'sini hesapladı. Hatalı satırı bul ve düzelt: AUC, temerrüt olasılıklarıyla hesaplansın.", en: "The AI computed the model's AUC. Find the faulty line and fix it: AUC should be computed from the default probabilities." },
        ai: {
          prompt: { tr: "Modelin test verisinde AUC'sini hesapla.", en: "Compute the model's AUC on the test data." },
          reply: { tr: "AUC şöyle:", en: "Here is the AUC:" },
          code: U5A,
          claim: { tr: "AUC 0,57: model yazı turadan pek iyi değil, temerrüdü öngöremiyor.", en: "AUC is 0.57: the model is not much better than a coin toss and cannot predict default." }
        },
        bugLines: [ln(U5A.tr, "auc = roc_auc_score")],
        lineExplain: { tr: "<code>predict()</code> eşik 0,5'te kesilmiş 0/1 kararlar verir; AUC'nin sıralayabileceği bir şey kalmaz ve ROC eğrisi tek bir noktaya iner. AUC olasılıklarla hesaplanır: <code>predict_proba(...)[:, 1]</code> (burada hazır olan <code>p_hat</code>).", en: "<code>predict()</code> gives 0/1 decisions cut at threshold 0.5; nothing is left for AUC to rank and the ROC curve collapses to a single point. AUC is computed from probabilities: <code>predict_proba(...)[:, 1]</code> (here the ready-made <code>p_hat</code>)." },
        hints: [{ tr: "<code>auc = roc_auc_score(y_tst, p_hat)</code>", en: "<code>auc = roc_auc_score(y_te, p_hat)</code>" }],
        solution: { tr: U5A.tr.replace("roc_auc_score(y_tst, logit.predict(X_tst))", "roc_auc_score(y_tst, p_hat)"), en: U5A.en.replace("roc_auc_score(y_te, logit.predict(X_te))", "roc_auc_score(y_te, p_hat)") },
        checks: [{ py: { tr: "abs(auc - roc_auc_score(y_tst, p_hat)) < 1e-9", en: "abs(auc - roc_auc_score(y_te, p_hat)) < 1e-9" }, msg: { tr: "AUC olasılıklarla (<code>p_hat</code>) hesaplanmalı.", en: "AUC should be computed from the probabilities (<code>p_hat</code>)." } }],
        after: { tr: "Doğru AUC 0,822. YZ'nin 0,57'si, olasılıkları 0/1'e çevirip bilginin çoğunu atmasından geliyordu. “Model işe yaramıyor” sonucu bir kod hatasından çıkmıştı.", en: "The right AUC is 0.822. The AI's 0.57 came from turning the probabilities into 0/1 and throwing away most of the information. The conclusion “the model is useless” came from a coding error." }
      },
      {
        id: "m4-u5-c3", kind: "fill",
        task: { tr: "Eşik 0,2'nin ROC eğrisindeki noktasını hesapla: dikey eksen duyarlılık, yatay eksen yanlış pozitif oranı (ödeyenlerin ne kadarı yanlışlıkla reddedildi).", en: "Compute the point of threshold 0.2 on the ROC curve: the vertical axis is recall, the horizontal axis is the false positive rate (what share of payers were wrongly rejected)." },
        code: { tr: WM.tr + `\nm = olcu(y_tst, p_hat, 0.2)\nyp_orani = m["YP"] / (m["YP"] + ___)\nprint(f"ROC noktası: (yanlış pozitif oranı {yp_orani:.3f}, duyarlılık {m['duyarlılık']:.3f})")`, en: WM.en + `\nm = metrics(y_te, p_hat, 0.2)\nfp_rate = m["FP"] / (m["FP"] + ___)\nprint(f"ROC point: (false positive rate {fp_rate:.3f}, recall {m['recall']:.3f})")` },
        solution: { tr: WM.tr + `\nm = olcu(y_tst, p_hat, 0.2)\nyp_orani = m["YP"] / (m["YP"] + m["DN"])\nprint(f"ROC noktası: (yanlış pozitif oranı {yp_orani:.3f}, duyarlılık {m['duyarlılık']:.3f})")`, en: WM.en + `\nm = metrics(y_te, p_hat, 0.2)\nfp_rate = m["FP"] / (m["FP"] + m["TN"])\nprint(f"ROC point: (false positive rate {fp_rate:.3f}, recall {m['recall']:.3f})")` },
        hints: [{ tr: "Payda: bütün ödeyenler = YP + DN. Yanlış pozitif oranı = 1 − özgüllük.", en: "Denominator: all payers = FP + TN. False positive rate = 1 − specificity." }],
        checks: [{ py: { tr: "abs(yp_orani - (1 - m['özgüllük'])) < 1e-12", en: "abs(fp_rate - (1 - m['specificity'])) < 1e-12" }, msg: { tr: "<code>yp_orani</code> = YP / (YP + DN) olmalı.", en: "<code>fp_rate</code> should be FP / (FP + TN)." } }],
        after: { tr: "Nokta (0,119; 0,537): ödeyenlerin %12'sini reddetme pahasına temerrüdlerin %54'ünü yakalıyoruz. Eşiği değiştirmek eğri boyunca yürümektir; eğrinin kendisini ancak daha iyi bir model değiştirir.", en: "The point is (0.119, 0.537): we catch 54% of defaults at the price of rejecting 12% of payers. Changing the threshold means walking along the curve; only a better model changes the curve itself." }
      },
      {
        id: "m4-u5-c4", kind: "interpret",
        task: { tr: "YZ AUC'yi yorumladı. Hangi cümleler yanlış?", en: "The AI interpreted the AUC. Which sentences are wrong?" },
        prompt: { tr: "Modelin AUC'si 0,82. Bu ne demek?", en: "The model's AUC is 0.82. What does that mean?" },
        sentences: {
          tr: ["Rastgele seçilen bir temerrütçüye, rastgele seçilen bir ödeyenden daha yüksek olasılık verme şansı yaklaşık %82.", "Model kararların %82'sinde haklı çıkar.", "AUC eşikten bağımsız olduğu için bize hangi eşiği kullanacağımızı da söyler.", "AUC 0,5 olan bir model, yazı tura atmaktan iyi sıralama yapmaz."],
          en: ["The chance that a randomly chosen defaulter gets a higher probability than a randomly chosen payer is about 82%.", "The model is right in 82% of its decisions.", "Because AUC does not depend on the threshold, it also tells us which threshold to use.", "A model with an AUC of 0.5 ranks no better than tossing a coin."]
        },
        bad: [1, 2],
        explain: {
          tr: ["Doğru: AUC'nin sıralama yorumu budur.", "<b>Yanlış:</b> bu doğruluktur ve eşiğe bağlıdır. AUC bir sıralama ölçüsüdür.", "<b>Yanlış:</b> eşikten bağımsız olması, eşik hakkında bir şey söylemediği anlamına gelir. Eşiği hataların maliyeti belirler (Ünite 6).", "Doğru."],
          en: ["Correct: this is the ranking interpretation of AUC.", "<b>Wrong:</b> that is accuracy, and it depends on the threshold. AUC is a ranking measure.", "<b>Wrong:</b> not depending on the threshold means it says nothing about the threshold. The cost of errors decides the threshold (Unit 6).", "Correct."]
        }
      }
    ],
    quiz: [
      { q: { tr: "ROC eğrisinin eksenleri nelerdir?", en: "What are the ROC curve's axes?" }, options: { tr: ["Yatay: yanlış pozitif oranı; dikey: duyarlılık", "Yatay: eşik; dikey: doğruluk", "Yatay: kesinlik; dikey: duyarlılık"], en: ["Horizontal: false positive rate; vertical: recall", "Horizontal: threshold; vertical: accuracy", "Horizontal: precision; vertical: recall"] }, answer: 0, explain: { tr: "Her eşik bir (YPO, duyarlılık) noktası verir.", en: "Each threshold gives an (FPR, recall) point." } },
      { q: { tr: "AUC neden <code>predict()</code> çıktısıyla hesaplanmamalı?", en: "Why should AUC not be computed from <code>predict()</code> output?" }, options: { tr: ["0/1 kararlar sıralama bilgisini atar", "predict() yavaştır", "predict() olasılıkları 100 ile çarpar"], en: ["0/1 decisions throw away ranking information", "predict() is slow", "predict() multiplies probabilities by 100"] }, answer: 0, explain: { tr: "AUC olasılıklarla hesaplanır.", en: "AUC is computed from probabilities." } },
      { q: { tr: "Eşiği değiştirmek ROC eğrisini değiştirir mi?", en: "Does changing the threshold change the ROC curve?" }, options: { tr: ["Hayır, eğri üzerinde başka bir noktaya geçeriz", "Evet, eğri yukarı kayar", "Evet, AUC artar"], en: ["No, we move to another point on the curve", "Yes, the curve shifts up", "Yes, AUC rises"] }, answer: 0, explain: { tr: "Eğriyi yalnızca model değiştirir.", en: "Only the model changes the curve." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 6 — Eşiği maliyet belirler                                        */
  /* =================================================================== */
  const MAL = { tr: `\ndef maliyet(y, p, esik, c_yn=10, c_yp=1):         # başvuru başına ortalama maliyet\n    m = olcu(y, p, esik)\n    return (c_yn * m["YN"] + c_yp * m["YP"]) / len(y)`, en: `\ndef cost(y, p, thr, c_fn=10, c_fp=1):             # average cost per application\n    m = metrics(y, p, thr)\n    return (c_fn * m["FN"] + c_fp * m["FP"]) / len(y)` };
  const WMC = { tr: WM.tr + MAL.tr, en: WM.en + MAL.en };
  const U6A = { tr: WMC.tr + `\nfrom sklearn.model_selection import cross_val_predict\np_cv = cross_val_predict(LogisticRegression(C=1e6, max_iter=2000), X_egt, y_egt, cv=5, method="predict_proba")[:, 1]\nesikler = np.round(np.arange(0.02, 0.61, 0.01), 2)\nmaliyetler = [maliyet(y_tst, p_hat, e) for e in esikler]\nesik = esikler[np.argmin(maliyetler)]\nprint("Seçilen eşik:", esik, "| test maliyeti:", round(maliyet(y_tst, p_hat, esik), 3))`, en: WMC.en + `\nfrom sklearn.model_selection import cross_val_predict\np_cv = cross_val_predict(LogisticRegression(C=1e6, max_iter=2000), X_tr, y_tr, cv=5, method="predict_proba")[:, 1]\nthresholds = np.round(np.arange(0.02, 0.61, 0.01), 2)\ncosts = [cost(y_te, p_hat, e) for e in thresholds]\nthr = thresholds[np.argmin(costs)]\nprint("Chosen threshold:", thr, "| test cost:", round(cost(y_te, p_hat, thr), 3))` };
  U.push({
    id: "m4-u6", minutes: 30, packages: PK,
    title: { tr: "Eşiği maliyet belirler", en: "Cost decides the threshold" },
    blurb: { tr: "Kaçan bir temerrüt, reddedilen bir iyi müşteriden çok daha pahalıysa eşik 0,5 olmamalı. Eşiği eğitim verisiyle seçmek ve kuramsal eşik.", en: "If a missed default is much more expensive than a rejected good customer, the threshold should not be 0.5. Choosing the threshold with training data, and the theoretical threshold." },
    terms: [{ tr: "maliyet matrisi", en: "cost matrix" }, { tr: "beklenen maliyet", en: "expected cost" }, { tr: "kuramsal eşik", en: "theoretical threshold" }],
    concept: C0,
    playground: { type: "costThreshold", intro: { tr: "Bir temerrüdün maliyetini (iyi bir müşteriyi reddetmenin kaç katı?) değiştir ve en düşük maliyetli eşiğin nasıl kaydığına bak.", en: "Change the cost of a default (how many times the cost of rejecting a good customer?) and watch the lowest-cost threshold move." }, takeaway: { tr: "Temerrüt pahalılaştıkça en iyi eşik düşer. Olasılıklar doğruysa en iyi eşik yaklaşık 1 / (1 + k)'dır; k, kaçan bir temerrüdün reddedilen iyi müşteriye göre maliyetidir.", en: "As default becomes more expensive the best threshold falls. If the probabilities are right, the best threshold is about 1 / (1 + k), where k is the cost of a missed default relative to a rejected good customer." } },
    cells: [
      {
        id: "m4-u6-c1", kind: "run",
        task: { tr: "Bir temerrüdü kaçırmanın (YN) maliyeti 10, iyi bir müşteriyi reddetmenin (YP) maliyeti 1 olsun. Dört kuralın başvuru başına maliyetini karşılaştırıyoruz. Önce tahmin et.", en: "Let missing a default (FN) cost 10 and rejecting a good customer (FP) cost 1. We compare the cost per application of four rules. Predict first." },
        predict: { q: { tr: "Eşik 0,5 ile “herkesi reddet” kuralından hangisi daha ucuz?", en: "Which is cheaper: threshold 0.5 or the “reject everyone” rule?" }, options: { tr: ["Eşik 0,5 çok daha ucuz", "“Herkesi reddet” biraz daha ucuz", "İkisi aynı"], en: ["Threshold 0.5 is much cheaper", "“Reject everyone” is slightly cheaper", "They are the same"] }, answer: 1, explain: { tr: "Eşik 0,5 temerrüdlerin %86'sını kaçırıyor ve her biri 10 birim. Bu maliyetlerle 0,5 eşiği, kimseye kredi vermemekten bile kötü.", en: "Threshold 0.5 misses 86% of defaults and each costs 10 units. With these costs threshold 0.5 is worse even than lending to no one." } },
        code: { tr: WMC.tr + `\nprint("herkesi onayla :", round(maliyet(y_tst, p_hat, 1.01), 3))\nprint("herkesi reddet :", round(maliyet(y_tst, p_hat, 0.0), 3))\nprint("eşik 0,5       :", round(maliyet(y_tst, p_hat, 0.5), 3))\nprint("eşik 0,09      :", round(maliyet(y_tst, p_hat, 0.09), 3))`, en: WMC.en + `\nprint("approve everyone:", round(cost(y_te, p_hat, 1.01), 3))\nprint("reject everyone :", round(cost(y_te, p_hat, 0.0), 3))\nprint("threshold 0.5   :", round(cost(y_te, p_hat, 0.5), 3))\nprint("threshold 0.09  :", round(cost(y_te, p_hat, 0.09), 3))` },
        after: { tr: "Herkesi onayla 1,067; herkesi reddet 0,893; eşik 0,5 0,921; eşik 0,09 0,498. Doğru eşikle model maliyeti yarıya indiriyor; yanlış eşikle hiçbir işe yaramıyor. Model aynı, karar kuralı farklı.", en: "Approve everyone 1.067; reject everyone 0.893; threshold 0.5 0.921; threshold 0.09 0.498. With the right threshold the model halves the cost; with the wrong one it is useless. Same model, different decision rule." }
      },
      {
        id: "m4-u6-c2", kind: "audit",
        task: { tr: "YZ maliyeti en düşük eşiği seçti. Hatalı satırı bul ve düzelt: eşik test verisine dokunmadan, eğitim verisinin çapraz doğrulama olasılıklarıyla (<code>p_cv</code>) seçilsin.", en: "The AI chose the lowest-cost threshold. Find the faulty line and fix it: the threshold should be chosen without touching the test data, using the training data's cross-validation probabilities (<code>p_cv</code>)." },
        ai: {
          prompt: { tr: "Maliyeti en düşük eşiği seç ve bu eşikle beklenen maliyeti raporla.", en: "Choose the lowest-cost threshold and report the expected cost at that threshold." },
          reply: { tr: "Eşikleri tarayıp en ucuzunu seçelim:", en: "Let us scan the thresholds and choose the cheapest:" },
          code: U6A,
          claim: { tr: "Eşik 0,09 ile yeni başvurularda beklenen maliyet 0,498 olacak.", en: "With threshold 0.09 the expected cost on new applications will be 0.498." }
        },
        bugLines: [ln(U6A.tr, "maliyetler = [")],
        lineExplain: { tr: "Eşik, test verisinde en iyi sonucu veren değer olarak seçilmiş: test verisi bir seçim için kullanıldığından raporlanan 0,498 iyimserdir (Modül 2'deki test verisi kuralı). <code>p_cv</code> hesaplanmış ama hiç kullanılmamış. Eşik, eğitim verisinde çapraz doğrulama olasılıklarıyla seçilmeli: <code>maliyet(y_egt, p_cv, e)</code>.", en: "The threshold was chosen as the value that does best on the test data: since the test data were used for a choice, the reported 0.498 is optimistic (the test-data rule from Module 2). <code>p_cv</code> was computed but never used. The threshold should be chosen on the training data with cross-validation probabilities: <code>cost(y_tr, p_cv, e)</code>." },
        hints: [{ tr: "<code>maliyetler = [maliyet(y_egt, p_cv, e) for e in esikler]</code>. Test maliyetini yalnızca seçilen eşikle, en sonda bir kez hesapla.", en: "<code>costs = [cost(y_tr, p_cv, e) for e in thresholds]</code>. Compute the test cost only once, at the end, with the chosen threshold." }],
        solution: { tr: U6A.tr.replace("maliyetler = [maliyet(y_tst, p_hat, e) for e in esikler]", "maliyetler = [maliyet(y_egt, p_cv, e) for e in esikler]"), en: U6A.en.replace("costs = [cost(y_te, p_hat, e) for e in thresholds]", "costs = [cost(y_tr, p_cv, e) for e in thresholds]") },
        checks: [{ py: { tr: "esik == esikler[np.argmin([maliyet(y_egt, p_cv, e) for e in esikler])]", en: "thr == thresholds[np.argmin([cost(y_tr, p_cv, e) for e in thresholds])]" }, msg: { tr: "Eşik, eğitim verisindeki çapraz doğrulama maliyetini en aza indiren değer olmalı.", en: "The threshold should minimise the cross-validation cost on the training data." } }],
        after: { tr: "Eğitim verisiyle seçilen eşik 0,12; test maliyeti 0,505. Fark küçük (0,498'e karşı), ama dürüst bir rakam. Test verisi bir seçim için kullanılınca, artık yeni veriyi temsil etmez.", en: "The threshold chosen with training data is 0.12; the test cost is 0.505. The gap is small (against 0.498), but it is an honest figure. Once the test data are used for a choice, they no longer represent new data." }
      },
      {
        id: "m4-u6-c3", kind: "fill",
        task: { tr: "Olasılıklar doğruysa, kredi vermenin beklenen maliyeti c<sub>YN</sub>·p, reddetmenin c<sub>YP</sub>·(1 − p) olur. İkisi eşitken p = c<sub>YP</sub> / (c<sub>YP</sub> + c<sub>YN</sub>). Kuramsal eşiği hesapla.", en: "If the probabilities are right, the expected cost of lending is c<sub>FN</sub>·p and of rejecting c<sub>FP</sub>·(1 − p). They are equal at p = c<sub>FP</sub> / (c<sub>FP</sub> + c<sub>FN</sub>). Compute the theoretical threshold." },
        code: { tr: WMC.tr + `\nc_yn, c_yp = 10, 1\nesik_kuram = c_yp / (c_yp + ___)\nprint("Kuramsal eşik:", round(esik_kuram, 3), "| test maliyeti:", round(maliyet(y_tst, p_hat, esik_kuram), 3))`, en: WMC.en + `\nc_fn, c_fp = 10, 1\nthr_theory = c_fp / (c_fp + ___)\nprint("Theoretical threshold:", round(thr_theory, 3), "| test cost:", round(cost(y_te, p_hat, thr_theory), 3))` },
        solution: { tr: WMC.tr + `\nc_yn, c_yp = 10, 1\nesik_kuram = c_yp / (c_yp + c_yn)\nprint("Kuramsal eşik:", round(esik_kuram, 3), "| test maliyeti:", round(maliyet(y_tst, p_hat, esik_kuram), 3))`, en: WMC.en + `\nc_fn, c_fp = 10, 1\nthr_theory = c_fp / (c_fp + c_fn)\nprint("Theoretical threshold:", round(thr_theory, 3), "| test cost:", round(cost(y_te, p_hat, thr_theory), 3))` },
        hints: [{ tr: "Paydada iki maliyetin toplamı var: <code>c_yp + c_yn</code>.", en: "The denominator is the sum of the two costs: <code>c_fp + c_fn</code>." }],
        checks: [{ py: { tr: "abs(esik_kuram - 1 / 11) < 1e-12", en: "abs(thr_theory - 1 / 11) < 1e-12" }, msg: { tr: "Kuramsal eşik 1 / (1 + 10) olmalı.", en: "The theoretical threshold should be 1 / (1 + 10)." } }],
        after: { tr: "1/11 ≈ 0,091; test maliyeti 0,498. Test verisinde bulduğumuz en iyi eşikle (0,09) neredeyse aynı! Bu kural yalnızca olasılıklar iyi ayarlanmışsa (kalibre) işe yarar; Ünite 7'de bozulduğu bir durum göreceğiz.", en: "1/11 ≈ 0.091; test cost 0.498. Almost the same as the best threshold we found on the test data (0.09)! The rule only works if the probabilities are well calibrated; in Unit 7 we will see a case where this breaks." }
      },
      {
        id: "m4-u6-c4", kind: "interpret",
        task: { tr: "YZ eşik seçimini yorumladı. Hangi cümleler yanlış?", en: "The AI interpreted the threshold choice. Which sentences are wrong?" },
        prompt: { tr: "Temerrüt maliyeti 10, ret maliyeti 1. Eğitim verisiyle eşik 0,12 seçildi; doğruluk %90'dan %75 civarına düştü. Yorumlar mısın?", en: "The default cost is 10, the rejection cost 1. Threshold 0.12 was chosen with training data; accuracy fell from 90% to around 75%. Can you interpret this?" },
        sentences: {
          tr: ["Doğruluk düştüğüne göre eşik 0,12 kötü bir seçim; 0,5'e dönmeliyiz.", "Doğruluk her hatayı aynı maliyette sayar; bu problemde hatalar eşit maliyetli değil.", "Maliyetler değişirse (örneğin teminatlı kredide temerrüt daha ucuzsa) en iyi eşik de değişir.", "Maliyet oranı 10:1 olduğuna göre en iyi eşik her veri setinde tam 0,12'dir."],
          en: ["Since accuracy fell, threshold 0.12 is a bad choice; we should return to 0.5.", "Accuracy counts every error at the same cost; in this problem errors are not equally costly.", "If the costs change (for example, if default is cheaper for a secured loan), the best threshold changes too.", "Since the cost ratio is 10:1, the best threshold is exactly 0.12 in every data set."]
        },
        bad: [0, 3],
        explain: {
          tr: ["<b>Yanlış:</b> amaç doğruluk değil, maliyet. Eşik 0,5'te maliyet 0,921, eşik 0,12'de 0,505.", "Doğru.", "Doğru.", "<b>Yanlış:</b> kuramsal eşik 1/11 ≈ 0,09; çapraz doğrulamanın seçtiği 0,12 ise bu örneklemin gürültüsünü de taşır. Başka veride, hele olasılıklar iyi ayarlı değilse, en iyi eşik farklı olur."],
          en: ["<b>Wrong:</b> the goal is cost, not accuracy. At threshold 0.5 the cost is 0.921, at 0.12 it is 0.505.", "Correct.", "Correct.", "<b>Wrong:</b> the theoretical threshold is 1/11 ≈ 0.09; the 0.12 chosen by cross-validation also carries this sample's noise. On other data, especially if the probabilities are poorly calibrated, the best threshold differs."]
        }
      }
    ],
    quiz: [
      { q: { tr: "Temerrüt pahalılaşınca en iyi eşik ne olur?", en: "What happens to the best threshold as default becomes more expensive?" }, options: { tr: ["Düşer", "Yükselir", "Değişmez"], en: ["It falls", "It rises", "It does not change"] }, answer: 0, explain: { tr: "Daha az olasılıkla bile reddetmeye değer.", en: "It becomes worth rejecting even at a lower probability." } },
      { q: { tr: "c<sub>YN</sub> = 4, c<sub>YP</sub> = 1 ise kuramsal eşik kaçtır?", en: "If c<sub>FN</sub> = 4 and c<sub>FP</sub> = 1, what is the theoretical threshold?" }, options: { tr: ["0,2", "0,25", "0,8"], en: ["0.2", "0.25", "0.8"] }, answer: 0, explain: { tr: "1 / (1 + 4) = 0,2.", en: "1 / (1 + 4) = 0.2." } },
      { q: { tr: "Eşiği neden test verisinde seçmemeliyiz?", en: "Why should we not choose the threshold on the test data?" }, options: { tr: ["Raporlanan maliyet iyimser olur; test verisi artık yeni veriyi temsil etmez", "Test verisi küçük olduğu için", "Kod daha yavaş çalışır"], en: ["The reported cost becomes optimistic; the test data no longer represent new data", "Because the test data are small", "The code runs slower"] }, answer: 0, explain: { tr: "Her seçim eğitim verisinde yapılır.", en: "Every choice is made on the training data." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 7 — Dengesiz veri                                                 */
  /* =================================================================== */
  const IMB = { tr: `\nX_e, y_e, _ = ciz(3000, sabit=-4.9)          # çok daha az temerrüt\nX_t, y_t, _ = ciz(20000, sabit=-4.9)\nmodel = LogisticRegression(C=1e6, max_iter=2000).fit(X_e, y_e)\np = model.predict_proba(X_t)[:, 1]`, en: `\nX_e, y_e, _ = draw(3000, const=-4.9)         # far fewer defaults\nX_t, y_t, _ = draw(20000, const=-4.9)\nmodel = LogisticRegression(C=1e6, max_iter=2000).fit(X_e, y_e)\np = model.predict_proba(X_t)[:, 1]` };
  const WI = { tr: W.tr + IMB.tr, en: W.en + IMB.en };
  const U7A = { tr: WI.tr + `\ndengeli = LogisticRegression(C=1e6, max_iter=2000, class_weight="balanced").fit(X_e, y_e)\np_d = dengeli.predict_proba(X_t)[:, 1]\nbeklenen = p_d.sum()                          # beklenen temerrüt sayısı\nprint(f"20.000 yeni başvuruda beklenen temerrüt: {beklenen:.0f}")`, en: WI.en + `\nbalanced = LogisticRegression(C=1e6, max_iter=2000, class_weight="balanced").fit(X_e, y_e)\np_b = balanced.predict_proba(X_t)[:, 1]\nexpected = p_b.sum()                          # expected number of defaults\nprint(f"Expected defaults among 20,000 new applications: {expected:.0f}")` };
  U.push({
    id: "m4-u7", minutes: 25, packages: PK,
    title: { tr: "Dengesiz veri: temerrüt nadir olunca", en: "Imbalanced data: when default is rare" },
    blurb: { tr: "Temerrüt oranı %2'ye inince eşik 0,5 neredeyse hiçbir şey yakalamaz. Sınıf ağırlıkları sıralamayı değiştirmez ama olasılıkları bozar.", en: "When the default rate falls to 2%, threshold 0.5 catches almost nothing. Class weights do not change the ranking but distort the probabilities." },
    terms: [{ tr: "dengesiz sınıflar", en: "imbalanced classes" }, { tr: "sınıf ağırlığı", en: "class weight" }, { tr: "kalibrasyon", en: "calibration" }],
    concept: C0,
    playground: { type: "imbalance", intro: { tr: "Temerrüt oranını düşür ve eşik 0,5'te yakalanan temerrüt oranına bak. Sonra sınıf ağırlığını aç ve ortalama olasılığın nasıl şiştiğini izle.", en: "Lower the default rate and watch the share of defaults caught at threshold 0.5. Then turn on class weights and watch the average probability inflate." }, takeaway: { tr: "Nadir olaylarda sorun model değil, eşiktir. Ağırlıklandırma eşiği dolaylı yoldan kaydırır ve olasılıkları gerçeklikten koparır.", en: "With rare events the problem is the threshold, not the model. Weighting shifts the threshold indirectly and detaches the probabilities from reality." } },
    cells: [
      {
        id: "m4-u7-c1", kind: "run",
        task: { tr: "Aynı kredi dünyasında sabiti −4,9'a indirip temerrüdü nadir hâle getiriyoruz. Önce tahmin et.", en: "In the same credit world we lower the constant to −4.9 and make default rare. Predict first." },
        predict: { q: { tr: "Eşik 0,5'te model temerrüdlerin yüzde kaçını yakalar?", en: "At threshold 0.5, what share of defaults does the model catch?" }, options: { tr: ["Yaklaşık %4", "Yaklaşık %50", "Yaklaşık %90"], en: ["About 4%", "About 50%", "About 90%"] }, answer: 0, explain: { tr: "Temerrüt oranı %2 civarında: neredeyse hiçbir başvurunun olasılığı 0,5'i geçmez.", en: "The default rate is around 2%: almost no application's probability exceeds 0.5." } },
        code: { tr: WI.tr + `\nprint(f"Eğitimdeki temerrüt sayısı: {y_e.sum()}   test temerrüt oranı: %{100 * y_t.mean():.2f}")\nprint(f"“Herkes öder” doğruluğu: %{100 * (1 - y_t.mean()):.1f}")\nfor esik in [0.5, 0.05]:\n    yakalanan = ((p >= esik) & (y_t == 1)).sum() / y_t.sum()\n    print(f"eşik {esik}: yakalanan temerrüt %{100 * yakalanan:.1f}   reddedilen başvuru %{100 * (p >= esik).mean():.1f}")\nprint("AUC:", round(roc_auc_score(y_t, p), 3))`, en: WI.en + `\nprint(f"Defaults in training: {y_e.sum()}   test default rate: {100 * y_t.mean():.2f}%")\nprint(f"“Everyone pays” accuracy: {100 * (1 - y_t.mean()):.1f}%")\nfor thr in [0.5, 0.05]:\n    caught = ((p >= thr) & (y_t == 1)).sum() / y_t.sum()\n    print(f"threshold {thr}: defaults caught {100 * caught:.1f}%   applications rejected {100 * (p >= thr).mean():.1f}%")\nprint("AUC:", round(roc_auc_score(y_t, p), 3))` },
        after: { tr: "Eğitimde yalnızca 63 temerrüt var; test oranı %2,17. Eşik 0,5 temerrüdlerin %3,7'sini yakalıyor, eşik 0,05 %48'ini. AUC ise 0,817: model sıralamayı hâlâ iyi yapıyor. Sorun modelde değil, 0,5 eşiğinde.", en: "There are only 63 defaults in training; the test rate is 2.17%. Threshold 0.5 catches 3.7% of defaults, threshold 0.05 catches 48%. AUC is 0.817: the model still ranks well. The problem is not the model but the 0.5 threshold." }
      },
      {
        id: "m4-u7-c2", kind: "run",
        task: { tr: "Yaygın bir çözüm: <code>class_weight=\"balanced\"</code>, az görülen sınıfa daha çok ağırlık verir. Ağırlıklı ve ağırlıksız modeli karşılaştırıyoruz. Önce tahmin et.", en: "A common fix: <code>class_weight=\"balanced\"</code> gives more weight to the rare class. We compare the weighted and unweighted models. Predict first." },
        predict: { q: { tr: "Ağırlıklı modelin ortalama temerrüt olasılığı ne olur? (Gerçek oran %2,2.)", en: "What is the weighted model's average default probability? (The true rate is 2.2%.)" }, options: { tr: ["Yaklaşık %2", "Yaklaşık %28", "Yaklaşık %50"], en: ["About 2%", "About 28%", "About 50%"] }, answer: 1, explain: { tr: "Ağırlıklar, modele iki sınıf eşit sıklıktaymış gibi öğretir; olasılıklar yukarı kayar.", en: "The weights teach the model as if the two classes were equally frequent; the probabilities shift up." } },
        code: { tr: WI.tr + `\ndengeli = LogisticRegression(C=1e6, max_iter=2000, class_weight="balanced").fit(X_e, y_e)\np_d = dengeli.predict_proba(X_t)[:, 1]\nprint("                 ağırlıksız   dengeli")\nprint(f"AUC              {roc_auc_score(y_t, p):9.3f}  {roc_auc_score(y_t, p_d):8.3f}")\nprint(f"ort. olasılık    {p.mean():9.3f}  {p_d.mean():8.3f}   (gerçek oran {y_t.mean():.3f})")\nprint(f"yakalanan (0,5)  {((p >= .5) & (y_t == 1)).sum() / y_t.sum():9.3f}  {((p_d >= .5) & (y_t == 1)).sum() / y_t.sum():8.3f}")`, en: WI.en + `\nbalanced = LogisticRegression(C=1e6, max_iter=2000, class_weight="balanced").fit(X_e, y_e)\np_b = balanced.predict_proba(X_t)[:, 1]\nprint("                 unweighted  balanced")\nprint(f"AUC              {roc_auc_score(y_t, p):9.3f}  {roc_auc_score(y_t, p_b):8.3f}")\nprint(f"mean probability {p.mean():9.3f}  {p_b.mean():8.3f}   (true rate {y_t.mean():.3f})")\nprint(f"caught (0.5)     {((p >= .5) & (y_t == 1)).sum() / y_t.sum():9.3f}  {((p_b >= .5) & (y_t == 1)).sum() / y_t.sum():8.3f}")` },
        after: { tr: "AUC neredeyse aynı (0,817 ve 0,815): ağırlıklandırma sıralamayı değiştirmiyor. Eşik 0,5'te yakalanan oran %67'ye çıkıyor, çünkü bütün olasılıklar yukarı kaymış: ortalama %28,5, gerçek oran %2,2. Aynı etkiyi ağırlıksız modelde eşiği düşürerek de alırsın, üstelik olasılıkları bozmadan.", en: "AUC is almost the same (0.817 and 0.815): weighting does not change the ranking. At threshold 0.5 the share caught rises to 67% because all probabilities have shifted up: the average is 28.5% against a true rate of 2.2%. You get the same effect in the unweighted model by lowering the threshold, without distorting the probabilities." }
      },
      {
        id: "m4-u7-c3", kind: "audit",
        task: { tr: "YZ, risk birimine gelecek dönemde kaç temerrüt bekleneceğini raporladı. Hatalı satırı bul ve düzelt: <code>beklenen</code>, ağırlıksız modelin olasılıklarıyla hesaplansın.", en: "The AI reported to the risk unit how many defaults to expect next period. Find the faulty line and fix it: <code>expected</code> should be computed from the unweighted model's probabilities." },
        ai: {
          prompt: { tr: "Dengesiz veri için uygun bir model kur ve 20.000 yeni başvuruda kaç temerrüt bekleneceğini hesapla.", en: "Build a model suited to imbalanced data and compute how many defaults to expect among 20,000 new applications." },
          reply: { tr: "Dengesiz veri olduğu için sınıf ağırlıklarını kullanalım:", en: "Since the data are imbalanced, let us use class weights:" },
          code: U7A,
          claim: { tr: "Yaklaşık 5.700 temerrüt bekleniyor; karşılıklar buna göre ayrılmalı.", en: "About 5,700 defaults are expected; provisions should be set accordingly." }
        },
        bugLines: [ln(U7A.tr, "beklenen = p_d.sum()")],
        lineExplain: { tr: "Ağırlıklı modelin olasılıkları gerçek temerrüt olasılıkları değildir: ağırlıklar onları sistematik biçimde şişirir. Beklenen sayı, kalibre olasılıkların toplamıdır: ağırlıksız modelin <code>p</code>'si.", en: "The weighted model's probabilities are not real default probabilities: the weights inflate them systematically. The expected count is the sum of calibrated probabilities: the unweighted model's <code>p</code>." },
        hints: [{ tr: "<code>beklenen = p.sum()</code>", en: "<code>expected = p.sum()</code>" }],
        solution: { tr: U7A.tr.replace("beklenen = p_d.sum()", "beklenen = p.sum()  "), en: U7A.en.replace("expected = p_b.sum()", "expected = p.sum()  ") },
        checks: [{ py: { tr: "abs(beklenen - p.sum()) < 1e-6", en: "abs(expected - p.sum()) < 1e-6" }, msg: { tr: "<code>beklenen</code>, ağırlıksız modelin olasılıklarının toplamı olmalı.", en: "<code>expected</code> should be the sum of the unweighted model's probabilities." } }],
        after: { tr: "Ağırlıksız model 423 temerrüt bekliyor; gerçekleşen 433. Ağırlıklı model 5.700 diyordu: 13 kat fazla. Bir banka bu rakamla karşılık ayırsaydı sermayesini boş yere bağlardı. Olasılığın kendisi kullanılacaksa (fiyatlama, karşılık, beklenen kayıp) kalibrasyon şarttır.", en: "The unweighted model expects 423 defaults; 433 occurred. The weighted model said 5,700: 13 times too many. A bank provisioning on that figure would tie up its capital for nothing. If the probability itself is used (pricing, provisions, expected loss), calibration is essential." }
      },
      {
        id: "m4-u7-c4", kind: "interpret",
        task: { tr: "YZ dengesiz veri için öneriler yaptı. Hangi cümleler yanlış?", en: "The AI made recommendations for imbalanced data. Which sentences are wrong?" },
        prompt: { tr: "Temerrüt oranı %2. Ne yapmalıyım?", en: "The default rate is 2%. What should I do?" },
        sentences: {
          tr: ["Doğruluk yerine AUC, duyarlılık ve maliyet gibi ölçülere bakmalısın.", "Eşiği maliyetlere göre seçmelisin; 0,5 nadir olaylar için neredeyse hiç uygun değildir.", "Sınıf ağırlıkları her zaman AUC'yi belirgin biçimde yükseltir.", "Ağırlıklı modelin olasılıklarını doğrudan temerrüt olasılığı olarak raporlayabilirsin."],
          en: ["Instead of accuracy, look at measures such as AUC, recall and cost.", "Choose the threshold by costs; 0.5 is almost never suitable for rare events.", "Class weights always raise AUC clearly.", "You can report the weighted model's probabilities directly as default probabilities."]
        },
        bad: [2, 3],
        explain: {
          tr: ["Doğru.", "Doğru.", "<b>Yanlış:</b> burada AUC 0,817'den 0,815'e indi. Ağırlıklar sıralamayı neredeyse hiç değiştirmez; etkileri eşik kaydırmaya benzer.", "<b>Yanlış:</b> ağırlıklar olasılıkları şişirir (%28,5'e karşı %2,2). Raporlanacak olasılık kalibre olmalı."],
          en: ["Correct.", "Correct.", "<b>Wrong:</b> here AUC went from 0.817 to 0.815. Weights hardly change the ranking; their effect is similar to shifting the threshold.", "<b>Wrong:</b> weights inflate the probabilities (28.5% against 2.2%). A probability to be reported must be calibrated."]
        }
      }
    ],
    quiz: [
      { q: { tr: "Temerrüt oranı %2 iken “herkes öder” kuralının doğruluğu yaklaşık kaçtır?", en: "With a 2% default rate, what is the accuracy of the “everyone pays” rule?" }, options: { tr: ["%98", "%50", "%2"], en: ["98%", "50%", "2%"] }, answer: 0, explain: { tr: "Bu yüzden nadir olaylarda doğruluk neredeyse anlamsızdır.", en: "That is why accuracy is almost meaningless for rare events." } },
      { q: { tr: "<code>class_weight=\"balanced\"</code> en çok neyi değiştirir?", en: "What does <code>class_weight=\"balanced\"</code> change most?" }, options: { tr: ["Olasılıkların düzeyini (yukarı kaydırır)", "Modelin sıralama gücünü (AUC)", "Veri setinin büyüklüğünü"], en: ["The level of the probabilities (shifts them up)", "The model's ranking power (AUC)", "The size of the data set"] }, answer: 0, explain: { tr: "AUC neredeyse aynı kalır.", en: "AUC stays almost the same." } },
      { q: { tr: "Kalibrasyon ne demektir?", en: "What does calibration mean?" }, options: { tr: ["%10 denen başvuruların gerçekten yaklaşık %10'unun temerrüde düşmesi", "AUC'nin 1 olması", "Eşiğin 0,5 olması"], en: ["About 10% of applications given 10% actually defaulting", "AUC being 1", "The threshold being 0.5"] }, answer: 0, explain: { tr: "Olasılıkların gerçekleşen oranlarla uyuşması.", en: "Probabilities matching realised frequencies." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 8 — Gerçek veriyle kredi riski (Tayvan)                          */
  /* =================================================================== */
  const TWH = { tr: D.TW.tr + D.TWX.tr, en: D.TW.en + D.TWX.en };
  const U8A = { tr: TWH.tr + `\nX_e, X_t = egitim.drop(columns=["default", "sex", "marriage"]), test.drop(columns=["default", "sex", "marriage"])\nsc = StandardScaler().fit(X_e)\nmodel = LogisticRegression(C=1e6, max_iter=5000).fit(sc.transform(X_e), egitim["default"])\np_test = model.predict_proba(sc.transform(X_t))[:, 1]\nprint("Özellik sayısı:", X_e.shape[1], "| test AUC:", round(roc_auc_score(test["default"], p_test), 3))`, en: TWH.en + `\nX_e, X_t = train.drop(columns=["default", "sex", "marriage"]), test.drop(columns=["default", "sex", "marriage"])\nsc = StandardScaler().fit(X_e)\nmodel = LogisticRegression(C=1e6, max_iter=5000).fit(sc.transform(X_e), train["default"])\np_test = model.predict_proba(sc.transform(X_t))[:, 1]\nprint("Features:", X_e.shape[1], "| test AUC:", round(roc_auc_score(test["default"], p_test), 3))` };
  const FIT = { tr: `\nfrom sklearn.pipeline import make_pipeline\ndef kur(Xe):                                   # ölçekleme + lojistik regresyon, yalnızca eğitimle\n    return make_pipeline(StandardScaler(), LogisticRegression(C=1e6, max_iter=5000)).fit(Xe, egitim["default"])\nX_e, X_t = hazirla(egitim), hazirla(test)\nmodel = kur(X_e)\np_test = model.predict_proba(X_t)[:, 1]`, en: `\nfrom sklearn.pipeline import make_pipeline\ndef fit(Xe):                                   # scaling + logistic regression, training only\n    return make_pipeline(StandardScaler(), LogisticRegression(C=1e6, max_iter=5000)).fit(Xe, train["default"])\nX_e, X_t = prepare(train), prepare(test)\nmodel = fit(X_e)\np_test = model.predict_proba(X_t)[:, 1]` };
  const TWF = { tr: TWH.tr + FIT.tr, en: TWH.en + FIT.en };
  U.push({
    id: "m4-u8", minutes: 35, packages: PKI, data: FILES,
    title: { tr: "Gerçek veriyle kredi riski: Tayvan kart müşterileri", en: "Credit risk with real data: Taiwanese card customers" },
    blurb: { tr: "30.000 kart müşterisinin altı aylık ödeme geçmişinden ertesi ayın temerrüdünü öngörmek: kodları çözmek, kalibrasyon, korunan özellikler ve maliyete göre eşik.", en: "Predicting next month's default from 30,000 card customers' six-month payment history: decoding the codes, calibration, protected attributes and a cost-based threshold." },
    terms: [{ tr: "kategorik kod", en: "categorical code" }, { tr: "kalibrasyon tablosu", en: "calibration table" }, { tr: "korunan özellik", en: "protected attribute" }],
    concept: C0, playground: null,
    cells: [
      {
        id: "m4-u8-c1", kind: "run",
        task: { tr: "Veriyi okuyup temerrüt oranına ve Eylül 2005 ödeme durumuna (<code>pay_0</code>) göre temerrüt oranlarına bakıyoruz. Kodlar: −2 kart kullanılmadı, −1 borcun tamamı ödendi, 0 asgari ödeme yapıldı (döner kredi), 1, 2, … kaç ay gecikildiği. Önce tahmin et.", en: "We read the data and look at the default rate and at default rates by the September 2005 payment status (<code>pay_0</code>). Codes: −2 card not used, −1 balance paid in full, 0 minimum payment made (revolving credit), 1, 2, … months of delay. Predict first." },
        predict: { q: { tr: "Kodlar −2, −1, 0 sırasıyla arttıkça temerrüt oranı da düzenli artar mı?", en: "As the codes go −2, −1, 0, does the default rate rise steadily?" }, options: { tr: ["Evet, düzenli artar", "Hayır: −1'in oranı 0'dan yüksek", "Üçü de sıfır"], en: ["Yes, it rises steadily", "No: −1 has a higher rate than 0", "All three are zero"] }, answer: 1, explain: { tr: "Bu kodlar bir sayı ölçeği değil, kategori. “Tamamını ödedi” ile “asgari ödedi” arasındaki fark bir “gecikme ayı” değildir.", en: "These codes are categories, not a numeric scale. The difference between “paid in full” and “paid the minimum” is not one “month of delay”." } },
        code: { tr: TWH.tr + `\nprint("Gözlem:", len(kredi), "| temerrüt oranı:", round(kredi["default"].mean(), 3))\nprint(kredi.groupby("pay_0")["default"].agg(["count", "mean"]).round(3).head(6))`, en: TWH.en + `\nprint("Observations:", len(credit), "| default rate:", round(credit["default"].mean(), 3))\nprint(credit.groupby("pay_0")["default"].agg(["count", "mean"]).round(3).head(6))` },
        after: { tr: "Temerrüt oranı %22,1. −2: %13,2; −1: %16,8; 0: %12,8; 1 ay gecikme: %33,9; 2 ay: %69,1. Oran −1'den 0'a düşüp sonra sıçrıyor: bu kodu tek bir sayısal değişken olarak kullanmak, doğrusal bir ilişki varsaymaktır. Not: −2 ve 0 kodları verinin resmî açıklamasında yer almıyor; yukarıdaki anlamlar literatürdeki yaygın yorumdur.", en: "The default rate is 22.1%. −2: 13.2%; −1: 16.8%; 0: 12.8%; 1 month delay: 33.9%; 2 months: 69.1%. The rate falls from −1 to 0 and then jumps: using this code as a single numeric variable assumes a linear relationship. Note: codes −2 and 0 are not in the data's official description; the meanings above are the common reading in the literature." }
      },
      {
        id: "m4-u8-c2", kind: "audit",
        task: { tr: "YZ'den bir temerrüt modeli istedik. Hatalı satırı bul ve düzelt: ödeme durumu kodları hazır <code>hazirla()</code> fonksiyonuyla anlamlarına göre çözülsün (korunan özellikler yine dışarıda kalsın).", en: "We asked the AI for a default model. Find the faulty line and fix it: the payment status codes should be decoded by meaning with the ready-made <code>prepare()</code> function (protected attributes still left out)." },
        ai: {
          prompt: { tr: "Cinsiyet ve medeni durumu kullanmadan, test verisinde AUC'yi raporlayan bir lojistik regresyon kur.", en: "Build a logistic regression, without sex and marital status, that reports the AUC on the test data." },
          reply: { tr: "Değişkenleri ölçekleyip modeli kuralım:", en: "Let us scale the variables and build the model:" },
          code: U8A,
          claim: { tr: "AUC 0,713. Bu veriyle lojistik regresyondan daha iyisi beklenemez.", en: "AUC is 0.713. Nothing better can be expected from logistic regression with these data." }
        },
        bugLines: [ln(U8A.tr, "X_e, X_t = egitim.drop")],
        lineExplain: { tr: "Ödeme durumu kodları (−2, −1, 0, 1, …) sayı gibi girilmiş: model −1 ile 0 arasındaki farkı bir “gecikme ayı” gibi okuyor. Kodlar anlamlarına göre ayrılmalı: gecikme ayı, tam ödeme ve kullanılmama ayrı değişkenler olmalı. Çok çarpık tutarlar da log dönüşümü ister. <code>hazirla()</code> ikisini de yapıyor.", en: "The payment status codes (−2, −1, 0, 1, …) went in as numbers: the model reads the gap between −1 and 0 as one “month of delay”. The codes must be split by meaning: months of delay, full payment and non-use should be separate variables. The very skewed amounts also need a log transform. <code>prepare()</code> does both." },
        hints: [{ tr: "<code>X_e, X_t = hazirla(egitim), hazirla(test)</code>", en: "<code>X_e, X_t = prepare(train), prepare(test)</code>" }],
        solution: { tr: U8A.tr.replace('X_e, X_t = egitim.drop(columns=["default", "sex", "marriage"]), test.drop(columns=["default", "sex", "marriage"])', "X_e, X_t = hazirla(egitim), hazirla(test)"), en: U8A.en.replace('X_e, X_t = train.drop(columns=["default", "sex", "marriage"]), test.drop(columns=["default", "sex", "marriage"])', "X_e, X_t = prepare(train), prepare(test)") },
        checks: [{ py: { tr: "list(X_e.columns) == list(hazirla(egitim).columns) and roc_auc_score(test['default'], p_test) > 0.75", en: "list(X_e.columns) == list(prepare(train).columns) and roc_auc_score(test['default'], p_test) > 0.75" }, msg: { tr: "Özellikler <code>hazirla()</code> ile üretilmeli (test AUC'si 0,75'i geçmeli).", en: "The features should come from <code>prepare()</code> (test AUC should exceed 0.75)." } }],
        after: { tr: "Aynı model, aynı veri; yalnızca kodları doğru okuyunca AUC 0,713'ten 0,762'ye çıktı. Yöntem değiştirmeden önce verinin ne anlattığını anlamak çoğu zaman en büyük kazançtır. YZ'nin “daha iyisi beklenemez” iddiası denenmeden söylenmişti.", en: "Same model, same data; just reading the codes correctly raised AUC from 0.713 to 0.762. Understanding what the data say before changing the method is often the biggest gain. The AI's “nothing better can be expected” was claimed without trying." }
      },
      {
        id: "m4-u8-c3", kind: "run",
        task: { tr: "Olasılıklar ne kadar güvenilir? Test müşterilerini öngörülen olasılığa göre on gruba ayırıp her grubun ortalama öngörüsünü gerçekleşen temerrüt oranıyla karşılaştırıyoruz. Önce tahmin et.", en: "How reliable are the probabilities? We split the test customers into ten groups by predicted probability and compare each group's average prediction with its realised default rate. Predict first." },
        predict: { q: { tr: "Model en riskli gruba ortalama %68 olasılık veriyor. Bu grupta gerçekleşen oran ne olur?", en: "The model gives the riskiest group an average probability of 68%. What is the realised rate in that group?" }, options: { tr: ["Yaklaşık %20", "Yaklaşık %70", "%100"], en: ["About 20%", "About 70%", "100%"] }, answer: 1, explain: { tr: "Kodlar doğru çözülünce lojistik regresyonun olasılıkları iyi ayarlı (kalibre) çıkar.", en: "Once the codes are decoded correctly, the logistic regression's probabilities come out well calibrated." } },
        code: { tr: TWF.tr + `\ngrup = pd.qcut(p_test, 10, labels=range(1, 11))\ntablo = pd.DataFrame({"öngörülen": p_test, "gerçekleşen": test["default"].values}).groupby(grup, observed=True).mean()\nprint("Test AUC:", round(roc_auc_score(test["default"], p_test), 3))\nprint(tablo.round(3).T.to_string())`, en: TWF.en + `\ngroup = pd.qcut(p_test, 10, labels=range(1, 11))\ntable = pd.DataFrame({"predicted": p_test, "realised": test["default"].values}).groupby(group, observed=True).mean()\nprint("Test AUC:", round(roc_auc_score(test["default"], p_test), 3))\nprint(table.round(3).T.to_string())` },
        after: { tr: "En riskli grupta öngörülen %68,2, gerçekleşen %70,4; en güvenli grupta %6,7 ve %7,8. Olasılıklar gerçekleşen oranları yakından izliyor. Ham kodlarla kurulan model ise en güvenli gruba %4 diyordu ama gerçekleşen %11'di: sıralama kadar kalibrasyon da kodlamaya bağlı.", en: "In the riskiest group the prediction is 68.2% and the realised rate 70.4%; in the safest, 6.7% and 7.8%. The probabilities track realised rates closely. The model built on raw codes said 4% for the safest group while the realised rate was 11%: calibration depends on coding as much as ranking does." }
      },
      {
        id: "m4-u8-c4", kind: "run",
        task: { tr: "Modele cinsiyet ve medeni durumu eklesek ne olur? Yalnızca öngörü gücüne bakıyoruz. Önce tahmin et.", en: "What if we added sex and marital status to the model? We only look at predictive power. Predict first." },
        predict: { q: { tr: "AUC ne kadar değişir?", en: "How much does AUC change?" }, options: { tr: ["Belirgin biçimde artar (0,80'in üzerine)", "Neredeyse hiç (0,01'den az)", "Düşer"], en: ["It rises clearly (above 0.80)", "Hardly at all (under 0.01)", "It falls"] }, answer: 1, explain: { tr: "Ödeme geçmişi bilgisi zaten çok güçlü; demografik değişkenler ona pek az şey ekler.", en: "Payment history is already very informative; demographic variables add little to it." } },
        code: { tr: TWF.tr + `\nek = lambda df: pd.concat([hazirla(df), pd.get_dummies(df[["sex", "marriage"]].astype(str), drop_first=True).astype(int)], axis=1)\nmodel_k = kur(ek(egitim))\nprint("AUC, korunan özellikler olmadan:", round(roc_auc_score(test["default"], p_test), 4))\nprint("AUC, korunan özelliklerle      :", round(roc_auc_score(test["default"], model_k.predict_proba(ek(test))[:, 1]), 4))`, en: TWF.en + `\nadd = lambda df: pd.concat([prepare(df), pd.get_dummies(df[["sex", "marriage"]].astype(str), drop_first=True).astype(int)], axis=1)\nmodel_p = fit(add(train))\nprint("AUC, without protected attributes:", round(roc_auc_score(test["default"], p_test), 4))\nprint("AUC, with protected attributes   :", round(roc_auc_score(test["default"], model_p.predict_proba(add(test))[:, 1]), 4))` },
        after: { tr: "0,7618'e karşı 0,7635: fark yalnızca 0,002. Küçük bir öngörü kazancı uğruna cinsiyete ya da medeni duruma göre fiyatlama yapmak birçok ülkede yasaktır ve adil değildir. Üstelik bu özellikleri çıkarmak tek başına yeterli değil: başka değişkenler onların vekili olabilir; adillik ayrıca ölçülmelidir.", en: "0.7618 against 0.7635: a gap of only 0.002. Pricing by sex or marital status for a small predictive gain is prohibited in many countries and is unfair. Moreover, removing these attributes is not enough on its own: other variables can act as proxies for them; fairness must be measured separately." }
      },
      {
        id: "m4-u8-c5", kind: "run",
        task: { tr: "Kaçan bir temerrüt, reddedilen iyi bir müşterinin 5 katı maliyetli olsun. Eşiği eğitim verisinde çapraz doğrulamayla seçip test maliyetini hesaplıyoruz (birkaç saniye sürebilir). Önce tahmin et.", en: "Let a missed default cost 5 times as much as a rejected good customer. We choose the threshold on the training data by cross-validation and compute the test cost (it may take a few seconds). Predict first." },
        predict: { q: { tr: "Seçilen eşik kuramsal eşiğe (1/6 ≈ 0,17) ne kadar yakın çıkar?", en: "How close is the chosen threshold to the theoretical threshold (1/6 ≈ 0.17)?" }, options: { tr: ["Çok uzak (0,5 civarı)", "Çok yakın", "Sıfır"], en: ["Far off (around 0.5)", "Very close", "Zero"] }, answer: 1, explain: { tr: "Olasılıklar iyi ayarlı olduğu için kuramsal kural gerçek veride de işe yarıyor.", en: "Because the probabilities are well calibrated, the theoretical rule works on real data too." } },
        code: { tr: TWF.tr + `\ndef maliyet(y, p, esik, c_yn=5, c_yp=1):\n    karar = p >= esik\n    return (c_yn * np.sum(~karar & (y == 1)) + c_yp * np.sum(karar & (y == 0))) / len(y)\np_cv = cross_val_predict(make_pipeline(StandardScaler(), LogisticRegression(C=1e6, max_iter=5000)), X_e, egitim["default"], cv=5, method="predict_proba")[:, 1]\nesikler = np.round(np.arange(0.05, 0.71, 0.01), 2)\nesik = esikler[np.argmin([maliyet(egitim["default"].values, p_cv, e) for e in esikler])]\ny_t = test["default"].values\nprint("Seçilen eşik:", esik)\nfor ad, e in [("herkesi onayla", 2), ("eşik 0,5", 0.5), (f"eşik {esik}", esik)]:\n    print(f"{ad:15s} test maliyeti {maliyet(y_t, p_test, e):.3f}")`, en: TWF.en + `\ndef cost(y, p, thr, c_fn=5, c_fp=1):\n    decision = p >= thr\n    return (c_fn * np.sum(~decision & (y == 1)) + c_fp * np.sum(decision & (y == 0))) / len(y)\np_cv = cross_val_predict(make_pipeline(StandardScaler(), LogisticRegression(C=1e6, max_iter=5000)), X_e, train["default"], cv=5, method="predict_proba")[:, 1]\nthresholds = np.round(np.arange(0.05, 0.71, 0.01), 2)\nthr = thresholds[np.argmin([cost(train["default"].values, p_cv, e) for e in thresholds])]\ny_t = test["default"].values\nprint("Chosen threshold:", thr)\nfor name, e in [("approve everyone", 2), ("threshold 0.5", 0.5), (f"threshold {thr}", thr)]:\n    print(f"{name:16s} test cost {cost(y_t, p_test, e):.3f}")` },
        after: { tr: "Seçilen eşik 0,17, kuramsal eşikle aynı. Test maliyeti: herkesi onayla 1,106; eşik 0,5 0,778; eşik 0,17 0,580. Bu eşikte başvuruların %40'ı reddediliyor ve temerrüdlerin %70'i yakalanıyor. Modül 5'te ağaçlar ve rastgele ormanla daha iyisini arayacağız.", en: "The chosen threshold is 0.17, the same as the theoretical one. Test cost: approve everyone 1.106; threshold 0.5 0.778; threshold 0.17 0.580. At this threshold 40% of applications are rejected and 70% of defaults are caught. In Module 5 we will look for something better with trees and random forests." }
      },
      {
        id: "m4-u8-c6", kind: "interpret",
        task: { tr: "YZ Tayvan sonuçlarını bir rapora çevirdi. Hangi cümleler yanlış?", en: "The AI turned the Taiwan results into a report. Which sentences are wrong?" },
        prompt: { tr: "Test AUC 0,762; olasılıklar iyi kalibre; 5:1 maliyetle eşik 0,17; korunan özellikler AUC'yi 0,002 artırıyor. Bir paragraf yazar mısın?", en: "Test AUC 0.762; probabilities well calibrated; threshold 0.17 at 5:1 cost; protected attributes add 0.002 to AUC. Can you write a paragraph?" },
        sentences: {
          tr: ["Model, temerrüde düşen ve düşmeyen müşterileri belirgin biçimde ayırıyor, ama kusursuz değil.", "Gecikme ayı arttıkça temerrüt olasılığı arttığına göre, gecikmeyi azaltmak temerrüdü azaltır.", "Bu sonuçlar 2005 Tayvan'ındaki bir bankanın kart müşterilerine aittir; başka bir ülkeye ya da döneme aktarmadan önce yeniden sınanmalıdır.", "Korunan özellikleri çıkardığımız için model artık kesinlikle adildir."],
          en: ["The model clearly separates customers who default from those who do not, but it is not perfect.", "Since default probability rises with months of delay, reducing delays will reduce default.", "These results belong to one bank's card customers in Taiwan in 2005; they must be re-tested before being carried over to another country or period.", "Since we removed the protected attributes, the model is now certainly fair."]
        },
        bad: [1, 3],
        explain: {
          tr: ["Doğru.", "<b>Yanlış:</b> gecikme, temerrüdün habercisidir, nedeni olmayabilir: ikisini de mali sıkıntı belirliyor olabilir. Öngörü modeli nedensel bir politika önerisi vermez.", "Doğru: bu, dış geçerlilik uyarısıdır. 2005 Tayvan'ı bir kart borcu krizinin içindeydi.", "<b>Yanlış:</b> başka değişkenler (yaş, kredi limiti, eğitim) korunan özelliklerle ilişkili olabilir. Adillik, gruplar arasında hata oranları karşılaştırılarak ayrıca ölçülmelidir."],
          en: ["Correct.", "<b>Wrong:</b> delay is a harbinger of default and may not be its cause: financial distress may drive both. A prediction model does not give a causal policy recommendation.", "Correct: this is an external validity caveat. Taiwan in 2005 was in the middle of a card debt crisis.", "<b>Wrong:</b> other variables (age, credit limit, education) may be related to the protected attributes. Fairness must be measured separately by comparing error rates across groups."]
        }
      }
    ],
    quiz: [
      { q: { tr: "Ödeme durumu kodu neden tek bir sayısal değişken olarak kullanılmamalı?", en: "Why should the payment status code not be used as a single numeric variable?" }, options: { tr: ["Kodlar bir sayı ölçeği değil; temerrüt oranı kodla doğrusal değişmiyor", "Değerleri çok büyük", "Eksik değer içeriyor"], en: ["The codes are not a numeric scale; the default rate does not vary linearly with them", "Its values are too large", "It has missing values"] }, answer: 0, explain: { tr: "−1 ile 0 arasındaki fark bir gecikme ayı değildir.", en: "The gap between −1 and 0 is not a month of delay." } },
      { q: { tr: "Kalibrasyon tablosu neyi gösterir?", en: "What does a calibration table show?" }, options: { tr: ["Gruplara göre öngörülen ve gerçekleşen temerrüt oranlarını", "Katsayıları", "Eşikleri"], en: ["Predicted and realised default rates by group", "The coefficients", "The thresholds"] }, answer: 0, explain: { tr: "İyi kalibre bir modelde ikisi birbirine yakındır.", en: "In a well-calibrated model the two are close." } },
      { q: { tr: "Korunan özellikleri modelden çıkarmak adilliği garanti eder mi?", en: "Does removing protected attributes from the model guarantee fairness?" }, options: { tr: ["Hayır; başka değişkenler onların vekili olabilir", "Evet, her zaman", "Yalnızca AUC yüksekse"], en: ["No; other variables can act as their proxies", "Yes, always", "Only if AUC is high"] }, answer: 0, explain: { tr: "Adillik ayrıca ölçülmelidir.", en: "Fairness must be measured separately." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 9 — Colab + Gemini atölyesi                                       */
  /* =================================================================== */
  const NB = { tr: "modul4/09_kredi_riski_atolyesi_tr.ipynb", en: "module4/09_credit_risk_workshop_en.ipynb" };
  U.push({
    id: "m4-u9", minutes: 50,
    title: { tr: "Colab + Gemini atölyesi: kredi riski", en: "Colab + Gemini workshop: credit risk" },
    blurb: { tr: "Tayvan verisiyle ödeme kodlarını çöz, korunan özellikleri dışarıda bırak, lojistik regresyonu kur, sonra eşiği maliyete göre eğitim verisinde seç. Kodu Gemini yazar, sen denetlersin.", en: "With the Taiwan data, decode the payment codes, leave out the protected attributes, build the logistic regression, then choose the threshold by cost on the training data. Gemini writes the code, you audit it." },
    terms: [{ tr: "pipeline", en: "pipeline" }, { tr: "cross_val_predict", en: "cross_val_predict" }, { tr: "maliyete duyarlı karar", en: "cost-sensitive decision" }],
    concept: {
      tr: `<p>Bu atölyede modülün yöntemlerini gerçek veriyle uygulayacaksın. Notebook, Tayvan kart müşterileri verisini (UCI, 30.000 müşteri) bu sitenin GitHub deposundan indirir.</p>
<p><b>Görevler</b></p>
<ol>
<li><b>Görev A — Model:</b> Veriyi <code>train_test_split(test_size=0.3, random_state=0, stratify=...)</code> ile böl. Cinsiyet ve medeni durumu dışarıda bırak, ödeme durumu kodlarını anlamlarına göre çöz, tutarları işaretli log ile dönüştür. Ölçekleme ve lojistik regresyonu bir <code>pipeline</code> içinde yalnızca eğitimle kur; test AUC'sini hesapla.</li>
<li><b>Görev B — Eşik:</b> Kaçan temerrüt 5, reddedilen iyi müşteri 1 birim maliyetli. Eşiği eğitim verisinde <code>cross_val_predict</code> olasılıklarıyla seç; test maliyetini “herkesi onayla” ve eşik 0,5 ile karşılaştır.</li>
</ol>
<div class="box"><b>Gemini'nin sık yaptığı hatalar:</b> ödeme kodlarını sayı gibi bırakmak; cinsiyet ve medeni durumu modele almak; ölçekleyiciyi tüm veriyle kurmak; AUC'yi <code>predict()</code> ile hesaplamak; eşiği test verisinde seçmek; dengesizlik için <code>class_weight</code> ekleyip olasılıkları bozmak. Kontrol hücreleri bunların hepsini yakalar.</div>
<p>Colab ve Gemini'yi kullanma kuralları Modül 0'daki atölyeyle aynı.</p>`,
      en: `<p>In this workshop you apply the module's methods to real data. The notebook downloads the Taiwanese card customers data (UCI, 30,000 customers) from this site's GitHub repository.</p>
<p><b>Tasks</b></p>
<ol>
<li><b>Task A — Model:</b> split the data with <code>train_test_split(test_size=0.3, random_state=0, stratify=...)</code>. Leave out sex and marital status, decode the payment status codes by meaning, and transform the amounts with a signed log. Fit the scaling and the logistic regression inside a <code>pipeline</code> on the training data only; compute the test AUC.</li>
<li><b>Task B — Threshold:</b> a missed default costs 5 units, a rejected good customer 1. Choose the threshold on the training data with <code>cross_val_predict</code> probabilities; compare the test cost with “approve everyone” and threshold 0.5.</li>
</ol>
<div class="box"><b>Mistakes Gemini often makes:</b> leaving the payment codes as numbers; putting sex and marital status in the model; fitting the scaler on all the data; computing AUC with <code>predict()</code>; choosing the threshold on the test data; adding <code>class_weight</code> for the imbalance and distorting the probabilities. The check cells catch all of these.</div>
<p>The rules for using Colab and Gemini are the same as in the Module 0 workshop.</p>`
    },
    playground: null,
    cells: [
      {
        id: "m4-u9-c1", kind: "prompt",
        task: { tr: "Görev A için Gemini'ye vereceğin isteği burada hazırla. Notebook'ta <code>kredi</code> tablosu hazır; hedef sütunu <code>default</code>.", en: "Prepare the prompt for Task A here. The notebook has the <code>credit</code> table ready; the target column is <code>default</code>." },
        weak: {
          prompt: { tr: "Kredi temerrüdü için bir model kur.", en: "Build a model for credit default." },
          reply: { tr: "Bütün değişkenlerle bir lojistik regresyon kuralım:", en: "Let us build a logistic regression with all variables:" },
          code: { tr: "X = kredi.drop(columns=[\"default\"])\nX_e, X_t, y_e, y_t = train_test_split(X, kredi[\"default\"], test_size=0.3)\nmodel = LogisticRegression().fit(X_e, y_e)\nprint(roc_auc_score(y_t, model.predict(X_t)))", en: "X = credit.drop(columns=[\"default\"])\nX_e, X_t, y_e, y_t = train_test_split(X, credit[\"default\"], test_size=0.3)\nmodel = LogisticRegression().fit(X_e, y_e)\nprint(roc_auc_score(y_t, model.predict(X_t)))" },
          claim: { tr: "AUC 0,60; bu veri temerrüdü pek öngöremiyor.", en: "AUC is 0.60; these data cannot predict default well." }
        },
        checklist: [
          { label: { tr: "Bölme ayrıntıları", en: "Split details" }, why: { tr: "test_size=0.3, random_state=0, stratify; tablo adları egitim ve test.", en: "test_size=0.3, random_state=0, stratify; table names train and test." }, re: { tr: "random_state|stratify|tabakalı", en: "random_state|stratif" } },
          { label: { tr: "Korunan özellikler", en: "Protected attributes" }, why: { tr: "sex ve marriage modele girmesin.", en: "sex and marriage must not enter the model." }, re: { tr: "sex|marriage|cinsiyet|medeni", en: "sex|marriage|marital" } },
          { label: { tr: "Ödeme kodlarını çözmek", en: "Decoding payment codes" }, why: { tr: "pay_ sütunlarında −2, −1 kategoridir; gecikme ayı, tam ödeme ve kullanılmama ayrı değişkenler olsun.", en: "In the pay_ columns −2 and −1 are categories; months of delay, full payment and non-use should be separate variables." }, re: { tr: "pay_|ödeme durumu|kod|gecikme", en: "pay_|payment status|code|delay" } },
          { label: { tr: "Sızıntısız ölçekleme ve doğru ölçü", en: "Leak-free scaling and the right metric" }, why: { tr: "StandardScaler ile lojistik regresyon bir pipeline içinde, yalnızca eğitimle; AUC predict_proba ile.", en: "StandardScaler and logistic regression in a pipeline, training only; AUC with predict_proba." }, re: { tr: "pipeline|predict_proba|yalnızca eğitim|sadece eğitim", en: "pipeline|predict_proba|training only|only the training" } }
        ],
        minLen: 120,
        strong: { prompt: { tr: "kredi adlı pandas tablosunu train_test_split(kredi, test_size=0.3, random_state=0, stratify=kredi[\"default\"]) ile egitim ve test olarak böl. hazirla(df) adlı bir fonksiyon yaz: default, sex ve marriage sütunlarını at; pay_0, pay_2 … pay_6 sütunlarının her biri için üç değişken üret (_gecikme = değerin 0'ın altını 0'a kırpılmış hâli, _tam = değer −1 ise 1, _yok = değer −2 ise 1) ve özgün pay_ sütununu sil; adında \"amt\" geçen bütün tutar sütunlarını işaretli log ile dönüştür: sign(x)·log(1+|x|). StandardScaler ve LogisticRegression(C=1e6, max_iter=5000) içeren bir make_pipeline'ı yalnızca hazirla(egitim) ile kur ve model değişkenine ata. Test olasılıklarını predict_proba(...)[:, 1] ile p_test'e, roc_auc_score ile test AUC'sini auc_test'e ata. class_weight kullanma.", en: "Split the pandas table credit into train and test with train_test_split(credit, test_size=0.3, random_state=0, stratify=credit[\"default\"]). Write a function prepare(df): drop the default, sex and marriage columns; for each of pay_0, pay_2 … pay_6 create three variables (_delay = the value clipped below at 0, _full = 1 if the value is −1, _none = 1 if the value is −2) and drop the original pay_ column; transform every amount column whose name contains \"amt\" with a signed log: sign(x)·log(1+|x|). Fit a make_pipeline with StandardScaler and LogisticRegression(C=1e6, max_iter=5000) on prepare(train) only and store it in model. Store the test probabilities from predict_proba(...)[:, 1] in p_test and the test AUC from roc_auc_score in auc_test. Do not use class_weight." } }
      },
      {
        id: "m4-u9-c2", kind: "colab",
        task: { tr: "<b>Görev A — Model.</b> Notebook'u aç, hazırladığın istekle <code>egitim</code>, <code>test</code>, <code>hazirla</code>, <code>model</code>, <code>p_test</code> ve <code>auc_test</code> değişkenlerini oluştur, kontrol hücresini çalıştır ve verdiği kodu buraya yapıştır.", en: "<b>Task A — Model.</b> Open the notebook, create <code>train</code>, <code>test</code>, <code>prepare</code>, <code>model</code>, <code>p_test</code> and <code>auc_test</code> with the prompt you prepared, run the check cell and paste the code it gives you here." },
        notebook: NB,
        steps: {
          tr: ["Notebook'u aç ve <b>Kurulum</b> hücresini çalıştır (veri indirilir; <code>kredi</code> tablosu hazırlanır).", "<b>Görev A</b> hücresinde Gemini'ye isteğini ver.", "Kodu denetle: sex ve marriage dışarıda mı? <code>pay_</code> kodları çözülmüş mü? Ölçekleyici pipeline içinde mi? AUC <code>predict_proba</code> ile mi?", "<b>Kontrol A</b> hücresini çalıştır; geçerse <code>ML4-…</code> kodunu yapıştır."],
          en: ["Open the notebook and run the <b>Setup</b> cell (the data are downloaded; the <code>credit</code> table is prepared).", "In the <b>Task A</b> cell, give Gemini your prompt.", "Audit the code: are sex and marriage left out? Are the <code>pay_</code> codes decoded? Is the scaler inside the pipeline? Is AUC computed with <code>predict_proba</code>?", "Run the <b>Check A</b> cell; if it passes, paste the <code>ML4-…</code> code."]
        },
        codeHashes: ["bf660d70"]
      },
      {
        id: "m4-u9-c3", kind: "colab",
        task: { tr: "<b>Görev B — Eşik.</b> Gemini ile eşiği eğitim verisinde seçen kodu yazdır (<code>esik</code>, <code>maliyet_test</code>), kontrol hücresini çalıştır ve kodu buraya yapıştır.", en: "<b>Task B — Threshold.</b> Have Gemini write the code that chooses the threshold on the training data (<code>thr</code>, <code>cost_test</code>), run the check cell and paste the code here." },
        notebook: NB,
        steps: {
          tr: ["<b>Görev B</b> hücresinde Gemini'den 5:1 maliyetle eşik seçimini iste: <code>cross_val_predict(..., cv=5, method=\"predict_proba\")</code> eğitim verisinde, eşik ızgarası 0,05–0,70.", "Kodu denetle: eşik test verisiyle mi seçiliyor? Çapraz doğrulama modeli de pipeline mı?", "Seçilen eşiği kuramsal eşikle (1/6) karşılaştır.", "<b>Kontrol B</b> hücresini çalıştır ve kodu buraya yapıştır."],
          en: ["In the <b>Task B</b> cell, ask Gemini to choose the threshold at 5:1 cost: <code>cross_val_predict(..., cv=5, method=\"predict_proba\")</code> on the training data, threshold grid 0.05–0.70.", "Audit the code: is the threshold chosen with the test data? Is the cross-validation model also a pipeline?", "Compare the chosen threshold with the theoretical threshold (1/6).", "Run the <b>Check B</b> cell and paste the code here."]
        },
        codeHashes: ["ef0e6aa8"],
        after: { tr: "Doğru eşikle model, herkesi onaylamanın maliyetini neredeyse yarıya indiriyor. Ama hatırla: bu karar kuralı tek bir bankanın 2005 verisinden çıktı; uygulamaya almadan önce güncel veriyle ve gruplar arası hata oranlarıyla yeniden sınanmalı.", en: "With the right threshold the model almost halves the cost of approving everyone. But remember: this decision rule comes from one bank's 2005 data; before use it must be re-tested with current data and with error rates across groups." }
      },
      {
        id: "m4-u9-c4", kind: "auditlog",
        task: { tr: "Atölyeyi bir denetim notuyla kapat.", en: "Close the workshop with an audit note." },
        fields: {
          tr: [
            { label: "Gemini özellikleri nasıl hazırladı? Değiştirmen gerekti mi?", help: "pay_ kodları, korunan özellikler, tutarların dönüşümü", ph: "Örnek: Gemini önce pay_ sütunlarını olduğu gibi bırakmıştı…" },
            { label: "Ölçekleme, AUC ve eşik seçimi nasıl yapıldı?", help: "Pipeline mı? predict_proba mı? Eşik eğitimde mi seçildi?", ph: "Örnek: kod eşiği test verisinde seçiyordu…" },
            { label: "Sonucu bir kredi komitesine nasıl anlatırsın?", help: "AUC, kalibrasyon, seçilen eşik, maliyet; sınırlılıklar ve adillik", ph: "Örnek: model başvuruların %40'ını reddederek…" }
          ],
          en: [
            { label: "How did Gemini prepare the features? Did you need to change anything?", help: "pay_ codes, protected attributes, transforming the amounts", ph: "Example: Gemini first left the pay_ columns as they were…" },
            { label: "How were scaling, AUC and the threshold choice done?", help: "Pipeline? predict_proba? Threshold chosen on training?", ph: "Example: the code chose the threshold on the test data…" },
            { label: "How would you explain the result to a credit committee?", help: "AUC, calibration, chosen threshold, cost; limitations and fairness", ph: "Example: by rejecting 40% of applications the model…" }
          ]
        }
      }
    ],
    quiz: [
      { q: { tr: "Ölçekleme ve modeli neden bir pipeline içinde kurarız?", en: "Why do we put scaling and the model in a pipeline?" }, options: { tr: ["Çapraz doğrulamada ölçekleme her katmanda yalnızca eğitim kısmıyla yapılsın diye", "Kod daha hızlı çalışsın diye", "AUC'yi yükseltmek için"], en: ["So that in cross-validation the scaling uses only each fold's training part", "To make the code faster", "To raise AUC"] }, answer: 0, explain: { tr: "Sızıntıyı önler.", en: "It prevents leakage." } },
      { q: { tr: "5:1 maliyet oranında kuramsal eşik kaçtır?", en: "What is the theoretical threshold at a 5:1 cost ratio?" }, options: { tr: ["1/6 ≈ 0,17", "0,5", "5/6"], en: ["1/6 ≈ 0.17", "0.5", "5/6"] }, answer: 0, explain: { tr: "1 / (1 + 5).", en: "1 / (1 + 5)." } },
      { q: { tr: "Gemini dengesizlik için <code>class_weight=\"balanced\"</code> eklerse ne olur?", en: "What happens if Gemini adds <code>class_weight=\"balanced\"</code> for the imbalance?" }, options: { tr: ["Olasılıklar şişer; kalibrasyon ve kuramsal eşik bozulur", "AUC iki katına çıkar", "Hiçbir şey değişmez"], en: ["The probabilities inflate; calibration and the theoretical threshold break", "AUC doubles", "Nothing changes"] }, answer: 0, explain: { tr: "Ünite 7.", en: "Unit 7." } }
    ]
  });
})();
