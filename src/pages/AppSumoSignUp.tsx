
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Mail, User, Lock, Eye, EyeOff, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";

const AppSumoSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;
    const redemptionCode = formData.get("redemptionCode") as string;

    try {
      // First, sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (authError) throw authError;

      if (redemptionCode) {
        // If a redemption code was provided, redeem it
        const { error: redeemError } = await supabase.functions.invoke('redeem-code', {
          body: { code: redemptionCode }
        });

        if (redeemError) {
          toast({
            variant: "destructive",
            title: "Error redeeming code",
            description: redeemError.message || "Please try again or contact support",
          });
        } else {
          toast({
            title: "Welcome AppSumo user!",
            description: "Your account has been created with lifetime access.",
          });
        }
      } else {
        toast({
          title: "Account created successfully!",
          description: "Welcome to Rezume.dev",
        });
      }
      
      // Navigate to dashboard (auth state change listener will handle if needed)
      navigate("/dashboard");
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error creating account",
        description: error instanceof Error ? error.message : "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary hover:text-primary-hover transition-colors">
              Rezume.dev
            </h1>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            AppSumo Special Offer
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account and redeem your lifetime access
          </p>
        </div>
        
        <div className="mt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    className="pl-10"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="pl-10"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="pl-10"
                    placeholder="••••••••"
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
                <Label htmlFor="redemptionCode" className="flex items-center gap-2 text-amber-800">
                  <Gift className="h-5 w-5" />
                  AppSumo Redemption Code
                </Label>
                <div className="mt-1">
                  <Input
                    id="redemptionCode"
                    name="redemptionCode"
                    type="text"
                    required
                    className="bg-white border-amber-300"
                    placeholder="Enter your AppSumo redemption code"
                  />
                </div>
                <p className="mt-2 text-xs text-amber-700">
                  Enter the code you received from AppSumo to activate your lifetime access.
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account & activate"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppSumoSignUp;
