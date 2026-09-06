export const CITIES = [
  'All India',
  'New York',
  'Boston',
  'San Francisco',
  'Austin',
  'Seattle',
  'Chicago',
  'Los Angeles',
] as const;

export type MarketCategory = {
  slug: string;
  label: string;
  hint: string;
  href: string;
  icon: 'book' | 'textbook' | 'audio' | 'keyboard' | 'camera' | 'game' | 'swap' | 'phone';
};

export const MARKET_CATEGORIES: MarketCategory[] = [
  {
    slug: 'books',
    label: 'Books',
    hint: 'Fiction & non-fiction',
    href: '/listings?type=BOOK',
    icon: 'book',
  },
  {
    slug: 'textbooks',
    label: 'Textbooks',
    hint: 'Campus course codes',
    href: '/listings?type=BOOK&q=textbook',
    icon: 'textbook',
  },
  {
    slug: 'electronics',
    label: 'Electronics',
    hint: 'Audio, kits, gadgets',
    href: '/listings?type=PRODUCT&category=Electronics',
    icon: 'phone',
  },
  {
    slug: 'audio',
    label: 'Audio',
    hint: 'Headphones & speakers',
    href: '/listings?q=headphones',
    icon: 'audio',
  },
  {
    slug: 'keyboards',
    label: 'Keyboards',
    hint: 'Mechanical boards',
    href: '/listings?q=keyboard',
    icon: 'keyboard',
  },
  {
    slug: 'cameras',
    label: 'Cameras',
    hint: 'Photo & video',
    href: '/listings?q=camera',
    icon: 'camera',
  },
  {
    slug: 'games',
    label: 'Board games',
    hint: 'Tables & expansions',
    href: '/listings?q=Catan',
    icon: 'game',
  },
  {
    slug: 'barter',
    label: 'Barter only',
    hint: 'Item for item',
    href: '/listings?exchange=BARTER_ONLY',
    icon: 'swap',
  },
];

export const TRENDING_SEARCHES = [
  'Clean Code',
  'Calculus',
  'Kindle',
  'mechanical keyboard',
  'Dune',
  'headphones',
];
