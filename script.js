import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';

import * as dat from "https://cdn.skypack.dev/dat.gui@0.7.7"
import { GLTFLoader } from "https://threejs.org/examples/jsm/loaders/GLTFLoader.js"

/**
 * Base
 */
// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Models

// const geometry = new THREE.PlaneGeometry( 0.75, 0.80 );
// const material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
// const plane = new THREE.Mesh( geometry, material );
// scene.add( plane );


const gltfLoader = new GLTFLoader();


let mixer = null;

// mouse Move

var parent = new THREE.Group();
scene.add( parent );

gltfLoader.load(
    './static/scene3.glb',
    function (gltf)
    {
        // console.log(gltf.scenes);
        gltf.scene.children[0].scale.set(0.25,0.25,0.25)
        // gltf.scene.children[0].material.metalness = 0;
        // gltf.scene.children[0].material.color.setHex( 0xffffff );

        gltf.scene.children[0].rotation.set(Math.PI*1.7, 0, 0);
        gltf.scene.children[0].position.set(0,0.35,0);
        parent.add(gltf.scene.children[0]);
    }
)
console.log(parent)
// obj.position.set(1,2,3);

/**
 * Floor
 */
// const floor = new THREE.Mesh(
//     new THREE.PlaneBufferGeometry(10, 10),
//     new THREE.MeshStandardMaterial({
//         color: '#444444',
//         metalness: 0,
//         roughness: 0.5
//     })
// )
// floor.receiveShadow = true
// floor.rotation.x = - Math.PI * 0.5
// scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.45)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
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
camera.position.set(0, 0, 1)
// camera.lookAt(new THREE.Vector3(0,0,0))

scene.add(camera)

const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (event)=>{
    mouse.x = event.clientX/sizes.width *2 - 1;
    mouse.y = -(event.clientY/sizes.height) *2 + 1;
    // console.log(mouse.x,mouse.y)
})


// Controls
const controls = new OrbitControls(camera, canvas)
// controls.target.set(0, 0.75, 0)
controls.enableDamping = true;
controls.enabled = false;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})

renderer.setClearColor( 0x000000, 0 ); 
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

//input rotation
let usernameInput = document.querySelector('#name')
let passwordInput = document.querySelector('#email')

let length = 7;

usernameInput.addEventListener('input', (event) => {
    length = event.target.value.length;
    console.log(length);
})

// passwordInput.addEventListener('input', (event) => {
//     length = event.target.value.length;
//     console.log(length);
// })

let focusCheacker;

passwordInput.addEventListener('focus', event => {
    length=7.5;
})

passwordInput.addEventListener('focusout', event => {
    length=7.6;
})

const tick = () =>
{
    camera.position.x = -Math.sin(mouse.x/3);
    camera.position.y = -Math.sin(mouse.y/5);

    if(length!=0)
        if(length!=7.5)
            if(length!=7.6)
                parent.rotation.y = (length/10)-0.75;


    if(length==7.5){
        if(parent.rotation.y<Math.PI){
            parent.rotation.y += 0.1;
        }
    }

    if(length==7.6){
        if(parent.rotation.y>0)
            parent.rotation.y -= 0.1;
    }

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    if(mixer !== null)
        mixer.update(deltaTime);

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

// ---------------------------------
