
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PersonalInfoStep } from "@/components/resume-builder/PersonalInfoStep";
import { ProfessionalSummaryStep } from "@/components/resume-builder/ProfessionalSummaryStep";
import { WorkExperienceStep } from "@/components/resume-builder/WorkExperienceStep";
import { EducationStep } from "@/components/resume-builder/EducationStep";
import { SkillsStep } from "@/components/resume-builder/SkillsStep";
import { CertificationsStep } from "@/components/resume-builder/CertificationsStep";
import { ResumePreview } from "@/components/resume-builder/ResumePreview";
import { StepProgress } from "@/components/resume-builder/StepProgress";
import { useResumeBuilder } from "@/hooks/use-resume-builder";
import { QuizFlow } from "@/components/resume-builder/QuizFlow";
import { useNavigate } from "react-router-dom";

export default function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  if (!id) {
    return null;
  }

  const handleComplete = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <QuizFlow resumeId={id} onComplete={handleComplete} />
      </div>
    </div>
  );
}
