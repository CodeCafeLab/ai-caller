import { Badge } from '@/components/ui/badge';
import { Building, Landmark, GraduationCap, Headset, CalendarClock } from 'lucide-react';

const useCases = [
  { icon: <Building className="h-5 w-5 mr-2" />, name: 'Real Estate' },
  { icon: <Landmark className="h-5 w-5 mr-2" />, name: 'Banking' },
  { icon: <GraduationCap className="h-5 w-5 mr-2" />, name: 'EdTech' },
  { icon: <Headset className="h-5 w-5 mr-2" />, name: 'Customer Support' },
  { icon: <CalendarClock className="h-5 w-5 mr-2" />, name: 'Appointment Reminders' },
];

export function UseCases() {
  return (
    <section id="use-cases" className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Versatile Across Industries</h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            AI Caller is trusted by businesses in various sectors for a wide range of applications.
          </p>
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {useCases.map((useCase) => (
            <Badge key={useCase.name} variant="outline" className="flex items-center text-lg py-3 px-6 rounded-lg border-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-default">
              {useCase.icon}
              <span className="font-medium">{useCase.name}</span>
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
