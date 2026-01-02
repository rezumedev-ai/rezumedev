import { motion } from 'framer-motion';
import { Lock, Shield } from 'lucide-react';

const paymentMethods = [
    { name: 'Visa', logo: '/logos/visa.svg' },
    { name: 'Mastercard', logo: '/logos/mastercard.svg' },
    { name: 'Amex', logo: '/logos/amex.svg' }
];

export const PaymentBadges = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mb-8"
        >
            <div className="inline-flex flex-col items-center gap-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <motion.div
                        animate={{ rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Lock className="w-4 h-4 text-green-600" />
                    </motion.div>
                    <span className="font-medium">Secure payment powered by</span>
                    <img
                        src="/logos/stripe.svg"
                        alt="Stripe"
                        className="h-5 w-auto"
                    />
                </div>

                <div className="flex items-center gap-4">
                    {paymentMethods.map((payment, index) => (
                        <motion.div
                            key={payment.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1 + index * 0.1 }}
                            whileHover={{ scale: 1.1, y: -2 }}
                            className="flex items-center justify-center px-3 py-2 bg-white rounded-lg border border-gray-200 shadow-sm"
                        >
                            <img
                                src={payment.logo}
                                alt={payment.name}
                                className="h-6 w-auto"
                            />
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    className="flex items-center gap-2 text-xs text-gray-500"
                >
                    <Shield className="w-3 h-3" />
                    <span>256-bit SSL encryption</span>
                </motion.div>
            </div>
        </motion.div>
    );
};
