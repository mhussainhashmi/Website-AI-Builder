import { motion } from 'framer-motion';

export function About() {
  return (
    <section id="about" className="py-24 relative">
      <div className="container px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">About Me</h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                I'm a Computer Science student currently navigating the intersection of traditional engineering and modern AI tools.
              </p>
              <p>
                I don't have decades of enterprise experience yet. What I do have is an obsession with building things that work, adapting quickly, and leveraging AI to move faster than traditional workflows allow.
              </p>
              <p>
                Whether it's whipping up a full-stack application or automating a tedious workflow, I'm building my portfolio one real-world problem at a time.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-secondary border border-border overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent"></div>
              {/* Using a highly specific generated image for the vibe */}
              <img 
                src="/about-workspace.png" 
                alt="Workspace" 
                className="object-cover w-full h-full opacity-80 mix-blend-luminosity"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl"></div>
            </div>
            
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary/20 blur-2xl rounded-full z-[-1]"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}