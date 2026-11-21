// Logique PRONOTE partagée : utilisée par le serveur (Node) ET embarquée dans
// l'extension et l'APK Android (où l'appli peut joindre PRONOTE directement).
// S'appuie sur pawnote, une bibliothèque open source non officielle (PRONOTE n'a
// pas d'API publique). Le projet d'origine (LiterateInk/Pawnote.js) n'est plus
// maintenu : on utilise sa copie maintenue @blockshub/pawnote-lts (alias npm
// « pawnote » dans package.json), qui suit le protocole de connexion PRONOTE 2026.
import * as P from 'pawnote';
import { defaultFetcher } from '@literate.ink/utilities';

/**
 * Compatibilité PRONOTE 2026 : la page de connexion mobile appelle désormais
 * « Start ({…});} catch » au lieu de « Start({…})} catch ». pawnote cherche
 * « Start({ » sans espace (et, en 1.6.2, « )}catch »). On remet la forme
 * attendue avant de passer la page à pawnote.
 */
export function fixStartScript(html) {
  return String(html)
    .replace(/Start\s*\(\s*\{/, 'Start({')
    .replace(/(Start\(\{[\s\S]*?\}\s*\))\s*;(\s*\}\s*catch)/, '$1$2');
}
export const compatFetcher = (base = defaultFetcher) => async (req) => {
  const res = await base(req);
  if (/\/mobile\.[a-z]+\.html/.test(String(req.url)) && typeof res.content === 'string') {
    return { ...res, content: fixStartScript(res.content) };
  }
  return res;
};

const KINDS = { eleve: P.AccountKind.STUDENT, parent: P.AccountKind.PARENT };

const stripHtml = (s) => String(s || '')
  .replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|li)>/gi, '\n').replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/[ \t]+/g, ' ').replace(/\n{2,}/g, '\n').trim();

/** Traduit les erreurs de pawnote en codes et messages compréhensibles. */
export function explainError(e) {
  const name = (e && (e.name || (e.constructor && e.constructor.name))) || '';
  const map = {
    BadCredentialsError: ['bad_credentials', 'Identifiant ou mot de passe incorrect.'],
    AccountDisabledError: ['account_disabled', 'Ce compte PRONOTE est désactivé.'],
    SuspendedIPError: ['suspended', 'PRONOTE bloque temporairement les connexions. Réessaie plus tard.'],
    RateLimitedError: ['rate_limited', 'Trop de tentatives. Patiente quelques minutes.'],
    BusyPageError: ['busy', 'PRONOTE est occupé ou en maintenance. Réessaie plus tard.'],
    PageUnavailableError: ['unavailable', 'Cette adresse PRONOTE ne répond pas. Vérifie le lien.'],
    UnreachableError: ['unreachable', 'Impossible de joindre ce PRONOTE. Vérifie le lien et ta connexion.'],
    SessionExpiredError: ['expired', 'La session a expiré : reconnecte-toi.'],
    AccessDeniedError: ['denied', 'Accès refusé par PRONOTE.'],
    SecurityError: ['double_auth', 'Ton établissement demande une double authentification : utilise plutôt la connexion par QR code.'],
  };
  if (!map[name] && e instanceof TypeError && /fetch|network|load failed/i.test(String(e.message))) return { code: 'unreachable', message: 'Impossible de joindre ce PRONOTE. Vérifie le lien et ta connexion.' };
  const [code, message] = map[name] || ['error', (e && e.message) ? 'PRONOTE a renvoyé une erreur : ' + e.message : 'Erreur inconnue avec PRONOTE.'];
  return { code, message };
}

/**
 * Se connecte et récupère devoirs, emploi du temps et moyennes.
 * req.mode : 'password' | 'token' | 'qr'
 *   password : url, username, password, kind ('eleve' | 'parent')
 *   token    : url, username, token, kindNum, navigatorIdentifier (renvoyés par une connexion précédente)
 *   qr       : qr (contenu JSON du QR code PRONOTE), pin (code à 4 chiffres choisi dans PRONOTE)
 * req.deviceUUID : identifiant stable de l'appareil (le jeton n'est valable que pour lui)
 * req.days : nombre de jours à récupérer (21 par défaut)
 */
export async function pronoteSync(req, fetcher) {
  const s = P.createSessionHandle(compatFetcher(fetcher || defaultFetcher));
  const kind = KINDS[req.kind] || P.AccountKind.STUDENT;
  const deviceUUID = String(req.deviceUUID || 'mylife-planner');
  // L'adresse copiée depuis le navigateur finit souvent par « eleve.html » :
  // pawnote attend la racine (…/pronote), sinon la page de connexion est introuvable.
  const url = req.url ? P.cleanURL(String(req.url).trim()) : req.url;
  let r;
  if (req.mode === 'qr') {
    const qr = typeof req.qr === 'string' ? JSON.parse(req.qr) : req.qr;
    r = await P.loginQrCode(s, { deviceUUID, pin: String(req.pin || ''), qr });
  } else if (req.mode === 'token') {
    // Quand l'établissement ignore la casse des mots de passe, pawnote passe aussi
    // le jeton en minuscules avant de le chiffrer. pawnote-lts a retiré ce passage
    // pour le mot de passe, pas pour le jeton. Or le jeton est sensible à la casse,
    // donc on l'empêche d'être modifié.
    const token = String(req.token || '');
    const tokenReq = { url, kind: req.kindNum || kind, username: req.username, deviceUUID, navigatorIdentifier: req.navigatorIdentifier };
    Object.defineProperty(tokenReq, 'token', { get: () => token, set: () => {}, enumerable: true });
    r = await P.loginToken(s, tokenReq);
  } else {
    r = await P.loginCredentials(s, { url, kind, username: req.username, password: req.password, deviceUUID });
  }

  const from = new Date(); from.setHours(0, 0, 0, 0); from.setDate(from.getDate() - 1);
  const to = new Date(from); to.setDate(to.getDate() + Math.min(60, Math.max(7, +req.days || 21)));

  const out = {
    // Jeton de reconnexion : il remplace le mot de passe, qui n'est jamais conservé.
    auth: { mode: 'token', url: r.url, username: r.username, token: r.token, kindNum: r.kind, navigatorIdentifier: r.navigatorIdentifier, deviceUUID },
    user: { name: s.user && s.user.name, className: s.userResource && s.userResource.className, school: s.userResource && s.userResource.establishmentName },
    assignments: [], lessons: [], grades: [], warnings: [],
  };

  try {
    const list = await P.assignmentsFromIntervals(s, from, to);
    out.assignments = list.map((a) => ({
      id: a.id, subject: a.subject && a.subject.name, description: stripHtml(a.description),
      deadline: new Date(a.deadline).toISOString(), done: !!a.done, length: a.length || null,
    }));
  } catch (e) { out.warnings.push('devoirs : ' + explainError(e).message); }

  try {
    const tt = await P.timetableFromIntervals(s, from, to);
    P.parseTimetable(s, tt, { withSuperposedCanceledClasses: false, withCanceledClasses: true, withPlannedClasses: true });
    out.lessons = tt.classes.filter((c) => c.is === 'lesson').map((c) => ({
      id: c.id, subject: c.subject ? c.subject.name : (c.groupNames && c.groupNames[0]) || 'Cours',
      start: new Date(c.startDate).toISOString(), end: new Date(c.endDate).toISOString(), room: (c.classrooms || []).join(', '),
      teacher: (c.teacherNames || []).join(', '), canceled: !!c.canceled, status: c.status || '', test: !!c.test,
    }));
  } catch (e) { out.warnings.push('emploi du temps : ' + explainError(e).message); }

  try {
    const tab = s.userResource && s.userResource.tabs && s.userResource.tabs.get(P.TabLocation.Grades);
    const period = tab && (tab.defaultPeriod || tab.periods[tab.periods.length - 1]);
    if (period) {
      const g = await P.gradesOverview(s, period);
      out.grades = g.subjectsAverages
        .filter((x) => x.student && typeof x.student.points === 'number' && x.student.kind === P.GradeKind.Grade)
        .map((x) => ({ subject: x.subject.name, value: Math.round(x.student.points * 10) / 10 }));
    }
  } catch (e) { out.warnings.push('notes : ' + explainError(e).message); }

  return out;
}
