import { motion } from 'framer-motion';
import { Lock, CreditCard, Shield } from 'lucide-react';

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
                    <span className="font-bold text-primary">Stripe</span>
                </div>

                <div className="flex items-center gap-6">
                    {[
                        { name: "Visa", icon: CreditCard },
                        { name: "Mastercard", icon: CreditCard },
                        { name: "Amex", icon: CreditCard }
                    ].map((payment, index) => (
                        <motion.div
                            key={payment.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1 + index * 0.1 }}
                            whileHover={{ scale: 1.1, y: -2 }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm"
                        >
                            <payment.icon className="w-4 h-4 text-gray-600" />
                            <span className="text-xs font-medium text-gray-700">{payment.name}</span>
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
