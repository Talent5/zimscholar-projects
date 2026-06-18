import React from 'react';
import { Package, Wrench, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import ProjectRequestForm from '../components/ProjectRequestForm';
import { SEO } from '../components/SEO';

const ProjectRequestPage: React.FC = () => {
  const benefits = [
    {
      icon: <Package size={24} className="text-neon-cyan" />,
      title: 'Ready-Made Projects',
      description: 'Browse our portfolio and request pre-built projects that match your requirements',
    },
    {
      icon: <Wrench size={24} className="text-purple-600" />,
      title: 'Custom Solutions',
      description: 'Tell us your specific needs and we\'ll build a custom project from scratch',
    },
    {
      icon: <Zap size={24} className="text-blue-600" />,
      title: 'Fast Response',
      description: 'Get a response within 24 hours and start your project journey',
    },
  ];

  return (
    <div className="fade-in py-12">
      <SEO
        title="Project Request - Order Academic Projects Zimbabwe"
        description="Order ready-made or request custom academic projects in Zimbabwe. Fast delivery of Data Science, Machine Learning, Web Development, and IoT projects with full documentation. Submit your project request today."
        keywords="order project Zimbabwe, academic project request, buy project Zimbabwe, custom project order, ready-made project Zimbabwe, project delivery Zimbabwe, software project request Harare"
        canonicalUrl="https://scholarxafrica.com/project-request"
      />

      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-800 mb-4 tracking-tight">
            Request Your Academic Project
          </h1>
          <p className="text-lg text-stone-500 max-w-3xl mx-auto leading-relaxed">
            Get started with your project today. Whether you need a ready-made solution
            or a custom-built project, we're here to help you succeed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
              className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm text-center dash-card"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-blue-50 flex items-center justify-center">
                {benefit.icon}
              </div>
              <h3 className="font-bold text-stone-800 text-lg mb-2">{benefit.title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm dash-card"
        >
          <ProjectRequestForm />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm dash-card"
        >
          <h3 className="font-bold text-stone-800 text-lg mb-3">What Happens Next?</h3>
          <ol className="space-y-3 text-stone-500 text-sm">
            {[
              'Submit your project request using the form above',
              'Our team will review your requirements within 24 hours',
              "We'll send you a detailed quotation via email",
              'Once approved, we start working on your project',
              'Receive your completed project before the deadline',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 border border-stone-200 flex items-center justify-center text-neon-cyan text-xs font-bold">
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectRequestPage;
