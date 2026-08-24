import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, "icon-source.svg");
const publicDir = path.join(__dirname, "..", "public");

const targets = [
  { file: "pwa-192.png", size: 192 },
  { file: "pwa-512.png", size: 512 },
  { file: "apple-touch-icon.png", size: 180 },
  { file: "favicon-32.png", size: 32 },
];

for (const { file, size } of targets) {
  await sharp(src).resize(size, size).png().toFile(path.join(publicDir, file));
  console.log(`generated ${file}`);
}
