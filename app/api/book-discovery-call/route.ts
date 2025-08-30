import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessProfile, simulationResults, contactInfo, roiProjections } = body;

    console.log('📞 Discovery call booking request:', {
      businessName: businessProfile.name,
      contactName: contactInfo.name,
      contactEmail: contactInfo.email,
      contactPhone: contactInfo.phone,
      projectedROI: roiProjections.netROI
    });

    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real implementation, you would:
    // 1. Create calendar event
    // 2. Send confirmation emails
    // 3. Add to CRM
    // 4. Trigger follow-up sequences
    // 5. Notify sales team

    const bookingId = `HLO-${Date.now().toString().slice(-8)}`;
    const calendarUrl = `https://calendly.com/halo-ai/discovery-call?prefill_name=${encodeURIComponent(contactInfo.name)}&prefill_email=${encodeURIComponent(contactInfo.email)}`;

    console.log('✅ Discovery call booked:', {
      bookingId,
      scheduledFor: 'Next available slot',
      notificationsSent: true
    });

    // Simulate sending confirmation email
    const confirmationData = {
      bookingId,
      businessName: businessProfile.name,
      contactName: contactInfo.name,
      contactEmail: contactInfo.email,
      contactPhone: contactInfo.phone,
      simulationScore: Math.round((simulationResults.metrics.responseTime + 
                                   simulationResults.metrics.intentAccuracy + 
                                   simulationResults.metrics.satisfactionScore) / 3),
      projectedMonthlyIncrease: roiProjections.monthlyIncrease,
      bookedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      bookingId,
      calendarUrl,
      message: 'Discovery call booked successfully!',
      confirmationSent: true,
      nextSteps: [
        'Check your email for calendar invite',
        'Prepare questions about your business goals',
        'Have your current lead numbers ready',
        'Consider which team members should join'
      ]
    });

  } catch (error: any) {
    console.error('❌ Discovery call booking error:', error);
    return NextResponse.json(
      { error: `Failed to book discovery call: ${error.message}` },
      { status: 500 }
    );
  }
}