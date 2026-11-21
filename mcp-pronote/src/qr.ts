// Lecture du QR code PRONOTE à partir d'une capture d'écran (PNG ou JPEG).
import { readFileSync } from "node:fs";
import jpeg from "jpeg-js";
import jsQRModule from "jsqr";
import { PNG } from "pngjs";

// jsqr est un module CommonJS : selon le chargeur, la fonction est l'export ou son « default ».
const jsQR = ((jsQRModule as unknown as { default?: unknown }).default ?? jsQRModule) as unknown as typeof import("jsqr").default;

export function readQrImage(path: string): string {
  const buf = readFileSync(path);
  let img: { width: number; height: number; data: Uint8Array };
  if (buf[0] === 0x89 && buf[1] === 0x50) img = PNG.sync.read(buf);
  else if (buf[0] === 0xff && buf[1] === 0xd8) img = jpeg.decode(buf, { useTArray: true, formatAsRGBA: true });
  else throw new Error("Format d'image non reconnu : utilise une capture PNG ou JPEG.");
  const code = jsQR(new Uint8ClampedArray(img.data.buffer, img.data.byteOffset, img.data.byteLength), img.width, img.height);
  if (!code) throw new Error("Aucun QR code lisible dans cette image. Recadre la capture autour du QR code.");
  return code.data;
}

/** Accepte le contenu JSON du QR code, ou le chemin d'une image qui le contient. */
export function parseQrInput(input: { contenu?: string; image?: string }): unknown {
  const text = input.image ? readQrImage(input.image) : input.contenu;
  if (!text) throw new Error("Donne le contenu du QR code ou le chemin d'une capture d'écran.");
  try {
    const data = JSON.parse(text);
    if (!data.jeton || !data.login || !data.url) throw new Error();
    return data;
  } catch {
    throw new Error("Ce QR code ne vient pas de PRONOTE (il doit contenir jeton, login et url).");
  }
}
