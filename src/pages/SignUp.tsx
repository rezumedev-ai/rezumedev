import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Mail, User, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { AuthLayout } from "@/components/auth/AuthLayout";

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Account created successfully!",
        description: "Welcome to Rezume.dev",
      });

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
    <AuthLayout
      title="Create account"
      subtitle="Start building your professional resume"
    >
      <div className="mt-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3.5">
            <div>
              <Label htmlFor="fullName" className="text-gray-700 font-medium text-sm">Full Name</Label>
              <div className="mt-1.5 relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <User className="h-5 w-5" />
                </div>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 h-11"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium text-sm">Email address</Label>
              <div className="mt-1.5 relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 h-11"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 font-medium text-sm">Password</Label>
              <div className="mt-1.5 relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="pl-10 pr-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 h-11"
                  placeholder="••••••••"
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-1">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-white h-11 font-medium shadow-md hover:shadow-lg transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : "Create account"}
            </Button>
          </div>

          <SocialAuthButtons mode="signup" />

          <div className="text-center text-sm pt-1">
            <span className="text-gray-500">Already have an account? </span>
            <Link to="/login" className="font-semibold text-primary hover:text-primary-hover transition-colors">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
