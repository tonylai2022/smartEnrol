// pages/login.js
import { signIn } from 'next-auth/client';

export default function Login() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center">Login</h1>
      <div className="mt-4 text-center">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => signIn('google')}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
