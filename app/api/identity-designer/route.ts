import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI } from '@/lib/openai';
import { identityDesignerSystemPrompt } from '@/utils/prompts';
import { IdentityDesignerResponse } from '@/utils/types';

export async function POST(request: NextRequest) {
  console.log('[IDENTITY-DESIGNER API] POST request arrived');
  try {
    const body = await request.json();
    console.log('[IDENTITY-DESIGNER API] Request body received:', { hasOldAssumption: !!body.oldAssumption, oldAssumptionLength: body.oldAssumption?.length });
    const { oldAssumption } = body;

    if (!oldAssumption || typeof oldAssumption !== 'string') {
      return NextResponse.json(
        { error: 'oldAssumption is required' },
        { status: 400 }
      );
    }

    console.log('[IDENTITY-DESIGNER API] Calling OpenAI...');
    const response = await callOpenAI({
      systemPrompt: identityDesignerSystemPrompt,
      userContent: oldAssumption,
    });
    console.log('[IDENTITY-DESIGNER API] OpenAI response received:', { responseLength: response.length, responsePreview: response.substring(0, 200) });
    
    let parsed: any;
    try {
      parsed = JSON.parse(response);
      console.log('[IDENTITY-DESIGNER API] JSON parsed successfully:', { parsedKeys: Object.keys(parsed) });
    } catch (parseError) {
      console.error('[IDENTITY-DESIGNER API] Failed to parse OpenAI response:', parseError);
      console.error('[IDENTITY-DESIGNER API] Raw response:', response);
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    // Normalize response: ensure all expected keys exist with safe defaults
    const normalized: IdentityDesignerResponse = {
      reframedAssumption: typeof parsed.reframedAssumption === 'string' ? parsed.reframedAssumption : '',
      identityShift: typeof parsed.identityShift === 'string' ? parsed.identityShift : '',
      anchors: Array.isArray(parsed.anchors) ? parsed.anchors : [],
      narrativeUpgrade: typeof parsed.narrativeUpgrade === 'string' ? parsed.narrativeUpgrade : '',
    };

    // Validate required fields exist (even if empty - that's valid for vague inputs)
    if (
      !('reframedAssumption' in parsed) ||
      !('identityShift' in parsed) ||
      !('anchors' in parsed) ||
      !('narrativeUpgrade' in parsed)
    ) {
      console.error('[IDENTITY-DESIGNER API] Missing required fields in response. Raw response:', response);
      return NextResponse.json(
        { error: 'Missing required fields in response' },
        { status: 500 }
      );
    }

    console.log('[IDENTITY-DESIGNER API] Returning normalized response');
    return NextResponse.json(normalized);
  } catch (error) {
    console.error('[IDENTITY-DESIGNER API] Error caught:', error);
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

