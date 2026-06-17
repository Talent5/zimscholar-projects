import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export const WhatsAppFloat: React.FC = () => {
  return (
    <motion.a
      href="https://wa.me/26784286089?text=Hello%2C%20I%27d%20like%20to%20inquire%20about%20an%20academic%20project."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25 border border-green-400/20"
      aria-label="Chat on WhatsApp"
      initial={{ opacity: 0, y: 60, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
      </span>
      <MessageCircle size={22} />
      <span className="font-semibold text-sm hidden sm:inline">Chat with us</span>
    </motion.a>
  );
};
