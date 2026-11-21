// Connexion à PRONOTE et conservation du jeton de reconnexion.
//
// Règles :
// - le mot de passe ne vient QUE des variables d'environnement et n'est jamais
//   écrit sur le disque ni dans les journaux ;
// - après la première connexion, seul le jeton renvoyé par PRONOTE est gardé,
//   dans un fichier lisible par l'utilisateur seulement (chmod 600) ;
// - ce jeton n'est valable que pour l'identifiant d'appareil (deviceUUID)
//   enregistré avec lui.
import { randomUUID } from "node:crypto";
import { chmodSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import * as P from "pawnote";
import { compatFetcher } from "./compat.js";

export type SavedSession = {
  deviceUUID: string;
  url?: string;
  username?: string;
  token?: string;
  kind?: number;
  navigatorIdentifier?: string;
  savedAt?: string;
};

export function sessionFilePath(): string {
  if (process.env.PRONOTE_SESSION_FILE) return process.env.PRONOTE_SESSION_FILE;
  const base = process.platform === "win32"
    ? (process.env.APPDATA || join(homedir(), "AppData", "Roaming"))
    : (process.env.XDG_CONFIG_HOME || join(homedir(), ".config"));
  return join(base, "mcp-pronote", "session.json");
}

export function readSession(): SavedSession {
  const file = sessionFilePath();
  try {
    const data = JSON.parse(readFileSync(file, "utf8"));
    if (data && typeof data.deviceUUID === "string") return data;
  } catch { /* pas encore de session */ }
  return { deviceUUID: randomUUID() };
}

export function writeSession(s: SavedSession): void {
  const file = sessionFilePath();
  mkdirSync(dirname(file), { recursive: true, mode: 0o700 });
  writeFileSync(file, JSON.stringify({ ...s, savedAt: new Date().toISOString() }, null, 2), { mode: 0o600 });
  try { chmodSync(file, 0o600); } catch { /* Windows */ }
}

export function deleteSession(): boolean {
  const file = sessionFilePath();
  if (!existsSync(file)) return false;
  rmSync(file);
  return true;
}

const KINDS: Record<string, P.AccountKind> = { eleve: P.AccountKind.STUDENT, parent: P.AccountKind.PARENT };

function envCredentials() {
  const url = process.env.PRONOTE_URL?.trim();
  const username = process.env.PRONOTE_USERNAME?.trim();
  const password = process.env.PRONOTE_PASSWORD;
  if (!url || !username || !password) return null;
  return { url: P.cleanURL(url), username, password, kind: KINDS[(process.env.PRONOTE_KIND || "eleve").toLowerCase()] ?? P.AccountKind.STUDENT };
}

/** Traduit les erreurs de pawnote en messages compréhensibles (en français). */
export function explainError(e: unknown): string {
  const err = e as { name?: string; message?: string; constructor?: { name?: string } };
  const name = err?.name && err.name !== "Error" ? err.name : err?.constructor?.name || "";
  const map: Record<string, string> = {
    BadCredentialsError: "Identifiant ou mot de passe refusé par PRONOTE. Avec PRONOTE 2026, la connexion par mot de passe peut échouer même avec les bons identifiants : utilise la connexion par QR code (voir le README).",
    AccountDisabledError: "Ce compte PRONOTE est désactivé.",
    SuspendedIPError: "PRONOTE bloque temporairement les connexions depuis cette adresse. Réessaie plus tard.",
    RateLimitedError: "Trop de tentatives. Patiente quelques minutes.",
    BusyPageError: "PRONOTE est occupé ou en maintenance. Réessaie plus tard.",
    PageUnavailableError: "Cette adresse PRONOTE ne répond pas. Vérifie PRONOTE_URL.",
    UnreachableError: "Impossible de joindre ce PRONOTE. Vérifie l'adresse et la connexion internet.",
    SessionExpiredError: "La session PRONOTE a expiré.",
    AccessDeniedError: "Accès refusé par PRONOTE.",
    SecurityError: "L'établissement demande une double authentification : utilise la connexion par QR code.",
  };
  if (!map[name] && e instanceof TypeError && /fetch|network/i.test(String(err.message))) return map.UnreachableError;
  return map[name] || `PRONOTE a renvoyé une erreur : ${err?.message || String(e)}`;
}

let current: { session: P.SessionHandle; mode: string } | null = null;

function remember(saved: SavedSession, r: P.RefreshInformation): void {
  writeSession({ deviceUUID: saved.deviceUUID, url: r.url, username: r.username, token: r.token, kind: r.kind, navigatorIdentifier: r.navigatorIdentifier });
}

/** Connexion par QR code (affiché dans PRONOTE) et code PIN à 4 chiffres. */
export async function loginWithQr(qr: unknown, pin: string): Promise<P.SessionHandle> {
  const saved = readSession();
  const session = P.createSessionHandle(compatFetcher());
  const data = typeof qr === "string" ? JSON.parse(qr) : qr;
  const r = await P.loginQrCode(session, { deviceUUID: saved.deviceUUID, pin: String(pin), qr: data });
  remember(saved, r);
  current = { session, mode: "qr" };
  return session;
}

/** Connexion avec le jeton enregistré, sinon avec les variables d'environnement. */
export async function login(): Promise<P.SessionHandle> {
  const saved = readSession();
  const errors: string[] = [];

  if (saved.token && saved.url && saved.username) {
    const session = P.createSessionHandle(compatFetcher());
    try {
      const r = await P.loginToken(session, {
        url: saved.url, kind: (saved.kind ?? P.AccountKind.STUDENT) as P.AccountKind, username: saved.username,
        token: saved.token, deviceUUID: saved.deviceUUID, navigatorIdentifier: saved.navigatorIdentifier,
      });
      remember(saved, r); // PRONOTE renvoie un nouveau jeton à chaque connexion
      current = { session, mode: "jeton" };
      return session;
    } catch (e) {
      errors.push("jeton enregistré : " + explainError(e));
    }
  }

  const creds = envCredentials();
  if (creds) {
    const session = P.createSessionHandle(compatFetcher());
    try {
      const r = await P.loginCredentials(session, { ...creds, deviceUUID: saved.deviceUUID });
      remember(saved, r);
      current = { session, mode: "identifiants" };
      return session;
    } catch (e) {
      errors.push("identifiants : " + explainError(e));
    }
  }

  if (!errors.length) {
    throw new Error("Aucune connexion PRONOTE configurée. Renseigne PRONOTE_URL, PRONOTE_USERNAME et PRONOTE_PASSWORD, ou connecte-toi une fois par QR code (outil pronote_connexion_qr ou commande « mcp-pronote login-qr »).");
  }
  throw new Error("Connexion PRONOTE impossible. " + errors.join(" | "));
}

export function connectionMode(): string | null { return current?.mode ?? null; }

export async function getSession(): Promise<P.SessionHandle> {
  return current ? current.session : login();
}

const isExpired = (e: unknown) => {
  const n = (e as { name?: string; constructor?: { name?: string } })?.name || (e as { constructor?: { name?: string } })?.constructor?.name;
  return n === "SessionExpiredError" || /expired|expir/i.test(String((e as Error)?.message));
};

/** Exécute une requête PRONOTE ; si la session a expiré, se reconnecte une fois. */
export async function withSession<T>(fn: (s: P.SessionHandle) => Promise<T>): Promise<T> {
  const s = await getSession();
  try {
    return await fn(s);
  } catch (e) {
    if (!isExpired(e)) throw e;
    current = null;
    return fn(await login());
  }
}
