# mcp-pronote : PRONOTE dans Claude

Petit serveur [MCP](https://modelcontextprotocol.io) qui tourne **sur ton ordinateur** et permet à Claude (Claude Code ou Claude Desktop) de lire ton PRONOTE : emploi du temps, devoirs, contrôles, notes, absences et informations de l'établissement.

Il utilise la même bibliothèque que l'appli MyLife Planner, [pawnote](https://www.npmjs.com/package/pawnote) 1.6.2, avec le même correctif pour la page de connexion de PRONOTE 2026. PRONOTE n'a pas d'API officielle : pawnote se connecte comme l'application mobile PRONOTE.

## Ce que Claude peut faire

| Outil | Rôle |
|---|---|
| `pronote_resume` | Cours, devoirs non faits et contrôles des prochains jours (7 par défaut) |
| `pronote_emploi_du_temps` | Cours entre deux dates, salles, profs, cours annulés, devoirs surveillés |
| `pronote_devoirs` | Devoirs avec consigne, date limite, durée estimée, fait ou non |
| `pronote_controles` | Contrôles repérés (cours « devoir surveillé » et consignes qui parlent d'un contrôle) |
| `pronote_notes` | Moyennes par matière et notes d'une période |
| `pronote_vie_scolaire` | Absences, retards, punitions, observations |
| `pronote_actualites` | Informations et sondages de l'établissement |
| `pronote_statut` | Compte connecté, classe, périodes |
| `pronote_marquer_devoir` | Coche ou décoche « fait » sur un devoir (seul outil qui modifie PRONOTE) |
| `pronote_connexion_qr` | Connexion par QR code depuis une capture d'écran |

Exemples de demandes : « Qu'est-ce que j'ai demain ? », « Fais-moi un planning de révisions pour mes contrôles des deux prochaines semaines », « Quelle matière fait baisser ma moyenne ? ».

## Installation

Il faut [Node.js](https://nodejs.org) 20 ou plus récent.

```bash
git clone https://github.com/sam12000/git2026
cd git2026/mcp-pronote
npm install
npm run build
```

Le serveur est alors dans `dist/index.js`. Note son chemin complet (par exemple `/Users/lydia/git2026/mcp-pronote/dist/index.js`), il sert ci-dessous.

## Se connecter à PRONOTE

Deux façons, au choix.

### 1. QR code (recommandé, et seule solution avec un ENT ou PRONOTE 2026)

1. Ouvre PRONOTE dans le navigateur. Clique sur l'icône de téléphone ou sur « Application mobile » en haut de la page, puis « Générer un QR code ».
2. Choisis un code PIN à 4 chiffres.
3. Fais une capture d'écran du QR code (il expire au bout de quelques minutes).
4. Dans un terminal :

   ```bash
   node dist/index.js login-qr --image ~/Desktop/qr.png --pin 1234
   ```

   Tu peux aussi le faire depuis Claude, une fois le serveur ajouté : « Connecte-toi à PRONOTE avec le QR code ~/Desktop/qr.png, PIN 1234 ».

### 2. Identifiant et mot de passe PRONOTE

Mets-les dans les variables d'environnement de la configuration MCP (voir plus bas) :

| Variable | Exemple |
|---|---|
| `PRONOTE_URL` | `https://0123456a.index-education.net/pronote/eleve.html` |
| `PRONOTE_USERNAME` | ton identifiant PRONOTE |
| `PRONOTE_PASSWORD` | ton mot de passe PRONOTE |
| `PRONOTE_KIND` | `eleve` (par défaut) ou `parent` |

Pour tester tout de suite : `PRONOTE_URL=… PRONOTE_USERNAME=… PRONOTE_PASSWORD=… node dist/index.js login`.

> **Limite connue.** Avec PRONOTE 2026 (version 2026.2 sur le serveur de démonstration), pawnote 1.6.2 échoue à la connexion par mot de passe (« Unable to resolve the challenge »), même avec les bons identifiants. En attendant une bibliothèque à jour, utilise le QR code. Les comptes qui passent par un ENT (Monlycée, ENT régional…) ne peuvent pas non plus se connecter par mot de passe : QR code obligatoire.

### Où vont tes identifiants

- Le mot de passe reste dans la configuration MCP de ton ordinateur. Il n'est jamais écrit dans un fichier par le serveur, ni affiché dans les journaux.
- Après la première connexion, le serveur garde seulement le **jeton de reconnexion** donné par PRONOTE, dans `~/.config/mcp-pronote/session.json` (sous Windows : `%APPDATA%\mcp-pronote\session.json`), lisible par toi seul. Tu peux alors retirer `PRONOTE_PASSWORD` de la configuration.
- Ce jeton ne marche que depuis cet ordinateur. `node dist/index.js logout` le supprime.
- Les données PRONOTE que Claude lit passent dans ta conversation avec Claude, comme tout ce que tu lui montres.

## Ajouter le serveur à Claude

### Claude Code

```bash
claude mcp add pronote --scope user -- node /chemin/complet/vers/git2026/mcp-pronote/dist/index.js
```

Avec identifiant et mot de passe :

```bash
claude mcp add pronote --scope user \
  -e PRONOTE_URL=https://0123456a.index-education.net/pronote/eleve.html \
  -e PRONOTE_USERNAME=ton.identifiant \
  -e PRONOTE_PASSWORD='ton mot de passe' \
  -- node /chemin/complet/vers/git2026/mcp-pronote/dist/index.js
```

Vérifie avec `claude mcp list`, puis dans Claude Code tape `/mcp`.

### Claude Desktop

Menu **Réglages → Développeur → Modifier la configuration**, ce qui ouvre `claude_desktop_config.json`. Ajoute :

```json
{
  "mcpServers": {
    "pronote": {
      "command": "node",
      "args": ["/chemin/complet/vers/git2026/mcp-pronote/dist/index.js"],
      "env": {
        "PRONOTE_URL": "https://0123456a.index-education.net/pronote/eleve.html",
        "PRONOTE_USERNAME": "ton.identifiant",
        "PRONOTE_PASSWORD": "ton mot de passe"
      }
    }
  }
}
```

Avec le QR code, la partie `env` est inutile. Redémarre Claude Desktop : « pronote » apparaît dans le menu des outils.

## Réglages facultatifs

| Variable | Rôle |
|---|---|
| `PRONOTE_TZ` | Fuseau horaire pour afficher les dates (`Europe/Paris` par défaut) |
| `PRONOTE_SESSION_FILE` | Autre emplacement pour le fichier du jeton |

## Développement

```bash
npm test     # compile puis teste le correctif 2026, la lecture du QR code et le serveur MCP
```

La CI (`.github/workflows/mcp-pronote.yml`) lance ces tests et essaie le PRONOTE de démonstration.

## Autres serveurs existants

- [`pronote-mcp`](https://pypi.org/project/pronote-mcp/) (Python, version 0.1.0) : lecture seule, mais uniquement pour les comptes Monlycée (ENT Île-de-France) ; repose sur pronotepy.
- [`mcp-pronotes`](https://glama.ai/mcp/servers/HAL-XP/mcp-pronotes) : répertorié sur Glama, non examiné.

Celui-ci gère les connexions directes, le QR code et le jeton, et reprend le correctif PRONOTE 2026 de MyLife Planner.
