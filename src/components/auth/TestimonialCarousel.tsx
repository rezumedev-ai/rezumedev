import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";

interface Testimonial {
    id: number;
    quote: string;
    author: string;
    role: string;
    avatar: string;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        quote: "Landed my dream job at Google thanks to the clean, ATS-friendly resume I built here. The templates are professional and easy to customize!",
        author: "Sarah Chen",
        role: "Software Engineer at Google",
        avatar: "SC"
    },
    {
        id: 2,
        quote: "As a recruiter, I can tell when someone uses Rezume.dev. The formatting is always perfect and highlights exactly what we look for.",
        author: "Michael Rodriguez",
        role: "Tech Recruiter at LinkedIn",
        avatar: "MR"
    },
    {
        id: 3,
        quote: "I went from 2 interviews to 15 in just one week after rebuilding my resume. The AI suggestions were spot-on!",
        author: "Priya Patel",
        role: "Product Manager at Meta",
        avatar: "PP"
    },
    {
        id: 4,
        quote: "Finally, a resume builder that doesn't make my resume look like everyone else's. Got 3 job offers in a month!",
        author: "James Wilson",
        role: "UX Designer at Airbnb",
        avatar: "JW"
    },
    {
        id: 5,
        quote: "The PDF export is flawless. No formatting issues, no weird spacing. Just a perfect resume every time.",
        author: "Emily Thompson",
        role: "Data Analyst at Stripe",
        avatar: "ET"
    }
];

export const TestimonialCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 3500); // 3.5 seconds

        return () => clearInterval(interval);
    }, [isPaused]);

    const currentTestimonial = testimonials[currentIndex];

    return (
        <div
            className="w-full h-full flex items-center justify-center p-8 lg:p-16 relative overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Decorative Elements */}
            <div className="absolute top-10 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative z-10 w-full max-w-xl mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentTestimonial.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="text-center"
                    >
                        {/* Quote Icon */}
                        <div className="mb-6 flex justify-center">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <Quote className="w-8 h-8 text-primary" />
                            </div>
                        </div>

                        {/* Quote */}
                        <blockquote className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-8 font-medium">
                            "{currentTestimonial.quote}"
                        </blockquote>

                        {/* Author */}
                        <div className="flex items-center justify-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                                {currentTestimonial.avatar}
                            </div>
                            <div className="text-left">
                                <div className="font-semibold text-gray-900">
                                    {currentTestimonial.author}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {currentTestimonial.role}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-2 mt-12">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? "w-8 bg-primary"
                                    : "w-2 bg-gray-300 hover:bg-gray-400"
                                }`}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
