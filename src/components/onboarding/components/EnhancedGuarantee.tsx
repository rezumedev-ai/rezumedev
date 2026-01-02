import { motion } from 'framer-motion';
import { Shield, Check } from 'lucide-react';

export const EnhancedGuarantee = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-2xl mx-auto mb-8"
        >
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2 text-gray-900">
                            100% Risk-Free Guarantee
                        </h3>
                        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                            Try Rezume.dev risk-free for 14 days. If you're not completely satisfied,
                            we'll refund every penny—no questions asked.
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                            <div className="flex items-center gap-1.5">
                                <Check className="w-4 h-4 text-green-600" />
                                <span>Secure SSL Checkout</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Check className="w-4 h-4 text-green-600" />
                                <span>Cancel Anytime</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Check className="w-4 h-4 text-green-600" />
                                <span>Instant Access</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
