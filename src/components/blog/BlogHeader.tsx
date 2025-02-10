
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
    <div className="mb-8">
      <Button variant="ghost" asChild className="mb-8">
        <Link to="/blog" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
      </Button>
      <h1 className="text-4xl font-bold text-secondary mb-6 animate-fade-in">
        {title}
      </h1>
      <div className="flex items-center gap-6 text-muted-foreground">
        <span>{author}</span>
        <span>{date}</span>
        <span>{readTime}</span>
      </div>
    </div>
  );
};
