import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Sleep } from '../types';

interface SleepState {
  sleepRecords: Sleep[];
  addSleepRecord: (record: Omit<Sleep, 'id'>) => void;
  deleteSleepRecord: (id: string) => void;
}

export const useSleepStore = create<SleepState>()(
  persist(
    (set) => ({
      sleepRecords: [],
      addSleepRecord: (record) =>
        set((state) => ({
          sleepRecords: [
            { ...record, id: crypto.randomUUID() },
            ...state.sleepRecords,
          ],
        })),
      deleteSleepRecord: (id) =>
        set((state) => ({
          sleepRecords: state.sleepRecords.filter((record) => record.id !== id),
        })),
    }),
    {
      name: 'sleep-storage',
    }
  )
);