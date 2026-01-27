import React, { useEffect, useState } from 'react';
import { Search, RefreshCw, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import ServiceModal from './ServiceModal';
import { fetchAdminServices, deleteService, patchService } from '../utils/api';

interface Service {
  _id: string;
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

const ServicesManager: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAdminServices();
      // Ensure data is an array
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services. Please try again.');
      setServices([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
      await deleteService(id);
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service. Please try again.');
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await patchService(id, { isActive: !isActive });
      fetchServices();
    } catch (error) {
      console.error('Error toggling service:', error);
      alert('Failed to update service status. Please try again.');
    }
  };

  const filteredServices = Array.isArray(services) 
    ? services.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (loading) {
    return (
      <div className="list-container">
        <h1>Services Management</h1>
        <p>Loading services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="list-container">
        <h1>Services Management</h1>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>
          <button onClick={fetchServices} className="refresh-btn">
            <RefreshCw size={18} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="list-container">
      <div className="list-header">
        <div>
          <h1>Services Management</h1>
          <p>{services.length} services</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={fetchServices} className="refresh-btn">
            <RefreshCw size={18} />
            Refresh
          </button>
          <button 
            onClick={() => {
              setEditingService(null);
              setModalOpen(true);
            }}
            className="btn-primary"
          >
            <Plus size={18} />
            Add Service
          </button>
        </div>
      </div>

      <div className="list-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="services-grid">
        {filteredServices.length === 0 ? (
          <div className="empty-state">
            <p>No services found</p>
          </div>
        ) : (
          filteredServices.map(service => (
            <div key={service._id} className={`service-card ${!service.isActive ? 'inactive' : ''}`}>
              <div className="service-header">
                <div>
                  <h3>{service.title}</h3>
                  <span className="category-badge">{service.category}</span>
                </div>
                <button
                  onClick={() => toggleActive(service._id, service.isActive)}
                  className={`toggle-btn ${service.isActive ? 'active' : ''}`}
                  title={service.isActive ? 'Active' : 'Inactive'}
                >
                  {service.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              <p className="service-description">{service.description}</p>

              {service.features && service.features.length > 0 && (
                <div className="service-features">
                  <strong>Features:</strong>
                  <ul>
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                    {service.features.length > 3 && (
                      <li>+{service.features.length - 3} more...</li>
                    )}
                  </ul>
                </div>
              )}

              {service.pricing && (
                <div className="service-pricing">
                  {service.pricing.basic && <span>Basic: ${service.pricing.basic}</span>}
                  {service.pricing.standard && <span>Standard: ${service.pricing.standard}</span>}
                  {service.pricing.premium && <span>Premium: ${service.pricing.premium}</span>}
                </div>
              )}

              <div className="service-actions">
                <button
                  onClick={() => {
                    setEditingService(service);
                    setModalOpen(true);
                  }}
                  className="action-btn"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service._id)}
                  className="action-btn danger"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ServiceModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingService(null);
        }}
        service={editingService}
        onSave={() => {
          fetchServices();
          setModalOpen(false);
          setEditingService(null);
        }}
      />
    </div>
  );
};

export default ServicesManager;
