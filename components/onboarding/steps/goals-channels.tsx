'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { OnboardingData } from '../onboarding-wizard';

interface GoalsChannelsProps {
  data: OnboardingData;
  updateData: (section: keyof OnboardingData, sectionData: any) => void;
}

const goals = [
  'Capture inbound calls',
  'Handle missed calls',
  'After-hours coverage',
  'SMS follow-up',
  'Web form follow-up',
  'Live chat backup',
  'Appointment scheduling',
  'Lead qualification',
];

const priorities = [
  'Faster response times',
  'Better lead qualification',
  'Reduced missed opportunities',
  'Improved customer experience',
  'Cost reduction',
  'Scale without hiring',
];

export function GoalsChannels({ data, updateData }: GoalsChannelsProps) {
  const handleGoalChange = (goal: string, checked: boolean) => {
    const newGoals = checked 
      ? [...data.goalsChannels.goals, goal]
      : data.goalsChannels.goals.filter(g => g !== goal);
    
    updateData('goalsChannels', { goals: newGoals });
  };

  const handlePriorityChange = (priority: string, checked: boolean) => {
    const newPriorities = checked 
      ? [...data.goalsChannels.priorities, priority]
      : data.goalsChannels.priorities.filter(p => p !== priority);
    
    updateData('goalsChannels', { priorities: newPriorities });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Goals & Channels</h2>
        <p className="text-muted-foreground">
          Select the areas where you want AI assistance and your top priorities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Label className="text-lg font-semibold">What channels need AI support? *</Label>
          <div className="space-y-3">
            {goals.map((goal) => (
              <div key={goal} className="flex items-center space-x-3">
                <Checkbox
                  checked={data.goalsChannels.goals.includes(goal)}
                  onCheckedChange={(checked) => handleGoalChange(goal, checked as boolean)}
                />
                <Label className="font-normal">{goal}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-semibold">What are your top priorities? *</Label>
          <div className="space-y-3">
            {priorities.map((priority) => (
              <div key={priority} className="flex items-center space-x-3">
                <Checkbox
                  checked={data.goalsChannels.priorities.includes(priority)}
                  onCheckedChange={(checked) => handlePriorityChange(priority, checked as boolean)}
                />
                <Label className="font-normal">{priority}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}