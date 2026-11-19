/* Modül 0 (yeni) — AI ile Ekonomik Analize Giriş · Üniteler 1–5
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 * "Örnek AI yanıtları" öğretim amacıyla hazırlanmıştır; tüm veriler kurgusaldır.
 */
(function () {
  "use strict";
  const m = window.LAB.modules.find((x) => x.id === "m0");
  if (!m) return;
  const D = window.M0_DATA;
  const old = (id) => m.lessons.find((l) => l.id === id) || {};
  const ML_TR = "aylik_enf = " + D.MLIST;
  const ML_EN = "monthly_inf = " + D.MLIST;
  const U = (window.M0_AI = window.M0_AI || []);

  /* =================================================================== */
  /* Ünite 1 — AI kod asistanı: güçlü ama yanılabilir                     */
  /* =================================================================== */
  U.push({
    id: "m0-u1",
    minutes: 25,
    packages: ["numpy", "pandas"],
    title: { tr: "YZ kod asistanı: güçlü ama yanılabilir", en: "The AI coding assistant: powerful but fallible" },
    blurb: { tr: "YZ nasıl kod yazar, hangi hataları yapar ve neden son söz her zaman sende olmalı.", en: "How AI writes code, which mistakes it makes, and why the final word must always be yours." },
    terms: [{ tr: "büyük dil modeli", en: "large language model" }, { tr: "sessiz hata", en: "silent error" }, { tr: "uydurma", en: "hallucination" }, { tr: "denetim", en: "audit" }],
    concept: {
      tr: `<p>Bugün bir ekonomist kodun çoğunu kendisi yazmıyor: Gemini, ChatGPT ya da Claude gibi bir yapay zekâ (YZ) asistanına ne istediğini anlatıyor, YZ kodu yazıyor. Bu büyük bir kolaylık. Ama YZ bir hesap makinesi gibi çalışmaz. <b>Büyük dil modelleri</b>, milyonlarca örnekten öğrendikleriyle “en olası” kodu üretir. En olası kod çoğu zaman doğrudur, ama her zaman değil.</p>
<p>YZ'nin kod hataları üç türlüdür:</p>
<ul>
<li><b>Görünür hata:</b> Kod çalışmaz, Python bir hata mesajı verir. Can sıkıcıdır ama zararsızdır, çünkü fark edersin.</li>
<li><b>Sessiz hata:</b> Kod sorunsuz çalışır, düzgün bir sayı ya da grafik üretir, ama sonuç yanlıştır. Örneğin aylık enflasyonları çarpmak yerine toplamak. <b>En tehlikeli hata budur.</b></li>
<li><b>Uydurma:</b> YZ var olmayan bir fonksiyon, parametre, veri serisi ya da kaynak “hatırlar”. Bazen veri bulamayınca sessizce sahte veri üretir.</li>
</ul>
<p>Üstelik YZ yanıtını çoğu zaman çok kendinden emin bir dille açıklar. <b>Açıklamanın tonu doğruluğun kanıtı değildir.</b></p>
<div class="box econ"><b>Bu modülün ilkesi:</b> Kodu YZ yazabilir, ama sonuç senindir. Raporuna giren her sayının sorumluluğu, onu YZ ile üreten kişidedir.</div>
<p>Bu yüzden her ünitede aynı dört adımlı döngüyle çalışacağız:</p>
<div class="flow"><div class="flow-step"><b>1 · Tarif et</b><strong>Ne istiyorsun?</strong><span>Soruyu, veriyi, birimi, yöntemi ve beklenen çıktıyı açıkça yaz.</span></div><div class="flow-step"><b>2 · Ürettir</b><strong>YZ yazsın</strong><span>Kodu YZ üretir; sen henüz güvenmezsin.</span></div><div class="flow-step"><b>3 · Denetle</b><strong>Doğru mu?</strong><span>Kodu oku, çıktıyı sına, hatayı bul, düzelt.</span></div><div class="flow-step"><b>4 · Yorumla</b><strong>Ne anlama geliyor?</strong><span>Sonucu iktisatçı gözüyle yorumla, sınırlarını yaz.</span></div></div>`,
      en: `<p>Today an economist rarely writes most of the code alone: they describe what they want to an AI assistant such as Gemini, ChatGPT or Claude, and the AI writes the code. That is a huge convenience. But AI does not work like a calculator. <b>Large language models</b> produce the “most likely” code based on millions of examples. The most likely code is usually right, but not always.</p>
<p>AI coding mistakes come in three kinds:</p>
<ul>
<li><b>Visible error:</b> the code does not run and Python shows an error message. Annoying but harmless, because you notice it.</li>
<li><b>Silent error:</b> the code runs smoothly and produces a tidy number or chart, but the result is wrong. For example, adding monthly inflation rates instead of compounding them. <b>This is the most dangerous kind.</b></li>
<li><b>Hallucination:</b> the AI “remembers” a function, parameter, data series or source that does not exist. Sometimes, when it cannot find data, it quietly makes up fake data.</li>
</ul>
<p>On top of that, the AI often explains its answer in a very confident tone. <b>A confident tone is not evidence of correctness.</b></p>
<div class="box econ"><b>The principle of this module:</b> the AI may write the code, but the result is yours. Responsibility for every number in your report lies with the person who produced it with AI.</div>
<p>That is why every unit follows the same four-step loop:</p>
<div class="flow"><div class="flow-step"><b>1 · Specify</b><strong>What do you want?</strong><span>State the question, data, units, method and expected output clearly.</span></div><div class="flow-step"><b>2 · Generate</b><strong>Let the AI write</strong><span>The AI produces the code; you do not trust it yet.</span></div><div class="flow-step"><b>3 · Audit</b><strong>Is it right?</strong><span>Read the code, test the output, find and fix the mistake.</span></div><div class="flow-step"><b>4 · Interpret</b><strong>What does it mean?</strong><span>Interpret the result as an economist and state its limits.</span></div></div>`
    },
    playground: {
      type: "roadmap",
      intro: { tr: "Döngünün dört adımına tıkla ve her adımda neler olduğunu tek bir örnek üzerinden izle: 12 aylık enflasyondan yıllık enflasyon.", en: "Click the four steps of the loop and follow one example through them: annual inflation from 12 monthly rates." },
      steps: [
        { title: { tr: "Tarif et", en: "Specify" }, text: { tr: "<p>“Aylık enflasyon oranları yüzde olarak bir listede. Bunlardan yıllık enflasyonu <b>bileşik</b> olarak hesapla, sonucu yüzde olarak bir ondalıkla yazdır ve hesabı adım adım açıkla.”</p><p>Birimi (yüzde), yöntemi (bileşik) ve çıktıyı (bir ondalık) söyledik.</p>", en: "<p>“Monthly inflation rates are in a list, in percent. Compute annual inflation from them by <b>compounding</b>, print it in percent with one decimal, and explain the calculation step by step.”</p><p>We stated the unit (percent), the method (compounding) and the output (one decimal).</p>" }, code: { tr: "# YZ'ye giden istek (Türkçe yazabilirsin)", en: "# The prompt that goes to the AI" } },
        { title: { tr: "Ürettir", en: "Generate" }, text: { tr: "<p>YZ kodu yazar. Bu aşamada henüz hiçbir sonuca güvenmiyoruz.</p>", en: "<p>The AI writes the code. At this stage we do not trust any result yet.</p>" }, code: { tr: "endeks = 1\nfor d in aylik_enf:\n    endeks = endeks * (1 + d / 100)\nyillik = (endeks - 1) * 100", en: "index = 1\nfor d in monthly_inf:\n    index = index * (1 + d / 100)\nannual = (index - 1) * 100" } },
        { title: { tr: "Denetle", en: "Audit" }, text: { tr: "<p>Kodu satır satır oku. Mantık kontrolü yap: bileşik oran basit toplamdan biraz büyük olmalı. Bilinen bir durumla sına: her ay %1 ise yıllık ≈ %12,7 olmalı.</p>", en: "<p>Read the code line by line. Sanity-check: the compound rate should be a bit larger than the simple sum. Test a known case: 1% every month should give about 12.7% a year.</p>" }, code: { tr: "assert yillik > sum(aylik_enf)  # bileşik > toplam", en: "assert annual > sum(monthly_inf)  # compound > sum" } },
        { title: { tr: "Yorumla", en: "Interpret" }, text: { tr: "<p>“Aylık oranların bileşik etkisi yıllık %38,4 ediyor; basit toplam (%33) bu etkiyi olduğundan düşük gösterir. Veri kurgusaldır.”</p>", en: "<p>“The compound effect of the monthly rates is 38.4% a year; the simple sum (33%) understates it. The data are fictional.”</p>" }, code: { tr: "# Yorum bir kod satırı değildir; ama analizin en önemli kısmıdır.", en: "# Interpretation is not a line of code, but it is the most important part." } }
      ],
      takeaway: { tr: "YZ ikinci adımı hızlandırır. Birinci, üçüncü ve dördüncü adımlar hâlâ senin işin.", en: "AI speeds up step two. Steps one, three and four are still your job." }
    },
    cells: [
      {
        id: "m0-u1-c1", kind: "audit",
        task: { tr: "Bir öğrenci YZ'den yıllık enflasyonu hesaplamasını istedi. Kod çalışıyor, düzgün bir sayı veriyor. Ama sonuç yanlış. Önce yukarıdaki YZ kodunda hatalı satırı bul, sonra aşağıda düzelt.", en: "A student asked the AI to compute annual inflation. The code runs and gives a tidy number. But the result is wrong. First find the faulty line in the AI's code above, then fix it below." },
        ai: {
          prompt: { tr: "12 aylık enflasyon oranlarım bir listede (yüzde). Yıllık enflasyonu hesaplar mısın?", en: "I have 12 monthly inflation rates in a list (percent). Can you compute annual inflation?" },
          reply: { tr: "Tabii! Aylık oranları toplayarak yıllık enflasyonu kolayca bulabiliriz:", en: "Sure! We can easily get annual inflation by adding up the monthly rates:" },
          code: { tr: ML_TR + '\nyillik = sum(aylik_enf)\nprint(f"Yıllık enflasyon: %{yillik:.1f}")', en: ML_EN + '\nannual = sum(monthly_inf)\nprint(f"Annual inflation: {annual:.1f}%")' },
          claim: { tr: "Yıllık enflasyon %33,0. Aylık oranların toplamı yıllık oranı verir.", en: "Annual inflation is 33.0%. The sum of the monthly rates gives the annual rate." }
        },
        bugLines: [2],
        lineExplain: { tr: "Aylık oranlar toplanmaz, <b>çarpılır</b>: her ayın artışı bir önceki ayın yükselmiş fiyatına uygulanır. YZ çok yaygın bir kısayolu kesin doğru gibi sundu.", en: "Monthly rates are not added, they are <b>compounded</b>: each month's rise applies to the already higher price. The AI presented a common shortcut as if it were exact." },
        hints: [{ tr: "Endeksi 1'den başlat ve her ay <code>(1 + d / 100)</code> ile çarp.", en: "Start an index at 1 and multiply it by <code>(1 + d / 100)</code> each month." }],
        solution: { tr: ML_TR + '\nendeks = 1\nfor d in aylik_enf:\n    endeks = endeks * (1 + d / 100)\nyillik = (endeks - 1) * 100\nprint(f"Yıllık enflasyon: %{yillik:.1f}")', en: ML_EN + '\nindex = 1\nfor d in monthly_inf:\n    index = index * (1 + d / 100)\nannual = (index - 1) * 100\nprint(f"Annual inflation: {annual:.1f}%")' },
        checks: [{ py: { tr: "abs(yillik - (__import__('math').prod(1 + d / 100 for d in aylik_enf) - 1) * 100) < 1e-6", en: "abs(annual - (__import__('math').prod(1 + d / 100 for d in monthly_inf) - 1) * 100) < 1e-6" }, msg: { tr: "<code>yillik</code> hâlâ bileşik oranla uyuşmuyor (≈ 38,4 olmalı).", en: "<code>annual</code> still does not match the compound rate (should be ≈ 38.4)." } }],
        after: { tr: "Fark 5 puandan fazla. Hata mesajı yoktu; yalnızca iktisat bilgisi bu hatayı yakalayabilirdi.", en: "The gap is more than 5 points. There was no error message; only economic knowledge could catch this." }
      },
      {
        id: "m0-u1-c2", kind: "compare",
        task: { tr: "Aynı soruya iki YZ iki farklı yanıt verdi. Hangisine güvenirsin?", en: "Two AIs gave two different answers to the same question. Which do you trust?" },
        prompt: { tr: "Yılda %5 büyüyen bir GSYH, yıl sonu ölçümlerine göre ilk hangi yılda iki katına ulaşır?", en: "GDP grows 5% a year. Measured at year end, in which year does it first reach twice its starting level?" },
        options: [
          { reply: { tr: "70 kuralını kullanabiliriz:", en: "We can use the rule of 70:" }, code: { tr: "yil = 70 / 5\nprint(yil)", en: "years = 70 / 5\nprint(years)" }, claim: { tr: "GSYH tam olarak 14 yılda ikiye katlanır.", en: "GDP doubles in exactly 14 years." } },
          { reply: { tr: "Her yıl büyütüp 200'ü geçtiğimiz yılı sayalım:", en: "Let us grow it year by year and count until it passes 200:" }, code: { tr: "gsyh, yil = 100, 0\nwhile gsyh < 200:\n    gsyh = gsyh * 1.05\n    yil = yil + 1\nprint(yil, round(gsyh, 1))", en: "gdp, years = 100, 0\nwhile gdp < 200:\n    gdp = gdp * 1.05\n    years = years + 1\nprint(years, round(gdp, 1))" }, claim: { tr: "15. yılda 200'ü geçer (14. yılın sonunda ≈ 198).", en: "It passes 200 in year 15 (≈ 198 at the end of year 14)." } }
        ],
        answer: 1,
        reasons: {
          tr: ["A daha kısa olduğu için daha iyidir.", "A bir <b>yaklaşık kuralı</b> “tam olarak” diye sunuyor; B hesabı doğrudan yapıyor.", "B döngü kullandığı için her zaman doğrudur."],
          en: ["A is better because it is shorter.", "A presents an <b>approximation</b> as “exact”; B does the calculation directly.", "B is always right because it uses a loop."]
        },
        reasonAnswer: 1,
        explain: { tr: "70 kuralı iyi bir zihinden hesap aracıdır: 70 / 5 ≈ 14 yıl. Kesirli yıl olarak tam süre ln 2 / ln 1,05 ≈ 14,2 yıldır; soru yıl sonu ölçümlerini sorduğu için cevap 15. yıl. Sorun kuralın kendisi değil, YZ'nin yaklaşık sonucu “tam olarak” diye sunması. Döngü kullanmak da tek başına doğruluk garantisi değildir.", en: "The rule of 70 is a good mental shortcut: 70 / 5 ≈ 14 years. As a fractional year the exact time is ln 2 / ln 1.05 ≈ 14.2 years; since the question asks about year-end measurements the answer is year 15. The problem is not the rule but presenting an approximation as “exact”. Using a loop does not by itself guarantee correctness either." }
      },
      {
        id: "m0-u1-c3", kind: "audit",
        task: { tr: "Bu kez kod çalışmıyor. YZ var olmayan bir şey uydurdu. Hata mesajını oku, hatalı satırı işaretle ve düzelt.", en: "This time the code does not run. The AI made something up. Read the error message, mark the faulty line and fix it." },
        ai: {
          prompt: { tr: "Aylık TÜFE endeksinden yıllık enflasyon sütunu ekler misin? (pandas)", en: "Can you add an annual inflation column from a monthly CPI index? (pandas)" },
          reply: { tr: "pandas'ta bunun için hazır bir parametre var:", en: "pandas has a ready-made parameter for this:" },
          code: { tr: 'import pandas as pd\ntufe = pd.DataFrame({"endeks": [100, 102, 104, 106, 108, 110, 112, 114, 116, 118, 120, 122, 125, 128]})\ntufe["yillik"] = tufe["endeks"].pct_change(yearly=True) * 100\nprint(tufe.tail(2))', en: 'import pandas as pd\ncpi = pd.DataFrame({"index": [100, 102, 104, 106, 108, 110, 112, 114, 116, 118, 120, 122, 125, 128]})\ncpi["annual"] = cpi["index"].pct_change(yearly=True) * 100\nprint(cpi.tail(2))' },
          claim: { tr: "<code>yearly=True</code> parametresi değişimi 12 ay öncesine göre hesaplar.", en: "The <code>yearly=True</code> parameter computes the change against 12 months earlier." }
        },
        bugLines: [3],
        lineExplain: { tr: "<code>pct_change</code>'in <code>yearly</code> diye bir parametresi yok; YZ uydurdu. Doğrusu <code>periods=12</code>. Uydurma parametreler genellikle görünür hata verir; yine de YZ'nin açıklamasına değil, belgelere ve hata mesajına güven.", en: "<code>pct_change</code> has no <code>yearly</code> parameter; the AI made it up. The right one is <code>periods=12</code>. Made-up parameters usually cause visible errors; still, trust the documentation and the error message, not the AI's explanation." },
        hints: [{ tr: "Hata mesajındaki <code>unexpected keyword argument</code> ifadesi, fonksiyonun bu parametreyi tanımadığını söylüyor.", en: "<code>unexpected keyword argument</code> in the message means the function does not know this parameter." }, { tr: "<code>pct_change(periods=12)</code>", en: "<code>pct_change(periods=12)</code>" }],
        solution: { tr: 'import pandas as pd\ntufe = pd.DataFrame({"endeks": [100, 102, 104, 106, 108, 110, 112, 114, 116, 118, 120, 122, 125, 128]})\ntufe["yillik"] = tufe["endeks"].pct_change(periods=12) * 100\nprint(tufe.tail(2))', en: 'import pandas as pd\ncpi = pd.DataFrame({"index": [100, 102, 104, 106, 108, 110, 112, 114, 116, 118, 120, 122, 125, 128]})\ncpi["annual"] = cpi["index"].pct_change(periods=12) * 100\nprint(cpi.tail(2))' },
        checks: [{ py: { tr: 'abs(tufe["yillik"].iloc[-1] - (tufe["endeks"].iloc[-1] / tufe["endeks"].iloc[-13] - 1) * 100) < 1e-9', en: 'abs(cpi["annual"].iloc[-1] - (cpi["index"].iloc[-1] / cpi["index"].iloc[-13] - 1) * 100) < 1e-9' }, msg: { tr: "Son satırdaki değer, endeksin 12 ay önceki değerine göre yüzde değişimi olmalı.", en: "The last value should be the percentage change against the index 12 months earlier." } }]
      },
      {
        id: "m0-u1-c4", kind: "interpret",
        task: { tr: "YZ'den bir sonucu yorumlamasını istedik. Paragrafta bazı cümleler verinin söylemediği şeyler iddia ediyor. Onları bul.", en: "We asked the AI to interpret a result. Some sentences claim things the data do not show. Find them." },
        prompt: { tr: "10 yıllık (kurgusal) veride politika faizi ile enflasyon arasındaki korelasyon 0,82 çıktı. Yorumlar mısın?", en: "In 10 years of (fictional) data, the correlation between the policy rate and inflation is 0.82. Can you interpret it?" },
        sentences: {
          tr: ["Politika faizi ile enflasyon arasında güçlü ve pozitif bir korelasyon (0,82) bulunuyor.", "Bu sonuç, faiz artışlarının enflasyonu yükselttiğini kanıtlamaktadır.", "İlişki, merkez bankasının enflasyon yükseldiğinde faizi artırmasından da kaynaklanıyor olabilir.", "Yalnızca 10 gözlem olduğu için sonuç dikkatle yorumlanmalıdır.", "Dolayısıyla faizi düşürmek her ülkede enflasyonu kesin olarak düşürür."],
          en: ["There is a strong positive correlation (0.82) between the policy rate and inflation.", "This proves that rate hikes raise inflation.", "The relationship may also arise because the central bank raises rates when inflation rises.", "With only 10 observations, the result should be interpreted with care.", "Therefore cutting rates certainly lowers inflation in every country."]
        },
        bad: [1, 4],
        explain: {
          tr: ["Doğru: veride görülen şeyi tarif ediyor.", "<b>Abartı:</b> korelasyon nedensellik kanıtı değildir.", "Doğru: ters yönlü nedensellik olasılığını hatırlatıyor.", "Doğru: küçük örneklem uyarısı yerinde.", "<b>Abartı:</b> hem nedensellik hem de 10 kurgusal gözlemden tüm ülkelere genelleme."],
          en: ["Fine: it describes what the data show.", "<b>Overclaim:</b> correlation is not proof of causation.", "Fine: it raises the possibility of reverse causation.", "Fine: a fair small-sample caveat.", "<b>Overclaim:</b> both causation and a generalisation from 10 fictional observations to every country."]
        }
      }
    ],
    quiz: [
      { q: { tr: "Hangisi en tehlikeli YZ kod hatasıdır?", en: "Which is the most dangerous kind of AI coding mistake?" }, options: { tr: ["Hata mesajı veren kod", "Sorunsuz çalışıp yanlış sonuç veren kod", "Yavaş çalışan kod"], en: ["Code that shows an error message", "Code that runs smoothly but gives a wrong result", "Code that runs slowly"] }, answer: 1, explain: { tr: "Sessiz hatalar fark edilmeden rapora girer.", en: "Silent errors slip into reports unnoticed." } },
      { q: { tr: "YZ'nin “Bu kod doğrudur” diye kendinden emin bir açıklama yazması ne anlama gelir?", en: "What does it mean when the AI confidently writes “This code is correct”?" }, options: { tr: ["Kodun doğru olduğunu", "Hiçbir şey; açıklamanın tonu doğruluk kanıtı değildir", "Kodun test edildiğini"], en: ["That the code is correct", "Nothing; tone is not evidence of correctness", "That the code has been tested"] }, answer: 1, explain: { tr: "Dil modelleri doğru da yanlış da olsa akıcı ve emin bir dille yazar.", en: "Language models write fluently and confidently whether right or wrong." } },
      { q: { tr: "YZ ile üretilen bir analizin sonucundan kim sorumludur?", en: "Who is responsible for the result of an analysis produced with AI?" }, options: { tr: ["YZ'yi geliştiren şirket", "YZ", "Analizi yapan ve raporlayan kişi"], en: ["The company that built the AI", "The AI", "The person who performed and reported the analysis"] }, answer: 2, explain: { tr: "Kodu YZ yazabilir; sonucu kullanan ve imzalayan sensin.", en: "The AI may write the code; you are the one who uses and signs the result." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 2 — Kod okuryazarlığı I                                        */
  /* =================================================================== */
  U.push({
    id: "m0-u2",
    minutes: 30,
    title: { tr: "Kod okuryazarlığı I: Python'u okumak", en: "Code literacy I: reading Python" },
    blurb: { tr: "Yazmak için değil, okumak ve denetlemek için gereken Python: değişken, liste, döngü, koşul, fonksiyon.", en: "The Python you need to read and audit, not to write: variables, lists, loops, conditions, functions." },
    terms: [{ tr: "değişken", en: "variable" }, { tr: "indeks", en: "index" }, { tr: "döngü", en: "loop" }, { tr: "koşul", en: "condition" }, { tr: "fonksiyon", en: "function" }],
    concept: {
      tr: `<p>Okuyamadığın kodu denetleyemezsin. Ama YZ'nin yazdığı kodu okumak için Python'u ezbere yazabiliyor olman gerekmez. Bir yabancı dilde gazete okumak gibi: her kelimeyi üretemesen de metni anlayabilirsin. Bu ünitede amaç, bir kodun <b>ne üreteceğini önceden tahmin edebilmek</b>.</p>
<p><b>Kod okumanın beş kuralı</b></p>
<ul>
<li><b>Yukarıdan aşağıya oku.</b> Python satırları sırayla çalıştırır.</li>
<li><b>Her <code>=</code> işaretinde kutuyu güncelle.</b> <code>x = x + 1</code> “x'in eski değerine 1 ekle, yine x'e koy” demektir. Eşitlik testi ise <code>==</code> ile yapılır.</li>
<li><b>Girinti bloğu gösterir.</b> <code>for</code>, <code>if</code>, <code>def</code> satırlarının altındaki içeride duran satırlar o bloğa aittir. Bir satırın hangi blokta olduğu sonucu tamamen değiştirebilir.</li>
<li><b>Döngülerde ilk iki turu elle izle.</b> Çoğu hata ilk ya da son turda saklanır.</li>
<li><b>Fonksiyonda <code>return</code>'ü bul.</b> <code>return</code> yoksa fonksiyon <code>None</code> döndürür.</li>
</ul>
<p><b>Hızlı sözlük:</b> <code>liste[0]</code> ilk eleman, <code>liste[-1]</code> son eleman, <code>liste[a:b]</code> a'dan b'ye kadar (b hariç); <code>len()</code> eleman sayısı; <code>f"...{x}..."</code> metin içine değer yerleştirir.</p>
<div class="box">Bu kavramları uzun uzun yazarak öğrenmek istersen, öğrenme yolunun sonundaki <b>Ek: Python pratiği</b> bölümünde 14 derslik bir alıştırma seti var.</div>`,
      en: `<p>You cannot audit code you cannot read. But you do not need to be able to write Python from memory to read what the AI wrote. It is like reading a newspaper in a foreign language: you may not produce every word, yet you understand the text. The aim of this unit is to be able to <b>predict what a piece of code will produce</b>.</p>
<p><b>Five rules for reading code</b></p>
<ul>
<li><b>Read from top to bottom.</b> Python runs lines in order.</li>
<li><b>Update the box at every <code>=</code>.</b> <code>x = x + 1</code> means “add 1 to the old x and store it back in x”. Testing equality uses <code>==</code>.</li>
<li><b>Indentation shows the block.</b> Indented lines under <code>for</code>, <code>if</code> and <code>def</code> belong to that block. Which block a line sits in can change the result completely.</li>
<li><b>Trace the first two turns of a loop by hand.</b> Most bugs hide in the first or last turn.</li>
<li><b>Find the <code>return</code> in a function.</b> Without <code>return</code>, a function returns <code>None</code>.</li>
</ul>
<p><b>Quick glossary:</b> <code>list[0]</code> first element, <code>list[-1]</code> last, <code>list[a:b]</code> from a up to b (b excluded); <code>len()</code> number of elements; <code>f"...{x}..."</code> puts a value inside text.</p>
<div class="box">If you want to learn these concepts by writing them out, the <b>Appendix: Python practice</b> at the end of the learning path has a 14-lesson exercise set.</div>`
    },
    playground: Object.assign({}, old("m0-l2").playground, { intro: { tr: "Bir kodu okurken zihninde yaptığın şeyi burada adım adım gör: her satırda bellekteki kutular nasıl değişiyor? Son iki satıra dikkat.", en: "See step by step what you do in your head when reading code: how do the boxes in memory change at each line? Watch the last two lines." } }),
    cells: [
      {
        id: "m0-u2-c1", kind: "run",
        task: { tr: "Çalıştırmadan önce tahmin et.", en: "Predict before you run." },
        predict: { q: { tr: "Bu kod ne yazdırır?", en: "What does this code print?" }, options: { tr: ["20", "20.0", "100.0"], en: ["20", "20.0", "100.0"] }, answer: 1, explain: { tr: "<code>fiyat</code> 80 × 1.25 = 100.0 olur (ondalıklı sayıyla çarpım float verir). 100.0 − 80 = 20.0.", en: "<code>price</code> becomes 80 × 1.25 = 100.0 (multiplying by a decimal gives a float). 100.0 − 80 = 20.0." } },
        code: { tr: "fiyat = 80\nfiyat = fiyat * 1.25\nzam = fiyat - 80\nprint(zam)", en: "price = 80\nprice = price * 1.25\nrise = price - 80\nprint(rise)" }
      },
      {
        id: "m0-u2-c2", kind: "run",
        task: { tr: "İndeks ve dilim okuma.", en: "Reading indexes and slices." },
        predict: { q: { tr: "Bu kod ne yazdırır?", en: "What does this code print?" }, options: { tr: ["[20, 30] 50", "[10, 20, 30] 50", "[20, 30, 40] 40"], en: ["[20, 30] 50", "[10, 20, 30] 50", "[20, 30, 40] 40"] }, answer: 0, explain: { tr: "<code>[1:3]</code>: indeks 1 ve 2 (3 hariç). <code>[-1]</code>: son eleman.", en: "<code>[1:3]</code>: indexes 1 and 2 (3 excluded). <code>[-1]</code>: the last element." } },
        code: { tr: "seri = [10, 20, 30, 40, 50]\nprint(seri[1:3], seri[-1])", en: "series = [10, 20, 30, 40, 50]\nprint(series[1:3], series[-1])" }
      },
      {
        id: "m0-u2-c3", kind: "run",
        task: { tr: "Döngü ve koşulu elle izle.", en: "Trace the loop and condition by hand." },
        predict: { q: { tr: "Bu kod ne yazdırır?", en: "What does this code print?" }, options: { tr: ["12", "10", "6"], en: ["12", "10", "6"] }, answer: 1, explain: { tr: "Yalnızca 3'ten büyük olanlar eklenir: 4 + 6 = 10.", en: "Only values above 3 are added: 4 + 6 = 10." } },
        code: { tr: "toplam = 0\nfor x in [2, 4, 6]:\n    if x > 3:\n        toplam = toplam + x\nprint(toplam)", en: "total = 0\nfor x in [2, 4, 6]:\n    if x > 3:\n        total = total + x\nprint(total)" }
      },
      {
        id: "m0-u2-c4", kind: "run",
        task: { tr: "Fonksiyonda <code>return</code>'ü ara.", en: "Look for the <code>return</code> in the function." },
        predict: { q: { tr: "Bu kod ne yazdırır?", en: "What does this code print?" }, options: { tr: ["120.0", "None", "Hata verir"], en: ["120.0", "None", "It raises an error"] }, answer: 1, explain: { tr: "Fonksiyon hesaplıyor ama <code>return</code> etmiyor; sonuç <code>None</code>. YZ kodlarında sık görülen sessiz bir hatadır.", en: "The function computes but does not <code>return</code>; the result is <code>None</code>. A common silent bug in AI code." } },
        code: { tr: "def kdv_ekle(fiyat):\n    yeni = fiyat * 1.20\n\nsonuc = kdv_ekle(100)\nprint(sonuc)", en: "def add_vat(price):\n    new = price * 1.20\n\nresult = add_vat(100)\nprint(result)" }
      },
      {
        id: "m0-u2-c5", kind: "audit",
        task: { tr: "YZ son üç ayın ortalamasını istediğimizi anladı, ama dilimde küçük bir hata var. Bul ve düzelt.", en: "The AI understood we wanted the average of the last three months, but there is a small slicing mistake. Find and fix it." },
        ai: {
          prompt: { tr: "Son üç ayın ortalama enflasyonunu hesapla.", en: "Compute the average inflation of the last three months." },
          reply: { tr: "Son üç ayı negatif indeksle seçip ortalamasını alıyorum:", en: "I select the last three months with negative indexes and average them:" },
          code: { tr: ML_TR + "\nson_uc = aylik_enf[-3:-1]\nortalama = sum(son_uc) / len(son_uc)\nprint(round(ortalama, 2))", en: ML_EN + "\nlast_three = monthly_inf[-3:-1]\naverage = sum(last_three) / len(last_three)\nprint(round(average, 2))" },
          claim: { tr: "Son üç ayın ortalaması 2,4.", en: "The average of the last three months is 2.4." }
        },
        bugLines: [2],
        lineExplain: { tr: "<code>[-3:-1]</code> sondan üçüncü ve ikinci elemanı alır; son eleman (−1) hariç kalır. Yalnızca iki ay seçilmiş. Doğrusu <code>[-3:]</code>.", en: "<code>[-3:-1]</code> takes the third- and second-to-last elements; the last one (−1) is excluded. Only two months are selected. The right slice is <code>[-3:]</code>." },
        hints: [{ tr: "<code>len(son_uc)</code> kaç? Üç olmalı.", en: "What is <code>len(last_three)</code>? It should be three." }],
        solution: { tr: ML_TR + "\nson_uc = aylik_enf[-3:]\nortalama = sum(son_uc) / len(son_uc)\nprint(round(ortalama, 2))", en: ML_EN + "\nlast_three = monthly_inf[-3:]\naverage = sum(last_three) / len(last_three)\nprint(round(average, 2))" },
        checks: [{ py: { tr: "son_uc == aylik_enf[-3:]", en: "last_three == monthly_inf[-3:]" }, msg: { tr: "Seçim son üç ayı tam olarak içermeli.", en: "The selection should contain exactly the last three months." } }]
      },
      {
        id: "m0-u2-c6", kind: "audit",
        task: { tr: "Kod hep 0 ya da 1 yazdırıyor; hedefin üstündeki ay sayısı 4 olmalı. Sorun bir satırın yerinde. Bul ve düzelt.", en: "The code always prints 0 or 1; the number of months above target should be 4. The problem is where one line sits. Find and fix it." },
        ai: {
          prompt: { tr: "Enflasyonun 3'ün üstünde olduğu ay sayısını bul.", en: "Count the months with inflation above 3." },
          reply: { tr: "Bir sayaçla her ayı kontrol ediyorum:", en: "I check each month with a counter:" },
          code: { tr: ML_TR + "\nhedef = 3.0\nfor d in aylik_enf:\n    sayac = 0\n    if d > hedef:\n        sayac = sayac + 1\nprint(sayac)", en: ML_EN + "\ntarget = 3.0\nfor d in monthly_inf:\n    count = 0\n    if d > target:\n        count = count + 1\nprint(count)" },
          claim: { tr: "Hedefin üstünde 0 ay var.", en: "There are 0 months above target." }
        },
        bugLines: [4],
        lineExplain: { tr: "Sayaç döngünün <b>içinde</b> sıfırlanıyor; her turda baştan başlıyor. Sayaç döngüden önce bir kez kurulmalı. Girinti, sonucu değiştirdi.", en: "The counter is reset <b>inside</b> the loop, so it starts over every turn. It must be created once, before the loop. Indentation changed the result." },
        hints: [{ tr: "<code>sayac = 0</code> satırını döngünün üstüne taşı.", en: "Move <code>count = 0</code> above the loop." }],
        solution: { tr: ML_TR + "\nhedef = 3.0\nsayac = 0\nfor d in aylik_enf:\n    if d > hedef:\n        sayac = sayac + 1\nprint(sayac)", en: ML_EN + "\ntarget = 3.0\ncount = 0\nfor d in monthly_inf:\n    if d > target:\n        count = count + 1\nprint(count)" },
        checks: [{ py: { tr: "sayac == 4", en: "count == 4" }, msg: { tr: "Sonuç 4 olmalı.", en: "The result should be 4." } }]
      }
    ],
    quiz: [
      { q: { tr: "<code>x == 5</code> ile <code>x = 5</code> arasındaki fark nedir?", en: "What is the difference between <code>x == 5</code> and <code>x = 5</code>?" }, options: { tr: ["Fark yoktur", "<code>==</code> eşitliği sınar, <code>=</code> değer atar", "<code>=</code> eşitliği sınar, <code>==</code> değer atar"], en: ["No difference", "<code>==</code> tests equality, <code>=</code> assigns a value", "<code>=</code> tests equality, <code>==</code> assigns"] }, answer: 1, explain: { tr: "Atama ile karşılaştırmayı karıştırmak sık yapılan bir okuma hatasıdır.", en: "Mixing up assignment and comparison is a common reading mistake." } },
      { q: { tr: "Bir döngünün içinde mi dışında mı olduğunu ne belirler?", en: "What decides whether a line is inside a loop?" }, options: { tr: ["Satırın uzunluğu", "Girintisi", "Satırdaki yorum"], en: ["The line's length", "Its indentation", "A comment on the line"] }, answer: 1, explain: { tr: "Python'da bloklar girintiyle belirlenir.", en: "In Python, blocks are defined by indentation." } },
      { q: { tr: "<code>return</code> içermeyen bir fonksiyonun sonucu nedir?", en: "What does a function without <code>return</code> give back?" }, options: { tr: ["0", "None", "Son hesapladığı değer"], en: ["0", "None", "The last value it computed"] }, answer: 1, explain: { tr: "Hesap yapılsa bile dışarı hiçbir şey verilmez.", en: "Even if it computes something, nothing is handed back." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 3 — Kod okuryazarlığı II                                       */
  /* =================================================================== */
  const SETUP3 = { tr: "import pandas as pd\n\n" + D.MACRO_PY.tr + "\n", en: "import pandas as pd\n\n" + D.MACRO_PY.en + "\n" };
  U.push({
    id: "m0-u3",
    minutes: 30,
    packages: ["numpy", "pandas"],
    title: { tr: "Kod okuryazarlığı II: pandas ve NumPy kalıpları", en: "Code literacy II: pandas and NumPy patterns" },
    blurb: { tr: "YZ'nin veri analizinde en sık kullandığı komutlar: ne yaparlar ve nerede sessizce yanıltabilirler.", en: "The commands AI uses most in data analysis: what they do and where they can silently mislead." },
    terms: [{ tr: "veri çerçevesi", en: "DataFrame" }, { tr: "gruplama", en: "groupby" }, { tr: "birleştirme", en: "merge" }, { tr: "eksik değer", en: "missing value (NaN)" }],
    concept: {
      tr: `<p>YZ'ye bir veri analizi yaptırdığında aldığın kodun çoğu <b>pandas</b> (tablolar) ve <b>NumPy</b> (sayı dizileri) kütüphanelerinden gelen bir avuç kalıptan oluşur. Bu kalıpları tanırsan kodun yüzde sekseni kendiliğinden okunur hâle gelir. Asıl dikkat edilmesi gereken, bu komutların <b>sessizce</b> veri silebildiği ya da çoğaltabildiği yerlerdir.</p>
<table><thead><tr><th>Kalıp</th><th>Ne yapar</th><th>Dikkat</th></tr></thead><tbody>
<tr><td><code>pd.read_csv("x.csv")</code></td><td>Dosyadan tablo okur</td><td>Tarih ve ondalık ayırıcı (virgül/nokta) yanlış okunabilir</td></tr>
<tr><td><code>df.shape</code>, <code>df.head()</code></td><td>Boyut ve ilk satırlar</td><td>Her adımdan sonra bakılacak ilk şey</td></tr>
<tr><td><code>df["x"]</code>, <code>df[["x","y"]]</code></td><td>Sütun seçer</td><td>Sütun adı birebir aynı olmalı</td></tr>
<tr><td><code>df[df["x"] &gt; 0]</code></td><td>Koşulla satır seçer</td><td>Kaç satır kaldığını kontrol et</td></tr>
<tr><td><code>df.dropna()</code></td><td>Eksik değerli satırları siler</td><td><b>Herhangi bir sütunda</b> eksik varsa tüm satırı siler</td></tr>
<tr><td><code>df.fillna(0)</code></td><td>Eksikleri doldurur</td><td>“Bilinmiyor”u “sıfır”a çevirir; ortalamayı sıfıra doğru çeker</td></tr>
<tr><td><code>df.merge(b, on="k")</code></td><td>İki tabloyu birleştirir</td><td>Anahtar tekrar ediyorsa <b>satırlar çoğalır</b></td></tr>
<tr><td><code>df.groupby("g")["x"].mean()</code></td><td>Grup başına özet</td><td>Hangi gruplar oluştu, kaç gözlem var?</td></tr>
<tr><td><code>s.pct_change(periods=k)</code></td><td>k dönem önceye göre değişim (oran)</td><td>Tarihler sıralı mı? Sonuç oran mı, yüzde mi?</td></tr>
<tr><td><code>s.shift(1)</code>, <code>s.rolling(3).mean()</code></td><td>Kaydırma, hareketli ortalama</td><td>Gelecekteki bilgiyi geçmişe taşımamalı</td></tr>
<tr><td><code>np.where(koşul, a, b)</code></td><td>Koşula göre değer seçer</td><td>Koşulun yönünü oku</td></tr>
</tbody></table>
<div class="box econ"><b>Kural:</b> YZ'nin kodunda satır sayısını değiştiren her komuttan (filtre, <code>dropna</code>, <code>merge</code>) sonra <code>len(df)</code> ya da <code>df.shape</code>'e bak.</div>`,
      en: `<p>Most of the code you get when you ask the AI for a data analysis is built from a handful of patterns from <b>pandas</b> (tables) and <b>NumPy</b> (arrays of numbers). Once you recognise them, eighty per cent of the code reads itself. What needs real attention is where these commands can <b>silently</b> delete or duplicate data.</p>
<table><thead><tr><th>Pattern</th><th>What it does</th><th>Watch out</th></tr></thead><tbody>
<tr><td><code>pd.read_csv("x.csv")</code></td><td>Reads a table from a file</td><td>Dates and decimal separators can be misread</td></tr>
<tr><td><code>df.shape</code>, <code>df.head()</code></td><td>Size and first rows</td><td>The first thing to look at after every step</td></tr>
<tr><td><code>df["x"]</code>, <code>df[["x","y"]]</code></td><td>Selects columns</td><td>The column name must match exactly</td></tr>
<tr><td><code>df[df["x"] &gt; 0]</code></td><td>Selects rows by a condition</td><td>Check how many rows remain</td></tr>
<tr><td><code>df.dropna()</code></td><td>Deletes rows with missing values</td><td>Deletes the whole row if <b>any column</b> is missing</td></tr>
<tr><td><code>df.fillna(0)</code></td><td>Fills missing values</td><td>Turns “unknown” into “zero”; pulls the mean toward zero</td></tr>
<tr><td><code>df.merge(b, on="k")</code></td><td>Joins two tables</td><td>If the key repeats, <b>rows multiply</b></td></tr>
<tr><td><code>df.groupby("g")["x"].mean()</code></td><td>Summary per group</td><td>Which groups were formed, how many observations?</td></tr>
<tr><td><code>s.pct_change(periods=k)</code></td><td>Change against k periods earlier (ratio)</td><td>Are dates sorted? Ratio or percent?</td></tr>
<tr><td><code>s.shift(1)</code>, <code>s.rolling(3).mean()</code></td><td>Lag, moving average</td><td>Must not move future information into the past</td></tr>
<tr><td><code>np.where(cond, a, b)</code></td><td>Picks values by a condition</td><td>Read the direction of the condition</td></tr>
</tbody></table>
<div class="box econ"><b>Rule:</b> after every command in the AI's code that can change the number of rows (filters, <code>dropna</code>, <code>merge</code>), look at <code>len(df)</code> or <code>df.shape</code>.</div>`
    },
    playground: Object.assign({}, old("m0-l7").playground, { intro: { tr: "YZ'nin yazdığı pandas kodunu okumak için önce kalıpların ne ürettiğini gör: sütun seç, filtrele, sırala. Her seçim, karşılık gelen kodu üretir. Filtrenin satır sayısını nasıl değiştirdiğine dikkat et.", en: "To read the AI's pandas code, first see what the patterns produce: select columns, filter, sort. Each choice produces the matching code. Notice how the filter changes the row count." } }),
    cells: [
      {
        id: "m0-u3-c1", kind: "run",
        task: { tr: "Kurgusal makro tabloyu oluştur. Filtre sonrası kaç satır kalacağını tahmin et.", en: "Build the fictional macro table. Predict how many rows remain after the filter." },
        predict: { q: { tr: "Son satır ne yazdırır?", en: "What does the last line print?" }, options: { tr: ["(2, 5)", "(8, 5)", "(10, 5)"], en: ["(2, 5)", "(8, 5)", "(10, 5)"] }, answer: 0, explain: { tr: "Büyümesi negatif iki yıl var (2019, 2020); sütun sayısı değişmez.", en: "Two years have negative growth (2019, 2020); the number of columns does not change." } },
        code: { tr: SETUP3.tr + 'print(veri.shape)\nprint(veri[veri["buyume"] < 0].shape)', en: SETUP3.en + 'print(data.shape)\nprint(data[data["growth"] < 0].shape)' }
      },
      {
        id: "m0-u3-c2", kind: "run",
        task: { tr: "Gruplama sonucunu oku.", en: "Read the result of a grouping." },
        predict: { q: { tr: "Sonuç tablosunda kaç satır olur?", en: "How many rows will the result have?" }, options: { tr: ["1", "2", "10"], en: ["1", "2", "10"] }, answer: 1, explain: { tr: "İki dönem grubu var; her grup için bir ortalama.", en: "There are two period groups; one mean per group." } },
        code: { tr: 'veri["donem"] = ["2015-2019"] * 5 + ["2020-2024"] * 5\nveri.groupby("donem")["enflasyon"].mean().round(2)', en: 'data["period"] = ["2015-2019"] * 5 + ["2020-2024"] * 5\ndata.groupby("period")["inflation"].mean().round(2)' }
      },
      {
        id: "m0-u3-c3", kind: "audit",
        task: { tr: "YZ “eksik değerleri temizledim” diyor ve ortalama büyümeyi veriyor. Ama yalnızca 3 yılın ortalamasını almış. Neden? Hatalı satırı bul ve düzelt.", en: "The AI says “I cleaned the missing values” and reports mean growth. But it averaged only 3 years. Why? Find the faulty line and fix it." },
        ai: {
          prompt: { tr: "Tablodaki ortalama büyümeyi hesapla, eksik değerleri temizle.", en: "Compute the mean growth in the table and clean the missing values." },
          reply: { tr: "Önce eksik değerli satırları kaldırıyorum, sonra ortalamayı alıyorum:", en: "First I remove rows with missing values, then I take the mean:" },
          code: { tr: 'import numpy as np\ntablo = veri.copy()\ntablo["guven_endeksi"] = [np.nan, np.nan, np.nan, 98.1, np.nan, 91.0, np.nan, np.nan, 95.2, np.nan]\ntemiz = tablo.dropna()\nort_buyume = temiz["buyume"].mean()\nprint(len(temiz), round(ort_buyume, 2))', en: 'import numpy as np\ntable = data.copy()\ntable["confidence"] = [np.nan, np.nan, np.nan, 98.1, np.nan, 91.0, np.nan, np.nan, 95.2, np.nan]\nclean = table.dropna()\nmean_growth = clean["growth"].mean()\nprint(len(clean), round(mean_growth, 2))' },
          claim: { tr: "Eksik değerleri temizledim; ortalama büyüme %0,57.", en: "I cleaned the missing values; mean growth is 0.57%." }
        },
        bugLines: [4],
        lineExplain: { tr: "<code>dropna()</code>, <b>herhangi bir sütunda</b> eksik olan satırı siler. Büyüme sütununda hiç eksik yok; ama ilgisiz güven endeksi sütunu yüzünden 10 yılın 7'si silindi. Doğrusu <code>dropna(subset=[\"buyume\"])</code> ya da doğrudan büyüme sütununun ortalaması.", en: "<code>dropna()</code> deletes a row if <b>any column</b> is missing. Growth has no missing values, but 7 of 10 years were dropped because of the unrelated confidence column. The fix is <code>dropna(subset=[\"growth\"])</code>, or simply the mean of the growth column." },
        hints: [{ tr: "<code>len(temiz)</code> 3 çıkıyor. Hangi sütun yüzünden?", en: "<code>len(clean)</code> is 3. Because of which column?" }],
        solution: { tr: 'import numpy as np\ntablo = veri.copy()\ntablo["guven_endeksi"] = [np.nan, np.nan, np.nan, 98.1, np.nan, 91.0, np.nan, np.nan, 95.2, np.nan]\ntemiz = tablo.dropna(subset=["buyume"])\nort_buyume = temiz["buyume"].mean()\nprint(len(temiz), round(ort_buyume, 2))', en: 'import numpy as np\ntable = data.copy()\ntable["confidence"] = [np.nan, np.nan, np.nan, 98.1, np.nan, 91.0, np.nan, np.nan, 95.2, np.nan]\nclean = table.dropna(subset=["growth"])\nmean_growth = clean["growth"].mean()\nprint(len(clean), round(mean_growth, 2))' },
        checks: [{ py: { tr: 'abs(ort_buyume - veri["buyume"].mean()) < 1e-9', en: 'abs(mean_growth - data["growth"].mean()) < 1e-9' }, msg: { tr: "Ortalama, 10 yılın tamamının büyüme ortalaması olmalı (≈ 2,34).", en: "The mean should be over all 10 years (≈ 2.34)." } }],
        after: { tr: "YZ'nin “temizledim” demesi, neyi sildiğini söylemez. Satır sayısına bakmak hatayı anında gösterirdi.", en: "“I cleaned it” does not tell you what was deleted. Looking at the row count would have shown the problem immediately." }
      },
      {
        id: "m0-u3-c4", kind: "audit",
        task: { tr: "Tabloya merkez bankası başkanı bilgisini ekleyen YZ kodu ortalama enflasyonu değiştirdi. Birleştirme veriyi bozmamalıydı. <b>Seçim kuralı:</b> bir yılda başkan değiştiyse o yıla <b>yıl sonunda görevde olan</b> başkan atanır. Hatayı bul ve düzelt.", en: "The AI code that adds central bank governor information changed mean inflation. A merge should not alter the data. <b>Selection rule:</b> if the governor changed during a year, the year gets the governor <b>in office at year end</b>. Find and fix the problem." },
        ai: {
          prompt: { tr: "Her yıla o yılın sonunda görevde olan merkez bankası başkanını ekle, sonra ortalama enflasyonu hesapla.", en: "Add the central bank governor in office at the end of each year, then compute mean inflation." },
          reply: { tr: "Başkan tablosunu yıl üzerinden birleştiriyorum:", en: "I merge the governor table on year:" },
          code: { tr: 'baskan = pd.DataFrame({"yil": [2018, 2019, 2019, 2020], "baskan": ["A", "A", "B", "B"]})\nbirlesik = veri.merge(baskan, on="yil", how="left")\nort_enf = birlesik["enflasyon"].mean()\nprint(len(veri), len(birlesik), round(ort_enf, 2))', en: 'governor = pd.DataFrame({"year": [2018, 2019, 2019, 2020], "governor": ["A", "A", "B", "B"]})\nmerged = data.merge(governor, on="year", how="left")\nmean_inf = merged["inflation"].mean()\nprint(len(data), len(merged), round(mean_inf, 2))' },
          claim: { tr: "Başkan bilgisi eklendi; ortalama enflasyon değişmedi.", en: "Governor information added; mean inflation is unchanged." }
        },
        bugLines: [2],
        lineExplain: { tr: "2019'da başkan değiştiği için başkan tablosunda 2019 iki kez geçiyor. Birleştirme 2019 satırını <b>ikiye katladı</b>: tablo 10 satırdan 11'e çıktı ve 2019 ortalamaya iki kez girdi. YZ'nin “değişmedi” iddiası kontrol edilmeden yazılmış.", en: "Because the governor changed in 2019, 2019 appears twice in the governor table. The merge <b>duplicated</b> the 2019 row: the table went from 10 to 11 rows and 2019 entered the mean twice. The AI's “unchanged” claim was never checked." },
        hints: [{ tr: "Yazdırılan ilk iki sayıyı karşılaştır.", en: "Compare the first two numbers printed." }, { tr: "Yıl sonu kuralına göre her yılın son kaydını bırak: <code>baskan = baskan.drop_duplicates(\"yil\", keep=\"last\")</code>. Birleştirmeye <code>validate=\"many_to_one\"</code> eklersen anahtar yine tekrar ederse pandas hata verir.", en: "Following the year-end rule, keep each year's last record: <code>governor = governor.drop_duplicates(\"year\", keep=\"last\")</code>. Adding <code>validate=\"many_to_one\"</code> to the merge makes pandas fail if the key repeats again." }],
        solution: { tr: 'baskan = pd.DataFrame({"yil": [2018, 2019, 2019, 2020], "baskan": ["A", "A", "B", "B"]})\nbaskan = baskan.drop_duplicates("yil", keep="last")\nbirlesik = veri.merge(baskan, on="yil", how="left", validate="many_to_one")\nort_enf = birlesik["enflasyon"].mean()\nprint(len(veri), len(birlesik), round(ort_enf, 2))', en: 'governor = pd.DataFrame({"year": [2018, 2019, 2019, 2020], "governor": ["A", "A", "B", "B"]})\ngovernor = governor.drop_duplicates("year", keep="last")\nmerged = data.merge(governor, on="year", how="left", validate="many_to_one")\nmean_inf = merged["inflation"].mean()\nprint(len(data), len(merged), round(mean_inf, 2))' },
        checks: [
          { py: { tr: "len(birlesik) == len(veri)", en: "len(merged) == len(data)" }, msg: { tr: "Birleşik tablo 10 satır olmalı.", en: "The merged table should have 10 rows." } },
          { py: { tr: 'abs(ort_enf - veri["enflasyon"].mean()) < 1e-9', en: 'abs(mean_inf - data["inflation"].mean()) < 1e-9' }, msg: { tr: "Ortalama enflasyon, orijinal tablonunkiyle aynı olmalı.", en: "Mean inflation should equal the original table's." } },
          { py: { tr: 'birlesik["yil"].is_unique and birlesik.loc[birlesik["yil"] == 2019, "baskan"].tolist() == ["B"]', en: 'merged["year"].is_unique and merged.loc[merged["year"] == 2019, "governor"].tolist() == ["B"]' }, msg: { tr: "Her yıl bir kez geçmeli ve 2019'a yıl sonundaki başkan (B) atanmalı.", en: "Each year should appear once and 2019 should get the year-end governor (B)." } }
        ]
      },
      {
        id: "m0-u3-c5", kind: "check",
        task: { tr: "Bir önceki hatayı otomatik yakalayacak bir kontrol yaz: <code>kontrol(once, sonra, anahtar)</code> iki durumda <code>AssertionError</code> versin: (1) satır sayısı değiştiyse, (2) birleşik tabloda anahtar tekrar ediyorsa. Satır sayısı tek başına yetmez: bir yıl kaybolup başka bir yıl çoğalırsa sayı eşit kalır.", en: "Write a check that would have caught the previous bug automatically: <code>check(before, after, key)</code> should raise <code>AssertionError</code> in two cases: (1) the row count changed, (2) the key repeats in the merged table. The row count alone is not enough: if one year is lost and another duplicated, the count stays equal." },
        code: { tr: 'def kontrol(once, sonra, anahtar):\n    assert ___, "Satır sayısı değişti!"\n    assert ___, "Anahtar tekrar ediyor!"\n\nkontrol(veri, birlesik, "yil")\nprint("Kontrol geçti")', en: 'def check(before, after, key):\n    assert ___, "The row count changed!"\n    assert ___, "The key repeats!"\n\ncheck(data, merged, "year")\nprint("Check passed")' },
        solution: { tr: 'def kontrol(once, sonra, anahtar):\n    assert len(once) == len(sonra), "Satır sayısı değişti!"\n    assert sonra[anahtar].is_unique, "Anahtar tekrar ediyor!"\n\nkontrol(veri, birlesik, "yil")\nprint("Kontrol geçti")', en: 'def check(before, after, key):\n    assert len(before) == len(after), "The row count changed!"\n    assert after[key].is_unique, "The key repeats!"\n\ncheck(data, merged, "year")\nprint("Check passed")' },
        hints: [{ tr: "<code>assert koşul, \"mesaj\"</code>: koşul yanlışsa mesajla birlikte hata verir. İlk koşul: iki tablonun <code>len</code>'i eşit.", en: "<code>assert condition, \"message\"</code> raises an error with the message if the condition is false. First condition: the two tables have equal <code>len</code>." }, { tr: "İkinci koşul: <code>sonra[anahtar].is_unique</code> her değer bir kez geçiyorsa <code>True</code> olur.", en: "Second condition: <code>after[key].is_unique</code> is <code>True</code> when every value appears once." }],
        checks: [
          { py: { tr: '_raises(lambda: kontrol(veri, pd.concat([veri, veri.iloc[:1]]), "yil"))', en: '_raises(lambda: check(data, pd.concat([data, data.iloc[:1]]), "year"))' }, msg: { tr: "Satırları çoğalmış bir tabloda kontrolün hata vermesi gerekiyor.", en: "Your check should raise an error on a table with duplicated rows." } },
          { py: { tr: '_raises(lambda: kontrol(veri, pd.concat([veri.iloc[1:], veri.iloc[1:2]]), "yil"))', en: '_raises(lambda: check(data, pd.concat([data.iloc[1:], data.iloc[1:2]]), "year"))' }, msg: { tr: "Bir yıl kaybolup başka biri çoğaldığında satır sayısı eşit kalır; anahtar kontrolü bunu yakalamalı.", en: "When one year is lost and another duplicated the row count stays equal; the key check should catch it." } },
          { py: { tr: 'not _raises(lambda: kontrol(veri, veri.copy(), "yil"))', en: 'not _raises(lambda: check(data, data.copy(), "year"))' }, msg: { tr: "Satır sayısı aynı olan tablolarda kontrol sessiz kalmalı.", en: "Your check should stay silent when row counts match." } }
        ],
        after: { tr: "Bir hatayı bir kez bulmak iyidir; onu yakalayan bir kontrol yazmak daha iyidir. Bu kontrol bile her şeyi görmez: eşleşmeyen satırlar için <code>merge(..., indicator=True)</code> ile <code>_merge</code> sütununa bak. YZ'den kod isterken bu tür kontrolleri de istemeyi 4. ünitede öğreneceksin.", en: "Finding a bug once is good; writing a check that catches it is better. Even this check does not see everything: for unmatched rows use <code>merge(..., indicator=True)</code> and look at the <code>_merge</code> column. In unit 4 you will learn to ask the AI for such checks too." }
      }
    ],
    quiz: [
      { q: { tr: "<code>df.dropna()</code> hangi satırları siler?", en: "Which rows does <code>df.dropna()</code> delete?" }, options: { tr: ["Yalnızca tamamen boş satırları", "Herhangi bir sütunda eksik değer olan satırları", "Hiçbir satırı; yalnızca uyarı verir"], en: ["Only completely empty rows", "Rows with a missing value in any column", "None; it only warns"] }, answer: 1, explain: { tr: "Bu yüzden genellikle <code>subset=</code> ile hangi sütuna bakılacağını söylemek gerekir.", en: "That is why you usually need <code>subset=</code> to say which column to look at." } },
      { q: { tr: "Birleştirmeden sonra satır sayısı arttıysa bu büyük olasılıkla neyi gösterir?", en: "If the row count rises after a merge, what does it most likely mean?" }, options: { tr: ["Veri tamamlandı", "Anahtar sütunda tekrar eden değerler var", "pandas bir hata yaptı"], en: ["The data got completed", "The key column has repeated values", "pandas made a mistake"] }, answer: 1, explain: { tr: "Tekrar eden anahtar, eşleşen satırları çoğaltır.", en: "A repeated key duplicates the matching rows." } },
      { q: { tr: "<code>fillna(0)</code> enflasyon verisinde neden tehlikeli olabilir?", en: "Why can <code>fillna(0)</code> be dangerous with inflation data?" }, options: { tr: ["Kod yavaşlar", "“Bilinmiyor”u “%0 enflasyon”a çevirir; ortalama sıfıra doğru çekilir", "Sütun adlarını değiştirir"], en: ["It slows the code", "It turns “unknown” into “0% inflation”; the mean is pulled toward zero", "It renames columns"] }, answer: 1, explain: { tr: "Eksik değerin ne anlama geldiği bir iktisat kararıdır, teknik bir ayrıntı değil.", en: "What a missing value means is an economic decision, not a technical detail." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 4 — İyi istek yazmak                                           */
  /* =================================================================== */
  U.push({
    id: "m0-u4",
    minutes: 30,
    title: { tr: "İyi istek yazmak: ekonomik soruyu spesifikasyona çevirmek", en: "Writing good prompts: turning an economic question into a specification" },
    blurb: { tr: "YZ'nin hata yapma alanını daraltan altı parçalı istek şablonu.", en: "A six-part prompt template that narrows the room for AI mistakes." },
    terms: [{ tr: "istek", en: "prompt" }, { tr: "spesifikasyon", en: "specification" }, { tr: "varsayım", en: "assumption" }, { tr: "kısıt", en: "constraint" }],
    concept: {
      tr: `<p>YZ'nin hatalarının büyük kısmı, aslında <b>söylenmemiş olanı tahmin etmek</b> zorunda kalmasından doğar. “Enflasyonu hesapla” dediğinde YZ; hangi veriyi, hangi birimi, aylık mı yıllık mı, bileşik mi basit mi olduğunu kendisi seçer. Veri vermezsen sahte veri bile üretebilir. İyi bir istek, bir iktisatçının bir araştırma asistanına vereceği <b>iş tanımı</b> gibidir.</p>
<p><b>Altı parçalı istek şablonu</b></p>
<ol>
<li><b>Bağlam:</b> Ne için? (“Bir enflasyon raporu için…”)</li>
<li><b>Veri:</b> Hangi veri, hangi sütunlar, hangi dönem? Mümkünse ilk birkaç satırı göster. “Veri yoksa uydurma, bana sor.”</li>
<li><b>Birim ve frekans:</b> Yüzde mi, oran mı? Aylık mı, yıllık mı? Nominal mi, reel mi?</li>
<li><b>Yöntem:</b> Hangi hesap? (“12 ay önceye göre değişim”, “bileşik”). Hangi kütüphane? (“yalnızca pandas”)</li>
<li><b>Çıktı:</b> Ne bekliyorsun? (“yeni bir sütun”, “tek ondalıklı sayı”, “başlıklı çizgi grafiği”)</li>
<li><b>Kontrol:</b> “Satır sayısını yazdır”, “sonucu bilinen bir değerle sına”, “varsayımlarını listele”, “her adımı açıkla”.</li>
</ol>
<div class="box">Türkçe istek yazabilirsin. Ama sütun adlarını ve sayıları tablodaki gibi, birebir yaz. Uzun bir istek kötü değildir; belirsiz bir istek kötüdür.</div>`,
      en: `<p>Many AI mistakes come from having to <b>guess what was not said</b>. When you say “compute inflation”, the AI chooses for itself which data, which unit, monthly or annual, compound or simple. If you give no data, it may even make some up. A good prompt is like the <b>job description</b> an economist would give a research assistant.</p>
<p><b>A six-part prompt template</b></p>
<ol>
<li><b>Context:</b> what is it for? (“For an inflation report…”)</li>
<li><b>Data:</b> which data, which columns, which period? Show the first few rows if you can. “If there is no data, do not invent it; ask me.”</li>
<li><b>Units and frequency:</b> percent or ratio? Monthly or annual? Nominal or real?</li>
<li><b>Method:</b> which calculation? (“change against 12 months earlier”, “compounded”). Which library? (“pandas only”)</li>
<li><b>Output:</b> what do you expect? (“a new column”, “a number with one decimal”, “a line chart with a title”)</li>
<li><b>Checks:</b> “print the row count”, “test the result against a known value”, “list your assumptions”, “explain each step”.</li>
</ol>
<div class="box">A long prompt is not bad; a vague prompt is. Write column names and numbers exactly as they appear in your table.</div>`
    },
    playground: {
      type: "promptBuilder",
      intro: { tr: "İsteğin parçalarını aç kapat. Her eklediğin parça, YZ'nin tahmin etmek zorunda kaldığı bir şeyi ortadan kaldırır. Sağda hangi risklerin hâlâ açık olduğunu izle.", en: "Toggle the parts of the prompt. Each part you add removes something the AI would otherwise have to guess. Watch on the right which risks remain open." },
      parts: [
        { label: { tr: "Görev", en: "Task" }, text: { tr: "Yıllık enflasyonu hesapla.", en: "Compute annual inflation." }, on: true },
        { label: { tr: "Bağlam", en: "Context" }, text: { tr: "Bir aylık enflasyon raporu hazırlıyorum.", en: "I am preparing a monthly inflation report." } },
        { label: { tr: "Veri", en: "Data" }, text: { tr: "Veri, 'tufe' adlı bir pandas tablosunda; 'tarih' (aylık) ve 'endeks' sütunları var, 2020-01'den 2024-12'ye. Veri yoksa uydurma, bana sor.", en: "The data are in a pandas table called 'cpi' with 'date' (monthly) and 'index' columns, from 2020-01 to 2024-12. If data are missing, do not invent any; ask me." } },
        { label: { tr: "Birim ve frekans", en: "Units and frequency" }, text: { tr: "Sonuç yüzde olsun ve her ay için 12 ay önceye göre hesaplansın.", en: "The result should be in percent, computed for each month against 12 months earlier." } },
        { label: { tr: "Yöntem", en: "Method" }, text: { tr: "Önce tarihe göre sırala, sonra pct_change(periods=12) kullan; yalnızca pandas.", en: "Sort by date first, then use pct_change(periods=12); pandas only." } },
        { label: { tr: "Çıktı", en: "Output" }, text: { tr: "Sonucu 'yillik' adlı yeni bir sütun olarak ekle ve son 3 satırı göster.", en: "Add the result as a new column called 'annual' and show the last 3 rows." } },
        { label: { tr: "Kontrol", en: "Checks" }, text: { tr: "Satır sayısını ve eksik değer sayısını yazdır; ilk 12 ayın boş olmasının nedenini açıkla.", en: "Print the row count and the number of missing values; explain why the first 12 months are empty." } }
      ],
      risks: [
        { label: { tr: "Veri uydurabilir ya da yanlış tabloyu kullanabilir", en: "May invent data or use the wrong table" }, fixedBy: [2] },
        { label: { tr: "Sonucu oran (0,38) olarak verebilir", en: "May return a ratio (0.38) instead of percent" }, fixedBy: [3] },
        { label: { tr: "Aylık değişimi yıllık diye sunabilir", en: "May present monthly change as annual" }, fixedBy: [3, 4] },
        { label: { tr: "Sıralanmamış tarihlerle hesap yapabilir", en: "May compute on unsorted dates" }, fixedBy: [4] },
        { label: { tr: "Beklenmedik bir biçimde çıktı verebilir", en: "May produce output in an unexpected form" }, fixedBy: [5] },
        { label: { tr: "Sessiz veri kaybını fark ettirmeyebilir", en: "May hide silent data loss" }, fixedBy: [6] }
      ],
      takeaway: { tr: "İyi istek YZ'yi daha zeki yapmaz; tahmin etmek zorunda kaldığı şeyleri azaltır.", en: "A good prompt does not make the AI smarter; it reduces what it has to guess." }
    },
    cells: [
      {
        id: "m0-u4-c1", kind: "prompt",
        task: { tr: "Bir öğrencinin isteği ve YZ'nin ona verdiği yanıt aşağıda. YZ veri olmadığı için <b>sahte veri</b> üretti. Aynı iş için iyi bir istek yaz. Elindeki veri: <code>aylik_enf</code> adlı listede 12 aylık enflasyon oranı (yüzde).", en: "Below are a student's prompt and the AI's answer. Lacking data, the AI produced <b>fake data</b>. Write a good prompt for the same job. Your data: 12 monthly inflation rates (percent) in a list called <code>monthly_inf</code>." },
        weak: {
          prompt: { tr: "Enflasyonu hesapla.", en: "Compute inflation." },
          reply: { tr: "Elinizde veri olmadığı için örnek veri ürettim:", en: "Since you have no data, I generated sample data:" },
          code: { tr: "import numpy as np\nenflasyon = np.random.uniform(1, 5, 12)   # örnek veri\nprint(\"Ortalama enflasyon:\", enflasyon.mean())", en: "import numpy as np\ninflation = np.random.uniform(1, 5, 12)   # sample data\nprint(\"Average inflation:\", inflation.mean())" },
          claim: { tr: "Ortalama enflasyon yaklaşık %3.", en: "Average inflation is about 3%." }
        },
        checklist: [
          { label: { tr: "Veri: hangi değişken, adı ne?", en: "Data: which variable, what name?" }, why: { tr: "Veriyi adıyla göster; YZ uydurmasın.", en: "Name the data so the AI does not invent any." }, re: { tr: "aylik_enf|liste|veri|tablo", en: "monthly_inf|list|data|table" } },
          { label: { tr: "Birim ve frekans", en: "Units and frequency" }, why: { tr: "Yüzde mi? Aylık mı, yıllık mı?", en: "Percent? Monthly or annual?" }, re: { tr: "yüzde|%|aylık|yıllık", en: "percent|%|monthly|annual" } },
          { label: { tr: "Yöntem", en: "Method" }, why: { tr: "Bileşik mi, basit toplam mı?", en: "Compounded or a simple sum?" }, re: { tr: "bileşik|çarp|endeks|toplama", en: "compound|multipl|index|do not add|not sum" } },
          { label: { tr: "Çıktı biçimi", en: "Output format" }, why: { tr: "Kaç ondalık, nasıl yazdırılsın?", en: "How many decimals, how printed?" }, re: { tr: "ondalık|yazdır|göster|sonuç", en: "decimal|print|show|output" } },
          { label: { tr: "Kontrol ya da açıklama", en: "Check or explanation" }, why: { tr: "Uydurma yasağı, adım adım açıklama ya da bir kontrol.", en: "No invented data, step-by-step explanation, or a check." }, re: { tr: "uydurma|açıkla|kontrol|doğrula|assert|örnek veri", en: "invent|explain|check|verify|assert|fake|sample data" } }
        ],
        minLen: 90,
        strong: {
          prompt: { tr: "aylik_enf adlı Python listesinde 12 aylık enflasyon oranı var (yüzde, örneğin 3.2 = %3,2). Bu aylardan yıllık enflasyonu bileşik olarak hesapla: her ayı (1 + oran/100) ile çarp, oranları toplama. Sonucu yüzde olarak bir ondalıkla yazdır. Başka veri üretme veya uydurma; hesabı adım adım açıkla ve sonucu basit toplamla karşılaştır.", en: "A Python list called monthly_inf holds 12 monthly inflation rates (percent, e.g. 3.2 = 3.2%). Compute annual inflation from them by compounding: multiply by (1 + rate/100) each month, do not add the rates. Print the result in percent with one decimal. Do not generate or invent any other data; explain the calculation step by step and compare the result with the simple sum." },
          code: { tr: "endeks = 1\nfor d in aylik_enf:\n    endeks = endeks * (1 + d / 100)\nyillik = (endeks - 1) * 100\nprint(f\"Bileşik yıllık: %{yillik:.1f}\")\nprint(f\"Basit toplam:   %{sum(aylik_enf):.1f}\")", en: "index = 1\nfor d in monthly_inf:\n    index = index * (1 + d / 100)\nannual = (index - 1) * 100\nprint(f\"Compound annual: {annual:.1f}%\")\nprint(f\"Simple sum:      {sum(monthly_inf):.1f}%\")" }
        },
        after: { tr: "İsteğini kopyalayıp Colab'daki Gemini'de deneyebilirsin. YZ'nin yanıtını yine de denetlemen gerekir: iyi istek hatayı azaltır, sıfırlamaz.", en: "You can copy your prompt and try it with Gemini in Colab. You still need to audit the answer: a good prompt reduces mistakes, it does not eliminate them." }
      },
      {
        id: "m0-u4-c2", kind: "prompt",
        task: { tr: "Bu kez görev bir grafik. Zayıf istek aşağıda. Verin: <code>kur</code> adlı pandas tablosu; <code>tarih</code> (günlük) ve <code>usdtry</code> sütunları, 2023-01-01 ile 2024-12-31 arası. İyi bir istek yaz.", en: "This time the task is a chart. The weak prompt is below. Your data: a pandas table called <code>fx</code> with <code>date</code> (daily) and <code>usdtry</code> columns, from 2023-01-01 to 2024-12-31. Write a good prompt." },
        weak: {
          prompt: { tr: "Kur grafiği çiz.", en: "Plot the exchange rate." },
          reply: { tr: "İşte örnek bir kur grafiği:", en: "Here is a sample exchange-rate chart:" },
          code: { tr: "import matplotlib.pyplot as plt\nplt.plot([27, 28, 30, 32, 35])\nplt.show()", en: "import matplotlib.pyplot as plt\nplt.plot([27, 28, 30, 32, 35])\nplt.show()" },
          claim: { tr: "Kur zamanla yükseliyor.", en: "The rate rises over time." }
        },
        checklist: [
          { label: { tr: "Veri ve dönem", en: "Data and period" }, why: { tr: "Tablo adı, sütunlar, tarih aralığı.", en: "Table name, columns, date range." }, re: { tr: "kur|tarih|usdtry|20\\d\\d", en: "fx|date|usdtry|20\\d\\d" } },
          { label: { tr: "Birim", en: "Units" }, why: { tr: "Ne çiziliyor? TL/USD düzeyi mi, yüzde değişim mi?", en: "What is plotted? The TRY/USD level or percentage change?" }, re: { tr: "TL|dolar|USD|düzey|seviye|yüzde", en: "TRY|dollar|USD|level|percent" } },
          { label: { tr: "Grafik biçimi", en: "Chart format" }, why: { tr: "Çizgi mi, eksen adları, başlık?", en: "Line? Axis labels, title?" }, re: { tr: "çizgi|eksen|başlık|etiket", en: "line|axis|title|label" } },
          { label: { tr: "Veri kontrolü", en: "Data check" }, why: { tr: "Tarih sırası, eksik günler, tatiller.", en: "Date order, missing days, holidays." }, re: { tr: "sırala|sıraya|kronolojik|eksik|nan|kontrol|tatil|boşluk", en: "sort|order|chronolog|missing|nan|check|holiday|gap" } },
          { label: { tr: "Kısıt", en: "Constraint" }, why: { tr: "Hangi kütüphane, veri uydurmama.", en: "Which library, no invented data." }, re: { tr: "pandas|matplotlib|yalnızca|uydurma", en: "pandas|matplotlib|only|invent" } }
        ],
        minLen: 90,
        strong: {
          prompt: { tr: "kur adlı pandas tablosunda tarih (günlük) ve usdtry sütunları var, 2023-01-01 ile 2024-12-31 arası. Önce tarih sütununu tarihe çevirip sırala ve eksik değer sayısını yazdır. Ardından USD/TRY düzeyini (TL) zamana göre çizgi grafiği olarak çiz: x ekseni 'Tarih', y ekseni 'TL', başlık 'USD/TRY, 2023–2024'. Yalnızca pandas ve matplotlib kullan, veri uydurma.", en: "A pandas table called fx has date (daily) and usdtry columns, from 2023-01-01 to 2024-12-31. First convert the date column to dates, sort it and print the number of missing values. Then plot the USD/TRY level (in TRY) over time as a line chart: x-axis 'Date', y-axis 'TRY', title 'USD/TRY, 2023–2024'. Use only pandas and matplotlib; do not invent data." },
          code: { tr: 'kur["tarih"] = pd.to_datetime(kur["tarih"])\nkur = kur.sort_values("tarih")\nprint("Eksik:", kur["usdtry"].isna().sum())\nplt.plot(kur["tarih"], kur["usdtry"])\nplt.xlabel("Tarih"); plt.ylabel("TL")\nplt.title("USD/TRY, 2023–2024")\nplt.show()', en: 'fx["date"] = pd.to_datetime(fx["date"])\nfx = fx.sort_values("date")\nprint("Missing:", fx["usdtry"].isna().sum())\nplt.plot(fx["date"], fx["usdtry"])\nplt.xlabel("Date"); plt.ylabel("TRY")\nplt.title("USD/TRY, 2023–2024")\nplt.show()' }
        }
      },
      {
        id: "m0-u4-c3", kind: "compare",
        task: { tr: "İki istekten hangisi daha güvenilir bir kod üretir?", en: "Which of the two prompts will produce more reliable code?" },
        options: [
          { prompt: { tr: "Elimdeki aylık TÜFE verisiyle yıllık enflasyonu en doğru şekilde hesaplayan profesyonel bir kod yaz. Çok önemli, hata olmasın!", en: "Write professional code that computes annual inflation as accurately as possible from my monthly CPI data. It is very important, no mistakes!" } },
          { prompt: { tr: "tufe tablosunda tarih (aylık) ve endeks sütunları var. Tarihe göre sıralayıp pct_change(periods=12)*100 ile yıllık enflasyonu (yüzde) 'yillik' sütununa ekle; satır sayısını ve eksik değer sayısını yazdır.", en: "The cpi table has date (monthly) and index columns. Sort by date, add annual inflation (percent) with pct_change(periods=12)*100 to an 'annual' column, and print the row count and number of missing values." } }
        ],
        answer: 1,
        reasons: {
          tr: ["A daha nazik ve önemini vurguladığı için.", "B veriyi, birimi, yöntemi, çıktıyı ve kontrolü açıkça söylüyor; A ise yalnızca “doğru olsun” diyor.", "B daha kısa olduğu için."],
          en: ["A, because it is polite and stresses importance.", "B states the data, unit, method, output and checks; A only says “make it right”.", "B, because it is shorter."]
        },
        reasonAnswer: 1,
        explain: { tr: "“Hata olmasın” demek YZ'nin hata yapma olasılığını azaltmaz; belirsizliği azaltmak azaltır.", en: "Saying “no mistakes” does not reduce the chance of mistakes; reducing ambiguity does." }
      }
    ],
    quiz: [
      { q: { tr: "YZ'ye veri vermeden “enflasyonu hesapla” dersen ne olabilir?", en: "What can happen if you say “compute inflation” without giving data?" }, options: { tr: ["YZ hata verir ve durur", "YZ sahte veri üretip gerçekmiş gibi sonuç verebilir", "YZ resmî kaynaktan doğru veriyi çeker"], en: ["The AI errors out and stops", "The AI may generate fake data and report results as if real", "The AI fetches correct official data"] }, answer: 1, explain: { tr: "Bu yüzden isteğe “veri yoksa uydurma, bana sor” eklemek önemlidir.", en: "That is why adding “if there is no data, do not invent it; ask me” matters." } },
      { q: { tr: "İsteğe “sonucu yüzde olarak ver” eklemek hangi riski azaltır?", en: "Which risk does adding “give the result in percent” reduce?" }, options: { tr: ["Yanlış grafik türü", "Oran ile yüzdenin karışması", "Yavaş çalışma"], en: ["The wrong chart type", "Confusing ratio and percent", "Slow execution"] }, answer: 1, explain: { tr: "0,38 ile 38 arasındaki fark, raporda 100 kat hata demektir.", en: "The gap between 0.38 and 38 is a hundredfold error in a report." } },
      { q: { tr: "İyi bir isteğe “her adımı açıkla ve varsayımlarını listele” eklemenin faydası nedir?", en: "What is the benefit of adding “explain each step and list your assumptions”?" }, options: { tr: ["Denetlemeyi kolaylaştırır: YZ'nin neyi varsaydığını görürsün", "Kodu hızlandırır", "YZ'nin hata yapmasını imkânsız kılar"], en: ["It makes auditing easier: you see what the AI assumed", "It makes the code faster", "It makes AI mistakes impossible"] }, answer: 0, explain: { tr: "Açıklama doğruluk kanıtı değildir, ama gizli varsayımları görünür kılar.", en: "An explanation is not proof, but it makes hidden assumptions visible." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 5 — Doğrulama araç kutusu                                      */
  /* =================================================================== */
  U.push({
    id: "m0-u5",
    minutes: 30,
    packages: ["numpy", "pandas"],
    title: { tr: "Doğrulama araç kutusu: beş soru ve assert", en: "The verification toolkit: five questions and assert" },
    blurb: { tr: "YZ'nin her sonucuna sorulacak beş soru ve bu soruları koda çeviren kontroller.", en: "Five questions to ask of every AI result, and checks that turn them into code." },
    terms: [{ tr: "doğrulama", en: "verification" }, { tr: "mantık kontrolü", en: "sanity check" }, { tr: "bilinen değer testi", en: "known-value test" }, { tr: "assert", en: "assert" }],
    concept: {
      tr: `<p>YZ'nin verdiği her sonuca, raporuna koymadan önce şu beş soruyu sor:</p>
<ol>
<li><b>Veri doğru mu?</b> Doğru dosya, doğru dönem, beklenen satır sayısı mı? (<code>df.shape</code>, <code>df.head()</code>, ilk ve son tarih)</li>
<li><b>Birim doğru mu?</b> Yüzde mi oran mı, TL mi bin TL mi, nominal mi reel mi? Büyüklük ipucu verir ama kanıt değildir: 0,35 hem %0,35 hem de oran olarak %35 olabilir. Birimi, elle hesapladığın bilinen bir ayla doğrula.</li>
<li><b>Boyut ve eksikler:</b> Satır kayboldu mu, çoğaldı mı? Kaç eksik değer var? (<code>len</code>, <code>isna().sum()</code>)</li>
<li><b>İşaret ve büyüklük makul mü?</b> Enflasyon −%50 ya da %5000 çıkıyorsa bir şeyler yanlıştır. Ekonomik sezgin burada en güçlü aracın.</li>
<li><b>Bilinen bir değerle uyuşuyor mu?</b> Elle hesaplayabileceğin küçük bir örnek kur, kodun aynı sonucu verdiğini gör.</li>
</ol>
<p>Bu soruları her seferinde gözle yanıtlamak yerine koda çevirebilirsin. Python'daki <code>assert</code> komutu, bir koşul yanlışsa programı durdurur ve senin yazdığın mesajı gösterir:</p>
<pre><code>assert 0 &lt; enflasyon &lt; 200, "Enflasyon makul aralığın dışında"
assert len(birlesik) == len(veri), "Birleştirme satır sayısını değiştirdi"</code></pre>
<div class="box econ">YZ'den kod isterken bu kontrolleri de iste. Ama kontrolü de YZ yazdıysa, kontrolün gerçekten <b>neyi</b> sınadığını oku: “her zaman geçen” bir kontrol, hiç kontrol olmamasından daha tehlikelidir.</div>`,
      en: `<p>Before putting any AI result into a report, ask these five questions:</p>
<ol>
<li><b>Is the data right?</b> Right file, right period, the expected number of rows? (<code>df.shape</code>, <code>df.head()</code>, first and last dates)</li>
<li><b>Are the units right?</b> Percent or ratio, lira or thousand lira, nominal or real? Magnitude is a hint, not proof: 0.35 could be 0.35% or a ratio meaning 35%. Confirm the unit with a known month you compute by hand.</li>
<li><b>Size and gaps:</b> were rows lost or duplicated? How many missing values? (<code>len</code>, <code>isna().sum()</code>)</li>
<li><b>Are sign and magnitude plausible?</b> If inflation comes out at −50% or 5000%, something is wrong. Your economic intuition is your strongest tool here.</li>
<li><b>Does it match a known value?</b> Build a small example you can compute by hand and check the code gives the same answer.</li>
</ol>
<p>Instead of answering these questions by eye every time, you can turn them into code. Python's <code>assert</code> stops the program if a condition is false and shows your message:</p>
<pre><code>assert 0 &lt; inflation &lt; 200, "Inflation is outside a plausible range"
assert len(merged) == len(data), "The merge changed the row count"</code></pre>
<div class="box econ">Ask the AI for these checks too. But if the AI wrote the check, read <b>what</b> it actually tests: a check that “always passes” is more dangerous than no check at all.</div>`
    },
    playground: {
      type: "roadmap",
      intro: { tr: "Beş doğrulama sorusunun her birine tıkla: neye bakılır ve hangi kod satırıyla?", en: "Click each of the five verification questions: what to look at, and with which line of code?" },
      steps: [
        { title: { tr: "Veri", en: "Data" }, text: { tr: "<p>Doğru tabloyla mı çalışıyorsun? Satır sayısı ve tarih aralığı beklediğin gibi mi?</p>", en: "<p>Are you working with the right table? Are the row count and date range what you expected?</p>" }, code: { tr: 'print(df.shape)\nprint(df["tarih"].min(), df["tarih"].max())', en: 'print(df.shape)\nprint(df["date"].min(), df["date"].max())' } },
        { title: { tr: "Birim", en: "Units" }, text: { tr: "<p>Yüzde mi oran mı? Büyüklük ipucu verir ama kanıt değildir: düşük enflasyonlu bir ayda %0,35 da normaldir. Birimi bilinen bir ayda elle hesapladığın yüzdeyle doğrula; büyüklük sınırını yalnızca <b>uyarı</b> olarak kullan.</p>", en: "<p>Percent or ratio? Magnitude is a hint, not proof: 0.35% is normal in a low-inflation month. Confirm the unit against a percentage you compute by hand for a known month; use a magnitude bound only as a <b>warning</b>.</p>" }, code: { tr: '# Bilinen ay: 13. satırın değeri endeksten elle hesaplanır\nbeklenen = (df["endeks"].iloc[12] / df["endeks"].iloc[0] - 1) * 100\nassert abs(df["yillik"].iloc[12] - beklenen) < 1e-6, "Birim yüzde değil"\nif df["yillik"].abs().median() < 1:\n    print("Uyarı: değerler küçük; birimi yeniden gözden geçir")', en: '# Known month: compute row 13 from the index by hand\nexpected = (df["index"].iloc[12] / df["index"].iloc[0] - 1) * 100\nassert abs(df["annual"].iloc[12] - expected) < 1e-6, "Unit is not percent"\nif df["annual"].abs().median() < 1:\n    print("Warning: values are small; review the unit")' } },
        { title: { tr: "Boyut ve eksikler", en: "Size and gaps" }, text: { tr: "<p>Bir işlemden önce ve sonra satır sayısını karşılaştır; eksikleri say. Satır sayısı eşit olsa da anahtar tekrar edebilir.</p>", en: "<p>Compare row counts before and after an operation; count the gaps. Even with equal counts the key may repeat.</p>" }, code: { tr: 'once = len(df)\ndf2 = df.merge(diger, on="yil", validate="one_to_one")\nassert len(df2) == once\nprint(df2.isna().sum())', en: 'before = len(df)\ndf2 = df.merge(other, on="year", validate="one_to_one")\nassert len(df2) == before\nprint(df2.isna().sum())' } },
        { title: { tr: "İşaret ve büyüklük", en: "Sign and magnitude" }, text: { tr: "<p>Ekonomik olarak makul aralık nedir? Bunu bir kontrole çevir. 12 aylık değişimde ilk 12 satır <b>beklenen</b> boşluktur; onu ayrı sına, aralığı kalan gözlemlere uygula (<code>between</code> NaN için False döndürür).</p>", en: "<p>What is an economically plausible range? Turn it into a check. In a 12-month change the first 12 rows are an <b>expected</b> gap; test them separately and apply the range to the rest (<code>between</code> returns False for NaN).</p>" }, code: { tr: 'assert df["yillik"].iloc[:12].isna().all(), "İlk 12 ay boş olmalı"\nassert df["yillik"].iloc[12:].notna().all(), "Beklenmeyen eksik var"\nassert df["yillik"].iloc[12:].between(-20, 200).all()', en: 'assert df["annual"].iloc[:12].isna().all(), "First 12 months should be empty"\nassert df["annual"].iloc[12:].notna().all(), "Unexpected missing values"\nassert df["annual"].iloc[12:].between(-20, 200).all()' } },
        { title: { tr: "Bilinen değer", en: "Known value" }, text: { tr: "<p>Sonucunu bildiğin küçük bir girdi ver: endeks 100'den 112'ye çıktıysa yıllık değişim %12 olmalı.</p>", en: "<p>Feed a small input whose answer you know: if the index goes from 100 to 112, the annual change must be 12%.</p>" }, code: { tr: "test = [100 + i for i in range(13)]\nassert abs(yillik_degisim(test).iloc[-1] - 12) < 1e-9", en: "test = [100 + i for i in range(13)]\nassert abs(annual_change(test).iloc[-1] - 12) < 1e-9" } }
      ],
      takeaway: { tr: "Kontroller, bir hatayı bir kez değil her seferinde yakalamanı sağlar.", en: "Checks let you catch a bug every time, not just once." }
    },
    cells: [
      {
        id: "m0-u5-c1", kind: "edit",
        task: { tr: "YZ yıllık enflasyonu hesapladı ama sonucu <b>oran</b> olarak verdi. Rapor yüzde istiyor. Birimi büyüklükten tahmin etmek yerine <b>bilinen bir ayla</b> sına: endeks 12 ayda 250'den 346'ya çıktı, yani yıllık enflasyon elle %38,4. Kontrol satırı bu yüzden hata veriyor. Önce çalıştırıp hatayı gör; sonra <code>yillik</code>'ı yüzdeye çevir.", en: "The AI computed annual inflation but returned a <b>ratio</b>. The report needs percent. Instead of guessing the unit from magnitude, test it against a <b>known month</b>: the index rose from 250 to 346 over 12 months, so annual inflation is 38.4% by hand. That is why the check line fails. Run it first to see the error; then convert <code>annual</code> to percent." },
        code: { tr: 'endeks_once, endeks_simdi = 250.0, 346.0\nyillik = endeks_simdi / endeks_once - 1      # YZ\'nin sonucu\nbeklenen = 38.4                               # bilinen ay, elle hesaplandı (yüzde)\nassert abs(yillik - beklenen) < 0.05, "Birim uyuşmuyor: bilinen ayın yüzdesi 38,4"\nprint(f"Yıllık enflasyon: %{yillik:.1f}")', en: 'index_before, index_now = 250.0, 346.0\nannual = index_now / index_before - 1         # the AI\'s result\nexpected = 38.4                               # known month, computed by hand (percent)\nassert abs(annual - expected) < 0.05, "Unit mismatch: the known month is 38.4%"\nprint(f"Annual inflation: {annual:.1f}%")' },
        solution: { tr: 'endeks_once, endeks_simdi = 250.0, 346.0\nyillik = (endeks_simdi / endeks_once - 1) * 100   # yüzdeye çevrildi\nbeklenen = 38.4                               # bilinen ay, elle hesaplandı (yüzde)\nassert abs(yillik - beklenen) < 0.05, "Birim uyuşmuyor: bilinen ayın yüzdesi 38,4"\nprint(f"Yıllık enflasyon: %{yillik:.1f}")', en: 'index_before, index_now = 250.0, 346.0\nannual = (index_now / index_before - 1) * 100   # converted to percent\nexpected = 38.4                               # known month, computed by hand (percent)\nassert abs(annual - expected) < 0.05, "Unit mismatch: the known month is 38.4%"\nprint(f"Annual inflation: {annual:.1f}%")' },
        hints: [{ tr: "Kontrol satırını silmek ya da toleransı büyütmek çözüm değil! Oranı 100 ile çarp.", en: "Deleting the check or widening the tolerance is not a fix! Multiply the ratio by 100." }],
        checks: [{ py: { tr: "abs(yillik - 38.4) < 1e-9 and beklenen == 38.4", en: "abs(annual - 38.4) < 1e-9 and expected == 38.4" }, msg: { tr: "<code>yillik</code> 38.4 olmalı; bilinen değeri değiştirme.", en: "<code>annual</code> should be 38.4; do not change the known value." } }],
        after: { tr: "Kontrolü silmek, yangın alarmının pilini çıkarmak gibidir. Büyüklüğe bakan bir kontrol (<code>yillik &gt; 1</code>) burada da işe yarardı, ama %0,5 ya da −%1 gibi gerçek düşük ve negatif enflasyonu da reddederdi; birimin kanıtı bilinen değerdir. YZ bazen “hatayı düzelttim” diyerek kontrolü siler; 7. ünitede göreceksin.", en: "Deleting a check is like removing the battery from a smoke alarm. A magnitude check (<code>annual &gt; 1</code>) would also have fired here, but it would reject genuine low or negative inflation such as 0.5% or −1% too; the proof of a unit is a known value. AI sometimes deletes the check and calls it a fix; you will see this in unit 7." }
      },
      {
        id: "m0-u5-c2", kind: "check",
        task: { tr: "Birim kontrolü yaz: <code>kontrol_birim(yillik, endeks)</code>, bilinen bir ayda (sıra 12) yıllık değeri endeksten elle hesaplanan yüzdeyle karşılaştırsın, uyuşmuyorsa hata versin. “Hepsi 1'den küçükse oran” gibi büyüklük kuralları kanıt değildir: aşağıdaki örnekte enflasyon gerçekten düşük (%0,6).", en: "Write a unit check: <code>check_units(annual, index)</code> should compare the annual value in a known month (position 12) with the percentage computed by hand from the index, and raise an error if they differ. Magnitude rules such as “all below 1 means ratio” are not proof: in the example below inflation really is low (0.6%)." },
        code: { tr: 'import pandas as pd\n\ndef kontrol_birim(yillik, endeks):\n    beklenen = (endeks.iloc[12] / endeks.iloc[0] - 1) * 100   # bilinen ay, yüzde\n    assert ___, "Birim uyuşmuyor: yüzde bekleniyordu."\n\nendeks = pd.Series([100 + 0.05 * i for i in range(13)])   # düşük enflasyon\nyillik = endeks.pct_change(periods=12) * 100\nkontrol_birim(yillik, endeks)\nprint("Kontrol geçti")', en: 'import pandas as pd\n\ndef check_units(annual, index):\n    expected = (index.iloc[12] / index.iloc[0] - 1) * 100   # known month, percent\n    assert ___, "Unit mismatch: percent expected."\n\nindex = pd.Series([100 + 0.05 * i for i in range(13)])   # low inflation\nannual = index.pct_change(periods=12) * 100\ncheck_units(annual, index)\nprint("Check passed")' },
        solution: { tr: 'import pandas as pd\n\ndef kontrol_birim(yillik, endeks):\n    beklenen = (endeks.iloc[12] / endeks.iloc[0] - 1) * 100   # bilinen ay, yüzde\n    assert abs(yillik.iloc[12] - beklenen) < 1e-6, "Birim uyuşmuyor: yüzde bekleniyordu."\n\nendeks = pd.Series([100 + 0.05 * i for i in range(13)])   # düşük enflasyon\nyillik = endeks.pct_change(periods=12) * 100\nkontrol_birim(yillik, endeks)\nprint("Kontrol geçti")', en: 'import pandas as pd\n\ndef check_units(annual, index):\n    expected = (index.iloc[12] / index.iloc[0] - 1) * 100   # known month, percent\n    assert abs(annual.iloc[12] - expected) < 1e-6, "Unit mismatch: percent expected."\n\nindex = pd.Series([100 + 0.05 * i for i in range(13)])   # low inflation\nannual = index.pct_change(periods=12) * 100\ncheck_units(annual, index)\nprint("Check passed")' },
        hints: [{ tr: "Aynı aydaki iki sayıyı karşılaştır: <code>abs(yillik.iloc[12] - beklenen) &lt; 1e-6</code>.", en: "Compare the two numbers for the same month: <code>abs(annual.iloc[12] - expected) &lt; 1e-6</code>." }],
        checks: [
          { py: { tr: "_raises(lambda: kontrol_birim(pd.Series([100 + 0.05 * i for i in range(13)]).pct_change(periods=12), pd.Series([100 + 0.05 * i for i in range(13)])))", en: "_raises(lambda: check_units(pd.Series([100 + 0.05 * i for i in range(13)]).pct_change(periods=12), pd.Series([100 + 0.05 * i for i in range(13)])))" }, msg: { tr: "Oran olarak verilmiş değerlerde kontrol hata vermeli.", en: "Your check should raise an error when values are given as ratios." } },
          { py: { tr: "not _raises(lambda: kontrol_birim(pd.Series([100 + 0.05 * i for i in range(13)]).pct_change(periods=12) * 100, pd.Series([100 + 0.05 * i for i in range(13)]))) and not _raises(lambda: kontrol_birim(pd.Series([100 - 0.1 * i for i in range(13)]).pct_change(periods=12) * 100, pd.Series([100 - 0.1 * i for i in range(13)])))", en: "not _raises(lambda: check_units(pd.Series([100 + 0.05 * i for i in range(13)]).pct_change(periods=12) * 100, pd.Series([100 + 0.05 * i for i in range(13)]))) and not _raises(lambda: check_units(pd.Series([100 - 0.1 * i for i in range(13)]).pct_change(periods=12) * 100, pd.Series([100 - 0.1 * i for i in range(13)])))" }, msg: { tr: "Düşük (%0,6) ve negatif (−%1,2) yüzde değerlerde kontrol sessiz kalmalı.", en: "Your check should stay silent on low (0.6%) and negative (−1.2%) percent values." } }
        ],
        after: { tr: "Büyüklük yine işe yarar, ama <b>uyarı</b> olarak: <code>if yillik.abs().median() &lt; 1: print(\"Uyarı: birimi gözden geçir\")</code>. Programı durduran kontrol, bilinen değere dayanmalı.", en: "Magnitude is still useful, but as a <b>warning</b>: <code>if annual.abs().median() &lt; 1: print(\"Warning: review the unit\")</code>. A check that stops the program should rest on a known value." }
      },
      {
        id: "m0-u5-c3", kind: "check",
        task: { tr: "Eksik değer kontrolü yaz: <code>kontrol_eksik(df, sutun)</code>, verilen sütunda tek bir eksik değer bile varsa hata versin.", en: "Write a missing-value check: <code>check_missing(df, column)</code> should raise an error if the given column has even one missing value." },
        code: { tr: 'import pandas as pd\n\ndef kontrol_eksik(df, sutun):\n    assert ___, f"{sutun} sütununda eksik değer var"\n\nkontrol_eksik(pd.DataFrame({"enf": [3.2, 4.5, 2.9]}), "enf")\nprint("Kontrol geçti")', en: 'import pandas as pd\n\ndef check_missing(df, column):\n    assert ___, f"Column {column} has missing values"\n\ncheck_missing(pd.DataFrame({"inf": [3.2, 4.5, 2.9]}), "inf")\nprint("Check passed")' },
        solution: { tr: 'import pandas as pd\n\ndef kontrol_eksik(df, sutun):\n    assert df[sutun].isna().sum() == 0, f"{sutun} sütununda eksik değer var"\n\nkontrol_eksik(pd.DataFrame({"enf": [3.2, 4.5, 2.9]}), "enf")\nprint("Kontrol geçti")', en: 'import pandas as pd\n\ndef check_missing(df, column):\n    assert df[column].isna().sum() == 0, f"Column {column} has missing values"\n\ncheck_missing(pd.DataFrame({"inf": [3.2, 4.5, 2.9]}), "inf")\nprint("Check passed")' },
        hints: [{ tr: "<code>df[sutun].isna().sum()</code> eksik değer sayısını verir.", en: "<code>df[column].isna().sum()</code> gives the number of missing values." }],
        checks: [
          { py: { tr: '_raises(lambda: kontrol_eksik(pd.DataFrame({"x": [1.0, None, 3.0]}), "x"))', en: '_raises(lambda: check_missing(pd.DataFrame({"x": [1.0, None, 3.0]}), "x"))' }, msg: { tr: "Eksik değerli bir sütunda kontrol hata vermeli.", en: "Your check should raise an error on a column with a missing value." } },
          { py: { tr: 'not _raises(lambda: kontrol_eksik(pd.DataFrame({"x": [1.0, 2.0], "y": [None, 1.0]}), "x"))', en: 'not _raises(lambda: check_missing(pd.DataFrame({"x": [1.0, 2.0], "y": [None, 1.0]}), "x"))' }, msg: { tr: "Kontrol yalnızca verilen sütuna bakmalı; başka sütundaki eksik değer hataya yol açmamalı.", en: "Your check should look only at the given column; a gap in another column should not trigger it." } }
        ]
      },
      {
        id: "m0-u5-c4", kind: "audit",
        task: { tr: "YZ bir yıllık değişim fonksiyonu yazdı ve altına bir <b>bilinen değer testi</b> ekledik: endeks 13 ayda 100'den 112'ye çıkıyor, yıllık değişim %12 olmalı. Test başka bir sayı veriyor. Fonksiyondaki hatalı satırı bul ve düzelt.", en: "The AI wrote an annual-change function and we added a <b>known-value test</b> below it: the index rises from 100 to 112 over 13 months, so the annual change must be 12%. The test gives a different number. Find the faulty line in the function and fix it." },
        ai: {
          prompt: { tr: "Aylık bir endeks listesinden yıllık yüzde değişimi hesaplayan bir fonksiyon yaz.", en: "Write a function that computes the annual percentage change from a list of monthly index values." },
          reply: { tr: "pandas ile kısa bir fonksiyon:", en: "A short pandas function:" },
          code: { tr: "import pandas as pd\ndef yillik_degisim(endeks):\n    s = pd.Series(endeks)\n    return s.pct_change() * 100\n\ntest = yillik_degisim([100 + i for i in range(13)])\nprint(round(test.iloc[-1], 2))   # %12 olmalı", en: "import pandas as pd\ndef annual_change(index):\n    s = pd.Series(index)\n    return s.pct_change() * 100\n\ntest = annual_change([100 + i for i in range(13)])\nprint(round(test.iloc[-1], 2))   # should be 12%" },
          claim: { tr: "Fonksiyon yıllık yüzde değişimi döndürür.", en: "The function returns the annual percentage change." }
        },
        bugLines: [4],
        lineExplain: { tr: "<code>pct_change()</code> varsayılan olarak bir önceki döneme göre, yani <b>aylık</b> değişimi hesaplar (112/111 → %0,9). Yıllık için <code>periods=12</code> gerekir. Bilinen değer testi bunu hemen ortaya çıkardı.", en: "<code>pct_change()</code> by default compares with the previous period, i.e. the <b>monthly</b> change (112/111 → 0.9%). Annual needs <code>periods=12</code>. The known-value test exposed it immediately." },
        hints: [{ tr: "Test 0.9 veriyor. Bu, 111'den 112'ye değişim. Hangi parametre 12 ay öncesine bakar?", en: "The test gives 0.9: the change from 111 to 112. Which parameter looks 12 months back?" }],
        solution: { tr: "import pandas as pd\ndef yillik_degisim(endeks):\n    s = pd.Series(endeks)\n    return s.pct_change(periods=12) * 100\n\ntest = yillik_degisim([100 + i for i in range(13)])\nprint(round(test.iloc[-1], 2))   # %12 olmalı", en: "import pandas as pd\ndef annual_change(index):\n    s = pd.Series(index)\n    return s.pct_change(periods=12) * 100\n\ntest = annual_change([100 + i for i in range(13)])\nprint(round(test.iloc[-1], 2))   # should be 12%" },
        checks: [{ py: { tr: "abs(yillik_degisim([100 + i for i in range(13)]).iloc[-1] - 12) < 1e-9 and abs(yillik_degisim([50] * 12 + [55]).iloc[-1] - 10) < 1e-9", en: "abs(annual_change([100 + i for i in range(13)]).iloc[-1] - 12) < 1e-9 and abs(annual_change([50] * 12 + [55]).iloc[-1] - 10) < 1e-9" }, msg: { tr: "Fonksiyon, son değeri 12 ay önceki değerle karşılaştırmalı.", en: "The function should compare the last value with the value 12 months earlier." } }],
        after: { tr: "Test için iyi bir girdi seçmek de beceri ister: her ay sabit kalıp son ay sıçrayan bir seri (100, …, 100, 110) aylık ve yıllık değişimi aynı gösterir ve bu hatayı yakalayamazdı.", en: "Picking a good test input is a skill too: a series that stays flat and jumps in the last month (100, …, 100, 110) makes monthly and annual change equal and would not have caught this bug." }
      }
    ],
    quiz: [
      { q: { tr: "Yıllık enflasyon sütununun medyanı 0,35 çıktı. Birimi en güvenilir nasıl belirlersin?", en: "The median of the annual inflation column is 0.35. How do you determine the unit most reliably?" }, options: { tr: ["Değer küçük olduğu için oran olduğu kesindir", "Bilinen bir ayın yüzdesini endeksten elle hesaplayıp sütundaki değerle karşılaştırırım", "Değer küçük olduğu için enflasyon kesinlikle çok düşüktür"], en: ["It must be a ratio because the value is small", "I compute a known month's percentage from the index by hand and compare it with the column", "Inflation must be very low because the value is small"] }, answer: 1, explain: { tr: "0,35 hem %0,35 (düşük enflasyon) hem oran olarak %35 olabilir. Büyüklük bir uyarıdır; kanıt, bilinen değerle karşılaştırmadır.", en: "0.35 could be 0.35% (low inflation) or a ratio meaning 35%. Magnitude is a warning; the proof is a comparison with a known value." } },
      { q: { tr: "İyi bir “bilinen değer testi”nin özelliği nedir?", en: "What makes a good known-value test?" }, options: { tr: ["Sonucunu elle bildiğin ve hatalı yöntemle doğru yöntemin farklı sonuç vereceği bir girdi", "Mümkün olan en büyük veri", "Rastgele sayılar"], en: ["An input whose answer you know by hand and where wrong and right methods give different results", "The largest possible dataset", "Random numbers"] }, answer: 0, explain: { tr: "Hatalı yöntemle de aynı sonucu veren bir test, hatayı yakalayamaz.", en: "A test that the wrong method also passes cannot catch the bug." } },
      { q: { tr: "Bir kontrol hata veriyorsa ilk yapılması gereken nedir?", en: "If a check fails, what should you do first?" }, options: { tr: ["Kontrolü silmek", "Neden başarısız olduğunu anlamak", "YZ'den kontrolü kaldırmasını istemek"], en: ["Delete the check", "Understand why it fails", "Ask the AI to remove the check"] }, answer: 1, explain: { tr: "Başarısız bir kontrol bir bilgidir: ya veri ya kod ya da kontrolün kendisi yanlıştır.", en: "A failing check is information: the data, the code or the check itself is wrong." } }
    ]
  });
})();
