import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExternalLink, Calendar, Award, GraduationCap, ArrowLeft, Github, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { getApiUrl, getFileUrl, API_CONFIG } from '../config/api.config';
import { Button } from '../components/Button';

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
  features: string[];
  price?: number;
  isAvailable: boolean;
  isFeatured: boolean;
  demoUrl?: string;
  githubRepo?: string;
  university?: string;
  yearCompleted?: number;
  grade?: string;
  viewCount: number;
  createdAt: string;
}

const PortfolioDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchProject();
    }
  }, [slug]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl(API_CONFIG.PUBLIC.PORTFOLIO_DETAIL(slug!)));
      if (!response.ok) {
        throw new Error('Project not found');
      }
      const data = await response.json();
      setProject(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/4 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Project Not Found</h1>
        <p className="text-slate-600 mb-8">{error || 'The project you are looking for does not exist.'}</p>
        <Button onClick={() => navigate('/portfolio')}>
          <ArrowLeft size={18} />
          Back to Portfolio
        </Button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-brand-50 to-accent-50 py-12">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/portfolio')}
            className="flex items-center gap-2 text-brand-600 hover:text-brand-700 mb-6 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Portfolio
          </button>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <div className="flex gap-2 mb-4 flex-wrap">
                <span className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm font-semibold">
                  {project.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  project.projectType === 'ready-made' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {project.projectType === 'ready-made' ? 'Ready-Made' : 'Showcase'}
                </span>
                {project.projectId && (
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-mono font-semibold">
                    {project.projectId}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                {project.title}
              </h1>

              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                {project.description}
              </p>

              <div className="flex gap-3 flex-wrap mb-6">
                {project.demoUrl && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      const url = project.demoUrl!.startsWith('http') 
                        ? project.demoUrl 
                        : `https://${project.demoUrl}`;
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    <ExternalLink size={18} />
                    View Demo
                  </Button>
                )}
                {project.githubRepo && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      const url = project.githubRepo!.startsWith('http') 
                        ? project.githubRepo 
                        : `https://${project.githubRepo}`;
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                    style={{ background: '#24292e', color: 'white', borderColor: '#24292e' }}
                  >
                    <Github size={18} />
                    View on GitHub
                  </Button>
                )}
                <Button onClick={() => navigate('/quote', { 
                  state: { 
                    projectId: project.projectId,
                    projectTitle: project.title,
                    projectType: project.category
                  }
                })}>
                  Request Quote
                </Button>
              </div>

              {project.projectType === 'ready-made' && project.price && (
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-brand-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm font-medium mb-1">Price</p>
                      <p className="text-4xl font-bold text-brand-600">${project.price}</p>
                    </div>
                    <div className="text-right">
                      {project.isAvailable ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle size={24} />
                          <span className="font-semibold">Available</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-600">
                          <XCircle size={24} />
                          <span className="font-semibold">Sold Out</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Media Section */}
            <div>
              {project.videoUrl ? (
                <div className="rounded-2xl overflow-hidden shadow-2xl bg-black">
                  <video
                    src={getFileUrl(project.videoUrl)}
                    controls
                    poster={project.thumbnail ? getFileUrl(project.thumbnail) : undefined}
                    className="w-full h-auto"
                  />
                </div>
              ) : project.thumbnail ? (
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={getFileUrl(project.thumbnail)}
                    alt={project.title}
                    className="w-full h-auto"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Features */}
            {project.features && project.features.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Features</h2>
                <ul className="grid md:grid-cols-2 gap-4">
                  {project.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Technologies Used</h2>
                <div className="flex flex-wrap gap-3">
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Project Information</h3>
              <div className="space-y-4">
                {project.university && (
                  <div className="flex items-start gap-3">
                    <GraduationCap size={20} className="text-brand-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-semibold">University</p>
                      <p className="text-slate-900 font-medium">{project.university}</p>
                    </div>
                  </div>
                )}
                {project.yearCompleted && (
                  <div className="flex items-start gap-3">
                    <Calendar size={20} className="text-brand-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-semibold">Year</p>
                      <p className="text-slate-900 font-medium">{project.yearCompleted}</p>
                    </div>
                  </div>
                )}
                {project.grade && (
                  <div className="flex items-start gap-3">
                    <Award size={20} className="text-brand-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-semibold">Grade</p>
                      <p className="text-slate-900 font-medium">{project.grade}</p>
                    </div>
                  </div>
                )}
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-500">Views: <span className="font-semibold text-slate-900">{project.viewCount}</span></p>
                </div>
              </div>
            </div>

            {/* CTA Box */}
            <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-6 text-white shadow-xl">
              <h3 className="text-xl font-bold mb-3">Interested in this project?</h3>
              <p className="text-brand-100 mb-6 text-sm">
                Get a custom quote or purchase this ready-made solution for your academic needs.
              </p>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => navigate('/quote', {
                  state: {
                    projectId: project.projectId,
                    projectTitle: project.title,
                    projectType: project.category
                  }
                })}
              >
                Get Your Quote
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetailPage;
