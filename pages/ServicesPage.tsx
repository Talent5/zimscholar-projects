// === C:\Users\Takunda Mundwa\Desktop\zimscholar-projects\pages\ServicesPage.tsx ===
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Zap } from 'lucide-react';
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
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-white mb-6">Services tailored for you</h1>
          <p className="text-lg text-slate-400">
            Whether you need a complete system built from scratch or a ready-made project to learn from, we have you covered.
          </p>
        </div>

        {/* Ready Made vs Custom */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="glass rounded-2xl p-8 border-t border-neon-cyan">
            <div className="flex items-center gap-4 mb-4">
              <Download className="text-neon-cyan" size={32} />
              <h2 className="text-2xl font-bold text-white">Ready-Made Projects</h2>
            </div>
            <p className="text-slate-400 mb-6">
              Pre-developed projects available for immediate download. Perfect for tight deadlines or learning standard implementations.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex gap-2 text-slate-300"><CheckCircle size={20} className="text-neon-cyan" /> Includes Source Code</li>
              <li className="flex gap-2 text-slate-300"><CheckCircle size={20} className="text-neon-cyan" /> Standard Documentation</li>
              <li className="flex gap-2 text-slate-300"><CheckCircle size={20} className="text-neon-cyan" /> Affordable Pricing</li>
            </ul>
            <Button onClick={() => navigate('/portfolio')} variant="secondary" fullWidth>Browse Catalog</Button>
          </div>

          <div className="glass rounded-2xl p-8 border-t border-neon-purple">
            <div className="flex items-center gap-4 mb-4">
              <Zap className="text-neon-purple" size={32} />
              <h2 className="text-2xl font-bold text-white">Custom Projects</h2>
            </div>
            <p className="text-slate-400 mb-6">
              Tailored specifically to your unique requirements. You provide the topic or features, and we build it from the ground up.
            </p>
            <ul className="space-y-3 mb-8 text-slate-300">
              <li className="flex gap-2"><CheckCircle size={20} className="text-neon-purple" /> 100% Unique Logic</li>
              <li className="flex gap-2"><CheckCircle size={20} className="text-neon-purple" /> Tailored Report & Diagrams</li>
              <li className="flex gap-2"><CheckCircle size={20} className="text-neon-purple" /> Mentorship & Explanation</li>
            </ul>
            <Button onClick={() => navigate('/quote')} variant="primary" fullWidth>Request Quote</Button>
          </div>
        </div>
      </div>

      {/* Dynamic Services from Database */}
      <Services />
    </div>
  );
};

export default ServicesPage;
