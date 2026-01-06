import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI } from '@/lib/openai';
import { weeklyReviewSystemPrompt } from '@/utils/prompts';
import { enforceGuardrails } from '@/utils/guardrails';

interface WeeklyReviewResponse {
  weeklyTheme: string;
  observedPatterns: string[];
  nextWeekOrientation: string;
}

export async function POST(request: NextRequest) {
  console.log('[WEEKLY-REVIEW API] POST request arrived');
  
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
    const body = await request.json();
    console.log('[WEEKLY-REVIEW API] Request body received:', { hasWeekSummary: !!body.weekSummary, weekSummaryLength: body.weekSummary?.length });
    const { weekSummary } = body;

    if (!weekSummary || typeof weekSummary !== 'string' || weekSummary.trim() === '') {
      return NextResponse.json(
        { error: 'Week summary is required.' },
        { status: 400 }
      );
    }

    console.log('[WEEKLY-REVIEW API] Calling OpenAI...');
    const response = await callOpenAI({
      systemPrompt: weeklyReviewSystemPrompt,
      userContent: weekSummary,
    });
    console.log('[WEEKLY-REVIEW API] OpenAI response received:', { responseLength: response.length, responsePreview: response.substring(0, 200) });
    
    let parsed: any;
    try {
      parsed = JSON.parse(response);
      console.log('[WEEKLY-REVIEW API] JSON parsed successfully:', { parsedKeys: Object.keys(parsed) });
    } catch (parseError) {
      console.error('[WEEKLY-REVIEW API] Failed to parse OpenAI response:', parseError);
      console.error('[WEEKLY-REVIEW API] Raw response:', response);
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    // Normalize response: ensure all expected keys exist with safe defaults
    const normalized: WeeklyReviewResponse = {
      weeklyTheme: typeof parsed.weeklyTheme === 'string' ? parsed.weeklyTheme : '',
      observedPatterns: Array.isArray(parsed.observedPatterns) ? parsed.observedPatterns : [],
      nextWeekOrientation: typeof parsed.nextWeekOrientation === 'string' ? parsed.nextWeekOrientation : '',
    };

    console.log('[WEEKLY-REVIEW API] Returning normalized response');
    return NextResponse.json(normalized);
  } catch (error) {
    console.error('[WEEKLY-REVIEW API] Error caught:', error);
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

