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
            className="text-center mb-12"
        >
            <p className="text-sm text-gray-600 mb-6">
                Trusted by professionals at
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                {companies.map((company, index) => (
                    <motion.div
                        key={company.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-center"
                    >
                        <span
                            className="text-2xl font-bold opacity-60 hover:opacity-100 transition-opacity"
                            style={{ color: company.color }}
                        >
                            {company.name}
                        </span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};
