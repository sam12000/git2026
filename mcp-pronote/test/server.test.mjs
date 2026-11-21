// Tests sans vrai PRONOTE : correctif 2026, lecture du QR code, démarrage du serveur MCP.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import QRCode from "qrcode";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fixStartScript } from "../dist/compat.js";
import { parseQrInput } from "../dist/qr.js";

test("corrige la page de connexion PRONOTE 2026", () => {
  const html = '<script>try { Start ({h:"123",a:3});} catch (e) {}</script>';
  assert.equal(fixStartScript(html), '<script>try { Start ({h:"123",a:3})} catch (e) {}</script>');
  const old = '<script>try { Start ({h:"1"})} catch (e) {}</script>';
  assert.equal(fixStartScript(old), old);
});

test("lit un QR code PRONOTE depuis une capture PNG", async () => {
  const dir = mkdtempSync(join(tmpdir(), "qr-"));
  const file = join(dir, "qr.png");
  const content = JSON.stringify({ jeton: "abc", login: "xyz", url: "https://demo.index-education.net/pronote/mobile.eleve.html" });
  writeFileSync(file, await QRCode.toBuffer(content, { type: "png", width: 300 }));
  assert.deepEqual(parseQrInput({ image: file }), JSON.parse(content));
  assert.throws(() => parseQrInput({ contenu: '{"a":1}' }), /ne vient pas de PRONOTE/);
});

test("le serveur MCP liste ses outils et explique l'absence de connexion", async () => {
  const dir = mkdtempSync(join(tmpdir(), "mcp-"));
  const env = { ...process.env, PRONOTE_SESSION_FILE: join(dir, "session.json") };
  delete env.PRONOTE_URL; delete env.PRONOTE_USERNAME; delete env.PRONOTE_PASSWORD;
  const client = new Client({ name: "test", version: "1" });
  await client.connect(new StdioClientTransport({ command: process.execPath, args: ["dist/index.js"], env, stderr: "ignore" }));
  const { tools } = await client.listTools();
  const names = tools.map((t) => t.name).sort();
  for (const n of ["pronote_statut", "pronote_resume", "pronote_devoirs", "pronote_emploi_du_temps", "pronote_notes", "pronote_controles", "pronote_vie_scolaire", "pronote_actualites", "pronote_connexion_qr", "pronote_marquer_devoir"]) {
    assert.ok(names.includes(n), n);
  }
  const r = await client.callTool({ name: "pronote_statut", arguments: {} });
  assert.equal(r.isError, true);
  assert.match(r.content[0].text, /Aucune connexion PRONOTE configurée/);
  await client.close();
});
