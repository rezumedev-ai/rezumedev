
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface BlogHeaderProps {
  title: string;
  author: string;
  date: string;
  readTime: string;
}

export const BlogHeader = ({ title, author, date, readTime }: BlogHeaderProps) => {
  return (
    <div className="mb-6 md:mb-8">
      <Button variant="ghost" asChild className="mb-4 md:mb-8 -ml-2">
        <Link to="/blog" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
      </Button>
      <h1 className="text-2xl md:text-4xl font-bold text-secondary mb-4 md:mb-6 animate-fade-in">
        {title}
      </h1>
      <div className="flex flex-wrap gap-4 md:gap-6 text-sm md:text-base text-muted-foreground">
        <span>{author}</span>
        <span>{date}</span>
        <span>{readTime}</span>
      </div>
    </div>
  );
};
