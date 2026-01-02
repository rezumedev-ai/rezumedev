import { motion } from 'framer-motion';
import { Shield, Check, Sparkles } from 'lucide-react';

export const EnhancedGuarantee = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="max-w-3xl mx-auto mb-12"
        >
            <div className="relative group">
                {/* Animated gradient glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 rounded-3xl opacity-20 group-hover:opacity-30 blur-xl transition-opacity duration-300" />

                <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border-2 border-green-200 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-start gap-6">
                        {/* Animated shield icon */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                delay: 0.9,
                                type: "spring",
                                stiffness: 200
                            }}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="relative flex-shrink-0"
                        >
                            {/* Pulsing glow */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 0.8, 0.5]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute inset-0 bg-green-400 rounded-full blur-lg"
                            />

                            <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <Shield className="w-8 h-8 text-white" strokeWidth={2.5} />
                            </div>
                        </motion.div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                                <h3 className="font-bold text-2xl text-gray-900">
                                    100% Risk-Free Guarantee
                                </h3>
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Sparkles className="w-5 h-5 text-green-600" />
                                </motion.div>
                            </div>

                            <p className="text-base text-gray-700 mb-5 leading-relaxed font-medium">
                                Try Rezume.dev risk-free for 14 days. If you're not completely satisfied,
                                we'll refund every penny—no questions asked.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { icon: Check, text: "Secure SSL Checkout" },
                                    { icon: Check, text: "Cancel Anytime" },
                                    { icon: Check, text: "Instant Access" }
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1 + index * 0.1 }}
                                        className="flex items-center gap-2 bg-white/60 rounded-lg px-3 py-2"
                                    >
                                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                            <item.icon className="w-3 h-3 text-white" strokeWidth={3} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">
                                            {item.text}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
