// Petit serveur MyLife Planner :
//  - sert la page web / PWA (dist/www)
//  - relaie la connexion PRONOTE (le navigateur ne peut pas appeler PRONOTE
//    directement à cause de CORS). Rien n'est stocké : ni mot de passe, ni
//    jeton, ni devoirs. Les identifiants ne sont jamais écrits dans les logs.
// Déploie-le derrière HTTPS (Render, Railway, Fly.io, un Raspberry Pi…).
import express from 'express';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pronoteSync, explainError } from '../src/pronote-core.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = +process.env.PORT || 8787;
// Origines autorisées à appeler l'API (si la page est hébergée ailleurs), séparées par des virgules.
const ALLOWED = (process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '32kb' }));

app.use('/api', (req, res, next) => {
  const o = req.headers.origin;
  if (o && (ALLOWED.includes('*') || ALLOWED.includes(o))) {
    res.set({ 'Access-Control-Allow-Origin': o, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'content-type', Vary: 'Origin' });
  }
  res.set('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Limite simple : 12 connexions par minute et par adresse IP.
const hits = new Map();
function limited(ip) {
  const now = Date.now(); const h = (hits.get(ip) || []).filter((t) => now - t < 60e3);
  h.push(now); hits.set(ip, h); return h.length > 12;
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/pronote/sync', async (req, res) => {
  if (limited(req.ip)) return res.status(429).json({ error: { code: 'rate_limited', message: 'Trop de tentatives. Patiente une minute.' } });
  const b = req.body || {};
  const mode = ['password', 'token', 'qr'].includes(b.mode) ? b.mode : null;
  if (!mode) return res.status(400).json({ error: { code: 'bad_request', message: 'Méthode de connexion inconnue.' } });
  if (mode !== 'qr' && !/^https?:\/\/\S+$/.test(String(b.url || ''))) return res.status(400).json({ error: { code: 'bad_request', message: 'Adresse PRONOTE invalide.' } });
  try {
    res.json(await pronoteSync(b));
  } catch (e) {
    const err = explainError(e);
    console.warn('[pronote] échec :', err.code);
    res.status(err.code === 'bad_credentials' ? 401 : 502).json({ error: err });
  }
});

const web = existsSync(join(root, 'dist/www/index.html')) ? join(root, 'dist/www') : join(root, 'app');
app.use(express.static(web, { extensions: ['html'], setHeaders: (r, p) => { if (p.endsWith('sw.js')) r.set('Cache-Control', 'no-cache'); } }));

app.listen(PORT, () => console.log(`MyLife Planner : http://localhost:${PORT}  (fichiers : ${web.replace(root + '/', '')})`));
