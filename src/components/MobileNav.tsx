import { Home, Calendar, FolderKanban, User, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  items?: Array<{ icon: any; label: string; path: string }>;
}

export function MobileNav({ items }: MobileNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const defaultItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: FolderKanban, label: 'Projects', path: '/projects' },
    { icon: User, label: 'Account', path: '/dashboard/account' },
  ];

  const navItems = items || defaultItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 transition-colors',
                isActive ? 'text-amber-600' : 'text-gray-600'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
