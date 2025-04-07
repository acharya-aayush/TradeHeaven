import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, getToken, getUser, setToken, setUser, removeToken, removeUser, getCurrentUser } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Check for existing token and user on initial load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getToken();
      const storedUser = getUser();
      
      // Check if user is in demo mode
      const demoMode = localStorage.getItem('demoMode') === 'true';
      setIsDemoMode(demoMode);
      
      if (storedToken) {
        setTokenState(storedToken);
        
        // If we have a token but no user, try to fetch user data
        if (!storedUser) {
          try {
            // Skip API call if in demo mode
            if (demoMode) {
              const demoUser = JSON.parse(localStorage.getItem('demoUser') || '{}');
              if (demoUser.id) {
                setUserState(demoUser);
              } else {
                // Clear token if demo user data is invalid
                removeToken();
                setTokenState(null);
                setIsDemoMode(false);
                localStorage.removeItem('demoMode');
                localStorage.removeItem('demoUser');
              }
            } else {
              const response = await getCurrentUser(storedToken);
              if (response.user) {
                setUserState(response.user);
                setUser(response.user);
              } else {
                // If user fetch fails, clear token
                removeToken();
                setTokenState(null);
              }
            }
          } catch (error) {
            // If user fetch fails, clear token
            removeToken();
            setTokenState(null);
          }
        } else {
          setUserState(storedUser);
        }
      }
      
      setIsLoading(false);
    };
    
    initAuth();
  }, []);

  // Login user
  const login = (newToken: string, newUser: User) => {
    // Check if this is a demo login
    const isDemo = newToken.startsWith('demo-');
    setIsDemoMode(isDemo);
    
    // Store demo state if applicable
    if (isDemo) {
      localStorage.setItem('demoMode', 'true');
      localStorage.setItem('demoUser', JSON.stringify(newUser));
      
      // Initialize wallet for demo user if not exists
      if (!localStorage.getItem('tradeheaven_wallet')) {
        const mockWallet = {
          user_id: newUser.id,
          balance: 100000,
          collateral_locked: 0
        };
        localStorage.setItem('tradeheaven_wallet', JSON.stringify(mockWallet));
      }
    } else {
      localStorage.removeItem('demoMode');
      localStorage.removeItem('demoUser');
    }
    
    setToken(newToken);
    setUser(newUser);
    setTokenState(newToken);
    setUserState(newUser);
  };

  // Logout user
  const logout = () => {
    removeToken();
    removeUser();
    setTokenState(null);
    setUserState(null);
    setIsDemoMode(false);
    localStorage.removeItem('demoMode');
    localStorage.removeItem('demoUser');
    // Don't remove wallet data on logout to persist wallet state
  };

  // Context value
  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    isDemoMode,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 