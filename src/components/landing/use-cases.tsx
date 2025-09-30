import { Card } from '@/components/ui/card';
import { SectionHeader } from './section-header';
import { Briefcase, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { Building, Landmark, GraduationCap, Headset, CalendarClock } from 'lucide-react';

const useCases = [
  { icon: <Building className="h-5 w-5 mr-2" />, name: 'Real Estate' },
  { icon: <Landmark className="h-5 w-5 mr-2" />, name: 'Banking' },
  { icon: <GraduationCap className="h-5 w-5 mr-2" />, name: 'EdTech' },
  { icon: <Headset className="h-5 w-5 mr-2" />, name: 'Customer Support' },
  { icon: <CalendarClock className="h-5 w-5 mr-2" />, name: 'Appointment Reminders' },
];

export function UseCases() {
  const [active, setActive] = useState<string>(useCases[0].name);
  return (
    <section id="use-cases" className="py-20 md:py-28">
      <div className="container">
        <SectionHeader icon={<Briefcase className="h-6 w-6 text-[#6DD629]" />} title="Use Cases" description="Discover how teams use AI Caller to grow revenue and reduce costs." />
        {/* Horizontal menu like Features, active = green text */}
        <div className="mt-10 relative">
          <div className="inline-flex gap-2 rounded-xl bg-[hsl(33,31%,10%)] border border-[hsl(33,31%,18%)] p-2 w-full justify-center flex-wrap">
            {useCases.map((uc) => (
              <button
                key={uc.name}
                onClick={() => setActive(uc.name)}
                className={`px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap transition ${active === uc.name ? 'text-[#6DD629]' : 'text-foreground hover:text-[#FFC012]'}`}
              >
                {uc.icon}
                <span className="font-medium">{uc.name}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Content below: left points, right image placeholder (reverse of Features) */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <Card className="rounded-xl bg-[hsl(33,31%,10%)] border border-[hsl(33,31%,18%)] p-6 min-h-[320px] flex flex-col">
            <div className="text-sm uppercase tracking-wide text-foreground/60">Use case details</div>
            <h3 className="mt-2 text-2xl font-bold text-foreground">{active}</h3>
            <p className="mt-3 text-base leading-relaxed text-foreground/80">Practical ways AI Caller accelerates results for {active}.</p>
            <ul className="mt-4 space-y-3">
              {["Automated outreach and follow-ups","Real-time qualification and routing","Analytics for conversion and ROI","Seamless CRM integration"].map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#6DD629] mt-0.5" />
                  <div>
                    <div className="font-semibold text-foreground">{point}</div>
                    <div className="text-sm text-foreground/75">Detailed explanation for {point.toLowerCase()}.</div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="rounded-xl bg-[hsl(33,31%,10%)] border border-[hsl(33,31%,18%)] p-6 min-h-[320px] flex items-center justify-center text-foreground/70">
            <div className="flex flex-col items-center text-center">
              <ImageIcon className="h-10 w-10 text-[#FFC012] mb-2" />
              <div>Screenshot placeholder</div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
