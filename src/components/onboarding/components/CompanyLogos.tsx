import { motion } from 'framer-motion';

const companies = [
    { name: 'Google', logo: '/logos/google.svg', height: 'h-8' },
    { name: 'Meta', logo: '/logos/meta.svg', height: 'h-7' },
    { name: 'Amazon', logo: '/logos/amazon.svg', height: 'h-8' },
    { name: 'Microsoft', logo: '/logos/microsoft.svg', height: 'h-7' },
    { name: 'Apple', logo: '/logos/apple.svg', height: 'h-9' },
    { name: 'Netflix', logo: '/logos/netflix.svg', height: 'h-6' }
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
                            {/* Subtle glow on hover */}
                            <div className="absolute inset-0 rounded-lg blur-lg opacity-0 group-hover:opacity-20 bg-primary transition-opacity duration-300" />

                            <img
                                src={company.logo}
                                alt={company.name}
                                className={`relative ${company.height} w-auto opacity-60 group-hover:opacity-100 transition-all duration-300 filter grayscale group-hover:grayscale-0`}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
