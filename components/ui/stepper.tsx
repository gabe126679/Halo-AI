'use client';

import { Check } from 'lucide-react';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${index < currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : index === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                  }
                `}
              >
                {index < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-xs mt-2 text-center max-w-[80px]">
                {step}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div 
                className={`
                  flex-1 h-0.5 mx-4
                  ${index < currentStep ? 'bg-primary' : 'bg-muted'}
                `}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}