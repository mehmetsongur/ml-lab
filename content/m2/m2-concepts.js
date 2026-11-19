/* Modül 2 — genişletilmiş kavram anlatımları (şekil, tablo, çözümlü örnek, sık hatalar, özet)
 * Şekiller tools/m2_figs.py ile üretilir (window.M2_FIGS). Her ünitenin "concept" alanını değiştirir.
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 */
(function () {
  "use strict";
  const F = window.M2_FIGS || {}, N = window.M2_NUMS || {};
  const U = window.M2_UNITS || [];
  const LK = {
    video: "https://youtu.be/TzWIzMklU9Q",
    slides: "https://www.songurmehmet.com/assets/dersler/ml/Hafta03_Slaytlar.pdf",
    nb: "https://colab.research.google.com/github/mehmetsongur/Machine-Learning-in-Economics-and-Finance/blob/main/code/Hafta03_Model_Basarisi.ipynb"
  };
  const nf = (x, d, lang) => { const s = Number(x).toFixed(d); return lang === "tr" ? s.replace(".", ",") : s; };
  const fig = (name, lang, cap) => `<figure class="c-fig">${(F[name] || {})[lang] || ""}<figcaption>${cap}</figcaption></figure>`;
  const sec = (n, c, title, body) => `<section class="c-sec c${c}"><h3><span class="c-n">${n}</span>${title}</h3>${body}</section>`;
  const cards = (items) => `<div class="c-cards">${items.map(([c, ic, t, p, f]) => `<div class="c-card c${c}">${ic ? `<span class="c-ic">${ic}</span>` : ""}<b>${t}</b><p>${p}</p>${f ? `<span class="c-f">${f}</span>` : ""}</div>`).join("")}</div>`;
  const pit = (items) => `<div class="c-pit">${items.map(([x, p, ok]) => `<div><span class="x">✗ ${x}</span><p>${p}</p><span class="ok">✓ ${ok}</span></div>`).join("")}</div>`;
  const sum = (t, items) => `<div class="c-sum"><b>${t}</b><ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul></div>`;
  const analogy = (big, p) => `<div class="c-analogy"><span class="big">${big}</span><p>${p}</p></div>`;
  const link = (lang, part) => lang === "tr"
    ? `<div class="c-link"><strong>Derste:</strong> 3. hafta${part ? " · " + part : ""}<a href="${LK.video}" target="_blank" rel="noopener">▶ Video</a><a href="${LK.slides}" target="_blank" rel="noopener">Slaytlar (PDF)</a><a href="${LK.nb}" target="_blank" rel="noopener">Colab notebook</a></div>`
    : `<div class="c-link"><strong>In the course:</strong> week 3${part ? " · " + part : ""}<a href="${LK.video}" target="_blank" rel="noopener">▶ Video (Turkish)</a><a href="${LK.slides}" target="_blank" rel="noopener">Slides (PDF, Turkish)</a><a href="${LK.nb}" target="_blank" rel="noopener">Colab notebook</a></div>`;
  const wrap = (s) => `<div class="c-rich">${s}</div>`;
  const C = {};

  /* ------------------------------------------------------------ Ünite 1 */
  const u1 = N.u1 || { me: 0, mae: 0.174, mse: 0.405, rmse: 0.636 };
  C["m2-u1"] = {
    tr: wrap(`
<p class="c-lead">Bir modelin iyi olup olmadığını söylemenin tek yolu, yaptığı hataları ölçmektir. Ama yüzlerce hatayı tek bir sayıya indirmenin birden çok yolu var ve her biri farklı bir soruyu yanıtlar. Bu ünitede dört ölçüyü gerçek bir seri üzerinde tanıyacağız: ABD işsizlik oranı.</p>
${sec(1, 0, "Sezgi: hava durumu tahmincisi", `
${analogy("🌦️", "Bir hava durumu sunucusu bir hafta boyunca her gün sıcaklığı tahmin ediyor. Pazartesi 2 derece fazla, salı 2 derece eksik söylüyor. “Ortalamada hiç yanılmadı” demek doğru mu? Hayır: her gün 2 derece yanıldı. Hataları <b>işaretleriyle</b> toplamak, artıları ve eksileri birbirine yedirir. Doğruluğu ölçmek için hataların <b>büyüklüğüne</b> bakmak gerekir.")}`)}
${sec(2, 1, "Hata nedir? Gerçek bir seri ve en basit öngörü", `
<p>Model olarak öngörülerin en basitini kullanıyoruz: <b>“bu ay, geçen ay ne idiyse o olur.”</b> Buna <b>saf öngörü</b> denir. Aşağıda gerçek işsizlik oranı ve saf öngörü üst üste. Saf öngörü, gerçek serinin bir ay sağa kaydırılmış hâlidir.</p>
${fig("u1_series", "tr", "<b>Şekil 1.</b> ABD işsizlik oranı (FRED: UNRATE, aylık, %) ve saf öngörü. İki çizgi neredeyse çakışıyor; ayrıldıkları yerler hatalardır.")}
<p>Her ay için <b>hata = gerçek − öngörü</b>. Artı bir hata, öngörünün düşük kaldığı; eksi bir hata, yüksek kaldığı anlamına gelir.</p>
${fig("u1_errors", "tr", "<b>Şekil 2.</b> Saf öngörünün aylık hataları. Hataların çoğu ±0,3 puanın içinde; Nisan 2020'deki pandemi şoku tek başına +10,4 puan.")}`)}
${sec(3, 2, "Dört ölçü, dört farklı soru", `
${cards([
      [0, "∑", "Ortalama hata", "Model sistematik olarak bir yöne mi kayıyor? Sıfıra yakınsa sapma yok demektir; doğruluk hakkında bir şey söylemez.", "ortalama(hata)"],
      [1, "|·|", "Ortalama mutlak hata", "Model tipik bir gözlemde kaç birim yanılıyor? Birimi verinin birimiyle aynı (puan).", "ortalama(|hata|)"],
      [2, "²", "Hata kareleri ortalaması (HKO)", "Kare alma büyük hataları çok ağır cezalandırır. Birimi verinin biriminin karesi (puan²).", "ortalama(hata²)"],
      [3, "√", "Kök HKO", "HKO'yu verinin birimine geri getirir; büyük hatalara duyarlılığını korur. En sık raporlanan ölçü.", "√HKO"]
    ])}
<div class="c-formula"><div class="eq">HKO = <sup>1</sup>⁄<sub><i>n</i></sub> Σ (<i>y</i><sub>t</sub> − <i>ŷ</i><sub>t</sub>)²&nbsp;&nbsp;&nbsp;&nbsp;kök HKO = √HKO</div>
<dl><dt>y<sub>t</sub></dt><dd>t ayındaki gerçek değer</dd><dt>ŷ<sub>t</sub></dt><dd>aynı ay için öngörü (y şapka)</dd><dt>n</dt><dd>hatası hesaplanan ay sayısı</dd></dl></div>`)}
${sec(4, 3, "Çözümlü örnek: ilk beş ay elle", `
<table class="c-table"><thead><tr><th>Ay</th><th class="n">Gerçek</th><th class="n">Öngörü (geçen ay)</th><th class="n">Hata</th><th class="n">|Hata|</th><th class="n">Hata²</th></tr></thead><tbody>
<tr><td>2000 Şubat</td><td class="n">4,1</td><td class="n">4,0</td><td class="n">+0,1</td><td class="n">0,1</td><td class="n">0,01</td></tr>
<tr><td>2000 Mart</td><td class="n">4,0</td><td class="n">4,1</td><td class="n">−0,1</td><td class="n">0,1</td><td class="n">0,01</td></tr>
<tr><td>2000 Nisan</td><td class="n">3,8</td><td class="n">4,0</td><td class="n">−0,2</td><td class="n">0,2</td><td class="n">0,04</td></tr>
<tr><td>2000 Mayıs</td><td class="n">4,0</td><td class="n">3,8</td><td class="n">+0,2</td><td class="n">0,2</td><td class="n">0,04</td></tr>
<tr><td>2000 Haziran</td><td class="n">4,0</td><td class="n">4,0</td><td class="n">0,0</td><td class="n">0,0</td><td class="n">0,00</td></tr>
<tr class="hl"><td>Ortalama</td><td></td><td></td><td class="n">0,00</td><td class="n">0,12</td><td class="n">0,02</td></tr></tbody></table>
<ol class="c-steps">
<li><p><b>Ortalama hata</b> = (0,1 − 0,1 − 0,2 + 0,2 + 0) / 5 = <b>0</b>. Beş ayda dört kez yanıldık ama ortalama hata sıfır.</p></li>
<li><p><b>Ortalama mutlak hata</b> = (0,1 + 0,1 + 0,2 + 0,2 + 0) / 5 = <b>0,12 puan</b>: tipik ayda 0,12 puan yanılıyoruz.</p></li>
<li><p><b>HKO</b> = (0,01 + 0,01 + 0,04 + 0,04 + 0) / 5 = <b>0,02 puan²</b>; <b>kök HKO</b> = √0,02 ≈ <b>0,14 puan</b>.</p></li>
</ol>`)}
${sec(5, 4, "Bütün seri: ölçüler ne söylüyor?", `
<div class="c-two">${fig("u1_measures", "tr", "<b>Şekil 3.</b> 2000'den bu yana saf öngörünün dört ölçüsü.")}
<div><p>Ortalama hata <b>sıfır</b>: 26 yılın artıları ve eksileri birbirini götürüyor. Ortalama mutlak hata <b>${nf(u1.mae, 2, "tr")}</b>, kök HKO ise <b>${nf(u1.rmse, 2, "tr")}</b> puan.</p><p>Kök HKO neden neredeyse dört kat büyük? Çünkü kare alma, 2020'deki birkaç dev hatayı büyütüyor. <b>İki ölçü arasındaki büyük fark, birkaç aşırı hatanın işaretidir.</b> Hangisini raporlayacağın sorduğun soruya bağlı: “tipik ay” için ortalama mutlak hata, “büyük hatalar pahalı” ise kök HKO.</p></div></div>`)}
${sec(6, 0, "Sık yapılan hatalar", pit([
      ["“Ortalama hata sıfır, model mükemmel”", "Artı ve eksi hatalar birbirini götürür. Ortalama hata yalnızca sistematik sapmayı ölçer.", "Doğruluk için ortalama mutlak hata ya da kök HKO kullan."],
      ["Kök HKO'yu “ortalama hata” diye okumak", "Kök HKO büyük hatalara ağırlık verir; tipik hatadan büyüktür.", "“Ortalama kaç puan yanılıyor?” sorusunun yanıtı ortalama mutlak hatadır."],
      ["Birimleri karıştırmak", "HKO'nun birimi puan²'dir; doğrudan veriyle karşılaştırılmaz.", "Veriyle karşılaştırmak için kök HKO'ya bak."]
    ]))}
${sum("Akılda kalsın", ["Hata = gerçek − öngörü. Artı ve eksi hatalar toplandığında birbirini götürür.", "Ortalama mutlak hata tipik hatayı, kök HKO büyük hatalara duyarlı doğruluğu ölçer.", "Saf öngörü (“geçen ay ne idiyse”) her modelin yenmesi gereken basit bir kıyas ölçütüdür."])}
${link("tr", "model başarısını ölçmek")}`),
    en: wrap(`
<p class="c-lead">The only way to say whether a model is good is to measure its errors. But there is more than one way to reduce hundreds of errors to a single number, and each answers a different question. In this unit we meet four measures on a real series: the US unemployment rate.</p>
${sec(1, 0, "Intuition: the weather forecaster", `
${analogy("🌦️", "A weather presenter forecasts the temperature every day for a week. On Monday they are 2 degrees too high, on Tuesday 2 degrees too low. Is it right to say “on average they were never wrong”? No: they were off by 2 degrees every day. Adding errors <b>with their signs</b> lets pluses and minuses cancel. To measure accuracy you have to look at the <b>size</b> of the errors.")}`)}
${sec(2, 1, "What is an error? A real series and the simplest forecast", `
<p>As our model we use the simplest forecast of all: <b>“this month will be whatever last month was.”</b> This is called the <b>naive forecast</b>. Below, the actual unemployment rate and the naive forecast are drawn on top of each other. The naive forecast is just the actual series shifted one month to the right.</p>
${fig("u1_series", "en", "<b>Figure 1.</b> US unemployment rate (FRED: UNRATE, monthly, %) and the naive forecast. The two lines almost coincide; where they part are the errors.")}
<p>For each month, <b>error = actual − forecast</b>. A positive error means the forecast was too low; a negative one, too high.</p>
${fig("u1_errors", "en", "<b>Figure 2.</b> The naive forecast's monthly errors. Most are within ±0.3 points; the pandemic shock in April 2020 alone is +10.4 points.")}`)}
${sec(3, 2, "Four measures, four different questions", `
${cards([
      [0, "∑", "Mean error", "Does the model lean systematically one way? Near zero means no bias; it says nothing about accuracy.", "mean(error)"],
      [1, "|·|", "Mean absolute error", "By how many units does the model miss on a typical observation? Same unit as the data (points).", "mean(|error|)"],
      [2, "²", "Mean squared error (MSE)", "Squaring punishes large errors very heavily. Its unit is the square of the data's unit (points²).", "mean(error²)"],
      [3, "√", "Root MSE (RMSE)", "Brings the MSE back to the data's unit while keeping its sensitivity to large errors. The most commonly reported measure.", "√MSE"]
    ])}
<div class="c-formula"><div class="eq">MSE = <sup>1</sup>⁄<sub><i>n</i></sub> Σ (<i>y</i><sub>t</sub> − <i>ŷ</i><sub>t</sub>)²&nbsp;&nbsp;&nbsp;&nbsp;RMSE = √MSE</div>
<dl><dt>y<sub>t</sub></dt><dd>the actual value in month t</dd><dt>ŷ<sub>t</sub></dt><dd>the forecast for the same month (y hat)</dd><dt>n</dt><dd>the number of months with an error</dd></dl></div>`)}
${sec(4, 3, "Worked example: the first five months by hand", `
<table class="c-table"><thead><tr><th>Month</th><th class="n">Actual</th><th class="n">Forecast (last month)</th><th class="n">Error</th><th class="n">|Error|</th><th class="n">Error²</th></tr></thead><tbody>
<tr><td>Feb 2000</td><td class="n">4.1</td><td class="n">4.0</td><td class="n">+0.1</td><td class="n">0.1</td><td class="n">0.01</td></tr>
<tr><td>Mar 2000</td><td class="n">4.0</td><td class="n">4.1</td><td class="n">−0.1</td><td class="n">0.1</td><td class="n">0.01</td></tr>
<tr><td>Apr 2000</td><td class="n">3.8</td><td class="n">4.0</td><td class="n">−0.2</td><td class="n">0.2</td><td class="n">0.04</td></tr>
<tr><td>May 2000</td><td class="n">4.0</td><td class="n">3.8</td><td class="n">+0.2</td><td class="n">0.2</td><td class="n">0.04</td></tr>
<tr><td>Jun 2000</td><td class="n">4.0</td><td class="n">4.0</td><td class="n">0.0</td><td class="n">0.0</td><td class="n">0.00</td></tr>
<tr class="hl"><td>Average</td><td></td><td></td><td class="n">0.00</td><td class="n">0.12</td><td class="n">0.02</td></tr></tbody></table>
<ol class="c-steps">
<li><p><b>Mean error</b> = (0.1 − 0.1 − 0.2 + 0.2 + 0) / 5 = <b>0</b>. We were wrong in four of five months, yet the mean error is zero.</p></li>
<li><p><b>Mean absolute error</b> = (0.1 + 0.1 + 0.2 + 0.2 + 0) / 5 = <b>0.12 points</b>: in a typical month we miss by 0.12 points.</p></li>
<li><p><b>MSE</b> = (0.01 + 0.01 + 0.04 + 0.04 + 0) / 5 = <b>0.02 points²</b>; <b>RMSE</b> = √0.02 ≈ <b>0.14 points</b>.</p></li>
</ol>`)}
${sec(5, 4, "The whole series: what do the measures say?", `
<div class="c-two">${fig("u1_measures", "en", "<b>Figure 3.</b> The four measures for the naive forecast since 2000.")}
<div><p>The mean error is <b>zero</b>: 26 years of pluses and minuses cancel. The mean absolute error is <b>${nf(u1.mae, 2, "en")}</b> and the RMSE <b>${nf(u1.rmse, 2, "en")}</b> points.</p><p>Why is the RMSE almost four times larger? Because squaring magnifies the few giant errors of 2020. <b>A large gap between the two measures signals a few extreme errors.</b> Which to report depends on your question: the mean absolute error for “a typical month”, the RMSE if “large errors are costly”.</p></div></div>`)}
${sec(6, 0, "Common mistakes", pit([
      ["“The mean error is zero, so the model is perfect”", "Positive and negative errors cancel. The mean error only measures systematic bias.", "Use the mean absolute error or RMSE for accuracy."],
      ["Reading RMSE as the “average error”", "RMSE weights large errors; it is larger than the typical error.", "The answer to “by how much does it miss on average?” is the mean absolute error."],
      ["Mixing up units", "MSE is in points²; it cannot be compared directly with the data.", "Look at RMSE to compare with the data."]
    ]))}
${sum("Remember", ["Error = actual − forecast. Added up, positive and negative errors cancel.", "The mean absolute error measures the typical error; RMSE measures accuracy with sensitivity to large errors.", "The naive forecast (“whatever last month was”) is a simple benchmark every model must beat."])}
${link("en", "measuring model performance")}`)
  };

  /* ------------------------------------------------------------ Ünite 2 */
  C["m2-u2"] = {
    tr: wrap(`
<p class="c-lead">Bir modelin, kurulduğu verideki başarısı, yeni verideki başarısını söylemez. Bu ünitede makine öğrenmesinin en temel kuralını görüyoruz: modeli bir veriyle kur, başka bir veriyle sına.</p>
${sec(1, 0, "Sezgi: ezberleyen öğrenci", `
${analogy("📚", "İki öğrenci düşün. Biri geçen yılın sınav sorularını cevaplarıyla birlikte ezberliyor, diğeri konuyu çalışıyor. Geçen yılın sorularıyla yapılan bir denemede ikisi de tam puan alır. Ama gerçek sınavda sorular yeni olunca ezberleyen çuvallar. <b>Modeller de ezberleyebilir</b>: eğitim verisini kusursuz açıklayıp yeni veride başarısız olabilirler.")}`)}
${sec(2, 1, "Eğitim ve test verisi", `
${fig("u2_split", "tr", "<b>Şekil 1.</b> Aynı dünyadan iki ayrı örneklem: model 30 kişiyle kurulur, 2.000 yeni kişide sınanır.")}
${cards([
      [0, "🔧", "Eğitim verisi", "Modelin parametrelerini (burada polinom katsayılarını) kestirmek için kullanılır. Model bu gözlemleri görür."],
      [3, "🧪", "Test verisi", "Modelin hiç görmediği gözlemler. Burada ölçülen hata, modelin gerçek kullanımda ne kadar yanılacağının tahminidir."],
      [2, "🎯", "Genelleme", "Modelin yeni verilerde de iyi çalışması. Makine öğrenmesinin asıl amacı budur, eğitim verisini açıklamak değil."]
    ])}`)}
${sec(3, 2, "Örneğimiz: deneyim ve ücret", `
<p>Dersin 3. haftasındaki örneği kullanıyoruz. Log ücret, deneyimle önce artar, sonra düzleşir (Mincer tipi bir ücret denklemi). Gerçek ilişkiyi biz belirliyoruz ve her kişiye rastgele bir sapma ekliyoruz:</p>
<div class="c-formula"><div class="eq">log ücret = 2,0 + 0,08 · <i>e</i> − 0,0014 · <i>e</i>² + <i>u</i></div>
<dl><dt>e</dt><dd>deneyim (yıl), 0–40 arası</dd><dt>u</dt><dd>rastgele sapma; ortalaması 0, standart sapması 0,25. Hiçbir model öngöremez: <b>indirgenemez hata</b> = 0,25² = 0,0625</dd></dl></div>
<p>Tek aracımız <b>polinom regresyon</b>: log ücreti deneyimin 1., 2., …, d. kuvvetleriyle açıklamak. Derece ne kadar yüksekse eğri o kadar kıvrılabilir.</p>`)}
${sec(4, 3, "Aynı 30 kişi, üç model", `
${fig("u2_fits", "tr", "<b>Şekil 2.</b> Gri noktalar 30 kişilik eğitim verisi, kesikli çizgi gerçek ilişki, mavi çizgi model. Altta eğitim ve test HKO'ları.")}
<table class="c-table"><thead><tr><th>Model</th><th class="n">Eğitim HKO</th><th class="n">Test HKO</th><th>Okuma</th></tr></thead><tbody>
<tr><td>Derece 1</td><td class="n">0,102</td><td class="n">0,127</td><td>İkisi de yüksek: ilişkinin eğriliğini kaçırıyor</td></tr>
<tr class="hl"><td>Derece 2</td><td class="n">0,070</td><td class="n">0,076</td><td>İkisi de düşük ve yakın: iyi genelliyor</td></tr>
<tr class="bad"><td>Derece 12</td><td class="n">0,032</td><td class="n">18,227</td><td>Eğitimde en iyi, testte felaket: ezberlemiş</td></tr></tbody></table>
<p>Derece 12'nin eğitim hatası (0,032) <b>indirgenemez hatadan (0,0625) bile düşük</b>. Bu imkânsız bir başarı: hiçbir model, tahmin edilemez sapmayı öngöremez. Model gürültüyü ezberlemiştir.</p>`)}
${sec(5, 4, "Veriyi nasıl bölersin?", `
<ol class="c-steps">
<li><p>Elinde tek bir veri seti varsa gözlemleri <b>karıştır</b> (sıralı veri sistematik bir bölme yaratır).</p></li>
<li><p>Tipik oran: <b>%70–80 eğitim, %20–30 test</b>. Veri az ise teste ayırabileceğin pay da azalır; bunun çözümü Ünite 6'da.</p></li>
<li><p>Test verisini bir kenara koy ve model hazır olana kadar <b>dokunma</b>.</p></li>
<li><p>İstisna: zaman serilerinde karıştırma yapılmaz; geçmiş eğitim, gelecek test olur (Ünite 8).</p></li>
</ol>`)}
${sec(6, 0, "Sık yapılan hatalar", pit([
      ["Başarıyı eğitim verisinde raporlamak", "Model bu veriyi görmüştür; hata olduğundan küçük çıkar.", "Her zaman “hangi veride?” diye sor; test hatasını raporla."],
      ["Gürültüden düşük hatayı başarı sanmak", "İndirgenemez hatanın altına inen bir eğitim hatası, ezberin işaretidir.", "Eğitim ve test hatası arasındaki farka bak."],
      ["Sıralı veriyi karıştırmadan bölmek", "Gelire göre sıralı bir tabloda ilk %80 düşük gelirliler olur.", "Bağımsız gözlemlerde önce karıştır, sonra böl."]
    ]))}
${sum("Akılda kalsın", ["Model eğitim verisiyle kurulur, test verisiyle değerlendirilir.", "Eğitimdeki başarı genellemeyi garanti etmez; derece 12 bunu en uç biçimde gösteriyor.", "İndirgenemez hata, hiçbir modelin aşamayacağı bir alt sınırdır."])}
${link("tr", "eğitim ve test verisi")}`),
    en: wrap(`
<p class="c-lead">A model's success on the data it was built on says nothing about its success on new data. In this unit we meet the most basic rule of machine learning: build the model on one set of data, test it on another.</p>
${sec(1, 0, "Intuition: the student who memorises", `
${analogy("📚", "Think of two students. One memorises last year's exam questions together with the answers; the other studies the subject. In a mock exam using last year's questions both score full marks. But in the real exam, with new questions, the one who memorised fails. <b>Models can memorise too</b>: they can explain the training data perfectly and fail on new data.")}`)}
${sec(2, 1, "Training and test data", `
${fig("u2_split", "en", "<b>Figure 1.</b> Two separate samples from the same world: the model is built on 30 people and tested on 2,000 new ones.")}
${cards([
      [0, "🔧", "Training data", "Used to estimate the model's parameters (here, the polynomial coefficients). The model sees these observations."],
      [3, "🧪", "Test data", "Observations the model has never seen. The error measured here estimates how wrong the model will be in real use."],
      [2, "🎯", "Generalisation", "Working well on new data too. This, not explaining the training data, is the real goal of machine learning."]
    ])}`)}
${sec(3, 2, "Our example: experience and wages", `
<p>We use the example from week 3 of the course. Log wages first rise with experience, then level off (a Mincer-type wage equation). We set the true relationship and add a random deviation for each person:</p>
<div class="c-formula"><div class="eq">log wage = 2.0 + 0.08 · <i>e</i> − 0.0014 · <i>e</i>² + <i>u</i></div>
<dl><dt>e</dt><dd>experience (years), between 0 and 40</dd><dt>u</dt><dd>random deviation with mean 0 and standard deviation 0.25. No model can predict it: <b>irreducible error</b> = 0.25² = 0.0625</dd></dl></div>
<p>Our only tool is <b>polynomial regression</b>: explaining log wage with powers 1, 2, …, d of experience. The higher the degree, the more the curve can bend.</p>`)}
${sec(4, 3, "The same 30 people, three models", `
${fig("u2_fits", "en", "<b>Figure 2.</b> Grey dots: the 30-person training data; dashed line: the true relationship; blue line: the model. Training and test MSE below.")}
<table class="c-table"><thead><tr><th>Model</th><th class="n">Training MSE</th><th class="n">Test MSE</th><th>Reading</th></tr></thead><tbody>
<tr><td>Degree 1</td><td class="n">0.102</td><td class="n">0.127</td><td>Both high: misses the curvature</td></tr>
<tr class="hl"><td>Degree 2</td><td class="n">0.070</td><td class="n">0.076</td><td>Both low and close: generalises well</td></tr>
<tr class="bad"><td>Degree 12</td><td class="n">0.032</td><td class="n">18.227</td><td>Best in training, disastrous in test: memorised</td></tr></tbody></table>
<p>Degree 12's training error (0.032) is <b>lower even than the irreducible error (0.0625)</b>. That is an impossible success: no model can predict an unpredictable deviation. The model has memorised the noise.</p>`)}
${sec(5, 4, "How do you split the data?", `
<ol class="c-steps">
<li><p>If you have a single data set, <b>shuffle</b> the observations (sorted data create a systematic split).</p></li>
<li><p>Typical ratio: <b>70–80% training, 20–30% test</b>. With little data, the share you can hold out shrinks; the remedy comes in Unit 6.</p></li>
<li><p>Put the test data aside and <b>do not touch them</b> until the model is ready.</p></li>
<li><p>Exception: time series are not shuffled; the past is training, the future is test (Unit 8).</p></li>
</ol>`)}
${sec(6, 0, "Common mistakes", pit([
      ["Reporting performance on the training data", "The model has seen these data; the error comes out too small.", "Always ask “on which data?”; report the test error."],
      ["Taking an error below the noise as success", "A training error below the irreducible error is a sign of memorisation.", "Look at the gap between training and test error."],
      ["Splitting sorted data without shuffling", "In a table sorted by income, the first 80% are the low earners.", "With independent observations, shuffle first, then split."]
    ]))}
${sum("Remember", ["A model is built on training data and evaluated on test data.", "Success in training does not guarantee generalisation; degree 12 shows this in the extreme.", "The irreducible error is a floor that no model can beat."])}
${link("en", "training and test data")}`)
  };

  /* ------------------------------------------------------------ Ünite 3 */
  C["m2-u3"] = {
    tr: wrap(`
<p class="c-lead">Bir model ne kadar esnek olmalı? Çok basit model gerçeği kaçırır, çok esnek model gürültüyü öğrenir. Bu iki hatanın adı eksik uyum ve aşırı uyumdur.</p>
${sec(1, 0, "Sezgi: terzi ve hazır giyim", `
${analogy("👔", "Hazır giyim gömlek herkese “aşağı yukarı” olur ama kimseye tam oturmaz (<b>eksik uyum</b>). Terzi senin ölçülerini alır ve gömlek tam oturur. Ama terzi ölçü alırken nefesini tuttuğun ânı, cebindeki telefonu da ölçüye katarsa, gömlek ertesi gün hiç olmaz (<b>aşırı uyum</b>). İyi model, kalıcı özellikleri alır, geçici olanları değil.")}`)}
${sec(2, 1, "Üç rejim", `
${cards([
      [0, "📏", "Eksik uyum", "Model, verideki yapıyı yakalayamayacak kadar basit. Hem eğitim hem test hatası yüksek. Örnek: düz çizgi (derece 1)."],
      [2, "🎯", "Yerinde", "Model, gerçek yapıyı yakalayacak kadar esnek, gürültüyü öğrenmeyecek kadar sade. İki hata da düşük ve birbirine yakın."],
      [4, "🌀", "Aşırı uyum", "Model, yapıyla birlikte gürültüyü de öğreniyor. Eğitim hatası çok düşük, test hatası çok yüksek. Örnek: derece 12."]
    ])}`)}
${sec(3, 2, "Esneklik arttıkça iki hata", `
${fig("u3_curve", "tr", "<b>Şekil 1.</b> Aynı 30 kişilik eğitim verisiyle kurulan 12 modelin eğitim ve test hataları. Eğitim hatası hiç artmıyor; test hatası derece 2 civarında dibe vurup sonra yükseliyor.")}
<p>Grafikteki iki eğri, modülün en önemli derslerinden birini anlatıyor:</p>
<ul><li><b>Eğitim hatası esneklikle hiç artmaz.</b> Derece 3 polinom, derece 2'nin yapabildiği her şeyi (ve fazlasını) yapabilir; eğitim verisine en az aynı ölçüde uyar.</li>
<li><b>Test hatası bir noktaya kadar düşer, sonra yükselir.</b> Düşüş, modelin gerçek yapıyı yakalamasından; yükseliş, gürültüyü öğrenmesinden gelir.</li>
<li><b>Aradaki açıklık ezberin ölçüsüdür.</b> Derece 2'de açıklık küçük (0,070 / 0,076), derece 12'de devasa (0,032 / 18,2).</li></ul>`)}
${sec(4, 3, "Çözümlü örnek: en iyi dereceyi seçmek", `
<table class="c-table"><thead><tr><th>Seçim kuralı</th><th>Seçilen derece</th><th>Neden?</th></tr></thead><tbody>
<tr class="bad"><td>En düşük eğitim hatası</td><td>12</td><td>Eğitim hatası hep düştüğü için kural her zaman en esnek modeli seçer</td></tr>
<tr class="hl"><td>En düşük test hatası</td><td>2</td><td>Yeni verideki başarıyı ölçer; gerçek ilişkinin biçimini buluyor</td></tr>
<tr><td>Çapraz doğrulama hatası (Ünite 6)</td><td>2</td><td>Test verisine dokunmadan aynı sonuca ulaşır</td></tr></tbody></table>
<p>Bu ünitede seçimi test hatasıyla yapıyoruz ama bu bir kısayol: test verisini model seçmek için kullanırsak artık “görülmemiş” değildir. Doğru yöntem Ünite 6'da.</p>`)}
${sec(5, 4, "Ekonomide aşırı uyum nerede karşımıza çıkar?", `
${cards([
      [1, "📈", "Borsa “stratejileri”", "Geçmiş verilerde yüzlerce kural denenip en iyisi seçilirse, o kural büyük olasılıkla şansı ezberlemiştir."],
      [2, "🏦", "Çok değişkenli öngörü", "30 yıllık yıllık veride 25 açıklayıcı değişkenli bir model, geçmişi kusursuz açıklar, geleceği öngöremez."],
      [3, "🧮", "Kriz dönemleri", "Tek bir kriz yılına göre ayarlanmış bir model, sıradan yıllarda kötü çalışabilir."]
    ])}`)}
${sec(6, 0, "Sık yapılan hatalar", pit([
      ["Model seçiminde eğitim hatasına bakmak", "Bu kural hep en karmaşık modeli seçer.", "Yeni veride ölçülen bir hataya (test ya da çapraz doğrulama) bak."],
      ["Daha karmaşık modeli “daha gerçekçi” sanmak", "Daha fazla terim daha fazla esneklik demektir, daha fazla doğruluk değil.", "Karmaşıklığı ancak yeni veride başarıyı artırıyorsa artır."],
      ["Tek bir örneklemden kesin sonuç çıkarmak", "Başka 30 kişiyle en iyi derece değişebilir.", "Sonucun değişkenliğine bak (Ünite 4)."]
    ]))}
${sum("Akılda kalsın", ["Eksik uyum: iki hata da yüksek. Aşırı uyum: eğitim hatası düşük, test hatası yüksek.", "Eğitim hatası esneklikle hiç artmaz; bu yüzden model seçmek için kullanılamaz.", "Eğitim ile test hatası arasındaki açıklık, modelin ne kadar ezberlediğini gösterir."])}
${link("tr", "eksik ve aşırı uyum")}`),
    en: wrap(`
<p class="c-lead">How flexible should a model be? A model that is too simple misses the truth; one that is too flexible learns the noise. These two mistakes are called underfitting and overfitting.</p>
${sec(1, 0, "Intuition: the tailor and off-the-peg", `
${analogy("👔", "An off-the-peg shirt fits everyone “roughly” but nobody exactly (<b>underfitting</b>). A tailor takes your measurements and the shirt fits perfectly. But if the tailor also measures the moment you held your breath and the phone in your pocket, the shirt will not fit at all the next day (<b>overfitting</b>). A good model captures lasting features, not passing ones.")}`)}
${sec(2, 1, "Three regimes", `
${cards([
      [0, "📏", "Underfitting", "The model is too simple to capture the structure in the data. Both training and test errors are high. Example: a straight line (degree 1)."],
      [2, "🎯", "Just right", "Flexible enough to capture the real structure, simple enough not to learn the noise. Both errors low and close."],
      [4, "🌀", "Overfitting", "The model learns the noise along with the structure. Training error very low, test error very high. Example: degree 12."]
    ])}`)}
${sec(3, 2, "The two errors as flexibility grows", `
${fig("u3_curve", "en", "<b>Figure 1.</b> Training and test errors of 12 models built on the same 30-person training data. Training error never rises; test error bottoms out around degree 2 and then climbs.")}
<p>The two curves tell one of the most important lessons of the module:</p>
<ul><li><b>Training error never rises with flexibility.</b> A degree-3 polynomial can do everything degree 2 can (and more); it fits the training data at least as well.</li>
<li><b>Test error falls up to a point, then rises.</b> The fall comes from capturing the real structure; the rise from learning the noise.</li>
<li><b>The gap between them measures memorisation.</b> At degree 2 the gap is small (0.070 / 0.076); at degree 12 it is enormous (0.032 / 18.2).</li></ul>`)}
${sec(4, 3, "Worked example: choosing the best degree", `
<table class="c-table"><thead><tr><th>Selection rule</th><th>Degree chosen</th><th>Why?</th></tr></thead><tbody>
<tr class="bad"><td>Lowest training error</td><td>12</td><td>Training error always falls, so the rule always picks the most flexible model</td></tr>
<tr class="hl"><td>Lowest test error</td><td>2</td><td>Measures success on new data; finds the shape of the true relationship</td></tr>
<tr><td>Cross-validation error (Unit 6)</td><td>2</td><td>Reaches the same result without touching the test data</td></tr></tbody></table>
<p>In this unit we choose with the test error, but that is a shortcut: if we use the test data to choose a model, they are no longer “unseen”. The right method comes in Unit 6.</p>`)}
${sec(5, 4, "Where does overfitting show up in economics?", `
${cards([
      [1, "📈", "Stock market “strategies”", "If hundreds of rules are tried on past data and the best is chosen, that rule has most likely memorised luck."],
      [2, "🏦", "Many-variable forecasting", "A model with 25 explanatory variables on 30 years of annual data explains the past perfectly and cannot forecast the future."],
      [3, "🧮", "Crisis periods", "A model tuned to a single crisis year may work poorly in ordinary years."]
    ])}`)}
${sec(6, 0, "Common mistakes", pit([
      ["Choosing a model by training error", "This rule always picks the most complex model.", "Look at an error measured on new data (test or cross-validation)."],
      ["Thinking a more complex model is “more realistic”", "More terms mean more flexibility, not more accuracy.", "Add complexity only if it improves success on new data."],
      ["Drawing firm conclusions from one sample", "With another 30 people the best degree could change.", "Look at how variable the result is (Unit 4)."]
    ]))}
${sum("Remember", ["Underfitting: both errors high. Overfitting: training error low, test error high.", "Training error never rises with flexibility, so it cannot be used to choose a model.", "The gap between training and test error shows how much the model has memorised."])}
${link("en", "underfitting and overfitting")}`)
  };

  /* ------------------------------------------------------------ Ünite 4 */
  C["m2-u4"] = {
    tr: wrap(`
<p class="c-lead">Ünite 3'teki sonuçlar tek bir 30 kişilik örnekleme dayanıyordu. Şansın etkisini ayıklamak için deneyi yüzlerce kez tekrarlayıp ortalama hatalara bakarız. Ortaya çıkan şekil, makine öğrenmesinin belki de en ünlü grafiğidir: U biçimli eğri.</p>
${sec(1, 0, "Sezgi: tek maç mı, sezon mu?", `
${analogy("⚽", "Bir takımın gücünü tek bir maçla ölçmek yanıltıcıdır: şanslı bir gol sonucu değiştirebilir. Bir sezonun ortalaması ise takımın gerçek düzeyini gösterir. Modeller de böyledir: tek bir örneklemdeki test hatası şansa bağlıdır, <b>yüzlerce örneklemin ortalaması</b> modelin gerçek davranışını gösterir.")}`)}
${sec(2, 1, "U biçimli eğri", `
${fig("u4_u", "tr", "<b>Şekil 1.</b> Her derece için 150 farklı 30 kişilik örneklemle model kuruldu; çizgiler ortalama hatalar. Kesikli çizgi indirgenemez hata (0,0625).")}
<p>Eğriyi soldan sağa oku:</p>
<ol class="c-steps">
<li><p><b>Sol kol (eksik uyum):</b> derece 1'de model ilişkinin eğriliğini yakalayamıyor; test hatası yüksek.</p></li>
<li><p><b>Dip:</b> derece 2 civarında model gerçek yapıyı yakalıyor ama henüz gürültüyü öğrenmiyor. En düşük ortalama test hatası burada.</p></li>
<li><p><b>Sağ kol (aşırı uyum):</b> derece arttıkça model her örneklemin gürültüsüne uyuyor; test hatası hızla yükseliyor.</p></li>
<li><p><b>Alt sınır:</b> test hatası hiçbir zaman kesikli çizginin (indirgenemez hata) altına inmiyor.</p></li>
</ol>`)}
${sec(3, 2, "Test hatası neden indirgenemez hatanın altına inemez?", `
<div class="c-formula"><div class="eq">log ücret = <i>f</i>(deneyim) + <i>u</i></div>
<dl><dt>f</dt><dd>gerçek ilişki: veriden öğrenilebilen kısım</dd><dt>u</dt><dd>kişiye özgü, öngörülemez kısım (şans, ölçülmeyen özellikler). Varyansı 0,0625</dd></dl></div>
<p>En iyi model bile ancak <i>f</i>'yi mükemmel öğrenebilir; <i>u</i>'yu asla. Bu yüzden test hatasının <b>0,0625'in altına inmesi imkânsızdır</b>. Eğitim hatası bu sınırın altına inerse (Ünite 2'deki derece 12), model <i>u</i>'yu ezberlemiştir.</p>`)}
${sec(4, 3, "Veri miktarı U'yu nasıl değiştirir?", `
<div class="c-two">${fig("u4_n", "tr", "<b>Şekil 2.</b> Aynı deney, 30 ve 150 kişilik eğitim verisiyle.")}
<div><p>Daha çok veriyle iki şey olur:</p><ul><li>Her derecede test hatası <b>azalır</b>: model daha az şansa bağlıdır.</li><li>Sağ kol <b>daha yavaş yükselir</b>: esnek modeller daha güvenli kullanılabilir hâle gelir.</li></ul><p><b>Ders:</b> “Doğru esneklik” sabit bir sayı değildir; elindeki veri miktarına bağlıdır. Az veriyle sade modeller, çok veriyle daha esnek modeller tercih edilir.</p></div></div>`)}
${sec(5, 4, "Tek örneklem ne kadar yanıltabilir?", `
<table class="c-table"><thead><tr><th>Yaklaşım</th><th>Sonuç</th><th>Güvenilirlik</th></tr></thead><tbody>
<tr class="bad"><td>Tek bir 30 kişilik örneklem</td><td>En iyi derece 2, 3, 4 ya da 5 çıkabilir</td><td>Düşük: yakın modellerin sırası şansa bağlı</td></tr>
<tr class="hl"><td>150 örneklemin ortalaması</td><td>En iyi derece 2</td><td>Yüksek: şans ortalamada siliniyor</td></tr></tbody></table>
<p>Gerçek hayatta elimizde genellikle tek bir veri seti vardır; deneyi yüzlerce kez tekrarlayamayız. Çapraz doğrulama (Ünite 6), tek veri setiyle bu tekrarı taklit etmenin bir yoludur.</p>`)}
${sec(6, 0, "Sık yapılan hatalar", pit([
      ["Tek bir sonucu “kesin” diye sunmak", "Küçük örneklemde yakın modellerin sırası şansla değişir.", "Değişkenliği raporla; mümkünse tekrarla ya da çapraz doğrulama kullan."],
      ["Test hatasının sıfıra inebileceğini sanmak", "İndirgenemez hata her zaman kalır.", "Modelin başarısını bu alt sınıra olan uzaklıkla değerlendir."],
      ["Esnekliği veri miktarından bağımsız seçmek", "Az veriyle esnek modeller hızla aşırı uyar.", "Veri azsa sade başla."]
    ]))}
${sum("Akılda kalsın", ["Ortalama test hatası esnekliğe karşı U çizer: önce eksik uyum azalır, sonra aşırı uyum artar.", "Test hatası indirgenemez hatanın altına inemez.", "Daha çok veri, U'nun dibini sağa kaydırır: esnek modeller daha güvenli olur."])}
${link("tr", "U biçimli eğri")}`),
    en: wrap(`
<p class="c-lead">The results in Unit 3 rested on a single sample of 30 people. To strip out luck we repeat the experiment hundreds of times and look at the average errors. The shape that emerges is perhaps the most famous chart in machine learning: the U-shaped curve.</p>
${sec(1, 0, "Intuition: one match or a season?", `
${analogy("⚽", "Judging a team by a single match is misleading: a lucky goal can change the result. A season's average shows the team's real level. Models are the same: the test error in a single sample depends on luck; <b>the average over hundreds of samples</b> shows the model's real behaviour.")}`)}
${sec(2, 1, "The U-shaped curve", `
${fig("u4_u", "en", "<b>Figure 1.</b> For each degree, models were built on 150 different 30-person samples; the lines are average errors. Dashed line: the irreducible error (0.0625).")}
<p>Read the curve from left to right:</p>
<ol class="c-steps">
<li><p><b>Left arm (underfitting):</b> at degree 1 the model cannot capture the curvature; the test error is high.</p></li>
<li><p><b>Bottom:</b> around degree 2 the model captures the real structure but does not yet learn the noise. The lowest average test error is here.</p></li>
<li><p><b>Right arm (overfitting):</b> as the degree rises, the model follows each sample's noise; the test error climbs fast.</p></li>
<li><p><b>Floor:</b> the test error never goes below the dashed line (the irreducible error).</p></li>
</ol>`)}
${sec(3, 2, "Why can test error not go below the irreducible error?", `
<div class="c-formula"><div class="eq">log wage = <i>f</i>(experience) + <i>u</i></div>
<dl><dt>f</dt><dd>the true relationship: the part that can be learned from data</dd><dt>u</dt><dd>the person-specific, unpredictable part (luck, unmeasured traits). Its variance is 0.0625</dd></dl></div>
<p>Even the best model can at most learn <i>f</i> perfectly, never <i>u</i>. So it is <b>impossible for the test error to go below 0.0625</b>. If the training error goes below this floor (degree 12 in Unit 2), the model has memorised <i>u</i>.</p>`)}
${sec(4, 3, "How does the amount of data change the U?", `
<div class="c-two">${fig("u4_n", "en", "<b>Figure 2.</b> The same experiment with 30-person and 150-person training data.")}
<div><p>With more data two things happen:</p><ul><li>Test error <b>falls</b> at every degree: the model depends less on luck.</li><li>The right arm <b>rises more slowly</b>: flexible models become safer to use.</li></ul><p><b>Lesson:</b> the “right flexibility” is not a fixed number; it depends on how much data you have. With little data, simple models; with lots of data, more flexible ones.</p></div></div>`)}
${sec(5, 4, "How misleading can a single sample be?", `
<table class="c-table"><thead><tr><th>Approach</th><th>Result</th><th>Reliability</th></tr></thead><tbody>
<tr class="bad"><td>One 30-person sample</td><td>The best degree may come out as 2, 3, 4 or 5</td><td>Low: the ranking of similar models depends on luck</td></tr>
<tr class="hl"><td>Average over 150 samples</td><td>The best degree is 2</td><td>High: luck averages out</td></tr></tbody></table>
<p>In real life we usually have a single data set; we cannot repeat the experiment hundreds of times. Cross-validation (Unit 6) is a way of mimicking this repetition with a single data set.</p>`)}
${sec(6, 0, "Common mistakes", pit([
      ["Presenting a single result as “definitive”", "In small samples the ranking of similar models changes with luck.", "Report the variability; repeat if possible or use cross-validation."],
      ["Thinking test error can reach zero", "The irreducible error always remains.", "Judge a model by its distance from this floor."],
      ["Choosing flexibility regardless of data size", "With little data flexible models overfit quickly.", "With little data, start simple."]
    ]))}
${sum("Remember", ["Average test error traces a U against flexibility: underfitting falls first, then overfitting rises.", "Test error cannot go below the irreducible error.", "More data move the bottom of the U to the right: flexible models become safer."])}
${link("en", "the U-shaped curve")}`)
  };

  /* ------------------------------------------------------------ Ünite 5 */
  C["m2-u5"] = {
    tr: wrap(`
<p class="c-lead">U eğrisinin neden U olduğunu iki kavram açıklar: yanlılık ve varyans. Biri basit modellerin, diğeri esnek modellerin hastalığıdır. İyi model ikisini dengeler.</p>
${sec(1, 0, "Sezgi: dart tahtası", `
${fig("u5_dart", "tr", "<b>Şekil 1.</b> Merkez gerçek değer; her nokta, farklı bir örneklemle eğitilmiş bir modelin öngörüsü.")}
${cards([
      [4, "🎯", "Yanlılık", "Atışların <b>ortalaması</b> merkezden ne kadar uzak? Sistematik hata. Dart oyuncusunun nişanı kaymış."],
      [1, "💥", "Varyans", "Atışlar kendi ortalamaları etrafında ne kadar <b>dağınık</b>? Oynaklık. Dart oyuncusunun eli titriyor."]
    ])}`)}
${sec(2, 1, "Ücret örneğinde yanlılık ve varyans", `
${fig("u5_curves", "tr", "<b>Şekil 2.</b> Her ince çizgi 30 kişilik farklı bir örneklemle kurulmuş bir model (25 model); kalın kesikli çizgi gerçek ilişki.")}
<table class="c-table"><thead><tr><th>Model</th><th>Yanlılık</th><th>Varyans</th><th>Dart tahtasında</th></tr></thead><tbody>
<tr><td>Derece 1</td><td>Yüksek: düz çizgi eğriliği hiç yakalayamıyor</td><td>Düşük: 25 çizgi birbirine çok benzer</td><td>Sıkı ama merkezin dışında</td></tr>
<tr class="hl"><td>Derece 2</td><td>Düşük</td><td>Düşük</td><td>Sıkı ve merkezde</td></tr>
<tr><td>Derece 12</td><td>Düşük: ortalamada gerçeğe yakın</td><td>Çok yüksek: her örneklemde bambaşka</td><td>Merkez etrafında ama çok dağınık</td></tr></tbody></table>`)}
${sec(3, 2, "Ayrıştırma: test hatasının üç parçası", `
<div class="c-formula"><div class="eq">beklenen test hatası = yanlılık² + varyans + indirgenemez hata</div>
<dl><dt>yanlılık²</dt><dd>öngörülerin ortalamasının gerçek değerden uzaklığının karesi</dd><dt>varyans</dt><dd>öngörülerin örneklemden örnekleme ne kadar oynadığı</dd><dt>indirgenemez</dt><dd>hiçbir modelin öngöremeyeceği sapmanın varyansı (0,0625)</dd></dl></div>
${fig("u5_decomp", "tr", "<b>Şekil 3.</b> Her derece için beklenen test hatasının parçaları (300 örneklem, 2–38 yıl arası deneyim üzerinden ortalama). Derece arttıkça yanlılık eriyor, varyans büyüyor.")}
<p>Grafiği oku: derece 1'de çubuğun büyük kısmı <b>yanlılık</b>. Derece 2'de yanlılık neredeyse sıfır, varyans küçük: toplam en düşük. Derece 6'dan sonra <b>varyans</b> patlıyor. U eğrisinin dibi, bu iki parçanın toplamının en küçük olduğu yer: <b>yanlılık–varyans dengesi</b>.</p>`)}
${sec(4, 3, "Çözümlü örnek: 20 yıl deneyimli bir kişi", `
<ol class="c-steps">
<li><p>200 farklı 30 kişilik örneklemle aynı dereceden model kur; her birinden 20 yıl deneyimli biri için öngörü al. Elinde 200 öngörü olur.</p></li>
<li><p><b>Yanlılık²</b> = (200 öngörünün ortalaması − gerçek değer)². Gerçek değer: 2,0 + 0,08·20 − 0,0014·400 = <b>3,04</b>.</p></li>
<li><p><b>Varyans</b> = 200 öngörünün varyansı.</p></li>
<li><p>Simülasyon sonucu: derece 1 → yanlılık² ≈ 0,03, varyans ≈ 0,003. Derece 12 → yanlılık² ≈ 0, varyans ≈ 0,026. Derece 2 → ikisi de küçük.</p></li>
</ol>`)}
${sec(5, 4, "Ekonomideki yansımaları", `
${cards([
      [1, "📊", "Az veri, çok parametre", "Kısa makro serilerde çok parametreli modeller yüksek varyanslıdır: her yeni veriyle katsayılar değişir."],
      [2, "🔁", "Modül 1'deki katsayılar", "Çok benzer iki değişkenin katsayılarının örneklemden örnekleme oynaması da yüksek varyansın bir örneğiydi."],
      [3, "⚖️", "Bilinçli yanlılık", "Biraz yanlılık kabul edip varyansı ciddi biçimde düşüren yöntemler var; dersin sonraki haftalarında göreceksin."]
    ])}`)}
${sec(6, 0, "Sık yapılan hatalar", pit([
      ["Düşük yanlılığı tek başına yeterli sanmak", "Derece 12'nin yanlılığı düşük ama varyansı yüzünden test hatası devasa.", "Her zaman toplam hataya (yanlılık² + varyans) bak."],
      ["Varyansı “ortalamadan uzaklık” diye tanımlamak", "Gerçekten uzaklık yanlılıktır; varyans öngörülerin kendi ortalamaları etrafındaki dağınıklığıdır.", "Dart tahtasını hatırla: nişan mı kaymış, el mi titriyor?"],
      ["Basit modeli her zaman güvenli sanmak", "Çok basit model sistematik olarak yanılır.", "Yanlılık ile varyans arasında denge ara."]
    ]))}
${sum("Akılda kalsın", ["Yanlılık: öngörülerin ortalaması gerçekten ne kadar uzak. Varyans: öngörüler ne kadar oynak.", "Beklenen test hatası = yanlılık² + varyans + indirgenemez hata.", "Esneklik arttıkça yanlılık düşer, varyans artar; iyi model ikisini dengeler."])}
${link("tr", "yanlılık ve varyans")}`),
    en: wrap(`
<p class="c-lead">Two concepts explain why the U curve is a U: bias and variance. One is the disease of simple models, the other of flexible models. A good model balances them.</p>
${sec(1, 0, "Intuition: the dartboard", `
${fig("u5_dart", "en", "<b>Figure 1.</b> The centre is the true value; each dot is the prediction of a model trained on a different sample.")}
${cards([
      [4, "🎯", "Bias", "How far is the <b>average</b> throw from the centre? Systematic error. The player's aim is off."],
      [1, "💥", "Variance", "How <b>scattered</b> are the throws around their own average? Erratic behaviour. The player's hand shakes."]
    ])}`)}
${sec(2, 1, "Bias and variance in the wage example", `
${fig("u5_curves", "en", "<b>Figure 2.</b> Each thin line is a model built on a different 30-person sample (25 models); the thick dashed line is the true relationship.")}
<table class="c-table"><thead><tr><th>Model</th><th>Bias</th><th>Variance</th><th>On the dartboard</th></tr></thead><tbody>
<tr><td>Degree 1</td><td>High: a straight line cannot capture the curvature</td><td>Low: the 25 lines look very alike</td><td>Tight but off centre</td></tr>
<tr class="hl"><td>Degree 2</td><td>Low</td><td>Low</td><td>Tight and centred</td></tr>
<tr><td>Degree 12</td><td>Low: close to the truth on average</td><td>Very high: different in every sample</td><td>Around the centre but very scattered</td></tr></tbody></table>`)}
${sec(3, 2, "The decomposition: three parts of test error", `
<div class="c-formula"><div class="eq">expected test error = bias² + variance + irreducible error</div>
<dl><dt>bias²</dt><dd>the squared distance between the average prediction and the true value</dd><dt>variance</dt><dd>how much predictions swing from sample to sample</dd><dt>irreducible</dt><dd>the variance of the deviation no model can predict (0.0625)</dd></dl></div>
${fig("u5_decomp", "en", "<b>Figure 3.</b> The parts of expected test error for each degree (300 samples, averaged over experience from 2 to 38 years). As the degree rises, bias melts away and variance grows.")}
<p>Read the chart: at degree 1 most of the bar is <b>bias</b>. At degree 2 bias is almost zero and variance small: the total is lowest. From degree 6 on, <b>variance</b> explodes. The bottom of the U curve is where the sum of these two parts is smallest: the <b>bias–variance trade-off</b>.</p>`)}
${sec(4, 3, "Worked example: a person with 20 years of experience", `
<ol class="c-steps">
<li><p>Build a model of the same degree on 200 different 30-person samples; from each, get a prediction for someone with 20 years of experience. You now have 200 predictions.</p></li>
<li><p><b>Bias²</b> = (average of the 200 predictions − true value)². The true value: 2.0 + 0.08·20 − 0.0014·400 = <b>3.04</b>.</p></li>
<li><p><b>Variance</b> = the variance of the 200 predictions.</p></li>
<li><p>Simulation result: degree 1 → bias² ≈ 0.03, variance ≈ 0.003. Degree 12 → bias² ≈ 0, variance ≈ 0.026. Degree 2 → both small.</p></li>
</ol>`)}
${sec(5, 4, "Echoes in economics", `
${cards([
      [1, "📊", "Few data, many parameters", "On short macro series, many-parameter models have high variance: the coefficients change with every new data point."],
      [2, "🔁", "The coefficients in Module 1", "Coefficients of two very similar variables swinging from sample to sample was also an example of high variance."],
      [3, "⚖️", "Deliberate bias", "Some methods accept a little bias to cut variance sharply; you will meet them in later weeks of the course."]
    ])}`)}
${sec(6, 0, "Common mistakes", pit([
      ["Thinking low bias alone is enough", "Degree 12 has low bias but a huge test error because of its variance.", "Always look at the total error (bias² + variance)."],
      ["Defining variance as “distance from the truth”", "Distance from the truth is bias; variance is the spread of predictions around their own average.", "Remember the dartboard: is the aim off, or is the hand shaking?"],
      ["Assuming a simple model is always safe", "A model that is too simple is systematically wrong.", "Look for a balance between bias and variance."]
    ]))}
${sum("Remember", ["Bias: how far the average prediction is from the truth. Variance: how erratic the predictions are.", "Expected test error = bias² + variance + irreducible error.", "As flexibility rises, bias falls and variance rises; a good model balances the two."])}
${link("en", "bias and variance")}`)
  };

  /* ------------------------------------------------------------ Ünite 6 */
  const cvRows = (lang) => (N.u6 || []).map(([d, tr, cv, te]) => {
    const best = d === 2;
    const f3 = (v) => (v > 9 ? nf(v, 1, lang) : nf(v, 3, lang));
    return `<tr class="${best ? "hl" : (cv > 9 ? "bad" : "")}"><td>${d}</td><td class="n">${f3(tr)}</td><td class="n">${f3(cv)}</td><td class="n">${f3(te)}</td></tr>`;
  }).join("");
  C["m2-u6"] = {
    tr: wrap(`
<p class="c-lead">Test verisine bakarak model seçmek bir hiledir. Peki test verisine dokunmadan en iyi modeli nasıl buluruz? Yanıt, eğitim verisinin içinde küçük “sınavlar” düzenlemek: çapraz doğrulama.</p>
${sec(1, 0, "Sezgi: deneme sınavları", `
${analogy("📝", "Asıl sınavın soruları gizli ve tek seferlik. Hazırlanırken asıl sınava bakamazsın; bunun yerine kendi soru havuzundan <b>deneme sınavları</b> yaparsın. Her denemede soruların bir kısmını kenara ayırır, kalanıyla çalışır, ayırdıklarınla kendini sınarsın. Çapraz doğrulama da tam olarak budur: test verisi asıl sınav, katlar deneme sınavları.")}`)}
${sec(2, 1, "k-katlı çapraz doğrulama adım adım", `
${fig("u6_folds", "tr", "<b>Şekil 1.</b> 30 gözlem 5 kata bölünür. Her turda bir kat doğrulamaya ayrılır (turuncu), model kalan 4 katla kurulur. Her gözlem tam bir kez doğrulamada kullanılır.")}
<ol class="c-steps">
<li><p>Eğitim verisini <b>karıştır</b> ve k eşit parçaya (kat) böl. Yaygın seçimler: k = 5 ya da k = 10.</p></li>
<li><p>Her turda bir katı <b>doğrulama</b> için ayır, modeli kalan k − 1 katla kur, ayırdığın katta hatayı ölç.</p></li>
<li><p>k turun hatalarının ortalaması, o modelin <b>çapraz doğrulama hatasıdır</b>.</p></li>
<li><p>Her aday model için (her derece) tekrarla; çapraz doğrulama hatası en küçük olanı seç.</p></li>
</ol>`)}
${sec(3, 2, "Bütün süreç: test verisi en sona", `
${fig("u6_flow", "tr", "<b>Şekil 2.</b> Model seçme ve değerlendirmenin doğru sırası.")}
<p>Bu akışın kalbi şu kural: <b>test verisi model seçiminde hiç kullanılmaz ve en sonda bir kez kullanılır.</b> Test sonucuna bakıp modeli değiştirirsen, test verisi artık doğrulama verisine dönüşür ve raporladığın hata iyimser olur.</p>`)}
${sec(4, 3, "Çözümlü örnek: 5-katlı çapraz doğrulamayla derece seçmek", `
<table class="c-table"><thead><tr><th>Derece</th><th class="n">Eğitim HKO</th><th class="n">Çapraz doğrulama HKO</th><th class="n">Test HKO (2.000 kişi)</th></tr></thead><tbody>${cvRows("tr")}</tbody></table>
<ul><li>Eğitim hatasına bakan biri <b>derece 8</b>'i seçerdi (en düşük eğitim hatası).</li><li>Çapraz doğrulama, test verisine hiç bakmadan <b>derece 2</b>'yi seçiyor; test hatası da onu doğruluyor.</li><li>Derece 7 ve 8'in çapraz doğrulama hatası 100'ün üzerinde: tek bir katta bile aşırı esnek model felakete dönüşüyor.</li></ul>
<p>Not: küçük örneklemde çapraz doğrulama hatası gürültülüdür; derece 3–6'nın test hatası derece 2'ye yakın olduğu hâlde çapraz doğrulama onları olduğundan kötü gösteriyor. Yine de modelleri sıralamak ve iyi olanı seçmek için işini görüyor.</p>`)}
${sec(5, 4, "k nasıl seçilir?", `
${cards([
      [0, "5️⃣", "k = 5", "Yaygın ve hızlı. Her turda verinin %80'iyle model kurulur."],
      [1, "🔟", "k = 10", "Daha az yanlı, biraz daha yavaş. Veri yeterliyse yaygın tercih."],
      [2, "1️⃣", "k = n (birini dışarıda bırak)", "Her turda tek gözlem doğrulanır. Çok küçük veride kullanılır; hesap yükü yüksek."]
    ])}`)}
${sec(6, 0, "Sık yapılan hatalar", pit([
      ["Doğrulama katını eğitime de katmak", "Model, sınandığı gözlemleri görmüş olur; çapraz doğrulama hatası eğitim hatasına dönüşür.", "Her turda eğitim ve doğrulama ortak gözlem içermesin; bunu bir kontrolle sına."],
      ["Test sonucuna göre modeli değiştirmek", "Test verisi model seçimine karışır; raporlanan hata iyimser olur.", "Model seçimini yalnızca çapraz doğrulamayla yap."],
      ["Zaman serisinde katları karıştırmak", "Model geleceği görür (Ünite 8).", "Zaman serisinde genişleyen pencereli doğrulama kullan."]
    ]))}
${sum("Akılda kalsın", ["Çapraz doğrulama, test verisine dokunmadan model seçmenin yoludur.", "Her gözlem bir kez doğrulamada, k − 1 kez eğitimde kullanılır; hiçbir turda ikisinde birden değil.", "Test verisi en sonda, seçilen model için bir kez kullanılır."])}
${link("tr", "çapraz doğrulama")}`),
    en: wrap(`
<p class="c-lead">Choosing a model by looking at the test data is cheating. So how do we find the best model without touching the test data? The answer is to hold small “exams” inside the training data: cross-validation.</p>
${sec(1, 0, "Intuition: mock exams", `
${analogy("📝", "The real exam's questions are secret and used once. While preparing you cannot look at the real exam; instead you set yourself <b>mock exams</b> from your own question pool. In each mock you set aside some questions, study with the rest, and test yourself with the ones you set aside. Cross-validation is exactly this: the test data are the real exam, the folds are the mock exams.")}`)}
${sec(2, 1, "k-fold cross-validation step by step", `
${fig("u6_folds", "en", "<b>Figure 1.</b> 30 observations split into 5 folds. In each round one fold is held out for validation (orange) and the model is built on the other 4. Every observation is used for validation exactly once.")}
<ol class="c-steps">
<li><p><b>Shuffle</b> the training data and split them into k equal parts (folds). Common choices: k = 5 or k = 10.</p></li>
<li><p>In each round, hold out one fold for <b>validation</b>, build the model on the other k − 1 folds and measure the error on the held-out fold.</p></li>
<li><p>The average of the k rounds' errors is the model's <b>cross-validation error</b>.</p></li>
<li><p>Repeat for every candidate model (every degree); choose the one with the smallest cross-validation error.</p></li>
</ol>`)}
${sec(3, 2, "The whole process: test data last", `
${fig("u6_flow", "en", "<b>Figure 2.</b> The right order for choosing and evaluating a model.")}
<p>The heart of this flow is one rule: <b>the test data are never used in model choice and are used once, at the end.</b> If you change the model after looking at the test result, the test data turn into validation data and the error you report becomes optimistic.</p>`)}
${sec(4, 3, "Worked example: choosing the degree with 5-fold cross-validation", `
<table class="c-table"><thead><tr><th>Degree</th><th class="n">Training MSE</th><th class="n">Cross-validation MSE</th><th class="n">Test MSE (2,000 people)</th></tr></thead><tbody>${cvRows("en")}</tbody></table>
<ul><li>Someone looking at training error would pick <b>degree 8</b> (the lowest training error).</li><li>Cross-validation picks <b>degree 2</b> without ever looking at the test data, and the test error confirms it.</li><li>Degrees 7 and 8 have cross-validation errors above 100: overly flexible models blow up on even a single fold.</li></ul>
<p>Note: in small samples the cross-validation error is noisy; degrees 3–6 have test errors close to degree 2, yet cross-validation makes them look worse than they are. Still, it does the job of ranking models and picking a good one.</p>`)}
${sec(5, 4, "How do you choose k?", `
${cards([
      [0, "5️⃣", "k = 5", "Common and fast. Each round builds the model on 80% of the data."],
      [1, "🔟", "k = 10", "Less biased, a little slower. A common choice when there are enough data."],
      [2, "1️⃣", "k = n (leave one out)", "Each round validates a single observation. Used with very small data; computationally heavy."]
    ])}`)}
${sec(6, 0, "Common mistakes", pit([
      ["Including the validation fold in training", "The model sees the observations it is evaluated on; cross-validation error turns into training error.", "Make sure training and validation share no observation in any round; test this with a check."],
      ["Changing the model after seeing the test result", "The test data leak into model choice; the reported error becomes optimistic.", "Choose the model with cross-validation only."],
      ["Shuffling folds in time series", "The model sees the future (Unit 8).", "Use expanding-window validation for time series."]
    ]))}
${sum("Remember", ["Cross-validation is how you choose a model without touching the test data.", "Each observation is used once for validation and k − 1 times for training; never both in the same round.", "The test data are used once, at the end, for the chosen model."])}
${link("en", "cross-validation")}`)
  };

  /* ------------------------------------------------------------ Ünite 7 */
  C["m2-u7"] = {
    tr: wrap(`
<p class="c-lead">Veri sızıntısı, modelin öngörü anında elinde olmayacak bir bilgiyi “görmesi”dir. Sızıntılı model kâğıt üzerinde olağanüstü başarılı görünür, gerçek hayatta çöker. En tehlikeli yanı: hiçbir hata mesajı vermez.</p>
${sec(1, 0, "Sezgi: sınav kâğıdının arkası", `
${analogy("🔍", "Bir öğrencinin deneme sınavında %100 aldığını düşün. Sonra cevap anahtarının sınav kâğıdının arkasına basıldığı ortaya çıkıyor. Öğrenci bir şey öğrenmiş mi? Hayır; asıl sınavda kâğıdın arkası boş olacak. Sızıntılı bir modelin test başarısı da böyledir: cevap, sorunun içine gizlice sızmıştır.")}`)}
${sec(2, 1, "Üç tür sızıntı", `
${fig("u7_types", "tr", "<b>Şekil 1.</b> Sızıntının üç yaygın türü ve örnekleri.")}
<div class="c-formula"><div class="eq">Altın soru: “Bu bilgi, öngörüyü yapacağım anda elimde olur muydu?”</div><dl><dt>Hayır ise</dt><dd>sızıntı var. Özelliği çıkar ya da öngörü anında bilinen bir sürümünü kullan.</dd></dl></div>`)}
${sec(3, 2, "Test bilgisinin eğitime sızması: zaman çizelgesi", `
${fig("u7_timeline", "tr", "<b>Şekil 2.</b> Ölçekleme, doldurma gibi hazırlık adımlarının değerleri yalnızca eğitim döneminden öğrenilmeli.")}
<table class="c-table"><thead><tr><th>Adım</th><th>✗ Sızıntılı</th><th>✓ Doğru</th></tr></thead><tbody>
<tr><td>Ölçekleme</td><td><code>veri["x"].mean()</code> ile tüm veriden</td><td><code>egitim["x"].mean()</code>; aynı değer teste uygulanır</td></tr>
<tr><td>Eksik doldurma</td><td>Tüm verinin medyanıyla doldurup sonra bölmek</td><td>Önce böl; medyanı eğitimden hesapla, iki tarafa uygula</td></tr>
<tr><td>Model seçimi</td><td>Test sonucuna göre ayar yapmak</td><td>Yalnızca çapraz doğrulama</td></tr>
<tr><td>Zaman serisi özelliği</td><td><code>rolling(3, center=True)</code>, <code>shift(-1)</code></td><td><code>shift(1).rolling(3)</code>: yalnızca geçmiş</td></tr></tbody></table>`)}
${sec(4, 3, "Çözümlü örnek: işsizlikte gelecekten bilgi", `
<ol class="c-steps">
<li><p>Amaç: bu ayın işsizlik oranını öngörmek. Aday özellik: “son 3 ayın ortalaması”.</p></li>
<li><p>Ortalanmış pencere (<code>center=True</code>) Mart için Şubat, <b>Mart</b> ve <b>Nisan</b>'ın ortalamasını alır. Öngörmek istediğimiz Mart'ın kendisi ve gelecek ay özelliğin içinde: korelasyon 0,99'un üzerine çıkar.</p></li>
<li><p>Doğrusu: önce bir ay kaydır, sonra ortalama al: Mart için Aralık, Ocak, Şubat. Korelasyon biraz düşer ama artık dürüsttür.</p></li>
<li><p>Kural: zaman serisinde her özellik için “bu değer öngörü ayının <b>başında</b> biliniyor muydu?” diye sor.</p></li>
</ol>`)}
${sec(5, 4, "Uyarı işaretleri", `
${cards([
      [4, "🚩", "Olağanüstü yüksek başarı", "%99 doğruluk ya da gürültüden düşük hata, önce sızıntı şüphesi uyandırmalı."],
      [3, "🚩", "Tek bir özellik her şeyi açıklıyor", "Bir özelliğin önemi diğerlerinin çok üstündeyse, zamanlamasını sorgula."],
      [2, "🚩", "Gerçek kullanımda çöküş", "Testte iyi, canlıda kötü bir model çoğu zaman sızıntının kurbanıdır."]
    ])}`)}
${sec(6, 0, "Sık yapılan hatalar", pit([
      ["Hazırlığı bölmeden önce tüm veriyle yapmak", "Test verisinin ortalaması, medyanı ya da yayılımı eğitime girer.", "Önce böl, sonra hazırlık değerlerini eğitimden öğren."],
      ["Sonuçtan sonra oluşan bir sütunu özellik yapmak", "Model, cevabı veren bir bilgiyi kullanır (hedef sızıntısı).", "Her sütunun ne zaman oluştuğunu sor."],
      ["Yüksek korelasyonu başarı sanmak", "Sızıntılı özellikler hedefle neredeyse kusursuz ilişkilidir.", "Önce zamanlamayı kontrol et, sonra sevin."]
    ]))}
${sum("Akılda kalsın", ["Sızıntı: öngörü anında bilinemeyecek bilginin modele girmesi.", "Üç tür: hedef sızıntısı, test bilgisinin eğitime sızması, gelecekten bilgi.", "Altın soru: “Bu bilgi öngörüyü yapacağım anda elimde olur muydu?”"])}
${link("tr", "veri sızıntısı")}`),
    en: wrap(`
<p class="c-lead">Data leakage is when a model “sees” information it would not have at prediction time. A leaky model looks extraordinarily successful on paper and collapses in real life. The most dangerous part: it gives no error message.</p>
${sec(1, 0, "Intuition: the back of the exam paper", `
${analogy("🔍", "Imagine a student scoring 100% in a mock exam. Then it turns out the answer key was printed on the back of the paper. Has the student learned anything? No; in the real exam the back will be blank. A leaky model's test success is the same: the answer has secretly leaked into the question.")}`)}
${sec(2, 1, "Three kinds of leakage", `
${fig("u7_types", "en", "<b>Figure 1.</b> The three common kinds of leakage, with examples.")}
<div class="c-formula"><div class="eq">The golden question: “Would I have this information at the moment I make the prediction?”</div><dl><dt>If not</dt><dd>there is leakage. Drop the feature or use a version known at prediction time.</dd></dl></div>`)}
${sec(3, 2, "Test information leaking into training: a timeline", `
${fig("u7_timeline", "en", "<b>Figure 2.</b> The values used in preparation steps such as scaling and filling must be learned from the training period only.")}
<table class="c-table"><thead><tr><th>Step</th><th>✗ Leaky</th><th>✓ Right</th></tr></thead><tbody>
<tr><td>Scaling</td><td><code>data["x"].mean()</code> from all the data</td><td><code>train["x"].mean()</code>; the same value is applied to test</td></tr>
<tr><td>Filling gaps</td><td>Fill with the median of all the data, then split</td><td>Split first; compute the median on training, apply to both</td></tr>
<tr><td>Model choice</td><td>Tuning based on the test result</td><td>Cross-validation only</td></tr>
<tr><td>Time series feature</td><td><code>rolling(3, center=True)</code>, <code>shift(-1)</code></td><td><code>shift(1).rolling(3)</code>: the past only</td></tr></tbody></table>`)}
${sec(4, 3, "Worked example: information from the future in unemployment", `
<ol class="c-steps">
<li><p>Goal: predict this month's unemployment rate. Candidate feature: “average of the last 3 months”.</p></li>
<li><p>A centred window (<code>center=True</code>) for March takes the average of February, <b>March</b> and <b>April</b>. March itself, the value we want to predict, and the next month are inside the feature: the correlation rises above 0.99.</p></li>
<li><p>The right way: shift by one month first, then average: for March, December, January and February. The correlation falls slightly but is now honest.</p></li>
<li><p>Rule: in time series, ask of every feature “was this value known at the <b>start</b> of the month being predicted?”</p></li>
</ol>`)}
${sec(5, 4, "Warning signs", `
${cards([
      [4, "🚩", "Extraordinarily high performance", "99% accuracy, or an error below the noise, should first raise suspicion of leakage."],
      [3, "🚩", "One feature explains everything", "If one feature's importance dwarfs all others, question its timing."],
      [2, "🚩", "Collapse in real use", "A model that is good in testing and bad in production is often a victim of leakage."]
    ])}`)}
${sec(6, 0, "Common mistakes", pit([
      ["Preparing all the data before splitting", "The test data's mean, median or spread enter training.", "Split first, then learn the preparation values from training."],
      ["Using a column created after the outcome as a feature", "The model uses information that gives away the answer (target leakage).", "Ask when each column comes into existence."],
      ["Taking high correlation as success", "Leaky features are almost perfectly related to the target.", "Check the timing first, then celebrate."]
    ]))}
${sum("Remember", ["Leakage: information that could not be known at prediction time entering the model.", "Three kinds: target leakage, test information leaking into training, information from the future.", "The golden question: “Would I have this information at the moment I make the prediction?”"])}
${link("en", "data leakage")}`)
  };

  /* ------------------------------------------------------------ Ünite 8 */
  C["m2-u8"] = {
    tr: wrap(`
<p class="c-lead">Ekonomi ve finans verilerinin çoğu zaman serisidir: enflasyon, işsizlik, kur, faiz. Zaman serilerinde rastgele bölme, modelin geleceği görmesine yol açar. Kural basit: geçmişle eğit, gelecekle sına.</p>
${sec(1, 0, "Sezgi: dünün gazetesiyle bugünü tahmin etmek", `
${analogy("📰", "Bugünün hava durumunu tahmin etmek için yarının gazetesine bakabilseydin, mükemmel bir tahminci olurdun. Ama gerçekte yarının gazetesi yoktur. Rastgele bölme, modele tam olarak bunu verir: öngördüğü ayın <b>sonrasını</b> da eğitimde görür.")}`)}
${sec(2, 1, "İki bölme, gerçek veri", `
${fig("u8_split", "tr", "<b>Şekil 1.</b> ABD işsizlik oranı (FRED, 2000'den bu yana). Pembe noktalar test ayları. Model, bir ayı eğitimde zamanca ona en yakın ayın değeriyle öngörüyor.")}
<table class="c-table"><thead><tr><th>Bölme</th><th>Test ayları</th><th>Model neyi biliyor?</th><th class="n">Test hatası (kök HKO)</th></tr></thead><tbody>
<tr class="bad"><td>Rastgele</td><td>Serinin her yerine dağılmış</td><td>Her test ayının hemen öncesini ve sonrasını</td><td class="n">≈ 0,19</td></tr>
<tr class="hl"><td>Zamana göre</td><td>Serinin son %20'si</td><td>Yalnızca geçmişi</td><td class="n">≈ 1,82</td></tr></tbody></table>
<p>Aynı model, aynı veri; hata yaklaşık <b>on kat</b> farklı. Fark modelden değil, değerlendirme yönteminden geliyor. Ücret örneğinde gözlemler birbirinden bağımsızdı; işsizlikte bu ay geçen aya ve gelecek aya çok benzer. Bu benzerlik, rastgele bölmede “kopya çekmeyi” mümkün kılıyor.</p>`)}
${sec(3, 2, "Zaman serisinde çapraz doğrulama: genişleyen pencere", `
${fig("u8_window", "tr", "<b>Şekil 2.</b> Katlar karıştırılmaz. Her turda eğitim penceresi uzar, hemen sonraki dönem doğrulamaya ayrılır.")}
<p>Her doğrulama, kendi geçmişinden öğrenmiş bir modelle yapılır; tıpkı gerçek hayatta her ay yeniden öngörü yapan bir analist gibi. Turların hatalarının ortalaması, modelin öngörü başarısının dürüst bir ölçüsüdür.</p>`)}
${sec(4, 3, "Çözümlü örnek: doğru bölme nasıl kurulur?", `
<ol class="c-steps">
<li><p>Tabloyu <b>tarihe göre sırala</b> (indirilen veri her zaman sıralı gelmez).</p></li>
<li><p>Bir kesim tarihi seç: örneğin 2015-01-01. Öncesi eğitim, sonrası test: <code>veri[veri["tarih"] &lt; "2015-01-01"]</code>.</p></li>
<li><p>Kontrol et: <code>egitim["tarih"].max() &lt; test["tarih"].min()</code> doğru olmalı.</p></li>
<li><p>Gecikmeli özellikleri (<code>shift(1)</code>) bölmeden önce oluşturmak sorun değildir: test döneminin ilk ayı için geçen ayın değeri, öngörü anında zaten bilinir.</p></li>
</ol>`)}
${sec(5, 4, "Test döneminin seçimi de sonucu etkiler", `
${cards([
      [3, "🦠", "Şoklar", "Test döneminde pandemi gibi bir şok varsa hata büyür. Bu bir model kusuru değil, gerçeğin bir parçasıdır."],
      [1, "📆", "Tek kesim tarihi", "Sonuç tek bir bölmeye dayanır; farklı bir tarihle hata değişebilir. Genişleyen pencere bu yüzden tercih edilir."],
      [2, "🧭", "Kıyas ölçütü", "Hata büyük çıktığında “bu kötü mü?” sorusunun yanıtı, saf öngörüyle karşılaştırmadır (Ünite 9)."]
    ])}`)}
${sec(6, 0, "Sık yapılan hatalar", pit([
      ["Zaman serisini karıştırarak bölmek", "Model geleceği görür; hata yanıltıcı biçimde küçük çıkar.", "Bir kesim tarihi seç: öncesi eğitim, sonrası test."],
      ["“Standart yöntem” diye train_test_split kullanmak", "Varsayılan olarak karıştırır; bağımsız gözlemler için tasarlanmıştır.", "Zaman serisinde karıştırmayı kapat ya da tarih filtresi kullan."],
      ["Sıralamayı unutmak", "Satırlar indirildikleri sırada değilse “son %20” gelecek değildir.", "Bölmeden önce tarihe göre sırala ve kontrol et."]
    ]))}
${sum("Akılda kalsın", ["Zaman serisinde rastgele bölme geleceği gösterir; hata olduğundan çok küçük çıkar.", "Geçmişle eğit, gelecekle sına: bir kesim tarihi ya da genişleyen pencere kullan.", "Gerçek veride aynı model, iki bölmeyle yaklaşık on kat farklı hata verdi."])}
${link("tr", "zaman serisinde doğrulama")}`),
    en: wrap(`
<p class="c-lead">Most economic and financial data are time series: inflation, unemployment, exchange rates, interest rates. In time series a random split lets the model see the future. The rule is simple: train on the past, test on the future.</p>
${sec(1, 0, "Intuition: forecasting today with tomorrow's paper", `
${analogy("📰", "If you could read tomorrow's newspaper to forecast today's weather, you would be a perfect forecaster. In reality there is no tomorrow's paper. A random split gives the model exactly that: it sees, in training, what came <b>after</b> the month it predicts.")}`)}
${sec(2, 1, "Two splits, real data", `
${fig("u8_split", "en", "<b>Figure 1.</b> US unemployment rate (FRED, since 2000). Pink dots are test months. The model predicts a month with the value of the month closest to it in time in the training data.")}
<table class="c-table"><thead><tr><th>Split</th><th>Test months</th><th>What does the model know?</th><th class="n">Test error (RMSE)</th></tr></thead><tbody>
<tr class="bad"><td>Random</td><td>Scattered across the series</td><td>The months right before and after each test month</td><td class="n">≈ 0.19</td></tr>
<tr class="hl"><td>By time</td><td>The last 20% of the series</td><td>Only the past</td><td class="n">≈ 1.82</td></tr></tbody></table>
<p>Same model, same data; the error differs about <b>tenfold</b>. The difference comes not from the model but from the evaluation method. In the wage example observations were independent; in unemployment this month is very similar to last month and next month. That similarity makes “copying” possible under a random split.</p>`)}
${sec(3, 2, "Cross-validation for time series: the expanding window", `
${fig("u8_window", "en", "<b>Figure 2.</b> Folds are not shuffled. In each round the training window grows and the period right after it is held out for validation.")}
<p>Each validation uses a model that learned only from its own past, just like an analyst who forecasts again every month. The average of the rounds' errors is an honest measure of forecasting performance.</p>`)}
${sec(4, 3, "Worked example: how to set up the right split", `
<ol class="c-steps">
<li><p><b>Sort the table by date</b> (downloaded data do not always arrive sorted).</p></li>
<li><p>Choose a cut-off date, e.g. 2015-01-01. Before it is training, after it test: <code>data[data["date"] &lt; "2015-01-01"]</code>.</p></li>
<li><p>Check: <code>train["date"].max() &lt; test["date"].min()</code> should be true.</p></li>
<li><p>Creating lagged features (<code>shift(1)</code>) before the split is fine: for the first test month, last month's value is already known at prediction time.</p></li>
</ol>`)}
${sec(5, 4, "The choice of test period matters too", `
${cards([
      [3, "🦠", "Shocks", "If the test period contains a shock like the pandemic, the error grows. That is not a model flaw but part of reality."],
      [1, "📆", "A single cut-off", "The result rests on one split; a different date may change the error. That is why the expanding window is preferred."],
      [2, "🧭", "Benchmark", "When the error is large, the answer to “is this bad?” is a comparison with the naive forecast (Unit 9)."]
    ])}`)}
${sec(6, 0, "Common mistakes", pit([
      ["Shuffling a time series before splitting", "The model sees the future; the error comes out misleadingly small.", "Choose a cut-off date: before it training, after it test."],
      ["Using train_test_split as the “standard method”", "It shuffles by default; it is designed for independent observations.", "Turn shuffling off for time series or filter by date."],
      ["Forgetting to sort", "If rows are not in date order, “the last 20%” is not the future.", "Sort by date before splitting, and check."]
    ]))}
${sum("Remember", ["In time series a random split shows the future; the error comes out far too small.", "Train on the past, test on the future: use a cut-off date or an expanding window.", "On real data, the same model gave errors about ten times apart under the two splits."])}
${link("en", "validating time series")}`)
  };

  /* ------------------------------------------------------------ Ünite 9 (atölye) */
  const keep9 = U.find((u) => u.id === "m2-u9");
  if (keep9) {
    const old = keep9.concept;
    keep9.concept = {
      tr: wrap(`${fig("u9_flow", "tr", "<b>Şekil 1.</b> Atölyenin akışı.")}<div class="prose">${old.tr}</div>`),
      en: wrap(`${fig("u9_flow", "en", "<b>Figure 1.</b> The workshop's flow.")}<div class="prose">${old.en}</div>`)
    };
  }

  U.forEach((u) => { if (C[u.id]) { u.concept = C[u.id]; u.minutes = (u.minutes || 15) + 10; } });
})();
