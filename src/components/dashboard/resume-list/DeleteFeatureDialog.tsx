
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

interface DeleteFeatureDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onViewPricing: () => void;
}

export function DeleteFeatureDialog({ isOpen, onClose, onViewPricing }: DeleteFeatureDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Premium Feature
          </DialogTitle>
          <DialogDescription>
            Deleting resumes is a premium feature available to subscribers only.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-center text-gray-700 mb-4">
            Upgrade to a paid plan to unlock the ability to delete resumes, along with other premium features like unlimited resume creation and AI-powered resume optimization.
          </p>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="sm:w-auto w-full"
          >
            Maybe Later
          </Button>
          <Button 
            onClick={onViewPricing}
            className="sm:w-auto w-full bg-gradient-to-r from-primary to-primary-hover"
          >
            View Pricing Plans
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
