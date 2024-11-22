export type User = {
  id: string;
  name: string;
  email: string;
};

export type Crisis = {
  id: string;
  type: 'sensations' | 'tetany' | 'convulsions';
  observations: string;
  timestamp: string;
  userId: string;
};

export type Medication = {
  id: string;
  name: string;
  dosage: string;
  observations: string;
  timestamp: string;
  userId: string;
};

export type Sleep = {
  id: string;
  bedtime: string;
  wakeTime: string;
  observations: string;
  date: string;
  userId: string;
};

export type Note = {
  id: string;
  content: string;
  timestamp: string;
  userId: string;
};