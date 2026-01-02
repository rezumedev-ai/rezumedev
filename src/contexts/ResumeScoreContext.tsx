
import React, { createContext, useContext, useEffect, useState } from "react";
import { ResumeData } from "@/types/resume";
import { calculateResumeScore, ScoreAnalysis } from "@/utils/score-calculator";

interface ResumeScoreContextType extends ScoreAnalysis {
    refreshScore: () => void;
}

const ResumeScoreContext = createContext<ResumeScoreContextType | undefined>(undefined);

interface ResumeScoreProviderProps {
    children: React.ReactNode;
    resumeData: ResumeData;
}

export function ResumeScoreProvider({ children, resumeData }: ResumeScoreProviderProps) {
    const [analysis, setAnalysis] = useState<ScoreAnalysis>({
        score: 0,
        improvements: [],
        level: "Novice"
    });

    const refreshScore = () => {
        const result = calculateResumeScore(resumeData);
        setAnalysis(result);
    };

    // Auto-calculate logic when data changes
    useEffect(() => {
        // We debounce slightly to avoid rapid updates on every keystroke if typing fast
        const timer = setTimeout(() => {
            refreshScore();
        }, 500);
        return () => clearTimeout(timer);
    }, [resumeData]);

    return (
        <ResumeScoreContext.Provider value={{ ...analysis, refreshScore }}>
            {children}
        </ResumeScoreContext.Provider>
    );
}

export const useResumeScore = () => {
    const context = useContext(ResumeScoreContext);
    if (!context) {
        throw new Error("useResumeScore must be used within a ResumeScoreProvider");
    }
    return context;
};
