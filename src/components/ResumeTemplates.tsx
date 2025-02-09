
import { useState } from 'react';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';

export const ResumeTemplates = () => {
  const [currentTemplate, setCurrentTemplate] = useState(0);

  const resumeTemplates = [
    {
      name: "Executive",
      image: "https://placehold.co/600x800/4F46E5/FFFFFF/png?text=Executive+Resume+Template&font=source+sans+pro",
      description: "Commanding resume design for C-suite executives and senior leaders, highlighting strategic achievements and board experience"
    },
    {
      name: "Tech Professional",
      image: "https://placehold.co/600x800/4338CA/FFFFFF/png?text=Tech+Professional+Resume&font=source+sans+pro",
      description: "Optimized for software engineers and IT professionals, featuring technical skills matrix and project highlights"
    },
    {
      name: "Creative Director",
      image: "https://placehold.co/600x800/3730A3/FFFFFF/png?text=Creative+Director+Resume&font=source+sans+pro",
      description: "Portfolio-style resume for creative professionals, showcasing visual projects and brand campaigns"
    },
    {
      name: "Data Scientist",
      image: "https://placehold.co/600x800/312E81/FFFFFF/png?text=Data+Scientist+Resume&font=source+sans+pro",
      description: "Data-driven layout highlighting statistical achievements, machine learning projects, and research publications"
    }
  ];

  const nextTemplate = () => {
    setCurrentTemplate((prev) => (prev + 1) % resumeTemplates.length);
  };

  const prevTemplate = () => {
    setCurrentTemplate((prev) => (prev - 1 + resumeTemplates.length) % resumeTemplates.length);
  };

  return (
    <section className="py-20 bg-white sm:py-32">
      <div className="container">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-secondary mb-4 animate-fade-up bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover text-center">
          Professional Resume Templates That Get You Hired
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-16 animate-fade-up max-w-2xl mx-auto text-center" style={{ animationDelay: '100ms' }}>
          Each template is expertly crafted to pass ATS systems while making your experience shine
        </p>

        <div className="relative max-w-4xl mx-auto overflow-hidden">
          <div className="flex items-center justify-center gap-8">
            <button 
              onClick={prevTemplate}
              className="absolute left-0 z-10 p-2 text-primary hover:text-primary-hover transition-colors"
              aria-label="Previous template"
            >
              <ArrowLeftCircle className="w-10 h-10" />
            </button>

            <div className="relative w-[300px] mx-auto">
              <div
                key={resumeTemplates[currentTemplate].name}
                className="relative bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="relative h-[400px] w-full bg-gradient-to-br from-primary/90 to-primary overflow-hidden">
                  <img
                    src={resumeTemplates[currentTemplate].image}
                    alt={`${resumeTemplates[currentTemplate].name} Resume Template`}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="p-6 text-left">
                  <h3 className="text-xl font-semibold text-secondary mb-2">{resumeTemplates[currentTemplate].name}</h3>
                  <p className="text-muted-foreground text-sm">{resumeTemplates[currentTemplate].description}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={nextTemplate}
              className="absolute right-0 z-10 p-2 text-primary hover:text-primary-hover transition-colors"
              aria-label="Next template"
            >
              <ArrowRightCircle className="w-10 h-10" />
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {resumeTemplates.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTemplate(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentTemplate === index ? 'bg-primary w-4' : 'bg-primary/30'
                }`}
                aria-label={`Go to template ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
