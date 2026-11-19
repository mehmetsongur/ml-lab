/* Zengin kavram anlatımı bileşenleri (Modül 0 ve 1; Modül 2 kendi kopyasını kullanır).
 * © 2026 Prof. Dr. Mehmet Songur — PolyForm Strict 1.0.0 (LICENSE-CODE.md)
 */
(function () {
  "use strict";
  const COURSE = {
    1: { video: "https://youtu.be/NK_xTGsUph8", slides: "https://www.songurmehmet.com/assets/dersler/ml/Hafta01_Slaytlar.pdf", nb: "https://colab.research.google.com/github/mehmetsongur/Machine-Learning-in-Economics-and-Finance/blob/main/code/Hafta01_Katsayi_ve_Ongoru.ipynb" },
    2: { video: "https://www.youtube.com/watch?v=epkgrEX1N7Q", slides: "https://www.songurmehmet.com/assets/dersler/ml/Hafta02_Slaytlar.pdf", nb: "https://colab.research.google.com/github/mehmetsongur/Machine-Learning-in-Economics-and-Finance/blob/main/code/Hafta02_Veri_Hazirlama.ipynb" },
    4: { video: "https://youtu.be/ikeSm14HldU", slides: "https://www.songurmehmet.com/assets/dersler/ml/Hafta04_Slaytlar.pdf", nb: "https://colab.research.google.com/github/mehmetsongur/Machine-Learning-in-Economics-and-Finance/blob/main/code/Hafta04_Ridge_ve_Lasso.ipynb" },
    3: { video: "https://youtu.be/TzWIzMklU9Q", slides: "https://www.songurmehmet.com/assets/dersler/ml/Hafta03_Slaytlar.pdf", nb: "https://colab.research.google.com/github/mehmetsongur/Machine-Learning-in-Economics-and-Finance/blob/main/code/Hafta03_Model_Basarisi.ipynb" },
    5: { video: "https://youtu.be/I_KFG54WLYQ", slides: "https://www.songurmehmet.com/assets/dersler/ml/Hafta05_Slaytlar.pdf", nb: "https://colab.research.google.com/github/mehmetsongur/Machine-Learning-in-Economics-and-Finance/blob/main/code/Hafta05_Siniflandirma.ipynb" },
    6: { video: "https://youtu.be/vVVAFPZKVwg", slides: "https://www.songurmehmet.com/assets/dersler/ml/Hafta06_Slaytlar.pdf", nb: "https://colab.research.google.com/github/mehmetsongur/Machine-Learning-in-Economics-and-Finance/blob/main/code/Hafta06_Agaclar_ve_SHAP.ipynb" }
  };
  const K = (window.CK = {});
  K.nf = (x, d, lang) => {
    const s = Number(x).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
    return lang === "tr" ? s.replace(/,/g, "X").replace(/\./g, ",").replace(/X/g, ".") : s;
  };
  K.fig = (F, name, lang, cap) => `<figure class="c-fig">${(F[name] || {})[lang] || ""}<figcaption>${cap}</figcaption></figure>`;
  K.sec = (n, c, title, body) => `<section class="c-sec c${c}"><h3><span class="c-n">${n}</span>${title}</h3>${body}</section>`;
  K.cards = (items) => `<div class="c-cards">${items.map(([c, ic, t, p, f]) => `<div class="c-card c${c}">${ic ? `<span class="c-ic">${ic}</span>` : ""}<b>${t}</b><p>${p}</p>${f ? `<span class="c-f">${f}</span>` : ""}</div>`).join("")}</div>`;
  K.pit = (items) => `<div class="c-pit">${items.map(([x, p, ok]) => `<div><span class="x">✗ ${x}</span><p>${p}</p><span class="ok">✓ ${ok}</span></div>`).join("")}</div>`;
  K.sum = (t, items) => `<div class="c-sum"><b>${t}</b><ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul></div>`;
  K.analogy = (big, p) => `<div class="c-analogy"><span class="big">${big}</span><p>${p}</p></div>`;
  K.formula = (eq, defs) => `<div class="c-formula"><div class="eq">${eq}</div>${defs && defs.length ? `<dl>${defs.map(([t, d]) => `<dt>${t}</dt><dd>${d}</dd>`).join("")}</dl>` : ""}</div>`;
  K.steps = (items) => `<ol class="c-steps">${items.map((s) => `<li><p>${s}</p></li>`).join("")}</ol>`;
  K.table = (head, rows, opts) => {
    const o = opts || {}, num = o.num || [];
    const th = head.map((h, j) => `<th${num.includes(j) ? ' class="n"' : ""}>${h}</th>`).join("");
    const tr = rows.map((r) => {
      const cls = r.cls ? ` class="${r.cls}"` : "";
      const cells = (r.cells || r).map((c, j) => `<td${num.includes(j) ? ' class="n"' : ""}>${c}</td>`).join("");
      return `<tr${cls}>${cells}</tr>`;
    }).join("");
    return `<table class="c-table"><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table>`;
  };
  K.code = (s, cls) => `<pre class="c-code${cls ? " " + cls : ""}"><code>${s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`;
  K.vs = (badT, bad, goodT, good) => `<div class="c-vs"><div class="bad"><b>✗ ${badT}</b>${bad}</div><div class="good"><b>✓ ${goodT}</b>${good}</div></div>`;
  K.link = (lang, week, part) => {
    const c = COURSE[week];
    if (!c) return "";
    return lang === "tr"
      ? `<div class="c-link"><strong>Derste:</strong> ${week}. hafta${part ? " · " + part : ""}<a href="${c.video}" target="_blank" rel="noopener">▶ Video</a><a href="${c.slides}" target="_blank" rel="noopener">Slaytlar (PDF)</a><a href="${c.nb}" target="_blank" rel="noopener">Colab notebook</a></div>`
      : `<div class="c-link"><strong>In the course:</strong> week ${week}${part ? " · " + part : ""}<a href="${c.video}" target="_blank" rel="noopener">▶ Video (Turkish)</a><a href="${c.slides}" target="_blank" rel="noopener">Slides (PDF, Turkish)</a><a href="${c.nb}" target="_blank" rel="noopener">Colab notebook</a></div>`;
  };
  K.wrap = (s) => `<div class="c-rich">${s}</div>`;
  /** units: dizi; C: {id: {tr, en}}; extra: dakika artışı */
  K.apply = (units, C, extra) => {
    (units || []).forEach((u) => { if (C[u.id]) { u.concept = C[u.id]; u.minutes = (u.minutes || 15) + (extra || 0); } });
  };
  /** Atölye üniteleri: mevcut metnin başına bir akış şeması ekler */
  K.prepend = (units, id, F, name, cap) => {
    const u = (units || []).find((x) => x.id === id);
    if (!u) return;
    const old = u.concept;
    u.concept = {
      tr: K.wrap(`${K.fig(F, name, "tr", cap.tr)}<div class="prose">${old.tr}</div>`),
      en: K.wrap(`${K.fig(F, name, "en", cap.en)}<div class="prose">${old.en}</div>`)
    };
  };
})();
