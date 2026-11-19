/* Modül 2 — Model başarısı · Üniteler 6–9
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 * "Örnek YZ yanıtları" öğretim amacıyla hazırlanmıştır.
 */
(function () {
  "use strict";
  const D = window.M2_DATA;
  const W = D.WAGE;
  const U = window.M2_UNITS;
  const DATA = ["fred/UNRATE.csv"];

  /* =================================================================== */
  /* Ünite 6 — Çapraz doğrulama                                            */
  /* =================================================================== */
  const CV = (bug) => ({
    tr: W.tr + `\nk = 5\nkatlar = np.array_split(rng.permutation(30), k)\ncv_hatalari = []\nfor d in range(1, 9):\n    hatalar = []\n    for i in range(k):\n        dog = katlar[i]\n        egt = ${bug ? "np.concatenate(katlar)" : "np.concatenate([katlar[j] for j in range(k) if j != i])"}\n        hatalar.append(hko(ongor(kur(e_egt[egt], y_egt[egt], d), e_egt[dog]), y_egt[dog]))\n    cv_hatalari.append(np.mean(hatalar))\nen_iyi = int(np.argmin(cv_hatalari)) + 1\nprint("Çapraz doğrulama hataları:", [round(float(h), 3) for h in cv_hatalari])\nprint("Seçilen derece:", en_iyi)`,
    en: W.en + `\nk = 5\nfolds = np.array_split(rng.permutation(30), k)\ncv_errors = []\nfor d in range(1, 9):\n    errs = []\n    for i in range(k):\n        val = folds[i]\n        trn = ${bug ? "np.concatenate(folds)" : "np.concatenate([folds[j] for j in range(k) if j != i])"}\n        errs.append(mse(predict(fit(e_tr[trn], y_tr[trn], d), e_tr[val]), y_tr[val]))\n    cv_errors.append(np.mean(errs))\nbest = int(np.argmin(cv_errors)) + 1\nprint("Cross-validation errors:", [round(float(h), 3) for h in cv_errors])\nprint("Chosen degree:", best)`
  });
  U.push({
    id: "m2-u6",
    minutes: 30,
    packages: ["numpy"],
    title: { tr: "Çapraz doğrulama", en: "Cross-validation" },
    blurb: { tr: "Test verisine dokunmadan model seçmek: k-katlı çapraz doğrulama.", en: "Choosing a model without touching the test data: k-fold cross-validation." },
    terms: [{ tr: "doğrulama verisi", en: "validation data" }, { tr: "k-katlı çapraz doğrulama", en: "k-fold cross-validation" }, { tr: "kat", en: "fold" }],
    concept: {
      tr: `<p>Ünite 3'te en iyi dereceyi test hatasına bakarak seçtik. Ama bu bir hile: test verisini model seçmek için kullanırsak, o artık “görülmemiş” veri değildir ve modelin gerçek başarısını olduğundan iyi gösterir. Test verisi <b>en sona</b> saklanmalı ve <b>bir kez</b> kullanılmalı.</p>
<p>Peki test verisine bakmadan nasıl model seçeriz? <b>k-katlı çapraz doğrulama</b> ile:</p>
<ol>
<li>Eğitim verisini k eşit parçaya (<b>kat</b>) böl (ör. k = 5).</li>
<li>Her turda bir katı <b>doğrulama</b> için ayır, modeli kalan k − 1 katla kur, ayrılan katta hatayı ölç.</li>
<li>k turun hatalarının ortalaması, o modelin <b>çapraz doğrulama hatasıdır</b>.</li>
<li>Her aday model (her derece) için bunu tekrarla; çapraz doğrulama hatası en düşük olanı seç.</li>
</ol>
<p>Her gözlem tam bir kez doğrulamada kullanılır ve hiçbir turda hem eğitimde hem doğrulamada yer almaz. Model seçildikten sonra tüm eğitim verisiyle yeniden kurulur ve test verisinde <b>bir kez</b> değerlendirilir.</p>
<div class="box">Küçük örneklemde çapraz doğrulama hatası gürültülüdür; yakın modellerin sırası değişebilir. Yine de eğitim hatasının aksine, aşırı esnek modelleri cezalandırır.</div>`,
      en: `<p>In Unit 3 we picked the best degree by looking at the test error. But that is cheating: if we use the test data to choose a model, they are no longer “unseen” and they overstate the model's real performance. Test data should be kept until <b>the very end</b> and used <b>once</b>.</p>
<p>So how do we choose a model without looking at the test data? With <b>k-fold cross-validation</b>:</p>
<ol>
<li>Split the training data into k equal parts (<b>folds</b>), e.g. k = 5.</li>
<li>In each round, hold out one fold for <b>validation</b>, build the model on the other k − 1 folds and measure the error on the held-out fold.</li>
<li>The average of the k rounds' errors is the model's <b>cross-validation error</b>.</li>
<li>Repeat for every candidate model (every degree) and choose the one with the lowest cross-validation error.</li>
</ol>
<p>Every observation is used for validation exactly once and is never in both training and validation in the same round. Once a model is chosen, it is rebuilt on all the training data and evaluated on the test data <b>once</b>.</p>
<div class="box">In small samples the cross-validation error is noisy; the ranking of similar models can change. Still, unlike training error, it penalises overly flexible models.</div>`
    },
    playground: {
      type: "kfold",
      intro: { tr: "30 gözlem k kata bölünüyor. Turlar arasında gezin: her turda hangi gözlemlerin doğrulamaya ayrıldığına bak.", en: "30 observations are split into k folds. Step through the rounds: see which observations are held out for validation in each round." },
      takeaway: { tr: "Her gözlem bir kez doğrulamada, k − 1 kez eğitimde kullanılır; hiçbir turda ikisinde birden değil.", en: "Each observation is used once for validation and k − 1 times for training; never both in the same round." }
    },
    cells: [
      {
        id: "m2-u6-c1", kind: "run",
        task: { tr: "Derece 1–8 için 5-katlı çapraz doğrulama. Önce tahmin et.", en: "5-fold cross-validation for degrees 1–8. Predict first." },
        predict: { q: { tr: "Çapraz doğrulama hangi dereceyi seçer?", en: "Which degree does cross-validation choose?" }, options: { tr: ["2", "5", "8"], en: ["2", "5", "8"] }, answer: 0, explain: { tr: "Test verisine hiç bakmadan, gerçek ilişkinin biçimini (2. derece) buluyor.", en: "Without looking at the test data at all, it finds the shape of the true relationship (degree 2)." } },
        code: { tr: CV(false).tr, en: CV(false).en },
        after: { tr: "Derece 7 ve 8'in çapraz doğrulama hatası yüzlerle ifade ediliyor: tek bir katta bile aşırı esnek model felakete dönüşüyor. Eğitim hatasına bakan biri derece 8'i seçerdi.", en: "Degrees 7 and 8 have cross-validation errors in the hundreds: overly flexible models blow up on even a single fold. Someone looking at training error would pick degree 8." }
      },
      {
        id: "m2-u6-c2", kind: "audit",
        task: { tr: "YZ çapraz doğrulama kodu yazdı ama en esnek modeli seçti. Hatalı satırı bul ve düzelt.", en: "The AI wrote cross-validation code but picked the most flexible model. Find the faulty line and fix it." },
        ai: {
          prompt: { tr: "30 kişilik eğitim verisiyle 5-katlı çapraz doğrulama yaparak 1–8 arasında en iyi polinom derecesini seç.", en: "Choose the best polynomial degree between 1 and 8 with 5-fold cross-validation on the 30-person training data." },
          reply: { tr: "Her derece için 5 turlu çapraz doğrulama:", en: "5-round cross-validation for each degree:" },
          code: { tr: CV(true).tr, en: CV(true).en },
          claim: { tr: "Çapraz doğrulamaya göre en iyi derece 8.", en: "According to cross-validation the best degree is 8." }
        },
        bugLines: [22],
        lineExplain: { tr: "Modeli kurmak için <b>tüm katlar</b> birleştiriliyor; doğrulama katı da eğitimin içinde. Model doğrulamada ölçüldüğü gözlemleri zaten görmüş. Böylece çapraz doğrulama hatası eğitim hatasına dönüşüyor ve hep en esnek modeli seçiyor.", en: "<b>All folds</b> are combined to build the model, so the validation fold is inside the training set. The model has already seen the observations it is evaluated on. Cross-validation error thus turns into training error and always picks the most flexible model." },
        hints: [{ tr: "Eğitime yalnızca <code>i</code> dışındaki katları al: <code>np.concatenate([katlar[j] for j in range(k) if j != i])</code>", en: "Take only the folds other than <code>i</code> for training: <code>np.concatenate([folds[j] for j in range(k) if j != i])</code>" }],
        solution: { tr: CV(false).tr, en: CV(false).en },
        checks: [
          { py: { tr: "all(abs(cv_hatalari[d - 1] - np.mean([hko(ongor(kur(e_egt[np.concatenate([katlar[j] for j in range(5) if j != i])], y_egt[np.concatenate([katlar[j] for j in range(5) if j != i])], d), e_egt[katlar[i]]), y_egt[katlar[i]]) for i in range(5)])) < 1e-9 for d in (1, 2, 8))", en: "all(abs(cv_errors[d - 1] - np.mean([mse(predict(fit(e_tr[np.concatenate([folds[j] for j in range(5) if j != i])], y_tr[np.concatenate([folds[j] for j in range(5) if j != i])], d), e_tr[folds[i]]), y_tr[folds[i]]) for i in range(5)])) < 1e-9 for d in (1, 2, 8))" }, msg: { tr: "Çapraz doğrulama hataları, doğrulama katı eğitimden çıkarılarak hesaplanmalı.", en: "The cross-validation errors should be computed with the validation fold left out of training." } },
          { py: { tr: "en_iyi == int(np.argmin(cv_hatalari)) + 1 and en_iyi <= 4", en: "best == int(np.argmin(cv_errors)) + 1 and best <= 4" }, msg: { tr: "Düzeltilmiş çapraz doğrulama düşük bir derece seçmeli.", en: "Corrected cross-validation should choose a low degree." } }
        ],
        after: { tr: "Tek satırlık bir hata, yöntemin tüm amacını boşa çıkardı. Bu tür bir hatayı yakalamanın yolu, bir sonraki alıştırmada yazacağın türden bir kontrol: eğitim ve doğrulama hiçbir turda ortak gözlem içermemeli.", en: "A one-line bug defeated the whole purpose of the method. The way to catch this kind of bug is a check like the one you will write in the next exercise: training and validation must never share an observation in any round." }
      },
      {
        id: "m2-u6-c3", kind: "check",
        task: { tr: "Her çapraz doğrulama turunda kullanabileceğin bir kontrol yaz: <code>kontrol_katlar(egitim, dogrulama, n)</code>, eğitim ve doğrulama ortak gözlem içeriyorsa ya da ikisi birlikte n gözlemin hepsini kapsamıyorsa <code>AssertionError</code> versin.", en: "Write a check you can use in every cross-validation round: <code>check_folds(train, val, n)</code> should raise <code>AssertionError</code> if training and validation share any observation, or if together they do not cover all n observations." },
        code: {
          tr: `import numpy as np\n\ndef kontrol_katlar(egitim, dogrulama, n):\n    assert ___, "Eğitim ve doğrulama ortak gözlem içeriyor!"\n    assert ___, "Bazı gözlemler kullanılmamış!"\n\nkatlar = np.array_split(np.random.default_rng(0).permutation(30), 5)\nkontrol_katlar(np.concatenate(katlar[1:]), katlar[0], 30)\nprint("Kontrol geçti")`,
          en: `import numpy as np\n\ndef check_folds(train, val, n):\n    assert ___, "Training and validation share observations!"\n    assert ___, "Some observations were not used!"\n\nfolds = np.array_split(np.random.default_rng(0).permutation(30), 5)\ncheck_folds(np.concatenate(folds[1:]), folds[0], 30)\nprint("Check passed")`
        },
        solution: {
          tr: `import numpy as np\n\ndef kontrol_katlar(egitim, dogrulama, n):\n    assert len(set(egitim) & set(dogrulama)) == 0, "Eğitim ve doğrulama ortak gözlem içeriyor!"\n    assert len(set(egitim) | set(dogrulama)) == n, "Bazı gözlemler kullanılmamış!"\n\nkatlar = np.array_split(np.random.default_rng(0).permutation(30), 5)\nkontrol_katlar(np.concatenate(katlar[1:]), katlar[0], 30)\nprint("Kontrol geçti")`,
          en: `import numpy as np\n\ndef check_folds(train, val, n):\n    assert len(set(train) & set(val)) == 0, "Training and validation share observations!"\n    assert len(set(train) | set(val)) == n, "Some observations were not used!"\n\nfolds = np.array_split(np.random.default_rng(0).permutation(30), 5)\ncheck_folds(np.concatenate(folds[1:]), folds[0], 30)\nprint("Check passed")`
        },
        hints: [{ tr: "Kesişim: <code>set(a) &amp; set(b)</code> boş olmalı. Birleşim: <code>set(a) | set(b)</code> n elemanlı olmalı.", en: "Intersection: <code>set(a) &amp; set(b)</code> should be empty. Union: <code>set(a) | set(b)</code> should have n elements." }],
        checks: [
          { py: { tr: "_raises(lambda: kontrol_katlar(np.concatenate(katlar), katlar[0], 30))", en: "_raises(lambda: check_folds(np.concatenate(folds), folds[0], 30))" }, msg: { tr: "Doğrulama katı eğitimin içindeyse kontrol hata vermeli.", en: "The check should fail if the validation fold is inside training." } },
          { py: { tr: "_raises(lambda: kontrol_katlar(np.concatenate(katlar[2:]), katlar[0], 30))", en: "_raises(lambda: check_folds(np.concatenate(folds[2:]), folds[0], 30))" }, msg: { tr: "Bir kat hiç kullanılmamışsa da hata vermeli.", en: "It should also fail if a fold is not used at all." } },
          { py: { tr: "kontrol_katlar(np.concatenate(katlar[1:]), katlar[0], 30) is None", en: "check_folds(np.concatenate(folds[1:]), folds[0], 30) is None" }, msg: { tr: "Doğru bir bölmede hata vermemeli.", en: "It should not fail on a correct split." } }
        ]
      },
      {
        id: "m2-u6-c4", kind: "interpret",
        task: { tr: "YZ bir modelleme sürecini anlattı. Hangi adımlar test verisinin amacını bozuyor?", en: "The AI described a modelling process. Which steps defeat the purpose of the test data?" },
        prompt: { tr: "Bir öngörü modeli için model seçme ve değerlendirme sürecini adım adım anlatır mısın?", en: "Can you describe step by step how to choose and evaluate a prediction model?" },
        sentences: {
          tr: ["Veriyi önce eğitim ve test olarak ayırırız.", "Aday modelleri eğitim verisinde çapraz doğrulamayla karşılaştırırız.", "Test hatası beklediğimizden kötü çıkarsa modeli değiştirip test verisinde yeniden deneriz.", "Seçilen modeli tüm eğitim verisiyle yeniden kurar, test verisinde bir kez değerlendiririz.", "En iyi sonucu veren modeli bulana kadar birçok modeli test verisinde deneriz."],
          en: ["First we split the data into training and test sets.", "We compare candidate models on the training data with cross-validation.", "If the test error is worse than expected, we change the model and try again on the test data.", "We rebuild the chosen model on all the training data and evaluate it once on the test data.", "We try many models on the test data until we find the one with the best result."]
        },
        bad: [2, 4],
        explain: {
          tr: ["Doğru.", "Doğru.", "<b>Sorunlu:</b> test sonucuna göre modeli değiştirmek, test verisini model seçimine katar. Test hatası artık iyimser olur.", "Doğru.", "<b>Sorunlu:</b> bu, test verisini doğrulama verisi gibi kullanmaktır; seçilen modelin test hatası gerçek başarısını abartır."],
          en: ["Correct.", "Correct.", "<b>Problematic:</b> changing the model based on the test result brings the test data into model choice. The test error becomes optimistic.", "Correct.", "<b>Problematic:</b> this uses the test data as validation data; the chosen model's test error overstates its real performance."]
        }
      }
    ],
    quiz: [
      { q: { tr: "k-katlı çapraz doğrulamada her gözlem doğrulamada kaç kez kullanılır?", en: "In k-fold cross-validation, how many times is each observation used for validation?" }, options: { tr: ["Bir kez", "k kez", "Hiç"], en: ["Once", "k times", "Never"] }, answer: 0, explain: { tr: "Ve k − 1 kez eğitimde.", en: "And k − 1 times in training." } },
      { q: { tr: "Test verisi ne zaman kullanılmalı?", en: "When should the test data be used?" }, options: { tr: ["Her model denemesinde", "En sonda, seçilen model için bir kez", "Hiçbir zaman"], en: ["In every model trial", "At the very end, once, for the chosen model", "Never"] }, answer: 1, explain: { tr: "Aksi hâlde test hatası iyimser olur.", en: "Otherwise the test error becomes optimistic." } },
      { q: { tr: "Doğrulama katı eğitimde de kullanılırsa çapraz doğrulama hatası neye dönüşür?", en: "If the validation fold is also used for training, what does the cross-validation error turn into?" }, options: { tr: ["Test hatasına", "Eğitim hatasına", "İndirgenemez hataya"], en: ["The test error", "The training error", "The irreducible error"] }, answer: 1, explain: { tr: "Ve hep en esnek modeli seçer.", en: "And it always picks the most flexible model." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 7 — Veri sızıntısı                                              */
  /* =================================================================== */
  const READ_TR = `import pandas as pd\nveri = pd.read_csv("fred/UNRATE.csv", names=["tarih", "oran"], header=0, parse_dates=["tarih"]).dropna()`;
  const READ_EN = `import pandas as pd\ndata = pd.read_csv("fred/UNRATE.csv", names=["date", "rate"], header=0, parse_dates=["date"]).dropna()`;
  const SCALE = (src) => ({
    tr: READ_TR + `\negitim = veri[veri["tarih"] < "2015-01-01"].copy()\ntest = veri[veri["tarih"] >= "2015-01-01"].copy()\nort, std = ${src.tr}["oran"].mean(), ${src.tr}["oran"].std()\negitim["z"] = (egitim["oran"] - ort) / std\ntest["z"] = (test["oran"] - ort) / std\nprint("Ortalama:", round(ort, 3), "| Std:", round(std, 3))`,
    en: READ_EN + `\ntrain = data[data["date"] < "2015-01-01"].copy()\ntest = data[data["date"] >= "2015-01-01"].copy()\nmu, sd = ${src.en}["rate"].mean(), ${src.en}["rate"].std()\ntrain["z"] = (train["rate"] - mu) / sd\ntest["z"] = (test["rate"] - mu) / sd\nprint("Mean:", round(mu, 3), "| Sd:", round(sd, 3))`
  });
  const ROLL = (expr) => ({
    tr: `import pandas as pd\nveri = pd.read_csv("fred/UNRATE.csv", names=["tarih", "oran"], header=0, parse_dates=["tarih"])\nveri = veri[(veri["tarih"] >= "2000-01-01") & (veri["tarih"] < "2020-01-01")].reset_index(drop=True)\nveri["son3_ort"] = ${expr.tr}\nprint(veri.head(5))\nprint("Korelasyon:", round(veri["oran"].corr(veri["son3_ort"]), 4))`,
    en: `import pandas as pd\ndata = pd.read_csv("fred/UNRATE.csv", names=["date", "rate"], header=0, parse_dates=["date"])\ndata = data[(data["date"] >= "2000-01-01") & (data["date"] < "2020-01-01")].reset_index(drop=True)\ndata["last3_avg"] = ${expr.en}\nprint(data.head(5))\nprint("Correlation:", round(data["rate"].corr(data["last3_avg"]), 4))`
  });
  U.push({
    id: "m2-u7",
    minutes: 30,
    packages: ["pandas"],
    data: DATA,
    title: { tr: "Veri sızıntısı", en: "Data leakage" },
    blurb: { tr: "Modelin, öngörü anında bilinemeyecek bir bilgiyi görmesi. Üç tür sızıntı ve gerçek veriyle örnekler.", en: "When a model sees information that could not be known at prediction time. Three kinds of leakage, with real-data examples." },
    terms: [{ tr: "veri sızıntısı", en: "data leakage" }, { tr: "hedef sızıntısı", en: "target leakage" }, { tr: "öngörü anı", en: "prediction time" }],
    concept: {
      tr: `<p><b>Veri sızıntısı</b>, modelin eğitim ya da değerlendirme sırasında, gerçek kullanımda <b>öngörü anında bilinemeyecek</b> bir bilgiyi görmesidir. Sızıntılı bir model kâğıt üzerinde olağanüstü başarılı görünür, gerçek hayatta çöker. Üç yaygın türü vardır:</p>
<ul>
<li><b>Hedef sızıntısı:</b> özelliklerden biri, hedefin sonucunu içeriyor. Örneğin temerrüt modelinde “tahsilat bürosuna devredildi” sütunu: bu bilgi temerrütten <i>sonra</i> oluşur. Modül 1'de hedefin X'te unutulması bunun en uç hâliydi.</li>
<li><b>Test bilgisinin eğitime sızması:</b> doldurma, ölçekleme gibi hazırlık adımlarının değerlerini (ortalama, medyan, standart sapma) <b>tüm veriden</b> hesaplamak. Doğrusu: bu değerleri <b>yalnızca eğitim verisinden</b> hesaplayıp aynen test verisine uygulamak.</li>
<li><b>Gelecekten bilgi:</b> zaman serilerinde, öngörülen anın sonrasına ait bilgiyi özellik olarak kullanmak. Örneğin bu ayı öngörmek için gelecek ayı da içeren bir ortalama.</li>
</ul>
<div class="box econ"><b>Altın soru:</b> “Bu bilgi, öngörüyü yapacağım anda elimde olur muydu?” Yanıt hayırsa, sızıntı var. Modül 1'deki eksik veri ve ölçekleme ünitelerinde bu ayrıntıya girmemiştik; artık kural şu: hazırlık adımlarının değerleri eğitim verisinden öğrenilir.</div>`,
      en: `<p><b>Data leakage</b> is when, during training or evaluation, a model sees information that <b>could not be known at prediction time</b> in real use. A leaky model looks extraordinarily successful on paper and collapses in real life. There are three common kinds:</p>
<ul>
<li><b>Target leakage:</b> a feature contains the outcome of the target. For example, in a default model, a column “handed to a collection agency”: that information arises <i>after</i> default. Leaving the target in X in Module 1 was the extreme case of this.</li>
<li><b>Test information leaking into training:</b> computing the values used in preparation steps such as filling and scaling (mean, median, standard deviation) from <b>all the data</b>. The right way: compute them <b>from the training data only</b> and apply them as they are to the test data.</li>
<li><b>Information from the future:</b> in time series, using information from after the moment being predicted as a feature. For example, an average that includes next month to predict this month.</li>
</ul>
<div class="box econ"><b>The golden question:</b> “Would I have this information at the moment I make the prediction?” If not, there is leakage. We did not go into this detail in the Module 1 units on missing data and scaling; from now on the rule is: the values used in preparation steps are learned from the training data.</div>`
    },
    playground: {
      type: "sorter",
      intro: { tr: "Her durumu oku ve altın soruyu sor: bu bilgi öngörü anında elimde olur muydu?", en: "Read each situation and ask the golden question: would I have this information at prediction time?" },
      cats: [
        { id: "leak", label: { tr: "Sızıntı var", en: "Leakage" } },
        { id: "ok", label: { tr: "Sızıntı yok", en: "No leakage" } }
      ],
      items: [
        { text: { tr: "Eksik gelirleri tüm verinin medyanıyla doldurup sonra eğitim ve test olarak ayırmak", en: "Filling missing incomes with the median of all the data, then splitting into training and test" }, cat: "leak", why: { tr: "Medyan test verisini de görerek hesaplandı.", en: "The median was computed seeing the test data too." } },
        { text: { tr: "Ölçekleme için ortalama ve standart sapmayı yalnızca eğitim verisinden hesaplamak", en: "Computing the mean and standard deviation for scaling from the training data only" }, cat: "ok", why: { tr: "Doğru yöntem; aynı değerler teste uygulanır.", en: "The right way; the same values are applied to the test data." } },
        { text: { tr: "Temerrüt modelinde “tahsilat bürosuna devredildi” sütununu özellik olarak kullanmak", en: "Using the column “handed to a collection agency” as a feature in a default model" }, cat: "leak", why: { tr: "Bu bilgi temerrütten sonra oluşur: hedef sızıntısı.", en: "This information arises after default: target leakage." } },
        { text: { tr: "Bu ayın işsizliğini öngörmek için geçen ayın işsizlik oranını kullanmak", en: "Using last month's unemployment rate to predict this month's" }, cat: "ok", why: { tr: "Geçen ayın değeri öngörü anında bilinir.", en: "Last month's value is known at prediction time." } },
        { text: { tr: "Bu ayın işsizliğini öngörmek için gelecek ayı da içeren 3 aylık ortalamayı kullanmak", en: "Using a 3-month average that includes next month to predict this month's unemployment" }, cat: "leak", why: { tr: "Gelecekten bilgi.", en: "Information from the future." } },
        { text: { tr: "Bugünkü hisse getirisini öngörürken bugünün kapanış fiyatını özellik olarak kullanmak", en: "Using today's closing price as a feature to predict today's stock return" }, cat: "leak", why: { tr: "Kapanış fiyatı, öngörülmek istenen getiriyi zaten içeriyor.", en: "The closing price already contains the return to be predicted." } },
        { text: { tr: "Model seçiminde test verisine hiç bakmayıp çapraz doğrulama kullanmak", en: "Never looking at the test data during model choice and using cross-validation" }, cat: "ok", why: { tr: "Test verisi temiz kalıyor.", en: "The test data stay clean." } }
      ],
      takeaway: { tr: "“Bu bilgi öngörü anında elimde olur muydu?” Hayırsa, sızıntı var.", en: "“Would I have this information at prediction time?” If not, there is leakage." }
    },
    cells: [
      {
        id: "m2-u7-c1", kind: "audit",
        task: { tr: "İşsizlik oranını standartlaştırıyoruz; model 2015 öncesiyle kurulacak, 2015 sonrasında sınanacak. YZ'nin kodunda test döneminin bilgisi eğitime sızıyor. Hatalı satırı bul ve düzelt.", en: "We standardise the unemployment rate; the model will be built on data before 2015 and tested after. In the AI's code, information from the test period leaks into training. Find the faulty line and fix it." },
        ai: {
          prompt: { tr: "İşsizlik verisini 2015 öncesi eğitim, sonrası test olarak ayır ve oranı standartlaştır.", en: "Split the unemployment data into training before 2015 and test after, and standardise the rate." },
          reply: { tr: "Ayırıp ölçekleyelim:", en: "Let us split and scale:" },
          code: { tr: SCALE({ tr: "veri" }).tr, en: SCALE({ en: "data" }).en },
          claim: { tr: "Veri ayrıldı ve standartlaştırıldı; modele hazır.", en: "The data are split and standardised; ready for the model." }
        },
        bugLines: [5],
        lineExplain: { tr: "Ortalama ve standart sapma <b>tüm veriden</b> hesaplanıyor; 2020'deki %14,8'lik sıçrama dahil test döneminin bilgisi eğitime giriyor. 2015'te modeli kuran biri 2020'yi bilemezdi.", en: "The mean and standard deviation are computed from <b>all the data</b>; information from the test period, including the 14.8% jump in 2020, enters training. Someone building the model in 2015 could not have known 2020." },
        hints: [{ tr: "Değerleri yalnızca eğitimden hesapla: <code>egitim[\"oran\"].mean()</code>, <code>egitim[\"oran\"].std()</code>. Aynı değerleri teste uygula.", en: "Compute the values from training only: <code>train[\"rate\"].mean()</code>, <code>train[\"rate\"].std()</code>. Apply the same values to test." }],
        solution: { tr: SCALE({ tr: "egitim" }).tr, en: SCALE({ en: "train" }).en },
        checks: [
          { py: { tr: "abs(ort - egitim[\"oran\"].mean()) < 1e-12 and abs(std - egitim[\"oran\"].std()) < 1e-12", en: "abs(mu - train[\"rate\"].mean()) < 1e-12 and abs(sd - train[\"rate\"].std()) < 1e-12" }, msg: { tr: "Ortalama ve standart sapma yalnızca eğitim verisinden hesaplanmalı.", en: "The mean and standard deviation should come from the training data only." } },
          { py: { tr: "abs(test[\"z\"].iloc[0] - (test[\"oran\"].iloc[0] - egitim[\"oran\"].mean()) / egitim[\"oran\"].std()) < 1e-12", en: "abs(test[\"z\"].iloc[0] - (test[\"rate\"].iloc[0] - train[\"rate\"].mean()) / train[\"rate\"].std()) < 1e-12" }, msg: { tr: "Test verisi de eğitimden hesaplanan değerlerle ölçeklenmeli.", en: "The test data should also be scaled with the values computed from training." } }
        ],
        after: { tr: "Fark sayısal olarak küçük görünebilir. Ama ilke önemli: daha karmaşık hazırlık adımlarında (doldurma, seçme, dönüştürme) aynı hata, test sonucunu sessizce iyimser yapar. Test verisindeki z değerlerinin ortalaması artık 0 değil; olması da gerekmiyor.", en: "The difference may look small numerically. But the principle matters: in more complex preparation steps (filling, selecting, transforming) the same mistake silently makes the test result optimistic. The mean of the test z-values is no longer 0, and it need not be." }
      },
      {
        id: "m2-u7-c2", kind: "audit",
        task: { tr: "Bu ayın işsizliğini öngörmek için “son 3 ayın ortalaması” adlı bir özellik istedik. YZ'nin özelliği gelecekten bilgi içeriyor. Hatalı satırı bul ve düzelt: özellik yalnızca önceki 3 ayı kullansın.", en: "We asked for a feature called “average of the last 3 months” to predict this month's unemployment. The AI's feature contains information from the future. Find the faulty line and fix it: the feature should use only the previous 3 months." },
        ai: {
          prompt: { tr: "İşsizlik serisinde bu ayı öngörmek için son 3 ayın ortalaması adlı bir özellik ekle.", en: "Add a feature called the average of the last 3 months to predict this month in the unemployment series." },
          reply: { tr: "Hareketli ortalama ekleyelim:", en: "Let us add a moving average:" },
          code: { tr: ROLL({ tr: 'veri["oran"].rolling(3, center=True).mean()' }).tr, en: ROLL({ en: 'data["rate"].rolling(3, center=True).mean()' }).en },
          claim: { tr: "Özellik ile hedef arasındaki korelasyon 0,99'un üzerinde: çok güçlü bir öngörücü.", en: "The correlation between the feature and the target is above 0.99: a very strong predictor." }
        },
        bugLines: [4],
        lineExplain: { tr: "<code>center=True</code> pencereyi ortalar: ortalama geçen ayı, <b>bu ayı</b> ve <b>gelecek ayı</b> içeriyor. Öngörmek istediğimiz değer özelliğin içinde. Yüksek korelasyon bir başarı değil, sızıntının işareti.", en: "<code>center=True</code> centres the window: the average includes last month, <b>this month</b> and <b>next month</b>. The value we want to predict is inside the feature. The high correlation is not a success but a sign of leakage." },
        hints: [{ tr: "Önce seriyi bir ay kaydır, sonra 3 aylık ortalamayı al: <code>veri[\"oran\"].shift(1).rolling(3).mean()</code>", en: "First shift the series by one month, then take the 3-month average: <code>data[\"rate\"].shift(1).rolling(3).mean()</code>" }],
        solution: { tr: ROLL({ tr: 'veri["oran"].shift(1).rolling(3).mean()' }).tr, en: ROLL({ en: 'data["rate"].shift(1).rolling(3).mean()' }).en },
        checks: [{ py: { tr: "abs(veri[\"son3_ort\"].iloc[10] - veri[\"oran\"].iloc[7:10].mean()) < 1e-12 and veri[\"son3_ort\"].iloc[:3].isna().all()", en: "abs(data[\"last3_avg\"].iloc[10] - data[\"rate\"].iloc[7:10].mean()) < 1e-12 and data[\"last3_avg\"].iloc[:3].isna().all()" }, msg: { tr: "Her ayın özelliği, yalnızca önceki 3 ayın ortalaması olmalı (ilk 3 ay boş kalır).", en: "Each month's feature should be the average of the previous 3 months only (the first 3 months stay empty)." } }],
        after: { tr: "Korelasyon biraz düştü ama artık dürüst: bu özelliği gerçek bir öngörüde de kullanabilirsin. pandas'ta <code>rolling</code> varsayılan olarak geriye bakar; <code>center=True</code> ve <code>shift(-1)</code> gibi ifadeler zaman serisinde alarm zili olmalı.", en: "The correlation fell slightly but is now honest: you could use this feature in a real forecast. In pandas <code>rolling</code> looks backwards by default; expressions like <code>center=True</code> and <code>shift(-1)</code> should ring alarm bells in time series." }
      },
      {
        id: "m2-u7-c3", kind: "interpret",
        task: { tr: "Bir bankanın temerrüt modeli %99 doğrulukla çalışıyor. YZ sonucu yorumladı. Hangi cümleler sızıntıyı gözden kaçırıyor?", en: "A bank's default model works with 99% accuracy. The AI interpreted the result. Which sentences overlook leakage?" },
        prompt: { tr: "Temerrüt modelimiz test verisinde %99 doğruluk verdi. En önemli özellik 'tahsilat_bürosuna_devredildi'. Yorumlar mısın?", en: "Our default model achieved 99% accuracy on the test data. The most important feature is 'handed_to_collection_agency'. Can you interpret this?" },
        sentences: {
          tr: ["Model olağanüstü başarılı; hemen kullanıma alınabilir.", "En önemli özellik temerrütten sonra oluşan bir bilgi; bu bir hedef sızıntısı olabilir.", "Bu özellik çıkarıldıktan sonra model yeniden değerlendirilmeli.", "%99 doğruluk, temerrüdü önceden tahmin etmenin çözüldüğünü gösteriyor."],
          en: ["The model is extraordinarily successful; it can be put into use right away.", "The most important feature is information that arises after default; this may be target leakage.", "The model should be re-evaluated after this feature is removed.", "99% accuracy shows that predicting default in advance has been solved."]
        },
        bad: [0, 3],
        explain: {
          tr: ["<b>Sorunlu:</b> öngörü anında bu sütun boş olacak; model gerçek kullanımda çöker.", "Doğru: altın soru tam olarak bu.", "Doğru.", "<b>Sorunlu:</b> olağanüstü yüksek başarı önce sızıntı şüphesi uyandırmalı."],
          en: ["<b>Problematic:</b> at prediction time this column will be empty; the model will collapse in real use.", "Correct: exactly the golden question.", "Correct.", "<b>Problematic:</b> extraordinarily high performance should first raise suspicion of leakage."]
        }
      }
    ],
    quiz: [
      { q: { tr: "Ölçekleme için ortalama ve standart sapma hangi veriden hesaplanmalı?", en: "From which data should the mean and standard deviation for scaling be computed?" }, options: { tr: ["Tüm veriden", "Yalnızca eğitim verisinden", "Yalnızca test verisinden"], en: ["All the data", "The training data only", "The test data only"] }, answer: 1, explain: { tr: "Ve aynı değerler teste uygulanır.", en: "And the same values are applied to the test data." } },
      { q: { tr: "Sızıntıyı tespit etmek için hangi soru sorulur?", en: "Which question helps detect leakage?" }, options: { tr: ["Bu bilgi öngörü anında elimde olur muydu?", "Bu özellik hedefle korelasyonlu mu?", "Veri yeterince büyük mü?"], en: ["Would I have this information at prediction time?", "Is this feature correlated with the target?", "Are the data large enough?"] }, answer: 0, explain: { tr: "Yüksek korelasyon tek başına sızıntı değildir; bilginin zamanlaması önemlidir.", en: "High correlation alone is not leakage; the timing of the information matters." } },
      { q: { tr: "Olağanüstü yüksek bir test başarısı ilk olarak neyi düşündürmeli?", en: "What should extraordinarily high test performance suggest first?" }, options: { tr: ["Modelin mükemmel olduğunu", "Olası bir sızıntıyı", "Verinin az olduğunu"], en: ["That the model is perfect", "Possible leakage", "That there are few data"] }, answer: 1, explain: { tr: "Önce sızıntıyı ele, sonra sevin.", en: "Rule out leakage first, then celebrate." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 8 — Zaman serisinde doğrulama                                   */
  /* =================================================================== */
  const TS_TR = `import numpy as np
import pandas as pd
veri = pd.read_csv("fred/UNRATE.csv", names=["tarih", "oran"], header=0, parse_dates=["tarih"]).dropna()
seri = veri.loc[veri["tarih"] >= "2000-01-01", "oran"].to_numpy()
T = len(seri)
def en_yakin_ay(egitim, test):              # model: bir ayı, eğitimde zamanca en yakın ayla öngör
    egitim = np.array(sorted(egitim))
    return np.array([seri[egitim[np.argmin(np.abs(egitim - t))]] for t in test])
def kok_hko(egitim, test): return np.sqrt(np.mean((en_yakin_ay(egitim, test) - seri[test]) ** 2))
n_test = T // 5                              # son %20 test`;
  const TS_EN = `import numpy as np
import pandas as pd
data = pd.read_csv("fred/UNRATE.csv", names=["date", "rate"], header=0, parse_dates=["date"]).dropna()
series = data.loc[data["date"] >= "2000-01-01", "rate"].to_numpy()
T = len(series)
def nearest_month(train, test):              # model: predict a month with the closest month in training
    train = np.array(sorted(train))
    return np.array([series[train[np.argmin(np.abs(train - t))]] for t in test])
def rmse(train, test): return np.sqrt(np.mean((nearest_month(train, test) - series[test]) ** 2))
n_test = T // 5                              # last 20% as test`;
  U.push({
    id: "m2-u8",
    minutes: 25,
    packages: ["numpy", "pandas"],
    data: DATA,
    title: { tr: "Zaman serisinde doğrulama", en: "Validation with time series" },
    blurb: { tr: "Rastgele bölme geleceği gösterir. Geçmişle eğit, gelecekle sına. Gerçek veri: ABD işsizlik oranı.", en: "A random split shows the future. Train on the past, test on the future. Real data: the US unemployment rate." },
    terms: [{ tr: "zamana göre bölme", en: "time-based split" }, { tr: "rastgele bölme", en: "random split" }, { tr: "genişleyen pencere", en: "expanding window" }],
    concept: {
      tr: `<p>Ücret örneğinde gözlemler birbirinden bağımsızdı; veriyi karıştırıp rastgele bölmek doğruydu. Zaman serilerinde durum farklıdır: bu ayın değeri geçen ayınkine çok benzer. Veriyi rastgele bölersen, test aylarının hemen öncesi ve <b>hemen sonrası</b> eğitimde kalır. Model, öngördüğü ayın geleceğini görmüş olur.</p>
<p>Gerçek bir öngörüde elinde yalnızca geçmiş vardır. Değerlendirme de bunu taklit etmelidir: <b>geçmişle eğit, gelecekle sına</b>. Eğitim verisi belirli bir tarihten öncesi, test verisi sonrasıdır.</p>
<p>Zaman serisinde çapraz doğrulama da bu kurala uyar: katlar karıştırılmaz. Her turda eğitim penceresi bir adım uzar ve hemen sonraki dönem doğrulamada kullanılır (<b>genişleyen pencere</b>). Böylece her doğrulama, kendi geçmişinden öğrenmiş bir modelle yapılır.</p>
<div class="box econ">Bu ünitede dersin notebook'undaki deneyi yapay bir rassal yürüyüş yerine <b>gerçek ABD işsizlik verisiyle</b> tekrarlıyoruz. Model kasıtlı olarak çok basit: bir ayı, eğitimde zamanca ona en yakın ayın değeriyle öngörüyor.</div>`,
      en: `<p>In the wage example the observations were independent of one another; shuffling and splitting at random was right. Time series are different: this month's value is very similar to last month's. If you split at random, the months just before and <b>just after</b> each test month stay in training. The model has seen the future of the month it predicts.</p>
<p>In a real forecast you have only the past. Evaluation must mimic that: <b>train on the past, test on the future</b>. The training data are everything before a certain date, the test data everything after.</p>
<p>Cross-validation for time series follows the same rule: folds are not shuffled. In each round the training window grows by one step and the period right after it is used for validation (an <b>expanding window</b>). So every validation uses a model that learned only from its own past.</p>
<div class="box econ">In this unit we repeat the experiment from the course notebook with <b>real US unemployment data</b> instead of an artificial random walk. The model is deliberately very simple: it predicts a month with the value of the month closest to it in time in the training data.</div>`
    },
    playground: {
      type: "timeSplit",
      intro: { tr: "İki bölme yöntemini karşılaştır. Büyük pembe noktalar test ayları. Hangi bölme gerçek bir öngörüye benziyor?", en: "Compare the two ways of splitting. Large pink dots are test months. Which split resembles a real forecast?" },
      takeaway: { tr: "Zaman serisinde rastgele bölme hatayı olduğundan çok daha küçük gösterir. Geçmişle eğit, gelecekle sına.", en: "In time series a random split makes the error look much smaller than it is. Train on the past, test on the future." }
    },
    cells: [
      {
        id: "m2-u8-c1", kind: "run",
        task: { tr: "Aynı model, iki farklı bölme. Önce tahmin et.", en: "The same model, two different splits. Predict first." },
        predict: { q: { tr: "Hangi bölmede test hatası daha küçük çıkar?", en: "Which split gives the smaller test error?" }, options: { tr: ["Rastgele bölmede", "Zamana göre bölmede", "İkisi aynı"], en: ["The random split", "The time-based split", "Both the same"] }, answer: 0, explain: { tr: "Rastgele bölmede model test ayının hemen öncesini ve sonrasını bildiği için hata çok küçük (≈ 0,19); zamana göre bölmede ≈ 1,8. Gerçekçi olan ikincisi.", en: "With a random split the model knows the months just before and after each test month, so the error is tiny (≈ 0.19); with a time split it is ≈ 1.8. The second is the realistic one." } },
        code: {
          tr: TS_TR + `\nkarisik = np.random.default_rng(2026).permutation(T)\nprint("Rastgele bölme   :", round(kok_hko(karisik[n_test:], karisik[:n_test]), 2))\nprint("Zamana göre bölme:", round(kok_hko(np.arange(T - n_test), np.arange(T - n_test, T)), 2))`,
          en: TS_EN + `\nshuffled = np.random.default_rng(2026).permutation(T)\nprint("Random split    :", round(rmse(shuffled[n_test:], shuffled[:n_test]), 2))\nprint("Time-based split:", round(rmse(np.arange(T - n_test), np.arange(T - n_test, T)), 2))`
        },
        after: { tr: "Aynı model, aynı veri: hata yaklaşık on kat farklı. Fark modelden değil, değerlendirme yönteminden geliyor.", en: "Same model, same data: the error differs about tenfold. The difference comes not from the model but from the evaluation method." }
      },
      {
        id: "m2-u8-c2", kind: "audit",
        task: { tr: "YZ öngörü modelini değerlendirdi ve çok iyi bir sonuç buldu. Hatalı satırı bul ve düzelt: son %20 test olsun.", en: "The AI evaluated the forecasting model and found a very good result. Find the faulty line and fix it: the last 20% should be the test set." },
        ai: {
          prompt: { tr: "İşsizlik serisinde öngörü modelinin başarısını %80 eğitim, %20 test ayırarak ölç.", en: "Measure the forecasting model's performance on the unemployment series with an 80% training, 20% test split." },
          reply: { tr: "Veriyi karıştırıp ayıralım (makine öğrenmesinde standart yöntem):", en: "Let us shuffle and split (the standard method in machine learning):" },
          code: { tr: TS_TR + `\nkarisik = np.random.default_rng(2026).permutation(T)\negitim, test = karisik[n_test:], karisik[:n_test]\nhata = kok_hko(egitim, test)\nprint(f"Öngörü hatası (kök HKO): {hata:.2f} puan")`, en: TS_EN + `\nshuffled = np.random.default_rng(2026).permutation(T)\ntrain, test = shuffled[n_test:], shuffled[:n_test]\nerr = rmse(train, test)\nprint(f"Forecast error (RMSE): {err:.2f} points")` },
          claim: { tr: "Model işsizlik oranını yalnızca 0,19 puan hatayla öngörüyor; politika yapıcılar için güvenilir bir araç.", en: "The model forecasts the unemployment rate with an error of only 0.19 points; a reliable tool for policymakers." }
        },
        bugLines: [12],
        lineExplain: { tr: "“Karıştırıp ayırmak” bağımsız gözlemlerde standarttır, zaman serisinde değil. Test ayları serinin her yerine dağıldı; model her test ayının geleceğini görüyor. 0,19'luk hata bir öngörü hatası değil.", en: "“Shuffle and split” is standard for independent observations, not for time series. The test months are scattered throughout the series; the model sees the future of every test month. The 0.19 error is not a forecast error." },
        hints: [{ tr: "Eğitim: ilk <code>T - n_test</code> ay, test: son <code>n_test</code> ay. <code>np.arange(T - n_test)</code> ve <code>np.arange(T - n_test, T)</code>", en: "Training: the first <code>T - n_test</code> months, test: the last <code>n_test</code>. <code>np.arange(T - n_test)</code> and <code>np.arange(T - n_test, T)</code>" }],
        solution: { tr: TS_TR + `\nkarisik = np.random.default_rng(2026).permutation(T)\negitim, test = np.arange(T - n_test), np.arange(T - n_test, T)\nhata = kok_hko(egitim, test)\nprint(f"Öngörü hatası (kök HKO): {hata:.2f} puan")`, en: TS_EN + `\nshuffled = np.random.default_rng(2026).permutation(T)\ntrain, test = np.arange(T - n_test), np.arange(T - n_test, T)\nerr = rmse(train, test)\nprint(f"Forecast error (RMSE): {err:.2f} points")` },
        checks: [
          { py: { tr: "max(egitim) < min(test) and len(test) == n_test", en: "max(train) < min(test) and len(test) == n_test" }, msg: { tr: "Tüm test ayları, tüm eğitim aylarından sonra gelmeli.", en: "All test months should come after all training months." } },
          { py: { tr: "abs(hata - kok_hko(np.arange(T - n_test), np.arange(T - n_test, T))) < 1e-9", en: "abs(err - rmse(np.arange(T - n_test), np.arange(T - n_test, T))) < 1e-9" }, msg: { tr: "Hata, zamana göre bölmeyle hesaplanmalı.", en: "The error should be computed with the time-based split." } }
        ],
        after: { tr: "YZ'nin açıklaması (“makine öğrenmesinde standart yöntem”) bağlamı yok saydı. Gerçek öngörü hatası yaklaşık 1,8 puan; bu sonuçla politika önerisi yazmak çok farklı olurdu.", en: "The AI's explanation (“the standard method in machine learning”) ignored the context. The real forecast error is about 1.8 points; a policy recommendation based on that would read very differently." }
      },
      {
        id: "m2-u8-c3", kind: "interpret",
        task: { tr: "Zamana göre bölmede test dönemi 2021 ortasından bugüne uzanıyor. YZ sonucu yorumladı. Hangi cümleler sorunlu?", en: "In the time-based split the test period runs from mid-2021 to today. The AI interpreted the result. Which sentences are problematic?" },
        prompt: { tr: "Zamana göre bölmeyle test hatası 1,8 puan çıktı. Yorumlar mısın?", en: "With the time-based split the test error is 1.8 points. Can you interpret this?" },
        sentences: {
          tr: ["Bu hata, modelin gerçek bir öngörüde ne kadar yanılacağının daha dürüst bir ölçüsüdür.", "Eğitim dönemi 2020 pandemi sıçramasını içerdiği için en yakın ay kuralı test döneminin başında yüksek bir değer öngörüyor olabilir.", "Model kötü olduğu için zaman serileri makine öğrenmesiyle öngörülemez.", "Sonuç tek bir bölmeye dayanıyor; farklı bir kesim tarihiyle hata değişebilir."],
          en: ["This error is a more honest measure of how wrong the model would be in a real forecast.", "Since the training period contains the 2020 pandemic jump, the nearest-month rule may predict a high value at the start of the test period.", "Because the model is poor, time series cannot be forecast with machine learning.", "The result rests on a single split; the error may change with a different cut-off date."]
        },
        bad: [2],
        explain: {
          tr: ["Doğru.", "Doğru ve önemli: test dönemine en yakın eğitim ayları pandemi sonrası yüksek değerlerden geliyor; bu, hatanın nereden kaynaklandığını açıklar.", "<b>Aşırı genelleme:</b> bu model kasıtlı olarak çok basit. Bir modelin zayıflığından yöntemin tamamı hakkında sonuç çıkarılamaz.", "Doğru: genişleyen pencereli doğrulama bu yüzden kullanılır."],
          en: ["Correct.", "Correct and important: the training months closest to the test period come from high post-pandemic values; this explains where the error comes from.", "<b>Over-generalisation:</b> this model is deliberately very simple. You cannot draw conclusions about a whole approach from one model's weakness.", "Correct: that is why expanding-window validation is used."]
        }
      }
    ],
    quiz: [
      { q: { tr: "Zaman serisinde rastgele bölmenin sorunu nedir?", en: "What is the problem with a random split in time series?" }, options: { tr: ["Model test aylarının geleceğini görür", "Eğitim verisi küçülür", "Kod yavaşlar"], en: ["The model sees the future of the test months", "The training data shrink", "The code slows down"] }, answer: 0, explain: { tr: "Hata yanıltıcı biçimde küçük çıkar.", en: "The error comes out misleadingly small." } },
      { q: { tr: "Zaman serisinde doğru değerlendirme nasıl yapılır?", en: "How is a time series evaluated correctly?" }, options: { tr: ["Geçmişle eğitip gelecekle sınayarak", "Veriyi karıştırarak", "Yalnızca eğitim hatasına bakarak"], en: ["Training on the past and testing on the future", "Shuffling the data", "Looking only at training error"] }, answer: 0, explain: { tr: "Gerçek öngörüyü taklit eder.", en: "It mimics a real forecast." } },
      { q: { tr: "Genişleyen pencereli doğrulamada her turda ne olur?", en: "What happens in each round of expanding-window validation?" }, options: { tr: ["Eğitim penceresi uzar, hemen sonraki dönem doğrulanır", "Katlar karıştırılır", "Test verisi küçülür"], en: ["The training window grows and the period right after is validated", "The folds are shuffled", "The test data shrink"] }, answer: 0, explain: { tr: "Her doğrulama kendi geçmişinden öğrenmiş bir modelle yapılır.", en: "Each validation uses a model that learned only from its own past." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 9 — Colab + Gemini atölyesi                                      */
  /* =================================================================== */
  const NB = { tr: "modul2/09_ongoru_degerlendirme_atolyesi_tr.ipynb", en: "module2/09_forecast_evaluation_workshop_en.ipynb" };
  U.push({
    id: "m2-u9",
    minutes: 45,
    title: { tr: "Colab + Gemini atölyesi: bir öngörüyü dürüstçe değerlendirmek", en: "Colab + Gemini workshop: evaluating a forecast honestly" },
    blurb: { tr: "FRED işsizlik serisinde zamana göre bölme, saf öngörü ve basit bir regresyon. Kodu Gemini yazar, sen denetlersin.", en: "A time-based split, a naive forecast and a simple regression on the FRED unemployment series. Gemini writes the code, you audit it." },
    terms: [{ tr: "saf öngörü", en: "naive forecast" }, { tr: "gecikmeli değişken", en: "lagged variable" }, { tr: "kıyas ölçütü", en: "benchmark" }],
    concept: {
      tr: `<p>Bu atölyede modülün değerlendirme kurallarını gerçek veriyle uygulayacaksın. Veri: ABD işsizlik oranı (FRED: <b>UNRATE</b>, aylık, 1948'den bu yana).</p>
<p><b>Görevler</b></p>
<ol>
<li><b>Görev A — Bölme ve kıyas ölçütü:</b> Veriyi zamana göre böl: 2015 öncesi eğitim, 2015 ve sonrası test. Test döneminde saf öngörünün (bu ay = geçen ay) kök HKO'sunu hesapla. Bu, her modelin yenmesi gereken <b>kıyas ölçütüdür</b>.</li>
<li><b>Görev B — Basit bir regresyon:</b> Bu ayın oranını geçen ayın oranıyla açıklayan doğrusal bir regresyon kur: oran<sub>t</sub> = a + b · oran<sub>t−1</sub>. Katsayıları <b>yalnızca eğitim verisiyle</b> kestir, test döneminde kök HKO'sunu hesapla ve saf öngörüyle karşılaştır.</li>
</ol>
<div class="box"><b>Gemini'nin sık yaptığı hatalar:</b> veriyi karıştırarak bölmek; regresyonu tüm veriyle kurmak (test döneminin bilgisi katsayılara sızar); eksik ayı (2025 Ekim) fark etmeden işlemek. Kontrol hücreleri bunların hepsini yakalar.</div>
<p>Sonuç seni şaşırtabilir: basit regresyon saf öngörüyü ancak çok az farkla geçiyor. İşsizlik gibi yavaş değişen bir seride “geçen ay ne idiyse o” kuralını yenmek zordur. Bir modeli değerlendirirken onu her zaman böyle basit bir kıyas ölçütüyle karşılaştır.</p>`,
      en: `<p>In this workshop you apply the module's evaluation rules to real data. The data: the US unemployment rate (FRED: <b>UNRATE</b>, monthly, since 1948).</p>
<p><b>Tasks</b></p>
<ol>
<li><b>Task A — Split and benchmark:</b> split the data by time: before 2015 for training, 2015 onwards for test. Compute the RMSE of the naive forecast (this month = last month) over the test period. This is the <b>benchmark</b> every model must beat.</li>
<li><b>Task B — A simple regression:</b> build a linear regression explaining this month's rate with last month's: rate<sub>t</sub> = a + b · rate<sub>t−1</sub>. Estimate the coefficients <b>using the training data only</b>, compute the RMSE over the test period and compare it with the naive forecast.</li>
</ol>
<div class="box"><b>Mistakes Gemini often makes:</b> splitting by shuffling; fitting the regression on all the data (information from the test period leaks into the coefficients); processing the missing month (October 2025) without noticing. The check cells catch all of these.</div>
<p>The result may surprise you: the simple regression beats the naive forecast only by a hair. For a slow-moving series like unemployment, the rule “whatever it was last month” is hard to beat. Always compare a model with a simple benchmark like this.</p>`
    },
    playground: null,
    cells: [
      {
        id: "m2-u9-c1", kind: "prompt",
        task: { tr: "Görev B için Gemini'ye vereceğin isteği burada hazırla. Notebook'ta <code>egitim</code> ve <code>test</code> tabloları var (sütunlar: <code>tarih</code>, <code>oran</code>).", en: "Prepare the prompt for Task B here. The notebook has <code>train</code> and <code>test</code> tables (columns: <code>date</code>, <code>rate</code>)." },
        weak: {
          prompt: { tr: "İşsizlik için bir regresyon modeli kur ve başarısını ölç.", en: "Build a regression model for unemployment and measure its performance." },
          reply: { tr: "Tüm veriyle bir model kurup değerlendirelim:", en: "Let us build and evaluate a model on all the data:" },
          code: { tr: "veri = pd.concat([egitim, test])\nveri[\"onceki\"] = veri[\"oran\"].shift(1)\nb, a = np.polyfit(veri.dropna()[\"onceki\"], veri.dropna()[\"oran\"], 1)", en: "data = pd.concat([train, test])\ndata[\"prev\"] = data[\"rate\"].shift(1)\nb, a = np.polyfit(data.dropna()[\"prev\"], data.dropna()[\"rate\"], 1)" },
          claim: { tr: "Model hazır, R² çok yüksek.", en: "The model is ready; R² is very high." }
        },
        checklist: [
          { label: { tr: "Tablolar ve sütunlar", en: "Tables and columns" }, why: { tr: "egitim, test, tarih, oran adlarını yaz.", en: "Write the names train, test, date, rate." }, re: { tr: "egitim|test|oran|tarih", en: "train|test|rate|date" } },
          { label: { tr: "Model", en: "Model" }, why: { tr: "Bu ayın oranını geçen ayın oranıyla açıklayan doğrusal regresyon.", en: "A linear regression of this month's rate on last month's." }, re: { tr: "geçen ay|önceki|gecikme|shift|t-1|t−1", en: "last month|previous|lag|shift|t-1|t−1" } },
          { label: { tr: "Yalnızca eğitimle kestirim", en: "Estimate on training only" }, why: { tr: "Katsayıları yalnızca eğitim verisiyle kestirmesini iste.", en: "Ask it to estimate the coefficients using training data only." }, re: { tr: "yalnızca eğitim|sadece eğitim|eğitim verisiyle|eğitim verisinden", en: "training data only|only the training|only on train|train only" } },
          { label: { tr: "Değerlendirme", en: "Evaluation" }, why: { tr: "Test döneminde kök HKO ve saf öngörüyle karşılaştırma.", en: "RMSE over the test period and a comparison with the naive forecast." }, re: { tr: "kök hko|rmse|saf öngörü|karşılaştır", en: "rmse|naive|compare" } }
        ],
        minLen: 90,
        strong: { prompt: { tr: "egitim (2015 öncesi) ve test (2015 ve sonrası) adlı iki pandas tablosu var; sütunlar 'tarih' (aylık, sıralı) ve 'oran' (işsizlik, %). Bu ayın oranını geçen ayın oranıyla açıklayan doğrusal bir regresyon kur (oran_t = a + b · oran_t-1). Katsayıları yalnızca eğitim verisiyle kestir; a ve b'yi değişkenlere ata. Test döneminde modelin kök HKO'sunu hesaplayıp kok_hko_model'e ata ve saf öngörünün kök HKO'suyla karşılaştır. Eksik ayları sessizce doldurma; kaç satır kullandığını yazdır.", en: "There are two pandas tables, train (before 2015) and test (2015 onwards); the columns are 'date' (monthly, sorted) and 'rate' (unemployment, %). Build a linear regression explaining this month's rate with last month's (rate_t = a + b · rate_t-1). Estimate the coefficients using the training data only; store them in a and b. Compute the model's RMSE over the test period, store it in rmse_model, and compare it with the naive forecast's RMSE. Do not silently fill missing months; print how many rows you used." } }
      },
      {
        id: "m2-u9-c2", kind: "colab",
        task: { tr: "<b>Görev A — Bölme ve kıyas ölçütü.</b> Notebook'u aç, Gemini ile <code>egitim</code>, <code>test</code> ve <code>kok_hko_saf</code> değişkenlerini oluştur, kontrol hücresini çalıştır ve verdiği kodu buraya yapıştır.", en: "<b>Task A — Split and benchmark.</b> Open the notebook, create <code>train</code>, <code>test</code> and <code>rmse_naive</code> with Gemini, run the check cell and paste the code it gives you here." },
        notebook: NB,
        steps: {
          tr: ["Notebook'u aç ve <b>Kurulum</b> hücresini çalıştır (UNRATE FRED'den indirilir).", "<b>Görev A</b> hücresinde Gemini'den zamana göre bölmeyi ve saf öngörünün test kök HKO'sunu iste.", "Kodu denetle: karıştırma var mı? Kesim tarihi 2015-01-01 mi? Eksik ay nasıl ele alınmış?", "<b>Kontrol A</b> hücresini çalıştır; geçerse <code>ML2-…</code> kodunu yapıştır."],
          en: ["Open the notebook and run the <b>Setup</b> cell (UNRATE is downloaded from FRED).", "In the <b>Task A</b> cell, ask Gemini for the time-based split and the naive forecast's test RMSE.", "Audit the code: is there any shuffling? Is the cut-off 2015-01-01? How is the missing month handled?", "Run the <b>Check A</b> cell; if it passes, paste the <code>ML2-…</code> code."]
        },
        codeHashes: ["3f52536d"]
      },
      {
        id: "m2-u9-c3", kind: "colab",
        task: { tr: "<b>Görev B — Basit bir regresyon.</b> Hazırladığın istekle <code>a</code>, <code>b</code> ve <code>kok_hko_model</code> değişkenlerini üret, kontrol hücresini çalıştır ve kodu buraya yapıştır.", en: "<b>Task B — A simple regression.</b> With the prompt you prepared, produce <code>a</code>, <code>b</code> and <code>rmse_model</code>, run the check cell and paste the code here." },
        notebook: NB,
        steps: {
          tr: ["<b>Görev B</b> hücresinde Gemini'ye isteğini ver.", "Kodu denetle: katsayılar yalnızca <code>egitim</code> ile mi kestirildi? <code>pd.concat</code> ya da tüm veriyle <code>polyfit</code> var mı?", "Sonucu yorumla: model saf öngörüyü ne kadar geçiyor?", "<b>Kontrol B</b> hücresini çalıştır ve kodu buraya yapıştır."],
          en: ["In the <b>Task B</b> cell, give Gemini your prompt.", "Audit the code: were the coefficients estimated with <code>train</code> only? Is there a <code>pd.concat</code> or a <code>polyfit</code> on all the data?", "Interpret the result: by how much does the model beat the naive forecast?", "Run the <b>Check B</b> cell and paste the code here."]
        },
        codeHashes: ["67afdf04"],
        after: { tr: "Model saf öngörüyü ancak çok küçük bir farkla geçiyor. Bu bir başarısızlık değil, önemli bir bulgu: karmaşık bir modelin değerini, basit bir kıyas ölçütünü ne kadar geçtiğine bakarak ölçeriz.", en: "The model beats the naive forecast only by a tiny margin. That is not a failure but an important finding: we measure a complex model's value by how much it beats a simple benchmark." }
      },
      {
        id: "m2-u9-c4", kind: "auditlog",
        task: { tr: "Atölyeyi bir denetim notuyla kapat.", en: "Close the workshop with an audit note." },
        fields: {
          tr: [
            { label: "Gemini veriyi nasıl böldü? Değiştirmen gerekti mi?", help: "Karıştırma, kesim tarihi", ph: "Örnek: Gemini önce train_test_split kullandı…" },
            { label: "Regresyon katsayıları hangi veriyle kestirildi?", help: "Yalnızca eğitim mi, tüm veri mi?", ph: "Örnek: kod önce iki tabloyu birleştiriyordu…" },
            { label: "Sonucu nasıl yorumluyorsun?", help: "Model saf öngörüyü geçiyor mu, ne kadar?", ph: "Örnek: model kök HKO'yu yalnızca 0,004 puan düşürdü…" }
          ],
          en: [
            { label: "How did Gemini split the data? Did you need to change it?", help: "Shuffling, cut-off date", ph: "Example: Gemini first used train_test_split…" },
            { label: "Which data were the regression coefficients estimated on?", help: "Training only, or all the data?", ph: "Example: the code first merged the two tables…" },
            { label: "How do you interpret the result?", help: "Does the model beat the naive forecast, and by how much?", ph: "Example: the model lowered the RMSE by only 0.004 points…" }
          ]
        }
      }
    ],
    quiz: [
      { q: { tr: "Kıyas ölçütü (saf öngörü) neden önemlidir?", en: "Why does the benchmark (naive forecast) matter?" }, options: { tr: ["Bir modelin değerini, basit bir kuralı ne kadar geçtiğine bakarak ölçeriz", "Her zaman en iyi model odur", "Gemini onu ister"], en: ["We measure a model's value by how much it beats a simple rule", "It is always the best model", "Gemini asks for it"] }, answer: 0, explain: { tr: "Basit kuralı geçemeyen model değer katmaz.", en: "A model that cannot beat the simple rule adds no value." } },
      { q: { tr: "Regresyonu tüm veriyle kurmanın sorunu nedir?", en: "What is wrong with fitting the regression on all the data?" }, options: { tr: ["Test döneminin bilgisi katsayılara sızar", "Kod hata verir", "Katsayılar negatif çıkar"], en: ["Information from the test period leaks into the coefficients", "The code throws an error", "The coefficients come out negative"] }, answer: 0, explain: { tr: "Bu, Ünite 7'deki sızıntının bir türü.", en: "This is a kind of leakage from Unit 7." } },
      { q: { tr: "2025 Ekim'in verisi neden eksik?", en: "Why is the October 2025 figure missing?" }, options: { tr: ["ABD federal hükümetinin kapanması sırasında anket derlenemedi", "FRED'in hatası", "O ay işsizlik sıfırdı"], en: ["The survey could not be collected during the US federal government shutdown", "A FRED error", "Unemployment was zero that month"] }, answer: 0, explain: { tr: "Gerçek bir veri boşluğu; doldurmak yerine nedenini bilmek gerekir.", en: "A real data gap; know its cause rather than filling it." } }
    ]
  });
})();
