// === C:\Users\Takunda Mundwa\Desktop\zimscholar-projects\pages\FAQPage.tsx ===
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
          <h1 className="text-4xl font-bold text-white mb-6">About ScholarXafrica</h1>
          <p className="text-slate-400 leading-relaxed mb-4">
            Founded in Harare, ScholarXafrica serves students across Zimbabwe and the SADC region. Our team consists of graduate researchers and industry professionals in AI, Software Engineering, and Embedded Systems.
          </p>
          <p className="text-slate-400 leading-relaxed mb-6">
            We bridge the gap between theoretical coursework and practical implementation, helping students understand the "how" and "why" behind their code.
          </p>
          
          <div className="glass rounded-2xl p-6 border-l-4 border-neon-cyan">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="text-neon-cyan" /> Academic Integrity Stance
            </h3>
            <p className="text-slate-400 text-sm">
              We strictly oppose plagiarism. Our projects are designed to be used as reference implementations and study aids. We empower you to create your own final submission by providing high-quality examples and mentorship.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div key={index} className="glass rounded-2xl border border-glass-border overflow-hidden">
                <button 
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-semibold text-white pr-4">{faq.question}</span>
                  {activeFaq === index ? <ChevronUp size={20} className="text-slate-400 shrink-0" /> : <ChevronDown size={20} className="text-slate-400 shrink-0" />}
                </button>
                {activeFaq === index && (
                  <div className="p-4 bg-glass-light text-slate-400 text-sm leading-relaxed border-t border-glass-border">
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
