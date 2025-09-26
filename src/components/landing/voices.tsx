import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const demoVoices = [
  { name: 'Ava', locale: 'en-US' },
  { name: 'Ravi', locale: 'hi-IN' },
  { name: 'Neha', locale: 'en-IN' },
  { name: 'Diego', locale: 'es-ES' },
  { name: 'Sofia', locale: 'pt-BR' },
  { name: 'Liu', locale: 'zh-CN' },
];

export function Voices() {
  return (
    <section id="voices" className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">Voices</h2>
          <p className="mt-4 md:text-lg text-foreground/80">Natural, production-ready voices for different markets.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoVoices.map((v) => (
            <Card key={v.name} className="bg-[hsl(33,31%,10%)] border-[hsl(33,31%,18%)] text-foreground">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{v.name}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-[#6DD629] text-black">{v.locale}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-24 rounded-md bg-[hsl(33,31%,12%)] border border-[hsl(33,31%,18%)] flex items-center justify-center text-sm text-foreground/70">
                  Audio preview coming soon
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}



