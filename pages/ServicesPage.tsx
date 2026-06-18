import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import Services from '../components/Services';
import { SEO, servicesStructuredData } from '../components/SEO';

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="fade-in py-12">
      <SEO
        title="Services - Ready-Made & Custom Academic Projects in Zimbabwe"
        description="Choose between ready-made projects for quick delivery or custom-built solutions tailored to your needs. Data Science, Machine Learning, Web Development, IoT, and more. Serving students across Zimbabwe including Harare, Bulawayo, and Gweru."
        keywords="academic services Zimbabwe, custom software development Harare, ready-made projects Zimbabwe, data science services, ML development Zimbabwe, web application development, IoT solutions Zimbabwe, university project help, software engineering Zimbabwe"
        canonicalUrl="https://scholarxafrica.com/services"
        structuredData={servicesStructuredData}
      />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass border border-neon-cyan/20 text-neon-cyan text-xs font-semibold uppercase tracking-wider mb-4">
            Our Approach
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Services tailored for you
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Whether you need a complete system built from scratch or a ready-made project to learn from, we have you covered.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid md:grid-cols-2 gap-8 mb-20"
        >
          <div className="glass rounded-2xl p-8 border border-glass-border glow-card">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-neon-cyan/10 flex items-center justify-center">
                <Download className="text-neon-cyan" size={28} />
              </div>
              <h2 className="text-2xl font-bold text-white">Ready-Made Projects</h2>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Pre-developed projects available for immediate download. Perfect for tight deadlines or learning standard implementations.
            </p>
            <ul className="space-y-3 mb-8">
              {['Includes Source Code', 'Standard Documentation', 'Affordable Pricing'].map((item, i) => (
                <li key={i} className="flex gap-3 text-slate-300">
                  <CheckCircle size={18} className="text-neon-cyan shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <Button onClick={() => navigate('/portfolio')} variant="secondary" fullWidth>
              Browse Catalog
            </Button>
          </div>

          <div className="glass rounded-2xl p-8 border border-glass-border glow-card">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-neon-purple/10 flex items-center justify-center">
                <Zap className="text-neon-purple" size={28} />
              </div>
              <h2 className="text-2xl font-bold text-white">Custom Projects</h2>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Tailored specifically to your unique requirements. You provide the topic or features, and we build it from the ground up.
            </p>
            <ul className="space-y-3 mb-8 text-slate-300">
              {['100% Unique Logic', 'Tailored Report & Diagrams', 'Mentorship & Explanation'].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <CheckCircle size={18} className="text-neon-purple shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <Button onClick={() => navigate('/quote')} variant="primary" fullWidth>
              Request Quote
            </Button>
          </div>
        </motion.div>
      </div>

      <Services />
    </div>
  );
};

export default ServicesPage;
