/* ML Laboratuvarı — ek oyun alanları (liste üreteci/while, kelime sayacı, rastgele yürüyüş, groupby)
 * © 2026 Mehmet Songur — PolyForm Strict 1.0.0 (LICENSE-CODE.md)
 */
(function () {
  "use strict";
  const LAB = window.LAB;
  const P = LAB.playgrounds;

  let uid = 1000;
  const nid = (p) => "pgx-" + p + "-" + (++uid);
  function range(id, min, max, step, val, onInput) {
    const inp = LAB.h("input", { type: "range", id, min, max, step, value: val });
    inp.addEventListener("input", onInput);
    return inp;
  }
  function pyNum(x, d) {
    const r = Math.round(x * Math.pow(10, d == null ? 4 : d)) / Math.pow(10, d == null ? 4 : d);
    const s = String(r);
    return /^-?\d+$/.test(s) ? s + ".0" : s;
  }
  function codeBlock(ctx, code) { const pre = ctx.h("pre", { class: "pg-code" }); pre.innerHTML = ctx.hl(code); return pre; }
  function svgEl(tag, attrs) { const el = document.createElementNS("http://www.w3.org/2000/svg", tag); for (const k in attrs) el.setAttribute(k, attrs[k]); return el; }
  function tile(h, k, v) { return h("div", { class: "tile" }, h("small", null, k), h("b", null, String(v))); }

  /* =====================================================================
   * compBuilder — liste üreteci ile döngü eşdeğerliği + while sayacı
   * ===================================================================== */
  P.compBuilder = function (host, cfg, ctx) {
    const { h, t } = ctx;
    const vals = cfg.values, name = t(cfg.name);
    let tab = 0, tr = 0, fl = 1, thr = 3.0, g = 5;
    const transforms = [
      { code: "d", f: (x) => x, d: 2, label: { tr: "olduğu gibi", en: "as is" } },
      { code: "d / 100", f: (x) => x / 100, d: 4, label: { tr: "orana çevir", en: "to a ratio" } },
      { code: "round(((1 + d / 100) ** 12 - 1) * 100, 1)", f: (x) => Math.round(((Math.pow(1 + x / 100, 12) - 1) * 100) * 10) / 10, d: 1, label: { tr: "yıllık eşdeğer (bu aylık oran 12 ay sürerse)", en: "annual equivalent (if this monthly rate lasts 12 months)" } }
    ];
    const filters = [{ code: "", label: { tr: "filtre yok", en: "no filter" } }, { code: ">", label: { tr: "eşikten büyük", en: "above threshold" } }, { code: "<", label: { tr: "eşikten küçük", en: "below threshold" } }];
    const tabs = h("div", { class: "tabs" });
    const body = h("div", { class: "pg" });
    function build() {
      tabs.innerHTML = "";
      [{ tr: "Liste üreteci", en: "Comprehension" }, { tr: "while döngüsü", en: "while loop" }].forEach((lab, i) =>
        tabs.append(h("button", { class: i === tab ? "on" : "", onclick: () => { tab = i; ctx.touch(); build(); } }, t(lab))));
      body.innerHTML = "";
      if (tab === 0) buildComp(); else buildWhile();
    }
    function buildComp() {
      const thrLab = h("b");
      const thrId = nid("thr");
      const ctr = h("div", { class: "pg-ctrls" },
        h("label", null, h("span", null, t({ tr: "Her elemana", en: "For each element" })),
          h("select", { onchange: (e) => { tr = +e.target.value; ctx.touch(); upd(); } }, transforms.map((x, i) => h("option", { value: i, selected: i === tr }, t(x.label))))),
        h("label", null, h("span", null, t({ tr: "Koşul", en: "Condition" })),
          h("select", { onchange: (e) => { fl = +e.target.value; ctx.touch(); upd(); } }, filters.map((x, i) => h("option", { value: i, selected: i === fl }, t(x.label))))),
        h("label", { for: thrId }, h("span", null, t({ tr: "Eşik", en: "Threshold" }) + " = ", thrLab), range(thrId, 0, 5, 0.1, thr, (e) => { thr = +e.target.value; ctx.touch(); upd(); }))
      );
      const loopEl = h("div"), compEl = h("div"), outEl = h("pre", { class: "pg-console" });
      function upd() {
        thrLab.textContent = thr.toFixed(1);
        const T = transforms[tr], F = filters[fl];
        const cond = F.code ? " if d " + F.code + " " + thr.toFixed(1) : "";
        const res = t({ tr: "sonuc", en: "result" });
        const loop = res + " = []\nfor d in " + name + ":\n" + (F.code ? "    if d " + F.code + " " + thr.toFixed(1) + ":\n        " : "    ") + res + ".append(" + T.code + ")";
        const comp = res + " = [" + T.code + " for d in " + name + cond + "]";
        loopEl.innerHTML = ""; loopEl.append(codeBlock(ctx, loop));
        compEl.innerHTML = ""; compEl.append(codeBlock(ctx, comp));
        const picked = vals.filter((x) => (F.code === ">" ? x > thr : F.code === "<" ? x < thr : true)).map(T.f);
        outEl.textContent = "[" + picked.map((x) => pyNum(x, T.d)).join(", ") + "]\nlen(" + res + ") = " + picked.length;
      }
      body.append(h("div", { class: "pg-panel" }, ctr),
        h("div", { class: "pg-grid" },
          h("div", { class: "pg-panel" }, h("h4", null, t({ tr: "Uzun yol: for döngüsü", en: "Long way: for loop" })), loopEl),
          h("div", { class: "pg-panel" }, h("h4", null, t({ tr: "Kısa yol: tek satır", en: "Short way: one line" })), compEl)),
        h("div", { class: "pg-panel" }, h("h4", null, t({ tr: "İkisinin de sonucu aynı", en: "Both give the same result" })), outEl));
      upd();
    }
    function buildWhile() {
      const gLab = h("b"), gId = nid("g");
      const codeEl = h("div"), tbl = h("div", { class: "dfwrap" }), tiles = h("div", { class: "tiles" });
      function upd() {
        gLab.textContent = "%" + g;
        const gy = t({ tr: "gsyh", en: "gdp" }), yl = t({ tr: "yil", en: "years" });
        codeEl.innerHTML = "";
        codeEl.append(codeBlock(ctx, gy + " = 100\n" + yl + " = 0\nwhile " + gy + " < 200:\n    " + gy + " = " + gy + " * " + (1 + g / 100).toFixed(2) + "\n    " + yl + " = " + yl + " + 1\nprint(" + yl + ")"));
        let v = 100, n = 0;
        const rows = [];
        while (v < 200) { v = v * (1 + g / 100); n++; rows.push([n, v]); }
        let html = '<table class="df"><thead><tr><th>' + yl + "</th><th>" + gy + "</th><th>" + gy + ' &lt; 200 ?</th></tr></thead><tbody><tr><td>0</td><td>100.0</td><td>True</td></tr>';
        rows.forEach(([a, b]) => { html += "<tr><td>" + a + "</td><td>" + b.toFixed(1) + "</td><td>" + (b < 200 ? "True" : "<b>False → " + t({ tr: "dur", en: "stop" }) + "</b>") + "</td></tr>"; });
        tbl.innerHTML = html + "</tbody></table>";
        tiles.innerHTML = "";
        tiles.append(tile(h, t({ tr: "döngünün sonucu", en: "loop result" }), n + " " + t({ tr: "yıl", en: "years" })),
          tile(h, t({ tr: "70 kuralı: 70 / büyüme", en: "rule of 70: 70 / growth" }), (70 / g).toFixed(1)));
      }
      body.append(h("div", { class: "pg-panel" }, h("div", { class: "pg-ctrls" },
        h("label", { for: gId }, h("span", null, t({ tr: "Yıllık büyüme", en: "Annual growth" }) + " = ", gLab), range(gId, 1, 15, 1, g, (e) => { g = +e.target.value; ctx.touch(); upd(); })))),
        h("div", { class: "pg-grid" },
          h("div", { class: "pg-panel" }, h("h4", null, t({ tr: "GSYH kaç yılda ikiye katlanır?", en: "How many years for GDP to double?" })), codeEl, tiles),
          h("div", { class: "pg-panel" }, h("h4", null, t({ tr: "Her turda koşul yeniden sınanır", en: "The condition is checked every turn" })), tbl)));
      upd();
    }
    host.append(tabs, body);
    build();
  };

  /* =====================================================================
   * wordCounter — metni temizle, kelimeleri sözlükle say
   * ===================================================================== */
  P.wordCounter = function (host, cfg, ctx) {
    const { h, t } = ctx;
    const stop = t(cfg.stop);
    let lower = true, punct = true, rmStop = false;
    const ta = h("textarea", { class: "wc-text", "aria-label": "text", oninput: () => { ctx.touch(); upd(); } });
    ta.value = t(cfg.text);
    const ids = [nid("l"), nid("p"), nid("s")];
    const ctr = h("div", { class: "pg-ctrls" },
      h("label", { class: "chk", for: ids[0] }, h("input", { type: "checkbox", id: ids[0], checked: lower, onchange: (e) => { lower = e.target.checked; ctx.touch(); upd(); } }), t({ tr: "küçük harfe çevir", en: "lowercase" })),
      h("label", { class: "chk", for: ids[1] }, h("input", { type: "checkbox", id: ids[1], checked: punct, onchange: (e) => { punct = e.target.checked; ctx.touch(); upd(); } }), t({ tr: "noktalamayı sil", en: "remove punctuation" })),
      h("label", { class: "chk", for: ids[2] }, h("input", { type: "checkbox", id: ids[2], checked: rmStop, onchange: (e) => { rmStop = e.target.checked; ctx.touch(); upd(); } }), t({ tr: "dolgu kelimeleri çıkar (ve, ile, bu…)", en: "drop filler words (and, the, of…)" }))
    );
    const bars = h("div", { class: "hbars" }), codeEl = h("div"), tiles = h("div", { class: "tiles" });
    function upd() {
      let txt = ta.value;
      const trk = ctx.lang === "tr";
      if (lower) txt = trk ? txt.replace(/I/g, "ı").replace(/İ/g, "i").toLowerCase() : txt.toLowerCase();   // Türkçe I→ı, İ→i
      if (punct) txt = txt.replace(/[.,;:!?()"“”]/g, " ");   // boşlukla değiştir: "para,politika" iki kelime kalır
      let words = txt.split(/\s+/).filter(Boolean);
      if (rmStop) words = words.filter((w) => !stop.includes(w));
      const cnt = {};
      words.forEach((w) => { cnt[w] = (cnt[w] || 0) + 1; });
      const top = Object.entries(cnt).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 10);
      const max = top.length ? top[0][1] : 1;
      bars.innerHTML = "";
      top.forEach(([w, c]) => bars.append(h("div", { class: "hbar" }, h("code", null, '"' + w + '"'), h("span", { class: "tr" }, h("span", { style: "width:" + (100 * c / max) + "%" })), h("b", null, String(c)))));
      const m = t({ tr: "metin", en: "text" }), k = t({ tr: "kelimeler", en: "words" }), s = t({ tr: "sayim", en: "counts" }), d = t({ tr: "dolgu", en: "filler" });
      const L = [m + " = metin_degiskeni".replace("metin_degiskeni", t({ tr: '"..."   # yukarıdaki metin', en: '"..."   # the text above' }))];
      if (lower) L.push(ctx.lang === "tr" ? m + ' = ' + m + '.replace("I", "ı").replace("İ", "i").lower()   # Türkçe I/İ' : m + " = " + m + ".lower()");
      if (punct) L.push("for " + t({ tr: "isaret", en: "mark" }) + ' in ".,;:!?":\n    ' + m + " = " + m + ".replace(" + t({ tr: "isaret", en: "mark" }) + ', " ")   # ' + t({ tr: "boşlukla: kelimeler birleşmesin", en: "with a space so words do not merge" }));
      L.push(k + " = " + m + ".split()");
      if (rmStop) L.push(k + " = [w for w in " + k + " if w not in " + d + "]");
      L.push(s + " = {}\nfor w in " + k + ":\n    " + s + "[w] = " + s + ".get(w, 0) + 1");
      codeEl.innerHTML = ""; codeEl.append(codeBlock(ctx, L.join("\n")));
      tiles.innerHTML = "";
      tiles.append(tile(h, "len(" + k + ")", words.length), tile(h, "len(" + s + ")", Object.keys(cnt).length));
    }
    host.append(h("div", { class: "pg-panel" }, h("h4", null, t({ tr: "Metin (değiştirebilirsin)", en: "Text (you can edit it)" })), ta, ctr),
      h("div", { class: "pg-grid" },
        h("div", { class: "pg-panel" }, h("h4", null, t({ tr: "En sık 10 kelime", en: "Top 10 words" })), bars, tiles),
        h("div", { class: "pg-panel" }, h("h4", null, "Python"), codeEl)));
    upd();
  };

  /* =====================================================================
   * randomWalk — simüle kur yolları ve son değerin dağılımı
   * ===================================================================== */
  P.randomWalk = function (host, cfg, ctx) {
    const { h, t } = ctx;
    let mu = 0.05, sigma = 1.0, n = 60, seed = 7;
    const days = 250, start = 30;
    function rng(sd) {
      let a = sd >>> 0;
      const u = () => { a = (a + 0x6D2B79F5) >>> 0; let x = a; x = Math.imul(x ^ (x >>> 15), x | 1); x ^= x + Math.imul(x ^ (x >>> 7), x | 61); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
      return () => { let p = 0, q = 0; while (p === 0) p = u(); while (q === 0) q = u(); return Math.sqrt(-2 * Math.log(p)) * Math.cos(2 * Math.PI * q); };
    }
    const ids = [nid("mu"), nid("sg"), nid("n")];
    const labs = [h("b"), h("b"), h("b")];
    const ctr = h("div", { class: "pg-ctrls" },
      h("label", { for: ids[0] }, h("span", null, t({ tr: "Ortalama günlük getiri μ", en: "Mean daily return μ" }) + " = ", labs[0]), range(ids[0], -0.3, 0.3, 0.01, mu, (e) => { mu = +e.target.value; ctx.touch(); upd(); })),
      h("label", { for: ids[1] }, h("span", null, t({ tr: "Oynaklık σ", en: "Volatility σ" }) + " = ", labs[1]), range(ids[1], 0.2, 3, 0.1, sigma, (e) => { sigma = +e.target.value; ctx.touch(); upd(); })),
      h("label", { for: ids[2] }, h("span", null, t({ tr: "Yol sayısı", en: "Number of paths" }) + " = ", labs[2]), range(ids[2], 1, 300, 1, n, (e) => { n = +e.target.value; ctx.touch(); upd(); })),
      h("button", { class: "btn ghost", onclick: () => { seed++; ctx.touch(); upd(); } }, "🎲 " + t({ tr: "Yeni tohum", en: "New seed" }))
    );
    const pathsWrap = h("div", { class: "svgwrap" }), histWrap = h("div", { class: "svgwrap" }), tiles = h("div", { class: "tiles" }), codeEl = h("div");
    function upd() {
      labs[0].textContent = "%" + mu.toFixed(2); labs[1].textContent = "%" + sigma.toFixed(1); labs[2].textContent = n;
      const z = rng(seed * 9973 + 1);
      const paths = [];
      for (let i = 0; i < n; i++) { let v = start; const p = [v]; for (let d = 0; d < days; d++) { v = v * (1 + (mu + sigma * z()) / 100); p.push(v); } paths.push(p); }
      const finals = paths.map((p) => p[days]).sort((a, b) => a - b);
      const all = paths.flat();
      const lo = Math.min(...all), hi = Math.max(...all);
      const W = 420, H = 230, pad = { l: 36, r: 8, t: 10, b: 22 };
      const sx = (d) => pad.l + (W - pad.l - pad.r) * d / days;
      const sy = (v) => pad.t + (H - pad.t - pad.b) * (1 - (v - lo) / ((hi - lo) || 1));
      const svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "paths" });
      [lo, start, hi].forEach((v) => { svg.append(svgEl("line", { x1: pad.l, x2: W - pad.r, y1: sy(v), y2: sy(v), style: "stroke:var(--line)" + (v === start ? ";stroke-dasharray:4 3" : "") })); const tx = svgEl("text", { x: pad.l - 4, y: sy(v) + 4, "text-anchor": "end", "font-size": 10 }); tx.textContent = v.toFixed(1); svg.append(tx); });
      paths.slice(0, 60).forEach((p) => svg.append(svgEl("polyline", { points: p.filter((_, i) => i % 2 === 0 || i === days).map((v, i, arr) => sx(i === arr.length - 1 ? days : i * 2) + "," + sy(v)).join(" "), style: "fill:none;stroke:var(--accent);stroke-width:" + (n === 1 ? 2 : 1) + ";opacity:" + (n === 1 ? 1 : Math.max(0.15, 0.9 - n / 80)) })));
      const xl = svgEl("text", { x: W - pad.r, y: H - 6, "text-anchor": "end", "font-size": 10 }); xl.textContent = t({ tr: "gün", en: "day" }) + " " + days; svg.append(xl);
      pathsWrap.innerHTML = ""; pathsWrap.append(svg);
      // histogram
      const bins = 20, fmin = finals[0], fmax = finals[finals.length - 1], bw = (fmax - fmin) / bins || 1;
      const counts = new Array(bins).fill(0);
      finals.forEach((v) => { counts[Math.min(bins - 1, Math.floor((v - fmin) / bw))]++; });
      const cmax = Math.max(...counts);
      const hs = svgEl("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "histogram" });
      const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
      counts.forEach((c, i) => hs.append(svgEl("rect", { x: pad.l + i * iw / bins + 1, y: pad.t + ih * (1 - c / cmax), width: iw / bins - 2, height: ih * c / cmax, rx: 2, style: "fill:var(--hi)" })));
      [fmin, fmax].forEach((v, i) => { const tx = svgEl("text", { x: i ? W - pad.r : pad.l, y: H - 6, "text-anchor": i ? "end" : "start", "font-size": 10 }); tx.textContent = v.toFixed(1); hs.append(tx); });
      histWrap.innerHTML = ""; histWrap.append(hs);
      const q = (p) => finals[Math.min(finals.length - 1, Math.max(0, Math.round(p * (finals.length - 1))))];
      const mean = finals.reduce((a, b) => a + b, 0) / finals.length;
      tiles.innerHTML = "";
      tiles.append(tile(h, t({ tr: "son değer ortalaması", en: "mean final value" }), mean.toFixed(2)),
        tile(h, t({ tr: "%5 dilim", en: "5th percentile" }), q(0.05).toFixed(2)),
        tile(h, t({ tr: "%95 dilim", en: "95th percentile" }), q(0.95).toFixed(2)),
        tile(h, t({ tr: "27'nin altı (≥%10 kayıp)", en: "below 27 (≥10% loss)" }), "%" + Math.round(100 * finals.filter((v) => v < 27).length / finals.length)));
      if (finals.length < 20) tiles.append(h("p", { class: "muted small", style: "flex-basis:100%" }, finals.length === 1
        ? t({ tr: "Tek yolda tek bir son değer vardır; %5 ve %95 dilimleri aynı sayıyı gösterir ve bir dağılım hakkında bilgi taşımaz. Yol sayısını artır.", en: "With one path there is a single final value; the 5th and 95th percentiles show the same number and say nothing about a distribution. Increase the number of paths." })
        : t({ tr: "Az sayıda yolla yüzdelik dilimler kaba tahminlerdir; yol sayısını artırdıkça kararlı hâle gelirler.", en: "With few paths the percentiles are rough estimates; they settle down as you add paths." })));
      const yl = t({ tr: "yollar", en: "paths" });
      codeEl.innerHTML = "";
      codeEl.append(codeBlock(ctx, "rng = np.random.default_rng(" + seed + ")\n" + t({ tr: "getiri", en: "ret" }) + " = rng.normal(" + mu.toFixed(2) + ", " + sigma.toFixed(1) + ", size=(" + n + ", " + days + ")) / 100\n" + yl + " = " + start + " * np.cumprod(1 + " + t({ tr: "getiri", en: "ret" }) + ", axis=1)\n" + t({ tr: "son", en: "final" }) + " = " + yl + "[:, -1]\nnp.percentile(" + t({ tr: "son", en: "final" }) + ", [5, 95])"));
    }
    host.append(h("div", { class: "pg-panel" }, ctr),
      h("div", { class: "pg-grid" },
        h("div", { class: "pg-panel" }, h("h4", null, t({ tr: "Olası kur yolları (ilk 60)", en: "Possible exchange-rate paths (first 60)" })), pathsWrap),
        h("div", { class: "pg-panel" }, h("h4", null, t({ tr: "250. gündeki değerin dağılımı", en: "Distribution of the day-250 value" })), histWrap)),
      h("div", { class: "pg-panel" }, tiles),
      h("div", { class: "pg-panel" }, h("h4", null, t({ tr: "NumPy karşılığı (sayılar tarayıcının kendi üretecinden gelir, NumPy ile birebir aynı olmaz)", en: "NumPy equivalent (numbers come from the browser's own generator, so they will not match NumPy exactly)" })), codeEl));
    upd();
  };

  /* =====================================================================
   * groupBy — panelde gruplama ve özetleme
   * ===================================================================== */
  P.groupBy = function (host, cfg, ctx) {
    const { h, t } = ctx;
    const D = cfg.data, df = t(D.name), cols = D.cols.map((c) => t(c)), lab = D.rows;
    const groupable = cfg.groupCols, valueCols = cfg.valueCols;
    let gi = groupable[0], vi = valueCols[0], agg = "mean";
    const aggs = ["mean", "sum", "max", "min", "count"];
    const ctr = h("div", { class: "pg-ctrls" });
    const codeEl = h("div"), tbl = h("div", { class: "dfwrap" }), bars = h("div", { class: "hbars" });
    function buildCtr() {
      ctr.innerHTML = "";
      ctr.append(
        h("label", null, h("span", null, "groupby"), h("select", { onchange: (e) => { gi = +e.target.value; ctx.touch(); upd(); } }, groupable.map((i) => h("option", { value: i, selected: i === gi }, cols[i])))),
        h("label", null, h("span", null, t({ tr: "sütun", en: "column" })), h("select", { onchange: (e) => { vi = +e.target.value; ctx.touch(); upd(); } }, valueCols.map((i) => h("option", { value: i, selected: i === vi }, cols[i])))),
        h("label", null, h("span", null, t({ tr: "özet", en: "summary" })), h("select", { onchange: (e) => { agg = e.target.value; ctx.touch(); upd(); } }, aggs.map((a) => h("option", { value: a, selected: a === agg }, a + "()"))))
      );
    }
    function upd() {
      const groups = {};
      lab.forEach((r) => { const k = t(r[gi]); (groups[k] = groups[k] || []).push(r[vi]); });
      const out = Object.keys(groups).sort().map((k) => {
        const v = groups[k].filter((x) => x != null);
        let r;
        if (agg === "mean") r = v.reduce((a, b) => a + b, 0) / v.length;
        else if (agg === "sum") r = v.reduce((a, b) => a + b, 0);
        else if (agg === "max") r = Math.max(...v);
        else if (agg === "min") r = Math.min(...v);
        else r = v.length;
        return [k, r];
      });
      codeEl.innerHTML = "";
      codeEl.append(codeBlock(ctx, df + '.groupby("' + cols[gi] + '")["' + cols[vi] + '"].' + agg + "()"));
      let html = '<table class="df"><thead><tr><th>' + LAB.esc(cols[gi]) + "</th><th>" + LAB.esc(cols[vi]) + "</th></tr></thead><tbody>";
      out.forEach(([k, r]) => { html += "<tr><th>" + LAB.esc(k) + "</th><td>" + (agg === "count" ? r : r.toFixed(2)) + "</td></tr>"; });
      tbl.innerHTML = html + "</tbody></table>";
      const max = Math.max(...out.map((x) => Math.abs(x[1]))) || 1;
      bars.innerHTML = "";
      out.forEach(([k, r]) => bars.append(h("div", { class: "hbar" }, h("code", null, k), h("span", { class: "tr" }, h("span", { style: "width:" + (100 * Math.abs(r) / max) + "%" })), h("b", null, agg === "count" ? String(r) : r.toFixed(1)))));
    }
    buildCtr();
    const raw = h("details", null, h("summary", null, t({ tr: "Ham paneli göster (" + lab.length + " satır)", en: "Show the raw panel (" + lab.length + " rows)" })),
      h("div", { class: "dfwrap", html: '<table class="df"><thead><tr>' + cols.map((c) => "<th>" + LAB.esc(c) + "</th>").join("") + "</tr></thead><tbody>" +
        lab.map((r) => "<tr>" + r.map((x) => "<td>" + (x == null ? "NaN" : LAB.esc(t(x))) + "</td>").join("") + "</tr>").join("") + "</tbody></table>" }));
    host.append(h("div", { class: "pg-panel" }, ctr, raw),
      h("div", { class: "pg-grid" },
        h("div", { class: "pg-panel" }, h("h4", null, "pandas"), codeEl, tbl),
        h("div", { class: "pg-panel" }, h("h4", null, t({ tr: "Grup başına sonuç", en: "Result per group" })), bars)));
    upd();
  };
  /* =====================================================================
   * promptBuilder — isteği parça parça kur, hangi riskin kaldığını gör
   * ===================================================================== */
  P.promptBuilder = function (host, cfg, ctx) {
    const { h, t } = ctx;
    const parts = cfg.parts;
    const on = parts.map((p) => !!p.on);
    const ctr = h("div", { class: "pb-parts" });
    const out = h("div", { class: "bubble pb-out" });
    const risks = h("ul", { class: "pb-risks" });
    const meter = h("div", { class: "pb-meter" }, h("span"));
    const meterLab = h("span", { class: "pb-meter-lab" });
    parts.forEach((p, i) => {
      const id = nid("pb");
      ctr.append(h("label", { class: "pb-part", for: id },
        h("input", { type: "checkbox", id, checked: on[i], onchange: (e) => { on[i] = e.target.checked; ctx.touch(); upd(); } }),
        h("span", null, h("strong", null, t(p.label)), h("small", null, t(p.text)))));
    });
    function upd() {
      const txt = parts.filter((p, i) => on[i]).map((p) => t(p.text)).join(" ");
      out.textContent = txt || t({ tr: "(boş istek)", en: "(empty prompt)" });
      const left = cfg.risks.filter((r) => !r.fixedBy.some((k) => on[k]));
      risks.innerHTML = "";
      cfg.risks.forEach((r) => {
        const open = left.includes(r);
        risks.append(h("li", { class: open ? "open" : "closed" }, h("span", { class: "pb-ic" }, open ? "!" : "✓"), t(r.label)));
      });
      const pct = Math.round(100 * (cfg.risks.length - left.length) / cfg.risks.length);
      meter.firstChild.style.width = pct + "%";
      meter.classList.toggle("ok", pct === 100);
      meterLab.textContent = t({ tr: "İstekte ele alınan risk: ", en: "Risks addressed in the prompt: " }) + (cfg.risks.length - left.length) + " / " + cfg.risks.length;
    }
    host.append(h("div", { class: "pg-grid" },
      h("div", { class: "pg-panel" }, h("h4", null, t({ tr: "İsteğin parçaları", en: "Parts of the prompt" })), ctr),
      h("div", { class: "pg-panel" }, h("h4", null, t({ tr: "Oluşan istek", en: "Resulting prompt" })), out,
        h("h4", null, t({ tr: "YZ'nin hata yapabileceği yerler", en: "Where the AI could still go wrong" })), meter, meterLab, risks)));
    upd();
  };
})();
