<lov-code>
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
import { Mail, Phone, Linkedin, Globe, MapPin, Briefcase, GraduationCap, Award, User, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface FinalResumePreviewProps {
  resumeData: ResumeData;
  resumeId: string;
  onRegenerateClick?: () => void;
  isRegenerating?: boolean;
}

export function FinalResumePreview({
  resumeData: initialResumeData,
  resumeId,
  onRegenerateClick,
  isRegenerating = false
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
                  <h1 className={`${currentStyle.titleFont} mb-1`}>
                    {resumeData.personal_info.fullName}
                  </h1>
                  <div className={`${currentStyle.subtitleFont}`}>
                    {resumeData.professional_summary.title}
                  </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-[1fr_2fr] gap-6 relative">
                  {/* Vertical Divider */}
                  <div className="absolute left-[33.33%] top-0 bottom-0 w-[1px] bg-gray-300" />

                  {/* Left Column */}
                  <div className="pr-6 space-y-5 max-w-full">
                    {/* Contact Section */}
                    <div>
                      <h2 className={`${currentStyle.sectionTitle}`}>
                        Contact
                      </h2>
                      <div className="space-y-2 text-[13px]">
                        <div className="flex items-center gap-2 w-full">
                          <Phone className="w-3.5 h-3.5 shrink-0 text-gray-500" />
                          <span className="text-gray-700 truncate">{resumeData.personal_info.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 w-full">
                          <Mail className="w-3.5 h-3.5 shrink-0 text-gray-500" />
                          <span className="text-gray-700 truncate">{resumeData.personal_info.email}</span>
                        </div>
                        {resumeData.personal_info.linkedin && (
                          <div className="flex items-center gap-2 w-full">
                            <Linkedin className="w-3.5 h-3.5 shrink-0 text-gray-500" />
                            <span className="text-gray-700 truncate">{resumeData.personal_info.linkedin}</span>
                          </div>
                        )}
                        {resumeData.personal_info.website && (
                          <div className="flex items-center gap-2 w-full">
                            <Globe className="w-3.5 h-3.5 shrink-0 text-gray-500" />
                            <span className="text-gray-700 truncate">{resumeData.personal_info.website}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Education Section */}
                    {resumeData.education.length > 0 && (
                      <div>
                        <h2 className={`${currentStyle.sectionTitle}`}>
                          Education
                        </h2>
                        <div className="space-y-3">
                          {resumeData.education.map((edu, index) => (
                            <div key={index}>
                              <div className="font-semibold text-[13px]">{edu.schoolName}</div>
                              <div className="text-[13px] text-gray-600">{edu.degreeName}</div>
                              <div className="text-[12px] text-gray-500">
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
                        <h2 className={`${currentStyle.sectionTitle}`}>
                          Skills
                        </h2>
                        <div className="space-y-3">
                          {resumeData.skills.hard_skills.length > 0 && (
                            <div>
                              <div className="font-medium text-[13px] mb-1">Technical Skills</div>
                              <div className="space-y-1">
                                {resumeData.skills.hard_skills.map((skill, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                                    <span className="text-[13px] text-gray-700">{skill}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {resumeData.skills.soft_skills.length > 0 && (
                            <div className="mt-3 pt-1">
                              <div className="font-medium text-[13px] mb-1">Soft Skills</div>
                              <div className="space-y-1">
                                {resumeData.skills.soft_skills.map((skill, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                                    <span className="text-[13px] text-gray-700">{skill}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Certifications Section */}
                    {resumeData.certifications.length > 0 && (
                      <div>
                        <h2 className={`${currentStyle.sectionTitle}`}>
                          Certifications
                        </h2>
                        <div className="space-y-1.5">
                          {resumeData.certifications.map((cert, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                              <span className="text-[13px] text-gray-700">{cert.name}</span>
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
                      <h2 className={`${currentStyle.sectionTitle}`}>
                        Profile
                      </h2>
                      <p className={`${currentStyle.bodyText} text-gray-700`}>
                        {resumeData.professional_summary.summary}
                      </p>
                    </div>

                    {/* Work Experience Section */}
                    {resumeData.work_experience.length > 0 && (
                      <div>
                        <h2 className={`${currentStyle.sectionTitle}`}>
                          Work Experience
                        </h2>
                        <div className="space-y-4">
                          {resumeData.work_experience.map((exp, index) => (
                            <div key={index} className="pb-2">
                              <div 
                                className="font-bold uppercase text-gray-900 block text-[14px]"
                              >
                                {exp.jobTitle}
                              </div>
                              <div className="text-[13px] text-gray-700 font-semibold">
                                {exp.companyName}
                              </div>
                              <div className="text-[12px] text-gray-500 mb-2">
                                {exp.startDate} - {exp.isCurrentJob ? "Present" : exp.endDate}
                              </div>
                              <ul className="space-y-1.5">
                                {exp.responsibilities.map((resp, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-black mt-[6px] shrink-0" />
                                    <span 
                                      className="text-[13px] text-gray-700 leading-snug"
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

            {selectedTemplate.id === "modern-split" && (
              <div className="h-full">
                {/* Header Section with Personal Info */}
                <div className={`${currentStyle.headerSpacing} flex items-center`}>
                  <div className="flex-1">
                    <h1 className={`${currentStyle.titleFont}`}>
                      {resumeData.personal_info.fullName}
                    </h1>
                    <div className={`${currentStyle.subtitleFont}`}>
                      {resumeData.professional_summary.title}
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <div className="flex items-center justify-end gap-2">
                      <span className={`${currentStyle.contactFont} text-gray-600`}>{resumeData.personal_info.email}</span>
                      <Mail className="w-3.5 h-3.5 text-indigo-500" />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <span className={`${currentStyle.contactFont} text-gray-600`}>{resumeData.personal_info.phone}</span>
                      <Phone className="w-3.5 h-3.5 text-indigo-500" />
                    </div>
                    {resumeData.personal_info.linkedin && (
                      <div className="flex items-center justify-end gap-2">
                        <span className={`${currentStyle.contactFont} text-gray-600`}>{resumeData.personal_info.linkedin}</span>
                        <Linkedin className="w-3.5 h-3.5 text-indigo-500" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="h-[1px] w-full bg-indigo-100 mb-6"></div>

                {/* Main Content */}
                <div className="grid grid-cols-3 gap-8 h-[calc(100%-100px)]">
                  {/* Left Sidebar */}
                  <div className="col-span-1 space-y-5 border-r border-indigo-100 pr-4">
                    {/* Skills */}
                    {(resumeData.skills.hard_skills.length > 0 || resumeData.skills.soft_skills.length > 0) && (
                      <div>
                        <h3 className={`${currentStyle.sectionTitle}`}>
                          <span className="flex items-center">
                            <span className="inline-block w-5 h-[2px] bg-indigo-500 mr-2"></span>
                            Skills
                          </span>
                        </h3>
                        <div className="space-y-3">
                          {resumeData.skills.hard_skills.length > 0 && (
                            <div>
                              <h4 className="text-xs font-medium text-gray-700 mb-1">Technical</h4>
                              <ul className="space-y-1">
                                {resumeData.skills.hard_skills.map((skill, index) => (
                                  <li key={index} className={`${currentStyle.bodyText} text-gray-600 flex items-start`}>
                                    <span className="inline-block w-1 h-1 rounded-full bg-indigo-400 mt-1.5 mr-2"></span>
                                    {skill}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {resumeData.skills.soft_skills.length > 0 && (
                            <div>
                              <h4 className="text-xs font-medium text-gray-700 mb-1">Soft Skills</h4>
                              <ul className="space-y-1">
                                {resumeData.skills.soft_skills.map((skill, index) => (
                                  <li key={index} className={`${currentStyle.bodyText} text-gray-600 flex items-start`}>
                                    <span className="inline-block w-1 h-1 rounded-full bg-indigo-400 mt-1.5 mr-2"></span>
                                    {skill}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {resumeData.education.length > 0 && (
                      <div>
                        <h3 className={`${currentStyle.sectionTitle}`}>
                          <span className="flex items-center">
                            <span className="inline-block w-5 h-[2px] bg-indigo-500 mr-2"></span>
                            Education
                          </span>
                        </h3>
                        <div className="space-y-3">
                          {resumeData.education.map((edu, index) => (
                            <div key={index}>
                              <div className="font-medium text-xs text-gray-800">{edu.degreeName}</div>
                              <div className={`${currentStyle.bodyText} text-gray-600`}>{edu.schoolName}</div>
                              <div className="text-[10px] text-gray-500">
                                {edu.startDate} - {edu.isCurrentlyEnrolled ? "Present" : edu.endDate}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Certifications */}
                    {resumeData.certifications.length > 0 && (
                      <div>
                        <h3 className={`${currentStyle.sectionTitle}`}>
                          <span className="flex items-center">
                            <span className="inline-block w-5 h-[2px] bg-indigo-500 mr-2"></span>
                            Certifications
                          </span>
                        </h3>
                        <div className="space-y-2">
                          {resumeData.certifications.map((cert, index) => (
                            <div key={index}>
                              <div className="font-medium text-xs text-gray-800">{cert.name}</div>
                              <div className={`${currentStyle.bodyText} text-gray-600`}>{cert.organization}</div>
                              <div className="text-[10px] text-gray-500">{cert.completionDate}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Main Content */}
                  <div className="col-span-2 space-y-5">
                    {/* Professional Summary */}
                    <div>
                      <h3 className={`${currentStyle.sectionTitle}`}>
                        <span className="flex items-center">
                          <span className="inline-block w-5 h-[2px] bg-indigo-500 mr-2"></span>
                          Professional Summary
                        </span>
                      </h3>
                      <p className={`${currentStyle.bodyText} text-gray-600 pr-2`}>
                        {resumeData.professional_summary.summary}
                      </p>
                    </div>
                    
                    {/* Work Experience */}
                    {resumeData.work_experience.length > 0 && (
                      <div>
                        <h3 className={`${currentStyle.sectionTitle}`}>
                          <span className="flex items-center">
                            <span className="inline-block w-5 h-[2px] bg-indigo-500 mr-2"></span>
                            Professional Experience
                          </span>
                        </h3>
                        <div className="space-y-4">
                          {resumeData.work_experience.map((exp, index) => (
                            <div key={index} className="relative pl-4 border-l border-indigo-100">
                              <div className="absolute top-0 left-[-4px] w-2 h-2 rounded-full bg-indigo-500"></div>
                              <div className="flex justify-between items-baseline mb-1">
                                <h4 className="font-medium text-sm text-gray-800">{exp.jobTitle}</h4>
                                <span className="text-[10px] text-gray-500 whitespace-nowrap">
                                  {exp.startDate} - {exp.isCurrentJob ? "Present" : exp.endDate}
                                </span>
                              </div>
                              <div className={`${currentStyle.bodyText} text-gray-600 mb-1.5`}>{exp.companyName}</div>
                              <ul className="space-y-1">
                                {exp.responsibilities.map((resp, respIndex) => (
                                  <li key={respIndex} className={`${currentStyle.bodyText} text-gray-600 flex items-start`}>
                                    <span className="inline-block w-1 h-1 rounded-full bg-indigo-400 mt-1.5 mr-2"></span>
                                    {resp}
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

            {selectedTemplate.id === "minimal-elegant" && (
              <div className="h-full font-sans">
                {/* Header - New Professional Style */}
                <div className="border-b border-gray-300 pb-4 mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-[26px] font-semibold text-gray-900 mb-1">
                        {resumeData.personal_info.fullName}
                      </h1>
                      <h2 className="text-[17px] text-gray-700 font-normal">
                        {resumeData.professional_summary.title}
                      </h2>
                    </div>
                    <div className="text-right text-sm text-gray-600 space-y-1">
                      <div className="flex items-center justify-end gap-2">
                        <span>{resumeData.personal_info.email}</span>
                        <Mail className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <span>{resumeData.personal_info.phone}</span>
                        <Phone className="w-4 h-4 text-gray-500" />
                      </div>
                      {resumeData.personal_info.linkedin && (
                        <div className="flex items-center justify-end gap-2">
                          <span>{resumeData.personal_info.linkedin}</span>
                          <Linkedin className="w-4 h-4 text-gray-500" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-6">
                  {/* Main Column - 2/3 width */}
                  <div className="w-2/3 pr-6 border-r border-gray-200">
                    {/* Professional Summary */}
                    <div className="mb-6">
                      <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-3">
                        <User className="w-4 h-4 text-gray-600" />
                        Professional Summary
                      </h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {resumeData.professional_summary.summary}
                      </p>
                    </div>

                    {/* Work Experience */}
                    {resumeData.work_experience.length > 0 && (
                      <div className="mb-6">
                        <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-3">
                          <Briefcase className="w-4 h-4 text-gray-600" />
                          Work Experience
                        </h3>
                        <div className="space-y-4">
                          {resumeData.work_experience.map((exp, index) => (
                            <div key={index} className="mb-4">
                              <div className="flex justify-between items-baseline mb-1">
                                <h4 className="font-semibold text-[15px] text-gray-800">{exp.jobTitle}</h4>
                                <span className="text-xs text-gray-500">
                                  {exp.startDate} - {exp.isCurrentJob ? "Present" : exp.endDate}
                                </span>
                              </div>
                              <div className="text-[13px] text-gray-600 mb-2">{exp.companyName}</div>
                              <ul className="space-y-1.5">
                                {exp.responsibilities.map((resp, respIndex) => (
                                  <li key={respIndex} className="flex items-start gap-2">
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400 mt-[6px] shrink-0"></span>
                                    <span className="text-sm text-gray-700 leading-tight">{resp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sidebar - 1/3 width */}
                  <div className="w-1/3">
                    {/* Education */}
                    {resumeData.education.length > 0 && (
                      <div className="mb-6">
                        <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-3">
                          <GraduationCap className="w-4 h-4 text-gray-600" />
                          Education
                        </h3>
                        <div className="space-y-3">
                          {resumeData.education.map((edu, index) => (
                            <div key={index} className="mb-3">
                              <div className="font-medium text-[15px] text-gray-800">{edu.degreeName}</div>
                              <div className="text-sm text-gray-600">{edu.schoolName}</div>
                              <div className="text-xs text-gray-500">
                                {edu.startDate} - {edu.isCurrentlyEnrolled ? "Present" : edu.endDate}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills */}
                    {(resumeData.skills.hard_skills.length > 0 || resumeData.skills.soft_skills.length > 0) && (
                      <div className="mb-6">
                        <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-3">
                          <Award className="w-4 h-4 text-gray-600" />
                          Skills
                        </h3>
                        
                        {resumeData.skills.hard_skills.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Technical Skills</h4>
                            <ul className="space-y-1">
                              {resumeData.skills.hard_skills.map((skill, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400 mt-[6px] shrink-0"></span>
                                  <span className="text-sm text-gray-700">{skill}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {resumeData.skills.soft_skills.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Professional Skills</h4>
                            <ul className="space-y-1">
                              {resumeData.skills.soft_skills.map((skill, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400 mt-[6px] shrink-0"></span>
                                  <span className="text-sm text-gray-700">{skill}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Certifications */}
                    {resumeData.certifications.length > 0 && (
                      <div className="mb-6">
                        <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-3">
                          <Award className="w-4 h-4 text-gray-600" />
                          Certifications
                        </h3>
                        <ul className="space-y-1">
                          {resumeData.certifications.map((cert, index) => (
                            <li key={index} className="mb-2">
                              <div className="font-medium text-sm text-gray-800">{cert.name}</div>
                              <div className="text-xs text-gray-600">{cert.organization}</div>
                              <div className="text-xs text-gray-500">{cert.completionDate}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {selectedTemplate.id === "executive-clean" && (
              <div className="h-full">
                {/* Header Section */}
                <div className={`${currentStyle.headerSpacing} border-b-2 border-gray-800 pb-4`}>
                  <h1 className={`${currentStyle.titleFont}`}>
                    {resumeData.personal_info.fullName}
                  </h1>
                  <div className={`${currentStyle.subtitleFont}`}>
                    {resumeData.professional_summary.title}
                  </div>
                  <div className="flex flex-wrap gap-6 mt-2 text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className={`${currentStyle.contactFont}`}>{resumeData.personal_info
