
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Submit to Supabase
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          { 
            name: formData.name,
            email: formData.email,
            message: formData.message
          }
        ]);
        
      if (error) throw error;
      
      // Show success toast
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        message: ""
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 relative animate-fade-up">
              <span className="text-secondary">Get in </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Touch
              </span>
              <div className="absolute -z-10 w-full h-full blur-3xl opacity-20 bg-gradient-to-r from-primary via-accent to-primary/60 animate-pulse"></div>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground animate-fade-up" style={{ animationDelay: '100ms' }}>
              We'd love to hear from you
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-up" style={{ animationDelay: '200ms' }}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-secondary mb-2">Name</label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">Email</label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-secondary mb-2">Message</label>
                <Textarea 
                  id="message" 
                  value={formData.message}
                  onChange={handleChange}
                  required 
                  className="min-h-[150px]" 
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
