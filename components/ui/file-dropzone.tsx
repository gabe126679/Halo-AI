'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, File, AlertCircle } from 'lucide-react';

interface FileDropzoneProps {
  onFilesUploaded: (files: File[]) => void;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
}

export function FileDropzone({ 
  onFilesUploaded, 
  accept = '.txt,.csv,.json,.pdf', 
  maxSize = 10 * 1024 * 1024,
  disabled = false
}: FileDropzoneProps) {
  const [error, setError] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError('');
    
    if (rejectedFiles.length > 0) {
      const rejectedFile = rejectedFiles[0];
      if (rejectedFile.errors?.[0]?.code === 'file-too-large') {
        setError(`File is too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB.`);
      } else if (rejectedFile.errors?.[0]?.code === 'file-invalid-type') {
        setError('Invalid file type. Please upload TXT, CSV, JSON, or PDF files.');
      } else {
        setError('File upload failed. Please try again.');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      onFilesUploaded(acceptedFiles);
    }
  }, [onFilesUploaded, maxSize]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'application/pdf': ['.pdf'],
    },
    maxSize,
    disabled,
  });

  return (
    <div className="space-y-2">
      <Card 
        {...getRootProps()} 
        className={`
          p-8 border-2 border-dashed cursor-pointer transition-all
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}
        `}
      >
        <input {...getInputProps()} />
        <div className="text-center space-y-4">
          <Upload className={`h-12 w-12 mx-auto ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {isDragActive 
                ? 'Drop files here...' 
                : 'Drag and drop files here, or click to browse'
              }
            </p>
            <Button type="button" variant="outline" size="sm" onClick={open} disabled={disabled}>
              <File className="mr-2 h-4 w-4" />
              Choose Files
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {accept.split(',').join(', ').toUpperCase()} up to {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        </div>
      </Card>
      
      {error && (
        <div className="flex items-center space-x-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}