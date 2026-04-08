import { motion } from 'framer-motion';
import { useListProjects, getListProjectsQueryKey } from '@workspace/api-client-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, FolderGit2 } from 'lucide-react';

export function Projects() {
  const { data: projects = [], isLoading, error } = useListProjects({ 
    query: { queryKey: getListProjectsQueryKey() } 
  });

  return (
    <section id="projects" className="py-24">
      <div className="container px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Selected Work</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            A collection of applications and tools I've built.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[300px] rounded-2xl bg-secondary/50 animate-pulse border border-border/50"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 border border-destructive/20 bg-destructive/5 rounded-2xl">
            <p className="text-destructive font-medium">Failed to load projects. Please try again later.</p>
          </div>
        ) : projects.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 border border-dashed border-border rounded-2xl bg-secondary/20"
          >
            <FolderGit2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">First projects coming soon</h3>
            <p className="text-muted-foreground">I'm currently building out my portfolio. Check back shortly.</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card className="h-full flex flex-col overflow-hidden bg-card hover:border-primary/30 transition-colors group">
                  {project.imageUrl && (
                    <div className="h-48 overflow-hidden bg-secondary relative">
                      <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10"></div>
                      <img 
                        src={project.imageUrl} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-2xl">{project.title}</CardTitle>
                      {project.featured && (
                        <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20 border-0">Featured</Badge>
                      )}
                    </div>
                    <CardDescription className="text-base">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-secondary/50 text-secondary-foreground font-normal">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-border/50 gap-3">
                    {project.liveUrl && (
                      <Button asChild size="sm" className="rounded-md">
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" /> Live Demo
                        </a>
                      </Button>
                    )}
                    {project.repoUrl && (
                      <Button asChild variant="outline" size="sm" className="rounded-md">
                        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-2" /> Code
                        </a>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}