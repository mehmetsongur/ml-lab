/* Modül 3 — Regresyon ve düzenlileştirme · Üniteler 6–9
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 * "Örnek YZ yanıtları" öğretim amacıyla hazırlanmıştır.
 */
(function () {
  "use strict";
  const D = window.M3_DATA, U = window.M3_UNITS, W = D.WAGE, ln = D.line;
  const SC = { tr: `\nsc = StandardScaler().fit(X_egt)\nXs, Xt = sc.transform(X_egt), sc.transform(X_tst)`, en: `\nsc = StandardScaler().fit(X_tr)\nXs, Xt = sc.transform(X_tr), sc.transform(X_te)` };
  const WS = { tr: W.tr + SC.tr, en: W.en + SC.en };
  const PK = ["numpy", "scikit-learn"], PKI = ["numpy", "pandas", "scikit-learn"];
  const C0 = { tr: "", en: "" };
  const FILES = D.FILES;

  /* =================================================================== */
  /* Ünite 6 — Lasso'nun sınırları                                          */
  /* =================================================================== */
  U.push({
    id: "m3-u6", minutes: 25, packages: PK,
    title: { tr: "Lasso'nun sınırları", en: "The limits of Lasso" },
    blurb: { tr: "Birbirine çok benzeyen değişkenlerde seçim istikrarsızlaşır; seçilmemek etkisiz olmak demek değildir. Kazanç ne zaman büyük?", en: "With very similar variables selection becomes unstable; not being selected does not mean having no effect. When is the gain large?" },
    terms: [{ tr: "seçim istikrarı", en: "selection stability" }, { tr: "çoklu doğrusal bağlantı", en: "multicollinearity" }, { tr: "seyrek ve yoğun yapı", en: "sparse and dense structure" }],
    concept: C0,
    playground: { type: "selectStab", intro: { tr: "Deneyim ile Yaş arasındaki korelasyonu değiştir ve Lasso'nun 60 örneklemde hangisini seçtiğine bak.", en: "Change the correlation between Experience and Age and see which one Lasso selects across 60 samples." }, takeaway: { tr: "Değişkenler neredeyse aynılaştıkça Lasso'nun seçimi şansa bağlı hâle gelir.", en: "As the variables become almost identical, Lasso's choice comes down to luck." } },
    cells: [
      {
        id: "m3-u6-c1", kind: "run",
        task: { tr: "Deneyim ile Yaş arasındaki korelasyonu 0,995 yapıp 20 farklı örneklemde Lasso kuruyoruz (birkaç saniye sürebilir). Gerçekte ücreti yalnızca Deneyim belirliyor. Önce tahmin et.", en: "We set the correlation between Experience and Age to 0.995 and build Lasso on 20 different samples (it may take a few seconds). In truth only Experience drives wages. Predict first." },
        predict: { q: { tr: "Lasso kaç örneklemde Deneyim yerine yalnızca Yaş'ı seçer?", en: "In how many samples does Lasso select only Age instead of Experience?" }, options: { tr: ["Hiçbirinde", "Birkaçında (yaklaşık üçte birinde)", "Hepsinde"], en: ["None", "Several (about a third)", "All"] }, answer: 1, explain: { tr: "İki değişken neredeyse aynı olunca veri onları ayırt edemez; Lasso birini seçer ve hangisi olduğu örnekleme bağlıdır.", en: "When the two variables are almost identical the data cannot tell them apart; Lasso picks one, and which one depends on the sample." } },
        code: { tr: W.tr + `\nsay = {"yalnızca Deneyim": 0, "yalnızca Yaş": 0, "ikisi birden": 0, "hiçbiri": 0}\nfor r in range(20):\n    X, y = ciz(100, rho=0.995)\n    m = LassoCV(alphas=np.logspace(-3, 0, 20), cv=KFold(5, shuffle=True, random_state=1), max_iter=20000)\n    m.fit(StandardScaler().fit_transform(X), y)\n    d, a = m.coef_[1] != 0, m.coef_[5] != 0\n    say["ikisi birden" if d and a else "yalnızca Deneyim" if d else "yalnızca Yaş" if a else "hiçbiri"] += 1\nprint(say)`, en: W.en + `\ncount = {"Experience only": 0, "Age only": 0, "both": 0, "neither": 0}\nfor r in range(20):\n    X, y = draw(100, rho=0.995)\n    m = LassoCV(alphas=np.logspace(-3, 0, 20), cv=KFold(5, shuffle=True, random_state=1), max_iter=20000)\n    m.fit(StandardScaler().fit_transform(X), y)\n    d, a = m.coef_[1] != 0, m.coef_[5] != 0\n    count["both" if d and a else "Experience only" if d else "Age only" if a else "neither"] += 1\nprint(count)` },
        after: { tr: "20 örneklemin yaklaşık yarısında yalnızca Deneyim, üçte birinde yalnızca Yaş seçildi. Tek bir örneklemle çalışan bir araştırmacı “ücreti yaş belirliyor” sonucuna da varabilirdi.", en: "In about half of the 20 samples only Experience was selected, in about a third only Age. A researcher with a single sample could also have concluded that “age drives wages”." }
      },
      {
        id: "m3-u6-c2", kind: "interpret",
        task: { tr: "Tek bir örneklemde Lasso Yaş'ı seçti, Deneyim'i atmış. YZ bunu yorumladı. Hangi cümleler yanlış?", en: "In one sample Lasso selected Age and dropped Experience. The AI interpreted this. Which sentences are wrong?" },
        prompt: { tr: "Lasso Yaş'ı seçti, Deneyim'in katsayısı sıfır. Deneyim ile Yaş'ın korelasyonu 0,995. Yorumlar mısın?", en: "Lasso selected Age; Experience's coefficient is zero. Experience and Age correlate at 0.995. Can you interpret this?" },
        sentences: {
          tr: ["Deneyimin ücrete hiçbir etkisi yok; işverenler yaşa göre ödüyor.", "İki değişken neredeyse aynı bilgiyi taşıdığı için Lasso yalnızca birini tutmuş.", "Başka bir örneklemde Lasso Deneyim'i seçebilirdi.", "Bu sonuç, yaş ayrımcılığının kanıtıdır."],
          en: ["Experience has no effect on wages; employers pay by age.", "Because the two variables carry almost the same information, Lasso kept only one.", "In another sample Lasso could have selected Experience.", "This result is evidence of age discrimination."]
        },
        bad: [0, 3],
        explain: {
          tr: ["<b>Yanlış:</b> bu dünyada ücreti Deneyim belirliyor. Seçilmemek etkisizlik kanıtı değildir.", "Doğru.", "Doğru: 0,995 korelasyonda seçim örneklemden örnekleme değişiyor.", "<b>Yanlış ve tehlikeli:</b> bir öngörü modelinin değişken seçimi nedensel bir iddiayı, hele ayrımcılık gibi ciddi bir iddiayı desteklemez."],
          en: ["<b>Wrong:</b> in this world Experience drives wages. Not being selected is not proof of no effect.", "Correct.", "Correct: at a correlation of 0.995 the choice varies from sample to sample.", "<b>Wrong and dangerous:</b> a prediction model's variable selection does not support a causal claim, let alone a serious one like discrimination."]
        }
      },
      {
        id: "m3-u6-c3", kind: "compare",
        task: { tr: "İki YZ aynı soruya farklı yanıt verdi. Hangisine güvenirsin?", en: "Two AIs answered the same question differently. Which do you trust?" },
        prompt: { tr: "Ücreti hangi değişkenler belirliyor? Lasso'yla bulur musun?", en: "Which variables determine wages? Can you find out with Lasso?" },
        options: [
          { reply: { tr: "Lasso'yu bir kez kurup seçilenleri listeledim:", en: "I fitted Lasso once and listed the selected variables:" }, code: { tr: "m = LassoCV(cv=katlar).fit(Xs, y_egt)\nprint([adlar[j] for j in range(P) if m.coef_[j] != 0])", en: "m = LassoCV(cv=folds).fit(Xs, y_tr)\nprint([names[j] for j in range(P) if m.coef_[j] != 0])" }, claim: { tr: "Ücreti belirleyen değişkenler bunlar; diğerlerinin etkisi yok.", en: "These are the variables that determine wages; the others have no effect." } },
          { reply: { tr: "Lasso öngörü için kuruldu; seçimini nedensel bir liste gibi okumamak gerekir. Seçimin ne kadar istikrarlı olduğuna da baktım:", en: "Lasso was built for prediction; its selection should not be read as a causal list. I also checked how stable the selection is:" }, code: { tr: "# 50 farklı alt örneklemde Lasso; her değişkenin seçilme oranı\nfor j in range(6):\n    print(adlar[j], oran[j])", en: "# Lasso on 50 different subsamples; each variable's selection rate\nfor j in range(6):\n    print(names[j], rate[j])" }, claim: { tr: "Eğitim, Deneyim ve Büyükşehir neredeyse her seferinde seçiliyor; Deneyim ile Yaş birbirinin yerine geçiyor. Etki iddiası için başka bir araştırma tasarımı gerekir.", en: "Education, Experience and Big city are selected almost every time; Experience and Age substitute for each other. A claim about effects needs a different research design." } }
        ],
        answer: 1,
        reasons: { tr: ["A daha kısa ve net olduğu için", "A tek bir kurulumun sonucunu nedensel bir liste gibi sunuyor; B seçimin istikrarına bakıyor ve öngörü ile nedensellik ayrımını koruyor", "B daha çok satır kod yazdığı için"], en: ["Because A is shorter and clearer", "A presents a single fit as a causal list; B checks the stability of the selection and keeps prediction and causation apart", "Because B writes more lines of code"] },
        reasonAnswer: 1,
        explain: { tr: "Seçim istikrarına bakmak, Lasso'nun seçimlerini okurken iyi bir alışkanlıktır. Ama en istikrarlı seçim bile nedensellik kanıtı değildir (Modül 1, Ünite 3).", en: "Checking selection stability is a good habit when reading Lasso's choices. But even the most stable selection is not evidence of causation (Module 1, Unit 3)." }
      },
      {
        id: "m3-u6-c4", kind: "run",
        task: { tr: "Düzenlileştirmenin kazancı veri miktarına nasıl bağlı? 60 ve 1.000 kişilik iki örneklemde EKK ile Lasso'yu karşılaştırıyoruz. Önce tahmin et.", en: "How does the gain from regularisation depend on the amount of data? We compare OLS and Lasso on samples of 60 and 1,000 people. Predict first." },
        predict: { q: { tr: "1.000 kişide Lasso'nun EKK'ya üstünlüğü nasıl olur?", en: "With 1,000 people, how large is Lasso's advantage over OLS?" }, options: { tr: ["Neredeyse kaybolur", "60 kişidekinden daha büyük olur", "EKK açık ara kazanır"], en: ["It almost disappears", "It is larger than with 60 people", "OLS wins by a wide margin"] }, answer: 0, explain: { tr: "Bol veride EKK'nın varyansı küçülür; düzenlileştirmenin düzelteceği bir şey kalmaz.", en: "With plenty of data OLS's variance shrinks; there is little left for regularisation to fix." } },
        code: { tr: W.tr + `\nfor n in [60, 1000]:\n    X, y = ciz(n)\n    s = StandardScaler().fit(X)\n    ekk = LinearRegression().fit(s.transform(X), y)\n    las = LassoCV(alphas=np.logspace(-3.5, 0.5, 40), cv=KFold(5, shuffle=True, random_state=1), max_iter=20000).fit(s.transform(X), y)\n    print(f"n = {n:4d}   EKK {hko(ekk.predict(s.transform(X_tst)), y_tst):.3f}   Lasso {hko(las.predict(s.transform(X_tst)), y_tst):.3f}")`, en: W.en + `\nfor n in [60, 1000]:\n    X, y = draw(n)\n    s = StandardScaler().fit(X)\n    ols = LinearRegression().fit(s.transform(X), y)\n    las = LassoCV(alphas=np.logspace(-3.5, 0.5, 40), cv=KFold(5, shuffle=True, random_state=1), max_iter=20000).fit(s.transform(X), y)\n    print(f"n = {n:4d}   OLS {mse(ols.predict(s.transform(X_te)), y_te):.3f}   Lasso {mse(las.predict(s.transform(X_te)), y_te):.3f}")` },
        after: { tr: "60 kişide fark büyük, 1.000 kişide neredeyse yok. Düzenlileştirme “az veri, çok değişken” durumunun ilacıdır. Makro ekonomide bu durum çok yaygındır.", en: "With 60 people the gap is large, with 1,000 it is almost gone. Regularisation is the remedy for “few data, many variables”. That situation is very common in macroeconomics." }
      }
    ],
    quiz: [
      { q: { tr: "İki değişken çok yüksek korelasyonluysa Lasso genellikle ne yapar?", en: "If two variables are very highly correlated, what does Lasso usually do?" }, options: { tr: ["Birini seçer; hangisi olduğu örnekleme bağlıdır", "İkisini de her zaman seçer", "İkisini de atar"], en: ["Picks one; which one depends on the sample", "Always selects both", "Drops both"] }, answer: 0, explain: { tr: "Seçim istikrarsızlaşır.", en: "Selection becomes unstable." } },
      { q: { tr: "Düzenlileştirmenin kazancı ne zaman en büyüktür?", en: "When is the gain from regularisation largest?" }, options: { tr: ["Gözlem az, değişken çokken", "Gözlem çok, değişken azken", "Her zaman aynıdır"], en: ["Few observations, many variables", "Many observations, few variables", "It is always the same"] }, answer: 0, explain: { tr: "60 kişide büyük, 1.000 kişide küçük.", en: "Large with 60 people, small with 1,000." } },
      { q: { tr: "Lasso'nun seçimleri hakkındaki hangi ifade doğrudur?", en: "Which statement about Lasso's selections is true?" }, options: { tr: ["Öngörü için yararlıdır ama nedensel etki kanıtı değildir", "Hangi değişkenlerin etkili olduğunu kesin gösterir", "Örneklemden bağımsızdır"], en: ["They are useful for prediction but not evidence of causal effects", "They show for certain which variables matter", "They are independent of the sample"] }, answer: 0, explain: { tr: "Seçilmemek etkisizlik, seçilmek de etki kanıtı değildir.", en: "Not being selected is not proof of no effect, and being selected is not proof of an effect." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 7 — Enflasyon öngörüsü problemini kurmak                         */
  /* =================================================================== */
  const U7A = {
    tr: D.INF.tr + `\nfrom sklearn.linear_model import LinearRegression\nX = pd.DataFrame({"enf_g0": G["enf"], "aylik_g0": G["aylik"], "petrol_g0": G["WTISPLC"]})\ny = G["enf"].rename("hedef")                       # hedef: yıllık enflasyon\ntablo = pd.concat([X, y], axis=1).loc["1984-01-01":].dropna()\nm = LinearRegression().fit(tablo[X.columns], tablo["hedef"])\nprint("R²:", round(m.score(tablo[X.columns], tablo["hedef"]), 4))`,
    en: D.INF.en + `\nfrom sklearn.linear_model import LinearRegression\nX = pd.DataFrame({"inf_l0": G["inf"], "monthly_l0": G["monthly"], "oil_l0": G["WTISPLC"]})\ny = G["inf"].rename("target")                      # target: annual inflation\ntable = pd.concat([X, y], axis=1).loc["1984-01-01":].dropna()\nm = LinearRegression().fit(table[X.columns], table["target"])\nprint("R²:", round(m.score(table[X.columns], table["target"]), 4))`
  };
  U.push({
    id: "m3-u7", minutes: 30, packages: PKI, data: FILES,
    title: { tr: "Enflasyon öngörüsü problemini kurmak", en: "Setting up the inflation forecasting problem" },
    blurb: { tr: "13 FRED serisinden 51 aday özellik: hedef gelecek ayın yıllık enflasyonu. Öngörü anında ne bilinir? Baz etkisi.", en: "51 candidate features from 13 FRED series; the target is next month's annual inflation. What is known at forecast time? The base effect." },
    terms: [{ tr: "hedef (t+1)", en: "target (t+1)" }, { tr: "gecikmeli özellik", en: "lagged feature" }, { tr: "baz etkisi", en: "base effect" }, { tr: "yayın gecikmesi", en: "publication lag" }],
    concept: C0, playground: null,
    cells: [
      {
        id: "m3-u7-c1", kind: "run",
        task: { tr: "13 seriyi okuyup özellik tablosunu kuruyoruz. Önce tahmin et.", en: "We read the 13 series and build the feature table. Predict first." },
        predict: { q: { tr: "Tabloda kaç aday özellik var?", en: "How many candidate features does the table have?" }, options: { tr: ["13", "51", "156"], en: ["13", "51", "156"] }, answer: 1, explain: { tr: "Yıllık enflasyon ve 12 serinin her biri için bu ay ile son iki ayın değeri (13 × 3 = 39), artı son 12 ayın aylık enflasyonu (12): 51.", en: "For annual inflation and each of 12 series, this month's and the last two months' values (13 × 3 = 39), plus monthly inflation for the last 12 months (12): 51." } },
        code: { tr: D.INFX.tr + `\nprint("Aday özellik:", len(ozellikler))\nprint("Eğitim:", egitim.index.min().date(), "→", egitim.index.max().date(), len(egitim), "ay")\nprint("Test:  ", test.index.min().date(), "→", test.index.max().date(), len(test), "ay")\nprint(tablo[["enf_g0", "aylik_g11", "UNRATE_g0", "hedef"]].tail(3).round(2))`, en: D.INFX.en + `\nprint("Candidate features:", len(features))\nprint("Training:", train.index.min().date(), "→", train.index.max().date(), len(train), "months")\nprint("Test:    ", test.index.min().date(), "→", test.index.max().date(), len(test), "months")\nprint(table[["inf_l0", "monthly_l11", "UNRATE_l0", "target"]].tail(3).round(2))` },
        after: { tr: "372 eğitim, 128 test ayı. Test dönemi 2025 Ağustos'ta bitiyor: Ekim 2025'in TÜFE verisi yok (ABD federal hükümetinin kapanması) ve aylık enflasyonun 11 aylık gecikmesi o boşluğu sonraki 12 aya taşıyor. Satırları doldurmak yerine dışarıda bıraktık.", en: "372 training months, 128 test months. The test period ends in August 2025: there is no CPI for October 2025 (the US federal government shutdown), and the 11-month lag of monthly inflation carries that gap into the following 12 months. We left those rows out rather than filling them." }
      },
      {
        id: "m3-u7-c2", kind: "audit",
        task: { tr: "YZ'den gelecek ayın enflasyonunu öngören bir model istedik. Sonuç “kusursuz”. Hatalı satırı bul ve düzelt: hedef, <b>gelecek ayın</b> yıllık enflasyonu olsun.", en: "We asked the AI for a model forecasting next month's inflation. The result is “flawless”. Find the faulty line and fix it: the target should be <b>next month's</b> annual inflation." },
        ai: {
          prompt: { tr: "Bu ayın enflasyonu, aylık enflasyon ve petrol fiyatı değişiminden gelecek ayın yıllık enflasyonunu öngören bir model kur.", en: "Build a model forecasting next month's annual inflation from this month's inflation, monthly inflation and the change in oil prices." },
          reply: { tr: "Özellikleri ve hedefi kurup modeli tahmin edelim:", en: "Let us build the features and target and estimate the model:" },
          code: U7A,
          claim: { tr: "R² = 1,0000: model gelecek ayın enflasyonunu kusursuz öngörüyor.", en: "R² = 1.0000: the model forecasts next month's inflation perfectly." }
        },
        bugLines: [ln(U7A.tr, 'y = G["enf"]')],
        lineExplain: { tr: "Hedef kaydırılmamış: model bu ayın enflasyonunu, bu ayın enflasyonuyla (<code>enf_g0</code>) “öngörüyor”. Cevap sorunun içinde; bu bir hedef sızıntısıdır (Modül 2, Ünite 7). Gelecek ayın değeri için hedefi bir ay geri kaydırmak gerekir: <code>shift(-1)</code>.", en: "The target is not shifted: the model “predicts” this month's inflation from this month's inflation (<code>inf_l0</code>). The answer is inside the question; this is target leakage (Module 2, Unit 7). For next month's value the target must be shifted back one month: <code>shift(-1)</code>." },
        hints: [{ tr: "<code>y = G[\"enf\"].shift(-1).rename(\"hedef\")</code>: her satırın hedefi bir sonraki ayın değeri olur.", en: "<code>y = G[\"inf\"].shift(-1).rename(\"target\")</code>: each row's target becomes the next month's value." }],
        solution: { tr: U7A.tr.replace('y = G["enf"].rename("hedef")                       # hedef: yıllık enflasyon', 'y = G["enf"].shift(-1).rename("hedef")             # hedef: GELECEK ayın yıllık enflasyonu'), en: U7A.en.replace('y = G["inf"].rename("target")                      # target: annual inflation', 'y = G["inf"].shift(-1).rename("target")            # target: NEXT month\'s annual inflation') },
        checks: [{ py: { tr: 'y.equals(G["enf"].shift(-1).rename("hedef"))', en: 'y.equals(G["inf"].shift(-1).rename("target"))' }, msg: { tr: "<code>y</code>, yıllık enflasyonun bir ay geri kaydırılmış hâli olmalı (gelecek ayın değeri).", en: "<code>y</code> should be annual inflation shifted back one month (next month's value)." } }],
        after: { tr: "R² hâlâ yüksek (≈ 0,95), çünkü enflasyon aydan aya yavaş değişir. Ama artık dürüst: bu ayın bilgisiyle gelecek ayı öngörüyoruz. Bir modelin “kusursuz” çıkması, ilk önce sızıntı şüphesi uyandırmalı.", en: "R² is still high (≈ 0.95) because inflation changes slowly from month to month. But it is honest now: we forecast next month with this month's information. A “flawless” model should first raise suspicion of leakage." }
      },
      {
        id: "m3-u7-c3", kind: "run",
        task: { tr: "Yıllık enflasyon gelecek ay ne kadar değişecek? Bu değişimin iki ayla korelasyonuna bakıyoruz: gelecek ayın aylık enflasyonu ve 11 ay önceki aylık enflasyon. Önce tahmin et.", en: "How much will annual inflation change next month? We look at how that change correlates with two months: next month's monthly inflation and monthly inflation 11 months ago. Predict first." },
        predict: { q: { tr: "11 ay önceki aylık enflasyonla korelasyonun işareti ne olur?", en: "What is the sign of the correlation with monthly inflation 11 months ago?" }, options: { tr: ["Negatif", "Sıfıra yakın", "Pozitif"], en: ["Negative", "Close to zero", "Positive"] }, answer: 0, explain: { tr: "Yıllık enflasyon son 12 ayın aylık enflasyonlarının bileşkesidir. Gelecek ay yeni bir ay pencereye girer, en eski ay (t−11) çıkar. Çıkan ay yüksekse yıllık enflasyon düşer: baz etkisi.", en: "Annual inflation compounds the last 12 monthly rates. Next month a new month enters the window and the oldest (t−11) leaves. If the leaving month was high, annual inflation falls: the base effect." } },
        code: { tr: D.INF.tr + `\nfark = G["enf"].shift(-1) - G["enf"]                 # gelecek ay yıllık enflasyon ne kadar değişecek?\nprint("aylık(t+1) ile korelasyon :", round(fark.corr(G["aylik"].shift(-1)), 2), " ← öngörü anında bilinmez")\nprint("aylık(t−11) ile korelasyon:", round(fark.corr(G["aylik"].shift(11)), 2), " ← öngörü anında bilinir")`, en: D.INF.en + `\nchange = G["inf"].shift(-1) - G["inf"]               # how much will annual inflation change next month?\nprint("correlation with monthly(t+1) :", round(change.corr(G["monthly"].shift(-1)), 2), " ← unknown at forecast time")\nprint("correlation with monthly(t−11):", round(change.corr(G["monthly"].shift(11)), 2), " ← known at forecast time")` },
        after: { tr: "Gelecek ayın aylık enflasyonuyla korelasyon +0,63, ama o değer öngörü anında bilinmiyor. 11 ay önceki aylık enflasyonla korelasyon −0,65 ve o değer biliniyor! Baz etkisi, öngörü için çok değerli bir bilgi. Bakalım Lasso onu bulacak mı (Ünite 8).", en: "The correlation with next month's monthly inflation is +0.63, but that value is unknown at forecast time. The correlation with monthly inflation 11 months ago is −0.65, and that value is known! The base effect is very valuable information for forecasting. Let us see whether Lasso finds it (Unit 8)." }
      },
      {
        id: "m3-u7-c4", kind: "fill",
        task: { tr: "Bir özellik ekle: petrol fiyatındaki yıllık değişimin <b>bir ay önceki</b> değeri. Öngörü anında bilinmeyen bir değeri kullanmamaya dikkat et.", en: "Add a feature: the value of the annual change in oil prices <b>one month earlier</b>. Make sure not to use a value that is unknown at forecast time." },
        code: { tr: D.INF.tr + `\npetrol_g1 = G["WTISPLC"].shift(___)\nprint(pd.DataFrame({"petrol_g0": G["WTISPLC"], "petrol_g1": petrol_g1}).loc["2022-01-01":"2022-04-01"].round(1))`, en: D.INF.en + `\noil_l1 = G["WTISPLC"].shift(___)\nprint(pd.DataFrame({"oil_l0": G["WTISPLC"], "oil_l1": oil_l1}).loc["2022-01-01":"2022-04-01"].round(1))` },
        solution: { tr: D.INF.tr + `\npetrol_g1 = G["WTISPLC"].shift(1)\nprint(pd.DataFrame({"petrol_g0": G["WTISPLC"], "petrol_g1": petrol_g1}).loc["2022-01-01":"2022-04-01"].round(1))`, en: D.INF.en + `\noil_l1 = G["WTISPLC"].shift(1)\nprint(pd.DataFrame({"oil_l0": G["WTISPLC"], "oil_l1": oil_l1}).loc["2022-01-01":"2022-04-01"].round(1))` },
        hints: [{ tr: "<code>shift(1)</code> bir ay önceki değeri bu aya taşır. <code>shift(-1)</code> ise gelecek ayın değerini getirir: sızıntı.", en: "<code>shift(1)</code> brings last month's value to this month. <code>shift(-1)</code> brings next month's value: leakage." }],
        checks: [{ py: { tr: 'petrol_g1.equals(G["WTISPLC"].shift(1))', en: 'oil_l1.equals(G["WTISPLC"].shift(1))' }, msg: { tr: "<code>petrol_g1</code>, bir ay önceki değer olmalı (<code>shift(1)</code>).", en: "<code>oil_l1</code> should be the value one month earlier (<code>shift(1)</code>)." } }],
        after: { tr: "Tablodaki her satırda <code>petrol_g1</code>, bir üst satırın <code>petrol_g0</code> değeri. Kural: özellikler için kaydırma sıfır ya da pozitif, hedef için −1.", en: "In each row of the table <code>oil_l1</code> equals the row above's <code>oil_l0</code>. The rule: shifts are zero or positive for features, −1 for the target." }
      }
    ],
    quiz: [
      { q: { tr: "Gelecek ayın değerini hedef yapmak için pandas'ta hangi kaydırma kullanılır?", en: "Which pandas shift makes next month's value the target?" }, options: { tr: ["shift(-1)", "shift(1)", "shift(12)"], en: ["shift(-1)", "shift(1)", "shift(12)"] }, answer: 0, explain: { tr: "Her satıra bir sonraki satırın değerini getirir.", en: "It brings the next row's value to each row." } },
      { q: { tr: "Baz etkisi nedir?", en: "What is the base effect?" }, options: { tr: ["Yıllık enflasyonun, 12 ay önceki aylık değişimin pencereden çıkmasıyla değişmesi", "Merkez bankasının politika faizi", "Mevsimsel düzeltme"], en: ["The change in annual inflation as the monthly change from 12 months ago leaves the window", "The central bank's policy rate", "Seasonal adjustment"] }, answer: 0, explain: { tr: "Yüksek bir ay pencereden çıkınca yıllık enflasyon düşer.", en: "When a high month leaves the window, annual inflation falls." } },
      { q: { tr: "Ekim 2025'in TÜFE verisi neden eksik?", en: "Why is the October 2025 CPI missing?" }, options: { tr: ["ABD federal hükümetinin kapanması sırasında derlenemedi", "Enflasyon sıfırdı", "FRED'in hatası"], en: ["It could not be compiled during the US federal government shutdown", "Inflation was zero", "A FRED error"] }, answer: 0, explain: { tr: "Gerçek bir veri boşluğu; doldurmak yerine dışarıda bıraktık.", en: "A real data gap; we left it out rather than filling it." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 8 — Zamana göre değerlendirme                                    */
  /* =================================================================== */
  const SCI = { tr: `\nfrom sklearn.linear_model import LinearRegression, LassoCV\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.model_selection import TimeSeriesSplit, KFold\nsc = StandardScaler().fit(egitim[ozellikler])\nXe, Xt = sc.transform(egitim[ozellikler]), sc.transform(test[ozellikler])`, en: `\nfrom sklearn.linear_model import LinearRegression, LassoCV\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.model_selection import TimeSeriesSplit, KFold\nsc = StandardScaler().fit(train[features])\nXe, Xt = sc.transform(train[features]), sc.transform(test[features])` };
  const IS = { tr: D.INFX.tr + SCI.tr, en: D.INFX.en + SCI.en };
  const U8A = { tr: IS.tr + `\nlasso = LassoCV(alphas=np.logspace(-4, 0.5, 60), cv=KFold(5, shuffle=True, random_state=1), max_iter=50000)\nlasso.fit(Xe, egitim["hedef"])\ncv_hata = np.sqrt(lasso.mse_path_.mean(axis=1).min())\nprint("Seçilen λ:", round(lasso.alpha_, 4), "| çapraz doğrulama kök HKO:", round(cv_hata, 3))`, en: IS.en + `\nlasso = LassoCV(alphas=np.logspace(-4, 0.5, 60), cv=KFold(5, shuffle=True, random_state=1), max_iter=50000)\nlasso.fit(Xe, train["target"])\ncv_err = np.sqrt(lasso.mse_path_.mean(axis=1).min())\nprint("Chosen λ:", round(lasso.alpha_, 4), "| cross-validation RMSE:", round(cv_err, 3))` };
  U.push({
    id: "m3-u8", minutes: 30, packages: PKI, data: FILES,
    title: { tr: "Zamana göre değerlendirme: saf öngörü, EKK ve Lasso", en: "Evaluating over time: naive, OLS and Lasso" },
    blurb: { tr: "1984–2014 ile eğit, 2015 ve sonrasında sına. 51 değişkenli EKK saf öngörüyü geçemiyor; Lasso geçiyor ve baz etkisini buluyor.", en: "Train on 1984–2014, test from 2015. The 51-variable OLS cannot beat the naive forecast; Lasso does, and finds the base effect." },
    terms: [{ tr: "saf öngörü (kıyas ölçütü)", en: "naive forecast (benchmark)" }, { tr: "TimeSeriesSplit", en: "TimeSeriesSplit" }, { tr: "kök HKO", en: "RMSE" }],
    concept: C0,
    playground: { type: "inflationRace", intro: { tr: "Test dönemindeki gerçekleşmeyi ve öngörüleri karşılaştır. Modelleri aç kapat, dönemi değiştir.", en: "Compare actual inflation and the forecasts over the test period. Toggle models and change the period." }, takeaway: { tr: "Çok değişkenli EKK eğitimde parlıyor, testte saf öngörünün gerisinde kalıyor. Lasso aynı 51 adayla saf öngörüyü geçiyor.", en: "The many-variable OLS shines in training and falls behind the naive forecast in testing. With the same 51 candidates, Lasso beats it." } },
    cells: [
      {
        id: "m3-u8-c1", kind: "run",
        task: { tr: "Kıyas ölçütü saf öngörü: gelecek ayın yıllık enflasyonu = bu ayınki. 51 değişkenli EKK bunu geçebilecek mi? Önce tahmin et.", en: "The benchmark is the naive forecast: next month's annual inflation = this month's. Can the 51-variable OLS beat it? Predict first." },
        predict: { q: { tr: "Test döneminde EKK'nın kök HKO'su saf öngörüye göre nasıl çıkar?", en: "Over the test period, how does OLS's RMSE compare with the naive forecast?" }, options: { tr: ["EKK saf öngörüyü rahatça geçer", "EKK saf öngörüden kötü", "İkisi aynı"], en: ["OLS beats the naive forecast easily", "OLS is worse than the naive forecast", "They are the same"] }, answer: 1, explain: { tr: "372 aylık eğitim verisiyle 51 katsayı kestirmek aşırı uyuma yol açıyor: eğitimde çok iyi, testte saf öngörüden kötü.", en: "Estimating 51 coefficients from 372 training months leads to overfitting: very good in training, worse than naive in testing." } },
        code: { tr: IS.tr + `\nekk = LinearRegression().fit(Xe, egitim["hedef"])\nprint("Saf öngörü test kök HKO:", round(kok_hko(test["enf_g0"], test["hedef"]), 3))\nprint("EKK eğitim kök HKO:     ", round(kok_hko(ekk.predict(Xe), egitim["hedef"]), 3))\nprint("EKK test kök HKO:       ", round(kok_hko(ekk.predict(Xt), test["hedef"]), 3))`, en: IS.en + `\nols = LinearRegression().fit(Xe, train["target"])\nprint("Naive test RMSE:   ", round(rmse(test["inf_l0"], test["target"]), 3))\nprint("OLS training RMSE: ", round(rmse(ols.predict(Xe), train["target"]), 3))\nprint("OLS test RMSE:     ", round(rmse(ols.predict(Xt), test["target"]), 3))` },
        after: { tr: "Saf öngörü 0,378; EKK eğitimde 0,196, testte 0,437. Ünite 2'deki örüntü gerçek veride: çok değişken, sınırlı veri, aşırı uyum.", en: "Naive 0.378; OLS 0.196 in training, 0.437 in testing. The pattern from Unit 2, on real data: many variables, limited data, overfitting." }
      },
      {
        id: "m3-u8-c2", kind: "audit",
        task: { tr: "YZ Lasso'nun λ'sını seçti ve gelecekteki hatayı tahmin etti. Hatalı satırı bul ve düzelt: çapraz doğrulama zamanın sırasına saygı göstersin (<code>TimeSeriesSplit(5)</code>).", en: "The AI chose Lasso's λ and estimated the future error. Find the faulty line and fix it: cross-validation should respect the order of time (<code>TimeSeriesSplit(5)</code>)." },
        ai: {
          prompt: { tr: "51 özellikle bir Lasso kur, λ'yı çapraz doğrulamayla seç ve gelecekte ne kadar hata yapacağını söyle.", en: "Build a Lasso with the 51 features, choose λ by cross-validation and tell me how much error to expect in the future." },
          reply: { tr: "Standart 5-katlı çapraz doğrulamayla λ'yı seçtim:", en: "I chose λ with standard 5-fold cross-validation:" },
          code: U8A,
          claim: { tr: "Çapraz doğrulama kök HKO'su 0,23: model gelecekte de bu doğrulukta öngörecek.", en: "The cross-validation RMSE is 0.23: the model will forecast this accurately in the future too." }
        },
        bugLines: [ln(U8A.tr, "KFold(5, shuffle=True")],
        lineExplain: { tr: "<code>KFold(shuffle=True)</code> ayları karıştırır: model 1995'i öngörmek için 2005'ten öğrenebilir. Doğrulama hatası, geleceği gören bir modelin hatasıdır (Modül 2, Ünite 8). Zaman serisinde her doğrulama dönemi, yalnızca kendi geçmişiyle eğitilmiş bir modelle sınanmalı.", en: "<code>KFold(shuffle=True)</code> shuffles the months: the model can learn from 2005 to forecast 1995. The validation error is that of a model that sees the future (Module 2, Unit 8). In time series each validation period must be tested with a model trained only on its own past." },
        hints: [{ tr: "<code>cv=TimeSeriesSplit(5)</code>: genişleyen pencereyle beş doğrulama dönemi.", en: "<code>cv=TimeSeriesSplit(5)</code>: five validation periods with an expanding window." }],
        solution: { tr: U8A.tr.replace("cv=KFold(5, shuffle=True, random_state=1)", "cv=TimeSeriesSplit(5)"), en: U8A.en.replace("cv=KFold(5, shuffle=True, random_state=1)", "cv=TimeSeriesSplit(5)") },
        checks: [{ py: "isinstance(lasso.cv, TimeSeriesSplit)", msg: { tr: "<code>lasso</code>, <code>cv=TimeSeriesSplit(5)</code> ile kurulmalı.", en: "<code>lasso</code> should be built with <code>cv=TimeSeriesSplit(5)</code>." } }],
        after: { tr: "Zamana saygılı çapraz doğrulamanın hatası 0,32; karıştırılmış olanınki 0,23. Gerçek test hatası 0,25 çıkacak. Bu örnekte iki yöntemin seçtiği modeller benzer öngörüyor, ama karıştırılmış çapraz doğrulama hem geleceği görüyor hem de hatayı olduğundan küçük gösteriyor.", en: "The time-respecting cross-validation error is 0.32; the shuffled one 0.23. The real test error will be 0.25. Here the models chosen by the two methods forecast similarly, but shuffled cross-validation both sees the future and understates the error." }
      },
      {
        id: "m3-u8-c3", kind: "run",
        task: { tr: "Zamana saygılı çapraz doğrulamayla Lasso'yu kuruyor, test hatasını ve seçilen değişkenleri yazdırıyoruz. Önce tahmin et.", en: "We build Lasso with time-respecting cross-validation and print the test error and the selected variables. Predict first." },
        predict: { q: { tr: "En büyük negatif katsayı hangi özelliğe ait olur?", en: "Which feature gets the largest negative coefficient?" }, options: { tr: ["aylik_g11 (11 ay önceki aylık enflasyon)", "UNRATE_g0 (işsizlik oranı)", "FEDFUNDS_g0 (politika faizi)"], en: ["monthly_l11 (monthly inflation 11 months ago)", "UNRATE_l0 (unemployment rate)", "FEDFUNDS_l0 (policy rate)"] }, answer: 0, explain: { tr: "Lasso baz etkisini kendisi buluyor: 11 ay önceki aylık enflasyon gelecek ay pencereden çıkacak; yüksekse yıllık enflasyon düşecek.", en: "Lasso finds the base effect by itself: monthly inflation from 11 months ago will leave the window next month; if it was high, annual inflation will fall." } },
        code: { tr: IS.tr + `\nlasso = LassoCV(alphas=np.logspace(-4, 0.5, 60), cv=TimeSeriesSplit(5), max_iter=50000).fit(Xe, egitim["hedef"])\nprint("Lasso test kök HKO:", round(kok_hko(lasso.predict(Xt), test["hedef"]), 3), "| seçilen:", int(np.sum(lasso.coef_ != 0)), "/ 51")\nsira = np.argsort(-np.abs(lasso.coef_))[:6]\nfor j in sira:\n    print(f"  {ozellikler[j]:14s} {lasso.coef_[j]:+.3f}")`, en: IS.en + `\nlasso = LassoCV(alphas=np.logspace(-4, 0.5, 60), cv=TimeSeriesSplit(5), max_iter=50000).fit(Xe, train["target"])\nprint("Lasso test RMSE:", round(rmse(lasso.predict(Xt), test["target"]), 3), "| selected:", int(np.sum(lasso.coef_ != 0)), "/ 51")\norder = np.argsort(-np.abs(lasso.coef_))[:6]\nfor j in order:\n    print(f"  {features[j]:14s} {lasso.coef_[j]:+.3f}")` },
        after: { tr: "Lasso test kök HKO'su 0,247: saf öngörüden (0,378) yüzde 35 daha iyi. 51 adaydan 19'u kaldı. İlk iki sırada bu ayın yıllık enflasyonu ve baz etkisi (aylik_g11) var. Yalnızca bu iki değişkenle kurulan bir EKK bile 0,251 veriyor: Lasso'nun bulduğu yapı, iktisadi sezgiyle örtüşüyor.", en: "Lasso's test RMSE is 0.247: 35% better than naive (0.378). 19 of the 51 candidates remain. At the top are this month's annual inflation and the base effect (monthly_l11). Even an OLS with just these two variables gives 0.251: the structure Lasso found matches economic intuition." }
      },
      {
        id: "m3-u8-c4", kind: "interpret",
        task: { tr: "YZ sonuçları yorumladı. Hangi cümleler yanlış ya da abartılı?", en: "The AI interpreted the results. Which sentences are wrong or overclaimed?" },
        prompt: { tr: "Test kök HKO: saf 0,378, EKK 0,437, Lasso 0,247. Lasso'da FEDFUNDS_g0'ın katsayısı +0,041. Yorumlar mısın?", en: "Test RMSE: naive 0.378, OLS 0.437, Lasso 0.247. In Lasso, FEDFUNDS_l0's coefficient is +0.041. Can you interpret this?" },
        sentences: {
          tr: ["Lasso, aynı 51 adayla EKK'nın aşırı uyumunu önleyip saf öngörüyü geçti.", "Faizin katsayısı pozitif; demek ki faiz artırımı enflasyonu yükseltiyor.", "Lasso her dönemde ve her ülkede saf öngörüyü geçer.", "Sonuçlar 2015 sonrası test dönemine ve tek bir eğitim kesimine dayanıyor."],
          en: ["With the same 51 candidates, Lasso avoided OLS's overfitting and beat the naive forecast.", "The interest rate's coefficient is positive, so raising rates increases inflation.", "Lasso beats the naive forecast in every period and every country.", "The results rest on the post-2015 test period and a single training cut-off."]
        },
        bad: [1, 2],
        explain: {
          tr: ["Doğru.", "<b>Yanlış:</b> bu bir öngörü modeli. Faiz yüksek enflasyona tepki olarak artırılır (ters nedensellik); pozitif katsayı bu birlikte hareketi yansıtır, politika etkisini değil (Modül 1, Ünite 3).", "<b>Abartı:</b> tek bir ülke, tek bir test dönemi. Genelleme için başka dönemlerde ve ülkelerde sınamak gerekir.", "Doğru: iyi bir sınırlar cümlesi."],
          en: ["Correct.", "<b>Wrong:</b> this is a prediction model. Rates are raised in response to high inflation (reverse causality); the positive coefficient reflects this co-movement, not the policy effect (Module 1, Unit 3).", "<b>Overclaim:</b> one country, one test period. Generalising needs tests in other periods and countries.", "Correct: a good statement of limits."]
        }
      }
    ],
    quiz: [
      { q: { tr: "Zaman serisinde λ seçmek için hangi çapraz doğrulama uygundur?", en: "Which cross-validation is suitable for choosing λ with time series?" }, options: { tr: ["TimeSeriesSplit (genişleyen pencere)", "Karıştırılmış KFold", "Test verisiyle seçim"], en: ["TimeSeriesSplit (expanding window)", "Shuffled KFold", "Choosing with the test data"] }, answer: 0, explain: { tr: "Her doğrulama yalnızca geçmişten öğrenen bir modelle yapılır.", en: "Each validation uses a model that learned only from the past." } },
      { q: { tr: "Bir öngörü modelini neden saf öngörüyle karşılaştırırız?", en: "Why compare a forecasting model with the naive forecast?" }, options: { tr: ["Basit bir kuralı geçemeyen model değer katmaz", "Saf öngörü her zaman en iyisidir", "Gelenek olduğu için"], en: ["A model that cannot beat a simple rule adds no value", "The naive forecast is always best", "Out of tradition"] }, answer: 0, explain: { tr: "51 değişkenli EKK bu sınavı geçemedi.", en: "The 51-variable OLS failed this test." } },
      { q: { tr: "Lasso'nun seçtiği aylik_g11 değişkeninin iktisadi karşılığı nedir?", en: "What is the economic meaning of monthly_l11, which Lasso selected?" }, options: { tr: ["Baz etkisi", "Para arzı", "Phillips eğrisi"], en: ["The base effect", "The money supply", "The Phillips curve"] }, answer: 0, explain: { tr: "11 ay önceki aylık enflasyon gelecek ay yıllık pencereden çıkar.", en: "Monthly inflation from 11 months ago leaves the annual window next month." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 9 — Colab + Gemini atölyesi                                       */
  /* =================================================================== */
  const NB = { tr: "modul3/09_enflasyon_ongoru_atolyesi_tr.ipynb", en: "module3/09_inflation_forecasting_workshop_en.ipynb" };
  U.push({
    id: "m3-u9", minutes: 50,
    title: { tr: "Colab + Gemini atölyesi: enflasyonu öngörmek", en: "Colab + Gemini workshop: forecasting inflation" },
    blurb: { tr: "Gerçek FRED verisiyle özellikleri kur, zamana göre böl, saf öngörü ve EKK ile kıyasla, sonra Lasso'yu zamana saygılı çapraz doğrulamayla kur. Kodu Gemini yazar, sen denetlersin.", en: "With real FRED data, build the features, split by time, compare the naive forecast and OLS, then build Lasso with time-respecting cross-validation. Gemini writes the code, you audit it." },
    terms: [{ tr: "öngörü ufku", en: "forecast horizon" }, { tr: "kıyas ölçütü", en: "benchmark" }, { tr: "TimeSeriesSplit", en: "TimeSeriesSplit" }],
    concept: {
      tr: `<p>Bu atölyede modülün yöntemlerini gerçek veriyle uygulayacaksın. Notebook, St. Louis Fed'in açık FRED veri tabanından 13 aylık ABD serisini indirir ve aylık bir tabloya çevirir.</p>
<p><b>Görevler</b></p>
<ol>
<li><b>Görev A — Problem ve kıyas:</b> Hedefi (gelecek ayın yıllık enflasyonu) ve 51 özelliği kur, 1984'ten başlayan tabloyu 2015-01-01'de zamana göre böl. Test döneminde saf öngörünün ve 51 değişkenli EKK'nın kök HKO'sunu hesapla.</li>
<li><b>Görev B — Lasso:</b> Değişkenleri eğitim verisiyle standartlaştır, λ'yı <code>TimeSeriesSplit(5)</code> ile seçen bir <code>LassoCV</code> kur, test kök HKO'sunu hesapla ve seçilen değişkenleri listele.</li>
</ol>
<div class="box"><b>Gemini'nin sık yaptığı hatalar:</b> hedefi kaydırmamak (sızıntı); veriyi karıştırarak bölmek; ölçekleyiciyi tüm veriyle kurmak; λ'yı karıştırılmış <code>KFold</code> ile seçmek; eksik ayları sıfırla ya da önceki değerle doldurmak. Kontrol hücreleri bunların hepsini yakalar.</div>
<p>Colab ve Gemini'yi kullanma kuralları Modül 0'daki atölyeyle aynı. Not: bu atölyede “bu ayın verisi” öngörü anında biliniyormuş gibi davranıyoruz. Gerçekte TÜFE bir sonraki ayın ortasında yayımlanır ve sonradan revize edilebilir; gerçek zamanlı bir öngörüde bu yayın gecikmesi hesaba katılmalıdır.</p>`,
      en: `<p>In this workshop you apply the module's methods to real data. The notebook downloads 13 monthly US series from the St. Louis Fed's open FRED database and turns them into a monthly table.</p>
<p><b>Tasks</b></p>
<ol>
<li><b>Task A — Problem and benchmark:</b> build the target (next month's annual inflation) and the 51 features, and split the table, which starts in 1984, by time at 2015-01-01. Compute the RMSE of the naive forecast and of the 51-variable OLS over the test period.</li>
<li><b>Task B — Lasso:</b> standardise the variables with the training data, build a <code>LassoCV</code> that chooses λ with <code>TimeSeriesSplit(5)</code>, compute its test RMSE and list the selected variables.</li>
</ol>
<div class="box"><b>Mistakes Gemini often makes:</b> not shifting the target (leakage); splitting by shuffling; fitting the scaler on all the data; choosing λ with shuffled <code>KFold</code>; filling missing months with zero or the previous value. The check cells catch all of these.</div>
<p>The rules for using Colab and Gemini are the same as in the Module 0 workshop. Note: in this workshop we act as if “this month's data” are known at forecast time. In reality CPI is published in the middle of the following month and may be revised later; a real-time forecast must account for this publication lag.</p>`
    },
    playground: null,
    cells: [
      {
        id: "m3-u9-c1", kind: "prompt",
        task: { tr: "Görev B için Gemini'ye vereceğin isteği burada hazırla. Notebook'ta <code>egitim</code> ve <code>test</code> tabloları, <code>ozellikler</code> listesi ve <code>hedef</code> sütunu var.", en: "Prepare the prompt for Task B here. The notebook has <code>train</code> and <code>test</code> tables, a <code>features</code> list and a <code>target</code> column." },
        weak: {
          prompt: { tr: "Enflasyon için bir Lasso modeli kur.", en: "Build a Lasso model for inflation." },
          reply: { tr: "Veriyi ölçekleyip Lasso kuralım:", en: "Let us scale the data and build Lasso:" },
          code: { tr: "sc = StandardScaler().fit(tablo[ozellikler])\nlasso = LassoCV(cv=5).fit(sc.transform(egitim[ozellikler]), egitim[\"hedef\"])", en: "sc = StandardScaler().fit(table[features])\nlasso = LassoCV(cv=5).fit(sc.transform(train[features]), train[\"target\"])" },
          claim: { tr: "Model hazır.", en: "The model is ready." }
        },
        checklist: [
          { label: { tr: "Tablolar ve sütunlar", en: "Tables and columns" }, why: { tr: "egitim, test, ozellikler, hedef adlarını yaz.", en: "Write the names train, test, features, target." }, re: { tr: "egitim|ozellikler|hedef", en: "train|features|target" } },
          { label: { tr: "Ölçekleme yalnızca eğitimle", en: "Scale with training only" }, why: { tr: "StandardScaler eğitim verisiyle kurulsun.", en: "Fit StandardScaler on the training data." }, re: { tr: "yalnızca eğitim|sadece eğitim|eğitim verisiyle|eğitim verisinden", en: "training data only|only the training|only on train|train only" } },
          { label: { tr: "Zamana saygılı çapraz doğrulama", en: "Time-respecting cross-validation" }, why: { tr: "TimeSeriesSplit(5) iste; karıştırma olmasın.", en: "Ask for TimeSeriesSplit(5); no shuffling." }, re: { tr: "timeseriessplit|zaman serisi|karıştırma", en: "timeseriessplit|time series|shuffl" } },
          { label: { tr: "Değerlendirme ve çıktı", en: "Evaluation and output" }, why: { tr: "Test kök HKO'su, saf öngörüyle karşılaştırma, seçilen değişkenlerin listesi.", en: "Test RMSE, comparison with the naive forecast, list of selected variables." }, re: { tr: "kök hko|rmse|saf|seçilen|katsayı", en: "rmse|naive|selected|coefficient" } }
        ],
        minLen: 100,
        strong: { prompt: { tr: "egitim (1984–2014) ve test (2015 ve sonrası) adlı iki pandas tablosu var; ozellikler listesi 51 sütun adı içeriyor, hedef sütunu gelecek ayın yıllık enflasyonu. StandardScaler'ı yalnızca egitim[ozellikler] ile kur ve test verisine yalnızca transform uygula. λ'yı LassoCV ile seç: alphas=np.logspace(-4, 0.5, 60), cv=TimeSeriesSplit(5) (karıştırma yok), max_iter=50000; modeli lasso değişkenine ata. Test döneminde kök HKO'yu hesaplayıp kok_hko_lasso'ya ata ve saf öngörünün (enf_g0) kök HKO'suyla karşılaştır. Katsayısı sıfırdan farklı özellikleri secilenler listesine yaz ve mutlak değere göre sıralayıp ilk 8'ini katsayılarıyla yazdır.", en: "There are two pandas tables, train (1984–2014) and test (2015 onwards); the features list holds 51 column names and the target column is next month's annual inflation. Fit StandardScaler on train[features] only and apply only transform to the test data. Choose λ with LassoCV: alphas=np.logspace(-4, 0.5, 60), cv=TimeSeriesSplit(5) (no shuffling), max_iter=50000; store the model in lasso. Compute the RMSE over the test period, store it in rmse_lasso and compare it with the naive forecast's (inf_l0) RMSE. Put the features with non-zero coefficients into a selected list, and print the top 8 by absolute value with their coefficients." } }
      },
      {
        id: "m3-u9-c2", kind: "colab",
        task: { tr: "<b>Görev A — Problem ve kıyas.</b> Notebook'u aç, Gemini ile <code>tablo</code>, <code>egitim</code>, <code>test</code>, <code>kok_hko_saf</code> ve <code>kok_hko_ekk</code> değişkenlerini oluştur, kontrol hücresini çalıştır ve verdiği kodu buraya yapıştır.", en: "<b>Task A — Problem and benchmark.</b> Open the notebook, create <code>table</code>, <code>train</code>, <code>test</code>, <code>rmse_naive</code> and <code>rmse_ols</code> with Gemini, run the check cell and paste the code it gives you here." },
        notebook: NB,
        steps: {
          tr: ["Notebook'u aç ve <b>Kurulum</b> hücresini çalıştır (13 seri FRED'den indirilir; <code>G</code> tablosu hazırlanır).", "<b>Görev A</b> hücresinde Gemini'den hedefi, 51 özelliği, zamana göre bölmeyi ve iki kök HKO'yu iste.", "Kodu denetle: hedef <code>shift(-1)</code> mi? Kesim 2015-01-01 mi? Karıştırma ya da doldurma var mı?", "<b>Kontrol A</b> hücresini çalıştır; geçerse <code>ML3-…</code> kodunu yapıştır."],
          en: ["Open the notebook and run the <b>Setup</b> cell (13 series are downloaded from FRED; the <code>G</code> table is prepared).", "In the <b>Task A</b> cell, ask Gemini for the target, the 51 features, the time-based split and the two RMSEs.", "Audit the code: is the target <code>shift(-1)</code>? Is the cut-off 2015-01-01? Any shuffling or filling?", "Run the <b>Check A</b> cell; if it passes, paste the <code>ML3-…</code> code."]
        },
        codeHashes: ["50991fa8"]
      },
      {
        id: "m3-u9-c3", kind: "colab",
        task: { tr: "<b>Görev B — Lasso.</b> Hazırladığın istekle <code>lasso</code>, <code>kok_hko_lasso</code> ve <code>secilenler</code> değişkenlerini üret, kontrol hücresini çalıştır ve kodu buraya yapıştır.", en: "<b>Task B — Lasso.</b> With the prompt you prepared, produce <code>lasso</code>, <code>rmse_lasso</code> and <code>selected</code>, run the check cell and paste the code here." },
        notebook: NB,
        steps: {
          tr: ["<b>Görev B</b> hücresinde Gemini'ye isteğini ver.", "Kodu denetle: ölçekleyici yalnızca eğitimle mi kuruldu? <code>cv=TimeSeriesSplit(5)</code> mi, yoksa karıştırılmış <code>KFold</code> mu?", "Seçilen değişkenleri yorumla: baz etkisi (aylik_g11) listede mi?", "<b>Kontrol B</b> hücresini çalıştır ve kodu buraya yapıştır."],
          en: ["In the <b>Task B</b> cell, give Gemini your prompt.", "Audit the code: was the scaler fitted on training only? Is it <code>cv=TimeSeriesSplit(5)</code> or a shuffled <code>KFold</code>?", "Interpret the selected variables: is the base effect (monthly_l11) on the list?", "Run the <b>Check B</b> cell and paste the code here."]
        },
        codeHashes: ["19c4f312"],
        after: { tr: "Lasso saf öngörüyü belirgin biçimde geçiyor ve iktisadi olarak anlamlı bir yapı buluyor. Ama unutma: seçilen değişkenler öngörü için yararlıdır, nedensel etki kanıtı değildir.", en: "Lasso clearly beats the naive forecast and finds an economically meaningful structure. But remember: the selected variables are useful for prediction, not evidence of causal effects." }
      },
      {
        id: "m3-u9-c4", kind: "auditlog",
        task: { tr: "Atölyeyi bir denetim notuyla kapat.", en: "Close the workshop with an audit note." },
        fields: {
          tr: [
            { label: "Gemini hedefi ve bölmeyi nasıl kurdu? Değiştirmen gerekti mi?", help: "shift(-1), kesim tarihi, karıştırma", ph: "Örnek: Gemini önce hedefi kaydırmamıştı…" },
            { label: "Ölçekleme ve çapraz doğrulama nasıl yapıldı?", help: "Yalnızca eğitim mi? TimeSeriesSplit mi?", ph: "Örnek: kod KFold(shuffle=True) kullanıyordu…" },
            { label: "Sonucu nasıl yorumluyorsun?", help: "Lasso saf öngörüyü ne kadar geçiyor? Hangi değişkenler seçildi, ne anlama geliyor?", ph: "Örnek: Lasso kök HKO'yu %35 düşürdü; baz etkisi…" }
          ],
          en: [
            { label: "How did Gemini build the target and the split? Did you need to change it?", help: "shift(-1), cut-off date, shuffling", ph: "Example: Gemini first did not shift the target…" },
            { label: "How were scaling and cross-validation done?", help: "Training only? TimeSeriesSplit?", ph: "Example: the code used KFold(shuffle=True)…" },
            { label: "How do you interpret the result?", help: "By how much does Lasso beat the naive forecast? Which variables were selected, and what do they mean?", ph: "Example: Lasso cut the RMSE by 35%; the base effect…" }
          ]
        }
      }
    ],
    quiz: [
      { q: { tr: "Hedefi kaydırmayı unutmak neye yol açar?", en: "What does forgetting to shift the target lead to?" }, options: { tr: ["Hedef sızıntısı: model cevabı soruda görür", "Daha yavaş kod", "Daha düşük R²"], en: ["Target leakage: the model sees the answer in the question", "Slower code", "Lower R²"] }, answer: 0, explain: { tr: "R² = 1 gibi “kusursuz” sonuçlar ilk önce sızıntı şüphesi uyandırmalı.", en: "“Flawless” results like R² = 1 should first raise suspicion of leakage." } },
      { q: { tr: "Ölçekleyici neden yalnızca eğitim verisiyle kurulur?", en: "Why is the scaler fitted on training data only?" }, options: { tr: ["Test döneminin ortalaması ve sapması öngörü anında bilinmez", "Kod daha kısa olsun diye", "Test verisi küçük olduğu için"], en: ["The test period's mean and spread are unknown at forecast time", "To keep the code short", "Because the test data are small"] }, answer: 0, explain: { tr: "Aksi hâlde geleceğin bilgisi geçmişe sızar.", en: "Otherwise future information leaks into the past." } },
      { q: { tr: "Bu atölyedeki öngörü neden gerçek zamanlı bir öngörüden biraz iyimserdir?", en: "Why is the forecast in this workshop slightly optimistic compared with a real-time one?" }, options: { tr: ["TÜFE bir sonraki ayın ortasında yayımlanır ve revize edilebilir; biz bu ayın verisini biliyormuş gibi davrandık", "Lasso her zaman iyimserdir", "FRED verisi yanlıştır"], en: ["CPI is published mid-way through the next month and may be revised; we acted as if this month's data were known", "Lasso is always optimistic", "FRED data are wrong"] }, answer: 0, explain: { tr: "Yayın gecikmesi ve revizyonlar gerçek zamanlı öngörüde hesaba katılmalı.", en: "Publication lags and revisions must be accounted for in real-time forecasting." } }
    ]
  });
})();
