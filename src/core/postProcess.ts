import {
  MotionBlurPostProcess,
  Scene,
  UniversalCamera,
} from "@babylonjs/core";

export const applyPost = (camera: UniversalCamera, scene: Scene) => {
  const mb = new MotionBlurPostProcess("mb", scene, 1.0, camera);
  mb.motionStrength = 1;
};
