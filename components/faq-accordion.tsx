'use client';

import { motion } from 'framer-motion';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';

const faqs = [
  {
    question: "How quickly can we get started?",
    answer: "Most clients are live within 7-10 days. This includes setup, configuration, testing, and training. We'll work with your schedule to minimize disruption.",
  },
  {
    question: "What CRMs do you integrate with?",
    answer: "We integrate with all major CRMs including Salesforce, HubSpot, Follow Up Boss, Zoho, Airtable, and more. Custom integrations are available for enterprise clients.",
  },
  {
    question: "How does pricing work for phone calls?",
    answer: "Monthly plans include reasonable usage limits. Additional usage is billed at standard telephony rates (typically $0.02-0.05 per minute). We provide detailed usage analytics.",
  },
  {
    question: "Can the AI handle complex conversations?",
    answer: "Yes, our AI agents are trained on your specific business knowledge and can handle complex qualification scenarios. When they reach their limits, they smoothly hand off to human agents.",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use enterprise-grade security, SOC 2 compliance, and encrypt all data in transit and at rest. Your customer data never leaves approved, secure environments.",
  },
  {
    question: "What if I need to make changes?",
    answer: "All plans include ongoing support and configuration updates. You can modify scripts, rules, and integrations through our dashboard or by contacting support.",
  },
];

export function FAQAccordion() {
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
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about getting started with Anni AI.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}