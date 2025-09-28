# Three.js Journey

## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```
# spininggalaxy

**Listing the more Most important topic about this Lessions**

# 🌌 SpiningGalaxy – Three.js Journey  

This project is part of my learning from **Three.js Journey**.  
Here I am building a procedural **spinning galaxy** using particles, math and trigonometry.  

---

Galaxy Generator with Three.js
Overview
This project is a visually stunning galaxy simulation built using Three.js. It generates a spiral galaxy composed of particles (stars) with customizable parameters for star count, galaxy size, spiral arms (branches), spin intensity, randomness, and color gradients. The simulation includes orbit controls for interactive viewing and a GUI (via lil-gui) for real-time parameter adjustments.
The galaxy is generated procedurally using mathematical models inspired by real galactic structures, such as spiral arms formed by density waves. This README explains the theoretical foundations behind key concepts like radius, angles, vertices (particle positions), spin, and how the code creates a realistic spiral shape.
Features

Procedural generation of a spiral galaxy using particle systems.
Interactive GUI for real-time parameter tweaking.
Orbit controls for camera navigation.
Additive blending for a glowing, starry effect.
Color interpolation from inner (hotter) to outer (cooler) regions.
Randomness with power scaling for natural clustering.

Installation and Usage
Prerequisites

A modern web browser.
Node.js and npm (for local development, if extending the project).

Setup

Clone or download the repository.
Ensure Three.js and dependencies are installed via npm (if not bundled):npm install three lil-gui


Open index.html in a browser or serve it via a local server (e.g., npx live-server).
Use the GUI panel to tweak parameters and regenerate the galaxy.
Interact with the scene using mouse/touch for orbiting, zooming, and panning.

Code Structure

Base Setup: Initializes the scene, camera, renderer, and controls.
Galaxy Generation: The generateGalaxy() function creates a BufferGeometry with positions and colors for particles.
Parameters: Exposed via GUI for dynamic updates.
Animation Loop: Rotates the galaxy slowly for a dynamic effect.

Theoretical Foundations
The galaxy is modeled using polar coordinates to place particles in 3D space, simulating a flattened disk with spiral arms. This approach draws from astrophysics, where galaxies like the Milky Way exhibit spiral structures due to density wave theory—waves of compression that propagate through the galactic disk, causing stars to bunch up in arms without the arms rotating like a rigid body.
1. Radius

Theory: In a galaxy, the radius represents the radial distance from the galactic center. Stars are distributed with varying density, often following an exponential decay (denser at the center, sparser outward). The code uses a uniform random distribution for simplicity: radius = Math.random() * parameters.radius.
Role in Code: The maximum radius (parameters.radius) defines the galaxy's size. Each particle's radius influences its base position, spin, and color blending.
Distribution: Particles are spread across radii, with randomness adding natural variation to mimic stellar orbits.

2. Angles (Branch Angles)

Theory: A circle (360° or 2π radians) around the galactic center is divided into equal segments for each spiral arm (branch). This uses angular division in polar coordinates, where the angle θ determines the azimuthal position.
Role in Code: The branchAngle is calculated as ((i % parameters.branches) / parameters.branches) * Math.PI * 2. This assigns particles to branches sequentially.
Example for 3 branches:
Particle 0: Branch 0, angle = 0°
Particle 1: Branch 1, angle = 120°
Particle 2: Branch 2, angle = 240°
Particle 3: Back to Branch 0, angle = 0° (plus spin)




Diagram of Circle Division:Center (0,0)

     Branch 2 (240°)
        /
       /
      /
Branch 1 (120°) --- Center --- Branch 0 (0°)
      \
       \
        \
     Branch 2 continuation (with spin)


The circle is segmented like pie slices, with particles placed along radii within each slice to form arms.



3. Vertices (Particle Positions)

Theory: Each particle's position is a vertex in 3D space, computed using Cartesian conversion from polar coordinates:
x = radius * cos(θ)
z = radius * sin(θ) (y near 0 for a flat disk, with randomness for thickness)
This is rooted in vector mathematics, where positions are vectors from the origin.


Role in Code: For each particle:
Compute radius, branchAngle, and spinAngle.
Add randomness: Small offsets (randomX, randomY, randomZ) scaled by Math.pow(Math.random(), parameters.randomnessPow) for clustered distribution.
Final position:position[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
position[i3 + 1] = randomY; // Vertical randomness for disk thickness
position[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;


This distributes ~`count / branches` particles per arm, radially.



4. Spin and Spiral Shape

Theory: Spiral galaxies have arms that "wind" due to differential rotation—inner stars orbit faster, causing a logarithmic spiral. The spin parameter simulates this by adding an angular offset: spinAngle = radius * parameters.spin.
This "bends" vectors: At radius 0, no spin; at max radius, maximum twist.
Mathematically, it’s like rotating θ by a radius-dependent factor, creating a spiral curve (e.g., r * θ in polar form).


Role in Code: The effective angle is branchAngle + spinAngle. Positive spin winds arms clockwise; negative counterclockwise.
Vector Bend Explanation: Each position vector is rotated by radius * spin, increasing with distance, transforming straight radial lines into curved spirals.
Diagram of Spin Effect:Simplified 2D view (x-z plane):No Spin (straight arms):
Center --- Particle at r=1, θ=0°
       --- Particle at r=2, θ=0°
       --- Particle at r=3, θ=0°

With Spin (e.g., spin=1):
Center --- Particle at r=1, θ=0° + 1*1 = 1 rad (~57°)
       --- Particle at r=2, θ=0° + 1*2 = 2 rad (~114°)
       --- Particle at r=3, θ=0° + 1*3 = 3 rad (~172°)

Result: A curving arm bending away from the original direction.



5. Color Interpolation

Theory: Inner galactic regions are brighter/hotter (e.g., red/orange), fading to cooler outer areas (blue/purple), reflecting stellar density and temperature gradients.
Role in Code: Uses Three.js Color.lerp(): mixedColor.lerp(colorOutside, radius / parameters.radius) to blend from insideColor to outsideColor.

6. Randomness and Power

Theory: Stars aren’t perfectly aligned; randomness simulates perturbations from gravity, gas clouds, etc. The power exponent (randomnessPow) creates a non-uniform distribution—higher values cluster particles closer to arms, following power-law distributions common in astrophysics.
Role in Code: Math.pow(Math.random(), randomnessPow) biases randomness toward smaller values when pow > 1, enhancing arm definition.

Performance Notes

High count (>10,000) may impact FPS on lower-end devices due to particle rendering.
The galaxy rotates in the animation loop for dynamism, which can be disabled if needed.

Credits

Built with Three.js.
GUI via lil-gui.
Inspired by procedural generation tutorials and galactic astrophysics.

License
MIT License. Feel free to use, modify, and distribute.


