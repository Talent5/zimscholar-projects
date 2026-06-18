import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { getApiUrl } from '../config/api.config';
import { SEO } from '../components/SEO';

interface PricingTier {
  _id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended: boolean;
  isActive: boolean;
}

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl('/api/pricing'));
      if (!response.ok) throw new Error('Failed to fetch pricing');
      const data = await response.json();
      setPricingTiers(data);
    } catch (err) {
      console.error('Error fetching pricing:', err);
      setError('Failed to load pricing. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fade-in py-24">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-neon-cyan" size={48} />
          <p className="text-slate-400 text-sm tracking-wide">Loading pricing...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fade-in py-24">
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in py-12">
      <SEO
        title="Pricing - Affordable Academic Project Services in Zimbabwe"
        description="Transparent pricing for ready-made and custom academic projects. Affordable packages for students in Zimbabwe. Get quality software projects with full source code, documentation, and support. Flexible payment options available."
        keywords="academic project pricing Zimbabwe, affordable software development, project prices Zimbabwe, student pricing, custom project cost Zimbabwe, ready-made project pricing, Zimbabwe student services, affordable tech services Harare"
        canonicalUrl="https://scholarxafrica.com/pricing"
      />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-neon-cyan text-xs font-semibold uppercase tracking-wider mb-4">
            Pricing
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Transparent Pricing
          </h1>
          <p className="text-lg text-slate-500">
            Choose a package that fits your needs. No hidden fees.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start"
        >
          {pricingTiers.map((tier) => (
            <div
              key={tier._id}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                tier.recommended
                  ? 'bg-white border-2 border-neon-cyan shadow-md scale-105 md:-mt-4 z-10'
                  : 'bg-white border border-slate-100 shadow-sm'
              }`}
            >
              {tier.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-neon-cyan text-white text-[11px] font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-bold text-slate-900 mb-2 mt-2">{tier.name}</h3>
              <div className="text-3xl font-bold text-slate-900 mb-2">{tier.price}</div>
              <p className="text-sm text-slate-400 mb-6 min-h-[2.5rem]">{tier.description}</p>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-500">
                    <CheckCircle size={16} className="text-neon-cyan shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                fullWidth
                variant={tier.recommended ? 'primary' : 'outline'}
                onClick={() => navigate('/quote')}
              >
                Choose {tier.name}
              </Button>
            </div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center text-sm text-slate-400 max-w-2xl mx-auto"
        >
          * Prices may vary based on specific hardware requirements (for IoT) or extreme complexity. Contact us for an exact quote.
        </motion.p>
      </div>
    </div>
  );
};

export default PricingPage;
