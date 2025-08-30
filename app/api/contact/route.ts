import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import * as z from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().min(1, 'Company name is required'),
  phone: z.string().optional(),
  services: z.array(z.string()).min(1, 'Please select at least one service'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data');
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }

    // Prepare submission data
    const submission = {
      ...validatedData,
      timestamp: new Date().toISOString(),
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    // Read existing leads or create new array
    const leadsFile = path.join(dataDir, 'leads.json');
    let leads = [];
    
    if (existsSync(leadsFile)) {
      try {
        const existingData = await readFile(leadsFile, 'utf-8');
        leads = JSON.parse(existingData);
      } catch (error) {
        console.error('Error reading existing leads:', error);
        leads = [];
      }
    }

    // Add new submission
    leads.push(submission);

    // Write back to file
    await writeFile(leadsFile, JSON.stringify(leads, null, 2));

    // Here you would typically:
    // 1. Send email notification
    // 2. Send to Slack webhook
    // 3. Add to CRM
    
    console.log('New contact submission:', submission.id);

    return NextResponse.json({ 
      success: true, 
      message: 'Contact form submitted successfully',
      id: submission.id 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}