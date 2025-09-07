// Three.js animation for the hero section
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Three.js scene
    initThreeScene();
});

function initThreeScene() {
    // Get the container element
    const container = document.getElementById('threejs-container');
    
    if (!container) return;
    
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    // Set renderer size and add to container
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Set camera position
    camera.position.z = 30;
    
    // Create a group to hold all objects
    const group = new THREE.Group();
    scene.add(group);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);
    
    // Primary color: #6c63ff (108, 99, 255)
    // Accent color: #00f7ff (0, 247, 255)
    
    for (let i = 0; i < particlesCount * 3; i += 3) {
        // Positions - create a sphere of particles
        const radius = 15 + Math.random() * 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
        posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        posArray[i + 2] = radius * Math.cos(phi);
        
        // Colors - interpolate between primary and accent colors
        const mixFactor = Math.random();
        colorsArray[i] = (108 / 255) * mixFactor + (0 / 255) * (1 - mixFactor);
        colorsArray[i + 1] = (99 / 255) * mixFactor + (247 / 255) * (1 - mixFactor);
        colorsArray[i + 2] = (255 / 255) * mixFactor + (255 / 255) * (1 - mixFactor);
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
    
    // Create particle material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    
    // Create the particle system
    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    group.add(particleSystem);
    
    // Create a glowing sphere in the center
    const sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x6c63ff,
        transparent: true,
        opacity: 0.3
    });
    
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    group.add(sphere);
    
    // Create connecting lines between some particles
    const linesMaterial = new THREE.LineBasicMaterial({
        color: 0x6c63ff,
        transparent: true,
        opacity: 0.2
    });
    
    // Create 50 random connections
    for (let i = 0; i < 50; i++) {
        const lineGeometry = new THREE.BufferGeometry();
        
        // Get two random particle positions
        const index1 = Math.floor(Math.random() * particlesCount) * 3;
        const index2 = Math.floor(Math.random() * particlesCount) * 3;
        
        const vertices = new Float32Array([
            posArray[index1], posArray[index1 + 1], posArray[index1 + 2],
            posArray[index2], posArray[index2 + 1], posArray[index2 + 2]
        ]);
        
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        
        const line = new THREE.Line(lineGeometry, linesMaterial);
        group.add(line);
    }
    
    // Animation variables
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    // Track mouse movement
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Smooth follow for mouse movement
        targetX = mouseX * 0.2;
        targetY = mouseY * 0.2;
        
        // Rotate the entire group
        group.rotation.y += 0.002;
        group.rotation.x += 0.001;
        
        // Add slight movement based on mouse position
        group.rotation.y += (targetX - group.rotation.y) * 0.05;
        group.rotation.x += (targetY - group.rotation.x) * 0.05;
        
        // Pulse the center sphere
        const time = Date.now() * 0.001;
        sphere.scale.set(
            1 + Math.sin(time) * 0.1,
            1 + Math.sin(time) * 0.1,
            1 + Math.sin(time) * 0.1
        );
        
        // Render the scene
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
}