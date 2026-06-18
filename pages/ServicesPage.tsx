import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, BookOpen, FileText, SearchCheck, GraduationCap, BarChart3, Microscope, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import Services from '../components/Services';
import { SEO, servicesStructuredData } from '../components/SEO';

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();

  const serviceCards = [
    {
      icon: <BookOpen size={24} className="text-neon-cyan" />,
      title: 'Research Papers & Essays',
      desc: 'Well-researched, properly cited academic papers across all subjects — Humanities, Social Sciences, Business, Law, and more.',
      features: ['In-depth Research', 'Proper Referencing (APA, MLA, Harvard)', 'Turnitin Checked', 'AI Content Removed'],
      cta: 'Request Quote',
      to: '/quote',
    },
    {
      icon: <GraduationCap size={24} className="text-neon-cyan" />,
      title: 'Dissertations & Theses',
      desc: 'Full dissertation and thesis support from proposal to final submission. Literature reviews, methodology, data analysis, and discussion.',
      features: ['Literature Review', 'Research Methodology', 'Data Analysis & Findings', 'Full Formatting'],
      cta: 'Request Quote',
      to: '/quote',
    },
    {
      icon: <FileText size={24} className="text-neon-cyan" />,
      title: 'Research Proposals',
      desc: 'Compelling research proposals that get approved. Clear problem statements, objectives, methodology, and expected outcomes.',
      features: ['Problem Statement', 'Research Objectives', 'Literature Review', 'Methodology Design'],
      cta: 'Request Quote',
      to: '/quote',
    },
    {
      icon: <BarChart3 size={24} className="text-neon-cyan" />,
      title: 'Data Analysis & Stats',
      desc: 'SPSS, Stata, R, Python, Excel — quantitative and qualitative data analysis with clear interpretation and visualization.',
      features: ['Statistical Analysis', 'Data Visualization', 'Interpretation & Write-up', 'SPSS / Stata / R / Python'],
      cta: 'Get Started',
      to: '/quote',
    },
    {
      icon: <Microscope size={24} className="text-neon-cyan" />,
      title: 'Lab Reports & Coursework',
      desc: 'Scientific lab reports, problem sets, case studies, and coursework assignments across all academic levels.',
      features: ['Scientific Method', 'Data Collection & Analysis', 'Proper Formatting', 'Diagrams & Tables'],
      cta: 'Request Help',
      to: '/quote',
    },
    {
      icon: <SearchCheck size={24} className="text-neon-cyan" />,
      title: 'Turnitin & AI Checking',
      desc: 'Submit your work for Turnitin similarity checking and AI content detection. Get a detailed report with revision suggestions.',
      features: ['Turnitin Similarity Report', 'AI Content Detection', 'Revision Suggestions', 'Guaranteed Under 10%'],
      cta: 'Check My Work',
      to: '/quote',
    },
  ];

  return (
    <div className="fade-in py-12">
      <SEO
        title="Services — Research Papers, Dissertations & Academic Projects | All Disciplines"
        description="Full academic services for Zimbabwean students. Research papers, dissertations, theses, proposals, data analysis, lab reports, coursework. Turnitin-checked & AI-free. All disciplines — Humanities, Sciences, Engineering, Business, Law, Medicine."
        keywords="research papers Zimbabwe, dissertation help Zimbabwe, thesis writing, research proposal help, data analysis Zimbabwe, academic writing services, Turnitin checking Zimbabwe, literature review help, coursework assistance, lab reports, essay writing, all academic subjects, SPSS analysis, APA referencing, MLA formatting"
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
          <span className="inline-block px-4 py-1.5 rounded-full border border-stone-200 text-stone-500 text-xs font-semibold uppercase tracking-[0.2em] mb-4 bg-white/60">
            All Academic Disciplines
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-800 mb-4 tracking-tight">
            Services tailored for you
          </h1>
          <p className="text-lg text-stone-500 leading-relaxed">
            From research papers and dissertations to data analysis and coursework — every subject,
            every level, every deadline. Turnitin-checked and AI-free.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
        >
          {serviceCards.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.08 }}
              className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm flex flex-col dash-card"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-5">
                {service.icon}
              </div>
              <h2 className="text-xl font-bold text-stone-800 mb-3">{service.title}</h2>
              <p className="text-stone-500 text-sm mb-5 leading-relaxed">{service.desc}</p>
              <ul className="space-y-2.5 mb-6 flex-1">
                {service.features.map((f, j) => (
                  <li key={j} className="flex gap-2.5 text-stone-500 text-sm">
                    <CheckCircle size={16} className="text-neon-cyan shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button onClick={() => navigate(service.to)} variant="primary" fullWidth>
                {service.cta}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <Services />
    </div>
  );
};

export default ServicesPage;
