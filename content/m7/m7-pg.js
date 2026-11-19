/* Modül 7 — oyun alanları: k-ortalamalar adımları, küme sayısı seçimi, getiri eğrisi PCA'sı, ülke haritası,
 * TF-IDF, sözlükle ton, konu dönemleri, LLM etiket denetimi.
 * Gerçek veri: data/wb/countries.csv (Dünya Bankası, CC BY 4.0), data/fred/TB3MS…GS10, FEDFUNDS (FRED, kamu malı),
 * data/fomc/statements.csv (FOMC, ABD kamu malı), data/fomc/nmf_topics.json (tools/m7_figs.py ile üretilir).
 * Hesaplar tarayıcıda, JavaScript ile.
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
  function select(h, opts, val, on) { const el = h("select", null, ...opts.map(([v, s]) => { const o = h("option", { value: v }, s); if (String(v) === String(val)) o.selected = true; return o; })); el.addEventListener("change", (e) => on(e.target.value)); return el; }
  function check(h, label, val, on) { const box = h("input", { type: "checkbox" }); box.checked = val; box.addEventListener("change", (e) => on(e.target.checked)); return h("label", { class: "pg-check" }, box, h("span", null, label)); }
  function frame(W, H, maxw) { return svg("svg", { viewBox: `0 0 ${W} ${H}`, class: "pg-svg", role: "img", style: maxw ? `max-width:${maxw}px` : "" }); }
  function legend(h, items) { return h("div", { class: "pg-checks" }, ...items.map(([c, s]) => h("span", { class: "pg-check" }, h("span", { class: "pg-swatch " + c }), s))); }
  function rng(seed) { let x = seed >>> 0; return () => { x = (x + 0x6D2B79F5) >>> 0; let z = x; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; }; }
  function normal(u) { let a = 0; while (a === 0) a = u(); return Math.sqrt(-2 * Math.log(a)) * Math.cos(2 * Math.PI * u()); }
  const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
  function corr(a, b) { const ix = a.map((_, i) => i).filter((i) => isFinite(a[i]) && isFinite(b[i])); const x = ix.map((i) => a[i]), y = ix.map((i) => b[i]); const mx = mean(x), my = mean(y); let sxy = 0, sxx = 0, syy = 0; for (let i = 0; i < x.length; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; syy += (y[i] - my) ** 2; } return sxy / Math.sqrt(sxx * syy); }
  const COL = ["c0", "c1", "c4", "c3", "c2", "c6"];
  const d2 = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += (a[i] - b[i]) ** 2; return s; };

  /* k-ortalamalar (Lloyd), k-means++ benzeri başlangıç, birkaç başlangıç */
  function kmeans(X, k, seed, starts) {
    let best = null;
    for (let s = 0; s < (starts || 5); s++) {
      const u = rng(seed * 977 + s * 31 + k), n = X.length;
      const C = [X[Math.floor(u() * n)].slice()];
      while (C.length < k) { const dd = X.map((x) => Math.min(...C.map((c) => d2(x, c)))); const tot = dd.reduce((a, b) => a + b, 0); let r = u() * tot, j = 0; while (j < n - 1 && (r -= dd[j]) > 0) j++; C.push(X[j].slice()); }
      let lab = new Array(n).fill(-1);
      for (let it = 0; it < 100; it++) {
        let ch = 0;
        X.forEach((x, i) => { let bj = 0, bd = Infinity; C.forEach((c, j) => { const v = d2(x, c); if (v < bd) { bd = v; bj = j; } }); if (lab[i] !== bj) { lab[i] = bj; ch++; } });
        C.forEach((c, j) => { const m = X.filter((_, i) => lab[i] === j); if (m.length) for (let d = 0; d < c.length; d++) c[d] = mean(m.map((x) => x[d])); });
        if (!ch) break;
      }
      const ine = X.reduce((s, x, i) => s + d2(x, C[lab[i]]), 0);
      if (!best || ine < best.inertia) best = { labels: lab, centers: C, inertia: ine };
    }
    return best;
  }
  function silhouette(X, lab, k) {
    const n = X.length, D = X.map((a) => X.map((b) => Math.sqrt(d2(a, b))));
    let tot = 0;
    for (let i = 0; i < n; i++) {
      const sums = new Array(k).fill(0), cnt = new Array(k).fill(0);
      for (let j = 0; j < n; j++) if (j !== i) { sums[lab[j]] += D[i][j]; cnt[lab[j]]++; }
      if (!cnt[lab[i]]) continue;
      const a = sums[lab[i]] / cnt[lab[i]]; let b = Infinity;
      for (let c = 0; c < k; c++) if (c !== lab[i] && cnt[c]) b = Math.min(b, sums[c] / cnt[c]);
      tot += (b - a) / Math.max(a, b);
    }
    return tot / n;
  }
  /* simetrik matrisin özdeğerleri (Jacobi) */
  function eig(A) {
    const n = A.length, a = A.map((r) => r.slice()), V = a.map((_, i) => a.map((_, j) => (i === j ? 1 : 0)));
    for (let sweep = 0; sweep < 100; sweep++) {
      let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += a[i][j] ** 2;
      if (off < 1e-18) break;
      for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
        if (Math.abs(a[p][q]) < 1e-15) continue;
        const th = (a[q][q] - a[p][p]) / (2 * a[p][q]), t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
        for (let k = 0; k < n; k++) { const akp = a[k][p], akq = a[k][q]; a[k][p] = c * akp - s * akq; a[k][q] = s * akp + c * akq; }
        for (let k = 0; k < n; k++) { const apk = a[p][k], aqk = a[q][k]; a[p][k] = c * apk - s * aqk; a[q][k] = s * apk + c * aqk; }
        for (let k = 0; k < n; k++) { const vkp = V[k][p], vkq = V[k][q]; V[k][p] = c * vkp - s * vkq; V[k][q] = s * vkp + c * vkq; }
      }
    }
    const idx = a.map((_, i) => i).sort((i, j) => a[j][j] - a[i][i]);
    return { values: idx.map((i) => a[i][i]), vectors: idx.map((i) => V.map((r) => r[i])) };
  }
  function cov(X) { const n = X.length, p = X[0].length, m = Array.from({ length: p }, (_, j) => mean(X.map((x) => x[j]))); const C = Array.from({ length: p }, () => new Array(p).fill(0)); X.forEach((x) => { for (let i = 0; i < p; i++) for (let j = 0; j < p; j++) C[i][j] += (x[i] - m[i]) * (x[j] - m[j]) / (n - 1); }); return { C, m }; }

  /* ---------------- veri yükleyiciler ---------------- */
  const cache = {};
  function getText(path) { if (!cache[path]) cache[path] = fetch(path).then((r) => { if (!r.ok) throw new Error(path); return r.text(); }); return cache[path]; }
  function parseCSV(s) {
    const rows = []; let row = [], f = "", q = false;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (q) { if (c === '"') { if (s[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
      else if (c === '"') q = true; else if (c === ",") { row.push(f); f = ""; } else if (c === "\n" || c === "\r") { if (c === "\r" && s[i + 1] === "\n") i++; row.push(f); rows.push(row); row = []; f = ""; } else f += c;
    }
    if (f || row.length) { row.push(f); rows.push(row); }
    return rows.filter((r) => r.length > 1 || r[0]);
  }
  function fred(id) { return getText(`data/fred/${id}.csv`).then((s) => { const m = new Map(); s.trim().split(/\r?\n/).slice(1).forEach((l) => { const [d, v] = l.split(","); const x = parseFloat(v); if (isFinite(x)) m.set(d.slice(0, 7), x); }); return m; }); }
  const VARS = ["gdppc_ppp", "inflation", "unemployment", "trade", "agriculture", "urban", "life_exp", "fertility"];
  function countries() {
    return getText("data/wb/countries.csv").then((s) => {
      const r = parseCSV(s), hd = r[0], ix = (c) => hd.indexOf(c);
      const rows = r.slice(1).map((x) => ({ iso3: x[ix("iso3")], name: x[ix("iso3")] === "TUR" ? "Türkiye" : x[ix("country")], income: x[ix("income")].trim(), v: VARS.map((c) => parseFloat(x[ix(c)])) }));
      const X = rows.map((o) => o.v.map((v, j) => (j === 0 ? Math.log(v) : v)));
      const m = VARS.map((_, j) => mean(X.map((x) => x[j]))), sd = VARS.map((_, j) => Math.sqrt(mean(X.map((x) => (x[j] - m[j]) ** 2))));
      const Z = X.map((x) => x.map((v, j) => (v - m[j]) / sd[j]));
      return { rows, Z };
    });
  }
  function statements() {
    return Promise.all([getText("data/fomc/statements.csv"), fred("FEDFUNDS")]).then(([s, ff]) => {
      const r = parseCSV(s), hd = r[0];
      const st = r.slice(1).map((x) => ({ date: x[hd.indexOf("date")], text: x[hd.indexOf("text")] }));
      const at = (ym) => { let y = +ym.slice(0, 4), mo = +ym.slice(5, 7); for (let k = 0; k < 3; k++) { const key = `${y}-${String(mo).padStart(2, "0")}`; if (ff.has(key)) return ff.get(key); mo--; if (!mo) { mo = 12; y--; } } return NaN; };
      const shift = (ym, m) => { let y = +ym.slice(0, 4), mo = +ym.slice(5, 7) + m; while (mo > 12) { mo -= 12; y++; } while (mo < 1) { mo += 12; y--; } return `${y}-${String(mo).padStart(2, "0")}`; };
      const last = [...ff.keys()].sort().pop();
      st.forEach((o) => { const ym = o.date.slice(0, 7); const e = shift(ym, 3); o.d3 = e <= last ? at(e) - at(ym) : NaN; o.p3 = at(ym) - at(shift(ym, -3)); o.year = +o.date.slice(0, 4); });
      return { st, ff };
    });
  }
  function waiting(h, t, host, load, run) {
    const msg = h("p", { class: "pg-note" }, t({ tr: "Veri yükleniyor…", en: "Loading the data…" }));
    host.append(msg);
    load().then((d) => { msg.remove(); run(d); }, () => { msg.textContent = t({ tr: "Veri yüklenemedi. Sayfayı yenileyip yeniden dene.", en: "The data could not be loaded. Refresh the page and try again." }); });
  }

  /* =====================================================================
   * kmeansSteps — atama ve güncelleme adımları; bir ekseni büyütmek
   * ===================================================================== */
  P.kmeansSteps = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    const u0 = rng(7), pts = [];
    [[2.5, 2.2], [2.5, 7.8], [7.5, 5]].forEach(([cx, cy]) => { for (let i = 0; i < 30; i++) pts.push([cx + 0.9 * normal(u0), cy + 0.9 * normal(u0)]); });
    let stretch = false, seed = 1, C, lab, step, phase;
    const tiles = h("div", { class: "tiles" }), box = h("div"), note = h("p", { class: "pg-note" });
    const sc = () => (stretch ? 100 : 1);
    const dist = (p, c) => (sc() * (p[0] - c[0])) ** 2 + (p[1] - c[1]) ** 2;
    function reset() { const u = rng(seed * 13); C = [0, 1, 2].map(() => [1 + 8 * u(), 1 + 8 * u()]); lab = pts.map(() => -1); step = 0; phase = "assign"; }
    function assign() { let ch = 0; pts.forEach((p, i) => { let bj = 0; C.forEach((c, j) => { if (dist(p, c) < dist(p, C[bj])) bj = j; }); if (lab[i] !== bj) { lab[i] = bj; ch++; } }); return ch; }
    function update() { C = C.map((c, j) => { const m = pts.filter((_, i) => lab[i] === j); return m.length ? [mean(m.map((p) => p[0])), mean(m.map((p) => p[1]))] : c; }); }
    let lastCh = null;
    function doStep() { if (phase === "assign") { lastCh = assign(); phase = "update"; } else { update(); phase = "assign"; } step++; }
    const bA = h("button", { class: "btn sm", onclick: () => { doStep(); ctx.touch(); draw(); } }, "");
    const ctrls = h("div", { class: "pg-ctrls" }, bA,
      h("button", { class: "btn sm", onclick: () => { for (let k = 0; k < 60; k++) { doStep(); if (phase === "update" && lastCh === 0) break; } ctx.touch(); draw(); } }, t({ tr: "Sonuna kadar çalıştır", en: "Run to the end" })),
      h("button", { class: "btn sm", onclick: () => { seed++; reset(); draw(); } }, t({ tr: "Yeni başlangıç merkezleri", en: "New starting centres" })),
      check(h, t({ tr: "Yatay ekseni 100 kat büyüt (ölçeklemeden)", en: "Stretch the horizontal axis 100 times (no scaling)" }), stretch, (v) => { stretch = v; reset(); ctx.touch(); draw(); }));
    function draw() {
      bA.textContent = phase === "assign" ? t({ tr: "Adım: noktaları ata", en: "Step: assign points" }) : t({ tr: "Adım: merkezleri taşı", en: "Step: move centres" });
      const ine = lab[0] < 0 ? NaN : pts.reduce((s, p, i) => s + dist(p, C[lab[i]]), 0);
      tiles.innerHTML = "";
      tiles.append(tile(h, t({ tr: "Adım", en: "Step" }), step), tile(h, t({ tr: "Son atamada değişen nokta", en: "Points changed in last assignment" }), lastCh == null ? "—" : lastCh, lastCh === 0 ? "win" : ""),
        tile(h, t({ tr: "Küme içi kareler toplamı", en: "Within-cluster sum of squares" }), isFinite(ine) ? fmt(ine, 0, lang) : "—"));
      const W = 380, H = 330, L = 34, R = W - 10, T = 10, B = H - 34, sx = (v) => L + v / 10 * (R - L), sy = (v) => B - v / 10 * (B - T);
      const ch = frame(W, H, 420);
      svg("rect", { x: L, y: T, width: R - L, height: B - T, class: "pg-frame" }, ch);
      pts.forEach((p, i) => svg("circle", { cx: sx(p[0]), cy: sy(p[1]), r: 4, class: lab[i] < 0 ? "pg-dot" : "pg-bar " + COL[lab[i]], "fill-opacity": 0.75 }, ch));
      C.forEach((c, j) => { svg("rect", { x: sx(c[0]) - 7, y: sy(c[1]) - 7, width: 14, height: 14, class: "pg-bar " + COL[j], stroke: "var(--ink)", "stroke-width": 2 }, ch); });
      [0, 5, 10].forEach((v) => { txt(ch, sx(v), B + 16, stretch ? String(v * 100) : String(v)); txt(ch, L - 6, sy(v) + 4, String(v), "pg-lbl", "end"); });
      txt(ch, (L + R) / 2, H - 4, stretch ? t({ tr: "x (birimi 100 kat büyük)", en: "x (unit 100 times larger)" }) : "x");
      box.innerHTML = ""; box.append(ch);
      note.textContent = stretch
        ? t({ tr: "x ekseni artık 0–1.000 arasında ölçülüyor (gelir bin dolar, doğurganlık çocuk sayısı gibi). Uzaklık neredeyse yalnızca x'e bağlı: kümeler dikey şeritlere dönüşüyor ve üstteki ile alttaki grup birleşiyor. Noktalar aynı; değişen yalnızca birim.", en: "The x axis is now measured from 0 to 1,000 (like income in thousands of dollars next to fertility in children). The distance depends almost only on x: the clusters turn into vertical strips and the top and bottom groups merge. The points are the same; only the unit changed." })
        : t({ tr: "Kareler merkezler, daireler ülkeler gibi gözlemler. “Ata” her noktayı en yakın merkezin rengine boyar; “taşı” her merkezi kendi noktalarının ortalamasına götürür. Atamalar değişmeyince algoritma durur. Farklı başlangıç merkezleri farklı sonuçlara götürebilir.", en: "Squares are centres, circles observations such as countries. “Assign” colours every point with its nearest centre; “move” takes every centre to the mean of its points. When the assignments stop changing the algorithm stops. Different starting centres can lead to different results." });
    }
    reset();
    host.append(ctrls, tiles, box, note);
    draw();
  };

  /* =====================================================================
   * kChoice — inertia ve siluet; gerçek grup sayısı, iç içelik, aykırı değer
   * ===================================================================== */
  P.kChoice = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    let G = 3, spread = 1, outl = false, seed = 3;
    const lg = h("b"), ls = h("b");
    const ctrls = h("div", { class: "pg-ctrls" },
      h("label", null, h("span", null, t({ tr: "Gerçek grup sayısı = ", en: "True number of groups = " }), lg), slider(h, 2, 6, 1, G, (v) => { G = v; ctx.touch(); draw(); })),
      h("label", null, h("span", null, t({ tr: "Grupların yayılımı = ", en: "Spread of the groups = " }), ls), slider(h, 0.4, 2.4, 0.2, spread, (v) => { spread = v; ctx.touch(); draw(); })),
      check(h, t({ tr: "Uzakta 3 aykırı nokta ekle", en: "Add 3 distant outliers" }), outl, (v) => { outl = v; ctx.touch(); draw(); }),
      h("button", { class: "btn sm", onclick: () => { seed++; draw(); } }, t({ tr: "Yeni veri", en: "New data" })));
    const tiles = h("div", { class: "tiles" }), box = h("div", { class: "pg-panel" }), note = h("p", { class: "pg-note" });
    function draw() {
      lg.textContent = G; ls.textContent = fmt(spread, 1, lang);
      const u = rng(seed * 101 + G), X = [];
      const cen = Array.from({ length: G }, (_, j) => [5 + 3.2 * Math.cos(2 * Math.PI * j / G), 5 + 3.2 * Math.sin(2 * Math.PI * j / G)]);
      cen.forEach((c) => { for (let i = 0; i < Math.round(132 / G); i++) X.push([c[0] + spread * 0.6 * normal(u), c[1] + spread * 0.6 * normal(u)]); });
      if (outl) [[17, 17], [17.5, 16.4], [16.6, 17.6]].forEach((p) => X.push(p));
      const res = [];
      for (let k = 2; k <= 8; k++) { const km = kmeans(X, k, seed, 4); res.push({ k, ine: km.inertia, sil: silhouette(X, km.labels, k), lab: km.labels }); }
      const best = res.reduce((a, b) => (b.sil > a.sil ? b : a));
      tiles.innerHTML = "";
      tiles.append(tile(h, t({ tr: "Gerçek grup sayısı", en: "True number of groups" }), G), tile(h, t({ tr: "Siluetin seçtiği k", en: "k chosen by the silhouette" }), best.k, best.k === G ? "win" : "warn"),
        tile(h, t({ tr: "En yüksek siluet", en: "Highest silhouette" }), fmt(best.sil, 2, lang)), tile(h, t({ tr: "En düşük inertia", en: "Lowest inertia" }), "k = 8"));
      box.innerHTML = "";
      const W1 = 300, H1 = 300, lo = outl ? -1 : 0, hi = outl ? 19 : 10, sx = (v) => 10 + (v - lo) / (hi - lo) * (W1 - 20), sy = (v) => H1 - 10 - (v - lo) / (hi - lo) * (H1 - 20);
      const ch = frame(W1, H1, 320);
      svg("rect", { x: 10, y: 10, width: W1 - 20, height: H1 - 20, class: "pg-frame" }, ch);
      X.forEach((p, i) => svg("circle", { cx: sx(p[0]), cy: sy(p[1]), r: 3.2, class: "pg-bar " + COL[best.lab[i] % 6], "fill-opacity": 0.8 }, ch));
      txt(ch, W1 / 2, 24, t({ tr: `siluetin seçtiği k = ${best.k}`, en: `k chosen by the silhouette = ${best.k}` }));
      const W2 = 300, H2 = 300, L = 40, R = W2 - 10;
      const c2 = frame(W2, H2, 320);
      const mini = (y0, y1, vals, cls, lab, f) => {
        const lo2 = Math.min(...vals), hi2 = Math.max(...vals), sxx = (k) => L + (k - 2) / 6 * (R - L), syy = (v) => y1 - (v - lo2) / (hi2 - lo2 || 1) * (y1 - y0);
        svg("rect", { x: L, y: y0, width: R - L, height: y1 - y0, class: "pg-frame" }, c2);
        svg("line", { x1: sxx(G), x2: sxx(G), y1: y0, y2: y1, class: "pg-ref" }, c2);
        svg("path", { d: vals.map((v, i) => (i ? "L" : "M") + sxx(i + 2).toFixed(1) + " " + syy(v).toFixed(1)).join(""), class: "pg-line " + cls }, c2);
        vals.forEach((v, i) => svg("circle", { cx: sxx(i + 2), cy: syy(v), r: i + 2 === best.k && cls === "c4" ? 6 : 3, class: "pg-bar " + cls }, c2));
        txt(c2, L + 4, y0 + 14, lab, "pg-lbl", "start");
        txt(c2, L - 4, y0 + 10, f(hi2), "pg-lbl", "end"); txt(c2, L - 4, y1, f(lo2), "pg-lbl", "end");
      };
      mini(10, 130, res.map((r) => r.ine), "c1", "inertia", (v) => fmt(v, 0, lang));
      mini(160, 270, res.map((r) => r.sil), "c4", t({ tr: "siluet", en: "silhouette" }), (v) => fmt(v, 2, lang));
      for (let k = 2; k <= 8; k++) txt(c2, L + (k - 2) / 6 * (R - L), 290, "k=" + k);
      box.append(ch, c2);
      note.textContent = t({ tr: "Kesikli çizgi gerçek grup sayısı. En iyi ulaşılabilir inertia k arttıkça artmaz (pratikte hemen hep düşer); “dirsek” gruplar belirginken görünür, iç içe geçince kaybolur. Siluet belirgin gruplarda doğru k'yı bulur. Grup sayısını 6 yapıp yayılımı 1,8'e çıkar: gruplar iç içe geçer ve siluet daha az küme (k = 3) önerir. Aykırı noktaları ekle: siluet onlara ayrı bir küme verir.", en: "The dashed line is the true number of groups. The best achievable inertia does not increase with k (in practice it almost always falls); the “elbow” is visible when the groups are distinct and disappears when they overlap. The silhouette finds the right k for distinct groups. Set the groups to 6 and raise the spread to 1.8: the groups overlap and the silhouette suggests fewer clusters (k = 3). Add the outliers: the silhouette gives them a cluster of their own." });
    }
    host.append(ctrls, tiles, box, note);
    draw();
  };

  /* =====================================================================
   * yieldPCA — bir ayın getiri eğrisini 1–3 bileşenle yeniden kurmak
   * ===================================================================== */
  const MATS = ["TB3MS", "TB6MS", "GS1", "GS2", "GS3", "GS5", "GS7", "GS10"], MY = [0.25, 0.5, 1, 2, 3, 5, 7, 10];
  function yields() {
    return Promise.all(MATS.map(fred)).then((ms) => {
      const dates = [...ms[0].keys()].filter((d) => ms.every((m) => m.has(d))).sort();
      const Y = dates.map((d) => ms.map((m) => m.get(d)));
      const { C, m } = cov(Y), E = eig(C);
      E.vectors = E.vectors.map((v) => (v[7] < 0 ? v.map((x) => -x) : v));
      const tot = E.values.reduce((a, b) => a + b, 0);
      const S = Y.map((y) => E.vectors.slice(0, 3).map((v) => v.reduce((s, w, j) => s + w * (y[j] - m[j]), 0)));
      return { dates, Y, m, E, S, ratio: E.values.map((v) => v / tot) };
    });
  }
  P.yieldPCA = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    waiting(h, t, host, yields, (Dd) => {
      let i = Dd.dates.indexOf("2007-01") >= 0 ? Dd.dates.indexOf("2007-01") : Dd.dates.length - 1, K = 1;
      const ld = h("b");
      const ctrls = h("div", { class: "pg-ctrls" },
        h("label", null, h("span", null, t({ tr: "Ay = ", en: "Month = " }), ld), slider(h, 0, Dd.dates.length - 1, 1, i, (v) => { i = v; ctx.touch(); draw(); })),
        h("label", null, h("span", null, t({ tr: "Bileşen sayısı", en: "Number of components" })), select(h, [[1, "1"], [2, "2"], [3, "3"]], K, (v) => { K = +v; ctx.touch(); draw(); })));
      const tiles = h("div", { class: "tiles" }), box = h("div", { class: "pg-panel" }), note = h("p", { class: "pg-note" });
      function draw() {
        ld.textContent = Dd.dates[i];
        const y = Dd.Y[i], s = Dd.S[i], rec = Dd.m.map((mu, j) => mu + Dd.E.vectors.slice(0, K).reduce((a, v, c) => a + v[j] * s[c], 0));
        const rmse = Math.sqrt(mean(y.map((v, j) => (v - rec[j]) ** 2))) * 100;
        tiles.innerHTML = "";
        tiles.append(tile(h, t({ tr: "Yeniden kurma hatası (RMSE)", en: "Rebuilding error (RMSE)" }), fmt(rmse, 0, lang) + t({ tr: " baz puan", en: " bp" }), rmse < 10 ? "win" : rmse > 40 ? "warn" : ""),
          tile(h, t({ tr: "Açıklanan varyans (bütün dönem)", en: "Explained variance (whole period)" }), pct(Dd.ratio.slice(0, K).reduce((a, b) => a + b, 0), 2, lang)),
          tile(h, t({ tr: "10y − 3a farkı", en: "10y − 3m spread" }), fmt(y[7] - y[0], 2, lang)));
        box.innerHTML = "";
        const W = 380, H = 260, L = 40, R = W - 12, T = 12, B = H - 34;
        const lo = Math.floor(Math.min(...y, ...rec, ...Dd.m) - 0.5), hi = Math.ceil(Math.max(...y, ...rec, ...Dd.m) + 0.5);
        const sx = (v) => L + Math.sqrt(v) / Math.sqrt(10) * (R - L), sy = (v) => B - (v - lo) / (hi - lo) * (B - T);
        const ch = frame(W, H, 420);
        svg("rect", { x: L, y: T, width: R - L, height: B - T, class: "pg-frame" }, ch);
        svg("path", { d: Dd.m.map((v, j) => (j ? "L" : "M") + sx(MY[j]).toFixed(1) + " " + sy(v).toFixed(1)).join(""), class: "pg-ref" }, ch);
        svg("path", { d: rec.map((v, j) => (j ? "L" : "M") + sx(MY[j]).toFixed(1) + " " + sy(v).toFixed(1)).join(""), class: "pg-line c4" }, ch);
        y.forEach((v, j) => svg("circle", { cx: sx(MY[j]), cy: sy(v), r: 4.5, class: "pg-bar c0" }, ch));
        MY.forEach((v, j) => txt(ch, sx(v), B + 16, ["3a", "6a", "1y", "2y", "3y", "5y", "7y", "10y"][j].replace("a", t({ tr: "a", en: "m" }))));
        for (let v = lo; v <= hi; v += Math.max(1, Math.round((hi - lo) / 4))) txt(ch, L - 5, sy(v) + 4, String(v), "pg-lbl", "end");
        txt(ch, (L + R) / 2, H - 4, t({ tr: "vade (karekök ölçek) · faiz, %", en: "maturity (square-root scale) · yield, %" }));
        const W2 = 300, L2 = 36, R2 = W2 - 10, T2 = 12, B2 = H - 34, sy2 = (v) => B2 - (v + 0.7) / 1.4 * (B2 - T2), sx2 = (v) => L2 + Math.sqrt(v) / Math.sqrt(10) * (R2 - L2);
        const c2 = frame(W2, H, 320);
        svg("rect", { x: L2, y: T2, width: R2 - L2, height: B2 - T2, class: "pg-frame" }, c2);
        svg("line", { x1: L2, x2: R2, y1: sy2(0), y2: sy2(0), class: "pg-axis" }, c2);
        ["c0", "c1", "c4"].forEach((c, k) => { if (k < K) svg("path", { d: Dd.E.vectors[k].map((v, j) => (j ? "L" : "M") + sx2(MY[j]).toFixed(1) + " " + sy2(v).toFixed(1)).join(""), class: "pg-line " + c }, c2); });
        [-0.5, 0, 0.5].forEach((v) => txt(c2, L2 - 4, sy2(v) + 4, fmt(v, 1, lang), "pg-lbl", "end"));
        txt(c2, (L2 + R2) / 2, H - 4, t({ tr: "yüklemeler (vadeye göre)", en: "loadings (by maturity)" }));
        box.append(ch, c2);
        note.textContent = t({ tr: "Yeşil noktalar o ayın gerçek faizleri, pembe çizgi seçilen bileşenlerle yeniden kurulan eğri, gri çizgi 1976'dan bu yana ortalama eğri. Sağda yüklemeler: yeşil düzey, mavi eğim, pembe eğrilik. Ters dönmüş eğrili bir ay dene (2000-12, 2006-12, 2023-06): tek bileşen yetmez, eğim gerekir.", en: "Green dots are that month's actual yields, the pink line the curve rebuilt with the chosen components, the grey line the average curve since 1976. On the right, the loadings: green level, blue slope, pink curvature. Try a month with an inverted curve (2000-12, 2006-12, 2023-06): one component is not enough, the slope is needed." });
      }
      host.append(ctrls, tiles, box, legend(h, [["c0", t({ tr: "gerçek faizler", en: "actual yields" })], ["c4", t({ tr: "yeniden kurulan eğri", en: "rebuilt curve" })], ["c6", t({ tr: "ortalama eğri", en: "average curve" })]]), note);
      draw();
    });
  };

  /* =====================================================================
   * countryMap — PCA haritası, kümeler ya da gelir grupları, en yakın komşular
   * ===================================================================== */
  P.countryMap = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    waiting(h, t, host, countries, (Cd) => {
      const { rows, Z } = Cd, { C } = cov(Z), E = eig(C);
      const v1 = E.vectors[0][0] < 0 ? E.vectors[0].map((x) => -x) : E.vectors[0], v2 = E.vectors[1][2] < 0 ? E.vectors[1].map((x) => -x) : E.vectors[1];
      const S = Z.map((z) => [z.reduce((s, x, j) => s + x * v1[j], 0), z.reduce((s, x, j) => s + x * v2[j], 0)]);
      const tot = E.values.reduce((a, b) => a + b, 0);
      const INC = ["High income", "Upper middle income", "Lower middle income", "Low income"];
      const INCL = { tr: ["Yüksek", "Üst orta", "Alt orta", "Düşük"], en: ["High", "Upper middle", "Lower middle", "Low"] };
      let mode = "cluster", k = 4, sel = rows.findIndex((r) => r.iso3 === "TUR");
      const kmc = {};
      const lk = h("b");
      const order = rows.map((_, i) => i).sort((a, b) => rows[a].name.localeCompare(rows[b].name));
      const ctrls = h("div", { class: "pg-ctrls" },
        h("label", null, h("span", null, t({ tr: "Renk", en: "Colour" })), select(h, [["cluster", t({ tr: "k-ortalamalar kümeleri", en: "k-means clusters" })], ["income", t({ tr: "Dünya Bankası gelir grubu", en: "World Bank income group" })]], mode, (v) => { mode = v; ctx.touch(); draw(); })),
        h("label", null, h("span", null, "k = ", lk), slider(h, 2, 6, 1, k, (v) => { k = v; ctx.touch(); draw(); })),
        h("label", null, h("span", null, t({ tr: "Ülke", en: "Country" })), select(h, order.map((i) => [i, rows[i].name]), sel, (v) => { sel = +v; ctx.touch(); draw(); })));
      const tiles = h("div", { class: "tiles" }), box = h("div"), leg = h("div"), note = h("p", { class: "pg-note" });
      function draw() {
        lk.textContent = k;
        if (!kmc[k]) kmc[k] = kmeans(Z, k, 2026, 8);
        const lab = mode === "cluster" ? kmc[k].labels : rows.map((r) => INC.indexOf(r.income));
        const dd = Z.map((z) => Math.sqrt(d2(z, Z[sel]))), nn = dd.map((_, i) => i).filter((i) => i !== sel).sort((a, b) => dd[a] - dd[b]).slice(0, 5);
        const md = S.map((s) => Math.hypot(s[0] - S[sel][0], s[1] - S[sel][1])), mapRank = md.map((_, i) => i).filter((i) => i !== sel).sort((a, b) => md[a] - md[b]);
        tiles.innerHTML = "";
        tiles.append(tile(h, t({ tr: "Haritanın taşıdığı varyans", en: "Variance carried by the map" }), pct((E.values[0] + E.values[1]) / tot, 0, lang)),
          tile(h, t({ tr: `${rows[sel].name}: 8 boyutta en yakın 5`, en: `${rows[sel].name}: 5 nearest in 8 dimensions` }), nn.map((i) => rows[i].name).join(", ")),
          tile(h, t({ tr: "Haritada da ilk 5'te olanlar", en: "Also in the top 5 on the map" }), nn.filter((i) => mapRank.indexOf(i) < 5).length + " / 5"));
        const W = 620, H = 380, L = 30, R = W - 10, T = 10, B = H - 30;
        const xs = S.map((s) => s[0]), ys = S.map((s) => s[1]), x0 = Math.min(...xs) - 0.3, x1 = Math.max(...xs) + 0.3, y0 = Math.min(...ys) - 0.3, y1 = Math.max(...ys) + 0.3;
        const sx = (v) => L + (v - x0) / (x1 - x0) * (R - L), sy = (v) => B - (v - y0) / (y1 - y0) * (B - T);
        const ch = frame(W, H);
        svg("rect", { x: L, y: T, width: R - L, height: B - T, class: "pg-frame" }, ch);
        svg("line", { x1: sx(0), x2: sx(0), y1: T, y2: B, class: "pg-axis" }, ch); svg("line", { x1: L, x2: R, y1: sy(0), y2: sy(0), class: "pg-axis" }, ch);
        nn.forEach((i) => svg("line", { x1: sx(S[sel][0]), y1: sy(S[sel][1]), x2: sx(S[i][0]), y2: sy(S[i][1]), class: "pg-ref" }, ch));
        S.forEach((s, i) => { const c = svg("circle", { cx: sx(s[0]), cy: sy(s[1]), r: i === sel ? 7 : 4.2, class: "pg-bar " + COL[lab[i] % 6], "fill-opacity": i === sel || nn.includes(i) ? 1 : 0.6, stroke: i === sel ? "var(--ink)" : "none", "stroke-width": 2 }, ch); const ti = svg("title", {}, c); ti.textContent = rows[i].name; });
        [sel, ...nn].forEach((i) => txt(ch, sx(S[i][0]) + 7, sy(S[i][1]) - 6, rows[i].name, "pg-lbl", "start"));
        txt(ch, (L + R) / 2, H - 8, t({ tr: `PC1: kalkınma (${pct(E.values[0] / tot, 0, lang)}) →`, en: `PC1: development (${pct(E.values[0] / tot, 0, lang)}) →` }));
        const yl = txt(ch, 12, (T + B) / 2, t({ tr: `PC2: işsizlik ve enflasyon (${pct(E.values[1] / tot, 0, lang)}) →`, en: `PC2: unemployment and inflation (${pct(E.values[1] / tot, 0, lang)}) →` })); yl.setAttribute("transform", `rotate(-90 12 ${(T + B) / 2})`);
        box.innerHTML = ""; box.append(ch);
        leg.innerHTML = "";
        leg.append(mode === "cluster" ? legend(h, Array.from({ length: k }, (_, j) => [COL[j], t({ tr: "Küme ", en: "Cluster " }) + (j + 1) + " (" + kmc[k].labels.filter((x) => x === j).length + ")"])) : legend(h, INC.map((_, j) => [COL[j], INCL[lang][j]])));
        note.textContent = t({ tr: "Kümeler sekiz boyutta kuruldu, harita yalnızca iki boyutu gösteriyor; bu yüzden renkler haritada iç içe geçebilir. Kesikli çizgiler seçilen ülkenin sekiz boyuttaki en yakın beş komşusu. Haritada yakın görünen ama çizgiyle bağlı olmayan ülkeler, haritanın göstermediği boyutlarda uzak. Noktaların üzerine gelince ülke adı görünür.", en: "The clusters were built in eight dimensions and the map shows only two; that is why colours can overlap on the map. The dashed lines are the selected country's five nearest neighbours in eight dimensions. Countries that look close on the map but are not linked by a line are far apart in the dimensions the map does not show. Hover over a dot to see the country's name." });
      }
      host.append(ctrls, tiles, box, leg, note);
      draw();
    });
  };

  /* =====================================================================
   * tfidfPlay — sayım ve TF-IDF; durak kelimeler ve belge sıklığı eşiği
   * ===================================================================== */
  const STOP = new Set(("a about above after again against all also am an and any are as at be because been before being below between both but by can could did do does doing down during each either else even ever every few for from further had has have having he her here hers him his how however i if in into is it its itself just last least less like made make many may me might more most much must my neither no nor not now of off often on once one only or other others our ours out over own per perhaps rather same see seem seemed several she should since so some still such than that the their theirs them themselves then there these they this those though through thus to too toward under until up upon us very via was we well were what whatever when where whether which while who whom whose why will with within without would yet you your").split(" "));
  P.tfidfPlay = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    waiting(h, t, host, statements, (Sd) => {
      const docs = Sd.st.map((o) => o.text.toLowerCase().match(/[a-z]+(?:-[a-z]+)?/g) || []);
      let i = Sd.st.findIndex((o) => o.date === "2020-03-15"); if (i < 0) i = Sd.st.length - 1;
      let stop = true, mindf = 3;
      const ld = h("b"), lm = h("b");
      const ctrls = h("div", { class: "pg-ctrls" },
        h("label", null, h("span", null, t({ tr: "Açıklama = ", en: "Statement = " }), ld), slider(h, 0, Sd.st.length - 1, 1, i, (v) => { i = v; ctx.touch(); draw(); })),
        h("label", null, h("span", null, "min_df = ", lm), slider(h, 1, 10, 1, mindf, (v) => { mindf = v; ctx.touch(); draw(); })),
        check(h, t({ tr: "Durak kelimeleri at", en: "Drop stop words" }), stop, (v) => { stop = v; ctx.touch(); draw(); }));
      const tiles = h("div", { class: "tiles" }), box = h("div", { class: "pg-panel" }), note = h("p", { class: "pg-note" });
      function draw() {
        ld.textContent = Sd.st[i].date; lm.textContent = mindf;
        const keep = (w) => w.length > 1 && !(stop && STOP.has(w));
        const df = new Map(); docs.forEach((d) => new Set(d.filter(keep)).forEach((w) => df.set(w, (df.get(w) || 0) + 1)));
        const vocab = [...df.keys()].filter((w) => df.get(w) >= mindf), V = new Set(vocab), n = docs.length;
        const tf = new Map(); docs[i].filter((w) => V.has(w)).forEach((w) => tf.set(w, (tf.get(w) || 0) + 1));
        const cnt = [...tf.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
        const tfidf = [...tf.entries()].map(([w, c]) => [w, c * (Math.log((1 + n) / (1 + df.get(w))) + 1)]).sort((a, b) => b[1] - a[1]).slice(0, 10);
        tiles.innerHTML = "";
        tiles.append(tile(h, t({ tr: "Sözlük büyüklüğü", en: "Vocabulary size" }), vocab.length.toLocaleString(lang === "tr" ? "tr-TR" : "en-US")), tile(h, t({ tr: "Bu açıklamadaki kelime", en: "Words in this statement" }), docs[i].length),
          tile(h, t({ tr: "“committee” kaç açıklamada?", en: "“committee” in how many statements?" }), (df.get("committee") || 0) + " / " + n));
        box.innerHTML = "";
        const bars = (list, title, cls) => {
          const W = 300, H = 290, L = 120, R = W - 10, mx = list.length ? list[0][1] : 1, ch = frame(W, H, 320);
          txt(ch, L, 16, title, "pg-lbl", "start");
          list.forEach(([w, v], k) => { const y = 30 + k * 25; svg("rect", { x: L, y, width: Math.max(2, v / mx * (R - L - 40)), height: 18, class: "pg-bar " + cls }, ch); txt(ch, L - 6, y + 13, w, "pg-lbl", "end"); txt(ch, L + Math.max(2, v / mx * (R - L - 40)) + 4, y + 13, fmt(v, cls === "c1" ? 0 : 1, lang), "pg-lbl", "start"); });
          return ch;
        };
        box.append(bars(cnt, t({ tr: "En sık kelimeler (sayım)", en: "Most frequent words (count)" }), "c1"), bars(tfidf, t({ tr: "En yüksek TF-IDF", en: "Highest TF-IDF" }), "c4"));
        note.textContent = t({ tr: "TF-IDF = sayım × (ln((1 + n) / (1 + belge sıklığı)) + 1); n = 201 açıklama. Her açıklamada geçen kelimenin IDF'si en düşük değere (1) iner; birkaç açıklamada geçen kelime yukarı çıkar. Durak kelime listesi kısaltılmış bir listedir ve tokenleştirme tarayıcıda yapılıyor; scikit-learn'ünkiyle aynı değildir: min_df = 3'te burada 822, Python hücresinde 811 kelime. TF-IDF burada L2 normalizasyonu olmadan gösteriliyor (bir açıklama içindeki sıra değişmez). İki listede de “not” durak kelimedir: olumsuzluk bu adımda kaybolur. Mart 2020, Ekim 2008 ve Mart 2022 açıklamalarını dene.", en: "TF-IDF = count × (ln((1 + n) / (1 + document frequency)) + 1); n = 201 statements. A word found in every statement gets the lowest IDF (1); a word found in a few statements moves up. The stop-word list is a shortened list and tokenisation is done in the browser; it is not the same as scikit-learn's: at min_df = 3 there are 822 words here and 811 in the Python cell. TF-IDF is shown here without L2 normalisation (the ranking within a statement does not change). In both lists “not” is a stop word: negation is lost at this step. Try the March 2020, October 2008 and March 2022 statements." });
      }
      host.append(ctrls, tiles, box, note);
      draw();
    });
  };

  /* =====================================================================
   * toneDict — sözlük kelimelerini aç kapa; yıllık ton ve faiz
   * ===================================================================== */
  const HAWK = ["tighten", "tightening", "firming", "raise", "increase", "elevated", "pressures", "upside", "strong", "robust", "solid", "reduce"];
  const DOVE = ["accommodative", "accommodation", "ease", "easing", "lower", "decline", "weak", "weakened", "slack", "downside", "subdued", "purchases"];
  P.toneDict = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    waiting(h, t, host, statements, (Sd) => {
      const words = HAWK.concat(DOVE);
      const cnt = Sd.st.map((o) => { const s = o.text.toLowerCase(); return words.map((w) => (s.match(new RegExp("\\b" + w + "\\b", "g")) || []).length); });
      const on = words.map(() => true);
      const mk = (list, off) => h("div", { class: "pg-checks" }, ...list.map((w, j) => check(h, w, true, (v) => { on[off + j] = v; ctx.touch(); draw(); })));
      const ctrls = h("div", null, h("p", { class: "pg-note" }, h("b", null, t({ tr: "Şahin kelimeler", en: "Hawkish words" }))), mk(HAWK, 0), h("p", { class: "pg-note" }, h("b", null, t({ tr: "Güvercin kelimeler", en: "Dovish words" }))), mk(DOVE, HAWK.length));
      const tiles = h("div", { class: "tiles" }), box = h("div"), note = h("p", { class: "pg-note" });
      const years = [...new Set(Sd.st.map((o) => o.year))];
      const fy = years.map((y) => { const v = [...Sd.ff.entries()].filter(([d]) => +d.slice(0, 4) === y).map(([, x]) => x); return mean(v); });
      function draw() {
        const tone = cnt.map((c) => { let s = 0, g = 0; c.forEach((x, j) => { if (on[j]) { if (j < HAWK.length) s += x; else g += x; } }); return (s - g) / Math.max(1, s + g); });
        const ty = years.map((y) => mean(tone.filter((_, i) => Sd.st[i].year === y)));
        const toneOf = (mask) => cnt.map((c) => { let s = 0, g = 0; c.forEach((x, j) => { if (mask[j]) { if (j < HAWK.length) s += x; else g += x; } }); return [s, g]; });
        const sg = toneOf(on), base = corr(toneOf(words.map(() => true)).map(([s, g]) => (s - g) / Math.max(1, s + g)), Sd.st.map((o) => o.d3)), now = corr(tone, Sd.st.map((o) => o.d3));
        const none = sg.filter(([s, g]) => s + g === 0).length, tie = sg.filter(([s, g]) => s + g > 0 && s === g).length;
        const live = t({ tr: `Şu anki seçimle 3 aylık korelasyon ${fmt(now, 2, lang)} (tam sözlükle ${fmt(base, 2, lang)}). Ton = 0 olan açıklamalar: ${none} tanesinde hiç eşleşme yok, ${tie} tanesinde şahin ve güvercin sayısı eşit; ikisi farklı şeyler.`, en: `With the current selection the 3-month correlation is ${fmt(now, 2, lang)} (${fmt(base, 2, lang)} with the full dictionary). Statements with tone = 0: ${none} with no match at all, ${tie} with equal hawkish and dovish counts; the two are different things.` });
        tiles.innerHTML = "";
        tiles.append(tile(h, t({ tr: "Ortalama ton", en: "Average tone" }), fmt(mean(tone), 2, lang)),
          tile(h, t({ tr: "Sonraki 3 ayda faiz değişimiyle korelasyon", en: "Correlation with the rate change over the next 3 months" }), fmt(corr(tone, Sd.st.map((o) => o.d3)), 2, lang), "win"),
          tile(h, t({ tr: "Önceki 3 aydaki değişimle korelasyon", en: "Correlation with the change over the previous 3 months" }), fmt(corr(tone, Sd.st.map((o) => o.p3)), 2, lang)));
        const W = 640, H = 260, L = 36, R = W - 40, T = 12, B = H - 30, n = years.length, bw = (R - L) / n;
        const ch = frame(W, H), sy = (v) => T + (1 - v) / 2 * (B - T), sf = (v) => B - v / 6 * (B - T);
        svg("rect", { x: L, y: T, width: R - L, height: B - T, class: "pg-frame" }, ch);
        svg("line", { x1: L, x2: R, y1: sy(0), y2: sy(0), class: "pg-axis" }, ch);
        ty.forEach((v, k) => svg("rect", { x: L + k * bw + 2, y: Math.min(sy(v), sy(0)), width: bw - 4, height: Math.abs(sy(v) - sy(0)), class: "pg-bar " + (v >= 0 ? "c3" : "c1"), opacity: 0.8 }, ch));
        svg("path", { d: fy.map((v, k) => (k ? "L" : "M") + (L + (k + 0.5) * bw).toFixed(1) + " " + sf(v).toFixed(1)).join(""), class: "pg-line c6" }, ch);
        [-1, 0, 1].forEach((v) => txt(ch, L - 5, sy(v) + 4, fmt(v, 0, lang), "pg-lbl", "end"));
        [0, 3, 6].forEach((v) => txt(ch, R + 5, sf(v) + 4, (lang === "tr" ? "%" : "") + v + (lang === "tr" ? "" : "%"), "pg-lbl", "start"));
        years.forEach((y, k) => { if (y % 4 === 2) txt(ch, L + (k + 0.5) * bw, H - 10, String(y)); });
        box.innerHTML = ""; box.append(ch);
        note.textContent = live + " " + t({ tr: "Turuncu çubuklar şahin, mavi çubuklar güvercin yıllar (yıllık ortalama ton, sol eksen); gri çizgi federal fon oranı (sağ eksen). “accommodative”i ya da “lower”ı kapatıp yıllık tonun ve korelasyonun nasıl değiştiğine bak; aşağıdaki satır, tam sözlüğe göre farkı ölçülen değerle yazar. Hangi kelimenin sayılacağı bir yorum kararıdır.", en: "Orange bars are hawkish, blue bars dovish years (annual average tone, left axis); the grey line is the federal funds rate (right axis). Switch off “accommodative” or “lower” and see how the annual tone and the correlation change; the line below writes the change against the full dictionary from the measured values. Which words count is an interpretive decision." });
      }
      host.append(ctrls, tiles, box, note);
      draw();
    });
  };

  /* =====================================================================
   * topicEras — NMF konuları (önceden hesaplanmış), yıllara göre paylar
   * ===================================================================== */
  P.topicEras = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    waiting(h, t, host, () => getText("data/fomc/nmf_topics.json").then(JSON.parse), (Td) => {
      let k = 5;
      const lk = h("b");
      const ctrls = h("div", { class: "pg-ctrls" }, h("label", null, h("span", null, t({ tr: "Konu sayısı = ", en: "Number of topics = " }), lk), slider(h, 3, 6, 1, k, (v) => { k = v; ctx.touch(); draw(); })));
      const box = h("div"), words = h("div"), note = h("p", { class: "pg-note" });
      function draw() {
        lk.textContent = k;
        const M = Td[String(k)], years = Td.years, n = years.length;
        const W = 640, H = 240, L = 36, R = W - 10, T = 12, B = H - 30, bw = (R - L) / n;
        const ch = frame(W, H);
        svg("rect", { x: L, y: T, width: R - L, height: B - T, class: "pg-frame" }, ch);
        years.forEach((y, a) => { let acc = 0; M.share[a].forEach((v, j) => { svg("rect", { x: L + a * bw + 1, y: B - (acc + v) * (B - T), width: bw - 2, height: v * (B - T), class: "pg-bar " + COL[j] }, ch); acc += v; }); if (y % 4 === 2) txt(ch, L + (a + 0.5) * bw, H - 10, String(y)); });
        [0, 0.5, 1].forEach((v) => txt(ch, L - 5, B - v * (B - T) + 4, pct(v, 0, lang), "pg-lbl", "end"));
        box.innerHTML = ""; box.append(ch);
        words.innerHTML = "";
        M.words.forEach((ws, j) => words.append(h("p", { class: "pg-note" }, h("span", { class: "pg-swatch " + COL[j] }), " ", h("b", null, t({ tr: "Konu ", en: "Topic " }) + (j + 1) + ": "), ws.join(", "))));
        note.textContent = t({ tr: "Her yıl, o yılın açıklamalarındaki konu ağırlıklarının ortalaması (NMF, TF-IDF, max_df = 0,7). Konu sayısı artınca yeni konular çoğunlukla yeni bir dönem ya da dönemin bir alt parçası olarak ortaya çıkıyor. Konular tools/m7_figs.py ile Python'da hesaplandı.", en: "Each year shows the average topic weights in that year's statements (NMF, TF-IDF, max_df = 0.7). As the number of topics grows, new topics mostly appear as a new era or a part of an era. The topics were computed in Python with tools/m7_figs.py." });
      }
      host.append(ctrls, box, words, note);
      draw();
    });
  };

  /* =====================================================================
   * labelAudit — LLM etiketlerinin doğruluğunu küçük bir insan etiketli örneklemle ölçmek
   * ===================================================================== */
  P.labelAudit = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    let p = 0.8, n = 20, seed = 1, draws = [];
    const lp = h("b"), ln_ = h("b");
    const ctrls = h("div", { class: "pg-ctrls" },
      h("label", null, h("span", null, t({ tr: "LLM'in gerçek doğruluğu = ", en: "The LLM's true accuracy = " }), lp), slider(h, 0.5, 0.95, 0.05, p, (v) => { p = v; draws = []; ctx.touch(); draw(); })),
      h("label", null, h("span", null, t({ tr: "Elle etiketlenen açıklama = ", en: "Hand-labelled statements = " }), ln_), slider(h, 10, 400, 10, n, (v) => { n = v; draws = []; ctx.touch(); draw(); })),
      h("button", { class: "btn sm", onclick: () => { add(1); ctx.touch(); draw(); } }, t({ tr: "Bir örneklem çek", en: "Draw a sample" })),
      h("button", { class: "btn sm", onclick: () => { add(200); ctx.touch(); draw(); } }, t({ tr: "200 örneklem çek", en: "Draw 200 samples" })));
    const tiles = h("div", { class: "tiles" }), box = h("div"), note = h("p", { class: "pg-note" });
    function add(m) { for (let r = 0; r < m; r++) { const u = rng(seed++ * 7919); let c = 0; for (let i = 0; i < n; i++) if (u() < p) c++; draws.push(c / n); } }
    function draw() {
      lp.textContent = pct(p, 0, lang); ln_.textContent = n;
      const se = Math.sqrt(p * (1 - p) / n);
      tiles.innerHTML = "";
      tiles.append(tile(h, t({ tr: "Son örneklemde ölçülen doğruluk", en: "Accuracy measured in the last sample" }), draws.length ? pct(draws[draws.length - 1], 0, lang) : "—"),
        tile(h, t({ tr: "%95 belirsizlik aralığı (yaklaşık)", en: "95% uncertainty range (approx.)" }), "± " + fmt(196 * se, 0, lang) + t({ tr: " puan", en: " points" }), 196 * se > 10 ? "warn" : "win"),
        tile(h, t({ tr: "Çekilen örneklem", en: "Samples drawn" }), draws.length));
      const W = 560, H = 220, L = 30, R = W - 10, T = 12, B = H - 30, sx = (v) => L + v * (R - L);
      const ch = frame(W, H);
      svg("rect", { x: L, y: T, width: R - L, height: B - T, class: "pg-frame" }, ch);
      svg("rect", { x: sx(Math.max(0, p - 1.96 * se)), y: T, width: sx(Math.min(1, p + 1.96 * se)) - sx(Math.max(0, p - 1.96 * se)), height: B - T, class: "pg-region b", opacity: 0.5 }, ch);
      const bins = new Array(50).fill(0); draws.forEach((d) => bins[Math.min(49, Math.floor(d * 50))]++); const mx = Math.max(1, ...bins);
      bins.forEach((c, j) => { if (c) svg("rect", { x: sx(j / 50) + 1, y: B - c / mx * (B - T - 10), width: (R - L) / 50 - 2, height: c / mx * (B - T - 10), class: "pg-bar c1" }, ch); });
      svg("line", { x1: sx(p), x2: sx(p), y1: T, y2: B, class: "pg-ref" }, ch);
      [0, 0.25, 0.5, 0.75, 1].forEach((v) => txt(ch, sx(v), B + 16, pct(v, 0, lang)));
      box.innerHTML = ""; box.append(ch);
      note.textContent = t({ tr: "Her örneklemde n açıklamayı hem LLM'e hem bir uzmana etiketletip uyuşma oranını ölçtüğünü düşün. Kesikli çizgi gerçek doğruluk, gölgeli alan, gerçek p bilindiğinde ölçülen doğruluğun yaklaşık %95 simülasyon aralığı (bir güven aralığı değil), çubuklar ölçülen doğrulukların dağılımı. Gerçek bir denetimde p bilinmez; tek ölçümün etrafına Wilson aralığı kurulur (ör. 16/20 için yaklaşık %58–92). 20 açıklamayla %80'lik bir model %60 da %95 de görünebilir. Bu örneklem, istem hazırlanırken kullanılan örneklerden ayrı tutulmalı.", en: "Imagine that in each sample you have n statements labelled by both the LLM and an expert and measure the agreement. The dashed line is the true accuracy, the shaded area the approximate 95% simulation range of the measured accuracy when the true p is known (not a confidence interval), the bars the distribution of measured accuracies. With 20 statements an 80% model can look like 60% or 95%. In a real audit p is unknown; a Wilson interval is built around the single measurement (e.g. about 58–92% for 16/20). This sample must be kept separate from the examples used while writing the prompt." });
    }
    add(1);
    host.append(ctrls, tiles, box, note);
    draw();
  };
})();
