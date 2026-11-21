/* MyLife Planner : couche « plateforme ».
   Remplace tout ce qui dépendait de Claude dans le prototype, avec des API
   standard du navigateur ou d'Android. Un seul code pour les trois formats :
   - web : page HTML / PWA installable (ordinateur, Android, iPhone)
   - extension : extension Chrome / Edge
   - android : APK construit avec Capacitor */
(function () {
  'use strict';
  const cap = window.Capacitor;
  const isNative = !!(cap && cap.isNativePlatform && cap.isNativePlatform());
  const isExtension = !!(window.chrome && chrome.runtime && chrome.runtime.id);
  const platform = isNative ? 'android' : isExtension ? 'extension' : 'web';
  const plugin = (n) => (isNative && ((window.MLPNative && window.MLPNative[n]) || (cap.Plugins && cap.Plugins[n]))) || null;

  /* ---------- identifiant stable de l'appareil (le jeton PRONOTE y est lié) ---------- */
  function deviceUUID() {
    try {
      let id = localStorage.getItem('mlp-device');
      if (!id) { id = 'mlp-' + (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36)); localStorage.setItem('mlp-device', id); }
      return id;
    } catch (e) { return 'mlp-device'; }
  }

  /* ---------- dictée vocale ----------
     Même interface que l'ancienne dictée du prototype :
     onState({state,reason}), onPartial({text}), onFinal({text}), start(), stop(), active() */
  function makeEmitter() {
    const L = { state: [], partial: [], final: [] };
    return {
      L,
      emit: (k, v) => L[k].forEach((f) => { try { f(v); } catch (e) { console.error(e); } }),
      api: { onState: (f) => L.state.push(f), onPartial: (f) => L.partial.push(f), onFinal: (f) => L.final.push(f) },
    };
  }

  function webSpeech() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const { emit, api } = makeEmitter();
    let rec = null, on = false;
    return Object.assign(api, {
      active: () => on,
      start() {
        return new Promise((resolve, reject) => {
          let reason = 'stopped', started = false;
          rec = new SR();
          rec.lang = 'fr-FR'; rec.interimResults = true; rec.continuous = true;
          rec.onstart = () => { started = true; on = true; emit('state', { state: 'listening' }); resolve(); };
          rec.onresult = (e) => {
            let interim = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
              const r = e.results[i];
              if (r.isFinal) emit('final', { text: r[0].transcript.trim() + ' ' }); else interim += r[0].transcript;
            }
            emit('partial', { text: interim });
          };
          rec.onerror = (e) => {
            if (e.error === 'not-allowed' || e.error === 'service-not-allowed') reason = 'not_granted';
            else if (e.error === 'no-speech' || e.error === 'aborted') reason = 'stopped';
            else reason = 'upstream_error';
          };
          rec.onend = () => {
            on = false; emit('partial', { text: '' });
            if (!started) { reject({ code: reason === 'not_granted' ? 'not_granted' : 'unavailable' }); return; }
            emit('state', { state: 'idle', reason: reason === 'not_granted' ? 'upstream_error' : reason });
          };
          try { rec.start(); } catch (e) { reject({ code: 'unavailable' }); }
        });
      },
      stop() { try { rec && rec.stop(); } catch (e) {} return Promise.resolve(); },
    });
  }

  function nativeSpeech() {
    const SR = plugin('SpeechRecognition');
    if (!SR) return null;
    const { emit, api } = makeEmitter();
    let on = false, last = '';
    const finish = (reason) => {
      if (!on) return; on = false;
      if (last) emit('final', { text: last.trim() + ' ' });
      last = ''; emit('partial', { text: '' }); emit('state', { state: 'idle', reason });
    };
    SR.addListener('partialResults', (d) => { last = (d && d.matches && d.matches[0]) || last; emit('partial', { text: last }); });
    SR.addListener('listeningState', (d) => { if (d && d.status === 'stopped') finish('stopped'); });
    return Object.assign(api, {
      active: () => on,
      async start() {
        const av = await SR.available().catch(() => ({ available: false }));
        if (!av.available) throw { code: 'unavailable' };
        const p = await SR.requestPermissions().catch(() => ({}));
        if (p.speechRecognition && p.speechRecognition !== 'granted') throw { code: 'not_granted' };
        on = true; last = ''; emit('state', { state: 'listening' });
        SR.start({ language: 'fr-FR', partialResults: true, popup: false }).catch(() => finish('upstream_error'));
      },
      async stop() { await SR.stop().catch(() => {}); finish('stopped'); },
    });
  }

  /* ---------- PRONOTE ----------
     Extension et APK : connexion directe (js/pronote-direct.js embarque pawnote).
     Page web : passe par le petit serveur (dossier server/), car le navigateur
     bloque les appels directs vers PRONOTE (CORS). */
  async function pronote(req, serverUrl) {
    req = Object.assign({ deviceUUID: deviceUUID() }, req);
    if (isExtension && chrome.permissions) {
      // L'extension a déjà accès aux PRONOTE hébergés par Index Éducation ;
      // pour une autre adresse, elle demande l'autorisation une fois.
      const u = req.url || (req.qr && req.qr.url);
      try {
        const origin = u && new URL(u).origin;
        if (origin && !/\.index-education\.net$/.test(new URL(u).hostname)) {
          const ok = await chrome.permissions.request({ origins: [origin + '/*'] });
          if (!ok) throw { code: 'denied', message: 'L\'extension a besoin de ton autorisation pour joindre ' + origin + '.' };
        }
      } catch (e) { if (e && e.code) throw e; }
    }
    if (window.MLPPronote && window.MLPPronote.direct) return window.MLPPronote.sync(req);
    const base = String(serverUrl || '').trim().replace(/\/+$/, '');
    let r;
    try {
      r = await fetch(base + '/api/pronote/sync', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(req) });
    } catch (e) {
      throw { code: 'server_unreachable', message: base ? 'Le serveur MyLife Planner (' + base + ') ne répond pas.' : 'Aucun serveur MyLife Planner n\'est joignable. Lance-le (npm start) ou renseigne son adresse ci-dessous.' };
    }
    const j = await r.json().catch(() => null);
    if (!r.ok) throw (j && j.error) || { code: 'server', message: 'Le serveur a répondu avec une erreur (' + r.status + ').' };
    return j;
  }
  const pronoteMode = () => (window.MLPPronote && window.MLPPronote.direct ? 'direct' : 'server');

  /* ---------- IA optionnelle (clé API personnelle) ---------- */
  let aiLoading = null;
  function loadAI() {
    if (window.MLPAI) return Promise.resolve(window.MLPAI);
    if (!aiLoading) aiLoading = new Promise((res, rej) => {
      const s = document.createElement('script'); s.src = 'js/ai.js';
      s.onload = () => (window.MLPAI ? res(window.MLPAI) : rej(new Error('IA indisponible')));
      s.onerror = () => { aiLoading = null; rej(new Error('IA indisponible')); };
      document.head.appendChild(s);
    });
    return aiLoading;
  }

  /* ---------- notifications ---------- */
  const LN = plugin('LocalNotifications');
  async function notifyPermission() {
    if (LN) { const p = await LN.requestPermissions().catch(() => ({})); return p.display === 'granted'; }
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    return (await Notification.requestPermission()) === 'granted';
  }
  const notifyState = () => (LN ? 'native' : !('Notification' in window) ? 'unsupported' : Notification.permission);
  async function show(title, body) {
    if (LN) { await LN.schedule({ notifications: [{ id: Math.floor(Math.random() * 2e9), title, body }] }).catch(() => {}); return true; }
    if (!('Notification' in window) || Notification.permission !== 'granted') return false;
    try {
      const reg = navigator.serviceWorker && (await navigator.serviceWorker.getRegistration());
      if (reg) { await reg.showNotification(title, { body, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', lang: 'fr' }); return true; }
    } catch (e) {}
    try { new Notification(title, { body, icon: 'icons/icon-192.png' }); return true; } catch (e) { return false; }
  }
  const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h) % 2e9; };
  /* items : [{ at: Date, title, body }]
     APK : programmés dans Android, ils arrivent même appli fermée.
     Web / extension : affichés tant que l'appli est ouverte (onglet ou PWA). */
  let pending = [], timer = null;
  async function schedule(items) {
    const now = Date.now();
    items = items.filter((x) => x.at.getTime() > now).slice(0, 60);
    if (LN) {
      const p = await LN.getPending().catch(() => ({ notifications: [] }));
      if (p.notifications.length) await LN.cancel({ notifications: p.notifications.map((n) => ({ id: n.id })) }).catch(() => {});
      if (items.length) await LN.schedule({ notifications: items.map((x) => ({ id: hash(x.title + x.at.toISOString()), title: x.title, body: x.body, schedule: { at: x.at, allowWhileIdle: true } })) }).catch(() => {});
      return;
    }
    pending = items;
    if (!timer) timer = setInterval(() => {
      const t = Date.now();
      const due = pending.filter((x) => x.at.getTime() <= t);
      pending = pending.filter((x) => x.at.getTime() > t);
      due.forEach((x) => { if (t - x.at.getTime() < 5 * 60e3) show(x.title, x.body); });
    }, 30e3);
  }

  /* ---------- hors ligne (PWA) ---------- */
  if (platform === 'web' && 'serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }

  window.MLP = {
    platform, deviceUUID, pronote, pronoteMode, loadAI,
    dictation: () => nativeSpeech() || webSpeech(),
    notify: { permission: notifyPermission, state: notifyState, show, schedule },
  };
})();
