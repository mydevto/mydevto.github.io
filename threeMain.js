import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
let pathToLoad = "Models/keeb.fbx";
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x252525);
const previewer = document.querySelector(".preview");
const userModel = document.getElementById("upload");

const fullScreen = document.querySelector(".full_screen");
const closeFullScreen = document.querySelector(".close_full_screen");

let load_text = document.querySelector(".load_text");
let label_Text = document.querySelector(".labelText");
let c = document.querySelectorAll(".c");
let fullScreenState = false;

const renderer = new THREE.WebGLRenderer();

function returnWH() {
  let width, height;

  if (window.innerWidth > window.innerHeight) {
    width = innerWidth - 100;
    height = innerHeight - 200;
  } else {
    width = innerWidth - 100;
    height = innerHeight - 300;
  }

  return { width, height };
}

const { width, height } = returnWH();
// previewer.setAttribute("class","preview")
userModel.addEventListener("change", function (e) {
  scene.remove(scene.children[2]);
  const reader = new FileReader();
  reader.addEventListener("load", function (event) {
    const contents = event.target.result;
    loadModels(contents, e.target.files[0].name);
  });

  if (e.target.files[0].name.includes(".obj")) {
    console.log(true);
  }

  reader.readAsArrayBuffer(this.files[0]);
});

fullScreen.addEventListener("click", () => {
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  camera.position.set(0.0, 3, 3.0);

  fullScreenState = true;
  fullScreen.classList.add("hidden");
  closeFullScreen.classList.remove("hidden");
  c.forEach((e) => {
    e.classList.add("absolute");
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
});

closeFullScreen.addEventListener("click", () => {
  const { width, height } = returnWH();
  fullScreenState = false;
  renderer.setSize(width, height);
  fullScreen.classList.remove("hidden");
  closeFullScreen.classList.add("hidden");
  c.forEach((e) => {
    e.classList.remove("absolute");
  });
});
// scene.add(new THREE.AxesHelper(5))

const light = new THREE.DirectionalLight(0xffffff, 50);
light.position.set(0.8, 2.4, 1.0);

const light2 = new THREE.DirectionalLight(0xffffff, 50);
light2.position.set(0.8, 2.4, -1.0);
scene.add(light, light2);

// const ambientLight = new THREE.AmbientLight()
// scene.add(ambientLight)

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.set(0.0, 3, 3.0);

renderer.setSize(width, height);
previewer.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.target.set(0, 0, 0);

// const material = new THREE.MeshNormalMaterial()

function loadOnClick(path, elemId) {
  scene.remove(scene.children[2]);
  document.getElementById(elemId).addEventListener("click", () => {
    loadFBXmodels(path);
    scene.remove(scene.children[2]);
    console.log(scene.children);
  });
}

// loadOnClick("Models/bike.fbx", "bike");
// loadOnClick("Models/keeb.fbx", "keeb");
// loadOnClick("Models/handgun.fbx", "handGun");
function getLoaderForFile(fileName, path) {
  const extension = fileName.split(".").pop().toLowerCase();
  switch (extension) {
    case "gltf":
      return [new GLTFLoader(), "gltf"];
    case "glb":
      return [new GLTFLoader(), "gltf"];
    case "fbx":
      return [new FBXLoader(), "fbx"];

    case "obj":
      return [new OBJLoader(), "obj"];

    default:
      return null;
  }
}

// const fbxLoader = new FBXLoader();

function loadModels(path, name) {
  let getLoader = getLoaderForFile(name, path);
  if (getLoader[1] == "fbx") {
    let object = getLoader[0].parse(path);
    object.scale.set(0.005, 0.005, 0.005);
    scene.add(object);
  } else if (getLoader[1] == "obj") {
    let object = getLoader[0].parse(new TextDecoder().decode(path));
    object.scale.set(1, 1, 1);
    scene.add(object);
  } else if (getLoader[1] == "glb") {
    let object = getLoader[0].parse(path);
    object.scale.set(1, 1, 1);
    scene.add(object);
  }

  animate();
}

let loader = new FBXLoader();
function loadFBXmodels(path) {
  loader.load(
    path,
    (object) => {
      object.scale.set(0.005, 0.005, 0.005);
      object.name = path;
      scene.add(object);
    },
    (data) => {
      console.log((data.loaded / data.total) * 100 + "% loaded");
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
