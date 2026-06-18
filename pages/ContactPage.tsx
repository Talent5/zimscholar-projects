import React from 'react';
import { Clock, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import ContactForm from '../components/ContactForm';
import { SEO } from '../components/SEO';

const ContactPage: React.FC = () => {
  return (
    <div className="fade-in py-12">
      <SEO
        title="Contact Us - Academic Project Support in Zimbabwe"
        description="Get in touch with ScholarXafrica for academic project assistance in Zimbabwe. Fast response via WhatsApp. Contact us for Data Science, Machine Learning, Web Development, IoT projects and more. Based in Harare, serving all of Zimbabwe."
        keywords="contact ScholarXafrica, academic project help Zimbabwe, WhatsApp support, Harare contact, Zimbabwe software development contact, project assistance Zimbabwe, student support Harare"
        canonicalUrl="https://scholarxafrica.com/contact"
      />

      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full glass border border-neon-cyan/20 text-neon-cyan text-xs font-semibold uppercase tracking-wider mb-4">
              Contact
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
              Get In Touch
            </h1>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Ready to start? Have a question? We typically reply within 1 hour during business hours.
            </p>

            <div className="space-y-4 mb-10">
              <motion.a
                href="https://wa.me/26784286089"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="flex items-center gap-4 p-6 glass rounded-xl border border-glass-border hover:border-neon-cyan/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <MessageCircle size={22} className="text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-neon-cyan transition-colors">
                    WhatsApp Us (Fastest)
                  </h3>
                  <p className="text-sm text-slate-400">Click to chat instantly</p>
                </div>
              </motion.a>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="flex items-center gap-4 p-6 glass rounded-xl border border-glass-border"
              >
                <div className="w-12 h-12 rounded-xl bg-glass-light flex items-center justify-center shrink-0">
                  <Clock size={22} className="text-slate-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Business Hours</h3>
                  <p className="text-sm text-slate-400">Mon – Fri: 09:00 – 18:00</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="glass rounded-2xl p-8 border border-glass-border"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
