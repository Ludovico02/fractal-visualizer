import { Settings, Play, Pause, Share, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HUDProps {
  isAnimated: boolean;
  onToggleAnimation: () => void;
  onBackToMenu: () => void;
}

export function HUD({ isAnimated, onToggleAnimation, onBackToMenu }: HUDProps) {
  const handleShare = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  return (
    <div className="absolute top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button 
            variant="outline" 
            size="icon" 
            className="border-input bg-background/80 text-foreground hover:bg-accent hover:text-accent-foreground backdrop-blur-sm"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-48 border-border bg-popover text-popover-foreground">
          <DropdownMenuItem 
            onClick={onToggleAnimation}
            className="cursor-pointer focus:bg-accent focus:text-accent-foreground"
          >
            {isAnimated ? (
              <><Pause className="mr-2 h-4 w-4" /> Pause Animation</>
            ) : (
              <><Play className="mr-2 h-4 w-4" /> Start Animation</>
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
    </div>
  );
}