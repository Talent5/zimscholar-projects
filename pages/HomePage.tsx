import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Clock, 
  Award, 
  CheckCircle,
  Star,
  ExternalLink
} from 'lucide-react';
import { TESTIMONIALS } from '../constants';
import { Button } from '../components/Button';
import ServicesPreview from '../components/ServicesPreview';
import { getApiUrl, getFileUrl, API_CONFIG } from '../config/api.config';
import { SEO, organizationStructuredData, localBusinessStructuredData } from '../components/SEO';

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
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProjects, setFeaturedProjects] = useState<PortfolioProject[]>([]);

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.PUBLIC.PORTFOLIO));
      const data = await response.json();
      // Get featured projects, limit to 3
      const featured = data.filter((p: PortfolioProject) => p.isFeatured).slice(0, 3);
      setFeaturedProjects(featured);
    } catch (error) {
      console.error('Error fetching featured projects:', error);
    }
  };

  return (
    <div className="fade-in">
      <SEO
        title="Academic Projects & Software Development Services in Zimbabwe"
        description="Leading academic project assistance and custom software development in Zimbabwe. Get ready-made or custom projects in Data Science, Machine Learning, Web Development, IoT & Software Engineering. Fast delivery, plagiarism-free work tailored for Zimbabwean students."
        keywords="academic projects Zimbabwe, software development Zimbabwe, data science projects, machine learning projects, web development Harare, IoT projects Zimbabwe, custom software Zimbabwe, student projects, final year projects Zimbabwe, Harare software developer, Zimbabwe tech services, programming projects Zimbabwe"
        canonicalUrl="https://scholarxafrica.com/"
        structuredData={[organizationStructuredData, localBusinessStructuredData]}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-50 py-16 sm:py-24 lg:py-32">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-100 text-brand-700 font-semibold text-sm mb-6">
              Trustworthy Academic Support
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
              Ace Your Project. <br/>
              <span className="text-brand-600">Fast & Professionally.</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl">
              Get ready-made or custom academic projects in Data Science, ML, Software Engineering, and IoT. Tailored for students in Zimbabwe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => navigate('/portfolio')}>
                Browse Projects
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/quote')}>
                Request Custom Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-slate-500">
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck className="text-brand-600 h-8 w-8" />
              <span className="font-semibold">Plagiarism Free</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Clock className="text-brand-600 h-8 w-8" />
              <span className="font-semibold">On-Time Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Award className="text-brand-600 h-8 w-8" />
              <span className="font-semibold">Expert Developers</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="text-brand-600 h-8 w-8" />
              <span className="font-semibold">Documented Code</span>
            </div>
          </div>
        </div>
      </section>

      {/* Service Preview - Dynamic from Database */}
      <ServicesPreview />

      {/* Featured Portfolio Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Featured Projects</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Check out some of our best work - ready-made projects and custom showcases
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {featuredProjects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {project.videoUrl ? (
                    <div className="relative w-full h-48 bg-black">
                      <video
                        src={getFileUrl(project.videoUrl)}
                        controls
                        className="w-full h-full object-cover"
                        poster={project.thumbnail ? getFileUrl(project.thumbnail) : undefined}
                      />
                      <div className="absolute top-3 right-3 bg-accent-500 text-white p-2 rounded-full">
                        <Star size={18} fill="white" />
                      </div>
                    </div>
                  ) : project.thumbnail ? (
                    <div className="relative w-full h-48 bg-slate-100">
                      <img
                        src={getFileUrl(project.thumbnail)}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-accent-500 text-white p-2 rounded-full">
                        <Star size={18} fill="white" />
                      </div>
                    </div>
                  ) : null}

                  <div className="p-6">
                    <div className="flex gap-2 mb-3 flex-wrap">
                      <span className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-xs font-semibold">
                        {project.category}
                      </span>
                      {project.projectId && (
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-mono font-semibold">
                          {project.projectId}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {project.title}
                    </h3>

                    <p className="text-slate-600 mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex gap-2 flex-wrap mb-4">
                        {project.technologies.slice(0, 3).map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {project.projectType === 'ready-made' && project.price && (
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg mb-4">
                        <span className="text-2xl font-bold text-slate-900">
                          ${project.price}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          project.isAvailable
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {project.isAvailable ? 'Available' : 'Sold'}
                        </span>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate('/portfolio')}
                        className="flex-1 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold transition-colors"
                      >
                        View Details
                      </button>
                      {project.demoUrl && (
                        <button
                          onClick={() => window.open(project.demoUrl, '_blank')}
                          className="p-2 border border-brand-600 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        >
                          <ExternalLink size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button onClick={() => navigate('/portfolio')} variant="outline" size="lg">
                View All Projects
              </Button>
            </div>
          </div>
        </section>
      )}
      
      {/* Testimonial Carousel (Simple) */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">What Students Say</h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="bg-white p-6 rounded-xl shadow-sm text-left">
                <div className="flex text-accent-500 mb-3">★★★★★</div>
                <p className="text-slate-700 italic mb-4">"{t.content}"</p>
                <div>
                  <p className="font-bold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}, {t.institution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
