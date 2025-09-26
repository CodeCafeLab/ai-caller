import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookDemoDialog } from './book-demo-dialog';
import Image from 'next/image';
import { useState } from 'react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[hsl(33,31%,18%)] bg-[hsl(33,31%,10%)]/95 backdrop-blur supports-[backdrop-filter]:bg-[hsl(33,31%,10%)]/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="Code Cafe Lab Logo"
              width={120}
              height={40}
              priority
              className="object-contain"
            />
            {/* <span className="font-bold font-headline">AI Caller</span> */}
          </Link>
        </div>
        <nav className="relative flex flex-1 items-center justify-center space-x-6 text-sm font-medium">
          <Link href="#features" className="relative hidden md:inline-block text-foreground/70 hover:text-[#6DD629] transition-colors">Features</Link>
          <Link href="#pricing" className="hidden text-foreground/70 transition-colors hover:text-[#FFC012] md:inline-block">Pricing</Link>
          <Link href="#use-cases" className="hidden text-foreground/70 transition-colors hover:text-[#FFC012] md:inline-block">Use Cases</Link>
        </nav>
        <div className="flex items-center justify-end space-x-4">
          <BookDemoDialog>
             <Button className="bg-[#FFC012] text-black hover:opacity-90" variant="default">Book a Demo</Button>
          </BookDemoDialog>
          <Button asChild className="bg-[#6DD629] text-black hover:opacity-90">
            <Link href="/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
