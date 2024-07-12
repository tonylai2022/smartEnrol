import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

// Dynamically import the Header component, disabling server-side rendering for it
const Header = dynamic(() => import('../components/Header'), { ssr: false });

export default function SuperAdmin() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (session?.userRole === 'superadmin') {
      fetch('/api/users')
        .then((res) => res.json())
        .then((data) => setUsers(data));
    }
  }, [session]);

  if (status === 'loading') return <div>Loading...</div>;

  if (!session || session.userRole !== 'superadmin') {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <div className="container mx-auto p-4">
          <h1 className="text-4xl font-bold text-center">Access Denied</h1>
        </div>
      </div>
    );
  }

  const updateRole = async (userId, role) => {
    await fetch('/api/user/role', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, role }),
    });
    setUsers(users.map(user => user._id === userId ? { ...user, role } : user));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center">Super Admin Dashboard</h1>
        <table className="mt-4 w-full text-left table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.role}</td>
                <td className="border px-4 py-2">
                  {user.role !== 'superadmin' && (
                    <>
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                        onClick={() => updateRole(user._id, 'admin')}
                      >
                        Make Admin
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => updateRole(user._id, 'user')}
                      >
                        Revoke Admin
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
