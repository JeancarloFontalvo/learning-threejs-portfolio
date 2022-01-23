// Find the latest version by visiting https://cdn.skypack.dev/three.
        
import * as THREE from 'https://cdn.skypack.dev/three@0.126.1';
        
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

const planeGeo = new THREE.PlaneGeometry(5, 5, 10, 10);
const planeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide});
const planeMesh = new THREE.Mesh(planeGeo, planeMaterial);

scene.add(planeMesh);

camera.position.z = 5;


function animate(){
    requestAnimationFrame(animate);
    
    renderer.render(scene, camera);
}

animate();
