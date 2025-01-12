// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth * 0.75, window.innerHeight);
document.getElementById("container").appendChild(renderer.domElement);

// Create geometry and material
const geometry = new THREE.CircleGeometry(1, 5); // Pentagon
const materials = Array.from({ length: geometry.faces.length }, () =>
    new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff })
);

const mesh = new THREE.Mesh(geometry, materials);
scene.add(mesh);

// Labels
const labels = [];
geometry.vertices.forEach((vertex, i) => {
    const label = document.createElement("div");
    label.style.position = "absolute";
    label.style.color = "white";
    label.innerHTML = `V${i}`;
    labels.push({ element: label, vertex });
    document.body.appendChild(label);
});

// Animation state
let rotationEnabled = false;
let rotationSpeed = 0.02;
let rotationAxis = "y";

// Controls
const rotationToggle = document.getElementById("rotationToggle");
const speedControl = document.getElementById("speedControl");
const axisSelect = document.getElementById("axisSelect");
const wireframeToggle = document.getElementById("wireframeToggle");
const labelToggle = document.getElementById("labelToggle");
const resetButton = document.getElementById("resetButton");

rotationToggle.addEventListener("change", () => {
    rotationEnabled = rotationToggle.checked;
});

speedControl.addEventListener("input", () => {
    rotationSpeed = parseFloat(speedControl.value);
});

axisSelect.addEventListener("change", () => {
    rotationAxis = axisSelect.value;
});

wireframeToggle.addEventListener("change", () => {
    mesh.material.wireframe = wireframeToggle.checked;
});

labelToggle.addEventListener("change", () => {
    labels.forEach(({ element }) => {
        element.style.display = labelToggle.checked ? "block" : "none";
    });
});

resetButton.addEventListener("click", () => {
    mesh.rotation.set(0, 0, 0);
    rotationEnabled = false;
    rotationToggle.checked = false;
});

// Render loop
function animate() {
    requestAnimationFrame(animate);

    if (rotationEnabled) {
        mesh.rotation[rotationAxis] += rotationSpeed;
    }

    // Update labels
    const vector = new THREE.Vector3();
    const widthHalf = window.innerWidth / 2;
    const heightHalf = window.innerHeight / 2;

    labels.forEach(({ element, vertex }) => {
        vector.copy(vertex).project(camera);
        element.style.left = `${widthHalf + vector.x * widthHalf}px`;
        element.style.top = `${heightHalf - vector.y * heightHalf}px`;
    });

    renderer.render(scene, camera);
}

animate();

