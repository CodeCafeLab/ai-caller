import type { ReactNode } from 'react';

type SectionHeaderProps = {
  icon: ReactNode;
  title: string;
  description?: string;
};

export function SectionHeader({ icon, title, description }: SectionHeaderProps) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#FFC012] bg-[hsl(33,31%,10%)]">
        {icon}
      </div>
      <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">{title}</h2>
      {description && (
        <p className="mt-3 md:text-base text-foreground/80">{description}</p>
      )}
    </div>
  );
}



