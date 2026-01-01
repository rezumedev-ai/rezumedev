import { motion } from 'framer-motion';
import { OnboardingData, PainPoint } from '@/types/onboarding';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FileText, Palette, Bot, Clock, Star, Repeat } from 'lucide-react';

interface PainPointStepProps {
    data: OnboardingData;
    updateData: (data: Partial<OnboardingData>) => void;
    onContinue: () => void;
    onBack: () => void;
}

const painPoints = [
    {
        id: 'writing' as PainPoint,
        icon: FileText,
        title: 'Writing impactful bullet points',
        description: "I don't know how to describe my work"
    },
    {
        id: 'design' as PainPoint,
        icon: Palette,
        title: 'Making it look professional',
        description: "Design isn't my strength"
    },
    {
        id: 'ats' as PainPoint,
        icon: Bot,
        title: 'Getting past ATS systems',
        description: 'My resume gets auto-rejected'
    },
    {
        id: 'time' as PainPoint,
        icon: Clock,
        title: "I don't have time",
        description: 'I need this done quickly'
    },
    {
        id: 'standout' as PainPoint,
        icon: Star,
        title: 'Standing out from competition',
        description: 'Everyone has similar experience'
    },
    {
        id: 'tailoring' as PainPoint,
        icon: Repeat,
        title: 'Tailoring for different roles',
        description: 'I apply to multiple positions'
    }
];

export const PainPointStep = ({ data, updateData, onContinue, onBack }: PainPointStepProps) => {
    const selectedPainPoints = data.painPoints || [];

    const togglePainPoint = (painPoint: PainPoint) => {
        const newPainPoints = selectedPainPoints.includes(painPoint)
            ? selectedPainPoints.filter(p => p !== painPoint)
            : [...selectedPainPoints, painPoint];

        updateData({ painPoints: newPainPoints });
    };

    const canContinue = selectedPainPoints.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-4xl mx-auto py-8"
        >
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                    What's your biggest resume challenge?
                </h2>
                <p className="text-gray-600">
                    Select all that apply - we'll help you solve them
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
                {painPoints.map((painPoint, index) => {
                    const isSelected = selectedPainPoints.includes(painPoint.id);
                    const Icon = painPoint.icon;

                    return (
                        <motion.button
                            key={painPoint.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => togglePainPoint(painPoint.id)}
                            className={cn(
                                'p-6 rounded-xl border-2 transition-all text-left',
                                'hover:shadow-lg hover:-translate-y-1',
                                isSelected
                                    ? 'border-primary bg-primary/5 shadow-md'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                            )}
                        >
                            <div className="flex items-start gap-4">
                                <div className={cn(
                                    'p-3 rounded-lg',
                                    isSelected ? 'bg-primary/10' : 'bg-gray-100'
                                )}>
                                    <Icon className={cn(
                                        'w-6 h-6',
                                        isSelected ? 'text-primary' : 'text-gray-600'
                                    )} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-lg">{painPoint.title}</h3>
                                        {isSelected && (
                                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600">{painPoint.description}</p>
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            <div className="flex gap-4 justify-center">
                <Button
                    variant="outline"
                    onClick={onBack}
                >
                    ← Back
                </Button>
                <Button
                    onClick={onContinue}
                    disabled={!canContinue}
                    className={cn(
                        'min-w-32',
                        !canContinue && 'opacity-50 cursor-not-allowed'
                    )}
                >
                    Continue →
                </Button>
            </div>

            {!canContinue && (
                <p className="text-center text-sm text-gray-500 mt-4">
                    Select at least one challenge to continue
                </p>
            )}
        </motion.div>
    );
};
