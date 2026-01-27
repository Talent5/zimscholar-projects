import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getApiUrl, API_CONFIG } from '../config/api.config';
import { useFetch } from '../hooks/useFetch';

interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  pricing: {
    basic?: number;
    standard?: number;
    premium?: number;
  };
}

const ServicesPreview: React.FC = () => {
  const navigate = useNavigate();
  const { data: services, loading, error } = useFetch<Service[]>(
    getApiUrl(API_CONFIG.PUBLIC.SERVICES)
  );

  if (loading) {
    return (
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Expertise</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We cover the most in-demand technical domains for diploma and undergraduate degrees.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 animate-pulse">
                <div className="w-14 h-14 bg-slate-200 rounded-xl mb-6"></div>
                <div className="h-6 bg-slate-200 rounded mb-3"></div>
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !services || services.length === 0) {
    return null;
  }

  // Get category colors
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Machine Learning': 'bg-purple-100 text-purple-600',
      'Data Science': 'bg-blue-100 text-blue-600',
      'Software Engineering': 'bg-green-100 text-green-600',
      'IoT': 'bg-orange-100 text-orange-600',
      'Other': 'bg-gray-100 text-gray-600'
    };
    return colors[category] || colors['Other'];
  };

  // Show first 6 services
  const previewServices = services.slice(0, 6);

  return (
    <section className="py-16 sm:py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Expertise</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            We cover the most in-demand technical domains for diploma and undergraduate degrees.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {previewServices.map((service) => (
            <div 
              key={service._id} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-brand-200 transition-all duration-300 cursor-pointer group" 
              onClick={() => navigate('/services')}
            >
              <div className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold mb-4 ${getCategoryColor(service.category)}`}>
                {service.category}
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-brand-600 transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-600 mb-4 line-clamp-2">
                {service.description}
              </p>
              {service.pricing && Object.keys(service.pricing).length > 0 && (
                <div className="text-sm text-slate-500 mb-4">
                  Starting from <span className="font-bold text-brand-600">
                    ${Math.min(...Object.values(service.pricing).filter(v => v !== undefined) as number[])}
                  </span>
                </div>
              )}
              <span className="text-brand-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn more <ArrowRight size={16} />
              </span>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/services')}
            className="inline-flex items-center gap-2 px-8 py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors"
          >
            View All Services
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
