import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Star } from 'lucide-react';
import { getApiUrl, getFileUrl, API_CONFIG } from '../config/api.config';

interface PortfolioProject {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  projectType: 'ready-made' | 'custom-showcase';
  projectId?: string;
  thumbnail: string;
  videoUrl?: string;
  technologies: string[];
  price?: number;
  isAvailable: boolean;
  isFeatured: boolean;
  demoUrl?: string;
  githubRepo?: string;
}

const Portfolio: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const ensureHttps = (url: string) => {
    if (!url) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  useEffect(() => {
    fetchProjects();
  }, [categoryFilter]);

  const fetchProjects = async () => {
    try {
      const url = categoryFilter === 'all'
        ? getApiUrl(API_CONFIG.PUBLIC.PORTFOLIO)
        : `${getApiUrl(API_CONFIG.PUBLIC.PORTFOLIO)}?category=${categoryFilter}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'all',
    'Data Science',
    'Machine Learning',
    'Software Engineering',
    'IoT',
    'Web Development',
    'Mobile App'
  ];

  if (loading) {
    return (
      <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <section style={{ padding: '4rem 1rem', background: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
            Our Portfolio
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
            Explore our completed projects and ready-made solutions
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: '0.625rem 1.25rem',
                background: categoryFilter === cat ? '#4f46e5' : 'white',
                color: categoryFilter === cat ? 'white' : '#6b7280',
                border: '1px solid',
                borderColor: categoryFilter === cat ? '#4f46e5' : '#d1d5db',
                borderRadius: '8px',
                fontSize: '0.9375rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {cat === 'all' ? 'All Projects' : cat}
            </button>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '2rem'
        }}>
          {projects.map(project => (
            <div
              key={project._id}
              style={{
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {project.thumbnail && !project.videoUrl && (
                <div style={{
                  width: '100%',
                  height: '200px',
                  background: '#f3f4f6',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <img
                    src={getFileUrl(project.thumbnail)}
                    alt={project.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {project.isFeatured && (
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: '#fbbf24',
                      color: 'white',
                      padding: '0.5rem',
                      borderRadius: '50%'
                    }}>
                      <Star size={18} fill="white" />
                    </div>
                  )}
                </div>
              )}

              {project.videoUrl && (
                <div style={{
                  width: '100%',
                  height: '200px',
                  background: '#000',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <video
                    src={getFileUrl(project.videoUrl)}
                    controls
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    poster={project.thumbnail ? getFileUrl(project.thumbnail) : undefined}
                  />
                  {project.isFeatured && (
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: '#fbbf24',
                      color: 'white',
                      padding: '0.5rem',
                      borderRadius: '50%',
                      zIndex: 10
                    }}>
                      <Star size={18} fill="white" />
                    </div>
                  )}
                </div>
              )}

              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    background: '#dbeafe',
                    color: '#1e40af',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {project.category}
                  </span>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    background: project.projectType === 'ready-made' ? '#d1fae5' : '#dbeafe',
                    color: project.projectType === 'ready-made' ? '#065f46' : '#1e3a8a',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {project.projectType === 'ready-made' ? 'Ready-Made' : 'Showcase'}
                  </span>
                  {project.projectId && (
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      background: '#f3f4f6',
                      color: '#374151',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      fontFamily: 'monospace'
                    }}>
                      {project.projectId}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', marginBottom: '0.75rem' }}>
                  {project.title}
                </h3>

                <p style={{ color: '#6b7280', fontSize: '0.9375rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                  {project.description.length > 120
                    ? `${project.description.substring(0, 120)}...`
                    : project.description
                  }
                </p>

                {project.technologies && project.technologies.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {project.technologies.slice(0, 4).map((tech, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: '0.375rem 0.75rem',
                          background: '#f3f4f6',
                          color: '#374151',
                          borderRadius: '4px',
                          fontSize: '0.8125rem',
                          fontWeight: '500'
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span style={{
                        padding: '0.375rem 0.75rem',
                        background: '#f3f4f6',
                        color: '#374151',
                        borderRadius: '4px',
                        fontSize: '0.8125rem',
                        fontWeight: '500'
                      }}>
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {project.projectType === 'ready-made' && project.price && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>
                      ${project.price}
                    </span>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      background: project.isAvailable ? '#d1fae5' : '#fee2e2',
                      color: project.isAvailable ? '#065f46' : '#991b1b',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {project.isAvailable ? 'Available' : 'Sold'}
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    onClick={() => navigate(`/portfolio/${project.slug}`)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#4f46e5',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9375rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#4338ca'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#4f46e5'}
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => navigate('/quote', {
                      state: {
                        projectId: project.projectId,
                        projectTitle: project.title,
                        projectType: project.category
                      }
                    })}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: 'white',
                      color: '#4f46e5',
                      border: '2px solid #4f46e5',
                      borderRadius: '8px',
                      fontSize: '0.9375rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#4f46e5';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.color = '#4f46e5';
                    }}
                  >
                    Request Quote
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  {project.demoUrl && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(ensureHttps(project.demoUrl!), '_blank', 'noopener,noreferrer');
                      }}
                      title="View Demo"
                      style={{
                        flex: 1,
                        padding: '0.625rem',
                        background: 'white',
                        color: '#4f46e5',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      <ExternalLink size={16} />
                      Demo
                    </button>
                  )}
                  {project.githubRepo && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(ensureHttps(project.githubRepo!), '_blank', 'noopener,noreferrer');
                      }}
                      title="View on GitHub"
                      style={{
                        flex: 1,
                        padding: '0.625rem',
                        background: '#24292e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                      </svg>
                      GitHub
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            <p>No projects found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
