import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Info, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const FACTS = [
    {
        icon: AlertCircle,
        text: "⚠️ 75% of resumes are rejected by ATS bots instantly. Don't be one of them.",
        highlight: "75% of resumes",
        trigger: "Fear of Missing Out"
    },
    {
        icon: Clock,
        text: "⏰ 43% of jobs are filled in the first 2 weeks. Speed is everything.",
        highlight: "first 2 weeks",
        trigger: "Urgency"
    },
    {
        icon: TrendingUp,
        text: "Competition is fierce: 250+ people apply for every single corporate role.",
        highlight: "250+ people",
        trigger: "Competition"
    },
    {
        icon: Lightbulb,
        text: "💰 Strong resumes don't just get interviews—they command 7-10% higher salaries.",
        highlight: "7-10% higher salaries",
        trigger: "Reward"
    },
    {
        icon: Info,
        text: "Recruiters decide in 6 seconds. You have one chance to make an impression.",
        highlight: "6 seconds",
        trigger: "Attention"
    }
];

export const DidYouKnowTab = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % FACTS.length);
        }, 6000); // Rotate every 6 seconds

        return () => clearInterval(interval);
    }, []);

    if (!isVisible) return null;

    const CurrentIcon = FACTS[currentIndex].icon;

    // Helper to bold the highlighted text
    const renderText = (text: string, highlight: string) => {
        const parts = text.split(highlight);
        if (parts.length < 2) return text;
        return (
            <>
                {parts[0]}
                <span className="font-bold text-primary">{highlight}</span>
                {parts[1]}
            </>
        );
    };

    return (
        <div className="w-full bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <div className="container mx-auto px-4 py-4 max-w-3xl">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="relative bg-secondary/30 rounded-xl border border-primary/10 overflow-hidden"
                >
                    {/* Progress Bar for Fact Timer */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
                        <motion.div
                            key={currentIndex}
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 6, ease: "linear" }}
                            className="h-full bg-primary/30"
                        />
                    </div>

                    <div className="flex items-center p-4 gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.5, opacity: 0 }}
                                >
                                    <CurrentIcon className="w-5 h-5 text-primary" />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[10px] items-center px-2 py-0.5 rounded-full bg-primary/5 text-primary font-bold uppercase tracking-wider">
                                    Did You Know?
                                </span>
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={currentIndex}
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -10, opacity: 0 }}
                                    className="text-sm text-gray-700 leading-snug"
                                >
                                    {renderText(FACTS[currentIndex].text, FACTS[currentIndex].highlight)}
                                </motion.p>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
