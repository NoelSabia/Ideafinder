// auth.ts
import NextAuth from "next-auth";
// import GoogleProvider from 'next-auth/providers/google';
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET
    // }),
    
    Credentials({
      // 1. Add the credentials object to define your form fields.
      credentials: {
        name: { label: "Name", type: "name" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      // 2. The authorize function receives these credentials.
      async authorize(credentials) {
        // The `credentials` object will now have `email` and `password` properties.
        console.log(credentials); // { email: 'user@example.com', password: 'userpassword' }

        // Add your logic here to find the user in your database
        const user = { id: "1", name: "Admin", email: "admin@example.com" };
        if (user) {
          // If authentication is successful, return the user object.
          return user;
        }
        // If authentication fails, return null.
        return null;
      },
    }),
  ],
});
