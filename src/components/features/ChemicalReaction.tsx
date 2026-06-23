'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Bubble { x: number; y: number; r: number; speed: number; wobble: number; wobbleSpeed: number; wobbleAmp: number; alive: boolean }
interface Particle { x: number; y: number; r: number; vx: number; vy: number; alpha: number; alive: boolean }
interface Vapor { x: number; y: number; r: number; vy: number; alpha: number; alive: boolean }
interface Drop { x: number; y: number; r: number; vx: number; vy: number; alpha: number; alive: boolean }

type Step = 'pouring' | 'powder' | 'reacting' | 'peaking' | 'fading' | 'flooding' | 'collecting';

const BEAKER_W = 200;
const BEAKER_H = 260;
const NECK_W = 40;
const NECK_H = 40;

export default function ChemicalReaction() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<Step>('pouring');
  const [floodProgress, setFloodProgress] = useState(0);

  const stepRef = useRef<Step>('pouring');
  const frameRef = useRef(0);
  const timeRef = useRef(0);
  const liquidLevelRef = useRef(0);
  const shakeRef = useRef(0);
  const bubblesRef = useRef<Bubble[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const vaporsRef = useRef<Vapor[]>([]);
  const dropsRef = useRef<Drop[]>([]);
  const foamHeightRef = useRef(0);
  const intensityRef = useRef(0);
  const floodRef = useRef(0);
  const startTimeRef = useRef(0);

  // Beaker position (proportional within canvas)
  const getBeakerPos = (w: number, h: number) => ({
    x: w * 0.55,
    y: h * 0.15,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    // Auto-start
    startTimeRef.current = performance.now();

    let animId: number;

    const render = (timestamp: number) => {
      const dt = Math.min((timestamp - (frameRef.current || timestamp)) / 1000, 0.04);
      frameRef.current = timestamp;
      timeRef.current += dt;

      const W = canvas.width;
      const H = canvas.height;
      const bp = getBeakerPos(W, H);
      const bx = bp.x;
      const by = bp.y;
      const bw = BEAKER_W;
      const bh = BEAKER_H;
      const neckX = bx + bw / 2 - NECK_W / 2;

      const s = stepRef.current;

      // --- State machine ---
      if (s === 'pouring') {
        const t = Math.min(timeRef.current / 2, 1);
        liquidLevelRef.current = t * 0.4;
        if (timeRef.current >= 2) {
          stepRef.current = 'powder';
          setStep('powder');
          timeRef.current = 0;
        }
      }

      if (s === 'powder') {
        const t = timeRef.current;
        if (t < 1.5 && Math.random() < 0.4) {
          particlesRef.current.push({
            x: bx + bw / 2 + (Math.random() - 0.5) * 40,
            y: by - 10,
            r: 1.5 + Math.random() * 2,
            vx: (Math.random() - 0.5) * 20,
            vy: 80 + Math.random() * 60,
            alpha: 1,
            alive: true,
          });
        }
        if (t >= 1.5) {
          stepRef.current = 'reacting';
          setStep('reacting');
          timeRef.current = 0;
          intensityRef.current = 0;
        }
      }

      if (s === 'reacting' || s === 'peaking' || s === 'fading') {
        const t = timeRef.current;
        if (s === 'reacting') {
          intensityRef.current = Math.min(t / 3, 1);
          if (t >= 3) {
            stepRef.current = 'peaking';
            setStep('peaking');
            timeRef.current = 0;
          }
        } else if (s === 'peaking') {
          intensityRef.current = 1;
          shakeRef.current = Math.sin(t * 30) * 2 * (1 - t / 4);
          if (t >= 4) {
            stepRef.current = 'fading';
            setStep('fading');
            timeRef.current = 0;
          }
        } else if (s === 'fading') {
          intensityRef.current = Math.max(1 - t / 3, 0);
          shakeRef.current = 0;
          foamHeightRef.current *= 0.97;
          if (t >= 3) {
            stepRef.current = 'flooding';
            setStep('flooding');
            timeRef.current = 0;
            floodRef.current = 0;
          }
        }

        const intensity = intensityRef.current;
        if (Math.random() < 40 * intensity * dt) {
          bubblesRef.current.push({
            x: bx + 20 + Math.random() * (bw - 40),
            y: by + bh - 20,
            r: 2 + Math.random() * 6 * intensity,
            speed: 40 + Math.random() * 80 * intensity,
            wobble: 0,
            wobbleSpeed: 2 + Math.random() * 3,
            wobbleAmp: 5 + Math.random() * 15,
            alive: true,
          });
        }
        if (Math.random() < 20 * intensity * dt) {
          vaporsRef.current.push({
            x: bx + 30 + Math.random() * (bw - 60),
            y: by + 10,
            r: 8 + Math.random() * 20 * intensity,
            vy: -20 - Math.random() * 30,
            alpha: 0.3 * intensity,
            alive: true,
          });
        }
        foamHeightRef.current = Math.min(foamHeightRef.current + intensity * dt * 30, 50 * intensity);
      }

      // --- Flooding phase ---
      if (s === 'flooding') {
        const t = timeRef.current;
        const progress = Math.min(t / 3, 1);
        floodRef.current = progress;
        setFloodProgress(progress);

        // Spawn water drops flying outward
        if (progress < 0.8 && Math.random() < 0.3) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 100 + Math.random() * 300;
          dropsRef.current.push({
            x: bx + bw / 2 + (Math.random() - 0.5) * bw * 0.5,
            y: by + bh * 0.6 + (Math.random() - 0.5) * bh * 0.3,
            r: 2 + Math.random() * 6,
            vx: Math.cos(angle) * speed * (0.5 + progress * 2),
            vy: Math.sin(angle) * speed * (0.5 + progress * 2) - 100,
            alpha: 0.7 + Math.random() * 0.3,
            alive: true,
          });
        }

        if (t >= 3) {
          stepRef.current = 'collecting';
          setStep('collecting');
          timeRef.current = 0;
        }
      }

      // --- Collecting phase ---
      if (s === 'collecting') {
        const t = timeRef.current;
        const progress = Math.min(t / 3, 1);
        floodRef.current = Math.max(1 - progress, 0);
        setFloodProgress(Math.max(1 - progress, 0));

        // Move drops back toward beaker center
        for (const d of dropsRef.current) {
          if (!d.alive) continue;
          const dx = bx + bw / 2 - d.x;
          const dy = by + bh / 2 - d.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 5) {
            const pull = 80 + progress * 200;
            d.vx += (dx / dist) * pull * dt;
            d.vy += (dy / dist) * pull * dt;
            d.vy += 100 * dt; // gravity
            d.r *= 0.995;
          }
          if (dist < 30) d.alpha *= 0.95;
          if (d.alpha < 0.02 || d.r < 0.5) d.alive = false;
        }

        if (t >= 3) {
          // Reset everything
          timeRef.current = 0;
          bubblesRef.current = [];
          particlesRef.current = [];
          vaporsRef.current = [];
          dropsRef.current = [];
          foamHeightRef.current = 0;
          intensityRef.current = 0;
          liquidLevelRef.current = 0;
          shakeRef.current = 0;
          floodRef.current = 0;
          stepRef.current = 'pouring';
          setStep('pouring');
        }
      }

      // --- Update particles ---
      for (const b of bubblesRef.current) {
        if (!b.alive) continue;
        b.y -= b.speed * dt;
        b.wobble += b.wobbleSpeed * dt;
        b.x += Math.sin(b.wobble) * b.wobbleAmp * dt;
        if (b.y < by + 20) b.alive = false;
        if (b.x < bx + 5 || b.x > bx + bw - 5) b.alive = false;
        if (s === 'fading' && intensityRef.current < 0.2) { b.r *= 0.98; if (b.r < 0.5) b.alive = false; }
      }
      bubblesRef.current = bubblesRef.current.filter((b) => b.alive);

      for (const p of particlesRef.current) {
        if (!p.alive) continue;
        p.vy += 200 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const liquidTop = by + bh - (bh * liquidLevelRef.current);
        if (p.y >= liquidTop) {
          p.vy *= -0.3; p.vx *= 0.5; p.y = liquidTop - 2; p.alpha *= 0.92;
          if (p.alpha < 0.05) p.alive = false;
        }
        if (p.x < bx || p.x > bx + bw || p.y > by + bh) p.alive = false;
      }
      particlesRef.current = particlesRef.current.filter((p) => p.alive);

      for (const v of vaporsRef.current) {
        if (!v.alive) continue;
        v.y += v.vy * dt; v.x += (Math.random() - 0.5) * 15 * dt;
        v.alpha -= 0.2 * dt; v.r *= 1.01;
        if (v.alpha < 0.01) v.alive = false;
      }
      vaporsRef.current = vaporsRef.current.filter((v) => v.alive);

      for (const d of dropsRef.current) {
        if (!d.alive) continue;
        const col = s === 'collecting';
        if (!col) {
          d.vy += 150 * dt;
          d.x += d.vx * dt;
          d.y += d.vy * dt;
          d.alpha *= 0.997;
          d.vx *= 0.98;
          if (d.y > H + 50 || d.x < -50 || d.x > W + 50) d.alive = false;
        } else {
          d.x += d.vx * dt;
          d.y += d.vy * dt;
          d.vx *= 0.95;
          d.vy *= 0.95;
          if (d.alpha < 0.02) d.alive = false;
        }
      }
      dropsRef.current = dropsRef.current.filter((d) => d.alive);

      // --- DRAW ---
      ctx.clearRect(0, 0, W, H);

      // --- Flood water (behind everything) ---
      const flood = floodRef.current;
      if (flood > 0.01) {
        // Darken background
        ctx.fillStyle = `rgba(0, 194, 203, ${flood * 0.06})`;
        ctx.fillRect(0, 0, W, H);

        // Water surface rising from bottom
        const waveH = flood * H * 0.6;
        const waterY = H - waveH;

        // Water body
        const wg = ctx.createLinearGradient(0, waterY, 0, H);
        wg.addColorStop(0, `rgba(0, 194, 203, ${flood * 0.15})`);
        wg.addColorStop(0.5, `rgba(0, 150, 200, ${flood * 0.25})`);
        wg.addColorStop(1, `rgba(0, 100, 180, ${flood * 0.3})`);
        ctx.fillStyle = wg;
        ctx.beginPath();
        ctx.moveTo(0, H);
        for (let x = 0; x <= W; x += 4) {
          const wy = waterY + Math.sin(x * 0.01 + timeRef.current * 2) * 8 * flood
            + Math.sin(x * 0.025 + timeRef.current * 3) * 4 * flood;
          ctx.lineTo(x, wy);
        }
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fill();

        // Water surface highlight
        ctx.beginPath();
        for (let x = 0; x <= W; x += 3) {
          const wy = waterY + Math.sin(x * 0.01 + timeRef.current * 2) * 8 * flood
            + Math.sin(x * 0.025 + timeRef.current * 3) * 4 * flood;
          if (x === 0) ctx.moveTo(x, wy + 1);
          else ctx.lineTo(x, wy + 1);
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${flood * 0.15})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Extra wave layers
        for (let layer = 1; layer <= 3; layer++) {
          const ly = waterY + layer * (waveH / 4);
          ctx.beginPath();
          for (let x = 0; x <= W; x += 6) {
            const wy = ly + Math.sin(x * 0.015 + timeRef.current * (1.5 + layer * 0.5) + layer * 2) * (6 - layer) * flood;
            if (x === 0) ctx.moveTo(x, wy);
            else ctx.lineTo(x, wy);
          }
          ctx.strokeStyle = `rgba(255, 255, 255, ${flood * (0.06 - layer * 0.015)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Floating particles on water surface
        for (let i = 0; i < Math.floor(flood * 20); i++) {
          const px = (i * 137 + timeRef.current * 30 * (i % 2 === 0 ? 1 : -1)) % W;
          const py = waterY + Math.sin(px * 0.01 + timeRef.current * 2) * 8 * flood + Math.sin(i * 2.7) * 5;
          ctx.beginPath();
          ctx.arc(px, py, 1 + Math.random() * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${flood * 0.2})`;
          ctx.fill();
        }
      }

      // --- Beaker glow ---
      if (intensityRef.current > 0) {
        const glow = ctx.createRadialGradient(
          bx + bw / 2, by + bh / 2, 10,
          bx + bw / 2, by + bh / 2, bw * 0.8
        );
        glow.addColorStop(0, `rgba(0, 194, 203, ${0.15 * intensityRef.current})`);
        glow.addColorStop(1, 'rgba(0, 194, 203, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(bx - 50, by - 30, bw + 100, bh + 60);
      }

      ctx.save();
      if (shakeRef.current) ctx.translate(Math.sin(shakeRef.current) * 2, 0);

      // --- Liquid ---
      const liquidH = bh * liquidLevelRef.current;
      const liquidTop = by + bh - liquidH;
      const foamH = foamHeightRef.current;
      const foamTop = liquidTop - foamH;

      if (liquidH > 0 || foamH > 0) {
        const lg = ctx.createLinearGradient(bx, liquidTop, bx, by + bh);
        lg.addColorStop(0, 'rgba(0, 194, 203, 0.5)');
        lg.addColorStop(0.5, 'rgba(14, 165, 233, 0.6)');
        lg.addColorStop(1, 'rgba(59, 130, 246, 0.7)');

        ctx.beginPath();
        ctx.moveTo(bx + 8, foamTop);
        ctx.lineTo(bx + 8, by + bh - 8);
        ctx.lineTo(bx + bw - 8, by + bh - 8);
        ctx.lineTo(bx + bw - 8, foamTop);
        const waveAmp = intensityRef.current > 0 ? 3 : 1;
        for (let x = bx + bw - 8; x >= bx + 8; x -= 2) {
          const wy = foamTop + Math.sin(x * 0.02 + timeRef.current * 3) * waveAmp;
          ctx.lineTo(x, wy);
        }
        ctx.closePath();
        ctx.fillStyle = lg;
        ctx.fill();

        // Foam
        if (foamH > 2) {
          ctx.beginPath();
          ctx.moveTo(bx + 10, foamTop);
          for (let x = bx + 10; x <= bx + bw - 10; x += 3) {
            const wy = foamTop + Math.sin(x * 0.1 + timeRef.current * 4) * foamH * 0.15;
            ctx.lineTo(x, wy);
          }
          ctx.lineTo(bx + bw - 10, liquidTop);
          ctx.lineTo(bx + 10, liquidTop);
          ctx.closePath();
          const fg = ctx.createLinearGradient(bx, foamTop, bx, liquidTop);
          const fa = intensityRef.current;
          fg.addColorStop(0, `rgba(255, 255, 255, ${0.7 * fa})`);
          fg.addColorStop(0.5, `rgba(230, 255, 255, ${0.5 * fa})`);
          fg.addColorStop(1, `rgba(200, 240, 255, ${0.3 * fa})`);
          ctx.fillStyle = fg;
          ctx.fill();

          if (intensityRef.current > 0.5) {
            for (let i = 0; i < Math.floor(intensityRef.current * 8); i++) {
              const ox = bx + 15 + Math.random() * (bw - 30);
              const oy = foamTop - 5 - Math.random() * 15 * intensityRef.current;
              const or = 3 + Math.random() * 6;
              ctx.beginPath();
              ctx.arc(ox, oy, or, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 255, 255, ${0.3 * intensityRef.current})`;
              ctx.fill();
            }
          }
        }
      }

      // Bubbles
      for (const b of bubblesRef.current) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        const ba = 0.3 + b.r / 15;
        ctx.fillStyle = `rgba(255, 255, 255, ${ba})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(0, 194, 203, ${ba * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${ba * 0.6})`;
        ctx.fill();
      }

      // Powder
      for (const p of particlesRef.current) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.9})`;
        ctx.fill();
      }

      // Vapors
      for (const v of vaporsRef.current) {
        ctx.beginPath();
        ctx.arc(v.x, v.y, v.r, 0, Math.PI * 2);
        const vg = ctx.createRadialGradient(v.x, v.y, 0, v.x, v.y, v.r);
        vg.addColorStop(0, `rgba(200, 230, 255, ${v.alpha * 0.3})`);
        vg.addColorStop(1, 'rgba(200, 230, 255, 0)');
        ctx.fillStyle = vg;
        ctx.fill();
      }

      // Drops (during flood/collect)
      for (const d of dropsRef.current) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 194, 203, ${d.alpha * 0.5})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(d.x - d.r * 0.2, d.y - d.r * 0.2, d.r * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${d.alpha * 0.3})`;
        ctx.fill();
      }

      ctx.restore();

      // --- Beaker glass ---
      ctx.save();
      if (shakeRef.current) ctx.translate(Math.sin(shakeRef.current) * 2, 0);

      ctx.beginPath();
      const rimX = neckX - 4;
      ctx.moveTo(neckX, by);
      ctx.lineTo(neckX, by - NECK_H);
      ctx.lineTo(neckX + NECK_W, by - NECK_H);
      ctx.lineTo(neckX + NECK_W, by);
      ctx.lineTo(bx + bw - 10, by + 10);
      ctx.quadraticCurveTo(bx + bw + 5, by + 30, bx + bw - 5, by + bh - 10);
      ctx.quadraticCurveTo(bx + bw / 2, by + bh + 8, bx + 5, by + bh - 10);
      ctx.quadraticCurveTo(bx - 5, by + 30, bx + 10, by + 10);
      ctx.closePath();
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
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[520px] h-[380px] overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      {/* Phase label */}
      <motion.div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-cyan-400/60 font-medium"
        key={step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {step === 'pouring' && 'إضافة حمض الأسيتيك...'}
        {step === 'powder' && 'إضافة بيكربونات الصوديوم...'}
        {step === 'reacting' && 'تفاعل حمضي!'}
        {step === 'peaking' && 'ذروة التفاعل!'}
        {step === 'fading' && 'التفاعل يخبو...'}
        {step === 'flooding' && 'فيضان!'}
        {step === 'collecting' && 'تجمع السائل...'}
      </motion.div>
    </div>
  );
}
