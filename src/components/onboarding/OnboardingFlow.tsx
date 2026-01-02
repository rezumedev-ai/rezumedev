import { useOnboarding } from '@/hooks/useOnboarding';
import { ProgressBar } from './components/ProgressBar';
import { WelcomeStep } from './steps/WelcomeStep';
import { CareerStageStep } from './steps/CareerStageStep';
import { GoalTimelineStep } from './steps/GoalTimelineStep';
import { PainPointStep } from './steps/PainPointStep';
import { AIPreviewStep } from './steps/AIPreviewStep';
import { TemplateSelectionStep } from './steps/TemplateSelectionStep';
import { SubscriptionStep } from './steps/SubscriptionStep';

import { DidYouKnowTab } from './components/DidYouKnowTab';

export const OnboardingFlow = () => {
    const {
        currentStep,
        totalSteps,
        data,
        updateData,
        nextStep,
        previousStep,
        completeOnboarding,
        progress
    } = useOnboarding();

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <WelcomeStep onContinue={nextStep} />;
            case 2:
                return (
                    <CareerStageStep
                        data={data}
                        updateData={updateData}
                        onContinue={nextStep}
                        onBack={previousStep}
                    />
                );
            case 3:
                return (
                    <GoalTimelineStep
                        data={data}
                        updateData={updateData}
                        onContinue={nextStep}
                        onBack={previousStep}
                    />
                );
            case 4:
                return (
                    <PainPointStep
                        data={data}
                        updateData={updateData}
                        onContinue={nextStep}
                        onBack={previousStep}
                    />
                );
            case 5:
                return (
                    <AIPreviewStep
                        data={data}
                        updateData={updateData}
                        onContinue={nextStep}
                        onBack={previousStep}
                    />
                );
            case 6:
                return (
                    <TemplateSelectionStep
                        data={data}
                        updateData={updateData}
                        onContinue={nextStep}
                        onBack={previousStep}
                    />
                );
            case 7:
                return (
                    <SubscriptionStep
                        data={data}
                        updateData={updateData}
                        onContinue={async () => {
                            const success = await completeOnboarding();
                            if (success) {
                                window.location.href = '/dashboard';
                            }
                        }}
                        onBack={previousStep}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
            <ProgressBar current={currentStep} total={totalSteps} progress={progress} />

            {/* Main Content Area - Grows to fill space */}
            <div className="flex-1 container mx-auto px-4 py-8">
                {renderStep()}
            </div>

            {/* Sticky Footer - Part of the flow, pushes content up but stays reachable */}
            <div className="sticky bottom-0 z-10 w-full mt-auto">
                <DidYouKnowTab />
            </div>
        </div>
    );
};
