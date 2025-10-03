import { SectionHeader } from './section-header';
import { Newspaper } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const placeholder = PlaceHolderImages.slice(0, 3);
const posts = [
  { title: 'Launching AI Voice Campaigns: A Starter Guide', date: 'Sep 2025', excerpt: 'Learn the basics of setting up your first AI calling campaign and best practices for success.', image: placeholder[0] },
  { title: 'Measuring Success: Analytics that Matter', date: 'Sep 2025', excerpt: 'Track the KPIs that actually move the needle and how to act on them.', image: placeholder[1] },
  { title: 'Scaling Support with AI without Losing Quality', date: 'Sep 2025', excerpt: 'How to deploy AI at scale while preserving CX and compliance.', image: placeholder[2] },
];

export function Blog() {
  return (
    <section id="blog" className="pt-6 md:pt-20 pb-6 md:pb-20 py-16 md:py-24">
      <div className="container">
        <SectionHeader icon={<Newspaper className="h-5 w-5 text-[#FFC012]" />} title="Blog" description="Latest insights and updates from the team." />
        <div className="mt-8 cc-marquee">
          <div className="cc-marquee-track">
            <div className="cc-marquee-group gap-6 flex pr-6">
              {posts.map((p) => (
                <article key={`a-${p.title}`} className="w-80 shrink-0 group rounded-xl border border-[hsl(33,31%,18%)] bg-[hsl(33,31%,10%)] overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                  {p.image && (
                    <div className="relative h-40 w-full overflow-hidden">
                      <Image src={p.image.imageUrl} alt={p.image.description} fill className="object-cover" unoptimized />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="text-xs uppercase tracking-wide text-foreground/60">{p.date}</div>
                    <h3 className="mt-2 text-lg font-bold text-foreground">{p.title}</h3>
                    <p className="mt-2 text-sm text-foreground/80 leading-relaxed">{p.excerpt}</p>
                    <div className="mt-4 text-[#FFC012] text-sm">Read more →</div>
                  </div>
                </article>
              ))}
            </div>
            <div className="cc-marquee-group gap-6 flex pr-6" aria-hidden>
              {posts.map((p) => (
                <article key={`b-${p.title}`} className="w-80 shrink-0 group rounded-xl border border-[hsl(33,31%,18%)] bg-[hsl(33,31%,10%)] overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                  {p.image && (
                    <div className="relative h-40 w-full overflow-hidden">
                      <Image src={p.image.imageUrl} alt={p.image.description} fill className="object-cover" unoptimized />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="text-xs uppercase tracking-wide text-foreground/60">{p.date}</div>
                    <h3 className="mt-2 text-lg font-bold text-foreground">{p.title}</h3>
                    <p className="mt-2 text-sm text-foreground/80 leading-relaxed">{p.excerpt}</p>
                    <div className="mt-4 text-[#FFC012] text-sm">Read more →</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


