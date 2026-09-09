import { NextRequest } from 'next/server';
import prisma from './prisma';
import { getUserFromRequest } from './auth';

export async function resolveUser(req: NextRequest) {
  let user = await getUserFromRequest(req);
  if (!user) {
    const demoEmail = req.headers.get('x-demo-user');
    if (demoEmail) {
      user = await prisma.user.findUnique({
        where: { email: demoEmail },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          role: true,
          city: true,
          state: true,
          reputationScore: true,
          totalReviews: true,
          totalTrades: true,
          isVerified: true,
        },
      });
    }
  }
  return user;
}

export async function notify(params: {
  userId: string;
  type: 'OFFER' | 'BARTER' | 'MESSAGE' | 'PRICE_DROP' | 'SYSTEM';
  title: string;
  body: string;
  href?: string;
  listingId?: string;
}) {
  try {
    await prisma.notification.create({ data: params });
  } catch (error) {
    console.error('Notification create failed:', error);
  }
}
