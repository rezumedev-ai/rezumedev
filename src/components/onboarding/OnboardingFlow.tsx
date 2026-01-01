import { useOnboarding } from '@/hooks/useOnboarding';
import { ProgressBar } from './components/ProgressBar';

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
                return (
                    <div className="max-w-2xl mx-auto text-center py-16">
                        <h1 className="text-4xl font-bold mb-4">Welcome to Rezume.dev! 🎉</h1>
                        <p className="text-xl text-gray-600 mb-8">
                            You're 3 minutes away from a resume that gets you interviews.
                        </p>
                        <button
                            onClick={nextStep}
                            className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Continue →
                        </button>
                    </div>
                );
            case 2:
                return (
                    <div className="max-w-2xl mx-auto text-center py-16">
                        <h2 className="text-3xl font-bold mb-8">Step 2: Career Stage</h2>
                        <p className="text-gray-600 mb-4">This will be implemented in Phase 2</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={previousStep}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                ← Back
                            </button>
                            <button
                                onClick={nextStep}
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                            >
                                Continue →
                            </button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="max-w-2xl mx-auto text-center py-16">
                        <h2 className="text-3xl font-bold mb-8">Step 3: Goals & Timeline</h2>
                        <p className="text-gray-600 mb-4">This will be implemented in Phase 2</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={previousStep}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                ← Back
                            </button>
                            <button
                                onClick={nextStep}
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                            >
                                Continue →
                            </button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="max-w-2xl mx-auto text-center py-16">
                        <h2 className="text-3xl font-bold mb-8">Step 4: Pain Points</h2>
                        <p className="text-gray-600 mb-4">This will be implemented in Phase 3</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={previousStep}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                ← Back
                            </button>
                            <button
                                onClick={nextStep}
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                            >
                                Continue →
                            </button>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="max-w-2xl mx-auto text-center py-16">
                        <h2 className="text-3xl font-bold mb-8">Step 5: AI Demo</h2>
                        <p className="text-gray-600 mb-4">This will be implemented in Phase 3</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={previousStep}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                ← Back
                            </button>
                            <button
                                onClick={nextStep}
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                            >
                                Continue →
                            </button>
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className="max-w-2xl mx-auto text-center py-16">
                        <h2 className="text-3xl font-bold mb-8">Step 6: Template Selection</h2>
                        <p className="text-gray-600 mb-4">This will be implemented in Phase 3</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={previousStep}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                ← Back
                            </button>
                            <button
                                onClick={nextStep}
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                            >
                                Continue →
                            </button>
                        </div>
                    </div>
                );
            case 7:
                return (
                    <div className="max-w-2xl mx-auto text-center py-16">
                        <h2 className="text-3xl font-bold mb-8">Step 7: Choose Your Plan</h2>
                        <p className="text-gray-600 mb-4">This will be implemented in Phase 3</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={previousStep}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                ← Back
                            </button>
                            <button
                                onClick={async () => {
                                    const success = await completeOnboarding();
                                    if (success) {
                                        window.location.href = '/dashboard';
                                    }
                                }}
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                            >
                                Complete Onboarding →
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <ProgressBar current={currentStep} total={totalSteps} progress={progress} />
            <div className="container mx-auto px-4 py-8">
                {renderStep()}
            </div>
        </div>
    );
};
