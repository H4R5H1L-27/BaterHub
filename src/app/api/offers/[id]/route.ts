import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { MessageType, OfferStatus, ListingStatus } from '@prisma/client';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { action, counterAmount } = await req.json();

    const offer = await prisma.cashOffer.findUnique({
      where: { id },
      include: { listing: true, buyer: true, seller: true },
    });

    if (!offer) {
      return NextResponse.json({ error: 'Offer not found.' }, { status: 404 });
    }

    let newStatus: OfferStatus = offer.status;
    let updatedCounter: number | null = offer.counterAmount;

    if (action === 'ACCEPT') {
      newStatus = 'ACCEPTED';
      // Mark listing as RESERVED
      await prisma.listing.update({
        where: { id: offer.listingId },
        data: { status: ListingStatus.RESERVED },
      });
    } else if (action === 'COUNTER') {
      if (!counterAmount || counterAmount <= 0) {
        return NextResponse.json({ error: 'Valid counter amount required.' }, { status: 400 });
      }
      newStatus = 'COUNTERED';
      updatedCounter = parseFloat(counterAmount);
    } else if (action === 'DECLINE') {
      newStatus = 'DECLINED';
    } else if (action === 'CANCEL') {
      newStatus = 'CANCELLED';
    } else if (action === 'COMPLETE') {
      newStatus = 'COMPLETED';
      await prisma.listing.update({
        where: { id: offer.listingId },
        data: { status: ListingStatus.SOLD },
      });
      // Increment sales/purchases
      await prisma.user.update({
        where: { id: offer.sellerId },
        data: { totalSales: { increment: 1 } },
      });
    }

    const updatedOffer = await prisma.cashOffer.update({
      where: { id },
      data: {
        status: newStatus,
        counterAmount: updatedCounter,
      },
      include: { listing: true, buyer: true, seller: true },
    });

    // Notify in conversation if conversation exists
    if (offer.conversationId) {
      let contentText = `Cash offer status updated to ${newStatus}.`;
      if (newStatus === 'COUNTERED' && updatedCounter) {
        contentText = `Counter-offer proposed: $${updatedCounter}.`;
      } else if (newStatus === 'ACCEPTED') {
        contentText = `Offer accepted for $${offer.counterAmount || offer.offerAmount}! Item is now reserved.`;
      }

      await prisma.message.create({
        data: {
          conversationId: offer.conversationId,
          senderId: offer.sellerId,
          receiverId: offer.buyerId,
          content: contentText,
          messageType: MessageType.CASH_OFFER_CARD,
          metadata: JSON.stringify({
            offerId: offer.id,
            amount: offer.offerAmount,
            counterAmount: updatedCounter,
            status: newStatus,
          }),
        },
      });
    }

    return NextResponse.json({ success: true, offer: updatedOffer });
  } catch (error: any) {
    console.error('Update offer error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error.' }, { status: 500 });
  }
}
