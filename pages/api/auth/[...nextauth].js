import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';

dbConnect();

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Add other providers as needed
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.userId = token.sub;
        session.userRole = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        const userRecord = await User.findOne({ email: user.email });
        if (!userRecord) {
          const newUser = await User.create({
            name: user.name,
            email: user.email,
            role: 'user', // Default role
          });
          token.sub = newUser._id;
          token.role = newUser.role;
        } else {
          token.sub = userRecord._id;
          token.role = userRecord.role;
        }
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error', // Error code passed in query string as ?error=
  },
});
