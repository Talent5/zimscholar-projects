import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Plus, Trash2, Upload, Image as ImageIcon, Video, FileText, DollarSign, Award, Calendar, GraduationCap, Link as LinkIcon, Eye, Star, Hash, Folder } from 'lucide-react';
import { apiRequest, getAuthToken } from '../../../config/api.config';

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
  const [projectFiles, setProjectFiles] = useState<FileList | null>(null);
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
    setProjectFiles(null);
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

      // Add thumbnail if selected
      if (thumbnailFile) {
        formDataToSend.append('thumbnail', thumbnailFile);
      }

      // Add video file if selected
      if (videoFile) {
        formDataToSend.append('videoFile', videoFile);
      }

      // Add project files if selected
      if (projectFiles) {
        Array.from(projectFiles).forEach(file => {
          formDataToSend.append('projectFiles', file);
        });
      }

      const url = project
        ? `/api/admin/portfolio/${project._id}`
        : '/api/admin/portfolio';
      
      const method = project ? 'PUT' : 'POST';
      const token = getAuthToken();

      const response = await fetch(`http://localhost:5000${url}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend
      });

      if (!response.ok) throw new Error('Failed to save project');

      onSave();
    } catch (err) {
      setError('Failed to save project. Please try again.');
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
            <h2>{project ? 'Edit Project' : 'Add New Project'}</h2>
            <p>Upload and manage portfolio projects</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Project Title *</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="projectId">Project ID (optional)</label>
              <input
                type="text"
                id="projectId"
                value={formData.projectId || ''}
                onChange={(e) => handleChange('projectId', e.target.value)}
                placeholder="e.g., ZS2024001"
              />
            </div>
          </div>

          <div className="form-row">
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
                <option value="Web Development">Web Development</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Database">Database</option>
                <option value="AI">AI</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="projectType">Project Type *</label>
              <select
                id="projectType"
                value={formData.projectType}
                onChange={(e) => handleChange('projectType', e.target.value)}
                required
              >
                <option value="ready-made">Ready-Made (For Sale)</option>
                <option value="custom-showcase">Custom Showcase</option>
              </select>
            </div>
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
            <label>Technologies</label>
            {formData.technologies.map((tech, index) => (
              <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  value={tech}
                  onChange={(e) => handleArrayChange('technologies', index, e.target.value)}
                  placeholder="e.g., Python, TensorFlow, React"
                  style={{ flex: 1 }}
                />
                {formData.technologies.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('technologies', index)}
                    className="icon-btn danger"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('technologies')} className="btn-secondary small">
              <Plus size={16} />
              Add Technology
            </button>
          </div>

          <div className="form-group">
            <label>Key Features</label>
            {formData.features.map((feature, index) => (
              <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleArrayChange('features', index, e.target.value)}
                  placeholder="e.g., Real-time analytics"
                  style={{ flex: 1 }}
                />
                {formData.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('features', index)}
                    className="icon-btn danger"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('features')} className="btn-secondary small">
              <Plus size={16} />
              Add Feature
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="thumbnail">Project Thumbnail</label>
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
            />
            {formData.thumbnail && !thumbnailFile && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                Current: {formData.thumbnail}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="videoFile">Project Video (optional)</label>
            <input
              type="file"
              id="videoFile"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
            />
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
              Upload a video demonstrating or explaining your project (MP4, WebM, etc.)
            </p>
            {formData.videoUrl && !videoFile && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#10b981' }}>
                ✓ Video already uploaded
              </p>
            )}
            {videoFile && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#10b981' }}>
                ✓ {videoFile.name} selected ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="projectFiles">Project Files (source code, documentation, etc.)</label>
            <input
              type="file"
              id="projectFiles"
              multiple
              onChange={(e) => setProjectFiles(e.target.files)}
            />
            {projectFiles && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                {projectFiles.length} file(s) selected
              </p>
            )}
          </div>

          {formData.projectType === 'ready-made' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price ($)</label>
                  <input
                    type="number"
                    id="price"
                    value={formData.price || ''}
                    onChange={(e) => handleChange('price', e.target.value ? Number(e.target.value) : undefined)}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => handleChange('isAvailable', e.target.checked)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Available for Purchase
                  </label>
                </div>
              </div>
            </>
          )}

          <div className="form-section-title">Additional Information</div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="university">University</label>
              <input
                type="text"
                id="university"
                value={formData.university || ''}
                onChange={(e) => handleChange('university', e.target.value)}
                placeholder="e.g., University of Zimbabwe"
              />
            </div>

            <div className="form-group">
              <label htmlFor="yearCompleted">Year Completed</label>
              <input
                type="number"
                id="yearCompleted"
                value={formData.yearCompleted || ''}
                onChange={(e) => handleChange('yearCompleted', e.target.value ? Number(e.target.value) : undefined)}
                min="2000"
                max={new Date().getFullYear()}
              />
            </div>

            <div className="form-group">
              <label htmlFor="grade">Grade Achieved</label>
              <input
                type="text"
                id="grade"
                value={formData.grade || ''}
                onChange={(e) => handleChange('grade', e.target.value)}
                placeholder="e.g., A, 75%, Distinction"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="demoUrl">Demo URL</label>
              <input
                type="url"
                id="demoUrl"
                value={formData.demoUrl || ''}
                onChange={(e) => handleChange('demoUrl', e.target.value)}
                placeholder="https://demo.example.com"
              />
            </div>

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
          </div>

          <div className="form-row">
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

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => handleChange('isFeatured', e.target.checked)}
                  style={{ marginRight: '0.5rem' }}
                />
                Featured Project
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
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  {project ? 'Update' : 'Upload'} Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
