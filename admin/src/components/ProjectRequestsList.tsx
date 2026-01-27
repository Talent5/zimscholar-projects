import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Mail, Phone, Calendar, Search, RefreshCw, GraduationCap, Briefcase, Package, Wrench, Reply } from 'lucide-react';
import ReplyModal from './ReplyModal';
import { fetchProjectRequests, updateProjectStatus } from '../utils/api';

interface ProjectRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  university: string;
  course: string;
  projectCategory: 'ready-made' | 'custom';
  projectType: string;
  projectId?: string;
  customRequirements?: string;
  deadline?: string;
  additionalNotes?: string;
  status: string;
  price?: number;
  paymentStatus: string;
  submittedAt: string;
}

const ProjectRequestsList: React.FC = () => {
  const [projects, setProjects] = useState<ProjectRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectRequest | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProjectRequests();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load project requests. Please try again.');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateProjectStatus(id, newStatus);
      fetchProjects();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update project status. Please try again.');
    }
  };

  const filteredProjects = Array.isArray(projects) ? projects.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || project.projectCategory === categoryFilter;
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  }) : [];

  if (loading) {
    return (
      <div className="list-container">
        <h1>Project Requests</h1>
        <p>Loading requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="list-container">
        <h1>Project Requests</h1>
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
          <h1>Project Requests</h1>
          <p>{projects.length} total requests</p>
        </div>
        <button onClick={fetchProjects} className="refresh-btn">
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      <div className="list-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or project type..."
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
          <option value="ready-made">Ready-Made</option>
          <option value="custom">Custom</option>
        </select>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="in-progress">In Progress</option>
          <option value="delivered">Delivered</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="submissions-list">
        {filteredProjects.length === 0 ? (
          <div className="empty-state">
            <p>No project requests found</p>
          </div>
        ) : (
          filteredProjects.map(project => (
            <div key={project._id} className="submission-card">
              <div className="submission-header">
                <div>
                  <h3>{project.name}</h3>
                  <div className="submission-meta">
                    <span><Mail size={14} /> {project.email}</span>
                    <span><Phone size={14} /> {project.phone}</span>
                  </div>
                  <div className="submission-meta">
                    <span><GraduationCap size={14} /> {project.university}</span>
                    <span><Briefcase size={14} /> {project.course}</span>
                  </div>
                  <div className="submission-meta">
                    <span><Calendar size={14} /> {formatDistanceToNow(new Date(project.submittedAt), { addSuffix: true })}</span>
                  </div>
                </div>
                <select
                  value={project.status}
                  onChange={(e) => updateStatus(project._id, e.target.value)}
                  className={`status-badge status-${project.status}`}
                >
                  <option value="new">New</option>
                  <option value="in-progress">In Progress</option>
                  <option value="delivered">Delivered</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="project-details">
                <span className={`category-badge ${project.projectCategory}`}>
                  {project.projectCategory === 'ready-made' ? <Package size={14} /> : <Wrench size={14} />}
                  {project.projectCategory === 'ready-made' ? 'Ready-Made' : 'Custom'}
                </span>
                <span className="project-type-badge">{project.projectType}</span>
                {project.projectId && <span className="project-id-badge">ID: {project.projectId}</span>}
                {project.deadline && <span className="deadline-badge">Deadline: {new Date(project.deadline).toLocaleDateString()}</span>}
              </div>

              {project.customRequirements && (
                <div className="submission-content">
                  <h4>Custom Requirements:</h4>
                  <p>{project.customRequirements}</p>
                </div>
              )}

              {project.additionalNotes && (
                <div className="submission-content">
                  <h4>Additional Notes:</h4>
                  <p>{project.additionalNotes}</p>
                </div>
              )}

              <div className="submission-actions">
                <button 
                  className="action-btn btn-reply"
                  onClick={() => {
                    setSelectedProject(project);
                    setReplyModalOpen(true);
                  }}
                >
                  <Reply size={16} />
                  Send Project Files
                </button>
                <a href={`mailto:${project.email}?subject=Project Request - ${project.projectType}`} className="action-btn">Direct Email</a>
                <a href={`https://wa.me/${project.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="action-btn">WhatsApp</a>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedProject && (
        <ReplyModal
          isOpen={replyModalOpen}
          onClose={() => {
            setReplyModalOpen(false);
            setSelectedProject(null);
          }}
          recipient={{
            name: selectedProject.name,
            email: selectedProject.email,
            phone: selectedProject.phone,
            type: 'project',
            id: selectedProject._id
          }}
          onSend={() => {
            updateStatus(selectedProject._id, 'delivered');
          }}
        />
      )}
    </div>
  );
};

export default ProjectRequestsList;
