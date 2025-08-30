'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Clock, Target } from 'lucide-react';

const useCases = [
  {
    icon: TrendingUp,
    title: 'Fewer Missed Leads',
    description: 'Capture every opportunity, even when your team is busy or after hours.',
    metric: '+40% lead capture',
  },
  {
    icon: Clock,
    title: 'Faster Response Time',
    description: 'Instant responses build trust and move prospects through your funnel faster.',
    metric: '< 30 second response',
  },
  {
    icon: Target,
    title: 'Better Qualification',
    description: 'AI asks the right questions to identify your most valuable prospects.',
    metric: '3x higher close rate',
  },
];

export function UseCases() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Proven Results for Growing Businesses
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how AI voice agents transform lead generation and customer engagement.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className="text-center h-full">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mx-auto mb-4">
                    <useCase.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{useCase.title}</CardTitle>
                  <div className="text-sm font-semibold text-primary">
                    {useCase.metric}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    {useCase.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}