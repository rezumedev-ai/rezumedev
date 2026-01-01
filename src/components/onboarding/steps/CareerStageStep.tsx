import { motion } from 'framer-motion';
import { OnboardingData, CareerStage } from '@/types/onboarding';
import { OptionCard } from '../components/OptionCard';
import { GraduationCap, Rocket, RefreshCw, Briefcase, User } from 'lucide-react';

interface CareerStageStepProps {
    data: OnboardingData;
    updateData: (data: Partial<OnboardingData>) => void;
    onContinue: () => void;
    onBack: () => void;
}

const careerStages = [
    {
        id: 'graduate' as CareerStage,
        icon: GraduationCap,
        title: 'Recent Graduate',
        description: 'Just starting my career journey',
        color: 'blue'
    },
    {
        id: 'climber' as CareerStage,
        icon: Rocket,
        title: 'Career Climber',
        description: 'Ready for my next big opportunity',
        color: 'purple'
    },
    {
        id: 'switcher' as CareerStage,
        icon: RefreshCw,
        title: 'Career Switcher',
        description: 'Transitioning to a new field',
        color: 'green'
    },
    {
        id: 'executive' as CareerStage,
        icon: Briefcase,
        title: 'Senior Professional',
        description: 'Seeking executive/leadership roles',
        color: 'amber'
    },
    {
        id: 'freelancer' as CareerStage,
        icon: User,
        title: 'Freelancer/Consultant',
        description: 'Building my independent career',
        color: 'indigo'
    }
];

export const CareerStageStep = ({ data, updateData, onContinue }: CareerStageStepProps) => {
    const handleSelect = (stage: CareerStage) => {
        updateData({ careerStage: stage });
        setTimeout(onContinue, 300); // Small delay for visual feedback
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-4xl mx-auto py-8"
        >
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                    What best describes your current career situation?
                </h2>
                <p className="text-gray-600">
                    This helps us personalize your experience
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {careerStages.map((stage, index) => (
                    <motion.div
                        key={stage.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <OptionCard
                            icon={stage.icon}
                            title={stage.title}
                            description={stage.description}
                            color={stage.color}
                            selected={data.careerStage === stage.id}
                            onClick={() => handleSelect(stage.id)}
                        />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};
