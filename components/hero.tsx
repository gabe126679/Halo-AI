'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Phone, Calendar, MessageSquare, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Problem-focused headline */}
            <div className="mb-6">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Phone className="mr-2 h-4 w-4" />
                Stop Losing Revenue to Missed Calls & No-Shows
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
              Never Miss Another{' '}
              <span className="ethereal-text">
                Customer Again
              </span>
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Halo AI's no-code platform handles your calls, schedules appointments, and follows up with leads—so your small business captures every opportunity while you focus on what you do best.
            </p>
          </motion.div>

          {/* Dual CTA Strategy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg" className="halo-button text-lg px-8">
              <Link href="/voice-agent">
                <MessageSquare className="mr-2 h-5 w-5" />
                See Halo AI in Action
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 border-primary/20 hover:bg-primary/5">
              <Link href="/onboarding">
                <Calendar className="mr-2 h-5 w-5" />
                Book Discovery Call
              </Link>
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Now onboarding Albany-area service businesses
            </p>
            <div className="flex justify-center items-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                3 Pilot Spots Available
              </span>
              <span>•</span>
              <span>No Setup Fees</span>
              <span>•</span>
              <span>30-Day Results Guarantee</span>
            </div>
          </motion.div>

          {/* ROI-focused stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 blur-3xl" />
            <div className="relative rounded-lg halo-card p-8 shadow-2xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary flex items-center justify-center">
                    <TrendingUp className="mr-2 h-6 w-6" />
                    30%
                  </div>
                  <div className="text-sm text-muted-foreground">Fewer No-Shows</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary flex items-center justify-center">
                    <Phone className="mr-2 h-6 w-6" />
                    100%
                  </div>
                  <div className="text-sm text-muted-foreground">Calls Answered</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary flex items-center justify-center">
                    <Calendar className="mr-2 h-6 w-6" />
                    5min
                  </div>
                  <div className="text-sm text-muted-foreground">Average Response</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary flex items-center justify-center">
                    <MessageSquare className="mr-2 h-6 w-6" />
                    24/7
                  </div>
                  <div className="text-sm text-muted-foreground">Lead Capture</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Ideal for section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-muted-foreground mb-4">Perfect for service businesses like:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Salons & Spas', 'Dental Offices', 'Auto Shops', 'Law Firms', 'Vet Clinics', 'Real Estate', 'Contractors'].map((business, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full bg-primary/5 text-sm text-primary border border-primary/10">
                  {business}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}