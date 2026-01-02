import { motion } from 'framer-motion';
import { Lock, CreditCard } from 'lucide-react';

export const PaymentBadges = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center mb-6"
        >
            <p className="text-xs text-gray-500 mb-3 flex items-center justify-center gap-2">
                <Lock className="w-3 h-3" />
                Secure payment powered by Stripe
            </p>
            <div className="flex justify-center items-center gap-4 opacity-50">
                <div className="flex items-center gap-1 text-xs text-gray-600 font-medium">
                    <CreditCard className="w-4 h-4" />
                    <span>Visa</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600 font-medium">
                    <CreditCard className="w-4 h-4" />
                    <span>Mastercard</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600 font-medium">
                    <CreditCard className="w-4 h-4" />
                    <span>Amex</span>
                </div>
            </div>
        </motion.div>
    );
};
