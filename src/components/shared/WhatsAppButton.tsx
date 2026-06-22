'use client';

import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/201033558125"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 shadow-lg shadow-green-500/30 flex items-center justify-center group transition-all duration-300 hover:scale-110"
      aria-label="تواصل عبر واتساب"
    >
      <FaWhatsapp className="w-7 h-7 text-white" />
      <span className="absolute left-16 bg-white/10 backdrop-blur-xl border border-white/20 text-white text-sm px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        01033558125
      </span>
    </motion.a>
  );
}
