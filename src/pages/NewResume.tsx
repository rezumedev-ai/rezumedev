
import { useEffect } from "react";
import { TemplateSelector } from "@/components/resume-builder/TemplateSelector";
import { SimplifiedHeader } from "@/components/SimplifiedHeader";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const NewResume = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Check if user has selected a profile
  useEffect(() => {
    if (user) {
      const selectedProfileId = localStorage.getItem('selectedProfileId');
      if (!selectedProfileId) {
        // Redirect to profile selection if no profile is selected
        navigate('/profiles');
      }
    }
  }, [user, navigate]);
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <SimplifiedHeader />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto pt-20"
      >
        <TemplateSelector />
      </motion.div>
    </main>
  );
};

export default NewResume;
