import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, Phone, Users, Globe, BarChart3, Text, Move } from 'lucide-react';
import type { ReactNode } from 'react';

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'Smart AI Voice Calling',
    description: 'Engage customers with GPT-4 powered, lifelike voice interactions for a superior experience.',
  },
  {
    icon: <Phone className="h-8 w-8 text-primary" />,
    title: 'SIP/VoIP Integration',
    description: 'Seamlessly connect with your existing telephony systems for efficient and scalable call management.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'CRM & WhatsApp Integration',
    description: 'Sync your customer data and communications across platforms for a unified workflow.',
  },
  {
    icon: <Globe className="h-8 w-8 text-primary" />,
    title: 'Multi-language Support',
    description: 'Broaden your audience reach by enabling the AI to interact fluently in multiple languages.',
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    title: 'Real-time Call Analytics',
    description: 'Gain actionable insights from live call data to optimize performance and track KPIs.',
  },
  {
    icon: <Text className="h-8 w-8 text-primary" />,
    title: 'Text-to-Speech + Speech-to-Text',
    description: 'Advanced transcription and voice synthesis for accurate communication and record-keeping.',
  },
  {
    icon: <Move className="h-8 w-8 text-primary" />,
    title: 'Drag & Drop Flow Builder',
    description: 'Create complex call workflows with ease using our intuitive, no-code visual editor.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-28 bg-secondary">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Key Features</h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Everything you need to automate and scale your voice communications.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <Card key={i} className="flex flex-col items-start p-6 bg-background">
              <CardHeader className="p-0">
                {feature.icon}
                <CardTitle className="mt-4 font-headline text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardDescription className="mt-2 text-base text-muted-foreground">
                {feature.description}
              </CardDescription>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
