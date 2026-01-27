import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { FAQS } from '../constants';
import { SEO } from '../components/SEO';

const FAQPage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="fade-in py-12">
      <SEO
        title="FAQ & About - ScholarXafrica Academic Services Zimbabwe"
        description="Frequently asked questions about ScholarXafrica's academic project services. Learn about our plagiarism-free approach, delivery times, and services. Based in Harare, serving students across Zimbabwe with quality software projects."
        keywords="ScholarXafrica FAQ, about ScholarXafrica, academic integrity Zimbabwe, Harare software services, Zimbabwe student services, academic questions, project help FAQ, ScholarXafrica about"
        canonicalUrl="https://scholarxafrica.com/faq"
      />
      <div className="container mx-auto px-4 max-w-3xl">
        {/* About Section */}
        <section className="mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">About ScholarXafrica</h1>
          <p className="text-slate-700 leading-relaxed mb-4">
            Founded in Harare, ScholarXafrica serves students across Zimbabwe and the SADC region. Our team consists of graduate researchers and industry professionals in AI, Software Engineering, and Embedded Systems.
          </p>
          <p className="text-slate-700 leading-relaxed mb-6">
            We bridge the gap between theoretical coursework and practical implementation, helping students understand the "how" and "why" behind their code.
          </p>
          
          <div className="bg-brand-50 border-l-4 border-brand-600 p-6 rounded-r-lg">
            <h3 className="text-lg font-bold text-brand-800 mb-2 flex items-center gap-2">
              <ShieldCheck /> Academic Integrity Stance
            </h3>
            <p className="text-brand-900 text-sm">
              We strictly oppose plagiarism. Our projects are designed to be used as reference implementations and study aids. We empower you to create your own final submission by providing high-quality examples and mentorship.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                <button 
                  className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-slate-50 transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
                  {activeFaq === index ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                </button>
                {activeFaq === index && (
                  <div className="p-4 bg-slate-50 text-slate-700 text-sm leading-relaxed border-t border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default FAQPage;
