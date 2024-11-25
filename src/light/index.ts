import * as THREE from 'three';
import * as TWEEN from 'three/examples/jsm/libs/tween.module';

import ThreeBase from '../utils/ThreeBase';
import { createGui } from '../utils/gui';

class MyThree extends ThreeBase {
  dataObj = {
    intensity: 1,
    color: '#FFFFFF',
    pointLight: false,
    pIntensity: 5,
    ambientLight: true,
    aIntensity: 1,
    directionalLight: false,
    dIntensity: 1,
    lightRotate: false,
    env: false,
    radius: 5
  };
  alight?: THREE.AmbientLight;
  plight?: THREE.PointLight;
  dlight?: THREE.DirectionalLight;
  mirrorSphere?: THREE.Mesh;
  mirrorSphereCamera?: THREE.CubeCamera;
  tween?: TWEEN.Tween<{ time: number }>;
  constructor(el: HTMLElement) {
    super(el);
  }
  changeLight() {
    const i = this.dataObj.intensity;
    const c = new THREE.Color(this.dataObj.color);
    if (this.dataObj.pointLight) {
      if (!this.plight) {
        const plight = new THREE.PointLight(c, this.dataObj.pIntensity);
        plight.castShadow = true;
        this.plight = plight;
        this.plight.position.set(this.dataObj.radius, this.dataObj.radius, 0);
        this.scene.add(plight);

        const sphereSize = 1;
        const pointLightHelper = new THREE.PointLightHelper(plight, sphereSize);
        pointLightHelper.name = 'pointLightHelper';
        this.scene.add(pointLightHelper);

        if (this.tween) this.tween.resume();
      } else {
        this.plight.color = c;
        this.plight.intensity = i;
      }
    } else {
      const h = this.scene.getObjectByName('pointLightHelper');
      if (h) this.scene.remove(h);
      this.plight && this.scene.remove(this.plight);
      this.plight = undefined;
    }

    if (this.dataObj.directionalLight) {
      if (!this.dlight) {
        const dlight = new THREE.DirectionalLight(c, this.dataObj.dIntensity);
        dlight.castShadow = true;
        dlight.shadow.camera.left = -10;
        dlight.shadow.camera.bottom = -10;

        dlight.shadow.camera.top = 10;

        dlight.shadow.camera.right = 10;

        dlight.shadow.camera.near = 0.5;
        dlight.shadow.camera.far = 100;
        this.dlight = dlight;
        this.dlight.position.set(this.dataObj.radius, this.dataObj.radius, 0);
        this.scene.add(dlight);
        if (this.tween) this.tween.resume();
        const helper = new THREE.DirectionalLightHelper(dlight, this.dataObj.radius);
        helper.name = 'DirectionalLightHelper';
        this.scene.add(helper);
      } else {
        this.dlight.color = c;
        this.dlight.intensity = i;
      }
    } else {
      const h = this.scene.getObjectByName('DirectionalLightHelper');
      if (h) this.scene.remove(h);
      this.dlight && this.scene.remove(this.dlight);
      this.dlight = undefined;
    }

    if (this.dataObj.ambientLight) {
      if (!this.alight) {
        const alight = new THREE.AmbientLight(c, this.dataObj.aIntensity);
        this.alight = alight;
        this.scene.add(alight);
      } else {
        this.alight.color = c;
        this.alight.intensity = i;
      }
    } else {
      this.alight && this.scene.remove(this.alight);
      this.alight = undefined;
    }
  }

  init() {
    if (!this.scene || !this.renderer || !this.camera) return;

    //开启阴影
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.camera.position.set(10, 10, 10);

    {
      const geometry = new THREE.PlaneGeometry(50, 50);
      const material = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, side: THREE.DoubleSide });
      const plane = new THREE.Mesh(geometry, material);
      plane.rotateX(Math.PI * 0.5);
      plane.receiveShadow = true;
      this.scene.add(plane);
    }

    const geometry = new THREE.SphereGeometry(1, 16, 16);
    {
      const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      sphere.position.set(-6, 1, 0);
      this.scene.add(sphere);
    }

    {
      const material = new THREE.MeshLambertMaterial({ color: 0x0000ff });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      sphere.position.set(-3, 1, 0);
      this.scene.add(sphere);
    }

    {
      const material = new THREE.MeshPhongMaterial({ color: 0x0000ff });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      sphere.position.set(0, 1, 0);
      this.scene.add(sphere);
    }
    {
      const material = new THREE.MeshStandardMaterial({
        color: 0x0000ff,
        roughness: 0.5,
        metalness: 0.5
      });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      sphere.position.set(3, 1, 0);
      this.scene.add(sphere);
    }
    {
      const material = new THREE.MeshPhysicalMaterial({
        color: 0x0000ff,
        roughness: 0.5,
        metalness: 0.5,
        clearcoat: 0.3,
        clearcoatRoughness: 0.5
      });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      sphere.position.set(6, 1, 0);
      this.scene.add(sphere);
    }

    // {
    //   const material = new THREE.MeshPhysicalMaterial({
    //     color: 0x0000ff,
    //     //玻璃
    //     metalness: 0.25,
    //     roughness: 0,
    //     transmission: 1.0
    //   });
    //   const sphere = new THREE.Mesh(geometry, material);
    //   sphere.castShadow = true;
    //   sphere.receiveShadow = true;
    //   sphere.position.set(0, 1, 3);
    //   this.scene.add(sphere);
    // }
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(1024, {
      type: THREE.HalfFloatType,
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter
    });
    const mirrorSphereCamera = new THREE.CubeCamera(0.01, 10, cubeRenderTarget);
    this.mirrorSphereCamera = mirrorSphereCamera;
    this.scene.add(mirrorSphereCamera);
    // {
    //   //镜面球
    //   const material = new THREE.MeshPhysicalMaterial({
    //     roughness: 0,
    //     metalness: 1,
    //     color: 0xffffff,
    //     envMapIntensity: 1.0,
    //     envMap: mirrorSphereCamera.renderTarget.texture
    //   });

    //
    //   const sphere = new THREE.Mesh(geometry, material);
    //   this.mirrorSphere = sphere;
    //   sphere.castShadow = true;
    //   sphere.receiveShadow = true;
    //   sphere.position.set(0, 1, -3);
    //   this.scene.add(sphere);
    // }
    {
      // create custom material for the shader
      var customMaterial = new THREE.ShaderMaterial({
        uniforms: {
          mRefractionRatio: { value: 1.02 },
          mFresnelBias: { value: 0.1 },
          mFresnelPower: { value: 2.0 },
          mFresnelScale: { value: 1.0 },

          tCube: { value: mirrorSphereCamera.renderTarget.texture }
        },
        vertexShader: `uniform float mRefractionRatio;
		uniform float mFresnelBias;
		uniform float mFresnelScale;
		uniform float mFresnelPower;

		varying vec3 vReflect;
		varying vec3 vRefract[3];
		varying float vReflectionFactor;

		void main() {

			vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );

			vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );

			vec3 I = worldPosition.xyz - cameraPosition;

			vReflect = reflect( I, worldNormal );
			vRefract[0] = refract( normalize( I ), worldNormal, mRefractionRatio );
			vRefract[1] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.99 );
			vRefract[2] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.98 );
			vReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), mFresnelPower );

			gl_Position = projectionMatrix * mvPosition;

		}`,
        fragmentShader: `uniform samplerCube tCube; 
		varying vec3 vReflect;
		varying vec3 vRefract[3];
		varying float vReflectionFactor;

		void main() {

			vec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );
			 vec4 refractedColor = vec4(1.0);

			refractedColor.r = textureCube( tCube, vec3( -vRefract[0].x, vRefract[0].yz ) ).r;
			refractedColor.g = textureCube( tCube, vec3( -vRefract[1].x, vRefract[1].yz ) ).g;
			refractedColor.b = textureCube( tCube, vec3( -vRefract[2].x, vRefract[2].yz ) ).b;

			gl_FragColor = mix( refractedColor , reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );

		}`
      });

      const sphere = new THREE.Mesh(geometry, customMaterial);
      this.mirrorSphere = sphere;
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      sphere.position.set(3, 1, -3);
      this.scene.add(sphere);
    }

    this.changeLight();
    this.dataObj = createGui(
      this.dataObj,
      [
        { type: 'switch', name: 'ambientLight', label: '环境光' },
        { type: 'number', name: 'aIntensity', label: '强度', min: 0, max: 10, step: 0.5 },

        { type: 'switch', name: 'pointLight', label: '点光源' },
        { type: 'number', name: 'pIntensity', label: '强度', min: 0, max: 10, step: 0.5 },
        { type: 'switch', name: 'directionalLight', label: '平行光' },
        { type: 'number', name: 'dIntensity', label: '强度', min: 0, max: 10, step: 0.5 },

        { type: 'switch', name: 'env', label: '环境贴图' },
        { type: 'switch', name: 'lightRotate', label: '光源旋转' }
      ],
      (v: any, k: string) => {
        console.log(k, v);
        if (k === 'env' && this.scene) {
          if (v) {
            const loader = new THREE.CubeTextureLoader();
            loader.setPath('skyboxsun25deg/');

            const textureCube = loader.load([
              'px.jpg',
              'nx.jpg',
              'py.jpg',
              'ny.jpg',
              'pz.jpg',
              'nz.jpg'
            ]);

            this.scene.environment = textureCube;
            this.scene.environment.mapping = THREE.CubeReflectionMapping;
            this.scene.background = this.scene.environment;
          } else {
            this.scene.environment = new THREE.Texture();
            this.scene.background = new THREE.Color(0x333333);
          }
        } else if (
          ['ambientLight', 'pointLight', 'directionalLight', 'intensity', 'color'].includes(k)
        ) {
          this.changeLight();
        } else if (k === 'lightRotate') {
          if (v) {
            if (!this.tween) {
              let tween = new TWEEN.Tween({
                time: 0
              })
                .to(
                  {
                    time: 1
                  },
                  4000
                )
                .repeat(Infinity)
                .onUpdate((obj) => {
                  const radius = this.dataObj.radius;
                  if (this.dataObj.directionalLight && this.dlight) {
                    this.dlight.position.set(
                      radius * Math.cos(Math.PI * 2 * obj.time),
                      radius + Math.cos(obj.time * Math.PI * 4),
                      radius * Math.sin(Math.PI * 2 * obj.time)
                    );
                  }

                  if (this.dataObj.pointLight && this.plight) {
                    this.plight.position.set(
                      radius * Math.cos(Math.PI * 2 * obj.time),
                      radius + Math.cos(obj.time * Math.PI * 4),
                      radius * Math.sin(Math.PI * 2 * obj.time)
                    );
                  }
                })
                .start();
              this.tween = tween;
              TWEEN.add(tween);
            }
          } else {
            this.tween && TWEEN.remove(this.tween);
            this.tween = undefined;
          }
        }
      }
    );
    this.animate(0);
  }
  animateAction() {
    TWEEN.update();
    if (this.scene && this.renderer && this.mirrorSphere && this.mirrorSphereCamera) {
      this.mirrorSphere.visible = false;
      // this.mirrorSphere.getWorldPosition(this.mirrorSphereCamera.position);
      this.mirrorSphereCamera.position.copy(this.mirrorSphere.position);

      this.mirrorSphereCamera.update(this.renderer, this.scene);
      this.mirrorSphere.visible = true;
    }
  }
}
const mythree = new MyThree(document.getElementById('threeContainer') as HTMLElement);

mythree.init();
