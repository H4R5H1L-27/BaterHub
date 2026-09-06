import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import {
  ListingType,
  ExchangeType,
  ItemCondition,
  ListingStatus,
  BookFormat,
  OfferStatus,
  BarterStatus,
  MessageType,
  TransactionType,
} from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // 1. Clean existing records in reverse order
    await prisma.report.deleteMany();
    await prisma.savedListing.deleteMany();
    await prisma.review.deleteMany();
    await prisma.message.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.barterItem.deleteMany();
    await prisma.barterProposal.deleteMany();
    await prisma.cashOffer.deleteMany();
    await prisma.productDetails.deleteMany();
    await prisma.bookDetails.deleteMany();
    await prisma.listing.deleteMany();
    await prisma.user.deleteMany();

    const passwordHash = await bcrypt.hash('password123', 10);

    // 2. Create Realistic Users
    const userAlex = await prisma.user.create({
      data: {
        name: 'Alex Turner',
        email: 'alex@example.com',
        password: passwordHash,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        bio: 'Software engineer, avid reader, and technical book collector. Open to trades for distributed systems and sci-fi books.',
        phone: '+1 (555) 234-5678',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        isVerified: true,
        reputationScore: 4.95,
        totalReviews: 28,
        totalTrades: 19,
        totalSales: 12,
        responseRate: 98,
        avgResponseTime: 'Within 30 mins',
      },
    });

    const userSarah = await prisma.user.create({
      data: {
        name: 'Sarah Jenkins',
        email: 'sarah@example.com',
        password: passwordHash,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        bio: 'Literature PhD candidate and book preservationist. Love vintage editions, philosophy, and classical literature.',
        phone: '+1 (555) 345-6789',
        city: 'Boston',
        state: 'MA',
        postalCode: '02108',
        isVerified: true,
        reputationScore: 5.0,
        totalReviews: 45,
        totalTrades: 34,
        totalSales: 21,
        responseRate: 100,
        avgResponseTime: 'Within 15 mins',
      },
    });

    const userMarcus = await prisma.user.create({
      data: {
        name: 'Marcus Chen',
        email: 'marcus@example.com',
        password: passwordHash,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        bio: 'Tech enthusiast, mechanical keyboard builder, and gamer. Regularly trading gear, audio equipment, and sci-fi novels.',
        phone: '+1 (555) 456-7890',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94103',
        isVerified: true,
        reputationScore: 4.88,
        totalReviews: 19,
        totalTrades: 15,
        totalSales: 8,
        responseRate: 95,
        avgResponseTime: 'Within 1 hour',
      },
    });

    const userElena = await prisma.user.create({
      data: {
        name: 'Elena Rostova',
        email: 'elena@example.com',
        password: passwordHash,
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
        bio: 'College senior majoring in Biology. Buying, selling, and swapping college textbooks and study gear to save money.',
        phone: '+1 (555) 567-8901',
        city: 'Austin',
        state: 'TX',
        postalCode: '78701',
        isVerified: true,
        reputationScore: 4.75,
        totalReviews: 14,
        totalTrades: 9,
        totalSales: 11,
        responseRate: 92,
        avgResponseTime: 'Within 2 hours',
      },
    });

    const userDavid = await prisma.user.create({
      data: {
        name: 'David Miller',
        email: 'david@example.com',
        password: passwordHash,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        bio: 'Board game collector & science enthusiast. Huge fan of strategy board games, hard sci-fi, and vintage computing.',
        phone: '+1 (555) 678-9012',
        city: 'Seattle',
        state: 'WA',
        postalCode: '98101',
        isVerified: true,
        reputationScore: 4.92,
        totalReviews: 32,
        totalTrades: 26,
        totalSales: 14,
        responseRate: 99,
        avgResponseTime: 'Within 45 mins',
      },
    });

    // 3. Create Book Listings
    const book1 = await prisma.listing.create({
      data: {
        userId: userAlex.id,
        title: 'Designing Data-Intensive Applications',
        description: 'The definitive guide to distributed systems, storage engines, replication, and partitioning. Immaculate condition, no annotations.',
        listingType: ListingType.BOOK,
        exchangeType: ExchangeType.HYBRID,
        price: 35.0,
        condition: ItemCondition.LIKE_NEW,
        status: ListingStatus.ACTIVE,
        images: [
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        ],
        city: 'New York',
        state: 'NY',
        pickupAvailable: true,
        shippingAvailable: true,
        shippingCost: 4.5,
        barterWishlist: 'Open to trade for "Database Internals" by Alex Petrov, or mechanical keycaps.',
        viewsCount: 142,
        bookDetails: {
          create: {
            isbn: '1449373321',
            isbn13: '978-1449373320',
            author: 'Martin Kleppmann',
            publisher: "O'Reilly Media",
            publicationYear: 2017,
            genre: 'Computer Science',
            format: BookFormat.PAPERBACK,
          },
        },
      },
    });

    const book2 = await prisma.listing.create({
      data: {
        userId: userAlex.id,
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        description: 'Classic software engineering textbook. Light pencil notes on a couple of chapters, otherwise crisp pages and solid binding.',
        listingType: ListingType.BOOK,
        exchangeType: ExchangeType.HYBRID,
        price: 26.0,
        condition: ItemCondition.VERY_GOOD,
        status: ListingStatus.ACTIVE,
        images: [
          'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
        ],
        city: 'New York',
        state: 'NY',
        pickupAvailable: true,
        shippingAvailable: true,
        shippingCost: 3.5,
        barterWishlist: 'Interested in Clean Architecture or Refactoring.',
        viewsCount: 98,
        bookDetails: {
          create: {
            isbn: '0132350882',
            isbn13: '978-0132350884',
            author: 'Robert C. Martin',
            publisher: 'Prentice Hall',
            publicationYear: 2008,
            genre: 'Software Engineering',
            format: BookFormat.PAPERBACK,
          },
        },
      },
    });

    const book3 = await prisma.listing.create({
      data: {
        userId: userSarah.id,
        title: 'Dune (Deluxe Hardcover Edition)',
        description: 'Stunning collector edition with blue foil-stamped cover, dyed page edges, and detailed planetary maps. Unread pristine condition.',
        listingType: ListingType.BOOK,
        exchangeType: ExchangeType.BARTER_ONLY,
        price: null,
        condition: ItemCondition.BRAND_NEW,
        status: ListingStatus.ACTIVE,
        images: [
          'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80',
        ],
        city: 'Boston',
        state: 'MA',
        pickupAvailable: true,
        shippingAvailable: true,
        shippingCost: 5.0,
        barterWishlist: 'Looking for Neuromancer vintage paperback or Hyperion Cantos hardcover.',
        viewsCount: 310,
        bookDetails: {
          create: {
            isbn: '0593099324',
            isbn13: '978-0593099322',
            author: 'Frank Herbert',
            publisher: 'Ace Books',
            publicationYear: 2019,
            genre: 'Science Fiction',
            format: BookFormat.HARDCOVER,
          },
        },
      },
    });

    const book4 = await prisma.listing.create({
      data: {
        userId: userSarah.id,
        title: 'The Hobbit & The Lord of the Rings 4-Book Box Set',
        description: 'Leatherette pocket box set of Tolkien masterpieces. Looks gorgeous on any bookshelf.',
        listingType: ListingType.BOOK,
        exchangeType: ExchangeType.HYBRID,
        price: 45.0,
        condition: ItemCondition.LIKE_NEW,
        status: ListingStatus.ACTIVE,
        images: [
          'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=600&auto=format&fit=crop&q=80',
        ],
        city: 'Boston',
        state: 'MA',
        pickupAvailable: true,
        shippingAvailable: true,
        shippingCost: 6.0,
        barterWishlist: 'Will barter for high-rated strategy board games (e.g. Wingspan, Everdell).',
        viewsCount: 185,
        bookDetails: {
          create: {
            author: 'J.R.R. Tolkien',
            publisher: 'Mariner Books',
            publicationYear: 2014,
            genre: 'Fantasy',
            format: BookFormat.HARDCOVER,
          },
        },
      },
    });

    const book5 = await prisma.listing.create({
      data: {
        userId: userElena.id,
        title: 'Stewart Calculus: Early Transcendentals 9th Edition',
        description: 'Used for two college semesters. Normal shelf wear on edges, interior is clean and binding is solid.',
        listingType: ListingType.BOOK,
        exchangeType: ExchangeType.CASH_ONLY,
        price: 48.0,
        condition: ItemCondition.GOOD,
        status: ListingStatus.ACTIVE,
        images: [
          'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80',
        ],
        city: 'Austin',
        state: 'TX',
        pickupAvailable: true,
        shippingAvailable: true,
        shippingCost: 7.5,
        viewsCount: 220,
        bookDetails: {
          create: {
            author: 'James Stewart',
            publisher: 'Cengage',
            publicationYear: 2020,
            genre: 'Mathematics',
            format: BookFormat.HARDCOVER,
          },
        },
      },
    });

    const book8 = await prisma.listing.create({
      data: {
        userId: userMarcus.id,
        title: 'Neuromancer (Sprawl Trilogy Book 1)',
        description: 'The cyberpunk masterwork that coined "cyberspace". Ace paperback in solid reading condition.',
        listingType: ListingType.BOOK,
        exchangeType: ExchangeType.HYBRID,
        price: 10.0,
        condition: ItemCondition.GOOD,
        status: ListingStatus.ACTIVE,
        images: [
          'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&auto=format&fit=crop&q=80',
        ],
        city: 'San Francisco',
        state: 'CA',
        pickupAvailable: true,
        shippingAvailable: true,
        shippingCost: 3.0,
        barterWishlist: 'Trade for sci-fi paperbacks or Snow Crash.',
        viewsCount: 165,
        bookDetails: {
          create: {
            author: 'William Gibson',
            publisher: 'Ace Books',
            publicationYear: 2000,
            genre: 'Cyberpunk Sci-Fi',
            format: BookFormat.PAPERBACK,
          },
        },
      },
    });

    // 4. Create Product Listings
    const prod1 = await prisma.listing.create({
      data: {
        userId: userMarcus.id,
        title: 'Sony WH-1000XM4 Wireless Noise Cancelling Headphones',
        description: 'Midnight Blue edition. Battery holds 28+ hours. Complete with hardshell case and 3.5mm cable.',
        listingType: ListingType.PRODUCT,
        exchangeType: ExchangeType.HYBRID,
        price: 180.0,
        condition: ItemCondition.LIKE_NEW,
        status: ListingStatus.ACTIVE,
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
        ],
        city: 'San Francisco',
        state: 'CA',
        pickupAvailable: true,
        shippingAvailable: true,
        shippingCost: 8.0,
        barterWishlist: 'Trade for Kindle Paperwhite + cash, or keyboard parts.',
        viewsCount: 340,
        productDetails: {
          create: {
            category: 'Electronics',
            subCategory: 'Audio & Headphones',
            brand: 'Sony',
            model: 'WH-1000XM4',
            includesOriginalBox: true,
            includesAccessories: true,
          },
        },
      },
    });

    const prod2 = await prisma.listing.create({
      data: {
        userId: userMarcus.id,
        title: 'Keychron K2 V2 Wireless Mechanical Keyboard (RGB, Gateron Brown)',
        description: 'Hot-swappable 75% compact wireless keyboard. Bluetooth 5.1 or USB-C. Includes extra Mac/Windows keycaps.',
        listingType: ListingType.PRODUCT,
        exchangeType: ExchangeType.HYBRID,
        price: 60.0,
        condition: ItemCondition.VERY_GOOD,
        status: ListingStatus.ACTIVE,
        images: [
          'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
        ],
        city: 'San Francisco',
        state: 'CA',
        pickupAvailable: true,
        shippingAvailable: true,
        shippingCost: 7.0,
        barterWishlist: 'Trade for technical programming books or gaming peripherals.',
        viewsCount: 275,
        productDetails: {
          create: {
            category: 'Computers & Accessories',
            subCategory: 'Keyboards',
            brand: 'Keychron',
            model: 'K2 V2',
            includesOriginalBox: true,
            includesAccessories: true,
          },
        },
      },
    });

    const prod3 = await prisma.listing.create({
      data: {
        userId: userDavid.id,
        title: 'Catan (Settlers of Catan) 5th Edition Board Game',
        description: 'Complete 3-4 player strategy board game. All wooden settlements, roads, resource cards in place.',
        listingType: ListingType.PRODUCT,
        exchangeType: ExchangeType.BARTER_ONLY,
        price: null,
        condition: ItemCondition.VERY_GOOD,
        status: ListingStatus.ACTIVE,
        images: [
          'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=600&auto=format&fit=crop&q=80',
        ],
        city: 'Seattle',
        state: 'WA',
        pickupAvailable: true,
        shippingAvailable: true,
        shippingCost: 8.5,
        barterWishlist: 'Barter for Ticket to Ride, Wingspan, or Carcassonne.',
        viewsCount: 195,
        productDetails: {
          create: {
            category: 'Games & Hobbies',
            subCategory: 'Board Games',
            brand: 'Catan Studio',
            model: '5th Edition',
            includesOriginalBox: true,
            includesAccessories: true,
          },
        },
      },
    });

    // 5. Offers, Barters, Chats, Reviews
    const offer1 = await prisma.cashOffer.create({
      data: {
        listingId: book1.id,
        buyerId: userMarcus.id,
        sellerId: userAlex.id,
        offerAmount: 28.0,
        counterAmount: 31.0,
        status: OfferStatus.COUNTERED,
        message: 'Hey Alex! Would you take $28 cash and I can pick it up tomorrow?',
      },
    });

    const barter1 = await prisma.barterProposal.create({
      data: {
        initiatorId: userMarcus.id,
        recipientId: userSarah.id,
        targetListingId: book3.id,
        cashTopUp: 15.0,
        status: BarterStatus.PROPOSED,
        notes: 'Trading Neuromancer + $15 cash top-up for your Dune collector edition.',
        offeredItems: {
          create: [{ listingId: book8.id }],
        },
      },
    });

    const conv1 = await prisma.conversation.create({
      data: {
        participantAId: userMarcus.id,
        participantBId: userSarah.id,
        listingId: book3.id,
      },
    });

    await prisma.message.create({
      data: {
        conversationId: conv1.id,
        senderId: userMarcus.id,
        receiverId: userSarah.id,
        content: 'Hey Sarah! Proposed a trade with Neuromancer + $15 cash top-up for your Dune hardcover!',
        messageType: MessageType.BARTER_PROPOSAL_CARD,
        metadata: JSON.stringify({
          barterId: barter1.id,
          offeredItemTitles: ['Neuromancer (Sprawl Trilogy Book 1)'],
          cashTopUp: 15.0,
          status: 'PROPOSED',
        }),
      },
    });

    await prisma.review.create({
      data: {
        reviewerId: userSarah.id,
        targetUserId: userAlex.id,
        listingId: book2.id,
        transactionType: TransactionType.BARTER_EXCHANGE,
        overallRating: 5,
        conditionRating: 5,
        communicationRating: 5,
        punctualityRating: 5,
        comment: 'Alex was fantastic to trade with! Clean Code was in exact condition described.',
        isVerified: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Database seeded with realistic mock users, books, products, barters, offers, chats, and reviews.',
      stats: {
        users: 5,
        listings: 9,
        offers: 1,
        barters: 1,
        conversations: 1,
      },
    });
  } catch (error: any) {
    console.error('Seeding API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
