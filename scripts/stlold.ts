//import * as THREE from "../node_modules/three/build/three.module.js";
// @ts-ignore
//import * as THREESTLLoader from "../node_modules/three/examples/jsm/loaders/three-stl-loader.js";
// @ts-ignore
//import * as OrbitControls from "../node_modules/three/examples/jsm/controls/OrbitControls.js";

import * as THREE from "https://cdn.skypack.dev/three/";
// @ts-ignore
//import { STLLoader } from "/lib/STLLoader.js";
import { STLLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/STLLoader.js";
// @ts-ignore
import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";

//https://tonybox.net/posts/simple-stl-viewer/
export function renderSTL(model, elementID) {
  var elem = document.getElementById(elementID);
  var camera = new THREE.PerspectiveCamera(
    70,
    elem.clientWidth / elem.clientHeight,
    1,
    1000
  );
  var renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setSize(elem.clientWidth, elem.clientHeight);
  elem.appendChild(renderer.domElement);
  window.addEventListener(
    "resize",
    function () {
      renderer.setSize(elem.clientWidth, elem.clientHeight);
      camera.aspect = elem.clientWidth / elem.clientHeight;
      camera.updateProjectionMatrix();
    },
    false
  );

  var controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.rotateSpeed = 0.05;
  controls.dampingFactor = 0.1;
  controls.enableZoom = true;
  //controls.autoRotate = true;
  //controls.autoRotateSpeed = 0.75;

  var scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 1.5));

  const stlLoader = new STLLoader();

  stlLoader.load(model, function (geometry) {
    var material = new THREE.MeshPhongMaterial({
      color: 0xff5533,
      specular: 100,
      shininess: 100,
    });
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
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

    var animate = function () {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  });
}

//https://stackoverflow.com/questions/62832351/how-to-connect-input-and-three-js-canvas
//https://jsfiddle.net/17q6b2sd/2/
//https://stackoverflow.com/questions/38579031/stlloader-and-three-js-how-to-check-if-file-is-binary
//https://discourse.threejs.org/t/parse-binary-stl-file/24826/3
export function renderASCIISTL(blob, elementID) {
  console.log(blob);
  var elem = document.getElementById(elementID);
  var camera = new THREE.PerspectiveCamera(
    70,
    elem.clientWidth / elem.clientHeight,
    1,
    1000
  );
  var renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setSize(elem.clientWidth, elem.clientHeight);
  elem.appendChild(renderer.domElement);
  window.addEventListener(
    "resize",
    function () {
      renderer.setSize(elem.clientWidth, elem.clientHeight);
      camera.aspect = elem.clientWidth / elem.clientHeight;
      camera.updateProjectionMatrix();
    },
    false
  );

  var controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.rotateSpeed = 0.05;
  controls.dampingFactor = 0.1;
  controls.enableZoom = true;
  //controls.autoRotate = true;
  //controls.autoRotateSpeed = 0.75;

  var scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 1.5));

  const stlLoader = new STLLoader();

  stlLoader.parse(blob, function (geometry) {
    var material = new THREE.MeshPhongMaterial({
      color: 0xff5533,
      specular: 100,
      shininess: 100,
    });
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
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

    var animate = function () {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  });

  console.log("Done");
}

// @ts-ignore
