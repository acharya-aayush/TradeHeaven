import React, { useState, useEffect } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Shield, Key, CreditCard, UserCircle, Lock, Bell, ArrowRight, CheckCircle, AlertCircle, Info as InfoIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { updateUserProfile, User } from '@/services/authService';

const Account = () => {
  const { toast } = useToast();
  const { user, token, login } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    country: ''
  });
  
  // Password fields
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.full_name || '',
        email: user.email || '',
        phoneNumber: user.phone_number || '',
        dateOfBirth: user.date_of_birth || '',
        country: user.country || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordData(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }
      
      const userData = {
        full_name: formData.fullName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        date_of_birth: formData.dateOfBirth,
        country: formData.country
      };
      
      const result = await updateUserProfile(token, userData);
      
      if (result.error) {
        setError(result.error);
        return;
      }
      
      if (result.user) {
        // Update the user context
        login(token, result.user as User);
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile changes have been saved successfully."
      });
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.message || 'An error occurred while updating your profile.');
    } finally {
      setLoading(false);
    }
  };

  // Placeholder for password update
  const handleUpdatePassword = () => {
    // Password validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    // Show success message for now (actual implementation would require backend support)
    toast({
      title: "Password updated",
      description: "Your password has been updated successfully."
    });
    
    // Clear password fields
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Account</h1>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-4 mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    value={formData.fullName} 
                    onChange={handleInputChange} 
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input 
                    id="phoneNumber" 
                    value={formData.phoneNumber} 
                    onChange={handleInputChange} 
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input 
                    id="dateOfBirth" 
                    type="date" 
                    value={formData.dateOfBirth} 
                    onChange={handleInputChange} 
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country of Residence</Label>
                  <Input 
                    id="country" 
                    value={formData.country} 
                    onChange={handleInputChange} 
                    disabled={loading}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveChanges} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Linked Accounts</CardTitle>
                <CardDescription>Manage external account connections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center gap-3">
                    <UserCircle className="h-8 w-8 text-blue-500" />
                    <div>
                      <h4 className="font-medium">Google</h4>
                      <p className="text-sm text-muted-foreground">john.doe@gmail.com</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Disconnect</Button>
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-8 w-8 text-purple-500" />
                    <div>
                      <h4 className="font-medium">Bank Account</h4>
                      <p className="text-sm text-muted-foreground">Chase • ****4567</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
                
                <Button variant="outline" className="w-full">
                  <p>Connect New Account</p>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Password Management</CardTitle>
                <CardDescription>Update your password regularly for better security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleUpdatePassword}>Update Password</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between border p-4 rounded-md">
                  <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-green-500" />
                    <div>
                      <h4 className="font-medium">Authenticator App</h4>
                      <p className="text-sm text-muted-foreground">Not configured</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Setup</Button>
                </div>
                
                <div className="flex items-center justify-between border p-4 rounded-md">
                  <div className="flex items-center gap-3">
                    <Key className="h-8 w-8 text-amber-500" />
                    <div>
                      <h4 className="font-medium">SMS Authentication</h4>
                      <p className="text-sm text-muted-foreground">Not configured</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Setup</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Manage your login sessions across devices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between border p-4 rounded-md">
                  <div>
                    <h4 className="font-medium">Current Device • MacBook Pro</h4>
                    <p className="text-sm text-muted-foreground">Los Angeles, CA • Last active now</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Current</span>
                </div>
                
                <div className="flex items-center justify-between border p-4 rounded-md">
                  <div>
                    <h4 className="font-medium">iPhone 13 Pro • Safari</h4>
                    <p className="text-sm text-muted-foreground">Los Angeles, CA • Last active 3 hours ago</p>
                  </div>
                  <Button variant="outline" size="sm">Logout</Button>
                </div>
                
                <div className="flex items-center justify-between border p-4 rounded-md">
                  <div>
                    <h4 className="font-medium">Windows PC • Chrome</h4>
                    <p className="text-sm text-muted-foreground">New York, NY • Last active 2 days ago</p>
                  </div>
                  <Button variant="outline" size="sm">Logout</Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="destructive">Logout of All Devices</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Customize how you receive alerts and updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Account Notifications</h4>
                  
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">Security Alerts</p>
                      <p className="text-sm text-muted-foreground">Login attempts, password changes, etc.</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs">Email</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs">Push</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">Account Updates</p>
                      <p className="text-sm text-muted-foreground">Profile changes, linked accounts, etc.</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs">Email</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Trading Notifications</h4>
                  
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">Price Alerts</p>
                      <p className="text-sm text-muted-foreground">Alerts for price changes in your watchlists</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs">Email</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs">Push</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">Order Status</p>
                      <p className="text-sm text-muted-foreground">Updates on your order status</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs">Email</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs">Push</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="verification" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Verification</CardTitle>
                <CardDescription>Complete verification steps to unlock additional features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
                  <InfoIcon className="h-5 w-5 text-blue-500" />
                  <AlertTitle>Verification Required</AlertTitle>
                  <AlertDescription>
                    Complete identity verification to unlock higher trading limits and additional features.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between border p-4 rounded-md">
                    <div className="flex items-center gap-3">
                      <UserCircle className="h-8 w-8 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Basic Information</h4>
                        <p className="text-sm text-green-600">Completed</p>
                      </div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  
                  <div className="flex items-center justify-between border p-4 rounded-md">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-8 w-8 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Identity Verification</h4>
                        <p className="text-sm text-muted-foreground">Required for trading</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Verify</Button>
                  </div>
                  
                  <div className="flex items-center justify-between border p-4 rounded-md">
                    <div className="flex items-center gap-3">
                      <Lock className="h-8 w-8 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Address Verification</h4>
                        <p className="text-sm text-muted-foreground">Required for withdrawals</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Verify</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Limits</CardTitle>
                <CardDescription>Your current trading and withdrawal limits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Daily Withdrawal Limit</span>
                      <span className="font-medium">$5,000 / $10,000</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: '50%' }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Complete advanced verification to increase limits</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Trading Limit</span>
                      <span className="font-medium">$25,000 / $100,000</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: '25%' }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Complete all verification steps to unlock full trading capacity</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
};

export default Account;
