import * as THREE from "three";
import * as TWEEN from "three/examples/jsm/libs/tween.module";

import ThreeBase from "../utils/ThreeBase";

class MyThree extends ThreeBase {
  mat?: THREE.ShaderMaterial;
  clock?: THREE.Clock;
  constructor(el: HTMLElement) {
    super(el);
  }
  init() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);
    const geometry = new THREE.SphereGeometry(1, 16, 16);
    const tex = new THREE.TextureLoader().load("test.jpg");
    // tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        tex: {value: tex},
        time: {value: 0},
        radius: {value: 1}
      },
      vertexShader: `uniform float time;
      uniform float radius;
      varying vec2 vUv;
      float PI = acos(-1.0);
void main() 
{  vUv=uv; 
      float w=radius*PI;
vec3 newPosition =mix(position,vec3( 0.0,(uv.y-0.5)*w,-(uv.x-0.5)*2.0* w),sin(time*PI));
gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}`,
      fragmentShader: `
      varying vec2 vUv;
      uniform sampler2D tex;
      void main(){
gl_FragColor=texture2D(tex,vUv);
}`,
      side: THREE.DoubleSide
    });
    this.mat = mat;
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.rotation.y = -Math.PI * 0.5;
    this.scene.add(mesh);
    this.clock = new THREE.Clock();
    this.animate(0);

    const tw = new TWEEN.Tween({time: 0.0})
      .to({time: 1.0}, 4000)
      .repeat(Infinity)
      .onUpdate((obj) => {
        if (this.mat) {
          this.mat.uniforms.time.value = obj.time;
        }
      })
      .start();
    TWEEN.add(tw);
  }
  animateAction(time: number) {
    TWEEN.update();
  }
}
const mythree = new MyThree(document.getElementById("threeContainer") as HTMLElement);

mythree.init();
