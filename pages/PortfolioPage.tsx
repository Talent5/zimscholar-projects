import React from 'react';
import { useNavigate } from 'react-router-dom';
import Portfolio from '../components/Portfolio';
import { Button } from '../components/Button';
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
        <div className="mt-16 bg-brand-600 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Can't find what you're looking for?</h2>
            <p className="mb-8 text-brand-100 max-w-xl mx-auto">We build custom projects based on your specific university requirements and topics.</p>
            <Button variant="secondary" onClick={() => navigate('/quote')}>Start Custom Project</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
