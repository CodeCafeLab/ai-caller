import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookDemoDialog } from './book-demo-dialog';
import { Logo } from '../logo';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
            {/* <span className="font-bold font-headline">Avyukta AI Caller</span> */}
          </Link>
        </div>
        <nav className="flex flex-1 items-center justify-center space-x-6 text-sm font-medium">
          <Link href="#features" className="hidden text-foreground/60 transition-colors hover:text-foreground/80 md:inline-block">Features</Link>
          <Link href="#pricing" className="hidden text-foreground/60 transition-colors hover:text-foreground/80 md:inline-block">Pricing</Link>
          <Link href="#testimonials" className="hidden text-foreground/60 transition-colors hover:text-foreground/80 md:inline-block">Testimonials</Link>
        </nav>
        <div className="flex items-center justify-end space-x-4">
          <BookDemoDialog>
             <Button variant="outline">Book a Demo</Button>
          </BookDemoDialog>
          <Button asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
