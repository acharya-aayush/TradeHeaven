import { 
  BarChart3, 
  Home, 
  LineChart, 
  ListOrdered, 
  PieChart, 
  UserCircle, 
  Bell, 
  Settings,
  BookOpen,
  Wallet,
  Heart,
  Users,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
  SidebarFooter
} from "@/components/ui/sidebar";

// Navigation items
const primaryNavItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Markets",
    url: "/markets",
    icon: LineChart,
  },
  {
    title: "Portfolio",
    url: "/portfolio",
    icon: PieChart,
  },
  {
    title: "Orders",
    url: "/orders",
    icon: ListOrdered,
  },
  {
    title: "Watchlist",
    url: "/watchlist",
    icon: Heart,
  },
];

const secondaryNavItems = [
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Account",
    url: "/account",
    icon: UserCircle,
  },
  {
    title: "Wallet",
    url: "/wallet",
    icon: Wallet,
  },
  {
    title: "Education",
    url: "/education",
    icon: BookOpen,
  },
  {
    title: "About Us",
    url: "/about-us",
    icon: Users,
  },
];

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, isDemoMode } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center p-2">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-primary">
            <LineChart className="h-6 w-6" />
            <span>TradeHeaven</span>
          </Link>
          <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {user && (
          <div className="px-4 py-2 mb-2">
            <div className="text-sm font-medium">Welcome,</div>
            <div className="font-semibold">{user.username}</div>
            {isDemoMode && (
              <Badge variant="outline" className="mt-1 bg-amber-50 text-amber-600 border-amber-200 text-xs flex items-center gap-1 w-fit">
                <AlertCircle className="h-3 w-3" />
                Demo Mode
              </Badge>
            )}
          </div>
        )}
        
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {primaryNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    // Highlight active menu item
                    data-active={location.pathname === item.url}
                    className="data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    data-active={location.pathname === item.url}
                    className="data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2 flex justify-around">
          <Link to="/notifications" className="p-2 rounded-md hover:bg-sidebar-accent">
            <Bell className="h-5 w-5" />
          </Link>
          <Link to="/settings" className="p-2 rounded-md hover:bg-sidebar-accent">
            <Settings className="h-5 w-5" />
          </Link>
          <button 
            onClick={handleLogout} 
            className="p-2 rounded-md hover:bg-sidebar-accent text-red-500"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
        {isDemoMode && (
          <div className="p-2 border-t text-center">
            <p className="text-xs text-amber-600">Running in Demo Mode</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
