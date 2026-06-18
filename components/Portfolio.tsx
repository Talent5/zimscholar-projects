import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiUrl, getFileUrl, API_CONFIG } from '../config/api.config';
import { Button } from './Button';

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
      <div className="py-16 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-slate-400"
        >
          Loading projects...
        </motion.p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    exit: { opacity: 0, y: -12, transition: { duration: 0.2 } }
  };

  return (
    <section className="relative py-16 px-4">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Our Portfolio
          </h2>
          <p className="text-lg text-slate-400 max-w-[600px] mx-auto">
            Explore our completed projects and ready-made solutions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex gap-3 justify-center flex-wrap mb-10"
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`
                px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border
                ${categoryFilter === cat
                  ? 'bg-neon-cyan text-white border-neon-cyan'
                  : 'border-white/[0.06] text-slate-400 hover:text-white hover:border-white/15'
                }
              `}
            >
              {cat === 'all' ? 'All Projects' : cat}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={categoryFilter}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-8"
          >
            {projects.map(project => (
              <motion.div
                key={project._id}
                variants={cardVariants}
                layout
                className="rounded-2xl glass border border-glass-border glow-card overflow-hidden cursor-pointer group"
                onClick={() => navigate(`/portfolio/${project.slug}`)}
              >
                {project.thumbnail && !project.videoUrl && (
                  <div className="relative w-full h-[200px] bg-glass-light overflow-hidden">
                    <img
                      src={getFileUrl(project.thumbnail)}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {project.isFeatured && (
                      <div className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-glass-heavy border border-glass-border flex items-center justify-center">
                        <Star size={16} className="text-neon-cyan" fill="currentColor" />
                      </div>
                    )}
                  </div>
                )}

                {project.videoUrl && (
                  <div className="relative w-full h-[200px] bg-black overflow-hidden">
                    <video
                      src={getFileUrl(project.videoUrl)}
                      controls
                      className="w-full h-full object-cover"
                      poster={project.thumbnail ? getFileUrl(project.thumbnail) : undefined}
                    />
                    {project.isFeatured && (
                      <div className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-glass-heavy border border-glass-border flex items-center justify-center z-10">
                        <Star size={16} className="text-neon-cyan" fill="currentColor" />
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6">
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <span className="px-3 py-1 rounded-full glass border border-glass-border text-neon-cyan text-xs font-semibold">
                      {project.category}
                    </span>
                    <span className={`
                      px-3 py-1 rounded-full border text-xs font-semibold
                      ${project.projectType === 'ready-made'
                        ? 'border-neon-cyan/20 text-neon-cyan'
                        : 'border-white/[0.06] text-slate-400'
                      }
                    `}>
                      {project.projectType === 'ready-made' ? 'Ready-Made' : 'Showcase'}
                    </span>
                    {project.projectId && (
                      <span className="px-3 py-1 rounded-full glass border border-glass-border text-slate-400 text-xs font-mono">
                        {project.projectId}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-neon-cyan transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-slate-400 text-[0.9375rem] leading-relaxed mb-4">
                    {project.description.length > 120
                      ? `${project.description.substring(0, 120)}...`
                      : project.description
                    }
                  </p>

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex gap-2 flex-wrap mb-4">
                      {project.technologies.slice(0, 4).map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-md bg-glass-light text-slate-400 text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-2 py-1 rounded-md bg-glass-light text-slate-400 text-xs font-medium">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {project.projectType === 'ready-made' && project.price && (
                    <div className="flex justify-between items-center p-3 rounded-xl bg-glass-light mb-4">
                      <span className="text-2xl font-bold text-white">
                        ${project.price}
                      </span>
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-semibold
                        ${project.isAvailable
                          ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                          : 'bg-red-500/10 border border-red-500/20 text-red-400'
                        }
                      `}>
                        {project.isAvailable ? 'Available' : 'Sold'}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => navigate(`/portfolio/${project.slug}`)}
                    >
                      View Details
                    </Button>

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
                      Request Quote
                    </Button>

                    <div className="flex gap-3">
                      {project.demoUrl && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(ensureHttps(project.demoUrl!), '_blank', 'noopener,noreferrer');
                          }}
                          title="View Demo"
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass border border-glass-border text-slate-400 hover:text-neon-cyan hover:border-neon-cyan/30 text-sm font-medium transition-all"
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
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-glass-border text-white hover:bg-white/15 hover:border-white/20 text-sm font-medium transition-all"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                          </svg>
                          GitHub
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-slate-500">No projects found in this category.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
