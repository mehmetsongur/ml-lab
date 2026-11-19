/* Modül 5 — oyun alanları: tek soru (bölme), derinlik ve aşırı uyum, orman büyütmek, boosting adımları, SHAP şelalesi.
 * Hesaplar tarayıcıda, JavaScript ile yapılır: kredi dünyası dersin 6. hafta notebook'undaki tarifle üretilir
 * (rastgele sayılar farklı olduğu için sonuçlar hücrelerdekilerden biraz farklı olabilir). Ağaçlar basit bir
 * CART uygulamasıyla (Gini) kurulur. SHAP şelalesindeki katkılar 6. hafta notebook'undaki shap.TreeExplainer çıktısıdır.
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
  let _uid = 0;
  function pgLabel(h, parts, ctrl) { const id = "m5pg-" + (++_uid), sid = id + "-l"; ctrl.id = id; ctrl.setAttribute("aria-labelledby", sid); return h("label", { for: id }, h("span", { id: sid }, ...parts), ctrl); }
  function slider(h, min, max, step, val, on) { const el = h("input", { type: "range", min, max, step, value: val }); el.addEventListener("input", (e) => on(+e.target.value)); return el; }
  function select(h, opts, val, on) { const el = h("select", { class: "pg-select" }, ...opts.map(([v, s]) => { const o = h("option", { value: v }, s); if (String(v) === String(val)) o.selected = true; return o; })); el.addEventListener("change", (e) => on(e.target.value)); return el; }
  function frame(W, H) { return svg("svg", { viewBox: `0 0 ${W} ${H}`, class: "pg-svg", role: "img" }); }

  /* ---------------- rastgele sayılar ve doğrusal olmayan kredi dünyası ---------------- */
  function rng(seed) { let x = seed >>> 0; return () => { x = (x + 0x6D2B79F5) >>> 0; let z = x; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; }; }
  function normal(u) { let a = 0; while (a === 0) a = u(); return Math.sqrt(-2 * Math.log(a)) * Math.cos(2 * Math.PI * u()); }
  const sig = (z) => 1 / (1 + Math.exp(-z));
  /* Notebook'taki ciz(n) ile aynı tarif */
  function world(u, n) {
    const X = [], y = [];
    for (let i = 0; i < n; i++) {
      const x = []; for (let j = 0; j < 6; j++) x.push(normal(u));
      x[1] = u() < 0.15 ? 1 : 0;
      x[4] = 0.4 * x[0] + Math.sqrt(0.84) * x[4];
      x[5] = 0.5 * x[3] + Math.sqrt(0.75) * x[5];
      const [b, g, gel, cal, kart, yas] = x;
      const lo = -2.9 + 1.5 * (b > 0.7) + 0.5 * g + 1.2 * g * (b > 0) - 0.5 * gel + 0.8 * (cal < -0.8) + 0.35 * kart + 0.45 * (yas * yas - 1);
      X.push(x); y.push(u() < sig(lo) ? 1 : 0);
    }
    return { X, y };
  }
  let SHARED = null;
  function shared() { if (!SHARED) { const u = rng(2026); SHARED = { tr: world(u, 3000), te: world(u, 8000) }; } return SHARED; }
  function auc(y, p) {
    const idx = p.map((v, i) => i).sort((a, b) => p[a] - p[b]);
    let r = 0, n1 = 0, i = 0;
    while (i < idx.length) { let j = i; while (j + 1 < idx.length && p[idx[j + 1]] === p[idx[i]]) j++; const rk = (i + j) / 2 + 1; for (let k = i; k <= j; k++) if (y[idx[k]]) { r += rk; n1++; } i = j + 1; }
    return (r - n1 * (n1 + 1) / 2) / (n1 * (y.length - n1));
  }

  /* ---------------- basit CART (Gini) ---------------- */
  function grow(X, y, idx, o, depth) {
    const n = idx.length; let s = 0; for (const i of idx) s += y[i];
    const leaf = { p: s / n, n };
    if (depth >= o.maxDepth || n < 2 * o.minLeaf || s === 0 || s === n) return leaf;
    let feats = [0, 1, 2, 3, 4, 5];
    if (o.mtry && o.mtry < 6) { for (let k = 5; k > 0; k--) { const j = Math.floor(o.u() * (k + 1)); [feats[k], feats[j]] = [feats[j], feats[k]]; } feats = feats.slice(0, o.mtry); }
    let best = null;
    const parent = 1 - (s / n) ** 2 - (1 - s / n) ** 2;
    for (const f of feats) {
      const ord = idx.slice().sort((a, b) => X[a][f] - X[b][f]);
      let ls = 0;
      for (let k = 0; k < n - 1; k++) {
        ls += y[ord[k]];
        const nl = k + 1, nr = n - nl;
        if (nl < o.minLeaf || nr < o.minLeaf) continue;
        const v0 = X[ord[k]][f], v1 = X[ord[k + 1]][f];
        if (v0 === v1) continue;
        const pl = ls / nl, pr = (s - ls) / nr;
        const g = parent - (nl / n) * (2 * pl * (1 - pl)) - (nr / n) * (2 * pr * (1 - pr));
        if (!best || g > best.g) best = { g, f, t: (v0 + v1) / 2, k };
      }
    }
    if (!best || best.g <= 1e-12) return leaf;
    const L = [], R = [];
    for (const i of idx) (X[i][best.f] <= best.t ? L : R).push(i);
    return { f: best.f, t: best.t, l: grow(X, y, L, o, depth + 1), r: grow(X, y, R, o, depth + 1), p: leaf.p, n };
  }
  function predict(node, x) { while (node.l) node = x[node.f] <= node.t ? node.l : node.r; return node.p; }
  function leaves(node) { return node.l ? leaves(node.l) + leaves(node.r) : 1; }

  /* İki eğri / üç eğri çizimi */
  function lines(t, lang, series, opts) {
    const W = 560, H = 230, Lm = 46, R = W - 10, T = 12, B = H - 32;
    const chart = frame(W, H);
    const xs = opts.xs, xl = xs[0], xh = xs[xs.length - 1], lo = opts.lo, hi = opts.hi;
    const sx = (v) => opts.log ? Lm + Math.log(v / xl) / Math.log(xh / xl) * (R - Lm) : Lm + (v - xl) / (xh - xl) * (R - Lm);
    const sy = (v) => B - (Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo) * (B - T);
    svg("rect", { x: Lm, y: T, width: R - Lm, height: B - T, class: "pg-frame" }, chart);
    opts.yt.forEach((v) => { txt(chart, Lm - 5, sy(v) + 4, fmt(v, 2, lang), "pg-lbl", "end"); svg("line", { x1: Lm, x2: R, y1: sy(v), y2: sy(v), class: "pg-axis" }, chart); });
    opts.xt.forEach((v) => txt(chart, sx(v), B + 16, String(v)));
    if (opts.ref != null) { svg("line", { x1: Lm, x2: R, y1: sy(opts.ref), y2: sy(opts.ref), class: "pg-ref" }, chart); if (opts.refLab) txt(chart, R - 6, sy(opts.ref) - 5, opts.refLab, "pg-lbl", "end"); }
    series.forEach((s) => svg("path", { d: s.v.map((v, i) => (i ? "L" : "M") + sx(xs[i]).toFixed(1) + " " + sy(v).toFixed(1)).join(""), class: "pg-line " + s.c }, chart));
    if (opts.mark != null) { svg("line", { x1: sx(opts.mark), x2: sx(opts.mark), y1: T, y2: B, class: "pg-ref" }, chart); series.forEach((s) => { const i = xs.indexOf(opts.mark); if (i >= 0) svg("circle", { cx: sx(opts.mark), cy: sy(s.v[i]), r: 4.5, class: "pg-dot hot" }, chart); }); }
    txt(chart, (Lm + R) / 2, H - 2, opts.xlab);
    return chart;
  }
  function legend(h, items) { return h("div", { class: "pg-checks" }, ...items.map(([c, s]) => h("span", { class: "pg-check" }, h("span", { class: "pg-swatch " + c }), s))); }

  /* =====================================================================
   * treeSplit — tek bir soru: eşiği kaydır, iki grubun temerrüt oranı ve ayırma gücü
   * ===================================================================== */
  P.treeSplit = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    const S = shared(), X = S.tr.X, y = S.tr.y;
    const VARS = [[0, t({ tr: "Borç/gelir", en: "Debt/income" })], [5, t({ tr: "Yaş", en: "Age" })], [3, t({ tr: "Çalışma süresi", en: "Years employed" })], [2, t({ tr: "Gelir", en: "Income" })]];
    let f = 0, thr = 0;
    const TH = Array.from({ length: 81 }, (_, i) => -2 + i * 0.05);
    function stats(f, th) { let nl = 0, sl = 0, nr = 0, sr = 0; for (let i = 0; i < y.length; i++) { if (X[i][f] <= th) { nl++; sl += y[i]; } else { nr++; sr += y[i]; } } const n = nl + nr, s = sl + sr, pp = s / n, pl = nl ? sl / nl : 0, pr = nr ? sr / nr : 0; const gain = 2 * pp * (1 - pp) - (nl / n) * 2 * pl * (1 - pl) - (nr / n) * 2 * pr * (1 - pr); return { nl, nr, pl, pr, gain }; }
    let gains = TH.map((v) => stats(f, v).gain);
    const lab = h("b");
    const sl = slider(h, -2, 2, 0.05, thr, (v) => { thr = v; ctx.touch(); draw(); });
    const ctrls = h("div", { class: "pg-ctrls" },
      pgLabel(h, [t({ tr: "Değişken", en: "Variable" })], select(h, VARS, f, (v) => { f = +v; gains = TH.map((x) => stats(f, x).gain); ctx.touch(); draw(); })),
      pgLabel(h, [t({ tr: "Soru: değer ≤ ", en: "Question: value ≤ " }), lab], sl),
      h("button", { class: "btn sm", onclick: () => { const i = gains.indexOf(Math.max(...gains)); thr = TH[i]; sl.value = thr; ctx.touch(); draw(); } }, t({ tr: "En iyi eşiği bul", en: "Find the best threshold" })));
    const tiles = h("div", { class: "tiles" }), box = h("div"), note = h("p", { class: "pg-note" });
    function draw() {
      lab.textContent = fmt(thr, 2, lang);
      const s = stats(f, thr), bi = gains.indexOf(Math.max(...gains));
      tiles.innerHTML = "";
      tiles.append(tile(h, t({ tr: "Evet grubu (≤)", en: "Yes group (≤)" }), s.nl), tile(h, t({ tr: "Temerrüt oranı (evet)", en: "Default rate (yes)" }), pct(s.pl, 1, lang)),
        tile(h, t({ tr: "Hayır grubu (>)", en: "No group (>)" }), s.nr), tile(h, t({ tr: "Temerrüt oranı (hayır)", en: "Default rate (no)" }), pct(s.pr, 1, lang)),
        tile(h, t({ tr: "En iyi eşik", en: "Best threshold" }), fmt(TH[bi], 2, lang), "win"));
      box.innerHTML = "";
      box.append(lines(t, lang, [{ v: gains.map((g) => g / Math.max(...gains)), c: "c0" }], { xs: TH, xt: [-2, -1, 0, 1, 2], yt: [0, 0.5, 1], lo: 0, hi: 1.05, mark: TH.reduce((a, b) => (Math.abs(b - thr) < Math.abs(a - thr) ? b : a)), xlab: t({ tr: "eşik — dikey eksen: ayırma gücü (Gini azalması, en iyiye göre)", en: "threshold — vertical axis: separating power (Gini reduction, relative to the best)" }) }));
      note.textContent = t({ tr: "3.000 eğitim başvurusu. Ağaç her soruda, iki grubu birbirinden en çok ayıran (Gini safsızlığını en çok azaltan) değişkeni ve eşiği seçer. Borç/gelir için en iyi eşik gerçek eşiğe (0,7) yakın. Yaşı dene: tek bir eşik U biçimini yakalayamaz; ağaç bunun için yaşı iki kez sorar.", en: "3,000 training applications. At each question the tree picks the variable and threshold that best separate the two groups (that reduce Gini impurity most). For debt/income the best threshold is near the true one (0.7). Try age: a single threshold cannot capture the U shape; the tree asks about age twice for that." });
    }
    host.append(ctrls, tiles, box, note);
    draw();
  };

  /* =====================================================================
   * treeDepth — derinlik arttıkça eğitim, çapraz doğrulama ve test AUC'si
   * ===================================================================== */
  P.treeDepth = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    const S = shared(), X = S.tr.X, y = S.tr.y;
    const DS = Array.from({ length: 12 }, (_, i) => i + 1);
    let minLeaf = 1, depth = 4, R = null;
    function compute() {
      const all = X.map((_, i) => i), u = rng(7), perm = all.slice().sort(() => u() - 0.5), folds = [0, 1, 2, 3, 4].map((k) => perm.filter((_, i) => i % 5 === k));
      const tr = [], cv = [], te = [], nl = [];
      DS.forEach((d) => {
        const o = { maxDepth: d, minLeaf };
        const T = grow(X, y, all, o, 0);
        tr.push(auc(y, X.map((x) => predict(T, x)))); te.push(auc(S.te.y, S.te.X.map((x) => predict(T, x)))); nl.push(leaves(T));
        let sc = 0; folds.forEach((fo) => { const held = new Set(fo), fit = all.filter((i) => !held.has(i)); const Tf = grow(X, y, fit, o, 0); sc += auc(fo.map((i) => y[i]), fo.map((i) => predict(Tf, X[i]))); });
        cv.push(sc / 5);
      });
      R = { tr, cv, te, nl, best: DS[cv.indexOf(Math.max(...cv))] };
    }
    const ld = h("b");
    const ctrls = h("div", { class: "pg-ctrls" },
      pgLabel(h, [t({ tr: "Derinlik = ", en: "Depth = " }), ld], slider(h, 1, 12, 1, depth, (v) => { depth = v; ctx.touch(); draw(); })),
      pgLabel(h, [t({ tr: "Yapraktaki en az kişi", en: "Minimum people per leaf" })], select(h, [[1, "1"], [20, "20"], [100, "100"]], minLeaf, (v) => { minLeaf = +v; ctx.touch(); box.innerHTML = ""; setTimeout(() => { compute(); draw(); }, 20); })));
    const tiles = h("div", { class: "tiles" }), box = h("div"), note = h("p", { class: "pg-note" });
    function draw() {
      ld.textContent = depth;
      const i = depth - 1;
      tiles.innerHTML = "";
      tiles.append(tile(h, t({ tr: "Yaprak sayısı", en: "Leaves" }), R.nl[i]), tile(h, t({ tr: "Eğitim AUC", en: "Training AUC" }), fmt(R.tr[i], 3, lang)),
        tile(h, t({ tr: "Çapraz doğrulama AUC", en: "Cross-validation AUC" }), fmt(R.cv[i], 3, lang)), tile(h, t({ tr: "Test AUC", en: "Test AUC" }), fmt(R.te[i], 3, lang), R.tr[i] - R.te[i] > 0.15 ? "warn" : ""),
        tile(h, t({ tr: "Çapraz doğrulamanın seçtiği", en: "Chosen by cross-validation" }), R.best, "win"));
      box.innerHTML = "";
      box.append(lines(t, lang, [{ v: R.tr, c: "c6" }, { v: R.cv, c: "c3" }, { v: R.te, c: "c0" }], { xs: DS, xt: [1, 2, 4, 6, 8, 10, 12], yt: [0.5, 0.6, 0.7, 0.8, 0.9, 1], lo: 0.5, hi: 1, mark: depth, xlab: t({ tr: "ağacın derinliği", en: "tree depth" }) }),
        legend(h, [["c6", t({ tr: "eğitim", en: "training" })], ["c3", t({ tr: "çapraz doğrulama (eğitim içinde)", en: "cross-validation (within training)" })], ["c0", t({ tr: "test (yalnızca gösterim için)", en: "test (for display only)" })]]));
      note.textContent = t({ tr: "Eğitim AUC'si derinlikle artar ya da (yaprak sınırı bölmeyi durdurunca) düzleşir. Çapraz doğrulama ile test eğrisi birlikte hareket eder: çapraz doğrulama, test verisine dokunmadan yeni verideki başarıyı tahmin eder. “Yapraktaki en az kişi”yi 100 yap: derin ağaçlar bile artık ezberleyemez ve eğitim eğrisi düzleşir. Bu oyun alanı verisini tarayıcıda ayrıca üretir; buradaki en iyi derinlik hücrelerdeki 4'ten farklı çıkabilir, çünkü seçim örnekleme bağlıdır.", en: "Training AUC rises with depth or (once a leaf-size limit stops the splitting) levels off. The cross-validation and test curves move together: cross-validation estimates success on new data without touching the test data. Set “minimum people per leaf” to 100: even deep trees can no longer memorise, and the training curve levels off. This playground generates its own data in the browser; the best depth here may differ from the 4 in the cells, because the choice depends on the sample." });
    }
    host.append(ctrls, tiles, box, note);
    compute(); draw();
  };

  /* =====================================================================
   * forestGrow — ağaç sayısı ve her soruda denenen değişken sayısı
   * ===================================================================== */
  P.forestGrow = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    const S = shared(), X = S.tr.X, y = S.tr.y, TX = S.te.X.slice(0, 4000), Ty = S.te.y.slice(0, 4000);
    const NS = [1, 2, 3, 5, 7, 10, 15, 20, 30, 50, 70, 100];
    let k = 20, mtry = 2;
    const cache = {};
    function curve(m) {
      if (cache[m]) return cache[m];
      const u = rng(100 + m), sum = new Array(TX.length).fill(0), single = [], out = [];
      let built = 0;
      for (const n of NS) {
        while (built < n) {
          const idx = Array.from({ length: X.length }, () => Math.floor(u() * X.length));
          const T = grow(X, y, idx, { maxDepth: 30, minLeaf: 10, mtry: m, u }, 0);
          const p = TX.map((x) => predict(T, x)); p.forEach((v, i) => (sum[i] += v));
          if (single.length < 10) single.push(auc(Ty, p));
          built++;
        }
        out.push(auc(Ty, sum.map((v) => v / built)));
      }
      return (cache[m] = { out, single: single.reduce((a, b) => a + b, 0) / single.length });
    }
    const lk = h("b");
    const ctrls = h("div", { class: "pg-ctrls" },
      pgLabel(h, [t({ tr: "Ağaç sayısı = ", en: "Number of trees = " }), lk], slider(h, 0, NS.length - 1, 1, NS.indexOf(k), (v) => { k = NS[v]; ctx.touch(); draw(); })),
      pgLabel(h, [t({ tr: "Her soruda denenen değişken", en: "Variables tried at each question" })], select(h, [[1, "1"], [2, t({ tr: "2 (rassal orman, √6)", en: "2 (random forest, √6)" })], [4, "4"], [6, t({ tr: "6 (bagging)", en: "6 (bagging)" })]], mtry, (v) => { mtry = +v; ctx.touch(); box.innerHTML = ""; note.textContent = t({ tr: "Orman kuruluyor…", en: "Growing the forest…" }); setTimeout(draw, 20); })));
    const tiles = h("div", { class: "tiles" }), box = h("div"), note = h("p", { class: "pg-note" });
    function draw() {
      lk.textContent = k;
      const C = curve(mtry), B = mtry === 6 ? null : cache[6] || null, i = NS.indexOf(k);
      if (mtry !== 6 && !cache[6]) setTimeout(() => { curve(6); draw(); }, 60);
      tiles.innerHTML = "";
      tiles.append(tile(h, t({ tr: "Tek ağaç (ortalama)", en: "Single tree (average)" }), fmt(C.single, 3, lang)), tile(h, t({ tr: "Orman, seçilen ağaç sayısı", en: "Forest, chosen number of trees" }), fmt(C.out[i], 3, lang), "win"),
        tile(h, t({ tr: "Orman, 100 ağaç", en: "Forest, 100 trees" }), fmt(C.out[NS.length - 1], 3, lang)), B ? tile(h, t({ tr: "Bagging, 100 ağaç", en: "Bagging, 100 trees" }), fmt(B.out[NS.length - 1], 3, lang)) : tile(h, t({ tr: "Bagging, 100 ağaç", en: "Bagging, 100 trees" }), mtry === 6 ? fmt(C.out[NS.length - 1], 3, lang) : "…"));
      box.innerHTML = "";
      const ser = [{ v: C.out, c: "c0" }]; if (B) ser.unshift({ v: B.out, c: "c6" });
      box.append(lines(t, lang, ser, { xs: NS, log: true, xt: [1, 2, 5, 10, 20, 50, 100], yt: [0.65, 0.7, 0.75, 0.8], lo: 0.64, hi: 0.83, mark: k, ref: C.single, refLab: t({ tr: "tek ağaç", en: "single tree" }), xlab: t({ tr: "ağaç sayısı (logaritmik)", en: "number of trees (log scale)" }) }),
        legend(h, mtry !== 6 ? [["c0", t({ tr: "seçilen orman", en: "chosen forest" })], ["c6", t({ tr: "bagging (6 değişken)", en: "bagging (6 variables)" })]] : [["c0", t({ tr: "bagging (6 değişken)", en: "bagging (6 variables)" })]]));
      note.textContent = t({ tr: "Her ağaç bir bootstrap örnekleminde, yapraklarında en az 10 kişi kalana kadar büyütülür (4.000 test başvurusu). Ağaç eklemek boosting'deki gibi sistematik bir aşırı uyum yaratmaz; eğri küçük oynamalarla bir sınıra yaklaşır, kazanç önce hızlı, sonra yavaş. Her soruda daha az değişken denemek ağaçları birbirinden farklılaştırır; ama daha fazla çeşitlilik her zaman daha iyi orman demek değildir.", en: "Each tree is grown on a bootstrap sample until at least 10 people remain in its leaves (4,000 test applications). Adding trees does not create systematic overfitting as in boosting; the curve approaches a limit with small wobbles, the gain fast at first, then slow. Trying fewer variables at each question makes the trees differ from each other; but more diversity does not always mean a better forest." });
    }
    host.append(ctrls, tiles, box, note);
    setTimeout(draw, 10);
  };

  /* =====================================================================
   * boostSteps — tek değişkenle (yaş) boosting: her küçük ağaç kalan hatayı düzeltir
   * ===================================================================== */
  P.boostSteps = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    const u = rng(55), truth = (a) => sig(-1.9 + 0.45 * (a * a - 1));
    function draw1(n) { const x = [], y = []; for (let i = 0; i < n; i++) { const a = normal(u); x.push(a); y.push(u() < truth(a) ? 1 : 0); } return { x, y }; }
    const TR = draw1(800), TE = draw1(8000);
    const MS = [0, 1, 2, 3, 5, 10, 20, 50, 100, 200, 300];
    let lr = 0.1, m = 10, F = null;
    /* Derinliği 2 olan regresyon ağaçları, lojistik kayıp için Newton adımı */
    function stump(x, g, w, idx, depth) {
      let sg = 0, sw = 0; for (const i of idx) { sg += g[i]; sw += w[i]; }
      const val = sg / (sw + 1e-9);
      if (depth === 0 || idx.length < 20) return { v: val };
      const ord = idx.slice().sort((a, b) => x[a] - x[b]);
      let best = null, lg = 0, lw = 0;
      for (let k = 0; k < ord.length - 1; k++) {
        lg += g[ord[k]]; lw += w[ord[k]];
        if (k + 1 < 10 || ord.length - k - 1 < 10 || x[ord[k]] === x[ord[k + 1]]) continue;
        const sc = lg * lg / (lw + 1e-9) + (sg - lg) ** 2 / (sw - lw + 1e-9);
        if (!best || sc > best.sc) best = { sc, t: (x[ord[k]] + x[ord[k + 1]]) / 2 };
      }
      if (!best) return { v: val };
      const L = idx.filter((i) => x[i] <= best.t), R = idx.filter((i) => x[i] > best.t);
      return { t: best.t, l: stump(x, g, w, L, depth - 1), r: stump(x, g, w, R, depth - 1) };
    }
    const pv = (n, a) => (n.l ? pv(a <= n.t ? n.l : n.r, a) : n.v);
    function fit() {
      const n = TR.x.length, base = Math.log(TR.y.reduce((s, v) => s + v, 0) / (n - TR.y.reduce((s, v) => s + v, 0)));
      const f = new Array(n).fill(base), trees = [], all = TR.x.map((_, i) => i);
      for (let k = 0; k < 300; k++) {
        const p = f.map(sig), g = TR.y.map((v, i) => v - p[i]), w = p.map((q) => q * (1 - q));
        const T = stump(TR.x, g, w, all, 2); trees.push(T);
        for (let i = 0; i < n; i++) f[i] += lr * pv(T, TR.x[i]);
      }
      const GRID = Array.from({ length: 81 }, (_, i) => -3 + i * 0.075);
      const curveAt = (mm) => GRID.map((a) => { let z = base; for (let k = 0; k < mm; k++) z += lr * pv(trees[k], a); return sig(z); });
      const teAt = (mm) => { const z = TE.x.map(() => base); for (let k = 0; k < mm; k++) TE.x.forEach((a, i) => (z[i] += lr * pv(trees[k], a))); let ll = 0; TE.y.forEach((v, i) => { const q = Math.min(1 - 1e-9, Math.max(1e-9, sig(z[i]))); ll -= v ? Math.log(q) : Math.log(1 - q); }); return ll / TE.y.length; };
      F = { GRID, curveAt, loss: MS.map(teAt) };
    }
    const lm = h("b");
    const ctrls = h("div", { class: "pg-ctrls" },
      pgLabel(h, [t({ tr: "Ağaç sayısı = ", en: "Number of trees = " }), lm], slider(h, 0, MS.length - 1, 1, MS.indexOf(m), (v) => { m = MS[v]; ctx.touch(); draw(); })),
      pgLabel(h, [t({ tr: "Öğrenme oranı", en: "Learning rate" })], select(h, [[0.05, fmt(0.05, 2, lang)], [0.1, fmt(0.1, 1, lang)], [0.5, fmt(0.5, 1, lang)], [1, "1"]], lr, (v) => { lr = +v; ctx.touch(); fit(); draw(); })));
    const tiles = h("div", { class: "tiles" }), box = h("div"), note = h("p", { class: "pg-note" });
    function draw() {
      lm.textContent = m;
      const i = MS.indexOf(m), bi = F.loss.indexOf(Math.min(...F.loss));
      tiles.innerHTML = "";
      tiles.append(tile(h, t({ tr: "Test log-kaybı, yalnızca yaş (düşük = iyi)", en: "Test log loss, age only (lower = better)" }), fmt(F.loss[i], 4, lang), i > bi + 1 ? "warn" : ""), tile(h, t({ tr: "En iyi ağaç sayısı", en: "Best number of trees" }), MS[bi], "win"), tile(h, t({ tr: "En iyi test log-kaybı", en: "Best test log loss" }), fmt(F.loss[bi], 4, lang)));
      const W = 560, H = 230, Lm = 46, R = W - 10, T = 12, B = H - 32, hi = 0.6;
      const chart = frame(W, H), sx = (a) => Lm + (a + 3) / 6 * (R - Lm), sy = (v) => B - Math.min(v, hi) / hi * (B - T);
      svg("rect", { x: Lm, y: T, width: R - Lm, height: B - T, class: "pg-frame" }, chart);
      [0, 0.2, 0.4, 0.6].forEach((v) => { txt(chart, Lm - 5, sy(v) + 4, fmt(v, 1, lang), "pg-lbl", "end"); svg("line", { x1: Lm, x2: R, y1: sy(v), y2: sy(v), class: "pg-axis" }, chart); });
      [-3, -2, -1, 0, 1, 2, 3].forEach((v) => txt(chart, sx(v), B + 16, v));
      /* eğitim verisinde yaş dilimlerine göre gerçekleşen oranlar */
      for (let a = -3; a < 3; a += 0.5) { let n = 0, s = 0; TR.x.forEach((v, j) => { if (v >= a && v < a + 0.5) { n++; s += TR.y[j]; } }); if (n >= 8) svg("circle", { cx: sx(a + 0.25), cy: sy(s / n), r: 3 + Math.min(5, n / 40), class: "pg-dot" }, chart); }
      svg("path", { d: F.GRID.map((a, j) => (j ? "L" : "M") + sx(a).toFixed(1) + " " + sy(truth(a)).toFixed(1)).join(""), class: "pg-ref" }, chart);
      const cur = F.curveAt(m);
      svg("path", { d: F.GRID.map((a, j) => (j ? "L" : "M") + sx(a).toFixed(1) + " " + sy(cur[j]).toFixed(1)).join(""), class: "pg-line c0" }, chart);
      txt(chart, (Lm + R) / 2, H - 2, t({ tr: "yaş (standartlaştırılmış) — dikey eksen: temerrüt olasılığı", en: "age (standardised) — vertical axis: default probability" }));
      box.innerHTML = ""; box.append(chart, legend(h, [["c0", t({ tr: "boosting modeli", en: "boosting model" })], ["c6", t({ tr: "gerçek olasılık (kesikli)", en: "true probability (dashed)" })]]));
      note.textContent = t({ tr: "Bu oyun alanı kavram sayfasındaki şekilden farklı bir kurgudur: altı değişken ve AUC yerine tek değişken (yaş), 800 eğitim başvurusu ve ölçü olarak test log-kaybı. Noktalar eğitim verisindeki yaş dilimlerinin temerrüt oranı. 0 ağaçta model herkese ortalama oranı verir; her küçük ağaç (derinlik 2) kalan hatanın bir kısmını düzeltir. Öğrenme oranını 1 yapıp ağaç sayısını artır: eğri gürültüyü izlemeye başlar ve test log-kaybı kötüleşir.", en: "This playground is a different setup from the figure on the concept page: instead of six variables and AUC, a single variable (age), 800 training applications and test log loss as the metric. The dots are the default rates of age bands in the training data. With 0 trees the model gives everyone the average rate; each small tree (depth 2) corrects part of the remaining error. Set the learning rate to 1 and add trees: the curve starts following the noise and the test log loss gets worse." });
    }
    host.append(ctrls, tiles, box, note);
    fit(); draw();
  };

  /* =====================================================================
   * shapWaterfall — SHAP katkılarını taban değerden başlayıp adım adım toplamak
   * ===================================================================== */
  P.shapWaterfall = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    const NAMES = [t({ tr: "Borç/gelir", en: "Debt/income" }), t({ tr: "Önceki gecikme", en: "Past delinquency" }), t({ tr: "Gelir", en: "Income" }), t({ tr: "Çalışma süresi", en: "Years employed" }), t({ tr: "Kart harcaması/gelir", en: "Card spending/income" }), t({ tr: "Yaş", en: "Age" })];
    const BASE = -1.93;
    const APP = {
      A: { x: [1.96, 1, 0.55, -0.21, 1.09, -0.89], s: [1.56, 1.06, -0.40, -0.11, 0.21, 0.12] },
      B: { x: [-1.09, 0, 1.34, 1.01, -1.51, -0.08], s: [-0.28, -0.08, -0.38, -0.17, -0.31, -0.28] }
    };
    let who = "A", step = 6;
    const ls = h("b");
    const sl = slider(h, 0, 6, 1, step, (v) => { step = v; ctx.touch(); draw(); });
    const ctrls = h("div", { class: "pg-ctrls" },
      pgLabel(h, [t({ tr: "Başvuran", en: "Applicant" })], select(h, [["A", t({ tr: "A: yüksek borç, gecikmeli", en: "A: high debt, delinquent" })], ["B", t({ tr: "B: en düşük riskli", en: "B: lowest risk" })]], who, (v) => { who = v; ctx.touch(); draw(); })),
      pgLabel(h, [t({ tr: "Eklenen katkı sayısı = ", en: "Contributions added = " }), ls], sl));
    const tiles = h("div", { class: "tiles" }), box = h("div"), note = h("p", { class: "pg-note" });
    function draw() {
      ls.textContent = step;
      const a = APP[who], order = [0, 1, 2, 3, 4, 5].sort((i, j) => Math.abs(a.s[j]) - Math.abs(a.s[i]));
      let z = BASE; const cum = [BASE];
      order.forEach((i, k) => { z += a.s[i]; cum.push(z); });
      const zNow = cum[step];
      tiles.innerHTML = "";
      tiles.append(tile(h, t({ tr: "Taban (referans beklenti)", en: "Base (reference expectation)" }), fmt(BASE, 2, lang) + " → " + pct(sig(BASE), 0, lang)),
        tile(h, t({ tr: "Şu ana kadarki log-odds", en: "Log-odds so far" }), fmt(zNow, 2, lang)), tile(h, t({ tr: "Olasılık", en: "Probability" }), pct(sig(zNow), 1, lang), "win"),
        tile(h, t({ tr: "Bütün katkılarla", en: "With all contributions" }), pct(sig(cum[6]), 1, lang)));
      const W = 560, rowH = 30, T = 16, H = T + 7 * rowH + 34, Lm = 190, R = W - 20, lo = -4, hi = 1;
      const chart = frame(W, H), sx = (v) => Lm + (v - lo) / (hi - lo) * (R - Lm);
      svg("rect", { x: Lm, y: T - 6, width: R - Lm, height: 7 * rowH + 6, class: "pg-frame" }, chart);
      [-4, -3, -2, -1, 0, 1].forEach((v) => { svg("line", { x1: sx(v), x2: sx(v), y1: T - 6, y2: T + 7 * rowH, class: "pg-axis" }, chart); txt(chart, sx(v), T + 7 * rowH + 16, String(v)); });
      txt(chart, Lm - 8, T + 18, t({ tr: "taban", en: "base" }), "pg-lbl", "end");
      svg("line", { x1: sx(BASE), x2: sx(BASE), y1: T, y2: T + rowH * 7, class: "pg-ref" }, chart);
      order.forEach((i, k) => {
        const y0 = T + (k + 1) * rowH, shown = k < step;
        txt(chart, Lm - 8, y0 + 18, `${NAMES[i]} = ${fmt(a.x[i], 2, lang)}`, "pg-lbl", "end");
        if (!shown) return;
        const x1 = sx(cum[k]), x2 = sx(cum[k + 1]);
        svg("rect", { x: Math.min(x1, x2), y: y0 + 4, width: Math.max(2, Math.abs(x2 - x1)), height: rowH - 8, class: "pg-bar " + (a.s[i] > 0 ? "c4" : "c0"), rx: 3 }, chart);
        txt(chart, Math.max(x1, x2) + 6, y0 + 19, (a.s[i] > 0 ? "+" : "") + fmt(a.s[i], 2, lang), "pg-lbl", "start");
      });
      txt(chart, (Lm + R) / 2, H - 2, t({ tr: "log-odds (pembe: riski artıran, yeşil: azaltan)", en: "log-odds (pink: raises risk, green: lowers it)" }));
      box.innerHTML = ""; box.append(chart);
      note.textContent = t({ tr: "Katkılar, 6. hafta notebook'undaki boosting modeli için shap.TreeExplainer'ın verdiği değerler (büyükten küçüğe sıralı). Katkılar log-odds ölçeğinde toplanır; olasılık ancak en sonda, 1/(1+e^−z) ile hesaplanır. Aynı log-odds katkısı, başlangıç noktasına göre olasılığı farklı miktarlarda değiştirir. Taban, açıklayıcının referans beklentisidir (modelin eğitim verisindeki ortalama skoru), ortalama başvuranın tahmini değil. Katkılar iki basamağa yuvarlandığı için A'nın toplamı 0,51 görünür; tam duyarlıkla 0,5042'dir.", en: "The contributions are the values shap.TreeExplainer gave for the boosting model in the week 6 notebook (sorted from largest to smallest). Contributions add up on the log-odds scale; the probability is computed only at the end, with 1/(1+e^−z). The same log-odds contribution changes the probability by different amounts depending on the starting point. The base is the explainer's reference expectation (the model's mean score on the training data), not the average applicant's prediction. Because the contributions are rounded to two decimals, A's total shows as 0.51; at full precision it is 0.5042." });
    }
    host.append(ctrls, tiles, box, note);
    draw();
  };
})();
