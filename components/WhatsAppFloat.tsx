import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppFloat: React.FC = () => {
  return (
    <a
      href="https://wa.me/26784286089?text=Hello%2C%20I%27d%20like%20to%20inquire%20about%20an%20academic%20project."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-full shadow-2xl hover:bg-green-600 transition-transform hover:scale-105 animate-bounce-slight"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={24} fill="currentColor" />
      <span className="font-bold hidden sm:inline">Chat with us</span>
    </a>
  );
};