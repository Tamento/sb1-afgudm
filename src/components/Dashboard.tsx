import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Pill,
  Moon,
  FileText,
  Download,
  ChevronRight,
} from 'lucide-react';

function Dashboard() {
  const cards = [
    {
      name: 'Crisis Log',
      description: 'Record and track health episodes',
      icon: Activity,
      href: '/crises',
      color: 'bg-pink-500',
    },
    {
      name: 'Medications',
      description: 'Manage medication intake',
      icon: Pill,
      href: '/medications',
      color: 'bg-blue-500',
    },
    {
      name: 'Sleep Tracker',
      description: 'Monitor sleep patterns',
      icon: Moon,
      href: '/sleep',
      color: 'bg-purple-500',
    },
    {
      name: 'Notes',
      description: 'Additional health observations',
      icon: FileText,
      href: '/notes',
      color: 'bg-green-500',
    },
    {
      name: 'Export Data',
      description: 'Download health records',
      icon: Download,
      href: '/export',
      color: 'bg-gray-500',
    },
  ];

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Welcome to Wendy's Health Tracker. Select a category to get started.
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.name}
                to={card.href}
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <span
                    className={`inline-flex p-3 rounded-lg ${card.color} text-white`}
                  >
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {card.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {card.description}
                  </p>
                </div>
                <span
                  className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                  aria-hidden="true"
                >
                  <ChevronRight className="h-6 w-6" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;