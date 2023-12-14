import * as THREE from '..node_modules/three'
import { OrbitControls } from '..node_modules/three/examples/jsm/controls/OrbitControls.js' 
import GUI from 'lil-gui'
import {GLTFLoader} from '..node_modules/three/examples/jsm/loaders/GLTFLoader.js'


/* 
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js' 
*/

// IMPORT FILES

//The goal is to put an image url here:
let gltfModel = null

const fileSelect = document.getElementById("fileSelect")
const fileElem = document.getElementById("fileElem")

fileSelect.addEventListener("click", function (e) {
    if (fileElem) {
      fileElem.click();
    }
    e.preventDefault(); // prevent navigation to "#"
}, false);

function handleFiles(files) {
    if (!files.length) {
      console.log("no files selected")
    } else {
      
      for (let i = 0; i < files.length; i++) {
        gltfModel = window.URL.createObjectURL(files[i]);
        console.log(gltfModel)
      }
    }
}

// Select buttons
fileElem.addEventListener("change", handleFiles(fileElem.files))


/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Models
 */


/* const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/') */

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/* let mixer = null */
if (gltfModel)
{
    gltfLoader.load(
    //path to location (has to be localstorage in this case)
    gltfModel,
    //Success
    (gltf) => 
    {
        /* const children = [...gltf.scene.children]
        for(const child of children)
        {
            scene.add(child)
        } */

        /* mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(gltf.animations[0])

        action.play() */

        scene.add(gltf.scene)
    }
    
)}

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
/* 
    // Update mixer
    if (mixer)
    {mixer.update(deltaTime)} */

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()