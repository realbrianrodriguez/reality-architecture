import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI } from '@/lib/openai';
import { realityScanSystemPrompt } from '@/utils/prompts';
import { RealityScanResponse } from '@/utils/types';

export async function POST(request: NextRequest) {
  console.log('[REALITY-SCAN API] POST request arrived');
  try {
    const body = await request.json();
    console.log('[REALITY-SCAN API] Request body received:', { hasText: !!body.text, textLength: body.text?.length });
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    console.log('[REALITY-SCAN API] Calling OpenAI...');
    const response = await callOpenAI({
      systemPrompt: realityScanSystemPrompt,
      userContent: text,
    });
    console.log('[REALITY-SCAN API] OpenAI response received:', { responseLength: response.length, responsePreview: response.substring(0, 200) });

    // Parse JSON response
    let parsed: RealityScanResponse;
    try {
      parsed = JSON.parse(response);
      console.log('[REALITY-SCAN API] JSON parsed successfully:', { parsedKeys: Object.keys(parsed) });
    } catch (parseError) {
      console.error('[REALITY-SCAN API] Failed to parse OpenAI response:', parseError);
      console.error('[REALITY-SCAN API] Raw response:', response);
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    // Normalize response: ensure all expected keys exist and are arrays
    const normalized: RealityScanResponse = {
      patterns: Array.isArray(parsed.patterns) ? parsed.patterns : [],
      beliefs: Array.isArray(parsed.beliefs) ? parsed.beliefs : [],
      distortions: Array.isArray(parsed.distortions) ? parsed.distortions : [],
      identityNarratives: Array.isArray(parsed.identityNarratives) ? parsed.identityNarratives : [],
      reframes: Array.isArray(parsed.reframes) ? parsed.reframes : [],
      newAssumptions: Array.isArray(parsed.newAssumptions) ? parsed.newAssumptions : [],
    };

    // Validate required fields exist (even if empty arrays - that's valid)
    if (
      !('patterns' in parsed) ||
      !('beliefs' in parsed) ||
      !('distortions' in parsed) ||
      !('identityNarratives' in parsed) ||
      !('reframes' in parsed) ||
      !('newAssumptions' in parsed)
    ) {
      console.error('[REALITY-SCAN API] Missing required fields in response. Raw response:', response);
      return NextResponse.json(
        { error: 'Missing required fields in response' },
        { status: 500 }
      );
    }

    console.log('[REALITY-SCAN API] Returning normalized response');
    return NextResponse.json(normalized);
  } catch (error) {
    console.error('[REALITY-SCAN API] Error caught:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
