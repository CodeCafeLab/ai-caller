import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import { Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Authenticate - AI Caller",
  description: "Sign in or sign up to AI Caller",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full flex">
      {/* Left side - Welcome Section */}
      <div className="hidden lg:flex flex-col justify-center p-12 w-1/2">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-4xl font-bold mb-4">Welcome to AI Caller</h1>
          <p className="text-lg">Login to AI Caller Dashboard</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Logo />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
