import React, { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent ${
        scrolled ? 'bg-background/80 backdrop-blur-md border-border py-3 shadow-sm' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 max-w-5xl flex items-center justify-between">
        <a href="#home" className="text-xl font-bold tracking-tight text-foreground hover:text-primary transition-colors">
          H.
        </a>
        
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.name}
            </a>
          ))}
          <ThemeToggle />
        </nav>
        
        <div className="md:hidden flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}