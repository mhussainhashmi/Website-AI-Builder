import { motion } from 'framer-motion';
import { Terminal, Code, Cpu, Database, Blocks, Wrench } from 'lucide-react';

const skillCategories = [
  {
    title: "AI Tools & Workflow",
    icon: <Cpu className="w-5 h-5" />,
    skills: ["Replit Agent", "Cursor", "ChatGPT / Claude", "Prompt Engineering", "AI-assisted coding"]
  },
  {
    title: "Core Stack",
    icon: <Code className="w-5 h-5" />,
    skills: ["React & TypeScript", "Tailwind CSS", "Node.js / Express", "Python basics", "HTML/CSS/JS"]
  },
  {
    title: "Data & Backend",
    icon: <Database className="w-5 h-5" />,
    skills: ["PostgreSQL", "REST APIs", "Prisma / Drizzle", "Basic CI/CD"]
  }
];

export function Skills() {
  return (
    <section id="skills" className="py-24 bg-secondary/30 border-y border-border/50">
      <div className="container px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Tools I Use</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Not a laundry list of certifications. Just the pragmatic tools I use every day to ship functional software fast.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {skillCategories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-card border border-border p-6 rounded-2xl hover-elevate transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                {category.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4">{category.title}</h3>
              <ul className="space-y-3">
                {category.skills.map((skill) => (
                  <li key={skill} className="flex items-center text-muted-foreground">
                    <Terminal className="w-4 h-4 mr-3 text-primary/50" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}