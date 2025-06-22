import * as THREE from 'three';

import { fragmentShader, vertexShader } from './shader';

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise';
import ThreeBase from '../utils/ThreeBase';

class MyThree extends ThreeBase {
  material = new THREE.RawShaderMaterial();
  parameters = { threshold: 0.6, steps: 200 };
  constructor(el: HTMLElement) {
    super(el);
    this.camera.position.set(0, 0, 2);
  }
  create3DTex() {
    const size = 128;
    const data = new Uint8Array(size * size * size);

    let i = 0;
    const scale = 0.05;
    const perlin = new ImprovedNoise();
    const vector = new THREE.Vector3();

    for (let z = 0; z < size; z++) {
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const d =
            1.0 -
            vector
              .set(x, y, z)
              .subScalar(size / 2)
              .divideScalar(size)
              .length();
          data[i] =
            (128 + 128 * perlin.noise((x * scale) / 1.5, y * scale, (z * scale) / 1.5)) * d * d;
          i++;
        }
      }
    }

    const texture = new THREE.Data3DTexture(data, size, size, size);
    texture.format = THREE.RedFormat;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.unpackAlignment = 1;
    texture.needsUpdate = true;
    return texture;
  }
  init() {
    const texture = this.create3DTex();
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3,
      uniforms: {
        map: { value: texture },
        cameraPos: { value: new THREE.Vector3() },
        threshold: { value: 0.6 },
        steps: { value: 200 }
      },
      vertexShader,
      fragmentShader,
      side: THREE.BackSide
    });
    this.material = material;
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);

    const gui = new GUI();
    gui.add(this.parameters, 'threshold', 0, 1, 0.01).onChange(this.update.bind(this));
    gui.add(this.parameters, 'steps', 0, 300, 1).onChange(this.update.bind(this));

    this.animate(0);
  }
  update() {
    this.material.uniforms.threshold.value = this.parameters.threshold;
    this.material.uniforms.steps.value = this.parameters.steps;
  }
  animateAction(time: number) {
    this.material.uniforms.cameraPos.value.copy(this.camera.position);
  }
}
const mythree = new MyThree(document.getElementById('threeContainer') as HTMLElement);

mythree.init();
