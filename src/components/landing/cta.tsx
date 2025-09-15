import { Button } from '@/components/ui/button';
import { BookDemoDialog } from './book-demo-dialog';

export function CTA() {
  return (
    <section id="cta" className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
            Ready to scale your voice outreach?
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Join thousands of businesses who are automating and enhancing their customer conversations.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Button size="lg">Sign In</Button>
            <BookDemoDialog>
              <Button size="lg" variant="secondary">Talk to Sales</Button>
            </BookDemoDialog>
          </div>
        </div>
      </div>
    </section>
  );
}
