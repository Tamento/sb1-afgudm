import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { useSleepStore } from '../store/sleepStore';
import { useAuthStore } from '../store/authStore';
import type { Sleep } from '../types';

const sleepSchema = z.object({
  date: z.string(),
  bedtime: z.string(),
  wakeTime: z.string(),
  observations: z.string(),
});

type SleepForm = z.infer<typeof sleepSchema>;

function SleepLog() {
  const { user } = useAuthStore();
  const { sleepRecords, addSleepRecord, deleteSleepRecord } = useSleepStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SleepForm>({
    resolver: zodResolver(sleepSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      bedtime: '22:00',
      wakeTime: '07:00',
    },
  });

  const onSubmit = (data: SleepForm) => {
    if (!user) return;
    addSleepRecord({
      ...data,
      userId: user.id,
    });
    reset({
      date: new Date().toISOString().slice(0, 10),
      bedtime: '22:00',
      wakeTime: '07:00',
      observations: '',
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      deleteSleepRecord(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Record Sleep Schedule</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              {...register('date')}
              className="mt-1 input-primary"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bedtime
              </label>
              <input
                type="time"
                {...register('bedtime')}
                className="mt-1 input-primary"
              />
              {errors.bedtime && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.bedtime.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Wake Time
              </label>
              <input
                type="time"
                {...register('wakeTime')}
                className="mt-1 input-primary"
              />
              {errors.wakeTime && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.wakeTime.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Observations
            </label>
            <textarea
              {...register('observations')}
              rows={3}
              className="mt-1 input-primary"
              placeholder="Any notes about sleep quality, interruptions, etc..."
            />
            {errors.observations && (
              <p className="mt-1 text-sm text-red-600">
                {errors.observations.message}
              </p>
            )}
          </div>

          <button type="submit" className="btn-primary">
            Record Sleep
          </button>
        </form>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Sleep History</h2>
        <div className="space-y-4">
          {sleepRecords.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No sleep records yet.
            </p>
          ) : (
            sleepRecords.map((record: Sleep) => (
              <div
                key={record.id}
                className="border rounded-lg p-4 relative hover:border-gray-300 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {format(new Date(record.date), 'PP')}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      {record.bedtime} - {record.wakeTime}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {record.observations && (
                  <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                    {record.observations}
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

export default SleepLog;