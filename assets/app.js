/* ML Laboratuvarı / ML Lab — uygulama motoru
 * Ekonomi ve Finansta Makine Öğrenmesi dersi için kendi kendine çalışma ortamı.
 * © 2026 Mehmet Songur — PolyForm Strict 1.0.0 (LICENSE-CODE.md)
 */
(function () {
  "use strict";

  const PYODIDE_VERSION = "0.26.4";
  // Kendi sunucunuzdan barındırmak için sayfada window.LAB_PYODIDE_BASE tanımlanabilir.
  const PYODIDE_BASE = window.LAB_PYODIDE_BASE || ("https://cdn.jsdelivr.net/pyodide/v" + PYODIDE_VERSION + "/full/");
  const EXEC_TIMEOUT_MS = 15000;
  const INIT_TIMEOUT_MS = 90000;

  const LAB = (window.LAB = window.LAB || {});
  LAB.hooks = LAB.hooks || {};
  LAB.modules = LAB.modules || [];
  LAB.playgrounds = LAB.playgrounds || {};
  LAB.registerModule = function (m) { LAB.modules.push(m); };
  LAB.catalog = LAB.catalog || [];

  /* Modül içeriklerini ihtiyaç anında yükle / lazy-load module content */
  const ASSET_V = (() => { try { const m = /[?&]v=([^&]+)/.exec(document.currentScript.src); return m ? m[1] : ""; } catch (e) { return ""; } })();
  const loading = {};
  /* Üst ilerleme çubuğu / top progress bar */
  const Bar = {
    el: null,
    show(frac) {
      if (!this.el) { this.el = document.createElement("div"); this.el.id = "loadbar"; this.el.innerHTML = "<span></span>"; document.body.appendChild(this.el); }
      this.el.classList.add("on");
      this.el.firstChild.style.width = Math.max(4, Math.round(100 * frac)) + "%";
    },
    done() {
      if (!this.el) return;
      this.el.firstChild.style.width = "100%";
      setTimeout(() => this.el && this.el.classList.remove("on"), 250);
    }
  };
  function loadScript(src) {
    return new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = src + (ASSET_V ? "?v=" + ASSET_V : "");
      s.async = false;   // paralel indir, sırayla çalıştır / download in parallel, execute in order
      s.onload = res; s.onerror = () => rej(new Error("load failed: " + src));
      document.body.appendChild(s);
    });
  }
  function catalogEntryFor(id) {
    return LAB.catalog.find((c) => id === c.id || id.indexOf(c.id + "-") === 0) || null;
  }
  /* onProgress(yüklenen, toplam) — dosyalar paralel iner, kayıt sırası korunur */
  function loadModule(id, onProgress) {
    if (LAB.modules.some((m) => m.id === id)) return Promise.resolve();
    const c = LAB.catalog.find((x) => x.id === id);
    if (!c) return Promise.resolve();
    if (!loading[id]) {
      let n = 0;
      const subs = (loading[id + ":cb"] = []);
      const tick = () => { n++; subs.forEach((f) => f(n, c.files.length)); };
      loading[id] = Promise.all(c.files.map((f) => loadScript("content/" + id + "/" + f).then(tick)))
        .catch((e) => { delete loading[id]; delete loading[id + ":cb"]; throw e; });
    }
    if (onProgress && loading[id + ":cb"]) loading[id + ":cb"].push(onProgress);
    return loading[id];
  }
  LAB.loadModule = loadModule;

  /* ------------------------------------------------------------------ */
  /* Arayüz metinleri / UI strings                                       */
  /* ------------------------------------------------------------------ */
  const UI = {
    appName: { tr: "ML Laboratuvarı", en: "ML Lab" },
    course: { tr: "Ekonomi ve Finansta Makine Öğrenmesi", en: "Machine Learning in Economics and Finance" },
    tagline: {
      tr: "YZ'ye kod yazdırmayı, yazdığını denetlemeyi ve sonucu iktisatçı gözüyle yorumlamayı öğren. Kodlama geçmişi gerekmez; ekonomi ve finansla ilgilenen herkes için.",
      en: "Learn to have AI write code, audit what it wrote and interpret the result as an economist. No coding background needed; for anyone interested in economics and finance."
    },
    noInstall: {
      tr: "Kurulum ya da hesap gerekmez. Python doğrudan tarayıcında çalışır.",
      en: "No installation or account needed. Python runs directly in your browser."
    },
    how: { tr: "Her ünite dört adımdan oluşur", en: "Every unit has four steps" },
    structEyebrow: { tr: "Ünite yapısı", en: "Unit structure" },
    stages: {
      tr: ["Kavram", "Oyun alanı", "Atölye", "Kendini sına"],
      en: ["Idea", "Playground", "Workshop", "Check yourself"]
    },
    stageDesc: {
      tr: [
        "Kısa bir açıklama ve bir iktisat örneği.",
        "Kod yazmadan kaydırıcılarla dene, sonucu anında gör.",
        "YZ'nin yazdığı kodu denetle, hatasını bul ve düzelt, kontrol yaz. Kod tarayıcında gerçek Python ile çalışır.",
        "Birkaç soruyla öğrendiğini yokla."
      ],
      en: [
        "A short explanation with an economics example.",
        "Try it with sliders, no code, and see the result at once.",
        "Audit the AI's code, find and fix its mistakes, write checks. The code runs as real Python in your browser.",
        "A few questions to test what you learned."
      ]
    },
    modules: { tr: "Modüller", en: "Modules" },
    roadmap: { tr: "Dersin haftalarıyla eşleşen modüller", en: "Modules that follow the course weeks" },
    soon: { tr: "Yakında", en: "Coming soon" },
    start: { tr: "Başla", en: "Start" },
    continue: { tr: "Devam et", en: "Continue" },
    review: { tr: "Gözden geçir", en: "Review" },
    lessons: { tr: "ders", en: "lessons" },
    minutes: { tr: "dk", en: "min" },
    week: { tr: "Hafta", en: "Week" },
    module: { tr: "Modül", en: "Module" },
    home: { tr: "Ana sayfa", en: "Home" },
    lessonOf: { tr: "Ders", en: "Lesson" },
    completed: { tr: "Tamamlandı", en: "Completed" },
    prev: { tr: "Önceki ders", en: "Previous lesson" },
    next: { tr: "Sonraki ders", en: "Next lesson" },
    backModule: { tr: "Modül sayfasına dön", en: "Back to module" },
    lessonDone: { tr: "Bu dersi tamamladın.", en: "You completed this lesson." },
    lessonTodo: {
      tr: "Dersi tamamlamak için tüm kod hücrelerini başarıyla çalıştır ve soruları doğru yanıtla.",
      en: "To complete the lesson, run every code cell successfully and answer the questions correctly."
    },
    pyIdle: { tr: "Python derste başlar", en: "Python starts in a lesson" },
    pyLoading: { tr: "Python yükleniyor… İlk açılışta 10–20 sn sürebilir.", en: "Loading Python… The first time can take 10–20 s." },
    pyPkgs: { tr: "Kütüphaneler yükleniyor…", en: "Loading libraries…" },
    pyReady: { tr: "Python hazır", en: "Python ready" },
    pyBusy: { tr: "Çalışıyor…", en: "Running…" },
    pyError: { tr: "Python bu sayfada başlatılamadı. Sayfayı yenile; sorun sürerse aşağıdaki ayrıntıyı ilet.", en: "Python could not start on this page. Reload; if it persists, report the detail below." },
    run: { tr: "Çalıştır", en: "Run" },
    runAll: { tr: "Tüm hücreleri çalıştır", en: "Run all cells" },
    restart: { tr: "Python'u yeniden başlat", en: "Restart Python" },
    hint: { tr: "İpucu", en: "Hint" },
    nextHint: { tr: "Sonraki ipucu", en: "Next hint" },
    solution: { tr: "Çözümü göster", en: "Show solution" },
    reset: { tr: "Kodu sıfırla", en: "Reset code" },
    kbd: { tr: "Shift+Enter ile de çalışır", en: "Shift+Enter also runs" },
    kind: {
      run: { tr: "Çalıştır ve gözle", en: "Run and observe" },
      edit: { tr: "Değiştir", en: "Modify" },
      fill: { tr: "Boşluğu doldur", en: "Fill the blank" },
      debug: { tr: "Hatayı bul", en: "Find the bug" },
      challenge: { tr: "Meydan okuma", en: "Challenge" },
      audit: { tr: "YZ kodunu denetle", en: "Audit the AI's code" },
      check: { tr: "Kontrol yaz", en: "Write a check" },
      compare: { tr: "İki yanıtı karşılaştır", en: "Compare two answers" },
      prompt: { tr: "İsteği güçlendir", en: "Strengthen the prompt" },
      interpret: { tr: "Yorumu denetle", en: "Audit the interpretation" },
      colab: { tr: "Colab + Gemini görevi", en: "Colab + Gemini task" },
      auditlog: { tr: "Denetim defteri", en: "Audit log" }
    },
    aiLabel: { tr: "Örnek YZ yanıtı · öğretim için hazırlandı", en: "Sample AI answer · prepared for teaching" },
    you: { tr: "Sen", en: "You" },
    aiName: { tr: "YZ asistan", en: "AI assistant" },
    aiClaim: { tr: "YZ'nin açıklaması", en: "The AI's explanation" },
    markLine: { tr: "Hatalı satır(lar)a tıkla, sonra “İşaretlemeyi kontrol et”e bas.", en: "Click the faulty line(s), then press “Check my marking”." },
    checkMark: { tr: "İşaretlemeyi kontrol et", en: "Check my marking" },
    lineRight: { tr: "Doğru satırı buldun.", en: "You found the right line." },
    lineWrong: { tr: "Bu işaretleme tam doğru değil. Kodu satır satır okuyup her satırın ne ürettiğini düşün.", en: "That marking is not quite right. Read the code line by line and ask what each line produces." },
    lineFirst: { tr: "Düzeltilmiş kod çalışıyor. Son adım: yukarıdaki YZ kodunda hatalı satırı işaretle.", en: "Your fixed code works. Last step: mark the faulty line in the AI's code above." },
    fixBelow: { tr: "Şimdi aşağıdaki editörde kodu düzelt ve çalıştır.", en: "Now fix the code in the editor below and run it." },
    pickBetter: { tr: "Hangi yanıt doğru?", en: "Which answer is correct?" },
    pickReason: { tr: "Neden?", en: "Why?" },
    answerA: { tr: "Yanıt A", en: "Answer A" },
    answerB: { tr: "Yanıt B", en: "Answer B" },
    compareWrong: { tr: "Tekrar bak: iki kodu satır satır karşılaştır.", en: "Look again: compare the two pieces of code line by line." },
    reasonWrong: { tr: "Doğru yanıtı seçtin ama gerekçe bu değil.", en: "Right answer, but that is not the reason." },
    weakPrompt: { tr: "Zayıf istek", en: "Weak prompt" },
    weakResult: { tr: "Bu isteğin ürettiği kod", en: "Code produced by this prompt" },
    yourPrompt: { tr: "Senin isteğin", en: "Your prompt" },
    promptPh: { tr: "YZ'ye vereceğin isteği buraya yaz…", en: "Write the prompt you would give the AI here…" },
    checklist: { tr: "İyi bir istekte olması gerekenler", en: "What a good prompt includes" },
    detected: { tr: "metinde bulundu", en: "found in your text" },
    selfTick: { tr: "eklediğimi düşünüyorum", en: "I think I included it" },
    promptMin: { tr: "İsteğin biraz kısa. Ayrıntı ekle.", en: "Your prompt is a bit short. Add detail." },
    promptMissing: { tr: "Kontrol listesinde eksik madde var.", en: "Some checklist items are still missing." },
    promptDone: { tr: "İsteğin kontrol listesini karşılıyor. Örnek güçlü istekle karşılaştır.", en: "Your prompt meets the checklist. Compare it with the sample strong prompt." },
    promptSelf: { tr: "Otomatik algılama yalnızca ipucudur; asıl değerlendirme senin. Gerekirse kutuyu kendin işaretle.", en: "Automatic detection is only a hint; the judgment is yours. Tick a box yourself if needed." },
    strongPrompt: { tr: "Örnek güçlü istek", en: "Sample strong prompt" },
    strongResult: { tr: "Güçlü isteğin ürettiği kod", en: "Code produced by the strong prompt" },
    copyPrompt: { tr: "İsteği kopyala", en: "Copy prompt" },
    checkPrompt: { tr: "İsteğimi değerlendir", en: "Evaluate my prompt" },
    markSentences: { tr: "Abartılı ya da desteklenmeyen cümlelere tıkla, sonra kontrol et.", en: "Click the overstated or unsupported sentences, then check." },
    sentWrong: { tr: "Henüz değil: bazı cümleleri eksik ya da fazla işaretledin.", en: "Not yet: you have missed or over-marked some sentences." },
    sentRight: { tr: "Doğru. Her cümlenin değerlendirmesi:", en: "Correct. Here is the verdict on each sentence:" },
    openColab: { tr: "Colab'da aç", en: "Open in Colab" },
    colabSteps: { tr: "Adımlar", en: "Steps" },
    codeLabel: { tr: "Tamamlama kodu", en: "Completion code" },
    codePh: { tr: "Notebook'un verdiği kodu yapıştır", en: "Paste the code the notebook gives you" },
    verify: { tr: "Doğrula", en: "Verify" },
    codeOk: { tr: "Kod doğru. Görev tamamlandı.", en: "Code accepted. Task complete." },
    codeBad: { tr: "Kod tanınmadı. Notebook'taki kontrol hücresinin “tüm kontroller geçti” dediğinden emin ol.", en: "Code not recognised. Make sure the notebook's check cell says “all checks passed”." },
    colabNote: { tr: "Tamamlama kodu bir öz değerlendirme aracıdır; notlandırma için tasarlanmadı.", en: "The completion code is a self-assessment tool, not designed for grading." },
    logSave: { tr: "Kaydet", en: "Save" },
    logSaved: { tr: "Defterin kaydedildi (yalnızca bu tarayıcıda).", en: "Your log is saved (in this browser only)." },
    logShort: { tr: "Her alana en az bir iki cümle yaz.", en: "Write at least a sentence or two in each field." },
    copyAll: { tr: "Tümünü kopyala", en: "Copy all" },
    predictFirst: { tr: "Önce tahmin et: çalıştırmadan önce bir seçenek seç.", en: "Predict first: pick an option before you run." },
    yourGuess: { tr: "Tahminin", en: "Your guess" },
    guessRight: { tr: "Tahminin doğruydu.", en: "Your guess was right." },
    guessWrong: { tr: "Tahminin tutmadı, sorun değil. Neden böyle olduğuna bak:", en: "Your guess was off, no problem. Here is why:" },
    blanksLeft: { tr: "Kodda hâlâ ___ var. Boşlukları doldurup yeniden çalıştır.", en: "The code still contains ___. Fill in the blanks and run again." },
    pass: { tr: "Doğru! Bu adımı tamamladın.", en: "Correct! You finished this step." },
    passRun: { tr: "Kod çalıştı. Çıktıyı inceleyip bir sonraki hücreye geç.", en: "The code ran. Look at the output, then move on." },
    notYet: { tr: "Henüz değil:", en: "Not yet:" },
    errorTitle: { tr: "Python bir hata verdi", en: "Python reported an error" },
    errorLine: { tr: "Satır", en: "Line" },
    rawError: { tr: "Python'un özgün mesajı", en: "Python's original message" },
    timeout: {
      tr: "Kod 15 saniyede bitmedi (sonsuz döngü olabilir). Python yeniden başlatıldı; hücreleri tekrar çalıştırman gerekiyor.",
      en: "The code did not finish in 15 seconds (maybe an endless loop). Python was restarted; run the cells again."
    },
    autoPrev: { tr: "Önceki hücreler de otomatik çalıştırıldı.", en: "Earlier cells were run automatically too." },
    noOutput: { tr: "(çıktı yok)", en: "(no output)" },
    quizRight: { tr: "Doğru.", en: "Correct." },
    quizWrong: { tr: "Yanlış, tekrar dene.", en: "Not quite, try again." },
    progress: { tr: "İlerleme", en: "Progress" },
    courseShort: { tr: "Ekonomi ve Finansta ML", en: "ML in Economics & Finance" },
    navLabel: { tr: "Ana gezinme", en: "Main navigation" },
    learningPath: { tr: "Öğrenme yolu", en: "Learning path" },
    openMenu: { tr: "Menüyü aç", en: "Open menu" },
    pyLoadingShort: { tr: "Python yükleniyor…", en: "Loading Python…" },
    pyErrorShort: { tr: "Python başlatılamadı", en: "Python failed to start" },
    heroModule: { tr: "Modül 0", en: "Module 0" },
    labEyebrow: { tr: "Ücretsiz öz çalışma ortamı · Türkçe / English", en: "Free self-study lab · English / Türkçe" },
    labH1: { tr: ["Ekonomi ve finansta ", "makine öğrenmesi", " laboratuvarı"], en: ["A ", "machine learning", " lab for economics and finance"] },
    labLead: { tr: "Dersin konularını izleyen modüllerle makine öğrenmesinin temellerini ekonomi ve finans örnekleri üzerinde çalış. Kodu yapay zekâya yazdırmayı ve yazdığını denetlemeyi de öğrenirsin. Kurulum gerekmez: alıştırmalar tarayıcıda, gerçek veriyle atölyeler Google Colab'da çalışır.", en: "Work through the foundations of machine learning with examples from economics and finance, in modules that follow the course. You also learn to have AI write code and to audit what it writes. No installation: exercises run in the browser, and real-data workshops run in Google Colab." },
    labModulesBtn: { tr: "Modülleri incele", en: "Browse the modules" },
    unitPanelTitle: { tr: "Her ünitede", en: "In every unit" },
    unitSteps: { tr: [["Kavram", "Kısa bir anlatım ve ekonomiden bir örnek."], ["Oyun alanı", "Kod yazmadan, kaydırıcılar ve tıklamalarla dene."], ["Atölye", "YZ'nin yazdığı kodu oku, hatasını bul ve düzelt. Tarayıcıda çalışan gerçek Python."], ["Kendini sına", "Kısa bir testle anladığını kontrol et."]], en: [["Concept", "A short explanation and an example from economics."], ["Playground", "Try it without code, with sliders and clicks."], ["Workshop", "Read the AI's code, find its mistake and fix it. Real Python in your browser."], ["Check yourself", "A short quiz to check your understanding."]] },
    unitPanelNote: { tr: "Her modül, gerçek veriyle bir Colab + Gemini atölyesiyle biter.", en: "Every module ends with a Colab + Gemini workshop on real data." },
    heroModsLbl: { tr: "modül", en: "modules" },
    heroHrShort: { tr: "saat", en: "h" },
    modulesEyebrow: { tr: "Müfredat", en: "Curriculum" },
    modulesTitle: { tr: "Modüller", en: "Modules" },
    openModule: { tr: "Modülü aç", en: "Open module" },
    heroBadge: { tr: "Modül 0 · Ücretsiz", en: "Module 0 · Free" },
    heroH1a: { tr: "Yapay zekâ ile ekonomik veri analizine giriş", en: "An introduction to economic data analysis with AI" },
    heroH1b: { tr: "İste, oku, kontrol et, yorumla.", en: "Ask, read, check, interpret." },
    heroLead: { tr: "Yapay zekâdan analiz kodu istemeyi, üretilen Python kodunu okuyup kontrol etmeyi ve sonuçları dikkatli biçimde raporlamayı adım adım çalış. Ön bilgi gerekmez; alıştırmalar tarayıcıda çalışır.", en: "Practise, step by step, asking AI for analysis code, reading and checking the Python it produces, and reporting the results with care. No prior knowledge needed; exercises run in the browser." },
    heroStart: { tr: "Öğrenmeye başla", en: "Start learning" },
    heroContinue: { tr: "Kaldığın yerden devam et", en: "Continue where you left off" },
    heroCurriculum: { tr: "Müfredatı incele", en: "Explore the curriculum" },
    heroChips: { tr: ["Kurulum gerektirmez", "Colab + Gemini atölyeleri", "Türkçe · English"], en: ["No installation", "Colab + Gemini workshops", "Türkçe · English"] },
    heroUnitsLbl: { tr: "ünite", en: "units" },
    heroExLbl: { tr: "uygulamalı alıştırma", en: "hands-on exercises" },
    heroHrLbl: { tr: "saatlik içerik", en: "hours of content" },
    demoTitle: { tr: "Denetim örneği · yıllık enflasyon", en: "Audit example · annual inflation" },
    demoAsk: { tr: "TÜFE serisinden yıllık enflasyonu hesapla.", en: "Compute annual inflation from the CPI series." },
    demoFlag: { tr: "Aylık değişim hesaplanmış. Yıllık oran için 12 dönem geriye bakılmalı.", en: "This is the monthly change. Annual inflation needs a 12-period lag." },
    demoFix: { tr: "Düzeltildi ve kontrol edildi", en: "Fixed and verified" },
    demoStages: { tr: ["Tarif", "Üret", "Denetle", "Yorumla"], en: ["Specify", "Generate", "Audit", "Interpret"] },
    heroTitle: { tr: "YZ kodu yazsın. Doğru olup olmadığına sen karar ver.", en: "Let AI write the code. You decide whether it is right." },
    heroPass: { tr: "Hatalı satırı buldun: aylık oranlar toplanmaz, çarpılır.", en: "You found the faulty line: monthly rates compound, they do not add up." },
    heroFacts: { tr: ["Kurulum ve hesap gerekmez", "Tarayıcıda Python + Colab ve Gemini atölyeleri", "Türkçe ve İngilizce"], en: ["No installation or account", "Python in the browser + Colab and Gemini workshops", "Turkish and English"] },
    loopEyebrow: { tr: "Yöntem", en: "Method" },
    loopTitle: { tr: "Kodlamayı değil, YZ ile analiz yapmayı öğren", en: "Learn to analyse with AI, not just to code" },
    loop: {
      tr: [["Tarif et", "Ekonomik soruyu YZ'nin anlayacağı bir spesifikasyona çevir: veri, birim, yöntem, çıktı, kontrol."], ["Ürettir", "Kodu YZ yazar: tarayıcıdaki örneklerde ya da Colab'da Gemini ile."], ["Denetle", "Kodu oku, sessiz hataları yakala, kontrol yaz, düzeltmeyi sına."], ["Yorumla", "Sonucu iktisatçı gözüyle yorumla; YZ'nin abartılarını ayıkla, sınırları yaz."]],
      en: [["Specify", "Turn the economic question into a specification the AI understands: data, units, method, output, checks."], ["Generate", "The AI writes the code: in the browser examples or with Gemini in Colab."], ["Audit", "Read the code, catch silent mistakes, write checks, test the fix."], ["Interpret", "Interpret the result as an economist; filter the AI's overstatements and state the limits."]]
    },
    statUnits: { tr: "ünite", en: "units" },
    statColab: { tr: "Colab + Gemini görevi", en: "Colab + Gemini tasks" },
    unit: { tr: "Ünite", en: "Unit" },
    appendix: { tr: "Ek", en: "Appendix" },
    seePath: { tr: "Öğrenme yolunu gör", en: "View the learning path" },
    statLessons: { tr: "ders", en: "lessons" },
    statExercises: { tr: "alıştırma", en: "exercises" },
    statHours: { tr: "saat içerik", en: "hours of content" },
    statInstall: { tr: "kurulum", en: "installs" },
    methodEyebrow: { tr: "Yöntem", en: "Method" },
    exercisesShort: { tr: "alıştırma", en: "exercises" },
    locked: { tr: "Kilitli", en: "Locked" },
    optDone: { tr: "{d} / {n} tamamlandı (modül yüzdesine katılmaz)", en: "{d} / {n} done (not counted in the module percentage)" },
    runAllProg: { tr: "Çalışıyor: {k} / {n}", en: "Running: {k} / {n}" },
    lockTitle: { tr: "Bu modül henüz kilitli", en: "This module is still locked" },
    lockText: { tr: "Modül {pGen} zorunlu ünitelerini tamamlayınca açılacak.", en: "It opens once you complete the required units of Module {p}." },
    lockChain: { tr: "Önce Modül {pGen} kilidini açman gerekiyor.", en: "First you need to unlock Module {p}." },
    lockProgress: { tr: "{d} / {n} zorunlu ünite tamamlandı", en: "{d} / {n} required units completed" },
    lockMissing: { tr: "Kalan üniteler:", en: "Units left:" },
    lockUnit: { tr: "Ünite", en: "Unit" },
    lockGo: { tr: "Modül {pDat} devam et", en: "Continue Module {p}" },
    lockNote: { tr: "Colab + Gemini atölyeleri kilidi etkilemez; onları istediğin zaman yapabilirsin.", en: "The Colab + Gemini workshops do not affect the lock; you can do them any time." },
    lockCard: { tr: "Modül {pAcc} bitirince açılır", en: "Opens after Module {p}" },
    lockComing: { tr: "Bu modülde neler var", en: "What this module covers" },
    license: { tr: "Kaynağı açık · ticari olmayan kullanım", en: "Source available · noncommercial use" },
    stepsLabel: { tr: "Ders adımları", en: "Lesson steps" },
    read: { tr: "oku", en: "read" },
    tryIt: { tr: "dene", en: "try it" },
    step: { tr: "Adım", en: "Step" },
    nextStep: { tr: "Sonraki adım", en: "Next step" },
    keyIdea: { tr: "Ana fikir:", en: "Key idea:" },
    exercisesDone: { tr: "{n} / {m} alıştırma tamamlandı", en: "{n} / {m} exercises completed" },
    exercise: { tr: "Alıştırma", en: "Exercise" },
    lessonPct: { tr: "Ders ilerlemesi: %{p}", en: "Lesson progress: {p}%" },
    lessonDoneSub: { tr: "Tüm alıştırmalar ve sorular tamam. Sonraki derse geçebilirsin.", en: "All exercises and questions are done. You can move on to the next lesson." },
    output: { tr: "Çıktı", en: "Output" },
    dataFailed: { tr: "Veri dosyası yüklenemedi. Bağlantını kontrol edip yeniden dene.", en: "The data file could not be loaded. Check your connection and try again." },
    loadingModule: { tr: "Modül yükleniyor…", en: "Loading module…" },
    loadFailed: { tr: "Modül yüklenemedi. Bağlantını kontrol edip yeniden dene.", en: "The module could not be loaded. Check your connection and try again." },
    retry: { tr: "Yeniden dene", en: "Try again" },
    themeDark: { tr: "Karanlık moda geç", en: "Switch to dark mode" },
    themeLight: { tr: "Aydınlık moda geç", en: "Switch to light mode" },
    practiceToggle: { tr: "Ek: Python pratiği", en: "Appendix: Python practice" },
    authorName: "Prof. Dr. Mehmet Songur",
    authorRole: "songurmehmet.com",
    authorAreas: { tr: "İktisat · Makroiktisat · Ekonometri · Uygulamalı Yapay Zekâ", en: "Economics · Macroeconomics · Econometrics · Applied AI" },
    createdBy: { tr: "Hazırlayan", en: "Created by" },
    byline: { tr: "Prof. Dr. Mehmet Songur tarafından hazırlandı", en: "Created by Prof. Dr. Mehmet Songur" },
    aboutEyebrow: { tr: "Hazırlayan", en: "Author" },
    aboutTitle: { tr: "Bu laboratuvar hakkında", en: "About this lab" },
    aboutText: {
      tr: "ML Laboratuvarı, verdiğim “Ekonomi ve Finansta Makine Öğrenmesi” dersi için geliştirildi, ama herkese açıktır. Amacı, kodlama geçmişi olmayan herkesin (öğrenciler, araştırmacılar, kamu ve özel sektörde ekonomi ve finansla çalışanlar) Python'u ve makine öğrenmesinin temellerini gerçek hayattan ekonomi örnekleriyle, kendi hızında öğrenebilmesidir. Kaynak kodu ve içerik GitHub'da görülebilir; ticari olmayan amaçlarla kullanılabilir.",
      en: "ML Lab was developed for my course “Machine Learning in Economics and Finance”, but it is open to everyone. Its aim is to let anyone without a coding background (students, researchers, and people working with economics and finance in the public or private sector) learn Python and the foundations of machine learning through real-world economic examples, at their own pace. The source code and content are visible on GitHub and may be used for noncommercial purposes."
    },
    personalSite: { tr: "Kişisel web sitesi", en: "Personal website" },
    courseRepo: { tr: "Ders materyalleri (GitHub)", en: "Course materials (GitHub)" },
    citeTitle: { tr: "Atıf", en: "How to cite" },
    citeText: {
      tr: "Songur, M. (2026). ML Laboratuvarı: Ekonomi ve finansta makine öğrenmesi için etkileşimli öğrenme ortamı [Yazılım]. https://www.songurmehmet.com",
      en: "Songur, M. (2026). ML Lab: An interactive learning environment for machine learning in economics and finance [Software]. https://www.songurmehmet.com"
    },
    copy: { tr: "Kopyala", en: "Copy" },
    copied: { tr: "Kopyalandı", en: "Copied" },
    rights: { tr: "© 2026 Prof. Dr. Mehmet Songur. Kod: PolyForm Strict 1.0.0 · İçerik: CC BY-NC-SA 4.0. Ticari kullanım izne tabidir.", en: "© 2026 Prof. Dr. Mehmet Songur. Code: PolyForm Strict 1.0.0 · Content: CC BY-NC-SA 4.0. Commercial use requires permission." },
    lessonProgress: { tr: "Ders ilerlemesi", en: "Lesson progress" },
    lessonsDone: { tr: "ünite tamamlandı", en: "units completed" },
    resetProgress: { tr: "İlerlemeyi sıfırla", en: "Reset progress" },
    resetAsk: { tr: "Tüm ilerleme ve kaydedilmiş kodlar silinsin mi?", en: "Delete all progress and saved code?" },
    yes: { tr: "Evet, sil", en: "Yes, delete" },
    no: { tr: "Vazgeç", en: "Cancel" },
    savedLocal: {
      tr: "İlerlemen yalnızca bu tarayıcıda saklanır.",
      en: "Your progress is stored only in this browser."
    },
    footer: {
      tr: "Prof. Dr. Mehmet Songur",
      en: "Prof. Dr. Mehmet Songur"
    },
    coursePage: { tr: "Ders sayfası", en: "Course page" },
    playgroundTouched: { tr: "denendi", en: "tried" },
    cellsDone: { tr: "hücre", en: "cells" },
    qDone: { tr: "soru", en: "questions" },
    terms: { tr: "Terimler", en: "Terms" }
  };

  const ERR_HELP = {
    NameError: {
      tr: "Python bu ismi tanımıyor. Değişkenin adını doğru yazdığından (büyük/küçük harf dahil) ve onu tanımlayan satırın daha önce çalıştığından emin ol. Metin yazıyorsan tırnak işaretlerini unutma.",
      en: "Python does not know this name. Check the spelling (case matters) and that the line defining it has already run. If you meant text, add quotation marks."
    },
    SyntaxError: {
      tr: "Yazım (sözdizimi) hatası: Python satırı okuyamadı. Eksik parantez, tırnak ya da iki nokta (:) olup olmadığına bak.",
      en: "Syntax error: Python could not read the line. Look for a missing bracket, quote or colon (:)."
    },
    IndentationError: {
      tr: "Girinti hatası: for, if, def satırlarının altındaki kod 4 boşluk içeride olmalı ve aynı bloktaki satırlar aynı hizada durmalı.",
      en: "Indentation error: code under for, if and def must be indented by 4 spaces, and lines in the same block must line up."
    },
    TabError: {
      tr: "Sekme ve boşluk karışmış. Girintileri yalnızca boşlukla yap.",
      en: "Tabs and spaces are mixed. Indent with spaces only."
    },
    TypeError: {
      tr: "Tür hatası: uyumsuz türleri birlikte kullandın (örneğin metinle sayıyı toplamak) ya da bir fonksiyona yanlış sayıda girdi verdin.",
      en: "Type error: you combined types that do not fit (e.g. adding text and a number) or gave a function the wrong number of inputs."
    },
    ZeroDivisionError: { tr: "Sıfıra bölme yapılamaz. Paydayı kontrol et.", en: "You cannot divide by zero. Check the denominator." },
    IndexError: {
      tr: "Sıra (indeks) hatası: listenin uzunluğunun dışında bir konuma eriştin. İndeksler 0'dan başlar.",
      en: "Index error: you asked for a position outside the list. Indexes start at 0."
    },
    KeyError: {
      tr: "Anahtar hatası: tabloda bu isimde bir sütun yok. Sütun adını tırnak içinde ve tam olarak yazdığından emin ol.",
      en: "Key error: there is no column with this name. Write the column name in quotes, exactly as it appears."
    },
    AttributeError: {
      tr: "Bu nesnenin böyle bir özelliği ya da metodu yok. Noktadan sonra yazdığın ismi kontrol et.",
      en: "This object has no such attribute or method. Check the name after the dot."
    },
    ValueError: { tr: "Değer hatası: fonksiyon bu değeri kabul etmiyor.", en: "Value error: the function does not accept this value." },
    ModuleNotFoundError: { tr: "Bu kütüphane bulunamadı. İsmini doğru yazdın mı?", en: "This library was not found. Is the name spelled correctly?" }
  };

  /* ------------------------------------------------------------------ */
  /* Durum ve kalıcılık / State and storage                              */
  /* ------------------------------------------------------------------ */
  const STORE_KEY = "mllab.v1";
  function loadStore() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* storage unavailable */ }
    return {};
  }
  const store = Object.assign({ lang: null, theme: null, cells: {}, quiz: {}, pg: {}, done: {}, code: {} }, loadStore());
  function applyTheme() {
    if (store.theme === "light" || store.theme === "dark") document.documentElement.setAttribute("data-theme", store.theme);
    else document.documentElement.removeAttribute("data-theme");
  }
  function isDark() {
    if (store.theme) return store.theme === "dark";
    try { return window.matchMedia("(prefers-color-scheme: dark)").matches; } catch (e) { return false; }
  }
  applyTheme();
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) { /* ignore */ }
    if (LAB.hooks.afterSave) { try { LAB.hooks.afterSave(); } catch (e) { /* ignore */ } }
  }
  /* Dış modüller için (ör. hesap senkronu) / for external modules (e.g. account sync) */
  LAB.hooks = LAB.hooks || {};
  LAB.store = store;
  LAB.save = save;

  let lang = store.lang || ((navigator.language || "tr").toLowerCase().startsWith("tr") ? "tr" : "en");
  try {
    const qp = new URLSearchParams(location.search).get("lang");
    if (qp === "tr" || qp === "en") lang = qp;
  } catch (e) { /* ignore */ }

  function t(x) {
    if (x == null) return "";
    if (typeof x === "string" || typeof x === "number") return x;
    if (Array.isArray(x)) return x;
    return x[lang] != null ? x[lang] : (x.tr != null ? x.tr : "");
  }
  LAB.t = t;
  LAB.getLang = () => lang;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  LAB.esc = esc;

  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        const v = attrs[k];
        if (v == null || v === false) continue;
        if (k === "class") el.className = v;
        else if (k === "html") el.innerHTML = v;
        else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? "" : v);
      }
    }
    for (const kid of kids.flat(Infinity)) {
      if (kid == null || kid === false) continue;
      el.appendChild(typeof kid === "string" || typeof kid === "number" ? document.createTextNode(String(kid)) : kid);
    }
    return el;
  }
  LAB.h = h;

  /* ------------------------------------------------------------------ */
  /* Python çalışma zamanı (Web Worker içinde Pyodide)                   */
  /* ------------------------------------------------------------------ */
  const PY_RUNNER = String.raw`
import ast, sys, io, json, base64, os, warnings
os.environ["MPLBACKEND"] = "AGG"
warnings.filterwarnings("ignore")
_LAB_NS = {}

def _lab_raises(f):
    try:
        f()
    except BaseException:
        return True
    return False

def _lab_reset(name):
    _LAB_NS[name] = {"__name__": "__main__", "_raises": _lab_raises}

def _lab_is_mpl(v):
    try:
        if type(v).__module__.startswith("matplotlib"):
            return True
        if isinstance(v, (list, tuple)) and v and type(v[0]).__module__.startswith("matplotlib"):
            return True
    except Exception:
        pass
    return False

def _lab_display(v):
    if _lab_is_mpl(v):
        return None
    pd = sys.modules.get("pandas")
    try:
        if pd is not None:
            if isinstance(v, pd.DataFrame):
                return {"kind": "html", "data": v.to_html(max_rows=15, max_cols=12, border=0, classes="df")}
            if isinstance(v, pd.Series):
                return {"kind": "html", "data": v.to_frame().to_html(max_rows=15, border=0, classes="df")}
    except Exception:
        pass
    r = repr(v)
    if len(r) > 6000:
        r = r[:6000] + " ..."
    return {"kind": "text", "data": r}

def _lab_figs():
    figs, meta = [], []
    plt = sys.modules.get("matplotlib.pyplot")
    if plt is None:
        return figs, meta
    for num in plt.get_fignums():
        fig = plt.figure(num)
        buf = io.BytesIO()
        fig.savefig(buf, format="png", dpi=110, bbox_inches="tight")
        figs.append(base64.b64encode(buf.getvalue()).decode())
        for ax in fig.axes:
            meta.append({"title": ax.get_title(), "xlabel": ax.get_xlabel(), "ylabel": ax.get_ylabel(),
                         "lines": len(ax.get_lines()), "collections": len(ax.collections),
                         "patches": len(ax.patches), "legend": ax.get_legend() is not None})
    plt.close("all")
    return figs, meta

def _lab_err(e, code):
    line = None
    if isinstance(e, SyntaxError) and e.filename == "<cell>":
        line = e.lineno
    else:
        tb = e.__traceback__
        while tb is not None:
            if tb.tb_frame.f_code.co_filename == "<cell>":
                line = tb.tb_lineno
            tb = tb.tb_next
    lines = code.split("\n")
    src = lines[line - 1] if line and 1 <= line <= len(lines) else ""
    msg = e.msg if isinstance(e, SyntaxError) else str(e)
    return {"type": type(e).__name__, "msg": msg, "line": line, "src": src}

def _lab_run(code, name, checks_json):
    if name not in _LAB_NS:
        _lab_reset(name)
    ns = _LAB_NS[name]
    out = io.StringIO()
    res = {"stdout": "", "value": None, "error": None, "figs": [], "checks": []}
    old = (sys.stdout, sys.stderr)
    sys.stdout = sys.stderr = out
    try:
        tree = ast.parse(code, "<cell>", "exec")
        last = None
        if tree.body and isinstance(tree.body[-1], ast.Expr):
            last = ast.Expression(tree.body.pop().value)
        exec(compile(tree, "<cell>", "exec"), ns)
        if last is not None:
            v = eval(compile(last, "<cell>", "eval"), ns)
            if v is not None:
                res["value"] = _lab_display(v)
    except BaseException as e:
        res["error"] = _lab_err(e, code)
    finally:
        sys.stdout, sys.stderr = old
    res["stdout"] = out.getvalue()
    meta = []
    try:
        res["figs"], meta = _lab_figs()
    except Exception:
        pass
    ns["_out"] = res["stdout"]
    ns["_code"] = code   # denetimler kaynağa da bakabilsin / checks may inspect the source
    ns["_figs"] = meta
    if res["error"] is None:
        for expr in json.loads(checks_json):
            try:
                ok = bool(eval(expr, ns))
            except Exception:
                ok = False
            res["checks"].append(ok)
    return json.dumps(res)
`;

  const WORKER_SRC =
    "const RUNNER = " + JSON.stringify(PY_RUNNER) + ";\n" +
    `let pyodide = null;
self.addEventListener("securitypolicyviolation", (ev) => self.postMessage({ type: "csp", msg: ev.violatedDirective + " → " + ev.blockedURI }));
self.addEventListener("error", (ev) => self.postMessage({ type: "fatal", msg: "worker error: " + (ev.message || ev) }));
self.addEventListener("unhandledrejection", (ev) => self.postMessage({ type: "fatal", msg: "worker rejection: " + (ev.reason && ev.reason.message || ev.reason) }));
self.onmessage = async (e) => {
  const m = e.data;
  try {
    if (m.type === "init") {
      self.postMessage({ type: "stage", stage: "script" });
      importScripts(m.base + "pyodide.js");
      self.postMessage({ type: "stage", stage: "wasm" });
      pyodide = await loadPyodide({ indexURL: m.base });
      self.postMessage({ type: "stage", stage: "runner" });
      pyodide.runPython(RUNNER);
      self.postMessage({ type: "ready" });
    } else if (m.type === "preload") {
      self.postMessage({ type: "pkg", on: true });
      await pyodide.loadPackage(m.pkgs);
      self.postMessage({ type: "pkg", on: false });
      self.postMessage({ type: "done", id: m.id });
    } else if (m.type === "run") {
      const needs = pyodide.loadPackagesFromImports ? true : false;
      if (needs) {
        self.postMessage({ type: "pkg", on: true });
        await pyodide.loadPackagesFromImports(m.code);
        self.postMessage({ type: "pkg", on: false });
      }
      self.postMessage({ type: "exec", id: m.id });
      const fn = pyodide.globals.get("_lab_run");
      const json = fn(m.code, m.ns, JSON.stringify(m.checks || []));
      fn.destroy();
      self.postMessage({ type: "result", id: m.id, res: JSON.parse(json) });
    } else if (m.type === "files") {
      const cwd = pyodide.FS.cwd();
      for (const path in m.files) {
        const full = cwd + "/" + path;
        pyodide.FS.mkdirTree(full.split("/").slice(0, -1).join("/"));
        pyodide.FS.writeFile(full, m.files[path]);
      }
      self.postMessage({ type: "done", id: m.id });
    } else if (m.type === "reset") {
      const fn = pyodide.globals.get("_lab_reset");
      fn(m.ns); fn.destroy();
      self.postMessage({ type: "done", id: m.id });
    }
  } catch (err) {
    self.postMessage({ type: "fatal", id: m.id, msg: String(err && err.message || err) });
  }
};`;

  const Py = {
    state: "idle",
    pkgBusy: false,
    worker: null,
    ready: null,
    seq: 0,
    pending: {},
    chain: Promise.resolve(),
    listeners: new Set(),
    generation: 0,
    preloaded: new Set(),
    notify() { this.listeners.forEach((fn) => fn(this)); },
    init() {
      if (this.ready) return this.ready;
      this.state = "loading";
      this.notify();
      const blob = new Blob([WORKER_SRC], { type: "text/javascript" });
      const url = URL.createObjectURL(blob);
      this.stage = "worker";
      this.ready = new Promise((resolve, reject) => {
        this._readyResolve = resolve;
        this._readyReject = reject;
      });
      this.ready.catch(() => {});
      try {
        this.worker = new Worker(url);
      } catch (err) {
        this.fail("Worker: " + (err && err.message || err));
        return this.ready;
      }
      clearTimeout(this._initTimer);
      this._initTimer = setTimeout(() => {
        if (this.state === "loading") this.fail("timeout at stage: " + this.stage);
      }, INIT_TIMEOUT_MS);
      this.worker.onmessage = (e) => this.onMessage(e.data);
      this.worker.onerror = (e) => { e.preventDefault && e.preventDefault(); this.fail("worker onerror: " + (e.message || "unknown")); };
      this.worker.postMessage({ type: "init", base: PYODIDE_BASE });
      return this.ready;
    },
    cspBlock(msg) {
      console.error("[ML Lab] CSP blocked:", msg);
      if (this.state === "loading") this.fail("CSP blocked (" + this.stage + "): " + msg);
    },
    fail(msg) {
      clearTimeout(this._initTimer);
      this.lastError = msg;
      console.error("[ML Lab] Python could not start:", msg);
      this.state = "error"; this.notify();
      Object.values(this.pending).forEach((p) => { clearTimeout(p.timer); p.reject(new Error(msg)); });
      this.pending = {};
      if (this._readyReject) this._readyReject(new Error(msg));
    },
    onMessage(m) {
      if (m.type === "stage") { this.stage = m.stage; return; }
      if (m.type === "csp") { this.cspBlock(m.msg); return; }
      if (m.type === "ready") {
        clearTimeout(this._initTimer);
        this.state = "ready"; this.notify();
        this._readyResolve();
        return;
      }
      if (m.type === "pkg") { this.pkgBusy = m.on; this.notify(); return; }
      const p = this.pending[m.id];
      if (m.type === "fatal" && m.id == null) {
        if (this.state === "loading") this.fail(m.msg + " (stage: " + this.stage + ")");
        else console.error("[ML Lab]", m.msg);
        return;
      }
      if (!p) return;
      if (m.type === "exec") {
        p.timer = setTimeout(() => this.timeout(), EXEC_TIMEOUT_MS);
        return;
      }
      clearTimeout(p.timer);
      delete this.pending[m.id];
      if (m.type === "result") p.resolve(m.res);
      else if (m.type === "done") p.resolve(true);
      else if (m.type === "fatal") p.reject(new Error(m.msg));
    },
    send(msg) {
      const job = () => this.init().then(() => new Promise((resolve, reject) => {
        const id = ++this.seq;
        this.pending[id] = { resolve, reject, timer: null };
        this.worker.postMessage(Object.assign({ id }, msg));
      }));
      const p = this.chain.then(job, job);
      this.chain = p.catch(() => {});
      return p;
    },
    run(code, ns, checks) {
      if (this.state === "error") this.hardRestart();
      return this.send({ type: "run", code, ns, checks });
    },
    resetNs(ns) { return this.send({ type: "reset", ns }); },
    written: new Set(),
    // Veri dosyalarını (ör. "fred/UNRATE.csv") sitenin data/ klasöründen alıp Python'un dosya sistemine yazar.
    ensureData(paths) {
      const need = (paths || []).filter((p) => !this.written.has(p));
      if (!need.length) return Promise.resolve(true);
      const gen = this.generation;
      return Promise.all(need.map((p) => fetch("data/" + p + (ASSET_V ? "?v=" + ASSET_V : "")).then((r) => { if (!r.ok) throw new Error("data " + p + ": " + r.status); return r.text(); })))
        .then((texts) => {
          const files = {};
          need.forEach((p, i) => { files[p] = texts[i]; });
          return this.send({ type: "files", files }).then(() => { if (gen === this.generation) need.forEach((p) => this.written.add(p)); });
        });
    },
    preload(pkgs) {
      const need = pkgs.filter((p) => !this.preloaded.has(p));
      if (!need.length) return Promise.resolve(true);
      need.forEach((p) => this.preloaded.add(p));
      return this.send({ type: "preload", pkgs: need });
    },
    timeout() {
      Object.values(this.pending).forEach((p) => { clearTimeout(p.timer); p.reject(Object.assign(new Error("timeout"), { timeout: true })); });
      this.pending = {};
      this.hardRestart();
    },
    hardRestart() {
      if (this.worker) this.worker.terminate();
      clearTimeout(this._initTimer);
      this.worker = null;
      this.state = "idle";
      this.ready = null;
      this.chain = Promise.resolve();
      this.preloaded = new Set();
      this.written = new Set();
      this.generation++;
      this.pkgBusy = false;
      this.init();
    }
  };
  LAB.Py = Py;
  document.addEventListener("securitypolicyviolation", (ev) => {
    if (/pyodide|blob:|wasm|eval/i.test(ev.blockedURI + " " + ev.violatedDirective)) Py.cspBlock(ev.violatedDirective + " → " + ev.blockedURI);
  });

  /* ------------------------------------------------------------------ */
  /* Yardımcılar                                                         */
  /* ------------------------------------------------------------------ */
  function findLesson(id) {
    for (const m of LAB.modules) {
      const i = m.lessons.findIndex((l) => l.id === id);
      if (i >= 0) return { module: m, lesson: m.lessons[i], index: i };
    }
    return null;
  }
  function checkable(cell) { return true; }
  function lessonStats(lesson) {
    const cells = lesson.cells || [];
    const cellsDone = cells.filter((c) => store.cells[c.id]).length;
    const qs = lesson.quiz || [];
    const qDone = qs.filter((q, i) => (store.quiz[lesson.id] || {})[i] === true).length;
    const pg = !!store.pg[lesson.id];
    const hasPg = !!lesson.playground;
    const total = cells.length + qs.length + (hasPg ? 1 : 0);
    const got = cellsDone + qDone + (hasPg && pg ? 1 : 0);
    const pct = store.done[lesson.id] ? 100 : (total ? Math.round(100 * got / total) : 0);
    return { cells: cells.length, cellsDone, qs: qs.length, qDone, pg, pct, done: cells.length === cellsDone && qs.length === qDone };
  }
  function updateDone(lesson) {
    const s = lessonStats(lesson);
    if (s.done && !store.done[lesson.id]) { store.done[lesson.id] = true; save(); return true; }
    return false;
  }
  function miniBar(pct, cls) {
    return h("span", { class: "minibar " + (cls || ""), role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": String(pct), "aria-label": pct + "%" },
      h("span", { style: "width:" + pct + "%" }));
  }
  function requiredLessons(m) {
    return m.required ? m.lessons.filter((l) => m.required.includes(l.id)) : m.lessons;
  }
  function catalogProgress(c) {
    let d = 0, next = null;
    for (let k = 1; k <= c.units; k++) {
      const id = c.id + "-u" + k;
      if (store.done[id]) d++;
      else if (!next) next = id;
    }
    return { d, n: c.units, pct: c.units ? Math.round(100 * d / c.units) : 0, next: next || c.id + "-u1" };
  }
  /* Modül kilidi (öğrenci hızına göre): bir modül, önceki modülün zorunlu üniteleri bitince açılır.
     Colab atölyeleri (catalog.workshops; yoksa son ünite) sayılmaz. LAB.unlockAll yönetici hesabında her şeyi açar.
     Module lock (learner-paced): a module opens once the previous module's required units are done.
     Colab workshops (catalog.workshops, else the last unit) do not count. LAB.unlockAll opens everything for the admin account. */
  function requiredUnitIds(c) {
    const w = c.workshops || [c.units], out = [];
    for (let k = 1; k <= c.units; k++) if (!w.includes(k)) out.push(c.id + "-u" + k);
    return out;
  }
  function moduleLock(c) {
    const i = LAB.catalog.indexOf(c);
    if (!LAB.lockEnabled || LAB.unlockAll || i <= 0) return null;
    const prev = LAB.catalog[i - 1];
    const req = requiredUnitIds(prev);
    const missing = req.filter((id) => !store.done[id]);
    const chain = !!moduleLock(prev);
    if (!missing.length && !chain) return null;
    return { prev, req, missing, chain };
  }
  LAB.moduleLock = moduleLock;
  function overallNext() {
    for (const c of LAB.catalog) { const p = catalogProgress(c); if (p.d < p.n) return { id: p.next, started: LAB.catalog.some((x) => catalogProgress(x).d > 0) }; }
    return { id: LAB.catalog.length ? LAB.catalog[0].id : "home", started: true };
  }

  /* Modülün tanımladığı ünite notu (ör. M0'da Python önerisi); kapatılınca bir daha gösterilmez.
     A module-defined unit notice (e.g. the Python tip in M0); hidden for good once dismissed. */
  function unitNotice(m, L) {
    const n = m.unitNotice;
    if (!n || !n.ids.includes(L.id)) return null;
    store.notices = store.notices || {};
    if (store.notices[n.key]) return null;
    const box = h("aside", { class: "unit-notice", role: "note" },
      h("span", { class: "un-ic", "aria-hidden": "true", html: '<svg viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 11v5M12 7.6v.4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' }),
      h("div", { class: "un-body" },
        h("strong", null, t(n.title)),
        h("p", { html: t(n.text) }),
        h("div", { class: "un-actions" },
          h("a", { class: "btn primary sm", href: "#" + n.target }, t(n.go) + " →"),
          h("button", { class: "btn ghost sm", onclick: () => { store.notices[n.key] = true; save(); box.remove(); } }, t(n.dismiss)))));
    return box;
  }

  function lessonLabel(m, l) {
    const req = requiredLessons(m);
    const i = req.indexOf(l);
    if (i >= 0) return { short: String(i + 1).padStart(2, "0"), long: t(UI.unit) + " " + (i + 1) + " / " + req.length, n: String(i + 1) };
    const extra = m.lessons.filter((x) => !req.includes(x));
    const j = extra.indexOf(l);
    return { short: "A" + (j + 1), long: t(UI.appendix) + " · " + t(UI.lessonOf) + " " + (j + 1) + " / " + extra.length, n: "A" + (j + 1) };
  }
  function moduleProgress(m) {
    const req = requiredLessons(m);
    const n = req.length;
    const d = req.filter((l) => store.done[l.id]).length;
    const pct = n ? Math.round(req.reduce((a, l) => a + lessonStats(l).pct, 0) / n) : 0;
    return { n, d, pct };
  }

  /* Basit Python renklendirme (oyun alanlarında gösterilen kod için) */
  const KW = /\b(def|return|for|in|if|elif|else|import|as|from|while|True|False|None|and|or|not|print|len|sum|max|min|round|range|type)\b/g;
  function hl(code) {
    const parts = [];
    const re = /(#.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)/gm;
    let last = 0, m;
    while ((m = re.exec(code))) {
      parts.push({ t: "p", s: code.slice(last, m.index) });
      if (m[1]) parts.push({ t: "c", s: m[1] });
      else if (m[2]) parts.push({ t: "s", s: m[2] });
      else parts.push({ t: "n", s: m[3] });
      last = re.lastIndex;
    }
    parts.push({ t: "p", s: code.slice(last) });
    return parts.map((p) => {
      const e = esc(p.s);
      if (p.t === "c") return '<span class="tk-c">' + e + "</span>";
      if (p.t === "s") return '<span class="tk-s">' + e + "</span>";
      if (p.t === "n") return '<span class="tk-n">' + e + "</span>";
      return e.replace(KW, '<span class="tk-k">$1</span>');
    }).join("");
  }
  LAB.hl = hl;

  /* ------------------------------------------------------------------ */
  /* Uygulama kabuğu: kenar çubuğu + üst çubuk                           */
  /* ------------------------------------------------------------------ */
  const app = document.getElementById("app");
  const headerEl = document.getElementById("topbar");
  const sidebarEl = document.getElementById("sidebar");
  const pyChip = h("span", { class: "pychip", role: "status", "aria-live": "polite" });
  let current = { kind: "home" };

  const ICON = {
    logo: '<svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true"><rect x="1" y="1" width="30" height="30" rx="8" fill="currentColor" opacity=".14"/><path d="M8 21.5 L13.2 14.8 L17.4 18.2 L24 10" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="24" cy="10" r="2.6" fill="currentColor"/><circle cx="8" cy="21.5" r="1.8" fill="currentColor"/></svg>',
    home: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    path: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="6" cy="6" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="18" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 6H15a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h6.5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    sun: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    moon: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    menu: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    play: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M7 4.5v15l12-7.5z" fill="currentColor"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    reset: '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    key: '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M5 12l4 4L19 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    lock: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    clock: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    book: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 0 4 20.5zM20 5.5A1.5 1.5 0 0 0 18.5 4H13v15h5.5a1.5 1.5 0 0 1 1.5 1.5z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    sliders: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="16" cy="7" r="2.2" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="10" cy="17" r="2.2" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
    code: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M8.5 7 3.5 12l5 5M15.5 7l5 5-5 5M13.5 4.5l-3 15" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8 12.2l2.7 2.7L16.2 9" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  const STAGE_ICONS = ["book", "sliders", "code", "check"];

  function ring(pct, size) {
    const s = size || 22, r = s / 2 - 2.2, c = 2 * Math.PI * r;
    if (pct >= 100) {
      return '<svg class="ring done" viewBox="0 0 ' + s + " " + s + '" width="' + s + '" height="' + s + '" aria-hidden="true"><circle cx="' + s / 2 + '" cy="' + s / 2 + '" r="' + (s / 2 - 1) + '" class="ring-fill"/><path d="M' + (s * 0.3) + " " + (s * 0.52) + " l" + (s * 0.14) + " " + (s * 0.14) + " l" + (s * 0.27) + " -" + (s * 0.3) + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ring-check"/></svg>';
    }
    return '<svg class="ring" viewBox="0 0 ' + s + " " + s + '" width="' + s + '" height="' + s + '" aria-hidden="true"><circle cx="' + s / 2 + '" cy="' + s / 2 + '" r="' + r + '" class="ring-track"/>' +
      (pct > 0 ? '<circle cx="' + s / 2 + '" cy="' + s / 2 + '" r="' + r + '" class="ring-val" stroke-dasharray="' + (c * pct / 100).toFixed(2) + " " + c.toFixed(2) + '" transform="rotate(-90 ' + s / 2 + " " + s / 2 + ')"/>' : "") + "</svg>";
  }

  const LINKS = {
    site: "https://www.songurmehmet.com",
    github: "https://github.com/mehmetsongur",
    course: "https://github.com/mehmetsongur/Machine-Learning-in-Economics-and-Finance",
    colabRepo: "mehmetsongur/ml-lab"
  };
  function avatar(cls) { return h("span", { class: "avatar " + (cls || ""), "aria-hidden": "true" }, "MS"); }
  function copyBtn(text) {
    const b = h("button", { class: "btn ghost sm", onclick: () => {
      try {
        navigator.clipboard.writeText(text).then(() => { b.textContent = t(UI.copied); setTimeout(() => (b.textContent = t(UI.copy)), 1600); }, () => {});
      } catch (e) { /* pano kullanılamıyor */ }
    } }, t(UI.copy));
    return b;
  }

  function renderPyChip() {
    pyChip.className = "pychip is-" + Py.state + (Py.pkgBusy ? " is-pkg" : "");
    let txt = t(UI.pyIdle);
    if (Py.state === "loading") txt = t(UI.pyLoadingShort);
    else if (Py.state === "ready") txt = Py.pkgBusy ? t(UI.pyPkgs) : t(UI.pyReady);
    else if (Py.state === "error") txt = t(UI.pyErrorShort);
    pyChip.innerHTML = '<span class="dot" aria-hidden="true"></span><span class="pytxt">' + esc(txt) + "</span>";
    pyChip.title = Py.state === "loading" ? t(UI.pyLoading) : (Py.state === "error" ? t(UI.pyError) + " " + (Py.lastError || "") : "");
  }
  Py.listeners.add(renderPyChip);

  function sectionsOf(m) {
    if (m.sections && m.sections.length) return m.sections.map((s) => ({ title: s.title, lessons: s.ids.map((id) => m.lessons.find((l) => l.id === id)).filter(Boolean) }));
    return [{ title: m.title, lessons: m.lessons }];
  }
  function nextLesson(m) {
    const req = requiredLessons(m);
    return req.find((l) => !store.done[l.id]) || req[0];
  }

  function renderSidebar() {
    sidebarEl.innerHTML = "";
    const cm = current.module || null;
    sidebarEl.append(h("a", { class: "sb-brand", href: "#home", onclick: closeNav },
      h("span", { class: "sb-logo", html: ICON.logo }),
      h("span", { class: "sb-name" }, h("strong", null, t(UI.appName)), h("small", null, t(UI.courseShort)))));
    sidebarEl.append(h("nav", { class: "sb-nav", "aria-label": t(UI.navLabel) },
      h("a", { class: "sb-link" + (current.kind === "home" ? " on" : ""), href: "#home", onclick: closeNav }, t(UI.home))));
    const mods = h("div", { class: "sb-mods" }, h("p", { class: "sb-sec" }, t(UI.modulesTitle)));
    LAB.catalog.forEach((c) => {
      const m = cm && cm.id === c.id ? cm : null;
      const p = m ? moduleProgress(m) : catalogProgress(c);
      const on = !!m;
      const lk = moduleLock(c);
      const head = h("a", { class: "sb-mod" + (on ? " on" : "") + (on && current.kind === "module" ? " cur" : "") + (lk ? " locked" : ""), href: "#" + c.id, onclick: closeNav, title: lk ? t(UI.locked) : null },
        h("span", { class: "sb-mod-n" }, String(c.num)),
        h("span", { class: "sb-mod-t" }, t(c.title)),
        lk ? h("span", { class: "sb-mod-p sb-lock", html: ICON.lock, "aria-label": t(UI.locked) }) : h("span", { class: "sb-mod-p" }, p.pct + "%"));
      mods.append(head);
      if (!m) return;
      mods.append(h("div", { class: "sb-bar" }, h("span", { style: "width:" + p.pct + "%" })));
      const req = requiredLessons(m);
      const item = (l, ci) => {
        const lab = lessonLabel(m, l);
        const st = lessonStats(l);
        const cur = current.kind === "lesson" && current.lesson.id === l.id;
        const state = store.done[l.id] ? "done" : (st.pct > 0 ? "part" : "");
        return h("a", { class: "sb-lesson c" + ci + (cur ? " cur" : "") + (state ? " " + state : ""), href: "#" + l.id, onclick: closeNav, "aria-current": cur ? "page" : null },
          h("span", { class: "sb-dot", "aria-hidden": "true" }, store.done[l.id] ? "✓" : ""),
          h("span", { class: "sb-ln" }, lab.short), h("span", { class: "sb-title" }, t(l.title)));
      };
      const list = h("div", { class: "sb-lessons" });
      sectionsOf(m).forEach((sec, si) => {
        const isReq = req.includes(sec.lessons[0]);
        const ci = si % 5;
        if (isReq) {
          list.append(h("p", { class: "sb-sec c" + ci }, t(sec.title)));
          sec.lessons.forEach((l) => list.append(item(l, ci)));
        } else {
          const open = current.kind === "lesson" && sec.lessons.includes(current.lesson);
          list.append(h("details", { class: "sb-extra", open: open || null },
            h("summary", { class: "sb-sec" }, t(sec.title), h("span", { class: "sb-extra-n" }, sec.lessons.filter((l) => store.done[l.id]).length + " / " + sec.lessons.length)), sec.lessons.map((l) => item(l, ci))));
        }
      });
      mods.append(list);
    });
    sidebarEl.append(mods);
    sidebarEl.append(h("div", { class: "sb-foot" },
      h("a", { class: "sb-by", href: LINKS.site, target: "_blank", rel: "noopener" }, t(UI.createdBy) + ": " + t(UI.authorName)),
      LAB.hooks.account ? LAB.hooks.account() : null,
      h("button", { class: "sb-reset", onclick: askReset }, t(UI.resetProgress))));
  }

  function openNav() { document.body.classList.add("nav-open"); }
  function closeNav() { document.body.classList.remove("nav-open"); }

  function renderTopbar(crumbs, progressEl) {
    headerEl.innerHTML = "";
    const langSw = h("div", { class: "lang", role: "group", "aria-label": "Dil / Language" },
      ["tr", "en"].map((l) => h("button", { class: l === lang ? "on" : "", "aria-pressed": l === lang ? "true" : "false", onclick: () => setLang(l) }, l.toUpperCase())));
    renderPyChip();
    headerEl.append(
      h("button", { class: "tb-menu", "aria-label": t(UI.openMenu), onclick: openNav, html: ICON.menu }),
      h("nav", { class: "crumbs", "aria-label": "breadcrumb" }, crumbs.map((c, i) => [i ? h("span", { class: "sep", "aria-hidden": "true" }, "/") : null, c.href ? h("a", { href: c.href }, c.label) : h("span", { class: "here" }, c.label)])),
      h("div", { class: "tb-right" }, pyChip, langSw,
        h("button", { class: "theme-btn", "aria-label": isDark() ? t(UI.themeLight) : t(UI.themeDark), title: isDark() ? t(UI.themeLight) : t(UI.themeDark), html: isDark() ? ICON.sun : ICON.moon,
          onclick: () => { store.theme = isDark() ? "light" : "dark"; save(); applyTheme(); renderTopbarAgain(); } }))
    );
    lastTopbar = [crumbs, progressEl];
    if (progressEl) headerEl.append(progressEl);
  }

  let lastTopbar = null;
  function renderTopbarAgain() { if (lastTopbar) renderTopbar(lastTopbar[0], lastTopbar[1]); }

  function setLang(l) {
    if (l === lang) return;
    lang = l; store.lang = l; save();
    document.documentElement.lang = l;
    route();
  }

  /* ------------------------------------------------------------------ */
  /* Ana sayfa                                                           */
  /* ------------------------------------------------------------------ */
  function heroPreview() {
    const codeLines = lang === "tr"
      ? ['aylik_enf = [<span class="tk-n">3.2</span>, <span class="tk-n">4.5</span>, <span class="tk-n">2.9</span>, …]', '<span class="bad-line">yillik = <span class="tk-k">sum</span>(aylik_enf)</span>', '<span class="tk-k">print</span>(f<span class="tk-s">"Yıllık: %{yillik:.1f}"</span>)']
      : ['monthly_inf = [<span class="tk-n">3.2</span>, <span class="tk-n">4.5</span>, <span class="tk-n">2.9</span>, …]', '<span class="bad-line">annual = <span class="tk-k">sum</span>(monthly_inf)</span>', '<span class="tk-k">print</span>(f<span class="tk-s">"Annual: {annual:.1f}%"</span>)'];
    const pts = [18, 22, 21, 27, 31, 29, 36, 41, 39, 46, 44, 50];
    const W = 260, H = 70;
    const path = pts.map((v, i) => (i ? "L" : "M") + (i * W / (pts.length - 1)).toFixed(1) + " " + (H - (v - 15) * H / 40).toFixed(1)).join(" ");
    return h("div", { class: "hero-card", "aria-hidden": "true" },
      h("div", { class: "hc-chrome" }, h("span"), h("span"), h("span"), h("em", null, t(UI.aiName))),
      h("div", { class: "hc-ask" }, h("b", null, t(UI.you)), lang === "tr" ? "12 aylık enflasyondan yıllık enflasyonu hesaplar mısın?" : "Can you compute annual inflation from 12 monthly rates?"),
      h("pre", { class: "hc-code", html: codeLines.map((l, i) => '<span class="gut">' + (i + 1) + "</span>" + (l || " ")).join("\n") }),
      h("div", { class: "hc-chart", html: '<svg viewBox="0 0 ' + W + " " + (H + 6) + '" preserveAspectRatio="none"><path d="' + path + " L" + W + " " + H + " L0 " + H + ' Z" class="hc-area"/><path d="' + path + '" class="hc-line"/><circle cx="' + W + '" cy="' + (H - (50 - 15) * H / 40).toFixed(1) + '" r="4" class="hc-dot"/></svg>' }),
      h("div", { class: "hc-pass" }, h("span", { html: ICON.key }), t(UI.heroPass)));
  }

  function lessonPath(m) {
    const wrap = h("div", { class: "path" });
    sectionsOf(m).forEach((sec, si) => {
      const block = h("section", { class: "path-sec c" + (si % 5) },
        h("header", { class: "path-head" }, h("span", { class: "path-step" }, String(si + 1)), h("h3", null, t(sec.title)),
          h("span", { class: "path-meta" }, sec.lessons.length + " " + (m.required && m.required.includes(sec.lessons[0].id) ? t(UI.statUnits) : t(UI.lessons)) + " · " + sec.lessons.reduce((a, l) => a + (l.minutes || 15), 0) + " " + t(UI.minutes) + (m.required && !m.required.includes(sec.lessons[0].id) ? " · " + t(UI.optDone).replace("{d}", sec.lessons.filter((l) => store.done[l.id]).length).replace("{n}", sec.lessons.length) : ""))));
      const ol = h("ol", { class: "path-list" });
      sec.lessons.forEach((l) => {
        const st = lessonStats(l);
        const n = lessonLabel(m, l).n;
        const nEx = (l.cells || []).length;
        ol.append(h("li", null, h("a", { class: "path-item" + (store.done[l.id] ? " done" : ""), href: "#" + l.id },
          h("span", { class: "pi-ring", html: ring(store.done[l.id] ? 100 : st.pct, 34) }, st.pct > 0 && st.pct < 100 ? null : h("b", null, store.done[l.id] ? "" : String(n))),
          h("span", { class: "pi-body" }, h("strong", null, t(l.title)), h("small", null, t(l.blurb))),
          h("span", { class: "pi-meta" }, h("span", { class: "chip", html: ICON.clock + " " + (l.minutes || 15) + " " + t(UI.minutes) }), h("span", { class: "chip" }, nEx + " " + t(UI.exercisesShort)), h("span", { class: "pi-pct" }, st.pct + "%")))));
      });
      block.append(ol);
      wrap.append(block);
    });
    return wrap;
  }

  function viewHome() {
    current = { kind: "home" };
    document.title = t(UI.appName) + " · " + t(UI.authorName);
    renderTopbar([{ label: t(UI.appName) }]);
    const wrap = h("main", { class: "page home" });
    const nx = overallNext();
    const cat = LAB.catalog;
    const totalUnits = cat.reduce((a, c) => a + c.units, 0);
    const totalEx = cat.reduce((a, c) => a + c.exercises, 0);
    const totalMin = cat.reduce((a, c) => a + c.minutes, 0);

    const H1 = t(UI.labH1);
    wrap.append(h("section", { class: "hero hero-lab" },
      h("div", { class: "hl-text" },
        h("a", { class: "hero-author", href: "#about" }, avatar("sm"),
          h("span", null, h("strong", null, t(UI.authorName)), h("small", null, t(UI.authorRole)))),
        h("p", { class: "eyebrow hero-eyebrow" }, t(UI.labEyebrow).split(/(English)/).map((x) => x === "English" ? h("span", { lang: "en" }, x) : x)),
        h("h1", null, H1[0], h("span", { class: "grad" }, H1[1]), H1[2]),
        h("p", { class: "lead" }, t(UI.labLead)),
        h("div", { class: "cta-row" },
          h("a", { class: "btn primary lg", href: "#" + nx.id }, (nx.started ? t(UI.heroContinue) : t(UI.heroStart)) + " →"),
          h("a", { class: "btn ghost lg", href: "#modules" }, t(UI.labModulesBtn))),
        h("dl", { class: "hero-stats" },
          [[String(cat.length), t(UI.heroModsLbl)], [String(totalUnits), t(UI.heroUnitsLbl)], [String(totalEx), t(UI.heroExLbl)], ["~" + Math.round(totalMin / 60), t(UI.heroHrLbl)]]
            .map(([v, k]) => h("div", null, h("dt", null, v), h("dd", null, k))))),
      h("aside", { class: "unit-panel" },
        h("p", { class: "up-title" }, t(UI.unitPanelTitle)),
        h("ol", null, t(UI.unitSteps).map(([k, d], i) => h("li", { class: "c" + i },
          h("span", { class: "up-ic", html: ICON[STAGE_ICONS[i]] }),
          h("span", null, h("strong", null, k), h("small", null, d))))),
        h("p", { class: "up-note" }, t(UI.unitPanelNote)))));

    wrap.append(h("section", { class: "home-mods", id: "modules" },
      h("div", { class: "sec-head" }, h("p", { class: "eyebrow" }, t(UI.modulesEyebrow)), h("h2", null, t(UI.modulesTitle))),
      h("div", { class: "mod-grid" }, cat.map((c, i) => {
        const p = catalogProgress(c);
        const lk = moduleLock(c);
        return h("a", { class: "mod-card c" + (i % 5) + (lk ? " locked" : ""), href: "#" + c.id },
          h("div", { class: "mc-top" }, h("span", { class: "mc-num" }, t(UI.module) + " " + c.num),
            lk ? h("span", { class: "mc-pct mc-lock", html: ICON.lock + " " + t(UI.locked) }) : h("span", { class: "mc-pct" }, p.pct + "%")),
          h("h3", null, t(c.title)),
          h("p", null, t(c.summary)),
          c.topics ? h("ul", { class: "mc-topics" }, t(c.topics).map((x) => h("li", null, x))) : null,
          h("div", { class: "mc-meta" },
            h("span", { class: "chip" }, c.units + " " + t(UI.statUnits)),
            h("span", { class: "chip" }, c.exercises + " " + t(UI.exercisesShort)),
            h("span", { class: "chip", html: ICON.clock + " ~" + Math.round(c.minutes / 60) + " " + t(UI.heroHrShort) })),
          h("div", { class: "mc-bar" }, h("span", { style: "width:" + p.pct + "%" })),
          h("span", { class: "mc-go" }, lk ? fillP(t(UI.lockCard), lk.prev.num) : (p.d > 0 ? t(UI.heroContinue) : t(UI.openModule)) + " →"));
      }))));
    wrap.append(h("section", { class: "about", id: "about" },
      h("div", { class: "sec-head" }, h("p", { class: "eyebrow" }, t(UI.aboutEyebrow)), h("h2", null, t(UI.aboutTitle))),
      h("div", { class: "about-grid" },
        h("div", { class: "card author-card" },
          h("div", { class: "ac-top" }, avatar("lg"), h("div", null, h("h3", null, t(UI.authorName)), h("p", { class: "ac-areas" }, t(UI.authorAreas)))),
          h("p", { class: "ac-text" }, t(UI.aboutText)),
          h("div", { class: "ac-links" },
            h("a", { class: "btn ghost sm", href: LINKS.site, target: "_blank", rel: "noopener" }, t(UI.personalSite) + " ↗"),
            h("a", { class: "btn ghost sm", href: LINKS.course, target: "_blank", rel: "noopener" }, t(UI.courseRepo) + " ↗"),
            h("a", { class: "btn ghost sm", href: LINKS.github, target: "_blank", rel: "noopener" }, "GitHub ↗"))))));
    wrap.append(footer());
    return wrap;
  }
  function totalExCount(n) { return n; }

  function footer() {
    return h("footer", { class: "foot" },
      h("div", { class: "foot-brand" }, avatar("sm"), h("div", null, h("strong", null, t(UI.appName) + " · " + t(UI.authorName)), h("p", null, t(UI.rights)))),
      h("div", { class: "foot-links" },
        h("a", { href: LINKS.site, target: "_blank", rel: "noopener" }, "songurmehmet.com"),
        h("a", { href: LINKS.github, target: "_blank", rel: "noopener" }, "GitHub")));
  }

  function askReset() {
    const dlg = h("div", { class: "modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "reset-title" },
      h("div", { class: "modal-box" },
        h("h3", { id: "reset-title" }, t(UI.resetProgress)),
        h("p", null, t(UI.resetAsk)),
        h("div", { class: "row end" },
          h("button", { class: "btn ghost", onclick: () => dlg.remove() }, t(UI.no)),
          h("button", { class: "btn danger", onclick: () => {
            store.cells = {}; store.quiz = {}; store.pg = {}; store.done = {}; store.code = {}; store.resetAt = Date.now(); save();
            dlg.remove(); route();
          } }, t(UI.yes)))));
    document.body.append(dlg);
  }

  /* ------------------------------------------------------------------ */
  /* Öğrenme yolu (modül)                                                */
  /* ------------------------------------------------------------------ */
  function viewModule(m) {
    current = { kind: "module", module: m };
    document.title = t(m.title) + " · " + t(UI.appName);
    renderTopbar([{ label: t(UI.appName), href: "#home" }, { label: t(UI.learningPath) }]);
    const p = moduleProgress(m);
    const nl = nextLesson(m);
    const wrap = h("main", { class: "page module" });
    wrap.append(h("a", { class: "hero-author page-author", href: "#about" }, avatar("sm"),
      h("span", null, h("strong", null, t(UI.authorName)), h("small", null, t(UI.authorRole)))));
    wrap.append(h("header", { class: "page-head" },
      h("div", null,
        h("p", { class: "eyebrow" }, t(UI.module) + " " + m.num + " · " + t(UI.learningPath)),
        h("h1", null, t(m.title)),
        h("p", { class: "lead" }, t(m.summary)),
        m.intro ? h("div", { class: "prose intro", html: t(m.intro) }) : null,
        h("div", { class: "cta-row" }, h("a", { class: "btn primary", href: "#" + nl.id }, (p.pct ? t(UI.continue) : t(UI.start)) + ": " + t(nl.title) + " →"))),
      h("div", { class: "mod-prog big" }, h("div", { class: "mp-ring", html: ring(p.pct, 96) }, h("span", null, p.pct + "%")), h("small", null, p.d + " / " + p.n + " " + t(UI.lessonsDone)))));
    wrap.append(lessonPath(m), footer());
    return wrap;
  }

  /* ------------------------------------------------------------------ */
  /* Ders                                                                */
  /* ------------------------------------------------------------------ */
  const stepMemory = {};

  function viewLesson(found) {
    const { module: m, lesson: L, index } = found;
    current = { kind: "lesson", module: m, lesson: L };
    document.title = t(L.title) + " · " + t(UI.appName);
    const nsName = L.id + "#" + lang;
    const sec = sectionsOf(m).find((s) => s.lessons.includes(L));

    const progFill = h("span");
    const progLabel = h("span", { class: "tp-label" });
    const progEl = h("div", { class: "tb-progress", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100", "aria-label": t(UI.lessonProgress) }, h("div", { class: "tp-track" }, progFill), progLabel);
    const lbl = lessonLabel(m, L);
    renderTopbar([{ label: t(UI.learningPath), href: "#" + m.id }, { label: lbl.long }], progEl);

    const main = h("main", { class: "page lesson" });
    const tabs = h("div", { class: "steps-nav", role: "tablist", "aria-label": t(UI.stepsLabel) });
    const panels = [];
    const names = t(UI.stages);
    const hasPg = !!L.playground;
    if (!hasPg && !store.pg[L.id]) { store.pg[L.id] = true; save(); }
    const stepIdx = [0, 1, 2, 3].filter((i) => i !== 1 || hasPg);
    let active = stepMemory[L.id] != null && stepIdx.includes(stepMemory[L.id]) ? stepMemory[L.id] : 0;

    main.append(h("header", { class: "lesson-head" },
      h("p", { class: "eyebrow" }, (sec ? t(sec.title) + " · " : "") + lbl.long + " · " + (L.minutes || 15) + " " + t(UI.minutes)),
      h("h1", null, t(L.title)),
      L.blurb ? h("p", { class: "lead" }, t(L.blurb)) : null,
      h("p", { class: "lesson-by" }, avatar("xs"), t(UI.authorName) + " · " + t(UI.appName))), unitNotice(m, L), tabs);

    function stepStatus(i) {
      const s = lessonStats(L);
      if (i === 0) return { ok: true, sub: t(UI.read) };
      if (i === 1) return { ok: s.pg, sub: s.pg ? t(UI.playgroundTouched) : t(UI.tryIt) };
      if (i === 2) return { ok: s.cells === s.cellsDone, sub: s.cellsDone + " / " + s.cells };
      return { ok: s.qs === s.qDone, sub: s.qDone + " / " + s.qs };
    }
    function renderTabs() {
      tabs.innerHTML = "";
      stepIdx.forEach((i, k) => {
        const st = stepStatus(i);
        tabs.append(h("button", { class: "step-tab" + (i === active ? " on" : "") + (st.ok && i !== 0 ? " ok" : ""), role: "tab", "aria-selected": i === active ? "true" : "false", "aria-controls": "panel-" + i, id: "tab-" + i, onclick: () => showStep(i) },
          h("span", { class: "st-ic", html: st.ok && i !== 0 ? ICON.key : ICON[STAGE_ICONS[i]] }),
          h("span", { class: "st-text" }, h("small", null, t(UI.step) + " " + (k + 1)), h("strong", null, names[i])),
          h("span", { class: "st-sub" }, st.sub)));
      });
    }
    function showStep(i) {
      active = i; stepMemory[L.id] = i;
      panels.forEach((p) => { p.el.hidden = p.i !== i; });
      renderTabs();
      if (i === 2) requestAnimationFrame(() => ctx.cells.forEach((c) => c.cm && c.cm.refresh()));
      const top = tabs.getBoundingClientRect().top + window.scrollY - (headerEl.offsetHeight + 12);
      if (window.scrollY > top) window.scrollTo({ top, behavior: "smooth" });
    }
    function stepNav(i) {
      const k = stepIdx.indexOf(i);
      const prev = stepIdx[k - 1], next = stepIdx[k + 1];
      return h("div", { class: "step-foot" },
        prev != null ? h("button", { class: "btn ghost", onclick: () => showStep(prev) }, "← " + names[prev]) : h("span"),
        next != null ? h("button", { class: "btn primary", onclick: () => showStep(next) }, t(UI.nextStep) + ": " + names[next] + " →") : h("span"));
    }
    function panel(i) {
      const el = h("section", { class: "panel panel-" + i, id: "panel-" + i, role: "tabpanel", "aria-labelledby": "tab-" + i });
      panels.push({ i, el });
      return el;
    }

    // 1) Kavram
    const p0 = panel(0);
    const conceptCard = h("div", { class: "card concept" }, h("div", { class: "prose reading", html: t(L.concept) }));
    if (L.terms && L.terms.length) {
      conceptCard.append(h("div", { class: "terms" }, h("span", { class: "terms-h" }, t(UI.terms)),
        L.terms.map((x) => h("span", { class: "term" }, h("b", null, x.tr), h("i", null, x.en)))));
    }
    p0.append(conceptCard, stepNav(0));

    // 2) Oyun alanı
    if (hasPg) {
      const p1 = panel(1);
      const pgCfg = L.playground;
      const card = h("div", { class: "card pgcard" });
      if (pgCfg.intro) card.append(h("p", { class: "pg-intro" }, t(pgCfg.intro)));
      const host = h("div", { class: "pg" });
      card.append(host);
      const fn = LAB.playgrounds[pgCfg.type];
      if (fn) {
        try {
          fn(host, pgCfg, { t, lang, h, hl, esc, touch: () => { if (!store.pg[L.id]) { store.pg[L.id] = true; save(); renderDone(); } } });
        } catch (err) { host.textContent = "Playground error: " + err.message; console.error(err); }
      }
      if (pgCfg.takeaway) card.append(h("p", { class: "takeaway" }, h("strong", null, t(UI.keyIdea)), " ", t(pgCfg.takeaway)));
      p1.append(card, stepNav(1));
    }

    // 3) Kod laboratuvarı
    const p2 = panel(2);
    const exDots = h("div", { class: "ex-dots" });
    const exCount = h("span", { class: "ex-count" });
    const ctx = { L, nsName, cells: [], ranUpTo: -1, gen: Py.generation, renderDone };
    const labBar = h("div", { class: "labbar" },
      h("div", { class: "lb-left" }, exCount, exDots),
      h("div", { class: "lb-right" },
        h("button", { class: "btn ghost sm", onclick: (e) => runAll(ctx, e.currentTarget) }, h("span", { html: ICON.play }), h("span", { class: "ra-label" }, t(UI.runAll))),
        h("button", { class: "btn ghost sm", onclick: () => { Py.hardRestart(); ctx.ranUpTo = -1; ctx.gen = Py.generation; ctx.cells.forEach((c) => c.clearOut()); } }, h("span", { html: ICON.reset }), t(UI.restart))));
    const cellsWrap = h("div", { class: "cells" });
    (L.cells || []).forEach((cell, i) => { const c = buildCell(ctx, cell, i); ctx.cells.push(c); cellsWrap.append(c.el); });
    p2.append(labBar, cellsWrap, stepNav(2));

    // 4) Test
    const p3 = panel(3);
    const doneBox = h("div", { class: "done-box" });
    if (L.quiz && L.quiz.length) p3.append(h("div", { class: "card" }, buildQuiz(L, () => renderDone())));
    const prevL = m.lessons[index - 1], nextL = m.lessons[index + 1];
    p3.append(doneBox, h("div", { class: "step-foot" },
      prevL ? h("a", { class: "btn ghost", href: "#" + prevL.id }, "← " + t(UI.prev)) : h("a", { class: "btn ghost", href: "#" + m.id }, "← " + t(UI.learningPath)),
      nextL ? h("a", { class: "btn primary", href: "#" + nextL.id }, t(UI.next) + ": " + t(nextL.title) + " →") : h("a", { class: "btn primary", href: "#" + m.id }, t(UI.learningPath) + " →")));

    panels.forEach((p) => main.append(p.el));
    main.append(footer());

    function renderDone() {
      updateDone(L);
      const s = lessonStats(L);
      progFill.style.width = s.pct + "%";
      progEl.setAttribute("aria-valuenow", String(s.pct));
      progEl.classList.toggle("full", s.pct === 100);
      progLabel.textContent = s.pct + "%";
      exCount.textContent = t(UI.exercisesDone).replace("{n}", s.cellsDone).replace("{m}", s.cells);
      exDots.innerHTML = "";
      ctx.cells.forEach((c, i) => exDots.append(h("a", { class: "dot" + (store.cells[c.cell.id] ? " ok" : ""), href: "#" + L.id, "aria-label": t(UI.exercise) + " " + (i + 1), onclick: (e) => { e.preventDefault(); c.el.scrollIntoView({ behavior: "smooth", block: "start" }); } })));
      const ok = !!store.done[L.id];
      doneBox.className = "done-box" + (ok ? " ok" : "");
      doneBox.innerHTML = "";
      doneBox.append(h("span", { class: "db-ic", html: ok ? ring(100, 40) : ring(s.pct, 40) }),
        h("div", null, h("strong", null, ok ? t(UI.lessonDone) : t(UI.lessonPct).replace("{p}", s.pct)), h("p", null, ok ? t(UI.lessonDoneSub) : t(UI.lessonTodo))));
      renderTabs();
      renderSidebar();
    }

    renderDone();
    showStep(active);
    Py.init().then(() => { if (L.packages && L.packages.length) Py.preload(L.packages).catch(() => {}); }).catch(() => {});
    return main;
  }

  /* ---------------------------- Alıştırma kartı ---------------------------- */
  function codeKey(cell) { return lang + ":" + cell.id; }

  const SPECIAL = { compare: 1, prompt: 1, interpret: 1, colab: 1, auditlog: 1 };
  function buildCell(ctx, cell, i) {
    if (SPECIAL[cell.kind]) return buildSpecial(ctx, cell, i);
    const starter = t(cell.code) || (cell.ai ? t(cell.ai.code) : "");
    const saved = store.code[codeKey(cell)];
    const kind = cell.kind || "run";
    const el = h("article", { class: "ex kind-" + kind + (store.cells[cell.id] ? " passed" : ""), id: "cell-" + cell.id });
    const status = h("span", { class: "ex-status", html: store.cells[cell.id] ? ICON.key : "" });
    const brief = h("div", { class: "ex-brief" });
    const work = h("div", { class: "ex-work" });
    let auditApi = null;
    if (kind === "audit" && cell.ai) {
      const top = h("div", { class: "ex-top" });
      el.append(top);
      auditApi = { lineOk: !!store.cells[cell.id] };
      top.append(aiCard(cell.ai, { selectable: true, onCheck: (sel, card) => {
        const want = cell.bugLines.slice().sort().join(",");
        const ok = sel.slice().sort().join(",") === want;
        card.fbEl.innerHTML = "";
        card.fbEl.append(h("div", { class: "fb " + (ok ? "good" : "warn") }, ok ? t(UI.lineRight) : t(UI.lineWrong),
          ok && cell.lineExplain ? h("p", { html: t(cell.lineExplain) }) : null, ok && !store.cells[cell.id] ? h("p", null, t(UI.fixBelow)) : null));
        if (ok) {
          auditApi.lineOk = true;
          card.lockRight(cell.bugLines);
          if (api.checksOk && !store.cells[cell.id]) { api.setPassed(true); ctx.renderDone(); fb.innerHTML = ""; fb.append(h("div", { class: "fb good" }, t(UI.pass), cell.after ? h("p", { html: t(cell.after) }) : null)); }
        }
      }, preset: store.cells[cell.id] ? cell.bugLines : null }));
    }
    el.append(brief, work);

    const headEl = h("header", { class: "ex-head" },
      h("span", { class: "ex-num" }, t(UI.exercise) + " " + (i + 1)),
      h("span", { class: "badge kind" }, t(UI.kind[kind])), status);
    const taskEl = cell.task ? h("div", { class: "ex-task prose", html: t(cell.task) }) : null;
    const topEl = el.querySelector(".ex-top");
    if (topEl) { topEl.prepend(headEl); if (taskEl) headEl.after(taskEl); }
    else { brief.append(headEl); if (taskEl) brief.append(taskEl); }

    let guess = null, predictBox = null;
    const runBtn = h("button", { class: "btn primary run", onclick: () => runCell(ctx, i) }, h("span", { html: ICON.play }), h("span", { class: "run-label" }, t(UI.run)));
    if (cell.predict) {
      const pr = cell.predict;
      predictBox = h("div", { class: "predict" }, h("p", { class: "predict-q" }, h("span", { class: "tag" }, t(UI.yourGuess)), h("span", { html: t(pr.q) })));
      const opts = h("div", { class: "predict-opts", role: "radiogroup" });
      const predictHint = h("p", { class: "muted small" }, t(UI.predictFirst));
      t(pr.options).forEach((o, k) => {
        opts.append(h("button", { class: "opt", role: "radio", "aria-checked": "false", onclick: (e) => {
          guess = k;
          opts.querySelectorAll(".opt").forEach((x, j) => { x.classList.toggle("sel", j === k); x.setAttribute("aria-checked", j === k ? "true" : "false"); });
          runBtn.disabled = false; predictHint.hidden = true;
        } }, h("code", null, t(o))));
      });
      predictBox.append(opts, predictHint);
      predictBox._hint = predictHint;
      brief.append(predictBox);
    }
    const hints = t(cell.hints) || [];
    let hintN = 0;
    const hintsBox = h("ol", { class: "hints" });
    const fb = h("div", { class: "feedback", "aria-live": "polite" });
    brief.append(hintsBox, fb);

    // Çalışma alanı
    const edHost = h("div", { class: "editor" });
    const solBtn = cell.solution ? h("button", { class: "ed-btn", hidden: hints.length ? true : false, onclick: () => { cm.setValue(t(cell.solution)); cm.focus(); } }, t(UI.solution)) : null;
    const resetBtn = kind !== "run" ? h("button", { class: "ed-btn", title: t(UI.reset), onclick: () => { cm.setValue(starter); delete store.code[codeKey(cell)]; save(); } }, h("span", { html: ICON.reset }), t(UI.reset)) : null;
    work.append(h("div", { class: "ed-chrome" }, h("span", { class: "ed-file" }, (lang === "tr" ? "alistirma_" : "exercise_") + (i + 1) + ".py"), h("span", { class: "ed-tools" }, solBtn, resetBtn)), edHost);
    const hintBtn = hints.length ? h("button", { class: "btn ghost sm", onclick: () => {
      if (hintN < hints.length) { hintsBox.append(h("li", { html: t(hints[hintN]) })); hintN++; hintBtn.lastChild.textContent = t(UI.nextHint) + " (" + hintN + "/" + hints.length + ")"; }
      if (hintN >= hints.length) { hintBtn.hidden = true; if (solBtn) solBtn.hidden = false; }
    } }, h("span", { html: ICON.bulb }), h("span", null, t(UI.hint))) : null;
    if (cell.predict && !store.cells[cell.id]) runBtn.disabled = true;
    work.append(h("div", { class: "ex-actions" }, runBtn, hintBtn, h("span", { class: "kbd" }, h("kbd", null, "Shift"), "+", h("kbd", null, "Enter"))));
    const out = h("div", { class: "output", "aria-live": "polite" });
    work.append(out);

    const cm = window.CodeMirror(edHost, {
      value: saved != null ? saved : starter,
      mode: "python", lineNumbers: true, indentUnit: 4, tabSize: 4, viewportMargin: Infinity, lineWrapping: false,
      extraKeys: {
        "Shift-Enter": () => runCell(ctx, i), "Ctrl-Enter": () => runCell(ctx, i), "Cmd-Enter": () => runCell(ctx, i),
        Tab: (ed) => { if (ed.somethingSelected()) ed.indentSelection("add"); else ed.replaceSelection("    ", "end"); },
        "Shift-Tab": (ed) => ed.indentSelection("subtract")
      }
    });
    cm.addOverlay({ token: (stream) => { if (stream.match("___")) return "blank"; while (stream.next() != null && !stream.match("___", false)) { /* */ } return null; } });
    cm.on("change", () => { store.code[codeKey(cell)] = cm.getValue(); save(); });

    const api = {
      el, cm, cell, out, fb, runBtn, checksOk: false,
      get lineOk() { return auditApi ? auditApi.lineOk : true; },
      get guess() { return guess; },
      predictBox,
      clearOut() { out.innerHTML = ""; fb.innerHTML = ""; },
      setPassed(ok) { if (ok) { store.cells[cell.id] = true; save(); el.classList.add("passed"); status.innerHTML = ICON.key; } }
    };
    return api;
  }

  /* ---------------------------- AI sohbet kartı ---------------------------- */
  function aiCard(ai, opts) {
    opts = opts || {};
    const card = h("div", { class: "ai-card" + (opts.compact ? " compact" : "") });
    card.append(h("div", { class: "ai-label" }, h("span", { class: "ai-dot" }), opts.title || t(UI.aiLabel)));
    if (ai.prompt) card.append(h("div", { class: "msg user" }, h("span", { class: "who" }, t(UI.you)), h("div", { class: "bubble", html: t(ai.prompt) })));
    const aiMsg = h("div", { class: "msg ai" }, h("span", { class: "who" }, h("span", { class: "ai-badge", html: ICON.logo }), t(UI.aiName)));
    const body = h("div", { class: "bubble" });
    if (ai.reply) body.append(h("div", { class: "ai-text", html: t(ai.reply) }));
    const sel = new Set(opts.preset || []);
    let locked = !!opts.preset;
    if (ai.code) {
      const lines = t(ai.code).split("\n");
      const pre = h("div", { class: "ai-code" + (opts.selectable ? " selectable" : "") });
      lines.forEach((ln, i) => {
        const n = i + 1;
        const row = h(opts.selectable ? "button" : "div", { class: "ai-line" + (sel.has(n) ? " sel" + (locked ? " right" : "") : ""), type: opts.selectable ? "button" : null, "data-n": n },
          h("span", { class: "gut" }, String(n)), h("code", { html: hl(ln) || " " }));
        if (opts.selectable) row.addEventListener("click", () => { if (locked) return; if (sel.has(n)) sel.delete(n); else sel.add(n); row.classList.toggle("sel"); });
        pre.append(row);
      });
      body.append(pre);
    }
    if (ai.claim) body.append(h("div", { class: "ai-claim" }, h("strong", null, t(UI.aiClaim) + ": "), h("span", { html: t(ai.claim) })));
    aiMsg.append(body);
    card.append(aiMsg);
    card.fbEl = h("div", { class: "feedback" });
    if (opts.selectable) {
      card.append(h("div", { class: "ai-actions" }, h("span", { class: "muted small" }, t(UI.markLine)),
        h("button", { class: "btn primary sm", onclick: () => { if (!locked) opts.onCheck(Array.from(sel), card); } }, t(UI.checkMark))), card.fbEl);
    }
    card.lockRight = (lines) => { locked = true; card.querySelectorAll(".ai-line").forEach((r) => { const n = +r.dataset.n; r.classList.toggle("sel", lines.includes(n)); r.classList.toggle("right", lines.includes(n)); }); };
    return card;
  }

  /* ---------------------------- Özel alıştırmalar ---------------------------- */
  function fnv(s) {
    let x = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 0x01000193) >>> 0; }
    return ("0000000" + x.toString(16)).slice(-8);
  }
  LAB.fnv = fnv;

  function buildSpecial(ctx, cell, i) {
    const kind = cell.kind;
    const done = () => !!store.cells[cell.id];
    const el = h("article", { class: "ex ex-wide kind-" + kind + (done() ? " passed" : ""), id: "cell-" + cell.id });
    const status = h("span", { class: "ex-status", html: done() ? ICON.key : "" });
    const body = h("div", { class: "ex-body" });
    el.append(body);
    body.append(h("header", { class: "ex-head" }, h("span", { class: "ex-num" }, t(UI.exercise) + " " + (i + 1)), h("span", { class: "badge kind" }, t(UI.kind[kind])), status));
    if (cell.task) body.append(h("div", { class: "ex-task prose", html: t(cell.task) }));
    const fb = h("div", { class: "feedback", "aria-live": "polite" });
    const api = { el, cell, fb, setPassed(ok) { if (ok && !done()) { store.cells[cell.id] = true; save(); el.classList.add("passed"); status.innerHTML = ICON.key; ctx.renderDone(); } }, clearOut() {} };
    const good = (msg, extra) => { fb.innerHTML = ""; fb.append(h("div", { class: "fb good" }, msg, extra || null)); api.setPassed(true); };
    const warn = (msg) => { fb.innerHTML = ""; fb.append(h("div", { class: "fb warn" }, msg)); };

    if (kind === "compare") {
      if (cell.prompt) body.append(h("div", { class: "msg user solo" }, h("span", { class: "who" }, t(UI.you)), h("div", { class: "bubble", html: t(cell.prompt) })));
      const grid = h("div", { class: "cmp-grid" });
      let pick = done() ? cell.answer : null, reason = done() ? cell.reasonAnswer : null;
      const cards = cell.options.map((o, k) => {
        const wrap = h("div", { class: "cmp-col" + (pick === k ? " picked" : "") });
        wrap.append(aiCard(o, { compact: true, title: (k === 0 ? t(UI.answerA) : t(UI.answerB)) + " · " + t(UI.aiLabel) }));
        grid.append(wrap);
        return wrap;
      });
      body.append(grid);
      const pickRow = h("div", { class: "choice-row" }, h("strong", null, t(UI.pickBetter)));
      [t(UI.answerA), t(UI.answerB)].forEach((lab, k) => pickRow.append(h("button", { class: "opt" + (pick === k ? " sel" : ""), onclick: (e) => {
        pick = k; pickRow.querySelectorAll(".opt").forEach((b, j) => b.classList.toggle("sel", j === k)); cards.forEach((c, j) => c.classList.toggle("picked", j === k)); evaluate();
      } }, lab)));
      const reasonBox = h("div", { class: "reason-box" }, h("strong", null, t(UI.pickReason)));
      t(cell.reasons).forEach((r, k) => reasonBox.append(h("button", { class: "opt" + (reason === k ? " sel" : ""), html: r, onclick: () => {
        reason = k; reasonBox.querySelectorAll(".opt").forEach((b, j) => b.classList.toggle("sel", j === k)); evaluate();
      } })));
      body.append(pickRow, reasonBox, fb);
      function evaluate() {
        if (pick == null) return;
        if (pick !== cell.answer) { warn(t(UI.compareWrong)); return; }
        if (reason == null) { fb.innerHTML = ""; return; }
        if (reason !== cell.reasonAnswer) { warn(t(UI.reasonWrong)); return; }
        good(t(UI.pass), cell.explain ? h("p", { html: t(cell.explain) }) : null);
      }
      if (done()) evaluate();
    }

    if (kind === "prompt") {
      const weak = h("div", { class: "prompt-weak" },
        h("div", { class: "msg user solo" }, h("span", { class: "who" }, t(UI.weakPrompt)), h("div", { class: "bubble", html: t(cell.weak.prompt) })));
      if (cell.weak.code || cell.weak.reply) weak.append(aiCard({ reply: cell.weak.reply, code: cell.weak.code, claim: cell.weak.claim }, { compact: true, title: t(UI.weakResult) + " · " + t(UI.aiLabel) }));
      body.append(weak);
      const key = "prompt:" + lang + ":" + cell.id;
      const ta = h("textarea", { class: "prompt-ta", placeholder: t(UI.promptPh), rows: 6, "aria-label": t(UI.yourPrompt) });
      ta.value = store.code[key] || "";
      const list = h("ul", { class: "ck-list" });
      const manual = store.code[key + ":m"] ? JSON.parse(store.code[key + ":m"]) : {};
      const items = cell.checklist.map((c, k) => {
        const li = h("li");
        const auto = h("span", { class: "ck-auto" });
        const box = h("input", { type: "checkbox", id: "ck-" + cell.id + "-" + k, checked: !!manual[k] });
        box.addEventListener("change", () => { manual[k] = box.checked; store.code[key + ":m"] = JSON.stringify(manual); save(); refresh(); });
        li.append(h("span", { class: "ck-mark" }), h("div", null, h("strong", { html: t(c.label) }), c.why ? h("small", { html: t(c.why) }) : null,
          h("div", { class: "ck-meta" }, auto, h("label", { class: "ck-self", for: "ck-" + cell.id + "-" + k }, box, t(UI.selfTick)))));
        list.append(li);
        return { li, auto, box, re: new RegExp(t(c.re), "i") };
      });
      function refresh() {
        const v = ta.value;
        items.forEach((it, k) => {
          const hit = it.re.test(v);
          it.auto.textContent = hit ? "✓ " + t(UI.detected) : "";
          it.li.classList.toggle("ok", hit || it.box.checked);
        });
      }
      ta.addEventListener("input", () => { store.code[key] = ta.value; save(); refresh(); });
      const strong = h("div", { class: "prompt-strong", hidden: !done() },
        h("div", { class: "msg user solo" }, h("span", { class: "who" }, t(UI.strongPrompt)), h("div", { class: "bubble", html: t(cell.strong.prompt) })),
        cell.strong.code ? aiCard({ reply: cell.strong.reply, code: cell.strong.code }, { compact: true, title: t(UI.strongResult) + " · " + t(UI.aiLabel) }) : null);
      const copyB = h("button", { class: "btn ghost sm", onclick: () => { try { navigator.clipboard.writeText(ta.value).then(() => { copyB.textContent = t(UI.copied); setTimeout(() => (copyB.textContent = t(UI.copyPrompt)), 1500); }, () => {}); } catch (e) { /* */ } } }, t(UI.copyPrompt));
      body.append(h("div", { class: "prompt-grid" },
        h("div", { class: "prompt-left" }, h("label", { class: "lbl" }, t(UI.yourPrompt)), ta,
          h("div", { class: "row" }, h("button", { class: "btn primary sm", onclick: () => {
            refresh();
            if (ta.value.trim().length < (cell.minLen || 80)) { warn(t(UI.promptMin)); return; }
            if (items.some((it) => !it.li.classList.contains("ok"))) { warn(t(UI.promptMissing)); return; }
            strong.hidden = false;
            good(t(UI.promptDone), cell.after ? h("p", { html: t(cell.after) }) : null);
          } }, t(UI.checkPrompt)), copyB),
          h("p", { class: "muted small" }, t(UI.promptSelf))),
        h("div", { class: "prompt-right" }, h("label", { class: "lbl" }, t(UI.checklist)), list)), fb, strong);
      refresh();
    }

    if (kind === "interpret") {
      const sents = t(cell.sentences);
      const sel = new Set(done() ? cell.bad : []);
      const card = h("div", { class: "ai-card" }, h("div", { class: "ai-label" }, h("span", { class: "ai-dot" }), t(UI.aiLabel)));
      if (cell.prompt) card.append(h("div", { class: "msg user" }, h("span", { class: "who" }, t(UI.you)), h("div", { class: "bubble", html: t(cell.prompt) })));
      const para = h("div", { class: "bubble interp" });
      const spans = sents.map((s, k) => {
        const sp = h("button", { type: "button", class: "sent" + (sel.has(k) ? " sel" : ""), html: s });
        sp.addEventListener("click", () => { if (done()) return; if (sel.has(k)) sel.delete(k); else sel.add(k); sp.classList.toggle("sel"); });
        para.append(sp, " ");
        return sp;
      });
      card.append(h("div", { class: "msg ai" }, h("span", { class: "who" }, h("span", { class: "ai-badge", html: ICON.logo }), t(UI.aiName)), para));
      const verdicts = h("ol", { class: "verdicts" });
      body.append(card, h("div", { class: "row" }, h("span", { class: "muted small" }, t(UI.markSentences)),
        h("button", { class: "btn primary sm", onclick: check }, t(UI.checkMark))), fb, verdicts);
      function check() {
        const ok = sel.size === cell.bad.length && cell.bad.every((b) => sel.has(b));
        if (!ok) { warn(t(UI.sentWrong)); return; }
        spans.forEach((sp, k) => sp.classList.add(cell.bad.includes(k) ? "bad" : "okay"));
        verdicts.innerHTML = "";
        t(cell.explain).forEach((e, k) => verdicts.append(h("li", { class: cell.bad.includes(k) ? "bad" : "okay", html: e })));
        good(t(UI.sentRight));
      }
      if (done()) check();
    }

    if (kind === "colab") {
      const nb = t(cell.notebook);
      const url = "https://colab.research.google.com/github/" + LINKS.colabRepo + "/blob/main/notebooks/" + nb;
      body.append(h("div", { class: "colab-box" },
        h("div", { class: "colab-left" },
          h("a", { class: "btn colab", href: url, target: "_blank", rel: "noopener" }, h("span", { class: "colab-logo", "aria-hidden": "true" }, "CO"), t(UI.openColab) + " ↗"),
          h("code", { class: "nb-path" }, nb),
          h("strong", { class: "lbl" }, t(UI.colabSteps)),
          h("ol", { class: "colab-steps" }, t(cell.steps).map((s) => h("li", { html: s })))),
        h("div", { class: "colab-right" },
          h("label", { class: "lbl", for: "code-" + cell.id }, t(UI.codeLabel)),
          (function () {
            const inp = h("input", { type: "text", id: "code-" + cell.id, class: "code-in", placeholder: t(UI.codePh), autocomplete: "off", spellcheck: "false" });
            const btn = h("button", { class: "btn primary sm", onclick: () => {
              const v = inp.value.trim().toUpperCase();
              if (cell.codeHashes.includes(fnv(v))) good(t(UI.codeOk), cell.after ? h("p", { html: t(cell.after) }) : null);
              else warn(t(UI.codeBad));
            } }, t(UI.verify));
            inp.addEventListener("keydown", (e) => { if (e.key === "Enter") btn.click(); });
            return h("div", { class: "row" }, inp, btn);
          })(),
          h("p", { class: "muted small" }, t(UI.colabNote)))), fb);
      if (done()) good(t(UI.codeOk));
    }

    if (kind === "auditlog") {
      const key = "log:" + lang + ":" + cell.id;
      const saved = store.code[key] ? JSON.parse(store.code[key]) : {};
      const fields = t(cell.fields).map((f, k) => {
        const ta = h("textarea", { class: "log-ta", rows: 3, id: "log-" + cell.id + "-" + k, placeholder: f.ph || "" });
        ta.value = saved[k] || "";
        ta.addEventListener("input", () => { saved[k] = ta.value; store.code[key] = JSON.stringify(saved); save(); });
        return { f, ta };
      });
      const form = h("div", { class: "log-form" }, fields.map(({ f, ta }, k) => h("div", { class: "log-field" }, h("label", { for: "log-" + cell.id + "-" + k }, h("span", { class: "log-n" }, String(k + 1)), h("span", null, h("strong", null, f.label), f.help ? h("small", null, f.help) : null)), ta)));
      const copyB = h("button", { class: "btn ghost sm", onclick: () => {
        const txt = fields.map(({ f, ta }, k) => (k + 1) + ". " + f.label + "\n" + ta.value.trim()).join("\n\n");
        try { navigator.clipboard.writeText(txt).then(() => { copyB.textContent = t(UI.copied); setTimeout(() => (copyB.textContent = t(UI.copyAll)), 1500); }, () => {}); } catch (e) { /* */ }
      } }, t(UI.copyAll));
      body.append(form, h("div", { class: "row" }, h("button", { class: "btn primary sm", onclick: () => {
        if (fields.some(({ ta }) => ta.value.trim().length < 25)) { warn(t(UI.logShort)); return; }
        good(t(UI.logSaved), cell.after ? h("p", { html: t(cell.after) }) : null);
      } }, t(UI.logSave)), copyB), fb);
    }
    return api;
  }

  function friendlyError(err) {
    const help = ERR_HELP[err.type] || (err.type === "DataError" ? UI.dataFailed : null);
    const box = h("div", { class: "fb err" },
      h("strong", null, t(UI.errorTitle) + ": " + err.type),
      help ? h("p", null, t(help)) : null,
      err.line ? h("p", { class: "errline" }, h("span", null, t(UI.errorLine) + " " + err.line + ":"), " ", h("code", null, err.src)) : null,
      h("details", null, h("summary", null, t(UI.rawError)), h("pre", null, err.type + ": " + err.msg))
    );
    return box;
  }

  function renderResult(c, res) {
    c.out.innerHTML = "";
    c.out.append(h("div", { class: "out-head" }, t(UI.output)));
    if (res.stdout) c.out.append(h("pre", { class: "stdout" }, res.stdout.replace(/\n$/, "")));
    if (res.value) {
      if (res.value.kind === "html") c.out.append(h("div", { class: "dfwrap", html: res.value.data }));
      else c.out.append(h("pre", { class: "value" }, res.value.data));
    }
    (res.figs || []).forEach((b64) => c.out.append(h("img", { class: "fig", src: "data:image/png;base64," + b64, alt: "Matplotlib" })));
    if (!res.stdout && !res.value && !(res.figs || []).length && !res.error) c.out.append(h("p", { class: "muted small" }, t(UI.noOutput)));
  }

  async function execCell(ctx, i, opts) {
    const c = ctx.cells[i];
    const cell = c.cell;
    const code = c.cm.getValue();
    const checks = (cell.checks || []).map((ch) => t(ch.py));
    const data = (ctx.L.data || []).concat(cell.data || []);
    if (data.length) {
      try { await Py.ensureData(data); }
      catch (e) { const r = { stdout: "", value: null, figs: [], error: { type: "DataError", msg: t(UI.dataFailed) + " (" + e.message + ")" }, checks: checks.map(() => false) }; if (!opts || !opts.silent) renderResult(c, r); return r; }
    }
    const res = await Py.run(code, ctx.nsName, checks);
    if (!opts || !opts.silent) renderResult(c, res);
    return res;
  }

  async function runCell(ctx, i) {
    const c = ctx.cells[i];
    const cell = c.cell;
    if (cell.predict && c.guess == null && !store.cells[cell.id]) {
      if (c.predictBox && c.predictBox._hint) c.predictBox._hint.classList.add("shake");
      setTimeout(() => c.predictBox && c.predictBox._hint && c.predictBox._hint.classList.remove("shake"), 500);
      return;
    }
    const code = c.cm.getValue();
    c.fb.innerHTML = "";
    if (code.includes("___")) {
      c.fb.append(h("div", { class: "fb warn" }, t(UI.blanksLeft)));
      return;
    }
    if (ctx.gen !== Py.generation) { ctx.ranUpTo = -1; ctx.gen = Py.generation; }
    c.el.classList.add("running");
    c.runBtn.disabled = true;
    const runLabel = c.runBtn.querySelector(".run-label");
    if (runLabel) runLabel.textContent = t(UI.pyBusy);
    let autoRan = false;
    try {
      // Önceki hücreler bu oturumda çalışmadıysa onları da çalıştır
      if (ctx.ranUpTo < i - 1 && !cell.standalone) {   // standalone: önceki hücrelere bağlı değil / does not depend on earlier cells
        for (let k = ctx.ranUpTo + 1; k < i; k++) {
          const pc = ctx.cells[k];
          if (!pc.cm || pc.cm.getValue().includes("___")) continue;
          const pr = await execCell(ctx, k);
          giveFeedback(ctx, pc, pr, false);
          autoRan = true;
        }
      }
      const res = await execCell(ctx, i);
      ctx.ranUpTo = Math.max(ctx.ranUpTo, i);
      giveFeedback(ctx, c, res, autoRan);
    } catch (err) {
      if (err && err.timeout) {
        c.fb.append(h("div", { class: "fb err" }, t(UI.timeout)));
        ctx.ranUpTo = -1; ctx.gen = Py.generation;
      } else {
        c.fb.append(h("div", { class: "fb err" }, h("strong", null, t(UI.pyError)), h("details", null, h("summary", null, t(UI.rawError)), h("pre", null, String(err && err.message || err)))));
      }
    } finally {
      c.el.classList.remove("running");
      c.runBtn.disabled = false;
      if (runLabel) runLabel.textContent = t(UI.run);
    }
  }

  function giveFeedback(ctx, c, res, autoRan) {
    const cell = c.cell;
    c.fb.innerHTML = "";
    if (autoRan) c.fb.append(h("p", { class: "muted small" }, t(UI.autoPrev)));
    if (cell.predict && c.guess != null) {
      const ok = c.guess === cell.predict.answer;
      c.fb.append(h("div", { class: "fb " + (ok ? "good" : "info") },
        h("strong", null, ok ? t(UI.guessRight) : t(UI.guessWrong)),
        cell.predict.explain ? h("p", { html: t(cell.predict.explain) }) : null));
    }
    if (res.error) { c.fb.append(friendlyError(res.error)); return; }
    const checks = cell.checks || [];
    const failIdx = res.checks.findIndex((x) => !x);
    if (checks.length && failIdx >= 0) {
      c.fb.append(h("div", { class: "fb warn" }, h("strong", null, t(UI.notYet) + " "), h("span", { html: t(checks[failIdx].msg) })));
      return;
    }
    if (cell.kind === "audit" && !c.lineOk) {
      c.checksOk = true;
      c.fb.append(h("div", { class: "fb info" }, t(UI.lineFirst)));
      return;
    }
    c.fb.append(h("div", { class: "fb good" }, checks.length ? t(UI.pass) : t(UI.passRun),
      cell.after ? h("p", { html: t(cell.after) }) : null));
    c.setPassed(true);
    ctx.renderDone();
  }

  async function runAll(ctx, btn) {
    const lbl = btn ? btn.querySelector(".ra-label") : null;
    const n = ctx.cells.length;
    if (btn) btn.disabled = true;
    try {
      for (let i = 0; i < n; i++) {
        const c = ctx.cells[i];
        if (lbl) lbl.textContent = t(UI.runAllProg).replace("{k}", i + 1).replace("{n}", n);
        if (!c.cm) continue;
        if (c.cell.predict && c.guess == null && !store.cells[c.cell.id]) { c.el.scrollIntoView({ behavior: "smooth", block: "center" }); break; }
        if (c.cm.getValue().includes("___")) { await runCell(ctx, i); break; }
        await runCell(ctx, i);
      }
    } finally {
      if (lbl) lbl.textContent = t(UI.runAll);
      if (btn) btn.disabled = false;
      ctx.renderDone();   // toplu işlem bitince sayaçları tazele / refresh counters when the batch ends
    }
  }

  /* ---------------------------- Test ---------------------------- */
  function buildQuiz(L, onChange) {
    const wrap = h("div", { class: "quiz" });
    const state = store.quiz[L.id] = store.quiz[L.id] || {};
    L.quiz.forEach((q, qi) => {
      const box = h("div", { class: "q" + (state[qi] === true ? " solved" : "") });
      box.append(h("p", { class: "q-text" }, h("span", { class: "qn" }, String(qi + 1)), h("span", { html: t(q.q) })));
      if (q.code) box.append(h("pre", { class: "q-code" }, h("code", null, t(q.code))));   // çok satırlı kod / multi-line code
      const opts = h("div", { class: "q-opts" });
      const fb = h("div", { class: "q-fb", "aria-live": "polite" });
      t(q.options).forEach((o, k) => {
        const b = h("button", { class: "opt", onclick: () => {
          const ok = k === q.answer;
          opts.querySelectorAll(".opt").forEach((x) => x.classList.remove("right", "wrong"));
          b.classList.add(ok ? "right" : "wrong");
          fb.innerHTML = "";
          fb.append(h("p", { class: ok ? "good" : "bad" }, h("strong", null, ok ? t(UI.quizRight) : t(UI.quizWrong))));
          if (ok && q.explain) fb.append(h("p", { html: t(q.explain) }));
          if (!ok && q.hints && t(q.hints)[k]) fb.append(h("p", { class: "q-hint", html: t(q.hints)[k] }));   // seçeneğe özel ipucu / option-specific hint
          if (ok) { state[qi] = true; box.classList.add("solved"); save(); onChange(); }
        } , html: t(o) });
        if (state[qi] === true && k === q.answer) b.classList.add("right");
        opts.append(b);
      });
      if (state[qi] === true && q.explain) fb.append(h("p", { html: t(q.explain) }));
      box.append(opts, fb);
      wrap.append(box);
    });
    return wrap;
  }

  /* ------------------------------------------------------------------ */
  /* Yönlendirme / Routing                                               */
  /* ------------------------------------------------------------------ */
  let routeToken = 0;
  function route() {
    const id = (location.hash || "#home").slice(1) || "home";
    const tok = ++routeToken;
    const entry = catalogEntryFor(id);
    const lock = entry ? moduleLock(entry) : null;
    if (lock) { Bar.done(); renderLocked(entry, lock); return; }
    const ready = !entry || LAB.modules.some((m) => m.id === entry.id);
    if (ready) { Bar.done(); renderRoute(id); prefetch(); return; }
    const count = h("span", { class: "load-count" });
    const fill = h("span");
    app.innerHTML = "";
    app.append(h("main", { class: "page loading-page" },
      h("p", { class: "muted" }, t(UI.loadingModule), " ", count),
      h("div", { class: "load-track", role: "progressbar", "aria-label": t(UI.loadingModule) }, fill)));
    Bar.show(0.05);
    loadModule(entry.id, (k, n) => {
      if (tok !== routeToken) return;
      const f = k / n; Bar.show(f); fill.style.width = Math.round(100 * f) + "%"; count.textContent = k + " / " + n;
    }).then(() => {
      Bar.done();
      if (tok === routeToken) renderRoute(id);
    }, () => {
      Bar.done();
      if (tok !== routeToken) return;
      app.innerHTML = "";
      app.append(h("main", { class: "page loading-page" }, h("p", null, t(UI.loadFailed)), h("button", { class: "btn", onclick: route }, t(UI.retry))));
    });
  }
  /* Ana sayfa açıldıktan sonra, sıradaki modülü boşta arka planda indir / prefetch the next module when idle */
  let prefetched = false;
  function prefetch() {
    if (prefetched || current.kind !== "home") return;
    prefetched = true;
    const nx = overallNext(), e = catalogEntryFor(nx.id) || LAB.catalog[0];
    if (!e) return;
    const go = () => loadModule(e.id).catch(() => {});
    if ("requestIdleCallback" in window) requestIdleCallback(go, { timeout: 4000 }); else setTimeout(go, 1500);
  }
  /* "Modül 2'nin / 2'ye / 2'yi" gibi Türkçe ekler için / Turkish suffixes after module numbers */
  const NUM_SUFFIX = { gen: ["'ın", "'in", "'nin", "'ün", "'ün", "'in", "'nın", "'nin", "'in", "'un"], dat: ["'a", "'e", "'ye", "'e", "'e", "'e", "'ya", "'ye", "'e", "'a"], acc: ["'ı", "'i", "'yi", "'ü", "'ü", "'i", "'yı", "'yi", "'i", "'u"] };
  function fillP(str, n) {
    const d = Number(String(n).slice(-1));
    return str.replace("{pGen}", n + NUM_SUFFIX.gen[d]).replace("{pDat}", n + NUM_SUFFIX.dat[d]).replace("{pAcc}", n + NUM_SUFFIX.acc[d]).replace("{p}", n);
  }
  function renderLocked(c, lk) {
    app.innerHTML = "";
    closeNav();
    current = { kind: "locked" };
    document.title = t(c.title) + " · " + t(UI.appName);
    renderTopbar([{ label: t(UI.appName), href: "#home" }, { label: t(UI.module) + " " + c.num }]);
    const P = lk.prev.num;
    const done = lk.req.length - lk.missing.length;
    const target = lk.chain ? overallNext().id : (lk.missing[0] || lk.prev.id);
    const wrap = h("main", { class: "page module locked-page" });
    wrap.append(h("header", { class: "page-head" }, h("div", null,
      h("p", { class: "eyebrow" }, t(UI.module) + " " + c.num),
      h("h1", null, t(c.title)),
      h("p", { class: "lead" }, t(c.summary)))));
    const card = h("section", { class: "lock-card" },
      h("span", { class: "lock-ic", html: ICON.lock.replace(/width="14" height="14"/, 'width="26" height="26"') }),
      h("div", { class: "lock-body" },
        h("h2", null, t(UI.lockTitle)),
        h("p", null, lk.chain ? fillP(t(UI.lockChain), P) : fillP(t(UI.lockText), P)),
        lk.chain ? null : h("div", { class: "lock-prog" },
          h("div", { class: "mc-bar" }, h("span", { style: "width:" + Math.round(100 * done / lk.req.length) + "%" })),
          h("small", null, t(UI.lockProgress).replace("{d}", done).replace("{n}", lk.req.length))),
        lk.chain || !lk.missing.length ? null : h("div", { class: "lock-missing" },
          h("span", null, t(UI.lockMissing)),
          lk.missing.map((id) => h("a", { class: "chip", href: "#" + id }, t(UI.lockUnit) + " " + id.split("-u")[1]))),
        h("div", { class: "lock-actions" }, h("a", { class: "btn primary", href: "#" + target }, fillP(t(UI.lockGo), lk.chain ? overallNext().id.split("-")[0].slice(1) : P) + " →")),
        h("p", { class: "lock-note" }, t(UI.lockNote))));
    wrap.append(card);
    if (c.topics) wrap.append(h("section", { class: "lock-coming" }, h("h3", null, t(UI.lockComing)), h("ul", { class: "mc-topics" }, t(c.topics).map((x) => h("li", null, x)))));
    app.append(wrap);
    renderSidebar();
    window.scrollTo(0, 0);
  }
  function renderRoute(id) {
    app.innerHTML = "";
    closeNav();
    let view;
    const mod = LAB.modules.find((m) => m.id === id);
    const found = findLesson(id);
    if (mod) view = viewModule(mod);
    else if (found) view = viewLesson(found);
    else view = viewHome();
    app.append(view);
    renderSidebar();
    if (current.kind === "lesson") requestAnimationFrame(() => document.querySelectorAll(".CodeMirror").forEach((x) => x.CodeMirror && x.CodeMirror.refresh()));
    const anchor = id === "about" || id === "modules" ? document.getElementById(id) : null;
    if (anchor) requestAnimationFrame(() => anchor.scrollIntoView({ block: "start" }));
    else window.scrollTo(0, 0);
  }

  LAB.rerender = route;
  LAB.h = h;
  LAB.catalogProgress = catalogProgress;
  window.addEventListener("hashchange", route);
  document.addEventListener("DOMContentLoaded", () => {
    document.documentElement.lang = lang;
    document.getElementById("scrim").addEventListener("click", closeNav);
    route();
    const boot = document.getElementById("bootbar"); if (boot) boot.remove();
    const setTop = () => document.documentElement.style.setProperty("--top-h", headerEl.offsetHeight + "px");
    setTop();
    try { new ResizeObserver(setTop).observe(headerEl); } catch (e) { window.addEventListener("resize", setTop); }
  });
})();
