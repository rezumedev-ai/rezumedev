import { useState, useCallback, useEffect } from 'react';
import { OnboardingData } from '@/types/onboarding';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useOnboarding = () => {
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [data, setData] = useState<OnboardingData>({});
    const [startTime] = useState(Date.now());
    const [isLoading, setIsLoading] = useState(false);

    const totalSteps = 7;

    const updateData = useCallback((newData: Partial<OnboardingData>) => {
        setData(prev => ({ ...prev, ...newData }));
    }, []);

    const nextStep = useCallback(() => {
        setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }, [totalSteps]);

    const previousStep = useCallback(() => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    }, []);

    const saveProgress = useCallback(async () => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('onboarding_responses')
                .upsert({
                    user_id: user.id,
                    career_stage: data.careerStage,
                    primary_goal: data.primaryGoal,
                    timeline: data.timeline,
                    pain_points: data.painPoints,
                    ai_demo_used: data.aiDemoUsed,
                    ai_demo_input: data.aiDemoInput,
                    ai_demo_output: data.aiDemoOutput,
                    template_selected: data.templateSelected,
                    subscription_chosen: data.subscriptionChosen,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id'
                });

            if (error) throw error;
        } catch (error) {
            console.error('Error saving onboarding progress:', error);
        }
    }, [user, data]);

    const completeOnboarding = useCallback(async () => {
        if (!user) return false;

        setIsLoading(true);
        const conversionTime = Math.floor((Date.now() - startTime) / 1000);

        try {
            // Save final onboarding data
            const { error: onboardingError } = await supabase
                .from('onboarding_responses')
                .upsert({
                    user_id: user.id,
                    career_stage: data.careerStage,
                    primary_goal: data.primaryGoal,
                    timeline: data.timeline,
                    pain_points: data.painPoints,
                    ai_demo_used: data.aiDemoUsed,
                    ai_demo_input: data.aiDemoInput,
                    ai_demo_output: data.aiDemoOutput,
                    template_selected: data.templateSelected,
                    subscription_chosen: data.subscriptionChosen,
                    completed_at: new Date().toISOString(),
                    conversion_time_seconds: conversionTime,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id'
                });

            if (onboardingError) throw onboardingError;

            // Mark profile as onboarding completed
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ onboarding_completed: true })
                .eq('id', user.id);

            if (profileError) throw profileError;

            return true;
        } catch (error) {
            console.error('Error completing onboarding:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [user, data, startTime]);

    // Auto-save progress when data changes
    useEffect(() => {
        if (Object.keys(data).length > 0) {
            saveProgress();
        }
    }, [data, saveProgress]);

    return {
        currentStep,
        totalSteps,
        data,
        isLoading,
        updateData,
        nextStep,
        previousStep,
        completeOnboarding,
        progress: (currentStep / totalSteps) * 100
    };
};
