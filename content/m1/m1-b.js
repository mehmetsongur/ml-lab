/* Modül 1 — Öngörü, nedensellik ve veriyi hazırlamak · Üniteler 6–10
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 * "Örnek YZ yanıtları" öğretim amacıyla hazırlanmıştır; tüm veriler kurgusaldır (Ünite 10 hariç: FRED).
 */
(function () {
  "use strict";
  const D = window.M1_DATA;
  const K = D.KREDI;
  const U = window.M1_UNITS;

  /* =================================================================== */
  /* Ünite 6 — Veriyi tanımak                                             */
  /* =================================================================== */
  U.push({
    id: "m1-u6",
    minutes: 30,
    packages: ["numpy", "pandas"],
    title: { tr: "Veriyi tanımak: eksik ve olağandışı değerler", en: "Getting to know the data: missing and unusual values" },
    blurb: { tr: "Model kurmadan önce tabloya bakmak. Eksik değerleri ve aykırı gözlemleri görmek.", en: "Looking at the table before building a model. Spotting missing values and outliers." },
    terms: [{ tr: "keşifsel veri analizi", en: "exploratory data analysis" }, { tr: "eksik değer (NaN)", en: "missing value (NaN)" }, { tr: "aykırı değer", en: "outlier" }, { tr: "çeyrekler arası açıklık", en: "interquartile range" }],
    concept: {
      tr: `<p>Bir modele veri vermeden önce o veriyi tanımalısın. Buna <b>keşifsel veri analizi</b> denir ve birkaç basit soruyla başlar:</p>
<ul>
<li><b>Kaç satır, kaç sütun var? Türleri ne?</b> <code>veri.shape</code>, <code>veri.dtypes</code></li>
<li><b>Eksik değer var mı?</b> <code>veri.isna().sum()</code>, her sütundaki eksik sayısını verir. Pandas eksik değerleri <code>NaN</code> olarak gösterir.</li>
<li><b>Değerler makul mü?</b> <code>veri.describe()</code>, her sayısal sütunun ortalamasını, medyanını, en küçük ve en büyük değerini gösterir.</li>
</ul>
<p><b>Aykırı (olağandışı) değer</b>, diğerlerinden çok farklı bir gözlemdir. Yaygın bir başparmak kuralı: verinin ortadaki yarısının genişliğine (<b>çeyrekler arası açıklık</b>, Q3 − Q1) bak; Q3'ün 1,5 açıklık üstündeki ya da Q1'in 1,5 açıklık altındaki değerleri incelemeye al.</p>
<div class="box">Aykırı değer otomatik olarak “hata” değildir. Bir yazım hatası olabilir (4.800 yerine 48.000), ama gerçek ve çok önemli bir bilgi de olabilir (kriz ayı, dolandırıcılık). Önce kaynağını sorgula. Bu ünitede amaç yalnızca <b>görmek</b>; eksik değerlerle ne yapılacağını bir sonraki ünitede ele alacağız.</div>
<p>Bir aykırı değer <b>ortalamayı</b> kolayca sürükler; <b>medyan</b> ise ortadaki değer olduğu için ondan pek etkilenmez. Oyun alanında bunu göreceksin.</p>`,
      en: `<p>Before handing data to a model, you need to get to know it. This is called <b>exploratory data analysis</b>, and it starts with a few simple questions:</p>
<ul>
<li><b>How many rows and columns? Of what types?</b> <code>data.shape</code>, <code>data.dtypes</code></li>
<li><b>Are there missing values?</b> <code>data.isna().sum()</code> gives the number missing in each column. Pandas shows missing values as <code>NaN</code>.</li>
<li><b>Are the values plausible?</b> <code>data.describe()</code> shows the mean, median, minimum and maximum of each numeric column.</li>
</ul>
<p>An <b>outlier</b> is an observation very different from the rest. A common rule of thumb: look at the width of the middle half of the data (the <b>interquartile range</b>, Q3 − Q1) and flag values more than 1.5 ranges above Q3 or below Q1.</p>
<div class="box">An outlier is not automatically an “error”. It might be a typo (48,000 instead of 4,800), but it might also be real and very important information (a crisis month, fraud). Question its source first. In this unit the goal is only to <b>see</b>; what to do with missing values is the topic of the next unit.</div>
<p>An outlier easily drags the <b>mean</b>; the <b>median</b>, being the middle value, is hardly affected. You will see this in the playground.</p>`
    },
    playground: {
      type: "outlierView",
      intro: { tr: "10 müşterinin aylık kart harcaması. Birinin harcaması diğerlerinden çok farklı. Onu dahil et ya da çıkar, değerini değiştir; ortalama ve medyanı izle.", en: "Monthly card spending of 10 customers. One customer's spending is very different. Include or exclude it, change its value, and watch the mean and median." },
      values: [4200, 6100, 5300, 7000, 48000, 6900, 5600, 6400, 5000, 5900],
      outlierIndex: 4,
      takeaway: { tr: "Tek bir olağandışı değer ortalamayı binlerce birim kaydırabilir; medyan neredeyse yerinde durur.", en: "A single unusual value can shift the mean by thousands; the median barely moves." }
    },
    cells: [
      {
        id: "m1-u6-c1", kind: "run",
        task: { tr: "Kredi tablosunda eksik değerleri say.", en: "Count the missing values in the loan table." },
        predict: { q: { tr: "<code>gelir</code> sütununda kaç eksik değer var?", en: "How many missing values are in the <code>income</code> column?" }, options: { tr: ["0", "1", "2"], en: ["0", "1", "2"] }, answer: 2, explain: { tr: "4. ve 9. müşterinin geliri bilinmiyor (<code>np.nan</code>).", en: "The incomes of customers 4 and 9 are unknown (<code>np.nan</code>)." } },
        code: { tr: K.tr + `\nprint(kredi.isna().sum())\nprint(kredi.describe().round(0))`, en: K.en + `\nprint(loans.isna().sum())\nprint(loans.describe().round(0))` },
        after: { tr: "<code>describe()</code> tablosuna dikkat: kart harcamasının ortalaması (10.040) medyanından (6.000, “50%” satırı) çok yüksek, en büyük değer 48.000. Bu, olağandışı bir gözleme işaret eder.", en: "Look at the <code>describe()</code> table: the mean of card spending (10,040) is far above its median (6,000, the “50%” row), and the maximum is 48,000. That points to an unusual observation." }
      },
      {
        id: "m1-u6-c2", kind: "audit",
        task: { tr: "YZ'den ortalama geliri hesaplamasını istedik. Kod çalışıyor ama tabloya sessizce bir şey yaptı. Hatalı satırı bul ve düzelt: tablo 10 müşteriyi korusun, ortalama yalnızca geliri bilinenlerden hesaplansın ve kaç kişiden hesaplandığı da yazsın.", en: "We asked the AI for the average income. The code runs, but it quietly did something to the table. Find the faulty line and fix it: the table should keep all 10 customers, the mean should use only the known incomes, and it should say how many people it is based on." },
        ai: {
          prompt: { tr: "kredi tablosundaki müşterilerin ortalama gelirini hesaplar mısın?", en: "Can you compute the average income of the customers in the loans table?" },
          reply: { tr: "Önce eksik değerleri temizleyelim, sonra ortalamayı alalım:", en: "Let us clean the missing values first, then take the mean:" },
          code: { tr: K.tr + `\nkredi = kredi.dropna()\nortalama_gelir = kredi["gelir"].mean()\nprint(f"Müşterilerin ortalama geliri: {ortalama_gelir:.0f}")`, en: K.en + `\nloans = loans.dropna()\nmean_income = loans["income"].mean()\nprint(f"Average customer income: {mean_income:.0f}")` },
          claim: { tr: "Eksik değerleri temizledim; ortalama gelir 46.625. Tablo artık analize hazır.", en: "I cleaned the missing values; the average income is 46,625. The table is now ready for analysis." }
        },
        bugLines: [11],
        lineExplain: { tr: "<code>dropna()</code>, geliri eksik olan iki müşteriyi <b>tablodan tamamen sildi</b>. Ortalama aynı çıkıyor (pandas zaten eksikleri atlar), ama tablo artık 8 müşteri. Silinen ikisinin ikisi de temerrüde düşmüştü; sonraki her analiz bu bilgiyi kaybeder. “Analize hazır” iddiası yanlış.", en: "<code>dropna()</code> <b>removed the two customers with missing income from the table entirely</b>. The mean is the same (pandas skips missing values anyway), but the table now has 8 customers. Both removed customers had defaulted; every later analysis loses that information. The claim “ready for analysis” is wrong." },
        hints: [{ tr: "<code>dropna()</code> satırını sil. Pandas <code>mean()</code> eksikleri zaten atlar. Geliri bilinen kişi sayısı: <code>kredi[\"gelir\"].notna().sum()</code>; bunu <code>n_gelir</code> adlı değişkene ata.", en: "Delete the <code>dropna()</code> line. Pandas <code>mean()</code> already skips missing values. The number with known income: <code>loans[\"income\"].notna().sum()</code>; store it in <code>n_income</code>." }],
        solution: { tr: K.tr + `\nortalama_gelir = kredi["gelir"].mean()          # pandas eksikleri atlayarak hesaplar\nn_gelir = kredi["gelir"].notna().sum()\nprint(f"{len(kredi)} müşteri; geliri bilinen {n_gelir} kişinin ortalama geliri: {ortalama_gelir:.0f}")`, en: K.en + `\nmean_income = loans["income"].mean()          # pandas skips missing values\nn_income = loans["income"].notna().sum()\nprint(f"{len(loans)} customers; average income of the {n_income} with known income: {mean_income:.0f}")` },
        checks: [
          { py: { tr: "len(kredi) == 10", en: "len(loans) == 10" }, msg: { tr: "Tablo 10 müşteriyi korumalı; hiçbir satır silinmemeli.", en: "The table should keep all 10 customers; no row should be deleted." } },
          { py: { tr: "abs(ortalama_gelir - 46625) < 1e-6 and n_gelir == 8", en: "abs(mean_income - 46625) < 1e-6 and n_income == 8" }, msg: { tr: "Ortalama 46.625, geliri bilinen kişi sayısı (<code>n_gelir</code>) 8 olmalı.", en: "The mean should be 46,625 and the number with known income (<code>n_income</code>) 8." } }
        ],
        after: { tr: "“Eksikleri temizledim” masum bir cümle gibi duruyor, ama bir analiz kararıdır ve sonucu değiştirebilir. YZ bunu sormadan yaptı. Eksik değerlerle ne yapılacağına <b>sen</b> karar vermelisin; bir sonraki ünitenin konusu bu.", en: "“I cleaned the missing values” sounds innocent, but it is an analytical decision that can change results. The AI made it without asking. <b>You</b> should decide what to do with missing values; that is the topic of the next unit." }
      },
      {
        id: "m1-u6-c3", kind: "challenge",
        task: { tr: "Bir sütundaki olağandışı değerleri bulan <code>aykiri(seri)</code> fonksiyonunu yaz. Kural: Q1 − 1,5 × IQR'nin altındaki ya da Q3 + 1,5 × IQR'nin üstündeki değerleri <b>liste</b> olarak döndür (IQR = Q3 − Q1).", en: "Write <code>outliers(series)</code>, which finds unusual values in a column. Rule: return the values below Q1 − 1.5 × IQR or above Q3 + 1.5 × IQR as a <b>list</b> (IQR = Q3 − Q1)." },
        code: {
          tr: K.tr + `\n\ndef aykiri(seri):\n    q1 = seri.quantile(0.25)\n    q3 = seri.quantile(0.75)\n    # IQR'yi ve iki sınırı hesapla; sınırların dışındaki değerleri liste olarak döndür\n    pass\n\nprint(aykiri(kredi["kart_harcamasi"]))`,
          en: K.en + `\n\ndef outliers(series):\n    q1 = series.quantile(0.25)\n    q3 = series.quantile(0.75)\n    # compute the IQR and the two bounds; return the values outside them as a list\n    pass\n\nprint(outliers(loans["card_spending"]))`
        },
        solution: {
          tr: K.tr + `\n\ndef aykiri(seri):\n    q1 = seri.quantile(0.25)\n    q3 = seri.quantile(0.75)\n    iqr = q3 - q1\n    alt, ust = q1 - 1.5 * iqr, q3 + 1.5 * iqr\n    return seri[(seri < alt) | (seri > ust)].tolist()\n\nprint(aykiri(kredi["kart_harcamasi"]))`,
          en: K.en + `\n\ndef outliers(series):\n    q1 = series.quantile(0.25)\n    q3 = series.quantile(0.75)\n    iqr = q3 - q1\n    low, high = q1 - 1.5 * iqr, q3 + 1.5 * iqr\n    return series[(series < low) | (series > high)].tolist()\n\nprint(outliers(loans["card_spending"]))`
        },
        hints: [
          { tr: "<code>iqr = q3 - q1</code>, sonra <code>alt = q1 - 1.5 * iqr</code> ve <code>ust = q3 + 1.5 * iqr</code>.", en: "<code>iqr = q3 - q1</code>, then <code>low = q1 - 1.5 * iqr</code> and <code>high = q3 + 1.5 * iqr</code>." },
          { tr: "Filtre: <code>seri[(seri &lt; alt) | (seri &gt; ust)]</code>; listeye çevirmek için <code>.tolist()</code>.", en: "Filter: <code>series[(series &lt; low) | (series &gt; high)]</code>; convert with <code>.tolist()</code>." }
        ],
        checks: [
          { py: { tr: "aykiri(kredi[\"kart_harcamasi\"]) == [48000]", en: "outliers(loans[\"card_spending\"]) == [48000]" }, msg: { tr: "Kart harcamasında yalnızca 48.000 olağandışı çıkmalı.", en: "Only 48,000 should be flagged in card spending." } },
          { py: { tr: "aykiri(pd.Series([-50, 10, 11, 12, 13, 14])) == [-50]", en: "outliers(pd.Series([-50, 10, 11, 12, 13, 14])) == [-50]" }, msg: { tr: "Alt sınırın altındaki değerler de yakalanmalı.", en: "Values below the lower bound should be caught too." } },
          { py: { tr: "aykiri(pd.Series(range(1, 11))) == []", en: "outliers(pd.Series(range(1, 11))) == []" }, msg: { tr: "Olağandışı değer olmayan bir sütunda boş liste dönmeli.", en: "A column with no unusual values should give an empty list." } }
        ],
        after: { tr: "Fonksiyon 48.000'i işaretledi. Şimdi soru şu: bu bir yazım hatası mı (4.800), yoksa gerçek bir harcama mı? Bunu kod söyleyemez; veri kaynağına bakman gerekir.", en: "The function flagged 48,000. Now the question is: is it a typo (4,800) or a real purchase? Code cannot tell you that; you need to look at the data source." }
      },
      {
        id: "m1-u6-c4", kind: "interpret",
        task: { tr: "YZ kredi tablosunu özetledi. Hangi cümleler olağandışı değeri ya da eksik veriyi hesaba katmadan yanıltıcı bir tablo çiziyor?", en: "The AI summarised the loan table. Which sentences paint a misleading picture by ignoring the unusual value or the missing data?" },
        prompt: { tr: "kredi tablosunu birkaç cümleyle özetler misin?", en: "Can you summarise the loans table in a few sentences?" },
        sentences: {
          tr: ["Tabloda 10 müşteri ve 6 sütun var.", "Müşterilerin ortalama kart harcaması 10.040 TL; tipik bir müşteri ayda yaklaşık 10 bin TL harcıyor.", "İki müşterinin gelir bilgisi eksik.", "Kart harcamasında 48.000 TL'lik bir değer diğerlerinden çok farklı; doğruluğu kontrol edilmeli.", "Gelir verisi eksiksiz olduğu için gelir analizleri güvenilirdir."],
          en: ["The table has 10 customers and 6 columns.", "Average card spending is 10,040; a typical customer spends about 10 thousand a month.", "Two customers' income is missing.", "One card spending value of 48,000 is very different from the others; it should be checked.", "Since the income data are complete, income analyses are reliable."]
        },
        bad: [1, 4],
        explain: {
          tr: ["Doğru.", "<b>Yanıltıcı:</b> ortalama tek bir uç değer tarafından yukarı çekilmiş. Tipik müşteri için medyan (6.000 TL) çok daha iyi bir özet.", "Doğru.", "Doğru ve iyi bir uyarı.", "<b>Yanlış:</b> gelir verisinde iki eksik var; üstelik eksik olanların ikisi de temerrüde düşmüş müşteriler."],
          en: ["Correct.", "<b>Misleading:</b> the mean is pulled up by a single extreme value. For a typical customer the median (6,000) is a much better summary.", "Correct.", "Correct, and a good warning.", "<b>Wrong:</b> the income data have two missing values; moreover both missing ones are customers who defaulted."]
        }
      }
    ],
    quiz: [
      { q: { tr: "Her sütundaki eksik değer sayısını hangi kod verir?", en: "Which code gives the number of missing values in each column?" }, options: { tr: ["veri.isna().sum()", "veri.dropna()", "veri.mean()"], en: ["data.isna().sum()", "data.dropna()", "data.mean()"] }, answer: 0, explain: { tr: "<code>isna()</code> eksikleri True yapar, <code>sum()</code> sütun başına sayar. <code>dropna()</code> ise satırları siler.", en: "<code>isna()</code> marks missing values as True, <code>sum()</code> counts them per column. <code>dropna()</code> deletes rows." } },
      { q: { tr: "Tek bir çok büyük değer hangisini daha çok etkiler?", en: "Which is affected more by a single very large value?" }, options: { tr: ["Medyan", "Ortalama", "İkisi eşit"], en: ["The median", "The mean", "Both equally"] }, answer: 1, explain: { tr: "Ortalama tüm değerleri toplar; medyan yalnızca ortadaki değere bakar.", en: "The mean adds up all values; the median looks only at the middle one." } },
      { q: { tr: "Bir aykırı değer bulduğunda ilk adım ne olmalı?", en: "When you find an outlier, what should be the first step?" }, options: { tr: ["Hemen silmek", "Kaynağını sorgulamak: hata mı, gerçek mi?", "Ortalamayla değiştirmek"], en: ["Delete it at once", "Question its source: error or real?", "Replace it with the mean"] }, answer: 1, explain: { tr: "Aykırı değer önemli ve gerçek bir bilgi de olabilir.", en: "An outlier may be real and important information." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 7 — Eksik veri                                                  */
  /* =================================================================== */
  U.push({
    id: "m1-u7",
    minutes: 30,
    packages: ["numpy", "pandas"],
    title: { tr: "Eksik veri: sil, doldur, işaretle", en: "Missing data: drop, fill, flag" },
    blurb: { tr: "Eksikliğin nedeni kararı belirler. Medyanla doldurma, “eksikti” göstergesi ve dokunulmaması gereken hedef.", en: "The reason for missingness shapes the decision. Median filling, the “was missing” flag, and the target you must not touch." },
    terms: [{ tr: "doldurma", en: "imputation" }, { tr: "eksiklik göstergesi", en: "missingness indicator" }, { tr: "medyan", en: "median" }],
    concept: {
      tr: `<p>Eksik değerle ne yapılacağı, verinin <b>neden</b> eksik olduğuna bağlıdır (Rubin, 1976). Üç durumu sezgisel olarak ayırabiliriz:</p>
<ul>
<li><b>Tamamen rastgele:</b> anket formu postada kayboldu. Eksik olanlar diğerlerinden farklı değil.</li>
<li><b>Gözlenen bir şeye bağlı:</b> genç başvuranlar geliri daha sık boş bırakıyor; yaşı bildiğimiz için bunu hesaba katabiliriz.</li>
<li><b>Eksik değerin kendisine bağlı:</b> geliri düşük olanlar gelirini bildirmek istemiyor. Eksiklik başlı başına bilgi taşır.</li>
</ul>
<p>Yaygın seçenekler:</p>
<ul>
<li><b>Satırı silmek:</b> basit, ama bilgi kaybedilir; eksikler rastgele değilse sonuçlar yanlı olur.</li>
<li><b>Ortalama ya da medyanla doldurmak:</b> satırlar korunur. Medyan, aykırı değerlere karşı daha dayanıklıdır.</li>
<li><b>Doldurmak + eksiklik göstergesi:</b> “bu değer eksikti” bilgisini 0/1 bir sütunda saklamak. Eksiklik bilgi taşıyorsa model bunu kullanabilir.</li>
</ul>
<div class="box"><b>İki kural:</b> (1) Gösterge sütununu, doldurma işleminden <b>önce</b> oluştur; doldurduktan sonra eksikleri ayırt edemezsin. (2) <b>Hedefi asla doldurma.</b> Sonucu bilinmeyen bir gözlemin hedefine değer yazmak, uydurma bir cevap üretmektir. Hedefi eksik satırlar öğrenmede kullanılamaz; öngörü yapılacak gözlemlerdir.</div>`,
      en: `<p>What to do with a missing value depends on <b>why</b> the data are missing (Rubin, 1976). Intuitively we can tell three situations apart:</p>
<ul>
<li><b>Completely at random:</b> a survey form got lost in the post. The missing ones are no different from the rest.</li>
<li><b>Depends on something observed:</b> younger applicants leave income blank more often; since we know their age, we can account for it.</li>
<li><b>Depends on the missing value itself:</b> people with low income prefer not to report it. Missingness carries information in itself.</li>
</ul>
<p>Common options:</p>
<ul>
<li><b>Drop the row:</b> simple, but information is lost; if the gaps are not random, results become biased.</li>
<li><b>Fill with the mean or median:</b> rows are kept. The median is more robust to outliers.</li>
<li><b>Fill + missingness indicator:</b> keep the information “this value was missing” in a 0/1 column. If missingness carries information, a model can use it.</li>
</ul>
<div class="box"><b>Two rules:</b> (1) Create the indicator column <b>before</b> filling; after filling you can no longer tell which values were missing. (2) <b>Never fill the target.</b> Writing a value into the target of an observation whose outcome is unknown is inventing an answer. Rows with a missing target cannot be used for learning; they are the observations to predict.</div>`
    },
    playground: {
      type: "missingFill",
      intro: { tr: "Kredi tablosunda iki müşterinin geliri eksik. Dört stratejiyi dene ve kalan gözlem sayısı, ortalama gelir ve temerrüt oranının nasıl değiştiğine bak.", en: "Two customers in the loan table have missing income. Try the four strategies and see how the number of rows, the mean income and the default rate change." },
      rows: D.INCOMES.map((v, i) => ({ income: v, y: D.DEFAULTS[i] })),
      labels: { income: { tr: "gelir", en: "income" }, flag: { tr: "gelir_eksik", en: "income_missing" }, y: { tr: "temerrut", en: "default" } },
      takeaway: { tr: "Satır silmek temerrüt oranını değiştirdi; çünkü eksikler rastgele değildi. Gösterge sütunu bu bilgiyi kurtarır.", en: "Dropping rows changed the default rate because the gaps were not random. The indicator column rescues that information." }
    },
    cells: [
      {
        id: "m1-u7-c1", kind: "run",
        task: { tr: "Eksik gelirleri medyanla dolduruyoruz. Önce tahmin et.", en: "We fill the missing incomes with the median. Predict first." },
        predict: { q: { tr: "Eksik gelirlerin yerine hangi değer yazılır?", en: "Which value replaces the missing incomes?" }, options: { tr: ["46.625 (ortalama)", "47.500 (medyan)", "0"], en: ["46,625 (the mean)", "47,500 (the median)", "0"] }, answer: 1, explain: { tr: "Bilinen 8 gelir sıralanınca ortadaki iki değer 45.000 ve 50.000; medyan bunların ortalaması: 47.500. <code>median()</code> eksikleri hesaba katmaz.", en: "Sorting the 8 known incomes, the middle two are 45,000 and 50,000; the median is their average: 47,500. <code>median()</code> ignores missing values." } },
        code: { tr: K.tr + `\nmedyan = kredi["gelir"].median()\nkredi["gelir"] = kredi["gelir"].fillna(medyan)\nprint("Medyan:", medyan)\nprint(kredi["gelir"].tolist())`, en: K.en + `\nmedian = loans["income"].median()\nloans["income"] = loans["income"].fillna(median)\nprint("Median:", median)\nprint(loans["income"].tolist())` }
      },
      {
        id: "m1-u7-c2", kind: "audit",
        task: { tr: "YZ'den eksik gelirleri doldurmasını ve bir eksiklik göstergesi eklemesini istedik. Gösterge sütununda bir sorun var. Hatalı satırı bul ve düzelt.", en: "We asked the AI to fill the missing incomes and add a missingness indicator. Something is wrong with the indicator column. Find the faulty line and fix it." },
        ai: {
          prompt: { tr: "kredi tablosunda 'gelir' sütunundaki eksikleri medyanla doldur ve hangi satırların eksik olduğunu gösteren 0/1 'gelir_eksik' sütunu ekle.", en: "In the loans table fill the missing values of 'income' with the median, and add a 0/1 column 'income_missing' showing which rows were missing." },
          reply: { tr: "İki adımda yapalım:", en: "Let us do it in two steps:" },
          code: { tr: K.tr + `\nmedyan = kredi["gelir"].median()\nkredi["gelir"] = kredi["gelir"].fillna(medyan)\nkredi["gelir_eksik"] = kredi["gelir"].isna().astype(int)\nprint(kredi[["gelir", "gelir_eksik"]])`, en: K.en + `\nmedian = loans["income"].median()\nloans["income"] = loans["income"].fillna(median)\nloans["income_missing"] = loans["income"].isna().astype(int)\nprint(loans[["income", "income_missing"]])` },
          claim: { tr: "Eksik gelirler medyanla dolduruldu ve eksiklik göstergesi eklendi.", en: "The missing incomes were filled with the median and the missingness indicator was added." }
        },
        bugLines: [13],
        lineExplain: { tr: "Gösterge, sütun <b>doldurulduktan sonra</b> oluşturuluyor. O anda hiç eksik kalmadığı için gösterge her satırda 0: “eksikti” bilgisi kayboldu. Hata mesajı yok, sütun da var; ama içi boş.", en: "The indicator is created <b>after</b> the column was filled. By then nothing is missing, so the indicator is 0 in every row: the “was missing” information is lost. No error message, and the column exists; but it is empty." },
        hints: [{ tr: "Göstergeyi oluşturan satırı, doldurma satırının üstüne taşı.", en: "Move the line that creates the indicator above the filling line." }],
        solution: { tr: K.tr + `\nkredi["gelir_eksik"] = kredi["gelir"].isna().astype(int)\nmedyan = kredi["gelir"].median()\nkredi["gelir"] = kredi["gelir"].fillna(medyan)\nprint(kredi[["gelir", "gelir_eksik"]])`, en: K.en + `\nloans["income_missing"] = loans["income"].isna().astype(int)\nmedian = loans["income"].median()\nloans["income"] = loans["income"].fillna(median)\nprint(loans[["income", "income_missing"]])` },
        checks: [
          { py: { tr: "kredi[\"gelir_eksik\"].tolist() == [0, 0, 0, 1, 0, 0, 0, 0, 1, 0]", en: "loans[\"income_missing\"].tolist() == [0, 0, 0, 1, 0, 0, 0, 0, 1, 0]" }, msg: { tr: "Gösterge yalnızca 4. ve 9. müşteride 1 olmalı.", en: "The indicator should be 1 only for customers 4 and 9." } },
          { py: { tr: "kredi[\"gelir\"].isna().sum() == 0 and kredi.loc[3, \"gelir\"] == 47500", en: "loans[\"income\"].isna().sum() == 0 and loans.loc[3, \"income\"] == 47500" }, msg: { tr: "Gelir sütununda eksik kalmamalı ve eksikler 47.500 ile doldurulmalı.", en: "No missing values should remain, and they should be filled with 47,500." } }
        ],
        after: { tr: "Sıra hatası, YZ kodunda sık görülen sessiz hatalardan biri. Kontrol basit: göstergenin toplamı, baştaki eksik sayısına (2) eşit mi?", en: "Order mistakes are a common silent error in AI code. The check is simple: does the indicator add up to the original number of missing values (2)?" }
      },
      {
        id: "m1-u7-c3", kind: "audit",
        task: { tr: "Tabloya sonucu henüz belli olmayan iki yeni başvuru eklendi (temerrüt bilgisi eksik). YZ “tüm eksikleri doldurdu”. Hatalı satırı bul ve düzelt: hedefi bilinmeyen satırlar modelin öğreneceği tablodan çıkarılsın, gelirdeki eksikler medyanla doldurulsun.", en: "Two new applications whose outcome is not yet known were added (default is missing). The AI “filled all the gaps”. Find the faulty line and fix it: rows with an unknown target should be removed from the table the model learns from, and the missing incomes should be filled with the median." },
        ai: {
          prompt: { tr: "kredi tablosundaki tüm eksik değerleri doldurup tabloyu modele hazırlar mısın?", en: "Can you fill all the missing values in the loans table and get it ready for a model?" },
          reply: { tr: "Sayısal sütunların hepsini medyanla doldurmak en pratik yol:", en: "Filling all numeric columns with their median is the most practical way:" },
          code: { tr: K.tr + `\nkredi.loc[[1, 6], "temerrut"] = np.nan    # sonucu henüz bilinmeyen iki başvuru\nkredi = kredi.fillna(kredi.median(numeric_only=True))\nprint(kredi[["gelir", "temerrut"]])`, en: K.en + `\nloans.loc[[1, 6], "default"] = np.nan    # two applications with unknown outcome\nloans = loans.fillna(loans.median(numeric_only=True))\nprint(loans[["income", "default"]])` },
          claim: { tr: "Tablo eksiksiz: 10 satır, hiç NaN yok. Modele hazır.", en: "The table is complete: 10 rows, no NaN. Ready for the model." }
        },
        bugLines: [12],
        lineExplain: { tr: "<code>fillna</code> hedef sütunu da doldurdu: sonucu bilinmeyen iki başvuruya “temerrüde düşmedi” (medyan 0) cevabı yazıldı. Model, gerçekte hiç gözlenmemiş iki sonucu doğru diye öğrenecek.", en: "<code>fillna</code> filled the target column too: the two applications with unknown outcomes were given the answer “did not default” (median 0). The model will learn two outcomes that were never observed as if they were true." },
        hints: [
          { tr: "Önce hedefi bilinen satırları tut: <code>kredi = kredi[kredi[\"temerrut\"].notna()].copy()</code>", en: "First keep the rows with a known target: <code>loans = loans[loans[\"default\"].notna()].copy()</code>" },
          { tr: "Sonra yalnızca gelir sütununu doldur: <code>kredi[\"gelir\"] = kredi[\"gelir\"].fillna(kredi[\"gelir\"].median())</code>", en: "Then fill only the income column: <code>loans[\"income\"] = loans[\"income\"].fillna(loans[\"income\"].median())</code>" }
        ],
        solution: { tr: K.tr + `\nkredi.loc[[1, 6], "temerrut"] = np.nan    # sonucu henüz bilinmeyen iki başvuru\nkredi = kredi[kredi["temerrut"].notna()].copy()\nkredi["gelir"] = kredi["gelir"].fillna(kredi["gelir"].median())\nprint(kredi[["gelir", "temerrut"]])`, en: K.en + `\nloans.loc[[1, 6], "default"] = np.nan    # two applications with unknown outcome\nloans = loans[loans["default"].notna()].copy()\nloans["income"] = loans["income"].fillna(loans["income"].median())\nprint(loans[["income", "default"]])` },
        checks: [
          { py: { tr: "len(kredi) == 8 and 1 not in kredi.index and 6 not in kredi.index", en: "len(loans) == 8 and 1 not in loans.index and 6 not in loans.index" }, msg: { tr: "Hedefi bilinmeyen iki satır (indeks 1 ve 6) tablodan çıkarılmalı.", en: "The two rows with an unknown target (index 1 and 6) should be removed." } },
          { py: { tr: "kredi[\"gelir\"].isna().sum() == 0 and kredi[\"temerrut\"].isna().sum() == 0", en: "loans[\"income\"].isna().sum() == 0 and loans[\"default\"].isna().sum() == 0" }, msg: { tr: "Gelirde eksik kalmamalı.", en: "No missing income should remain." } }
        ],
        after: { tr: "Çıkardığın iki başvuru kaybolmadı: model eğitildikten sonra öngörü yapılacak satırlar tam olarak onlar. “Tüm eksikleri doldur” isteği masum görünür; ama hangi sütunun hedef olduğunu YZ'ye söylemezsen onu da doldurabilir.", en: "The two applications you removed are not lost: once the model is trained, they are exactly the rows to predict. “Fill all the gaps” looks harmless, but if you do not tell the AI which column is the target, it may fill that too." }
      },
      {
        id: "m1-u7-c4", kind: "compare",
        task: { tr: "Eksik gelirler için iki YZ iki farklı strateji önerdi. Bu veride hangisi daha savunulabilir?", en: "Two AIs proposed two strategies for the missing incomes. Which is more defensible for these data?" },
        prompt: { tr: "kredi tablosunda iki müşterinin geliri eksik. Ne yapmalıyım?", en: "Two customers in the loans table have missing income. What should I do?" },
        options: [
          { reply: { tr: "10 satırdan 2'si önemsiz; silmek en temizi:", en: "2 out of 10 rows is negligible; dropping them is cleanest:" }, code: { tr: "kredi = kredi.dropna(subset=[\"gelir\"])", en: "loans = loans.dropna(subset=[\"income\"])" }, claim: { tr: "Sonuçlar etkilenmez.", en: "The results are not affected." } },
          { reply: { tr: "Satırları koruyup eksikliği işaretleyelim:", en: "Let us keep the rows and flag the gaps:" }, code: { tr: "kredi[\"gelir_eksik\"] = kredi[\"gelir\"].isna().astype(int)\nkredi[\"gelir\"] = kredi[\"gelir\"].fillna(kredi[\"gelir\"].median())", en: "loans[\"income_missing\"] = loans[\"income\"].isna().astype(int)\nloans[\"income\"] = loans[\"income\"].fillna(loans[\"income\"].median())" }, claim: { tr: "Geliri eksik olanlar ayrıca işaretlendi; model eksikliğin kendisinden de öğrenebilir.", en: "Those with missing income are flagged separately; the model can learn from the missingness itself." } }
        ],
        answer: 1,
        reasons: {
          tr: ["B daha uzun kod yazdığı için.", "Geliri eksik iki müşterinin ikisi de temerrüde düşmüş; eksiklik rastgele görünmüyor, silmek bu bilgiyi yok eder.", "Medyan her zaman en doğru değerdir."],
          en: ["Because B writes more code.", "Both customers with missing income defaulted; the gaps do not look random, and dropping them destroys that information.", "The median is always the correct value."]
        },
        reasonAnswer: 1,
        explain: { tr: "A'nın “sonuçlar etkilenmez” iddiası bu veride yanlış: temerrüt oranı %40'tan %25'e düşer. Medyan “doğru” değer değildir; yalnızca makul bir yer tutucudur. Gösterge, eksikliğin taşıdığı bilgiyi korur.", en: "A's claim that “the results are not affected” is wrong for these data: the default rate falls from 40% to 25%. The median is not the “correct” value; it is just a reasonable placeholder. The indicator preserves the information carried by the missingness." }
      }
    ],
    quiz: [
      { q: { tr: "Eksiklik göstergesi neden doldurmadan önce oluşturulmalı?", en: "Why must the missingness indicator be created before filling?" }, options: { tr: ["Kod daha hızlı çalışsın diye", "Doldurduktan sonra hangi değerlerin eksik olduğu ayırt edilemez", "Pandas başka türlü izin vermez"], en: ["So the code runs faster", "After filling, you can no longer tell which values were missing", "Pandas does not allow otherwise"] }, answer: 1, explain: { tr: "Doldurulmuş sütunda <code>isna()</code> her yerde False verir.", en: "On a filled column <code>isna()</code> is False everywhere." } },
      { q: { tr: "Hedef sütunda eksik olan satırlarla ne yapılır?", en: "What is done with rows whose target is missing?" }, options: { tr: ["Hedef medyanla doldurulur", "Öğrenme tablosundan çıkarılır; öngörü yapılacak satırlardır", "Hedef 0 yapılır"], en: ["The target is filled with the median", "They are removed from the learning table; they are the rows to predict", "The target is set to 0"] }, answer: 1, explain: { tr: "Hedefi doldurmak cevap uydurmaktır.", en: "Filling the target means inventing answers." } },
      { q: { tr: "Aykırı değer içeren bir sütunu doldururken hangisi daha dayanıklıdır?", en: "When filling a column that contains outliers, which is more robust?" }, options: { tr: ["Ortalama", "Medyan", "En büyük değer"], en: ["The mean", "The median", "The maximum"] }, answer: 1, explain: { tr: "Medyan uç değerlerden pek etkilenmez.", en: "The median is barely affected by extreme values." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 8 — Ölçekleme                                                   */
  /* =================================================================== */
  const MUSTERI_TR = `import pandas as pd
musteri = pd.DataFrame({"yas": [25, 41, 33, 52, 29, 47, 38, 60, 35, 44],
                        "gelir": [30000, 52000, 41000, 47500, 36000, 61000, 45000, 58000, 47500, 50000]})`;
  const MUSTERI_EN = `import pandas as pd
customers = pd.DataFrame({"age": [25, 41, 33, 52, 29, 47, 38, 60, 35, 44],
                          "income": [30000, 52000, 41000, 47500, 36000, 61000, 45000, 58000, 47500, 50000]})`;

  U.push({
    id: "m1-u8",
    minutes: 25,
    packages: ["numpy", "pandas"],
    title: { tr: "Ölçekleme: A kime benziyor?", en: "Scaling: who does A resemble?" },
    blurb: { tr: "Birimler uzaklığı nasıl bozar? Standartlaştırma (z-puanı) ve onu doğrulayan kontrol.", en: "How units distort distance. Standardisation (z-scores) and the check that verifies it." },
    terms: [{ tr: "ölçekleme", en: "scaling" }, { tr: "standartlaştırma", en: "standardisation" }, { tr: "z-puanı", en: "z-score" }, { tr: "uzaklık", en: "distance" }],
    concept: {
      tr: `<p>Bazı yöntemler gözlemler arasındaki <b>uzaklığa</b> ya da değişkenlerin büyüklüğüne bakar. Üç kişi düşün:</p>
<ul><li><b>A:</b> 25 yaşında, 30.000 TL gelir</li><li><b>B:</b> 60 yaşında, 31.000 TL gelir</li><li><b>C:</b> 26 yaşında, 45.000 TL gelir</li></ul>
<p>Sezgimiz A'nın C'ye benzediğini söyler: neredeyse aynı yaştalar, gelir farkı makul. Ama ham birimlerle uzaklık hesaplarsan gelirin rakamları (binler) yaşınkileri (onlar) ezer ve A, B'ye “yakın” çıkar. Sonuç verinin değil, <b>seçtiğin birimin</b> eseridir: geliri bin TL ile yazsan karar tersine döner.</p>
<p><b>Standartlaştırma</b> her değişkeni aynı ölçeğe getirir. Her değerden sütunun ortalamasını çıkarıp standart sapmasına bölersin:</p>
<p style="text-align:center"><b>z = (x − ortalama) / standart sapma</b></p>
<p>Sonuçta her sütunun ortalaması 0, standart sapması 1 olur. z = 1,5, “ortalamanın 1,5 standart sapma üstünde” demektir. Böylece yaş da gelir de eşit söz hakkına sahip olur.</p>
<div class="box">Ölçekleme değişkenler arasındaki ilişkiyi değiştirmez; korelasyon aynı kalır. Değişen yalnızca birimdir. Hangi yöntemlerin ölçeklemeye ihtiyaç duyduğunu, o yöntemleri öğrendiğinde göreceksin.</div>`,
      en: `<p>Some methods look at the <b>distance</b> between observations or at the size of the variables. Consider three people:</p>
<ul><li><b>A:</b> aged 25, income 30,000</li><li><b>B:</b> aged 60, income 31,000</li><li><b>C:</b> aged 26, income 45,000</li></ul>
<p>Intuition says A resembles C: almost the same age, a reasonable income gap. But if you compute distance in raw units, the income numbers (thousands) swamp the ages (tens) and A comes out “close” to B. The result is an artefact of <b>the unit you chose</b>, not of the data: write income in thousands and the decision flips.</p>
<p><b>Standardisation</b> puts every variable on the same scale. Subtract the column's mean from each value and divide by its standard deviation:</p>
<p style="text-align:center"><b>z = (x − mean) / standard deviation</b></p>
<p>Afterwards every column has mean 0 and standard deviation 1. z = 1.5 means “1.5 standard deviations above the mean”. Now age and income have an equal say.</p>
<div class="box">Scaling does not change the relationship between variables; the correlation stays the same. Only the unit changes. Which methods need scaling, you will see when you learn those methods.</div>`
    },
    playground: {
      type: "scaleDist",
      intro: { tr: "A'ya kim daha yakın? Önce ham birimlerde, sonra z-puanlarıyla hesapla. Ham birimlerde geliri “bin TL” yapmayı da dene.", en: "Who is closer to A? Compute in raw units first, then with z-scores. In raw units, also try writing income in thousands." },
      people: [{ name: "A", age: 25, income: 30000 }, { name: "B", age: 60, income: 31000 }, { name: "C", age: 26, income: 45000 }],
      ref: { ageMean: 40, ageSd: 10, incMean: 40000, incSd: 10000 },
      takeaway: { tr: "Ölçeklemeden önce uzaklığı birimler belirler; ölçeklemeden sonra veri.", en: "Before scaling, the units decide the distance; after scaling, the data do." }
    },
    cells: [
      {
        id: "m1-u8-c1", kind: "run",
        task: { tr: "Ham birimlerle uzaklık. Önce tahmin et.", en: "Distance in raw units. Predict first." },
        predict: { q: { tr: "Ham birimlerde A'ya kim daha yakın çıkar?", en: "In raw units, who comes out closer to A?" }, options: { tr: ["B", "C", "Eşit uzaklıkta"], en: ["B", "C", "Equally far"] }, answer: 0, explain: { tr: "A–B uzaklığı ≈ 1.000,6 (gelir farkı 1.000, yaş farkı 35); A–C ≈ 15.000. Gelir rakamları uzaklığı tek başına belirliyor.", en: "The A–B distance is ≈ 1,000.6 (income gap 1,000, age gap 35); A–C is ≈ 15,000. The income numbers alone decide the distance." } },
        code: {
          tr: `import numpy as np
A = np.array([25, 30000])   # [yaş, gelir]
B = np.array([60, 31000])
C = np.array([26, 45000])
print("A–B:", round(np.linalg.norm(A - B), 1))
print("A–C:", round(np.linalg.norm(A - C), 1))`,
          en: `import numpy as np
A = np.array([25, 30000])   # [age, income]
B = np.array([60, 31000])
C = np.array([26, 45000])
print("A–B:", round(np.linalg.norm(A - B), 1))
print("A–C:", round(np.linalg.norm(A - C), 1))`
        },
        after: { tr: "<code>np.linalg.norm(A - B)</code>, iki nokta arasındaki düz çizgi (Öklid) uzaklığıdır: farkların karelerinin toplamının karekökü.", en: "<code>np.linalg.norm(A - B)</code> is the straight-line (Euclidean) distance between two points: the square root of the sum of squared differences." }
      },
      {
        id: "m1-u8-c2", kind: "audit",
        task: { tr: "YZ müşteri tablosunu standartlaştırdı. Çıktıdaki standart sapmalara bak: 1 olmaları gerekirdi. Hatalı satırı bul ve düzelt.", en: "The AI standardised the customer table. Look at the standard deviations in the output: they should be 1. Find the faulty line and fix it." },
        ai: {
          prompt: { tr: "musteri tablosundaki yaş ve gelir sütunlarını standartlaştırır mısın?", en: "Can you standardise the age and income columns of the customers table?" },
          reply: { tr: "Her sütundan ortalamayı çıkarıp yayılıma bölelim:", en: "Subtract the mean from each column and divide by the spread:" },
          code: { tr: MUSTERI_TR + `\nolcekli = (musteri - musteri.mean()) / musteri.var()\nprint(olcekli.round(3).head(3))\nprint("std:", olcekli.std().round(4).tolist())`, en: MUSTERI_EN + `\nscaled = (customers - customers.mean()) / customers.var()\nprint(scaled.round(3).head(3))\nprint("std:", scaled.std().round(4).tolist())` },
          claim: { tr: "Değişkenler standartlaştırıldı; artık aynı ölçekteler.", en: "The variables are standardised; they are now on the same scale." }
        },
        bugLines: [4],
        lineExplain: { tr: "<code>var()</code> varyanstır, yani standart sapmanın <b>karesi</b>. Bölüm varyansla yapılınca gelir sütunu neredeyse sıfıra iner (std ≈ 0,0001) ve değişkenler hâlâ aynı ölçekte değildir. Doğrusu <code>std()</code>.", en: "<code>var()</code> is the variance, the <b>square</b> of the standard deviation. Dividing by the variance shrinks the income column to almost zero (sd ≈ 0.0001), so the variables are still not on the same scale. The right one is <code>std()</code>." },
        hints: [{ tr: "<code>musteri.var()</code> yerine <code>musteri.std()</code>.", en: "Use <code>customers.std()</code> instead of <code>customers.var()</code>." }],
        solution: { tr: MUSTERI_TR + `\nolcekli = (musteri - musteri.mean()) / musteri.std()\nprint(olcekli.round(3).head(3))\nprint("std:", olcekli.std().round(4).tolist())`, en: MUSTERI_EN + `\nscaled = (customers - customers.mean()) / customers.std()\nprint(scaled.round(3).head(3))\nprint("std:", scaled.std().round(4).tolist())` },
        checks: [{ py: { tr: "(olcekli.mean().abs() < 1e-9).all() and ((olcekli.std() - 1).abs() < 1e-9).all()", en: "(scaled.mean().abs() < 1e-9).all() and ((scaled.std() - 1).abs() < 1e-9).all()" }, msg: { tr: "Her sütunun ortalaması 0, standart sapması 1 olmalı.", en: "Each column should have mean 0 and standard deviation 1." } }],
        after: { tr: "YZ'nin açıklaması doğruydu (“yayılıma bölelim”), kodu yanlıştı. Standartlaştırmanın kendi kendini doğrulayan bir testi var: ortalama 0, std 1. Bir sonraki alıştırmada bu testi kalıcı hâle getireceksin.", en: "The AI's explanation was right (“divide by the spread”); its code was wrong. Standardisation has a built-in test: mean 0, sd 1. In the next exercise you will make that test permanent." }
      },
      {
        id: "m1-u8-c3", kind: "check",
        task: { tr: "Ölçeklenmiş her tabloda kullanabileceğin bir kontrol yaz: <code>kontrol_olcek(df)</code>, her sütunun ortalaması 0'a (1e-9 içinde) ve standart sapması 1'e (1e-6 içinde) eşit değilse <code>AssertionError</code> versin.", en: "Write a check you can use on any scaled table: <code>check_scaled(df)</code> should raise <code>AssertionError</code> unless every column has mean 0 (within 1e-9) and standard deviation 1 (within 1e-6)." },
        code: {
          tr: MUSTERI_TR + `\n\ndef kontrol_olcek(df):\n    assert ___, "Ortalamalar 0 değil!"\n    assert ___, "Standart sapmalar 1 değil!"\n\nolcekli = (musteri - musteri.mean()) / musteri.std()\nkontrol_olcek(olcekli)\nprint("Kontrol geçti")`,
          en: MUSTERI_EN + `\n\ndef check_scaled(df):\n    assert ___, "The means are not 0!"\n    assert ___, "The standard deviations are not 1!"\n\nscaled = (customers - customers.mean()) / customers.std()\ncheck_scaled(scaled)\nprint("Check passed")`
        },
        solution: {
          tr: MUSTERI_TR + `\n\ndef kontrol_olcek(df):\n    assert (df.mean().abs() < 1e-9).all(), "Ortalamalar 0 değil!"\n    assert ((df.std() - 1).abs() < 1e-6).all(), "Standart sapmalar 1 değil!"\n\nolcekli = (musteri - musteri.mean()) / musteri.std()\nkontrol_olcek(olcekli)\nprint("Kontrol geçti")`,
          en: MUSTERI_EN + `\n\ndef check_scaled(df):\n    assert (df.mean().abs() < 1e-9).all(), "The means are not 0!"\n    assert ((df.std() - 1).abs() < 1e-6).all(), "The standard deviations are not 1!"\n\nscaled = (customers - customers.mean()) / customers.std()\ncheck_scaled(scaled)\nprint("Check passed")`
        },
        hints: [{ tr: "<code>df.mean()</code> her sütunun ortalamasını verir. Hepsinin mutlak değeri küçük mü: <code>(df.mean().abs() &lt; 1e-9).all()</code>. Standart sapma için de benzer biçimde <code>(df.std() - 1).abs()</code>.", en: "<code>df.mean()</code> gives each column's mean. Are all of them small in absolute value: <code>(df.mean().abs() &lt; 1e-9).all()</code>. Similarly for the standard deviation, <code>(df.std() - 1).abs()</code>." }],
        checks: [
          { py: { tr: "_raises(lambda: kontrol_olcek(musteri))", en: "_raises(lambda: check_scaled(customers))" }, msg: { tr: "Ölçeklenmemiş tabloda kontrolün hata vermesi gerekiyor.", en: "Your check should raise an error on an unscaled table." } },
          { py: { tr: "_raises(lambda: kontrol_olcek((musteri - musteri.mean()) / musteri.var()))", en: "_raises(lambda: check_scaled((customers - customers.mean()) / customers.var()))" }, msg: { tr: "Varyansa bölünmüş (hatalı) tabloda da hata vermeli.", en: "It should also raise on the (wrong) table divided by the variance." } },
          { py: { tr: "kontrol_olcek(olcekli) is None", en: "check_scaled(scaled) is None" }, msg: { tr: "Doğru ölçeklenmiş tabloda hata vermemeli.", en: "It should not raise on a correctly scaled table." } }
        ]
      },
      {
        id: "m1-u8-c4", kind: "run",
        task: { tr: "Ölçekleme ilişkiyi değiştirir mi? Önce tahmin et.", en: "Does scaling change the relationship? Predict first." },
        predict: { q: { tr: "İkinci satırdaki korelasyon birinciye göre nasıl olur?", en: "How does the correlation on the second line compare with the first?" }, options: { tr: ["Aynı", "Daha büyük", "Daha küçük"], en: ["The same", "Larger", "Smaller"] }, answer: 0, explain: { tr: "Standartlaştırma her sütunu yalnızca kaydırır ve yeniden ölçekler. Korelasyon bu işlemlerden etkilenmez.", en: "Standardisation only shifts and rescales each column. Correlation is unaffected by these operations." } },
        code: { tr: MUSTERI_TR + `\nolcekli = (musteri - musteri.mean()) / musteri.std()\nprint(round(musteri["yas"].corr(musteri["gelir"]), 4))\nprint(round(olcekli["yas"].corr(olcekli["gelir"]), 4))`, en: MUSTERI_EN + `\nscaled = (customers - customers.mean()) / customers.std()\nprint(round(customers["age"].corr(customers["income"]), 4))\nprint(round(scaled["age"].corr(scaled["income"]), 4))` }
      }
    ],
    quiz: [
      { q: { tr: "Standartlaştırılmış bir sütunun ortalaması ve standart sapması nedir?", en: "What are the mean and standard deviation of a standardised column?" }, options: { tr: ["0 ve 1", "1 ve 0", "Sütuna göre değişir"], en: ["0 and 1", "1 and 0", "It depends on the column"] }, answer: 0, explain: { tr: "z = (x − ortalama) / std tanımı gereği.", en: "By the definition z = (x − mean) / sd." } },
      { q: { tr: "Ham birimlerle uzaklık hesaplamanın sorunu nedir?", en: "What is the problem with computing distance in raw units?" }, options: { tr: ["Büyük rakamlı değişken uzaklığı tek başına belirler", "Hesap çok yavaştır", "Negatif uzaklık çıkar"], en: ["The variable with large numbers decides the distance alone", "The calculation is very slow", "Distances come out negative"] }, answer: 0, explain: { tr: "Sonuç birim seçimine bağlı hâle gelir.", en: "The result comes to depend on the choice of unit." } },
      { q: { tr: "Ölçekleme iki değişken arasındaki korelasyonu nasıl etkiler?", en: "How does scaling affect the correlation between two variables?" }, options: { tr: ["Artırır", "Değiştirmez", "Sıfırlar"], en: ["Increases it", "Leaves it unchanged", "Sets it to zero"] }, answer: 1, explain: { tr: "Yalnızca birim değişir, ilişki aynı kalır.", en: "Only the unit changes; the relationship stays the same." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 9 — Kategorik değişkenler                                       */
  /* =================================================================== */
  U.push({
    id: "m1-u9",
    minutes: 25,
    packages: ["numpy", "pandas"],
    title: { tr: "Kategorik değişkenler: kukla değişkenler", en: "Categorical variables: dummy variables" },
    blurb: { tr: "Algoritma “Doğu” kelimesini anlamaz. Kukla değişkenler, kukla tuzağı ve sıralı kategoriler.", en: "An algorithm does not understand the word “East”. Dummy variables, the dummy trap and ordered categories." },
    terms: [{ tr: "kukla değişken", en: "dummy variable" }, { tr: "one-hot kodlama", en: "one-hot encoding" }, { tr: "kukla tuzağı", en: "dummy trap" }, { tr: "referans grup", en: "reference group" }],
    concept: {
      tr: `<p>Modeller sayılarla çalışır; “Doğu”, “Batı”, “Merkez” gibi kategorileri doğrudan kullanamaz. İlk akla gelen çözüm her kategoriye bir numara vermektir (Doğu = 1, Batı = 2, Merkez = 3). Ama bu, verinin söylemediği bir şey söyler: Merkez'in Doğu'nun “üç katı” olduğunu, Batı'nın ikisinin “ortasında” durduğunu. Bölgeler arasında böyle bir sıra yoktur.</p>
<p>Doğru çözüm <b>kukla değişkenlerdir</b> (makine öğrenmesinde <b>one-hot kodlama</b> da denir): her kategori için bir 0/1 sütunu. Bir müşteri Doğu'daysa <code>bolge_Doğu</code> = 1, diğerleri 0. Ekonometrideki kukla değişkenlerin aynısı.</p>
<p><b>Kukla tuzağı:</b> her satırda kukla sütunlarının toplamı 1'dir. Modelde bir sabit terim de varsa (hep 1), bir sütun diğerlerinden tam olarak hesaplanabilir ve doğrusal bir model katsayıları ayıramaz. Ünite 2'deki sorunun en uç hâli. Çözüm: bir kategoriyi dışarıda bırakmak (<code>drop_first=True</code>). Dışarıda kalan kategori <b>referans grup</b> olur; diğer katsayılar ona göre yorumlanır.</p>
<div class="box"><b>Sıralı kategoriler farklıdır.</b> Kredi notu (BBB &lt; A &lt; AA &lt; AAA) gibi doğal bir sırası olan kategorilerde sırayı koruyan sayılar (1, 2, 3, 4) kullanılabilir. Bunu yaparken sıranın gerçekten var olduğundan ve sayıları elle, bilerek verdiğinden emin ol.</div>`,
      en: `<p>Models work with numbers; they cannot use categories such as “East”, “West”, “Central” directly. The first idea is to give each category a number (East = 1, West = 2, Central = 3). But that says something the data do not: that Central is “three times” East and West sits “between” them. There is no such order among regions.</p>
<p>The right solution is <b>dummy variables</b> (also called <b>one-hot encoding</b> in machine learning): one 0/1 column per category. If a customer is in the East, <code>region_East</code> = 1 and the others 0. Exactly the dummy variables of econometrics.</p>
<p><b>The dummy trap:</b> in every row the dummy columns add up to 1. If the model also has a constant term (always 1), one column can be computed exactly from the others and a linear model cannot separate the coefficients. It is the extreme case of the problem in unit 2. The fix: leave one category out (<code>drop_first=True</code>). The omitted category becomes the <b>reference group</b>; the other coefficients are interpreted relative to it.</p>
<div class="box"><b>Ordered categories are different.</b> For categories with a natural order, such as a credit rating (BBB &lt; A &lt; AA &lt; AAA), numbers that preserve the order (1, 2, 3, 4) can be used. When you do this, make sure the order really exists and assign the numbers by hand, deliberately.</div>`
    },
    playground: {
      type: "oneHot",
      intro: { tr: "Bölge sütunu kukla değişkenlere dönüşüyor. drop_first ve sabit terim seçeneklerini aç-kapa ve tablonun nasıl değiştiğine bak.", en: "The region column is turned into dummy variables. Toggle drop_first and the constant column and watch how the table changes." },
      values: { tr: ["Doğu", "Batı", "Merkez", "Doğu", "Batı", "Merkez"], en: ["East", "West", "Central", "East", "West", "Central"] },
      label: { tr: "bolge", en: "region" },
      prefix: { tr: "bolge", en: "region" },
      takeaway: { tr: "k kategori için k − 1 kukla yeterlidir; dışarıda kalan kategori referans gruptur.", en: "For k categories, k − 1 dummies are enough; the omitted category is the reference group." }
    },
    cells: [
      {
        id: "m1-u9-c1", kind: "run",
        task: { tr: "<code>pd.get_dummies</code> kukla değişkenleri üretir. Önce tahmin et.", en: "<code>pd.get_dummies</code> creates dummy variables. Predict first." },
        predict: { q: { tr: "İlk tablo kaç sütun, ikinci tablo (<code>drop_first=True</code>) kaç sütun olur?", en: "How many columns does the first table have, and the second (<code>drop_first=True</code>)?" }, options: { tr: ["3 ve 2", "1 ve 1", "10 ve 9"], en: ["3 and 2", "1 and 1", "10 and 9"] }, answer: 0, explain: { tr: "Üç bölge, üç kukla sütun; biri dışarıda bırakılınca iki.", en: "Three regions, three dummy columns; leaving one out gives two." } },
        code: { tr: K.tr + `\nprint(pd.get_dummies(kredi["bolge"], prefix="bolge").astype(int).head(4))\nprint(pd.get_dummies(kredi["bolge"], prefix="bolge", drop_first=True).astype(int).head(4))`, en: K.en + `\nprint(pd.get_dummies(loans["region"], prefix="region").astype(int).head(4))\nprint(pd.get_dummies(loans["region"], prefix="region", drop_first=True).astype(int).head(4))` },
        after: { tr: "<code>drop_first=True</code> alfabetik olarak ilk kategoriyi (Batı) çıkardı; Batı referans grup oldu. <code>astype(int)</code>, pandas'ın True/False değerlerini 1/0 olarak göstermek için.", en: "<code>drop_first=True</code> dropped the alphabetically first category (Central); Central became the reference group. <code>astype(int)</code> just shows pandas' True/False values as 1/0." }
      },
      {
        id: "m1-u9-c2", kind: "audit",
        task: { tr: "YZ bölge sütununu “modelin anlayacağı hâle” getirdi. Kod çalışıyor, ama verinin söylemediği bir şey söylüyor. Hatalı satırı bul ve kukla değişkenlerle düzelt (bir kategoriyi dışarıda bırak).", en: "The AI turned the region column into “something the model understands”. The code runs, but it says something the data do not. Find the faulty line and fix it with dummy variables (leave one category out)." },
        ai: {
          prompt: { tr: "kredi tablosundaki 'bolge' sütunu metin; modelde kullanabilmem için sayıya çevirir misin?", en: "The 'region' column in the loans table is text; can you convert it to numbers so I can use it in a model?" },
          reply: { tr: "Her bölgeye bir kod verelim:", en: "Let us give each region a code:" },
          code: { tr: K.tr + `\nkredi["bolge"] = kredi["bolge"].map({"Doğu": 1, "Batı": 2, "Merkez": 3})\nprint(kredi[["bolge"]].head())`, en: K.en + `\nloans["region"] = loans["region"].map({"East": 1, "West": 2, "Central": 3})\nprint(loans[["region"]].head())` },
          claim: { tr: "Bölge artık sayısal; model bu sütunu doğrudan kullanabilir.", en: "Region is now numeric; the model can use this column directly." }
        },
        bugLines: [11],
        lineExplain: { tr: "Kodlar bölgeler arasında bir <b>sıra ve mesafe</b> varsayıyor: Merkez (3) Doğu'nun (1) üç katı, Batı ikisinin ortasında. Doğrusal bir model “bölge bir birim artınca” diye bir katsayı kestirir; bu anlamsızdır. Bölge sırasız bir kategoridir.", en: "The codes assume an <b>order and distance</b> between regions: Central (3) is three times East (1), West sits between them. A linear model would estimate a coefficient for “region rising by one unit”, which is meaningless. Region is an unordered category." },
        hints: [{ tr: "<code>kredi = pd.get_dummies(kredi, columns=[\"bolge\"], drop_first=True)</code> bölge sütununu kukla sütunlarla değiştirir.", en: "<code>loans = pd.get_dummies(loans, columns=[\"region\"], drop_first=True)</code> replaces the region column with dummy columns." }],
        solution: { tr: K.tr + `\nkredi = pd.get_dummies(kredi, columns=["bolge"], drop_first=True)\nprint(kredi.filter(like="bolge").astype(int).head())`, en: K.en + `\nloans = pd.get_dummies(loans, columns=["region"], drop_first=True)\nprint(loans.filter(like="region").astype(int).head())` },
        checks: [
          { py: { tr: "\"bolge\" not in kredi.columns and sorted(c for c in kredi.columns if c.startswith(\"bolge_\")) == [\"bolge_Doğu\", \"bolge_Merkez\"]", en: "\"region\" not in loans.columns and sorted(c for c in loans.columns if c.startswith(\"region_\")) == [\"region_East\", \"region_West\"]" }, msg: { tr: "Bölge sütunu, bir kategorisi dışarıda bırakılmış iki kukla sütunla değiştirilmeli (<code>bolge_Doğu</code>, <code>bolge_Merkez</code>).", en: "The region column should be replaced by two dummy columns with one category left out (<code>region_East</code>, <code>region_West</code>)." } },
          { py: { tr: "len(kredi) == 10", en: "len(loans) == 10" }, msg: { tr: "Satır sayısı değişmemeli.", en: "The number of rows should not change." } }
        ],
        after: { tr: "“Sayıya çevir” isteğine YZ en kısa yoldan yanıt verdi. İstekte değişkenin türünü (sırasız kategori) ve istediğin kodlamayı (kukla, <code>drop_first</code>) belirtmek bu hatayı önler.", en: "The AI answered “convert to numbers” by the shortest route. Stating the variable's type (unordered category) and the encoding you want (dummies, <code>drop_first</code>) in the prompt prevents this." }
      },
      {
        id: "m1-u9-c3", kind: "run",
        task: { tr: "Kukla tuzağını kendin gör. Önce tahmin et.", en: "See the dummy trap for yourself. Predict first." },
        predict: { q: { tr: "Bu kod ne yazdırır?", en: "What does this code print?" }, options: { tr: ["Her satırda 1: [1, 1, 1, …]", "Bölge kodları: [1, 2, 3, …]", "Her satırda 3: [3, 3, 3, …]"], en: ["1 in every row: [1, 1, 1, …]", "Region codes: [1, 2, 3, …]", "3 in every row: [3, 3, 3, …]"] }, answer: 0, explain: { tr: "Her müşteri tam olarak bir bölgededir; üç kukla sütunun toplamı her satırda 1'dir, yani bir sabit terimle birebir aynıdır.", en: "Each customer is in exactly one region; the three dummies add up to 1 in every row, exactly like a constant term." } },
        code: { tr: K.tr + `\nkukla = pd.get_dummies(kredi["bolge"], prefix="bolge").astype(int)\nprint(kukla.sum(axis=1).tolist())`, en: K.en + `\ndummies = pd.get_dummies(loans["region"], prefix="region").astype(int)\nprint(dummies.sum(axis=1).tolist())` }
      },
      {
        id: "m1-u9-c4", kind: "fill",
        task: { tr: "Kredi notu sıralı bir kategori: BBB &lt; A &lt; AA &lt; AAA. Sırayı koruyan bir eşleme sözlüğü yaz (BBB = 1 … AAA = 4).", en: "Credit rating is an ordered category: BBB &lt; A &lt; AA &lt; AAA. Write a mapping dictionary that preserves the order (BBB = 1 … AAA = 4)." },
        code: {
          tr: `import pandas as pd
sirket = pd.DataFrame({"kredi_notu": ["BBB", "A", "AA", "BBB", "AAA", "A"]})
sira = ___
sirket["not_sira"] = sirket["kredi_notu"].map(sira)
print(sirket)`,
          en: `import pandas as pd
firms = pd.DataFrame({"rating": ["BBB", "A", "AA", "BBB", "AAA", "A"]})
order = ___
firms["rating_rank"] = firms["rating"].map(order)
print(firms)`
        },
        solution: {
          tr: `import pandas as pd
sirket = pd.DataFrame({"kredi_notu": ["BBB", "A", "AA", "BBB", "AAA", "A"]})
sira = {"BBB": 1, "A": 2, "AA": 3, "AAA": 4}
sirket["not_sira"] = sirket["kredi_notu"].map(sira)
print(sirket)`,
          en: `import pandas as pd
firms = pd.DataFrame({"rating": ["BBB", "A", "AA", "BBB", "AAA", "A"]})
order = {"BBB": 1, "A": 2, "AA": 3, "AAA": 4}
firms["rating_rank"] = firms["rating"].map(order)
print(firms)`
        },
        hints: [{ tr: "Sözlük biçimi: <code>{\"BBB\": 1, \"A\": 2, ...}</code>", en: "Dictionary form: <code>{\"BBB\": 1, \"A\": 2, ...}</code>" }],
        checks: [{ py: { tr: "sirket[\"not_sira\"].tolist() == [1, 2, 3, 1, 4, 2]", en: "firms[\"rating_rank\"].tolist() == [1, 2, 3, 1, 4, 2]" }, msg: { tr: "Sıra numaraları [1, 2, 3, 1, 4, 2] olmalı. Eşlenmeyen bir not varsa NaN çıkar.", en: "The ranks should be [1, 2, 3, 1, 4, 2]. An unmapped rating shows up as NaN." } }],
        after: { tr: "Buradaki sayılar yalnızca sırayı anlatır: AAA ile AA arasındaki farkın BBB ile A arasındaki farka eşit olduğunu iddia etmez. Bu varsayımın uygun olup olmadığı, kullanılacak yönteme bağlıdır.", en: "These numbers only express order: they do not claim that the gap between AAA and AA equals the gap between BBB and A. Whether that assumption is acceptable depends on the method used." }
      }
    ],
    quiz: [
      { q: { tr: "Sırasız bir kategoriyi (bölge) 1, 2, 3 diye kodlamanın sorunu nedir?", en: "What is wrong with coding an unordered category (region) as 1, 2, 3?" }, options: { tr: ["Verinin söylemediği bir sıra ve mesafe varsayar", "Pandas buna izin vermez", "Hiçbir sorunu yoktur"], en: ["It assumes an order and distance the data do not imply", "Pandas does not allow it", "Nothing is wrong"] }, answer: 0, explain: { tr: "Kukla değişkenler bu varsayımı yapmaz.", en: "Dummy variables make no such assumption." } },
      { q: { tr: "Kukla tuzağından nasıl kaçınılır?", en: "How do you avoid the dummy trap?" }, options: { tr: ["Bir kategoriyi dışarıda bırakarak", "Tüm kuklaları ölçekleyerek", "Kategorileri birleştirerek"], en: ["By leaving one category out", "By scaling all dummies", "By merging categories"] }, answer: 0, explain: { tr: "<code>drop_first=True</code>; dışarıda kalan kategori referans grup olur.", en: "<code>drop_first=True</code>; the omitted category becomes the reference group." } },
      { q: { tr: "Kredi notu için sırayı koruyan sayılar ne zaman kullanılabilir?", en: "When can order-preserving numbers be used for a credit rating?" }, options: { tr: ["Kategoriler arasında doğal bir sıra olduğunda", "Hiçbir zaman", "Kategori sayısı ikiden fazlaysa"], en: ["When the categories have a natural order", "Never", "When there are more than two categories"] }, answer: 0, explain: { tr: "Sıralı kategorilerde sıra bir bilgidir.", en: "In ordered categories the order is information." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 10 — Colab + Gemini atölyesi: gerçek veriyi hazırlamak          */
  /* =================================================================== */
  const NB = { tr: "modul1/10_veri_hazirlama_atolyesi_tr.ipynb", en: "module1/10_data_preparation_workshop_en.ipynb" };
  U.push({
    id: "m1-u10",
    minutes: 45,
    title: { tr: "Colab + Gemini atölyesi: gerçek veriyi hazırlamak", en: "Colab + Gemini workshop: preparing real data" },
    blurb: { tr: "Üç FRED serisini birleştir, eksikleri doğru ele al, standartlaştır. Kodu Gemini yazar, sen denetlersin.", en: "Merge three FRED series, handle the gaps correctly, standardise. Gemini writes the code, you audit it." },
    terms: [{ tr: "birleştirme (merge)", en: "merge" }, { tr: "dış birleştirme", en: "outer join" }, { tr: "ortak dönem", en: "common period" }],
    concept: {
      tr: `<p>Bu atölyede modülün veri hazırlama adımlarını gerçek veriyle uygulayacaksın. Veri, St. Louis Fed'in açık <b>FRED</b> veri tabanından üç aylık ABD serisi:</p>
<ul>
<li><b>UNRATE</b> — işsizlik oranı (%), 1948'den bu yana</li>
<li><b>FEDFUNDS</b> — federal fon faizi (%), 1954 ortasından bu yana</li>
<li><b>T10Y3MM</b> — 10 yıllık ile 3 aylık tahvil faizi farkı (puan), 1982'den bu yana</li>
</ul>
<p>Seriler farklı tarihlerde başlıyor. Üçünü tarih üzerinden birleştirdiğinde ilk yıllarda bazı sütunlar <b>eksik</b> olacak. Bu eksikler bir hata değil: 1950'de federal fon faizi diye bir seri yoktu. Bu yüzden Ünite 7'deki soruyu yeniden sormalısın: <b>neden eksik?</b> Burada doldurmak, var olmayan bir geçmiş uydurmak olur. Doğru karar, üç serinin de bulunduğu <b>ortak dönemle</b> çalışmak.</p>
<p><b>Görevler</b></p>
<ol>
<li><b>Görev A — Birleştir:</b> Üç tabloyu tarih üzerinden, hiçbir ay kaybolmayacak biçimde birleştir (dış birleştirme), tarihe göre sırala, her sütundaki eksik sayısını yazdır.</li>
<li><b>Görev B — Ortak dönem ve ölçek:</b> Üç serinin de mevcut olduğu ayları al (doldurma yapmadan) ve üç değişkeni standartlaştır.</li>
</ol>
<div class="box"><b>Gemini'nin sık yaptığı iki hata:</b> birleştirmede varsayılan olarak <b>iç birleştirme</b> kullanıp ayları sessizce atmak; eksikleri <b>0 ya da önceki değerle doldurmak</b>. Kontrol hücreleri ikisini de yakalar. Colab ve Gemini'yi kullanma kuralları Modül 0'daki atölyeyle aynı.</div>`,
      en: `<p>In this workshop you apply the module's data preparation steps to real data. The data are three monthly US series from the St. Louis Fed's open <b>FRED</b> database:</p>
<ul>
<li><b>UNRATE</b> — unemployment rate (%), since 1948</li>
<li><b>FEDFUNDS</b> — federal funds rate (%), since mid-1954</li>
<li><b>T10Y3MM</b> — 10-year minus 3-month Treasury yield spread (points), since 1982</li>
</ul>
<p>The series start on different dates. When you merge the three on date, some columns will be <b>missing</b> in the early years. These gaps are not errors: in 1950 there was no federal funds rate series. So ask the question from unit 7 again: <b>why is it missing?</b> Filling here would mean inventing a past that does not exist. The right decision is to work with the <b>common period</b> in which all three series exist.</p>
<p><b>Tasks</b></p>
<ol>
<li><b>Task A — Merge:</b> merge the three tables on date so that no month is lost (an outer join), sort by date, and print the number missing in each column.</li>
<li><b>Task B — Common period and scale:</b> keep the months in which all three series exist (without filling) and standardise the three variables.</li>
</ol>
<div class="box"><b>Two mistakes Gemini often makes:</b> using an <b>inner join</b> by default and silently dropping months; <b>filling gaps with 0 or the previous value</b>. The check cells catch both. The rules for using Colab and Gemini are the same as in the Module 0 workshop.</div>`
    },
    playground: null,
    cells: [
      {
        id: "m1-u10-c1", kind: "prompt",
        task: { tr: "Görev A için Gemini'ye vereceğin isteği burada hazırla. Notebook'ta üç tablo var: <code>issizlik</code>, <code>faiz</code>, <code>vade_farki</code>; her birinde <code>tarih</code> ve bir değer sütunu.", en: "Prepare the prompt for Task A here. The notebook has three tables: <code>unemployment</code>, <code>fed_funds</code>, <code>term_spread</code>; each has a <code>date</code> column and one value column." },
        weak: {
          prompt: { tr: "Bu üç tabloyu birleştir.", en: "Merge these three tables." },
          reply: { tr: "Tablolar tarih üzerinden birleştirildi:", en: "The tables were merged on date:" },
          code: { tr: "veri = issizlik.merge(faiz, on=\"tarih\").merge(vade_farki, on=\"tarih\")\nveri.head()", en: "data = unemployment.merge(fed_funds, on=\"date\").merge(term_spread, on=\"date\")\ndata.head()" },
          claim: { tr: "Birleşik tablo hazır.", en: "The merged table is ready." }
        },
        checklist: [
          { label: { tr: "Tablolar ve sütunlar", en: "Tables and columns" }, why: { tr: "Tablo ve sütun adlarını birebir yaz.", en: "Write the table and column names exactly." }, re: { tr: "issizlik|faiz|vade_farki|tarih", en: "unemployment|fed_funds|term_spread|date" } },
          { label: { tr: "Birleştirme türü", en: "Join type" }, why: { tr: "Hiçbir ay kaybolmasın: dış birleştirme (how=\"outer\").", en: "No month should be lost: an outer join (how=\"outer\")." }, re: { tr: "outer|dış|kaybolma|hiçbir ay", en: "outer|lose|no month" } },
          { label: { tr: "Sıralama", en: "Sorting" }, why: { tr: "Tarihe göre sırala.", en: "Sort by date." }, re: { tr: "sırala|sort", en: "sort" } },
          { label: { tr: "Eksikler ve kontrol", en: "Gaps and checks" }, why: { tr: "Eksikleri doldurmamasını, sayılarını yazdırmasını iste.", en: "Ask it not to fill gaps and to print their counts." }, re: { tr: "eksik|doldurma|isna|satır sayısı", en: "missing|fill|isna|row count" } }
        ],
        minLen: 90,
        strong: { prompt: { tr: "issizlik, faiz ve vade_farki adlı üç pandas tablosu var; her birinde 'tarih' (aylık, datetime) ve bir değer sütunu bulunuyor. Üçünü 'tarih' üzerinden, hiçbir ay kaybolmayacak biçimde dış birleştirmeyle (how='outer') birleştir, tarihe göre sırala ve sonucu 'veri' adlı tabloya ata. Eksik değerleri doldurma veya silme. Satır sayısını, her sütundaki eksik değer sayısını ve ilk ile son 3 satırı yazdır.", en: "There are three pandas tables called unemployment, fed_funds and term_spread; each has a 'date' column (monthly, datetime) and one value column. Merge the three on 'date' with an outer join (how='outer') so that no month is lost, sort by date and store the result in a table called 'data'. Do not fill or drop missing values. Print the row count, the number of missing values in each column and the first and last 3 rows." } }
      },
      {
        id: "m1-u10-c2", kind: "colab",
        task: { tr: "<b>Görev A — Birleştir.</b> Notebook'u aç, Gemini ile <code>veri</code> tablosunu oluştur, kontrol hücresini çalıştır ve verdiği kodu buraya yapıştır.", en: "<b>Task A — Merge.</b> Open the notebook, build the <code>data</code> table with Gemini, run the check cell and paste the code it gives you here." },
        notebook: NB,
        steps: {
          tr: ["Notebook'u aç ve <b>Kurulum</b> hücresini çalıştır (üç seri FRED'den indirilir).", "<b>Görev A</b> hücresinde Gemini'ye hazırladığın isteği ver.", "Gemini'nin kodunu oku: birleştirme türü (<code>how</code>), sıralama, eksiklere dokunulmaması.", "Kodu çalıştır, sonra <b>Kontrol A</b> hücresini çalıştır.", "Kontrol geçerse ekrana çıkan <code>ML1-…</code> kodunu yapıştır."],
          en: ["Open the notebook and run the <b>Setup</b> cell (three series are downloaded from FRED).", "In the <b>Task A</b> cell, give Gemini the prompt you prepared.", "Read Gemini's code: the join type (<code>how</code>), sorting, and that the gaps are left alone.", "Run the code, then run the <b>Check A</b> cell.", "If the check passes, paste the <code>ML1-…</code> code it prints."]
        },
        codeHashes: ["9831515e"],
        after: { tr: "Birleşik tabloda eksik sayıları farklı: işsizlikte hiç yok (en uzun seri), faizde 1954 öncesi, vade farkında 1982 öncesi eksik. Eksiklerin deseni, nedenlerini anlatıyor.", en: "The merged table has different gap counts: none in unemployment (the longest series), fed funds missing before 1954, the spread missing before 1982. The pattern of the gaps tells their cause." }
      },
      {
        id: "m1-u10-c3", kind: "colab",
        task: { tr: "<b>Görev B — Ortak dönem ve ölçek.</b> Üç serinin de bulunduğu ayları <code>ortak</code> tablosuna al, sonra üç değişkeni standartlaştırıp <code>olcekli</code> tablosuna yaz.", en: "<b>Task B — Common period and scale.</b> Put the months in which all three series exist into a table called <code>common</code>, then standardise the three variables into <code>scaled</code>." },
        notebook: NB,
        steps: {
          tr: ["<b>Görev B</b> hücresinde Gemini'den <code>ortak</code> ve <code>olcekli</code> tablolarını üretmesini iste. Eksikleri doldurmamasını açıkça söyle.", "Kodu denetle: <code>fillna</code> ya da <code>ffill</code> var mı? Ölçeklemede <code>std()</code> mi kullanılmış?", "Ünite 8'deki kontrolün mantığıyla kendin de bak: ortalamalar 0, standart sapmalar 1 mi?", "<b>Kontrol B</b> hücresini çalıştır ve kodu buraya yapıştır."],
          en: ["In the <b>Task B</b> cell, ask Gemini to produce the <code>common</code> and <code>scaled</code> tables. Say explicitly that gaps must not be filled.", "Audit the code: is there a <code>fillna</code> or <code>ffill</code>? Does the scaling use <code>std()</code>?", "Check it yourself with the logic of the unit 8 check: are the means 0 and the standard deviations 1?", "Run the <b>Check B</b> cell and paste the code here."]
        },
        codeHashes: ["746b73ff"],
        after: { tr: "Ortak dönem 1982'de başlıyor; yaklaşık 34 yıllık veriyi bilerek dışarıda bıraktın. Bu bir kayıp değil, bir karar: o yıllarda üç değişkenin üçü birden gözlenmedi.", en: "The common period starts in 1982; you deliberately left out about 34 years of data. That is not a loss but a decision: in those years the three variables were not all observed." }
      },
      {
        id: "m1-u10-c4", kind: "auditlog",
        task: { tr: "Atölyeyi bir denetim notuyla kapat. Bu not, yaptığın veri hazırlama kararlarının kaydı.", en: "Close the workshop with an audit note. It is the record of your data preparation decisions." },
        fields: {
          tr: [
            { label: "Gemini birleştirmede hangi türü kullandı? Değiştirmen gerekti mi?", help: "inner / outer; satır sayısını kontrol ettin mi?", ph: "Örnek: Gemini önce how belirtmedi, inner birleştirdi…" },
            { label: "Eksik değerlerle ne yaptın ve neden?", help: "Neden doldurmadın? Ortak dönem kaçta başladı?", ph: "Örnek: 1954 öncesi faiz yoktu, doldurmak uydurma olurdu…" },
            { label: "Ölçeklemeyi nasıl doğruladın?", help: "Ortalama ve standart sapma kontrolü", ph: "Örnek: olcekli.mean() ve olcekli.std() ile baktım…" }
          ],
          en: [
            { label: "Which join type did Gemini use? Did you need to change it?", help: "inner / outer; did you check the row count?", ph: "Example: Gemini did not set how at first and did an inner join…" },
            { label: "What did you do with the missing values, and why?", help: "Why did you not fill them? When did the common period start?", ph: "Example: there was no fed funds rate before 1954; filling would be inventing…" },
            { label: "How did you verify the scaling?", help: "Mean and standard deviation check", ph: "Example: I looked at scaled.mean() and scaled.std()…" }
          ]
        }
      }
    ],
    quiz: [
      { q: { tr: "Üç seriyi birleştirirken neden dış birleştirme (outer) kullandık?", en: "Why did we use an outer join to merge the three series?" }, options: { tr: ["Daha hızlı olduğu için", "Hiçbir ay sessizce kaybolmasın ve eksiklerin deseni görünsün diye", "Eksikleri otomatik doldurduğu için"], en: ["Because it is faster", "So that no month is silently lost and the pattern of gaps is visible", "Because it fills gaps automatically"] }, answer: 1, explain: { tr: "İç birleştirme yalnızca üç tabloda da olan ayları tutar ve bunu haber vermez.", en: "An inner join keeps only months present in all three tables and does not tell you so." } },
      { q: { tr: "1954 öncesi federal fon faizi eksikliğini neden doldurmadık?", en: "Why did we not fill the missing fed funds rate before 1954?" }, options: { tr: ["Doldurmak, var olmayan bir geçmiş uydurmak olurdu", "Pandas buna izin vermez", "Eksik sayısı azdı"], en: ["Filling would mean inventing a past that does not exist", "Pandas does not allow it", "There were few gaps"] }, answer: 0, explain: { tr: "Eksikliğin nedeni seri yokluğu; doldurulacak gerçek bir değer yok.", en: "The cause is that the series did not exist; there is no real value to fill in." } },
      { q: { tr: "Standartlaştırmayı doğrulamanın en hızlı yolu nedir?", en: "What is the quickest way to verify standardisation?" }, options: { tr: ["Grafiğe bakmak", "Her sütunun ortalamasının 0, standart sapmasının 1 olduğunu kontrol etmek", "Gemini'ye sormak"], en: ["Looking at a chart", "Checking that each column has mean 0 and standard deviation 1", "Asking Gemini"] }, answer: 1, explain: { tr: "Ünite 8'deki kontrolün aynısı.", en: "The same check as in unit 8." } }
    ]
  });
})();
