"""Modül 7: FOMC para politikası açıklamalarını (2000–) federalreserve.gov'dan indirir (ABD kamu malı).
Bağlantılar FOMC takvim sayfasından ve yıllık tarihî sayfalardan toplanır; her açıklamanın metni,
oylama paragrafından ("Voting for ...") önceki kısımdır. Çıktı: data/fomc/statements.csv
GitHub Actions'ta çalışır (.github/workflows/m7-data.yml)."""
import os, re, time, urllib.request
from urllib.parse import urljoin
import pandas as pd
from bs4 import BeautifulSoup

ROOT = "https://www.federalreserve.gov"
UA = {"User-Agent": "Mozilla/5.0 (ml-lab educational data fetch; github.com/mehmetsongur/ml-lab)"}
PAT = [re.compile(r"/newsevents/press(?:releases)?/monetary/?(\d{8})a\.htm"),
       re.compile(r"/boarddocs/press/monetary/\d{4}/(\d{8})/(?:default\.htm)?$")]


def get(url):
    for k in range(4):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read().decode("utf-8", errors="replace")
        except Exception as e:
            print("  yeniden dene", k, url, e); time.sleep(2 * (k + 1))
    return None


pages = [f"{ROOT}/monetarypolicy/fomccalendars.htm"] + [f"{ROOT}/monetarypolicy/fomchistorical{y}.htm" for y in range(2000, 2021)]
links = {}
for p in pages:
    html = get(p)
    if not html:
        print("sayfa alınamadı:", p); continue
    for a in BeautifulSoup(html, "html.parser").find_all("a", href=True):
        href = a["href"].split("#")[0]
        for pat in PAT:
            m = pat.search(href)
            if m and m.group(1) >= "20000101":
                links.setdefault(m.group(1), urljoin(p, href))
    print(p.rsplit("/", 1)[-1], "toplam bağlantı:", len(links))
    time.sleep(0.5)


def clean_text(html):
    s = BeautifulSoup(html, "html.parser")
    for tag in s(["script", "style", "nav", "header", "footer"]):
        tag.decompose()
    box = s.find(id="article") or s.find("div", class_="col-xs-12 col-sm-8 col-md-8") or s.body or s
    paras = [p.get_text(" ", strip=True) for p in box.find_all("p")]
    if sum(len(p) for p in paras) < 300:                       # eski sayfalar: paragraf etiketi az
        paras = [x.strip() for x in box.get_text("\n").split("\n")]
    text = " ".join(p for p in paras if p)
    text = re.sub(r"\s+", " ", text).strip()
    cut = re.search(r"Voting for (the )?(FOMC )?monetary policy action|Voting for this action|Voting for the action", text)
    if cut:
        text = text[:cut.start()].strip()
    text = re.sub(r"^.*?For (immediate )?release\s*", "", text, flags=re.I)   # başlık ve tarih satırı
    text = re.sub(r"^(Release Date|Press Release)[^.]*?\d{4}\s*", "", text)
    text = re.sub(r"^(at \d{1,2}:\d{2} [ap]\.m\. E[SD]T\s*)?Share\s*", "", text)            # yeni sayfaların başlığı
    text = re.sub(r"^The Federal Open Market Committee approved the following statement for release by an? [^:]{0,40}vote:\s*", "", text)
    for stop in ["For media inquiries", "Implementation Note issued", "Implementation Note", "Last Update"]:
        i = text.find(stop)
        if i > 200:
            text = text[:i].strip()
    return text


rows = []
for d, url in sorted(links.items()):
    html = get(url)
    if not html:
        continue
    text = clean_text(html)
    ok = ("Committee" in text) and ("federal funds" in text.lower()) and (200 < len(text)) and (len(text.split()) < 1000)
    print(d, len(text), "ok" if ok else "ATLANDI", url)
    if ok:
        rows.append({"date": f"{d[:4]}-{d[4:6]}-{d[6:]}", "url": url, "words": len(text.split()), "text": text})
    time.sleep(0.4)

out = pd.DataFrame(rows).drop_duplicates("date").sort_values("date")
os.makedirs("data/fomc", exist_ok=True)
out.to_csv("data/fomc/statements.csv", index=False)
print(out.shape, out["words"].describe().round(0).to_dict())
print(out.head(3).to_string()[:1500])
