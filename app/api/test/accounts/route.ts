// app/api/test/accounts/route.ts (temporary for testing)
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get all accounts directly from database
    const accounts = await prisma.account.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        businessId: true
      }
    });

    return Response.json({
      accounts: accounts,
      count: accounts.length
    });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return Response.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
}
