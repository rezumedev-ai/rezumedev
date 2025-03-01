
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ResumeData } from "@/types/resume";
import { useParams, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Download, Edit, Save, Eye, Loader2 } from "lucide-react";
import { EducationSection } from "./preview/EducationSection";
import { CertificationsSection } from "./preview/CertificationsSection";
import { ExperienceSection } from "./preview/ExperienceSection";
import { PersonalSection } from "./preview/PersonalSection";
import { SkillsSection } from "./preview/SkillsSection";
import { ProfessionalSummarySection } from "./preview/ProfessionalSummarySection";
import { ResumeTemplate, resumeTemplates } from "./templates";
import { useIsMobile } from "@/hooks/use-mobile";
import { ZoomIn, ZoomOut } from "lucide-react";

interface FinalResumePreviewProps {
  resumeData: ResumeData;
  resumeId: string;
}

export function FinalResumePreview({ resumeData, resumeId }: FinalResumePreviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedResumeData, setEditedResumeData] = useState<ResumeData>(resumeData);
  const [scale, setScale] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const isMobile = useIsMobile();

  // Find the selected template
  const template = resumeTemplates.find(t => t.id === resumeData.template) || resumeTemplates[0];

  // Prepare template-specific styles
  const DPI = 96; // Standard screen DPI
  const WIDTH_INCHES = 8.5;
  const HEIGHT_INCHES = 11;
  const WIDTH_PX = Math.floor(WIDTH_INCHES * DPI);
  const HEIGHT_PX = Math.floor(HEIGHT_INCHES * DPI);

  // Handle updating the resume data when edited
  const updateResumeData = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("resumes")
        .update(editedResumeData)
        .eq("id", resumeId);

      if (error) throw error;
      toast.success("Resume saved successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving resume:", error);
      toast.error("Failed to save resume");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle direct editing of personal info sections
  const handlePersonalInfoUpdate = (field: string, value: string) => {
    setEditedResumeData(prev => ({
      ...prev,
      personal_info: {
        ...prev.personal_info,
        [field]: value
      }
    }));
  };

  // Handle direct editing of professional summary
  const handleSummaryUpdate = (field: string, value: string) => {
    setEditedResumeData(prev => ({
      ...prev,
      professional_summary: {
        ...prev.professional_summary,
        [field]: value
      }
    }));
  };

  // Handle direct editing of work experience
  const handleExperienceUpdate = (index: number, field: keyof any, value: string | string[]) => {
    setEditedResumeData(prev => {
      const updatedExperiences = [...prev.work_experience];
      if (field === "responsibilities") {
        updatedExperiences[index] = {
          ...updatedExperiences[index],
          [field]: value
        };
      } else {
        updatedExperiences[index] = {
          ...updatedExperiences[index],
          [field]: value
        };
      }
      return {
        ...prev,
        work_experience: updatedExperiences
      };
    });
  };

  // Handle direct editing of education
  const handleEducationUpdate = (index: number, field: keyof any, value: string) => {
    setEditedResumeData(prev => {
      const updatedEducation = [...prev.education];
      updatedEducation[index] = {
        ...updatedEducation[index],
        [field]: value
      };
      return {
        ...prev,
        education: updatedEducation
      };
    });
  };

  // Handle direct editing of certifications
  const handleCertificationUpdate = (index: number, field: keyof any, value: string) => {
    setEditedResumeData(prev => {
      const updatedCertifications = [...prev.certifications];
      updatedCertifications[index] = {
        ...updatedCertifications[index],
        [field]: value
      };
      return {
        ...prev,
        certifications: updatedCertifications
      };
    });
  };

  // Handle direct editing of skills
  const handleSkillsUpdate = (type: "hard" | "soft", skills: string[]) => {
    setEditedResumeData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type === "hard" ? "hard_skills" : "soft_skills"]: skills
      }
    }));
  };

  // Generate PDF download
  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const resumeElement = document.getElementById('resume-content');
      if (!resumeElement) {
        toast.error("Could not find resume content");
        return;
      }

      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${editedResumeData.personal_info.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
      toast.success("Resume downloaded successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download resume");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle zoom for mobile view
  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  // Use effect to calculate scale based on container size
  useEffect(() => {
    const calculateScale = () => {
      const container = document.getElementById('resume-container');
      if (!container) return;

      const containerWidth = container.clientWidth - 48; // Account for padding
      const containerHeight = container.clientHeight - 48;

      const scaleX = containerWidth / WIDTH_PX;
      const scaleY = containerHeight / HEIGHT_PX;
      let newScale = Math.min(scaleX, scaleY, 1);

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
  }, [WIDTH_PX, HEIGHT_PX, isMobile, isZoomed]);

  return (
    <div className="relative w-full h-screen flex flex-col items-center bg-gray-100">
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        {isMobile && (
          <Button
            variant="outline"
            size="sm"
            onClick={toggleZoom}
            className="bg-white"
          >
            {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
          </Button>
        )}
        {isEditing ? (
          <Button
            onClick={updateResumeData}
            size="sm"
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
            Save
          </Button>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
            size="sm"
            variant="outline"
            className="bg-white"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        )}
        <Button
          onClick={handleDownload}
          size="sm"
          variant="outline"
          disabled={isLoading}
          className="bg-white"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4 mr-1" />}
          Download
        </Button>
      </div>
      
      <div 
        id="resume-container"
        className="w-full h-full flex items-center justify-center p-6 overflow-hidden"
      >
        <div 
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
            minWidth: `${WIDTH_PX}px`,
            maxWidth: `${WIDTH_PX}px`,
            minHeight: `${HEIGHT_PX}px`,
            maxHeight: `${HEIGHT_PX}px`,
          }}
        >
          <div 
            style={{
              position: 'absolute',
              top: template.style.spacing.margins.top,
              right: template.style.spacing.margins.right,
              bottom: template.style.spacing.margins.bottom,
              left: template.style.spacing.margins.left,
              overflow: 'hidden',
              boxSizing: 'border-box',
            }}
          >
            <PersonalSection
              fullName={editedResumeData.personal_info.fullName}
              title={editedResumeData.professional_summary.title}
              email={editedResumeData.personal_info.email}
              phone={editedResumeData.personal_info.phone}
              linkedin={editedResumeData.personal_info.linkedin}
              website={editedResumeData.personal_info.website}
              template={template}
              isEditing={isEditing}
              onUpdate={handlePersonalInfoUpdate}
            />
            
            <div 
              style={{
                height: 'calc(100% - 100px)',
                overflowY: 'auto',
                paddingRight: '4px',
              }}
            >
              <ProfessionalSummarySection
                summary={editedResumeData.professional_summary.summary}
                template={template}
                isEditing={isEditing}
                onUpdate={(value) => handleSummaryUpdate('summary', value)}
              />
              
              <ExperienceSection
                experiences={editedResumeData.work_experience}
                template={template}
                isEditing={isEditing}
                onUpdate={handleExperienceUpdate}
              />
              
              <EducationSection
                education={editedResumeData.education}
                template={template}
                isEditing={isEditing}
                onUpdate={handleEducationUpdate}
              />
              
              <SkillsSection
                hardSkills={editedResumeData.skills.hard_skills}
                softSkills={editedResumeData.skills.soft_skills}
                template={template}
                isEditing={isEditing}
                onUpdate={handleSkillsUpdate}
              />
              
              <CertificationsSection
                certifications={editedResumeData.certifications}
                template={template}
                isEditing={isEditing}
                onUpdate={handleCertificationUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
