import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import the Header component, disabling server-side rendering for it
const Header = dynamic(() => import('../components/Header'), { ssr: false });

export default function Test() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // A safe fallback to avoid mismatches during hydration
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <h2 className="text-3xl font-bold">Welcome to the Test Page</h2>
      <p className="mt-2 text-xl">This is a simple test page.</p>
    </div>
  );
}
