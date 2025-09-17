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

// Form validation schema
const formSchema = z.object({
  email: z.string().min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
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
        console.log("[DEBUG] Attempting login with email:", values.email);
        
        // Use relative URL for API calls to work on both local and domain
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        const loginUrl = `${apiUrl}/api/auth/login`;
        console.log("[DEBUG] API URL:", loginUrl);

        const response = await fetch(loginUrl, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          credentials: "include", // Required for cookies
          body: JSON.stringify(values),
        });

        const data = await response.json();
        
        if (!response.ok) {
          console.error("[ERROR] Login failed:", response.status, data);
          throw new Error(
            data.message || `Login failed: ${response.status} ${response.statusText}`
          );
        }

        // Handle token from response
        if (data.token) {
          tokenStorage.setToken(data.token);
        }
        
        // Set user data in context
        if (data.user) {
          const userData = {
            userId: data.user.id,  // Changed from 'id' to 'userId' to match AuthUser type
            email: data.user.email,
            name: data.user.name || data.user.email.split('@')[0],
            role: data.user.role || 'user',
            type: data.user.type || 'admin' as const
          };

          setUser(userData);
          console.log("[DEBUG] User data set:", userData);

          // Show welcome message
          toast({
            title: "Sign In Successful",
            description: `Welcome back, ${userData.name || userData.email}!`,
          });

          // Redirect based on user type and role
          const userType = data.user.type || "user";
          const userRole = data.user.role || "user";
          
          // Handle redirection
          let redirectPath = "/dashboard";
          if (userType === "admin" && userRole === "admin_users") {
            redirectPath = "/admin_users/dashboard";
          } else if (userType === "client") {
            redirectPath = "/client-admin/dashboard";
          }
          
          console.log(`[DEBUG] Redirecting to: ${redirectPath}`);
          router.push(redirectPath);
          
        } else {
          throw new Error("No user data received from server");
        }
      } catch (error) {
        console.error("Login error:", error);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: error instanceof Error ? error.message : "An unknown error occurred",
        });
      }
    });
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Sign In
        </CardTitle>
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
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
                      placeholder="Enter your password"
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
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:underline"
              >
                ← Back to Home
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
