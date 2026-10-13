import fs from "node:fs";
import path from "node:path";

/* ---------------------------------------------------------------------------
   Circular, as a drop-in.

   Circular is a licensed typeface (Lineto), so its files cannot ship in this
   repository by default. Put the web font files you are licensed for into
   `public/fonts/circular/` and the site picks them up on the next build:

     public/fonts/circular/CircularStd-Book.woff2      -> 400
     public/fonts/circular/CircularStd-Medium.woff2    -> 500
     public/fonts/circular/CircularStd-Bold.woff2      -> 700

   The weight is read from the file name, so any naming that contains Book,
   Regular, Medium, Bold, Black or Light works, with "Italic" for italics.
   woff2 is preferred when one weight exists in several formats. The page uses
   400, 500 and 700; anything else is optional.

   Runs on the server only, at build time for the static page.
--------------------------------------------------------------------------- */

const DIRECTORY = path.join(process.cwd(), "public", "fonts", "circular");
const PUBLIC_PATH = "/fonts/circular";

/** Best first. */
const FORMATS = [
  { extension: ".woff2", format: "woff2", type: "font/woff2" },
  { extension: ".woff", format: "woff", type: "font/woff" },
  { extension: ".otf", format: "opentype", type: "font/otf" },
  { extension: ".ttf", format: "truetype", type: "font/ttf" },
] as const;

/** Checked in order, so "ExtraBold" is not read as "Bold". */
const WEIGHTS: [RegExp, number][] = [
  [/black/i, 900],
  [/extra[-_ ]?bold|xbold/i, 800],
  [/bold/i, 700],
  [/medium/i, 500],
  [/light/i, 300],
  [/book|regular|normal|roman/i, 400],
];

export interface CircularFace {
  url: string;
  format: string;
  type: string;
  weight: number;
  italic: boolean;
}

export function getCircularFaces(): CircularFace[] {
  let files: string[];
  try {
    files = fs.readdirSync(DIRECTORY);
  } catch {
    return [];
  }

  const faces = new Map<string, CircularFace & { rank: number }>();

  for (const file of files) {
    const extension = path.extname(file).toLowerCase();
    const rank = FORMATS.findIndex((entry) => entry.extension === extension);
    if (rank === -1) continue;

    const weight = WEIGHTS.find(([pattern]) => pattern.test(file))?.[1];
    if (!weight) continue;

    const italic = /italic|oblique/i.test(file);
    const key = `${weight}-${italic}`;
    const existing = faces.get(key);
    if (existing && existing.rank <= rank) continue;

    faces.set(key, {
      url: `${PUBLIC_PATH}/${encodeURIComponent(file)}`,
      format: FORMATS[rank].format,
      type: FORMATS[rank].type,
      weight,
      italic,
      rank,
    });
  }

  return [...faces.values()]
    .sort((a, b) => a.weight - b.weight || Number(a.italic) - Number(b.italic))
    .map((face) => ({
      url: face.url,
      format: face.format,
      type: face.type,
      weight: face.weight,
      italic: face.italic,
    }));
}

export function circularFontFaceCss(faces: CircularFace[]): string {
  return faces
    .map(
      (face) =>
        `@font-face{font-family:"Circular";src:url("${face.url}") format("${face.format}");font-weight:${face.weight};font-style:${face.italic ? "italic" : "normal"};font-display:swap}`
    )
    .join("");
}
