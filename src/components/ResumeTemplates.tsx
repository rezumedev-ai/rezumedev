
import { useState, useEffect } from 'react';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';

const TYPE_SPEED = 50;
const ERASE_SPEED = 30;
const PAUSE_DURATION = 2000;

const resumeContent = [
  {
    name: "Software Engineer",
    experience: "Senior Software Engineer with 5+ years",
    skills: "React, TypeScript, Node.js",
    achievements: "Led team of 6 developers"
  },
  {
    name: "Product Manager",
    experience: "Product Manager with 4+ years",
    skills: "Agile, Scrum, User Research",
    achievements: "Launched 3 successful products"
  },
  {
    name: "Data Scientist",
    experience: "Data Scientist with 3+ years",
    skills: "Python, ML, TensorFlow",
    achievements: "Improved accuracy by 40%"
  }
];

export const ResumeTemplates = () => {
  const [currentTemplate, setCurrentTemplate] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [contentIndex, setContentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const typeText = async () => {
      const currentContent = resumeContent[contentIndex];
      const textToType = `Name: ${currentContent.name}\nExperience: ${currentContent.experience}\nSkills: ${currentContent.skills}\nKey Achievement: ${currentContent.achievements}`;
      
      if (isTyping) {
        if (displayText.length < textToType.length) {
          timeout = setTimeout(() => {
            setDisplayText(textToType.slice(0, displayText.length + 1));
          }, TYPE_SPEED);
        } else {
          timeout = setTimeout(() => {
            setIsTyping(false);
          }, PAUSE_DURATION);
        }
      } else {
        if (displayText.length > 0) {
          timeout = setTimeout(() => {
            setDisplayText(displayText.slice(0, -1));
          }, ERASE_SPEED);
        } else {
          setContentIndex((prev) => (prev + 1) % resumeContent.length);
          setIsTyping(true);
        }
      }
    };

    typeText();
    return () => clearTimeout(timeout);
  }, [displayText, contentIndex, isTyping]);

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
        <h2 className="text-4xl font-bold text-secondary mb-4 text-center">
          Resume Templates
        </h2>
        <p className="text-lg text-muted-foreground mb-16 max-w-2xl mx-auto text-center">
          Each template is expertly crafted to pass ATS systems while making your experience shine
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Animated Resume Preview */}
          <div className="relative p-8 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
            <div className="relative font-mono text-sm whitespace-pre-wrap min-h-[300px]">
              <span className="text-primary">{displayText}</span>
              <span className="animate-pulse">|</span>
            </div>
          </div>

          {/* Template Carousel */}
          <div className="relative overflow-hidden">
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
                    <h3 className="text-xl font-semibold text-secondary mb-2">
                      {resumeTemplates[currentTemplate].name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {resumeTemplates[currentTemplate].description}
                    </p>
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
      </div>
    </section>
  );
};
