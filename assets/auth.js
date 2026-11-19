/* ML Laboratuvarı · Hesap ve ilerleme senkronu / Account and progress sync
 *
 * Yalnızca songurmehmet.com üzerinde etkindir. Başka bir adreste (GitHub Pages, yerel kopya,
 * claude.ai) hiçbir şey yapmaz; site hesapsız çalışmaya devam eder.
 * Active only on songurmehmet.com. Elsewhere it does nothing and the lab runs without accounts.
 *
 * Giriş: Wix'in barındırdığı giriş sayfası (e-posta veya Google), OAuth 2.0 + PKCE.
 * İlerleme: Wix CMS "MLLabIlerleme" koleksiyonu; her üye yalnızca kendi satırını okur ve yazar.
 * Login: Wix-hosted login page (email or Google), OAuth 2.0 + PKCE.
 * Progress: Wix CMS collection "MLLabIlerleme"; each member reads and writes only their own row.
 * Belgeler / docs:
 *   https://dev.wix.com/docs/go-headless/authentication/members/wix-login-page/add-a-wix-login-page-rest
 *   https://dev.wix.com/docs/go-headless/authentication/members/identity-providers/sign-in-with-google-or-facebook-rest
 */
(function () {
  "use strict";
  var HOSTS = ["www.songurmehmet.com", "songurmehmet.com"];
  var blockedTarget = null; // girişten sonra açılacak ders / lesson to open after login
  if (HOSTS.indexOf(location.hostname) < 0) return;

  var CLIENT_ID = "4e2c8b12-82af-49ae-893e-9b73e68f2865"; // herkese açık istemci kimliği, sır değildir / public client id, not a secret
  var API = "https://www.wixapis.com";
  var COLLECTION = "MLLabIlerleme";
  var GOOGLE_IDP = "0e6a50f5-b523-4e29-990d-f37fa2ffdd69";
  var TOKEN_KEY = "mllab.wix.tokens";
  var PKCE_KEY = "mllab.wix.pkce";
  var META_KEY = "mllab.wix.meta";
  var SYNC_FIELDS = ["cells", "quiz", "pg", "done", "code"];
  var CONSENT_KEY = "mllab.wix.consent";
  /* Yönetici hesabının e-postasının SHA-256 özeti (e-posta kodda açık yazılmaz); bu hesapta tüm modüller açık.
     SHA-256 of the admin account's email (the email itself is not in the code); all modules are open for it. */
  var ADMIN_HASH = "6b036e3f5cd4c740598389b651788fc11afd829430d67a11d98878e9662db55c";
  var CONSENT_VER = "v1-2026-11-19"; // aydınlatma metni sürümü / privacy notice version

  /* ---------------------------------------------------------------- */
  /* Belirteçler / Tokens                                              */
  /* ---------------------------------------------------------------- */
  function readJSON(k) { try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : null; } catch (e) { return null; } }
  function writeJSON(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } }

  function mint(body, role) {
    var payload = { clientId: CLIENT_ID };
    for (var k in body) payload[k] = body[k];
    return fetch(API + "/oauth2/token", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      .then(function (r) { if (!r.ok) throw new Error("auth " + r.status); return r.json(); })
      .then(function (d) { return { accessToken: d.access_token, refreshToken: d.refresh_token, expiresAt: Date.now() + d.expires_in * 1000, role: role }; });
  }
  var pending = null;
  function accessToken() {
    var t = readJSON(TOKEN_KEY);
    if (t && t.accessToken && t.expiresAt - 60000 > Date.now()) return Promise.resolve(t.accessToken);
    if (pending) return pending;
    pending = (t && t.refreshToken
      ? mint({ grantType: "refresh_token", refreshToken: t.refreshToken }, t.role || "visitor").catch(function () { return mint({ grantType: "anonymous" }, "visitor"); })
      : mint({ grantType: "anonymous" }, "visitor"))
      .then(function (fresh) { writeJSON(TOKEN_KEY, fresh); return fresh.accessToken; })
      .finally(function () { pending = null; });
    return pending;
  }
  function isMember() { var t = readJSON(TOKEN_KEY); return !!(t && t.role === "member" && t.refreshToken); }

  function api(path, opts) {
    opts = opts || {};
    return accessToken().then(function (tok) {
      return fetch(API + path, {
        method: opts.method || "POST",
        headers: { Authorization: tok, "Content-Type": "application/json" },
        body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
        keepalive: !!opts.keepalive
      });
    }).then(function (r) {
      if (!r.ok) {
        var err = new Error("HTTP " + r.status); err.status = r.status;
        return r.text().then(function (txt) { err.body = txt; throw err; });
      }
      return r.status === 204 ? null : r.json();
    });
  }

  /* ---------------------------------------------------------------- */
  /* PKCE ve giriş akışı / PKCE and login flow                         */
  /* ---------------------------------------------------------------- */
  function b64url(bytes) { var s = ""; for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
  function randomString() { return b64url(crypto.getRandomValues(new Uint8Array(32))); }
  function challengeOf(verifier) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier)).then(function (d) { return b64url(new Uint8Array(d)); });
  }
  function baseUrl() { return location.origin + location.pathname.replace(/[^/]*$/, ""); }
  function callbackUrl() { return baseUrl() + "giris.html"; }
  function homeUrl() { return baseUrl() + "index.html"; }
  function curLang() { return window.LAB && LAB.getLang ? LAB.getLang() : (document.documentElement.lang || "tr"); }

  function startLogin(useGoogle) {
    var verifier = randomString(), state = randomString();
    return challengeOf(verifier).then(function (challenge) {
      writeJSON(PKCE_KEY, { verifier: verifier, state: state, ret: blockedTarget || location.hash || "#home", at: Date.now() });
      var req = {
        redirectUri: callbackUrl(), clientId: CLIENT_ID, codeChallenge: challenge, codeChallengeMethod: "S256",
        responseMode: "fragment", responseType: "code", scope: "offline_access", state: state
      };
      if (useGoogle) req.idp = GOOGLE_IDP;
      return api("/_api/redirects-api/v1/redirect-session", { body: { auth: { authRequest: req }, preferences: { additionalQueryParameters: { lang: curLang() } } } });
    }).then(function (res) {
      var url = res && res.redirectSession && res.redirectSession.fullUrl;
      if (!url) throw new Error("no login url");
      location.assign(url);
    });
  }

  /* giris.html bunu çağırır / called by giris.html */
  function completeLogin() {
    var saved = readJSON(PKCE_KEY);
    var p = new URLSearchParams((location.hash || "").replace(/^#/, ""));
    var code = p.get("code"), state = p.get("state"), error = p.get("error") || p.get("errorDescription");
    var ret = saved && saved.ret ? saved.ret : "#home";
    if (error) return Promise.resolve({ ok: false, reason: error, ret: ret });
    if (!saved || !code || state !== saved.state) return Promise.resolve({ ok: false, reason: "state", ret: ret });
    return mint({ grantType: "authorization_code", code: code, codeVerifier: saved.verifier, redirectUri: callbackUrl() }, "member")
      .then(function (tok) {
        writeJSON(TOKEN_KEY, tok); writeJSON(PKCE_KEY, null); writeJSON(META_KEY, null);
        return { ok: true, ret: ret };
      }, function (e) { return { ok: false, reason: e.message, ret: ret }; });
  }

  function logout() {
    var target = homeUrl();
    return api("/_api/redirects-api/v1/redirect-session", { body: { logout: { clientId: CLIENT_ID }, callbacks: { postFlowUrl: target } } })
      .then(function (res) { return res && res.redirectSession && res.redirectSession.fullUrl; }, function () { return null; })
      .then(function (url) {
        writeJSON(TOKEN_KEY, null); writeJSON(META_KEY, null); writeJSON(CONSENT_KEY, null);
        clearLocalProgress();
        location.assign(url || target);
      });
  }

  /* Ortak bilgisayarda bir sonraki kişi görmesin diye çıkışta yerel ilerleme silinir (buluttaki kayıt kalır).
     On logout local progress is cleared so the next person on a shared computer does not see it (the cloud copy stays). */
  function clearLocalProgress() {
    try {
      var raw = localStorage.getItem("mllab.v1"), st = raw ? JSON.parse(raw) : {};
      SYNC_FIELDS.forEach(function (k) { st[k] = {}; });
      delete st.resetAt;
      localStorage.setItem("mllab.v1", JSON.stringify(st));
      if (window.LAB && LAB.store) SYNC_FIELDS.forEach(function (k) { LAB.store[k] = {}; });
    } catch (e) { /* ignore */ }
  }
  window.MLLabAuth = { completeLogin: completeLogin, homeUrl: homeUrl };
  if (!window.LAB || !LAB.store) return; // giriş geri dönüş sayfası / callback page: UI yok

  /* ---------------------------------------------------------------- */
  /* Senkron / Sync                                                    */
  /* ---------------------------------------------------------------- */
  var store = LAB.store;
  LAB.lockEnabled = true;   // modül kilidi yalnız bu sitede / module lock only on this site
  var S = { member: null, item: null, state: isMember() ? "loading" : "out", lastSync: null, error: null, busy: false, dirty: false };
  var meta = readJSON(META_KEY) || {};
  if (isMember() && meta.admin) LAB.unlockAll = true;
  function sha256hex(txt) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(txt)).then(function (d) {
      return Array.prototype.map.call(new Uint8Array(d), function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
    });
  }
  function checkAdmin(m) {
    var email = m && m.loginEmail ? String(m.loginEmail).trim().toLowerCase() : "";
    if (!email) return Promise.resolve(false);
    return sha256hex(email).then(function (hx) {
      var admin = hx === ADMIN_HASH;
      if (admin !== !!meta.admin) { meta.admin = admin; writeJSON(META_KEY, meta); }
      if (admin !== !!LAB.unlockAll) { LAB.unlockAll = admin; LAB.rerender(); }
      return admin;
    }, function () { return false; });
  }

  function memberName(m) {
    if (!m) return "";
    var c = m.contact || {};
    return [c.firstName, c.lastName].filter(Boolean).join(" ").trim();
  }
  function displayName() {
    return meta.name || memberName(S.member) || (S.member && S.member.profile && S.member.profile.nickname) || (S.member && S.member.loginEmail) || "";
  }

  function loadMember() {
    return api("/members/v1/members/my?fieldsets=FULL", { method: "GET" }).then(function (r) { return r && r.member ? r.member : null; });
  }
  function findItem() {
    return api("/data/v2/items/query", { body: { dataCollectionId: COLLECTION, query: { paging: { limit: 10 } } } }).then(function (r) {
      var items = (r && r.dataItems) || [];
      if (!items.length) return null;
      items.sort(function (a, b) { return String((b.data || {})._updatedDate && b.data._updatedDate.$date || "").localeCompare(String((a.data || {})._updatedDate && a.data._updatedDate.$date || "")); });
      return items[0];
    });
  }

  function consentRec() { return readJSON(CONSENT_KEY); }
  function consentText() {
    var c = consentRec() || (S.item && S.item.data && S.item.data.acikRiza ? { raw: S.item.data.acikRiza } : null);
    if (!c) return "";
    if (c.raw) return c.raw;
    return "Verildi / Given · " + c.ver + " · " + c.at;
  }
  function hasConsent() {
    var c = consentRec();
    if (c && c.ver === CONSENT_VER) return true;
    var raw = S.item && S.item.data && S.item.data.acikRiza;
    return !!(raw && raw.indexOf(CONSENT_VER) >= 0);
  }
  function giveConsent() { writeJSON(CONSENT_KEY, { ver: CONSENT_VER, at: new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC" }); }
  function emptyState() { return { cells: {}, quiz: {}, pg: {}, done: {}, code: {}, resetAt: 0 }; }
  function localState() { var o = { resetAt: store.resetAt || 0 }; SYNC_FIELDS.forEach(function (k) { o[k] = store[k] || {}; }); return o; }
  function union(a, b) { var o = {}; var k; for (k in a) if (a[k]) o[k] = a[k]; for (k in b) if (b[k]) o[k] = b[k]; return o; }
  function merge(local, remote) {
    remote = remote || emptyState();
    var lr = local.resetAt || 0, rr = remote.resetAt || 0;
    if (rr > lr) local = Object.assign(emptyState(), { resetAt: rr });   // başka cihazda sıfırlanmış / reset on another device
    else if (lr > rr) remote = Object.assign(emptyState(), { resetAt: lr });
    var out = { resetAt: Math.max(lr, rr) };
    out.cells = union(remote.cells || {}, local.cells || {});
    out.pg = union(remote.pg || {}, local.pg || {});
    out.done = union(remote.done || {}, local.done || {});
    out.quiz = {};
    var lq = local.quiz || {}, rq = remote.quiz || {}, k;
    for (k in rq) out.quiz[k] = Object.assign({}, rq[k]);
    for (k in lq) { out.quiz[k] = out.quiz[k] || {}; for (var i in lq[k]) if (lq[k][i] === true || out.quiz[k][i] !== true) out.quiz[k][i] = lq[k][i]; }
    out.code = Object.assign({}, remote.code || {}, local.code || {});   // yerel kod öncelikli / local code wins
    return out;
  }
  function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

  function summary(st) {
    var done = st.done || {}, tot = 0, got = 0, per = {}, ids = [];
    (LAB.catalog || []).forEach(function (c) {
      var d = 0;
      for (var k = 1; k <= c.units; k++) if (done[c.id + "-u" + k]) { d++; ids.push(c.id + "-u" + k); }
      tot += c.units; got += d;
      per[c.id] = c.units ? Math.round(100 * d / c.units) : 0;
    });
    return { per: per, tot: tot, got: got, ids: ids };
  }

  function buildData(st) {
    var sm = summary(st);
    var durum = st;
    if (JSON.stringify(durum).length > 400000) durum = Object.assign({}, st, { code: {} }); // CMS boyut sınırı / size guard
    var d = {
      adSoyad: meta.name || memberName(S.member) || "",
      eposta: (S.member && S.member.loginEmail) || "",
      tamamlanan: sm.got, toplam: sm.tot,
      tamamlananlar: sm.ids.join(", "),
      durum: durum,
      sonEtkinlik: new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC",
      acikRiza: consentText()
    };
    for (var i = 0; i <= 7; i++) d["m" + i] = sm.per["m" + i] || 0;
    return d;
  }

  function applyLocal(st) {
    var changed = false;
    SYNC_FIELDS.forEach(function (k) { if (!same(store[k] || {}, st[k] || {})) { store[k] = st[k] || {}; changed = true; } });
    if ((store.resetAt || 0) !== (st.resetAt || 0)) { store.resetAt = st.resetAt || 0; }
    return changed;
  }

  function push(st, keepalive) {
    var data = buildData(st);
    if (S.item && S.item.id) {
      data._id = S.item.id;
      return api("/data/v2/items/" + encodeURIComponent(S.item.id), { method: "PUT", keepalive: keepalive, body: { dataCollectionId: COLLECTION, dataItem: { id: S.item.id, data: data } } })
        .then(function (r) { S.item = r.dataItem; });
    }
    return api("/data/v2/items", { keepalive: keepalive, body: { dataCollectionId: COLLECTION, dataItem: { data: data } } })
      .then(function (r) { S.item = r.dataItem; });
  }

  var applying = false;
  function fullSync() {
    if (!isMember()) { S.state = "out"; render(); return Promise.resolve(); }
    S.busy = true; render();
    return loadMember().then(function (m) {
      S.member = m;
      return checkAdmin(m).then(findItem);
    }).then(function (item) {
      S.item = item;
      var remote = item && item.data && item.data.durum ? item.data.durum : null;
      if (item && item.data && item.data.adSoyad && !meta.name) { meta.name = item.data.adSoyad; writeJSON(META_KEY, meta); }
      var merged = merge(localState(), remote);
      applying = true;
      var changed = applyLocal(merged);
      if (changed) LAB.save();
      applying = false;
      S.state = "in"; S.error = null;
      var needName = !(meta.name || memberName(S.member));
      if (!hasConsent()) {   // rıza yoksa buluta yazma; önce sor / no consent: do not write, ask first
        S.lastSync = null; S.dirty = false;
        if (changed) LAB.rerender();
        askConsent(needName);
        return;
      }
      return push(merged).then(function () {
        S.lastSync = new Date(); S.dirty = false;
        if (changed) LAB.rerender();
        if (needName) askName();
      });
    }).catch(function (e) {
      applying = false;
      if (e && (e.status === 401 || e.status === 403) && !S.member) { writeJSON(TOKEN_KEY, null); S.state = "out"; }
      else { S.state = isMember() ? "in" : "out"; S.error = e && e.message ? e.message : String(e); }
    }).then(function () { S.busy = false; render(); if (S.state === "out") guard(); });
  }

  var timer = null;
  function schedule() {
    if (applying || !isMember() || S.state !== "in" || !hasConsent()) return;
    S.dirty = true;
    clearTimeout(timer);
    timer = setTimeout(flush, 4000);
  }
  function flush(keepalive) {
    clearTimeout(timer);
    if (!S.dirty || !isMember() || S.state !== "in") return Promise.resolve();
    S.dirty = false;
    return push(localState(), keepalive).then(function () { S.lastSync = new Date(); S.error = null; render(); }, function (e) { S.dirty = true; S.error = e.message; render(); });
  }
  LAB.hooks.afterSave = schedule;
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") flush(true); });

  function deleteCloud() {
    if (!S.item || !S.item.id) return Promise.resolve();
    return api("/data/v2/items/" + encodeURIComponent(S.item.id) + "?dataCollectionId=" + COLLECTION, { method: "DELETE" }).then(function () { S.item = null; });
  }

  /* ---------------------------------------------------------------- */
  /* Arayüz / UI                                                       */
  /* ---------------------------------------------------------------- */
  var TX = {
    login: { tr: "Giriş yap / Kayıt ol", en: "Log in / Sign up" },
    why: { tr: "Giriş yaparsan ilerlemen hesabına kaydedilir; başka cihazdan devam edebilirsin. Giriş zorunlu değil.", en: "Log in to save your progress to your account and continue on any device. Logging in is optional." },
    google: { tr: "Google ile devam et", en: "Continue with Google" },
    email: { tr: "E-posta ile giriş veya kayıt", en: "Log in or sign up with email" },
    privacy: { tr: "Giriş yapınca ad-soyadın, e-postan ve ünite ilerlemen Wix altyapısında saklanır ve yalnızca dersin yürütücüsü Prof. Dr. Mehmet Songur tarafından görülür. Amaç yalnızca ilerlemeni saklamak ve öğrenme sürecini izlemektir; başka biriyle paylaşılmaz. Bulut kaydını istediğin an silebilirsin; hesabının tamamen silinmesi için songurmehmet.com/iletisim.html sayfasındaki adresten yazabilirsin.", en: "When you log in, your name, email and unit progress are stored on Wix and seen only by the course instructor, Prof. Dr. Mehmet Songur. They are used only to save your progress and follow learning; they are not shared with anyone else. You can delete your cloud record at any time; to have your account removed entirely, use the contact details at songurmehmet.com/en/contact.html." },
    cancel: { tr: "Vazgeç", en: "Cancel" },
    saved: { tr: "Bulutta kayıtlı", en: "Saved to cloud" },
    saving: { tr: "Kaydediliyor…", en: "Saving…" },
    syncErr: { tr: "Buluta kaydedilemedi, tekrar denenecek", en: "Could not save to cloud, will retry" },
    logout: { tr: "Çıkış", en: "Log out" },
    del: { tr: "Bulut kaydımı sil", en: "Delete my cloud record" },
    delAsk: { tr: "Buluttaki ilerleme kaydın ve ad-soyad bilgin silinecek. Bu cihazdaki ilerleme durur. Ardından oturumun kapanır. Emin misin?", en: "Your cloud progress record and name will be deleted. Progress on this device stays. You will then be logged out. Are you sure?" },
    yes: { tr: "Evet, sil", en: "Yes, delete" },
    nameTitle: { tr: "Adın ve soyadın", en: "Your full name" },
    nameWhy: { tr: "Ders yürütücüsünün ilerlemeni tanıyabilmesi için ad-soyadını yaz.", en: "Enter your full name so the instructor can recognise your progress." },
    nameSave: { tr: "Kaydet", en: "Save" },
    failed: { tr: "Giriş başlatılamadı. Lütfen tekrar dene.", en: "Could not start login. Please try again." },
    loading: { tr: "Hesap denetleniyor…", en: "Checking account…" },
    edit: { tr: "Adı düzenle", en: "Edit name" },
    admin: { tr: "Yönetici · tüm modüller açık", en: "Admin · all modules open" },
    gateTitle: { tr: "Giriş yap veya kayıt ol", en: "Log in or sign up" },
    gateSub: { tr: "Modüller ve alıştırmalar ücretsiz bir hesapla açılır. Kayıt birkaç saniye sürer.", en: "Modules and exercises open with a free account. Signing up takes a few seconds." },
    free: { tr: "Ücretsiz hesap", en: "Free account" },
    appName: { tr: "ML Laboratuvarı", en: "ML Lab" },
    appSub: { tr: "Ekonomi ve Finansta ML", en: "ML in Economics and Finance" },
    pitchTitle: { tr: "Derslere başlamaya hazır mısın?", en: "Ready to start the lessons?" },
    fModules: { tr: "modül", en: "modules" },
    fUnits: { tr: "ünite", en: "units" },
    fModulesText: { tr: "Dersin konularını izleyen, gerçek ekonomi ve finans verisiyle çalışan alıştırmalar.", en: "Exercises that follow the course and work with real economic and financial data." },
    fPython: { tr: "Tarayıcıda gerçek Python", en: "Real Python in the browser" },
    fPythonText: { tr: "Kurulum yok; kod sayfada çalışır, atölyeler Colab'da.", en: "No installation; code runs on the page, workshops in Colab." },
    fSync: { tr: "İlerlemen seninle", en: "Your progress goes with you" },
    fSyncText: { tr: "Kaldığın yerden her cihazda devam et.", en: "Pick up where you left off on any device." },
    kvkkShort: { tr: "Ad-soyadın, e-postan ve ilerlemen yalnızca ilerlemeni saklamak ve ders yürütücüsünün öğrenme sürecini izlemesi için işlenir; başkasıyla paylaşılmaz.", en: "Your name, email and progress are processed only to save your progress and let the instructor follow the learning process; they are not shared with anyone else." },
    kvkkLink: { tr: "KVKK aydınlatma metni", en: "Privacy notice" },
    consentLabel: { tr: "<a href=\"{u}\" target=\"_blank\" rel=\"noopener\">Aydınlatma metnini</a> okudum. Kişisel verilerimin (ad-soyad, e-posta, ilerleme) saklanmasına açık rıza veriyorum.", en: "I have read the <a href=\"{u}\" target=\"_blank\" rel=\"noopener\">privacy notice</a>. I give my explicit consent to my personal data (name, email, progress) being stored." },
    consentNeed: { tr: "Devam etmek için onay kutusunu işaretle.", en: "Tick the box to continue." },
    consentTitle: { tr: "Açık rıza", en: "Explicit consent" },
    consentWhy: { tr: "İlerlemeni buluta kaydedebilmemiz için onayın gerekiyor. Onay vermezsen oturumun kapanır.", en: "We need your consent to save your progress to the cloud. If you do not consent, you will be logged out." },
    consentOk: { tr: "Onaylıyorum", en: "I consent" },
    consentNo: { tr: "Onaylamıyorum, çıkış yap", en: "I do not consent, log out" },
    back: { tr: "Ana sayfaya dön", en: "Back to the home page" },
    close: { tr: "Kapat", en: "Close" },
    gateNew: { tr: "Hesabın yoksa aynı düğmelerle kayıt olursun.", en: "No account yet? The same buttons sign you up." }
  };
  function tx(k) { var o = TX[k]; return o[curLang()] || o.tr; }
  var h = LAB.h;

  function modal(children) {
    var dlg = h("div", { class: "modal", role: "dialog", "aria-modal": "true" }, h("div", { class: "modal-box acct-modal" }, children));
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.remove(); });
    document.body.append(dlg);
    return dlg;
  }

  function askLogin() {
    var err = h("p", { class: "acct-err", role: "alert" });
    var dlg;
    function go(g, btn) {
      btn.disabled = true; err.textContent = "";
      startLogin(g).catch(function () { btn.disabled = false; err.textContent = tx("failed"); });
    }
    var bG = h("button", { class: "btn acct-google", onclick: function () { go(true, bG); } }, h("span", { class: "g-logo", "aria-hidden": "true" }, "G"), tx("google"));
    var bE = h("button", { class: "btn ghost", onclick: function () { go(false, bE); } }, tx("email"));
    dlg = modal([
      h("h3", null, tx("login")),
      h("p", null, tx("why")),
      bG, bE, err,
      h("p", { class: "acct-privacy" }, tx("privacy")),
      h("div", { class: "row end" }, h("button", { class: "btn ghost sm", onclick: function () { dlg.remove(); } }, tx("cancel")))
    ]);
  }

  function askName() {
    var inp = h("input", { type: "text", class: "acct-input", autocomplete: "name", maxlength: "80", value: meta.name || memberName(S.member) || "" });
    var dlg;
    function saveName() {
      var v = inp.value.trim().replace(/\s+/g, " ");
      if (v.length < 3) { inp.focus(); return; }
      meta.name = v; writeJSON(META_KEY, meta);
      dlg.remove();
      push(localState()).then(function () { S.lastSync = new Date(); render(); }, function (e) { S.error = e.message; render(); });
    }
    inp.addEventListener("keydown", function (e) { if (e.key === "Enter") saveName(); });
    dlg = modal([h("h3", null, tx("nameTitle")), h("p", null, tx("nameWhy")), inp,
      h("div", { class: "row end" }, h("button", { class: "btn", onclick: saveName }, tx("nameSave")))]);
    setTimeout(function () { inp.focus(); }, 30);
  }

  function askConsent(needName) {
    var dlg;
    var cb = h("input", { type: "checkbox", id: "acct-consent" });
    var ok = h("button", { class: "btn primary", disabled: true, onclick: function () {
      giveConsent(); dlg.remove();
      push(localState()).then(function () { S.lastSync = new Date(); render(); if (needName) askName(); }, function (e) { S.error = e.message; render(); });
    } }, tx("consentOk"));
    cb.addEventListener("change", function () { ok.disabled = !cb.checked; });
    dlg = modal([h("h3", null, tx("consentTitle")), h("p", null, tx("consentWhy")),
      h("label", { class: "gate-check", for: "acct-consent" }, cb, h("span", { html: consentLabelHtml() })),
      h("div", { class: "row end" },
        h("button", { class: "btn ghost", onclick: function () { dlg.remove(); logout(); } }, tx("consentNo")), ok)]);
  }

  function askDelete() {
    var dlg = modal([h("h3", null, tx("del")), h("p", null, tx("delAsk")),
      h("div", { class: "row end" },
        h("button", { class: "btn ghost", onclick: function () { dlg.remove(); } }, tx("cancel")),
        h("button", { class: "btn danger", onclick: function () {
          deleteCloud().then(function () { meta = {}; writeJSON(META_KEY, null); dlg.remove(); logout(); }, function (e) { S.error = e.message; dlg.remove(); render(); });
        } }, tx("yes")))]);
  }

  /* Giriş duvarı: giriş yapmadan laboratuvar kullanılamaz / Login wall: the lab needs a login */
  var gateEl = null;
  var IC = {
    chart: '<svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true"><path d="M8 21.5 L13.2 14.8 L17.4 18.2 L24 10" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="24" cy="10" r="2.6" fill="currentColor"/><circle cx="8" cy="21.5" r="1.8" fill="currentColor"/></svg>',
    grid: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="4" y="4" width="7" height="7" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="13" y="4" width="7" height="7" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="4" y="13" width="7" height="7" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="13" y="13" width="7" height="7" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    code: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M8.5 7 3.5 12l5 5M15.5 7l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    sync: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M20 12a8 8 0 0 1-13.7 5.7M4 12a8 8 0 0 1 13.7-5.7M18 3v4h-4M6 21v-4h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    mail: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    shield: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="m9 12 2.2 2.2L15.5 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  function consentLabelHtml() { return tx("consentLabel").replace("{u}", privacyUrl()); }
  function privacyUrl() { return location.origin + (curLang() === "en" ? "/en/privacy.html#ml-lab" : "/gizlilik-politikasi.html#ml-lab"); }
  function counts() {
    var c = LAB.catalog || [], u = 0;
    c.forEach(function (x) { u += x.units || 0; });
    return { m: c.length, u: u };
  }
  function showGate() {
    if (gateEl) return;
    document.documentElement.classList.add("auth-locked");
    var shell = document.querySelector(".shell");
    if (shell) { shell.setAttribute("inert", ""); shell.setAttribute("aria-hidden", "true"); }
    var err = h("p", { class: "acct-err", role: "alert" });
    var cb = h("input", { type: "checkbox", id: "gate-consent" });
    function go(g, btn) {
      if (!cb.checked) { err.textContent = tx("consentNeed"); chk.classList.add("need"); cb.focus(); return; }
      giveConsent();
      btn.disabled = true; btn.classList.add("busy"); err.textContent = "";
      startLogin(g).catch(function () { btn.disabled = false; btn.classList.remove("busy"); err.textContent = tx("failed"); });
    }
    var bG = h("button", { class: "gate-btn gate-google", onclick: function () { go(true, bG); } },
      h("span", { class: "gate-g", "aria-hidden": "true" }, "G"), h("span", null, tx("google")));
    var bE = h("button", { class: "gate-btn gate-email", onclick: function () { go(false, bE); } },
      h("span", { class: "gate-ic", html: IC.mail }), h("span", null, tx("email")));
    var langs = h("div", { class: "gate-lang", role: "group", "aria-label": "Dil / Language" }, ["tr", "en"].map(function (l) {
      return h("button", { class: l === curLang() ? "on" : "", "aria-pressed": l === curLang() ? "true" : "false", onclick: function () { if (LAB.store) { LAB.store.lang = l; LAB.save(); } location.reload(); } }, l.toUpperCase());
    }));
    var chk = h("label", { class: "gate-check", for: "gate-consent" }, cb, h("span", { html: consentLabelHtml() }));
    cb.addEventListener("change", function () { if (cb.checked) { chk.classList.remove("need"); err.textContent = ""; } });
    var n = counts();
    function feat(icon, title, text) {
      return h("li", null, h("span", { class: "gf-ic", html: icon }), h("span", null, h("b", null, title), h("small", null, text)));
    }
    var brand = h("div", { class: "gate-brand" },
      h("div", { class: "gate-mark" }, h("span", { class: "gate-logo", html: IC.chart }), h("span", null, h("b", null, tx("appName")), h("small", null, tx("appSub")))),
      h("div", { class: "gate-pitch" },
        h("h2", null, tx("pitchTitle")),
        h("ul", { class: "gate-feats" },
          feat(IC.grid, n.m + " " + tx("fModules") + " · " + n.u + " " + tx("fUnits"), tx("fModulesText")),
          feat(IC.code, tx("fPython"), tx("fPythonText")),
          feat(IC.sync, tx("fSync"), tx("fSyncText")))),
      h("a", { class: "gate-author", href: "https://www.songurmehmet.com", rel: "noopener" },
        h("span", { class: "gate-av", "aria-hidden": "true" }, "MS"), h("span", null, h("b", null, "Prof. Dr. Mehmet Songur"), h("small", null, "songurmehmet.com"))));
    var form = h("div", { class: "gate-form" },
      h("div", { class: "gate-top" }, langs, h("button", { class: "gate-x", "aria-label": tx("close"), title: tx("close"), onclick: hideGate, html: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' })),
      h("div", { class: "gate-body" },
        h("span", { class: "eyebrow" }, tx("free")),
        h("h1", { id: "gate-title" }, tx("gateTitle")),
        h("p", { class: "gate-sub" }, tx("gateSub")),
        h("div", { class: "gate-kvkk" },
          h("span", { class: "gate-ic", html: IC.shield }),
          h("p", null, tx("kvkkShort"), " ", h("a", { href: privacyUrl(), target: "_blank", rel: "noopener" }, tx("kvkkLink") + " ↗"))),
        chk,
        h("div", { class: "gate-btns" }, bG, bE),
        err,
        h("p", { class: "gate-new" }, tx("gateNew"))),
      h("button", { class: "gate-back", onclick: hideGate }, "← " + tx("back")));
    gateEl = h("div", { class: "auth-gate", role: "dialog", "aria-modal": "true", "aria-labelledby": "gate-title" },
      h("div", { class: "gate-card" }, brand, form));
    gateEl.addEventListener("click", function (e) { if (e.target === gateEl) hideGate(); });
    document.addEventListener("keydown", escClose);
    document.body.append(gateEl);
  }
  function escClose(e) { if (e.key === "Escape") hideGate(); }
  function hideGate() {
    if (!gateEl) return;
    gateEl.remove(); gateEl = null; blockedTarget = null;
    document.removeEventListener("keydown", escClose);
    document.documentElement.classList.remove("auth-locked");
    var shell = document.querySelector(".shell");
    if (shell) { shell.removeAttribute("inert"); shell.removeAttribute("aria-hidden"); }
  }
  /* Ana sayfa herkese açık; modül ve dersler giriş ister / Home is open; modules and lessons need a login */
  function openRoute(hash) { var id = (hash || "#home").slice(1) || "home"; return id === "home" || id === "about" || id === "modules"; }
  function guard() {
    if (isMember() && S.state !== "out") return;
    var hs = location.hash || "#home";
    if (openRoute(hs)) return;
    blockedTarget = hs;
    try { history.replaceState(null, "", location.pathname + location.search + "#home"); } catch (e) { location.hash = "#home"; }
    LAB.rerender();
    showGate();
    blockedTarget = hs;
  }
  window.addEventListener("hashchange", guard);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", guard); else guard();

  var slot = null;
  function render() {
    if (!slot) return;
    slot.innerHTML = "";
    if (S.state === "out") {
      slot.append(h("button", { class: "acct-login", onclick: showGate }, tx("login")));
      return;
    }
    if (S.state === "loading" && !S.member) { slot.append(h("span", { class: "acct-status" }, tx("loading"))); return; }
    var name = displayName();
    var status = S.error ? tx("syncErr") : (S.busy || S.dirty ? tx("saving") : (S.lastSync ? tx("saved") + " · " + S.lastSync.toLocaleTimeString(curLang() === "tr" ? "tr-TR" : "en-GB", { hour: "2-digit", minute: "2-digit" }) : ""));
    slot.append(
      h("div", { class: "acct-who" }, h("span", { class: "acct-avatar", "aria-hidden": "true" }, (name || "?").charAt(0).toUpperCase()), h("span", { class: "acct-name" }, name)),
      h("span", { class: "acct-status" + (S.error ? " bad" : "") }, status),
      LAB.unlockAll ? h("span", { class: "acct-admin" }, tx("admin")) : "",
      h("div", { class: "acct-actions" },
        h("button", { class: "sb-reset", onclick: askName }, tx("edit")),
        h("button", { class: "sb-reset", onclick: function () { flush().then(logout); } }, tx("logout")),
        h("button", { class: "sb-reset", onclick: askDelete }, tx("del"))));
  }
  LAB.hooks.account = function () {
    slot = h("div", { class: "acct" });
    render();
    return slot;
  };

  if (isMember()) fullSync();
})();
