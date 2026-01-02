import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
    {
        text: "Got 3 interviews in 2 weeks after using Rezume.dev!",
        author: "Sarah M.",
        role: "Product Manager"
    },
    {
        text: "Landed my dream job at Google. The AI suggestions were incredible.",
        author: "Alex K.",
        role: "Software Engineer"
    },
    {
        text: "Best $10 I ever spent. Saved me hours and got better results.",
        author: "Michael R.",
        role: "Data Analyst"
    }
];

export const Testimonials = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12"
        >
            {testimonials.map((testimonial, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
                >
                    <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className="w-4 h-4 fill-yellow-400 text-yellow-400"
                            />
                        ))}
                    </div>
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                        "{testimonial.text}"
                    </p>
                    <p className="text-xs text-gray-500">
                        — {testimonial.author}, {testimonial.role}
                    </p>
                </motion.div>
            ))}
        </motion.div>
    );
};
