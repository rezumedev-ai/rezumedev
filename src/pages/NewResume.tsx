
import { TemplateSelector } from "@/components/resume-builder/TemplateSelector";
import { SimplifiedHeader } from "@/components/SimplifiedHeader";
import { motion } from "framer-motion";

const NewResume = () => {
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
