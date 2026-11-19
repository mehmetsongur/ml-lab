// Tüm içerik dosyalarını yükleyip hücreleri JSON olarak döker.
const path = require("path");
global.window = { LAB: { modules: [], playgrounds: {}, registerModule(m) { this.modules.push(m); } } };
global.document = { createElementNS() { return {}; } };
const dir = path.resolve(process.argv[2] || path.join(__dirname, "..", "content"));
require(path.join(dir, "catalog.js"));
for (const c of window.LAB.catalog) c.files.forEach((f) => require(path.join(dir, c.id, f)));
const out = [];
for (const m of window.LAB.modules) for (const L of m.lessons) for (const lang of ["tr", "en"]) {
  const t = (x) => x == null ? null : (typeof x === "string" ? x : x[lang]);
  out.push({ lesson: L.id, lang, cells: L.cells.filter(c => !["compare", "prompt", "interpret", "colab", "auditlog"].includes(c.kind)).map(c => ({ id: c.id, kind: c.kind, code: t(c.code) || (c.ai ? t(c.ai.code) : null), solution: t(c.solution), checks: (c.checks || []).map(ch => t(ch.py)) })) });
}
console.log(JSON.stringify(out));
