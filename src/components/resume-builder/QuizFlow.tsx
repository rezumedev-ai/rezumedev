import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, User, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WorkExperienceStep } from "./WorkExperienceStep";
import { EducationStep } from "./EducationStep";
import { CertificationsStep } from "./CertificationsStep";
import { ResumePreview } from "./ResumePreview";
import { QuestionForm } from "./quiz/QuestionForm";
import { QuizProgress, quizSteps } from "./quiz/QuizProgress";
import { questions } from "./quiz/questions";
import { ResumeData, WorkExperience, Education, Certification } from "@/types/resume";
import { Json } from "@/integrations/supabase/types";
import { LoadingState } from "./LoadingState";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PersonalInfoStep } from "./PersonalInfoStep";

interface QuizFlowProps {
  resumeId: string;
  onComplete: () => void;
}

export function QuizFlow({ resumeId, onComplete }: QuizFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [useProfileData, setUseProfileData] = useState(false);
  const [showRecipientStep, setShowRecipientStep] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  const [formData, setFormData] = useState<ResumeData>({
    personal_info: {
      fullName: "",
      email: "",
      phone: "",
      linkedin: "",
      website: "",
    },
    professional_summary: {
      title: "",
      summary: ""
    },
    work_experience: [],
    education: [],
    certifications: [],
    skills: {
      hard_skills: [],
      soft_skills: [],
    }
  });

  const navigate = useNavigate();
  
  // Fetch user profile data
  const { data: profileData } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
        
      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }
      
      return data;
    },
    enabled: !!user
  });

  const convertWorkExperience = (json: Json[] | null): WorkExperience[] => {
    if (!Array.isArray(json)) return [];
    return json.map(item => {
      if (typeof item !== 'object' || !item) return null;
      const exp = item as Record<string, unknown>;
      if (
        typeof exp.jobTitle === 'string' &&
        typeof exp.companyName === 'string' &&
        typeof exp.startDate === 'string' &&
        typeof exp.endDate === 'string' &&
        Array.isArray(exp.responsibilities)
      ) {
        const workExp: WorkExperience = {
          jobTitle: exp.jobTitle,
          companyName: exp.companyName,
          startDate: exp.startDate,
          endDate: exp.endDate,
          responsibilities: exp.responsibilities.filter((r): r is string => typeof r === 'string')
        };

        if (typeof exp.location === 'string') {
          workExp.location = exp.location;
        }
        if (typeof exp.isCurrentJob === 'boolean') {
          workExp.isCurrentJob = exp.isCurrentJob;
        }

        return workExp;
      }
      return null;
    }).filter((item): item is WorkExperience => item !== null);
  };

  const convertEducation = (json: Json[] | null): Education[] => {
    if (!Array.isArray(json)) return [];
    return json.map(item => {
      if (typeof item !== 'object' || !item) return null;
      const edu = item as Record<string, unknown>;
      if (
        typeof edu.degreeName === 'string' &&
        typeof edu.schoolName === 'string' &&
        typeof edu.startDate === 'string' &&
        typeof edu.endDate === 'string'
      ) {
        const education: Education = {
          degreeName: edu.degreeName,
          schoolName: edu.schoolName,
          startDate: edu.startDate,
          endDate: edu.endDate
        };

        if (typeof edu.isCurrentlyEnrolled === 'boolean') {
          education.isCurrentlyEnrolled = edu.isCurrentlyEnrolled;
        }

        return education;
      }
      return null;
    }).filter((item): item is Education => item !== null);
  };

  const convertCertifications = (json: Json[] | null): Certification[] => {
    if (!Array.isArray(json)) return [];
    return json.map(item => {
      if (typeof item !== 'object' || !item) return null;
      const cert = item as Record<string, unknown>;
      if (
        typeof cert.name === 'string' &&
        typeof cert.organization === 'string' &&
        typeof cert.completionDate === 'string'
      ) {
        return {
          name: cert.name,
          organization: cert.organization,
          completionDate: cert.completionDate
        };
      }
      return null;
    }).filter((item): item is Certification => item !== null);
  };

  const { data: existingData } = useQuery({
    queryKey: ['resume-data', resumeId],
    queryFn: async () => {
      const [resumeResponse, quizResponse] = await Promise.all([
        supabase.from('resumes').select('*').eq('id', resumeId).single(),
        supabase.from('resume_quiz_responses').select('*').eq('resume_id', resumeId)
      ]);

      if (resumeResponse.error) throw resumeResponse.error;
      
      return {
        resume: resumeResponse.data,
        quizResponses: quizResponse.data || []
      };
    }
  });

  // Apply profile data if user chooses to use it
  useEffect(() => {
    if (useProfileData && profileData) {
      setFormData(prev => ({
        ...prev,
        personal_info: {
          ...prev.personal_info,
          fullName: profileData.full_name || "",
          email: user?.email || "",
          phone: profileData.phone || "",
          linkedin: profileData.linkedin_url || "",
          website: profileData.website_url || ""
        }
      }));
      
      // Skip personal info questions if using profile data
      if (currentStep === 0 && currentQuestionIndex === 0) {
        // Find the first non-personal info question
        const firstNonPersonalIndex = questions.findIndex(q => q.type !== "personal_info");
        if (firstNonPersonalIndex > 0) {
          setCurrentQuestionIndex(firstNonPersonalIndex);
        }
      }
    }
  }, [useProfileData, profileData, user]);

  useEffect(() => {
    if (existingData?.resume) {
      const resume = existingData.resume;
      setFormData({
        personal_info: resume.personal_info as ResumeData['personal_info'] || formData.personal_info,
        professional_summary: resume.professional_summary as ResumeData['professional_summary'] || formData.professional_summary,
        work_experience: convertWorkExperience(resume.work_experience),
        education: convertEducation(resume.education),
        certifications: convertCertifications(resume.certifications),
        skills: resume.skills as ResumeData['skills'] || { hard_skills: [], soft_skills: [] }
      });

      const lastResponse = existingData.quizResponses
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
      
      if (lastResponse) {
        const questionIndex = questions.findIndex(q => q.field === lastResponse.question_key);
        if (questionIndex !== -1) {
          setCurrentQuestionIndex(questionIndex);
        }
      }
      
      // If resume is already in progress, skip the recipient step
      if (resume.current_step > 1) {
        setShowRecipientStep(false);
      }
    }
  }, [existingData]);

  const currentQuestion = questions[currentQuestionIndex];

  const saveQuizResponse = async (field: string, value: any) => {
    try {
      await supabase.from('resume_quiz_responses').insert({
        resume_id: resumeId,
        question_key: field,
        response: value
      });

      if (currentQuestion.type === "professional_summary") {
        await supabase
          .from('resumes')
          .update({
            professional_summary: {
              ...formData.professional_summary,
              [field]: value
            }
          })
          .eq('id', resumeId);
      } else {
        await supabase
          .from('resumes')
          .update({
            personal_info: {
              ...formData.personal_info,
              [field]: value
            }
          })
          .eq('id', resumeId);
      }
    } catch (error) {
      console.error('Error saving quiz response:', error);
      toast({
        title: "Error",
        description: "Failed to save your response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = async (value: string) => {
    if (currentQuestion.type === "professional_summary") {
      setFormData(prev => ({
        ...prev,
        professional_summary: {
          ...prev.professional_summary,
          [currentQuestion.field]: value,
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        personal_info: {
          ...prev.personal_info,
          [currentQuestion.field]: value,
        }
      }));
    }
    
    await saveQuizResponse(currentQuestion.field, value);
  };

  const handleNext = async () => {
    if (showRecipientStep) {
      // Save the user's choice about using profile data
      if (useProfileData) {
        // Update resume with profile data
        await supabase
          .from('resumes')
          .update({
            personal_info: formData.personal_info
          })
          .eq('id', resumeId);
      }
      
      setShowRecipientStep(false);
      return;
    }
    
    const currentValue = currentQuestion.type === "professional_summary" 
      ? formData.professional_summary[currentQuestion.field as keyof typeof formData.professional_summary]
      : formData.personal_info[currentQuestion.field as keyof typeof formData.personal_info];

    if (currentQuestion.required && !currentValue) {
      toast({
        title: "Required Field",
        description: "Please fill out this field to continue",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestionIndex === questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      
      // Skip personal info questions if using profile data
      if (useProfileData) {
        const nextQuestion = questions[currentQuestionIndex + 1];
        if (nextQuestion && nextQuestion.type === "personal_info") {
          let nextIndex = currentQuestionIndex + 2;
          while (
            nextIndex < questions.length && 
            questions[nextIndex].type === "personal_info"
          ) {
            nextIndex++;
          }
          
          // If we've gone past all questions, move to next step
          if (nextIndex >= questions.length) {
            setCurrentStep(prev => prev + 1);
          } else {
            setCurrentQuestionIndex(nextIndex);
          }
        }
      }
    }
  };

  const handleStepComplete = async () => {
    if (currentStep === quizSteps.length - 1) {
      try {
        setIsEnhancing(true);
        await supabase
          .from('resumes')
          .update({
            personal_info: formData.personal_info as Json,
            professional_summary: formData.professional_summary as Json,
            work_experience: formData.work_experience as unknown as Json[],
            education: formData.education as unknown as Json[],
            certifications: formData.certifications as unknown as Json[],
            completion_status: 'enhancing'
          })
          .eq('id', resumeId);
      
        const { data, error } = await supabase.functions.invoke('generate-professional-resume', {
          body: { 
            resumeData: formData,
            resumeId: resumeId
          }
        });

        if (error) {
          console.error('Error enhancing resume:', error);
          toast({
            title: "Resume Generation Failed",
            description: "We encountered an error while generating your resume. Please try again or contact support if the issue persists.",
            variant: "destructive",
          });
          setIsEnhancing(false);
          return;
        }

        let attempts = 0;
        const maxAttempts = 30;
        const checkCompletion = setInterval(async () => {
          attempts++;
          console.log(`Checking completion attempt ${attempts}`);

          const { data: pollData, error: pollError } = await supabase
            .from('resumes')
            .select('completion_status')
            .eq('id', resumeId)
            .single();

          if (pollError) {
            clearInterval(checkCompletion);
            setIsEnhancing(false);
            toast({
              title: "Error",
              description: "Failed to check resume status. Please try again.",
              variant: "destructive",
            });
            return;
          }

          if (pollData.completion_status === 'completed') {
            clearInterval(checkCompletion);
            setIsEnhancing(false);
            onComplete();
          } else if (pollData.completion_status === 'error') {
            clearInterval(checkCompletion);
            setIsEnhancing(false);
            toast({
              title: "Resume Generation Failed",
              description: "There was an error generating your resume. Please try again.",
              variant: "destructive",
            });
          } else if (attempts >= maxAttempts) {
            clearInterval(checkCompletion);
            setIsEnhancing(false);
            toast({
              title: "Timeout",
              description: "Resume generation is taking longer than expected. Please try again.",
              variant: "destructive",
            });
          }
        }, 2000);

      } catch (error) {
        console.error('Error in handleStepComplete:', error);
        setIsEnhancing(false);
        toast({
          title: "Error",
          description: "Failed to process your resume. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (showPreview) {
      setShowPreview(false);
    } else if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSaveAndExit = async () => {
    try {
      await supabase
        .from('resumes')
        .update({
          personal_info: formData.personal_info,
          professional_summary: formData.professional_summary,
          current_step: currentQuestionIndex + 1
        })
        .eq('id', resumeId);

      toast({
        title: "Progress saved",
        description: "You can continue from where you left off in the dashboard.",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        title: "Error",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isEnhancing) {
    return <LoadingState status="enhancing" />;
  }

  const renderStep = () => {
    if (showRecipientStep && user) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-6"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Who is this resume for?</h2>
          
          <RadioGroup 
            defaultValue="me" 
            className="mt-6 space-y-4"
            onValueChange={(value) => setUseProfileData(value === "me")}
          >
            <div>
              <Card className={`p-4 ${useProfileData ? 'border-primary' : 'border-gray-200'} cursor-pointer hover:border-primary transition-all duration-300`}
                onClick={() => setUseProfileData(true)}>
                <div className="flex items-start space-x-4">
                  <RadioGroupItem value="me" id="me" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="me" className="text-lg font-medium cursor-pointer">Me</Label>
                      <User className="h-4 w-4 text-blue-500" />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Use my personal information stored in my profile
                    </p>
                    
                    {profileData && (
                      <div className="mt-3 bg-gray-50 p-3 rounded-md">
                        <div className="grid grid-cols-1 gap-1 text-sm">
                          <div><span className="font-medium">Name:</span> {profileData.full_name || 'Not set'}</div>
                          <div><span className="font-medium">Email:</span> {user?.email || 'Not set'}</div>
                          <div><span className="font-medium">Phone:</span> {profileData.phone || 'Not set'}</div>
                          <div><span className="font-medium">LinkedIn:</span> {profileData.linkedin_url || 'Not set'}</div>
                          <div><span className="font-medium">Website:</span> {profileData.website_url || 'Not set'}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
            
            <div>
              <Card className={`p-4 ${!useProfileData ? 'border-primary' : 'border-gray-200'} cursor-pointer hover:border-primary transition-all duration-300`}
                onClick={() => setUseProfileData(false)}>
                <div className="flex items-start space-x-4">
                  <RadioGroupItem value="other" id="other" className="mt-1" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="other" className="text-lg font-medium cursor-pointer">Someone else</Label>
                      <UserPlus className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Enter new information for this resume
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </RadioGroup>
        </motion.div>
      );
    }
    
    switch (quizSteps[currentStep].type) {
      case "personal_info":
        if (useProfileData && profileData) {
          // Skip personal info questions if we're using profile data
          return (
            <AnimatePresence mode="wait">
              <QuestionForm
                question={currentQuestion}
                value={
                  currentQuestion.type === "professional_summary"
                    ? formData.professional_summary[currentQuestion.field as keyof typeof formData.professional_summary] as string
                    : formData.personal_info[currentQuestion.field as keyof typeof formData.personal_info] as string
                }
                onChange={handleInputChange}
              />
            </AnimatePresence>
          );
        } else {
          // For the personal_info step, use the PersonalInfoStep component instead
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <PersonalInfoStep
                formData={formData.personal_info}
                onChange={(field, value) => {
                  setFormData(prev => ({
                    ...prev,
                    personal_info: {
                      ...prev.personal_info,
                      [field]: value
                    }
                  }));
                  saveQuizResponse(field, value);
                }}
                useProfileData={useProfileData}
              />
            </motion.div>
          );
        }
      case "professional_summary":
        return (
          <AnimatePresence mode="wait">
            <QuestionForm
              question={currentQuestion}
              value={
                currentQuestion.type === "professional_summary"
                  ? formData.professional_summary[currentQuestion.field as keyof typeof formData.professional_summary] as string
                  : formData.personal_info[currentQuestion.field as keyof typeof formData.personal_info] as string
              }
              onChange={handleInputChange}
            />
          </AnimatePresence>
        );
      case "work_experience":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <WorkExperienceStep
              formData={formData.work_experience}
              onChange={(experiences) => setFormData(prev => ({ ...prev, work_experience: experiences }))}
              hideAiSuggestions={true}
            />
          </motion.div>
        );
      case "education":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <EducationStep
              formData={formData.education}
              onChange={(education) => setFormData(prev => ({ ...prev, education }))}
            />
          </motion.div>
        );
      case "certifications":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <CertificationsStep
              formData={formData.certifications}
              onChange={(certifications) => setFormData(prev => ({ ...prev, certifications }))}
            />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white overflow-x-hidden">
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6">
        {!showRecipientStep && (
          <QuizProgress currentStep={currentStep} steps={quizSteps} />
        )}

        <motion.div
          className="relative bg-white rounded-xl shadow-xl p-4 sm:p-8 backdrop-blur-sm bg-opacity-90 border border-indigo-100 overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>

        <motion.div 
          className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={(currentStep === 0 && currentQuestionIndex === 0 && !showRecipientStep) || (showRecipientStep)}
              className="transition-all duration-300 hover:shadow-md bg-white border-indigo-200 hover:border-indigo-300 h-11 min-w-[90px] sm:min-w-[100px]"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveAndExit}
              className="transition-all duration-300 hover:shadow-md bg-white border-indigo-200 hover:border-indigo-300 h-11 min-w-[110px] sm:min-w-[120px]"
            >
              Save & Exit
            </Button>
          </div>
          <Button 
            onClick={currentQuestionIndex === questions.length - 1 && !showRecipientStep ? handleStepComplete : handleNext}
            className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:shadow-md h-11 min-w-[90px] sm:min-w-[100px] w-full sm:w-auto mt-2 sm:mt-0"
          >
            {showRecipientStep ? "Continue" : (currentStep === quizSteps.length - 1 ? "Complete" : "Next")}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>

        {!showRecipientStep && (
          <motion.div 
            className="mt-4 text-center text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Step {currentStep + 1} of {quizSteps.length}
          </motion.div>
        )}
      </div>
    </div>
  );
}
