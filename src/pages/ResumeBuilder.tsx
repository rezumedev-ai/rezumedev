
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import { getStepTitle, getStepDescription } from "@/utils/resume-steps";

export default function ResumeBuilder() {
  const { id } = useParams();
  const { 
    currentStep, 
    formData, 
    handleInputChange, 
    handleNext, 
    handlePrevious,
    setFormData,
    TOTAL_STEPS 
  } = useResumeBuilder(id);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            formData={formData.personal_info}
            onChange={(field, value) => handleInputChange('personal_info', field, value)}
          />
        );
      case 2:
        return (
          <ProfessionalSummaryStep
            formData={formData.professional_summary}
            onChange={(field, value) => handleInputChange('professional_summary', field, value)}
          />
        );
      case 3:
        return (
          <WorkExperienceStep
            formData={formData.work_experience}
            onChange={(experiences) => setFormData(prev => ({ ...prev, work_experience: experiences }))}
          />
        );
      case 4:
        return (
          <EducationStep
            formData={formData.education}
            onChange={(education) => setFormData(prev => ({ ...prev, education }))}
          />
        );
      case 5:
        return (
          <SkillsStep
            formData={formData.skills}
            onChange={(skills) => setFormData(prev => ({ ...prev, skills }))}
            jobTitle={formData.professional_summary.title}
          />
        );
      case 6:
        return (
          <CertificationsStep
            formData={formData.certifications}
            onChange={(certifications) => setFormData(prev => ({ ...prev, certifications }))}
          />
        );
      case 7:
        return (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <ResumePreview
              personalInfo={formData.personal_info}
              professionalSummary={formData.professional_summary}
              workExperience={formData.work_experience}
              education={formData.education}
              skills={formData.skills}
              certifications={formData.certifications}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <StepProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        <div className={currentStep === 7 ? "" : "grid md:grid-cols-2 gap-8"}>
          {currentStep !== 7 && (
            <Card className="p-6 space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-medium text-gray-900">
                  {getStepTitle(currentStep)}
                </h2>
                <p className="text-sm text-gray-500">
                  {getStepDescription(currentStep)}
                </p>
              </div>

              {renderStep()}
            </Card>
          )}

          {currentStep !== 7 && (
            <div className="space-y-4">
              <Card className="p-6 sticky top-8">
                <h3 className="text-lg font-medium mb-4">Preview</h3>
                <div className="max-h-[calc(100vh-16rem)] overflow-y-auto">
                  <ResumePreview
                    personalInfo={formData.personal_info}
                    professionalSummary={formData.professional_summary}
                    workExperience={formData.work_experience}
                    education={formData.education}
                    skills={formData.skills}
                    certifications={formData.certifications}
                  />
                </div>
              </Card>
            </div>
          )}

          {currentStep === 7 && renderStep()}
        </div>

        <div className="flex justify-between">
          <Button onClick={handlePrevious} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleNext} className="bg-primary hover:bg-primary/90">
            {currentStep === TOTAL_STEPS ? "Finish" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
