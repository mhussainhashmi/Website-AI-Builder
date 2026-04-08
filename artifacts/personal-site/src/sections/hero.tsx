import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail } from 'lucide-react';

export function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 pb-12 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
      
      {/* Abstract blurred background shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>

      <div className="container px-6 max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center rounded-full border border-border bg-background/50 px-3 py-1 text-sm font-medium backdrop-blur-sm mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Available for freelance projects
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            Hi, I'm Hussain.<br />
            <span className="text-muted-foreground">I build software</span> <br />
            <span className="text-primary">with AI.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
            CS student turned AI-powered freelancer. I focus on shipping real tools and learning in public. 
            No corporate jargon, just honest work and continuous iteration.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="rounded-full h-12 px-8 font-medium">
              <a href="#projects">
                See my work
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full h-12 px-8 font-medium border-border/50 hover:bg-secondary">
              <a href="#contact">
                <Mail className="mr-2 h-4 w-4" />
                Get in touch
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}