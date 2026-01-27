// Validation utilities for form inputs
// Helps prevent XSS, SQL injection, and bad data

/**
 * Sanitize string input by trimming and limiting length
 */
export const sanitizeString = (input: string, maxLength: number = 1000): string => {
  if (!input) return '';
  return String(input).trim().slice(0, maxLength);
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Zimbabwe format)
 */
export const isValidPhone = (phone: string): boolean => {
  // Zimbabwe phone: +263... or 0...
  const phoneRegex = /^(\+263|0)[0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Remove potentially dangerous HTML/script tags
 */
export const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};

/**
 * Validate form data with specific rules
 */
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateForm = (
  data: Record<string, any>,
  rules: Record<string, ValidationRule>
): ValidationResult => {
  const errors: Record<string, string> = {};

  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];

    if (rule.required && (!value || String(value).trim() === '')) {
      errors[field] = `${field} is required`;
      continue;
    }

    if (value && rule.minLength && String(value).length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
    }

    if (value && rule.maxLength && String(value).length > rule.maxLength) {
      errors[field] = `${field} must not exceed ${rule.maxLength} characters`;
    }

    if (value && rule.pattern && !rule.pattern.test(String(value))) {
      errors[field] = `${field} format is invalid`;
    }

    if (value && rule.custom && !rule.custom(value)) {
      errors[field] = `${field} validation failed`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Common validation rule sets
export const VALIDATION_RULES = {
  CONTACT_FORM: {
    name: { required: true, minLength: 2, maxLength: 100 },
    email: { required: true, custom: isValidEmail },
    phone: { required: true, custom: isValidPhone },
    message: { required: true, minLength: 10, maxLength: 2000 },
  },
  QUOTE_REQUEST: {
    name: { required: true, minLength: 2, maxLength: 100 },
    email: { required: true, custom: isValidEmail },
    phone: { required: true, custom: isValidPhone },
    university: { required: true, minLength: 3, maxLength: 200 },
    course: { required: true, minLength: 2, maxLength: 200 },
    projectType: { required: true },
    description: { required: true, minLength: 20, maxLength: 3000 },
  },
};
