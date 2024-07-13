import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import dynamic from 'next/dynamic';

// Dynamically import the Header component, disabling server-side rendering for it
const Header = dynamic(() => import('../components/Header'), { ssr: false });

export default function Admin() {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [notification, setNotification] = useState('');
  const [createdActivities, setCreatedActivities] = useState([]);

  useEffect(() => {
    setIsClient(true);

    if (session) {
      fetch('/api/admin/activities')
        .then((res) => res.json())
        .then((data) => setCreatedActivities(data));
    }
  }, [session]);

  if (!isClient || status === 'loading') return <div>Loading...</div>;

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <div className="container mx-auto p-4">
          <h1 className="text-4xl font-bold text-center">Please log in as admin</h1>
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

  if (session.user.role !== 'admin' && session.user.role !== 'superadmin') {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <div className="container mx-auto p-4">
          <h1 className="text-4xl font-bold text-center">Access Denied</h1>
        </div>
      </div>
    );
  }

  const handleCreateActivity = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    });

    if (res.ok) {
      const newActivity = await res.json();
      setCreatedActivities([...createdActivities, newActivity]);
      setNotification('Activity created successfully!');
      setName('');
      setDescription('');
    } else {
      const errorData = await res.json();
      setNotification(`Failed to create activity: ${errorData.details}`);
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
        <h1 className="text-4xl font-bold text-center">Admin Dashboard</h1>
        {notification && (
          <div className="bg-green-500 text-white px-4 py-2 rounded mb-4 text-center">
            {notification}
          </div>
        )}
        <form onSubmit={handleCreateActivity} className="mt-4">
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="name">
              Activity Name
            </label>
            <input
              className="w-full p-2 text-black"
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              className="w-full p-2 text-black"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Create Activity
          </button>
        </form>
        <div className="mt-8">
          <h2 className="text-3xl font-bold">Created Activities</h2>
          {createdActivities.length === 0 ? (
            <p>No activities created yet</p>
          ) : (
            <ul>
              {createdActivities.map((activity) => (
                <li key={activity._id} className="border p-4 mb-4">
                  <h3 className="text-2xl font-bold">{activity.name}</h3>
                  <p>{activity.description}</p>
                  <h4 className="text-xl font-bold mt-2">Participants:</h4>
                  <ul>
                    {activity.participants.map((participant) => (
                      <li key={participant._id} className="ml-4">
                        {participant.name} ({participant.email})
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
