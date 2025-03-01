
import { useState } from 'react';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import { GradientHeading } from './ui/gradient-heading';

export const ResumeTemplates = () => {
  const [currentTemplate, setCurrentTemplate] = useState(0);

  const resumeTemplates = [
    {
      name: "Executive Clean",
      image: "/lovable-uploads/489267dd-1129-466d-b30b-dd43b3cbe0e8.png",
      description: "Commanding resume design for C-suite executives and senior leaders, highlighting strategic achievements and board experience"
    },
    {
      name: "Modern Split",
      image: "/lovable-uploads/50a6d61f-0b70-4d4b-8fd8-e293d40c5ae1.png",
      description: "Professional two-column design that maximizes content, ideal for technical roles and experienced professionals"
    },
    {
      name: "Minimal Elegant",
      image: "/lovable-uploads/a6ed21c1-e465-46fb-a6ff-9f66cc7b87b3.png",
      description: "Clean and sophisticated design with perfect typography, optimized for creative professionals"
    },
    {
      name: "Professional Executive",
      image: "/lovable-uploads/eca7a378-81fd-4d29-9194-b292d08d283c.png",
      description: "Bold modern layout with clean typography, perfect for senior managers and directors"
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
        <GradientHeading 
          variant="professional" 
          weight="bold" 
          size="lg" 
          className="mb-4 text-center"
        >
          Professional Resume Templates
        </GradientHeading>
        <p className="text-lg text-muted-foreground mb-16 max-w-2xl mx-auto text-center">
          Each template is expertly crafted to pass ATS systems while presenting your experience in the most professional light
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
                <div className="relative h-[400px] w-full bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
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
