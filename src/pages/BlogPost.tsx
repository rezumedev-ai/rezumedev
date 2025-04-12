
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
  },
  "4": {
    title: "How to Write a Resume for Remote Jobs",
    content: `
      <h2 class="text-2xl font-semibold text-secondary mb-6">The Remote Work Revolution</h2>
      <p class="mb-8 leading-relaxed text-gray-700">Remote work has transformed from a rare perk to a standard option for many roles. To stand out in this competitive landscape, your resume needs specific elements that demonstrate your ability to excel in a virtual environment.</p>

      <h2 class="text-2xl font-semibold text-secondary mb-6">1. Highlight Remote Work Experience</h2>
      <p class="mb-8 leading-relaxed text-gray-700">If you've worked remotely before, make it obvious:</p>
      <ul class="list-disc pl-6 mb-8 space-y-3 text-gray-700">
        <li>Explicitly mention "remote" in your job descriptions</li>
        <li>Include the percentage of time spent working remotely</li>
        <li>Describe your home office setup if relevant</li>
      </ul>

      <h2 class="text-2xl font-semibold text-secondary mb-6">2. Showcase Remote-Ready Skills</h2>
      <p class="mb-8 leading-relaxed text-gray-700">Certain skills are particularly valuable for remote positions:</p>
      <ul class="list-disc pl-6 mb-8 space-y-3 text-gray-700">
        <li>Self-motivation and time management</li>
        <li>Written communication excellence</li>
        <li>Experience with collaboration tools (Slack, Teams, Asana, etc.)</li>
        <li>Problem-solving independence</li>
        <li>Results-oriented mindset</li>
      </ul>

      <div class="bg-accent p-6 rounded-lg my-12 animate-fade-in">
        <h3 class="text-xl font-semibold mb-4">Pro Tip:</h3>
        <p class="text-gray-700">Create a dedicated "Remote Work Tools" section that lists all the collaboration, project management, and communication platforms you're familiar with.</p>
      </div>

      <h2 class="text-2xl font-semibold text-secondary mb-6">3. Demonstrate Productivity Metrics</h2>
      <p class="mb-8 leading-relaxed text-gray-700">Remote employers want to know you can deliver results without supervision:</p>
      <ul class="list-disc pl-6 mb-8 space-y-3 text-gray-700">
        <li>Include quantifiable achievements</li>
        <li>Highlight projects completed ahead of schedule</li>
        <li>Mention productivity systems you use</li>
        <li>Describe how you track and report progress</li>
      </ul>

      <h2 class="text-2xl font-semibold text-secondary mb-6">4. Address Time Zone Management</h2>
      <p class="mb-8 leading-relaxed text-gray-700">For global companies, time zone adaptability matters:</p>
      <ul class="list-disc pl-6 mb-8 space-y-3 text-gray-700">
        <li>Note your time zone and flexibility</li>
        <li>Mention experience working with distributed teams</li>
        <li>Highlight any asynchronous communication experience</li>
      </ul>

      <h2 class="text-2xl font-semibold text-secondary mb-6">5. Create a Digital-First Resume</h2>
      <p class="mb-8 leading-relaxed text-gray-700">Remote positions often involve digital application processes:</p>
      <ul class="list-disc pl-6 mb-8 space-y-3 text-gray-700">
        <li>Ensure your resume is ATS-friendly</li>
        <li>Include links to your LinkedIn, portfolio, or GitHub</li>
        <li>Consider adding a QR code linking to your online presence</li>
        <li>Make email and contact information prominent</li>
      </ul>

      <h2 class="text-2xl font-semibold text-secondary mb-6">6. Tailor for Remote-Specific Keywords</h2>
      <p class="mb-8 leading-relaxed text-gray-700">Remote job listings often contain specific terms to include in your resume:</p>
      <ul class="list-disc pl-6 mb-8 space-y-3 text-gray-700">
        <li>"Self-starter" and "independent worker"</li>
        <li>"Digital communication" and "virtual collaboration"</li>
        <li>"Autonomous" and "results-driven"</li>
        <li>"Flexible" and "adaptable"</li>
      </ul>

      <p class="mb-8 leading-relaxed text-gray-700">By optimizing your resume for remote positions, you demonstrate not just your qualifications for the role, but your understanding of what it takes to be successful in a virtual environment.</p>`,
    author: "David Wilson",
    date: "March 20, 2024",
    readTime: "8 min read",
    category: "Remote Work",
    image: "https://images.unsplash.com/photo-1552960562-daf630e9278b"
  },
  "5": {
    title: "Cover Letter vs Resume: Do You Still Need Both?",
    content: `
      <h2 class="text-2xl font-semibold text-secondary mb-6">The Traditional Application Package</h2>
      <p class="mb-8 leading-relaxed text-gray-700">For decades, job seekers have been told that a complete application requires both a resume and a cover letter. But in today's digital-first job market, is this still true? Let's break down the current landscape.</p>

      <h2 class="text-2xl font-semibold text-secondary mb-6">1. The Purpose of Each Document</h2>
      <p class="mb-8 leading-relaxed text-gray-700">Understanding the distinct roles these documents play can help you decide when each is necessary:</p>
      
      <div class="grid md:grid-cols-2 gap-6 mb-10">
        <div class="border rounded-lg p-6 bg-white shadow-sm">
          <h3 class="text-xl font-semibold mb-3 text-primary">Resume</h3>
          <ul class="list-disc pl-5 space-y-2 text-gray-700">
            <li>Summarizes your professional history</li>
            <li>Highlights relevant skills and achievements</li>
            <li>Provides a chronological overview of experience</li>
            <li>Focuses on facts and measurable results</li>
            <li>Typically 1-2 pages in length</li>
          </ul>
        </div>
        
        <div class="border rounded-lg p-6 bg-white shadow-sm">
          <h3 class="text-xl font-semibold mb-3 text-primary">Cover Letter</h3>
          <ul class="list-disc pl-5 space-y-2 text-gray-700">
            <li>Explains your interest in the specific role</li>
            <li>Addresses how your background fits the position</li>
            <li>Provides context for any resume gaps or transitions</li>
            <li>Demonstrates writing ability and communication style</li>
            <li>Typically 1 page in length</li>
          </ul>
        </div>
      </div>

      <h2 class="text-2xl font-semibold text-secondary mb-6">2. When a Cover Letter is Essential</h2>
      <p class="mb-8 leading-relaxed text-gray-700">Despite changing trends, cover letters remain crucial in certain scenarios:</p>
      <ul class="list-disc pl-6 mb-8 space-y-3 text-gray-700">
        <li>When the job posting explicitly requests one</li>
        <li>For career transitions or industry changes</li>
        <li>When explaining employment gaps or unique circumstances</li>
        <li>For positions requiring strong writing skills</li>
        <li>When you have a personal connection to reference</li>
      </ul>

      <div class="bg-accent p-6 rounded-lg my-12 animate-fade-in">
        <h3 class="text-xl font-semibold mb-4">Industry Insight:</h3>
        <p class="text-gray-700">According to our survey of hiring managers, 68% still read cover letters when they're included, even if they're listed as "optional" in the job posting.</p>
      </div>

      <h2 class="text-2xl font-semibold text-secondary mb-6">3. When You Can Skip the Cover Letter</h2>
      <p class="mb-8 leading-relaxed text-gray-700">There are legitimate situations where a cover letter may be unnecessary:</p>
      <ul class="list-disc pl-6 mb-8 space-y-3 text-gray-700">
        <li>When the application explicitly states "no cover letters"</li>
        <li>For technical positions where portfolios or code samples are more relevant</li>
        <li>In high-volume hiring situations like job fairs</li>
        <li>When applying through platforms that don't provide space for one</li>
      </ul>

      <h2 class="text-2xl font-semibold text-secondary mb-6">4. The Modern Alternative: Hybrid Approaches</h2>
      <p class="mb-8 leading-relaxed text-gray-700">The digital era has introduced new formats that blend elements of both documents:</p>
      <ul class="list-disc pl-6 mb-8 space-y-3 text-gray-700">
        <li>Short cover notes in the body of application emails</li>
        <li>LinkedIn "About" sections that tell your professional story</li>
        <li>Video introductions for certain creative roles</li>
        <li>Portfolio websites with personal statements</li>
      </ul>

      <h2 class="text-2xl font-semibold text-secondary mb-6">5. Making Your Cover Letter Count</h2>
      <p class="mb-8 leading-relaxed text-gray-700">If you do write a cover letter, ensure it adds value:</p>
      <ul class="list-disc pl-6 mb-8 space-y-3 text-gray-700">
        <li>Customize for each application (generic cover letters are worse than none)</li>
        <li>Address specific requirements from the job posting</li>
        <li>Tell a story your resume doesn't capture</li>
        <li>Demonstrate genuine enthusiasm for the role and company</li>
        <li>Keep it concise and focused (3-4 paragraphs maximum)</li>
      </ul>

      <p class="mb-8 leading-relaxed text-gray-700">The verdict? While the resume remains essential, the cover letter has become situational. When in doubt, include one—a thoughtful cover letter rarely hurts your chances and often improves them.</p>`,
    author: "Priya Sharma",
    date: "March 18, 2024",
    readTime: "6 min read",
    category: "Application Tips",
    image: "https://images.unsplash.com/photo-1586473219010-2ffc57b0d282"
  },
  "6": {
    title: "From Zero to Hired: How I Landed My Dream Job with Rezume.dev",
    content: `
      <h2 class="text-2xl font-semibold text-secondary mb-6">My Job Search Struggle</h2>
      <p class="mb-8 leading-relaxed text-gray-700">Eight months. That's how long I had been searching for a product management role at a tech company after being laid off. With each passing week, my confidence was eroding as quickly as my savings account. I had submitted over 120 applications with only a handful of first-round interviews to show for it.</p>

      <p class="mb-8 leading-relaxed text-gray-700">I knew something needed to change in my approach. My resume wasn't cutting through the noise, and I suspected it wasn't even making it past the ATS systems most companies use to filter candidates.</p>

      <h2 class="text-2xl font-semibold text-secondary mb-6">The Turning Point</h2>
      <p class="mb-8 leading-relaxed text-gray-700">A former colleague suggested I try Rezume.dev after she had successfully landed a new role within three weeks of using the platform. Skeptical but desperate, I decided to give it a shot—what did I have to lose?</p>

      <p class="mb-8 leading-relaxed text-gray-700">The first thing that surprised me was how different the Rezume.dev approach was from other resume builders I'd tried. Rather than just asking me to fill in blanks, the guided system asked thoughtful questions about my experience that helped me recall achievements I'd completely forgotten to include in my previous resumes.</p>

      <div class="bg-accent p-6 rounded-lg my-12 animate-fade-in">
        <h3 class="text-xl font-semibold mb-4">Key Realization:</h3>
        <p class="text-gray-700">My old resume was task-oriented, listing what I did day-to-day. Rezume.dev helped me transform it into an achievement-focused document that quantified my impact at each role.</p>
      </div>

      <h2 class="text-2xl font-semibold text-secondary mb-6">The Resume Transformation</h2>
      <p class="mb-8 leading-relaxed text-gray-700">Here's what changed with my new Rezume.dev resume:</p>
      
      <div class="grid md:grid-cols-2 gap-6 mb-10">
        <div class="border rounded-lg p-6 bg-white shadow-sm">
          <h3 class="text-xl font-semibold mb-3 text-red-500">Before</h3>
          <ul class="list-disc pl-5 space-y-2 text-gray-700">
            <li>Generic objective statement</li>
            <li>Vague responsibility descriptions</li>
            <li>No quantifiable achievements</li>
            <li>Cluttered, text-heavy layout</li>
            <li>Generic skills section</li>
          </ul>
        </div>
        
        <div class="border rounded-lg p-6 bg-white shadow-sm">
          <h3 class="text-xl font-semibold mb-3 text-green-500">After</h3>
          <ul class="list-disc pl-5 space-y-2 text-gray-700">
            <li>Powerful professional summary</li>
            <li>Achievement-focused bullet points</li>
            <li>Metrics and percentages throughout</li>
            <li>Clean, ATS-optimized format</li>
            <li>Tailored skills matching job descriptions</li>
          </ul>
        </div>
      </div>

      <h2 class="text-2xl font-semibold text-secondary mb-6">The Results Speak for Themselves</h2>
      <p class="mb-8 leading-relaxed text-gray-700">Within two weeks of using my new resume:</p>
      <ul class="list-disc pl-6 mb-8 space-y-3 text-gray-700">
        <li>Applied to 15 positions</li>
        <li>Received 8 responses for initial interviews</li>
        <li>Advanced to final rounds with 3 companies</li>
        <li>Received 2 job offers</li>
      </ul>

      <p class="mb-8 leading-relaxed text-gray-700">The most validating moment came during an interview when the hiring manager specifically commented, "Your resume really stood out from the others we received. It clearly shows your impact and makes it easy to see why you'd be valuable to our team."</p>

      <h2 class="text-2xl font-semibold text-secondary mb-6">The Dream Job Offer</h2>
      <p class="mb-8 leading-relaxed text-gray-700">Just five weeks after rebuilding my resume with Rezume.dev, I accepted an offer for a Senior Product Manager role at a growing fintech company—with a 15% higher salary than my previous position. The role aligned perfectly with my career goals, and I'm now six months in and thriving.</p>

      <h2 class="text-2xl font-semibold text-secondary mb-6">Lessons Learned</h2>
      <p class="mb-8 leading-relaxed text-gray-700">My job search journey taught me several valuable lessons:</p>
      <ul class="list-disc pl-6 mb-8 space-y-3 text-gray-700">
        <li>A tailored, achievement-focused resume is worth the time investment</li>
        <li>ATS optimization is not optional in today's job market</li>
        <li>Quantifiable results speak louder than job descriptions</li>
        <li>The right tools can dramatically reduce your time-to-hire</li>
        <li>Professional presentation matters, even in technical fields</li>
      </ul>

      <p class="mb-8 leading-relaxed italic text-gray-700">"I don't consider the money spent on Rezume.dev an expense—it was an investment in my career that paid for itself many times over with my new salary."</p>

      <p class="mb-8 leading-relaxed text-gray-700">If you're struggling in your job search like I was, consider whether your resume might be the barrier. The right presentation of your experience could be all that stands between you and your next career move.</p>`,
    author: "Alex Miyamoto",
    date: "March 25, 2024",
    readTime: "9 min read",
    category: "Success Story",
    image: "https://images.unsplash.com/photo-1579389083078-4e7018379f7e"
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
