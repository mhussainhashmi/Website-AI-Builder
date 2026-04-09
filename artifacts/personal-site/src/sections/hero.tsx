import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';

function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 80, damping: 20 });
  const springY = useSpring(y, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      x.set(clientX);
      y.set(clientY);
    };
    const onMouse = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) handleMove(t.clientX, t.clientY);
    };
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('touchmove', onTouch, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('touchmove', onTouch);
    };
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-0 rounded-full"
      style={{
        x: useTransform(springX, v => v - 400),
        y: useTransform(springY, v => v - 400),
        width: 800,
        height: 800,
        background: 'radial-gradient(circle, hsl(24 95% 53% / 0.22) 0%, hsl(24 95% 53% / 0.08) 40%, transparent 70%)',
      }}
    />
  );
}

function FloatingParticles() {
  const particles = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    delay: Math.random() * 5,
    duration: Math.random() * 6 + 6,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/30"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function ParallaxBlobs({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  return (
    <>
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[100px] mix-blend-screen pointer-events-none"
        style={{ background: 'hsl(24 95% 53% / 0.35)' }}
        animate={{
          x: mouseX * -18,
          y: mouseY * -18,
        }}
        transition={{ type: 'spring', stiffness: 40, damping: 25 }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[100px] mix-blend-screen pointer-events-none"
        style={{ background: 'hsl(220 80% 60% / 0.10)' }}
        animate={{
          x: mouseX * 22,
          y: mouseY * 22,
        }}
        transition={{ type: 'spring', stiffness: 35, damping: 22 }}
      />
      <motion.div
        className="absolute top-3/4 left-1/2 w-64 h-64 rounded-full blur-[80px] mix-blend-screen pointer-events-none"
        style={{ background: 'hsl(280 70% 50% / 0.06)' }}
        animate={{
          x: mouseX * 12,
          y: mouseY * -14,
        }}
        transition={{ type: 'spring', stiffness: 30, damping: 20 }}
      />
    </>
  );
}

function MagneticButton({ children, href, variant = 'default' }: { children: React.ReactNode; href: string; variant?: 'default' | 'outline' }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.3);
    y.set((e.clientY - cy) * 0.3);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <Button
        asChild
        size="lg"
        variant={variant}
        className={
          variant === 'outline'
            ? "rounded-full h-12 px-8 font-medium border-border/50 hover:bg-secondary transition-all duration-200"
            : "rounded-full h-12 px-8 font-medium transition-all duration-200 hover:scale-105 active:scale-95"
        }
      >
        <a href={href}>{children}</a>
      </Button>
    </motion.div>
  );
}

const TYPED_WORDS = ['software.', 'websites.', 'tools.', 'ideas.'];

function TypedText() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = TYPED_WORDS[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 90);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 50);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setWordIndex(i => (i + 1) % TYPED_WORDS.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIndex]);

  return (
    <span className="text-primary">
      {displayed}
      <span className="inline-block w-[3px] h-[0.85em] bg-primary ml-1 align-middle animate-pulse rounded-sm" />
    </span>
  );
}

export function Hero() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5),
        y: (e.clientY / window.innerHeight - 0.5),
      });
    };
    const handleTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      setMouse({
        x: (t.clientX / window.innerWidth - 0.5),
        y: (t.clientY / window.innerHeight - 0.5),
      });
    };
    window.addEventListener('mousemove', handle);
    window.addEventListener('touchmove', handleTouch, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handle);
      window.removeEventListener('touchmove', handleTouch);
    };
  }, []);

  const stagger = {
    container: { animate: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } },
    item: {
      initial: { opacity: 0, y: 28 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    },
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center pt-20 pb-12 relative overflow-hidden"
    >
      <CursorGlow />
      <FloatingParticles />
      <ParallaxBlobs mouseX={mouse.x} mouseY={mouse.y} />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container px-6 max-w-5xl relative z-10">
        <motion.div
          variants={stagger.container}
          initial="initial"
          animate="animate"
          className="max-w-3xl"
        >
          <motion.div variants={stagger.item}>
            <div className="inline-flex items-center rounded-full border border-border bg-background/50 px-3 py-1 text-sm font-medium backdrop-blur-sm mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
              Available for freelance projects
            </div>
          </motion.div>

          <motion.h1
            variants={stagger.item}
            className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-tight"
          >
            Hi, I'm Hussain.<br />
            <span className="text-muted-foreground">I build </span>
            <TypedText />
          </motion.h1>

          <motion.p
            variants={stagger.item}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
          >
            CS student turned AI-powered freelancer. I focus on shipping real tools and learning in public.
            No corporate jargon, just honest work and continuous iteration.
          </motion.p>

          <motion.div variants={stagger.item} className="flex flex-col sm:flex-row gap-4">
            <MagneticButton href="#projects">
              See my work <ArrowRight className="ml-2 h-4 w-4" />
            </MagneticButton>
            <MagneticButton href="#contact" variant="outline">
              <Mail className="mr-2 h-4 w-4" /> Get in touch
            </MagneticButton>
          </motion.div>

          <motion.div
            variants={stagger.item}
            className="mt-16 flex flex-col items-start gap-2"
          >
            <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground/50 font-medium">Scroll</span>
            {/* Classic scroll-mouse icon */}
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-2">
              <motion.div
                className="w-1 h-2 rounded-full bg-primary"
                animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
