import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { notify } from '@/lib/session';
import { MessageType } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId is required.' }, { status: 400 });
    }

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

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || (conversation.participantAId !== user.id && conversation.participantBId !== user.id)) {
      return NextResponse.json({ error: 'Conversation not found or unauthorized.' }, { status: 404 });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({ messages });
  } catch (error: any) {
    console.error('Fetch messages error:', error);
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

    const { conversationId, content, messageType, metadata } = await req.json();

    if (!conversationId || !content) {
      return NextResponse.json({ error: 'conversationId and content are required.' }, { status: 400 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
    }

    const receiverId =
      conversation.participantAId === user.id
        ? conversation.participantBId
        : conversation.participantAId;

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: user.id,
        receiverId,
        content: content.trim(),
        messageType: (messageType as MessageType) || MessageType.TEXT,
        metadata: metadata ? (typeof metadata === 'string' ? metadata : JSON.stringify(metadata)) : null,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    await notify({
      userId: receiverId,
      type: 'MESSAGE',
      title: 'New message',
      body: content.trim().slice(0, 140),
      href: '/messages',
      listingId: conversation.listingId || undefined,
    });

    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (error: any) {
    console.error('Send message error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send message.' }, { status: 500 });
  }
}
