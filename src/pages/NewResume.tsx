
import { TemplateSelector } from "@/components/resume-builder/TemplateSelector";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";

const NewResume = () => {
  const navigate = useNavigate();

  const handleTemplateSelect = (templateId: string, style: string) => {
    // The navigation is now handled in the TemplateSelector component
    // This is kept for future extensibility
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-16">
        <TemplateSelector onTemplateSelect={handleTemplateSelect} />
      </div>
    </main>
  );
};

export default NewResume;
