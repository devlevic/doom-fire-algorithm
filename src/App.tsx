import { useEffect, useRef, useState } from "react";
import { fireDoom, FireDoomMethods } from "./components/fireMethods";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [control, setControl] = useState({} as FireDoomMethods);
  const [requestId, setRequestId] = useState(0);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  function startLoop() {
    if (!ctx) return;
    control.renderFireCanvas({
      ctx,
      canvasWidth: ctx.canvas.width,
      canvasHeight: ctx.canvas.height,
    });

    control.updateFireStructure();
    const animationId = requestAnimationFrame(startLoop);
    setRequestId(animationId);
  }

  function start() {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const FIRE_DOOM = fireDoom({
      size: 3,
      source: [],
      direction: 1,
      fireWidth: 50,
      fireHeight: 50,
      color: "red",
    });
    setControl(FIRE_DOOM);
    setCtx(ctx);
  }

  useEffect(() => {
    start();
  }, []);

  useEffect(() => {
    if (Object.entries(control).length < 1) return;
    control.createFireStructure();
    control.createFireSource();
    startLoop();
    return () => cancelAnimationFrame(requestId);
  }, [control]);

  return (
    <main className="w-full h-full bg-black flex justify-center items-center">
      <div>
        <h1 className="text-white text-7xl">Doom Fire Algorithm</h1>
        <div className="flex gap-4">
          <canvas
            ref={canvasRef}
            className="w-[400px] h-[400px] border"
          ></canvas>
          <input
            style={{
              WebkitAppearance: "slider-vertical",
            }}
            className="w-[10px]"
            type="range"
            min="0"
            max="6"
            step="1"
            defaultValue={3}
            onChange={({ target }) =>
              control.setNewSize(8 - parseInt(target.value))
            }
          />
        </div>
        <div className="mt-4 rounded gap-[8px] grid grid-cols-4">
          <button
            className="border border-white text-white rounded"
            onClick={() => control.createFireSource()}
          >
            Start
          </button>
          <button
            className="border border-white text-white rounded"
            onClick={() => control.stopFireSource()}
          >
            Stop
          </button>
          <select
            className="border border-white rounded text-white bg-black appearance-none text-center"
            onChange={({ target }) =>
              control.setNewColor(target.value as unknown as any)
            }
          >
            <option>red</option>
            <option>green</option>
            <option>blue</option>
          </select>
          <select
            className="border border-white rounded text-white bg-black appearance-none text-center"
            onChange={({ target }) =>
              control.setNewDirection(parseInt(target.value) as unknown as any)
            }
          >
            <option value={1}>left</option>
            <option value={0}>right</option>
            <option value={2}>center</option>
          </select>
        </div>
      </div>
    </main>
  );
}

export default App;
