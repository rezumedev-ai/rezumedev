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
    layout: "classic" | "modern" | "minimal" | "executive" | "creative";
    colors: {
      primary: string;
      secondary: string;
      text: string;
      border: string;
      background: string;
      accent?: string;
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
      circularImage?: boolean;
    };
  };
}

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: "executive-clean",
    name: "Executive Clean",
    description: "Traditional single-column layout preferred by Fortune 500 companies",
    imageUrl: "/uploads/cd8ab216-33bc-47d9-95d1-0a835652b8c6.png",
    style: {
      titleFont: "font-serif text-[48px] font-bold tracking-tight text-gray-900",
      headerStyle: "mb-6 pb-3 border-b-2 border-gray-800",
      sectionStyle: "text-[20px] font-bold text-gray-900 uppercase tracking-wide mb-3 pb-1 border-b border-gray-300",
      contentStyle: "space-y-4",
      layout: "classic",
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
        bullets: "dot"
      }
    }
  },

  {
    id: "minimal-elegant",
    name: "Minimal Elegant",
    description: "Clean and sophisticated design with perfect typography",
    imageUrl: "/uploads/5e2cc0ed-eefe-4bbe-84bc-d4b2863a6b95.png",
    style: {
      titleFont: "font-sans text-[36px] font-bold tracking-tight text-gray-900",
      headerStyle: "mb-5 pb-2 border-b border-gray-300",
      sectionStyle: "text-[16px] uppercase tracking-wider text-gray-800 mb-2 font-bold border-b border-gray-200 pb-1",
      contentStyle: "space-y-4",
      layout: "minimal",
      colors: {
        primary: "#2D2D2D",
        secondary: "#4A4A4A",
        text: "#333333",
        border: "#E5E7EB",
        background: "#FFFFFF"
      },
      spacing: {
        sectionGap: "1.5rem",
        itemGap: "1rem",
        contentPadding: "1.75rem",
        headerHeight: "auto",
        margins: {
          top: "0.5in",
          right: "0.5in",
          bottom: "0.5in",
          left: "0.5in"
        }
      },
      dimensions: {
        maxWidth: "816px",
        minHeight: "1056px"
      },
      typography: {
        titleSize: "34px",
        subtitleSize: "17px",
        bodySize: "15px",
        lineHeight: "1.35"
      },
      icons: {
        sections: false,
        contact: true,
        bullets: "dot"
      }
    }
  },

  {
    id: "modern-professional",
    name: "Modern Professional",
    description: "Contemporary two-column design with circular profile image and accent colors",
    imageUrl: "/uploads/a41674ee-049d-4ade-88a0-17f53696a879.png",
    style: {
      titleFont: "font-sans text-[32px] font-bold tracking-tight text-gray-900",
      headerStyle: "grid grid-cols-12 gap-6",
      sectionStyle: "text-[16px] font-bold uppercase tracking-wider text-emerald-700 mb-3 flex items-center",
      contentStyle: "grid grid-cols-12 gap-6",
      layout: "creative",
      colors: {
        primary: "#374151",
        secondary: "#6B7280",
        text: "#111827",
        border: "#E5E7EB",
        background: "#FFFFFF",
        accent: "#10B981"
      },
      spacing: {
        sectionGap: "1.25rem",
        itemGap: "1rem",
        contentPadding: "1.75rem",
        headerHeight: "auto",
        margins: {
          top: "0.5in",
          right: "0.5in",
          bottom: "0.5in",
          left: "0.5in"
        }
      },
      dimensions: {
        maxWidth: "816px",
        minHeight: "1056px"
      },
      typography: {
        titleSize: "32px",
        subtitleSize: "17px",
        bodySize: "15px",
        lineHeight: "1.4"
      },
      icons: {
        sections: false,
        contact: false,
        bullets: "arrow",
        circularImage: true
      }
    }
  },

  {
    id: "professional-navy",
    name: "Professional Navy",
    description: "Elegant two-column layout with navy header and modern typography",
    imageUrl: "/uploads/d77e5ddd-e95d-4a02-8335-2bbd49bcd257.png",
    style: {
      titleFont: "font-sans text-[30px] font-bold tracking-tight text-white",
      headerStyle: "bg-[#0F2B5B] text-white pt-6 pb-6 px-8 mb-6 grid grid-cols-12 gap-6",
      sectionStyle: "text-[16px] font-bold uppercase tracking-wide text-[#0F2B5B] mb-3 pb-1 border-b-2 border-[#0F2B5B] flex items-center",
      contentStyle: "grid grid-cols-12 gap-6",
      layout: "creative",
      colors: {
        primary: "#0F2B5B",
        secondary: "#4A6FA5",
        text: "#333333",
        border: "#E5E7EB",
        background: "#FFFFFF",
        accent: "#0F2B5B"
      },
      spacing: {
        sectionGap: "1.5rem",
        itemGap: "1rem",
        contentPadding: "1.75rem",
        headerHeight: "auto",
        margins: {
          top: "0in",
          right: "0.5in",
          bottom: "0.5in",
          left: "0.5in"
        }
      },
      dimensions: {
        maxWidth: "816px",
        minHeight: "1056px"
      },
      typography: {
        titleSize: "30px",
        subtitleSize: "16px",
        bodySize: "14px",
        lineHeight: "1.4"
      },
      icons: {
        sections: true,
        contact: true,
        bullets: "dot",
        circularImage: true
      }
    }
  },

  {
    id: "ivy-league",
    name: "The Ivy",
    description: "Prestigious academic layout with serif typography and dense content structure",
    imageUrl: "/uploads/ivy-preview-new.png",
    style: {
      titleFont: "font-serif text-[42px] font-bold tracking-tight text-gray-900 border-b-2 border-black pb-4",
      headerStyle: "text-center mb-8",
      sectionStyle: "text-[18px] font-bold uppercase tracking-widest text-black mb-4 border-b border-black pb-1",
      contentStyle: "space-y-3",
      layout: "classic",
      colors: {
        primary: "#000000",
        secondary: "#333333",
        text: "#1a1a1a",
        border: "#000000",
        background: "#FFFFFF"
      },
      spacing: {
        sectionGap: "1.25rem",
        itemGap: "0.75rem",
        contentPadding: "2.5rem",
        headerHeight: "auto",
        margins: {
          top: "0.5in",
          right: "0.75in",
          bottom: "0.5in",
          left: "0.75in"
        }
      },
      dimensions: {
        maxWidth: "8.5in",
        minHeight: "11in"
      },
      typography: {
        titleSize: "42px",
        subtitleSize: "16px",
        bodySize: "12px", // dense
        lineHeight: "1.3"
      },
      icons: {
        sections: false,
        contact: false, // Text only for ivy
        bullets: "dot",
        circularImage: false
      }
    }
  },

  {
    id: "creative-portfolio",
    name: "The Creative",
    description: "Bold, high-impact design with accent colors for creative professionals",
    imageUrl: "/uploads/creative-preview-new.png", // distinct placeholder
    style: {
      titleFont: "font-sans text-[48px] font-black tracking-tighter text-gray-900 leading-none",
      headerStyle: "mb-8 grid grid-cols-12 gap-8 items-end",
      sectionStyle: "text-[24px] font-black tracking-tight text-indigo-600 mb-6 flex items-center gap-2",
      contentStyle: "grid grid-cols-12 gap-8",
      layout: "creative",
      colors: {
        primary: "#4F46E5", // Indigo-600
        secondary: "#818CF8",
        text: "#1F2937",
        border: "#E0E7FF",
        background: "#FFFFFF",
        accent: "#4F46E5"
      },
      spacing: {
        sectionGap: "2rem",
        itemGap: "1.5rem",
        contentPadding: "2rem",
        headerHeight: "auto",
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
        titleSize: "48px",
        subtitleSize: "20px",
        bodySize: "15px",
        lineHeight: "1.6"
      },
      icons: {
        sections: true,
        contact: true,
        bullets: "arrow",
        circularImage: true
      }
    }
  }
];
