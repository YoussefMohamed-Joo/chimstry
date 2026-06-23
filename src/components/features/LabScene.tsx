'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ─── Scene State Machine ───
type State = 'idle' | 'dripping' | 'reacting' | 'intense' | 'peak' | 'chaos' | 'flood' | 'underwater';

interface LabSceneProps {
  onStateChange?: (state: State) => void;
}

export default function LabScene({ onStateChange }: LabSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<State>('idle');
  const timeRef = useRef(0);
  const dropTimerRef = useRef(0);
  const liquidColorRef = useRef(new THREE.Color(0.03, 0.07, 0.12));
  const liquidHeightRef = useRef(0.3);
  const glowIntensityRef = useRef(0);
  const shakeRef = useRef(0);
  const floodRef = useRef(0);
  const bubblesRef = useRef<THREE.Mesh[]>([]);
  const sparksRef = useRef<THREE.Mesh[]>([]);
  const vaporRef = useRef<THREE.Mesh[]>([]);
  const dripsRef = useRef<{ mesh: THREE.Mesh; vy: number }[]>([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ─── Scene ───
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060e1a);
    scene.fog = new THREE.Fog(0x060e1a, 8, 20);

    // ─── Camera ───
    const cam = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 30);
    cam.position.set(4, 2.5, 6);
    cam.lookAt(0, 1.2, 0);

    // ─── Renderer ───
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // ─── Lights ───
    const ambient = new THREE.AmbientLight(0x223355, 0.4);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0x4488ff, 2);
    key.position.set(3, 6, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
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

    // ─── Background gradient ───
    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = 256;
    bgCanvas.height = 256;
    const bgCtx = bgCanvas.getContext('2d')!;
    const bgGrad = bgCtx.createLinearGradient(0, 0, 0, 256);
    bgGrad.addColorStop(0, '#0a0f1e');
    bgGrad.addColorStop(0.3, '#0d1525');
    bgGrad.addColorStop(0.6, '#0a0f1e');
    bgGrad.addColorStop(1, '#050810');
    bgCtx.fillStyle = bgGrad;
    bgCtx.fillRect(0, 0, 256, 256);
    const bgTex = new THREE.CanvasTexture(bgCanvas);
    const bgMat = new THREE.MeshBasicMaterial({ map: bgTex, side: THREE.BackSide });
    const bgMesh = new THREE.Mesh(new THREE.SphereGeometry(18, 32, 32), bgMat);
    scene.add(bgMesh);

    // ─── Floor ───
    const floorGeo = new THREE.PlaneGeometry(10, 10);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x111822, roughness: 0.9, metalness: 0.1 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.05;
    floor.receiveShadow = true;
    scene.add(floor);

    // ─── Table ───
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x1a2028, roughness: 0.8, metalness: 0.05 });
    const table = new THREE.Mesh(new THREE.BoxGeometry(3, 0.08, 1.5), tableMat);
    table.position.set(0, 0, 0);
    table.receiveShadow = true;
    table.castShadow = true;
    scene.add(table);

    // ─── Flask Group ───
    const flaskGroup = new THREE.Group();
    flaskGroup.position.set(0, 0.08, 0);
    scene.add(flaskGroup);

    // Flask body (lathe geometry - Erlenmeyer)
    const flaskPoints: THREE.Vector2[] = [];
    const neckR = 0.08;
    const bodyR = 0.22;
    const totalH = 0.7;
    const neckH = 0.15;

    flaskPoints.push(new THREE.Vector2(0, totalH));
    flaskPoints.push(new THREE.Vector2(neckR * 0.6, totalH));
    flaskPoints.push(new THREE.Vector2(neckR, totalH - 0.01));
    flaskPoints.push(new THREE.Vector2(neckR, totalH - neckH));
    // Conical body
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const y = totalH - neckH - t * (totalH - neckH);
      const r = neckR + t * (bodyR - neckR);
      flaskPoints.push(new THREE.Vector2(r, y));
    }
    // Bottom curve
    flaskPoints.push(new THREE.Vector2(bodyR * 0.85, 0.02));
    flaskPoints.push(new THREE.Vector2(bodyR * 0.6, 0));
    flaskPoints.push(new THREE.Vector2(0, -0.02));

    const flaskGeo = new THREE.LatheGeometry(flaskPoints, 48);
    const flaskMat = new THREE.MeshPhysicalMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.15,
      roughness: 0.05,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      transmission: 0.95,
      thickness: 0.5,
      envMapIntensity: 1,
      side: THREE.DoubleSide,
    });
    const flask = new THREE.Mesh(flaskGeo, flaskMat);
    flask.castShadow = true;
    flaskGroup.add(flask);

    // Flask inner outline (for glass edge)
    const flaskEdgeMat = new THREE.MeshPhysicalMaterial({
      color: 0x88ddff,
      transparent: true,
      opacity: 0.06,
      roughness: 0,
      metalness: 0,
      side: THREE.BackSide,
      transmission: 1,
      thickness: 0.3,
    });
    const flaskEdge = new THREE.Mesh(flaskGeo.clone(), flaskEdgeMat);
    flaskEdge.scale.set(0.98, 0.98, 0.98);
    flaskGroup.add(flaskEdge);

    // ─── Liquid inside flask ───
    const liquidPoints: THREE.Vector2[] = [];
    const liqH = totalH - neckH;
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const y = liqH * t;
      const r = neckR + t * (bodyR - neckR);
      liquidPoints.push(new THREE.Vector2(r * 0.92, y));
    }
    liquidPoints.push(new THREE.Vector2(bodyR * 0.8 * 0.92, 0.02));
    liquidPoints.push(new THREE.Vector2(bodyR * 0.5 * 0.92, 0));
    liquidPoints.push(new THREE.Vector2(0, -0.01));
    const liquidGeo = new THREE.LatheGeometry(liquidPoints, 40);
    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: 0x06101e,
      transparent: true,
      opacity: 0.7,
      roughness: 0.1,
      metalness: 0,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2,
      envMapIntensity: 0.5,
    });
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidMesh.position.y = 0.04;
    flaskGroup.add(liquidMesh);

    // Liquid surface disc
    const surfMat = new THREE.MeshPhysicalMaterial({
      color: 0x081828,
      transparent: true,
      opacity: 0.4,
      roughness: 0.1,
      metalness: 0,
      clearcoat: 0.3,
      side: THREE.DoubleSide,
    });
    const surfMesh = new THREE.Mesh(new THREE.CircleGeometry(0.12, 32), surfMat);
    surfMesh.rotation.x = -Math.PI / 2;
    surfMesh.position.y = totalH - neckH + 0.01;
    flaskGroup.add(surfMesh);

    // ─── Burette ───
    const buretteMat = new THREE.MeshPhysicalMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.12,
      roughness: 0.05,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      transmission: 0.9,
      thickness: 0.4,
    });
    const buretteGeo = new THREE.CylinderGeometry(0.025, 0.035, 0.6, 16);
    const burette = new THREE.Mesh(buretteGeo, buretteMat);
    burette.position.set(0, totalH + 0.05 + 0.3, 0);
    flaskGroup.add(burette);

    // Burette liquid inside
    const buretteLiqMat = new THREE.MeshPhysicalMaterial({
      color: 0x00c2cb,
      transparent: true,
      opacity: 0.6,
      roughness: 0.1,
      metalness: 0,
      emissive: 0x00c2cb,
      emissiveIntensity: 0.2,
    });
    const buretteLiqGeo = new THREE.CylinderGeometry(0.02, 0.03, 0.5, 16);
    const buretteLiq = new THREE.Mesh(buretteLiqGeo, buretteLiqMat);
    buretteLiq.position.set(0, totalH + 0.05 + 0.3, 0);
    flaskGroup.add(buretteLiq);

    // Burette tip
    const tipMat = new THREE.MeshPhysicalMaterial({
      color: 0x666688,
      roughness: 0.3,
      metalness: 0.4,
    });
    const tipGeo = new THREE.CylinderGeometry(0.008, 0.012, 0.04, 8);
    const tip = new THREE.Mesh(tipGeo, tipMat);
    tip.position.set(0, totalH + 0.05, 0);
    flaskGroup.add(tip);

    // ─── Holders / Stand ───
    const standMat = new THREE.MeshStandardMaterial({ color: 0x333344, roughness: 0.6, metalness: 0.3 });
    // Vertical rod
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.9, 8), standMat);
    rod.position.set(0.35, 0.45, 0);
    flaskGroup.add(rod);
    // Base
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.03, 12), standMat);
    base.position.set(0.35, 0.02, 0);
    flaskGroup.add(base);
    // Clamp arm
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.015, 0.015), standMat);
    arm.position.set(0.2, 0.65, 0);
    flaskGroup.add(arm);
    // Clamp
    const clamp = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.008, 8, 12), standMat);
    clamp.position.set(0, 0.65, 0);
    clamp.rotation.x = Math.PI / 2;
    flaskGroup.add(clamp);

    // ─── Ambient particles ───
    const particleCount = 60;
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) particlePos[i] = (Math.random() - 0.5) * 4;
    const particleMat = new THREE.PointsMaterial({
      color: 0x4488ff,
      size: 0.008,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });
    const particleSys = new THREE.Points(new THREE.BufferGeometry(), particleMat);
    particleSys.geometry.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    scene.add(particleSys);

    // ─── Flood water mesh ───
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x0077aa,
      transparent: true,
      opacity: 0,
      roughness: 0.1,
      metalness: 0,
      clearcoat: 0.5,
      envMapIntensity: 0.5,
      side: THREE.DoubleSide,
    });
    const waterMesh = new THREE.Mesh(new THREE.PlaneGeometry(20, 20, 64, 64), waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.y = -2;
    scene.add(waterMesh);

    // Water surface waves
    const positions = waterMesh.geometry.attributes.position.array as Float32Array;
    const waveData = Array.from({ length: 65 * 65 }, () => ({
      phase: Math.random() * Math.PI * 2,
      amp: 0.01 + Math.random() * 0.03,
      freq: 0.5 + Math.random() * 1.5,
    }));

    // ─── Helpers ───
    function makeDrop(): THREE.Mesh {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.012, 8, 8),
        new THREE.MeshPhysicalMaterial({
          color: 0x00ddff,
          transparent: true,
          opacity: 0.7,
          roughness: 0,
          metalness: 0,
          clearcoat: 0.3,
        })
      );
      m.position.set(
        (Math.random() - 0.5) * 0.02,
        totalH + 0.05,
        (Math.random() - 0.5) * 0.02
      );
      flaskGroup.add(m);
      return m;
    }

    function makeBubble(): THREE.Mesh {
      const r = 0.003 + Math.random() * 0.015;
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(r, 8, 8),
        new THREE.MeshPhysicalMaterial({
          color: 0x88ddff,
          transparent: true,
          opacity: 0.3 + Math.random() * 0.3,
          roughness: 0,
          metalness: 0,
        })
      );
      const cx = (Math.random() - 0.5) * 0.3;
      const cz = (Math.random() - 0.5) * 0.3;
      const r2 = Math.sqrt(cx * cx + cz * cz);
      const maxR = 0.2;
      m.position.set(
        cx * (maxR / Math.max(r2, 0.01)),
        0.05 + Math.random() * 0.1,
        cz * (maxR / Math.max(r2, 0.01))
      );
      flaskGroup.add(m);
      return m;
    }

    function makeSpark(): THREE.Mesh {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.003 + Math.random() * 0.006, 4, 4),
        new THREE.MeshBasicMaterial({ color: 0x00ffff })
      );
      m.position.set(
        (Math.random() - 0.5) * 0.3,
        0.1 + Math.random() * 0.4,
        (Math.random() - 0.5) * 0.3
      );
      flaskGroup.add(m);
      return m;
    }

    function makeVapor(): THREE.Mesh {
      const r = 0.02 + Math.random() * 0.04;
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(r, 6, 6),
        new THREE.MeshBasicMaterial({
          color: 0xaaccff,
          transparent: true,
          opacity: 0.08,
          blending: THREE.AdditiveBlending,
        })
      );
      m.position.set(
        (Math.random() - 0.5) * 0.15,
        0.5 + Math.random() * 0.3,
        (Math.random() - 0.5) * 0.15
      );
      flaskGroup.add(m);
      return m;
    }

    // ─── Animation ───
    let animId: number;
    let dropCount = 0;

    const animate = (timestamp: number) => {
      const dt = Math.min((timestamp - timeRef.current) / 1000 || 0.016, 0.05);
      timeRef.current = timestamp;

      const state = stateRef.current;
      const t = performance.now() / 1000;

      // ── State transitions ──
      if (state === 'idle') {
        // Start dripping after 1s
        if (timestamp > 1000) {
          stateRef.current = 'dripping';
          onStateChange?.('dripping');
          dropTimerRef.current = timestamp;
        }
      }

      // Dripping
      if (state === 'dripping') {
        const dropInterval = Math.max(0.15, 0.4 - dropCount * 0.005);
        if (timestamp - dropTimerRef.current > dropInterval * 1000) {
          dropTimerRef.current = timestamp;
          const drop = makeDrop();
          dripsRef.current.push({ mesh: drop, vy: 0 });
          dropCount++;
        }
        // After 12 drops, start reacting
        if (dropCount > 12) {
          stateRef.current = 'reacting';
          onStateChange?.('reacting');
        }
      }

      // Reacting
      if (state === 'reacting') {
        const color = liquidColorRef.current;
        color.r += (0.08 - color.r) * dt * 0.5;
        color.g += (0.5 - color.g) * dt * 0.5;
        color.b += (0.8 - color.b) * dt * 0.5;
        liquidColorRef.current = color;
        glowIntensityRef.current += (0.3 - glowIntensityRef.current) * dt;
        liquidHeightRef.current += (0.5 - liquidHeightRef.current) * dt * 0.2;

        // Spawn bubbles
        if (Math.random() < 0.3) {
          bubblesRef.current.push(makeBubble());
        }

        // After 3s -> intense
        if (timestamp > (dropTimerRef.current + 3000)) {
          stateRef.current = 'intense';
          onStateChange?.('intense');
        }
      }

      // Intense
      if (state === 'intense') {
        const color = liquidColorRef.current;
        color.r += (0.1 - color.r) * dt;
        color.g += (0.8 - color.g) * dt * 0.8;
        color.b += (1 - color.b) * dt * 0.8;
        liquidColorRef.current = color;
        glowIntensityRef.current += (1 - glowIntensityRef.current) * dt * 0.5;
        liquidHeightRef.current += (0.65 - liquidHeightRef.current) * dt * 0.3;

        // More bubbles
        if (Math.random() < 0.6) bubblesRef.current.push(makeBubble());
        // Vapor
        if (Math.random() < 0.2) vaporRef.current.push(makeVapor());
        // Shake
        shakeRef.current = Math.sin(t * 20) * 0.001;

        if (timestamp > (dropTimerRef.current + 6000)) {
          stateRef.current = 'peak';
          onStateChange?.('peak');
        }
      }

      // Peak
      if (state === 'peak') {
        const color = liquidColorRef.current;
        color.r = 0.05 + Math.sin(t * 5) * 0.03;
        color.g = 0.7 + Math.sin(t * 4) * 0.15;
        color.b = 0.9 + Math.sin(t * 3) * 0.1;
        liquidColorRef.current = color;
        glowIntensityRef.current = 0.8 + Math.sin(t * 6) * 0.2;
        liquidHeightRef.current = 0.7 + Math.sin(t * 2) * 0.03;

        if (Math.random() < 0.8) bubblesRef.current.push(makeBubble());
        if (Math.random() < 0.4) vaporRef.current.push(makeVapor());
        if (Math.random() < 0.15) sparksRef.current.push(makeSpark());
        shakeRef.current = Math.sin(t * 30) * 0.003 + Math.sin(t * 17) * 0.002;

        if (timestamp > (dropTimerRef.current + 10000)) {
          stateRef.current = 'chaos';
          onStateChange?.('chaos');
        }
      }

      // Chaos - burst
      if (state === 'chaos') {
        for (let i = 0; i < 20; i++) bubblesRef.current.push(makeBubble());
        for (let i = 0; i < 5; i++) vaporRef.current.push(makeVapor());
        for (let i = 0; i < 3; i++) sparksRef.current.push(makeSpark());
        shakeRef.current = Math.sin(t * 40) * 0.006 + Math.sin(t * 23) * 0.004;
        glowIntensityRef.current = 1 + Math.sin(t * 8) * 0.3;
        liquidHeightRef.current = 0.8;

        if (timestamp > (dropTimerRef.current + 12000)) {
          stateRef.current = 'flood';
          onStateChange?.('flood');
        }
      }

      // Flood
      if (state === 'flood') {
        floodRef.current += dt * 0.3;
        if (floodRef.current > 1) {
          floodRef.current = 1;
          stateRef.current = 'underwater';
          onStateChange?.('underwater');
        }
      }

      // Underwater - calm
      if (state === 'underwater') {
        glowIntensityRef.current *= 0.99;
        shakeRef.current *= 0.95;
      }

      // ── Update drops ──
      for (let i = dripsRef.current.length - 1; i >= 0; i--) {
        const d = dripsRef.current[i];
        d.vy -= 2.5 * dt;
        d.mesh.position.y += d.vy * dt;
        d.mesh.position.x += Math.sin(t * 10 + i) * 0.001;
        if (d.mesh.position.y < 0.05 + liquidHeightRef.current * 0.5) {
          flaskGroup.remove(d.mesh);
          d.mesh.geometry.dispose();
          (d.mesh.material as THREE.Material).dispose();
          dripsRef.current.splice(i, 1);
        }
      }

      // ── Update bubbles ──
      for (let i = bubblesRef.current.length - 1; i >= 0; i--) {
        const b = bubblesRef.current[i];
        b.position.y += (0.2 + Math.random() * 0.3) * dt;
        b.position.x += Math.sin(t * 3 + i * 2) * 0.002;
        b.position.z += Math.cos(t * 2.5 + i * 1.7) * 0.002;
        const scale = b.scale.x + dt * 0.1;
        b.scale.set(scale, scale, scale);
        if (b.position.y > 0.6 || b.scale.x > 3) {
          flaskGroup.remove(b);
          b.geometry.dispose();
          (b.material as THREE.Material).dispose();
          bubblesRef.current.splice(i, 1);
        }
      }

      // ── Update vapors ──
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

      // ── Update sparks ──
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

      // ── Apply shake ──
      flaskGroup.position.x = Math.sin(t * 30) * shakeRef.current;
      flaskGroup.position.z = Math.cos(t * 25) * shakeRef.current * 0.5;

      // ── Update liquid visuals ──
      const liqMat = liquidMesh.material as THREE.MeshPhysicalMaterial;
      liqMat.color.copy(liquidColorRef.current);
      liqMat.emissive = liquidColorRef.current;
      liqMat.emissiveIntensity = glowIntensityRef.current * 0.3;
      liqMat.opacity = 0.5 + glowIntensityRef.current * 0.3;

      // Surface
      const sMat = surfMesh.material as THREE.MeshPhysicalMaterial;
      sMat.color.copy(liquidColorRef.current);
      sMat.emissive = liquidColorRef.current;
      sMat.emissiveIntensity = glowIntensityRef.current * 0.2;

      // Flask glow
      glow.intensity = glowIntensityRef.current * 1.5;

      // ── Liquid height ──
      const lh = liquidHeightRef.current;
      liquidMesh.scale.y = lh * 1.5;
      liquidMesh.position.y = 0.04 + (lh - 0.3) * 0.3;
      surfMesh.position.y = 0.06 + (lh - 0.3) * 0.35;
      const surfScale = 0.12 + lh * 0.15;
      surfMesh.scale.set(surfScale, surfScale, surfScale);

      // ── Ambient particles float ──
      const pos = particleSys.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += Math.sin(t * 0.3 + i) * 0.0005;
        pos[i * 3] += Math.cos(t * 0.2 + i * 0.5) * 0.0003;
      }
      particleSys.geometry.attributes.position.needsUpdate = true;

      // ── Flood water ──
      const flood = floodRef.current;
      if (flood > 0.01) {
        waterMat.opacity = Math.min(flood * 0.8, 0.6);
        waterMesh.position.y = -2 + flood * 3.5;

        // Wave animation
        const wPos = waterMesh.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < waterMesh.geometry.attributes.position.count; i++) {
          const x = wPos[i * 3];
          const z = wPos[i * 3 + 2];
          const wd = waveData[i] || { phase: 0, amp: 0.01, freq: 0.5 };
          wPos[i * 3 + 1] =
            Math.sin(x * wd.freq + t * 1.5 + wd.phase) * wd.amp * flood * 0.5 +
            Math.sin(z * wd.freq * 0.7 + t * 2 + wd.phase * 1.3) * wd.amp * flood * 0.3;
        }
        waterMesh.geometry.attributes.position.needsUpdate = true;
        waterMesh.geometry.computeVertexNormals();
      } else {
        waterMat.opacity = 0;
      }

      // ── Camera slight motion ──
      cam.position.x = 4 + Math.sin(t * 0.1) * 0.1;
      cam.lookAt(0, 1.2, 0);

      renderer.render(scene, cam);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    // ─── Resize ───
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
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [onStateChange]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden"
    />
  );
}
