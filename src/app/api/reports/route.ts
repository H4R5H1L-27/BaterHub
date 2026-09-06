import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { resolveUser } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const user = await resolveUser(req);
    if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

    const { listingId, reportedUserId, reason, details } = await req.json();
    if (!reason) return NextResponse.json({ error: 'Reason is required.' }, { status: 400 });

    let targetUserId = reportedUserId as string | undefined;
    if (!targetUserId && listingId) {
      const listing = await prisma.listing.findUnique({ where: { id: listingId } });
      targetUserId = listing?.userId;
    }
    if (!targetUserId) {
      return NextResponse.json({ error: 'Target user or listing required.' }, { status: 400 });
    }

    const report = await prisma.report.create({
      data: {
        reporterId: user.id,
        reportedUserId: targetUserId,
        listingId: listingId || null,
        reason,
        details: details || null,
      },
    });

    return NextResponse.json({ success: true, report }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
