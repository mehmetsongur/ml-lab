/* ML Laboratuvarı — oyun alanları (kod yazmadan deneme bileşenleri)
 * © 2026 Mehmet Songur — PolyForm Strict 1.0.0 (LICENSE-CODE.md)
 */
(function () {
  "use strict";
  const LAB = window.LAB;
  const P = LAB.playgrounds;

  /* ---------- ortak yardımcılar ---------- */
  function fmt(x, d) {
    if (typeof x !== "number") return String(x);
    if (d == null) d = 2;
    const r = Math.round(x * Math.pow(10, d)) / Math.pow(10, d);
    return String(r);
  }
  function pyNum(x, d) {
    // Python'un float gösterimine yakın: tam sayı ise ".0" ekle
    const s = fmt(x, d == null ? 4 : d);
    return /^-?\d+$/.test(s) ? s + ".0" : s;
  }
  function pyList(arr, d) { return "[" + arr.map((v) => pyNum(v, d)).join(", ") + "]"; }
  function range(id, min, max, step, val, onInput) {
    const inp = LAB.h("input", { type: "range", id, min, max, step, value: val });
    inp.addEventListener("input", onInput);
    return inp;
  }
  let uid = 0;
  function nid(p) { uid += 1; return "pg-" + p + "-" + uid; }
  function codeBlock(ctx, code) {
    const pre = ctx.h("pre", { class: "pg-code" });
    pre.innerHTML = ctx.hl(code);
    return pre;
  }
  function niceTicks(min, max, n) {
    const span = max - min || 1;
    const raw = span / (n || 5);
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const norm = raw / mag;
    const step = (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag;
    const lo = Math.floor(min / step) * step;
    const hi = Math.ceil(max / step) * step;
    const out = [];
    for (let v = lo; v <= hi + step / 2; v += step) out.push(Math.round(v * 1e6) / 1e6);
    return out;
  }
  function svgEl(tag, attrs) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }

  /* =====================================================================
   * 1) tracer — kodu satır satır izle (değişken kutuları + çıktı)
   * ===================================================================== */
  P.tracer = function (host, cfg, ctx) {
    const { h, t } = ctx;
    const lines = t(cfg.code);
    const names = t(cfg.names) || [];
    const steps = cfg.steps;
    let k = -1;
    const codeEl = h("pre", { class: "pg-code" });
    const varsEl = h("div", { class: "vars" });
    const outEl = h("pre", { class: "pg-console" });
    const noteEl = h("p", { class: "pg-note" });
    const counter = h("span", { class: "muted small" });
    const back = h("button", { class: "btn ghost", onclick: () => go(k - 1) }, "◀ " + t({ tr: "Geri", en: "Back" }));
    const fwd = h("button", { class: "btn primary", onclick: () => go(k + 1) }, t({ tr: "Sonraki satır", en: "Next line" }) + " ▶");
    const restart = h("button", { class: "btn ghost subtle", onclick: () => go(-1) }, "↺ " + t({ tr: "Baştan", en: "Restart" }));

    function go(n) {
      k = Math.max(-1, Math.min(steps.length - 1, n));
      if (k >= 0) ctx.touch();
      render();
    }
    function render() {
      const cur = k >= 0 ? steps[k].line : -1;
      codeEl.innerHTML = lines.map((ln, i) =>
        '<span class="ln-row' + (i === cur ? " cur" : "") + '"><span class="gut">' + (i + 1) + "</span>" + (ctx.hl(ln) || " ") + "</span>").join("");
      varsEl.innerHTML = "";
      const vals = k >= 0 ? (steps[k].vals || []) : [];
      const prev = k >= 1 ? (steps[k - 1].vals || []) : [];
      names.forEach((nm, i) => {
        if (vals[i] == null) return;
        const changed = String(vals[i]) !== String(prev[i]);
        varsEl.append(h("div", { class: "varbox" + (changed ? " changed" : "") }, h("span", { class: "vn" }, nm), h("span", { class: "vv" }, String(vals[i]))));
      });
      if (!names.length) varsEl.append(h("span", { class: "muted small" }, t({ tr: "Bu programda değişken yok.", en: "This program has no variables." })));
      else if (!varsEl.children.length) varsEl.append(h("span", { class: "muted small" }, t({ tr: "Bellek henüz boş.", en: "Memory is still empty." })));
      const outs = [];
      for (let i = 0; i <= k; i++) if (steps[i].out != null) outs.push(t(steps[i].out));
      outEl.textContent = outs.join("\n");
      noteEl.innerHTML = k >= 0 ? t(steps[k].note) : t(cfg.startNote || { tr: "“Sonraki satır” düğmesine basarak Python'un kodu nasıl okuduğunu izle.", en: "Press “Next line” to watch how Python reads the code." });
      back.disabled = k < 0;
      fwd.disabled = k >= steps.length - 1;
      counter.textContent = (k + 1) + " / " + steps.length;
    }
    host.append(
      h("div", { class: "pg-grid" },
        h("div", { class: "pg-panel" }, h("h4", null, t({ tr: "Program", en: "Program" })), codeEl,
          h("div", { class: "pg-ctrls" }, back, fwd, restart, counter)),
        h("div", { class: "pg-panel" },
          h("h4", null, t({ tr: "Bellek (değişkenler)", en: "Memory (variables)" })), varsEl,
          h("h4", null, t({ tr: "Çıktı", en: "Output" })), outEl)
      ),
      noteEl
    );
    render();
  };

  /* =====================================================================
   * 2) listIndex — liste indeksleri ve dilimleme
   * ===================================================================== */
  P.listIndex = function (host, cfg, ctx) {
    const { h, t } = ctx;
    const vals = cfg.values, n = vals.length, name = t(cfg.name), labels = t(cfg.labels);
    let idx = 2, a = 0, b = 3;
    const row = h("div", { class: "cells-row" });
    const code = h("div");
    const tiles = h("div", { class: "tiles" });
    const iId = nid("i"), aId = nid("a"), bId = nid("b");
    const iLab = h("b"), aLab = h("b"), bLab = h("b");
    const ctr = h("div", { class: "pg-ctrls" },
      h("label", { for: iId }, h("span", null, t({ tr: "İndeks", en: "Index" }), " i = ", iLab), range(iId, -n, n - 1, 1, idx, (e) => { idx = +e.target.value; ctx.touch(); render(); })),
      h("label", { for: aId }, h("span", null, t({ tr: "Dilim başı", en: "Slice start" }), " a = ", aLab), range(aId, 0, n, 1, a, (e) => { a = +e.target.value; ctx.touch(); render(); })),
      h("label", { for: bId }, h("span", null, t({ tr: "Dilim sonu", en: "Slice end" }), " b = ", bLab), range(bId, 0, n, 1, b, (e) => { b = +e.target.value; ctx.touch(); render(); }))
    );
    function render() {
      iLab.textContent = idx; aLab.textContent = a; bLab.textContent = b;
      const pos = idx < 0 ? n + idx : idx;
      row.innerHTML = "";
      vals.forEach((v, i) => {
        const inSlice = i >= a && i < b;
        row.append(h("div", { class: "lc" + (inSlice ? " slice" : "") + (i === pos ? " pick" : "") },
          h("span", { class: "ip" }, String(i)),
          h("div", { class: "box" }, pyNum(v, 2)),
          h("span", { class: "lb" }, labels ? labels[i] : ""),
          h("span", { class: "in" }, String(i - n))));
      });
      const sl = vals.slice(a, b);
      const mean = sl.length ? sl.reduce((s, x) => s + x, 0) / sl.length : null;
      const txt =
        name + "[" + idx + "]          # → " + pyNum(vals[pos], 2) + "\n" +
        name + "[" + a + ":" + b + "]        # → " + pyList(sl, 2) + "\n" +
        "len(" + name + "[" + a + ":" + b + "])   # → " + sl.length;
      code.innerHTML = "";
      code.append(codeBlock(ctx, txt));
      tiles.innerHTML = "";
      [["len(" + name + ")", n], [t({ tr: "seçilen", en: "picked" }), pyNum(vals[pos], 2)], [t({ tr: "dilimdeki eleman", en: "items in slice" }), sl.length],
        [t({ tr: "dilim ortalaması", en: "slice mean" }), mean == null ? "—" : fmt(mean, 2)]]
        .forEach(([k2, v]) => tiles.append(h("div", { class: "tile" }, h("small", null, k2), h("b", null, String(v)))));
    }
    host.append(
      h("div", { class: "pg-panel" },
        h("h4", null, t({ tr: "Liste: ", en: "List: " }) + name + "  ·  " + t({ tr: "üstte pozitif, altta negatif indeks", en: "positive index above, negative below" })),
        row, ctr),
      h("div", { class: "pg-grid" }, h("div", { class: "pg-panel" }, h("h4", null, "Python"), code), h("div", { class: "pg-panel" }, h("h4", null, t({ tr: "Sonuç", en: "Result" })), tiles))
    );
    render();
  };

  /* =====================================================================
   * 3) loopFilter — döngü ve koşul: eşiğin üstündeki aylar
   * ===================================================================== */
  P.loopFilter = function (host, cfg, ctx) {
    const { h, t } = ctx;
    const vals = cfg.values, labels = t(cfg.labels), name = t(cfg.name), v = t(cfg.var), tn = t(cfg.thrName);
    let thr = cfg.threshold, step = -1, timer = null;
    const svgWrap = h("div", { class: "svgwrap" });
    const code = h("div");
    const out = h("pre", { class: "pg-console" });
    const note = h("p", { class: "pg-note" });
    const tId = nid("thr");
    const tLab = h("b");
    const stepBtn = h("button", { class: "btn primary", onclick: () => { stop(); advance(); } }, t({ tr: "Bir tur ilerle", en: "One iteration" }) + " ▶");
    const playBtn = h("button", { class: "btn ghost", onclick: () => { if (timer) stop(); else play(); } }, "⏵ " + t({ tr: "Otomatik oynat", en: "Auto-play" }));
    const resetBtn = h("button", { class: "btn ghost subtle", onclick: () => { stop(); step = -1; render(); } }, "↺ " + t({ tr: "Baştan", en: "Restart" }));
    function advance() { if (step < vals.length - 1) { step++; ctx.touch(); render(); } else stop(); }
    function play() { if (step >= vals.length - 1) step = -1; playBtn.textContent = "⏸ " + t({ tr: "Durdur", en: "Pause" }); timer = setInterval(advance, 700); }
    function stop() { clearInterval(timer); timer = null; playBtn.textContent = "⏵ " + t({ tr: "Otomatik oynat", en: "Auto-play" }); }
    function render() {
      tLab.textContent = thr.toFixed(1);
      const W = 640, H = 220, pad = { l: 34, r: 10, t: 12, b: 26 };
      const max = Math.max(...vals, thr) * 1.15;
      const bw = (W - pad.l - pad.r) / vals.length;
      const y = (x) => pad.t + (H - pad.t - pad.b) * (1 - x / max);
      const svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": name });
      niceTicks(0, max, 4).forEach((tk) => {
        if (tk > max) return;
        svg.append(svgEl("line", { x1: pad.l, x2: W - pad.r, y1: y(tk), y2: y(tk), style: "stroke:var(--line)" }));
        const tx = svgEl("text", { x: pad.l - 6, y: y(tk) + 4, "text-anchor": "end", "font-size": 11 }); tx.textContent = tk; svg.append(tx);
      });
      vals.forEach((val, i) => {
        const seen = step < 0 || i <= step;
        const above = val > thr;
        const fill = !seen ? "var(--surface-2)" : above ? "var(--accent)" : "var(--line)";
        const r = svgEl("rect", { x: pad.l + i * bw + 4, y: y(val), width: bw - 8, height: y(0) - y(val), rx: 3, style: "fill:" + fill + (i === step ? ";stroke:var(--hi);stroke-width:3" : "") });
        svg.append(r);
        const lt = svgEl("text", { x: pad.l + i * bw + bw / 2, y: H - 8, "text-anchor": "middle", "font-size": 11 }); lt.textContent = labels[i]; svg.append(lt);
        const vt = svgEl("text", { x: pad.l + i * bw + bw / 2, y: y(val) - 4, "text-anchor": "middle", "font-size": 10.5 }); vt.textContent = pyNum(val, 2); svg.append(vt);
      });
      svg.append(svgEl("line", { x1: pad.l, x2: W - pad.r, y1: y(thr), y2: y(thr), style: "stroke:var(--hi);stroke-width:2;stroke-dasharray:6 4" }));
      const thl = svgEl("text", { x: W - pad.r, y: y(thr) - 5, "text-anchor": "end", "font-size": 11, style: "fill:var(--hi);font-weight:600" }); thl.textContent = tn + " = " + thr.toFixed(1); svg.append(thl);
      svgWrap.innerHTML = ""; svgWrap.append(svg);

      const src =
        tn + " = " + thr.toFixed(1) + "\n" +
        t({ tr: "ustunde", en: "above" }) + " = []\n" +
        "for " + v + " in " + name + ":\n" +
        "    if " + v + " > " + tn + ":\n" +
        "        " + t({ tr: "ustunde", en: "above" }) + ".append(" + v + ")\n" +
        "print(" + t({ tr: "ustunde", en: "above" }) + ")";
      code.innerHTML = ""; code.append(codeBlock(ctx, src));
      const upto = step < 0 ? vals.length - 1 : step;
      const sel = vals.slice(0, upto + 1).filter((x) => x > thr);
      out.textContent = pyList(sel, 2) + "\n" + t({ tr: "Sayı: ", en: "Count: " }) + sel.length + (step >= 0 && step < vals.length - 1 ? t({ tr: "  (döngü sürüyor…)", en: "  (loop running…)" }) : "");
      if (step < 0) note.innerHTML = t({ tr: "Eşiği kaydır: mavi çubuklar koşulu sağlayan aylar. Döngünün her turda ne yaptığını görmek için “Bir tur ilerle”ye bas.", en: "Move the threshold: blue bars are the months that meet the condition. Press “One iteration” to see what the loop does each turn." });
      else {
        const val = vals[step], ok = val > thr;
        note.innerHTML = "<b>" + t({ tr: "Tur ", en: "Iteration " }) + (step + 1) + ":</b> <code>" + v + " = " + val + "</code> → <code>" + val + " &gt; " + thr.toFixed(1) + "</code> " +
          (ok ? t({ tr: "<b>Doğru (True)</b>, listeye eklenir.", en: "<b>True</b>, so it is added to the list." }) : t({ tr: "<b>Yanlış (False)</b>, atlanır.", en: "<b>False</b>, so it is skipped." }));
      }
    }
    host.append(
      h("div", { class: "pg-panel" }, svgWrap,
        h("div", { class: "pg-ctrls" },
          h("label", { for: tId }, h("span", null, tn + " = ", tLab), range(tId, 0, 5, 0.1, thr, (e) => { thr = +e.target.value; ctx.touch(); render(); })),
          stepBtn, playBtn, resetBtn)),
      h("div", { class: "pg-grid" }, h("div", { class: "pg-panel" }, h("h4", null, "Python"), code), h("div", { class: "pg-panel" }, h("h4", null, t({ tr: "Çıktı", en: "Output" })), out)),
      note
    );
    render();
  };

  /* =====================================================================
   * 4) funcMachine — fonksiyon bir makinedir: girdi → işlem → çıktı
   * ===================================================================== */
  P.funcMachine = function (host, cfg, ctx) {
    const { h, t } = ctx;
    let fi = 0;
    const tabs = h("div", { class: "tabs" });
    const body = h("div", { class: "pg" });
    function build() {
      tabs.innerHTML = "";
      cfg.funcs.forEach((f, i) => tabs.append(h("button", { class: i === fi ? "on" : "", onclick: () => { fi = i; ctx.touch(); build(); } }, t(f.name) + "()")));
      const f = cfg.funcs[fi];
      const vals = f.params.map((p) => p.val);
      const ctr = h("div", { class: "pg-ctrls" });
      const callEl = h("div");
      const outB = h("b");
      const labs = [];
      f.params.forEach((p, i) => {
        const id = nid("fp");
        const lab = h("b");
        labs.push(lab);
        ctr.append(h("label", { for: id }, h("span", null, t(p.name) + " = ", lab), range(id, p.min, p.max, p.step, p.val, (e) => { vals[i] = +e.target.value; ctx.touch(); upd(); })));
      });
      function upd() {
        labs.forEach((l, i) => (l.textContent = vals[i]));
        const r = f.f.apply(null, vals);
        outB.textContent = fmt(r, f.digits == null ? 2 : f.digits);
        callEl.innerHTML = "";
        callEl.append(codeBlock(ctx, t(f.name) + "(" + vals.join(", ") + ")   # → " + fmt(r, f.digits == null ? 2 : f.digits)));
      }
      body.innerHTML = "";
      body.append(
        h("div", { class: "machine" },
          h("div", { class: "pg-panel inbox" }, h("h4", null, t({ tr: "Girdiler", en: "Inputs" })), ctr),
          h("div", { class: "pg-panel" }, h("h4", null, t({ tr: "Fonksiyonun tanımı", en: "Function definition" })), codeBlock(ctx, t(f.code))),
          h("div", { class: "pg-panel outbox" }, h("h4", null, "return"), outB)
        ),
        h("div", { class: "pg-panel" }, h("h4", null, t({ tr: "Çağrı", en: "Call" })), callEl),
        f.note ? h("p", { class: "pg-note", html: t(f.note) }) : null
      );
      upd();
    }
    host.append(tabs, body);
    build();
  };

  /* =====================================================================
   * 5) vector — NumPy dizisiyle döngüsüz işlem ve maske
   * ===================================================================== */
  P.vector = function (host, cfg, ctx) {
    const { h, t } = ctx;
    const base = cfg.values, labels = t(cfg.labels), name = t(cfg.name);
    let op = "*", k = 1.25, useMask = false, thr = 40;
    const svgWrap = h("div", { class: "svgwrap" });
    const code = h("div");
    const tiles = h("div", { class: "tiles" });
    const kId = nid("k"), mId = nid("m"), tId = nid("t");
    const kLab = h("b"), tLab = h("b");
    const kInp = range(kId, 0.5, 2, 0.05, k, (e) => { k = +e.target.value; ctx.touch(); render(); });
    const opSel = h("select", { "aria-label": "op", onchange: (e) => {
      op = e.target.value;
      if (op === "*") { kInp.min = 0.5; kInp.max = 2; kInp.step = 0.05; k = 1.25; } else { kInp.min = -20; kInp.max = 40; kInp.step = 1; k = 10; }
      kInp.value = k; ctx.touch(); render();
    } }, h("option", { value: "*" }, t({ tr: "çarp (×)", en: "multiply (×)" })), h("option", { value: "+" }, t({ tr: "ekle (+)", en: "add (+)" })));
    const mChk = h("input", { type: "checkbox", id: mId, onchange: (e) => { useMask = e.target.checked; ctx.touch(); render(); } });
    function render() {
      kLab.textContent = k; tLab.textContent = thr;
      const nv = base.map((x) => (op === "*" ? x * k : x + k));
      const W = 640, H = 220, pad = { l: 36, r: 10, t: 14, b: 26 };
      const max = Math.max(...nv, ...base, thr) * 1.12;
      const bw = (W - pad.l - pad.r) / base.length;
      const y = (v) => pad.t + (H - pad.t - pad.b) * (1 - v / max);
      const svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": name });
      niceTicks(0, max, 4).forEach((tk) => {
        if (tk > max) return;
        svg.append(svgEl("line", { x1: pad.l, x2: W - pad.r, y1: y(tk), y2: y(tk), style: "stroke:var(--line)" }));
        const tx = svgEl("text", { x: pad.l - 6, y: y(tk) + 4, "text-anchor": "end", "font-size": 11 }); tx.textContent = tk; svg.append(tx);
      });
      nv.forEach((v, i) => {
        const x0 = pad.l + i * bw;
        svg.append(svgEl("rect", { x: x0 + bw * 0.18, y: y(base[i]), width: bw * 0.64, height: y(0) - y(base[i]), rx: 3, style: "fill:none;stroke:var(--muted);stroke-dasharray:3 3" }));
        const hit = useMask && v > thr;
        const dim = useMask && !hit;
        svg.append(svgEl("rect", { x: x0 + bw * 0.28, y: y(v), width: bw * 0.44, height: y(0) - y(v), rx: 3, style: "fill:" + (hit ? "var(--hi)" : "var(--accent)") + ";opacity:" + (dim ? 0.3 : 1) }));
        const vt = svgEl("text", { x: x0 + bw / 2, y: y(v) - 5, "text-anchor": "middle", "font-size": 11 }); vt.textContent = fmt(v, 1); svg.append(vt);
        const lt = svgEl("text", { x: x0 + bw / 2, y: H - 8, "text-anchor": "middle", "font-size": 11 }); lt.textContent = labels[i]; svg.append(lt);
      });
      if (useMask) {
        svg.append(svgEl("line", { x1: pad.l, x2: W - pad.r, y1: y(thr), y2: y(thr), style: "stroke:var(--hi);stroke-width:2;stroke-dasharray:6 4" }));
      }
      svgWrap.innerHTML = ""; svgWrap.append(svg);
      const opTxt = name + " " + op + " " + k;
      let src = "import numpy as np\n" + name + " = np.array(" + JSON.stringify(base).replace(/,/g, ", ") + ")\n" +
        t({ tr: "yeni", en: "new" }) + " = " + opTxt + t({ tr: "        # tek satır, döngü yok", en: "        # one line, no loop" }) + "\n";
      if (useMask) src += t({ tr: "yeni", en: "new" }) + "[" + t({ tr: "yeni", en: "new" }) + " > " + thr + "]" + t({ tr: "   # koşulu sağlayanlar", en: "   # those meeting the condition" });
      code.innerHTML = ""; code.append(codeBlock(ctx, src));
      const mean = nv.reduce((s, x) => s + x, 0) / nv.length;
      const sd = Math.sqrt(nv.reduce((s, x) => s + (x - mean) * (x - mean), 0) / nv.length);
      const nn = t({ tr: "yeni", en: "new" });
      tiles.innerHTML = "";
      [[nn + ".mean()", fmt(mean, 2)], [nn + ".std()", fmt(sd, 2)], [nn + ".min()", fmt(Math.min(...nv), 2)], [nn + ".max()", fmt(Math.max(...nv), 2)]]
        .concat(useMask ? [["(" + nn + " > " + thr + ").sum()", nv.filter((x) => x > thr).length]] : [])
        .forEach(([a, b]) => tiles.append(h("div", { class: "tile" }, h("small", null, a), h("b", null, String(b)))));
    }
    host.append(
      h("div", { class: "pg-panel" }, svgWrap,
        h("div", { class: "pg-ctrls" },
          h("label", null, h("span", null, t({ tr: "İşlem", en: "Operation" })), opSel),
          h("label", { for: kId }, h("span", null, t({ tr: "Sayı", en: "Number" }) + " = ", kLab), kInp),
          h("label", { class: "chk", for: mId }, mChk, t({ tr: "Maske uygula", en: "Apply a mask" })),
          h("label", { for: tId }, h("span", null, t({ tr: "Eşik", en: "Threshold" }) + " = ", tLab), range(tId, 0, 150, 5, thr, (e) => { thr = +e.target.value; ctx.touch(); render(); }))
        )),
      h("div", { class: "pg-grid" }, h("div", { class: "pg-panel" }, h("h4", null, "Python"), code), h("div", { class: "pg-panel" }, h("h4", null, t({ tr: "Özet istatistikler", en: "Summary statistics" })), tiles))
    );
    render();
  };

  /* =====================================================================
   * 6) tableBuilder — pandas ile sütun seç, filtrele, sırala
   * ===================================================================== */
  P.tableBuilder = function (host, cfg, ctx) {
    const { h, t } = ctx;
    const D = cfg.data;
    const df = t(D.name);
    const cols = D.cols.map((c) => t(c));
    const show = cols.map(() => true);
    let fOn = false, fCol = 2, fOp = ">", fVal = 10, sCol = -1, asc = false;
    const ctrls = h("div", { class: "pg-ctrls" });
    const code = h("div");
    const tbl = h("div", { class: "dfwrap" });
    const shapeEl = h("p", { class: "muted small" });
    function buildCtrls() {
      ctrls.innerHTML = "";
      const colBox = h("div", { class: "pg-ctrls" }, h("span", { class: "muted small" }, t({ tr: "Sütunlar:", en: "Columns:" })));
      cols.forEach((c, i) => {
        const id = nid("col");
        colBox.append(h("label", { class: "chk", for: id }, h("input", { type: "checkbox", id, checked: show[i], onchange: (e) => { show[i] = e.target.checked; ctx.touch(); render(); } }), h("code", null, c)));
      });
      const fid = nid("fon");
      const filt = h("div", { class: "pg-ctrls" },
        h("label", { class: "chk", for: fid }, h("input", { type: "checkbox", id: fid, checked: fOn, onchange: (e) => { fOn = e.target.checked; ctx.touch(); render(); } }), t({ tr: "Filtrele", en: "Filter" })),
        h("select", { "aria-label": "filter column", onchange: (e) => { fCol = +e.target.value; fOn = true; ctx.touch(); buildCtrls(); render(); } }, cols.map((c, i) => h("option", { value: i, selected: i === fCol }, c))),
        h("select", { "aria-label": "operator", onchange: (e) => { fOp = e.target.value; fOn = true; ctx.touch(); buildCtrls(); render(); } }, [">", "<", ">=", "<="].map((o) => h("option", { value: o, selected: o === fOp }, o))),
        h("input", { type: "number", step: "0.5", value: fVal, "aria-label": "value", style: "width:90px", oninput: (e) => { fVal = +e.target.value; fOn = true; ctx.touch(); render(); } })
      );
      const sort = h("div", { class: "pg-ctrls" },
        h("span", { class: "muted small" }, t({ tr: "Sırala:", en: "Sort:" })),
        h("select", { "aria-label": "sort column", onchange: (e) => { sCol = +e.target.value; ctx.touch(); render(); } }, [h("option", { value: -1, selected: sCol === -1 }, t({ tr: "(yok)", en: "(none)" }))].concat(cols.map((c, i) => h("option", { value: i, selected: i === sCol }, c)))),
        h("select", { "aria-label": "direction", onchange: (e) => { asc = e.target.value === "1"; ctx.touch(); render(); } }, h("option", { value: "0", selected: !asc }, t({ tr: "büyükten küçüğe", en: "descending" })), h("option", { value: "1", selected: asc }, t({ tr: "küçükten büyüğe", en: "ascending" })))
      );
      ctrls.append(colBox, filt, sort);
    }
    function cmp(a, op, b) { return op === ">" ? a > b : op === "<" ? a < b : op === ">=" ? a >= b : a <= b; }
    function render() {
      let rows = D.rows.map((r, i) => ({ i, r }));
      const res = t({ tr: "sonuc", en: "result" });
      const lines = [];
      if (fOn) {
        rows = rows.filter((x) => cmp(x.r[fCol], fOp, fVal));
        lines.push(res + " = " + df + "[" + df + '["' + cols[fCol] + '"] ' + fOp + " " + fVal + "]");
      } else lines.push(res + " = " + df);
      if (sCol >= 0) {
        rows.sort((p, q) => (asc ? p.r[sCol] - q.r[sCol] : q.r[sCol] - p.r[sCol]));
        lines.push(res + " = " + res + '.sort_values("' + cols[sCol] + '", ascending=' + (asc ? "True" : "False") + ")");
      }
      const sel = cols.map((c, i) => i).filter((i) => show[i]);
      if (sel.length === cols.length) lines.push(res);
      else lines.push(res + "[" + JSON.stringify(sel.map((i) => cols[i])).replace(/,/g, ", ") + "]");
      code.innerHTML = ""; code.append(codeBlock(ctx, lines.join("\n")));
      let html = '<table class="df"><thead><tr><th></th>' + sel.map((i) => "<th>" + LAB.esc(cols[i]) + "</th>").join("") + "</tr></thead><tbody>";
      rows.forEach((x) => { html += "<tr><th>" + x.i + "</th>" + sel.map((i) => "<td>" + x.r[i] + "</td>").join("") + "</tr>"; });
      html += "</tbody></table>";
      tbl.innerHTML = rows.length && sel.length ? html : '<p class="muted small">' + t({ tr: "Koşulu sağlayan satır yok (boş tablo).", en: "No rows meet the condition (empty table)." }) + "</p>";
      shapeEl.textContent = res + ".shape  # → (" + rows.length + ", " + sel.length + ")   " + t({ tr: "satır, sütun", en: "rows, columns" });
    }
    buildCtrls();
    host.append(
      h("div", { class: "pg-panel" }, h("h4", null, t({ tr: "Kontroller", en: "Controls" })), ctrls),
      h("div", { class: "pg-grid" },
        h("div", { class: "pg-panel" }, h("h4", null, t({ tr: "Üretilen pandas kodu", en: "Generated pandas code" })), code, shapeEl),
        h("div", { class: "pg-panel" }, h("h4", null, t({ tr: "Sonuç tablosu", en: "Result table" })), tbl))
    );
    render();
  };

  /* =====================================================================
   * 7) chartBuilder — matplotlib grafiğini seçerek kur
   * ===================================================================== */
  P.chartBuilder = function (host, cfg, ctx) {
    const { h, t } = ctx;
    const D = cfg.data;
    const df = t(D.name);
    const cols = D.cols.map((c) => t(c));
    let kind = "plot", xi = 0, yi = 2, y2 = -1, opt = { title: true, labels: true, grid: false, legend: false };
    const svgWrap = h("div", { class: "svgwrap" });
    const code = h("div");
    const ctrls = h("div", { class: "pg-ctrls" });
    const kinds = [["plot", { tr: "çizgi", en: "line" }], ["bar", { tr: "sütun", en: "bar" }], ["scatter", { tr: "serpme", en: "scatter" }]];
    function buildCtrls() {
      ctrls.innerHTML = "";
      const sel = (label, val, onch, withNone) => h("label", null, h("span", null, label),
        h("select", { onchange: (e) => { onch(+e.target.value); ctx.touch(); buildCtrls(); render(); } },
          (withNone ? [h("option", { value: -1, selected: val === -1 }, t({ tr: "(yok)", en: "(none)" }))] : []).concat(cols.map((c, i) => h("option", { value: i, selected: i === val }, c)))));
      ctrls.append(
        h("div", { class: "tabs", role: "group" }, kinds.map(([k, lab]) => h("button", { class: k === kind ? "on" : "", onclick: () => { kind = k; ctx.touch(); buildCtrls(); render(); } }, "plt." + k + "  · " + t(lab)))),
        sel("x", xi, (v) => (xi = v)),
        sel("y", yi, (v) => (yi = v)),
        kind === "plot" ? sel(t({ tr: "2. çizgi", en: "2nd line" }), y2, (v) => (y2 = v), true) : null
      );
      [["title", { tr: "başlık", en: "title" }], ["labels", { tr: "eksen adları", en: "axis labels" }], ["grid", { tr: "ızgara", en: "grid" }], ["legend", { tr: "lejant", en: "legend" }]].forEach(([k, lab]) => {
        const id = nid("o");
        ctrls.append(h("label", { class: "chk", for: id }, h("input", { type: "checkbox", id, checked: opt[k], onchange: (e) => { opt[k] = e.target.checked; ctx.touch(); render(); } }), t(lab)));
      });
    }
    function render() {
      const X = D.rows.map((r) => r[xi]);
      const series = [yi].concat(kind === "plot" && y2 >= 0 ? [y2] : []);
      const W = 640, H = 300, pad = { l: 50, r: 16, t: opt.title ? 34 : 14, b: opt.labels ? 46 : 30 };
      const allY = series.flatMap((s) => D.rows.map((r) => r[s]));
      let ymin = Math.min(0, ...allY), ymax = Math.max(...allY);
      const yt = niceTicks(ymin, ymax, 5); ymin = yt[0]; ymax = yt[yt.length - 1];
      let xmin = Math.min(...X), xmax = Math.max(...X);
      const xIsCat = kind === "bar";
      const xt = xIsCat ? X : niceTicks(xmin, xmax, 6);
      if (!xIsCat) { xmin = Math.min(xmin, xt[0]); xmax = Math.max(xmax, xt[xt.length - 1]); }
      const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
      const sx = (v, i) => xIsCat ? pad.l + (i + 0.5) * iw / X.length : pad.l + iw * (v - xmin) / ((xmax - xmin) || 1);
      const sy = (v) => pad.t + ih * (1 - (v - ymin) / ((ymax - ymin) || 1));
      const svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "chart" });
      svg.append(svgEl("rect", { x: pad.l, y: pad.t, width: iw, height: ih, style: "fill:none;stroke:var(--line)" }));
      yt.forEach((v) => {
        if (opt.grid) svg.append(svgEl("line", { x1: pad.l, x2: W - pad.r, y1: sy(v), y2: sy(v), style: "stroke:var(--line);stroke-dasharray:2 3" }));
        const tx = svgEl("text", { x: pad.l - 6, y: sy(v) + 4, "text-anchor": "end", "font-size": 11 }); tx.textContent = v; svg.append(tx);
      });
      xt.forEach((v, i) => {
        if (opt.grid && !xIsCat) svg.append(svgEl("line", { y1: pad.t, y2: H - pad.b, x1: sx(v, i), x2: sx(v, i), style: "stroke:var(--line);stroke-dasharray:2 3" }));
        const tx = svgEl("text", { x: sx(v, i), y: H - pad.b + 15, "text-anchor": "middle", "font-size": 11 }); tx.textContent = v; svg.append(tx);
      });
      const colors = ["var(--accent)", "var(--hi)"];
      if (yi >= 0 && ymin < 0) svg.append(svgEl("line", { x1: pad.l, x2: W - pad.r, y1: sy(0), y2: sy(0), style: "stroke:var(--muted)" }));
      series.forEach((s, si) => {
        const pts = D.rows.map((r, i) => [sx(r[xi], i), sy(r[s])]);
        if (kind === "plot") {
          const order = pts.map((p, i) => i).sort((a, b) => X[a] - X[b]);
          svg.append(svgEl("polyline", { points: order.map((i) => pts[i].join(",")).join(" "), style: "fill:none;stroke:" + colors[si] + ";stroke-width:2.5" }));
        } else if (kind === "bar") {
          const bw = iw / X.length * 0.6;
          pts.forEach(([x], i) => {
            const v = D.rows[i][s];
            svg.append(svgEl("rect", { x: x - bw / 2, y: Math.min(sy(v), sy(0)), width: bw, height: Math.abs(sy(0) - sy(v)), style: "fill:" + colors[si] }));
          });
        } else {
          pts.forEach(([x, y]) => svg.append(svgEl("circle", { cx: x, cy: y, r: 5, style: "fill:" + colors[si] + ";opacity:0.85" })));
        }
      });
      if (opt.title) { const tt = svgEl("text", { x: W / 2, y: 20, "text-anchor": "middle", "font-size": 14, style: "fill:var(--ink);font-weight:600" }); tt.textContent = cols[yi] + (kind === "scatter" ? " ~ " + cols[xi] : ""); svg.append(tt); }
      if (opt.labels) {
        const xl = svgEl("text", { x: pad.l + iw / 2, y: H - 8, "text-anchor": "middle", "font-size": 12, style: "fill:var(--ink)" }); xl.textContent = cols[xi]; svg.append(xl);
        const yl = svgEl("text", { x: 14, y: pad.t + ih / 2, "text-anchor": "middle", "font-size": 12, transform: "rotate(-90 14 " + (pad.t + ih / 2) + ")", style: "fill:var(--ink)" }); yl.textContent = cols[yi]; svg.append(yl);
      }
      if (opt.legend) {
        series.forEach((s, si) => {
          const ly = pad.t + 14 + si * 18;
          svg.append(svgEl("rect", { x: W - pad.r - 110, y: ly - 9, width: 14, height: 10, style: "fill:" + colors[si] }));
          const lt = svgEl("text", { x: W - pad.r - 90, y: ly, "font-size": 12, style: "fill:var(--ink)" }); lt.textContent = cols[s]; svg.append(lt);
        });
      }
      svgWrap.innerHTML = ""; svgWrap.append(svg);

      const L = ["import matplotlib.pyplot as plt", ""];
      series.forEach((s) => {
        const lab = opt.legend ? ', label="' + cols[s] + '"' : "";
        L.push("plt." + kind + "(" + df + '["' + cols[xi] + '"], ' + df + '["' + cols[s] + '"]' + lab + ")");
      });
      if (opt.title) L.push('plt.title("' + cols[yi] + (kind === "scatter" ? " ~ " + cols[xi] : "") + '")');
      if (opt.labels) { L.push('plt.xlabel("' + cols[xi] + '")'); L.push('plt.ylabel("' + cols[yi] + '")'); }
      if (opt.grid) L.push("plt.grid(True)");
      if (opt.legend) L.push("plt.legend()");
      L.push("plt.show()");
      code.innerHTML = ""; code.append(codeBlock(ctx, L.join("\n")));
    }
    buildCtrls();
    host.append(
      h("div", { class: "pg-panel" }, ctrls, svgWrap),
      h("div", { class: "pg-panel" }, h("h4", null, t({ tr: "Bu grafiği çizen kod", en: "The code that draws this chart" })), code)
    );
    render();
  };

  /* =====================================================================
   * 8) roadmap — bir veri analizinin adımları
   * ===================================================================== */
  P.roadmap = function (host, cfg, ctx) {
    const { h, t } = ctx;
    let si = 0;
    const steps = h("div", { class: "steps" });
    const body = h("div", { class: "pg-grid" });
    function render() {
      steps.innerHTML = "";
      cfg.steps.forEach((s, i) => steps.append(h("button", { class: i === si ? "on" : "", onclick: () => { si = i; ctx.touch(); render(); } }, (i + 1) + ". " + t(s.title))));
      const s = cfg.steps[si];
      body.innerHTML = "";
      body.append(h("div", { class: "pg-panel" }, h("h4", null, t(s.title)), h("div", { class: "prose", html: t(s.text) })),
        h("div", { class: "pg-panel" }, h("h4", null, t({ tr: "Kullanacağın araç", en: "Tool you will use" })), codeBlock(ctx, t(s.code))));
    }
    host.append(steps, body);
    render();
  };
})();
