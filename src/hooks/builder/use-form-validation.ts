
import { toast } from "@/hooks/use-toast";
import { ResumeData } from "@/types/resume";

export function useFormValidation() {
  const validatePersonalInfo = (personalInfo: ResumeData['personal_info']) => {
    const requiredFields = ['fullName', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => 
      !personalInfo[field as keyof typeof personalInfo]
    );
    
    if (missingFields.length > 0) {
      toast({
        title: "Required Fields Missing",
        description: `Please fill in: ${missingFields.join(", ")}`,
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const validateProfessionalSummary = (summary: ResumeData['professional_summary']) => {
    const requiredFields = ['title', 'summary'];
    const missingFields = requiredFields.filter(field => 
      !summary[field as keyof typeof summary]
    );
    
    if (missingFields.length > 0) {
      toast({
        title: "Required Fields Missing",
        description: `Please fill in: ${missingFields.join(", ")}`,
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const validateWorkExperience = (workExperience: ResumeData['work_experience']) => {
    if (workExperience.length === 0) return true;
    
    const hasInvalidExperience = workExperience.some(exp => {
      const isEndDateRequired = !exp.isCurrentJob;
      return !exp.jobTitle || 
             !exp.companyName || 
             !exp.startDate || 
             (isEndDateRequired && !exp.endDate) || 
             exp.responsibilities.some(r => !r.trim());
    });

    if (hasInvalidExperience) {
      toast({
        title: "Incomplete Work Experience",
        description: "Please fill in all required fields for each work experience entry",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const validateEducation = (education: ResumeData['education']) => {
    if (education.length === 0) return true;
    
    const hasInvalidEducation = education.some(edu => {
      const isEndDateRequired = !edu.isCurrentlyEnrolled;
      return !edu.degreeName || 
             !edu.schoolName || 
             !edu.startDate || 
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
    
    return true;
  };

  const validateCertifications = (certifications: ResumeData['certifications']) => {
    if (certifications.length === 0) return true;
    
    const hasInvalidCertification = certifications.some(cert => {
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
    
    return true;
  };

  const validateCurrentStep = (currentStep: number, formData: ResumeData) => {
    switch (currentStep) {
      case 1:
        return validatePersonalInfo(formData.personal_info);
      case 2:
        return validateProfessionalSummary(formData.professional_summary);
      case 3:
        return validateWorkExperience(formData.work_experience);
      case 4:
        return validateEducation(formData.education);
      case 6:
        return validateCertifications(formData.certifications);
      default:
        return true;
    }
  };

  return {
    validateCurrentStep
  };
}
