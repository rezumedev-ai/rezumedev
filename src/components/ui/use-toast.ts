
// Export both toast function and hook from sonner
import { toast } from "sonner";

// Create a hook that returns an object with toast for backward compatibility
export const useToast = () => ({ toast });
export { toast };
