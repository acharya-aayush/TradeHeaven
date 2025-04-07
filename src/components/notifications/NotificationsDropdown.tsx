
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import NotificationItem, { Notification } from './NotificationItem';
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

// Mock notifications with Nepalese companies
const mockNotifications = [
  {
    id: 'notif-1',
    title: 'NABIL hits 52-week high',
    description: 'Nabil Bank stock reached Rs. 1050.25, a new 52-week high',
    isRead: false,
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    type: 'price-high' as const
  },
  {
    id: 'notif-2',
    title: 'HTSL drops 3.5%',
    description: 'HimTech Solutions is down 3.5% today after quarterly earnings',
    isRead: false,
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    type: 'price-drop' as const
  },
  {
    id: 'notif-3',
    title: 'Order placed: SCPL',
    description: 'Buy order for 10 shares of SwasthaCare Pharmaceuticals at Rs. 645.30 was executed',
    isRead: true,
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    type: 'order-placed' as const
  },
  {
    id: 'notif-4',
    title: 'Order sold: DHL',
    description: 'Sell order for 5 shares of Digital Himalaya at Rs. 950.25 was executed',
    isRead: true,
    timestamp: new Date(Date.now() - 240 * 60000).toISOString(),
    type: 'order-sold' as const
  }
];

const NotificationsDropdown = () => {
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
        type: 'price-high' as const,
        title: 'TPL hits new high',
        description: 'Trishakti Power stock reached Rs. 535.05, a new all-time high'
      },
      {
        type: 'price-drop' as const,
        title: 'EFCL drops 2.1%',
        description: 'Everest Finance is down 2.1% following market concerns'
      },
      {
        type: 'order-placed' as const,
        title: 'Order placed: NMRL',
        description: 'Buy order for 3 shares of Namaste Motors at Rs. 525.85 was executed'
      },
      {
        type: 'order-sold' as const,
        title: 'Order sold: SCPL',
        description: 'Sell order for 2 shares of SwasthaCare Pharmaceuticals at Rs. 645.30 was executed'
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
        type: randomNotif.type
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
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
                getRelativeTime={getRelativeTime} 
              />
            ))}
          </div>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer justify-center font-medium">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
