# Dünya Bankası ülke göstergeleri / World Bank country indicators

`countries.csv`: 157 ülke için sekiz Dünya Kalkınma Göstergesinin 2019–2023 ortalamaları (Modül 7). Bölgesel ve gelir grubu toplamları çıkarılmış, herhangi bir göstergesi eksik olan ülkeler atılmıştır. Dosya `tools/fetch_wb.py` ile Dünya Bankası API'sinden üretilir ve `.github/workflows/m7-data.yml` ile her ay yenilenir.

`countries.csv`: 2019–2023 averages of eight World Development Indicators for 157 countries (Module 7). Regional and income-group aggregates are excluded and countries missing any indicator are dropped. The file is built from the World Bank API by `tools/fetch_wb.py` and refreshed monthly by `.github/workflows/m7-data.yml`.

| Sütun / Column | Gösterge / Indicator |
|---|---|
| gdppc_ppp | NY.GDP.PCAP.PP.KD — kişi başı GSYH, SGP, sabit uluslararası $ / GDP per capita, PPP, constant international $ |
| inflation | FP.CPI.TOTL.ZG — TÜFE enflasyonu, yıllık % (5 yılın medyanı) / CPI inflation, annual % (median of 5 years) |
| unemployment | SL.UEM.TOTL.ZS — işsizlik oranı, % (ILO modellenmiş) / unemployment rate, % (modelled ILO) |
| trade | NE.TRD.GNFS.ZS — dış ticaret, GSYH'nin %'si / trade, % of GDP |
| agriculture | NV.AGR.TOTL.ZS — tarım katma değeri, GSYH'nin %'si / agriculture value added, % of GDP |
| urban | SP.URB.TOTL.IN.ZS — kentsel nüfus, % / urban population, % |
| life_exp | SP.DYN.LE00.IN — doğumda beklenen yaşam süresi / life expectancy at birth |
| fertility | SP.DYN.TFRT.IN — toplam doğurganlık hızı / total fertility rate |

Kaynak / Source: World Bank, World Development Indicators (https://data.worldbank.org). Lisans / Licence: CC BY 4.0.
