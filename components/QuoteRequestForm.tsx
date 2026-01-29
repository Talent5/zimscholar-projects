import React, { useState, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { API_CONFIG, getApiUrl } from '../config/api.config';

interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  university: string;
  course: string;
  projectType: string;
  packageTier: string;
  deadline: string;
  budget: string;
  description: string;
}

interface ProjectInfo {
  projectId?: string;
  projectTitle?: string;
  projectType?: string;
}

interface QuoteRequestFormProps {
  projectInfo?: ProjectInfo;
}

const QuoteRequestForm: React.FC<QuoteRequestFormProps> = ({ projectInfo }) => {
  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    email: '',
    phone: '',
    university: '',
    course: '',
    projectType: projectInfo?.projectType || '',
    packageTier: '',
    deadline: '',
    budget: '',
    description: projectInfo?.projectTitle 
      ? `I'm interested in the project: ${projectInfo.projectTitle}${projectInfo.projectId ? ` (${projectInfo.projectId})` : ''}\n\n`
      : ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const projectTypes = [
    'Data Science',
    'Machine Learning',
    'Software Engineering',
    'IoT (Internet of Things)',
    'Mobile App Development',
    'Web Development',
    'Database Systems',
    'Other'
  ];

  const packageTiers = [
    'Basic - Simple project with minimal support',
    'Standard - Mid-range project with consultation',
    'Premium - Complex project with full support'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError('Please fill in all required contact fields');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.university.trim() || !formData.course.trim()) {
      setError('Please provide your university and course details');
      return false;
    }
    if (!formData.projectType) {
      setError('Please select a project type');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Please describe your project requirements');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(getApiUrl(API_CONFIG.PUBLIC.QUOTE_REQUEST), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to submit quote request');

      setSuccess(true);
      setFormData({
        name: '', email: '', phone: '', university: '', course: '',
        projectType: '', packageTier: '', deadline: '', budget: '', description: ''
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Failed to submit request. Please contact us via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quote-form-container">
      <div className="form-header">
        <h2>Request a Custom Project Quote</h2>
        <p>Fill in the details below and we'll get back to you with a personalized quote within 24 hours.</p>
      </div>

      <form onSubmit={handleSubmit} className="quote-form">
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone/WhatsApp *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+267 84 286 089"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="university">University/Institution *</label>
              <input
                type="text"
                id="university"
                name="university"
                value={formData.university}
                onChange={handleChange}
                placeholder="e.g., University of Zimbabwe"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="course">Course/Program *</label>
            <input
              type="text"
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              placeholder="e.g., BSc Computer Science, Diploma in Software Engineering"
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Project Details</h3>
          <div className="form-group">
            <label htmlFor="projectType">Project Type *</label>
            <select
              id="projectType"
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              required
            >
              <option value="">Select project type</option>
              {projectTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="packageTier">Preferred Package Tier</label>
            <select
              id="packageTier"
              name="packageTier"
              value={formData.packageTier}
              onChange={handleChange}
            >
              <option value="">Select package (optional)</option>
              {packageTiers.map(tier => (
                <option key={tier} value={tier}>{tier}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="deadline">Project Deadline</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="budget">Budget Range (USD)</label>
              <input
                type="text"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="e.g., $100-$200 (optional)"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Project Description & Requirements *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your project requirements, features needed, technologies to use, any specific guidelines from your institution, etc."
              rows={8}
              required
            />
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}
        {success && (
          <div className="form-success">
            Quote request submitted successfully! We'll review your requirements and send you a detailed quote within 24 hours.
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="submit-btn"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Submitting...
            </>
          ) : (
            <>
              <Send size={20} />
              Request Quote
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default QuoteRequestForm;
