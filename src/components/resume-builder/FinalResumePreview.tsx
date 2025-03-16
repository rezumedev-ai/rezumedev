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
    padding: template.style.spacing.margins.top,
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
        const containerWidth = 21 * 37.8;
        const padding = 32;
        const availableWidth = window.innerWidth - padding;
        const newScale = Math.min(0.95, availableWidth / containerWidth);
        setResumeScale(newScale);
      } else {
        setResumeScale(1);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [isMobile]);
  
  return (
    <motion.div 
      className="flex flex-col items-center min-h-screen bg-white py-8"
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
        className="w-[21cm] min-h-[29.7cm] bg-white shadow-xl mx-auto mb-10 relative"
        style={{
          ...pageStyle,
          transform: `scale(${resumeScale})`,
          transformOrigin: 'top center',
          marginBottom: isMobile ? '2rem' : '2.5rem',
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
