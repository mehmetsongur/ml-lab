/* Modül 3 — oyun alanları: değişken sayısı, Ridge küçültmesi, Ridge/Lasso geometrisi,
 * Lasso ve λ seçimi, seçim istikrarı, enflasyon öngörü yarışı (FRED, önceden hesaplanmış).
 * Hesaplar tarayıcıda, JavaScript ile yapılır: EKK/Ridge normal denklemlerle, Lasso koordinat inişiyle
 * (scikit-learn'deki amaç fonksiyonlarıyla aynı).
 * © 2026 Prof. Dr. Mehmet Songur — PolyForm Strict 1.0.0 (LICENSE-CODE.md)
 */
(function () {
  "use strict";
  const LAB = window.LAB;
  const P = LAB.playgrounds;
  const SVGNS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs, parent) { const el = document.createElementNS(SVGNS, tag); for (const k in attrs) el.setAttribute(k, attrs[k]); if (parent) parent.appendChild(el); return el; }
  function txt(parent, x, y, s, cls, anchor) { const e = svg("text", { x, y, "text-anchor": anchor || "middle", class: cls || "pg-lbl" }, parent); e.textContent = s; return e; }
  function tile(h, k, v, cls) { return h("div", { class: "tile" + (cls ? " " + cls : "") }, h("small", null, k), h("b", null, String(v))); }
  function fmt(x, d, lang) { const s = Number(x).toFixed(d); return lang === "tr" ? s.replace(".", ",") : s; }
  function slider(h, min, max, step, val, on) { const el = h("input", { type: "range", min, max, step, value: val }); el.addEventListener("input", (e) => on(+e.target.value)); return el; }

  /* ---------------- rastgele sayılar ve 40 değişkenli ücret dünyası ---------------- */
  function rng(seed) { let x = seed >>> 0; return () => { x = (x + 0x6D2B79F5) >>> 0; let z = x; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; }; }
  function normal(u) { let a = 0; while (a === 0) a = u(); return Math.sqrt(-2 * Math.log(a)) * Math.cos(2 * Math.PI * u()); }
  const NP = 40, SIG = 0.30, BETA = [0.30, 0.25, -0.12, 0.10, 0.12];
  function world(u, n, rho) {
    rho = rho == null ? 0.97 : rho;
    const X = [], y = [];
    for (let i = 0; i < n; i++) {
      const z = []; for (let j = 0; j < NP; j++) z.push(normal(u));
      const x = z.slice();
      x[5] = rho * x[1] + Math.sqrt(1 - rho * rho) * z[5];
      for (let j = 6; j < NP; j++) x[j] = 0.5 * x[j % 5] + Math.sqrt(0.75) * z[j];
      let m = 2.5; for (let j = 0; j < 5; j++) m += BETA[j] * x[j];
      X.push(x); y.push(m + SIG * normal(u));
    }
    return { X, y };
  }
  /* eğitim verisinin ortalama ve standart sapmasıyla standartlaştır (sapma: n'e bölünür, StandardScaler gibi) */
  function scaler(X) {
    const p = X[0].length, n = X.length, mu = new Array(p).fill(0), sd = new Array(p).fill(0);
    X.forEach((r) => r.forEach((v, j) => (mu[j] += v / n)));
    X.forEach((r) => r.forEach((v, j) => (sd[j] += (v - mu[j]) ** 2 / n)));
    for (let j = 0; j < p; j++) sd[j] = Math.sqrt(sd[j]) || 1;
    return (Z) => Z.map((r) => r.map((v, j) => (v - mu[j]) / sd[j]));
  }
  function cols(X, p) { return X.map((r) => r.slice(0, p)); }
  function mean(a) { return a.reduce((s, v) => s + v, 0) / a.length; }
  /* (X'X + λI) b = X'(y − ȳ); X standartlaştırılmış → sabit terim = ȳ (λ = 0: EKK) */
  function ridge(X, y, lam) {
    const n = X.length, p = X[0].length, yb = mean(y);
    const A = Array.from({ length: p }, () => new Array(p + 1).fill(0));
    for (let i = 0; i < n; i++) { const r = X[i], yy = y[i] - yb; for (let a = 0; a < p; a++) { const ra = r[a]; A[a][p] += ra * yy; for (let b = a; b < p; b++) A[a][b] += ra * r[b]; } }
    for (let a = 0; a < p; a++) { for (let b = 0; b < a; b++) A[a][b] = A[b][a]; A[a][a] += lam + 1e-9; }
    for (let c = 0; c < p; c++) { // Gauss eliminasyonu (kısmi pivotlama)
      let mx = c; for (let r = c + 1; r < p; r++) if (Math.abs(A[r][c]) > Math.abs(A[mx][c])) mx = r;
      [A[c], A[mx]] = [A[mx], A[c]];
      for (let r = c + 1; r < p; r++) { const f = A[r][c] / A[c][c]; for (let k = c; k <= p; k++) A[r][k] -= f * A[c][k]; }
    }
    const b = new Array(p).fill(0);
    for (let r = p - 1; r >= 0; r--) { let s = A[r][p]; for (let k = r + 1; k < p; k++) s -= A[r][k] * b[k]; b[r] = s / A[r][r]; }
    return { b, b0: yb };
  }
  /* Lasso: (1/2n)||y − ȳ − Xb||² + α||b||₁, koordinat inişi (scikit-learn'deki amaçla aynı) */
  function lasso(X, y, alpha, warm) {
    const n = X.length, p = X[0].length, yb = mean(y);
    const b = warm ? warm.slice() : new Array(p).fill(0);
    const r = y.map((v, i) => v - yb - X[i].reduce((s, x, j) => s + x * b[j], 0));
    const sq = new Array(p).fill(0); for (let j = 0; j < p; j++) for (let i = 0; i < n; i++) sq[j] += X[i][j] * X[i][j] / n;
    for (let it = 0; it < 500; it++) {
      let mx = 0;
      for (let j = 0; j < p; j++) {
        let rho = 0; for (let i = 0; i < n; i++) rho += X[i][j] * r[i]; rho = rho / n + sq[j] * b[j];
        const nb = Math.sign(rho) * Math.max(Math.abs(rho) - alpha, 0) / sq[j];
        const d = nb - b[j];
        if (d !== 0) { for (let i = 0; i < n; i++) r[i] -= X[i][j] * d; b[j] = nb; mx = Math.max(mx, Math.abs(d)); }
      }
      if (mx < 1e-6) break;
    }
    return { b, b0: yb };
  }
  function predict(m, X) { return X.map((r) => m.b0 + r.reduce((s, x, j) => s + x * m.b[j], 0)); }
  function mse(a, b) { let s = 0; for (let i = 0; i < a.length; i++) s += (a[i] - b[i]) ** 2; return s / a.length; }
  const logspace = (a, b, k) => Array.from({ length: k }, (_, i) => Math.pow(10, a + (b - a) * i / (k - 1)));
  const NAMES = { tr: ["Eğitim", "Deneyim", "Deneyim²", "Kıdem", "Büyükşehir", "Yaş"], en: ["Education", "Experience", "Experience²", "Tenure", "Big city", "Age"] };

  /* Katsayı çubukları (40 değişken; ilk 5 gerçek, 6. yaş) */
  function coefBars(h, t, b, lo, hi) {
    const W = 560, H = 200, Lm = 40, R = W - 10, T = 14, B = H - 34;
    const chart = svg("svg", { viewBox: `0 0 ${W} ${H}`, class: "pg-svg", role: "img" });
    const sx = (j) => Lm + (j + 0.5) / NP * (R - Lm), sy = (v) => B - (Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo) * (B - T);
    svg("rect", { x: Lm, y: T, width: R - Lm, height: B - T, class: "pg-frame" }, chart);
    [lo, 0, hi / 2, hi].forEach((v) => txt(chart, Lm - 5, sy(v) + 4, String(v).replace(".", t({ tr: ",", en: "." })), "pg-lbl", "end"));
    svg("line", { x1: Lm, x2: R, y1: sy(0), y2: sy(0), class: "pg-axis" }, chart);
    const bw = (R - Lm) / NP * 0.7;
    b.forEach((v, j) => { const y0 = sy(Math.max(v, 0)), y1 = sy(Math.min(v, 0)); svg("rect", { x: sx(j) - bw / 2, y: y0, width: bw, height: Math.max(y1 - y0, 0.8), class: "pg-bar " + (j < 5 ? "c1" : j === 5 ? "c3" : "c6") }, chart); });
    BETA.forEach((v, j) => svg("line", { x1: sx(j) - bw, x2: sx(j) + bw, y1: sy(v), y2: sy(v), class: "pg-truemark" }, chart));
    txt(chart, (sx(0) + sx(4)) / 2, B + 16, t({ tr: "5 gerçek", en: "5 real" }));
    txt(chart, sx(5), B + 16, t({ tr: "Yaş", en: "Age" }));
    txt(chart, sx(22), B + 16, t({ tr: "34 anket sorusu (gerçek etkisi sıfır)", en: "34 survey items (true effect zero)" }));
    txt(chart, R - 4, T + 14, t({ tr: "siyah çizgi: gerçek katsayı", en: "black tick: true coefficient" }), "pg-lbl", "end");
    return chart;
  }

  /* =====================================================================
   * manyVars — değişken sayısı arttıkça EKK'nın eğitim ve test hatası
   * ===================================================================== */
  P.manyVars = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    let p = 40, n = 100, seed = 1;
    const PS = [5, 10, 15, 20, 25, 30, 35, 40];
    const testSet = world(rng(777), 2000);
    let curves = null;
    function simulate() {
      const R = 20, tr = PS.map(() => 0), te = PS.map(() => 0);
      for (let r = 0; r < R; r++) {
        const d = world(rng(seed * 7919 + r * 31 + n), n), s = scaler(d.X), Xs = s(d.X), Xt = s(testSet.X);
        PS.forEach((pp, i) => { const m = ridge(cols(Xs, pp), d.y, 0); tr[i] += mse(predict(m, cols(Xs, pp)), d.y) / R; te[i] += mse(predict(m, cols(Xt, pp)), testSet.y) / R; });
      }
      curves = { tr, te };
    }
    const pLab = h("b"), nTabs = h("div", { class: "tabs" });
    const ctrls = h("div", { class: "pg-ctrls" },
      h("label", null, h("span", null, t({ tr: "Modeldeki değişken sayısı = ", en: "Variables in the model = " }), pLab), slider(h, 5, 40, 5, p, (v) => { p = v; ctx.touch(); draw(); })),
      h("div", null, h("span", { class: "muted" }, t({ tr: "Gözlem sayısı: ", en: "Observations: " })), nTabs));
    const tiles = h("div", { class: "tiles" }), box = h("div"), note = h("p", { class: "pg-note" });
    function tabs() { nTabs.innerHTML = ""; [60, 100, 200, 1000].forEach((v) => nTabs.append(h("button", { class: v === n ? "on" : "", onclick: () => { n = v; ctx.touch(); simulate(); tabs(); draw(); } }, String(v)))); }
    function draw() {
      pLab.textContent = p;
      const i = PS.indexOf(p);
      tiles.innerHTML = "";
      tiles.append(tile(h, t({ tr: "Ortalama eğitim HKO", en: "Average training MSE" }), fmt(curves.tr[i], 3, lang)), tile(h, t({ tr: "Ortalama test HKO", en: "Average test MSE" }), fmt(curves.te[i], 3, lang), curves.te[i] < 0.105 ? "win" : ""), tile(h, t({ tr: "İndirgenemez hata", en: "Irreducible error" }), fmt(0.09, 2, lang)));
      const W = 560, H = 220, Lm = 46, R = W - 12, T = 12, B = H - 30, lo = 0.03, hi = n <= 60 ? 0.4 : 0.2;
      const chart = svg("svg", { viewBox: `0 0 ${W} ${H}`, class: "pg-svg", role: "img" });
      const sx = (pp) => Lm + (pp - 5) / 35 * (R - Lm), sy = (v) => B - (Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo) * (B - T);
      svg("rect", { x: Lm, y: T, width: R - Lm, height: B - T, class: "pg-frame" }, chart);
      PS.forEach((pp) => txt(chart, sx(pp), B + 16, pp));
      [0.05, 0.1, 0.15, 0.2, 0.3, 0.4].filter((v) => v <= hi).forEach((v) => txt(chart, Lm - 5, sy(v) + 4, fmt(v, 2, lang), "pg-lbl", "end"));
      svg("line", { x1: Lm, x2: R, y1: sy(0.09), y2: sy(0.09), class: "pg-ref" }, chart);
      const path = (arr) => arr.map((v, k) => (k ? "L" : "M") + sx(PS[k]).toFixed(1) + " " + sy(v).toFixed(1)).join("");
      svg("path", { d: path(curves.tr), class: "pg-line a" }, chart); svg("path", { d: path(curves.te), class: "pg-line b" }, chart);
      svg("line", { x1: sx(p), x2: sx(p), y1: T, y2: B, class: "pg-ref" }, chart);
      txt(chart, R - 6, sy(curves.te[PS.length - 1]) - 8, t({ tr: "test", en: "test" }), "pg-lbl", "end");
      txt(chart, R - 6, sy(curves.tr[PS.length - 1]) + 16, t({ tr: "eğitim", en: "training" }), "pg-lbl", "end");
      box.innerHTML = ""; box.append(chart);
      note.textContent = t({ tr: "Her eğri 20 farklı örneklemin ortalaması (EKK). İlk 5 değişken gerçek, gerisi ilgisiz. Kesikli yatay çizgi indirgenemez hata (0,09). Gözlem sayısını değiştirip eğrilerin nasıl açıldığına ya da kapandığına bak.", en: "Each curve averages 20 different samples (OLS). The first 5 variables are real, the rest irrelevant. The dashed horizontal line is the irreducible error (0.09). Change the number of observations and see how the curves open up or close." });
    }
    host.append(ctrls, tiles, box, note);
    simulate(); tabs(); draw();
  };

  /* =====================================================================
   * ridgeShrink — λ büyüdükçe katsayılar küçülür; eğitim ve test hatası
   * ===================================================================== */
  P.ridgeShrink = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    let lg = 1, seed = 1;
    const testSet = world(rng(777), 2000);
    let Xs, Xt, y;
    function data() { const d = world(rng(seed * 104729), 100), s = scaler(d.X); Xs = s(d.X); Xt = s(testSet.X); y = d.y; }
    data();
    const lab = h("b");
    const ctrls = h("div", { class: "pg-ctrls" },
      h("label", null, h("span", null, "λ = ", lab), slider(h, -2, 4, 0.1, lg, (v) => { lg = v; ctx.touch(); draw(); })),
      h("button", { class: "btn sm", onclick: () => { seed++; data(); ctx.touch(); draw(); } }, t({ tr: "Yeni 100 kişi çek", en: "Draw 100 new people" })));
    const tiles = h("div", { class: "tiles" }), box = h("div"), note = h("p", { class: "pg-note" });
    const ols = () => ridge(Xs, y, 0);
    function draw() {
      const lam = Math.pow(10, lg);
      lab.textContent = lam >= 10 ? fmt(lam, 0, lang) : fmt(lam, 2, lang);
      const m = ridge(Xs, y, lam), o = ols();
      const te = mse(predict(m, Xt), testSet.y), teo = mse(predict(o, Xt), testSet.y);
      const l2 = Math.sqrt(m.b.reduce((s, v) => s + v * v, 0)), l2o = Math.sqrt(o.b.reduce((s, v) => s + v * v, 0));
      tiles.innerHTML = "";
      tiles.append(tile(h, t({ tr: "Eğitim HKO", en: "Training MSE" }), fmt(mse(predict(m, Xs), y), 3, lang)), tile(h, t({ tr: "Test HKO", en: "Test MSE" }), fmt(te, 3, lang), te < teo - 0.002 ? "win" : ""), tile(h, t({ tr: "EKK test HKO", en: "OLS test MSE" }), fmt(teo, 3, lang)), tile(h, t({ tr: "Katsayıların büyüklüğü", en: "Size of coefficients" }), lang === "tr" ? "%" + Math.round(100 * l2 / l2o) : Math.round(100 * l2 / l2o) + "%"));
      box.innerHTML = ""; box.append(coefBars(h, t, m.b, -0.3, 0.6));
      note.textContent = t({ tr: "Katsayıların büyüklüğü, EKK katsayılarının uzunluğuna (√Σβ²) göre yüzde. λ küçükken Ridge EKK'ya eşittir; λ büyüdükçe bütün katsayılar birlikte küçülür ama hiçbiri tam sıfır olmaz. Test hatası önce düşer, sonra yükselir.", en: "Size of coefficients is a percentage of the OLS coefficients' length (√Σβ²). With small λ Ridge equals OLS; as λ grows all coefficients shrink together, but none becomes exactly zero. Test error first falls, then rises." });
    }
    host.append(ctrls, tiles, box, note);
    draw();
  };

  /* =====================================================================
   * lassoGeom — iki katsayı: daire ve baklava dilimi, köşe çözümü
   * ===================================================================== */
  P.lassoGeom = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    let mode = 1, budget = 1;
    const C = [1.4, 0.5], ang = -50 * Math.PI / 180, ax = [1.25, 0.65];
    const err = (b1, b2) => { const dx = b1 - C[0], dy = b2 - C[1]; const u = dx * Math.cos(ang) + dy * Math.sin(ang), v = -dx * Math.sin(ang) + dy * Math.cos(ang); return Math.sqrt((u / ax[0]) ** 2 + (v / ax[1]) ** 2); };
    const tabs = h("div", { class: "tabs" }), lab = h("b");
    const ctrls = h("div", { class: "pg-ctrls" }, tabs, h("label", null, h("span", null, t({ tr: "Katsayı bütçesi t = ", en: "Coefficient budget t = " }), lab), slider(h, 0.2, 2.2, 0.05, budget, (v) => { budget = v; ctx.touch(); draw(); })));
    const tiles = h("div", { class: "tiles" }), box = h("div"), note = h("p", { class: "pg-note" });
    function boundary(k) {
      const pts = [];
      for (let i = 0; i < 1440; i++) { const a = i / 1440 * 2 * Math.PI, c = Math.cos(a), s = Math.sin(a); const d = k === 0 ? 1 : 1 / (Math.abs(c) + Math.abs(s)); pts.push([budget * c * d, budget * s * d]); }
      return pts;
    }
    function draw() {
      lab.textContent = fmt(budget, 2, lang);
      tabs.innerHTML = ""; [{ tr: "Ridge: β₁² + β₂² ≤ t²", en: "Ridge: β₁² + β₂² ≤ t²" }, { tr: "Lasso: |β₁| + |β₂| ≤ t", en: "Lasso: |β₁| + |β₂| ≤ t" }].forEach((l, i) => tabs.append(h("button", { class: i === mode ? "on" : "", onclick: () => { mode = i; ctx.touch(); draw(); } }, t(l))));
      const pts = boundary(mode);
      const inside = mode === 0 ? Math.hypot(C[0], C[1]) <= budget : Math.abs(C[0]) + Math.abs(C[1]) <= budget;
      let sol = C;
      if (!inside) { let best = 1e9; pts.forEach((q) => { const e = err(q[0], q[1]); if (e < best) { best = e; sol = q; } }); }
      const W = 420, H = 320, lo = [-1.6, -1.6], hi = [2.8, 2.0];
      const sx = (v) => 20 + (v - lo[0]) / (hi[0] - lo[0]) * (W - 40), sy = (v) => H - 20 - (v - lo[1]) / (hi[1] - lo[1]) * (H - 40);
      const chart = svg("svg", { viewBox: `0 0 ${W} ${H}`, class: "pg-svg", role: "img", style: "max-width:460px" });
      svg("line", { x1: sx(lo[0]), x2: sx(hi[0]), y1: sy(0), y2: sy(0), class: "pg-axis" }, chart);
      svg("line", { x1: sx(0), x2: sx(0), y1: sy(lo[1]), y2: sy(hi[1]), class: "pg-axis" }, chart);
      svg("polygon", { points: pts.filter((_, i) => i % 6 === 0).map((q) => sx(q[0]).toFixed(1) + "," + sy(q[1]).toFixed(1)).join(" "), class: "pg-region " + (mode ? "b" : "a") }, chart);
      const lev = err(sol[0], sol[1]);
      [0.3, 0.6, lev, lev * 1.35].forEach((s, k) => {
        if (s <= 0) return;
        let d = ""; for (let i = 0; i <= 120; i++) { const a = i / 120 * 2 * Math.PI, u = Math.cos(a) * ax[0] * s, v = Math.sin(a) * ax[1] * s; const x = C[0] + u * Math.cos(ang) - v * Math.sin(ang), yy = C[1] + u * Math.sin(ang) + v * Math.cos(ang); d += (i ? "L" : "M") + sx(x).toFixed(1) + " " + sy(yy).toFixed(1); }
        svg("path", { d, class: k === 2 ? "pg-contour hot" : "pg-contour" }, chart);
      });
      svg("circle", { cx: sx(C[0]), cy: sy(C[1]), r: 4, class: "pg-dot" }, chart); txt(chart, sx(C[0]) + 7, sy(C[1]) - 7, t({ tr: "EKK çözümü", en: "OLS solution" }), "pg-lbl", "start");
      svg("circle", { cx: sx(sol[0]), cy: sy(sol[1]), r: 6.5, class: "pg-dot hot" }, chart);
      txt(chart, sx(hi[0]) - 4, sy(0) + 16, "β₁", "pg-lbl", "end"); txt(chart, sx(0) + 6, sy(hi[1]) + 12, "β₂", "pg-lbl", "start");
      const zero = Math.abs(sol[1]) < 0.02 || Math.abs(sol[0]) < 0.02;
      tiles.innerHTML = "";
      tiles.append(tile(h, "β₁", fmt(sol[0], 2, lang)), tile(h, "β₂", fmt(Math.abs(sol[1]) < 0.005 ? 0 : sol[1], 2, lang), zero ? "win" : ""), tile(h, t({ tr: "Durum", en: "Status" }), inside ? t({ tr: "bütçe bağlamıyor = EKK", en: "budget not binding = OLS" }) : zero ? t({ tr: "köşe çözümü", en: "corner solution" }) : t({ tr: "iç nokta", en: "interior point" })));
      box.innerHTML = ""; box.append(chart);
      note.textContent = t({ tr: "Elipsler eşit hata eğrileri, renkli bölge izin verilen katsayılar. Çözüm, bölgeye değen ilk elipsin değdiği noktadır. Baklava diliminin sivri köşeleri eksenlerin üzerindedir; bu yüzden Lasso'da çözüm sık sık bir köşeye düşer ve bir katsayı tam sıfır olur. Bütçeyi küçültüp büyüt.", en: "Ellipses are equal-error contours; the coloured region is the allowed coefficients. The solution is where the first ellipse touches the region. The diamond's sharp corners lie on the axes, so with Lasso the solution often lands on a corner and a coefficient becomes exactly zero. Shrink and enlarge the budget." });
    }
    host.append(ctrls, tiles, box, note);
    draw();
  };

  /* =====================================================================
   * lambdaPath — Lasso: λ ve katsayılar; çapraz doğrulamayla λ seçimi
   * ===================================================================== */
  P.lambdaPath = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    let lg = -1.5, seed = 1, cv = null;
    const testSet = world(rng(777), 2000);
    let Xs, Xt, y;
    function data() { const d = world(rng(seed * 104729), 100), s = scaler(d.X); Xs = s(d.X); Xt = s(testSet.X); y = d.y; cv = null; }
    data();
    const GRID = logspace(-3, 0, 31);
    function runCV() {
      const n = y.length, u = rng(seed * 13 + 5), perm = Array.from({ length: n }, (_, i) => i);
      for (let i = n - 1; i > 0; i--) { const j = Math.floor(u() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
      const err = GRID.map(() => 0);
      for (let k = 0; k < 5; k++) {
        const vi = perm.filter((_, i) => i % 5 === k), ti = perm.filter((_, i) => i % 5 !== k);
        const Xa = ti.map((i) => Xs[i]), ya = ti.map((i) => y[i]), Xv = vi.map((i) => Xs[i]), yv = vi.map((i) => y[i]);
        let warm = null;
        for (let g = GRID.length - 1; g >= 0; g--) { const m = lasso(Xa, ya, GRID[g], warm); warm = m.b; err[g] += mse(predict(m, Xv), yv) / 5; }
      }
      const best = err.indexOf(Math.min(...err));
      cv = { err, best };
      lg = Math.log10(GRID[best]); sl.value = lg;
    }
    const lab = h("b");
    const sl = slider(h, -3, 0, 0.05, lg, (v) => { lg = v; ctx.touch(); draw(); });
    const ctrls = h("div", { class: "pg-ctrls" },
      h("label", null, h("span", null, "λ = ", lab), sl),
      h("button", { class: "btn sm", onclick: () => { runCV(); ctx.touch(); draw(); } }, t({ tr: "λ'yı 5-katlı çapraz doğrulamayla seç", en: "Choose λ with 5-fold cross-validation" })),
      h("button", { class: "btn sm ghost", onclick: () => { seed++; data(); ctx.touch(); draw(); } }, t({ tr: "Yeni 100 kişi", en: "New 100 people" })));
    const tiles = h("div", { class: "tiles" }), box = h("div"), note = h("p", { class: "pg-note" });
    function draw() {
      const lam = Math.pow(10, lg);
      lab.textContent = fmt(lam, 3, lang);
      const m = lasso(Xs, y, lam), nz = m.b.filter((v) => Math.abs(v) > 1e-10).length;
      const realKept = m.b.slice(0, 5).filter((v) => Math.abs(v) > 1e-10).length, irr = nz - realKept - (Math.abs(m.b[5]) > 1e-10 ? 1 : 0);
      tiles.innerHTML = "";
      tiles.append(tile(h, t({ tr: "Seçilen değişken", en: "Variables kept" }), nz + " / 40"), tile(h, t({ tr: "Gerçek 5'ten seçilen", en: "Of the real 5, kept" }), realKept + " / 5"), tile(h, t({ tr: "İlgisiz anket sorusu", en: "Irrelevant survey items" }), irr), tile(h, t({ tr: "Test HKO", en: "Test MSE" }), fmt(mse(predict(m, Xt), testSet.y), 3, lang)));
      const parts = [coefBars(h, t, m.b, -0.3, 0.6)];
      if (cv) {
        const W = 560, H = 150, Lm = 46, R = W - 12, T = 10, B = H - 26, lo = Math.min(...cv.err) * 0.9, hi = Math.min(Math.max(...cv.err), lo * 3);
        const c = svg("svg", { viewBox: `0 0 ${W} ${H}`, class: "pg-svg", role: "img" });
        const sx = (g) => Lm + g / (GRID.length - 1) * (R - Lm), sy = (v) => B - (Math.min(hi, v) - lo) / (hi - lo) * (B - T);
        svg("rect", { x: Lm, y: T, width: R - Lm, height: B - T, class: "pg-frame" }, c);
        svg("path", { d: cv.err.map((v, g) => (g ? "L" : "M") + sx(g).toFixed(1) + " " + sy(v).toFixed(1)).join(""), class: "pg-line a" }, c);
        svg("line", { x1: sx(cv.best), x2: sx(cv.best), y1: T, y2: B, class: "pg-ref" }, c);
        [0, 10, 20, 30].forEach((g) => txt(c, sx(g), B + 16, fmt(GRID[g], 3, lang)));
        txt(c, Lm + 6, T + 14, t({ tr: "çapraz doğrulama hatası (λ'ya göre)", en: "cross-validation error (by λ)" }), "pg-lbl", "start");
        parts.push(c);
      }
      box.innerHTML = ""; box.append(...parts);
      note.textContent = t({ tr: "λ büyüdükçe çubuklar teker teker tam sıfıra düşer. Çapraz doğrulama düğmesi, eğitim verisini 5 kata bölüp her λ için doğrulama hatasını hesaplar ve en küçüğünü seçer; test verisine dokunmaz.", en: "As λ grows the bars drop to exactly zero one by one. The cross-validation button splits the training data into 5 folds, computes the validation error for each λ and picks the smallest; it never touches the test data." });
    }
    host.append(ctrls, tiles, box, note);
    draw();
  };

  /* =====================================================================
   * selectStab — Deneyim ile Yaş: Lasso hangisini seçer? (sabit λ, 60 örneklem)
   * ===================================================================== */
  P.selectStab = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    let rho = 0.97, seed = 1;
    const lab = h("b");
    const ctrls = h("div", { class: "pg-ctrls" },
      h("label", null, h("span", null, t({ tr: "Deneyim ile Yaş arasındaki korelasyon = ", en: "Correlation between Experience and Age = " }), lab), slider(h, 0.8, 0.999, 0.001, rho, (v) => { rho = v; lab.textContent = fmt(rho, 3, lang); })),
      h("button", { class: "btn sm", onclick: () => { ctx.touch(); run(); } }, t({ tr: "60 örneklemle dene", en: "Try with 60 samples" })));
    const tiles = h("div", { class: "tiles" }), box = h("div"), note = h("p", { class: "pg-note" });
    lab.textContent = fmt(rho, 3, lang);
    function run() {
      const R = 60, cnt = { d: 0, b: 0, a: 0, n: 0 };
      for (let r = 0; r < R; r++) {
        const d = world(rng(seed * 50021 + r * 17 + Math.round(rho * 1000)), 100, rho), s = scaler(d.X);
        const m = lasso(s(d.X), d.y, 0.04);
        const de = Math.abs(m.b[1]) > 1e-10, ya = Math.abs(m.b[5]) > 1e-10;
        cnt[de && ya ? "b" : de ? "d" : ya ? "a" : "n"]++;
      }
      seed++;
      tiles.innerHTML = "";
      const pc = (k) => (lang === "tr" ? "%" + Math.round(100 * cnt[k] / R) : Math.round(100 * cnt[k] / R) + "%");
      tiles.append(tile(h, t({ tr: "Yalnızca Deneyim", en: "Experience only" }), pc("d")), tile(h, t({ tr: "İkisi birden", en: "Both" }), pc("b")), tile(h, t({ tr: "Yalnızca Yaş", en: "Age only" }), pc("a"), cnt.a > 0.2 * R ? "warn" : ""), tile(h, t({ tr: "Hiçbiri", en: "Neither" }), pc("n")));
      const W = 560, H = 60, chart = svg("svg", { viewBox: `0 0 ${W} ${H}`, class: "pg-svg", role: "img" });
      let x = 10; [["d", "c1"], ["b", "c2"], ["a", "c3"], ["n", "c6"]].forEach(([k, c]) => { const w = cnt[k] / R * (W - 20); if (w > 0) { svg("rect", { x, y: 12, width: w, height: 34, class: "pg-bar " + c }, chart); x += w; } });
      box.innerHTML = ""; box.append(chart);
      note.textContent = t({ tr: "Gerçekte ücreti Deneyim belirliyor; Yaş'ın kendi etkisi yok. Korelasyon 1'e yaklaştıkça iki değişken neredeyse aynılaşır ve Lasso hangisini seçeceğine örneklemden örnekleme farklı karar verir. (Hız için λ = 0,04 sabit tutuldu; derste λ çapraz doğrulamayla seçiliyor.)", en: "In truth Experience drives wages; Age has no effect of its own. As the correlation approaches 1 the two variables become almost identical, and Lasso decides differently from sample to sample which to keep. (For speed λ is fixed at 0.04; in the course λ is chosen by cross-validation.)" });
    }
    host.append(ctrls, tiles, box, note);
    run();
  };

  /* =====================================================================
   * inflationRace — test döneminde gerçekleşen ve öngörüler (önceden hesaplanmış)
   * ===================================================================== */
  P.inflationRace = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    const D = (window.M3_NUMS || {}).race;
    if (!D) { host.append(h("p", { class: "muted" }, t({ tr: "Veri bulunamadı.", en: "Data not found." }))); return; }
    const MODELS = [["saf", { tr: "Saf öngörü", en: "Naive" }, "c6"], ["ekk", { tr: "EKK (51 değişken)", en: "OLS (51 variables)" }, "c4"], ["ridge", { tr: "Ridge", en: "Ridge" }, "c2"], ["lasso", { tr: "Lasso", en: "Lasso" }, "c0"], ["baz", { tr: "2 değişken: enflasyon + baz etkisi", en: "2 variables: inflation + base effect" }, "c1"]];
    const on = { saf: true, ekk: false, ridge: false, lasso: true, baz: false };
    let period = 0;
    const PER = [{ tr: "Tüm test dönemi", en: "Whole test period" }, { tr: "2015–2019", en: "2015–2019" }, { tr: "2020 →", en: "2020 →" }];
    const tabs = h("div", { class: "tabs" }), checks = h("div", { class: "pg-checks" });
    const tiles = h("div", { class: "tiles" }), box = h("div"), note = h("p", { class: "pg-note" });
    function idx() { return D.d.map((d, i) => [d, i]).filter(([d]) => (period === 0 ? true : period === 1 ? d < "2020-01" : d >= "2020-01")).map(([, i]) => i); }
    function rm(k, I) { let s = 0; I.forEach((i) => (s += (D[k][i] - D.y[i]) ** 2)); return Math.sqrt(s / I.length); }
    function draw() {
      tabs.innerHTML = ""; PER.forEach((p, i) => tabs.append(h("button", { class: i === period ? "on" : "", onclick: () => { period = i; ctx.touch(); draw(); } }, t(p))));
      checks.innerHTML = "";
      MODELS.forEach(([k, l, c]) => { const cb = h("input", { type: "checkbox" }); cb.checked = on[k]; cb.addEventListener("change", () => { on[k] = cb.checked; ctx.touch(); draw(); }); checks.append(h("label", { class: "pg-check" }, cb, h("span", { class: "pg-swatch " + c }), h("span", null, t(l)))); });
      const I = idx();
      tiles.innerHTML = "";
      MODELS.forEach(([k, l]) => { const v = rm(k, I); tiles.append(tile(h, t(l), fmt(v, 2, lang), k !== "saf" && v < rm("saf", I) ? "win" : "")); });
      const W = 600, H = 250, Lm = 36, R = W - 10, T = 10, B = H - 26;
      const ys = I.map((i) => D.y[i]); let lo = Math.min(...ys) - 0.8, hi = Math.max(...ys) + 0.8;
      const chart = svg("svg", { viewBox: `0 0 ${W} ${H}`, class: "pg-svg", role: "img" });
      const sx = (k) => Lm + k / (I.length - 1) * (R - Lm), sy = (v) => B - (Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo) * (B - T);
      svg("rect", { x: Lm, y: T, width: R - Lm, height: B - T, class: "pg-frame" }, chart);
      for (let v = Math.ceil(lo); v <= hi; v++) if (v % (hi - lo > 6 ? 2 : 1) === 0) txt(chart, Lm - 5, sy(v) + 4, v, "pg-lbl", "end");
      I.forEach((i, k) => { if (D.d[i].endsWith("-01")) txt(chart, sx(k), B + 16, D.d[i].slice(0, 4)); });
      const line = (k, cls) => svg("path", { d: I.map((i, j) => (j ? "L" : "M") + sx(j).toFixed(1) + " " + sy(D[k][i]).toFixed(1)).join(""), class: cls }, chart);
      line("y", "pg-true");
      MODELS.forEach(([k, , c]) => { if (on[k]) line(k, "pg-line " + c); });
      box.innerHTML = ""; box.append(chart);
      note.textContent = t({ tr: "Kesikli siyah çizgi gerçekleşen enflasyon (bir sonraki ay). Kutucuklar test kök HKO'su (puan); yeşil, saf öngörüyü geçen modeller. Bütün modeller yalnızca 1984–2014 verisiyle kuruldu ve hiç yeniden kestirilmedi.", en: "The dashed black line is actual inflation (the next month). Tiles show test RMSE (points); green marks models that beat the naive forecast. All models were built on 1984–2014 data only and never re-estimated." });
    }
    host.append(tabs, checks, tiles, box, note, h("p", { class: "pg-src" }, t({ tr: "Veri: FRED, 13 seri; hedef CPIAUCSL'nin 12 aylık değişimi. Öngörüler tools/m3_figs.py ile Python'da hesaplandı.", en: "Data: FRED, 13 series; the target is the 12-month change in CPIAUCSL. Forecasts were computed in Python with tools/m3_figs.py." })));
    draw();
  };
})();
