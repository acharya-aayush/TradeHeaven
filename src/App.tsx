import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { WalletProvider } from "@/contexts/WalletContext";
import { AuthProvider } from "@/hooks/useAuth";
import PrivateRoute from "@/components/auth/PrivateRoute";
import { socketService } from "@/services/socketService";

// Pages
import AboutUs from "./pages/AboutUs";
import Account from "./pages/Account";
import Analytics from "./pages/Analytics";
import Education from "./pages/Education";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Markets from "./pages/Markets";
import NotFound from "./pages/NotFound";
import Orders from "./pages/Orders";
import Portfolio from "./pages/Portfolio";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import Wallet from "./pages/Wallet";
import Watchlist from "./pages/Watchlist";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => {
  useEffect(() => {
    // Initialize socket connection when app loads
    socketService.init();
    
    // Clean up on unmount
    return () => {
      socketService.cleanup();
    };
  }, []);

  // Tell React Router to use v7 behavior for startTransition
  // This is done by setting a flag in localStorage that React Router checks
  useEffect(() => {
    localStorage.setItem('react-router-future-v7_startTransition', 'true');
    localStorage.setItem('react-router-future-v7_relativeSplatPath', 'true');
    
    return () => {
      localStorage.removeItem('react-router-future-v7_startTransition');
      localStorage.removeItem('react-router-future-v7_relativeSplatPath');
    };
  }, []);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <WalletProvider>
            <TooltipProvider>
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  
                  {/* Protected routes */}
                  <Route path="/" element={<PrivateRoute><Index /></PrivateRoute>} />
                  <Route path="/markets" element={<PrivateRoute><Markets /></PrivateRoute>} />
                  <Route path="/portfolio" element={<PrivateRoute><Portfolio /></PrivateRoute>} />
                  <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
                  <Route path="/watchlist" element={<PrivateRoute><Watchlist /></PrivateRoute>} />
                  <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
                  <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
                  <Route path="/wallet" element={<PrivateRoute><Wallet /></PrivateRoute>} />
                  <Route path="/education" element={<PrivateRoute><Education /></PrivateRoute>} />
                  <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
              <Toaster />
            </TooltipProvider>
          </WalletProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
