// Construit les trois versions de l'appli dans dist/ :
//   dist/www        page web / PWA (servie par server/ ou n'importe quel hébergeur)
//   dist/extension  extension Chrome / Edge (charger le dossier « non empaqueté »)
//   dist/android    contenu web de l'appli Android (Capacitor)
import { build } from 'esbuild';
import { cpSync, rmSync, mkdirSync, copyFileSync, writeFileSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const dist = join(root, 'dist');
const targets = ['www', 'extension', 'android'];
const version = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version;

rmSync(dist, { recursive: true, force: true });
const common = { bundle: true, format: 'iife', platform: 'browser', target: ['es2020'], minify: true, legalComments: 'none', logLevel: 'warning' };

for (const t of targets) {
  const out = join(dist, t);
  cpSync(join(root, 'app'), out, { recursive: true });
  mkdirSync(join(out, 'vendor'), { recursive: true });
  copyFileSync(require.resolve('jsqr/dist/jsQR.js'), join(out, 'vendor', 'jsQR.js'));
  await build({ ...common, entryPoints: [join(root, 'src/ai-browser.mjs')], outfile: join(out, 'js/ai.js') });
}

// PRONOTE en direct : extension et Android (pas de blocage CORS dans ces formats).
await build({ ...common, entryPoints: [join(root, 'src/pronote-browser.mjs')], outfile: join(dist, 'extension/js/pronote-direct.js') });
await build({ ...common, entryPoints: [join(root, 'src/android-entry.mjs')], outfile: join(dist, 'android/js/pronote-direct.js') });

// Extension : manifeste MV3 + script d'arrière-plan ; pas de service worker PWA.
cpSync(join(root, 'extension'), join(dist, 'extension'), { recursive: true });
rmSync(join(dist, 'extension/sw.js'));
rmSync(join(dist, 'extension/manifest.webmanifest'));
for (const t of ['extension', 'android']) {
  const f = join(dist, t, 'index.html');
  writeFileSync(f, readFileSync(f, 'utf8').replace(/<link rel="manifest"[^>]*>\n/, ''));
}
const m = JSON.parse(readFileSync(join(dist, 'extension/manifest.json'), 'utf8'));
m.version = version; writeFileSync(join(dist, 'extension/manifest.json'), JSON.stringify(m, null, 2));
rmSync(join(dist, 'android/sw.js'));
rmSync(join(dist, 'android/manifest.webmanifest'));

// Fichier HTML unique (dist/mylife-planner.html) : à ouvrir d'un double-clic,
// sans installation ni serveur. Tout est intégré dedans.
{
  const w = join(dist, 'www');
  const read = (f) => readFileSync(join(w, f), 'utf8');
  const inlineJs = (code) => '<script>' + code.replace(/<\/script/gi, '<\\/script') + '</script>';
  const icon = 'data:image/svg+xml;base64,' + Buffer.from(read('icons/icon.svg')).toString('base64');
  let html = read('index.html')
    .replace(/<link rel="manifest"[^>]*>\n/, '')
    .replace(/<link rel="(apple-touch-icon|icon)"[^>]*>\n/g, '')
    .replace('<link rel="stylesheet" href="css/app.css">', () => '<link rel="icon" href="' + icon + '">\n<style>' + read('css/app.css') + '</style>')
    .replace('<script src="js/pronote-direct.js"></script>', () => inlineJs(read('vendor/jsQR.js')) + '\n' + inlineJs(read('js/ai.js')))
    .replace('<script src="js/platform.js"></script>', () => inlineJs(read('js/platform.js')))
    .replace('<script src="js/app.js"></script>', () => inlineJs(read('js/app.js')));
  writeFileSync(join(dist, 'mylife-planner.html'), html);
}

console.log('Build terminé : dist/www, dist/extension, dist/android, dist/mylife-planner.html');
