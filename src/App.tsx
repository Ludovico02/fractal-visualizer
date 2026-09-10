import { useState } from "react";
import type { AppView, RenderConfig } from "@/types";
import { MainMenu } from "@/components/MainMenu";
import { HUD } from "@/components/HUD";
import { FractalCanvas } from "@/components/FractalCanvas";
import useWasm from "./hooks/useWasm";

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>("MENU");
  const [renderConfig, setRenderConfig] = useState<RenderConfig | null>(null);

  const engine = useWasm();

  const handleStart = (config: RenderConfig) => {
    setRenderConfig(config);
    setCurrentView("VISUALIZER");
  };

  const handleBackToMenu = () => {
    setCurrentView("MENU");
  };

  const handleToggleAnimation = () => {
    if (renderConfig) {
      setRenderConfig({
        ...renderConfig,
        isAnimated: !renderConfig.isAnimated,
      });
    }
  };

  const handleChangePalette = (paletteId: string) => {
    setRenderConfig((prev) => (prev ? { ...prev, paletteId } : null));
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {currentView === "MENU" && <MainMenu onStart={handleStart} />}

      {currentView === "VISUALIZER" && renderConfig && (
        <div className="relative h-screen w-screen overflow-hidden bg-background">
          <HUD
            isAnimated={renderConfig.isAnimated}
            onToggleAnimation={handleToggleAnimation}
            onBackToMenu={handleBackToMenu}
            currentPaletteId={renderConfig.paletteId}
            onChangePalette={handleChangePalette}
          />

          <FractalCanvas config={renderConfig} engine={engine} />
        </div>
      )}
    </div>
  );
}
