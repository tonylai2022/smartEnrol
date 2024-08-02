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
      console.log("JWT callback - Start");
      try {
        await dbConnect();  // Ensure database connection
        let userRecord;
        if (user) {
          // When signing in, find or create the user
          userRecord = await User.findOne({ email: user.email });
          if (!userRecord) {
            userRecord = await User.create({
              name: user.name,
              email: user.email,
              role: 'user',  // Default role
            });
            console.log("New user created:", userRecord);
          }
        } else if (token.sub) {
          // On token refresh, just update the token with the latest user info
          userRecord = await User.findById(token.sub);
        }

        if (userRecord) {
          token.sub = userRecord._id.toString();
          token.role = userRecord.role;
          console.log("User role assigned:", token.role);
        }
      } catch (error) {
        console.error("JWT callback - Error:", error);
      }
      console.log("JWT callback - Token after processing:", token);
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback - Start");
      if (token && token.role) {
        session.userRole = token.role;
      } else {
        console.log("Session callback - Role missing in token");
      }
      console.log("Session callback - Final session:", session);
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
