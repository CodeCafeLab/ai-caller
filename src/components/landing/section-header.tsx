import type { ReactNode } from 'react';

type SectionHeaderProps = {
  icon: ReactNode;
  title: string;
  description?: string;
};

export function SectionHeader({ icon, title, description }: SectionHeaderProps) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#FFC012] bg-[hsl(33,31%,10%)]">
        {icon}
      </div>
      <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">{title}</h2>
      {description && (
        <p className="mt-4 md:text-lg text-foreground/80">{description}</p>
      )}
    </div>
  );
}


