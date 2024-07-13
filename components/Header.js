import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

const Header = () => {
  const { data: session, status } = useSession();

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" legacyBehavior>
          <a className="text-2xl font-bold">Enrollment App</a>
        </Link>
        <nav className="flex items-center">
          {status === 'authenticated' ? (
            <>
              <Link href="/profile" legacyBehavior>
                <a className="ml-4">Profile</a>
              </Link>
              <Link href="/activities" legacyBehavior>
                <a className="ml-4">Activities</a>
              </Link>
              {session.user.role === 'admin' || session.user.role === 'superadmin' ? (
                <Link href="/admin" legacyBehavior>
                  <a className="ml-4">Admin</a>
                </Link>
              ) : null}
              <button
                onClick={() => signOut()}
                className="ml-4 bg-red-500 px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="bg-blue-500 px-4 py-2 rounded"
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
