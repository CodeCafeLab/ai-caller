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
import { api } from "@/lib/apiConfig";
import { useState, useTransition } from "react";
import { useUser } from "@/lib/utils";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const { setUser } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const response = await api.login(values);
        const data = await response.json();

        if (data.token) {
          tokenStorage.setToken(data.token);
        }

        if (data.success && data.user) {
          setUser({
            userId: data.user.id,
            email: data.user.email,
            name: data.user.name || data.user.email.split("@")[0],
            role: data.user.role,
            type: data.user.type,
          });

          toast({
            title: "Sign In Successful",
            description: `Welcome back, ${
              data.user.name || data.user.email
            }!`,
          });

          let redirectPath = "/dashboard";
          if (
            data.user.type === "admin" &&
            data.user.role === "admin_users"
          ) {
            redirectPath = "/admin_users/dashboard";
          } else if (data.user.type === "client") {
            redirectPath = "/client-admin/dashboard";
          }
          router.push(redirectPath);
        } else {
          throw new Error(data?.message || "No user data returned");
        }
      } catch (error) {
        console.error("Login error:", error);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: error instanceof Error ? error.message : "Unknown error",
        });
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Sign In</CardTitle>
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
                      placeholder="Enter email"
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
                      placeholder="Enter password"
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
