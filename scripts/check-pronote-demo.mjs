// Vérifie la connexion PRONOTE sur le serveur de démonstration public
// d'Index Éducation (compte « demonstration » / « pronotevs »).
// Usage : node scripts/check-pronote-demo.mjs
import { pronoteSync, explainError } from '../src/pronote-core.mjs';

const req = { mode: 'password', url: 'https://demo.index-education.net/pronote/eleve.html', username: 'demonstration', password: 'pronotevs', kind: 'eleve', deviceUUID: 'mlp-ci-check' };
try {
  const r = await pronoteSync(req);
  console.log(`Connecté : ${r.user.name} (${r.user.className || '?'}) · ${r.lessons.length} cours · ${r.assignments.length} devoirs · ${r.grades.length} moyennes`);
  if (r.warnings.length) console.log('Avertissements :', r.warnings.join(' ; '));
  const again = await pronoteSync({ ...r.auth, mode: 'token' });
  console.log(`Reconnexion par jeton : OK (${again.lessons.length} cours)`);
} catch (e) {
  console.error('Échec :', explainError(e).message, '|', e && e.name, e && e.message);
  // Diagnostic : que renvoie la page de connexion mobile ?
  try {
    const u = 'https://demo.index-education.net/pronote/mobile.eleve.html?fd=1';
    const r = await fetch(u, { redirect: 'manual', headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Mobile Safari/537.36' } });
    const t = await r.text();
    console.error('Diagnostic', u, '->', r.status, r.headers.get('location') || '', '|', t.replace(/\s+/g, ' ').slice(0, 600));
  } catch (d) { console.error('Diagnostic impossible :', d.message); }
  process.exit(1);
}
