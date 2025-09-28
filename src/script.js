import * as THREE from "three";

import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { mix } from "three/src/nodes/TSL.js";
import { randInt } from "three/src/math/MathUtils.js";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Galaxy

const parameters = {};

parameters.count = 1000;
parameters.size = 0.01;
parameters.branches = 3;
parameters.radius = 5;
parameters.spin = 1;
parameters.randomness = 0.2;
parameters.randomnessPow = 3;
parameters.insideColor = "#ff6030";
parameters.outsideColor = "#1b3984";

let geometry = null;
let material = null;
let points = null;

const generateGalaxy = () => {
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  geometry = new THREE.BufferGeometry();
  
  const position = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);


  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);

  colorInside.lerp(colorOutside,0.5)

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;

    const radius = Math.random() * parameters.radius;
    const spinAngle = radius * parameters.spin;
    console.log(radius)

    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
    const randomX =
      Math.pow(Math.random(), parameters.randomnessPow) *
      (Math.random() < 5 ? 1 : -1) * parameters.randomness * radius;
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPow) *
      (Math.random() < 5 ? 1 : -1) *
      parameters.randomness *
      radius;
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPow) *
      (Math.random() < 5 ? 1 : -1) *
      parameters.randomness *
      radius;

    position[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    position[i3 + 1] = 0 + randomY;
    position[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;


    // Color
    const mixedColor = colorInside.clone()

    mixedColor.lerp(colorOutside,radius)
    
       colors[i3 ] = mixedColor.r;
       colors[i3 + 1] = mixedColor.g;
       colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors:true
  });

  points = new THREE.Points(geometry, material);
  scene.add(points);
};

generateGalaxy();

gui
  .add(parameters, "count")
  .min(100)
  .max(100000)
  .step(100)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "size")
  .min(0.0001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(generateGalaxy);

gui
  .add(parameters, "radius")
  .min(0.001)
  .max(20)
  .step(0.001)
  .onFinishChange(generateGalaxy);

gui
  .add(parameters, "branches")
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy);

gui
  .add(parameters, "spin")
  .min(-5)
  .max(5)
  .step(0.001)
  .onFinishChange(generateGalaxy);

gui
  .add(parameters, "randomness")
  .min(0)
  .max(2)
  .step(0.001)
  .onFinishChange(generateGalaxy);

gui
  .add(parameters, "randomnessPow")
  .min(1)
  .max(10)
  .step(0.001)
  .onFinishChange(generateGalaxy);

gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);


gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);

/**
 * Test cube
 */
// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial()
// );
// scene.add(cube);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();
  points.rotation.y = elapsedTime * 0.3; // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
