export type CareerStage = 'graduate' | 'climber' | 'switcher' | 'executive' | 'freelancer';
export type Timeline = 'asap' | 'within-2-weeks' | 'within-month' | 'exploring';
export type PrimaryGoal = 'faang' | 'salary-increase' | 'industry-switch' | 'promotion' | 'first-job';
export type PainPoint = 'writing' | 'design' | 'ats' | 'time' | 'standout' | 'tailoring';

export interface OnboardingData {
    careerStage?: CareerStage;
    primaryGoal?: PrimaryGoal;
    timeline?: Timeline;
    painPoints?: PainPoint[];
    aiDemoUsed?: boolean;
    aiDemoInput?: string;
    aiDemoOutput?: string;
    templateSelected?: string;
    subscriptionChosen?: 'monthly' | 'yearly' | 'lifetime' | null;
}

export interface OnboardingResponse {
    id: string;
    user_id: string;
    career_stage: string | null;
    primary_goal: string | null;
    timeline: string | null;
    pain_points: string[] | null;
    ai_demo_used: boolean;
    ai_demo_input: string | null;
    ai_demo_output: string | null;
    template_selected: string | null;
    subscription_chosen: string | null;
    completed_at: string | null;
    conversion_time_seconds: number | null;
    created_at: string;
    updated_at: string;
}
