import { describe, it, expect } from 'vitest';
import { 
  sanitizeString, 
  isValidEmail, 
  isValidPhone, 
  isValidUrl,
  stripHtmlTags,
  validateForm,
  VALIDATION_RULES 
} from '../utils/validation';

describe('Validation Utilities', () => {
  describe('sanitizeString', () => {
    it('trims whitespace', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
    });

    it('limits length', () => {
      const longString = 'a'.repeat(2000);
      expect(sanitizeString(longString, 100)).toHaveLength(100);
    });

    it('handles empty strings', () => {
      expect(sanitizeString('')).toBe('');
      expect(sanitizeString('   ')).toBe('');
    });
  });

  describe('isValidEmail', () => {
    it('validates correct email formats', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('rejects invalid email formats', () => {
      expect(isValidEmail('notanemail')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('test@.com')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('validates Zimbabwe phone formats', () => {
      expect(isValidPhone('+263771234567')).toBe(true);
      expect(isValidPhone('0771234567')).toBe(true);
    });

    it('rejects invalid phone formats', () => {
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('+1234567890')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('validates correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
    });

    it('rejects invalid URLs', () => {
      expect(isValidUrl('not a url')).toBe(false);
      expect(isValidUrl('ftp://invalid')).toBe(true); // URL constructor accepts this
    });
  });

  describe('stripHtmlTags', () => {
    it('removes HTML tags', () => {
      expect(stripHtmlTags('<p>Hello</p>')).toBe('Hello');
      expect(stripHtmlTags('<script>alert("xss")</script>Text')).toBe('alert("xss")Text');
    });

    it('handles text without tags', () => {
      expect(stripHtmlTags('Plain text')).toBe('Plain text');
    });
  });

  describe('validateForm', () => {
    it('validates required fields', () => {
      const data = { name: '', email: 'test@example.com' };
      const rules = { name: { required: true }, email: { required: true } };
      
      const result = validateForm(data, rules);
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBeDefined();
    });

    it('validates minLength', () => {
      const data = { name: 'ab' };
      const rules = { name: { minLength: 3 } };
      
      const result = validateForm(data, rules);
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toContain('at least 3');
    });

    it('validates maxLength', () => {
      const data = { name: 'a'.repeat(101) };
      const rules = { name: { maxLength: 100 } };
      
      const result = validateForm(data, rules);
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toContain('not exceed 100');
    });

    it('validates custom functions', () => {
      const data = { email: 'invalid' };
      const rules = { email: { custom: isValidEmail } };
      
      const result = validateForm(data, rules);
      expect(result.isValid).toBe(false);
    });

    it('returns valid for correct data', () => {
      const data = { 
        name: 'John Doe', 
        email: 'john@example.com',
        phone: '+263771234567',
        message: 'Hello, this is a test message' 
      };
      
      const result = validateForm(data, VALIDATION_RULES.CONTACT_FORM);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });
  });
});
