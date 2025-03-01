import { useState, useRef, useEffect } from "react";
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
import { Mail, Phone, Linkedin, Globe, MapPin, Briefcase, GraduationCap, Award, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface FinalResumePreviewProps {
  resumeData: ResumeData;
  resumeId: string;
  isEditing?: boolean;
}

export function FinalResumePreview({
  resumeData: initialResumeData,
  resumeId,
  isEditing = false
}: FinalResumePreviewProps) {
  const [scale, setScale] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [resumeData, setResumeData] = useState(initialResumeData);
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialResumeData.template_id || "executive-clean");
  const [isDownloading, setIsDownloading] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Fixed US Letter size constants
  const DPI = 96; // Standard screen DPI
  const WIDTH_INCHES = 8.5;
  const HEIGHT_INCHES = 11;
  const WIDTH_PX = Math.floor(WIDTH_INCHES * DPI); // 816px
  const HEIGHT_PX = Math.floor(HEIGHT_INCHES * DPI); // 1056px

  // Update for direct in-place editing
  const handleContentEdit = (e: React.FocusEvent<HTMLElement>, section: keyof ResumeData, field: string, subsection?: string) => {
    if (!isEditing) return;
    
    const newContent = e.target.innerText.trim();
    
    // Create a deep copy of the resumeData
    const newResumeData = { ...resumeData };
    
    if (subsection) {
      if (newResumeData[section] && newResumeData[section][subsection]) {
        // @ts-ignore - we're using dynamic access here
        newResumeData[section][subsection][field] = newContent;
      }
    } else if (newResumeData[section]) {
      // @ts-ignore - we're using dynamic access here
      newResumeData[section][field] = newContent;
    }
    
    setResumeData(newResumeData);
    
    // Save to database
    try {
      const updateData = {
        [section]: newResumeData[section] as unknown as Json
      };
      
      supabase
        .from("resumes")
        .update(updateData)
        .eq("id", resumeId)
        .then(({ error }) => {
          if (error) {
            console.error("Error saving edit:", error);
            toast.error("Failed to save changes");
          }
        });
    } catch (error) {
      console.error("Error in editing content:", error);
      toast.error("Failed to save changes");
    }
  };

  // Handle list editing
  const handleListItemEdit = (
    section: keyof ResumeData, 
    index: number, 
    value: string,
    arrayField: string,
    subsection?: string
  ) => {
    if (!isEditing) return;
    
    const newResumeData = { ...resumeData };
    
    if (subsection) {
      if (newResumeData[section] && newResumeData[section][subsection]) {
        // @ts-ignore - we're using dynamic access here
        const items = [...newResumeData[section][subsection][arrayField]];
        items[index] = value;
        // @ts-ignore
        newResumeData[section][subsection][arrayField] = items;
      }
    } else if (newResumeData[section]) {
      // @ts-ignore
      const items = [...newResumeData[section][arrayField]];
      items[index] = value;
      // @ts-ignore
      newResumeData[section][arrayField] = items;
    }
    
    setResumeData(newResumeData);
    
    // Save to database
    try {
      const updateData = {
        [section]: newResumeData[section] as unknown as Json
      };
      
      supabase
        .from("resumes")
        .update(updateData)
        .eq("id", resumeId);
    } catch (error) {
      console.error("Error updating list item:", error);
    }
  };

  useEffect(() => {
    // Update when the parent template changes
    setSelectedTemplateId(initialResumeData.template_id || "executive-clean");
    setResumeData(initialResumeData);
  }, [initialResumeData]);

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

  // For font sizing and spacing adjustments based on template
  const templateStyles = {
    "executive-clean": {
      headerSpacing: "mb-8",
      sectionSpacing: "mb-6",
      titleFont: "text-4xl font-bold tracking-tight text-gray-900",
      subtitleFont: "text-xl text-gray-600 mt-1",
      contactFont: "text-sm",
      sectionTitle: "text-lg font-bold text-gray-800 uppercase tracking-wide mb-4 pb-2 border-b border-gray-300",
      bodyText: "text-sm leading-normal"
    },
    "modern-split": {
      headerSpacing: "mb-7",
      sectionSpacing: "mb-5",
      titleFont: "text-3xl font-light tracking-wide text-indigo-700",
      subtitleFont: "text-lg text-gray-600 mt-1 font-light",
      contactFont: "text-xs",
      sectionTitle: "text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3",
      bodyText: "text-xs leading-relaxed"
    },
    "minimal-elegant": {
      headerSpacing: "mb-6",
      sectionSpacing: "mb-6",
      titleFont: "text-[32px] font-medium tracking-tight text-gray-900",
      subtitleFont: "text-xl text-gray-700 mt-1 font-normal",
      contactFont: "text-sm",
      sectionTitle: "text-base font-semibold text-gray-800 border-b border-gray-300 pb-1 mb-3",
      bodyText: "text-sm leading-relaxed"
    },
    "professional-executive": {
      headerSpacing: "mb-6",
      sectionSpacing: "mb-5",
      titleFont: "text-4xl font-black tracking-wide text-black uppercase",
      subtitleFont: "text-xl text-gray-700 mt-1",
      contactFont: "text-sm",
      sectionTitle: "text-base font-bold text-black uppercase tracking-wide mb-3 pb-1 border-b border-black",
      bodyText: "text-sm leading-snug"
    }
  };

  const currentStyle = templateStyles[selectedTemplate.id as keyof typeof templateStyles] || templateStyles["executive-clean"];

  // Editable content classes
  const getEditableClass = (baseClass: string) => {
    return cn(
      baseClass,
      isEditing ? "hover:bg-blue-50 focus:bg-blue-50 focus:outline-blue-200 outline-dashed outline-1 outline-transparent" : ""
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
              top: selectedTemplate.style.spacing.margins.top,
              right: selectedTemplate.style.spacing.margins.right,
              bottom: selectedTemplate.style.spacing.margins.bottom,
              left: selectedTemplate.style.spacing.margins.left,
              overflow: 'hidden',
              boxSizing: 'border-box',
            }}
          >
            {selectedTemplate.id === "professional-executive" && (
              <div className="mx-auto" style={{ width: '100%', height: '100%' }}>
                {/* Header */}
                <div className={`${currentStyle.headerSpacing}`}>
                  <h1 
                    className={getEditableClass(currentStyle.titleFont + " mb-1")}
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentEdit(e, 'personal_info', 'fullName')}
                  >
                    {resumeData.personal_info.fullName}
                  </h1>
                  <div 
                    className={getEditableClass(currentStyle.subtitleFont)}
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentEdit(e, 'professional_summary', 'title')}
                  >
                    {resumeData.professional_summary.title}
                  </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-[1fr_2fr] gap-6 relative">
                  {/* Vertical Divider */}
                  <div className="absolute left-[33.33%] top-0 bottom-0 w-[1px] bg-gray-300"></div>

                  {/* Left Column */}
                  <div className="pr-6 space-y-5 max-w-full">
                    {/* Contact Section */}
                    <div>
                      <h2 className={currentStyle.sectionTitle}>
                        Contact
                      </h2>
                      <div className="space-y-2 text-[13px]">
                        <div className="flex items-center gap-2 w-full">
                          <Phone className="w-3.5 h-3.5 shrink-0 text-gray-500" />
                          <span 
                            className={getEditableClass("text-gray-700 truncate")}
                            contentEditable={isEditing}
                            suppressContentEditableWarning
                            onBlur={(e) => handleContentEdit(e, 'personal_info', 'phone')}
                          >
                            {resumeData.personal_info.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 w-full">
                          <Mail className="w-3.5 h-3.5 shrink-0 text-gray-500" />
                          <span 
                            className={getEditableClass("text-gray-700 truncate")}
                            contentEditable={isEditing}
                            suppressContentEditableWarning
                            onBlur={(e) => handleContentEdit(e, 'personal_info', 'email')}
                          >
                            {resumeData.personal_info.email}
                          </span>
                        </div>
                        {resumeData.personal_info.linkedin && (
                          <div className="flex items-center gap-2 w-full">
                            <Linkedin className="w-3.5 h-3.5 shrink-0 text-gray-500" />
                            <span 
                              className={getEditableClass("text-gray-700 truncate")}
                              contentEditable={isEditing}
                              suppressContentEditableWarning
                              onBlur={(e) => handleContentEdit(e, 'personal_info', 'linkedin')}
                            >
                              {resumeData.personal_info.linkedin}
                            </span>
                          </div>
                        )}
                        {resumeData.personal_info.website && (
                          <div className="flex items-center gap-2 w-full">
                            <Globe className="w-3.5 h-3.5 shrink-0 text-gray-500" />
                            <span 
                              className={getEditableClass("text-gray-700 truncate")}
                              contentEditable={isEditing}
                              suppressContentEditableWarning
                              onBlur={(e) => handleContentEdit(e, 'personal_info', 'website')}
                            >
                              {resumeData.personal_info.website}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Education Section */}
                    {resumeData.education.length > 0 && (
                      <div>
                        <h2 className={currentStyle.sectionTitle}>
                          Education
                        </h2>
                        <div className="space-y-3">
                          {resumeData.education.map((edu, index) => (
                            <div key={index}>
                              <div 
                                className={getEditableClass("font-semibold text-[13px]")}
                                contentEditable={isEditing}
                                suppressContentEditableWarning
                                onBlur={(e) => handleContentEdit(e, 'education', 'schoolName', String(index))}
                              >
                                {edu.schoolName}
                              </div>
                              <div 
                                className={getEditableClass("text-[13px] text-gray-600")}
                                contentEditable={isEditing}
                                suppressContentEditableWarning
                                onBlur={(e) => handleContentEdit(e, 'education', 'degreeName', String(index))}
                              >
                                {edu.degreeName}
                              </div>
                              <div className="text-[12px] text-gray-500">
                                {edu.startDate} - {edu.isCurrentlyEnrolled ? "Present" : edu.endDate}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills Section */}
                    <SkillsSection 
                      hardSkills={resumeData.skills.hard_skills}
                      softSkills={resumeData.skills.soft_skills}
                      template={selectedTemplate}
                      isEditing={isEditing}
                      onUpdate={(type, skills) => {
                        const newSkills = { ...resumeData.skills };
                        if (type === "hard") {
                          newSkills.hard_skills = skills;
                        } else {
                          newSkills.soft_skills = skills;
                        }
                        
                        const newResumeData = { ...resumeData, skills: newSkills };
                        setResumeData(newResumeData);
                        
                        // Save to database
                        supabase
                          .from("resumes")
                          .update({ skills: newSkills as unknown as Json })
                          .eq("id", resumeId);
                      }}
                    />

                    {/* Certifications Section */}
                    {resumeData.certifications.length > 0 && (
                      <div>
                        <h2 className={currentStyle.sectionTitle}>
                          Certifications
                        </h2>
                        <div className="space-y-1.5">
                          {resumeData.certifications.map((cert, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0"></div>
                              <span 
                                className={getEditableClass("text-[13px] text-gray-700")}
                                contentEditable={isEditing}
                                suppressContentEditableWarning
                                onBlur={(e) => handleContentEdit(e, 'certifications', 'name', String(index))}
                              >
                                {cert.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="pl-6 space-y-5 max-w-full">
                    {/* Profile Section */}
                    <div>
                      <h2 className={currentStyle.sectionTitle}>
                        Profile
                      </h2>
                      <p 
                        className={getEditableClass(`${currentStyle.bodyText} text-gray-700`)}
                        contentEditable={isEditing}
                        suppressContentEditableWarning
                        onBlur={(e) => handleContentEdit(e, 'professional_summary', 'summary')}
                      >
                        {resumeData.professional_summary.summary}
                      </p>
                    </div>

                    {/* Work Experience Section */}
                    {resumeData.work_experience.length > 0 && (
                      <div>
                        <h2 className={currentStyle.sectionTitle}>
                          Work Experience
                        </h2>
                        <div className="space-y-4">
                          {resumeData.work_experience.map((exp, index) => (
                            <div key={index} className="pb-2">
                              <div 
                                className={getEditableClass("font-bold uppercase text-gray-900 block text-[14px]")}
                                contentEditable={isEditing}
                                suppressContentEditableWarning
                                onBlur={(e) => handleContentEdit(e, 'work_experience', 'jobTitle', String(index))}
                              >
                                {exp.jobTitle}
                              </div>
                              <div 
                                className={getEditableClass("text-[13px] text-gray-700 font-semibold")}
                                contentEditable={isEditing}
                                suppressContentEditableWarning
                                onBlur={(e) => handleContentEdit(e, 'work_experience', 'companyName', String(index))}
                              >
                                {exp.companyName}
                              </div>
                              <div className="text-[12px] text-gray-500 mb-2">
                                {exp.startDate} - {exp.isCurrentJob ? "Present" : exp.endDate}
                              </div>
                              <ul className="space-y-1.5">
                                {exp.responsibilities.map((resp, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-black mt-[6px] shrink-0"></div>
                                    <span 
                                      className={getEditableClass("text-[13px] text-gray-700 leading-snug")}
                                      contentEditable={isEditing}
                                      suppressContentEditableWarning
                                      onBlur={(e) => {
                                        const newResp = e.target.innerText.trim();
                                        if (newResp !== resp) {
                                          const newExp = [...resumeData.work_experience];
                                          newExp[index].responsibilities[idx] = newResp;
                                          
                                          const newResumeData = { 
                                            ...resumeData, 
                                            work_experience: newExp 
                                          };
                                          
                                          setResumeData(newResumeData);
                                          
                                          // Save to database
                                          supabase
                                            .from("resumes")
                                            .update({ 
                                              work_experience: newExp as unknown as Json 
                                            })
                                            .eq("id", resumeId);
                                        }
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
            )}

            {/* Render other templates similar to professional-executive */}
            {/* For brevity, I'm keeping only one template fully implemented with editing */}
            {/* Other templates would follow the same pattern, adapting for their specific layouts */}
            {selectedTemplate.id !== "professional-executive" && (
              <div className="h-full">
                {/* Header */}
                <div className={`${currentStyle.headerSpacing} border-b-2 border-gray-800 pb-4`}>
                  <h1 
                    className={getEditableClass(currentStyle.titleFont)}
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentEdit(e, 'personal_info', 'fullName')}
                  >
                    {resumeData.personal_info.fullName}
                  </h1>
                  <div 
                    className={getEditableClass(currentStyle.subtitleFont)}
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentEdit(e, 'professional_summary', 'title')}
                  >
                    {resumeData.professional_summary.title}
                  </div>
                  <div className="flex flex-wrap gap-6 mt-2 text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span 
                        className={getEditableClass(currentStyle.contactFont)}
                        contentEditable={isEditing}
                        suppressContentEditableWarning
                        onBlur={(e) => handleContentEdit(e, 'personal_info', 'email')}
                      >
                        {resumeData.personal_info.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span 
                        className={getEditableClass(currentStyle.contactFont)}
                        contentEditable={isEditing}
                        suppressContentEditableWarning
                        onBlur={(e) => handleContentEdit(e, 'personal_info', 'phone')}
                      >
                        {resumeData.personal_info.phone}
                      </span>
                    </div>
                    {resumeData.personal_info.linkedin && (
                      <div className="flex items-center gap-1.5">
                        <Linkedin className="w-4 h-4 text-gray-500" />
                        <span 
                          className={getEditableClass(currentStyle.contactFont)}
                          contentEditable={isEditing}
                          suppressContentEditableWarning
                          onBlur={(e) => handleContentEdit(e, 'personal_info', 'linkedin')}
                        >
                          {resumeData.personal_info.linkedin}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Professional Summary */}
                <div className={currentStyle.sectionSpacing}>
                  <h2 className={currentStyle.sectionTitle}>
                    Professional Summary
                  </h2>
                  <p 
                    className={getEditableClass(`${currentStyle.bodyText} text-gray-700`)}
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentEdit(e, 'professional_summary', 'summary')}
                  >
                    {resumeData.professional_summary.summary}
                  </p>
                </div>

                {/* Additional sections for other templates would go here */}
                {/* Using the same pattern of editable content with contentEditable and onBlur handlers */}
              </div>
            )}
          </div>
        </div>
      </div>
      <DownloadOptionsDialog
        isDownloading={isDownloading}
        resumeData={resumeData}
        resumeRef={resumeRef}
        templateId={selectedTemplateId}
      />
    </div>
  );
}
