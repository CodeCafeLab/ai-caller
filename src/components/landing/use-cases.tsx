import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SectionHeader } from './section-header';
import { Briefcase } from 'lucide-react';
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
  const [active, setActive] = useState<string | null>(null);
  return (
    <section id="use-cases" className="py-20 md:py-28">
      <div className="container">
        <SectionHeader icon={<Briefcase className="h-6 w-6 text-[#6DD629]" />} title="Use Cases" description="Discover how teams use AI Caller to grow revenue and reduce costs." />
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {useCases.map((useCase) => (
            <button onClick={() => setActive(active === useCase.name ? null : useCase.name)} key={useCase.name} className="focus:outline-none">
              <Badge  variant="outline" className="flex items-center text-lg py-3 px-6 rounded-lg border-2 bg-[hsl(33,31%,12%)] text-foreground hover:bg-[hsl(33,31%,12%)]/80 cursor-pointer border-[hsl(33,31%,18%)]">
              {useCase.icon}
              <span className="font-medium">{useCase.name}</span>
              </Badge>
            </button>
          ))}
        </div>
        {active && (
          <div className="mt-8 flex justify-center">
            <Card className="max-w-3xl w-full bg-[hsl(33,31%,10%)] border-[hsl(33,31%,18%)]">
              <CardContent className="p-6">
                <h3 className="font-headline text-xl mb-4">How AI Caller helps in {active}</h3>
                <ul className="space-y-3">
                  {["Automated outreach and follow-ups","Real-time qualification and routing","Analytics for conversion and ROI","Seamless CRM integration"].map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className={`mt-1 inline-block h-2.5 w-2.5 rounded-full ${idx % 2 === 0 ? 'bg-[#6DD629]' : 'bg-[#FFC012]'}`}></span>
                      <span className={`${idx % 2 === 0 ? 'text-[#6DD629]' : 'text-[#FFC012]'} font-medium`}>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}
