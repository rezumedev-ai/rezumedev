
import { TemplateSelector } from "@/components/resume-builder/TemplateSelector";
import { Header } from "@/components/Header";

const NewResume = () => {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto pt-16">
        <TemplateSelector />
      </div>
    </main>
  );
};

export default NewResume;
