#!/usr/bin/env node
// Serveur MCP PRONOTE pour Claude (Claude Code, Claude Desktop…).
// Tourne sur l'ordinateur de l'utilisateur et parle à Claude en stdio :
// les identifiants ne quittent jamais la machine, sauf vers PRONOTE.
//
// Commandes :
//   mcp-pronote                 démarre le serveur MCP (utilisé par Claude)
//   mcp-pronote login           teste la connexion et enregistre le jeton
//   mcp-pronote login-qr …      connexion par QR code (voir --help)
//   mcp-pronote logout          supprime le jeton enregistré
import { createInterface } from "node:readline/promises";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as P from "pawnote";
import { z } from "zod";
import { connectionMode, deleteSession, explainError, login, loginWithQr, sessionFilePath, withSession } from "./auth.js";
import * as D from "./pronote.js";
import { parseQrInput } from "./qr.js";

const VERSION = "0.1.0";

const ok = (data: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] });
// Nos propres erreurs (Error simple) sont déjà en français ; les autres viennent de pawnote.
const message = (e: unknown) => (e instanceof Error && e.constructor === Error ? e.message : explainError(e));
const fail = (e: unknown) => ({ isError: true, content: [{ type: "text" as const, text: message(e) }] });
const safe = <A>(fn: (a: A) => Promise<unknown>) => async (a: A) => {
  try { return ok(await fn(a)); } catch (e) { return fail(e); }
};

const dateArg = (what: string) => z.string().optional().describe(`${what} au format AAAA-MM-JJ`);
const readOnly = { readOnlyHint: true, openWorldHint: true } as const;

function buildServer() {
  const server = new McpServer({ name: "pronote", version: VERSION }, {
    instructions: "Accès en lecture au compte PRONOTE de l'utilisateur (élève ou parent). Les dates s'écrivent AAAA-MM-JJ. Pour organiser une journée ou des révisions, commence par pronote_resume. Si un outil répond qu'aucune connexion n'est configurée, propose la connexion par QR code.",
  });

  server.registerTool("pronote_statut", {
    title: "Statut de la connexion PRONOTE",
    description: "Se connecte si besoin et indique le compte, la classe, l'établissement, le mode de connexion et les périodes de notes.",
    inputSchema: {}, annotations: readOnly,
  }, safe(async () => withSession(async (s) => ({ ...D.profile(s), connexion: connectionMode(), periodes: D.periods(s), fichier_jeton: sessionFilePath() }))));

  server.registerTool("pronote_resume", {
    title: "Résumé des prochains jours",
    description: "Cours, devoirs non faits et contrôles repérés pour aujourd'hui et les jours suivants. Point de départ pour planifier.",
    inputSchema: { jours: z.number().int().min(1).max(30).optional().describe("Nombre de jours à couvrir (7 par défaut)") },
    annotations: readOnly,
  }, safe(async ({ jours }) => withSession(async (s) => {
    const [from, to] = D.range(undefined, undefined, (jours ?? 7) - 1);
    const [cours, devoirs] = await Promise.all([D.timetable(s, from, to), D.homework(s, from, to)]);
    const controles = await D.upcomingTests(s, from, to);
    return {
      ...D.profile(s), du: D.day(from), au: D.day(to),
      cours, devoirs_a_faire: devoirs.filter((d) => !d.fait),
      controles: { cours: controles.cours_marques_controle, devoirs: controles.devoirs_qui_parlent_d_un_controle },
    };
  })));

  server.registerTool("pronote_emploi_du_temps", {
    title: "Emploi du temps",
    description: "Cours entre deux dates, avec salles, professeurs, cours annulés ou modifiés et devoirs surveillés.",
    inputSchema: { debut: dateArg("Premier jour (aujourd'hui par défaut)"), fin: dateArg("Dernier jour (7 jours plus tard par défaut)") },
    annotations: readOnly,
  }, safe(async ({ debut, fin }) => withSession(async (s) => { const [a, b] = D.range(debut, fin, 6); return D.timetable(s, a, b); })));

  server.registerTool("pronote_devoirs", {
    title: "Devoirs à faire",
    description: "Devoirs entre deux dates avec consigne, date limite, durée estimée et état (fait ou non).",
    inputSchema: {
      debut: dateArg("Premier jour (aujourd'hui par défaut)"),
      fin: dateArg("Dernier jour (14 jours plus tard par défaut)"),
      non_faits: z.boolean().optional().describe("Seulement les devoirs pas encore faits"),
    },
    annotations: readOnly,
  }, safe(async ({ debut, fin, non_faits }) => withSession(async (s) => {
    const [a, b] = D.range(debut, fin, 14);
    const list = await D.homework(s, a, b);
    return non_faits ? list.filter((d) => !d.fait) : list;
  })));

  server.registerTool("pronote_controles", {
    title: "Contrôles à venir",
    description: "Contrôles et évaluations repérés : cours marqués devoir surveillé et devoirs dont la consigne parle d'un contrôle.",
    inputSchema: { debut: dateArg("Premier jour (aujourd'hui par défaut)"), fin: dateArg("Dernier jour (21 jours plus tard par défaut)") },
    annotations: readOnly,
  }, safe(async ({ debut, fin }) => withSession(async (s) => { const [a, b] = D.range(debut, fin, 21); return D.upcomingTests(s, a, b); })));

  server.registerTool("pronote_notes", {
    title: "Notes et moyennes",
    description: "Moyennes par matière et notes d'une période (la période en cours par défaut).",
    inputSchema: { periode: z.string().optional().describe("Nom ou partie du nom de la période, par exemple « Trimestre 1 »") },
    annotations: readOnly,
  }, safe(async ({ periode }) => withSession((s) => D.grades(s, periode))));

  server.registerTool("pronote_vie_scolaire", {
    title: "Absences, retards et vie scolaire",
    description: "Absences, retards, punitions et observations d'une période.",
    inputSchema: { periode: z.string().optional().describe("Nom ou partie du nom de la période") },
    annotations: readOnly,
  }, safe(async ({ periode }) => withSession((s) => D.schoolLife(s, periode))));

  server.registerTool("pronote_actualites", {
    title: "Informations et sondages",
    description: "Dernières informations et sondages publiés par l'établissement.",
    inputSchema: { nombre: z.number().int().min(1).max(50).optional().describe("Nombre d'éléments (20 par défaut)") },
    annotations: readOnly,
  }, safe(async ({ nombre }) => withSession((s) => D.newsItems(s, nombre ?? 20))));

  server.registerTool("pronote_marquer_devoir", {
    title: "Cocher un devoir comme fait",
    description: "Coche ou décoche « fait » sur un devoir dans PRONOTE (l'id vient de pronote_devoirs). Demande confirmation à l'utilisateur avant.",
    inputSchema: { id: z.string().describe("id du devoir"), fait: z.boolean().describe("true pour fait, false pour à faire") },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  }, safe(async ({ id, fait }) => withSession(async (s) => { await P.assignmentStatus(s, id, fait); return { id, fait }; })));

  server.registerTool("pronote_connexion_qr", {
    title: "Se connecter par QR code",
    description: "Connexion par le QR code de PRONOTE (rubrique « Application mobile ») et le code PIN à 4 chiffres choisi en le créant. Donne soit le chemin d'une capture d'écran du QR code, soit son contenu. Le QR code expire au bout de quelques minutes. Ensuite le jeton est enregistré sur l'ordinateur.",
    inputSchema: {
      image: z.string().optional().describe("Chemin d'une capture PNG ou JPEG du QR code"),
      contenu: z.string().optional().describe("Contenu texte (JSON) du QR code"),
      pin: z.string().regex(/^\d{4}$/).describe("Code PIN à 4 chiffres"),
    },
    annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: true },
  }, safe(async ({ image, contenu, pin }) => {
    const s = await loginWithQr(parseQrInput({ image, contenu }), pin);
    return { connecte: true, ...D.profile(s), fichier_jeton: sessionFilePath() };
  }));

  return server;
}

async function cli(cmd: string, args: string[]) {
  const opt = (name: string) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
  if (cmd === "login") {
    const s = await login();
    console.log(`Connecté (${connectionMode()}) : ${JSON.stringify(D.profile(s))}`);
    console.log(`Jeton enregistré dans ${sessionFilePath()}. Tu peux retirer PRONOTE_PASSWORD de ta configuration.`);
  } else if (cmd === "login-qr") {
    let pin = opt("--pin");
    if (!pin) {
      const rl = createInterface({ input: process.stdin, output: process.stdout });
      pin = (await rl.question("Code PIN à 4 chiffres : ")).trim();
      rl.close();
    }
    const qr = parseQrInput({ image: opt("--image"), contenu: opt("--json") });
    const s = await loginWithQr(qr, pin);
    console.log(`Connecté par QR code : ${JSON.stringify(D.profile(s))}`);
    console.log(`Jeton enregistré dans ${sessionFilePath()}.`);
  } else if (cmd === "logout") {
    console.log(deleteSession() ? "Jeton supprimé." : "Aucun jeton enregistré.");
  } else {
    console.log(`mcp-pronote ${VERSION}
  mcp-pronote                                   démarre le serveur MCP (lancé par Claude)
  mcp-pronote login                             teste PRONOTE_URL / PRONOTE_USERNAME / PRONOTE_PASSWORD et garde le jeton
  mcp-pronote login-qr --image qr.png [--pin 1234]   connexion par QR code (capture d'écran)
  mcp-pronote login-qr --json '{"jeton":…}' [--pin 1234]
  mcp-pronote logout                            supprime le jeton enregistré`);
  }
}

const [cmd, ...rest] = process.argv.slice(2);
if (cmd) {
  cli(cmd, rest).catch((e) => { console.error(message(e)); process.exit(1); });
} else {
  const server = buildServer();
  await server.connect(new StdioServerTransport());
  console.error(`mcp-pronote ${VERSION} prêt (jeton : ${sessionFilePath()})`);
}
