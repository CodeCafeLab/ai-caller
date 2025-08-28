import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import { Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Authenticate - Avyukta AI Caller",
  description: "Sign in or sign up to Avyukta AI Caller",
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
          <h1 className="text-4xl font-bold mb-4">
            Welcome to Avyukta AI Caller
          </h1>
          <p className="text-lg">Login to Avyukta AI Caller Dashboard</p>
          <div className="mt-16 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Support</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 text-gray-700">
                <Phone className="h-6 w-6 text-blue-600" />
                <a
                  href="tel:+918560000600"
                  className="text-lg hover:text-blue-600 transition-colors"
                >
                  +91 85600 00600
                </a>
              </div>
              <div className="flex items-center space-x-4 text-gray-700">
                <Mail className="h-6 w-6 text-blue-600" />
                <a
                  href="mailto:sales@dialerindia.com"
                  className="text-lg hover:text-blue-600 transition-colors"
                >
                  sales@dialerindia.com
                </a>
              </div>
            </div>
          </div>
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
