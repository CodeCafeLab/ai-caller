import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';

const testimonialData = [
  {
    quote: "AI Caller transformed our outreach. We're reaching more leads and our conversion rates have skyrocketed. The AI is surprisingly human-like!",
    name: 'Aisha Khan',
    title: 'Head of Sales, PropConnect',
    avatarId: 'testimonial-avatar-1',
  },
  {
    quote: "The multi-language support is a game-changer for our global customer base. Setup was a breeze and the analytics are incredibly insightful.",
    name: 'Raj Patel',
    title: 'CTO, Fintech Innovations',
    avatarId: 'testimonial-avatar-2',
  },
  {
    quote: "We've automated 80% of our appointment reminders, freeing up our staff to focus on critical tasks. Our no-show rate has dropped by 30%.",
    name: 'Priya Sharma',
    title: 'Operations Manager, EduWorld',
    avatarId: 'testimonial-avatar-3',
  },
];

const avatarMap = new Map<string, ImagePlaceholder>(PlaceHolderImages.map(img => [img.id, img]));

export function Testimonials() {
  return (
    <section id="testimonials" className="py-16 md:py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">What Our Customers Say</h2>
          <p className="mt-4 md:text-lg text-foreground/80">
            Real stories from businesses revolutionizing their communication with AI Caller.
          </p>
        </div>
        <div className="mt-10 cc-marquee">
          <div className="cc-marquee-track">
            <div className="flex gap-6 pr-6">
              {testimonialData.map((testimonial) => {
                const avatar = avatarMap.get(testimonial.avatarId);
                return (
                  <Card key={`a-${testimonial.name}`} className="w-96 shrink-0 bg-[hsl(33,31%,10%)] border-[hsl(33,31%,18%)] text-foreground rounded-2xl transition-transform duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <blockquote className="italic text-base">"{testimonial.quote}"</blockquote>
                      <div className="mt-5 flex items-center">
                        <Avatar className="h-12 w-12">
                          {avatar && (
                            <AvatarImage 
                              src={avatar.imageUrl} 
                              alt={testimonial.name} 
                              data-ai-hint={avatar.imageHint}
                            />
                          )}
                          <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <p className="font-semibold text-foreground">{testimonial.name}</p>
                          <p className="text-sm text-foreground/70">{testimonial.title}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="flex gap-6 pr-6" aria-hidden>
              {testimonialData.map((testimonial) => {
                const avatar = avatarMap.get(testimonial.avatarId);
                return (
                  <Card key={`b-${testimonial.name}`} className="w-96 shrink-0 bg-[hsl(33,31%,10%)] border-[hsl(33,31%,18%)] text-foreground rounded-2xl transition-transform duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <blockquote className="italic text-base">"{testimonial.quote}"</blockquote>
                      <div className="mt-5 flex items-center">
                        <Avatar className="h-12 w-12">
                          {avatar && (
                            <AvatarImage 
                              src={avatar.imageUrl} 
                              alt={testimonial.name} 
                              data-ai-hint={avatar.imageHint}
                            />
                          )}
                          <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <p className="font-semibold text-foreground">{testimonial.name}</p>
                          <p className="text-sm text-foreground/70">{testimonial.title}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
