import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
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
    }

    if (!user) {
      return NextResponse.json({ sentBarters: [], receivedBarters: [] });
    }

    const [sentBarters, receivedBarters] = await Promise.all([
      prisma.barterProposal.findMany({
        where: { initiatorId: user.id },
        orderBy: { createdAt: 'desc' },
        include: {
          targetListing: {
            select: {
              id: true,
              title: true,
              images: true,
              price: true,
              status: true,
              condition: true,
            },
          },
          recipient: {
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
          initiator: {
            select: {
              id: true,
              name: true,
              avatar: true,
              isVerified: true,
            },
          },
          offeredItems: {
            include: {
              listing: {
                select: {
                  id: true,
                  title: true,
                  images: true,
                  price: true,
                  condition: true,
                },
              },
            },
          },
        },
      }),
      prisma.barterProposal.findMany({
        where: { recipientId: user.id },
        orderBy: { createdAt: 'desc' },
        include: {
          targetListing: {
            select: {
              id: true,
              title: true,
              images: true,
              price: true,
              status: true,
              condition: true,
            },
          },
          initiator: {
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
          recipient: {
            select: {
              id: true,
              name: true,
              avatar: true,
              isVerified: true,
            },
          },
          offeredItems: {
            include: {
              listing: {
                select: {
                  id: true,
                  title: true,
                  images: true,
                  price: true,
                  condition: true,
                },
              },
            },
          },
        },
      }),
    ]);

    return NextResponse.json({ sentBarters, receivedBarters });
  } catch (error: any) {
    console.error('Fetch barters error:', error);
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
    }

    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const { targetListingId, recipientId, offeredListingIds, cashTopUp, notes } = await req.json();

    if (!targetListingId || !recipientId || !offeredListingIds || !Array.isArray(offeredListingIds) || offeredListingIds.length === 0) {
      return NextResponse.json({ error: 'Please select at least one item to offer in barter.' }, { status: 400 });
    }

    if (user.id === recipientId) {
      return NextResponse.json({ error: 'You cannot propose a trade on your own listing.' }, { status: 400 });
    }

    // 1. Find or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        listingId: targetListingId,
        OR: [
          { participantAId: user.id, participantBId: recipientId },
          { participantAId: recipientId, participantBId: user.id },
        ],
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participantAId: user.id,
          participantBId: recipientId,
          listingId: targetListingId,
          lastMessageAt: new Date(),
        },
      });
    } else {
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: new Date() },
      });
    }

    // 2. Create BarterProposal
    const proposal = await prisma.barterProposal.create({
      data: {
        initiatorId: user.id,
        recipientId,
        targetListingId,
        cashTopUp: parseFloat(cashTopUp) || 0,
        notes: notes || null,
        conversationId: conversation.id,
        offeredItems: {
          create: offeredListingIds.map((listingId: string) => ({
            listingId,
          })),
        },
      },
      include: {
        targetListing: true,
        offeredItems: {
          include: { listing: true },
        },
        initiator: true,
        recipient: true,
      },
    });

    // 3. Create message action card in conversation
    const offeredTitles = proposal.offeredItems.map((i) => i.listing.title);
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: user.id,
        receiverId: recipientId,
        content: notes || `Proposed barter swap with ${offeredTitles.length} item(s).`,
        messageType: MessageType.BARTER_PROPOSAL_CARD,
        metadata: JSON.stringify({
          barterId: proposal.id,
          offeredItemTitles: offeredTitles,
          cashTopUp: proposal.cashTopUp,
          status: 'PROPOSED',
        }),
      },
    });

    return NextResponse.json({ success: true, proposal }, { status: 201 });
  } catch (error: any) {
    console.error('Create barter proposal error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit trade proposal.' }, { status: 500 });
  }
}
