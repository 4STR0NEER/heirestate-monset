# Heir Estate

Showcase site for Heir Estate's projects. Vite + React + Tailwind v4, Motion, anime.js, Three.js.

```
npm install
npm run dev
```

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
