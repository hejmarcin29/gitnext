'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User, Settings, LogOut, Home } from 'lucide-react';
import { toast } from 'sonner';

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MobileNavigationProps {
  role: 'ADMIN' | 'MONTAZYSTA';
  userEmail: string;
}

export function MobileNavigation({ role, userEmail }: MobileNavigationProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Wylogowanie nie powiodło się');
      }

      router.replace('/login');
    } catch (error) {
      toast.error('Błąd wylogowania');
      console.error('Logout error:', error);
    }
  };

  const navigationItems: NavigationItem[] = React.useMemo(() => {
    if (role === 'ADMIN') {
      return [
        { href: '/panel-admin', label: 'Panel Admin', icon: Settings },
        { href: '/dashboard', label: 'Dashboard', icon: Home },
      ];
    }
    return [
      { href: '/panel-montazysty', label: 'Moje Montaże', icon: Settings },
      { href: '/dashboard', label: 'Dashboard', icon: Home },
    ];
  }, [role]);

  return (
    <>
      {/* Desktop Navigation - Hidden on mobile */}
      <nav className="hidden md:flex items-center space-x-4">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
              pathname === item.href ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
            }`}
          >
            {item.label}
          </Link>
        ))}
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Wyloguj
        </Button>
      </nav>

      {/* Mobile Navigation - Sheet with hamburger */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden h-11 w-11 p-0"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Otwórz menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[280px] sm:w-[350px]">
          <SheetHeader>
            <SheetTitle className="text-left">Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col space-y-2 mt-6">
            {/* User info */}
            <div className="flex items-center space-x-3 px-3 py-3 bg-muted rounded-lg mb-4">
              <User className="h-5 w-5 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-sm font-medium truncate">{userEmail}</span>
                <span className="text-xs text-muted-foreground">{role}</span>
              </div>
            </div>

            {/* Navigation links */}
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                    pathname === item.href ? 'bg-accent text-accent-foreground' : ''
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Logout button */}
            <Button
              variant="ghost"
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
              className="flex items-center space-x-3 px-3 py-3 h-auto justify-start"
            >
              <LogOut className="h-5 w-5" />
              <span>Wyloguj</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}