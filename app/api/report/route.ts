import { NextResponse } from 'next/server';

export async function GET() {
  // Placeholder for simple budget aggregates
  return NextResponse.json({ totals: { daily: 0, weekly: 0, monthly: 0 } });
}

