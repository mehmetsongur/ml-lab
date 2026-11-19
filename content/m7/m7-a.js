/* Modül 7 — Gözetimsiz öğrenme · Üniteler 1–4
 * © 2026 Prof. Dr. Mehmet Songur — CC BY-NC-SA 4.0 (LICENSE-CONTENT.txt)
 * "Örnek YZ yanıtları" öğretim amacıyla hazırlanmıştır.
 */
(function () {
  "use strict";
  const D = window.M7_DATA, U = window.M7_UNITS, ln = D.line;
  const WB = D.WB, YC = D.YC;
  const PK = ["numpy", "pandas", "scikit-learn"];
  const C0 = { tr: "", en: "" };
  const PAY = {
    tr: `
def pay(etiket, veri):                                    # her değişkenin varyansının kümelerce açıklanan payı
    return (veri.groupby(etiket).transform("mean").var() / veri.var()).round(2)`,
    en: `
def share(labels, data):                                  # share of each variable's variance explained by the clusters
    return (data.groupby(labels).transform("mean").var() / data.var()).round(2)`
  };

  /* =================================================================== */
  /* Ünite 1 — k-ortalamalar ve ölçekleme                                   */
  /* =================================================================== */
  U.push({
    id: "m7-u1", minutes: 25, packages: PK, data: D.F_WB,
    title: { tr: "Gözetimsiz öğrenme: k-ortalamalar ve ölçekleme", en: "Unsupervised learning: k-means and scaling" },
    blurb: { tr: "Şimdiye kadar her modelin öngöreceği bir hedefi vardı. Gözetimsiz öğrenmede hedef yoktur: veriyi benzer gruplara ayırırız. 157 ülkeyi sekiz kalkınma göstergesiyle kümeliyoruz ve ilk dersi alıyoruz: ölçeklemeden kümeleme, en büyük sayılı değişkenin kümelemesidir.", en: "So far every model had a target to predict. In unsupervised learning there is no target: we split the data into similar groups. We cluster 157 countries with eight development indicators and learn the first lesson: clustering without scaling is clustering by the variable with the biggest numbers." },
    terms: [{ tr: "gözetimsiz öğrenme", en: "unsupervised learning" }, { tr: "k-ortalamalar (k-means)", en: "k-means" }, { tr: "küme merkezi (centroid)", en: "centroid" }, { tr: "standartlaştırma", en: "standardisation" }],
    concept: C0,
    playground: { type: "kmeansSteps", intro: { tr: "k-ortalamaların iki adımını tek tek izle: her noktayı en yakın merkeze ata, sonra her merkezi kendi noktalarının ortalamasına taşı. Yatay ekseni 100 kat büyüt ve kümelerin nasıl değiştiğine bak.", en: "Follow the two steps of k-means one by one: assign every point to the nearest centre, then move every centre to the mean of its points. Stretch the horizontal axis 100 times and see how the clusters change." }, takeaway: { tr: "Algoritma uzaklığa bakar; birimi büyük olan eksen uzaklığı, dolayısıyla kümeleri belirler. Ölçeklemek, her değişkene eşit söz hakkı verir.", en: "The algorithm looks at distance; the axis with the larger unit dominates the distance, and hence the clusters. Scaling gives every variable an equal say." } },
    cells: [
      {
        id: "m7-u1-c1", kind: "run",
        task: { tr: "Dünya Bankası verisiyle (2019–2023 ortalamaları) 157 ülkeyi ölçeklemeden dört kümeye ayırıyoruz ve her değişkenin varyansının ne kadarını kümelerin açıkladığına bakıyoruz. Önce tahmin et.", en: "With World Bank data (2019–2023 averages) we split 157 countries into four clusters without scaling and look at how much of each variable's variance the clusters explain. Predict first." },
        predict: { q: { tr: "Ölçeklemeden kurulan kümeleri en çok hangi değişkenler belirler?", en: "Which variables mostly determine the clusters built without scaling?" }, options: { tr: ["Gelir ve yaşam süresi", "Enflasyon ve dış ticaret: sayıları en geniş aralıkta olanlar", "Doğurganlık ve tarım"], en: ["Income and life expectancy", "Inflation and trade: those whose numbers span the widest range", "Fertility and agriculture"] }, answer: 1, explain: { tr: "k-ortalamalar uzaklıkla çalışır. Dış ticaret (GSYH'nin %9'u ile %394'ü arası) ve enflasyon (%0,1 ile %180 arası) uzaklığı domine eder; doğurganlık 1 ile 6 arasında değişir ve neredeyse hiç sayılmaz.", en: "k-means works with distances. Trade (9% to 394% of GDP) and inflation (0.1% to 180%) dominate the distance; fertility ranges from 1 to 6 and barely counts." } },
        code: { tr: WB.tr + PAY.tr + `
print("Standart sapmalar:", X.std().round(1).to_dict())
km = KMeans(n_clusters=4, n_init=10, random_state=0).fit(X)          # ölçeklemeden
print("Küme büyüklükleri:", np.bincount(km.labels_).tolist())
print("Kümelerin açıkladığı varyans payı:")
print(pay(km.labels_, X).to_string())`, en: WB.en + PAY.en + `
print("Standard deviations:", X.std().round(1).to_dict())
km = KMeans(n_clusters=4, n_init=10, random_state=0).fit(X)          # without scaling
print("Cluster sizes:", np.bincount(km.labels_).tolist())
print("Share of variance explained by the clusters:")
print(share(km.labels_, X).to_string())` },
        after: { tr: "Enflasyonun varyansının %92'si, dış ticaretin %83'ü kümelerce açıklanıyor; işsizliğin yalnızca %1'i, kentleşmenin %8'i. Küme büyüklükleri de tuhaf: 104, 44, 6 ve 3 ülke. Kümeler “benzer ülkeler” değil, “benzer enflasyon ve dış ticaret düzeyi” grupları. Bunun nedeni ekonomik değil, aritmetik: uzaklık hesabında büyük sayılar küçükleri ezer.", en: "92% of the variance of inflation and 83% of trade are explained by the clusters; only 1% of unemployment and 8% of urbanisation. The cluster sizes are odd too: 104, 44, 6 and 3 countries. The clusters are not “similar countries” but groups with “similar inflation and trade”. The reason is arithmetic, not economic: in the distance calculation big numbers crush small ones." }
      },
      {
        id: "m7-u1-c2", kind: "run",
        task: { tr: "Aynı kümelemeyi standartlaştırılmış verilerle (<code>Z</code>: her değişken ortalama 0, standart sapma 1) tekrarlıyoruz ve kümeleri Dünya Bankası gelir gruplarıyla karşılaştırıyoruz. Gelir grubu modele verilmedi.", en: "We repeat the clustering with standardised data (<code>Z</code>: every variable has mean 0 and standard deviation 1) and compare the clusters with the World Bank income groups. The income group was not given to the model." },
        code: { tr: WB.tr + PAY.tr + `
km = KMeans(n_clusters=4, n_init=10, random_state=0).fit(Z)          # ölçeklenmiş veri
ulke["kume"] = km.labels_
print("Küme büyüklükleri:", np.bincount(km.labels_).tolist())
print("Kümelerin açıkladığı varyans payı:")
print(pay(km.labels_, X).to_string())
print()
print(pd.crosstab(ulke["kume"], ulke["income"]).to_string())`, en: WB.en + PAY.en + `
km = KMeans(n_clusters=4, n_init=10, random_state=0).fit(Z)          # scaled data
ctry["cluster"] = km.labels_
print("Cluster sizes:", np.bincount(km.labels_).tolist())
print("Share of variance explained by the clusters:")
print(share(km.labels_, X).to_string())
print()
print(pd.crosstab(ctry["cluster"], ctry["income"]).to_string())` },
        after: { tr: "Şimdi gelir (%83), doğurganlık (%71), tarım (%73) ve yaşam süresi (%65) de kümeleri belirliyor. Gelir grubu modele hiç verilmemesine karşın bir küme 53 yüksek gelirli ülkenin hepsini, bir başkası düşük gelirlilerin 16'sını topluyor: veride gerçek bir kalkınma yapısı var. Ama enflasyon hâlâ %92: 3 ülkelik tuhaf bir küme duruyor. Ünite 2'de ona bakacağız.", en: "Now income (83%), fertility (71%), agriculture (73%) and life expectancy (65%) also determine the clusters. Even though the income group was never given to the model, one cluster gathers all 53 high-income countries and another 16 of the low-income ones: there is a real development structure in the data. But inflation is still at 92%: an odd 3-country cluster remains. We look at it in Unit 2." }
      },
      {
        id: "m7-u1-c3", kind: "fill",
        task: { tr: "Standartlaştırmayı kendin yap: her sütundan ortalamasını çıkar ve standart sapmasına böl. Sonuç <code>StandardScaler</code>'ınkiyle aynı olmalı.", en: "Do the standardisation yourself: subtract each column's mean and divide by its standard deviation. The result should match <code>StandardScaler</code>'s." },
        code: { tr: WB.tr + `
Zk = (X - X.___()) / X.std(ddof=0)                        # ddof=0: StandardScaler'ın kullandığı standart sapma
print("Ortalamalar:", Zk.mean().round(6).tolist())
print("Standart sapmalar:", Zk.std(ddof=0).round(6).tolist())`, en: WB.en + `
Zm = (X - X.___()) / X.std(ddof=0)                        # ddof=0: the standard deviation StandardScaler uses
print("Means:", Zm.mean().round(6).tolist())
print("Standard deviations:", Zm.std(ddof=0).round(6).tolist())` },
        solution: { tr: WB.tr + `
Zk = (X - X.mean()) / X.std(ddof=0)                       # ddof=0: StandardScaler'ın kullandığı standart sapma
print("Ortalamalar:", Zk.mean().round(6).tolist())
print("Standart sapmalar:", Zk.std(ddof=0).round(6).tolist())`, en: WB.en + `
Zm = (X - X.mean()) / X.std(ddof=0)                       # ddof=0: the standard deviation StandardScaler uses
print("Means:", Zm.mean().round(6).tolist())
print("Standard deviations:", Zm.std(ddof=0).round(6).tolist())` },
        hints: [{ tr: "Sütun ortalaması: <code>X.mean()</code>.", en: "Column means: <code>X.mean()</code>." }],
        checks: [{ py: { tr: "np.allclose(Zk.values, Z)", en: "np.allclose(Zm.values, Z)" }, msg: { tr: "<code>Zk</code>, <code>StandardScaler</code> çıktısı <code>Z</code> ile aynı olmalı.", en: "<code>Zm</code> should equal the <code>StandardScaler</code> output <code>Z</code>." } }],
        after: { tr: "Standartlaştırma her değişkeni “kaç standart sapma ortalamanın üstünde?” sorusuna çevirir. Böylece %1'lik doğurganlık farkı ile %50'lik dış ticaret farkı karşılaştırılabilir olur. Bunun da bir bedeli var: her değişkene eşit ağırlık vermek de bir tercihtir. Sekiz değişkenden üçü (gelir, yaşam süresi, doğurganlık) aynı kalkınma boyutunu ölçüyorsa, o boyut kümelemede üç kez sayılır.", en: "Standardisation turns every variable into “how many standard deviations above the mean?”. This makes a 1-point gap in fertility comparable with a 50-point gap in trade. It has a price too: giving every variable equal weight is also a choice. If three of the eight variables (income, life expectancy, fertility) measure the same development dimension, that dimension counts three times in the clustering." }
      },
      {
        id: "m7-u1-c4", kind: "interpret",
        task: { tr: "YZ kümeleme sonuçlarını yorumladı. Hangi cümleler yanlış?", en: "The AI interpreted the clustering results. Which sentences are wrong?" },
        prompt: { tr: "157 ülkeyi standartlaştırılmış sekiz göstergeyle k-ortalamalarla dört kümeye ayırdım. Sonuçları yorumlar mısın?", en: "I split 157 countries into four clusters with k-means on eight standardised indicators. Can you interpret the results?" },
        sentences: {
          tr: ["Kümeler gelir gruplarıyla büyük ölçüde örtüşüyor; bu, veride gelire bağlı güçlü bir yapı olduğunu gösteriyor.", "k-ortalamalar ülkelerin doğru kümelerini bulmuştur; başka bir yöntem aynı kümeleri vermelidir.", "Kümelemenin sonucu seçilen değişkenlere, ölçeklemeye ve küme sayısına bağlıdır.", "Aynı kümedeki ülkeler aynı politikalara benzer tepki verir; bu yüzden küme, politika önerisi için yeterlidir."],
          en: ["The clusters largely overlap with the income groups; this shows a strong income-related structure in the data.", "k-means has found the correct clusters of the countries; any other method should give the same clusters.", "The result of clustering depends on the chosen variables, the scaling and the number of clusters.", "Countries in the same cluster respond similarly to the same policies; so the cluster is enough for a policy recommendation."]
        },
        bad: [1, 3],
        explain: {
          tr: ["Doğru.", "<b>Yanlış:</b> gözetimsiz öğrenmede “doğru küme” diye bir hedef yoktur. Başka bir yöntem, başka değişkenler ya da başka bir k farklı ve aynı ölçüde savunulabilir gruplar verebilir.", "Doğru.", "<b>Yanlış:</b> kümeler göstergelerin benzerliğini gösterir, politikaya tepkinin benzerliğini değil. Tepkiyi ölçmek nedensel bir soru ve başka yöntemler ister."],
          en: ["Correct.", "<b>Wrong:</b> in unsupervised learning there is no target such as “the correct cluster”. Another method, other variables or another k can give different and equally defensible groups.", "Correct.", "<b>Wrong:</b> clusters show similarity in the indicators, not similarity in the response to policy. Measuring the response is a causal question and needs other methods."]
        }
      }
    ],
    quiz: [
      { q: { tr: "Gözetimli ve gözetimsiz öğrenmenin farkı nedir?", en: "What is the difference between supervised and unsupervised learning?" }, options: { tr: ["Gözetimsiz öğrenmede öngörülecek bir hedef değişken yoktur", "Gözetimsiz öğrenme daha az veri ister", "Gözetimsiz öğrenmede model eğitilmez"], en: ["In unsupervised learning there is no target variable to predict", "Unsupervised learning needs less data", "In unsupervised learning no model is fitted"] }, answer: 0, explain: { tr: "Amaç yapıyı keşfetmektir.", en: "The aim is to discover structure." } },
      { q: { tr: "k-ortalamalar hangi iki adımı tekrarlar?", en: "Which two steps does k-means repeat?" }, options: { tr: ["Noktaları en yakın merkeze ata; merkezleri kendi noktalarının ortalamasına taşı", "Ağaç büyüt; ağaçları ortala", "Katsayıları küçült; çapraz doğrula"], en: ["Assign points to the nearest centre; move centres to the mean of their points", "Grow a tree; average trees", "Shrink coefficients; cross-validate"] }, answer: 0, explain: { tr: "Atamalar değişmeyince durur.", en: "It stops when the assignments no longer change." } },
      { q: { tr: "Kümelemeden önce neden standartlaştırırız?", en: "Why do we standardise before clustering?" }, options: { tr: ["Büyük birimli değişkenler uzaklığı domine etmesin diye", "Kümeler daha az olsun diye", "Veri normal dağılsın diye"], en: ["So that variables with large units do not dominate the distance", "So that there are fewer clusters", "So that the data become normally distributed"] }, answer: 0, explain: { tr: "Her değişken eşit söz hakkı alır.", en: "Every variable gets an equal say." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 2 — Kaç küme? Seçim, aykırı değerler, doğrulama                  */
  /* =================================================================== */
  const U2A = {
    tr: WB.tr + `
inertia, siluet = {}, {}
for k in range(2, 9):
    km = KMeans(n_clusters=k, n_init=10, random_state=0).fit(Z)
    inertia[k] = km.inertia_                                 # küme içi kareler toplamı
    siluet[k] = silhouette_score(Z, km.labels_)
k_en_iyi = min(inertia, key=inertia.get)                     # en iyi k
print("Seçilen küme sayısı:", k_en_iyi)`,
    en: WB.en + `
inertia, silh = {}, {}
for k in range(2, 9):
    km = KMeans(n_clusters=k, n_init=10, random_state=0).fit(Z)
    inertia[k] = km.inertia_                                 # within-cluster sum of squares
    silh[k] = silhouette_score(Z, km.labels_)
k_best = min(inertia, key=inertia.get)                       # best k
print("Chosen number of clusters:", k_best)`
  };
  U.push({
    id: "m7-u2", minutes: 30, packages: PK, data: D.F_WB,
    title: { tr: "Kaç küme? Seçim, aykırı değerler ve doğrulama", en: "How many clusters? Choice, outliers and validation" },
    blurb: { tr: "Küme sayısını veri söylemez, biz seçeriz. Dirsek yöntemi ve siluet skoru yol gösterir ama karar vermez: siluetin önerdiği k, üç hiperenflasyon ülkesinin oluşturduğu bir kümeye dayanıyor. Bir dönüşüm resmi değiştiriyor.", en: "The data do not tell us the number of clusters; we choose it. The elbow method and the silhouette score guide but do not decide: the k the silhouette suggests rests on a cluster formed by three hyperinflation countries. A transformation changes the picture." },
    terms: [{ tr: "dirsek yöntemi", en: "elbow method" }, { tr: "siluet skoru", en: "silhouette score" }, { tr: "aykırı değer", en: "outlier" }, { tr: "başlangıç kararsızlığı", en: "initialisation instability" }],
    concept: C0,
    playground: { type: "kChoice", intro: { tr: "Gerçekte kaç grup olduğunu ve grupların ne kadar iç içe geçtiğini sen seç; sonra her k için inertia ve siluet skoruna bak. Bir aykırı nokta ekle.", en: "Choose how many groups there really are and how much they overlap; then look at the inertia and the silhouette score for every k. Add an outlier." }, takeaway: { tr: "Inertia k arttıkça hep düşer, bu yüzden tek başına k seçemez. Siluet, gruplar belirginse doğru k'yı bulur; iç içe gruplarda ve aykırı değerlerde yanılır.", en: "Inertia always falls as k grows, so it cannot choose k on its own. The silhouette finds the right k when the groups are distinct; it is misled by overlapping groups and outliers." } },
    cells: [
      {
        id: "m7-u2-c1", kind: "run",
        task: { tr: "k = 2'den 8'e kadar her küme sayısı için küme içi kareler toplamını (inertia) ve siluet skorunu hesaplıyoruz. Önce tahmin et.", en: "For every number of clusters from k = 2 to 8 we compute the within-cluster sum of squares (inertia) and the silhouette score. Predict first." },
        predict: { q: { tr: "Inertia k arttıkça nasıl değişir?", en: "How does inertia change as k grows?" }, options: { tr: ["Bir yerde en düşük değerine ulaşır, sonra artar", "Her zaman düşer", "Değişmez"], en: ["It reaches a minimum somewhere, then rises", "It always falls", "It does not change"] }, answer: 1, explain: { tr: "Daha fazla merkez her noktayı bir merkeze daha yaklaştırır. k = 157'de her ülke kendi kümesidir ve inertia sıfırdır. Bu yüzden “en düşük inertia” bir seçim ölçütü olamaz.", en: "More centres bring every point closer to some centre. At k = 157 every country is its own cluster and inertia is zero. That is why “lowest inertia” cannot be a selection criterion." } },
        code: { tr: WB.tr + `
print(" k   inertia   siluet   en küçük küme")
for k in range(2, 9):
    km = KMeans(n_clusters=k, n_init=10, random_state=0).fit(Z)
    print(f"{k:2d}   {km.inertia_:7.1f}   {silhouette_score(Z, km.labels_):6.3f}   {np.bincount(km.labels_).min():5d} ülke")`, en: WB.en + `
print(" k   inertia   silhouette   smallest cluster")
for k in range(2, 9):
    km = KMeans(n_clusters=k, n_init=10, random_state=0).fit(Z)
    print(f"{k:2d}   {km.inertia_:7.1f}   {silhouette_score(Z, km.labels_):10.3f}   {np.bincount(km.labels_).min():5d} countries")` },
        after: { tr: "Inertia 772'den 301'e hep düşüyor; belirgin bir “dirsek” yok. Siluet k = 3'te en yüksek (0,399), ama o çözümde en küçük küme yalnızca 3 ülke; k = 3'ten sonraki bütün çözümlerde de bu 3 ülke ayrı bir küme. Siluet, birbirinden çok uzak küçük bir grubu ayırmayı çok “ödüllendirir”. Bu üç ülke kim?", en: "Inertia falls all the way from 772 to 301; there is no clear “elbow”. The silhouette is highest at k = 3 (0.399), but in that solution the smallest cluster has only 3 countries; in every solution from k = 3 on, these 3 countries form a cluster of their own. The silhouette strongly “rewards” separating a small group that is far from everything else. Who are these three countries?" }
      },
      {
        id: "m7-u2-c2", kind: "run",
        task: { tr: "Üç ülkelik kümeye bakıyoruz, sonra enflasyonu logaritmasıyla değiştirip siluet skorunu ve gelir gruplarıyla uyumu (düzeltilmiş Rand endeksi, ARI) yeniden hesaplıyoruz.", en: "We look at the three-country cluster, then replace inflation by its logarithm and recompute the silhouette score and the agreement with the income groups (adjusted Rand index, ARI)." },
        code: { tr: WB.tr + `
from sklearn.metrics import adjusted_rand_score
k3 = KMeans(n_clusters=3, n_init=10, random_state=0).fit_predict(Z)
kucuk = np.bincount(k3).argmin()
print(ulke.loc[k3 == kucuk, ["country", "inflation"]].to_string(index=False))
print(f"k = 3, ham enflasyon: siluet {silhouette_score(Z, k3):.3f}, ARI {adjusted_rand_score(ulke['income'], k3):.3f}")
X2 = X.copy()
X2["inflation"] = np.log(X2["inflation"])                 # enflasyon: logaritması
Z2 = StandardScaler().fit_transform(X2)
print(" k   siluet   ARI    küme büyüklükleri")
for k in range(2, 7):
    e = KMeans(n_clusters=k, n_init=10, random_state=0).fit_predict(Z2)
    print(f"{k:2d}   {silhouette_score(Z2, e):.3f}   {adjusted_rand_score(ulke['income'], e):.3f}  {np.bincount(e).tolist()}")`, en: WB.en + `
from sklearn.metrics import adjusted_rand_score
k3 = KMeans(n_clusters=3, n_init=10, random_state=0).fit_predict(Z)
small = np.bincount(k3).argmin()
print(ctry.loc[k3 == small, ["country", "inflation"]].to_string(index=False))
print(f"k = 3, raw inflation: silhouette {silhouette_score(Z, k3):.3f}, ARI {adjusted_rand_score(ctry['income'], k3):.3f}")
X2 = X.copy()
X2["inflation"] = np.log(X2["inflation"])                 # inflation: its logarithm
Z2 = StandardScaler().fit_transform(X2)
print(" k   silhouette   ARI    cluster sizes")
for k in range(2, 7):
    e = KMeans(n_clusters=k, n_init=10, random_state=0).fit_predict(Z2)
    print(f"{k:2d}   {silhouette_score(Z2, e):10.3f}   {adjusted_rand_score(ctry['income'], e):.3f}  {np.bincount(e).tolist()}")` },
        after: { tr: "Lübnan, Sudan ve Zimbabve: 2019–2023 ortalama enflasyonları %150–180. Standartlaştırma bu üç ülkeyi ortalamadan 6–8 standart sapma uzağa koyuyor ve bir kümeyi tek başına kapıyorlar. Enflasyonun logaritması bu uç değerleri yaklaştırınca 3 ülkelik küme kayboluyor ve k = 3'te gelir gruplarıyla uyum 0,34'ten 0,52'ye çıkıyor. Ama siluet şimdi k = 2'yi öneriyor: ölçütler yol gösterir, kararı veri dönüşümü ve amaç birlikte verir.", en: "Lebanon, Sudan and Zimbabwe: their average inflation in 2019–2023 was 150–180%. Standardisation puts these three countries 6–8 standard deviations away from the mean and they grab a cluster by themselves. Once the logarithm of inflation pulls these extremes in, the 3-country cluster disappears and at k = 3 the agreement with the income groups rises from 0.34 to 0.52. But now the silhouette suggests k = 2: the criteria guide; the decision comes from the data transformation and the purpose together." }
      },
      {
        id: "m7-u2-c3", kind: "audit",
        task: { tr: "YZ küme sayısını seçti. Hatalı satırı bul ve düzelt: küme sayısı siluet skoruna göre seçilsin.", en: "The AI chose the number of clusters. Find the faulty line and fix it: the number of clusters should be chosen by the silhouette score." },
        ai: {
          prompt: { tr: "Ülkeleri kaç kümeye ayırmalıyım? 2 ile 8 arasındaki en iyi k'yı bul.", en: "How many clusters should I split the countries into? Find the best k between 2 and 8." },
          reply: { tr: "Küme içi kareler toplamı (inertia) en düşük olan k en iyi kümelemedir:", en: "The k with the lowest within-cluster sum of squares (inertia) is the best clustering:" },
          code: U2A,
          claim: { tr: "En iyi küme sayısı 8: ülkeler sekiz belirgin gruba ayrılıyor.", en: "The best number of clusters is 8: the countries fall into eight distinct groups." }
        },
        bugLines: [ln(U2A.tr, "k_en_iyi = min(")],
        lineExplain: { tr: "Inertia k arttıkça hep düşer; aralığın en büyük k'sı (8) her zaman “en iyi” çıkar. Seçim için siluet gibi küme içi yakınlığı küme dışı uzaklıkla dengeleyen bir ölçütün en büyük değeri aranır: <code>max(siluet, key=siluet.get)</code>.", en: "Inertia always falls as k grows; the largest k in the range (8) always comes out “best”. For the choice we look for the maximum of a criterion such as the silhouette, which balances within-cluster closeness against between-cluster distance: <code>max(silh, key=silh.get)</code>." },
        hints: [{ tr: "Satırı <code>k_en_iyi = max(siluet, key=siluet.get)</code> yap.", en: "Make the line <code>k_best = max(silh, key=silh.get)</code>." }],
        solution: { tr: U2A.tr.replace("k_en_iyi = min(inertia, key=inertia.get)", "k_en_iyi = max(siluet, key=siluet.get)"), en: U2A.en.replace("k_best = min(inertia, key=inertia.get)", "k_best = max(silh, key=silh.get)") },
        checks: [{ py: { tr: "k_en_iyi == max(range(2, 9), key=lambda k: silhouette_score(Z, KMeans(n_clusters=k, n_init=10, random_state=0).fit(Z).labels_))", en: "k_best == max(range(2, 9), key=lambda k: silhouette_score(Z, KMeans(n_clusters=k, n_init=10, random_state=0).fit(Z).labels_))" }, msg: { tr: "<code>k_en_iyi</code>, siluet skorunun en yüksek olduğu k olmalı.", en: "<code>k_best</code> should be the k with the highest silhouette score." } }],
        after: { tr: "Siluet k = 3'ü seçiyor; YZ'nin “sekiz belirgin grup” iddiası, aralığın sonundaki sayıyı seçmekten ibaretti. Ama bir önceki hücreden biliyoruz ki k = 3 de üç hiperenflasyon ülkesine dayanıyor. Doğru düzeltme yalnızca ölçütü değiştirmek değil, sonucu incelemek: küme büyüklüklerine ve üyelerine bakmadan bir k'yı raporlama.", en: "The silhouette picks k = 3; the AI's claim of “eight distinct groups” was just picking the number at the end of the range. But from the previous cell we know that k = 3 too rests on three hyperinflation countries. The right fix is not only changing the criterion but inspecting the result: do not report a k without looking at the cluster sizes and members." }
      },
      {
        id: "m7-u2-c4", kind: "interpret",
        task: { tr: "YZ küme sayısı seçimini açıkladı. Hangi cümleler yanlış?", en: "The AI explained the choice of the number of clusters. Which sentences are wrong?" },
        prompt: { tr: "Ülke kümelemesinde siluet k = 3'ü, enflasyonun logaritmasını alınca k = 2'yi öneriyor. Hangisini seçmeliyim?", en: "In the country clustering the silhouette suggests k = 3, and k = 2 after taking the log of inflation. Which one should I choose?" },
        sentences: {
          tr: ["Siluet skoru en yüksek olan çözüm her zaman ekonomik olarak en anlamlı çözümdür.", "Ham veriyle k = 3, üç hiperenflasyon ülkesini ayırıyor; bu bir aykırı değer bulgusudur, bir ülke grubu değil.", "Seçim, analizin amacına bağlıdır: kalkınma düzeyini mi, makroekonomik istikrarı mı gruplamak istiyoruz?", "Küme sayısını gelir gruplarıyla uyumu en yüksek yapan k'yı seçmek, gözetimsiz öğrenmenin amacına tam uygundur."],
          en: ["The solution with the highest silhouette score is always the most meaningful one economically.", "With raw data, k = 3 separates three hyperinflation countries; this is an outlier finding, not a group of countries.", "The choice depends on the purpose of the analysis: do we want to group development levels or macroeconomic stability?", "Choosing the k that maximises agreement with the income groups is fully in line with the purpose of unsupervised learning."]
        },
        bad: [0, 3],
        explain: {
          tr: ["<b>Yanlış:</b> siluet geometrik bir ölçüdür; belirgin ama ilginç olmayan ayrımları (örneğin birkaç aykırı ülke) ödüllendirebilir.", "Doğru.", "Doğru.", "<b>Yanlış:</b> bilinen bir etiketi yeniden üretmek istiyorsak gözetimli öğrenme kullanırız. Gelir grubu bir dış kontroldür; kümelemenin değeri, bu etiketin göremediği yapıyı göstermesindedir."],
          en: ["<b>Wrong:</b> the silhouette is a geometric measure; it can reward distinct but uninteresting splits (for example a few outlier countries).", "Correct.", "Correct.", "<b>Wrong:</b> if we want to reproduce a known label we use supervised learning. The income group is an external check; the value of clustering lies in showing structure that this label cannot see."]
        }
      }
    ],
    quiz: [
      { q: { tr: "Siluet skoru neyi ölçer?", en: "What does the silhouette score measure?" }, options: { tr: ["Noktaların kendi kümelerine yakınlığını en yakın başka kümeye uzaklıkla karşılaştırır", "Kümelerin büyüklüğünü", "Kümelerin gelir gruplarıyla uyumunu"], en: ["It compares points' closeness to their own cluster with their distance to the nearest other cluster", "The size of the clusters", "The agreement of the clusters with income groups"] }, answer: 0, explain: { tr: "−1 ile 1 arasındadır.", en: "It lies between −1 and 1." } },
      { q: { tr: "k-ortalamalar aykırı değerlere karşı neden duyarlıdır?", en: "Why is k-means sensitive to outliers?" }, options: { tr: ["Kare uzaklıkları ve ortalamaları kullanır", "Ağaç tabanlıdır", "Yalnızca ikili değişkenlerle çalışır"], en: ["It uses squared distances and means", "It is tree-based", "It only works with binary variables"] }, answer: 0, explain: { tr: "Uzak bir nokta kendi kümesini kapabilir.", en: "A distant point can grab a cluster of its own." } },
      { q: { tr: "<code>n_init=10</code> ne işe yarar?", en: "What does <code>n_init=10</code> do?" }, options: { tr: ["Algoritmayı 10 farklı başlangıçla çalıştırıp en düşük inertialı çözümü seçer", "10 küme kurar", "10 kat çapraz doğrulama yapar"], en: ["It runs the algorithm from 10 different starts and keeps the solution with the lowest inertia", "It builds 10 clusters", "It runs 10-fold cross-validation"] }, answer: 0, explain: { tr: "Tek başlangıç kötü bir yerel çözüme takılabilir.", en: "A single start can get stuck in a bad local solution." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 3 — PCA: getiri eğrisinin üç faktörü                              */
  /* =================================================================== */
  U.push({
    id: "m7-u3", minutes: 30, packages: PK, data: D.F_YC,
    title: { tr: "Temel bileşenler analizi: getiri eğrisinin üç faktörü", en: "Principal component analysis: the three factors of the yield curve" },
    blurb: { tr: "ABD Hazine faizleri sekiz vadede neredeyse birlikte hareket eder. Temel bileşenler analizi (PCA), sekiz seriyi az sayıda bağımsız bileşene indirger: düzey, eğim ve eğrilik, faizlerdeki hareketin %99,97'sini açıklar.", en: "US Treasury yields at eight maturities move almost together. Principal component analysis (PCA) reduces the eight series to a few independent components: level, slope and curvature explain 99.97% of the movement in yields." },
    terms: [{ tr: "temel bileşen", en: "principal component" }, { tr: "açıklanan varyans oranı", en: "explained variance ratio" }, { tr: "yükleme (loading)", en: "loading" }, { tr: "getiri eğrisi", en: "yield curve" }],
    concept: C0,
    playground: { type: "yieldPCA", intro: { tr: "Bir ay seç ve o ayın getiri eğrisini 1, 2 ya da 3 bileşenle yeniden kur. Yeniden kurulan eğrinin gerçeğe ne kadar yaklaştığına bak.", en: "Pick a month and rebuild that month's yield curve with 1, 2 or 3 components. See how close the rebuilt curve gets to the real one." }, takeaway: { tr: "Tek bileşen eğriyi yukarı aşağı kaydırır, ikincisi eğer, üçüncüsü büker. Üç sayı, sekiz faizi neredeyse kusursuz özetler.", en: "One component shifts the curve up and down, the second tilts it, the third bends it. Three numbers summarise eight yields almost perfectly." } },
    cells: [
      {
        id: "m7-u3-c1", kind: "run",
        task: { tr: "1976'dan bu yana aylık sekiz vadeli ABD Hazine faizlerini (3 ay–10 yıl, FRED) okuyup vadeler arası korelasyona ve PCA'nın açıklanan varyans oranlarına bakıyoruz. Önce tahmin et.", en: "We read monthly US Treasury yields at eight maturities since 1976 (3 months–10 years, FRED) and look at the correlations across maturities and PCA's explained variance ratios. Predict first." },
        predict: { q: { tr: "İlk bileşen sekiz faizin toplam varyansının ne kadarını açıklar?", en: "How much of the total variance of the eight yields does the first component explain?" }, options: { tr: ["Yaklaşık 1/8'ini (%12,5)", "Yaklaşık yarısını", "%95'ten fazlasını"], en: ["About 1/8 (12.5%)", "About half", "More than 95%"] }, answer: 2, explain: { tr: "Faizler genellikle birlikte yükselir ve düşer: bir vadeyi bilmek ötekileri büyük ölçüde söyler. İlk bileşen bu ortak hareketi yakalar.", en: "Yields usually rise and fall together: knowing one maturity largely tells you the others. The first component captures this common movement." } },
        code: { tr: YC.tr + `
print(f"{egri.index[0]:%Y-%m} – {egri.index[-1]:%Y-%m}: {len(egri)} ay")
print("Vadeler arası en düşük korelasyon:", round(egri.corr().values.min(), 3))
pca = PCA().fit(egri)                                     # faizler aynı birimde (yüzde): ölçekleme gerekmez
print("Açıklanan varyans oranları:", pca.explained_variance_ratio_.round(4).tolist())
print("İlk üç bileşenin toplamı:", round(pca.explained_variance_ratio_[:3].sum(), 4))`, en: YC.en + `
print(f"{curve.index[0]:%Y-%m} – {curve.index[-1]:%Y-%m}: {len(curve)} months")
print("Lowest correlation across maturities:", round(curve.corr().values.min(), 3))
pca = PCA().fit(curve)                                    # yields share a unit (percent): no scaling needed
print("Explained variance ratios:", pca.explained_variance_ratio_.round(4).tolist())
print("Sum of the first three components:", round(pca.explained_variance_ratio_[:3].sum(), 4))` },
        after: { tr: "En uzak iki vade (3 ay ve 10 yıl) arasında bile korelasyon 0,93. İlk bileşen varyansın %98,1'ini, ilk üçü %99,97'sini açıklıyor. Sekiz seri aslında üç boyutlu bir hareketin sekiz görünümü. Burada ölçekleme yapmadık: bütün faizler aynı birimde (yüzde) ve vadeler arası varyans farkı da bilginin bir parçası.", en: "Even between the two most distant maturities (3 months and 10 years) the correlation is 0.93. The first component explains 98.1% of the variance, the first three 99.97%. The eight series are really eight views of a three-dimensional movement. We did not scale here: all yields share a unit (percent) and the difference in variance across maturities is part of the information." }
      },
      {
        id: "m7-u3-c2", kind: "run",
        task: { tr: "İlk üç bileşenin yüklemelerine (her vadenin bileşendeki ağırlığına) bakıyoruz. Yükleme biçimleri bileşenlere ad vermemizi sağlar.", en: "We look at the loadings of the first three components (each maturity's weight in the component). The shapes of the loadings let us name the components." },
        code: { tr: YC.tr + `
pca = PCA(n_components=3).fit(egri)
yuk = pd.DataFrame(pca.components_.T, index=egri.columns, columns=["PC1", "PC2", "PC3"])
yuk = yuk * np.sign(yuk.loc["10y"])                       # işaret keyfidir: 10 yıl vadesi pozitif olsun
print(yuk.round(2).to_string())`, en: YC.en + `
pca = PCA(n_components=3).fit(curve)
load = pd.DataFrame(pca.components_.T, index=curve.columns, columns=["PC1", "PC2", "PC3"])
load = load * np.sign(load.loc["10y"])                    # the sign is arbitrary: make the 10-year positive
print(load.round(2).to_string())` },
        after: { tr: "PC1'de bütün vadelerin ağırlığı benzer (0,33–0,37): bütün eğri birlikte yükselip alçalır, buna <b>düzey</b> denir. PC2'de kısa vadeler negatif, uzun vadeler pozitif: uzun ve kısa vadeli faiz arasındaki fark, yani <b>eğim</b>. PC3'te uçlar pozitif, ortası negatif: eğrinin ortasının bükülmesi, yani <b>eğrilik</b>. Litterman ve Scheinkman'ın (1991) bulgusu bugünkü veriyle de geçerli. Adları biz verdik: PCA yalnızca sayıları üretir.", en: "In PC1 all maturities have similar weights (0.33–0.37): the whole curve rises and falls together, called the <b>level</b>. In PC2 short maturities are negative and long ones positive: the gap between long and short rates, the <b>slope</b>. In PC3 the ends are positive and the middle negative: the bending of the middle of the curve, the <b>curvature</b>. Litterman and Scheinkman's (1991) finding still holds with today's data. We gave the names: PCA only produces the numbers." }
      },
      {
        id: "m7-u3-c3", kind: "fill",
        task: { tr: "Faizleri üç bileşene indirge ve her ay için üç bileşen değerini (skorları) hesapla.", en: "Reduce the yields to three components and compute the three component values (scores) for every month." },
        code: { tr: YC.tr + `
pca = PCA(n_components=___).fit(egri)
skor = pca.transform(egri)                                # her ay için bileşen değerleri
print("Skor matrisi:", skor.shape)
print("Açıklanan varyans:", round(pca.explained_variance_ratio_.sum(), 4))`, en: YC.en + `
pca = PCA(n_components=___).fit(curve)
scores = pca.transform(curve)                             # component values for every month
print("Score matrix:", scores.shape)
print("Explained variance:", round(pca.explained_variance_ratio_.sum(), 4))` },
        solution: { tr: YC.tr + `
pca = PCA(n_components=3).fit(egri)
skor = pca.transform(egri)                                # her ay için bileşen değerleri
print("Skor matrisi:", skor.shape)
print("Açıklanan varyans:", round(pca.explained_variance_ratio_.sum(), 4))`, en: YC.en + `
pca = PCA(n_components=3).fit(curve)
scores = pca.transform(curve)                             # component values for every month
print("Score matrix:", scores.shape)
print("Explained variance:", round(pca.explained_variance_ratio_.sum(), 4))` },
        hints: [{ tr: "Düzey, eğim ve eğrilik: üç bileşen.", en: "Level, slope and curvature: three components." }],
        checks: [{ py: { tr: "pca.n_components_ == 3 and skor.shape[1] == 3", en: "pca.n_components_ == 3 and scores.shape[1] == 3" }, msg: { tr: "Üç bileşen olmalı.", en: "There should be three components." } }],
        after: { tr: "Her ay artık sekiz faiz yerine üç sayıyla temsil ediliyor. Bu skorlar sonraki modellerde değişken olarak kullanılabilir: sekiz yüksek korelasyonlu faiz yerine üç ilişkisiz özet. Modül 3'teki çoklu doğrusal bağlantı sorununun bir çözümü de budur.", en: "Every month is now represented by three numbers instead of eight yields. These scores can be used as variables in later models: three uncorrelated summaries instead of eight highly correlated yields. This is also one solution to the multicollinearity problem of Module 3." }
      },
      {
        id: "m7-u3-c4", kind: "run",
        task: { tr: "Verdiğimiz adlar doğru mu? Bileşen skorlarını gözlenebilir ölçülerle karşılaştırıyoruz: ortalama faiz (düzey), 10 yıl − 3 ay farkı (eğim) ve 2 × 2 yıl − 3 ay − 10 yıl (eğrilik).", en: "Are the names we gave right? We compare the component scores with observable measures: the average yield (level), the 10-year − 3-month spread (slope) and 2 × 2-year − 3-month − 10-year (curvature)." },
        code: { tr: YC.tr + `
skor = PCA(n_components=3).fit_transform(egri)
olcu = {"düzey  : ortalama faiz      ": egri.mean(axis=1),
        "eğim   : 10y − 3a            ": egri["10y"] - egri["3a"],
        "eğrilik: 2×2y − 3a − 10y     ": 2 * egri["2y"] - egri["3a"] - egri["10y"]}
for j, (ad, o) in enumerate(olcu.items()):
    print(f"PC{j + 1} ~ {ad} |korelasyon| = {abs(np.corrcoef(skor[:, j], o)[0, 1]):.3f}")`, en: YC.en + `
scores = PCA(n_components=3).fit_transform(curve)
obs = {"level    : average yield     ": curve.mean(axis=1),
       "slope    : 10y − 3m          ": curve["10y"] - curve["3m"],
       "curvature: 2×2y − 3m − 10y   ": 2 * curve["2y"] - curve["3m"] - curve["10y"]}
for j, (name, o) in enumerate(obs.items()):
    print(f"PC{j + 1} ~ {name} |correlation| = {abs(np.corrcoef(scores[:, j], o)[0, 1]):.3f}")` },
        after: { tr: "Düzey (korelasyon 1,00) ve eğim (0,98) adları güçlü biçimde doğrulanıyor; eğrilik (0,62) daha zayıf ama belirgin. Bu adımı atlamamak gerekir: PCA bileşenlerine ad vermek bir yorumdur ve bir dış ölçüyle sınanmalıdır. Not: işaret keyfi olduğundan korelasyonun mutlak değerine bakıyoruz.", en: "The level (correlation 1.00) and slope (0.98) names are strongly confirmed; curvature (0.62) is weaker but clear. This step should not be skipped: naming PCA components is an interpretation and should be tested against an external measure. Note: since the sign is arbitrary we look at the absolute value of the correlation." }
      },
      {
        id: "m7-u3-c5", kind: "interpret",
        task: { tr: "YZ getiri eğrisi PCA'sını yorumladı. Hangi cümleler yanlış?", en: "The AI interpreted the yield-curve PCA. Which sentences are wrong?" },
        prompt: { tr: "ABD Hazine faizlerinde ilk üç bileşen varyansın %99,97'sini açıklıyor. Bunu yorumlar mısın?", en: "In US Treasury yields the first three components explain 99.97% of the variance. Can you interpret this?" },
        sentences: {
          tr: ["Sekiz faizin hareketi pratikte üç bağımsız faktörle özetlenebilir.", "PCA, düzey bileşeninin Fed politikasından kaynaklandığını kanıtlar.", "Bileşenlerin işareti keyfidir; yorum yüklemelerin biçimine dayanır.", "Bileşenler ilişkisiz olduğundan bir regresyonda çoklu doğrusal bağlantı sorunu yaratmazlar."],
          en: ["The movement of the eight yields can in practice be summarised by three independent factors.", "PCA proves that the level component comes from Fed policy.", "The sign of the components is arbitrary; the interpretation rests on the shape of the loadings.", "Since the components are uncorrelated, they do not create multicollinearity in a regression."]
        },
        bad: [1],
        explain: {
          tr: ["Doğru.", "<b>Yanlış:</b> PCA veriyi betimler, nedenini söylemez. Düzey bileşeninin para politikası ve enflasyon beklentileriyle ilişkili olduğu iktisat bilgisinden ve başka analizlerden gelir.", "Doğru.", "Doğru: skorlar örneklemde ilişkisizdir."],
          en: ["Correct.", "<b>Wrong:</b> PCA describes the data; it does not say why. That the level component relates to monetary policy and inflation expectations comes from economic knowledge and other analyses.", "Correct.", "Correct: the scores are uncorrelated in the sample."]
        }
      }
    ],
    quiz: [
      { q: { tr: "PCA'nın ilk bileşeni nedir?", en: "What is the first principal component?" }, options: { tr: ["Verinin en çok değiştiği yön", "En büyük değişken", "Ortalama satır"], en: ["The direction in which the data vary most", "The largest variable", "The average row"] }, answer: 0, explain: { tr: "Sonraki bileşenler öncekilere dik olarak kalan varyansın en büyüğünü yakalar.", en: "Later components capture the largest remaining variance, orthogonal to the earlier ones." } },
      { q: { tr: "Getiri eğrisinde ikinci bileşenin yüklemeleri kısa vadede negatif, uzun vadede pozitif. Bu bileşen neyi temsil eder?", en: "In the yield curve the second component's loadings are negative at short and positive at long maturities. What does it represent?" }, options: { tr: ["Eğimi", "Düzeyi", "Volatiliteyi"], en: ["The slope", "The level", "Volatility"] }, answer: 0, explain: { tr: "Uzun ve kısa faiz farkı.", en: "The gap between long and short rates." } },
      { q: { tr: "Getiri eğrisi PCA'sında neden ölçekleme yapmadık?", en: "Why did we not scale in the yield-curve PCA?" }, options: { tr: ["Bütün değişkenler aynı birimde ve varyans farkları anlamlı", "PCA ölçeklemeyle çalışmaz", "Veri azdı"], en: ["All variables share a unit and the variance differences are meaningful", "PCA does not work with scaling", "There were few data"] }, answer: 0, explain: { tr: "Farklı birimlerde ölçekleme gerekir (Ünite 4).", en: "With different units scaling is needed (Unit 4)." } }
    ]
  });

  /* =================================================================== */
  /* Ünite 4 — PCA ile ülke haritası                                         */
  /* =================================================================== */
  const U4A = {
    tr: WB.tr + `
pca = PCA().fit(ulke[deg])                                # sekiz göstergenin PCA'sı
oran = pca.explained_variance_ratio_
print("İlk bileşenin açıkladığı varyans:", round(oran[0], 4))`,
    en: WB.en + `
pca = PCA().fit(ctry[cols])                               # PCA of the eight indicators
ratio = pca.explained_variance_ratio_
print("Variance explained by the first component:", round(ratio[0], 4))`
  };
  const PCAI = { tr: `\nfrom sklearn.decomposition import PCA`, en: `\nfrom sklearn.decomposition import PCA` };
  U4A.tr = U4A.tr.replace("\npca = PCA()", PCAI.tr + "\npca = PCA()");
  U4A.en = U4A.en.replace("\npca = PCA()", PCAI.en + "\npca = PCA()");
  U.push({
    id: "m7-u4", minutes: 25, packages: PK, data: D.F_WB,
    title: { tr: "PCA ile ülke haritası: boyut indirgeme ve kümeleme birlikte", en: "A country map with PCA: dimension reduction and clustering together" },
    blurb: { tr: "Sekiz göstergeyi iki bileşene indirgeyip ülkeleri bir haritaya yerleştiriyoruz. İlk bileşen bir “kalkınma” ekseni, ikincisi bir “makro istikrarsızlık” ekseni. Farklı birimlerde ölçeklemeden PCA yapmak, tek bir değişkenin PCA'sıdır.", en: "We reduce the eight indicators to two components and place the countries on a map. The first component is a “development” axis, the second a “macro instability” axis. PCA with different units and no scaling is the PCA of a single variable." },
    terms: [{ tr: "boyut indirgeme", en: "dimension reduction" }, { tr: "biplot", en: "biplot" }, { tr: "en yakın komşu", en: "nearest neighbour" }],
    concept: C0,
    playground: { type: "countryMap", intro: { tr: "157 ülke, ilk iki bileşenin haritasında. Renkleri k-ortalamalar kümelerine ya da Dünya Bankası gelir gruplarına göre değiştir; bir ülke seç ve sekiz boyuttaki en yakın komşularını gör.", en: "157 countries on the map of the first two components. Colour them by k-means clusters or by World Bank income groups; pick a country and see its nearest neighbours in eight dimensions." }, takeaway: { tr: "Haritada yakın görünen iki ülke sekiz boyutta uzak olabilir: iki bileşen bilginin yalnızca üçte ikisini taşır.", en: "Two countries that look close on the map can be far apart in eight dimensions: two components carry only two thirds of the information." } },
    cells: [
      {
        id: "m7-u4-c1", kind: "run",
        task: { tr: "Ölçeklenmiş sekiz göstergenin (<code>Z</code>) PCA'sını alıp açıklanan varyans oranlarına ve ilk iki bileşenin yüklemelerine bakıyoruz.", en: "We take the PCA of the eight scaled indicators (<code>Z</code>) and look at the explained variance ratios and the loadings of the first two components." },
        code: { tr: WB.tr + PCAI.tr + `
pca = PCA().fit(Z)
print("Açıklanan varyans oranları:", pca.explained_variance_ratio_.round(3).tolist())
yuk = pd.DataFrame(pca.components_[:2].T, index=deg, columns=["PC1", "PC2"])
yuk = yuk * np.sign(yuk.loc[["gdppc_ppp", "unemployment"]].values.diagonal())   # işaret: gelir ve işsizlik pozitif
print(yuk.round(2).to_string())`, en: WB.en + PCAI.en + `
pca = PCA().fit(Z)
print("Explained variance ratios:", pca.explained_variance_ratio_.round(3).tolist())
load = pd.DataFrame(pca.components_[:2].T, index=cols, columns=["PC1", "PC2"])
load = load * np.sign(load.loc[["gdppc_ppp", "unemployment"]].values.diagonal())  # sign: income and unemployment positive
print(load.round(2).to_string())` },
        after: { tr: "İlk bileşen varyansın %54'ünü açıklıyor: gelir, kentleşme ve yaşam süresi pozitif; tarım ve doğurganlık negatif ağırlıkta. Bu bir <b>kalkınma</b> ekseni. İkinci bileşen (%14) işsizlik ve enflasyonla yükleniyor: bir <b>makro istikrarsızlık</b> ekseni. İki bileşen birlikte %68: harita bilginin üçte ikisini taşıyor, üçte birini kaybediyor.", en: "The first component explains 54% of the variance: income, urbanisation and life expectancy have positive weights; agriculture and fertility negative ones. This is a <b>development</b> axis. The second component (14%) loads on unemployment and inflation: a <b>macro instability</b> axis. Together the two components give 68%: the map carries two thirds of the information and loses one third." }
      },
      {
        id: "m7-u4-c2", kind: "run",
        task: { tr: "Türkiye'nin haritadaki yerine ve sekiz boyutlu uzayda (ölçeklenmiş) en çok benzediği beş ülkeye bakıyoruz.", en: "We look at Türkiye's place on the map and the five countries it most resembles in the eight-dimensional (scaled) space." },
        code: { tr: WB.tr + PCAI.tr + `
skor = PCA(n_components=2).fit_transform(Z)
i = ulke.index[ulke["iso3"] == "TUR"][0]
print("Türkiye:", ulke.loc[i, deg].round(1).to_dict())
uzak = np.sqrt(((Z - Z[i]) ** 2).sum(axis=1))             # sekiz boyutta Öklid uzaklığı
sira = np.argsort(uzak)[1:6]
print("En yakın beş ülke:", [(ulke.loc[j, "country"], round(uzak[j], 2)) for j in sira])
print("Haritada Türkiye: PC1 = %.2f, PC2 = %.2f (işaretler keyfi)" % tuple(np.abs(skor[i])))`, en: WB.en + PCAI.en + `
scores = PCA(n_components=2).fit_transform(Z)
i = ctry.index[ctry["iso3"] == "TUR"][0]
print("Türkiye:", ctry.loc[i, cols].round(1).to_dict())
dist = np.sqrt(((Z - Z[i]) ** 2).sum(axis=1))             # Euclidean distance in eight dimensions
order = np.argsort(dist)[1:6]
print("Five nearest countries:", [(ctry.loc[j, "country"], round(dist[j], 2)) for j in order])
print("Türkiye on the map: PC1 = %.2f, PC2 = %.2f (signs arbitrary)" % tuple(np.abs(scores[i])))` },
        after: { tr: "Türkiye'nin sekiz göstergede en yakın komşuları Uruguay, Şili, Brezilya, Kosta Rika ve Kolombiya: kentleşmiş, orta-üst gelirli, doğurganlığı düşmüş ve enflasyonu ortalamanın üstünde Latin Amerika ekonomileri. Bu, bir nedensellik ya da politika benzerliği iddiası değil, seçilen sekiz göstergede bir benzerlik ölçüsü. Başka göstergeler (kurumlar, sanayi yapısı) başka komşular verir.", en: "Türkiye's nearest neighbours on the eight indicators are Uruguay, Chile, Brazil, Costa Rica and Colombia: urbanised, upper-middle-income Latin American economies with falling fertility and above-average inflation. This is not a claim of causality or similar policies, but a measure of similarity on the eight chosen indicators. Other indicators (institutions, industrial structure) would give other neighbours." }
      },
      {
        id: "m7-u4-c3", kind: "audit",
        task: { tr: "YZ ülke göstergelerinin PCA'sını aldı. Hatalı satırı bul ve düzelt: PCA ölçeklenmiş veriyle (<code>Z</code>) yapılsın.", en: "The AI took the PCA of the country indicators. Find the faulty line and fix it: the PCA should be done on the scaled data (<code>Z</code>)." },
        ai: {
          prompt: { tr: "Sekiz kalkınma göstergesinin kaç boyutta özetlenebileceğini PCA ile bul.", en: "Find with PCA in how many dimensions the eight development indicators can be summarised." },
          reply: { tr: "Göstergelerin PCA'sını alalım:", en: "Let us take the PCA of the indicators:" },
          code: U4A,
          claim: { tr: "İlk bileşen varyansın %99,99'unu açıklıyor: kalkınma tek boyutludur, tek bir endeks yeterlidir.", en: "The first component explains 99.99% of the variance: development is one-dimensional, a single index is enough." }
        },
        bugLines: [ln(U4A.tr, "pca = PCA().fit(ulke[deg])")],
        lineExplain: { tr: "Ham göstergelerde kişi başı gelir binlerle (1.136–132.396 $), doğurganlık birlerle ölçülüyor. PCA varyansı en büyük yönü arar; gelirin varyansı ötekilerden milyonlarca kat büyük olduğu için ilk bileşen yalnızca gelirdir. Farklı birimlerde PCA, standartlaştırılmış veriyle yapılmalı: <code>PCA().fit(Z)</code>.", en: "In the raw indicators income per head is measured in thousands (1,136–132,396 $) and fertility in single digits. PCA looks for the direction of largest variance; since income's variance is millions of times larger than the others', the first component is just income. With different units PCA must be done on standardised data: <code>PCA().fit(Z)</code>." },
        hints: [{ tr: "<code>ulke[deg]</code> yerine <code>Z</code>.", en: "<code>Z</code> instead of <code>ctry[cols]</code>." }],
        solution: { tr: U4A.tr.replace("pca = PCA().fit(ulke[deg])", "pca = PCA().fit(Z)"), en: U4A.en.replace("pca = PCA().fit(ctry[cols])", "pca = PCA().fit(Z)") },
        checks: [{ py: { tr: "abs(oran[0] - PCA().fit(Z).explained_variance_ratio_[0]) < 1e-9", en: "abs(ratio[0] - PCA().fit(Z).explained_variance_ratio_[0]) < 1e-9" }, msg: { tr: "PCA, <code>Z</code> ile kurulmalı.", en: "The PCA should be fitted on <code>Z</code>." } }],
        after: { tr: "Ölçeklenmiş veriyle ilk bileşen %54: kalkınma güçlü bir ortak eksen ama tek boyutlu değil. “%99,99” bir bulgu değil, birim seçiminin yan ürünüydü: geliri bin dolar cinsinden ölçseydik sonuç değişirdi. Bir sonucun birim değişikliğiyle değişmesi, analizde bir hata olduğunun işaretidir.", en: "With scaled data the first component is 54%: development is a strong common axis but not one-dimensional. The “99.99%” was not a finding but a by-product of the choice of units: had we measured income in thousands of dollars the result would have changed. A result that changes with a change of units is a sign of an error in the analysis." }
      },
      {
        id: "m7-u4-c4", kind: "interpret",
        task: { tr: "YZ ülke haritasını yorumladı. Hangi cümleler yanlış?", en: "The AI interpreted the country map. Which sentences are wrong?" },
        prompt: { tr: "Ülkeleri ilk iki bileşenin haritasına yerleştirdim. Türkiye, Uruguay ve Şili'ye yakın. Bunu nasıl yorumlarım?", en: "I placed the countries on the map of the first two components. Türkiye is close to Uruguay and Chile. How do I interpret this?" },
        sentences: {
          tr: ["Türkiye, seçilen sekiz göstergede bu ülkelere benziyor.", "Haritadaki uzaklıklar sekiz boyuttaki uzaklıkların yalnızca bir yaklaşımıdır; harita varyansın üçte birini göstermez.", "Türkiye bu ülkelerin politikalarını uygularsa aynı sonuçları elde eder.", "PC1 kalkınma eksenidir, çünkü PCA bu ekseni kalkınmayı ölçmek için tasarlamıştır."],
          en: ["Türkiye resembles these countries on the eight chosen indicators.", "Distances on the map are only an approximation of distances in eight dimensions; the map does not show a third of the variance.", "If Türkiye applies these countries' policies it will get the same results.", "PC1 is the development axis because PCA designed this axis to measure development."]
        },
        bad: [2, 3],
        explain: {
          tr: ["Doğru.", "Doğru.", "<b>Yanlış:</b> benzerlik nedensellik değildir; göstergelerdeki benzerlik politikaların aynı etkiyi yapacağını söylemez.", "<b>Yanlış:</b> PCA yalnızca en büyük varyans yönünü bulur. “Kalkınma” adını yüklemelere bakarak biz veririz."],
          en: ["Correct.", "Correct.", "<b>Wrong:</b> similarity is not causality; similar indicators do not say that policies will have the same effect.", "<b>Wrong:</b> PCA only finds the direction of largest variance. We give the name “development” by looking at the loadings."]
        }
      }
    ],
    quiz: [
      { q: { tr: "Farklı birimlerdeki değişkenlerle PCA yaparken ne yapılmalı?", en: "What should be done when running PCA on variables in different units?" }, options: { tr: ["Değişkenler standartlaştırılmalı", "En büyük değişken atılmalı", "Hiçbir şey; PCA birimden bağımsızdır"], en: ["The variables should be standardised", "The largest variable should be dropped", "Nothing; PCA is unit-free"] }, answer: 0, explain: { tr: "Aksi hâlde en büyük varyanslı değişken baskın olur.", en: "Otherwise the variable with the largest variance dominates." } },
      { q: { tr: "İki bileşen varyansın %68'ini açıklıyorsa haritada ne kaybolur?", en: "If two components explain 68% of the variance, what is lost on the map?" }, options: { tr: ["Varyansın %32'si: bazı farklar görünmez", "Hiçbir şey", "Ülkelerin üçte biri"], en: ["32% of the variance: some differences are invisible", "Nothing", "A third of the countries"] }, answer: 0, explain: { tr: "Haritada yakın iki ülke gerçekte uzak olabilir.", en: "Two countries close on the map can actually be far apart." } }
    ]
  });
})();
