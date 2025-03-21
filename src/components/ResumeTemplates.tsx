
import { useState, useEffect } from 'react';
import { ArrowLeftCircle, ArrowRightCircle, Sparkles, ExternalLink } from 'lucide-react';
import { GradientHeading } from './ui/gradient-heading';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const ResumeTemplates = () => {
  const [currentTemplate, setCurrentTemplate] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const resumeTemplates = [
    {
      name: "Executive Clean",
      image: "/lovable-uploads/cd8ab216-33bc-47d9-95d1-0a835652b8c6.png",
      description: "Commanding resume design for C-suite executives and senior leaders, highlighting strategic achievements and board experience",
      color: "from-blue-500 to-blue-700"
    },
    {
      name: "Minimal Elegant",
      image: "/lovable-uploads/5e2cc0ed-eefe-4bbe-84bc-d4b2863a6b95.png",
      description: "Clean and sophisticated design with perfect typography, optimized for creative professionals",
      color: "from-emerald-500 to-emerald-700"
    },
    {
      name: "Professional Executive",
      image: "/lovable-uploads/bcfce93e-6b2d-45f7-ba7e-8db1099ba81e.png",
      description: "Bold modern layout with clean typography, perfect for senior managers and directors",
      color: "from-purple-500 to-purple-700"
    },
    {
      name: "Professional Navy",
      image: "/lovable-uploads/cd8ab216-33bc-47d9-95d1-0a835652b8c6.png",
      description: "Elegant two-column layout with navy header and modern typography, perfect for corporate professionals",
      color: "from-blue-700 to-indigo-900"
    },
    {
      name: "Modern Professional",
      image: "/lovable-uploads/489267dd-1129-466d-b30b-dd43b3cbe0e8.png",
      description: "Contemporary design with creative accents, ideal for forward-thinking professionals in modern industries",
      color: "from-teal-500 to-teal-700"
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
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.3
      }
    }
  };

  const decorationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-background via-background/90 to-background/80 relative overflow-hidden">
      {/* Decorative elements */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-12 left-[10%] w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-12 right-[10%] w-64 h-64 bg-secondary/20 rounded-full blur-3xl"></div>
      </motion.div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <GradientHeading 
            variant="professional" 
            weight="bold" 
            size="lg" 
            className="mb-4"
          >
            Professional Resume Templates
          </GradientHeading>
          <p className="text-lg text-muted-foreground mb-4 max-w-2xl mx-auto">
            Each template is expertly crafted to pass ATS systems while presenting your experience in the most professional light
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Template Preview */}
            <div className="md:col-span-7 relative">
              <motion.button 
                onClick={prevTemplate}
                className="absolute left-0 z-10 p-2 text-primary bg-background rounded-full shadow-lg hover:scale-110 hover:text-primary-hover transition-all -translate-x-1/2 top-1/2 -translate-y-1/2"
                aria-label="Previous template"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeftCircle className="w-10 h-10" />
              </motion.button>

              <div 
                className="relative aspect-[1/1.294] w-full max-w-md mx-auto bg-card rounded-xl shadow-2xl overflow-hidden"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTemplate}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="w-full h-full"
                  >
                    <motion.div 
                      className="absolute top-2 right-2 z-20"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      <div className="flex items-center gap-1 bg-black/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-xs font-medium text-white">Premium</span>
                      </div>
                    </motion.div>

                    <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800">
                      <motion.img
                        src={resumeTemplates[currentTemplate].image}
                        alt={`${resumeTemplates[currentTemplate].name} Resume Template`}
                        className="object-cover w-full h-full"
                        initial={{ scale: 1.05 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.8 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                        <Link to="/signup">
                          <Button variant="secondary" size="sm" className="font-medium gap-2">
                            Use Template <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <motion.button 
                onClick={nextTemplate}
                className="absolute right-0 z-10 p-2 text-primary bg-background rounded-full shadow-lg hover:scale-110 hover:text-primary-hover transition-all translate-x-1/2 top-1/2 -translate-y-1/2"
                aria-label="Next template"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowRightCircle className="w-10 h-10" />
              </motion.button>

              <div className="flex justify-center gap-2 mt-6">
                {resumeTemplates.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentTemplate(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentTemplate === index ? 'bg-primary w-6' : 'bg-primary/30'
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

            {/* Template Details */}
            <div className="md:col-span-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTemplate}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="bg-card/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-border/50"
                >
                  <motion.div 
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 text-white bg-gradient-to-r ${resumeTemplates[currentTemplate].color}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Featured Template
                  </motion.div>
                  
                  <motion.h3 
                    className="text-2xl font-bold mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {resumeTemplates[currentTemplate].name}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-muted-foreground mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {resumeTemplates[currentTemplate].description}
                  </motion.p>
                  
                  <motion.ul
                    className="space-y-3 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {[
                      "ATS-friendly design",
                      "Professional typography",
                      "Balanced content layout",
                      "Optimized for recruiters",
                      "PDF & printable formats"
                    ].map((feature, i) => (
                      <motion.li 
                        key={i} 
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                      >
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Link to="/signup">
                      <Button className="w-full gap-2">
                        Create Your Resume Now
                        <ArrowRightCircle className="w-4 h-4" />
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Decorative graphic elements */}
          <motion.div 
            variants={decorationVariants}
            initial="hidden"
            animate="visible"
            className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-primary/5 backdrop-blur-lg border border-primary/10 hidden md:block"
          ></motion.div>
          <motion.div 
            variants={decorationVariants}
            initial="hidden"
            animate="visible"
            className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-primary/5 backdrop-blur-lg border border-primary/10 hidden md:block"
          ></motion.div>
        </div>
      </div>
    </section>
  );
};
