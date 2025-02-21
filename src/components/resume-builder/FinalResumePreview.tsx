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

  // Fixed US Letter size constants
  const DPI = 96; // Standard screen DPI
  const WIDTH_INCHES = 8.5;
  const HEIGHT_INCHES = 11;
  const WIDTH_PX = Math.floor(WIDTH_INCHES * DPI); // 816px
  const HEIGHT_PX = Math.floor(HEIGHT_INCHES * DPI); // 1056px

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
      if (!containerRef.current || !resumeRef.current) return;

      const container = containerRef.current;
      const containerWidth = container.clientWidth - 48; // Account for padding
      const containerHeight = container.clientHeight - 48;

      // Calculate scale based on container size
      const scaleX = containerWidth / WIDTH_PX;
      const scaleY = containerHeight / HEIGHT_PX;
      let newScale = Math.min(scaleX, scaleY, 1);

      // Adjust scale for mobile
      if (isMobile) {
        newScale = isZoomed ? 0.8 : 0.4;
      } else {
        newScale = Math.min(newScale, 0.85);
      }

      setScale(newScale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [isMobile, isZoomed]);

  const selectedTemplate = resumeTemplates.find(t => t.id === selectedTemplateId) || resumeTemplates[0];

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
        className="flex-1 flex items-center justify-center p-4 md:p-8 bg-gray-100 overflow-hidden"
      >
        <div 
          ref={resumeRef}
          id="resume-content"
          className="bg-white shadow-xl"
          style={{
            width: `${WIDTH_PX}px`,
            height: `${HEIGHT_PX}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'center',
            margin: '0',
            padding: '0',
            position: 'absolute',
            boxSizing: 'border-box',
            overflow: 'hidden',
            // Force exact dimensions
            minWidth: `${WIDTH_PX}px`,
            maxWidth: `${WIDTH_PX}px`,
            minHeight: `${HEIGHT_PX}px`,
            maxHeight: `${HEIGHT_PX}px`,
          }}
        >
          <div 
            ref={contentRef}
            style={{
              position: 'absolute',
              top: '1in',
              right: '1in',
              bottom: '1in',
              left: '1in',
              overflow: 'hidden',
              boxSizing: 'border-box',
            }}
          >
            {selectedTemplate.id === "professional-executive" ? (
              <div className="mx-auto" style={{ width: '21cm', minHeight: '29.7cm' }}>
                <div className="p-[2.54cm]">
                  {/* Header */}
                  <div className="mb-8">
                    <h1 className="font-sans text-[42px] font-black tracking-wide text-black uppercase mb-2 block">
                      {resumeData.personal_info.fullName}
                    </h1>
                    <div className="text-[20px] font-light italic text-gray-600 block">
                      {resumeData.professional_summary.title}
                    </div>
                  </div>

                  {/* Two Column Layout */}
                  <div className="grid grid-cols-[1fr_2fr] gap-6 relative">
                    {/* Vertical Divider */}
                    <div className="absolute left-[33.33%] top-0 bottom-0 w-[1px] bg-gray-300" />

                    {/* Left Column */}
                    <div className="pr-6 space-y-7 max-w-full">
                      {/* Contact Section */}
                      <div>
                        <h2 className="text-[16px] font-bold text-black uppercase tracking-wider mb-3">
                          Contact
                        </h2>
                        <div className="space-y-2 text-[14px]">
                          <div className="flex items-center gap-2 w-full">
                            <Phone className="w-4 h-4 shrink-0" />
                            <span className="text-gray-700 truncate">{resumeData.personal_info.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 w-full">
                            <Mail className="w-4 h-4 shrink-0" />
                            <span className="text-gray-700 truncate">{resumeData.personal_info.email}</span>
                          </div>
                          {resumeData.personal_info.linkedin && (
                            <div className="flex items-center gap-2 w-full">
                              <Linkedin className="w-4 h-4 shrink-0" />
                              <span className="text-gray-700 truncate">{resumeData.personal_info.linkedin}</span>
                            </div>
                          )}
                          {resumeData.personal_info.website && (
                            <div className="flex items-center gap-2 w-full">
                              <Globe className="w-4 h-4 shrink-0" />
                              <span className="text-gray-700 truncate">{resumeData.personal_info.website}</span>
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
                                <div className="font-semibold text-[14px]">{edu.schoolName}</div>
                                <div className="text-[14px] text-gray-600">{edu.degreeName}</div>
                                <div className="text-[13px] text-gray-500">
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
                                <span className="text-[14px] text-gray-700">{skill}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Certifications Section */}
                      {resumeData.certifications.length > 0 && (
                        <div>
                          <h2 className="text-[16px] font-bold text-black uppercase tracking-wider mb-3">
                            Certifications
                          </h2>
                          <div className="space-y-1.5">
                            {resumeData.certifications.map((cert, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                                <span className="text-[14px] text-gray-700">{cert.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column */}
                    <div className="pl-6 space-y-7 max-w-full">
                      {/* Profile Section */}
                      <div>
                        <h2 className="text-[16px] font-bold text-black uppercase tracking-wider mb-3">
                          Profile
                        </h2>
                        <p className="text-[14px] text-gray-700 leading-relaxed">
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
                                >
                                  {exp.jobTitle}
                                </div>
                                <div className="text-[14px] text-gray-700 font-semibold mb-1">
                                  {exp.companyName}
                                </div>
                                <div className="text-[13px] text-gray-500 mb-2">
                                  {exp.startDate} - {exp.isCurrentJob ? "Present" : exp.endDate}
                                </div>
                                <ul className="space-y-2">
                                  {exp.responsibilities.map((resp, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-black mt-[7px] shrink-0" />
                                      <span 
                                        className="text-[14px] text-gray-700"
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
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
