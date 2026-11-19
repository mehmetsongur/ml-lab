# Kredi kartı temerrüt verisi / Credit card default data

`taiwan_default.csv`: Tayvan'da bir bankanın 30.000 kredi kartı müşterisi; Nisan–Eylül 2005 kredi limiti, demografik bilgiler, ödeme durumu, ekstre ve ödeme tutarları ve Ekim 2005 temerrüdü (`default`). Dosya, UCI Makine Öğrenmesi Deposu'ndaki özgün Excel dosyasından `.github/workflows/credit-data.yml` ile üretilir: sütun adları küçük harfe çevrilir, `default payment next month` → `default`, `ID` sütunu atılır. Modül 4 ve 5'in tarayıcıdaki alıştırmaları ve Colab atölyeleri bu dosyayı okur.

`taiwan_default.csv`: 30,000 credit card customers of a bank in Taiwan; credit limit, demographics, payment status, statement and payment amounts for April–September 2005, and default in October 2005 (`default`). The file is produced from the original Excel file in the UCI Machine Learning Repository by `.github/workflows/credit-data.yml`: column names are lower-cased, `default payment next month` → `default`, and the `ID` column is dropped. The in-browser exercises and Colab workshops of Modules 4 and 5 read this file.

**Ödeme durumu / Payment status (`pay_0`, `pay_2` … `pay_6`):** −1 tamamını ödedi / paid duly; 1, 2, … 9: kaç ay gecikme / months of delay. −2 ve 0 kodları özgün açıklamada tanımlı değildir; laboratuvar literatürdeki yaygın yorumu kullanır (−2: kart kullanılmadı, 0: asgari ödeme yapıldı). / Codes −2 and 0 are not defined in the original description; the lab uses the common reading in the literature (−2: card not used, 0: minimum payment made).

**Kaynak ve lisans / Source and licence:** Yeh, I-C. (2009). Default of Credit Card Clients [Dataset]. UCI Machine Learning Repository. https://archive.ics.uci.edu/dataset/350/default+of+credit+card+clients — Creative Commons Attribution 4.0 International (CC BY 4.0).

Yeh, I-C. & Lien, C-H. (2009). The comparisons of data mining techniques for the predictive accuracy of probability of default of credit card clients. *Expert Systems with Applications*, 36(2), 2473–2480.
