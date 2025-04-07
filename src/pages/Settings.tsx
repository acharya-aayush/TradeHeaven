
import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, Moon, Sun, Globe, Bell, Key, Lock, RefreshCw, Save, EyeOff, Smartphone, Layers, Code, FileDown, Shield, ArrowRight, PlusCircle, Clock as ClockIcon } from 'lucide-react';
import ThemeSelector from '@/components/settings/ThemeSelector';
import { Switch } from '@/components/ui/switch';

// Define settings state types
interface SettingsState {
  // Appearance
  activeLayoutOption: 'default' | 'reversed';
  activeDensityOption: 'compact' | 'default' | 'comfortable';
  activeFontSizeOption: 'small' | 'medium' | 'large' | 'xlarge';
  
  // Notifications
  inAppNotifications: boolean;
  orderExecutionNotifs: boolean;
  priceAlertsNotifs: boolean;
  accountUpdatesNotifs: boolean;
  marketNewsNotifs: boolean;
  emailNotifications: boolean;
  securityAlertsEmail: boolean;
  orderConfirmationsEmail: boolean;
  accountStatementsEmail: boolean;
  marketingEmailNotifs: boolean;
  pushNotifications: boolean;
  priceAlertsPush: boolean;
  orderStatusPush: boolean;
  securityAlertsPush: boolean;
  
  // Privacy
  dataSharing: boolean;
  analyticsCookies: boolean;
  
  // Security
  twoFactorAuth: boolean;
  loginVerification: boolean;
  sessionTimeout: string;
}

const Settings = () => {
  const { toast } = useToast();
  
  // Initialize settings state with default values
  const [settings, setSettings] = useState<SettingsState>({
    // Appearance
    activeLayoutOption: 'default',
    activeDensityOption: 'default',
    activeFontSizeOption: 'medium',
    
    // Notifications
    inAppNotifications: true,
    orderExecutionNotifs: true,
    priceAlertsNotifs: true,
    accountUpdatesNotifs: true,
    marketNewsNotifs: false,
    emailNotifications: true,
    securityAlertsEmail: true,
    orderConfirmationsEmail: true,
    accountStatementsEmail: true,
    marketingEmailNotifs: false,
    pushNotifications: true,
    priceAlertsPush: true,
    orderStatusPush: true,
    securityAlertsPush: true,
    
    // Privacy
    dataSharing: false,
    analyticsCookies: true,
    
    // Security
    twoFactorAuth: true,
    loginVerification: true,
    sessionTimeout: '30'
  });
  
  // Function to update a specific setting
  const updateSetting = (category: string, key: keyof SettingsState, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Show toast notification
    toast({
      title: `${category} setting updated`,
      description: `Your ${key} preference has been changed.`,
      duration: 2000
    });
  };

  const handleSaveSettings = () => {
    // Here you would typically save all settings to a backend or localStorage
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully."
    });
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-5 mb-4">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Customize the look and feel of the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ThemeSelector />
                
                <div className="space-y-3">
                  <Label>Dashboard Layout</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      className={`border rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-primary ${settings.activeLayoutOption === 'default' ? 'border-primary bg-muted' : ''}`}
                      onClick={() => updateSetting('Appearance', 'activeLayoutOption', 'default')}
                      data-state={settings.activeLayoutOption === 'default' ? 'active' : 'inactive'}
                    >
                      <div className="w-full h-24 bg-muted rounded-md flex flex-col">
                        <div className="h-1/3 border-b border-border"></div>
                        <div className="flex-1 flex">
                          <div className="w-1/3 border-r border-border"></div>
                          <div className="flex-1"></div>
                        </div>
                      </div>
                      <span className="text-sm font-medium">Default</span>
                    </div>
                    
                    <div 
                      className={`border rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-primary ${settings.activeLayoutOption === 'reversed' ? 'border-primary bg-muted' : ''}`}
                      onClick={() => updateSetting('Appearance', 'activeLayoutOption', 'reversed')}
                      data-state={settings.activeLayoutOption === 'reversed' ? 'active' : 'inactive'}
                    >
                      <div className="w-full h-24 bg-muted rounded-md flex flex-col">
                        <div className="h-1/3 border-b border-border"></div>
                        <div className="flex-1 flex">
                          <div className="flex-1"></div>
                          <div className="w-1/3 border-l border-border"></div>
                        </div>
                      </div>
                      <span className="text-sm font-medium">Reversed</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label>Density</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div 
                      className={`border rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-primary ${settings.activeDensityOption === 'compact' ? 'border-primary bg-muted' : ''}`}
                      onClick={() => updateSetting('Appearance', 'activeDensityOption', 'compact')}
                      data-state={settings.activeDensityOption === 'compact' ? 'active' : 'inactive'}
                    >
                      <div className="w-full space-y-1">
                        <div className="h-2 bg-muted rounded-full"></div>
                        <div className="h-2 bg-muted rounded-full"></div>
                        <div className="h-2 bg-muted rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">Compact</span>
                    </div>
                    
                    <div 
                      className={`border rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-primary ${settings.activeDensityOption === 'default' ? 'border-primary bg-muted' : ''}`}
                      onClick={() => updateSetting('Appearance', 'activeDensityOption', 'default')}
                      data-state={settings.activeDensityOption === 'default' ? 'active' : 'inactive'}
                    >
                      <div className="w-full space-y-2">
                        <div className="h-2 bg-muted rounded-full"></div>
                        <div className="h-2 bg-muted rounded-full"></div>
                        <div className="h-2 bg-muted rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">Default</span>
                    </div>
                    
                    <div 
                      className={`border rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-primary ${settings.activeDensityOption === 'comfortable' ? 'border-primary bg-muted' : ''}`}
                      onClick={() => updateSetting('Appearance', 'activeDensityOption', 'comfortable')}
                      data-state={settings.activeDensityOption === 'comfortable' ? 'active' : 'inactive'}
                    >
                      <div className="w-full space-y-3">
                        <div className="h-2 bg-muted rounded-full"></div>
                        <div className="h-2 bg-muted rounded-full"></div>
                        <div className="h-2 bg-muted rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">Comfortable</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>Save Changes</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Font & Text</CardTitle>
                <CardDescription>Customize the text appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Font Size</Label>
                  <div className="grid grid-cols-4 gap-4">
                    <div 
                      className={`border rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-primary ${settings.activeFontSizeOption === 'small' ? 'border-primary bg-muted' : ''}`}
                      onClick={() => updateSetting('Appearance', 'activeFontSizeOption', 'small')}
                      data-state={settings.activeFontSizeOption === 'small' ? 'active' : 'inactive'}
                    >
                      <span className="text-xs">Small</span>
                    </div>
                    
                    <div 
                      className={`border rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-primary ${settings.activeFontSizeOption === 'medium' ? 'border-primary bg-muted' : ''}`}
                      onClick={() => updateSetting('Appearance', 'activeFontSizeOption', 'medium')}
                      data-state={settings.activeFontSizeOption === 'medium' ? 'active' : 'inactive'}
                    >
                      <span className="text-sm">Medium</span>
                    </div>
                    
                    <div 
                      className={`border rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-primary ${settings.activeFontSizeOption === 'large' ? 'border-primary bg-muted' : ''}`}
                      onClick={() => updateSetting('Appearance', 'activeFontSizeOption', 'large')}
                      data-state={settings.activeFontSizeOption === 'large' ? 'active' : 'inactive'}
                    >
                      <span className="text-base">Large</span>
                    </div>
                    
                    <div 
                      className={`border rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-primary ${settings.activeFontSizeOption === 'xlarge' ? 'border-primary bg-muted' : ''}`}
                      onClick={() => updateSetting('Appearance', 'activeFontSizeOption', 'xlarge')}
                      data-state={settings.activeFontSizeOption === 'xlarge' ? 'active' : 'inactive'}
                    >
                      <span className="text-lg">Extra Large</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Regional Settings</CardTitle>
                <CardDescription>Customize language and localization preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="language">Language</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <select className="w-full pl-9 py-2 rounded-md border border-input bg-background">
                      <option value="en-US">English (US)</option>
                      <option value="en-GB">English (UK)</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="zh">Chinese</option>
                      <option value="ja">Japanese</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="timezone">Time Zone</Label>
                  <select className="w-full py-2 rounded-md border border-input bg-background">
                    <option value="UTC-8">(UTC-08:00) Pacific Time (US & Canada)</option>
                    <option value="UTC-5">(UTC-05:00) Eastern Time (US & Canada)</option>
                    <option value="UTC+0">(UTC+00:00) London, Edinburgh</option>
                    <option value="UTC+1">(UTC+01:00) Paris, Berlin, Rome</option>
                    <option value="UTC+8">(UTC+08:00) Beijing, Hong Kong, Singapore</option>
                    <option value="UTC+9">(UTC+09:00) Tokyo, Seoul</option>
                  </select>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <select className="w-full py-2 rounded-md border border-input bg-background">
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="currency">Currency Display</Label>
                  <select className="w-full py-2 rounded-md border border-input bg-background">
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="CNY">CNY (¥)</option>
                  </select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>Save Changes</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Trading Preferences</CardTitle>
                <CardDescription>Default settings for your trading activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="defaultOrderType">Default Order Type</Label>
                  <select className="w-full py-2 rounded-md border border-input bg-background">
                    <option value="market">Market</option>
                    <option value="limit">Limit</option>
                    <option value="stop">Stop</option>
                    <option value="stopLimit">Stop Limit</option>
                  </select>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="defaultQuantity">Default Order Quantity</Label>
                  <Input id="defaultQuantity" type="number" defaultValue="1" min="1" />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="confirmOrders">Order Confirmations</Label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="confirmOrders" 
                      className="w-4 h-4 rounded border-gray-300 focus:ring-primary"
                      defaultChecked 
                    />
                    <label htmlFor="confirmOrders" className="text-sm text-muted-foreground">
                      Show confirmation dialog before submitting orders
                    </label>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="autofillPrice">Autofill Price</Label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="autofillPrice" 
                      className="w-4 h-4 rounded border-gray-300 focus:ring-primary"
                      defaultChecked 
                    />
                    <label htmlFor="autofillPrice" className="text-sm text-muted-foreground">
                      Automatically fill price fields with current market price
                    </label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Control how and when you receive alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-base">In-App Notifications</h4>
                      <p className="text-sm text-muted-foreground">Control notifications within the application</p>
                    </div>
                    <Switch 
                      checked={settings.inAppNotifications}
                      onCheckedChange={(checked) => updateSetting('Notifications', 'inAppNotifications', checked)}
                    />
                  </div>
                  
                  <div className="space-y-3 border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Order Execution</span>
                      </div>
                      <Switch 
                        checked={settings.orderExecutionNotifs}
                        onCheckedChange={(checked) => updateSetting('Notifications', 'orderExecutionNotifs', checked)}
                        disabled={!settings.inAppNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Price Alerts</span>
                      </div>
                      <Switch 
                        checked={settings.priceAlertsNotifs}
                        onCheckedChange={(checked) => updateSetting('Notifications', 'priceAlertsNotifs', checked)}
                        disabled={!settings.inAppNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Account Updates</span>
                      </div>
                      <Switch 
                        checked={settings.accountUpdatesNotifs}
                        onCheckedChange={(checked) => updateSetting('Notifications', 'accountUpdatesNotifs', checked)}
                        disabled={!settings.inAppNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Market News</span>
                      </div>
                      <Switch 
                        checked={settings.marketNewsNotifs}
                        onCheckedChange={(checked) => updateSetting('Notifications', 'marketNewsNotifs', checked)}
                        disabled={!settings.inAppNotifications}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-base">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Control notifications sent to your email</p>
                    </div>
                    <Switch 
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => updateSetting('Notifications', 'emailNotifications', checked)}
                    />
                  </div>
                  
                  <div className="space-y-3 border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Security Alerts</span>
                      </div>
                      <Switch 
                        checked={settings.securityAlertsEmail}
                        onCheckedChange={(checked) => updateSetting('Notifications', 'securityAlertsEmail', checked)}
                        disabled={!settings.emailNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Order Confirmations</span>
                      </div>
                      <Switch 
                        checked={settings.orderConfirmationsEmail}
                        onCheckedChange={(checked) => updateSetting('Notifications', 'orderConfirmationsEmail', checked)}
                        disabled={!settings.emailNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Account Statements</span>
                      </div>
                      <Switch 
                        checked={settings.accountStatementsEmail}
                        onCheckedChange={(checked) => updateSetting('Notifications', 'accountStatementsEmail', checked)}
                        disabled={!settings.emailNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Marketing & Promotions</span>
                      </div>
                      <Switch 
                        checked={settings.marketingEmailNotifs}
                        onCheckedChange={(checked) => updateSetting('Notifications', 'marketingEmailNotifs', checked)}
                        disabled={!settings.emailNotifications}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-base">Mobile Push Notifications</h4>
                      <p className="text-sm text-muted-foreground">Control notifications on your mobile device</p>
                    </div>
                    <Switch 
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => updateSetting('Notifications', 'pushNotifications', checked)}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Price Alerts</span>
                      </div>
                      <Switch 
                        checked={settings.priceAlertsPush}
                        onCheckedChange={(checked) => updateSetting('Notifications', 'priceAlertsPush', checked)}
                        disabled={!settings.pushNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Order Status</span>
                      </div>
                      <Switch 
                        checked={settings.orderStatusPush}
                        onCheckedChange={(checked) => updateSetting('Notifications', 'orderStatusPush', checked)}
                        disabled={!settings.pushNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Security Alerts</span>
                      </div>
                      <Switch 
                        checked={settings.securityAlertsPush}
                        onCheckedChange={(checked) => updateSetting('Notifications', 'securityAlertsPush', checked)}
                        disabled={!settings.pushNotifications}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Access</CardTitle>
                <CardDescription>Manage your API keys and access tokens</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-start gap-2 mb-4">
                    <Code className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">API Documentation</h4>
                      <p className="text-sm text-muted-foreground">View our comprehensive API documentation to get started with automated trading.</p>
                      <Button variant="link" className="h-auto p-0 mt-1">
                        View API Documentation
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Your API Keys</h4>
                    <Button size="sm">
                      <Key className="mr-2 h-4 w-4" />
                      Generate New Key
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h5 className="font-medium">Trading Bot API Key</h5>
                          <p className="text-xs text-muted-foreground">Created on Aug 15, 2023</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">Regenerate</Button>
                          <Button variant="destructive" size="sm">Revoke</Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <Label className="text-xs">API Key</Label>
                          <div className="flex">
                            <Input className="font-mono text-xs rounded-r-none" value="pk_*******************" readOnly />
                            <Button variant="secondary" className="rounded-l-none">
                              <EyeOff className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">Secret Key</Label>
                          <div className="flex">
                            <Input className="font-mono text-xs rounded-r-none" value="sk_*******************" readOnly />
                            <Button variant="secondary" className="rounded-l-none">
                              <EyeOff className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 text-xs">
                        <span className="font-medium">Permissions:</span> Read, Trade
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h5 className="font-medium">Data Analysis API Key</h5>
                          <p className="text-xs text-muted-foreground">Created on Sep 5, 2023</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">Regenerate</Button>
                          <Button variant="destructive" size="sm">Revoke</Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <Label className="text-xs">API Key</Label>
                          <div className="flex">
                            <Input className="font-mono text-xs rounded-r-none" value="pk_*******************" readOnly />
                            <Button variant="secondary" className="rounded-l-none">
                              <EyeOff className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">Secret Key</Label>
                          <div className="flex">
                            <Input className="font-mono text-xs rounded-r-none" value="sk_*******************" readOnly />
                            <Button variant="secondary" className="rounded-l-none">
                              <EyeOff className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 text-xs">
                        <span className="font-medium">Permissions:</span> Read-only
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label>API Request Limit</Label>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>120 / 200 requests per minute</span>
                      <span>60%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: '60%' }} />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Your plan allows up to 200 API requests per minute.</p>
                </div>
                
                <div className="space-y-3">
                  <Label>Webhook URLs</Label>
                  <Input placeholder="https://your-server.com/webhook" />
                  <Button variant="outline" size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Webhook
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control your data and privacy preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Data Sharing</h4>
                      <p className="text-sm text-muted-foreground">Control how your data is used</p>
                    </div>
                    <Switch 
                      checked={settings.dataSharing}
                      onCheckedChange={(checked) => updateSetting('Privacy', 'dataSharing', checked)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Allow sharing of non-personal, anonymized trading data to improve platform features.</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Analytics Cookies</h4>
                      <p className="text-sm text-muted-foreground">Website usage tracking</p>
                    </div>
                    <Switch 
                      checked={settings.analyticsCookies}
                      onCheckedChange={(checked) => updateSetting('Privacy', 'analyticsCookies', checked)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Allow the use of cookies to analyze site usage and improve user experience.</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Activity Log</h4>
                      <p className="text-sm text-muted-foreground">View and manage your account activity</p>
                    </div>
                  </div>
                  <Button variant="outline">
                    <ClockIcon className="mr-2 h-4 w-4" />
                    View Activity Log
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Export Personal Data</h4>
                      <p className="text-sm text-muted-foreground">Download all your account data</p>
                    </div>
                  </div>
                  <Button variant="outline">
                    <FileDown className="mr-2 h-4 w-4" />
                    Request Data Export
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>Save Changes</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Enhance the security of your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Switch 
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => updateSetting('Security', 'twoFactorAuth', checked)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Two-factor authentication is currently enabled using an authenticator app.</p>
                  <Button variant="outline" size="sm">
                    <Shield className="mr-2 h-4 w-4" />
                    Manage 2FA
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Login Verification</h4>
                      <p className="text-sm text-muted-foreground">Verify new device logins</p>
                    </div>
                    <Switch 
                      checked={settings.loginVerification}
                      onCheckedChange={(checked) => updateSetting('Security', 'loginVerification', checked)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Receive email notifications when logging in from a new device or location.</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Session Timeout</h4>
                      <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                    </div>
                  </div>
                  <select 
                    className="w-full py-2 rounded-md border border-input bg-background"
                    value={settings.sessionTimeout}
                    onChange={(e) => updateSetting('Security', 'sessionTimeout', e.target.value)}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                    <option value="240">4 hours</option>
                  </select>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Recent Login Activity</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start border-b pb-2">
                      <div>
                        <p className="text-sm font-medium">Chrome on macOS</p>
                        <p className="text-xs text-muted-foreground">Los Angeles, CA • Today at 2:45 PM</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Current</span>
                    </div>
                    
                    <div className="flex justify-between items-start border-b pb-2">
                      <div>
                        <p className="text-sm font-medium">Safari on iPhone</p>
                        <p className="text-xs text-muted-foreground">Los Angeles, CA • Yesterday at 6:30 PM</p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6">
                        <Lock className="h-3 w-3 mr-1" />
                        <span className="text-xs">Logout</span>
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">Firefox on Windows</p>
                        <p className="text-xs text-muted-foreground">New York, NY • Sep 10, 2023 at 10:15 AM</p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6">
                        <Lock className="h-3 w-3 mr-1" />
                        <span className="text-xs">Logout</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="destructive" className="w-full">Sign Out From All Devices</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card className="bg-muted/30 border-dashed mt-4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="mr-2 h-5 w-5" />
              Advanced Settings
            </CardTitle>
            <CardDescription>Additional configuration options for power users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-background rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">Chart Configuration</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Customize technical indicators and chart display settings.</p>
                <Button variant="outline" size="sm" className="w-full">Configure</Button>
              </div>
              
              <div className="bg-background rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">Auto-Refresh Settings</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Control data refresh rates and real-time updates.</p>
                <Button variant="outline" size="sm" className="w-full">Configure</Button>
              </div>
              
              <div className="bg-background rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <Save className="h-5 w-5 text-purple-500" />
                  <h3 className="font-medium">Layout Presets</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Save and load custom workspace configurations.</p>
                <Button variant="outline" size="sm" className="w-full">Manage Presets</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

export default Settings;
