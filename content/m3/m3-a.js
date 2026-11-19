/* Modül 3 — Regresyon ve düzenlileştirme · Üniteler 1–5
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 * "Örnek YZ yanıtları" öğretim amacıyla hazırlanmıştır.
 */
(function () {
  "use strict";
  const D = window.M3_DATA, U = window.M3_UNITS, W = D.WAGE, ln = D.line;
  const SC = { tr: `\nsc = StandardScaler().fit(X_egt)\nXs, Xt = sc.transform(X_egt), sc.transform(X_tst)`, en: `\nsc = StandardScaler().fit(X_tr)\nXs, Xt = sc.transform(X_tr), sc.transform(X_te)` };
  const WS = { tr: W.tr + SC.tr, en: W.en + SC.en };
  const PK = ["numpy", "scikit-learn"];
  const C0 = { tr: "", en: "" }; // kavram anlatımı m3-concepts.js'te

  /* =================================================================== */
  /* Ünite 1 — EKK'yı öngörü için kullanmak                                */
  /* =================================================================== */
  const U1A = { tr: WS.tr + `\nekk = LinearRegression().fit(Xs, y_egt)\nr2 = ekk.score(Xs, y_egt)\nprint(f"Model ücret farklılıklarının %{100 * r2:.0f}'ini açıklıyor")`, en: WS.en + `\nols = LinearRegression().fit(Xs, y_tr)\nr2 = ols.score(Xs, y_tr)\nprint(f"The model explains {100 * r2:.0f}% of wage differences")` };
  U.push({
    id: "m3-u1", minutes: 25, packages: PK,
    title: { tr: "EKK'yı öngörü için kullanmak", en: "Using OLS for prediction" },
    blurb: { tr: "Ekonometriden bildiğin doğrusal regresyonu bir öngörü aracı olarak kullanmak: eğitim ve test R², standartlaştırma.", en: "Using the linear regression you know from econometrics as a prediction tool: training and test R², standardisation." },
    terms: [{ tr: "en küçük kareler (EKK)", en: "ordinary least squares (OLS)" }, { tr: "belirlilik katsayısı (R²)", en: "coefficient of determination (R²)" }, { tr: "standartlaştırma", en: "standardisation" }],
    concept: C0, playground: null,
    cells: [
      {
        id: "m3-u1-c1", kind: "run",
        task: { tr: "100 kişilik eğitim verisiyle 40 değişkenli bir EKK modeli kuruyoruz. R²'yi hem eğitimde hem 5.000 yeni kişide ölçüyoruz. Önce tahmin et.", en: "We build a 40-variable OLS model on 100 training people and measure R² both in training and on 5,000 new people. Predict first." },
        predict: { q: { tr: "Eğitim R² ile test R² nasıl çıkar?", en: "How do training R² and test R² compare?" }, options: { tr: ["Eğitimde yüksek (≈ 0,8), testte belirgin biçimde düşük (≈ 0,5)", "İkisi de ≈ 0,8", "Test R² eğitimden yüksek"], en: ["High in training (≈ 0.8), clearly lower in test (≈ 0.5)", "Both ≈ 0.8", "Test R² higher than training"] }, answer: 0, explain: { tr: "40 katsayıyı 100 kişiyle kestirmek, modelin eğitim verisinin gürültüsüne de uymasına yol açar. Yeni kişilerde bu “uyum” kaybolur.", en: "Estimating 40 coefficients from 100 people makes the model fit the training noise too. With new people that “fit” disappears." } },
        code: { tr: WS.tr + `\nekk = LinearRegression().fit(Xs, y_egt)\nprint("Eğitim R²:", round(ekk.score(Xs, y_egt), 3))\nprint("Test R²:  ", round(ekk.score(Xt, y_tst), 3))`, en: WS.en + `\nols = LinearRegression().fit(Xs, y_tr)\nprint("Training R²:", round(ols.score(Xs, y_tr), 3))\nprint("Test R²:    ", round(ols.score(Xt, y_te), 3))` },
        after: { tr: "Eğitim R² 0,81, test R² 0,52. Ekonometride raporladığın R² eğitim R²'sidir; öngörüde ise asıl soru test R²'sidir. Bu ünitenin ve modülün geri kalanının sorusu bu farkı nasıl kapatacağımız.", en: "Training R² 0.81, test R² 0.52. The R² you report in econometrics is training R²; in prediction the real question is test R². How to close this gap is the question for the rest of this unit and module." }
      },
      {
        id: "m3-u1-c2", kind: "audit",
        task: { tr: "YZ modeli kurdu ve yeni çalışanlar için ne kadar iyi öngöreceğini söyledi. Hatalı satırı bul ve düzelt: <code>r2</code>, modelin görmediği test verisinde ölçülsün.", en: "The AI built the model and said how well it will predict new employees. Find the faulty line and fix it: <code>r2</code> should be measured on the test data the model has not seen." },
        ai: {
          prompt: { tr: "40 değişkenle bir ücret modeli kur. Yeni işe alacağımız kişilerin ücretlerini ne kadar iyi öngörür?", en: "Build a wage model with 40 variables. How well will it predict the wages of the people we hire next?" },
          reply: { tr: "Modeli kurup R²'ye bakalım:", en: "Let us build the model and look at R²:" },
          code: U1A,
          claim: { tr: "R² = 0,81: model yeni çalışanların ücret farklılıklarının da %81'ini açıklayacaktır.", en: "R² = 0.81: the model will also explain 81% of wage differences among new employees." }
        },
        bugLines: [ln(U1A.tr, "r2 = ")],
        lineExplain: { tr: "R² eğitim verisinde ölçülüyor. Model bu 100 kişiyi “görmüş”; yeni kişilerdeki başarısını söylemez. Ekonometri raporlarında gördüğün R² tam olarak budur ve öngörü için iyimserdir.", en: "R² is measured on the training data. The model has “seen” these 100 people; it says nothing about new people. This is exactly the R² you see in econometric reports, and it is optimistic for prediction." },
        hints: [{ tr: "<code>ekk.score(Xt, y_tst)</code>: test verisindeki R².", en: "<code>ols.score(Xt, y_te)</code>: R² on the test data." }],
        solution: { tr: WS.tr + `\nekk = LinearRegression().fit(Xs, y_egt)\nr2 = ekk.score(Xt, y_tst)\nprint(f"Model yeni kişilerde ücret farklılıklarının %{100 * r2:.0f}'ini açıklıyor")`, en: WS.en + `\nols = LinearRegression().fit(Xs, y_tr)\nr2 = ols.score(Xt, y_te)\nprint(f"On new people the model explains {100 * r2:.0f}% of wage differences")` },
        checks: [{ py: { tr: "abs(r2 - ekk.score(Xt, y_tst)) < 1e-9", en: "abs(r2 - ols.score(Xt, y_te)) < 1e-9" }, msg: { tr: "<code>r2</code>, modelin test verisindeki R²'si olmalı.", en: "<code>r2</code> should be the model's R² on the test data." } }],
        after: { tr: "Yeni kişilerde R² yalnızca 0,52. YZ'nin “%81” iddiası, eğitim R²'sini öngörü başarısı gibi sunuyordu. Bir R² gördüğünde sor: <b>hangi veride?</b>", en: "On new people R² is only 0.52. The AI's “81%” presented training R² as predictive success. Whenever you see an R², ask: <b>on which data?</b>" }
      },
      {
        id: "m3-u1-c3", kind: "fill",
        task: { tr: "Test hatasını hata kareleri ortalamasıyla (HKO) da hesapla ve indirgenemez hatayla (0,09) karşılaştır.", en: "Also compute the test error as a mean squared error (MSE) and compare it with the irreducible error (0.09)." },
        code: { tr: WS.tr + `\nekk = LinearRegression().fit(Xs, y_egt)\ntest_hko = hko(ekk.predict(Xt), ___)\nprint("Test HKO:", round(test_hko, 3), "| indirgenemez hata:", SIG ** 2)`, en: WS.en + `\nols = LinearRegression().fit(Xs, y_tr)\ntest_mse = mse(ols.predict(Xt), ___)\nprint("Test MSE:", round(test_mse, 3), "| irreducible error:", SIG ** 2)` },
        solution: { tr: WS.tr + `\nekk = LinearRegression().fit(Xs, y_egt)\ntest_hko = hko(ekk.predict(Xt), y_tst)\nprint("Test HKO:", round(test_hko, 3), "| indirgenemez hata:", SIG ** 2)`, en: WS.en + `\nols = LinearRegression().fit(Xs, y_tr)\ntest_mse = mse(ols.predict(Xt), y_te)\nprint("Test MSE:", round(test_mse, 3), "| irreducible error:", SIG ** 2)` },
        hints: [{ tr: "Öngörüleri, test verisinin gerçek değerleriyle karşılaştır: <code>y_tst</code>.", en: "Compare the predictions with the test data's actual values: <code>y_te</code>." }],
        checks: [{ py: { tr: "abs(test_hko - hko(ekk.predict(Xt), y_tst)) < 1e-12", en: "abs(test_mse - mse(ols.predict(Xt), y_te)) < 1e-12" }, msg: { tr: "<code>test_hko</code>, test öngörüleri ile <code>y_tst</code> arasındaki HKO olmalı.", en: "<code>test_mse</code> should be the MSE between the test predictions and <code>y_te</code>." } }],
        after: { tr: "Test HKO 0,136; indirgenemez hata 0,09. Aradaki 0,046'lık fark, 40 katsayıyı 100 kişiyle kestirmenin bedeli. Bu modülde bu bedeli azaltmanın yollarını göreceğiz.", en: "Test MSE is 0.136; the irreducible error is 0.09. The 0.046 gap is the price of estimating 40 coefficients from 100 people. This module shows ways to reduce that price." }
      },
      {
        id: "m3-u1-c4", kind: "interpret",
        task: { tr: "YZ modeli yorumladı. Hangi cümleler yanlış ya da abartılı?", en: "The AI interpreted the model. Which sentences are wrong or overclaimed?" },
        prompt: { tr: "40 değişkenli EKK: eğitim R² 0,81, test R² 0,52. Anket 5'in standartlaştırılmış katsayısı −0,09. Yorumlar mısın?", en: "40-variable OLS: training R² 0.81, test R² 0.52. Survey 5's standardised coefficient is −0.09. Can you interpret this?" },
        sentences: {
          tr: ["Model eğitim verisinde yeni kişilere göre çok daha iyi görünüyor; aradaki fark aşırı uyumun işareti.", "Anket 5'in katsayısı sıfırdan farklı olduğuna göre bu soru ücretleri düşürüyor.", "Test R²'si, modelin yeni kişilerde ücret farklılıklarının yaklaşık yarısını açıkladığını söylüyor.", "Daha fazla değişken eklersek test hatası mutlaka düşer."],
          en: ["The model looks much better on the training data than on new people; the gap is a sign of overfitting.", "Since Survey 5's coefficient is non-zero, this question lowers wages.", "The test R² says the model explains about half of wage differences among new people.", "If we add more variables the test error will certainly fall."]
        },
        bad: [1, 3],
        explain: {
          tr: ["Doğru.", "<b>Yanlış:</b> bu dünyada Anket 5'in gerçek etkisi sıfır; −0,09, 100 kişilik örneklemin gürültüsü. Üstelik bir öngörü modelinin katsayısı nedensel bir etki göstermez (Modül 1).", "Doğru.", "<b>Yanlış:</b> ilgisiz değişkenler eklemek eğitim hatasını düşürür, test hatasını artırır. Ünite 2'de göreceksin."],
          en: ["Correct.", "<b>Wrong:</b> in this world Survey 5's true effect is zero; −0.09 is noise in a 100-person sample. Moreover, a prediction model's coefficient does not show a causal effect (Module 1).", "Correct.", "<b>Wrong:</b> adding irrelevant variables lowers training error and raises test error. You will see this in Unit 2."]
        }
      }
    ],
    quiz: [
      { q: { tr: "Ekonometri raporlarındaki R² genellikle hangi veride ölçülür?", en: "On which data is the R² in econometric reports usually measured?" }, options: { tr: ["Modelin kestirildiği veride", "Yeni bir test verisinde", "Çapraz doğrulamayla"], en: ["The data the model was estimated on", "A new test set", "By cross-validation"] }, answer: 0, explain: { tr: "Bu yüzden öngörü başarısı için iyimserdir.", en: "That is why it is optimistic about predictive success." } },
      { q: { tr: "Değişkenleri standartlaştırırken ortalama ve standart sapma hangi veriden alınmalı?", en: "When standardising variables, which data should the mean and standard deviation come from?" }, options: { tr: ["Eğitim verisinden", "Test verisinden", "İkisinin birleşiminden"], en: ["The training data", "The test data", "Both combined"] }, answer: 0, explain: { tr: "Test verisi model kurulurken bilinmiyormuş gibi davranılmalı (Modül 2, Ünite 7).", en: "The test data must be treated as unknown while building the model (Module 2, Unit 7)." } },
      { q: { tr: "Test HKO'su indirgenemez hatanın ne kadar üstünde olabilir?", en: "How far above the irreducible error can test MSE be?" }, options: { tr: ["Hiç altına inemez; üstündeki kısım modelin kestirim hatasıdır", "Altına inebilir", "Her zaman ona eşittir"], en: ["It can never go below it; the excess is the model's estimation error", "It can go below it", "It always equals it"] }, answer: 0, explain: { tr: "Modül 2, Ünite 4.", en: "Module 2, Unit 4." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 2 — Çok değişken, az gözlem                                      */
  /* =================================================================== */
  U.push({
    id: "m3-u2", minutes: 25, packages: PK,
    title: { tr: "Çok değişken, az gözlem", en: "Many variables, few observations" },
    blurb: { tr: "İlgisiz değişkenler eklendikçe EKK'nın eğitim hatası düşer, test hatası yükselir. Veri arttıkça sorun küçülür.", en: "As irrelevant variables are added, OLS training error falls and test error rises. More data shrink the problem." },
    terms: [{ tr: "değişken sayısı (p)", en: "number of variables (p)" }, { tr: "gözlem sayısı (n)", en: "number of observations (n)" }, { tr: "kestirim varyansı", en: "estimation variance" }],
    concept: C0,
    playground: { type: "manyVars", intro: { tr: "Modeldeki değişken sayısını 5'ten 40'a çıkar (ilk 5'i gerçek). Sonra gözlem sayısını değiştir.", en: "Raise the number of variables in the model from 5 to 40 (the first 5 are real). Then change the number of observations." }, takeaway: { tr: "Az veriyle her yeni ilgisiz değişken test hatasını artırır; çok veriyle zarar küçülür.", en: "With few data every new irrelevant variable raises test error; with many data the damage shrinks." } },
    cells: [
      {
        id: "m3-u2-c1", kind: "run",
        task: { tr: "Modeli önce yalnızca 5 gerçek değişkenle, sonra ilgisiz değişkenler ekleyerek kuruyoruz. Önce tahmin et.", en: "We build the model first with only the 5 real variables, then adding irrelevant ones. Predict first." },
        predict: { q: { tr: "Değişken sayısı 5'ten 40'a çıkarken ne olur?", en: "What happens as the number of variables goes from 5 to 40?" }, options: { tr: ["Eğitim hatası düşer, test hatası yükselir", "İkisi de düşer", "İkisi de yükselir"], en: ["Training error falls, test error rises", "Both fall", "Both rise"] }, answer: 0, explain: { tr: "Her yeni değişken eğitim verisine biraz daha uyum sağlar; ama ilgisiz değişkenin katsayısı yalnızca gürültüyü öğrenir ve yeni kişilerde hata katar.", en: "Each new variable fits the training data a little better; but an irrelevant variable's coefficient only learns noise and adds error on new people." } },
        code: { tr: WS.tr + `\nfor p in [5, 10, 20, 30, 40]:\n    m = LinearRegression().fit(Xs[:, :p], y_egt)\n    print(f"{p:2d} değişken  eğitim HKO {hko(m.predict(Xs[:, :p]), y_egt):.3f}  test HKO {hko(m.predict(Xt[:, :p]), y_tst):.3f}")`, en: WS.en + `\nfor p in [5, 10, 20, 30, 40]:\n    m = LinearRegression().fit(Xs[:, :p], y_tr)\n    print(f"{p:2d} variables  training MSE {mse(m.predict(Xs[:, :p]), y_tr):.3f}  test MSE {mse(m.predict(Xt[:, :p]), y_te):.3f}")` },
        after: { tr: "5 değişkenle test HKO 0,099; 40 değişkenle 0,136. Eğitim hatası ise 0,084'ten 0,062'ye indi: indirgenemez hatanın (0,09) bile altına. Model gürültüyü öğreniyor.", en: "With 5 variables test MSE is 0.099; with 40 it is 0.136. Training error fell from 0.084 to 0.062: below even the irreducible error (0.09). The model is learning noise." }
      },
      {
        id: "m3-u2-c2", kind: "run",
        task: { tr: "Aynı 40 değişkenli modeli bu kez 1.000 kişiyle kuruyoruz. Önce tahmin et.", en: "We build the same 40-variable model, this time with 1,000 people. Predict first." },
        predict: { q: { tr: "1.000 kişiyle kurulan 40 değişkenli EKK'nın test HKO'su kaç civarında çıkar?", en: "What is the test MSE of a 40-variable OLS built on 1,000 people, roughly?" }, options: { tr: ["İndirgenemez hataya yakın (≈ 0,10)", "100 kişidekiyle aynı (≈ 0,14)", "Daha kötü (≈ 0,20)"], en: ["Close to the irreducible error (≈ 0.10)", "Same as with 100 people (≈ 0.14)", "Worse (≈ 0.20)"] }, answer: 0, explain: { tr: "Gözlem başına kestirilen katsayı sayısı azalınca gürültü ortalamada silinir; ilgisiz katsayılar sıfıra yaklaşır.", en: "With fewer coefficients per observation, noise averages out and irrelevant coefficients approach zero." } },
        code: { tr: W.tr + `\nX_cok, y_cok = ciz(1000)\nsc2 = StandardScaler().fit(X_cok)\nm = LinearRegression().fit(sc2.transform(X_cok), y_cok)\nprint("1.000 kişi, 40 değişken, test HKO:", round(hko(m.predict(sc2.transform(X_tst)), y_tst), 3))`, en: W.en + `\nX_big, y_big = draw(1000)\nsc2 = StandardScaler().fit(X_big)\nm = LinearRegression().fit(sc2.transform(X_big), y_big)\nprint("1,000 people, 40 variables, test MSE:", round(mse(m.predict(sc2.transform(X_te)), y_te), 3))` },
        after: { tr: "Test HKO yaklaşık 0,096: indirgenemez hataya çok yakın. Sorun EKK'nın kendisi değil, <b>az veriyle çok katsayı</b> kestirmek. Ekonomide veri çoğu zaman azdır: 40 yıllık yıllık veri 40 gözlemdir.", en: "Test MSE is about 0.096: very close to the irreducible error. The problem is not OLS itself but estimating <b>many coefficients from few data</b>. In economics data are often scarce: 40 years of annual data are 40 observations." }
      },
      {
        id: "m3-u2-c3", kind: "compare",
        task: { tr: "İki YZ aynı soruya farklı yanıt verdi. Hangisine güvenirsin?", en: "Two AIs answered the same question differently. Which do you trust?" },
        prompt: { tr: "100 kişilik verimizde 40 aday değişken var. Hangisini kullanalım?", en: "Our 100-person data have 40 candidate variables. Which should we use?" },
        options: [
          { reply: { tr: "Hepsini kullanın: her değişken bilgi ekler.", en: "Use them all: every variable adds information." }, code: { tr: "m40 = LinearRegression().fit(Xs, y_egt)\nprint(m40.score(Xs, y_egt))   # 0,81 — en yüksek R²", en: "m40 = LinearRegression().fit(Xs, y_tr)\nprint(m40.score(Xs, y_tr))   # 0.81 — the highest R²" }, claim: { tr: "40 değişkenli modelin R²'si en yüksek; en iyi model bu.", en: "The 40-variable model has the highest R²; it is the best model." } },
          { reply: { tr: "Eğitim R²'si değişken eklendikçe hep artar; karar test hatasıyla verilmeli.", en: "Training R² always rises as variables are added; the decision must use test error." }, code: { tr: "for p in [5, 10, 20, 40]:\n    m = LinearRegression().fit(Xs[:, :p], y_egt)\n    print(p, hko(m.predict(Xt[:, :p]), y_tst))", en: "for p in [5, 10, 20, 40]:\n    m = LinearRegression().fit(Xs[:, :p], y_tr)\n    print(p, mse(m.predict(Xt[:, :p]), y_te))" }, claim: { tr: "İlgisiz değişkenler test hatasını artırıyor. Ama gerçek hayatta hangilerinin ilgisiz olduğunu bilmiyoruz; bunu veriden öğrenen yöntemlere ihtiyaç var.", en: "Irrelevant variables raise test error. But in real life we don't know which are irrelevant; we need methods that learn this from data." } }
        ],
        answer: 1,
        reasons: { tr: ["A daha çok değişken kullandığı için", "A eğitim R²'sine bakıyor; B yeni veride ölçüyor ve gerçek hayattaki sınırı da söylüyor", "B daha kısa olduğu için"], en: ["Because A uses more variables", "A looks at training R²; B measures on new data and also states the real-life limitation", "Because B is shorter"] },
        reasonAnswer: 1,
        explain: { tr: "B'nin son cümlesi önemli: burada gerçek beşi biz biliyoruz, ama gerçek veride bilmeyiz. Ünite 3 ve 4'teki yöntemler bu seçimi veriye bırakır.", en: "B's last sentence matters: here we know the real five, but with real data we don't. The methods in Units 3 and 4 leave this choice to the data." }
      }
    ],
    quiz: [
      { q: { tr: "Modele ilgisiz bir değişken eklemek eğitim hatasını nasıl etkiler?", en: "How does adding an irrelevant variable affect training error?" }, options: { tr: ["Düşürür ya da aynı bırakır", "Artırır", "Etkilemez"], en: ["Lowers it or leaves it unchanged", "Raises it", "No effect"] }, answer: 0, explain: { tr: "Daha esnek bir model eğitim verisine en az aynı ölçüde uyar.", en: "A more flexible model fits the training data at least as well." } },
      { q: { tr: "EKK'nın test hatası ne zaman indirgenemez hataya yaklaşır?", en: "When does OLS test error approach the irreducible error?" }, options: { tr: ["Gözlem sayısı değişken sayısına göre çok büyükken", "Değişken sayısı arttıkça", "Hiçbir zaman"], en: ["When observations far outnumber variables", "As the number of variables grows", "Never"] }, answer: 0, explain: { tr: "1.000 kişide 0,096'ya indi.", en: "With 1,000 people it fell to 0.096." } },
      { q: { tr: "Gerçek hayatta neden “yalnızca gerçek değişkenleri kullan” diyemeyiz?", en: "Why can't we just “use only the real variables” in real life?" }, options: { tr: ["Hangilerinin gerçek olduğunu bilmeyiz", "Kod buna izin vermez", "Gerçek değişken yoktur"], en: ["We don't know which ones are real", "The code doesn't allow it", "There are no real variables"] }, answer: 0, explain: { tr: "Bu seçimi veriden yapan yöntemlere ihtiyaç var.", en: "We need methods that make this choice from the data." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 3 — Ridge                                                        */
  /* =================================================================== */
  const U3A = { tr: W.tr + `\nsc = StandardScaler().fit(np.vstack([X_egt, X_tst]))\nXs, Xt = sc.transform(X_egt), sc.transform(X_tst)\nridge = Ridge(alpha=10).fit(Xs, y_egt)\nprint("Ridge test HKO:", round(hko(ridge.predict(Xt), y_tst), 4))`, en: W.en + `\nsc = StandardScaler().fit(np.vstack([X_tr, X_te]))\nXs, Xt = sc.transform(X_tr), sc.transform(X_te)\nridge = Ridge(alpha=10).fit(Xs, y_tr)\nprint("Ridge test MSE:", round(mse(ridge.predict(Xt), y_te), 4))` };
  U.push({
    id: "m3-u3", minutes: 30, packages: PK,
    title: { tr: "Ridge: katsayılara ceza", en: "Ridge: penalising coefficients" },
    blurb: { tr: "Hata kareleri toplamına katsayıların karelerinden oluşan bir ceza eklemek. λ, küçülme ve neden önce standartlaştırırız.", en: "Adding a penalty made of squared coefficients to the sum of squared errors. λ, shrinkage and why we standardise first." },
    terms: [{ tr: "düzenlileştirme", en: "regularisation" }, { tr: "Ridge regresyonu", en: "Ridge regression" }, { tr: "ceza parametresi (λ)", en: "penalty parameter (λ)" }, { tr: "küçülme", en: "shrinkage" }],
    concept: C0,
    playground: { type: "ridgeShrink", intro: { tr: "λ'yı küçükten büyüğe kaydır. Katsayı çubuklarının nasıl birlikte küçüldüğüne ve test hatasına bak.", en: "Slide λ from small to large. Watch the coefficient bars shrink together and the test error change." }, takeaway: { tr: "Biraz küçülme test hatasını düşürür; çok fazlası modeli işe yaramaz kılar. Hiçbir katsayı tam sıfır olmaz.", en: "A little shrinkage lowers test error; too much makes the model useless. No coefficient becomes exactly zero." } },
    cells: [
      {
        id: "m3-u3-c1", kind: "run",
        task: { tr: "Aynı 40 değişkenle EKK ve λ = 10 olan bir Ridge modeli kuruyoruz. Önce tahmin et.", en: "We build OLS and a Ridge model with λ = 10 on the same 40 variables. Predict first." },
        predict: { q: { tr: "Ridge'in test hatası EKK'ya göre nasıl çıkar?", en: "How does Ridge's test error compare with OLS?" }, options: { tr: ["Daha düşük", "Aynı", "Daha yüksek"], en: ["Lower", "The same", "Higher"] }, answer: 0, explain: { tr: "Ceza, katsayıların gürültüyü izlemesini frenler; varyans azalır, biraz yanlılık eklenir. Bu örnekte kazanç kayıptan büyük.", en: "The penalty stops coefficients chasing noise; variance falls and a little bias is added. Here the gain outweighs the loss." } },
        code: { tr: WS.tr + `\nekk = LinearRegression().fit(Xs, y_egt)\nridge = Ridge(alpha=10).fit(Xs, y_egt)\nfor ad, m in [("EKK", ekk), ("Ridge", ridge)]:\n    print(f"{ad:6s} test HKO {hko(m.predict(Xt), y_tst):.3f}   katsayıların mutlak toplamı {np.abs(m.coef_).sum():.2f}")`, en: WS.en + `\nols = LinearRegression().fit(Xs, y_tr)\nridge = Ridge(alpha=10).fit(Xs, y_tr)\nfor name, m in [("OLS", ols), ("Ridge", ridge)]:\n    print(f"{name:6s} test MSE {mse(m.predict(Xt), y_te):.3f}   sum of absolute coefficients {np.abs(m.coef_).sum():.2f}")` },
        after: { tr: "Ridge test hatasını 0,136'dan 0,122'ye indirdi; katsayıların toplam büyüklüğü 2,0'dan 1,5'e küçüldü. Ceza, modeli “daha temkinli” yaptı.", en: "Ridge lowered test error from 0.136 to 0.122; the total size of the coefficients shrank from 2.0 to 1.5. The penalty made the model “more cautious”." }
      },
      {
        id: "m3-u3-c2", kind: "audit",
        task: { tr: "YZ Ridge modelini kurdu ama ölçekleme adımında bir kural çiğnendi. Hatalı satırı bul ve düzelt: ölçekleme değerleri yalnızca eğitim verisinden öğrenilsin.", en: "The AI built the Ridge model but broke a rule in the scaling step. Find the faulty line and fix it: scaling values must be learned from the training data only." },
        ai: {
          prompt: { tr: "Değişkenleri standartlaştırıp λ = 10 ile bir Ridge modeli kur ve test hatasını ver.", en: "Standardise the variables, build a Ridge model with λ = 10 and give the test error." },
          reply: { tr: "Ölçek tutarlı olsun diye tüm veriyi birlikte standartlaştırdım:", en: "I standardised all the data together so the scale is consistent:" },
          code: U3A,
          claim: { tr: "Eğitim ve test aynı ölçekte; test HKO güvenilir.", en: "Training and test are on the same scale; the test MSE is reliable." }
        },
        bugLines: [ln(U3A.tr, "np.vstack")],
        lineExplain: { tr: "Ölçekleyici, eğitim ve test verisini birleştirerek ortalama ve standart sapmayı hesaplıyor: test verisinin bilgisi modele sızıyor (Modül 2, Ünite 7). Bu örnekte sayısal fark küçük, ama zaman serilerinde aynı hata geleceğin bilgisini geçmişe taşır.", en: "The scaler computes the mean and standard deviation from training and test combined: information from the test data leaks into the model (Module 2, Unit 7). Here the numerical difference is small, but in time series the same mistake moves future information into the past." },
        hints: [{ tr: "<code>StandardScaler().fit(X_egt)</code>; test verisine yalnızca <code>transform</code> uygulanır.", en: "<code>StandardScaler().fit(X_tr)</code>; only <code>transform</code> is applied to the test data." }],
        solution: { tr: W.tr + `\nsc = StandardScaler().fit(X_egt)\nXs, Xt = sc.transform(X_egt), sc.transform(X_tst)\nridge = Ridge(alpha=10).fit(Xs, y_egt)\nprint("Ridge test HKO:", round(hko(ridge.predict(Xt), y_tst), 4))`, en: W.en + `\nsc = StandardScaler().fit(X_tr)\nXs, Xt = sc.transform(X_tr), sc.transform(X_te)\nridge = Ridge(alpha=10).fit(Xs, y_tr)\nprint("Ridge test MSE:", round(mse(ridge.predict(Xt), y_te), 4))` },
        checks: [
          { py: { tr: "np.allclose(sc.mean_, X_egt.mean(axis=0)) and np.allclose(sc.scale_, X_egt.std(axis=0))", en: "np.allclose(sc.mean_, X_tr.mean(axis=0)) and np.allclose(sc.scale_, X_tr.std(axis=0))" }, msg: { tr: "Ölçekleyici yalnızca <code>X_egt</code> ile kurulmalı.", en: "The scaler should be fitted on <code>X_tr</code> only." } },
          { py: { tr: "np.allclose(ridge.coef_, Ridge(alpha=10).fit(sc.transform(X_egt), y_egt).coef_)", en: "np.allclose(ridge.coef_, Ridge(alpha=10).fit(sc.transform(X_tr), y_tr).coef_)" }, msg: { tr: "Ridge modeli, eğitimden öğrenilen ölçekle standartlaştırılmış veriyle kurulmalı.", en: "The Ridge model should be built on data standardised with the training scale." } }
        ],
        after: { tr: "Ridge'de standartlaştırma bir zorunluluktur: ceza katsayıların büyüklüğüne bakar ve büyüklük birime bağlıdır (Modül 1, Ünite 8). Ölçekleme değerleri ise her zaman yalnızca eğitim verisinden öğrenilir.", en: "Standardisation is mandatory for Ridge: the penalty looks at coefficient size, and size depends on units (Module 1, Unit 8). The scaling values are always learned from the training data only." }
      },
      {
        id: "m3-u3-c3", kind: "fill",
        task: { tr: "Ridge'in özel bir durumunu göster: λ'yı öyle seç ki Ridge'in katsayıları EKK'nınkilerle aynı çıksın.", en: "Show a special case of Ridge: choose λ so that Ridge's coefficients equal those of OLS." },
        code: { tr: WS.tr + `\nekk = LinearRegression().fit(Xs, y_egt)\nr0 = Ridge(alpha=___).fit(Xs, y_egt)\nprint("Katsayılar aynı mı?", np.allclose(r0.coef_, ekk.coef_, atol=1e-6))`, en: WS.en + `\nols = LinearRegression().fit(Xs, y_tr)\nr0 = Ridge(alpha=___).fit(Xs, y_tr)\nprint("Same coefficients?", np.allclose(r0.coef_, ols.coef_, atol=1e-6))` },
        solution: { tr: WS.tr + `\nekk = LinearRegression().fit(Xs, y_egt)\nr0 = Ridge(alpha=0).fit(Xs, y_egt)\nprint("Katsayılar aynı mı?", np.allclose(r0.coef_, ekk.coef_, atol=1e-6))`, en: WS.en + `\nols = LinearRegression().fit(Xs, y_tr)\nr0 = Ridge(alpha=0).fit(Xs, y_tr)\nprint("Same coefficients?", np.allclose(r0.coef_, ols.coef_, atol=1e-6))` },
        hints: [{ tr: "Ceza yoksa Ridge, EKK'dır.", en: "Without a penalty, Ridge is OLS." }],
        checks: [{ py: { tr: "np.allclose(r0.coef_, ekk.coef_, atol=1e-6)", en: "np.allclose(r0.coef_, ols.coef_, atol=1e-6)" }, msg: { tr: "Ridge katsayıları EKK katsayılarıyla aynı olmalı.", en: "Ridge's coefficients should equal OLS's." } }],
        after: { tr: "λ = 0'da ceza yok: Ridge = EKK. λ büyüdükçe katsayılar sıfıra doğru çekilir. Yani Ridge, EKK'yı da içeren bir model ailesidir; λ bu ailede nerede duracağımızı söyler.", en: "At λ = 0 there is no penalty: Ridge = OLS. As λ grows the coefficients are pulled towards zero. Ridge is a family of models that includes OLS; λ says where in the family we stand." }
      },
      {
        id: "m3-u3-c4", kind: "interpret",
        task: { tr: "YZ Ridge sonuçlarını yorumladı. Hangi cümleler yanlış?", en: "The AI interpreted the Ridge results. Which sentences are wrong?" },
        prompt: { tr: "λ = 10 olan Ridge: test HKO 0,122 (EKK 0,136). Katsayılar küçüldü ama hiçbiri sıfır değil. Yorumlar mısın?", en: "Ridge with λ = 10: test MSE 0.122 (OLS 0.136). The coefficients shrank but none is zero. Can you interpret this?" },
        sentences: {
          tr: ["Ridge, katsayıları küçülterek varyansı azalttı ve test hatası düştü.", "Ridge 40 değişkenin hangilerinin önemsiz olduğunu belirledi ve onları modelden çıkardı.", "λ ne kadar büyük olursa model o kadar iyi olur.", "Ridge'in katsayıları EKK'ya göre yanlıdır; bu bilinçli bir takastır."],
          en: ["Ridge reduced variance by shrinking the coefficients and the test error fell.", "Ridge identified which of the 40 variables are unimportant and removed them from the model.", "The larger λ, the better the model.", "Ridge's coefficients are biased compared with OLS; this is a deliberate trade-off."]
        },
        bad: [1, 2],
        explain: {
          tr: ["Doğru.", "<b>Yanlış:</b> Ridge hiçbir katsayıyı tam sıfır yapmaz; değişken seçmez. Bunu yapan yöntem Lasso (Ünite 4).", "<b>Yanlış:</b> çok büyük λ bütün katsayıları sıfıra iter; model ortalamayı öngörür. Test hatası λ'ya göre U çizer.", "Doğru: yanlılık–varyans dengesi (Modül 2, Ünite 5)."],
          en: ["Correct.", "<b>Wrong:</b> Ridge never sets a coefficient exactly to zero; it does not select variables. Lasso does (Unit 4).", "<b>Wrong:</b> a very large λ pushes all coefficients to zero; the model predicts the mean. Test error traces a U in λ.", "Correct: the bias–variance trade-off (Module 2, Unit 5)."]
        }
      }
    ],
    quiz: [
      { q: { tr: "Ridge'in cezası neye dayanır?", en: "What is Ridge's penalty based on?" }, options: { tr: ["Katsayıların kareleri toplamına", "Katsayıların mutlak değerleri toplamına", "Değişken sayısına"], en: ["The sum of squared coefficients", "The sum of absolute coefficients", "The number of variables"] }, answer: 0, explain: { tr: "λ Σβ².", en: "λ Σβ²." } },
      { q: { tr: "Ridge'den önce değişkenler neden standartlaştırılır?", en: "Why are variables standardised before Ridge?" }, options: { tr: ["Ceza katsayıların büyüklüğüne bakar ve büyüklük birime bağlıdır", "Kod hızlansın diye", "R² yükselsin diye"], en: ["The penalty looks at coefficient size, which depends on units", "To speed up the code", "To raise R²"] }, answer: 0, explain: { tr: "TL ile bin TL arasında katsayı 1.000 kat değişir.", en: "Between lira and thousands of lira a coefficient changes 1,000-fold." } },
      { q: { tr: "λ = 0 olan Ridge neye eşittir?", en: "What is Ridge with λ = 0?" }, options: { tr: ["EKK", "Lasso", "Ortalama öngörü"], en: ["OLS", "Lasso", "The mean prediction"] }, answer: 0, explain: { tr: "Ceza yoksa sıradan en küçük kareler.", en: "Without a penalty it is ordinary least squares." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 4 — Lasso                                                        */
  /* =================================================================== */
  const U4A = { tr: WS.tr + `\nlasso = Lasso(alpha=0.05, max_iter=20000).fit(Xs, y_egt)\nsecilen = [adlar[j] for j in range(P) if lasso.coef_[j] > 0]\nprint(len(secilen), "değişken seçildi:", secilen)`, en: WS.en + `\nlasso = Lasso(alpha=0.05, max_iter=20000).fit(Xs, y_tr)\nselected = [names[j] for j in range(P) if lasso.coef_[j] > 0]\nprint(len(selected), "variables selected:", selected)` };
  U.push({
    id: "m3-u4", minutes: 30, packages: PK,
    title: { tr: "Lasso: katsayıları sıfıra itmek", en: "Lasso: pushing coefficients to zero" },
    blurb: { tr: "Mutlak değer cezası bazı katsayıları tam sıfır yapar: değişken seçimi. Daire ile baklava diliminin geometrisi.", en: "An absolute-value penalty sets some coefficients exactly to zero: variable selection. The geometry of the circle and the diamond." },
    terms: [{ tr: "Lasso", en: "Lasso" }, { tr: "değişken seçimi", en: "variable selection" }, { tr: "seyreklik", en: "sparsity" }, { tr: "köşe çözümü", en: "corner solution" }],
    concept: C0,
    playground: { type: "lassoGeom", intro: { tr: "Ridge ile Lasso arasında geçiş yap ve katsayı bütçesini değiştir. Çözüm noktası nereye düşüyor?", en: "Switch between Ridge and Lasso and change the coefficient budget. Where does the solution land?" }, takeaway: { tr: "Lasso'nun köşeli kısıt bölgesi, çözümü sık sık bir eksene, yani bir katsayının tam sıfır olduğu yere götürür.", en: "Lasso's cornered constraint region often takes the solution onto an axis, where a coefficient is exactly zero." } },
    cells: [
      {
        id: "m3-u4-c1", kind: "run",
        task: { tr: "λ = 0,05 ile bir Lasso modeli kuruyoruz. Önce tahmin et.", en: "We build a Lasso model with λ = 0.05. Predict first." },
        predict: { q: { tr: "40 katsayıdan kaçı sıfırdan farklı kalır?", en: "How many of the 40 coefficients stay non-zero?" }, options: { tr: ["40'ı da", "Yaklaşık 12", "Tam 5"], en: ["All 40", "About 12", "Exactly 5"] }, answer: 1, explain: { tr: "Lasso katsayıların çoğunu tam sıfıra indirir. Gerçek beşin yanında birkaç ilgisiz değişken ve Yaş da modelde kalır: Lasso mükemmel bir seçici değildir.", en: "Lasso sets most coefficients exactly to zero. Alongside the real five, a few irrelevant variables and Age stay in: Lasso is not a perfect selector." } },
        code: { tr: WS.tr + `\nlasso = Lasso(alpha=0.05, max_iter=20000).fit(Xs, y_egt)\nprint("Sıfırdan farklı katsayı:", int(np.sum(lasso.coef_ != 0)), "/ 40")\nprint("Test HKO:", round(hko(lasso.predict(Xt), y_tst), 3))`, en: WS.en + `\nlasso = Lasso(alpha=0.05, max_iter=20000).fit(Xs, y_tr)\nprint("Non-zero coefficients:", int(np.sum(lasso.coef_ != 0)), "/ 40")\nprint("Test MSE:", round(mse(lasso.predict(Xt), y_te), 3))` },
        after: { tr: "12 değişken kaldı, test HKO 0,113: EKK'dan (0,136) ve λ = 10 olan Ridge'den (0,122) daha iyi. Gerçek dünyada çoğu değişkenin etkisi sıfırsa, onları atan bir yöntem avantajlıdır.", en: "12 variables remain, test MSE 0.113: better than OLS (0.136) and Ridge with λ = 10 (0.122). When most variables truly have zero effect, a method that drops them has an advantage." }
      },
      {
        id: "m3-u4-c2", kind: "audit",
        task: { tr: "YZ, Lasso'nun seçtiği değişkenleri listeledi ve bir sonuç çıkardı. Hatalı satırı bul ve düzelt: <code>secilen</code>, katsayısı sıfırdan farklı olan bütün değişkenleri içersin.", en: "The AI listed the variables Lasso selected and drew a conclusion. Find the faulty line and fix it: <code>selected</code> should contain every variable with a non-zero coefficient." },
        ai: {
          prompt: { tr: "λ = 0,05 olan Lasso hangi değişkenleri seçti?", en: "Which variables did Lasso with λ = 0.05 select?" },
          reply: { tr: "Katsayısı sıfırdan büyük olanları listeleyelim:", en: "Let us list those with a coefficient above zero:" },
          code: U4A,
          claim: { tr: "Deneyim² seçilmedi: ücret ile deneyim arasındaki ilişki doğrusal.", en: "Experience² was not selected: the relationship between wages and experience is linear." }
        },
        bugLines: [ln(U4A.tr, "coef_[j] > 0")],
        lineExplain: { tr: "<code>&gt; 0</code> yalnızca pozitif katsayıları alır. Deneyim²'nin katsayısı negatif (ücret önce artıp sonra düzleşir); seçildiği hâlde listeden düşüyor. Sıfırdan farklı olmak, işaretten bağımsızdır.", en: "<code>&gt; 0</code> keeps only positive coefficients. Experience²'s coefficient is negative (wages rise, then level off); it was selected but drops from the list. Being non-zero is independent of sign." },
        hints: [{ tr: "<code>lasso.coef_[j] != 0</code> ya da <code>abs(lasso.coef_[j]) &gt; 0</code>", en: "<code>lasso.coef_[j] != 0</code> or <code>abs(lasso.coef_[j]) &gt; 0</code>" }],
        solution: { tr: WS.tr + `\nlasso = Lasso(alpha=0.05, max_iter=20000).fit(Xs, y_egt)\nsecilen = [adlar[j] for j in range(P) if lasso.coef_[j] != 0]\nprint(len(secilen), "değişken seçildi:", secilen)`, en: WS.en + `\nlasso = Lasso(alpha=0.05, max_iter=20000).fit(Xs, y_tr)\nselected = [names[j] for j in range(P) if lasso.coef_[j] != 0]\nprint(len(selected), "variables selected:", selected)` },
        checks: [{ py: { tr: "set(secilen) == {adlar[j] for j in range(P) if lasso.coef_[j] != 0}", en: "set(selected) == {names[j] for j in range(P) if lasso.coef_[j] != 0}" }, msg: { tr: "<code>secilen</code>, katsayısı sıfırdan farklı (pozitif ya da negatif) bütün değişkenleri içermeli.", en: "<code>selected</code> should contain every variable with a non-zero (positive or negative) coefficient." } }],
        after: { tr: "Deneyim² seçilmiş, katsayısı negatif. YZ'nin “ilişki doğrusal” sonucu, kodundaki bir işaret hatasından doğdu. Küçük bir koşul, büyük bir iktisadi iddiaya dönüşebilir.", en: "Experience² was selected, with a negative coefficient. The AI's “the relationship is linear” came from a sign error in its code. A small condition can turn into a big economic claim." }
      },
      {
        id: "m3-u4-c3", kind: "run",
        task: { tr: "Cezayı iki katına çıkarıyoruz: λ = 0,1. Önce tahmin et.", en: "We double the penalty: λ = 0.1. Predict first." },
        predict: { q: { tr: "5 gerçek değişkenden kaçı modelde kalır?", en: "How many of the 5 real variables stay in the model?" }, options: { tr: ["5'i de", "3'ü", "Hiçbiri"], en: ["All 5", "3", "None"] }, answer: 1, explain: { tr: "Büyük λ, etkisi görece küçük olan gerçek değişkenleri de (Deneyim², Kıdem) sıfıra iter.", en: "A large λ also pushes real variables with relatively small effects (Experience², Tenure) to zero." } },
        code: { tr: WS.tr + `\nlasso = Lasso(alpha=0.1, max_iter=20000).fit(Xs, y_egt)\nfor j in range(P):\n    if lasso.coef_[j] != 0:\n        print(f"{adlar[j]:11s} {lasso.coef_[j]:.3f}")\nprint("Test HKO:", round(hko(lasso.predict(Xt), y_tst), 3))`, en: WS.en + `\nlasso = Lasso(alpha=0.1, max_iter=20000).fit(Xs, y_tr)\nfor j in range(P):\n    if lasso.coef_[j] != 0:\n        print(f"{names[j]:11s} {lasso.coef_[j]:.3f}")\nprint("Test MSE:", round(mse(lasso.predict(Xt), y_te), 3))` },
        after: { tr: "Yalnızca Eğitim, Deneyim ve Büyükşehir kaldı; test HKO 0,137'ye çıktı. λ çok büyük olunca model gerçek etkileri de kaçırır. Doğru λ'yı nasıl seçeceğimiz Ünite 5'in konusu.", en: "Only Education, Experience and Big city remain; test MSE rose to 0.137. With too large a λ the model misses real effects too. How to choose the right λ is the topic of Unit 5." }
      },
      {
        id: "m3-u4-c4", kind: "interpret",
        task: { tr: "YZ, λ = 0,1 olan Lasso'yu yorumladı. Hangi cümleler yanlış?", en: "The AI interpreted Lasso with λ = 0.1. Which sentences are wrong?" },
        prompt: { tr: "λ = 0,1 olan Lasso yalnızca Eğitim, Deneyim ve Büyükşehir'i seçti. Yorumlar mısın?", en: "Lasso with λ = 0.1 selected only Education, Experience and Big city. Can you interpret this?" },
        sentences: {
          tr: ["Kıdem modelde yok; demek ki kıdemin ücrete hiçbir etkisi yok.", "Bu λ'da Lasso, etkisi en güçlü üç değişkeni tuttu.", "Lasso'nun seçtiği üç değişken, ücreti belirleyen tek etkenlerdir.", "λ küçültülürse modele daha çok değişken girer."],
          en: ["Tenure is not in the model, so tenure has no effect on wages.", "At this λ Lasso kept the three variables with the strongest effects.", "The three variables Lasso selected are the only factors that determine wages.", "If λ is reduced, more variables enter the model."]
        },
        bad: [0, 2],
        explain: {
          tr: ["<b>Yanlış:</b> bu dünyada Kıdem'in gerçek etkisi 0,10. Lasso onu λ büyük olduğu için attı. <b>Seçilmemek, etkisiz olmak demek değildir.</b>", "Doğru: gerçek katsayıları en büyük olanlar Eğitim (0,30), Deneyim (0,25) ve Büyükşehir (0,12).", "<b>Yanlış:</b> Deneyim² ve Kıdem de ücreti belirliyor. Seçim λ'ya bağlıdır; “tek etken” iddiası verinin söylemediği bir şeydir.", "Doğru: katsayı yolunda λ küçüldükçe değişkenler teker teker girer."],
          en: ["<b>Wrong:</b> in this world Tenure's true effect is 0.10. Lasso dropped it because λ is large. <b>Not being selected does not mean having no effect.</b>", "Correct: the largest true coefficients are Education (0.30), Experience (0.25) and Big city (0.12).", "<b>Wrong:</b> Experience² and Tenure also determine wages. Selection depends on λ; “the only factors” is something the data do not say.", "Correct: along the coefficient path variables enter one by one as λ falls."]
        }
      }
    ],
    quiz: [
      { q: { tr: "Lasso'nun cezası neye dayanır?", en: "What is Lasso's penalty based on?" }, options: { tr: ["Katsayıların mutlak değerleri toplamına", "Katsayıların kareleri toplamına", "Gözlem sayısına"], en: ["The sum of absolute coefficients", "The sum of squared coefficients", "The number of observations"] }, answer: 0, explain: { tr: "λ Σ|β|.", en: "λ Σ|β|." } },
      { q: { tr: "Lasso'nun katsayıları tam sıfıra indirebilmesinin geometrik nedeni nedir?", en: "What is the geometric reason Lasso can set coefficients exactly to zero?" }, options: { tr: ["Kısıt bölgesinin eksenler üzerinde sivri köşeleri vardır", "Kısıt bölgesi dairedir", "Elipsler daha küçüktür"], en: ["Its constraint region has sharp corners on the axes", "Its constraint region is a circle", "The ellipses are smaller"] }, answer: 0, explain: { tr: "Çözüm köşeye düşünce bir katsayı sıfırdır: köşe çözümü.", en: "When the solution lands on a corner a coefficient is zero: a corner solution." } },
      { q: { tr: "Lasso bir değişkeni seçmediyse ne söyleyebiliriz?", en: "If Lasso did not select a variable, what can we say?" }, options: { tr: ["Bu λ'da, bu örneklemde öngörüye katkısı cezaya değmedi", "Değişkenin gerçek etkisi sıfırdır", "Değişken hatalı ölçülmüştür"], en: ["At this λ, in this sample, its predictive contribution was not worth the penalty", "Its true effect is zero", "It was measured wrongly"] }, answer: 0, explain: { tr: "Seçilmemek etkisizlik kanıtı değildir.", en: "Not being selected is not proof of no effect." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 5 — λ'yı seçmek                                                  */
  /* =================================================================== */
  const U5A = { tr: WS.tr + `\nkatlar = KFold(5, shuffle=True, random_state=1)   # çapraz doğrulama katları\nizgara = np.logspace(-3.5, 0.5, 60)                 # denenecek λ değerleri\nhatalar = [hko(Lasso(alpha=a, max_iter=20000).fit(Xs, y_egt).predict(Xt), y_tst) for a in izgara]\nen_iyi = izgara[int(np.argmin(hatalar))]\nprint("Seçilen λ:", round(en_iyi, 4), "| beklenen hata:", round(min(hatalar), 4))`, en: WS.en + `\nfolds = KFold(5, shuffle=True, random_state=1)    # cross-validation folds\ngrid = np.logspace(-3.5, 0.5, 60)                   # λ values to try\nerrors = [mse(Lasso(alpha=a, max_iter=20000).fit(Xs, y_tr).predict(Xt), y_te) for a in grid]\nbest = grid[int(np.argmin(errors))]\nprint("Chosen λ:", round(best, 4), "| expected error:", round(min(errors), 4))` };
  U.push({
    id: "m3-u5", minutes: 30, packages: PK,
    title: { tr: "λ'yı seçmek: çapraz doğrulama", en: "Choosing λ: cross-validation" },
    blurb: { tr: "λ'yı test verisine dokunmadan, çapraz doğrulamayla seçmek. Katsayı yolları ve üç yöntemin karşılaştırması.", en: "Choosing λ with cross-validation, without touching the test data. Coefficient paths and a comparison of the three methods." },
    terms: [{ tr: "ayar parametresi", en: "tuning parameter" }, { tr: "katsayı yolu", en: "coefficient path" }, { tr: "LassoCV / RidgeCV", en: "LassoCV / RidgeCV" }],
    concept: C0,
    playground: { type: "lambdaPath", intro: { tr: "λ'yı kaydırıp hangi değişkenlerin kaldığına bak. Sonra λ'yı çapraz doğrulamayla seçtir.", en: "Slide λ and see which variables remain. Then let cross-validation choose λ." }, takeaway: { tr: "λ bir ayar parametresidir: veriden değil, çapraz doğrulamayla seçilir. Test verisi en sona kalır.", en: "λ is a tuning parameter: it is chosen by cross-validation, not estimated. The test data are kept for the end." } },
    cells: [
      {
        id: "m3-u5-c1", kind: "run",
        task: { tr: "<code>LassoCV</code>, 60 farklı λ'yı 5-katlı çapraz doğrulamayla dener ve en iyisini seçer. Önce tahmin et.", en: "<code>LassoCV</code> tries 60 values of λ with 5-fold cross-validation and picks the best. Predict first." },
        predict: { q: { tr: "Çapraz doğrulamanın seçtiği λ ile kurulan modelin test hatası, mümkün olan en iyi λ'nınkine göre nasıl çıkar?", en: "How does the test error with the λ chosen by cross-validation compare with the best possible λ?" }, options: { tr: ["Ona yakın ama biraz yüksek", "Tam olarak aynı", "Çok daha kötü"], en: ["Close to it but slightly higher", "Exactly the same", "Much worse"] }, answer: 0, explain: { tr: "Çapraz doğrulama test verisini görmeden yaklaşık doğru yeri bulur. “En iyi λ”yı ancak test verisine bakarak bilebiliriz; bu da hile olur.", en: "Cross-validation finds roughly the right place without seeing the test data. We could only know the “best λ” by looking at the test data, which would be cheating." } },
        code: { tr: WS.tr + `\nkatlar = KFold(5, shuffle=True, random_state=1)\nmodel = LassoCV(alphas=np.logspace(-3.5, 0.5, 60), cv=katlar, max_iter=20000).fit(Xs, y_egt)\nprint("Seçilen λ:", round(model.alpha_, 4))\nprint("Sıfırdan farklı katsayı:", int(np.sum(model.coef_ != 0)))\nprint("Test HKO:", round(hko(model.predict(Xt), y_tst), 4))`, en: WS.en + `\nfolds = KFold(5, shuffle=True, random_state=1)\nmodel = LassoCV(alphas=np.logspace(-3.5, 0.5, 60), cv=folds, max_iter=20000).fit(Xs, y_tr)\nprint("Chosen λ:", round(model.alpha_, 4))\nprint("Non-zero coefficients:", int(np.sum(model.coef_ != 0)))\nprint("Test MSE:", round(mse(model.predict(Xt), y_te), 4))` },
        after: { tr: "Çapraz doğrulama λ ≈ 0,047 seçti; 13 değişken, test HKO 0,112. Test verisine bakarak seçilebilecek “en iyi” λ'nın hatası 0,107: aradaki fark küçük ve dürüst bir bedel.", en: "Cross-validation chose λ ≈ 0.047; 13 variables, test MSE 0.112. The “best” λ one could pick by looking at the test data gives 0.107: the gap is small and an honest price." }
      },
      {
        id: "m3-u5-c2", kind: "audit",
        task: { tr: "YZ λ'yı seçti ve modelin beklenen hatasını raporladı. Hatalı satırı bul ve düzelt: λ, <code>katlar</code> ile çapraz doğrulamayla seçilsin; <code>en_iyi</code> seçilen λ olsun.", en: "The AI chose λ and reported the model's expected error. Find the faulty line and fix it: λ should be chosen by cross-validation with <code>folds</code>; <code>best</code> should be the chosen λ." },
        ai: {
          prompt: { tr: "Lasso için en iyi λ'yı seç ve modelin yeni verideki beklenen hatasını söyle.", en: "Choose the best λ for Lasso and tell me the model's expected error on new data." },
          reply: { tr: "Her λ için test hatasını hesaplayıp en küçüğünü seçtim:", en: "I computed the test error for each λ and picked the smallest:" },
          code: U5A,
          claim: { tr: "Seçilen λ ile beklenen hata 0,107; yeni veride de bu doğrulukta öngörür.", en: "With the chosen λ the expected error is 0.107; it will predict new data this accurately." }
        },
        bugLines: [ln(U5A.tr, "hatalar = [")],
        lineExplain: { tr: "λ, test verisindeki hataya bakılarak seçiliyor. Test verisi artık model seçimine karışmış; raporlanan 0,107 iyimser bir sayı ve yeni verideki hatayı temsil etmiyor (Modül 2, Ünite 6).", en: "λ is chosen by looking at the error on the test data. The test data are now mixed into model choice; the reported 0.107 is optimistic and does not represent the error on new data (Module 2, Unit 6)." },
        hints: [{ tr: "<code>model = LassoCV(alphas=izgara, cv=katlar, max_iter=20000).fit(Xs, y_egt)</code> ve <code>en_iyi = model.alpha_</code>. Test hatasını yalnızca en sonda, seçilen modelle bir kez hesapla.", en: "<code>model = LassoCV(alphas=grid, cv=folds, max_iter=20000).fit(Xs, y_tr)</code> and <code>best = model.alpha_</code>. Compute the test error only at the end, once, with the chosen model." }],
        solution: { tr: WS.tr + `\nkatlar = KFold(5, shuffle=True, random_state=1)   # çapraz doğrulama katları\nizgara = np.logspace(-3.5, 0.5, 60)                 # denenecek λ değerleri\nmodel = LassoCV(alphas=izgara, cv=katlar, max_iter=20000).fit(Xs, y_egt)\nen_iyi = model.alpha_\nprint("Seçilen λ:", round(en_iyi, 4), "| test hatası:", round(hko(model.predict(Xt), y_tst), 4))`, en: WS.en + `\nfolds = KFold(5, shuffle=True, random_state=1)    # cross-validation folds\ngrid = np.logspace(-3.5, 0.5, 60)                   # λ values to try\nmodel = LassoCV(alphas=grid, cv=folds, max_iter=20000).fit(Xs, y_tr)\nbest = model.alpha_\nprint("Chosen λ:", round(best, 4), "| test error:", round(mse(model.predict(Xt), y_te), 4))` },
        checks: [{ py: { tr: "abs(en_iyi - LassoCV(alphas=izgara, cv=katlar, max_iter=20000).fit(Xs, y_egt).alpha_) < 1e-12", en: "abs(best - LassoCV(alphas=grid, cv=folds, max_iter=20000).fit(Xs, y_tr).alpha_) < 1e-12" }, msg: { tr: "<code>en_iyi</code>, <code>katlar</code> ile 5-katlı çapraz doğrulamanın seçtiği λ olmalı.", en: "<code>best</code> should be the λ chosen by 5-fold cross-validation with <code>folds</code>." } }],
        after: { tr: "Çapraz doğrulamanın seçtiği λ biraz farklı ve test hatası biraz daha yüksek (0,112). Ama bu sayı dürüst: test verisi seçime hiç karışmadı.", en: "The λ chosen by cross-validation is slightly different and the test error slightly higher (0.112). But this number is honest: the test data played no part in the choice." }
      },
      {
        id: "m3-u5-c3", kind: "run",
        task: { tr: "Üç yöntemi aynı veride karşılaştırıyoruz; Ridge ve Lasso'nun λ'sı çapraz doğrulamayla seçiliyor. Önce tahmin et.", en: "We compare the three methods on the same data; Ridge's and Lasso's λ are chosen by cross-validation. Predict first." },
        predict: { q: { tr: "Hangisinin test hatası en düşük çıkar?", en: "Which has the lowest test error?" }, options: { tr: ["EKK", "Ridge", "Lasso"], en: ["OLS", "Ridge", "Lasso"] }, answer: 2, explain: { tr: "Bu dünyada 40 değişkenin yalnızca 5'i etkili: seyrek bir yapı. Değişken atabilen Lasso burada avantajlı. Çoğu değişkenin küçük etkisi olan bir dünyada Ridge öne geçebilirdi.", en: "In this world only 5 of 40 variables matter: a sparse structure. Lasso, which can drop variables, has the edge here. In a world where most variables have small effects Ridge could win." } },
        code: { tr: WS.tr + `\nkatlar = KFold(5, shuffle=True, random_state=1)\nmodeller = {\n    "EKK": LinearRegression(),\n    "Ridge": RidgeCV(alphas=np.logspace(-2, 4, 60), cv=katlar),\n    "Lasso": LassoCV(alphas=np.logspace(-3.5, 0.5, 60), cv=katlar, max_iter=20000),\n}\nfor ad, m in modeller.items():\n    m.fit(Xs, y_egt)\n    print(f"{ad:6s} test HKO {hko(m.predict(Xt), y_tst):.3f}   sıfırdan farklı katsayı {int(np.sum(m.coef_ != 0)):2d}")`, en: WS.en + `\nfolds = KFold(5, shuffle=True, random_state=1)\nmodels = {\n    "OLS": LinearRegression(),\n    "Ridge": RidgeCV(alphas=np.logspace(-2, 4, 60), cv=folds),\n    "Lasso": LassoCV(alphas=np.logspace(-3.5, 0.5, 60), cv=folds, max_iter=20000),\n}\nfor name, m in models.items():\n    m.fit(Xs, y_tr)\n    print(f"{name:6s} test MSE {mse(m.predict(Xt), y_te):.3f}   non-zero coefficients {int(np.sum(m.coef_ != 0)):2d}")` },
        after: { tr: "EKK 0,136 · Ridge 0,127 · Lasso 0,112. Sıralama dünyaya bağlı: bu dünya seyrek. Gerçek veride hangisinin kazanacağını önceden bilemeyiz; o yüzden karşılaştırmayı her seferinde yeni veride yaparız.", en: "OLS 0.136 · Ridge 0.127 · Lasso 0.112. The ranking depends on the world: this one is sparse. With real data we can't know in advance which will win, so we always compare on new data." }
      },
      {
        id: "m3-u5-c4", kind: "interpret",
        task: { tr: "YZ karşılaştırmayı yorumladı. Hangi cümleler yanlış?", en: "The AI interpreted the comparison. Which sentences are wrong?" },
        prompt: { tr: "EKK 0,136, Ridge 0,127, Lasso 0,112 test HKO. Lasso 13 değişken seçti. Yorumlar mısın?", en: "Test MSE: OLS 0.136, Ridge 0.127, Lasso 0.112. Lasso selected 13 variables. Can you interpret this?" },
        sentences: {
          tr: ["Lasso her veri setinde Ridge'den daha iyi öngörür.", "Bu veride düzenlileştirme, EKK'ya göre test hatasını belirgin biçimde azalttı.", "λ'ların çapraz doğrulamayla seçilmesi, test hatalarının dürüst bir karşılaştırma olmasını sağlıyor.", "Lasso'nun seçtiği 13 değişkenin hepsi ücreti gerçekten etkiliyor."],
          en: ["Lasso predicts better than Ridge on every data set.", "On these data regularisation clearly reduced test error compared with OLS.", "Choosing λ by cross-validation keeps the test errors an honest comparison.", "All 13 variables Lasso selected truly affect wages."]
        },
        bad: [0, 3],
        explain: {
          tr: ["<b>Yanlış:</b> sıralama verinin yapısına bağlı. Çok sayıda küçük etkinin olduğu dünyalarda Ridge daha iyi olabilir.", "Doğru.", "Doğru: test verisi ne model kurmada ne λ seçiminde kullanıldı.", "<b>Yanlış:</b> 13 değişkenin yalnızca 5'i gerçek; Yaş ve birkaç anket sorusu da girdi. λ öngörü hatasını küçültmek için seçilir, doğru değişkenleri bulmak için değil."],
          en: ["<b>Wrong:</b> the ranking depends on the data's structure. In worlds with many small effects Ridge can do better.", "Correct.", "Correct: the test data were used neither for building the model nor for choosing λ.", "<b>Wrong:</b> only 5 of the 13 are real; Age and some survey items also got in. λ is chosen to minimise prediction error, not to find the right variables."]
        }
      }
    ],
    quiz: [
      { q: { tr: "λ neden çapraz doğrulamayla seçilir?", en: "Why is λ chosen by cross-validation?" }, options: { tr: ["Eğitim hatası hep en küçük λ'yı seçer; test hatası seçimde kullanılırsa artık dürüst bir ölçü olmaz", "Daha hızlı olduğu için", "Kod başka türlü çalışmadığı için"], en: ["Training error always picks the smallest λ; test error used in the choice is no longer an honest measure", "Because it is faster", "Because the code won't run otherwise"] }, answer: 0, explain: { tr: "Eğitim hatası hep en küçük λ'yı seçer; test hatası ise seçimde kullanılırsa artık dürüst değildir.", en: "Training error always picks the smallest λ; test error, if used in the choice, is no longer honest." } },
      { q: { tr: "Katsayı yolu neyi gösterir?", en: "What does a coefficient path show?" }, options: { tr: ["Her λ için katsayıların değerini", "Zaman içinde katsayıları", "Değişkenler arasındaki korelasyonu"], en: ["The coefficients' values for each λ", "Coefficients over time", "Correlations between variables"] }, answer: 0, explain: { tr: "Lasso'da λ büyüdükçe katsayılar teker teker sıfıra düşer.", en: "With Lasso coefficients drop to zero one by one as λ grows." } },
      { q: { tr: "Lasso'nun λ'sı neyi en aza indirmek için seçilir?", en: "What is Lasso's λ chosen to minimise?" }, options: { tr: ["Çapraz doğrulama öngörü hatasını", "Seçilen değişken sayısını", "Yanlış seçilen değişken sayısını"], en: ["Cross-validated prediction error", "The number of selected variables", "The number of wrongly selected variables"] }, answer: 0, explain: { tr: "Bu yüzden ilgisiz değişkenler de modele girebilir.", en: "That is why irrelevant variables can also get in." } }
    ]
  });
})();
