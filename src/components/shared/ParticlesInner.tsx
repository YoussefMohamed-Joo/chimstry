'use client';

import { useCallback } from 'react';
import { Particles } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine } from '@tsparticles/engine';

export default function ParticlesInner() {
  const init = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      options={{
        fullScreen: { enable: true, zIndex: 0 },
        fpsLimit: 60,
        particles: {
          number: { value: 80, density: { enable: true } },
          color: { value: ['#00C2CB', '#0B1E3D', '#60EFFF', '#ffffff'] },
          shape: { type: ['circle', 'star'] },
          opacity: {
            value: { min: 0.1, max: 0.5 },
            animation: { enable: true, speed: 0.5, sync: false },
          },
          size: {
            value: { min: 1, max: 4 },
            animation: { enable: true, speed: 1, sync: false },
          },
          links: {
            enable: true,
            distance: 150,
            color: '#00C2CB',
            opacity: 0.15,
            width: 1,
          },
          move: {
            enable: true,
            speed: { min: 0.5, max: 1.5 },
            direction: 'none',
            random: true,
            straight: false,
            outModes: { default: 'bounce' },
          },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: 'grab' },
            onClick: { enable: true, mode: 'push' },
          },
          modes: {
            grab: { distance: 200, links: { opacity: 0.3 } },
            push: { quantity: 4 },
          },
        },
        background: { color: 'transparent' },
        detectRetina: true,
      }}
    />
  );
}
