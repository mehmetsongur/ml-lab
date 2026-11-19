// Katalogdaki özet bilgilerin (ünite, alıştırma, dakika) modül içerikleriyle tutarlı olduğunu doğrular.
const path = require("path");
global.window = { LAB: { modules: [], playgrounds: {}, registerModule(m) { this.modules.push(m); } } };
global.document = { createElementNS() { return {}; } };
const dir = path.join(__dirname, "..", "content");
require(path.join(dir, "catalog.js"));
let bad = 0;
for (const c of window.LAB.catalog) {
  c.files.forEach((f) => require(path.join(dir, c.id, f)));
  const m = window.LAB.modules.find((x) => x.id === c.id);
  const req = m.required ? m.lessons.filter((l) => m.required.includes(l.id)) : m.lessons;
  const real = { units: req.length, exercises: req.reduce((a, l) => a + (l.cells || []).length, 0), minutes: req.reduce((a, l) => a + (l.minutes || 15), 0) };
  const ids = req.map((l) => l.id).join(",") === req.map((_, i) => c.id + "-u" + (i + 1)).join(",");
  for (const k of ["units", "exercises", "minutes"]) if (c[k] !== real[k]) { bad++; console.log(`${c.id}.${k}: katalog ${c[k]}, gerçek ${real[k]}`); }
  if (!ids) { bad++; console.log(`${c.id}: ünite kimlikleri ${c.id}-u1… biçiminde değil`); }
  if (m.num !== c.num) { bad++; console.log(`${c.id}.num uyuşmuyor`); }
}
console.log(bad ? bad + " tutarsızlık" : "katalog tutarlı");
process.exit(bad ? 1 : 0);
