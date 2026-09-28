'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Target, Eye, Users, Shield, TrendingUp, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader, FadeIn, StaggerContainer, StaggerItem } from '@/components/shared/section-animations';

const aboutImage = 'https://images.pexels.com/photos/23496662/pexels-photo-23496662.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

const values = [
  { icon: Shield, title: 'Security First', description: 'Server-enforced authorization protects every record, every request, every user.' },
  { icon: Users, title: 'Complete Lifecycle', description: 'From discovery to verified completion — not just a job board, but a full management system.' },
  { icon: TrendingUp, title: 'Real Data, Real Value', description: 'Dashboard metrics calculated from actual database records, not fake numbers.' },
  { icon: Globe, title: 'Cameroon-First', description: 'Built for Cameroon\'s 10 regions, local companies, local universities, and XAF/FCFA pricing.' },
];

export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0 z-0">
          <Image src={aboutImage} alt="About MANTECH" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-hero-overlay" />
        </div>
        <div className="container-mantech relative z-10 px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <span className="mb-4 inline-block rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">About MANTECH</span>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">Building Cameroon&apos;s internship infrastructure</h1>
            <p className="mt-6 text-lg text-white/80">MANTECH Nexus is a secure, enterprise-grade internship management platform that centralizes the process normally scattered between websites, emails, WhatsApp messages, documents and spreadsheets.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-mantech">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <FadeIn>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-mantech text-white"><Target className="h-7 w-7" /></div>
              <h2 className="mt-5 font-heading text-2xl font-bold text-foreground">Our Mission</h2>
              <p className="mt-3 text-muted-foreground">To become the trusted digital infrastructure for internship management in Cameroon, beginning with a premium public website and specialized internship portal, then expanding into secure company and university B2B systems.</p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-orange text-white"><Eye className="h-7 w-7" /></div>
              <h2 className="mt-5 font-heading text-2xl font-bold text-foreground">Our Vision</h2>
              <p className="mt-3 text-muted-foreground">A future where every IT/ICT student in Cameroon can discover, apply to, complete, and verify their internship through a single secure platform — connecting students, companies, and universities in a trusted ecosystem.</p>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary/30">
        <div className="container-mantech">
          <SectionHeader eyebrow="Our Values" title="What drives MANTECH" description="Every feature we build supports internship management, security, trust, operations, and business value." />
          <StaggerContainer className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <StaggerItem key={v.title}>
                <div className="h-full rounded-2xl border border-border bg-white p-6 shadow-card transition-all hover:shadow-card-hover">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><v.icon className="h-6 w-6" /></div>
                  <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-mantech">
          <SectionHeader eyebrow="How MANTECH Works" title="The connected ecosystem" description="Every part of the platform works together — CMS, public website, internship portal, authentication, authorization, database, and dashboards." />
          <div className="mt-12 space-y-4">
            {[
              { step: '01', title: 'Public Website', desc: 'Attracts and explains MANTECH services to students, companies, and universities.' },
              { step: '02', title: 'Internship Portal', desc: 'Students discover opportunities, apply, and track their applications.' },
              { step: '03', title: 'Dashboards', desc: 'Five role-specific dashboards manage the entire internship lifecycle.' },
              { step: '04', title: 'Career Passport', desc: 'A separate companion app presents verified internship history.' },
              { step: '05', title: 'B2B System', desc: 'University and company partnerships create sustainable revenue.' },
            ].map((item, idx) => (
              <FadeIn key={item.step} delay={idx * 0.1}>
                <div className="flex items-start gap-6 rounded-2xl border border-border bg-card p-6 shadow-card">
                  <div className="font-heading text-3xl font-bold text-primary/20">{item.step}</div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/contact"><Button size="lg" className="bg-gradient-mantech">Get in touch <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
