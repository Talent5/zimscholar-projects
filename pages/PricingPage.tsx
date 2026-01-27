import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
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
      <div className="fade-in py-12">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="inline-block spin" size={48} />
          <p className="mt-4 text-slate-600">Loading pricing...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fade-in py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600">{error}</p>
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
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Transparent Pricing</h1>
          <p className="text-lg text-slate-600">
            Choose a package that fits your needs. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
          {pricingTiers.map((tier) => (
            <div 
              key={tier._id} 
              className={`relative rounded-2xl p-8 transition-transform ${
                tier.recommended 
                  ? 'bg-white shadow-2xl border-2 border-brand-500 scale-105 md:-mt-4 z-10' 
                  : 'bg-white shadow-lg border border-slate-100'
              }`}
            >
              {tier.recommended && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-500 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-900 mb-2">{tier.name}</h3>
              <div className="text-3xl font-black text-slate-900 mb-2">{tier.price}</div>
              <p className="text-sm text-slate-500 mb-6 h-10">{tier.description}</p>
              
              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
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
        </div>

        <div className="mt-16 text-center text-sm text-slate-500 max-w-2xl mx-auto">
          <p>* Prices may vary based on specific hardware requirements (for IoT) or extreme complexity. Contact us for an exact quote.</p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
