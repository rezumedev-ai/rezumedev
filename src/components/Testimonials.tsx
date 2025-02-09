
import { Star } from 'lucide-react';

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Miller",
      role: "Software Engineer",
      content: "The AI-generated resume helped me land interviews at top tech companies. Highly recommended!",
    },
    {
      name: "James Wilson",
      role: "Marketing Manager",
      content: "This tool made updating my resume effortless. The tailored content really stands out.",
    },
    {
      name: "Emma Thompson",
      role: "Product Designer",
      content: "Perfect balance of professional formatting and compelling content. Worth every penny!",
    },
  ];

  return (
    <section className="py-20 bg-white sm:py-32">
      <div className="container">
        <h2 className="mb-16 text-3xl font-bold text-center text-secondary sm:text-4xl">
          What Our Users Say
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="p-6 transition-all bg-white border rounded-2xl hover:shadow-lg animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex mb-4 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-primary fill-primary" />
                ))}
              </div>
              <p className="mb-4 text-muted-foreground">
                "{testimonial.content}"
              </p>
              <div>
                <p className="font-semibold text-secondary">
                  {testimonial.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
