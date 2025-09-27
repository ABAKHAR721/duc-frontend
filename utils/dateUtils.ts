/**
 * Utility functions for date formatting
 */

/**
 * Formats a date string for display in tables and UI
 * @param dateString - The date string to format (can be null/undefined)
 * @param options - Intl.DateTimeFormatOptions for customizing the format
 * @returns Formatted date string or fallback text
 */
export const formatDate = (
  dateString: string | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!dateString) {
    return 'Non définie';
  }
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Date invalide';
  }
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  return date.toLocaleDateString('fr-FR', options || defaultOptions);
};

/**
 * Formats a date string with time for detailed views
 * @param dateString - The date string to format (can be null/undefined)
 * @returns Formatted date and time string
 */
export const formatDateTime = (dateString: string | null | undefined): string => {
  return formatDate(dateString, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Formats a date for form inputs (YYYY-MM-DD format)
 * @param dateString - The date string to format
 * @returns Date string in YYYY-MM-DD format or empty string
 */
export const formatDateForInput = (dateString: string | null | undefined): string => {
  if (!dateString) {
    return '';
  }
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return '';
  }
  
  return date.toISOString().split('T')[0];
};

/**
 * Checks if a date string is valid
 * @param dateString - The date string to validate
 * @returns True if the date is valid, false otherwise
 */
export const isValidDate = (dateString: string | null | undefined): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};
