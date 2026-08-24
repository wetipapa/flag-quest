import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * scripts/continents-source.svg (Wikimedia Commons "File:Continents.svg",
 * CIA World Factbook 세계지도를 potrace로 트레이싱한 Public Domain 자료 —
 * https://commons.wikimedia.org/wiki/File:Continents.svg, 남극·뉴질랜드 미포함)
 * 에서 대륙별 <path> 데이터를 뽑아 src/components/worldMapPaths.ts를 생성한다.
 *
 * 원본 SVG는 대륙별로 6개의 <g>가 이미 분리돼 있지만 id가 없어서, 각 그룹에 속한
 * <path>들의 시작 좌표를 지리적으로 대조해 어느 대륙인지 수동으로 확인했다(GROUP_TO_CONTINENT).
 * 원본 파일이 바뀌지 않는 한 이 매핑도 그대로 유효하다.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const svgPath = path.join(__dirname, "continents-source.svg");
const outPath = path.join(__dirname, "..", "src", "components", "worldMapPaths.ts");

const GROUP_TO_CONTINENT = {
  1: "africa",
  2: "asia",
  3: "oceania",
  4: "europe",
  5: "south-america",
  6: "north-america",
};

const svg = fs.readFileSync(svgPath, "utf8");
const groupRegex = /<g\b[^>]*>([\s\S]*?)<\/g>/g;
const result = {};
let m;
let i = 0;
while ((m = groupRegex.exec(svg))) {
  i++;
  const continent = GROUP_TO_CONTINENT[i];
  const pathRegex = /<path[^>]*\sd="([^"]+)"/g;
  let pm;
  const ds = [];
  while ((pm = pathRegex.exec(m[1]))) ds.push(pm[1]);
  result[continent] = ds;
}

const order = ["asia", "europe", "africa", "north-america", "south-america", "oceania"];
for (const c of order) {
  if (!result[c] || result[c].length === 0) throw new Error(`missing continent ${c}`);
}

let out = `/**
 * 실제 대륙 모양(Robinson 근사 투영) 경로 데이터.
 * scripts/regen-world-map-paths.mjs로 scripts/continents-source.svg에서 생성됨. 직접 고치지 말 것.
 *
 * 출처: Wikimedia Commons "File:Continents.svg"
 *   https://commons.wikimedia.org/wiki/File:Continents.svg
 *   (CIA World Factbook 세계지도를 potrace로 트레이싱, Public Domain — 남극·뉴질랜드 미포함)
 */
import type { ContinentId } from "../types";

/** 모든 <path>는 이 viewBox/transform 안에서 그려져야 한다. */
export const WORLD_MAP_VIEWBOX = "0 0 468 239";
export const WORLD_MAP_TRANSFORM = "translate(0,239) scale(0.016963,-0.016963)";

export const CONTINENT_PATHS: Record<ContinentId, string[]> = {
`;

for (const c of order) {
  out += `  "${c}": [\n`;
  for (const d of result[c]) out += `    "${d}",\n`;
  out += `  ],\n`;
}
out += `};\n`;

fs.writeFileSync(outPath, out, "utf8");
console.log("wrote", outPath, `(${(out.length / 1024).toFixed(1)} KB)`);
for (const c of order) console.log(` ${c}: ${result[c].length} paths`);
