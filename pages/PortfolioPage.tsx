import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Portfolio from '../components/Portfolio';
import { SEO } from '../components/SEO';

const PortfolioPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="fade-in py-12">
      <SEO
        title="Portfolio - Browse Ready-Made Academic Projects | Zimbabwe"
        description="Explore our collection of ready-made and custom academic projects. Data Science, Machine Learning, Web Development, Mobile Apps, and IoT projects. Instant download with full source code and documentation. Trusted by students in Zimbabwe."
        keywords="project portfolio Zimbabwe, ready-made academic projects, download projects Zimbabwe, data science portfolio, machine learning projects for sale, web development projects Zimbabwe, IoT projects, mobile app projects, final year projects Zimbabwe"
        canonicalUrl="https://scholarxafrica.com/portfolio"
      />
      <Portfolio />
        
      <div className="container mx-auto px-4">
        <div className="mt-16 glass rounded-3xl p-8 md:p-12 text-center relative overflow-hidden border border-neon-cyan/10">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-neon-purple/5 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Can't find what you're looking for?</h2>
            <p className="mb-8 text-slate-400 max-w-xl mx-auto">We build custom projects based on your specific university requirements and topics.</p>
            <motion.button
              onClick={() => navigate('/quote')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple text-white text-sm font-semibold tracking-wide btn-glow"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Request Custom Quote
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
