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
            <h1 className="text-4xl font-bold text-slate-900 mb-6">Get In Touch</h1>
            <p className="text-slate-600 mb-8">
              Ready to start? Have a question? We typically reply within 1 hour during business hours.
            </p>

            <div className="space-y-6 mb-10">
              <a 
                href="https://wa.me/263770000000" 
                className="flex items-center gap-4 p-6 bg-green-50 rounded-xl border border-green-100 hover:shadow-md transition-all group"
              >
                <div className="bg-green-500 text-white p-3 rounded-full group-hover:scale-110 transition-transform">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">WhatsApp Us (Fastest)</h3>
                  <p className="text-sm text-slate-600">Click to chat instantly</p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-6 bg-white rounded-xl border border-slate-100">
                <div className="bg-slate-100 text-slate-600 p-3 rounded-full">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Business Hours</h3>
                  <p className="text-sm text-slate-600">Mon - Fri: 09:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
