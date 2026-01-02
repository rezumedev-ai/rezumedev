
import { useResumeScore } from "@/contexts/ResumeScoreContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, ArrowRight, PartyPopper } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";

export function ImprovementDrawerContent() {
    const { score, improvements, level } = useResumeScore();

    const critical = improvements.filter(i => i.type === "critical");
    const optimizations = improvements.filter(i => i.type === "optimization");

    useEffect(() => {
        if (score === 100) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }, [score]);

    if (score === 100) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-500">
                <div className="bg-emerald-100 p-6 rounded-full mb-6">
                    <PartyPopper className="h-16 w-16 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-black text-emerald-900 mb-2">All Star Status!</h2>
                <p className="text-gray-600 max-w-sm mb-8">
                    Your resume is looking fantastic. You've hit all the key benchmarks for a professional, competitive application.
                </p>
                <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white w-full max-w-xs h-12 text-lg shadow-lg shadow-emerald-200"
                    onClick={() => confetti()}
                >
                    Celebrate Again 🎉
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Score Header */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
                <div className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-1">Current Score</div>
                <div className="text-5xl font-black text-slate-900 mb-2">{score}<span className="text-2xl text-slate-400">/100</span></div>
                <Badge variant={score > 80 ? "default" : "secondary"} className="text-sm px-3 py-1">
                    {level} Level
                </Badge>
            </div>

            {critical.length > 0 && (
                <div className="space-y-3">
                    <h3 className="font-bold text-red-600 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Critical Fixes ({critical.length})
                    </h3>
                    {critical.map(item => (
                        <div key={item.id} className="group flex items-start justify-between p-4 rounded-lg border border-red-100 bg-red-50/50 hover:bg-red-50 transition-colors">
                            <div className="space-y-1">
                                <div className="font-semibold text-slate-800">{item.label}</div>
                                <div className="text-xs text-red-600 font-medium">+{item.points} pts</div>
                            </div>
                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-100">
                                Fix <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {optimizations.length > 0 && (
                <div className="space-y-3">
                    <h3 className="font-bold text-blue-600 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        Quick Wins ({optimizations.length})
                    </h3>
                    {optimizations.map(item => (
                        <div key={item.id} className="group flex items-start justify-between p-4 rounded-lg border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all">
                            <div className="space-y-1">
                                <div className="font-semibold text-slate-800">{item.label}</div>
                                <div className="text-xs text-blue-600 font-medium">+{item.points} pts</div>
                            </div>
                            <Button size="sm" variant="ghost" className="text-slate-500 hover:text-blue-600">
                                Fix <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
