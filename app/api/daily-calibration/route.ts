import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI } from '@/lib/openai';
import { dailyCalibrationSystemPrompt } from '@/utils/prompts';
import { DailyCalibrationResponse } from '@/utils/types';
import { enforceGuardrails } from '@/utils/guardrails';

export async function POST(request: NextRequest) {
  console.log('[DAILY-CALIBRATION API] POST request arrived');
  
  // Apply rate limiting
  const guardrail = enforceGuardrails(request, {
    windowMs: 60_000,
    maxRequests: 20,
    cooldownMs: 2_500,
  });
  if (!guardrail.ok) {
    return NextResponse.json(
      { error: guardrail.error },
      { status: guardrail.status }
    );
  }

  try {
    // Empty body is fine for daily calibration
    console.log('[DAILY-CALIBRATION API] Calling OpenAI...');
    const response = await callOpenAI({
      systemPrompt: dailyCalibrationSystemPrompt,
      userContent: 'Generate today\'s calibration.',
    });
    console.log('[DAILY-CALIBRATION API] OpenAI response received:', { responseLength: response.length, responsePreview: response.substring(0, 200) });
    
    let parsed: any;
    try {
      parsed = JSON.parse(response);
      console.log('[DAILY-CALIBRATION API] JSON parsed successfully:', { parsedKeys: Object.keys(parsed) });
    } catch (parseError) {
      console.error('[DAILY-CALIBRATION API] Failed to parse OpenAI response:', parseError);
      console.error('[DAILY-CALIBRATION API] Raw response:', response);
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    // Normalize response: ensure all expected keys exist with safe defaults
    const normalized: DailyCalibrationResponse = {
      identityStatement: typeof parsed.identityStatement === 'string' ? parsed.identityStatement : '',
      recommendedAction: typeof parsed.recommendedAction === 'string' ? parsed.recommendedAction : '',
    };

    // Check if all fields are empty - this indicates a model failure
    const allEmpty = 
      !normalized.identityStatement &&
      !normalized.recommendedAction;

    if (allEmpty) {
      console.error('[DAILY-CALIBRATION API] Model returned empty output. Raw response:', response);
      return NextResponse.json(
        { error: 'Model returned empty output' },
        { status: 500 }
      );
    }

    console.log('[DAILY-CALIBRATION API] Returning normalized response');
    return NextResponse.json(normalized);
  } catch (error) {
    console.error('[DAILY-CALIBRATION API] Error caught:', error);
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

