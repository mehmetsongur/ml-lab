/* Modül 0 — mevcut derslere "Hatayı bul" ve "Meydan okuma" hücreleri
 * © 2026 Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 */
(function () {
  "use strict";
  const m = window.LAB.modules.find((x) => x.id === "m0");
  if (!m) return;
  const X = {};

  /* ---------------- Ders 1: ilk kod ---------------- */
  X["m0-l1"] = [
    {
      id: "m0-l1-c5", kind: "debug",
      standalone: true,
      task: { tr: "Bu kod hata veriyor. Önce çalıştır ve hata mesajını oku; sonra hatayı bulup düzelt.", en: "This code raises an error. Run it first and read the message; then find and fix the bug." },
      code: { tr: 'print("Enflasyon: )\nprint(12 * 1.5)', en: 'print("Inflation: )\nprint(12 * 1.5)' },
      solution: { tr: 'print("Enflasyon:")\nprint(12 * 1.5)', en: 'print("Inflation:")\nprint(12 * 1.5)' },
      hints: [{ tr: "Hata mesajı 1. satırı gösteriyor. Bir metin tırnakla açılırsa tırnakla kapanmalı.", en: "The error points at line 1. Text opened with a quote must be closed with a quote." }, { tr: "<code>print(\"Enflasyon:\")</code>", en: "<code>print(\"Inflation:\")</code>" }],
      checks: [{ py: { tr: '"Enflasyon:" in _out and "18.0" in _out', en: '"Inflation:" in _out and "18.0" in _out' }, msg: { tr: "İki satır da çalışmalı: önce metin, sonra 18.0.", en: "Both lines should run: first the text, then 18.0." } }]
    },
    {
      id: "m0-l1-c6", kind: "challenge",
      standalone: true,
      task: { tr: "Bir ürünün fiyatı 250 TL'den 200 TL'ye indi. Yüzde değişimi tek bir <code>print</code> ile yazdır. Hesabı Python yapsın: 250 ve 200'ü formülün içinde kullan, sonucu elle yazma. (Sonuç negatif çıkmalı.)", en: "A product's price fell from 250 to 200. Print the percentage change with a single <code>print</code>. Let Python do the calculation: use 250 and 200 inside the formula rather than typing the result. (The result should be negative.)" },
      code: { tr: "# Kodunu buraya yaz\n", en: "# Write your code here\n" },
      solution: { tr: "print((200 - 250) / 250 * 100)", en: "print((200 - 250) / 250 * 100)" },
      hints: [{ tr: "Formül aynı: (yeni − eski) / eski × 100. Yeni fiyat 200, eski fiyat 250.", en: "Same formula: (new − old) / old × 100. New price 200, old price 250." }],
      checks: [
        { py: '"250" in _code and "200" in _code and "-20.0" not in _code', msg: { tr: "Sonucu elle yazma: 250 ve 200'ü formülde kullanarak hesabı Python'a yaptır.", en: "Do not type the result: use 250 and 200 in the formula so Python does the calculation." } },
        { py: '"-20.0" in _out', msg: { tr: "Çıktı −20.0 olmalı. Paydada eski fiyatı (250) kullandın mı?", en: "The output should be −20.0. Did you use the old price (250) as the denominator?" } }
      ]
    }
  ];

  /* ---------------- Ders 2: değişkenler ---------------- */
  X["m0-l2"] = [
    {
      id: "m0-l2-c6", kind: "debug",
      task: { tr: "Değişken adlarında bir sorun var. Düzelt (alt çizgi kullan) ve reel faizi yazdır.", en: "Something is wrong with the variable names. Fix them (use underscores) and print the real rate." },
      code: { tr: "nominal faiz = 45\nenflasyon = 38\nprint(nominal faiz - enflasyon)", en: "nominal rate = 45\ninflation = 38\nprint(nominal rate - inflation)" },
      solution: { tr: "nominal_faiz = 45\nenflasyon = 38\nprint(nominal_faiz - enflasyon)", en: "nominal_rate = 45\ninflation = 38\nprint(nominal_rate - inflation)" },
      hints: [{ tr: "Python boşluklu bir ismi iki ayrı kelime gibi okur.", en: "Python reads a name with a space as two separate words." }],
      checks: [{ py: '_out.strip().endswith("7")', msg: { tr: "Çıktı 7 olmalı.", en: "The output should be 7." } }, { py: { tr: "nominal_faiz == 45", en: "nominal_rate == 45" }, msg: { tr: "Değişkenin adı <code>nominal_faiz</code> olmalı.", en: "The variable should be called <code>nominal_rate</code>." } }]
    },
    {
      id: "m0-l2-c7", kind: "challenge",
      task: { tr: "Bir firmanın geliri 1200, maliyeti 900. <code>kar</code> ve <code>kar_marji</code> (kâr / gelir × 100) değişkenlerini oluştur. f-string ile <code>Kâr marjı: %25.0</code> biçiminde yazdır.", en: "A firm has revenue 1200 and cost 900. Create <code>profit</code> and <code>margin</code> (profit / revenue × 100). Print it with an f-string as <code>Profit margin: 25.0%</code>." },
      code: { tr: "gelir = 1200\nmaliyet = 900\n# kar ve kar_marji değişkenlerini oluştur, sonra yazdır\n", en: "revenue = 1200\ncost = 900\n# create profit and margin, then print\n" },
      solution: { tr: 'gelir = 1200\nmaliyet = 900\nkar = gelir - maliyet\nkar_marji = kar / gelir * 100\nprint(f"Kâr marjı: %{kar_marji}")', en: 'revenue = 1200\ncost = 900\nprofit = revenue - cost\nmargin = profit / revenue * 100\nprint(f"Profit margin: {margin}%")' },
      hints: [{ tr: "Önce <code>kar = gelir - maliyet</code>, sonra marjı bu değişkenle hesapla.", en: "First <code>profit = revenue - cost</code>, then compute the margin from it." }],
      checks: [
        { py: { tr: "kar == 300", en: "profit == 300" }, msg: { tr: "<code>kar</code> 300 olmalı.", en: "<code>profit</code> should be 300." } },
        { py: { tr: "abs(kar_marji - 25) < 1e-9", en: "abs(margin - 25) < 1e-9" }, msg: { tr: "<code>kar_marji</code> 25 olmalı.", en: "<code>margin</code> should be 25." } },
        { py: '"25.0" in _out', msg: { tr: "Sonucu yazdırmayı unutma.", en: "Do not forget to print the result." } }
      ]
    }
  ];

  /* ---------------- Ders 3: listeler ---------------- */
  X["m0-l3"] = [
    {
      id: "m0-l3-c5", kind: "debug",
      task: { tr: "İkinci çeyrek Nisan, Mayıs ve Haziran'dır. Ama bu dilim yanlış ayları veriyor. Düzelt.", en: "The second quarter is April, May and June. But this slice gives the wrong months. Fix it." },
      code: { tr: "ceyrek2 = aylik_enf[4:6]   # Nisan, Mayıs, Haziran olmalı\nprint(ceyrek2)", en: "quarter2 = monthly_inf[4:6]   # should be April, May, June\nprint(quarter2)" },
      solution: { tr: "ceyrek2 = aylik_enf[3:6]   # Nisan, Mayıs, Haziran olmalı\nprint(ceyrek2)", en: "quarter2 = monthly_inf[3:6]   # should be April, May, June\nprint(quarter2)" },
      hints: [{ tr: "Ocak 0. indekste. O hâlde Nisan kaçıncı indekste?", en: "January is at index 0. So which index is April?" }, { tr: "Dilimin sonu dahil değil: [3:6] → 3, 4, 5.", en: "The end of a slice is excluded: [3:6] → 3, 4, 5." }],
      checks: [{ py: { tr: "ceyrek2 == aylik_enf[3:6]", en: "quarter2 == monthly_inf[3:6]" }, msg: { tr: "Dilim tam üç ay içermeli: Nisan (3), Mayıs (4), Haziran (5).", en: "The slice should hold exactly three months: April (3), May (4), June (5)." } }]
    },
    {
      id: "m0-l3-c6", kind: "challenge",
      task: { tr: "İkinci yarıyılın (Temmuz–Aralık) ortalama aylık enflasyonunu hesapla ve <code>ikinci_yari_ort</code> değişkenine ata. Dikkat: listeye bir Ocak değeri eklenmiş olabilir; Temmuz–Aralık'ı indeksle seç.", en: "Compute the average monthly inflation in the second half (July–December) and store it in <code>second_half_avg</code>. Careful: a January value may have been appended; select July–December by index." },
      code: { tr: "# ikinci_yari_ort = ...\n", en: "# second_half_avg = ...\n" },
      solution: { tr: "ikinci_yari = aylik_enf[6:12]\nikinci_yari_ort = sum(ikinci_yari) / len(ikinci_yari)\nprint(round(ikinci_yari_ort, 2))", en: "second_half = monthly_inf[6:12]\nsecond_half_avg = sum(second_half) / len(second_half)\nprint(round(second_half_avg, 2))" },
      hints: [{ tr: "Temmuz 6. indekste, Aralık 11. indekste.", en: "July is at index 6, December at index 11." }, { tr: "Önce dilimi al, sonra <code>sum(...) / len(...)</code>.", en: "Take the slice first, then <code>sum(...) / len(...)</code>." }],
      checks: [{ py: { tr: "abs(ikinci_yari_ort - 2.4) < 1e-9", en: "abs(second_half_avg - 2.4) < 1e-9" }, msg: { tr: "Ortalama 2.4 olmalı (6 ayın ortalaması).", en: "The average should be 2.4 (mean of 6 months)." } }]
    }
  ];

  /* ---------------- Ders 4: döngüler ---------------- */
  X["m0-l4"] = [
    {
      id: "m0-l4-c6", kind: "debug",
      task: { tr: "Ortalama aylık enflasyonu döngüyle hesaplamak istiyoruz ama kod çalışmıyor. Hatayı bul.", en: "We want the mean monthly inflation with a loop, but the code does not run. Find the bug." },
      code: { tr: "toplam = 0\nfor deger in aylik_enf:\ntoplam = toplam + deger\nprint(round(toplam / len(aylik_enf), 2))", en: "total = 0\nfor value in monthly_inf:\ntotal = total + value\nprint(round(total / len(monthly_inf), 2))" },
      solution: { tr: "toplam = 0\nfor deger in aylik_enf:\n    toplam = toplam + deger\nprint(round(toplam / len(aylik_enf), 2))", en: "total = 0\nfor value in monthly_inf:\n    total = total + value\nprint(round(total / len(monthly_inf), 2))" },
      hints: [{ tr: "Hata türü <b>IndentationError</b>. Döngünün içindeki satır nerede durmalı?", en: "The error type is <b>IndentationError</b>. Where should the line inside the loop be?" }],
      checks: [{ py: { tr: "abs(toplam - sum(aylik_enf)) < 1e-9", en: "abs(total - sum(monthly_inf)) < 1e-9" }, msg: { tr: "Toplam, listedeki tüm değerlerin toplamı olmalı. <code>print</code> satırı döngünün dışında kalmalı.", en: "The total should be the sum of all values. Keep the <code>print</code> line outside the loop." } }]
    },
    {
      id: "m0-l4-c7", kind: "challenge",
      task: { tr: "Enflasyon art arda <b>en fazla kaç ay</b> 3.0'ın üstünde kaldı? Sonucu <code>en_uzun</code> değişkenine ata. (Örnek: Ocak 3.2 ve Şubat 4.5 art arda iki ay.)", en: "What is the <b>longest run of consecutive months</b> with inflation above 3.0? Store it in <code>longest</code>. (Example: Jan 3.2 and Feb 4.5 are two months in a row.)" },
      code: { tr: "seri = 0       # şu anki art arda ay sayısı\nen_uzun = 0    # şimdiye kadarki en uzun seri\nfor deger in aylik_enf:\n    # kodunu buraya yaz\n    pass\nprint(en_uzun)", en: "run = 0        # current number of months in a row\nlongest = 0    # longest run so far\nfor value in monthly_inf:\n    # write your code here\n    pass\nprint(longest)" },
      solution: { tr: "seri = 0       # şu anki art arda ay sayısı\nen_uzun = 0    # şimdiye kadarki en uzun seri\nfor deger in aylik_enf:\n    if deger > 3.0:\n        seri = seri + 1\n        if seri > en_uzun:\n            en_uzun = seri\n    else:\n        seri = 0\nprint(en_uzun)", en: "run = 0        # current number of months in a row\nlongest = 0    # longest run so far\nfor value in monthly_inf:\n    if value > 3.0:\n        run = run + 1\n        if run > longest:\n            longest = run\n    else:\n        run = 0\nprint(longest)" },
      hints: [
        { tr: "Koşul sağlanınca <code>seri</code>'yi bir artır; sağlanmazsa sıfırla.", en: "When the condition holds, add one to <code>run</code>; otherwise reset it to zero." },
        { tr: "Her artıştan sonra <code>seri</code>, <code>en_uzun</code>'dan büyükse <code>en_uzun</code>'u güncelle.", en: "After each increase, if <code>run</code> exceeds <code>longest</code>, update <code>longest</code>." }
      ],
      checks: [{ py: { tr: 'en_uzun == max(len(s) for s in "".join("1" if d > 3.0 else "0" for d in aylik_enf).split("0"))', en: 'longest == max(len(s) for s in "".join("1" if d > 3.0 else "0" for d in monthly_inf).split("0"))' }, msg: { tr: "Sonuç beklenen en uzun seriyle uyuşmuyor. Koşul sağlanmayınca seriyi sıfırlıyor musun?", en: "The result does not match the expected longest run. Do you reset the run when the condition fails?" } }]
    }
  ];

  /* ---------------- Ders 5: fonksiyonlar ---------------- */
  X["m0-l5"] = [
    {
      id: "m0-l5-c6", kind: "debug",
      task: { tr: "Fonksiyon sonucu ekrana yazıyor ama ikinci satır hata veriyor. Neden? Düzelt.", en: "The function prints the result, but the second line raises an error. Why? Fix it." },
      code: { tr: "def yuzde_degisim(eski, yeni):\n    sonuc = (yeni - eski) / eski * 100\n    print(sonuc)\n\nartis = yuzde_degisim(80, 100)\nprint(artis * 2)", en: "def pct_change(old, new):\n    result = (new - old) / old * 100\n    print(result)\n\nrise = pct_change(80, 100)\nprint(rise * 2)" },
      solution: { tr: "def yuzde_degisim(eski, yeni):\n    sonuc = (yeni - eski) / eski * 100\n    return sonuc\n\nartis = yuzde_degisim(80, 100)\nprint(artis * 2)", en: "def pct_change(old, new):\n    result = (new - old) / old * 100\n    return result\n\nrise = pct_change(80, 100)\nprint(rise * 2)" },
      hints: [{ tr: "Hata mesajı <code>NoneType</code> diyor: fonksiyon bir değer döndürmüyor.", en: "The message mentions <code>NoneType</code>: the function returns nothing." }, { tr: "<code>print(sonuc)</code> yerine <code>return sonuc</code> yaz.", en: "Replace <code>print(result)</code> with <code>return result</code>." }],
      checks: [{ py: { tr: "yuzde_degisim(80, 100) == 25 and artis == 25", en: "pct_change(80, 100) == 25 and rise == 25" }, msg: { tr: "Fonksiyon 25 değerini döndürmeli.", en: "The function should return 25." } }]
    },
    {
      id: "m0-l5-c7", kind: "challenge",
      task: { tr: "<code>buyume_serisi(seri)</code> fonksiyonunu yaz: düzey değerlerinden oluşan bir listeyi alsın, ardışık yüzde büyüme oranlarının listesini döndürsün. Örnek: <code>[100, 110, 121]</code> → <code>[10.0, 10.0]</code>. Giriş koşulu: büyüme oranı önceki değere bölünerek hesaplandığından listedeki değerler (sonuncusu hariç) <b>sıfırdan farklı</b> olmalı; önceki değer 0 ise oran tanımsızdır.", en: "Write <code>growth_series(levels)</code>: it takes a list of levels and returns the list of consecutive percentage growth rates. Example: <code>[100, 110, 121]</code> → <code>[10.0, 10.0]</code>. Precondition: since each rate divides by the previous value, the values (except the last) must be <b>non-zero</b>; if the previous value is 0, the rate is undefined." },
      code: { tr: "def buyume_serisi(seri):\n    # kodunu buraya yaz\n    pass\n\nprint(buyume_serisi([100, 110, 121]))", en: "def growth_series(levels):\n    # write your code here\n    pass\n\nprint(growth_series([100, 110, 121]))" },
      solution: { tr: "def buyume_serisi(seri):\n    oranlar = []\n    for i in range(1, len(seri)):\n        oranlar.append((seri[i] - seri[i - 1]) / seri[i - 1] * 100)\n    return oranlar\n\nprint(buyume_serisi([100, 110, 121]))", en: "def growth_series(levels):\n    rates = []\n    for i in range(1, len(levels)):\n        rates.append((levels[i] - levels[i - 1]) / levels[i - 1] * 100)\n    return rates\n\nprint(growth_series([100, 110, 121]))" },
      hints: [
        { tr: "Sonuç listesi girdiden bir eleman kısadır. <code>range(1, len(seri))</code> ikinci elemandan başlayan indeksleri verir.", en: "The result is one element shorter than the input. <code>range(1, len(levels))</code> gives indexes starting from the second element." },
        { tr: "Her <code>i</code> için büyüme: <code>(seri[i] - seri[i - 1]) / seri[i - 1] * 100</code>.", en: "For each <code>i</code>: <code>(levels[i] - levels[i - 1]) / levels[i - 1] * 100</code>." }
      ],
      checks: [
        { py: { tr: "buyume_serisi([100, 110, 121]) is not None and len(buyume_serisi([100, 110, 121])) == 2", en: "growth_series([100, 110, 121]) is not None and len(growth_series([100, 110, 121])) == 2" }, msg: { tr: "Fonksiyon 2 elemanlı bir liste döndürmeli (return kullandın mı?).", en: "The function should return a list of 2 elements (did you use return?)." } },
        { py: { tr: "all(abs(a - b) < 1e-9 for a, b in zip(buyume_serisi([100, 110, 121]), [10, 10]))", en: "all(abs(a - b) < 1e-9 for a, b in zip(growth_series([100, 110, 121]), [10, 10]))" }, msg: { tr: "<code>[100, 110, 121]</code> için sonuç <code>[10.0, 10.0]</code> olmalı.", en: "For <code>[100, 110, 121]</code> the result should be <code>[10.0, 10.0]</code>." } },
        { py: { tr: "all(abs(a - b) < 1e-9 for a, b in zip(buyume_serisi([50, 40, 50]), [-20, 25])) and len(buyume_serisi([50, 40, 50])) == 2", en: "all(abs(a - b) < 1e-9 for a, b in zip(growth_series([50, 40, 50]), [-20, 25])) and len(growth_series([50, 40, 50])) == 2" }, msg: { tr: "Başka bir girdiyle de çalışmalı: <code>[50, 40, 50]</code> → <code>[-20.0, 25.0]</code>.", en: "It should work for other inputs too: <code>[50, 40, 50]</code> → <code>[-20.0, 25.0]</code>." } }
      ],
      after: { tr: "Dikkat: %20 düşüşten sonra %25 artış, başlangıç düzeyine geri getirir. Yüzde değişimler simetrik değildir.", en: "Note: a 20% fall followed by a 25% rise brings you back to the start. Percentage changes are not symmetric." }
    }
  ];

  /* ---------------- Ders 6: NumPy ---------------- */
  X["m0-l6"] = [
    {
      id: "m0-l6-c6", kind: "debug",
      task: { tr: "Fiyatlara %10 zam yapmak istiyoruz ama hata alıyoruz. Neden? Düzelt.", en: "We want to raise prices by 10% but get an error. Why? Fix it." },
      code: { tr: "fiyatlar_liste = [20, 35, 50, 12, 80]\nzamli = fiyatlar_liste * 1.10\nprint(zamli)", en: "price_list = [20, 35, 50, 12, 80]\nraised = price_list * 1.10\nprint(raised)" },
      solution: { tr: "fiyatlar_liste = [20, 35, 50, 12, 80]\nzamli = np.array(fiyatlar_liste) * 1.10\nprint(zamli)", en: "price_list = [20, 35, 50, 12, 80]\nraised = np.array(price_list) * 1.10\nprint(raised)" },
      hints: [{ tr: "Bir Python listesi ondalıklı bir sayıyla çarpılamaz. Listeyi önce neye çevirmelisin?", en: "A Python list cannot be multiplied by a decimal number. What should you turn the list into first?" }, { tr: "<code>np.array(fiyatlar_liste) * 1.10</code>", en: "<code>np.array(price_list) * 1.10</code>" }],
      checks: [{ py: { tr: "__import__('numpy').allclose(zamli, [22, 38.5, 55, 13.2, 88])", en: "__import__('numpy').allclose(raised, [22, 38.5, 55, 13.2, 88])" }, msg: { tr: "Sonuç her fiyatın 1.10 katı olmalı.", en: "The result should be every price times 1.10." } }]
    },
    {
      id: "m0-l6-c7", kind: "challenge",
      task: { tr: "Günlük oynaklığı yıllığa çevirmek için standart sapma √250 ile çarpılır (yılda yaklaşık 250 işlem günü). Bu kural iki varsayıma dayanır: günlük getirilerin varyansı her gün benzerdir ve ardışık günlerin getirileri birbiriyle ilişkili değildir (seri korelasyon yok). <code>getiriler</code> dizisinden <code>yillik_oynaklik</code>'ı hesapla; <code>np.sqrt</code> kullan.", en: "To annualise daily volatility, multiply the standard deviation by √250 (about 250 trading days a year). The rule rests on two assumptions: daily returns have a similar variance every day, and returns on consecutive days are not correlated (no serial correlation). Compute <code>annual_vol</code> from <code>returns</code>; use <code>np.sqrt</code>." },
      code: { tr: "# yillik_oynaklik = ...\n", en: "# annual_vol = ...\n" },
      solution: { tr: "yillik_oynaklik = getiriler.std() * np.sqrt(250)\nprint(round(yillik_oynaklik, 2))", en: "annual_vol = returns.std() * np.sqrt(250)\nprint(round(annual_vol, 2))" },
      hints: [{ tr: "Standart sapma: <code>getiriler.std()</code>. Karekök: <code>np.sqrt(250)</code>.", en: "Standard deviation: <code>returns.std()</code>. Square root: <code>np.sqrt(250)</code>." }],
      checks: [{ py: { tr: "abs(yillik_oynaklik - getiriler.std() * 250 ** 0.5) < 1e-9", en: "abs(annual_vol - returns.std() * 250 ** 0.5) < 1e-9" }, msg: { tr: "Sonuç, günlük standart sapmanın √250 katı olmalı.", en: "The result should be the daily standard deviation times √250." } }],
      after: { tr: "Oynaklık zamanla doğrusal değil, zamanın karekökü ile büyür: bu, getirilerin birbirinden bağımsız ve varyansın sabit olduğu varsayımının sonucudur. Gerçek piyasalarda oynaklık kümelenir; bu durumda √250 kuralı yalnızca bir yaklaşıklıktır.", en: "Volatility grows with the square root of time, not linearly; this follows from assuming independent returns with a constant variance. In real markets volatility clusters, so the √250 rule is only an approximation." }
    }
  ];

  /* ---------------- Ders 7: pandas ---------------- */
  X["m0-l7"] = [
    {
      id: "m0-l7-c6", kind: "debug",
      task: { tr: "İşsizliğin 11'in üzerinde olduğu yılları seçmek istiyoruz. Hata nerede?", en: "We want the years with unemployment above 11. Where is the bug?" },
      code: { tr: "issiz_yuksek = veri[veri[issizlik] > 11]\nissiz_yuksek", en: "high_unemp = data[data[unemployment] > 11]\nhigh_unemp" },
      solution: { tr: 'issiz_yuksek = veri[veri["issizlik"] > 11]\nissiz_yuksek', en: 'high_unemp = data[data["unemployment"] > 11]\nhigh_unemp' },
      hints: [{ tr: "<b>NameError</b>: Python <code>issizlik</code>'i bir değişken sanıyor. Sütun adları nasıl yazılırdı?", en: "<b>NameError</b>: Python thinks <code>unemployment</code> is a variable. How are column names written?" }],
      checks: [{ py: { tr: 'issiz_yuksek.equals(veri[veri["issizlik"] > 11])', en: 'high_unemp.equals(data[data["unemployment"] > 11])' }, msg: { tr: "Sonuç, işsizliği 11'den büyük satırlar olmalı.", en: "The result should be the rows with unemployment above 11." } }]
    },
    {
      id: "m0-l7-c7", kind: "challenge",
      task: { tr: "Büyümenin negatif olduğu yıllardaki ortalama işsizliği <code>issiz_negatif</code>'e, pozitif olduğu yıllardakini <code>issiz_pozitif</code>'e ata. Hangisi daha yüksek?", en: "Store mean unemployment in years with negative growth in <code>unemp_neg</code>, and in years with positive growth in <code>unemp_pos</code>. Which is higher?" },
      code: { tr: "# issiz_negatif = ...\n# issiz_pozitif = ...\n", en: "# unemp_neg = ...\n# unemp_pos = ...\n" },
      solution: { tr: 'issiz_negatif = veri[veri["buyume"] < 0]["issizlik"].mean()\nissiz_pozitif = veri[veri["buyume"] > 0]["issizlik"].mean()\nprint(round(issiz_negatif, 2), round(issiz_pozitif, 2))', en: 'unemp_neg = data[data["growth"] < 0]["unemployment"].mean()\nunemp_pos = data[data["growth"] > 0]["unemployment"].mean()\nprint(round(unemp_neg, 2), round(unemp_pos, 2))' },
      hints: [{ tr: "Önce filtrele, sonra sütun seç, sonra ortalama al: <code>veri[koşul][\"issizlik\"].mean()</code>.", en: "Filter, then select the column, then take the mean: <code>data[condition][\"unemployment\"].mean()</code>." }],
      checks: [
        { py: { tr: 'abs(issiz_negatif - veri[veri["buyume"] < 0]["issizlik"].mean()) < 1e-9', en: 'abs(unemp_neg - data[data["growth"] < 0]["unemployment"].mean()) < 1e-9' }, msg: { tr: "<code>issiz_negatif</code> beklenen değerle uyuşmuyor.", en: "<code>unemp_neg</code> does not match the expected value." } },
        { py: { tr: 'abs(issiz_pozitif - veri[veri["buyume"] > 0]["issizlik"].mean()) < 1e-9', en: 'abs(unemp_pos - data[data["growth"] > 0]["unemployment"].mean()) < 1e-9' }, msg: { tr: "<code>issiz_pozitif</code> beklenen değerle uyuşmuyor.", en: "<code>unemp_pos</code> does not match the expected value." } }
      ],
      after: { tr: "Daralma yıllarında işsizlik belirgin biçimde daha yüksek. Yalnızca 2 negatif büyüme yılı olduğu için bu karşılaştırma çok küçük bir örnekleme dayanıyor.", en: "Unemployment is clearly higher in contraction years. With only 2 negative-growth years, this comparison rests on a very small sample." }
    }
  ];

  /* ---------------- Ders 8: grafik ---------------- */
  X["m0-l8"] = [
    {
      id: "m0-l8-c5", kind: "debug",
      task: { tr: "Bu kod hata vermiyor ama grafikte lejant çıkmıyor. Sessiz hatayı bul.", en: "This code raises no error, but the chart has no legend. Find the silent bug." },
      code: { tr: 'plt.plot(veri["yil"], veri["buyume"], label="Büyüme")\nplt.plot(veri["yil"], veri["issizlik"], label="İşsizlik")\nplt.title("Büyüme ve işsizlik (%)")\nplt.legend\nplt.show()', en: 'plt.plot(data["year"], data["growth"], label="Growth")\nplt.plot(data["year"], data["unemployment"], label="Unemployment")\nplt.title("Growth and unemployment (%)")\nplt.legend\nplt.show()' },
      solution: { tr: 'plt.plot(veri["yil"], veri["buyume"], label="Büyüme")\nplt.plot(veri["yil"], veri["issizlik"], label="İşsizlik")\nplt.title("Büyüme ve işsizlik (%)")\nplt.legend()\nplt.show()', en: 'plt.plot(data["year"], data["growth"], label="Growth")\nplt.plot(data["year"], data["unemployment"], label="Unemployment")\nplt.title("Growth and unemployment (%)")\nplt.legend()\nplt.show()' },
      hints: [{ tr: "Bir fonksiyonun adını yazmak onu çalıştırmaz. Fonksiyonu çağırmak için ne gerekir?", en: "Writing a function's name does not run it. What do you need to call it?" }],
      checks: [{ py: 'len(_figs) > 0 and _figs[-1]["legend"]', msg: { tr: "Lejant hâlâ görünmüyor.", en: "The legend still does not show." } }],
      after: { tr: "En sinsi hatalar hata mesajı vermeyenlerdir. Sonucu her zaman gözle kontrol et.", en: "The sneakiest bugs are the ones without an error message. Always check the result with your own eyes." }
    },
    {
      id: "m0-l8-c6", kind: "challenge",
      task: { tr: "Yıllara göre enflasyonun <b>sütun grafiğini</b> (<code>plt.bar</code>) çiz. Grafiğin başlığı ve iki eksen adı olsun.", en: "Draw a <b>bar chart</b> (<code>plt.bar</code>) of inflation by year, with a title and both axis labels." },
      code: { tr: "# kodunu buraya yaz\n", en: "# write your code here\n" },
      solution: { tr: 'plt.bar(veri["yil"], veri["enflasyon"])\nplt.title("Örnekistan: yıllık enflasyon")\nplt.xlabel("Yıl")\nplt.ylabel("Enflasyon (%)")\nplt.show()', en: 'plt.bar(data["year"], data["inflation"])\nplt.title("Exampleland: annual inflation")\nplt.xlabel("Year")\nplt.ylabel("Inflation (%)")\nplt.show()' },
      hints: [{ tr: "<code>plt.bar(x, y)</code>, <code>plt.plot</code> ile aynı biçimde kullanılır.", en: "<code>plt.bar(x, y)</code> is used just like <code>plt.plot</code>." }],
      checks: [
        { py: 'len(_figs) > 0 and _figs[-1]["patches"] >= 10', msg: { tr: "10 yıllık bir sütun grafiği bekleniyordu.", en: "A bar chart with 10 years was expected." } },
        { py: '_figs[-1]["title"].strip() != "" and _figs[-1]["xlabel"].strip() != "" and _figs[-1]["ylabel"].strip() != ""', msg: { tr: "Başlık ve iki eksen adı eksiksiz olmalı.", en: "Title and both axis labels are required." } }
      ]
    }
  ];

  /* ---------------- Ders 9: mini proje ---------------- */
  X["m0-l9"] = [
    {
      id: "m0-l9-c6", kind: "debug",
      task: { tr: "Ortalama aylık enflasyonu yazdırmak istiyoruz ama f-string hata veriyor. Neden?", en: "We want to print mean monthly inflation, but the f-string raises an error. Why?" },
      code: { tr: 'ortalama_aylik = tufe["aylik"].mean\nprint(f"Ortalama aylık enflasyon: {ortalama_aylik:.2f}%")', en: 'mean_monthly = cpi["monthly"].mean\nprint(f"Mean monthly inflation: {mean_monthly:.2f}%")' },
      solution: { tr: 'ortalama_aylik = tufe["aylik"].mean()\nprint(f"Ortalama aylık enflasyon: {ortalama_aylik:.2f}%")', en: 'mean_monthly = cpi["monthly"].mean()\nprint(f"Mean monthly inflation: {mean_monthly:.2f}%")' },
      hints: [{ tr: "<code>ortalama_aylik</code> bir sayı değil, bir fonksiyon oldu. Grafik dersindeki sessiz hatayı hatırla.", en: "<code>mean_monthly</code> holds a function, not a number. Remember the silent bug in the plotting lesson." }],
      checks: [{ py: { tr: 'abs(ortalama_aylik - tufe["aylik"].mean()) < 1e-9', en: 'abs(mean_monthly - cpi["monthly"].mean()) < 1e-9' }, msg: { tr: "<code>ortalama_aylik</code> bir sayı olmalı.", en: "<code>mean_monthly</code> should be a number." } }]
    },
    {
      id: "m0-l9-c7", kind: "challenge",
      task: { tr: "Yıllık enflasyonun %35'in üzerinde olduğu ay sayısını <code>ay_sayisi</code> değişkenine ata.", en: "Store the number of months with annual inflation above 35% in <code>n_months</code>." },
      code: { tr: "# ay_sayisi = ...\n", en: "# n_months = ...\n" },
      solution: { tr: 'ay_sayisi = (tufe["yillik"] > 35).sum()\nprint(ay_sayisi)', en: 'n_months = (cpi["annual"] > 35).sum()\nprint(n_months)' },
      hints: [{ tr: "Koşul True/False üretir; True'ları toplamak onları saymaktır: <code>(koşul).sum()</code>.", en: "A condition gives True/False; summing the Trues counts them: <code>(condition).sum()</code>." }],
      checks: [{ py: { tr: 'ay_sayisi == (tufe["yillik"] > 35).sum()', en: 'n_months == (cpi["annual"] > 35).sum()' }, msg: { tr: "Sayı beklenenle uyuşmuyor. NaN değerleri koşulu sağlamaz; ayrıca saymana gerek yok.", en: "The count does not match. NaN values never meet the condition; no need to handle them separately." } }]
    },
    {
      id: "m0-l9-c8", kind: "challenge",
      task: { tr: "Son adım: yorum. Grafiğe ve özet sayılara bakarak simüle yıllık enflasyon hakkında <b>bir cümlelik</b> yorumunu <code>yorum</code> değişkenine metin olarak yaz ve yazdır. Ne gördüğünü ve bunun neyi göstermediğini (veri simüle!) söylemeye çalış.", en: "Final step: interpretation. Looking at the chart and summary numbers, write a <b>one-sentence</b> interpretation of simulated annual inflation as text in <code>comment</code> and print it. Try to say what you see and what it does not show (the data are simulated!)." },
      code: { tr: 'yorum = "..."\nprint(yorum)', en: 'comment = "..."\nprint(comment)' },
      solution: { tr: 'yorum = "Simüle seride yıllık enflasyon ilk yıldan sonra yaklaşık %30–40 bandında dolaşıyor; veri simüle olduğu için bu gerçek bir ekonomi hakkında bilgi vermez."\nprint(yorum)', en: 'comment = "In the simulated series, annual inflation hovers around 30–40% after the first year; because the data are simulated, this says nothing about a real economy."\nprint(comment)' },
      hints: [{ tr: "Örnek yapı: “… bandında dolaşıyor / yükseliyor; ancak veri simüle olduğu için …”.", en: "Example structure: “… hovers around / rises …; but since the data are simulated, …”." }],
      checks: [{ py: { tr: 'isinstance(yorum, str) and yorum.strip() not in ("", "...") and len(yorum.split()) >= 8', en: 'isinstance(comment, str) and comment.strip() not in ("", "...") and len(comment.split()) >= 8' }, msg: { tr: "<code>yorum</code> en az 8 kelimelik bir cümle olmalı.", en: "<code>comment</code> should be a sentence of at least 8 words." } }],
      after: { tr: "Analizin son adımı her zaman yorumdur: sayıları söze dökmek ve sınırlarını belirtmek. İlerideki modüllerde YZ'nin yazdığı yorumları da aynı gözle denetleyeceksin.", en: "The last step of any analysis is interpretation: putting the numbers into words and stating their limits. In later modules you will audit the AI's interpretations with the same eye." }
    }
  ];

  m.lessons.forEach((L) => { if (X[L.id]) L.cells = L.cells.concat(X[L.id]); });
})();
