
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
    imageUrl: "/lovable-uploads/489267dd-1129-466d-b30b-dd43b3cbe0e8.png",
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
    id: "modern-split",
    name: "Modern Split",
    description: "Contemporary two-column design for creative professionals",
    imageUrl: "/lovable-uploads/50a6d61f-0b70-4d4b-8fd8-e293d40c5ae1.png",
    style: {
      titleFont: "font-sans text-[32px] font-light tracking-wide text-gray-800",
      headerStyle: "mb-6 pb-3",
      sectionStyle: "text-[14px] font-semibold text-indigo-600 uppercase tracking-widest mb-3",
      contentStyle: "grid grid-cols-3 gap-6",
      layout: "modern",
      colors: {
        primary: "#4F46E5",
        secondary: "#6B7280",
        text: "#374151",
        border: "#E5E7EB",
        background: "#FFFFFF"
      },
      spacing: {
        sectionGap: "1.5rem",
        itemGap: "1rem",
        contentPadding: "2rem",
        headerHeight: "150px",
        margins: {
          top: "40px",
          right: "40px",
          bottom: "40px",
          left: "40px"
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
        sections: true,
        contact: true,
        bullets: "none"
      }
    }
  },
  {
    id: "minimal-elegant",
    name: "Minimal Elegant",
    description: "Clean and sophisticated design with perfect typography",
    imageUrl: "/lovable-uploads/a6ed21c1-e465-46fb-a6ff-9f66cc7b87b3.png",
    style: {
      titleFont: "font-sans text-[26px] font-light tracking-wide text-gray-800",
      headerStyle: "mb-10 pb-0 flex flex-col items-center relative",
      sectionStyle: "text-xs uppercase tracking-[0.2em] text-gray-400 mb-4 font-medium relative",
      contentStyle: "space-y-8 max-w-2xl mx-auto",
      layout: "minimal",
      colors: {
        primary: "#9CA3AF",
        secondary: "#D1D5DB",
        text: "#374151",
        border: "#F3F4F6",
        background: "#FFFFFF"
      },
      spacing: {
        sectionGap: "2.5rem",
        itemGap: "1.25rem",
        contentPadding: "2rem",
        headerHeight: "auto",
        margins: {
          top: "80px",
          right: "80px",
          bottom: "80px",
          left: "80px"
        }
      },
      dimensions: {
        maxWidth: "816px",
        minHeight: "1056px"
      },
      typography: {
        titleSize: "26px",
        subtitleSize: "14px",
        bodySize: "13px",
        lineHeight: "1.6"
      },
      icons: {
        sections: false,
        contact: false,
        bullets: "none"
      }
    }
  },
  {
    id: "professional-executive",
    name: "Professional Executive",
    description: "Modern two-column layout with clean typography",
    imageUrl: "/lovable-uploads/eca7a378-81fd-4d29-9194-b292d08d283c.png",
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
  }
];
