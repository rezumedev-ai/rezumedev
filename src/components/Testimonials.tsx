
import { Star } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Miller",
      role: "Software Engineer",
      content: "The AI-generated resume helped me land interviews at top tech companies. Highly recommended!",
      company: "Apple Inc."
    },
    {
      name: "James Wilson",
      role: "Marketing Manager",
      content: "This tool made updating my resume effortless. The tailored content really stands out.",
      company: "Disney"
    },
    {
      name: "Emma Thompson",
      role: "Product Designer",
      content: "Perfect balance of professional formatting and compelling content. Worth every penny!",
      company: "Booking.com"
    },
    {
      name: "Michael Chen",
      role: "Data Scientist",
      content: "The AI suggestions were spot-on for my field. Secured multiple interviews within weeks.",
      company: "HCL Technologies"
    },
    {
      name: "Laura Martinez",
      role: "Supply Chain Manager",
      content: "Excellent tool for highlighting key achievements. Made my experience shine!",
      company: "DHL"
    },
    {
      name: "David Kim",
      role: "UX Researcher",
      content: "The industry-specific templates were perfect. Landed my dream job!",
      company: "Meta"
    }
  ];

  return (
    <section className="py-20 bg-white sm:py-32">
      <div className="container">
        <h2 className="mb-16 text-3xl font-bold text-center text-secondary sm:text-4xl">
          What Our Users Say
        </h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={testimonial.name} className="md:basis-1/2 lg:basis-1/3">
                <div
                  className="h-full p-6 transition-all bg-white border rounded-2xl hover:shadow-lg"
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
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>

        <div className="mt-24">
          <h3 className="mb-12 text-2xl font-bold text-center text-secondary">
            Our Users Got Hired At
          </h3>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
            {['Apple', 'Disney', 'HCL', 'Booking.com', 'DHL'].map((company) => (
              <div
                key={company}
                className="flex items-center justify-center p-6 transition-all bg-white border rounded-xl hover:shadow-md group"
              >
                <p className="text-xl font-bold text-secondary group-hover:text-primary transition-colors">
                  {company}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
