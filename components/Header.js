import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <div>
          <Link href="/" className="text-xl font-bold">
            Enrollment App
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <Link href="/profile" className="text-lg">
                Profile
              </Link>
              <Link href="/activities" className="text-lg">
                Activities
              </Link>
              {(session.userRole === 'admin' || session.userRole === 'superadmin') && (
                <Link href="/admin" className="text-lg">
                  Admin
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
