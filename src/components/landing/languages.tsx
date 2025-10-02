import languages from '@/data/languages';
import { SectionHeader } from './section-header';
import { Languages as LanguagesIcon } from 'lucide-react';

function flagUrl(cc?: string) {
  const code = (cc || '').toLowerCase();
  if (!code) return '';
  return `https://flagcdn.com/24x18/${code}.png`;
}

export function Languages() {
  const all = (languages as { code: string; name: string; countryCode?: string }[]);
  const total = all.length;
  const rowA = all.slice(0, Math.min(24, all.length));
  const rowB = all.slice(Math.min(12, all.length)).concat(all.slice(0, Math.min(12, all.length)));
  const dupA = [...rowA, ...rowA];
  const dupB = [...rowB, ...rowB];

  return (
    <section id="languages" className="pt-6 md:pt-12 pb-6 md:pb-12 py-16 md:py-24">
      <div className="container">
        <SectionHeader
          icon={<LanguagesIcon className="h-6 w-6 text-[#6DD629]" />}
          title="Languages"
          description={`AI Caller supports ${total}+ languages`}
        />

        <div className="mt-14 space-y-10">
          <div className="relative overflow-x-hidden overflow-y-visible py-4">
            {/* edge fade */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
            <div className="marquee-track flex gap-12" style={{ width: 'max-content', animationDuration: '55s' }}>
              {dupA.map((l, i) => (
                <div key={l.code + '-' + i} className="min-w-[70px] sm:min-w-[95px]">
                  <div
                    className="rounded-3xl bg-[hsl(33,31%,12%)] border border-[hsl(33,31%,16%)] px-3 py-4 text-center text-[11px] text-foreground flex flex-col items-center justify-center gap-2 shadow-md bubble-wave transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                    style={{ animationDelay: `${(i % 6) * 0.15}s` }}
                  >
                    {l.countryCode && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt={l.countryCode} className="h-[18px] w-[24px] rounded-md" src={flagUrl(l.countryCode)} />
                    )}
                    <span className="font-semibold" style={{ color: i % 2 === 0 ? '#6DD629' : '#FFC012' }}>{l.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-x-hidden overflow-y-visible py-4">
            {/* edge fade */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
            <div className="marquee-track marquee-reverse flex gap-12 pl-20" style={{ width: 'max-content', animationDuration: '75s' }}>
              {dupB.map((l, i) => (
                <div key={l.code + '-b-' + i} className="min-w-[70px] sm:min-w-[95px]">
                  <div
                    className="rounded-3xl bg-[hsl(33,31%,12%)] border border-[hsl(33,31%,16%)] px-3 py-4 text-center text-[11px] text-foreground flex flex-col items-center justify-center gap-2 shadow-md bubble-wave transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                    style={{ animationDelay: `${(i % 6) * 0.1}s` }}
                  >
                    {l.countryCode && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt={l.countryCode} className="h-[18px] w-[24px] rounded-md" src={flagUrl(l.countryCode)} />
                    )}
                    <span className="font-semibold" style={{ color: i % 2 === 0 ? '#6DD629' : '#FFC012' }}>{l.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


