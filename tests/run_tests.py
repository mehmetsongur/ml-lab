"""Her hücrenin çözümünü çalıştırır ve kontrollerin geçtiğini doğrular.
'fill' hücrelerinde boşluk, 'debug' ve 'challenge' hücrelerinde başlangıç kodunun BAŞARISIZ olması beklenir."""
import json, re, os, sys
here = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(here, "..", "assets", "app.js"), encoding="utf-8").read()
exec(re.search(r'PY_RUNNER = String\.raw`(.*?)`;', src, re.S).group(1), globals())
data = json.load(open(os.path.join(here, "cells.json"), encoding="utf-8"))
os.chdir(os.path.join(here, "..", "data"))   # hücreler veri dosyalarını "fred/UNRATE.csv" gibi göreli yollarla okur
fails = 0
for L in data:
    ns = L["lesson"] + "#" + L["lang"]
    _lab_reset(ns)
    for c in L["cells"]:
        if c["kind"] == "fill" and "___" not in c["code"]:
            print("NO BLANK", c["id"], L["lang"]); fails += 1
        if c["kind"] in ("debug", "challenge", "audit", "check"):
            # başlangıç kodu, ad alanının bir kopyasında çalıştırılır
            import copy
            _LAB_NS[ns + "-s"] = dict(_LAB_NS[ns])
            r = json.loads(_lab_run(c["code"], ns + "-s", json.dumps(c["checks"])))
            if r["error"] is None and r["checks"] and all(r["checks"]):
                print("STARTER PASSES", c["id"], L["lang"]); fails += 1
        r = json.loads(_lab_run(c["solution"] or c["code"], ns, json.dumps(c["checks"])))
        if not (r["error"] is None and all(r["checks"])):
            fails += 1
            print("FAIL", c["id"], L["lang"], r["error"], r["checks"], r["stdout"][:200])
n = sum(len(L["cells"]) for L in data)
print(f"{n} hücre test edildi, {fails} hata")
sys.exit(1 if fails else 0)
