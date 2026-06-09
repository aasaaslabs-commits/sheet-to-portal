import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  LogOut, 
  FileSpreadsheet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: FileSpreadsheet, label: 'Sheets', path: '/sheets' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export const Sidebar = () => {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside className="w-64 border-r bg-card flex flex-col h-full">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <FileSpreadsheet className="w-6 h-6 text-primary" />
          <span>Sheet Reporting</span>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {sidebarItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              location.pathname === item.path
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10" 
          onClick={logout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  );
};
