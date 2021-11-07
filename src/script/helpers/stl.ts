import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PerspectiveCamera, Scene, WebGLRenderer } from "three";

let container: HTMLDivElement;
let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer;
let getImageData = false;
let imageData = "";
let stlData: ArrayBuffer | string;
let endAnimation: boolean;

export async function renderSTL(
  blob: string | ArrayBuffer,
  parentElement: HTMLElement
) {
  endAnimation = false;
  stlData = blob;
  console.log("[STL] Rendering STL");
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
  let geometry = loader.parse(stlData);

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
  if (!endAnimation) {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if (getImageData == true) {
      getImageData = false;
      imageData = renderer.domElement.toDataURL();
    }
  }
}

export function cleanUp() {
  console.log("[STL] Cleaning up");

  window.removeEventListener("resize", onWindowResize);
  stlData = null;
  endAnimation = true;
  disposeNode(scene);
  renderer.dispose();

  for (let i = 0; i < scene.children.length; i = i + 1) {
    scene.children[i] = null;
  }
  //console.log(scene);
}

export function getImage() {
  getImageData = true;
  animate();
  return imageData;
}

let disposeNode = function (parentObject: Scene) {
  parentObject.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      if (node.geometry) {
        node.geometry.attributes = null;
        node.geometry.dispose();
        node.geometry = null;
      }

      if (node.material) {
        if (
          //@ts-ignore
          node.material instanceof THREE.MeshFaceMaterial ||
          //@ts-ignore
          node.material instanceof THREE.MultiMaterial
        ) {
          //@ts-ignore
          node.material.materials.forEach(function (mtrl, idx) {
            if (mtrl.map) mtrl.map.dispose();
            if (mtrl.lightMap) mtrl.lightMap.dispose();
            if (mtrl.bumpMap) mtrl.bumpMap.dispose();
            if (mtrl.normalMap) mtrl.normalMap.dispose();
            if (mtrl.specularMap) mtrl.specularMap.dispose();
            if (mtrl.envMap) mtrl.envMap.dispose();

            mtrl.dispose(); // disposes any programs associated with the material
          });
        } else {
          if (node.material.map) node.material.map.dispose();
          if (node.material.lightMap) node.material.lightMap.dispose();
          if (node.material.bumpMap) node.material.bumpMap.dispose();
          if (node.material.normalMap) node.material.normalMap.dispose();
          if (node.material.specularMap) node.material.specularMap.dispose();
          if (node.material.envMap) node.material.envMap.dispose();

          node.material.dispose(); // disposes any programs associated with the material
        }
      }
    }
  });
};
