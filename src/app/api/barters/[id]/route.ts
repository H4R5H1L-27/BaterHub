import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { MessageType, BarterStatus, ListingStatus } from '@prisma/client';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { action } = await req.json();

    const proposal = await prisma.barterProposal.findUnique({
      where: { id },
      include: {
        targetListing: true,
        offeredItems: { include: { listing: true } },
        initiator: true,
        recipient: true,
      },
    });

    if (!proposal) {
      return NextResponse.json({ error: 'Barter proposal not found.' }, { status: 404 });
    }

    let newStatus: BarterStatus = proposal.status;
    let exchangeCode = proposal.exchangeCode;

    if (action === 'ACCEPT') {
      newStatus = 'ACCEPTED';
      // Generate a 6-character random meetup verification token e.g. TRD-8421
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      exchangeCode = `TRD-${randomCode}`;

      // Mark target listing and offered listings as PENDING_EXCHANGE
      await prisma.listing.update({
        where: { id: proposal.targetListingId },
        data: { status: ListingStatus.PENDING_EXCHANGE },
      });

      for (const item of proposal.offeredItems) {
        await prisma.listing.update({
          where: { id: item.listingId },
          data: { status: ListingStatus.PENDING_EXCHANGE },
        });
      }
    } else if (action === 'REJECT') {
      newStatus = 'REJECTED';
    } else if (action === 'CANCEL') {
      newStatus = 'CANCELLED';
    } else if (action === 'COMPLETE') {
      newStatus = 'COMPLETED';

      // Mark listings as TRADED
      await prisma.listing.update({
        where: { id: proposal.targetListingId },
        data: { status: ListingStatus.TRADED },
      });

      for (const item of proposal.offeredItems) {
        await prisma.listing.update({
          where: { id: item.listingId },
          data: { status: ListingStatus.TRADED },
        });
      }

      // Increment completed trade counts for both users
      await prisma.user.update({
        where: { id: proposal.initiatorId },
        data: { totalTrades: { increment: 1 } },
      });
      await prisma.user.update({
        where: { id: proposal.recipientId },
        data: { totalTrades: { increment: 1 } },
      });
    }

    const updatedProposal = await prisma.barterProposal.update({
      where: { id },
      data: {
        status: newStatus,
        exchangeCode,
      },
      include: {
        targetListing: true,
        offeredItems: { include: { listing: true } },
        initiator: true,
        recipient: true,
      },
    });

    // Notify in conversation
    if (proposal.conversationId) {
      let contentText = `Barter proposal status updated to ${newStatus}.`;
      if (newStatus === 'ACCEPTED') {
        contentText = `🎉 Barter proposal accepted! Meetup Verification Code: ${exchangeCode}. Exchange both items safely!`;
      } else if (newStatus === 'COMPLETED') {
        contentText = `✨ Exchange confirmed completed! Both parties can now leave a verified review.`;
      }

      await prisma.message.create({
        data: {
          conversationId: proposal.conversationId,
          senderId: proposal.recipientId,
          receiverId: proposal.initiatorId,
          content: contentText,
          messageType: MessageType.BARTER_PROPOSAL_CARD,
          metadata: JSON.stringify({
            barterId: proposal.id,
            status: newStatus,
            exchangeCode,
          }),
        },
      });
    }

    return NextResponse.json({ success: true, proposal: updatedProposal });
  } catch (error: any) {
    console.error('Update barter error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error.' }, { status: 500 });
  }
}
