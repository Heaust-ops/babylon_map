import { GPUParticleSystem, Scene, Texture, Vector3 } from "@babylonjs/core";

export const initParticles = (scene: Scene) => {
  const particles = new GPUParticleSystem(
    "particles",
    { capacity: 500 },
    scene
  );
  particles.particleTexture = new Texture("/flare.png", scene);
  particles.emitter = Vector3.Zero();

  particles.minEmitBox = new Vector3(-3, 0, -3);
  particles.maxEmitBox = new Vector3(3, 8, 3);
  particles.maxSize = 0.05;
  particles.minSize = 0.01;

  particles.maxLifeTime = 1;

  particles.emitRate = 3;

  particles.start();
};
