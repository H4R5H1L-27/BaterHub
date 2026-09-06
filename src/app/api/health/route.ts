import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check database connectivity
    const userCount = await prisma.user.count();
    const listingCount = await prisma.listing.count();

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      metrics: {
        totalUsers: userCount,
        totalListings: listingCount,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'degraded',
        timestamp: new Date().toISOString(),
        database: 'unreachable',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
