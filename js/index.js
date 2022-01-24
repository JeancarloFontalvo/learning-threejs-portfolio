// Find the latest version by visiting https://cdn.skypack.dev/three.
        
import gsap from 'gsap'
import * as THREE from 'https://cdn.skypack.dev/three@0.126.1';
import * as dat from 'dat.gui'
import {OrbitControls}  from 'https://cdn.skypack.dev/three@0.126.1/examples/jsm/controls/OrbitControls.js'

const gui = new dat.GUI();
const world = {
    plane: {
        width: 5,
        height: 5,
        widthSegments: 10,
        heightSegments: 10
    }
}

const mouse = {
    x: undefined,
    y: undefined
}

const colors = []


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const renderer = new THREE.WebGLRenderer();

const controls = new OrbitControls( camera, renderer.domElement );

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement);

const planeGeo = new THREE.PlaneGeometry(world.plane.width, world.plane.height, 10, 10);
const planeMaterial = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    flatShading: THREE.FlatShading,
    vertexColors: true
});
const planeMesh = new THREE.Mesh(planeGeo, planeMaterial);
for(let i = 0; i < planeMesh.geometry.attributes.position.count; i++){
    colors.push(0, .19, .4)
}

planeMesh.geometry.setAttribute(
    'color', 
    new THREE.BufferAttribute(new Float32Array(colors), 3)
)

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);

const backlight = new THREE.DirectionalLight(0xffffff, 1);
backlight.position.set(0, 0, -1);

const raycaster = new THREE.Raycaster()

scene.add(planeMesh);
scene.add(light);
scene.add(backlight);

camera.position.z = 5;


gui.add(world.plane, 'width', 1, 15).onChange(generatePlane);
gui.add(world.plane, 'height', 1, 15).onChange(generatePlane);
gui.add(world.plane, 'widthSegments', 1, 50).onChange(generatePlane);
gui.add(world.plane, 'heightSegments', 1, 50).onChange(generatePlane);

randomizeVertices(planeGeo.attributes.position.array);


function animate(){
    
    requestAnimationFrame(animate);
    
    renderer.render(scene, camera);

    raycaster.setFromCamera(mouse, camera);

    intersectHovering(planeMesh)
    
}

animate();


addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / innerHeight) * 2 + 1;
});


function randomizeVertices(geometryArray){
    for(let i = 0; i < geometryArray.length; i += 3){
        let vertex = {
            x: geometryArray[i],
            y: geometryArray[i + 1],
            z: geometryArray[i + 2],
        }
    
        geometryArray[i + 2] = vertex.z + Math.random() * .3;
    
    }
}

function generatePlane() {
    planeMesh.geometry.dispose();
    planeMesh.geometry = new THREE.PlaneGeometry(
        world.plane.width, 
        world.plane.height, 
        world.plane.widthSegments, 
        world.plane.heightSegments)

    for(let i = 0; i < planeMesh.geometry.attributes.position.count; i++){
        colors.push(0, .19, .4)
    }


    planeMesh.geometry.setAttribute(
        'color', 
        new THREE.BufferAttribute(new Float32Array(colors), 3)
    )

    randomizeVertices(planeMesh.geometry.attributes.position.array);
}

function intersectHovering(mesh){
    const intersects = raycaster.intersectObject(mesh);

    if(!intersects.length) 
        return

    let intersection = intersects[0];
    console.log('intersecting')
    const initialColor = {
        r: 0,
        g: .19,
        b: .4
    }

    const hoverColor = {
        r: .1,
        g: .5,
        b: 1
    }

    let {color} = intersection.object.geometry.attributes;
    
    colorVertices(hoverColor);

    intersects[0].object.geometry.attributes.color.needsUpdate = true;

    
    gsap.to(hoverColor, {
        r: initialColor.r,
        g: initialColor.g,
        b: initialColor.b,
        onUpdate: () => {
            colorVertices(hoverColor)
        }
    })

    function colorVertices(colorRgb) {
        
        for (let group in intersection.face) {
            color.setX(intersection.face[group], colorRgb.r);
            color.setY(intersection.face[group], colorRgb.g);
            color.setZ(intersection.face[group], colorRgb.b);
        }
    }
}