import React, { useEffect, useState } from 'react';
import { Search, RefreshCw, Plus, Edit, Trash2, Eye, EyeOff, Star, Upload } from 'lucide-react';
import ProjectModal from './ProjectModal';
import { fetchAdminPortfolio, deletePortfolioProject, patchPortfolioProject } from '../utils/api';

interface PortfolioProject {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  projectType: 'ready-made' | 'custom-showcase';
  projectId?: string;
  thumbnail: string;
  technologies: string[];
  features: string[];
  price?: number;
  isAvailable: boolean;
  isActive: boolean;
  isFeatured: boolean;
  viewCount: number;
  githubRepo?: string;
}

const PortfolioManager: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAdminPortfolio();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load portfolio projects. Please try again.');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await deletePortfolioProject(id);
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await patchPortfolioProject(id, { isActive: !isActive });
      fetchProjects();
    } catch (error) {
      console.error('Error toggling project:', error);
      alert('Failed to update project status. Please try again.');
    }
  };

  const toggleFeatured = async (id: string, isFeatured: boolean) => {
    try {
      await patchPortfolioProject(id, { isFeatured: !isFeatured });
      fetchProjects();
    } catch (error) {
      console.error('Error toggling featured:', error);
      alert('Failed to update featured status. Please try again.');
    }
  };

  const filteredProjects = Array.isArray(projects) ? projects.filter(project => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  }) : [];

  if (loading) {
    return (
      <div className="list-container">
        <h1>Portfolio Management</h1>
        <p>Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="list-container">
        <h1>Portfolio Management</h1>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>
          <button onClick={fetchProjects} className="refresh-btn">
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
          <h1>Portfolio Projects</h1>
          <p>{projects.length} projects</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={fetchProjects} className="refresh-btn">
            <RefreshCw size={18} />
            Refresh
          </button>
          <button
            onClick={() => {
              setEditingProject(null);
              setModalOpen(true);
            }}
            className="btn-primary"
          >
            <Plus size={18} />
            Add Project
          </button>
        </div>
      </div>

      <div className="list-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          <option value="Data Science">Data Science</option>
          <option value="Machine Learning">Machine Learning</option>
          <option value="Software Engineering">Software Engineering</option>
          <option value="IoT">IoT</option>
          <option value="Web Development">Web Development</option>
          <option value="Mobile App">Mobile App</option>
        </select>
      </div>

      <div className="portfolio-grid">
        {filteredProjects.length === 0 ? (
          <div className="empty-state">
            <p>No projects found</p>
          </div>
        ) : (
          filteredProjects.map(project => (
            <div key={project._id} className={`portfolio-card ${!project.isActive ? 'inactive' : ''}`}>
              {project.thumbnail && (
                <div className="portfolio-thumbnail">
                  <img src={project.thumbnail} alt={project.title} />
                </div>
              )}
              
              <div className="portfolio-content">
                <div className="portfolio-header">
                  <div>
                    <h3>{project.title}</h3>
                    <div className="portfolio-badges">
                      <span className="category-badge">{project.category}</span>
                      <span className={`type-badge ${project.projectType}`}>
                        {project.projectType === 'ready-made' ? 'Ready-Made' : 'Showcase'}
                      </span>
                      {project.projectId && (
                        <span className="id-badge">ID: {project.projectId}</span>
                      )}
                    </div>
                  </div>
                  <div className="portfolio-icons">
                    <button
                      onClick={() => toggleFeatured(project._id, project.isFeatured)}
                      className={`icon-btn ${project.isFeatured ? 'featured' : ''}`}
                      title="Featured"
                    >
                      <Star size={18} fill={project.isFeatured ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => toggleActive(project._id, project.isActive)}
                      className={`icon-btn ${project.isActive ? 'active' : ''}`}
                      title={project.isActive ? 'Active' : 'Inactive'}
                    >
                      {project.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </div>

                <p className="portfolio-description">{project.description}</p>

                {project.technologies && project.technologies.length > 0 && (
                  <div className="tech-tags">
                    {project.technologies.slice(0, 4).map((tech, idx) => (
                      <span key={idx} className="tech-tag">{tech}</span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="tech-tag">+{project.technologies.length - 4}</span>
                    )}
                  </div>
                )}

                {project.price && (
                  <div className="portfolio-price">
                    <strong>${project.price}</strong>
                    {project.isAvailable ? (
                      <span className="available">Available</span>
                    ) : (
                      <span className="sold">Sold</span>
                    )}
                  </div>
                )}

                <div className="portfolio-stats">
                  <span>👁️ {project.viewCount} views</span>
                </div>

                <div className="portfolio-actions">
                  <button
                    onClick={() => {
                      setEditingProject(project);
                      setModalOpen(true);
                    }}
                    className="action-btn"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="action-btn danger"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ProjectModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProject(null);
        }}
        project={editingProject}
        onSave={() => {
          fetchProjects();
          setModalOpen(false);
          setEditingProject(null);
        }}
      />
    </div>
  );
};

export default PortfolioManager;
