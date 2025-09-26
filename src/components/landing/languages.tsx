import languages from '@/data/languages';
import { SectionHeader } from './section-header';
import { Languages as LanguagesIcon } from 'lucide-react';

function flagUrl(cc?: string) {
  const code = (cc || '').toLowerCase();
  if (!code) return '';
  return `https://flagcdn.com/24x18/${code}.png`;
}

export function Languages() {
  const items = (languages as { code: string; name: string; countryCode?: string }[]).slice(0, 24);
  return (
    <section id="languages" className="py-20 md:py-28">
      <div className="container">
        <SectionHeader
          icon={<LanguagesIcon className="h-6 w-6 text-[#FFC012]" />}
          title="Languages"
          description="Out-of-the-box support for popular languages and locales."
        />
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {items.map((l) => (
            <div key={l.code} className="rounded-xl bg-[hsl(33,31%,10%)] border border-[hsl(33,31%,18%)] px-3 py-4 text-center text-sm text-foreground flex flex-col items-center justify-center gap-2">
              {l.countryCode && (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt={l.countryCode} className="h-[24px] w-[32px] rounded-sm" src={flagUrl(l.countryCode)} />
              )}
              <span className="font-medium" style={{ color: Math.random() > 0.5 ? '#6DD629' : '#FFC012' }}>{l.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


