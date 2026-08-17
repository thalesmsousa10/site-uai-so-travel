import * as THREE from 'three';

export function initGlobe() {
  const canvas = document.getElementById('globeCanvas');
  if (!canvas) return;

  const container = canvas.parentElement;
  const width = container.clientWidth;
  const height = container.clientHeight;

  // 1. Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 240;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 2. Globe Group
  const globeGroup = new THREE.Group();
  scene.add(globeGroup);

  // 3. Main Sphere
  const radius = 80;
  const geometry = new THREE.SphereGeometry(radius, 48, 48);
  const material = new THREE.MeshPhongMaterial({
    color: 0x0A192F,
    emissive: 0x0E2442,
    specular: 0xFFA800,
    shininess: 30,
    transparent: true,
    opacity: 0.94
  });
  const globeMesh = new THREE.Mesh(geometry, material);
  globeGroup.add(globeMesh);

  // 4. Wireframe / Grid Lines
  const wireframeGeo = new THREE.WireframeGeometry(geometry);
  const wireframeMat = new THREE.LineBasicMaterial({
    color: 0xFFA800,
    transparent: true,
    opacity: 0.18
  });
  const wireframe = new THREE.LineSegments(wireframeGeo, wireframeMat);
  globeGroup.add(wireframe);

  // 5. Atmosphere Glow Ring
  const atmosphereGeo = new THREE.SphereGeometry(radius * 1.15, 32, 32);
  const atmosphereMat = new THREE.MeshBasicMaterial({
    color: 0xFFA800,
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.15
  });
  const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
  scene.add(atmosphere);

  // 6. Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xFFA800, 1.4);
  dirLight1.position.set(150, 150, 150);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x00B4D8, 0.8);
  dirLight2.position.set(-150, -150, -150);
  scene.add(dirLight2);

  // Helper: Convert Lat/Lon to Vector3
  function latLonToVector3(lat, lon, r) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(r * Math.sin(phi) * Math.cos(theta));
    const z = r * Math.sin(phi) * Math.sin(theta);
    const y = r * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  }

  // 7. Key Destinations & Markers (Paleta da Logo)
  const locations = [
    { name: 'Minas Gerais (Brasil)', lat: -18.5, lon: -44.5, color: 0xFFA800 },
    { name: 'Lisboa (Portugal)', lat: 38.7, lon: -9.1, color: 0xE63946 },
    { name: 'Dubai (Emirados Árabes)', lat: 25.2, lon: 55.3, color: 0x00B4D8 }
  ];

  const coordsVecs = [];

  locations.forEach(loc => {
    const pos = latLonToVector3(loc.lat, loc.lon, radius + 1);
    coordsVecs.push(pos);

    // Pin Sphere
    const pinGeo = new THREE.SphereGeometry(2.5, 16, 16);
    const pinMat = new THREE.MeshBasicMaterial({ color: loc.color });
    const pinMesh = new THREE.Mesh(pinGeo, pinMat);
    pinMesh.position.copy(pos);
    globeGroup.add(pinMesh);

    // Glowing Pulse Ring
    const ringGeo = new THREE.RingGeometry(3, 5, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: loc.color, side: THREE.DoubleSide, transparent: true, opacity: 0.65 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.copy(pos);
    ringMesh.lookAt(0, 0, 0);
    globeGroup.add(ringMesh);
  });

  // 8. Connecting Arcs (Golden Flight Routes estilo Rastro da Logo)
  function createCurveArc(vec1, vec2) {
    const distance = vec1.distanceTo(vec2);
    const mid = vec1.clone().add(vec2).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(radius + distance * 0.28);

    const curve = new THREE.QuadraticBezierCurve3(vec1, mid, vec2);
    const points = curve.getPoints(50);
    const curveGeo = new THREE.BufferGeometry().setFromPoints(points);
    const curveMat = new THREE.LineBasicMaterial({
      color: 0xFFA800,
      transparent: true,
      opacity: 0.8,
      linewidth: 2
    });
    return new THREE.Line(curveGeo, curveMat);
  }

  // Connecting Brazil <-> Portugal <-> Dubai
  if (coordsVecs.length >= 3) {
    globeGroup.add(createCurveArc(coordsVecs[0], coordsVecs[1])); // BR -> PT
    globeGroup.add(createCurveArc(coordsVecs[1], coordsVecs[2])); // PT -> Dubai
    globeGroup.add(createCurveArc(coordsVecs[0], coordsVecs[2])); // BR -> Dubai
  }

  // 9. Interactivity (Mouse Move)
  let targetRotationX = 0.002;
  let targetRotationY = 0.004;
  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    mouseX = (e.clientX - windowHalfX) * 0.0003;
    mouseY = (e.clientY - windowHalfY) * 0.0003;
  });

  // 10. Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    // Auto rotate
    globeGroup.rotation.y += 0.003 + mouseX * 0.5;
    globeGroup.rotation.x += mouseY * 0.5;

    // Smooth return tilt
    globeGroup.rotation.x *= 0.95;

    renderer.render(scene, camera);
  }

  animate();

  // Responsive Resize
  window.addEventListener('resize', () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });
}
