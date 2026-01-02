import { useState, useCallback, useEffect } from 'react';
import { OnboardingData } from '@/types/onboarding';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const STORAGE_KEY = 'rezumedev_onboarding_progress';

interface StoredProgress {
    currentStep: number;
    data: OnboardingData;
    timestamp: number;
}

export const useOnboarding = () => {
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [data, setData] = useState<OnboardingData>({});
    const [startTime] = useState(Date.now());
    const [isLoading, setIsLoading] = useState(false);
    const [isRestored, setIsRestored] = useState(false);

    const totalSteps = 7;

    // Restore progress from localStorage on mount
    useEffect(() => {
        if (isRestored) return;

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const progress: StoredProgress = JSON.parse(stored);

                // Only restore if less than 24 hours old
                const hoursSinceLastSave = (Date.now() - progress.timestamp) / (1000 * 60 * 60);
                if (hoursSinceLastSave < 24) {
                    setCurrentStep(progress.currentStep);
                    setData(progress.data);
                    console.log('Restored onboarding progress:', progress);
                } else {
                    // Clear old progress
                    localStorage.removeItem(STORAGE_KEY);
                }
            }
        } catch (error) {
            console.error('Error restoring onboarding progress:', error);
        }

        setIsRestored(true);
    }, [isRestored]);

    // Save progress to localStorage whenever step or data changes
    useEffect(() => {
        if (!isRestored) return; // Don't save during initial restoration

        try {
            const progress: StoredProgress = {
                currentStep,
                data,
                timestamp: Date.now()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        } catch (error) {
            console.error('Error saving onboarding progress to localStorage:', error);
        }
    }, [currentStep, data, isRestored]);

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

            // Clear localStorage progress on completion
            localStorage.removeItem(STORAGE_KEY);

            return true;
        } catch (error) {
            console.error('Error completing onboarding:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [user, data, startTime]);

    // Auto-save progress to Supabase when data changes
    useEffect(() => {
        if (Object.keys(data).length > 0 && isRestored) {
            saveProgress();
        }
    }, [data, saveProgress, isRestored]);

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
