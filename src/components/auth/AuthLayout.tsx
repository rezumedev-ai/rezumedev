import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { TestimonialCarousel } from "./TestimonialCarousel";

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
    return (
        <div className="min-h-screen w-full flex bg-white">
            {/* Left Side - Auth Form */}
            <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-16">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-[480px] mx-auto"
                >
                    {/* Logo */}
                    <div className="mb-10">
                        <Link to="/" className="inline-block transition-transform hover:scale-[1.02]">
                            <span className="text-xl font-bold text-primary transition-colors hover:text-primary-hover">
                                Rezume.dev
                            </span>
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
                            {title}
                        </h2>
                        <p className="text-gray-600 text-base">
                            {subtitle}
                        </p>
                    </div>

                    {/* Form Content */}
                    {children}

                    {/* Footer */}
                    <div className="mt-8 text-xs text-gray-400">
                        <p>
                            &copy; {new Date().getFullYear()} Rezume.dev. All rights reserved.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Right Side - Testimonials (Hidden on mobile) */}
            <div className="hidden md:flex md:w-[55%] lg:w-[60%] relative border-l border-gray-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <TestimonialCarousel />
            </div>
        </div>
    );
};
