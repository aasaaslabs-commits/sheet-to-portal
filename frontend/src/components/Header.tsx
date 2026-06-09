import { Search, Bell, User as UserIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';

export const Header = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur sticky top-0 z-10 px-6 flex items-center justify-between">
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search reports, sheets..." 
          className="pl-10 bg-muted/50 border-none"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
        </Button>
        
        <div className="flex items-center gap-3 pl-4 border-l">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border">
            <UserIcon className="w-4 h-4 text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
};
