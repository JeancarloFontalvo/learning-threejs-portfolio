// Find the latest version by visiting https://cdn.skypack.dev/three.
        
import * as THREE from 'https://cdn.skypack.dev/three@0.126.1';
import * as dat from 'dat.gui'


const gui = new dat.GUI();
const world = {
    plane: {
        width: 5,
        height: 5,
        widthSegments: 10,
        heightSegments: 10
    }
}


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement);

const planeGeo = new THREE.PlaneGeometry(world.plane.width, world.plane.height, 10, 10);
const planeMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0000, 
    side: THREE.DoubleSide,
    flatShading: THREE.FlatShading
});
const planeMesh = new THREE.Mesh(planeGeo, planeMaterial);

const light = new THREE.DirectionalLight(0xffffff, 1);

light.position.set(0, 0, 1);

scene.add(planeMesh);
scene.add(light);

camera.position.z = 5;


gui.add(world.plane, 'width', 1, 15).onChange(generatePlane);
gui.add(world.plane, 'height', 1, 15).onChange(generatePlane);
gui.add(world.plane, 'widthSegments', 1, 50).onChange(generatePlane);
gui.add(world.plane, 'heightSegments', 1, 50).onChange(generatePlane);

randomizeVertices(planeGeo.attributes.position.array);


function animate(){
    
    requestAnimationFrame(animate);
    
    renderer.render(scene, camera);
}

console.log(planeGeo.attributes.position.array)

animate();


function randomizeVertices(geometryArray){
    for(let i = 0; i < geometryArray.length; i += 3){
        let vertex = {
            x: geometryArray[i],
            y: geometryArray[i + 1],
            z: geometryArray[i + 2],
        }
    
        geometryArray[i + 2] = vertex.z + Math.random();
    
    }
}

function generatePlane() {
    planeMesh.geometry.dispose();
    planeMesh.geometry = new THREE.PlaneGeometry(
        world.plane.width, 
        world.plane.height, 
        world.plane.widthSegments, 
        world.plane.heightSegments)

    randomizeVertices(planeMesh.geometry.attributes.position.array);
}