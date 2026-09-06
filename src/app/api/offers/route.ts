import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { notify } from '@/lib/session';
import { MessageType } from '@prisma/client';

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
      return NextResponse.json({ sentOffers: [], receivedOffers: [] });
    }

    const [sentOffers, receivedOffers] = await Promise.all([
      prisma.cashOffer.findMany({
        where: { buyerId: user.id },
        orderBy: { createdAt: 'desc' },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              price: true,
              images: true,
              status: true,
            },
          },
          seller: {
            select: {
              id: true,
              name: true,
              avatar: true,
              city: true,
              state: true,
              reputationScore: true,
              isVerified: true,
            },
          },
          buyer: {
            select: {
              id: true,
              name: true,
              avatar: true,
              isVerified: true,
            },
          },
        },
      }),
      prisma.cashOffer.findMany({
        where: { sellerId: user.id },
        orderBy: { createdAt: 'desc' },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              price: true,
              images: true,
              status: true,
            },
          },
          buyer: {
            select: {
              id: true,
              name: true,
              avatar: true,
              city: true,
              state: true,
              reputationScore: true,
              isVerified: true,
            },
          },
          seller: {
            select: {
              id: true,
              name: true,
              avatar: true,
              isVerified: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({ sentOffers, receivedOffers });
  } catch (error: any) {
    console.error('Fetch offers error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let user = await getUserFromRequest(req);
    if (!user) {
      const demoEmail = req.headers.get('x-demo-user');
      if (demoEmail) {
        user = await prisma.user.findUnique({ where: { email: demoEmail } });
      }
      if (!user) {
        // Fallback to second user so they are buying from first
        const users = await prisma.user.findMany({ take: 2 });
        user = users.length > 1 ? users[1] : users[0];
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const { listingId, sellerId, offerAmount, message } = await req.json();

    if (!listingId || !sellerId || !offerAmount) {
      return NextResponse.json({ error: 'Missing required offer fields.' }, { status: 400 });
    }

    if (user.id === sellerId) {
      return NextResponse.json({ error: 'You cannot make an offer on your own listing.' }, { status: 400 });
    }

    // 1. Create or find existing conversation between buyer and seller for this listing
    let conversation = await prisma.conversation.findFirst({
      where: {
        listingId,
        OR: [
          { participantAId: user.id, participantBId: sellerId },
          { participantAId: sellerId, participantBId: user.id },
        ],
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participantAId: user.id,
          participantBId: sellerId,
          listingId,
          lastMessageAt: new Date(),
        },
      });
    } else {
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: new Date() },
      });
    }

    // 2. Create CashOffer
    const offer = await prisma.cashOffer.create({
      data: {
        listingId,
        buyerId: user.id,
        sellerId,
        offerAmount: parseFloat(offerAmount),
        message: message || null,
        conversationId: conversation.id,
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48-hour expiration
      },
      include: {
        listing: true,
        buyer: true,
        seller: true,
      },
    });

    // 3. Post Action Card message in conversation
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: user.id,
        receiverId: sellerId,
        content: message || `Sent a cash offer of $${offerAmount}.`,
        messageType: MessageType.CASH_OFFER_CARD,
        metadata: JSON.stringify({
          offerId: offer.id,
          amount: parseFloat(offerAmount),
          status: 'PENDING',
        }),
      },
    });

    await notify({
      userId: sellerId,
      type: 'OFFER',
      title: 'New cash offer',
      body: `${user.name} offered $${offerAmount} on ${offer.listing.title}`,
      href: '/offers',
      listingId,
    });

    return NextResponse.json({ success: true, offer }, { status: 201 });
  } catch (error: any) {
    console.error('Create offer error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit offer.' }, { status: 500 });
  }
}
