import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data', 'onboarding-submissions');
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }

    // Prepare submission data
    const submission = {
      ...body,
      timestamp: new Date().toISOString(),
      id: `onboarding_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'submitted',
    };

    // Write to individual file
    const fileName = `${submission.id}.json`;
    const filePath = path.join(dataDir, fileName);
    await writeFile(filePath, JSON.stringify(submission, null, 2));

    // Here you would typically:
    // 1. Send email notification to sales team
    // 2. Create CRM record
    // 3. Send confirmation email to customer
    // 4. Add to onboarding queue
    
    console.log('New onboarding submission:', submission.id);

    return NextResponse.json({ 
      success: true, 
      message: 'Onboarding submission received successfully',
      id: submission.id 
    });

  } catch (error) {
    console.error('Onboarding submission error:', error);
    
    return NextResponse.json(
      { error: 'Failed to submit onboarding request' },
      { status: 500 }
    );
  }
}