'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BUBBLE_COUNT = 12;
const VAPOR_COUNT = 8;
const FLASK_WIDTH = 280;
const FLASK_HEIGHT = 340;

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function FlaskAnimation() {
  const [bubbles, setBubbles] = useState<{ id: number; x: number; size: number; delay: number; duration: number }[]>([]);
  const [vapors, setVapors] = useState<{ id: number; x: number; size: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    const b = Array.from({ length: BUBBLE_COUNT }, (_, i) => ({
      id: i,
      x: randomBetween(70, 200),
      size: randomBetween(4, 14),
      delay: randomBetween(0, 4),
      duration: randomBetween(2.5, 5),
    }));
    setBubbles(b);

    const v = Array.from({ length: VAPOR_COUNT }, (_, i) => ({
      id: i,
      x: randomBetween(110, 175),
      size: randomBetween(6, 18),
      delay: randomBetween(0, 3),
      duration: randomBetween(3, 6),
    }));
    setVapors(v);
  }, []);

  return (
    <div className="relative w-[280px] h-[340px] mx-auto">
      <svg viewBox={`0 0 ${FLASK_WIDTH} ${FLASK_HEIGHT}`} className="w-full h-full">
        <defs>
          <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00C2CB" stopOpacity={0.6} />
            <stop offset="50%" stopColor="#0EA5E9" stopOpacity={0.7} />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.8} />
          </linearGradient>
          <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.08} />
            <stop offset="30%" stopColor="#ffffff" stopOpacity={0.02} />
            <stop offset="70%" stopColor="#ffffff" stopOpacity={0.02} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0.06} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Flask body */}
        <path
          d="M140 50 L140 90 Q140 100 148 110 L198 200 Q210 220 210 250 
             Q210 300 170 320 Q140 330 140 330 Q140 330 110 320 
             Q70 300 70 250 Q70 220 82 200 L132 110 Q140 100 140 90 Z"
          fill="rgba(255,255,255,0.03)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="2"
        />

        {/* Glass highlight */}
        <path
          d="M140 50 L140 90 Q140 100 148 110 L198 200 Q210 220 210 250 
             Q210 300 170 320 Q140 330 140 330 Q140 330 110 320 
             Q70 300 70 250 Q70 220 82 200 L132 110 Q140 100 140 90 Z"
          fill="url(#glassGrad)"
        />

        {/* Liquid */}
        <motion.path
          d="M78 250 Q78 230 88 215 L132 130 Q140 115 140 105 L140 105 Q140 115 148 130 L192 215 Q202 230 202 250 Q202 300 170 320 Q140 330 140 330 Q140 330 110 320 Q78 300 78 250 Z"
          fill="url(#liquidGrad)"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <animate attributeName="d" dur="4s" repeatCount="indefinite" values="
            M78 250 Q78 230 88 215 L132 130 Q140 115 140 105 L140 105 Q140 115 148 130 L192 215 Q202 230 202 250 Q202 300 170 320 Q140 330 140 330 Q140 330 110 320 Q78 300 78 250 Z;
            M78 248 Q78 228 88 213 L132 128 Q140 113 140 103 L140 103 Q140 113 148 128 L192 213 Q202 228 202 248 Q202 298 170 318 Q140 328 140 328 Q140 328 110 318 Q78 298 78 248 Z;
            M78 252 Q78 232 88 217 L132 132 Q140 117 140 107 L140 107 Q140 117 148 132 L192 217 Q202 232 202 252 Q202 302 170 322 Q140 332 140 332 Q140 332 110 322 Q78 302 78 252 Z;
            M78 250 Q78 230 88 215 L132 130 Q140 115 140 105 L140 105 Q140 115 148 130 L192 215 Q202 230 202 250 Q202 300 170 320 Q140 330 140 330 Q140 330 110 320 Q78 300 78 250 Z
          " />
        </motion.path>

        {/* Flask neck */}
        <rect x="133" y="30" width="14" height="25" rx="2" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />

        {/* Highlight on neck */}
        <rect x="136" y="35" width="5" height="15" rx="1" fill="rgba(255,255,255,0.08)" />
        <rect x="139" y="38" width="2" height="10" rx="1" fill="rgba(255,255,255,0.12)" />

        {/* Rim */}
        <rect x="127" y="26" width="26" height="6" rx="3" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

        {/* Bubbles */}
        {bubbles.map((b) => (
          <motion.circle
            key={`b-${b.id}`}
            r={b.size / 2}
            fill={b.id % 3 === 0 ? '#00C2CB' : b.id % 3 === 1 ? '#60A5FA' : '#93C5FD'}
            opacity={0.5}
            initial={{ cy: 300, cx: b.x }}
            animate={{
              cy: [300, 110],
              opacity: [0.5, 0.2],
            }}
            transition={{
              duration: b.duration,
              delay: b.delay,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            filter="url(#glow)"
          />
        ))}

        {/* Reaction glow */}
        <motion.ellipse
          cx="140"
          cy="290"
          rx="50"
          ry="20"
          fill="#00C2CB"
          opacity={0.08}
          animate={{ opacity: [0.05, 0.15, 0.05], ry: [20, 25, 20] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.ellipse
          cx="140"
          cy="290"
          rx="30"
          ry="10"
          fill="#00C2CB"
          opacity={0.12}
          animate={{ opacity: [0.08, 0.2, 0.08], ry: [10, 15, 10] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
      </svg>

      {/* Vapors (HTML elements for z-index) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {vapors.map((v) => (
          <motion.div
            key={`v-${v.id}`}
            className="absolute rounded-full bg-gradient-to-t from-cyan-400/20 to-transparent"
            style={{
              width: v.size,
              height: v.size * 1.5,
              left: v.x - v.size / 2,
              top: 20,
            }}
            initial={{ y: 25, opacity: 0.3, x: 0 }}
            animate={{
              y: [-5, -40],
              opacity: [0.3, 0],
              x: [0, v.id % 2 === 0 ? 8 : -8],
            }}
            transition={{
              duration: v.duration,
              delay: v.delay,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}
