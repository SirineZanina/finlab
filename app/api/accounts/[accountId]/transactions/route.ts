// app/api/accounts/[accountId]/transactions/route.ts
import { getAccount } from '@/lib/actions/bank.actions';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ accountId: string }> }
) {
  try {

    const { accountId } = await params;

    if (!accountId) {
      return Response.json({ error: 'Account ID is required' }, { status: 400 });
    }

    const account = await getAccount(accountId);

    if (!account) {
      return Response.json({ error: 'Account not found' }, { status: 404 });
    }

    return Response.json({
      transactions: account?.transactions || [],
      accountId: accountId
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return Response.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
