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
        // Call backend login endpoint
        const loginRes = await api.login(values);

        // Check if the response is ok
        if (!loginRes.ok) {
          console.error(
            "Login API error:",
            loginRes.status,
            loginRes.statusText
          );
          throw new Error(
            `Server error: ${loginRes.status} ${loginRes.statusText}`
          );
        }

        const loginData = await loginRes.json();
        console.log("Login response:", loginData);

        // Check if loginData is empty or invalid
        if (!loginData || typeof loginData !== "object") {
          console.error("Invalid login response:", loginData);
          throw new Error("Invalid response from server");
        }

        if (loginData.success) {
          // Store the token in localStorage
          if (loginData.token) {
            tokenStorage.setToken(loginData.token);
            console.log("Token stored successfully");
          } else {
            console.warn("No token received in login response");
          }
          // Fetch user profile using cookie
          const profileRes = await api.getCurrentUser();
          const profileData = await profileRes.json();
          console.log("Profile data:", profileData);

          if (profileData.success) {
            const userData = {
              userId: profileData.data.id ? profileData.data.id.toString() : "",
              email: profileData.data.email,
              name: profileData.data.name || profileData.data.companyName,
              fullName: profileData.data.name || profileData.data.companyName,
              role: loginData.user.role,
              type: loginData.user.type,
              avatarUrl: profileData.data.avatar_url,
              companyName: loginData.user.companyName,
            };
            console.log("Setting user data:", userData);
            setUser(userData);

            toast({
              title: "Sign In Successful",
              description: `Welcome, ${
                profileData.data.name || profileData.data.companyName
              }!`,
            });

            // Redirect based on user type
            if (loginData.user.type === "admin") {
              console.log(
                "Admin user, redirecting based on role:",
                loginData.user.role
              );
              if (loginData.user.role === "admin_users") {
                router.push("/admin_users/dashboard");
              } else {
                router.push("/dashboard");
              }
            } else if (loginData.user.type === "client") {
              console.log("Client user, redirecting to client dashboard");
              router.push("/client-admin/dashboard");
            } else {
              console.log("Unknown user type:", loginData.user.type);
              router.push("/dashboard");
            }
          } else {
            console.error("Failed to fetch profile:", profileData);
            toast({
              title: "Failed to fetch profile",
              description: profileData.message || "Could not load user profile",
              variant: "destructive",
            });
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
