import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Crisis } from '../types';

interface CrisisState {
  crises: Crisis[];
  addCrisis: (crisis: Omit<Crisis, 'id'>) => void;
  deleteCrisis: (id: string) => void;
}

export const useCrisisStore = create<CrisisState>()(
  persist(
    (set) => ({
      crises: [],
      addCrisis: (crisis) =>
        set((state) => ({
          crises: [
            { ...crisis, id: crypto.randomUUID() },
            ...state.crises,
          ],
        })),
      deleteCrisis: (id) =>
        set((state) => ({
          crises: state.crises.filter((crisis) => crisis.id !== id),
        })),
    }),
    {
      name: 'crisis-storage',
    }
  )
);