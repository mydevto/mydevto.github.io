import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
let pathToLoad = "Models/keeb.fbx";
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x252525);
const previewer = document.querySelector(".preview");
const userModel = document.getElementById("upload");
let load_text = document.querySelector(".load_text");

userModel.addEventListener("change", function (event) {
  scene.remove(scene.children[2]);
  const reader = new FileReader();

  reader.addEventListener("load", function (event) {
    const contents = event.target.result;

    const loader = new FBXLoader();
    const object = loader.parse(contents);
    object.scale.set(0.01, 0.01, 0.01);
    scene.add(object);
  });

  reader.readAsArrayBuffer(this.files[0]);
});

// scene.add(new THREE.AxesHelper(5))

const light = new THREE.DirectionalLight(0xffffff, 50);
light.position.set(0.8, 2.4, 1.0);

const light2 = new THREE.DirectionalLight(0xffffff, 50);
light2.position.set(0.8, 2.4, -1.0);
scene.add(light, light2);

let width = window.innerWidth / 1.6;
let height = window.innerHeight / 1.6;
// const ambientLight = new THREE.AmbientLight()
// scene.add(ambientLight)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0.0, 3, 3.0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);

previewer.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.01;
controls.target.set(0, 0, 0);

// const material = new THREE.MeshNormalMaterial()

function loadOnClick(path, elemId) {
  document.getElementById(elemId).addEventListener("click", () => {
    loadFBXmodels(path);
    scene.remove(scene.children[2]);
    console.log(scene.children);
  });
}

loadOnClick("Models/bike.fbx", "bike");
loadOnClick("Models/keeb.fbx", "keeb");
loadOnClick("Models/handgun.fbx", "handGun");
const fbxLoader = new FBXLoader();

function loadFBXmodels(path) {
  fbxLoader.load(
    path,
    (object) => {
      object.scale.set(0.01, 0.01, 0.01);
      object.name = path;
      scene.add(object);
    },
    (data) => {
      console.log((data.loaded / data.total) * 100 + "% loaded");
      load_text.innerHTML = `${(data.loaded / data.total) * 100}% loaded`;
    },
    (error) => {
      console.log(error);
    }
  );
}

loadFBXmodels(pathToLoad);

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  render();
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
}

function render() {
  renderer.render(scene, camera);
}

animate();
