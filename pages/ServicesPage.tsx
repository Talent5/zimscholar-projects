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
          <h1 className="text-4xl font-bold text-slate-900 mb-6">Services tailored for you</h1>
          <p className="text-lg text-slate-600">
            Whether you need a complete system built from scratch or a ready-made project to learn from, we have you covered.
          </p>
        </div>

        {/* Ready Made vs Custom */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-brand-500">
            <div className="flex items-center gap-4 mb-4">
              <Download className="text-brand-600" size={32} />
              <h2 className="text-2xl font-bold">Ready-Made Projects</h2>
            </div>
            <p className="text-slate-600 mb-6">
              Pre-developed projects available for immediate download. Perfect for tight deadlines or learning standard implementations.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex gap-2"><CheckCircle size={20} className="text-green-500" /> Includes Source Code</li>
              <li className="flex gap-2"><CheckCircle size={20} className="text-green-500" /> Standard Documentation</li>
              <li className="flex gap-2"><CheckCircle size={20} className="text-green-500" /> Affordable Pricing</li>
            </ul>
            <Button onClick={() => navigate('/portfolio')} variant="secondary" fullWidth>Browse Catalog</Button>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-md border-t-4 border-accent-400">
            <div className="flex items-center gap-4 mb-4">
              <Zap className="text-accent-400" size={32} />
              <h2 className="text-2xl font-bold">Custom Projects</h2>
            </div>
            <p className="text-slate-300 mb-6">
              Tailored specifically to your unique requirements. You provide the topic or features, and we build it from the ground up.
            </p>
            <ul className="space-y-3 mb-8 text-slate-300">
              <li className="flex gap-2"><CheckCircle size={20} className="text-accent-400" /> 100% Unique Logic</li>
              <li className="flex gap-2"><CheckCircle size={20} className="text-accent-400" /> Tailored Report & Diagrams</li>
              <li className="flex gap-2"><CheckCircle size={20} className="text-accent-400" /> Mentorship & Explanation</li>
            </ul>
            <Button onClick={() => navigate('/quote')} variant="primary" fullWidth className="bg-accent-500 text-slate-900 hover:bg-accent-400">Request Quote</Button>
          </div>
        </div>
      </div>

      {/* Dynamic Services from Database */}
      <Services />
    </div>
  );
};

export default ServicesPage;
