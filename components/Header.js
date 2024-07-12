// components/Header.js
import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-800 p-4">
      <nav className="container mx-auto flex justify-between">
        <h1 className="text-2xl text-white">Enrollment App</h1>
        <div>
          <Link href="/" className="text-white mr-4">
            Home
          </Link>
          <Link href="/activities" className="text-white mr-4">
            Activities
          </Link>
          <Link href="/admin" className="text-white">
            Admin
          </Link>
        </div>
      </nav>
    </header>
  );
}
