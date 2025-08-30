'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { OnboardingData } from '../onboarding-wizard';
import { Upload, FileText, Trash2 } from 'lucide-react';

interface ScriptsFAQsProps {
  data: OnboardingData;
  updateData: (section: keyof OnboardingData, sectionData: any) => void;
}

export function ScriptsFAQs({ data, updateData }: ScriptsFAQsProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesUploaded = async (files: File[]) => {
    setIsProcessing(true);
    const newFiles = [...data.scriptsFAQs.uploadedFiles, ...files];
    
    // Process files to extract Q&A pairs
    const newQA = [];
    
    for (const file of files) {
      try {
        const text = await file.text();
        const qa = parseTextToQA(text);
        newQA.push(...qa);
      } catch (error) {
        console.error('Error processing file:', file.name, error);
      }
    }

    updateData('scriptsFAQs', { 
      uploadedFiles: newFiles,
      parsedQA: [...data.scriptsFAQs.parsedQA, ...newQA]
    });
    
    setIsProcessing(false);
  };

  const handlePastedContentChange = (content: string) => {
    updateData('scriptsFAQs', { pastedContent: content });
    
    if (content.trim()) {
      const qa = parseTextToQA(content);
      updateData('scriptsFAQs', { parsedQA: qa });
    }
  };

  const parseTextToQA = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const qa = [];
    
    // Simple parsing logic - look for question-answer patterns
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim();
      const nextLine = lines[i + 1].trim();
      
      if (line.includes('?') || line.toLowerCase().includes('what') || line.toLowerCase().includes('how')) {
        qa.push({
          question: line.replace(/^Q:?\s*/i, ''),
          answer: nextLine.replace(/^A:?\s*/i, '')
        });
        i++; // Skip next line since we used it as answer
      }
    }
    
    return qa;
  };

  const removeFile = (index: number) => {
    const newFiles = data.scriptsFAQs.uploadedFiles.filter((_, i) => i !== index);
    updateData('scriptsFAQs', { uploadedFiles: newFiles });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Scripts & FAQs</h2>
        <p className="text-muted-foreground">
          Upload your existing scripts, FAQs, or training materials to teach your AI agent.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Upload Files</Label>
            <p className="text-sm text-muted-foreground">
              Accepted formats: TXT, CSV, JSON, PDF (up to 10MB each)
            </p>
            <FileDropzone
              onFilesUploaded={handleFilesUploaded}
              accept=".txt,.csv,.json,.pdf"
              maxSize={10 * 1024 * 1024}
              disabled={isProcessing}
            />
          </div>

          {data.scriptsFAQs.uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Uploaded Files</Label>
              <div className="space-y-2">
                {data.scriptsFAQs.uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Label className="text-lg font-semibold">Or Paste Content</Label>
            <Textarea
              value={data.scriptsFAQs.pastedContent}
              onChange={(e) => handlePastedContentChange(e.target.value)}
              placeholder="Paste your scripts, FAQs, or training content here..."
              className="min-h-[200px]"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-semibold">Parsed Q&A Pairs</Label>
          <p className="text-sm text-muted-foreground">
            Preview of questions and answers extracted from your content
          </p>
          
          {data.scriptsFAQs.parsedQA.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {data.scriptsFAQs.parsedQA.map((qa, index) => (
                <Card key={index} className="p-3">
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-primary">
                      Q: {qa.question}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      A: {qa.answer}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Upload files or paste content to see parsed Q&A pairs here
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}