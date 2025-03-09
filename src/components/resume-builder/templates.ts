
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
  
  // NEW TEMPLATE 1: Corporate Standard
  {
    id: "corporate-standard",
    name: "Corporate Standard",
    description: "ATS-optimized format favored by HR departments at Fortune 100 companies",
    imageUrl: "/lovable-uploads/1de1d500-e16a-46d6-9037-19cf6739f790.png",
    style: {
      titleFont: "font-sans text-[36px] font-semibold tracking-tight text-slate-800",
      headerStyle: "mb-8 pb-4 border-b border-slate-300",
      sectionStyle: "text-[16px] font-semibold text-slate-700 uppercase tracking-wide mb-3 pb-2 border-b border-slate-200",
      contentStyle: "space-y-5",
      layout: "classic",
      colors: {
        primary: "#334155", // slate-700
        secondary: "#64748b", // slate-500
        text: "#334155", // slate-700
        border: "#e2e8f0", // slate-200
        background: "#FFFFFF"
      },
      spacing: {
        sectionGap: "2rem",
        itemGap: "1.5rem",
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
        lineHeight: "1.5"
      },
      icons: {
        sections: false,
        contact: true,
        bullets: "dot"
      }
    }
  },
  
  // NEW TEMPLATE 2: Modern Tech
  {
    id: "modern-tech",
    name: "Modern Tech",
    description: "Contemporary design optimized for tech careers and digital roles",
    imageUrl: "/lovable-uploads/946c34ac-a462-4649-b919-24aa01a04f02.png",
    style: {
      titleFont: "font-sans text-[38px] font-bold tracking-tight text-indigo-900",
      headerStyle: "mb-8 pb-3",
      sectionStyle: "text-[14px] font-bold text-indigo-800 uppercase tracking-wider mb-3 flex items-center gap-2 after:content-[''] after:flex-grow after:h-[1px] after:bg-indigo-200",
      contentStyle: "space-y-4",
      layout: "modern",
      colors: {
        primary: "#312e81", // indigo-900
        secondary: "#4f46e5", // indigo-600
        text: "#1e1b4b", // indigo-950
        border: "#c7d2fe", // indigo-200
        background: "#FFFFFF"
      },
      spacing: {
        sectionGap: "1.75rem",
        itemGap: "1.25rem",
        contentPadding: "2.5rem",
        headerHeight: "auto",
        margins: {
          top: "0.75in",
          right: "0.75in",
          bottom: "0.75in",
          left: "0.75in"
        }
      },
      dimensions: {
        maxWidth: "8.5in",
        minHeight: "11in"
      },
      typography: {
        titleSize: "38px",
        subtitleSize: "16px",
        bodySize: "13px",
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
