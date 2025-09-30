import { SectionHeader } from './section-header';
import { Newspaper } from 'lucide-react';

const posts = [
  { title: 'Launching AI Voice Campaigns: A Starter Guide', date: 'Sep 2025', excerpt: 'Learn the basics of setting up your first AI calling campaign and best practices for success.' },
  { title: 'Measuring Success: Analytics that Matter', date: 'Sep 2025', excerpt: 'Track the KPIs that actually move the needle and how to act on them.' },
  { title: 'Scaling Support with AI without Losing Quality', date: 'Sep 2025', excerpt: 'How to deploy AI at scale while preserving CX and compliance.' },
];

export function Blog() {
  return (
    <section id="blog" className="py-20 md:py-28">
      <div className="container">
        <SectionHeader icon={<Newspaper className="h-6 w-6 text-[#FFC012]" />} title="Blog" description="Latest insights and updates from the team." />
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((p) => (
            <article key={p.title} className="rounded-xl border border-[hsl(33,31%,18%)] bg-[hsl(33,31%,10%)] p-6">
              <div className="text-xs uppercase tracking-wide text-foreground/60">{p.date}</div>
              <h3 className="mt-2 text-xl font-bold text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm text-foreground/80 leading-relaxed">{p.excerpt}</p>
              <div className="mt-4 text-[#FFC012] text-sm">Read more →</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


