import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Plus, Trash2 } from 'lucide-react';

interface Service {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  features: string[];
  category: string;
  pricing: {
    basic?: number;
    standard?: number;
    premium?: number;
  };
  isActive: boolean;
  order: number;
}

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  onSave: () => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, service, onSave }) => {
  const [formData, setFormData] = useState<Service>({
    title: '',
    slug: '',
    description: '',
    icon: '',
    features: [''],
    category: 'Data Science',
    pricing: {},
    isActive: true,
    order: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (service) {
      setFormData(service);
    } else {
      setFormData({
        title: '',
        slug: '',
        description: '',
        icon: '',
        features: [''],
        category: 'Data Science',
        pricing: {},
        isActive: true,
        order: 0
      });
    }
  }, [service]);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'title' && !service) {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = service
        ? `/api/admin/services/${service._id}`
        : '/api/admin/services';
      
      const method = service ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          features: formData.features.filter(f => f.trim() !== '')
        })
      });

      if (!response.ok) throw new Error('Failed to save service');

      onSave();
    } catch (err) {
      setError('Failed to save service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{service ? 'Edit Service' : 'Add New Service'}</h2>
            <p>Manage service information displayed on the website</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Service Title *</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                required
              >
                <option value="Data Science">Data Science</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="IoT">IoT</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="slug">URL Slug</label>
            <input
              type="text"
              id="slug"
              value={formData.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              placeholder="auto-generated-from-title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label>Features</label>
            {formData.features.map((feature, index) => (
              <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  placeholder="e.g., Data visualization"
                  style={{ flex: 1 }}
                />
                {formData.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="icon-btn danger"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addFeature} className="btn-secondary small">
              <Plus size={16} />
              Add Feature
            </button>
          </div>

          <div className="form-section-title">Pricing (Optional)</div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priceBasic">Basic ($)</label>
              <input
                type="number"
                id="priceBasic"
                value={formData.pricing.basic || ''}
                onChange={(e) => handleChange('pricing', { 
                  ...formData.pricing, 
                  basic: e.target.value ? Number(e.target.value) : undefined 
                })}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="priceStandard">Standard ($)</label>
              <input
                type="number"
                id="priceStandard"
                value={formData.pricing.standard || ''}
                onChange={(e) => handleChange('pricing', { 
                  ...formData.pricing, 
                  standard: e.target.value ? Number(e.target.value) : undefined 
                })}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="pricePremium">Premium ($)</label>
              <input
                type="number"
                id="pricePremium"
                value={formData.pricing.premium || ''}
                onChange={(e) => handleChange('pricing', { 
                  ...formData.pricing, 
                  premium: e.target.value ? Number(e.target.value) : undefined 
                })}
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="order">Display Order</label>
              <input
                type="number"
                id="order"
                value={formData.order}
                onChange={(e) => handleChange('order', Number(e.target.value))}
                min="0"
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                  style={{ marginRight: '0.5rem' }}
                />
                Active (visible on website)
              </label>
            </div>
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  {service ? 'Update' : 'Create'} Service
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceModal;
