'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface Bubble {
  x: number; y: number; r: number; speed: number; wobble: number; wobbleSpeed: number; wobbleAmp: number; alive: boolean;
}
interface Particle {
  x: number; y: number; r: number; vx: number; vy: number; alpha: number; alive: boolean;
}
interface Vapor {
  x: number; y: number; r: number; vy: number; alpha: number; alive: boolean;
}

type Step = 'idle' | 'pouring' | 'powder' | 'reacting' | 'peaking' | 'fading' | 'done';

const BEAKER_W = 200;
const BEAKER_H = 260;
const BEAKER_X = 160;
const BEAKER_Y = 60;
const NECK_W = 40;
const NECK_H = 40;

export default function ChemicalReaction() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [step, setStep] = useState<Step>('idle');
  const [liquidLevel, setLiquidLevel] = useState(0);
  const [shake, setShake] = useState(0);
  const stepRef = useRef<Step>('idle');
  const frameRef = useRef(0);
  const timeRef = useRef(0);

  // Particles
  const bubblesRef = useRef<Bubble[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const vaporsRef = useRef<Vapor[]>([]);
  const foamHeightRef = useRef(0);
  const reactionIntensityRef = useRef(0);

  const startReaction = useCallback(() => {
    if (stepRef.current !== 'idle') return;
    setStep('pouring');
    stepRef.current = 'pouring';
    timeRef.current = 0;
  }, []);

  const resetReaction = useCallback(() => {
    setStep('idle');
    stepRef.current = 'idle';
    setLiquidLevel(0);
    setShake(0);
    bubblesRef.current = [];
    particlesRef.current = [];
    vaporsRef.current = [];
    foamHeightRef.current = 0;
    reactionIntensityRef.current = 0;
    timeRef.current = 0;
  }, []);

  // --- Canvas render loop ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 520;
    canvas.height = 380;

    let animId: number;

    const render = (timestamp: number) => {
      if (!ctx) return;
      const dt = Math.min((timestamp - (frameRef.current || timestamp)) / 1000, 0.05);
      frameRef.current = timestamp;
      timeRef.current += dt;

      const s = stepRef.current;

      // --- State machine ---
      if (s === 'pouring') {
        const t = Math.min(timeRef.current / 2, 1);
        setLiquidLevel(t * 0.4);
        if (timeRef.current >= 2) {
          setStep('powder');
          stepRef.current = 'powder';
          timeRef.current = 0;
        }
      }

      if (s === 'powder') {
        const t = timeRef.current;
        // Spawn falling particles
        if (t < 1.5 && Math.random() < 0.4) {
          particlesRef.current.push({
            x: BEAKER_X + BEAKER_W / 2 + (Math.random() - 0.5) * 40,
            y: BEAKER_Y - 10,
            r: 1.5 + Math.random() * 2,
            vx: (Math.random() - 0.5) * 20,
            vy: 80 + Math.random() * 60,
            alpha: 1,
            alive: true,
          });
        }
        if (t >= 1.5) {
          setStep('reacting');
          stepRef.current = 'reacting';
          timeRef.current = 0;
          reactionIntensityRef.current = 0;
        }
      }

      if (s === 'reacting' || s === 'peaking' || s === 'fading') {
        const t = timeRef.current;
        let intensity = 0;

        if (s === 'reacting') {
          intensity = Math.min(t / 3, 1);
          reactionIntensityRef.current = intensity;
          if (t >= 3) {
            setStep('peaking');
            stepRef.current = 'peaking';
            timeRef.current = 0;
          }
        } else if (s === 'peaking') {
          intensity = 1;
          reactionIntensityRef.current = 1;
          setShake(Math.sin(t * 30) * 2 * (1 - t / 4));
          if (t >= 4) {
            setStep('fading');
            stepRef.current = 'fading';
            timeRef.current = 0;
          }
        } else if (s === 'fading') {
          intensity = Math.max(1 - t / 3, 0);
          reactionIntensityRef.current = intensity;
          setShake(0);
          foamHeightRef.current = foamHeightRef.current * 0.97;
          if (t >= 3) {
            setStep('done');
            stepRef.current = 'done';
            foamHeightRef.current = 0;
            setLiquidLevel(0);
            setShake(0);
          }
        }

        // Spawn bubbles
        const bubbleRate = 40 * intensity;
        if (Math.random() < bubbleRate * dt) {
          const bx = BEAKER_X + 20 + Math.random() * (BEAKER_W - 40);
          const by = BEAKER_Y + BEAKER_H - 20;
          bubblesRef.current.push({
            x: bx, y: by, r: 2 + Math.random() * 6 * intensity,
            speed: 40 + Math.random() * 80 * intensity,
            wobble: 0, wobbleSpeed: 2 + Math.random() * 3,
            wobbleAmp: 5 + Math.random() * 15,
            alive: true,
          });
        }

        // Spawn vapors
        if (Math.random() < 20 * intensity * dt) {
          vaporsRef.current.push({
            x: BEAKER_X + 30 + Math.random() * (BEAKER_W - 60),
            y: BEAKER_Y + 10,
            r: 8 + Math.random() * 20 * intensity,
            vy: -20 - Math.random() * 30,
            alpha: 0.3 * intensity,
            alive: true,
          });
        }

        // Foam
        foamHeightRef.current = Math.min(
          foamHeightRef.current + intensity * dt * 30,
          50 * intensity
        );
      }

      // --- Update particles ---
      // Bubbles
      for (const b of bubblesRef.current) {
        if (!b.alive) continue;
        b.y -= b.speed * dt;
        b.wobble += b.wobbleSpeed * dt;
        b.x += Math.sin(b.wobble) * b.wobbleAmp * dt;
        if (b.y < BEAKER_Y + 20) b.alive = false;
        if (b.x < BEAKER_X + 5 || b.x > BEAKER_X + BEAKER_W - 5) b.alive = false;
        if (s === 'fading' && reactionIntensityRef.current < 0.2) {
          b.r *= 0.98;
          if (b.r < 0.5) b.alive = false;
        }
      }
      bubblesRef.current = bubblesRef.current.filter((b) => b.alive);

      // Powder particles
      for (const p of particlesRef.current) {
        if (!p.alive) continue;
        p.vy += 200 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        // Splash/bounce at liquid surface
        const liquidTop = BEAKER_Y + BEAKER_H - (BEAKER_H * liquidLevel);
        if (p.y >= liquidTop) {
          p.vy *= -0.3;
          p.vx *= 0.5;
          p.y = liquidTop - 2;
          p.alpha *= 0.92;
          if (p.alpha < 0.05) p.alive = false;
        }
        if (p.x < BEAKER_X || p.x > BEAKER_X + BEAKER_W || p.y > BEAKER_Y + BEAKER_H) {
          p.alive = false;
        }
      }
      particlesRef.current = particlesRef.current.filter((p) => p.alive);

      // Vapors
      for (const v of vaporsRef.current) {
        if (!v.alive) continue;
        v.y += v.vy * dt;
        v.x += (Math.random() - 0.5) * 15 * dt;
        v.alpha -= 0.2 * dt;
        v.r *= 1.01;
        if (v.alpha < 0.01) v.alive = false;
      }
      vaporsRef.current = vaporsRef.current.filter((v) => v.alive);

      // --- Draw ---
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background glow
      if (reactionIntensityRef.current > 0) {
        const glow = ctx.createRadialGradient(
          BEAKER_X + BEAKER_W / 2, BEAKER_Y + BEAKER_H / 2, 10,
          BEAKER_X + BEAKER_W / 2, BEAKER_Y + BEAKER_H / 2, BEAKER_W * 0.8
        );
        glow.addColorStop(0, `rgba(0, 194, 203, ${0.15 * reactionIntensityRef.current})`);
        glow.addColorStop(1, 'rgba(0, 194, 203, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.save();
      // Beaker shake
      if (shake) {
        ctx.translate(Math.sin(shake) * 2, 0);
      }

      // --- Liquid ---
      if (liquidLevel > 0 || foamHeightRef.current > 0) {
        const liquidH = BEAKER_H * liquidLevel;
        const liquidTop = BEAKER_Y + BEAKER_H - liquidH;
        const foamH = foamHeightRef.current;
        const foamTop = liquidTop - foamH;

        // Liquid body
        const liquidGrad = ctx.createLinearGradient(
          BEAKER_X, liquidTop, BEAKER_X, BEAKER_Y + BEAKER_H
        );
        liquidGrad.addColorStop(0, 'rgba(0, 194, 203, 0.5)');
        liquidGrad.addColorStop(0.5, 'rgba(14, 165, 233, 0.6)');
        liquidGrad.addColorStop(1, 'rgba(59, 130, 246, 0.7)');

        ctx.beginPath();
        ctx.moveTo(BEAKER_X + 8, foamTop);
        ctx.lineTo(BEAKER_X + 8, BEAKER_Y + BEAKER_H - 8);
        ctx.lineTo(BEAKER_X + BEAKER_W - 8, BEAKER_Y + BEAKER_H - 8);
        ctx.lineTo(BEAKER_X + BEAKER_W - 8, foamTop);
        // Wavy top surface
        const waveAmp = reactionIntensityRef.current > 0 ? 3 : 1;
        const waveFreq = 0.02;
        const waveSpeed = timeRef.current * 3;
        for (let x = BEAKER_X + BEAKER_W - 8; x >= BEAKER_X + 8; x -= 2) {
          const wy = foamTop + Math.sin(x * waveFreq + waveSpeed) * waveAmp;
          ctx.lineTo(x, wy);
        }
        ctx.closePath();
        ctx.fillStyle = liquidGrad;
        ctx.fill();

        // Foam
        if (foamH > 2) {
          ctx.beginPath();
          ctx.moveTo(BEAKER_X + 10, foamTop);
          for (let x = BEAKER_X + 10; x <= BEAKER_X + BEAKER_W - 10; x += 3) {
            const wy = foamTop + Math.sin(x * 0.1 + timeRef.current * 4) * foamH * 0.15;
            ctx.lineTo(x, wy);
          }
          ctx.lineTo(BEAKER_X + BEAKER_W - 10, liquidTop);
          ctx.lineTo(BEAKER_X + 10, liquidTop);
          ctx.closePath();

          const foamGrad = ctx.createLinearGradient(
            BEAKER_X, foamTop, BEAKER_X, liquidTop
          );
          const fa = reactionIntensityRef.current;
          foamGrad.addColorStop(0, `rgba(255, 255, 255, ${0.7 * fa})`);
          foamGrad.addColorStop(0.5, `rgba(230, 255, 255, ${0.5 * fa})`);
          foamGrad.addColorStop(1, `rgba(200, 240, 255, ${0.3 * fa})`);
          ctx.fillStyle = foamGrad;
          ctx.fill();

          // Foam overflow (bubbles outside top)
          if (reactionIntensityRef.current > 0.5) {
            for (let i = 0; i < Math.floor(reactionIntensityRef.current * 8); i++) {
              const ox = BEAKER_X + 15 + Math.random() * (BEAKER_W - 30);
              const oy = foamTop - 5 - Math.random() * 15 * reactionIntensityRef.current;
              const or = 3 + Math.random() * 6;
              ctx.beginPath();
              ctx.arc(ox, oy, or, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 255, 255, ${0.3 * reactionIntensityRef.current})`;
              ctx.fill();
            }
          }
        }

        // Liquid surface highlight
        ctx.beginPath();
        ctx.moveTo(BEAKER_X + 15, foamTop + 2);
        for (let x = BEAKER_X + 15; x <= BEAKER_X + BEAKER_W - 15; x += 2) {
          const wy = foamTop + 2 + Math.sin(x * 0.05 + timeRef.current * 2) * 1.5;
          ctx.lineTo(x, wy);
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 + 0.1 * reactionIntensityRef.current})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // --- Bubbles ---
      for (const b of bubblesRef.current) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        const ba = 0.3 + b.r / 15;
        ctx.fillStyle = `rgba(255, 255, 255, ${ba})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(0, 194, 203, ${ba * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        // Bubble highlight
        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${ba * 0.6})`;
        ctx.fill();
      }

      // --- Powder particles ---
      for (const p of particlesRef.current) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.9})`;
        ctx.fill();
      }

      // --- Vapors ---
      for (const v of vaporsRef.current) {
        ctx.beginPath();
        ctx.arc(v.x, v.y, v.r, 0, Math.PI * 2);
        const vg = ctx.createRadialGradient(v.x, v.y, 0, v.x, v.y, v.r);
        vg.addColorStop(0, `rgba(200, 230, 255, ${v.alpha * 0.3})`);
        vg.addColorStop(1, `rgba(200, 230, 255, 0)`);
        ctx.fillStyle = vg;
        ctx.fill();
      }

      ctx.restore();

      // --- Beaker glass (drawn last on top of everything) ---
      ctx.save();
      if (shake) {
        ctx.translate(Math.sin(shake) * 2, 0);
      }

      // Beaker body
      const bx = BEAKER_X, by = BEAKER_Y, bw = BEAKER_W, bh = BEAKER_H;
      ctx.beginPath();
      // Neck
      const neckX = bx + bw / 2 - NECK_W / 2;
      ctx.moveTo(neckX, by);
      ctx.lineTo(neckX, by - NECK_H);
      ctx.lineTo(neckX + NECK_W, by - NECK_H);
      ctx.lineTo(neckX + NECK_W, by);
      // Body
      ctx.lineTo(bx + bw - 10, by + 10);
      ctx.quadraticCurveTo(bx + bw + 5, by + 30, bx + bw - 5, by + bh - 10);
      ctx.quadraticCurveTo(bx + bw / 2, by + bh + 8, bx + 5, by + bh - 10);
      ctx.quadraticCurveTo(bx - 5, by + 30, bx + 10, by + 10);
      ctx.closePath();

      // Glass fill
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Glass reflection
      ctx.beginPath();
      ctx.moveTo(bx + 12, by + 25);
      ctx.quadraticCurveTo(bx + 8, by + bh / 2, bx + 15, by + bh - 20);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 6;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(bx + 20, by + 35);
      ctx.quadraticCurveTo(bx + 16, by + bh / 2, bx + 22, by + bh - 30);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Rim
      ctx.beginPath();
      const rimX = neckX - 4;
      ctx.roundRect(rimX, by - NECK_H - 4, NECK_W + 8, 8, 4);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  const isAnimating = step !== 'idle' && step !== 'done';

  return (
    <div className="relative flex flex-col items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-[360px] h-[260px] md:w-[520px] md:h-[380px]"
      />

      <div className="mt-4 md:mt-6">
        <AnimatePresence mode="wait">
          {step === 'idle' && (
            <motion.button
              key="start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={startReaction}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105"
            >
              ابدأ التفاعل
            </motion.button>
          )}
          {step === 'done' && (
            <motion.button
              key="reset"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={resetReaction}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105"
            >
              إعادة التجربة
            </motion.button>
          )}
          {isAnimating && (
            <motion.div
              key="running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-cyan-400 text-sm font-medium"
            >
              {step === 'pouring' && 'جاري إضافة حمض الأسيتيك...'}
              {step === 'powder' && 'جاري إضافة بيكربونات الصوديوم...'}
              {step === 'reacting' && 'التفاعل جاري...'}
              {step === 'peaking' && 'ذروة التفاعل!'}
              {step === 'fading' && 'التفاعل يخبو...'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
