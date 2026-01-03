import {format, parseISO, isValid, differenceInYears, differenceInDays} from 'date-fns';

/**
 * Format date to display format
 * @param {Date|string} date - Date object or ISO string
 * @param {string} formatString - Format string (default: 'dd MMM yyyy')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatString = 'dd MMM yyyy') => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid Date';
    return format(dateObj, formatString);
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Format date and time
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} Formatted date time string
 */
export const formatDateTime = date => {
  return formatDate(date, 'dd MMM yyyy, hh:mm a');
};

/**
 * Format time only
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} Formatted time string
 */
export const formatTime = date => {
  return formatDate(date, 'hh:mm a');
};

/**
 * Get relative time (e.g., '2 days ago')
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} Relative time string
 */
export const getRelativeTime = date => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid Date';

    const days = differenceInDays(new Date(), dateObj);

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Calculate age from date of birth
 * @param {Date|string} dob - Date of birth
 * @returns {number} Age in years
 */
export const calculateAge = dob => {
  try {
    const dobObj = typeof dob === 'string' ? parseISO(dob) : dob;
    if (!isValid(dobObj)) return 0;
    return differenceInYears(new Date(), dobObj);
  } catch (error) {
    return 0;
  }
};

/**
 * Check if date is in the past
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export const isPastDate = date => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) && dateObj < new Date();
  } catch (error) {
    return false;
  }
};

/**
 * Check if date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is today
 */
export const isToday = date => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return false;

    const today = new Date();
    return (
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()
    );
  } catch (error) {
    return false;
  }
};

/**
 * Get start of day
 * @param {Date|string} date - Date
 * @returns {Date} Start of day
 */
export const startOfDay = date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj;
};

/**
 * Get end of day
 * @param {Date|string} date - Date
 * @returns {Date} End of day
 */
export const endOfDay = date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  dateObj.setHours(23, 59, 59, 999);
  return dateObj;
};
