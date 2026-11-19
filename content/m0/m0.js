/* Modül 0 — Python'a İlk Adım / Module 0 — First Steps in Python
 * © 2026 Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 * Tüm veriler kurgusaldır (öğretim amaçlı örnek). All data are fictional teaching examples.
 */
(function () {
  "use strict";

  /* ---------- Ortak örnek veriler ---------- */
  const MONTHLY = [3.2, 4.5, 2.9, 3.0, 3.4, 1.6, 3.2, 2.5, 2.9, 2.6, 2.2, 1.0];
  const MONTHS = {
    tr: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
    en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  };
  const MLIST = "[" + MONTHLY.map((v) => v.toFixed(1)).join(", ") + "]";

  // Kurgusal "Örnekistan" makro verisi, 2015–2024
  const MACRO = {
    name: { tr: "veri", en: "data" },
    cols: [
      { tr: "yil", en: "year" },
      { tr: "buyume", en: "growth" },
      { tr: "enflasyon", en: "inflation" },
      { tr: "faiz", en: "rate" },
      { tr: "issizlik", en: "unemployment" }
    ],
    rows: [
      [2015, 3.1, 6.5, 8.0, 9.8],
      [2016, 2.4, 7.2, 8.5, 10.1],
      [2017, 4.0, 9.8, 10.0, 9.6],
      [2018, 1.2, 14.1, 16.0, 10.9],
      [2019, -0.8, 11.3, 14.0, 12.4],
      [2020, -2.5, 8.9, 9.0, 13.6],
      [2021, 6.3, 15.6, 13.0, 11.2],
      [2022, 4.1, 22.4, 20.0, 10.4],
      [2023, 3.0, 18.7, 24.0, 10.0],
      [2024, 2.6, 12.2, 18.0, 10.3]
    ]
  };
  function macroPy(lang, varName) {
    const v = varName || MACRO.name[lang];
    const lines = MACRO.cols.map((c, j) => '    "' + c[lang] + '": [' + MACRO.rows.map((r) => (j === 0 ? String(r[j]) : r[j].toFixed(1))).join(", ") + "],");
    return v + " = pd.DataFrame({\n" + lines.join("\n") + "\n})";
  }
  const MACRO_PY = { tr: macroPy("tr"), en: macroPy("en") };
  window.M0_DATA = { MONTHLY, MONTHS, MLIST, MACRO, MACRO_PY };

  /* =================================================================== */
  const lessons = [];

  /* ------------------------------------------------------------------- */
  /* Ders 1 — İlk kod                                                     */
  /* ------------------------------------------------------------------- */
  lessons.push({
    id: "m0-l1",
    minutes: 12,
    title: { tr: "Laboratuvara hoş geldin: ilk kodun", en: "Welcome to the lab: your first code" },
    blurb: { tr: "Kod hücresi, print ve Python'u hesap makinesi gibi kullanmak.", en: "Code cells, print, and using Python as a calculator." },
    terms: [{ tr: "kod hücresi", en: "code cell" }, { tr: "çıktı", en: "output" }, { tr: "yorum satırı", en: "comment" }, { tr: "işleç", en: "operator" }],
    concept: {
      tr: `<p>Makine öğrenmesi, bilgisayara veriden örüntü öğretmektir. Bilgisayara ne yapacağını söylemek için bir dil gerekir. İktisatçıların ve veri bilimcilerin en çok kullandığı dil <b>Python</b>'dur: okunması kolaydır ve veri, istatistik ve makine öğrenmesi için hazır araçları vardır.</p>
<p>Bu laboratuvarda kodu <b>hücrelere</b> yazarsın. Bir hücreyi <b>Çalıştır</b> düğmesiyle (ya da <kbd>Shift+Enter</kbd> ile) çalıştırınca Python satırları <b>yukarıdan aşağıya, sırayla</b> okur ve sonucu hücrenin altına yazar.</p>
<ul>
<li><code>print(...)</code> parantez içindekini ekrana yazar. Metinler tırnak içinde yazılır: <code>print("Merhaba")</code>.</li>
<li><code>#</code> ile başlayan satırlar <b>yorumdur</b>. Python onları atlar; onlar insanlara not içindir.</li>
<li>Python bir hesap makinesidir: <code>+</code> toplama, <code>-</code> çıkarma, <code>*</code> çarpma, <code>/</code> bölme, <code>**</code> üs alma. İşlem sırası matematiktekiyle aynıdır; parantez kullanabilirsin.</li>
</ul>
<div class="box econ"><b>İktisat örneği.</b> Bir ürünün fiyatı 80 TL'den 100 TL'ye çıktıysa yüzde değişim <code>(100 - 80) / 80 * 100</code> = 25'tir. Python bu hesabı tek satırda yapar.</div>`,
      en: `<p>Machine learning means teaching a computer to find patterns in data. To tell a computer what to do, we need a language. The language economists and data scientists use most is <b>Python</b>: it is easy to read and has ready-made tools for data, statistics and machine learning.</p>
<p>In this lab you write code in <b>cells</b>. When you run a cell with the <b>Run</b> button (or <kbd>Shift+Enter</kbd>), Python reads the lines <b>from top to bottom, in order</b> and writes the result below the cell.</p>
<ul>
<li><code>print(...)</code> writes what is inside the brackets to the screen. Text goes inside quotes: <code>print("Hello")</code>.</li>
<li>Lines that start with <code>#</code> are <b>comments</b>. Python skips them; they are notes for people.</li>
<li>Python is a calculator: <code>+</code> add, <code>-</code> subtract, <code>*</code> multiply, <code>/</code> divide, <code>**</code> power. The order of operations is the same as in maths; you can use brackets.</li>
</ul>
<div class="box econ"><b>Economics example.</b> If a price rises from 80 to 100, the percentage change is <code>(100 - 80) / 80 * 100</code> = 25. Python does this in one line.</div>`
    },
    playground: {
      type: "tracer",
      intro: { tr: "Python'un bir programı nasıl okuduğunu satır satır izle. Yorum satırına geldiğinde ne olduğuna dikkat et.", en: "Watch line by line how Python reads a program. Notice what happens at the comment line." },
      code: {
        tr: ['print("Merhaba, iktisat!")', "# Bu satır bir yorumdur, çalışmaz", "print(2026 - 1776)", 'print("Fiyat artışı (%):", (100 - 80) / 80 * 100)'],
        en: ['print("Hello, economics!")', "# This line is a comment and does not run", "print(2026 - 1776)", 'print("Price increase (%):", (100 - 80) / 80 * 100)']
      },
      names: { tr: [], en: [] },
      steps: [
        { line: 0, out: { tr: "Merhaba, iktisat!", en: "Hello, economics!" }, note: { tr: "Python ilk satırı okudu ve tırnak içindeki metni olduğu gibi yazdı.", en: "Python read the first line and printed the text inside the quotes as it is." } },
        { line: 1, note: { tr: "<code>#</code> ile başlayan satır yorumdur. Python bu satırı atladı, çıktıda hiçbir şey değişmedi.", en: "A line starting with <code>#</code> is a comment. Python skipped it; the output did not change." } },
        { line: 2, out: "250", note: { tr: "Python önce parantezin içindeki <code>2026 - 1776</code> ifadesini hesapladı (250), sonra <code>print</code> bu sonucu yazdı. Tırnak içinde yazsaydık (<code>\"2026 - 1776\"</code>) bir metin olurdu ve olduğu gibi yazılırdı. (Adam Smith'in <i>Ulusların Zenginliği</i> 1776'da yayımlandı.)", en: "Python first evaluated the expression <code>2026 - 1776</code> inside the brackets (250), then <code>print</code> wrote the result. Had we written it in quotes (<code>\"2026 - 1776\"</code>), it would be text and printed as it is. (Adam Smith's <i>Wealth of Nations</i> came out in 1776.)" } },
        { line: 3, out: { tr: "Fiyat artışı (%): 25.0", en: "Price increase (%): 25.0" }, note: { tr: "<code>print</code> virgülle ayrılmış birden fazla şeyi yan yana yazar. Bölme işlemi sonucu ondalıklı (25.0) verir.", en: "<code>print</code> writes several items separated by commas side by side. Division gives a decimal result (25.0)." } }
      ],
      takeaway: { tr: "Python kodu yukarıdan aşağıya, satır satır çalıştırır; yorumları atlar.", en: "Python runs code from top to bottom, line by line, and skips comments." }
    },
    cells: [
      {
        id: "m0-l1-c1", kind: "run",
        task: { tr: "İlk kodun hazır. <b>Çalıştır</b>'a bas ve altta çıkan sonucu incele.", en: "Your first code is ready. Press <b>Run</b> and look at the result below." },
        code: { tr: 'print("Merhaba, iktisat!")\nprint(2 + 3)\nprint(7 * 6)', en: 'print("Hello, economics!")\nprint(2 + 3)\nprint(7 * 6)' }
      },
      {
        id: "m0-l1-c2", kind: "run",
        task: { tr: "Bölme ve üs alma işlemlerini dene.", en: "Try division and powers." },
        predict: {
          q: { tr: "Bu hücrenin ilk satırı ne yazdırır?", en: "What does the first line of this cell print?" },
          options: { tr: ["2", "2.5", "10/4"], en: ["2", "2.5", "10/4"] },
          answer: 1,
          explain: { tr: "<code>/</code> her zaman ondalıklı sonuç verir: 10 / 4 = 2.5. <code>2 ** 3</code> ise 2'nin 3. kuvvetidir: 8.", en: "<code>/</code> always gives a decimal result: 10 / 4 = 2.5. <code>2 ** 3</code> is 2 to the power of 3: 8." }
        },
        code: { tr: "print(10 / 4)\nprint(2 ** 3)", en: "print(10 / 4)\nprint(2 ** 3)" }
      },
      {
        id: "m0-l1-c3", kind: "fill",
        task: { tr: "Kahvenin fiyatı 80 TL'den 100 TL'ye çıktı. Yüzde artışı hesaplamak için sarı <code>___</code> boşluğunu doldur ve çalıştır.", en: "The price of coffee rose from 80 to 100. Fill in the yellow <code>___</code> blank to compute the percentage increase, then run." },
        code: { tr: "# Yüzde değişim = (yeni - eski) / eski * 100\nprint((100 - 80) / ___ * 100)", en: "# Percentage change = (new - old) / old * 100\nprint((100 - 80) / ___ * 100)" },
        solution: { tr: "# Yüzde değişim = (yeni - eski) / eski * 100\nprint((100 - 80) / 80 * 100)", en: "# Percentage change = (new - old) / old * 100\nprint((100 - 80) / 80 * 100)" },
        hints: [
          { tr: "Yüzde değişimde payda her zaman <b>eski</b> değerdir.", en: "In a percentage change the denominator is always the <b>old</b> value." },
          { tr: "<code>___</code> yerine <code>80</code> yaz.", en: "Replace <code>___</code> with <code>80</code>." }
        ],
        checks: [{ py: '"25.0" in _out', msg: { tr: "Çıktı 25.0 olmalı. Paydaya eski fiyatı yazdın mı?", en: "The output should be 25.0. Did you put the old price in the denominator?" } }]
      },
      {
        id: "m0-l1-c4", kind: "edit",
        task: { tr: "Şimdi sıra sende: tırnak içindeki metni silip kendi adını yaz ve çalıştır.", en: "Your turn: delete the text inside the quotes, write your own name and run." },
        code: { tr: 'print("Adını buraya yaz")', en: 'print("Write your name here")' },
        solution: { tr: 'print("Ayşe")', en: 'print("Alex")' },
        hints: [{ tr: "Tırnak işaretlerini silme; yalnızca aradaki metni değiştir.", en: "Keep the quotation marks; change only the text between them." }],
        checks: [{ py: { tr: '_out.strip() != "" and "Adını buraya yaz" not in _out', en: '_out.strip() != "" and "Write your name here" not in _out' }, msg: { tr: "Metni kendi adınla değiştirmedin gibi görünüyor.", en: "It looks like you have not replaced the text with your name." } }]
      }
    ],
    quiz: [
      {
        q: { tr: "Bir hücredeki satırlar hangi sırayla çalışır?", en: "In what order do the lines in a cell run?" },
        options: { tr: ["Rastgele", "Yukarıdan aşağıya", "Aşağıdan yukarıya"], en: ["Randomly", "Top to bottom", "Bottom to top"] },
        answer: 1,
        hints: { tr: ["Oyun alanında satırların hangi sırayla vurgulandığını hatırla: hep aynı sıra mıydı?", null, "Python kitap okur gibi okur: ilk satırdan başlar."], en: ["Remember the order in which the playground highlighted the lines: was it always the same?", null, "Python reads like a book: it starts at the first line."] },
        explain: { tr: "Python satırları yazıldığı sırayla, yukarıdan aşağıya çalıştırır.", en: "Python runs lines in the order they are written, top to bottom." }
      },
      {
        q: { tr: "<code># fiyat</code> satırı çalıştırılınca ne olur?", en: "What happens when the line <code># price</code> runs?" },
        options: { tr: ["“fiyat” yazdırılır", "Hata verir", "Hiçbir şey olmaz, yorumdur"], en: ["“price” is printed", "It gives an error", "Nothing, it is a comment"] },
        answer: 2,
        hints: { tr: ["Yazdırmak için <code>print</code> gerekir; bu satırda <code>print</code> yok ve satır <code>#</code> ile başlıyor.", "<code>#</code> ile başlayan satırlar hataya yol açmaz; Python onları okumaz.", null], en: ["Printing needs <code>print</code>; this line has none and it starts with <code>#</code>.", "Lines starting with <code>#</code> do not cause errors; Python does not read them.", null] },
        explain: { tr: "<code>#</code> ile başlayan satırlar yorumdur ve Python tarafından atlanır.", en: "Lines starting with <code>#</code> are comments and Python skips them." }
      },
      {
        q: { tr: "<code>print(3 ** 2)</code> ne yazdırır?", en: "What does <code>print(3 ** 2)</code> print?" },
        options: { tr: ["6", "9", "32"], en: ["6", "9", "32"] },
        answer: 1,
        hints: { tr: ["6, 3 × 2 olurdu; <code>**</code> çarpma değil, üs almadır.", null, "32, sayıları yan yana yazmak olurdu; <code>**</code> üs almadır: 3 × 3."], en: ["6 would be 3 × 2; <code>**</code> is a power, not multiplication.", null, "32 would be writing the digits side by side; <code>**</code> is a power: 3 × 3."] },
        explain: { tr: "<code>**</code> üs almadır: 3² = 9.", en: "<code>**</code> is a power: 3² = 9." }
      }
    ]
  });

  /* ------------------------------------------------------------------- */
  /* Ders 2 — Değişkenler                                                 */
  /* ------------------------------------------------------------------- */
  lessons.push({
    id: "m0-l2",
    minutes: 15,
    title: { tr: "Değişkenler: sayılara isim vermek", en: "Variables: giving numbers names" },
    blurb: { tr: "Atama, veri türleri (int, float, str) ve f-string ile yazdırma.", en: "Assignment, data types (int, float, str) and printing with f-strings." },
    terms: [{ tr: "değişken", en: "variable" }, { tr: "atama", en: "assignment" }, { tr: "tam sayı", en: "integer (int)" }, { tr: "ondalıklı sayı", en: "float" }, { tr: "metin", en: "string (str)" }],
    concept: {
      tr: `<p><b>Değişken</b>, bir değeri saklayan etiketli bir kutudur. <code>gsyh = 1000</code> yazınca Python <code>gsyh</code> adlı bir kutu açar ve içine 1000 koyar. Sonra bu ismi hesaplarda kullanabilirsin.</p>
<ul>
<li><code>=</code> işareti matematikteki eşitlik değildir; <b>atama</b> demektir: “sağdaki değeri hesapla, soldaki isme koy”. Bu yüzden <code>x = x + 1</code> geçerlidir: x'in değerini bir artırır.</li>
<li>Python bir formülü değil, <b>hesaplanmış sonucu</b> saklar. Sonradan girdiyi değiştirirsen, daha önce hesaplanmış değişken kendiliğinden güncellenmez.</li>
<li>Temel türler: <code>int</code> (tam sayı, 2024), <code>float</code> (ondalıklı, 0.45), <code>str</code> (metin, "Türkiye"). Bir değerin türünü <code>type(...)</code> söyler.</li>
<li>İsimlerde boşluk olmaz, rakamla başlanmaz: <code>buyume_orani</code> doğru, <code>büyüme oranı</code> ve <code>2025gsyh</code> yanlış. Uyum için Türkçe karakter kullanmamak iyi bir alışkanlıktır.</li>
<li><b>f-string</b> metnin içine değer yerleştirir: <code>f"Büyüme: %{buyume}"</code>. Süslü parantezin içi hesaplanıp metne eklenir.</li>
</ul>
<div class="box econ"><b>İktisat örneği.</b> Nominal faiz %50, enflasyon %40 ise reel faiz yaklaşık %10'dur. Tam (Fisher) hesap: (1,50 / 1,40 − 1) × 100 ≈ %7,1. Değişkenlerle bu hesapları okunur biçimde yazabilirsin.</div>`,
      en: `<p>A <b>variable</b> is a labelled box that stores a value. When you write <code>gdp = 1000</code>, Python opens a box called <code>gdp</code> and puts 1000 in it. You can then use the name in calculations.</p>
<ul>
<li>The <code>=</code> sign is not equality as in maths; it means <b>assignment</b>: “compute the value on the right, store it under the name on the left”. That is why <code>x = x + 1</code> is valid: it raises x by one.</li>
<li>Python stores the <b>computed result</b>, not a formula. If you later change an input, a variable computed earlier does not update by itself.</li>
<li>Basic types: <code>int</code> (whole number, 2024), <code>float</code> (decimal, 0.45), <code>str</code> (text, "Turkey"). <code>type(...)</code> tells you a value's type.</li>
<li>Names have no spaces and do not start with a digit: <code>growth_rate</code> is fine, <code>growth rate</code> and <code>2025gdp</code> are not.</li>
<li>An <b>f-string</b> puts values inside text: <code>f"Growth: {growth}%"</code>. Whatever is inside the curly braces is computed and inserted.</li>
</ul>
<div class="box econ"><b>Economics example.</b> With a 50% nominal interest rate and 40% inflation, the real rate is about 10%. The exact (Fisher) figure is (1.50 / 1.40 − 1) × 100 ≈ 7.1%. Variables let you write such calculations so they are easy to read.</div>`
    },
    playground: {
      type: "tracer",
      intro: { tr: "Değişken kutularının her satırda nasıl değiştiğini izle. Son iki satırda şaşırtıcı bir şey olacak.", en: "Watch how the variable boxes change at each line. Something surprising happens in the last two lines." },
      code: {
        tr: ["gsyh_2024 = 1000", "gsyh_2025 = 1050", "buyume = (gsyh_2025 - gsyh_2024) / gsyh_2024 * 100", "print(buyume)", "gsyh_2024 = 1020", "print(buyume)", "buyume = (gsyh_2025 - gsyh_2024) / gsyh_2024 * 100", "print(round(buyume, 2))"],
        en: ["gdp_2024 = 1000", "gdp_2025 = 1050", "growth = (gdp_2025 - gdp_2024) / gdp_2024 * 100", "print(growth)", "gdp_2024 = 1020", "print(growth)", "growth = (gdp_2025 - gdp_2024) / gdp_2024 * 100", "print(round(growth, 2))"]
      },
      names: { tr: ["gsyh_2024", "gsyh_2025", "buyume"], en: ["gdp_2024", "gdp_2025", "growth"] },
      steps: [
        { line: 0, vals: [1000], note: { tr: "<code>gsyh_2024</code> adında bir kutu açıldı, içine 1000 kondu.", en: "A box called <code>gdp_2024</code> was created holding 1000." } },
        { line: 1, vals: [1000, 1050], note: { tr: "İkinci kutu: <code>gsyh_2025 = 1050</code>.", en: "Second box: <code>gdp_2025 = 1050</code>." } },
        { line: 2, vals: [1000, 1050, "5.0"], note: { tr: "Sağ taraf hesaplandı: (1050 − 1000) / 1000 × 100 = 5.0. Kutuya formül değil, <b>sonuç</b> kondu.", en: "The right side was computed: (1050 − 1000) / 1000 × 100 = 5.0. The box holds the <b>result</b>, not the formula." } },
        { line: 3, vals: [1000, 1050, "5.0"], out: "5.0", note: { tr: "Büyüme oranı yazdırıldı.", en: "The growth rate was printed." } },
        { line: 4, vals: [1020, 1050, "5.0"], note: { tr: "Revizyon geldi: 2024 GSYH 1020 oldu. Kutunun içeriği değişti.", en: "A revision arrived: 2024 GDP is now 1020. The box's content changed." } },
        { line: 5, vals: [1020, 1050, "5.0"], out: "5.0", note: { tr: "<b>Dikkat:</b> <code>buyume</code> hâlâ 5.0! Python formülü hatırlamaz; kutuda eski sonuç duruyor.", en: "<b>Watch out:</b> <code>growth</code> is still 5.0! Python does not remember the formula; the box still holds the old result." } },
        { line: 6, vals: [1020, 1050, "2.94…"], note: { tr: "Hesap satırını yeniden yazdık: (1050 − 1020) / 1020 × 100 ≈ 2.94. Kutuya yeni sonuç kondu.", en: "We wrote the calculation line again: (1050 − 1020) / 1020 × 100 ≈ 2.94. The box now holds the new result." } },
        { line: 7, vals: [1020, 1050, "2.94…"], out: "2.94", note: { tr: "Revize veriyle büyüme yaklaşık %2,94. Girdi değişince hesabı yeniden yapmak gerekir. (<code>round(x, 2)</code> sonucu iki ondalığa yuvarlar.)", en: "With the revised data, growth is about 2.94%. When an input changes, the calculation must be redone. (<code>round(x, 2)</code> rounds the result to two decimals.)" } }
      ],
      takeaway: { tr: "Değişken bir sonucu saklar; girdiler değişirse hesabı yeniden yapmak gerekir.", en: "A variable stores a result; if the inputs change, the calculation must be redone." }
    },
    cells: [
      {
        id: "m0-l2-c1", kind: "run",
        task: { tr: "İki fiyatı değişkenlere ata, farkı hesapla.", en: "Store two prices in variables and compute the difference." },
        code: { tr: "fiyat_eski = 80\nfiyat_yeni = 100\ndegisim = fiyat_yeni - fiyat_eski\nprint(degisim)", en: "old_price = 80\nnew_price = 100\nchange = new_price - old_price\nprint(change)" }
      },
      {
        id: "m0-l2-c2", kind: "run",
        task: { tr: "Atama işaretinin (<code>=</code>) gerçekte ne yaptığını gör.", en: "See what the assignment sign (<code>=</code>) really does." },
        predict: {
          q: { tr: "Bu kod ne yazdırır?", en: "What does this code print?" },
          options: { tr: ["5", "7", "Hata verir"], en: ["5", "7", "It gives an error"] },
          answer: 1,
          explain: { tr: "<code>x = x + 2</code>: önce sağ taraf hesaplanır (5 + 2 = 7), sonra sonuç yine <code>x</code>'e konur.", en: "<code>x = x + 2</code>: first the right side is computed (5 + 2 = 7), then the result is stored back in <code>x</code>." }
        },
        code: { tr: "x = 5\nx = x + 2\nprint(x)", en: "x = 5\nx = x + 2\nprint(x)" }
      },
      {
        id: "m0-l2-c3", kind: "fill",
        task: { tr: "<code>yil</code> değişkenine tam sayı olarak <code>2024</code> ata. Sonra türleri ve f-string çıktısını incele.", en: "Assign the whole number <code>2024</code> to <code>year</code>. Then look at the types and the f-string output." },
        code: {
          tr: 'enflasyon = 0.45       # ondalıklı sayı (float)\nulke = "Örnekistan"    # metin (str)\nyil = ___              # tam sayı (int)\n\nprint(type(enflasyon), type(ulke), type(yil))\nprint(f"{ulke} {yil} enflasyonu: %{enflasyon * 100}")',
          en: 'inflation = 0.45       # decimal number (float)\ncountry = "Exampleland" # text (str)\nyear = ___             # whole number (int)\n\nprint(type(inflation), type(country), type(year))\nprint(f"{country} {year} inflation: {inflation * 100}%")'
        },
        solution: {
          tr: 'enflasyon = 0.45       # ondalıklı sayı (float)\nulke = "Örnekistan"    # metin (str)\nyil = 2024             # tam sayı (int)\n\nprint(type(enflasyon), type(ulke), type(yil))\nprint(f"{ulke} {yil} enflasyonu: %{enflasyon * 100}")',
          en: 'inflation = 0.45       # decimal number (float)\ncountry = "Exampleland" # text (str)\nyear = 2024            # whole number (int)\n\nprint(type(inflation), type(country), type(year))\nprint(f"{country} {year} inflation: {inflation * 100}%")'
        },
        hints: [{ tr: "Tam sayılar tırnaksız ve noktasız yazılır.", en: "Whole numbers are written without quotes or a decimal point." }, { tr: "<code>yil = 2024</code>", en: "<code>year = 2024</code>" }],
        checks: [
          { py: { tr: "isinstance(yil, int)", en: "isinstance(year, int)" }, msg: { tr: "<code>yil</code> bir tam sayı (int) olmalı. Tırnak ya da nokta kullanma.", en: "<code>year</code> must be an integer (int). Do not use quotes or a decimal point." } },
          { py: { tr: "yil == 2024", en: "year == 2024" }, msg: { tr: "<code>yil</code> değeri 2024 olmalı.", en: "<code>year</code> should be 2024." } }
        ]
      },
      {
        id: "m0-l2-c4", kind: "fill",
        task: { tr: "Yaklaşık reel faiz = nominal faiz − enflasyon. <code>reel_faiz</code> değişkenini bu iki değişkeni kullanarak hesapla (sayı yazma, değişken isimlerini kullan).", en: "Approximate real rate = nominal rate − inflation. Compute <code>real_rate</code> using the two variables (use the names, not numbers)." },
        code: { tr: 'nominal_faiz = 50\nenflasyon = 40\nreel_faiz = ___\nprint(f"Yaklaşık reel faiz: %{reel_faiz}")', en: 'nominal_rate = 50\ninflation = 40\nreal_rate = ___\nprint(f"Approximate real rate: {real_rate}%")' },
        solution: { tr: 'nominal_faiz = 50\nenflasyon = 40\nreel_faiz = nominal_faiz - enflasyon\nprint(f"Yaklaşık reel faiz: %{reel_faiz}")', en: 'nominal_rate = 50\ninflation = 40\nreal_rate = nominal_rate - inflation\nprint(f"Approximate real rate: {real_rate}%")' },
        hints: [{ tr: "Çıkarma işlemi: <code>a - b</code>.", en: "Subtraction: <code>a - b</code>." }, { tr: "<code>reel_faiz = nominal_faiz - enflasyon</code>", en: "<code>real_rate = nominal_rate - inflation</code>" }],
        checks: [
          { py: { tr: "reel_faiz == nominal_faiz - enflasyon", en: "real_rate == nominal_rate - inflation" }, msg: { tr: "<code>reel_faiz</code>, nominal faizden enflasyonun çıkarılmasıyla bulunmalı.", en: "<code>real_rate</code> should be the nominal rate minus inflation." } },
          { py: { tr: "nominal_faiz == 50 and enflasyon == 40", en: "nominal_rate == 50 and inflation == 40" }, msg: { tr: "İlk iki satırdaki değerleri değiştirmeden bırak.", en: "Leave the values in the first two lines unchanged." } }
        ]
      },
      {
        id: "m0-l2-c5", kind: "fill",
        task: { tr: "Şimdi tam Fisher hesabı: reel = ((1 + i/100) / (1 + π/100) − 1) × 100. Eksik kısmı tamamla. Yaklaşık %7,14 bulmalısın.", en: "Now the exact Fisher formula: real = ((1 + i/100) / (1 + π/100) − 1) × 100. Complete it. You should get about 7.14%." },
        code: { tr: "reel_tam = ((1 + nominal_faiz / 100) / (1 + ___ / 100) - 1) * 100\nprint(round(reel_tam, 2))", en: "real_exact = ((1 + nominal_rate / 100) / (1 + ___ / 100) - 1) * 100\nprint(round(real_exact, 2))" },
        solution: { tr: "reel_tam = ((1 + nominal_faiz / 100) / (1 + enflasyon / 100) - 1) * 100\nprint(round(reel_tam, 2))", en: "real_exact = ((1 + nominal_rate / 100) / (1 + inflation / 100) - 1) * 100\nprint(round(real_exact, 2))" },
        hints: [{ tr: "Paydaki terim nominal faizi, paydadaki terim enflasyonu içerir.", en: "The numerator uses the nominal rate; the denominator uses inflation." }, { tr: "<code>___</code> yerine <code>enflasyon</code> yaz.", en: "Replace <code>___</code> with <code>inflation</code>." }],
        checks: [{ py: { tr: "abs(reel_tam - 7.142857) < 0.01", en: "abs(real_exact - 7.142857) < 0.01" }, msg: { tr: "Sonuç yaklaşık 7.14 olmalı. Paydaya enflasyon değişkenini yazdın mı?", en: "The result should be about 7.14. Did you put the inflation variable in the denominator?" } }],
        after: { tr: "<code>round(x, 2)</code> sayıyı virgülden sonra 2 basamağa yuvarlar. Yaklaşık formül (%10) ile tam formül (%7,14) arasındaki fark, yüksek enflasyonda büyür.", en: "<code>round(x, 2)</code> rounds to 2 decimals. The gap between the approximate (10%) and exact (7.14%) figures grows when inflation is high." }
      }
    ],
    quiz: [
      {
        q: { tr: "<code>a = 3</code>, ardından <code>b = a * 2</code>, ardından <code>a = 10</code>. <code>b</code> kaçtır?", en: "<code>a = 3</code>, then <code>b = a * 2</code>, then <code>a = 10</code>. What is <code>b</code>?" },
        options: { tr: ["6", "20", "Hata"], en: ["6", "20", "Error"] },
        answer: 0,
        explain: { tr: "<code>b</code> hesaplandığı anda a = 3 idi, sonuç 6 olarak saklandı. Sonradan a'nın değişmesi b'yi etkilemez.", en: "When <code>b</code> was computed, a was 3, so 6 was stored. Changing a later does not affect b." }
      },
      {
        q: { tr: "<code>type(3.0)</code> hangi türü verir?", en: "What type does <code>type(3.0)</code> give?" },
        options: { tr: ["int", "float", "str"], en: ["int", "float", "str"] },
        answer: 1,
        explain: { tr: "Ondalık noktası olan her sayı <code>float</code>'tur, değeri tam olsa bile.", en: "Any number written with a decimal point is a <code>float</code>, even if its value is whole." }
      },
      {
        q: { tr: "Hangisi geçerli bir değişken adıdır?", en: "Which is a valid variable name?" },
        options: { tr: ["<code>buyume orani</code>", "<code>2025gsyh</code>", "<code>buyume_orani</code>"], en: ["<code>growth rate</code>", "<code>2025gdp</code>", "<code>growth_rate</code>"] },
        answer: 2,
        explain: { tr: "İsimlerde boşluk olmaz ve rakamla başlanmaz; kelimeleri alt çizgiyle ayırırız.", en: "Names cannot contain spaces or start with a digit; we join words with underscores." }
      }
    ]
  });

  /* ------------------------------------------------------------------- */
  /* Ders 3 — Listeler                                                    */
  /* ------------------------------------------------------------------- */
  lessons.push({
    id: "m0-l3",
    minutes: 15,
    title: { tr: "Listeler: bir veri serisini saklamak", en: "Lists: storing a data series" },
    blurb: { tr: "Aylık enflasyon serisi üzerinden indeks, dilim, len, sum, max ve append.", en: "Indexing, slicing, len, sum, max and append on a monthly inflation series." },
    terms: [{ tr: "liste", en: "list" }, { tr: "indeks (sıra no)", en: "index" }, { tr: "dilim", en: "slice" }, { tr: "eleman", en: "element" }],
    concept: {
      tr: `<p>İktisatta tek bir sayıyla değil, çoğu zaman bir <b>seriyle</b> çalışırız: 12 aylık enflasyon, 30 yıllık büyüme. Python'da sıralı değerleri saklamanın en basit yolu <b>listedir</b>: köşeli parantez içinde, virgülle ayrılmış değerler.</p>
<pre><code>aylik_enf = [3.2, 4.5, 2.9, 3.0]</code></pre>
<ul>
<li><b>İndeks 0'dan başlar.</b> İlk eleman <code>aylik_enf[0]</code>, ikinci eleman <code>aylik_enf[1]</code>'dir.</li>
<li><b>Negatif indeks</b> sondan sayar: <code>aylik_enf[-1]</code> son elemandır (en güncel veri).</li>
<li><b>Dilim</b> <code>liste[a:b]</code>, a'dan başlayıp <b>b'ye kadar (b hariç)</b> elemanları verir. <code>[0:3]</code> ilk üç eleman, yani ilk çeyrektir.</li>
<li>Hazır fonksiyonlar: <code>len()</code> eleman sayısı, <code>sum()</code> toplam, <code>max()</code> / <code>min()</code> en büyük / en küçük.</li>
<li><code>liste.append(x)</code> listenin sonuna yeni bir eleman ekler (yeni ay verisi açıklandığında olduğu gibi).</li>
</ul>
<div class="box">Bu derste kullanılan aylık enflasyon değerleri öğretim amaçlı <b>kurgusal</b> verilerdir.</div>`,
      en: `<p>In economics we rarely work with a single number; we work with a <b>series</b>: 12 months of inflation, 30 years of growth. The simplest way to store ordered values in Python is a <b>list</b>: values separated by commas inside square brackets.</p>
<pre><code>monthly_inf = [3.2, 4.5, 2.9, 3.0]</code></pre>
<ul>
<li><b>Indexes start at 0.</b> The first element is <code>monthly_inf[0]</code>, the second is <code>monthly_inf[1]</code>.</li>
<li><b>Negative indexes</b> count from the end: <code>monthly_inf[-1]</code> is the last element (the latest data point).</li>
<li>A <b>slice</b> <code>list[a:b]</code> gives the elements from a <b>up to but not including b</b>. <code>[0:3]</code> is the first three elements, i.e. the first quarter.</li>
<li>Built-in functions: <code>len()</code> number of elements, <code>sum()</code> total, <code>max()</code> / <code>min()</code> largest / smallest.</li>
<li><code>list.append(x)</code> adds a new element at the end (like when a new month's figure is released).</li>
</ul>
<div class="box">The monthly inflation values in this lesson are <b>fictional</b> teaching data.</div>`
    },
    playground: {
      type: "listIndex",
      intro: { tr: "Kaydırıcılarla bir indeks seç (mavi) ve bir dilim belirle (sarı). Kodun ve sonucun nasıl değiştiğini izle. Dilim sonu b'deki elemanın dilime girmediğine dikkat et.", en: "Use the sliders to pick an index (blue) and a slice (yellow). Watch the code and the result change. Notice that the element at position b is not in the slice." },
      name: { tr: "aylik_enf", en: "monthly_inf" },
      values: MONTHLY,
      labels: MONTHS,
      takeaway: { tr: "İndeks 0'dan başlar, −1 sondan sayar; [a:b] dilimi b'yi içermez, b − a eleman verir.", en: "Indexes start at 0, −1 counts from the end; the slice [a:b] excludes b and has b − a elements." }
    },
    cells: [
      {
        id: "m0-l3-c1", kind: "run",
        task: { tr: "12 aylık (kurgusal) enflasyon serisini bir listeye kaydet; uzunluğuna, ilk ve son elemanına bak.", en: "Store the 12-month (fictional) inflation series in a list; look at its length, first and last elements." },
        code: { tr: "aylik_enf = " + MLIST + "\nprint(len(aylik_enf))\nprint(aylik_enf[0])     # Ocak\nprint(aylik_enf[-1])    # Aralık", en: "monthly_inf = " + MLIST + "\nprint(len(monthly_inf))\nprint(monthly_inf[0])     # January\nprint(monthly_inf[-1])    # December" }
      },
      {
        id: "m0-l3-c2", kind: "run",
        task: { tr: "Bir dilim al.", en: "Take a slice." },
        predict: {
          q: { tr: "<code>aylik_enf[1:4]</code> ne verir?", en: "What does <code>monthly_inf[1:4]</code> give?" },
          options: { tr: ["[3.2, 4.5, 2.9, 3.0]", "[4.5, 2.9, 3.0]", "[4.5, 2.9, 3.0, 3.4]"], en: ["[3.2, 4.5, 2.9, 3.0]", "[4.5, 2.9, 3.0]", "[4.5, 2.9, 3.0, 3.4]"] },
          answer: 1,
          explain: { tr: "Dilim 1. indeksten başlar (ikinci eleman) ve 4. indekse <b>kadar</b> gider, 4 dahil değildir: 1, 2, 3 → üç eleman.", en: "The slice starts at index 1 (the second element) and goes <b>up to</b> index 4, not including it: 1, 2, 3 → three elements." }
        },
        code: { tr: "print(aylik_enf[1:4])", en: "print(monthly_inf[1:4])" }
      },
      {
        id: "m0-l3-c3", kind: "fill",
        task: { tr: "İlk çeyreğin (Ocak–Mart) ortalama aylık enflasyonunu hesapla. Dilimin başını ve sonunu doldur.", en: "Compute the average monthly inflation in the first quarter (Jan–Mar). Fill in the start and end of the slice." },
        code: { tr: "ilk_ceyrek = aylik_enf[___:___]\nortalama = sum(ilk_ceyrek) / len(ilk_ceyrek)\nprint(ilk_ceyrek)\nprint(round(ortalama, 2))", en: "first_quarter = monthly_inf[___:___]\naverage = sum(first_quarter) / len(first_quarter)\nprint(first_quarter)\nprint(round(average, 2))" },
        solution: { tr: "ilk_ceyrek = aylik_enf[0:3]\nortalama = sum(ilk_ceyrek) / len(ilk_ceyrek)\nprint(ilk_ceyrek)\nprint(round(ortalama, 2))", en: "first_quarter = monthly_inf[0:3]\naverage = sum(first_quarter) / len(first_quarter)\nprint(first_quarter)\nprint(round(average, 2))" },
        hints: [{ tr: "Ocak 0. indekste. Üç ay istiyoruz ve dilimin sonu dahil değil.", en: "January is at index 0. We want three months and the end of a slice is excluded." }, { tr: "<code>aylik_enf[0:3]</code>", en: "<code>monthly_inf[0:3]</code>" }],
        checks: [{ py: { tr: "ilk_ceyrek == aylik_enf[0:3]", en: "first_quarter == monthly_inf[0:3]" }, msg: { tr: "Dilim tam olarak Ocak, Şubat ve Mart'ı (ilk üç eleman) içermeli.", en: "The slice should contain exactly January, February and March (the first three elements)." } }]
      },
      {
        id: "m0-l3-c4", kind: "fill",
        task: { tr: "Yeni yılın Ocak verisi açıklandı: 5.0. Bunu listenin sonuna ekle, sonra serinin en yüksek değerini bul.", en: "The new January figure is out: 5.0. Add it to the end of the list, then find the highest value in the series." },
        code: { tr: "aylik_enf.append(___)\nen_yuksek = max(___)\nprint(len(aylik_enf), en_yuksek)", en: "monthly_inf.append(___)\nhighest = max(___)\nprint(len(monthly_inf), highest)" },
        solution: { tr: "aylik_enf.append(5.0)\nen_yuksek = max(aylik_enf)\nprint(len(aylik_enf), en_yuksek)", en: "monthly_inf.append(5.0)\nhighest = max(monthly_inf)\nprint(len(monthly_inf), highest)" },
        hints: [{ tr: "<code>append</code>'in içine eklenecek değer, <code>max</code>'ın içine ise listenin adı yazılır.", en: "Put the new value inside <code>append</code>, and the list's name inside <code>max</code>." }],
        checks: [
          { py: { tr: "aylik_enf[-1] == 5.0", en: "monthly_inf[-1] == 5.0" }, msg: { tr: "Listenin son elemanı 5.0 olmalı.", en: "The last element of the list should be 5.0." } },
          { py: { tr: "en_yuksek == max(aylik_enf)", en: "highest == max(monthly_inf)" }, msg: { tr: "<code>en_yuksek</code>, listenin tamamının en büyük değeri olmalı.", en: "<code>highest</code> should be the largest value in the whole list." } }
        ],
        after: { tr: "Hücreyi tekrar çalıştırırsan 5.0 bir kez daha eklenir. Yeniden başlamak için 1. hücreyi çalıştırman yeterli; liste baştan oluşturulur.", en: "If you run this cell again, 5.0 is added once more. To start over, run cell 1; it rebuilds the list." }
      }
    ],
    quiz: [
      {
        q: { tr: "<code>seri = [10, 20, 30, 40]</code> için <code>seri[1]</code> nedir?", en: "For <code>s = [10, 20, 30, 40]</code>, what is <code>s[1]</code>?" },
        options: { tr: ["10", "20", "30"], en: ["10", "20", "30"] },
        answer: 1,
        explain: { tr: "İndeks 0'dan başlar; 1. indeks ikinci elemandır.", en: "Indexes start at 0; index 1 is the second element." }
      },
      {
        q: { tr: "Bir serinin en güncel (son) verisine nasıl ulaşırsın?", en: "How do you get the latest (last) value of a series?" },
        options: { tr: ["<code>seri[0]</code>", "<code>seri[-1]</code>", "<code>seri[last]</code>"], en: ["<code>s[0]</code>", "<code>s[-1]</code>", "<code>s[last]</code>"] },
        answer: 1,
        explain: { tr: "Negatif indeks sondan sayar; −1 son elemandır.", en: "Negative indexes count from the end; −1 is the last element." }
      },
      {
        q: { tr: "<code>seri = [10, 20, 30, 40, 50, 60]</code> için <code>seri[2:5]</code> kaç eleman içerir?", en: "For <code>s = [10, 20, 30, 40, 50, 60]</code>, how many elements does <code>s[2:5]</code> contain?" },
        options: { tr: ["2", "3", "4"], en: ["2", "3", "4"] },
        answer: 1,
        hints: { tr: ["Bitiş indeksi (5) hariç ama başlangıç (2) dahil. İndeksleri tek tek say: 2, 3, 4.", null, "Dilim b'ye kadar gider ama b'yi almaz: indeks 5 dahil değil."], en: ["The end index (5) is excluded but the start (2) is included. Count the indexes: 2, 3, 4.", null, "A slice goes up to b but does not include it: index 5 is not included."] },
        explain: { tr: "5 − 2 = 3: indeks 2, 3 ve 4, yani <code>[30, 40, 50]</code>. <b>b − a</b> kuralı liste yeterince uzunsa geçerlidir: dilim listenin sonunu aşarsa Python hata vermez, olan kadarını verir. Örneğin <code>[10, 20, 30, 40][2:5]</code> yalnızca <code>[30, 40]</code> döndürür.", en: "5 − 2 = 3: indexes 2, 3 and 4, i.e. <code>[30, 40, 50]</code>. The <b>b − a</b> rule holds when the list is long enough: if the slice runs past the end, Python does not raise an error but returns what exists. For example <code>[10, 20, 30, 40][2:5]</code> returns only <code>[30, 40]</code>." }
      }
    ]
  });

  /* ------------------------------------------------------------------- */
  /* Ders 4 — Döngüler ve koşullar                                        */
  /* ------------------------------------------------------------------- */
  lessons.push({
    id: "m0-l4",
    minutes: 20,
    title: { tr: "Döngüler ve koşullar", en: "Loops and conditions" },
    blurb: { tr: "for ile her ayı tek tek gezmek, if/elif/else ile karar vermek, bileşik enflasyon.", en: "Visiting each month with for, deciding with if/elif/else, compound inflation." },
    terms: [{ tr: "döngü", en: "loop" }, { tr: "koşul", en: "condition" }, { tr: "girinti", en: "indentation" }, { tr: "karşılaştırma", en: "comparison" }],
    concept: {
      tr: `<p>Bir serideki her değer için aynı işlemi yapmak istediğimizde <b>döngü</b> kullanırız. <code>for</code> döngüsü listenin elemanlarını sırayla bir değişkene koyar ve altındaki kodu her eleman için bir kez çalıştırır.</p>
<pre><code>for deger in aylik_enf:
    print(deger)</code></pre>
<p><b>Koşul</b> ise “eğer … ise” kararıdır:</p>
<pre><code>if deger &gt; 3:
    print("yüksek")
elif deger &gt;= 2:
    print("orta")
else:
    print("düşük")</code></pre>
<ul>
<li>Satır sonundaki <code>:</code> ve alttaki satırların <b>girintili</b> yazılması zorunludur. Girinti, hangi satırların döngüye ya da koşula ait olduğunu gösterir. Standart biçim <b>4 boşluktur</b>; bir bloktaki tüm satırlar aynı miktarda içeride olmalıdır.</li>
<li>Karşılaştırmalar: <code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code>, <code>==</code> (eşit mi?), <code>!=</code> (farklı mı?). Sonuç <code>True</code> ya da <code>False</code>'tur.</li>
<li><b>Biriktirme kalıbı:</b> döngüden önce <code>toplam = 0</code>, döngü içinde <code>toplam = toplam + deger</code>.</li>
</ul>
<div class="box econ"><b>İktisat örneği.</b> Aylık enflasyonlar <b>toplanmaz, çarpılır</b>: %3 ve %4'lük iki ay, %7 değil (1,03 × 1,04 − 1) = %7,12 eder. Bir döngüyle 12 ayın bileşik etkisini hesaplayacaksın.</div>`,
      en: `<p>When we want to do the same thing for every value in a series, we use a <b>loop</b>. A <code>for</code> loop puts the list's elements into a variable one at a time and runs the code below it once for each element.</p>
<pre><code>for value in monthly_inf:
    print(value)</code></pre>
<p>A <b>condition</b> is an “if … then” decision:</p>
<pre><code>if value &gt; 3:
    print("high")
elif value &gt;= 2:
    print("medium")
else:
    print("low")</code></pre>
<ul>
<li>The <code>:</code> at the end of the line and <b>indenting</b> the lines below it are required. Indentation shows which lines belong to the loop or condition. The standard is <b>4 spaces</b>; all lines in a block must be indented by the same amount.</li>
<li>Comparisons: <code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code>, <code>==</code> (equal?), <code>!=</code> (different?). The result is <code>True</code> or <code>False</code>.</li>
<li><b>Accumulator pattern:</b> before the loop <code>total = 0</code>, inside it <code>total = total + value</code>.</li>
</ul>
<div class="box econ"><b>Economics example.</b> Monthly inflation rates are <b>multiplied, not added</b>: two months of 3% and 4% give (1.03 × 1.04 − 1) = 7.12%, not 7%. You will compute the compound effect of 12 months with a loop.</div>`
    },
    playground: {
      type: "loopFilter",
      intro: { tr: "Hedef çizgisini kaydır ve hangi ayların koşulu sağladığını gör. Sonra döngüyü tur tur ilerleterek Python'un her ay için verdiği kararı izle.", en: "Move the target line and see which months meet the condition. Then step through the loop to watch the decision Python makes for each month." },
      name: { tr: "aylik_enf", en: "monthly_inf" },
      var: { tr: "deger", en: "value" },
      thrName: { tr: "hedef", en: "target" },
      values: MONTHLY,
      labels: MONTHS,
      threshold: 3.0,
      takeaway: { tr: "Döngü her elemanı sırayla ziyaret eder; if, her ziyarette True/False kararı verir.", en: "A loop visits each element in turn; if makes a True/False decision at each visit." }
    },
    cells: [
      {
        id: "m0-l4-c1", kind: "run",
        task: { tr: "Listedeki her ayı sırayla yazdır.", en: "Print each month of the list in turn." },
        code: { tr: "aylik_enf = " + MLIST + "\nfor deger in aylik_enf:\n    print(deger)", en: "monthly_inf = " + MLIST + "\nfor value in monthly_inf:\n    print(value)" }
      },
      {
        id: "m0-l4-c2", kind: "run",
        task: { tr: "Döngüye bir koşul ekleyelim: yalnızca hedefin üstündeki aylar yazılsın.", en: "Add a condition to the loop: print only the months above the target." },
        predict: {
          q: { tr: "Bu kod kaç satır yazdırır?", en: "How many lines does this code print?" },
          options: { tr: ["3", "4", "5"], en: ["3", "4", "5"] },
          answer: 1,
          explain: { tr: "3.0'dan büyük değerler: 3.2, 4.5, 3.4, 3.2. Tam 3.0 olan ay koşulu sağlamaz çünkü <code>&gt;</code> “büyüktür” demektir, “büyük eşit” değil.", en: "Values above 3.0: 3.2, 4.5, 3.4, 3.2. The month at exactly 3.0 does not qualify because <code>&gt;</code> means “greater than”, not “greater than or equal”." }
        },
        code: { tr: 'hedef = 3.0\nfor deger in aylik_enf:\n    if deger > hedef:\n        print(deger, "hedefin üstünde")', en: 'target = 3.0\nfor value in monthly_inf:\n    if value > target:\n        print(value, "above target")' }
      },
      {
        id: "m0-l4-c3", kind: "fill",
        task: { tr: "Hedefin üstünde kaç ay olduğunu say. Her uygun ayda sayaç kaç artmalı?", en: "Count how many months are above the target. By how much should the counter rise for each such month?" },
        code: { tr: "sayac = 0\nfor deger in aylik_enf:\n    if deger > hedef:\n        sayac = sayac + ___\nprint(sayac)", en: "counter = 0\nfor value in monthly_inf:\n    if value > target:\n        counter = counter + ___\nprint(counter)" },
        solution: { tr: "sayac = 0\nfor deger in aylik_enf:\n    if deger > hedef:\n        sayac = sayac + 1\nprint(sayac)", en: "counter = 0\nfor value in monthly_inf:\n    if value > target:\n        counter = counter + 1\nprint(counter)" },
        hints: [{ tr: "Saymak, her seferinde bir eklemek demektir.", en: "Counting means adding one each time." }],
        checks: [{ py: { tr: "sayac == sum(1 for d in aylik_enf if d > hedef)", en: "counter == sum(1 for d in monthly_inf if d > target)" }, msg: { tr: "Sayaç, hedefin üstündeki ay sayısına eşit olmalı. Her seferinde 1 ekliyor musun?", en: "The counter should equal the number of months above the target. Are you adding 1 each time?" } }]
      },
      {
        id: "m0-l4-c4", kind: "fill",
        task: { tr: "Her ayı etiketle: 3'ten büyükse <code>\"yüksek\"</code>, 2 ile 3 arasındaysa (2 ≤ değer ≤ 3) <code>\"orta\"</code>, değilse <code>\"düşük\"</code>. İki boşluğu doldur.", en: "Label each month: above 3 is <code>\"high\"</code>, between 2 and 3 (2 ≤ value ≤ 3) is <code>\"medium\"</code>, otherwise <code>\"low\"</code>. Fill the two blanks." },
        code: { tr: 'etiketler = []\nfor deger in aylik_enf:\n    if deger > 3:\n        etiketler.append("yüksek")\n    elif deger >= 2:\n        etiketler.append(___)\n    else:\n        etiketler.append(___)\nprint(etiketler)', en: 'labels = []\nfor value in monthly_inf:\n    if value > 3:\n        labels.append("high")\n    elif value >= 2:\n        labels.append(___)\n    else:\n        labels.append(___)\nprint(labels)' },
        solution: { tr: 'etiketler = []\nfor deger in aylik_enf:\n    if deger > 3:\n        etiketler.append("yüksek")\n    elif deger >= 2:\n        etiketler.append("orta")\n    else:\n        etiketler.append("düşük")\nprint(etiketler)', en: 'labels = []\nfor value in monthly_inf:\n    if value > 3:\n        labels.append("high")\n    elif value >= 2:\n        labels.append("medium")\n    else:\n        labels.append("low")\nprint(labels)' },
        hints: [{ tr: "Metinler tırnak içinde yazılır: <code>\"orta\"</code>.", en: "Text goes inside quotes: <code>\"medium\"</code>." }],
        checks: [{ py: { tr: 'etiketler == ["yüksek" if d > 3 else ("orta" if d >= 2 else "düşük") for d in aylik_enf]', en: 'labels == ["high" if d > 3 else ("medium" if d >= 2 else "low") for d in monthly_inf]' }, msg: { tr: "Etiketler beklenenle uyuşmuyor. Yazımı kontrol et: <code>\"orta\"</code> ve <code>\"düşük\"</code>.", en: "The labels do not match. Check the spelling: <code>\"medium\"</code> and <code>\"low\"</code>." } }],
        after: { tr: "Burada sınıflandırma kuralını sen elle yazdın. Makine öğrenmesinde bu tür kuralları bilgisayar veriden kendisi öğrenir; bunu ilerideki modüllerde göreceksin.", en: "Here you wrote the classification rule by hand. In machine learning the computer learns such rules from data by itself; you will see this in later modules." }
      },
      {
        id: "m0-l4-c5", kind: "fill",
        task: { tr: "Yıllık bileşik enflasyonu hesapla. Fiyat endeksini 100'den başlat; her ay endeksi <code>(1 + aylık oran / 100)</code> ile çarp.", en: "Compute compound annual inflation. Start the price index at 100; each month multiply it by <code>(1 + monthly rate / 100)</code>." },
        code: { tr: 'endeks = 100\nfor deger in aylik_enf:\n    endeks = endeks * (1 + ___ / 100)\n\nprint("Bileşik yıllık enflasyon (%):", round(endeks - 100, 1))\nprint("Basit toplam (yanlış yöntem):", round(sum(aylik_enf), 1))', en: 'index = 100\nfor value in monthly_inf:\n    index = index * (1 + ___ / 100)\n\nprint("Compound annual inflation (%):", round(index - 100, 1))\nprint("Simple sum (wrong method):", round(sum(monthly_inf), 1))' },
        solution: { tr: 'endeks = 100\nfor deger in aylik_enf:\n    endeks = endeks * (1 + deger / 100)\n\nprint("Bileşik yıllık enflasyon (%):", round(endeks - 100, 1))\nprint("Basit toplam (yanlış yöntem):", round(sum(aylik_enf), 1))', en: 'index = 100\nfor value in monthly_inf:\n    index = index * (1 + value / 100)\n\nprint("Compound annual inflation (%):", round(index - 100, 1))\nprint("Simple sum (wrong method):", round(sum(monthly_inf), 1))' },
        hints: [{ tr: "Her turda o ayın değeri döngü değişkeninde duruyor.", en: "In each turn, that month's value is in the loop variable." }, { tr: "<code>___</code> yerine <code>deger</code> yaz.", en: "Replace <code>___</code> with <code>value</code>." }],
        checks: [{ py: { tr: "abs(endeks - 100 * __import__('math').prod(1 + d / 100 for d in aylik_enf)) < 1e-6", en: "abs(index - 100 * __import__('math').prod(1 + d / 100 for d in monthly_inf)) < 1e-6" }, msg: { tr: "Endeks beklenen değerle uyuşmuyor. Çarpanın içinde döngü değişkenini kullandın mı?", en: "The index does not match the expected value. Did you use the loop variable inside the factor?" } }],
        after: { tr: "Bileşik oran basit toplamdan büyüktür, çünkü her ayın artışı bir önceki ayın yükselmiş fiyatı üzerine gelir.", en: "The compound rate exceeds the simple sum because each month's rise applies to the already higher price." }
      }
    ],
    quiz: [
      {
        q: { tr: "Python bir satırın <code>for</code> döngüsünün içinde olduğunu nereden anlar?", en: "How does Python know a line is inside a <code>for</code> loop?" },
        options: { tr: ["Satır sonundaki noktalı virgülden", "Satırın girintisinden (içeride olmasından)", "Satırın rengi farklı olduğundan"], en: ["From a semicolon at the end", "From the line's indentation", "From the line's colour"] },
        answer: 1,
        explain: { tr: "Python'da bloklar girintiyle belirlenir; döngüye ait satırlar aynı miktarda içeride yazılır.", en: "In Python, blocks are defined by indentation; lines in the loop are indented by the same amount." }
      },
      {
        q: { tr: "Aşağıdaki kod çalıştıktan sonra <code>toplam</code> kaçtır?", en: "What is <code>total</code> after the code below runs?" },
        code: { tr: "toplam = 0\nfor x in [1, 2, 3]:\n    toplam = toplam + x", en: "total = 0\nfor x in [1, 2, 3]:\n    total = total + x" },
        options: { tr: ["3", "6", "0"], en: ["3", "6", "0"] },
        answer: 1,
        explain: { tr: "0 + 1 + 2 + 3 = 6. Bu, biriktirme kalıbıdır.", en: "0 + 1 + 2 + 3 = 6. This is the accumulator pattern." }
      },
      {
        q: { tr: "Aylık %2'lik enflasyon 12 ay sürerse yıllık enflasyon nedir?", en: "If monthly inflation is 2% for 12 months, what is annual inflation?" },
        options: { tr: ["Tam %24", "%24'ten biraz fazla (yaklaşık %26,8)", "%24'ten az"], en: ["Exactly 24%", "A bit more than 24% (about 26.8%)", "Less than 24%"] },
        answer: 1,
        explain: { tr: "1,02¹² − 1 ≈ 0,268. Bileşik etki nedeniyle basit toplamdan büyüktür.", en: "1.02¹² − 1 ≈ 0.268. Compounding makes it larger than the simple sum." }
      }
    ]
  });

  /* ------------------------------------------------------------------- */
  /* Ders 5 — Fonksiyonlar                                                */
  /* ------------------------------------------------------------------- */
  lessons.push({
    id: "m0-l5",
    minutes: 18,
    title: { tr: "Fonksiyonlar: kendi aracını yazmak", en: "Functions: writing your own tools" },
    blurb: { tr: "def, parametre, return; print ile return farkı; varsayılan değerler.", en: "def, parameters, return; print vs. return; default values." },
    terms: [{ tr: "fonksiyon", en: "function" }, { tr: "parametre", en: "parameter" }, { tr: "döndürmek", en: "return" }, { tr: "çağırmak", en: "call" }],
    concept: {
      tr: `<p>Aynı hesabı defalarca yapıyorsan onu bir <b>fonksiyona</b> dönüştür. Fonksiyon bir makine gibidir: girdileri (<b>parametreler</b>) alır, bir işlem yapar ve bir sonucu <b>döndürür</b>.</p>
<pre><code>def buyume_orani(eski, yeni):
    return (yeni - eski) / eski * 100

buyume_orani(1000, 1050)   # 5.0</code></pre>
<ul>
<li><code>def</code> fonksiyonu tanımlar; parantez içindekiler parametrelerdir. Gövde 4 boşluk girintilidir.</li>
<li><code>return</code> sonucu fonksiyonun dışına verir. Böylece sonucu bir değişkene atayabilir, başka hesaplarda kullanabilirsin.</li>
<li><code>print</code> yalnızca ekrana yazar; değeri geri vermez. <code>return</code> içermeyen bir fonksiyon <code>None</code> (“hiçbir şey”) döndürür.</li>
<li>Parametreye varsayılan değer verebilirsin: <code>def bilesik(oran, ay=12)</code>. Çağırırken <code>ay</code>'ı yazmazsan 12 kabul edilir.</li>
<li>Şimdiye kadar kullandığın <code>print</code>, <code>len</code>, <code>sum</code>, <code>round</code> da fonksiyondur; onları başkaları yazmıştır.</li>
</ul>
<div class="box econ"><b>Neden önemli?</b> Makine öğrenmesi kütüphaneleri de fonksiyonlardan oluşur. Bir modeli “eğitmek” ya da “tahmin almak” birer fonksiyon çağrısıdır. Fonksiyon mantığını anlamak, bu araçları anlamanın ilk adımıdır.</div>`,
      en: `<p>If you do the same calculation again and again, turn it into a <b>function</b>. A function is like a machine: it takes inputs (<b>parameters</b>), does some work and <b>returns</b> a result.</p>
<pre><code>def growth_rate(old, new):
    return (new - old) / old * 100

growth_rate(1000, 1050)   # 5.0</code></pre>
<ul>
<li><code>def</code> defines the function; the names in brackets are its parameters. The body is indented by 4 spaces.</li>
<li><code>return</code> hands the result back out of the function, so you can store it in a variable and use it elsewhere.</li>
<li><code>print</code> only writes to the screen; it does not hand a value back. A function without <code>return</code> returns <code>None</code> (“nothing”).</li>
<li>A parameter can have a default value: <code>def compound(rate, months=12)</code>. If you leave out <code>months</code>, 12 is used.</li>
<li><code>print</code>, <code>len</code>, <code>sum</code> and <code>round</code>, which you have already used, are functions too; someone else wrote them.</li>
</ul>
<div class="box econ"><b>Why it matters.</b> Machine learning libraries are made of functions. “Training” a model or “getting predictions” is a function call. Understanding functions is the first step to understanding these tools.</div>`
    },
    playground: {
      type: "funcMachine",
      intro: { tr: "Bir fonksiyon seç, girdilerini kaydırıcılarla değiştir ve makinenin döndürdüğü sonucu izle.", en: "Pick a function, change its inputs with the sliders and watch what the machine returns." },
      funcs: [
        {
          name: { tr: "buyume_orani", en: "growth_rate" },
          params: [{ name: { tr: "eski", en: "old" }, min: 500, max: 1500, step: 10, val: 1000 }, { name: { tr: "yeni", en: "new" }, min: 500, max: 1500, step: 10, val: 1050 }],
          code: { tr: "def buyume_orani(eski, yeni):\n    return (yeni - eski) / eski * 100", en: "def growth_rate(old, new):\n    return (new - old) / old * 100" },
          f: (a, b) => (b - a) / a * 100,
          note: { tr: "Aynı mutlak artış (örneğin +50), küçük bir tabanda daha büyük bir yüzde değişim demektir.", en: "The same absolute rise (e.g. +50) means a larger percentage change on a smaller base." }
        },
        {
          name: { tr: "reel_faiz", en: "real_rate" },
          params: [{ name: { tr: "nominal", en: "nominal" }, min: 0, max: 80, step: 1, val: 50 }, { name: { tr: "enflasyon", en: "inflation" }, min: 0, max: 80, step: 1, val: 40 }],
          code: { tr: "def reel_faiz(nominal, enflasyon):\n    return ((1 + nominal / 100) / (1 + enflasyon / 100) - 1) * 100", en: "def real_rate(nominal, inflation):\n    return ((1 + nominal / 100) / (1 + inflation / 100) - 1) * 100" },
          f: (i, p) => ((1 + i / 100) / (1 + p / 100) - 1) * 100,
          note: { tr: "Enflasyon nominal faizi aşınca reel faiz negatife döner. Yaklaşık formül (i − π) ile karşılaştır: enflasyon yükseldikçe fark açılır.", en: "When inflation exceeds the nominal rate, the real rate turns negative. Compare with the shortcut (i − π): the gap widens as inflation rises." }
        },
        {
          name: { tr: "bilesik", en: "compound" },
          params: [{ name: { tr: "oran", en: "rate" }, min: 0, max: 10, step: 0.1, val: 2 }, { name: { tr: "ay", en: "months" }, min: 1, max: 36, step: 1, val: 12 }],
          code: { tr: "def bilesik(oran, ay=12):\n    return ((1 + oran / 100) ** ay - 1) * 100", en: "def compound(rate, months=12):\n    return ((1 + rate / 100) ** months - 1) * 100" },
          f: (r, m) => (Math.pow(1 + r / 100, m) - 1) * 100,
          note: { tr: "Aylık sabit bir oranın birikimli etkisi. <code>ay=12</code> varsayılan değerdir; çağrıda yazmazsan 12 ay kabul edilir.", en: "The cumulative effect of a constant monthly rate. <code>months=12</code> is a default; leave it out and 12 months is assumed." }
        }
      ],
      takeaway: { tr: "Fonksiyon = isimli, tekrar kullanılabilir hesap. Girdiyi değiştir, aynı kural yeni sonucu üretir.", en: "A function is a named, reusable calculation. Change the input and the same rule gives the new result." }
    },
    cells: [
      {
        id: "m0-l5-c1", kind: "run",
        task: { tr: "Bir fonksiyon tanımla ve iki farklı girdiyle çağır.", en: "Define a function and call it with two different inputs." },
        code: { tr: "def buyume_orani(eski, yeni):\n    return (yeni - eski) / eski * 100\n\nprint(buyume_orani(1000, 1050))\nprint(buyume_orani(80, 100))", en: "def growth_rate(old, new):\n    return (new - old) / old * 100\n\nprint(growth_rate(1000, 1050))\nprint(growth_rate(80, 100))" }
      },
      {
        id: "m0-l5-c2", kind: "run",
        task: { tr: "<code>print</code> ile <code>return</code> arasındaki farkı gör.", en: "See the difference between <code>print</code> and <code>return</code>." },
        predict: {
          q: { tr: "Bu kod hangi iki satırı yazdırır?", en: "Which two lines does this code print?" },
          options: { tr: ["16 ve 16", "16 ve None", "Hata verir"], en: ["16 and 16", "16 and None", "It gives an error"] },
          answer: 1,
          explain: { tr: "Fonksiyon 16'yı ekrana yazar ama <code>return</code> olmadığı için hiçbir değer döndürmez. <code>sonuc</code>'a <code>None</code> atanır.", en: "The function prints 16 but has no <code>return</code>, so it hands back nothing. <code>result</code> gets <code>None</code>." }
        },
        code: { tr: "def kare_yazdir(x):\n    print(x ** 2)\n\nsonuc = kare_yazdir(4)\nprint(sonuc)", en: "def print_square(x):\n    print(x ** 2)\n\nresult = print_square(4)\nprint(result)" }
      },
      {
        id: "m0-l5-c3", kind: "fill",
        task: { tr: "Fisher reel faiz fonksiyonunu tamamla. Sonucu yüzde olarak döndürmesi için neyle çarpmalısın?", en: "Complete the Fisher real-rate function. What should you multiply by so it returns a percentage?" },
        code: { tr: "def reel_faiz(nominal, enflasyon):\n    return ((1 + nominal / 100) / (1 + enflasyon / 100) - 1) * ___\n\nprint(round(reel_faiz(50, 40), 2))\nprint(round(reel_faiz(10, 25), 2))", en: "def real_rate(nominal, inflation):\n    return ((1 + nominal / 100) / (1 + inflation / 100) - 1) * ___\n\nprint(round(real_rate(50, 40), 2))\nprint(round(real_rate(10, 25), 2))" },
        solution: { tr: "def reel_faiz(nominal, enflasyon):\n    return ((1 + nominal / 100) / (1 + enflasyon / 100) - 1) * 100\n\nprint(round(reel_faiz(50, 40), 2))\nprint(round(reel_faiz(10, 25), 2))", en: "def real_rate(nominal, inflation):\n    return ((1 + nominal / 100) / (1 + inflation / 100) - 1) * 100\n\nprint(round(real_rate(50, 40), 2))\nprint(round(real_rate(10, 25), 2))" },
        hints: [{ tr: "Oranı yüzdeye çevirmek için 100 ile çarparız.", en: "To turn a ratio into a percentage, multiply by 100." }],
        checks: [
          { py: { tr: "abs(reel_faiz(50, 40) - 7.142857) < 0.01", en: "abs(real_rate(50, 40) - 7.142857) < 0.01" }, msg: { tr: "<code>reel_faiz(50, 40)</code> yaklaşık 7.14 döndürmeli.", en: "<code>real_rate(50, 40)</code> should return about 7.14." } },
          { py: { tr: "abs(reel_faiz(10, 10)) < 1e-9", en: "abs(real_rate(10, 10)) < 1e-9" }, msg: { tr: "Nominal faiz enflasyona eşitse reel faiz 0 olmalı.", en: "If the nominal rate equals inflation, the real rate should be 0." } }
        ],
        after: { tr: "İkinci satır negatif çıktı: enflasyon nominal faizden yüksekse tasarruf sahibi reel olarak kaybeder.", en: "The second line is negative: when inflation exceeds the nominal rate, savers lose in real terms." }
      },
      {
        id: "m0-l5-c4", kind: "fill",
        task: { tr: "Bir listenin ortalamasını döndüren <code>ortalama</code> fonksiyonunu yaz. (İpucu: toplam bölü eleman sayısı.) Giriş koşulu: liste <b>boş olmamalı</b>; boş listede <code>len</code> 0 olur ve sıfıra bölme hatası (<code>ZeroDivisionError</code>) alırsın.", en: "Write a function <code>mean</code> that returns the average of a list. (Hint: total divided by the number of elements.) Precondition: the list must <b>not be empty</b>; for an empty list <code>len</code> is 0 and you get a division-by-zero error (<code>ZeroDivisionError</code>)." },
        code: { tr: "def ortalama(liste):\n    return ___\n\nprint(ortalama([2, 4, 6]))\nprint(ortalama([3.2, 4.5, 2.9]))", en: "def mean(values):\n    return ___\n\nprint(mean([2, 4, 6]))\nprint(mean([3.2, 4.5, 2.9]))" },
        solution: { tr: "def ortalama(liste):\n    return sum(liste) / len(liste)\n\nprint(ortalama([2, 4, 6]))\nprint(ortalama([3.2, 4.5, 2.9]))", en: "def mean(values):\n    return sum(values) / len(values)\n\nprint(mean([2, 4, 6]))\nprint(mean([3.2, 4.5, 2.9]))" },
        hints: [{ tr: "Listeler dersinde kullandığın iki fonksiyonu hatırla: <code>sum</code> ve <code>len</code>.", en: "Remember the two functions from the lists lesson: <code>sum</code> and <code>len</code>." }, { tr: "<code>return sum(liste) / len(liste)</code>", en: "<code>return sum(values) / len(values)</code>" }],
        checks: [
          { py: { tr: "ortalama([2, 4, 6]) == 4", en: "mean([2, 4, 6]) == 4" }, msg: { tr: "<code>ortalama([2, 4, 6])</code> 4 döndürmeli.", en: "<code>mean([2, 4, 6])</code> should return 4." } },
          { py: { tr: "ortalama([1, 2]) == 1.5 and ortalama([10]) == 10", en: "mean([1, 2]) == 1.5 and mean([10]) == 10" }, msg: { tr: "Fonksiyon her liste için çalışmalı; sayıları elle yazma, parametreyi kullan.", en: "The function must work for any list; use the parameter instead of fixed numbers." } }
        ]
      },
      {
        id: "m0-l5-c5", kind: "fill",
        task: { tr: "Varsayılan değerli bir fonksiyon: aylık sabit oranın <code>ay</code> sonundaki birikimli etkisi. Üs olarak neyi kullanmalısın?", en: "A function with a default value: the cumulative effect of a constant monthly rate after <code>months</code>. What should the exponent be?" },
        code: { tr: "def bilesik(oran, ay=12):\n    return ((1 + oran / 100) ** ___ - 1) * 100\n\nprint(round(bilesik(2), 2))       # 12 ay (varsayılan)\nprint(round(bilesik(2, 6), 2))    # 6 ay", en: "def compound(rate, months=12):\n    return ((1 + rate / 100) ** ___ - 1) * 100\n\nprint(round(compound(2), 2))       # 12 months (default)\nprint(round(compound(2, 6), 2))    # 6 months" },
        solution: { tr: "def bilesik(oran, ay=12):\n    return ((1 + oran / 100) ** ay - 1) * 100\n\nprint(round(bilesik(2), 2))       # 12 ay (varsayılan)\nprint(round(bilesik(2, 6), 2))    # 6 ay", en: "def compound(rate, months=12):\n    return ((1 + rate / 100) ** months - 1) * 100\n\nprint(round(compound(2), 2))       # 12 months (default)\nprint(round(compound(2, 6), 2))    # 6 months" },
        hints: [{ tr: "Üs, ay sayısını tutan parametredir.", en: "The exponent is the parameter that holds the number of months." }],
        checks: [
          { py: { tr: "abs(bilesik(2) - (1.02 ** 12 - 1) * 100) < 1e-9", en: "abs(compound(2) - (1.02 ** 12 - 1) * 100) < 1e-9" }, msg: { tr: "<code>bilesik(2)</code> 12 aylık birikimi (≈ 26.82) vermeli.", en: "<code>compound(2)</code> should give the 12-month total (≈ 26.82)." } },
          { py: { tr: "abs(bilesik(2, 6) - (1.02 ** 6 - 1) * 100) < 1e-9", en: "abs(compound(2, 6) - (1.02 ** 6 - 1) * 100) < 1e-9" }, msg: { tr: "<code>bilesik(2, 6)</code> 6 aylık birikimi vermeli; üste sabit 12 değil, <code>ay</code> parametresini yaz.", en: "<code>compound(2, 6)</code> should give the 6-month total; use the <code>months</code> parameter, not a fixed 12." } }
        ]
      }
    ],
    quiz: [
      {
        q: { tr: "<code>return</code> içermeyen bir fonksiyon ne döndürür?", en: "What does a function without <code>return</code> return?" },
        options: { tr: ["0", "<code>None</code>", "Son yazdırdığı değeri"], en: ["0", "<code>None</code>", "The last value it printed"] },
        answer: 1,
        explain: { tr: "<code>return</code> yoksa fonksiyon <code>None</code> döndürür; ekrana yazdırmak bir değer döndürmek değildir.", en: "Without <code>return</code> a function returns <code>None</code>; printing is not returning." }
      },
      {
        q: { tr: "<code>def f(x, y=2): return x * y</code> için <code>f(5)</code> kaçtır?", en: "For <code>def f(x, y=2): return x * y</code>, what is <code>f(5)</code>?" },
        options: { tr: ["5", "10", "Hata"], en: ["5", "10", "Error"] },
        answer: 1,
        explain: { tr: "y verilmediği için varsayılan 2 kullanılır: 5 × 2 = 10.", en: "y is not given, so the default 2 is used: 5 × 2 = 10." }
      },
      {
        q: { tr: "Fonksiyon kullanmanın temel faydası nedir?", en: "What is the main benefit of using functions?" },
        options: { tr: ["Kodu daha hızlı çalıştırması", "Aynı hesabı tekrar yazmadan farklı girdilerle kullanabilmek", "Hataları otomatik düzeltmesi"], en: ["They make code run faster", "Reusing the same calculation with different inputs without rewriting it", "They fix errors automatically"] },
        answer: 1,
        explain: { tr: "Fonksiyon bir hesabı bir kez yazıp her yerde yeniden kullanmanı sağlar.", en: "A function lets you write a calculation once and reuse it anywhere." }
      }
    ]
  });

  /* ------------------------------------------------------------------- */
  /* Ders 6 — NumPy                                                       */
  /* ------------------------------------------------------------------- */
  lessons.push({
    id: "m0-l6",
    minutes: 18,
    packages: ["numpy"],
    title: { tr: "NumPy: hızlı sayısal hesap", en: "NumPy: fast numerical computing" },
    blurb: { tr: "Diziler, döngüsüz işlemler, maskeler ve tekrarlanabilir rastgele sayılar.", en: "Arrays, loop-free operations, masks and reproducible random numbers." },
    terms: [{ tr: "kütüphane", en: "library" }, { tr: "dizi", en: "array" }, { tr: "vektörel işlem", en: "vectorized operation" }, { tr: "maske", en: "boolean mask" }, { tr: "tohum", en: "seed" }],
    concept: {
      tr: `<p><b>Kütüphane</b>, başkalarının yazdığı hazır fonksiyonlar paketidir. <code>import numpy as np</code> satırı NumPy kütüphanesini <code>np</code> kısa adıyla kullanıma açar. NumPy, sayı dizileriyle hızlı hesap yapmanın standart aracıdır; ilerideki tüm makine öğrenmesi araçları onun üzerine kuruludur.</p>
<ul>
<li><code>np.array([...])</code> bir <b>dizi</b> oluşturur. Listeye benzer ama sayısal işlemler <b>tüm elemanlara birden</b> uygulanır: <code>fiyatlar * 1.10</code> her fiyata %10 zam yapar; döngü gerekmez.</li>
<li>Hazır istatistikler: <code>.mean()</code> ortalama, <code>.std()</code> standart sapma, <code>.min()</code>, <code>.max()</code>, <code>.sum()</code>.</li>
<li><b>Maske:</b> <code>fiyatlar &gt; 30</code> her eleman için True/False üretir; <code>fiyatlar[fiyatlar &gt; 30]</code> yalnızca koşulu sağlayanları seçer.</li>
<li><b>Rastgele sayılar ve tohum:</b> <code>rng = np.random.default_rng(42)</code> bir rastgele sayı üreteci kurar. Aynı tohum (42) her seferinde <b>aynı</b> “rastgele” sayıları üretir. Bu, sonuçların tekrarlanabilir olması için önemlidir; dersin notebook'larında sabit tohum kullanılmasının nedeni budur.</li>
</ul>
<div class="box econ"><b>İktisat örneği.</b> 250 işlem gününün getirisini simüle edip ortalama getiriyi ve oynaklığı (standart sapma) tek satırda hesaplayabilirsin.</div>`,
      en: `<p>A <b>library</b> is a package of ready-made functions written by others. The line <code>import numpy as np</code> makes the NumPy library available under the short name <code>np</code>. NumPy is the standard tool for fast computing with arrays of numbers; all the machine learning tools you will use later are built on it.</p>
<ul>
<li><code>np.array([...])</code> creates an <b>array</b>. It looks like a list, but arithmetic applies to <b>all elements at once</b>: <code>prices * 1.10</code> raises every price by 10%; no loop needed.</li>
<li>Ready-made statistics: <code>.mean()</code>, <code>.std()</code> (standard deviation), <code>.min()</code>, <code>.max()</code>, <code>.sum()</code>.</li>
<li><b>Mask:</b> <code>prices &gt; 30</code> gives True/False for each element; <code>prices[prices &gt; 30]</code> picks only those that meet the condition.</li>
<li><b>Random numbers and the seed:</b> <code>rng = np.random.default_rng(42)</code> creates a random number generator. The same seed (42) produces the <b>same</b> “random” numbers every time. This makes results reproducible, which is why the course notebooks use fixed seeds.</li>
</ul>
<div class="box econ"><b>Economics example.</b> You can simulate 250 trading days of returns and compute the mean return and volatility (standard deviation) in one line each.</div>`
    },
    playground: {
      type: "vector",
      intro: { tr: "Kesikli çizgili kutular ilk fiyatlar, mavi çubuklar işlemden sonraki fiyatlar. İşlemi ve sayıyı değiştir; tüm çubukların birlikte hareket ettiğini gör. Sonra maskeyi aç.", en: "Dashed boxes are the original prices, blue bars are the prices after the operation. Change the operation and number; all bars move together. Then switch on the mask." },
      name: { tr: "fiyatlar", en: "prices" },
      values: [20, 35, 50, 12, 80, 64],
      labels: { tr: ["Ekmek", "Süt", "Peynir", "Çay", "Kahve", "Zeytin"], en: ["Bread", "Milk", "Cheese", "Tea", "Coffee", "Olives"] },
      takeaway: { tr: "NumPy'da bir işlem dizinin tamamına birden uygulanır; maske ise koşulu sağlayan elemanları seçer.", en: "In NumPy an operation applies to the whole array at once; a mask picks the elements that meet a condition." }
    },
    cells: [
      {
        id: "m0-l6-c1", kind: "run",
        task: { tr: "NumPy'ı içe aktar, bir fiyat dizisi oluştur ve hepsine birden %10 zam yap. (İlk çalıştırmada kütüphanenin yüklenmesi birkaç saniye sürebilir.)", en: "Import NumPy, create a price array and raise all prices by 10% at once. (The first run may take a few seconds while the library loads.)" },
        code: { tr: "import numpy as np\n\nfiyatlar = np.array([20, 35, 50, 12, 80])\nprint(fiyatlar * 1.10)    # hepsine %10 zam, döngüsüz\nprint(fiyatlar.mean())", en: "import numpy as np\n\nprices = np.array([20, 35, 50, 12, 80])\nprint(prices * 1.10)    # 10% rise for all, no loop\nprint(prices.mean())" }
      },
      {
        id: "m0-l6-c2", kind: "run",
        task: { tr: "Liste ile dizi arasındaki farkı gör.", en: "See the difference between a list and an array." },
        predict: {
          q: { tr: "<code>np.array([1, 2, 3]) + np.array([10, 20, 30])</code> ne verir?", en: "What does <code>np.array([1, 2, 3]) + np.array([10, 20, 30])</code> give?" },
          options: { tr: ["[11 22 33]", "[1 2 3 10 20 30]", "Hata"], en: ["[11 22 33]", "[1 2 3 10 20 30]", "Error"] },
          answer: 0,
          explain: { tr: "Dizilerde <code>+</code> eleman eleman toplar. Listelerde ise <code>+</code> iki listeyi uç uca ekler (ikinci satıra bak).", en: "With arrays, <code>+</code> adds element by element. With lists, <code>+</code> joins the two lists end to end (see the second line)." }
        },
        code: { tr: "print(np.array([1, 2, 3]) + np.array([10, 20, 30]))\nprint([1, 2, 3] + [10, 20, 30])     # listelerde birleştirme", en: "print(np.array([1, 2, 3]) + np.array([10, 20, 30]))\nprint([1, 2, 3] + [10, 20, 30])     # lists are joined" }
      },
      {
        id: "m0-l6-c3", kind: "fill",
        task: { tr: "Maske kullanarak 30 TL'den pahalı ürünlerin fiyatlarını seç.", en: "Use a mask to select the prices above 30." },
        code: { tr: "pahali = fiyatlar[fiyatlar > ___]\nprint(pahali)\nprint(fiyatlar > 30)    # maskenin kendisi", en: "expensive = prices[prices > ___]\nprint(expensive)\nprint(prices > 30)    # the mask itself" },
        solution: { tr: "pahali = fiyatlar[fiyatlar > 30]\nprint(pahali)\nprint(fiyatlar > 30)    # maskenin kendisi", en: "expensive = prices[prices > 30]\nprint(expensive)\nprint(prices > 30)    # the mask itself" },
        hints: [{ tr: "Eşik değeri görevde yazıyor.", en: "The threshold is given in the task." }],
        checks: [{ py: { tr: "sorted(pahali.tolist()) == [35, 50, 80]", en: "sorted(expensive.tolist()) == [35, 50, 80]" }, msg: { tr: "Sonuç 35, 50 ve 80 olmalı.", en: "The result should be 35, 50 and 80." } }]
      },
      {
        id: "m0-l6-c4", kind: "edit",
        task: { tr: "250 günlük getiri simüle ediliyor (gerçek ortalama 0.5). <code>size</code>'ı <b>20000</b> yap ve çalıştır. Örneklem büyüyünce hesaplanan ortalama 0.5'e yaklaşıyor mu?", en: "We simulate 250 daily returns (true mean 0.5). Change <code>size</code> to <b>20000</b> and run. Does the computed mean get closer to 0.5 as the sample grows?" },
        code: { tr: "rng = np.random.default_rng(42)     # sabit tohum: hep aynı sayılar\ngetiriler = rng.normal(loc=0.5, scale=2.0, size=250)\n\nprint(len(getiriler))\nprint(\"Ortalama:\", round(getiriler.mean(), 3))\nprint(\"Std. sapma:\", round(getiriler.std(), 3))\n\n# karşılaştırma için hep 250 günlük örneklem\nilk_250 = np.random.default_rng(42).normal(loc=0.5, scale=2.0, size=250)\nprint(\"250 günle ortalama:\", round(ilk_250.mean(), 3))", en: "rng = np.random.default_rng(42)     # fixed seed: same numbers every time\nreturns = rng.normal(loc=0.5, scale=2.0, size=250)\n\nprint(len(returns))\nprint(\"Mean:\", round(returns.mean(), 3))\nprint(\"Std. dev.:\", round(returns.std(), 3))\n\n# a 250-day sample, kept for comparison\nfirst_250 = np.random.default_rng(42).normal(loc=0.5, scale=2.0, size=250)\nprint(\"Mean with 250 days:\", round(first_250.mean(), 3))" },
        solution: { tr: "rng = np.random.default_rng(42)     # sabit tohum: hep aynı sayılar\ngetiriler = rng.normal(loc=0.5, scale=2.0, size=20000)\n\nprint(len(getiriler))\nprint(\"Ortalama:\", round(getiriler.mean(), 3))\nprint(\"Std. sapma:\", round(getiriler.std(), 3))\n\n# karşılaştırma için hep 250 günlük örneklem\nilk_250 = np.random.default_rng(42).normal(loc=0.5, scale=2.0, size=250)\nprint(\"250 günle ortalama:\", round(ilk_250.mean(), 3))", en: "rng = np.random.default_rng(42)     # fixed seed: same numbers every time\nreturns = rng.normal(loc=0.5, scale=2.0, size=20000)\n\nprint(len(returns))\nprint(\"Mean:\", round(returns.mean(), 3))\nprint(\"Std. dev.:\", round(returns.std(), 3))\n\n# a 250-day sample, kept for comparison\nfirst_250 = np.random.default_rng(42).normal(loc=0.5, scale=2.0, size=250)\nprint(\"Mean with 250 days:\", round(first_250.mean(), 3))" },
        hints: [{ tr: "Önce olduğu gibi çalıştırıp sonucu not et, sonra <code>250</code> yerine <code>20000</code> yaz.", en: "Run it as it is first and note the result, then replace <code>250</code> with <code>20000</code>." }],
        checks: [{ py: { tr: "len(getiriler) == 20000", en: "len(returns) == 20000" }, msg: { tr: "Dizinin uzunluğu 20000 olmalı: <code>size=20000</code>.", en: "The array should have 20000 elements: <code>size=20000</code>." } }],
        after: { tr: "Son iki satır iki sonucu yan yana gösteriyor: 250 günle ortalama 0,403, 20000 günle 0,51; gerçek değer 0,5. Örneklem büyüdükçe örneklem ortalaması gerçek ortalamaya <b>yaklaşma eğilimindedir</b> (büyük sayılar yasası). Bu her tek denemede garanti değildir; garanti olan, büyük örneklemde sapmanın genellikle küçülmesidir. Tohumu değiştirmezsen sonuçlar herkeste aynı çıkar.", en: "The last two lines show the two results side by side: with 250 days the mean is 0.403, with 20000 days 0.51; the true value is 0.5. As the sample grows, the sample mean <b>tends to approach</b> the true mean (law of large numbers). This is not guaranteed in every single draw; what holds is that the deviation usually shrinks in large samples. If you keep the seed, everyone gets the same numbers." }
      },
      {
        id: "m0-l6-c5", kind: "fill",
        task: { tr: "Basit bir risk ölçüsü: getirinin negatif olduğu günlerin oranı. True değerlerinin ortalaması, True oranını verir. Karşılaştırma işlecini doldur.", en: "A simple risk measure: the share of days with a negative return. The mean of True values gives the share of Trues. Fill in the comparison operator." },
        code: { tr: "negatif_oran = (getiriler ___ 0).mean()\nprint(f\"Negatif günlerin oranı: {negatif_oran:.1%}\")", en: "negative_share = (returns ___ 0).mean()\nprint(f\"Share of negative days: {negative_share:.1%}\")" },
        solution: { tr: "negatif_oran = (getiriler < 0).mean()\nprint(f\"Negatif günlerin oranı: {negatif_oran:.1%}\")", en: "negative_share = (returns < 0).mean()\nprint(f\"Share of negative days: {negative_share:.1%}\")" },
        hints: [{ tr: "Negatif = sıfırdan küçük.", en: "Negative means less than zero." }, { tr: "<code>___</code> yerine <code>&lt;</code> yaz.", en: "Replace <code>___</code> with <code>&lt;</code>." }],
        checks: [{ py: { tr: "abs(negatif_oran - (getiriler < 0).mean()) < 1e-12", en: "abs(negative_share - (returns < 0).mean()) < 1e-12" }, msg: { tr: "Oran, sıfırdan küçük getirilerin payı olmalı.", en: "The share should be the proportion of returns below zero." } }],
        after: { tr: "<code>{x:.1%}</code> biçimi sayıyı tek ondalıklı yüzde olarak yazar.", en: "The <code>{x:.1%}</code> format prints a number as a percentage with one decimal." }
      }
    ],
    quiz: [
      {
        q: { tr: "<code>np.array([10, 20, 30]) * 2</code> ne verir?", en: "What does <code>np.array([10, 20, 30]) * 2</code> give?" },
        options: { tr: ["[20 40 60]", "[10 20 30 10 20 30]", "60"], en: ["[20 40 60]", "[10 20 30 10 20 30]", "60"] },
        answer: 0,
        explain: { tr: "NumPy işlemi her elemana uygular. (Bir liste 2 ile çarpılsaydı kendini tekrar ederdi.)", en: "NumPy applies the operation to each element. (A list times 2 would repeat itself.)" }
      },
      {
        q: { tr: "<code>x[x &gt; 0]</code> ne yapar?", en: "What does <code>x[x &gt; 0]</code> do?" },
        options: { tr: ["Pozitif elemanları seçer", "Tüm elemanları 0 yapar", "x'in pozitif olup olmadığını yazar"], en: ["Selects the positive elements", "Sets all elements to 0", "Prints whether x is positive"] },
        answer: 0,
        explain: { tr: "<code>x &gt; 0</code> bir maske üretir; köşeli parantez içinde kullanılınca True olan elemanlar seçilir.", en: "<code>x &gt; 0</code> creates a mask; inside square brackets it selects the elements marked True." }
      },
      {
        q: { tr: "Rastgele sayı üretirken sabit bir tohum (seed) neden kullanılır?", en: "Why use a fixed seed when generating random numbers?" },
        options: { tr: ["Sayıları daha rastgele yapmak için", "Aynı sonuçları tekrar elde edebilmek için", "Kodu hızlandırmak için"], en: ["To make the numbers more random", "To be able to reproduce the same results", "To make the code faster"] },
        answer: 1,
        explain: { tr: "Aynı tohum aynı sayı dizisini üretir; böylece analiz herkes tarafından tekrarlanabilir.", en: "The same seed gives the same sequence, so anyone can reproduce the analysis." }
      }
    ]
  });

  /* ------------------------------------------------------------------- */
  /* Ders 7 — pandas                                                      */
  /* ------------------------------------------------------------------- */
  lessons.push({
    id: "m0-l7",
    minutes: 20,
    packages: ["numpy", "pandas"],
    title: { tr: "pandas: veri tablolarıyla çalışmak", en: "pandas: working with data tables" },
    blurb: { tr: "DataFrame, sütun seçme, özet istatistik, filtreleme ve yeni sütun.", en: "DataFrames, selecting columns, summary statistics, filtering and new columns." },
    terms: [{ tr: "veri çerçevesi", en: "DataFrame" }, { tr: "gözlem (satır)", en: "observation (row)" }, { tr: "değişken (sütun)", en: "variable (column)" }, { tr: "filtre", en: "filter" }],
    concept: {
      tr: `<p>Gerçek veriler genellikle bir tablo hâlindedir: her <b>satır</b> bir gözlem (bir yıl, bir il, bir firma), her <b>sütun</b> bir değişkendir (büyüme, enflasyon, işsizlik). Python'da tablolarla çalışmanın standart aracı <b>pandas</b>, tablonun kendisi ise <b>DataFrame</b>'dir. Excel'deki bir çalışma sayfasına benzer, ama her işlem kodla ve tekrarlanabilir biçimde yapılır.</p>
<ul>
<li><code>import pandas as pd</code> ile kütüphaneyi açarız. <code>pd.DataFrame({...})</code> bir sözlükten tablo kurar: anahtarlar sütun adları, listeler sütun değerleridir.</li>
<li><code>veri.shape</code> (satır, sütun) sayısını; <code>veri.head()</code> ilk satırları; <code>veri.describe()</code> her sütunun özet istatistiklerini verir.</li>
<li>Sütun seçmek: <code>veri["enflasyon"]</code>. Bir sütunun ortalaması: <code>veri["enflasyon"].mean()</code>.</li>
<li>Filtrelemek: <code>veri[veri["enflasyon"] &gt; 10]</code>. NumPy'daki maske mantığının aynısıdır.</li>
<li>Yeni sütun: <code>veri["reel_faiz"] = veri["faiz"] - veri["enflasyon"]</code>. İşlem tüm satırlara birden uygulanır.</li>
</ul>
<div class="box">Bu derste kullanılan “Örnekistan” verisi tamamen <b>kurgusaldır</b>; gerçek bir ülkeyi temsil etmez.</div>`,
      en: `<p>Real data usually come as a table: each <b>row</b> is an observation (a year, a region, a firm), each <b>column</b> is a variable (growth, inflation, unemployment). The standard Python tool for tables is <b>pandas</b>, and the table itself is a <b>DataFrame</b>. It resembles a spreadsheet, but every step is done in code and can be repeated.</p>
<ul>
<li><code>import pandas as pd</code> loads the library. <code>pd.DataFrame({...})</code> builds a table from a dictionary: keys are column names, lists are column values.</li>
<li><code>data.shape</code> gives the number of (rows, columns); <code>data.head()</code> the first rows; <code>data.describe()</code> summary statistics for each column.</li>
<li>Select a column: <code>data["inflation"]</code>. Its mean: <code>data["inflation"].mean()</code>.</li>
<li>Filter: <code>data[data["inflation"] &gt; 10]</code>. It is the same mask idea as in NumPy.</li>
<li>New column: <code>data["real_rate"] = data["rate"] - data["inflation"]</code>. The operation applies to all rows at once.</li>
</ul>
<div class="box">The “Exampleland” data in this lesson are entirely <b>fictional</b> and do not represent a real country.</div>`
    },
    playground: {
      type: "tableBuilder",
      intro: { tr: "Sütun seç, filtre ve sıralama ekle. Her seçim, solda ona karşılık gelen pandas kodunu üretir.", en: "Pick columns, add a filter and a sort. Each choice produces the matching pandas code on the left." },
      data: MACRO,
      takeaway: { tr: "pandas'ta tablo işlemleri kısa ve okunur komutlardır: sütun seç, koşulla filtrele, sırala.", en: "In pandas, table operations are short, readable commands: select columns, filter by a condition, sort." }
    },
    cells: [
      {
        id: "m0-l7-c1", kind: "run",
        task: { tr: "Kurgusal makro veriyle bir DataFrame oluştur. Son satırda yalnızca tablonun adı var: hücrenin son satırındaki ifade otomatik olarak gösterilir.", en: "Build a DataFrame from the fictional macro data. The last line is just the table's name: the expression on a cell's last line is displayed automatically." },
        code: { tr: "import pandas as pd\n\n" + MACRO_PY.tr + "\nveri", en: "import pandas as pd\n\n" + MACRO_PY.en + "\ndata" }
      },
      {
        id: "m0-l7-c2", kind: "run",
        task: { tr: "Tablonun boyutuna ve özet istatistiklerine bak.", en: "Look at the table's size and summary statistics." },
        predict: {
          q: { tr: "<code>veri.shape</code> ne yazdırır?", en: "What does <code>data.shape</code> print?" },
          options: { tr: ["(5, 10)", "(10, 5)", "50"], en: ["(5, 10)", "(10, 5)", "50"] },
          answer: 1,
          explain: { tr: "<code>shape</code> önce satır, sonra sütun sayısını verir: 10 yıl (satır), 5 değişken (sütun).", en: "<code>shape</code> gives rows first, then columns: 10 years (rows), 5 variables (columns)." }
        },
        code: { tr: "print(veri.shape)\nveri.describe().round(2)", en: "print(data.shape)\ndata.describe().round(2)" }
      },
      {
        id: "m0-l7-c3", kind: "fill",
        task: { tr: "Enflasyon sütununun ortalamasını hesapla. Sütun adını tırnak içinde yaz.", en: "Compute the mean of the inflation column. Write the column name in quotes." },
        code: { tr: 'ort_enf = veri["___"].mean()\nprint(round(ort_enf, 2))', en: 'avg_inf = data["___"].mean()\nprint(round(avg_inf, 2))' },
        solution: { tr: 'ort_enf = veri["enflasyon"].mean()\nprint(round(ort_enf, 2))', en: 'avg_inf = data["inflation"].mean()\nprint(round(avg_inf, 2))' },
        hints: [{ tr: "Sütun adları: yil, buyume, enflasyon, faiz, issizlik.", en: "Column names: year, growth, inflation, rate, unemployment." }],
        checks: [{ py: { tr: 'abs(ort_enf - veri["enflasyon"].mean()) < 1e-9', en: 'abs(avg_inf - data["inflation"].mean()) < 1e-9' }, msg: { tr: "Ortalama enflasyon sütunundan hesaplanmalı (KeyError aldıysan sütun adını kontrol et).", en: "The mean should come from the inflation column (if you got a KeyError, check the column name)." } }]
      },
      {
        id: "m0-l7-c4", kind: "fill",
        task: { tr: "Enflasyonun %15'in üzerinde olduğu yılları filtrele.", en: "Filter the years with inflation above 15%." },
        code: { tr: 'yuksek = veri[veri["enflasyon"] > ___]\nyuksek', en: 'high = data[data["inflation"] > ___]\nhigh' },
        solution: { tr: 'yuksek = veri[veri["enflasyon"] > 15]\nyuksek', en: 'high = data[data["inflation"] > 15]\nhigh' },
        hints: [{ tr: "Eşik görevde yazıyor; yüzde işareti olmadan sayı olarak yaz.", en: "The threshold is in the task; write it as a number without the % sign." }],
        checks: [{ py: { tr: 'yuksek.equals(veri[veri["enflasyon"] > 15])', en: 'high.equals(data[data["inflation"] > 15])' }, msg: { tr: "Sonuç, enflasyonu 15'ten büyük olan satırları içermeli (3 yıl).", en: "The result should contain the rows with inflation above 15 (3 years)." } }]
      },
      {
        id: "m0-l7-c5", kind: "fill",
        task: { tr: "Yaklaşık reel faiz sütunu ekle: faiz − enflasyon. Sonra reel faizin negatif olduğu yılları say.", en: "Add an approximate real rate column: rate − inflation. Then count the years with a negative real rate." },
        code: { tr: 'veri["reel_faiz"] = veri["faiz"] - veri["___"]\nprint("Negatif reel faizli yıl sayısı:", (veri["reel_faiz"] < 0).sum())\nveri[["yil", "faiz", "enflasyon", "reel_faiz"]]', en: 'data["real_rate"] = data["rate"] - data["___"]\nprint("Years with a negative real rate:", (data["real_rate"] < 0).sum())\ndata[["year", "rate", "inflation", "real_rate"]]' },
        solution: { tr: 'veri["reel_faiz"] = veri["faiz"] - veri["enflasyon"]\nprint("Negatif reel faizli yıl sayısı:", (veri["reel_faiz"] < 0).sum())\nveri[["yil", "faiz", "enflasyon", "reel_faiz"]]', en: 'data["real_rate"] = data["rate"] - data["inflation"]\nprint("Years with a negative real rate:", (data["real_rate"] < 0).sum())\ndata[["year", "rate", "inflation", "real_rate"]]' },
        hints: [{ tr: "Reel faiz = nominal faiz − enflasyon.", en: "Real rate = nominal rate − inflation." }],
        checks: [{ py: { tr: '"reel_faiz" in veri.columns and ((veri["reel_faiz"] - (veri["faiz"] - veri["enflasyon"])).abs() < 1e-9).all()', en: '"real_rate" in data.columns and ((data["real_rate"] - (data["rate"] - data["inflation"])).abs() < 1e-9).all()' }, msg: { tr: "<code>reel_faiz</code> sütunu faiz eksi enflasyon olmalı.", en: "The <code>real_rate</code> column should be rate minus inflation." } }],
        after: { tr: "Birden fazla sütun seçmek için çift köşeli parantez kullanılır: <code>veri[[\"a\", \"b\"]]</code>. İçteki parantez bir sütun adları listesidir.", en: "To select several columns, use double square brackets: <code>data[[\"a\", \"b\"]]</code>. The inner brackets are a list of column names." }
      }
    ],
    quiz: [
      {
        q: { tr: "Bir DataFrame'de her satır genellikle neyi temsil eder?", en: "In a DataFrame, what does each row usually represent?" },
        options: { tr: ["Bir değişkeni", "Bir gözlemi", "Bir fonksiyonu"], en: ["A variable", "An observation", "A function"] },
        answer: 1,
        explain: { tr: "Satırlar gözlemler (yıl, il, firma), sütunlar değişkenlerdir.", en: "Rows are observations (year, region, firm), columns are variables." }
      },
      {
        q: { tr: "<code>veri[veri[\"buyume\"] &lt; 0]</code> ne döndürür?", en: "What does <code>data[data[\"growth\"] &lt; 0]</code> return?" },
        options: { tr: ["Büyümenin negatif olduğu satırları", "Büyüme sütununu 0 yapar", "Negatif büyüme sayısını"], en: ["The rows where growth is negative", "Sets the growth column to 0", "The number of negative growth years"] },
        answer: 0,
        explain: { tr: "Koşul bir maske üretir; tablo bu maskeyle filtrelenir ve koşulu sağlayan satırlar döner.", en: "The condition makes a mask; the table is filtered by it and the matching rows are returned." }
      },
      {
        q: { tr: "Her sütunun ortalama, standart sapma, en küçük ve en büyük değerlerini tek komutla görmek için hangisi kullanılır?", en: "Which command shows each column's mean, standard deviation, minimum and maximum at once?" },
        options: { tr: ["<code>veri.head()</code>", "<code>veri.describe()</code>", "<code>veri.shape</code>"], en: ["<code>data.head()</code>", "<code>data.describe()</code>", "<code>data.shape</code>"] },
        answer: 1,
        explain: { tr: "<code>describe()</code> sayısal sütunların özet istatistiklerini verir.", en: "<code>describe()</code> gives summary statistics for numeric columns." }
      }
    ]
  });

  /* ------------------------------------------------------------------- */
  /* Ders 8 — Grafik                                                      */
  /* ------------------------------------------------------------------- */
  const PLOT_SETUP = {
    tr: "import pandas as pd\nimport matplotlib.pyplot as plt\n\n" + MACRO_PY.tr + "\n\n",
    en: "import pandas as pd\nimport matplotlib.pyplot as plt\n\n" + MACRO_PY.en + "\n\n"
  };
  lessons.push({
    id: "m0-l8",
    minutes: 18,
    packages: ["numpy", "pandas", "matplotlib"],
    title: { tr: "Grafik çizmek: veriye bakmak", en: "Plotting: looking at the data" },
    blurb: { tr: "matplotlib ile çizgi, sütun ve serpme grafikleri; başlık, eksen adı, lejant.", en: "Line, bar and scatter charts with matplotlib; titles, axis labels, legends." },
    terms: [{ tr: "çizgi grafiği", en: "line chart" }, { tr: "serpme grafiği", en: "scatter plot" }, { tr: "eksen", en: "axis" }, { tr: "lejant", en: "legend" }],
    concept: {
      tr: `<p>Her analiz veriye <b>bakmakla</b> başlar. Bir grafik, tablodaki sayıların gizlediği eğilimleri, kırılmaları ve ilişkileri bir bakışta gösterir. Python'da temel grafik aracı <b>matplotlib</b>'tir; genellikle <code>import matplotlib.pyplot as plt</code> diye kullanılır.</p>
<ul>
<li><code>plt.plot(x, y)</code> <b>çizgi grafiği</b>: zaman içindeki değişim için (yıllara göre enflasyon).</li>
<li><code>plt.bar(x, y)</code> <b>sütun grafiği</b>: kategorileri ya da dönemleri karşılaştırmak için.</li>
<li><code>plt.scatter(x, y)</code> <b>serpme grafiği</b>: iki değişken arasındaki ilişki için (büyüme ile işsizlik).</li>
<li>Okunur bir grafik için: <code>plt.title(...)</code>, <code>plt.xlabel(...)</code>, <code>plt.ylabel(...)</code>. Birden çok çizgi varsa her birine <code>label="..."</code> verip <code>plt.legend()</code> çağır.</li>
<li><code>plt.show()</code> grafiği gösterir. Bu laboratuvarda hücre bitince grafikler zaten otomatik görünür.</li>
</ul>
<div class="box econ"><b>İktisat örneği.</b> Büyüme ile işsizlik arasındaki ters ilişki <b>Okun yasası</b> olarak bilinir. Okun yasası asıl olarak büyümeyi işsizlikteki <b>değişimle</b> (yüzde puan) ilişkilendirir; bitirme projesinde bu biçimi kullanacaksın. Bu derste kurgusal verideki büyüme oranı ile işsizlik <b>düzeyini</b> karşılaştıracağız: bu, ilişkinin izini gösteren betimleyici bir bakıştır.</div>`,
      en: `<p>Every analysis starts with <b>looking</b> at the data. A chart reveals at a glance the trends, breaks and relationships that numbers in a table hide. Python's basic charting tool is <b>matplotlib</b>, usually loaded as <code>import matplotlib.pyplot as plt</code>.</p>
<ul>
<li><code>plt.plot(x, y)</code> is a <b>line chart</b>: for change over time (inflation by year).</li>
<li><code>plt.bar(x, y)</code> is a <b>bar chart</b>: for comparing categories or periods.</li>
<li><code>plt.scatter(x, y)</code> is a <b>scatter plot</b>: for the relationship between two variables (growth and unemployment).</li>
<li>To make a chart readable: <code>plt.title(...)</code>, <code>plt.xlabel(...)</code>, <code>plt.ylabel(...)</code>. With several lines, give each a <code>label="..."</code> and call <code>plt.legend()</code>.</li>
<li><code>plt.show()</code> displays the chart. In this lab charts also appear automatically when a cell finishes.</li>
</ul>
<div class="box econ"><b>Economics example.</b> The inverse relation between growth and unemployment is known as <b>Okun's law</b>. Strictly, Okun's law relates growth to the <b>change</b> in unemployment (in percentage points); you will use that form in the capstone project. In this lesson we compare the growth rate with the unemployment <b>level</b> in fictional data: a descriptive look at the trace of the relationship.</div>`
    },
    playground: {
      type: "chartBuilder",
      intro: { tr: "Grafik türünü ve değişkenleri seç, seçenekleri aç kapat. Altta bu grafiği çizen matplotlib kodu oluşur. Serpme grafiğinde x = buyume, y = issizlik seçip büyüme ile işsizlik düzeyi arasındaki ilişkiyi ara.", en: "Pick the chart type and variables, toggle the options. The matplotlib code that draws the chart appears below. Try a scatter with x = growth, y = unemployment to look for the relation between growth and the unemployment level." },
      data: MACRO,
      takeaway: { tr: "Zaman için çizgi, karşılaştırma için sütun, ilişki için serpme grafiği. Başlık ve eksen adları olmayan bir grafik eksiktir.", en: "Line for time, bar for comparison, scatter for relationships. A chart without a title and axis labels is incomplete." }
    },
    cells: [
      {
        id: "m0-l8-c1", kind: "run",
        task: { tr: "Yıllara göre enflasyonun çizgi grafiğini çiz. (İlk çalıştırmada matplotlib yüklenir, birkaç saniye sürebilir.)", en: "Draw a line chart of inflation by year. (The first run loads matplotlib and may take a few seconds.)" },
        code: { tr: PLOT_SETUP.tr + 'plt.plot(veri["yil"], veri["enflasyon"])\nplt.title("Örnekistan: yıllık enflasyon (%)")\nplt.show()', en: PLOT_SETUP.en + 'plt.plot(data["year"], data["inflation"])\nplt.title("Exampleland: annual inflation (%)")\nplt.show()' }
      },
      {
        id: "m0-l8-c2", kind: "fill",
        task: { tr: "Aynı grafiğe eksen adlarını ekle: x ekseni <code>\"Yıl\"</code>, y ekseni <code>\"Enflasyon (%)\"</code>.", en: "Add axis labels to the same chart: x axis <code>\"Year\"</code>, y axis <code>\"Inflation (%)\"</code>." },
        code: { tr: 'plt.plot(veri["yil"], veri["enflasyon"])\nplt.title("Örnekistan: yıllık enflasyon (%)")\nplt.xlabel(___)\nplt.ylabel(___)\nplt.show()', en: 'plt.plot(data["year"], data["inflation"])\nplt.title("Exampleland: annual inflation (%)")\nplt.xlabel(___)\nplt.ylabel(___)\nplt.show()' },
        solution: { tr: 'plt.plot(veri["yil"], veri["enflasyon"])\nplt.title("Örnekistan: yıllık enflasyon (%)")\nplt.xlabel("Yıl")\nplt.ylabel("Enflasyon (%)")\nplt.show()', en: 'plt.plot(data["year"], data["inflation"])\nplt.title("Exampleland: annual inflation (%)")\nplt.xlabel("Year")\nplt.ylabel("Inflation (%)")\nplt.show()' },
        hints: [{ tr: "Eksen adları metindir; tırnak içinde yaz.", en: "Axis labels are text; put them in quotes." }],
        checks: [
          { py: "len(_figs) > 0", msg: { tr: "Grafik oluşmadı. <code>plt.plot</code> satırını silmedin, değil mi?", en: "No chart was produced. You did not delete the <code>plt.plot</code> line, did you?" } },
          { py: '_figs[-1]["xlabel"].strip() != "" and _figs[-1]["ylabel"].strip() != ""', msg: { tr: "İki eksenin de adı olmalı.", en: "Both axes need a label." } }
        ]
      },
      {
        id: "m0-l8-c3", kind: "fill",
        task: { tr: "Büyüme ile işsizlik arasındaki ilişkiyi bir <b>serpme grafiğiyle</b> göster. Hangi plt fonksiyonu gerekiyor?", en: "Show the relationship between growth and unemployment with a <b>scatter plot</b>. Which plt function do you need?" },
        code: { tr: 'plt.___(veri["buyume"], veri["issizlik"])\nplt.title("Büyüme ve işsizlik")\nplt.xlabel("Büyüme (%)")\nplt.ylabel("İşsizlik (%)")\nplt.show()', en: 'plt.___(data["growth"], data["unemployment"])\nplt.title("Growth and unemployment")\nplt.xlabel("Growth (%)")\nplt.ylabel("Unemployment (%)")\nplt.show()' },
        solution: { tr: 'plt.scatter(veri["buyume"], veri["issizlik"])\nplt.title("Büyüme ve işsizlik")\nplt.xlabel("Büyüme (%)")\nplt.ylabel("İşsizlik (%)")\nplt.show()', en: 'plt.scatter(data["growth"], data["unemployment"])\nplt.title("Growth and unemployment")\nplt.xlabel("Growth (%)")\nplt.ylabel("Unemployment (%)")\nplt.show()' },
        hints: [{ tr: "Serpme grafiğinin İngilizcesi <i>scatter</i>.", en: "A scatter plot in matplotlib is <code>scatter</code>." }],
        checks: [{ py: 'len(_figs) > 0 and _figs[-1]["collections"] >= 1', msg: { tr: "Bir serpme grafiği (<code>plt.scatter</code>) bekleniyordu.", en: "A scatter plot (<code>plt.scatter</code>) was expected." } }],
        after: { tr: "Noktalar sağa doğru aşağı iniyor: bu kurgusal veride büyümenin yüksek olduğu yıllarda işsizlik düzeyi düşük. Bu betimleyici bir ilişkidir; tek başına nedenselliği kanıtlamaz. Eksen birimlerine dikkat: büyüme yüzde (%), işsizlik oranı yüzde (%); işsizlikteki değişimi kullansaydık birim <b>yüzde puan</b> olurdu.", en: "The points slope downward: in this fictional data, unemployment is lower in high-growth years. This is a descriptive association; on its own it does not prove causality. Mind the axis units: growth in percent (%), unemployment rate in percent (%); had we used the change in unemployment, the unit would be <b>percentage points</b>." }
      },
      {
        id: "m0-l8-c4", kind: "fill",
        task: { tr: "Faiz ve enflasyonu aynı grafikte iki çizgi olarak çiz ve lejant ekle. Eksik olan son komutu yaz.", en: "Plot the interest rate and inflation as two lines on one chart and add a legend. Write the missing last command." },
        code: { tr: 'plt.plot(veri["yil"], veri["faiz"], label="Politika faizi")\nplt.plot(veri["yil"], veri["enflasyon"], label="Enflasyon")\nplt.title("Faiz ve enflasyon (%)")\nplt.xlabel("Yıl")\nplt.___()\nplt.show()', en: 'plt.plot(data["year"], data["rate"], label="Policy rate")\nplt.plot(data["year"], data["inflation"], label="Inflation")\nplt.title("Interest rate and inflation (%)")\nplt.xlabel("Year")\nplt.___()\nplt.show()' },
        solution: { tr: 'plt.plot(veri["yil"], veri["faiz"], label="Politika faizi")\nplt.plot(veri["yil"], veri["enflasyon"], label="Enflasyon")\nplt.title("Faiz ve enflasyon (%)")\nplt.xlabel("Yıl")\nplt.legend()\nplt.show()', en: 'plt.plot(data["year"], data["rate"], label="Policy rate")\nplt.plot(data["year"], data["inflation"], label="Inflation")\nplt.title("Interest rate and inflation (%)")\nplt.xlabel("Year")\nplt.legend()\nplt.show()' },
        hints: [{ tr: "Lejantın İngilizcesi <i>legend</i>.", en: "The command is called <code>legend</code>." }],
        checks: [
          { py: 'len(_figs) > 0 and _figs[-1]["lines"] >= 2', msg: { tr: "Grafikte iki çizgi olmalı.", en: "The chart should have two lines." } },
          { py: 'len(_figs) > 0 and _figs[-1]["legend"]', msg: { tr: "Lejant görünmüyor: <code>plt.legend()</code> eklemelisin.", en: "No legend is shown: add <code>plt.legend()</code>." } }
        ],
        after: { tr: "Grafikte faizin enflasyonun altında kaldığı yıllar, önceki dersteki negatif reel faiz yıllarıdır.", en: "The years where the rate sits below inflation are the negative real-rate years from the previous lesson." }
      }
    ],
    quiz: [
      {
        q: { tr: "İki değişken arasındaki ilişkiyi görmek için en uygun grafik hangisidir?", en: "Which chart is best for seeing the relationship between two variables?" },
        options: { tr: ["Çizgi grafiği", "Serpme grafiği", "Pasta grafiği"], en: ["Line chart", "Scatter plot", "Pie chart"] },
        answer: 1,
        explain: { tr: "Serpme grafiğinde her nokta bir gözlemdir; noktaların deseni ilişkinin yönünü ve gücünü gösterir.", en: "In a scatter plot each point is an observation; the pattern shows the direction and strength of the relationship." }
      },
      {
        q: { tr: "Bir grafikte iki çizginin hangisinin hangisi olduğunu göstermek için ne gerekir?", en: "What do you need to show which of two lines is which?" },
        options: { tr: ["<code>label=</code> ve <code>plt.legend()</code>", "<code>plt.title()</code>", "<code>plt.grid()</code>"], en: ["<code>label=</code> and <code>plt.legend()</code>", "<code>plt.title()</code>", "<code>plt.grid()</code>"] },
        answer: 0,
        explain: { tr: "Her çizgiye <code>label</code> verilir, <code>plt.legend()</code> bu etiketleri bir kutuda gösterir.", en: "Each line gets a <code>label</code>, and <code>plt.legend()</code> shows these labels in a box." }
      },
      {
        q: { tr: "Serpme grafiğinde aşağı eğimli bir desen görmek neyi gösterir?", en: "What does a downward-sloping pattern in a scatter plot show?" },
        options: { tr: ["x'in y'ye neden olduğunu", "İki değişkenin ters yönde hareket etme eğiliminde olduğunu", "Verinin hatalı olduğunu"], en: ["That x causes y", "That the two variables tend to move in opposite directions", "That the data are wrong"] },
        answer: 1,
        explain: { tr: "Grafik bir ilişkiyi (korelasyonu) gösterir; nedensellik için uygun bir araştırma tasarımı gerekir.", en: "The chart shows an association (correlation); causality requires a suitable research design." }
      }
    ]
  });

  /* ------------------------------------------------------------------- */
  /* Ders 9 — Mini proje                                                  */
  /* ------------------------------------------------------------------- */
  lessons.push({
    id: "m0-l9",
    minutes: 25,
    packages: ["numpy", "pandas", "matplotlib"],
    title: { tr: "Mini proje: ilk veri analizin", en: "Mini project: your first data analysis" },
    blurb: { tr: "Simüle edilmiş bir TÜFE endeksinden aylık ve yıllık enflasyonu hesapla, en yüksek ayı bul, grafiğini çiz.", en: "From a simulated CPI index, compute monthly and annual inflation, find the peak month and plot it." },
    terms: [{ tr: "fiyat endeksi", en: "price index" }, { tr: "aylık değişim", en: "month-on-month change" }, { tr: "yıllık değişim", en: "year-on-year change" }],
    concept: {
      tr: `<p>Şimdi öğrendiğin her şeyi bir araya getiriyorsun. Bir istatistik kurumunun yayımladığı gibi aylık bir <b>tüketici fiyat endeksi (TÜFE)</b> serisinden başlayıp enflasyonu hesaplayacaksın. Gerçek veriyle Colab atölyelerinde (Ünite 9–10) çalışacaksın; burada aynı adımları <b>simüle edilmiş</b> bir seriyle, sabit tohumla yapıyoruz.</p>
<ul>
<li><b>Aylık enflasyon</b>: endeksin bir önceki aya göre yüzde değişimi. pandas'ta <code>.pct_change()</code> bunu tek adımda yapar.</li>
<li><b>Yıllık enflasyon</b>: endeksin 12 ay önceki değerine göre yüzde değişimi: <code>.pct_change(periods=12)</code>. Dikkat: bu komut <b>12 satır</b> geri gider. 12 satır öncesinin geçen yılın aynı ayı olması için seri tarih sırasına göre dizili olmalı ve arada eksik ay bulunmamalı; bunu önce kontrol ederiz.</li>
<li>İlk ayın aylık değişimi ve ilk 12 ayın yıllık değişimi hesaplanamaz; pandas bunları <code>NaN</code> (“sayı değil”, eksik değer) olarak gösterir.</li>
<li><code>.idxmax()</code> en büyük değerin <b>indeks etiketini</b> verir (burada indeks 0, 1, 2… olduğu için satır numarasıyla aynı), <code>.loc[etiket, "sutun"]</code> o satırdaki değeri verir.</li>
</ul>
<div class="box econ">Haber bültenlerindeki “yıllık enflasyon” bu hesaptır: bu ayın endeksi ile geçen yılın aynı ayının endeksi arasındaki yüzde fark.</div>`,
      en: `<p>Now you bring everything together. Starting from a monthly <b>consumer price index (CPI)</b> series like the ones statistics offices publish, you will compute inflation. You will work with real data in the Colab workshops (Units 9–10); here we follow the same steps with a <b>simulated</b> series and a fixed seed.</p>
<ul>
<li><b>Monthly inflation</b>: the percentage change of the index from the previous month. In pandas <code>.pct_change()</code> does this in one step.</li>
<li><b>Annual inflation</b>: the percentage change from the index 12 months earlier: <code>.pct_change(periods=12)</code>. Note: this goes back <b>12 rows</b>. For 12 rows back to be the same month last year, the series must be sorted by date with no missing months; we check that first.</li>
<li>The first month's monthly change and the first 12 months' annual change cannot be computed; pandas shows them as <code>NaN</code> (“not a number”, a missing value).</li>
<li><code>.idxmax()</code> gives the <b>index label</b> of the largest value (here the index is 0, 1, 2…, so it equals the row number), and <code>.loc[label, "column"]</code> gives the value in that row.</li>
</ul>
<div class="box econ">The “annual inflation” in news releases is exactly this: the percentage difference between this month's index and the same month a year earlier.</div>`
    },
    playground: {
      type: "roadmap",
      intro: { tr: "Bir veri analizinin beş adımı. Her adıma tıklayıp ne yapılacağını ve hangi aracı kullanacağını gör; kod laboratuvarında bu sırayı izleyeceksin.", en: "The five steps of a data analysis. Click each step to see what happens and which tool you will use; the code lab follows this order." },
      steps: [
        { title: { tr: "Veriyi al", en: "Get the data" }, text: { tr: "<p>Analiz bir veri setiyle başlar. Burada 36 aylık bir TÜFE endeksini simüle ediyoruz. Gerçek hayatta bu adım EVDS ya da FRED gibi bir kaynaktan veri çekmektir.</p>", en: "<p>Analysis starts with a dataset. Here we simulate a 36-month CPI index. In real life this step means downloading from a source such as EVDS or FRED.</p>" }, code: { tr: "rng = np.random.default_rng(2026)\ntufe = pd.DataFrame({...})", en: "rng = np.random.default_rng(2026)\ncpi = pd.DataFrame({...})" } },
        { title: { tr: "Dönüştür", en: "Transform" }, text: { tr: "<p>Ham endeks düzeyi tek başına çok şey söylemez. Onu yüzde değişimlere, yani enflasyona dönüştürürüz.</p>", en: "<p>The raw index level says little by itself. We turn it into percentage changes, i.e. inflation.</p>" }, code: { tr: 'tufe["aylik"] = tufe["endeks"].pct_change() * 100\ntufe["yillik"] = tufe["endeks"].pct_change(periods=12) * 100', en: 'cpi["monthly"] = cpi["index"].pct_change() * 100\ncpi["annual"] = cpi["index"].pct_change(periods=12) * 100' } },
        { title: { tr: "Özetle", en: "Summarise" }, text: { tr: "<p>Ortalama, en yüksek değer, en yüksek değerin tarihi: seriyi birkaç sayıyla özetleriz.</p>", en: "<p>Mean, maximum, date of the maximum: we summarise the series in a few numbers.</p>" }, code: { tr: 'tufe["yillik"].idxmax()\ntufe["aylik"].mean()', en: 'cpi["annual"].idxmax()\ncpi["monthly"].mean()' } },
        { title: { tr: "Görselleştir", en: "Visualise" }, text: { tr: "<p>Grafik, sayıların gizlediği eğilimi gösterir: enflasyon hızlanıyor mu, yavaşlıyor mu?</p>", en: "<p>A chart reveals the trend the numbers hide: is inflation speeding up or slowing down?</p>" }, code: { tr: 'plt.plot(tufe["ay"], tufe["yillik"], label="Yıllık")\nplt.legend()', en: 'plt.plot(cpi["month"], cpi["annual"], label="Annual")\nplt.legend()' } },
        { title: { tr: "Yorumla", en: "Interpret" }, text: { tr: "<p>Son adım bir iktisatçı gibi düşünmektir: sonuç ne anlatıyor, hangi uyarılar gerekli? Simüle edilmiş veriden gerçek ekonomi hakkında sonuç çıkarılamaz.</p>", en: "<p>The last step is thinking like an economist: what does the result say, and what caveats apply? Simulated data tell us nothing about a real economy.</p>" }, code: { tr: "# Yorum bir kod satırı değildir,\n# ama her analizin sonunda yer alır.", en: "# Interpretation is not a line of code,\n# but it ends every analysis." } }
      ],
      takeaway: { tr: "Veriyi al → dönüştür → özetle → görselleştir → yorumla. Makine öğrenmesi projeleri de bu iskeletin üzerine kurulur.", en: "Get → transform → summarise → visualise → interpret. Machine learning projects are built on the same skeleton." }
    },
    cells: [
      {
        id: "m0-l9-c1", kind: "run",
        task: { tr: "36 aylık simüle TÜFE endeksini oluştur ve ilk satırlara bak.", en: "Create the simulated 36-month CPI index and look at the first rows." },
        code: {
          tr: 'import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\nrng = np.random.default_rng(2026)                  # sabit tohum\naylar = pd.date_range("2022-01-01", periods=36, freq="MS")\naylik_artis = rng.normal(2.5, 1.0, 36)             # aylık % artışlar (simüle)\nendeks = 100 * np.cumprod(1 + aylik_artis / 100)   # birikimli endeks\n\ntufe = pd.DataFrame({"ay": aylar, "endeks": endeks.round(2)})\ntufe.head()',
          en: 'import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\nrng = np.random.default_rng(2026)                  # fixed seed\nmonths = pd.date_range("2022-01-01", periods=36, freq="MS")\nmonthly_rise = rng.normal(2.5, 1.0, 36)            # monthly % rises (simulated)\nindex = 100 * np.cumprod(1 + monthly_rise / 100)   # cumulative index\n\ncpi = pd.DataFrame({"month": months, "index": index.round(2)})\ncpi.head()'
        },
        after: { tr: "<code>np.cumprod</code> birikimli çarpımdır: döngüler dersinde yaptığın bileşik hesabı tek satırda yapar.", en: "<code>np.cumprod</code> is a cumulative product: it does in one line the compounding you did with a loop in the loops lesson." }
      },
      {
        id: "m0-l9-c2", kind: "fill",
        task: { tr: "Aylık enflasyonu (%) hesapla. <code>pct_change()</code> oranı verir (0.025 gibi); yüzdeye çevir.", en: "Compute monthly inflation (%). <code>pct_change()</code> gives a ratio (like 0.025); turn it into a percentage." },
        code: { tr: 'tufe["aylik"] = tufe["endeks"].pct_change() * ___\ntufe.head()', en: 'cpi["monthly"] = cpi["index"].pct_change() * ___\ncpi.head()' },
        solution: { tr: 'tufe["aylik"] = tufe["endeks"].pct_change() * 100\ntufe.head()', en: 'cpi["monthly"] = cpi["index"].pct_change() * 100\ncpi.head()' },
        hints: [{ tr: "Oranı yüzdeye çevirmek için ne ile çarparız?", en: "What do we multiply by to turn a ratio into a percentage?" }],
        checks: [{ py: { tr: '"aylik" in tufe.columns and ((tufe["aylik"] - tufe["endeks"].pct_change() * 100).abs().dropna() < 1e-9).all()', en: '"monthly" in cpi.columns and ((cpi["monthly"] - cpi["index"].pct_change() * 100).abs().dropna() < 1e-9).all()' }, msg: { tr: "<code>aylik</code> sütunu yüzde olarak aylık değişim olmalı.", en: "The <code>monthly</code> column should be the month-on-month change in percent." } }],
        after: { tr: "İlk satırdaki <code>NaN</code> normaldir: ilk ayın bir önceki ayı yok.", en: "The <code>NaN</code> in the first row is expected: the first month has no previous month." }
      },
      {
        id: "m0-l9-c3", kind: "fill",
        task: { tr: "Yıllık enflasyonu (%) hesapla: endeksin kaç ay önceki değeriyle karşılaştırılması gerekir?", en: "Compute annual inflation (%): how many months back should the index be compared with?" },
        code: { tr: '# önce kontrol: tarih sırası ve eksik ay\nay_no = tufe["ay"].dt.year * 12 + tufe["ay"].dt.month\nprint("Tarihe göre sıralı:", tufe["ay"].is_monotonic_increasing, "| eksik ay yok:", (ay_no.diff().dropna() == 1).all())\n\ntufe["yillik"] = tufe["endeks"].pct_change(periods=___) * 100\ntufe.tail()', en: '# check first: date order and missing months\nmonth_no = cpi["month"].dt.year * 12 + cpi["month"].dt.month\nprint("Sorted by date:", cpi["month"].is_monotonic_increasing, "| no missing months:", (month_no.diff().dropna() == 1).all())\n\ncpi["annual"] = cpi["index"].pct_change(periods=___) * 100\ncpi.tail()' },
        solution: { tr: '# önce kontrol: tarih sırası ve eksik ay\nay_no = tufe["ay"].dt.year * 12 + tufe["ay"].dt.month\nprint("Tarihe göre sıralı:", tufe["ay"].is_monotonic_increasing, "| eksik ay yok:", (ay_no.diff().dropna() == 1).all())\n\ntufe["yillik"] = tufe["endeks"].pct_change(periods=12) * 100\ntufe.tail()', en: '# check first: date order and missing months\nmonth_no = cpi["month"].dt.year * 12 + cpi["month"].dt.month\nprint("Sorted by date:", cpi["month"].is_monotonic_increasing, "| no missing months:", (month_no.diff().dropna() == 1).all())\n\ncpi["annual"] = cpi["index"].pct_change(periods=12) * 100\ncpi.tail()' },
        hints: [{ tr: "Bir yılda kaç ay var?", en: "How many months are in a year?" }],
        checks: [{ py: { tr: '"yillik" in tufe.columns and tufe["yillik"].isna().sum() == 12 and ((tufe["yillik"] - tufe["endeks"].pct_change(periods=12) * 100).abs().dropna() < 1e-9).all()', en: '"annual" in cpi.columns and cpi["annual"].isna().sum() == 12 and ((cpi["annual"] - cpi["index"].pct_change(periods=12) * 100).abs().dropna() < 1e-9).all()' }, msg: { tr: "Yıllık değişim 12 ay önceki endekse göre hesaplanmalı (ilk 12 satır NaN olur).", en: "Annual change must be computed against the index 12 months earlier (the first 12 rows become NaN)." } }],
        after: { tr: "<code>tail()</code> son satırları gösterir. Aylık oranlar yaklaşık %2,5 iken yıllık oranın çok daha yüksek olduğuna dikkat et: bileşik etki.", en: "<code>tail()</code> shows the last rows. Note how the annual rate is far higher than the ~2.5% monthly rates: compounding." }
      },
      {
        id: "m0-l9-c4", kind: "fill",
        task: { tr: "Yıllık enflasyonun en yüksek olduğu ayı ve o ayki değeri bul.", en: "Find the month with the highest annual inflation and its value." },
        code: { tr: 'satir = tufe["yillik"].___()\nen_yuksek_ay = tufe.loc[satir, "ay"]\nen_yuksek_deger = tufe.loc[satir, "yillik"]\nprint(f"En yüksek yıllık enflasyon: {en_yuksek_deger:.1f}%  ({en_yuksek_ay:%Y-%m})")', en: 'row = cpi["annual"].___()\npeak_month = cpi.loc[row, "month"]\npeak_value = cpi.loc[row, "annual"]\nprint(f"Highest annual inflation: {peak_value:.1f}%  ({peak_month:%Y-%m})")' },
        solution: { tr: 'satir = tufe["yillik"].idxmax()\nen_yuksek_ay = tufe.loc[satir, "ay"]\nen_yuksek_deger = tufe.loc[satir, "yillik"]\nprint(f"En yüksek yıllık enflasyon: {en_yuksek_deger:.1f}%  ({en_yuksek_ay:%Y-%m})")', en: 'row = cpi["annual"].idxmax()\npeak_month = cpi.loc[row, "month"]\npeak_value = cpi.loc[row, "annual"]\nprint(f"Highest annual inflation: {peak_value:.1f}%  ({peak_month:%Y-%m})")' },
        hints: [{ tr: "En büyük değerin <b>yerini</b> (indeksini) veren fonksiyonu kullan: <i>id</i>x + <i>max</i>.", en: "Use the function that gives the <b>position</b> (index) of the largest value: <i>id</i>x + <i>max</i>." }, { tr: "<code>idxmax</code>", en: "<code>idxmax</code>" }],
        checks: [{ py: { tr: 'en_yuksek_deger == tufe["yillik"].max()', en: 'peak_value == cpi["annual"].max()' }, msg: { tr: "Bulunan değer, yıllık enflasyonun en büyük değeri olmalı.", en: "The value found should be the maximum annual inflation." } }]
      },
      {
        id: "m0-l9-c5", kind: "fill",
        task: { tr: "Son adım: aylık ve yıllık enflasyonu aynı grafikte çiz; başlık ve lejant ekle. İkinci çizginin y değişkenini doldur.", en: "Final step: plot monthly and annual inflation on one chart, with a title and legend. Fill in the y variable of the second line." },
        code: { tr: 'plt.figure(figsize=(8, 4))\nplt.plot(tufe["ay"], tufe["aylik"], label="Aylık (%)")\nplt.plot(tufe["ay"], tufe["___"], label="Yıllık (%)")\nplt.title("Simüle TÜFE: aylık ve yıllık enflasyon")\nplt.legend()\nplt.show()', en: 'plt.figure(figsize=(8, 4))\nplt.plot(cpi["month"], cpi["monthly"], label="Monthly (%)")\nplt.plot(cpi["month"], cpi["___"], label="Annual (%)")\nplt.title("Simulated CPI: monthly and annual inflation")\nplt.legend()\nplt.show()' },
        solution: { tr: 'plt.figure(figsize=(8, 4))\nplt.plot(tufe["ay"], tufe["aylik"], label="Aylık (%)")\nplt.plot(tufe["ay"], tufe["yillik"], label="Yıllık (%)")\nplt.title("Simüle TÜFE: aylık ve yıllık enflasyon")\nplt.legend()\nplt.show()', en: 'plt.figure(figsize=(8, 4))\nplt.plot(cpi["month"], cpi["monthly"], label="Monthly (%)")\nplt.plot(cpi["month"], cpi["annual"], label="Annual (%)")\nplt.title("Simulated CPI: monthly and annual inflation")\nplt.legend()\nplt.show()' },
        hints: [{ tr: "3.3'te oluşturduğun sütunun adını yaz.", en: "Write the name of the column you created in 3.3." }],
        checks: [
          { py: 'len(_figs) > 0 and _figs[-1]["lines"] >= 2 and _figs[-1]["legend"]', msg: { tr: "Grafikte iki çizgi ve bir lejant olmalı.", en: "The chart should have two lines and a legend." } },
          { py: '_figs[-1]["title"].strip() != ""', msg: { tr: "Grafiğin bir başlığı olmalı.", en: "The chart needs a title." } }
        ],
        after: { tr: "Tebrikler! Veri oluşturdun, dönüştürdün, özetledin ve görselleştirdin. Geriye son adım kaldı: aşağıdaki hücrelerde sonucu kendi cümlelerinle yorumlayacaksın. Sonra bitirme projesine geçebilirsin; aynı adımları daha az yönlendirmeyle uygulayacaksın.", en: "Well done! You created, transformed, summarised and visualised data. One step is left: in the cells below you will interpret the result in your own words. Then move on to the capstone project, where you apply the same steps with less guidance." }
      }
    ],
    quiz: [
      {
        q: { tr: "Aylık bir endeksten yıllık enflasyonu hesaplamak için hangisi kullanılır?", en: "Which computes annual inflation from a monthly index?" },
        options: { tr: ["<code>.pct_change()</code>", "<code>.pct_change(periods=12)</code>", "<code>.sum()</code>"], en: ["<code>.pct_change()</code>", "<code>.pct_change(periods=12)</code>", "<code>.sum()</code>"] },
        answer: 1,
        explain: { tr: "Yıllık değişim, 12 ay önceki değere göre hesaplanır.", en: "Annual change is measured against the value 12 months earlier." }
      },
      {
        q: { tr: "36 aylık bir serinin yıllık değişim sütununda kaç <code>NaN</code> olur?", en: "How many <code>NaN</code>s are in the annual change column of a 36-month series?" },
        options: { tr: ["1", "12", "36"], en: ["1", "12", "36"] },
        answer: 1,
        explain: { tr: "İlk 12 ayın 12 ay öncesi yoktur; bu yüzden ilk 12 değer eksik olur.", en: "The first 12 months have no value 12 months earlier, so the first 12 values are missing." }
      },
      {
        q: { tr: "Bu projede veriyi neden sabit bir tohumla simüle ettik?", en: "Why did we simulate the data with a fixed seed in this project?" },
        options: { tr: ["Gerçek veriden daha doğru olduğu için", "Herkesin aynı sayıları alıp sonucu tekrarlayabilmesi için", "pandas tohum olmadan çalışmadığı için"], en: ["Because it is more accurate than real data", "So everyone gets the same numbers and can reproduce the result", "Because pandas does not work without a seed"] },
        answer: 1,
        explain: { tr: "Tekrarlanabilirlik: aynı tohum, aynı veri, aynı sonuç.", en: "Reproducibility: same seed, same data, same result." }
      }
    ]
  });

  /* =================================================================== */
  window.LAB.registerModule({
    id: "m0",
    num: 0,
    title: { tr: "Python'a İlk Adım", en: "First Steps in Python" },
    summary: {
      tr: "Hiç kod yazmamış herkes için: değişkenler, listeler, döngüler, metinler ve sözlükler, fonksiyonlar, NumPy, pandas, grafik ve simülasyon; iki proje. Sonraki modüllere geçmeden önce tamamlanması önerilir.",
      en: "For anyone who has never coded: variables, lists, loops, text and dictionaries, functions, NumPy, pandas, charts and simulation; two projects. Best completed before moving on to the later modules."
    },
    intro: {
      tr: "<p>Bu modül dersin haftalık konularına geçmeden önce gereken Python temelini verir. Her ders yaklaşık 20–35 dakika sürer. Kod, tarayıcında çalışan gerçek Python'dur; bir şeyi bozmaktan korkma: <b>Kodu sıfırla</b> düğmesi her zaman başlangıca döndürür.</p><p>Hücre türleri zorlaştıkça ilerler: <b>Çalıştır ve gözle</b> → <b>Boşluğu doldur</b> → <b>Değiştir</b> → <b>Hatayı bul</b> (hatalı bir kodu düzelt) → <b>Meydan okuma</b> (yalnızca görev ve otomatik testlerle, sıfırdan yaz).</p>",
      en: "<p>This module gives you the Python basics you need before the machine learning topics. Each lesson takes about 20–35 minutes. The code is real Python running in your browser; do not be afraid to break things: <b>Reset code</b> always takes you back to the start.</p><p>Cell types get harder as you go: <b>Run and observe</b> → <b>Fill the blank</b> → <b>Modify</b> → <b>Find the bug</b> (fix broken code) → <b>Challenge</b> (write it from scratch with only a task and automatic tests).</p>"
    },
    lessons: lessons
  });
})();
