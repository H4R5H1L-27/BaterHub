import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { resolveUser } from '@/lib/session';

export async function GET(req: NextRequest) {
  const user = await resolveUser(req);
  if (!user) return NextResponse.json({ searches: [] });

  const searches = await prisma.savedSearch.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 12,
  });
  return NextResponse.json({ searches });
}

export async function POST(req: NextRequest) {
  const user = await resolveUser(req);
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

  const { label, query, href } = await req.json();
  if (!query && !href) return NextResponse.json({ error: 'Search query required.' }, { status: 400 });

  const saved = await prisma.savedSearch.create({
    data: {
      userId: user.id,
      label: label || query || 'Saved search',
      query: query || '',
      href: href || `/listings?q=${encodeURIComponent(query || '')}`,
    },
  });
  return NextResponse.json({ success: true, search: saved }, { status: 201 });
}
