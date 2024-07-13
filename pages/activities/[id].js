import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

// Dynamically import the Header component, disabling server-side rendering for it
const Header = dynamic(() => import('../../components/Header'), { ssr: false });

export default function ActivityDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/activities/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data._id) {
            setActivity(data);
          } else {
            console.error('Activity data not found:', data);
          }
        });
    }
  }, [id]);

  if (!activity) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center">{activity.name}</h1>
        <div className="mt-4">
          <p>{activity.description}</p>
        </div>
      </div>
    </div>
  );
}
