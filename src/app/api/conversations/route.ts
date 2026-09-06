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
      return NextResponse.json({ conversations: [] });
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ participantAId: user.id }, { participantBId: user.id }],
      },
      orderBy: { lastMessageAt: 'desc' },
      include: {
        participantA: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            city: true,
            state: true,
            reputationScore: true,
            isVerified: true,
          },
        },
        participantB: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            city: true,
            state: true,
            reputationScore: true,
            isVerified: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
            exchangeType: true,
            status: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        _count: {
          select: {
            messages: {
              where: { receiverId: user.id, isRead: false },
            },
          },
        },
      },
    });

    const unreadTotal = conversations.reduce((sum, c) => sum + (c._count?.messages || 0), 0);
    return NextResponse.json({ conversations, unreadTotal });
  } catch (error: any) {
    console.error('Fetch conversations error:', error);
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
        user = await prisma.user.findFirst();
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const body = await req.json();
    const { recipientId, listingId } = body;

    if (!recipientId) {
      return NextResponse.json({ error: 'recipientId is required.' }, { status: 400 });
    }

    if (recipientId === user.id) {
      return NextResponse.json({ error: 'Cannot chat with yourself.' }, { status: 400 });
    }

    // Check if conversation already exists
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { participantAId: user.id, participantBId: recipientId, listingId: listingId || null },
          { participantAId: recipientId, participantBId: user.id, listingId: listingId || null },
          // fallback without listingId match if none exists
          { participantAId: user.id, participantBId: recipientId },
          { participantAId: recipientId, participantBId: user.id },
        ],
      },
      include: {
        participantA: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            city: true,
            state: true,
            reputationScore: true,
            isVerified: true,
          },
        },
        participantB: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            city: true,
            state: true,
            reputationScore: true,
            isVerified: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
            exchangeType: true,
            status: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        _count: {
          select: {
            messages: {
              where: { receiverId: user.id, isRead: false },
            },
          },
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participantAId: user.id,
          participantBId: recipientId,
          listingId: listingId || null,
        },
        include: {
          participantA: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              city: true,
              state: true,
              reputationScore: true,
              isVerified: true,
            },
          },
          participantB: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              city: true,
              state: true,
              reputationScore: true,
              isVerified: true,
            },
          },
          listing: {
            select: {
              id: true,
              title: true,
              price: true,
              images: true,
              exchangeType: true,
              status: true,
            },
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          _count: {
            select: {
              messages: {
                where: { receiverId: user.id, isRead: false },
              },
            },
          },
        },
      });
    }

    return NextResponse.json({ success: true, conversation });
  } catch (error: any) {
    console.error('Create conversation error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error.' }, { status: 500 });
  }
}
