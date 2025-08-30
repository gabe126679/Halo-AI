'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Award,
  Download,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  Star,
  Phone,
  Mail,
  Play,
  FileText,
  Zap,
  Target,
  MessageSquare,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { IntelligentOnboardingData } from '../intelligent-onboarding';
import { toast } from 'sonner';

interface ResultsAndCTAProps {
  data: IntelligentOnboardingData;
  updateData: (section: keyof IntelligentOnboardingData, updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const IMPACT_METRICS = {
  real_estate: {
    responseTime: { baseline: '2.5 hours', withHalo: '30 seconds', improvement: '18,000%' },
    conversionRate: { baseline: '2.3%', withHalo: '12.8%', improvement: '456%' },
    leadCapture: { baseline: '45%', withHalo: '87%', improvement: '93%' },
    afterHoursLeads: { baseline: '0%', withHalo: '34%', improvement: 'New Revenue Stream' }
  },
  dental: {
    responseTime: { baseline: '4.2 hours', withHalo: '15 seconds', improvement: '100,800%' },
    conversionRate: { baseline: '8.1%', withHalo: '23.4%', improvement: '189%' },
    noShowRate: { baseline: '28%', withHalo: '8%', improvement: '71% reduction' },
    revenuePerLead: { baseline: '$127', withHalo: '$298', improvement: '135%' }
  },
  veterinary: {
    responseTime: { baseline: '3.8 hours', withHalo: '20 seconds', improvement: '68,400%' },
    conversionRate: { baseline: '6.7%', withHalo: '19.2%', improvement: '187%' },
    emergencyCapture: { baseline: '12%', withHalo: '89%', improvement: '642%' },
    clientRetention: { baseline: '67%', withHalo: '84%', improvement: '25%' }
  },
  salon: {
    responseTime: { baseline: '5.4 hours', withHalo: '25 seconds', improvement: '77,760%' },
    conversionRate: { baseline: '4.2%', withHalo: '16.8%', improvement: '300%' },
    rebookingRate: { baseline: '32%', withHalo: '71%', improvement: '122%' },
    averageTicket: { baseline: '$85', withHalo: '$142', improvement: '67%' }
  }
};

const ROI_CALCULATOR_DEFAULTS = {
  real_estate: { monthlyLeads: 50, averageDeal: 8500, conversionRate: 0.023 },
  dental: { monthlyLeads: 80, averageDeal: 650, conversionRate: 0.081 },
  veterinary: { monthlyLeads: 120, averageDeal: 280, conversionRate: 0.067 },
  salon: { monthlyLeads: 200, averageDeal: 85, conversionRate: 0.042 }
};

export function ResultsAndCTA({ data, updateData, onNext, onPrev }: ResultsAndCTAProps) {
  const [showROICalculator, setShowROICalculator] = useState(false);
  const [roiInputs, setROIInputs] = useState(() => {
    const defaults = ROI_CALCULATOR_DEFAULTS[data.businessProfile.industry as keyof typeof ROI_CALCULATOR_DEFAULTS];
    return {
      monthlyLeads: defaults?.monthlyLeads || 100,
      averageDeal: defaults?.averageDeal || 500,
      currentConversion: (defaults?.conversionRate || 0.05) * 100
    };
  });
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    preferredTime: '',
    urgency: 'this_month'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const businessType = data.businessProfile.industry;
  const metrics = data.simulation.metrics;
  const impacts = IMPACT_METRICS[businessType as keyof typeof IMPACT_METRICS];
  
  // Calculate ROI
  const calculateROI = () => {
    const currentMonthlyRevenue = roiInputs.monthlyLeads * (roiInputs.currentConversion / 100) * roiInputs.averageDeal;
    const improvedConversionRate = Math.min(25, roiInputs.currentConversion * 3.5); // Conservative 3.5x improvement
    const projectedMonthlyRevenue = roiInputs.monthlyLeads * (improvedConversionRate / 100) * roiInputs.averageDeal;
    const monthlyIncrease = projectedMonthlyRevenue - currentMonthlyRevenue;
    const annualIncrease = monthlyIncrease * 12;
    const haloAICost = 497 * 12; // Assuming $497/month
    const netROI = ((annualIncrease - haloAICost) / haloAICost) * 100;

    return {
      currentMonthlyRevenue: Math.round(currentMonthlyRevenue),
      projectedMonthlyRevenue: Math.round(projectedMonthlyRevenue),
      monthlyIncrease: Math.round(monthlyIncrease),
      annualIncrease: Math.round(annualIncrease),
      netROI: Math.round(netROI),
      paybackPeriod: Math.max(0.1, Math.round((haloAICost / monthlyIncrease) * 10) / 10)
    };
  };

  const roiResults = calculateROI();

  const generatePDF = async () => {
    try {
      const response = await fetch('/api/generate-simulation-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessProfile: data.businessProfile,
          simulationResults: data.simulation,
          roiProjections: roiResults,
          impactMetrics: impacts
        })
      });

      if (!response.ok) throw new Error('Failed to generate report');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.businessProfile.name}-halo-ai-simulation-report.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Report downloaded!');
    } catch (error) {
      toast.error('Failed to generate report');
    }
  };

  const bookDiscoveryCall = async () => {
    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
      toast.error('Please fill in all contact information');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/book-discovery-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessProfile: data.businessProfile,
          simulationResults: data.simulation,
          contactInfo,
          roiProjections: roiResults,
          completedAt: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Booking failed');

      const result = await response.json();
      
      toast.success('Discovery call booked! Check your email for calendar invite.');
      
      // Redirect to calendar or success page
      if (result.calendarUrl) {
        window.open(result.calendarUrl, '_blank');
      }

    } catch (error) {
      toast.error('Failed to book call. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getOverallScore = () => {
    const scores = [
      metrics.responseTime <= 2000 ? 100 : Math.max(0, 100 - (metrics.responseTime - 2000) / 50),
      metrics.intentAccuracy,
      metrics.bookingSuccess ? 100 : 50,
      metrics.satisfactionScore,
      metrics.knowledgeUtilization
    ];
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  const overallScore = getOverallScore();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className={`
            w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white
            ${overallScore >= 90 ? 'bg-green-500' : overallScore >= 80 ? 'bg-blue-500' : 'bg-orange-500'}
          `}>
            {overallScore}
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-2">
          {overallScore >= 90 ? 'Exceptional Performance!' : 
           overallScore >= 80 ? 'Great Results!' : 'Good Potential!'}
        </h3>
        <p className="text-muted-foreground">
          Your AI agent successfully handled the simulation with {overallScore}% effectiveness
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Simulation Results */}
        <div className="space-y-6">
          {/* Performance Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Performance Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Response Speed</span>
                  <span className="font-medium">{metrics.responseTime}ms</span>
                </div>
                <Progress 
                  value={Math.min(100, (3000 - metrics.responseTime) / 30)} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics.responseTime <= 1000 ? 'Lightning fast!' : 
                   metrics.responseTime <= 2000 ? 'Very good' : 'Room for improvement'}
                </p>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Intent Recognition</span>
                  <span className="font-medium">{metrics.intentAccuracy}%</span>
                </div>
                <Progress value={metrics.intentAccuracy} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics.intentAccuracy >= 90 ? 'Excellent understanding' : 
                   metrics.intentAccuracy >= 80 ? 'Good comprehension' : 'Needs more training data'}
                </p>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Knowledge Utilization</span>
                  <span className="font-medium">{metrics.knowledgeUtilization}%</span>
                </div>
                <Progress value={metrics.knowledgeUtilization} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Successfully referenced your business knowledge
                </p>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Customer Satisfaction</span>
                  <span className="font-medium">{metrics.satisfactionScore}%</span>
                </div>
                <Progress value={metrics.satisfactionScore} className="h-2" />
                <div className="flex text-xs text-yellow-500 mt-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < Math.round(metrics.satisfactionScore / 20) ? 'fill-current' : ''}`} />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    {metrics.bookingSuccess ? 'Appointment Booked' : 'Lead Captured'}
                  </span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Success
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Industry Impact */}
          {impacts && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Projected Business Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(impacts).map(([key, value]) => (
                    <div key={key} className="text-center p-3 border rounded-lg">
                      <div className="text-xl font-bold text-blue-600">
                        {value.improvement}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {value.baseline} → {value.withHalo}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conversation Replay */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Simulation Transcript
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto space-y-3">
                {data.simulation.transcript.slice(0, 4).map((entry, index) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium mb-1">
                      {entry.speaker === 'user' ? '👤 Customer' : '🤖 Halo AI'}:
                    </div>
                    <p className="text-gray-700 ml-4">"{entry.message}"</p>
                  </div>
                ))}
                {data.simulation.transcript.length > 4 && (
                  <div className="text-center py-2">
                    <Button variant="outline" size="sm" onClick={generatePDF}>
                      <FileText className="w-4 h-4 mr-2" />
                      View Full Transcript
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - ROI & CTA */}
        <div className="space-y-6">
          {/* ROI Calculator */}
          <Card className="border-2 border-blue-200 bg-blue-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <DollarSign className="w-5 h-5" />
                Your ROI Projection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showROICalculator ? (
                <div className="text-center py-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {roiResults.netROI}% ROI
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Projected first-year return on investment
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        ${roiResults.monthlyIncrease.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Monthly Increase</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {roiResults.paybackPeriod} months
                      </div>
                      <div className="text-xs text-muted-foreground">Payback Period</div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowROICalculator(true)}
                  >
                    Customize Calculation
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs">Monthly Leads</Label>
                      <Input
                        type="number"
                        value={roiInputs.monthlyLeads}
                        onChange={(e) => setROIInputs({
                          ...roiInputs,
                          monthlyLeads: parseInt(e.target.value) || 0
                        })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Average Deal Value</Label>
                      <Input
                        type="number"
                        value={roiInputs.averageDeal}
                        onChange={(e) => setROIInputs({
                          ...roiInputs,
                          averageDeal: parseInt(e.target.value) || 0
                        })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Current Conversion Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={roiInputs.currentConversion}
                      onChange={(e) => setROIInputs({
                        ...roiInputs,
                        currentConversion: parseFloat(e.target.value) || 0
                      })}
                    />
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <div className="text-sm text-center">
                      <div className="font-bold text-green-600 text-lg">
                        +${roiResults.annualIncrease.toLocaleString()}/year
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Additional Revenue Projected
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowROICalculator(false)}
                    className="w-full"
                  >
                    Hide Calculator
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Social Proof */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Join 500+ Growing Businesses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">847%</div>
                  <div className="text-xs text-muted-foreground">Avg ROI</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">24/7</div>
                  <div className="text-xs text-muted-foreground">Coverage</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">3 mins</div>
                  <div className="text-xs text-muted-foreground">Setup Time</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">No long-term contracts</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Cancel anytime</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">30-day money-back guarantee</span>
                </div>
              </div>
              
              <Badge className="w-full justify-center py-2 bg-gradient-to-r from-orange-500 to-red-500">
                🔥 Only 3 Albany-area spots left this month
              </Badge>
            </CardContent>
          </Card>

          {/* Primary CTA */}
          <Card className="border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="text-center text-green-800">
                Ready to Transform Your Business?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Your Name</Label>
                    <Input
                      placeholder="John Smith"
                      value={contactInfo.name}
                      onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Phone</Label>
                    <Input
                      placeholder="(555) 123-4567"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Email</Label>
                  <Input
                    type="email"
                    placeholder="john@business.com"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                  />
                </div>
              </div>

              <Button 
                onClick={bookDiscoveryCall}
                disabled={isSubmitting || !contactInfo.name || !contactInfo.email || !contactInfo.phone}
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Booking Your Call...
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5 mr-2" />
                    Book My 15-Minute Discovery Call
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Free consultation • No sales pressure • Immediate next steps
              </p>
            </CardContent>
          </Card>

          {/* Secondary Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={generatePDF} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.open('tel:+15185551234', '_self')}
              className="flex-1"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </Button>
          </div>
        </div>
      </div>

      {/* Final Urgency Banner */}
      <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="font-bold text-orange-800">Limited Time Opportunity</span>
            </div>
            <p className="text-sm text-orange-700 mb-4">
              Based on your simulation results, you could be missing <strong>${roiResults.monthlyIncrease.toLocaleString()}/month</strong> in potential revenue. 
              Every day you wait costs your business approximately <strong>${Math.round(roiResults.monthlyIncrease/30).toLocaleString()}</strong>.
            </p>
            <div className="flex justify-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  ${(roiResults.monthlyIncrease * 12).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Lost annually without Halo AI</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${Math.round(roiResults.monthlyIncrease * 0.15).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Recovery in first month</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation - Hidden since this is the final step */}
      <div className="flex justify-between items-center pt-6">
        <Button variant="outline" onClick={onPrev}>
          ← Back to Simulation
        </Button>
        <div className="text-sm text-muted-foreground italic">
          You've completed the Halo AI setup experience!
        </div>
      </div>
    </div>
  );
}