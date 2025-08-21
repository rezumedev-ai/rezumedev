import { Helmet } from 'react-helmet';
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Tips for Crafting a Winning Resume",
      seoTitle: "Resume Writing Tips 2025 | 10 Expert Strategies That Get You Hired | Rezume.dev",
      metaDescription: "Master professional resume writing with 10 expert tips that get you noticed by hiring managers. Boost your job search success rate today!",
      excerpt: "Learn how to make your resume stand out from the crowd with these expert tips on formatting, content, and presentation.",
      category: "Resume Tips",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      readTime: "5 min read",
      slug: "essential-resume-tips",
      keywords: "resume writing, resume tips, professional resume, resume formatting, ATS resume",
      author: "Sarah Mitchell",
      date: "February 3, 2025"
    },
    {
      id: 2,
      title: "Mastering the Art of Job Search in 2025",
      seoTitle: "Job Search Strategy Guide | Master 2025's Market & Land Your Dream Job | Rezume.dev",
      metaDescription: "Navigate 2025's competitive job market with proven strategies. LinkedIn optimization, networking tips, and interview preparation included.",
      excerpt: "Discover effective strategies for navigating the modern job market, from leveraging LinkedIn to networking like a pro.",
      category: "Job Search",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      readTime: "7 min read",
      slug: "job-search-strategies",
      keywords: "job search, job application, LinkedIn optimization, networking, career development",
      author: "David Chen",
      date: "February 19, 2025"
    },
    {
      id: 3,
      title: "What Hiring Managers Really Look For",
      seoTitle: "What Recruiters Want | Inside Hiring Manager Secrets Revealed | Rezume.dev",
      metaDescription: "Get inside tips from experienced recruiters on what makes candidates stand out. Learn hiring manager secrets that boost interview success.",
      excerpt: "Inside tips from experienced recruiters on what makes a candidate stand out during the hiring process.",
      category: "Hiring Tips",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      readTime: "6 min read",
      slug: "hiring-manager-insights",
      keywords: "hiring process, interview tips, recruiter advice, stand out to employers",
      author: "Emily Rodriguez",
      date: "March 2, 2025"
    },
    {
      id: 4,
      title: "How to Write a Resume for Remote Jobs",
      seoTitle: "Remote Job Resume Guide | Stand Out in Virtual Job Applications | Rezume.dev",
      metaDescription: "Learn specific strategies for remote job resumes. Highlight key skills and experiences that remote employers want to see in 2025.",
      excerpt: "Specific strategies and resume elements to highlight when applying for remote positions in today's digital workplace.",
      category: "Remote Work",
      image: "https://images.unsplash.com/photo-1552960562-daf630e9278b",
      readTime: "8 min read",
      slug: "remote-job-resume",
      keywords: "remote work resume, virtual jobs, work from home, remote job application, remote career",
      author: "Michael Thompson",
      date: "March 16, 2025"
    },
    {
      id: 5,
      title: "Cover Letter vs Resume: Do You Still Need Both?",
      seoTitle: "Cover Letter vs Resume 2025 | When You Need Both & When to Skip | Rezume.dev",
      metaDescription: "Discover when cover letters are essential vs optional. Learn how to make both documents work together for maximum application impact.",
      excerpt: "Uncover when a cover letter is essential, when it's optional, and how to make both documents work together effectively.",
      category: "Application Tips",
      image: "https://images.unsplash.com/photo-1586473219010-2ffc57b0d282",
      readTime: "6 min read",
      slug: "cover-letter-resume-comparison",
      keywords: "cover letter, resume comparison, job application documents, cover letter tips",
      author: "Jennifer Walsh",
      date: "March 30, 2025"
    },
    {
      id: 6,
      title: "From Zero to Hired: How I Landed My Dream Job with Rezume.dev",
      seoTitle: "Success Story | From Unemployed to Dream Job Using Rezume.dev Resume Builder",
      metaDescription: "Real customer success story: How one job seeker transformed their career using Rezume.dev's AI resume builder and landed their dream job.",
      excerpt: "A customer success story detailing how using Rezume.dev transformed one job seeker's application process and career trajectory.",
      category: "Success Story",
      image: "https://images.unsplash.com/photo-1579389083078-4e7018379f7e",
      readTime: "9 min read",
      slug: "rezume-success-story",
      keywords: "success story, job hunting success, resume transformation, career change",
      author: "Alex Johnson",
      date: "April 13, 2025"
    },
    {
      id: 7,
      title: "Best AI resume builders of 2025: How to create an ATS-friendly resume for free",
      seoTitle: "Best AI Resume Builder 2025 | Free ATS-Friendly Tools Compared | Rezume.dev",
      metaDescription: "Compare top free AI resume builders in 2025. Create ATS-friendly resumes that beat applicant tracking systems and land more interviews.",
      excerpt: "Discover the top AI-powered resume builders that help you create professional, ATS-optimized resumes in minutes. Compare features, pricing, and effectiveness of leading platforms.",
      category: "AI Tools",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
      readTime: "12 min read",
      slug: "best-ai-resume-builders-2025",
      keywords: "AI resume builder, ATS friendly resume, free resume builder 2025, artificial intelligence resume, automated resume optimization, machine learning resume",
      author: "Rachel Kim",
      date: "April 27, 2025"
    },
    {
      id: 8,
      title: "10 Powerful Niche Resume Keywords for 2025 - And How to Use Them to Get More Interviews",
      seoTitle: "Niche Resume Keywords 2025 | 10 Long-Tail Keywords That Get Interviews | Rezume.dev",
      metaDescription: "Discover 10 powerful niche resume keywords for 2025. Master industry-specific, long-tail keywords for ATS optimization and remote job success.",
      excerpt: "Master the art of using niche, industry-specific resume keywords to bypass ATS filters and capture hiring managers' attention in 2025's competitive job market.",
      category: "ATS Optimization",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4",
      readTime: "12 min read",
      slug: "niche-resume-keywords-2025",
      keywords: "niche resume keywords 2025, long-tail keywords for resume, ATS resume keywords, remote resume keywords, industry specific resume keywords",
      author: "Marcus Foster",
      date: "May 11, 2025"
    },
    {
      id: 9,
      title: "How to Use AI Resume Builders for Career Transitions: Your Complete Guide",
      seoTitle: "AI Resume Builder Career Change Guide | Complete 2025 Transition Strategy | Rezume.dev",
      metaDescription: "Discover how to effectively use AI resume builders for career transitions, including benefits, step-by-step guidance, and real-life examples.",
      excerpt: "Master career transitions with AI resume builders. Learn proven strategies, avoid common mistakes, and leverage technology for career change success.",
      category: "AI Tools",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
      readTime: "12 min read",
      slug: "ai-resume-builders-career-transitions",
      keywords: "AI resume builder, career transition, career change, resume optimization, ATS optimization, transferable skills",
      author: "Michael Thompson",
      date: "March 15, 2025"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Career Insights & Resume Tips | Rezume.dev Blog</title>
        <meta name="description" content="Expert advice on resume writing, job search strategies, remote work applications, and career advancement. Learn how to craft the perfect resume and land your dream job with our comprehensive guides." />
        <meta name="keywords" content="resume tips, career advice, job search tips, professional resume writing, career blog, job application guides, remote work resume, cover letter tips, success stories, ATS optimization, career development, interview preparation" />
        <meta name="author" content="Rezume.dev" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href="https://rezume.dev/blog" />
        <link rel="icon" type="image/x-icon" href="/custom-favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/custom-favicon.svg" />
        <link rel="shortcut icon" href="/custom-favicon.ico" />
        <link rel="apple-touch-icon" href="/custom-favicon.ico" />
        <meta name="theme-color" content="#9B87F5" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rezume.dev/blog" />
        <meta property="og:title" content="Career Insights & Resume Tips | Rezume.dev Blog" />
        <meta property="og:description" content="Expert advice on resume writing, job search strategies, and career advancement. Learn how to craft the perfect resume and land your dream job." />
        <meta property="og:image" content="https://rezume.dev/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Rezume.dev" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@rezumedev" />
        <meta name="twitter:title" content="Career Insights & Resume Tips | Rezume.dev Blog" />
        <meta name="twitter:description" content="Expert advice on resume writing, job search strategies, and career advancement from Rezume.dev." />
        <meta name="twitter:image" content="https://rezume.dev/og-image.png" />
        
        {/* Blog structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "headline": "Career Insights & Resume Tips | Rezume.dev Blog",
            "description": "Expert advice on resume writing, job search strategies, and career advancement.",
            "image": "https://rezume.dev/og-image.png",
            "datePublished": "2024-03-01",
            "dateModified": "2025-04-12",
            "publisher": {
              "@type": "Organization",
              "name": "Rezume.dev",
              "logo": {
                "@type": "ImageObject",
                "url": "https://rezume.dev/custom-favicon.svg"
              }
            },
            "author": {
              "@type": "Organization",
              "name": "Rezume.dev Team",
              "url": "https://rezume.dev/about"
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://rezume.dev/blog"
            },
            "blogPost": blogPosts.map(post => ({
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.excerpt,
              "keywords": post.keywords,
              "url": `https://rezume.dev/blog/${post.id}`,
              "image": post.image,
              "datePublished": "2024-03-20T08:00:00+08:00",
              "dateModified": "2025-04-12T10:00:00+08:00",
               "author": {
                "@type": "Person",
                "name": post.author
              },
              "publisher": {
                "@type": "Organization",
                "name": "Rezume.dev",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://rezume.dev/custom-favicon.svg"
                }
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://rezume.dev/blog/${post.id}`
              }
            }))
          })}
        </script>
      </Helmet>
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
                        <Link to={`/blog/${post.id}`} aria-label={`Read more about ${post.title}`} className="flex items-center gap-2">
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
    </>
  );
};

export default Blog;
