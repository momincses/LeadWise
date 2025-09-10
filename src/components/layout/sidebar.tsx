// components/layout/sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/sidebar.store'; // Import store
import { BarChart, FolderKanban, Users, Settings, ChevronLeft } from 'lucide-react';

// Define navigation items
const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart },
  { href: '/leads', label: 'Leads', icon: Users },
  { href: '/campaigns', label: 'Campaigns', icon: FolderKanban },
  { href: '/profile', label: 'Profile', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggleSidebar } = useSidebarStore(); // Use store state and action

  return (
    <aside
      className={cn(
        "relative flex-shrink-0 border-r bg-card flex flex-col transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-20" // Dynamic width
      )}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-16 -right-3 z-20 p-1 rounded-full bg-primary text-primary-foreground border"
      >
        <ChevronLeft className={cn("h-4 w-4 transition-transform", !isOpen && "rotate-180")} />
      </button>

      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b">
         <h1 className={cn("text-xl font-bold transition-opacity duration-200", !isOpen && "opacity-0 w-0")}>LeadWise</h1>
         {/* Add a smaller icon-only logo here for collapsed state if desired */}
      </div>

      {/* Navigation Section */}
      <nav className="flex flex-col gap-2 p-4 pt-6">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label} // Tooltip for collapsed state
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                isActive && 'bg-muted text-primary',
                !isOpen && "justify-center" // Center icons when collapsed
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className={cn("transition-opacity", !isOpen && "opacity-0 hidden")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile (bottom) */}
      <div className="mt-auto border-t p-4">
        {/* UserProfile component will go here later */}
        <div className={cn("flex items-center gap-3", !isOpen && "justify-center")}>
           {/* Placeholder circle */}
           <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0"></div>
           <div className={cn("flex flex-col transition-opacity", !isOpen && "opacity-0 hidden")}>
               <span className="text-sm font-medium">Username</span>
               <span className="text-xs text-muted-foreground">user@email.com</span>
           </div>
        </div>
      </div>
    </aside>
  );
}