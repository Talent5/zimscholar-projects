import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
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
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/scholarxafrica-logo.png" 
                alt="ScholarXafrica Logo" 
                className="h-8 w-auto"
              />
              <h3 className="text-2xl font-bold text-white">ScholarXafrica</h3>
            </div>
            <p className="mb-4">
              Empowering students with professional academic project support in Data Science, IoT, and Software Engineering.
            </p>
            <p className="text-sm text-slate-500">
              Harare, Zimbabwe
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to}
                    className="hover:text-brand-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Contact</h4>
            <p className="mb-2">Mon - Fri: 9am - 6pm (GMT+2)</p>
            <p className="mb-2">Email: support@zimscholar.dev</p>
            <a 
              href="https://wa.me/26784286089" 
              className="text-green-400 hover:text-green-300 font-bold inline-flex items-center gap-2 mt-2"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} ScholarXafrica Projects. All rights reserved.</p>
          <p className="mt-2 text-slate-500">
            Disclaimer: Our services are intended for learning and reference purposes only. 
            We do not condone plagiarism.
          </p>
        </div>
      </div>
    </footer>
  );
};