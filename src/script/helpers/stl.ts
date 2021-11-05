import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PerspectiveCamera, Scene, WebGLRenderer } from "three";

let container:HTMLDivElement;
let camera:PerspectiveCamera, scene:Scene, renderer:WebGLRenderer;
let getImageData = false;
let imageData = "";

export function renderSTL(blob:string|ArrayBuffer, parentElement:HTMLElement) {
  console.log("[STL] Rendering STL")
  container = document.createElement("div");
  container.style.height = "472px";
  container.style.width = "628px";
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
    color: 0x18312d,
    specular: 0x111111,
    shininess: 30,
  });

  // Colored binary STL
  let geometry = loader.parse(blob);

  let meshMaterial = material;

  if (geometry.hasAttribute("color")) {
    meshMaterial = new THREE.MeshPhongMaterial({
      opacity: 100,
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
  mesh.geometry.applyMatrix4(
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
  return imageData;
}
