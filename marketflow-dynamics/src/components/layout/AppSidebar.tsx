
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
  Users
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

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
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
