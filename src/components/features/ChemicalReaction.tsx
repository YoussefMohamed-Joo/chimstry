'use client';

import { useEffect, useRef } from 'react';
import { useFloodStore } from '@/store/floodStore';

interface Bubble { x: number; y: number; r: number; speed: number; wobble: number; wobbleSpeed: number; wobbleAmp: number; alive: boolean }
interface Particle { x: number; y: number; r: number; vx: number; vy: number; alpha: number; alive: boolean }
interface Vapor { x: number; y: number; r: number; vy: number; alpha: number; alive: boolean }
interface Drop { x: number; y: number; r: number; vx: number; vy: number; alpha: number; alive: boolean }

type Step = 'pouring' | 'powder' | 'reacting' | 'peaking' | 'fading' | 'flooding' | 'collecting';

// Smaller conical flask (Erlenmeyer) dimensions
const FLASK_BTM_W = 140;   // bottom width
const FLASK_TOP_W = 36;    // top width at neck
const FLASK_H = 190;       // body height
const NECK_H = 35;         // neck height
const FLASK_X = 60;        // left margin
const FLASK_Y = 20;        // top margin

export default function ChemicalReaction() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startFlood = useFloodStore((s) => s.startFlood);
  const setFloodProgress = useFloodStore((s) => s.setProgress);
  const endFlood = useFloodStore((s) => s.endFlood);

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

  const W = 260;
  const H = 300;

  // Erlenmeyer flask path helpers
  function getFlaskPath(ctx: CanvasRenderingContext2D) {
    const cx = FLASK_X + FLASK_BTM_W / 2;
    const neckL = cx - FLASK_TOP_W / 2;
    const neckR = cx + FLASK_TOP_W / 2;
    const bodyTop = FLASK_Y + NECK_H;

    ctx.beginPath();
    // Neck
    ctx.moveTo(neckL, FLASK_Y);
    ctx.lineTo(neckL, bodyTop);
    // Conical body
    ctx.lineTo(FLASK_X + 12, FLASK_Y + FLASK_H);
    ctx.quadraticCurveTo(FLASK_X + FLASK_BTM_W / 2, FLASK_Y + FLASK_H + 12, FLASK_X + FLASK_BTM_W - 12, FLASK_Y + FLASK_H);
    ctx.lineTo(neckR, bodyTop);
    ctx.lineTo(neckR, FLASK_Y);
    ctx.closePath();
  }

  function isInsideFlask(x: number, y: number) {
    const cx = FLASK_X + FLASK_BTM_W / 2;
    const bodyTop = FLASK_Y + NECK_H;
    // Map y to width
    if (y < FLASK_Y || y > FLASK_Y + FLASK_H) return false;
    let w;
    if (y < bodyTop) {
      w = FLASK_TOP_W / 2;
    } else {
      const ratio = (y - bodyTop) / (FLASK_H - NECK_H);
      w = FLASK_TOP_W / 2 + (FLASK_BTM_W / 2 - FLASK_TOP_W / 2) * ratio;
    }
    return x >= cx - w + 4 && x <= cx + w - 4;
  }

  function liquidSurfaceFactory(ctx: CanvasRenderingContext2D, y: number, level: number) {
    const cx = FLASK_X + FLASK_BTM_W / 2;
    const bodyTop = FLASK_Y + NECK_H;
    const ratio = Math.max(0, Math.min(1, (y - bodyTop) / (FLASK_H - NECK_H)));
    const w = FLASK_TOP_W / 2 + (FLASK_BTM_W / 2 - FLASK_TOP_W / 2) * ratio;
    return { lx: cx - w + 6, rx: cx + w - 6 };
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = W;
    canvas.height = H;

    let animId: number;

    const render = (timestamp: number) => {
      if (!ctx) return;
      const dt = Math.min((timestamp - frameRef.current) / 1000 || 0.016, 0.04);
      frameRef.current = timestamp;
      timeRef.current += dt;

      const cx = FLASK_X + FLASK_BTM_W / 2;
      const bodyTop = FLASK_Y + NECK_H;
      const s = stepRef.current;

      // --- State machine ---
      if (s === 'pouring') {
        const t = Math.min(timeRef.current / 2, 1);
        liquidLevelRef.current = t * 0.4;
        if (timeRef.current >= 2) { stepRef.current = 'powder'; timeRef.current = 0; }
      }
      if (s === 'powder') {
        if (timeRef.current < 1.5 && Math.random() < 0.45) {
          particlesRef.current.push({
            x: cx + (Math.random() - 0.5) * 30,
            y: FLASK_Y - 5,
            r: 1.2 + Math.random() * 1.8,
            vx: (Math.random() - 0.5) * 15,
            vy: 70 + Math.random() * 50,
            alpha: 1, alive: true,
          });
        }
        if (timeRef.current >= 1.5) { stepRef.current = 'reacting'; timeRef.current = 0; intensityRef.current = 0; }
      }
      if (s === 'reacting' || s === 'peaking' || s === 'fading') {
        const t = timeRef.current;
        if (s === 'reacting') {
          intensityRef.current = Math.min(t / 2.5, 1);
          if (t >= 2.5) { stepRef.current = 'peaking'; timeRef.current = 0; }
        } else if (s === 'peaking') {
          intensityRef.current = 1;
          shakeRef.current = Math.sin(t * 35) * 1.5 * (1 - t / 3.5);
          if (t >= 3.5) { stepRef.current = 'fading'; timeRef.current = 0; }
        } else if (s === 'fading') {
          intensityRef.current = Math.max(1 - t / 2.5, 0);
          shakeRef.current = 0;
          foamHeightRef.current *= 0.96;
          if (t >= 2.5) {
            stepRef.current = 'flooding';
            timeRef.current = 0;
            floodRef.current = 0;
            startFlood();
          }
        }
        const ina = intensityRef.current;
        if (Math.random() < 45 * ina * dt) {
          bubblesRef.current.push({
            x: FLASK_X + 15 + Math.random() * (FLASK_BTM_W - 30),
            y: FLASK_Y + FLASK_H - 8,
            r: 1.5 + Math.random() * 5 * ina,
            speed: 35 + Math.random() * 70 * ina,
            wobble: 0, wobbleSpeed: 2 + Math.random() * 3, wobbleAmp: 3 + Math.random() * 10, alive: true,
          });
        }
        if (Math.random() < 15 * ina * dt) {
          vaporsRef.current.push({
            x: cx + (Math.random() - 0.5) * 20,
            y: bodyTop + 5,
            r: 6 + Math.random() * 15 * ina,
            vy: -15 - Math.random() * 25, alpha: 0.25 * ina, alive: true,
          });
        }
        foamHeightRef.current = Math.min(foamHeightRef.current + ina * dt * 25, 35 * ina);
      }

      if (s === 'flooding') {
        const t = timeRef.current;
        const progress = Math.min(t / 2.5, 1);
        floodRef.current = progress;
        setFloodProgress(progress);
        if (Math.random() < 0.4) {
          const angle = Math.random() * Math.PI * 2;
          const spd = 80 + Math.random() * 250;
          dropsRef.current.push({
            x: cx + (Math.random() - 0.5) * 60,
            y: FLASK_Y + FLASK_H * 0.5 + (Math.random() - 0.5) * 60,
            r: 1.5 + Math.random() * 5,
            vx: Math.cos(angle) * spd * (0.5 + progress * 2),
            vy: Math.sin(angle) * spd * (0.5 + progress * 2) - 80,
            alpha: 0.6 + Math.random() * 0.4, alive: true,
          });
        }
        if (t >= 2.5) {
          stepRef.current = 'collecting';
          timeRef.current = 0;
        }
      }

      if (s === 'collecting') {
        const t = timeRef.current;
        const progress = Math.min(t / 2.5, 1);
        floodRef.current = Math.max(1 - progress, 0);
        setFloodProgress(Math.max(1 - progress, 0));
        for (const d of dropsRef.current) {
          if (!d.alive) continue;
          const dx = cx - d.x;
          const dy = (FLASK_Y + FLASK_H * 0.6) - d.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 5) {
            const pull = 60 + progress * 150;
            d.vx += (dx / dist) * pull * dt;
            d.vy += (dy / dist) * pull * dt;
            d.vy += 80 * dt;
            d.r *= 0.993;
          }
          if (dist < 25) d.alpha *= 0.95;
          if (d.alpha < 0.02 || d.r < 0.3) d.alive = false;
        }
        if (t >= 2.5) {
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
          endFlood();
        }
      }

      // --- Update ---
      for (const b of bubblesRef.current) {
        if (!b.alive) continue;
        b.y -= b.speed * dt; b.wobble += b.wobbleSpeed * dt; b.x += Math.sin(b.wobble) * b.wobbleAmp * dt;
        if (b.y < bodyTop + 10) b.alive = false;
        if (!isInsideFlask(b.x, b.y)) b.alive = false;
        if (s === 'fading' && intensityRef.current < 0.2) { b.r *= 0.97; if (b.r < 0.4) b.alive = false; }
      }
      bubblesRef.current = bubblesRef.current.filter((b) => b.alive);

      for (const p of particlesRef.current) {
        if (!p.alive) continue;
        p.vy += 200 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
        const ratio = Math.max(0, Math.min(1, (p.y - bodyTop) / (FLASK_H - NECK_H)));
        const halfW = FLASK_TOP_W / 2 + (FLASK_BTM_W / 2 - FLASK_TOP_W / 2) * ratio;
        if (p.x < cx - halfW + 2) { p.x = cx - halfW + 2; p.vx *= -0.5; }
        if (p.x > cx + halfW - 2) { p.x = cx + halfW - 2; p.vx *= -0.5; }
        const liquidTop = FLASK_Y + FLASK_H - (FLASK_H * liquidLevelRef.current);
        if (p.y >= liquidTop) {
          p.vy *= -0.3; p.vx *= 0.5; p.y = liquidTop - 2; p.alpha *= 0.9;
          if (p.alpha < 0.05) p.alive = false;
        }
        if (p.y > FLASK_Y + FLASK_H + 10) p.alive = false;
      }
      particlesRef.current = particlesRef.current.filter((p) => p.alive);

      for (const v of vaporsRef.current) {
        if (!v.alive) continue;
        v.y += v.vy * dt; v.x += (Math.random() - 0.5) * 12 * dt; v.alpha -= 0.2 * dt; v.r *= 1.02;
        if (v.alpha < 0.01) v.alive = false;
      }
      vaporsRef.current = vaporsRef.current.filter((v) => v.alive);

      for (const d of dropsRef.current) {
        if (!d.alive) continue;
        if (s !== 'collecting') {
          d.vy += 120 * dt; d.x += d.vx * dt; d.y += d.vy * dt; d.alpha *= 0.997; d.vx *= 0.97;
          if (d.y > H + 50 || d.x < -50 || d.x > W + 50) d.alive = false;
        } else {
          d.x += d.vx * dt; d.y += d.vy * dt; d.vx *= 0.93; d.vy *= 0.93;
          if (d.alpha < 0.02) d.alive = false;
        }
      }
      dropsRef.current = dropsRef.current.filter((d) => d.alive);

      // --- DRAW ---
      ctx.clearRect(0, 0, W, H);

      // Glow
      if (intensityRef.current > 0) {
        const glow = ctx.createRadialGradient(cx, FLASK_Y + FLASK_H / 2, 5, cx, FLASK_Y + FLASK_H / 2, FLASK_BTM_W * 0.7);
        glow.addColorStop(0, `rgba(0, 194, 203, ${0.12 * intensityRef.current})`);
        glow.addColorStop(1, 'rgba(0, 194, 203, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, H);
      }

      ctx.save();
      if (shakeRef.current) ctx.translate(Math.sin(shakeRef.current), 0);

      // --- Liquid ---
      const liquidH = FLASK_H * liquidLevelRef.current;
      const liquidTop = FLASK_Y + FLASK_H - liquidH;
      const foamH = foamHeightRef.current;
      const foamTop = liquidTop - foamH;

      if (liquidH > 0 || foamH > 0) {
        // Calculate liquid surface width at this y level
        const surf = (y: number) => {
          const r = Math.max(0, Math.min(1, (y - bodyTop) / (FLASK_H - NECK_H)));
          const hw = FLASK_TOP_W / 2 + (FLASK_BTM_W / 2 - FLASK_TOP_W / 2) * r;
          return { lx: cx - hw + 5, rx: cx + hw - 5 };
        };

        const topSurf = surf(foamTop);
        const btSurf = surf(FLASK_Y + FLASK_H);

        const lg = ctx.createLinearGradient(cx, foamTop, cx, FLASK_Y + FLASK_H);
        lg.addColorStop(0, 'rgba(0, 194, 203, 0.45)');
        lg.addColorStop(0.5, 'rgba(14, 165, 233, 0.55)');
        lg.addColorStop(1, 'rgba(59, 130, 246, 0.65)');

        ctx.beginPath();
        ctx.moveTo(topSurf.lx, foamTop);
        ctx.lineTo(btSurf.lx, FLASK_Y + FLASK_H - 6);
        ctx.quadraticCurveTo(cx, FLASK_Y + FLASK_H + 8, btSurf.rx, FLASK_Y + FLASK_H - 6);
        ctx.lineTo(topSurf.rx, foamTop);
        const waveAmp = intensityRef.current > 0 ? 2 : 0.5;
        for (let x = topSurf.rx; x >= topSurf.lx; x -= 2) {
          const wy = foamTop + Math.sin(x * 0.03 + timeRef.current * 3) * waveAmp;
          ctx.lineTo(x, wy);
        }
        ctx.closePath();
        ctx.fillStyle = lg;
        ctx.fill();

        // Foam
        if (foamH > 2) {
          const fs = surf(foamTop);
          ctx.beginPath();
          ctx.moveTo(fs.lx + 2, foamTop);
          for (let x = fs.lx + 2; x <= fs.rx - 2; x += 3) {
            const wy = foamTop + Math.sin(x * 0.12 + timeRef.current * 4) * foamH * 0.12;
            ctx.lineTo(x, wy);
          }
          ctx.lineTo(fs.rx - 2, liquidTop);
          ctx.lineTo(fs.lx + 2, liquidTop);
          ctx.closePath();
          const fg = ctx.createLinearGradient(cx, foamTop, cx, liquidTop);
          const fa = intensityRef.current;
          fg.addColorStop(0, `rgba(255, 255, 255, ${0.6 * fa})`);
          fg.addColorStop(0.5, `rgba(230, 255, 255, ${0.4 * fa})`);
          fg.addColorStop(1, `rgba(200, 240, 255, ${0.2 * fa})`);
          ctx.fillStyle = fg;
          ctx.fill();

          if (intensityRef.current > 0.4) {
            for (let i = 0; i < Math.floor(intensityRef.current * 6); i++) {
              const ox = cx + (Math.random() - 0.5) * FLASK_TOP_W;
              const oy = foamTop - 3 - Math.random() * 10 * intensityRef.current;
              const or = 2 + Math.random() * 5;
              ctx.beginPath();
              ctx.arc(ox, oy, or, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 255, 255, ${0.25 * intensityRef.current})`;
              ctx.fill();
            }
          }
        }
      }

      // Bubbles
      for (const b of bubblesRef.current) {
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        const ba = 0.25 + b.r / 12;
        ctx.fillStyle = `rgba(255, 255, 255, ${ba})`; ctx.fill();
        ctx.strokeStyle = `rgba(0, 194, 203, ${ba * 0.4})`; ctx.lineWidth = 0.5; ctx.stroke();
        ctx.beginPath(); ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${ba * 0.5})`; ctx.fill();
      }

      // Particles
      for (const p of particlesRef.current) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.9})`; ctx.fill();
      }

      // Vapors
      for (const v of vaporsRef.current) {
        ctx.beginPath(); ctx.arc(v.x, v.y, v.r, 0, Math.PI * 2);
        const vg = ctx.createRadialGradient(v.x, v.y, 0, v.x, v.y, v.r);
        vg.addColorStop(0, `rgba(200, 230, 255, ${v.alpha * 0.25})`);
        vg.addColorStop(1, 'rgba(200, 230, 255, 0)');
        ctx.fillStyle = vg; ctx.fill();
      }

      // Drops
      for (const d of dropsRef.current) {
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 194, 203, ${d.alpha * 0.45})`; ctx.fill();
        ctx.beginPath(); ctx.arc(d.x - d.r * 0.2, d.y - d.r * 0.2, d.r * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${d.alpha * 0.25})`; ctx.fill();
      }

      ctx.restore();

      // --- Flask glass (drawn last) ---
      ctx.save();
      if (shakeRef.current) ctx.translate(Math.sin(shakeRef.current), 0);

      const neckL = cx - FLASK_TOP_W / 2;
      const neckR = cx + FLASK_TOP_W / 2;

      // Rim
      ctx.beginPath();
      ctx.roundRect(neckL - 4, FLASK_Y - 2, FLASK_TOP_W + 8, 6, 3);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Flask outline
      getFlaskPath(ctx);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.13)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Glass reflection (left side)
      const reflect = (ctx: CanvasRenderingContext2D) => {
        ctx.beginPath();
        ctx.moveTo(neckL + 4, bodyTop + 8);
        // Conical reflection line
        const rRatio = 0.12;
        const rTop = FLASK_TOP_W * rRatio;
        const rBtm = FLASK_BTM_W * rRatio;
        const rL = cx - FLASK_BTM_W / 2 + rBtm;
        ctx.lineTo(rL, FLASK_Y + FLASK_H - 15);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 5;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(neckL + 8, bodyTop + 12);
        ctx.lineTo(rL + 8, FLASK_Y + FLASK_H - 25);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 3;
        ctx.stroke();
      };
      reflect(ctx);

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [startFlood, setFloodProgress, endFlood]);

  return (
    <canvas
      ref={canvasRef}
      className="w-[260px] h-[300px]"
    />
  );
}
