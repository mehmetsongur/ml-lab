# FOMC para politikası açıklamaları / FOMC monetary policy statements

`statements.csv`: Federal Açık Piyasa Komitesi'nin (FOMC) Mayıs 2002'den bu yana toplantı sonrası açıklamaları (Modül 7). Sütunlar: `date` (açıklama tarihi), `url` (federalreserve.gov sayfası), `words` (kelime sayısı), `text` (açıklama metni; oylama listesi ve sayfa öğeleri çıkarılmış). Dosya `tools/fetch_fomc.py` ile federalreserve.gov'dan üretilir ve `.github/workflows/m7-data.yml` ile her ay yenilenir. Kapsam notu: 2000–2001 açıklamaları ve sonraki yıllardan birkaç açıklama (örneğin 16 Aralık 2008) dosyada yoktur.

`statements.csv`: the post-meeting statements of the Federal Open Market Committee (FOMC) since May 2002 (Module 7). Columns: `date` (statement date), `url` (federalreserve.gov page), `words` (word count), `text` (statement text; voting list and page elements removed). The file is built from federalreserve.gov by `tools/fetch_fomc.py` and refreshed monthly by `.github/workflows/m7-data.yml`. Coverage note: the 2000–2001 statements and a few later statements (for example 16 December 2008) are not in the file.

`nmf_topics.json`: Modül 7 oyun alanı için önceden hesaplanmış NMF konuları (k = 3–6), `tools/m7_figs.py` ile üretilir / precomputed NMF topics (k = 3–6) for the Module 7 playground, built by `tools/m7_figs.py`.

Kaynak / Source: Board of Governors of the Federal Reserve System (https://www.federalreserve.gov). ABD federal hükümeti eseri, kamu malı / US federal government work, public domain.
