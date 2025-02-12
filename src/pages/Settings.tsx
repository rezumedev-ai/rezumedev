
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Menu, Save, User, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  const { user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      )}

      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className={`${isMobile ? 'mt-16' : 'ml-64'} transition-all duration-300 ease-in-out`}>
        <div className="p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="animate-fade-up">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Account <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">Settings</span>
              </h1>
              <p className="text-gray-600">Manage your account preferences and settings</p>
            </div>

            <Tabs defaultValue="profile" className="animate-fade-up" style={{ animationDelay: '100ms' }}>
              <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit}>
                <TabsContent value="profile" className="space-y-6 mt-6">
                  <div className="space-y-4 bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200/50">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName"
                        name="fullName"
                        defaultValue={profile?.full_name || ''}
                        placeholder="Enter your full name"
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
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6 mt-6">
                  <div className="space-y-4 bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200/50">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-gray-500">Receive updates about your resume activity</p>
                      </div>
                      <Switch name="emailNotifications" defaultChecked={profile?.email_notifications} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Desktop Notifications</Label>
                        <p className="text-sm text-gray-500">Get notifications on your desktop</p>
                      </div>
                      <Switch name="desktopNotifications" defaultChecked={profile?.desktop_notifications} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="space-y-6 mt-6">
                  <div className="space-y-4 bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200/50">
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full sm:w-auto"
                        onClick={handlePasswordReset}
                      >
                        Change Password
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Two-Factor Authentication</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full sm:w-auto"
                        onClick={() => {
                          toast({
                            title: "Coming Soon",
                            description: "Two-factor authentication will be available in a future update.",
                          });
                        }}
                      >
                        Enable 2FA
                      </Button>
                      <p className="text-sm text-gray-500">Two-factor authentication is coming soon.</p>
                    </div>
                  </div>
                </TabsContent>

                <div className="mt-6 flex justify-end">
                  <Button type="submit" className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
