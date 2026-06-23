'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { soundService } from '@/services/soundService';

export type LabState = 'idle' | 'dripping' | 'reacting' | 'intense' | 'peak' | 'chaos' | 'flood' | 'underwater';

export interface ReactionConfig {
  intensity: 'low' | 'medium' | 'high';
  gas: boolean;
  heat: boolean;
  colorFrom: string;
  colorTo: string;
}

interface LabSceneProps {
  onStateChange?: (state: LabState) => void;
  reaction?: ReactionConfig | null;
  trigger?: number;
}

const CHEM_COLORS: Record<string, string> = {
  hcl: '#c8e6c9', h2so4: '#fff9c4', hno3: '#ffe0b2', ch3cooh: '#e1f5fe',
  naoh: '#f3e5f5', koh: '#fce4ec', nh3: '#e0f7fa',
  zn: '#eceff1', mg: '#e8eaf6', fe: '#efebe9', cu: '#fff3e0',
  caco3: '#fafafa', nacl: '#ffffff', na2co3: '#f5f5f5',
};

export default function LabScene({ onStateChange, reaction, trigger }: LabSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<LabState>('idle');
  const timeRef = useRef(0);
  const dropTimerRef = useRef(0);
  const liquidColorRef = useRef(new THREE.Color(0.03, 0.07, 0.12));
  const targetColorRef = useRef(new THREE.Color(0.03, 0.07, 0.12));
  const liquidHeightRef = useRef(0.3);
  const glowIntensityRef = useRef(0);
  const shakeRef = useRef(0);
  const floodRef = useRef(0);
  const bubblesRef = useRef<THREE.Mesh[]>([]);
  const sparksRef = useRef<THREE.Mesh[]>([]);
  const vaporRef = useRef<THREE.Mesh[]>([]);
  const dripsRef = useRef<{ mesh: THREE.Mesh; vy: number }[]>([]);
  const dropCountRef = useRef(0);
  const isRunningRef = useRef(false);
  const prevTriggerRef = useRef(0);

  // Camera orbit
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const camThetaRef = useRef(0.3);
  const camPhiRef = useRef(0.6);
  const camDistRef = useRef(6);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const cam = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 30);
    cam.position.set(4, 2.5, 6);
    cam.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0x223355, 0.4);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0x4488ff, 2);
    key.position.set(3, 6, 4);
    key.castShadow = true;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x6644ff, 0.6);
    fill.position.set(-3, 2, -2);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x00ccff, 0.8);
    rim.position.set(0, 3, -4);
    scene.add(rim);
    const glow = new THREE.PointLight(0x00c2cb, 0, 3);
    glow.position.set(0, 1.5, 0);
    scene.add(glow);

    // Background
    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = 256; bgCanvas.height = 256;
    const bgCtx = bgCanvas.getContext('2d')!;
    const bgGrad = bgCtx.createLinearGradient(0, 0, 0, 256);
    bgGrad.addColorStop(0, '#0a0f1e'); bgGrad.addColorStop(0.3, '#0d1525');
    bgGrad.addColorStop(0.6, '#0a0f1e'); bgGrad.addColorStop(1, '#050810');
    bgCtx.fillStyle = bgGrad; bgCtx.fillRect(0, 0, 256, 256);
    const bgTex = new THREE.CanvasTexture(bgCanvas);
    const bgMesh = new THREE.Mesh(new THREE.SphereGeometry(18, 32, 32), new THREE.MeshBasicMaterial({ map: bgTex, side: THREE.BackSide, transparent: true, opacity: 0.3 }));
    scene.add(bgMesh);
    bgMesh.visible = false;

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({ color: 0x111822, roughness: 0.9, metalness: 0.1 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.05;
    floor.receiveShadow = true;
    scene.add(floor);

    // Table
    const table = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.08, 1.5),
      new THREE.MeshStandardMaterial({ color: 0x1a2028, roughness: 0.8, metalness: 0.05 })
    );
    table.position.set(0, 0, 0);
    table.receiveShadow = true;
    table.castShadow = true;
    scene.add(table);

    // Flask group
    const flaskGroup = new THREE.Group();
    flaskGroup.position.set(0, 0.08, 0);
    scene.add(flaskGroup);

    // Flask body (Erlenmeyer)
    const fPts: THREE.Vector2[] = [];
    const neckR = 0.08; const bodyR = 0.22; const totalH = 0.7; const neckH = 0.15;
    fPts.push(new THREE.Vector2(0, totalH));
    fPts.push(new THREE.Vector2(neckR * 0.6, totalH));
    fPts.push(new THREE.Vector2(neckR, totalH - 0.01));
    fPts.push(new THREE.Vector2(neckR, totalH - neckH));
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      fPts.push(new THREE.Vector2(neckR + t * (bodyR - neckR), totalH - neckH - t * (totalH - neckH)));
    }
    fPts.push(new THREE.Vector2(bodyR * 0.85, 0.02));
    fPts.push(new THREE.Vector2(bodyR * 0.6, 0));
    fPts.push(new THREE.Vector2(0, -0.02));

    const flaskGeo = new THREE.LatheGeometry(fPts, 48);
    const flaskMat = new THREE.MeshPhysicalMaterial({
      color: 0x88ccff, transparent: true, opacity: 0.15,
      roughness: 0.05, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05,
      transmission: 0.95, thickness: 0.5, envMapIntensity: 1, side: THREE.DoubleSide,
    });
    const flask = new THREE.Mesh(flaskGeo, flaskMat);
    flask.castShadow = true;
    flaskGroup.add(flask);

    // Flask edge
    const edgeMat = new THREE.MeshPhysicalMaterial({
      color: 0x88ddff, transparent: true, opacity: 0.06,
      roughness: 0, metalness: 0, side: THREE.BackSide, transmission: 1, thickness: 0.3,
    });
    const flaskEdge = new THREE.Mesh(flaskGeo.clone(), edgeMat);
    flaskEdge.scale.set(0.98, 0.98, 0.98);
    flaskGroup.add(flaskEdge);

    // Liquid inside flask
    const liqPts: THREE.Vector2[] = [];
    const liqH = totalH - neckH;
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      liqPts.push(new THREE.Vector2((neckR + t * (bodyR - neckR)) * 0.92, liqH * t));
    }
    liqPts.push(new THREE.Vector2(bodyR * 0.8 * 0.92, 0.02));
    liqPts.push(new THREE.Vector2(bodyR * 0.5 * 0.92, 0));
    liqPts.push(new THREE.Vector2(0, -0.01));
    const liquidGeo = new THREE.LatheGeometry(liqPts, 40);
    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: 0x06101e, transparent: true, opacity: 0.7,
      roughness: 0.1, metalness: 0, clearcoat: 0.3, clearcoatRoughness: 0.2, envMapIntensity: 0.5,
    });
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidMesh.position.y = 0.04;
    flaskGroup.add(liquidMesh);

    // Liquid surface
    const surfMat = new THREE.MeshPhysicalMaterial({
      color: 0x081828, transparent: true, opacity: 0.4,
      roughness: 0.1, metalness: 0, clearcoat: 0.3, side: THREE.DoubleSide,
    });
    const surfMesh = new THREE.Mesh(new THREE.CircleGeometry(0.12, 32), surfMat);
    surfMesh.rotation.x = -Math.PI / 2;
    surfMesh.position.y = totalH - neckH + 0.01;
    flaskGroup.add(surfMesh);

    // Burette
    const buretteMat = new THREE.MeshPhysicalMaterial({
      color: 0x88ccff, transparent: true, opacity: 0.12,
      roughness: 0.05, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05,
      transmission: 0.9, thickness: 0.4,
    });
    const burette = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.6, 16), buretteMat);
    burette.position.set(0, totalH + 0.05 + 0.3, 0);
    flaskGroup.add(burette);

    // Burette liquid
    const buretteLiqMat = new THREE.MeshPhysicalMaterial({
      color: 0x00c2cb, transparent: true, opacity: 0.6,
      roughness: 0.1, metalness: 0, emissive: 0x00c2cb, emissiveIntensity: 0.2,
    });
    const buretteLiq = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.5, 16), buretteLiqMat);
    buretteLiq.position.set(0, totalH + 0.05 + 0.3, 0);
    flaskGroup.add(buretteLiq);

    // Burette tip
    const tipMat = new THREE.MeshPhysicalMaterial({ color: 0x666688, roughness: 0.3, metalness: 0.4 });
    const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.012, 0.04, 8), tipMat);
    tip.position.set(0, totalH + 0.05, 0);
    flaskGroup.add(tip);

    // Stand
    const standMat = new THREE.MeshStandardMaterial({ color: 0x333344, roughness: 0.6, metalness: 0.3 });
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.9, 8), standMat);
    rod.position.set(0.35, 0.45, 0);
    flaskGroup.add(rod);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.03, 12), standMat);
    base.position.set(0.35, 0.02, 0);
    flaskGroup.add(base);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.015, 0.015), standMat);
    arm.position.set(0.2, 0.65, 0);
    flaskGroup.add(arm);

    // Ambient particles
    const pCount = 60;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) pPos[i] = (Math.random() - 0.5) * 4;
    const pMat = new THREE.PointsMaterial({
      color: 0x4488ff, size: 0.008, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending,
    });
    const pSys = new THREE.Points(new THREE.BufferGeometry(), pMat);
    pSys.geometry.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    scene.add(pSys);

    // Flood water
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x0077aa, transparent: true, opacity: 0,
      roughness: 0.1, metalness: 0, envMapIntensity: 0.5, side: THREE.DoubleSide,
    });
    const waterMesh = new THREE.Mesh(new THREE.PlaneGeometry(20, 20, 64, 64), waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.y = -2;
    scene.add(waterMesh);

    const wPos = waterMesh.geometry.attributes.position.array as Float32Array;
    const waveData = Array.from({ length: 65 * 65 }, () => ({
      phase: Math.random() * Math.PI * 2, amp: 0.01 + Math.random() * 0.03, freq: 0.5 + Math.random() * 1.5,
    }));

    // Helpers
    function makeDrop(color: string): THREE.Mesh {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.012, 8, 8),
        new THREE.MeshPhysicalMaterial({ color, transparent: true, opacity: 0.7, roughness: 0, metalness: 0 })
      );
      m.position.set((Math.random() - 0.5) * 0.02, totalH + 0.05, (Math.random() - 0.5) * 0.02);
      flaskGroup.add(m);
      return m;
    }

    function makeBubble(): THREE.Mesh {
      const r = 0.003 + Math.random() * 0.015;
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(r, 8, 8),
        new THREE.MeshPhysicalMaterial({ color: 0x88ddff, transparent: true, opacity: 0.3 + Math.random() * 0.3, roughness: 0, metalness: 0 })
      );
      m.position.set((Math.random() - 0.5) * 0.3, 0.05 + Math.random() * 0.1, (Math.random() - 0.5) * 0.3);
      const cx = m.position.x, cz = m.position.z;
      const maxR = 0.2;
      const r2 = Math.sqrt(cx * cx + cz * cz);
      m.position.x = cx * (maxR / Math.max(r2, 0.01));
      m.position.z = cz * (maxR / Math.max(r2, 0.01));
      flaskGroup.add(m);
      return m;
    }

    function makeSpark(): THREE.Mesh {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.003 + Math.random() * 0.006, 4, 4),
        new THREE.MeshBasicMaterial({ color: 0x00ffff })
      );
      m.position.set((Math.random() - 0.5) * 0.3, 0.1 + Math.random() * 0.4, (Math.random() - 0.5) * 0.3);
      flaskGroup.add(m);
      return m;
    }

    function makeVapor(): THREE.Mesh {
      const r = 0.02 + Math.random() * 0.04;
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(r, 6, 6),
        new THREE.MeshBasicMaterial({ color: 0xaaccff, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending })
      );
      m.position.set((Math.random() - 0.5) * 0.15, 0.5 + Math.random() * 0.3, (Math.random() - 0.5) * 0.15);
      flaskGroup.add(m);
      return m;
    }

    function resetScene() {
      stateRef.current = 'idle';
      dropCountRef.current = 0;
      liquidColorRef.current.set(0.03, 0.07, 0.12);
      targetColorRef.current.set(0.03, 0.07, 0.12);
      liquidHeightRef.current = 0.3;
      glowIntensityRef.current = 0;
      shakeRef.current = 0;
      floodRef.current = 0;
      isRunningRef.current = false;
      [...bubblesRef.current, ...sparksRef.current, ...vaporRef.current, ...dripsRef.current.map(d => d.mesh)].forEach(m => {
        flaskGroup.remove(m);
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
      bubblesRef.current = [];
      sparksRef.current = [];
      vaporRef.current = [];
      dripsRef.current = [];
      buretteLiqMat.color.set(0x00c2cb);
      buretteLiqMat.emissive.set(0x00c2cb);
      liquidMat.color.set(0x06101e);
      liquidMat.emissive.set(0x000000);
      liquidMat.emissiveIntensity = 0;
      surfMat.color.set(0x081828);
    }

    // --- Animation ---
    let animId: number;

    const animate = (timestamp: number) => {
      const dt = Math.min((timestamp - timeRef.current) / 1000 || 0.016, 0.05);
      timeRef.current = timestamp;

      const state = stateRef.current;
      const _t = performance.now() / 1000;

      // Check for new trigger
      if (trigger !== prevTriggerRef.current && trigger) {
        prevTriggerRef.current = trigger;
        if (reaction) {
          resetScene();
          // Set initial liquid color from reaction
          const fromColor = new THREE.Color(reaction.colorFrom);
          targetColorRef.current.copy(fromColor);
          liquidColorRef.current.copy(fromColor);
          buretteLiqMat.color.copy(fromColor);
          buretteLiqMat.emissive.copy(fromColor);
          stateRef.current = 'dripping';
          onStateChange?.('dripping');
          dropTimerRef.current = timestamp;
          isRunningRef.current = true;
        }
      }

      // --- State machine ---
      if (state === 'dripping') {
        const dropInterval = Math.max(0.15, 0.4 - dropCountRef.current * 0.005);
        if (timestamp - dropTimerRef.current > dropInterval * 1000) {
          dropTimerRef.current = timestamp;
          const dropColor = reaction?.colorFrom || '#00c2cb';
          const drop = makeDrop(dropColor);
          dripsRef.current.push({ mesh: drop, vy: 0 });
          dropCountRef.current++;
          soundService.drip();
        }
        if (dropCountRef.current > 12) {
          stateRef.current = 'reacting';
          onStateChange?.('reacting');
          soundService.sizzle(0.3);
        }
      }

      if (state === 'reacting') {
        if (reaction) {
          const toColor = new THREE.Color(reaction.colorTo);
          targetColorRef.current.lerp(toColor, dt * 1.5);
          liquidColorRef.current.lerp(targetColorRef.current, dt * 0.5);
          glowIntensityRef.current += (0.3 - glowIntensityRef.current) * dt;
          liquidHeightRef.current += (0.5 - liquidHeightRef.current) * dt * 0.2;
          if (reaction.gas && Math.random() < 0.3) {
            bubblesRef.current.push(makeBubble());
            soundService.bubble();
          }
          if (reaction.heat && Math.random() < 0.15) {
            vaporRef.current.push(makeVapor());
            soundService.sizzle(0.2);
          }
        }
        if (timestamp > (dropTimerRef.current + 3000)) {
          stateRef.current = 'intense';
          onStateChange?.('intense');
          soundService.sizzle(0.5);
        }
      }

      if (state === 'intense') {
        if (reaction) {
          const toColor = new THREE.Color(reaction.colorTo);
          liquidColorRef.current.lerp(toColor, dt * 0.8);
          glowIntensityRef.current += (0.8 - glowIntensityRef.current) * dt * 0.5;
          liquidHeightRef.current += (0.6 - liquidHeightRef.current) * dt * 0.3;
          const intensity = reaction.intensity === 'high' ? 0.7 : reaction.intensity === 'medium' ? 0.4 : 0.15;
          if (reaction.gas && Math.random() < intensity) {
            bubblesRef.current.push(makeBubble());
            soundService.bubble();
          }
          if (reaction.heat && Math.random() < intensity * 0.4) {
            vaporRef.current.push(makeVapor());
            soundService.sizzle(intensity);
          }
          shakeRef.current = reaction.intensity === 'high' ? Math.sin(_t * 20) * 0.002 :
            reaction.intensity === 'medium' ? Math.sin(_t * 15) * 0.001 : 0;
        }
        if (timestamp > (dropTimerRef.current + 6000)) {
          stateRef.current = 'peak';
          onStateChange?.('peak');
          soundService.whoosh();
        }
      }

      if (state === 'peak') {
        if (reaction) {
          glowIntensityRef.current = 0.7 + Math.sin(_t * 6) * 0.2;
          if (reaction.gas && Math.random() < 0.6) {
            bubblesRef.current.push(makeBubble());
            soundService.bubble();
          }
          if (reaction.heat && Math.random() < 0.3) {
            vaporRef.current.push(makeVapor());
            soundService.sizzle(0.6);
          }
          if (reaction.intensity === 'high' && Math.random() < 0.1) sparksRef.current.push(makeSpark());
          shakeRef.current = Math.sin(_t * 30) * 0.003 + Math.sin(_t * 17) * 0.002;
        }
        if (timestamp > (dropTimerRef.current + 10000)) {
          stateRef.current = 'chaos';
          onStateChange?.('chaos');
          soundService.boom();
        }
      }

      if (state === 'chaos') {
        for (let i = 0; i < 15; i++) bubblesRef.current.push(makeBubble());
        for (let i = 0; i < 3; i++) vaporRef.current.push(makeVapor());
        if (reaction?.intensity === 'high') for (let i = 0; i < 3; i++) sparksRef.current.push(makeSpark());
        shakeRef.current = Math.sin(_t * 40) * 0.006 + Math.sin(_t * 23) * 0.004;
        glowIntensityRef.current = 1 + Math.sin(_t * 8) * 0.3;
        if (timestamp > (dropTimerRef.current + 13000)) {
          stateRef.current = 'flood';
          onStateChange?.('flood');
          soundService.whoosh();
        }
      }

      if (state === 'flood') {
        floodRef.current += dt * 0.25;
        if (floodRef.current > 1) {
          floodRef.current = 1;
          stateRef.current = 'underwater';
          onStateChange?.('underwater');
          soundService.underwater();
        }
      }

      if (state === 'underwater') {
        glowIntensityRef.current *= 0.99;
        shakeRef.current *= 0.95;
      }

      // --- Update drops ---
      for (let i = dripsRef.current.length - 1; i >= 0; i--) {
        const d = dripsRef.current[i];
        d.vy -= 2.5 * dt;
        d.mesh.position.y += d.vy * dt;
        d.mesh.position.x += Math.sin(_t * 10 + i) * 0.001;
        if (d.mesh.position.y < 0.05 + liquidHeightRef.current * 0.5) {
          flaskGroup.remove(d.mesh);
          d.mesh.geometry.dispose();
          (d.mesh.material as THREE.Material).dispose();
          dripsRef.current.splice(i, 1);
        }
      }

      // --- Update bubbles ---
      for (let i = bubblesRef.current.length - 1; i >= 0; i--) {
        const b = bubblesRef.current[i];
        b.position.y += (0.2 + Math.random() * 0.3) * dt;
        b.position.x += Math.sin(_t * 3 + i * 2) * 0.002;
        b.position.z += Math.cos(_t * 2.5 + i * 1.7) * 0.002;
        const s = b.scale.x + dt * 0.1;
        b.scale.set(s, s, s);
        if (b.position.y > 0.6 || b.scale.x > 3) {
          flaskGroup.remove(b);
          b.geometry.dispose();
          (b.material as THREE.Material).dispose();
          bubblesRef.current.splice(i, 1);
        }
      }

      // --- Update vapors ---
      for (let i = vaporRef.current.length - 1; i >= 0; i--) {
        const v = vaporRef.current[i];
        v.position.y += (0.15 + Math.random() * 0.2) * dt;
        v.position.x += (Math.random() - 0.5) * 0.01;
        v.position.z += (Math.random() - 0.5) * 0.01;
        const s = v.scale.x + dt * 0.2;
        v.scale.set(s, s, s);
        const mat = v.material as THREE.MeshBasicMaterial;
        mat.opacity -= dt * 0.3;
        if (v.position.y > 1.2 || mat.opacity < 0.01) {
          flaskGroup.remove(v);
          v.geometry.dispose();
          mat.dispose();
          vaporRef.current.splice(i, 1);
        }
      }

      // --- Update sparks ---
      for (let i = sparksRef.current.length - 1; i >= 0; i--) {
        const s = sparksRef.current[i];
        s.position.y += (0.5 + Math.random()) * dt;
        s.position.x += (Math.random() - 0.5) * 0.03;
        s.position.z += (Math.random() - 0.5) * 0.03;
        const mat = s.material as THREE.MeshBasicMaterial;
        mat.opacity -= dt * 2;
        if (s.position.y > 0.8 || mat.opacity < 0.01) {
          flaskGroup.remove(s);
          s.geometry.dispose();
          mat.dispose();
          sparksRef.current.splice(i, 1);
        }
      }

      // --- Apply shake ---
      flaskGroup.position.x = Math.sin(_t * 30) * shakeRef.current;
      flaskGroup.position.z = Math.cos(_t * 25) * shakeRef.current * 0.5;

      // --- Update liquid ---
      const lc = liquidColorRef.current;
      liquidMat.color.copy(lc);
      liquidMat.emissive.copy(lc);
      liquidMat.emissiveIntensity = glowIntensityRef.current * 0.3;
      liquidMat.opacity = 0.5 + glowIntensityRef.current * 0.3;
      surfMat.color.copy(lc);
      surfMat.emissive.copy(lc);
      surfMat.emissiveIntensity = glowIntensityRef.current * 0.2;
      glow.intensity = glowIntensityRef.current * 1.5;

      const lh = Math.max(0.1, Math.min(0.9, liquidHeightRef.current));
      liquidMesh.scale.y = lh * 1.5;
      liquidMesh.position.y = 0.04 + (lh - 0.3) * 0.3;
      surfMesh.position.y = 0.06 + (lh - 0.3) * 0.35;
      const surfScale = 0.12 + lh * 0.15;
      surfMesh.scale.set(surfScale, surfScale, surfScale);

      // --- Ambient particles ---
      const pos = pSys.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < pCount; i++) {
        pos[i * 3 + 1] += Math.sin(_t * 0.3 + i) * 0.0005;
        pos[i * 3] += Math.cos(_t * 0.2 + i * 0.5) * 0.0003;
      }
      pSys.geometry.attributes.position.needsUpdate = true;

      // --- Flood water ---
      const flood = floodRef.current;
      if (flood > 0.01) {
        waterMat.opacity = Math.min(flood * 0.8, 0.6);
        waterMesh.position.y = -2 + flood * 3.5;
        const wP = waterMesh.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < waterMesh.geometry.attributes.position.count; i++) {
          const x = wP[i * 3], z = wP[i * 3 + 2];
          const wd = waveData[i] || { phase: 0, amp: 0.01, freq: 0.5 };
          wP[i * 3 + 1] =
            Math.sin(x * wd.freq + _t * 1.5 + wd.phase) * wd.amp * flood * 0.5 +
            Math.sin(z * wd.freq * 0.7 + _t * 2 + wd.phase * 1.3) * wd.amp * flood * 0.3;
        }
        waterMesh.geometry.attributes.position.needsUpdate = true;
        waterMesh.geometry.computeVertexNormals();
      } else {
        waterMat.opacity = 0;
      }

      // --- Camera orbit ---
      const theta = camThetaRef.current;
      const phi = camPhiRef.current;
      const dist = camDistRef.current;
      cam.position.x = dist * Math.sin(theta) * Math.cos(phi);
      cam.position.y = dist * Math.sin(phi) + 1.2;
      cam.position.z = dist * Math.cos(theta) * Math.cos(phi);
      cam.lookAt(0, 1.2, 0);

      renderer.render(scene, cam);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    // --- Mouse / Touch orbit ---
    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;
      camThetaRef.current -= dx * 0.005;
      camPhiRef.current = Math.max(0.1, Math.min(1.2, camPhiRef.current + dy * 0.005));
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onPointerUp = () => { isDraggingRef.current = false; };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camDistRef.current = Math.max(3, Math.min(12, camDistRef.current + e.deltaY * 0.005));
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [onStateChange, reaction, trigger]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
    />
  );
}
