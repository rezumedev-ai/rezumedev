import { formatDate } from "@/lib/utils";

/**
 * Formats a date range into a human-readable string
 */
export const formatDateRange = (startDate: string, endDate: string, isCurrentJob?: boolean): string => {
  // Handle empty dates
  if (!startDate && !endDate) return '';
  if (!startDate) return `Until ${formatDate(endDate)}`;
  
  // Handle current jobs and jobs with no end date
  if (isCurrentJob || !endDate) {
    return `${formatDate(startDate)} - Present`;
  }
  
  // If endDate is "Present" or "Current", keep it as is
  if (endDate === 'Present' || endDate === 'Current') {
    return `${formatDate(startDate)} - ${endDate}`;
  }
  
  // Format both dates for completed jobs
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};
