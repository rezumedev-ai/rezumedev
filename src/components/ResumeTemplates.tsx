import { useState, useRef, useEffect } from 'react';
import { ArrowRightCircle, ExternalLink, Sparkles } from 'lucide-react';
import { GradientHeading } from './ui/gradient-heading';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { TemplateSelectionGrid } from './resume-builder/preview/TemplateSelectionGrid';

export const ResumeTemplates = () => {
  const resumeTemplates = [
    {
      id: "executive-clean",
      name: "Executive Clean",
      image: "/uploads/cd8ab216-33bc-47d9-95d1-0a835652b8c6.png",
      description: "Commanding resume design for C-suite executives and senior leaders, highlighting strategic achievements and board experience",
      color: "from-blue-500 to-blue-700"
    },
    {
      id: "professional-executive",
      name: "Professional Executive",
      image: "/uploads/bcfce93e-6b2d-45f7-ba7e-8db1099ba81e.png",
      description: "Bold modern layout with clean typography, perfect for senior managers and directors",
      color: "from-purple-500 to-purple-700"
    },
    {
      id: "professional-navy",
      name: "Professional Navy",
      image: "/uploads/d77e5ddd-e95d-4a02-8335-2bbd49bcd257.png",
      description: "Elegant two-column layout with navy header and modern typography, perfect for corporate professionals",
      color: "from-blue-700 to-indigo-900"
    },
    {
      id: "modern-professional",
      name: "Modern Professional",
      image: "/uploads/a41674ee-049d-4ade-88a0-17f53696a879.png",
      description: "Contemporary design with creative accents, ideal for forward-thinking professionals in modern industries",
      color: "from-teal-500 to-teal-700"
    },
    {
      id: "ivy-league",
      name: "The Ivy",
      image: "/uploads/ivy-preview.png",
      description: "Prestigious academic layout with serif typography and dense content structure, perfect for academia and research positions",
      color: "from-gray-700 to-gray-900"
    },
    {
      id: "creative-portfolio",
      name: "The Creative",
      image: "/uploads/creative-preview.png",
      description: "Bold, high-impact design with accent colors for creative professionals in design, marketing, and tech industries",
      color: "from-indigo-500 to-indigo-700"
    }
  ];

  // Reference for the template section
  const sectionRef = useRef<HTMLDivElement>(null);

  // Mouse position for spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smoothed versions of mouse coordinates
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 300 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 300 });

  // Handle mouse move for spotlight effect
  const handleMouseMove = (e: React.MouseEvent) => {
    const { left, top } = sectionRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  // Template selection state for the grid view
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(resumeTemplates[0].id);

  // Convert our simplified templates to the format expected by TemplateSelectionGrid
  const formattedTemplates = resumeTemplates.map(template => ({
    id: template.id,
    name: template.name,
    description: template.description,
    imageUrl: template.image,
    style: {
      titleFont: "font-sans",
      headerStyle: "mb-6",
      sectionStyle: "text-lg font-semibold",
      contentStyle: "space-y-4",
      layout: "classic" as const,
      colors: {
        primary: "#1A1A1A",
        secondary: "#4A4A4A",
        text: "#2D2D2D",
        border: "#E5E7EB",
        background: "#FFFFFF"
      },
      spacing: {
        sectionGap: "1.5rem",
        itemGap: "1.25rem",
        contentPadding: "2rem",
        headerHeight: "160px",
        margins: {
          top: "0.5in",
          right: "0.5in",
          bottom: "0.5in",
          left: "0.5in"
        }
      },
      dimensions: {
        maxWidth: "8.5in",
        minHeight: "11in"
      },
      typography: {
        titleSize: "46px",
        subtitleSize: "20px",
        bodySize: "16px",
        lineHeight: "1.4"
      },
      icons: {
        sections: false,
        contact: true,
        bullets: "dot" as const
      }
    }
  }));

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="py-24 relative overflow-hidden"
    >
      {/* Gradient background with enhanced effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 z-0">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-[15%] w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-[10%] w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-60 right-[25%] w-60 h-60 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Spotlight effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 lg:opacity-40"
        style={{
          background: 'radial-gradient(600px circle at var(--x) var(--y), rgba(99, 102, 241, 0.15), transparent 40%)',
          '--x': smoothX,
          '--y': smoothY
        } as any}
      />

      <div className="container relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
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
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, staggerChildren: 0.1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resumeTemplates.map((template, index) => (
              <TemplateCard
                key={template.id}
                template={template}
                index={index}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mt-10"
        >
          <Link to="/signup">
            <Button size="lg" className="px-8 py-6 text-base bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary-hover transition-all duration-300 shadow-lg hover:shadow-xl group">
              Explore All Templates
              <ArrowRightCircle className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>

        {/* Features list with improved design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto"
        >
          {[
            { title: "ATS Optimized", description: "Pass any applicant tracking system with our perfectly formatted templates" },
            { title: "Professional Design", description: "Elegant typography and balanced layouts catch recruiters' attention" },
            { title: "Industry Specific", description: "Templates tailored for your industry and career level requirements" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + (index * 0.1), duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center p-6 rounded-lg bg-white backdrop-blur-sm border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
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

// New Template Card component with modern design
interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    image: string;
    description: string;
    color: string;
  };
  index: number;
}

const TemplateCard = ({ template, index }: TemplateCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Values for the 3D rotation effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Transform mouse movement to rotation values
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  // Handle mouse move for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const centerX = rect.left + width / 2;
    const centerY = rect.top + height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    x.set(mouseX);
    y.set(mouseY);
  };

  // Reset position when mouse leaves
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="h-full"
    >
      <motion.div
        style={{ rotateX, rotateY, perspective: 1000 }}
        className={`h-full rounded-2xl overflow-hidden backdrop-blur-sm border border-gray-100 hover:border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform
          ${isHovered ? 'scale-[1.02]' : 'scale-100'}`}
      >
        <div className={`bg-gradient-to-b ${template.color} h-8 rounded-t-xl transition-height duration-300 ${isHovered ? 'h-12' : ''}`} />

        <div className="bg-white p-5">
          {/* Template preview with 3D effect */}
          <div className="relative rounded-lg overflow-hidden bg-gray-100 mb-4">
            <AspectRatio ratio={8.5 / 11} className="relative">
              <div className="absolute top-2 right-2 z-20">
                <div className="flex items-center gap-1 bg-black/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-medium text-white">Premium</span>
                </div>
              </div>

              <img
                src={template.image}
                alt={`${template.name} Resume Template`}
                className="w-full h-full object-contain hover:scale-[1.03] transition-transform duration-300"
                loading="lazy"
              />

              {/* Overlay with actions */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Link to="/signup">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="font-medium gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    Use Template <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </motion.div>
            </AspectRatio>
          </div>

          {/* Template details with animated border */}
          <div
            className={`relative p-4 rounded-xl border ${isHovered ? 'border-primary/20 bg-primary/5' : 'border-gray-100'} transition-colors duration-300`}
          >
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 text-white bg-gradient-to-r ${template.color}`}>
              Featured Template
            </div>
            <h3 className="text-xl font-bold mb-2">{template.name}</h3>
            <p className="text-muted-foreground text-sm mb-6">
              {template.description}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
