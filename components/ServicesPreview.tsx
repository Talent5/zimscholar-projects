import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
};

const ServicesPreview: React.FC = () => {
  const navigate = useNavigate();
  const { data: services, loading, error } = useFetch<Service[]>(
    getApiUrl(API_CONFIG.PUBLIC.SERVICES)
  );

  if (loading) {
    return (
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Our Expertise</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              We cover the most in-demand technical domains for diploma and undergraduate degrees.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-2xl p-8 border border-glass-border animate-pulse">
                <div className="w-14 h-14 bg-glass-light rounded-xl mb-6" />
                <div className="h-6 bg-glass-light rounded mb-3 w-3/4" />
                <div className="h-4 bg-glass-light rounded mb-2" />
                <div className="h-4 bg-glass-light rounded w-1/2" />
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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Machine Learning': 'text-neon-purple border-neon-purple/20',
      'Data Science': 'text-neon-cyan border-neon-cyan/20',
      'Software Engineering': 'text-neon-blue border-neon-blue/20',
      'IoT': 'text-amber-400 border-amber-400/20',
      'Other': 'text-slate-400 border-slate-400/20',
    };
    return colors[category] || colors['Other'];
  };

  const previewServices = services.slice(0, 6);

  return (
    <section className="relative py-16 sm:py-24 border-t border-glass-border">
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass border border-neon-cyan/20 text-neon-cyan text-xs font-semibold uppercase tracking-wider mb-4">
            Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Our Expertise
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            We cover the most in-demand technical domains for diploma and undergraduate degrees.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {previewServices.map((service) => (
            <motion.div
              key={service._id}
              variants={cardVariants}
              className="glass rounded-2xl p-8 border border-glass-border glow-card cursor-pointer group"
              onClick={() => navigate('/services')}
            >
              <span
                className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold border mb-4 ${getCategoryColor(service.category)}`}
              >
                {service.category}
              </span>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-neon-cyan transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                {service.description}
              </p>
              {service.pricing && Object.keys(service.pricing).length > 0 && (
                <div className="text-sm text-slate-500 mb-4">
                  Starting from{' '}
                  <span className="font-bold text-neon-cyan">
                    ${Math.min(...Object.values(service.pricing).filter((v) => v !== undefined) as number[])}
                  </span>
                </div>
              )}
              <span className="text-neon-cyan font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn more <ArrowRight size={16} />
              </span>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <motion.button
            onClick={() => navigate('/services')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple text-white text-sm font-semibold tracking-wide btn-glow"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            View All Services
            <ArrowRight size={20} />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
