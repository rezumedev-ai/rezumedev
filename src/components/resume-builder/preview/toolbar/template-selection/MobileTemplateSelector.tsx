import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ResumeTemplate } from "../../../templates";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface MobileTemplateSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    templates: ResumeTemplate[];
    currentTemplateId: string;
    onTemplateChange: (templateId: string) => void;
}

export function MobileTemplateSelector({
    isOpen,
    onClose,
    templates,
    currentTemplateId,
    onTemplateChange
}: MobileTemplateSelectorProps) {
    const [selectedId, setSelectedId] = useState(currentTemplateId);
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        setSelectedId(currentTemplateId);
    }, [currentTemplateId]);

    // Update dimensions on window resize or orientation change
    useEffect(() => {
        const updateDimensions = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', updateDimensions);
        window.addEventListener('orientationchange', updateDimensions);

        return () => {
            window.removeEventListener('resize', updateDimensions);
            window.removeEventListener('orientationchange', updateDimensions);
        };
    }, []);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleSelect = (templateId: string) => {
        setSelectedId(templateId);
        onTemplateChange(templateId);

        // Haptic feedback if supported
        if (window.navigator.vibrate) {
            window.navigator.vibrate(10);
        }

        // Close after a short delay to show selection
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const handleClose = () => {
        onClose();
    };

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                    style={{
                        width: `${dimensions.width}px`,
                        height: `${dimensions.height}px`,
                        position: 'fixed',
                        top: 0,
                        left: 0
                    }}
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="bg-gradient-to-br from-gray-50 to-white overflow-hidden flex flex-col"
                        style={{
                            width: `${dimensions.width}px`,
                            height: `${dimensions.height}px`,
                            position: 'fixed',
                            top: 0,
                            left: 0
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary to-primary/90 px-4 py-6 shadow-lg">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white mb-1">
                                        Choose Your Template
                                    </h2>
                                    <p className="text-sm text-white/80">
                                        Select the perfect design for your resume
                                    </p>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 transition-colors"
                                    aria-label="Close template selector"
                                >
                                    <X className="w-6 h-6 text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Template Grid */}
                        <div className="flex-1 overflow-y-auto overscroll-contain">
                            <motion.div
                                className={cn(
                                    "grid gap-4 p-4 pb-8",
                                    "grid-cols-1 min-[400px]:grid-cols-2"
                                )}
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: {
                                            staggerChildren: 0.05
                                        }
                                    }
                                }}
                            >
                                {templates.map((template) => (
                                    <motion.div
                                        key={template.id}
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: { opacity: 1, y: 0 }
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleSelect(template.id)}
                                        className={cn(
                                            "relative cursor-pointer rounded-xl overflow-hidden bg-white shadow-md transition-all duration-200",
                                            "active:shadow-lg",
                                            selectedId === template.id
                                                ? "ring-4 ring-primary shadow-xl"
                                                : "hover:shadow-lg"
                                        )}
                                    >
                                        {/* Template Image */}
                                        <div className="aspect-[3/4] relative bg-gray-100">
                                            <img
                                                src={template.imageUrl}
                                                alt={template.name}
                                                className="w-full h-full object-cover object-top"
                                                loading="lazy"
                                            />

                                            {/* Selected Badge */}
                                            {selectedId === template.id && (
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className="absolute top-3 right-3 bg-primary text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg"
                                                >
                                                    ✓ Selected
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* Template Name */}
                                        <div className="p-3 bg-white">
                                            <h3 className={cn(
                                                "font-semibold text-center text-sm",
                                                selectedId === template.id
                                                    ? "text-primary"
                                                    : "text-gray-900"
                                            )}>
                                                {template.name}
                                            </h3>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
