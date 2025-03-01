import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Menu, Save, User, Bell, Shield, Lock, CreditCard, Palette, EyeOff, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Settings() {
  const { user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profile");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      return data;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (newProfile: any) => {
      const { error } = await supabase
        .from("profiles")
        .update(newProfile)
        .eq("id", user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: "Settings updated",
        description: "Your changes have been saved successfully.",
      });
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error updating settings",
        description: "Failed to save your changes. Please try again.",
      });
    },
  });

  const handlePasswordReset = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user?.email || '', {
        redirectTo: `${window.location.origin}/settings`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for instructions to reset your password.",
      });
    } catch (error) {
      console.error("Error sending password reset:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send password reset email. Please try again.",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    updateProfile.mutate({
      full_name: formData.get("fullName"),
      email_notifications: formData.get("emailNotifications") === "on",
      desktop_notifications: formData.get("desktopNotifications") === "on",
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const tabContent = {
    hidden: { opacity: 0, x: -20 },
    show: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    exit: { 
      opacity: 0, 
      x: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {isMobile && (
        <motion.div 
          className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b p-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </motion.div>
      )}

      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className={`${isMobile ? 'mt-16' : 'ml-64'} transition-all duration-300 ease-in-out`}>
        <div className="p-4 md:p-8">
          <motion.div 
            className="max-w-4xl mx-auto space-y-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item}>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Account <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">Settings</span>
              </h1>
              <p className="text-gray-600">Manage your account preferences and settings</p>
            </motion.div>

            <motion.div variants={item}>
              <Tabs 
                defaultValue="profile" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4 lg:w-[600px] p-1 bg-gray-100/50 backdrop-blur-sm">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <TabsTrigger 
                      value="profile" 
                      className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">Profile</span>
                    </TabsTrigger>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <TabsTrigger 
                      value="notifications" 
                      className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <Bell className="h-4 w-4" />
                      <span className="hidden sm:inline">Notifications</span>
                    </TabsTrigger>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <TabsTrigger 
                      value="security" 
                      className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <Shield className="h-4 w-4" />
                      <span className="hidden sm:inline">Security</span>
                    </TabsTrigger>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <TabsTrigger 
                      value="appearance" 
                      className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <Palette className="h-4 w-4" />
                      <span className="hidden sm:inline">Appearance</span>
                    </TabsTrigger>
                  </motion.div>
                </TabsList>

                <form onSubmit={handleSubmit}>
                  <motion.div 
                    className="mt-6 space-y-6"
                    initial="hidden"
                    animate="show"
                    exit="exit"
                  >
                    <TabsContent value="profile">
                      <motion.div 
                        variants={tabContent}
                        className="space-y-6"
                      >
                        <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                          <div className="space-y-4">
                            <div className="flex items-center">
                              <FileText className="w-5 h-5 text-primary mr-2" />
                              <h3 className="text-lg font-medium">Personal Information</h3>
                            </div>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input 
                                  id="fullName"
                                  name="fullName"
                                  defaultValue={profile?.full_name || ''}
                                  placeholder="Enter your full name"
                                  className="transition-all duration-300 focus:border-primary/50 focus:ring-primary/50"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input 
                                  id="email"
                                  type="email"
                                  value={user?.email || ''}
                                  disabled
                                  className="bg-gray-50"
                                />
                                <p className="text-sm text-gray-500">Your email address is managed through your account settings.</p>
                              </div>
                            </div>
                          </div>
                        </Card>
                        
                        <Card className="p-6 bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/10 hover:shadow-lg transition-all duration-300">
                          <div className="space-y-4">
                            <div className="flex items-center">
                              <Sparkles className="w-5 h-5 text-primary mr-2 animate-pulse" />
                              <h3 className="text-lg font-medium">Premium Features</h3>
                            </div>
                            <div className="rounded-lg border border-primary/20 p-4 bg-white/50 backdrop-blur-sm">
                              <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center">
                                  <CreditCard className="w-5 h-5 text-primary mr-2" />
                                  <h4 className="font-medium">Current Plan</h4>
                                </div>
                                <Badge className="bg-gradient-to-r from-amber-500 to-amber-300 text-white border-0">
                                  FREE
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-4">Upgrade to Premium for unlimited resumes, AI-powered suggestions, and priority support.</p>
                              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:opacity-90">
                                  Upgrade to Premium
                                </Button>
                              </motion.div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="notifications">
                      <motion.div 
                        variants={tabContent}
                        className="space-y-4"
                      >
                        <Card className="space-y-4 bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center">
                            <Bell className="w-5 h-5 text-primary mr-2" />
                            <h3 className="text-lg font-medium">Notification Preferences</h3>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="space-y-0.5">
                                <Label className="text-base">Email Notifications</Label>
                                <p className="text-sm text-gray-500">Receive updates about your resume activity</p>
                              </div>
                              <Switch name="emailNotifications" defaultChecked={profile?.email_notifications} />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="space-y-0.5">
                                <Label className="text-base">Desktop Notifications</Label>
                                <p className="text-sm text-gray-500">Get notifications on your desktop</p>
                              </div>
                              <Switch name="desktopNotifications" defaultChecked={profile?.desktop_notifications} />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="space-y-0.5">
                                <Label className="text-base">Resume Update Alerts</Label>
                                <p className="text-sm text-gray-500">Notify me about resume template updates</p>
                              </div>
                              <Switch defaultChecked={true} />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="space-y-0.5">
                                <Label className="text-base">Job Match Alerts</Label>
                                <p className="text-sm text-gray-500">Notify me about potential job matches</p>
                              </div>
                              <Switch defaultChecked={false} />
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="security">
                      <motion.div 
                        variants={tabContent}
                        className="space-y-4"
                      >
                        <Card className="space-y-4 bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center">
                            <Lock className="w-5 h-5 text-primary mr-2" />
                            <h3 className="text-lg font-medium">Account Security</h3>
                          </div>
                          <div className="space-y-6">
                            <div className="space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                              <Label>Password</Label>
                              <div className="flex items-center gap-2 mt-1">
                                <Input 
                                  type="password" 
                                  value="●●●●●●●●●●●●" 
                                  disabled 
                                  className="bg-gray-50" 
                                />
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={handlePasswordReset}
                                    className="whitespace-nowrap"
                                  >
                                    Change Password
                                  </Button>
                                </motion.div>
                              </div>
                            </div>
                            <div className="space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                              <Label>Two-Factor Authentication</Label>
                              <div className="flex items-center justify-between mt-1">
                                <div className="text-sm text-gray-500">Enhance your account security with 2FA</div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => {
                                      toast({
                                        title: "Coming Soon",
                                        description: "Two-factor authentication will be available in a future update.",
                                      });
                                    }}
                                  >
                                    Enable 2FA
                                  </Button>
                                </motion.div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">Two-factor authentication is coming soon.</p>
                            </div>
                            <div className="space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                              <Label>Privacy Settings</Label>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                  <EyeOff className="w-4 h-4 text-gray-600" />
                                  <span className="text-sm text-gray-600">Hide my profile from public searches</span>
                                </div>
                                <Switch defaultChecked={true} />
                              </div>
                            </div>
                          </div>
                        </Card>

                        <Card className="space-y-4 bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center">
                            <Shield className="w-5 h-5 text-red-500 mr-2" />
                            <h3 className="text-lg font-medium">Danger Zone</h3>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-gray-500">Permanently delete your account and all associated data.</p>
                            <Button 
                              type="button" 
                              variant="destructive"
                              onClick={() => {
                                toast({
                                  title: "Warning",
                                  description: "This action cannot be undone. Please contact support if you're sure you want to delete your account.",
                                  variant: "destructive",
                                });
                              }}
                            >
                              Delete Account
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="appearance">
                      <motion.div 
                        variants={tabContent}
                        className="space-y-4"
                      >
                        <Card className="space-y-4 bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center">
                            <Palette className="w-5 h-5 text-primary mr-2" />
                            <h3 className="text-lg font-medium">Appearance Settings</h3>
                          </div>
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <Label>Theme</Label>
                              <div className="grid grid-cols-3 gap-3 mt-2">
                                <div className="relative">
                                  <input type="radio" id="light" name="theme" value="light" className="peer sr-only" defaultChecked />
                                  <label htmlFor="light" className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-gray-50 transition-all">
                                    <div className="w-full h-12 bg-white border border-gray-200 rounded-md mb-2"></div>
                                    <span className="text-sm font-medium">Light</span>
                                  </label>
                                  <Check className="absolute top-2 right-2 w-4 h-4 text-primary hidden peer-checked:block" />
                                </div>
                                <div className="relative">
                                  <input type="radio" id="dark" name="theme" value="dark" className="peer sr-only" />
                                  <label htmlFor="dark" className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-gray-50 transition-all">
                                    <div className="w-full h-12 bg-gray-900 border border-gray-700 rounded-md mb-2"></div>
                                    <span className="text-sm font-medium">Dark</span>
                                  </label>
                                  <Check className="absolute top-2 right-2 w-4 h-4 text-primary hidden peer-checked:block" />
                                </div>
                                <div className="relative">
                                  <input type="radio" id="system" name="theme" value="system" className="peer sr-only" />
                                  <label htmlFor="system" className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-gray-50 transition-all">
                                    <div className="w-full h-12 bg-gradient-to-r from-white to-gray-900 border border-gray-200 rounded-md mb-2"></div>
                                    <span className="text-sm font-medium">System</span>
                                  </label>
                                  <Check className="absolute top-2 right-2 w-4 h-4 text-primary hidden peer-checked:block" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Color Schemes</Label>
                              <div className="grid grid-cols-4 gap-3 mt-2">
                                <div className="relative">
                                  <input type="radio" id="indigo" name="color" value="indigo" className="peer sr-only" defaultChecked />
                                  <label htmlFor="indigo" className="flex items-center justify-center h-10 bg-[#6366F1] rounded-lg cursor-pointer peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-[#6366F1] transition-all" />
                                  <Check className="absolute top-2 right-2 w-4 h-4 text-white hidden peer-checked:block" />
                                </div>
                                <div className="relative">
                                  <input type="radio" id="teal" name="color" value="teal" className="peer sr-only" />
                                  <label htmlFor="teal" className="flex items-center justify-center h-10 bg-teal-500 rounded-lg cursor-pointer peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-teal-500 transition-all" />
                                  <Check className="absolute top-2 right-2 w-4 h-4 text-white hidden peer-checked:block" />
                                </div>
                                <div className="relative">
                                  <input type="radio" id="blue" name="color" value="blue" className="peer sr-only" />
                                  <label htmlFor="blue" className="flex items-center justify-center h-10 bg-blue-500 rounded-lg cursor-pointer peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-blue-500 transition-all" />
                                  <Check className="absolute top-2 right-2 w-4 h-4 text-white hidden peer-checked:block" />
                                </div>
                                <div className="relative">
                                  <input type="radio" id="purple" name="color" value="purple" className="peer sr-only" />
                                  <label htmlFor="purple" className="flex items-center justify-center h-10 bg-purple-500 rounded-lg cursor-pointer peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-purple-500 transition-all" />
                                  <Check className="absolute top-2 right-2 w-4 h-4 text-white hidden peer-checked:block" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Font Size</Label>
                              <div className="grid grid-cols-3 gap-3 mt-2">
                                <div className="relative">
                                  <input type="radio" id="sm" name="fontSize" value="sm" className="peer sr-only" />
                                  <label htmlFor="sm" className="flex items-center justify-center p-3 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-gray-50 transition-all">
                                    <span className="text-sm">Small</span>
                                  </label>
                                  <Check className="absolute top-2 right-2 w-4 h-4 text-primary hidden peer-checked:block" />
                                </div>
                                <div className="relative">
                                  <input type="radio" id="md" name="fontSize" value="md" className="peer sr-only" defaultChecked />
                                  <label htmlFor="md" className="flex items-center justify-center p-3 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-gray-50 transition-all">
                                    <span className="text-base">Medium</span>
                                  </label>
                                  <Check className="absolute top-2 right-2 w-4 h-4 text-primary hidden peer-checked:block" />
                                </div>
                                <div className="relative">
                                  <input type="radio" id="lg" name="fontSize" value="lg" className="peer sr-only" />
                                  <label htmlFor="lg" className="flex items-center justify-center p-3 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-gray-50 transition-all">
                                    <span className="text-lg">Large</span>
                                  </label>
                                  <Check className="absolute top-2 right-2 w-4 h-4 text-primary hidden peer-checked:block" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    </TabsContent>
                  </motion.div>

                  <motion.div 
                    className="mt-6 flex justify-end"
                    variants={item}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </motion.div>
                </form>
              </Tabs>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Badge({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
      {...props}
    />
  )
}

function Check(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
