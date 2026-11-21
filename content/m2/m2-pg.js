/* Modül 2 — oyun alanları: hata ölçüleri, polinom uyumu, U eğrisi, yanlılık-varyans,
 * çapraz doğrulama katları ve zaman serisinde bölme (FRED işsizlik verisi).
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
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }
  function tile(h, k, v, cls) { return h("div", { class: "tile" + (cls ? " " + cls : "") }, h("small", null, k), h("b", null, String(v))); }
  function fmt(x, d, lang) { const s = Number(x).toFixed(d); return lang === "tr" ? s.replace(".", ",") : s; }
  function slider(h, min, max, step, val, on) { const el = h("input", { type: "range", min, max, step, value: val }); el.addEventListener("input", (e) => on(+e.target.value)); return el; }

  /* ---------------- ortak: ücret–deneyim dünyası (Hafta 3 notebook'uyla aynı) ---------------- */
  function rng(seed) { let x = seed >>> 0; return () => { x = (x + 0x6D2B79F5) >>> 0; let z = x; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; }; }
  function normal(u) { let a = 0; while (a === 0) a = u(); return Math.sqrt(-2 * Math.log(a)) * Math.cos(2 * Math.PI * u()); }
  const SIG = 0.25;
  const truth = (e) => 2.0 + 0.08 * e - 0.0014 * e * e;
  function sample(u, n) { const e = [], y = []; for (let i = 0; i < n; i++) { const x = u() * 40; e.push(x); y.push(truth(x) + SIG * normal(u)); } return { e, y }; }
  // En küçük kareler: Householder QR ile (x, [-1, 1] aralığına ölçeklenir)
  function polyfit(e, y, d) {
    const n = e.length, m = d + 1;
    const A = e.map((x) => { const z = x / 20 - 1, r = []; let p = 1; for (let j = 0; j < m; j++) { r.push(p); p *= z; } return r; });
    const b = y.slice();
    for (let k = 0; k < m; k++) {
      let norm = 0; for (let i = k; i < n; i++) norm += A[i][k] * A[i][k];
      norm = Math.sqrt(norm); if (norm === 0) continue;
      const alpha = A[k][k] > 0 ? -norm : norm;
      const v = []; for (let i = 0; i < n; i++) v.push(i < k ? 0 : A[i][k]);
      v[k] -= alpha;
      let vv = 0; for (let i = k; i < n; i++) vv += v[i] * v[i];
      if (vv === 0) continue;
      for (let j = k; j < m; j++) { let s = 0; for (let i = k; i < n; i++) s += v[i] * A[i][j]; s = 2 * s / vv; for (let i = k; i < n; i++) A[i][j] -= s * v[i]; }
      let s = 0; for (let i = k; i < n; i++) s += v[i] * b[i]; s = 2 * s / vv; for (let i = k; i < n; i++) b[i] -= s * v[i];
    }
    const c = new Array(m).fill(0);
    for (let k = m - 1; k >= 0; k--) { let s = b[k]; for (let j = k + 1; j < m; j++) s -= A[k][j] * c[j]; c[k] = Math.abs(A[k][k]) < 1e-12 ? 0 : s / A[k][k]; }
    return c;
  }
  function polyval(c, x) { const z = x / 20 - 1; let p = 1, s = 0; for (let j = 0; j < c.length; j++) { s += c[j] * p; p *= z; } return s; }
  function mse(c, d) { let s = 0; for (let i = 0; i < d.e.length; i++) { const r = polyval(c, d.e[i]) - d.y[i]; s += r * r; } return s / d.e.length; }

  function wageChart(W, H) {
    const chart = svg("svg", { viewBox: "0 0 " + W + " " + H, class: "pg-svg", role: "img" });
    const L = 44, R = W - 12, T = 12, B = H - 30, y0 = 1.4, y1 = 3.6;
    const sx = (e) => L + e / 40 * (R - L), sy = (v) => B - (Math.min(y1, Math.max(y0, v)) - y0) / (y1 - y0) * (B - T);
    return { chart, sx, sy, L, R, T, B, frame() {
      svg("rect", { x: L, y: T, width: R - L, height: B - T, class: "pg-frame" }, chart);
      [0, 10, 20, 30, 40].forEach((e) => { svg("text", { x: sx(e), y: B + 16, "text-anchor": "middle", class: "pg-lbl" }, chart).textContent = e; });
      [1.5, 2.5, 3.5].forEach((v) => { svg("text", { x: L - 6, y: sy(v) + 4, "text-anchor": "end", class: "pg-lbl" }, chart).textContent = v; });
    }, curve(f, cls) {
      let dstr = ""; for (let i = 0; i <= 200; i++) { const e = i / 5; dstr += (i ? "L" : "M") + sx(e).toFixed(1) + " " + sy(f(e)).toFixed(1); }
      svg("path", { d: dstr, class: cls }, chart);
    } };
  }

  /* =====================================================================
   * errorMetrics — ortalama hata, ortalama mutlak hata, HKO, kök HKO
   * ===================================================================== */
  P.errorMetrics = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    const actual = [4.0, 4.1, 3.9, 4.2, 4.0, 4.1];
    const base = [0.1, -0.2, 0.1, -0.1, 0.2, -0.1];
    /* Kaydırıcı doğrudan 6. ayın hatasını ayarlar; başlangıç −0,1 / the slider sets month 6's error directly */
    let big = base[5];
    const lab = h("b");
    const sl = slider(h, -3, 3, 0.1, big, (v) => { big = Math.round(v * 10) / 10; ctx.touch(); draw(); });
    const ctrls = h("div", { class: "pg-ctrls" }, h("label", null, h("span", null, t({ tr: "6. ayın öngörü hatası = ", en: "Forecast error in month 6 = " }), lab), sl));
    const tbl = h("div", { class: "pg-tablewrap" });
    const tiles = h("div", { class: "tiles" });
    const note = h("p", { class: "pg-note" });
    function draw() {
      const err = base.slice(); err[5] = big;
      lab.textContent = fmt(err[5], 1, lang);
      sl.setAttribute("aria-valuetext", fmt(err[5], 1, lang));
      const fc = actual.map((a, i) => a - err[i]);
      const me = err.reduce((a, b) => a + b, 0) / 6;
      const mae = err.reduce((a, b) => a + Math.abs(b), 0) / 6;
      const m2 = err.reduce((a, b) => a + b * b, 0) / 6;
      tbl.innerHTML = "";
      tbl.append(h("table", { class: "pg-table" },
        h("thead", null, h("tr", null, [t({ tr: "Ay", en: "Month" }), t({ tr: "Gerçek", en: "Actual" }), t({ tr: "Öngörü", en: "Forecast" }), t({ tr: "Hata", en: "Error" })].map((x) => h("th", null, x)))),
        h("tbody", null, actual.map((a, i) => h("tr", { class: i === 5 ? "filled" : "" }, h("td", null, String(i + 1)), h("td", null, fmt(a, 1, lang)), h("td", null, fmt(fc[i], 1, lang)), h("td", null, fmt(err[i], 1, lang)))))));
      tiles.innerHTML = "";
      tiles.append(tile(h, t({ tr: "Ortalama hata", en: "Mean error" }), fmt(me, 2, lang)),
        tile(h, t({ tr: "Ort. mutlak hata", en: "Mean abs. error" }), fmt(mae, 2, lang)),
        tile(h, t({ tr: "HKO", en: "MSE" }), fmt(m2, 2, lang)),
        tile(h, t({ tr: "Kök HKO", en: "RMSE" }), fmt(Math.sqrt(m2), 2, lang)));
      note.textContent = Math.abs(err[5]) >= 1
        ? t({ tr: "Tek bir büyük hata kök HKO'yu ortalama mutlak hatadan çok daha fazla yükseltiyor: kare almak büyük hataları büyütür.", en: "One large error raises the RMSE far more than the mean absolute error: squaring magnifies large errors." })
        : t({ tr: "Artı ve eksi hatalar ortalama hatada birbirini götürüyor; ortalama hata sıfıra yakın olsa da model hata yapıyor.", en: "Positive and negative errors cancel in the mean error; even with a mean error near zero, the model makes mistakes." });
    }
    host.append(ctrls, tbl, tiles, note);
    draw();
  };

  /* =====================================================================
   * polyFit — derece kaydırıcısı; eğitim ve test HKO
   * ===================================================================== */
  P.polyFit = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    let deg = 2, seed = 1, prev = null;
    let train, test;
    function newData() { const u = rng(seed * 104729); train = sample(u, 30); test = sample(rng(999), 2000); }
    newData();
    const lab = h("b");
    const ctrls = h("div", { class: "pg-ctrls" },
      h("label", null, h("span", null, t({ tr: "Polinom derecesi = ", en: "Polynomial degree = " }), lab), slider(h, 1, 12, 1, deg, (v) => { deg = v; ctx.touch(); draw(); })),
      h("button", { class: "btn sm", onclick: () => { prev = { seed, deg, te: mse(polyfit(train.e, train.y, deg), test) }; seed++; newData(); ctx.touch(); draw(); } }, t({ tr: "Yeni 30 kişi çek", en: "Draw 30 new people" })));
    const tiles = h("div", { class: "tiles" });
    const box = h("div");
    function draw() {
      lab.textContent = deg;
      const c = polyfit(train.e, train.y, deg);
      const tr = mse(c, train), te = mse(c, test);
      tiles.innerHTML = "";
      const teTxt = te > 99 ? fmt(te, 0, lang) : fmt(te, 3, lang);
      tiles.append(tile(h, t({ tr: "Çekiliş no", en: "Draw no." }), String(seed)),
        tile(h, t({ tr: "Eğitim HKO", en: "Training MSE" }), fmt(tr, 3, lang)), tile(h, t({ tr: "Test HKO (2.000 yeni kişi)", en: "Test MSE (2,000 new people)" }), teTxt, te < 0.08 ? "win" : ""));
      if (prev) tiles.append(tile(h, t({ tr: `Önceki çekiliş (${prev.seed}), derece ${prev.deg}`, en: `Previous draw (${prev.seed}), degree ${prev.deg}` }), prev.te > 99 ? fmt(prev.te, 0, lang) : fmt(prev.te, 3, lang)));
      const g = wageChart(560, 250);
      g.frame();
      g.curve(truth, "pg-true");
      train.e.forEach((e, i) => svg("circle", { cx: g.sx(e), cy: g.sy(train.y[i]), r: 3.5, class: "pg-dot alt" }, g.chart));
      g.curve((e) => polyval(c, e), "pg-fit");
      box.innerHTML = ""; box.append(g.chart,
        h("p", { class: "pg-note" }, t({ tr: "Kesikli çizgi gerçek ilişki (log ücret), mavi çizgi model, noktalar 30 kişilik eğitim verisi. İndirgenemez hata (gürültü) = 0,0625. Bu oyun alanı kendi rastgele çekilişlerini kullanır (çekiliş 1, 2, …); atölyedeki sabit örnekle (tohum 2026) aynı değildir. Atölyede derece 12'nin test HKO'su 18,2; burada aynı derece çekilişe göre 0,1 ile yüzlerce arasında değişebilir. Bu oynaklığın kendisi derecenin yüksek varyansını gösterir.", en: "Dashed line: the true relationship (log wage); blue line: the model; dots: the 30-person training data. Irreducible error (noise) = 0.0625. This playground uses its own random draws (draw 1, 2, …); they are not the fixed workshop sample (seed 2026). In the workshop degree 12's test MSE is 18.2; here the same degree can range from 0.1 to hundreds depending on the draw. That volatility itself shows the degree's high variance." })));
    }
    host.append(ctrls, tiles, box);
    draw();
  };

  /* =====================================================================
   * uCurve — 100 tekrarla ortalama eğitim ve test hatası
   * ===================================================================== */
  P.uCurve = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    let n = 30;
    const lab = h("b");
    const ctrls = h("div", { class: "pg-ctrls" }, h("label", null, h("span", null, t({ tr: "Eğitim örneklemi büyüklüğü = ", en: "Training sample size = " }), lab),
      h("select", { onchange: (e) => { n = +e.target.value; ctx.touch(); draw(); } }, [20, 30, 60, 150].map((v) => h("option", { value: v, selected: v === n }, String(v))))));
    const box = h("div");
    const test = sample(rng(7), 1500);
    function draw() {
      lab.textContent = n;
      const R = 100, D = 12, tr = new Array(D).fill(0), te = new Array(D).fill(0);
      const u = rng(n * 31 + 5);
      for (let r = 0; r < R; r++) { const s = sample(u, n); for (let d = 1; d <= D; d++) { const c = polyfit(s.e, s.y, d); tr[d - 1] += mse(c, s) / R; te[d - 1] += Math.min(mse(c, test), 5) / R; } }
      const W = 560, H = 230, L = 50, Rr = W - 14, T = 12, B = H - 32;
      const chart = svg("svg", { viewBox: "0 0 " + W + " " + H, class: "pg-svg", role: "img" });
      const lo = 0, hi = 0.3;
      const sx = (d) => L + (d - 1) / (D - 1) * (Rr - L), sy = (v) => B - (Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo) * (B - T);
      svg("rect", { x: L, y: T, width: Rr - L, height: B - T, class: "pg-frame" }, chart);
      svg("line", { x1: L, x2: Rr, y1: sy(0.0625), y2: sy(0.0625), class: "pg-ref" }, chart);
      for (let d = 1; d <= D; d++) svg("text", { x: sx(d), y: B + 16, "text-anchor": "middle", class: "pg-lbl" }, chart).textContent = d;
      [0, 0.1, 0.2, 0.3].forEach((v) => { svg("text", { x: L - 6, y: sy(v) + 4, "text-anchor": "end", class: "pg-lbl" }, chart).textContent = fmt(v, 1, lang); });
      const line = (arr, cls) => svg("path", { d: arr.map((v, i) => (i ? "L" : "M") + sx(i + 1).toFixed(1) + " " + sy(v).toFixed(1)).join(""), class: cls }, chart);
      line(tr, "pg-line a"); line(te, "pg-line b");
      const best = te.indexOf(Math.min(...te)) + 1;
      svg("circle", { cx: sx(best), cy: sy(te[best - 1]), r: 5, class: "pg-dot hot" }, chart);
      box.innerHTML = "";
      box.append(chart, h("div", { class: "pg-legend" },
        h("span", { class: "lg a" }, t({ tr: "Ortalama eğitim hatası", en: "Average training error" })),
        h("span", { class: "lg b" }, t({ tr: "Ortalama test hatası", en: "Average test error" })),
        h("span", { class: "lg r" }, t({ tr: "İndirgenemez hata (0,0625)", en: "Irreducible error (0.0625)" }))),
        h("div", { class: "pg-tablewrap" }, h("table", { class: "pg-table" },
          h("thead", null, h("tr", null, h("th", null, t({ tr: "Derece", en: "Degree" })), ...te.map((_, i) => h("th", null, String(i + 1))))),
          h("tbody", null,
            h("tr", null, h("td", null, t({ tr: "Ort. test HKO", en: "Avg test MSE" })), ...te.map((v, i) => h("td", { class: i + 1 === best ? "filled" : "" }, v >= 1 ? fmt(v, 1, lang) : fmt(v, 3, lang))))))),
        h("p", { class: "pg-note" }, t({ tr: "Yatay eksen: polinom derecesi (esneklik). En düşük ortalama test hatası: derece " + best + ". Grafikte test hatası okunurluk için 0,3'te kesilir; gerçek ortalamalar tablodadır. Tek bir çekilişin aşırı büyük hatasının ortalamayı yutmaması için her çekilişte test HKO'su 5'te kırpılır. Bu deneyde (gerçek ilişki 2. dereceden) örneklem büyüdükçe dip derece 2'de kalıyor; değişen, sağ kolun dikliği.", en: "Horizontal axis: polynomial degree (flexibility). Lowest average test error: degree " + best + ". In the chart test error is clipped at 0.3 for readability; the actual averages are in the table. So that one draw's huge error does not swamp the average, each draw's test MSE is capped at 5. In this experiment (the true relationship is quadratic) the bottom stays at degree 2 as the sample grows; what changes is how steep the right arm is." })));
    }
    host.append(ctrls, box);
    draw();
  };

  /* =====================================================================
   * biasVariance — dart tahtası ve 25 örneklemle kurulan modeller
   * ===================================================================== */
  P.biasVariance = function (host, cfg, ctx) {
    const { h, t } = ctx;
    let tab = 0, bias = 0.0, vari = 0.15, deg = 1;
    const tabs = h("div", { class: "tabs" });
    const body = h("div");
    function render() {
      tabs.innerHTML = "";
      [{ tr: "Dart tahtası", en: "Dartboard" }, { tr: "Ücret modelleri", en: "Wage models" }].forEach((x, i) => tabs.append(h("button", { class: i === tab ? "on" : "", onclick: () => { tab = i; ctx.touch(); render(); } }, t(x))));
      body.innerHTML = "";
      if (tab === 0) dart(); else wages();
    }
    function dart() {
      const ctr = h("div", { class: "pg-ctrls" },
        h("label", null, h("span", null, t({ tr: "Yanlılık (merkezden sistematik sapma)", en: "Bias (systematic offset from the centre)" })), slider(h, 0, 0.6, 0.05, bias, (v) => { bias = v; ctx.touch(); drawDart(); })),
        h("label", null, h("span", null, t({ tr: "Varyans (dağınıklık)", en: "Variance (spread)" })), slider(h, 0.03, 0.45, 0.01, vari, (v) => { vari = v; ctx.touch(); drawDart(); })));
      const holder = h("div");
      function drawDart() {
        const W = 300, c = W / 2;
        const chart = svg("svg", { viewBox: "0 0 " + W + " " + W, class: "pg-svg dart", role: "img" });
        [1, 0.66, 0.33].forEach((r, i) => svg("circle", { cx: c, cy: c, r: r * 135, class: "ring r" + i }, chart));
        svg("circle", { cx: c, cy: c, r: 4, class: "bull" }, chart);
        const u = rng(42);
        for (let i = 0; i < 25; i++) { const x = bias + vari * normal(u), y = bias * 0.6 + vari * normal(u); svg("circle", { cx: c + x * 135, cy: c - y * 135, r: 5, class: "pg-dot" }, chart); }
        holder.innerHTML = ""; holder.append(chart);
      }
      body.append(ctr, holder, h("p", { class: "pg-note" }, t({ tr: "Merkez gerçek değer; her nokta farklı bir örneklemle eğitilmiş bir modelin öngörüsü.", en: "The centre is the true value; each dot is the prediction of a model trained on a different sample." })));
      drawDart();
    }
    function wages() {
      const lab = h("b");
      const ctr = h("div", { class: "pg-ctrls" }, h("label", null, h("span", null, t({ tr: "Polinom derecesi = ", en: "Polynomial degree = " }), lab), slider(h, 1, 12, 1, deg, (v) => { deg = v; ctx.touch(); drawW(); })));
      const holder = h("div");
      function drawW() {
        lab.textContent = deg;
        const g = wageChart(560, 250); g.frame();
        const u = rng(2026 + deg);
        for (let r = 0; r < 25; r++) { const s = sample(u, 30); const c = polyfit(s.e, s.y, deg); g.curve((e) => polyval(c, e), "pg-fit thin"); }
        g.curve(truth, "pg-true");
        holder.innerHTML = ""; holder.append(g.chart);
      }
      body.append(ctr, holder, h("p", { class: "pg-note" }, t({ tr: "Her ince çizgi 30 kişilik farklı bir örneklemle kurulmuş model. Derece 1: hep benzer ama hep yanlış (yüksek yanlılık). Derece 12: ortalamada doğruya yakın ama her örneklemde bambaşka (yüksek varyans).", en: "Each thin line is a model built on a different 30-person sample. Degree 1: always similar but always wrong (high bias). Degree 12: close to the truth on average but very different every time (high variance)." })));
      drawW();
    }
    host.append(tabs, body);
    render();
  };

  /* =====================================================================
   * kfold — 30 gözlemin k kata bölünmesi
   * ===================================================================== */
  P.kfold = function (host, cfg, ctx) {
    const { h, t } = ctx;
    let k = 5, round = 0;
    const order = (() => { const u = rng(3), a = []; for (let i = 0; i < 30; i++) a.push(i); for (let i = 29; i > 0; i--) { const j = Math.floor(u() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; })();
    const ctrls = h("div", { class: "pg-ctrls" });
    const grid = h("div", { class: "kf-grid" });
    const note = h("p", { class: "pg-note" });
    function render() {
      ctrls.innerHTML = "";
      ctrls.append(h("label", null, h("span", null, t({ tr: "Kat sayısı (k)", en: "Number of folds (k)" })),
        h("select", { onchange: (e) => { k = +e.target.value; round = 0; ctx.touch(); render(); } }, [3, 5, 10].map((v) => h("option", { value: v, selected: v === k }, String(v))))),
        h("div", { class: "kf-rounds" }, Array.from({ length: k }, (_, i) => h("button", { class: "chip" + (i === round ? " on" : ""), onclick: () => { round = i; ctx.touch(); render(); } }, t({ tr: "Tur ", en: "Round " }) + (i + 1)))));
      const fold = new Array(30);
      order.forEach((obs, pos) => { fold[obs] = Math.floor(pos * k / 30); });
      grid.innerHTML = "";
      for (let i = 0; i < 30; i++) grid.append(h("span", { class: "kf-cell" + (fold[i] === round ? " val" : "") }, String(i + 1)));
      note.textContent = t({ tr: "Turuncu gözlemler bu turda doğrulama için ayrıldı; model diğer " + (30 - Math.round(30 / k)) + " gözlemle kuruluyor. " + k + " tur sonunda her gözlem tam bir kez doğrulamada kullanılmış olur; çapraz doğrulama hatası " + k + " turun ortalamasıdır.", en: "Orange observations are held out for validation in this round; the model is built on the other " + (30 - Math.round(30 / k)) + ". After " + k + " rounds every observation has been used for validation exactly once; the cross-validation error is the average over the " + k + " rounds." });
    }
    host.append(ctrls, grid, note);
    render();
  };

  /* =====================================================================
   * timeSplit — FRED işsizlik: rastgele bölme mi, zamana göre bölme mi?
   * ===================================================================== */
  P.timeSplit = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    const box = h("div", null, h("p", { class: "muted" }, t({ tr: "Veri yükleniyor…", en: "Loading data…" })));
    host.append(box);
    let mode = 0;
    fetch("data/fred/UNRATE.csv").then((r) => r.text()).then((txt) => {
      const rows = txt.trim().split("\n").slice(1).map((l) => l.split(",")).filter((r) => r[1] !== "" && r[1] !== "." && r[0] >= "2000-01-01");
      const dates = rows.map((r) => r[0]), s = rows.map((r) => +r[1]);
      const mon = dates.map((d) => +d.slice(0, 4) * 12 + +d.slice(5, 7));   // takvim ayı / calendar month
      const T = s.length, nTe = Math.floor(T * 0.2);
      const u = rng(11); const perm = Array.from({ length: T }, (_, i) => i);
      for (let i = T - 1; i > 0; i--) { const j = Math.floor(u() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
      const splits = [
        { te: perm.slice(0, nTe).sort((a, b) => a - b), label: { tr: "Rastgele bölme (tohum 11)", en: "Random split (seed 11)" } },
        { te: Array.from({ length: nTe }, (_, i) => T - nTe + i), label: { tr: "Zamana göre bölme", en: "Split by time" } }
      ];
      const tabs = h("div", { class: "tabs" });
      const tiles = h("div", { class: "tiles" });
      const holder = h("div");
      const note = h("p", { class: "pg-note" });
      function draw() {
        tabs.innerHTML = "";
        splits.forEach((sp, i) => tabs.append(h("button", { class: i === mode ? "on" : "", onclick: () => { mode = i; ctx.touch(); draw(); } }, t(sp.label))));
        const te = new Set(splits[mode].te), tr = []; for (let i = 0; i < T; i++) if (!te.has(i)) tr.push(i);
        let se = 0; splits[mode].te.forEach((i) => { let best = tr[0]; tr.forEach((j) => { if (Math.abs(mon[j] - mon[i]) < Math.abs(mon[best] - mon[i])) best = j; }); se += (s[best] - s[i]) ** 2; });
        const rmse = Math.sqrt(se / splits[mode].te.length);
        tiles.innerHTML = ""; tiles.append(tile(h, t({ tr: "Test hatası (kök HKO, puan)", en: "Test error (RMSE, points)" }), fmt(rmse, 2, lang)), tile(h, t({ tr: "Eğitim / test gözlemi", en: "Training / test obs." }), tr.length + " / " + te.size));
        const W = 560, H = 220, L = 34, R = W - 10, Tp = 10, B = H - 26, hi = 15;
        const chart = svg("svg", { viewBox: "0 0 " + W + " " + H, class: "pg-svg", role: "img" });
        const sx = (i) => L + i / (T - 1) * (R - L), sy = (v) => B - v / hi * (B - Tp);
        svg("rect", { x: L, y: Tp, width: R - L, height: B - Tp, class: "pg-frame" }, chart);
        [0, 5, 10, 15].forEach((v) => { svg("text", { x: L - 5, y: sy(v) + 4, "text-anchor": "end", class: "pg-lbl" }, chart).textContent = v; });
        for (let i = 0; i < T; i += 60) svg("text", { x: sx(i), y: B + 16, "text-anchor": "middle", class: "pg-lbl" }, chart).textContent = dates[i].slice(0, 4);
        for (let i = 0; i < T; i++) svg("circle", { cx: sx(i), cy: sy(s[i]), r: te.has(i) ? 2.8 : 1.8, class: "pg-dot" + (te.has(i) ? " hot" : " alt") }, chart);
        holder.innerHTML = ""; holder.append(chart);
        note.textContent = mode === 0
          ? t({ tr: "Test ayları serinin her yerine dağılmış. Model bir test ayını, hemen önceki ve sonraki aylara bakarak dolduruyor (araya değer koyma): geleceği görüyor. Bu tohumla hata ≈ 0,17; atölyedeki farklı rastgele bölme (tohum 2026) ≈ 0,19 verir.", en: "Test months are scattered across the series. The model fills a test month in from the months just before and after it (filling in between): it sees the future. With this seed the error is ≈ 0.17; the different random split in the workshop (seed 2026) gives ≈ 0.19." })
          : t({ tr: "Test ayları serinin sonunda (son %20). Model yalnızca geçmişi biliyor ve kesimden sonraki her aya aynı son eğitim değerini veriyor: öngörü ufku 1'den 64 aya uzuyor. Farkın bir kısmı sızıntıdan, bir kısmı farklı hedef aylardan ve uzayan ufuktan geliyor.", en: "Test months are at the end of the series (the last 20%). The model knows only the past and gives every month after the cut the same last training value: the forecast horizon stretches from 1 to 64 months. Part of the gap comes from leakage, part from different target months and the longer horizon." });
      }
      box.innerHTML = "";
      box.append(tabs, tiles, holder, note, h("p", { class: "pg-src" }, t({ tr: "Veri: ABD işsizlik oranı (UNRATE), FRED, aylık, 2000'den bu yana; eksik Ekim 2025 çıkarıldı. Model: bir ayı, eğitim verisinde takvimde ona en yakın ayın değeriyle öngörür.", en: "Data: US unemployment rate (UNRATE), FRED, monthly, since 2000; the missing October 2025 is dropped. Model: predicts a month with the value of the calendar-closest month in the training data." })));
      draw();
    }).catch(() => { box.innerHTML = ""; box.append(h("p", { class: "muted" }, t({ tr: "Veri yüklenemedi.", en: "The data could not be loaded." }))); });
  };
})();
