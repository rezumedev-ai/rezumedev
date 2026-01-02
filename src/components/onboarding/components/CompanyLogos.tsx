import { motion } from 'framer-motion';

const companies = [
    { name: 'Google', color: '#4285F4' },
    { name: 'Meta', color: '#0081FB' },
    { name: 'Amazon', color: '#FF9900' },
    { name: 'Microsoft', color: '#00A4EF' },
    { name: 'Apple', color: '#000000' },
    { name: 'Netflix', color: '#E50914' }
];

export const CompanyLogos = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-16"
        >
            {/* Background Gradient Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 rounded-3xl blur-3xl" />

            <div className="relative bg-gradient-to-br from-white to-gray-50/50 rounded-2xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center text-sm font-medium text-gray-600 mb-8"
                >
                    Trusted by professionals at
                </motion.p>

                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
                    {companies.map((company, index) => (
                        <motion.div
                            key={company.name}
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{
                                delay: 0.3 + index * 0.1,
                                type: "spring",
                                stiffness: 100
                            }}
                            whileHover={{ scale: 1.1, y: -5 }}
                            className="group relative"
                        >
                            {/* Hover glow effect */}
                            <div
                                className="absolute inset-0 rounded-lg blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                                style={{ backgroundColor: company.color }}
                            />

                            <span
                                className="relative text-2xl md:text-3xl font-bold transition-all duration-300 opacity-70 group-hover:opacity-100"
                                style={{ color: company.color }}
                            >
                                {company.name}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
