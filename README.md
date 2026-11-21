# MyLife Planner

Assistant d'organisation personnelle et scolaire : emploi du temps et devoirs PRONOTE, agendas, découpage des devoirs en séances, révisions avant les contrôles, rappels par priorité et chat (sans IA, avec une IA facultative).

L'appli fonctionne **sans Claude**, sous quatre formes construites à partir du même code :

| Format | Fichier produit | Pour qui |
|---|---|---|
| Page HTML unique | `dist/mylife-planner.html` | Ouvrir d'un double-clic, sans rien installer |
| Page web installable (PWA) | `dist/www/` | Ordinateur, Android, iPhone/iPad (« Sur l'écran d'accueil ») |
| Extension Chrome / Edge | `dist/extension/` | Une icône dans la barre du navigateur |
| Appli Android (APK) | `android/` → `mylife-planner.apk` | Téléphone ou tablette Android |

## Démarrer

Il faut Node.js 22 ou plus récent.

```bash
npm install
npm run build     # construit dist/ (les 4 formats)
npm start         # serveur local : http://localhost:8787
```

### Récupérer l'APK et l'extension sans rien installer

À chaque pull request, GitHub Actions construit tout (onglet **Actions** → dernière exécution → **Artifacts** → `mylife-planner`) :
`mylife-planner.apk`, `mylife-planner-extension.zip`, `mylife-planner-web.zip` et `mylife-planner.html`.

- **APK** : copie-le sur le téléphone et ouvre-le (Android demande d'autoriser l'installation depuis cette source). C'est une version de test (« debug »), suffisante pour un usage perso. Pour le Play Store, il faudra une version signée.
- **Extension** : dézippe, ouvre `chrome://extensions` (ou `edge://extensions`), active le **mode développeur**, puis **Charger l'extension non empaquetée** et choisis le dossier.
- **iPhone / iPad** : ouvre la page web dans Safari, bouton Partager → **Sur l'écran d'accueil**. Les notifications marchent une fois l'appli ajoutée ainsi (iOS 16.4 ou plus).

Pour construire l'APK sur ton ordinateur : Android Studio (JDK 21, SDK Android 36), puis `npm run android:apk`, ou `npx cap open android` pour l'ouvrir dans Android Studio.

## PRONOTE

> ⚠️ **PRONOTE n'a pas d'API officielle.** La connexion utilise pawnote, une bibliothèque libre (dans sa copie maintenue [@blockshub/pawnote-lts](https://www.npmjs.com/package/@blockshub/pawnote-lts), l'original n'étant plus maintenu) qui parle à PRONOTE comme le fait l'appli mobile officielle. Elle peut cesser de marcher si Index Éducation change PRONOTE, et certains établissements peuvent bloquer ce type d'accès. Utilise uniquement ton propre compte.

Trois façons de se connecter (onglet **Sources**) :

1. **Identifiant** : adresse PRONOTE + identifiant + mot de passe PRONOTE.
2. **QR code / ENT** : pour les comptes ENT / ÉduConnect. Dans PRONOTE sur ordinateur, clique sur l'icône QR code, choisis un code à 4 chiffres, puis prends le QR code en photo dans l'appli.
3. **Copier-coller** : copie la page « Travail à faire » ; marche partout, sans connexion.

Le mot de passe sert une seule fois : l'appli garde ensuite un **jeton** lié à l'appareil, et resynchronise toute seule (au plus une fois par heure à l'ouverture, ou avec « Synchroniser maintenant »). Limite connue : sur le PRONOTE de démonstration (version 2026.2), cette reconnexion par jeton est refusée. Si c'est le cas chez toi, l'appli garde tes données et te demande de te reconnecter.

**Où passe la connexion ?**
- Extension et APK : **directement** de l'appareil vers PRONOTE.
- Page web : un navigateur ne peut pas appeler PRONOTE directement (CORS). Elle passe par le petit serveur de `server/` (`npm start`), qui ne stocke rien. Si tu l'héberges en ligne (Render, Railway, Fly.io…), mets-le en **HTTPS**. Si la page est hébergée ailleurs que le serveur, renseigne l'adresse du serveur dans le formulaire et ajoute l'origine de la page dans la variable `ALLOWED_ORIGINS`.

`node scripts/check-pronote-demo.mjs` teste la connexion sur le serveur de démonstration public d'Index Éducation.

## Ce qui remplace les fonctions Claude du prototype

| Prototype (dans Claude) | Appli autonome |
|---|---|
| Dictée de l'app Claude | Reconnaissance vocale du navigateur (Chrome, Edge, Safari) ; module natif dans l'APK |
| IA de Claude en secours | Facultatif : ta propre clé API Anthropic, saisie dans **Discuter** et gardée sur l'appareil. Sans clé, le chat marche en mode local |
| Navigateur intégré de Claude pour lire PRONOTE | Connexion pawnote (identifiant, QR code/ENT) + copier-coller |
| Notifications simulées | Vraies notifications : programmées par Android dans l'APK ; affichées tant que l'appli est ouverte en web/extension |

Google Agenda et Outlook restent simulés : en attendant une vraie connexion, importe leur export **.ics** (carte « Fichier ICS »).

## Organisation du code

```
app/                 interface (HTML, CSS, JS sans framework) : source commune aux 4 formats
  js/app.js          logique de l'appli (planning, priorités, chat local, rappels)
  js/platform.js     micro, notifications, PRONOTE, IA selon le format
src/pronote-core.mjs connexion PRONOTE (pawnote), partagée par le serveur, l'extension et l'APK
src/ai-browser.mjs   IA facultative (SDK Anthropic)
server/              serveur Node (page web + relais PRONOTE)
extension/           manifeste de l'extension (Manifest V3)
android/             projet Android (Capacitor)
scripts/build.mjs    construit dist/
```

Les données (devoirs, réglages, jeton PRONOTE) restent dans le stockage local de l'appareil.
