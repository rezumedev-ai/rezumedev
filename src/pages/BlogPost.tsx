
import { Helmet } from 'react-helmet';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useParams } from "react-router-dom";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { BlogContent } from "@/components/blog/BlogContent";

const blogPosts = {
  "1": {
    title: "10 Essential Tips for Crafting a Winning Resume",
    content: `
      <h2 class="text-2xl font-semibold text-secondary mb-6 mt-8">1. Start with a Strong Professional Summary</h2>
      <p class="mb-8 leading-relaxed text-gray-700">Your professional summary is the first thing recruiters see. Make it count by highlighting your most relevant skills and achievements in 3-4 impactful sentences. Focus on what makes you unique and valuable to potential employers.</p>

      <h2 class="text-2xl font-semibold text-secondary mb-6">2. Tailor Your Resume for Each Application</h2>
      <p class="mb-8 leading-relaxed text-gray-700">Generic resumes rarely make it past ATS systems. Customize your resume for each position by incorporating relevant keywords from the job description and highlighting experiences that directly relate to the role's requirements.</p>

      <h2 class="text-2xl font-semibold text-secondary mb-6">3. Use Action Verbs and Quantifiable Results</h2>
      <p class="mb-8 leading-relaxed text-gray-700">Instead of saying "responsible for sales," use phrases like "Generated $500K in sales" or "Increased team productivity by 35%." Numbers and specific achievements make your accomplishments more tangible.</p>

      <h2 class="text-2xl font-semibold text-secondary mb-6">4. Keep Design Clean and Professional</h2>
      <p class="mb-8 leading-relaxed text-gray-700">Choose a clean, professional font like Arial or Calibri. Use consistent formatting for headers and bullet points. Ensure adequate white space to make your resume easy to scan.</p>

      <div class="bg-accent p-6 rounded-lg my-12 animate-fade-in">
        <h3 class="text-xl font-semibold mb-4">Pro Tip:</h3>
        <p class="text-gray-700">When listing skills, prioritize those mentioned in the job description. This helps your resume pass through ATS systems more effectively.</p>
      </div>

      <h2 class="text-2xl font-semibold text-secondary mb-6">5. Prioritize Relevant Experience</h2>
      <p class="mb-8 leading-relaxed text-gray-700">List your most recent and relevant experiences first. For each role, include 3-5 bullet points highlighting key achievements and responsibilities that align with your target position.</p>

      <h2 class="text-2xl font-semibold text-secondary mb-6">6. Include a Skills Section</h2>
      <p class="mb-8 leading-relaxed text-gray-700">Create a dedicated skills section showcasing both technical and soft skills. Organize them by category and list the most relevant ones first.</p>

      <h2 class="text-2xl font-semibold text-secondary mb-6">7. Optimize for ATS</h2>
      <p class="mb-8 leading-relaxed text-gray-700">Use standard section headings and avoid complex formatting that might confuse ATS systems. Stick to common fonts and avoid tables or graphics that might not be properly parsed.</p>

      <h2 class="text-2xl font-semibold text-secondary mb-6">8. Keep It Concise</h2>
      <p class="mb-8 leading-relaxed text-gray-700">Limit your resume to 1-2 pages. Be concise in your descriptions and focus on impact rather than day-to-day responsibilities.</p>

      <h2 class="text-2xl font-semibold text-secondary mb-6">9. Proofread Thoroughly</h2>
      <p class="mb-8 leading-relaxed text-gray-700">Grammar and spelling errors can immediately disqualify you. Have someone else review your resume, or use tools like Grammarly to catch mistakes.</p>

      <h2 class="text-2xl font-semibold text-secondary mb-6">10. Update Your Contact Information</h2>
      <p class="mb-8 leading-relaxed text-gray-700">Ensure your contact information is current and professional. Include your LinkedIn profile and any relevant portfolio links.</p>`,
    author: "Sarah Johnson",
    date: "March 15, 2024",
    readTime: "5 min read",
    category: "Resume Tips",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
  },
  "2": {
    title: "Mastering the Art of Job Search in 2024",
    content: `
      <h2 class="text-2xl font-semibold text-secondary mb-6">Understanding the Modern Job Market</h2>
      <p class="mb-8 leading-relaxed text-gray-700">The job market has evolved significantly in recent years. Remote work, artificial intelligence, and changing employer preferences have transformed how we search for and secure employment opportunities.</p>

      <h2 class="text-2xl font-semibold text-secondary mb-6">1. Leverage LinkedIn Effectively</h2>
      <p class="mb-8 leading-relaxed text-gray-700">LinkedIn is more than just a professional network - it's a powerful job search tool. Here's how to maximize its potential:</p>
      <ul class="list-disc pl-6 mb-8 space-y-3 text-gray-700">
        <li>Optimize your profile with relevant keywords</li>
        <li>Engage with industry content regularly</li>
        <li>Connect with recruiters and hiring managers</li>
        <li>Use LinkedIn's job alert features</li>
        <li>Share your own insights and experiences</li>
      </ul>

      <h2 class="text-2xl font-semibold text-secondary mb-6">2. Build a Strong Personal Brand</h2>
      <p class="mb-8 leading-relaxed text-gray-700">Your personal brand is how you present yourself professionally. Consider:</p>
      <ul class="list-disc pl-6 mb-8 space-y-3 text-gray-700">
        <li>Consistent messaging across all platforms</li>
        <li>Professional portfolio or website</li>
        <li>Active presence in industry discussions</li>
        <li>Thought leadership content</li>
      </ul>

      <div class="bg-accent p-6 rounded-lg my-12 animate-fade-in">
        <h3 class="text-xl font-semibold mb-4">Expert Insight:</h3>
        <p class="text-gray-700">Your personal brand should tell a compelling story about who you are professionally and what unique value you bring to potential employers.</p>
      </div>

      <h2 class="text-2xl font-semibold text-secondary mb-6">3. Network Strategically</h2>
      <p class="mb-8 leading-relaxed text-gray-700">Networking remains one of the most effective job search strategies:</p>
      <ul class="list-disc pl-6 mb-8 space-y-3 text-gray-700">
        <li>Attend industry events and conferences</li>
        <li>Join professional associations</li>
        <li>Participate in online communities</li>
        <li>Schedule informational interviews</li>
      </ul>

      <h2 class="text-2xl font-semibold text-secondary mb-6">4. Master the Virtual Interview</h2>
      <p class="mb-8 leading-relaxed text-gray-700">Virtual interviews are here to stay. Prepare by:</p>
      <ul class="list-disc pl-6 mb-8 space-y-3 text-gray-700">
        <li>Testing your technology beforehand</li>
        <li>Creating a professional background</li>
        <li>Practicing virtual communication</li>
        <li>Dressing professionally</li>
      </ul>

      <h2 class="text-2xl font-semibold text-secondary mb-6">5. Develop In-Demand Skills</h2>
      <p class="mb-8 leading-relaxed text-gray-700">Stay competitive by focusing on:</p>
      <ul class="list-disc pl-6 mb-8 space-y-3 text-gray-700">
        <li>Digital literacy</li>
        <li>Data analysis</li>
        <li>Project management</li>
        <li>Remote collaboration</li>
        <li>Adaptability</li>
      </ul>`,
    author: "Michael Chen",
    date: "March 12, 2024",
    readTime: "7 min read",
    category: "Job Search",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
  },
  "3": {
    title: "What Hiring Managers Really Look For",
    content: `
      <h2 class="text-2xl font-semibold text-secondary mb-6">The Hidden Factors in Hiring Decisions</h2>
      <p class="mb-8 leading-relaxed text-gray-700">As hiring managers evaluate candidates, they look beyond just skills and experience. Understanding these key factors can give you a significant advantage in your job search.</p>

      <h2 class="text-2xl font-semibold text-secondary mb-6">1. Cultural Fit</h2>
      <p class="mb-8 leading-relaxed text-gray-700">Hiring managers assess how well you'll integrate with the team and company culture:</p>
      <ul class="list-disc pl-6 mb-8 space-y-3 text-gray-700">
        <li>Values alignment with the organization</li>
        <li>Communication style compatibility</li>
        <li>Adaptability to company dynamics</li>
        <li>Contribution to team diversity</li>
      </ul>

      <h2 class="text-2xl font-semibold text-secondary mb-6">2. Problem-Solving Abilities</h2>
      <p class="mb-8 leading-relaxed text-gray-700">Your approach to challenges matters more than perfect answers:</p>
      <ul class="list-disc pl-6 mb-8 space-y-3 text-gray-700">
        <li>Analytical thinking process</li>
        <li>Creative solution generation</li>
        <li>Decision-making under pressure</li>
        <li>Learning from past experiences</li>
      </ul>

      <div class="bg-accent p-6 rounded-lg my-12 animate-fade-in">
        <h3 class="text-xl font-semibold mb-4">Hiring Manager Tip:</h3>
        <p class="text-gray-700">When answering interview questions, use the STAR method (Situation, Task, Action, Result) to structure your responses and demonstrate your problem-solving abilities.</p>
      </div>

      <h2 class="text-2xl font-semibold text-secondary mb-6">3. Growth Potential</h2>
      <p class="mb-8 leading-relaxed text-gray-700">Managers look for candidates who can grow with the company:</p>
      <ul class="list-disc pl-6 mb-8 space-y-3 text-gray-700">
        <li>Continuous learning mindset</li>
        <li>Adaptability to change</li>
        <li>Leadership potential</li>
        <li>Career progression goals</li>
      </ul>

      <h2 class="text-2xl font-semibold text-secondary mb-6">4. Soft Skills</h2>
      <p class="mb-8 leading-relaxed text-gray-700">Technical skills get you in the door, but soft skills often seal the deal:</p>
      <ul class="list-disc pl-6 mb-8 space-y-3 text-gray-700">
        <li>Emotional intelligence</li>
        <li>Communication effectiveness</li>
        <li>Team collaboration</li>
        <li>Time management</li>
      </ul>

      <h2 class="text-2xl font-semibold text-secondary mb-6">5. Red Flags to Avoid</h2>
      <p class="mb-8 leading-relaxed text-gray-700">Be aware of common dealbreakers:</p>
      <ul class="list-disc pl-6 mb-8 space-y-3 text-gray-700">
        <li>Inconsistent work history without explanation</li>
        <li>Negative attitude about previous employers</li>
        <li>Lack of specific examples</li>
        <li>Poor communication or follow-up</li>
      </ul>`,
    author: "Emily Rodriguez",
    date: "March 10, 2024",
    readTime: "6 min read",
    category: "Hiring Tips",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
  }
};

const BlogPost = () => {
  const { id } = useParams();
  const post = blogPosts[id as keyof typeof blogPosts];

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="py-24">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center text-secondary">Blog post not found</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Rezume.dev Blog</title>
        <meta name="description" content={post.content.substring(0, 160).replace(/<[^>]*>/g, '')} />
        <meta name="keywords" content={`${post.category.toLowerCase()}, resume tips, career advice, professional resume, job search, ${post.title.toLowerCase()}`} />
        <link rel="canonical" href={`https://rezume.dev/blog/${id}`} />
        {/* Article structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "image": post.image,
            "author": post.author,
            "publisher": {
              "@type": "Organization",
              "name": "Rezume.dev",
              "logo": {
                "@type": "ImageObject",
                "url": "https://rezume.dev/custom-favicon.svg"
              }
            },
            "datePublished": post.date,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://rezume.dev/blog/${id}`
            }
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-white">
        <Header />
        <main className="py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <BlogHeader 
              title={post.title}
              author={post.author}
              date={post.date}
              readTime={post.readTime}
            />
            <BlogContent 
              content={post.content}
              image={post.image}
            />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BlogPost;
