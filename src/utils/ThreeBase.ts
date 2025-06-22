import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

export default class ThreeBase {
  container: HTMLElement;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  stats?: Stats;
  isStats: boolean = true;
  isAxis: boolean = true;
  isControl: boolean = true;
  controls?: OrbitControls;
  threeAnim: number = 0;

  constructor(el: HTMLElement) {
    this.container = el;

    THREE.Cache.enabled = true;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      logarithmicDepthBuffer: false
    });

    this.renderer.setClearColor(0x000000, 0);
    this.renderer.clear();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    this.container.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.container.offsetWidth / this.container.offsetHeight,
      0.1,
      200
    );

    this.camera.position.set(1, 1, 10);
    this.renderer.setViewport(0, 0, this.container.offsetWidth, this.container.offsetHeight);

    if (this.isStats) {
      let stats = new Stats();
      stats.dom.style.position = 'absolute';
      stats.dom.style.top = '0px';
      this.stats = stats;
      this.container.appendChild(stats.dom);
    }
    if (this.isAxis) {
      const axesHelper = new THREE.AxesHelper(500);
      this.scene.add(axesHelper);
    }
    if (this.isControl) {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }

    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('unload', this.cleanAll.bind(this));
  }

  init() {}

  animate(time: number) {
    if (this.stats) {
      this.stats.update();
    }
    if (this.controls) {
      this.controls.update();
    }

    this.animateAction(time);
    this.renderer.render(this.scene, this.camera);
    this.threeAnim = requestAnimationFrame(this.animate.bind(this));
  }
  //执行动画动作
  animateAction(time: number) {}
  cleanNext(obj: any, idx: number) {
    if (obj.children && idx < obj.children.length) {
      this.cleanElmt(obj.children[idx]);
    }
    if (idx + 1 < obj.children.length) {
      this.cleanNext(obj, idx + 1);
    }
  }
  setView(cameraPos: THREE.Vector3, controlPos: THREE.Vector3) {
    this.camera && this.camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
    this.controls && this.controls.target.set(controlPos.x, controlPos.y, controlPos.z);
  }

  getView() {
    this.camera && console.log('%ccamera', 'background:yellow', this.camera.position);
    this.controls && console.log('%ccontrols', 'background:yellow', this.controls.target);
  }

  cleanElmt(obj: any) {
    if (obj) {
      if (obj.children && obj.children.length > 0) {
        this.cleanNext(obj, 0);
        obj.remove(...obj.children);
      }
      if (obj.geometry) {
        obj.geometry.dispose && obj.geometry.dispose();
      }
      if (obj instanceof THREE.Material) {
        for (const v of Object.values(obj)) {
          if (v instanceof THREE.Texture) {
            v.dispose && v.dispose();
          }
        }

        obj.dispose && obj.dispose();
      }
      if (Array.isArray(obj.material)) {
        obj.material.forEach((m: any) => {
          this.cleanElmt(m);
        });
      }

      obj.dispose && obj.dispose();
      obj.clear && obj.clear();
    }
  }

  cleanObj(obj: any) {
    this.cleanElmt(obj);
    obj?.parent?.remove && obj.parent.remove(obj);
  }
  cleanAll() {
    this.threeAnim && cancelAnimationFrame(this.threeAnim);

    if (this.stats) {
      this.container.removeChild(this.stats.dom);
      this.stats = undefined;
    }

    this.cleanObj(this.scene);
    this.controls && this.controls.dispose();

    this.renderer.renderLists && this.renderer.renderLists.dispose();
    this.renderer.dispose && this.renderer.dispose();
    this.renderer.forceContextLoss();
    let gl = this.renderer.domElement.getContext('webgl');
    gl && gl.getExtension('WEBGL_lose_context')?.loseContext();
    this.renderer.setAnimationLoop(null);

    console.log('清空资源', this.renderer.info);

    THREE.Cache.clear();
    window.removeEventListener('resize', this.onResize.bind(this));
    window.removeEventListener('unload', this.cleanAll.bind(this));
  }

  onResize() {
    this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
  }
}
