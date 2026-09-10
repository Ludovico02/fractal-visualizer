import { Settings, Play, Pause, Share, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { COLOR_PALETTES } from "@/constants/palettes";

interface HUDProps {
  isAnimated: boolean;
  onToggleAnimation: () => void;
  onBackToMenu: () => void;
  currentPaletteId: string;
  onChangePalette: (id: string) => void;
}

export function HUD({
  isAnimated,
  onToggleAnimation,
  onBackToMenu,
  currentPaletteId,
  onChangePalette,
}: HUDProps) {
  const currentPalette = COLOR_PALETTES[currentPaletteId];

  const handleShare = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  return (
    <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Open fractal menu"
          render={
            <Button
              variant="outline"
              size="icon"
              className="border-input bg-background/80 text-foreground hover:bg-accent hover:text-accent-foreground backdrop-blur-sm"
            >
              <Settings className="h-5 w-5" />
            </Button>
          }
        />

        <DropdownMenuContent
          align="end"
          className="w-48 border-border bg-popover text-popover-foreground"
        >
          <DropdownMenuItem
            onClick={onToggleAnimation}
            className="cursor-pointer focus:bg-accent focus:text-accent-foreground"
          >
            {isAnimated ? (
              <>
                <Pause className="mr-2 h-4 w-4" /> Pause Animation
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" /> Start Animation
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleShare}
            className="cursor-pointer focus:bg-accent focus:text-accent-foreground"
          >
            <Share className="mr-2 h-4 w-4" /> Share Link
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-border" />

          <DropdownMenuItem
            onClick={onBackToMenu}
            className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Menu
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" className="gap-2">
            <Palette className="h-4 w-4" />
            {currentPalette?.name || "Color Palette"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {Object.values(COLOR_PALETTES).map((palette) => (
            <DropdownMenuItem
              key={palette.id}
              onClick={() => onChangePalette(palette.id)}
              className={currentPaletteId === palette.id ? "bg-accent" : ""}
            >
              {palette.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
