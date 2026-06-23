import { create } from 'zustand';

interface FloodState {
  isFlooding: boolean;
  progress: number;
  startFlood: () => void;
  setProgress: (p: number) => void;
  endFlood: () => void;
}

export const useFloodStore = create<FloodState>((set) => ({
  isFlooding: false,
  progress: 0,
  startFlood: () => set({ isFlooding: true, progress: 0 }),
  setProgress: (progress) => set({ progress }),
  endFlood: () => set({ isFlooding: false, progress: 0 }),
}));
