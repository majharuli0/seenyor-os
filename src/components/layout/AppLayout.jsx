import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Users, 
  Settings, 
  UserCheck, 
  Smartphone, 
  AlertTriangle, 
  LogOut, 
  Bell, 
  Sun, 
  Moon, 
  Palette,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { Separator } from '../ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { cn } from '../../lib/utils';

import { selectUser, selectUserRole } from '../../store/slices/authSlice';
import { selectThemeMode, toggleTheme, selectCustomBranding } from '../../store/slices/themeSlice';
import { selectCurrentTenant } from '../../store/slices/tenantSlice';
import ThemeCustomizer from '../theme/ThemeCustomizer';
import RoleBasedRenderer from '../common/RoleBasedRenderer';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const AppLayout = ({ children }) => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [themeCustomizerOpen, setThemeCustomizerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const user = useSelector(selectUser);
  const userRole = useSelector(selectUserRole);
  const themeMode = useSelector(selectThemeMode);
  const currentTenant = useSelector(selectCurrentTenant);
  const customBranding = useSelector(selectCustomBranding);

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleThemeCustomizer = () => {
    setThemeCustomizerOpen(true);
  };

  // Menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      {
        key: '/dashboard',
        icon: LayoutDashboard,
        label: t('dashboard'),
      },
    ];

    // Admin-specific menu items
    if (userRole === 'admin' || userRole === 'super_admin') {
      baseItems.push(
        {
          key: '/tenants',
          icon: UserCheck,
          label: t('tenant_management'),
        },
        {
          key: '/users',
          icon: Users,
          label: t('user_management'),
        },
        {
          key: '/devices',
          icon: Smartphone,
          label: t('device_management'),
        },
        {
          key: '/alerts',
          icon: AlertTriangle,
          label: t('alerts_monitoring'),
        },
        {
          key: '/subscriptions',
          icon: Settings,
          label: t('subscriptions'),
        },
        {
          key: '/settings',
          icon: Settings,
          label: t('system_settings'),
        }
      );
    }

    // Distributor-specific menu items
    if (userRole === 'distributor') {
      baseItems.push(
        {
          key: '/resellers',
          icon: UserCheck,
          label: t('reseller_management'),
        },
        {
          key: '/devices',
          icon: Smartphone,
          label: t('device_inventory'),
        },
        {
          key: '/orders',
          icon: Settings,
          label: t('orders'),
        }
      );
    }

    // Reseller-specific menu items
    if (userRole === 'reseller') {
      baseItems.push(
        {
          key: '/customers',
          icon: Users,
          label: t('customer_management'),
        },
        {
          key: '/devices',
          icon: Smartphone,
          label: t('device_management'),
        },
        {
          key: '/sales',
          icon: Settings,
          label: t('sales_commission'),
        }
      );
    }

    return baseItems;
  };

  const handleMenuClick = (key) => {
    navigate(key);
    setMobileMenuOpen(false);
  };

  const displayName = customBranding?.companyName || currentTenant?.name || 'Seenyor OS';
  const logoSrc = customBranding?.logo;

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex h-full flex-col">
      {/* Logo/Brand */}
      <div className={cn(
        "flex items-center border-b px-4",
        collapsed && !isMobile ? "h-16 justify-center" : "h-16 justify-start"
      )}>
        {!collapsed || isMobile ? (
          <div className="flex items-center space-x-2">
            {logoSrc && (
              <img 
                src={logoSrc} 
                alt="Logo" 
                className="h-8 w-auto max-w-[120px]" 
              />
            )}
            {!logoSrc && (
              <span className="text-lg font-bold truncate">
                {displayName}
              </span>
            )}
          </div>
        ) : (
          logoSrc ? (
            <img 
              src={logoSrc} 
              alt="Logo" 
              className="h-6 w-6 object-contain" 
            />
          ) : (
            <span className="text-lg font-bold">
              {displayName.charAt(0)}
            </span>
          )
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {getMenuItems().map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.key;
          
          return (
            <Button
              key={item.key}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full",
                collapsed && !isMobile 
                  ? "justify-center px-2" 
                  : "justify-start"
              )}
              onClick={() => handleMenuClick(item.key)}
            >
              <Icon className={cn("h-4 w-4", !collapsed || isMobile ? "mr-2" : "")} />
              {(!collapsed || isMobile) && item.label}
            </Button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden md:flex md:flex-col md:border-r",
        collapsed ? "md:w-16" : "md:w-64"
      )}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent isMobile />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center space-x-2">
            {/* Mobile menu trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
            
            {/* Desktop collapse toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            
            <RoleBasedRenderer roles={['admin', 'super_admin']}>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleThemeCustomizer}
                title={t('theme_customizer')}
              >
                <Palette className="h-4 w-4" />
              </Button>
            </RoleBasedRenderer>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeToggle}
              title={t(themeMode === 'dark' ? 'switch_to_light_mode' : 'switch_to_dark_mode')}
            >
              {themeMode === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            
            <div className="relative">
              <Button variant="ghost" size="icon" title={t('notifications')}>
                <Bell className="h-4 w-4" />
              </Button>
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
              >
                5
              </Badge>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <span>{t('profile_settings')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t('preferences')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleThemeCustomizer}>
                  <Palette className="mr-2 h-4 w-4" />
                  <span>{t('theme_customizer')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>

      <ThemeCustomizer 
        open={themeCustomizerOpen}
        onClose={() => setThemeCustomizerOpen(false)}
      />
    </div>
  );
};

export default AppLayout;

