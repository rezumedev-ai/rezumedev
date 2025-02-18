
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
    colors: {
      primary: string;
      secondary: string;
      text: string;
      border: string;
      background: string;
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
    id: "professional-classic",
    name: "Professional Classic",
    description: "Traditional format with clean typography and clear section breaks",
    imageUrl: "/lovable-uploads/e822cc85-690d-415c-acfe-43fd9a3ef8f2.png",
    style: {
      titleFont: "font-serif text-[32px] font-bold tracking-normal",
      headerStyle: "text-center space-y-2 mb-10 border-b-2 border 2 border-primary pb-6",
      sectionStyle: "text-lg font-semibold border-b border-gray-300 pb-2 mb-4 text-primary uppercase tracking-wider flex items-center gap-2",
      contentStyle: "space-y-6 px-1",
      layout: "single-column",
      colors: {
        primary: "#2D3748",
        secondary: "#4A5568",
        text: "#1A202C",
        border: "#E2E8F0",
        background: "#FFFFFF"
      },
      icons: {
        sections: true,
        contact: true,
        bullets: "dot"
      }
    }
  },
  {
    id: "modern-split",
    name: "Modern Split",
    description: "Contemporary two-column layout with minimalist design",
    imageUrl: "/lovable-uploads/a666fa80-5ad6-4527-8e61-74dbfe585607.png",
    style: {
      titleFont: "font-sans text-5xl font-bold tracking-tight",
      headerStyle: "grid grid-cols-[1fr_2fr] items-start gap-12 mb-10",
      sectionStyle: "text-base font-medium uppercase tracking-[0.2em] mb-6 text-secondary",
      contentStyle: "grid grid-cols-[1fr_2fr] gap-12",
      layout: "two-column",
      colors: {
        primary: "#1A1A1A",
        secondary: "#4A5568",
        text: "#2D3748",
        border: "#E2E8F0",
        background: "#FFFFFF"
      },
      icons: {
        sections: false,
        contact: false,
        bullets: "dash"
      }
    }
  },
  {
    id: "executive-grid",
    name: "Executive Grid",
    description: "Clean grid layout with modern typography",
    imageUrl: "/lovable-uploads/362d274e-3bfc-4f4d-a8aa-993e15d83306.png",
    style: {
      titleFont: "font-sans text-6xl font-light tracking-[-0.02em] text-primary",
      headerStyle: "grid grid-cols-2 gap-16 mb-12 pb-8 border-b border-gray-200",
      sectionStyle: "text-xl uppercase tracking-wider font-medium mb-6 text-secondary flex items-center gap-3",
      contentStyle: "grid grid-cols-2 gap-x-16 gap-y-8",
      layout: "grid",
      colors: {
        primary: "#1E293B",
        secondary: "#475569",
        text: "#334155",
        border: "#E2E8F0",
        background: "#FFFFFF"
      },
      icons: {
        sections: true,
        contact: true,
        bullets: "arrow"
      }
    }
  },
  {
    id: "minimal-elegant",
    name: "Minimal Elegant",
    description: "Sophisticated design with generous whitespace",
    imageUrl: "/lovable-uploads/8d5fd925-5d93-47a6-8b55-7eea43de3e43.png",
    style: {
      titleFont: "font-sans text-[56px] font-extralight tracking-tight uppercase",
      headerStyle: "mb-16 space-y-4",
      sectionStyle: "text-sm uppercase tracking-[0.25em] font-medium mb-8 text-secondary border-l-2 border-secondary pl-4",
      contentStyle: "space-y-12 max-w-3xl",
      layout: "minimal",
      colors: {
        primary: "#1A1A1A",
        secondary: "#6B7280",
        text: "#374151",
        border: "#E5E7EB",
        background: "#FFFFFF"
      },
      icons: {
        sections: false,
        contact: false,
        bullets: "none"
      }
    }
  }
];
