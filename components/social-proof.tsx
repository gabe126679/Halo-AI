'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Quote,
  Calendar,
  MessageSquare,
  MapPin
} from 'lucide-react';

const stats = [
  {
    icon: TrendingUp,
    stat: "91%",
    description: "of SMBs using AI tools report measurable growth within 6 months",
    source: "Small Business AI Adoption Study 2024"
  },
  {
    icon: Users,
    stat: "73%",
    description: "of customers prefer businesses that respond within 5 minutes",
    source: "Lead Response Management Study"
  },
  {
    icon: CheckCircle,
    stat: "30%",
    description: "average reduction in no-shows with automated reminders",
    source: "Service Business Efficiency Report"
  }
];

const pilotResults = [
  {
    business: "Albany Dental Care",
    type: "Dental Office",
    result: "Reduced phone tag by 80%, captured 15 after-hours leads in first month",
    improvement: "20% increase in new patient bookings",
    icon: "🦷"
  },
  {
    business: "Premier Auto Service",
    type: "Auto Shop",
    result: "Automated appointment reminders cut no-shows from 25% to 8%",
    improvement: "$3,200 additional monthly revenue",
    icon: "🚗"
  },
  {
    business: "Elite Hair Studio",
    type: "Salon & Spa",
    result: "Clients love the branded app—40% use it for rebooking",
    improvement: "35% increase in repeat appointments",
    icon: "💇‍♀️"
  }
];

const testimonialTemplate = {
  quote: "Before Halo AI, we were losing potential clients every week to missed calls and scheduling conflicts. Now our AI assistant handles everything seamlessly, and we've seen a genuine increase in bookings and client satisfaction.",
  author: "Sarah Mitchell",
  role: "Owner, Wellness Spa",
  rating: 5,
  results: "30% fewer no-shows, 25% more bookings"
};

export function SocialProof() {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4">
        
        {/* Market Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Why Smart Businesses Choose{' '}
            <span className="ethereal-text">AI Automation</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            The data is clear: businesses using AI tools consistently outperform those that don't.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="halo-card p-6 text-center hover:scale-105 transition-transform">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full border border-primary/20">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.stat}</div>
                  <p className="text-sm text-muted-foreground mb-3">{stat.description}</p>
                  <p className="text-xs text-muted-foreground/70 italic">{stat.source}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pilot Program Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <MapPin className="mr-2 h-4 w-4" />
              Albany Area Pilot Program Results
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Real Results from Local Businesses
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're currently piloting with 3 Albany-area service businesses. Here's what they're experiencing:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {pilotResults.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="halo-card p-6 h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-2xl">{result.icon}</div>
                    <div>
                      <h4 className="font-semibold">{result.business}</h4>
                      <p className="text-sm text-muted-foreground">{result.type}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{result.result}</p>
                  <div className="bg-primary/5 rounded-lg p-3 border-l-4 border-primary">
                    <p className="text-sm font-medium text-primary">{result.improvement}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Featured Testimonial Template */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <Card className="halo-card max-w-4xl mx-auto p-8 relative overflow-hidden">
            <div className="absolute top-4 left-6 text-primary/20">
              <Quote className="h-12 w-12" />
            </div>
            <div className="relative">
              <div className="flex items-center mb-6">
                {[...Array(testimonialTemplate.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <blockquote className="text-lg italic text-muted-foreground mb-6 leading-relaxed">
                "{testimonialTemplate.quote}"
              </blockquote>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{testimonialTemplate.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonialTemplate.role}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-primary">{testimonialTemplate.results}</div>
                  <div className="text-xs text-muted-foreground">First 90 days</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Pilot Program CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Card className="halo-card max-w-3xl mx-auto p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <div className="mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-primary">3 Pilot Spots Remaining</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Join the Albany Pilot Program</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get priority access, hands-on setup support, and 30% off your first 6 months. 
                Perfect for service businesses ready to stop losing revenue to missed opportunities.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button size="lg" className="halo-button">
                <Calendar className="mr-2 h-5 w-5" />
                Apply for Pilot Program
              </Button>
              <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5">
                <MessageSquare className="mr-2 h-5 w-5" />
                See Demo First
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center">
                <CheckCircle className="mr-1 h-4 w-4 text-green-600" />
                No setup fees
              </span>
              <span className="flex items-center">
                <CheckCircle className="mr-1 h-4 w-4 text-green-600" />
                30-day guarantee
              </span>
              <span className="flex items-center">
                <CheckCircle className="mr-1 h-4 w-4 text-green-600" />
                Cancel anytime
              </span>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}