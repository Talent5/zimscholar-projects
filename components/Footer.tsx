import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Send, MapPin, Clock, ArrowUpRight } from 'lucide-react';

const footerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  }),
};

export const Footer: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const links = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/faq', label: 'FAQ' },
    { to: '/quote', label: 'Get Quote' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <footer ref={ref} className="relative bg-slate-900 border-t border-slate-800 overflow-hidden">
      {/* Top highlight line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-40" />

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            variants={footerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            custom={0}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-neon-cyan flex items-center justify-center">
                <img
                  src="/scholarxafrica-logo.png"
                  alt="ScholarXafrica"
                  className="h-6 w-auto"
                />
              </div>
              <h3 className="text-xl font-bold text-white">ScholarXafrica</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Empowering students across all academic disciplines — from research papers and dissertations to software and engineering projects. Turnitin-checked, plagiarism-free, AI-free. Every time.
            </p>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <MapPin size={14} />
              <span>Harare, Zimbabwe</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            variants={footerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            custom={1}
          >
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-neon-cyan" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-slate-400 hover:text-neon-cyan transition-colors text-sm flex items-center gap-1 group"
                  >
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            variants={footerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            custom={2}
          >
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-neon-cyan" />
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Clock size={14} className="text-slate-400" />
                <span>Mon - Fri: 9am - 6pm (GMT+2)</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Send size={14} className="text-slate-400" />
                <a href="mailto:support@zimscholar.dev" className="hover:text-neon-cyan transition-colors">
                  support@zimscholar.dev
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/26784286089"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-green-400 hover:bg-slate-700 hover:border-green-400/30 transition-all text-sm font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          className="border-t border-slate-800 pt-8 text-center"
          variants={footerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          custom={3}
        >
          <p className="text-slate-500 text-xs">
            &copy; {new Date().getFullYear()} ScholarXafrica Projects. All rights reserved.
          </p>
          <p className="mt-3 text-slate-600 text-[11px] max-w-xl mx-auto leading-relaxed">
            Disclaimer: Our services are intended for learning and reference purposes only. We do not condone plagiarism.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};
