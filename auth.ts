import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/lib/types/definitions';
import bcrypt from 'bcrypt';
 
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: {
    // Use JWT for sessions
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        // Validate credential format
        const parsedCredentials = z
          .object({ 
            email: z.string().email('Invalid email format'), 
            password: z.string().min(6, 'Password must be at least 6 characters') 
          })
          .safeParse(credentials);
        
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          
          if (!user) {
            console.log("User not found");
            return null;
          }
          
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            // Only return necessary user data, do not expose sensitive info
            return {
              id: user.id,
              name: user.name,
              email: user.email,
            };
          }
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
  callbacks: {
    // Add JWT callback to store user ID
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  }
});