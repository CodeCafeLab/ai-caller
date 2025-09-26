import { UploadCloud, FileText, PhoneCall, LineChart } from 'lucide-react';

const steps = [
  {
    icon: <UploadCloud className="h-8 w-8 text-primary" />,
    title: '1. Upload Data',
    description: 'Securely upload your contact lists and customer data to our platform.',
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: '2. Create Script',
    description: 'Design your conversation flow using our drag-and-drop builder or generate it with AI.',
  },
  {
    icon: <PhoneCall className="h-8 w-8 text-primary" />,
    title: '3. Launch Calls',
    description: 'Initiate thousands of calls instantly and let our AI agents handle the conversations.',
  },
  {
    icon: <LineChart className="h-8 w-8 text-primary" />,
    title: '4. Analyze Outcomes',
    description: 'Track performance with real-time analytics and gather insights for optimization.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">How It Works</h2>
          <p className="mt-4 md:text-lg text-foreground/80">
            Launch your AI-powered calling campaigns in just a few simple steps.
          </p>
        </div>
        <div className="relative mt-12 grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-4">
          <div className="absolute top-8 left-0 hidden w-full h-px bg-[hsl(33,31%,18%)] -translate-y-1/2 md:block" aria-hidden="true" />
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center p-4 text-center">
               <div className={`absolute -top-4 left-1/2 w-px h-4 bg-[hsl(33,31%,18%)] -translate-x-1/2 md:hidden ${index === 0 ? 'hidden' : ''}`} aria-hidden="true" />
              <div className="z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#FFC012] bg-[hsl(33,31%,10%)]">
                {step.icon}
              </div>
              <h3 className="mt-4 text-lg font-bold font-headline">{step.title}</h3>
              <p className="mt-1 text-sm text-foreground/80">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
