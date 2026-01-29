import React, { useState } from 'react';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { API_CONFIG } from '../config/api.config';

interface ProjectRequestData {
  name: string;
  email: string;
  phone: string;
  university: string;
  course: string;
  projectCategory: 'ready-made' | 'custom' | '';
  projectType: string;
  projectId?: string;
  customRequirements?: string;
  deadline: string;
  additionalNotes: string;
}

const ProjectRequestForm: React.FC = () => {
  const [formData, setFormData] = useState<ProjectRequestData>({
    name: '',
    email: '',
    phone: '',
    university: '',
    course: '',
    projectCategory: '',
    projectType: '',
    projectId: '',
    customRequirements: '',
    deadline: '',
    additionalNotes: ''
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
    'Network Security',
    'AI & Neural Networks',
    'Computer Vision',
    'Other'
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
    if (!formData.projectCategory) {
      setError('Please select if you want a ready-made or custom project');
      return false;
    }
    if (!formData.projectType) {
      setError('Please select a project type');
      return false;
    }
    if (formData.projectCategory === 'ready-made' && !formData.projectId?.trim()) {
      setError('Please provide the project ID for the ready-made project');
      return false;
    }
    if (formData.projectCategory === 'custom' && !formData.customRequirements?.trim()) {
      setError('Please describe your custom project requirements');
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
      const response = await fetch(getApiUrl(API_CONFIG.PUBLIC.PROJECT_REQUEST), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to submit project request');

      setSuccess(true);
      setFormData({
        name: '', email: '', phone: '', university: '', course: '',
        projectCategory: '', projectType: '', projectId: '',
        customRequirements: '', deadline: '', additionalNotes: ''
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Failed to submit request. Please contact us via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="project-request-container">
      <div className="form-header">
        <h2>Request Your Academic Project</h2>
        <p>Whether you need a ready-made project or a custom solution, we're here to help!</p>
      </div>

      <form onSubmit={handleSubmit} className="project-request-form">
        <div className="form-section">
          <h3>Student Information</h3>
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
                placeholder="e.g., NUST, UZ, HIT"
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
              placeholder="e.g., BSc Computer Science, HND Software Engineering"
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Project Selection</h3>
          <div className="form-group">
            <label>Project Category *</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="projectCategory"
                  value="ready-made"
                  checked={formData.projectCategory === 'ready-made'}
                  onChange={handleChange}
                  required
                />
                <span className="radio-label">
                  <strong>Ready-Made Project</strong>
                  <small>Pre-built projects available for immediate purchase</small>
                </span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="projectCategory"
                  value="custom"
                  checked={formData.projectCategory === 'custom'}
                  onChange={handleChange}
                  required
                />
                <span className="radio-label">
                  <strong>Custom Project</strong>
                  <small>Built specifically for your requirements</small>
                </span>
              </label>
            </div>
          </div>

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

          {formData.projectCategory === 'ready-made' && (
            <div className="form-group">
              <label htmlFor="projectId">Project ID/Name *</label>
              <input
                type="text"
                id="projectId"
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                placeholder="e.g., DS-001, ML-Smart-Home"
                required
              />
              <small className="form-hint">Enter the ID or name of the ready-made project you're interested in</small>
            </div>
          )}

          {formData.projectCategory === 'custom' && (
            <div className="form-group">
              <label htmlFor="customRequirements">Project Requirements *</label>
              <textarea
                id="customRequirements"
                name="customRequirements"
                value={formData.customRequirements}
                onChange={handleChange}
                placeholder="Describe what you need: features, technologies, specific requirements from your lecturer, etc."
                rows={6}
                required
              />
            </div>
          )}

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
            <small className="form-hint">When do you need this project by?</small>
          </div>

          <div className="form-group">
            <label htmlFor="additionalNotes">Additional Notes</label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              placeholder="Any other information we should know? Special requirements, preferences, etc."
              rows={4}
            />
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}
        {success && (
          <div className="form-success">
            Project request submitted successfully! We'll contact you within 24 hours to discuss next steps and pricing.
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
              <ShoppingCart size={20} />
              Submit Request
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ProjectRequestForm;
