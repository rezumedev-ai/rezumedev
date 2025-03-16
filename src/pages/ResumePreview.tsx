
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FinalResumePreview } from "@/components/resume-builder/FinalResumePreview";
import { ResumeData } from "@/types/resume";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

export default function ResumePreview() {
  const { id } = useParams();

  const { data: resume, isLoading } = useQuery({
    queryKey: ["resume", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      
      // Ensure certifications is always an array, even if null/undefined
      if (!data.certifications) {
        data.certifications = [];
      }
      
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-lg text-gray-600 font-medium">Loading your resume preview...</div>
        </motion.div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-500 text-center">
          <div className="text-xl font-medium mb-2">Resume not found</div>
          <p className="text-gray-400">The resume you're looking for may have been deleted or doesn't exist</p>
        </div>
      </div>
    );
  }

  // Get the name from resume data for the page title
  const name = resume.personal?.name || "Your Professional Resume";
  const position = resume.personal?.jobTitle || "Resume";

  return (
    <div className="relative bg-white min-h-screen">
      <Helmet>
        <title>{`${name}'s ${position} | Rezume.dev`}</title>
        <meta 
          name="description" 
          content={`Professional resume for ${name}${resume.professionalSummary ? ` - ${resume.professionalSummary.substring(0, 100)}...` : ''}`} 
        />
        <link rel="icon" href="/custom-favicon.svg" />
      </Helmet>
      <FinalResumePreview
        resumeData={resume as unknown as ResumeData}
        resumeId={id as string}
      />
    </div>
  );
}
