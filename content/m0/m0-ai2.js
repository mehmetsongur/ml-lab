/* Modül 0 (yeni) — AI ile Ekonomik Analize Giriş · Üniteler 6–10
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 * "Örnek AI yanıtları" öğretim amacıyla hazırlanmıştır; tüm veriler kurgusaldır (Colab atölyeleri hariç: FRED).
 */
(function () {
  "use strict";
  const U = (window.M0_AI = window.M0_AI || []);

  /* =================================================================== */
  /* Ünite 6 — AI hata kataloğu                                           */
  /* =================================================================== */
  U.push({
    id: "m0-u6",
    minutes: 35,
    packages: ["numpy", "pandas"],
    title: { tr: "YZ hata kataloğu: ekonomi ve finansta sessiz hatalar", en: "The AI error catalogue: silent mistakes in economics and finance" },
    blurb: { tr: "Birim, zaman, veri ve yorum hataları: YZ'nin alanımızda en sık yaptığı ve hata mesajı vermeyen yanlışlar.", en: "Unit, time, data and interpretation mistakes: the errors AI makes most often in our field, without any error message." },
    terms: [{ tr: "geometrik ortalama", en: "geometric mean" }, { tr: "reel / nominal", en: "real / nominal" }, { tr: "geleceği görme yanlılığı", en: "look-ahead bias" }, { tr: "sahte veri", en: "fabricated data" }],
    concept: {
      tr: `<p>Genel programlama hatalarını YZ giderek daha az yapıyor. Ama ekonomi ve finans verisine özgü hatalar, <b>alan bilgisi</b> gerektirdiği için hâlâ çok yaygın. Üstelik bunların neredeyse hiçbiri hata mesajı vermez. Bu katalog, YZ'nin kodunu okurken aklında tutman gereken kontrol listesidir.</p>
<table><thead><tr><th>Kategori</th><th>Tipik YZ hatası</th><th>Doğrusu</th></tr></thead><tbody>
<tr><td rowspan="3"><b>Birim</b></td><td>Aylık oranları toplamak</td><td>Bileşik: (1 + r) çarpımı</td></tr>
<tr><td>Ortalama büyüme için aritmetik ortalama</td><td>Geometrik ortalama</td></tr>
<tr><td>Oran ile yüzdeyi karıştırmak</td><td>Birimi isteğe yaz, kontrol et</td></tr>
<tr><td rowspan="3"><b>Zaman</b></td><td>Sıralanmamış tarihlerde değişim hesaplamak</td><td>Önce tarihe göre sırala</td></tr>
<tr><td>Nominal artışı reel artış diye sunmak</td><td>Enflasyondan arındır</td></tr>
<tr><td>Hesapta gelecekteki değeri kullanmak</td><td>Yalnızca o güne kadarki bilgi</td></tr>
<tr><td rowspan="2"><b>Veri</b></td><td>Veri bulamayınca sahte veri üretmek</td><td>Açıkça hata vermek</td></tr>
<tr><td>Sessizce satır silmek ya da çoğaltmak</td><td>Satır sayısını kontrol etmek</td></tr>
<tr><td><b>Yorum</b></td><td>Korelasyonu nedensellik gibi anlatmak</td><td>8. ünite</td></tr>
</tbody></table>
<div class="box">Model kurarken ortaya çıkan hatalar (veri sızıntısı, aşırı uyum gibi) makine öğrenmesi modüllerinde ayrıca ele alınacak.</div>`,
      en: `<p>AI makes fewer and fewer generic programming mistakes. But mistakes specific to economic and financial data remain very common, because they require <b>domain knowledge</b>. And almost none of them produce an error message. This catalogue is the checklist to keep in mind when reading AI code.</p>
<table><thead><tr><th>Category</th><th>Typical AI mistake</th><th>The right way</th></tr></thead><tbody>
<tr><td rowspan="3"><b>Units</b></td><td>Adding monthly rates</td><td>Compound: product of (1 + r)</td></tr>
<tr><td>Arithmetic mean for average growth</td><td>Geometric mean</td></tr>
<tr><td>Mixing up ratio and percent</td><td>State the unit in the prompt; check it</td></tr>
<tr><td rowspan="3"><b>Time</b></td><td>Computing changes on unsorted dates</td><td>Sort by date first</td></tr>
<tr><td>Presenting nominal growth as real</td><td>Deflate by inflation</td></tr>
<tr><td>Using future values in a calculation</td><td>Only information available up to that date</td></tr>
<tr><td rowspan="2"><b>Data</b></td><td>Fabricating data when none is found</td><td>Fail loudly</td></tr>
<tr><td>Silently deleting or duplicating rows</td><td>Check the row count</td></tr>
<tr><td><b>Interpretation</b></td><td>Narrating correlation as causation</td><td>Unit 8</td></tr>
</tbody></table>
<div class="box">Mistakes that arise when building models (data leakage, overfitting and the like) are covered separately in the machine learning modules.</div>`
    },
    playground: {
      type: "roadmap",
      intro: { tr: "Her kategoriye tıkla: YZ'nin tipik kodu ve düzeltilmiş hâli yan yana.", en: "Click each category: the AI's typical code and the corrected version side by side." },
      steps: [
        { title: { tr: "Birim", en: "Units" }, text: { tr: "<p>Ortalama yıllık büyüme, yıllık oranların aritmetik ortalaması değildir. Oranlar birbiri üzerine bindiği için <b>geometrik ortalama</b> gerekir.</p>", en: "<p>Average annual growth is not the arithmetic mean of annual rates. Because rates compound, you need the <b>geometric mean</b>.</p>" }, code: { tr: "# YZ:      sum(oranlar) / len(oranlar)\n# Doğrusu: (carpim(1 + r/100) ** (1/n) - 1) * 100", en: "# AI:    sum(rates) / len(rates)\n# Right: (product(1 + r/100) ** (1/n) - 1) * 100" } },
        { title: { tr: "Zaman", en: "Time" }, text: { tr: "<p>Merkez bankası ve istatistik kurumu indirmeleri bazen en yeni tarihi en üstte verir. Sıralamadan <code>pct_change</code> yaparsan değişimler ters işaretli çıkar.</p>", en: "<p>Downloads from statistics offices sometimes list the newest date first. If you run <code>pct_change</code> without sorting, changes come out with the wrong sign.</p>" }, code: { tr: 'df = df.sort_values("tarih")\ndf["yillik"] = df["endeks"].pct_change(periods=12) * 100', en: 'df = df.sort_values("date")\ndf["annual"] = df["index"].pct_change(periods=12) * 100' } },
        { title: { tr: "Reel / nominal", en: "Real / nominal" }, text: { tr: "<p>Maaş %50 arttı, enflasyon %45: reel artış %50 değil, yaklaşık %3,4.</p>", en: "<p>Wages up 50%, inflation 45%: the real rise is not 50% but about 3.4%.</p>" }, code: { tr: "reel = ((1 + 0.50) / (1 + 0.45) - 1) * 100", en: "real = ((1 + 0.50) / (1 + 0.45) - 1) * 100" } },
        { title: { tr: "Veri", en: "Data" }, text: { tr: "<p>“Dosya bulunamazsa örnek veri üret” diyen bir <code>try/except</code>, analizi sessizce kurguya çevirir.</p>", en: "<p>A <code>try/except</code> that says “if the file is missing, generate sample data” silently turns the analysis into fiction.</p>" }, code: { tr: "# Tehlikeli:\n# except Exception:\n#     veri = np.random.normal(...)", en: "# Dangerous:\n# except Exception:\n#     data = np.random.normal(...)" } },
        { title: { tr: "Gelecek", en: "Future" }, text: { tr: "<p>Merkezlenmiş hareketli ortalama, bir ayın değerine <b>sonraki ayı</b> da katar. Tahmin ya da “o gün bilinen” hesaplarda bu hatadır.</p>", en: "<p>A centred moving average mixes the <b>next month</b> into a month's value. For forecasts or “known at the time” calculations, that is a mistake.</p>" }, code: { tr: "# YZ:      s.rolling(3, center=True).mean()\n# Doğrusu: s.rolling(3).mean()", en: "# AI:    s.rolling(3, center=True).mean()\n# Right: s.rolling(3).mean()" } }
      ],
      takeaway: { tr: "Bu hataların hiçbiri Python hatası değil, hepsi iktisat hatası. Onları yakalayacak olan da iktisat bilgin.", en: "None of these are Python errors; all are economics errors. Your economics is what will catch them." }
    },
    cells: [
      {
        id: "m0-u6-c1", kind: "audit",
        task: { tr: "YZ ortalama yıllık enflasyonu aritmetik ortalamayla hesapladı ve bu oranla fiyatların nereye varacağını da söyledi. İddiayı kontrol et: gerçek endeks 5 yıl sonunda 265,6'da. Hatalı satırı bul ve düzelt.", en: "The AI computed average annual inflation with an arithmetic mean and also said where prices would end up at that rate. Check the claim: the actual index ends at 265.6 after 5 years. Find the faulty line and fix it." },
        ai: {
          prompt: { tr: "Son 5 yılın yıllık enflasyonları listede (yüzde). Ortalama yıllık enflasyon nedir?", en: "The last 5 years' annual inflation rates are in a list (percent). What is the average annual inflation?" },
          reply: { tr: "Beş yılın ortalamasını alıyorum:", en: "I take the mean of the five years:" },
          code: { tr: "yillik_enf = [10.0, 20.0, 50.0, 30.0, 3.2]\nort = sum(yillik_enf) / len(yillik_enf)\nprint(round(ort, 1))", en: "annual_inf = [10.0, 20.0, 50.0, 30.0, 3.2]\navg = sum(annual_inf) / len(annual_inf)\nprint(round(avg, 1))" },
          claim: { tr: "Ortalama yıllık enflasyon %22,6. Bu oranla 100 TL'lik sepet 5 yılda yaklaşık 277 TL olur.", en: "Average annual inflation is 22.6%. At this rate a 100-lira basket becomes about 277 lira in 5 years." }
        },
        bugLines: [2],
        lineExplain: { tr: "Oranlar birbiri üzerine bindiği için ortalama oran <b>geometrik ortalamadır</b>. Aritmetik ortalama (%22,6) 5 yılda 277'ye götürür; gerçek endeks 265,6. Geometrik ortalama (≈ %21,6) tam olarak 265,6'yı verir.", en: "Because rates compound, the average rate is the <b>geometric mean</b>. The arithmetic mean (22.6%) leads to 277 after 5 years; the actual index is 265.6. The geometric mean (≈ 21.6%) gives exactly 265.6." },
        hints: [{ tr: "Önce toplam artış çarpanını bul: (1 + r/100)'lerin çarpımı. Sonra bunun 1/5. kuvvetini al.", en: "First find the total growth factor: the product of (1 + r/100). Then take its 1/5th power." }],
        solution: { tr: "yillik_enf = [10.0, 20.0, 50.0, 30.0, 3.2]\ncarpan = 1\nfor r in yillik_enf:\n    carpan = carpan * (1 + r / 100)\nort = (carpan ** (1 / len(yillik_enf)) - 1) * 100\nprint(round(ort, 1))", en: "annual_inf = [10.0, 20.0, 50.0, 30.0, 3.2]\nfactor = 1\nfor r in annual_inf:\n    factor = factor * (1 + r / 100)\navg = (factor ** (1 / len(annual_inf)) - 1) * 100\nprint(round(avg, 1))" },
        checks: [{ py: { tr: "abs(ort - (__import__('math').prod(1 + r / 100 for r in yillik_enf) ** (1 / 5) - 1) * 100) < 1e-9", en: "abs(avg - (__import__('math').prod(1 + r / 100 for r in annual_inf) ** (1 / 5) - 1) * 100) < 1e-9" }, msg: { tr: "Ortalama, geometrik ortalama olmalı (≈ 21,6).", en: "The average should be the geometric mean (≈ 21.6)." } }],
        after: { tr: "YZ'nin kendi iddiası (277) gerçek endeksle (265,6) çelişiyordu. Bir iddiayı veriyle karşılaştırmak, en hızlı denetim yöntemlerinden biridir.", en: "The AI's own claim (277) contradicted the actual index (265.6). Comparing a claim with the data is one of the fastest audit methods." }
      },
      {
        id: "m0-u6-c2", kind: "audit",
        task: { tr: "İndirilen TÜFE dosyası en yeni ay en üstte olacak şekilde sıralanmış. YZ'nin hesapladığı yıllık enflasyon <b>negatif</b> çıkıyor, oysa fiyatlar her ay %3 artıyor. Hatanın kaynağını bul ve düzelt.", en: "The downloaded CPI file lists the newest month first. The annual inflation the AI computes comes out <b>negative</b>, although prices rise 3% every month. Find the source of the error and fix it." },
        ai: {
          prompt: { tr: "tufe tablosundan yıllık enflasyonu hesapla.", en: "Compute annual inflation from the cpi table." },
          reply: { tr: "12 ay önceye göre yüzde değişimi alıyorum:", en: "I take the percentage change against 12 months earlier:" },
          code: { tr: 'import pandas as pd\ntufe = pd.DataFrame({"tarih": pd.date_range("2023-01-01", periods=15, freq="MS")[::-1], "endeks": [round(100 * 1.03 ** i, 2) for i in range(15)][::-1]})\ntufe["yillik"] = tufe["endeks"].pct_change(periods=12) * 100\nprint(tufe[["tarih", "yillik"]].dropna())', en: 'import pandas as pd\ncpi = pd.DataFrame({"date": pd.date_range("2023-01-01", periods=15, freq="MS")[::-1], "index": [round(100 * 1.03 ** i, 2) for i in range(15)][::-1]})\ncpi["annual"] = cpi["index"].pct_change(periods=12) * 100\nprint(cpi[["date", "annual"]].dropna())' },
          claim: { tr: "Yıllık enflasyon yaklaşık −%30; fiyatlar düşüyor.", en: "Annual inflation is about −30%; prices are falling." }
        },
        bugLines: [3],
        lineExplain: { tr: "Tablo yeniden eskiye sıralı. <code>pct_change(periods=12)</code> “12 satır önceye” bakar; burada 12 satır önce aslında 12 ay <b>sonrası</b>. Hesaptan önce tarihe göre sıralamak gerekir. Hem YZ'nin iddiası hem de ekonomik sezgi (her ay %3 artış) bu sonucun yanlış olduğunu bağırıyordu.", en: "The table runs from newest to oldest. <code>pct_change(periods=12)</code> looks “12 rows back”, which here is actually 12 months <b>later</b>. You must sort by date before computing. Both the AI's claim and economic intuition (a 3% rise each month) were screaming that the result was wrong." },
        hints: [{ tr: "Hesap satırından önce <code>tufe = tufe.sort_values(\"tarih\")</code> ekle.", en: "Add <code>cpi = cpi.sort_values(\"date\")</code> before the calculation line." }],
        solution: { tr: 'import pandas as pd\ntufe = pd.DataFrame({"tarih": pd.date_range("2023-01-01", periods=15, freq="MS")[::-1], "endeks": [round(100 * 1.03 ** i, 2) for i in range(15)][::-1]})\ntufe = tufe.sort_values("tarih")\ntufe["yillik"] = tufe["endeks"].pct_change(periods=12) * 100\nprint(tufe[["tarih", "yillik"]].dropna())', en: 'import pandas as pd\ncpi = pd.DataFrame({"date": pd.date_range("2023-01-01", periods=15, freq="MS")[::-1], "index": [round(100 * 1.03 ** i, 2) for i in range(15)][::-1]})\ncpi = cpi.sort_values("date")\ncpi["annual"] = cpi["index"].pct_change(periods=12) * 100\nprint(cpi[["date", "annual"]].dropna())' },
        checks: [{ py: { tr: 'abs(tufe.loc[tufe["tarih"].idxmax(), "yillik"] - (1.03 ** 12 - 1) * 100) < 0.05', en: 'abs(cpi.loc[cpi["date"].idxmax(), "annual"] - (1.03 ** 12 - 1) * 100) < 0.05' }, msg: { tr: "En son ayın yıllık enflasyonu ≈ %42,6 olmalı.", en: "The latest month's annual inflation should be ≈ 42.6%." } }]
      },
      {
        id: "m0-u6-c3", kind: "compare",
        task: { tr: "Veri dosyası bulunamadığında ne olmalı? İki YZ iki farklı yaklaşım önerdi.", en: "What should happen when the data file is missing? Two AIs suggested two approaches." },
        prompt: { tr: "usdtry_2024.csv dosyasından ortalama kuru hesaplayan bir kod yaz; dosya bazen eksik olabiliyor.", en: "Write code that computes the average rate from usdtry_2024.csv; the file is sometimes missing." },
        options: [
          { reply: { tr: "Dosya yoksa kod çökmesin diye örnek veriyle devam ediyorum:", en: "So that the code does not crash if the file is missing, I continue with sample data:" }, code: { tr: 'try:\n    kur = pd.read_csv("usdtry_2024.csv")\nexcept Exception:\n    kur = pd.DataFrame({"usdtry": np.random.normal(32, 1, 250)})\nprint("Ortalama kur:", kur["usdtry"].mean())', en: 'try:\n    fx = pd.read_csv("usdtry_2024.csv")\nexcept Exception:\n    fx = pd.DataFrame({"usdtry": np.random.normal(32, 1, 250)})\nprint("Average rate:", fx["usdtry"].mean())' }, claim: { tr: "Kod her durumda çalışır.", en: "The code always runs." } },
          { reply: { tr: "Dosya yoksa açık bir hata mesajıyla duruyorum:", en: "If the file is missing, I stop with a clear error message:" }, code: { tr: 'import os\nif not os.path.exists("usdtry_2024.csv"):\n    raise FileNotFoundError("usdtry_2024.csv bulunamadı; veri olmadan analiz yapılmadı.")\nkur = pd.read_csv("usdtry_2024.csv")\nprint("Ortalama kur:", kur["usdtry"].mean())', en: 'import os\nif not os.path.exists("usdtry_2024.csv"):\n    raise FileNotFoundError("usdtry_2024.csv not found; no analysis without data.")\nfx = pd.read_csv("usdtry_2024.csv")\nprint("Average rate:", fx["usdtry"].mean())' }, claim: { tr: "Dosya yoksa kod durur ve nedenini söyler.", en: "If the file is missing, the code stops and says why." } }
        ],
        answer: 1,
        reasons: {
          tr: ["B daha az satır içerdiği için.", "A, dosya yokken sahte veriyle gerçekmiş gibi bir “ortalama kur” üretir; B ise sorunu görünür kılar.", "A daha profesyoneldir çünkü kod hiç durmaz."],
          en: ["B, because it has fewer lines.", "A produces an “average rate” from fake data as if real when the file is missing; B makes the problem visible.", "A is more professional because the code never stops."]
        },
        reasonAnswer: 1,
        explain: { tr: "Çöken kod can sıkar; sahte veriyle sessizce çalışan kod raporunu kurguya çevirir. Veriyle ilgili sorunlarda <b>gürültülü başarısızlık</b> her zaman tercih edilir.", en: "Code that crashes is annoying; code that silently runs on fake data turns your report into fiction. With data problems, <b>failing loudly</b> is always preferable." }
      },
      {
        id: "m0-u6-c4", kind: "audit",
        task: { tr: "YZ maaş artışını “reel” diye sunuyor. İddiayı denetle, hatalı satırı bul ve düzelt.", en: "The AI presents a wage rise as “real”. Audit the claim, find the faulty line and fix it." },
        ai: {
          prompt: { tr: "Maaşım 2023'te 20.000 TL, 2024'te 30.000 TL oldu. Aynı dönemde enflasyon %45. Reel olarak ne kadar arttı?", en: "My salary was 20,000 lira in 2023 and 30,000 in 2024. Inflation over the period was 45%. How much did it rise in real terms?" },
          reply: { tr: "Artış oranını hesaplayalım:", en: "Let us compute the rate of increase:" },
          code: { tr: 'maas_2023 = 20000\nmaas_2024 = 30000\nenflasyon = 45.0\nartis = (maas_2024 / maas_2023 - 1) * 100\nprint(f"Reel artış: %{artis:.1f}")', en: 'wage_2023 = 20000\nwage_2024 = 30000\ninflation = 45.0\nrise = (wage_2024 / wage_2023 - 1) * 100\nprint(f"Real rise: {rise:.1f}%")' },
          claim: { tr: "Maaşınız reel olarak %50 arttı.", en: "Your salary rose 50% in real terms." }
        },
        bugLines: [4],
        lineExplain: { tr: "Hesaplanan %50 <b>nominal</b> artış; <code>enflasyon</code> değişkeni tanımlanmış ama hiç kullanılmamış. Reel artış: (1,50 / 1,45 − 1) × 100 ≈ %3,4. Tanımlanıp kullanılmayan bir değişken, iyi bir alarm işaretidir.", en: "The 50% is the <b>nominal</b> rise; the <code>inflation</code> variable is defined but never used. Real rise: (1.50 / 1.45 − 1) × 100 ≈ 3.4%. A variable that is defined but never used is a good warning sign." },
        hints: [{ tr: "Nominal artış çarpanını enflasyon çarpanına böl: <code>(maas_2024 / maas_2023) / (1 + enflasyon / 100)</code>.", en: "Divide the nominal growth factor by the inflation factor: <code>(wage_2024 / wage_2023) / (1 + inflation / 100)</code>." }],
        solution: { tr: 'maas_2023 = 20000\nmaas_2024 = 30000\nenflasyon = 45.0\nartis = ((maas_2024 / maas_2023) / (1 + enflasyon / 100) - 1) * 100\nprint(f"Reel artış: %{artis:.1f}")', en: 'wage_2023 = 20000\nwage_2024 = 30000\ninflation = 45.0\nrise = ((wage_2024 / wage_2023) / (1 + inflation / 100) - 1) * 100\nprint(f"Real rise: {rise:.1f}%")' },
        checks: [{ py: { tr: "abs(artis - ((30000 / 20000) / 1.45 - 1) * 100) < 1e-9", en: "abs(rise - ((30000 / 20000) / 1.45 - 1) * 100) < 1e-9" }, msg: { tr: "Reel artış ≈ %3,4 olmalı.", en: "The real rise should be ≈ 3.4%." } }]
      },
      {
        id: "m0-u6-c5", kind: "audit",
        task: { tr: "Her ay için “o aya kadar olan son 3 ayın ortalaması” istendi; bu sütun daha sonra tahmin için kullanılacak. YZ'nin kodu bir ayın ortalamasına sonraki ayı da katıyor. Bul ve düzelt.", en: "For each month we asked for “the average of the last 3 months up to that month”; the column will later be used for forecasting. The AI's code mixes the next month into each average. Find and fix it." },
        ai: {
          prompt: { tr: "Aylık enflasyon serisinde her ay için o aya kadarki son 3 ayın ortalamasını hesapla.", en: "In the monthly inflation series, compute for each month the average of the last 3 months up to that month." },
          reply: { tr: "Hareketli ortalama kullanıyorum; daha dengeli olsun diye merkezledim:", en: "I use a moving average, centred for balance:" },
          code: { tr: "import pandas as pd\ns = pd.Series([3.2, 4.5, 2.9, 3.0, 3.4, 1.6])\nortalama3 = s.rolling(3, center=True).mean()\nprint(ortalama3.round(2).tolist())", en: "import pandas as pd\ns = pd.Series([3.2, 4.5, 2.9, 3.0, 3.4, 1.6])\navg3 = s.rolling(3, center=True).mean()\nprint(avg3.round(2).tolist())" },
          claim: { tr: "Merkezli ortalama daha dengeli sonuç verir.", en: "A centred average gives a more balanced result." }
        },
        bugLines: [3],
        lineExplain: { tr: "<code>center=True</code>, bir ayın ortalamasına bir önceki, kendisi ve <b>bir sonraki</b> ayı katar. O ay sonunda bilinmeyen bir bilgiyi kullanmak, tahmin çalışmalarında sonucu olduğundan iyi gösterir (<b>geleceği görme yanlılığı</b>). İstek “o aya kadar” diyordu.", en: "<code>center=True</code> averages the previous month, the month itself and the <b>next</b> month. Using information not yet known at the end of that month makes forecasts look better than they are (<b>look-ahead bias</b>). The prompt said “up to that month”." },
        hints: [{ tr: "<code>center=True</code>'yu kaldır.", en: "Remove <code>center=True</code>." }],
        solution: { tr: "import pandas as pd\ns = pd.Series([3.2, 4.5, 2.9, 3.0, 3.4, 1.6])\nortalama3 = s.rolling(3).mean()\nprint(ortalama3.round(2).tolist())", en: "import pandas as pd\ns = pd.Series([3.2, 4.5, 2.9, 3.0, 3.4, 1.6])\navg3 = s.rolling(3).mean()\nprint(avg3.round(2).tolist())" },
        checks: [{ py: { tr: "ortalama3.isna().sum() == 2 and ((ortalama3 - s.rolling(3).mean()).abs().dropna() < 1e-12).all()", en: "avg3.isna().sum() == 2 and ((avg3 - s.rolling(3).mean()).abs().dropna() < 1e-12).all()" }, msg: { tr: "Her ayın değeri yalnızca kendisi ve önceki iki ayın ortalaması olmalı (ilk iki ay boş kalır).", en: "Each month should average only itself and the two previous months (the first two months stay empty)." } }],
        after: { tr: "Bu hata, makine öğrenmesi modüllerinde “veri sızıntısı” olarak çok daha büyük bir sorun hâline gelecek.", en: "In the machine learning modules this mistake grows into a much bigger problem called data leakage." }
      }
    ],
    quiz: [
      { q: { tr: "Yıllık oranları %10 ve %30 olan iki yılın ortalama yıllık büyümesi nedir?", en: "What is the average annual growth of two years at 10% and 30%?" }, options: { tr: ["Tam %20", "%20'nin biraz altında (≈ %19,6)", "%20'nin üstünde"], en: ["Exactly 20%", "A bit below 20% (≈ 19.6%)", "Above 20%"] }, answer: 1, explain: { tr: "√(1,10 × 1,30) − 1 ≈ 0,196. Geometrik ortalama aritmetik ortalamadan küçük ya da ona eşittir.", en: "√(1.10 × 1.30) − 1 ≈ 0.196. The geometric mean is less than or equal to the arithmetic mean." } },
      { q: { tr: "YZ'nin kodunda tanımlanmış ama hiç kullanılmamış bir değişken (örneğin <code>enflasyon</code>) neyin işareti olabilir?", en: "What can a variable that is defined but never used in the AI's code (e.g. <code>inflation</code>) signal?" }, options: { tr: ["Kodun daha hızlı çalıştığının", "Hesaba katılması gereken bir şeyin unutulduğunun", "Hiçbir şeyin"], en: ["That the code runs faster", "That something that should be in the calculation was forgotten", "Nothing"] }, answer: 1, explain: { tr: "Kullanılmayan girdiler, eksik bir adımın en sık görülen izidir.", en: "Unused inputs are the most common trace of a missing step." } },
      { q: { tr: "Veri dosyası bulunamadığında en iyi davranış hangisidir?", en: "What is the best behaviour when a data file is missing?" }, options: { tr: ["Örnek veriyle devam etmek", "Açık bir hata mesajıyla durmak", "Önceki sonucu yeniden kullanmak"], en: ["Continue with sample data", "Stop with a clear error message", "Reuse the previous result"] }, answer: 1, explain: { tr: "Gürültülü başarısızlık, sessiz kurgudan iyidir.", en: "Failing loudly beats silent fiction." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 7 — AI ile hata ayıklama                                       */
  /* =================================================================== */
  U.push({
    id: "m0-u7",
    minutes: 30,
    packages: ["numpy", "pandas"],
    title: { tr: "YZ ile hata ayıklama: düzeltmeyi de denetle", en: "Debugging with AI: audit the fix too" },
    blurb: { tr: "Hata mesajını okumak, YZ'ye doğru bağlamı vermek ve önerilen düzeltmenin sorunu çözüp çözmediğini anlamak.", en: "Reading the error message, giving the AI the right context, and telling whether a suggested fix really solves the problem." },
    terms: [{ tr: "hata izi", en: "traceback" }, { tr: "kök neden", en: "root cause" }, { tr: "belirtiyi gizlemek", en: "masking the symptom" }],
    concept: {
      tr: `<p>Kod hata verdiğinde en kolay yol, hatayı YZ'ye yapıştırıp “düzelt” demek. Bu çoğu zaman işe yarar. Ama YZ'nin amacı <b>hatanın kaybolmasıdır</b>; senin amacın ise <b>sonucun doğru olması</b>. Bu ikisi her zaman aynı şey değildir.</p>
<p><b>1. Hata mesajını sondan oku.</b> Son satır hatanın türünü ve nedenini söyler (<code>KeyError: 'buyume'</code>). Hemen üstündeki satır numarası, hatanın nerede olduğunu gösterir.</p>
<p><b>2. YZ'ye bağlam ver.</b> İyi bir hata ayıklama isteği şunları içerir: tam hata mesajı, ilgili kod, verinin ilk birkaç satırı (<code>df.head()</code>), ne beklediğin ve “hatayı susturma, nedenini açıkla”.</p>
<p><b>3. Düzeltmeyi denetle.</b> Kötü düzeltmeler genellikle üç türlüdür:</p>
<ul>
<li><b>Susturmak:</b> <code>try: … except: pass</code> ile hatayı yutmak.</li>
<li><b>Belirtiyi gizlemek:</b> <code>errors="coerce"</code>, <code>dropna()</code> ya da <code>fillna(0)</code> ile sorunlu değerleri sessizce NaN'a ya da sıfıra çevirmek.</li>
<li><b>Kontrolü silmek:</b> başarısız olan <code>assert</code>'ü kaldırmak ya da gevşetmek.</li>
</ul>
<div class="box econ">İyi bir düzeltme <b>kök nedeni</b> giderir ve kontrolleri yerinde bırakır. Düzeltmeden sonra şunu sor: “Hata gitti, ama sonuç doğru mu?”</div>`,
      en: `<p>When code fails, the easiest move is to paste the error into the AI and say “fix it”. That often works. But the AI's goal is for <b>the error to disappear</b>; your goal is for <b>the result to be right</b>. These are not always the same thing.</p>
<p><b>1. Read the error from the bottom.</b> The last line tells you the type and cause (<code>KeyError: 'growth'</code>). The line number just above shows where it happened.</p>
<p><b>2. Give the AI context.</b> A good debugging prompt includes the full error message, the relevant code, the first rows of the data (<code>df.head()</code>), what you expected, and “do not silence the error; explain its cause”.</p>
<p><b>3. Audit the fix.</b> Bad fixes usually come in three kinds:</p>
<ul>
<li><b>Silencing:</b> swallowing the error with <code>try: … except: pass</code>.</li>
<li><b>Masking the symptom:</b> quietly turning problem values into NaN or zero with <code>errors="coerce"</code>, <code>dropna()</code> or <code>fillna(0)</code>.</li>
<li><b>Deleting the check:</b> removing or loosening the failing <code>assert</code>.</li>
</ul>
<div class="box econ">A good fix removes the <b>root cause</b> and leaves the checks in place. After a fix, ask: “The error is gone, but is the result right?”</div>`
    },
    playground: null,
    cells: [
      {
        id: "m0-u7-c1", kind: "debug",
        task: { tr: "Kod hata veriyor. Hata mesajının son satırını oku: Python hangi ismi bulamıyor? Tablodaki gerçek sütun adına bak ve düzelt.", en: "The code fails. Read the last line of the error: which name can Python not find? Look at the actual column name in the table and fix it." },
        code: { tr: 'import pandas as pd\nveri = pd.DataFrame({"büyüme": [3.1, 2.4, 4.0], "yıl": [2015, 2016, 2017]})\nprint(veri["buyume"].mean())', en: 'import pandas as pd\ndata = pd.DataFrame({"Growth": [3.1, 2.4, 4.0], "Year": [2015, 2016, 2017]})\nprint(data["growth"].mean())' },
        solution: { tr: 'import pandas as pd\nveri = pd.DataFrame({"büyüme": [3.1, 2.4, 4.0], "yıl": [2015, 2016, 2017]})\nprint(veri["büyüme"].mean())', en: 'import pandas as pd\ndata = pd.DataFrame({"Growth": [3.1, 2.4, 4.0], "Year": [2015, 2016, 2017]})\nprint(data["Growth"].mean())' },
        hints: [{ tr: "<code>KeyError</code>: sütun adı birebir aynı olmalı. Tablodaki ad Türkçe karakter (ü) içeriyor.", en: "<code>KeyError</code>: the column name must match exactly. The table's name starts with a capital letter." }],
        checks: [{ py: "abs(float(_out.strip()) - 3.1666666666666665) < 1e-9", msg: { tr: "Ortalama ≈ 3.17 olmalı.", en: "The mean should be ≈ 3.17." } }],
        after: { tr: "YZ'nin yazdığı sütun adları ile veri dosyandaki adlar sık sık farklıdır (Türkçe karakter, büyük harf, boşluk). İsteğe sütun adlarını birebir yazmak bu hatayı önler.", en: "Column names in AI code often differ from those in your file (capitals, spaces, accents). Writing the exact column names in the prompt prevents this." }
      },
      {
        id: "m0-u7-c2", kind: "audit",
        task: { tr: "Kod <code>could not convert string to float</code> hatası veriyordu. YZ bir “düzeltme” önerdi ve hata kayboldu. Ama toplam ihracat şimdi 0 çıkıyor. Düzeltmeyi denetle: hangi satır sorunu gizliyor? Kök nedeni gider.", en: "The code raised <code>could not convert string to float</code>. The AI suggested a “fix” and the error disappeared. But total exports now come out as 0. Audit the fix: which line hides the problem? Fix the root cause." },
        ai: {
          prompt: { tr: "Kodum 'could not convert string to float' hatası veriyor, düzeltir misin?", en: "My code raises 'could not convert string to float', can you fix it?" },
          reply: { tr: "Dönüştürülemeyen değerleri otomatik olarak işleyen bir parametre ekledim:", en: "I added a parameter that automatically handles values that cannot be converted:" },
          code: { tr: 'import pandas as pd\nihracat = pd.DataFrame({"ay": ["Oca", "Şub", "Mar", "Nis"], "deger": ["21.345,6", "19.880,2", "22.104,9", "20.512,3"]})\nihracat["deger"] = pd.to_numeric(ihracat["deger"], errors="coerce")\ntoplam = ihracat["deger"].sum()\nprint("Toplam ihracat (milyon $):", toplam)', en: 'import pandas as pd\nexports = pd.DataFrame({"month": ["Jan", "Feb", "Mar", "Apr"], "value": ["21.345,6", "19.880,2", "22.104,9", "20.512,3"]})\nexports["value"] = pd.to_numeric(exports["value"], errors="coerce")\ntotal = exports["value"].sum()\nprint("Total exports (million $):", total)' },
          claim: { tr: "Hata giderildi, kod artık sorunsuz çalışıyor.", en: "The error is fixed; the code now runs without problems." }
        },
        bugLines: [3],
        lineExplain: { tr: "<code>errors=\"coerce\"</code>, dönüştüremediği her değeri sessizce NaN yapar. Sayılar Türkçe biçimde (binlik ayırıcı nokta, ondalık virgül) yazıldığı için <b>hepsi</b> NaN oldu ve toplam 0 çıktı. Hata kayboldu, ama sonuç tamamen yanlış.", en: "<code>errors=\"coerce\"</code> silently turns every value it cannot convert into NaN. Because the numbers are written in Turkish format (dot as thousands separator, comma as decimal), <b>all</b> became NaN and the total came out as 0. The error disappeared, but the result is completely wrong." },
        hints: [{ tr: "Önce binlik noktayı sil, sonra ondalık virgülü noktaya çevir: <code>.str.replace(\".\", \"\", regex=False).str.replace(\",\", \".\", regex=False).astype(float)</code>", en: "First remove the thousands dot, then turn the decimal comma into a dot: <code>.str.replace(\".\", \"\", regex=False).str.replace(\",\", \".\", regex=False).astype(float)</code>" }],
        solution: { tr: 'import pandas as pd\nihracat = pd.DataFrame({"ay": ["Oca", "Şub", "Mar", "Nis"], "deger": ["21.345,6", "19.880,2", "22.104,9", "20.512,3"]})\nihracat["deger"] = ihracat["deger"].str.replace(".", "", regex=False).str.replace(",", ".", regex=False).astype(float)\ntoplam = ihracat["deger"].sum()\nprint("Toplam ihracat (milyon $):", toplam)', en: 'import pandas as pd\nexports = pd.DataFrame({"month": ["Jan", "Feb", "Mar", "Apr"], "value": ["21.345,6", "19.880,2", "22.104,9", "20.512,3"]})\nexports["value"] = exports["value"].str.replace(".", "", regex=False).str.replace(",", ".", regex=False).astype(float)\ntotal = exports["value"].sum()\nprint("Total exports (million $):", total)' },
        checks: [{ py: { tr: "abs(toplam - 83843.0) < 1e-6", en: "abs(total - 83843.0) < 1e-6" }, msg: { tr: "Toplam ≈ 83.843 milyon $ olmalı.", en: "The total should be ≈ 83,843 million $." } }],
        after: { tr: "Türkiye verisiyle çalışırken sayı biçimi en sık karşılaşacağın sorunlardan biri. CSV okurken <code>pd.read_csv(..., thousands=\".\", decimal=\",\")</code> da aynı işi görür.", en: "Number formats are one of the most common issues with Turkish data. <code>pd.read_csv(..., thousands=\".\", decimal=\",\")</code> does the same job when reading a CSV." }
      },
      {
        id: "m0-u7-c3", kind: "compare",
        task: { tr: "Bir kontrol satırı hata veriyor: <code>assert yillik &gt; 1, \"Oran gibi görünüyor\"</code> (yillik = 0.384). YZ iki düzeltme önerdi. Hangisini kabul edersin?", en: "A check fails: <code>assert annual &gt; 1, \"Looks like a ratio\"</code> (annual = 0.384). The AI suggested two fixes. Which do you accept?" },
        options: [
          { reply: { tr: "Kontrol gereksiz yere hata veriyor, kaldırdım:", en: "The check fails needlessly, so I removed it:" }, code: { tr: 'yillik = 0.384\nprint(f"Yıllık enflasyon: %{yillik:.1f}")', en: 'annual = 0.384\nprint(f"Annual inflation: {annual:.1f}%")' }, claim: { tr: "Artık hata yok.", en: "No more errors." } },
          { reply: { tr: "Değer oran olarak gelmiş; yüzdeye çevirdim, kontrolü bıraktım:", en: "The value arrived as a ratio; I converted it to percent and kept the check:" }, code: { tr: 'yillik = 0.384 * 100\nassert yillik > 1, "Oran gibi görünüyor"\nprint(f"Yıllık enflasyon: %{yillik:.1f}")', en: 'annual = 0.384 * 100\nassert annual > 1, "Looks like a ratio"\nprint(f"Annual inflation: {annual:.1f}%")' }, claim: { tr: "Yıllık enflasyon %38,4.", en: "Annual inflation is 38.4%." } }
        ],
        answer: 1,
        reasons: {
          tr: ["A daha kısa ve hata vermiyor.", "A kontrolü silip yanlış sonucu (%0,4) raporlar; B kök nedeni (birim) düzeltir ve kontrolü korur.", "İkisi de aynı sonucu verir."],
          en: ["A is shorter and gives no error.", "A deletes the check and reports a wrong result (0.4%); B fixes the root cause (the unit) and keeps the check.", "Both give the same result."]
        },
        reasonAnswer: 1,
        explain: { tr: "Başarısız bir kontrolü silmek, yangın alarmını susturmak için pilini çıkarmaktır.", en: "Deleting a failing check is removing the smoke alarm's battery to stop the noise." }
      },
      {
        id: "m0-u7-c4", kind: "prompt",
        task: { tr: "YZ'ye bir hata ayıklama isteği yaz. Durum: <code>tufe[\"yillik\"] = tufe[\"Endeks\"].pct_change(12)</code> satırı <code>KeyError: 'Endeks'</code> veriyor. Tablonun sütunları <code>tarih</code> ve <code>endeks</code>. Yıllık enflasyonun yüzde olarak hesaplanmasını istiyorsun.", en: "Write a debugging prompt for the AI. Situation: the line <code>cpi[\"annual\"] = cpi[\"Index\"].pct_change(12)</code> raises <code>KeyError: 'Index'</code>. The table's columns are <code>date</code> and <code>index</code>. You want annual inflation in percent." },
        weak: { prompt: { tr: "kod çalışmıyor düzelt", en: "code doesn't work fix it" } },
        checklist: [
          { label: { tr: "Tam hata mesajı", en: "The full error message" }, why: { tr: "Hata türü ve mesajı birebir.", en: "Error type and message, verbatim." }, re: { tr: "KeyError|hata mesajı|Traceback", en: "KeyError|error message|Traceback" } },
          { label: { tr: "İlgili kod", en: "The relevant code" }, why: { tr: "Hata veren satır.", en: "The failing line." }, re: { tr: "pct_change|satır|kod", en: "pct_change|line|code" } },
          { label: { tr: "Veri bilgisi", en: "Data information" }, why: { tr: "Sütun adları ya da ilk satırlar.", en: "Column names or the first rows." }, re: { tr: "sütun|tarih|endeks|head", en: "column|date|index|head" } },
          { label: { tr: "Beklenen sonuç", en: "Expected result" }, why: { tr: "Ne olmasını istiyorsun?", en: "What do you want to happen?" }, re: { tr: "yüzde|yıllık|bekli|istiyorum|olmalı", en: "percent|annual|expect|want|should" } },
          { label: { tr: "Susturma yasağı", en: "No silencing" }, why: { tr: "“Hatayı gizleme, nedenini açıkla.”", en: "“Do not hide the error; explain its cause.”" }, re: { tr: "susturma|gizleme|neden|açıkla|try", en: "silenc|hide|cause|explain|try" } }
        ],
        minLen: 100,
        strong: {
          prompt: { tr: "Şu satır hata veriyor: tufe[\"yillik\"] = tufe[\"Endeks\"].pct_change(12). Hata mesajı: KeyError: 'Endeks'. tufe tablosunun sütunları 'tarih' (aylık) ve 'endeks'. Amacım yıllık enflasyonu yüzde olarak 'yillik' sütununa eklemek. Hatanın nedenini açıkla ve düzelt; try/except ile susturma, sütun adını uydurma. Düzeltmeden sonra son 3 satırı göster.", en: "This line fails: cpi[\"annual\"] = cpi[\"Index\"].pct_change(12). Error message: KeyError: 'Index'. The cpi table's columns are 'date' (monthly) and 'index'. I want annual inflation in percent in an 'annual' column. Explain the cause and fix it; do not silence it with try/except or invent a column name. After the fix, show the last 3 rows." }
        },
        after: { tr: "Bu örnekte iki sorun var: sütun adı (büyük harf) ve birim (×100 eksik). İyi bir istek, YZ'nin ikincisini de fark etmesini sağlar.", en: "There are two problems here: the column name (capital letter) and the unit (×100 missing). A good prompt helps the AI notice the second one too." }
      }
    ],
    quiz: [
      { q: { tr: "Bir Python hata mesajında önce hangi kısma bakılır?", en: "Which part of a Python error message do you read first?" }, options: { tr: ["İlk satıra", "Son satıra (hata türü ve mesajı)", "Ortadaki satırlara"], en: ["The first line", "The last line (error type and message)", "The middle lines"] }, answer: 1, explain: { tr: "Son satır ne olduğunu, üstündeki satır numarası nerede olduğunu söyler.", en: "The last line says what happened; the line number above says where." } },
      { q: { tr: "YZ'nin önerdiği <code>errors=\"coerce\"</code> düzeltmesi neden tehlikeli olabilir?", en: "Why can the AI's <code>errors=\"coerce\"</code> fix be dangerous?" }, options: { tr: ["Kodu yavaşlatır", "Dönüştürülemeyen değerleri sessizce NaN yapar; hata kaybolur ama veri de kaybolabilir", "Yeni sütun ekler"], en: ["It slows the code", "It silently turns unconvertible values into NaN; the error disappears but so may the data", "It adds a new column"] }, answer: 1, explain: { tr: "Belirtiyi gizlemek, sorunu çözmek değildir.", en: "Masking the symptom is not solving the problem." } },
      { q: { tr: "Bir düzeltmeden sonra sorulacak en önemli soru nedir?", en: "What is the most important question after a fix?" }, options: { tr: ["Hata gitti mi?", "Hata gitti; sonuç doğru mu?", "Kod daha kısa mı?"], en: ["Is the error gone?", "The error is gone; is the result right?", "Is the code shorter?"] }, answer: 1, explain: { tr: "Hatasız çalışan kod ile doğru sonuç veren kod aynı şey değildir.", en: "Code that runs without errors and code that gives the right result are not the same thing." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 8 — Yorum ve raporlama                                         */
  /* =================================================================== */
  U.push({
    id: "m0-u8",
    minutes: 25,
    title: { tr: "Yorum ve raporlama: YZ'nin abartılarını yakalamak", en: "Interpretation and reporting: catching the AI's overstatements" },
    blurb: { tr: "Akıcı ama abartılı YZ yorumlarını ayıklamak ve sınırlarını bilen bir sonuç paragrafı yazmak.", en: "Filtering fluent but overstated AI interpretations, and writing a result paragraph that knows its limits." },
    terms: [{ tr: "nedensellik", en: "causality" }, { tr: "genelleme", en: "generalisation" }, { tr: "belirsizlik", en: "uncertainty" }, { tr: "sahte kesinlik", en: "spurious precision" }],
    concept: {
      tr: `<p>YZ sonuçları yorumlamakta çok akıcıdır. Sorun da buradadır: akıcı bir metin, verinin söylediğinden fazlasını söylediğinde fark etmek zorlaşır. Bir iktisatçı olarak son kontrol noktası sensin.</p>
<p><b>YZ yorumlarında sık görülen altı abartı</b></p>
<ul>
<li><b>Nedensellik:</b> “X, Y'yi artırır.” Oysa veri yalnızca birlikte hareket ettiklerini gösteriyor.</li>
<li><b>Genelleme:</b> Tek bir ülke, dönem ya da örneklemden “her zaman”, “tüm ülkelerde” sonucuna gitmek.</li>
<li><b>Kesinlik:</b> Belirsizliği yok saymak: “Kur 38 olacak.”</li>
<li><b>Sahte kesinlik:</b> “%4,73829 arttı.” Verinin doğruluğundan fazla basamak.</li>
<li><b>Kurguyu gerçek sanmak:</b> Simüle ya da kurgusal veriden gerçek dünya hakkında sonuç çıkarmak.</li>
<li><b>Tavsiyeye kaymak:</b> Analizden doğrudan politika ya da yatırım önerisi türetmek.</li>
</ul>
<p><b>İyi bir sonuç paragrafının dört parçası:</b> 1) Bulgu (ne gördük), 2) Büyüklük (ne kadar), 3) Bağlam (hangi veri, hangi dönem), 4) Sınırlar (neyi göstermez).</p>`,
      en: `<p>AI is very fluent at interpreting results. That is exactly the problem: when a fluent text says more than the data do, it is hard to notice. As an economist, you are the final checkpoint.</p>
<p><b>Six common overstatements in AI interpretations</b></p>
<ul>
<li><b>Causality:</b> “X raises Y.” The data only show that they move together.</li>
<li><b>Generalisation:</b> going from one country, period or sample to “always” or “in all countries”.</li>
<li><b>Certainty:</b> ignoring uncertainty: “The rate will be 38.”</li>
<li><b>Spurious precision:</b> “Rose by 4.73829%.” More digits than the data's accuracy allows.</li>
<li><b>Mistaking fiction for fact:</b> drawing real-world conclusions from simulated or fictional data.</li>
<li><b>Sliding into advice:</b> deriving policy or investment recommendations straight from the analysis.</li>
</ul>
<p><b>The four parts of a good result paragraph:</b> 1) Finding (what we saw), 2) Magnitude (how much), 3) Context (which data, which period), 4) Limits (what it does not show).</p>`
    },
    playground: {
      type: "roadmap",
      intro: { tr: "İyi bir sonuç paragrafının dört parçasına tıkla ve her birinin nasıl yazıldığını gör.", en: "Click the four parts of a good result paragraph and see how each is written." },
      steps: [
        { title: { tr: "Bulgu", en: "Finding" }, text: { tr: "<p>“Kurgusal veride büyümenin yüksek olduğu yıllarda işsizlik daha düşüktür.”</p><p>Ne gördüğünü yaz; neden olduğunu değil.</p>", en: "<p>“In the fictional data, unemployment is lower in high-growth years.”</p><p>Write what you saw, not why it happened.</p>" }, code: { tr: "# Bulgu = gözlenen ilişki", en: "# Finding = the observed relationship" } },
        { title: { tr: "Büyüklük", en: "Magnitude" }, text: { tr: "<p>“Korelasyon −0,8 civarındadır.” Anlamlı basamak sayısıyla.</p>", en: "<p>“The correlation is around −0.8.” With a sensible number of digits.</p>" }, code: { tr: "round(korelasyon, 2)", en: "round(correlation, 2)" } },
        { title: { tr: "Bağlam", en: "Context" }, text: { tr: "<p>“Veri 2015–2024 dönemine ait 10 yıllık kurgusal bir örnektir.”</p>", en: "<p>“The data are a fictional 10-year sample for 2015–2024.”</p>" }, code: { tr: "# Hangi veri? Hangi dönem? Kaç gözlem?", en: "# Which data? Which period? How many observations?" } },
        { title: { tr: "Sınırlar", en: "Limits" }, text: { tr: "<p>“Bu ilişki nedensellik göstermez ve gözlem sayısı az olduğu için genellenemez.”</p>", en: "<p>“This relationship does not show causality and, with few observations, cannot be generalised.”</p>" }, code: { tr: "# Neyi göstermez?", en: "# What does it not show?" } }
      ],
      takeaway: { tr: "YZ'den yorum isterken bu dört parçayı açıkça iste; gelen yorumu bu dört parçaya göre denetle.", en: "When you ask the AI for an interpretation, ask explicitly for these four parts, and audit the answer against them." }
    },
    cells: [
      {
        id: "m0-u8-c1", kind: "interpret",
        task: { tr: "Simüle kur yollarından elde edilen bir sonucu YZ yorumladı. Abartılı ya da desteklenmeyen cümleleri işaretle.", en: "The AI interpreted a result from simulated exchange-rate paths. Mark the overstated or unsupported sentences." },
        prompt: { tr: "1000 simülasyonda 250. gündeki kurun %5 ve %95 yüzdelikleri 27,4 ve 34,9 çıktı. Yorumlar mısın?", en: "In 1000 simulations, the 5th and 95th percentiles of the rate on day 250 are 27.4 and 34.9. Can you interpret this?" },
        sentences: {
          tr: ["Simülasyonların %90'ında 250. gündeki kur 27,4 ile 34,9 arasında kalmıştır.", "Dolayısıyla kurun yıl sonunda bu aralıkta olacağı kesindir.", "Bu aralık, modelin varsaydığı ortalama getiri ve oynaklığa bağlıdır.", "Bu nedenle yatırımcıların hemen döviz alması gerekir.", "Gerçek getiriler kalın kuyruklu olabileceği için uç olaylar modelin önerdiğinden sık yaşanabilir."],
          en: ["In 90% of the simulations the rate on day 250 stayed between 27.4 and 34.9.", "It is therefore certain that the rate will be in this range at year end.", "This range depends on the mean return and volatility assumed by the model.", "Investors should therefore buy foreign currency immediately.", "Because real returns can have fat tails, extreme events may occur more often than the model suggests."]
        },
        bad: [1, 3],
        explain: {
          tr: ["Doğru: simülasyonun ne gösterdiğini tarif ediyor.", "<b>Abartı:</b> simülasyon bir kesinlik değil, varsayımlara bağlı bir olasılık aralığı verir.", "Doğru: sonucun varsayımlara bağlı olduğunu hatırlatıyor.", "<b>Abartı:</b> bir simülasyondan doğrudan yatırım tavsiyesi çıkarılamaz.", "Doğru: modelin önemli bir sınırına dikkat çekiyor."],
          en: ["Fine: it describes what the simulation shows.", "<b>Overclaim:</b> a simulation gives an assumption-dependent probability range, not certainty.", "Fine: it reminds us the result depends on assumptions.", "<b>Overclaim:</b> you cannot derive investment advice directly from a simulation.", "Fine: it points to an important limit of the model."]
        }
      },
      {
        id: "m0-u8-c2", kind: "interpret",
        task: { tr: "Bu kez YZ bir ihracat sonucunu yorumladı. Sorunlu cümleleri bul.", en: "This time the AI interpreted an export result. Find the problematic sentences." },
        prompt: { tr: "Kurgusal bir ülkenin ihracatı 2023'te 250,0 milyar $, 2024'te 261,8 milyar $. Yorumla.", en: "A fictional country's exports were 250.0 billion $ in 2023 and 261.8 billion $ in 2024. Interpret." },
        sentences: {
          tr: ["İhracat bir yılda yaklaşık %4,7 artmıştır.", "Artış tam olarak %4,72000 olarak hesaplanmıştır ve bu kesin bir göstergedir.", "Bu artış dolar cinsindendir; fiyat etkisi ayrılmadığı için reel artış farklı olabilir.", "Bu, ülkenin rekabet gücünün kalıcı olarak arttığını kanıtlar.", "Yalnızca iki yıllık veriye dayandığı için bir eğilim olarak yorumlanmamalıdır."],
          en: ["Exports rose by about 4.7% in one year.", "The rise is exactly 4.72000% and is a definitive indicator.", "The rise is in dollars; since price effects are not removed, the real rise may differ.", "This proves that the country's competitiveness has permanently increased.", "Because it rests on only two years of data, it should not be read as a trend."]
        },
        bad: [1, 3],
        explain: {
          tr: ["Doğru: bulgu ve büyüklük makul basamakla verilmiş.", "<b>Sahte kesinlik:</b> fazla basamak ve “kesin gösterge” iddiası.", "Doğru: nominal ve reel ayrımını hatırlatıyor.", "<b>Abartı:</b> iki yıllık nominal artıştan kalıcı rekabet gücü sonucu çıkarılamaz.", "Doğru: örneklem sınırını belirtiyor."],
          en: ["Fine: finding and magnitude with sensible digits.", "<b>Spurious precision:</b> too many digits and a “definitive indicator” claim.", "Fine: it flags the nominal versus real distinction.", "<b>Overclaim:</b> a two-year nominal rise cannot establish permanent competitiveness.", "Fine: it states the sample limit."]
        }
      },
      {
        id: "m0-u8-c3", kind: "prompt",
        task: { tr: "YZ'den bir sonucu yorumlamasını isteyeceksin. Sonuç: 10 yıllık <b>kurgusal</b> veride büyüme ile işsizlik değişimi arasındaki korelasyon −0,81. YZ'nin abartı yapma alanını daraltan bir istek yaz.", en: "You will ask the AI to interpret a result: in 10 years of <b>fictional</b> data, the correlation between growth and the change in unemployment is −0.81. Write a prompt that narrows the AI's room for overstatement." },
        weak: { prompt: { tr: "Sonucu yorumla.", en: "Interpret the result." }, reply: { tr: "Büyüme işsizliği güçlü biçimde düşürmektedir; bu ilişki Okun yasasını kanıtlar ve tüm ekonomiler için geçerlidir.", en: "Growth strongly reduces unemployment; this relationship proves Okun's law and holds for all economies." } },
        checklist: [
          { label: { tr: "Sonucun kendisi", en: "The result itself" }, why: { tr: "Sayıyı ve neyin korelasyonu olduğunu ver.", en: "Give the number and what it is the correlation of." }, re: { tr: "0[,.]81|korelasyon", en: "0[,.]81|correlation" } },
          { label: { tr: "Veri bağlamı", en: "Data context" }, why: { tr: "Kurgusal, 10 yıl, kaç gözlem.", en: "Fictional, 10 years, number of observations." }, re: { tr: "kurgusal|simüle|10 yıl|gözlem", en: "fictional|simulated|10 years|observation" } },
          { label: { tr: "Nedensellik uyarısı", en: "Causality caveat" }, why: { tr: "Neden-sonuç iddiası istemediğini söyle.", en: "Say you do not want causal claims." }, re: { tr: "nedensel|neden-sonuç|neden sonuç", en: "causal|cause" } },
          { label: { tr: "Sınırlar", en: "Limits" }, why: { tr: "Genelleme ve belirsizlik.", en: "Generalisation and uncertainty." }, re: { tr: "sınır|genelle|uyarı|kısıt", en: "limit|generali|caveat|constraint" } },
          { label: { tr: "Biçim", en: "Format" }, why: { tr: "Kaç cümle, hangi yapı.", en: "How many sentences, what structure." }, re: { tr: "cümle|paragraf|madde|kısa", en: "sentence|paragraph|bullet|short" } }
        ],
        minLen: 100,
        strong: { prompt: { tr: "10 yıllık kurgusal bir veride büyüme ile işsizlikteki değişim arasındaki korelasyon −0,81 çıktı. Bunu 4 cümlelik bir paragrafta yorumla: bulgu, büyüklük, veri bağlamı ve sınırlar. Neden-sonuç iddiasında bulunma; verinin kurgusal ve gözlem sayısının az olduğunu belirt; gerçek ekonomilere genelleme yapma.", en: "In 10 years of fictional data, the correlation between growth and the change in unemployment is −0.81. Interpret it in a 4-sentence paragraph: finding, magnitude, data context and limits. Make no causal claims; state that the data are fictional and the number of observations is small; do not generalise to real economies." } }
      }
    ],
    quiz: [
      { q: { tr: "“Faiz artışı enflasyonu düşürür” cümlesi bir korelasyon sonucunu yorumluyorsa sorun nedir?", en: "If “raising rates lowers inflation” interprets a correlation result, what is the problem?" }, options: { tr: ["Dilbilgisi hatası", "Korelasyondan nedensellik çıkarılıyor", "Sorun yok"], en: ["A grammar mistake", "Causality is inferred from correlation", "No problem"] }, answer: 1, explain: { tr: "Gözlemsel veriden nedensellik çıkarılamaz; bunun için uygun bir araştırma tasarımı gerekir. Bu laboratuvarda ilişkileri “birlikte hareket” olarak yorumluyoruz.", en: "Causality cannot be inferred from observational data alone; it requires a suitable research design. In this lab we interpret relationships as “moving together”." } },
      { q: { tr: "“İhracat %4,73829 arttı” ifadesinin sorunu nedir?", en: "What is wrong with “exports rose by 4.73829%”?" }, options: { tr: ["Sahte kesinlik: verinin doğruluğundan fazla basamak", "Yanlış birim", "Sorun yok"], en: ["Spurious precision: more digits than the data's accuracy", "Wrong unit", "No problem"] }, answer: 0, explain: { tr: "Bir ya da iki ondalık genellikle yeterlidir.", en: "One or two decimals are usually enough." } },
      { q: { tr: "İyi bir sonuç paragrafında hangisi mutlaka bulunmalıdır?", en: "What must a good result paragraph include?" }, options: { tr: ["Politika önerisi", "Sınırlar: sonucun neyi göstermediği", "Kodun tamamı"], en: ["A policy recommendation", "Limits: what the result does not show", "The full code"] }, answer: 1, explain: { tr: "Bulgu, büyüklük, bağlam ve sınırlar.", en: "Finding, magnitude, context and limits." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 9 — Colab + Gemini atölyesi                                    */
  /* =================================================================== */
  U.push({
    id: "m0-u9",
    minutes: 45,
    title: { tr: "Colab + Gemini atölyesi: gerçek veriyle ilk analiz", en: "Colab + Gemini workshop: a first analysis with real data" },
    blurb: { tr: "Google Colab'da Gemini'ye kod yazdır, hazır kontrol hücreleriyle denetle, tamamlama kodunu al.", en: "Have Gemini write code in Google Colab, audit it with ready-made check cells, and collect your completion code." },
    terms: [{ tr: "notebook", en: "notebook" }, { tr: "kontrol hücresi", en: "check cell" }, { tr: "FRED", en: "FRED" }, { tr: "TÜFE", en: "CPI" }],
    concept: {
      tr: `<p>Şimdiye kadar YZ yanıtları önceden hazırlanmıştı. Bu atölyede gerçek bir YZ ile, gerçek veriyle çalışacaksın. Ortam <b>Google Colab</b>: tarayıcıda çalışan, ücretsiz bir Python notebook ortamı. İçindeki <b>Gemini</b> asistanına Türkçe ya da İngilizce istek yazıp kod ürettirebilirsin.</p>
<p><b>Nasıl çalışır?</b></p>
<ol>
<li>Görevdeki <b>Colab'da aç</b> düğmesine bas. Notebook GitHub'dan açılır. Kendi kopyanı almak için <i>Dosya → Drive'a kopya kaydet</i>.</li>
<li>İlk hücre (<b>Kurulum</b>) veriyi indirir ve kontrol fonksiyonlarını tanımlar. Çalıştır, değiştirme.</li>
<li><b>Görev</b> hücrelerinde Gemini'yi kullan: hücredeki Gemini düğmesi ya da sağdaki Gemini paneli (Colab'ın arayüzü zamanla değişebilir; adı “Generate”, “Gemini” ya da bir yıldız simgesi olabilir). 4. ünitedeki şablonla istek yaz.</li>
<li>Gemini'nin kodunu <b>çalıştırmadan önce oku</b>. 6. ünitedeki katalogla denetle.</li>
<li><b>Kontrol</b> hücresini çalıştır. Tüm kontroller geçerse bir <b>tamamlama kodu</b> verir; onu buraya yapıştır.</li>
</ol>
<p><b>Veri:</b> ABD tüketici fiyat endeksi (CPIAUCNS, mevsimsellikten arındırılmamış, aylık), St. Louis Fed'in açık FRED veri tabanından. API anahtarı gerektirmediği için seçildi. Türkiye verisi (TCMB EVDS) için ücretsiz bir API anahtarı almak gerekir; bu atölyede kurulum adımı olmasın diye FRED tercih edildi.</p>
<div class="box"><b>Bilmen gerekenler:</b> Colab bir Google hesabı ister. Google'ın duyurularına göre Colab'daki Gemini özellikleri 18 yaş ve üstü kullanıcılara, belirli ülke ve dillerde sunuluyor; kullanmadan önce hesabında görünüp görünmediğini kontrol et. Ücretsiz Colab'da oturum süresi sınırlıdır. Gemini her seferinde farklı kod üretebilir; bu yüzden notlama Gemini'nin koduna değil, kontrol hücresinin sonucuna dayanır. Tamamlama kodu bir öz değerlendirme aracıdır; sınav güvenliği sağlamaz.</div>`,
      en: `<p>So far the AI answers were prepared in advance. In this workshop you work with a real AI on real data. The environment is <b>Google Colab</b>: a free Python notebook that runs in the browser. You can write prompts in English or Turkish to its <b>Gemini</b> assistant and have it generate code.</p>
<p><b>How it works</b></p>
<ol>
<li>Press <b>Open in Colab</b> in the task. The notebook opens from GitHub. To keep your own copy: <i>File → Save a copy in Drive</i>.</li>
<li>The first cell (<b>Setup</b>) downloads the data and defines the check functions. Run it; do not change it.</li>
<li>Use Gemini in the <b>Task</b> cells: the Gemini button in a cell or the Gemini side panel (Colab's interface changes over time; it may be called “Generate”, “Gemini” or show a sparkle icon). Write your prompt with the template from unit 4.</li>
<li><b>Read</b> Gemini's code <b>before running it</b>. Audit it with the catalogue from unit 6.</li>
<li>Run the <b>Check</b> cell. If all checks pass, it gives you a <b>completion code</b>; paste it here.</li>
</ol>
<p><b>Data:</b> the US consumer price index (CPIAUCNS, not seasonally adjusted, monthly) from the St. Louis Fed's open FRED database. It was chosen because it needs no API key. Turkish data (CBRT EVDS) require a free API key; FRED was chosen so that this workshop needs no set-up step.</p>
<div class="box"><b>Good to know:</b> Colab requires a Google account. According to Google's announcements, Gemini features in Colab are offered to users aged 18 and over in selected countries and languages; check whether they appear in your account before you start. Free Colab sessions are time-limited. Gemini may produce different code each time, so grading relies on the check cell's result, not on Gemini's code. The completion code is a self-assessment tool and does not provide exam security.</div>`
    },
    playground: null,
    cells: [
      {
        id: "m0-u9-c1", kind: "prompt",
        task: { tr: "Colab'a geçmeden önce Görev A için Gemini'ye vereceğin isteği burada hazırla. Görev A: notebook'taki <code>tufe</code> tablosundan (sütunlar: <code>tarih</code>, <code>endeks</code>; aylık) yıllık enflasyonu yüzde olarak <code>yillik</code> sütununa eklemek.", en: "Before moving to Colab, prepare your prompt for Task A here. Task A: add annual inflation in percent to an <code>annual</code> column of the notebook's <code>cpi</code> table (columns: <code>date</code>, <code>index</code>; monthly)." },
        weak: { prompt: { tr: "enflasyonu hesapla", en: "calculate inflation" } },
        checklist: [
          { label: { tr: "Tablo ve sütunlar", en: "Table and columns" }, re: { tr: "tufe|tarih|endeks", en: "cpi|date|index" } },
          { label: { tr: "Birim ve frekans", en: "Units and frequency" }, re: { tr: "yüzde|%|12 ay|yıllık", en: "percent|%|12 month|annual" } },
          { label: { tr: "Sıralama", en: "Sorting" }, why: { tr: "Tarihe göre sırala.", en: "Sort by date." }, re: { tr: "sırala|sort", en: "sort" } },
          { label: { tr: "Çıktı", en: "Output" }, re: { tr: "yillik|sütun", en: "annual|column" } },
          { label: { tr: "Kontrol", en: "Check" }, re: { tr: "kontrol|eksik|satır sayısı|uydurma|açıkla", en: "check|missing|row count|invent|explain" } }
        ],
        minLen: 90,
        strong: { prompt: { tr: "tufe adlı pandas tablosunda 'tarih' (aylık, datetime) ve 'endeks' sütunları var. Tabloyu tarihe göre sırala; her ay için 12 ay önceye göre yüzde değişimi hesaplayıp 'yillik' adlı yeni sütuna yaz (pct_change(periods=12) * 100). Başka veri indirme veya uydurma. Satır sayısını, 'yillik' sütunundaki eksik değer sayısını ve son 3 satırı yazdır; ilk 12 ayın neden boş olduğunu tek cümleyle açıkla.", en: "A pandas table called cpi has 'date' (monthly, datetime) and 'index' columns. Sort the table by date; for each month compute the percentage change against 12 months earlier and store it in a new column 'annual' (pct_change(periods=12) * 100). Do not download or invent other data. Print the row count, the number of missing values in 'annual' and the last 3 rows; explain in one sentence why the first 12 months are empty." } }
      },
      {
        id: "m0-u9-c2", kind: "colab",
        task: { tr: "<b>Görev A — Yıllık enflasyon.</b> Notebook'u aç, Gemini ile <code>yillik</code> sütununu oluştur, kontrol hücresini çalıştır ve verdiği kodu buraya yapıştır.", en: "<b>Task A — Annual inflation.</b> Open the notebook, build the <code>annual</code> column with Gemini, run the check cell and paste the code it gives you here." },
        notebook: { tr: "modul0/09_colab_atolyesi_tr.ipynb", en: "module0/09_colab_workshop_en.ipynb" },
        steps: {
          tr: ["Notebook'u aç ve <b>Kurulum</b> hücresini çalıştır (veri indirilir).", "<b>Görev A</b> hücresinde Gemini'ye hazırladığın isteği ver.", "Gemini'nin kodunu oku: sıralama, birim (yüzde), <code>periods=12</code>.", "Kodu çalıştır, sonra <b>Kontrol A</b> hücresini çalıştır.", "Kontrol geçerse ekrana çıkan <code>ML0-…</code> kodunu yapıştır."],
          en: ["Open the notebook and run the <b>Setup</b> cell (data are downloaded).", "In the <b>Task A</b> cell, give Gemini the prompt you prepared.", "Read Gemini's code: sorting, unit (percent), <code>periods=12</code>.", "Run the code, then run the <b>Check A</b> cell.", "If the check passes, paste the <code>ML0-…</code> code it prints."]
        },
        codeHashes: ["30243d14"],
        after: { tr: "Kontrol hücresi geçmeden önce Gemini'nin kodunu kaç kez düzeltmen gerekti? Bunu bir sonraki görevdeki denetim defterine yaz.", en: "How many times did you need to fix Gemini's code before the check passed? Note it in the audit log in the next task." }
      },
      {
        id: "m0-u9-c3", kind: "colab",
        task: { tr: "<b>Görev B — Zirve ay.</b> 2000'den bu yana yıllık enflasyonun en yüksek olduğu ayı ve değerini bul. Aynı notebook'ta devam et.", en: "<b>Task B — The peak month.</b> Find the month since 2000 with the highest annual inflation, and its value. Continue in the same notebook." },
        notebook: { tr: "modul0/09_colab_atolyesi_tr.ipynb", en: "module0/09_colab_workshop_en.ipynb" },
        steps: {
          tr: ["<b>Görev B</b> hücresinde Gemini'den <code>zirve_ay</code> (tarih) ve <code>zirve_deger</code> (yüzde) değişkenlerini üretmesini iste.", "Kodu denetle: 2000 öncesi dışarıda mı, eksik değerler nasıl ele alınmış?", "<b>Kontrol B</b> hücresini çalıştır ve kodu buraya yapıştır."],
          en: ["In the <b>Task B</b> cell, ask Gemini to produce <code>peak_month</code> (a date) and <code>peak_value</code> (percent).", "Audit the code: is everything before 2000 excluded, and how are missing values handled?", "Run the <b>Check B</b> cell and paste the code here."]
        },
        codeHashes: ["e6839ff5"]
      },
      {
        id: "m0-u9-c4", kind: "auditlog",
        task: { tr: "Atölyeyi kısa bir denetim notuyla kapat. Bu not, bitirme projesinde tutacağın denetim defterinin bir provası.", en: "Close the workshop with a short audit note. It is a rehearsal for the audit log you will keep in the capstone." },
        fields: {
          tr: [
            { label: "Gemini'ye ne istedin?", help: "Kullandığın isteği ya da özetini yaz.", ph: "Örnek: tufe tablosunu tarihe göre sıralayıp…" },
            { label: "Gemini'nin kodunda neyi kontrol ettin?", help: "Birim, sıralama, eksik değerler, dönem…", ph: "Örnek: pct_change'in periods=12 olduğunu…" },
            { label: "Neyi düzelttin ya da neden değiştirmedin?", help: "Hiçbir şeyi düzeltmediysen, kodun doğru olduğundan nasıl emin oldun?", ph: "Örnek: Gemini önce oran döndürdü, ×100 ekledim…" }
          ],
          en: [
            { label: "What did you ask Gemini?", help: "Write the prompt you used or a summary.", ph: "Example: sort the cpi table by date and…" },
            { label: "What did you check in Gemini's code?", help: "Units, sorting, missing values, period…", ph: "Example: that pct_change used periods=12…" },
            { label: "What did you fix, or why did you change nothing?", help: "If you fixed nothing, how did you make sure the code was right?", ph: "Example: Gemini first returned a ratio; I added ×100…" }
          ]
        }
      }
    ],
    quiz: [
      { q: { tr: "Colab'daki kontrol hücresi neden Gemini'nin koduna değil sonuca bakar?", en: "Why does the Colab check cell look at the result rather than at Gemini's code?" }, options: { tr: ["Gemini her seferinde farklı ama doğru kod üretebilir; önemli olan sonucun doğruluğu", "Kod okunamaz", "Gemini hiç hata yapmaz"], en: ["Gemini may produce different but correct code each time; what matters is a correct result", "Code cannot be read", "Gemini never makes mistakes"] }, answer: 0, explain: { tr: "Aynı doğru sonuca giden birçok kod olabilir.", en: "Many different pieces of code can lead to the same correct result." } },
      { q: { tr: "Gemini'nin kodunu ne zaman okumalısın?", en: "When should you read Gemini's code?" }, options: { tr: ["Kontrol hücresi hata verirse", "Çalıştırmadan önce", "Hiç; kontrol hücresi yeter"], en: ["If the check cell fails", "Before running it", "Never; the check cell is enough"] }, answer: 1, explain: { tr: "Kontroller her hatayı yakalayamaz; okumak denetimin ilk adımıdır.", en: "Checks cannot catch every mistake; reading is the first step of an audit." } },
      { q: { tr: "Bu atölyede neden ABD verisi (FRED) kullanıldı?", en: "Why does this workshop use US data (FRED)?" }, options: { tr: ["Türkiye verisi önemsiz olduğu için", "Açık ve API anahtarı gerektirmediği için", "Gemini yalnızca ABD verisini anladığı için"], en: ["Because Turkish data do not matter", "Because it is open and needs no API key", "Because Gemini only understands US data"] }, answer: 1, explain: { tr: "EVDS gibi kaynaklar ücretsiz bir API anahtarı ister; FRED ise anahtarsız indirilebildiği için atölyede kurulum gerekmez.", en: "Sources such as EVDS require a free API key; FRED can be downloaded without one, so the workshop needs no set-up." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 10 — Bitirme                                                   */
  /* =================================================================== */
  U.push({
    id: "m0-u10",
    minutes: 60,
    title: { tr: "Bitirme: YZ ile analiz ve denetim raporu", en: "Capstone: an analysis with AI and an audit report" },
    blurb: { tr: "Gerçek veriyle bir soruyu Gemini ile yanıtla, her adımı denetle ve denetim defterini teslim et.", en: "Answer a question with real data using Gemini, audit every step and hand in your audit log." },
    terms: [{ tr: "denetim defteri", en: "audit log" }, { tr: "Phillips eğrisi", en: "Phillips curve" }, { tr: "Okun yasası", en: "Okun's law" }],
    concept: {
      tr: `<p>Modülün tüm becerilerini tek bir projede birleştiriyorsun: soruyu tarif et, Gemini'ye ürettir, her adımı denetle, sonucu sınırlarıyla yorumla ve ne yaptığını belgele.</p>
<p><b>Üç sorudan birini seç</b> (hepsi FRED'in açık verisiyle, 2000–2024):</p>
<ul>
<li><b>A. Enflasyon ve işsizlik:</b> ABD'de yıllık enflasyon ile işsizlik oranı birlikte nasıl hareket etti? (CPIAUCNS, UNRATE)</li>
<li><b>B. Faiz ve enflasyon:</b> Politika faizi enflasyonun neresinde kaldı; reel faiz hangi dönemlerde negatifti? (FEDFUNDS, CPIAUCNS)</li>
<li><b>C. Büyüme ve işsizlik:</b> Çeyreklik reel GSYH büyümesi ile işsizlikteki değişim arasındaki ilişki. (GDPC1, UNRATE)</li>
</ul>
<p><b>Teslim edilecekler</b></p>
<ol>
<li>Notebook'ta analiz: veri hazırlama, en az bir grafik ve bir özet sayı.</li>
<li>Dört parçalı bir sonuç paragrafı (bulgu, büyüklük, bağlam, sınırlar).</li>
<li>Notebook'taki <code>denetim</code> sözlüğü ve bu sayfadaki denetim defteri.</li>
</ol>
<p><b>Değerlendirme ölçütleri</b> (öğretim elemanı için de önerilir): istek kalitesi, doğrulama adımları, bulunan ve düzeltilen hatalar, yorumun dürüstlüğü. YZ'nin hiç hata yapmaması bir başarı ölçütü değildir; senin onu nasıl denetlediğin ölçüttür.</p>
<div class="box">Bulduğun ilişkileri “birlikte hareket” olarak yorumla. Gözlemsel veriden neden-sonuç ilişkisi çıkarmak ayrı bir araştırma tasarımı gerektirir; bu projede böyle bir iddiada bulunma.</div>`,
      en: `<p>You combine every skill from the module in one project: specify the question, have Gemini generate, audit every step, interpret the result with its limits and document what you did.</p>
<p><b>Choose one of three questions</b> (all with open FRED data, 2000–2024):</p>
<ul>
<li><b>A. Inflation and unemployment:</b> how did US annual inflation and the unemployment rate move together? (CPIAUCNS, UNRATE)</li>
<li><b>B. Interest rates and inflation:</b> where did the policy rate sit relative to inflation; in which periods was the real rate negative? (FEDFUNDS, CPIAUCNS)</li>
<li><b>C. Growth and unemployment:</b> the relationship between quarterly real GDP growth and the change in unemployment. (GDPC1, UNRATE)</li>
</ul>
<p><b>Deliverables</b></p>
<ol>
<li>The analysis in the notebook: data preparation, at least one chart and one summary number.</li>
<li>A four-part result paragraph (finding, magnitude, context, limits).</li>
<li>The <code>audit</code> dictionary in the notebook and the audit log on this page.</li>
</ol>
<p><b>Assessment criteria</b> (also suggested for instructors): prompt quality, verification steps, mistakes found and fixed, honesty of the interpretation. The AI making no mistakes is not a criterion of success; how you audited it is.</p>
<div class="box">Interpret the relationships you find as “moving together”. Drawing cause and effect from observational data requires a separate research design; make no such claim in this project.</div>`
    },
    playground: null,
    cells: [
      {
        id: "m0-u10-c1", kind: "colab",
        task: { tr: "Bitirme notebook'unu aç, sorunu seç ve analizi Gemini ile yap. Son hücre; verinin hazırlanışını, yorum paragrafını ve <code>denetim</code> sözlüğünü kontrol eder ve tamamlama kodunu verir.", en: "Open the capstone notebook, choose your question and do the analysis with Gemini. The final cell checks the data preparation, the interpretation paragraph and the <code>audit</code> dictionary, and gives your completion code." },
        notebook: { tr: "modul0/10_bitirme_projesi_tr.ipynb", en: "module0/10_capstone_project_en.ipynb" },
        steps: {
          tr: ["Kurulum hücresini çalıştır; sorunu <code>SORU = \"A\"</code>, <code>\"B\"</code> ya da <code>\"C\"</code> olarak seç.", "Veri, analiz ve grafik adımlarını Gemini ile yap; her adımdan sonra 5 doğrulama sorusunu sor.", "<code>yorum</code> değişkenine dört parçalı sonuç paragrafını yaz (Gemini'ye yazdırdıysan denetle).", "<code>denetim</code> sözlüğünün beş alanını doldur.", "Son kontrol hücresini çalıştır ve kodu buraya yapıştır."],
          en: ["Run the setup cell; choose your question with <code>QUESTION = \"A\"</code>, <code>\"B\"</code> or <code>\"C\"</code>.", "Do the data, analysis and chart steps with Gemini; after each step ask the 5 verification questions.", "Write the four-part result paragraph in the <code>interpretation</code> variable (audit it if Gemini wrote it).", "Fill in the five fields of the <code>audit</code> dictionary.", "Run the final check cell and paste the code here."]
        },
        codeHashes: ["79e44cb7"]
      },
      {
        id: "m0-u10-c2", kind: "auditlog",
        task: { tr: "Denetim defterini doldur. <b>Tümünü kopyala</b> ile ödevine ya da e-postana ekleyebilirsin.", en: "Fill in your audit log. Use <b>Copy all</b> to add it to your assignment or email." },
        fields: {
          tr: [
            { label: "Soru ve veri", help: "Hangi soruyu seçtin, hangi seriler ve dönem?", ph: "Örnek: A sorusu; CPIAUCNS ve UNRATE, 2000–2024, aylık…" },
            { label: "Gemini'ye verdiğin istekler", help: "En önemli bir iki isteği ve neden öyle yazdığını belirt.", ph: "Örnek: Birimi yüzde olarak belirttim çünkü…" },
            { label: "Yaptığın kontroller ve sonuçları", help: "Beş doğrulama sorusundan hangilerini, nasıl uyguladın?", ph: "Örnek: satır sayısı 300; eksik değer yok; enflasyon −2 ile 9 arasında…" },
            { label: "Bulduğun hatalar ve düzeltmeler", help: "Gemini'nin hatası, senin hatan ya da “hata bulmadım, çünkü…”", ph: "Örnek: Gemini UNRATE'i günlük sanıp yeniden örnekledi…" },
            { label: "Sonuç ve sınırları", help: "Dört parçalı paragrafın kısa hâli.", ph: "Örnek: 2000–2024'te iki seri arasındaki ilişki zayıf ve dönemden döneme değişiyor; bu bir nedensellik göstermez…" }
          ],
          en: [
            { label: "Question and data", help: "Which question, which series and period?", ph: "Example: question A; CPIAUCNS and UNRATE, 2000–2024, monthly…" },
            { label: "Prompts you gave Gemini", help: "Your one or two most important prompts and why you wrote them that way.", ph: "Example: I specified percent because…" },
            { label: "Checks you ran and their results", help: "Which of the five verification questions did you apply, and how?", ph: "Example: 300 rows; no missing values; inflation between −2 and 9…" },
            { label: "Mistakes found and fixes", help: "Gemini's mistakes, yours, or “none found, because…”", ph: "Example: Gemini treated UNRATE as daily and resampled it…" },
            { label: "Result and limits", help: "A short version of your four-part paragraph.", ph: "Example: over 2000–2024 the relationship is weak and shifts between periods; it does not show causality…" }
          ]
        },
        after: { tr: "Tebrikler, Modül 0'ı tamamladın. Artık YZ ile çalışırken sorumluluğu elinde tutan biri olarak makine öğrenmesi modüllerine hazırsın.", en: "Congratulations, you have completed Module 0. You are ready for the machine learning modules as someone who stays responsible when working with AI." }
      }
    ],
    quiz: [
      { q: { tr: "Bitirme projesinde başarının ana ölçütü nedir?", en: "What is the main criterion of success in the capstone?" }, options: { tr: ["Gemini'nin hiç hata yapmaması", "YZ'nin çıktısını nasıl denetlediğin ve belgelediğin", "Kodun uzunluğu"], en: ["Gemini making no mistakes", "How you audited and documented the AI's output", "The length of the code"] }, answer: 1, explain: { tr: "YZ'nin hatasını bulup düzeltmek, hata yapmayan bir YZ'den daha değerli bir öğrenme kanıtıdır.", en: "Finding and fixing an AI mistake is better evidence of learning than an AI that made none." } },
      { q: { tr: "İki seri arasında güçlü bir ilişki buldun. Raporda nasıl ifade edersin?", en: "You found a strong relationship between two series. How do you put it in the report?" }, options: { tr: ["“X, Y'ye neden olur.”", "“X ve Y bu dönemde birlikte hareket etti; bu nedensellik göstermez.”", "“X her zaman Y'yi belirler.”"], en: ["“X causes Y.”", "“X and Y moved together in this period; this does not show causality.”", "“X always determines Y.”"] }, answer: 1, explain: { tr: "Gözlemle yorum arasındaki sınırı korumak, YZ çağında iktisatçının temel sorumluluğudur.", en: "Keeping the line between observation and interpretation is the economist's core responsibility in the age of AI." } }
    ]
  });
})();
