import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        text: "Got 3 interviews in 2 weeks after using Rezume.dev!",
        author: "Sarah M.",
        role: "Product Manager",
        gradient: "from-purple-500 to-pink-500"
    },
    {
        text: "Landed my dream job at Google. The AI suggestions were incredible.",
        author: "Alex K.",
        role: "Software Engineer",
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        text: "Best $10 I ever spent. Saved me hours and got better results.",
        author: "Michael R.",
        role: "Data Analyst",
        gradient: "from-green-500 to-emerald-500"
    }
];

export const Testimonials = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16"
        >
            {testimonials.map((testimonial, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30, rotateX: -15 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{
                        delay: 0.7 + index * 0.15,
                        type: "spring",
                        stiffness: 100
                    }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="relative group"
                >
                    {/* Gradient glow on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300`} />

                    <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300">
                        {/* Quote icon with gradient */}
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center`}>
                                <Quote className="w-5 h-5 text-white" />
                            </div>

                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{
                                            delay: 0.8 + index * 0.15 + i * 0.05,
                                            type: "spring"
                                        }}
                                    >
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <p className="text-sm text-gray-700 mb-4 leading-relaxed font-medium">
                            "{testimonial.text}"
                        </p>

                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold`}>
                                {testimonial.author[0]}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">
                                    {testimonial.author}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {testimonial.role}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};
