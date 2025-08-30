'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  FileText, 
  Globe, 
  Type, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  X,
  Plus,
  Brain,
  Zap
} from 'lucide-react';
import { IntelligentOnboardingData } from '../intelligent-onboarding';
import { toast } from 'sonner';

interface KnowledgeIngestionProps {
  data: IntelligentOnboardingData;
  updateData: (section: keyof IntelligentOnboardingData, updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const FILE_TYPES = {
  faq: { label: 'FAQs', icon: '❓', color: 'bg-blue-100 text-blue-800' },
  script: { label: 'Scripts', icon: '📝', color: 'bg-green-100 text-green-800' },
  pricing: { label: 'Pricing', icon: '💰', color: 'bg-yellow-100 text-yellow-800' },
  policies: { label: 'Policies', icon: '📋', color: 'bg-purple-100 text-purple-800' },
  forms: { label: 'Forms', icon: '📄', color: 'bg-gray-100 text-gray-800' }
};

const SAMPLE_FAQS_BY_INDUSTRY = {
  real_estate: [
    { question: "What are your commission rates?", answer: "Our commission rates are competitive and vary based on the property and services needed. Contact us for a personalized quote." },
    { question: "How long does it take to sell a house?", answer: "The average time on market in our area is 45-60 days, but this varies based on pricing, condition, and market conditions." },
    { question: "Do you help with first-time homebuyers?", answer: "Yes! We specialize in helping first-time buyers navigate the process, including connecting you with trusted lenders and explaining each step." }
  ],
  dental: [
    { question: "Do you accept insurance?", answer: "We accept most major dental insurance plans. Please call with your specific plan details and we'll verify coverage." },
    { question: "What should I do for a dental emergency?", answer: "Call us immediately at [phone]. For severe pain or trauma, we offer same-day emergency appointments." },
    { question: "How often should I get cleanings?", answer: "We recommend professional cleanings every 6 months for optimal oral health, though some patients may need more frequent visits." }
  ],
  veterinary: [
    { question: "What should I bring to my pet's first visit?", answer: "Please bring any previous medical records, current medications, and a list of questions you have about your pet's health." },
    { question: "Do you offer emergency services?", answer: "We provide emergency care during business hours. For after-hours emergencies, we can refer you to the nearest 24-hour animal hospital." },
    { question: "What vaccines does my pet need?", answer: "Vaccination schedules vary by species and age. We'll create a personalized vaccination plan during your pet's examination." }
  ],
  salon: [
    { question: "How far in advance should I book?", answer: "We recommend booking 1-2 weeks in advance for regular services, and 2-3 weeks for special occasions or color services." },
    { question: "What's your cancellation policy?", answer: "We require 24-hour notice for cancellations. Same-day cancellations may incur a fee to cover the reserved time slot." },
    { question: "Do you offer bridal packages?", answer: "Yes! We offer comprehensive bridal packages including trial runs, day-of services, and group bookings for your wedding party." }
  ]
};

export function KnowledgeIngestion({ data, updateData, onNext, onPrev }: KnowledgeIngestionProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [newService, setNewService] = useState('');
  
  const knowledgeBase = data.knowledgeBase;
  const businessType = data.businessProfile.industry;

  const handleFileUpload = useCallback(async (files: FileList, type?: string) => {
    setIsProcessing(true);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Maximum size is 50MB.`);
        continue;
      }

      // Validate file type
      const allowedTypes = ['.pdf', '.docx', '.doc', '.txt', '.csv'];
      const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
      if (!allowedTypes.includes(fileExtension)) {
        toast.error(`File type ${fileExtension} is not supported. Use PDF, Word, TXT, or CSV files.`);
        continue;
      }

      const fileId = `file_${Date.now()}_${i}`;
      const newFile = {
        id: fileId,
        name: file.name,
        type: (type || detectFileType(file.name)) as any,
        status: 'processing' as const
      };

      // Add file to list immediately
      updateData('knowledgeBase', {
        uploadedFiles: [...knowledgeBase.uploadedFiles, newFile]
      });

      try {
        // Upload and process file
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileId', fileId);
        formData.append('businessId', data.businessProfile.name || 'temp');
        formData.append('industry', businessType);

        const response = await fetch('/api/knowledge-ingestion', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) throw new Error('Upload failed');

        const result = await response.json();

        // Update file status and extracted data
        updateData('knowledgeBase', {
          uploadedFiles: knowledgeBase.uploadedFiles.map(f => 
            f.id === fileId 
              ? { ...f, status: 'completed', extractedData: result.extractedData }
              : f
          ),
          processingResults: {
            ...knowledgeBase.processingResults,
            totalFaqs: knowledgeBase.processingResults.totalFaqs + (result.faqCount || 0),
            detectedIntents: [...new Set([
              ...knowledgeBase.processingResults.detectedIntents,
              ...(result.detectedIntents || [])
            ])],
            knowledgeScore: Math.min(1, knowledgeBase.processingResults.knowledgeScore + 0.2)
          }
        });

        toast.success(`${file.name} processed successfully!`);
        
      } catch (error) {
        // Update file status to error
        updateData('knowledgeBase', {
          uploadedFiles: knowledgeBase.uploadedFiles.map(f => 
            f.id === fileId ? { ...f, status: 'error' } : f
          )
        });
        
        toast.error(`Failed to process ${file.name}`);
      }
    }

    setIsProcessing(false);
  }, [knowledgeBase, businessType, updateData, data.businessProfile.name]);

  const detectFileType = (filename: string): string => {
    const lower = filename.toLowerCase();
    if (lower.includes('faq') || lower.includes('question')) return 'faq';
    if (lower.includes('script') || lower.includes('call')) return 'script';
    if (lower.includes('price') || lower.includes('cost')) return 'pricing';
    if (lower.includes('policy') || lower.includes('terms')) return 'policies';
    if (lower.includes('form') || lower.includes('intake')) return 'forms';
    return 'faq'; // Default
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const removeFile = (fileId: string) => {
    updateData('knowledgeBase', {
      uploadedFiles: knowledgeBase.uploadedFiles.filter(f => f.id !== fileId)
    });
  };

  const addManualFaq = () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) {
      toast.error('Please fill in both question and answer');
      return;
    }

    updateData('knowledgeBase', {
      manualInput: {
        ...knowledgeBase.manualInput,
        faqs: [...knowledgeBase.manualInput.faqs, { ...newFaq }]
      },
      processingResults: {
        ...knowledgeBase.processingResults,
        totalFaqs: knowledgeBase.processingResults.totalFaqs + 1,
        knowledgeScore: Math.min(1, knowledgeBase.processingResults.knowledgeScore + 0.1)
      }
    });

    setNewFaq({ question: '', answer: '' });
    toast.success('FAQ added!');
  };

  const addSampleFaqs = () => {
    const sampleFaqs = SAMPLE_FAQS_BY_INDUSTRY[businessType as keyof typeof SAMPLE_FAQS_BY_INDUSTRY] || [];
    
    updateData('knowledgeBase', {
      manualInput: {
        ...knowledgeBase.manualInput,
        faqs: [...knowledgeBase.manualInput.faqs, ...sampleFaqs]
      },
      processingResults: {
        ...knowledgeBase.processingResults,
        totalFaqs: knowledgeBase.processingResults.totalFaqs + sampleFaqs.length,
        knowledgeScore: Math.min(1, knowledgeBase.processingResults.knowledgeScore + 0.3)
      }
    });

    toast.success(`Added ${sampleFaqs.length} sample FAQs for ${businessType.replace('_', ' ')}`);
  };

  const addService = () => {
    if (!newService.trim()) return;
    
    updateData('knowledgeBase', {
      manualInput: {
        ...knowledgeBase.manualInput,
        services: [...knowledgeBase.manualInput.services, newService.trim()]
      }
    });
    
    setNewService('');
  };

  const processWebsiteContent = async (url: string) => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/website-crawler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, businessId: data.businessProfile.name })
      });

      if (!response.ok) throw new Error('Failed to process website');
      
      const result = await response.json();
      
      updateData('knowledgeBase', {
        websiteData: {
          url,
          extractedContent: result.content,
          status: 'completed'
        },
        processingResults: {
          ...knowledgeBase.processingResults,
          totalFaqs: knowledgeBase.processingResults.totalFaqs + (result.faqCount || 0),
          detectedIntents: [...new Set([
            ...knowledgeBase.processingResults.detectedIntents,
            ...(result.detectedIntents || [])
          ])],
          knowledgeScore: Math.min(1, knowledgeBase.processingResults.knowledgeScore + 0.25)
        }
      });

      toast.success('Website content processed!');
    } catch (error) {
      toast.error('Failed to process website content');
    } finally {
      setIsProcessing(false);
    }
  };

  const totalKnowledgeItems = knowledgeBase.uploadedFiles.length + 
                             knowledgeBase.manualInput.faqs.length + 
                             knowledgeBase.manualInput.services.length +
                             (knowledgeBase.websiteData ? 1 : 0);

  const canProceed = totalKnowledgeItems >= 1; // Just need something uploaded

  return (
    <div className="space-y-8">
      {/* Header with Progress */}
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">Share Your Business Knowledge</h3>
        <p className="text-muted-foreground mb-4">
          Upload your FAQs, scripts, and policies so your AI agent knows how to help your customers
        </p>
        
        <div className="flex justify-center items-center space-x-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalKnowledgeItems}</div>
            <div className="text-xs text-muted-foreground">Items Added</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(knowledgeBase.processingResults.knowledgeScore * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">Readiness Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {knowledgeBase.processingResults.detectedIntents.length}
            </div>
            <div className="text-xs text-muted-foreground">Intents Found</div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Files
          </TabsTrigger>
          <TabsTrigger value="website" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Website Scan
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Type className="w-4 h-4" />
            Manual Entry
          </TabsTrigger>
        </TabsList>

        {/* File Upload Tab */}
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardContent className="p-8">
              <div
                className={`
                  border-2 border-dashed rounded-lg p-12 text-center transition-colors
                  ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Drop your files here</h3>
                <p className="text-muted-foreground mb-4">
                  Upload PDFs, Word docs, or text files containing your FAQs, scripts, pricing, and policies
                </p>
                
                <div className="flex justify-center gap-3">
                  {Object.entries(FILE_TYPES).map(([key, type]) => (
                    <label key={key} className="cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        accept=".pdf,.docx,.doc,.txt,.csv"
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files, key)}
                      />
                      <Badge variant="outline" className="hover:bg-gray-50">
                        {type.icon} {type.label}
                      </Badge>
                    </label>
                  ))}
                </div>
                
                <p className="text-xs text-muted-foreground mt-4">
                  Maximum 50MB per file • PDF, Word, TXT, CSV supported
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Files List */}
          {knowledgeBase.uploadedFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Uploaded Files ({knowledgeBase.uploadedFiles.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {knowledgeBase.uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          {FILE_TYPES[file.type]?.icon || '📄'}
                        </div>
                        <div>
                          <div className="font-medium">{file.name}</div>
                          <Badge variant="outline" className={FILE_TYPES[file.type]?.color}>
                            {FILE_TYPES[file.type]?.label || 'Document'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {file.status === 'processing' && <Loader2 className="w-4 h-4 animate-spin" />}
                        {file.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-600" />}
                        {file.status === 'error' && <AlertCircle className="w-4 h-4 text-red-600" />}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Website Scan Tab */}
        <TabsContent value="website" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Auto-Extract from Website</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="https://yourbusiness.com"
                  value={data.businessProfile.website}
                  onChange={(e) => updateData('businessProfile', { website: e.target.value })}
                  className="flex-1"
                />
                <Button 
                  onClick={() => processWebsiteContent(data.businessProfile.website)}
                  disabled={!data.businessProfile.website || isProcessing}
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                  Scan Website
                </Button>
              </div>

              {knowledgeBase.websiteData && (
                <div className="p-4 border rounded-lg bg-green-50">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Website content extracted!</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Found content from: {knowledgeBase.websiteData.url}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manual Entry Tab */}
        <TabsContent value="manual" className="space-y-6">
          {/* Sample FAQs */}
          {businessType !== 'other' && SAMPLE_FAQS_BY_INDUSTRY[businessType as keyof typeof SAMPLE_FAQS_BY_INDUSTRY] && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Quick Start: Sample FAQs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={addSampleFaqs} variant="outline" className="w-full">
                  Add {SAMPLE_FAQS_BY_INDUSTRY[businessType as keyof typeof SAMPLE_FAQS_BY_INDUSTRY]?.length} sample FAQs for {businessType.replace('_', ' ')}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Manual FAQ Entry */}
          <Card>
            <CardHeader>
              <CardTitle>Add FAQs Manually</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label>Question</Label>
                  <Input
                    placeholder="e.g., What are your hours?"
                    value={newFaq.question}
                    onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Answer</Label>
                  <Textarea
                    placeholder="We're open Monday-Friday 9am-5pm..."
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              
              <Button onClick={addManualFaq} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add FAQ
              </Button>

              {knowledgeBase.manualInput.faqs.length > 0 && (
                <div className="space-y-2 mt-4">
                  <h4 className="font-medium">Added FAQs ({knowledgeBase.manualInput.faqs.length})</h4>
                  {knowledgeBase.manualInput.faqs.map((faq, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="font-medium text-sm">{faq.question}</div>
                      <div className="text-xs text-muted-foreground mt-1">{faq.answer}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle>Services Offered</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Home buying consultation"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addService()}
                />
                <Button onClick={addService}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {knowledgeBase.manualInput.services.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {knowledgeBase.manualInput.services.map((service, index) => (
                    <Badge key={index} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Knowledge Score Progress */}
      {knowledgeBase.processingResults.knowledgeScore > 0 && (
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-green-800">Knowledge Readiness</h4>
              <span className="text-sm font-medium text-green-800">
                {Math.round(knowledgeBase.processingResults.knowledgeScore * 100)}%
              </span>
            </div>
            <Progress 
              value={knowledgeBase.processingResults.knowledgeScore * 100} 
              className="h-2 mb-3"
            />
            <div className="text-sm text-green-700">
              {knowledgeBase.processingResults.knowledgeScore >= 0.7 
                ? "Excellent! Your AI agent has comprehensive knowledge."
                : knowledgeBase.processingResults.knowledgeScore >= 0.4
                ? "Good progress! Add more content for better performance."
                : "Keep going! Add more FAQs, files, or website content."
              }
            </div>
            
            {knowledgeBase.processingResults.detectedIntents.length > 0 && (
              <div className="mt-3">
                <div className="text-xs font-medium text-green-800 mb-2">Detected Intents:</div>
                <div className="flex flex-wrap gap-1">
                  {knowledgeBase.processingResults.detectedIntents.slice(0, 8).map((intent) => (
                    <Badge key={intent} variant="outline" className="text-xs">
                      {intent}
                    </Badge>
                  ))}
                  {knowledgeBase.processingResults.detectedIntents.length > 8 && (
                    <Badge variant="outline" className="text-xs">
                      +{knowledgeBase.processingResults.detectedIntents.length - 8} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <Button variant="outline" onClick={onPrev}>
          ← Back to Discovery
        </Button>
        <Button 
          onClick={onNext}
          disabled={!canProceed || isProcessing}
          size="lg"
        >
          {!canProceed 
            ? `Upload at least one file, FAQ, or scan your website to continue`
            : 'Next: Quick Setup'
          }
        </Button>
      </div>
    </div>
  );
}