import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Award, CalendarIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Certification {
  name: string;
  organization: string;
  completionDate: string;
}

interface CertificationsStepProps {
  formData: Certification[];
  onChange: (certifications: Certification[]) => void;
}

export function CertificationsStep({ formData, onChange }: CertificationsStepProps) {
  const addCertification = () => {
    onChange([
      ...formData,
      {
        name: "",
        organization: "",
        completionDate: ""
      }
    ]);
  };

  const removeCertification = (index: number) => {
    onChange(formData.filter((_, i) => i !== index));
  };

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    const updatedCertifications = formData.map((cert, i) => {
      if (i === index) {
        return { ...cert, [field]: value };
      }
      return cert;
    });
    onChange(updatedCertifications);
  };

  return (
    <div className="space-y-6">
      {formData.map((certification, index) => (
        <Card key={index} className="p-6 relative space-y-4 animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 text-gray-400 hover:text-red-500"
            onClick={() => removeCertification(index)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2 text-primary">
            <Award className="w-5 h-5" />
            <h3 className="font-medium">Certification {index + 1}</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Certification Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={certification.name}
                onChange={(e) => updateCertification(index, "name", e.target.value)}
                placeholder="e.g. AWS Certified Solutions Architect"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Issuing Organization <span className="text-red-500">*</span>
              </label>
              <Input
                value={certification.organization}
                onChange={(e) => updateCertification(index, "organization", e.target.value)}
                placeholder="e.g. Amazon Web Services"
              />
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Completion Date <span className="text-red-500">*</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal border-gray-200 bg-white hover:bg-gray-50",
                      !certification.completionDate && "text-muted-foreground"
                    )}
                  >
                    {certification.completionDate ? (
                      format(new Date(certification.completionDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <Calendar
                    mode="single"
                    selected={certification.completionDate ? new Date(certification.completionDate) : undefined}
                    onSelect={(date) => date && updateCertification(index, "completionDate", date.toISOString())}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    captionLayout="dropdown-buttons"
                    fromYear={1960}
                    toYear={new Date().getFullYear()}
                    initialFocus
                    className="rounded-md border shadow-lg bg-white"
                    classNames={{
                      caption_dropdowns: "flex justify-center gap-3 pt-1 items-center",
                      dropdown: "h-9 border-gray-200 rounded-md px-2 py-1 text-sm bg-gray-50 hover:bg-white focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer font-medium transition-colors",
                      nav: "hidden"
                    }}
                    labels={{
                      labelMonthDropdown: () => null,
                      labelYearDropdown: () => null
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </Card>
      ))}

      <Button
        onClick={addCertification}
        variant="outline"
        className="w-full py-8 border-dashed hover:border-primary hover:bg-primary/5"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Certification
      </Button>
    </div>
  );
}
