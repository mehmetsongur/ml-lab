"""Modül 7: Dünya Bankası (World Development Indicators, CC BY 4.0) ülke göstergelerini indirir.
Her gösterge için 2019–2023 ortalaması (enflasyonda medyan) alınır; bölge ve gelir grubu eklenir.
Çıktı: data/wb/countries.csv. GitHub Actions'ta çalışır (.github/workflows/m7-data.yml)."""
import json, os, time, urllib.request
import pandas as pd

IND = {
    "NY.GDP.PCAP.PP.KD": "gdppc_ppp",      # kişi başı GSYH, SAGP, sabit 2021 uluslararası $
    "FP.CPI.TOTL.ZG": "inflation",         # TÜFE enflasyonu, %
    "SL.UEM.TOTL.ZS": "unemployment",      # işsizlik oranı, % (ILO tahmini)
    "NE.TRD.GNFS.ZS": "trade",             # dış ticaret, GSYH'nin %'si
    "NV.AGR.TOTL.ZS": "agriculture",       # tarım katma değeri, GSYH'nin %'si
    "SP.URB.TOTL.IN.ZS": "urban",          # kentsel nüfus, %
    "SP.DYN.LE00.IN": "life_exp",          # doğuşta yaşam beklentisi, yıl
    "SP.DYN.TFRT.IN": "fertility",         # toplam doğurganlık hızı
}
BASE = "https://api.worldbank.org/v2"


def get(url):
    for k in range(5):
        try:
            with urllib.request.urlopen(url, timeout=60) as r:
                return json.loads(r.read().decode())
        except Exception as e:
            print("yeniden dene", k, e); time.sleep(3 * (k + 1))
    raise RuntimeError(url)


meta = get(f"{BASE}/country?format=json&per_page=400")[1]
cty = pd.DataFrame([{"iso3": c["id"], "country": c["name"], "region": c["region"]["value"], "income": c["incomeLevel"]["value"]}
                    for c in meta if c["region"]["value"] != "Aggregates"])
print("ülke:", len(cty))

rows = []
for code, name in IND.items():
    d = get(f"{BASE}/country/all/indicator/{code}?format=json&date=2019:2023&per_page=20000")[1]
    for x in d:
        if x["value"] is not None:
            rows.append({"iso3": x["countryiso3code"], "year": int(x["date"]), "var": name, "value": float(x["value"])})
    print(code, len(d))
long = pd.DataFrame(rows)
agg = long.groupby(["iso3", "var"])["value"]
wide = agg.mean().unstack()
wide["inflation"] = long[long["var"] == "inflation"].groupby("iso3")["value"].median()
out = cty.merge(wide.reset_index(), on="iso3", how="inner")
out = out[["iso3", "country", "region", "income"] + list(IND.values())]
out = out.dropna(subset=list(IND.values()))
out[list(IND.values())] = out[list(IND.values())].round(3)
os.makedirs("data/wb", exist_ok=True)
out.sort_values("iso3").to_csv("data/wb/countries.csv", index=False)
print(out.shape)
print(out.head().to_string())
