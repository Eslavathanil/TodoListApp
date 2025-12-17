import { Button } from '@/components/ui/button';
import { Menu, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export const MobileHeader = ({ onMenuClick }: MobileHeaderProps) => {
  return (
    <header className="sticky top-0 z-30 lg:hidden bg-background/95 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="h-9 w-9"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">TaskFlow</span>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};
