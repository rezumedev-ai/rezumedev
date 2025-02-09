
export const Process = () => {
  const steps = [
    {
      number: "01",
      title: "Enter your details",
      description: "Fill in your professional information and job preferences",
    },
    {
      number: "02",
      title: "AI generates your resume",
      description: "Our AI creates a tailored, ATS-optimized resume",
    },
    {
      number: "03",
      title: "Download & apply",
      description: "Get your polished resume ready for job applications",
    },
  ];

  return (
    <section className="py-20 bg-white sm:py-32">
      <div className="container">
        <h2 className="mb-16 text-3xl font-bold text-center text-secondary sm:text-4xl">
          How It Works
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="p-6 transition-all bg-white rounded-2xl hover:shadow-lg animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-center w-12 h-12 mb-4 text-lg font-semibold text-primary bg-accent rounded-xl">
                {step.number}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-secondary">
                {step.title}
              </h3>
              <p className="text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
