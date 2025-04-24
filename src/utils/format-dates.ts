import { formatDate } from "@/lib/utils";

/**
 * Formats a date range into a human-readable string
 */
export const formatDateRange = (startDate: string, endDate: string): string => {
  // Handle empty dates
  if (!startDate && !endDate) return '';
  if (!startDate) return `Until ${formatDate(endDate)}`;
  if (!endDate) return `From ${formatDate(startDate)}`;
  
  // If endDate is "Present" or "Current", keep it as is
  if (endDate === 'Present' || endDate === 'Current') {
    return `${formatDate(startDate)} - ${endDate}`;
  }
  
  // Format both dates
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};
