
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
    id: "professional-executive",
    name: "Professional Executive",
    description: "Clean, sophisticated layout preferred by Fortune 500 companies",
    imageUrl: "/lovable-uploads/e822cc85-690d-415c-acfe-43fd9a3ef8f2.png",
    style: {
      titleFont: "font-sans text-2xl font-bold tracking-tight text-gray-900",
      headerStyle: "mb-6 pb-4 border-b-2 border-gray-900",
      sectionStyle: "text-[15px] font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2",
      contentStyle: "space-y-4 text-[13px] leading-snug",
      layout: "compact",
      colors: {
        primary: "#1A1A1A",
        secondary: "#4B5563",
        text: "#111827",
        border: "#E5E7EB",
        background: "#FFFFFF"
      },
      icons: {
        sections: true,
        contact: true,
        bullets: "arrow"
      }
    }
  }
];
