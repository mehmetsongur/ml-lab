/* Modül 1 — Öngörü, nedensellik ve veriyi hazırlamak · Üniteler 1–5
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 * "Örnek YZ yanıtları" öğretim amacıyla hazırlanmıştır; tüm veriler kurgusaldır.
 */
(function () {
  "use strict";
  const D = window.M1_DATA;
  const K = D.KREDI;
  const U = window.M1_UNITS;

  /* =================================================================== */
  /* Ünite 1 — YZ, makine öğrenmesi ve derin öğrenme                      */
  /* =================================================================== */
  const RULE_TR = `# Geçmiş 8 başvuru: gelir (bin TL) ve kredi geri ödendi mi (1 = evet)
gelir = [18, 22, 25, 31, 35, 40, 44, 52]
odedi = [0, 0, 0, 1, 0, 1, 1, 1]

# Veriden öğrenmek: her olası eşiği küçükten büyüğe dene, en az hata yapanı seç
# Eşitlik kuralı: iki eşik aynı hatayı yaparsa önce bulunan (daha düşük) eşik kalır
en_iyi_esik, en_az_hata = None, 99
for esik in sorted(gelir):
    tahmin = [1 if g >= esik else 0 for g in gelir]
    hata = sum(t != o for t, o in zip(tahmin, odedi))
    print("eşik", esik, "→ eğitim hatası", hata)
    if hata < en_az_hata:
        en_iyi_esik, en_az_hata = esik, hata
print("Öğrenilen eşik:", en_iyi_esik, "| eğitim hatası:", en_az_hata)`;
  const RULE_EN = `# 8 past applications: income (thousands) and whether the loan was repaid (1 = yes)
income = [18, 22, 25, 31, 35, 40, 44, 52]
repaid = [0, 0, 0, 1, 0, 1, 1, 1]

# Learning from data: try every possible threshold from low to high, keep the one with the fewest errors
# Tie rule: if two thresholds make the same number of errors, the one found first (the lower one) is kept
best_threshold, fewest_errors = None, 99
for threshold in sorted(income):
    pred = [1 if g >= threshold else 0 for g in income]
    errors = sum(p != r for p, r in zip(pred, repaid))
    print("threshold", threshold, "→ training errors", errors)
    if errors < fewest_errors:
        best_threshold, fewest_errors = threshold, errors
print("Learned threshold:", best_threshold, "| training errors:", fewest_errors)`;

  U.push({
    id: "m1-u1",
    minutes: 20,
    title: { tr: "YZ, makine öğrenmesi ve derin öğrenme", en: "AI, machine learning and deep learning" },
    blurb: { tr: "Üç kavram iç içe geçmiş halkalar gibidir. Farkları ve ekonometriyle ilişkileri.", en: "Three concepts nested like rings. How they differ and how they relate to econometrics." },
    terms: [{ tr: "yapay zekâ", en: "artificial intelligence" }, { tr: "makine öğrenmesi", en: "machine learning" }, { tr: "derin öğrenme", en: "deep learning" }, { tr: "kural tabanlı", en: "rule-based" }],
    concept: {
      tr: `<p>Bu üç kavram çoğu zaman birbirinin yerine kullanılır ama aynı şey değildir. İç içe geçmiş üç halka gibi düşün:</p>
<ul>
<li><b>Yapay zekâ (YZ)</b> en dış halkadır: insan zekâsı gerektiren işleri yapan her türlü bilgisayar sistemi. Elle yazılmış kurallarla çalışan bir program da (örneğin “gelir 20.000'in altındaysa krediyi reddet”) bu geniş tanıma girer.</li>
<li><b>Makine öğrenmesi (MÖ)</b> ortadaki halkadır: kuralları insan yazmaz, bilgisayar <b>veriden öğrenir</b>. Geçmiş kredi başvurularına bakıp hangi başvuranların borcunu ödediğinden bir karar kuralı çıkarmak bir makine öğrenmesi işidir.</li>
<li><b>Derin öğrenme</b> en içteki halkadır: çok katmanlı yapay sinir ağlarıyla öğrenen makine öğrenmesi. Görüntü, ses ve metin gibi karmaşık verilerde güçlüdür. Modül 0'da kod yazdırdığın büyük dil modelleri (Gemini, ChatGPT, Claude) derin öğrenme ürünleridir.</li>
</ul>
<div class="box econ"><b>Peki ekonometri nerede?</b> Ekonometri ile makine öğrenmesi aynı araçların bir kısmını paylaşır; doğrusal regresyon ikisinde de vardır. Fark çoğu zaman <b>sorulan sorudadır</b>: ekonometri genellikle bir katsayıyı doğru kestirmek ve yorumlamak ister, makine öğrenmesi ise yeni gözlemler için iyi öngörü yapmak. Bu farkı bir sonraki ünitede kendi gözünle göreceksin.</div>
<p>Atölyede “veriden öğrenmek” ne demek, en basit hâliyle göreceksin: bir bilgisayar, geçmiş başvurulara bakarak kendi eşiğini seçiyor.</p>`,
      en: `<p>These three terms are often used interchangeably, but they are not the same thing. Think of three nested rings:</p>
<ul>
<li><b>Artificial intelligence (AI)</b> is the outer ring: any computer system that performs tasks that would otherwise need human intelligence. A program running on hand-written rules (say, “reject the loan if income is below 20,000”) also fits this broad definition.</li>
<li><b>Machine learning (ML)</b> is the middle ring: people do not write the rules; the computer <b>learns them from data</b>. Looking at past loan applications and extracting a decision rule from who repaid is a machine learning task.</li>
<li><b>Deep learning</b> is the inner ring: machine learning with many-layered artificial neural networks. It is powerful with complex data such as images, sound and text. The large language models you had write code in Module 0 (Gemini, ChatGPT, Claude) are products of deep learning.</li>
</ul>
<div class="box econ"><b>So where is econometrics?</b> Econometrics and machine learning share some tools; linear regression appears in both. The difference usually lies in <b>the question asked</b>: econometrics typically wants to estimate and interpret a coefficient correctly, while machine learning wants good predictions for new observations. You will see this difference for yourself in the next unit.</div>
<p>In the workshop you will see what “learning from data” means in its simplest form: a computer picks its own threshold by looking at past applications.</p>`
    },
    playground: {
      type: "sorter",
      intro: { tr: "Her örneği en uygun kutuya yerleştir. Seçimin hemen değerlendirilir.", en: "Put each example in the box that fits best. Your choice is checked straight away." },
      cats: [
        { id: "rule", label: { tr: "Kural tabanlı program", en: "Rule-based program" } },
        { id: "ml", label: { tr: "Makine öğrenmesi", en: "Machine learning" } },
        { id: "dl", label: { tr: "Derin öğrenme", en: "Deep learning" } },
        { id: "eco", label: { tr: "Ekonometrik çıkarım", en: "Econometric inference" } }
      ],
      items: [
        { text: { tr: "Bir uzmanın yazdığı “gelir 20.000'in altındaysa reddet” kuralıyla çalışan başvuru sistemi", en: "An application system running on an expert's rule: “reject if income is below 20,000”" }, cat: "rule", why: { tr: "Kuralı insan yazdı; sistem veriden hiçbir şey öğrenmiyor.", en: "A person wrote the rule; the system learns nothing from data." } },
        { text: { tr: "Geçmiş başvurulardan öğrenilmiş bir modelle yeni başvuruları puanlamak", en: "Scoring new applications with a model learned from past applications" }, cat: "ml", why: { tr: "Karar kuralı veriden öğreniliyor ve yeni gözlemlere uygulanıyor.", en: "The decision rule is learned from data and applied to new observations." } },
        { text: { tr: "Merkez bankası metinlerini özetleyen büyük dil modeli", en: "A large language model that summarises central bank texts" }, cat: "dl", why: { tr: "Büyük dil modelleri çok katmanlı sinir ağlarıdır.", en: "Large language models are many-layered neural networks." } },
        { text: { tr: "Asgari ücretin istihdama etkisini gösteren katsayıyı kestirip yorumlamak", en: "Estimating and interpreting the coefficient that shows the effect of the minimum wage on employment" }, cat: "eco", why: { tr: "Amaç bir katsayıyı ve onun anlamını doğru kestirmek.", en: "The goal is to estimate a coefficient and its meaning correctly." } },
        { text: { tr: "Ham uydu görüntülerinin piksellerini doğrudan okuyan çok katmanlı bir görüntü modeliyle (evrişimli sinir ağı) bölgesel ekonomik faaliyeti öngörmek", en: "Predicting regional economic activity with a many-layered image model (a convolutional neural network) that reads the raw pixels of satellite images" }, cat: "dl", why: { tr: "Çok katmanlı sinir ağı kullanıldığı için derin öğrenme. Dikkat: belirleyici olan verinin türü değil, yöntemdir. Görüntülerden önce bölge başına ortalama ışık gibi özet göstergeler çıkarılıp bunlarla bir regresyon ya da karar ağacı kurulsaydı, bu klasik makine öğrenmesi olurdu.", en: "Deep learning, because a many-layered neural network is used. Note: what decides is the method, not the type of data. If summary indicators such as average light per region were extracted first and fed to a regression or a decision tree, it would be classical machine learning." } },
        { text: { tr: "Geçmiş aylardan öğrenerek gelecek ayın enflasyonunu öngören model", en: "A model that learns from past months to predict next month's inflation" }, cat: "ml", why: { tr: "Amaç öngörü, kural veriden öğreniliyor.", en: "The goal is prediction, and the rule is learned from data." } }
      ],
      takeaway: { tr: "Her derin öğrenme bir makine öğrenmesidir, her makine öğrenmesi bir yapay zekâdır; tersi doğru değildir.", en: "All deep learning is machine learning and all machine learning is AI; the reverse is not true." }
    },
    cells: [
      {
        id: "m1-u1-c1", kind: "run",
        task: { tr: "Bilgisayar eşiği kendisi seçiyor. Kodu oku ve çalıştırmadan önce tahmin et.", en: "The computer chooses the threshold itself. Read the code and predict before you run it." },
        predict: { q: { tr: "Öğrenilen eşik kaç olur?", en: "What threshold is learned?" }, options: { tr: ["30", "31", "35"], en: ["30", "31", "35"] }, answer: 1, explain: { tr: "Çıktıda her adayın hatası görünüyor: 31 ve 40 birer hata yapıyor (31'de geliri 35 olup ödemeyen kişi, 40'ta geliri 31 olup ödeyen kişi). Kodun eşitlik kuralı küçükten büyüğe giderken önce bulunanı tutmak, bu yüzden 31 seçiliyor. Başka bir eşitlik kuralı 40'ı seçebilirdi; ikisi de bu veride eşit derecede iyi. 30 listede yok: kod yalnızca verideki gelirleri deniyor.", en: "The output shows every candidate's errors: 31 and 40 each make one error (at 31 the person with 35 who did not repay, at 40 the person with 31 who did). The code's tie rule is to keep the first one found going from low to high, so 31 is chosen. Another tie rule could pick 40; both are equally good on these data. 30 is not in the list: the code only tries incomes that appear in the data." } },
        code: { tr: RULE_TR, en: RULE_EN },
        after: { tr: "Bu, bir makine öğrenmesi yönteminin en sade hâli: aday kuralları dene, veride en iyi sonucu vereni seç. Gerçek yöntemler çok daha fazla değişken ve aday kural kullanır, ama fikir aynı.", en: "This is machine learning in its plainest form: try candidate rules and keep the one that works best on the data. Real methods use many more variables and candidate rules, but the idea is the same." }
      },
      {
        id: "m1-u1-c2", kind: "edit",
        task: { tr: "Veriye iki yeni başvuru geldi: geliri 28 olan biri borcunu <b>ödedi</b>, geliri 47 olan biri <b>ödemedi</b>. Bu iki gözlemi listelerin sonuna ekle ve kodu yeniden çalıştır. Öğrenilen kural değişti mi?", en: "Two new applications arrived: someone with an income of 28 <b>repaid</b>, someone with 47 <b>did not</b>. Add these two observations to the end of the lists and rerun the code. Did the learned rule change?" },
        code: { tr: RULE_TR, en: RULE_EN },
        solution: { tr: RULE_TR.replace("[18, 22, 25, 31, 35, 40, 44, 52]", "[18, 22, 25, 31, 35, 40, 44, 52, 28, 47]").replace("[0, 0, 0, 1, 0, 1, 1, 1]", "[0, 0, 0, 1, 0, 1, 1, 1, 1, 0]"), en: RULE_EN.replace("[18, 22, 25, 31, 35, 40, 44, 52]", "[18, 22, 25, 31, 35, 40, 44, 52, 28, 47]").replace("[0, 0, 0, 1, 0, 1, 1, 1]", "[0, 0, 0, 1, 0, 1, 1, 1, 1, 0]") },
        hints: [{ tr: "<code>gelir</code> listesinin sonuna <code>28, 47</code>, <code>odedi</code> listesinin sonuna <code>1, 0</code> ekle. Sıra önemli: iki liste aynı kişileri aynı sırada tutmalı.", en: "Add <code>28, 47</code> to the end of <code>income</code> and <code>1, 0</code> to the end of <code>repaid</code>. Order matters: both lists must hold the same people in the same order." }],
        checks: [
          { py: { tr: "len(gelir) == 10 and len(odedi) == 10 and gelir[-2:] == [28, 47] and odedi[-2:] == [1, 0]", en: "len(income) == 10 and len(repaid) == 10 and income[-2:] == [28, 47] and repaid[-2:] == [1, 0]" }, msg: { tr: "İki listenin sonunda da yeni iki gözlem olmalı: gelir 28 ve 47, ödedi 1 ve 0.", en: "Both lists should end with the two new observations: income 28 and 47, repaid 1 and 0." } },
          { py: { tr: "en_iyi_esik == 28", en: "best_threshold == 28" }, msg: { tr: "Yeni veriyle öğrenilen eşik 28 olmalı.", en: "With the new data the learned threshold should be 28." } }
        ],
        after: { tr: "Eşik 31'den 28'e indi (eğitim hatası 2; artık eşitlik yok). Kuralı kimse değiştirmedi; veri değişti, kural da onunla değişti. Makine öğrenmesinin gücü de riski de buradan gelir: model, verinin söylediğini öğrenir. Veri yanlı ya da hatalıysa öğrendiği kural da öyle olur. Not: buradaki hata, kuralın seçildiği verideki <b>eğitim hatası</b>. Kuralın yeni başvurularda ne kadar iyi çalıştığı, seçimde kullanılmamış gözlemlerde ayrıca ölçülmelidir (Modül 2).", en: "The threshold fell from 31 to 28 (2 training errors; no tie any more). Nobody changed the rule; the data changed and the rule followed. This is both the strength and the risk of machine learning: a model learns what the data say. If the data are biased or wrong, so is the learned rule. Note: the errors here are <b>training errors</b> on the data used to pick the rule. How well the rule works on new applications must be measured separately, on observations not used for the choice (Module 2)." }
      },
      {
        id: "m1-u1-c3", kind: "interpret",
        task: { tr: "YZ'den bu üç kavramı açıklamasını istedik. Bazı cümleler yanlış ya da abartılı. Onları bul.", en: "We asked the AI to explain these three concepts. Some sentences are wrong or overstated. Find them." },
        prompt: { tr: "Yapay zekâ, makine öğrenmesi ve derin öğrenme arasındaki farkı bir iktisat öğrencisine açıklar mısın?", en: "Can you explain the difference between AI, machine learning and deep learning to an economics student?" },
        sentences: {
          tr: ["Makine öğrenmesi, yapay zekânın kuralları veriden öğrenen alt alanıdır.", "Derin öğrenme, çok katmanlı sinir ağları kullanan bir makine öğrenmesi türüdür.", "Derin öğrenme her zaman ekonometriden daha doğru sonuç verir.", "Ekonometri ile makine öğrenmesi doğrusal regresyon gibi bazı araçları paylaşır.", "Makine öğrenmesi modelleri neden-sonuç ilişkilerini veriden kendiliğinden bulur."],
          en: ["Machine learning is the branch of AI that learns rules from data.", "Deep learning is a type of machine learning that uses many-layered neural networks.", "Deep learning always gives more accurate results than econometrics.", "Econometrics and machine learning share some tools, such as linear regression.", "Machine learning models discover cause-and-effect relationships from data on their own."]
        },
        bad: [2, 4],
        explain: {
          tr: ["Doğru.", "Doğru.", "<b>Abartı:</b> hangi yöntemin daha iyi olduğu soruya, veriye ve veri miktarına bağlıdır. Küçük ve yapılandırılmış ekonomik verilerde basit yöntemler çoğu zaman yeterlidir.", "Doğru.", "<b>Yanlış:</b> bir model iyi öngörü yapabilir, ama bu, değişkenler arasında neden-sonuç ilişkisi bulduğu anlamına gelmez. Bu ayrım Ünite 3'ün konusu."],
          en: ["Correct.", "Correct.", "<b>Overclaim:</b> which method is better depends on the question, the data and how much data there is. With small, structured economic data, simple methods are often enough.", "Correct.", "<b>Wrong:</b> a model can predict well without having found any cause-and-effect relationship. That distinction is the topic of Unit 3."]
        }
      }
    ],
    quiz: [
      { q: { tr: "Hangisi makine öğrenmesini kural tabanlı bir programdan ayırır?", en: "What separates machine learning from a rule-based program?" }, options: { tr: ["Bilgisayarda çalışması", "Kuralların veriden öğrenilmesi", "Sonucun sayı olması"], en: ["That it runs on a computer", "That the rules are learned from data", "That the output is a number"] }, answer: 1, explain: { tr: "Kural tabanlı programda kuralı insan yazar; makine öğrenmesinde kural veriden çıkarılır.", en: "In a rule-based program a person writes the rule; in machine learning the rule is extracted from data." } },
      { q: { tr: "Gemini gibi büyük dil modelleri hangi halkada yer alır?", en: "Which ring do large language models such as Gemini belong to?" }, options: { tr: ["Yalnızca yapay zekâ", "Derin öğrenme (dolayısıyla MÖ ve YZ de)", "Ekonometri"], en: ["AI only", "Deep learning (and therefore ML and AI too)", "Econometrics"] }, answer: 1, explain: { tr: "Halkalar iç içe: en içteki halkada olan, dıştakilerin de içindedir.", en: "The rings are nested: whatever is in the inner ring is also inside the outer ones." } },
      { q: { tr: "Ekonometri ile makine öğrenmesi arasındaki temel fark çoğu zaman nedir?", en: "What is usually the main difference between econometrics and machine learning?" }, options: { tr: ["Kullandıkları programlama dili", "Sordukları soru: katsayıyı yorumlamak mı, iyi öngörmek mi", "Veri setinin büyüklüğü"], en: ["The programming language they use", "The question they ask: interpreting a coefficient or predicting well", "The size of the data set"] }, answer: 1, explain: { tr: "Araçlar örtüşebilir; amaç farklıdır.", en: "The tools can overlap; the goal differs." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 2 — Katsayı mı, öngörü mü? (β̂ ve ŷ)                            */
  /* =================================================================== */
  const SIM_TR = (seedExpr) => `import numpy as np
n, rho = 50, 0.97
b1_listesi, b2_listesi, ongoru_listesi, ongoru_ters = [], [], [], []
for i in range(200):
    r = np.random.default_rng(${seedExpr})
    metrekare = r.normal(size=n)
    oda = rho * metrekare + np.sqrt(1 - rho**2) * r.normal(size=n)
    fiyat = metrekare + oda + r.normal(size=n)
    X = np.column_stack([metrekare, oda])
    b = np.linalg.lstsq(X, fiyat, rcond=None)[0]
    b1_listesi.append(b[0])
    b2_listesi.append(b[1])
    ongoru_listesi.append(b[0] + b[1])   # alışılmış ev: x1 = 1, x2 = 1
    ongoru_ters.append(b[0] - b[1])      # alışılmadık ev: x1 = 1, x2 = -1
print("β1'in std. sapması:", round(np.std(b1_listesi), 3))
print("öngörünün std. sapması (1, 1):", round(np.std(ongoru_listesi), 3))
print("öngörünün std. sapması (1, -1):", round(np.std(ongoru_ters), 3))`;
  const SIM_EN = (seedExpr) => `import numpy as np
n, rho = 50, 0.97
b1_list, b2_list, pred_list, pred_odd = [], [], [], []
for i in range(200):
    r = np.random.default_rng(${seedExpr})
    size = r.normal(size=n)
    rooms = rho * size + np.sqrt(1 - rho**2) * r.normal(size=n)
    price = size + rooms + r.normal(size=n)
    X = np.column_stack([size, rooms])
    b = np.linalg.lstsq(X, price, rcond=None)[0]
    b1_list.append(b[0])
    b2_list.append(b[1])
    pred_list.append(b[0] + b[1])   # a typical house: x1 = 1, x2 = 1
    pred_odd.append(b[0] - b[1])    # an unusual house: x1 = 1, x2 = -1
print("std. dev. of β1:", round(np.std(b1_list), 3))
print("std. dev. of the prediction (1, 1):", round(np.std(pred_list), 3))
print("std. dev. of the prediction (1, -1):", round(np.std(pred_odd), 3))`;

  U.push({
    id: "m1-u2",
    minutes: 30,
    packages: ["numpy"],
    title: { tr: "Katsayı mı, öngörü mü?", en: "Coefficient or prediction?" },
    blurb: { tr: "Birbirine çok benzeyen iki değişken varken katsayılar oynar, öngörü istikrarlı kalır.", en: "With two very similar variables, coefficients swing while the prediction stays stable." },
    terms: [{ tr: "katsayı (β̂)", en: "coefficient (β̂)" }, { tr: "öngörü (ŷ)", en: "prediction (ŷ)" }, { tr: "çoklu doğrusal bağlantı", en: "multicollinearity" }, { tr: "örneklem", en: "sample" }],
    concept: {
      tr: `<p>Bir konutun fiyatını iki değişkenle açıklamak istediğini düşün: <b>metrekare</b> ve <b>oda sayısı</b>. Bu ikisi birlikte hareket eder; büyük evlerin odası da fazladır. Bir regresyon iki şey üretir:</p>
<ul>
<li><b>β̂ (beta şapka):</b> katsayılar. “Metrekare bir birim artınca, oda sayısı sabitken fiyat ne kadar değişir?”</li>
<li><b>ŷ (y şapka):</b> öngörü. “Bu özelliklere sahip bir evin fiyatı ne olur?”</li>
</ul>
<p>İki değişken çok yakından birlikte hareket ettiğinde veri, etkiyi ikisi arasında nasıl paylaştıracağını bilemez. Bir örneklemde metrekareye büyük, odaya küçük katsayı çıkar; başka bir örneklemde tersi. Katsayılar birbirini telafi eder: biri artınca öteki düşer. Buna <b>çoklu doğrusal bağlantı</b> denir.</p>
<p>Ama iki katsayının <b>toplam etkisi</b>, yani veride sık görülen bileşimlerdeki öngörü (büyük ev, çok oda), istikrarlıdır. Böyle evlerin fiyatını öngörmek istiyorsan bu sorun seni pek etkilemez; tek bir katsayıyı yorumlamak istiyorsan ciddi bir sorundur. Dikkat: küçük metrekare ama çok oda gibi veride nadir görülen bir bileşimde öngörü de oynaklaşır.</p>
<div class="box econ"><b>Dersin ana ayrımı:</b> ekonometri çoğunlukla <b>β̂</b> ile, makine öğrenmesi <b>ŷ</b> ile ilgilenir. Bu yüzden makine öğrenmesi modelleri katsayılarının ne kadar “anlamlı” olduğuna göre değil, yeni gözlemlerde ne kadar iyi öngörü yaptıklarına göre değerlendirilir.</div>`,
      en: `<p>Suppose you want to explain a house's price with two variables: <b>floor area</b> and <b>number of rooms</b>. The two move together; big houses have more rooms. A regression produces two things:</p>
<ul>
<li><b>β̂ (beta hat):</b> the coefficients. “By how much does the price change when floor area rises by one unit, holding rooms fixed?”</li>
<li><b>ŷ (y hat):</b> the prediction. “What is the price of a house with these features?”</li>
</ul>
<p>When two variables move very closely together, the data cannot tell how to split the effect between them. In one sample floor area gets a large coefficient and rooms a small one; in another sample the reverse. The coefficients offset each other: when one rises the other falls. This is called <b>multicollinearity</b>.</p>
<p>But the <b>combined effect</b> of the two coefficients, i.e. the prediction for combinations common in the data (a big house with many rooms), is stable. If you want to predict the price of such houses, the problem barely affects you; if you want to interpret a single coefficient, it is a serious problem. Note: for a combination rare in the data, such as a small floor area with many rooms, the prediction becomes unstable too.</p>
<div class="box econ"><b>The key distinction of the course:</b> econometrics is mostly concerned with <b>β̂</b>, machine learning with <b>ŷ</b>. That is why machine learning models are judged not by how “significant” their coefficients are but by how well they predict new observations.</div>`
    },
    playground: {
      type: "collinear",
      intro: { tr: "Her nokta, aynı gerçek dünyadan çekilmiş 50 gözlemlik bir örneklemin sonucu. Korelasyonu değiştir ve iki grafiği karşılaştır: soldaki katsayılar, sağdaki öngörü.", en: "Each dot is the result of a sample of 50 observations drawn from the same true world. Change the correlation and compare the two charts: coefficients on the left, the prediction on the right." },
      takeaway: { tr: "Korelasyon yükseldikçe katsayılar köşegen boyunca yayılır (biri artınca öteki düşer), öngörü ise dar bir bantta kalır.", en: "As the correlation rises, the coefficients spread along a diagonal (one up, the other down), while the prediction stays in a narrow band." }
    },
    cells: [
      {
        id: "m1-u2-c1", kind: "run",
        task: { tr: "Aynı gerçek dünyadan iki örneklem çekip ikisinde de regresyon kuruyoruz (değişkenler standartlaştırılmış birimlerde, gerçek katsayılar 1 ve 1).", en: "We draw two samples from the same true world and run a regression on each (variables in standardised units, true coefficients 1 and 1)." },
        predict: { q: { tr: "<b>Bu iki çekilişte</b> hangisi daha çok değişir?", en: "In <b>these two draws</b>, which changes more?" }, options: { tr: ["Katsayılar (β1, β2)", "Öngörü (1, 1)", "İkisi de aynı ölçüde"], en: ["The coefficients (β1, β2)", "The prediction (1, 1)", "Both equally"] }, answer: 0, explain: { tr: "Bu iki çekilişte katsayılar yer değiştiriyor (≈ −0,2 ile 2,2'den ≈ 2,1 ile −0,1'e) ve birbirini telafi ediyor; toplamları olan öngörü 2'ye yakın kalıyor. İki çekiliş yine de yalnızca bir örnek: deneyin genelinde ne kadar değişkenlik olduğunu bir sonraki alıştırmadaki 200 tekrarın standart sapmaları gösterir.", en: "In these two draws the coefficients swap places (≈ −0.2 and 2.2, then ≈ 2.1 and −0.1) and offset each other; their sum, the prediction, stays close to 2. Two draws are still only an example: how variable things are across the whole experiment is shown by the standard deviations of 200 repetitions in the next exercise." } },
        code: {
          tr: `import numpy as np
def orneklem_cek(tohum, n=50, rho=0.97):
    r = np.random.default_rng(tohum)
    metrekare = r.normal(size=n)
    oda = rho * metrekare + np.sqrt(1 - rho**2) * r.normal(size=n)
    fiyat = 1.0 * metrekare + 1.0 * oda + r.normal(size=n)
    X = np.column_stack([metrekare, oda])
    return np.linalg.lstsq(X, fiyat, rcond=None)[0]

for tohum in [27, 28]:
    b = orneklem_cek(tohum)
    print(f"Örneklem {tohum}: β1 = {b[0]:.2f}, β2 = {b[1]:.2f}, öngörü (1, 1) = {b.sum():.2f}")`,
          en: `import numpy as np
def draw_sample(seed, n=50, rho=0.97):
    r = np.random.default_rng(seed)
    size = r.normal(size=n)
    rooms = rho * size + np.sqrt(1 - rho**2) * r.normal(size=n)
    price = 1.0 * size + 1.0 * rooms + r.normal(size=n)
    X = np.column_stack([size, rooms])
    return np.linalg.lstsq(X, price, rcond=None)[0]

for seed in [27, 28]:
    b = draw_sample(seed)
    print(f"Sample {seed}: β1 = {b[0]:.2f}, β2 = {b[1]:.2f}, prediction (1, 1) = {b.sum():.2f}")`
        }
      },
      {
        id: "m1-u2-c2", kind: "audit",
        task: { tr: "Bir öğrenci YZ'den bu deneyi 200 kez tekrarlamasını istedi. YZ'nin vardığı sonuç gerçek olamayacak kadar iyi. Hatalı satırı bul ve düzelt.", en: "A student asked the AI to repeat this experiment 200 times. The AI's conclusion is too good to be true. Find the faulty line and fix it." },
        ai: {
          prompt: { tr: "Metrekare ile oda sayısı arasındaki korelasyon 0,97 iken regresyon katsayılarının örneklemden örnekleme ne kadar değiştiğini 200 tekrarlı bir simülasyonla göster.", en: "Show with a 200-repetition simulation how much the regression coefficients vary from sample to sample when floor area and rooms have a correlation of 0.97." },
          reply: { tr: "Elbette, 200 örneklem çekip katsayıları kaydedelim:", en: "Sure, let us draw 200 samples and record the coefficients:" },
          code: { tr: SIM_TR("0"), en: SIM_EN("0") },
          claim: { tr: "Katsayının standart sapması 0 çıktı: tahminler tamamen istikrarlı, yüksek korelasyon hiçbir sorun yaratmıyor.", en: "The coefficient's standard deviation is 0: the estimates are perfectly stable, so the high correlation causes no problem at all." }
        },
        bugLines: [5],
        lineExplain: { tr: "Rastgele sayı üreteci her turda <b>aynı tohumla (0)</b> yeniden başlatılıyor. Böylece 200 turun hepsinde birebir aynı örneklem çekiliyor; değişkenlik sıfır çıkması bundan. Hata mesajı yok, sonuç düzgün görünüyor: tipik bir sessiz hata.", en: "The random number generator is restarted with <b>the same seed (0)</b> in every round, so all 200 rounds draw exactly the same sample; that is why the variability is zero. No error message, a tidy result: a typical silent error." },
        hints: [{ tr: "Her tur farklı bir örneklem çekmeli. Tohumu tur numarasına bağlayabilirsin: <code>default_rng(i)</code>.", en: "Each round should draw a different sample. You can tie the seed to the round number: <code>default_rng(i)</code>." }],
        solution: { tr: SIM_TR("i"), en: SIM_EN("i") },
        checks: [
          { py: { tr: "np.std(b1_listesi) > 0.1", en: "np.std(b1_list) > 0.1" }, msg: { tr: "Katsayılar hâlâ hiç değişmiyor. Her tur farklı bir örneklem çekiyor mu?", en: "The coefficients still do not vary. Does each round draw a different sample?" } },
          { py: { tr: "np.std(ongoru_listesi) < np.std(b1_listesi) / 2", en: "np.std(pred_list) < np.std(b1_list) / 2" }, msg: { tr: "Öngörünün değişkenliği katsayınınkinden belirgin biçimde küçük olmalı.", en: "The prediction's variability should be clearly smaller than the coefficient's." } },
          { py: { tr: "np.std(ongoru_ters) > 3 * np.std(ongoru_listesi)", en: "np.std(pred_odd) > 3 * np.std(pred_list)" }, msg: { tr: "Alışılmadık girdide (1, −1) öngörü çok daha oynak olmalı.", en: "At the unusual input (1, −1) the prediction should be much more variable." } }
        ],
        after: { tr: "Düzeltilmiş simülasyonda katsayının standart sapması (≈ 0,55) öngörününkinin (≈ 0,14) birkaç katı. YZ'nin “hiçbir sorun yok” sonucu, kodundaki bir hatanın ürünüydü; bir simülasyon “değişkenlik sıfır” diyorsa önce rastgele sayı üretecine bak. Son satıra da dikkat: öngörü istikrarı <b>girdiye bağlı</b>. Veride sık görülen (1, 1) bileşiminde öngörü istikrarlı; küçük metrekare ama çok oda gibi alışılmadık (1, −1) bileşiminde öngörü β̂₁ − β̂₂'ye dayanır ve yayılımı ≈ 1,1'e çıkar. Bu yayılım yalnızca katsayı kestirimlerinden gelir; yeni bir evin toplam öngörü hatasına evin kendi rastgele farkı (u) da eklenir.", en: "In the corrected simulation the coefficient's standard deviation (≈ 0.55) is several times the prediction's (≈ 0.14). The AI's “no problem at all” came from a bug in its code; if a simulation says “zero variability”, check the random number generator first. Note the last line too: prediction stability <b>depends on the input</b>. At the common combination (1, 1) the prediction is stable; at an unusual combination such as (1, −1), a small floor area but many rooms, the prediction rests on β̂₁ − β̂₂ and its spread rises to ≈ 1.1. This spread comes only from the coefficient estimates; the total prediction error for a new house also includes that house's own random deviation (u)." }
      },
      {
        id: "m1-u2-c3", kind: "fill",
        task: { tr: "Katsayıların birbirini telafi ettiğini sayıyla göster: <code>b1_listesi</code> ile <code>b2_listesi</code> arasındaki korelasyonu hesapla.", en: "Show with a number that the coefficients offset each other: compute the correlation between <code>b1_list</code> and <code>b2_list</code>." },
        code: { tr: SIM_TR("i") + `\nkor = ___\nprint("β1 ile β2 korelasyonu:", round(kor, 2))`, en: SIM_EN("i") + `\ncorr = ___\nprint("correlation of β1 and β2:", round(corr, 2))` },
        solution: { tr: SIM_TR("i") + `\nkor = np.corrcoef(b1_listesi, b2_listesi)[0, 1]\nprint("β1 ile β2 korelasyonu:", round(kor, 2))`, en: SIM_EN("i") + `\ncorr = np.corrcoef(b1_list, b2_list)[0, 1]\nprint("correlation of β1 and β2:", round(corr, 2))` },
        hints: [{ tr: "<code>np.corrcoef(a, b)</code> 2×2 bir korelasyon matrisi döndürür; ihtiyacın olan değer <code>[0, 1]</code> konumunda.", en: "<code>np.corrcoef(a, b)</code> returns a 2×2 correlation matrix; the value you need is at <code>[0, 1]</code>." }],
        checks: [{ py: { tr: "abs(kor - np.corrcoef(b1_listesi, b2_listesi)[0, 1]) < 1e-9 and kor < -0.8", en: "abs(corr - np.corrcoef(b1_list, b2_list)[0, 1]) < 1e-9 and corr < -0.8" }, msg: { tr: "<code>kor</code>, iki katsayı listesi arasındaki korelasyon olmalı (güçlü negatif bir değer beklenir).", en: "<code>corr</code> should be the correlation between the two coefficient lists (a strong negative value is expected)." } }],
        after: { tr: "Korelasyon −1'e yakın: bir örneklemde β1 büyük çıktıysa β2 küçük çıkıyor. Veri iki etkiyi ayıramıyor, yalnızca toplamlarını biliyor.", en: "The correlation is close to −1: when β1 comes out large in a sample, β2 comes out small. The data cannot separate the two effects; they only know their sum." }
      },
      {
        id: "m1-u2-c4", kind: "interpret",
        task: { tr: "Tek bir örneklemden kurulan regresyonu YZ yorumladı. Hangi cümleler verinin taşıyamayacağı iddialar içeriyor?", en: "The AI interpreted a regression from a single sample. Which sentences make claims the data cannot support?" },
        prompt: { tr: "Konut fiyatı = 1,6 × metrekare − 0,4 × oda sayısı (standartlaştırılmış birimler; iki değişkenin korelasyonu 0,97). Sonuçları yorumlar mısın?", en: "House price = 1.6 × floor area − 0.4 × rooms (standardised units; the two variables have a correlation of 0.97). Can you interpret the results?" },
        sentences: {
          tr: ["Oda sayısının katsayısı negatif; yani eve oda eklemek fiyatı düşürür.", "Metrekare ile oda sayısı çok yüksek korelasyonlu olduğu için katsayılar örneklemden örnekleme büyük ölçüde değişebilir.", "İki değişken birlikte, benzer evlerin fiyatını öngörmek için yine de kullanışlı olabilir.", "Metrekarenin etkisi oda sayısının etkisinin tam dört katıdır."],
          en: ["The coefficient on rooms is negative, so adding a room to a house lowers its price.", "Because floor area and rooms are so highly correlated, the coefficients can vary a lot from sample to sample.", "Together, the two variables may still be useful for predicting the price of similar houses.", "The effect of floor area is exactly four times the effect of rooms."]
        },
        bad: [0, 3],
        explain: {
          tr: ["<b>Aşırı yorum:</b> korelasyon 0,97 iken tek bir katsayının işareti bile güvenilir değildir; başka bir örneklemde pozitif çıkabilir.", "Doğru: tam olarak ünitenin konusu.", "Doğru: öngörü, katsayıların toplam etkisine dayanır ve istikrarlıdır.", "<b>Aşırı yorum:</b> iki oynak katsayının oranı daha da oynaktır; “tam dört katı” demek verinin taşıyamayacağı bir kesinlik."],
          en: ["<b>Over-interpretation:</b> with a correlation of 0.97 even the sign of a single coefficient is unreliable; it could be positive in another sample.", "Correct: exactly the point of this unit.", "Correct: prediction relies on the combined effect of the coefficients, which is stable.", "<b>Over-interpretation:</b> the ratio of two unstable coefficients is even more unstable; “exactly four times” is a precision the data cannot support."]
        }
      }
    ],
    quiz: [
      { q: { tr: "İki açıklayıcı değişken çok yüksek korelasyonluysa en çok ne etkilenir?", en: "If two explanatory variables are very highly correlated, what is affected most?" }, options: { tr: ["Tek tek katsayıların istikrarı", "Öngörünün istikrarı", "Veri setinin büyüklüğü"], en: ["The stability of individual coefficients", "The stability of the prediction", "The size of the data set"] }, answer: 0, explain: { tr: "Veri, etkiyi iki değişken arasında güvenilir biçimde paylaştıramaz; toplam etki ise istikrarlıdır.", en: "The data cannot reliably split the effect between the two variables; the combined effect is stable." } },
      { q: { tr: "Makine öğrenmesi modelleri öncelikle neye göre değerlendirilir?", en: "What are machine learning models primarily judged by?" }, options: { tr: ["Katsayılarının anlamlılığına", "Yeni gözlemlerdeki öngörü başarısına", "Değişken sayısına"], en: ["The significance of their coefficients", "How well they predict new observations", "The number of variables"] }, answer: 1, explain: { tr: "MÖ'nün odağı ŷ'dir.", en: "ML focuses on ŷ." } },
      { q: { tr: "Bir simülasyon “katsayının standart sapması 0” diyorsa önce neyi kontrol edersin?", en: "If a simulation reports “the coefficient's standard deviation is 0”, what do you check first?" }, options: { tr: ["Bilgisayarın hızını", "Her turun gerçekten farklı bir örneklem çekip çekmediğini", "Hiçbir şeyi; sonuç doğrudur"], en: ["The computer's speed", "Whether each round really draws a different sample", "Nothing; the result is right"] }, answer: 1, explain: { tr: "Aynı tohumla yeniden başlatılan bir üreteç her turda aynı veriyi verir.", en: "A generator restarted with the same seed gives the same data every round." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 3 — Öngörü ve nedensellik                                       */
  /* =================================================================== */
  U.push({
    id: "m1-u3",
    minutes: 25,
    title: { tr: "Öngörü ve nedensellik", en: "Prediction and causality" },
    blurb: { tr: "Bir şeyi iyi öngören değişken onun nedeni olmak zorunda değil. Hangi soru hangisini ister?", en: "A variable that predicts something well need not cause it. Which question needs which?" },
    terms: [{ tr: "öngörü sorusu", en: "prediction question" }, { tr: "nedensel soru", en: "causal question" }, { tr: "ters nedensellik", en: "reverse causality" }, { tr: "ortak neden", en: "common cause" }],
    concept: {
      tr: `<p>İki soru türünü ayırmayı öğrenmek bu dersin en önemli becerilerinden biri:</p>
<ul>
<li><b>Öngörü sorusu:</b> “Bu müşteri kredisini geri öder mi?”, “Gelecek ay enflasyon kaç olur?” Burada önemli olan doğru tahmin. Hangi değişkenin neden işe yaradığı ikinci planda.</li>
<li><b>Nedensel soru:</b> “Faizi artırırsak enflasyon ne olur?”, “Kredi kartı limitini yükseltmek harcamayı artırır mı?” Burada bir şeyi <b>değiştirdiğimizde</b> ne olacağını soruyoruz. Bu, politika ve karar sorularının diliyle aynı.</li>
</ul>
<p>İyi bir öngörücü, neden olmak zorunda değil:</p>
<ul>
<li><b>Ters nedensellik:</b> şemsiye satışları yağmuru iyi öngörür, ama şemsiye satmak yağmur yağdırmaz.</li>
<li><b>Ortak neden:</b> lüks restoran rezervasyonları ekonomik büyümeyi öngörebilir; ikisini de gelir artışı yükseltir. Rezervasyonları artırmak büyüme yaratmaz.</li>
</ul>
<div class="box econ">Makine öğrenmesi öngörü sorularında çok güçlüdür. Nedensel bir soruyu yanıtlamak ise yalnızca iyi öngören bir modelle mümkün değildir; verinin nasıl üretildiğine dair ek varsayımlar ve uygun bir araştırma tasarımı gerekir. Bir modeli yorumlarken önce kendine sor: <b>soru öngörü mü, nedensellik mi?</b></div>`,
      en: `<p>Learning to tell two kinds of question apart is one of the most important skills in this course:</p>
<ul>
<li><b>Prediction question:</b> “Will this customer repay the loan?”, “What will inflation be next month?” What matters is an accurate guess. Why a variable helps is secondary.</li>
<li><b>Causal question:</b> “What happens to inflation if we raise interest rates?”, “Does raising the credit card limit increase spending?” Here we ask what happens when we <b>change</b> something. This is the language of policy and decision questions.</li>
</ul>
<p>A good predictor need not be a cause:</p>
<ul>
<li><b>Reverse causality:</b> umbrella sales predict rain well, but selling umbrellas does not make it rain.</li>
<li><b>Common cause:</b> bookings at luxury restaurants may predict economic growth; rising incomes drive both. Increasing bookings does not create growth.</li>
</ul>
<div class="box econ">Machine learning is very powerful for prediction questions. Answering a causal question, however, is not possible with a model that merely predicts well; it needs additional assumptions about how the data were generated and a suitable research design. When you interpret a model, ask yourself first: <b>is the question about prediction or causality?</b></div>`
    },
    playground: {
      type: "sorter",
      intro: { tr: "Her soruyu oku: amaç iyi tahmin mi, yoksa bir şeyi değiştirince ne olacağını bilmek mi?", en: "Read each question: is the goal a good guess, or knowing what happens when something is changed?" },
      cats: [
        { id: "pred", label: { tr: "Öngörü sorusu", en: "Prediction question" } },
        { id: "cause", label: { tr: "Nedensel soru", en: "Causal question" } }
      ],
      items: [
        { text: { tr: "Bu başvuru sahibi kredisini geri öder mi?", en: "Will this applicant repay the loan?" }, cat: "pred", why: { tr: "Bir bireyin sonucunu tahmin ediyoruz; hiçbir şeyi değiştirmiyoruz.", en: "We are guessing one person's outcome; we change nothing." } },
        { text: { tr: "Politika faizini 1 puan artırmak bir yıl içinde enflasyonu ne kadar düşürür?", en: "By how much does raising the policy rate by 1 point lower inflation within a year?" }, cat: "cause", why: { tr: "Bir müdahalenin etkisini soruyor.", en: "It asks for the effect of an intervention." } },
        { text: { tr: "Gelecek çeyrekte işsizlik oranı kaç olur?", en: "What will the unemployment rate be next quarter?" }, cat: "pred", why: { tr: "Gelecekteki bir değeri tahmin ediyoruz.", en: "We are guessing a future value." } },
        { text: { tr: "Asgari ücret artışı genç istihdamını azaltır mı?", en: "Does a minimum wage increase reduce youth employment?" }, cat: "cause", why: { tr: "Bir politikanın sonucunu soruyor.", en: "It asks for the consequence of a policy." } },
        { text: { tr: "Hangi işlemler büyük olasılıkla dolandırıcılıktır?", en: "Which transactions are most likely fraudulent?" }, cat: "pred", why: { tr: "İşlemleri risk sırasına koymak bir öngörü işidir.", en: "Ranking transactions by risk is a prediction task." } },
        { text: { tr: "Kredi kartı limitini yükseltmek müşterinin harcamasını artırır mı?", en: "Does raising the credit card limit increase the customer's spending?" }, cat: "cause", why: { tr: "“Değiştirirsek ne olur?” sorusu.", en: "A “what if we change it?” question." } },
        { text: { tr: "Bu evin piyasa değeri yaklaşık ne kadardır?", en: "Roughly what is this house's market value?" }, cat: "pred", why: { tr: "Benzer evlerden bir değer tahmini.", en: "An estimate of value from similar houses." } }
      ],
      takeaway: { tr: "“Ne olacak?” öngörü sorusudur; “Değiştirirsek ne olur?” nedensel sorudur.", en: "“What will happen?” is a prediction question; “What happens if we change it?” is a causal question." }
    },
    cells: [
      {
        id: "m1-u3-c1", kind: "interpret",
        task: { tr: "Bir banka kredi temerrüdünü öngören bir model kurdu ve YZ'den sonuçları yöneticiler için yorumlamasını istedi. Hangi cümleler öngörü modelinden nedensel sonuç çıkarıyor ya da verinin desteklemediği bir iddiada bulunuyor?", en: "A bank built a model that predicts loan default and asked the AI to interpret it for managers. Which sentences draw causal conclusions from a prediction model or make a claim the data do not support?" },
        prompt: { tr: "Temerrüt modelimizde en güçlü öngörücü 'son 3 aydaki nakit avans sayısı'. Son 3 ayda en az 3 avans çekenlerde temerrüt oranı %18, diğerlerinde %6. Müşterilerin %12'si temerrüde düşüyor. Model yeni müşterilerin %85'ini doğru sınıflandırıyor. Yönetim için yorumlar mısın?", en: "In our default model the strongest predictor is 'number of cash advances in the last 3 months'. Among customers with at least 3 advances in the last 3 months the default rate is 18%, among the others 6%. 12% of customers default. The model classifies 85% of new customers correctly. Can you interpret this for management?" },
        sentences: {
          tr: ["Son aylarda sık nakit avans çeken müşteriler daha yüksek temerrüt riski taşıyor.", "Model, risk değerlendirmesinde yararlı bir araç olabilir.", "Nakit avans limitlerini düşürürsek temerrüt oranı azalır.", "Nakit avans, müşterilerin borcunu ödeyememesinin temel nedenidir.", "Nakit avans sayısı, müşterinin zaten yaşadığı mali sıkıntının bir belirtisi olabilir.", "%85 doğruluk, modelin temerrüdü çok başarılı öngördüğünü gösteriyor."],
          en: ["Customers who took frequent cash advances recently carry a higher default risk.", "The model may be a useful tool for risk assessment.", "If we lower cash advance limits, the default rate will fall.", "Cash advances are the main reason customers fail to repay.", "The number of cash advances may be a symptom of financial distress the customer is already in.", "85% accuracy shows that the model predicts default very successfully."]
        },
        bad: [2, 3, 5],
        explain: {
          tr: ["Doğru: yönü gösteren veri var (%18'e karşı %6). Dikkat: “en güçlü öngörücü” bilgisi tek başına ilişkinin yönünü söylemez; yön için grup oranları gibi bir veri gerekir.", "Doğru, temkinli bir ifade: modelin amacına uygun. Ne kadar yararlı olduğu, doğruluğun bir temel modelle karşılaştırılmasına bağlı (son cümleye bak).", "<b>Nedensel iddia:</b> limitleri düşürmek mali sıkıntıyı ortadan kaldırmayabilir; müşteri başka yollara başvurabilir.", "<b>Nedensel iddia:</b> iyi öngörücü olmak neden olmak demek değildir.", "Doğru ve önemli: nakit avans bir neden değil, bir belirti olabilir (ortak neden).", "<b>Bağlamsız ölçüt:</b> müşterilerin %12'si temerrüde düştüğü için herkese “ödeyecek” diyen bir kural bile %88 doğru olurdu. Doğruluk, sınıf dağılımı ve bir temel modelle birlikte okunmalı (Modül 2)."],
          en: ["Fine: there are data showing the direction (18% vs 6%). Note: “strongest predictor” alone does not tell the direction of the relationship; that needs data such as group rates.", "Fine, a cautious statement consistent with the model's purpose. How useful it is depends on comparing its accuracy with a baseline (see the last sentence).", "<b>Causal claim:</b> lowering limits may not remove the financial distress; the customer may turn elsewhere.", "<b>Causal claim:</b> being a good predictor is not being a cause.", "Fine and important: cash advances may be a symptom, not a cause (a common cause).", "<b>Measure without context:</b> since 12% of customers default, even a rule that says “will repay” to everyone would be 88% accurate. Accuracy must be read with the class distribution and a baseline model (Module 2)."]
        }
      },
      {
        id: "m1-u3-c2", kind: "compare",
        task: { tr: "Aynı soruya iki YZ yanıtı. Hangisi soruyu doğru çerçeveliyor?", en: "Two AI answers to the same question. Which one frames the question correctly?" },
        prompt: { tr: "Verimize göre üniversite mezunlarının geliri daha yüksek. Üniversiteye gitmek geliri ne kadar artırır?", en: "In our data university graduates earn more. By how much does going to university raise income?" },
        options: [
          { reply: { tr: "Mezunlar ile mezun olmayanların ortalama gelir farkını hesaplayalım:", en: "Let us compute the average income gap between graduates and non-graduates:" }, code: { tr: "fark = veri.groupby(\"mezun\")[\"gelir\"].mean().diff().iloc[-1]\nprint(fark)", en: "gap = data.groupby(\"graduate\")[\"income\"].mean().diff().iloc[-1]\nprint(gap)" }, claim: { tr: "Üniversiteye gitmek geliri bu fark kadar artırır.", en: "Going to university raises income by exactly this gap." } },
          { reply: { tr: "Ortalama farkı hesaplayabiliriz, ama bu farkın ne kadarının eğitimden geldiğini bu veri tek başına söylemez:", en: "We can compute the average gap, but these data alone cannot say how much of it comes from education:" }, code: { tr: "fark = veri.groupby(\"mezun\")[\"gelir\"].mean().diff().iloc[-1]\nprint(fark)", en: "gap = data.groupby(\"graduate\")[\"income\"].mean().diff().iloc[-1]\nprint(gap)" }, claim: { tr: "Bu, mezunlar ile diğerleri arasındaki ortalama farktır. Aile geliri ya da yetenek gibi etkenler hem üniversiteye gitmeyi hem geliri etkileyebilir; farkın tamamını eğitime bağlamak için ek bir araştırma tasarımı gerekir.", en: "This is the average gap between graduates and others. Factors such as family income or ability may affect both university attendance and income; attributing the whole gap to education needs an additional research design." } }
        ],
        answer: 1,
        reasons: {
          tr: ["A daha kesin bir sayı verdiği için daha kullanışlıdır.", "Kod aynı; fark, B'nin ortalama farkı nedensel etki gibi sunmaması.", "B daha uzun olduğu için daha doğrudur."],
          en: ["A is more useful because it gives a more definite number.", "The code is the same; the difference is that B does not present the average gap as a causal effect.", "B is more accurate because it is longer."]
        },
        reasonAnswer: 1,
        explain: { tr: "İki yanıt da aynı sayıyı hesaplıyor. Hata kodda değil yorumda: A, ortak nedenleri yok sayarak bir öngörü ilişkisini nedensel etki gibi sunuyor.", en: "Both answers compute the same number. The error is not in the code but in the interpretation: A ignores common causes and presents a predictive relationship as a causal effect." }
      },
      {
        id: "m1-u3-c3", kind: "prompt",
        task: { tr: "Temerrüt modelinin sonuçlarını YZ'ye yorumlatacaksın. Yukarıdaki hataları önleyecek bir istek yaz.", en: "You are going to have the AI interpret the default model's results. Write a prompt that prevents the mistakes above." },
        weak: {
          prompt: { tr: "Temerrüt modelimin sonuçlarını yorumla.", en: "Interpret my default model's results." },
          reply: { tr: "Modelinize göre nakit avans temerrüdün temel nedeni. Limitleri düşürerek temerrüdü azaltabilirsiniz.", en: "According to your model, cash advances are the main cause of default. You can reduce defaults by lowering limits." },
          code: { tr: "# kod yok", en: "# no code" },
          claim: { tr: "Limitleri düşürün.", en: "Lower the limits." }
        },
        checklist: [
          { label: { tr: "Modelin amacı: öngörü", en: "The model's purpose: prediction" }, why: { tr: "Modelin bir öngörü modeli olduğunu söyle.", en: "Say that it is a prediction model." }, re: { tr: "öngörü|tahmin|sınıflandır", en: "predict|classif|forecast" } },
          { label: { tr: "Nedensel iddia istememek", en: "No causal claims" }, why: { tr: "Neden-sonuç yorumu istemediğini açıkça yaz.", en: "State explicitly that you do not want cause-and-effect conclusions." }, re: { tr: "nedensel|neden-sonuç|neden sonuç|neden olduğunu", en: "causal|cause" } },
          { label: { tr: "Sonuçlar ve sayılar", en: "Results and numbers" }, why: { tr: "Elindeki bulguları (öngörücü, doğruluk oranı) ver.", en: "Give the findings you have (predictor, accuracy)." }, re: { tr: "nakit avans|%85|85|doğruluk", en: "cash advance|85%|85|accura" } },
          { label: { tr: "Sınırlar", en: "Limits" }, why: { tr: "Sınırları ve olası alternatif açıklamaları da yazmasını iste.", en: "Ask it to state limits and possible alternative explanations." }, re: { tr: "sınır|alternatif|belirti|ortak neden|dikkat", en: "limit|alternative|symptom|common cause|caveat" } }
        ],
        minLen: 90,
        strong: { prompt: { tr: "Bir bankanın temerrüt öngörü modelinde en güçlü öngörücü 'son 3 aydaki nakit avans sayısı'; model yeni müşterilerin %85'ini doğru sınıflandırıyor. Bu bir öngörü modelidir; sonuçları yöneticiler için 4–5 cümleyle yorumla. Neden-sonuç iddiasında bulunma ve politika önerisi verme. Nakit avansın neden bir belirti olabileceğini ve yorumun sınırlarını da yaz.", en: "In a bank's default prediction model the strongest predictor is 'number of cash advances in the last 3 months'; the model classifies 85% of new customers correctly. This is a prediction model; interpret the results for managers in 4–5 sentences. Do not make cause-and-effect claims or policy recommendations. Also explain why cash advances may be a symptom, and state the limits of the interpretation." } }
      }
    ],
    quiz: [
      { q: { tr: "Hangisi nedensel bir sorudur?", en: "Which is a causal question?" }, options: { tr: ["Bu ay hangi müşteriler hesabını kapatır?", "Komisyonu düşürürsek müşteriler hesaplarını daha az mı kapatır?", "Gelecek ay döviz kuru kaç olur?"], en: ["Which customers will close their accounts this month?", "If we cut fees, will customers close their accounts less often?", "What will the exchange rate be next month?"] }, answer: 1, explain: { tr: "Bir müdahalenin (komisyonu düşürmek) sonucunu soruyor.", en: "It asks for the result of an intervention (cutting fees)." } },
      { q: { tr: "Şemsiye satışlarının yağmuru iyi öngörmesi hangi duruma örnektir?", en: "Umbrella sales predicting rain well is an example of what?" }, options: { tr: ["Ters nedensellik", "Ölçekleme hatası", "Eksik veri"], en: ["Reverse causality", "A scaling error", "Missing data"] }, answer: 0, explain: { tr: "Yağmur şemsiye satışını artırır, tersi değil.", en: "Rain drives umbrella sales, not the other way round." } },
      { q: { tr: "İyi öngören bir model için hangisi doğrudur?", en: "Which is true of a model that predicts well?" }, options: { tr: ["Değişkenlerinin hepsi nedendir.", "Hangi değişkenin neden olduğunu tek başına söylemez.", "Politika önerisi için yeterlidir."], en: ["All of its variables are causes.", "It does not by itself say which variable is a cause.", "It is enough for a policy recommendation."] }, answer: 1, explain: { tr: "Öngörü başarısı nedensellik kanıtı değildir.", en: "Predictive success is not proof of causality." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 4 — Öğrenme türleri                                            */
  /* =================================================================== */
  const TYPE_STARTER_TR = `import pandas as pd

def problem_turu(hedef):
    # hedef: bir pandas sütunu ya da None
    # "denetimsiz", "sınıflandırma" ya da "regresyon" döndür
    pass

print(problem_turu(None))`;
  const TYPE_STARTER_EN = `import pandas as pd

def problem_type(target):
    # target: a pandas column or None
    # return "unsupervised", "classification" or "regression"
    pass

print(problem_type(None))`;
  const TYPE_SOL_TR = `import pandas as pd

def problem_turu(hedef):
    if hedef is None:
        return "denetimsiz"
    if hedef.dtype == object or hedef.nunique() <= 10:
        return "sınıflandırma"
    return "regresyon"

print(problem_turu(None))`;
  const TYPE_SOL_EN = `import pandas as pd

def problem_type(target):
    if target is None:
        return "unsupervised"
    if target.dtype == object or target.nunique() <= 10:
        return "classification"
    return "regression"

print(problem_type(None))`;

  U.push({
    id: "m1-u4",
    minutes: 25,
    packages: ["pandas"],
    title: { tr: "Öğrenme türleri", en: "Types of learning" },
    blurb: { tr: "Denetimli, denetimsiz, pekiştirmeli. Hedef var mı, hedef sayı mı, kategori mi?", en: "Supervised, unsupervised, reinforcement. Is there a target, and is it a number or a category?" },
    terms: [{ tr: "denetimli öğrenme", en: "supervised learning" }, { tr: "regresyon", en: "regression" }, { tr: "sınıflandırma", en: "classification" }, { tr: "denetimsiz öğrenme", en: "unsupervised learning" }, { tr: "pekiştirmeli öğrenme", en: "reinforcement learning" }],
    concept: {
      tr: `<p>Bir makine öğrenmesi problemine başlarken ilk soru şudur: <b>verimde öğrenilecek bir “doğru cevap” sütunu var mı?</b></p>
<ul>
<li><b>Denetimli öğrenme:</b> Evet, var. Geçmiş gözlemlerde sonucu biliyoruz (kredi ödendi mi, enflasyon kaç oldu) ve model bu sonucu öngörmeyi öğreniyor. Sonuç sütununa <b>hedef</b> denir. İki alt türü vardır:
<ul><li><b>Regresyon:</b> hedef bir sayı (enflasyon oranı, konut fiyatı, gelir).</li><li><b>Sınıflandırma:</b> hedef bir kategori (temerrüt var/yok, kredi notu A/B/C).</li></ul></li>
<li><b>Denetimsiz öğrenme:</b> Hayır, yok. Model verideki yapıyı kendisi arar: benzer müşterileri gruplamak ya da çok sayıda göstergeyi birkaç özet göstergede toplamak gibi.</li>
<li><b>Pekiştirmeli öğrenme:</b> Bir “ajan” deneme yanılmayla, aldığı ödüle göre davranışını iyileştirir. Örneğin fiyatı sürekli ayarlayıp kârı gözlemleyen bir sistem. Ekonomi ve finans uygulamalarında daha seyrek kullanılır.</li>
</ul>
<div class="box">Dikkat: “regresyon” kelimesi burada bir problem türünün adıdır (sayısal hedef). Ekonometriden bildiğin doğrusal regresyon, bu problem türü için kullanılabilecek yöntemlerden yalnızca biridir.</div>`,
      en: `<p>When starting a machine learning problem, the first question is: <b>is there a “right answer” column in my data to learn from?</b></p>
<ul>
<li><b>Supervised learning:</b> Yes. We know the outcome for past observations (was the loan repaid, what was inflation) and the model learns to predict it. The outcome column is called the <b>target</b>. There are two sub-types:
<ul><li><b>Regression:</b> the target is a number (inflation rate, house price, income).</li><li><b>Classification:</b> the target is a category (default yes/no, credit grade A/B/C).</li></ul></li>
<li><b>Unsupervised learning:</b> No. The model looks for structure in the data itself, such as grouping similar customers or summarising many indicators into a few.</li>
<li><b>Reinforcement learning:</b> An “agent” improves its behaviour by trial and error according to the reward it receives, such as a system that keeps adjusting a price and watches the profit. It is used less often in economics and finance.</li>
</ul>
<div class="box">Note: “regression” here is the name of a problem type (a numeric target). The linear regression you know from econometrics is just one of the methods that can be used for this problem type.</div>`
    },
    playground: {
      type: "sorter",
      intro: { tr: "Her problemi doğru öğrenme türüyle eşleştir. İpucu: önce “hedef sütun var mı?” diye sor, sonra “hedef sayı mı, kategori mi?”", en: "Match each problem with the right type of learning. Hint: first ask “is there a target column?”, then “is the target a number or a category?”" },
      cats: [
        { id: "reg", label: { tr: "Denetimli: regresyon", en: "Supervised: regression" } },
        { id: "cls", label: { tr: "Denetimli: sınıflandırma", en: "Supervised: classification" } },
        { id: "uns", label: { tr: "Denetimsiz", en: "Unsupervised" } },
        { id: "rl", label: { tr: "Pekiştirmeli", en: "Reinforcement" } }
      ],
      items: [
        { text: { tr: "Gelecek ayın enflasyon oranını öngörmek", en: "Predicting next month's inflation rate" }, cat: "reg", why: { tr: "Hedef sayısal bir değer.", en: "The target is a numeric value." } },
        { text: { tr: "Bir kredi başvurusunun temerrüde düşüp düşmeyeceğini öngörmek", en: "Predicting whether a loan application will default" }, cat: "cls", why: { tr: "Hedef iki kategorili: temerrüt var ya da yok.", en: "The target has two categories: default or not." } },
        { text: { tr: "Banka müşterilerini harcama alışkanlıklarına göre gruplara ayırmak (hazır grup etiketi yok)", en: "Splitting bank customers into groups by spending habits (no group labels exist)" }, cat: "uns", why: { tr: "Öğrenilecek bir hedef sütunu yok; yapı veriden çıkarılıyor.", en: "There is no target column to learn; structure is extracted from the data." } },
        { text: { tr: "Bir evin satış fiyatını tahmin etmek", en: "Estimating a house's sale price" }, cat: "reg", why: { tr: "Hedef sayısal.", en: "The target is numeric." } },
        { text: { tr: "Bir e-postanın oltalama (phishing) olup olmadığını belirlemek", en: "Deciding whether an e-mail is phishing" }, cat: "cls", why: { tr: "Hedef iki kategorili.", en: "The target has two categories." } },
        { text: { tr: "Fiyatı sürekli değiştirip satışlara bakarak kârı en yükseğe çıkarmayı öğrenen bir sistem", en: "A system that learns to maximise profit by changing the price and watching sales" }, cat: "rl", why: { tr: "Deneme yanılma ve ödül (kâr) ile öğrenme.", en: "Learning by trial and error and reward (profit)." } },
        { text: { tr: "Yüzlerce makro göstergeyi birkaç özet göstergede toplamak", en: "Summarising hundreds of macro indicators into a few summary indicators" }, cat: "uns", why: { tr: "Hedef yok; amaç verinin yapısını özetlemek.", en: "No target; the goal is to summarise the data's structure." } },
        { text: { tr: "Bir şirketin kredi notunu (AAA, AA, A…) öngörmek", en: "Predicting a company's credit rating (AAA, AA, A…)" }, cat: "cls", why: { tr: "Hedef sıralı da olsa bir kategori.", en: "The target is a category, even if an ordered one." } }
      ],
      takeaway: { tr: "Hedef yoksa denetimsiz; hedef sayıysa regresyon; hedef kategoriyse sınıflandırma.", en: "No target: unsupervised; numeric target: regression; categorical target: classification." }
    },
    cells: [
      {
        id: "m1-u4-c1", kind: "run",
        task: { tr: "Kredi tablosunda hangi sütun hedef olabilir? Önce tahmin et, sonra çalıştır.", en: "Which column in the loan table could be the target? Predict first, then run." },
        predict: { q: { tr: "<code>temerrut</code> sütunu kaç farklı değer alır ve bu hangi problem türüne işaret eder?", en: "How many distinct values does the <code>default</code> column take, and which problem type does that point to?" }, options: { tr: ["2 değer: sınıflandırma", "10 değer: regresyon", "1 değer: denetimsiz"], en: ["2 values: classification", "10 values: regression", "1 value: unsupervised"] }, answer: 0, explain: { tr: "Yalnızca 0 ve 1: iki kategorili bir hedef, yani sınıflandırma.", en: "Only 0 and 1: a two-category target, so classification." } },
        code: {
          tr: K.tr + `\nprint(kredi["temerrut"].nunique(), "farklı değer:", sorted(kredi["temerrut"].unique()))\nprint(kredi["kart_harcamasi"].nunique(), "farklı değer (kart harcaması)")`,
          en: K.en + `\nprint(loans["default"].nunique(), "distinct values:", sorted(loans["default"].unique()))\nprint(loans["card_spending"].nunique(), "distinct values (card spending)")`
        },
        after: { tr: "Aynı tablodan iki farklı problem kurulabilir: hedef <code>temerrut</code> ise sınıflandırma, hedef <code>kart_harcamasi</code> ise regresyon. Problem türünü veri değil, sorduğun soru belirler.", en: "Two different problems can be built from the same table: with <code>default</code> as the target it is classification, with <code>card_spending</code> it is regression. The question you ask, not the data, sets the problem type." }
      },
      {
        id: "m1-u4-c2", kind: "compare",
        task: { tr: "Bir öğrenci YZ'ye müşteri segmentasyonu için ne yapması gerektiğini sordu. Hangi yanıt problemi doğru tanımlıyor?", en: "A student asked the AI what to do for customer segmentation. Which answer defines the problem correctly?" },
        prompt: { tr: "Müşterilerimi harcama alışkanlıklarına göre gruplara ayırmak istiyorum. Elimde hazır bir segment bilgisi yok. Hangi yaklaşımı kullanmalıyım?", en: "I want to split my customers into groups by spending habits. I have no existing segment labels. Which approach should I use?" },
        options: [
          { reply: { tr: "Bir sınıflandırma modeli kurmalısınız:", en: "You should build a classification model:" }, code: { tr: "X = musteri.drop(columns=[\"segment\"])\ny = musteri[\"segment\"]", en: "X = customers.drop(columns=[\"segment\"])\ny = customers[\"segment\"]" }, claim: { tr: "Model segmentleri öğrenip yeni müşterileri sınıflandırır.", en: "The model learns the segments and classifies new customers." } },
          { reply: { tr: "Elinizde hedef sütun olmadığı için bu bir denetimsiz öğrenme problemi:", en: "Since you have no target column, this is an unsupervised learning problem:" }, code: { tr: "X = musteri[[\"aylik_harcama\", \"islem_sayisi\", \"online_oran\"]]\n# hedef (y) yok: gruplar verideki benzerliklerden çıkarılacak", en: "X = customers[[\"monthly_spending\", \"transactions\", \"online_share\"]]\n# no target (y): groups will come from similarities in the data" }, claim: { tr: "Gruplar veriden çıkarılır; sonra her grubun ne anlama geldiğini senin yorumlaman gerekir.", en: "The groups come from the data; you then need to interpret what each group means." } }
        ],
        answer: 1,
        reasons: {
          tr: ["A daha çok kod içerdiği için daha iyi.", "A, veride olmayan bir <b>segment</b> sütununu varsayıyor; B hedef olmadığını doğru tespit ediyor.", "İkisi de aynı problemi çözüyor."],
          en: ["A is better because it has more code.", "A assumes a <b>segment</b> column that does not exist; B correctly notes there is no target.", "Both solve the same problem."]
        },
        reasonAnswer: 1,
        explain: { tr: "YZ, var olmayan bir sütunu varsaymak gibi bir uydurma yaptı. Kod çalıştırılınca hata verir; daha kötüsü, problemin türü baştan yanlış tanımlanmış olur.", en: "The AI made something up by assuming a column that does not exist. The code would fail when run; worse, the problem type is wrong from the start." }
      },
      {
        id: "m1-u4-c3", kind: "challenge",
        task: { tr: "Bir hedef sütununa bakıp problem türünü söyleyen bir fonksiyon yaz. Aşağıdaki kural bu alıştırma için yapılmış <b>basitleştirici bir varsayımdır</b>, genel bir yasa değil (sınırlarını alıştırmanın sonunda göreceksin). Kural: hedef <code>None</code> ise <code>\"denetimsiz\"</code>; hedef metin içeriyorsa (<code>dtype == object</code>) ya da en fazla 10 farklı değer alıyorsa <code>\"sınıflandırma\"</code>; aksi hâlde <code>\"regresyon\"</code>.", en: "Write a function that looks at a target column and names the problem type. The rule below is a <b>simplifying assumption made for this exercise</b>, not a general law (you will see its limits at the end). Rule: if the target is <code>None</code>, return <code>\"unsupervised\"</code>; if it holds text (<code>dtype == object</code>) or takes at most 10 distinct values, return <code>\"classification\"</code>; otherwise <code>\"regression\"</code>." },
        code: { tr: TYPE_STARTER_TR, en: TYPE_STARTER_EN },
        solution: { tr: TYPE_SOL_TR, en: TYPE_SOL_EN },
        hints: [
          { tr: "Önce <code>if hedef is None:</code> durumunu ele al.", en: "Handle <code>if target is None:</code> first." },
          { tr: "Farklı değer sayısı: <code>hedef.nunique()</code>. Metin sütunu: <code>hedef.dtype == object</code>.", en: "Number of distinct values: <code>target.nunique()</code>. Text column: <code>target.dtype == object</code>." }
        ],
        checks: [
          { py: { tr: "problem_turu(None) == \"denetimsiz\"", en: "problem_type(None) == \"unsupervised\"" }, msg: { tr: "Hedef yoksa \"denetimsiz\" dönmeli.", en: "With no target it should return \"unsupervised\"." } },
          { py: { tr: "problem_turu(pd.Series([0, 1, 1, 0, 1])) == \"sınıflandırma\"", en: "problem_type(pd.Series([0, 1, 1, 0, 1])) == \"classification\"" }, msg: { tr: "0/1 hedef için \"sınıflandırma\" dönmeli.", en: "A 0/1 target should give \"classification\"." } },
          { py: { tr: "problem_turu(pd.Series([\"A\", \"B\", \"A\", \"C\"])) == \"sınıflandırma\"", en: "problem_type(pd.Series([\"A\", \"B\", \"A\", \"C\"])) == \"classification\"" }, msg: { tr: "Metin hedef için \"sınıflandırma\" dönmeli.", en: "A text target should give \"classification\"." } },
          { py: { tr: "problem_turu(pd.Series([float(x) / 7 for x in range(40)])) == \"regresyon\"", en: "problem_type(pd.Series([float(x) / 7 for x in range(40)])) == \"regression\"" }, msg: { tr: "Çok sayıda farklı sayısal değer alan hedef için \"regresyon\" dönmeli.", en: "A target with many distinct numeric values should give \"regression\"." } }
        ],
        after: { tr: "Bu kural yalnızca bir alıştırma varsayımı. İki hedefi yan yana koy: 6 evlik küçük bir örneklemde fiyatlar (1,2; 1,5; 1,5; 2,0; 2,0; 2,4 milyon TL) yalnızca 4 farklı değer alır ve kural “sınıflandırma” der; oysa hedef sürekli bir fiyattır, yani problem regresyondur. 0/1 temerrüt etiketi ise 2 değer alır ve gerçekten sınıflandırmadır. Türü değer sayısı değil, <b>hedefin anlamı</b> belirler; 1–5 arası memnuniyet puanında ikisi de savunulabilir. Ayrıca “hedef sütunu yok” bilgisi denetimsiz öğrenmeyi pekiştirmeli öğrenmeden ayırmaz: pekiştirmeli öğrenmede de hedef sütunu yoktur, ama sistem eylemlerine verilen <b>ödülle</b> öğrenir.", en: "This rule is only an exercise assumption. Put two targets side by side: in a small sample of 6 houses the prices (1.2, 1.5, 1.5, 2.0, 2.0, 2.4 million) take only 4 distinct values and the rule says “classification”, yet the target is a continuous price, so the problem is regression. A 0/1 default label takes 2 values and really is classification. What decides is <b>what the target means</b>, not how many values it takes; for a 1–5 satisfaction score both can be defended. Also, “no target column” does not separate unsupervised from reinforcement learning: reinforcement learning has no target column either, but the system learns from the <b>reward</b> given to its actions." }
      }
    ],
    quiz: [
      { q: { tr: "Hedef sütunu olmayan ve ödülle geri bildirim de almayan, yalnızca verideki yapıyı arayan bir problem hangi türdür?", en: "A problem with no target column and no reward feedback, which only looks for structure in the data, is of which type?" }, options: { tr: ["Regresyon", "Sınıflandırma", "Denetimsiz öğrenme"], en: ["Regression", "Classification", "Unsupervised learning"] }, answer: 2, explain: { tr: "Denetimsiz öğrenme hedef olmadan verideki yapıyı arar.", en: "Unsupervised learning looks for structure without a target." } },
      { q: { tr: "Konut fiyatını öngörmek hangi problem türüdür?", en: "Predicting a house price is which problem type?" }, options: { tr: ["Regresyon", "Sınıflandırma", "Pekiştirmeli öğrenme"], en: ["Regression", "Classification", "Reinforcement learning"] }, answer: 0, explain: { tr: "Hedef sayısal.", en: "The target is numeric." } },
      { q: { tr: "Makine öğrenmesinde “regresyon” kelimesi neyi anlatır?", en: "What does the word “regression” mean in machine learning?" }, options: { tr: ["Yalnızca doğrusal regresyon yöntemini", "Sayısal hedefi olan problem türünü", "Verinin geriye doğru sıralanmasını"], en: ["Only the linear regression method", "The problem type with a numeric target", "Sorting the data backwards"] }, answer: 1, explain: { tr: "Doğrusal regresyon bu problem türü için kullanılabilecek yöntemlerden biridir.", en: "Linear regression is one of the methods that can be used for this problem type." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 5 — Özellikler, hedef ve veri türleri                           */
  /* =================================================================== */
  U.push({
    id: "m1-u5",
    minutes: 25,
    packages: ["numpy", "pandas"],
    title: { tr: "Özellikler, hedef ve veri türleri", en: "Features, target and data types" },
    blurb: { tr: "X ve y'yi doğru ayırmak; sayısal, kategorik, sıralı, zaman ve metin verisi.", en: "Separating X and y correctly; numeric, categorical, ordinal, time and text data." },
    terms: [{ tr: "özellik (öznitelik)", en: "feature" }, { tr: "hedef", en: "target" }, { tr: "gözlem", en: "observation" }, { tr: "veri türü", en: "data type" }],
    concept: {
      tr: `<p>Denetimli öğrenmede veri tablosu iki parçaya ayrılır:</p>
<ul>
<li><b>Özellikler (X):</b> öngörü için kullanılan sütunlar (yaş, gelir, bölge…). Ekonometrideki açıklayıcı değişkenlere karşılık gelir.</li>
<li><b>Hedef (y):</b> öngörülmek istenen sütun (temerrüt). Bağımlı değişkene karşılık gelir.</li>
</ul>
<p>Her satır bir <b>gözlemdir</b> (bir müşteri, bir ay, bir ülke). Kimlik numarası gibi sütunlar ne özellik ne hedeftir; hiçbir şey öngörmezler ve dışarıda bırakılır. En önemli kural: <b>hedef asla özelliklerin arasında kalmamalı.</b> Kalırsa model cevabı soruda görür ve olağanüstü başarılı görünür.</p>
<p>Sütunların <b>türü</b> neyle nasıl çalışılacağını belirler:</p>
<ul>
<li><b>Sayısal:</b> gelir, yaş, enflasyon. Sürekli ya da kesikli olabilir.</li>
<li><b>Kategorik:</b> bölge, sektör. Kategoriler arasında sıra yoktur.</li>
<li><b>Sıralı:</b> kredi notu (AAA > AA > A), eğitim düzeyi. Sıra vardır ama aralıklar eşit değildir.</li>
<li><b>Zaman:</b> tarih ve saat. Sıra ve aralık önemlidir.</li>
<li><b>Metin:</b> haber, açıklama, toplantı metni. Sayıya dönüştürülmeden kullanılamaz.</li>
</ul>
<div class="box">İki tuzak: sayı gibi görünen kategoriler (il plaka kodu, posta kodu) ve metin olarak saklanmış sayılar (“45.000 TL”). Bilgisayar ilkini sayı, ikincisini metin sanır.</div>`,
      en: `<p>In supervised learning the data table is split into two parts:</p>
<ul>
<li><b>Features (X):</b> the columns used for prediction (age, income, region…). They correspond to the explanatory variables of econometrics.</li>
<li><b>Target (y):</b> the column to be predicted (default). It corresponds to the dependent variable.</li>
</ul>
<p>Each row is an <b>observation</b> (a customer, a month, a country). Columns such as an ID number are neither features nor target; they predict nothing and are left out. The most important rule: <b>the target must never remain among the features.</b> If it does, the model sees the answer in the question and looks extraordinarily successful.</p>
<p>The <b>type</b> of a column determines how to work with it:</p>
<ul>
<li><b>Numeric:</b> income, age, inflation. Continuous or discrete.</li>
<li><b>Categorical:</b> region, sector. The categories have no order.</li>
<li><b>Ordinal:</b> credit rating (AAA > AA > A), education level. There is an order, but the gaps are not equal.</li>
<li><b>Time:</b> dates and times. Order and spacing matter.</li>
<li><b>Text:</b> news, descriptions, meeting minutes. Cannot be used without turning it into numbers.</li>
</ul>
<div class="box">Two traps: categories that look like numbers (postcodes, area codes) and numbers stored as text (“45,000 USD”). The computer takes the first for numbers and the second for text.</div>`
    },
    playground: {
      type: "sorter",
      intro: { tr: "Her sütunun veri türünü seç.", en: "Choose the data type of each column." },
      cats: [
        { id: "num", label: { tr: "Sayısal", en: "Numeric" } },
        { id: "cat", label: { tr: "Kategorik", en: "Categorical" } },
        { id: "ord", label: { tr: "Sıralı", en: "Ordinal" } },
        { id: "time", label: { tr: "Zaman", en: "Time" } },
        { id: "text", label: { tr: "Metin", en: "Text" } }
      ],
      items: [
        { text: { tr: "Aylık gelir (TL)", en: "Monthly income" }, cat: "num", why: { tr: "Aritmetik işlem yapılabilen bir sayı.", en: "A number you can do arithmetic with." } },
        { text: { tr: "Bölge (Doğu, Batı, Merkez)", en: "Region (East, West, Central)" }, cat: "cat", why: { tr: "Kategoriler arasında sıra yok.", en: "The categories have no order." } },
        { text: { tr: "Kredi notu (AAA, AA, A, BBB)", en: "Credit rating (AAA, AA, A, BBB)" }, cat: "ord", why: { tr: "Sıra var, ama notlar arası “uzaklıklar” eşit değil.", en: "There is an order, but the “distances” between grades are not equal." } },
        { text: { tr: "Başvuru tarihi", en: "Application date" }, cat: "time", why: { tr: "Zaman sırası ve aralığı önemli.", en: "Time order and spacing matter." } },
        { text: { tr: "Müşterinin başvuru formuna yazdığı açıklama", en: "The note the customer wrote on the application form" }, cat: "text", why: { tr: "Serbest metin.", en: "Free text." } },
        { text: { tr: "İl plaka kodu (21, 34, 06)", en: "Postcode area number (21, 34, 06)" }, cat: "cat", why: { tr: "Sayı gibi görünüyor ama bir etiket: 34, 21'in “fazlası” değil.", en: "It looks like a number but it is a label: 34 is not “more” than 21." } },
        { text: { tr: "Eğitim düzeyi (ilkokul, lise, üniversite)", en: "Education level (primary, secondary, university)" }, cat: "ord", why: { tr: "Doğal bir sıra var.", en: "There is a natural order." } }
      ],
      takeaway: { tr: "Bir sütunun türü, onu nasıl hazırlayacağını belirler. Görünüşe değil anlama bak.", en: "A column's type determines how to prepare it. Look at the meaning, not the appearance." }
    },
    cells: [
      {
        id: "m1-u5-c1", kind: "run",
        task: { tr: "Pandas her sütuna bir tür atar. Önce tahmin et, sonra çalıştır.", en: "Pandas gives each column a type. Predict first, then run." },
        predict: { q: { tr: "<code>gelir</code> sütununun türü ne çıkar?", en: "What type does the <code>income</code> column get?" }, options: { tr: ["int64 (tam sayı)", "float64 (ondalıklı sayı)", "object (metin)"], en: ["int64 (integer)", "float64 (decimal)", "object (text)"] }, answer: 1, explain: { tr: "Gelirler tam sayı, ama sütunda iki eksik değer (NaN) var. NaN bir ondalıklı sayı türü olduğu için pandas tüm sütunu float64 yapar.", en: "The incomes are whole numbers, but the column has two missing values (NaN). NaN is a floating-point value, so pandas makes the whole column float64." } },
        code: { tr: K.tr + `\nprint(kredi.dtypes)`, en: K.en + `\nprint(loans.dtypes)` },
        after: { tr: "<code>bolge</code> sütunu <code>object</code>, yani metin. <code>musteri</code> ise <code>int64</code>: pandas'a göre bir sayı, ama anlam olarak yalnızca bir kimlik numarası.", en: "<code>region</code> is <code>object</code>, i.e. text. <code>customer</code> is <code>int64</code>: a number to pandas, but in meaning just an ID." }
      },
      {
        id: "m1-u5-c2", kind: "audit",
        task: { tr: "YZ, temerrüt modeli için X ve y'yi ayırdı. Sonuç sessizce bozuk: modelin başarısı inanılmaz yüksek çıkacak. Hatalı satırı bul ve düzelt.", en: "The AI split X and y for a default model. The result is silently broken: the model will look unbelievably good. Find the faulty line and fix it." },
        ai: {
          prompt: { tr: "kredi tablosunda hedef 'temerrut'. Model için özellikleri (X) ve hedefi (y) ayırır mısın? 'musteri' bir kimlik numarası.", en: "In the loans table the target is 'default'. Can you split features (X) and target (y) for a model? 'customer' is an ID number." },
          reply: { tr: "Tabii, kimlik sütununu çıkarıp ayıralım:", en: "Sure, let us drop the ID column and split:" },
          code: { tr: K.tr + `\nX = kredi.drop(columns=["musteri"])\ny = kredi["temerrut"]\nprint(X.columns.tolist())\nprint(len(X), len(y))`, en: K.en + `\nX = loans.drop(columns=["customer"])\ny = loans["default"]\nprint(X.columns.tolist())\nprint(len(X), len(y))` },
          claim: { tr: "X ve y hazır. X'te kimlik sütunu yok, model doğrudan eğitilebilir.", en: "X and y are ready. X has no ID column, so the model can be trained directly." }
        },
        bugLines: [11],
        lineExplain: { tr: "<code>temerrut</code> hem y hem de X'in içinde kaldı. Model hedefi özelliklerin arasında görürse “öğrenecek” bir şey kalmaz: cevabı kopyalar. Bu tür bir modelin başarısı yanıltıcıdır.", en: "<code>default</code> is both y and inside X. If the model sees the target among the features, there is nothing left to “learn”: it copies the answer. Such a model's success is misleading." },
        hints: [{ tr: "<code>drop(columns=[...])</code> listesine hedef sütunu da ekle.", en: "Add the target column to the <code>drop(columns=[...])</code> list too." }],
        solution: { tr: K.tr + `\nX = kredi.drop(columns=["musteri", "temerrut"])\ny = kredi["temerrut"]\nprint(X.columns.tolist())\nprint(len(X), len(y))`, en: K.en + `\nX = loans.drop(columns=["customer", "default"])\ny = loans["default"]\nprint(X.columns.tolist())\nprint(len(X), len(y))` },
        checks: [
          { py: { tr: "\"temerrut\" not in X.columns and \"musteri\" not in X.columns", en: "\"default\" not in X.columns and \"customer\" not in X.columns" }, msg: { tr: "X'te ne hedef ne de kimlik sütunu olmalı.", en: "X should contain neither the target nor the ID column." } },
          { py: { tr: "len(X) == len(y) == 10 and X.shape[1] == 4", en: "len(X) == len(y) == 10 and X.shape[1] == 4" }, msg: { tr: "X'te 10 satır ve 4 özellik (yaş, gelir, kart harcaması, bölge) olmalı.", en: "X should have 10 rows and 4 features (age, income, card spending, region)." } }
        ],
        after: { tr: "YZ isteği harfiyen uyguladı: kimlik sütununu çıkar dedin, çıkardı. Hedefi de çıkarmayı söylemedin. İyi bir istek, beklediğin X sütunlarını açıkça listeler. X ile y'yi ayırmak yalnızca <b>ilk adım</b>: X'te hâlâ metin olan <code>bolge</code> sütunu ve eksik gelirler var; çoğu model bunları olduğu gibi kabul etmez. Eksikleri Ünite 7'de, kategorileri Ünite 9'da hazırlayacaksın.", en: "The AI followed the prompt to the letter: you said drop the ID column, and it did. You did not say drop the target. A good prompt lists the X columns you expect explicitly. Splitting X and y is only the <b>first step</b>: X still holds the text column <code>region</code> and missing incomes; most models will not accept these as they are. You will prepare gaps in Unit 7 and categories in Unit 9." }
      },
      {
        id: "m1-u5-c3", kind: "debug",
        task: { tr: "Gelirler bir dosyadan metin olarak gelmiş. Ortalama hesaplanamıyor. Kaynak biçim: Türkçe yazım, <b>nokta binlik ayırıcı</b> (30.000 = otuz bin), ondalık kısım yok. Sütunu sayıya çevir ve ortalamayı yazdır.", en: "The incomes came from a file as text. The mean cannot be computed. Source format: <b>comma as the thousands separator</b> (30,000 = thirty thousand), no decimal part. Convert the column to numbers and print the mean." },
        code: {
          tr: `import pandas as pd
basvuru = pd.DataFrame({"gelir": ["30.000", "52.000", "41.000"]})
print(basvuru["gelir"].mean())`,
          en: `import pandas as pd
applications = pd.DataFrame({"income": ["30,000", "52,000", "41,000"]})
print(applications["income"].mean())`
        },
        solution: {
          tr: `import pandas as pd
basvuru = pd.DataFrame({"gelir": ["30.000", "52.000", "41.000"]})
basvuru["gelir"] = basvuru["gelir"].str.replace(".", "", regex=False).astype(float)
print(basvuru["gelir"].mean())`,
          en: `import pandas as pd
applications = pd.DataFrame({"income": ["30,000", "52,000", "41,000"]})
applications["income"] = applications["income"].str.replace(",", "", regex=False).astype(float)
print(applications["income"].mean())`
        },
        hints: [
          { tr: "Türkçe yazımda binlik ayırıcı noktadır. Önce noktaları sil: <code>.str.replace(\".\", \"\", regex=False)</code>", en: "In English formatting the thousands separator is a comma. Remove the commas first: <code>.str.replace(\",\", \"\", regex=False)</code>" },
          { tr: "Sonra sayıya çevir: <code>.astype(float)</code>. Sonucu yine <code>basvuru[\"gelir\"]</code> sütununa ata.", en: "Then convert to numbers: <code>.astype(float)</code>. Assign the result back to <code>applications[\"income\"]</code>." }
        ],
        checks: [
          { py: { tr: "basvuru[\"gelir\"].dtype.kind in \"if\"", en: "applications[\"income\"].dtype.kind in \"if\"" }, msg: { tr: "Sütun hâlâ metin. Sayıya çevirip aynı sütuna atadın mı?", en: "The column is still text. Did you convert it and assign it back?" } },
          { py: { tr: "abs(basvuru[\"gelir\"].mean() - 41000) < 1e-9", en: "abs(applications[\"income\"].mean() - 41000) < 1e-9" }, msg: { tr: "Ortalama 41.000 olmalı. Noktayı ondalık ayırıcı sanmadın mı? (30.000 → 30 olmamalı)", en: "The mean should be 41,000. Did the separator get treated as a decimal point?" } }
        ],
        after: { tr: "Dikkat: noktayı silmeden doğrudan <code>astype(float)</code> deseydin, “30.000” sayısı 30 olurdu ve kod hata vermeden yanlış çalışırdı. <code>regex=False</code> da önemli: düzenli ifade modunda <code>.</code> “herhangi bir karakter” demektir ve metnin tamamını silerdi. Bu çözüm yalnızca bu kaynak biçim için geçerli. Ondalık virgül de varsa (“45.250,75”) önce binlik noktayı sil, sonra virgülü noktaya çevir: <code>.str.replace(\".\", \"\", regex=False).str.replace(\",\", \".\", regex=False).astype(float)</code> → 45250,75. Binlik ve ondalık ayırıcılar dile göre değişir; YZ'ye verinin hangi biçimde yazıldığını söyle.", en: "Note: converting without removing the commas fails, and in some languages the dot is the thousands separator, where a careless conversion would silently turn 30.000 into 30. <code>regex=False</code> matters too: in regular-expression mode <code>.</code> means “any character”. This fix only holds for this source format. If there is also a decimal part written the Turkish way (“45.250,75”), remove the thousands dot first, then turn the comma into a point: <code>.str.replace(\".\", \"\", regex=False).str.replace(\",\", \".\", regex=False).astype(float)</code> → 45250.75. Separators vary by language; tell the AI how the numbers in your data are written." }
      }
    ],
    quiz: [
      { q: { tr: "Hedef sütun özelliklerin (X) arasında kalırsa ne olur?", en: "What happens if the target column stays among the features (X)?" }, options: { tr: ["Model hata verir", "Model yanıltıcı biçimde başarılı görünür", "Hiçbir şey olmaz"], en: ["The model throws an error", "The model looks misleadingly successful", "Nothing happens"] }, answer: 1, explain: { tr: "Model cevabı soruda görür; gerçek dünyada bu bilgi olmayacaktır.", en: "The model sees the answer in the question; in the real world that information will not be available." } },
      { q: { tr: "İl plaka kodu hangi veri türüdür?", en: "What data type is a postcode area number?" }, options: { tr: ["Sayısal", "Kategorik", "Zaman"], en: ["Numeric", "Categorical", "Time"] }, answer: 1, explain: { tr: "Sayılarla yazılır ama bir etikettir; ortalaması anlamsızdır.", en: "It is written with digits but it is a label; its mean is meaningless." } },
      { q: { tr: "Kredi notu (AAA, AA, A) neden “sıralı” bir türdür?", en: "Why is a credit rating (AAA, AA, A) an “ordinal” type?" }, options: { tr: ["Harflerle yazıldığı için", "Doğal bir sırası olduğu ama aralıkları eşit olmadığı için", "Metin olduğu için"], en: ["Because it is written with letters", "Because it has a natural order but unequal gaps", "Because it is text"] }, answer: 1, explain: { tr: "AAA, AA'dan iyidir; ama aradaki fark AA ile A arasındaki farka eşit olmak zorunda değil.", en: "AAA is better than AA, but that gap need not equal the gap between AA and A." } }
    ]
  });
})();
