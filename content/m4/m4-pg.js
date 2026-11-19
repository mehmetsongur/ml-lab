/* Modül 4 — oyun alanları: EKK ve lojistik eğri, odds oranı, eşik ve karışıklık matrisi,
 * ROC eğrisi, maliyete göre eşik, dengesiz veri.
 * Hesaplar tarayıcıda, JavaScript ile yapılır: kredi dünyası dersin 5. hafta notebook'undaki tarifle üretilir
 * (rastgele sayılar farklı olduğu için sonuçlar hücrelerdekilerden biraz farklı olabilir);
 * lojistik regresyon Newton–Raphson (IRLS) ile tahmin edilir (ceza yok: C = 1e6 ile aynı).
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
  function pct(x, d, lang) { const s = fmt(100 * x, d, lang); return lang === "tr" ? "%" + s : s + "%"; }
  function slider(h, min, max, step, val, on) { const el = h("input", { type: "range", min, max, step, value: val }); el.addEventListener("input", (e) => on(+e.target.value)); return el; }
  function check(h, label, val, on) { const box = h("input", { type: "checkbox" }); box.checked = val; box.addEventListener("change", (e) => on(e.target.checked)); return h("label", { class: "pg-check" }, box, h("span", null, label)); }

  /* ---------------- rastgele sayılar ve kredi dünyası ---------------- */
  function rng(seed) { let x = seed >>> 0; return () => { x = (x + 0x6D2B79F5) >>> 0; let z = x; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; }; }
  function normal(u) { let a = 0; while (a === 0) a = u(); return Math.sqrt(-2 * Math.log(a)) * Math.cos(2 * Math.PI * u()); }
  const sig = (z) => 1 / (1 + Math.exp(-z));
  const BETA = [0.9, 1.1, -0.6, -0.4, 0.5, 0.0];
  /* Notebook'taki ciz(n, sabit) ile aynı tarif */
  function world(u, n, c0) {
    c0 = c0 == null ? -3.0 : c0;
    const X = [], y = [], p = [];
    for (let i = 0; i < n; i++) {
      const x = []; for (let j = 0; j < 6; j++) x.push(normal(u));
      x[1] = u() < 0.15 ? 1 : 0;
      x[4] = 0.4 * x[0] + Math.sqrt(0.84) * x[4];
      x[5] = 0.5 * x[3] + Math.sqrt(0.75) * x[5];
      let z = c0; for (let j = 0; j < 6; j++) z += BETA[j] * x[j];
      const pi = sig(z);
      X.push(x); p.push(pi); y.push(u() < pi ? 1 : 0);
    }
    return { X, y, p };
  }
  function solve(A, b) {
    const n = b.length, M = A.map((r, i) => r.concat([b[i]]));
    for (let c = 0; c < n; c++) {
      let mx = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[mx][c])) mx = r;
      [M[c], M[mx]] = [M[mx], M[c]];
      for (let r = c + 1; r < n; r++) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
    }
    const x = new Array(n).fill(0);
    for (let r = n - 1; r >= 0; r--) { let s = M[r][n]; for (let k = r + 1; k < n; k++) s -= M[r][k] * x[k]; x[r] = s / M[r][r]; }
    return x;
  }
  /* Lojistik regresyon (sabit + seçilen sütunlar), isteğe bağlı sınıf ağırlıkları ("balanced") */
  function logit(X, y, cols, balanced) {
    const n = y.length, k = cols.length + 1, row = (i) => [1].concat(cols.map((j) => X[i][j]));
    const n1 = y.reduce((s, v) => s + v, 0), w1 = balanced ? n / (2 * n1) : 1, w0 = balanced ? n / (2 * (n - n1)) : 1;
    let b = new Array(k).fill(0);
    for (let it = 0; it < 30; it++) {
      const H = Array.from({ length: k }, () => new Array(k).fill(1e-9)), g = new Array(k).fill(0);
      for (let i = 0; i < n; i++) {
        const r = row(i); let z = 0; for (let a = 0; a < k; a++) z += b[a] * r[a];
        const pi = sig(z), w = y[i] ? w1 : w0, s = w * pi * (1 - pi), e = w * (y[i] - pi);
        for (let a = 0; a < k; a++) { g[a] += e * r[a]; for (let c = a; c < k; c++) H[a][c] += s * r[a] * r[c]; }
      }
      for (let a = 0; a < k; a++) for (let c = 0; c < a; c++) H[a][c] = H[c][a];
      const d = solve(H, g); let mx = 0;
      b = b.map((v, a) => { mx = Math.max(mx, Math.abs(d[a])); return v + d[a]; });
      if (mx < 1e-8) break;
    }
    return { b, cols, prob: (Z) => Z.map((x) => { let z = b[0]; cols.forEach((j, a) => (z += b[a + 1] * x[j])); return sig(z); }) };
  }
  /* AUC: rastgele bir temerrütçünün rastgele bir ödeyenden yüksek olasılık alma oranı (sıra toplamıyla) */
  function auc(y, p) {
    const idx = p.map((v, i) => i).sort((a, b) => p[a] - p[b]);
    let r = 0, n1 = 0, i = 0;
    while (i < idx.length) { let j = i; while (j + 1 < idx.length && p[idx[j + 1]] === p[idx[i]]) j++; const rk = (i + j) / 2 + 1; for (let k = i; k <= j; k++) if (y[idx[k]]) { r += rk; n1++; } i = j + 1; }
    const n0 = y.length - n1; return (r - n1 * (n1 + 1) / 2) / (n1 * n0);
  }
  function cm(y, p, thr) { let tp = 0, fp = 0, fn = 0, tn = 0; for (let i = 0; i < y.length; i++) { const d = p[i] >= thr; if (d && y[i]) tp++; else if (d) fp++; else if (y[i]) fn++; else tn++; } return { tp, fp, fn, tn, n: y.length, acc: (tp + tn) / y.length, rec: tp / (tp + fn || 1), prec: tp + fp ? tp / (tp + fp) : NaN, spec: tn / (tn + fp || 1) }; }

  /* Ortak veri: 3.000 eğitim, 20.000 test başvurusu (ilk açılışta bir kez) */
  let SHARED = null;
  function shared() {
    if (SHARED) return SHARED;
    const u = rng(2026), tr = world(u, 3000), te = world(u, 20000);
    const full = logit(tr.X, tr.y, [0, 1, 2, 3, 4, 5]), weak = logit(tr.X, tr.y, [2, 5]);
    SHARED = { tr, te, p: full.prob(te.X), pw: weak.prob(te.X) };
    return SHARED;
  }
  const Ttr = (lang, tr, en) => (lang === "tr" ? tr : en);

  /* İki grubun olasılık dağılımı (her grup kendi içinde oran), eşik çizgisi */
  function hist(h, t, lang, y, p, thr, opts) {
    opts = opts || {};
    const W = 560, H = 190, Lm = 40, R = W - 10, T = 12, B = H - 30, K = opts.bins || 40, top = opts.top || 1;
    const c0 = new Array(K).fill(0), c1 = new Array(K).fill(0); let n0 = 0, n1 = 0;
    for (let i = 0; i < y.length; i++) { const k = Math.min(K - 1, Math.floor(p[i] / top * K)); if (p[i] > top) continue; if (y[i]) { c1[k]++; n1++; } else { c0[k]++; n0++; } }
    const f0 = c0.map((v) => v / n0), f1 = c1.map((v) => v / n1), hi = Math.max(...f0, ...f1) * 1.08;
    const chart = svg("svg", { viewBox: `0 0 ${W} ${H}`, class: "pg-svg", role: "img" });
    const sx = (v) => Lm + v / top * (R - Lm), sy = (v) => B - v / hi * (B - T), bw = (R - Lm) / K;
    svg("rect", { x: Lm, y: T, width: R - Lm, height: B - T, class: "pg-frame" }, chart);
    for (let k = 0; k < K; k++) {
      svg("rect", { x: Lm + k * bw + 1, y: sy(f0[k]), width: bw / 2 - 1, height: B - sy(f0[k]), class: "pg-bar c0" }, chart);
      svg("rect", { x: Lm + k * bw + bw / 2, y: sy(f1[k]), width: bw / 2 - 1, height: B - sy(f1[k]), class: "pg-bar c4" }, chart);
    }
    for (let v = 0; v <= top + 1e-9; v += top / 5) txt(chart, sx(v), B + 16, fmt(v, top < 1 ? 2 : 1, lang));
    if (thr <= top) { svg("line", { x1: sx(thr), x2: sx(thr), y1: T, y2: B, class: "pg-line c0", "stroke-dasharray": "5 4" }, chart); txt(chart, Math.min(sx(thr) + 4, R - 60), T + 13, t({ tr: "eşik ", en: "threshold " }) + fmt(thr, 2, lang), "pg-lbl", "start"); }
    txt(chart, R - 6, T + 30, t({ tr: "yeşil: ödeyenler · pembe: temerrüde düşenler", en: "green: payers · pink: defaulters" }), "pg-lbl", "end");
    txt(chart, (Lm + R) / 2, H - 1, t({ tr: "öngörülen temerrüt olasılığı", en: "predicted default probability" }));
    return chart;
  }
  function matrix(h, t, lang, c) {
    const td = (v, cls) => h("td", cls ? { class: cls } : null, String(v));
    return h("div", { class: "pg-tablewrap" }, h("table", { class: "pg-table" },
      h("thead", null, h("tr", null, h("th", null, ""), h("th", null, t({ tr: "Karar: temerrüt (ret)", en: "Decision: default (reject)" })), h("th", null, t({ tr: "Karar: öder (onay)", en: "Decision: pays (approve)" })))),
      h("tbody", null,
        h("tr", null, td(t({ tr: "Gerçek: temerrüt", en: "Actual: default" }), "k"), td(t({ tr: "DP ", en: "TP " }) + c.tp, "one"), td(t({ tr: "YN ", en: "FN " }) + c.fn)),
        h("tr", null, td(t({ tr: "Gerçek: öder", en: "Actual: pays" }), "k"), td(t({ tr: "YP ", en: "FP " }) + c.fp), td(t({ tr: "DN ", en: "TN " }) + c.tn, "one")))));
  }

  /* =====================================================================
   * lpmVsLogit — aynı veriye düz çizgi (EKK) ve S eğrisi (lojistik)
   * ===================================================================== */
  P.lpmVsLogit = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    let b = 1.2, seed = 1;
    let d = null;
    function data() {
      const u = rng(seed * 7919 + Math.round(b * 100)), x = [], y = [];
      for (let i = 0; i < 600; i++) { const v = normal(u); x.push(v); y.push(u() < sig(-2.6 + b * v) ? 1 : 0); }
      const n = x.length, mx = x.reduce((s, v) => s + v, 0) / n, my = y.reduce((s, v) => s + v, 0) / n;
      let sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; }
      const s1 = sxy / sxx, s0 = my - s1 * mx;
      const L = logit(x.map((v) => [v]), y, [0]);
      d = { x, y, s0, s1, L };
    }
    const lab = h("b");
    const ctrls = h("div", { class: "pg-ctrls" },
      h("label", null, h("span", null, t({ tr: "Borç/gelir oranının gerçek etkisi (log-odds) = ", en: "True effect of the debt/income ratio (log-odds) = " }), lab), slider(h, 0.2, 3, 0.1, b, (v) => { b = v; ctx.touch(); data(); draw(); })),
      h("button", { class: "btn sm", onclick: () => { seed++; data(); ctx.touch(); draw(); } }, t({ tr: "Yeni 600 başvuru çek", en: "Draw 600 new applications" })));
    const tiles = h("div", { class: "tiles" }), box = h("div"), note = h("p", { class: "pg-note" });
    function draw() {
      lab.textContent = fmt(b, 1, lang);
      const lpm = d.x.map((v) => d.s0 + d.s1 * v), lg = d.L.prob(d.x.map((v) => [v]));
      const neg = lpm.filter((v) => v < 0).length / lpm.length, big = lpm.filter((v) => v > 1).length / lpm.length;
      tiles.innerHTML = "";
      tiles.append(tile(h, t({ tr: "Temerrüt oranı", en: "Default rate" }), pct(d.y.reduce((s, v) => s + v, 0) / d.y.length, 1, lang)),
        tile(h, t({ tr: "EKK: olasılık < 0", en: "OLS: probability < 0" }), pct(neg, 1, lang), neg > 0 ? "warn" : ""),
        tile(h, t({ tr: "EKK: olasılık > 1", en: "OLS: probability > 1" }), pct(big, 1, lang), big > 0 ? "warn" : ""),
        tile(h, t({ tr: "Lojistik: en düşük–en yüksek", en: "Logistic: lowest–highest" }), fmt(Math.min(...lg), 3, lang) + "–" + fmt(Math.max(...lg), 3, lang), "win"));
      const W = 560, H = 230, Lm = 40, R = W - 10, T = 12, B = H - 30, lo = -0.4, hi = 1.15, xl = -3.2, xh = 3.2;
      const chart = svg("svg", { viewBox: `0 0 ${W} ${H}`, class: "pg-svg", role: "img" });
      const sx = (v) => Lm + (v - xl) / (xh - xl) * (R - Lm), sy = (v) => B - (Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo) * (B - T);
      svg("rect", { x: Lm, y: T, width: R - Lm, height: B - T, class: "pg-frame" }, chart);
      svg("rect", { x: Lm, y: sy(0), width: R - Lm, height: B - sy(0), class: "pg-region b", opacity: 0.6 }, chart);
      svg("rect", { x: Lm, y: T, width: R - Lm, height: sy(1) - T, class: "pg-region b", opacity: 0.6 }, chart);
      [0, 0.5, 1].forEach((v) => { txt(chart, Lm - 5, sy(v) + 4, fmt(v, 1, lang), "pg-lbl", "end"); svg("line", { x1: Lm, x2: R, y1: sy(v), y2: sy(v), class: "pg-axis" }, chart); });
      [-3, -2, -1, 0, 1, 2, 3].forEach((v) => txt(chart, sx(v), B + 16, v));
      const u = rng(5);
      d.x.forEach((v, i) => { if (v < xl || v > xh) return; svg("circle", { cx: sx(v), cy: sy(d.y[i]) + (u() - 0.5) * 14 * (d.y[i] ? 1 : -1) * 0.8, r: 2.2, class: "pg-dot" + (d.y[i] ? " hot" : "") }, chart); });
      svg("line", { x1: sx(xl), x2: sx(xh), y1: sy(d.s0 + d.s1 * xl), y2: sy(d.s0 + d.s1 * xh), class: "pg-line c4" }, chart);
      let path = ""; for (let v = xl; v <= xh + 1e-9; v += 0.05) path += (path ? "L" : "M") + sx(v).toFixed(1) + " " + sy(d.L.prob([[v]])[0]).toFixed(1);
      svg("path", { d: path, class: "pg-line c0" }, chart);
      txt(chart, Lm + 6, sy(-0.2), t({ tr: "olasılık olamayacak bölge", en: "region no probability can be in" }), "pg-lbl", "start");
      txt(chart, (Lm + R) / 2, H - 1, t({ tr: "borç/gelir oranı (standartlaştırılmış)", en: "debt/income ratio (standardised)" }));
      box.innerHTML = ""; box.append(chart);
      note.textContent = t({ tr: "Noktalar başvurular: üstte temerrüde düşenler (1), altta ödeyenler (0). Pembe düz çizgi EKK (doğrusal olasılık modeli), yeşil S eğrisi lojistik regresyon. Gölgeli bölgeler 0'ın altı ve 1'in üstü.", en: "Dots are applications: defaulters (1) at the top, payers (0) at the bottom. The pink straight line is OLS (the linear probability model), the green S curve logistic regression. The shaded regions are below 0 and above 1." });
    }
    host.append(ctrls, tiles, box, note);
    data(); draw();
  };

  /* =====================================================================
   * logitCurve — sabit ve katsayı S eğrisini nasıl değiştirir; odds oranı
   * ===================================================================== */
  P.logitCurve = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    let a = -2, b = 0.8, x0 = 0;
    const la = h("b"), lb = h("b"), lx = h("b");
    const ctrls = h("div", { class: "pg-ctrls" },
      h("label", null, h("span", null, t({ tr: "Sabit = ", en: "Constant = " }), la), slider(h, -5, 3, 0.1, a, (v) => { a = v; ctx.touch(); draw(); })),
      h("label", null, h("span", null, t({ tr: "Katsayı (log-odds) = ", en: "Coefficient (log-odds) = " }), lb), slider(h, -2, 3, 0.05, b, (v) => { b = v; ctx.touch(); draw(); })),
      h("label", null, h("span", null, t({ tr: "Başlangıç noktası x = ", en: "Starting point x = " }), lx), slider(h, -3, 2, 0.1, x0, (v) => { x0 = v; ctx.touch(); draw(); })));
    const tiles = h("div", { class: "tiles" }), box = h("div"), note = h("p", { class: "pg-note" });
    function draw() {
      la.textContent = fmt(a, 1, lang); lb.textContent = fmt(b, 2, lang); lx.textContent = fmt(x0, 1, lang);
      const p0 = sig(a + b * x0), p1 = sig(a + b * (x0 + 1));
      tiles.innerHTML = "";
      tiles.append(tile(h, t({ tr: "Odds oranı e^b", en: "Odds ratio e^b" }), fmt(Math.exp(b), 2, lang)),
        tile(h, t({ tr: "Olasılık, x", en: "Probability at x" }), pct(p0, 1, lang)),
        tile(h, t({ tr: "Olasılık, x + 1", en: "Probability at x + 1" }), pct(p1, 1, lang)),
        tile(h, t({ tr: "Değişim (puan)", en: "Change (points)" }), fmt(100 * (p1 - p0), 1, lang)),
        tile(h, t({ tr: "Olasılık oranı", en: "Probability ratio" }), fmt(p1 / p0, 2, lang), Math.abs(p1 / p0 - Math.exp(b)) > 0.05 ? "warn" : ""));
      const W = 560, H = 220, Lm = 40, R = W - 10, T = 12, B = H - 30, xl = -4, xh = 4;
      const chart = svg("svg", { viewBox: `0 0 ${W} ${H}`, class: "pg-svg", role: "img" });
      const sx = (v) => Lm + (v - xl) / (xh - xl) * (R - Lm), sy = (v) => B - v * (B - T);
      svg("rect", { x: Lm, y: T, width: R - Lm, height: B - T, class: "pg-frame" }, chart);
      [0, 0.25, 0.5, 0.75, 1].forEach((v) => { txt(chart, Lm - 5, sy(v) + 4, fmt(v, 2, lang), "pg-lbl", "end"); svg("line", { x1: Lm, x2: R, y1: sy(v), y2: sy(v), class: "pg-axis" }, chart); });
      for (let v = -4; v <= 4; v++) txt(chart, sx(v), B + 16, v);
      let path = ""; for (let v = xl; v <= xh + 1e-9; v += 0.05) path += (path ? "L" : "M") + sx(v).toFixed(1) + " " + sy(sig(a + b * v)).toFixed(1);
      svg("path", { d: path, class: "pg-line c0" }, chart);
      [[x0, p0], [x0 + 1, p1]].forEach(([xv, pv]) => { svg("line", { x1: sx(xv), x2: sx(xv), y1: B, y2: sy(pv), class: "pg-ref" }, chart); svg("circle", { cx: sx(xv), cy: sy(pv), r: 5, class: "pg-dot hot" }, chart); });
      txt(chart, (Lm + R) / 2, H - 1, "x");
      box.innerHTML = ""; box.append(chart);
      note.textContent = t({ tr: "p = 1 / (1 + e^−(sabit + katsayı·x)). x bir birim artınca odds her yerde aynı oranda (e^b) çarpılır; olasılıktaki değişim ise başlangıç noktasına bağlıdır. Başlangıç noktasını kaydırıp “değişim (puan)” ve “olasılık oranı”nın nasıl değiştiğine bak.", en: "p = 1 / (1 + e^−(constant + coefficient·x)). When x rises by one unit the odds are multiplied by the same factor (e^b) everywhere; the change in probability depends on the starting point. Move the starting point and watch “change (points)” and “probability ratio” change." });
    }
    host.append(ctrls, tiles, box, note);
    draw();
  };

  /* =====================================================================
   * thresholdMatrix — eşik, dağılımlar, karışıklık matrisi (ve isteğe bağlı ölçü eğrileri)
   * ===================================================================== */
  P.thresholdMatrix = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    const S = shared(), y = S.te.y, p = S.p;
    let thr = 0.5;
    const lab = h("b");
    const ctrls = h("div", { class: "pg-ctrls" }, h("label", null, h("span", null, t({ tr: "Eşik = ", en: "Threshold = " }), lab), slider(h, 0.02, 0.9, 0.01, thr, (v) => { thr = v; ctx.touch(); draw(); })));
    const tiles = h("div", { class: "tiles" }), box = h("div"), note = h("p", { class: "pg-note" });
    const info = h("p", { class: "muted small" }, t({ tr: "Veri: tarayıcıda üretilen kendi çekilişi (3.000 eğitim, 20.000 test başvurusu); sayıları Kavram tablosundaki atölye örnekleminden farklıdır. Karar kuralı: p ≥ eşik ise “temerrüt” (ret).", en: "Data: this playground's own draw generated in the browser (3,000 training, 20,000 test applications); its numbers differ from the workshop sample in the Concept table. Decision rule: “default” (reject) if p ≥ threshold." }));
    const TH = Array.from({ length: 89 }, (_, i) => 0.02 + i * 0.01), CURVES = cfg && cfg.curves ? TH.map((v) => cm(y, p, v)) : null;
    function curves() {
      const W = 560, H = 200, Lm = 40, R = W - 10, T = 12, B = H - 30;
      const chart = svg("svg", { viewBox: `0 0 ${W} ${H}`, class: "pg-svg", role: "img" });
      const sx = (v) => Lm + (v - 0.02) / 0.88 * (R - Lm), sy = (v) => B - v * (B - T);
      svg("rect", { x: Lm, y: T, width: R - Lm, height: B - T, class: "pg-frame" }, chart);
      [0, 0.5, 1].forEach((v) => txt(chart, Lm - 5, sy(v) + 4, fmt(v, 1, lang), "pg-lbl", "end"));
      [0.1, 0.3, 0.5, 0.7, 0.9].forEach((v) => txt(chart, sx(v), B + 16, fmt(v, 1, lang)));
      const keys = [["acc", "c6"], ["rec", "c4"], ["prec", "c0"], ["spec", "c2"]];
      keys.forEach(([k, c]) => { let d = "", pen = false; CURVES.forEach((m, i) => { const v = m[k]; if (!isFinite(v)) { pen = false; return; } d += (pen ? "L" : "M") + sx(TH[i]).toFixed(1) + " " + sy(v).toFixed(1); pen = true; }); svg("path", { d, class: "pg-line " + c }, chart); });
      svg("line", { x1: sx(thr), x2: sx(thr), y1: T, y2: B, class: "pg-ref" }, chart);
      txt(chart, (Lm + R) / 2, H - 1, t({ tr: "eşik", en: "threshold" }));
      const leg = h("div", { class: "pg-checks" }, ...[["c6", t({ tr: "doğruluk", en: "accuracy" })], ["c4", t({ tr: "duyarlılık", en: "recall" })], ["c0", t({ tr: "kesinlik", en: "precision" })], ["c2", t({ tr: "özgüllük", en: "specificity" })]].map(([c, s]) => h("span", { class: "pg-check" }, h("span", { class: "pg-swatch " + c }), s)));
      return [chart, leg];
    }
    function draw() {
      lab.textContent = fmt(thr, 2, lang);
      const c = cm(y, p, thr), base = 1 - y.reduce((s, v) => s + v, 0) / y.length;
      tiles.innerHTML = "";
      tiles.append(tile(h, t({ tr: "Doğruluk", en: "Accuracy" }), pct(c.acc, 1, lang), c.acc > base ? "win" : ""), tile(h, t({ tr: "“Herkes öder”", en: "“Everyone pays”" }), pct(base, 1, lang)),
        tile(h, t({ tr: "Duyarlılık", en: "Recall" }), pct(c.rec, 1, lang)), tile(h, t({ tr: "Kesinlik", en: "Precision" }), isFinite(c.prec) ? pct(c.prec, 1, lang) : t({ tr: "hesaplanamaz: pozitif karar yok", en: "cannot be computed: no positive decisions" })), tile(h, t({ tr: "Özgüllük", en: "Specificity" }), pct(c.spec, 1, lang)));
      box.innerHTML = "";
      box.append(hist(h, t, lang, y, p, thr), matrix(h, t, lang, c));
      if (CURVES) box.append(...curves());
      note.textContent = t({ tr: "20.000 test başvurusu, altı özellikli lojistik regresyon (tarayıcıda yeniden üretilmiş dünya). Çubuklar her grubun kendi içindeki dağılımı. Eşiğe eşit ya da sağındakiler (p ≥ eşik) “temerrüt” sayılıp reddedilir. Eşik yükseldikçe duyarlılık hiç artmaz, özgüllük hiç düşmez; kesinlik genellikle artar ama her adımda değil (ör. 0,82 → 0,83 ya da 0,87 → 0,90'ı dene).", en: "20,000 test applications, six-feature logistic regression (world regenerated in the browser). Bars show each group's own distribution. Applications at or to the right of the threshold (p ≥ threshold) are classed “default” and rejected. As the threshold rises recall never rises and specificity never falls; precision usually rises, but not at every step (try 0.82 → 0.83 or 0.87 → 0.90)." });
    }
    host.append(ctrls, info, tiles, box, note);
    draw();
  };

  /* =====================================================================
   * rocPlay — ROC eğrisi, eşiğin eğri üzerindeki yeri, güçlü ve zayıf model
   * ===================================================================== */
  P.rocPlay = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    const S = shared(), y = S.te.y;
    let thr = 0.2, showWeak = true;
    function roc(p) { return Array.from({ length: 101 }, (_, i) => { const c = cm(y, p, i / 100); return [1 - c.spec, c.rec]; }).concat([[0, 0]]); }
    const RS = roc(S.p), RW = roc(S.pw), AS = auc(y, S.p), AW = auc(y, S.pw);
    const lab = h("b");
    const ctrls = h("div", { class: "pg-ctrls" },
      h("label", null, h("span", null, t({ tr: "Eşik = ", en: "Threshold = " }), lab), slider(h, 0.01, 0.9, 0.01, thr, (v) => { thr = v; ctx.touch(); draw(); })),
      check(h, t({ tr: "Zayıf modeli göster (yalnızca gelir + yaş)", en: "Show the weak model (income + age only)" }), showWeak, (v) => { showWeak = v; ctx.touch(); draw(); }));
    const tiles = h("div", { class: "tiles" }), box = h("div"), note = h("p", { class: "pg-note" });
    function draw() {
      lab.textContent = fmt(thr, 2, lang);
      const c = cm(y, S.p, thr);
      tiles.innerHTML = "";
      tiles.append(tile(h, t({ tr: "AUC, altı özellik", en: "AUC, six features" }), fmt(AS, 3, lang), "win"), tile(h, t({ tr: "AUC, gelir + yaş", en: "AUC, income + age" }), fmt(AW, 3, lang)),
        tile(h, t({ tr: "Yanlış pozitif oranı", en: "False positive rate" }), pct(1 - c.spec, 1, lang)), tile(h, t({ tr: "Duyarlılık", en: "Recall" }), pct(c.rec, 1, lang)));
      const W = 400, H = 330, Lm = 46, R = W - 12, T = 12, B = H - 40;
      const chart = svg("svg", { viewBox: `0 0 ${W} ${H}`, class: "pg-svg", role: "img", style: "max-width:420px" });
      const sx = (v) => Lm + v * (R - Lm), sy = (v) => B - v * (B - T);
      svg("rect", { x: Lm, y: T, width: R - Lm, height: B - T, class: "pg-frame" }, chart);
      [0, 0.5, 1].forEach((v) => { txt(chart, Lm - 5, sy(v) + 4, fmt(v, 1, lang), "pg-lbl", "end"); txt(chart, sx(v), B + 16, fmt(v, 1, lang)); });
      svg("line", { x1: sx(0), y1: sy(0), x2: sx(1), y2: sy(1), class: "pg-ref" }, chart);
      const path = (pts) => pts.map(([a, b], i) => (i ? "L" : "M") + sx(a).toFixed(1) + " " + sy(b).toFixed(1)).join("");
      if (showWeak) svg("path", { d: path(RW), class: "pg-line c6" }, chart);
      svg("path", { d: path(RS), class: "pg-line c0" }, chart);
      svg("circle", { cx: sx(1 - c.spec), cy: sy(c.rec), r: 6, class: "pg-dot hot" }, chart);
      txt(chart, sx(0.62), sy(0.5), t({ tr: "yazı tura (AUC 0,5)", en: "coin toss (AUC 0.5)" }), "pg-lbl", "start");
      txt(chart, (Lm + R) / 2, H - 12, t({ tr: "yanlış pozitif oranı (1 − özgüllük)", en: "false positive rate (1 − specificity)" }));
      const yl = txt(chart, 12, (T + B) / 2, t({ tr: "duyarlılık", en: "recall" })); yl.setAttribute("transform", `rotate(-90 12 ${(T + B) / 2})`);
      box.innerHTML = ""; box.append(chart);
      note.textContent = t({ tr: "Yeşil: altı özellikli model; gri: zayıf model. Pembe nokta seçtiğin eşik. Eşiği değiştirmek nokta eğri boyunca kayar; eğriyi yalnızca daha iyi bir model yukarı iter.", en: "Green: six-feature model; grey: weak model. The pink dot is your threshold. Changing the threshold slides the dot along the curve; only a better model pushes the curve up." });
    }
    host.append(ctrls, tiles, box, note);
    draw();
  };

  /* =====================================================================
   * costThreshold — maliyet oranı ve en ucuz eşik
   * ===================================================================== */
  P.costThreshold = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    const S = shared(), y = S.te.y, p = S.p;
    let k = 10;
    const TH = Array.from({ length: 81 }, (_, i) => i / 100), C = TH.map((v) => cm(y, p, v));
    const cost = (c) => (k * c.fn + c.fp) / c.n;
    const lab = h("b");
    const ctrls = h("div", { class: "pg-ctrls" }, h("label", null, h("span", null, t({ tr: "Kaçan bir temerrüdün maliyeti (reddedilen iyi müşteri = 1) = ", en: "Cost of a missed default (rejected good customer = 1) = " }), lab), slider(h, 1, 30, 1, k, (v) => { k = v; ctx.touch(); draw(); })));
    const tiles = h("div", { class: "tiles" }), box = h("div"), note = h("p", { class: "pg-note" });
    function draw() {
      lab.textContent = k;
      const cs = C.map(cost), i = cs.indexOf(Math.min(...cs)), theo = 1 / (1 + k), all = k * y.reduce((s, v) => s + v, 0) / y.length;
      const c5 = cost(cm(y, p, 0.5));
      tiles.innerHTML = "";
      tiles.append(tile(h, t({ tr: "En ucuz eşik", en: "Cheapest threshold" }), fmt(TH[i], 2, lang), "win"), tile(h, t({ tr: "Kuramsal eşik 1/(1+k)", en: "Theoretical threshold 1/(1+k)" }), fmt(theo, 3, lang)),
        tile(h, t({ tr: "Maliyet, en ucuz eşik", en: "Cost, cheapest threshold" }), fmt(cs[i], 3, lang)), tile(h, t({ tr: "Maliyet, eşik 0,5", en: "Cost, threshold 0.5" }), fmt(c5, 3, lang)), tile(h, t({ tr: "Maliyet, herkesi onayla", en: "Cost, approve everyone" }), fmt(all, 3, lang)));
      const W = 560, H = 220, Lm = 46, R = W - 10, T = 12, B = H - 30, hi = Math.max(all, cs[0], ...cs) * 1.05;
      const chart = svg("svg", { viewBox: `0 0 ${W} ${H}`, class: "pg-svg", role: "img" });
      const sx = (v) => Lm + v / 0.8 * (R - Lm), sy = (v) => B - Math.min(v, hi) / hi * (B - T);
      svg("rect", { x: Lm, y: T, width: R - Lm, height: B - T, class: "pg-frame" }, chart);
      [0, 0.2, 0.4, 0.6, 0.8].forEach((v) => txt(chart, sx(v), B + 16, fmt(v, 1, lang)));
      [0, 0.25, 0.5, 0.75, 1, 1.25].filter((v) => v <= hi).forEach((v) => txt(chart, Lm - 5, sy(v) + 4, fmt(v, 2, lang), "pg-lbl", "end"));
      svg("line", { x1: Lm, x2: R, y1: sy(all), y2: sy(all), class: "pg-ref" }, chart);
      txt(chart, R - 6, sy(all) - 5, t({ tr: "herkesi onayla", en: "approve everyone" }), "pg-lbl", "end");
      svg("path", { d: cs.map((v, j) => (j ? "L" : "M") + sx(TH[j]).toFixed(1) + " " + sy(v).toFixed(1)).join(""), class: "pg-line c0" }, chart);
      svg("line", { x1: sx(theo), x2: sx(theo), y1: T, y2: B, class: "pg-line c2", "stroke-dasharray": "5 4" }, chart);
      svg("circle", { cx: sx(TH[i]), cy: sy(cs[i]), r: 6, class: "pg-dot hot" }, chart);
      txt(chart, (Lm + R) / 2, H - 1, t({ tr: "eşik (başvuru başına ortalama maliyet)", en: "threshold (average cost per application)" }));
      box.innerHTML = ""; box.append(chart);
      note.textContent = t({ tr: "Pembe nokta en ucuz eşik, mor kesikli çizgi kuramsal eşik. Olasılıklar iyi ayarlıysa ikisi birbirine çok yakındır. Not: bu oyun alanında en ucuz eşik test verisinde aranıyor; bu yalnızca tanısal bir bilgidir. Gerçek bir analizde eşik ya önceden maliyetlerden (1/(1+k)) belirlenir ya da eğitim verisinde seçilir (Ünite 6, hücre 2).", en: "The pink dot is the cheapest threshold, the purple dashed line the theoretical threshold. If the probabilities are well calibrated, the two are very close. Note: in this playground the cheapest threshold is searched on the test data; that is diagnostic information only. In a real analysis the threshold is either set in advance from the costs (1/(1+k)) or chosen on the training data (Unit 6, cell 2)." });
    }
    host.append(ctrls, tiles, box, note);
    draw();
  };

  /* =====================================================================
   * imbalance — temerrüt oranı, eşik 0,5 ve sınıf ağırlıkları
   * ===================================================================== */
  P.imbalance = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    let c0 = -4.9, weighted = false;
    let D = null;
    function fit() {
      const u = rng(31 + Math.round(-c0 * 10)), tr = world(u, 3000, c0), te = world(u, 20000, c0);
      const m = logit(tr.X, tr.y, [0, 1, 2, 3, 4, 5], weighted);
      const p = m.prob(te.X);
      D = { tr, te, p, a: auc(te.y, p) };
    }
    const lab = h("b");
    const ctrls = h("div", { class: "pg-ctrls" },
      h("label", null, h("span", null, t({ tr: "Sabit (temerrüt oranını belirler) = ", en: "Constant (sets the default rate) = " }), lab), slider(h, -5.5, -2, 0.1, c0, (v) => { c0 = v; ctx.touch(); fit(); draw(); })),
      check(h, 'class_weight="balanced"', weighted, (v) => { weighted = v; ctx.touch(); fit(); draw(); }));
    const tiles = h("div", { class: "tiles" }), box = h("div"), note = h("p", { class: "pg-note" });
    function draw() {
      lab.textContent = fmt(c0, 1, lang);
      const y = D.te.y, rate = y.reduce((s, v) => s + v, 0) / y.length, c = cm(y, D.p, 0.5), mp = D.p.reduce((s, v) => s + v, 0) / D.p.length;
      tiles.innerHTML = "";
      tiles.append(tile(h, t({ tr: "Temerrüt oranı", en: "Default rate" }), pct(rate, 1, lang)), tile(h, t({ tr: "Eğitimdeki temerrüt", en: "Defaults in training" }), D.tr.y.reduce((s, v) => s + v, 0)),
        tile(h, t({ tr: "Yakalanan (eşik 0,5)", en: "Caught (threshold 0.5)" }), pct(c.rec, 1, lang), c.rec < 0.2 ? "warn" : ""),
        tile(h, t({ tr: "Ortalama olasılık", en: "Average probability" }), pct(mp, 1, lang), Math.abs(mp - rate) > 0.03 ? "warn" : "win"), tile(h, "AUC", fmt(D.a, 3, lang)));
      box.innerHTML = ""; box.append(hist(h, t, lang, y, D.p, 0.5));
      note.textContent = t({ tr: "Sabiti düşürdükçe temerrüt nadirleşir ve eşik 0,5'in sağında neredeyse kimse kalmaz. Sınıf ağırlığını açınca dağılımlar sağa kayar: yakalanan oran artar ama ortalama olasılık gerçek temerrüt oranından kopar. AUC bu dünyada az değişir; ağırlıklar modeli yeniden kestirdiği için başka verilerde daha çok değişebilir.", en: "As you lower the constant default becomes rare and almost no one is left to the right of threshold 0.5. Turning on class weights shifts the distributions right: the share caught rises but the average probability detaches from the true default rate. AUC changes little in this world; because the weights re-estimate the model, it can change more in other data." });
    }
    host.append(ctrls, tiles, box, note);
    fit(); draw();
  };
})();
