
import React from 'react';
import { cn } from "@/lib/utils";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export interface Notification {
  id: string;
  title: string;
  description: string;
  isRead: boolean;
  timestamp: string;
  type: 'price-high' | 'price-drop' | 'order-placed' | 'order-sold';
}

interface NotificationItemProps {
  notification: Notification;
  getRelativeTime: (timestamp: string) => string;
}

const NotificationItem = ({ notification, getRelativeTime }: NotificationItemProps) => {
  return (
    <DropdownMenuItem className="cursor-default flex flex-col items-start py-3 px-4 hover:bg-accent focus:bg-accent">
      <div className="flex w-full justify-between items-start">
        <span className={cn("font-medium", !notification.isRead && "text-primary")}>
          {notification.title}
        </span>
        <span className="text-[11px] text-muted-foreground ml-2">
          {getRelativeTime(notification.timestamp)}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
    </DropdownMenuItem>
  );
};

export default NotificationItem;
