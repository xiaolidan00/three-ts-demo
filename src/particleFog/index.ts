import * as THREE from "three";

import ThreeBase from "../utils/ThreeBase";

class MyThree extends ThreeBase {
  constructor(el: HTMLElement) {
    super(el);
  }
  init() {}
  animateAction(time: number) {}
}
const mythree = new MyThree(document.getElementById("threeContainer") as HTMLElement);

mythree.init();
