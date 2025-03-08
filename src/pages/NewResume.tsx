
import { TemplateSelector } from "@/components/resume-builder/TemplateSelector";
import { SimplifiedHeader } from "@/components/SimplifiedHeader";

const NewResume = () => {
  return (
    <main className="min-h-screen bg-white">
      <SimplifiedHeader />
      <div className="max-w-7xl mx-auto pt-16">
        <TemplateSelector />
      </div>
    </main>
  );
};

export default NewResume;
