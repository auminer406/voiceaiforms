import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/submissions?formId=xxx
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const formId = searchParams.get('formId');

    if (!formId) {
      return NextResponse.json(
        { error: 'formId is required' },
        { status: 400 }
      );
    }

    const submissions = await db.getSubmissions(formId);
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('GET /api/submissions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
