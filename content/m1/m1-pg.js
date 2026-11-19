/* Modül 1 — oyun alanları: sınıflandırma kartları, katsayı/öngörü simülasyonu,
 * aykırı değer, eksik veri, ölçekleme ve kukla değişken görselleri.
 * © 2026 Prof. Dr. Mehmet Songur — PolyForm Strict 1.0.0 (LICENSE-CODE.md)
 */
(function () {
  "use strict";
  const LAB = window.LAB;
  const P = LAB.playgrounds;
  const SVG = "http://www.w3.org/2000/svg";
  function svg(tag, attrs, parent) {
    const el = document.createElementNS(SVG, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(el);
    return el;
  }
  function tile(h, k, v, cls) { return h("div", { class: "tile" + (cls ? " " + cls : "") }, h("small", null, k), h("b", null, String(v))); }
  function fmt(x, d, lang) {
    const s = Number(x).toFixed(d);
    return lang === "tr" ? s.replace(".", ",") : s;
  }
  function fmtInt(x, lang) {
    return Math.round(x).toLocaleString(lang === "tr" ? "tr-TR" : "en-US");
  }
  function slider(h, min, max, step, val, on) {
    const el = h("input", { type: "range", min, max, step, value: val });
    el.addEventListener("input", (e) => on(+e.target.value));
    return el;
  }

  /* =====================================================================
   * sorter — her kartı doğru kutuya yerleştir
   * cfg: { cats: [{id, label}], items: [{text, cat, why}] }
   * ===================================================================== */
  P.sorter = function (host, cfg, ctx) {
    const { h, t } = ctx;
    const picks = {};
    const score = h("div", { class: "sorter-score" });
    const list = h("div", { class: "sorter" });
    function render() {
      list.innerHTML = "";
      let right = 0, answered = 0;
      cfg.items.forEach((it, i) => {
        const p = picks[i];
        const ok = p === it.cat;
        if (p != null) { answered++; if (ok) right++; }
        const row = h("div", { class: "sorter-row" + (p == null ? "" : ok ? " ok" : " bad") },
          h("p", { class: "sorter-text" }, t(it.text)),
          h("div", { class: "sorter-btns" }, cfg.cats.map((c) =>
            h("button", { class: "chip" + (p === c.id ? " on" : ""), onclick: () => { picks[i] = c.id; ctx.touch(); render(); } }, t(c.label)))),
          p == null ? null : h("p", { class: "sorter-why", html: (ok ? "✓ " : "✗ ") + t(it.why) }));
        list.append(row);
      });
      score.textContent = t({ tr: "Doğru: ", en: "Correct: " }) + right + " / " + cfg.items.length + (answered < cfg.items.length ? t({ tr: "  ·  yanıtlanan: ", en: "  ·  answered: " }) + answered : "");
    }
    host.append(score, list);
    render();
  };

  /* =====================================================================
   * collinear — birbirine çok benzeyen iki açıklayıcı değişken:
   * katsayılar örneklemden örnekleme oynar, öngörü istikrarlı kalır.
   * ===================================================================== */
  P.collinear = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    let rho = 0.97, seed = 1;
    const N = 50, R = 200, SIG = 1;
    function rng(s) { let x = s >>> 0; return () => { x = (x + 0x6D2B79F5) >>> 0; let z = x; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; }; }
    function normal(u) { let a = 0, b = 0; while (a === 0) a = u(); b = u(); return Math.sqrt(-2 * Math.log(a)) * Math.cos(2 * Math.PI * b); }
    function sim() {
      const u = rng(seed * 7919 + Math.round(rho * 1000));
      const b1s = [], b2s = [], yh = [];
      for (let r = 0; r < R; r++) {
        let s11 = 0, s12 = 0, s22 = 0, s1y = 0, s2y = 0;
        for (let i = 0; i < N; i++) {
          const z1 = normal(u), z2 = normal(u);
          const x1 = z1, x2 = rho * z1 + Math.sqrt(1 - rho * rho) * z2;
          const y = x1 + x2 + SIG * normal(u);
          s11 += x1 * x1; s12 += x1 * x2; s22 += x2 * x2; s1y += x1 * y; s2y += x2 * y;
        }
        const det = s11 * s22 - s12 * s12;
        const b1 = (s22 * s1y - s12 * s2y) / det, b2 = (s11 * s2y - s12 * s1y) / det;
        b1s.push(b1); b2s.push(b2); yh.push(b1 * 1 + b2 * 1);
      }
      return { b1s, b2s, yh };
    }
    const sd = (a) => { const m = a.reduce((x, y) => x + y, 0) / a.length; return Math.sqrt(a.reduce((x, y) => x + (y - m) * (y - m), 0) / (a.length - 1)); };
    const corr = (a, b) => { const ma = a.reduce((x, y) => x + y, 0) / a.length, mb = b.reduce((x, y) => x + y, 0) / b.length; let sab = 0, saa = 0, sbb = 0; for (let i = 0; i < a.length; i++) { sab += (a[i] - ma) * (b[i] - mb); saa += (a[i] - ma) ** 2; sbb += (b[i] - mb) ** 2; } return sab / Math.sqrt(saa * sbb); };
    const rhoLab = h("b");
    const ctrls = h("div", { class: "pg-ctrls" },
      h("label", null, h("span", null, t({ tr: "İki değişken arasındaki korelasyon = ", en: "Correlation between the two variables = " }), rhoLab),
        slider(h, 0, 0.99, 0.01, rho, (v) => { rho = v; ctx.touch(); draw(); })),
      h("button", { class: "btn sm", onclick: () => { seed++; ctx.touch(); draw(); } }, t({ tr: "Yeni 200 örneklem çek", en: "Draw 200 new samples" })));
    const tiles = h("div", { class: "tiles" });
    const W = 560, H = 230;
    const chart = svg("svg", { viewBox: "0 0 " + W + " " + H, class: "pg-svg", role: "img" });
    const note = h("p", { class: "pg-note" });
    function draw() {
      rhoLab.textContent = fmt(rho, 2, lang);
      const { b1s, b2s, yh } = sim();
      tiles.innerHTML = "";
      tiles.append(
        tile(h, t({ tr: "β̂₁'in standart sapması", en: "Std. dev. of β̂₁" }), fmt(sd(b1s), 2, lang)),
        tile(h, t({ tr: "ŷ'nin standart sapması", en: "Std. dev. of ŷ" }), fmt(sd(yh), 2, lang)),
        tile(h, t({ tr: "β̂₁ ile β̂₂ korelasyonu", en: "Correlation of β̂₁ and β̂₂" }), fmt(corr(b1s, b2s), 2, lang)));
      while (chart.firstChild) chart.removeChild(chart.firstChild);
      // sol: (b1, b2) bulutu; sağ: ŷ şeridi
      const L = { x: 40, y: 15, w: 230, h: 190 }, Rr = { x: 330, y: 15, w: 210, h: 190 };
      const lo = -1.5, hi = 3.5;
      const sx = (v) => L.x + (Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo) * L.w;
      const sy = (v) => L.y + L.h - (Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo) * L.h;
      svg("rect", { x: L.x, y: L.y, width: L.w, height: L.h, class: "pg-frame" }, chart);
      svg("line", { x1: sx(1), x2: sx(1), y1: L.y, y2: L.y + L.h, class: "pg-ref" }, chart);
      svg("line", { x1: L.x, x2: L.x + L.w, y1: sy(1), y2: sy(1), class: "pg-ref" }, chart);
      b1s.forEach((b, i) => svg("circle", { cx: sx(b), cy: sy(b2s[i]), r: 2.4, class: "pg-dot" }, chart));
      svg("text", { x: L.x + L.w / 2, y: H - 4, "text-anchor": "middle", class: "pg-lbl" }, chart).textContent = "β̂₁";
      svg("text", { x: 12, y: L.y + L.h / 2, "text-anchor": "middle", class: "pg-lbl", transform: "rotate(-90 12 " + (L.y + L.h / 2) + ")" }, chart).textContent = "β̂₂";
      const yl = 0, yhh = 4;
      const ry = (v) => Rr.y + Rr.h - (Math.min(yhh, Math.max(yl, v)) - yl) / (yhh - yl) * Rr.h;
      svg("rect", { x: Rr.x, y: Rr.y, width: Rr.w, height: Rr.h, class: "pg-frame" }, chart);
      svg("line", { x1: Rr.x, x2: Rr.x + Rr.w, y1: ry(2), y2: ry(2), class: "pg-ref" }, chart);
      const u = rng(99);
      yh.forEach((v) => svg("circle", { cx: Rr.x + 20 + u() * (Rr.w - 40), cy: ry(v), r: 2.4, class: "pg-dot alt" }, chart));
      svg("text", { x: Rr.x + Rr.w / 2, y: H - 4, "text-anchor": "middle", class: "pg-lbl" }, chart).textContent = t({ tr: "ŷ (x₁ = 1, x₂ = 1 için öngörü)", en: "ŷ (prediction at x₁ = 1, x₂ = 1)" });
      note.textContent = t({ tr: "Gerçek değerler: β₁ = β₂ = 1, gerçek ortalama sonuç = 2 (kesikli çizgiler). Her nokta 50 gözlemlik bir örneklemden.", en: "True values: β₁ = β₂ = 1, true mean outcome = 2 (dashed lines). Each dot is one sample of 50 observations." });
    }
    host.append(ctrls, tiles, chart, note);
    draw();
  };

  /* =====================================================================
   * outlierView — tek bir aykırı değer ortalamayı ve medyanı nasıl etkiler?
   * cfg: { values: [...], outlierIndex, unit: {tr,en} }
   * ===================================================================== */
  P.outlierView = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    let include = true, outVal = cfg.values[cfg.outlierIndex];
    const base = cfg.values.slice();
    const tiles = h("div", { class: "tiles" });
    const W = 560, H = 110;
    const chart = svg("svg", { viewBox: "0 0 " + W + " " + H, class: "pg-svg", role: "img" });
    const valLab = h("b");
    const ctrls = h("div", { class: "pg-ctrls" },
      h("label", { class: "pg-check" }, (function () { const c = h("input", { type: "checkbox", checked: true }); c.addEventListener("change", () => { include = c.checked; ctx.touch(); draw(); }); return c; })(),
        h("span", null, t({ tr: "Olağandışı gözlemi dahil et", en: "Include the unusual observation" }))),
      h("label", null, h("span", null, t({ tr: "Olağandışı değer = ", en: "Unusual value = " }), valLab),
        slider(h, 7000, 60000, 1000, outVal, (v) => { outVal = v; ctx.touch(); draw(); })));
    function draw() {
      valLab.textContent = fmtInt(outVal, lang);
      const vals = base.map((v, i) => (i === cfg.outlierIndex ? outVal : v)).filter((v, i) => include || i !== cfg.outlierIndex);
      const s = vals.slice().sort((a, b) => a - b);
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      const med = s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
      tiles.innerHTML = "";
      tiles.append(tile(h, t({ tr: "Gözlem", en: "Observations" }), vals.length),
        tile(h, t({ tr: "Ortalama", en: "Mean" }), fmtInt(mean, lang)),
        tile(h, t({ tr: "Medyan", en: "Median" }), fmtInt(med, lang)));
      while (chart.firstChild) chart.removeChild(chart.firstChild);
      const x0 = 30, x1 = W - 30, lo = 0, hi = 62000;
      const sx = (v) => x0 + (v - lo) / (hi - lo) * (x1 - x0);
      svg("line", { x1: x0, x2: x1, y1: 70, y2: 70, class: "pg-axis" }, chart);
      [0, 20000, 40000, 60000].forEach((v) => { svg("text", { x: sx(v), y: 92, "text-anchor": "middle", class: "pg-lbl" }, chart).textContent = fmtInt(v, lang); });
      vals.forEach((v) => svg("circle", { cx: sx(v), cy: 58, r: 5, class: "pg-dot" + (v === outVal && include ? " hot" : "") }, chart));
      svg("line", { x1: sx(mean), x2: sx(mean), y1: 20, y2: 70, class: "pg-mark mean" }, chart);
      svg("text", { x: sx(mean) + (med <= mean ? 4 : -4), y: 18, "text-anchor": med <= mean ? "start" : "end", class: "pg-lbl" }, chart).textContent = t({ tr: "ortalama", en: "mean" });
      svg("line", { x1: sx(med), x2: sx(med), y1: 20, y2: 70, class: "pg-mark med" }, chart);
      const left = med <= mean;
      svg("text", { x: sx(med) + (left ? -4 : 4), y: 18, "text-anchor": left ? "end" : "start", class: "pg-lbl" }, chart).textContent = t({ tr: "medyan", en: "median" });
    }
    host.append(ctrls, tiles, chart);
    draw();
  };

  /* =====================================================================
   * missingFill — eksik gelir için dört strateji
   * cfg: { rows: [{income, y}], labels }
   * ===================================================================== */
  P.missingFill = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    const rows = cfg.rows;
    let mode = 0;
    const modes = [
      { tr: "Satırları sil", en: "Drop the rows" },
      { tr: "Ortalamayla doldur", en: "Fill with the mean" },
      { tr: "Medyanla doldur", en: "Fill with the median" },
      { tr: "Medyan + “eksikti” göstergesi", en: "Median + “was missing” flag" }
    ];
    const obs = rows.filter((r) => r.income != null).map((r) => r.income);
    const mean = obs.reduce((a, b) => a + b, 0) / obs.length;
    const s = obs.slice().sort((a, b) => a - b);
    const med = s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
    const tabs = h("div", { class: "tabs" });
    const tbl = h("div", { class: "pg-tablewrap" });
    const tiles = h("div", { class: "tiles" });
    const note = h("p", { class: "pg-note" });
    function render() {
      tabs.innerHTML = "";
      modes.forEach((m, i) => tabs.append(h("button", { class: i === mode ? "on" : "", onclick: () => { mode = i; ctx.touch(); render(); } }, t(m))));
      const out = rows.map((r) => ({ income: r.income, y: r.y, miss: r.income == null }))
        .filter((r) => mode !== 0 || !r.miss)
        .map((r) => (r.miss ? Object.assign({}, r, { income: mode === 1 ? mean : med }) : r));
      const head = [t(cfg.labels.income)].concat(mode === 3 ? [t(cfg.labels.flag)] : []).concat([t(cfg.labels.y)]);
      const table = h("table", { class: "pg-table" },
        h("thead", null, h("tr", null, head.map((x) => h("th", null, x)))),
        h("tbody", null, out.map((r) => h("tr", { class: r.miss ? "filled" : "" },
          [h("td", null, fmtInt(r.income, lang))].concat(mode === 3 ? [h("td", null, r.miss ? "1" : "0")] : []).concat([h("td", null, String(r.y))])))));
      tbl.innerHTML = ""; tbl.append(table);
      const n = out.length, rate = out.reduce((a, r) => a + r.y, 0) / n;
      tiles.innerHTML = "";
      tiles.append(tile(h, t({ tr: "Kalan gözlem", en: "Rows kept" }), n),
        tile(h, t({ tr: "Ortalama gelir", en: "Mean income" }), fmtInt(out.reduce((a, r) => a + r.income, 0) / n, lang)),
        tile(h, t({ tr: "Temerrüt oranı", en: "Default rate" }), fmt(rate * 100, 0, lang) + "%"));
      note.innerHTML = t([
        { tr: "İki satır gitti ve ikisi de temerrüde düşen müşterilerdi: temerrüt oranı olduğundan düşük görünüyor.", en: "Two rows are gone, and both were customers who defaulted: the default rate now looks lower than it is." },
        { tr: "Ortalama, gelirin uç değerlerine duyarlıdır. Doldurulan satırlar sarıyla işaretli.", en: "The mean is sensitive to extreme incomes. Filled rows are highlighted." },
        { tr: "Medyan uç değerlere daha az duyarlıdır. Ama doldurduktan sonra hangi gelirin gerçek, hangisinin tahmin olduğu kayboldu.", en: "The median is less sensitive to extremes. But after filling, you can no longer tell real incomes from filled ones." },
        { tr: "Gösterge sütunu “gelirini bildirmedi” bilgisini saklar. Bu tabloda gelirini bildirmeyen iki müşterinin ikisi de temerrüde düşmüş: eksiklik kendi başına bilgi taşıyor olabilir.", en: "The flag keeps the information “did not report income”. In this table both customers who did not report income defaulted: missingness itself may carry information." }
      ][mode]);
    }
    host.append(tabs, tiles, tbl, note);
    render();
  };

  /* =====================================================================
   * scaleDist — A kime benziyor? Ham birimler ve standartlaştırma
   * cfg: { people: [{name, age, income}], ref: {ageMean, ageSd, incMean, incSd} }
   * ===================================================================== */
  P.scaleDist = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    let mode = 0, unit = 1;
    const P0 = cfg.people, R = cfg.ref;
    const tabs = h("div", { class: "tabs" });
    const unitWrap = h("div", { class: "pg-ctrls" });
    const tiles = h("div", { class: "tiles" });
    const tbl = h("div", { class: "pg-tablewrap" });
    const note = h("p", { class: "pg-note" });
    function coords(p) {
      if (mode === 0) return [p.age, p.income / unit];
      return [(p.age - R.ageMean) / R.ageSd, (p.income - R.incMean) / R.incSd];
    }
    const dist = (a, b) => { const x = coords(a), y = coords(b); return Math.hypot(x[0] - y[0], x[1] - y[1]); };
    function render() {
      tabs.innerHTML = "";
      [{ tr: "Ham birimler", en: "Raw units" }, { tr: "Standartlaştırılmış (z-puanı)", en: "Standardised (z-score)" }].forEach((m, i) =>
        tabs.append(h("button", { class: i === mode ? "on" : "", onclick: () => { mode = i; ctx.touch(); render(); } }, t(m))));
      unitWrap.innerHTML = "";
      if (mode === 0) {
        unitWrap.append(h("label", null, h("span", null, t({ tr: "Geliri hangi birimle yazalım?", en: "Which unit for income?" })),
          h("select", { onchange: (e) => { unit = +e.target.value; ctx.touch(); render(); } },
            [[1, { tr: "TL", en: "currency units" }], [1000, { tr: "bin TL", en: "thousands" }]].map(([v, l]) => h("option", { value: v, selected: v === unit }, t(l))))));
      }
      const [A, B, C] = P0;
      const dAB = dist(A, B), dAC = dist(A, C);
      tiles.innerHTML = "";
      tiles.append(tile(h, t({ tr: "A–B uzaklığı", en: "Distance A–B" }), fmt(dAB, 2, lang), dAB < dAC ? "win" : ""),
        tile(h, t({ tr: "A–C uzaklığı", en: "Distance A–C" }), fmt(dAC, 2, lang), dAC < dAB ? "win" : ""),
        tile(h, t({ tr: "A'ya en yakın", en: "Closest to A" }), dAB < dAC ? "B" : "C"));
      const head = [t({ tr: "Kişi", en: "Person" }), t({ tr: "Yaş", en: "Age" }), t({ tr: "Gelir", en: "Income" })];
      tbl.innerHTML = "";
      tbl.append(h("table", { class: "pg-table" }, h("thead", null, h("tr", null, head.map((x) => h("th", null, x)))),
        h("tbody", null, P0.map((p) => { const c = coords(p); return h("tr", null, h("td", null, p.name), h("td", null, mode ? fmt(c[0], 2, lang) : String(p.age)), h("td", null, mode ? fmt(c[1], 2, lang) : (unit === 1 ? fmtInt(p.income, lang) : fmt(p.income / 1000, 0, lang)))); }))));
      note.innerHTML = mode === 0
        ? t({ tr: "Ham birimlerde gelirin rakamları yaşınkinden çok büyük; uzaklığı neredeyse yalnızca gelir belirliyor. Birimi “bin TL” yapınca sonuç tersine dönüyor: <b>karar, verinin değil birimin eseri</b>.", en: "In raw units the income numbers are far larger than the ages, so income almost alone decides the distance. Switch to thousands and the answer flips: <b>the result is an artefact of the unit, not of the data</b>." })
        : t({ tr: "Her değişken kendi ortalamasından kaç standart sapma uzakta? Bu ölçekte iki değişken eşit söz hakkına sahip ve A, yaşça çok yakın olduğu C'ye benziyor. Referans: müşteri tabanında yaş ortalaması " + R.ageMean + " (s = " + R.ageSd + "), gelir ortalaması " + fmtInt(R.incMean, lang) + " (s = " + fmtInt(R.incSd, lang) + ").", en: "How many standard deviations is each value from its mean? On this scale both variables have an equal say, and A resembles C, who is almost the same age. Reference: in the customer base, mean age " + R.ageMean + " (sd = " + R.ageSd + "), mean income " + fmtInt(R.incMean, lang) + " (sd = " + fmtInt(R.incSd, lang) + ")." });
    }
    host.append(tabs, unitWrap, tiles, tbl, note);
    render();
  };

  /* =====================================================================
   * oneHot — kategorik bir sütunu kukla değişkenlere çevirmek
   * cfg: { values: [...], prefix }
   * ===================================================================== */
  P.oneHot = function (host, cfg, ctx) {
    const { h, t } = ctx;
    let dropFirst = false, intercept = false;
    const vals = t(cfg.values);
    const cats = Array.from(new Set(vals)).sort((a, b) => a.localeCompare(b, ctx.lang));
    const ctrls = h("div", { class: "pg-ctrls" },
      h("label", { class: "pg-check" }, (function () { const c = h("input", { type: "checkbox" }); c.addEventListener("change", () => { dropFirst = c.checked; ctx.touch(); render(); }); return c; })(), h("span", null, "drop_first=True")),
      h("label", { class: "pg-check" }, (function () { const c = h("input", { type: "checkbox" }); c.addEventListener("change", () => { intercept = c.checked; ctx.touch(); render(); }); return c; })(), h("span", null, t({ tr: "Sabit terim sütunu ekle (hep 1)", en: "Add a constant column (always 1)" }))));
    const tbl = h("div", { class: "pg-tablewrap" });
    const note = h("p", { class: "pg-note" });
    function render() {
      const used = dropFirst ? cats.slice(1) : cats;
      const pre = t(cfg.prefix);
      const head = [t(cfg.label)].concat(intercept ? [t({ tr: "sabit", en: "const" })] : []).concat(used.map((c) => pre + "_" + c));
      tbl.innerHTML = "";
      tbl.append(h("table", { class: "pg-table" }, h("thead", null, h("tr", null, head.map((x) => h("th", null, x)))),
        h("tbody", null, vals.map((v) => h("tr", null, [h("td", null, v)].concat(intercept ? [h("td", { class: "k" }, "1")] : []).concat(used.map((c) => h("td", { class: c === v ? "one" : "" }, c === v ? "1" : "0"))))))));
      let msg;
      if (!dropFirst && intercept) msg = { tr: "<b>Kukla tuzağı:</b> her satırda kukla sütunlarının toplamı 1, yani sabit terimle birebir aynı. Bir sütun diğerlerinden tam olarak hesaplanabiliyor; doğrusal bir model katsayıları ayıramaz. Ünite 2'deki katsayı sorununun en uç hâli.", en: "<b>Dummy trap:</b> in every row the dummies add up to 1, exactly the constant column. One column can be computed from the others, so a linear model cannot separate the coefficients. It is the extreme case of the coefficient problem in unit 2." };
      else if (dropFirst) msg = { tr: "Bir kategori (" + cats[0] + ") dışarıda kaldı ve <b>referans grup</b> oldu: tüm sütunları 0 olan satırlar o gruptur. Hiçbir bilgi kaybolmadı.", en: "One category (" + cats[0] + ") was left out and became the <b>reference group</b>: rows with all zeros belong to it. No information was lost." };
      else msg = { tr: "Her kategori için bir 0/1 sütunu açıldı. Her satırda tam olarak bir tane 1 var. Şimdi sabit terimi de ekle ve ne olduğuna bak.", en: "One 0/1 column was created for each category. Each row has exactly one 1. Now add the constant column too and see what happens." };
      note.innerHTML = t(msg);
    }
    host.append(ctrls, tbl, note);
    render();
  };
})();
