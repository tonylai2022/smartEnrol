import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../lib/mongodb';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async session({ session, token }) {
      console.log('Session callback', { session, token });
      session.user.role = token.role;
      return session;
    },
    async jwt({ token, user }) {
      console.log('JWT callback', { token, user });
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async signIn({ user }) {
      console.log('SignIn callback', { user });
      if (!user.role) {
        user.role = 'user'; // Default role
      }
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  debug: true, // Enable debug mode to get more information
};

export default NextAuth(authOptions);
