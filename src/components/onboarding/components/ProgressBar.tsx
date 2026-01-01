import { motion } from 'framer-motion';

interface ProgressBarProps {
    current: number;
    total: number;
    progress: number;
}

export const ProgressBar = ({ current, total, progress }: ProgressBarProps) => {
    return (
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">
                        Step {current} of {total}
                    </span>
                    <span className="text-sm font-medium text-primary">
                        {Math.round(progress)}% Complete
                    </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-primary to-primary/80"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                </div>
            </div>
        </div>
    );
};
