
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export function toast({
  title,
  description,
  variant = "default",
  duration = 5000,
  action,
}: ToastProps) {
  return sonnerToast(title, {
    description,
    duration,
    style: variant === "destructive" ? { backgroundColor: "var(--destructive)", color: "var(--destructive-foreground)" } : undefined,
    action: action ? {
      label: action.label,
      onClick: action.onClick,
    } : undefined,
  });
}

// Export a simple hook to maintain API compatibility with existing code
export function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
  };
}
