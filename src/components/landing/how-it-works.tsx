"use client";
import { useEffect, useState } from 'react';
import { UploadCloud, FileText, PhoneCall, LineChart, Play } from 'lucide-react';

const steps = [
  {
    icon: <UploadCloud className="h-8 w-8 text-primary" />,
    title: 'Upload Data',
    description: 'Securely upload your contact lists and customer data to our platform.',
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: 'Create Script',
    description: 'Design your conversation flow using our drag-and-drop builder or generate it with AI.',
  },
  {
    icon: <PhoneCall className="h-8 w-8 text-primary" />,
    title: 'Launch Calls',
    description: 'Initiate thousands of calls instantly and let our AI agents handle the conversations.',
  },
  {
    icon: <LineChart className="h-8 w-8 text-primary" />,
    title: 'Analyze Outcomes',
    description: 'Track performance with real-time analytics and gather insights for optimization.',
  },
];

export function HowItWorks() {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setVisible((prev) => Math.min(steps.length, prev + 1));
      if (i >= steps.length) clearInterval(timer);
    }, 700);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="how-it-works" className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto text-center">
          <div className="flex justify-center mb-3">
            <Play className="h-10 w-10 text-[#6DD629]" />
          </div>
          <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-foreground">How It Works</h2>
          <p className="mt-4 md:text-lg text-foreground/80">Launch your AI-powered calling campaigns in a few simple steps.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Steps column (40%) */}
          <div className="md:col-span-5 flex">
            <div className="relative flex-1 min-h-[220px] md:min-h-[280px] lg:min-h-[320px]">
              {/* Center vertical line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-[hsl(33,31%,18%)]" aria-hidden />
              <ul className="relative flex flex-col justify-between h-full">
                {steps.map((s, idx) => (
                  <li key={s.title} className={`relative flex flex-col items-center text-center px-4 transition-all duration-500 ${visible >= idx + 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                    {/* Dot over the line */}
                    <div className="absolute -translate-x-1/2 left-1/2 -top-1.5 h-3 w-3 rounded-full bg-[#FFC012] shadow" />
                    {/* Icon circle overlapping the line */}
                    <div className="z-10 flex h-11 w-11 md:h-9 md:w-9 items-center justify-center rounded-full border-2 border-[#FFC012] bg-[hsl(33,31%,10%)]">
                      {s.icon}
                    </div>
                    <h3 className="mt-3 text-lg md:text-xl font-bold font-headline">{s.title}</h3>
                    <p className="mt-1 text-xs md:text-sm text-foreground/80 leading-relaxed max-w-md">{s.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Video column (60%) */}
          <div className="md:col-span-7 flex">
            <div className="flex-1 aspect-video min-h-[260px] md:min-h-[320px] lg:min-h-[360px] rounded-xl border border-[hsl(33,31%,18%)] bg-[hsl(33,31%,10%)] flex items-center justify-center text-foreground/60">
              Video placeholder
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
