/* Modül 6 — genişletilmiş kavram anlatımları (şekil, tablo, çözümlü örnek, sık hatalar, özet)
 * Şekiller tools/m6_figs.py ile üretilir (window.M6_FIGS). Bileşenler: content/concept-kit.js
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 */
(function () {
  "use strict";
  const K = window.CK, F = window.M6_FIGS || {};
  const U = window.M6_UNITS || [];
  if (!K) return;
  const { sec, cards, pit, sum, analogy, formula, steps, table, code, vs, wrap, nf } = K;
  const fig = (name, lang, cap) => K.fig(F, name, lang, cap);
  const B = {};
  const pc = (x, d, lang) => (lang === "tr" ? "%" + nf(x, d, lang) : nf(x, d, lang) + "%");

  /* ------------------------------------------------------------ Ünite 1 */
  B["m6-u1"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Önceki modüllerde her gözlem (bir başvuran, bir işçi) diğerlerinden bağımsızdı. Zaman serisinde gözlemler sıralıdır: bugün dünden, yarın bugünden etkilenir. Bu ünite, finansal zaman serilerinde ilk ve en önemli adımı anlatıyor: <b>fiyatla değil, getiriyle çalışmak</b>.", "In earlier modules each observation (an applicant, a worker) was independent of the others. In a time series observations are ordered: today is affected by yesterday, tomorrow by today. This unit covers the first and most important step with financial time series: <b>working with returns, not prices</b>.")}</p>
${sec(1, 0, t("Sezgi: sarhoşun yürüyüşü", "Intuition: the drunkard's walk"), analogy("🚶", t("Her adımda yazı turayla sağa ya da sola giden birinin konumu, bir sonraki konumunu çok iyi “öngörür”: bir adım ötede olacaktır. Ama bir sonraki adımın yönü hakkında hiçbir şey söylemez. Kurlar ve hisse fiyatları da böyledir: düzey kalıcıdır, değişim rastgeleye yakındır.", "The position of someone who steps left or right by tossing a coin “predicts” their next position very well: they will be one step away. But it says nothing about the direction of the next step. Exchange rates and stock prices are like this: the level is persistent, the change is close to random.")))}
${sec(2, 1, t("Fiyat ve getiri", "Price and return"), fig("u1_price", lang, t("<b>Şekil 1.</b> Euro/dolar kuru (üstte) yıllarca bir yöne sürüklenir; günlük getiriler (altta) sıfır etrafında dalgalanır.", "<b>Figure 1.</b> The euro/dollar rate (top) drifts in one direction for years; daily returns (bottom) fluctuate around zero.")) +
      formula("r<sub>t</sub> = 100 × (ln P<sub>t</sub> − ln P<sub>t−1</sub>)", [["P<sub>t</sub>", t("t günündeki kur (1 euro kaç dolar)", "the rate on day t (dollars per euro)")], ["r<sub>t</sub>", t("günlük log getiri, yüzde; küçük değişimlerde yüzde değişime çok yakın", "daily log return, percent; very close to the percentage change for small moves")], [t("toplanabilirlik", "additivity"), t("bir ayın log getirisi = günlük log getirilerin toplamı", "a month's log return = the sum of the daily log returns")]]))}
${sec(3, 2, t("Çözümlü örnek: iki yanılsama", "Worked example: two illusions"), table([t("Deney", "Experiment"), t("Sonuç", "Result"), t("Ders", "Lesson")], [
      { cls: "bad", cells: [t("Bugünkü kur → yarınki kur", "Today's rate → tomorrow's rate"), "R² = " + nf(0.998, 3, lang), t("yalnızca “yarın bugüne benzer”", "only “tomorrow resembles today”")] },
      [t("Bugünkü getiri → yarınki getiri", "Today's return → tomorrow's return"), "R² = " + nf(0.0001, 4, lang), t("asıl soru budur ve çok zordur", "this is the real question, and it is very hard")],
      { cls: "bad", cells: [t("Bağımsız iki rastgele yürüyüş, düzeyler", "Two independent random walks, levels"), t("regresyonların ", "") + pc(91.6, 1, lang) + t("'sında |t| > 2", " of regressions with |t| > 2")] },
      [t("Aynı seriler, farklar", "The same series, differences"), pc(3.6, 1, lang) + t(" (beklenen %5)", " (5% expected)")]
    ]))}
${sec(4, 3, t("Durağanlık", "Stationarity"), cards([
      [0, "📏", t("Durağan seri", "Stationary series"), t("Ortalaması ve dağılımı zaman içinde kabaca sabit: getiriler.", "Its mean and distribution are roughly constant over time: returns.")],
      [3, "🌊", t("Durağan olmayan seri", "Non-stationary series"), t("Belirli bir düzeye dönmez, sürüklenir: fiyatlar, kurlar.", "It does not return to a fixed level; it drifts: prices, exchange rates.")],
      [1, "🧪", t("Neden önemli?", "Why does it matter?"), t("Modeller geçmişteki ilişkinin gelecekte de geçerli olduğunu varsayar. Durağan olmayan serilerde bu varsayım çöker ve sahte ilişkiler ortaya çıkar.", "Models assume the past relationship also holds in future. With non-stationary series this assumption breaks down and spurious relationships appear.")]
    ]))}
${sec(5, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Fiyat düzeyini hedef almak", "Targeting the price level"), t("R² yüksek çıkar ama hiçbir şey öngörülmez.", "R² comes out high but nothing is forecast."), t("Getiriyi (değişimi) hedef al.", "Target the return (the change).")],
      [t("Düzeylerle regresyon kurmak", "Running regressions in levels"), t("Bağımsız seriler bile anlamlı görünür.", "Even independent series look significant."), t("Farklarla ya da getirilerle çalış.", "Work with differences or returns.")],
      [t("Basit getiriyle log getiriyi karıştırmak", "Mixing up simple and log returns"), t("Büyük hareketlerde fark büyür; log getiriler toplanır, basit getiriler toplanmaz.", "The gap grows for big moves; log returns add up, simple returns do not."), t("Tanımı yaz ve tutarlı kal.", "State the definition and stay consistent.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Fiyat kalıcıdır, getiri rastgeleye yakındır.", "The price is persistent, the return is close to random."), t("Finansal öngörüde hedef getiridir.", "In financial forecasting the target is the return."), t("Durağan olmayan serilerde sahte ilişkiler kolayca ortaya çıkar.", "With non-stationary series spurious relationships appear easily.")])}`);
  };

  /* ------------------------------------------------------------ Ünite 2 */
  B["m6-u2"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Getiriler sıfır etrafında dalgalanır ama iki önemli özellikleri vardır. Bu özellikler modülün geri kalanını belirler: neyin öngörülebilir, neyin öngörülemez olduğunu ve riskin nasıl ölçülmesi gerektiğini.", "Returns fluctuate around zero but have two important properties. These properties shape the rest of the module: what is predictable, what is not, and how risk should be measured.")}</p>
${sec(1, 0, t("Kalın kuyruklar", "Fat tails"), fig("u2_hist", lang, t("<b>Şekil 1.</b> Standartlaştırılmış günlük getirilerin dağılımı ve normal dağılım. Merkez daha sivri, kuyruklar daha kalın: aşırı günler normalin öngördüğünden çok daha sık.", "<b>Figure 1.</b> The distribution of standardised daily returns and the normal distribution. The centre is more peaked and the tails fatter: extreme days are much more frequent than the normal predicts.")) +
      table([t("İstatistik", "Statistic"), t("Euro/dolar", "Euro/dollar"), t("Normal dağılım", "Normal distribution")], [
        [t("Yıllık volatilite", "Annual volatility"), pc(9.1, 1, lang), "—"], [t("Basıklık fazlası", "Excess kurtosis"), nf(2.55, 2, lang), "0"],
        [t("|z| > 3 olan günler", "Days with |z| > 3"), pc(1.07, 2, lang), pc(0.27, 2, lang)], { cls: "bad", cells: [t("|z| > 4 olan günler", "Days with |z| > 4"), pc(0.23, 2, lang), pc(0.006, 3, lang)] }
      ], { num: [1, 2] }))}
${sec(2, 1, t("Volatilite kümelenmesi", "Volatility clustering"), fig("u2_acf", lang, t("<b>Şekil 2.</b> Getirinin otokorelasyonları güven bandının içinde, yani sıfırdan ayırt edilemiyor; mutlak getirininkiler pozitif ve 30 gün sonra bile kalıcı.", "<b>Figure 2.</b> The return's autocorrelations are inside the confidence band, i.e. indistinguishable from zero; the absolute return's are positive and still persistent after 30 days.")) +
      `<p>${t("Büyük hareketler büyük hareketleri izler: 2008 krizinde günlük ±%2'lik hareketler sıradandı, 2019'da nadirdi. Yıllık volatilite 2019'da %4,7, 2008'de %14,2.", "Big moves follow big moves: in the 2008 crisis daily moves of ±2% were ordinary, in 2019 they were rare. Annual volatility was 4.7% in 2019 and 14.2% in 2008.")}</p>`)}
${sec(3, 2, t("İlişkisiz ama bağımsız değil", "Uncorrelated but not independent"), vs(t("“Otokorelasyon sıfır, demek ki getiriler bağımsız.”", "“Autocorrelation is zero, so returns are independent.”"), `<p>${t("İlişkisizlik yalnızca doğrusal bir öngörünün işe yaramadığını söyler.", "Being uncorrelated only says that a linear forecast does not work.")}</p>`, t("“Yön öngörülemez ama büyüklük öngörülebilir.”", "“The direction is unpredictable but the size is predictable.”"), `<p>${t("|r|'nin otokorelasyonu pozitif: bugünün çalkantısı yarının çalkantısını haber verir.", "The autocorrelation of |r| is positive: today's turbulence signals tomorrow's.")}</p>`))}
${sec(4, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Riski normal dağılımla ölçmek", "Measuring risk with the normal distribution"), t("Aşırı kayıplar olduğundan çok daha nadir görünür.", "Extreme losses look much rarer than they are."), t("Kuyrukları veriden öğren (Ünite 8).", "Learn the tails from the data (Unit 8).")],
      [t("Volatiliteyi sabit saymak", "Treating volatility as constant"), t("Bütün dönemin standart sapması ne krizi ne sakin dönemi yansıtır.", "The whole period's standard deviation reflects neither the crisis nor the calm."), t("Kayan pencerelerle güncelle.", "Update with rolling windows.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Getirilerin kuyrukları normalden kalındır.", "Returns have fatter tails than the normal."), t("Volatilite kümelenir: büyüklük kalıcıdır.", "Volatility clusters: the size is persistent."), t("Yön neredeyse öngörülemez, büyüklük öngörülebilir.", "The direction is almost unpredictable, the size is predictable.")])}`);
  };

  /* ------------------------------------------------------------ Ünite 3 */
  B["m6-u3"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Modül 2'de çapraz doğrulamayı veriyi rastgele katlara bölerek yaptık. Gözlemler bağımsızken bu doğruydu. Zaman serisinde ise rastgele bölme, modelin sınavdan önce cevap anahtarına bakması gibidir.", "In Module 2 we did cross-validation by splitting the data into random folds. That was right when observations were independent. With a time series, a random split is like the model looking at the answer key before the exam.")}</p>
${sec(1, 0, t("Sezgi: hava durumu sınavı", "Intuition: a weather-forecast exam"), analogy("🌤️", t("Bir hava durumu modelini sınamak için yılın günlerini rastgele seçip “15 Mart'ın sıcaklığını tahmin et” dersen ve model 14 ile 16 Mart'ın sıcaklıklarını görmüşse, tahmin kolaydır. Ama gerçekte yarını tahmin ederken yarından sonrasını hiç görmeyiz.", "If you test a weather model by picking days at random and asking “forecast 15 March's temperature”, and the model has seen 14 and 16 March, the forecast is easy. But in reality, when forecasting tomorrow we never see the day after.")))}
${sec(2, 1, t("Sızıntının büyüklüğü", "The size of the leak"), fig("u3_leak", lang, t("<b>Şekil 1.</b> Gelecek 20 günün volatilitesini öngören iki model, iki çapraz doğrulama türü. Rastgele bölme ormanın R²'sini 0,06'dan 0,67'ye şişiriyor ve modellerin sıralamasını bile tersine çeviriyor.", "<b>Figure 1.</b> Two models forecasting the next 20 days' volatility, two kinds of cross-validation. The random split inflates the forest's R² from 0.06 to 0.67 and even reverses the ranking of the models.")))}
${sec(3, 2, t("Neden bu kadar büyük?", "Why so big?"), steps([t("<b>Örtüşen hedefler:</b> bugünün ve yarının “gelecek 20 gün” pencereleri 19 günü paylaşır; hedefin kendi geçmişiyle korelasyonu 0,986.", "<b>Overlapping targets:</b> today's and tomorrow's “next 20 days” windows share 19 days; the target's correlation with its own past is 0.986."), t("<b>Komşular eğitimde:</b> rastgele bölmede her test gününün dünü ve yarını eğitim verisindedir.", "<b>Neighbours in training:</b> in a random split every test day's yesterday and tomorrow are in the training data."), t("<b>Esnek model kopyalar:</b> orman, özellikleri test gününe çok benzeyen komşu günün hedefini neredeyse aynen verir.", "<b>A flexible model copies:</b> the forest gives almost exactly the target of the neighbouring day whose features are very similar to the test day's.")]) +
      code(t(`cv = TimeSeriesSplit(5)                     # rastgele KFold yerine: eğitim hep testten önce
cross_val_score(model, X, y, cv=cv, scoring="r2")`, `cv = TimeSeriesSplit(5)                     # instead of random KFold: training always before the test
cross_val_score(model, X, y, cv=cv, scoring="r2")`)))}
${sec(4, 3, t("Sızıntının kaynakları", "Sources of leakage"), cards([
      [4, "🔀", t("Karıştırılmış bölme", "Shuffled split"), t("<code>KFold(shuffle=True)</code>, <code>train_test_split</code> (varsayılan olarak karıştırır).", "<code>KFold(shuffle=True)</code>, <code>train_test_split</code> (shuffles by default).")],
      [3, "🪟", t("Ortalanmış pencere", "Centred window"), t("<code>rolling(..., center=True)</code> geleceği özelliğe taşır (Ünite 5).", "<code>rolling(..., center=True)</code> carries the future into the feature (Unit 5).")],
      [1, "⏩", t("Yanlış kaydırma", "Wrong shift"), t("Hedefi <code>shift(-1)</code>, özelliği <code>shift(+k)</code> ya da hiç kaydırmadan bugüne kadar hesapla.", "Compute the target with <code>shift(-1)</code>, features with <code>shift(+k)</code> or unshifted up to today.")]
    ]))}
${sec(5, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Modül 2'nin varsayılanını zaman serisine taşımak", "Carrying Module 2's default over to time series"), t("Rastgele katlar geleceği sızdırır.", "Random folds leak the future."), t("<code>TimeSeriesSplit</code>.", "<code>TimeSeriesSplit</code>.")],
      [t("Çok iyi sonucu kutlamak", "Celebrating a very good result"), t("Finansal öngörüde R² 0,67 çoğu zaman bir hata belirtisidir.", "In financial forecasting an R² of 0.67 is often a symptom of an error."), t("Önce sızıntı ara.", "Look for leakage first.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Zaman serisinde rastgele bölme geleceği eğitime sızdırır.", "With time series a random split leaks the future into training."), t("Sızıntı en çok örtüşen hedeflerde ve esnek modellerde büyür.", "Leakage grows most with overlapping targets and flexible models."), t("Eğitim her zaman testten önce gelmeli.", "Training must always come before the test.")])}`);
  };

  /* ------------------------------------------------------------ Ünite 4 */
  B["m6-u4"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Zamana saygılı doğrulamanın ilkesi tektir: <b>model, karar anında bilinmeyen hiçbir şeyi görmemeli</b>. Bu ünite bu ilkeyi uygulamanın üç aracını anlatıyor.", "Time-respecting validation has a single principle: <b>the model must not see anything that was unknown at the decision point</b>. This unit covers three tools for applying it.")}</p>
${sec(1, 0, t("TimeSeriesSplit", "TimeSeriesSplit"), fig("u4_folds", lang, t("<b>Şekil 1.</b> Beş kat, genişleyen eğitim penceresi ve 20 günlük boşluk. Her katın testi kendinden önceki bütün verilerle eğitilen bir modelle yapılır.", "<b>Figure 1.</b> Five folds, an expanding training window and a 20-day gap. Each fold's test uses a model trained on all the data before it.")) +
      code(t(`TimeSeriesSplit(n_splits=5)                  # genişleyen pencere
TimeSeriesSplit(n_splits=5, gap=20)          # hedef 20 gün ileriye bakıyorsa
TimeSeriesSplit(n_splits=5, max_train_size=1260)   # sabit uzunlukta pencere (yaklaşık 5 yıl)`, `TimeSeriesSplit(n_splits=5)                  # expanding window
TimeSeriesSplit(n_splits=5, gap=20)          # if the target looks 20 days ahead
TimeSeriesSplit(n_splits=5, max_train_size=1260)   # fixed-length window (about 5 years)`)))}
${sec(2, 1, t("Boşluk (gap)", "The gap"), `<p>${t("Hedef 20 gün ileriye uzanıyorsa, eğitimin son 20 gününün hedefi test dönemindeki günleri içerir. Bu günleri eğitimden çıkarmak için eğitimin sonu ile testin başı arasına en az hedef ufku kadar boşluk konur. Euro/dolarda doğrusal model için fark yoktu (iki durumda da R² 0,29), ama esnek modellerde ve uzun ufuklarda önemli olabilir.", "If the target reaches 20 days ahead, the targets of training's last 20 days contain days in the test period. To drop them from training, a gap of at least the target horizon is placed between the end of training and the start of the test. For the linear model on euro/dollar there was no difference (R² 0.29 in both cases), but it can matter with flexible models and long horizons.")}</p>`)}
${sec(3, 2, t("Yürüyen pencere", "Walk-forward"), steps([t("Bir karar takvimi seç: örneğin her yılın başı.", "Choose a decision calendar: for example the start of each year."), t("Her karar anında modeli o güne kadarki verilerle (boşluk bırakarak) yeniden kur.", "At each decision point refit the model with the data up to that day (leaving a gap)."), t("Bir sonraki karar anına kadar olan dönemi öngör.", "Forecast the period up to the next decision point."), t("Bütün öngörüleri birleştirip tek bir test skoru hesapla.", "Combine all forecasts and compute a single test score.")]) +
      table([t("Yöntem", "Method"), t("Test R² (2015–)", "Test R² (2015–)")], [[t("2014 sonunda bir kez kur", "Fit once at the end of 2014"), nf(0.389, 3, lang)], { cls: "hl", cells: [t("Her yıl yeniden kur", "Refit every year"), nf(0.398, 3, lang)] }], { num: [1] }))}
${sec(4, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Yalnızca ortalama skora bakmak", "Looking only at the mean score"), t("Katlar farklı rejimleri yansıtır: burada −0,02 ile 0,44 arası.", "Folds reflect different regimes: here between −0.02 and 0.44."), t("Kat skorlarını tek tek raporla.", "Report the fold scores one by one.")],
      [t("Boşluğu unutmak", "Forgetting the gap"), t("Örtüşen hedefler sınırdan sızar.", "Overlapping targets leak across the boundary."), t("gap ≥ hedef ufku.", "gap ≥ target horizon.")],
      [t("Ölçeklemeyi bütün veriyle yapmak", "Scaling with all the data"), t("Geleceğin ortalaması ve varyansı eğitime girer.", "The future's mean and variance enter training."), t("Her katta yalnızca eğitimle (pipeline).", "Within each fold, training only (pipeline).")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("TimeSeriesSplit: eğitim hep testten önce.", "TimeSeriesSplit: training always before the test."), t("Boşluk, örtüşen hedeflerin sızmasını önler.", "The gap prevents overlapping targets from leaking."), t("Yürüyen pencere gerçek kullanımı en dürüst biçimde taklit eder.", "Walk-forward imitates real use most honestly.")])}`);
  };

  /* ------------------------------------------------------------ Ünite 5 */
  B["m6-u5"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Finansta makine öğrenmesinin en çok vaat edilen uygulaması “piyasanın yönünü öngörmek”tir. Bu ünite bu vaadi dürüstçe sınıyor ve sonucun neden olumsuz çıktığını açıklıyor.", "The most promised application of machine learning in finance is “forecasting the market's direction”. This unit tests that promise honestly and explains why the result is negative.")}</p>
${sec(1, 0, t("Sezgi: yerde duran 100 dolar", "Intuition: the $100 bill on the ground"), analogy("💵", t("Eski bir iktisat şakası: bir öğrenci yerde 100 dolar görür; hocası “eğilme, gerçek olsaydı biri çoktan almıştı” der. Geçmiş fiyatlarda kolay bir kâr fırsatı olsaydı, binlerce yatırımcı onu çoktan kullanmış ve ortadan kaldırmış olurdu. Etkin piyasa hipotezinin özü budur.", "An old economics joke: a student sees a $100 bill on the ground; the professor says “don't bother, if it were real someone would have picked it up already”. If past prices offered an easy profit, thousands of investors would already have used it and eliminated it. That is the core of the efficient market hypothesis.")))}
${sec(2, 1, t("Doğru kıyas ve doğru ölçü", "The right benchmark and the right metric"), formula(t("örneklem dışı R² = 1 − Σ(y − ŷ)² / Σ(y − 0)²", "out-of-sample R² = 1 − Σ(y − ŷ)² / Σ(y − 0)²"), [[t("kıyas", "benchmark"), t("“getiri sıfır” (kur değişmez): rastgele yürüyüş tahmini", "“zero return” (the rate does not change): the random-walk forecast")], [t("R² < 0", "R² < 0"), t("model, hiçbir şey yapmamaktan kötü", "the model is worse than doing nothing")]]) +
      table([t("Model", "Model"), t("Örneklem dışı R²", "Out-of-sample R²"), t("Yön isabeti", "Direction hit rate")], [
        [t("Eğitim ortalaması", "Training mean"), nf(-0.0001, 4, lang), "—"], { cls: "bad", cells: [t("Doğrusal model", "Linear model"), nf(-0.0059, 4, lang), pc(48.2, 1, lang)] },
        { cls: "bad", cells: [t("Rassal orman", "Random forest"), nf(-0.0093, 4, lang), pc(50.1, 1, lang)] }, [t("“Hep düşer” kuralı", "“Always down” rule"), "—", pc(50.6, 1, lang)]
      ], { num: [1, 2] }))}
${sec(3, 2, t("Yön isabeti", "Direction hit rate"), fig("u5_dir", lang, t("<b>Şekil 1.</b> Modellerin yön isabeti, en basit iki kuralla aynı düzeyde. 2015 sonrasında euro hafifçe değer kaybettiği için “hep düşer” %50'nin biraz üstünde.", "<b>Figure 1.</b> The models' direction hit rate is at the level of the two simplest rules. Because the euro lost slightly after 2015, “always down” is a little above 50%.")))}
${sec(4, 3, t("Geleceği gören özellik", "A feature that sees the future"), vs(t("<code>r.rolling(20, center=True).mean()</code>", "<code>r.rolling(20, center=True).mean()</code>"), `<p>${t("Pencere önümüzdeki 10 günü de kapsar: yön isabeti %56, örneklem dışı R² 0,055. Tamamen sahte.", "The window also covers the next 10 days: direction hit rate 56%, out-of-sample R² 0.055. Entirely fake.")}</p>`, t("<code>r.rolling(20).mean()</code>", "<code>r.rolling(20).mean()</code>"), `<p>${t("Yalnızca bugüne kadarki 20 gün: yön isabeti %48. Gerçek sonuç.", "Only the 20 days up to today: direction hit rate 48%. The real result.")}</p>`) +
      `<p>${t("Kural: bir özelliğin her değeri, o günün kapanışında gerçekten bilinebilecek bilgiyle hesaplanmalı.", "Rule: every value of a feature must be computable from information that could really be known at that day's close.")}</p>`)}
${sec(5, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("%50'yi kıyas almak", "Using 50% as the benchmark"), t("Bir yönün baskın olduğu dönemlerde “hep o yön” daha yüksek alır.", "In periods where one direction dominates, “always that direction” scores higher."), t("Basit kurallarla kıyasla.", "Compare with simple rules.")],
      [t("Eğitim R²'sine güvenmek", "Trusting the training R²"), t("Ormanın eğitim R²'si 0,089, testte negatif.", "The forest's training R² is 0.089; negative in the test."), t("Yalnızca örneklem dışı sonuç.", "Only the out-of-sample result.")],
      [t("Daha karmaşık modelle kurtarmaya çalışmak", "Trying to rescue it with a more complex model"), t("Sinyal yoksa esneklik gürültüyü öğrenir.", "If there is no signal, flexibility learns the noise."), t("Önce bilgi kaynağını sorgula.", "First question the information source.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Geçmiş getiriler yarının getirisini neredeyse hiç öngörmüyor.", "Past returns hardly forecast tomorrow's return at all."), t("Kıyas: sıfır getiri; ölçü: örneklem dışı R² ve basit kurallara göre isabet.", "Benchmark: zero return; metric: out-of-sample R² and hit rate against simple rules."), t("Çok iyi bir sonuç önce bir sızıntı belirtisidir.", "A very good result is first a symptom of leakage.")])}`);
  };

  /* ------------------------------------------------------------ Ünite 6 */
  B["m6-u6"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Ünite 2'nin ikinci bulgusu burada işe yarıyor: büyüklük kalıcıysa öngörülebilir. Risk yönetiminin asıl ihtiyacı da yön değil, riskin büyüklüğüdür.", "Unit 2's second finding pays off here: if the size is persistent, it is predictable. What risk management really needs is not the direction but the size of risk.")}</p>
${sec(1, 0, t("HAR modeli", "The HAR model"), formula("σ̂<sub>t+1:t+20</sub> = b<sub>0</sub> + b<sub>1</sub> v5<sub>t</sub> + b<sub>2</sub> v20<sub>t</sub> + b<sub>3</sub> v60<sub>t</sub>", [["v<sub>w</sub>", t("son w günün gerçekleşen volatilitesi: √(ortalama r²)", "the realised volatility of the last w days: √(mean r²)")], [t("hedef", "target"), t("önümüzdeki 20 günün gerçekleşen volatilitesi", "the realised volatility of the next 20 days")], [t("fikir", "idea"), t("kısa, orta ve uzun vadeli yatırımcılar volatiliteye farklı tepki verir (Corsi, 2009)", "short-, medium- and long-term investors react differently to volatility (Corsi, 2009)")]]))}
${sec(2, 1, t("Tahmin ve gerçekleşen", "Forecast and realised"), fig("u6_vol", lang, t("<b>Şekil 1.</b> 2015 sonrası test döneminde HAR tahmini ve gerçekleşen volatilite (yıllık %). Tahmin, sakin ve çalkantılı dönemleri izliyor; ani sıçramaları ise gecikmeli yakalıyor.", "<b>Figure 1.</b> The HAR forecast and realised volatility (annual %) in the post-2015 test period. The forecast tracks calm and turbulent periods; sudden spikes it catches with a delay.")) +
      table([t("Tahmin", "Forecast"), t("Test R²", "Test R²")], [
        { cls: "bad", cells: [t("Eğitim ortalaması", "Training mean"), nf(-0.708, 3, lang)] }, [t("Son 20 gün", "Last 20 days"), nf(0.232, 3, lang)], [t("Son 60 gün", "Last 60 days"), nf(0.342, 3, lang)],
        { cls: "hl", cells: [t("HAR (doğrusal, üç pencere)", "HAR (linear, three windows)"), nf(0.389, 3, lang)] }, [t("Rassal orman (üç pencere)", "Random forest (three windows)"), nf(0.286, 3, lang)]
      ], { num: [1] }))}
${sec(3, 2, t("Katsayıları okumak", "Reading the coefficients"), steps([t("v5 0,02, v20 0,36, v60 0,43: en çok uzun pencere belirliyor; volatilitenin yavaş değişen bir bileşeni var.", "v5 0.02, v20 0.36, v60 0.43: the long window matters most; volatility has a slowly changing component."), t("Toplam 0,81 < 1: volatilite ortalamaya döner.", "The sum is 0.81 < 1: volatility reverts to the mean."), t("Orman, eğitim dönemindeki yüksek volatilite düzeylerine takılıyor; ağaçlar eğitimde görmedikleri düzeylere uzanamaz.", "The forest gets stuck on the training period's high volatility levels; trees cannot extend beyond levels they did not see in training.")]))}
${sec(4, 3, t("Nerede kullanılır?", "Where is it used?"), cards([
      [0, "⚖️", t("Portföy", "Portfolio"), t("Volatilite hedeflemesi: beklenen volatilite yükselince pozisyonu küçült.", "Volatility targeting: cut the position when expected volatility rises.")],
      [1, "📉", t("Risk ölçüsü", "Risk measure"), t("Riske maruz değer ve sermaye yeterliliği (Ünite 8).", "Value at risk and capital adequacy (Unit 8).")],
      [2, "🧾", t("Opsiyon fiyatı", "Option prices"), t("Opsiyonun değeri gelecekteki volatiliteye bağlıdır.", "An option's value depends on future volatility.")]
    ]))}
${sec(5, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Volatilite öngörüsünü yön öngörüsü sanmak", "Mistaking a volatility forecast for a direction forecast"), t("Büyük hareket bekleniyor; hangi yöne olduğu bilinmiyor.", "A big move is expected; which way is unknown."), t("İkisini ayrı değerlendir.", "Evaluate the two separately.")],
      [t("Ağaç modellerini rejim değişiminde kullanmak", "Using tree models across regime changes"), t("Eğitim aralığının dışına çıkamazlar.", "They cannot go beyond the training range."), t("Doğrusal bir kıyasla karşılaştır.", "Compare with a linear benchmark.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Volatilite öngörülebilir: test R² 0,39.", "Volatility is predictable: test R² 0.39."), t("Kısa, orta ve uzun pencereler birlikte en iyi sonucu verir.", "Short, medium and long windows together give the best result."), t("Basit doğrusal model burada ormandan iyi.", "The simple linear model beats the forest here.")])}`);
  };

  /* ------------------------------------------------------------ Ünite 7 */
  B["m6-u7"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Bir al-sat kuralının geçmiş veride ne kadar kazandıracağını hesaplamaya <b>geriye dönük test</b> (backtest) denir. Finansta en çok yanlış yapılan analizlerden biridir: küçük hatalar kaybettiren kuralları efsanevi gösterir.", "Computing how much a trading rule would have earned on past data is called a <b>backtest</b>. It is one of the most frequently botched analyses in finance: small errors make losing rules look legendary.")}</p>
${sec(1, 0, t("Sharpe oranı", "The Sharpe ratio"), formula(t("Sharpe = yıllık ortalama getiri / yıllık oynaklık = (ort. günlük getiri / günlük std) × √252", "Sharpe = annual mean return / annual volatility = (mean daily return / daily std) × √252"), [[t("0", "0"), t("risk alındı ama karşılığı yok", "risk taken with no reward")], ["0,5–1", t("iyi bir fon", "a good fund")], ["> 2", t("çok nadir; önce hata ara", "very rare; look for an error first")]]))}
${sec(2, 1, t("Veri madenciliği", "Data snooping"), fig("u7_snoop", lang, t("<b>Şekil 1.</b> Her nokta, her gün yazı turayla euro alıp satan bir kural. Eğitimde en iyisi (pembe) 0,81 alıyor, testte −0,02. Momentum kuralı (turuncu) da eğitimde iyi, testte negatif.", "<b>Figure 1.</b> Each dot is a rule that buys or sells euros by tossing a coin each day. The best in training (pink) gets 0.81, and −0.02 in the test. The momentum rule (orange) is also good in training and negative in the test.")) +
      `<p>${t("Yeterince çok kural denenirse, hiçbir becerisi olmayan bir kural bile şans eseri parlak görünür. Bu yüzden bir stratejinin başarısı, <b>kaç stratejinin denendiği</b> bilinmeden değerlendirilemez.", "If enough rules are tried, even a rule with no skill at all looks brilliant by chance. That is why a strategy's success cannot be judged without knowing <b>how many strategies were tried</b>.")}</p>`)}
${sec(3, 2, t("Geriye dönük testin kontrol listesi", "A backtest checklist"), steps([t("<b>Zamanlama:</b> bugünün kapanışındaki karar yarının getirisini kazanır. Aynı günün getirisini kullanmak Sharpe'ı −0,23'ten 2,54'e çıkarıyordu.", "<b>Timing:</b> a decision at today's close earns tomorrow's return. Using the same day's return raised the Sharpe from −0.23 to 2.54."), t("<b>Maliyetler:</b> yılda 23 işlem, işlem başına %0,01 maliyet Sharpe'ı −0,23'ten −0,29'a indiriyor.", "<b>Costs:</b> 23 trades a year at 0.01% per trade lower the Sharpe from −0.23 to −0.29."), t("<b>Seçim:</b> kuralı seçmek için kullanılan dönem, onu sınamak için kullanılamaz.", "<b>Selection:</b> the period used to choose the rule cannot be used to test it."), t("<b>Sayım:</b> denenen bütün kuralların sayısını raporla.", "<b>Counting:</b> report the number of all rules tried.")]))}
${sec(4, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Aynı günün getirisiyle test etmek", "Testing with the same day's return"), t("Karar, sonucu bilindikten sonra verilmiş olur.", "The decision is made after the outcome is known."), t("Konum × yarının getirisi.", "Position × tomorrow's return.")],
      [t("En iyi kuralı raporlamak", "Reporting the best rule"), t("200 denemenin en iyisi şans eseri iyidir.", "The best of 200 tries is good by chance."), t("Yeni bir dönemde bir kez sına.", "Test once on a new period.")],
      [t("Maliyetleri yok saymak", "Ignoring costs"), t("Sık işlem yapan kuralların küçük kazançlarını siler.", "They erase the small gains of frequently trading rules."), t("Gerçekçi maliyet ekle.", "Add realistic costs.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Eğitimde parlayan kural testte sönebilir.", "A rule that shines in training can fade in the test."), t("Çok kural denemek şansı beceri gibi gösterir.", "Trying many rules makes luck look like skill."), t("Her işlem, karar anındaki bilgiyle ve sonraki getiriyle hesaplanmalı.", "Every trade must be computed with the information at the decision point and the return that follows.")])}`);
  };

  /* ------------------------------------------------------------ Ünite 8 */
  B["m6-u8"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Riske maruz değer (VaR), bankaların ve fonların her gün hesapladığı risk ölçüsüdür: “%99 olasılıkla yarınki kaybımız şu düzeyi aşmayacak.” Bu ünite, modülün iki bulgusunu (volatilite öngörülebilir, kuyruklar kalın) bir araya getirerek VaR kuruyor ve dürüstçe sınıyor.", "Value at risk (VaR) is the risk measure banks and funds compute every day: “with 99% probability tomorrow's loss will not exceed this level.” This unit combines the module's two findings (volatility is predictable, tails are fat) to build VaR and test it honestly.")}</p>
${sec(1, 0, t("Tanım", "Definition"), formula(t("VaR<sub>%1</sub> = q × σ̂<sub>t</sub>,   P(r<sub>t+1</sub> &lt; VaR) = %1", "VaR<sub>1%</sub> = q × σ̂<sub>t</sub>,   P(r<sub>t+1</sub> &lt; VaR) = 1%"), [["σ̂<sub>t</sub>", t("yarının volatilite tahmini (sabit, v20, v60, …)", "the volatility forecast for tomorrow (constant, v20, v60, …)")], ["q", t("çarpan: normal dağılımda −2,326; ya da eğitim verisinden öğrenilen yüzdelik", "multiplier: −2.326 for the normal; or a quantile learned from training data")], [t("aşım", "exceedance"), t("getirinin VaR'ın altına düştüğü gün; iyi bir modelde günlerin yaklaşık %1'i ve zamana dengeli dağılmış", "a day the return falls below VaR; in a good model about 1% of days, spread evenly over time")]]))}
${sec(2, 1, t("Üç model, 2015 sonrası", "Three models, after 2015"), fig("u8_var", lang, t("<b>Şekil 1.</b> Günlük getiriler, sabit VaR (turuncu çizgi) ve v20 × eğitimden öğrenilen çarpan (yeşil). Sabit VaR 2015'te çok aşılıyor, sonraki sakin yıllarda neredeyse hiç; değişen VaR riskle birlikte yükselip alçalıyor.", "<b>Figure 1.</b> Daily returns, constant VaR (orange line) and v20 × the multiplier learned from training (green). Constant VaR is breached often in 2015 and almost never in the calm years after; the time-varying VaR rises and falls with risk.")) +
      table([t("Model", "Model"), t("Aşım oranı", "Exceedance rate"), t("Sorun", "Problem")], [
        { cls: "bad", cells: [t("Sabit σ, normal çarpan", "Constant σ, normal multiplier"), pc(0.58, 2, lang), t("aşımlar 2015'te yığılıyor, 2017–19'da hiç yok", "exceedances pile up in 2015, none in 2017–19")] },
        { cls: "bad", cells: [t("v20, normal çarpan (−2,33)", "v20, normal multiplier (−2.33)"), pc(2.17, 2, lang), t("doğru zamanlama, yanlış kuyruk", "right timing, wrong tail")] },
        { cls: "hl", cells: [t("v20, eğitim çarpanı (−2,64)", "v20, training multiplier (−2.64)"), pc(1.29, 2, lang), t("yakın", "close")] },
        [t("v60, eğitim çarpanı", "v60, training multiplier"), pc(1.05, 2, lang), t("hedefe çok yakın", "very close to target")]
      ], { num: [1] }))}
${sec(3, 2, t("Ders", "The lesson"), cards([
      [0, "⏱️", t("Doğru zamanda", "At the right time"), t("Değişen volatilite, riski çalkantılı dönemde büyütür, sakin dönemde küçültür.", "Time-varying volatility enlarges risk in turbulent periods and shrinks it in calm ones.")],
      [4, "🦴", t("Doğru dağılımla", "With the right distribution"), t("Kuyruklar normalden kalın: çarpanı veriden öğrenmek gerekir.", "The tails are fatter than normal: the multiplier must be learned from data.")],
      [1, "🔒", t("Dürüstçe", "Honestly"), t("Çarpan yalnızca eğitimden; sınama yalnızca testte.", "The multiplier from training only; testing on the test only.")]
    ]))}
${sec(4, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Az aşımı başarı saymak", "Counting few exceedances as success"), t("Gereksiz sermaye bağlar ve kriz anında yine de yetersiz kalabilir.", "It ties up capital needlessly and may still fall short in a crisis."), t("Hem orana hem zamana yayılıma bak.", "Look at both the rate and the spread over time.")],
      [t("Çarpanı bütün veriden öğrenmek", "Learning the multiplier from all the data"), t("Test bilgisi sızar; aşım oranı yapay olarak %1'e oturur.", "Test information leaks; the exceedance rate artificially lands on 1%."), t("Yalnızca eğitim dönemi.", "Training period only.")],
      [t("VaR'ı en kötü senaryo sanmak", "Treating VaR as the worst case"), t("Aşım günlerinde kaybın büyüklüğünü söylemez.", "It does not say how big the loss is on exceedance days."), t("Beklenen açık (expected shortfall) gibi ek ölçüler.", "Additional measures such as expected shortfall.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("VaR = çarpan × volatilite tahmini.", "VaR = multiplier × volatility forecast."), t("Değişen volatilite zamanlamayı, veriden öğrenilen çarpan kuyruğu düzeltir.", "Time-varying volatility fixes the timing, a multiplier learned from data fixes the tail."), t("İyi bir VaR'ın aşımları yaklaşık %1 ve zamana dengeli dağılır.", "A good VaR's exceedances are about 1% and spread evenly over time.")])}`);
  };

  const C = {};
  Object.keys(B).forEach((id) => { C[id] = { tr: B[id]("tr"), en: B[id]("en") }; });
  K.apply(U, C, 10);
  K.prepend(U, "m6-u9", F, "u9_flow", { tr: "<b>Şekil 1.</b> Atölyenin akışı.", en: "<b>Figure 1.</b> The workshop's flow." });
})();
