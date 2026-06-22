'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Atom } from 'lucide-react';
import AuthForms from '@/components/features/AuthForms';
import ParticlesBackground from '@/components/shared/Particles';

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0B1E3D] to-[#0a1628] px-4 py-20">
      <ParticlesBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-sm group-hover:bg-cyan-500/30 transition-all" />
              <Atom className="w-7 h-7 text-cyan-400 relative z-10 group-hover:rotate-180 transition-transform duration-700" />
            </div>
            <span className="text-xl font-bold text-white">كيمستري</span>
          </Link>
        </div>

        <AuthForms mode="register" />
      </motion.div>
    </div>
  );
}
