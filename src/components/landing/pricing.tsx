import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/util';
import { Badge } from '@/components/ui/badge';
import { BookDemoDialog } from './book-demo-dialog';

const plans = [
  {
    name: 'Starter',
    price: '₹0',
    period: '/ trial',
    description: 'For individuals and small teams trying out AI Caller.',
    features: ['50 Call Credits', '1 Agent', 'Basic Analytics', 'Community Support'],
    cta: 'Sign In',
  },
  {
    name: 'Professional',
    price: '₹2,999',
    period: '/mo',
    description: 'For growing businesses that need more power and support.',
    features: ['5,000 Call Credits', '5 Agents', 'Advanced Analytics', 'CRM Integration', 'Priority Support'],
    cta: 'Sign In',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations with custom needs and scaling requirements.',
    features: ['Unlimited Credits', 'Unlimited Agents', 'Dedicated Infrastructure', 'Custom Integrations', '24/7 Support'],
    cta: 'Talk to Sales',
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="pt-6 md:pt-20 pb-6 md:pb-20 py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">Pricing Plans</h2>
          <p className="mt-4 md:text-lg text-foreground/80">
            Choose the plan that's right for your business.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className={cn('flex flex-col bg-[hsl(33,31%,10%)] border-[hsl(33,31%,18%)] text-foreground rounded-2xl shadow-[0_0_0_1px_hsl(33,31%,18%)]', plan.popular && 'ring-2 ring-[#FFC012]')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-headline text-2xl text-foreground">{plan.name}</CardTitle>
                  {plan.popular && <Badge className="bg-[#FFC012] text-black">MOST POPULAR</Badge>}
                </div>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  {plan.period && <span className="text-foreground/70">{plan.period}</span>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="mb-4 font-semibold">Features include:</p>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-[#6DD629] mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {plan.cta === 'Sign In' ? (
                  <Button asChild className="w-full bg-[#FFC012] text-black hover:opacity-90" variant={"default"}>
                    <a href="/signin">{plan.cta}</a>
                  </Button>
                ) : (
                  <BookDemoDialog>
                    <Button className="w-full bg-[#6DD629] text-black hover:opacity-90" variant={"default"}>
                      {plan.cta}
                    </Button>
                  </BookDemoDialog>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
