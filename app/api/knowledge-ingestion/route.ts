import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileId = formData.get('fileId') as string;
    const businessId = formData.get('businessId') as string;
    const industry = formData.get('industry') as string;

    if (!file || !fileId) {
      return NextResponse.json(
        { error: 'File and fileId are required' },
        { status: 400 }
      );
    }

    console.log('📄 Processing knowledge file:', { 
      fileName: file.name, 
      fileSize: file.size,
      fileType: file.type,
      fileId,
      businessId,
      industry
    });

    // Simulate file processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Extract text content (simplified simulation)
    const fileContent = await file.text();
    
    // Simulate FAQ extraction
    const faqMatches = fileContent.match(/Q:|Question:|FAQ:/gi) || [];
    const faqCount = faqMatches.length;

    // Simulate intent detection based on industry and content
    const detectedIntents = [];
    
    // Add industry-specific intents
    if (industry === 'real_estate') {
      if (fileContent.toLowerCase().includes('showing') || fileContent.toLowerCase().includes('viewing')) {
        detectedIntents.push('schedule_showing');
      }
      if (fileContent.toLowerCase().includes('offer') || fileContent.toLowerCase().includes('bid')) {
        detectedIntents.push('make_offer');
      }
      if (fileContent.toLowerCase().includes('listing') || fileContent.toLowerCase().includes('property')) {
        detectedIntents.push('property_inquiry');
      }
    } else if (industry === 'dental') {
      if (fileContent.toLowerCase().includes('appointment') || fileContent.toLowerCase().includes('booking')) {
        detectedIntents.push('book_appointment');
      }
      if (fileContent.toLowerCase().includes('emergency') || fileContent.toLowerCase().includes('urgent')) {
        detectedIntents.push('emergency_care');
      }
      if (fileContent.toLowerCase().includes('insurance') || fileContent.toLowerCase().includes('coverage')) {
        detectedIntents.push('insurance_inquiry');
      }
    }

    // Generic intents
    if (fileContent.toLowerCase().includes('price') || fileContent.toLowerCase().includes('cost')) {
      detectedIntents.push('pricing_inquiry');
    }
    if (fileContent.toLowerCase().includes('hour') || fileContent.toLowerCase().includes('schedule')) {
      detectedIntents.push('hours_inquiry');
    }

    const extractedData = {
      textContent: fileContent.substring(0, 1000), // First 1000 chars
      faqCount,
      detectedIntents: [...new Set(detectedIntents)],
      processedAt: new Date().toISOString()
    };

    console.log('✅ File processed successfully:', {
      faqCount,
      detectedIntents: detectedIntents.length,
      contentLength: fileContent.length
    });

    return NextResponse.json({
      success: true,
      extractedData,
      faqCount,
      detectedIntents: [...new Set(detectedIntents)]
    });

  } catch (error: any) {
    console.error('❌ Knowledge ingestion error:', error);
    return NextResponse.json(
      { error: `Failed to process file: ${error.message}` },
      { status: 500 }
    );
  }
}