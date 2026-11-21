# CLAUDE.md

MyLife Planner : assistant d'organisation scolaire (PRONOTE, agendas, devoirs, rappels). Interface en français. Voir README.md.

## Structure

- `app/` : source unique de l'interface (HTML/CSS/JS sans framework). `app/js/app.js` vient du prototype Artifact ; `app/js/platform.js` isole tout ce qui dépend du format (micro, notifications, PRONOTE, IA).
- `src/pronote-core.mjs` : connexion PRONOTE via pawnote (pas d'API officielle). Utilisé par `server/` (Node) et embarqué par esbuild dans l'extension et l'APK.
- `scripts/build.mjs` produit `dist/www` (PWA), `dist/extension` (MV3), `dist/android` (webDir Capacitor) et `dist/mylife-planner.html` (fichier unique).
- `android/` : projet Capacitor 8 (généré par `npx cap add android`, icônes personnalisées).

## Commandes

```
npm install
npm run build
npm start                 # http://localhost:8787
node scripts/check-pronote-demo.mjs   # test sur le PRONOTE de démonstration
npm run android:apk       # nécessite JDK 21 + SDK Android
```

## Règles

- Aucune API propre à Claude dans l'appli (pas de `window.claude`).
- Ne jamais stocker ni journaliser le mot de passe PRONOTE : seul le jeton renvoyé par pawnote est gardé, côté appareil.
- Extension : pas de script inline (CSP MV3) ; tout le JS est dans des fichiers.
- La CI (`.github/workflows/build.yml`) construit l'APK, l'extension et la page web en artefacts.

## Branche

Branche par défaut : `claude/init-project-setup-KV9P0`.
