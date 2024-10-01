import * as THREE from 'three';

import ThreeBase from '../utils/ThreeBase';

class MyThree extends ThreeBase {
  constructor(el: HTMLElement) {
    super(el);
  }
  init() {
    if (!this.scene) return;
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);

    this.animate(0);
  }
  animateAction(time: number) {}
}
const mythree = new MyThree(document.getElementById('threeContainer') as HTMLElement);
mythree.initThree();
mythree.init();
