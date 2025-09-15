"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { tokenStorage } from "@/lib/tokenStorage";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { signInUserAction } from "@/actions/auth";
import { useState, useTransition } from "react";
import { useUser } from "@/lib/utils";
import { api } from "@/lib/apiConfig";

// For this temporary bypass, the user can enter any non-empty string
// into the "Email" field (acting as a User ID) and any non-empty string for "Password".
const formSchema = z.object({
  email: z.string().min(1, { message: "Please enter any text for User ID." }),
  password: z
    .string()
    .min(1, { message: "Please enter any text for Password." }),
});

export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const { setUser } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        console.log("Attempting login with:", values.email);

        // Call backend login endpoint with credentials
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenStorage.getToken()}`,
          },
          credentials: 'include', // Important for cookies
          body: JSON.stringify(values),
        });

        console.log('[FRONTEND] Sending login request to /api/auth/login');

        const data = await response.json();
        console.log('[FRONTEND] Login response:', {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText,
          data
        });
        
        if (response.ok && data.token) {
          console.log('[FRONTEND] Login successful, token received');
          tokenStorage.setToken(data.token);
          console.log('[FRONTEND] Token stored in storage:', !!tokenStorage.getToken());
        }
        console.log('[FRONTEND] Login attempt with:', values);

        // Check if the response is ok
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Login API error:", response.status, errorData);
          throw new Error(
            errorData.message || `Server error: ${response.status} ${response.statusText}`
          );
        }

        const loginData = data;
        console.log("Login response:", loginData);

        // Check if loginData is empty or invalid
        if (!loginData || typeof loginData !== 'object') {
          console.error("Invalid login response:", loginData);
          throw new Error("Invalid response from server");
        }

        if (loginData.success) {
          // Store the token in both cookie and localStorage (for backward compatibility)
          if (loginData.token) {
            tokenStorage.setToken(loginData.token);
            console.log("Token stored successfully");
          }

          // Set user data in context
          if (loginData.user) {
            const userData = {
              userId: loginData.user.id?.toString() || "",
              email: loginData.user.email || values.email,
              name: loginData.user.name || values.email,
              role: loginData.user.role || 'user',
            };
            
            console.log("Setting user data:", userData);
            setUser(userData);

            // Show welcome message
            toast({
              title: "Sign In Successful",
              description: `Welcome back, ${userData.name || userData.email}!`,
            });

            // Redirect based on user type
            const userType = loginData.user.type || 'user';
            const userRole = loginData.user.role || 'user';
            
            console.log(`User type: ${userType}, Role: ${userRole}`);
            
            // Handle redirection based on user type and role
            switch (userType) {
              case 'admin':
                if (userRole === 'admin_users') {
                  router.push("/admin_users/dashboard");
                } else {
                  router.push("/dashboard");
                }
                break;
              case 'client':
                router.push("/client-admin/dashboard");
                break;
              default:
                console.log("Unknown user type:", userType);
                router.push("/dashboard");
            }
          }
        } else {
          console.error("Login failed:", loginData);
          toast({
            title: "Sign In Failed",
            description:
              loginData?.message || "Invalid credentials or server error",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('[FRONTEND] Login error:', error);
        console.error("Error during login:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        toast({
          title: "Sign In Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="e.g., admin or clientadmin"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter any password"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Signing In..." : "Sign In"}
            </Button>
            <div className="text-center mt-4">
              <Link href="/" className="text-sm text-muted-foreground hover:underline">
                ← Back to Home
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
