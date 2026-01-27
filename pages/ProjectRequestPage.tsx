import React from 'react';
import ProjectRequestForm from '../components/ProjectRequestForm';
import { SEO } from '../components/SEO';

const ProjectRequestPage: React.FC = () => {
  return (
    <div className="py-12 bg-slate-50">
      <SEO
        title="Project Request - Order Academic Projects Zimbabwe"
        description="Order ready-made or request custom academic projects in Zimbabwe. Fast delivery of Data Science, Machine Learning, Web Development, and IoT projects with full documentation. Submit your project request today."
        keywords="order project Zimbabwe, academic project request, buy project Zimbabwe, custom project order, ready-made project Zimbabwe, project delivery Zimbabwe, software project request Harare"
        canonicalUrl="https://scholarxafrica.com/project-request"
      />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Request Your Academic Project
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get started with your project today! Whether you need a ready-made solution 
              or a custom-built project, we're here to help you succeed.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-3">📦</div>
              <h3 className="font-bold text-lg mb-2">Ready-Made Projects</h3>
              <p className="text-sm text-slate-600">
                Browse our portfolio and request pre-built projects that match your requirements
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-3">🛠️</div>
              <h3 className="font-bold text-lg mb-2">Custom Solutions</h3>
              <p className="text-sm text-slate-600">
                Tell us your specific needs and we'll build a custom project from scratch
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-bold text-lg mb-2">Fast Response</h3>
              <p className="text-sm text-slate-600">
                Get a response within 24 hours and start your project journey
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <ProjectRequestForm />
          </div>

          {/* Additional Info */}
          <div className="mt-12 bg-blue-50 border-l-4 border-brand-600 p-6 rounded">
            <h3 className="font-bold text-lg mb-2 text-slate-800">What Happens Next?</h3>
            <ol className="list-decimal list-inside space-y-2 text-slate-700">
              <li>Submit your project request using the form above</li>
              <li>Our team will review your requirements within 24 hours</li>
              <li>We'll send you a detailed quotation via email</li>
              <li>Once approved, we'll start working on your project</li>
              <li>Receive your completed project before the deadline</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectRequestPage;
