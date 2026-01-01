import { useState } from 'react';
import { motion } from 'framer-motion';
import { OnboardingData } from '@/types/onboarding';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface AIPreviewStepProps {
    data: OnboardingData;
    updateData: (data: Partial<OnboardingData>) => void;
    onContinue: () => void;
    onBack: () => void;
}

export const AIPreviewStep = ({ data, updateData, onContinue, onBack }: AIPreviewStepProps) => {
    const [input, setInput] = useState(data.aiDemoInput || '');
    const [output, setOutput] = useState(data.aiDemoOutput || '');
    const [isLoading, setIsLoading] = useState(false);

    const handleEnhance = async () => {
        if (!input.trim()) {
            toast.error('Please enter a responsibility first');
            return;
        }

        setIsLoading(true);
        try {
            const { data: result, error } = await supabase.functions.invoke('enhance-responsibility', {
                body: { responsibility: input }
            });

            if (error) throw error;

            if (result?.enhanced) {
                setOutput(result.enhanced);
                updateData({
                    aiDemoUsed: true,
                    aiDemoInput: input,
                    aiDemoOutput: result.enhanced
                });
                toast.success('Enhanced successfully!');
            }
        } catch (error) {
            console.error('AI enhancement error:', error);
            toast.error('Failed to enhance. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTryAnother = () => {
        setInput('');
        setOutput('');
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl mx-auto py-8"
        >
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-4">
                    See our AI in action! ✨
                </h2>
                <p className="text-gray-600">
                    Enter one of your responsibilities and watch our AI transform it into a FAANG-level bullet point
                </p>
            </div>

            <div className="space-y-6">
                {/* Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your responsibility:
                    </label>
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="e.g., Managed team projects"
                        className="min-h-24 text-base"
                        disabled={isLoading}
                    />
                </div>

                {/* Enhance button */}
                {!output && (
                    <Button
                        onClick={handleEnhance}
                        disabled={isLoading || !input.trim()}
                        className="w-full"
                        size="lg"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Enhancing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Enhance with AI
                            </>
                        )}
                    </Button>
                )}

                {/* Output */}
                {output && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-center">
                            <ArrowRight className="w-6 h-6 text-primary" />
                        </div>

                        <div className="p-6 bg-primary/5 border-2 border-primary rounded-xl">
                            <div className="flex items-start gap-3 mb-3">
                                <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-medium text-primary mb-1">AI-Enhanced Version:</p>
                                    <p className="text-gray-800 leading-relaxed">{output}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm text-green-800 font-medium">
                                🎯 This is what FAANG recruiters want to see!
                            </p>
                            <p className="text-sm text-green-700 mt-1">
                                Notice the specific metrics, action verbs, and impact-focused language.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={handleTryAnother}
                                className="flex-1"
                            >
                                Try Another
                            </Button>
                            <Button
                                onClick={onContinue}
                                className="flex-1"
                            >
                                Continue →
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>

            {!output && (
                <div className="flex gap-4 justify-center mt-8">
                    <Button
                        variant="outline"
                        onClick={onBack}
                    >
                        ← Back
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={onContinue}
                    >
                        Skip for now →
                    </Button>
                </div>
            )}
        </motion.div>
    );
};
