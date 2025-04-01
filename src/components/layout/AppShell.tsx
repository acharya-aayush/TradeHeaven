
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import { Toaster } from '@/components/ui/toaster';
import TopNav from './TopNav';
import ServerStatusBanner from './ServerStatusBanner';

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <TopNav />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <ServerStatusBanner />
            {children}
          </main>
        </div>
        <Toaster />
      </div>
    </SidebarProvider>
  );
};

export default AppShell;
