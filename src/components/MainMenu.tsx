import { useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { FRACTAL_PRESETS } from "@/constants/fractals";
import type { RenderConfig, FractalId } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { COLOR_PALETTES } from "@/constants/palettes";

interface MainMenuProps {
  onStart: (config: RenderConfig) => void;
}

export function MainMenu({ onStart }: MainMenuProps) {
  const [selectedFractal, setSelectedFractal] =
    useState<FractalId>("mandelbrot");
  const [isAnimated, setIsAnimated] = useState<boolean>(true);
  const [selectedPalette, setSelectedPalette] = useState<string>("ocean");

  const selectedPaletteName =
    COLOR_PALETTES[selectedPalette]?.name ?? "Deep Ocean";

  const handleStart = () => {
    onStart({
      fractalId: selectedFractal,
      isAnimated,
      paletteId: selectedPalette,
    });
  };

  const currentFractal = FRACTAL_PRESETS[selectedFractal];

  return (
    <div className="dark flex min-h-screen items-center justify-center bg-background p-4 font-sans text-foreground">
      <Card className="w-full max-w-md border-border bg-card shadow-2xl">
        <CardHeader className="flex flex-row items-start justify-between pb-6">
          <div className="space-y-1.5">
            <CardTitle className="text-3xl tracking-tight text-foreground">
              Fractal Visualizer
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Select a mathematical set and rendering options to begin
              visualization.
            </CardDescription>
          </div>

          <a
            href="https://github.com/Ludovico02"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground mt-1"
            title="View on GitHub"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            <span className="sr-only">GitHub Profile</span>
          </a>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Fractal Selection */}
          <div className="space-y-3">
            <Label
              htmlFor="fractal-select"
              className="text-lg font-medium text-foreground"
            >
              Fractal Type
            </Label>
            <Select
              value={selectedFractal as string}
              onValueChange={(val) => setSelectedFractal(val as FractalId)}
            >
              <SelectTrigger
                id="fractal-select"
                className="w-full border-input bg-background text-foreground"
              >
                <SelectValue placeholder="Select a fractal">
                  {currentFractal?.name ?? "Select a fractal"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="border-border bg-popover text-popover-foreground">
                {Object.values(FRACTAL_PRESETS).map((fractal) => (
                  <SelectItem
                    key={fractal.id}
                    value={fractal.id}
                    className="focus:bg-accent focus:text-accent-foreground"
                  >
                    {fractal.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Live Equation Display */}
            {currentFractal && (
              <div className="rounded-md border border-border bg-background p-3 text-center text-primary">
                <BlockMath math={currentFractal.equation} />
              </div>
            )}
          </div>

          {/* Animation Toggle */}
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <Label
                htmlFor="animation-mode"
                className="text-base font-medium text-foreground"
              >
                Animation Mode
              </Label>
              <p className="text-xs text-muted-foreground">
                Enable time-based uniform evolution
              </p>
            </div>
            <Switch
              id="animation-mode"
              checked={isAnimated}
              onCheckedChange={setIsAnimated}
              className="data-[state=checked]:bg-primary"
            />
          </div>
          <div className="mt-4 flex w-64 flex-col gap-2">
            <Label className="text-sm text-muted-foreground">
              Color Palette
            </Label>
            <Select
              value={selectedPalette}
              onValueChange={(value) => {
                if (value && value in COLOR_PALETTES) {
                  setSelectedPalette(value);
                }
              }}
            >
              <SelectTrigger className="w-full border-input bg-background text-foreground">
                <SelectValue placeholder={selectedPaletteName}>
                  {selectedPaletteName}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="border-border bg-popover text-popover-foreground">
                {Object.values(COLOR_PALETTES).map((palette) => (
                  <SelectItem
                    key={palette.id}
                    value={palette.id}
                    className="focus:bg-accent focus:text-accent-foreground"
                  >
                    {palette.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>

        <CardFooter className="bg-card py-6">
          <Button
            onClick={handleStart}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Initialize Canvas
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
