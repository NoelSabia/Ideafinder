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
    credentials: {
      name: { label: "Name", type: "name" },
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
      action: { label: "Action", type: "text" },
    },

    async authorize(credentials) {
      const isSignup = credentials.action === 'signup';
      const endpoint = isSignup ? "http://localhost:8000/signup" : "http://localhost:8000/login";

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
        })
      });

      const user = await response.json();

      if (response.ok && user) {
        return user;
      }
      return null;
    },
  }), 
  ],
});
