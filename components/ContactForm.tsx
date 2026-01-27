import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { getApiUrl, API_CONFIG } from '../config/api.config';
import { validateForm, VALIDATION_RULES } from '../utils/validation';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateContactForm = (): boolean => {
    const validation = validateForm(formData, VALIDATION_RULES.CONTACT_FORM);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      setError(Object.values(validation.errors)[0]); // Show first error as general error
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateContactForm()) return;

    setLoading(true);
    setError('');
    setErrors({});

    try {
      const response = await fetch(getApiUrl(API_CONFIG.PUBLIC.CONTACT), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit form');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try WhatsApp instead.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form-container">
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Tinashe Moyo"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone/WhatsApp *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+263 77 123 4567"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Your Message *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us how we can help you..."
            rows={6}
            required
          />
        </div>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">Message sent successfully! We'll get back to you soon.</div>}

        <Button
          type="submit"
          disabled={loading}
          className="submit-btn"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Sending...
            </>
          ) : (
            <>
              <Send size={20} />
              Send Message
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
