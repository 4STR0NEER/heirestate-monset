# Heir Estates

Showcase site for Heir Estates's projects. Vite + React + Tailwind v4, Motion, anime.js, Three.js.

```
npm install
npm run dev                  # every site at once: the collection on 5173, alto 5174, wave 5175, pristina 5176
npx vite --mode wave         # just one project's site; any id in src/projects.js `order`
npm run build                # every site, into dist/<site>/
```

## Sites and SEO

One codebase, one site per project: the collection, and each project's own page with its own title, description, canonical URL, Open Graph tags, JSON-LD, robots.txt and sitemap.xml (`sites.js`), its text written into the HTML so crawlers read it without running JavaScript.

`npm run build` builds every site into `dist/<site>/` and puts them together in `dist/all/`, which is what Cloudflare serves (`wrangler.jsonc`, deployed on every push to `main`): the collection at `/`, each project at `/<id>/`, all sharing one set of media and assets.

- **On heirestates.com** (the default, `DOMAIN` in `src/lib/links.js`): the collection on the bare domain, each project on its subdomain (`wave.heirestates.com`). `worker.js` serves `/wave/` to anyone arriving on `wave.<domain>`, and sends `www` to the bare domain.
- **On one address without subdomains:** build with `VITE_DOMAIN=""` and `SITE_HOST=<address>`; projects live at `/wave/` and links between the sites are paths.

On the main site, project links are real links to the subdomains (crawlers and new tabs follow them); a plain click still opens the project in place over the facade.

A new project needs an entry in `src/projects.js` (and `order`), its media in `public/media/p/`, and its subdomain added as a custom domain on the Cloudflare Worker.

- `src/projects.js`: the five facade windows and each project's page content.
- `resources/` (not in git) holds the client's raw files; web cuts live in `public/media/`.

Credits: the hero's film wipe follows [Skiper UI](https://skiper-ui.com)'s clip-path image reveals; the floating nav follows Skiper UI (skiper02) and VengeanceUI's notch-navbar ([MIT](https://github.com/Ashutoshx7/VengeanceUI)).

## Scroll descent frames

`public/frames/<project>/` holds the frame sequences the portfolio scrubs on scroll (`src/lib/frames.js`, counts in `COUNTS`). Cut from the films in `resources/`:

```
ffmpeg -ss 90   -t 9.3 -i "resources/Alto Ranudo/Copy of Alto Walkthrough.mp4"        -vf "reverse,fps=10,scale=1024:-2"                -c:v libwebp -quality 55 public/frames/alto/%03d.webp
ffmpeg -ss 8.4  -t 2.9 -i "resources/the wave/The Wave Towers AVP.mp4"             -vf "fps=22,scale=1024:-2"                        -c:v libwebp -quality 55 public/frames/wave/%03d.webp
ffmpeg -ss 51.6 -t 5.2 -i "resources/Pristina Town_Walkthrough (1).mp4"   -vf "crop=1920:960:0:0,fps=12,scale=1024:-2"      -c:v libwebp -quality 55 public/frames/pristina/%03d.webp
```

## The Wave's films

The site opens on the brand film's first 11.6 s (`src/sections/FilmHero.jsx`), with its first and last frames as stills:

```
ffmpeg -t 11.6 -i "resources/the wave/The Wave Towers AVP.mp4" -vf scale=1920:-2 -c:v libx264 -preset slow -crf 25 -g 48 -pix_fmt yuv420p -movflags +faststart -an public/media/p/wave-intro.mp4
ffmpeg -ss 0.4  -i "resources/the wave/The Wave Towers AVP.mp4" -frames:v 1 -vf scale=1920:-2 -q:v 4 public/media/p/wave-intro.jpg
ffmpeg -ss 11.4 -i "resources/the wave/The Wave Towers AVP.mp4" -frames:v 1 -vf scale=1920:-2 -q:v 4 public/media/p/wave-intro-end.jpg
```

The unit video tours (`src/sections/TourPlayer.jsx`; each stop's time in `src/projects.js`) are 720p with a keyframe every half second, so jumping to a room is quick. The one-bedroom film skips 23.5–30 s, where someone crosses the shot; each poster is the first frame (`-ss 0.3 -frames:v 1 -q:v 5`):

```
ffmpeg -i "resources/the wave/1br-walkthrough the wave.mp4" -filter_complex "[0:v]trim=0:23.5,setpts=PTS-STARTPTS[a];[0:v]trim=30:44.5,setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1:a=0,scale=1280:-2" -c:v libx264 -preset slow -crf 25 -g 15 -pix_fmt yuv420p -movflags +faststart -an public/media/p/wave-tour-1br.mp4
ffmpeg -i "resources/the wave/2br-walkthrough the wave.mov" -vf scale=1280:-2 -c:v libx264 -preset slow -crf 28 -g 15 -pix_fmt yuv420p -movflags +faststart -an public/media/p/wave-tour-2br.mp4
ffmpeg -i "resources/the wave/3br-walkthrough the wave.mov" -vf scale=1280:-2 -c:v libx264 -preset slow -crf 28 -g 15 -pix_fmt yuv420p -movflags +faststart -an public/media/p/wave-tour-3br.mp4
```

From the brochure (`resources/the wave/The wave.pdf`, PyMuPDF): `wave-enso.webp` is the master-plan render on page 13, laid on the brochure's navy (`#26345f`) and cropped square.

The residences (`src/sections/Residences.jsx`) use the brochure's unit renders (`wave-unit-<type>.webp`, pages 44, 50, 60 and 73, saved 1920 wide) and its 35 floor plans (`wave-plan-<layout>.webp`, pages 46 to 86): each plan page rendered at 130 dpi, cropped to the drawing and its area table (`Rect(300, 66, 945, 512)`), with the page title and "Tower 1" painted over in the page colour. Every layout's total area, transcribed from those tables, is in `src/projects.js`. The sixth-floor plan in Spaces (`wave-amenity-plan.webp`, page 19) is the brochure's landscape image joined to its own transparency mask (it is stored as two images) and laid on the plan pages' colour.

The Wave's amenity photos (`public/media/p/wave-<space>.webp`, the Spaces story) are the full renders embedded in `resources/the wave/The wave.pdf`, pages 16 to 31, pulled out at their own resolution (PyMuPDF `extract_image`) and saved at 1920 wide: `ffmpeg -i <render>.jpeg -vf scale=1920:-2 -c:v libwebp -quality 74`.

Unit photos in `public/media/p/unit-studio-*` and `unit-1br-*` are the brochure squares with their label bar cropped off: `-vf "crop=1080:1000:0:0,scale=760:-2"`.

## Alto Ranudo's site

Green and geometric where The Wave is navy and ink: its `theme` in `src/projects.js` repaints the house colour tokens with the deck's forest green and bronze (written into the page head by `sites.js`), and its `motif: "fins"` swaps the brush edge and crossfades for the facade's fins (`src/lib/fins.js`): fins along the edge of every dark section (`FinEdge.jsx`), a louvre wipe between arrival photos, the amenities as a louvre of slats, a ruled grid behind its paper sections and registration marks on its frames (`Corners.jsx`). Everything comes from `resources/Alto Ranudo/`:

- `alto-intro.mp4` and its stills: the first 12.6 s of "Extended Alto Ranudo Video Walkthrough.mp4", cut as The Wave's intro is (`-crf 29`).
- Renders (`alto-<space>.webp`, `alto-ext-*`, `alto-podium`), floor plates (`alto-floor-<level>.webp`) and unit plans (`alto-plan-*`): the deck PDF's own images at full size, each joined to its transparency mask and laid on `#e2e1dc`, plates and plans at most 1600 wide.
- Unit photos: frames of the extended film at 138, 144, 147 and 152 s, cropped clear of its caption tag (`crop=1214:850:353:0,scale=1000:700`), and the deck's bare-unit renders; the unit banners are the same frames at 1920 by 823.

## North Grove at Pristina Town's site

The project id stays `pristina` (it is in every address); the site leads with North Grove, as its plans do. Its hand is the land, `motif: "contours"`: topographic rings that draw themselves in behind sections (`Contours.jsx`), a ridgeline of hills on the edge of every dark section (`Edge.jsx`), spaces that open in a widening ring, and the plans' plumeria (`Plumeria.jsx`), all drawn from seeds in `src/lib/topo.js`. Its palette is the plans' own paper, olive and unit colours (`--color-grove-*`, `--color-unit-*`).

From `resources/pristina town/`: `grove-intro.mp4` is the town film's first 6.3 s; the floor plates (`grove-lumina-*`, `grove-terra-*`) and unit sheets (`grove-sheet-*`) are the developer's own sheets as webp, the unit photographs cropped from the sheets (`crop=630:542:0:0`). The payment terms are the shape of the sample term sheet's scheme, without its figures.

