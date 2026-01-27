import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { getApiUrl, API_CONFIG } from '../config/api.config';
import { useFetch } from '../hooks/useFetch';

interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string;
  features: string[];
  category: string;
  pricing: {
    basic?: number;
    standard?: number;
    premium?: number;
  };
}

const Services: React.FC = () => {
  const { data: services, loading, error, refetch } = useFetch<Service[]>(
    getApiUrl(API_CONFIG.PUBLIC.SERVICES)
  );

  if (loading) {
    return (
      <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <p>Loading services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <p style={{ color: '#dc2626', marginBottom: '1rem' }}>Failed to load services</p>
        <button
          onClick={refetch}
          style={{
            padding: '0.5rem 1rem',
            background: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section style={{ padding: '4rem 1rem', background: '#f9fafb' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
            Our Services
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
            Professional academic project services tailored for Zimbabwe students
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {(services || []).map(service => (
            <div
              key={service._id}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '2rem',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                padding: '0.5rem 1rem',
                background: '#dbeafe',
                color: '#1e40af',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '600',
                display: 'inline-block',
                marginBottom: '1rem'
              }}>
                {service.category}
              </div>

              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
                {service.title}
              </h3>

              <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                {service.description}
              </p>

              {service.features && service.features.length > 0 && (
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem' }}>
                  {service.features.slice(0, 4).map((feature, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0',
                        color: '#374151',
                        fontSize: '0.9375rem'
                      }}
                    >
                      <CheckCircle size={18} style={{ color: '#10b981', flexShrink: 0 }} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              {service.pricing && (Object.keys(service.pricing).length > 0) && (
                <div style={{
                  padding: '1rem',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {service.pricing.basic && (
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600' }}>BASIC</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827' }}>
                          ${service.pricing.basic}
                        </div>
                      </div>
                    )}
                    {service.pricing.standard && (
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600' }}>STANDARD</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827' }}>
                          ${service.pricing.standard}
                        </div>
                      </div>
                    )}
                    {service.pricing.premium && (
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600' }}>PREMIUM</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827' }}>
                          ${service.pricing.premium}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                style={{
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  background: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#4338ca';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#4f46e5';
                }}
              >
                Get Started
                <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
