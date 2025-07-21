'use server';

import { CountryCode } from 'plaid';

import { plaidClient } from '../plaid';
import { parseStringify } from '../utils';

import { prisma } from '@/lib/prisma';
import { AppError } from '../errors/appError';
import { getAccountProps } from '@/types/account';
import { getInstitutionProps, getTransactionsProps } from '@/types/transaction';

export const getAccounts = async (userId: string) => {
  try {

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { businessId: true},
    });

    if (!user) throw new AppError('USER_NOT_FOUND', 'User not found', 404);

    const accounts = await prisma.account.findMany({
	  where: { businessId: user.businessId },
    });

    if (!accounts || accounts.length === 0) {
	  throw new AppError('NO_ACCOUNTS_FOUND', 'No accounts found for this user', 404);
    }

    const totalBanks = accounts.length;
    const totalCurrentBalance = accounts.reduce(
      (total, account) => total + account.currentBalance.toNumber(),
      0
    );

    return {
      data: parseStringify(accounts),
      totalBanks,
      totalCurrentBalance,
    };
  } catch (error) {
    console.error('An error occurred while getting the accounts:', error);
    throw new AppError(
      'GET_ACCOUNTS_FAILED',
      'Failed to retrieve accounts',
      500
    );
  }
};

export const getAccount = async ({ accountId }: getAccountProps) => {
  try {

    if (!accountId) {
	  throw new AppError('ACCOUNT_ID_REQUIRED', 'Account ID is required', 400);
    }

    const account = await prisma.account.findUnique({
      where: { id: accountId },
      include: {
        transactions: true,
        bank: true,
      },
    });

    if (!account) {
      throw new AppError('ACCOUNT_NOT_FOUND', 'Account not found', 404);
    }

    const institution = await getInstitution({
      institutionId: account.institutionId,
    });

    const allTransactions = [...account.transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return {
      data: parseStringify(account),
      transactions: parseStringify(allTransactions),
      institution: parseStringify(institution),
    };
  } catch (error) {
    console.error('An error occurred while getting the account:', error);
    throw new AppError(
      'GET_ACCOUNT_FAILED',
      'Failed to retrieve account',
      500
    );
  }
};

export const getInstitution = async ({
  institutionId,
}: getInstitutionProps) => {
  try {
    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: ['US'] as CountryCode[],
    });

    return parseStringify(institutionResponse.data.institution);
  } catch (error) {
    console.error(
      'An error occurred while getting the institution:',
      error
    );
    throw new AppError(
      'GET_INSTITUTION_FAILED',
      'Failed to retrieve institution',
      500
    );
  }
};

export const getTransactions = async ({
  accessToken,
}: getTransactionsProps) => {
  let hasMore = true;
  let transactions: any = [];

  try {
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
      });

      const data = response.data;

      transactions = response.data.added.map((transaction) => ({
        id: transaction.transaction_id,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        type: transaction.payment_channel,
        plaidAccountId: transaction.account_id,
        amount: transaction.amount,
        pending: transaction.pending,
        date: transaction.date,
        image: transaction.logo_url,
      }));

      hasMore = data.has_more;
    }

    return parseStringify(transactions);
  } catch (error) {
    console.error(
      'An error occurred while getting the transactions:',
      error
    );
    throw new AppError(
      'GET_TRANSACTIONS_FAILED',
      'Failed to retrieve transactions',
      500
    );
  }
};
