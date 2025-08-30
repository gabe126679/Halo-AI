'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Workflow, 
  BarChart3, 
  Smartphone,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const services = [
  {
    icon: MessageSquare,
    title: 'Voice & SMS Agents',
    benefit: 'Never Miss Another Lead',
    description: 'AI agents that answer calls, capture information, and schedule appointments 24/7—so you never lose revenue to missed opportunities.',
    useCase: 'Perfect for: Dental offices getting 50+ calls/day can capture every after-hours inquiry and reduce phone tag by 80%.',
    features: ['24/7 call answering', 'Instant lead capture', 'Appointment scheduling', 'SMS follow-ups'],
    roi: 'Recover 15-25% lost revenue'
  },
  {
    icon: Workflow,
    title: 'Automation Workflows',
    benefit: 'Eliminate Repetitive Tasks',
    description: 'Smart reminders, review requests, no-show prevention, and missed-call recovery that run automatically in the background.',
    useCase: 'Perfect for: Auto shops can automatically send service reminders, collect reviews, and follow up on estimates without lifting a finger.',
    features: ['Appointment reminders', 'Review collection', 'Follow-up sequences', 'No-show prevention'],
    roi: 'Save 10+ hours per week'
  },
  {
    icon: BarChart3,
    title: 'Custom CRM & Analytics',
    benefit: 'See What Drives Revenue',
    description: 'Clean pipelines, contact management, and simple dashboards that show exactly where your money comes from.',
    useCase: 'Perfect for: Real estate agents can track lead sources, conversion rates, and identify their most profitable referral partners.',
    features: ['Contact management', 'Pipeline tracking', 'Revenue analytics', 'ROI reporting'],
    roi: 'Identify $500-2K/month in opportunities'
  },
  {
    icon: Smartphone,
    title: 'Premium Mobile App',
    benefit: 'Your Brand in Their Pocket',
    description: 'Fully-branded mobile CRM for clients to book appointments, view history, and communicate directly with your business.',
    useCase: 'Perfect for: Salons where clients can book services, see upcoming appointments, and get personalized offers.',
    features: ['Branded mobile app', 'Client self-service', 'Push notifications', 'Loyalty programs'],
    roi: 'Increase repeat visits by 40%',
    premium: true,
    pricing: '$7.5K build + $2.5K-3.5K/month'
  }
];

export function ServicesGrid() {
  return (
    <section id="services" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Complete Platform for{' '}
            <span className="ethereal-text">Service Businesses</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Everything you need to capture more leads, serve clients better, and grow revenue—
            without the complexity of enterprise software.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={service.premium ? "lg:col-span-2" : ""}
            >
              <Card className={`halo-card h-full hover:scale-[1.02] transition-all duration-300 ${service.premium ? 'border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5' : ''}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${service.premium ? 'bg-primary/20 border border-primary/20' : 'bg-primary/10 border border-primary/10'}`}>
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    {service.premium && (
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                        Premium
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                  <div className="text-primary font-semibold mb-3">{service.benefit}</div>
                  <CardDescription className="text-base leading-relaxed text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Use Case */}
                  <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary/30">
                    <p className="text-sm text-muted-foreground">
                      {service.useCase}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* ROI & Pricing */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="text-sm">
                      <span className="font-semibold text-primary">ROI: </span>
                      <span className="text-muted-foreground">{service.roi}</span>
                    </div>
                    {service.premium && (
                      <div className="text-right text-sm">
                        <div className="font-semibold">{service.pricing}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 border border-primary/10 max-w-3xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">
              Ready to Build Your Revenue Recovery System?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Start with any service above, or get a custom recommendation based on your business type and current challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="halo-button">
                <a href="/voice-agent">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Try Voice Agent Demo
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5">
                <a href="/intelligent-onboarding">
                  Get Custom Recommendation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}