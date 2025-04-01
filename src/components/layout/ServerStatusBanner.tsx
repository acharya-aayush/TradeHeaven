
import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Server } from "lucide-react";
import { checkServerStatus } from '@/utils/serverManager';

export const ServerStatusBanner = () => {
  const [isServerRunning, setIsServerRunning] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const checkServer = async () => {
    setChecking(true);
    try {
      const status = await checkServerStatus();
      setIsServerRunning(status);
    } catch (error) {
      setIsServerRunning(false);
    } finally {
      setChecking(false);
    }
  };

  // Check server status on component mount
  useEffect(() => {
    checkServer();
    
    // Set up interval to periodically check server status
    const interval = setInterval(checkServer, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  // If we haven't checked yet or server is running, don't show anything
  if (isServerRunning === null || isServerRunning) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="flex items-center">
        <Server className="mr-2 h-4 w-4" />
        Wallet Server Offline
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-2">The wallet server is currently not running. To enable full functionality:</p>
        <ol className="list-decimal pl-5 mb-3">
          <li>Open a terminal or command prompt</li>
          <li>Navigate to your project directory</li>
          <li>Run <code className="bg-gray-200 p-1 rounded">node start-wallet-server.js</code></li>
        </ol>
        <Button 
          size="sm" 
          onClick={checkServer} 
          disabled={checking}
          className="mt-1"
        >
          {checking ? 'Checking...' : 'Check Connection'}
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ServerStatusBanner;
