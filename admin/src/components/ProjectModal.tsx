import React, { useState, useEffect } from 'react';
import { X, Loader2, Plus, Trash2, Upload, Image as ImageIcon, Video, FileText, DollarSign, Award, Calendar, GraduationCap, Link as LinkIcon, Eye, Star, Hash, Folder, Check } from 'lucide-react';
import { apiRequest } from '../../../config/api.config';

interface PortfolioProject {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  projectType: 'ready-made' | 'custom-showcase';
  projectId?: string;
  thumbnail: string;
  videoUrl?: string;
  technologies: string[];
  features: string[];
  price?: number;
  isAvailable: boolean;
  demoUrl?: string;
  githubRepo?: string;
  university?: string;
  yearCompleted?: number;
  grade?: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: PortfolioProject | null;
  onSave: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, project, onSave }) => {
  const [formData, setFormData] = useState<PortfolioProject>({
    title: '',
    slug: '',
    description: '',
    category: 'Data Science',
    projectType: 'ready-made',
    thumbnail: '',
    technologies: [''],
    features: [''],
    isAvailable: true,
    isActive: true,
    isFeatured: false,
    order: 0
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'details' | 'settings'>('basic');

  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData({
        title: '',
        slug: '',
        description: '',
        category: 'Data Science',
        projectType: 'ready-made',
        thumbnail: '',
        technologies: [''],
        features: [''],
        isAvailable: true,
        isActive: true,
        isFeatured: false,
        order: 0
      });
    }
    setThumbnailFile(null);
    setVideoFile(null);
    setThumbnailPreview('');
    setActiveTab('basic');
    setError('');
  }, [project, isOpen]);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'title' && !project) {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  const handleArrayChange = (field: 'technologies' | 'features', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field: 'technologies' | 'features') => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field: 'technologies' | 'features', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
      const formDataToSend = new FormData();
      
      // Add text fields
      Object.keys(formData).forEach(key => {
        const value = formData[key as keyof PortfolioProject];
        if (key === 'technologies' || key === 'features') {
          formDataToSend.append(key, JSON.stringify((value as string[]).filter(v => v.trim() !== '')));
        } else if (value !== undefined && value !== null) {
          formDataToSend.append(key, String(value));
        }
      });

      // Add files
      if (thumbnailFile) formDataToSend.append('thumbnail', thumbnailFile);
      if (videoFile) formDataToSend.append('videoFile', videoFile);

      const url = project
        ? `/api/admin/portfolio/${project._id}`
        : '/api/admin/portfolio';
      
      const method = project ? 'PUT' : 'POST';

      const response = await apiRequest(url, {
        method,
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to save project');
      }

      onSave();
      onClose();
    } catch (err: any) {
      console.error('Project save error:', err);
      setError(err.message || 'Failed to save project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '2rem'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'white',
          borderRadius: '16px',
          maxWidth: '1000px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white',
          padding: '2rem',
          position: 'relative'
        }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              {project ? '✏️ Edit Project' : '✨ Create New Project'}
            </h2>
            <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>
              {project ? 'Update project details and media files' : 'Add a stunning project to your portfolio'}
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '0', 
          borderBottom: '2px solid #e5e7eb',
          background: '#f9fafb',
          padding: '0 2rem'
        }}>
          {[
            { id: 'basic', label: 'Basic Info', icon: FileText },
            { id: 'media', label: 'Media Files', icon: ImageIcon },
            { id: 'details', label: 'Details', icon: Award },
            { id: 'settings', label: 'Settings', icon: Eye }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 1.5rem',
                background: activeTab === tab.id ? 'white' : 'transparent',
                color: activeTab === tab.id ? '#667eea' : '#6b7280',
                border: 'none',
                borderBottom: activeTab === tab.id ? '3px solid #667eea' : '3px solid transparent',
                fontWeight: activeTab === tab.id ? '600' : '500',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Content - Scrollable */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          <form onSubmit={handleSubmit} id="project-form">
            {/* BASIC INFO TAB */}
            {activeTab === 'basic' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)', 
                  padding: '1rem 1.5rem', 
                  borderRadius: '12px',
                  borderLeft: '4px solid #667eea'
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem', color: '#1f2937' }}>
                    📝 Project Information
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Enter the main details about your project
                  </p>
                </div>

                <div>
                  <label htmlFor="title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                    <Folder size={16} color="#667eea" />
                    Project Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="e.g., Smart Home Automation System"
                    required
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      fontSize: '0.95rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      transition: 'all 0.2s',
                      outline: 'none'
                    }}
                  />
                  {project && formData.projectId && (
                    <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#667eea', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Hash size={14} />
                      Project ID: <strong style={{ fontFamily: 'monospace' }}>{formData.projectId}</strong>
                    </p>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label htmlFor="category" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                      <Award size={16} color="#667eea" />
                      Category *
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        fontSize: '0.95rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px',
                        background: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Data Science">📊 Data Science</option>
                      <option value="Machine Learning">🤖 Machine Learning</option>
                      <option value="Software Engineering">💻 Software Engineering</option>
                      <option value="IoT">🌐 IoT</option>
                      <option value="Web Development">🌍 Web Development</option>
                      <option value="Mobile App">📱 Mobile App</option>
                      <option value="Database">🗄️ Database</option>
                      <option value="AI">🧠 AI</option>
                      <option value="Other">📂 Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="projectType" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                      <Star size={16} color="#667eea" />
                      Project Type *
                    </label>
                    <select
                      id="projectType"
                      value={formData.projectType}
                      onChange={(e) => handleChange('projectType', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        fontSize: '0.95rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px',
                        background: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="ready-made">💼 Ready-Made (For Sale)</option>
                      <option value="custom-showcase">🎨 Custom Showcase</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                    <FileText size={16} color="#667eea" />
                    Project Description *
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={5}
                    placeholder="Describe your project in detail... What does it do? What problems does it solve?"
                    required
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      fontSize: '0.95rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      resize: 'vertical',
                      lineHeight: '1.6',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                    ⚙️ Technologies Used
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {formData.technologies.map((tech, index) => (
                      <div key={index} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={tech}
                          onChange={(e) => handleArrayChange('technologies', index, e.target.value)}
                          placeholder="e.g., Python, React, TensorFlow, MongoDB"
                          style={{
                            flex: 1,
                            padding: '0.875rem 1rem',
                            fontSize: '0.95rem',
                            border: '2px solid #e5e7eb',
                            borderRadius: '10px'
                          }}
                        />
                        {formData.technologies.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem('technologies', index)}
                            style={{
                              padding: '0.875rem',
                              background: '#fee2e2',
                              color: '#dc2626',
                              border: 'none',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={() => addArrayItem('technologies')} 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.875rem 1.5rem',
                        background: '#f3f4f6',
                        color: '#667eea',
                        border: '2px dashed #d1d5db',
                        borderRadius: '10px',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Plus size={18} />
                      Add Another Technology
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                    ✨ Key Features
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {formData.features.map((feature, index) => (
                      <div key={index} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleArrayChange('features', index, e.target.value)}
                          placeholder="e.g., Real-time data visualization, User authentication"
                          style={{
                            flex: 1,
                            padding: '0.875rem 1rem',
                            fontSize: '0.95rem',
                            border: '2px solid #e5e7eb',
                            borderRadius: '10px'
                          }}
                        />
                        {formData.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem('features', index)}
                            style={{
                              padding: '0.875rem',
                              background: '#fee2e2',
                              color: '#dc2626',
                              border: 'none',
                              borderRadius: '10px',
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={() => addArrayItem('features')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.875rem 1.5rem',
                        background: '#f3f4f6',
                        color: '#667eea',
                        border: '2px dashed #d1d5db',
                        borderRadius: '10px',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      <Plus size={18} />
                      Add Another Feature
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MEDIA TAB */}
            {activeTab === 'media' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)', 
                  padding: '1rem 1.5rem', 
                  borderRadius: '12px',
                  borderLeft: '4px solid #667eea'
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem', color: '#1f2937' }}>
                    🎨 Media & Files
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Upload images, videos, and project files
                  </p>
                </div>

                {/* Thumbnail Upload */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                    <ImageIcon size={16} color="#667eea" />
                    Project Thumbnail *
                  </label>
                  <div style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '12px',
                    padding: '2rem',
                    textAlign: 'center',
                    background: thumbnailPreview || formData.thumbnail ? '#f9fafb' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}>
                    {(thumbnailPreview || formData.thumbnail) ? (
                      <div style={{ position: 'relative' }}>
                        <img 
                          src={thumbnailPreview || formData.thumbnail} 
                          alt="Preview" 
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: '300px', 
                            borderRadius: '8px',
                            margin: '0 auto',
                            display: 'block'
                          }} 
                        />
                        <div style={{ marginTop: '1rem' }}>
                          <label htmlFor="thumbnail" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            background: '#667eea',
                            color: 'white',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.95rem'
                          }}>
                            <Upload size={18} />
                            Change Image
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label htmlFor="thumbnail" style={{ cursor: 'pointer', display: 'block' }}>
                        <ImageIcon size={48} color="#667eea" style={{ margin: '0 auto 1rem' }} />
                        <p style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                          Click to upload thumbnail
                        </p>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          PNG, JPG up to 10MB
                        </p>
                      </label>
                    )}
                    <input
                      type="file"
                      id="thumbnail"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>

                {/* Video Upload */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                    <Video size={16} color="#667eea" />
                    Project Video (Optional)
                  </label>
                  <div style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '12px',
                    padding: '2rem',
                    textAlign: 'center',
                    background: videoFile || formData.videoUrl ? '#f0fdf4' : 'white',
                    cursor: 'pointer'
                  }}>
                    {videoFile ? (
                      <div>
                        <Video size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
                        <p style={{ fontSize: '1rem', fontWeight: '600', color: '#059669', marginBottom: '0.5rem' }}>
                          ✓ {videoFile.name}
                        </p>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                          {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <label htmlFor="videoFile" style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.75rem 1.5rem',
                          background: '#10b981',
                          color: 'white',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}>
                          <Upload size={18} />
                          Change Video
                        </label>
                      </div>
                    ) : formData.videoUrl ? (
                      <div>
                        <Video size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
                        <p style={{ fontSize: '1rem', fontWeight: '600', color: '#059669', marginBottom: '1rem' }}>
                          ✓ Video already uploaded
                        </p>
                        <label htmlFor="videoFile" style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.75rem 1.5rem',
                          background: '#667eea',
                          color: 'white',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}>
                          <Upload size={18} />
                          Replace Video
                        </label>
                      </div>
                    ) : (
                      <label htmlFor="videoFile">
                        <Video size={48} color="#667eea" style={{ margin: '0 auto 1rem' }} />
                        <p style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                          Upload demo video
                        </p>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          MP4, WebM up to 100MB
                        </p>
                      </label>
                    )}
                    <input
                      type="file"
                      id="videoFile"
                      accept="video/*"
                      onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>

                {/* GitHub Repository */}
                <div>
                  <label htmlFor="githubRepo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                    <LinkIcon size={16} color="#667eea" />
                    GitHub Repository
                  </label>
                  <input
                    type="url"
                    id="githubRepo"
                    value={formData.githubRepo || ''}
                    onChange={(e) => handleChange('githubRepo', e.target.value)}
                    placeholder="https://github.com/username/repository"
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      fontSize: '1rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      transition: 'all 0.2s',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                  <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
                    Link to the project's GitHub repository instead of uploading files
                  </p>
                </div>
              </div>
            )}

            {/* DETAILS TAB */}
            {activeTab === 'details' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)', 
                  padding: '1rem 1.5rem', 
                  borderRadius: '12px',
                  borderLeft: '4px solid #667eea'
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem', color: '#1f2937' }}>
                    📋 Additional Details
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Pricing, academic info, and external links
                  </p>
                </div>

                {formData.projectType === 'ready-made' && (
                  <div style={{
                    background: '#fef3c7',
                    border: '2px solid #fbbf24',
                    borderRadius: '12px',
                    padding: '1.5rem'
                  }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', marginBottom: '1rem', color: '#92400e' }}>
                      <DollarSign size={18} />
                      Pricing Information
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                      <div>
                        <label htmlFor="price" style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block', fontSize: '0.95rem' }}>
                          Price (USD)
                        </label>
                        <input
                          type="number"
                          id="price"
                          value={formData.price || ''}
                          onChange={(e) => handleChange('price', e.target.value ? Number(e.target.value) : undefined)}
                          min="0"
                          placeholder="99.99"
                          style={{
                            width: '100%',
                            padding: '0.875rem 1rem',
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            border: '2px solid #fbbf24',
                            borderRadius: '10px',
                            background: 'white'
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'end' }}>
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.875rem 1rem',
                          background: 'white',
                          border: '2px solid #fbbf24',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '0.95rem'
                        }}>
                          <input
                            type="checkbox"
                            checked={formData.isAvailable}
                            onChange={(e) => handleChange('isAvailable', e.target.checked)}
                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                          />
                          Available
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label htmlFor="university" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                      <GraduationCap size={16} color="#667eea" />
                      University
                    </label>
                    <input
                      type="text"
                      id="university"
                      value={formData.university || ''}
                      onChange={(e) => handleChange('university', e.target.value)}
                      placeholder="University of Zimbabwe"
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        fontSize: '0.95rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px'
                      }}
                    />
                  </div>

                  <div>
                    <label htmlFor="yearCompleted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                      <Calendar size={16} color="#667eea" />
                      Year
                    </label>
                    <input
                      type="number"
                      id="yearCompleted"
                      value={formData.yearCompleted || ''}
                      onChange={(e) => handleChange('yearCompleted', e.target.value ? Number(e.target.value) : undefined)}
                      min="2000"
                      max={new Date().getFullYear()}
                      placeholder="2024"
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        fontSize: '0.95rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px'
                      }}
                    />
                  </div>

                  <div>
                    <label htmlFor="grade" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                      <Award size={16} color="#667eea" />
                      Grade
                    </label>
                    <input
                      type="text"
                      id="grade"
                      value={formData.grade || ''}
                      onChange={(e) => handleChange('grade', e.target.value)}
                      placeholder="A, 75%, Distinction"
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        fontSize: '0.95rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label htmlFor="demoUrl" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                      <LinkIcon size={16} color="#667eea" />
                      Demo URL
                    </label>
                    <input
                      type="url"
                      id="demoUrl"
                      value={formData.demoUrl || ''}
                      onChange={(e) => handleChange('demoUrl', e.target.value)}
                      placeholder="https://demo.example.com"
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        fontSize: '0.95rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px',
                        fontFamily: 'monospace'
                      }}
                    />
                  </div>

                  <div>
                    <label htmlFor="order" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                      Display Order
                    </label>
                    <input
                      type="number"
                      id="order"
                      value={formData.order}
                      onChange={(e) => handleChange('order', Number(e.target.value))}
                      min="0"
                      placeholder="0"
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        fontSize: '0.95rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)', 
                  padding: '1rem 1.5rem', 
                  borderRadius: '12px',
                  borderLeft: '4px solid #667eea'
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem', color: '#1f2937' }}>
                    ⚙️ Visibility Settings
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Control how and where your project appears
                  </p>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1.5rem'
                }}>
                  <div
                    onClick={() => handleChange('isActive', !formData.isActive)}
                    style={{
                      padding: '2rem',
                      background: formData.isActive ? 'linear-gradient(135deg, #d1fae5, #a7f3d0)' : '#f3f4f6',
                      border: `3px solid ${formData.isActive ? '#10b981' : '#d1d5db'}`,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{
                      width: '64px',
                      height: '64px',
                      background: formData.isActive ? '#10b981' : '#9ca3af',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem',
                      color: 'white'
                    }}>
                      {formData.isActive ? <Eye size={32} /> : <Eye size={32} />}
                    </div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: formData.isActive ? '#065f46' : '#4b5563' }}>
                      {formData.isActive ? 'Active' : 'Inactive'}
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: formData.isActive ? '#059669' : '#6b7280' }}>
                      {formData.isActive ? 'Visible on website' : 'Hidden from website'}
                    </p>
                  </div>

                  <div
                    onClick={() => handleChange('isFeatured', !formData.isFeatured)}
                    style={{
                      padding: '2rem',
                      background: formData.isFeatured ? 'linear-gradient(135deg, #fef3c7, #fde68a)' : '#f3f4f6',
                      border: `3px solid ${formData.isFeatured ? '#f59e0b' : '#d1d5db'}`,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{
                      width: '64px',
                      height: '64px',
                      background: formData.isFeatured ? '#f59e0b' : '#9ca3af',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem',
                      color: 'white'
                    }}>
                      <Star size={32} fill={formData.isFeatured ? 'white' : 'none'} />
                    </div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: formData.isFeatured ? '#92400e' : '#4b5563' }}>
                      {formData.isFeatured ? 'Featured' : 'Regular'}
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: formData.isFeatured ? '#b45309' : '#6b7280' }}>
                      {formData.isFeatured ? 'Shown on home page' : 'Not featured'}
                    </p>
                  </div>
                </div>

                <div style={{
                  padding: '1.5rem',
                  background: '#eff6ff',
                  border: '2px solid #3b82f6',
                  borderRadius: '12px'
                }}>
                  <h4 style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#1e40af', fontSize: '1rem' }}>
                    ℹ️ Quick Guide
                  </h4>
                  <ul style={{ fontSize: '0.875rem', color: '#1e40af', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
                    <li><strong>Active:</strong> Makes the project visible on your portfolio page</li>
                    <li><strong>Featured:</strong> Displays the project prominently on your home page</li>
                    <li><strong>Inactive + Not Featured:</strong> Project is hidden but saved in database</li>
                  </ul>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer with Actions */}
        <div style={{
          padding: '1.5rem 2rem',
          borderTop: '2px solid #e5e7eb',
          background: '#f9fafb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {error && (
            <div style={{
              flex: 1,
              padding: '0.75rem 1rem',
              background: '#fee2e2',
              color: '#dc2626',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              ⚠️ {error}
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '1rem', marginLeft: 'auto' }}>
            <button 
              type="button" 
              onClick={onClose} 
              disabled={loading}
              style={{
                padding: '0.875rem 2rem',
                background: 'white',
                color: '#6b7280',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              form="project-form"
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 2.5rem',
                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.4)'
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Uploading...
                </>
              ) : (
                <>
                  <Check size={18} />
                  {project ? 'Update Project' : 'Create Project'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProjectModal;
