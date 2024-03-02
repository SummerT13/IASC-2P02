import * as THREE from "three"
import * as dat from "lil-gui"
import { OrbitControls } from "OrbitControls"

/***********
** SETUP **
**********/
// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight
}

/**********
** SCENE **
**********/
//Canvas
const canvas = document.querySelector('.webgl')

//Scene
const scene = new THREE.Scene()

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)
camera.position.set(7.8, 1.3, 8)
scene.add(camera)

//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/***********
** MESHES **
***********/
const caveMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('white'),
    side: THREE.DoubleSide
})

// caveWall
const caveWallGeometry = new THREE.PlaneGeometry(10, 5)
const caveWall = new THREE.Mesh(caveWallGeometry, caveMaterial)
caveWall.rotation.y = Math.PI * 0.5
caveWall.position.set(-5, 0, 0)
caveWall.receiveShadow = true
scene.add(caveWall)

//barrierWall
const barrierWallGeometry = new THREE.PlaneGeometry(10, 2)
const barrierWall = new THREE.Mesh(barrierWallGeometry, caveMaterial)
barrierWall.rotation.y = Math.PI * 0.5
barrierWall.position.set(5, -1.5, 0)
scene.add(barrierWall)

//caveFloor
const caveFloorGeometry = new THREE.PlaneGeometry(10, 10)
const caveFloor = new THREE.Mesh(caveFloorGeometry, caveMaterial)
caveFloor.rotation.x = Math.PI * 0.5
caveFloor.position.set(0, -2.5, 0)
scene.add(caveFloor)

//OBJECTS
//shape1
const geometry = new THREE.SphereGeometry( 1.2, 10, 16); 
const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } ); 
const sphere = new THREE.Mesh( geometry, material );
sphere.castShadow = true
scene.add( sphere );

//shape2
const torusgeometry = new THREE.TorusGeometry( 3, 0.7, 16, 98); 
const torusmaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff } ); 
const torus = new THREE.Mesh( torusgeometry, torusmaterial ); 
torus.castShadow = true
scene.add(torus);
torus.rotation.y = Math.PI * 0.5

/***********
** LIGHTS **
***********/

/**Ambient Light
const ambientLight = new THREE.AmbientLight(
    new THREE.Color('white')
)
scene.add(ambientLight)
**/


//Directional Light
const directionalLight = new THREE.DirectionalLight(
    new THREE.Color('white'),
    10
)
directionalLight.target = caveWall
directionalLight.position.set(8.6, 3, 2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
scene.add(directionalLight)

/**Directional Light Helper
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
scene.add(directionalLightHelper)


/*******
** UI **
*******/
/*
const ui = new dat.GUI()

const uiObject = {}

uiObject.reset = () =>
{
    directionalLight.position.set(8.6, 1.7, 0)
}

//Directional Light
const lightPositionFolder = ui.addFolder('Directional Light Position')

lightPositionFolder
    .add(directionalLight.position, 'x')
    .min(-10)
    .max(20)
    .step(0.1)

lightPositionFolder
    .add(directionalLight.position, 'y')
    .min(-10)
    .max(10)
    .step(0.1)

lightPositionFolder
    .add(directionalLight.position, 'z')
    .min(-10)
    .max(10)
    .step(0.1)

lightPositionFolder
    .add(uiObject, 'reset')
    .name('Reset position')

lightPositionFolder
    .add(torusKnot.position, 'x')
    .min(-5)
    .max(10)
    .step(0.1)
*/

/*******************
**DOM INTERACTIONS**
*******************/
// domObject
const domObject = {
    firstChange: false,
    secondChange: false,
    thirdChange: false
}
// continue-reading
document.querySelector('#continue-reading').onclick = function(){
    document.querySelector('#part-two').classList.remove('hidden')
    document.querySelector('#part-one').classList.add('hidden')
}

// restart
document.querySelector('#restart').onclick = function(){
    document.querySelector('#part-two').classList.add('hidden')
    document.querySelector('#part-one').classList.remove('hidden')
}

// Spin Begins
document.querySelector('#first-change').onclick = function(){
    domObject.firstChange = true
}

// Moves virtical off the wall
document.querySelector('#second-change').onclick = function(){
    domObject.secondChange = true
}

// third change
document.querySelector('#third-change').onclick = function(){
    domObject.thirdChange = true
}

/*******************
** ANIMATION LOOP **
*******************/
const clock = new THREE.Clock()

//Animate
const animation = () =>
{
    //Return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    //Animate objects
    //torusKnot.rotation.y = elapsedTime
    //torusKnot.position.z = Math.sin(elapsedTime * 0.5) * 2
    //torus.rotation.y = elapsedTime

    //Update directionalLightHelper
    //directionalLightHelper.update()

    //Controls
    controls.update()

    // DOM INTERACTIONS
    // first-change
    if(domObject.firstChange){
        torus.rotation.y = elapsedTime
        torus.rotation.x = elapsedTime
    }

    // second-change
    if(domObject.secondChange){
        torus.position.y = Math.sin(elapsedTime *0.5) * 6
    }

    // third-change
    if(domObject.thirdChange){
        sphere.position.x = Math.sin(elapsedTime *0.5) * 6
    }

    //Renderer
    renderer.render(scene, camera)

    //Request next frame
    window.requestAnimationFrame(animation)
}

animation()