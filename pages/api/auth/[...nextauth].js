import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      try {
        await dbConnect();
        if (user) {
          let userRecord = await User.findOne({ email: user.email });
          if (!userRecord) {
            userRecord = await User.create({
              name: user.name,
              email: user.email,
              role: 'user',
            });
          }
          token.sub = userRecord._id.toString();
          token.role = userRecord.role;
        }
      } catch (error) {
        console.error("JWT callback - Error:", error);
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.userId = token.sub;
        session.userRole = token.role || 'user';
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: true,
};

export default NextAuth(authOptions);
