"use client";
import { useState } from 'react';
import { SectionHeader } from './section-header';
import { HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BookDemoDialog } from './book-demo-dialog';

const items = [
  { q: 'What is AI Caller?', a: 'AI Caller is a voice automation platform that places and answers calls using lifelike AI.' },
  { q: 'Can it integrate with my CRM?', a: 'Yes, we support popular CRMs and provide APIs for custom integrations.' },
  { q: 'How do I get started?', a: 'Book a demo, and we will help you onboard, connect telephony, and launch your first campaign.' },
  { q: 'Is multilingual supported?', a: 'Yes, multiple languages and accents are supported out of the box.' },
  { q: 'Is my data secure?', a: 'We use industry-standard encryption, strict access controls, and audit logging.' },
  { q: 'Can I scale to millions of calls?', a: 'Yes, our infrastructure auto-scales and supports high-throughput use cases.' },
];

export function FAQs() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faqs" className="py-20 md:py-28">
      <div className="container">
        <SectionHeader icon={<HelpCircle className="h-6 w-6 text-[#6DD629]" />} title="FAQs" description="Everything you need to know to get started with AI Caller." />

        <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: Questions (equal height with form) */}
          <div className="md:col-span-6">
            <div className="rounded-xl border border-[hsl(33,31%,18%)] bg-[hsl(33,31%,10%)] p-4 min-h-[360px] flex flex-col">
              <div className="space-y-2">
                {items.map((it, i) => (
                  <div key={it.q} className="rounded-lg border border-[hsl(33,31%,18%)]/80 bg-[hsl(33,31%,12%)] overflow-hidden">
                    <button onClick={() => setOpen(open === i ? null : i)} className="w-full text-left px-4 py-3 flex items-center justify-between gap-4">
                      <span className={`font-semibold ${open === i ? 'text-[#6DD629]' : 'text-foreground'}`}>{it.q}</span>
                      <span className={`transition-transform ${open === i ? 'rotate-45 text-[#6DD629]' : 'text-foreground/70'}`}>+</span>
                    </button>
                    <div className={`grid transition-all duration-300 ${open === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="px-4 pb-3 text-foreground/80 overflow-hidden text-sm">
                        {it.a}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Ask a Question form (equal height with questions) */}
          <div className="md:col-span-6">
            <div className="rounded-xl border border-[hsl(33,31%,18%)] bg-[hsl(33,31%,10%)] p-6 min-h-[360px] flex flex-col">
              <h3 className="text-2xl font-bold text-foreground">Ask a question</h3>
              <p className="mt-1 text-sm text-foreground/75">Our team typically responds within one business day.</p>
              <form className="mt-5 space-y-4 flex-1" onSubmit={(e) => { e.preventDefault(); /* handle submit */ }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Your name" className="bg-[hsl(33,31%,12%)] border-[hsl(33,31%,18%)]" required />
                  <Input type="email" placeholder="Email address" className="bg-[hsl(33,31%,12%)] border-[hsl(33,31%,18%)]" required />
                </div>
                <Textarea placeholder="Your question" className="min-h-[120px] bg-[hsl(33,31%,12%)] border-[hsl(33,31%,18%)]" required />
                <div>
                  <Button type="submit" className="bg-[#6DD629] text-black hover:opacity-90">Send question</Button>
                </div>
              </form>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Link href="/sales" className="inline-flex">
                  <Button variant="outline" className="border-[#FFC012]/40 text-[#FFC012] hover:bg-[#FFC012]/10">Talk to sales</Button>
                </Link>
                <BookDemoDialog>
                  <Button className="bg-[#FFC012] text-black hover:bg-[#FFC012]/90">Book a demo</Button>
                </BookDemoDialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


