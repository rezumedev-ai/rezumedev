
import { ResumeData } from "@/types/resume";
import { useToast } from "@/hooks/use-toast";

export function useResumeValidator() {
  const { toast } = useToast();

  const validateCurrentStep = (currentStep: number, formData: ResumeData) => {
    if (currentStep === 1) {
      const requiredFields = ['fullName', 'email', 'phone'];
      const missingFields = requiredFields.filter(field => !formData.personal_info[field as keyof typeof formData.personal_info]);
      if (missingFields.length > 0) {
        toast({
          title: "Required Fields Missing",
          description: `Please fill in: ${missingFields.join(", ")}`,
          variant: "destructive"
        });
        return false;
      }
    } else if (currentStep === 2) {
      const requiredFields = ['title', 'summary'];
      const missingFields = requiredFields.filter(field => !formData.professional_summary[field as keyof typeof formData.professional_summary]);
      if (missingFields.length > 0) {
        toast({
          title: "Required Fields Missing",
          description: `Please fill in: ${missingFields.join(", ")}`,
          variant: "destructive"
        });
        return false;
      }
    } else if (currentStep === 3 && formData.work_experience.length > 0) {
      const hasInvalidExperience = formData.work_experience.some(exp => {
        const isEndDateRequired = !exp.isCurrentJob;
        return !exp.jobTitle || !exp.companyName || !exp.startDate || 
               (isEndDateRequired && !exp.endDate) || exp.responsibilities.some(r => !r.trim());
      });

      if (hasInvalidExperience) {
        toast({
          title: "Incomplete Work Experience",
          description: "Please fill in all required fields for each work experience entry",
          variant: "destructive"
        });
        return false;
      }
    } else if (currentStep === 4 && formData.education.length > 0) {
      const hasInvalidEducation = formData.education.some(edu => {
        const isEndDateRequired = !edu.isCurrentlyEnrolled;
        return !edu.degreeName || !edu.schoolName || !edu.startDate || 
               (isEndDateRequired && !edu.endDate);
      });

      if (hasInvalidEducation) {
        toast({
          title: "Incomplete Education",
          description: "Please fill in all required fields for each education entry",
          variant: "destructive"
        });
        return false;
      }
    } else if (currentStep === 6 && formData.certifications.length > 0) {
      const hasInvalidCertification = formData.certifications.some(cert => {
        return !cert.name || !cert.organization || !cert.completionDate;
      });

      if (hasInvalidCertification) {
        toast({
          title: "Incomplete Certification",
          description: "Please fill in all required fields for each certification",
          variant: "destructive"
        });
        return false;
      }
    }
    return true;
  };

  return { validateCurrentStep };
}
