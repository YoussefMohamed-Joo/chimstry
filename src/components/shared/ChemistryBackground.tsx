'use client';

import { useEffect, useRef } from 'react';

const formulas = ['H₂O', 'CO₂', 'CH₄', 'C₆H₁₂O₆', 'NaCl', 'H₂SO₄', 'HCl', 'NaOH', 'C₂H₅OH', 'NH₃', 'CaCO₃', 'C₈H₁₀N₄O₂'];

export default function ChemistryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // Molecules (floating structures)
    const molecules: {
      x: number; y: number; vx: number; vy: number; size: number; rotation: number;
      rotSpeed: number; type: 'hex' | 'ring' | 'atom'; alpha: number; formula: string;
    }[] = [];

    for (let i = 0; i < 18; i++) {
      molecules.push({
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: 20 + Math.random() * 40,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.005,
        type: ['hex', 'ring', 'atom'][Math.floor(Math.random() * 3)] as 'hex' | 'ring' | 'atom',
        alpha: 0.04 + Math.random() * 0.06,
        formula: formulas[Math.floor(Math.random() * formulas.length)],
      });
    }

    // Floating text formulas
    const texts: { x: number; y: number; vx: number; vy: number; text: string; alpha: number; size: number }[] = [];
    for (let i = 0; i < 12; i++) {
      texts.push({
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        text: formulas[Math.floor(Math.random() * formulas.length)],
        alpha: 0.03 + Math.random() * 0.04,
        size: 12 + Math.random() * 16,
      });
    }

    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = (timestamp: number) => {
      if (!ctx || !canvas) return;
      const dt = Math.min((timestamp - time) / 1000 || 0.016, 0.05);
      time = timestamp;
      const W = canvas.width;
      const H = canvas.height;
      const t = performance.now() / 1000;

      ctx.clearRect(0, 0, W, H);

      // Draw molecules
      for (const m of molecules) {
        m.x += m.vx; m.y += m.vy; m.rotation += m.rotSpeed;
        if (m.x < -100) m.x = W + 100;
        if (m.x > W + 100) m.x = -100;
        if (m.y < -100) m.y = H + 100;
        if (m.y > H + 100) m.y = -100;

        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(m.rotation);
        ctx.globalAlpha = m.alpha;
        ctx.strokeStyle = '#00C2CB';
        ctx.lineWidth = 0.8;

        if (m.type === 'hex') {
          // Hexagonal molecule
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * m.size;
            const y = Math.sin(angle) * m.size;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
          // Inner lines
          ctx.beginPath();
          for (let i = 0; i < 3; i++) {
            const a1 = (i / 3) * Math.PI * 2;
            const a2 = a1 + Math.PI;
            ctx.moveTo(Math.cos(a1) * m.size * 0.5, Math.sin(a1) * m.size * 0.5);
            ctx.lineTo(Math.cos(a2) * m.size * 0.5, Math.sin(a2) * m.size * 0.5);
          }
          ctx.stroke();
          // Nodes
          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
            ctx.beginPath();
            ctx.arc(Math.cos(angle) * m.size, Math.sin(angle) * m.size, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#00C2CB';
            ctx.fill();
          }
        } else if (m.type === 'ring') {
          // Benzene-like ring
          ctx.beginPath();
          ctx.arc(0, 0, m.size, 0, Math.PI * 2);
          ctx.stroke();
          // Inner circle
          ctx.beginPath();
          ctx.arc(0, 0, m.size * 0.6, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(0, 194, 203, 0.5)';
          ctx.stroke();
          ctx.strokeStyle = '#00C2CB';
          // Side bonds
          for (let i = 0; i < 3; i++) {
            const a = (i / 3) * Math.PI * 2 + t * 0.3;
            ctx.beginPath();
            ctx.arc(Math.cos(a) * m.size * 0.3, Math.sin(a) * m.size * 0.3, m.size * 0.4, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 194, 203, 0.3)';
            ctx.stroke();
            ctx.strokeStyle = '#00C2CB';
          }
        } else if (m.type === 'atom') {
          // Atom with orbiting electrons
          ctx.strokeStyle = 'rgba(0, 194, 203, 0.3)';
          ctx.lineWidth = 0.5;
          // Orbital paths
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.ellipse(0, 0, m.size, m.size * 0.3, (i / 3) * Math.PI, 0, Math.PI * 2);
            ctx.stroke();
          }
          // Nucleus
          ctx.beginPath();
          ctx.arc(0, 0, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#00C2CB';
          ctx.fill();
          // Electrons
          for (let i = 0; i < 3; i++) {
            const a = (i / 3) * Math.PI * 2 + t * 0.5;
            const ex = Math.cos(a) * m.size;
            const ey = Math.sin(a) * m.size * 0.3;
            const rotX = ex * Math.cos((i / 3) * Math.PI) - ey * Math.sin((i / 3) * Math.PI);
            const rotY = ex * Math.sin((i / 3) * Math.PI) + ey * Math.cos((i / 3) * Math.PI);
            ctx.beginPath();
            ctx.arc(rotX, rotY, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = '#60EFFF';
            ctx.fill();
          }
          ctx.strokeStyle = '#00C2CB';
          ctx.lineWidth = 0.8;
        }

        ctx.restore();
      }

      // Draw floating formulas
      for (const tx of texts) {
        tx.x += tx.vx; tx.y += tx.vy;
        if (tx.x < -50) tx.x = W + 50;
        if (tx.x > W + 50) tx.x = -50;
        if (tx.y < -50) tx.y = H + 50;
        if (tx.y > H + 50) tx.y = -50;

        ctx.save();
        ctx.globalAlpha = tx.alpha;
        ctx.font = `${tx.size}px "Cairo", sans-serif`;
        ctx.fillStyle = '#00C2CB';
        ctx.textAlign = 'center';
        ctx.fillText(tx.text, tx.x, tx.y);
        ctx.restore();
      }

      // Subtle grid
      ctx.save();
      ctx.globalAlpha = 0.02;
      ctx.strokeStyle = '#00C2CB';
      ctx.lineWidth = 0.5;
      const gridSize = 80;
      const offsetX = (t * 5) % gridSize;
      const offsetY = (t * 3) % gridSize;
      for (let x = -gridSize + offsetX; x < W + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0); ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = -gridSize + offsetY; y < H + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y); ctx.lineTo(W, y);
        ctx.stroke();
      }
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
