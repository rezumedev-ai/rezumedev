
import { useNavigate } from "react-router-dom";
import { ResumeData } from "@/types/resume";
import { resumeTemplates } from "./templates";
import { ResumePreviewToolbar } from "./preview/ResumePreviewToolbar";
import { useResumePreview } from "@/hooks/use-resume-preview";
import { ResumeContent } from "./ResumeContent";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface FinalResumePreviewProps {
  resumeData: ResumeData;
  resumeId: string;
}

export function FinalResumePreview({ 
  resumeData, 
  resumeId
}: FinalResumePreviewProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [resumeScale, setResumeScale] = useState(1);
  
  const {
    resumeState,
    isEditing,
    toggleEditMode,
    handlePersonalInfoUpdate,
    handleSummaryUpdate,
    handleSkillsUpdate,
    handleEducationUpdate,
    handleCertificationUpdate,
    handleExperienceUpdate,
    handleTemplateChange
  } = useResumePreview(resumeData, resumeId);
  
  const template = resumeTemplates.find(t => t.id === resumeState.template_id) || resumeTemplates[0];
  
  const pageStyle = {
    padding: isMobile ? "0.4in" : template.style.spacing.margins.top,
    fontFamily: template.style.titleFont?.split(' ')[0].replace('font-', '') || 'sans'
  };

  const handleTemplateSwitching = (templateId: string) => {
    if (templateId === resumeState.template_id) return;
    
    handleTemplateChange(templateId);
    toast.success(`Template updated to ${resumeTemplates.find(t => t.id === templateId)?.name || 'new template'}`);
  };

  useEffect(() => {
    const updateScale = () => {
      if (isMobile) {
        // For mobile, set a smaller initial scale to show more of the resume
        const containerWidth = 21 * 37.8; // A4 width in pixels
        const padding = 32;
        const availableWidth = window.innerWidth - padding;
        // Set a maximum scale factor for mobile to ensure the resume is zoomed out enough
        const newScale = Math.min(0.55, availableWidth / containerWidth);
        setResumeScale(newScale);
      } else {
        // For desktop, optimize the scale to use more space
        const availableWidth = window.innerWidth - 48; // 48px padding
        const availableHeight = window.innerHeight - 120; // 120px for toolbar and padding
        const containerWidth = 21 * 37.8; // A4 width in pixels
        const containerHeight = 29.7 * 37.8; // A4 height in pixels
        
        // Calculate scale based on available dimensions
        const widthScale = availableWidth / containerWidth;
        const heightScale = availableHeight / containerHeight;
        
        // Use the smaller scale to ensure the entire resume fits, but give it a minimum scale
        const newScale = Math.max(Math.min(widthScale, heightScale, 1), 0.65);
        setResumeScale(newScale);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [isMobile]);
  
  return (
    <motion.div 
      className="flex flex-col items-center min-h-screen bg-white py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ResumePreviewToolbar 
        currentTemplateId={template.id}
        templates={resumeTemplates}
        resumeId={resumeId}
        onTemplateChange={handleTemplateSwitching}
        onBackToDashboard={() => navigate("/dashboard")}
        isEditing={isEditing}
        onToggleEdit={toggleEditMode}
      />
      
      <motion.div 
        id="resume-content" 
        className="w-[21cm] min-h-[29.7cm] bg-white shadow-xl mx-auto mb-6 relative overflow-hidden"
        style={{
          ...pageStyle,
          transform: `scale(${resumeScale})`,
          transformOrigin: 'top center',
          marginBottom: isMobile ? '1rem' : '1.5rem',
          marginTop: '0.5rem'
        }}
        key={template.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <ResumeContent 
          resumeState={resumeState}
          template={template}
          isEditing={isEditing}
          onPersonalInfoUpdate={handlePersonalInfoUpdate}
          onSummaryUpdate={handleSummaryUpdate}
          onSkillsUpdate={handleSkillsUpdate}
          onEducationUpdate={handleEducationUpdate}
          onCertificationUpdate={handleCertificationUpdate}
          onExperienceUpdate={handleExperienceUpdate}
        />
      </motion.div>
    </motion.div>
  );
}
