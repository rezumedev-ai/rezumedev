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
      titleFont: "font-serif text-[40px] font-bold tracking-tight text-gray-900",
      headerStyle: "mb-10 pb-6 border-b-2 border-gray-800",
      sectionStyle: "text-[20px] font-bold text-gray-900 uppercase tracking-wide mb-4 pb-2 border-b border-gray-300",
      contentStyle: "space-y-6",
      layout: "classic",
      colors: {
        primary: "#1A1A1A",
        secondary: "#4A4A4A",
        text: "#2D2D2D",
        border: "#E5E7EB",
        background: "#FFFFFF"
      },
      spacing: {
        sectionGap: "2.5rem",
        itemGap: "2rem",
        contentPadding: "3rem",
        headerHeight: "200px",
        margins: {
          top: "1in",
          right: "1in",
          bottom: "1in",
          left: "1in"
        }
      },
      dimensions: {
        maxWidth: "8.5in",
        minHeight: "11in"
      },
      typography: {
        titleSize: "40px",
        subtitleSize: "20px",
        bodySize: "14px",
        lineHeight: "1.6"
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
      titleFont: "font-sans text-[32px] font-bold tracking-tight text-gray-900",
      headerStyle: "mb-6 pb-4 border-b border-gray-300",
      sectionStyle: "text-[15px] uppercase tracking-wider text-gray-800 mb-3 font-bold border-b border-gray-200 pb-1",
      contentStyle: "space-y-6",
      layout: "minimal",
      colors: {
        primary: "#2D2D2D",
        secondary: "#4A4A4A",
        text: "#333333",
        border: "#E5E7EB",
        background: "#FFFFFF"
      },
      spacing: {
        sectionGap: "2rem",
        itemGap: "1.5rem",
        contentPadding: "2.5rem",
        headerHeight: "auto",
        margins: {
          top: "60px",
          right: "60px",
          bottom: "60px",
          left: "60px"
        }
      },
      dimensions: {
        maxWidth: "816px",
        minHeight: "1056px"
      },
      typography: {
        titleSize: "32px",
        subtitleSize: "16px",
        bodySize: "14px",
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
    id: "professional-executive",
    name: "Professional Executive",
    description: "Modern two-column layout with clean typography",
    imageUrl: "/lovable-uploads/bcfce93e-6b2d-45f7-ba7e-8db1099ba81e.png",
    style: {
      titleFont: "font-sans text-[42px] font-black tracking-wide text-black uppercase mb-1",
      headerStyle: "mb-12",
      sectionStyle: "text-[16px] font-bold text-black uppercase tracking-wider mb-4",
      contentStyle: "grid grid-cols-12 gap-8",
      layout: "executive",
      colors: {
        primary: "#000000",
        secondary: "#666666",
        text: "#333333",
        border: "#EEEEEE",
        background: "#FFFFFF"
      },
      spacing: {
        sectionGap: "2rem",
        itemGap: "1rem",
        contentPadding: "2.5rem",
        headerHeight: "auto",
        margins: {
          top: "60px",
          right: "60px",
          bottom: "60px",
          left: "60px"
        }
      },
      dimensions: {
        maxWidth: "816px",
        minHeight: "1056px"
      },
      typography: {
        titleSize: "42px",
        subtitleSize: "16px",
        bodySize: "14px",
        lineHeight: "1.6"
      },
      icons: {
        sections: false,
        contact: true,
        bullets: "dot"
      }
    }
  },
  
  {
    id: "modern-executive",
    name: "Modern Executive",
    description: "Sophisticated design with left sidebar for senior professionals and executives",
    imageUrl: "/lovable-uploads/1de1d500-e16a-46d6-9037-19cf6739f790.png",
    style: {
      titleFont: "font-sans text-[34px] font-bold tracking-tight text-white",
      headerStyle: "bg-blue-950 text-white p-8 flex flex-col justify-end",
      sectionStyle: "text-[16px] font-semibold text-blue-950 flex items-center gap-2 before:content-[''] before:w-6 before:h-[2px] before:bg-blue-950 uppercase tracking-wider mb-4",
      contentStyle: "grid grid-cols-3 gap-6",
      layout: "modern",
      colors: {
        primary: "#172554",
        secondary: "#3b82f6",
        text: "#1e293b",
        border: "#cbd5e1",
        background: "#FFFFFF"
      },
      spacing: {
        sectionGap: "2rem",
        itemGap: "1.25rem",
        contentPadding: "0",
        headerHeight: "160px",
        margins: {
          top: "0",
          right: "0",
          bottom: "0",
          left: "0"
        }
      },
      dimensions: {
        maxWidth: "8.5in",
        minHeight: "11in"
      },
      typography: {
        titleSize: "34px",
        subtitleSize: "16px",
        bodySize: "13px",
        lineHeight: "1.5"
      },
      icons: {
        sections: true,
        contact: true,
        bullets: "none"
      }
    }
  },
  
  {
    id: "tech-innovator",
    name: "Tech Innovator",
    description: "Modern tech-focused layout with visual skill indicators and sleek typography",
    imageUrl: "/lovable-uploads/946c34ac-a462-4649-b919-24aa01a04f02.png",
    style: {
      titleFont: "font-sans text-[36px] font-extrabold text-emerald-900 tracking-tight",
      headerStyle: "border-l-8 border-emerald-500 pl-6 mb-8",
      sectionStyle: "flex items-center text-[15px] font-bold text-emerald-800 uppercase tracking-wider mb-4 after:content-[''] after:flex-grow after:h-[2px] after:bg-gradient-to-r after:from-emerald-500 after:to-transparent after:ml-3",
      contentStyle: "space-y-5",
      layout: "minimal",
      colors: {
        primary: "#064e3b",
        secondary: "#10b981",
        text: "#064e3b",
        border: "#d1fae5",
        background: "#FFFFFF"
      },
      spacing: {
        sectionGap: "2rem",
        itemGap: "1.25rem",
        contentPadding: "2.5rem",
        headerHeight: "auto",
        margins: {
          top: "0.8in",
          right: "0.8in",
          bottom: "0.8in",
          left: "0.8in"
        }
      },
      dimensions: {
        maxWidth: "8.5in",
        minHeight: "11in"
      },
      typography: {
        titleSize: "36px",
        subtitleSize: "18px",
        bodySize: "14px",
        lineHeight: "1.6"
      },
      icons: {
        sections: true,
        contact: true,
        bullets: "arrow"
      }
    }
  }
];
