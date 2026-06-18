import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQS } from '../constants';
import { SEO, faqStructuredData } from '../components/SEO';

const FAQPage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="fade-in py-12">
      <SEO
        title="FAQ — Turnitin Checking, AI Detection & Academic Project Help Zimbabwe"
        description="Get answers about ScholarXafrica's Turnitin plagiarism checking, AI content removal, delivery times, pricing, and academic integrity. Serving students across Zimbabwe with quality software projects."
        keywords="Turnitin check Zimbabwe, AI detection academic, plagiarism-free projects, academic integrity Zimbabwe, Harare software services, Zimbabwe student services, AI content removal, Turnitin report, project help FAQ, ScholarXafrica about"
        canonicalUrl="https://scholarxafrica.com/faq"
        structuredData={faqStructuredData(FAQS)}
      />

      <div className="max-w-3xl mx-auto px-6">
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-neon-cyan text-xs font-semibold uppercase tracking-wider mb-4">
              About Us
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              About ScholarXafrica
            </h1>
            <p className="text-slate-600 leading-relaxed mb-4">
              Founded in Harare, ScholarXafrica serves students across Zimbabwe and the SADC region.
              Our team consists of graduate researchers and industry professionals in AI, Software
              Engineering, and Embedded Systems.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8">
              We bridge the gap between theoretical coursework and practical implementation, helping
              students understand the "how" and "why" behind their code.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center">
                <ShieldCheck size={18} className="text-slate-400" />
              </div>
              Academic Integrity Stance
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              We strictly oppose plagiarism. Our projects are designed to be used as reference
              implementations and study aids. We empower you to create your own final submission by
              providing high-quality examples and mentorship.
            </p>
          </motion.div>
        </section>

        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-neon-cyan text-xs font-semibold uppercase tracking-wider mb-4">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8 tracking-tight">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + index * 0.05 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
                  {activeFaq === index ? (
                    <ChevronUp size={18} className="text-neon-cyan shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-slate-400 shrink-0" />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-4 mx-5">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default FAQPage;
