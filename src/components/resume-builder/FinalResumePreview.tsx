import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ResumeData } from "@/types/resume";
import { resumeTemplates } from "./templates";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { ResumeHeader } from "./preview/ResumeHeader";
import { PersonalSection } from "./preview/PersonalSection";
import { ExperienceSection } from "./preview/ExperienceSection";
import { EducationSection } from "./preview/EducationSection";
import { SkillsSection } from "./preview/SkillsSection";
import { CertificationsSection } from "./preview/CertificationsSection";
import { DownloadOptionsDialog } from "./preview/DownloadOptionsDialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { cn } from "@/utils/cn";
import { Mail, Phone, Linkedin, Globe } from "lucide-react";

interface FinalResumePreviewProps {
  resumeData: ResumeData;
  resumeId: string;
}

export function FinalResumePreview({
  resumeData: initialResumeData,
  resumeId
}: FinalResumePreviewProps) {
  const [scale, setScale] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [resumeData, setResumeData] = useState(initialResumeData);
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialResumeData.template_id || "executive-clean");
  const [isDownloading, setIsDownloading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const A4_WIDTH_PX = 794;
  const A4_HEIGHT_PX = 1123;
  const CONTENT_MARGIN = 48;

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleUpdateField = async (
    section: keyof ResumeData,
    field: string,
    value: any,
    subsection?: string
  ) => {
    const newResumeData = { ...resumeData };
    
    if (subsection) {
      newResumeData[section][subsection][field] = value;
    } else {
      newResumeData[section][field] = value;
    }
    
    setResumeData(newResumeData);
    
    try {
      const updateData = {
        [section]: newResumeData[section] as unknown as Json
      };
      
      await supabase
        .from("resumes")
        .update(updateData)
        .eq("id", resumeId);
    } catch (error) {
      toast.error("Failed to save changes. Please try again.");
      setResumeData(prevData => ({ ...prevData }));
    }
  };

  const handleAddExperience = () => {
    const newExperiences = [...resumeData.work_experience, {
      jobTitle: "",
      companyName: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrentJob: false,
      responsibilities: [""]
    }];
    handleUpdateField("work_experience", "", newExperiences);
  };

  const handleRemoveExperience = (index: number) => {
    const newExperiences = resumeData.work_experience.filter((_, i) => i !== index);
    handleUpdateField("work_experience", "", newExperiences);
  };

  const handleTemplateChange = async (templateId: string) => {
    setSelectedTemplateId(templateId);
    try {
      await supabase
        .from("resumes")
        .update({ template_id: templateId })
        .eq("id", resumeId);
      
      toast.success("Template updated successfully");
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error("Failed to update template");
    }
  };

  useEffect(() => {
    const calculateScale = () => {
      if (containerRef.current && resumeRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        
        const scaleX = (containerWidth - 48) / A4_WIDTH_PX;
        const scaleY = (containerHeight - 48) / A4_HEIGHT_PX;
        
        let newScale = Math.min(scaleX, scaleY, 1);
        
        if (isMobile) {
          newScale = isZoomed ? 0.8 : 0.4;
        } else {
          newScale = Math.min(newScale, 0.85);
        }
        
        setScale(newScale);
      }
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [isMobile, isZoomed]);

  const selectedTemplate = resumeTemplates.find(t => t.id === selectedTemplateId) || resumeTemplates[0];

  const renderContent = () => {
    if (selectedTemplate.id === "professional-executive") {
      const workExperienceCount = resumeData.work_experience.length;
      const skillsCount = resumeData.skills.hard_skills.length;
      const summaryLength = resumeData.professional_summary.summary.length;
      
      const nameSize = workExperienceCount <= 2 ? "46px" : "42px";
      const titleSize = workExperienceCount <= 2 ? "22px" : "20px";
      const jobTitleSize = workExperienceCount <= 2 ? "16px" : "15px";
      const bodyTextSize = workExperienceCount <= 2 ? "15px" : "14px";
      const responsibilitiesLineHeight = workExperienceCount <= 2 ? "1.8" : "1.6";

      return (
        <div className="flex justify-center items-start w-full">
          <div className="bg-white" style={{ width: '21cm', minHeight: '29.7cm' }}>
            <div className="p-[2.54cm]">
              {/* Header */}
              <div className="mb-8">
                <h1 
                  className="font-sans font-black tracking-wide text-black uppercase mb-3 block text-center"
                  style={{ fontSize: nameSize }}
                >
                  {resumeData.personal_info.fullName}
                </h1>
                <div 
                  className="font-light italic text-gray-600 block text-center"
                  style={{ fontSize: titleSize }}
                >
                  {resumeData.professional_summary.title}
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-[0.8fr_2fr] gap-8 relative">
                {/* Vertical Divider */}
                <div className="absolute left-[28.5%] top-0 bottom-0 w-[1px] bg-gray-300" />

                {/* Left Column */}
                <div className="pr-8 space-y-7">
                  {/* Contact Section */}
                  <div>
                    <h2 className="text-[16px] font-bold text-black uppercase tracking-wider mb-3">
                      Contact
                    </h2>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5 w-full">
                        <Phone className="w-4 h-4 shrink-0" />
                        <span className="text-gray-700 truncate" style={{ fontSize: bodyTextSize }}>
                          {resumeData.personal_info.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 w-full">
                        <Mail className="w-4 h-4 shrink-0" />
                        <span className="text-gray-700 truncate" style={{ fontSize: bodyTextSize }}>
                          {resumeData.personal_info.email}
                        </span>
                      </div>
                      {resumeData.personal_info.linkedin && (
                        <div className="flex items-center gap-2.5 w-full">
                          <Linkedin className="w-4 h-4 shrink-0" />
                          <span className="text-gray-700 truncate" style={{ fontSize: bodyTextSize }}>
                            {resumeData.personal_info.linkedin}
                          </span>
                        </div>
                      )}
                      {resumeData.personal_info.website && (
                        <div className="flex items-center gap-2.5 w-full">
                          <Globe className="w-4 h-4 shrink-0" />
                          <span className="text-gray-700 truncate" style={{ fontSize: bodyTextSize }}>
                            {resumeData.personal_info.website}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Education Section */}
                  {resumeData.education.length > 0 && (
                    <div>
                      <h2 className="text-[16px] font-bold text-black uppercase tracking-wider mb-3">
                        Education
                      </h2>
                      <div className="space-y-3">
                        {resumeData.education.map((edu, index) => (
                          <div key={index}>
                            <div className="font-semibold" style={{ fontSize: bodyTextSize }}>{edu.schoolName}</div>
                            <div className="text-gray-600" style={{ fontSize: bodyTextSize }}>{edu.degreeName}</div>
                            <div className="text-gray-500" style={{ fontSize: `${parseInt(bodyTextSize) - 1}px` }}>
                              {edu.startDate} - {edu.isCurrentlyEnrolled ? "Present" : edu.endDate}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills Section */}
                  {resumeData.skills.hard_skills.length > 0 && (
                    <div>
                      <h2 className="text-[16px] font-bold text-black uppercase tracking-wider mb-3">
                        Skills
                      </h2>
                      <div className="space-y-1.5">
                        {resumeData.skills.hard_skills.map((skill, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                            <span className="text-gray-700" style={{ fontSize: bodyTextSize }}>{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="pl-8 space-y-7">
                  {/* Profile Section */}
                  <div>
                    <h2 className="text-[16px] font-bold text-black uppercase tracking-wider mb-3">
                      Profile
                    </h2>
                    <p 
                      className="text-gray-700 leading-relaxed"
                      style={{ fontSize: bodyTextSize }}
                    >
                      {resumeData.professional_summary.summary}
                    </p>
                  </div>

                  {/* Work Experience Section */}
                  {resumeData.work_experience.length > 0 && (
                    <div>
                      <h2 className="text-[16px] font-bold text-black uppercase tracking-wider mb-4">
                        Work Experience
                      </h2>
                      <div className="space-y-5">
                        {resumeData.work_experience.map((exp, index) => (
                          <div key={index} className="pb-2">
                            <div 
                              className="font-bold uppercase text-gray-900 block"
                              style={{ fontSize: jobTitleSize }}
                            >
                              {exp.jobTitle}
                            </div>
                            <div 
                              className="text-gray-700 font-semibold mb-1"
                              style={{ fontSize: bodyTextSize }}
                            >
                              {exp.companyName}
                            </div>
                            <div 
                              className="text-gray-500 mb-2"
                              style={{ fontSize: `${parseInt(bodyTextSize) - 1}px` }}
                            >
                              {exp.startDate} - {exp.isCurrentJob ? "Present" : exp.endDate}
                            </div>
                            <ul className="space-y-2">
                              {exp.responsibilities.map((resp, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-black mt-[7px] shrink-0" />
                                  <span 
                                    className="text-gray-700"
                                    style={{ 
                                      fontSize: bodyTextSize,
                                      lineHeight: responsibilitiesLineHeight 
                                    }}
                                  >
                                    {resp}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-[700px] mx-auto">
        <PersonalSection
          fullName={resumeData.personal_info.fullName}
          title={resumeData.professional_summary.title}
          email={resumeData.personal_info.email}
          phone={resumeData.personal_info.phone}
          linkedin={resumeData.personal_info.linkedin}
          template={selectedTemplate}
          isEditing={isEditing}
          onUpdate={(field, value) => handleUpdateField("personal_info", field, value)}
        />

        <div className="mb-4">
          <h3 className="text-base font-bold text-black uppercase tracking-wider mb-3 border-b border-black pb-1">
            Professional Summary
          </h3>
          <div className="text-sm leading-relaxed">
            {isEditing ? (
              <Textarea
                value={resumeData.professional_summary.summary}
                onChange={(e) => handleUpdateField("professional_summary", "summary", e.target.value)}
                placeholder="Write a brief professional summary"
                className="w-full h-24 resize-none"
              />
            ) : (
              resumeData.professional_summary.summary
            )}
          </div>
        </div>

        <ExperienceSection
          experiences={resumeData.work_experience}
          template={selectedTemplate}
          isEditing={isEditing}
          onUpdate={(index, field, value) => {
            const newExperiences = [...resumeData.work_experience];
            newExperiences[index] = { ...newExperiences[index], [field]: value };
            handleUpdateField("work_experience", "", newExperiences);
          }}
          onAdd={handleAddExperience}
          onRemove={handleRemoveExperience}
        />

        <EducationSection
          education={resumeData.education}
          template={selectedTemplate}
          isEditing={isEditing}
          onUpdate={(index, field, value) => {
            const newEducation = [...resumeData.education];
            newEducation[index] = { ...newEducation[index], [field]: value };
            handleUpdateField("education", "", newEducation);
          }}
        />

        <SkillsSection
          hardSkills={resumeData.skills.hard_skills}
          softSkills={resumeData.skills.soft_skills}
          template={selectedTemplate}
          isEditing={isEditing}
          onUpdate={(type, skills) => {
            handleUpdateField("skills", type === "hard" ? "hard_skills" : "soft_skills", skills);
          }}
        />

        <CertificationsSection
          certifications={resumeData.certifications}
          template={selectedTemplate}
          isEditing={isEditing}
          onUpdate={(index, field, value) => {
            const newCertifications = [...resumeData.certifications];
            newCertifications[index] = { ...newCertifications[index], [field]: value };
            handleUpdateField("certifications", "", newCertifications);
          }}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ResumeHeader
        onBack={handleBack}
        onEdit={() => setIsEditing(!isEditing)}
        isEditing={isEditing}
        isDownloading={isDownloading}
        onTemplateChange={handleTemplateChange}
        selectedTemplate={selectedTemplateId}
      >
        <DownloadOptionsDialog isDownloading={isDownloading} />
      </ResumeHeader>

      <div 
        ref={containerRef}
        className="flex-1 relative flex items-start justify-center p-4 md:p-8 bg-gray-100 overflow-auto"
      >
        <div 
          ref={resumeRef}
          id="resume-content"
          className={cn(
            "bg-white shadow-lg mx-auto relative transition-all duration-200",
            selectedTemplate.style.contentStyle
          )}
          style={{
            width: selectedTemplate.style.dimensions.maxWidth,
            minHeight: selectedTemplate.style.dimensions.minHeight,
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            padding: selectedTemplate.style.spacing.margins.top,
            paddingRight: selectedTemplate.style.spacing.margins.right,
            paddingBottom: selectedTemplate.style.spacing.margins.bottom,
            paddingLeft: selectedTemplate.style.spacing.margins.left,
          }}
        >
          <div 
            ref={contentRef}
            className="w-full h-full"
            style={{
              fontFamily: selectedTemplate.style.layout === "modern" ? 
                'Inter, sans-serif' : 
                selectedTemplate.style.layout === "minimal" ?
                'Helvetica, Arial, sans-serif' :
                'Georgia, serif',
              fontSize: selectedTemplate.style.typography.bodySize,
              lineHeight: selectedTemplate.style.typography.lineHeight,
              color: selectedTemplate.style.colors.text
            }}
          >
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
