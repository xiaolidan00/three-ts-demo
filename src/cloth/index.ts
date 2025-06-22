import * as CANNON from 'cannon-es';
import * as THREE from 'three';

import ThreeBase from '../utils/ThreeBase';

class MyThree extends ThreeBase {
  world = new CANNON.World();
  constructor(el: HTMLElement) {
    super(el);
    const sphereSize = 0.1;
    this.world.gravity.set(0, -9.81, 0);

    // Max solver iterations: Use more for better force propagation, but keep in mind that it's not very computationally cheap!
    this.world.solver.iterations = 20;

    const clothMaterial = new CANNON.Material('cloth');
    const sphereMaterial = new CANNON.Material('sphere');
    const cloth_sphere = new CANNON.ContactMaterial(clothMaterial, sphereMaterial, {
      friction: 0,
      restitution: 0
    });

    // Adjust constraint equation parameters
    // Contact stiffness - use to make softer/harder contacts
    cloth_sphere.contactEquationStiffness = 1e9;
    // Stabilization time in number of timesteps
    cloth_sphere.contactEquationRelaxation = 3;

    // Add contact material to the world
    this.world.addContactMaterial(cloth_sphere);

    // Create sphere
    // Make it a little bigger than the three.js sphere
    // so the cloth doesn't clip thruogh
    const sphereShape = new CANNON.Sphere(sphereSize * 1.3);
    const sphereBody = new CANNON.Body({
      type: CANNON.Body.KINEMATIC
    });
    sphereBody.addShape(sphereShape);
    this.world.addBody(sphereBody);
    const particles: any[] = [];
    const Nx = 12; // number of horizontal particles in the cloth
    const Ny = 12; // number of vertical particles in the cloth
    const clothMass = 1; // 1 kg in total
    const clothSize = 1; // 1 meter
    const mass = (clothMass / Nx) * Ny;
    const restDistance = clothSize / Nx;
    function clothFunction(u, v, target) {
      const x = (u - 0.5) * restDistance * Nx;
      const y = (v + 0.5) * restDistance * Ny;
      const z = 0;

      target.set(x, y, z);

      return target;
    }

    for (let i = 0; i < Nx + 1; i++) {
      particles.push([]);
      for (let j = 0; j < Ny + 1; j++) {
        const index = j * (Nx + 1) + i;

        const point = clothFunction(i / (Nx + 1), j / (Ny + 1), new THREE.Vector3());
        const particle = new CANNON.Body({
          // Fix in place the first row
          mass: j === Ny ? 0 : mass
        });
        particle.addShape(new CANNON.Particle());
        particle.linearDamping = 0.5;
        particle.position.set(point.x, point.y - Ny * 0.9 * restDistance, point.z);
        particle.velocity.set(0, 0, -0.1 * (Ny - j));

        particles[i].push(particle);
        this.world.addBody(particle);
      }
    }
    // Connect the particles with distance constraints
    const connect = (i1, j1, i2, j2) => {
      this.world.addConstraint(
        new CANNON.DistanceConstraint(particles[i1][j1], particles[i2][j2], restDistance)
      );
    };
    for (let i = 0; i < Nx + 1; i++) {
      for (let j = 0; j < Ny + 1; j++) {
        if (i < Nx) connect(i, j, i + 1, j);
        if (j < Ny) connect(i, j, i, j + 1);
      }
    }
  }
  init() {
    const movementRadius = 0.2;


 // Lights
 const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
 scene.add(ambientLight)

 const directionalLight = new THREE.DirectionalLight(0xffffff, 1.75)
 directionalLight.position.set(5, 5, 5)
 scene.add(directionalLight)

 // Cloth material
 const clothTexture = new THREE.TextureLoader().load('images/sunflower.jpg')
 clothTexture.wrapS = THREE.RepeatWrapping
 clothTexture.wrapT = THREE.RepeatWrapping
 clothTexture.anisotropy = 16
 clothTexture.encoding = THREE.sRGBEncoding

 const clothMaterial = new THREE.MeshPhongMaterial({
   map: clothTexture,
   side: THREE.DoubleSide,
 })

 // Cloth geometry
 const clothGeometry = new THREE.ParametricGeometry(clothFunction, Nx, Ny)

 // Cloth mesh
 const clothMesh = new THREE.Mesh(clothGeometry, clothMaterial)
 this.scene.add(clothMesh)

 // Sphere
 const sphereGeometry = new THREE.SphereGeometry(sphereSize, 20, 20)
 const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 })

 const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
 this.scene.add(sphereMesh)


    this.animate(0);
  }
  animateAction(time: number) {}
}
const mythree = new MyThree(document.getElementById('threeContainer') as HTMLElement);

mythree.init();
