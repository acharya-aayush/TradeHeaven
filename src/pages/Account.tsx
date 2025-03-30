
import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, Key, CreditCard, UserCircle, Lock, Bell, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

const Account = () => {
  const { toast } = useToast();

  const handleSaveChanges = () => {
    toast({
      title: "Profile updated",
      description: "Your profile changes have been saved successfully."
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
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="john.doe@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input id="dateOfBirth" type="date" defaultValue="1985-06-15" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country of Residence</Label>
                  <Input id="country" defaultValue="United States" />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
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
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Update Password</Button>
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
                      <p className="text-sm text-muted-foreground">Enabled • Last used 2 days ago</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
                
                <div className="flex items-center justify-between border p-4 rounded-md">
                  <div className="flex items-center gap-3">
                    <Key className="h-8 w-8 text-amber-500" />
                    <div>
                      <h4 className="font-medium">Security Keys</h4>
                      <p className="text-sm text-muted-foreground">Not configured</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Setup</Button>
                </div>
                
                <div className="flex items-center justify-between border p-4 rounded-md">
                  <div className="flex items-center gap-3">
                    <Lock className="h-8 w-8 text-blue-500" />
                    <div>
                      <h4 className="font-medium">Recovery Codes</h4>
                      <p className="text-sm text-muted-foreground">3 of 10 codes remaining</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View Codes</Button>
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
                        <span className="text-xs">SMS</span>
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
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-4 w-4 text-gray-300" />
                        <span className="text-xs">SMS</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs">Push</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Trading Notifications</h4>
                  
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">Order Execution</p>
                      <p className="text-sm text-muted-foreground">Order filled, cancelled, or rejected</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs">Email</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs">SMS</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs">Push</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">Price Alerts</p>
                      <p className="text-sm text-muted-foreground">When price reaches your set threshold</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-4 w-4 text-gray-300" />
                        <span className="text-xs">Email</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs">SMS</span>
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
                <CardTitle>Identity Verification</CardTitle>
                <CardDescription>Verify your identity to unlock full trading features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800">Basic Verification Complete</h4>
                      <p className="text-sm text-green-700">Your email and phone number have been verified.</p>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800">Advanced Verification In Progress</h4>
                      <p className="text-sm text-amber-700">We're reviewing your submitted documents. This typically takes 1-3 business days.</p>
                    </div>
                  </div>
                  
                  <div className="border rounded-md">
                    <div className="p-4 border-b">
                      <h4 className="font-medium">Verification Steps</h4>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 text-green-800 rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium">1</div>
                        <div className="flex-1">
                          <h5 className="font-medium">Basic Information</h5>
                          <p className="text-sm text-muted-foreground">Personal details and contact information</p>
                          <div className="mt-1 flex items-center text-green-600 text-sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Completed
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 text-green-800 rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium">2</div>
                        <div className="flex-1">
                          <h5 className="font-medium">ID Verification</h5>
                          <p className="text-sm text-muted-foreground">Government-issued photo ID</p>
                          <div className="mt-1 flex items-center text-green-600 text-sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Submitted
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-amber-100 text-amber-800 rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium">3</div>
                        <div className="flex-1">
                          <h5 className="font-medium">Proof of Address</h5>
                          <p className="text-sm text-muted-foreground">Recent utility bill or bank statement</p>
                          <div className="mt-1 flex items-center text-amber-600 text-sm">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Under Review
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-gray-100 text-gray-400 rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium">4</div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-500">Financial Information</h5>
                          <p className="text-sm text-muted-foreground">Income verification and investment experience</p>
                          <div className="mt-1">
                            <Button size="sm" disabled>Complete after step 3</Button>
                          </div>
                        </div>
                      </div>
                    </div>
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
