/* Modül 6 — Finansal zaman serileri · Üniteler 6–9
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 * "Örnek YZ yanıtları" öğretim amacıyla hazırlanmıştır.
 */
(function () {
  "use strict";
  const D = window.M6_DATA, U = window.M6_UNITS, ln = D.line;
  const T = { tr: D.FX.tr + D.TAB.tr, en: D.FX.en + D.TAB.en };
  const PK = ["numpy", "pandas", "scikit-learn"];
  const FILES = D.FILES;
  const C0 = { tr: "", en: "" };

  /* =================================================================== */
  /* Ünite 6 — Volatilite öngörülebilir                                     */
  /* =================================================================== */
  U.push({
    id: "m6-u6", minutes: 25, packages: PK, data: FILES,
    title: { tr: "Volatilite öngörülebilir", en: "Volatility is predictable" },
    blurb: { tr: "Getirinin yönünü öngöremeyiz ama büyüklüğünü öngörebiliriz. Son 5, 20 ve 60 günün volatilitesiyle kurulan basit bir doğrusal model, gelecek 20 günün volatilitesinin yaklaşık %40'ını açıklıyor.", en: "We cannot forecast the direction of returns, but we can forecast their size. A simple linear model built on the volatility of the last 5, 20 and 60 days explains about 40% of the next 20 days' volatility." },
    terms: [{ tr: "gerçekleşen volatilite", en: "realised volatility" }, { tr: "HAR modeli", en: "HAR model" }, { tr: "saf (naif) tahmin", en: "naive forecast" }],
    concept: C0,
    playground: { type: "volForecast", intro: { tr: "Gelecek 20 günün volatilitesini öngörmek için hangi geçmiş pencereleri kullanacağını seç; test dönemindeki tahmin ile gerçekleşeni karşılaştır.", en: "Choose which past windows to use to forecast the next 20 days' volatility; compare the forecast with the realised value in the test period." }, takeaway: { tr: "Kısa, orta ve uzun pencereleri birlikte kullanmak, tek bir pencereden daha iyi öngörür: volatilitenin hem hızlı hem yavaş bileşeni vardır.", en: "Using short, medium and long windows together forecasts better than any single window: volatility has both a fast and a slow component." } },
    cells: [
      {
        id: "m6-u6-c1", kind: "run",
        task: { tr: "Gelecek 20 günün volatilitesini (<code>y_v</code>) 2015 sonrası test döneminde beş yolla öngörüyoruz: eğitim ortalaması, son 20 günün volatilitesi, son 60 günün volatilitesi, üç pencereyle doğrusal model (HAR) ve rassal orman. Önce tahmin et.", en: "We forecast the next 20 days' volatility (<code>y_v</code>) in the post-2015 test period in five ways: the training mean, the last 20 days' volatility, the last 60 days' volatility, a linear model with the three windows (HAR) and a random forest. Predict first." },
        predict: { q: { tr: "Hangisi en iyi sonucu verir?", en: "Which gives the best result?" }, options: { tr: ["Rassal orman", "Üç pencereli doğrusal model", "Eğitim ortalaması"], en: ["Random forest", "The three-window linear model", "The training mean"] }, answer: 1, explain: { tr: "İlişki büyük ölçüde doğrusal ve kalıcı; orman ise eğitim dönemindeki volatilite düzeylerine (2008 gibi) takılır ve daha sakin test döneminde iyi genelleyemez.", en: "The relationship is largely linear and persistent; the forest gets stuck on the volatility levels of the training period (such as 2008) and does not generalise well to the calmer test period." } },
        code: { tr: T.tr + `\nV = ["v5", "v20", "v60"]\ny_e, y_t = tablo.loc[egt, "y_v"], tablo.loc[tst, "y_v"]\nhar = LinearRegression().fit(tablo.loc[egt, V], y_e)\norman = RandomForestRegressor(n_estimators=200, min_samples_leaf=20, random_state=0).fit(tablo.loc[egt, V], y_e)\nfor ad, tahmin in [("eğitim ortalaması", np.full(len(y_t), y_e.mean())), ("son 20 gün (v20)", tablo.loc[tst, "v20"]),\n                   ("son 60 gün (v60)", tablo.loc[tst, "v60"]), ("doğrusal (HAR)", har.predict(tablo.loc[tst, V])), ("rassal orman", orman.predict(tablo.loc[tst, V]))]:\n    print(f"{ad:18s}: test R² {r2_score(y_t, tahmin):.3f}")`, en: T.en + `\nV = ["v5", "v20", "v60"]\ny_a, y_b = table.loc[trn, "y_v"], table.loc[tst, "y_v"]\nhar = LinearRegression().fit(table.loc[trn, V], y_a)\nforest = RandomForestRegressor(n_estimators=200, min_samples_leaf=20, random_state=0).fit(table.loc[trn, V], y_a)\nfor name, pred in [("training mean", np.full(len(y_b), y_a.mean())), ("last 20 days (v20)", table.loc[tst, "v20"]),\n                   ("last 60 days (v60)", table.loc[tst, "v60"]), ("linear (HAR)", har.predict(table.loc[tst, V])), ("random forest", forest.predict(table.loc[tst, V]))]:\n    print(f"{name:18s}: test R² {r2_score(y_b, pred):.3f}")` },
        after: { tr: "Eğitim ortalaması −0,71 (test dönemi eğitimden sakin: ortalama çok yüksek kalıyor), v20 0,23, v60 0,34, HAR 0,39, orman 0,29. Getiride sıfır olan örneklem dışı R², volatilitede 0,39. Bu modelin adı, Corsi'nin (2009) HAR modelinden gelir: farklı ufuklardaki yatırımcıların (günlük, haftalık, aylık) volatiliteye farklı tepki verdiği fikri.", en: "Training mean −0.71 (the test period is calmer than training: the mean stays far too high), v20 0.23, v60 0.34, HAR 0.39, forest 0.29. The out-of-sample R² that was zero for returns is 0.39 for volatility. The model's name comes from Corsi's (2009) HAR model: the idea that investors at different horizons (daily, weekly, monthly) react differently to volatility." }
      },
      {
        id: "m6-u6-c2", kind: "run",
        task: { tr: "HAR modelinin katsayılarına bakıyoruz: gelecek ayın volatilitesini en çok hangi geçmiş pencere belirliyor? Önce tahmin et.", en: "We look at the HAR model's coefficients: which past window drives next month's volatility most? Predict first." },
        predict: { q: { tr: "En büyük katsayı hangi pencerenin?", en: "Which window has the largest coefficient?" }, options: { tr: ["Son 5 gün", "Son 20 gün", "Son 60 gün"], en: ["The last 5 days", "The last 20 days", "The last 60 days"] }, answer: 2, explain: { tr: "Volatilitenin kalıcı, yavaş değişen bir bileşeni var; en uzun pencere bu bileşeni en iyi yakalıyor.", en: "Volatility has a persistent, slowly changing component; the longest window captures it best." } },
        code: { tr: T.tr + `\nV = ["v5", "v20", "v60"]\nhar = LinearRegression().fit(tablo.loc[egt, V], tablo.loc[egt, "y_v"])\nprint("sabit:", round(har.intercept_, 3))\nfor ad, b in zip(V, har.coef_):\n    print(f"{ad}: {b:.3f}")\nprint("katsayıların toplamı:", round(har.coef_.sum(), 3))`, en: T.en + `\nV = ["v5", "v20", "v60"]\nhar = LinearRegression().fit(table.loc[trn, V], table.loc[trn, "y_v"])\nprint("constant:", round(har.intercept_, 3))\nfor name, b in zip(V, har.coef_):\n    print(f"{name}: {b:.3f}")\nprint("sum of coefficients:", round(har.coef_.sum(), 3))` },
        after: { tr: "v5 0,02, v20 0,36, v60 0,43; sabit 0,11. Katsayıların toplamı 1'den küçük (0,81): yüksek volatilite zamanla ortalamaya döner, düşük volatilite yükselir. Model hem kalıcılığı hem ortalamaya dönüşü yakalıyor. Euro/dolarda son 5 günün katkısı küçük; daha oynak varlıklarda (hisse senetleri) genellikle daha büyüktür.", en: "v5 0.02, v20 0.36, v60 0.43; constant 0.11. The coefficients sum to less than 1 (0.81): high volatility reverts to the mean over time, low volatility rises. The model captures both persistence and mean reversion. For euro/dollar the last 5 days contribute little; for more volatile assets (stocks) the contribution is usually larger." }
      },
      {
        id: "m6-u6-c3", kind: "fill",
        task: { tr: "Volatilite öngörüsünün gerçek bir kullanımı: gelecek ayın volatilitesi yüksek bekleniyorsa pozisyonu küçült. HAR tahminiyle test dönemindeki tahmin ile gerçekleşen arasındaki korelasyonu hesapla.", en: "A real use of volatility forecasts: if next month's volatility is expected to be high, cut the position. Compute the correlation between the HAR forecast and the realised value in the test period." },
        code: { tr: T.tr + `\nV = ["v5", "v20", "v60"]\nhar = LinearRegression().fit(tablo.loc[egt, V], tablo.loc[egt, "y_v"])\ntahmin = pd.Series(har.predict(tablo.loc[tst, V]), index=tablo.index[tst])\nkor = np.corrcoef(tahmin, tablo.loc[tst, "___"])[0, 1]\nprint("Tahmin–gerçekleşen korelasyonu:", round(kor, 3))`, en: T.en + `\nV = ["v5", "v20", "v60"]\nhar = LinearRegression().fit(table.loc[trn, V], table.loc[trn, "y_v"])\npred = pd.Series(har.predict(table.loc[tst, V]), index=table.index[tst])\ncorr = np.corrcoef(pred, table.loc[tst, "___"])[0, 1]\nprint("Forecast–realised correlation:", round(corr, 3))` },
        solution: { tr: T.tr + `\nV = ["v5", "v20", "v60"]\nhar = LinearRegression().fit(tablo.loc[egt, V], tablo.loc[egt, "y_v"])\ntahmin = pd.Series(har.predict(tablo.loc[tst, V]), index=tablo.index[tst])\nkor = np.corrcoef(tahmin, tablo.loc[tst, "y_v"])[0, 1]\nprint("Tahmin–gerçekleşen korelasyonu:", round(kor, 3))`, en: T.en + `\nV = ["v5", "v20", "v60"]\nhar = LinearRegression().fit(table.loc[trn, V], table.loc[trn, "y_v"])\npred = pd.Series(har.predict(table.loc[tst, V]), index=table.index[tst])\ncorr = np.corrcoef(pred, table.loc[tst, "y_v"])[0, 1]\nprint("Forecast–realised correlation:", round(corr, 3))` },
        hints: [{ tr: "Gerçekleşen değer hedef sütunudur: <code>\"y_v\"</code>.", en: "The realised value is the target column: <code>\"y_v\"</code>." }],
        checks: [{ py: { tr: "abs(kor - np.corrcoef(tahmin, tablo.loc[tst, 'y_v'])[0, 1]) < 1e-12", en: "abs(corr - np.corrcoef(pred, table.loc[tst, 'y_v'])[0, 1]) < 1e-12" }, msg: { tr: "Korelasyon, tahmin ile <code>y_v</code> arasında hesaplanmalı.", en: "The correlation should be between the forecast and <code>y_v</code>." } }],
        after: { tr: "Korelasyon 0,6'nın üzerinde. Volatilite öngörüleri risk yönetiminin temelidir: portföy ağırlıkları, opsiyon fiyatları ve Ünite 8'deki riske maruz değer bu öngörülere dayanır.", en: "The correlation is above 0.6. Volatility forecasts are the basis of risk management: portfolio weights, option prices and Unit 8's value at risk all rest on them." }
      },
      {
        id: "m6-u6-c4", kind: "interpret",
        task: { tr: "YZ getiri ve volatilite sonuçlarını karşılaştırdı. Hangi cümleler yanlış?", en: "The AI compared the return and volatility results. Which sentences are wrong?" },
        prompt: { tr: "Getiri için örneklem dışı R² ≈ 0, volatilite için 0,39. Bu çelişki mi?", en: "The out-of-sample R² is ≈ 0 for returns and 0.39 for volatility. Is this a contradiction?" },
        sentences: {
          tr: ["Çelişki değil: piyasa yönü fiyatlamış olabilir ama riskin ne kadar büyük olacağı geçmişten öngörülebilir.", "Volatiliteyi öngörebildiğimize göre kurun yönünü de öngörebiliriz.", "Rassal orman burada doğrusal modelden kötü; çünkü test dönemi eğitim döneminden daha sakin ve orman eğitim düzeylerinin dışına çıkamıyor.", "Eğitim ortalamasının çok kötü olması, volatilite düzeyinin zaman içinde değiştiğini gösteriyor."],
          en: ["It is not a contradiction: the market may have priced the direction, but how big the risk will be is predictable from the past.", "Since we can forecast volatility, we can also forecast the direction of the rate.", "The random forest is worse than the linear model here because the test period is calmer than training and the forest cannot go beyond training levels.", "The training mean doing very badly shows that the level of volatility changes over time."]
        },
        bad: [1],
        explain: {
          tr: ["Doğru.", "<b>Yanlış:</b> büyüklük ile yön farklı şeylerdir. Yüksek volatilite büyük bir hareketin geleceğini söyler, yönünü söylemez.", "Doğru: ağaçlar eğitimde görmedikleri düzeylere uzanamaz; yapı değişince bu önemli bir sınırlamadır.", "Doğru."],
          en: ["Correct.", "<b>Wrong:</b> size and direction are different things. High volatility says a big move is coming, not which way.", "Correct: trees cannot extend beyond levels they did not see in training; when the structure changes this is an important limitation.", "Correct."]
        }
      }
    ],
    quiz: [
      { q: { tr: "HAR modelinin özellikleri nelerdir?", en: "What are the HAR model's features?" }, options: { tr: ["Farklı uzunluktaki geçmiş pencerelerin volatilitesi", "Geçmiş getirilerin işaretleri", "Takvim günleri"], en: ["The volatility of past windows of different lengths", "The signs of past returns", "Calendar days"] }, answer: 0, explain: { tr: "Burada 5, 20 ve 60 gün.", en: "Here 5, 20 and 60 days." } },
      { q: { tr: "Katsayıların toplamının 1'den küçük olması ne anlama gelir?", en: "What does the coefficients summing to less than 1 mean?" }, options: { tr: ["Volatilite ortalamaya döner", "Volatilite sonsuza dek büyür", "Model yanlıştır"], en: ["Volatility reverts to the mean", "Volatility grows forever", "The model is wrong"] }, answer: 0, explain: { tr: "Yüksek volatilite zamanla azalır.", en: "High volatility declines over time." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 7 — Al-sat kuralları ve veri madenciliği tuzağı                  */
  /* =================================================================== */
  const SH = { tr: `\nsharpe = lambda g: g.mean() / g.std() * np.sqrt(252)            # yıllık Sharpe oranı`, en: `\nsharpe = lambda g: g.mean() / g.std() * np.sqrt(252)            # annual Sharpe ratio` };
  const U7A = { tr: T.tr + SH.tr + `\nkonum = np.sign(tablo["mom20"])                    # son 20 günde yükseldiyse euro al (+1), düştüyse sat (−1)\ngetiri = konum * tablo["r"]                          # stratejinin günlük getirisi\nprint(f"Test dönemi Sharpe oranı: {sharpe(getiri[tst]):.2f}")`, en: T.en + SH.en + `\nposition = np.sign(table["mom20"])                 # buy euros (+1) if up over the last 20 days, sell (−1) if down\nret = position * table["r"]                          # the strategy's daily return\nprint(f"Test-period Sharpe ratio: {sharpe(ret[tst]):.2f}")` };
  U.push({
    id: "m6-u7", minutes: 30, packages: PK, data: FILES,
    title: { tr: "Al-sat kuralları ve veri madenciliği tuzağı", en: "Trading rules and the data-mining trap" },
    blurb: { tr: "Eğitim döneminde parlayan bir momentum kuralı test döneminde para kaybettiriyor. Yeterince çok kural denersen yazı turayla bile “başarılı” bir strateji bulursun.", en: "A momentum rule that shines in the training period loses money in the test period. Try enough rules and you will find a “successful” strategy even with coin tosses." },
    terms: [{ tr: "geriye dönük test (backtest)", en: "backtest" }, { tr: "Sharpe oranı", en: "Sharpe ratio" }, { tr: "veri madenciliği (data snooping)", en: "data snooping" }, { tr: "işlem maliyeti", en: "transaction cost" }],
    concept: C0,
    playground: { type: "snooping", intro: { tr: "Yazı turayla belirlenen al-sat kurallarından istediğin kadarını eğitim döneminde dene; en iyisini seç ve test dönemindeki performansına bak.", en: "Try as many coin-toss trading rules as you like in the training period; pick the best and look at its performance in the test period." }, takeaway: { tr: "Denenen kural sayısı arttıkça en iyinin eğitim performansı yükselir, test performansı ise sıfır civarında kalır: seçim şansı ölçer, beceriyi değil.", en: "As the number of rules tried grows, the best one's training performance rises while its test performance stays around zero: the selection measures luck, not skill." } },
    cells: [
      {
        id: "m6-u7-c1", kind: "run",
        task: { tr: "Klasik bir momentum kuralı: son 20 günde euro yükseldiyse yarın için euro al, düştüyse sat. Kuralı eğitim ve test dönemlerinde, işlem maliyetiyle ve maliyetsiz deniyoruz. Sharpe oranı: yıllık ortalama getiri / yıllık oynaklık. Önce tahmin et.", en: "A classic momentum rule: if the euro rose over the last 20 days, buy euros for tomorrow; if it fell, sell. We try the rule in the training and test periods, with and without transaction costs. Sharpe ratio: annual mean return / annual volatility. Predict first." },
        predict: { q: { tr: "Eğitimde Sharpe 0,5 civarında olan kural testte ne yapar?", en: "What does the rule with a training Sharpe of about 0.5 do in the test?" }, options: { tr: ["Aynı başarıyı sürdürür", "Daha da iyileşir", "Negatife döner"], en: ["Keeps the same success", "Improves further", "Turns negative"] }, answer: 2, explain: { tr: "Eğitim dönemindeki eğilimler (örneğin 2000'lerin uzun euro yükselişi) tekrar etmek zorunda değil.", en: "The training period's trends (e.g. the euro's long rise in the 2000s) do not have to repeat." } },
        code: { tr: T.tr + SH.tr + `\nkonum = np.sign(tablo["mom20"])\ngetiri = konum * tablo["y_r"]                        # bugünkü karar, yarının getirisi\nislem = konum.diff().abs().fillna(0) / 2             # konum değişince bir işlem (al→sat iki işlem sayılır)\nnet = getiri - islem * 2 * 0.01                      # işlem başına %0,01 maliyet\nprint(f"Yılda ortalama {islem.sum() / (len(tablo) / 252):.0f} işlem")\nprint(f"Eğitim (1999–2014) Sharpe: {sharpe(getiri[egt]):.2f}")\nprint(f"Test (2015– )      Sharpe: {sharpe(getiri[tst]):.2f}   maliyetle: {sharpe(net[tst]):.2f}")`, en: T.en + SH.en + `\nposition = np.sign(table["mom20"])\nret = position * table["y_r"]                        # today's decision, tomorrow's return\ntrades = position.diff().abs().fillna(0) / 2         # one trade when the position changes (buy→sell counts as two)\nnet = ret - trades * 2 * 0.01                        # cost of 0.01% per trade\nprint(f"On average {trades.sum() / (len(table) / 252):.0f} trades a year")\nprint(f"Training (1999–2014) Sharpe: {sharpe(ret[trn]):.2f}")\nprint(f"Test (2015– )        Sharpe: {sharpe(ret[tst]):.2f}   with costs: {sharpe(net[tst]):.2f}")` },
        after: { tr: "Yılda yaklaşık 23 işlem. Eğitimde Sharpe 0,52, testte −0,23, maliyetle −0,29. Eğitimde işe yarayan kural, euronun uzun eğilimlerinin yaşandığı bir döneme uyuyordu. Test dönemi başka bir rejimdi. Maliyetler de küçük kazançları kolayca siler.", en: "About 23 trades a year. Training Sharpe 0.52, test −0.23, with costs −0.29. The rule that worked in training fitted a period with long euro trends. The test period was a different regime. Costs also easily erase small gains." }
      },
      {
        id: "m6-u7-c2", kind: "run",
        task: { tr: "Her gün yazı turayla al ya da sat diyen 200 “strateji” üretiyoruz. Eğitim döneminde en yüksek Sharpe'ı alanı seçip test dönemine bakıyoruz. Önce tahmin et.", en: "We generate 200 “strategies” that say buy or sell each day by tossing a coin. We pick the one with the highest training Sharpe and look at the test period. Predict first." },
        predict: { q: { tr: "Yazı turayla seçilen en iyi stratejinin eğitim Sharpe'ı ne olur?", en: "What is the training Sharpe of the best coin-toss strategy?" }, options: { tr: ["0 civarı", "0,8 civarı: “iyi” bir fon gibi", "5'in üzerinde"], en: ["About 0", "About 0.8: like a “good” fund", "Above 5"] }, answer: 1, explain: { tr: "200 rastgele denemenin en iyisi, şans eseri yüksek görünür. Hiçbir becerisi yoktur.", en: "The best of 200 random tries looks high by chance. It has no skill at all." } },
        code: { tr: T.tr + SH.tr + `\nsonuc = []\nfor k in range(200):\n    konum = pd.Series(np.random.default_rng(k).choice([1, -1], len(tablo)), index=tablo.index)   # yazı tura\n    g = konum * tablo["y_r"]\n    sonuc.append((sharpe(g[egt]), sharpe(g[tst])))\nsonuc = np.array(sonuc)\nen_iyi = sonuc[:, 0].argmax()\nprint(f"Eğitimde Sharpe > 0,5 olan strateji sayısı: {(sonuc[:, 0] > 0.5).sum()} / 200")\nprint(f"En iyi strateji: eğitim Sharpe {sonuc[en_iyi, 0]:.2f} → test Sharpe {sonuc[en_iyi, 1]:.2f}")\nprint(f"Eğitim ve test Sharpe'ları arasındaki korelasyon: {np.corrcoef(sonuc.T)[0, 1]:.2f}")`, en: T.en + SH.en + `\nresult = []\nfor k in range(200):\n    position = pd.Series(np.random.default_rng(k).choice([1, -1], len(table)), index=table.index)   # coin toss\n    g = position * table["y_r"]\n    result.append((sharpe(g[trn]), sharpe(g[tst])))\nresult = np.array(result)\nbest = result[:, 0].argmax()\nprint(f"Strategies with training Sharpe > 0.5: {(result[:, 0] > 0.5).sum()} / 200")\nprint(f"Best strategy: training Sharpe {result[best, 0]:.2f} → test Sharpe {result[best, 1]:.2f}")\nprint(f"Correlation between training and test Sharpe: {np.corrcoef(result.T)[0, 1]:.2f}")` },
        after: { tr: "En iyi yazı tura stratejisinin eğitim Sharpe'ı 0,81: momentum kuralından bile “iyi”. Testte −0,02. Eğitim ve test performansı arasında ilişki yok. Bu, veri madenciliği (data snooping) tuzağıdır: çok sayıda kural denenip en iyisi raporlanırsa, raporlanan başarı büyük ölçüde şanstır. Çözüm: denenen kuralların sayısını raporlamak ve test verisini yalnızca bir kez kullanmak.", en: "The best coin-toss strategy's training Sharpe is 0.81: “better” than the momentum rule. In the test it gets −0.02. There is no relationship between training and test performance. This is the data-snooping trap: if many rules are tried and the best is reported, the reported success is largely luck. The remedy: report how many rules were tried and use the test data only once." }
      },
      {
        id: "m6-u7-c3", kind: "audit",
        task: { tr: "YZ momentum kuralının geriye dönük testini yaptı ve olağanüstü bir sonuç buldu. Hatalı satırı bul ve düzelt: bugün verilen kararın getirisi yarının getirisi (<code>y_r</code>) olmalı.", en: "The AI backtested the momentum rule and found an extraordinary result. Find the faulty line and fix it: the return of today's decision should be tomorrow's return (<code>y_r</code>)." },
        ai: {
          prompt: { tr: "20 günlük momentum kuralını 2015 sonrasında test et ve Sharpe oranını raporla.", en: "Test the 20-day momentum rule after 2015 and report the Sharpe ratio." },
          reply: { tr: "Kuralı günlük getirilere uygulayalım:", en: "Let us apply the rule to the daily returns:" },
          code: U7A,
          claim: { tr: "Sharpe 2,5: dünyanın en iyi fonlarından daha iyi bir kural buldum.", en: "Sharpe 2.5: I found a rule better than the world's best funds." }
        },
        bugLines: [ln(U7A.tr, "getiri = konum")],
        lineExplain: { tr: "Konum bugünkü getiriyi de içeren 20 günlük toplamla belirleniyor ve aynı günün getirisine uygulanıyor: karar, sonucunu bildikten sonra veriliyor. Gerçekte bugünün kapanışında verilen karar ancak yarının getirisini kazanabilir: <code>tablo[\"y_r\"]</code>.", en: "The position is set by the 20-day sum, which includes today's return, and applied to that same day's return: the decision is made after knowing its outcome. In reality a decision made at today's close can only earn tomorrow's return: <code>table[\"y_r\"]</code>." },
        hints: [{ tr: "<code>getiri = konum * tablo[\"y_r\"]</code>", en: "<code>ret = position * table[\"y_r\"]</code>" }],
        solution: { tr: U7A.tr.replace(`getiri = konum * tablo["r"]  `, `getiri = konum * tablo["y_r"]`), en: U7A.en.replace(`ret = position * table["r"]  `, `ret = position * table["y_r"]`) },
        checks: [{ py: { tr: "np.allclose(getiri.values, (konum * tablo['y_r']).values)", en: "np.allclose(ret.values, (position * table['y_r']).values)" }, msg: { tr: "Stratejinin getirisi, konum × yarının getirisi (<code>y_r</code>) olmalı.", en: "The strategy's return should be position × tomorrow's return (<code>y_r</code>)." } }],
        after: { tr: "Düzeltilince Sharpe 2,54'ten −0,23'e düşüyor. Tek bir günlük kayma, kaybettiren bir kuralı efsanevi bir fon gibi gösteriyordu. Geriye dönük testte her işlemin, karar anında bilinen bilgiyle ve ondan sonraki getiriyle hesaplandığını satır satır kontrol et.", en: "Once fixed, the Sharpe falls from 2.54 to −0.23. A single day's shift made a losing rule look like a legendary fund. In a backtest, check line by line that every trade is computed with the information known at the decision point and the return that comes after it." }
      },
      {
        id: "m6-u7-c4", kind: "interpret",
        task: { tr: "YZ bir yatırım bültenine “kanıtlanmış strateji” yazısı hazırladı. Hangi cümleler yanlış?", en: "The AI prepared a “proven strategy” piece for an investment newsletter. Which sentences are wrong?" },
        prompt: { tr: "200 kural denedim, en iyisinin 1999–2014 Sharpe'ı 0,81. Bir paragraf yazar mısın?", en: "I tried 200 rules; the best one's 1999–2014 Sharpe is 0.81. Can you write a paragraph?" },
        sentences: {
          tr: ["Bu kural 16 yıllık veride test edildi; gelecekte de aynı başarıyı göstermesi beklenir.", "Kaç kural denendiği raporlanmadan tek bir kuralın başarısı değerlendirilemez.", "Kuralı seçmek için kullanılmamış bir dönemde (test) yeniden sınamak gerekir.", "İşlem maliyetleri ve uygulama gecikmeleri hesaba katılmadan Sharpe oranı iyimserdir."],
          en: ["This rule was tested on 16 years of data; it is expected to show the same success in future.", "A single rule's success cannot be judged without reporting how many rules were tried.", "It must be retested on a period not used for choosing the rule (the test).", "Without transaction costs and execution delays the Sharpe ratio is optimistic."]
        },
        bad: [0],
        explain: {
          tr: ["<b>Yanlış:</b> 16 yıllık veri, kuralı seçmek için kullanıldı. Bu bir sınama değil, seçimdir; 200 yazı tura kuralının en iyisi de 0,81 alıyor ve testte −0,02.", "Doğru.", "Doğru.", "Doğru."],
          en: ["<b>Wrong:</b> the 16 years of data were used to choose the rule. That is selection, not testing; the best of 200 coin-toss rules also gets 0.81 and −0.02 in the test.", "Correct.", "Correct.", "Correct."]
        }
      }
    ],
    quiz: [
      { q: { tr: "Veri madenciliği (data snooping) tuzağı nedir?", en: "What is the data-snooping trap?" }, options: { tr: ["Çok sayıda kural deneyip en iyisini raporlamak; başarı şanstan gelir", "Çok fazla veri kullanmak", "Veriyi temizlememek"], en: ["Trying many rules and reporting the best; the success comes from luck", "Using too much data", "Not cleaning the data"] }, answer: 0, explain: { tr: "200 yazı tura örneği.", en: "The 200 coin-toss example." } },
      { q: { tr: "Bugünün kapanışında verilen bir karar hangi getiriyi kazanır?", en: "Which return does a decision made at today's close earn?" }, options: { tr: ["Yarının getirisini", "Bugünün getirisini", "Dünün getirisini"], en: ["Tomorrow's return", "Today's return", "Yesterday's return"] }, answer: 0, explain: { tr: "Aksi ileriye bakma yanlılığıdır.", en: "Otherwise it is look-ahead bias." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 8 — Uygulama: riske maruz değer (VaR)                           */
  /* =================================================================== */
  U.push({
    id: "m6-u8", minutes: 35, packages: PK, data: FILES,
    title: { tr: "Uygulama: riske maruz değer (VaR)", en: "Application: value at risk (VaR)" },
    blurb: { tr: "Bankaların günlük risk ölçüsü: “%99 olasılıkla yarın bundan fazla kaybetmeyiz.” Sabit volatiliteyle, değişen volatiliteyle ve kalın kuyruk düzeltmesiyle VaR'ı kurup 2015 sonrasında sınamak.", en: "Banks' daily risk measure: “with 99% probability we will not lose more than this tomorrow.” Building VaR with constant volatility, time-varying volatility and a fat-tail correction, and testing it after 2015." },
    terms: [{ tr: "riske maruz değer (VaR)", en: "value at risk (VaR)" }, { tr: "aşım", en: "exceedance" }, { tr: "geriye dönük sınama", en: "backtesting" }],
    concept: C0, playground: null,
    cells: [
      {
        id: "m6-u8-c1", kind: "run",
        task: { tr: "%1 VaR: yarının getirisinin %1 olasılıkla altına düşeceği eşik. Normal dağılımla VaR = −2,33 × σ. Önce σ'yı sabit alıyoruz (1999–2014'ün standart sapması) ve 2015 sonrasında aşımları (getirinin VaR'ın altına düştüğü günleri) sayıyoruz. Önce tahmin et.", en: "1% VaR: the threshold tomorrow's return falls below with 1% probability. With the normal distribution VaR = −2.33 × σ. First we take σ as constant (the 1999–2014 standard deviation) and count the exceedances (days the return falls below VaR) after 2015. Predict first." },
        predict: { q: { tr: "Aşımlar zaman içinde nasıl dağılır?", en: "How are the exceedances spread over time?" }, options: { tr: ["Her yıla eşit dağılır (yaklaşık %1)", "Çalkantılı yıllarda yığılır, sakin yıllarda hiç yoktur", "Hiç aşım olmaz"], en: ["Evenly across years (about 1%)", "They pile up in turbulent years and vanish in calm ones", "There are no exceedances"] }, answer: 1, explain: { tr: "Sabit bir σ, volatilitenin yüksek olduğu dönemlerde riski küçümser, sakin dönemlerde abartır.", en: "A constant σ understates risk when volatility is high and overstates it when calm." } },
        code: { tr: T.tr + `\nz = -2.326                                                # standart normalin %1 yüzdeliği\nsigma = r[r.index < "2015-01-01"].std()\nvar_sabit = z * sigma\nasim = tablo["y_r"] < var_sabit\nprint(f"Sabit VaR: {var_sabit:.2f}%  |  test dönemi aşım oranı %{100 * asim[tst].mean():.2f} ({asim[tst].sum()} gün, beklenen %1)")\nprint((100 * asim[tst].groupby(tablo.index[tst].year).mean()).round(1).to_string())`, en: T.en + `\nz = -2.326                                                # the standard normal's 1% quantile\nsigma = r[r.index < "2015-01-01"].std()\nvar_const = z * sigma\nexc = table["y_r"] < var_const\nprint(f"Constant VaR: {var_const:.2f}%  |  test-period exceedance rate {100 * exc[tst].mean():.2f}% ({exc[tst].sum()} days, 1% expected)")\nprint((100 * exc[tst].groupby(table.index[tst].year).mean()).round(1).to_string())` },
        after: { tr: "Genel aşım oranı %0,58: ilk bakışta temkinli. Ama yıllara bakınca: 2015'te %2,4, 2017–2019'da sıfır. Sabit VaR çalkantılı dönemde kayıpları kaçırıyor, sakin dönemde gereksiz yere çok sermaye bağlıyor. Ortalama doğruluk, riskin doğru zamanda ölçüldüğü anlamına gelmez.", en: "The overall exceedance rate is 0.58%: cautious at first sight. But by year: 2.4% in 2015, zero in 2017–2019. Constant VaR misses losses in the turbulent period and ties up too much capital needlessly in the calm period. Being right on average does not mean risk is measured at the right time." }
      },
      {
        id: "m6-u8-c2", kind: "run",
        task: { tr: "Şimdi σ'yı her gün güncelliyoruz: son 20 günün volatilitesi (<code>v20</code>). Önce tahmin et.", en: "Now we update σ every day: the last 20 days' volatility (<code>v20</code>). Predict first." },
        predict: { q: { tr: "Değişen volatiliteyle (normal dağılım varsayımı korunarak) aşım oranı ne olur?", en: "With time-varying volatility (keeping the normal assumption), what is the exceedance rate?" }, options: { tr: ["Tam %1", "%1'in belirgin biçimde üstünde", "Sıfır"], en: ["Exactly 1%", "Clearly above 1%", "Zero"] }, answer: 1, explain: { tr: "Volatilite artık doğru zamanda ölçülüyor, ama normal dağılım kuyrukları hâlâ fazla ince (Ünite 2).", en: "Volatility is now measured at the right time, but the normal distribution's tails are still too thin (Unit 2)." } },
        code: { tr: T.tr + `\nz = -2.326\nvar_v20 = z * tablo["v20"]\nasim = tablo["y_r"] < var_v20\nprint(f"Test dönemi aşım oranı %{100 * asim[tst].mean():.2f} ({asim[tst].sum()} gün)")\nprint((100 * asim[tst].groupby(tablo.index[tst].year).mean()).round(1).to_string())`, en: T.en + `\nz = -2.326\nvar_v20 = z * table["v20"]\nexc = table["y_r"] < var_v20\nprint(f"Test-period exceedance rate {100 * exc[tst].mean():.2f}% ({exc[tst].sum()} days)")\nprint((100 * exc[tst].groupby(table.index[tst].year).mean()).round(1).to_string())` },
        after: { tr: "Aşım oranı %2,17: beklenenin iki katı. Aşımlar artık yıllara daha dengeli dağılıyor (volatilite doğru zamanda ölçülüyor), ama düzey yanlış: normal dağılım, volatiliteye göre ölçeklenmiş getirilerin bile kuyruklarını küçümsüyor.", en: "The exceedance rate is 2.17%: twice the expected level. Exceedances are now spread more evenly across years (volatility is measured at the right time), but the level is wrong: the normal distribution understates the tails even of volatility-scaled returns." }
      },
      {
        id: "m6-u8-c3", kind: "fill",
        task: { tr: "Kalın kuyruk düzeltmesi: −2,33 yerine çarpanı eğitim verisinden öğren. Eğitim döneminde getirinin volatiliteye oranının (<code>y_r / v20</code>) %1 yüzdeliğini hesapla ve VaR'da kullan.", en: "Fat-tail correction: learn the multiplier from the training data instead of −2.33. Compute the 1% quantile of the return-to-volatility ratio (<code>y_r / v20</code>) in the training period and use it in VaR." },
        code: { tr: T.tr + `\noran = tablo["y_r"] / tablo["v20"]\nq = np.quantile(oran[egt], ___)\nasim = tablo["y_r"] < q * tablo["v20"]\nprint(f"Eğitimden öğrenilen çarpan: {q:.2f} (normal: −2,33)")\nprint(f"Test dönemi aşım oranı %{100 * asim[tst].mean():.2f} ({asim[tst].sum()} gün)")`, en: T.en + `\nratio = table["y_r"] / table["v20"]\nq = np.quantile(ratio[trn], ___)\nexc = table["y_r"] < q * table["v20"]\nprint(f"Multiplier learned from training: {q:.2f} (normal: −2.33)")\nprint(f"Test-period exceedance rate {100 * exc[tst].mean():.2f}% ({exc[tst].sum()} days)")` },
        solution: { tr: T.tr + `\noran = tablo["y_r"] / tablo["v20"]\nq = np.quantile(oran[egt], 0.01)\nasim = tablo["y_r"] < q * tablo["v20"]\nprint(f"Eğitimden öğrenilen çarpan: {q:.2f} (normal: −2,33)")\nprint(f"Test dönemi aşım oranı %{100 * asim[tst].mean():.2f} ({asim[tst].sum()} gün)")`, en: T.en + `\nratio = table["y_r"] / table["v20"]\nq = np.quantile(ratio[trn], 0.01)\nexc = table["y_r"] < q * table["v20"]\nprint(f"Multiplier learned from training: {q:.2f} (normal: −2.33)")\nprint(f"Test-period exceedance rate {100 * exc[tst].mean():.2f}% ({exc[tst].sum()} days)")` },
        hints: [{ tr: "%1 yüzdelik: <code>0.01</code>.", en: "The 1% quantile: <code>0.01</code>." }],
        checks: [{ py: { tr: "abs(q - np.quantile(oran[egt], 0.01)) < 1e-12", en: "abs(q - np.quantile(ratio[trn], 0.01)) < 1e-12" }, msg: { tr: "<code>q</code>, eğitim dönemindeki oranın %1 yüzdeliği olmalı.", en: "<code>q</code> should be the 1% quantile of the ratio in the training period." } }],
        after: { tr: "Çarpan −2,64: normalden belirgin biçimde daha uç. Aşım oranı %1,29'a iniyor (38 gün). 60 günlük volatiliteyle aynı yöntem %1,05 veriyor. Üç adımın dersi: riski doğru zamanda ölçmek (değişen volatilite) ve doğru dağılımla ölçmek (kalın kuyruk) ayrı ayrı gereklidir; ikisi de geçmişten öğrenilir ve geleceğe dokunmadan sınanır.", en: "The multiplier is −2.64: clearly more extreme than the normal. The exceedance rate falls to 1.29% (38 days). The same method with 60-day volatility gives 1.05%. The lesson of the three steps: measuring risk at the right time (time-varying volatility) and with the right distribution (fat tails) are both needed; both are learned from the past and tested without touching the future." }
      },
      {
        id: "m6-u8-c4", kind: "interpret",
        task: { tr: "YZ VaR sonuçlarını bir risk komitesine özetledi. Hangi cümleler yanlış?", en: "The AI summarised the VaR results for a risk committee. Which sentences are wrong?" },
        prompt: { tr: "Sabit VaR %0,58, v20 normal %2,17, v20 + eğitimden öğrenilen çarpan %1,29 aşım verdi (beklenen %1). Özetler misin?", en: "Constant VaR gave 0.58%, v20 normal 2.17%, v20 + multiplier learned from training 1.29% exceedances (1% expected). Can you summarise?" },
        sentences: {
          tr: ["Sabit VaR en az aşımı verdiği için en iyi yöntemdir.", "Normal dağılım varsayımı, volatilite doğru ölçülse bile kuyruk riskini küçümsüyor.", "VaR, aşım günlerinde kaybın ne kadar büyük olacağını söylemez; bunun için ek ölçüler gerekir.", "Çarpanı test döneminden öğrenseydik aşım oranı tam %1 olurdu; bu yüzden test dönemini kullanmalıyız."],
          en: ["Constant VaR is the best method because it gave the fewest exceedances.", "The normal assumption understates tail risk even when volatility is measured correctly.", "VaR does not say how big the loss will be on exceedance days; that needs additional measures.", "If we learned the multiplier from the test period the exceedance rate would be exactly 1%; so we should use the test period."]
        },
        bad: [0, 3],
        explain: {
          tr: ["<b>Yanlış:</b> ortalama aşım oranı düşük ama aşımlar 2015'te yığılıyor; sakin yıllarda da gereksiz sermaye bağlıyor. VaR'ın amacı riski doğru zamanda ölçmektir.", "Doğru.", "Doğru: örneğin aşım günlerindeki ortalama kayıp (beklenen açık, expected shortfall).", "<b>Yanlış:</b> bu, testi seçim için kullanmaktır (sızıntı). Gerçek kullanımda geleceğin yüzdeliğini bilemeyiz."],
          en: ["<b>Wrong:</b> the average exceedance rate is low, but exceedances pile up in 2015; it also ties up capital needlessly in calm years. VaR's purpose is to measure risk at the right time.", "Correct.", "Correct: for example the average loss on exceedance days (expected shortfall).", "<b>Wrong:</b> that would be using the test for a choice (leakage). In real use we cannot know the future's quantile."]
        }
      }
    ],
    quiz: [
      { q: { tr: "%1 VaR'ın aşım oranı iyi bir modelde ne olmalı?", en: "What should the exceedance rate of a 1% VaR be for a good model?" }, options: { tr: ["Yaklaşık %1 ve zaman içinde dengeli", "Mümkün olduğunca sıfır", "%5"], en: ["About 1% and balanced over time", "As close to zero as possible", "5%"] }, answer: 0, explain: { tr: "Az aşım da gereksiz sermaye demektir.", en: "Too few exceedances also means needless capital." } },
      { q: { tr: "Normal dağılımlı VaR neden çok aşım verdi?", en: "Why did the normal VaR give too many exceedances?" }, options: { tr: ["Getirilerin kuyrukları normalden kalın", "Volatilite yanlış hesaplandı", "Test dönemi çok kısa"], en: ["Returns have fatter tails than the normal", "Volatility was computed wrongly", "The test period is too short"] }, answer: 0, explain: { tr: "Eğitimden öğrenilen çarpan −2,64.", en: "The multiplier learned from training is −2.64." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 9 — Colab + Gemini atölyesi                                       */
  /* =================================================================== */
  const NB = { tr: "modul6/09_kur_volatilite_atolyesi_tr.ipynb", en: "module6/09_fx_volatility_workshop_en.ipynb" };
  U.push({
    id: "m6-u9", minutes: 50,
    title: { tr: "Colab + Gemini atölyesi: sterlin volatilitesi ve VaR", en: "Colab + Gemini workshop: sterling volatility and VaR" },
    blurb: { tr: "Sterlin/dolar kuruyla volatilite öngörüsünü zamana saygılı biçimde değerlendir, sonra kalın kuyruk düzeltmeli bir VaR kurup sına. Kodu Gemini yazar, sen denetlersin.", en: "With the sterling/dollar rate, evaluate volatility forecasts in a time-respecting way, then build and test a VaR with a fat-tail correction. Gemini writes the code, you audit it." },
    terms: [{ tr: "TimeSeriesSplit(gap)", en: "TimeSeriesSplit(gap)" }, { tr: "aşım oranı", en: "exceedance rate" }],
    concept: {
      tr: `<p>Bu atölyede modülün iki ana uygulamasını başka bir kurla tekrarlayacaksın: sterlin/dolar (FRED: DEXUSUK, 1 sterlin kaç dolar, 1971'den bu yana). Notebook veriyi bu sitenin GitHub deposundan indirir.</p>
<p><b>Görevler</b></p>
<ol>
<li><b>Görev A — Volatilite öngörüsü:</b> günlük log getiriden (yüzde) <code>v5</code>, <code>v20</code>, <code>v60</code> ve hedef <code>y_v</code>'yi Ünite 3'teki tanımlarla kur. Üç pencereli doğrusal modeli (HAR) <code>TimeSeriesSplit(5, gap=20)</code> ile çapraz doğrula; 2015 öncesiyle kurup 2015 sonrasında test R²'sini hesapla ve “son 60 gün” saf tahminiyle karşılaştır.</li>
<li><b>Görev B — VaR:</b> %1 VaR'ı <code>v60</code> ve eğitim döneminden (2015 öncesi) öğrenilen çarpanla kur; 2015 sonrasında aşım oranını hesapla ve normal dağılım çarpanıyla (−2,326) karşılaştır.</li>
</ol>
<div class="box"><b>Gemini'nin sık yaptığı hatalar:</b> <code>KFold(shuffle=True)</code> ya da <code>train_test_split</code> ile rastgele bölmek; hedefi <code>shift(-20)</code> yerine yanlış yöne kaydırmak; volatilite pencerelerini <code>center=True</code> ile geleceğe taşırmak; VaR çarpanını bütün veriden (test dâhil) öğrenmek. Kontrol hücreleri bunları yakalar.</div>
<p>Colab ve Gemini'yi kullanma kuralları Modül 0'daki atölyeyle aynı.</p>`,
      en: `<p>In this workshop you repeat the module's two main applications with another exchange rate: sterling/dollar (FRED: DEXUSUK, dollars per pound, since 1971). The notebook downloads the data from this site's GitHub repository.</p>
<p><b>Tasks</b></p>
<ol>
<li><b>Task A — Volatility forecast:</b> from the daily log return (percent) build <code>v5</code>, <code>v20</code>, <code>v60</code> and the target <code>y_v</code> with the definitions from Unit 3. Cross-validate the three-window linear model (HAR) with <code>TimeSeriesSplit(5, gap=20)</code>; fit it before 2015, compute the test R² from 2015 on and compare it with the “last 60 days” naive forecast.</li>
<li><b>Task B — VaR:</b> build the 1% VaR with <code>v60</code> and a multiplier learned from the training period (before 2015); compute the exceedance rate from 2015 on and compare it with the normal multiplier (−2.326).</li>
</ol>
<div class="box"><b>Mistakes Gemini often makes:</b> splitting at random with <code>KFold(shuffle=True)</code> or <code>train_test_split</code>; shifting the target the wrong way instead of <code>shift(-20)</code>; leaking volatility windows into the future with <code>center=True</code>; learning the VaR multiplier from all the data (test included). The check cells catch these.</div>
<p>The rules for using Colab and Gemini are the same as in the Module 0 workshop.</p>`
    },
    playground: null,
    cells: [
      {
        id: "m6-u9-c1", kind: "prompt",
        task: { tr: "Görev A için Gemini'ye vereceğin isteği burada hazırla. Notebook'ta <code>kur</code> serisi (günlük, tarih indeksli) hazır.", en: "Prepare the prompt for Task A here. The notebook has the <code>fx</code> series ready (daily, date-indexed)." },
        weak: {
          prompt: { tr: "Sterlin volatilitesini öngören bir model kur ve başarısını ölç.", en: "Build a model that forecasts sterling volatility and measure its success." },
          reply: { tr: "Veriyi rastgele bölüp bir regresyon kuralım:", en: "Let us split the data at random and build a regression:" },
          code: { tr: "r = kur.pct_change()\nvol = r.rolling(20, center=True).std()\nX = pd.concat([vol.shift(1), vol.shift(5)], axis=1).dropna()\ny = vol.loc[X.index]\nX_e, X_t, y_e, y_t = train_test_split(X, y, test_size=0.3)\nprint(LinearRegression().fit(X_e, y_e).score(X_t, y_t))", en: "r = fx.pct_change()\nvol = r.rolling(20, center=True).std()\nX = pd.concat([vol.shift(1), vol.shift(5)], axis=1).dropna()\ny = vol.loc[X.index]\nX_a, X_b, y_a, y_b = train_test_split(X, y, test_size=0.3)\nprint(LinearRegression().fit(X_a, y_a).score(X_b, y_b))" },
          claim: { tr: "R² 0,95: sterlin volatilitesi neredeyse kusursuz öngörülebiliyor.", en: "R² is 0.95: sterling volatility is almost perfectly predictable." }
        },
        checklist: [
          { label: { tr: "Getiri ve özellik tanımları", en: "Return and feature definitions" }, why: { tr: "100 × log fark; v_w = son w günün getiri karelerinin ortalamasının karekökü (5, 20, 60), yalnızca geçmiş.", en: "100 × log difference; v_w = square root of the mean squared return over the last w days (5, 20, 60), past only." }, re: { tr: "log|v60|rolling", en: "log|v60|rolling" } },
          { label: { tr: "Hedef", en: "Target" }, why: { tr: "y_v: önümüzdeki 20 günün volatilitesi, (r²).rolling(20).mean().shift(-20) karekökü.", en: "y_v: volatility over the next 20 days, square root of (r²).rolling(20).mean().shift(-20)." }, re: { tr: "shift\\(-20\\)|önümüzdeki 20|gelecek 20", en: "shift\\(-20\\)|next 20" } },
          { label: { tr: "Zamana saygılı doğrulama", en: "Time-respecting validation" }, why: { tr: "TimeSeriesSplit(5, gap=20) ile çapraz doğrulama; rastgele bölme yok.", en: "Cross-validation with TimeSeriesSplit(5, gap=20); no random split." }, re: { tr: "TimeSeriesSplit|gap", en: "TimeSeriesSplit|gap" } },
          { label: { tr: "Tarihle bölme ve kıyas", en: "Split by date and benchmark" }, why: { tr: "2015 öncesi eğitim, sonrası test; saf tahmin olarak v60.", en: "Training before 2015, test after; v60 as the naive forecast." }, re: { tr: "2015|saf|naif|v60", en: "2015|naive|v60" } }
        ],
        minLen: 120,
        strong: { prompt: { tr: "kur adlı pandas serisinden (tarih indeksli, günlük) r = 100 * np.log(kur).diff().dropna() ile günlük log getiriyi hesapla. tablo adlı bir DataFrame kur: w = 5, 20, 60 için v{w} = np.sqrt((r ** 2).rolling(w).mean()); hedef y_v = np.sqrt((r ** 2).rolling(20).mean().shift(-20)); sonra dropna. X = tablo[[\"v5\", \"v20\", \"v60\"]], y = tablo[\"y_v\"]. LinearRegression için cross_val_score(..., cv=TimeSeriesSplit(n_splits=5, gap=20), scoring=\"r2\") ortalamasını cv_r2'ye ata. egt = tablo.index < \"2015-01-01\", tst = ~egt; modeli yalnızca egt ile kurup tst için r2_score'u test_r2'ye, saf tahmin olarak tablo.loc[tst, \"v60\"]'ın r2_score'unu naif_r2'ye ata. Rastgele bölme ve center=True kullanma.", en: "From the pandas series fx (date-indexed, daily) compute the daily log return with r = 100 * np.log(fx).diff().dropna(). Build a DataFrame called table: for w = 5, 20, 60, v{w} = np.sqrt((r ** 2).rolling(w).mean()); target y_v = np.sqrt((r ** 2).rolling(20).mean().shift(-20)); then dropna. X = table[[\"v5\", \"v20\", \"v60\"]], y = table[\"y_v\"]. Store the mean of cross_val_score(..., cv=TimeSeriesSplit(n_splits=5, gap=20), scoring=\"r2\") for LinearRegression in cv_r2. trn = table.index < \"2015-01-01\", tst = ~trn; fit the model on trn only, store r2_score for tst in test_r2, and the r2_score of table.loc[tst, \"v60\"] as the naive forecast in naive_r2. Do not use a random split or center=True." } }
      },
      {
        id: "m6-u9-c2", kind: "colab",
        task: { tr: "<b>Görev A — Volatilite öngörüsü.</b> Notebook'u aç, hazırladığın istekle <code>r</code>, <code>tablo</code>, <code>cv_r2</code>, <code>test_r2</code> ve <code>naif_r2</code> değişkenlerini oluştur, kontrol hücresini çalıştır ve verdiği kodu buraya yapıştır.", en: "<b>Task A — Volatility forecast.</b> Open the notebook, create <code>r</code>, <code>table</code>, <code>cv_r2</code>, <code>test_r2</code> and <code>naive_r2</code> with the prompt you prepared, run the check cell and paste the code it gives you here." },
        notebook: NB,
        steps: {
          tr: ["Notebook'u aç ve <b>Kurulum</b> hücresini çalıştır (sterlin/dolar verisi indirilir).", "<b>Görev A</b> hücresinde Gemini'ye isteğini ver.", "Kodu denetle: rastgele bölme var mı? Hedef geleceğe mi bakıyor (<code>shift(-20)</code>), özellikler geçmişe mi? <code>gap=20</code> var mı?", "<b>Kontrol A</b> hücresini çalıştır; geçerse <code>ML6-…</code> kodunu yapıştır."],
          en: ["Open the notebook and run the <b>Setup</b> cell (the sterling/dollar data are downloaded).", "In the <b>Task A</b> cell, give Gemini your prompt.", "Audit the code: is there a random split? Does the target look forward (<code>shift(-20)</code>) and the features backward? Is there <code>gap=20</code>?", "Run the <b>Check A</b> cell; if it passes, paste the <code>ML6-…</code> code."]
        },
        codeHashes: ["5e808e9e"]
      },
      {
        id: "m6-u9-c3", kind: "colab",
        task: { tr: "<b>Görev B — VaR.</b> Gemini ile eğitim döneminden öğrenilen çarpanı (<code>q</code>) ve 2015 sonrasındaki aşım oranlarını (<code>asim_orani</code>, normal çarpanla <code>asim_normal</code>) hesaplat, kontrol hücresini çalıştır ve kodu buraya yapıştır.", en: "<b>Task B — VaR.</b> Have Gemini compute the multiplier learned from the training period (<code>q</code>) and the exceedance rates after 2015 (<code>exc_rate</code>, and with the normal multiplier <code>exc_normal</code>), run the check cell and paste the code here." },
        notebook: NB,
        steps: {
          tr: ["<b>Görev B</b> hücresinde Gemini'den iste: <code>y_r = r.shift(-1)</code> (yarının getirisi) tabloya eklensin; <code>q</code> = eğitim döneminde <code>y_r / v60</code> oranının %1 yüzdeliği.", "Aşım: <code>y_r &lt; q * v60</code>; <code>asim_orani</code> test dönemindeki ortalaması. Aynısını −2,326 ile yapıp <code>asim_normal</code>'e ata.", "Kodu denetle: çarpan yalnızca eğitimden mi öğrenildi?", "<b>Kontrol B</b> hücresini çalıştır ve kodu buraya yapıştır."],
          en: ["In the <b>Task B</b> cell, ask Gemini to add <code>y_r = r.shift(-1)</code> (tomorrow's return) to the table; <code>q</code> = the 1% quantile of <code>y_r / v60</code> in the training period.", "Exceedance: <code>y_r &lt; q * v60</code>; <code>exc_rate</code> is its mean in the test period. Do the same with −2.326 and store it in <code>exc_normal</code>.", "Audit the code: was the multiplier learned from training only?", "Run the <b>Check B</b> cell and paste the code here."]
        },
        codeHashes: ["1f2118ee"],
        after: { tr: "Aynı yöntemler başka bir kurda da benzer dersler verdi mi? Volatilitenin öngörülebilir, kuyrukların kalın olduğunu sterlinde de gördüysen, bulgunun tek bir seriye özgü olmadığına dair ilk kanıtı elde ettin.", en: "Did the same methods give similar lessons on another exchange rate? If you saw that volatility is predictable and tails are fat for sterling too, you have the first evidence that the finding is not specific to one series." }
      },
      {
        id: "m6-u9-c4", kind: "auditlog",
        task: { tr: "Atölyeyi bir denetim notuyla kapat.", en: "Close the workshop with an audit note." },
        fields: {
          tr: [
            { label: "Gemini zamana saygılı mı çalıştı? Neyi düzeltmen gerekti?", help: "Rastgele bölme, hedef kaydırma, center=True, boşluk", ph: "Örnek: Gemini önce train_test_split kullanmıştı…" },
            { label: "Sterlin sonuçları euro/dolarla nasıl karşılaştırılıyor?", help: "cv_r2, test_r2, naif_r2; HAR ne kazandırdı?", ph: "Örnek: test R² … , v60 … " },
            { label: "VaR sonuçlarını bir risk komitesine nasıl anlatırsın?", help: "Aşım oranı, normal çarpanla fark, sınırlılıklar", ph: "Örnek: normal dağılımla aşım oranı %… çıktı…" }
          ],
          en: [
            { label: "Did Gemini work in a time-respecting way? What did you need to fix?", help: "Random split, target shift, center=True, gap", ph: "Example: Gemini first used train_test_split…" },
            { label: "How do the sterling results compare with euro/dollar?", help: "cv_r2, test_r2, naive_r2; what did HAR gain?", ph: "Example: test R² … , v60 …" },
            { label: "How would you explain the VaR results to a risk committee?", help: "Exceedance rate, gap with the normal multiplier, limitations", ph: "Example: with the normal distribution the exceedance rate was …%…" }
          ]
        }
      }
    ],
    quiz: [
      { q: { tr: "Volatilite pencerelerinde <code>center=True</code> kullanmak neden yanlıştır?", en: "Why is using <code>center=True</code> in volatility windows wrong?" }, options: { tr: ["Pencere geleceği de içerir: ileriye bakma yanlılığı", "Hesap yavaşlar", "Sonuç değişmez"], en: ["The window includes the future: look-ahead bias", "Computation slows down", "The result does not change"] }, answer: 0, explain: { tr: "Özellikler yalnızca geçmişe bakmalı.", en: "Features must look only at the past." } },
      { q: { tr: "VaR çarpanı hangi veriden öğrenilmeli?", en: "From which data should the VaR multiplier be learned?" }, options: { tr: ["Yalnızca eğitim döneminden", "Bütün veriden", "Test döneminden"], en: ["The training period only", "All the data", "The test period"] }, answer: 0, explain: { tr: "Aksi sızıntıdır.", en: "Otherwise it is leakage." } }
    ]
  });
})();
