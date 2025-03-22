
import { useState } from 'react';
import { ArrowLeftCircle, ArrowRightCircle, ExternalLink } from 'lucide-react';
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
import { TemplateCard } from './resume-builder/ui/TemplateCard';

const featuredTemplates = [
  {
    name: "Executive Clean",
    image: "/lovable-uploads/cd8ab216-33bc-47d9-95d1-0a835652b8c6.png",
    description: "Commanding resume design for senior executives highlighting strategic achievements",
    category: "Executive",
    color: "bg-gradient-to-r from-blue-600 to-blue-800"
  },
  {
    name: "Minimal Elegant",
    image: "/lovable-uploads/5e2cc0ed-eefe-4bbe-84bc-d4b2863a6b95.png",
    description: "Clean, sophisticated design with perfect typography for creative professionals",
    category: "Creative",
    color: "bg-gradient-to-r from-emerald-600 to-emerald-800"
  },
  {
    name: "Professional Executive",
    image: "/lovable-uploads/bcfce93e-6b2d-45f7-ba7e-8db1099ba81e.png",
    description: "Bold modern layout with clean typography, perfect for senior managers",
    category: "Corporate",
    color: "bg-gradient-to-r from-violet-600 to-violet-900"
  },
  {
    name: "Professional Navy",
    image: "/lovable-uploads/d77e5ddd-e95d-4a02-8335-2bbd49bcd257.png",
    description: "Elegant two-column layout with navy header and modern typography",
    category: "Corporate",
    color: "bg-gradient-to-r from-indigo-700 to-indigo-900"
  },
  {
    name: "Modern Professional",
    image: "/lovable-uploads/a41674ee-049d-4ade-88a0-17f53696a879.png",
    description: "Contemporary design with creative accents for forward-thinking professionals",
    category: "Modern",
    color: "bg-gradient-to-r from-teal-600 to-teal-800"
  },
  {
    name: "Simple Classic",
    image: "/lovable-uploads/946c34ac-a462-4649-b919-24aa01a04f02.png",
    description: "Traditional single-column layout preferred by Fortune 500 companies",
    category: "Classic",
    color: "bg-gradient-to-r from-gray-700 to-gray-900"
  }
];

export const ResumeTemplates = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = [
    { name: "All", value: null },
    { name: "Executive", value: "Executive" },
    { name: "Creative", value: "Creative" },
    { name: "Corporate", value: "Corporate" },
    { name: "Modern", value: "Modern" },
    { name: "Classic", value: "Classic" }
  ];

  const filteredTemplates = selectedCategory 
    ? featuredTemplates.filter(t => t.category === selectedCategory)
    : featuredTemplates;

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background styling */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50/50 -z-10" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent -z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent -z-10" />
      
      {/* Decorative elements */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-12 left-[10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-12 right-[10%] w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
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
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Each template is expertly crafted to pass ATS systems while presenting your experience in the most professional light
          </p>
          
          {/* Category filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.value)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${selectedCategory === category.value 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                  }
                `}
              >
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Desktop view - Grid layout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {filteredTemplates.slice(0, 6).map((template, index) => (
            <motion.div
              key={template.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              <TemplateCard template={template} />
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile view - Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="md:hidden max-w-md mx-auto"
        >
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {filteredTemplates.map((template, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-1">
                  <TemplateCard template={template} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center mt-8">
              <CarouselPrevious className="relative mr-2 h-10 w-10 rounded-full border-primary/20 hover:bg-primary/10 hover:text-primary hover:border-primary" />
              <CarouselNext className="relative ml-2 h-10 w-10 rounded-full border-primary/20 hover:bg-primary/10 hover:text-primary hover:border-primary" />
            </div>
          </Carousel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
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

        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto"
        >
          {[
            { 
              title: "ATS Optimized", 
              description: "Pass any applicant tracking system with our perfectly formatted templates" 
            },
            { 
              title: "Professional Design", 
              description: "Elegant typography and balanced layouts catch recruiters' attention" 
            },
            { 
              title: "Industry Specific", 
              description: "Templates tailored for your industry and career level requirements" 
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + (index * 0.1), duration: 0.5 }}
              className="text-center p-6 rounded-lg bg-card/40 backdrop-blur-sm border border-border/30 shadow-sm"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="h-6 w-6 text-primary" />
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
