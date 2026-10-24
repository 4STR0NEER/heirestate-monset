# Heir Estate

Showcase site for Heir Estate's projects. Vite + React + Tailwind v4, Motion, anime.js, Three.js.

```
npm install
npm run dev                  # every site at once: the collection on 5173, alto 5174, wave 5175, pristina 5176
npx vite --mode wave         # just one project's site; any id in src/projects.js `order`
npm run build                # every site, into dist/<site>/
```

## Sites and SEO

One codebase, one site per project: the collection, and each project's own page with its own title, description, canonical URL, Open Graph tags, JSON-LD, robots.txt and sitemap.xml (`sites.js`), its text written into the HTML so crawlers read it without running JavaScript.

`npm run build` builds every site into `dist/<site>/` and puts them together in `dist/all/`, which is what Vercel serves (`vercel.json`): the collection at `/`, each project at `/<id>/`, all sharing one set of media and assets.

- **Now, on a `*.vercel.app` address** (which cannot have subdomains): projects live at `/wave/` and so on, and links between the sites are paths.
- **With a domain:** add `<domain>` and `wave.<domain>` (and the other projects) to the Vercel project, set the environment variable `VITE_DOMAIN=<domain>`, and redeploy. Links and SEO tags switch to the subdomains, and `vercel.json` serves `/wave/` to anyone arriving on `wave.<domain>`.

On the main site, project links are real links to the subdomains (crawlers and new tabs follow them); a plain click still opens the project in place over the facade.

A new project needs an entry in `src/projects.js` (and `order`), its media in `public/media/p/`, its id added to the host rule in `vercel.json` (the build stops if it is missing), and, once there is a domain, its subdomain added in Vercel.

- `src/projects.js`: the five facade windows and each project's page content.
- `resources/` (not in git) holds the client's raw files; web cuts live in `public/media/`.

Credits: the expand-on-hover panels follow [Skiper UI](https://skiper-ui.com) (skiper52/53). The silk background is adapted from VengeanceUI's FluidMorphBg ([MIT](https://github.com/Ashutoshx7/VengeanceUI)).

## Scroll descent frames

`public/frames/<project>/` holds the frame sequences the portfolio scrubs on scroll (`src/lib/frames.js`, counts in `COUNTS`). Cut from the films in `resources/`:

```
ffmpeg -ss 90   -t 9.3 -i "resources/Copy of Alto Walkthrough.mp4"        -vf "reverse,fps=10,scale=1024:-2"                -c:v libwebp -quality 55 public/frames/alto/%03d.webp
ffmpeg -ss 8.4  -t 2.9 -i "resources/The Wave Towers AVP.mp4"             -vf "fps=22,scale=1024:-2"                        -c:v libwebp -quality 55 public/frames/wave/%03d.webp
ffmpeg -ss 51.6 -t 5.2 -i "resources/Pristina Town_Walkthrough (1).mp4"   -vf "crop=1920:960:0:0,fps=12,scale=1024:-2"      -c:v libwebp -quality 55 public/frames/pristina/%03d.webp
```

The Wave's one-bedroom walkthrough (`src/sections/Walkthrough.jsx`; its stops, by frame number, are in `src/projects.js`) skips 23.5–30 s, where someone crosses the shot:

```
ffmpeg -i "resources/1br-walkthrough the wave.mp4" -filter_complex "[0:v]trim=0:23.5,setpts=PTS-STARTPTS[a];[0:v]trim=30:44.5,setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1:a=0,fps=8" -c:v libwebp -quality 50 public/frames/wave-1br/%03d.webp
```

The two- and three-bedroom films are cut whole, at 6 frames per second (the walkthrough blends between frames while it moves, so fewer frames still glide):

```
ffmpeg -i "resources/2br-walkthrough the wave.mov" -vf "fps=6,scale=1024:-2" -c:v libwebp -quality 50 public/frames/wave-2br/%03d.webp
ffmpeg -i "resources/3br-walkthrough the wave.mov" -vf "fps=6,scale=1024:-2" -c:v libwebp -quality 50 public/frames/wave-3br/%03d.webp
```

The Wave's amenity photos (`public/media/p/wave-<space>.webp`, the Spaces story) are the full renders embedded in `resources/The wave.pdf`, pages 16 to 31, pulled out at their own resolution (PyMuPDF `extract_image`) and saved at 1920 wide: `ffmpeg -i <render>.jpeg -vf scale=1920:-2 -c:v libwebp -quality 74`.

Unit photos in `public/media/p/unit-studio-*` and `unit-1br-*` are the brochure squares with their label bar cropped off: `-vf "crop=1080:1000:0:0,scale=760:-2"`.
