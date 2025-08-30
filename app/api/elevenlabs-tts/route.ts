import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId = 'pNInz6obpgDQGcFmaJgB' } = await request.json(); // Default to Adam voice

    console.log('🎤 ElevenLabs TTS API called with:', { 
      textLength: text?.length, 
      voiceId, 
      hasApiKey: !!process.env.ELEVENLABS_API_KEY 
    });

    if (!text) {
      console.error('❌ No text provided to TTS API');
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      console.error('❌ ElevenLabs API key is not configured');
      return NextResponse.json(
        { error: 'ElevenLabs API key is not configured' },
        { status: 500 }
      );
    }

    console.log('🔄 Generating TTS for text:', text.substring(0, 50), '... (length:', text.length, ')');

    // Make direct API call to ElevenLabs
    const elevenLabsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY!,
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.0,
          use_speaker_boost: true
        }
      }),
    });

    console.log('📡 ElevenLabs API response status:', elevenLabsResponse.status);

    if (!elevenLabsResponse.ok) {
      const errorText = await elevenLabsResponse.text();
      console.error('❌ ElevenLabs API error response:', errorText);
      return NextResponse.json(
        { error: `ElevenLabs API error: ${elevenLabsResponse.statusText}` },
        { status: elevenLabsResponse.status }
      );
    }

    console.log('✅ ElevenLabs response received, streaming audio...');
    
    // Get the audio data as an array buffer
    const audioBuffer = await elevenLabsResponse.arrayBuffer();
    console.log('🎵 Audio buffer size:', audioBuffer.byteLength, 'bytes');

    // Return the audio as a response
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });

  } catch (error: any) {
    console.error('❌ ElevenLabs API error:', {
      error: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { error: `Failed to generate speech: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}