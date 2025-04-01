
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bell, User } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

// Mock notifications
const mockNotifications = [
  {
    id: 'notif-1',
    title: 'AAPL hits 52-week high',
    description: 'Apple stock reached $185.25, a new 52-week high',
    isRead: false,
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    type: 'price-high'
  },
  {
    id: 'notif-2',
    title: 'TSLA drops 3.5%',
    description: 'Tesla is down 3.5% today after quarterly earnings',
    isRead: false,
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    type: 'price-drop'
  },
  {
    id: 'notif-3',
    title: 'Order placed: MSFT',
    description: 'Buy order for 10 shares of MSFT at $342.88 was executed',
    isRead: true,
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    type: 'order-placed'
  },
  {
    id: 'notif-4',
    title: 'Order sold: GOOGL',
    description: 'Sell order for 5 shares of GOOGL at $138.45 was executed',
    isRead: true,
    timestamp: new Date(Date.now() - 240 * 60000).toISOString(),
    type: 'order-sold'
  }
];

const TopNav = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { toast } = useToast();

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Mark notifications as read when dropdown is opened
  const handleNotificationOpen = (open: boolean) => {
    setIsNotificationOpen(open);
    if (open && unreadCount > 0) {
      // Mark all as read
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
    }
  };

  // Format relative time (e.g., "5 minutes ago")
  const getRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffMinutes < 1440) {
      const hours = Math.floor(diffMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    
    const days = Math.floor(diffMinutes / 1440);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  // Simulate receiving a new notification
  useEffect(() => {
    const notificationTypes = [
      {
        type: 'price-high',
        title: 'NVDA hits new high',
        description: 'NVIDIA stock reached $860.05, a new all-time high'
      },
      {
        type: 'price-drop',
        title: 'JPM drops 2.1%',
        description: 'JPMorgan is down 2.1% following market concerns'
      },
      {
        type: 'order-placed',
        title: 'Order placed: AMZN',
        description: 'Buy order for 3 shares of AMZN at $178.25 was executed'
      },
      {
        type: 'order-sold',
        title: 'Order sold: META',
        description: 'Sell order for 2 shares of META at $465.78 was executed'
      }
    ];

    // Show a demo notification after 10 seconds
    const timer = setTimeout(() => {
      const randomNotif = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
      
      // Add to notifications list
      const newNotif = {
        id: `notif-${Date.now()}`,
        title: randomNotif.title,
        description: randomNotif.description,
        isRead: false,
        timestamp: new Date().toISOString(),
        type: randomNotif.type as 'price-high' | 'price-drop' | 'order-placed' | 'order-sold'
      };
      
      setNotifications(prev => [newNotif, ...prev]);
      
      // Show toast notification
      toast({
        title: randomNotif.title,
        description: randomNotif.description,
      });
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <div className="border-b px-4 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 w-full max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search TradeHeaven..." 
              className="pl-8 bg-background w-full"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu open={isNotificationOpen} onOpenChange={handleNotificationOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    className="absolute top-0 right-0 h-4 w-4 p-0 flex items-center justify-center text-[10px] font-bold bg-destructive text-destructive-foreground" 
                    variant="destructive"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex justify-between items-center">
                <span>Notifications</span>
                {notifications.length > 0 && (
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    Mark all as read
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {notifications.length === 0 ? (
                <div className="py-4 text-center text-muted-foreground">
                  No notifications
                </div>
              ) : (
                <div className="max-h-[400px] overflow-auto">
                  {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="cursor-default flex flex-col items-start py-3 px-4 hover:bg-accent focus:bg-accent">
                      <div className="flex w-full justify-between items-start">
                        <span className={cn("font-medium", !notification.isRead && "text-primary")}>{notification.title}</span>
                        <span className="text-[11px] text-muted-foreground ml-2">
                          {getRelativeTime(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer justify-center font-medium">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
