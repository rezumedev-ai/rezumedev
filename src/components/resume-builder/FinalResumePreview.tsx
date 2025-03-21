
import { useNavigate } from "react-router-dom";
import { ResumeData } from "@/types/resume";
import { resumeTemplates } from "./templates";
import { ResumePreviewToolbar } from "./preview/ResumePreviewToolbar";
import { useResumePreview } from "@/hooks/use-resume-preview";
import { ResumeContent } from "./ResumeContent";
import { toast } from "sonner";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [isZoomed, setIsZoomed] = useState(false);
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
  
  const pageStyle = {
    padding: isMobile ? "0.4in" : template.style.spacing.margins.top,
    fontFamily: template.style.titleFont?.split(' ')[0].replace('font-', '') || 'sans'
  };

  const handleTemplateSwitching = (templateId: string) => {
    if (templateId === resumeState.template_id) return;
    
    handleTemplateChange(templateId);
    toast.success(`Template updated to ${resumeTemplates.find(t => t.id === templateId)?.name || 'new template'}`);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
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
        // For mobile, calculate the best scale
        const isPortrait = window.innerHeight > window.innerWidth;
        const availableWidth = containerWidth - 32; // Allow for some padding
        const availableHeight = containerHeight - 120; // Allow for toolbar and some padding
        
        // Calculate scale based on available dimensions
        const widthScale = availableWidth / pageWidth;
        const heightScale = availableHeight / pageHeight;
        
        if (isZoomed) {
          // When zoomed, prioritize readability over seeing the whole page
          setResumeScale(Math.min(0.8, widthScale * 1.5));
        } else {
          // When not zoomed, prioritize seeing the whole page
          const baseScale = Math.min(widthScale, heightScale);
          // Set a maximum scale factor for portrait mode to ensure users can see more context
          const maxScale = isPortrait ? 0.45 : 0.65;
          // Set a minimum scale to ensure the resume is not too small
          const minScale = 0.35;
          setResumeScale(Math.max(Math.min(baseScale, maxScale), minScale));
        }
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
  }, [isMobile, isZoomed]);
  
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
      
      {isMobile && (
        <Button
          variant="outline"
          size="sm"
          onClick={toggleZoom}
          className="absolute top-16 right-4 z-10 shadow-sm"
        >
          {isZoomed ? <ZoomOut className="h-4 w-4 mr-1" /> : <ZoomIn className="h-4 w-4 mr-1" />}
          {isZoomed ? "Zoom Out" : "Zoom In"}
        </Button>
      )}
      
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
          <p>Pinch to zoom or use the zoom button to adjust view</p>
        </div>
      )}
    </motion.div>
  );
}
