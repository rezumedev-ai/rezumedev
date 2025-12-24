
import { useResumeScore } from "@/contexts/ResumeScoreContext";
import { cn } from "@/lib/utils";
import { Check, ChevronUp, Sparkles, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ImprovementDrawerContent } from "./ImprovementDrawerContent";

export function ResumeStrengthIndicator() {
    const { score, level, improvements } = useResumeScore();
    const [isOpen, setIsOpen] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [prevScore, setPrevScore] = useState(0);

    // SVG parameters for the circle
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    // Color logic based on score
    const getColor = (s: number) => {
        if (s >= 90) return "text-emerald-500";
        if (s >= 70) return "text-blue-500";
        if (s >= 50) return "text-amber-500";
        return "text-gray-400";
    };

    const getRingColor = (s: number) => {
        if (s >= 90) return "stroke-emerald-500";
        if (s >= 70) return "stroke-blue-500";
        if (s >= 50) return "stroke-amber-500";
        return "stroke-gray-300";
    };

    useEffect(() => {
        if (score === 100 && prevScore < 100) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
        }
        setPrevScore(score);
    }, [score]);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <button
                    className={cn(
                        "group fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-white/90 p-2 pr-4 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:shadow-xl border border-white/20",
                        "dark:bg-gray-900/90 dark:border-gray-800"
                    )}
                >
                    {/* Circular Progress Ring */}
                    <div className="relative h-12 w-12 flex-shrink-0">
                        <svg className="h-full w-full rotate-[-90deg] transform" viewBox="0 0 44 44">
                            {/* Background Ring */}
                            <circle
                                className="stroke-gray-200 dark:stroke-gray-700"
                                strokeWidth="3"
                                fill="transparent"
                                r={radius}
                                cx="22"
                                cy="22"
                            />
                            {/* Progress Ring */}
                            <circle
                                className={cn("transition-all duration-1000 ease-out", getRingColor(score))}
                                strokeWidth="3"
                                strokeLinecap="round"
                                fill="transparent"
                                r={radius}
                                cx="22"
                                cy="22"
                                style={{
                                    strokeDasharray: circumference,
                                    strokeDashoffset: strokeDashoffset,
                                }}
                            />
                        </svg>

                        {/* Center Icon/Number */}
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                            {score === 100 ? (
                                <Trophy className="h-4 w-4 text-emerald-500 animate-bounce" />
                            ) : (
                                <span className={getColor(score)}>{score}</span>
                            )}
                        </div>

                        {/* Pulse effect for unread improvements */}
                        {score < 100 && improvements.length > 0 && (
                            <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white animate-pulse" />
                        )}
                    </div>

                    {/* Text Labels (Hidden on mobile, visible on desktop hover or always if prominent) */}
                    <div className="text-left hidden sm:block">
                        <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                            Resume Health
                        </div>
                        <div className={cn("text-sm font-bold flex items-center gap-1", getColor(score))}>
                            {level}
                            {score < 100 && <ChevronUp className="h-3 w-3 animate-bounce" />}
                        </div>
                    </div>
                </button>
            </SheetTrigger>

            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle className="flex items-center gap-2 text-2xl">
                        <Sparkles className="h-6 w-6 text-indigo-500" />
                        Resume Coach
                    </SheetTitle>
                </SheetHeader>
                <ImprovementDrawerContent />
            </SheetContent>
        </Sheet>
    );
}
