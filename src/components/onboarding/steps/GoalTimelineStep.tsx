import { useState } from 'react';
import { motion } from 'framer-motion';
import { OnboardingData, PrimaryGoal, Timeline } from '@/types/onboarding';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Target, DollarSign, Star, TrendingUp, Building, Zap, Calendar, CalendarDays, Clock } from 'lucide-react';

interface GoalTimelineStepProps {
    data: OnboardingData;
    updateData: (data: Partial<OnboardingData>) => void;
    onContinue: () => void;
    onBack: () => void;
}

const goals = [
    { id: 'faang' as PrimaryGoal, icon: Target, label: 'Land a job at FAANG/top tech company' },
    { id: 'salary-increase' as PrimaryGoal, icon: DollarSign, label: 'Increase my salary by 20%+' },
    { id: 'industry-switch' as PrimaryGoal, icon: Star, label: 'Switch to a new industry/role' },
    { id: 'promotion' as PrimaryGoal, icon: TrendingUp, label: 'Get promoted internally' },
    { id: 'first-job' as PrimaryGoal, icon: Building, label: 'Find my first professional role' }
];

const timelines = [
    { id: 'asap' as Timeline, icon: Zap, label: 'ASAP', description: "I'm actively applying" },
    { id: 'within-2-weeks' as Timeline, icon: Calendar, label: 'Within 2 weeks', description: 'I have interviews coming up' },
    { id: 'within-month' as Timeline, icon: CalendarDays, label: 'Within a month', description: "I'm preparing to apply" },
    { id: 'exploring' as Timeline, icon: Clock, label: 'Just exploring', description: 'No immediate deadline' }
];

export const GoalTimelineStep = ({ data, updateData, onContinue, onBack }: GoalTimelineStepProps) => {
    const [showTimeline, setShowTimeline] = useState(!!data.primaryGoal);

    const handleGoalSelect = (goal: PrimaryGoal) => {
        updateData({ primaryGoal: goal });
        setShowTimeline(true);
    };

    const handleTimelineSelect = (timeline: Timeline) => {
        updateData({ timeline });
        setTimeout(onContinue, 300);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl mx-auto py-8"
        >
            {!showTimeline ? (
                <>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">
                            What's your primary goal right now?
                        </h2>
                        <p className="text-gray-600">
                            This helps us tailor your resume strategy
                        </p>
                    </div>

                    <div className="space-y-3">
                        {goals.map((goal, index) => (
                            <motion.button
                                key={goal.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => handleGoalSelect(goal.id)}
                                className={cn(
                                    'w-full p-4 rounded-lg border-2 transition-all text-left flex items-center gap-4',
                                    'hover:border-primary hover:bg-primary/5',
                                    data.primaryGoal === goal.id
                                        ? 'border-primary bg-primary/5'
                                        : 'border-gray-200 bg-white'
                                )}
                            >
                                <goal.icon className="w-5 h-5 text-primary" />
                                <span className="font-medium">{goal.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">
                            When do you need your resume ready?
                        </h2>
                        <p className="text-gray-600">
                            We'll prioritize features based on your timeline
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {timelines.map((timeline, index) => (
                            <motion.button
                                key={timeline.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => handleTimelineSelect(timeline.id)}
                                className={cn(
                                    'p-6 rounded-xl border-2 transition-all text-left',
                                    'hover:border-primary hover:shadow-lg',
                                    data.timeline === timeline.id
                                        ? 'border-primary bg-primary/5 shadow-md'
                                        : 'border-gray-200 bg-white'
                                )}
                            >
                                <timeline.icon className="w-8 h-8 text-primary mb-3" />
                                <h3 className="font-semibold text-lg mb-1">{timeline.label}</h3>
                                <p className="text-sm text-gray-600">{timeline.description}</p>
                            </motion.button>
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <Button
                            variant="ghost"
                            onClick={() => setShowTimeline(false)}
                        >
                            ← Back to Goals
                        </Button>
                    </div>
                </>
            )}
        </motion.div>
    );
};
