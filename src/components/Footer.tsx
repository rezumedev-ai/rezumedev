import { Github, Linkedin, Twitter, FileText, RssIcon } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted py-12 mt-20 border-t">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div className="space-y-4 md:col-span-2">
            <h3 className="font-semibold text-lg text-secondary">Rezume.dev</h3>
            <p className="text-sm text-muted-foreground">AI-powered resumes, tailored for success. Create professional, ATS-friendly resumes that help you land your dream job.</p>
            <div className="flex space-x-4">
              <a href="/sitemap.html" aria-label="View our sitemap" className="text-muted-foreground hover:text-primary transition-colors">
                <FileText className="h-5 w-5" />
              </a>
              <a href="/rss.xml" target="_blank" rel="noopener noreferrer" aria-label="Subscribe to our RSS feed" className="text-muted-foreground hover:text-primary transition-colors">
                <RssIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-secondary mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/guides" className="text-sm text-muted-foreground hover:text-primary transition-colors">Career Guides</Link>
              </li>
              <li>
                <Link to="/features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</Link>
              </li>
              <li>
                <a href="/sitemap.xml" className="text-sm text-muted-foreground hover:text-primary transition-colors">XML Sitemap</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-secondary mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-muted-foreground hover:text-primary transition-colors">Careers</Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-secondary mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} Rezume.dev. All rights reserved.
            </p>
            <div className="text-sm text-muted-foreground">
              <span className="md:hidden">|</span> 
              <span className="hidden md:inline">Helping professionals land their dream jobs with </span>
              <a href="https://rezume.dev" className="text-primary hover:underline">AI-powered resumes</a>.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
