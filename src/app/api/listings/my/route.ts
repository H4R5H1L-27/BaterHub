import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    let user = await getUserFromRequest(req);
    if (!user) {
      const demoEmail = req.headers.get('x-demo-user');
      if (demoEmail) {
        user = await prisma.user.findUnique({ where: { email: demoEmail } });
      }
      if (!user) {
        user = await prisma.user.findFirst();
      }
    }

    if (!user) {
      return NextResponse.json({ listings: [] });
    }

    const listings = await prisma.listing.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        bookDetails: true,
        productDetails: true,
        _count: {
          select: {
            cashOffers: true,
            barterProposalsAsTarget: true,
          },
        },
      },
    });

    return NextResponse.json({ listings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
