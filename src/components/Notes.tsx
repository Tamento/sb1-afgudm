import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { useNoteStore } from '../store/noteStore';
import { useAuthStore } from '../store/authStore';
import type { Note } from '../types';

const noteSchema = z.object({
  content: z.string().min(1, 'Note content is required'),
  timestamp: z.string(),
});

type NoteForm = z.infer<typeof noteSchema>;

function Notes() {
  const { user } = useAuthStore();
  const { notes, addNote, deleteNote } = useNoteStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteForm>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      timestamp: new Date().toISOString().slice(0, 16),
    },
  });

  const onSubmit = (data: NoteForm) => {
    if (!user) return;
    addNote({
      ...data,
      userId: user.id,
    });
    reset({
      content: '',
      timestamp: new Date().toISOString().slice(0, 16),
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      deleteNote(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Add New Note</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              Note Content
            </label>
            <textarea
              {...register('content')}
              rows={4}
              className="mt-1 input-primary"
              placeholder="Enter your observations, symptoms, or any other health-related notes..."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          <button type="submit" className="btn-primary">
            Add Note
          </button>
        </form>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Notes History</h2>
        <div className="space-y-4">
          {notes.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No notes yet.</p>
          ) : (
            notes.map((note: Note) => (
              <div
                key={note.id}
                className="border rounded-lg p-4 relative hover:border-gray-300 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {format(new Date(note.timestamp), 'PPpp')}
                  </span>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                  {note.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Notes;