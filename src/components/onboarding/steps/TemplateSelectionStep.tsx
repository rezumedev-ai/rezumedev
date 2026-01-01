import { motion } from 'framer-motion';
import { OnboardingData, CareerStage } from '@/types/onboarding';
import { resumeTemplates } from '@/components/resume-builder/templates';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface TemplateSelectionStepProps {
    data: OnboardingData;
    updateData: (data: Partial<OnboardingData>) => void;
    onContinue: () => void;
    onBack: () => void;
}

// Template recommendations based on career stage
const getRecommendedTemplate = (careerStage?: CareerStage): string => {
    switch (careerStage) {
        case 'graduate':
            return 'modern-professional'; // Clean and professional for entry-level
        case 'climber':
            return 'minimal-clean'; // Modern and sleek for mid-career
        case 'switcher':
            return 'modern-professional'; // Versatile for career changers
        case 'executive':
            return 'executive-clean'; // Traditional for senior roles
        case 'freelancer':
            return 'creative-portfolio'; // Creative for freelancers
        default:
            return 'modern-professional';
    }
};

export const TemplateSelectionStep = ({ data, updateData, onContinue, onBack }: TemplateSelectionStepProps) => {
    const recommendedTemplateId = getRecommendedTemplate(data.careerStage);
    const selectedTemplate = data.templateSelected;

    const handleSelectTemplate = (templateId: string) => {
        updateData({ templateSelected: templateId });
        setTimeout(onContinue, 400); // Small delay for visual feedback
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-6xl mx-auto py-8"
        >
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                    Choose your professional style
                </h2>
                <p className="text-gray-600">
                    Based on your career stage, we recommend <span className="font-semibold text-primary">{resumeTemplates.find(t => t.id === recommendedTemplateId)?.name}</span>
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {resumeTemplates.map((template, index) => {
                    const isRecommended = template.id === recommendedTemplateId;
                    const isSelected = selectedTemplate === template.id;

                    return (
                        <motion.button
                            key={template.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => handleSelectTemplate(template.id)}
                            className={cn(
                                'relative p-4 rounded-xl border-2 transition-all text-left',
                                'hover:shadow-xl hover:-translate-y-2',
                                isSelected
                                    ? 'border-primary bg-primary/5 shadow-lg'
                                    : isRecommended
                                        ? 'border-primary/50 bg-primary/5'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                            )}
                        >
                            {/* Recommended badge */}
                            {isRecommended && !isSelected && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-3 py-1 rounded-full z-10">
                                    <span className="text-xs font-medium text-white">Recommended</span>
                                </div>
                            )}

                            {/* Selected checkmark */}
                            {isSelected && (
                                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center z-10 shadow-lg">
                                    <Check className="w-5 h-5 text-white" />
                                </div>
                            )}

                            {/* Template preview image */}
                            <div className="relative aspect-[8.5/11] mb-4 rounded-lg overflow-hidden bg-gray-100">
                                <img
                                    src={template.imageUrl}
                                    alt={template.name}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>

                            {/* Template info */}
                            <div>
                                <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            <div className="flex gap-4 justify-center mt-8">
                <button
                    onClick={onBack}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    ← Back
                </button>
            </div>
        </motion.div>
    );
};
