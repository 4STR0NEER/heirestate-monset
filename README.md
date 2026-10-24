# Heir Estate

Showcase site for Heir Estate's projects. Vite + React + Tailwind v4, Motion, anime.js, Three.js.

```
npm install
npm run dev                  # every site at once: the collection on 5173, alto 5174, wave 5175, pristina 5176
npx vite --mode wave         # just one project's site; any id in src/projects.js `order`
npm run build                # every site, into dist/<site>/
```

## Sites and SEO

One codebase, one site per domain: the collection on the bare domain, each project on its own subdomain (`alto.`, `wave.`, `pristina.`). The domain is set once in `src/lib/links.js`.

`sites.js` gives every site its own title, description, canonical URL, Open Graph tags, JSON-LD, robots.txt and sitemap.xml, and writes the page's text into the HTML so crawlers read it without running JavaScript. A project's build carries only that project's media. Deploy `dist/main/` to the bare domain and `dist/<id>/` to `<id>.<domain>`.

On the main site, project links are real links to the subdomains (crawlers and new tabs follow them); a plain click still opens the project in place over the facade.

A new project needs an entry in `src/projects.js` (and `order`), its media in `public/media/p/`, and a DNS record for its subdomain.

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

Unit photos in `public/media/p/unit-studio-*` and `unit-1br-*` are the brochure squares with their label bar cropped off: `-vf "crop=1080:1000:0:0,scale=760:-2"`.
