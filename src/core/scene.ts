import {
  Color3,
  Color4,
  Engine,
  Scene,
  SceneLoader,
  StandardMaterial,
  Texture,
  UniversalCamera,
  Vector3,
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { toRadian } from "./utils";
import { MapboxService } from "../services/mapbox";
import { animateFovExpand, animateCameraHoverAway } from "./animation";
import { applyPost } from "./postProcess";
import { initParticles } from "./particles";

export const getScene = (engine: Engine) => {
  const scene = new Scene(engine);
  const pi = Math.PI;
  scene.createDefaultLight();

  const fogColor = [14 / 255, 16 / 255, 24 / 255];
  scene.clearColor = new Color4(...fogColor, 1);
  scene.fogMode = Scene.FOGMODE_LINEAR;
  scene.fogColor = new Color3(...fogColor);
  scene.fogDensity = 0.4;
  scene.fogStart = 3;
  scene.fogEnd = 8;

  const camera = new UniversalCamera(
    "camera",
    new Vector3(-0.036, 1.738, 0),
    scene
  );
  camera.attachControl(true);
  camera.minZ = 0.001;
  camera.rotation.set(toRadian(15), pi, 0);
  camera.fov = toRadian(15);

  SceneLoader.ImportMesh("", "/model/", "model.gltf", scene, (nodes) => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].name === "laptop_screen") {
        MapboxService.image.onBlobUrlListeners.push((url) => {
          const lsMat = new StandardMaterial("material", scene);
          const texture = new Texture(url, scene);
          texture.vScale = -1;
          lsMat.diffuseTexture = texture;
          lsMat.emissiveColor = new Color3(1, 1, 1);
          nodes[i].material = lsMat;

          setTimeout(() => {
            camera.lockedTarget = nodes[i].position.clone();
            animateFovExpand(camera, scene);
            animateCameraHoverAway(camera, scene, new Vector3(-3, 2, 4), 1);
          }, 1000);
        });
      }
    }
    document.dispatchEvent(new Event("scene_loaded"));
  });

  initParticles(scene);
  applyPost(camera, scene);
  return scene;
};
