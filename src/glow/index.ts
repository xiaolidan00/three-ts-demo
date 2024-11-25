import * as THREE from 'three';

import ThreeBase from '../utils/ThreeBase';
import { createGui } from '../utils/gui';

class MyThree extends ThreeBase {
  dataObj = {
    num: 0,
    color: '#FFFFFF',
    select: 'aaa',
    switch: false,
    button: false
  };
  constructor(el: HTMLElement) {
    super(el);
  }
  init() {
    {
      const geometry = new THREE.PlaneGeometry(10, 10);
      const material = new THREE.MeshBasicMaterial({ color: 0x808080, side: THREE.DoubleSide });
      const plane = new THREE.Mesh(geometry, material);
      plane.rotateX(0.5 * Math.PI);
      this.scene.add(plane);
    }
    const color = new THREE.Color('#ff0000');
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: color,
      opacity: 0.8,
      transparent: true
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 1, 0);
    this.scene.add(mesh);
    const canvas = document.createElement('canvas');
    const radius = 200;
    canvas.width = radius * 2;
    canvas.height = radius * 2;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.arc(radius, radius, radius * 2, 0, 2 * Math.PI);
      ctx.closePath();
      const grd = ctx.createRadialGradient(radius, radius, radius * 0.4, radius, radius, radius);
      grd.addColorStop(0, 'rgba(255,255,255,0)');
      grd.addColorStop(0.4, 'rgba(255,255,255,0)');
      grd.addColorStop(0.4, 'rgba(255,255,255,0.8)');
      grd.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grd;
      ctx.fill();
    }
    const canvasTex = new THREE.CanvasTexture(canvas);

    const mm = new THREE.SpriteMaterial({
      map: canvasTex,
      color: color,
      transparent: true,
      depthTest: false,
      blending: THREE.AdditiveBlending
    });

    const sprite = new THREE.Sprite(mm);
    sprite.scale.set(3, 3, 1);
    sprite.position.copy(mesh.position);
    this.scene.add(sprite);
    this.animate(0);
  }
  animateAction(time: number) {}
}
const mythree = new MyThree(document.getElementById('threeContainer') as HTMLElement);

mythree.init();
