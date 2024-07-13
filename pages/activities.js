import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import the Header component, disabling server-side rendering for it
const Header = dynamic(() => import('../components/Header'), { ssr: false });

export default function Activities() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch('/api/activities')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setActivities(data);
        } else {
          console.error('Activities data is not an array:', data);
        }
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center">Activities</h1>
        <div className="mt-8">
          {activities.length === 0 ? (
            <p>No activities available</p>
          ) : (
            <ul>
              {activities.map((activity) => (
                <li key={activity._id} className="border p-4 mb-4">
                  <h3 className="text-2xl font-bold">{activity.name}</h3>
                  <p>{activity.description}</p>
                  <Link href={`/activities/${activity._id}`} legacyBehavior>
                    <a className="bg-green-500 text-white px-4 py-2 rounded mt-2 inline-block">
                      View Activity
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
