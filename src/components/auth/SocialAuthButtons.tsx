
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface SocialAuthButtonsProps {
    mode: "login" | "signup";
}

export function SocialAuthButtons({ mode }: SocialAuthButtonsProps) {
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const { toast } = useToast();

    const handleSocialLogin = async (provider: "google" | "linkedin") => {
        try {
            setIsLoading(provider);
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: `${window.location.origin}/`,
                },
            });

            if (error) throw error;
        } catch (error) {
            console.error("Social auth error:", error);
            toast({
                variant: "destructive",
                title: "Authentication failed",
                description: error instanceof Error ? error.message : "Please try again",
            });
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-50 px-2 text-muted-foreground">
                        Or {mode === "login" ? "continue" : "sign up"} with
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {/* Google Button */}
                <Button
                    variant="outline"
                    type="button"
                    disabled={!!isLoading}
                    onClick={() => handleSocialLogin("google")}
                    className="w-full bg-white text-black border-gray-300 hover:bg-gray-50 hover:text-black relative"
                >
                    {isLoading === "google" ? (
                        <span className="animate-pulse">Connecting...</span>
                    ) : (
                        <>
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Google
                        </>
                    )}
                </Button>

                {/* LinkedIn Button - Placeholder for now, ready to uncomment when configured */}
                <Button
                    variant="outline"
                    type="button"
                    disabled={!!isLoading}
                    onClick={() => handleSocialLogin("linkedin")}
                    className="w-full bg-[#0077b5] text-white hover:bg-[#006396] hover:text-white border-transparent"
                >
                    {isLoading === "linkedin" ? (
                        <span className="animate-pulse">Connecting...</span>
                    ) : (
                        <>
                            <svg className="mr-2 h-4 w-4 fill-current" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 21.227.792 22 1.771 22h20.451C23.2 22 24 21.227 24 20.271V1.729C24 .774 23.2 0 22.225 0z" />
                            </svg>
                            LinkedIn
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
