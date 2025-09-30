"use client";
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookDemoDialog } from './book-demo-dialog';
import Image from 'next/image';
import AnimatedHeroText from './AnimatedHeroText';
import { CalendarDays } from 'lucide-react';

export function Hero() {

  return (
    <section id="home" className="pt-10 md:pt-20 pb-12 md:pb-20">
      <div className="container text-center">
        <div className="mx-auto">
          <div className="flex justify-center mb-5">
            <Image src="/logo.png" alt="AI Caller Logo" width={160} height={52} className="object-contain" />
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl leading-[1.8] md:leading-[2] max-w-6xl mx-auto">
            <AnimatedHeroText texts={["Redefining Business Conversations with AI Voice Integration"]} typingSpeed={60} deletingSpeed={30} delayBetweenTexts={1200} />
          </h1>
          <p className="mt-14 text-lg text-muted-foreground md:text-xl max-w-4xl mx-auto leading-loose">
            AI Caller helps you automate calls, support, and sales with lifelike AI voice agents.
          </p>
        </div>
        <div className="mt-16 flex justify-center">
          <BookDemoDialog>
            <Button size="lg" className="bg-[#FFC012] text-black hover:bg-[#FFC012]/90 text-lg px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CalendarDays className="h-5 w-5 mr-2" />
              Book a Demo
            </Button>
          </BookDemoDialog>
        </div>
      </div>
    </section>
  );
}
