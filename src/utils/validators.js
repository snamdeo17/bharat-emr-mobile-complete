/**
 * Validate mobile number (Indian format)
 * @param {string} mobile - Mobile number
 * @returns {boolean} True if valid
 */
export const isValidMobileNumber = mobile => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile?.replace(/\s+/g, ''));
};

/**
 * Validate email address
 * @param {string} email - Email address
 * @returns {boolean} True if valid
 */
export const isValidEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate OTP (6 digits)
 * @param {string} otp - OTP
 * @returns {boolean} True if valid
 */
export const isValidOTP = otp => {
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
};

/**
 * Validate name (alphabets and spaces only)
 * @param {string} name - Name
 * @returns {boolean} True if valid
 */
export const isValidName = name => {
  const nameRegex = /^[a-zA-Z\s.]+$/;
  return nameRegex.test(name) && name.trim().length >= 2;
};

/**
 * Validate age
 * @param {number} age - Age
 * @returns {boolean} True if valid
 */
export const isValidAge = age => {
  const ageNum = parseInt(age, 10);
  return !isNaN(ageNum) && ageNum >= 0 && ageNum <= 150;
};

/**
 * Validate years of experience
 * @param {number} years - Years
 * @returns {boolean} True if valid
 */
export const isValidExperience = years => {
  const yearsNum = parseInt(years, 10);
  return !isNaN(yearsNum) && yearsNum >= 0 && yearsNum <= 70;
};

/**
 * Validate required field
 * @param {string} value - Field value
 * @returns {boolean} True if not empty
 */
export const isRequired = value => {
  return value !== null && value !== undefined && value.toString().trim().length > 0;
};

/**
 * Validate minimum length
 * @param {string} value - Field value
 * @param {number} minLength - Minimum length
 * @returns {boolean} True if meets minimum length
 */
export const hasMinLength = (value, minLength) => {
  return value && value.toString().length >= minLength;
};

/**
 * Validate maximum length
 * @param {string} value - Field value
 * @param {number} maxLength - Maximum length
 * @returns {boolean} True if within maximum length
 */
export const hasMaxLength = (value, maxLength) => {
  return !value || value.toString().length <= maxLength;
};

/**
 * Format mobile number with country code
 * @param {string} mobile - Mobile number
 * @returns {string} Formatted mobile number
 */
export const formatMobileWithCountryCode = mobile => {
  const cleaned = mobile.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  return cleaned.startsWith('91') ? `+${cleaned}` : `+91${cleaned}`;
};

/**
 * Sanitize input (remove special characters)
 * @param {string} input - Input string
 * @returns {string} Sanitized string
 */
export const sanitizeInput = input => {
  return input.replace(/[<>"'&]/g, '');
};
