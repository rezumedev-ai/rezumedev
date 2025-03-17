/**
 * Formats a date range into a human-readable string
 */
export const formatDateRange = (startDate: string, endDate: string): string => {
  // Handle empty dates
  if (!startDate && !endDate) return '';
  if (!startDate) return `Until ${endDate}`;
  if (!endDate) return `From ${startDate}`;
  
  // If endDate is "Present" or "Current", keep it as is
  if (endDate === 'Present' || endDate === 'Current') {
    return `${startDate} - ${endDate}`;
  }
  
  // Otherwise, format as normal date range
  return `${startDate} - ${endDate}`;
};
