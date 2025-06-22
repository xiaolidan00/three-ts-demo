import * as THREE from 'three';

import ThreeBase from '../utils/ThreeBase';

class MyThree extends ThreeBase {
  // dataObj = {
  //   num: 0,
  //   color: '#FFFFFF',
  //   select: 'aaa',
  //   switch: false,
  //   button: false
  // };
  isAxis = false;
  constructor(el: HTMLElement) {
    super(el);
  }
  init() {
    {
      const light = new THREE.AmbientLight(0xffffff, 1);
      this.scene.add(light);
    }
    {
      const light = new THREE.DirectionalLight(0xffffff, 3);
      light.position.set(5, 5, 5);
      this.scene.add(light);
    }

    {
      const tex = new THREE.TextureLoader().load('test.jpg');
      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshLambertMaterial({
        // color: 0xffff00,
        // transparent: true,
        // opacity: 0.5,
        map: tex
        // wireframe: true
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.receiveShadow = true;
      cube.castShadow = true;
      this.scene.add(cube);
    }
    // {
    //   const geometry = new THREE.SphereGeometry(1, 32, 32);
    //   const material = new THREE.MeshStandardMaterial({
    //     color: 0x0000ff
    //     // wireframe: true
    //   });
    //   const sphere = new THREE.Mesh(geometry, material);
    //   this.scene.add(sphere);
    // }

    // this.dataObj = createGui(
    //   this.dataObj,
    //   [
    //     { type: 'number', name: 'num', label: '数值', min: 0, max: 100, step: 1 },
    //     { type: 'color', name: 'color', label: '颜色' },
    //     { type: 'select', name: 'select', label: '选择', options: { a: 1, b: 2, c: 3 } },
    //     { type: 'switch', name: 'switch', label: '开关' },
    //     { type: 'text', name: '', label: '文本文本文本' },
    //     { type: 'button', name: 'button', label: '按钮' }
    //   ],
    //   (v: any, k: string) => {
    //     console.log(k, v);
    //   }
    // );

    // setTimeout(() => {
    //   this.dataObj.num = 60;
    // });
    this.animate(0);
  }
  animateAction(time: number) {}
}
const mythree = new MyThree(document.getElementById('threeContainer') as HTMLElement);

mythree.init();
