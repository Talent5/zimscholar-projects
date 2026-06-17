import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getApiUrl, API_CONFIG } from '../config/api.config';
import { useFetch } from '../hooks/useFetch';
import { Button } from '../components/Button';

interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string;
  features: string[];
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
    transition: { staggerChildren: 0.08 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const Services: React.FC = () => {
  const { data: services, loading, error, refetch } = useFetch<Service[]>(
    getApiUrl(API_CONFIG.PUBLIC.SERVICES)
  );

  if (loading) {
    return (
      <section className="py-24 px-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-neon-cyan" size={36} />
          <p className="text-slate-400 text-sm tracking-wide">Loading services...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 px-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-red-400 text-sm">Failed to load services</p>
          <Button variant="primary" size="md" onClick={refetch}>
            Retry
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Our Services
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Professional academic project services tailored for Zimbabwe students
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-8"
        >
          {(services || []).map((service) => (
            <motion.div
              key={service._id}
              variants={cardVariants}
              className="glass rounded-2xl p-8 border border-glass-border glow-card group flex flex-col"
            >
              <span className="inline-block w-fit px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-5 glass border border-glass-border text-neon-cyan">
                {service.category}
              </span>

              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-neon-cyan transition-colors duration-300">
                {service.title}
              </h3>

              <p className="text-slate-400 leading-relaxed mb-6">
                {service.description}
              </p>

              {service.features && service.features.length > 0 && (
                <ul className="space-y-3 mb-6">
                  {service.features.slice(0, 4).map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-slate-300 text-sm">
                      <CheckCircle size={18} className="text-neon-cyan shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex-1" />

              {service.pricing && (Object.keys(service.pricing).length > 0) && (
                <div className="glass rounded-xl p-4 mb-6">
                  <div className="flex justify-between flex-wrap gap-3">
                    {service.pricing.basic !== undefined && (
                      <div>
                        <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-0.5">
                          Basic
                        </div>
                        <div className="text-xl font-bold text-white">
                          ${service.pricing.basic}
                        </div>
                      </div>
                    )}
                    {service.pricing.standard !== undefined && (
                      <div>
                        <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-0.5">
                          Standard
                        </div>
                        <div className="text-xl font-bold text-white">
                          ${service.pricing.standard}
                        </div>
                      </div>
                    )}
                    {service.pricing.premium !== undefined && (
                      <div>
                        <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-0.5">
                          Premium
                        </div>
                        <div className="text-xl font-bold text-white">
                          ${service.pricing.premium}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Button variant="primary" fullWidth>
                Get Started
                <ArrowRight size={18} />
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
