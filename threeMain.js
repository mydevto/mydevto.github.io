import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'


const scene = new THREE.Scene()
// scene.add(new THREE.AxesHelper(5))

const light = new THREE.DirectionalLight(0xffffff, 100)
light.position.set(0.8, 2.4, 1.0)
scene.add(light)


// const ambientLight = new THREE.AmbientLight()
// scene.add(ambientLight)

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(0.8, 1.4, 1.0)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true;
controls.dampingFactor = 0.01
controls.target.set(0, 0, 0)

// const material = new THREE.MeshNormalMaterial()

const fbxLoader = new FBXLoader()
fbxLoader.load(
    '/keeb.fbx',
    (object) => {
        // object.traverse(function (child) {
        //     if ((child as THREE.Mesh).isMesh) {
        //         // (child as THREE.Mesh).material = material
        //         if ((child as THREE.Mesh).material) {
        //             ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
        //         }
        //     }
        // })
         object.scale.set(.01, .01, .01)
    
        scene.add(object)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}



function animate() {
    requestAnimationFrame(animate)

    controls.update()

    render()

}

function render() {
    renderer.render(scene, camera)
}

animate()
