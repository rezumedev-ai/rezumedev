
import { useNavigate } from "react-router-dom";
import { ResumeData } from "@/types/resume";
import { resumeTemplates } from "./templates";
import { ResumePreviewToolbar } from "./preview/ResumePreviewToolbar";
import { useResumePreview } from "@/hooks/use-resume-preview";
import { ResumeContent } from "./ResumeContent";
import { toast } from "sonner";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Eye } from "lucide-react";

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
  const [resumeScale, setResumeScale] = useState(isMobile ? 0.35 : 1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    resumeState,
    isEditing,
    toggleEditMode,
    handlePersonalInfoUpdate,
    handleProfileImageUpdate,
    handleSummaryUpdate,
    handleSkillsUpdate,
    handleEducationUpdate,
    handleCertificationUpdate,
    handleExperienceUpdate,
    handleTemplateChange
  } = useResumePreview(resumeData, resumeId);
  
  const template = resumeTemplates.find(t => t.id === resumeState.template_id) || resumeTemplates[0];
  
  // Standardized page style with font consistent with modern-professional
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
      if (!containerRef.current) return;
      
      // Get container dimensions
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      // A4 dimensions (in pixels at 96 DPI)
      const pageWidth = 21 * 37.8; // ~793px
      const pageHeight = 29.7 * 37.8; // ~1122px
      
      if (isMobile) {
        // For mobile, set a fixed initial scale that shows the full resume
        setResumeScale(0.35);
      } else {
        // For desktop, optimize the scale to use more space
        const availableWidth = containerWidth - 48; // 48px padding
        const availableHeight = containerHeight - 120; // 120px for toolbar and padding
        
        // Calculate scale based on available dimensions
        const widthScale = availableWidth / pageWidth;
        const heightScale = availableHeight / pageHeight;
        
        // Use the smaller scale to ensure the entire resume fits, but give it a minimum scale
        const newScale = Math.max(Math.min(widthScale, heightScale, 1), 0.65);
        setResumeScale(newScale);
      }
    };

    updateScale();
    
    // Add event listeners for screen rotation and resize
    window.addEventListener('resize', updateScale);
    window.addEventListener('orientationchange', updateScale);
    
    return () => {
      window.removeEventListener('resize', updateScale);
      window.removeEventListener('orientationchange', updateScale);
    };
  }, [isMobile]);
  
  return (
    <motion.div 
      ref={containerRef}
      className="flex flex-col items-center min-h-screen bg-white py-4 relative"
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
        onProfileImageUpdate={handleProfileImageUpdate}
        currentProfileImageUrl={resumeState.personal_info.profileImageUrl}
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
        data-template-id={template.id}
        key={template.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <ResumeContent 
          resumeState={resumeState}
          template={template}
          isEditing={isEditing}
          resumeId={resumeId}
          onPersonalInfoUpdate={handlePersonalInfoUpdate}
          onProfileImageUpdate={handleProfileImageUpdate}
          onSummaryUpdate={handleSummaryUpdate}
          onSkillsUpdate={handleSkillsUpdate}
          onEducationUpdate={handleEducationUpdate}
          onCertificationUpdate={handleCertificationUpdate}
          onExperienceUpdate={handleExperienceUpdate}
        />
      </motion.div>
      
      {isMobile && (
        <div className="text-center text-xs text-gray-500 mb-4 px-4">
          <p>Pinch to zoom or adjust view as needed</p>
        </div>
      )}
    </motion.div>
  );
}
