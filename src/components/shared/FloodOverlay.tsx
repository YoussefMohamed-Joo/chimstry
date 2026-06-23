'use client';

import { useEffect, useRef } from 'react';
import { useFloodStore } from '@/store/floodStore';

export default function FloodOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isFlooding = useFloodStore((s) => s.isFlooding);
  const progress = useFloodStore((s) => s.progress);
  const frameRef = useRef(0);
  const timeRef = useRef(0);

  useEffect(() => {
    if (!isFlooding) {
      frameRef.current = 0;
      timeRef.current = 0;
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animId: number;

    const render = (timestamp: number) => {
      if (!ctx) return;
      const dt = Math.min((timestamp - (frameRef.current || timestamp)) / 1000, 0.04);
      frameRef.current = timestamp;
      timeRef.current += dt;

      const W = canvas.width;
      const H = canvas.height;
      const p = Math.min(progress * 1.2, 1); // amplify progress

      ctx.clearRect(0, 0, W, H);

      // Rising water from bottom
      const waveH = p * H * 0.7;
      const waterY = H - waveH;

      if (p > 0.01) {
        // Background tint
        ctx.fillStyle = `rgba(0, 194, 203, ${p * 0.04})`;
        ctx.fillRect(0, 0, W, H);

        // Darken bottom
        const dg = ctx.createLinearGradient(0, waterY, 0, H);
        dg.addColorStop(0, 'rgba(0, 194, 203, 0)');
        dg.addColorStop(1, `rgba(0, 194, 203, ${p * 0.15})`);
        ctx.fillStyle = dg;
        ctx.fillRect(0, waterY, W, H - waterY);

        // Water body
        const wg = ctx.createLinearGradient(0, waterY, 0, H);
        wg.addColorStop(0, `rgba(0, 194, 203, ${p * 0.12})`);
        wg.addColorStop(0.4, `rgba(0, 150, 200, ${p * 0.2})`);
        wg.addColorStop(1, `rgba(0, 100, 180, ${p * 0.25})`);

        ctx.beginPath();
        ctx.moveTo(0, H);
        for (let x = 0; x <= W; x += 3) {
          const wy = waterY
            + Math.sin(x * 0.008 + timeRef.current * 1.8) * 10 * p
            + Math.sin(x * 0.02 + timeRef.current * 2.5 + 1) * 5 * p
            + Math.sin(x * 0.04 + timeRef.current * 3.5 + 2) * 2.5 * p;
          ctx.lineTo(x, wy);
        }
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fillStyle = wg;
        ctx.fill();

        // Multiple wave lines
        for (let layer = 0; layer < 4; layer++) {
          const ly = waterY + layer * (waveH / 5);
          ctx.beginPath();
          for (let x = 0; x <= W; x += 4) {
            const wy = ly
              + Math.sin(x * 0.012 + timeRef.current * (1.5 + layer * 0.6) + layer * 1.5) * (6 - layer) * p;
            if (x === 0) ctx.moveTo(x, wy);
            else ctx.lineTo(x, wy);
          }
          ctx.strokeStyle = `rgba(255, 255, 255, ${p * (0.08 - layer * 0.015)})`;
          ctx.lineWidth = 1 + (4 - layer) * 0.3;
          ctx.stroke();
        }

        // Surface shine
        ctx.beginPath();
        for (let x = 0; x <= W; x += 3) {
          const wy = waterY
            + Math.sin(x * 0.008 + timeRef.current * 1.8) * 10 * p
            + Math.sin(x * 0.02 + timeRef.current * 2.5 + 1) * 5 * p
            + Math.sin(x * 0.04 + timeRef.current * 3.5 + 2) * 2.5 * p;
          if (x === 0) ctx.moveTo(x, wy + 1);
          else ctx.lineTo(x, wy + 1);
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${p * 0.12})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Floating particles
        for (let i = 0; i < Math.floor(p * 15); i++) {
          const px = (i * 97 + timeRef.current * 25 * (i % 2 === 0 ? 1 : -1)) % W;
          const py = waterY + Math.sin(px * 0.01 + timeRef.current * 1.5) * 8 * p + Math.sin(i * 3.1) * 4;
          ctx.beginPath();
          ctx.arc(px, py, 1 + Math.random() * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p * 0.15})`;
          ctx.fill();
        }

        // Splash particles near surface
        for (let i = 0; i < Math.floor(p * 8); i++) {
          const spx = Math.random() * W;
          const spy = waterY + Math.sin(spx * 0.008 + timeRef.current * 1.8) * 10 * p
            + (Math.random() - 0.5) * 20 * p;
          const sr = 1 + Math.random() * 3;
          ctx.beginPath();
          ctx.arc(spx, spy, sr, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p * (0.1 + Math.random() * 0.1)})`;
          ctx.fill();
        }
      } else {
        // Fade out
        ctx.clearRect(0, 0, W, H);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isFlooding, progress]);

  if (!isFlooding) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}
