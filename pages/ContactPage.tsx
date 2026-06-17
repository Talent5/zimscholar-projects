// === C:\Users\Takunda Mundwa\Desktop\zimscholar-projects\pages\ContactPage.tsx ===
import React from 'react';
import { Clock, MessageCircle } from 'lucide-react';
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
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-6">Get In Touch</h1>
            <p className="text-slate-400 mb-8">
              Ready to start? Have a question? We typically reply within 1 hour during business hours.
            </p>

            <div className="space-y-6 mb-10">
              <a 
                href="https://wa.me/263770000000" 
                className="flex items-center gap-4 p-6 glass rounded-xl border border-glass-border hover:shadow-md hover:border-neon-cyan/30 transition-all group"
              >
                <div className="bg-green-500 text-white p-3 rounded-full group-hover:scale-110 transition-transform">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">WhatsApp Us (Fastest)</h3>
                  <p className="text-sm text-slate-400">Click to chat instantly</p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-6 glass rounded-xl border border-glass-border">
                <div className="bg-white/10 text-slate-400 p-3 rounded-full">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Business Hours</h3>
                  <p className="text-sm text-slate-400">Mon - Fri: 09:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass rounded-2xl p-8 border border-glass-border">
            <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
