'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/cn';
import { api } from '@/lib/apiConfig';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  company: z.string().optional(),
  message: z.string().optional(),
  date: z.date({ required_error: 'Please pick a date' }),
  slot: z.string({ required_error: 'Please select a time slot' }),
});

type BookDemoFormValues = z.infer<typeof formSchema>;

export function BookDemoDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [showSchedule, setShowSchedule] = React.useState(false);
  const { toast } = useToast();
  const form = useForm<BookDemoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      message: '',
      date: undefined as unknown as Date,
      slot: '',
    },
  });

  const timeSlots = React.useMemo(() => {
    const slots: { label: string; start: string; end: string }[] = [];
    let startMinutes = 15 * 60; // 3:00pm
    const endOfDay = 18 * 60;   // 6:00pm
    function labelFor(mins: number) {
      const h24 = Math.floor(mins / 60);
      const m = mins % 60;
      const ampm = h24 >= 12 ? 'pm' : 'am';
      const h12 = ((h24 + 11) % 12) + 1;
      return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
    }
    while (startMinutes < endOfDay) {
      const end = startMinutes + 30;
      const startStr = `${String(Math.floor(startMinutes/60)).padStart(2,'0')}:${String(startMinutes%60).padStart(2,'0')}`;
      const endStr = `${String(Math.floor(end/60)).padStart(2,'0')}:${String(end%60).padStart(2,'0')}`;
      slots.push({ label: `${labelFor(startMinutes)} - ${labelFor(end)}`, start: startStr, end: endStr });
      startMinutes = end;
    }
    return slots;
  }, []);

  async function onSubmit(values: BookDemoFormValues) {
    const [slotStart, slotEnd] = values.slot.split('|');
    const payload = {
      name: values.name,
      email: values.email,
      company: values.company,
      message: values.message,
      dateISO: values.date.toISOString().slice(0,10),
      slotStart,
      slotEnd,
    };
    const resp = await api.createDemo(payload);
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      toast({ title: 'Failed to book demo', description: err.message || 'Please try another slot.', variant: 'destructive' as any });
      return;
    }
    toast({
      title: 'Demo Scheduled!',
      description: 'We have received your request and will confirm shortly.',
    });
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className={cn(
          // Side overlay effect
          "fixed right-0 top-0 bottom-0 left-auto z-[100] m-0 rounded-none border-0 shadow-2xl", // <-- left-auto ensures it's flush right
          "w-full max-w-[100vw] sm:max-w-[500px] h-full p-0 bg-[#18120B] text-white flex flex-col", // max-w increased to 600px, full width on mobile
          "transition-transform duration-300",
        )}
        style={{
          // For smooth slide-in effect
          transform: open ? "translateX(0)" : "translateX(100%)",
          overflow: "hidden",
        }}
      >
        <div className="flex-1 flex flex-col overflow-y-auto px-6 py-8">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold text-[#FFC012]">Book a Demo</DialogTitle>
            <DialogDescription className="text-[#FFC012]/80">
              Fill out the form below and we'll get in touch to schedule a demo.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your Name"
                        {...field}
                        className="bg-[#231A10] border border-[#FFC012]/30 text-white placeholder:text-[#FFC012]/40"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="your.email@example.com"
                        {...field}
                        className="bg-[#231A10] border border-[#FFC012]/30 text-white placeholder:text-[#FFC012]/40"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your Company"
                        {...field}
                        className="bg-[#231A10] border border-[#FFC012]/30 text-white placeholder:text-[#FFC012]/40"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your needs"
                        {...field}
                        className="bg-[#231A10] border border-[#FFC012]/30 text-white placeholder:text-[#FFC012]/40 min-h-[80px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSchedule(v => !v)}
                  className="w-full border-[#FFC012]/40 text-[#FFC012] font-semibold hover:bg-[#6DD629] hover:text-[#18120B] transition rounded-lg"
                >
                  {showSchedule ? 'Hide Schedule' : 'Schedule Demo'}
                </Button>
              </div>
              {showSchedule && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-4 md:flex-row">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Date (Mon-Fri)</FormLabel>
                          <FormControl>
                            <div className="bg-[#231A10] rounded-md border border-[#FFC012]/20 p-2">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(d) => field.onChange(d)}
                                disabled={(d) => {
                                  const day = d.getDay();
                                  return day === 0 || day === 6;
                                }}
                                className="rounded-md"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="slot"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Time Slot (30 mins)</FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-1 gap-2">
                              {timeSlots.map((s) => (
                                <button
                                  key={s.start}
                                  type="button"
                                  onClick={() => field.onChange(`${s.start}|${s.end}`)}
                                  className={cn(
                                    'border rounded-lg flex items-center justify-center text-center font-small transition',
                                    field.value === `${s.start}|${s.end}`
                                      ? 'bg-[#FFC012] text-[#18120B] border-[#FFC012]'
                                      : 'bg-[#231A10] text-white border-[#FFC012]/20 hover:bg-[#FFC012]/10'
                                  )}
                                  style={{
                                    height: 48,
                                    minHeight: 48,
                                    fontSize: '0.75rem',
                                    lineHeight: 1.1,
                                    padding: 0,
                                    width: '100%',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}
                                >
                                  {s.label}
                                </button>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full bg-[#FFC012] text-[#18120B] font-semibold hover:bg-[#6DD629] hover:text-[#18120B] transition"
              >
                {form.formState.isSubmitting ? 'Sending...' : 'Request Demo'}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
