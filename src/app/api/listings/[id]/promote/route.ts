import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { resolveUser } from '@/lib/session';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.listing.update({
    where: { id: params.id },
    data: { sharesCount: { increment: 1 } },
  }).catch(() => {});

  return NextResponse.json({ success: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await resolveUser(req);
    if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

    const listing = await prisma.listing.findUnique({ where: { id: params.id } });
    if (!listing) return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
    if (listing.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const body = await req.json();
    const data: Record<string, unknown> = {};

    if (body.promote === 'FEATURED') {
      data.isFeatured = true;
      data.featuredUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
    if (body.promote === 'URGENT') {
      data.isUrgent = true;
      data.urgentUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
    if (body.promote === 'TOP') {
      data.isTopAd = true;
      data.topUntil = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    }

    if (typeof body.price === 'number' || typeof body.price === 'string') {
      const nextPrice = parseFloat(body.price);
      if (!Number.isNaN(nextPrice) && listing.price !== nextPrice) {
        data.previousPrice = listing.price;
        data.price = nextPrice;
        await prisma.priceHistory.create({
          data: { listingId: listing.id, price: listing.price ?? nextPrice },
        });
      }
    }

    const updated = await prisma.listing.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json({ success: true, listing: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
