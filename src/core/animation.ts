import { UniversalCamera, Scene, Vector3, Animation } from "@babylonjs/core";

export const animateFovExpand = (camera: UniversalCamera, scene: Scene) => {
  const keys = [
    { frame: 0, value: camera.fov },
    { frame: 180, value: camera.fov * 2 },
  ];

  const animation = new Animation(
    "fovAnimation",
    "fov",
    60,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CONSTANT
  );
  animation.setKeys(keys);

  // Attach the animation to the camera
  camera.animations.push(animation);
  scene.beginAnimation(camera, 0, 120, false);
};

export const animateCameraHoverAway = (
  camera: UniversalCamera,
  scene: Scene,
  targetPosition: Vector3,
  distance: number
) => {
  const startPosition = camera.position.clone();
  const endPosition = targetPosition.add(
    camera.position.subtract(targetPosition).normalize().scale(distance)
  );

  const keys = [
    { frame: 0, value: startPosition },
    { frame: 180, value: endPosition },
  ];

  const animation = new Animation(
    "cameraHoverAnimation",
    "position",
    60,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_CONSTANT
  );
  animation.setKeys(keys);

  camera.animations.push(animation);
  scene.beginAnimation(camera, 0, 180, false, 1, () => {
    camera.lockedTarget = null;
    camera.speed = 0.1;
  });
};
