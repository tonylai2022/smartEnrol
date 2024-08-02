import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import dynamic from 'next/dynamic';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Header = dynamic(() => import('../components/Header'), { ssr: false });

export default function Admin() {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quota, setQuota] = useState(0);
  const [waitlist, setWaitlist] = useState(0);
  const [enrollmentOpen, setEnrollmentOpen] = useState(new Date());
  const [enrollmentClose, setEnrollmentClose] = useState(new Date());
  const [location, setLocation] = useState('');
  const [locationLink, setLocationLink] = useState('');
  const [fee, setFee] = useState('');
  const [notification, setNotification] = useState('');
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    setIsClient(true);
    if (session?.userRole === 'admin' || session?.userRole === 'superadmin') {
      fetch('/api/admin/activities')
        .then((res) => {
          if (!res.ok) throw new Error(`Failed to fetch activities: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setActivities(data);
          } else {
            console.error('Expected array but received:', data);
            setActivities([]);
          }
        })
        .catch((error) => {
          console.error('Error fetching activities:', error);
          setNotification(`Error: ${error.message}`);
        });
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

  if (session.userRole !== 'admin' && session.userRole !== 'superadmin') {
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

    try {
      const res = await fetch('/api/admin/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          quota: parseInt(quota, 10),
          waitlist: parseInt(waitlist, 10),
          enrollmentOpen: enrollmentOpen.toISOString(),
          enrollmentClose: enrollmentClose.toISOString(),
          location,
          locationLink,
          fee,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Unknown error');
      }

      const newActivity = await res.json();
      setNotification('Activity created successfully!');
      setActivities((prev) => [...prev, newActivity]);
      setName('');
      setDescription('');
      setQuota(0);
      setWaitlist(0);
      setEnrollmentOpen(new Date());
      setEnrollmentClose(new Date());
      setLocation('');
      setLocationLink('');
      setFee('');
    } catch (error) {
      console.error('Error creating activity:', error);
      setNotification(`Failed to create activity: ${error.message}`);
    }

    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  const handleDelete = async (activityId) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      try {
        const res = await fetch('/api/admin/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ activityId }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Unknown error');
        }

        setNotification('Deleted successfully!');
        setActivities((prev) => prev.filter((activity) => activity._id !== activityId));
      } catch (error) {
        console.error('Error deleting activity:', error);
        setNotification(`Failed to delete activity: ${error.message}`);
      }

      setTimeout(() => {
        setNotification('');
      }, 3000);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date provided';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

    return `${dayOfWeek}, ${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="quota">
              Quota
            </label>
            <input
              className="w-full p-2 text-black"
              type="number"
              id="quota"
              value={quota}
              onChange={(e) => setQuota(parseInt(e.target.value, 10))}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="waitlist">
              Waitlist
            </label>
            <input
              className="w-full p-2 text-black"
              type="number"
              id="waitlist"
              value={waitlist}
              onChange={(e) => setWaitlist(parseInt(e.target.value, 10))}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="enrollmentOpen">
              Enrollment Open Date
            </label>
            <DatePicker
              selected={enrollmentOpen}
              onChange={(date) => setEnrollmentOpen(date)}
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm:ss"
              className="w-full p-2 text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="enrollmentClose">
              Enrollment Close Date
            </label>
            <DatePicker
              selected={enrollmentClose}
              onChange={(date) => setEnrollmentClose(date)}
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm:ss"
              className="w-full p-2 text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="location">
              Location
            </label>
            <input
              className="w-full p-2 text-black"
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location or address"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="locationLink">
              Location Link
            </label>
            <input
              className="w-full p-2 text-black"
              type="text"
              id="locationLink"
              value={locationLink}
              onChange={(e) => setLocationLink(e.target.value)}
              placeholder="Enter Google Maps link or similar"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="fee">
              Fee
            </label>
            <input
              className="w-full p-2 text-black"
              type="text"
              id="fee"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              placeholder="Enter fee amount (e.g., Free, $10, Donation)"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Create Activity
          </button>
        </form>
        <div className="mt-8">
          <h2 className="text-3xl font-bold">Activities</h2>
          <ul>
            {activities.map((activity) => (
              <li key={activity._id} className="border p-4 mb-4">
                <h3 className="text-2xl font-bold">{activity.name}</h3>
                <p>{activity.description || 'No description provided'}</p>
                <p>Quota: {activity.quota}</p>
                <p>Waitlist: {activity.waitlist}</p>
                <p>Enrollment Open: {formatDate(activity.enrollmentOpen)}</p>
                <p>Enrollment Close: {formatDate(activity.enrollmentClose)}</p>
                <p>Location: {activity.location || 'N/A'}</p>
                {activity.locationLink && (
                  <p>
                    <a href={activity.locationLink} target="_blank" rel="noopener noreferrer" className="text-blue-400">
                      View Location
                    </a>
                  </p>
                )}
                <p>Fee: {activity.fee || 'N/A'}</p>
                <button
                  onClick={() => handleDelete(activity._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded mt-2 inline-block ml-2"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
