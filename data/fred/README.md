# FRED veri anlık görüntüleri / FRED data snapshots

Bu klasördeki CSV dosyaları, St. Louis Fed'in FRED veri tabanından (https://fred.stlouisfed.org) her ay otomatik olarak indirilir (`.github/workflows/fred-data.yml`). Laboratuvarın tarayıcıda çalışan alıştırmaları bu dosyaları okur; böylece öğrencinin internetten veri indirmesi gerekmez. İndirilecek seriler `series.txt` dosyasında listelenir; son güncelleme tarihi `LAST_UPDATED` dosyasındadır.

The CSV files in this folder are downloaded automatically every month from the St. Louis Fed's FRED database (https://fred.stlouisfed.org) by `.github/workflows/fred-data.yml`. The lab's in-browser exercises read these files, so learners do not need to download data. The series are listed in `series.txt`; the last update date is in `LAST_UPDATED`.

Kaynak / Source: U.S. Bureau of Labor Statistics, Board of Governors of the Federal Reserve System, U.S. Census Bureau, University of Michigan ve her serinin FRED sayfasında belirtilen diğer kaynaklar / and the other sources listed on each series' FRED page; via FRED, Federal Reserve Bank of St. Louis.

Modül 3'ün enflasyon üniteleri 13 seri kullanır / Module 3's inflation units use 13 series: CPIAUCSL, CPILFESL, PPIACO, M2SL, WTISPLC, AHETPI, PAYEMS, INDPRO, UNRATE, FEDFUNDS, T10Y3MM, UMCSENT, HOUST.

Modül 6 günlük döviz kurlarını kullanır (Federal Reserve H.10, kamu malı) / Module 6 uses daily exchange rates (Federal Reserve H.10, public domain): DEXUSEU (euro/dolar, tarayıcı alıştırmaları / in-browser exercises), DEXUSUK (sterlin/dolar, Colab atölyesi / Colab workshop), DEXJPUS, DTWEXBGS.

Modül 7 aylık ABD Hazine faizlerini (Federal Reserve H.15, kamu malı) ve federal fon oranını kullanır / Module 7 uses monthly US Treasury yields (Federal Reserve H.15, public domain) and the federal funds rate: TB3MS, TB6MS, GS1, GS2, GS3, GS5, GS7, GS10, FEDFUNDS.
