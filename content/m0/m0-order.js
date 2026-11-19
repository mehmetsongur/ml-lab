/* Modül 0 — ünite sırası, bölümler ve modül tanıtımı
 * Yeni üniteler (window.M0_AI) öğrenme yolunun başına; eski 14 ders "Ek: Python pratiği" bölümüne.
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 */
(function () {
  "use strict";
  const m = window.LAB.modules.find((x) => x.id === "m0");
  if (!m) return;
  const units = window.M0_AI || [];
  const practice = m.lessons.slice();
  m.lessons = units.concat(practice);
  m.title = { tr: "YZ ile Ekonomik Analize Giriş", en: "Introduction to Economic Analysis with AI" };
  m.summary = {
    tr: "YZ'ye kod yazdırmayı, yazdığını denetlemeyi ve sonucu iktisatçı gözüyle yorumlamayı öğren. Kodlama geçmişi gerekmez; isteğe bağlı Python pratiği bölümü de var.",
    en: "Learn to have AI write code, audit what it wrote and interpret the result as an economist. No coding background needed; an optional Python practice section is included."
  };
  m.intro = {
    tr: "<p>Bu modülde kodun çoğunu sen yazmayacaksın. YZ'ye ne istediğini doğru anlatmayı, ürettiği kodu okuyup denetlemeyi, hatalarını bulup düzeltmeyi ve sonucu sorumlu bir biçimde yorumlamayı öğreneceksin. Kısa denetleme alıştırmaları tarayıcıda çalışır; gerçek veriyle YZ destekli atölyeler Google Colab ve Gemini ile yapılır.</p><p>Alıştırma türleri: <b>YZ kodunu denetle</b>, <b>İki yanıtı karşılaştır</b>, <b>İsteği güçlendir</b>, <b>Kontrol yaz</b>, <b>Yorumu denetle</b>, <b>Colab + Gemini görevi</b> ve <b>Denetim defteri</b>.</p>",
    en: "<p>In this module you will not write most of the code yourself. You will learn to tell the AI clearly what you want, read and audit the code it produces, find and fix its mistakes, and interpret the result responsibly. Short audit exercises run in your browser; AI-assisted workshops with real data use Google Colab and Gemini.</p><p>Exercise types: <b>Audit the AI's code</b>, <b>Compare two answers</b>, <b>Strengthen the prompt</b>, <b>Write a check</b>, <b>Audit the interpretation</b>, <b>Colab + Gemini task</b> and <b>Audit log</b>.</p>"
  };
  const ids = (arr) => arr.map((u) => u.id);
  const S = (a, b) => units.slice(a, b);
  m.sections = [
    { title: { tr: "YZ ile tanışma", en: "Meeting the AI" }, ids: ids(S(0, 1)) },
    { title: { tr: "Kod okuryazarlığı", en: "Code literacy" }, ids: ids(S(1, 3)) },
    { title: { tr: "Tarif ve denetim", en: "Specify and audit" }, ids: ids(S(3, 8)) },
    { title: { tr: "Uygulama", en: "Practice" }, ids: ids(S(8, 10)) },
    { title: { tr: "Ek: Python pratiği (isteğe bağlı)", en: "Appendix: Python practice (optional)" }, ids: ids(practice) }
  ].filter((s) => s.ids.length);
  m.required = ids(units);
  /* İlk ünitenin başında Python önerisi / Python tip at the top of the first unit */
  if (units.length && practice.length) {
    m.unitNotice = {
      key: "m0-python-tip",
      ids: [units[0].id],
      target: practice[0].id,
      title: { tr: "Python'a yeni misin?", en: "New to Python?" },
      text: {
        tr: "Bu modülde kodu YZ yazıyor, sen okuyup denetliyorsun. Kodu rahat okuyabilmek için Python'la daha önce hiç çalışmadıysan, önce modülün sonundaki <b>Ek: Python pratiği</b> bölümünü (" + practice.length + " kısa ders) bitirmeni öneririm. Zorunlu değil: istersen buradan devam edip takıldığında Ek'e dönebilirsin.",
        en: "In this module the AI writes the code and you read and audit it. If you have never worked with Python, I recommend finishing the <b>Appendix: Python practice</b> section at the end of the module first (" + practice.length + " short lessons) so you can read code comfortably. It is optional: you can also continue here and return to the appendix when you get stuck."
      },
      go: { tr: "Ek: Python pratiğine git", en: "Go to Python practice" },
      dismiss: { tr: "Anladım, devam et", en: "Got it, continue" }
    };
  }
})();
