import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSubmitContact } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CheckCircle2, Loader2, Send } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

type FormValues = z.infer<typeof formSchema>;

export function Contact() {
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const submitContact = useSubmitContact();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    submitContact.mutate({ data }, {
      onSuccess: () => {
        setIsSuccess(true);
        form.reset();
        setTimeout(() => setIsSuccess(false), 5000);
      },
      onError: (error) => {
        toast({
          title: "Something went wrong",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <section id="contact" className="py-24 bg-secondary/10">
      <div className="container px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Let's Talk</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              Have a project in mind, need help building an MVP, or just want to chat about AI? I'm currently open to new freelance opportunities.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mr-4">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                </div>
                <span>Available for freelance work</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border p-8 rounded-2xl shadow-sm relative overflow-hidden">
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-card z-10 flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Message Sent</h3>
                <p className="text-muted-foreground mb-6">Thanks for reaching out. I'll get back to you as soon as possible.</p>
                <Button variant="outline" onClick={() => setIsSuccess(false)}>Send another message</Button>
              </motion.div>
            ) : null}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-0">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" className="bg-background/50" {...field} />
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
                        <Input type="email" placeholder="john@example.com" className="bg-background/50" {...field} />
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
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell me about your project..." 
                          className="min-h-[120px] bg-background/50 resize-y" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={submitContact.isPending}
                >
                  {submitContact.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" /> Send Message
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </motion.div>
        
        {/* Placeholder for future sections */}
        {/* TODO: Add Client Reviews section here */}
        {/* TODO: Add Chat with AI Agent section here */}
      </div>
    </section>
  );
}