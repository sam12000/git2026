// Diagnostic temporaire de la reconnexion par jeton sur le PRONOTE de démo.
import * as P from 'pawnote';
import { defaultFetcher } from '@literate.ink/utilities';
import { compatFetcher } from '../src/pronote-core.mjs';

const url = 'https://demo.index-education.net/pronote';
const deviceUUID = 'mlp-ci-diag-' + Date.now();
const logFetch = (tag) => compatFetcher(async (req) => {
  const res = await defaultFetcher(req);
  let nom = ''; try { nom = JSON.parse(req.content || '{}').nom || ''; } catch {}
  if (nom) console.log(`  [${tag}] ${nom} -> ${res.status} ${String(res.content).slice(0, nom === 'Identification' ? 400 : 160)}`);
  return res;
});
const s1 = P.createSessionHandle(logFetch('pwd'));
const r = await P.loginCredentials(s1, { url, kind: P.AccountKind.STUDENT, username: 'demonstration', password: 'pronotevs', deviceUUID });
const t = String(r.token || '');
console.log('jeton : longueur', t.length, 'minuscules', /[a-z]/.test(t), 'majuscules', /[A-Z]/.test(t), '| kind', r.kind, '| username', r.username, '| navId', !!r.navigatorIdentifier);
const tries = {
  normal: () => ({ url: r.url, kind: r.kind, username: r.username, token: r.token, deviceUUID, navigatorIdentifier: r.navigatorIdentifier }),
  sansNavId: () => ({ url: r.url, kind: r.kind, username: r.username, token: r.token, deviceUUID }),
};
for (const [name, mk] of Object.entries(tries)) {
  try {
    const s = P.createSessionHandle(logFetch(name));
    const x = await P.loginToken(s, mk());
    console.log(`jeton ${name} : OK`, x.token ? 'nouveau jeton reçu' : '');
    break;
  } catch (e) { console.log(`jeton ${name} : échec`, e && e.name, e && e.message); }
}
