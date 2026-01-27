// Input validation middleware for Express
// Validates and sanitizes incoming request data

/**
 * Sanitize string input
 */
const sanitizeString = (str, maxLength = 1000) => {
  if (!str) return '';
  return String(str).trim().slice(0, maxLength);
};

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number
 */
const isValidPhone = (phone) => {
  const phoneRegex = /^(\+263|0)[0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Generic validator middleware factory
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];

      // Required check
      if (rules.required && (!value || String(value).trim() === '')) {
        errors.push(`${field} is required`);
        continue;
      }

      // Skip further validation if field is optional and empty
      if (!rules.required && !value) continue;

      // Type check
      if (rules.type === 'email' && !isValidEmail(value)) {
        errors.push(`${field} must be a valid email address`);
      }

      if (rules.type === 'phone' && !isValidPhone(value)) {
        errors.push(`${field} must be a valid phone number`);
      }

      // Length checks
      if (rules.minLength && String(value).length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`);
      }

      if (rules.maxLength && String(value).length > rules.maxLength) {
        errors.push(`${field} must not exceed ${rules.maxLength} characters`);
      }

      // Custom validation
      if (rules.custom && !rules.custom(value)) {
        errors.push(`${field} validation failed`);
      }

      // Sanitize string fields
      if (typeof value === 'string' && rules.sanitize !== false) {
        req.body[field] = sanitizeString(value, rules.maxLength || 1000);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
    }

    next();
  };
};

// Validation schemas for different endpoints
export const contactFormValidation = validate({
  name: { required: true, minLength: 2, maxLength: 100 },
  email: { required: true, type: 'email' },
  phone: { required: true, type: 'phone' },
  message: { required: true, minLength: 10, maxLength: 2000 },
});

export const quoteRequestValidation = validate({
  name: { required: true, minLength: 2, maxLength: 100 },
  email: { required: true, type: 'email' },
  phone: { required: true, type: 'phone' },
  university: { required: true, minLength: 3, maxLength: 200 },
  course: { required: true, minLength: 2, maxLength: 200 },
  projectType: { required: true, maxLength: 100 },
  description: { required: true, minLength: 20, maxLength: 3000 },
  packageTier: { required: false, maxLength: 50 },
  budget: { required: false, maxLength: 50 },
});

export const projectRequestValidation = validate({
  name: { required: true, minLength: 2, maxLength: 100 },
  email: { required: true, type: 'email' },
  phone: { required: true, type: 'phone' },
  university: { required: true, minLength: 3, maxLength: 200 },
  course: { required: true, minLength: 2, maxLength: 200 },
  projectCategory: { required: true, custom: (val) => ['ready-made', 'custom'].includes(val) },
  projectType: { required: true, maxLength: 100 },
  customRequirements: { required: false, maxLength: 3000 },
  additionalNotes: { required: false, maxLength: 2000 },
});

export const serviceValidation = validate({
  title: { required: true, minLength: 3, maxLength: 200 },
  slug: { required: true, minLength: 3, maxLength: 200 },
  description: { required: true, minLength: 10, maxLength: 1000 },
  category: { required: true, maxLength: 100 },
  features: { required: true, custom: (val) => Array.isArray(val) && val.length > 0 },
});
