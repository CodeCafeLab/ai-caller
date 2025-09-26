
'use server';

import { z } from 'zod';
import { urls } from '@/lib/config/urls';

// Define UserRole type - ensure this matches roles used in your application
export type UserRole = 'super_admin' | 'client_admin' | 'user' | 'agent' | 'analyst' | 'viewer';

const signInSchema = z.object({
  // For this temporary bypass, we'll still use 'email' as the field name,
  // but the user can enter any non-empty string.
  email: z.string().min(1, { message: "User ID (any text) is required." }),
  password: z.string().min(1, { message: "Password (any text) is required." }),
});

interface SignInResult {
  success: boolean;
  message: string;
  user: { userId: string; email: string; fullName: string | null; role: UserRole; } | null;
  error?: Error | null;
}

export async function signInUserAction(values: z.infer<typeof signInSchema>): Promise<SignInResult> {
  console.log("Attempting sign-in with values:", values);

  const validatedFields = signInSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, message: 'Invalid input.', user: null };
  }

  const { email, password } = validatedFields.data;

  try {
    const response = await fetch(urls.backend.api('/auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies to be sent/received
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('Login response:', data);

    if (!response.ok || !data?.success) {
      return { 
        success: false, 
        message: data?.message || 'Login failed', 
        user: null 
      };
    }

    // The token is automatically stored in the HTTP-only cookie
    return {
      success: true,
      message: 'Login successful',
      user: {
        userId: data.user?.id || '',
        email: data.user?.email || email,
        fullName: data.user?.name || email.split('@')[0],
        role: data.user?.role || 'user',
      }
    };

  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      message: 'Network error. Please try again.', 
      user: null,
      error: error as Error 
    };
  }
  // --- End of Temporary Bypass Logic ---
}
