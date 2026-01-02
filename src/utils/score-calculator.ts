
import { ResumeData } from "@/types/resume";

export interface ImprovementItem {
    id: string;
    label: string;
    type: "critical" | "optimization";
    points: number;
    section: "personal" | "summary" | "experience" | "education" | "skills";
    isComplete: boolean;
}

export interface ScoreAnalysis {
    score: number;
    improvements: ImprovementItem[];
    level: "Novice" | "Apprentice" | "Professional" | "Executive" | "All-Star";
}

export const calculateResumeScore = (data: ResumeData): ScoreAnalysis => {
    let score = 0;
    const improvements: ImprovementItem[] = [];

    // --- 1. Personal Info (20 pts) ---
    // Email (Critical - 10)
    if (data.personal_info.email && data.personal_info.email.includes("@")) {
        score += 10;
    } else {
        improvements.push({
            id: "missing-email",
            label: "Add a professional email address",
            type: "critical",
            points: 10,
            section: "personal",
            isComplete: false
        });
    }

    // Phone (Critical - 5)
    if (data.personal_info.phone && data.personal_info.phone.length > 5) {
        score += 5;
    } else {
        improvements.push({
            id: "missing-phone",
            label: "Add a phone number",
            type: "critical",
            points: 5,
            section: "personal",
            isComplete: false
        });
    }

    // LinkedIn (Optimization - 5)
    if (data.personal_info.linkedin && data.personal_info.linkedin.length > 5) {
        score += 5;
    } else {
        improvements.push({
            id: "missing-linkedin",
            label: "Add your LinkedIn profile",
            type: "optimization",
            points: 5,
            section: "personal",
            isComplete: false
        });
    }

    // --- 2. Professional Summary (15 pts) ---
    // Title (5)
    if (data.professional_summary.title.length > 2) {
        score += 5;
    } else {
        improvements.push({
            id: "missing-title",
            label: "Add a target Job Title",
            type: "critical",
            points: 5,
            section: "summary",
            isComplete: false
        });
    }

    // Summary Length (10)
    const summaryLength = data.professional_summary.summary.length;
    if (summaryLength > 50) {
        score += 10;
    } else {
        improvements.push({
            id: "short-summary",
            label: "Write a summary of at least 50 characters",
            type: "optimization",
            points: 10,
            section: "summary",
            isComplete: false
        });
    }

    // --- 3. Work Experience (40 pts) ---
    // At least one job (Critical - 15)
    if (data.work_experience.length > 0) {
        score += 15;

        // Check for "Quantifiable Results" (Numbers) in description (Optimization - 25)
        // We look for digits in the description
        const hasNumbers = data.work_experience.some(exp => /\d+/.test((exp.responsibilities || []).join(" ")));
        const hasActionVerbs = data.work_experience.some(exp => ((exp.responsibilities || []).join(" ")).length > 20);

        if (hasNumbers) {
            score += 15;
        } else {
            improvements.push({
                id: "missing-metrics",
                label: "Include numbers (e.g. '20%', '$50k') in your experience",
                type: "optimization",
                points: 15,
                section: "experience",
                isComplete: false
            });
        }

        if (hasActionVerbs) {
            score += 10;
        } else {
            improvements.push({
                id: "short-exp",
                label: "Expand your role descriptions",
                type: "optimization",
                points: 10,
                section: "experience",
                isComplete: false
            });
        }

    } else {
        improvements.push({
            id: "missing-experience",
            label: "Add your play experience",
            type: "critical",
            points: 15,
            section: "experience",
            isComplete: false
        });
    }

    // --- 4. Skills (15 pts) ---
    const totalSkills = (data.skills.hard_skills?.length || 0) + (data.skills.soft_skills?.length || 0);
    if (totalSkills >= 5) {
        score += 15;
    } else if (totalSkills > 0) {
        score += 5;
        improvements.push({
            id: "few-skills",
            label: "Add at least 5 key skills",
            type: "optimization",
            points: 10,
            section: "skills",
            isComplete: false
        });
    } else {
        improvements.push({
            id: "missing-skills",
            label: "Add a Skills section",
            type: "critical",
            points: 15,
            section: "skills",
            isComplete: false
        });
    }

    // --- 5. Education (10 pts) ---
    if (data.education.length > 0) {
        score += 10;
    } else {
        improvements.push({
            id: "missing-education",
            label: "Add your education",
            type: "critical",
            points: 10,
            section: "education",
            isComplete: false
        });
    }

    // Determine Level
    let level: ScoreAnalysis["level"] = "Novice";
    if (score >= 90) level = "All-Star";
    else if (score >= 75) level = "Executive";
    else if (score >= 50) level = "Professional";
    else if (score >= 25) level = "Apprentice";

    return {
        score: Math.min(score, 100),
        improvements,
        level
    };
};
