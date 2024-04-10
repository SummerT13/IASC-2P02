import * as THREE from "three"
import * as dat from "lil-gui"
import { OrbitControls } from "OrbitControls"

/***********
** SET UP **
***********/
// Sizes
const sizes = {
    width: window.innerWidth * 0.3,
    height: window.innerHeight * 0.75,
    aspectRatio: (window.innerWidth * 0.3) / (window.innerHeight * 0.75)
}

/**********
** SCENE **
**********/
// Canvas
const canvas = document.querySelector('.webgl2')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('gray')

// Camera
const camera= new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)
camera.position.set(0, 0, 20)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)

// Orbit Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/***********
** LIGHTS **
***********/
// Diretional Light
const directionalLight = new THREE.DirectionalLight(0x404040, 100)
scene.add(directionalLight)

/********
** MESHES
********/
// Sphere Geometry
const sphereGeometry = new THREE.SphereGeometry(0.5)

//Sphere Materials
const pinkMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('pink')
})
const aquaMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('aqua')
})
const purpleMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('purple')
})

const drawSphere = (i, material) =>
{
    const sphere = new THREE.Mesh(sphereGeometry, material)
    sphere.position.x = (Math.random() - 0.5) * 10
    sphere.position.z = (Math.random() - 0.5) * 10
    sphere.position.y = i - 10

    sphere.rotation.x = Math.random() * 2 * Math.PI
    sphere.rotation.y = Math.random() * 2 * Math.PI
    sphere.rotation.z = Math.random() * 2 * Math.PI

    sphere.randomizer = Math.random()

    scene.add(sphere)
}

/**********************
** TEXT PARSERS & UI **
**********************/
let preset = {}

const uiobj = {
    text: '',
    textArray: [],
    term1: 'emma',
    term2: 'knightley',
    term3: 'churchill',
    rotateCamera: false,
    animateBubbles: false
}

// Text Parsers
// Parse Text and Terms
const parseTextandTerms = () =>
{
    // Strip periods and downcase text
    const parseText = uiobj.text.replaceAll(".","").toLowerCase()
    
    //Tokenize text
    uiobj.textArray = parseText.split(/[^\w']+/)

    // Find term 1
    findTermInParsedText(uiobj.term1, pinkMaterial)

    // Find term 2
    findTermInParsedText(uiobj.term2, aquaMaterial)

    // Find term 3
    findTermInParsedText(uiobj.term3, purpleMaterial)
}

const findTermInParsedText = (term, material) =>
{
    for(let i=0; i < uiobj.textArray.length; i++)
    {
        //console.log(i, uiobj.textArray[i])
        if(uiobj.textArray[i] === term)
        {
            //console.log(i, term)
            // convert i into n, which is a value between 0 and 20
            const n = (100 / uiobj.textArray.length) * i * 0.2
            
            //call drawSphere function 5 times using converted n value
            for(let a=0; a < 5; a++)
            {
                drawSphere(n, material)
            }
        }
    }
}

// Load source text
fetch('https://summert13.github.io/IASC-2P02/Assignment%202/assets/emma.txt')
    .then(response => response.text())
    .then((data) =>
    {
        uiobj.text = data
        parseTextandTerms()
    }

    )


// UI
const ui = new dat.GUI({
    container: document.querySelector('#parent2')
})

// Interaction Folder
    // Spheres Folder
    const spheresFolder = ui.addFolder('Filter Terms')

    spheresFolder
        .add(pinkMaterial, 'visible')
        .name(`${uiobj.term1}`)

    spheresFolder
        .add(aquaMaterial, 'visible')
        .name(`${uiobj.term2}`)
    
    spheresFolder
        .add(purpleMaterial, 'visible')
        .name(`${uiobj.term3}`)
    
    spheresFolder
        .add(uiobj, 'animateBubbles')
        .name('Animate Bubbles')

    // Camera Folder
    const cameraFolder = ui.addFolder('Camera')

    cameraFolder
        .add(uiobj, 'rotateCamera')
        .name('Rotate Camera')

/*******************
** ANIMATION LOOP **
*******************/
const clock = new THREE.Clock()

// Animate
const animation = () =>
{
    // Return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // Orit Controls
    controls.update()

    // Camera Rotation
    if(uiobj.rotateCamera)
    {
        camera.position.x = Math.sin(elapsedTime * 0.3) * 16
        camera.position.z = Math.cos(elapsedTime * 0.3) * 16
    }

    // Animate Bubbles
    if(uiobj.animateBubbles){
        for(let i=0; i < scene.children.length; i++)
        {
            if(scene.children[i].type === "Mesh")
            {
                if(scene.children[i].position.y < 0)
                {
                    scene.children[i].position.z += 0.1
                }
            }
        }
    }

    // Rednerer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)

}

animation()
