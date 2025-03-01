
import { useState, useEffect } from 'react';
import { ArrowLeftCircle, ArrowRightCircle, Sparkles } from 'lucide-react';
import { GradientHeading } from './ui/gradient-heading';
import { motion } from 'framer-motion';

export const ResumeTemplates = () => {
  const [currentTemplate, setCurrentTemplate] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const resumeTemplates = [
    {
      name: "Executive Clean",
      image: "/lovable-uploads/489267dd-1129-466d-b30b-dd43b3cbe0e8.png",
      description: "Commanding resume design for C-suite executives and senior leaders, highlighting strategic achievements and board experience"
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

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovering) {
        nextTemplate();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isHovering]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.12)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/20 sm:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
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
        </motion.div>

        <div className="relative max-w-4xl mx-auto overflow-hidden">
          <div className="flex items-center justify-center gap-8">
            <motion.button 
              onClick={prevTemplate}
              className="absolute left-0 z-10 p-2 text-primary hover:text-primary-hover transition-colors"
              aria-label="Previous template"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeftCircle className="w-10 h-10" />
            </motion.button>

            <div className="relative w-[350px] mx-auto" 
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <motion.div
                key={resumeTemplates[currentTemplate].name}
                className="relative bg-white rounded-xl shadow-xl overflow-hidden"
                initial="hidden"
                animate="visible"
                whileHover="hover"
                variants={cardVariants}
                layoutId="activeTemplate"
              >
                <div className="absolute top-2 right-2 z-10">
                  <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span className="text-xs font-medium text-primary">Premium</span>
                  </div>
                </div>
                <div className="relative h-[450px] w-full bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
                  <motion.img
                    src={resumeTemplates[currentTemplate].image}
                    alt={`${resumeTemplates[currentTemplate].name} Resume Template`}
                    className="object-cover w-full h-full"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <motion.div className="p-6 text-left">
                  <h3 className="text-xl font-semibold text-secondary mb-2">{resumeTemplates[currentTemplate].name}</h3>
                  <p className="text-muted-foreground text-sm">{resumeTemplates[currentTemplate].description}</p>
                </motion.div>
              </motion.div>
            </div>

            <motion.button 
              onClick={nextTemplate}
              className="absolute right-0 z-10 p-2 text-primary hover:text-primary-hover transition-colors"
              aria-label="Next template"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRightCircle className="w-10 h-10" />
            </motion.button>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {resumeTemplates.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentTemplate(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentTemplate === index ? 'bg-primary w-4' : 'bg-primary/30'
                }`}
                aria-label={`Go to template ${index + 1}`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0.7 }}
                animate={{ opacity: currentTemplate === index ? 1 : 0.7 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
