import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login', // Add error page
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = nextUrl.pathname === '/login';
      const isPublicPath = isLoginPage || nextUrl.pathname.startsWith('/api/');
      
      // If the user is on the login page and is already logged in,
      // redirect them to the home page (root) since there's no dashboard
      if (isLoginPage && isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl));
      }

      // If it's a public path, allow access regardless of auth status
      if (isPublicPath) {
        return true;
      }
      
      // If the user isn't logged in and tried to access a protected page,
      // redirect them to the login page
      if (!isLoggedIn) {
        return Response.redirect(new URL('/login', nextUrl));
      }

      // Allow access to protected routes for logged-in users
      return true;
    },
    // Add session callback to customize the session object
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
  providers: [], // Auth providers are configured in auth.ts
} satisfies NextAuthConfig;