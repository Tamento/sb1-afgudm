import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Medication } from '../types';

interface MedicationState {
  medications: Medication[];
  medicationList: { id: string; name: string; dosage: string }[];
  addMedication: (medication: Omit<Medication, 'id'>) => void;
  deleteMedication: (id: string) => void;
  addToMedicationList: (medication: { name: string; dosage: string }) => void;
  removeFromMedicationList: (id: string) => void;
}

export const useMedicationStore = create<MedicationState>()(
  persist(
    (set) => ({
      medications: [],
      medicationList: [],
      addMedication: (medication) =>
        set((state) => ({
          medications: [
            { ...medication, id: crypto.randomUUID() },
            ...state.medications,
          ],
        })),
      deleteMedication: (id) =>
        set((state) => ({
          medications: state.medications.filter((med) => med.id !== id),
        })),
      addToMedicationList: (medication) =>
        set((state) => ({
          medicationList: [
            ...state.medicationList,
            { ...medication, id: crypto.randomUUID() },
          ],
        })),
      removeFromMedicationList: (id) =>
        set((state) => ({
          medicationList: state.medicationList.filter((med) => med.id !== id),
        })),
    }),
    {
      name: 'medication-storage',
    }
  )
);