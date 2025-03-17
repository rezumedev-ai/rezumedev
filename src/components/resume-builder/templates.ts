
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
      headerHeight: string;
      margins: {
        top: string;
        right: string;
        bottom: string;
        left: string;
      };
    };
    dimensions: {
      maxWidth: string;
      minHeight: string;
    };
    typography: {
      titleSize: string;
      subtitleSize: string;
      bodySize: string;
      lineHeight: string;
    };
    icons: {
      sections: boolean;
      contact: boolean;
      bullets: "dot" | "dash" | "arrow" | "none";
    };
  };
}

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: "executive-clean",
    name: "Executive Clean",
    description: "Traditional single-column layout preferred by Fortune 500 companies",
    imageUrl: "/lovable-uploads/cd8ab216-33bc-47d9-95d1-0a835652b8c6.png",
    style: {
      titleFont: "font-serif text-[48px] font-bold tracking-tight text-gray-900",
      headerStyle: "mb-8 pb-4 border-b-2 border-gray-800",
      sectionStyle: "text-[22px] font-bold text-gray-900 uppercase tracking-wide mb-4 pb-2 border-b border-gray-300",
      contentStyle: "space-y-5",
      layout: "classic",
      colors: {
        primary: "#1A1A1A",
        secondary: "#4A4A4A",
        text: "#2D2D2D",
        border: "#E5E7EB",
        background: "#FFFFFF"
      },
      spacing: {
        sectionGap: "2rem",
        itemGap: "1.5rem",
        contentPadding: "2.5rem",
        headerHeight: "170px",
        margins: {
          top: "0.7in",
          right: "0.7in",
          bottom: "0.7in",
          left: "0.7in"
        }
      },
      dimensions: {
        maxWidth: "8.5in",
        minHeight: "11in"
      },
      typography: {
        titleSize: "48px",
        subtitleSize: "22px",
        bodySize: "16px",
        lineHeight: "1.5"
      },
      icons: {
        sections: false,
        contact: true,
        bullets: "dot"
      }
    }
  },
  
  {
    id: "minimal-elegant",
    name: "Minimal Elegant",
    description: "Clean and sophisticated design with perfect typography",
    imageUrl: "/lovable-uploads/5e2cc0ed-eefe-4bbe-84bc-d4b2863a6b95.png",
    style: {
      titleFont: "font-sans text-[36px] font-bold tracking-tight text-gray-900",
      headerStyle: "mb-6 pb-3 border-b border-gray-300",
      sectionStyle: "text-[17px] uppercase tracking-wider text-gray-800 mb-3 font-bold border-b border-gray-200 pb-1",
      contentStyle: "space-y-5",
      layout: "minimal",
      colors: {
        primary: "#2D2D2D",
        secondary: "#4A4A4A",
        text: "#333333",
        border: "#E5E7EB",
        background: "#FFFFFF"
      },
      spacing: {
        sectionGap: "1.75rem",
        itemGap: "1.25rem",
        contentPadding: "2rem",
        headerHeight: "auto",
        margins: {
          top: "0.6in",
          right: "0.6in",
          bottom: "0.6in",
          left: "0.6in"
        }
      },
      dimensions: {
        maxWidth: "816px",
        minHeight: "1056px"
      },
      typography: {
        titleSize: "36px",
        subtitleSize: "18px",
        bodySize: "16px",
        lineHeight: "1.4"
      },
      icons: {
        sections: false,
        contact: true,
        bullets: "dot"
      }
    }
  },
  
  {
    id: "professional-executive",
    name: "Professional Executive",
    description: "Modern two-column layout with clean typography",
    imageUrl: "/lovable-uploads/bcfce93e-6b2d-45f7-ba7e-8db1099ba81e.png",
    style: {
      titleFont: "font-sans text-[46px] font-black tracking-wide text-black uppercase mb-1",
      headerStyle: "mb-8",
      sectionStyle: "text-[18px] font-bold text-black uppercase tracking-wider mb-3",
      contentStyle: "grid grid-cols-12 gap-7",
      layout: "executive",
      colors: {
        primary: "#000000",
        secondary: "#666666",
        text: "#333333",
        border: "#EEEEEE",
        background: "#FFFFFF"
      },
      spacing: {
        sectionGap: "1.75rem",
        itemGap: "1rem",
        contentPadding: "2rem",
        headerHeight: "auto",
        margins: {
          top: "0.6in",
          right: "0.6in",
          bottom: "0.6in",
          left: "0.6in"
        }
      },
      dimensions: {
        maxWidth: "816px",
        minHeight: "1056px"
      },
      typography: {
        titleSize: "46px",
        subtitleSize: "18px",
        bodySize: "16px",
        lineHeight: "1.5"
      },
      icons: {
        sections: false,
        contact: true,
        bullets: "dot"
      }
    }
  }
];
