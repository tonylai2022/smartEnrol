import React from 'react';
import Header from '../components/Header';
import Link from 'next/link';

const activities = [
  // Sample data
  { id: 1, title: 'Activity 1', description: 'Description of Activity 1' },
  { id: 2, title: 'Activity 2', description: 'Description of Activity 2' },
];

export default function Activities() {
  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center">Activities</h1>
        <div className="mt-4">
          {activities.map((activity) => (
            <div key={activity.id} className="border p-4 mb-4">
              <h2 className="text-2xl font-bold">{activity.title}</h2>
              <p>{activity.description}</p>
              <Link href={`/activity?id=${activity.id}`} className="text-blue-500">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
