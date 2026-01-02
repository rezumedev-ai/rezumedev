import { motion } from 'framer-motion';
import { Users, Briefcase, Star } from 'lucide-react';

const stats = [
    {
        icon: Users,
        value: '50,000+',
        label: 'Resumes Created',
        color: 'text-blue-600'
    },
    {
        icon: Briefcase,
        value: '15,000+',
        label: 'Users Hired',
        color: 'text-green-600'
    },
    {
        icon: Star,
        value: '4.9/5',
        label: 'Average Rating',
        color: 'text-yellow-600'
    }
];

export const UserStats = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-12"
        >
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="text-center"
                    >
                        <div className="flex justify-center mb-3">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                        <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                            {stat.value}
                        </div>
                        <div className="text-sm text-gray-600">
                            {stat.label}
                        </div>
                    </motion.div>
                );
            })}
        </motion.div>
    );
};
