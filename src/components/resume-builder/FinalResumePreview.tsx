
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
import { Eye, ZoomIn, ZoomOut } from "lucide-react";
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
    padding: isMobile ? "0.3in" : template.style.spacing.margins.top,
    fontFamily: template.style.titleFont?.split(' ')[0].replace('font-', '') || 'sans'
  };
  
  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
    // Recalculate scale after state update
    setTimeout(() => updateScale(), 50);
  };

  const handleTemplateSwitching = (templateId: string) => {
    if (templateId === resumeState.template_id) return;
    
    handleTemplateChange(templateId);
    toast.success(`Template updated to ${resumeTemplates.find(t => t.id === templateId)?.name || 'new template'}`);
  };

  const updateScale = () => {
    if (!containerRef.current) return;
    
    // Get container dimensions
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    
    // A4 dimensions (in pixels at 96 DPI)
    const pageWidth = 21 * 37.8; // ~793px
    const pageHeight = 29.7 * 37.8; // ~1122px
    
    if (isMobile) {
      // For mobile, optimize for portrait view to show more of the resume
      const isPortrait = window.innerHeight > window.innerWidth;
      const availableWidth = containerWidth - 24; // Reduced padding for mobile
      const availableHeight = containerHeight - 100; // Reduced space for toolbar
      
      // Calculate scale based on available dimensions
      const widthScale = availableWidth / pageWidth;
      
      if (isZoomed) {
        // When zoomed, prioritize readability while still showing the full width
        setResumeScale(Math.min(widthScale * 1.5, 0.75));
      } else {
        // When not zoomed, show the full resume with a reasonable scale
        // Always ensure the full width is visible
        setResumeScale(Math.max(widthScale, 0.35));
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

  useEffect(() => {
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
      className="flex flex-col items-center min-h-screen bg-white py-2 sm:py-4 relative"
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
      
      <div className="relative w-full max-w-[21cm] mx-auto">
        {isMobile && (
          <Button
            variant="outline"
            size="sm"
            onClick={toggleZoom}
            className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-white/80 backdrop-blur-sm px-2 py-1 h-auto"
          >
            {isZoomed ? <ZoomOut className="h-3 w-3" /> : <ZoomIn className="h-3 w-3" />}
            <span className="text-xs">{isZoomed ? "Zoom Out" : "Zoom In"}</span>
          </Button>
        )}
        
        <motion.div 
          id="resume-content" 
          className="w-[21cm] min-h-[29.7cm] bg-white shadow-xl mx-auto mb-4 sm:mb-6 relative overflow-hidden"
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
      </div>
      
      {isMobile && (
        <div className="text-center text-xs text-gray-500 mb-2 px-4">
          <p>Tap the zoom button or pinch to adjust view</p>
        </div>
      )}
    </motion.div>
  );
}
