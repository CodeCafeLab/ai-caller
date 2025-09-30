"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookDemoDialog } from './book-demo-dialog';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export function Header() {
  const [active, setActive] = useState<string>('home');

  useEffect(() => {
    const ids = ['home', 'features', 'languages', 'voices', 'use-cases'];
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(id);
          });
        },
        { rootMargin: '0px 0px -40% 0px', threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    // Fallback on scroll (ensures languages/voices update in browsers with finicky IO)
    const onScroll = () => {
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        if (mid > 0 && mid < window.innerHeight) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      observers.forEach((o) => o.disconnect());
      window.removeEventListener('scroll', onScroll as any);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-[hsl(33,31%,10%)]/95 backdrop-blur supports-[backdrop-filter]:bg-[hsl(33,31%,10%)]/60">
      <div className="container grid grid-cols-3 items-center h-16 md:h-20">
        <div className="flex items-center justify-start">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="Code Cafe Lab Logo"
              width={140}
              height={48}
              priority
              className="object-contain"
            />
            {/* <span className="font-bold font-headline">AI Caller</span> */}
          </Link>
        </div>
        <div className="flex items-center justify-center">
          <nav className="hidden md:flex items-center gap-4 rounded-xl bg-[#0F0B06]/60 border border-[#FFC012]/20 px-2 py-0.5 shadow-sm backdrop-blur whitespace-nowrap text-sm">
            <Link href="#home" className={`${active==='home' ? 'text-[#FFC012]' : 'text-white/90 hover:text-[#FFC012]'} px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap`}>Home</Link>
            <Link href="#features" className={`${active==='features' ? 'text-[#FFC012]' : 'text-white/90 hover:text-[#FFC012]'} px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap`}>Features</Link>
            <Link href="#languages" className={`${active==='languages' ? 'text-[#FFC012]' : 'text-white/90 hover:text-[#FFC012]'} px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap`}>Languages</Link>
            <Link href="#voices" className={`${active==='voices' ? 'text-[#FFC012]' : 'text-white/90 hover:text-[#FFC012]'} px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap`}>Voices</Link>
            <Link href="#use-cases" className={`${active==='use-cases' ? 'text-[#FFC012]' : 'text-white/90 hover:text-[#FFC012]'} px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap`}>Use Cases</Link>
          </nav>
        </div>
        <div className="flex items-center justify-end gap-2">
          <BookDemoDialog>
            <Button className="rounded-full bg-[#FFC012] text-black hover:bg-[#FFC012]/90">
              Book a Demo
            </Button>
          </BookDemoDialog>
          <Button asChild className="rounded-full bg-[#6DD629] text-black hover:opacity-80">
            <Link href="/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
