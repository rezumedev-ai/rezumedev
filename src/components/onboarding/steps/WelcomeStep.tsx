import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface WelcomeStepProps {
    onContinue: () => void;
}

export const WelcomeStep = ({ onContinue }: WelcomeStepProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center py-16"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="mb-8"
            >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
                    <Sparkles className="w-10 h-10 text-primary" />
                </div>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome to <span className="text-primary">Rezume.dev</span>! 🎉
            </h1>

            <p className="text-xl text-gray-600 mb-8">
                You're <span className="font-semibold text-primary">3 minutes away</span> from a resume
                <br />
                that gets you interviews at top companies.
            </p>

            <p className="text-lg text-gray-500 mb-12">
                Let's personalize your experience...
            </p>

            <Button
                onClick={onContinue}
                size="lg"
                className="px-8 py-6 text-lg"
            >
                Continue →
            </Button>
        </motion.div>
    );
};
