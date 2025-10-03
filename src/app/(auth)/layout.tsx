import type { Metadata } from "next";
import Image from "next/image";
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Left side - Welcome Section */}
      <div className="lg:flex-1 bg-gradient-to-br from-primary/10 to-background flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center lg:text-left">
          <div className="mb-6 flex items-center justify-center lg:justify-center mr-20">
            <Image
              src="/logo.png"
              alt="AI Caller Logo"
              width={170}
              height={60}
              priority
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 mt-10 text-foreground">
            Welcome to <span className="text-primary">AI Caller</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Login to access your AI Caller Dashboard
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-background">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
