// Compatibilité PRONOTE 2026 (même correctif que src/pronote-core.mjs de l'appli).
// La page de connexion mobile écrit désormais « Start ({…});} catch » au lieu de
// « Start ({…})} catch », ce que pawnote 1.6.2 ne sait pas lire
// (erreur « The requested page does not exist »). On remet la forme attendue.
import { defaultFetcher, type Fetcher } from "@literate.ink/utilities";

export function fixStartScript(html: string): string {
  return String(html).replace(/(Start\s*\(\s*\{[\s\S]*?\}\s*\))\s*;(\s*\}\s*catch)/, "$1$2");
}

export const compatFetcher = (base: Fetcher = defaultFetcher): Fetcher => async (req) => {
  const res = await base(req);
  if (/\/mobile\.[a-z]+\.html/.test(String(req.url)) && typeof res.content === "string") {
    return { ...res, content: fixStartScript(res.content) };
  }
  return res;
};
