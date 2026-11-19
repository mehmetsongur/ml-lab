/* Modül 6 — oyun alanları: rastgele yürüyüş, kur ve volatilite, rastgele/zamana saygılı bölme, yürüyen pencere,
 * volatilite öngörüsü, veri madenciliği.
 * Gerçek veri: data/fred/DEXUSEU.csv (FRED, Federal Reserve H.10, kamu malı); hesaplar tarayıcıda, JavaScript ile.
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
  function frame(W, H) { return svg("svg", { viewBox: `0 0 ${W} ${H}`, class: "pg-svg", role: "img" }); }
  function legend(h, items) { return h("div", { class: "pg-checks" }, ...items.map(([c, s]) => h("span", { class: "pg-check" }, h("span", { class: "pg-swatch " + c }), s))); }
  function rng(seed) { let x = seed >>> 0; return () => { x = (x + 0x6D2B79F5) >>> 0; let z = x; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; }; }
  function normal(u) { let a = 0; while (a === 0) a = u(); return Math.sqrt(-2 * Math.log(a)) * Math.cos(2 * Math.PI * u()); }
  const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
  function corr(a, b) { const ma = mean(a), mb = mean(b); let sab = 0, saa = 0, sbb = 0; for (let i = 0; i < a.length; i++) { sab += (a[i] - ma) * (b[i] - mb); saa += (a[i] - ma) ** 2; sbb += (b[i] - mb) ** 2; } return sab / Math.sqrt(saa * sbb); }
  function tstat(y, x) { const n = y.length, r = corr(y, x); return r * Math.sqrt((n - 2) / (1 - r * r)); }

  /* ---------------- gerçek veri: euro/dolar ---------------- */
  let FXP = null;
  function loadFX() {
    if (FXP) return FXP;
    FXP = fetch("data/fred/DEXUSEU.csv").then((r) => { if (!r.ok) throw new Error("data"); return r.text(); }).then((s) => {
      const d = [], v = [];
      s.trim().split(/\r?\n/).slice(1).forEach((l) => { const [a, b] = l.split(","); const x = parseFloat(b); if (isFinite(x)) { d.push(a); v.push(x); } });
      const r = [], rd = [];
      for (let i = 1; i < v.length; i++) { r.push(100 * Math.log(v[i] / v[i - 1])); rd.push(d[i]); }
      const roll = (w) => r.map((_, i) => { if (i < w - 1) return NaN; let s = 0; for (let k = i - w + 1; k <= i; k++) s += r[k] * r[k]; return Math.sqrt(s / w); });
      const v5 = roll(5), v20 = roll(20), v60 = roll(60);
      const yv = r.map((_, i) => (i + 20 < r.length ? v20[i + 20] : NaN));
      const yr = r.map((_, i) => (i + 1 < r.length ? r[i + 1] : NaN));
      return { dates: rd, r, v5, v20, v60, yv, yr, year: rd.map((x) => +x.slice(0, 4)) };
    });
    return FXP;
  }
  function waiting(h, t, host, run) {
    const msg = h("p", { class: "pg-note" }, t({ tr: "Euro/dolar verisi yükleniyor…", en: "Loading the euro/dollar data…" }));
    host.append(msg);
    loadFX().then((F) => { msg.remove(); run(F); }, () => { msg.textContent = t({ tr: "Veri yüklenemedi. Sayfayı yenileyip yeniden dene.", en: "The data could not be loaded. Refresh the page and try again." }); });
  }
  function solve(A, b) {
    const n = b.length, M = A.map((r, i) => r.concat([b[i]]));
    for (let c = 0; c < n; c++) { let mx = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[mx][c])) mx = r; [M[c], M[mx]] = [M[mx], M[c]]; for (let r = c + 1; r < n; r++) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; } }
    const x = new Array(n).fill(0); for (let r = n - 1; r >= 0; r--) { let s = M[r][n]; for (let k = r + 1; k < n; k++) s -= M[r][k] * x[k]; x[r] = s / M[r][r]; } return x;
  }
  function ols(rows, y) { const k = rows[0].length; const A = Array.from({ length: k }, () => new Array(k).fill(0)), b = new Array(k).fill(0); rows.forEach((x, i) => { for (let a = 0; a < k; a++) { b[a] += x[a] * y[i]; for (let c = 0; c < k; c++) A[a][c] += x[a] * x[c]; } }); return solve(A, b); }
  const r2 = (y, p) => { const m = mean(y); let ss = 0, st = 0; y.forEach((v, i) => { ss += (v - p[i]) ** 2; st += (v - m) ** 2; }); return 1 - ss / st; };

  /* =====================================================================
   * randomWalk — bağımsız iki rastgele yürüyüş: düzeyler ilişkili görünür, getiriler görünmez
   * ===================================================================== */
  P.randomWalk = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    let seed = 1, n = 0, sigL = 0, sigD = 0;
    const tiles = h("div", { class: "tiles" }), box = h("div"), note = h("p", { class: "pg-note" });
    const ctrls = h("div", { class: "pg-ctrls" },
      h("button", { class: "btn sm", onclick: () => { seed++; ctx.touch(); draw(); } }, t({ tr: "Yeni bir çift üret", en: "Generate a new pair" })),
      h("button", { class: "btn sm", onclick: () => { for (let k = 0; k < 50; k++) { seed++; draw(true); } ctx.touch(); draw(); } }, t({ tr: "50 çift daha üret", en: "Generate 50 more pairs" })));
    let last = null;
    function draw(silent) {
      const u = rng(seed * 101), N = 1000, a = [0], b = [0];
      for (let i = 1; i < N; i++) { a.push(a[i - 1] + normal(u)); b.push(b[i - 1] + normal(u)); }
      const da = a.slice(1).map((v, i) => v - a[i]), db = b.slice(1).map((v, i) => v - b[i]);
      const cl = corr(a, b), cd = corr(da, db);
      if (!last || last !== seed) { n++; if (Math.abs(tstat(a, b)) > 2) sigL++; if (Math.abs(tstat(da, db)) > 2) sigD++; last = seed; }
      if (silent) return;
      tiles.innerHTML = "";
      tiles.append(tile(h, t({ tr: "Düzeylerin korelasyonu", en: "Correlation of levels" }), fmt(cl, 2, lang), Math.abs(cl) > 0.3 ? "warn" : ""), tile(h, t({ tr: "Getirilerin korelasyonu", en: "Correlation of returns" }), fmt(cd, 2, lang), "win"),
        tile(h, t({ tr: "Üretilen çift", en: "Pairs generated" }), n), tile(h, t({ tr: "Düzeylerde |t| > 2", en: "|t| > 2 in levels" }), pct(sigL / n, 0, lang), "warn"), tile(h, t({ tr: "Getirilerde |t| > 2", en: "|t| > 2 in returns" }), pct(sigD / n, 0, lang)));
      const W = 560, H = 220, Lm = 40, R = W - 10, T = 12, B = H - 28, lo = Math.min(...a, ...b), hi = Math.max(...a, ...b);
      const ch = frame(W, H), sx = (i) => Lm + i / (N - 1) * (R - Lm), sy = (v) => B - (v - lo) / (hi - lo || 1) * (B - T);
      svg("rect", { x: Lm, y: T, width: R - Lm, height: B - T, class: "pg-frame" }, ch);
      svg("line", { x1: Lm, x2: R, y1: sy(0), y2: sy(0), class: "pg-axis" }, ch);
      [[a, "c0"], [b, "c4"]].forEach(([s, c]) => svg("path", { d: s.map((v, i) => (i ? "L" : "M") + sx(i).toFixed(1) + " " + sy(v).toFixed(1)).join(""), class: "pg-line " + c }, ch));
      txt(ch, (Lm + R) / 2, H - 4, t({ tr: "gün (1.000 gün, iki bağımsız seri)", en: "day (1,000 days, two independent series)" }));
      box.innerHTML = ""; box.append(ch);
      note.textContent = t({ tr: "İki seri birbirinden tamamen bağımsız: her gün yazı turayla bir adım atıyorlar. Yine de düzeyleri sık sık aynı yöne sürüklenir ve yüksek korelasyon gösterir. Birkaç kez üret ve sayaçlara bak: düzeylerde “anlamlı” ilişki oranı %5'in çok üstünde, getirilerde %5 civarında.", en: "The two series are completely independent: each takes a coin-toss step every day. Still, their levels often drift the same way and show high correlation. Generate a few times and watch the counters: the share of “significant” relationships is far above 5% in levels and about 5% in returns." });
    }
    host.append(ctrls, tiles, box, note);
    draw();
  };

  /* =====================================================================
   * fxSeries — euro/dolar getirileri ve volatilite, dönem seçimi
   * ===================================================================== */
  P.fxSeries = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    waiting(h, t, host, (F) => {
      const Y0 = F.year[0], Y1 = F.year[F.year.length - 1];
      let a = 2007, b = 2009;
      const la = h("b"), lb = h("b");
      const ctrls = h("div", { class: "pg-ctrls" },
        h("label", null, h("span", null, t({ tr: "Başlangıç yılı = ", en: "Start year = " }), la), slider(h, Y0, Y1, 1, a, (v) => { a = Math.min(v, b); ctx.touch(); draw(); })),
        h("label", null, h("span", null, t({ tr: "Bitiş yılı = ", en: "End year = " }), lb), slider(h, Y0, Y1, 1, b, (v) => { b = Math.max(v, a); ctx.touch(); draw(); })));
      const tiles = h("div", { class: "tiles" }), box = h("div"), note = h("p", { class: "pg-note" });
      const sdAll = Math.sqrt(mean(F.r.map((x) => x * x)));
      function draw() {
        la.textContent = a; lb.textContent = b;
        const idx = F.year.map((y, i) => (y >= a && y <= b ? i : -1)).filter((i) => i >= 0), rr = idx.map((i) => F.r[i]);
        const sd = Math.sqrt(mean(rr.map((x) => x * x)));
        tiles.innerHTML = "";
        tiles.append(tile(h, t({ tr: "Seçilen dönemin yıllık volatilitesi", en: "Annual volatility, chosen period" }), pct(sd * Math.sqrt(252) / 100, 1, lang), "win"), tile(h, t({ tr: "Bütün dönem", en: "Whole period" }), pct(sdAll * Math.sqrt(252) / 100, 1, lang)),
          tile(h, t({ tr: "En büyük günlük hareket", en: "Largest daily move" }), (lang === "tr" ? "%" : "") + fmt(Math.max(...rr.map(Math.abs)), 2, lang) + (lang === "tr" ? "" : "%")), tile(h, t({ tr: "|getiri| > 3σ olan günler", en: "Days with |return| > 3σ" }), pct(rr.filter((x) => Math.abs(x) > 3 * sdAll).length / rr.length, 2, lang)));
        const W = 600, H = 260, Lm = 40, R = W - 10, T = 12, M = 150, B = H - 26, N = F.r.length;
        const ch = frame(W, H), sx = (i) => Lm + i / (N - 1) * (R - Lm), syr = (v) => T + (M - T) / 2 - v / 5 * ((M - T) / 2), syv = (v) => B - v / 20 * (B - M - 10);
        svg("rect", { x: sx(idx[0]), y: T, width: Math.max(2, sx(idx[idx.length - 1]) - sx(idx[0])), height: B - T, class: "pg-region b", opacity: 0.6 }, ch);
        svg("rect", { x: Lm, y: T, width: R - Lm, height: M - T, class: "pg-frame" }, ch);
        svg("rect", { x: Lm, y: M + 10, width: R - Lm, height: B - M - 10, class: "pg-frame" }, ch);
        let pth = ""; for (let i = 0; i < N; i += 2) pth += `M${sx(i).toFixed(1)} ${syr(0).toFixed(1)}L${sx(i).toFixed(1)} ${syr(Math.max(-5, Math.min(5, F.r[i]))).toFixed(1)}`;
        svg("path", { d: pth, class: "pg-line c1", "stroke-width": 0.6 }, ch);
        let vp = ""; for (let i = 59; i < N; i += 3) vp += (vp ? "L" : "M") + sx(i).toFixed(1) + " " + syv(F.v60[i] * Math.sqrt(252)).toFixed(1);
        svg("path", { d: vp, class: "pg-line c4" }, ch);
        [-4, 0, 4].forEach((v) => txt(ch, Lm - 5, syr(v) + 4, String(v), "pg-lbl", "end"));
        [0, 10, 20].forEach((v) => txt(ch, Lm - 5, syv(v) + 4, String(v), "pg-lbl", "end"));
        for (let y = 2000; y <= Y1; y += 5) { const i = F.year.indexOf(y); if (i >= 0) txt(ch, sx(i), H - 8, String(y)); }
        txt(ch, Lm + 6, T + 14, t({ tr: "günlük getiri (%)", en: "daily return (%)" }), "pg-lbl", "start");
        txt(ch, Lm + 6, M + 24, t({ tr: "60 günlük volatilite (yıllık, %)", en: "60-day volatility (annual, %)" }), "pg-lbl", "start");
        box.innerHTML = ""; box.append(ch);
        note.textContent = t({ tr: "Euro/dolar, 1999'dan bu yana günlük (FRED). Üstte günlük getiriler, altta 60 günlük volatilite. Büyük hareketler belli dönemlerde yığılıyor: volatilite kümelenmesi. 2008–2009'u, 2014–2015'i ve 2019'u seçip karşılaştır.", en: "Euro/dollar, daily since 1999 (FRED). Top: daily returns; bottom: 60-day volatility. Big moves pile up in certain periods: volatility clustering. Select 2008–2009, 2014–2015 and 2019 and compare." });
      }
      host.append(ctrls, tiles, box, note);
      draw();
    });
  };

  /* =====================================================================
   * splitViz — rastgele ve zamana saygılı bölmeyi zaman çizgisinde karşılaştırmak
   * ===================================================================== */
  P.splitViz = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    const N = 120;
    let mode = "random", fold = 3;
    const lf = h("b");
    const ctrls = h("div", { class: "pg-ctrls" },
      h("label", null, h("span", null, t({ tr: "Bölme", en: "Split" })), select(h, [["random", t({ tr: "rastgele (KFold, karıştırılmış)", en: "random (KFold, shuffled)" })], ["time", "TimeSeriesSplit"]], mode, (v) => { mode = v; ctx.touch(); draw(); })),
      h("label", null, h("span", null, t({ tr: "Kat = ", en: "Fold = " }), lf), slider(h, 1, 5, 1, fold, (v) => { fold = v; ctx.touch(); draw(); })));
    const tiles = h("div", { class: "tiles" }), box = h("div"), note = h("p", { class: "pg-note" });
    const perm = (() => { const u = rng(9), p = Array.from({ length: N }, (_, i) => i); for (let i = N - 1; i > 0; i--) { const j = Math.floor(u() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; } return p; })();
    function roles() {
      const role = new Array(N).fill("none");
      if (mode === "random") { perm.forEach((d, k) => (role[d] = k % 5 === fold - 1 ? "test" : "train")); }
      else { const sz = Math.floor(N / 6); for (let d = 0; d < N; d++) role[d] = d < sz * fold ? "train" : d < sz * (fold + 1) ? "test" : "none"; }
      return role;
    }
    function draw() {
      lf.textContent = fold;
      const role = roles(), train = role.map((r, i) => (r === "train" ? i : -1)).filter((i) => i >= 0), test = role.map((r, i) => (r === "test" ? i : -1)).filter((i) => i >= 0);
      const dist = mean(test.map((d) => Math.min(...train.map((e) => Math.abs(e - d)))));
      const future = test.filter((d) => train.some((e) => e > d)).length / test.length;
      tiles.innerHTML = "";
      tiles.append(tile(h, t({ tr: "Test gününün en yakın eğitim komşusu", en: "Test day's nearest training neighbour" }), fmt(dist, 1, lang) + t({ tr: " gün", en: " days" }), dist < 2 ? "warn" : "win"),
        tile(h, t({ tr: "Geleceği eğitimde olan test günleri", en: "Test days whose future is in training" }), pct(future, 0, lang), future > 0 ? "warn" : "win"),
        tile(h, t({ tr: "Euro/dolarda orman R² (Ünite 3)", en: "Forest R² on euro/dollar (Unit 3)" }), mode === "random" ? "0,67".replace(",", lang === "tr" ? "," : ".") : "0,06".replace(",", lang === "tr" ? "," : ".")));
      const W = 600, H = 110, Lm = 10, R = W - 10, bw = (R - Lm) / N;
      const ch = frame(W, H);
      role.forEach((r, d) => svg("rect", { x: Lm + d * bw, y: 20, width: bw - 1, height: 40, class: "pg-bar " + (r === "train" ? "c0" : r === "test" ? "c4" : "c6"), opacity: r === "none" ? 0.25 : 1 }, ch));
      txt(ch, Lm, 14, t({ tr: "geçmiş", en: "past" }), "pg-lbl", "start"); txt(ch, R, 14, t({ tr: "gelecek", en: "future" }), "pg-lbl", "end");
      txt(ch, W / 2, 84, t({ tr: "her kutu bir dönem (örneğin bir hafta)", en: "each box is a period (e.g. a week)" }));
      box.innerHTML = ""; box.append(ch, legend(h, [["c0", t({ tr: "eğitim", en: "training" })], ["c4", t({ tr: "test", en: "test" })], ["c6", t({ tr: "kullanılmıyor", en: "unused" })]]));
      note.textContent = t({ tr: "Rastgele bölmede test dönemleri eğitim dönemlerinin arasına serpiştirilir: her test döneminin hem dünü hem yarını eğitimdedir. Volatilite gibi yavaş değişen bir hedefte bu, cevabı komşudan kopyalamak demektir. TimeSeriesSplit'te eğitim hep testten önce gelir.", en: "In a random split the test periods are scattered among the training periods: each test period's yesterday and tomorrow are in training. With a slowly changing target such as volatility, that means copying the answer from the neighbour. In TimeSeriesSplit training always comes before the test." });
    }
    host.append(ctrls, tiles, box, note);
    draw();
  };

  /* =====================================================================
   * walkForward — katlar, boşluk ve pencere türü
   * ===================================================================== */
  P.walkForward = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    const N = 6900;
    let k = 5, gap = 20, kind = "expanding";
    const lk = h("b"), lg = h("b");
    const ctrls = h("div", { class: "pg-ctrls" },
      h("label", null, h("span", null, t({ tr: "Kat sayısı = ", en: "Number of folds = " }), lk), slider(h, 2, 10, 1, k, (v) => { k = v; ctx.touch(); draw(); })),
      h("label", null, h("span", null, t({ tr: "Boşluk (gün) = ", en: "Gap (days) = " }), lg), slider(h, 0, 250, 10, gap, (v) => { gap = v; ctx.touch(); draw(); })),
      h("label", null, h("span", null, t({ tr: "Eğitim penceresi", en: "Training window" })), select(h, [["expanding", t({ tr: "genişleyen", en: "expanding" })], ["fixed", t({ tr: "sabit uzunlukta (5 yıl)", en: "fixed length (5 years)" })]], kind, (v) => { kind = v; ctx.touch(); draw(); })));
    const tiles = h("div", { class: "tiles" }), box = h("div"), note = h("p", { class: "pg-note" });
    function draw() {
      lk.textContent = k; lg.textContent = gap;
      const ts = Math.floor(N / (k + 1)), rows = [];
      for (let f = 0; f < k; f++) { const te0 = ts * (f + 1), te1 = te0 + ts, tr1 = te0 - gap, tr0 = kind === "fixed" ? Math.max(0, tr1 - 1260) : 0; rows.push({ tr0, tr1, te0, te1 }); }
      tiles.innerHTML = "";
      tiles.append(tile(h, t({ tr: "Test dönemi uzunluğu", en: "Test period length" }), ts + t({ tr: " gün", en: " days" })), tile(h, t({ tr: "İlk katın eğitimi", en: "First fold's training" }), Math.max(0, rows[0].tr1 - rows[0].tr0) + t({ tr: " gün", en: " days" })), tile(h, t({ tr: "Son katın eğitimi", en: "Last fold's training" }), rows[k - 1].tr1 - rows[k - 1].tr0 + t({ tr: " gün", en: " days" })));
      const W = 600, rowH = 20, H = 30 + k * rowH + 26, Lm = 60, R = W - 10, sx = (d) => Lm + d / N * (R - Lm);
      const ch = frame(W, H);
      rows.forEach((r, f) => {
        const y = 20 + f * rowH;
        txt(ch, Lm - 6, y + 13, t({ tr: "kat ", en: "fold " }) + (f + 1), "pg-lbl", "end");
        if (r.tr1 > r.tr0) svg("rect", { x: sx(r.tr0), y: y + 2, width: sx(r.tr1) - sx(r.tr0), height: rowH - 5, class: "pg-bar c0", rx: 2 }, ch);
        if (gap > 0) svg("rect", { x: sx(r.tr1), y: y + 2, width: sx(r.te0) - sx(r.tr1), height: rowH - 5, class: "pg-bar c6", opacity: 0.35 }, ch);
        svg("rect", { x: sx(r.te0), y: y + 2, width: sx(r.te1) - sx(r.te0), height: rowH - 5, class: "pg-bar c4", rx: 2 }, ch);
      });
      [1999, 2005, 2010, 2015, 2020, 2026].forEach((yy) => txt(ch, sx((yy - 1999) / 27.8 * N), H - 6, String(yy)));
      box.innerHTML = ""; box.append(ch, legend(h, [["c0", t({ tr: "eğitim", en: "training" })], ["c6", t({ tr: "boşluk", en: "gap" })], ["c4", t({ tr: "test", en: "test" })]]));
      note.textContent = t({ tr: "Her satır bir kat. Test her zaman eğitimden sonra gelir; boşluk, hedef penceresi test dönemine taşan son eğitim günlerini dışarıda bırakır. Sabit uzunlukta pencere eski verileri unutur: yapı değişiyorsa yararlı, ama eğitim verisi azalır.", en: "Each row is a fold. The test always comes after training; the gap leaves out the last training days whose target window spills into the test period. A fixed-length window forgets old data: useful if the structure changes, but the training data shrink." });
    }
    host.append(ctrls, tiles, box, note);
    draw();
  };

  /* =====================================================================
   * volForecast — hangi pencerelerle volatilite öngörüsü
   * ===================================================================== */
  P.volForecast = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    waiting(h, t, host, (F) => {
      const use = { v5: true, v20: true, v60: true };
      const ok = F.r.map((_, i) => isFinite(F.v60[i]) && isFinite(F.yv[i]));
      const trI = [], teI = [];
      F.dates.forEach((d, i) => { if (!ok[i]) return; (d < "2015-01-01" ? trI : teI).push(i); });
      const ctrls = h("div", { class: "pg-ctrls" }, ...["v5", "v20", "v60"].map((k) => check(h, { v5: t({ tr: "son 5 gün", en: "last 5 days" }), v20: t({ tr: "son 20 gün", en: "last 20 days" }), v60: t({ tr: "son 60 gün", en: "last 60 days" }) }[k], use[k], (v) => { use[k] = v; ctx.touch(); draw(); })));
      const tiles = h("div", { class: "tiles" }), box = h("div"), note = h("p", { class: "pg-note" });
      function draw() {
        const ks = ["v5", "v20", "v60"].filter((k) => use[k]);
        const row = (i) => [1].concat(ks.map((k) => F[k][i]));
        const b = ols(trI.map(row), trI.map((i) => F.yv[i]));
        const pred = teI.map((i) => row(i).reduce((s, v, j) => s + v * b[j], 0)), yt = teI.map((i) => F.yv[i]);
        const R2 = r2(yt, pred), naive = r2(yt, teI.map((i) => F.v60[i]));
        tiles.innerHTML = "";
        tiles.append(tile(h, t({ tr: "Test R² (2015–)", en: "Test R² (2015–)" }), fmt(R2, 3, lang), R2 >= naive ? "win" : ""), tile(h, t({ tr: "Saf tahmin: son 60 gün", en: "Naive: last 60 days" }), fmt(naive, 3, lang)),
          tile(h, t({ tr: "Katsayılar", en: "Coefficients" }), ks.length ? ks.map((k, j) => k + " " + fmt(b[j + 1], 2, lang)).join(" · ") : "—"));
        const W = 600, H = 230, Lm = 40, R = W - 10, T = 12, B = H - 26, n = teI.length, hi = 16;
        const ch = frame(W, H), sx = (j) => Lm + j / (n - 1) * (R - Lm), sy = (v) => B - Math.min(v, hi) / hi * (B - T);
        svg("rect", { x: Lm, y: T, width: R - Lm, height: B - T, class: "pg-frame" }, ch);
        [0, 5, 10, 15].forEach((v) => { txt(ch, Lm - 5, sy(v) + 4, String(v), "pg-lbl", "end"); svg("line", { x1: Lm, x2: R, y1: sy(v), y2: sy(v), class: "pg-axis" }, ch); });
        const path = (arr) => arr.map((v, j) => (j % 3 ? "" : (j ? "L" : "M") + sx(j).toFixed(1) + " " + sy(v * Math.sqrt(252)).toFixed(1))).join("");
        svg("path", { d: path(yt), class: "pg-line c6" }, ch);
        svg("path", { d: path(pred), class: "pg-line c0" }, ch);
        for (let y = 2015; y <= 2026; y += 2) { const j = teI.findIndex((i) => F.year[i] === y); if (j >= 0) txt(ch, sx(j), H - 8, String(y)); }
        box.innerHTML = ""; box.append(ch, legend(h, [["c6", t({ tr: "gerçekleşen (gelecek 20 gün)", en: "realised (next 20 days)" })], ["c0", t({ tr: "tahmin", en: "forecast" })]]));
        note.textContent = t({ tr: "Model 1999–2014 verisiyle kurulur, 2015 sonrasında sınanır (yıllık %). Pencereleri tek tek kapat: tek bir pencere de iş görür, ama üçü birlikte en iyisidir. Hiçbirini seçmezsen model herkese eğitim ortalamasını verir: test dönemi daha sakin olduğu için R² çok negatif çıkar.", en: "The model is fitted on 1999–2014 data and tested from 2015 on (annual %). Turn the windows off one by one: a single window also works, but all three together are best. If you select none, the model gives everyone the training mean: because the test period is calmer, R² comes out very negative." });
      }
      host.append(ctrls, tiles, box, note);
      draw();
    });
  };

  /* =====================================================================
   * snooping — yazı tura kuralları: en iyinin eğitim ve test Sharpe'ı
   * ===================================================================== */
  P.snooping = function (host, cfg, ctx) {
    const { h, t, lang } = ctx;
    waiting(h, t, host, (F) => {
      const idx = F.r.map((_, i) => i).filter((i) => isFinite(F.yr[i]) && i >= 60), split = idx.findIndex((i) => F.dates[i] >= "2015-01-01");
      const KS = [1, 2, 5, 10, 20, 50, 100, 200, 500];
      let K = 20;
      const res = [];
      function sharpe(arr) { const m = mean(arr), s = Math.sqrt(mean(arr.map((x) => (x - m) ** 2))); return m / s * Math.sqrt(252); }
      function ensure(n) { while (res.length < n) { const u = rng(1000 + res.length), g = idx.map((i) => (u() < 0.5 ? 1 : -1) * F.yr[i]); res.push([sharpe(g.slice(0, split)), sharpe(g.slice(split))]); } }
      const lk = h("b");
      const ctrls = h("div", { class: "pg-ctrls" }, h("label", null, h("span", null, t({ tr: "Denenen kural sayısı = ", en: "Rules tried = " }), lk), slider(h, 0, KS.length - 1, 1, KS.indexOf(K), (v) => { K = KS[v]; ctx.touch(); draw(); })));
      const tiles = h("div", { class: "tiles" }), box = h("div"), note = h("p", { class: "pg-note" });
      function draw() {
        lk.textContent = K; ensure(K);
        const S = res.slice(0, K); let bi = 0; S.forEach((s, i) => { if (s[0] > S[bi][0]) bi = i; });
        tiles.innerHTML = "";
        tiles.append(tile(h, t({ tr: "En iyinin eğitim Sharpe'ı (1999–2014)", en: "Best rule's training Sharpe (1999–2014)" }), fmt(S[bi][0], 2, lang), S[bi][0] > 0.5 ? "warn" : ""), tile(h, t({ tr: "Aynı kuralın test Sharpe'ı (2015–)", en: "Same rule's test Sharpe (2015–)" }), fmt(S[bi][1], 2, lang)),
          tile(h, t({ tr: "Eğitim–test korelasyonu", en: "Training–test correlation" }), K > 2 ? fmt(corr(S.map((s) => s[0]), S.map((s) => s[1])), 2, lang) : "—"));
        const W = 420, H = 300, Lm = 46, R = W - 12, T = 12, B = H - 40, lo = -1.2, hi = 1.2;
        const ch = svg("svg", { viewBox: `0 0 ${W} ${H}`, class: "pg-svg", role: "img", style: "max-width:440px" }), sx = (v) => Lm + (v - lo) / (hi - lo) * (R - Lm), sy = (v) => B - (v - lo) / (hi - lo) * (B - T);
        svg("rect", { x: Lm, y: T, width: R - Lm, height: B - T, class: "pg-frame" }, ch);
        [-1, 0, 1].forEach((v) => { txt(ch, Lm - 5, sy(v) + 4, fmt(v, 0, lang), "pg-lbl", "end"); txt(ch, sx(v), B + 16, fmt(v, 0, lang)); svg("line", { x1: sx(v), x2: sx(v), y1: T, y2: B, class: "pg-axis" }, ch); svg("line", { x1: Lm, x2: R, y1: sy(v), y2: sy(v), class: "pg-axis" }, ch); });
        S.forEach((s, i) => svg("circle", { cx: sx(Math.max(lo, Math.min(hi, s[0]))), cy: sy(Math.max(lo, Math.min(hi, s[1]))), r: i === bi ? 6 : 2.5, class: "pg-dot" + (i === bi ? " hot" : "") }, ch));
        txt(ch, (Lm + R) / 2, H - 12, t({ tr: "eğitim Sharpe'ı", en: "training Sharpe" }));
        const yl = txt(ch, 12, (T + B) / 2, t({ tr: "test Sharpe'ı", en: "test Sharpe" })); yl.setAttribute("transform", `rotate(-90 12 ${(T + B) / 2})`);
        box.innerHTML = ""; box.append(ch);
        note.textContent = t({ tr: "Her nokta, her gün yazı turayla euro alıp satan bir kural (euro/dolar, gerçek getiriler). Pembe nokta eğitimde en iyisi. Kural sayısını artır: en iyinin eğitim Sharpe'ı yükselir, test Sharpe'ı sıfır civarında kalır. Noktalar yatay bir bulut oluşturur: eğitim başarısı test başarısını öngörmüyor.", en: "Each dot is a rule that buys or sells euros by tossing a coin each day (euro/dollar, real returns). The pink dot is the best in training. Increase the number of rules: the best rule's training Sharpe rises while its test Sharpe stays around zero. The dots form a horizontal cloud: training success does not predict test success." });
      }
      host.append(ctrls, tiles, box, note);
      draw();
    });
  };
})();
