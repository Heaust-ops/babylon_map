import { Engine } from "@babylonjs/core";
import { FC, RefObject, useEffect, useRef } from "react";
import { getScene } from "../core/scene";

interface BabylonCanvasProps {}

const BabylonCanvas: FC<BabylonCanvasProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useScene(canvasRef);

  return (
    <canvas style={{ width: "100%", height: "100%" }} ref={canvasRef}></canvas>
  );
};

export default BabylonCanvas;

const useScene = (canvasRef: RefObject<HTMLCanvasElement>) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = new Engine(canvas);
    const scene = getScene(engine);

    const resizeObserver = new ResizeObserver(() => {
      setTimeout(() => engine.resize(), 15);
    });
    resizeObserver.observe(canvas);

    engine.runRenderLoop(() => {
      scene.render();
    });

    return () => {
      resizeObserver.disconnect();
      engine.stopRenderLoop();
      engine.dispose();
    };
  }, [canvasRef]);
};
