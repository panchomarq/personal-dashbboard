'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/lib/actions';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export default function LoginForm() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: ''
  });

  const validateInput = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setValidationErrors(prev => ({
        ...prev,
        email: !value ? 'Email is required' : 
              !emailPattern.test(value) ? 'Please enter a valid email' : ''
      }));
    }
    
    if (name === 'password') {
      setValidationErrors(prev => ({
        ...prev,
        password: !value ? 'Password is required' : 
                 value.length < 6 ? 'Password must be at least 6 characters' : ''
      }));
    }
  };

  return (
    <form action={dispatch} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className="text-xl font-semibold">
          Please log in to continue
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className={`peer block w-full rounded-md border ${
                  validationErrors.email ? 'border-red-500' : 'border-gray-200'
                } py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500`}
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
                aria-describedby="email-error"
                onBlur={validateInput}
              />
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-gray-400">
                  <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                  <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                </svg>
              </span>
            </div>
            {validationErrors.email && (
              <p className="mt-1 text-xs text-red-500" id="email-error">
                {validationErrors.email}
              </p>
            )}
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className={`peer block w-full rounded-md border ${
                  validationErrors.password ? 'border-red-500' : 'border-gray-200'
                } py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500`}
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
                aria-describedby="password-error"
                onBlur={validateInput}
              />
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-gray-400">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            {validationErrors.password && (
              <p className="mt-1 text-xs text-red-500" id="password-error">
                {validationErrors.password}
              </p>
            )}
          </div>
        </div>
        <LoginButton />
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-red-500">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-500">{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button 
      className="mt-4 w-full" 
      aria-disabled={pending}
      disabled={pending}
    >
      {pending ? 'Logging in...' : 'Log in'}
    </Button>
  );
}
