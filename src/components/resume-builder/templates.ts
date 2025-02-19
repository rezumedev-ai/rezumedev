
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
    layout: "classic" | "modern" | "minimal" | "executive";
    colors: {
      primary: string;
      secondary: string;
      text: string;
      border: string;
      background: string;
    };
    spacing: {
      sectionGap: string;
      itemGap: string;
      contentPadding: string;
    };
  };
}

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: "executive-clean",
    name: "Executive Clean",
    description: "Traditional single-column layout preferred by Fortune 500 companies",
    imageUrl: "/lovable-uploads/489267dd-1129-466d-b30b-dd43b3cbe0e8.png",
    style: {
      titleFont: "font-serif text-[32px] font-bold tracking-tight text-gray-900",
      headerStyle: "mb-8 pb-4 border-b border-gray-900",
      sectionStyle: "text-[18px] font-bold text-gray-900 uppercase tracking-wider mb-4",
      contentStyle: "space-y-3 text-[14px] leading-snug",
      layout: "classic",
      colors: {
        primary: "#1A1A1A",
        secondary: "#4A4A4A",
        text: "#2D2D2D",
        border: "#DEDEDE",
        background: "#FFFFFF"
      },
      spacing: {
        sectionGap: "2rem",
        itemGap: "1.5rem",
        contentPadding: "2.5rem"
      }
    }
  },
  {
    id: "modern-split",
    name: "Modern Split",
    description: "Contemporary two-column design for creative professionals",
    imageUrl: "/lovable-uploads/50a6d61f-0b70-4d4b-8fd8-e293d40c5ae1.png",
    style: {
      titleFont: "font-sans text-[28px] font-light tracking-wide text-gray-800",
      headerStyle: "mb-6",
      sectionStyle: "text-[16px] font-medium text-gray-700 uppercase tracking-wider mb-3",
      contentStyle: "space-y-4 text-[13px] leading-relaxed",
      layout: "modern",
      colors: {
        primary: "#333333",
        secondary: "#666666",
        text: "#4A4A4A",
        border: "#EEEEEE",
        background: "#FFFFFF"
      },
      spacing: {
        sectionGap: "1.75rem",
        itemGap: "1.25rem",
        contentPadding: "2rem"
      }
    }
  },
  {
    id: "minimal-elegant",
    name: "Minimal Elegant",
    description: "Clean and sophisticated design with perfect typography",
    imageUrl: "/lovable-uploads/a6ed21c1-e465-46fb-a6ff-9f66cc7b87b3.png",
    style: {
      titleFont: "font-sans text-[36px] font-light tracking-tight text-gray-800",
      headerStyle: "mb-8",
      sectionStyle: "text-[14px] font-medium text-gray-500 uppercase tracking-widest mb-4",
      contentStyle: "space-y-4 text-[13px] leading-relaxed",
      layout: "minimal",
      colors: {
        primary: "#2D2D2D",
        secondary: "#757575",
        text: "#404040",
        border: "#E5E5E5",
        background: "#FFFFFF"
      },
      spacing: {
        sectionGap: "2.25rem",
        itemGap: "1.5rem",
        contentPadding: "2.25rem"
      }
    }
  },
  {
    id: "professional-executive",
    name: "Professional Executive",
    description: "Traditional format optimized for ATS systems",
    imageUrl: "/lovable-uploads/eca7a378-81fd-4d29-9194-b292d08d283c.png",
    style: {
      titleFont: "font-serif text-[24px] font-bold tracking-normal text-gray-900",
      headerStyle: "mb-6 pb-3 border-b-2 border
      -gray-900",
      sectionStyle: "text-[16px] font-bold text-gray-900 uppercase tracking-wide mb-3",
      contentStyle: "space-y-3 text-[13px] leading-snug",
      layout: "executive",
      colors: {
        primary: "#000000",
        secondary: "#333333",
        text: "#1A1A1A",
        border: "#CCCCCC",
        background: "#FFFFFF"
      },
      spacing: {
        sectionGap: "1.5rem",
        itemGap: "1rem",
        contentPadding: "2rem"
      }
    }
  }
];
