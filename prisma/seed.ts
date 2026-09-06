import { PrismaClient, ListingType, ExchangeType, ItemCondition, ListingStatus, BookFormat, OfferStatus, BarterStatus, MessageType, TransactionType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding with rich mock data...');

  // 1. Clean existing records in reverse order of foreign keys
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

  console.log('✅ Created 5 core test users.');

  // 3. Create Book Listings with Rich Metadata
  const book1 = await prisma.listing.create({
    data: {
      userId: userAlex.id,
      title: 'Designing Data-Intensive Applications',
      description: 'The definitive guide to distributed data systems, storage engines, replication, and partitioning. Immaculate condition, no annotations or bent corners. Great for system design interview prep or senior engineering work.',
      listingType: ListingType.BOOK,
      exchangeType: ExchangeType.HYBRID,
      price: 35.0,
      isNegotiable: true,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      images: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=600&auto=format&fit=crop&q=80',
      ],
      city: 'New York',
      state: 'NY',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 4.5,
      barterWishlist: 'Open to trade for "Database Internals" by Alex Petrov, or high-end mechanical keyboard keycaps.',
      viewsCount: 142,
      bookDetails: {
        create: {
          isbn: '1449373321',
          isbn13: '978-1449373320',
          author: 'Martin Kleppmann',
          publisher: "O'Reilly Media",
          publicationYear: 2017,
          edition: '1st Edition',
          genre: 'Computer Science',
          format: BookFormat.PAPERBACK,
          language: 'English',
          pageCount: 616,
          hasAnnotations: false,
          academicSubject: 'Computer Systems',
          courseCode: 'CS 440',
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
      isNegotiable: true,
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
      barterWishlist: 'Interested in "Clean Architecture" or "Refactoring" by Martin Fowler.',
      viewsCount: 98,
      bookDetails: {
        create: {
          isbn: '0132350882',
          isbn13: '978-0132350884',
          author: 'Robert C. Martin',
          publisher: 'Prentice Hall',
          publicationYear: 2008,
          edition: '1st Edition',
          genre: 'Software Engineering',
          format: BookFormat.PAPERBACK,
          language: 'English',
          pageCount: 464,
          hasAnnotations: true,
          academicSubject: 'Software Engineering',
          courseCode: 'SWE 201',
        },
      },
    },
  });

  const book3 = await prisma.listing.create({
    data: {
      userId: userSarah.id,
      title: 'Dune (Deluxe Hardcover Edition)',
      description: 'Stunning collector edition with blue foil-stamped cover, dyed page edges, and detailed planetary maps. Unread copy, pristine collector condition.',
      listingType: ListingType.BOOK,
      exchangeType: ExchangeType.BARTER_ONLY,
      price: null,
      isNegotiable: false,
      condition: ItemCondition.BRAND_NEW,
      status: ListingStatus.ACTIVE,
      images: [
        'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
      ],
      city: 'Boston',
      state: 'MA',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 5.0,
      barterWishlist: 'Exclusively looking to trade for vintage 1980s Neuromancer paperback or Dan Simmons Hyperion Cantos hardcover.',
      viewsCount: 310,
      bookDetails: {
        create: {
          isbn: '0593099324',
          isbn13: '978-0593099322',
          author: 'Frank Herbert',
          publisher: 'Ace Books',
          publicationYear: 2019,
          edition: 'Deluxe Collector Edition',
          genre: 'Science Fiction',
          format: BookFormat.HARDCOVER,
          language: 'English',
          pageCount: 688,
          hasAnnotations: false,
        },
      },
    },
  });

  const book4 = await prisma.listing.create({
    data: {
      userId: userSarah.id,
      title: 'The Hobbit & The Lord of the Rings 4-Book Box Set',
      description: 'Leatherette pocket box set of Tolkien masterpiece. Compact, elegant, never taken on trips, looks brand new on any bookshelf.',
      listingType: ListingType.BOOK,
      exchangeType: ExchangeType.HYBRID,
      price: 45.0,
      isNegotiable: true,
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
      barterWishlist: 'Will barter for modern high-rated strategy board games (e.g. Wingspan, Everdell).',
      viewsCount: 185,
      bookDetails: {
        create: {
          isbn: '0544445783',
          isbn13: '978-0544445789',
          author: 'J.R.R. Tolkien',
          publisher: 'Mariner Books',
          publicationYear: 2014,
          edition: 'Pocket Boxed Set',
          genre: 'Fantasy',
          format: BookFormat.HARDCOVER,
          language: 'English',
          pageCount: 1728,
          hasAnnotations: false,
        },
      },
    },
  });

  const book5 = await prisma.listing.create({
    data: {
      userId: userElena.id,
      title: 'Stewart Calculus: Early Transcendentals 9th Edition',
      description: 'Essential university calculus textbook. Used for two semesters at UT Austin. Normal shelf wear on edges, interior is clean and bindings are rock solid.',
      listingType: ListingType.BOOK,
      exchangeType: ExchangeType.CASH_ONLY,
      price: 48.0,
      isNegotiable: true,
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
      barterWishlist: null,
      viewsCount: 220,
      bookDetails: {
        create: {
          isbn: '1337613924',
          isbn13: '978-1337613927',
          author: 'James Stewart, Daniel Clegg, Saleem Watson',
          publisher: 'Cengage Learning',
          publicationYear: 2020,
          edition: '9th Edition',
          genre: 'Mathematics',
          format: BookFormat.HARDCOVER,
          language: 'English',
          pageCount: 1392,
          hasAnnotations: false,
          academicSubject: 'Calculus I & II',
          courseCode: 'M 408C',
        },
      },
    },
  });

  const book6 = await prisma.listing.create({
    data: {
      userId: userElena.id,
      title: 'Campbell Biology 12th Edition',
      description: 'Top standard college biology reference. Heavy hardcover. Very clean pages, includes access code pamphlet (unscratched).',
      listingType: ListingType.BOOK,
      exchangeType: ExchangeType.HYBRID,
      price: 68.0,
      isNegotiable: true,
      condition: ItemCondition.VERY_GOOD,
      status: ListingStatus.ACTIVE,
      images: [
        'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=600&auto=format&fit=crop&q=80',
      ],
      city: 'Austin',
      state: 'TX',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 9.0,
      barterWishlist: 'Open to swap for Organic Chemistry Wade 9th ed or TI-84 Plus CE calculator.',
      viewsCount: 140,
      bookDetails: {
        create: {
          isbn: '0135188741',
          isbn13: '978-0135188743',
          author: 'Lisa A. Urry, Michael L. Cain',
          publisher: 'Pearson',
          publicationYear: 2020,
          edition: '12th Edition',
          genre: 'Biological Sciences',
          format: BookFormat.HARDCOVER,
          language: 'English',
          pageCount: 1488,
          hasAnnotations: false,
          academicSubject: 'General Biology',
          courseCode: 'BIO 311C',
        },
      },
    },
  });

  const book7 = await prisma.listing.create({
    data: {
      userId: userDavid.id,
      title: 'Project Hail Mary',
      description: 'Fantastic standalone sci-fi by Andy Weir. Read once on vacation, stored safely since. Spine uncreased.',
      listingType: ListingType.BOOK,
      exchangeType: ExchangeType.HYBRID,
      price: 13.0,
      isNegotiable: true,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      images: [
        'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80',
      ],
      city: 'Seattle',
      state: 'WA',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 3.0,
      barterWishlist: 'Looking for "Children of Time" by Adrian Tchaikovsky.',
      viewsCount: 88,
      bookDetails: {
        create: {
          isbn: '0593135202',
          isbn13: '978-0593135204',
          author: 'Andy Weir',
          publisher: 'Ballantine Books',
          publicationYear: 2021,
          edition: '1st Edition',
          genre: 'Science Fiction',
          format: BookFormat.PAPERBACK,
          language: 'English',
          pageCount: 496,
          hasAnnotations: false,
        },
      },
    },
  });

  const book8 = await prisma.listing.create({
    data: {
      userId: userMarcus.id,
      title: 'Neuromancer (Sprawl Trilogy Book 1)',
      description: 'The cyberpunk masterwork that coined "cyberspace" and won the Hugo, Nebula, and Philip K. Dick awards. Ace paperback edition in solid condition.',
      listingType: ListingType.BOOK,
      exchangeType: ExchangeType.HYBRID,
      price: 10.0,
      isNegotiable: false,
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
      barterWishlist: 'Will trade for hard sci-fi paperbacks or Snow Crash.',
      viewsCount: 165,
      bookDetails: {
        create: {
          isbn: '0441569595',
          isbn13: '978-0441569595',
          author: 'William Gibson',
          publisher: 'Ace Books',
          publicationYear: 2000,
          edition: 'Reprint',
          genre: 'Cyberpunk Sci-Fi',
          format: BookFormat.PAPERBACK,
          language: 'English',
          pageCount: 288,
          hasAnnotations: false,
        },
      },
    },
  });

  console.log('✅ Created 8 high-demand book listings.');

  // 4. Create General Product Listings
  const prod1 = await prisma.listing.create({
    data: {
      userId: userMarcus.id,
      title: 'Sony WH-1000XM4 Wireless Noise Cancelling Headphones',
      description: 'Midnight Blue edition. Battery still holds 28+ hours of charge. Complete with original hardshell travel case, 3.5mm cable, and flight adapter.',
      listingType: ListingType.PRODUCT,
      exchangeType: ExchangeType.HYBRID,
      price: 180.0,
      isNegotiable: true,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80',
      ],
      city: 'San Francisco',
      state: 'CA',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 8.0,
      barterWishlist: 'Trade for Kindle Paperwhite + cash, or high-end mechanical keyboard parts.',
      viewsCount: 340,
      productDetails: {
        create: {
          category: 'Electronics',
          subCategory: 'Audio & Headphones',
          brand: 'Sony',
          model: 'WH-1000XM4',
          includesOriginalBox: true,
          includesAccessories: true,
          warrantyStatus: 'Out of warranty, verified working perfectly',
        },
      },
    },
  });

  const prod2 = await prisma.listing.create({
    data: {
      userId: userMarcus.id,
      title: 'Keychron K2 V2 Wireless Mechanical Keyboard (RGB, Gateron Brown)',
      description: 'Hot-swappable 75% compact wireless keyboard. Works via Bluetooth 5.1 or USB-C. Includes extra Mac/Windows keycaps and keycap puller.',
      listingType: ListingType.PRODUCT,
      exchangeType: ExchangeType.HYBRID,
      price: 60.0,
      isNegotiable: true,
      condition: ItemCondition.VERY_GOOD,
      status: ListingStatus.ACTIVE,
      images: [
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop&q=80',
      ],
      city: 'San Francisco',
      state: 'CA',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 7.0,
      barterWishlist: 'Trade for technical programming books (O Reilly, Pragmatic Bookshelf) or Magic The Gathering bundles.',
      viewsCount: 275,
      productDetails: {
        create: {
          category: 'Computers & Accessories',
          subCategory: 'Keyboards',
          brand: 'Keychron',
          model: 'K2 V2',
          includesOriginalBox: true,
          includesAccessories: true,
          warrantyStatus: 'Original purchase receipt available',
        },
      },
    },
  });

  const prod3 = await prisma.listing.create({
    data: {
      userId: userDavid.id,
      title: 'Catan (Settlers of Catan) 5th Edition Board Game',
      description: 'Complete 3-4 player strategy board game. All hexagon tiles, resource cards, dice, and wooden settlements/roads present. Played 4 times with family.',
      listingType: ListingType.PRODUCT,
      exchangeType: ExchangeType.BARTER_ONLY,
      price: null,
      isNegotiable: false,
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
      barterWishlist: 'Straight barter for "Ticket to Ride: Europe", "Wingspan", or "Carcassonne Big Box".',
      viewsCount: 195,
      productDetails: {
        create: {
          category: 'Games & Hobbies',
          subCategory: 'Board Games',
          brand: 'Catan Studio',
          model: '5th Edition Base Game',
          includesOriginalBox: true,
          includesAccessories: true,
          warrantyStatus: 'N/A',
        },
      },
    },
  });

  const prod4 = await prisma.listing.create({
    data: {
      userId: userElena.id,
      title: 'TI-84 Plus CE Graphing Calculator (Rose Gold Edition)',
      description: 'Rechargeable color graphing calculator. Slim design, high-resolution backlit screen. Preloaded with apps. Perfect for college calculus, physics, and SAT/ACT.',
      listingType: ListingType.PRODUCT,
      exchangeType: ExchangeType.HYBRID,
      price: 75.0,
      isNegotiable: true,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      images: [
        'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80',
      ],
      city: 'Austin',
      state: 'TX',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 5.0,
      barterWishlist: 'Open to trade for medical terminology or biology reference sets.',
      viewsCount: 160,
      productDetails: {
        create: {
          category: 'Office & Electronics',
          subCategory: 'Calculators',
          brand: 'Texas Instruments',
          model: 'TI-84 Plus CE',
          includesOriginalBox: false,
          includesAccessories: true,
          warrantyStatus: 'Works flawlessly, holds full battery charge',
        },
      },
    },
  });

  const prod5 = await prisma.listing.create({
    data: {
      userId: userAlex.id,
      title: 'Kindle Paperwhite (11th Gen, 6.8" 16GB, Agave Green)',
      description: 'Warm light adjustment, waterproof, USB-C fast charging. Screen is 100% scratch-free. Includes magnetic fabric cover in sage green.',
      listingType: ListingType.PRODUCT,
      exchangeType: ExchangeType.HYBRID,
      price: 95.0,
      isNegotiable: true,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      images: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80',
      ],
      city: 'New York',
      state: 'NY',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 5.0,
      barterWishlist: 'Will swap for nice leather-bound classic books or Sony noise-canceling headphones (with cash top-up from my end).',
      viewsCount: 420,
      productDetails: {
        create: {
          category: 'Electronics',
          subCategory: 'E-Readers',
          brand: 'Amazon',
          model: 'Paperwhite 11th Gen',
          includesOriginalBox: true,
          includesAccessories: true,
          warrantyStatus: 'Valid through next year',
        },
      },
    },
  });

  console.log('✅ Created 5 high-demand general product listings.');

  // 5. Create Active Cash Offers
  const offer1 = await prisma.cashOffer.create({
    data: {
      listingId: book1.id,
      buyerId: userMarcus.id,
      sellerId: userAlex.id,
      offerAmount: 28.0,
      counterAmount: 31.0,
      status: OfferStatus.COUNTERED,
      message: 'Hey Alex! Would you consider $28 cash and I can pick it up tomorrow in Manhattan?',
    },
  });

  const offer2 = await prisma.cashOffer.create({
    data: {
      listingId: prod1.id,
      buyerId: userDavid.id,
      sellerId: userMarcus.id,
      offerAmount: 165.0,
      counterAmount: null,
      status: OfferStatus.PENDING,
      message: 'Hi Marcus! Can do $165 cash with local meetup at Market St station.',
    },
  });

  const offer3 = await prisma.cashOffer.create({
    data: {
      listingId: book5.id,
      buyerId: userSarah.id,
      sellerId: userElena.id,
      offerAmount: 42.0,
      counterAmount: 45.0,
      status: OfferStatus.ACCEPTED,
      message: 'Would you take $42? Need this for tutoring my freshman students.',
    },
  });

  console.log('✅ Created realistic cash offer negotiations.');

  // 6. Create Barter Proposals (Single & Multi-Item, with Cash Top-Up)
  const barter1 = await prisma.barterProposal.create({
    data: {
      initiatorId: userMarcus.id,
      recipientId: userSarah.id,
      targetListingId: book3.id, // Dune Deluxe
      cashTopUp: 15.0, // $15 cash top-up offered with book
      status: BarterStatus.PROPOSED,
      notes: 'Hi Sarah! I noticed you were looking for cyberpunk classics. I can trade my Neuromancer paperback plus $15 cash for your Dune deluxe hardcover.',
      offeredItems: {
        create: [
          { listingId: book8.id }, // Neuromancer
        ],
      },
    },
  });

  const barter2 = await prisma.barterProposal.create({
    data: {
      initiatorId: userSarah.id,
      recipientId: userMarcus.id,
      targetListingId: prod2.id, // Keychron Keyboard
      cashTopUp: 0.0,
      status: BarterStatus.ACCEPTED,
      exchangeCode: 'TRD-8492',
      notes: 'I would love to trade the Tolkien 4-book box set for your Keychron mechanical keyboard! Both are in like-new condition.',
      offeredItems: {
        create: [
          { listingId: book4.id }, // Tolkien Box Set
        ],
      },
    },
  });

  console.log('✅ Created barter proposals with exchange codes and cash top-ups.');

  // 7. Create Interactive Conversations with Action Cards
  const conv1 = await prisma.conversation.create({
    data: {
      participantAId: userMarcus.id,
      participantBId: userSarah.id,
      listingId: book3.id,
      lastMessageAt: new Date(),
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conv1.id,
      senderId: userMarcus.id,
      receiverId: userSarah.id,
      content: 'Hey Sarah! I saw your Dune Deluxe listing and saw your wishlist for cyberpunk books.',
      messageType: MessageType.TEXT,
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conv1.id,
      senderId: userMarcus.id,
      receiverId: userSarah.id,
      content: 'I submitted a barter proposal offering my Neuromancer copy plus $15 cash top-up!',
      messageType: MessageType.BARTER_PROPOSAL_CARD,
      metadata: JSON.stringify({
        barterId: barter1.id,
        offeredItemTitles: ['Neuromancer (Sprawl Trilogy Book 1)'],
        cashTopUp: 15.0,
        status: 'PROPOSED',
      }),
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conv1.id,
      senderId: userSarah.id,
      receiverId: userMarcus.id,
      content: "Hi Marcus! That sounds very tempting. Is your Neuromancer copy the 2000 Ace reprint or original 1984? The pages don't have tears, right?",
      messageType: MessageType.TEXT,
    },
  });

  const conv2 = await prisma.conversation.create({
    data: {
      participantAId: userMarcus.id,
      participantBId: userAlex.id,
      listingId: book1.id,
      lastMessageAt: new Date(),
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conv2.id,
      senderId: userMarcus.id,
      receiverId: userAlex.id,
      content: 'Hi Alex! Wondering if you are flexible on the DDIA book price?',
      messageType: MessageType.TEXT,
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conv2.id,
      senderId: userMarcus.id,
      receiverId: userAlex.id,
      content: 'Sent an offer for $28 cash with Manhattan pickup.',
      messageType: MessageType.CASH_OFFER_CARD,
      metadata: JSON.stringify({
        offerId: offer1.id,
        amount: 28.0,
        status: 'COUNTERED',
        counterAmount: 31.0,
      }),
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conv2.id,
      senderId: userAlex.id,
      receiverId: userMarcus.id,
      content: 'Hey Marcus! I countered at $31. It really is in brand new condition, no notes. Can meet near Union Square around 5:30 PM!',
      messageType: MessageType.TEXT,
    },
  });

  console.log('✅ Created real-time conversations with embedded negotiation action cards.');

  // 8. Create Verified Dual-Sided Reviews
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
      comment: 'Alex was fantastic to trade with! Clean Code was in exact condition described. He showed up on time at the coffee shop and we had a great 10-minute chat about software architecture.',
      isVerified: true,
    },
  });

  await prisma.review.create({
    data: {
      reviewerId: userAlex.id,
      targetUserId: userSarah.id,
      listingId: book2.id,
      transactionType: TransactionType.BARTER_EXCHANGE,
      overallRating: 5,
      conditionRating: 5,
      communicationRating: 5,
      punctualityRating: 5,
      comment: 'Super smooth exchange with Sarah! Books were packaged carefully and communication was instantaneous.',
      isVerified: true,
    },
  });

  await prisma.review.create({
    data: {
      reviewerId: userDavid.id,
      targetUserId: userMarcus.id,
      transactionType: TransactionType.CASH_SALE,
      overallRating: 5,
      conditionRating: 5,
      communicationRating: 5,
      punctualityRating: 4,
      comment: 'Bought audio equipment from Marcus. Tested it on the spot, works like a charm. Very honest seller!',
      isVerified: true,
    },
  });

  console.log('🎉 Database seeding completed successfully with 5 users, 13 listings, offers, barters, chats, and reviews!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
