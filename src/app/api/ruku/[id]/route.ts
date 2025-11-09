import { NextResponse } from 'next/server';
import { getRukuData } from '@/utils/quranApi';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const rukuId = parseInt(params.id);
    if (isNaN(rukuId) || rukuId < 1 || rukuId > 556) {
      return NextResponse.json(
        { error: 'Invalid Ruku ID' },
        { status: 400 }
      );
    }

    const rukuData = await getRukuData(rukuId);
    if (!rukuData) {
      return NextResponse.json(
        { error: 'Ruku not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(rukuData);
  } catch (error) {
    console.error('Error fetching Ruku data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}