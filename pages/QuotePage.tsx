import React from 'react';
import { useLocation } from 'react-router-dom';
import { Clock, MessageCircle, DollarSign } from 'lucide-react';
import QuoteRequestForm from '../components/QuoteRequestForm';
import { SEO } from '../components/SEO';

const QuotePage: React.FC = () => {
  const location = useLocation();
  const projectInfo = location.state as { projectId?: string; projectTitle?: string; projectType?: string } | null;

  return (
    <div className="fade-in py-12">
      <SEO
        title="Request Custom Quote - Tailored Academic Projects Zimbabwe"
        description="Request a custom quote for your academic project in Zimbabwe. Get professional quotations within 24 hours. Custom Data Science, Machine Learning, Web Development, and IoT solutions. Affordable pricing for Zimbabwean students."
        keywords="request quote Zimbabwe, custom project quote, academic project pricing, Zimbabwe custom software quote, tailored project quote, student project pricing Zimbabwe, custom development quote Harare"
        canonicalUrl="https://scholarxafrica.com/quote"
      />
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-6">Request a Custom Quote</h1>
            <p className="text-slate-600 mb-8">
              Tell us about your project and we'll provide you with a detailed, professional quotation within 24 hours.
            </p>

            <div className="space-y-6 mb-10">
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-full">
                  <DollarSign size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Professional Quotations</h3>
                  <p className="text-sm text-slate-600">Detailed PDF quotes sent to your email</p>
                </div>
              </div>

              <a 
                href="https://wa.me/263785183361?text=Hi, I'd like to request a quote for my project" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-6 bg-green-50 rounded-xl border border-green-100 hover:shadow-md transition-all group"
              >
                <div className="bg-green-500 text-white p-3 rounded-full group-hover:scale-110 transition-transform">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Quick Chat (WhatsApp)</h3>
                  <p className="text-sm text-slate-600">Get instant answers to your questions</p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-6 bg-white rounded-xl border border-slate-100">
                <div className="bg-slate-100 text-slate-600 p-3 rounded-full">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Response Time</h3>
                  <p className="text-sm text-slate-600">Quotations delivered within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
              <h3 className="font-bold text-slate-900 mb-3">What You'll Get:</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Detailed project breakdown with pricing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Timeline and delivery expectations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Clear payment terms and milestones</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Professional PDF quotation document</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>No obligation - free consultation</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Quote Request Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
            {projectInfo && (
              <div className="mb-6 p-4 bg-brand-50 border border-brand-200 rounded-lg">
                <p className="text-sm font-semibold text-brand-900 mb-1">📌 Requesting quote for:</p>
                <p className="text-brand-700 font-bold">{projectInfo.projectTitle}</p>
                {projectInfo.projectId && (
                  <p className="text-xs text-brand-600 mt-1 font-mono">{projectInfo.projectId}</p>
                )}
              </div>
            )}
            <QuoteRequestForm projectInfo={projectInfo || undefined} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotePage;
