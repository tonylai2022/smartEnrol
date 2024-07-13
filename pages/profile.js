import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import the Header component, disabling server-side rendering for it
const Header = dynamic(() => import('../components/Header'), { ssr: false });

export default function Profile() {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [createdActivities, setCreatedActivities] = useState([]);
  const [joinedActivities, setJoinedActivities] = useState([]);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    setIsClient(true);
    if (session) {
      fetch('/api/profile')
        .then((res) => res.json())
        .then((data) => {
          setUser(data.user);
          setName(data.user.name);
          setCreatedActivities(data.createdActivities);
          setJoinedActivities(data.joinedActivities);
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

  const handleNameChange = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      const updatedUser = await res.json();
      setUser(updatedUser);
      setNotification('Name updated successfully!');
    } else {
      setNotification('Failed to update name.');
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
        <h1 className="text-4xl font-bold text-center">Profile</h1>
        <div className="mt-4">
          {notification && (
            <div className="bg-green-500 text-white px-4 py-2 rounded mb-4 text-center">
              {notification}
            </div>
          )}
          <form onSubmit={handleNameChange}>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="name">
                Name
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
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Update Name
            </button>
          </form>
          <div className="mt-8">
            <h2 className="text-3xl font-bold">Role: {user?.role}</h2>
            <div className="mt-4">
              <h3 className="text-2xl font-bold">Created Activities</h3>
              <ul>
                {createdActivities.map((activity) => (
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
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold">Joined Activities</h3>
              <ul>
                {joinedActivities.map((activity) => (
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
