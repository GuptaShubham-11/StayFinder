import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

import { useAuthStore } from '@/store/authStore';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import {
  TreePalm,
  Heart,
  PlusCircle,
  LogOut,
  User,
  ListCheck,
  MapPinHouse,
} from 'lucide-react';
import { userApi } from '@/api/userApi';
import { toast } from 'sonner';
import { useState } from 'react';
import Spinner from './Spinner';

const sidebarLinks = {
  user: [
    {
      label: 'Home',
      href: '/listings',
      icon: <MapPinHouse className="w-5 h-5" />,
    },
    {
      label: 'My Trips',
      href: '/bookings/user-bookings',
      icon: <TreePalm className="w-5 h-5" />,
    },
    {
      label: 'Wishlists',
      href: '/wishlists',
      icon: <Heart className="w-5 h-5" />,
    },
  ],
  host: [
    {
      label: 'Home',
      href: '/listings',
      icon: <MapPinHouse className="w-5 h-5" />,
    },
    {
      label: 'My Trips',
      href: '/bookings/user-bookings',
      icon: <TreePalm className="w-5 h-5" />,
    },
    {
      label: 'Wishlists',
      href: '/wishlists',
      icon: <Heart className="w-5 h-5" />,
    },
    {
      label: 'Host Listings',
      href: '/listings/host-listings',
      icon: <ListCheck className="w-5 h-5" />,
    },
    {
      label: 'Create Listing',
      href: '/listings/create-listing',
      icon: <PlusCircle className="w-5 h-5" />,
    },
  ],
};

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const links = sidebarLinks[user?.role as 'user' | 'host'] || [];
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await userApi.signOut();
      if (response.statusCode < 400) {
        toast.success('Logged out successfully!');
        logout();
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside className="flex flex-col justify-between h-screen w-16 sm:w-20 fixed top-0 left-0 bg-background border-r border-border z-40 p-3 sm:p-4">
      {/* Top Navigation */}
      <TooltipProvider>
        <nav className="space-y-4">
          {links.map((link) => (
            <Tooltip key={link.href}>
              <TooltipTrigger asChild>
                <Link
                  to={link.href}
                  className={clsx(
                    'flex items-center justify-center p-2 sm:p-3 rounded-md transition-colors',
                    location.pathname === link.href
                      ? 'bg-acc text-white'
                      : 'hover:bg-acc hover:text-white'
                  )}
                >
                  {link.icon}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-sm">
                {link.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </TooltipProvider>

      {/* User Account Popover */}
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <button className="mt-6 flex items-center justify-center p-2 sm:p-3 rounded-md hover:bg-acc hover:text-white transition-colors">
                <User className="w-5 h-5" />
              </button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-sm">
            Account
          </TooltipContent>
        </Tooltip>

        <PopoverContent align="start" className="w-60 p-4 space-y-3">
          <div className="space-y-1 text-sm">
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium break-all">{user?.email || 'N/A'}</p>
            </div>
            <Button
              variant="destructive"
              className="w-full mt-2"
              onClick={handleLogout}
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </>
              )}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </aside>
  );
}
