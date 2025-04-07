import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, InfoIcon } from 'lucide-react';
import { register, RegisterParams } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login: authLogin } = useAuth();

  const validateForm = () => {
    if (!username || !email || !password || !confirmPassword) {
      setError('Username, email, and password are required');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Map form fields to match server-side field names
      const registerData: RegisterParams = {
        username,
        email,
        password,
        fullName, // Maps to full_name in the backend
        phoneNumber, // Maps to phone_number in the backend
        dateOfBirth, // Maps to date_of_birth in the backend
        country
      };
      
      // Don't send empty values
      if (!registerData.fullName) delete registerData.fullName;
      if (!registerData.phoneNumber) delete registerData.phoneNumber;
      if (!registerData.dateOfBirth) delete registerData.dateOfBirth;
      if (!registerData.country) delete registerData.country;
      
      // Try the actual registration
      const response = await register(registerData);
      
      // If registration fails due to server issues, use mock registration
      if (response.error && (
          response.error.includes('connect to server') || 
          response.error.includes('timed out') ||
          response.error.includes('Network error'))) {
        console.log('Server connection failed, using mock registration');
        
        // Create a mock user
        const mockUser = {
          id: `user-${Date.now()}`,
          username: username,
          email: email,
          full_name: fullName || 'New User',
          created_at: new Date().toISOString()
        };
        
        // Mock token
        const mockToken = `demo-token-${Date.now()}`;
        
        // Update auth context with mock data
        authLogin(mockToken, mockUser);
        
        toast({
          title: 'Registration Successful (Demo Mode)',
          description: 'Welcome to TradeHeaven! Your account has been created in demo mode. You can explore the app with simulated data.'
        });
        
        // Redirect to dashboard
        navigate('/');
        return;
      }
      
      if (response.error) {
        setError(response.error || 'Registration failed. Please try again.');
        return;
      }
      
      if (!response.token || !response.user) {
        setError('Registration failed. Server returned an invalid response.');
        return;
      }
      
      // Update auth context
      authLogin(response.token, response.user);
      
      toast({
        title: 'Registration Successful',
        description: 'Welcome to TradeHeaven! Your account has been created with zero balance. You can load funds in the wallet section.'
      });
      
      // Redirect to dashboard
      navigate('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'An error occurred during registration. Please try again later.');
      
      // If there was an exception, offer demo mode
      setError('Registration server error. You can try the Demo Mode option from the login page to test the application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">TradeHeaven</h1>
          <p className="text-muted-foreground">Create a new trading account</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Create your TradeHeaven account</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Alert variant="default" className="bg-muted">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>New Account Information</AlertTitle>
                <AlertDescription>
                  New accounts start with zero balance. You'll need to load funds from the wallet section after registering.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username*</Label>
                <Input
                  id="username"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email*</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name*</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Country of Residence</Label>
                <Input
                  id="country"
                  placeholder="Enter your country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password*</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password*</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              
              <p className="text-sm text-muted-foreground">Fields marked with * are required</p>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Register'}
              </Button>
              
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Log in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register; 