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
    const geometry = new THREE.BoxGeometry(1, 2, 3);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(geometry, material);
    cube.rotation.z = Math.PI * 0.5;
    this.scene.add(cube);

    const box = new THREE.Box3().setFromObject(cube);
    console.log(cube, box.getSize(cube.parent!.position));
    this.dataObj = createGui(
      this.dataObj,
      [
        { type: 'number', name: 'num', label: '数值', min: 0, max: 100, step: 1 },
        { type: 'color', name: 'color', label: '颜色' },
        { type: 'select', name: 'select', label: '选择', options: { a: 1, b: 2, c: 3 } },
        { type: 'switch', name: 'switch', label: '开关' },
        { type: 'text', name: '', label: '文本文本文本' },
        { type: 'button', name: 'button', label: '按钮' }
      ],
      (v: any, k: string) => {
        console.log(k, v);
      }
    );

    setTimeout(() => {
      this.dataObj.num = 60;
    });
    this.animate(0);
  }
  animateAction(time: number) {}
}
const mythree = new MyThree(document.getElementById('threeContainer') as HTMLElement);

mythree.init();
