import { useState, useEffect } from 'react';
import { ArrowLeftCircle, ArrowRightCircle, Sparkles, ExternalLink } from 'lucide-react';
import { GradientHeading } from './ui/gradient-heading';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

export const ResumeTemplates = () => {
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
      image: "/lovable-uploads/d77e5ddd-e95d-4a02-8335-2bbd49bcd257.png",
      description: "Elegant two-column layout with navy header and modern typography, perfect for corporate professionals",
      color: "from-blue-700 to-indigo-900"
    },
    {
      name: "Modern Professional",
      image: "/lovable-uploads/a41674ee-049d-4ade-88a0-17f53696a879.png",
      description: "Contemporary design with creative accents, ideal for forward-thinking professionals in modern industries",
      color: "from-teal-500 to-teal-700"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-background via-background/90 to-background/80 relative overflow-hidden">
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
          className="text-center mb-12"
        >
          <GradientHeading 
            variant="primary" 
            weight="bold" 
            size="lg" 
            className="mb-4"
          >
            Professional Resume Templates
          </GradientHeading>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Each template is expertly crafted to pass ATS systems while presenting your experience in the most professional light
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-7xl mx-auto"
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {resumeTemplates.map((template, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <motion.div
                      whileHover={{ 
                        scale: 1.03, 
                        y: -5,
                        transition: { duration: 0.2 } 
                      }}
                      className="h-full"
                    >
                      <Card className="overflow-hidden h-full border border-border/40 bg-card/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                        <div className="relative aspect-[1/1.294] bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
                          <div className="absolute top-2 right-2 z-20">
                            <div className="flex items-center gap-1 bg-black/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                              <span className="text-xs font-medium text-white">Premium</span>
                            </div>
                          </div>
                          
                          <img
                            src={template.image}
                            alt={`${template.name} Resume Template`}
                            className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
                          />
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                            <Link to="/signup">
                              <Button variant="secondary" size="sm" className="font-medium gap-2">
                                Use Template <ExternalLink className="w-3.5 h-3.5" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                        
                        <CardContent className="p-6">
                          <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 text-white bg-gradient-to-r ${template.color}`}>
                            Featured Template
                          </div>
                          <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                          <p className="text-muted-foreground text-sm mb-6">
                            {template.description}
                          </p>
                          <Link to="/signup" className="block mt-auto">
                            <Button variant="outline" size="sm" className="w-full gap-2 hover:bg-primary/10 transition-colors">
                              Preview Template
                              <ArrowRightCircle className="w-4 h-4" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center mt-8">
              <CarouselPrevious className="relative mr-2 inset-auto left-0 top-0 h-10 w-10 rounded-full border-primary/20 hover:bg-primary/10 hover:text-primary hover:border-primary" />
              <CarouselNext className="relative ml-2 inset-auto right-0 top-0 h-10 w-10 rounded-full border-primary/20 hover:bg-primary/10 hover:text-primary hover:border-primary" />
            </div>
          </Carousel>
        </motion.div>

        <motion.div
          initial={{ opacity:.0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-14"
        >
          <Link to="/signup">
            <Button size="lg" className="px-8 py-6 text-base bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary-hover transition-all duration-300 shadow-lg hover:shadow-xl">
              Explore All Templates
              <ArrowRightCircle className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>

        {/* Features list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto"
        >
          {[
            { title: "ATS Optimized", description: "Pass any applicant tracking system with our perfectly formatted templates" },
            { title: "Professional Design", description: "Elegant typography and balanced layouts catch recruiters' attention" },
            { title: "Industry Specific", description: "Templates tailored for your industry and career level requirements" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + (index * 0.1), duration: 0.5 }}
              className="text-center p-6 rounded-lg bg-card/40 backdrop-blur-sm border border-border/30 shadow-sm"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
