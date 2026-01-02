import { motion } from 'framer-motion';
import { Users, Briefcase, Star } from 'lucide-react';

const stats = [
    {
        icon: Users,
        value: '50,000+',
        label: 'Resumes Created',
        gradient: 'from-blue-500 to-cyan-500',
        bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
        icon: Briefcase,
        value: '15,000+',
        label: 'Users Hired',
        gradient: 'from-green-500 to-emerald-500',
        bgGradient: 'from-green-50 to-emerald-50'
    },
    {
        icon: Star,
        value: '4.9/5',
        label: 'Average Rating',
        gradient: 'from-yellow-500 to-orange-500',
        bgGradient: 'from-yellow-50 to-orange-50'
    }
];

export const UserStats = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16"
        >
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                            delay: 0.5 + index * 0.15,
                            type: "spring",
                            stiffness: 100
                        }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="relative group"
                    >
                        {/* Animated gradient background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} rounded-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-300`} />

                        {/* Glow effect on hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300`} />

                        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-lg">
                            <motion.div
                                initial={{ rotate: 0 }}
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                                className="flex justify-center mb-4"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                                    <Icon className="w-7 h-7 text-white" />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ scale: 1 }}
                                whileHover={{ scale: 1.1 }}
                                className="text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2"
                            >
                                {stat.value}
                            </motion.div>

                            <div className="text-sm font-medium text-gray-600">
                                {stat.label}
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </motion.div>
    );
};
