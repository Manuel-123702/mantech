'use client';

import Link from 'next/link';
import { Logo } from '@/components/shared/logo';
import { Github, Linkedin, Mail, MessageCircle } from 'lucide-react';

const footerLinks = {
  Platform: [
    { href: '/about', label: 'About Us' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/services', label: 'Services' },
    { href: '/pricing', label: 'Pricing' },
  ],
  Discover: [
    { href: '/internships', label: 'Find Internships' },
    { href: '/companies', label: 'Companies' },
    { href: '/universities', label: 'Universities' },
    { href: '/mantech-internship', label: 'Internship Portal' },
  ],
  Resources: [
    { href: '/resources', label: 'Resource Center' },
    { href: '/success-stories', label: 'Success Stories' },
    { href: '/testimonials', label: 'Testimonials' },
    { href: '/faq', label: 'FAQ' },
  ],
  Legal: [
    { href: '/security', label: 'Security' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/accessibility', label: 'Accessibility' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container-mantech px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2">
            <Link href="/" className="flex items-center" aria-label="ManTech Nexus Home">
              <Logo size={42} />
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The enterprise internship management platform connecting students, companies, and universities across Cameroon.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://wa.me/237650921917"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground/60 transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground/60 transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground/60 transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="mailto:tessohmanuel@gmail.com"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground/60 transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-4 text-sm font-semibold text-foreground">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MANTECH Nexus. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>WhatsApp: +237 650 921 917</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">tessohmanuel@gmail.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
