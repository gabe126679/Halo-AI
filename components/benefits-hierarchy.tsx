'use client';

import { motion } from 'framer-motion';
import { 
  Clock, 
  TrendingUp, 
  Users, 
  Shield, 
  DollarSign,
  MessageSquare,
  Calendar,
  BarChart3,
  Heart
} from 'lucide-react';
import { Card } from '@/components/ui/card';

const benefits = [
  {
    icon: Clock,
    title: "Stop Revenue Leakage",
    subtitle: "Efficiency + Cost Reduction",
    description: "Never miss another lead with 24/7 AI that answers calls, captures information, and schedules appointments instantly.",
    roi: "Recover 15-25% of lost revenue from missed calls and delayed responses.",
    gradient: "from-red-500/10 to-orange-500/10",
    iconColor: "text-red-600 dark:text-red-400"
  },
  {
    icon: Users,
    title: "Create VIP Experiences",
    subtitle: "Customer Experience Enhancement",
    description: "Personalized SMS follow-ups, appointment reminders, and review requests that make every client feel valued.",
    roi: "Reduce no-shows by 30% and increase repeat visits by 40%.",
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconColor: "text-blue-600 dark:text-blue-400"
  },
  {
    icon: BarChart3,
    title: "See What's Working",
    subtitle: "Actionable Business Insights",
    description: "Simple dashboards showing your conversion rates, peak hours, revenue per client, and growth opportunities.",
    roi: "Identify 2-3 optimization opportunities worth $500-2000/month.",
    gradient: "from-green-500/10 to-emerald-500/10",
    iconColor: "text-green-600 dark:text-green-400"
  },
  {
    icon: Heart,
    title: "Human-First AI",
    subtitle: "Trust & Transparency",
    description: "AI that enhances your personal touch—never replaces it. Complete data privacy with clear, honest communication.",
    roi: "Build stronger client relationships while saving 10+ hours per week.",
    gradient: "from-purple-500/10 to-pink-500/10",
    iconColor: "text-purple-600 dark:text-purple-400"
  },
  {
    icon: DollarSign,
    title: "Measurable ROI",
    subtitle: "Proven Business Growth",
    description: "Track every dollar generated from recovered leads, reduced churn, and operational efficiency gains.",
    roi: "Average clients see 3-5x ROI within first 90 days.",
    gradient: "from-yellow-500/10 to-amber-500/10",
    iconColor: "text-yellow-600 dark:text-yellow-500"
  }
];

export function BenefitsHierarchy() {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Service Businesses Choose{' '}
              <span className="ethereal-text">Halo AI</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stop watching revenue walk out the door. Start capturing every opportunity 
              with AI that works as hard as you do.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={index === 4 ? "md:col-span-2 lg:col-span-1 lg:col-start-2" : ""}
            >
              <Card className="halo-card p-6 h-full hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity rounded-lg`} />
                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${benefit.gradient} border`}>
                      <benefit.icon className={`h-6 w-6 ${benefit.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                      <p className="text-sm text-primary font-medium">{benefit.subtitle}</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {benefit.description}
                  </p>
                  
                  <div className="bg-primary/5 rounded-lg p-3 border-l-4 border-primary">
                    <p className="text-sm font-medium text-primary">
                      💡 ROI Impact: {benefit.roi}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to action within benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 border border-primary/10 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-3">
              Ready to Stop Losing Revenue?
            </h3>
            <p className="text-muted-foreground mb-4">
              Join 3 Albany-area businesses already piloting Halo AI. No setup fees, 30-day guarantee.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="/voice-agent" 
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:scale-105 transition-transform"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Test Drive Halo AI
              </a>
              <a 
                href="/onboarding" 
                className="inline-flex items-center px-6 py-3 border border-primary/20 text-primary rounded-lg font-medium hover:bg-primary/5 transition-colors"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Book Strategy Call
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}