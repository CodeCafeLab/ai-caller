"use client";
import { useEffect } from "react";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Languages } from "@/components/landing/languages";
import { Voices } from "@/components/landing/voices";
import { WhyAICaller } from "@/components/landing/why-ai-caller";
import { HowItWorks } from "@/components/landing/how-it-works";
import { UseCases } from "@/components/landing/use-cases";
import { Industries } from "@/components/landing/industries";
import { Pricing } from "@/components/landing/pricing";
import { Testimonials } from "@/components/landing/testimonials";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import { FAQs } from "@/components/landing/faqs";
import { Blog } from "@/components/landing/blog";

export default function Home() {
  useEffect(() => {}, []);
  return (
    <div className="relative w-full min-h-screen flex flex-col bg-background text-foreground">
      {/* Ambient brand glows (CodeCafe style) using #FFC012 and #6DD629 */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#FFC012] opacity-20 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-[28rem] w-[28rem] rounded-full bg-[#6DD629] opacity-[0.15] blur-3xl" />
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 h-[22rem] w-[44rem] rounded-full bg-gradient-to-r from-[#FFC012] to-[#6DD629] opacity-10 blur-3xl" />
      </div>

      <Header />
      <main className="relative z-10 flex-1 w-full max-w-8xl mx-auto px-8 sm:px-10 lg:px-12">
        <div className="w-full">
          {/* Section divider accent */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#FFC012]/30 to-transparent" />
          <Hero />

          <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-[#6DD629]/25 to-transparent" />
          <WhyAICaller />

          <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-[#FFC012]/25 to-transparent" />
          <Languages />

          <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-[#6DD629]/25 to-transparent" />
          <Voices />

          <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-[#FFC012]/25 to-transparent" />
          <Features />

          <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-[#FFC012]/25 to-transparent" />
          <HowItWorks />

          <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-[#6DD629]/25 to-transparent" />
          <UseCases />

          <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-[#FFC012]/25 to-transparent" />
          <Industries />

          <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-[#FFC012]/25 to-transparent" />
          <FAQs />

          <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-[#6DD629]/25 to-transparent" />
          <Blog />

          {/* <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-[#FFC012]/25 to-transparent" />
          <Pricing /> */}

          <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-[#6DD629]/25 to-transparent" />
          <Testimonials />

          <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-[#FFC012]/25 to-transparent" />
          <CTA />
        </div>
      </main>
      <Footer />
    </div>
  );
}
