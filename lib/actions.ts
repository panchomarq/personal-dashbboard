'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

// Login form validation schema
const LoginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    console.log('Authentication started');
    
    // Validate form data
    const validatedFields = LoginFormSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (!validatedFields.success) {
      return validatedFields.error.errors[0]?.message || 'Invalid form data';
    }

    console.log('Form validation passed, attempting sign in');
    
    // Use callbackUrl to specify where to redirect after successful login
    const signInResult = await signIn('credentials', {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      redirect: false,
    });

    console.log('Sign in result:', signInResult);
    
    // If sign in was not successful, return an error
    if (signInResult?.error) {
      return 'Invalid email or password';
    }
    
    console.log('Authentication successful, redirecting to home page');
    
    // If we get here, it means the authentication was successful
    // Redirect to home page since there's no dashboard
    redirect('/');
  } catch (error) {
    console.error('Authentication error details:', error);
    
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid email or password. Please try again.';
        case 'CallbackRouteError':
          return 'There was a problem with the authentication callback route.';
        case 'OAuthAccountNotLinked':
          return 'Email already exists with a different provider.';
        case 'OAuthSignInError':
          return 'Error signing in with OAuth provider.';
        default:
          return 'Something went wrong. Please try again.';
      }
    }

    console.error('Authentication error:', error);
    return 'An unexpected error occurred. Please try again later.';
  }
}