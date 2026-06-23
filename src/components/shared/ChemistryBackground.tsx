'use client';

import { useEffect, useRef } from 'react';

const formulas = ['H₂O', 'CO₂', 'CH₄', 'C₆H₁₂O₆', 'NaCl', 'H₂SO₄', 'HCl', 'NaOH', 'C₂H₅OH', 'NH₃', 'CaCO₃', 'C₈H₁₀N₄O₂'];

interface Mol {
  x: number; y: number; vx: number; vy: number; size: number;
  rotation: number; rotSpeed: number;
  type: 'hex' | 'ring' | 'atom' | 'fused' | 'chain' | 'double';
  alpha: number; born: number;
}

export default function ChemistryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const molsRef = useRef<Mol[]>([]);
  const textsRef = useRef<{ x: number; y: number; vx: number; vy: number; text: string; alpha: number; size: number }[]>([]);
  const lastClickRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = () => canvas.width;
    const H = () => canvas.height;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Init molecules
    const initMols = () => {
      const types: Mol['type'][] = ['hex', 'ring', 'atom', 'fused', 'chain', 'double'];
      const arr: Mol[] = [];
      for (let i = 0; i < 24; i++) {
        arr.push({
          x: Math.random() * W(), y: Math.random() * H(),
          vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
          size: 18 + Math.random() * 45,
          rotation: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.008,
          type: types[Math.floor(Math.random() * types.length)],
          alpha: 0.025 + Math.random() * 0.045, born: performance.now(),
        });
      }
      molsRef.current = arr;
    };
    initMols();

    const initTexts = () => {
      const arr: typeof textsRef.current = [];
      for (let i = 0; i < 14; i++) {
        arr.push({
          x: Math.random() * W(), y: Math.random() * H(),
          vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.12,
          text: formulas[Math.floor(Math.random() * formulas.length)],
          alpha: 0.03 + Math.random() * 0.04, size: 14 + Math.random() * 18,
        });
      }
      textsRef.current = arr;
    };
    initTexts();

    const spawnBurst = (cx: number, cy: number, count: number = 8) => {
      const types: Mol['type'][] = ['hex', 'ring', 'atom', 'fused', 'chain', 'double'];
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
        const speed = 0.3 + Math.random() * 0.6;
        molsRef.current.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          size: 10 + Math.random() * 35,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.01,
          type: types[Math.floor(Math.random() * types.length)],
          alpha: 0.08 + Math.random() * 0.08,
          born: performance.now(),
        });
      }
    };

    const onClick = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastClickRef.current < 100) return;
      lastClickRef.current = now;
      spawnBurst(e.clientX, e.clientY, 6 + Math.floor(Math.random() * 6));
    };
    window.addEventListener('click', onClick);

    // ─── Draw helpers ───
    function drawHex(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, rot: number, alpha: number) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#1e40af'; ctx.lineWidth = 1.2;

      // Outer hexagon
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const px = Math.cos(a) * s, py = Math.sin(a) * s;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath(); ctx.stroke();

      // Inner circle (aromatic)
      ctx.beginPath(); ctx.arc(0, 0, s * 0.55, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(30, 64, 175, ${alpha * 0.5})`;
      ctx.stroke();

      // Nodes
      ctx.fillStyle = '#1e40af';
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * s, Math.sin(a) * s, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    function drawFused(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, rot: number, alpha: number) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#1e40af'; ctx.lineWidth = 1;

      // Naphthalene-like (two fused hexagons)
      for (let ring = 0; ring < 2; ring++) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
          const px = Math.cos(a) * s + (ring === 0 ? 0 : s * 1.5);
          const py = Math.sin(a) * s;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath(); ctx.stroke();
      }

      // Shared bond (thicker)
      ctx.beginPath();
      const a1 = -Math.PI / 2 - Math.PI / 6;
      const a2 = -Math.PI / 2 + Math.PI / 6;
      ctx.moveTo(Math.cos(a1) * s + s * 0.75, Math.sin(a1) * s);
      ctx.lineTo(Math.cos(a2) * s + s * 0.75, Math.sin(a2) * s);
      ctx.strokeStyle = '#1e40af'; ctx.lineWidth = 2.5; ctx.stroke();

      // Inner rings
      for (let ring = 0; ring < 2; ring++) {
        ctx.beginPath();
        ctx.arc(ring === 0 ? 0 : s * 1.5, 0, s * 0.5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(30, 64, 175, ${alpha * 0.4})`;
        ctx.lineWidth = 0.8; ctx.stroke();
      }

      // Nodes
      ctx.fillStyle = '#1e40af';
      for (let ring = 0; ring < 2; ring++) {
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
          const px = Math.cos(a) * s + (ring === 0 ? 0 : s * 1.5);
          const py = Math.sin(a) * s;
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    function drawChain(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, rot: number, alpha: number) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#1e40af'; ctx.lineWidth = 1.2;

      const links = 4 + Math.floor(Math.random() * 3);
      const spacing = s * 0.7;
      const totalW = (links - 1) * spacing;

      for (let i = 0; i < links; i++) {
        const lx = -totalW / 2 + i * spacing;
        // Zigzag
        const ly = i % 2 === 0 ? -s * 0.25 : s * 0.25;
        ctx.beginPath();
        ctx.arc(lx, ly, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#1e40af'; ctx.fill();
        ctx.strokeStyle = '#1e40af'; ctx.stroke();

        if (i < links - 1) {
          const nx = -totalW / 2 + (i + 1) * spacing;
          const ny = (i + 1) % 2 === 0 ? -s * 0.25 : s * 0.25;
          ctx.beginPath();
          ctx.moveTo(lx, ly); ctx.lineTo(nx, ny);
          ctx.strokeStyle = '#1e40af'; ctx.lineWidth = 1.2; ctx.stroke();
        }
      }
      ctx.restore();
    }

    function drawDouble(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, rot: number, alpha: number) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#1e40af'; ctx.lineWidth = 1;

      // Double bond between two atoms
      ctx.beginPath();
      ctx.arc(-s * 0.5, 0, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#1e40af'; ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.arc(s * 0.5, 0, 4, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();

      // Double lines
      ctx.beginPath();
      ctx.moveTo(-s * 0.4, -2); ctx.lineTo(s * 0.4, -2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-s * 0.4, 2); ctx.lineTo(s * 0.4, 2);
      ctx.stroke();

      ctx.restore();
    }

    function drawRing(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, rot: number, alpha: number) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#1e40af'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, s * 0.6, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(30, 64, 175, ${alpha * 0.5})`; ctx.stroke();

      ctx.fillStyle = '#1e40af';
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * s, Math.sin(a) * s, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    function drawAtom(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, rot: number, alpha: number, t: number) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha;
      ctx.strokeStyle = 'rgba(30, 64, 175, 0.3)'; ctx.lineWidth = 0.5;

      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(0, 0, s, s * 0.3, (i / 3) * Math.PI, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#1e40af'; ctx.fill();
      ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#93c5fd'; ctx.fill();

      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2 + t * 0.5;
        const ex = Math.cos(a) * s, ey = Math.sin(a) * s * 0.3;
        const rx = ex * Math.cos((i / 3) * Math.PI) - ey * Math.sin((i / 3) * Math.PI);
        const ry = ex * Math.sin((i / 3) * Math.PI) + ey * Math.cos((i / 3) * Math.PI);
        ctx.beginPath();
        ctx.arc(rx, ry, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#93c5fd'; ctx.fill();
      }
      ctx.restore();
    }

    let animId: number;
    let lastTime = 0;

    const render = (timestamp: number) => {
      if (!ctx || !canvas) return;
      const dt = Math.min((timestamp - lastTime) / 1000 || 0.016, 0.05);
      lastTime = timestamp;
      const Ww = canvas.width, Hh = canvas.height;
      const t = performance.now() / 1000;

      ctx.clearRect(0, 0, Ww, Hh);

      // Grid
      ctx.save();
      ctx.globalAlpha = 0.015;
      ctx.strokeStyle = '#1e40af'; ctx.lineWidth = 0.5;
      const gs = 100;
      for (let x = (t * 4) % gs; x < Ww; x += gs) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, Hh); ctx.stroke();
      }
      for (let y = (t * 2.5) % gs; y < Hh; y += gs) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(Ww, y); ctx.stroke();
      }
      ctx.restore();

      // Molecules
      const mols = molsRef.current;
      for (let i = mols.length - 1; i >= 0; i--) {
        const m = mols[i];
        const age = (performance.now() - m.born) / 1000;
        m.x += m.vx; m.y += m.vy; m.rotation += m.rotSpeed;

        // Wrap
        if (m.x < -100) m.x = Ww + 100;
        if (m.x > Ww + 100) m.x = -100;
        if (m.y < -100) m.y = Hh + 100;
        if (m.y > Hh + 100) m.y = -100;

        // Fade in
        const fadeIn = Math.min(age / 2, 1);
        const drawAlpha = m.alpha * fadeIn;

        if (drawAlpha < 0.005) continue;

        // Glow
        ctx.save();
        ctx.shadowColor = 'rgba(30, 64, 175, 0.08)';
        ctx.shadowBlur = 15;

        switch (m.type) {
          case 'hex': drawHex(ctx, m.x, m.y, m.size, m.rotation, drawAlpha); break;
          case 'fused': drawFused(ctx, m.x, m.y, m.size * 0.6, m.rotation, drawAlpha); break;
          case 'chain': drawChain(ctx, m.x, m.y, m.size, m.rotation, drawAlpha); break;
          case 'double': drawDouble(ctx, m.x, m.y, m.size, m.rotation, drawAlpha); break;
          case 'ring': drawRing(ctx, m.x, m.y, m.size, m.rotation, drawAlpha); break;
          case 'atom': drawAtom(ctx, m.x, m.y, m.size, m.rotation, drawAlpha, t); break;
        }
        ctx.restore();

        // Remove very old molecules (after 120s) but keep minimum count
        if (age > 120 && mols.length > 20) { mols.splice(i, 1); }
      }

      // Floating formulas
      for (const tx of textsRef.current) {
        tx.x += tx.vx; tx.y += tx.vy;
        if (tx.x < -80) tx.x = Ww + 80;
        if (tx.x > Ww + 80) tx.x = -80;
        if (tx.y < -80) tx.y = Hh + 80;
        if (tx.y > Hh + 80) tx.y = -80;

        ctx.save();
        ctx.globalAlpha = tx.alpha;
        ctx.font = `${tx.size}px "Cairo", sans-serif`;
        ctx.fillStyle = '#1e40af';
        ctx.textAlign = 'center';
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
