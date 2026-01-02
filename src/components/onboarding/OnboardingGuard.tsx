import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

export const OnboardingGuard = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(true);
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

    useEffect(() => {
        const checkOnboardingStatus = async () => {
            if (!user) {
                navigate('/login');
                return;
            }

            try {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('onboarding_completed')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;

                if (!profile?.onboarding_completed) {
                    navigate('/onboarding');
                } else {
                    setHasCompletedOnboarding(true);
                }
            } catch (error) {
                console.error('Error checking onboarding status:', error);
            } finally {
                setIsChecking(false);
            }
        };

        checkOnboardingStatus();
    }, [user, navigate]);

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return hasCompletedOnboarding ? <>{children}</> : null;
};
