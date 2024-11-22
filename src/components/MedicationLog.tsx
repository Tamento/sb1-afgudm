import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Trash2, Plus, Settings } from 'lucide-react';
import { useMedicationStore } from '../store/medicationStore';
import { useAuthStore } from '../store/authStore';
import type { Medication } from '../types';

const medicationSchema = z.object({
  medicationId: z.string().min(1, 'Please select a medication'),
  observations: z.string(),
  timestamp: z.string(),
});

const newMedicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
});

type MedicationForm = z.infer<typeof medicationSchema>;
type NewMedicationForm = z.infer<typeof newMedicationSchema>;

function MedicationLog() {
  const [isManaging, setIsManaging] = React.useState(false);
  const { user } = useAuthStore();
  const {
    medications,
    medicationList,
    addMedication,
    deleteMedication,
    addToMedicationList,
    removeFromMedicationList,
  } = useMedicationStore();

  const {
    register: registerMedication,
    handleSubmit: handleSubmitMedication,
    reset: resetMedication,
    formState: { errors: medicationErrors },
  } = useForm<MedicationForm>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      timestamp: new Date().toISOString().slice(0, 16),
    },
  });

  const {
    register: registerNewMedication,
    handleSubmit: handleSubmitNewMedication,
    reset: resetNewMedication,
    formState: { errors: newMedicationErrors },
  } = useForm<NewMedicationForm>({
    resolver: zodResolver(newMedicationSchema),
  });

  const onSubmitMedication = (data: MedicationForm) => {
    if (!user) return;
    const selectedMed = medicationList.find((med) => med.id === data.medicationId);
    if (!selectedMed) return;

    addMedication({
      ...data,
      name: selectedMed.name,
      dosage: selectedMed.dosage,
      userId: user.id,
    });
    resetMedication();
  };

  const onSubmitNewMedication = (data: NewMedicationForm) => {
    addToMedicationList(data);
    resetNewMedication();
  };

  const handleDeleteMedication = (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      deleteMedication(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Record Medication</h2>
          <button
            onClick={() => setIsManaging(!isManaging)}
            className="btn-secondary"
          >
            <Settings size={16} className="mr-2" />
            Manage Medications
          </button>
        </div>

        {isManaging ? (
          <div className="space-y-6">
            <form
              onSubmit={handleSubmitNewMedication(onSubmitNewMedication)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Medication Name
                </label>
                <input
                  type="text"
                  {...registerNewMedication('name')}
                  className="mt-1 input-primary"
                  placeholder="Enter medication name"
                />
                {newMedicationErrors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {newMedicationErrors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dosage
                </label>
                <input
                  type="text"
                  {...registerNewMedication('dosage')}
                  className="mt-1 input-primary"
                  placeholder="e.g., 50mg"
                />
                {newMedicationErrors.dosage && (
                  <p className="mt-1 text-sm text-red-600">
                    {newMedicationErrors.dosage.message}
                  </p>
                )}
              </div>

              <button type="submit" className="btn-primary">
                <Plus size={16} className="mr-2" />
                Add Medication
              </button>
            </form>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Medication List
              </h3>
              <div className="space-y-2">
                {medicationList.map((med) => (
                  <div
                    key={med.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div>
                      <p className="font-medium">{med.name}</p>
                      <p className="text-sm text-gray-500">{med.dosage}</p>
                    </div>
                    <button
                      onClick={() => removeFromMedicationList(med.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmitMedication(onSubmitMedication)}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Medication
              </label>
              <select
                {...registerMedication('medicationId')}
                className="mt-1 input-primary"
              >
                <option value="">Choose a medication</option>
                {medicationList.map((med) => (
                  <option key={med.id} value={med.id}>
                    {med.name} - {med.dosage}
                  </option>
                ))}
              </select>
              {medicationErrors.medicationId && (
                <p className="mt-1 text-sm text-red-600">
                  {medicationErrors.medicationId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date and Time
              </label>
              <input
                type="datetime-local"
                {...registerMedication('timestamp')}
                className="mt-1 input-primary"
              />
              {medicationErrors.timestamp && (
                <p className="mt-1 text-sm text-red-600">
                  {medicationErrors.timestamp.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Observations
              </label>
              <textarea
                {...registerMedication('observations')}
                rows={3}
                className="mt-1 input-primary"
                placeholder="Any additional notes..."
              />
              {medicationErrors.observations && (
                <p className="mt-1 text-sm text-red-600">
                  {medicationErrors.observations.message}
                </p>
              )}
            </div>

            <button type="submit" className="btn-primary">
              Record Medication
            </button>
          </form>
        )}
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Medication History</h2>
        <div className="space-y-4">
          {medications.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No medication records yet.
            </p>
          ) : (
            medications.map((medication: Medication) => (
              <div
                key={medication.id}
                className="border rounded-lg p-4 relative hover:border-gray-300 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {medication.name} - {medication.dosage}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      {format(new Date(medication.timestamp), 'PPpp')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteMedication(medication.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {medication.observations && (
                  <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                    {medication.observations}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MedicationLog;