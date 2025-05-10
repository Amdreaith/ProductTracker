
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Bell, Moon, Sun, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";

const settingsSchema = z.object({
  syncAcrossDevices: z.boolean().default(true),
  usageAnalytics: z.boolean().default(true),
  timeZone: z.string().min(1, "Please select a time zone"),
  acceptCookies: z.boolean().default(true),
  theme: z.enum(["light", "dark", "system"]).default("system"),
  emailNotifications: z.boolean().default(true),
  productUpdates: z.boolean().default(true),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  
  // Default values for the form
  const defaultValues: Partial<SettingsFormValues> = {
    syncAcrossDevices: true,
    usageAnalytics: true,
    timeZone: "America/New_York",
    acceptCookies: true,
    theme: "system",
    emailNotifications: true,
    productUpdates: true,
  };

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues,
  });

  const onSubmit = (data: SettingsFormValues) => {
    // In a real app, you would save these settings to your backend
    console.log("Settings saved:", data);
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleExportData = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      const fakeData = JSON.stringify({
        user: user?.email,
        settings: form.getValues(),
        exportedAt: new Date().toISOString(),
      }, null, 2);
      
      // Create a download link for the data
      const blob = new Blob([fakeData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "personal-data-export.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsExporting(false);
      
      toast({
        title: "Data exported",
        description: "Your personal data has been exported successfully.",
      });
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="container max-w-4xl py-6 space-y-6 animate-fade-in">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <Badge variant="secondary">Beta</Badge>
        </div>
        <p className="text-muted-foreground">
          Manage your account preferences and configuration
        </p>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full sm:w-auto justify-start">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="privacy">Data & Privacy</TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
              <TabsContent value="general" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Configure general account settings and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="syncAcrossDevices"
                      render={({ field }) => (
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Sync across devices</FormLabel>
                            <FormDescription>
                              Keep your settings and data synchronized across devices
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-primary"
                            />
                          </FormControl>
                        </div>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="usageAnalytics"
                      render={({ field }) => (
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Usage analytics</FormLabel>
                            <FormDescription>
                              Help us improve by sending anonymous usage data
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-primary"
                            />
                          </FormControl>
                        </div>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="timeZone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time Zone</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a time zone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="America/New_York">Eastern Time (US & Canada)</SelectItem>
                              <SelectItem value="America/Chicago">Central Time (US & Canada)</SelectItem>
                              <SelectItem value="America/Denver">Mountain Time (US & Canada)</SelectItem>
                              <SelectItem value="America/Los_Angeles">Pacific Time (US & Canada)</SelectItem>
                              <SelectItem value="Europe/London">London, Edinburgh</SelectItem>
                              <SelectItem value="Europe/Paris">Paris, Berlin, Rome</SelectItem>
                              <SelectItem value="Asia/Tokyo">Tokyo, Osaka</SelectItem>
                              <SelectItem value="Australia/Sydney">Sydney, Melbourne</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            All dates and times will be displayed in this time zone
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Control how and when you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <Bell className="h-4 w-4" />
                              <FormLabel className="text-base">Email notifications</FormLabel>
                            </div>
                            <FormDescription>
                              Receive email notifications about account activity
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-primary"
                            />
                          </FormControl>
                        </div>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="productUpdates"
                      render={({ field }) => (
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <Bell className="h-4 w-4" />
                              <FormLabel className="text-base">Product updates</FormLabel>
                            </div>
                            <FormDescription>
                              Get notified about new features and improvements
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-primary"
                            />
                          </FormControl>
                        </div>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="appearance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                    <CardDescription>Customize the look and feel of the application</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="theme"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Theme</FormLabel>
                          <div className="flex gap-4 pt-2">
                            <div 
                              className={`border rounded-md p-2 cursor-pointer ${field.value === 'light' ? 'border-primary ring-2 ring-primary/30' : 'border-input'}`}
                              onClick={() => form.setValue("theme", "light")}
                            >
                              <div className="flex items-center justify-center w-full h-20 bg-[#f8f9fa] rounded">
                                <Sun className="h-6 w-6 text-[#1e293b]" />
                              </div>
                              <p className="text-center mt-2 text-sm">Light</p>
                            </div>
                            
                            <div 
                              className={`border rounded-md p-2 cursor-pointer ${field.value === 'dark' ? 'border-primary ring-2 ring-primary/30' : 'border-input'}`}
                              onClick={() => form.setValue("theme", "dark")}
                            >
                              <div className="flex items-center justify-center w-full h-20 bg-[#1e293b] rounded">
                                <Moon className="h-6 w-6 text-[#f8f9fa]" />
                              </div>
                              <p className="text-center mt-2 text-sm">Dark</p>
                            </div>
                            
                            <div 
                              className={`border rounded-md p-2 cursor-pointer ${field.value === 'system' ? 'border-primary ring-2 ring-primary/30' : 'border-input'}`}
                              onClick={() => form.setValue("theme", "system")}
                            >
                              <div className="flex items-center justify-center w-full h-20 bg-gradient-to-r from-[#f8f9fa] to-[#1e293b] rounded">
                                <div className="flex">
                                  <Sun className="h-6 w-6 text-[#1e293b]" />
                                  <Moon className="h-6 w-6 text-[#f8f9fa]" />
                                </div>
                              </div>
                              <p className="text-center mt-2 text-sm">System</p>
                            </div>
                          </div>
                          <FormDescription>
                            Select a theme preference for the application
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="privacy" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Data & Privacy</CardTitle>
                    <CardDescription>Manage how your data is used and stored</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="acceptCookies"
                      render={({ field }) => (
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Accept all cookies</FormLabel>
                            <FormDescription>
                              Allow the app to store cookies on your device
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-primary"
                            />
                          </FormControl>
                        </div>
                      )}
                    />
                    
                    <div className="pt-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleExportData}
                        disabled={isExporting}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        {isExporting ? "Exporting..." : "Export Personal Data"}
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        Download a copy of your personal data in JSON format
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <div className="flex justify-end gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
