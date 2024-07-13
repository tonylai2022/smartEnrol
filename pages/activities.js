import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';

// Dynamically import the Header component, disabling server-side rendering for it
const Header = dynamic(() => import('../components/Header'), { ssr: false });

export default function Activities() {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  const [activities, setActivities] = useState([]);
  const [enrolledActivities, setEnrolledActivities] = useState(new Set());
  const [notification, setNotification] = useState('');

  useEffect(() => {
    setIsClient(true);
    fetch('/api/activities')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setActivities(data);
        } else {
          console.error('Activities data is not an array:', data);
        }
      });

    if (session) {
      fetch('/api/profile')
        .then((res) => res.json())
        .then((data) => {
          if (data.joinedActivities) {
            const enrolledSet = new Set(data.joinedActivities.map((activity) => activity._id));
            setEnrolledActivities(enrolledSet);
          }
        });
    }
  }, [session]);

  if (!isClient || status === 'loading') return <div>Loading...</div>;

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <div className="container mx-auto p-4">
          <h1 className="text-4xl font-bold text-center">Please log in</h1>
          <div className="mt-4 text-center">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => signIn('google')}
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleEnroll = async (activityId) => {
    const res = await fetch('/api/enroll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ activityId }),
    });

    if (res.ok) {
      setNotification('Enrolled successfully!');
      setEnrolledActivities((prev) => new Set(prev).add(activityId));
    } else {
      const errorData = await res.json();
      setNotification(`Failed to enroll: ${errorData.error || 'Unknown error'}`);
    }

    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center">Activities</h1>
        {notification && (
          <div className="bg-green-500 text-white px-4 py-2 rounded mb-4 text-center">
            {notification}
          </div>
        )}
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
                  {enrolledActivities.has(activity._id) ? (
                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded mt-2 inline-block"
                      disabled
                    >
                      Enrolled
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEnroll(activity._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded mt-2 inline-block"
                    >
                      Enroll
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
