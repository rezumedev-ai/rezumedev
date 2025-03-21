import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FinalResumePreview } from "@/components/resume-builder/FinalResumePreview";
import { ResumeData } from "@/types/resume";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { isObject, getStringProperty } from "@/utils/type-guards";

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
      
      // Ensure all arrays are initialized
      if (!data.certifications) {
        data.certifications = [];
      }
      
      // Add sample languages and projects if they don't exist (for demonstration)
      // This would normally come from the database, but we're adding it here for the preview
      if (!data.languages) {
        data.languages = [
          { name: "English", proficiency: "Native" },
          { name: "French", proficiency: "Intermediate" },
          { name: "Spanish", proficiency: "Beginner" }
        ];
      }
      
      if (!data.projects) {
        data.projects = [
          { 
            name: "Portfolio Website", 
            description: "Designed and developed a responsive portfolio website to showcase skills and projects.",
            startDate: "2022-06", 
            endDate: "2022-08", 
            technologies: ["React", "Tailwind CSS", "TypeScript"]
          },
          { 
            name: "E-commerce Platform", 
            description: "Built a full-stack e-commerce solution with user authentication and payment processing.",
            startDate: "2021-10", 
            endDate: "2022-03", 
            isOngoing: false,
            technologies: ["Next.js", "Node.js", "MongoDB", "Stripe"]
          }
        ];
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

  // Extract data from resume safely
  const personalInfo = isObject(resume.personal_info) ? resume.personal_info : {};
  const professionalSummary = isObject(resume.professional_summary) ? resume.professional_summary : {};
  
  // Get name and position for title
  const name = getStringProperty(personalInfo, 'fullName', "Your Professional Resume");
  const position = getStringProperty(professionalSummary, 'title', "Resume");

  // Get summary for meta description
  const summary = getStringProperty(professionalSummary, 'summary', "");
  const metaDescription = summary ? summary.substring(0, 100) + '...' : '';

  return (
    <div className="relative bg-white min-h-screen">
      <Helmet>
        <title>{`${name}'s ${position} | Rezume.dev`}</title>
        <meta 
          name="description" 
          content={`Professional resume for ${name}${metaDescription ? ` - ${metaDescription}` : ''}`} 
        />
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" 
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
