'use client';

import { useEffect, useRef } from 'react';

const formulas = ['H₂O', 'CO₂', 'CH₄', 'C₆H₁₂O₆', 'NaCl', 'H₂SO₄', 'HCl', 'NaOH', 'C₂H₅OH', 'NH₃', 'CaCO₃', 'C₈H₁₀N₄O₂'];

interface Particle {
  x: number; y: number; baseX: number; baseY: number;
  size: number; rotation: number; rotSpeed: number;
  type: 'hex' | 'ring' | 'atom' | 'fused' | 'chain' | 'double';
  alpha: number; born: number;
  phase: number; speed: number; amp: number;
}

interface FloatText {
  x: number; y: number; baseX: number; baseY: number;
  text: string; alpha: number; size: number;
  phase: number; speed: number;
}

export default function ChemistryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const texts = useRef<FloatText[]>([]);
  const lastClick = useRef(0);
  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const types: Particle['type'][] = ['hex', 'ring', 'atom', 'fused', 'chain', 'double'];

    const initParticles = () => {
      const arr: Particle[] = [];
      for (let i = 0; i < 18; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        arr.push({
          x, y, baseX: x, baseY: y,
          size: 28 + Math.random() * 50,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.004,
          type: types[Math.floor(Math.random() * types.length)],
          alpha: 0.03 + Math.random() * 0.04,
          born: performance.now(),
          phase: Math.random() * Math.PI * 2,
          speed: 0.15 + Math.random() * 0.2,
          amp: 4 + Math.random() * 8,
        });
      }
      particles.current = arr;
    };
    initParticles();

    const initTexts = () => {
      const arr: FloatText[] = [];
      for (let i = 0; i < 10; i++) {
        arr.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          baseX: Math.random() * canvas.width,
          baseY: Math.random() * canvas.height,
          text: formulas[Math.floor(Math.random() * formulas.length)],
          alpha: 0.02 + Math.random() * 0.025,
          size: 18 + Math.random() * 22,
          phase: Math.random() * Math.PI * 2,
          speed: 0.1 + Math.random() * 0.15,
        });
      }
      texts.current = arr;
    };
    initTexts();

    const spawnBurst = (cx: number, cy: number) => {
      const count = 5 + Math.floor(Math.random() * 4);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
        particles.current.push({
          x: cx, y: cy, baseX: cx, baseY: cy,
          size: 14 + Math.random() * 30,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.006,
          type: types[Math.floor(Math.random() * types.length)],
          alpha: 0.06 + Math.random() * 0.06,
          born: performance.now(),
          phase: Math.random() * Math.PI * 2,
          speed: 0.2 + Math.random() * 0.3,
          amp: 6 + Math.random() * 10,
        });
      }
    };

    const onClick = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastClick.current < 200) return;
      lastClick.current = now;
      spawnBurst(e.clientX, e.clientY);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('click', onClick);
    window.addEventListener('mousemove', onMouseMove);

    // ─── Draw ───
    function drawHex(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, rot: number, alpha: number) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#1e40af'; ctx.lineWidth = 1;

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
        i === 0 ? ctx.moveTo(Math.cos(a) * s, Math.sin(a) * s) : ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
      }
      ctx.closePath(); ctx.stroke();

      ctx.beginPath(); ctx.arc(0, 0, s * 0.55, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(30, 64, 175, ${alpha * 0.4})`; ctx.stroke();

      ctx.fillStyle = '#1e40af';
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath(); ctx.arc(Math.cos(a) * s, Math.sin(a) * s, 2, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }

    function drawFused(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, rot: number, alpha: number) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#1e40af'; ctx.lineWidth = 0.8;

      for (let ring = 0; ring < 2; ring++) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
          const px = Math.cos(a) * s + (ring * s * 1.5);
          i === 0 ? ctx.moveTo(px, Math.sin(a) * s) : ctx.lineTo(px, Math.sin(a) * s);
        }
        ctx.closePath(); ctx.stroke();
      }

      ctx.beginPath();
      const a1 = -Math.PI / 2 - Math.PI / 6, a2 = -Math.PI / 2 + Math.PI / 6;
      ctx.moveTo(Math.cos(a1) * s + s * 0.75, Math.sin(a1) * s);
      ctx.lineTo(Math.cos(a2) * s + s * 0.75, Math.sin(a2) * s);
      ctx.strokeStyle = '#1e40af'; ctx.lineWidth = 2; ctx.stroke();

      ctx.fillStyle = '#1e40af';
      for (let ring = 0; ring < 2; ring++) {
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
          ctx.beginPath();
          ctx.arc(Math.cos(a) * s + (ring * s * 1.5), Math.sin(a) * s, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    function drawChain(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, rot: number, alpha: number) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#1e40af'; ctx.lineWidth = 0.8;

      const links = 4 + Math.floor(Math.random() * 3);
      const spacing = s * 0.6;
      const totalW = (links - 1) * spacing;

      for (let i = 0; i < links; i++) {
        const lx = -totalW / 2 + i * spacing;
        const ly = i % 2 === 0 ? -s * 0.2 : s * 0.2;
        ctx.beginPath(); ctx.arc(lx, ly, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#1e40af'; ctx.fill();

        if (i < links - 1) {
          const nx = -totalW / 2 + (i + 1) * spacing;
          const ny = (i + 1) % 2 === 0 ? -s * 0.2 : s * 0.2;
          ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(nx, ny); ctx.stroke();
        }
      }
      ctx.restore();
    }

    function drawDouble(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, rot: number, alpha: number) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#1e40af'; ctx.lineWidth = 0.8;

      ctx.beginPath(); ctx.arc(-s * 0.5, 0, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#1e40af'; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(s * 0.5, 0, 3, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();

      ctx.beginPath(); ctx.moveTo(-s * 0.35, -2); ctx.lineTo(s * 0.35, -2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-s * 0.35, 2); ctx.lineTo(s * 0.35, 2); ctx.stroke();
      ctx.restore();
    }

    function drawRing(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, rot: number, alpha: number) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#1e40af'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, s * 0.55, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(30, 64, 175, ${alpha * 0.4})`; ctx.stroke();

      ctx.fillStyle = '#1e40af';
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        ctx.beginPath(); ctx.arc(Math.cos(a) * s, Math.sin(a) * s, 2, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }

    function drawAtom(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, rot: number, alpha: number, t: number) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha * 0.8;
      ctx.strokeStyle = 'rgba(30, 64, 175, 0.25)'; ctx.lineWidth = 0.5;

      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(0, 0, s, s * 0.3, (i / 3) * Math.PI, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#1e40af'; ctx.fill();
      ctx.beginPath(); ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#93c5fd'; ctx.fill();

      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2 + t * 0.4;
        const ex = Math.cos(a) * s, ey = Math.sin(a) * s * 0.3;
        const rx = ex * Math.cos((i / 3) * Math.PI) - ey * Math.sin((i / 3) * Math.PI);
        const ry = ex * Math.sin((i / 3) * Math.PI) + ey * Math.cos((i / 3) * Math.PI);
        ctx.beginPath(); ctx.arc(rx, ry, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#93c5fd'; ctx.fill();
      }
      ctx.restore();
    }

    let animId: number;
    const render = (timestamp: number) => {
      if (!ctx || !canvas) return;
      const W = canvas.width, H = canvas.height;
      const t = performance.now() / 1000;

      ctx.clearRect(0, 0, W, H);

      // ── Particles ──
      const list = particles.current;
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        const age = (performance.now() - p.born) / 1000;
        const fadeIn = Math.min(age / 2, 1);
        const drawAlpha = p.alpha * fadeIn;

        if (drawAlpha < 0.005) { if (list.length > 14) list.splice(i, 1); continue; }

        // Smooth floating
        p.x = p.baseX + Math.sin(t * p.speed + p.phase) * p.amp;
        p.y = p.baseY + Math.cos(t * p.speed * 0.7 + p.phase) * p.amp;
        p.rotation += p.rotSpeed;

        // Gentle mouse repulsion
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 0) {
          const force = (150 - dist) / 150 * 0.3;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        ctx.save();
        ctx.shadowColor = 'rgba(30, 64, 175, 0.06)';
        ctx.shadowBlur = 12;

        switch (p.type) {
          case 'hex': drawHex(ctx, p.x, p.y, p.size, p.rotation, drawAlpha); break;
          case 'fused': drawFused(ctx, p.x, p.y, p.size * 0.6, p.rotation, drawAlpha); break;
          case 'chain': drawChain(ctx, p.x, p.y, p.size, p.rotation, drawAlpha); break;
          case 'double': drawDouble(ctx, p.x, p.y, p.size, p.rotation, drawAlpha); break;
          case 'ring': drawRing(ctx, p.x, p.y, p.size, p.rotation, drawAlpha); break;
          case 'atom': drawAtom(ctx, p.x, p.y, p.size, p.rotation, drawAlpha, t); break;
        }
        ctx.restore();
      }

      // ── Floating formulas ──
      for (const tx of texts.current) {
        tx.x = tx.baseX + Math.sin(t * tx.speed + tx.phase) * 15;
        tx.y = tx.baseY + Math.cos(t * tx.speed * 0.6 + tx.phase) * 12;

        ctx.save();
        ctx.globalAlpha = tx.alpha;
        ctx.font = `500 ${tx.size}px "Cairo", sans-serif`;
        ctx.fillStyle = '#1e40af';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(30, 64, 175, 0.04)';
        ctx.shadowBlur = 8;
        ctx.fillText(tx.text, tx.x, tx.y);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('click', onClick);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
