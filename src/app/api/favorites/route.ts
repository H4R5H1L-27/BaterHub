import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { resolveUser } from '@/lib/session';

export async function GET(req: NextRequest) {
  try {
    const user = await resolveUser(req);
    if (!user) return NextResponse.json({ listings: [] });

    const saved = await prisma.savedListing.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        listing: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                city: true,
                state: true,
                reputationScore: true,
                totalReviews: true,
                totalTrades: true,
                isVerified: true,
              },
            },
            bookDetails: true,
            productDetails: true,
          },
        },
      },
    });

    return NextResponse.json({
      listings: saved.map((row) => ({ ...row.listing, isSaved: true })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await resolveUser(req);
    if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

    const { listingId } = await req.json();
    if (!listingId) return NextResponse.json({ error: 'listingId required.' }, { status: 400 });

    const saved = await prisma.savedListing.upsert({
      where: { userId_listingId: { userId: user.id, listingId } },
      update: {},
      create: { userId: user.id, listingId },
    });

    return NextResponse.json({ success: true, saved: true, id: saved.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await resolveUser(req);
    if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

    const listingId = new URL(req.url).searchParams.get('listingId');
    if (!listingId) return NextResponse.json({ error: 'listingId required.' }, { status: 400 });

    await prisma.savedListing.deleteMany({
      where: { userId: user.id, listingId },
    });

    return NextResponse.json({ success: true, saved: false });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
