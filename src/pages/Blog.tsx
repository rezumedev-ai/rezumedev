
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
          <div className="text-center mb-12 md:mb-16">
            <div className="relative">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-up">
                <span className="text-secondary">Latest </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                  Career Insights & Tips
                </span>
                <div className="absolute -z-10 w-full h-full blur-3xl opacity-20 bg-gradient-to-r from-primary via-accent to-primary/60 animate-pulse"></div>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '200ms' }}>
                Expert advice to help you succeed in your job search journey
              </p>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto perspective-1000">
            {blogPosts.map((post, index) => (
              <article 
                key={post.id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-2 hover:rotate-1 overflow-hidden animate-fade-up"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  transform: `translateZ(${index * 10}px)` 
                }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 animate-fade-up" style={{ animationDelay: `${(index * 150) + 300}ms` }}>
                    <span className="bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 md:p-8 transform transition-transform duration-300 group-hover:translate-y-[-5px]">
                  <h2 className="text-xl font-semibold text-secondary mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground mb-4 line-clamp-3 text-sm md:text-base transition-opacity duration-300 group-hover:opacity-90">
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
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
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
