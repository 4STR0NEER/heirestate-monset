import {
  AdditiveBlending,
  BoxGeometry,
  CanvasTexture,
  Color,
  EdgesGeometry,
  GridHelper,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  WebGLRenderer,
} from "three";

const GOLD = new Color("#c49b4c");
const NAVY = new Color("#1d2e4c");
const FLOOR_H = 0.3;
const BASE_Y = -1.7;

// The logo in 3D: the slim left tower is the H's post, the wide right tower is the E,
// and the bridge between them is the lit window. Sizes follow the mark (1 svg unit = 0.1).
const TOWERS = [
  { x: -1.55, w: 0.42, d: 0.7, floors: 11 },
  { x: 0.9, w: 1.3, d: 1.0, floors: 13 },
];

export function createTowerScene(canvas) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 100);
  const disposables = [];
  const track = (x) => (disposables.push(x), x);

  // the site plan the towers stand on
  const grid = new GridHelper(9, 18, GOLD, GOLD);
  grid.position.y = BASE_Y;
  grid.material.transparent = true;
  grid.material.opacity = 0;
  scene.add(track(grid));

  // floors start lifted and invisible; the loader drops them into place one by one
  const floors = [];
  const lights = [];
  for (const t of TOWERS) {
    const box = track(new BoxGeometry(t.w, FLOOR_H * 0.92, t.d));
    const edges = track(new EdgesGeometry(box));
    const paneGeo = track(new PlaneGeometry(t.w * 0.32, FLOOR_H * 0.5));
    for (let i = 0; i < t.floors; i++) {
      const line = track(new LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0 }));
      const face = track(new MeshBasicMaterial({ color: NAVY, transparent: true, opacity: 0 }));
      const g = new Group();
      g.add(new Mesh(box, face), new LineSegments(edges, line));
      // some flats switch their lights on once the bridge window glows
      if (Math.random() < 0.5) {
        const glow = track(new MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0 }));
        const pane = new Mesh(paneGeo, glow);
        pane.position.set((Math.random() - 0.5) * t.w * 0.5, 0, t.d / 2 + 0.002);
        g.add(pane);
        lights.push({ mat: glow, to: 0.25 + Math.random() * 0.45 });
      }
      const y = BASE_Y + FLOOR_H * (i + 0.5);
      g.position.set(t.x, y + 1, 0);
      scene.add(g);
      floors.push({ position: g.position, y, level: i, mats: [line, face], to: [1, 0.85] });
    }
  }

  // the lit window bridging the towers, plus a soft halo behind it
  const winMat = track(new MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0 }));
  const win = new Mesh(track(new BoxGeometry(1.59, 0.5, 0.5)), winMat);
  win.position.set(-0.545, 0.3, 0);
  const haloMat = track(
    new MeshBasicMaterial({ map: track(glowTexture()), transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false })
  );
  const halo = new Mesh(track(new PlaneGeometry(5, 3.2)), haloMat);
  halo.position.set(-0.545, 0.3, -0.3);
  scene.add(halo, win);

  // orbit state the loader animates; written to the camera every frame
  const orbit = { angle: 1.05, lift: 0.55, radius: 13 };
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the whole building in frame on tall phone screens
    camera.fov = w / h < 0.8 ? 52 : 30;
    camera.updateProjectionMatrix();
  };
  resize();
  addEventListener("resize", resize);

  renderer.setAnimationLoop(() => {
    const { angle, lift, radius } = orbit;
    camera.position.set(Math.sin(angle) * radius, Math.sin(lift) * radius, Math.cos(angle) * radius);
    camera.lookAt(0, 0.25, 0);
    renderer.render(scene, camera);
  });

  return {
    floors,
    lights,
    orbit,
    grid: grid.material,
    window: [winMat, haloMat],
    dispose() {
      removeEventListener("resize", resize);
      renderer.setAnimationLoop(null);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    },
  };
}

function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(196,155,76,0.55)");
  g.addColorStop(0.4, "rgba(196,155,76,0.16)");
  g.addColorStop(1, "rgba(196,155,76,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new CanvasTexture(c);
}
