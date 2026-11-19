# ML Laboratuvarı · Colab atölyeleri

**Prof. Dr. Mehmet Songur** · [songurmehmet.com](https://www.songurmehmet.com)

**▶ Laboratuvar / Lab site:** https://www.songurmehmet.com/ml-lab/ · Kaynak / Source: [ml-lab](../)

🇹🇷 [Türkçe](#türkçe) · 🇬🇧 [English](#english)

---

## Türkçe

ML Laboratuvarı'nın (Modül 0: *YZ ile Ekonomik Analize Giriş*) Google Colab + Gemini atölyeleri. Notebook'lar laboratuvar sitesindeki **Colab'da aç** düğmeleriyle açılır.

| Ünite | Notebook | Colab |
|---|---|---|
| 9 · Colab + Gemini atölyesi | `modul0/09_colab_atolyesi_tr.ipynb` | [Aç](https://colab.research.google.com/github/mehmetsongur/ml-lab/blob/main/notebooks/modul0/09_colab_atolyesi_tr.ipynb) |
| 10 · Bitirme projesi | `modul0/10_bitirme_projesi_tr.ipynb` | [Aç](https://colab.research.google.com/github/mehmetsongur/ml-lab/blob/main/notebooks/modul0/10_bitirme_projesi_tr.ipynb) |
| Modül 1 · 10 · Veri hazırlama atölyesi (FRED) | `modul1/10_veri_hazirlama_atolyesi_tr.ipynb` | [Aç](https://colab.research.google.com/github/mehmetsongur/ml-lab/blob/main/notebooks/modul1/10_veri_hazirlama_atolyesi_tr.ipynb) |
| Modül 2 · 9 · Öngörüyü değerlendirme atölyesi (FRED) | `modul2/09_ongoru_degerlendirme_atolyesi_tr.ipynb` | [Aç](https://colab.research.google.com/github/mehmetsongur/ml-lab/blob/main/notebooks/modul2/09_ongoru_degerlendirme_atolyesi_tr.ipynb) |
| Modül 3 · 9 · Enflasyon öngörüsü atölyesi (FRED, 13 seri) | `modul3/09_enflasyon_ongoru_atolyesi_tr.ipynb` | [Aç](https://colab.research.google.com/github/mehmetsongur/ml-lab/blob/main/notebooks/modul3/09_enflasyon_ongoru_atolyesi_tr.ipynb) |
| Modül 4 · 9 · Kredi riski atölyesi (UCI Tayvan kart verisi) | `modul4/09_kredi_riski_atolyesi_tr.ipynb` | [Aç](https://colab.research.google.com/github/mehmetsongur/ml-lab/blob/main/notebooks/modul4/09_kredi_riski_atolyesi_tr.ipynb) |
| Modül 5 · 9 · Boosting ve SHAP atölyesi (UCI Tayvan kart verisi) | `modul5/09_agaclar_shap_atolyesi_tr.ipynb` | [Aç](https://colab.research.google.com/github/mehmetsongur/ml-lab/blob/main/notebooks/modul5/09_agaclar_shap_atolyesi_tr.ipynb) |
| Modül 6 · 9 · Sterlin volatilitesi ve VaR atölyesi (FRED) | `modul6/09_kur_volatilite_atolyesi_tr.ipynb` | [Aç](https://colab.research.google.com/github/mehmetsongur/ml-lab/blob/main/notebooks/modul6/09_kur_volatilite_atolyesi_tr.ipynb) |
| Modül 7 · 9 · Ülke kümeleri ve FOMC tonu atölyesi (Dünya Bankası, FOMC, FRED) | `modul7/09_kumeleme_ve_metin_atolyesi_tr.ipynb` | [Aç](https://colab.research.google.com/github/mehmetsongur/ml-lab/blob/main/notebooks/modul7/09_kumeleme_ve_metin_atolyesi_tr.ipynb) |

### Nasıl çalışır?

- **Kurulum** hücresi veriyi FRED'den (açık, API anahtarı gerektirmez) ya da bu deponun `data/` klasöründen indirir ve kontrol fonksiyonlarını tanımlar.
- **Görev** hücrelerinde kodu öğrenci, Colab'daki Gemini ile üretir ve denetler.
- **Kontrol** hücreleri sonucu bağımsız olarak yeniden hesaplayıp karşılaştırır; geçerse bir tamamlama kodu verir. Öğrenci kodu laboratuvar sitesine yapıştırır.

### Bilinmesi gerekenler

- Colab bir Google hesabı gerektirir. Google'ın duyurularına göre Colab'daki Gemini özellikleri 18 yaş ve üstüne, belirli ülke ve dillerde sunulmaktadır; sınıfta kullanmadan önce deneyin.
- Atölye verisindeki satırlar bilerek karıştırılmıştır: sıralamayı unutan kod (Ünite 6) kontrolden geçmez.
- Tamamlama kodları notebook içinde gizlenmiştir ama şifrelenmemiştir. Bunlar **öz değerlendirme** içindir; sınav güvenliği sağlamaz.
- Gerçek veri zamanla güncellenir; kontroller sabit sayılara değil, indirilen verinin bağımsız yeniden hesabına dayanır.

### Notebook'ları yeniden üretmek

```bash
python3 build_notebooks.py   # Modül 0 / Module 0
python3 build_m1.py           # Modül 1 / Module 1
python3 build_m2.py           # Modül 2 / Module 2
python3 build_m3.py           # Modül 3 / Module 3
python3 build_m4.py           # Modül 4 / Module 4
python3 build_m5.py           # Modül 5 / Module 5
python3 build_m6.py           # Modül 6 / Module 6
python3 build_m7.py           # Modül 7 / Module 7
```

### Lisans

CC BY-NC-SA 4.0 © 2026 Prof. Dr. Mehmet Songur. Veri: Federal Reserve Bank of St. Louis, FRED.

---

## English

The Google Colab + Gemini workshops of ML Lab (Module 0: *Introduction to Economic Analysis with AI*). The notebooks open from the **Open in Colab** buttons on the lab site.

| Unit | Notebook | Colab |
|---|---|---|
| 9 · Colab + Gemini workshop | `module0/09_colab_workshop_en.ipynb` | [Open](https://colab.research.google.com/github/mehmetsongur/ml-lab/blob/main/notebooks/module0/09_colab_workshop_en.ipynb) |
| 10 · Capstone project | `module0/10_capstone_project_en.ipynb` | [Open](https://colab.research.google.com/github/mehmetsongur/ml-lab/blob/main/notebooks/module0/10_capstone_project_en.ipynb) |
| Module 1 · 10 · Data preparation workshop (FRED) | `module1/10_data_preparation_workshop_en.ipynb` | [Open](https://colab.research.google.com/github/mehmetsongur/ml-lab/blob/main/notebooks/module1/10_data_preparation_workshop_en.ipynb) |
| Module 2 · 9 · Forecast evaluation workshop (FRED) | `module2/09_forecast_evaluation_workshop_en.ipynb` | [Open](https://colab.research.google.com/github/mehmetsongur/ml-lab/blob/main/notebooks/module2/09_forecast_evaluation_workshop_en.ipynb) |
| Module 3 · 9 · Inflation forecasting workshop (FRED, 13 series) | `module3/09_inflation_forecasting_workshop_en.ipynb` | [Open](https://colab.research.google.com/github/mehmetsongur/ml-lab/blob/main/notebooks/module3/09_inflation_forecasting_workshop_en.ipynb) |
| Module 4 · 9 · Credit risk workshop (UCI Taiwanese card data) | `module4/09_credit_risk_workshop_en.ipynb` | [Open](https://colab.research.google.com/github/mehmetsongur/ml-lab/blob/main/notebooks/module4/09_credit_risk_workshop_en.ipynb) |
| Module 5 · 9 · Boosting and SHAP workshop (UCI Taiwanese card data) | `module5/09_trees_shap_workshop_en.ipynb` | [Open](https://colab.research.google.com/github/mehmetsongur/ml-lab/blob/main/notebooks/module5/09_trees_shap_workshop_en.ipynb) |
| Module 6 · 9 · Sterling volatility and VaR workshop (FRED) | `module6/09_fx_volatility_workshop_en.ipynb` | [Open](https://colab.research.google.com/github/mehmetsongur/ml-lab/blob/main/notebooks/module6/09_fx_volatility_workshop_en.ipynb) |
| Module 7 · 9 · Country clusters and FOMC tone workshop (World Bank, FOMC, FRED) | `module7/09_clustering_and_text_workshop_en.ipynb` | [Open](https://colab.research.google.com/github/mehmetsongur/ml-lab/blob/main/notebooks/module7/09_clustering_and_text_workshop_en.ipynb) |

### How it works

- The **Setup** cell downloads data from FRED (open, no API key) or from this repository's `data/` folder and defines the check functions.
- In the **Task** cells, students generate code with Gemini in Colab and audit it.
- **Check** cells independently recompute the result and compare; if it passes, they print a completion code that students paste into the lab site.

### Good to know

- Colab requires a Google account. According to Google's announcements, Gemini features in Colab are offered to users aged 18+ in selected countries and languages; try them before using them in class.
- Rows in the workshop data are deliberately shuffled: code that forgets to sort (unit 6) fails the check.
- Completion codes are hidden in the notebook but not encrypted. They are for **self-assessment**, not exam security.
- Real data are updated over time; checks rely on independently recomputing from the downloaded data, not on fixed numbers.

### Rebuilding the notebooks

```bash
python3 build_notebooks.py   # Modül 0 / Module 0
python3 build_m1.py           # Modül 1 / Module 1
python3 build_m2.py           # Modül 2 / Module 2
python3 build_m3.py           # Modül 3 / Module 3
python3 build_m4.py           # Modül 4 / Module 4
python3 build_m5.py           # Modül 5 / Module 5
python3 build_m6.py           # Modül 6 / Module 6
python3 build_m7.py           # Modül 7 / Module 7
```

### Licence

CC BY-NC-SA 4.0 © 2026 Prof. Dr. Mehmet Songur. Data: Federal Reserve Bank of St. Louis, FRED.
