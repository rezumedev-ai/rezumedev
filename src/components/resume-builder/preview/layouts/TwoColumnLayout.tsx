
import { ReactNode } from "react";

interface TwoColumnLayoutProps {
  leftContent: ReactNode;
  rightContent: ReactNode;
  leftColumnWidth?: number; // Out of 12 grid columns
  className?: string;
}

export function TwoColumnLayout({
  leftContent,
  rightContent,
  leftColumnWidth = 8,
  className = ""
}: TwoColumnLayoutProps) {
  const rightColumnWidth = 12 - leftColumnWidth;
  
  return (
    <div className={`grid grid-cols-12 gap-6 ${className}`}>
      <div className={`col-span-${leftColumnWidth}`}>
        {leftContent}
      </div>
      <div className={`col-span-${rightColumnWidth}`}>
        {rightContent}
      </div>
    </div>
  );
}
