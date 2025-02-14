
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
  };
}

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    description: "Clean, minimalist design perfect for any professional role",
    imageUrl: "/lovable-uploads/2f49688c-eaed-4935-ab77-f54b31da8918.png",
    style: {
      titleFont: "font-sans text-4xl font-bold tracking-tight",
      headerStyle: "text-center space-y-2 mb-8",
      sectionStyle: "border-b border-gray-200 pb-2 mb-4 text-lg font-semibold",
      contentStyle: "space-y-4"
    }
  },
  {
    id: "modern-split",
    name: "Modern Split",
    description: "Contemporary two-column layout with clean typography",
    imageUrl: "/lovable-uploads/946c34ac-a462-4649-b919-24aa01a04f02.png",
    style: {
      titleFont: "font-sans text-5xl font-light tracking-widest uppercase",
      headerStyle: "text-left border-b border-gray-200 pb-6 mb-8",
      sectionStyle: "text-lg uppercase tracking-wide font-medium mb-4",
      contentStyle: "grid grid-cols-[1fr_2fr] gap-8"
    }
  },
  {
    id: "professional-grid",
    name: "Professional Grid",
    description: "Traditional format with modern grid-based layout",
    imageUrl: "/lovable-uploads/1e1aea6a-52be-4563-a0c6-408bfcee87fa.png",
    style: {
      titleFont: "font-serif text-4xl font-bold",
      headerStyle: "grid grid-cols-[2fr_1fr] gap-8 mb-8",
      sectionStyle: "font-serif text-xl font-semibold mb-4",
      contentStyle: "space-y-6"
    }
  },
  {
    id: "executive",
    name: "Executive",
    description: "Sophisticated design for senior professionals",
    imageUrl: "/lovable-uploads/7d3bf950-95b9-4ffc-9b1e-48bda9370eda.png",
    style: {
      titleFont: "font-serif text-5xl font-bold tracking-tight",
      headerStyle: "border-b-2 border-gray-900 pb-6 mb-8",
      sectionStyle: "text-xl uppercase tracking-wide font-semibold mb-6",
      contentStyle: "grid grid-cols-[1fr_3fr] gap-12"
    }
  }
];
