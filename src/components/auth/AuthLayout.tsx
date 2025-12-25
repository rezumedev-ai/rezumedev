
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center relative bg-gray-50 selection:bg-primary/20">

            {/* Subtle Background Pattern (Optional - dot pattern) */}
            <div className="absolute inset-0 z-0 opacity-[0.4]"
                style={{
                    backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
                    backgroundSize: "32px 32px"
                }}
            />

            {/* Main Content Card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-[440px] mx-4 relative z-10"
            >
                <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100/50">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-block mb-6 transition-transform hover:scale-[1.02]">
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                                Rezume<span className="text-primary">.dev</span>
                            </h1>
                        </Link>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">
                            {title}
                        </h2>
                        <p className="text-gray-500 text-sm">
                            {subtitle}
                        </p>
                    </div>

                    {/* Form Content */}
                    {children}
                </div>

                {/* Footer Links */}
                <div className="mt-8 text-center text-xs text-gray-400">
                    <p>
                        &copy; {new Date().getFullYear()} Rezume.dev. All rights reserved.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
