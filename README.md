# akif.pw

Portfolio of Akif Yaylaci. Next.js 16 (App Router), React 19, Tailwind CSS 4, Motion and GSAP.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Adding a project

Everything about the curated projects lives in one file: [`src/data/projects.ts`](src/data/projects.ts).

1. Put the images in `public/projects/<slug>/`. Frames are shown 16:10; 2400×1500 works well.
2. Add one object to `PROJECTS`. TypeScript asks for every field, including the copy in English, German and Turkish.

| Field | What it does |
|---|---|
| `url`, `displayUrl` | Where "Visit" goes, and how the link reads on the page. Every project has one. |
| `featured` | `true` gives the project a full stage with a scrolling reel. `false` puts it in the compact list, where the row opens for detail. |
| `frames` | Images in the order the reel plays them. The first is the cover. One frame is fine; the reel then stands still. |
| `mobile` | Optional. The phone version of the site as one tall image (captured at 390×844 and stitched top to bottom), with its pixel `width` and `height`. Phones then show the project in a phone frame that scrolls through it; without it they get the desktop reel. |
| `stack` | Ids from [`src/data/tech.ts`](src/data/tech.ts). Each one renders as its icon and name. |
| `status` | `"live"`, or `"soon"` to keep the link but mark the site as not public yet. |
| `repo` | Name of the matching GitHub repository, so it is not listed a second time. |

The order of the array is the order on the page. Counters, numbering and layout follow from it.

### Adding a technology

Add a line to `TECH` in `src/data/tech.ts`. A `label` is enough; a `path` (a single-path 24×24 SVG, for example from [Simple Icons](https://simpleicons.org), CC0) makes it an icon. `LANGUAGE_TECH` in the same file maps the language names GitHub reports onto those ids.

### Repositories

The "On GitHub" list is read from `github.com/ak0f` at build time and refreshed hourly (`src/lib/github.ts`). A new public repository shows up without a code change. If a repository has a homepage set on GitHub, its row links there instead of to the code.

## Typeface

The site is designed for **Circular**. Circular is a licensed typeface from Lineto, so its files are not in this repository. To switch it on, put the web font files you are licensed for into `public/fonts/circular/`:

```
public/fonts/circular/CircularStd-Book.woff2      (400)
public/fonts/circular/CircularStd-Medium.woff2    (500)
public/fonts/circular/CircularStd-Bold.woff2      (700)
```

The weight is read from the file name (Book, Regular, Medium, Bold, Black, Light; "Italic" for italics), so other naming works too, and `.woff`, `.otf` and `.ttf` are accepted. Restart the dev server or rebuild and the page uses them; nothing in the code needs to change. See `src/lib/circular.ts`.

Until the files are there, DM Sans stands in. There is no monospace face anywhere on the site; figures that need to line up use tabular numerals.

Note that this repository is public. Check what your Circular licence allows before committing the font files to it.

## Structure

```
src/app/            layout (fonts, metadata, intro gate), page, global styles and tokens
src/components/     one file per section, plus projects/ and ui/
src/data/           projects.ts and tech.ts: the content you edit
src/i18n/           interface copy in en / de / tr, and the language provider
src/lib/            GitHub fetch, Circular drop-in, GSAP instance
```

Design tokens (colours, radius system, type scale, easing) are at the top of `src/app/globals.css`.
