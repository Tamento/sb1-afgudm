import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { useCrisisStore } from '../store/crisisStore';
import { useAuthStore } from '../store/authStore';
import type { Crisis } from '../types';

const crisisSchema = z.object({
  type: z.enum(['sensations', 'tetany', 'convulsions']),
  observations: z.string().min(1, 'Observations are required'),
  timestamp: z.string(),
});

type CrisisForm = z.infer<typeof crisisSchema>;

function CrisisLog() {
  const { user } = useAuthStore();
  const { crises, addCrisis, deleteCrisis } = useCrisisStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CrisisForm>({
    resolver: zodResolver(crisisSchema),
    defaultValues: {
      timestamp: new Date().toISOString().slice(0, 16),
    },
  });

  const onSubmit = (data: CrisisForm) => {
    if (!user) return;
    addCrisis({
      ...data,
      userId: user.id,
    });
    reset();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      deleteCrisis(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Record New Crisis</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type of Crisis
            </label>
            <select
              {...register('type')}
              className="mt-1 input-primary"
            >
              <option value="sensations">Sensations</option>
              <option value="tetany">Tétanie</option>
              <option value="convulsions">Convulsions</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date and Time
            </label>
            <input
              type="datetime-local"
              {...register('timestamp')}
              className="mt-1 input-primary"
            />
            {errors.timestamp && (
              <p className="mt-1 text-sm text-red-600">
                {errors.timestamp.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Observations
            </label>
            <textarea
              {...register('observations')}
              rows={3}
              className="mt-1 input-primary"
              placeholder="Describe the symptoms, triggers, or any other relevant details..."
            />
            {errors.observations && (
              <p className="mt-1 text-sm text-red-600">
                {errors.observations.message}
              </p>
            )}
          </div>

          <button type="submit" className="btn-primary">
            Record Crisis
          </button>
        </form>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Crisis History</h2>
        <div className="space-y-4">
          {crises.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No crisis records yet.
            </p>
          ) : (
            crises.map((crisis: Crisis) => (
              <div
                key={crisis.id}
                className="border rounded-lg p-4 relative hover:border-gray-300 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-pink-100 text-pink-800">
                      {crisis.type}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      {format(new Date(crisis.timestamp), 'PPpp')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(crisis.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                  {crisis.observations}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CrisisLog;