import * as THREE from 'three';

// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import ThreeBase from '../utils/ThreeBase';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';
class MyThree extends ThreeBase {
  keyStates = {
    KeyW: false, //前
    KeyA: false, //左
    KeyS: false, //右
    KeyD: false //后
  };
  a = 12;
  damping = -0.04;
  v = new THREE.Vector3(0, 0, 3);
  viewType = 3; //第一人称或第三人称视角
  clock = new THREE.Clock();
  model: THREE.Group | undefined = undefined;
  leftmove: boolean = false;
  mixer: THREE.AnimationMixer | undefined = undefined;
  IdleAction: THREE.AnimationAction | undefined = undefined;
  WalkAction: THREE.AnimationAction | undefined = undefined;
  RunAction: THREE.AnimationAction | undefined = undefined;

  constructor(el: HTMLElement) {
    super(el);
    this.isControl = false;
  }
  loadModel(url: string) {
    return new Promise((resolve) => {
      const loader = new GLTFLoader();
      loader.load(
        url,
        (gltf) => {
          console.log(gltf);
          this.scene?.add(gltf.scene);
          this.model = gltf.scene;
          this.mixer = new THREE.AnimationMixer(this.model);

          //休息动作
          this.IdleAction = this.mixer.clipAction(gltf.animations[2]);
          this.IdleAction.play();
          //步行动作
          this.WalkAction = this.mixer.clipAction(gltf.animations[6]);
          this.WalkAction.play();
          //跑步动作
          this.RunAction = this.mixer.clipAction(gltf.animations[3]);
          this.RunAction.play();
          resolve(gltf.scene);
        },
        (xhr) => {
          console.log(url, (xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
          console.log('An error happened', error);
        }
      );
    });
  }
  changeAction(name: string) {
    if (this.IdleAction && this.WalkAction && this.RunAction)
      if (name == 'Idle') {
        this.IdleAction.weight = 1.0;
        this.WalkAction.weight = 0.0;
        this.RunAction.weight = 0.0;
      } else if (name == 'Walk') {
        this.IdleAction.weight = 0.0;
        this.WalkAction.weight = 1.0;
        this.RunAction.weight = 0.0;
      } else if (name == 'Run') {
        this.IdleAction.weight = 0.0;
        this.WalkAction.weight = 0.0;
        this.RunAction.weight = 1.0;
      }
  }
  randomBox() {
    //随机生成建筑
    const width = 500,
      height = 500;
    const geometries = [];
    const helper = new THREE.Object3D();
    for (let i = 0; i < 100; i++) {
      const h = Math.round(Math.random() * 15) + 5;
      const x = Math.round(Math.random() * width);
      const y = Math.round(Math.random() * height);
      helper.position.set((x % 2 ? -1 : 1) * x, h * 0.5, (y % 2 ? -1 : 1) * y);
      const geometry = new THREE.BoxGeometry(5, h, 5);
      helper.updateWorldMatrix(true, false);
      geometry.applyMatrix4(helper.matrixWorld);
      geometries.push(geometry);
    }
    const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries, false);

    const material = new THREE.MeshStandardMaterial({ color: 0x0000ff, transparent: true });
    const cube = new THREE.Mesh(mergedGeometry, material);
    cube.castShadow = true;
    cube.receiveShadow = true;
    this.scene?.add(cube);
  }
  initLight() {
    const a = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene?.add(a);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(10, 10, 10);
    this.scene?.add(directionalLight);
  }
  async init() {
    if (!this.scene || !this.camera) return;
    this.initLight();
    await this.loadModel('Xbot.glb');
    // this.model?.add(this.camera);
    this.camera.position.set(0, 1.6, -5.5);
    this.camera.lookAt(0, 1.6, 0);
    const cameraGroup = new THREE.Group();
    cameraGroup.add(this.camera);
    this.model?.add(cameraGroup);

    const geometry = new THREE.PlaneGeometry(500, 500);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotateX(-Math.PI * 0.5);
    this.scene.add(plane);
    this.randomBox();
    document.addEventListener('keydown', (event) => {
      const k = event.code as keyof typeof this.keyStates;
      if (this.keyStates[k] !== undefined) this.keyStates[k] = true;

      if (event.code === 'KeyV' && this.camera) {
        if (this.viewType === 3) {
          // 切换到第一人称
          this.camera.position.z = 1; //相机在人前面一点 看不到人模型即可
          this.viewType = 1;
        } else {
          // 切换到第三人称
          this.camera.position.z = -5.5; //相机在人后面一点
          this.viewType = 3;
        }
      }
    });
    // 当某个键盘抬起设置对应属性设置为false
    document.addEventListener('keyup', (event) => {
      const k = event.code as keyof typeof this.keyStates;
      if (this.keyStates[k] !== undefined) this.keyStates[k] = false;
    });

    document.addEventListener('mousemove', (event) => {
      if (this.leftmove && this.model) {
        // 左右旋转
        this.model.rotation.y -= event.movementX / 600;

        // 玩家角色绕x轴旋转  视角上下俯仰
        cameraGroup.rotation.x -= event.movementY / 600;
      }
    });
    document.addEventListener('mousedown', () => {
      this.leftmove = true;
    });
    document.addEventListener('mouseup', () => {
      this.leftmove = false;
    });

    this.animate(0);
  }
  playerUpdate(deltaTime: number) {
    const vL = this.v.length();
    if (vL < 0.2) {
      //速度小于0.2切换到站着休息状态
      // 注释如果当前就是Idle状态，不要再次执行changeAction
      this.changeAction('Idle');
    } else if (vL > 0.2 && vL < 4) {
      //步行状态
      this.changeAction('Walk');
    } else if (vL >= 4) {
      //跑步状态
      this.changeAction('Run');
    }
  }
  animateAction(time: number) {
    const deltaTime = this.clock.getDelta();
    if (this.keyStates.KeyW || this.keyStates.KeyS) {
      const front = new THREE.Vector3(0, 0, 0);
      this.model?.getWorldDirection(front); //获取玩家角色(相机)正前方
      let b = 1;
      if (this.keyStates.KeyW) {
        b = 1;
      } else if (this.keyStates.KeyS) {
        b = -1;
      }
      this.v.add(front.multiplyScalar(b * this.a * deltaTime));
    }
    if (this.keyStates.KeyA || this.keyStates.KeyD) {
      const front = new THREE.Vector3();
      this.model?.getWorldDirection(front);
      const up = new THREE.Vector3(0, 1, 0); //y方向

      const left = up.clone().cross(front);
      let b = 1;
      if (this.keyStates.KeyA) {
        //向左运动
        b = 1;
      } else if (this.keyStates.KeyD) {
        b = -1;
      }
      this.v.add(left.multiplyScalar(b * this.a * deltaTime));
    }
    this.v.addScaledVector(this.v, this.damping); //阻尼减速
    const deltaPos = this.v.clone().multiplyScalar(deltaTime);
    this.model.position.add(deltaPos); //更新玩家角色的位置
    this.mixer?.update(deltaTime);
    this.playerUpdate(deltaTime);
  }
}
const mythree = new MyThree(document.getElementById('threeContainer') as HTMLElement);
mythree.initThree();
mythree.init();
