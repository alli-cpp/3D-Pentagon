import * as THREE from "three";
import { createTextSprite } from "../utils/createTextSprite";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 20);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("webgl-output").appendChild(renderer.domElement);

const geometry = new THREE.BufferGeometry();

// Define vertices and indices for a 3D pentagon
const vertices = new Float32Array([
    0.0,  5.0,  0.0,
    4.8,  1.5,  0.0,
    3.0, -4.0,  0.0,
   -3.0, -4.0,  0.0,
   -4.8,  1.5,  0.0,
    0.0,  5.0,  5.0,
    4.8,  1.5,  5.0,
    3.0, -4.0,  5.0,
   -3.0, -4.0,  5.0,
   -4.8,  1.5,  5.0
]);

const indices = [
    0, 1, 2, 0, 2, 3, 0, 3, 4, // Front
    5, 6, 7, 5, 7, 8, 5, 8, 9, // Back
    0, 5, 1, 1, 6, 2, 2, 7, 3, 3, 8, 4, 4, 9, 0, // Connecting edges
];

geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
geometry.setIndex(indices);
geometry.computeVertexNormals();

const materials = Array.from({ length: 10 }, () => {
    return new THREE.MeshLambertMaterial({
        color: new THREE.Color(`rgb(${THREE.MathUtils.randInt(200, 255)}, 0, 0)`),
        side: THREE.DoubleSide,
    });
});

const mesh = new THREE.Mesh(geometry, materials);
scene.add(mesh);

const light = new THREE.PointLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Labels for vertices and faces
const numVertices = vertices.length / 3;
const labels = [];

for (let i = 0; i < numVertices; i++) {
    const x = vertices[i * 3];
    const y = vertices[i * 3 + 1];
    const z = vertices[i * 3 + 2];
    const label = createTextSprite(`V${i}`);
    label.position.set(x, y, z);
    label.visible = false;
    mesh.add(label);
    labels.push(label);
}

// Render loop
const animate = () => {
    mesh.rotation.y += 0.01;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

animate();

// Handle window resizing
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
