import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.165.0/examples/jsm/controls/OrbitControls.js";

const canvas = document.getElementById("scene");
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x03050f, 0.003);

const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
camera.position.set(0, 28, 66);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.minDistance = 18;
controls.maxDistance = 140;

const ambient = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambient);

const sunLight = new THREE.PointLight(0xfff2c2, 2.8, 500);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

const stars = new THREE.Points(
  new THREE.BufferGeometry().setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      Array.from({ length: 1800 }, () => THREE.MathUtils.randFloatSpread(420)),
      3
    )
  ),
  new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 })
);
scene.add(stars);

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(4.4, 48, 48),
  new THREE.MeshBasicMaterial({ color: 0xffb347 })
);
scene.add(sun);

const planetData = [
  { name: "水星", color: 0xa9a9a9, size: 0.65, orbit: 8, speed: 0.017, desc: "离太阳最近，白天极热、夜晚极冷。", facts: ["公转约 88 天", "没有真正的大气层", "表面布满陨石坑"] },
  { name: "金星", color: 0xe5c07b, size: 1.1, orbit: 11, speed: 0.013, desc: "被称为地球‘姊妹星’，温室效应极强。", facts: ["公转约 225 天", "自转方向与多数行星相反", "表面温度可超 460°C"] },
  { name: "地球", color: 0x3f88ff, size: 1.2, orbit: 15, speed: 0.01, desc: "目前已知唯一存在生命的行星。", facts: ["公转约 365 天", "71% 表面被水覆盖", "拥有一颗天然卫星：月球"] },
  { name: "火星", color: 0xc85a3e, size: 0.9, orbit: 19, speed: 0.0085, desc: "红色星球，可能曾有液态水。", facts: ["公转约 687 天", "有太阳系最高火山：奥林帕斯山", "有两颗小卫星：火卫一、火卫二"] },
  { name: "木星", color: 0xd8b17f, size: 2.9, orbit: 26, speed: 0.0055, desc: "太阳系最大行星，著名特征是大红斑。", facts: ["公转约 11.86 年", "主要由氢和氦组成", "拥有众多卫星，如木卫二"] },
  { name: "土星", color: 0xf4d08b, size: 2.45, orbit: 33, speed: 0.0046, desc: "以壮观行星环闻名。", facts: ["公转约 29.5 年", "密度比水还小", "土卫六有浓厚大气"] },
  { name: "天王星", color: 0x8be5ff, size: 1.8, orbit: 40, speed: 0.0034, desc: "自转轴几乎‘躺着’，季节变化极端。", facts: ["公转约 84 年", "冰巨星之一", "甲烷让它呈蓝绿色"] },
  { name: "海王星", color: 0x3f51ff, size: 1.75, orbit: 47, speed: 0.0028, desc: "距离太阳最远，拥有极强风暴系统。", facts: ["公转约 165 年", "太阳系风速最快", "冰巨星之一"] }
];

const planets = [];
planetData.forEach((p, i) => {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(p.size, 32, 32),
    new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.7, metalness: 0.12 })
  );
  mesh.userData = p;
  scene.add(mesh);

  const orbit = new THREE.Mesh(
    new THREE.RingGeometry(p.orbit - 0.03, p.orbit + 0.03, 128),
    new THREE.MeshBasicMaterial({ color: 0x4f6999, side: THREE.DoubleSide, transparent: true, opacity: 0.25 })
  );
  orbit.rotation.x = Math.PI / 2;
  scene.add(orbit);

  if (p.name === "土星") {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(p.size + 0.5, p.size + 1.5, 64),
      new THREE.MeshStandardMaterial({ color: 0xc8b27a, side: THREE.DoubleSide, transparent: true, opacity: 0.75 })
    );
    ring.rotation.x = Math.PI / 2.4;
    mesh.add(ring);
  }

  planets.push({ mesh, angle: i * 0.85, ...p });
});

const nameEl = document.getElementById("planet-name");
const descEl = document.getElementById("planet-desc");
const factsEl = document.getElementById("planet-facts");

function updateInfo(p) {
  nameEl.textContent = p.name;
  descEl.textContent = p.desc;
  factsEl.innerHTML = p.facts.map((f) => `<li>${f}</li>`).join("");
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(planets.map((p) => p.mesh))[0];
  if (hit) updateInfo(hit.object.userData);
});

function resize() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", resize);
resize();

const clock = new THREE.Clock();
function animate() {
  const dt = clock.getDelta();
  planets.forEach((p) => {
    p.angle += p.speed;
    p.mesh.position.set(Math.cos(p.angle) * p.orbit, 0, Math.sin(p.angle) * p.orbit);
    p.mesh.rotation.y += dt * 0.8;
  });
  sun.rotation.y += dt * 0.3;
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
