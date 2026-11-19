/* Modül 0 — genişletilmiş kavram anlatımları (şekil, tablo, çözümlü örnek, sık hatalar, özet)
 * Şekiller tools/m0_figs.py ile üretilir (window.M0_FIGS). Bileşenler: content/concept-kit.js
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 */
(function () {
  "use strict";
  const K = window.CK, F = window.M0_FIGS || {}, N = window.M0_NUMS || {};
  const U = window.M0_AI || [];
  if (!K) return;
  const { sec, cards, pit, sum, analogy, formula, steps, table, code, vs, wrap, nf } = K;
  const fig = (name, lang, cap) => K.fig(F, name, lang, cap);
  const B = {};

  /* ------------------------------------------------------------ Ünite 1 */
  B["m0-u1"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    const c3 = (N.compound || [])[1] || [3, 36, 42.58];
    return wrap(`
<p class="c-lead">${t("Bugün bir ekonomist kodun çoğunu kendisi yazmıyor: Gemini, ChatGPT ya da Claude gibi bir yapay zekâ (YZ) asistanına ne istediğini anlatıyor, YZ kodu yazıyor. Bu büyük bir kolaylık. Ama YZ bir hesap makinesi gibi çalışmaz; bu ünite, ona nasıl güveneceğini ve nerede güvenmeyeceğini anlatıyor.",
      "Today an economist does not write most code alone: they tell an artificial intelligence (AI) assistant such as Gemini, ChatGPT or Claude what they want, and the AI writes the code. That is a huge convenience. But the AI does not work like a calculator; this unit explains how far to trust it and where not to.")}</p>
${sec(1, 0, t("Sezgi: çok hızlı ama yeni bir araştırma asistanı", "Intuition: a very fast but new research assistant"), analogy("🧑‍💻", t(
      "Çok çalışkan, çok hızlı, her konuda bir şeyler okumuş bir asistan düşün. Ama işe yeni başladı: kurumun verisini, senin ne kastettiğini, hangi hatanın pahalı olduğunu bilmiyor. Ne istediğini net söylersen iyi iş çıkarır; söylemediğini tahmin eder ve <b>tahmin ettiğini hiç çekinmeden, kendinden emin bir dille sunar</b>. Ona işi verirsin, ama raporu imzalamadan önce kontrol edersin.",
      "Picture a hard-working, very fast assistant who has read a bit about everything. But they are new: they do not know your organisation's data, what you mean, or which mistakes are costly. Tell them clearly what you want and they do good work; what you leave out they guess, and <b>they present their guesses with complete confidence</b>. You hand them the job, but you check before you sign the report.")))}
${sec(2, 1, t("YZ kodu nasıl üretir?", "How does the AI produce code?"), `
<p>${t("Büyük dil modelleri, milyonlarca örnekten öğrendikleriyle bir isteğe en çok benzeyen, <b>en olası</b> kodu üretir. Kodu çalıştırıp sonucun doğru olup olmadığını kendiliğinden bilmezler. En olası kod çoğu zaman doğrudur, ama her zaman değil; özellikle senin verine ve sorunun inceliklerine özgü yerlerde.",
      "Large language models produce the <b>most likely</b> code for a request, based on what they learned from millions of examples. They do not, by themselves, run the code and know whether the result is right. The most likely code is often right, but not always, especially where it depends on your data and the fine print of your question.")}</p>
${cards([
      [0, "⚡", t("Güçlü olduğu yerler", "Where it is strong"), t("Standart kalıplar: dosya okumak, tablo düzenlemek, grafik çizmek, bir formülü koda çevirmek.", "Standard patterns: reading files, reshaping tables, drawing charts, turning a formula into code.")],
      [3, "⚠️", t("Zayıf olduğu yerler", "Where it is weak"), t("Senin verinin özellikleri, birimler, zamanlama, alan bilgisi gerektiren seçimler ve söylenmemiş varsayımlar.", "Your data's quirks, units, timing, choices that need domain knowledge, and unstated assumptions.")],
      [4, "🎭", t("Ton kanıt değildir", "Tone is not evidence"), t("“Bu kod doğru çalışacaktır” cümlesi, kodun doğru olduğunu göstermez. Açıklamanın akıcılığı doğruluğun ölçüsü değildir.", "“This code will work correctly” does not show that it does. Fluent explanations are not a measure of accuracy.")]
    ])}`)}
${sec(3, 2, t("Üç tür hata", "Three kinds of error"), `
${fig("u1_types", lang, t("<b>Şekil 1.</b> YZ'nin kod hataları iki soruya göre ayrılır: kod çalışıyor mu, sonuç doğru mu? En tehlikelisi, çalışan ama yanlış sonuç veren koddur.", "<b>Figure 1.</b> The AI's coding errors split along two questions: does the code run, and is the result right? The most dangerous is code that runs but gives a wrong result."))}
${table([t("Tür", "Kind"), t("Ne görürsün?", "What do you see?"), t("Ne kadar tehlikeli?", "How dangerous?")], [
      [t("Görünür hata", "Visible error"), t("Kırmızı bir hata mesajı; kod durur.", "A red error message; the code stops."), t("Az: fark edersin.", "Low: you notice.")],
      { cls: "bad", cells: [t("Sessiz hata", "Silent error"), t("Düzgün bir sayı ya da grafik. Hiçbir uyarı yok.", "A neat number or chart. No warning at all."), t("Çok: rapora girer.", "High: it ends up in the report.")] },
      [t("Uydurma", "Fabrication"), t("Var olmayan bir fonksiyon, seri kodu ya da kaynak. Bazen veri bulamayınca sahte veri.", "A non-existent function, series code or source. Sometimes fake data when no data are found."), t("Çok: gerçek gibi görünür.", "High: it looks real.")]
    ])}`)}
${sec(4, 3, t("Çözümlü örnek: sessiz bir hata", "Worked example: a silent error"), `
<p>${t("İstek: “Aylık enflasyonlardan yıllık enflasyonu hesapla.” Aylık enflasyon her ay %3 olsun. YZ'nin yazdığı kodun bir sürümü aylık oranları <b>topluyor</b>, öteki <b>bileşik</b> hesaplıyor. İkisi de hatasız çalışır.",
      "Request: “Compute annual inflation from monthly inflation.” Let monthly inflation be 3% every month. One version of the AI's code <b>adds</b> the monthly rates, the other <b>compounds</b> them. Both run without error.")}</p>
${vs(t("Toplama", "Adding"), code(t("yillik = sum(aylik)            # 12 × 3 = 36", "annual = sum(monthly)          # 12 × 3 = 36")) + `<p>${t("Sonuç: %36,0", "Result: 36.0%")}</p>`,
      t("Bileşik", "Compounding"), code(t("yillik = (np.prod([1 + r/100 for r in aylik]) - 1) * 100", "annual = (np.prod([1 + r/100 for r in monthly]) - 1) * 100")) + `<p>${t("Sonuç: %" + nf(c3[2], 1, "tr"), "Result: " + nf(c3[2], 1, "en") + "%")}</p>`)}
${fig("u1_compound", lang, t("<b>Şekil 2.</b> Aynı 12 aylık oranlar, iki hesap. Aylık enflasyon yükseldikçe toplama ile bileşik hesap arasındaki fark hızla büyür.", "<b>Figure 2.</b> The same 12 monthly rates, two calculations. As monthly inflation rises, the gap between adding and compounding grows fast."))}
<p>${t("Fiyatlar her ay bir önceki ayın fiyatı üzerinden artar; bu yüzden doğru hesap bileşiktir. Aylık %1'de fark yalnızca 0,7 puan olduğu için gözden kaçabilir; yüksek enflasyonlu bir ekonomide 20 puana yaklaşır.",
      "Prices rise each month on top of last month's price, so the right calculation compounds. At 1% a month the gap is only 0.7 points and easy to miss; in a high-inflation economy it approaches 20 points.")}</p>`)}
${sec(5, 4, t("Modülün ilkesi ve dört adımlı döngü", "The module's principle and the four-step loop"), `
${formula(t("Kodu YZ yazabilir, ama sonuç senindir.", "The AI may write the code, but the result is yours."), [[t("Sorumluluk", "Responsibility"), t("Raporuna giren her sayının sorumluluğu, onu YZ ile üreten kişidedir.", "Every number in your report is the responsibility of the person who produced it with the AI.")]])}
${fig("u1_loop", lang, t("<b>Şekil 3.</b> Her ünitede aynı döngüyle çalışacağız. Denetim bir sorun bulduğunda isteği düzeltip baştan başlarız.", "<b>Figure 3.</b> Every unit uses the same loop. When the audit finds a problem, we fix the request and start again."))}`)}
${sec(6, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("“Kod çalıştı, demek ki doğru”", "“The code ran, so it is right”"), t("Çalışmak yalnızca görünür hatanın olmadığını gösterir.", "Running only shows there is no visible error."), t("Sonucu bilinen bir değerle ya da sezginle sına.", "Test the result against a known value or your intuition.")],
      [t("Kendinden emin açıklamaya güvenmek", "Trusting a confident explanation"), t("YZ yanlış kodu da aynı akıcılıkla açıklar.", "The AI explains wrong code just as fluently."), t("Açıklamayı değil, kodu ve çıktıyı oku.", "Read the code and the output, not the explanation.")],
      [t("YZ'nin bulduğu veriyi sorgusuz kullanmak", "Using data the AI found without question"), t("Seri kodu, kaynak ya da veri uydurulmuş olabilir.", "The series code, source or data may be invented."), t("Kaynağı kendin aç ve doğrula.", "Open the source yourself and verify.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("YZ en olası kodu üretir; en olası kod her zaman doğru kod değildir.", "The AI produces the most likely code; the most likely code is not always the right code."), t("En tehlikeli hata sessiz hatadır: kod çalışır, sonuç yanlıştır.", "The most dangerous error is the silent one: the code runs, the result is wrong."), t("Döngü: tarif et → ürettir → denetle → yorumla.", "The loop: specify → generate → audit → interpret.")])}`);
  };

  /* ------------------------------------------------------------ Ünite 2 */
  B["m0-u2"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Okuyamadığın kodu denetleyemezsin. Ama YZ'nin yazdığı kodu okumak için Python'u ezbere yazabiliyor olman gerekmez. Bu ünitede amaç, bir kodun ne üreteceğini çalıştırmadan önce tahmin edebilmek.", "You cannot audit code you cannot read. But to read the AI's code you do not need to be able to write Python from memory. The aim of this unit is to predict what code will produce before you run it.")}</p>
${sec(1, 0, t("Sezgi: yabancı dilde gazete okumak", "Intuition: reading a newspaper in a foreign language"), analogy("📰", t(
      "Yabancı bir dilde her cümleyi kendin kuramasan da gazeteyi okuyup anlayabilirsin. Kod okumak da böyledir: birkaç kuralı ve sık geçen kalıpları bilirsen, kodun ne yapacağını satır satır izleyebilirsin. <b>Yazmak üretmektir, okumak denetlemektir</b>; bu modülde ikincisine odaklanıyoruz.",
      "You can read and understand a newspaper in a foreign language even if you could not write every sentence yourself. Reading code is similar: if you know a few rules and the common patterns, you can trace what the code does line by line. <b>Writing is producing, reading is auditing</b>; this module focuses on the second.")))}
${sec(2, 1, t("Kod okumanın beş kuralı", "Five rules for reading code"), cards([
      [0, "⬇️", t("Yukarıdan aşağıya", "Top to bottom"), t("Python satırları sırayla çalıştırır. Bir değişken kullanılmadan önce tanımlanmış olmalı.", "Python runs lines in order. A variable must be defined before it is used.")],
      [1, "📦", t("= kutuyu günceller", "= updates the box"), t("<code>x = x + 1</code>: “x'in eski değerine 1 ekle, yine x'e koy.” Eşitlik testi <code>==</code> ile yapılır.", "<code>x = x + 1</code>: “add 1 to the old value of x, store it in x again.” Equality is tested with <code>==</code>.")],
      [2, "↳", t("Girinti bloğu gösterir", "Indentation marks the block"), t("<code>for</code>, <code>if</code>, <code>def</code> altındaki içeride duran satırlar o bloğa aittir.", "Indented lines under <code>for</code>, <code>if</code>, <code>def</code> belong to that block.")],
      [3, "🔁", t("İlk iki turu elle izle", "Trace the first two rounds"), t("Döngü hatalarının çoğu ilk ya da son turda saklanır.", "Most loop errors hide in the first or last round.")],
      [4, "↩️", t("return'ü bul", "Find the return"), t("<code>return</code> yoksa fonksiyon <code>None</code> döndürür.", "Without <code>return</code> a function returns <code>None</code>.")]
    ]))}
${sec(3, 2, t("Listeler ve dilimler", "Lists and slices"), `
${fig("u2_index", lang, t("<b>Şekil 1.</b> İndeks 0'dan başlar; eksi indeks sondan sayar. <code>[a:b]</code> dilimi a'yı içerir, b'yi içermez.", "<b>Figure 1.</b> Indexing starts at 0; negative indices count from the end. The slice <code>[a:b]</code> includes a and excludes b."))}
${table([t("Yazım", "Syntax"), t("Anlamı", "Meaning"), t("Örnek sonuç", "Example result")], [
      ["<code>liste[0]</code>", t("ilk eleman", "first element"), "2.1"], ["<code>liste[-1]</code>", t("son eleman", "last element"), "2.5"],
      ["<code>liste[1:4]</code>", t("1, 2, 3 numaralı elemanlar", "elements 1, 2, 3"), "[3.4, 2.9, 1.8]"], ["<code>len(liste)</code>", t("eleman sayısı", "number of elements"), "5"],
      ['<code>x = 2.14</code><br><code>f"{x:.1f}"</code>', t("metin içine tek ondalıkla değer (2,14 → 2,1 yuvarlanır)", "a value inside text, one decimal (2.14 → 2.1 rounded)"), "'2.1'"]
    ].map((r) => (lang === "en" ? r.map((c) => c.replace("liste", "lst").replace("liste", "lst")) : r)))}`)}
${sec(4, 3, t("Çözümlü örnek: bir döngüyü elle izlemek", "Worked example: tracing a loop by hand"), `
${code(t("fiyat = 100\nfor r in [2, 3, 1]:          # aylık enflasyon, %\n    fiyat = fiyat * (1 + r / 100)\nprint(round(fiyat, 2))", "price = 100\nfor r in [2, 3, 1]:          # monthly inflation, %\n    price = price * (1 + r / 100)\nprint(round(price, 2))"))}
${table([t("Tur", "Round"), "r", t("fiyat (önce)", "price (before)"), t("fiyat (sonra)", "price (after)")], [
      ["—", "—", "—", "100"], ["1", "2", "100", t("102,00", "102.00")], ["2", "3", t("102,00", "102.00"), t("105,06", "105.06")], { cls: "hl", cells: ["3", "1", t("105,06", "105.06"), t("106,11", "106.11")] }
    ], { num: [1, 2, 3] })}
${steps([
      t("<b>Ekran çıktısı:</b> yalnızca bir satır, <code>106.11</code>. Çünkü <code>print</code> girintisiz: döngü bittikten sonra bir kez çalışır.", "<b>Output:</b> a single line, <code>106.11</code>. Because <code>print</code> is not indented, it runs once after the loop."),
      t("<code>print</code> içeride olsaydı (4 boşluk girintili) üç satır yazardı: 102.0, 105.06, 106.11. <b>Tek bir girinti sonucu değiştirir.</b>", "If <code>print</code> were inside (indented 4 spaces) it would print three lines: 102.0, 105.06, 106.11. <b>One indentation changes the result.</b>"),
      t("Sağlama: üç ayda yaklaşık %6 artış beklenir; 106,11 makul.", "Sanity check: about 6% over three months is expected; 106.11 is plausible.")
    ])}`)}
${sec(5, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Kodu atlayarak çıktıya bakmak", "Skipping the code and looking at the output"), t("Çıktının neden öyle olduğunu bilmezsen yanlış olduğunu da fark edemezsin.", "If you don't know why the output is what it is, you can't tell when it is wrong."), t("Önce tahmin et, sonra çalıştır, sonra karşılaştır.", "Predict first, then run, then compare.")],
      [t("<code>=</code> ile <code>==</code>'yi karıştırmak", "Mixing up <code>=</code> and <code>==</code>"), t("Biri atama, öteki karşılaştırma.", "One assigns, the other compares."), t("<code>if</code> satırında <code>==</code> ara.", "Look for <code>==</code> on an <code>if</code> line.")],
      [t("Son elemanı unutmak", "Forgetting the last element"), t("<code>[1:4]</code> 4 numaralı elemanı içermez.", "<code>[1:4]</code> does not include element 4."), t("Dilimin sınırlarını yüksek sesle oku.", "Read the slice bounds out loud.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Kod okumak denetlemenin ön koşuludur; yazmayı ezberlemek gerekmez.", "Reading code is a precondition for auditing; you don't need to write it from memory."), t("Girinti, bir satırın hangi bloğa ait olduğunu ve kaç kez çalışacağını belirler.", "Indentation decides which block a line belongs to and how many times it runs."), t("İlk iki turu elle izle; çıktıyı önceden tahmin et.", "Trace the first two rounds by hand; predict the output in advance.")])}
<p class="c-note">${t("Bu kavramları yazarak da öğrenmek istersen, öğrenme yolunun sonundaki <b>Ek: Python pratiği</b> bölümünde 14 derslik bir alıştırma seti var.", "If you also want to learn these by writing code, the <b>Appendix: Python practice</b> at the end of the learning path has a 14-lesson exercise set.")}</p>`);
  };

  /* ------------------------------------------------------------ Ünite 3 */
  B["m0-u3"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    const P = [
      ['pd.read_csv("x.csv")', t("Dosyadan tablo okur", "Reads a table from a file"), t("Tarih ve ondalık ayırıcı (virgül/nokta) yanlış okunabilir", "Dates and the decimal separator (comma/point) can be misread"), ""],
      ["df.shape, df.head()", t("Boyut ve ilk satırlar", "Size and first rows"), t("Her adımdan sonra bakılacak ilk şey", "The first thing to look at after every step"), ""],
      ['df["x"], df[["x","y"]]', t("Sütun seçer", "Selects columns"), t("Sütun adı birebir aynı olmalı", "The column name must match exactly"), ""],
      ['df[df["x"] > 0]', t("Koşulla satır seçer", "Selects rows by a condition"), t("Kaç satır kaldığını kontrol et", "Check how many rows remain"), "bad"],
      ["df.dropna()", t("Eksik değerli satırları siler", "Drops rows with missing values"), t("Herhangi bir sütunda eksik varsa tüm satırı siler", "Drops the whole row if any column is missing"), "bad"],
      ["df.fillna(0)", t("Eksikleri doldurur", "Fills missing values"), t("“Bilinmiyor”u “sıfır”a çevirir; ortalamayı sıfıra doğru çeker", "Turns “unknown” into “zero”; pulls the mean toward zero"), ""],
      ['df.merge(b, on="k")', t("İki tabloyu birleştirir", "Joins two tables"), t("Anahtar tekrar ediyorsa satırlar çoğalır", "Rows multiply if the key repeats"), "bad"],
      ['df.groupby("g")["x"].mean()', t("Grup başına özet", "Summary per group"), t("Hangi gruplar oluştu, kaç gözlem var?", "Which groups formed, how many observations?"), ""],
      ["s.pct_change(periods=k)", t("k dönem önceye göre değişim (oran)", "Change on k periods earlier (a ratio)"), t("Tarihler sıralı mı? Sonuç oran mı, yüzde mi?", "Are dates sorted? Is the result a ratio or a percent?"), ""],
      ["s.shift(1), s.rolling(3).mean()", t("Kaydırma, hareketli ortalama", "Lag, moving average"), t("Gelecekteki bilgiyi geçmişe taşımamalı", "Must not move future information into the past"), ""],
      ["np.where(koşul, a, b)", t("Koşula göre değer seçer", "Picks values by a condition"), t("Koşulun yönünü oku", "Read the direction of the condition"), ""]
    ];
    return wrap(`
<p class="c-lead">${t("YZ'ye bir veri analizi yaptırdığında aldığın kodun çoğu pandas (tablolar) ve NumPy (sayı dizileri) kütüphanelerinden gelen bir avuç kalıptan oluşur. Bu kalıpları tanırsan kodun büyük kısmı kendiliğinden okunur hâle gelir. Asıl dikkat edilecek yer, bu komutların <b>sessizce satır silebildiği ya da çoğaltabildiği</b> noktalardır.",
      "When you have the AI do a data analysis, most of the code you get is a handful of patterns from the pandas (tables) and NumPy (number arrays) libraries. Recognise these patterns and most of the code reads itself. The places to watch are where these commands can <b>silently drop or duplicate rows</b>.")}</p>
${sec(1, 0, t("Sezgi: muhasebede satır sayısı", "Intuition: row counts in accounting"), analogy("🧾", t(
      "Bir muhasebeci iki defteri birleştirdiğinde ilk iş toplam kayıt sayısını kontrol eder: 120 fatura + 80 fatura = 200 olmalı. 230 çıkıyorsa bir şey iki kez sayılmıştır; 170 çıkıyorsa bir şey kaybolmuştur. pandas'ta da <b>satır sayısı en ucuz ve en güçlü kontroldür</b>.",
      "When an accountant merges two ledgers, the first thing they check is the total number of records: 120 invoices + 80 invoices should be 200. If it comes out 230, something was counted twice; if 170, something was lost. In pandas too, <b>the row count is the cheapest and most powerful check</b>.")))}
${sec(2, 1, t("En sık 11 kalıp", "The 11 most common patterns"), table([t("Kalıp", "Pattern"), t("Ne yapar", "What it does"), t("Dikkat", "Watch out")],
      P.map(([a, b, c, k]) => ({ cls: k, cells: [`<code>${(lang === "en" ? a.replace("koşul", "cond") : a).replace(/>/g, "&gt;")}</code>`, b, c] }))) + `<p>${t("Pembe satırlar <b>satır sayısını değiştiren</b> komutlar.", "Pink rows are commands that <b>change the row count</b>.")}</p>`)}
${sec(3, 2, t("Satırlar nasıl sessizce kaybolur ya da çoğalır?", "How rows silently vanish or multiply"), fig("u3_rows", lang, t("<b>Şekil 1.</b> Solda: <code>dropna()</code> herhangi bir sütunu eksik olan satırın tamamını siler. Sağda: birleştirme anahtarı ikinci tabloda tekrar ediyorsa satırlar çoğalır ve satışlar iki kez sayılır.", "<b>Figure 1.</b> Left: <code>dropna()</code> removes the whole row when any column is missing. Right: if the join key repeats in the second table, rows multiply and sales are counted twice.")))}
${sec(4, 3, t("Çözümlü örnek: her adımda boyuta bak", "Worked example: check the size at every step"), `
${code(t('ham = pd.read_csv("iller.csv")             ; print(ham.shape)       # (81, 4)\nham = ham[ham["yil"] == 2023]              ; print(ham.shape)       # (81, 4)\nprint(ham.isna().sum())                    # silmeden ÖNCE: hangi sütunda eksik var?\nprint(ham[ham.isna().any(axis=1)])         # silinecek satırlar ve eksik sütunları\ntemiz = ham.dropna()                       ; print(temiz.shape)     # (74, 4)  ← 7 il gitti\nbirlesik = temiz.merge(nufus, on="il")     ; print(birlesik.shape)  # (79, 5)  ← 74 satır 79 oldu?',
      'raw = pd.read_csv("provinces.csv")         ; print(raw.shape)       # (81, 4)\nraw = raw[raw["year"] == 2023]             ; print(raw.shape)       # (81, 4)\nprint(raw.isna().sum())                    # BEFORE dropping: which column has gaps?\nprint(raw[raw.isna().any(axis=1)])         # rows that will go, and their missing columns\nclean = raw.dropna()                       ; print(clean.shape)     # (74, 4)  ← 7 provinces gone\nmerged = clean.merge(pop, on="province")   ; print(merged.shape)    # (79, 5)  ← 74 rows became 79?'))}
${steps([
      t("Eksikleri <b>ham</b> tabloda say. <code>dropna()</code> sonucunu ayrı bir değişkene (<code>temiz</code>) ata; tabloyu üzerine yazarsan silinen 7 ilin hangi sütun yüzünden gittiğini artık göremezsin. Belki yalnızca analizde kullanmadığın bir sütun eksikti.", "Count the gaps in the <b>raw</b> table. Assign the result of <code>dropna()</code> to a separate variable (<code>clean</code>); if you overwrite the table you can no longer see why the 7 provinces went. Maybe only a column you don't even use was missing."),
      t("Birleştirmeden sonra 74 satır 79'a çıktı: <code>nufus</code> tablosunda bazı iller birden çok kez var. <code>nufus[\"il\"].duplicated().sum()</code> ile kontrol et.", "After the merge 74 rows became 79: some provinces appear more than once in <code>pop</code>. Check with <code>pop[\"province\"].duplicated().sum()</code>."),
      t("Satır sayısının eşit çıkması tek başına kanıt değildir: bir ilin kaybı ile başka bir ilin çoğalması birbirini dengeleyebilir. Anahtarı da sına: <code>merge(..., validate=\"one_to_one\", indicator=True)</code> tekrar eden anahtarda hata verir, <code>_merge</code> sütunu eşleşmeyen satırları gösterir.", "An equal row count is not proof on its own: losing one province and duplicating another can cancel out. Test the key too: <code>merge(..., validate=\"one_to_one\", indicator=True)</code> fails on a repeated key, and the <code>_merge</code> column shows unmatched rows."),
      t("Kural: satır sayısını değiştiren her komuttan sonra <code>len(df)</code> ya da <code>df.shape</code>'e bak ve değişikliği açıklayabildiğinden emin ol.", "Rule: after every command that changes the row count, look at <code>len(df)</code> or <code>df.shape</code> and make sure you can explain the change.")
    ])}`)}
${sec(5, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("<code>dropna()</code>'yı refleksle çalıştırmak", "Running <code>dropna()</code> by reflex"), t("İlgisiz bir sütundaki eksik yüzünden gözlemleri kaybedersin.", "You lose observations because of a gap in an irrelevant column."), t("<code>dropna(subset=[...])</code> ile yalnızca gereken sütunlara bak.", "Use <code>dropna(subset=[...])</code> on the columns you need.")],
      [t("Birleştirmeden sonra kontrol yapmamak", "Not checking after a merge"), t("Tekrar eden anahtar toplamları şişirir.", "A repeated key inflates totals."), t("Satır sayısını karşılaştır; eşit çıksa da anahtarın tekilliğini ve eşleşmeyenleri kontrol et.", "Compare the row count; even if it matches, check key uniqueness and unmatched rows.")],
      [t("Eksikleri sıfırla doldurmak", "Filling gaps with zero"), t("“Bilinmiyor” ile “sıfır” farklı şeylerdir; ortalama sıfıra doğru çekilir.", "“Unknown” and “zero” are different things; the mean is pulled toward zero."), t("Neden eksik olduğunu sor; sıfır gerçekten sıfır mı?", "Ask why it is missing; is zero really zero?")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Bir avuç pandas kalıbını tanımak, YZ kodunun çoğunu okunur kılar.", "Knowing a handful of pandas patterns makes most AI code readable."), t("Filtre, <code>dropna</code> ve <code>merge</code> satır sayısını değiştirir; her birinden sonra boyuta bak.", "Filters, <code>dropna</code> and <code>merge</code> change the row count; check the size after each."), t("Açıklayamadığın bir satır sayısı değişikliği, bulunmayı bekleyen bir hatadır.", "A row-count change you cannot explain is a bug waiting to be found.")])}`);
  };

  /* ------------------------------------------------------------ Ünite 4 */
  B["m0-u4"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("YZ'nin hatalarının büyük kısmı, söylenmemiş olanı tahmin etmek zorunda kalmasından doğar. “Enflasyonu hesapla” dediğinde YZ; hangi veriyi, hangi birimi, aylık mı yıllık mı, bileşik mi basit mi olduğunu kendisi seçer. İyi bir istek, bir iktisatçının araştırma asistanına vereceği iş tanımı gibidir.",
      "Most of the AI's mistakes come from having to guess what was not said. When you say “compute inflation”, the AI chooses for itself which data, which unit, monthly or annual, compound or simple. A good request is like the job description an economist would give a research assistant.")}</p>
${sec(1, 0, t("Sezgi: “bana bir rapor hazırla”", "Intuition: “prepare me a report”"), analogy("📋", t(
      "Bir asistana yalnızca “enflasyon raporu hazırla” dersen, hangi ülke, hangi dönem, hangi endeks olduğunu o seçer; sonuç senin istediğin şey olmayabilir. “Türkiye, 2020–2024, TÜFE'den yıllık değişim, tek sayfa, bir grafik” dersen işi doğru yapma ihtimali çok artar. <b>Belirsizlik, YZ'nin varsayım yaptığı yerdir; varsayım da hatanın girdiği yer.</b>",
      "Tell an assistant only “prepare an inflation report” and they choose the country, the period and the index; the result may not be what you wanted. Say “Türkiye, 2020–2024, annual change from CPI, one page, one chart” and the chance of getting it right rises sharply. <b>Ambiguity is where the AI makes assumptions, and assumptions are where errors get in.</b>")))}
${sec(2, 1, t("Altı parçalı istek şablonu", "The six-part prompt template"), fig("u4_prompt", lang, t("<b>Şekil 1.</b> İyi bir isteğin altı parçası ve her biri için örnek ifade.", "<b>Figure 1.</b> The six parts of a good request, with an example phrase for each.")))}
${sec(3, 2, t("Çözümlü örnek: zayıf istekten güçlü isteğe", "Worked example: from a weak to a strong request"), `
${vs(t("Zayıf istek", "Weak request"), code(t("Enflasyonu hesapla ve grafiğini çiz.", "Compute inflation and plot it.")) + `<p>${t("YZ veri seçer (belki uydurur), birimi ve frekansı tahmin eder, aylık değişimi “enflasyon” diye sunabilir.", "The AI picks data (maybe invents them), guesses the unit and frequency, and may present the monthly change as “inflation”.")}</p>`,
      t("Güçlü istek", "Strong request"), code(t('Bir enflasyon raporu için çalışıyorum.\nElimde cpi adlı bir DataFrame var: "tarih" (aylık) ve\n"endeks" sütunları, 2000-01 ile 2024-12 arası.\nVeri yoksa uydurma, bana sor.\nYıllık enflasyonu yüzde olarak, 12 ay önceye göre\ndeğişimle hesapla; yalnızca pandas kullan.\n"yillik_enf" adlı yeni bir sütun oluştur, tek ondalık.\nBaşlıklı bir çizgi grafiği çiz.\nSonunda satır sayısını yazdır ve varsayımlarını listele.',
        'I am working on an inflation report.\nI have a DataFrame called cpi with "date" (monthly) and\n"index" columns, from 2000-01 to 2024-12.\nIf there are no data, do not invent them; ask me.\nCompute annual inflation in percent as the change on\n12 months earlier; use pandas only.\nCreate a new column "annual_inf", one decimal.\nDraw a line chart with a title.\nFinally print the row count and list your assumptions.')))}
${table([t("Parça", "Part"), t("Zayıf istekte", "In the weak request"), t("Güçlü istekte", "In the strong request")], [
      [t("Bağlam", "Context"), "—", t("enflasyon raporu", "inflation report")], [t("Veri", "Data"), "—", t("cpi, sütunlar, dönem; “uydurma, sor”", "cpi, columns, period; “don't invent, ask”")],
      [t("Birim ve frekans", "Unit and frequency"), "—", t("yüzde, aylık veriden yıllık", "percent, annual from monthly")], [t("Yöntem", "Method"), "—", t("12 ay önceye göre, yalnızca pandas", "on 12 months earlier, pandas only")],
      [t("Çıktı", "Output"), t("“grafiğini çiz”", "“plot it”"), t("sütun adı, ondalık, başlıklı grafik", "column name, decimals, titled chart")], [t("Kontrol", "Check"), "—", t("satır sayısı, varsayım listesi", "row count, list of assumptions")]
    ])}`)}
${sec(4, 3, t("Yazım ipuçları", "Writing tips"), cards([
      [0, "🇹🇷", t("Türkçe yazabilirsin", "Write in your language"), t("Ama sütun adlarını ve sayıları tablodaki gibi, birebir yaz.", "But write column names and numbers exactly as in the table.")],
      [1, "📏", t("Uzunluk sorun değil", "Length is fine"), t("Uzun bir istek kötü değildir; belirsiz bir istek kötüdür.", "A long request is not bad; a vague one is.")],
      [2, "🔎", t("Varsayımları iste", "Ask for assumptions"), t("“Varsayımlarını listele” demek, YZ'nin sessiz seçimlerini görünür kılar.", "“List your assumptions” makes the AI's silent choices visible.")],
      [3, "🧪", t("Kontrolü baştan iste", "Ask for checks up front"), t("Satır sayısı, bilinen bir değer, makul aralık: Ünite 5'teki araç kutusu.", "Row count, a known value, a plausible range: the toolbox in Unit 5.")]
    ]))}
${sec(5, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Veri vermeden istemek", "Asking without giving data"), t("YZ örnek ya da sahte veri üretip gerçekmiş gibi analiz edebilir.", "The AI may generate sample or fake data and analyse them as if real."), t("Veriyi tanıt ve “veri yoksa uydurma” yaz.", "Describe the data and write “if there are no data, don't invent them”.")],
      [t("Birimi belirtmemek", "Not stating the unit"), t("Oran mı yüzde mi, aylık mı yıllık mı belirsiz kalır.", "Ratio or percent, monthly or annual stays ambiguous."), t("Birimi ve frekansı açıkça yaz.", "State the unit and frequency explicitly.")],
      [t("İyi istekten sonra denetimi bırakmak", "Dropping the audit after a good request"), t("İyi istek hatayı azaltır, ortadan kaldırmaz.", "A good request reduces errors; it does not remove them."), t("Döngünün üçüncü adımı her zaman var.", "Step three of the loop always applies.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("YZ'nin hatalarının çoğu söylenmeyeni tahmin etmesinden doğar.", "Most AI errors come from guessing what was left unsaid."), t("Altı parça: bağlam, veri, birim ve frekans, yöntem, çıktı, kontrol.", "Six parts: context, data, unit and frequency, method, output, check."), t("Belirsiz istek kötüdür, uzun istek değil.", "A vague request is bad, not a long one.")])}`);
  };

  /* ------------------------------------------------------------ Ünite 5 */
  B["m0-u5"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    const c = N.cpi || { max: 9.0, maxdate: "2022-06-01", min: -2.0, mindate: "2009-07-01" };
    const ym = (s) => { const [y, m] = s.split("-"); const tr = ["", "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"], en = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; return lang === "tr" ? `${tr[+m]} ${y}` : `${en[+m]} ${y}`; };
    return wrap(`
<p class="c-lead">${t("YZ'nin verdiği her sonuca, raporuna koymadan önce beş soru sor. Sonra bu soruları gözle yanıtlamak yerine koda çevir: <code>assert</code> ile her çalıştırmada kendiliğinden sınanan kontroller.",
      "Before putting any AI result into your report, ask five questions. Then, instead of answering them by eye, turn them into code: checks that run automatically every time, using <code>assert</code>.")}</p>
${sec(1, 0, t("Sezgi: pilotun kontrol listesi", "Intuition: the pilot's checklist"), analogy("✈️", t(
      "Deneyimli bir pilot bile kalkıştan önce kontrol listesini baştan sona okur. Bunun nedeni pilotun işini bilmemesi değil; insan dikkatinin şaşmaz olmamasıdır. Aynı mantıkla, sonuç ne kadar makul görünürse görünsün, <b>her seferinde aynı beş soruyu sorarız</b>.",
      "Even an experienced pilot reads the checklist from start to finish before take-off. Not because the pilot doesn't know the job, but because human attention is fallible. By the same logic, however plausible a result looks, <b>we ask the same five questions every time</b>.")))}
${sec(2, 1, t("Beş soru", "Five questions"), cards([
      [0, "1", t("Veri doğru mu?", "Are the data right?"), t("Doğru dosya, doğru dönem, beklenen satır sayısı mı?", "Right file, right period, expected number of rows?"), "df.shape · df.head()"],
      [1, "2", t("Birim doğru mu?", "Is the unit right?"), t("Yüzde mi oran mı, TL mi bin TL mi, nominal mi reel mi? Büyüklük ipucudur; kanıt, bilinen bir ayın elle hesabıdır.", "Percent or ratio, lira or thousand lira, nominal or real? Magnitude is a hint; the proof is a known month computed by hand.")],
      [2, "3", t("Boyut ve eksikler", "Size and gaps"), t("Satır kayboldu mu, çoğaldı mı? Kaç eksik değer var?", "Did rows vanish or multiply? How many missing values?"), "len · isna().sum()"],
      [3, "4", t("İşaret ve büyüklük makul mü?", "Are sign and size plausible?"), t("Enflasyon −%50 ya da %5000 çıkıyorsa bir şeyler yanlıştır. Ekonomik sezgin en güçlü aracın.", "If inflation comes out −50% or 5000%, something is wrong. Your economic intuition is your strongest tool.")],
      [4, "5", t("Bilinen bir değerle uyuşuyor mu?", "Does it match a known value?"), t("Elle hesaplayabileceğin küçük bir örnek kur; kod aynı sonucu vermeli.", "Build a small example you can compute by hand; the code must give the same result.")]
    ]))}
${sec(3, 2, t("Soruları koda çevirmek: assert", "Turning questions into code: assert"), `
${formula("assert <i>" + t("koşul", "condition") + "</i>, \"<i>" + t("mesaj", "message") + "</i>\"", [[t("koşul doğruysa", "if true"), t("hiçbir şey olmaz; kod devam eder", "nothing happens; the code continues")], [t("koşul yanlışsa", "if false"), t("program durur ve senin mesajını gösterir (<code>AssertionError</code>)", "the program stops and shows your message (<code>AssertionError</code>)")]])}
${code(t('assert 0 < enflasyon < 200, "Enflasyon makul aralığın dışında"\nassert len(birlesik) == len(veri), "Birleştirme satır sayısını değiştirdi"\nassert veri["tarih"].is_monotonic_increasing, "Tarihler sıralı değil"',
        'assert 0 < inflation < 200, "Inflation outside the plausible range"\nassert len(merged) == len(data), "The merge changed the row count"\nassert data["date"].is_monotonic_increasing, "Dates are not sorted"'))}`)}
${sec(4, 3, t("Çözümlü örnek: makul aralık kontrolü yanlış kodu yakalıyor", "Worked example: a range check catches wrong code"), `
${fig("u5_assert", lang, t("<b>Şekil 1.</b> Gerçek ABD verisi. Doğru hesap 2000'den bu yana " + ym(c.mindate) + "'daki %" + nf(c.min, 1, "tr") + " ile " + ym(c.maxdate) + "'daki %" + nf(c.max, 1, "tr") + " arasında kalıyor. YZ'nin kodu yüzdeye iki kez çevirdiği için değerler 100 kat büyük; makul aralık kontrolü hemen durduruyor.",
        "<b>Figure 1.</b> Real US data. Since 2000 the right calculation stays between " + nf(c.min, 1, "en") + "% in " + ym(c.mindate) + " and " + nf(c.max, 1, "en") + "% in " + ym(c.maxdate) + ". The AI's code converts to percent twice, so values are 100 times too large; the range check stops it at once."))}
${steps([
      t("Sınırları ekonomik sezgiyle seç: ABD için yıllık enflasyonun −%5 ile %20 arasında kalması beklenir. Türkiye verisinde üst sınırı daha yüksek seçerdin.", "Choose the bounds with economic intuition: for the US, annual inflation is expected to stay between −5% and 20%. For Turkish data you would choose a higher upper bound."),
      t("12 aylık değişimde ilk 12 satır <b>beklenen</b> boşluktur ve <code>between</code> NaN için False döndürür. Bu yüzden kontrolü üçe ayır: <code>assert enf.iloc[:12].isna().all()</code> (beklenen boşluk), <code>assert enf.iloc[12:].notna().all()</code> (beklenmeyen eksik yok), <code>assert enf.iloc[12:].between(-5, 20).all()</code> (kalan her değer aralıkta).", "In a 12-month change the first 12 rows are an <b>expected</b> gap, and <code>between</code> returns False for NaN. So split the check in three: <code>assert inf.iloc[:12].isna().all()</code> (expected gap), <code>assert inf.iloc[12:].notna().all()</code> (no unexpected gaps), <code>assert inf.iloc[12:].between(-5, 20).all()</code> (every remaining value in range)."),
      t("Kontrol başarısız olunca <b>sınırı gevşetme</b>; önce hesabı incele. Bu örnekte sorun, <code>* 100</code>'ün iki kez yazılmasıydı.", "When the check fails, <b>don't loosen the bound</b>; inspect the calculation first. Here the problem was <code>* 100</code> written twice.")
    ])}`)}
${sec(5, 4, t("Kontrolün de denetlenmesi", "Auditing the check itself"), `
${vs(t("Hep geçen kontrol", "A check that always passes"), code(t('assert len(veri) >= 0\nassert enf.notna().any() or True', 'assert len(data) >= 0\nassert inf.notna().any() or True')) + `<p>${t("Satır sayısı hiçbir zaman negatif olamaz; <code>or True</code> her şeyi doğru yapar. Bunlar hiçbir şeyi sınamaz ama güven verir.", "A row count can never be negative; <code>or True</code> makes anything true. These test nothing but give false comfort.")}</p>`,
      t("Gerçekten sınayan kontrol", "A check that really tests"), code(t('assert len(veri) == 300, f"300 ay bekleniyordu, {len(veri)} geldi"\nassert enf.isna().sum() == 12, "Yalnızca ilk 12 ay boş olmalı"', 'assert len(data) == 300, f"Expected 300 months, got {len(data)}"\nassert inf.isna().sum() == 12, "Only the first 12 months should be empty"')) + `<p>${t("Beklenen değeri önceden yazar; başarısız olabilecek bir koşul kurar.", "States the expected value in advance; sets a condition that can actually fail.")}</p>`)}`)}
${sec(6, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Kontrolü YZ'ye yazdırıp okumamak", "Having the AI write the check and not reading it"), t("“Hep geçen” bir kontrol, hiç kontrol olmamasından daha tehlikelidir.", "A check that “always passes” is more dangerous than no check."), t("Kontrolün başarısız olabileceği bir durum düşün.", "Think of a case where the check could fail.")],
      [t("Başarısız kontrolü silmek", "Deleting a failing check"), t("Kontrol, tam da işini yaptığı anda kaldırılmış olur.", "The check is removed at exactly the moment it is doing its job."), t("Önce nedenini bul.", "Find the cause first.")],
      [t("Yalnızca son sayıya bakmak", "Looking only at the final number"), t("Ara adımlardaki satır kaybı son sayıda görünmez.", "Lost rows in intermediate steps don't show in the final number."), t("Her adımın ardından boyut kontrolü.", "A size check after every step.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Beş soru: veri, birim, boyut ve eksikler, işaret ve büyüklük, bilinen değer.", "Five questions: data, unit, size and gaps, sign and size, known value."), t("<code>assert</code> soruları her çalıştırmada kendiliğinden sınanan kontrollere çevirir.", "<code>assert</code> turns the questions into checks that run automatically every time."), t("İyi bir kontrol başarısız olabilir; hep geçen kontrol işe yaramaz.", "A good check can fail; one that always passes is useless.")])}`);
  };

  /* ------------------------------------------------------------ Ünite 6 */
  B["m0-u6"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    const R = (cat, a, b, cls) => ({ cls: cls || "", cells: [cat, a, b] });
    return wrap(`
<p class="c-lead">${t("Genel programlama hatalarını YZ giderek daha az yapıyor. Ama ekonomi ve finans verisine özgü hatalar, alan bilgisi gerektirdiği için hâlâ yaygın; üstelik neredeyse hiçbiri hata mesajı vermez. Bu katalog, YZ'nin kodunu okurken aklında tutman gereken kontrol listesidir.",
      "The AI makes fewer and fewer general programming errors. But errors specific to economic and financial data, which need domain knowledge, are still common, and almost none of them produce an error message. This catalogue is the checklist to keep in mind when reading the AI's code.")}</p>
${sec(1, 0, t("Sezgi: yazım denetimi ve anlam", "Intuition: spell-check and meaning"), analogy("📝", t(
      "Yazım denetimi “enflasyon %3 arttı” ile “enflasyon 3 puan arttı” arasındaki farkı göremez; ikisi de kusursuz yazılmış cümlelerdir. YZ de kodun <b>dilbilgisinde</b> çok iyidir, ama bir hesabın <b>iktisadi anlamını</b> denetlemek senin işindir.",
      "A spell-checker cannot see the difference between “inflation rose 3%” and “inflation rose 3 points”; both are perfectly spelled sentences. The AI is very good at the <b>grammar</b> of code too, but checking the <b>economic meaning</b> of a calculation is your job.")))}
${sec(2, 1, t("Katalog", "The catalogue"), table([t("Kategori", "Category"), t("Tipik YZ hatası", "Typical AI error"), t("Doğrusu", "The right way")], [
      R(t("Birim", "Unit"), t("Aylık oranları toplamak", "Adding monthly rates"), t("Bileşik: (1 + r) çarpımı", "Compound: product of (1 + r)")),
      R("", t("Ortalama büyüme için aritmetik ortalama", "Arithmetic mean for average growth"), t("Geometrik ortalama: aynı son düzeyi veren yıllık bileşik oran", "Geometric mean: the compound annual rate that reaches the same final level")),
      R("", t("Oran ile yüzdeyi karıştırmak", "Mixing up ratio and percent"), t("Birimi isteğe yaz, kontrol et", "State the unit in the request, check it")),
      R(t("Zaman", "Time"), t("Sıralanmamış tarihlerde değişim hesaplamak", "Computing changes on unsorted dates"), t("Önce tarihe göre sırala", "Sort by date first")),
      R("", t("Nominal artışı reel artış diye sunmak", "Presenting a nominal rise as a real one"), t("Enflasyondan arındır", "Deflate by inflation")),
      R("", t("Hesapta gelecekteki değeri kullanmak", "Using a future value in a calculation"), t("Yalnızca tahmin anında yayımlanmış bilgi", "Only information published by the forecast date")),
      R(t("Veri", "Data"), t("Veri bulamayınca sahte veri üretmek", "Generating fake data when none are found"), t("Açıkça hata vermek", "Fail loudly")),
      R("", t("Sessizce satır silmek ya da çoğaltmak", "Silently dropping or duplicating rows"), t("Satır sayısını kontrol etmek", "Check the row count")),
      R(t("Yorum", "Interpretation"), t("Korelasyonu nedensellik gibi anlatmak", "Describing correlation as causation"), t("Ünite 8", "Unit 8"))
    ]))}
${sec(3, 2, t("Çözümlü örnek 1: ortalama büyüme", "Worked example 1: average growth"), `
${fig("u6_geo", lang, t("<b>Şekil 1.</b> Bir yıl +%50, ertesi yıl −%50. Aritmetik ortalama “ortalama %0 büyüme” der; oysa 100 TL 75 TL'ye düşmüştür.", "<b>Figure 1.</b> +50% one year, −50% the next. The arithmetic mean says “0% average growth”, yet 100 has fallen to 75."))}
${formula(t("ortalama büyüme = (Π (1 + g<sub>t</sub>))<sup>1/T</sup> − 1", "average growth = (Π (1 + g<sub>t</sub>))<sup>1/T</sup> − 1"), [["g<sub>t</sub>", t("t yılındaki büyüme oranı (oran olarak: %50 = 0,5)", "growth rate in year t (as a ratio: 50% = 0.5)")], ["T", t("yıl sayısı", "number of years")], ["Π", t("çarpım", "product")]])}
<p>${t("Büyüme oranları çarpılarak birikir, toplanarak değil. Geometrik ortalama, <b>aynı son düzeyi veren sabit yıllık bileşik oranı</b> verir: √(1,5 × 0,5) − 1 = −%13,4. İki yıl boyunca her yıl %13,4 küçülseydin yine 75'e ulaşırdın. Aritmetik ortalama (%0) başka bir soruya yanıt verir: “tipik bir yılın oranı neydi?” Ama “başlangıçtan sona hangi sabit hızla gelindi?” sorusunun cevabı değildir.",
      "Growth rates accumulate by multiplication, not addition. The geometric mean gives <b>the constant compound annual rate that reaches the same final level</b>: √(1.5 × 0.5) − 1 = −13.4%. Shrinking 13.4% each year for two years would also take you to 75. The arithmetic mean (0%) answers a different question, “what was a typical year's rate?”, but not “at what constant pace did we get from start to finish?”")}</p>`)}
${sec(4, 3, t("Çözümlü örnek 2: sıralanmamış tarihler", "Worked example 2: unsorted dates"), `
${fig("u6_sort", lang, t("<b>Şekil 2.</b> <code>pct_change()</code> bir önceki <b>satırla</b> karşılaştırır, bir önceki <b>ayla</b> değil. Tarihler karışıksa hiç yaşanmamış düşüşler üretir.", "<b>Figure 2.</b> <code>pct_change()</code> compares with the previous <b>row</b>, not the previous <b>month</b>. If dates are shuffled it produces falls that never happened."))}`)}
${sec(5, 4, t("Çözümlü örnek 3: nominal ve reel", "Worked example 3: nominal and real"), `
${formula(t("reel değişim = (1 + nominal değişim) / (1 + enflasyon) − 1", "real change = (1 + nominal change) / (1 + inflation) − 1"))}
${table([t("Kalem", "Item"), t("Değer", "Value")], [[t("Nominal ücret artışı", "Nominal wage growth"), t("%40", "40%")], [t("Aynı dönemde enflasyon", "Inflation over the same period"), t("%45", "45%")],
      { cls: "hl", cells: [t("Reel ücret değişimi", "Real wage change"), lang === "tr" ? "1,40 / 1,45 − 1 = −%3,4" : "1.40 / 1.45 − 1 = −3.4%"] }, { cls: "bad", cells: [t("YZ'nin kısayolu: 40 − 45", "The AI's shortcut: 40 − 45"), lang === "tr" ? "−5 puan (yaklaşık; yüksek enflasyonda yanıltır)" : "−5 points (approximate; misleading at high inflation)"] }])}
<p>${t("“Ücretler %40 arttı” cümlesi doğru ama eksik: alım gücü aslında düştü. Nominal bir artışı reel diye sunmak, en sık görülen yorum hatalarından biridir.", "“Wages rose 40%” is true but incomplete: purchasing power actually fell. Presenting a nominal rise as a real one is one of the most common interpretation errors.")}</p>`)}
${sec(6, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Kataloğu ezberleyip kodu okumamak", "Memorising the catalogue without reading the code"), t("Katalog nereye bakacağını söyler; hatayı kod içinde bulmak gerekir.", "The catalogue tells you where to look; you still have to find the error in the code."), t("Her satırı katalogdaki kategorilerle eşleştir.", "Match each line against the catalogue's categories.")],
      [t("Küçük farkları önemsememek", "Ignoring small differences"), t("Düşük enflasyonda küçük olan fark, yüksek enflasyonda büyür.", "A gap that is small at low inflation grows at high inflation."), t("Doğru formülü her durumda kullan.", "Use the right formula in every case.")],
      [t("Tarihlerin sıralı olduğunu varsaymak", "Assuming dates are sorted"), t("Birleştirme ve indirme sırayı bozabilir.", "Merges and downloads can scramble the order."), t("<code>sort_values</code> + <code>is_monotonic_increasing</code> kontrolü.", "<code>sort_values</code> + an <code>is_monotonic_increasing</code> check.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Alan bilgisi gerektiren hatalar sessizdir: birim, zaman, veri, yorum.", "Errors that need domain knowledge are silent: unit, time, data, interpretation."), t("Oranlar bileşik birikir; aynı son düzeyi veren yıllık oran geometrik ortalamadır.", "Rates compound; the annual rate that reaches the same final level is the geometric mean."), t("Nominal bir değişimi enflasyondan arındırmadan reel diye sunma.", "Don't present a nominal change as real without deflating it.")])}
<p class="c-note">${t("Model kurarken ortaya çıkan hatalar (veri sızıntısı, aşırı uyum gibi) makine öğrenmesi modüllerinde ayrıca ele alınıyor.", "Errors that arise when building models (such as data leakage and overfitting) are covered separately in the machine learning modules.")}</p>`);
  };

  /* ------------------------------------------------------------ Ünite 7 */
  B["m0-u7"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    return wrap(`
<p class="c-lead">${t("Kod hata verdiğinde en kolay yol, hatayı YZ'ye yapıştırıp “düzelt” demektir. Bu çoğu zaman işe yarar. Ama YZ'nin amacı <b>hatanın kaybolması</b>, senin amacın ise <b>sonucun doğru olması</b>. Bu ikisi her zaman aynı şey değildir.",
      "When code throws an error, the easiest path is to paste it into the AI and say “fix it”. That often works. But the AI's goal is for <b>the error to disappear</b>; yours is for <b>the result to be right</b>. These are not always the same thing.")}</p>
${sec(1, 0, t("Sezgi: yanan uyarı lambası", "Intuition: the warning light"), analogy("🚗", t(
      "Arabanın yağ lambası yanıyor. Bir usta motoru açıp yağı kontrol eder; bir başkası lambanın kablosunu söker. İkisinden sonra da lamba söner. <b>Hata mesajı bir uyarı lambasıdır</b>: onu susturmak sorunu çözmez.",
      "Your car's oil light comes on. One mechanic opens the engine and checks the oil; another unplugs the light. After both, the light goes off. <b>An error message is a warning light</b>: silencing it does not fix the problem.")))}
${sec(2, 1, t("Hata mesajını okumak", "Reading the error message"), fig("u7_trace", lang, t("<b>Şekil 1.</b> Python hata mesajını sondan başa oku: son satır hatanın türünü ve nedenini, üstteki satır numarası yerini söyler.", "<b>Figure 1.</b> Read a Python error message from the bottom up: the last line gives the type and cause, the line number above it gives the location.")) +
      table([t("Hata türü", "Error type"), t("Genellikle ne demek?", "What it usually means"), t("İlk bakılacak yer", "Where to look first")], [
        ["<code>KeyError</code>", t("Böyle bir sütun ya da anahtar yok", "No such column or key"), "<code>df.columns</code>"], ["<code>NameError</code>", t("Değişken tanımlanmamış (ya da yazımı farklı)", "Variable not defined (or spelled differently)"), t("hücre sırası", "cell order")],
        ["<code>TypeError</code>", t("Uyumsuz türler (metin ile sayı) ya da tanınmayan parametre adı (<i>unexpected keyword argument</i>)", "Incompatible types (text and number) or an unknown parameter name (<i>unexpected keyword argument</i>)"), t("<code>df.dtypes</code>, fonksiyonun belgesi", "<code>df.dtypes</code>, the function's documentation")], ["<code>ValueError</code>", t("Tür doğru ama değer uygun değil (ör. “1.234,5”)", "Right type, unsuitable value (e.g. “1.234,5”)"), t("verinin ilk satırları", "the first rows")]
      ]))}
${sec(3, 2, t("Üç adım", "Three steps"), fig("u7_flow", lang, t("<b>Şekil 2.</b> Hata ayıklama döngüsü. Son kutudaki soru en önemlisi: hata gitti, ama sonuç doğru mu?", "<b>Figure 2.</b> The debugging loop. The question in the last box matters most: the error is gone, but is the result right?")) +
      cards([[0, "🧾", t("İyi bir hata ayıklama isteği", "A good debugging request"), t("Tam hata mesajı · ilgili kod · <code>df.dtypes</code> · sorunu gösteren bir iki temsili satır · ne beklediğin · “hatayı susturma, nedenini açıkla”.", "The full error message · the relevant code · <code>df.dtypes</code> · one or two representative rows that show the problem · what you expected · “don't silence the error, explain its cause”.")],
        [1, "🔒", t("Paylaşmadan önce küçült", "Shrink before sharing"), t("<code>df.head()</code>'i olduğu gibi yapıştırma. Yalnızca ilgili sütunları al; kimlik, ad, adres gibi alanları çıkar ya da uydurma etiketlerle değiştir.", "Don't paste <code>df.head()</code> as is. Keep only the relevant columns; drop fields such as IDs, names and addresses or replace them with made-up labels."), t('df[["tarih", "tutar"]].head(2)', 'df[["date", "amount"]].head(2)')]]))}
${sec(4, 3, t("Kötü düzeltmenin üç biçimi", "Three forms of a bad fix"), cards([
      [4, "🤐", t("Susturmak", "Silencing"), t("Hatayı yutmak: kod durmaz, ama sorun olduğu yerde kalır.", "Swallowing the error: the code no longer stops, but the problem stays."), "try: … except: pass"],
      [3, "🙈", t("Belirtiyi gizlemek", "Hiding the symptom"), t("Sorunlu değerleri sessizce NaN'a ya da sıfıra çevirmek.", "Silently turning problem values into NaN or zero."), 'errors="coerce" · dropna() · fillna(0)'],
      [2, "✂️", t("Kontrolü silmek", "Deleting the check"), t("Başarısız olan <code>assert</code>'ü kaldırmak ya da gevşetmek.", "Removing or loosening the failing <code>assert</code>."), "# assert …"]
    ]))}
${sec(5, 4, t("Çözümlü örnek: “1.234,5” sorunu", "Worked example: the “1.234,5” problem"), `
<p>${t("Türkçe biçimli bir CSV dosyası (<code>x.csv</code>):", "A Turkish-formatted CSV file (<code>x.csv</code>):")}</p>
${code(t("tarih;tutar\n2024-01;1.234,5\n2024-02;987,0\n2024-03;12.050,25", "date;amount\n2024-01;1.234,5\n2024-02;987,0\n2024-03;12.050,25"))}
<p>${t("Ondalık ayırıcı virgül olduğu için sütunlar <b>noktalı virgülle</b> ayrılmış; binlik ayırıcı nokta. Dosya ayıraç belirtilerek okundu (<code>sep=\";\"</code>), ama <code>tutar</code> sütunu metin olarak geldi. <code>df[\"tutar\"].astype(float)</code> şu hatayı veriyor: <code>ValueError: could not convert string to float: '1.234,5'</code>. (Ayraç da belirtilmeseydi pandas her satırı tek bir sütun olarak okurdu.)",
      "Because the decimal separator is a comma, columns are separated by a <b>semicolon</b>; the thousands separator is a dot. The file was read with the separator given (<code>sep=\";\"</code>), but the <code>amount</code> column came in as text. <code>df[\"amount\"].astype(float)</code> gives: <code>ValueError: could not convert string to float: '1.234,5'</code>. (Without the separator, pandas would read each line as a single column.)")}</p>
${vs(t("YZ'nin ilk düzeltmesi", "The AI's first fix"), code(t('df["tutar"] = pd.to_numeric(df["tutar"],\n                            errors="coerce")', 'df["amount"] = pd.to_numeric(df["amount"],\n                             errors="coerce")')) + `<p>${t("Hata gider. Ama binlik ayırıcı içeren her değer (1.234,5 gibi) sessizce NaN olur; büyük tutarlar ortalamadan düşer.", "The error goes away. But every value with a thousands separator (like 1.234,5) silently becomes NaN; large amounts drop out of the average.")}</p>`,
      t("Kök nedeni gideren düzeltme", "A fix that removes the root cause"), code(t('df = pd.read_csv("x.csv", sep=";", decimal=",", thousands=".")\nassert df.shape[1] == 2, "Sütun ayırıcı yanlış"\nassert df["tutar"].notna().all()', 'df = pd.read_csv("x.csv", sep=";", decimal=",", thousands=".")\nassert df.shape[1] == 2, "Wrong column separator"\nassert df["amount"].notna().all()')) + `<p>${t("<code>sep</code> sütunları, <code>decimal</code> ondalığı, <code>thousands</code> binlik ayırıcıyı söyler. Üçü birlikte verilince 1.234,5 → 1234,5 olarak okunur; kontroller sütun sayısını ve hiçbir değerin kaybolmadığını sınar.", "<code>sep</code> names the column separator, <code>decimal</code> the decimal mark and <code>thousands</code> the thousands separator. With all three, 1.234,5 is read as 1234.5; the checks confirm the column count and that no value was lost.")}</p>`)}`)}
${sec(6, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Hata mesajının yalnızca ilk satırını okumak", "Reading only the first line of the message"), t("Asıl bilgi son satırdadır.", "The real information is on the last line."), t("Sondan başla.", "Start at the end.")],
      [t("Bağlam vermeden “düzelt” demek", "Saying “fix it” without context"), t("YZ verini görmeden tahmin eder ve belirtiyi hedefler.", "The AI guesses without seeing your data and targets the symptom."), t("Hata + kod + <code>df.dtypes</code> + küçültülmüş örnek + beklenti.", "Error + code + <code>df.dtypes</code> + a trimmed sample + expectation.")],
      [t("Hata gidince işi bitmiş saymak", "Treating the job as done once the error is gone"), t("Kötü düzeltmeler de hatayı ortadan kaldırır.", "Bad fixes also make the error disappear."), t("Sonucu ve satır sayısını yeniden denetle.", "Re-audit the result and the row count.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Hata mesajını sondan oku: tür, neden, yer.", "Read the error message from the end: type, cause, location."), t("İyi düzeltme kök nedeni giderir ve kontrolleri yerinde bırakır.", "A good fix removes the root cause and leaves the checks in place."), t("Her düzeltmeden sonra sor: hata gitti, ama sonuç doğru mu?", "After every fix ask: the error is gone, but is the result right?")])}`);
  };

  /* ------------------------------------------------------------ Ünite 8 */
  B["m0-u8"] = (lang) => {
    const t = (a, b) => (lang === "tr" ? a : b);
    const ph = N.phillips || { r_2000_2019: -0.14, r_2000_2024: -0.29, r_excl_2020_2022: -0.21 };
    return wrap(`
<p class="c-lead">${t("YZ sonuçları yorumlamakta çok akıcıdır. Sorun da buradadır: akıcı bir metin, verinin söylediğinden fazlasını söylediğinde fark etmek zorlaşır. Bir iktisatçı olarak son kontrol noktası sensin.",
      "The AI is very fluent at interpreting results. That is exactly the problem: when fluent text says more than the data do, it becomes hard to notice. As an economist, you are the last checkpoint.")}</p>
${sec(1, 0, t("Sezgi: haber başlığı ve makale", "Intuition: headline and article"), analogy("🗞️", t(
      "Bir makale “iki değişken arasında zayıf bir ilişki gözlendi, nedensellik için ek çalışma gerekir” der; haber başlığı “X, Y'yi artırıyor!” olur. YZ'nin yorumları çoğu zaman <b>başlık gibi</b> yazılır. Senin işin onu tekrar <b>makaleye</b> çevirmek.",
      "A paper says “a weak relationship was observed between two variables; causation needs further work”; the headline becomes “X boosts Y!”. The AI's interpretations are often written <b>like headlines</b>. Your job is to turn them back into <b>the paper</b>.")))}
${sec(2, 1, t("Altı abartı", "Six overclaims"), cards([
      [4, "➡️", t("Nedensellik", "Causation"), t("“X, Y'yi artırır.” Oysa veri yalnızca birlikte hareket ettiklerini gösteriyor.", "“X raises Y.” Yet the data only show that they move together.")],
      [3, "🌍", t("Genelleme", "Generalisation"), t("Tek bir ülke, dönem ya da örneklemden “her zaman”, “tüm ülkelerde” sonucuna gitmek.", "Jumping from one country, period or sample to “always”, “in all countries”.")],
      [2, "🔮", t("Kesinlik", "Certainty"), t("Belirsizliği yok saymak: “Kur 38 olacak.”", "Ignoring uncertainty: “The exchange rate will be 38.”")],
      [1, "🔢", t("Sahte kesinlik", "False precision"), t("“%4,73829 arttı.” Verinin doğruluğundan fazla basamak.", "“Rose 4.73829%.” More digits than the data's accuracy.")],
      [0, "🎲", t("Kurguyu gerçek sanmak", "Mistaking fiction for fact"), t("Simüle ya da kurgusal veriden gerçek dünya hakkında sonuç çıkarmak.", "Drawing real-world conclusions from simulated or fictional data.")],
      [4, "💼", t("Tavsiyeye kaymak", "Sliding into advice"), t("Analizden doğrudan politika ya da yatırım önerisi türetmek.", "Deriving policy or investment advice directly from the analysis.")]
    ]))}
${sec(3, 2, t("Çözümlü örnek: enflasyon ve işsizlik", "Worked example: inflation and unemployment"), `
${fig("u8_scatter", lang, t("<b>Şekil 1.</b> ABD'de 2000–2024 arasında her yıl için işsizlik oranı (yıllık ortalama) ve Aralık ayındaki 12 aylık enflasyon.", "<b>Figure 1.</b> For each year 2000–2024 in the US: the unemployment rate (annual average) and 12-month inflation in December."))}
<p>${t("YZ'nin yorumu: <i>“Grafik, işsizlik düştükçe enflasyonun yükseldiğini açıkça gösteriyor; işsizliği düşürmek enflasyona neden olur. Fed faizleri artırarak işsizliği yükseltmelidir.”</i> Bu üç cümlede kaç abartı var?",
      "The AI's interpretation: <i>“The chart clearly shows inflation rising as unemployment falls; lowering unemployment causes inflation. The Fed should raise rates to increase unemployment.”</i> How many overclaims are in these three sentences?")}</p>
${table([t("İfade", "Phrase"), t("Abartı", "Overclaim"), t("Veri ne diyor?", "What the data say")], [
      { cls: "bad", cells: [t("“açıkça gösteriyor”", "“clearly shows”"), t("Kesinlik", "Certainty"), t(`Korelasyon 2000–2019'da ${nf(ph.r_2000_2019, 2, "tr")}, tüm dönemde ${nf(ph.r_2000_2024, 2, "tr")}: zayıf ve döneme bağlı.`, `The correlation is ${nf(ph.r_2000_2019, 2, "en")} in 2000–2019 and ${nf(ph.r_2000_2024, 2, "en")} over the whole period: weak and period-dependent.`)] },
      { cls: "bad", cells: [t("“neden olur”", "“causes”"), t("Nedensellik", "Causation"), t("Gözlemsel veri yalnızca birlikte hareketi gösterir. 2021–2022'deki yüksek enflasyon için pandemi ve arz şokları olası açıklamalardır; bu grafik bunu sınamaz, ancak hipotez olarak yazılabilir.", "Observational data only show co-movement. The pandemic and supply shocks are possible explanations for high inflation in 2021–2022; this chart does not test that, so it can only be written as a hypothesis.")] },
      { cls: "bad", cells: [t("“Fed … yükseltmelidir”", "“The Fed should …”"), t("Tavsiyeye kaymak", "Sliding into advice"), t("Bir serpme grafiğinden politika önerisi çıkmaz.", "No policy recommendation follows from a scatter plot.")] }
    ])}`)}
${sec(4, 3, t("İyi bir sonuç paragrafının dört parçası", "The four parts of a good conclusion"), `
${table([t("Parça", "Part"), t("Soru", "Question"), t("Örnek (yukarıdaki veri)", "Example (the data above)")], [
      [t("1 · Bulgu", "1 · Finding"), t("Ne gördük?", "What did we see?"), t("İşsizlik ile enflasyon arasında zayıf, ters yönlü bir birlikte hareket.", "A weak, negative co-movement between unemployment and inflation.")],
      [t("2 · Büyüklük", "2 · Size"), t("Ne kadar?", "How much?"), t(`Korelasyon ${nf(ph.r_2000_2024, 2, "tr")}. Döneme duyarlı: 2000–2019'da ${nf(ph.r_2000_2019, 2, "tr")}, 2020–2022 çıkarılınca ${nf(ph.r_excl_2020_2022, 2, "tr")}.`, `Correlation ${nf(ph.r_2000_2024, 2, "en")}. Period-sensitive: ${nf(ph.r_2000_2019, 2, "en")} in 2000–2019, ${nf(ph.r_excl_2020_2022, 2, "en")} without 2020–2022.`)],
      [t("3 · Bağlam", "3 · Context"), t("Hangi veri, hangi dönem?", "Which data, which period?"), t("ABD, yıllık, 2000–2024, FRED.", "US, annual, 2000–2024, FRED.")],
      [t("4 · Sınırlar", "4 · Limits"), t("Neyi göstermez?", "What does it not show?"), t("Neden-sonuç göstermez; dönem seçimine duyarlı; 25 gözlem.", "It does not show cause and effect; it is sensitive to the period chosen; 25 observations.")]
    ])}
${vs(t("Abartılı", "Overclaimed"), `<p>${t("“Analiz, düşük işsizliğin enflasyonu %4,73829 artırdığını kesin olarak kanıtlıyor.”", "“The analysis definitively proves that low unemployment raises inflation by 4.73829%.”")}</p>`,
      t("Dört parçalı", "Four-part"), `<p>${t(`“ABD'de 2000–2024 yıllık verisinde işsizlik ile enflasyon arasında zayıf, ters yönlü bir birlikte hareket görülüyor (korelasyon ${nf(ph.r_2000_2024, 2, "tr")}). Katsayı döneme duyarlı: 2000–2019'da ${nf(ph.r_2000_2019, 2, "tr")}, 2020–2022 yılları çıkarıldığında ${nf(ph.r_excl_2020_2022, 2, "tr")}. 2020 sonrasındaki pandemi ve arz şokları bu farkın olası bir açıklamasıdır; bu veri bunu sınamaz. Bulgu bir neden-sonuç ilişkisi göstermez.”`, `“In annual US data for 2000–2024, unemployment and inflation show a weak negative co-movement (correlation ${nf(ph.r_2000_2024, 2, "en")}). The coefficient is period-sensitive: ${nf(ph.r_2000_2019, 2, "en")} in 2000–2019 and ${nf(ph.r_excl_2020_2022, 2, "en")} with 2020–2022 removed. The pandemic and supply shocks after 2020 are a possible explanation for the difference; these data do not test it. The finding does not show cause and effect.”`)}</p>`)}`)}
${sec(5, 0, t("Sık yapılan hatalar", "Common mistakes"), pit([
      [t("Akıcı metni olduğu gibi kopyalamak", "Copying fluent text as it is"), t("Abartılar akıcılığın içinde kaybolur.", "Overclaims get lost in the fluency."), t("Her cümleyi altı abartı listesiyle tara.", "Scan every sentence against the six-overclaim list.")],
      [t("Sınırlar bölümünü atlamak", "Skipping the limits"), t("Okuyucu bulguyu olduğundan güçlü sanır.", "The reader thinks the finding is stronger than it is."), t("Her sonuca bir “neyi göstermez” cümlesi ekle.", "Add a “what it does not show” sentence to every conclusion.")],
      [t("Basamak sayısını korumak", "Keeping all the digits"), t("Sahte kesinlik güvenilirlik izlenimi verir.", "False precision gives an impression of reliability."), t("Verinin doğruluğuna uygun basamağa yuvarla.", "Round to the data's accuracy.")]
    ]))}
${sum(t("Akılda kalsın", "Remember"), [t("Altı abartı: nedensellik, genelleme, kesinlik, sahte kesinlik, kurguyu gerçek sanmak, tavsiyeye kaymak.", "Six overclaims: causation, generalisation, certainty, false precision, mistaking fiction for fact, sliding into advice."), t("Dört parça: bulgu, büyüklük, bağlam, sınırlar.", "Four parts: finding, size, context, limits."), t("Gözlemsel veriden çıkan ilişkiyi “birlikte hareket” diye yaz.", "Write a relationship from observational data as “co-movement”.")])}`);
  };

  const C = {};
  Object.keys(B).forEach((id) => { C[id] = { tr: B[id]("tr"), en: B[id]("en") }; });
  K.apply(U, C, 8);
  K.prepend(U, "m0-u9", F, "u9_flow", { tr: "<b>Şekil 1.</b> Atölyenin akışı.", en: "<b>Figure 1.</b> The workshop's flow." });
  K.prepend(U, "m0-u10", F, "u10_flow", { tr: "<b>Şekil 1.</b> Bitirme projesinin akışı.", en: "<b>Figure 1.</b> The capstone's flow." });
})();
