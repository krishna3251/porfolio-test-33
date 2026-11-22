import { mapLocations } from "./portfolio-map";

const range = 1.46;
const resolution = 53;
const step = (range * 2) / resolution;
const levels = [0, 0.035, 0.07, 0.115, 0.165, 0.22, 0.28, 0.345, 0.415, 0.49, 0.57];
export const initialCamera = { yaw: -0.37, tilt: 0.58, zoom: 1 };

const landforms = [
  [-0.40, -0.11, 1.04, 0.91],
  [0.58, -0.14, 0.66, 0.67],
  [0.77, 0.48, 0.46, 0.38],
  [-0.49, 0.55, 0.61, 0.49],
  [0.96, -0.83, 0.22, 0.18],
  [-1.01, 1.02, 0.19, 0.13],
  [0.4, 0.97, 0.18, 0.12],
];

const ridges = [
  [-0.65, -0.30, 0.44, 0.32, 0.41],
  [-0.32, -0.49, 0.29, 0.19, 0.28],
  [-0.17, 0.05, 0.43, 0.19, 0.19],
  [0.40, -0.42, 0.28, 0.33, 0.31],
  [0.70, -0.27, 0.25, 0.16, 0.20],
  [-0.48, 0.49, 0.26, 0.20, 0.26],
  [0.77, 0.44, 0.25, 0.18, 0.24],
  [0.95, -0.82, 0.16, 0.14, 0.15],
];

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const blend = (a, b, weight) => a + (b - a) * weight;
const hash = (x, y) => ((Math.imul(x + 121, 1597334677) ^ Math.imul(y + 73, 3812015801)) >>> 0) / 4294967295;
const ease = (value) => value * value * (3 - 2 * value);

function noise(x, y) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const tx = ease(x - ix);
  const ty = ease(y - iy);
  return blend(
    blend(hash(ix, iy), hash(ix + 1, iy), tx),
    blend(hash(ix, iy + 1), hash(ix + 1, iy + 1), tx),
    ty,
  );
}

function ground(x, y) {
  const broad = noise(x * 4.3 + 19, y * 4.3);
  const detail = noise(x * 16.5 - 8, y * 16.5 + 9);
  const shore = Math.max(...landforms.map(([cx, cy, rx, ry]) =>
    1 - Math.hypot((x - cx) / rx, (y - cy) / ry))) + (broad - 0.5) * 0.24 + (detail - 0.5) * 0.10;
  let height = 0;
  for (const [cx, cy, rx, ry, rise] of ridges) {
    height += rise * Math.exp(-(((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2));
  }
  const inland = ease(clamp(shore * 3.8, 0, 1));
  return shore * 0.1 + inland * Math.max(0, height + (broad - 0.46) * 0.11 + (detail - 0.5) * 0.048);
}

function crossing(a, b, height) {
  const fraction = (height - a.z) / (b.z - a.z);
  return { x: blend(a.x, b.x, fraction), y: blend(a.y, b.y, fraction), z: height };
}

function describeFace(points) {
  const [a, b, c] = points;
  const slopeX = (b.y - a.y) * (c.z - a.z) - (b.z - a.z) * (c.y - a.y);
  const slopeY = (b.z - a.z) * (c.x - a.x) - (b.x - a.x) * (c.z - a.z);
  const slopeZ = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  const light = (slopeX * -0.53 + slopeY * -0.36 + slopeZ * 0.77) / Math.hypot(slopeX, slopeY, slopeZ);
  const height = Math.max(0, (a.z + b.z + c.z) / 3);
  const glow = clamp(light, 0, 1);
  const shade = 0.62 + glow * 0.62;
  return [
    Math.round((24 + height * 90) * shade),
    Math.round((48 + height * 103) * shade),
    Math.round((45 + height * 77) * shade),
  ];
}

function addFace(points, faces, contours) {
  if (points.every((point) => point.z <= 0)) return;
  const surface = [];
  const coast = [];
  for (let index = 0; index < 3; index++) {
    const point = points[index];
    const following = points[(index + 1) % 3];
    if (point.z >= 0) surface.push(point);
    if ((point.z < 0) !== (following.z < 0)) {
      const edge = crossing(point, following, 0);
      surface.push(edge);
      coast.push(edge);
    }
  }

  if (coast.length === 2) {
    contours[0].push(coast);
    const base = coast.map((point) => ({ ...point, z: -0.075 }));
    faces.push({ points: [...coast, ...base.reverse()], x: (coast[0].x + coast[1].x) / 2,
      y: (coast[0].y + coast[1].y) / 2, color: "#142a25", wall: true });
  }

  const rgb = describeFace(points);
  faces.push({
    points: surface,
    x: points.reduce((sum, point) => sum + point.x, 0) / 3,
    y: points.reduce((sum, point) => sum + point.y, 0) / 3,
    color: `rgb(${rgb.join(",")})`,
  });
  const min = Math.min(...points.map((point) => point.z));
  const max = Math.max(...points.map((point) => point.z));
  for (let level = 1; level < levels.length; level++) {
    const elevation = levels[level];
    if (elevation < min || elevation > max) continue;
    const segment = [];
    points.forEach((point, index) => {
      const following = points[(index + 1) % 3];
      if ((point.z < elevation) !== (following.z < elevation)) {
        segment.push(crossing(point, following, elevation));
      }
    });
    if (segment.length === 2) contours[level].push(segment);
  }
}

function mapTrail(from, to, bend) {
  return Array.from({ length: 39 }, (_, index) => {
    const fraction = index / 38;
    const x = blend(from.x, to.x, fraction);
    const y = blend(from.y, to.y, fraction) + bend * Math.sin(fraction * Math.PI);
    return { x, y, z: Math.max(0, ground(x, y)) + 0.038 };
  });
}

export function makeTerrain() {
  const points = Array.from({ length: resolution + 1 }, (_, y) =>
    Array.from({ length: resolution + 1 }, (_, x) => {
      const worldX = -range + x * step;
      const worldY = -range + y * step;
      return { x: worldX, y: worldY, z: ground(worldX, worldY) };
    }));
  const faces = [];
  const contours = levels.map(() => []);
  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      const a = points[y][x];
      const b = points[y][x + 1];
      const c = points[y + 1][x];
      const d = points[y + 1][x + 1];
      addFace([a, b, c], faces, contours);
      addFace([b, d, c], faces, contours);
    }
  }

  const places = mapLocations.map((place) => ({ ...place, z: ground(place.x, place.y) + 0.036 }));
  const trails = [[0, 1, -0.11], [1, 2, 0.09], [2, 3, -0.19], [3, 0, 0.08]]
    .map(([from, to, bend]) => ({ to, from, points: mapTrail(places[from], places[to], bend) }));
  return { faces, contours, places, trails };
}

export function drawTerrain(context, terrain, camera, width, height, selected) {
  const cosine = Math.cos(camera.yaw);
  const sine = Math.sin(camera.yaw);
  const scale = Math.min(width / 3.25, height / 1.92) * camera.zoom;
  const centerX = width * 0.50;
  const centerY = height * 0.55;

  function project(point) {
    return [
      centerX + (point.x * cosine - point.y * sine) * scale,
      centerY + ((point.x * sine + point.y * cosine) * camera.tilt - point.z * 0.79) * scale,
    ];
  }

  function line(points) {
    const [first, ...rest] = points;
    context.moveTo(...project(first));
    for (const point of rest) context.lineTo(...project(point));
  }

  context.clearRect(0, 0, width, height);
  context.save();
  context.translate(centerX, centerY + scale * 0.23);
  context.scale(scale * 1.52, scale * 0.51);
  const shadow = context.createRadialGradient(0, 0, 0.18, 0, 0, 1);
  shadow.addColorStop(0, "rgba(0, 6, 4, 0.9)");
  shadow.addColorStop(1, "rgba(0, 6, 4, 0)");
  context.fillStyle = shadow;
  context.fillRect(-1, -1, 2, 2);
  context.restore();

  const depth = (face) => face.x * sine + face.y * cosine - (face.wall ? 0.015 : 0);
  terrain.faces.sort((a, b) => depth(a) - depth(b));
  context.lineWidth = 0.55;
  for (const face of terrain.faces) {
    context.beginPath();
    line(face.points);
    context.closePath();
    context.fillStyle = context.strokeStyle = face.color;
    context.fill();
    context.stroke();
  }

  terrain.contours.forEach((segments, index) => {
    context.beginPath();
    for (const segment of segments) line(segment);
    context.lineWidth = index === 0 ? 1.15 : index % 3 === 0 ? 1 : 0.68;
    context.strokeStyle = index === 0 ? "rgba(148, 219, 173, 0.52)" : index % 3 === 0
      ? "rgba(167, 232, 185, 0.43)" : "rgba(152, 218, 188, 0.30)";
    context.stroke();
  });

  context.setLineDash([4, 4]);
  terrain.trails.forEach(({ from, to, points }) => {
    const active = terrain.places[from].id === selected || terrain.places[to].id === selected;
    context.beginPath();
    line(points);
    context.lineWidth = active ? 1.35 : 1;
    context.strokeStyle = active ? "rgba(211, 254, 171, 0.74)" : "rgba(170, 218, 184, 0.28)";
    context.stroke();
  });
  context.setLineDash([]);
  return terrain.places.map(project);
}
