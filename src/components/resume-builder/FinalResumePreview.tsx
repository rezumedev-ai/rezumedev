
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
  const [resumeScale, setResumeScale] = useState(1);
  const [showOverlay, setShowOverlay] = useState(false);
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

  useEffect(() => {
    // Show overlay message for mobile users only when the component mounts
    if (isMobile) {
      setShowOverlay(true);
      const timer = setTimeout(() => {
        setShowOverlay(false);
      }, 3000); // Show overlay for 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

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
        
        // When not zoomed, prioritize seeing the whole page
        const baseScale = Math.min(widthScale, heightScale);
        // Set a maximum scale factor for portrait mode to ensure users can see more context
        const maxScale = isPortrait ? 0.45 : 0.65;
        // Set a minimum scale to ensure the resume is not too small
        const minScale = 0.35;
        setResumeScale(Math.max(Math.min(baseScale, maxScale), minScale));
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
      
      <AnimatePresence>
        {showOverlay && isMobile && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="bg-white rounded-lg p-5 max-w-xs w-full text-center shadow-xl"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-1 text-gray-900">Best View Tip</h3>
              <p className="text-gray-600 text-sm">
                Pinch to zoom out for the best experience and to view the complete resume
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
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
          <p>Pinch to zoom or adjust view as needed</p>
        </div>
      )}
    </motion.div>
  );
}
