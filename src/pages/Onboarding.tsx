
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    resumeStyle: "",
    industry: "",
    experienceLevel: "",
  });
  const navigate = useNavigate();

  const updateFormData = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => prev + 1);
    } else {
      // Handle completion
      navigate("/dashboard");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6">Choose your resume style</h2>
            <RadioGroup
              onValueChange={(value) => updateFormData("resumeStyle", value)}
              className="gap-4"
            >
              <div className="flex items-center space-x-2 border p-4 rounded-lg hover:border-primary transition-colors">
                <RadioGroupItem value="modern" id="modern" />
                <Label htmlFor="modern" className="flex-1 cursor-pointer">
                  Modern
                  <p className="text-sm text-muted-foreground">Clean and contemporary design</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border p-4 rounded-lg hover:border-primary transition-colors">
                <RadioGroupItem value="creative" id="creative" />
                <Label htmlFor="creative" className="flex-1 cursor-pointer">
                  Creative
                  <p className="text-sm text-muted-foreground">Stand out with unique layouts</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border p-4 rounded-lg hover:border-primary transition-colors">
                <RadioGroupItem value="ats" id="ats" />
                <Label htmlFor="ats" className="flex-1 cursor-pointer">
                  ATS-Friendly
                  <p className="text-sm text-muted-foreground">Optimized for applicant tracking systems</p>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6">Select your industry</h2>
            <RadioGroup
              onValueChange={(value) => updateFormData("industry", value)}
              className="gap-4"
            >
              <div className="flex items-center space-x-2 border p-4 rounded-lg hover:border-primary transition-colors">
                <RadioGroupItem value="tech" id="tech" />
                <Label htmlFor="tech" className="flex-1 cursor-pointer">
                  Technology
                </Label>
              </div>
              <div className="flex items-center space-x-2 border p-4 rounded-lg hover:border-primary transition-colors">
                <RadioGroupItem value="business" id="business" />
                <Label htmlFor="business" className="flex-1 cursor-pointer">
                  Business
                </Label>
              </div>
              <div className="flex items-center space-x-2 border p-4 rounded-lg hover:border-primary transition-colors">
                <RadioGroupItem value="creative" id="creative-industry" />
                <Label htmlFor="creative-industry" className="flex-1 cursor-pointer">
                  Creative
                </Label>
              </div>
              <div className="flex items-center space-x-2 border p-4 rounded-lg hover:border-primary transition-colors">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other" className="flex-1 cursor-pointer">
                  Other
                </Label>
              </div>
            </RadioGroup>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6">What's your experience level?</h2>
            <RadioGroup
              onValueChange={(value) => updateFormData("experienceLevel", value)}
              className="gap-4"
            >
              <div className="flex items-center space-x-2 border p-4 rounded-lg hover:border-primary transition-colors">
                <RadioGroupItem value="entry" id="entry" />
                <Label htmlFor="entry" className="flex-1 cursor-pointer">
                  Entry Level
                  <p className="text-sm text-muted-foreground">0-2 years experience</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border p-4 rounded-lg hover:border-primary transition-colors">
                <RadioGroupItem value="mid" id="mid" />
                <Label htmlFor="mid" className="flex-1 cursor-pointer">
                  Mid Level
                  <p className="text-sm text-muted-foreground">2-5 years experience</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border p-4 rounded-lg hover:border-primary transition-colors">
                <RadioGroupItem value="senior" id="senior" />
                <Label htmlFor="senior" className="flex-1 cursor-pointer">
                  Senior Level
                  <p className="text-sm text-muted-foreground">5+ years experience</p>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center space-x-8 mb-8">
          {[1, 2, 3].map((number) => (
            <div
              key={number}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= number
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {step > number ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                number
              )}
            </div>
          ))}
        </div>

        {renderStep()}

        <div className="flex justify-end mt-8">
          <Button onClick={handleNext} className="w-32">
            {step === 3 ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
