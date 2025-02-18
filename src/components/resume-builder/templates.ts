
export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  style: {
    titleFont: string;
    headerStyle: string;
    sectionStyle: string;
    contentStyle: string;
    layout: string;
  };
}

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: "professional-classic",
    name: "Professional Classic",
    description: "Traditional format with clean typography and clear section breaks",
    imageUrl: "/lovable-uploads/e822cc85-690d-415c-acfe-43fd9a3ef8f2.png",
    style: {
      titleFont: "font-serif text-3xl font-bold tracking-normal text-center",
      headerStyle: "text-center space-y-1 mb-8 border-b border-gray-300 pb-4",
      sectionStyle: "text-lg font-semibold border-b border-gray-300 pb-1 mb-3 uppercase",
      contentStyle: "space-y-4 mb-6",
      layout: "single-column"
    }
  },
  {
    id: "modern-split",
    name: "Modern Split",
    description: "Contemporary two-column layout with minimalist design",
    imageUrl: "/lovable-uploads/a666fa80-5ad6-4527-8e61-74dbfe585607.png",
    style: {
      titleFont: "font-sans text-4xl font-bold tracking-wide",
      headerStyle: "grid grid-cols-[1fr_2fr] gap-8 mb-8",
      sectionStyle: "text-lg font-semibold mb-4 uppercase",
      contentStyle: "grid grid-cols-[1fr_2fr] gap-8",
      layout: "two-column"
    }
  },
  {
    id: "executive-grid",
    name: "Executive Grid",
    description: "Clean grid layout with modern typography",
    imageUrl: "/lovable-uploads/362d274e-3bfc-4f4d-a8aa-993e15d83306.png",
    style: {
      titleFont: "font-sans text-4xl font-light tracking-widest uppercase text-gray-800",
      headerStyle: "border-b border-gray-200 pb-6 mb-8 grid grid-cols-2 gap-8",
      sectionStyle: "text-xl uppercase tracking-wide font-medium mb-4 text-gray-700",
      contentStyle: "grid grid-cols-2 gap-x-16 gap-y-6",
      layout: "grid"
    }
  },
  {
    id: "minimal-elegant",
    name: "Minimal Elegant",
    description: "Sophisticated design with generous whitespace",
    imageUrl: "/lovable-uploads/8d5fd925-5d93-47a6-8b55-7eea43de3e43.png",
    style: {
      titleFont: "font-sans text-5xl font-light tracking-wider uppercase text-gray-800",
      headerStyle: "mb-12 space-y-2",
      sectionStyle: "text-lg uppercase tracking-wider font-medium mb-4 text-gray-700",
      contentStyle: "space-y-8",
      layout: "minimal"
    }
  }
];
