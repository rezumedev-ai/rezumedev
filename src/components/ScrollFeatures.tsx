
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export function ScrollFeatures() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h2 className="text-4xl font-semibold text-foreground">
              Transform Your Career With <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none text-primary">
                AI-Powered Resumes
              </span>
            </h2>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 h-full">
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-primary/5 backdrop-blur-sm">
              <h3 className="text-2xl font-semibold text-primary mb-3">Smart ATS Optimization</h3>
              <p className="text-muted-foreground">Our AI analyzes job descriptions and optimizes your resume to pass ATS systems with higher success rates.</p>
            </div>
            <div className="p-6 rounded-2xl bg-primary/5 backdrop-blur-sm">
              <h3 className="text-2xl font-semibold text-primary mb-3">Professional Templates</h3>
              <p className="text-muted-foreground">Choose from a variety of professionally designed templates that catch recruiters' attention.</p>
            </div>
          </div>
          <div className="space-y-6 mt-8 md:mt-12">
            <div className="p-6 rounded-2xl bg-primary/5 backdrop-blur-sm">
              <h3 className="text-2xl font-semibold text-primary mb-3">Real-Time Feedback</h3>
              <p className="text-muted-foreground">Get instant suggestions to improve your resume's impact and effectiveness.</p>
            </div>
            <div className="p-6 rounded-2xl bg-primary/5 backdrop-blur-sm">
              <h3 className="text-2xl font-semibold text-primary mb-3">Easy Customization</h3>
              <p className="text-muted-foreground">Tailor your resume for different jobs with our intuitive editing tools.</p>
            </div>
          </div>
        </div>
      </ContainerScroll>
    </div>
  );
}
