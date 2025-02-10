
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Tips for Crafting a Winning Resume",
      excerpt: "Learn how to make your resume stand out from the crowd with these expert tips on formatting, content, and presentation.",
      category: "Resume Tips",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "Mastering the Art of Job Search in 2024",
      excerpt: "Discover effective strategies for navigating the modern job market, from leveraging LinkedIn to networking like a pro.",
      category: "Job Search",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      readTime: "7 min read",
    },
    {
      id: 3,
      title: "What Hiring Managers Really Look For",
      excerpt: "Inside tips from experienced recruiters on what makes a candidate stand out during the hiring process.",
      category: "Hiring Tips",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      readTime: "6 min read",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-12 md:mb-16 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-4 md:mb-6">Career Insights & Tips</h1>
            <p className="text-lg md:text-xl text-muted-foreground">Expert advice to help you succeed in your job search</p>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            {blogPosts.map((post, index) => (
              <article 
                key={post.id}
                className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary/90 text-white px-3 py-1 rounded-full text-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-4 md:p-6">
                  <h2 className="text-xl font-semibold text-secondary mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground mb-4 line-clamp-3 text-sm md:text-base">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {post.readTime}
                    </span>
                    <Button variant="ghost" className="group" asChild>
                      <Link to={`/blog/${post.id}`} className="flex items-center gap-2">
                        Read More 
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;

