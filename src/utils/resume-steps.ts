
export const getStepTitle = (currentStep: number) => {
  switch (currentStep) {
    case 1:
      return "Personal Information";
    case 2:
      return "Professional Summary";
    case 3:
      return "Work Experience";
    case 4:
      return "Education";
    case 5:
      return "Skills";
    case 6:
      return "Certifications";
    case 7:
      return "Review & Finish";
    default:
      return "";
  }
};

export const getStepDescription = (currentStep: number) => {
  switch (currentStep) {
    case 1:
      return "Let's start with your basic information";
    case 2:
      return "Tell us about your career objectives";
    case 3:
      return "Add your relevant work history";
    case 4:
      return "Add your educational background";
    case 5:
      return "List your key skills";
    case 6:
      return "Add any relevant certifications";
    case 7:
      return "Review your resume and make final adjustments";
    default:
      return "";
  }
};
