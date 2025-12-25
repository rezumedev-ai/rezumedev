
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
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black selection:bg-primary/30">
            {/* Animated Background Mesh */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-purple-500/20 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-blue-500/20 blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
            </div>

            {/* Main Content Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-[420px] mx-4 relative z-10"
            >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl ring-1 ring-white/5">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-block mb-6 group">
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 group-hover:to-white transition-all">
                                Rezume.dev
                            </h1>
                        </Link>
                        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                            {title}
                        </h2>
                        <p className="text-white/50 text-base">
                            {subtitle}
                        </p>
                    </div>

                    {/* Form Content */}
                    {children}
                </div>

                {/* Footer Links */}
                <div className="mt-8 text-center">
                    <p className="text-white/30 text-xs">
                        By continuing, you verify that you are a Developer <br />
                        and ready to build a superior career.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
