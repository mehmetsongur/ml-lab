/* Modül 7 — Metinden veriye · Üniteler 5–9
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 * "Örnek YZ yanıtları" öğretim amacıyla hazırlanmıştır.
 * Şahin/güvercin sözlüğü öğretim amacıyla hazırlanmıştır; yayımlanmış bir sözlük değildir.
 */
(function () {
  "use strict";
  const D = window.M7_DATA, U = window.M7_UNITS, ln = D.line;
  const TX = D.TX, CHG = D.CHG, DICT = D.DICT;
  const PK = ["numpy", "pandas", "scikit-learn"];
  const FILES = D.F_TX;
  const C0 = { tr: "", en: "" };
  const TONE = {
    tr: `
k = bildiri["text"].str.lower()
s, g = k.map(lambda m: say(m, sahin)), k.map(lambda m: say(m, guvercin))
bildiri["ton"] = (s - g) / (s + g).clip(lower=1)          # −1: tamamen güvercin, +1: tamamen şahin; kelime yoksa 0`,
    en: `
low = stmt["text"].str.lower()
h, d = low.map(lambda m: count(m, hawk)), low.map(lambda m: count(m, dove))
stmt["tone"] = (h - d) / (h + d).clip(lower=1)            # −1: fully dovish, +1: fully hawkish; 0 if no words`
  };
  const LABEL = {
    tr: CHG.tr + `
bildiri["d3"] = bildiri["date"].map(lambda t: degisim(t, 3))      # sonraki 3 ayda faiz değişimi (puan)
bildiri = bildiri.dropna(subset=["d3"]).reset_index(drop=True)
bildiri["y"] = np.select([bildiri["d3"] > 0.1, bildiri["d3"] < -0.1], ["artış", "indirim"], "sabit")`,
    en: CHG.en + `
stmt["d3"] = stmt["date"].map(lambda t: change(t, 3))             # change in the rate over the next 3 months (points)
stmt = stmt.dropna(subset=["d3"]).reset_index(drop=True)
stmt["y"] = np.select([stmt["d3"] > 0.1, stmt["d3"] < -0.1], ["hike", "cut"], "hold")`
  };
  const CLF = {
    tr: `
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import KFold, TimeSeriesSplit, cross_val_score
model = make_pipeline(TfidfVectorizer(stop_words="english", min_df=3, max_df=0.7, ngram_range=(1, 2)),
                      LogisticRegression(max_iter=2000))`,
    en: `
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import KFold, TimeSeriesSplit, cross_val_score
model = make_pipeline(TfidfVectorizer(stop_words="english", min_df=3, max_df=0.7, ngram_range=(1, 2)),
                      LogisticRegression(max_iter=2000))`
  };

  /* =================================================================== */
  /* Ünite 5 — Kelime torbası ve TF-IDF                                     */
  /* =================================================================== */
  U.push({
    id: "m7-u5", minutes: 25, packages: PK, data: FILES,
    title: { tr: "Metni sayıya çevirmek: kelime torbası ve TF-IDF", en: "Turning text into numbers: bag of words and TF-IDF" },
    blurb: { tr: "Merkez bankası açıklamaları piyasaları hareket ettirir. Bir makine öğrenmesi modeli metni okuyamaz; önce sayıya çevirmek gerekir. 2002'den bu yana 201 FOMC açıklamasıyla kelime torbasını ve bir kelimenin bir belge için ne kadar ayırt edici olduğunu ölçen TF-IDF'i kuruyoruz.", en: "Central bank statements move markets. A machine learning model cannot read text; it must first be turned into numbers. With 201 FOMC statements since 2002 we build the bag of words and TF-IDF, which measures how distinctive a word is for a document." },
    terms: [{ tr: "kelime torbası", en: "bag of words" }, { tr: "belge-terim matrisi", en: "document-term matrix" }, { tr: "durak kelimeler (stop words)", en: "stop words" }, { tr: "TF-IDF", en: "TF-IDF" }],
    concept: C0,
    playground: { type: "tfidfPlay", intro: { tr: "Bir FOMC açıklaması seç. En sık geçen kelimelerle TF-IDF'i en yüksek kelimeleri karşılaştır; durak kelimeleri ve belge sıklığı eşiğini değiştir.", en: "Pick an FOMC statement. Compare its most frequent words with its highest-TF-IDF words; change the stop words and the document-frequency threshold." }, takeaway: { tr: "Sayım, her açıklamada geçen kalıp kelimeleri öne çıkarır; TF-IDF o açıklamayı ötekilerden ayıranları.", en: "Counts bring out the boilerplate words found in every statement; TF-IDF brings out the ones that set this statement apart." } },
    cells: [
      {
        id: "m7-u5-c1", kind: "run",
        task: { tr: "FOMC açıklamalarını okuyup her birini kelime sayımlarına çeviriyoruz (kelime torbası). Önce tahmin et.", en: "We read the FOMC statements and turn each into word counts (bag of words). Predict first." },
        predict: { q: { tr: "İngilizce durak kelimeler (the, and, of…) çıkarıldıktan sonra en sık kelime hangisidir?", en: "After removing English stop words (the, and, of…), which word is most frequent?" }, options: { tr: ["inflation", "committee", "rate"], en: ["inflation", "committee", "rate"] }, answer: 1, explain: { tr: "Açıklamaların neredeyse her cümlesi “The Committee …” diye başlar. En sık kelime çoğu zaman en az bilgi taşıyandır.", en: "Almost every sentence of the statements starts with “The Committee …”. The most frequent word is often the least informative." } },
        code: { tr: TX.tr + `
print(f"{len(bildiri)} açıklama, {bildiri['date'].min():%Y-%m} – {bildiri['date'].max():%Y-%m}; ortanca uzunluk {bildiri['words'].median():.0f} kelime")
cv = CountVectorizer(stop_words="english")                # küçük harfe çevirir, kelimelere böler, durak kelimeleri atar
B = cv.fit_transform(bildiri["text"])                     # satır: açıklama, sütun: kelime, hücre: sayım
print("Belge-terim matrisi:", B.shape, f"; hücrelerin %{100 * B.nnz / (B.shape[0] * B.shape[1]):.1f}'i sıfırdan farklı")
frek = pd.Series(np.asarray(B.sum(axis=0)).ravel(), index=cv.get_feature_names_out()).sort_values(ascending=False)
print("En sık 10 kelime:", frek.head(10).to_dict())`, en: TX.en + `
print(f"{len(stmt)} statements, {stmt['date'].min():%Y-%m} – {stmt['date'].max():%Y-%m}; median length {stmt['words'].median():.0f} words")
cv = CountVectorizer(stop_words="english")                # lower-cases, splits into words, drops stop words
B = cv.fit_transform(stmt["text"])                        # row: statement, column: word, cell: count
print("Document-term matrix:", B.shape, f"; {100 * B.nnz / (B.shape[0] * B.shape[1]):.1f}% of cells are non-zero")
freq = pd.Series(np.asarray(B.sum(axis=0)).ravel(), index=cv.get_feature_names_out()).sort_values(ascending=False)
print("Ten most frequent words:", freq.head(10).to_dict())` },
        after: { tr: "201 açıklama, yaklaşık 1.300 farklı kelime. Matrisin büyük çoğunluğu sıfır (seyrek matris): her açıklama sözlüğün küçük bir kısmını kullanır. Kelime torbası kelime sırasını atar: “inflation rose” ile “rose inflation” aynıdır, “not tighten” bile “not” ve “tighten” diye ayrı sayılır. Bu kaba bir temsil ama şaşırtıcı ölçüde işe yarar.", en: "201 statements, about 1,300 distinct words. Most of the matrix is zero (a sparse matrix): each statement uses a small part of the vocabulary. The bag of words throws away word order: “inflation rose” and “rose inflation” are the same, and even “not tighten” is counted as “not” and “tighten” separately. It is a crude representation but works surprisingly well." }
      },
      {
        id: "m7-u5-c2", kind: "run",
        task: { tr: "Üç önemli açıklamanın (Ekim 2008 eşgüdümlü faiz indirimi, Mart 2020 salgın, Mart 2022 ilk artış) en sık kelimeleriyle TF-IDF'i en yüksek kelimelerini karşılaştırıyoruz.", en: "For three important statements (October 2008 coordinated cut, March 2020 pandemic, March 2022 first hike) we compare their most frequent words with their highest-TF-IDF words." },
        code: { tr: TX.tr + `
cv = CountVectorizer(stop_words="english", min_df=3)
B = cv.fit_transform(bildiri["text"])
tv = TfidfVectorizer(stop_words="english", min_df=3)      # min_df=3: en az 3 açıklamada geçen kelimeler
T = tv.fit_transform(bildiri["text"])
kelime = tv.get_feature_names_out()
for g in ["2008-10-08", "2020-03-15", "2022-03-16"]:
    i = bildiri.index[bildiri["date"] == g][0]
    b, w = B[i].toarray().ravel(), T[i].toarray().ravel()
    print(g, "sayım :", [kelime[j] for j in b.argsort()[::-1][:6]])
    print(" " * 10, "TF-IDF:", [kelime[j] for j in w.argsort()[::-1][:6]])`, en: TX.en + `
cv = CountVectorizer(stop_words="english", min_df=3)
B = cv.fit_transform(stmt["text"])
tv = TfidfVectorizer(stop_words="english", min_df=3)      # min_df=3: words found in at least 3 statements
T = tv.fit_transform(stmt["text"])
vocab = tv.get_feature_names_out()
for g in ["2008-10-08", "2020-03-15", "2022-03-16"]:
    i = stmt.index[stmt["date"] == g][0]
    b, w = B[i].toarray().ravel(), T[i].toarray().ravel()
    print(g, "count :", [vocab[j] for j in b.argsort()[::-1][:6]])
    print(" " * 10, "TF-IDF:", [vocab[j] for j in w.argsort()[::-1][:6]])` },
        after: { tr: "Sayımlar üç açıklamada da benzer: committee, inflation, economic. TF-IDF ise her açıklamanın kendine özgü kelimelerini öne çıkarıyor: 2008'de merkez bankaları ve krizin “yoğunlaşması” (eşgüdümlü indirim), 2020'de koronavirüs ve menkul kıymet alımları, 2022'de Ukrayna'nın işgali. “committee” ve “inflation” yine de listede: çok sık geçtikleri için TF değerleri, düşük IDF'lerini telafi ediyor. TF-IDF, bir kelimenin belgedeki sıklığını (TF) bütün belgelerdeki yaygınlığıyla (IDF) cezalandırır: her yerde geçen kelime ayırt edici değildir.", en: "The counts are similar for all three statements: committee, inflation, economic. TF-IDF instead brings out each statement's own words: central banks and the “intensification” of the crisis in 2008 (the coordinated cut), coronavirus and securities purchases in 2020, Ukraine's invasion in 2022. “committee” and “inflation” are still on the lists: they are so frequent that their TF makes up for their low IDF. TF-IDF penalises a word's frequency in the document (TF) by its prevalence across all documents (IDF): a word found everywhere is not distinctive." }
      },
      {
        id: "m7-u5-c3", kind: "fill",
        task: { tr: "Yalnızca en az 3 açıklamada geçen kelimeleri tutan bir TF-IDF matrisi kur ve sözlüğün ne kadar küçüldüğüne bak.", en: "Build a TF-IDF matrix that keeps only words found in at least 3 statements and see how much the vocabulary shrinks." },
        code: { tr: TX.tr + `
tum = TfidfVectorizer(stop_words="english").fit(bildiri["text"])
tv = TfidfVectorizer(stop_words="english", min_df=___)
T = tv.fit_transform(bildiri["text"])
print("Sözlük:", len(tum.vocabulary_), "→", len(tv.vocabulary_), "kelime")`, en: TX.en + `
full = TfidfVectorizer(stop_words="english").fit(stmt["text"])
tv = TfidfVectorizer(stop_words="english", min_df=___)
T = tv.fit_transform(stmt["text"])
print("Vocabulary:", len(full.vocabulary_), "→", len(tv.vocabulary_), "words")` },
        solution: { tr: TX.tr + `
tum = TfidfVectorizer(stop_words="english").fit(bildiri["text"])
tv = TfidfVectorizer(stop_words="english", min_df=3)
T = tv.fit_transform(bildiri["text"])
print("Sözlük:", len(tum.vocabulary_), "→", len(tv.vocabulary_), "kelime")`, en: TX.en + `
full = TfidfVectorizer(stop_words="english").fit(stmt["text"])
tv = TfidfVectorizer(stop_words="english", min_df=3)
T = tv.fit_transform(stmt["text"])
print("Vocabulary:", len(full.vocabulary_), "→", len(tv.vocabulary_), "words")` },
        hints: [{ tr: "<code>min_df</code> bir tam sayıysa “en az bu kadar belgede geçsin” demektir: <code>3</code>.", en: "If <code>min_df</code> is an integer it means “found in at least this many documents”: <code>3</code>." }],
        checks: [{ py: { tr: "tv.min_df == 3 and T.shape[1] == len(tv.vocabulary_)", en: "tv.min_df == 3 and T.shape[1] == len(tv.vocabulary_)" }, msg: { tr: "<code>min_df=3</code> olmalı.", en: "It should be <code>min_df=3</code>." } }],
        after: { tr: "Sözlük 1.296 kelimeden 811'e, üçte bir oranında küçüldü. Atılan kelimelerin çoğu yalnızca bir ya da iki açıklamada geçen adlar, tarihler ve yazım farklılıkları. Nadir kelimeler model için gürültüdür: 201 belgede bir kez geçen bir kelimeden bir şey öğrenilemez. Benzer biçimde <code>max_df</code> çok yaygın kelimeleri atar (Ünite 7).", en: "The vocabulary shrank from 1,296 to 811 words, by about a third. Most of the dropped words are names, dates and spelling variants found in only one or two statements. Rare words are noise for a model: nothing can be learned from a word that appears once in 201 documents. Similarly, <code>max_df</code> drops very common words (Unit 7)." }
      },
      {
        id: "m7-u5-c4", kind: "interpret",
        task: { tr: "YZ, FOMC açıklamalarının TF-IDF temsilini yorumladı. Hangi cümleler yanlış?", en: "The AI interpreted the TF-IDF representation of the FOMC statements. Which sentences are wrong?" },
        prompt: { tr: "FOMC açıklamalarını TF-IDF ile sayıya çevirdim. Bu temsilin güçlü ve zayıf yanları neler?", en: "I turned the FOMC statements into numbers with TF-IDF. What are the strengths and weaknesses of this representation?" },
        sentences: {
          tr: ["TF-IDF, bir açıklamayı ötekilerden ayıran kelimeleri öne çıkarır.", "Kelime torbası kelime sırasını attığı için “not raise” ile “raise” arasındaki farkı tam olarak yakalar.", "TF-IDF bir kelimenin anlamını öğrenir; “tighten” ile “firming”in eş anlamlı olduğunu bilir.", "Sözlüğü küçültmek (min_df, max_df) seçimleri sonuçları etkileyebilir ve raporlanmalıdır."],
          en: ["TF-IDF brings out the words that set a statement apart from the others.", "Since the bag of words drops word order, it fully captures the difference between “not raise” and “raise”.", "TF-IDF learns the meaning of a word; it knows that “tighten” and “firming” are synonyms.", "The choices that shrink the vocabulary (min_df, max_df) can affect the results and should be reported."]
        },
        bad: [1, 2],
        explain: {
          tr: ["Doğru.", "<b>Yanlış:</b> tam tersi: sıra atıldığı için olumsuzluk kaybolur. İki kelimelik dizileri (bigram) eklemek bunu kısmen giderir.", "<b>Yanlış:</b> TF-IDF her kelimeyi ayrı bir sütun olarak görür; anlam benzerliği bilmez. Anlamı yakalamak için kelime gömmeleri ya da dil modelleri gerekir (Ünite 8).", "Doğru."],
          en: ["Correct.", "<b>Wrong:</b> the opposite: since order is dropped, negation is lost. Adding two-word sequences (bigrams) partly fixes this.", "<b>Wrong:</b> TF-IDF sees every word as a separate column; it knows nothing about similarity of meaning. Capturing meaning needs word embeddings or language models (Unit 8).", "Correct."]
        }
      }
    ],
    quiz: [
      { q: { tr: "TF-IDF'te IDF bileşeni neyi cezalandırır?", en: "What does the IDF part of TF-IDF penalise?" }, options: { tr: ["Birçok belgede geçen kelimeleri", "Uzun kelimeleri", "Nadir kelimeleri"], en: ["Words found in many documents", "Long words", "Rare words"] }, answer: 0, explain: { tr: "Her yerde geçen kelime ayırt edici değildir.", en: "A word found everywhere is not distinctive." } },
      { q: { tr: "Kelime torbası neyi kaybeder?", en: "What does the bag of words lose?" }, options: { tr: ["Kelime sırasını", "Kelime sayılarını", "Belge sayısını"], en: ["Word order", "Word counts", "The number of documents"] }, answer: 0, explain: { tr: "Bu yüzden olumsuzluklar kaybolur.", en: "That is why negations are lost." } },
      { q: { tr: "Belge-terim matrisi neden seyrektir?", en: "Why is the document-term matrix sparse?" }, options: { tr: ["Her belge sözlüğün küçük bir kısmını kullanır", "Belgeler kısadır diye sıfırlar eklenir", "TF-IDF sıfır üretir"], en: ["Each document uses a small part of the vocabulary", "Zeros are added because documents are short", "TF-IDF produces zeros"] }, answer: 0, explain: { tr: "Hücrelerin çoğu sıfırdır.", en: "Most cells are zero." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 6 — Sözlükle ton                                                  */
  /* =================================================================== */
  const U6A = {
    tr: TX.tr + DICT.tr.replace(`    return sum(len(re.findall(r"\\b" + k + r"\\b", metin)) for k in kelimeler)     # \\b: kelime sınırı`, `    return sum(metin.count(k) for k in kelimeler)               # kelimeleri say`) + TONE.tr + `
print("Ortalama ton:", round(bildiri["ton"].mean(), 3))
print("Güvercin (ton < 0) açıklamaların payı:", round((bildiri["ton"] < 0).mean(), 3))`,
    en: TX.en + DICT.en.replace(`    return sum(len(re.findall(r"\\b" + w + r"\\b", text)) for w in words)       # \\b: word boundary`, `    return sum(text.count(w) for w in words)                    # count the words`) + TONE.en + `
print("Average tone:", round(stmt["tone"].mean(), 3))
print("Share of dovish (tone < 0) statements:", round((stmt["tone"] < 0).mean(), 3))`
  };
  const REFTONE = {
    tr: `np.allclose(bildiri["ton"], [(len(re.findall(r"\\b(" + "|".join(sahin) + r")\\b", m)) - len(re.findall(r"\\b(" + "|".join(guvercin) + r")\\b", m))) / max(1, len(re.findall(r"\\b(" + "|".join(sahin) + r")\\b", m)) + len(re.findall(r"\\b(" + "|".join(guvercin) + r")\\b", m))) for m in bildiri["text"].str.lower()])`,
    en: `np.allclose(stmt["tone"], [(len(re.findall(r"\\b(" + "|".join(hawk) + r")\\b", m)) - len(re.findall(r"\\b(" + "|".join(dove) + r")\\b", m))) / max(1, len(re.findall(r"\\b(" + "|".join(hawk) + r")\\b", m)) + len(re.findall(r"\\b(" + "|".join(dove) + r")\\b", m))) for m in stmt["text"].str.lower()])`
  };
  U.push({
    id: "m7-u6", minutes: 30, packages: PK, data: FILES,
    title: { tr: "Sözlükle ton: şahin/güvercin endeksi", en: "Tone with a dictionary: a hawkish/dovish index" },
    blurb: { tr: "En basit metin ölçüsü: şahin (sıkılaştırma yanlısı) ve güvercin (gevşetme yanlısı) kelimeleri sayıp bir ton endeksi kurmak. Endeks dönemleri tanıyor ve faiz değişimleriyle ilişkili; ama bu ilişkinin ne kadarı öngörü, ne kadarı açıklamanın kararı duyurması?", en: "The simplest text measure: count hawkish (pro-tightening) and dovish (pro-easing) words and build a tone index. The index recognises the periods and relates to rate changes; but how much of that relation is forecasting, and how much is the statement announcing the decision?" },
    terms: [{ tr: "sözlük yöntemi", en: "dictionary method" }, { tr: "şahin / güvercin", en: "hawkish / dovish" }, { tr: "kelime sınırı", en: "word boundary" }, { tr: "geçerlilik sınaması", en: "validation" }],
    concept: C0,
    playground: { type: "toneDict", intro: { tr: "Şahin ve güvercin listelerinden kelimeleri aç kapa. Yıllık ton endeksinin ve faizle korelasyonunun nasıl değiştiğine bak.", en: "Switch words in the hawkish and dovish lists on and off. See how the annual tone index and its correlation with the rate change." }, takeaway: { tr: "Birkaç kelime endeksi belirgin biçimde değiştirebilir: sözlük seçimi bir modelleme kararıdır ve sonuçla birlikte raporlanmalıdır.", en: "A few words can change the index markedly: the choice of dictionary is a modelling decision and must be reported with the result." } },
    cells: [
      {
        id: "m7-u6-c1", kind: "run",
        task: { tr: "Her açıklama için şahin ve güvercin kelimelerini sayıp ton = (şahin − güvercin) / (şahin + güvercin) endeksini kuruyoruz ve yıllık ortalamasını federal fon oranının yıllık ortalamasıyla yan yana koyuyoruz.", en: "For every statement we count hawkish and dovish words, build the index tone = (hawkish − dovish) / (hawkish + dovish) and put its annual average next to the annual average federal funds rate." },
        code: { tr: TX.tr + DICT.tr + TONE.tr + `
print("Şahin ve güvercin kelimesi hiç olmayan açıklama:", int(((s + g) == 0).sum()))
yil = bildiri.groupby(bildiri["date"].dt.year)["ton"].mean()
fy = faiz.groupby(faiz.index.year).mean().reindex(yil.index)
print(pd.DataFrame({"ton": yil.round(2), "faiz": fy.round(2)}).T.to_string())`, en: TX.en + DICT.en + TONE.en + `
print("Statements with no hawkish or dovish word:", int(((h + d) == 0).sum()))
yr = stmt.groupby(stmt["date"].dt.year)["tone"].mean()
fy = ff.groupby(ff.index.year).mean().reindex(yr.index)
print(pd.DataFrame({"tone": yr.round(2), "rate": fy.round(2)}).T.to_string())` },
        after: { tr: "Endeks dönemleri tanıyor: 2004–2006 faiz artışlarında ton güvercinden şahine dönüyor (2006: 1,0), 2009–2014 sıfır faiz yıllarında güçlü biçimde güvercin (−0,5 ile −0,7), 2022–2023 enflasyonla mücadelede yeniden şahin. On iki kelimelik iki listeyle bu kadarını yakalamak dikkat çekici. Ama bir endeksin “mantıklı görünmesi” yeterli değil; bir sonraki hücrede sayısal olarak sınayacağız.", en: "The index recognises the periods: during the 2004–2006 hikes the tone turns from dovish to hawkish (2006: 1.0), in the 2009–2014 zero-rate years it is strongly dovish (−0.5 to −0.7), and in the 2022–2023 fight against inflation hawkish again. Capturing this much with two lists of twelve words is striking. But an index “looking sensible” is not enough; in the next cell we test it numerically." }
      },
      {
        id: "m7-u6-c2", kind: "run",
        task: { tr: "Endeksi sınıyoruz: tonun, açıklamadan sonraki 1, 3, 6 ve 12 ayda faizdeki değişimle korelasyonu. Karşılaştırma için tonun açıklamadan önceki 3 aydaki değişimle korelasyonuna da bakıyoruz. Önce tahmin et.", en: "We test the index: the correlation of tone with the change in the rate over the 1, 3, 6 and 12 months after the statement. For comparison we also look at its correlation with the change over the 3 months before the statement. Predict first." },
        predict: { q: { tr: "Korelasyon hangi ufukta en yüksektir?", en: "At which horizon is the correlation highest?" }, options: { tr: ["1 ay", "6 ay", "12 ay"], en: ["1 month", "6 months", "12 months"] }, answer: 0, explain: { tr: "Açıklama, o toplantının kararını da duyurur: faiz artırılınca metin “raise” der. En kısa ufuk bu eşzamanlı bilgiyi içerir; ufuk uzadıkça ilişki zayıflar.", en: "The statement also announces that meeting's decision: when the rate is raised the text says “raise”. The shortest horizon contains this simultaneous information; as the horizon grows the relation weakens." } },
        code: { tr: TX.tr + DICT.tr + TONE.tr + CHG.tr + `
for m in [1, 3, 6, 12]:
    d = bildiri["date"].map(lambda t: degisim(t, m))
    print(f"Sonraki {m:2d} ay: korelasyon {bildiri['ton'].corr(d):6.3f}")
once = bildiri["date"].map(lambda t: faiz.asof(t.replace(day=1)) - faiz.asof((t - pd.DateOffset(months=3)).replace(day=1)))
print(f"Önceki  3 ay: korelasyon {bildiri['ton'].corr(once):6.3f}")`, en: TX.en + DICT.en + TONE.en + CHG.en + `
for m in [1, 3, 6, 12]:
    c = stmt["date"].map(lambda t: change(t, m))
    print(f"Next {m:2d} months:  correlation {stmt['tone'].corr(c):6.3f}")
before = stmt["date"].map(lambda t: ff.asof(t.replace(day=1)) - ff.asof((t - pd.DateOffset(months=3)).replace(day=1)))
print(f"Previous 3 months: correlation {stmt['tone'].corr(before):6.3f}")` },
        after: { tr: "Korelasyon 1 ayda 0,31, 3 ayda 0,23, 6 ayda 0,17, 12 ayda neredeyse sıfır. Açıklamadan <i>önceki</i> 3 aydaki değişimle korelasyon (0,32) ise sonraki ufukların hepsinden yüksek: ton büyük ölçüde <b>geçmişi ve kararın kendisini</b> anlatıyor. Bu bir başarısızlık değil, ölçtüğümüz şeyin tanımı: sözlük endeksi Fed'in o günkü duruşunu ölçüyor. Geleceği öngörüp öngörmediği ayrı ve daha zor bir soru.", en: "The correlation is 0.31 at 1 month, 0.23 at 3, 0.17 at 6 and almost zero at 12. The correlation with the change over the 3 months <i>before</i> the statement (0.32) is higher than at any later horizon: the tone largely describes <b>the past and the decision itself</b>. That is not a failure but the definition of what we measure: the dictionary index measures the Fed's stance on the day. Whether it forecasts the future is a separate and harder question." }
      },
      {
        id: "m7-u6-c3", kind: "audit",
        task: { tr: "YZ ton endeksini kendi sayma fonksiyonuyla kurdu. Hatalı satırı bul ve düzelt: kelimeler kelime sınırlarıyla (<code>re.findall(r\"\\b\" + k + r\"\\b\", metin)</code>) sayılsın.", en: "The AI built the tone index with its own counting function. Find the faulty line and fix it: words should be counted with word boundaries (<code>re.findall(r\"\\b\" + w + r\"\\b\", text)</code>)." },
        ai: {
          prompt: { tr: "Şahin ve güvercin listeleriyle FOMC açıklamalarının tonunu hesapla ve ortalama tonu raporla.", en: "Compute the tone of the FOMC statements with the hawkish and dovish lists and report the average tone." },
          reply: { tr: "Her kelimenin metinde kaç kez geçtiğini sayalım:", en: "Let us count how many times each word appears in the text:" },
          code: U6A,
          claim: { tr: "Ortalama ton sıfıra çok yakın (0,04) ve açıklamaların yarısından fazlası güvercin: Fed 2002'den bu yana dengeli, hafif gevşek bir dil kullanmış.", en: "The average tone is very close to zero (0.04) and more than half of the statements are dovish: since 2002 the Fed has used a balanced, slightly easy language." }
        },
        bugLines: [ln(U6A.tr, "metin.count(k)")],
        lineExplain: { tr: "<code>str.count</code> kelime değil karakter dizisi sayar: “ease”, “incr<b>ease</b>”, “decr<b>ease</b>” ve “rel<b>ease</b>” içinde; “lower”, “s<b>lower</b>” içinde de bulunur. Her “increase” hem şahin hem güvercin sayılır. Kelime sınırı <code>\\b</code> yalnızca tam kelimeleri eşleştirir: <code>return sum(len(re.findall(r\"\\b\" + k + r\"\\b\", metin)) for k in kelimeler)</code>.", en: "<code>str.count</code> counts character strings, not words: “ease” is found inside “incr<b>ease</b>”, “decr<b>ease</b>” and “rel<b>ease</b>”; “lower” inside “s<b>lower</b>”. Every “increase” is counted as both hawkish and dovish. The word boundary <code>\\b</code> matches whole words only: <code>return sum(len(re.findall(r\"\\b\" + w + r\"\\b\", text)) for w in words)</code>." },
        hints: [{ tr: "Satırı <code>    return sum(len(re.findall(r\"\\b\" + k + r\"\\b\", metin)) for k in kelimeler)</code> yap.", en: "Make the line <code>    return sum(len(re.findall(r\"\\b\" + w + r\"\\b\", text)) for w in words)</code>." }],
        solution: { tr: TX.tr + DICT.tr + TONE.tr + `
print("Ortalama ton:", round(bildiri["ton"].mean(), 3))
print("Güvercin (ton < 0) açıklamaların payı:", round((bildiri["ton"] < 0).mean(), 3))`, en: TX.en + DICT.en + TONE.en + `
print("Average tone:", round(stmt["tone"].mean(), 3))
print("Share of dovish (tone < 0) statements:", round((stmt["tone"] < 0).mean(), 3))` },
        checks: [{ py: REFTONE, msg: { tr: "<code>ton</code>, kelime sınırlarıyla sayılan şahin ve güvercin kelimelerinden hesaplanmalı.", en: "<code>tone</code> should be computed from hawkish and dovish words counted with word boundaries." } }],
        after: { tr: "Doğru sayımla ortalama ton 0,13 ve açıklamaların %40'ı güvercin. “Dengeli, hafif gevşek dil” sonucu, “increase” kelimesinin her geçişinde güvercin listesine bir sahte “ease” eklenmesinden çıkmıştı. Metin verisinde bu tür hatalar sessizdir: kod çalışır, sayılar makul görünür. Bir sözlük endeksini kurarken eşleşen kelimelerden rastgele örneklere bakmak en iyi denetimdir.", en: "With correct counting the average tone is 0.13 and 40% of the statements are dovish. The result “balanced, slightly easy language” came from adding a fake “ease” to the dovish list at every occurrence of “increase”. In text data such errors are silent: the code runs and the numbers look reasonable. When building a dictionary index, looking at random examples of the matched words is the best audit." }
      },
      {
        id: "m7-u6-c4", kind: "interpret",
        task: { tr: "YZ ton endeksini bir yatırım raporu için yorumladı. Hangi cümleler yanlış?", en: "The AI interpreted the tone index for an investment report. Which sentences are wrong?" },
        prompt: { tr: "Sözlük tabanlı FOMC ton endeksim faizdeki 1 aylık değişimle 0,31, 12 aylık değişimle sıfır korelasyonlu. Bunu raporda nasıl yorumlarım?", en: "My dictionary-based FOMC tone index has a correlation of 0.31 with the 1-month change in the rate and zero with the 12-month change. How do I interpret this in a report?" },
        sentences: {
          tr: ["Endeks Fed'in açıklama günündeki duruşunu ölçüyor; kısa vadeli ilişkinin bir kısmı kararın açıklamada duyurulmasından geliyor.", "Ton endeksi bir yıl sonraki faiz patikasını öngörmek için güvenilir bir araçtır.", "“increase” gibi kelimeler bağlama göre şahin de (“increase the target range”) nötr de (“increase in unemployment”) olabilir; sözlük bu ayrımı yapamaz.", "Sözlük öğretim amaçlı hazırlandığı için sonuçlar yayımlanmış bir sözlükle (örneğin finans literatüründeki sözlüklerle) karşılaştırılmalıdır."],
          en: ["The index measures the Fed's stance on the day of the statement; part of the short-term relation comes from the decision being announced in the statement.", "The tone index is a reliable tool for forecasting the rate path a year ahead.", "Words such as “increase” can be hawkish (“increase the target range”) or neutral (“increase in unemployment”) depending on context; the dictionary cannot make this distinction.", "Since the dictionary was prepared for teaching, the results should be compared with a published dictionary (for example those in the finance literature)."]
        },
        bad: [1],
        explain: {
          tr: ["Doğru.", "<b>Yanlış:</b> 12 aylık değişimle korelasyon sıfır. Endeks bugünkü duruşu betimliyor; bir yıllık öngörü gücü göstermiyor.", "Doğru: bağlamı kaçırmak sözlük yönteminin temel zayıflığıdır.", "Doğru."],
          en: ["Correct.", "<b>Wrong:</b> the correlation with the 12-month change is zero. The index describes today's stance; it shows no forecasting power a year ahead.", "Correct: missing context is the main weakness of the dictionary method.", "Correct."]
        }
      }
    ],
    quiz: [
      { q: { tr: "Sözlük yönteminin en büyük avantajı nedir?", en: "What is the main advantage of the dictionary method?" }, options: { tr: ["Şeffaf ve tekrarlanabilir: hangi kelimenin neden sayıldığı açıktır", "Bağlamı anlar", "Etiketli veri ister"], en: ["Transparent and reproducible: it is clear which word is counted and why", "It understands context", "It needs labelled data"] }, answer: 0, explain: { tr: "Ama bağlamı kaçırır.", en: "But it misses context." } },
      { q: { tr: "<code>\"ease\" in \"increase\"</code> neden <code>True</code> döner?", en: "Why does <code>\"ease\" in \"increase\"</code> return <code>True</code>?" }, options: { tr: ["Karakter dizisi araması kelime sınırlarına bakmaz", "Python büyük-küçük harf ayırmaz", "increase bir şahin kelimesidir"], en: ["A substring search ignores word boundaries", "Python is not case sensitive", "increase is a hawkish word"] }, answer: 0, explain: { tr: "Çözüm: <code>\\b</code>.", en: "The fix: <code>\\b</code>." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 7 — Konu modelleri                                                */
  /* =================================================================== */
  const NMFP = {
    tr: `
from sklearn.decomposition import NMF
def konular(T, kelime, k=5):
    nmf = NMF(n_components=k, init="nndsvda", random_state=0, max_iter=800)
    W = nmf.fit_transform(T)                                  # açıklama × konu ağırlıkları
    for j, c in enumerate(nmf.components_):                   # konu × kelime ağırlıkları
        print(f"Konu {j}:", ", ".join(kelime[i] for i in c.argsort()[::-1][:7]))
    return W`,
    en: `
from sklearn.decomposition import NMF
def topics(T, vocab, k=5):
    nmf = NMF(n_components=k, init="nndsvda", random_state=0, max_iter=800)
    W = nmf.fit_transform(T)                                  # statement × topic weights
    for j, c in enumerate(nmf.components_):                   # topic × word weights
        print(f"Topic {j}:", ", ".join(vocab[i] for i in c.argsort()[::-1][:7]))
    return W`
  };
  U.push({
    id: "m7-u7", minutes: 25, packages: PK, data: FILES,
    title: { tr: "Konu modelleri: açıklamalardaki temalar", en: "Topic models: themes in the statements" },
    blurb: { tr: "Konu modelleri, etiket olmadan belgelerdeki temaları bulur: her belge birkaç konunun karışımı, her konu bir kelime dağılımıdır. FOMC açıklamalarında bulunan “konular” ekonomik temalardan çok Fed'in iletişim dönemleri: kalıp metnin değiştiği anlar.", en: "Topic models find themes in documents without labels: each document is a mix of a few topics, each topic a distribution over words. The “topics” found in the FOMC statements are less economic themes than the Fed's communication eras: the moments the boilerplate changed." },
    terms: [{ tr: "konu modeli", en: "topic model" }, { tr: "NMF (negatif olmayan matris ayrıştırma)", en: "NMF (non-negative matrix factorisation)" }, { tr: "LDA", en: "LDA" }, { tr: "max_df", en: "max_df" }],
    concept: C0,
    playground: { type: "topicEras", intro: { tr: "Konu sayısını seç; her konunun en önemli kelimelerine ve konuların yıllara göre payına bak.", en: "Choose the number of topics; look at each topic's most important words and the topics' shares by year." }, takeaway: { tr: "Konular zamanda bloklar hâlinde değişiyor: model kelime seçimindeki dönem farklarını yakalıyor. Konulara ad vermek bir yorumdur.", en: "The topics change over time in blocks: the model picks up era differences in word choice. Naming the topics is an interpretation." } },
    cells: [
      {
        id: "m7-u7-c1", kind: "run",
        task: { tr: "TF-IDF matrisini NMF ile beş konuya ayırıyoruz ve her konunun en ağır yedi kelimesine bakıyoruz.", en: "We split the TF-IDF matrix into five topics with NMF and look at each topic's seven heaviest words." },
        code: { tr: TX.tr + NMFP.tr + `
tv = TfidfVectorizer(stop_words="english", min_df=3, ngram_range=(1, 2))
T = tv.fit_transform(bildiri["text"])
W = konular(T, tv.get_feature_names_out())`, en: TX.en + NMFP.en + `
tv = TfidfVectorizer(stop_words="english", min_df=3, ngram_range=(1, 2))
T = tv.fit_transform(stmt["text"])
W = topics(T, tv.get_feature_names_out())` },
        after: { tr: "Konuların neredeyse hepsi “committee” ve “inflation” ile başlıyor: her açıklamada geçen kelimeler bütün konulara sızıyor ve konuları birbirine benzetiyor. İngilizce durak kelime listesi genel bir listedir; bu metin türünün kendine özgü “durak kelimeleri” (committee, federal, percent) var.", en: "Almost all topics start with “committee” and “inflation”: words found in every statement leak into all topics and make them look alike. The English stop-word list is generic; this type of text has its own “stop words” (committee, federal, percent)." }
      },
      {
        id: "m7-u7-c2", kind: "fill",
        task: { tr: "Açıklamaların %70'inden fazlasında geçen kelimeleri at (<code>max_df</code>) ve konuları yeniden kur.", en: "Drop words found in more than 70% of the statements (<code>max_df</code>) and rebuild the topics." },
        code: { tr: TX.tr + NMFP.tr + `
tv = TfidfVectorizer(stop_words="english", min_df=3, max_df=___, ngram_range=(1, 2))
T = tv.fit_transform(bildiri["text"])
W = konular(T, tv.get_feature_names_out())
print("'committee' sözlükte mi?", "committee" in tv.vocabulary_)`, en: TX.en + NMFP.en + `
tv = TfidfVectorizer(stop_words="english", min_df=3, max_df=___, ngram_range=(1, 2))
T = tv.fit_transform(stmt["text"])
W = topics(T, tv.get_feature_names_out())
print("Is 'committee' in the vocabulary?", "committee" in tv.vocabulary_)` },
        solution: { tr: TX.tr + NMFP.tr + `
tv = TfidfVectorizer(stop_words="english", min_df=3, max_df=0.7, ngram_range=(1, 2))
T = tv.fit_transform(bildiri["text"])
W = konular(T, tv.get_feature_names_out())
print("'committee' sözlükte mi?", "committee" in tv.vocabulary_)`, en: TX.en + NMFP.en + `
tv = TfidfVectorizer(stop_words="english", min_df=3, max_df=0.7, ngram_range=(1, 2))
T = tv.fit_transform(stmt["text"])
W = topics(T, tv.get_feature_names_out())
print("Is 'committee' in the vocabulary?", "committee" in tv.vocabulary_)` },
        hints: [{ tr: "<code>max_df</code> 0 ile 1 arasında bir sayıysa belge oranıdır: <code>0.7</code>.", en: "If <code>max_df</code> is a number between 0 and 1 it is a share of documents: <code>0.7</code>." }],
        checks: [{ py: { tr: "tv.max_df == 0.7 and 'committee' not in tv.vocabulary_", en: "tv.max_df == 0.7 and 'committee' not in tv.vocabulary_" }, msg: { tr: "<code>max_df=0.7</code> olmalı.", en: "It should be <code>max_df=0.7</code>." } }],
        after: { tr: "Konular şimdi belirgin: biri menkul kıymet alımları ve “agency mortgage” (parasal genişleme), biri “committee believes … sustainable growth” (2000'lerin ilk yarısının dili), biri salgın dönemi (ekonomiyi destekleme, hanehalklarına kredi akışı), biri “goals … stance of monetary policy” (2020'lerin dili). Bunlar ekonomik konular mı, yoksa iletişim dönemleri mi? Bir sonraki hücre bunu yıllara göre gösteriyor.", en: "The topics are now distinct: one is securities purchases and “agency mortgage” (quantitative easing), one is “committee believes … sustainable growth” (the language of the early 2000s), one the pandemic period (supporting the economy, the flow of credit to households), one “goals … stance of monetary policy” (the language of the 2020s). Are these economic topics, or communication eras? The next cell shows it by year." }
      },
      {
        id: "m7-u7-c3", kind: "run",
        task: { tr: "Her açıklamaya ağırlığı en büyük konuyu (baskın konu) atayıp konuların hangi yıllarda baskın olduğuna bakıyoruz.", en: "We assign each statement the topic with the largest weight (dominant topic) and look at the years in which each topic dominates." },
        code: { tr: TX.tr + NMFP.tr + `
tv = TfidfVectorizer(stop_words="english", min_df=3, max_df=0.7, ngram_range=(1, 2))
T = tv.fit_transform(bildiri["text"])
W = konular(T, tv.get_feature_names_out())
bildiri["konu"] = W.argmax(axis=1)
print()
for j, g in bildiri.groupby("konu"):
    print(f"Konu {j}: {len(g):3d} açıklama, {g['date'].min():%Y-%m} – {g['date'].max():%Y-%m}")`, en: TX.en + NMFP.en + `
tv = TfidfVectorizer(stop_words="english", min_df=3, max_df=0.7, ngram_range=(1, 2))
T = tv.fit_transform(stmt["text"])
W = topics(T, tv.get_feature_names_out())
stmt["topic"] = W.argmax(axis=1)
print()
for j, g in stmt.groupby("topic"):
    print(f"Topic {j}: {len(g):3d} statements, {g['date'].min():%Y-%m} – {g['date'].max():%Y-%m}")` },
        after: { tr: "Her konu neredeyse kesintisiz bir dönem: 2002–2008, 2009–2015, 2015 sonu–2019, 2020–2021 (birkaç istisnayla) ve 2022 sonrası. Konu modeli, Fed'in açıklama şablonunu ne zaman değiştirdiğini buldu: Bernanke ve sıfır faiz, normalleşme, salgın, enflasyonla mücadele. Bu değerli bir keşif (iletişim tarihinin otomatik bir dökümü) ama “Fed hangi ekonomik konuyu ne kadar konuştu?” sorusunun yanıtı değil. Modelin bulduğu yapı, sorduğumuz soruyla aynı olmayabilir.", en: "Each topic is an almost continuous era: 2002–2008, 2009–2015, late 2015–2019, 2020–2021 (with a few exceptions) and after 2022. The topic model found when the Fed changed its statement template: Bernanke and zero rates, normalisation, the pandemic, the fight against inflation. That is a valuable discovery (an automatic record of communication history) but not the answer to “how much did the Fed talk about which economic topic?”. The structure the model finds may not be the question we asked." }
      },
      {
        id: "m7-u7-c4", kind: "interpret",
        task: { tr: "YZ konu modelinin sonuçlarını yorumladı. Hangi cümleler yanlış?", en: "The AI interpreted the topic model's results. Which sentences are wrong?" },
        prompt: { tr: "FOMC açıklamalarında NMF ile beş konu buldum; her konu bir döneme denk geliyor. Bunu nasıl yorumlarım?", en: "I found five topics in the FOMC statements with NMF; each topic matches a period. How do I interpret this?" },
        sentences: {
          tr: ["Konular, açıklamaların kalıp dilindeki dönemsel değişiklikleri yakalıyor.", "Beş konu bulunduğuna göre Fed'in gerçekten beş politika teması vardır.", "Konu sayısı, durak kelimeler ve max_df gibi seçimler bulunan konuları değiştirir; sonuçlar bu seçimlerle birlikte raporlanmalıdır.", "Konulara verilen adlar (örneğin “parasal genişleme”) modelin değil, araştırmacının yorumudur."],
          en: ["The topics capture era changes in the boilerplate language of the statements.", "Since five topics were found, the Fed really has five policy themes.", "Choices such as the number of topics, the stop words and max_df change the topics found; the results should be reported with these choices.", "The names given to topics (for example “quantitative easing”) are the researcher's interpretation, not the model's."]
        },
        bad: [1],
        explain: {
          tr: ["Doğru.", "<b>Yanlış:</b> konu sayısını biz seçtik (k = 5). Model her k için o kadar konu bulur; “gerçek” konu sayısı veriden çıkmaz.", "Doğru.", "Doğru."],
          en: ["Correct.", "<b>Wrong:</b> we chose the number of topics (k = 5). The model finds that many topics for any k; the “true” number of topics does not come out of the data.", "Correct.", "Correct."]
        }
      }
    ],
    quiz: [
      { q: { tr: "NMF, TF-IDF matrisini hangi iki matrisin çarpımına ayırır?", en: "NMF factorises the TF-IDF matrix into the product of which two matrices?" }, options: { tr: ["Belge × konu ve konu × kelime", "Kelime × kelime ve belge × belge", "Eğitim ve test"], en: ["Document × topic and topic × word", "Word × word and document × document", "Training and test"] }, answer: 0, explain: { tr: "Hepsi negatif olmayan sayılardır.", en: "All entries are non-negative." } },
      { q: { tr: "<code>max_df=0.7</code> ne yapar?", en: "What does <code>max_df=0.7</code> do?" }, options: { tr: ["Belgelerin %70'inden fazlasında geçen kelimeleri atar", "En sık %70 kelimeyi tutar", "Belgelerin %70'ini atar"], en: ["Drops words found in more than 70% of documents", "Keeps the most frequent 70% of words", "Drops 70% of the documents"] }, answer: 0, explain: { tr: "Metne özgü durak kelimeleri temizler.", en: "It removes text-specific stop words." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 8 — Metin sınıflandırma ve dil modelleri                         */
  /* =================================================================== */
  U.push({
    id: "m7-u8", minutes: 30, packages: PK, data: FILES,
    title: { tr: "Metin sınıflandırma ve büyük dil modelleri", en: "Text classification and large language models" },
    blurb: { tr: "Bir açıklamanın metninden sonraki üç ayda faizin artıp artmayacağını öngörebilir miyiz? Rastgele çapraz doğrulama %81 doğruluk vaat ediyor; zamana saygılı bölmede model “hep sabit” demekten öteye geçemiyor. Aynı tuzak, metinleri bir büyük dil modeline (LLM) sınıflandırtırken daha sinsi bir biçimde karşımıza çıkar.", en: "Can we forecast from a statement's text whether the rate will rise over the next three months? Random cross-validation promises 81% accuracy; with a time-respecting split the model cannot do better than saying “always hold”. The same trap appears in a sneakier form when a large language model (LLM) classifies the texts." },
    terms: [{ tr: "metin sınıflandırma", en: "text classification" }, { tr: "büyük dil modeli (LLM)", en: "large language model (LLM)" }, { tr: "sıfır atışlı sınıflandırma", en: "zero-shot classification" }, { tr: "ileriye bakma yanlılığı", en: "look-ahead bias" }],
    concept: C0,
    playground: { type: "labelAudit", intro: { tr: "Bir LLM'in etiketlerini insan etiketleriyle karşılaştırmak için kaç açıklamayı elle etiketlemen gerekir? LLM'in gerçek doğruluğunu ve örneklem büyüklüğünü değiştir; tahminin belirsizliğine bak.", en: "How many statements do you need to label by hand to compare an LLM's labels with human labels? Change the LLM's true accuracy and the sample size; look at the uncertainty of the estimate." }, takeaway: { tr: "20 elle etiketlenmiş örnekle doğruluk tahmini yaklaşık ±18 puan oynar. Bir LLM'in etiketlerine güvenmek için yeterince büyük, önceden ayrılmış bir insan etiketli örneklem gerekir.", en: "With 20 hand-labelled examples the accuracy estimate swings by about ±18 points. Trusting an LLM's labels needs a large enough, set-aside human-labelled sample." } },
    cells: [
      {
        id: "m7-u8-c1", kind: "run",
        task: { tr: "Her açıklamayı sonraki üç aydaki faiz değişimine göre etiketliyoruz (artış, indirim, sabit) ve TF-IDF + lojistik regresyonu rastgele 5 katlı çapraz doğrulamayla değerlendiriyoruz.", en: "We label every statement by the rate change over the next three months (hike, cut, hold) and evaluate TF-IDF + logistic regression with random 5-fold cross-validation." },
        code: { tr: TX.tr + LABEL.tr + CLF.tr + `
print("Etiketler:", bildiri["y"].value_counts().to_dict())
skor = cross_val_score(model, bildiri["text"], bildiri["y"], cv=KFold(5, shuffle=True, random_state=0))
print(f"Rastgele 5 katlı çapraz doğrulama: doğruluk {skor.mean():.3f}")
print(f"Hep 'sabit' demek             : doğruluk {(bildiri['y'] == 'sabit').mean():.3f}")`, en: TX.en + LABEL.en + CLF.en + `
print("Labels:", stmt["y"].value_counts().to_dict())
score = cross_val_score(model, stmt["text"], stmt["y"], cv=KFold(5, shuffle=True, random_state=0))
print(f"Random 5-fold cross-validation: accuracy {score.mean():.3f}")
print(f"Always saying 'hold'          : accuracy {(stmt['y'] == 'hold').mean():.3f}")` },
        after: { tr: "Rastgele çapraz doğrulamada doğruluk 0,81; “hep sabit” demek 0,53. Metin, gelecekteki faiz hareketini bu kadar iyi mi öngörüyor? Modül 6'yı hatırla: ardışık açıklamalar neredeyse aynı metindir ve aynı faiz döngüsüne denk gelir. Rastgele bölmede model, test açıklamasının bir ay önceki ve sonraki kardeşlerini eğitimde görüyor.", en: "With random cross-validation the accuracy is 0.81; saying “always hold” gives 0.53. Does the text forecast future rate moves this well? Remember Module 6: consecutive statements are almost the same text and fall in the same rate cycle. In a random split the model sees in training the test statement's siblings from a month before and after." }
      },
      {
        id: "m7-u8-c2", kind: "run",
        task: { tr: "Aynı modeli 2015 öncesi açıklamalarla kurup 2015 ve sonrasında sınıyoruz. Önce tahmin et.", en: "We fit the same model on statements before 2015 and test it from 2015 on. Predict first." },
        predict: { q: { tr: "Zamana saygılı test doğruluğu ne olur?", en: "What will the time-respecting test accuracy be?" }, options: { tr: ["Yine 0,85 civarı", "0,65 civarı", "“Hep sabit” demekten daha iyi değil"], en: ["Again about 0.85", "About 0.65", "No better than saying “always hold”"] }, answer: 2, explain: { tr: "2015 sonrası açıklamalar, eğitimdeki metinlerden farklı bir dil kullanır (Ünite 7'deki dönemler). Model eğitimde ezberlediği dönem kelimelerini testte bulamaz.", en: "Statements after 2015 use a language different from the training texts (the eras of Unit 7). The model cannot find in the test the era words it memorised in training." } },
        code: { tr: TX.tr + LABEL.tr + CLF.tr + `
egt = bildiri["date"] < "2015-01-01"
model.fit(bildiri.loc[egt, "text"], bildiri.loc[egt, "y"])
tah = model.predict(bildiri.loc[~egt, "text"])
print(f"Test (2015–): doğruluk {(tah == bildiri.loc[~egt, 'y']).mean():.3f}; hep 'sabit': {(bildiri.loc[~egt, 'y'] == 'sabit').mean():.3f}")
print("Test etiketleri :", bildiri.loc[~egt, "y"].value_counts().to_dict())
print("Model tahminleri:", pd.Series(tah).value_counts().to_dict())
lr, tv = model[-1], model[0]
j = list(lr.classes_).index("artış")
print("'artış' için en güçlü kelimeler:", [tv.get_feature_names_out()[i] for i in lr.coef_[j].argsort()[::-1][:8]])`, en: TX.en + LABEL.en + CLF.en + `
trn = stmt["date"] < "2015-01-01"
model.fit(stmt.loc[trn, "text"], stmt.loc[trn, "y"])
pred = model.predict(stmt.loc[~trn, "text"])
print(f"Test (2015–): accuracy {(pred == stmt.loc[~trn, 'y']).mean():.3f}; always 'hold': {(stmt.loc[~trn, 'y'] == 'hold').mean():.3f}")
print("Test labels     :", stmt.loc[~trn, "y"].value_counts().to_dict())
print("Model predictions:", pd.Series(pred).value_counts().to_dict())
lr, tv = model[-1], model[0]
j = list(lr.classes_).index("hike")
print("Strongest words for 'hike':", [tv.get_feature_names_out()[i] for i in lr.coef_[j].argsort()[::-1][:8]])` },
        after: { tr: "Test doğruluğu, “hep sabit” demekle aynı. Model 2015 sonrasında 96 açıklamanın hepsine “sabit” diyor. “Artış” için en güçlü kelimeler ya o toplantının kararını duyuran ifadeler (“raise target”, “today raise”) ya da 2000'lerin kalıp dili (“contained”). Yeni dönemin açıklamaları başka kelimelerle yazıldığı için model onları tanımıyor. Rastgele bölmedeki 0,81, metnin geleceği öngördüğünü değil, aynı döneme ait kardeş açıklamaların birbirine benzediğini gösteriyordu.", en: "The test accuracy equals saying “always hold”. After 2015 the model says “hold” for all 96 statements. The strongest words for “hike” are either phrases announcing that meeting's decision (“raise target”, “today raise”) or the boilerplate of the 2000s (“contained”). The new era's statements are written with other words, so the model does not recognise them. The 0.81 under a random split showed not that the text forecasts the future but that sibling statements from the same era resemble each other." }
      },
      {
        id: "m7-u8-c3", kind: "fill",
        task: { tr: "Zamana saygılı 5 katlı çapraz doğrulamayla (<code>TimeSeriesSplit</code>) ortalama doğruluğu hesapla. Açıklamalar tarih sırasında.", en: "Compute the average accuracy with time-respecting 5-fold cross-validation (<code>TimeSeriesSplit</code>). The statements are in date order." },
        code: { tr: TX.tr + LABEL.tr + CLF.tr + `
cv = TimeSeriesSplit(n_splits=___)
skor = cross_val_score(model, bildiri["text"], bildiri["y"], cv=cv)
print("Katlar:", skor.round(3).tolist(), "ortalama:", round(skor.mean(), 3))`, en: TX.en + LABEL.en + CLF.en + `
cv = TimeSeriesSplit(n_splits=___)
score = cross_val_score(model, stmt["text"], stmt["y"], cv=cv)
print("Folds:", score.round(3).tolist(), "mean:", round(score.mean(), 3))` },
        solution: { tr: TX.tr + LABEL.tr + CLF.tr + `
cv = TimeSeriesSplit(n_splits=5)
skor = cross_val_score(model, bildiri["text"], bildiri["y"], cv=cv)
print("Katlar:", skor.round(3).tolist(), "ortalama:", round(skor.mean(), 3))`, en: TX.en + LABEL.en + CLF.en + `
cv = TimeSeriesSplit(n_splits=5)
score = cross_val_score(model, stmt["text"], stmt["y"], cv=cv)
print("Folds:", score.round(3).tolist(), "mean:", round(score.mean(), 3))` },
        hints: [{ tr: "Beş kat: <code>5</code>.", en: "Five folds: <code>5</code>." }],
        checks: [{ py: { tr: "cv.n_splits == 5 and len(skor) == 5", en: "cv.n_splits == 5 and len(score) == 5" }, msg: { tr: "<code>TimeSeriesSplit(n_splits=5)</code> olmalı.", en: "It should be <code>TimeSeriesSplit(n_splits=5)</code>." } }],
        after: { tr: "Zamana saygılı katların ortalaması 0,49, rastgele bölmenin çok altında, ve katlar 0 ile 1 arasında savruluyor: bir faiz döngüsünü öğrenen model bir sonrakinde başarısız oluyor. 201 açıklama ve birkaç faiz döngüsüyle bu soruya güvenilir bir yanıt vermek zor; dürüst sonuç budur.", en: "The mean of the time-respecting folds is 0.49, far below the random split, and the folds swing between 0 and 1: a model that learns one rate cycle fails in the next. With 201 statements and a few rate cycles it is hard to give a reliable answer to this question; that is the honest result." }
      },
      {
        id: "m7-u8-c4", kind: "interpret",
        task: { tr: "YZ, FOMC açıklamalarını bir LLM'e sınıflandırtmayı önerdi. Hangi cümleler yanlış?", en: "The AI suggested having an LLM classify the FOMC statements. Which sentences are wrong?" },
        prompt: { tr: "TF-IDF modeli zamana saygılı testte başarısız oldu. FOMC açıklamalarını bir büyük dil modeline “şahin / nötr / güvercin” diye etiketletsem sorun çözülür mü?", en: "The TF-IDF model failed the time-respecting test. If I have a large language model label the FOMC statements “hawkish / neutral / dovish”, is the problem solved?" },
        sentences: {
          tr: ["Bir LLM bağlamı ve olumsuzluğu sözlükten çok daha iyi anlayabilir; etiketleme için güçlü bir araçtır.", "LLM 2015–2026 açıklamalarını ve sonrasında ne olduğunu eğitim verisinde görmüş olabilir; “gelecek faiz” öngörüsünde bu ileriye bakma yanlılığıdır.", "LLM etiketleri insan etiketleri kadar güvenilir olduğundan ayrıca doğrulamaya gerek yoktur.", "Model sürümü, istem ve sıcaklık sonuçları değiştirebilir; tekrarlanabilirlik için bunlar kaydedilmelidir."],
          en: ["An LLM can understand context and negation much better than a dictionary; it is a powerful tool for labelling.", "The LLM may have seen the 2015–2026 statements and what happened afterwards in its training data; for forecasting the future rate this is look-ahead bias.", "Since LLM labels are as reliable as human labels, no further validation is needed.", "The model version, prompt and temperature can change the results; they should be recorded for reproducibility."]
        },
        bad: [2],
        explain: {
          tr: ["Doğru.", "Doğru: eğitim verisinin bittiği tarihten önceki metinler için LLM “geleceği” biliyor olabilir. Dürüst bir sınama, modelin eğitim tarihinden sonraki metinlerle yapılır.", "<b>Yanlış:</b> LLM etiketleri, önceden ayrılmış ve elle etiketlenmiş bir örneklemle karşılaştırılmalıdır (uyum oranı, karışıklık matrisi). Doğrulanmamış etiketler sistematik hatalar taşıyabilir.", "Doğru."],
          en: ["Correct.", "Correct: for texts from before its training cutoff, the LLM may know “the future”. An honest test uses texts from after the model's training date.", "<b>Wrong:</b> LLM labels should be compared with a set-aside, hand-labelled sample (agreement rate, confusion matrix). Unvalidated labels can carry systematic errors.", "Correct."]
        }
      }
    ],
    quiz: [
      { q: { tr: "Metin sınıflandırmada rastgele çapraz doğrulama neden iyimser olabilir?", en: "Why can random cross-validation be optimistic in text classification?" }, options: { tr: ["Aynı döneme ait neredeyse aynı metinler hem eğitimde hem testte yer alır", "Metinler çok uzundur", "TF-IDF rastgeledir"], en: ["Nearly identical texts from the same era appear in both training and test", "The texts are too long", "TF-IDF is random"] }, answer: 0, explain: { tr: "Zamansal sızıntı.", en: "Temporal leakage." } },
      { q: { tr: "LLM'lerde ileriye bakma yanlılığı nedir?", en: "What is look-ahead bias with LLMs?" }, options: { tr: ["Modelin, sınanan dönemden sonraki bilgileri eğitim verisinde görmüş olması", "Modelin yavaş çalışması", "İstemin uzun olması"], en: ["The model having seen information from after the tested period in its training data", "The model being slow", "The prompt being long"] }, answer: 0, explain: { tr: "Sınama, eğitim tarihinden sonraki metinlerle yapılmalı.", en: "Testing should use texts from after the training date." } },
      { q: { tr: "LLM etiketleri nasıl doğrulanır?", en: "How are LLM labels validated?" }, options: { tr: ["Önceden ayrılmış, elle etiketlenmiş bir örneklemle karşılaştırarak", "LLM'e kendi etiketlerini sorarak", "Etiketlerin dağılımına bakarak"], en: ["By comparing with a set-aside, hand-labelled sample", "By asking the LLM about its own labels", "By looking at the distribution of labels"] }, answer: 0, explain: { tr: "Uyum oranı ve karışıklık matrisi.", en: "Agreement rate and confusion matrix." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 9 — Colab + Gemini atölyesi                                       */
  /* =================================================================== */
  const NB = { tr: "modul7/09_kumeleme_ve_metin_atolyesi_tr.ipynb", en: "module7/09_clustering_and_text_workshop_en.ipynb" };
  U.push({
    id: "m7-u9", minutes: 50,
    title: { tr: "Colab + Gemini atölyesi: ülke kümeleri ve FOMC tonu", en: "Colab + Gemini workshop: country clusters and FOMC tone" },
    blurb: { tr: "Ülkeleri dönüştürülmüş göstergelerle kümele ve küme sayısını gerekçelendir; sonra FOMC açıklamalarından bir ton endeksi kurup faizle sına. Kodu Gemini yazar, sen denetlersin.", en: "Cluster the countries with transformed indicators and justify the number of clusters; then build a tone index from the FOMC statements and test it against the rate. Gemini writes the code, you audit it." },
    terms: [{ tr: "siluet skoru", en: "silhouette score" }, { tr: "ARI", en: "ARI" }, { tr: "kelime sınırı", en: "word boundary" }],
    concept: {
      tr: `<p>Bu atölyede modülün iki yarısını birer görevle tekrarlayacaksın. Notebook, Dünya Bankası ülke verisini, FOMC açıklamalarını ve federal fon oranını bu sitenin GitHub deposundan indirir.</p>
<p><b>Görevler</b></p>
<ol>
<li><b>Görev A — Ülke kümeleri:</b> sekiz göstergede kişi başı gelirin ve enflasyonun logaritmasını al, standartlaştır. k = 2…8 için k-ortalamaları (<code>n_init=10, random_state=0</code>) kur; siluet skoru en yüksek k'yı seç, o k için siluet skorunu ve gelir gruplarıyla düzeltilmiş Rand endeksini (ARI) hesapla.</li>
<li><b>Görev B — Ton endeksi:</b> verilen şahin ve güvercin listeleriyle, kelime sınırlarına dikkat ederek her açıklamanın tonunu hesapla. Tonun, sonraki 3 ayda federal fon oranındaki değişimle korelasyonunu bul.</li>
</ol>
<div class="box"><b>Gemini'nin sık yaptığı hatalar:</b> ölçeklemeyi unutmak; küme sayısını inertia'nın en düşük olduğu k ile seçmek; enflasyonun logaritmasını almadan önce standartlaştırmak; kelimeleri <code>str.count</code> ile saymak (“increase” içinde “ease”); büyük-küçük harfi eşitlememek; faiz değişimini açıklamadan önceki aylarla hesaplamak. Kontrol hücreleri bunları yakalar.</div>
<p>Colab ve Gemini'yi kullanma kuralları Modül 0'daki atölyeyle aynı.</p>`,
      en: `<p>In this workshop you repeat each half of the module with one task. The notebook downloads the World Bank country data, the FOMC statements and the federal funds rate from this site's GitHub repository.</p>
<p><b>Tasks</b></p>
<ol>
<li><b>Task A — Country clusters:</b> among the eight indicators take the logarithm of income per head and of inflation, then standardise. Fit k-means (<code>n_init=10, random_state=0</code>) for k = 2…8; choose the k with the highest silhouette score, and for that k compute the silhouette score and the adjusted Rand index (ARI) with the income groups.</li>
<li><b>Task B — Tone index:</b> with the given hawkish and dovish lists, compute each statement's tone, minding word boundaries. Find the correlation of tone with the change in the federal funds rate over the next 3 months.</li>
</ol>
<div class="box"><b>Mistakes Gemini often makes:</b> forgetting to scale; choosing the number of clusters by the lowest inertia; standardising before taking the log of inflation; counting words with <code>str.count</code> (“ease” inside “increase”); not lower-casing; computing the rate change over the months before the statement. The check cells catch these.</div>
<p>The rules for using Colab and Gemini are the same as in the Module 0 workshop.</p>`
    },
    playground: null,
    cells: [
      {
        id: "m7-u9-c1", kind: "prompt",
        task: { tr: "Görev A için Gemini'ye vereceğin isteği burada hazırla. Notebook'ta <code>ulke</code> tablosu ve <code>deg</code> listesi hazır.", en: "Prepare the prompt for Task A here. The notebook has the <code>ctry</code> table and the <code>cols</code> list ready." },
        weak: {
          prompt: { tr: "Ülkeleri kümele ve en iyi küme sayısını bul.", en: "Cluster the countries and find the best number of clusters." },
          reply: { tr: "Ham verilerle k-ortalamaları kurup inertia'ya bakalım:", en: "Let us fit k-means on the raw data and look at inertia:" },
          code: { tr: "ine = {k: KMeans(k).fit(ulke[deg]).inertia_ for k in range(2, 9)}\nk = min(ine, key=ine.get)\nulke['kume'] = KMeans(k).fit_predict(ulke[deg])\nprint(k)", en: "ine = {k: KMeans(k).fit(ctry[cols]).inertia_ for k in range(2, 9)}\nk = min(ine, key=ine.get)\nctry['cluster'] = KMeans(k).fit_predict(ctry[cols])\nprint(k)" },
          claim: { tr: "En iyi küme sayısı 8.", en: "The best number of clusters is 8." }
        },
        checklist: [
          { label: { tr: "Dönüşüm", en: "Transformation" }, why: { tr: "gdppc_ppp ve inflation için np.log; sonra standartlaştırma.", en: "np.log for gdppc_ppp and inflation; then standardisation." }, re: { tr: "log", en: "log" } },
          { label: { tr: "Ölçekleme", en: "Scaling" }, why: { tr: "StandardScaler ile her değişken ortalama 0, standart sapma 1.", en: "StandardScaler so every variable has mean 0 and standard deviation 1." }, re: { tr: "StandardScaler|standartlaştır|ölçekle", en: "StandardScaler|standardi[sz]e|scal" } },
          { label: { tr: "Küme sayısı seçimi", en: "Choosing the number of clusters" }, why: { tr: "k = 2…8; KMeans(n_clusters=k, n_init=10, random_state=0); siluet skoru en yüksek k.", en: "k = 2…8; KMeans(n_clusters=k, n_init=10, random_state=0); the k with the highest silhouette score." }, re: { tr: "silhouette|siluet", en: "silhouette" } },
          { label: { tr: "Dış kontrol", en: "External check" }, why: { tr: "Seçilen k için gelir gruplarıyla adjusted_rand_score.", en: "adjusted_rand_score with the income groups for the chosen k." }, re: { tr: "adjusted_rand|ARI|income|gelir", en: "adjusted_rand|ARI|income" } }
        ],
        minLen: 120,
        strong: { prompt: { tr: "ulke adlı DataFrame'de deg listesindeki sekiz sütunu X adlı bir kopyaya al; X'te gdppc_ppp ve inflation sütunlarının np.log'unu al. Z = StandardScaler().fit_transform(X). k = 2'den 8'e kadar KMeans(n_clusters=k, n_init=10, random_state=0) kur ve silhouette_score'u hesapla; skoru en yüksek k'yı k_en_iyi'ye, o k'nın siluet skorunu siluet'e, o k'nın etiketleriyle ulke['income'] arasındaki adjusted_rand_score'u ari'ye ata. İnertia ile k seçme.", en: "Copy the eight columns in the cols list of the DataFrame ctry into X; take np.log of the gdppc_ppp and inflation columns in X. Z = StandardScaler().fit_transform(X). For k from 2 to 8 fit KMeans(n_clusters=k, n_init=10, random_state=0) and compute silhouette_score; store the k with the highest score in k_best, its silhouette score in silh, and the adjusted_rand_score between that k's labels and ctry['income'] in ari. Do not choose k by inertia." } }
      },
      {
        id: "m7-u9-c2", kind: "colab",
        task: { tr: "<b>Görev A — Ülke kümeleri.</b> Notebook'u aç, hazırladığın istekle <code>Z</code>, <code>k_en_iyi</code>, <code>siluet</code> ve <code>ari</code> değişkenlerini oluştur, kontrol hücresini çalıştır ve verdiği kodu buraya yapıştır.", en: "<b>Task A — Country clusters.</b> Open the notebook, create <code>Z</code>, <code>k_best</code>, <code>silh</code> and <code>ari</code> with the prompt you prepared, run the check cell and paste the code it gives you here." },
        notebook: NB,
        steps: {
          tr: ["Notebook'u aç ve <b>Kurulum</b> hücresini çalıştır (ülke verisi, FOMC açıklamaları ve faiz indirilir).", "<b>Görev A</b> hücresinde Gemini'ye isteğini ver.", "Kodu denetle: logaritma ölçeklemeden önce mi? k siluetle mi seçildi? <code>n_init=10, random_state=0</code> var mı?", "Seçilen çözümün küme büyüklüklerine ve üyelerine bak.", "<b>Kontrol A</b> hücresini çalıştır; geçerse <code>ML7-…</code> kodunu yapıştır."],
          en: ["Open the notebook and run the <b>Setup</b> cell (the country data, the FOMC statements and the rate are downloaded).", "In the <b>Task A</b> cell, give Gemini your prompt.", "Audit the code: is the log taken before scaling? Was k chosen by the silhouette? Is there <code>n_init=10, random_state=0</code>?", "Look at the cluster sizes and members of the chosen solution.", "Run the <b>Check A</b> cell; if it passes, paste the <code>ML7-…</code> code."]
        },
        codeHashes: ["e93c4ec2"]
      },
      {
        id: "m7-u9-c3", kind: "colab",
        task: { tr: "<b>Görev B — Ton endeksi.</b> Gemini ile her açıklamanın tonunu (<code>ton</code>) ve tonun sonraki 3 aydaki faiz değişimiyle korelasyonunu (<code>korelasyon</code>) hesaplat, kontrol hücresini çalıştır ve kodu buraya yapıştır.", en: "<b>Task B — Tone index.</b> Have Gemini compute each statement's tone (<code>tone</code>) and the correlation of tone with the rate change over the next 3 months (<code>corr</code>), run the check cell and paste the code here." },
        notebook: NB,
        steps: {
          tr: ["<b>Görev B</b> hücresinde Gemini'den iste: metinler küçük harfe çevrilsin; <code>sahin</code> ve <code>guvercin</code> listelerindeki her kelime <code>re.findall(r\"\\b\" + k + r\"\\b\", metin)</code> ile sayılsın; ton = (şahin − güvercin) / (şahin + güvercin).", "Faiz değişimi: açıklama ayından 3 ay sonraki aylık federal fon oranı eksi açıklama ayındaki oran (notebook'taki <code>degisim(t, 3)</code> fonksiyonu hazır).", "Kodu denetle: <code>str.count</code> var mı? Değişim geleceğe mi bakıyor?", "<b>Kontrol B</b> hücresini çalıştır ve kodu buraya yapıştır."],
          en: ["In the <b>Task B</b> cell, ask Gemini to lower-case the texts and count every word in the <code>hawk</code> and <code>dove</code> lists with <code>re.findall(r\"\\b\" + w + r\"\\b\", text)</code>; tone = (hawkish − dovish) / (hawkish + dovish).", "Rate change: the monthly federal funds rate 3 months after the statement month minus the rate in the statement month (the notebook's <code>change(t, 3)</code> function is ready).", "Audit the code: is there <code>str.count</code>? Does the change look forward?", "Run the <b>Check B</b> cell and paste the code here."]
        },
        codeHashes: ["c0263b3d"],
        after: { tr: "İki görev aynı dersi farklı verilerle verdi: gözetimsiz ve metin tabanlı yöntemlerde kod hatasız çalışsa bile seçimler (dönüşüm, k, sözlük, eşleştirme) sonucu belirler. Bu seçimleri raporlamak ve sınamak, analizin kendisi kadar önemlidir.", en: "The two tasks taught the same lesson with different data: in unsupervised and text-based methods, even when the code runs without errors, the choices (transformation, k, dictionary, matching) determine the result. Reporting and testing these choices matters as much as the analysis itself." }
      },
      {
        id: "m7-u9-c4", kind: "auditlog",
        task: { tr: "Atölyeyi bir denetim notuyla kapat.", en: "Close the workshop with an audit note." },
        fields: {
          tr: [
            { label: "Gemini'nin kümeleme kodunda neyi düzeltmen gerekti?", help: "Ölçekleme, dönüşüm sırası, k seçimi, n_init", ph: "Örnek: Gemini önce inertia ile k seçmişti…" },
            { label: "Seçtiğin küme çözümünü bir politika raporunda nasıl anlatırsın?", help: "k, siluet, ARI, küme üyeleri ve sınırlılıklar", ph: "Örnek: k = … , siluet … , gelir gruplarıyla uyum …" },
            { label: "Ton endeksi faizle ilişkili mi? Bu ilişki öngörü mü?", help: "Korelasyon, eşzamanlı bilgi, sözlüğün sınırları", ph: "Örnek: 3 aylık korelasyon … ; ama açıklama kararı da duyuruyor…" }
          ],
          en: [
            { label: "What did you need to fix in Gemini's clustering code?", help: "Scaling, order of transformation, choice of k, n_init", ph: "Example: Gemini first chose k by inertia…" },
            { label: "How would you present your chosen clustering in a policy report?", help: "k, silhouette, ARI, cluster members and limitations", ph: "Example: k = … , silhouette … , agreement with income groups …" },
            { label: "Is the tone index related to the rate? Is the relation a forecast?", help: "Correlation, simultaneous information, the dictionary's limits", ph: "Example: the 3-month correlation is … ; but the statement also announces the decision…" }
          ]
        }
      }
    ],
    quiz: [
      { q: { tr: "Enflasyonun logaritmasını standartlaştırmadan önce almak neden önemlidir?", en: "Why does it matter to take the log of inflation before standardising?" }, options: { tr: ["Standartlaştırılmış değerlerin bir kısmı negatiftir; logaritması alınamaz ve dönüşümün amacı uç değerleri yaklaştırmaktır", "Sıra fark etmez", "Logaritma ölçeklemenin yerine geçer"], en: ["Some standardised values are negative and have no logarithm; the point of the transformation is to pull in the extremes", "The order does not matter", "The logarithm replaces scaling"] }, answer: 0, explain: { tr: "Önce dönüşüm, sonra ölçekleme.", en: "Transform first, then scale." } },
      { q: { tr: "Ton endeksinin faizle 3 aylık korelasyonu pozitif. Bu neden tek başına öngörü gücü kanıtı değildir?", en: "The tone index has a positive 3-month correlation with the rate. Why is this not on its own proof of forecasting power?" }, options: { tr: ["Açıklama o toplantının kararını da duyurur; ilişkinin bir kısmı eşzamanlıdır", "Korelasyon her zaman yanıltıcıdır", "Faiz verisi aylıktır"], en: ["The statement also announces that meeting's decision; part of the relation is simultaneous", "Correlation is always misleading", "The rate data are monthly"] }, answer: 0, explain: { tr: "Öngörü için kararın ötesinde bilgi gerekir.", en: "Forecasting needs information beyond the decision." } }
    ]
  });
})();
