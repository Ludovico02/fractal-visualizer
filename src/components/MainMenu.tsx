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

interface MainMenuProps {
  onStart: (config: RenderConfig) => void;
}

export function MainMenu({ onStart }: MainMenuProps) {
  const [selectedFractal, setSelectedFractal] =
    useState<FractalId>("mandelbrot");
  const [isAnimated, setIsAnimated] = useState<boolean>(true);

  const handleStart = () => {
    onStart({ fractalId: selectedFractal, isAnimated });
  };

  const currentFractal = FRACTAL_PRESETS[selectedFractal];

  return (
    <div className="dark flex min-h-screen items-center justify-center bg-background p-4 font-sans text-foreground">
      <Card className="w-full max-w-md border-border bg-card shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl tracking-tight text-foreground">
            Fractal Visualizer
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Select a mathematical set and rendering options to begin
            visualization.
          </CardDescription>
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
