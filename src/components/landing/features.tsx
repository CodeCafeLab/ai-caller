"use client";
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Bot, Phone, Users, Globe, BarChart3, Text, Move, Sparkles, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { SectionHeader } from './section-header';
import type { ReactNode } from 'react';

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Bot className="h-4 w-4 text-primary" />,
    title: 'Smart AI Voice Calling',
    description: 'Engage customers with GPT-4 powered, lifelike voice interactions for a superior experience.',
  },
  {
    icon: <Phone className="h-4 w-4 text-primary" />,
    title: 'SIP/VoIP Integration',
    description: 'Seamlessly connect with your existing telephony systems for efficient and scalable call management.',
  },
  {
    icon: <Users className="h-4 w-4 text-primary" />,
    title: 'CRM & WhatsApp Integration',
    description: 'Sync your customer data and communications across platforms for a unified workflow.',
  },
  {
    icon: <Globe className="h-4 w-4 text-primary" />,
    title: 'Multi-language Support',
    description: 'Broaden your audience reach by enabling the AI to interact fluently in multiple languages.',
  },
  {
    icon: <BarChart3 className="h-4 w-4 text-primary" />,
    title: 'Real-time Call Analytics',
    description: 'Gain actionable insights from live call data to optimize performance and track KPIs.',
  },
  {
    icon: <Text className="h-4 w-4 text-primary" />,
    title: 'Text-to-Speech + Speech-to-Text',
    description: 'Advanced transcription and voice synthesis for accurate communication and record-keeping.',
  },
  {
    icon: <Move className="h-4 w-4 text-primary" />,
    title: 'Drag & Drop Flow Builder',
    description: 'Create complex call workflows with ease using our intuitive, no-code visual editor.',
  },
];

export function Features() {
  const [active, setActive] = useState(0);
  const points: Record<string, { heading: string; sub: string }[]> = {
    'Smart AI Voice Calling': [
      { heading: 'Natural conversations', sub: 'Human‑like interactions tuned for results.' },
      { heading: 'Context awareness', sub: 'Understands customer intent and history.' },
      { heading: 'Seamless handoff', sub: 'Escalates to human agents when needed.' },
    ],
    'SIP/VoIP Integration': [
      { heading: 'Plug into your PBX', sub: 'Works with existing SIP trunks and carriers.' },
      { heading: 'Scalable routing', sub: 'Auto scale during peak volumes.' },
      { heading: 'Low latency', sub: 'Optimized media path for clear audio.' },
    ],
    'CRM & WhatsApp Integration': [
      { heading: 'Unified data', sub: 'Sync contacts, tickets, and outcomes.' },
      { heading: 'Automations', sub: 'Trigger workflows after each call.' },
      { heading: 'Omnichannel', sub: 'Continue conversations on WhatsApp.' },
    ],
    'Multi-language Support': [
      { heading: 'Global coverage', sub: 'Serve users in their preferred language.' },
      { heading: 'Accents ready', sub: 'Robust understanding across accents.' },
      { heading: 'Localized prompts', sub: 'Culturally relevant responses.' },
    ],
    'Real-time Call Analytics': [
      { heading: 'Live KPIs', sub: 'Conversion, AHT, CSAT and more.' },
      { heading: 'Drilldowns', sub: 'Per campaign, per agent insights.' },
      { heading: 'Export & BI', sub: 'Send data to your warehouse.' },
    ],
    'Text-to-Speech + Speech-to-Text': [
      { heading: 'Crystal TTS', sub: 'Clear, expressive voices.' },
      { heading: 'Accurate STT', sub: 'High WER accuracy for noisy audio.' },
      { heading: 'Custom lexicons', sub: 'Brand names and jargon pronounced right.' },
    ],
    'Drag & Drop Flow Builder': [
      { heading: 'Visual logic', sub: 'Build IVR flows without code.' },
      { heading: 'Reusable nodes', sub: 'Templates for common actions.' },
      { heading: 'Versioning', sub: 'Iterate safely with rollbacks.' },
    ],
  };
  return (
    <section id="features" className="py-16 md:py-20">
      <div className="container">
        <SectionHeader
          icon={<Sparkles className="h-4 w-4 text-[#FFC012]" />}
          title="Key Features"
          description="Everything you need to automate and scale your voice communications."
        />
        {/* Horizontal menu with arrows, no scrollbar */}
        <div className="mt-10 relative">
          <button
            aria-label="Scroll left"
            onClick={(e) => {
              const scroller = (e.currentTarget.parentElement?.querySelector('.features-menu') as HTMLElement) || null;
              if (scroller) scroller.scrollBy({ left: -240, behavior: 'smooth' });
            }}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-[#0F0B06]/80 border border-[#FFC012]/30 text-[#FFC012] hover:bg-[#FFC012]/10 backdrop-blur hidden sm:inline-flex items-center justify-center"
          >
            ‹
          </button>
          <div className="features-menu overflow-x-auto no-scrollbar">
            <div className="inline-flex gap-2 rounded-xl bg-[hsl(33,31%,10%)] border border-[hsl(33,31%,18%)] p-1">
              {features.map((f, i) => (
                <button
                  key={f.title}
                  onClick={() => setActive(i)}
                  className={`px-3 py-1 rounded-full flex items-center gap-2 whitespace-nowrap text-sm transition ${
                    active === i ? 'text-[#6DD629]' : 'text-foreground hover:text-[#FFC012]'
                  }`}
                >
                  <span className="shrink-0">{f.icon}</span>
                  <span className="font-medium">{f.title}</span>
                </button>
              ))}
            </div>
          </div>
          <button
            aria-label="Scroll right"
            onClick={(e) => {
              const scroller = (e.currentTarget.parentElement?.querySelector('.features-menu') as HTMLElement) || null;
              if (scroller) scroller.scrollBy({ left: 240, behavior: 'smooth' });
            }}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-[#0F0B06]/80 border border-[#6DD629]/30 text-[#6DD629] hover:bg-[#6DD629]/10 backdrop-blur hidden sm:inline-flex items-center justify-center"
          >
            ›
          </button>
        </div>
        {/* Content: image left, bullets right with equal height */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <Card className="rounded-xl bg-[hsl(33,31%,10%)] border border-[hsl(33,31%,18%)] p-6 min-h-[320px] flex items-center justify-center text-foreground/70">
            <div className="flex flex-col items-center text-center">
              <ImageIcon className="h-10 w-10 text-[#FFC012] mb-2" />
              <div>Screenshot placeholder</div>
            </div>
          </Card>
          <Card className="rounded-xl bg-[hsl(33,31%,10%)] border border-[hsl(33,31%,18%)] p-6 min-h-[320px] flex flex-col">
            <div className="text-sm uppercase tracking-wide text-foreground/60">Feature details</div>
            <h3 className="mt-2 text-2xl font-bold text-foreground">{features[active].title}</h3>
            <p className="mt-3 text-base leading-relaxed text-foreground/80">{features[active].description}</p>
            <ul className="mt-4 space-y-3">
              {(points[features[active].title] || []).map((pt) => (
                <li key={pt.heading} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#6DD629] mt-0.5" />
                  <div>
                    <div className="font-semibold text-foreground">{pt.heading}</div>
                    <div className="text-sm text-foreground/75">{pt.sub}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}
