// Version embarquée de la connexion PRONOTE, pour l'extension et l'APK
// Android : dans ces deux formats, l'appli peut joindre PRONOTE directement,
// sans serveur intermédiaire. La page web simple passe par le serveur.
import { pronoteSync, explainError } from './pronote-core.mjs';

window.MLPPronote = {
  direct: true,
  async sync(req) {
    try { return await pronoteSync(req); } catch (e) { throw explainError(e); }
  },
};
