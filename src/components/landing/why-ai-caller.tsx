"use client";
import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { PhoneCall, PiggyBank, Zap, Smile, TrendingUp, Bot } from 'lucide-react';

type WhyItem = {
  icon: React.ReactNode;
  title: string;
  points: string[];
};

const groups: WhyItem[] = [
  {
    icon: <PhoneCall className="h-6 w-6 text-[#FFC012]" />,
    title: 'Customer Support',
    points: [
      'Answer every call instantly → No missed customer queries.',
      'Provide 24/7 support → Customers get help anytime, even at night.',
      'Reduce waiting time → Faster responses keep customers happy.',
    ],
  },
  {
    icon: <PiggyBank className="h-6 w-6 text-[#FFC012]" />,
    title: 'Cost Savings',
    points: [
      'Lower staff costs → AI handles repetitive calls, fewer agents needed.',
      'Save training time → No need to train new staff again and again.',
      'Pay only for what you use → Flexible and scalable.',
    ],
  },
  {
    icon: <Zap className="h-6 w-6 text-[#6DD629]" />,
    title: 'Productivity',
    points: [
      'Free up human agents → They focus only on complex or high-value calls.',
      'Handle high call volumes easily → No stress during peak hours.',
      'Faster resolution → AI quickly gives information or routes to the right person.',
    ],
  },
  {
    icon: <Smile className="h-6 w-6 text-[#6DD629]" />,
    title: 'Customer Experience',
    points: [
      'Personalized conversations → AI greets by name and remembers past queries.',
      'Multiple languages support → Talk to customers in their preferred language.',
      'Consistent answers → No mistakes or different answers from different agents.',
    ],
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-[#FFC012]" />,
    title: 'Business Growth',
    points: [
      'Increase sales conversions → AI follows up leads instantly.',
      'Track performance → Detailed call reports and analytics.',
      'Scalable → As business grows, AI grows with it.',
    ],
  },
];

export function WhyAICaller() {
  // Duplicate items to enable seamless marquee
  const marqueeItems = useMemo(() => [...groups, ...groups], []);

  return (
    <section className="pt-6 md:pt-20 pb-6 md:pb-20 py-16 md:py-24">
      <div className="container">
        <div className="mx-auto text-center">
          <div className="flex justify-center mb-3">
            <Bot className="h-10 w-10 text-[#6DD629]" />
          </div>
          <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Why Your Business Needs an AI Caller
          </h2>
          <p className="mt-6 text-foreground/80">Clear benefits across support, costs, productivity, experience, and growth.</p>
        </div>

        <div className="relative mt-16">
          <div className="overflow-hidden">
            <div className="marquee-track flex gap-5 pl-1" style={{ width: 'max-content' }}>
              {marqueeItems.map((g, i) => (
                <Card key={`${g.title}-${i}`} className="min-w-[340px] sm:min-w-[380px] bg-[hsl(33,31%,10%)] border-[hsl(33,31%,18%)] text-foreground px-6 py-7 rounded-2xl shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    {g.icon}
                    <h3 className="text-xl font-semibold">{g.title}</h3>
                  </div>
                  <ul className="space-y-2 text-foreground/85 text-sm leading-relaxed">
                    {g.points.map((p) => (
                      <li key={p + i} className="before:content-['•'] before:text-[#6DD629] before:mr-2">{p}</li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
          {/* Manual controls overlayed; they nudge the marquee position and then animation continues */}
          <button
            aria-label="Scroll left"
            onClick={(e) => {
              const track = e.currentTarget.closest('section')?.querySelector<HTMLElement>('.marquee-track');
              if (!track) return;
              const prev = parseFloat(getComputedStyle(track).getPropertyValue('--marq-offset')) || 0;
              track.style.setProperty('--marq-offset', `${prev + 5}%`);
              const old = track.style.animationPlayState;
              track.style.animationPlayState = 'paused';
              window.setTimeout(() => {
                track.style.animationPlayState = old || 'running';
              }, 1200);
            }}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-[#0F0B06]/80 border border-[#FFC012]/30 text-[#FFC012] hover:bg-[#FFC012]/10 backdrop-blur hidden sm:inline-flex items-center justify-center"
          >
            ‹
          </button>
          <button
            aria-label="Scroll right"
            onClick={(e) => {
              const track = e.currentTarget.closest('section')?.querySelector<HTMLElement>('.marquee-track');
              if (!track) return;
              const prev = parseFloat(getComputedStyle(track).getPropertyValue('--marq-offset')) || 0;
              track.style.setProperty('--marq-offset', `${prev - 5}%`);
              const old = track.style.animationPlayState;
              track.style.animationPlayState = 'paused';
              window.setTimeout(() => {
                track.style.animationPlayState = old || 'running';
              }, 1200);
            }}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-[#0F0B06]/80 border border-[#6DD629]/30 text-[#6DD629] hover:bg-[#6DD629]/10 backdrop-blur hidden sm:inline-flex items-center justify-center"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}

// (styles are in globals.css for marquee)


