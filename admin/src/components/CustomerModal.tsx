import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail, Phone, Building2, Tag, DollarSign, Calendar, FileText, Plus, Trash2 } from 'lucide-react';
import { apiRequest } from '../utils/api';

interface Project {
  title: string;
  description: string;
  status: string;
  stage: string;
  progress: number;
  budget: number;
  actualCost: number;
  startDate: string;
  endDate: string;
}

interface CustomerModalProps {
  customer?: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const CustomerModal: React.FC<CustomerModalProps> = ({ customer, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    university: '',
    status: 'lead' as 'lead' | 'active' | 'inactive' | 'vip',
    source: 'website' as 'website' | 'phone' | 'email' | 'whatsapp' | 'referral' | 'social_media' | 'walk_in' | 'other',
    outstandingBalance: 0
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        university: customer.university || '',
        status: customer.status || 'lead',
        source: customer.source || 'website',
        outstandingBalance: customer.outstandingBalance || 0
      });
      
      // Format projects with proper date handling
      const formattedProjects = (customer.projects || []).map((p: any) => ({
        title: p.title || '',
        description: p.description || '',
        status: p.status || 'inquiry',
        stage: p.stage || 'requirements',
        progress: p.progress || 0,
        budget: p.budget || 0,
        actualCost: p.actualCost || 0,
        startDate: p.startDate ? new Date(p.startDate).toISOString().split('T')[0] : '',
        endDate: p.endDate ? new Date(p.endDate).toISOString().split('T')[0] : ''
      }));
      
      setProjects(formattedProjects.length > 0 ? formattedProjects : [{
        title: '',
        description: '',
        status: 'inquiry',
        stage: 'requirements',
        progress: 0,
        budget: 0,
        actualCost: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
      }]);
    } else {
      // Reset form for new customer
      setFormData({
        name: '',
        email: '',
        phone: '',
        university: '',
        status: 'lead',
        source: 'website',
        outstandingBalance: 0
      });
      setProjects([{
        title: '',
        description: '',
        status: 'inquiry',
        stage: 'requirements',
        progress: 0,
        budget: 0,
        actualCost: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
      }]);
    }
  }, [customer, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out projects that don't have at least a title and budget
    const validProjects = projects.filter(p => p.title && p.budget > 0);

    if (validProjects.length === 0) {
      alert('Please add at least one project with a title and budget');
      return;
    }

    setLoading(true);
    try {
      // Ensure dates are properly formatted before sending
      const formattedProjects = validProjects.map(p => ({
        ...p,
        startDate: p.startDate || null,
        endDate: p.endDate || null
      }));

      const payload = {
        ...formData,
        projects: formattedProjects
      };

      console.log('Saving customer with payload:', payload);

      const url = customer?._id 
        ? `/api/admin/customers/${customer._id}` 
        : '/api/admin/customers';
      
      const method = customer?._id ? 'PUT' : 'POST';

      const response = await apiRequest(url, {
        method,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save customer');
      }

      const savedCustomer = await response.json();
      console.log('Customer saved successfully:', savedCustomer);

      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error saving customer:', error);
      alert(error.message || 'Failed to save customer');
    } finally {
      setLoading(false);
    }
  };

  const addProject = () => {
    setProjects([...projects, {
      title: '',
      description: '',
      status: 'inquiry',
      stage: 'requirements',
      progress: 0,
      budget: 0,
      actualCost: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: ''
    }]);
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, field: string, value: any) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }} onClick={onClose}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column'
      }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '1.5rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'white'
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>
              {customer ? 'Edit Customer' : 'Add New Customer'}
            </h2>
            <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: '0.25rem 0 0 0' }}>
              {customer ? 'Update customer information and projects' : 'Enter customer details and project information'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: 'white'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} style={{
          flex: 1,
          overflowY: 'auto',
          padding: '2rem'
        }}>
          {/* Customer Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
              Customer Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  <User size={16} />
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  <Mail size={16} />
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  <Phone size={16} />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="+263771234567"
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  <Building2 size={16} />
                  University/Company
                </label>
                <input
                  type="text"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="University of Zimbabwe"
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  <Tag size={16} />
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    background: 'white'
                  }}
                >
                  <option value="lead">Lead</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  <Tag size={16} />
                  Source
                </label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    background: 'white'
                  }}
                >
                  <option value="website">Website</option>
                  <option value="phone">Phone Call</option>
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="referral">Referral</option>
                  <option value="social_media">Social Media</option>
                  <option value="walk_in">Walk-in</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Projects */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
                Projects
              </h3>
              <button
                type="button"
                onClick={addProject}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                <Plus size={16} />
                Add Project
              </button>
            </div>

            {projects.map((project, index) => (
              <div key={index} style={{
                background: '#f9fafb',
                padding: '1.5rem',
                borderRadius: '12px',
                marginBottom: '1rem',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', margin: 0 }}>
                    Project {index + 1}
                  </h4>
                  {projects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProject(index)}
                      style={{
                        padding: '0.375rem',
                        background: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      <FileText size={16} />
                      Project Title *
                    </label>
                    <input
                      type="text"
                      value={project.title}
                      onChange={(e) => updateProject(index, 'title', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        background: 'white'
                      }}
                      placeholder="E.g., Student Management System"
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>
                      Description
                    </label>
                    <textarea
                      value={project.description}
                      onChange={(e) => updateProject(index, 'description', e.target.value)}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        background: 'white',
                        resize: 'vertical'
                      }}
                      placeholder="Brief description of the project..."
                    />
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      <DollarSign size={16} />
                      Total Price Charged (USD) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={project.budget}
                      onChange={(e) => updateProject(index, 'budget', parseFloat(e.target.value) || 0)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        background: 'white'
                      }}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      <Tag size={16} />
                      Project Status
                    </label>
                    <select
                      value={project.status}
                      onChange={(e) => updateProject(index, 'status', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        background: 'white'
                      }}
                    >
                      <option value="inquiry">Inquiry</option>
                      <option value="quotation-sent">Quotation Sent</option>
                      <option value="accepted">Accepted</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="completed">Completed</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      <Calendar size={16} />
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={project.startDate}
                      onChange={(e) => updateProject(index, 'startDate', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        background: 'white'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      <Calendar size={16} />
                      Expected End Date
                    </label>
                    <input
                      type="date"
                      value={project.endDate}
                      onChange={(e) => updateProject(index, 'endDate', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        background: 'white'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e5e7eb'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              <Save size={16} />
              {loading ? 'Saving...' : 'Save Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;
