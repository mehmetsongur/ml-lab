/* Modül 2 — Model başarısı · Üniteler 1–5
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 * "Örnek YZ yanıtları" öğretim amacıyla hazırlanmıştır.
 */
(function () {
  "use strict";
  const D = window.M2_DATA;
  const W = D.WAGE, UR = D.UNRATE;
  const U = window.M2_UNITS;
  const DATA = ["fred/UNRATE.csv"];

  /* =================================================================== */
  /* Ünite 1 — Hatayı ölçmek                                              */
  /* =================================================================== */
  U.push({
    id: "m2-u1",
    minutes: 30,
    packages: ["numpy", "pandas"],
    data: DATA,
    title: { tr: "Hatayı ölçmek", en: "Measuring error" },
    blurb: { tr: "Bir öngörü ne kadar iyi? Ortalama hata, ortalama mutlak hata, HKO ve kök HKO. Gerçek veri: ABD işsizlik oranı.", en: "How good is a forecast? Mean error, mean absolute error, MSE and RMSE. Real data: the US unemployment rate." },
    terms: [{ tr: "hata (artık)", en: "error (residual)" }, { tr: "ortalama mutlak hata", en: "mean absolute error" }, { tr: "hata kareleri ortalaması (HKO)", en: "mean squared error (MSE)" }, { tr: "kök HKO", en: "root mean squared error (RMSE)" }],
    concept: {
      tr: `<p>Bir modelin iyi olup olmadığını söylemek için önce <b>hatayı</b> ölçmek gerekir. Her gözlem için hata, gerçek değer ile öngörü arasındaki farktır: <b>hata = gerçek − öngörü</b>. Ama yüzlerce hatayı tek bir sayıda özetlemenin birden çok yolu var:</p>
<ul>
<li><b>Ortalama hata:</b> hataların düz ortalaması. Artı ve eksi hatalar birbirini götürür; sıfıra yakın çıkması modelin <i>iyi</i> olduğunu değil, sistematik olarak bir yöne kaymadığını gösterir.</li>
<li><b>Ortalama mutlak hata:</b> hataların mutlak değerlerinin ortalaması. “Model tipik olarak kaç birim yanılıyor?” sorusunun yanıtı.</li>
<li><b>Hata kareleri ortalaması (HKO):</b> hataların karelerinin ortalaması. Kare alma, büyük hataları çok daha ağır cezalandırır. Birimi verinin biriminin karesidir (puan²).</li>
<li><b>Kök HKO:</b> HKO'nun karekökü. Verinin birimine geri döner (puan); büyük hatalara duyarlılığını korur.</li>
</ul>
<div class="box econ"><b>Bu ünitede gerçek veriyle çalışıyoruz:</b> ABD işsizlik oranı (FRED: UNRATE, aylık, 2000'den bu yana). Model en basit öngörü: <b>“bu ay, geçen ay ne idiyse o olur”</b> (saf öngörü). Basit görünür ama işsizlik gibi yavaş değişen serilerde yenmesi şaşırtıcı derecede zor bir ölçüttür.</div>`,
      en: `<p>To say whether a model is good, you first need to measure its <b>error</b>. For each observation the error is the gap between the actual value and the forecast: <b>error = actual − forecast</b>. But there is more than one way to summarise hundreds of errors in a single number:</p>
<ul>
<li><b>Mean error:</b> the plain average of the errors. Positive and negative errors cancel; a value near zero shows not that the model is <i>good</i>, only that it does not lean systematically in one direction.</li>
<li><b>Mean absolute error:</b> the average of the absolute errors. The answer to “by how much does the model typically miss?”</li>
<li><b>Mean squared error (MSE):</b> the average of the squared errors. Squaring punishes large errors much more heavily. Its unit is the square of the data's unit (points²).</li>
<li><b>Root mean squared error (RMSE):</b> the square root of the MSE. Back in the data's unit (points), while keeping its sensitivity to large errors.</li>
</ul>
<div class="box econ"><b>In this unit we work with real data:</b> the US unemployment rate (FRED: UNRATE, monthly, since 2000). The model is the simplest forecast of all: <b>“this month will be whatever last month was”</b> (the naive forecast). It looks trivial, but for slow-moving series like unemployment it is a surprisingly hard benchmark to beat.</div>`
    },
    playground: {
      type: "errorMetrics",
      intro: { tr: "Altı aylık küçük bir örnek. 6. ayın hatasını kaydırıcıyla büyüt ve dört ölçünün nasıl tepki verdiğine bak.", en: "A small six-month example. Enlarge the error in month 6 with the slider and see how the four measures react." },
      takeaway: { tr: "Ortalama hata doğruluk ölçüsü değildir. Kök HKO büyük hataları, ortalama mutlak hata tipik hatayı öne çıkarır.", en: "The mean error is not a measure of accuracy. RMSE highlights large errors; the mean absolute error highlights the typical error." }
    },
    cells: [
      {
        id: "m2-u1-c1", kind: "run",
        task: { tr: "Saf öngörünün hatalarını hesaplayıp ortalamasını alıyoruz. Önce tahmin et.", en: "We compute the naive forecast's errors and take their average. Predict first." },
        predict: { q: { tr: "Hataların düz ortalaması kaç çıkar?", en: "What does the plain average of the errors come to?" }, options: { tr: ["Sıfıra çok yakın (≈ 0,000)", "Yaklaşık 0,6", "Yaklaşık 2"], en: ["Very close to zero (≈ 0.000)", "About 0.6", "About 2"] }, answer: 0, explain: { tr: "Ay ay farkların ortalaması, dönemin başı ile sonu arasındaki farkın ay sayısına bölünmesine eşittir. 2000'de ve bugün işsizlik %4 civarında olduğu için artılar ve eksiler neredeyse tam olarak birbirini götürüyor.", en: "The average of month-to-month changes equals the gap between the start and the end of the period divided by the number of months. Unemployment was around 4% in 2000 and is around 4% today, so the pluses and minuses cancel almost exactly." } },
        code: { tr: UR.tr + `\nprint("Gözlem:", hata.notna().sum())\nprint("Ortalama hata:", round(hata.mean(), 3))`, en: UR.en + `\nprint("Observations:", error.notna().sum())\nprint("Mean error:", round(error.mean(), 3))` }
      },
      {
        id: "m2-u1-c2", kind: "audit",
        task: { tr: "YZ'den saf öngörünün başarısını ölçmesini istedik. Sonuç “kusursuz”. Hatalı satırı bul ve düzelt: <code>kok_hko</code> ve <code>omh</code> (ortalama mutlak hata) değişkenlerini hesapla.", en: "We asked the AI to measure the naive forecast's accuracy. The verdict: “flawless”. Find the faulty line and fix it: compute <code>rmse</code> and <code>mae</code> (mean absolute error)." },
        ai: {
          prompt: { tr: "issizlik tablosunda 'oran' gerçek değer, 'ongoru' saf öngörü. Öngörünün başarısını ölçer misin?", en: "In the unemp table 'rate' is the actual value and 'forecast' the naive forecast. Can you measure the forecast's accuracy?" },
          reply: { tr: "Hataların ortalamasına bakalım:", en: "Let us look at the average error:" },
          code: { tr: UR.tr + `\nbasari = hata.mean()\nprint(f"Ortalama hata: {basari:.3f} puan")`, en: UR.en + `\naccuracy = error.mean()\nprint(f"Average error: {accuracy:.3f} points")` },
          claim: { tr: "Ortalama hata 0,000 puan: saf öngörü neredeyse kusursuz çalışıyor.", en: "The average error is 0.000 points: the naive forecast is practically flawless." }
        },
        bugLines: [7],
        lineExplain: { tr: "Hataların düz ortalaması doğruluk ölçmez: artı ve eksi hatalar birbirini götürür. 2020 Nisan'ında 10 puanlık bir hata bile, sonraki aylardaki düşüşlerle “silinir”. Doğruluk için hataların büyüklüğüne (mutlak değer ya da kare) bakmak gerekir.", en: "The plain average of errors does not measure accuracy: positive and negative errors cancel. Even a 10-point error in April 2020 is “erased” by the falls in later months. Accuracy requires looking at the size of the errors (absolute value or square)." },
        hints: [{ tr: "Kök HKO: <code>np.sqrt((hata ** 2).mean())</code>. Ortalama mutlak hata: <code>hata.abs().mean()</code>. Pandas eksik değerleri (ilk ay ve 2025 Ekim) kendiliğinden atlar.", en: "RMSE: <code>np.sqrt((error ** 2).mean())</code>. Mean absolute error: <code>error.abs().mean()</code>. Pandas skips missing values (the first month and October 2025) automatically." }],
        solution: { tr: UR.tr + `\nkok_hko = np.sqrt((hata ** 2).mean())\nomh = hata.abs().mean()\nprint(f"Kök HKO: {kok_hko:.3f} puan | Ortalama mutlak hata: {omh:.3f} puan")`, en: UR.en + `\nrmse = np.sqrt((error ** 2).mean())\nmae = error.abs().mean()\nprint(f"RMSE: {rmse:.3f} points | Mean absolute error: {mae:.3f} points")` },
        checks: [
          { py: { tr: "abs(kok_hko - np.sqrt(np.nanmean(hata.to_numpy() ** 2))) < 1e-9", en: "abs(rmse - np.sqrt(np.nanmean(error.to_numpy() ** 2))) < 1e-9" }, msg: { tr: "<code>kok_hko</code>, hataların karelerinin ortalamasının karekökü olmalı.", en: "<code>rmse</code> should be the square root of the mean of the squared errors." } },
          { py: { tr: "abs(omh - np.nanmean(np.abs(hata.to_numpy()))) < 1e-9", en: "abs(mae - np.nanmean(np.abs(error.to_numpy()))) < 1e-9" }, msg: { tr: "<code>omh</code>, hataların mutlak değerlerinin ortalaması olmalı.", en: "<code>mae</code> should be the mean of the absolute errors." } }
        ],
        after: { tr: "Kök HKO yaklaşık 0,64, ortalama mutlak hata 0,17 puan. Model kusursuz değil. İki ölçü arasındaki büyük fark da bir şey anlatıyor: birkaç çok büyük hata var. Bir sonraki alıştırmada onları bulacaksın.", en: "RMSE is about 0.64 and the mean absolute error 0.17 points. The model is not flawless. The big gap between the two measures also tells a story: there are a few very large errors. You will find them in the next exercise." }
      },
      {
        id: "m2-u1-c3", kind: "run",
        task: { tr: "Kök HKO'yu yukarı çeken hatayı bul. Önce tahmin et.", en: "Find the error that drives the RMSE up. Predict first." },
        predict: { q: { tr: "Saf öngörünün en büyük hatası hangi ayda?", en: "In which month is the naive forecast's largest error?" }, options: { tr: ["2008 Ekim (küresel finans krizi)", "2020 Nisan (pandemi)", "2025 Ekim"], en: ["October 2008 (global financial crisis)", "April 2020 (pandemic)", "October 2025"] }, answer: 1, explain: { tr: "Pandemi şokuyla işsizlik bir ayda %4,4'ten %14,8'e fırladı: 10,4 puanlık bir hata. 2008 krizi yavaş ilerledi, aylık değişimler küçüktü. 2025 Ekim'in verisi ise hiç yok.", en: "With the pandemic shock unemployment jumped from 4.4% to 14.8% in one month: a 10.4-point error. The 2008 crisis unfolded slowly, with small monthly changes. October 2025 has no data at all." } },
        code: { tr: UR.tr + `\nen_buyuk = hata.abs().idxmax()\nprint(issizlik.loc[en_buyuk, "tarih"].date(), "hata:", round(hata[en_buyuk], 1), "puan")\nprint("Eksik aylar:", issizlik.loc[issizlik["oran"].isna(), "tarih"].dt.date.tolist())`, en: UR.en + `\nlargest = error.abs().idxmax()\nprint(unemp.loc[largest, "date"].date(), "error:", round(error[largest], 1), "points")\nprint("Missing months:", unemp.loc[unemp["rate"].isna(), "date"].dt.date.tolist())` },
        after: { tr: "İkinci satırdaki eksik ay gerçek bir veri boşluğu: ABD federal hükümetinin 2025 sonbaharındaki kapanması sırasında bu ayın hane halkı anketi derlenemedi. Modül 1'deki ders burada da geçerli: eksik değeri doldurmak yerine nedenini bilmek gerekir.", en: "The missing month on the second line is a real data gap: during the US federal government shutdown in autumn 2025 the household survey for that month could not be collected. The Module 1 lesson applies here too: know the reason for a gap rather than filling it." }
      },
      {
        id: "m2-u1-c4", kind: "interpret",
        task: { tr: "YZ bu sonuçları yorumladı. Hangi cümleler ölçüleri yanlış yorumluyor?", en: "The AI interpreted these results. Which sentences misread the measures?" },
        prompt: { tr: "Saf öngörünün kök HKO'su 0,64, ortalama mutlak hatası 0,17 puan. Yorumlar mısın?", en: "The naive forecast's RMSE is 0.64 and its mean absolute error 0.17 points. Can you interpret this?" },
        sentences: {
          tr: ["Saf öngörü tipik bir ayda işsizlik oranını yaklaşık 0,17 puan ıskalıyor.", "Kök HKO 0,64 olduğuna göre model her ay ortalama 0,64 puan yanılıyor.", "Kök HKO'nun ortalama mutlak hatadan çok büyük olması, birkaç çok büyük hatanın varlığına işaret eder.", "Ortalama hata sıfıra yakın olduğu için model en iyi olası modeldir."],
          en: ["In a typical month the naive forecast misses the unemployment rate by about 0.17 points.", "Since the RMSE is 0.64, the model misses by 0.64 points on average every month.", "An RMSE much larger than the mean absolute error points to a few very large errors.", "Since the mean error is near zero, the model is the best possible model."]
        },
        bad: [1, 3],
        explain: {
          tr: ["Doğru: ortalama mutlak hatanın yorumu tam olarak bu.", "<b>Yanlış:</b> “ortalama olarak kaç puan” sorusunun yanıtı ortalama mutlak hatadır (0,17). Kök HKO büyük hatalara ağırlık verdiği için daha büyüktür.", "Doğru: 2020 Nisan gibi tek bir büyük hata kök HKO'yu yukarı çeker.", "<b>Yanlış:</b> ortalama hata yalnızca sistematik sapma olmadığını gösterir; doğruluk hakkında bir şey söylemez."],
          en: ["Correct: that is exactly how to read the mean absolute error.", "<b>Wrong:</b> the answer to “by how many points on average” is the mean absolute error (0.17). RMSE is larger because it weights large errors.", "Correct: a single large error such as April 2020 pulls the RMSE up.", "<b>Wrong:</b> the mean error only shows there is no systematic bias; it says nothing about accuracy."]
        }
      }
    ],
    quiz: [
      { q: { tr: "Ortalama hatanın sıfıra yakın olması neyi gösterir?", en: "What does a mean error near zero show?" }, options: { tr: ["Modelin çok doğru olduğunu", "Modelin sistematik olarak bir yöne kaymadığını", "Hiç hata olmadığını"], en: ["That the model is very accurate", "That the model does not lean systematically one way", "That there are no errors"] }, answer: 1, explain: { tr: "Artı ve eksi hatalar birbirini götürebilir.", en: "Positive and negative errors can cancel." } },
      { q: { tr: "Hangi ölçü büyük hatalara en duyarlıdır?", en: "Which measure is most sensitive to large errors?" }, options: { tr: ["Ortalama mutlak hata", "Kök HKO", "Ortalama hata"], en: ["Mean absolute error", "RMSE", "Mean error"] }, answer: 1, explain: { tr: "Kare alma büyük hataları büyütür.", en: "Squaring magnifies large errors." } },
      { q: { tr: "Kök HKO'nun birimi nedir (işsizlik oranı için)?", en: "What is the unit of RMSE (for the unemployment rate)?" }, options: { tr: ["Puan", "Puan²", "Birimsiz"], en: ["Points", "Points²", "Unitless"] }, answer: 0, explain: { tr: "Karekök, HKO'nun kare birimini verinin birimine geri getirir.", en: "The square root brings the MSE's squared unit back to the data's unit." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 2 — Eğitim ve test verisi                                      */
  /* =================================================================== */
  U.push({
    id: "m2-u2",
    minutes: 25,
    packages: ["numpy"],
    title: { tr: "Eğitim ve test verisi", en: "Training and test data" },
    blurb: { tr: "Bir modeli, onu kurduğun veriyle değerlendirmek neden yanıltır? Ücret–deneyim örneği.", en: "Why does judging a model on the data used to build it mislead? The wage–experience example." },
    terms: [{ tr: "eğitim verisi", en: "training data" }, { tr: "test verisi", en: "test data" }, { tr: "genelleme", en: "generalisation" }, { tr: "polinom regresyon", en: "polynomial regression" }],
    concept: {
      tr: `<p>Bir öğrenci sınava yalnızca geçen yılın sorularını ezberleyerek hazırlanırsa, aynı sorular gelirse tam puan alır, yeni sorular gelirse çuvallar. Modeller de böyledir. Bir modeli kurmak için kullandığın veriye <b>eğitim verisi</b> denir. Modelin bu verideki başarısı, <b>yeni</b> gözlemlerdeki başarısını söylemez.</p>
<p>Bu yüzden veri ikiye ayrılır: model <b>eğitim verisiyle</b> kurulur, başarısı modelin hiç görmediği <b>test verisiyle</b> ölçülür. Modelin yeni veride de iyi çalışmasına <b>genelleme</b> denir; makine öğrenmesinde asıl amaç budur.</p>
<p>Bu ve sonraki üç ünitede dersin 3. haftasındaki örneği kullanıyoruz: <b>log ücret ile deneyim</b> arasındaki ilişki (Mincer tipi bir ücret denklemi; ücret önce artar, sonra düzleşir). Gerçek ilişkiyi biz belirliyoruz, her bireye rastgele bir sapma ekliyoruz. Bu dünyadan 30 kişilik bir eğitim örneklemi ve 2.000 kişilik bir test örneklemi çekiyoruz. Tek aracımız <b>polinom regresyon</b>: log ücreti deneyimin 1., 2., …, d. dereceden kuvvetleriyle açıklamak.</p>
<div class="box">Neden burada gerçek veri değil simülasyon? Çünkü gerçek ilişkiyi bildiğimiz bir dünyada, bir modelin ne kadar yanıldığını tam olarak ölçebiliriz. Gerçek veride gerçek ilişkiyi hiçbir zaman bilmeyiz.</div>`,
      en: `<p>If a student prepares for an exam only by memorising last year's questions, they get full marks if the same questions come up and fail if new ones do. Models are the same. The data used to build a model is called <b>training data</b>. A model's success on these data says nothing about its success on <b>new</b> observations.</p>
<p>That is why the data are split in two: the model is built on the <b>training data</b> and its performance is measured on <b>test data</b> it has never seen. A model that also works well on new data <b>generalises</b>; that is the real goal of machine learning.</p>
<p>In this and the next three units we use the example from week 3 of the course: the relationship between <b>log wage and experience</b> (a Mincer-type wage equation; wages first rise, then level off). We set the true relationship and add a random deviation for each person. From this world we draw a training sample of 30 people and a test sample of 2,000. Our only tool is <b>polynomial regression</b>: explaining log wage with powers 1, 2, …, d of experience.</p>
<div class="box">Why a simulation rather than real data here? Because in a world where we know the true relationship we can measure exactly how wrong a model is. With real data we never know the true relationship.</div>`
    },
    playground: null,
    cells: [
      {
        id: "m2-u2-c1", kind: "run",
        task: { tr: "Aynı 30 kişiyle üç model kuruyoruz: derece 1, 2 ve 12. Önce tahmin et.", en: "We build three models on the same 30 people: degrees 1, 2 and 12. Predict first." },
        predict: { q: { tr: "Derece 12 modelin test hatası, eğitim hatasına göre nasıl çıkar?", en: "How does the degree-12 model's test error compare with its training error?" }, options: { tr: ["Çok daha büyük", "Yaklaşık aynı", "Daha küçük"], en: ["Much larger", "About the same", "Smaller"] }, answer: 0, explain: { tr: "Derece 12'nin eğitim hatası en düşük (0,032), test hatası felaket (18,2): model 30 kişinin gürültüsünü ezberlemiş.", en: "Degree 12 has the lowest training error (0.032) and a disastrous test error (18.2): the model memorised the noise of 30 people." } },
        code: { tr: W.tr + `\nfor d in [1, 2, 12]:\n    k = kur(e_egt, y_egt, d)\n    print(f"derece {d:2d}  eğitim HKO {hko(ongor(k, e_egt), y_egt):.3f}  test HKO {hko(ongor(k, e_tst), y_tst):.3f}")`, en: W.en + `\nfor d in [1, 2, 12]:\n    k = fit(e_tr, y_tr, d)\n    print(f"degree {d:2d}  training MSE {mse(predict(k, e_tr), y_tr):.3f}  test MSE {mse(predict(k, e_te), y_te):.3f}")` },
        after: { tr: "Eğitim hatasına bakan biri derece 12'yi seçerdi. Test hatası ise derece 2'nin (gerçek ilişkinin biçimi) en iyisi olduğunu gösteriyor. İndirgenemez hata 0,0625; derece 2'nin test hatası (0,076) buna çok yakın.", en: "Someone looking at training error would pick degree 12. The test error shows that degree 2 (the shape of the true relationship) is best. The irreducible error is 0.0625; degree 2's test error (0.076) is very close to it." }
      },
      {
        id: "m2-u2-c2", kind: "audit",
        task: { tr: "YZ derece 12 modeli kurdu ve başarısını raporladı. Hatalı satırı bul ve düzelt: hata, modelin görmediği test verisinde ölçülsün.", en: "The AI built the degree-12 model and reported its performance. Find the faulty line and fix it: the error should be measured on the test data the model has not seen." },
        ai: {
          prompt: { tr: "Deneyimden log ücreti öngören 12. dereceden bir polinom modeli kur ve ne kadar başarılı olduğunu söyle.", en: "Build a degree-12 polynomial model predicting log wage from experience and tell me how well it does." },
          reply: { tr: "Model kuruldu, hatası şöyle:", en: "The model is built; here is its error:" },
          code: { tr: W.tr + `\nk = kur(e_egt, y_egt, 12)\nhata = hko(ongor(k, e_egt), y_egt)\nprint(f"Model hatası (HKO): {hata:.3f}")`, en: W.en + `\nk = fit(e_tr, y_tr, 12)\nerr = mse(predict(k, e_tr), y_tr)\nprint(f"Model error (MSE): {err:.3f}")` },
          claim: { tr: "HKO yalnızca 0,032; bu, gürültüden (0,0625) bile düşük. Model ücretleri neredeyse kusursuz öngörüyor.", en: "The MSE is only 0.032, lower even than the noise (0.0625). The model predicts wages almost perfectly." }
        },
        bugLines: [16],
        lineExplain: { tr: "Hata, modeli kurmak için kullanılan 30 kişide ölçülüyor. Model bu kişileri zaten “görmüş”. Gürültüden düşük bir hata, ezberin işaretidir: hiçbir model, tahmin edilemez rastgele sapmayı yeni kişilerde öngöremez.", en: "The error is measured on the 30 people used to build the model. The model has already “seen” them. An error lower than the noise is a sign of memorisation: no model can predict unpredictable random deviations for new people." },
        hints: [{ tr: "<code>e_egt, y_egt</code> yerine test verisini kullan: <code>hko(ongor(k, e_tst), y_tst)</code>", en: "Use the test data instead of <code>e_tr, y_tr</code>: <code>mse(predict(k, e_te), y_te)</code>" }],
        solution: { tr: W.tr + `\nk = kur(e_egt, y_egt, 12)\nhata = hko(ongor(k, e_tst), y_tst)\nprint(f"Model hatası (test HKO): {hata:.3f}")`, en: W.en + `\nk = fit(e_tr, y_tr, 12)\nerr = mse(predict(k, e_te), y_te)\nprint(f"Model error (test MSE): {err:.3f}")` },
        checks: [{ py: { tr: "abs(hata - hko(ongor(kur(e_egt, y_egt, 12), e_tst), y_tst)) < 1e-9", en: "abs(err - mse(predict(fit(e_tr, y_tr, 12), e_te), y_te)) < 1e-9" }, msg: { tr: "<code>hata</code>, derece 12 modelin test verisindeki HKO'su olmalı.", en: "<code>err</code> should be the degree-12 model's MSE on the test data." } }],
        after: { tr: "Test HKO 18'in üzerinde. YZ “kusursuz” dediği modelin, yeni kişilerde derece 2 modelinden yüzlerce kat kötü olduğunu fark etmedi. Bir YZ modelinin başarısını raporladığında ilk soru şu olmalı: <b>hangi veride?</b>", en: "The test MSE is above 18. The AI did not notice that the model it called “flawless” is hundreds of times worse than the degree-2 model on new people. When an AI reports a model's performance, the first question should be: <b>on which data?</b>" }
      },
      {
        id: "m2-u2-c3", kind: "fill",
        task: { tr: "Elinde tek bir veri seti olduğunda onu sen bölmelisin. 100 gözlemi karıştırıp %80'ini eğitime, %20'sini teste ayır.", en: "When you have a single data set, you must split it yourself. Shuffle 100 observations and put 80% in training and 20% in test." },
        code: { tr: `import numpy as np\nrng = np.random.default_rng(1)\nkarisik = rng.permutation(100)          # 0–99 arası sayılar, karışık sırada\negitim = karisik[:80]\ntest = ___\nprint(len(egitim), len(test))`, en: `import numpy as np\nrng = np.random.default_rng(1)\nshuffled = rng.permutation(100)          # the numbers 0–99 in random order\ntrain = shuffled[:80]\ntest = ___\nprint(len(train), len(test))` },
        solution: { tr: `import numpy as np\nrng = np.random.default_rng(1)\nkarisik = rng.permutation(100)          # 0–99 arası sayılar, karışık sırada\negitim = karisik[:80]\ntest = karisik[80:]\nprint(len(egitim), len(test))`, en: `import numpy as np\nrng = np.random.default_rng(1)\nshuffled = rng.permutation(100)          # the numbers 0–99 in random order\ntrain = shuffled[:80]\ntest = shuffled[80:]\nprint(len(train), len(test))` },
        hints: [{ tr: "Eğitim ilk 80 elemanı aldı; test geri kalanını almalı: <code>karisik[80:]</code>", en: "Training took the first 80 elements; test should take the rest: <code>shuffled[80:]</code>" }],
        checks: [{ py: { tr: "len(test) == 20 and len(set(egitim) & set(test)) == 0 and len(set(egitim) | set(test)) == 100", en: "len(test) == 20 and len(set(train) & set(test)) == 0 and len(set(train) | set(test)) == 100" }, msg: { tr: "Test 20 gözlem içermeli; eğitimle hiç ortak gözlemi olmamalı ve ikisi birlikte 100 gözlemin hepsini kapsamalı.", en: "Test should have 20 observations, share none with training, and together they should cover all 100." } }],
        after: { tr: "Karıştırma önemli: veri bir düzene göre sıralıysa (ör. gelire göre), ilk 80'i almak eğitim ve testi sistematik olarak farklı yapar. Zaman serilerinde ise kural tersine döner; bunu Ünite 8'de göreceksin.", en: "Shuffling matters: if the data are sorted in some order (e.g. by income), taking the first 80 makes training and test systematically different. With time series the rule is reversed; you will see this in Unit 8." }
      }
    ],
    quiz: [
      { q: { tr: "Bir modelin başarısı neden test verisinde ölçülür?", en: "Why is a model's performance measured on test data?" }, options: { tr: ["Test verisi daha büyük olduğu için", "Modelin yeni gözlemlerde nasıl çalışacağını görmek için", "Eğitim verisi hatalı olduğu için"], en: ["Because test data are larger", "To see how the model will work on new observations", "Because training data are faulty"] }, answer: 1, explain: { tr: "Amaç genellemedir.", en: "The goal is generalisation." } },
      { q: { tr: "Eğitim hatası gürültüden (indirgenemez hatadan) düşükse bu neye işaret eder?", en: "If the training error is below the noise (irreducible error), what does that suggest?" }, options: { tr: ["Mükemmel bir modele", "Ezberlemeye (aşırı uyuma)", "Veri eksikliğine"], en: ["A perfect model", "Memorisation (overfitting)", "Missing data"] }, answer: 1, explain: { tr: "Model rastgele sapmaları da öğrenmiştir.", en: "The model has learned the random deviations too." } },
      { q: { tr: "Bu ünitede neden simülasyon kullandık?", en: "Why did we use a simulation in this unit?" }, options: { tr: ["Gerçek veri olmadığı için", "Gerçek ilişkiyi bildiğimiz için hatayı tam ölçebildiğimizden", "Daha hızlı olduğu için"], en: ["Because there are no real data", "Because we know the true relationship and can measure error exactly", "Because it is faster"] }, answer: 1, explain: { tr: "Gerçek veride gerçek ilişki bilinmez.", en: "With real data the true relationship is unknown." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 3 — Aşırı uyum ve eksik uyum                                   */
  /* =================================================================== */
  const LOOP_TR = `\negitim_hatalari, test_hatalari = [], []\nfor d in range(1, 13):\n    k = kur(e_egt, y_egt, d)\n    egitim_hatalari.append(hko(ongor(k, e_egt), y_egt))\n    test_hatalari.append(hko(ongor(k, e_tst), y_tst))`;
  const LOOP_EN = `\ntrain_errors, test_errors = [], []\nfor d in range(1, 13):\n    k = fit(e_tr, y_tr, d)\n    train_errors.append(mse(predict(k, e_tr), y_tr))\n    test_errors.append(mse(predict(k, e_te), y_te))`;
  U.push({
    id: "m2-u3",
    minutes: 25,
    packages: ["numpy"],
    title: { tr: "Aşırı uyum ve eksik uyum", en: "Overfitting and underfitting" },
    blurb: { tr: "Esneklik arttıkça eğitim hatası düşer; test hatası önce düşer, sonra fırlar.", en: "As flexibility grows, training error falls; test error first falls, then shoots up." },
    terms: [{ tr: "aşırı uyum", en: "overfitting" }, { tr: "eksik uyum", en: "underfitting" }, { tr: "esneklik (karmaşıklık)", en: "flexibility (complexity)" }],
    concept: {
      tr: `<p>Polinomun derecesi modelin <b>esnekliğidir</b>: derece arttıkça eğri veriye daha çok kıvrılabilir.</p>
<ul>
<li><b>Eksik uyum:</b> model çok basit, verideki yapıyı yakalayamaz. Derece 1 (düz çizgi), ücretin önce artıp sonra düzleşmesini göremez. Hem eğitim hem test hatası yüksektir.</li>
<li><b>Aşırı uyum:</b> model çok esnek, yapıyla birlikte <b>gürültüyü</b> de öğrenir. Derece 12, 30 noktanın her birine uğramak için kıvrılır. Eğitim hatası çok düşük, test hatası çok yüksektir.</li>
<li><b>Yerinde:</b> model, verideki gerçek yapıyı yakalayacak kadar esnek, gürültüyü öğrenmeyecek kadar sade.</li>
</ul>
<div class="box econ"><b>Kural:</b> eğitim hatası esneklik arttıkça <b>hiç artmaz</b>; daha esnek bir model eğitim verisine her zaman en az aynı ölçüde uyar. Bu yüzden eğitim hatası, model seçmek için kullanılamaz.</div>`,
      en: `<p>The degree of the polynomial is the model's <b>flexibility</b>: the higher the degree, the more the curve can bend towards the data.</p>
<ul>
<li><b>Underfitting:</b> the model is too simple to capture the structure in the data. Degree 1 (a straight line) cannot see wages first rising and then levelling off. Both training and test errors are high.</li>
<li><b>Overfitting:</b> the model is so flexible that it learns the <b>noise</b> along with the structure. Degree 12 bends to pass through each of the 30 points. Training error is very low, test error very high.</li>
<li><b>Just right:</b> flexible enough to capture the real structure, simple enough not to learn the noise.</li>
</ul>
<div class="box econ"><b>Rule:</b> training error <b>never rises</b> as flexibility increases; a more flexible model always fits the training data at least as well. That is why training error cannot be used to choose a model.</div>`
    },
    playground: {
      type: "polyFit",
      intro: { tr: "Dereceyi 1'den 12'ye kaydır. Eğrinin noktalara nasıl yapıştığına ve iki hatanın birbirinden nasıl ayrıldığına bak. Yeni bir örneklem çekip tekrar dene.", en: "Slide the degree from 1 to 12. Watch how the curve clings to the points and how the two errors pull apart. Draw a new sample and try again." },
      takeaway: { tr: "Eğitim hatası hep düşer; test hatası bir noktadan sonra yükselir. Aradaki fark, ezberin ölçüsüdür.", en: "Training error keeps falling; test error rises beyond some point. The gap between them measures memorisation." }
    },
    cells: [
      {
        id: "m2-u3-c1", kind: "run",
        task: { tr: "12 derecenin hepsini dene. Önce tahmin et.", en: "Try all 12 degrees. Predict first." },
        predict: { q: { tr: "Derece 1'den 12'ye giderken eğitim hatası nasıl değişir?", en: "How does training error change from degree 1 to 12?" }, options: { tr: ["Hiç artmaz (düşer ya da aynı kalır)", "Önce düşer sonra artar", "Rastgele değişir"], en: ["Never rises (falls or stays the same)", "Falls then rises", "Changes randomly"] }, answer: 0, explain: { tr: "Her derece bir öncekini kapsar; daha esnek model eğitim verisine en az aynı ölçüde uyar.", en: "Each degree contains the previous one; a more flexible model fits the training data at least as well." } },
        code: { tr: W.tr + LOOP_TR + `\nfor d in range(1, 13):\n    print(f"{d:2d}  eğitim {egitim_hatalari[d-1]:.3f}  test {test_hatalari[d-1]:8.3f}")`, en: W.en + LOOP_EN + `\nfor d in range(1, 13):\n    print(f"{d:2d}  training {train_errors[d-1]:.3f}  test {test_errors[d-1]:8.3f}")` }
      },
      {
        id: "m2-u3-c2", kind: "audit",
        task: { tr: "YZ en iyi dereceyi seçti. Hatalı satırı bul ve düzelt: en iyi derece, yeni veride en iyi çalışan olsun.", en: "The AI picked the best degree. Find the faulty line and fix it: the best degree should be the one that works best on new data." },
        ai: {
          prompt: { tr: "1'den 12'ye kadar polinom derecelerini dene ve en iyisini seç.", en: "Try polynomial degrees from 1 to 12 and pick the best." },
          reply: { tr: "Her dereceyi deneyip en düşük hatalıyı seçelim:", en: "Let us try each degree and pick the lowest error:" },
          code: { tr: W.tr + LOOP_TR + `\nen_iyi = int(np.argmin(egitim_hatalari)) + 1\nprint("En iyi derece:", en_iyi)`, en: W.en + LOOP_EN + `\nbest = int(np.argmin(train_errors)) + 1\nprint("Best degree:", best)` },
          claim: { tr: "En iyi model derece 12: hatası en düşük olan o.", en: "The best model is degree 12: it has the lowest error." }
        },
        bugLines: [20],
        lineExplain: { tr: "YZ test hatasını hesapladı ama seçimi <b>eğitim hatasına</b> göre yaptı. Eğitim hatası esneklikle hiç artmadığı için bu kural her zaman en esnek modeli seçer.", en: "The AI computed the test error but chose by <b>training error</b>. Since training error never rises with flexibility, this rule always picks the most flexible model." },
        hints: [{ tr: "<code>np.argmin(test_hatalari)</code>", en: "<code>np.argmin(test_errors)</code>" }],
        solution: { tr: W.tr + LOOP_TR + `\nen_iyi = int(np.argmin(test_hatalari)) + 1\nprint("En iyi derece:", en_iyi)`, en: W.en + LOOP_EN + `\nbest = int(np.argmin(test_errors)) + 1\nprint("Best degree:", best)` },
        checks: [{ py: { tr: "en_iyi == int(np.argmin(test_hatalari)) + 1", en: "best == int(np.argmin(test_errors)) + 1" }, msg: { tr: "<code>en_iyi</code>, test hatası en düşük derece olmalı.", en: "<code>best</code> should be the degree with the lowest test error." } }],
        after: { tr: "Test hatası derece 2'yi seçiyor. Ama dikkat: burada model seçmek için test verisini kullandık. Gerçek bir çalışmada test verisi en sona saklanır; model seçimi çapraz doğrulamayla yapılır (Ünite 6).", en: "The test error picks degree 2. But note: here we used the test data to choose a model. In a real study the test data are kept until the very end; model choice is made with cross-validation (Unit 6)." }
      },
      {
        id: "m2-u3-c3", kind: "interpret",
        task: { tr: "YZ derece 12 modelini yorumladı. Hangi cümleler yanlış?", en: "The AI interpreted the degree-12 model. Which sentences are wrong?" },
        prompt: { tr: "Derece 12 polinom: eğitim HKO 0,032, test HKO 18,2. Derece 2: eğitim 0,070, test 0,076. Yorumlar mısın?", en: "Degree-12 polynomial: training MSE 0.032, test MSE 18.2. Degree 2: training 0.070, test 0.076. Can you interpret this?" },
        sentences: {
          tr: ["Derece 12 eğitim verisine çok iyi uyuyor ama yeni veride çok kötü: aşırı uyum.", "Derece 12 daha çok değişken kullandığı için daha gerçekçi bir modeldir.", "Derece 2'nin eğitim ve test hataları birbirine yakın; model iyi genelliyor.", "Daha fazla veriyle derece 12'nin test hatası kesinlikle derece 2'nin altına iner."],
          en: ["Degree 12 fits the training data very well but does very badly on new data: overfitting.", "Degree 12 is a more realistic model because it uses more terms.", "Degree 2's training and test errors are close; the model generalises well.", "With more data degree 12's test error will certainly fall below degree 2's."]
        },
        bad: [1, 3],
        explain: {
          tr: ["Doğru.", "<b>Yanlış:</b> daha fazla terim daha gerçekçi değil, daha esnek demektir. Gerçek ilişki 2. dereceden.", "Doğru.", "<b>Abartı:</b> daha fazla veri aşırı uyumu azaltır, ama gerçek ilişki 2. dereceden olduğu için derece 12'nin derece 2'yi geçeceğinin bir garantisi yok."],
          en: ["Correct.", "<b>Wrong:</b> more terms means more flexible, not more realistic. The true relationship is quadratic.", "Correct.", "<b>Overclaim:</b> more data reduce overfitting, but since the true relationship is quadratic there is no guarantee degree 12 will beat degree 2."]
        }
      }
    ],
    quiz: [
      { q: { tr: "Aşırı uyumun belirtisi hangisidir?", en: "Which is a sign of overfitting?" }, options: { tr: ["Eğitim hatası düşük, test hatası yüksek", "İki hata da yüksek", "İki hata da düşük ve yakın"], en: ["Low training error, high test error", "Both errors high", "Both errors low and close"] }, answer: 0, explain: { tr: "Model gürültüyü ezberlemiştir.", en: "The model has memorised the noise." } },
      { q: { tr: "Eksik uyumun belirtisi hangisidir?", en: "Which is a sign of underfitting?" }, options: { tr: ["Eğitim hatası düşük, test hatası yüksek", "İki hata da yüksek", "Test hatası eğitim hatasından düşük"], en: ["Low training error, high test error", "Both errors high", "Test error below training error"] }, answer: 1, explain: { tr: "Model yapıyı yakalayamayacak kadar basittir.", en: "The model is too simple to capture the structure." } },
      { q: { tr: "Eğitim hatası neden model seçmek için kullanılamaz?", en: "Why can training error not be used to choose a model?" }, options: { tr: ["Hesaplanması zor olduğu için", "Esneklik arttıkça hiç artmadığı için hep en esnek modeli seçer", "Negatif çıkabildiği için"], en: ["Because it is hard to compute", "Because it never rises with flexibility, so it always picks the most flexible model", "Because it can be negative"] }, answer: 1, explain: { tr: "Bu yüzden yeni veride ölçülen bir hataya ihtiyaç var.", en: "That is why an error measured on new data is needed." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 4 — U biçimli eğri                                              */
  /* =================================================================== */
  const UREP = (R) => ({
    tr: W.tr + `\nR = ${R}\nEGT = np.zeros(8); TST = np.zeros(8)\nfor _ in range(R):\n    e, y = orneklem(30)\n    for i, d in enumerate(range(1, 9)):\n        k = kur(e, y, d)\n        EGT[i] += hko(ongor(k, e), y)\n        TST[i] += hko(ongor(k, e_tst), y_tst)`,
    en: W.en + `\nR = ${R}\nTR = np.zeros(8); TE = np.zeros(8)\nfor _ in range(R):\n    e, y = draw(30)\n    for i, d in enumerate(range(1, 9)):\n        k = fit(e, y, d)\n        TR[i] += mse(predict(k, e), y)\n        TE[i] += mse(predict(k, e_te), y_te)`
  });
  U.push({
    id: "m2-u4",
    minutes: 25,
    packages: ["numpy"],
    title: { tr: "U biçimli eğri", en: "The U-shaped curve" },
    blurb: { tr: "Tek bir örneklem şansa bağlıdır. Deneyi 100 kez tekrarlayıp ortalama hatalara bakmak.", en: "A single sample depends on luck. Repeat the experiment 100 times and look at the average errors." },
    terms: [{ tr: "esneklik–hata eğrisi", en: "flexibility–error curve" }, { tr: "indirgenemez hata", en: "irreducible error" }, { tr: "tekrarlı deney", en: "repeated experiment" }],
    concept: {
      tr: `<p>Ünite 3'teki sonuçlar tek bir 30 kişilik örnekleme dayanıyordu. Başka 30 kişi çekseydik sayılar değişirdi. Genel örüntüyü görmek için deneyi birçok kez tekrarlayıp <b>ortalama</b> eğitim ve test hatasına bakarız.</p>
<p>Ortalama test hatası esnekliğe karşı çizildiğinde <b>U biçiminde</b> bir eğri çıkar: önce düşer (model yapıyı yakalamaya başlar), bir yerde dibe vurur, sonra yükselir (model gürültüyü öğrenmeye başlar). Eğitim hatası ise sürekli düşer.</p>
<p>Test hatası hiçbir zaman <b>indirgenemez hatanın</b> altına inemez. Bizim dünyamızda bu, rastgele sapmanın varyansıdır: 0,25² = 0,0625. Ne kadar iyi bir model kurarsan kur, bireyin ücretindeki öngörülemez kısmı öngöremezsin.</p>
<div class="box">U'nun dibi nerede? Bu, veri miktarına bağlıdır. Daha çok veriyle daha esnek modeller de güvenle kullanılabilir. Oyun alanında örneklem büyüklüğünü değiştirip dene.</div>`,
      en: `<p>The results in Unit 3 rested on a single sample of 30 people. With another 30 people the numbers would change. To see the general pattern, we repeat the experiment many times and look at the <b>average</b> training and test errors.</p>
<p>Plotting average test error against flexibility gives a <b>U-shaped</b> curve: it first falls (the model starts to capture the structure), bottoms out somewhere, then rises (the model starts to learn the noise). Training error keeps falling.</p>
<p>Test error can never go below the <b>irreducible error</b>. In our world that is the variance of the random deviation: 0.25² = 0.0625. However good your model, you cannot predict the unpredictable part of a person's wage.</p>
<div class="box">Where is the bottom of the U? It depends on how much data there is. With more data, more flexible models can also be used safely. Try changing the sample size in the playground.</div>`
    },
    playground: {
      type: "uCurve",
      intro: { tr: "Her derece için 100 farklı örneklemle model kuruldu; çizgiler ortalama hatalar. Örneklem büyüklüğünü değiştir ve U'nun dibinin nereye kaydığına bak.", en: "For each degree, models were built on 100 different samples; the lines are average errors. Change the sample size and see where the bottom of the U moves." },
      takeaway: { tr: "Test hatası U çizer ve indirgenemez hatanın altına inmez. Veri arttıkça U'nun sağ kolu yavaşça yükselir.", en: "Test error traces a U and never drops below the irreducible error. With more data the right arm of the U rises more slowly." }
    },
    cells: [
      {
        id: "m2-u4-c1", kind: "run",
        task: { tr: "Deneyi 100 kez tekrarla (birkaç saniye sürebilir). Önce tahmin et.", en: "Repeat the experiment 100 times (it may take a few seconds). Predict first." },
        predict: { q: { tr: "Ortalama test hatası en düşük hangi derecede çıkar?", en: "Which degree has the lowest average test error?" }, options: { tr: ["1", "2", "8"], en: ["1", "2", "8"] }, answer: 1, explain: { tr: "Gerçek ilişki 2. dereceden; ortalamada en iyi genelleyen model de derece 2.", en: "The true relationship is quadratic; on average the model that generalises best is degree 2." } },
        code: { tr: UREP(100).tr + `\nfor i in range(8):\n    print(f"derece {i+1}  ort. eğitim {EGT[i]/R:.3f}  ort. test {TST[i]/R:.3f}")`, en: UREP(100).en + `\nfor i in range(8):\n    print(f"degree {i+1}  avg training {TR[i]/R:.3f}  avg test {TE[i]/R:.3f}")` }
      },
      {
        id: "m2-u4-c2", kind: "compare",
        task: { tr: "İki YZ aynı soruya iki farklı yanıt verdi. Hangisine güvenirsin?", en: "Two AIs gave different answers to the same question. Which do you trust?" },
        prompt: { tr: "Ücret–deneyim verisi için hangi polinom derecesi en iyi?", en: "Which polynomial degree is best for the wage–experience data?" },
        options: [
          { reply: { tr: "Bir örneklem çekip test hatasına baktım:", en: "I drew one sample and looked at the test error:" }, code: { tr: "e, y = orneklem(30)\nhatalar = [hko(ongor(kur(e, y, d), e_tst), y_tst) for d in range(1, 13)]\nprint(int(np.argmin(hatalar)) + 1)", en: "e, y = draw(30)\nerrors = [mse(predict(fit(e, y, d), e_te), y_te) for d in range(1, 13)]\nprint(int(np.argmin(errors)) + 1)" }, claim: { tr: "En iyi derece 5; bu kesin.", en: "The best degree is 5; this is definitive." } },
          { reply: { tr: "Deneyi 100 kez tekrarlayıp ortalama test hatasına baktım:", en: "I repeated the experiment 100 times and looked at the average test error:" }, code: { tr: "# 100 örneklem × 8 derece; ortalama test hatası\nprint(int(np.argmin(TST)) + 1)", en: "# 100 samples × 8 degrees; average test error\nprint(int(np.argmin(TE)) + 1)" }, claim: { tr: "Ortalamada derece 2 en iyi; tek tek örneklemlerde sonuç değişebilir.", en: "On average degree 2 is best; the result can vary in individual samples." } }
        ],
        answer: 1,
        reasons: {
          tr: ["A daha az hesap yaptığı için daha güvenilir.", "A tek bir örneklemin şansını kesin sonuç gibi sunuyor; B sonucun değişkenliğini hesaba katıyor.", "B daha çok satır kod yazdığı için."],
          en: ["A is more reliable because it computes less.", "A presents the luck of a single sample as a definitive result; B accounts for variability.", "Because B writes more lines of code."]
        },
        reasonAnswer: 1,
        explain: { tr: "Tek bir 30 kişilik örneklemde derece 3, 4 ya da 5 de en iyi çıkabilir; aralarındaki farklar küçüktür. “Kesin” kelimesi, verinin taşımadığı bir güven ifade ediyor.", en: "In a single 30-person sample degree 3, 4 or 5 can also come out best; the differences are small. The word “definitive” expresses a confidence the data do not support." }
      },
      {
        id: "m2-u4-c3", kind: "fill",
        task: { tr: "Ortalama test hatasının indirgenemez hatadan (0,0625) ne kadar uzak olduğunu hesapla: en iyi derecenin ortalama test hatasından 0,0625'i çıkar.", en: "Compute how far the average test error is from the irreducible error (0.0625): subtract 0.0625 from the best degree's average test error." },
        code: { tr: UREP(40).tr + `\nort_test = TST / R\nfazla = ___\nprint("İndirgenemez hatanın üstündeki kısım:", round(fazla, 4))`, en: UREP(40).en + `\navg_test = TE / R\nexcess = ___\nprint("Part above the irreducible error:", round(excess, 4))` },
        solution: { tr: UREP(40).tr + `\nort_test = TST / R\nfazla = ort_test.min() - SIG ** 2\nprint("İndirgenemez hatanın üstündeki kısım:", round(fazla, 4))`, en: UREP(40).en + `\navg_test = TE / R\nexcess = avg_test.min() - SIG ** 2\nprint("Part above the irreducible error:", round(excess, 4))` },
        hints: [{ tr: "En düşük ortalama test hatası: <code>ort_test.min()</code>. İndirgenemez hata: <code>SIG ** 2</code> (= 0,0625).", en: "The lowest average test error: <code>avg_test.min()</code>. Irreducible error: <code>SIG ** 2</code> (= 0.0625)." }],
        checks: [{ py: { tr: "abs(fazla - ((TST / R).min() - 0.0625)) < 1e-9 and fazla > 0", en: "abs(excess - ((TE / R).min() - 0.0625)) < 1e-9 and excess > 0" }, msg: { tr: "<code>fazla</code> = en düşük ortalama test hatası − 0,0625 olmalı (pozitif bir sayı).", en: "<code>excess</code> should be the lowest average test error − 0.0625 (a positive number)." } }],
        after: { tr: "Fark pozitif ve küçük. En iyi model bile indirgenemez hatanın altına inemiyor; aradaki küçük fark, 30 kişiyle kestirim yapmanın bedeli.", en: "The gap is positive and small. Even the best model cannot go below the irreducible error; the small gap is the price of estimating with only 30 people." }
      }
    ],
    quiz: [
      { q: { tr: "Ortalama test hatası esnekliğe karşı çizildiğinde hangi biçimi alır?", en: "What shape does average test error take when plotted against flexibility?" }, options: { tr: ["Sürekli düşen", "U biçimi", "Düz çizgi"], en: ["Steadily falling", "A U shape", "A flat line"] }, answer: 1, explain: { tr: "Önce eksik uyum azalır, sonra aşırı uyum artar.", en: "First underfitting decreases, then overfitting increases." } },
      { q: { tr: "İndirgenemez hata nedir?", en: "What is the irreducible error?" }, options: { tr: ["Kötü kodlamadan gelen hata", "Hiçbir modelin öngöremeyeceği rastgele sapmanın payı", "Eğitim hatası"], en: ["Error from bad coding", "The share of random deviation that no model can predict", "The training error"] }, answer: 1, explain: { tr: "Bizim dünyamızda 0,0625.", en: "In our world it is 0.0625." } },
      { q: { tr: "Neden deneyi birçok kez tekrarladık?", en: "Why did we repeat the experiment many times?" }, options: { tr: ["Tek bir örneklemin sonucu şansa bağlı olduğu için", "Bilgisayarı sınamak için", "Hata büyüsün diye"], en: ["Because a single sample's result depends on luck", "To test the computer", "To make the error larger"] }, answer: 0, explain: { tr: "Ortalama, şansın etkisini azaltır.", en: "Averaging reduces the effect of luck." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 5 — Yanlılık ve varyans                                         */
  /* =================================================================== */
  U.push({
    id: "m2-u5",
    minutes: 25,
    packages: ["numpy"],
    title: { tr: "Yanlılık ve varyans", en: "Bias and variance" },
    blurb: { tr: "Hep benzer ama yanlış mı, yoksa ortalamada doğru ama oynak mı? Dart tahtası ve ücret modelleri.", en: "Always similar but wrong, or right on average but erratic? The dartboard and wage models." },
    terms: [{ tr: "yanlılık", en: "bias" }, { tr: "varyans", en: "variance" }, { tr: "yanlılık–varyans dengesi", en: "bias–variance trade-off" }],
    concept: {
      tr: `<p>Aynı modeli farklı örneklemlerle tekrar tekrar kurduğunu düşün. Belirli bir kişi için (ör. 20 yıl deneyimli biri) her seferinde biraz farklı bir öngörü elde edersin. Bu öngörülerin iki özelliği vardır:</p>
<ul>
<li><b>Yanlılık:</b> öngörülerin <b>ortalaması</b> gerçek değerden ne kadar uzak? Çok basit modeller (derece 1) sistematik olarak yanılır: hep benzer, ama hep yanlış.</li>
<li><b>Varyans:</b> öngörüler örneklemden örnekleme ne kadar <b>oynuyor</b>? Çok esnek modeller (derece 12) her örneklemin gürültüsüne uyar: ortalamada doğruya yakın, ama her seferinde bambaşka.</li>
</ul>
<p>Beklenen test hatası üç parçaya ayrılır: <b>yanlılık² + varyans + indirgenemez hata</b>. Esneklik arttıkça yanlılık düşer, varyans artar. U eğrisinin dibi, ikisinin toplamının en küçük olduğu yerdir: <b>yanlılık–varyans dengesi</b>.</p>
<div class="box econ">Tanıdık bir fikir: Modül 1'de çok benzer iki değişkenin katsayıları örneklemden örnekleme oynuyordu. O da yüksek varyansın bir örneğiydi.</div>`,
      en: `<p>Imagine building the same model again and again on different samples. For a given person (say, someone with 20 years of experience) you get a slightly different prediction each time. These predictions have two properties:</p>
<ul>
<li><b>Bias:</b> how far is the <b>average</b> prediction from the true value? Very simple models (degree 1) are systematically wrong: always similar, but always wrong.</li>
<li><b>Variance:</b> how much do the predictions <b>swing</b> from sample to sample? Very flexible models (degree 12) follow each sample's noise: close to the truth on average, but very different each time.</li>
</ul>
<p>Expected test error splits into three parts: <b>bias² + variance + irreducible error</b>. As flexibility rises, bias falls and variance rises. The bottom of the U curve is where their sum is smallest: the <b>bias–variance trade-off</b>.</p>
<div class="box econ">A familiar idea: in Module 1 the coefficients of two very similar variables swung from sample to sample. That too was an example of high variance.</div>`
    },
    playground: {
      type: "biasVariance",
      intro: { tr: "İlk sekmede yanlılık ve varyansı ayrı ayrı değiştir. İkinci sekmede 25 farklı örneklemle kurulan ücret modellerini derece derece incele.", en: "In the first tab, change bias and variance separately. In the second, inspect wage models built on 25 different samples, degree by degree." },
      takeaway: { tr: "Basit modeller yanlı, esnek modeller oynaktır. İyi model ikisini dengeler.", en: "Simple models are biased, flexible models are erratic. A good model balances the two." }
    },
    cells: [
      {
        id: "m2-u5-c1", kind: "run",
        task: { tr: "20 yıl deneyimli bir kişi için 200 farklı örneklemle model kurup öngörülerin yanlılığını ve varyansını ölçüyoruz. Önce tahmin et.", en: "For a person with 20 years of experience we build models on 200 different samples and measure the bias and variance of the predictions. Predict first." },
        predict: { q: { tr: "Hangi derecenin varyansı en büyük çıkar?", en: "Which degree has the largest variance?" }, options: { tr: ["1", "2", "12"], en: ["1", "2", "12"] }, answer: 2, explain: { tr: "Derece 12 her örneklemin gürültüsüne uyduğu için öngörüleri en çok oynayan model. Derece 1'in ise yanlılığı en büyük.", en: "Degree 12 follows each sample's noise, so its predictions swing the most. Degree 1 has the largest bias." } },
        code: { tr: W.tr + `\nx = np.array([20.0])\nfor d in [1, 2, 12]:\n    o = np.array([ongor(kur(*orneklem(30), d), x)[0] for _ in range(200)])\n    print(f"derece {d:2d}  yanlılık² {(o.mean() - gercek(20)) ** 2:.4f}  varyans {o.var():.4f}")`, en: W.en + `\nx = np.array([20.0])\nfor d in [1, 2, 12]:\n    o = np.array([predict(fit(*draw(30), d), x)[0] for _ in range(200)])\n    print(f"degree {d:2d}  bias² {(o.mean() - true_f(20)) ** 2:.4f}  variance {o.var():.4f}")` },
        after: { tr: "Derece 1: yanlılık² ≈ 0,03, varyans ≈ 0,003 (hep benzer, hep yanlış). Derece 12: yanlılık ≈ 0, varyans ≈ 0,027 (ortalamada doğru, ama oynak). Derece 2 ikisini de küçük tutuyor.", en: "Degree 1: bias² ≈ 0.03, variance ≈ 0.003 (always similar, always wrong). Degree 12: bias ≈ 0, variance ≈ 0.027 (right on average, but erratic). Degree 2 keeps both small." }
      },
      {
        id: "m2-u5-c2", kind: "interpret",
        task: { tr: "YZ yanlılık ve varyansı açıkladı. Hangi cümleler yanlış?", en: "The AI explained bias and variance. Which sentences are wrong?" },
        prompt: { tr: "Yanlılık ve varyansı ücret modeli örneğiyle açıklar mısın?", en: "Can you explain bias and variance with the wage model example?" },
        sentences: {
          tr: ["Derece 1 model, örneklem değişse de benzer öngörüler verir ama gerçek ilişkiden sistematik olarak sapar.", "Derece 12 modelin yanlılığı düşük olduğu için en iyi modeldir.", "Esneklik arttıkça yanlılık genellikle düşer, varyans artar.", "Varyans, modelin gerçek değerden ortalama uzaklığıdır."],
          en: ["The degree-1 model gives similar predictions even as the sample changes, but deviates systematically from the true relationship.", "The degree-12 model is the best model because its bias is low.", "As flexibility increases, bias usually falls and variance rises.", "Variance is the model's average distance from the true value."]
        },
        bad: [1, 3],
        explain: {
          tr: ["Doğru.", "<b>Yanlış:</b> düşük yanlılık tek başına yetmez; derece 12'nin varyansı çok yüksek ve toplam test hatası çok büyük.", "Doğru.", "<b>Yanlış:</b> bu yanlılığın tanımına yakın. Varyans, öngörülerin kendi ortalamaları etrafındaki dağınıklığıdır."],
          en: ["Correct.", "<b>Wrong:</b> low bias alone is not enough; degree 12 has very high variance and a very large total test error.", "Correct.", "<b>Wrong:</b> that is closer to the definition of bias. Variance is the spread of the predictions around their own average."]
        }
      },
      {
        id: "m2-u5-c3", kind: "fill",
        task: { tr: "Beklenen test hatası ≈ yanlılık² + varyans + indirgenemez hata. Derece 2 için bu toplamı hesapla.", en: "Expected test error ≈ bias² + variance + irreducible error. Compute this sum for degree 2." },
        code: { tr: W.tr + `\nx = np.array([20.0])\no = np.array([ongor(kur(*orneklem(30), 2), x)[0] for _ in range(200)])\nyanlilik2 = (o.mean() - gercek(20)) ** 2\nvaryans = o.var()\ntoplam = ___\nprint("Beklenen hata (20 yıl deneyim için):", round(toplam, 4))`, en: W.en + `\nx = np.array([20.0])\no = np.array([predict(fit(*draw(30), 2), x)[0] for _ in range(200)])\nbias2 = (o.mean() - true_f(20)) ** 2\nvariance = o.var()\ntotal = ___\nprint("Expected error (for 20 years of experience):", round(total, 4))` },
        solution: { tr: W.tr + `\nx = np.array([20.0])\no = np.array([ongor(kur(*orneklem(30), 2), x)[0] for _ in range(200)])\nyanlilik2 = (o.mean() - gercek(20)) ** 2\nvaryans = o.var()\ntoplam = yanlilik2 + varyans + SIG ** 2\nprint("Beklenen hata (20 yıl deneyim için):", round(toplam, 4))`, en: W.en + `\nx = np.array([20.0])\no = np.array([predict(fit(*draw(30), 2), x)[0] for _ in range(200)])\nbias2 = (o.mean() - true_f(20)) ** 2\nvariance = o.var()\ntotal = bias2 + variance + SIG ** 2\nprint("Expected error (for 20 years of experience):", round(total, 4))` },
        hints: [{ tr: "<code>yanlilik2 + varyans + SIG ** 2</code>", en: "<code>bias2 + variance + SIG ** 2</code>" }],
        checks: [{ py: { tr: "abs(toplam - (yanlilik2 + varyans + 0.0625)) < 1e-9", en: "abs(total - (bias2 + variance + 0.0625)) < 1e-9" }, msg: { tr: "<code>toplam</code> üç parçanın toplamı olmalı.", en: "<code>total</code> should be the sum of the three parts." } }],
        after: { tr: "Toplamın büyük kısmı indirgenemez hata (0,0625). Derece 2, yanlılığı ve varyansı birlikte küçük tuttuğu için bu sınıra yakın.", en: "Most of the total is the irreducible error (0.0625). Degree 2 is close to this floor because it keeps both bias and variance small." }
      }
    ],
    quiz: [
      { q: { tr: "Yüksek yanlılıklı bir model nasıl davranır?", en: "How does a high-bias model behave?" }, options: { tr: ["Örneklemden örnekleme çok oynar", "Hep benzer ama sistematik olarak yanlış öngörür", "Gürültüyü ezberler"], en: ["Swings a lot from sample to sample", "Predicts similarly every time but systematically wrong", "Memorises the noise"] }, answer: 1, explain: { tr: "Basit modellerin tipik sorunu.", en: "The typical problem of simple models." } },
      { q: { tr: "Beklenen test hatasının üç parçası hangileridir?", en: "What are the three parts of expected test error?" }, options: { tr: ["Yanlılık² + varyans + indirgenemez hata", "Eğitim hatası + test hatası + gürültü", "Ortalama + medyan + mod"], en: ["Bias² + variance + irreducible error", "Training error + test error + noise", "Mean + median + mode"] }, answer: 0, explain: { tr: "Yanlılık–varyans ayrıştırması.", en: "The bias–variance decomposition." } },
      { q: { tr: "Esneklik arttıkça genellikle ne olur?", en: "What usually happens as flexibility increases?" }, options: { tr: ["Yanlılık düşer, varyans artar", "Yanlılık artar, varyans düşer", "İkisi de düşer"], en: ["Bias falls, variance rises", "Bias rises, variance falls", "Both fall"] }, answer: 0, explain: { tr: "Bu yüzden bir denge noktası aranır.", en: "That is why a balance point is sought." } }
    ]
  });
})();
