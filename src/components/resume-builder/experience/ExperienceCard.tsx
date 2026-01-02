
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Trash2, Briefcase, CalendarIcon } from "lucide-react";
import { WorkExperience } from "@/types/resume";
import { ResponsibilitiesSection } from "./ResponsibilitiesSection";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ExperienceCardProps {
  experience: WorkExperience;
  index: number;
  onUpdate: (field: keyof WorkExperience, value: any) => void;
  onRemove: () => void;
  hideResponsibilities?: boolean;
}

export function ExperienceCard({
  experience,
  index,
  onUpdate,
  onRemove,
  hideResponsibilities = false
}: ExperienceCardProps) {
  return (
    <Card className="p-6 relative space-y-4 animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 text-gray-400 hover:text-red-500"
        onClick={onRemove}
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      <div className="flex items-center gap-2 text-primary">
        <Briefcase className="w-5 h-5" />
        <h3 className="font-medium">Experience {index + 1}</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Job Title <span className="text-red-500">*</span>
          </label>
          <Input
            value={experience.jobTitle}
            onChange={(e) => onUpdate("jobTitle", e.target.value)}
            placeholder="e.g. Senior Software Engineer"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Company Name <span className="text-red-500">*</span>
          </label>
          <Input
            value={experience.companyName}
            onChange={(e) => onUpdate("companyName", e.target.value)}
            placeholder="e.g. Tech Corp Inc."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Location</label>
          <Input
            value={experience.location || ""}
            onChange={(e) => onUpdate("location", e.target.value)}
            placeholder="e.g. San Francisco, CA"
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium text-gray-700">
            Start Date <span className="text-red-500">*</span>
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full pl-3 text-left font-normal border-gray-200 bg-white hover:bg-gray-50",
                  !experience.startDate && "text-muted-foreground"
                )}
              >
                {experience.startDate ? (
                  format(new Date(experience.startDate), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white" align="start">
              <Calendar
                mode="single"
                selected={experience.startDate ? new Date(experience.startDate) : undefined}
                onSelect={(date) => date && onUpdate("startDate", date.toISOString())}
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

        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium text-gray-700">
            End Date {!experience.isCurrentJob && <span className="text-red-500">*</span>}
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                disabled={experience.isCurrentJob}
                className={cn(
                  "w-full pl-3 text-left font-normal border-gray-200 bg-white hover:bg-gray-50",
                  !experience.endDate && "text-muted-foreground",
                  experience.isCurrentJob && "opacity-50 cursor-not-allowed bg-gray-50"
                )}
              >
                {experience.isCurrentJob ? (
                  <span>Present</span>
                ) : experience.endDate ? (
                  format(new Date(experience.endDate), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white" align="start">
              <Calendar
                mode="single"
                selected={experience.endDate ? new Date(experience.endDate) : undefined}
                onSelect={(date) => date && onUpdate("endDate", date.toISOString())}
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
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`current-job-${index}`}
            checked={experience.isCurrentJob}
            onChange={(e) => onUpdate("isCurrentJob", e.target.checked)}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor={`current-job-${index}`} className="text-sm text-gray-700">
            I currently work here
          </label>
        </div>
      </div>

      {!hideResponsibilities && (
        <ResponsibilitiesSection
          responsibilities={experience.responsibilities}
          onUpdate={(value) => onUpdate("responsibilities", value)}
          jobTitle={experience.jobTitle}
        />
      )}
    </Card>
  );
}
