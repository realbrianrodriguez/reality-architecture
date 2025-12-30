import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI } from '@/lib/openai';
import { simulationSystemPrompt } from '@/utils/prompts';
import { SimulationResponse } from '@/utils/types';

export async function POST(request: NextRequest) {
  console.log('[SIMULATION API] POST request arrived');
  try {
    const body = await request.json();
    console.log('[SIMULATION API] Request body received:', { hasScenario: !!body.scenario, scenarioLength: body.scenario?.length });
    const { scenario } = body;

    if (!scenario || typeof scenario !== 'string') {
      return NextResponse.json(
        { error: 'scenario is required' },
        { status: 400 }
      );
    }

    console.log('[SIMULATION API] Calling OpenAI...');
    const response = await callOpenAI({
      systemPrompt: simulationSystemPrompt,
      userContent: scenario,
    });
    console.log('[SIMULATION API] OpenAI response received:', { responseLength: response.length, responsePreview: response.substring(0, 200) });
    
    let parsed: any;
    try {
      parsed = JSON.parse(response);
      console.log('[SIMULATION API] JSON parsed successfully:', { parsedKeys: Object.keys(parsed) });
    } catch (parseError) {
      console.error('[SIMULATION API] Failed to parse OpenAI response:', parseError);
      console.error('[SIMULATION API] Raw response:', response);
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    // Normalize response: ensure all expected keys exist with safe defaults
    const normalized: SimulationResponse = {
      pathA: {
        summary: typeof parsed.pathA?.summary === 'string' ? parsed.pathA.summary : '',
        steps: Array.isArray(parsed.pathA?.steps) ? parsed.pathA.steps : [],
      },
      pathB: {
        summary: typeof parsed.pathB?.summary === 'string' ? parsed.pathB.summary : '',
        steps: Array.isArray(parsed.pathB?.steps) ? parsed.pathB.steps : [],
      },
      delta: {
        behaviorChanges: Array.isArray(parsed.delta?.behaviorChanges) ? parsed.delta.behaviorChanges : [],
        outcomeDifferences: Array.isArray(parsed.delta?.outcomeDifferences) ? parsed.delta.outcomeDifferences : [],
        identityImpact: Array.isArray(parsed.delta?.identityImpact) ? parsed.delta.identityImpact : [],
      },
    };

    // Validate required fields exist (even if empty - that's valid for vague inputs)
    if (
      !parsed.pathA ||
      !('summary' in parsed.pathA) ||
      !('steps' in parsed.pathA) ||
      !parsed.pathB ||
      !('summary' in parsed.pathB) ||
      !('steps' in parsed.pathB) ||
      !parsed.delta ||
      !('behaviorChanges' in parsed.delta) ||
      !('outcomeDifferences' in parsed.delta) ||
      !('identityImpact' in parsed.delta)
    ) {
      console.error('[SIMULATION API] Missing required fields in response. Raw response:', response);
      return NextResponse.json(
        { error: 'Missing required fields in response' },
        { status: 500 }
      );
    }

    console.log('[SIMULATION API] Returning normalized response');
    return NextResponse.json(normalized);
  } catch (error) {
    console.error('[SIMULATION API] Error caught:', error);
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

