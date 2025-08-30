'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare, 
  Phone, 
  Calendar, 
  DollarSign,
  Play,
  RotateCcw,
  Smartphone
} from 'lucide-react';

const demoScenarios = [
  {
    title: "Dental Office - After Hours Lead",
    type: "dental",
    trigger: "Missed call at 7:30 PM",
    messages: [
      { sender: "ai", text: "Hi! I noticed you called Albany Dental Care after hours. I'm Dr. Smith's AI assistant. How can I help you today?", delay: 1000 },
      { sender: "customer", text: "Hi, I have a terrible toothache and need an appointment ASAP", delay: 2000 },
      { sender: "ai", text: "I'm sorry to hear about your pain! Let me check our emergency slots. Can I get your name and phone number?", delay: 1500 },
      { sender: "customer", text: "Sarah Johnson, 518-555-0123", delay: 2000 },
      { sender: "ai", text: "Thanks Sarah! I have an emergency slot tomorrow at 9 AM with Dr. Smith. Would that work for you?", delay: 1500 },
      { sender: "customer", text: "Perfect! Yes please book it", delay: 1500 },
      { sender: "ai", text: "✅ Booked! You'll receive a confirmation text with directions. Is there anything else I can help with?", delay: 1500 },
    ],
    result: "Lead captured, appointment scheduled, $300+ in potential revenue saved"
  },
  {
    title: "Auto Shop - Service Reminder",
    type: "auto",
    trigger: "Automated 6-month follow-up",
    messages: [
      { sender: "ai", text: "Hi Mike! It's been 6 months since your last service at Premier Auto. Your Honda Civic is due for an oil change and inspection.", delay: 1000 },
      { sender: "customer", text: "Oh wow, time flies! What's available next week?", delay: 2000 },
      { sender: "ai", text: "I have Tuesday 2 PM or Thursday 10 AM open. The service takes about 45 minutes and costs $89.", delay: 1500 },
      { sender: "customer", text: "Tuesday works great", delay: 1500 },
      { sender: "ai", text: "Perfect! Booked for Tuesday 2 PM. We'll text you a reminder the day before. Thanks for choosing Premier Auto!", delay: 1500 },
    ],
    result: "Proactive booking, $89 revenue, stronger customer relationship"
  }
];

const roiCalculator = {
  inputs: {
    monthlyLeads: 50,
    currentConversion: 30,
    avgDealValue: 200,
    noShowRate: 20
  },
  calculations: {
    currentRevenue: 0,
    missedOpportunities: 0,
    potentialGains: 0,
    annualImpact: 0
  }
};

export function InteractiveDemo() {
  const [activeDemo, setActiveDemo] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showROI, setShowROI] = useState(false);
  const [roiInputs, setROIInputs] = useState(roiCalculator.inputs);
  const [roiResults, setROIResults] = useState(roiCalculator.calculations);

  useEffect(() => {
    if (isPlaying && messageIndex < demoScenarios[activeDemo].messages.length) {
      const message = demoScenarios[activeDemo].messages[messageIndex];
      const timer = setTimeout(() => {
        setMessageIndex(prev => prev + 1);
      }, message.delay);
      return () => clearTimeout(timer);
    } else if (messageIndex >= demoScenarios[activeDemo].messages.length) {
      setIsPlaying(false);
    }
  }, [isPlaying, messageIndex, activeDemo]);

  useEffect(() => {
    // Calculate ROI
    const { monthlyLeads, currentConversion, avgDealValue, noShowRate } = roiInputs;
    const currentRevenue = (monthlyLeads * currentConversion / 100) * avgDealValue;
    const improvedConversion = Math.min(currentConversion + 25, 90); // 25% improvement
    const reducedNoShows = Math.max(noShowRate - 15, 5); // 15% reduction
    const newRevenue = (monthlyLeads * improvedConversion / 100) * avgDealValue;
    const noShowSavings = ((noShowRate - reducedNoShows) / 100) * newRevenue;
    const totalGains = (newRevenue - currentRevenue) + noShowSavings;
    
    setROIResults({
      currentRevenue,
      missedOpportunities: monthlyLeads - (monthlyLeads * currentConversion / 100),
      potentialGains: totalGains,
      annualImpact: totalGains * 12
    });
  }, [roiInputs]);

  const startDemo = (index: number) => {
    setActiveDemo(index);
    setMessageIndex(0);
    setIsPlaying(true);
  };

  const resetDemo = () => {
    setMessageIndex(0);
    setIsPlaying(false);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            See Halo AI in{' '}
            <span className="ethereal-text">Action</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch real scenarios show how AI captures leads and schedules appointments 
            while you're busy or after hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* SMS Demo */}
          <div>
            <div className="flex gap-4 mb-6">
              {demoScenarios.map((scenario, index) => (
                <Button
                  key={index}
                  variant={activeDemo === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => startDemo(index)}
                  className={activeDemo === index ? "halo-button" : ""}
                >
                  {scenario.type === "dental" ? "🦷" : "🚗"} {scenario.title.split(" - ")[0]}
                </Button>
              ))}
            </div>

            <Card className="halo-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{demoScenarios[activeDemo].title}</h3>
                  <p className="text-sm text-muted-foreground">{demoScenarios[activeDemo].trigger}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => startDemo(activeDemo)}>
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={resetDemo}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Phone Interface */}
              <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl p-4 max-w-sm mx-auto">
                <div className="bg-white rounded-xl p-4 h-96 overflow-hidden">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b">
                    <Smartphone className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">SMS Conversation</span>
                  </div>
                  
                  <div className="space-y-3 h-80 overflow-y-auto">
                    <AnimatePresence>
                      {demoScenarios[activeDemo].messages.slice(0, messageIndex).map((message, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex ${message.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
                        >
                          <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                            message.sender === 'ai' 
                              ? 'bg-gray-200 text-gray-800' 
                              : 'bg-primary text-primary-foreground'
                          }`}>
                            {message.text}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {isPlaying && messageIndex < demoScenarios[activeDemo].messages.length && (
                      <div className="flex justify-start">
                        <div className="bg-gray-200 px-3 py-2 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-400 font-medium">
                  💡 Result: {demoScenarios[activeDemo].result}
                </p>
              </div>
            </Card>
          </div>

          {/* ROI Calculator */}
          <div>
            <Card className="halo-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">ROI Calculator</h3>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium mb-1 block">Monthly Leads</label>
                  <Input
                    type="number"
                    value={roiInputs.monthlyLeads}
                    onChange={(e) => setROIInputs({...roiInputs, monthlyLeads: parseInt(e.target.value) || 0})}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Current Conversion Rate (%)</label>
                  <Input
                    type="number"
                    value={roiInputs.currentConversion}
                    onChange={(e) => setROIInputs({...roiInputs, currentConversion: parseInt(e.target.value) || 0})}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Average Deal Value ($)</label>
                  <Input
                    type="number"
                    value={roiInputs.avgDealValue}
                    onChange={(e) => setROIInputs({...roiInputs, avgDealValue: parseInt(e.target.value) || 0})}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">No-Show Rate (%)</label>
                  <Input
                    type="number"
                    value={roiInputs.noShowRate}
                    onChange={(e) => setROIInputs({...roiInputs, noShowRate: parseInt(e.target.value) || 0})}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-4 border border-primary/20">
                <h4 className="font-semibold mb-3 text-primary">Your Potential with Halo AI</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Current Monthly Revenue</div>
                    <div className="font-bold text-lg">${roiResults.currentRevenue.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Monthly Gains</div>
                    <div className="font-bold text-lg text-green-600">+${roiResults.potentialGains.toLocaleString()}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-muted-foreground">Annual Impact</div>
                    <div className="font-bold text-2xl text-primary">${roiResults.annualImpact.toLocaleString()}</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-primary/10">
                  <p className="text-xs text-muted-foreground">
                    * Based on 25% conversion improvement and 15% no-show reduction
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button className="w-full halo-button" size="lg">
                  <Calendar className="mr-2 h-4 w-4" />
                  Get Your Custom ROI Report
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Try Demo with Your Data
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}