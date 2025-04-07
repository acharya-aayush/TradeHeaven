import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';
import { login } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { checkServerStatus } from '@/utils/serverManager';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDevLogin, setShowDevLogin] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login: authLogin } = useAuth();

  // Check server status on mount
  useEffect(() => {
    const checkServer = async () => {
      try {
        const isRunning = await checkServerStatus();
        setShowDevLogin(!isRunning);
      } catch (error) {
        console.error('Error checking server status:', error);
        setShowDevLogin(true);
      }
    };
    
    checkServer();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await login(username, password);
      
      if (response.error) {
        setError(response.error || 'Login failed. Please check your credentials.');
        // Show demo mode option if server connection failed
        if (response.error.includes('Cannot connect to server') || 
            response.error.includes('Request timed out')) {
          setShowDevLogin(true);
        }
        return;
      }
      
      if (!response.token || !response.user) {
        setError('Login failed. Server returned an invalid response.');
        return;
      }
      
      // Update auth context
      authLogin(response.token, response.user);
      
      toast({
        title: 'Login Successful',
        description: 'Welcome back to TradeHeaven!'
      });
      
      // Redirect to dashboard
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login. Please try again.');
      setShowDevLogin(true);
    } finally {
      setLoading(false);
    }
  };
  
  // Development/Offline login for demo purposes
  const handleDevLogin = () => {
    setLoading(true);
    
    // Create a mock user
    const mockUser = {
      id: 'demo-user-1',
      username: 'demo_user',
      email: 'demo@example.com',
      full_name: 'Demo User',
      created_at: new Date().toISOString()
    };
    
    // Mock token
    const mockToken = 'demo-token-for-development-only';
    
    // Update auth context with mock data
    authLogin(mockToken, mockUser);
    
    toast({
      title: 'Development Mode',
      description: 'Logged in with demo account. Server connection not required.'
    });
    
    // Redirect to dashboard
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">TradeHeaven</h1>
          <p className="text-muted-foreground">Log in to access your trading account</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {showDevLogin && (
                <Alert variant="default" className="bg-amber-50 border-amber-200">
                  <Info className="h-4 w-4 text-amber-500" />
                  <AlertTitle>Server Connection Issue</AlertTitle>
                  <AlertDescription className="space-y-2">
                    <p>Unable to connect to authentication server.</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 border-amber-500 text-amber-700 hover:bg-amber-100"
                      onClick={handleDevLogin}
                      disabled={loading}
                    >
                      Continue in Demo Mode
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
              
              <p className="text-sm text-center text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline">
                  Register now
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login; 