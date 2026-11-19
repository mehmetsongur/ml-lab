/* Modül 0 — ek dersler: döngüleri kısaltmak, metinler ve sözlükler, simülasyon, pandas II, bitirme projesi
 * © 2026 Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 * Tüm veriler kurgusaldır. All data are fictional.
 */
(function () {
  "use strict";
  const m = window.LAB.modules.find((x) => x.id === "m0");
  if (!m) return;
  const D = window.M0_DATA;
  const MLIST = D.MLIST;

  /* ---------- pandas II için kurgusal bölgesel panel ---------- */
  const REG = [{ tr: "Kuzey", en: "North" }, { tr: "Güney", en: "South" }, { tr: "Doğu", en: "East" }, { tr: "Batı", en: "West" }, { tr: "Merkez", en: "Central" }];
  const YEARS = [2020, 2021, 2022, 2023, 2024];
  const baseU = [9.5, 11.0, 14.5, 8.0, 10.0], yAdj = [1.6, 0.8, 0, -0.4, -0.2], baseI = [52, 46, 34, 61, 55];
  const PANEL_ROWS = [];
  REG.forEach((r, b) => YEARS.forEach((y, k) => {
    const u = Math.round((baseU[b] + yAdj[k] + (((b * 7 + k * 3) % 5) - 2) * 0.1) * 10) / 10;
    const inc = (b === 2 && k === 2) ? null : Math.round(baseI[b] * (1 + 0.04 * k) + ((b + k) % 3));
    PANEL_ROWS.push([r, y, u, inc]);
  }));
  const PANEL = {
    name: { tr: "panel", en: "panel" },
    cols: [{ tr: "bolge", en: "region" }, { tr: "yil", en: "year" }, { tr: "issizlik", en: "unemployment" }, { tr: "gelir", en: "income" }],
    rows: PANEL_ROWS
  };
  function panelCsv(lang) {
    const head = PANEL.cols.map((c) => c[lang]).join(",");
    const body = PANEL_ROWS.map((r) => [r[0][lang], r[1], r[2].toFixed(1), r[3] == null ? "" : r[3]].join(",")).join("\n");
    return head + "\n" + body;
  }
  const P2_SETUP = {
    tr: 'import io\nimport pandas as pd\n\ncsv_metni = """' + panelCsv("tr") + '\n"""\n\npanel = pd.read_csv(io.StringIO(csv_metni))\n',
    en: 'import io\nimport pandas as pd\n\ncsv_text = """' + panelCsv("en") + '\n"""\n\npanel = pd.read_csv(io.StringIO(csv_text))\n'
  };
  const REG_TABLE = {
    tr: 'bolgeler = pd.DataFrame({\n    "bolge": ["Kuzey", "Güney", "Doğu", "Batı", "Merkez"],\n    "nufus": [6.1, 7.4, 5.2, 9.8, 12.3],          # milyon\n    "kiyi": ["evet", "evet", "hayır", "evet", "hayır"]\n})\n',
    en: 'regions = pd.DataFrame({\n    "region": ["North", "South", "East", "West", "Central"],\n    "population": [6.1, 7.4, 5.2, 9.8, 12.3],     # millions\n    "coastal": ["yes", "yes", "no", "yes", "no"]\n})\n'
  };

  const TEXT = {
    tr: "Kurul, enflasyondaki düşüş eğilimini dikkatle izlemektedir. Kurul, sıkı para politikası duruşunu enflasyon kalıcı olarak düşene kadar sürdürecektir. Talep koşulları ve enflasyon beklentileri yakından takip edilmektedir. Kurul, gerekli görülmesi durumunda para politikası araçlarını kullanmaya devam edecektir.",
    en: "The committee is closely monitoring the downward trend in inflation. The committee will maintain its tight monetary policy stance until inflation falls permanently. Demand conditions and inflation expectations are being followed closely. The committee will continue to use its monetary policy tools if deemed necessary."
  };
  const STOP = {
    tr: ["ve", "ile", "bu", "bir", "da", "de", "için", "olarak", "kadar", "gibi", "çok"],
    en: ["the", "and", "of", "to", "in", "is", "its", "if", "are", "be", "will", "until"]
  };

  const lessons = [];

  /* =================================================================== */
  /* Döngüleri kısaltmak                                                  */
  /* =================================================================== */
  lessons.push({
    id: "m0-loops2",
    minutes: 25,
    title: { tr: "Döngüleri kısaltmak: while, enumerate, zip", en: "Shorter loops: while, enumerate, zip" },
    blurb: { tr: "Koşul sağlandıkça tekrar, sıra numarasıyla gezmek, iki listeyi eşlemek ve tek satırlık liste üreteçleri.", en: "Repeat while a condition holds, loop with positions, pair two lists, and one-line list comprehensions." },
    terms: [{ tr: "while döngüsü", en: "while loop" }, { tr: "liste üreteci", en: "list comprehension" }, { tr: "eşleme", en: "zip" }, { tr: "sıra numarası", en: "enumerate" }],
    concept: {
      tr: `<p><code>for</code> döngüsü bir listenin her elemanını <b>bir kez</b> ziyaret eder. Ama bazen kaç tur gerektiğini önceden bilmeyiz: “GSYH kaç yılda ikiye katlanır?” Böyle durumlarda <b><code>while</code></b> kullanılır: koşul doğru olduğu sürece döngü tekrar eder.</p>
<pre><code>gsyh = 100
yil = 0
while gsyh &lt; 200:
    gsyh = gsyh * 1.05
    yil = yil + 1</code></pre>
<ul>
<li><b>Dikkat:</b> <code>while</code> döngüsünde koşulu bir gün yanlış yapacak bir değişiklik olmalıdır. Yoksa döngü hiç bitmez. Bu laboratuvar 15 saniye sonra Python'u durdurur.</li>
<li><code>enumerate(liste)</code> her turda hem <b>sıra numarasını</b> hem <b>değeri</b> verir: <code>for i, deger in enumerate(aylik_enf):</code>.</li>
<li><code>zip(a, b)</code> iki listeyi yan yana <b>eşler</b>: <code>for n, p in zip(nominal, enflasyon):</code>. Her turda her listeden bir eleman gelir. Listelerin uzunluğu farklıysa <code>zip</code> <b>kısa olan bittiğinde durur</b>: <code>list(zip([1, 2, 3], ["a", "b"]))</code> yalnızca iki çift verir, 3 sessizce dışarıda kalır. Seriler eşit uzunlukta mı, önce kontrol et.</li>
<li><b>Liste üreteci</b> (list comprehension), “boş liste aç, döngüyle doldur” kalıbının tek satırlık hâlidir: <code>[d / 100 for d in aylik_enf if d &gt; 3]</code>. Okunuşu: “aylik_enf içindeki her d için, d 3'ten büyükse, d / 100'ü al.”</li>
</ul>
<div class="box econ"><b>70 kuralı.</b> Yıllık %g büyüyen bir değişken yaklaşık 70 / g yılda ikiye katlanır. %5 büyümede yaklaşık 14 yıl. <code>while</code> döngüsüyle tam sonucu bulacaksın.</div>`,
      en: `<p>A <code>for</code> loop visits each element of a list <b>once</b>. But sometimes we do not know in advance how many turns we need: “How many years until GDP doubles?” Then we use <b><code>while</code></b>: the loop repeats as long as the condition is true.</p>
<pre><code>gdp = 100
years = 0
while gdp &lt; 200:
    gdp = gdp * 1.05
    years = years + 1</code></pre>
<ul>
<li><b>Careful:</b> something inside a <code>while</code> loop must eventually make the condition false, or the loop never ends. This lab stops Python after 15 seconds.</li>
<li><code>enumerate(list)</code> gives both the <b>position</b> and the <b>value</b> each turn: <code>for i, value in enumerate(monthly_inf):</code>.</li>
<li><code>zip(a, b)</code> <b>pairs</b> two lists side by side: <code>for n, p in zip(nominal, inflation):</code>. Each turn takes one element from each list. If the lists differ in length, <code>zip</code> <b>stops when the shorter one ends</b>: <code>list(zip([1, 2, 3], ["a", "b"]))</code> gives only two pairs and 3 is silently dropped. Check first that the series have the same length.</li>
<li>A <b>list comprehension</b> is the one-line form of “open an empty list, fill it in a loop”: <code>[d / 100 for d in monthly_inf if d &gt; 3]</code>. Read it as “for each d in monthly_inf, if d is above 3, take d / 100.”</li>
</ul>
<div class="box econ"><b>Rule of 70.</b> A variable growing g% a year doubles in about 70 / g years: about 14 years at 5%. You will find the exact answer with a <code>while</code> loop.</div>`
    },
    playground: {
      type: "compBuilder",
      intro: { tr: "Liste üreteci sekmesinde dönüşümü ve koşulu seç: solda uzun döngü, sağda aynı işi yapan tek satır. while sekmesinde büyüme hızını değiştir ve döngünün her turda koşulu nasıl sınadığını izle.", en: "In the comprehension tab, pick a transformation and a condition: the long loop on the left, the one-liner doing the same on the right. In the while tab, change the growth rate and watch the loop test its condition each turn." },
      name: { tr: "aylik_enf", en: "monthly_inf" },
      values: D.MONTHLY,
      takeaway: { tr: "Liste üreteci yeni bir şey yapmaz; bildiğin döngüyü daha kısa yazar. while ise tur sayısı önceden belli olmadığında kullanılır.", en: "A comprehension does nothing new; it writes a familiar loop more briefly. while is for when the number of turns is not known in advance." }
    },
    cells: [
      {
        id: "m0-loops2-c1", kind: "run",
        task: { tr: "Yılda %5 büyüyen bir GSYH kaç yılda ikiye katlanır?", en: "How many years does it take a GDP growing 5% a year to double?" },
        predict: {
          q: { tr: "Döngü bittiğinde <code>yil</code> kaç olur?", en: "What is <code>years</code> when the loop ends?" },
          options: { tr: ["10", "14", "15"], en: ["10", "14", "15"] },
          answer: 2,
          explain: { tr: "1,05¹⁴ ≈ 1,98 (henüz 200'ün altında), 1,05¹⁵ ≈ 2,08. 70 kuralı 14 der; kural yaklaşık bir tahmindir.", en: "1.05¹⁴ ≈ 1.98 (still below 200), 1.05¹⁵ ≈ 2.08. The rule of 70 says 14; the rule is an approximation." }
        },
        code: { tr: "gsyh = 100\nyil = 0\nwhile gsyh < 200:\n    gsyh = gsyh * 1.05\n    yil = yil + 1\nprint(yil, round(gsyh, 1))", en: "gdp = 100\nyears = 0\nwhile gdp < 200:\n    gdp = gdp * 1.05\n    years = years + 1\nprint(years, round(gdp, 1))" }
      },
      {
        id: "m0-loops2-c2", kind: "run",
        task: { tr: "<code>enumerate</code> ve <code>zip</code>'i dene.", en: "Try <code>enumerate</code> and <code>zip</code>." },
        code: { tr: 'aylar = ["Oca", "Şub", "Mar"]\nenf = [3.2, 4.5, 2.9]\n\nfor i, deger in enumerate(enf):\n    print(i, deger)\n\nfor ay, deger in zip(aylar, enf):\n    print(ay, deger)', en: 'months = ["Jan", "Feb", "Mar"]\ninf = [3.2, 4.5, 2.9]\n\nfor i, value in enumerate(inf):\n    print(i, value)\n\nfor month, value in zip(months, inf):\n    print(month, value)' }
      },
      {
        id: "m0-loops2-c3", kind: "fill",
        task: { tr: "Dört dönemin nominal faizini ve enflasyonunu <code>zip</code> ile eşleyerek yaklaşık reel faizleri hesapla.", en: "Pair four periods' nominal rates and inflation with <code>zip</code> to compute approximate real rates." },
        code: { tr: "nominal = [40, 45, 50, 48]\nenflasyon = [44, 47, 45, 38]\nreel = []\nfor n, p in zip(nominal, ___):\n    reel.append(n - p)\nprint(reel)", en: "nominal = [40, 45, 50, 48]\ninflation = [44, 47, 45, 38]\nreal = []\nfor n, p in zip(nominal, ___):\n    real.append(n - p)\nprint(real)" },
        solution: { tr: "nominal = [40, 45, 50, 48]\nenflasyon = [44, 47, 45, 38]\nreel = []\nfor n, p in zip(nominal, enflasyon):\n    reel.append(n - p)\nprint(reel)", en: "nominal = [40, 45, 50, 48]\ninflation = [44, 47, 45, 38]\nreal = []\nfor n, p in zip(nominal, inflation):\n    real.append(n - p)\nprint(real)" },
        hints: [{ tr: "<code>zip</code>'e eşlenecek ikinci listeyi ver.", en: "Give <code>zip</code> the second list to pair with." }],
        checks: [{ py: { tr: "reel == [-4, -2, 5, 10]", en: "real == [-4, -2, 5, 10]" }, msg: { tr: "Sonuç [-4, -2, 5, 10] olmalı.", en: "The result should be [-4, -2, 5, 10]." } }]
      },
      {
        id: "m0-loops2-c4", kind: "fill",
        task: { tr: "İki liste üreteci yaz: 3'ten büyük ayları seç; tüm ayları orana çevir (yüzde → ondalık).", en: "Write two comprehensions: pick the months above 3; convert all months to ratios (percent → decimal)." },
        code: { tr: "aylik_enf = " + MLIST + "\nyuksek = [d for d in aylik_enf if d > ___]\noranlar = [d / 100 for d in ___]\nprint(yuksek)\nprint(oranlar[:3])", en: "monthly_inf = " + MLIST + "\nhigh = [d for d in monthly_inf if d > ___]\nratios = [d / 100 for d in ___]\nprint(high)\nprint(ratios[:3])" },
        solution: { tr: "aylik_enf = " + MLIST + "\nyuksek = [d for d in aylik_enf if d > 3]\noranlar = [d / 100 for d in aylik_enf]\nprint(yuksek)\nprint(oranlar[:3])", en: "monthly_inf = " + MLIST + "\nhigh = [d for d in monthly_inf if d > 3]\nratios = [d / 100 for d in monthly_inf]\nprint(high)\nprint(ratios[:3])" },
        hints: [{ tr: "Birinci boşluk eşik (3), ikinci boşluk gezilecek liste.", en: "The first blank is the threshold (3), the second the list to loop over." }],
        checks: [
          { py: { tr: "yuksek == [d for d in aylik_enf if d > 3]", en: "high == [d for d in monthly_inf if d > 3]" }, msg: { tr: "<code>yuksek</code> 3'ten büyük ayları içermeli.", en: "<code>high</code> should hold the months above 3." } },
          { py: { tr: "oranlar == [d / 100 for d in aylik_enf]", en: "ratios == [d / 100 for d in monthly_inf]" }, msg: { tr: "<code>oranlar</code> 12 ayın hepsini içermeli.", en: "<code>ratios</code> should hold all 12 months." } }
        ]
      },
      {
        id: "m0-loops2-c5", kind: "debug",
        task: { tr: "Endeks 100'den başlıyor ve her ay %3 artıyor. 150'yi kaçıncı ayda geçer? Kod hata vermiyor ama 0 yazdırıyor. Hatayı bul.", en: "An index starts at 100 and rises 3% a month. In which month does it pass 150? The code runs but prints 0. Find the bug." },
        code: { tr: "endeks = 100\nay = 0\nwhile endeks < 150:\n    endeks = endeks * 1.03\nprint(ay)", en: "index = 100\nmonth = 0\nwhile index < 150:\n    index = index * 1.03\nprint(month)" },
        solution: { tr: "endeks = 100\nay = 0\nwhile endeks < 150:\n    endeks = endeks * 1.03\n    ay = ay + 1\nprint(ay)", en: "index = 100\nmonth = 0\nwhile index < 150:\n    index = index * 1.03\n    month = month + 1\nprint(month)" },
        hints: [{ tr: "Döngü dönüyor ama sayaç hiç artmıyor.", en: "The loop runs, but the counter never changes." }],
        checks: [{ py: { tr: "ay > 0 and 100 * 1.03 ** ay >= 150 > 100 * 1.03 ** (ay - 1)", en: "month > 0 and 100 * 1.03 ** month >= 150 > 100 * 1.03 ** (month - 1)" }, msg: { tr: "Ay sayısı, endeksin 150'yi ilk geçtiği ay olmalı.", en: "The month count should be the first month the index passes 150." } }]
      },
      {
        id: "m0-loops2-c6", kind: "challenge",
        task: { tr: "<code>enumerate</code> ve bir liste üreteciyle, enflasyonun 3'ün üstünde olduğu ayların <b>indekslerini</b> <code>ust_aylar</code> listesine topla.", en: "Using <code>enumerate</code> and a comprehension, collect the <b>indexes</b> of the months with inflation above 3 into <code>above_months</code>." },
        code: { tr: "# ust_aylar = [...]\n", en: "# above_months = [...]\n" },
        solution: { tr: "ust_aylar = [i for i, d in enumerate(aylik_enf) if d > 3]\nprint(ust_aylar)", en: "above_months = [i for i, d in enumerate(monthly_inf) if d > 3]\nprint(above_months)" },
        hints: [{ tr: "Kalıp: <code>[i for i, d in enumerate(liste) if koşul]</code>.", en: "Pattern: <code>[i for i, d in enumerate(list) if condition]</code>." }],
        checks: [{ py: { tr: "ust_aylar == [i for i, d in enumerate(aylik_enf) if d > 3]", en: "above_months == [i for i, d in enumerate(monthly_inf) if d > 3]" }, msg: { tr: "Sonuç [0, 1, 4, 6] olmalı.", en: "The result should be [0, 1, 4, 6]." } }]
      }
    ],
    quiz: [
      {
        q: { tr: "Hangi durumda <code>for</code> yerine <code>while</code> daha uygundur?", en: "When is <code>while</code> a better fit than <code>for</code>?" },
        options: { tr: ["Bir listenin her elemanını gezerken", "Tur sayısı önceden belli değilken, bir koşul sağlanana kadar", "Hiçbir zaman"], en: ["When visiting every element of a list", "When the number of turns is unknown, until a condition is met", "Never"] },
        answer: 1,
        explain: { tr: "while, koşul doğru olduğu sürece tekrar eder; ne zaman duracağı koşula bağlıdır.", en: "while repeats as long as the condition is true; when it stops depends on the condition." }
      },
      {
        q: { tr: "<code>[x * 2 for x in [1, 2, 3] if x &gt; 1]</code> neyi verir?", en: "What does <code>[x * 2 for x in [1, 2, 3] if x &gt; 1]</code> give?" },
        options: { tr: ["[2, 4, 6]", "[4, 6]", "[1, 2, 3]"], en: ["[2, 4, 6]", "[4, 6]", "[1, 2, 3]"] },
        answer: 1,
        explain: { tr: "Koşul 1'i eler; kalan 2 ve 3 ikiyle çarpılır.", en: "The condition drops 1; the remaining 2 and 3 are doubled." }
      },
      {
        q: { tr: "<code>zip([1, 2], [\"a\", \"b\"])</code> döngüde hangi çiftleri verir?", en: "Which pairs does <code>zip([1, 2], [\"a\", \"b\"])</code> give in a loop?" },
        options: { tr: ["(1, \"a\") ve (2, \"b\")", "(1, 2) ve (\"a\", \"b\")", "(1, \"b\") ve (2, \"a\")"], en: ["(1, \"a\") and (2, \"b\")", "(1, 2) and (\"a\", \"b\")", "(1, \"b\") and (2, \"a\")"] },
        answer: 0,
        explain: { tr: "zip aynı sıradaki elemanları eşler.", en: "zip pairs elements in the same position." }
      }
    ]
  });

  /* =================================================================== */
  /* Metinler ve sözlükler                                                */
  /* =================================================================== */
  lessons.push({
    id: "m0-text",
    minutes: 25,
    title: { tr: "Metinler ve sözlükler", en: "Text and dictionaries" },
    blurb: { tr: "Metni temizlemek ve bölmek; anahtar–değer çiftleriyle sözlük; bir metindeki kelimeleri saymak.", en: "Cleaning and splitting text; key–value dictionaries; counting the words in a text." },
    terms: [{ tr: "metin", en: "string" }, { tr: "sözlük", en: "dictionary (dict)" }, { tr: "anahtar", en: "key" }, { tr: "değer", en: "value" }, { tr: "metot", en: "method" }],
    concept: {
      tr: `<p>İktisatçıların verisi yalnızca sayı değildir: merkez bankası açıklamaları, haberler, şirket raporları da veridir. Bilgisayarla metin üzerinde çalışmak için önce metnin temel işlemlerini bilmek gerekir.</p>
<ul>
<li><b>Metin metotları:</b> <code>.lower()</code> küçük harfe çevirir, <code>.replace(",", "")</code> bir parçayı başka bir şeyle değiştirir, <code>.split()</code> metni boşluklardan bölerek kelime listesi yapar. <code>"para" in metin</code> bir parçanın metinde geçip geçmediğini söyler.</li>
<li><b>Alt dize mi, kelime mi?</b> <code>"para" in "parasal politika"</code> de <code>True</code> verir, çünkü <code>in</code> metinde harf dizisi arar. Kelimenin tam olarak geçip geçmediğini bilmek için bölünmüş listede ara: <code>"para" in metin.split()</code>.</li>
<li><b>Türkçe harfler:</b> Python'un <code>.lower()</code> metodu Türkçe kuralını bilmez: <code>"IŞIK".lower()</code> sonucu <code>"işik"</code> olur. Türkçe metinde önce <code>.replace("I", "ı").replace("İ", "i")</code>, sonra <code>.lower()</code> uygula.</li>
<li><b>Noktalamayı boşlukla değiştir:</b> <code>"para,politika".replace(",", "")</code> iki kelimeyi birleştirir (<code>"parapolitika"</code>). Kelimeleri ayıran işaretleri <code>" "</code> ile değiştirmek daha güvenlidir.</li>
<li><b>Sözlük (dict)</b>, değerleri sıra numarasıyla değil <b>isimle</b> saklar: <code>{"2023": 42.5, "2024": 50.0}</code>. Soldaki <b>anahtar</b>, sağdaki <b>değer</b>dir. <code>d["2024"]</code> değeri getirir, <code>d["2025"] = 45.0</code> yeni çift ekler.</li>
<li><code>d.get(anahtar, 0)</code>: anahtar yoksa hata vermek yerine 0 döndürür. Saymak için ideal: <code>sayim[k] = sayim.get(k, 0) + 1</code>.</li>
<li><code>for anahtar, deger in d.items():</code> sözlüğün tüm çiftlerini gezer.</li>
</ul>
<div class="box">Bu derste kullanılan “Kurul açıklaması” metni öğretim amacıyla yazılmış <b>kurgusal</b> bir metindir. Metinleri sayılara dönüştürmenin yöntemleri ilerideki bir modülde ele alınır.</div>`,
      en: `<p>Economists' data are not only numbers: central bank statements, news and company reports are data too. To work with text on a computer, you first need its basic operations.</p>
<ul>
<li><b>String methods:</b> <code>.lower()</code> converts to lowercase, <code>.replace(",", "")</code> replaces one piece with another, <code>.split()</code> splits on spaces into a list of words. <code>"policy" in text</code> tells you whether a piece of text appears.</li>
<li><b>Substring or word?</b> <code>"policy" in "policymakers"</code> is also <code>True</code>, because <code>in</code> searches for a sequence of letters. To check for the exact word, search the split list: <code>"policy" in text.split()</code>.</li>
<li><b>Replace punctuation with a space:</b> <code>"money,policy".replace(",", "")</code> merges two words (<code>"moneypolicy"</code>). Replacing word-separating marks with <code>" "</code> is safer.</li>
<li>A <b>dictionary (dict)</b> stores values by <b>name</b> rather than position: <code>{"2023": 42.5, "2024": 50.0}</code>. The left side is the <b>key</b>, the right side the <b>value</b>. <code>d["2024"]</code> fetches a value, <code>d["2025"] = 45.0</code> adds a new pair.</li>
<li><code>d.get(key, 0)</code> returns 0 instead of raising an error when the key is missing. Ideal for counting: <code>counts[w] = counts.get(w, 0) + 1</code>.</li>
<li><code>for key, value in d.items():</code> visits every pair in the dictionary.</li>
</ul>
<div class="box">The “committee statement” in this lesson is a <b>fictional</b> text written for teaching. Methods for turning text into numbers are covered in a later module.</div>`
    },
    playground: {
      type: "wordCounter",
      intro: { tr: "Metni temizleme adımlarını aç kapat ve en sık kelimelerin nasıl değiştiğini izle. Metni değiştirebilir ya da kendi metnini yapıştırabilirsin.", en: "Toggle the cleaning steps and watch how the top words change. You can edit the text or paste your own." },
      text: TEXT,
      stop: STOP,
      takeaway: { tr: "Küçük harf ve noktalama temizliği yapılmazsa “Kurul,” ve “kurul” farklı kelimeler sayılır. Temizlik kararları sonucu değiştirir.", en: "Without lowercasing and removing punctuation, “Committee,” and “committee” count as different words. Cleaning choices change the result." }
    },
    cells: [
      {
        id: "m0-text-c1", kind: "run",
        task: { tr: "Temel metin işlemlerini dene.", en: "Try the basic string operations." },
        code: { tr: 'metin = "Kurul, sıkı para politikası duruşunu sürdürecektir."\nprint(len(metin))\nprint(metin.lower())\nprint(metin.split())\nprint("para" in metin)\nprint("para" in "parasal politika")          # alt dize: True\nprint("para" in "parasal politika".split())  # kelime: False', en: 'text = "The committee will maintain its tight monetary policy stance."\nprint(len(text))\nprint(text.lower())\nprint(text.split())\nprint("policy" in text)\nprint("policy" in "policymakers met")          # substring: True\nprint("policy" in "policymakers met".split())  # word: False' }
      },
      {
        id: "m0-text-c2", kind: "run",
        task: { tr: "Bir sözlük oluştur, değer oku, yeni çift ekle ve tüm çiftleri gez. (Değerler kurgusaldır.)", en: "Create a dictionary, read a value, add a pair and loop over all pairs. (Values are fictional.)" },
        predict: {
          q: { tr: "Son satır sözlükte kaç çift olduğunu yazar. Kaç?", en: "The last line prints how many pairs the dictionary has. How many?" },
          options: { tr: ["2", "3", "6"], en: ["2", "3", "6"] },
          answer: 1,
          explain: { tr: "İki çiftle başladık, <code>politika_faizi[\"2025\"] = 45.0</code> üçüncüyü ekledi. <code>len</code> sözlükte çift sayısını verir.", en: "We started with two pairs; <code>policy_rate[\"2025\"] = 45.0</code> added a third. <code>len</code> gives the number of pairs." }
        },
        code: { tr: 'politika_faizi = {"2023": 42.5, "2024": 50.0}\nprint(politika_faizi["2024"])\npolitika_faizi["2025"] = 45.0\nfor yil, oran in politika_faizi.items():\n    print(yil, oran)\nprint(len(politika_faizi))', en: 'policy_rate = {"2023": 42.5, "2024": 50.0}\nprint(policy_rate["2024"])\npolicy_rate["2025"] = 45.0\nfor year, rate in policy_rate.items():\n    print(year, rate)\nprint(len(policy_rate))' }
      },
      {
        id: "m0-text-c3", kind: "fill",
        task: { tr: "Bir cümledeki kelimeleri sözlükle say. Her kelime görüldüğünde sayısı ne kadar artmalı?", en: "Count the words in a sentence with a dictionary. By how much should a word's count rise each time it appears?" },
        code: { tr: 'cumle = "enflasyon düşüyor ama enflasyon beklentileri yüksek ve enflasyon riski sürüyor"\nsayim = {}\nfor kelime in cumle.split():\n    sayim[kelime] = sayim.get(kelime, 0) + ___\nprint(sayim)\nprint(sayim["enflasyon"])', en: 'sentence = "inflation is falling but inflation expectations are high and inflation risk remains"\ncounts = {}\nfor word in sentence.split():\n    counts[word] = counts.get(word, 0) + ___\nprint(counts)\nprint(counts["inflation"])' },
        solution: { tr: 'cumle = "enflasyon düşüyor ama enflasyon beklentileri yüksek ve enflasyon riski sürüyor"\nsayim = {}\nfor kelime in cumle.split():\n    sayim[kelime] = sayim.get(kelime, 0) + 1\nprint(sayim)\nprint(sayim["enflasyon"])', en: 'sentence = "inflation is falling but inflation expectations are high and inflation risk remains"\ncounts = {}\nfor word in sentence.split():\n    counts[word] = counts.get(word, 0) + 1\nprint(counts)\nprint(counts["inflation"])' },
        hints: [{ tr: "Döngüler dersindeki sayaç kalıbının aynısı.", en: "It is the same counter pattern as in the loops lesson." }],
        checks: [{ py: { tr: "sayim == {k: cumle.split().count(k) for k in set(cumle.split())}", en: "counts == {k: sentence.split().count(k) for k in set(sentence.split())}" }, msg: { tr: "Her kelimenin sayısı metinde kaç kez geçtiğine eşit olmalı.", en: "Each word's count should equal how often it appears." } }]
      },
      {
        id: "m0-text-c4", kind: "fill",
        task: { tr: "1. hücredeki <code>metin</code>'i temizle: küçük harfe çevir, virgül ve noktayı sil. Noktayı neyle değiştirmelisin?", en: "Clean <code>text</code> from cell 1: lowercase it and delete commas and full stops. What should you replace the full stop with?" },
        code: { tr: 'temiz = metin.lower().replace(",", "").replace(".", ___)\nkelimeler = temiz.split()\nprint(temiz)\nprint(len(kelimeler), "kelime")', en: 'clean = text.lower().replace(",", "").replace(".", ___)\nwords = clean.split()\nprint(clean)\nprint(len(words), "words")' },
        solution: { tr: 'temiz = metin.lower().replace(",", "").replace(".", "")\nkelimeler = temiz.split()\nprint(temiz)\nprint(len(kelimeler), "kelime")', en: 'clean = text.lower().replace(",", "").replace(".", "")\nwords = clean.split()\nprint(clean)\nprint(len(words), "words")' },
        hints: [{ tr: "Silmek, boş metinle değiştirmektir: <code>\"\"</code>.", en: "Deleting means replacing with an empty string: <code>\"\"</code>." }],
        checks: [{ py: { tr: '"." not in temiz and "," not in temiz and temiz == temiz.lower()', en: '"." not in clean and "," not in clean and clean == clean.lower()' }, msg: { tr: "Temiz metinde nokta, virgül ya da büyük harf kalmamalı.", en: "The clean text should have no full stops, commas or capitals." } }],
        after: { tr: "Metotlar zincirlenebilir: her <code>.</code> bir öncekinin sonucuna uygulanır.", en: "Methods can be chained: each <code>.</code> applies to the result of the previous one." }
      },
      {
        id: "m0-text-c5", kind: "debug",
        task: { tr: "Sütün fiyatını okumak istiyoruz ama hata alıyoruz. Neden?", en: "We want the price of milk but get an error. Why?" },
        code: { tr: 'fiyatlar = {"ekmek": 15, "süt": 35, "peynir": 220}\nprint(fiyatlar["Süt"])', en: 'prices = {"bread": 15, "milk": 35, "cheese": 220}\nprint(prices["Milk"])' },
        solution: { tr: 'fiyatlar = {"ekmek": 15, "süt": 35, "peynir": 220}\nprint(fiyatlar["süt"])', en: 'prices = {"bread": 15, "milk": 35, "cheese": 220}\nprint(prices["milk"])' },
        hints: [{ tr: "<b>KeyError</b>: sözlükte bu anahtar yok. Büyük/küçük harf önemlidir.", en: "<b>KeyError</b>: the dictionary has no such key. Case matters." }],
        checks: [{ py: '_out.strip() == "35"', msg: { tr: "Çıktı 35 olmalı.", en: "The output should be 35." } }]
      },
      {
        id: "m0-text-c6", kind: "challenge",
        task: { tr: "Kurgusal ülkelerin enflasyon oranları bir sözlükte. Enflasyonu 10'dan yüksek olan ülkelerin adlarını <b>alfabetik sırayla</b> <code>yuksek_ulkeler</code> listesine topla. (<code>sorted()</code> bir listeyi sıralar.)", en: "Fictional countries' inflation rates are in a dictionary. Collect the names of countries with inflation above 10 into <code>high_countries</code>, <b>in alphabetical order</b>. (<code>sorted()</code> sorts a list.)" },
        code: { tr: 'enflasyonlar = {"Alfa": 4.2, "Beta": 12.5, "Gama": 31.0, "Delta": 8.9, "Epsilon": 15.3}\n# yuksek_ulkeler = ...\n', en: 'inflation = {"Alfa": 4.2, "Beta": 12.5, "Gama": 31.0, "Delta": 8.9, "Epsilon": 15.3}\n# high_countries = ...\n' },
        solution: { tr: 'enflasyonlar = {"Alfa": 4.2, "Beta": 12.5, "Gama": 31.0, "Delta": 8.9, "Epsilon": 15.3}\nyuksek_ulkeler = sorted([ulke for ulke, oran in enflasyonlar.items() if oran > 10])\nprint(yuksek_ulkeler)', en: 'inflation = {"Alfa": 4.2, "Beta": 12.5, "Gama": 31.0, "Delta": 8.9, "Epsilon": 15.3}\nhigh_countries = sorted([country for country, rate in inflation.items() if rate > 10])\nprint(high_countries)' },
        hints: [{ tr: "<code>.items()</code> ile çiftleri gez, koşulu sağlayan anahtarları topla, sonra <code>sorted</code>.", en: "Loop over pairs with <code>.items()</code>, collect the keys that meet the condition, then <code>sorted</code>." }],
        checks: [{ py: { tr: 'yuksek_ulkeler == ["Beta", "Epsilon", "Gama"]', en: 'high_countries == ["Beta", "Epsilon", "Gama"]' }, msg: { tr: 'Sonuç ["Beta", "Epsilon", "Gama"] olmalı.', en: 'The result should be ["Beta", "Epsilon", "Gama"].' } }]
      }
    ],
    quiz: [
      {
        q: { tr: '<code>"Faiz, Enflasyon".lower().split(", ")</code> ne verir?', en: 'What does <code>"Rate, Inflation".lower().split(", ")</code> give?' },
        options: { tr: ['["faiz", "enflasyon"]', '["Faiz", "Enflasyon"]', '"faiz enflasyon"'], en: ['["rate", "inflation"]', '["Rate", "Inflation"]', '"rate inflation"'] },
        answer: 0,
        explain: { tr: "Önce küçük harfe çevrilir, sonra “, ” işaretinden bölünür.", en: "It is lowercased first, then split at “, ”." }
      },
      {
        q: { tr: "<code>d = {\"a\": 1}</code> için <code>d.get(\"b\", 0)</code> ne döndürür?", en: "For <code>d = {\"a\": 1}</code>, what does <code>d.get(\"b\", 0)</code> return?" },
        options: { tr: ["KeyError", "0", "1"], en: ["KeyError", "0", "1"] },
        answer: 1,
        explain: { tr: "Anahtar yoksa <code>get</code> verilen varsayılan değeri döndürür.", en: "When the key is missing, <code>get</code> returns the default you give it." }
      },
      {
        q: { tr: "Sözlükte değerlere neyle ulaşılır?", en: "How do you reach values in a dictionary?" },
        options: { tr: ["Sıra numarasıyla (0, 1, 2…)", "Anahtarla", "Yalnızca döngüyle"], en: ["By position (0, 1, 2…)", "By key", "Only with a loop"] },
        answer: 1,
        explain: { tr: "Sözlükte değerler anahtarlarına göre saklanır ve getirilir.", en: "A dictionary stores and fetches values by their keys." }
      }
    ]
  });

  /* =================================================================== */
  /* Simülasyonla düşünmek                                                */
  /* =================================================================== */
  const SIM_SETUP = {
    tr: "import numpy as np\nimport matplotlib.pyplot as plt\n\n",
    en: "import numpy as np\nimport matplotlib.pyplot as plt\n\n"
  };
  lessons.push({
    id: "m0-sim",
    minutes: 30,
    packages: ["numpy", "matplotlib"],
    title: { tr: "Simülasyonla düşünmek", en: "Thinking with simulation" },
    blurb: { tr: "Rastgele yürüyüşle kur yolları, Monte Carlo ile olası sonuçların dağılımı ve örneklem ortalamasının değişkenliği.", en: "Exchange-rate paths as a random walk, the distribution of outcomes by Monte Carlo, and the variability of a sample mean." },
    terms: [{ tr: "simülasyon", en: "simulation" }, { tr: "rastgele yürüyüş", en: "random walk" }, { tr: "Monte Carlo", en: "Monte Carlo" }, { tr: "yüzdelik dilim", en: "percentile" }, { tr: "dağılım", en: "distribution" }],
    concept: {
      tr: `<p>Geleceği bilemeyiz, ama <b>olası gelecekleri</b> üretebiliriz. Simülasyonda bir belirsizlik kaynağını (örneğin günlük kur getirisi) rastgele sayılarla temsil eder, aynı süreci binlerce kez çalıştırır ve sonuçların <b>dağılımına</b> bakarız. Bu yönteme <b>Monte Carlo</b> denir.</p>
<ul>
<li><b>Rastgele yürüyüş:</b> bugünkü kur = dünkü kur × (1 + günlük getiri). Getiri her gün rastgele çekilir: <code>rng.normal(ortalama, std, gün_sayısı)</code>. Birikimli çarpım <code>np.cumprod</code> yolu oluşturur.</li>
<li><b>İki boyutlu dizi:</b> <code>size=(1000, 250)</code> 1000 satır × 250 sütunluk bir tablo üretir: her satır bir olası yol, her sütun bir gün. <code>yollar[:, -1]</code> “tüm satırlar, son sütun” demektir, yani her yolun son günü.</li>
<li><b>Yüzdelik dilim:</b> <code>np.percentile(x, 5)</code>, değerlerin %5'inin altında kaldığı noktadır. %5 ve %95 dilimleri olası sonuçların “orta %90”ını verir.</li>
<li><b>Örneklem ortalaması da rastgeledir.</b> Aynı ana kütleden farklı örneklemler çekersen farklı ortalamalar bulursun. Örneklem büyüdükçe bu ortalamaların dağılımı daralır; standart sapması yaklaşık σ / √n'dir.</li>
</ul>
<div class="box">Bu derste getirilerin bağımsız ve normal dağıldığını varsayıyoruz. Gerçek finansal getiriler daha kalın kuyruklu olabilir ve oynaklık zamanla değişebilir. Simülasyonun sonucu, varsayımları kadar iyidir.</div>`,
      en: `<p>We cannot know the future, but we can generate <b>possible futures</b>. In a simulation we represent a source of uncertainty (say the daily exchange-rate return) with random numbers, run the same process thousands of times and look at the <b>distribution</b> of outcomes. This is called <b>Monte Carlo</b>.</p>
<ul>
<li><b>Random walk:</b> today's rate = yesterday's rate × (1 + daily return). The return is drawn at random each day: <code>rng.normal(mean, std, n_days)</code>. The cumulative product <code>np.cumprod</code> builds the path.</li>
<li><b>Two-dimensional array:</b> <code>size=(1000, 250)</code> makes a table of 1000 rows × 250 columns: each row a possible path, each column a day. <code>paths[:, -1]</code> means “all rows, last column”, i.e. each path's last day.</li>
<li><b>Percentile:</b> <code>np.percentile(x, 5)</code> is the point below which 5% of the values lie. The 5th and 95th percentiles give the “middle 90%” of outcomes.</li>
<li><b>A sample mean is random too.</b> Draw different samples from the same population and you get different means. As the sample grows, the distribution of these means narrows; its standard deviation is about σ / √n.</li>
</ul>
<div class="box">This lesson assumes returns are independent and normally distributed. Real financial returns can have fatter tails and changing volatility. A simulation is only as good as its assumptions.</div>`
    },
    playground: {
      type: "randomWalk",
      intro: { tr: "Ortalama getiriyi, oynaklığı ve yol sayısını değiştir. Soldaki yollar tek tek olası gelecekler, sağdaki histogram 250. gündeki kurun dağılımı. Oynaklığı artırınca dağılımın nasıl genişlediğine bak.", en: "Change the mean return, volatility and number of paths. The paths on the left are individual possible futures; the histogram on the right is the distribution of the rate on day 250. See how the distribution widens with volatility." },
      takeaway: { tr: "Tek bir yol bir hikâyedir; binlerce yol bir dağılımdır. Risk, ortalamadan çok dağılımın genişliğinde ve kuyruklarındadır.", en: "One path is a story; thousands of paths are a distribution. Risk lies in the width and tails of the distribution more than in its mean." }
    },
    cells: [
      {
        id: "m0-sim-c1", kind: "run",
        task: { tr: "30'dan başlayan bir kur için tek bir olası 250 günlük yol simüle et ve çiz.", en: "Simulate and plot one possible 250-day path for an exchange rate starting at 30." },
        code: { tr: SIM_SETUP.tr + 'rng = np.random.default_rng(7)\ngetiri = rng.normal(0.05, 1.0, 250) / 100     # günlük getiri (oran)\nkur = np.concatenate([[30], 30 * np.cumprod(1 + getiri)])   # gün 0 = başlangıç (30)\n\nplt.plot(kur)\nplt.title("Simüle kur: tek bir olası yol")\nplt.xlabel("Gün (0 = başlangıç)")\nplt.show()\nprint("250. gün:", round(kur[-1], 2))', en: SIM_SETUP.en + 'rng = np.random.default_rng(7)\nret = rng.normal(0.05, 1.0, 250) / 100      # daily return (ratio)\nrate = np.concatenate([[30], 30 * np.cumprod(1 + ret)])   # day 0 = start (30)\n\nplt.plot(rate)\nplt.title("Simulated exchange rate: one possible path")\nplt.xlabel("Day (0 = start)")\nplt.show()\nprint("Day 250:", round(rate[-1], 2))' }
      },
      {
        id: "m0-sim-c2", kind: "fill",
        task: { tr: "Şimdi 1000 olası yol üret. Her yolun son gününü seçmek için sütun indeksini doldur.", en: "Now generate 1000 possible paths. Fill in the column index to pick each path's last day." },
        code: { tr: "rng_yol = np.random.default_rng(11)   # bu hücrenin kendi sabit tohumlu üreteci\nyollar = 30 * np.cumprod(1 + rng_yol.normal(0.05, 1.0, size=(1000, 250)) / 100, axis=1)\nson = yollar[:, ___]      # her yolun son günü\nprint(yollar.shape)\nprint(son.shape, round(son.mean(), 2))", en: "rng_paths = np.random.default_rng(11)   # this cell's own fixed-seed generator\npaths = 30 * np.cumprod(1 + rng_paths.normal(0.05, 1.0, size=(1000, 250)) / 100, axis=1)\nfinal = paths[:, ___]      # each path's last day\nprint(paths.shape)\nprint(final.shape, round(final.mean(), 2))" },
        solution: { tr: "rng_yol = np.random.default_rng(11)   # bu hücrenin kendi sabit tohumlu üreteci\nyollar = 30 * np.cumprod(1 + rng_yol.normal(0.05, 1.0, size=(1000, 250)) / 100, axis=1)\nson = yollar[:, -1]      # her yolun son günü\nprint(yollar.shape)\nprint(son.shape, round(son.mean(), 2))", en: "rng_paths = np.random.default_rng(11)   # this cell's own fixed-seed generator\npaths = 30 * np.cumprod(1 + rng_paths.normal(0.05, 1.0, size=(1000, 250)) / 100, axis=1)\nfinal = paths[:, -1]      # each path's last day\nprint(paths.shape)\nprint(final.shape, round(final.mean(), 2))" },
        hints: [{ tr: "Listelerdeki gibi: son eleman −1.", en: "Just like lists: the last element is −1." }],
        checks: [{ py: { tr: "son.shape == (1000,) and (son == yollar[:, -1]).all()", en: "final.shape == (1000,) and (final == paths[:, -1]).all()" }, msg: { tr: "<code>son</code>, her yolun son değerini içeren 1000 elemanlı bir dizi olmalı.", en: "<code>final</code> should be a 1000-element array of each path's last value." } }],
        after: { tr: "<code>axis=1</code>, birikimli çarpımın her satırda soldan sağa (günler boyunca) yapılmasını sağlar. Bu hücre kendi üretecini (<code>rng_yol</code>) kullanıyor; böylece sonucu, önceki hücreleri kaç kez çalıştırdığına bağlı olmadan hep aynı çıkar.", en: "<code>axis=1</code> makes the cumulative product run along each row (across the days). This cell uses its own generator (<code>rng_paths</code>), so its result is always the same, however many times you ran the earlier cells." }
      },
      {
        id: "m0-sim-c3", kind: "fill",
        task: { tr: "Olası sonuçların orta %90'ını bul: %5 ve %95 yüzdelik dilimleri.", en: "Find the middle 90% of outcomes: the 5th and 95th percentiles." },
        code: { tr: 'alt, ust = np.percentile(son, [5, ___])\nprint(f"Bu varsayımlar altında simüle edilen son değerlerin orta %90\'ı: {alt:.2f} ile {ust:.2f} arası")', en: 'low, high = np.percentile(final, [5, ___])\nprint(f"Under these assumptions, the middle 90% of simulated final values: {low:.2f} to {high:.2f}")' },
        solution: { tr: 'alt, ust = np.percentile(son, [5, 95])\nprint(f"Bu varsayımlar altında simüle edilen son değerlerin orta %90\'ı: {alt:.2f} ile {ust:.2f} arası")', en: 'low, high = np.percentile(final, [5, 95])\nprint(f"Under these assumptions, the middle 90% of simulated final values: {low:.2f} to {high:.2f}")' },
        hints: [{ tr: "Orta %90 için alttan %5, üstten %5 kesilir.", en: "For the middle 90%, cut 5% from the bottom and 5% from the top." }],
        checks: [{ py: { tr: "abs(ust - np.percentile(son, 95)) < 1e-9 and abs(alt - np.percentile(son, 5)) < 1e-9", en: "abs(high - np.percentile(final, 95)) < 1e-9 and abs(low - np.percentile(final, 5)) < 1e-9" }, msg: { tr: "Üst sınır %95 yüzdelik dilim olmalı.", en: "The upper bound should be the 95th percentile." } }],
        after: { tr: "Bu aralık bir tahmin değil, modelin ürettiği yolların özetidir: yalnızca varsayılan ortalama ve oynaklık doğruysa “%90 olasılıkla” diye okunabilir. Gerçek dünyada bilinmeyen riskler bu aralığı genişletebilir.", en: "This range is not a forecast but a summary of the paths the model generated: it can be read as “with 90% probability” only if the assumed mean and volatility are right. Unknown risks in the real world can widen the range." }
      },
      {
        id: "m0-sim-c4", kind: "run",
        task: { tr: "Son değerlerin histogramını çiz ve aralığı işaretle.", en: "Plot a histogram of the final values and mark the range." },
        code: { tr: 'plt.hist(son, bins=40)\nplt.axvline(alt, linestyle="--")\nplt.axvline(ust, linestyle="--")\nplt.title("250. gündeki kurun dağılımı (1000 simülasyon)")\nplt.xlabel("Kur")\nplt.show()', en: 'plt.hist(final, bins=40)\nplt.axvline(low, linestyle="--")\nplt.axvline(high, linestyle="--")\nplt.title("Distribution of the day-250 rate (1000 simulations)")\nplt.xlabel("Rate")\nplt.show()' }
      },
      {
        id: "m0-sim-c5", kind: "run",
        task: { tr: "Örneklem ortalamasının ne kadar oynak olduğunu simüle et: her n için 2000 örneklem çek, ortalamalarının standart sapmasına bak.", en: "Simulate how variable a sample mean is: for each n draw 2000 samples and look at the standard deviation of their means." },
        predict: {
          q: { tr: "n büyüdükçe ortalamaların standart sapması ne olur?", en: "As n grows, what happens to the standard deviation of the means?" },
          options: { tr: ["Büyür", "Küçülür", "Değişmez"], en: ["It grows", "It shrinks", "It stays the same"] },
          answer: 1,
          explain: { tr: "σ / √n kuralı: σ = 2 iken n = 10 için ≈ 0,63; n = 100 için ≈ 0,20; n = 1000 için ≈ 0,06. Örneklem 100 kat büyüyünce belirsizlik 10 kat azalır.", en: "The σ / √n rule: with σ = 2, about 0.63 for n = 10, 0.20 for n = 100 and 0.06 for n = 1000. A sample 100 times larger cuts uncertainty tenfold." }
        },
        code: { tr: 'rng = np.random.default_rng(1)\nfor n in [10, 100, 1000]:\n    ortalamalar = [rng.normal(0.5, 2.0, n).mean() for _ in range(2000)]\n    print(n, round(np.std(ortalamalar), 3), " teorik:", round(2.0 / np.sqrt(n), 3))', en: 'rng = np.random.default_rng(1)\nfor n in [10, 100, 1000]:\n    means = [rng.normal(0.5, 2.0, n).mean() for _ in range(2000)]\n    print(n, round(np.std(means), 3), " theory:", round(2.0 / np.sqrt(n), 3))' },
        after: { tr: "<code>_</code>, değeri kullanılmayan döngü değişkeni için yaygın bir isimdir. Bu sonuç, ilerideki modüllerde modelin başarısını ölçerken karşına çıkacak.", en: "<code>_</code> is a common name for a loop variable whose value is not used. You will meet this result again when measuring model performance later in the course." }
      },
      {
        id: "m0-sim-c6", kind: "debug",
        task: { tr: "Bu simülasyon saçma sonuç veriyor: milyonlarca liralık ya da negatif kurlar. Hata mesajı yok. Neden?", en: "This simulation gives absurd results: rates in the millions or below zero. No error message. Why?" },
        code: { tr: "rng = np.random.default_rng(3)\ngetiri2 = rng.normal(0.05, 1.0, 250)          # yüzde cinsinden\nkur2 = 30 * np.cumprod(1 + getiri2)\nprint(round(kur2.min(), 2), round(kur2.max(), 2))", en: "rng = np.random.default_rng(3)\nret2 = rng.normal(0.05, 1.0, 250)          # in percent\nrate2 = 30 * np.cumprod(1 + ret2)\nprint(round(rate2.min(), 2), round(rate2.max(), 2))" },
        solution: { tr: "rng = np.random.default_rng(3)\ngetiri2 = rng.normal(0.05, 1.0, 250) / 100    # orana çevrildi\nkur2 = 30 * np.cumprod(1 + getiri2)\nprint(round(kur2.min(), 2), round(kur2.max(), 2))", en: "rng = np.random.default_rng(3)\nret2 = rng.normal(0.05, 1.0, 250) / 100    # converted to a ratio\nrate2 = 30 * np.cumprod(1 + ret2)\nprint(round(rate2.min(), 2), round(rate2.max(), 2))" },
        hints: [{ tr: "Getiri yüzde olarak üretildi (1.0 = %1), ama formül oran bekliyor (0.01 = %1).", en: "The return was generated in percent (1.0 = 1%), but the formula expects a ratio (0.01 = 1%)." }],
        checks: [{ py: { tr: "kur2.min() > 0 and kur2.max() < 100", en: "rate2.min() > 0 and rate2.max() < 100" }, msg: { tr: "Kur hâlâ makul bir aralıkta değil.", en: "The rate is still not in a sensible range." } }],
        after: { tr: "Birim hataları (yüzde mi oran mı?) iktisatta en yaygın sessiz hatalardandır.", en: "Unit mistakes (percent or ratio?) are among the most common silent bugs in economics." }
      },
      {
        id: "m0-sim-c7", kind: "challenge",
        task: { tr: "Bir yatırımcının 250 gün sonunda %10'dan fazla kaybetme olasılığını simülasyonla tahmin et: <code>yollar</code>'daki son değerin 27'nin altında olduğu yolların oranını <code>kayip_olasiligi</code>'na ata.", en: "Estimate the probability that an investor loses more than 10% after 250 days: store the share of paths in <code>paths</code> whose final value is below 27 in <code>loss_prob</code>." },
        code: { tr: "# kayip_olasiligi = ...\n", en: "# loss_prob = ...\n" },
        solution: { tr: 'kayip_olasiligi = (yollar[:, -1] < 27).mean()\nprint(f"Kayıp olasılığı: {kayip_olasiligi:.1%}")', en: 'loss_prob = (paths[:, -1] < 27).mean()\nprint(f"Loss probability: {loss_prob:.1%}")' },
        hints: [{ tr: "True'ların ortalaması, True oranıdır (NumPy dersindeki negatif gün oranını hatırla).", en: "The mean of Trues is the share of Trues (remember the share of negative days in the NumPy lesson)." }],
        checks: [{ py: { tr: "abs(kayip_olasiligi - (yollar[:, -1] < 27).mean()) < 1e-12", en: "abs(loss_prob - (paths[:, -1] < 27).mean()) < 1e-12" }, msg: { tr: "Oran, son değeri 27'nin altında kalan yolların payı olmalı.", en: "The share should be the proportion of paths ending below 27." } }]
      }
    ],
    quiz: [
      {
        q: { tr: "<code>yollar.shape</code> (1000, 250) ise <code>yollar[:, 0]</code> neyi verir?", en: "If <code>paths.shape</code> is (1000, 250), what does <code>paths[:, 0]</code> give?" },
        options: { tr: ["İlk yolun 250 günü", "1000 yolun ilk günü", "Tek bir sayı"], en: ["The first path's 250 days", "The first day of all 1000 paths", "A single number"] },
        answer: 1,
        explain: { tr: "“Tüm satırlar, 0. sütun”: her yolun ilk günü.", en: "“All rows, column 0”: each path's first day." }
      },
      {
        q: { tr: "Örneklem 4 kat büyürse örneklem ortalamasının standart sapması yaklaşık ne olur?", en: "If the sample becomes 4 times larger, what happens to the standard deviation of the sample mean?" },
        options: { tr: ["4'te birine iner", "Yarıya iner", "Değişmez"], en: ["Falls to a quarter", "Halves", "Stays the same"] },
        answer: 1,
        explain: { tr: "σ / √n: √4 = 2, yani yarıya iner.", en: "σ / √n: √4 = 2, so it halves." }
      },
      {
        q: { tr: "Bir simülasyonun sonucunu en çok ne sınırlar?", en: "What limits a simulation's result the most?" },
        options: { tr: ["Bilgisayarın hızı", "Varsayımlarının gerçeğe ne kadar uyduğu", "Grafiğin rengi"], en: ["The computer's speed", "How well its assumptions match reality", "The colour of the chart"] },
        answer: 1,
        explain: { tr: "Simülasyon varsayımlarının sonuçlarını gösterir; varsayım yanlışsa sonuç da yanıltır.", en: "A simulation shows the consequences of its assumptions; wrong assumptions give misleading results." }
      }
    ]
  });

  /* =================================================================== */
  /* pandas II                                                            */
  /* =================================================================== */
  lessons.push({
    id: "m0-pandas2",
    minutes: 30,
    packages: ["numpy", "pandas"],
    title: { tr: "pandas II: gerçek veri gibi çalışmak", en: "pandas II: working as with real data" },
    blurb: { tr: "CSV okumak, panel veride gruplayıp özetlemek, eksik değeri görmek, tabloları birleştirmek ve tarihlerle çalışmak.", en: "Reading CSV, grouping and summarising panel data, spotting missing values, merging tables and working with dates." },
    terms: [{ tr: "panel veri", en: "panel data" }, { tr: "gruplama", en: "groupby" }, { tr: "birleştirme", en: "merge" }, { tr: "eksik değer", en: "missing value (NaN)" }, { tr: "CSV", en: "CSV" }],
    concept: {
      tr: `<p>Gerçek veriler genellikle bir dosyadan gelir ve çoğu zaman <b>panel</b> yapısındadır: aynı birimler (iller, ülkeler, firmalar) birden çok dönem boyunca gözlenir. Bu derste gerçek bir analizde en sık kullanılan pandas araçlarını öğreniyorsun.</p>
<ul>
<li><b>CSV okumak:</b> <code>pd.read_csv("dosya.csv")</code>. CSV, virgülle ayrılmış düz metin tablosudur. Burada dosya yerine metni <code>io.StringIO</code> ile okuyoruz; sonuç aynıdır.</li>
<li><b>Gruplamak:</b> <code>panel.groupby("bolge")["issizlik"].mean()</code> her bölge için ayrı ortalama verir. “Böl → uygula → birleştir” mantığıdır.</li>
<li><b>Eksik değer:</b> CSV'deki boş hücre <code>NaN</code> olur. <code>panel.isna().sum()</code> her sütundaki eksik sayısını gösterir. Eksik değerlerle <i>ne yapılacağı</i> ilerideki bir modülün konusudur; burada yalnızca onları görmeyi öğreniyoruz.</li>
<li><b>Birleştirmek:</b> <code>panel.merge(bolgeler, on="bolge")</code> ortak bir sütun üzerinden iki tabloyu yan yana getirir (Excel'deki DÜŞEYARA'nın karşılığı). İki tuzağa dikkat: varsayılan birleştirme yalnızca iki tabloda da bulunan anahtarları tutar, yani bölge tablosunda eksik bir bölge varsa o bölgenin gözlemleri <b>sessizce kaybolur</b>; bölge tablosunda bir anahtar iki kez geçerse gözlemler <b>çoğalır</b>. Bu yüzden bölge tablosunda her bölge bir kez geçmeli. <code>validate="many_to_one"</code> bunu denetler, birleştirmeden önce ve sonra satır sayısını karşılaştırmak da hatayı yakalar.</li>
<li><b>Tarihler:</b> <code>tablo["tarih"].dt.year</code> bir tarih sütunundan yılı çıkarır; sonra yıla göre gruplayabilirsin.</li>
</ul>
<div class="box">Bölgeler ve tüm değerler <b>kurgusaldır</b>.</div>`,
      en: `<p>Real data usually come from a file and are often a <b>panel</b>: the same units (regions, countries, firms) observed over several periods. In this lesson you learn the pandas tools used most often in a real analysis.</p>
<ul>
<li><b>Reading CSV:</b> <code>pd.read_csv("file.csv")</code>. A CSV is a plain-text table with comma-separated values. Here we read text through <code>io.StringIO</code> instead of a file; the result is the same.</li>
<li><b>Grouping:</b> <code>panel.groupby("region")["unemployment"].mean()</code> gives a separate mean for each region. The logic is “split → apply → combine”.</li>
<li><b>Missing values:</b> an empty cell in a CSV becomes <code>NaN</code>. <code>panel.isna().sum()</code> counts missing values per column. <i>What to do</i> with missing values is the topic of a later module; here you only learn to spot them.</li>
<li><b>Merging:</b> <code>panel.merge(regions, on="region")</code> brings two tables side by side through a shared column (the equivalent of a spreadsheet VLOOKUP). Watch for two traps: the default merge keeps only keys found in both tables, so a region missing from the region table makes its observations <b>silently disappear</b>; a key that appears twice in the region table <b>duplicates</b> observations. So each region must appear once in the region table. <code>validate="many_to_one"</code> enforces this, and comparing the row count before and after the merge also catches the problem.</li>
<li><b>Dates:</b> <code>table["date"].dt.year</code> extracts the year from a date column; then you can group by year.</li>
</ul>
<div class="box">The regions and all values are <b>fictional</b>.</div>`
    },
    playground: {
      type: "groupBy",
      intro: { tr: "Neye göre gruplayacağını, hangi sütunu ve hangi özeti istediğini seç. Aynı panel bölgeye göre gruplanınca bölgeler arası farkı, yıla göre gruplanınca zaman içindeki değişimi gösterir.", en: "Choose what to group by, which column and which summary. Grouped by region the panel shows differences across regions; grouped by year it shows change over time." },
      data: PANEL,
      groupCols: [0, 1],
      valueCols: [2, 3],
      takeaway: { tr: "groupby, “her grup için ayrı ayrı hesapla” demektir. count() eksik değerleri saymaz: Doğu'nun gelir sayısı 4 çıkar.", en: "groupby means “compute separately for each group”. count() skips missing values: East's income count is 4." }
    },
    cells: [
      {
        id: "m0-pandas2-c1", kind: "run",
        task: { tr: "Kurgusal bölgesel paneli CSV metninden oku ve ilk satırlara bak.", en: "Read the fictional regional panel from CSV text and look at the first rows." },
        code: { tr: P2_SETUP.tr + "print(panel.shape)\npanel.head(6)", en: P2_SETUP.en + "print(panel.shape)\npanel.head(6)" }
      },
      {
        id: "m0-pandas2-c2", kind: "fill",
        task: { tr: "Her bölgenin ortalama işsizliğini hesapla. Hangi özet fonksiyonu gerekiyor?", en: "Compute each region's mean unemployment. Which summary function do you need?" },
        code: { tr: 'bolge_ort = panel.groupby("bolge")["issizlik"].___()\nbolge_ort.round(2)', en: 'region_avg = panel.groupby("region")["unemployment"].___()\nregion_avg.round(2)' },
        solution: { tr: 'bolge_ort = panel.groupby("bolge")["issizlik"].mean()\nbolge_ort.round(2)', en: 'region_avg = panel.groupby("region")["unemployment"].mean()\nregion_avg.round(2)' },
        hints: [{ tr: "Ortalama: <code>mean</code>.", en: "Average: <code>mean</code>." }],
        checks: [{ py: { tr: 'bolge_ort.equals(panel.groupby("bolge")["issizlik"].mean())', en: 'region_avg.equals(panel.groupby("region")["unemployment"].mean())' }, msg: { tr: "Sonuç bölge başına ortalama işsizlik olmalı.", en: "The result should be mean unemployment per region." } }]
      },
      {
        id: "m0-pandas2-c3", kind: "run",
        task: { tr: "Eksik değerleri say.", en: "Count the missing values." },
        predict: {
          q: { tr: "<code>gelir</code> sütununda kaç eksik değer var?", en: "How many missing values does the <code>income</code> column have?" },
          options: { tr: ["0", "1", "25"], en: ["0", "1", "25"] },
          answer: 1,
          explain: { tr: "CSV'de Doğu 2022 satırının gelir hücresi boş bırakıldı; pandas onu NaN yaptı. Bunu fark etmek, analizin ilk adımlarındandır.", en: "The income cell for East 2022 was left empty in the CSV; pandas turned it into NaN. Noticing this is one of the first steps of any analysis." }
        },
        code: { tr: 'print(panel.isna().sum())\npanel[panel["gelir"].isna()]', en: 'print(panel.isna().sum())\npanel[panel["income"].isna()]' }
      },
      {
        id: "m0-pandas2-c4", kind: "fill",
        task: { tr: "Bölgelerin nüfus ve kıyı bilgisini içeren ikinci tabloyu panelle birleştir. Ortak sütunun adını yaz.", en: "Merge the second table with population and coastal information into the panel. Write the name of the shared column." },
        code: { tr: REG_TABLE.tr + 'birlesik = panel.merge(bolgeler, on="___", validate="many_to_one")   # bölge tablosunda her bölge bir kez\nprint(len(panel), "→", len(birlesik), "satır")   # birleştirme öncesi → sonrası\nprint(birlesik.shape)\nbirlesik.head()', en: REG_TABLE.en + 'merged = panel.merge(regions, on="___", validate="many_to_one")   # each region once in the region table\nprint(len(panel), "→", len(merged), "rows")   # before → after the merge\nprint(merged.shape)\nmerged.head()' },
        solution: { tr: REG_TABLE.tr + 'birlesik = panel.merge(bolgeler, on="bolge", validate="many_to_one")   # bölge tablosunda her bölge bir kez\nprint(len(panel), "→", len(birlesik), "satır")   # birleştirme öncesi → sonrası\nprint(birlesik.shape)\nbirlesik.head()', en: REG_TABLE.en + 'merged = panel.merge(regions, on="region", validate="many_to_one")   # each region once in the region table\nprint(len(panel), "→", len(merged), "rows")   # before → after the merge\nprint(merged.shape)\nmerged.head()' },
        hints: [{ tr: "İki tabloda da bulunan sütun hangisi?", en: "Which column appears in both tables?" }],
        checks: [{ py: { tr: '"nufus" in birlesik.columns and len(birlesik) == len(panel)', en: '"population" in merged.columns and len(merged) == len(panel)' }, msg: { tr: "Birleşik tablo 25 satır olmalı ve nüfus sütununu içermeli.", en: "The merged table should have 25 rows and a population column." } }],
        after: { tr: "Satır sayısı 25 → 25: hiçbir gözlem kaybolmadı ya da çoğalmadı. Satır sayısı azalsaydı bölge tablosunda eksik anahtar, artsaydı tekrar eden anahtar olurdu. <code>validate=\"many_to_one\"</code> ikinci durumda doğrudan hata verir.", en: "Rows 25 → 25: no observation was lost or duplicated. Fewer rows would mean a missing key in the region table, more rows a duplicated key. <code>validate=\"many_to_one\"</code> raises an error directly in the second case." }
      },
      {
        id: "m0-pandas2-c5", kind: "fill",
        task: { tr: "Aylık bir kur serisinden yıllık ortalamaları hesapla. Tarih sütunundan yılı çıkaran özelliği yaz.", en: "Compute annual averages from a monthly exchange-rate series. Write the attribute that extracts the year from the date column." },
        code: { tr: 'aylik = pd.DataFrame({\n    "tarih": pd.date_range("2022-01-01", periods=36, freq="MS"),\n    "kur": [round(18 * 1.025 ** i, 2) for i in range(36)]\n})\naylik["yil"] = aylik["tarih"].dt.___\nyillik_ort = aylik.groupby("yil")["kur"].mean()\nyillik_ort.round(2)', en: 'monthly = pd.DataFrame({\n    "date": pd.date_range("2022-01-01", periods=36, freq="MS"),\n    "rate": [round(18 * 1.025 ** i, 2) for i in range(36)]\n})\nmonthly["year"] = monthly["date"].dt.___\nannual_avg = monthly.groupby("year")["rate"].mean()\nannual_avg.round(2)' },
        solution: { tr: 'aylik = pd.DataFrame({\n    "tarih": pd.date_range("2022-01-01", periods=36, freq="MS"),\n    "kur": [round(18 * 1.025 ** i, 2) for i in range(36)]\n})\naylik["yil"] = aylik["tarih"].dt.year\nyillik_ort = aylik.groupby("yil")["kur"].mean()\nyillik_ort.round(2)', en: 'monthly = pd.DataFrame({\n    "date": pd.date_range("2022-01-01", periods=36, freq="MS"),\n    "rate": [round(18 * 1.025 ** i, 2) for i in range(36)]\n})\nmonthly["year"] = monthly["date"].dt.year\nannual_avg = monthly.groupby("year")["rate"].mean()\nannual_avg.round(2)' },
        hints: [{ tr: "Yılın İngilizcesi.", en: "The English word for it." }],
        checks: [{ py: { tr: "list(yillik_ort.index) == [2022, 2023, 2024]", en: "list(annual_avg.index) == [2022, 2023, 2024]" }, msg: { tr: "Sonuç 2022, 2023 ve 2024 için üç yıllık ortalama içermeli.", en: "The result should hold three annual averages for 2022, 2023 and 2024." } }]
      },
      {
        id: "m0-pandas2-c6", kind: "debug",
        task: { tr: "Her yıl için tüm bölgelerin ortalamasını almak istiyoruz ama hata alıyoruz. Hata mesajını oku: hangi sütun ortalamaya girmeye çalışıyor?", en: "We want the average across regions for each year, but get an error. Read the message: which column is being averaged?" },
        code: { tr: 'yil_ort = panel.groupby("yil").mean()\nyil_ort', en: 'year_avg = panel.groupby("year").mean()\nyear_avg' },
        solution: { tr: 'yil_ort = panel.groupby("yil")[["issizlik", "gelir"]].mean()\nyil_ort', en: 'year_avg = panel.groupby("year")[["unemployment", "income"]].mean()\nyear_avg' },
        hints: [{ tr: "Metin içeren <code>bolge</code> sütununun ortalaması alınamaz. Yalnızca sayısal sütunları seç.", en: "The text column <code>region</code> cannot be averaged. Select only the numeric columns." }, { tr: '<code>panel.groupby("yil")[["issizlik", "gelir"]].mean()</code>', en: '<code>panel.groupby("year")[["unemployment", "income"]].mean()</code>' }],
        checks: [{ py: { tr: '"issizlik" in yil_ort.columns and abs(yil_ort.loc[2020, "issizlik"] - panel[panel["yil"] == 2020]["issizlik"].mean()) < 1e-9', en: '"unemployment" in year_avg.columns and abs(year_avg.loc[2020, "unemployment"] - panel[panel["year"] == 2020]["unemployment"].mean()) < 1e-9' }, msg: { tr: "Yıl başına işsizlik ortalaması bekleniyordu.", en: "Mean unemployment per year was expected." } }]
      },
      {
        id: "m0-pandas2-c7", kind: "challenge",
        task: { tr: "2024 yılında kıyı bölgeleri ile kıyı olmayan bölgelerin ortalama gelirini karşılaştır. Sonucu <code>gelir_2024</code> (index'i <code>kiyi</code> değerleri olan bir Series) değişkenine ata. <code>birlesik</code> tablosunu kullan.", en: "Compare mean income in 2024 between coastal and non-coastal regions. Store the result in <code>income_2024</code> (a Series indexed by <code>coastal</code>). Use the <code>merged</code> table." },
        code: { tr: "# gelir_2024 = ...\n", en: "# income_2024 = ...\n" },
        solution: { tr: 'gelir_2024 = birlesik[birlesik["yil"] == 2024].groupby("kiyi")["gelir"].mean()\ngelir_2024', en: 'income_2024 = merged[merged["year"] == 2024].groupby("coastal")["income"].mean()\nincome_2024' },
        hints: [{ tr: "Önce yılı filtrele, sonra <code>kiyi</code>'ye göre grupla, sonra gelir ortalaması.", en: "Filter the year first, then group by <code>coastal</code>, then take the mean income." }],
        checks: [{ py: { tr: 'gelir_2024.equals(birlesik[birlesik["yil"] == 2024].groupby("kiyi")["gelir"].mean())', en: 'income_2024.equals(merged[merged["year"] == 2024].groupby("coastal")["income"].mean())' }, msg: { tr: "Sonuç, 2024 için kıyı durumuna göre ortalama gelir olmalı.", en: "The result should be 2024 mean income by coastal status." } }]
      }
    ],
    quiz: [
      {
        q: { tr: "<code>panel.groupby(\"bolge\")[\"gelir\"].max()</code> kaç değer döndürür (5 bölge, 5 yıl)?", en: "How many values does <code>panel.groupby(\"region\")[\"income\"].max()</code> return (5 regions, 5 years)?" },
        options: { tr: ["1", "5", "25"], en: ["1", "5", "25"] },
        answer: 1,
        explain: { tr: "Her grup (bölge) için bir değer.", en: "One value per group (region)." }
      },
      {
        q: { tr: "İki tabloyu ortak bir sütun üzerinden yan yana getiren pandas komutu hangisidir?", en: "Which pandas command brings two tables side by side through a shared column?" },
        options: { tr: ["<code>groupby</code>", "<code>merge</code>", "<code>isna</code>"], en: ["<code>groupby</code>", "<code>merge</code>", "<code>isna</code>"] },
        answer: 1,
        explain: { tr: "merge, anahtar sütundaki değerleri eşleyerek tabloları birleştirir.", en: "merge joins tables by matching values in the key column." }
      },
      {
        q: { tr: "CSV'deki boş bir hücre pandas'ta neye dönüşür?", en: "What does an empty CSV cell become in pandas?" },
        options: { tr: ["0", "<code>NaN</code>", "Boş metin"], en: ["0", "<code>NaN</code>", "An empty string"] },
        answer: 1,
        explain: { tr: "Eksik sayısal değerler NaN ile gösterilir; ortalama gibi özetler onları varsayılan olarak atlar.", en: "Missing numeric values are shown as NaN; summaries such as mean skip them by default." }
      }
    ]
  });

  /* =================================================================== */
  /* Bitirme projesi                                                      */
  /* =================================================================== */
  const CAP_SETUP = {
    tr: 'import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\nrng = np.random.default_rng(42)\nbolgeler = ["Kuzey", "Güney", "Doğu", "Batı", "Merkez", "Sahil"]\nsatirlar = []\nfor b_i, b in enumerate(bolgeler):\n    issizlik = 8 + b_i            # bölgenin başlangıç işsizliği\n    for yil in range(2015, 2025):\n        buyume = rng.normal(3 + 0.3 * b_i, 2.0)\n        issizlik = issizlik - 0.4 * (buyume - 3) + rng.normal(0, 0.3)\n        enflasyon = rng.normal(12, 4)\n        satirlar.append([b, yil, round(buyume, 2), round(issizlik, 2), round(enflasyon, 2)])\n\npanel = pd.DataFrame(satirlar, columns=["bolge", "yil", "buyume", "issizlik", "enflasyon"])\n',
    en: 'import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\nrng = np.random.default_rng(42)\nregions = ["North", "South", "East", "West", "Central", "Coastal"]\nrows = []\nfor r_i, r in enumerate(regions):\n    unemployment = 8 + r_i            # the region\'s starting unemployment\n    for year in range(2015, 2025):\n        growth = rng.normal(3 + 0.3 * r_i, 2.0)\n        unemployment = unemployment - 0.4 * (growth - 3) + rng.normal(0, 0.3)\n        inflation = rng.normal(12, 4)\n        rows.append([r, year, round(growth, 2), round(unemployment, 2), round(inflation, 2)])\n\npanel = pd.DataFrame(rows, columns=["region", "year", "growth", "unemployment", "inflation"])\n'
  };
  lessons.push({
    id: "m0-capstone",
    minutes: 40,
    packages: ["numpy", "pandas", "matplotlib"],
    title: { tr: "Bitirme projesi: bölgesel panel analizi", en: "Capstone: a regional panel analysis" },
    blurb: { tr: "Az yönlendirmeyle uçtan uca bir analiz: veriyi üret, grupla, dönüştür, ilişkiyi incele, grafikle ve yorumla.", en: "An end-to-end analysis with little guidance: generate the data, group, transform, examine a relationship, chart it and interpret." },
    terms: [{ tr: "korelasyon", en: "correlation" }, { tr: "fark alma", en: "differencing" }, { tr: "Okun yasası", en: "Okun's law" }],
    concept: {
      tr: `<p>Modül 0'da öğrendiğin her şeyi tek bir analizde kullanacaksın. Bu derste hücrelerin çoğu <b>meydan okumadır</b>: yalnızca görev ve otomatik testler var. Takılırsan ipuçlarına, en sonda çözüme bakabilirsin; ama önce kendin dene.</p>
<p><b>Veri:</b> 6 kurgusal bölgenin 2015–2024 yıllarına ait büyüme, işsizlik ve enflasyon verisi. Veriyi kendimiz simüle ediyoruz ve içine bilerek bir ilişki koyuyoruz: büyüme normalin (%3) üstündeyse işsizlik <b>ortalama olarak</b> düşüyor, altındaysa artıyor. Veriye rastgele gürültü de eklendiği için bu her gözlemde geçerli değil: büyümenin %3'ü geçtiği bazı yıllarda işsizlik yine de biraz artabiliyor. Bu, <b>Okun yasası</b>nın basit bir biçimidir.</p>
<p><b>Yeni iki araç:</b></p>
<ul>
<li><code>.diff()</code> bir serinin bir önceki değere göre farkını alır. Panelde bunu <b>bölge içinde</b> yapmak gerekir: <code>panel.groupby("bolge")["issizlik"].diff()</code>. Yoksa bir bölgenin ilk yılı, önceki bölgenin son yılından çıkarılır. <code>.diff()</code> satır sırasına bakar; bu yüzden önce <code>panel.sort_values(["bolge", "yil"])</code> ile bölge ve yıla göre sırala. Her bölgenin ilk yılının bir öncesi olmadığından o yılın farkı <code>NaN</code> olur.</li>
<li><code>x.corr(y)</code> iki değişken arasındaki <b>korelasyonu</b> verir: −1 ile +1 arasında, işaret yönü, büyüklük doğrusal ilişkinin gücünü gösterir.</li>
</ul>
<div class="box econ"><b>Yorum için hatırlatma.</b> Bulacağın güçlü ilişki, veriyi üretirken koyduğumuz ilişkidir. Bu, analiz adımlarının ilişkiyi doğru yakaladığını gösterir; gerçek bir ekonomi hakkında hiçbir şey söylemez. Korelasyon tek başına nedensellik değildir; sonucu “birlikte hareket” olarak yorumla.</div>`,
      en: `<p>You will use everything from Module 0 in a single analysis. Most cells in this lesson are <b>challenges</b>: just a task and automatic tests. If you get stuck you can look at the hints and, at the end, the solution; but try on your own first.</p>
<p><b>Data:</b> growth, unemployment and inflation for 6 fictional regions, 2015–2024. We simulate the data ourselves and deliberately build in a relationship: when growth is above normal (3%), unemployment falls <b>on average</b>; below it, unemployment rises. Because random noise is added too, this does not hold for every observation: in some years with growth above 3%, unemployment can still rise slightly. This is a simple form of <b>Okun's law</b>.</p>
<p><b>Two new tools:</b></p>
<ul>
<li><code>.diff()</code> takes the difference from the previous value. In a panel this must be done <b>within each region</b>: <code>panel.groupby("region")["unemployment"].diff()</code>. Otherwise a region's first year would be compared with the previous region's last year. <code>.diff()</code> follows the row order, so first sort by region and year with <code>panel.sort_values(["region", "year"])</code>. Each region's first year has no predecessor, so its difference is <code>NaN</code>.</li>
<li><code>x.corr(y)</code> gives the <b>correlation</b> between two variables: between −1 and +1; the sign shows the direction and the size the strength of the linear relationship.</li>
</ul>
<div class="box econ"><b>A reminder for interpretation.</b> The strong relationship you will find is the one we put into the data. It shows that the analysis steps recover the relationship correctly; it says nothing about a real economy. Correlation alone is not causation; interpret the result as “moving together”.</div>`
    },
    playground: null,
    cells: [
      {
        id: "m0-capstone-c1", kind: "run",
        task: { tr: "Veriyi üret ve ilk satırlara bak. Kodu okumaya çalış: her satırı tanıyor musun?", en: "Generate the data and look at the first rows. Try to read the code: do you recognise every line?" },
        code: { tr: CAP_SETUP.tr + "print(panel.shape)\npanel.head(8)", en: CAP_SETUP.en + "print(panel.shape)\npanel.head(8)" }
      },
      {
        id: "m0-capstone-c2", kind: "challenge",
        task: { tr: "Her bölgenin ortalama büyümesini hesapla ve en hızlı büyüyen bölgenin adını <code>en_hizli</code>'ya ata.", en: "Compute each region's mean growth and store the name of the fastest-growing region in <code>fastest</code>." },
        code: { tr: "# en_hizli = ...\n", en: "# fastest = ...\n" },
        solution: { tr: 'bolge_buyume = panel.groupby("bolge")["buyume"].mean()\nen_hizli = bolge_buyume.idxmax()\nprint(bolge_buyume.round(2))\nprint("En hızlı:", en_hizli)', en: 'region_growth = panel.groupby("region")["growth"].mean()\nfastest = region_growth.idxmax()\nprint(region_growth.round(2))\nprint("Fastest:", fastest)' },
        hints: [{ tr: "groupby + mean, ardından en büyük değerin yeri: <code>idxmax()</code>.", en: "groupby + mean, then the position of the maximum: <code>idxmax()</code>." }],
        checks: [{ py: { tr: 'en_hizli == panel.groupby("bolge")["buyume"].mean().idxmax()', en: 'fastest == panel.groupby("region")["growth"].mean().idxmax()' }, msg: { tr: "Bulunan bölge, ortalama büyümesi en yüksek bölge değil.", en: "The region found is not the one with the highest mean growth." } }]
      },
      {
        id: "m0-capstone-c3", kind: "challenge",
        task: { tr: "Paneli önce bölge ve yıla göre sırala, sonra işsizliğin yıllık değişimini <b>her bölge içinde</b> hesaplayıp <code>issizlik_degisim</code> adlı yeni bir sütuna yaz. Birimi yüzde puandır.", en: "First sort the panel by region and year, then compute the yearly change in unemployment <b>within each region</b> and store it in a new column <code>unemp_change</code>. Its unit is percentage points." },
        code: { tr: '# panel["issizlik_degisim"] = ...\n', en: '# panel["unemp_change"] = ...\n' },
        solution: { tr: 'panel = panel.sort_values(["bolge", "yil"]).reset_index(drop=True)\npanel["issizlik_degisim"] = panel.groupby("bolge")["issizlik"].diff()\npanel.head(4)', en: 'panel = panel.sort_values(["region", "year"]).reset_index(drop=True)\npanel["unemp_change"] = panel.groupby("region")["unemployment"].diff()\npanel.head(4)' },
        hints: [{ tr: "Önce <code>panel = panel.sort_values([\"bolge\", \"yil\"])</code>, sonra kavram bölümündeki örnek: <code>groupby(...)[...].diff()</code>.", en: "First <code>panel = panel.sort_values([\"region\", \"year\"])</code>, then the example in the idea section: <code>groupby(...)[...].diff()</code>." }],
        checks: [
          { py: { tr: '"issizlik_degisim" in panel.columns', en: '"unemp_change" in panel.columns' }, msg: { tr: "Yeni sütun bulunamadı.", en: "The new column was not found." } },
          { py: { tr: 'panel["issizlik_degisim"].isna().sum() == 6 and ((panel["issizlik_degisim"] - panel.groupby("bolge")["issizlik"].diff()).abs().dropna() < 1e-9).all()', en: 'panel["unemp_change"].isna().sum() == 6 and ((panel["unemp_change"] - panel.groupby("region")["unemployment"].diff()).abs().dropna() < 1e-9).all()' }, msg: { tr: "Fark bölge içinde alınmalı: her bölgenin ilk yılı NaN olmalı (toplam 6 NaN).", en: "The difference must be taken within regions: each region's first year should be NaN (6 NaN in total)." } }
        ]
      },
      {
        id: "m0-capstone-c4", kind: "challenge",
        task: { tr: "Büyüme (x) ile işsizlikteki değişimin (y) serpme grafiğini çiz. Başlık ve iki eksen adı olsun.", en: "Draw a scatter plot of growth (x) against the change in unemployment (y), with a title and both axis labels." },
        code: { tr: "# kodunu buraya yaz\n", en: "# write your code here\n" },
        solution: { tr: 'plt.scatter(panel["buyume"], panel["issizlik_degisim"])\nplt.title("Büyüme ve işsizlikteki değişim")\nplt.xlabel("Büyüme (%)")\nplt.ylabel("İşsizlikteki değişim (yüzde puan)")\nplt.show()', en: 'plt.scatter(panel["growth"], panel["unemp_change"])\nplt.title("Growth and the change in unemployment")\nplt.xlabel("Growth (%)")\nplt.ylabel("Change in unemployment (percentage points)")\nplt.show()' },
        hints: [{ tr: "Grafik dersindeki serpme grafiği hücresine benzer.", en: "It is like the scatter cell in the plotting lesson." }],
        checks: [
          { py: 'len(_figs) > 0 and _figs[-1]["collections"] >= 1', msg: { tr: "Bir serpme grafiği bekleniyordu.", en: "A scatter plot was expected." } },
          { py: '_figs[-1]["title"].strip() != "" and _figs[-1]["xlabel"].strip() != "" and _figs[-1]["ylabel"].strip() != ""', msg: { tr: "Başlık ve iki eksen adı eksiksiz olmalı.", en: "Title and both axis labels are required." } }
        ]
      },
      {
        id: "m0-capstone-c5", kind: "challenge",
        task: { tr: "Büyüme ile işsizlikteki değişim arasındaki korelasyonu <code>korelasyon</code>'a ata ve yazdır. İşareti ne anlatıyor?", en: "Store the correlation between growth and the change in unemployment in <code>correlation</code> and print it. What does its sign tell you?" },
        code: { tr: "# korelasyon = ...\n", en: "# correlation = ...\n" },
        solution: { tr: 'korelasyon = panel["buyume"].corr(panel["issizlik_degisim"])\nprint(round(korelasyon, 3))', en: 'correlation = panel["growth"].corr(panel["unemp_change"])\nprint(round(correlation, 3))' },
        hints: [{ tr: "<code>seri1.corr(seri2)</code>. NaN değerler otomatik atlanır.", en: "<code>series1.corr(series2)</code>. NaN values are skipped automatically." }],
        checks: [{ py: { tr: 'abs(korelasyon - panel["buyume"].corr(panel["issizlik_degisim"])) < 1e-9', en: 'abs(correlation - panel["growth"].corr(panel["unemp_change"])) < 1e-9' }, msg: { tr: "Korelasyon büyüme ile işsizlik değişimi arasında hesaplanmalı.", en: "The correlation should be between growth and the change in unemployment." } }],
        after: { tr: "Güçlü ve negatif: büyüme yüksekken işsizlik <b>ortalama olarak</b> düşüyor. Gürültü nedeniyle bu her gözlemde geçerli değil; korelasyon tek tek yılları değil genel eğilimi özetler. Ayrıca bu ilişkiyi veriyi üretirken biz koyduk; analizin yaptığı, onu doğru biçimde geri bulmak.", en: "Strong and negative: unemployment falls <b>on average</b> when growth is high. Because of the noise, this does not hold for every observation; the correlation summarises the overall tendency, not individual years. Also, we put this relationship into the data; what the analysis does is recover it correctly." }
      },
      {
        id: "m0-capstone-c6", kind: "challenge",
        task: { tr: "Bölge başına ortalama büyüme, işsizlik ve enflasyonu içeren bir özet tablo (<code>ozet</code>) oluştur, 2 ondalığa yuvarla ve büyümeye göre büyükten küçüğe sırala.", en: "Build a summary table (<code>summary</code>) with mean growth, unemployment and inflation per region, rounded to 2 decimals and sorted by growth, highest first." },
        code: { tr: "# ozet = ...\n", en: "# summary = ...\n" },
        solution: { tr: 'ozet = panel.groupby("bolge")[["buyume", "issizlik", "enflasyon"]].mean().round(2)\nozet = ozet.sort_values("buyume", ascending=False)\nozet', en: 'summary = panel.groupby("region")[["growth", "unemployment", "inflation"]].mean().round(2)\nsummary = summary.sort_values("growth", ascending=False)\nsummary' },
        hints: [{ tr: "Birden fazla sütun: çift köşeli parantez. Sıralama: <code>sort_values(..., ascending=False)</code>.", en: "Several columns: double square brackets. Sorting: <code>sort_values(..., ascending=False)</code>." }],
        checks: [
          { py: { tr: 'list(ozet.columns) == ["buyume", "issizlik", "enflasyon"] and len(ozet) == 6', en: 'list(summary.columns) == ["growth", "unemployment", "inflation"] and len(summary) == 6' }, msg: { tr: "Tablo 6 satır ve üç sütun (buyume, issizlik, enflasyon) içermeli.", en: "The table should have 6 rows and three columns (growth, unemployment, inflation)." } },
          { py: { tr: 'ozet["buyume"].is_monotonic_decreasing and ozet.index[0] == panel.groupby("bolge")["buyume"].mean().idxmax()', en: 'summary["growth"].is_monotonic_decreasing and summary.index[0] == panel.groupby("region")["growth"].mean().idxmax()' }, msg: { tr: "Tablo büyümeye göre büyükten küçüğe sıralı olmalı.", en: "The table should be sorted by growth, highest first." } }
        ]
      },
      {
        id: "m0-capstone-c7", kind: "challenge",
        task: { tr: "Son adım: her bölgenin işsizliğini yıllara göre ayrı bir çizgi olarak <b>aynı grafikte</b> çiz; lejantta bölge adları görünsün. (İpucu: bölgeler üzerinde bir döngü.)", en: "Final step: plot each region's unemployment over the years as a separate line <b>on one chart</b>, with the region names in the legend. (Hint: a loop over the regions.)" },
        code: { tr: "# kodunu buraya yaz\n", en: "# write your code here\n" },
        solution: { tr: 'for b in panel["bolge"].unique():\n    alt = panel[panel["bolge"] == b]\n    plt.plot(alt["yil"], alt["issizlik"], label=b)\nplt.title("Bölgelere göre işsizlik (%)")\nplt.xlabel("Yıl")\nplt.legend()\nplt.show()', en: 'for r in panel["region"].unique():\n    sub = panel[panel["region"] == r]\n    plt.plot(sub["year"], sub["unemployment"], label=r)\nplt.title("Unemployment by region (%)")\nplt.xlabel("Year")\nplt.legend()\nplt.show()' },
        hints: [
          { tr: "<code>panel[\"bolge\"].unique()</code> bölge adlarını verir.", en: "<code>panel[\"region\"].unique()</code> gives the region names." },
          { tr: "Döngünün içinde o bölgeyi filtrele ve <code>plt.plot(..., label=b)</code> çiz; döngüden sonra <code>plt.legend()</code>.", en: "Inside the loop, filter that region and draw <code>plt.plot(..., label=r)</code>; after the loop, <code>plt.legend()</code>." }
        ],
        checks: [{ py: 'len(_figs) > 0 and _figs[-1]["lines"] >= 6 and _figs[-1]["legend"]', msg: { tr: "Grafikte 6 çizgi ve bir lejant olmalı.", en: "The chart should have 6 lines and a legend." } }],
        after: { tr: "Tebrikler, Modül 0'ı bitirdin! Veriyi üretip okudun, grupladın, dönüştürdün, bir ilişkiyi ölçtün, grafikledin ve sınırlarını yorumladın. Artık makine öğrenmesi modüllerine hazırsın.", en: "Congratulations, you have finished Module 0! You generated and read data, grouped and transformed it, measured a relationship, charted it and interpreted its limits. You are ready for the machine learning modules." }
      }
    ],
    quiz: [
      {
        q: { tr: "Panelde işsizlik farkını neden <code>groupby(\"bolge\")</code> ile alıyoruz?", en: "Why do we take the unemployment difference with <code>groupby(\"region\")</code> in the panel?" },
        options: { tr: ["Daha hızlı çalıştığı için", "Bir bölgenin ilk yılı önceki bölgenin son yılından çıkarılmasın diye", "diff başka türlü çalışmadığı için"], en: ["Because it runs faster", "So a region's first year is not compared with the previous region's last year", "Because diff does not work otherwise"] },
        answer: 1,
        explain: { tr: "Fark, aynı birimin ardışık dönemleri arasında anlamlıdır.", en: "A difference only makes sense between consecutive periods of the same unit." }
      },
      {
        q: { tr: "−0,8'lik bir korelasyon neyi gösterir?", en: "What does a correlation of −0.8 show?" },
        options: { tr: ["Güçlü, ters yönlü doğrusal bir ilişkiyi", "x'in y'ye neden olduğunu", "İlişki olmadığını"], en: ["A strong, inverse linear relationship", "That x causes y", "No relationship"] },
        answer: 0,
        explain: { tr: "İşaret yönü, büyüklük gücü gösterir; nedensellik hakkında tek başına bir şey söylemez.", en: "The sign shows direction and the size strength; on its own it says nothing about causality." }
      },
      {
        q: { tr: "Bu projede güçlü bir ilişki bulmamız neyi kanıtlar?", en: "What does finding a strong relationship in this project prove?" },
        options: { tr: ["Gerçek bölgelerde Okun yasasının geçerli olduğunu", "Analiz adımlarının veriye koyduğumuz ilişkiyi doğru yakaladığını", "Büyümenin işsizliği kesin olarak düşürdüğünü"], en: ["That Okun's law holds in real regions", "That the analysis steps correctly recovered the relationship we built in", "That growth certainly lowers unemployment"] },
        answer: 1,
        explain: { tr: "Simüle veri, yöntemi sınamak için iyidir; gerçek dünya hakkında sonuç için gerçek veri ve uygun bir tasarım gerekir.", en: "Simulated data are good for testing a method; conclusions about the real world need real data and a suitable design." }
      }
    ]
  });

  /* ---------- Yeni dersleri ekle ve sırala ---------- */
  const all = m.lessons.concat(lessons);
  const ORDER = ["m0-l1", "m0-l2", "m0-l3", "m0-l4", "m0-loops2", "m0-text", "m0-l5", "m0-l6", "m0-l7", "m0-l8", "m0-sim", "m0-pandas2", "m0-l9", "m0-capstone"];
  m.lessons = ORDER.map((id) => all.find((L) => L.id === id)).filter(Boolean);
  m.sections = [
    { title: { tr: "Python temelleri", en: "Python foundations" }, ids: ["m0-l1", "m0-l2", "m0-l3", "m0-l4", "m0-loops2", "m0-text", "m0-l5"] },
    { title: { tr: "Bilimsel Python", en: "Scientific Python" }, ids: ["m0-l6", "m0-l7", "m0-l8", "m0-sim", "m0-pandas2"] },
    { title: { tr: "Projeler", en: "Projects" }, ids: ["m0-l9", "m0-capstone"] }
  ];
})();
