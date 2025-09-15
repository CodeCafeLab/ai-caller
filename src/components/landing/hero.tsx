import { Button } from '@/components/ui/button';
import { BookDemoDialog } from './book-demo-dialog';

export function Hero() {
  return (
    <section className="py-24 md:py-40">
      <div className="container text-center">
        <div className="mx-auto">
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Redefining Business Conversations with AI Voice Integration
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-4xl mx-auto">
            AI Caller helps you automate calls, support, and sales with lifelike AI voice agents.
          </p>
        </div>
        <div className="mt-8 flex justify-center space-x-4">
          <BookDemoDialog>
            <Button size="lg" variant="outline">Book a Demo</Button>
          </BookDemoDialog>
          <Button asChild size="lg">
            <a href="/signin">Sign In</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
