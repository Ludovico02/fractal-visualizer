import { useEffect, useState } from "react";
import createFractalEngine from "../../engine/engine.js"
import wasmUrl from "../../engine/engine.wasm?url"

export default function useWasm() {
  const [wasmModule, setWasmModule] = useState<any>(null);

  useEffect(() => {
    const initWasm = async () => {
      try {
        const module = await createFractalEngine({
          locateFile: () => wasmUrl
        });

        console.log("Webassembly engine loaded successfully!");
        setWasmModule(module);
      } catch (error) {
        console.error("Failed to load webassembly engine:", error);
      }
    }

    initWasm();
  }, []);

  return wasmModule;
}