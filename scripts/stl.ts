// @ts-ignore
import * as THREE from "https://cdn.skypack.dev/three/";
// @ts-ignore
import { STLLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/STLLoader.js";
//@ts-ignore
import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";

let container;
let camera, cameraTarget, scene, renderer;
let getImageData = false;
let imageData = "";

export function renderSTL(blob, parentElement) {
  container = document.createElement("div");
  container.style.height = "236px";
  container.style.width = "314px";
  parentElement.appendChild(container);

  camera = new THREE.PerspectiveCamera(
    70,
    container.clientWidth / container.clientWidth,
    1,
    700
  );

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;

  container.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize);

  var controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.rotateSpeed = 0.05;
  controls.dampingFactor = 0.1;
  controls.enableZoom = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.75;

  scene = new THREE.Scene();

  // Lights
  scene.add(new THREE.HemisphereLight(0xffffff, 1.5));

  const loader = new STLLoader();

  // Binary files
  const material = new THREE.MeshPhongMaterial({
    color: 0xaaaaaa,
    specular: 0x111111,
    shininess: 200,
  });

  // Colored binary STL
  let geometry = loader.parse(blob);

  let meshMaterial = material;

  if (geometry.hasColors) {
    meshMaterial = new THREE.MeshPhongMaterial({
      opacity: geometry.alpha,
      vertexColors: true,
    });
  }

  //Render mesh
  const mesh = new THREE.Mesh(geometry, meshMaterial);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.rotation.x = -Math.PI / 2;
  scene.add(mesh);

  //Place camera in the middle
  var middle = new THREE.Vector3();
  geometry.computeBoundingBox();
  geometry.boundingBox.getCenter(middle);
  mesh.geometry.applyMatrix(
    new THREE.Matrix4().makeTranslation(-middle.x, -middle.y, -middle.z)
  );
  var largestDimension = Math.max(
    geometry.boundingBox.max.x,
    geometry.boundingBox.max.y,
    geometry.boundingBox.max.z
  );
  camera.position.z = largestDimension * 1.5;

  animate();
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  if (getImageData == true) {
    getImageData = false;
    imageData = renderer.domElement.toDataURL();
  }
}

export function getImage() {
  getImageData = true;
  animate();
  console.log(imageData);
  return imageData;
}
