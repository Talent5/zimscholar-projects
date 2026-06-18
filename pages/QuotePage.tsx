import React from 'react';
import { useLocation } from 'react-router-dom';
import { Clock, MessageCircle, DollarSign, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
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
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                Request a Custom Quote
              </h1>
              <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                Tell us about your project and we'll provide you with a detailed, professional quotation within 24 hours.
              </p>
            </motion.div>

            <div className="space-y-4 mb-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="flex items-center gap-4 p-6 bg-white rounded-xl border border-slate-100 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-neon-cyan flex items-center justify-center shrink-0">
                  <DollarSign size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Professional Quotations</h3>
                  <p className="text-sm text-slate-400">Detailed quotes sent to your email</p>
                </div>
              </motion.div>

              <motion.a
                href="https://wa.me/263785183361?text=Hi, I'd like to request a quote for my project"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="flex items-center gap-4 p-6 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-sky-200 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <MessageCircle size={22} className="text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-neon-cyan transition-colors">Quick Chat (WhatsApp)</h3>
                  <p className="text-sm text-slate-400">Get instant answers to your questions</p>
                </div>
              </motion.a>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="flex items-center gap-4 p-6 bg-white rounded-xl border border-slate-100 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                  <Clock size={22} className="text-slate-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Response Time</h3>
                  <p className="text-sm text-slate-400">Quotations delivered within 24 hours</p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
            >
              <h3 className="font-semibold text-slate-900 mb-4">What You'll Get:</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                {[
                  'Detailed project breakdown with pricing',
                  'Timeline and delivery expectations',
                  'Clear payment terms and milestones',
                  'Professional quotation document',
                  'No obligation — free consultation',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-neon-cyan shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm"
            >
              {projectInfo && (
                <div className="mb-6 p-4 bg-sky-50 rounded-xl border border-sky-200">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                    Requesting quote for:
                  </p>
                  <p className="text-slate-900 font-bold">{projectInfo.projectTitle}</p>
                  {projectInfo.projectId && (
                    <p className="text-xs text-slate-400 mt-1 font-mono">{projectInfo.projectId}</p>
                  )}
                </div>
              )}
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Project Details</h2>
              <QuoteRequestForm projectInfo={projectInfo || undefined} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotePage;
