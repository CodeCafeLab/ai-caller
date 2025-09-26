import { Button } from '@/components/ui/button';
import { BookDemoDialog } from './book-demo-dialog';

export function CTA() {
  return (
    <section id="cta" className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">
            Ready to scale your voice outreach?
          </h2>
          <p className="mt-4 md:text-lg text-foreground/80">
            Join thousands of businesses who are automating and enhancing their customer conversations.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Button size="lg" className="bg-[#FFC012] text-black hover:opacity-90">Sign In</Button>
            <BookDemoDialog>
              <Button size="lg" className="bg-[#6DD629] text-black hover:opacity-90" variant="default">Talk to Sales</Button>
            </BookDemoDialog>
          </div>
        </div>
      </div>
    </section>
  );
}
