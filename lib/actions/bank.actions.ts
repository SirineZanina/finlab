'use server';

import { CountryCode } from 'plaid';

import { plaidClient } from '../plaid';
import { parseStringify } from '../utils';

import { AppError } from '../errors/appError';
import { PlaidTransaction } from '@/types/client/entities';

export const getInstitution = async ({
  institutionId,
}: { institutionId: string}) => {
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
}: { accessToken: string}) => {
  let hasMore = true;
  let transactions: PlaidTransaction[] = [];

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
        plaidId: transaction.account_id,
        amount: transaction.amount,
        pending: transaction.pending,
        image: transaction.logo_url ?? undefined,
        category: transaction.personal_finance_category?.primary || '',
        createdAt: new Date(transaction.date),
        account: {
          id: transaction.account_id,
          name: transaction.account_owner ?? '', // fallback to empty string if account_owner is undefined
        },
        notes: '', // provide a default/empty string since transaction.notes does not exist
        payee: transaction.merchant_name ?? '', // or provide a default/empty string
        date: transaction.date, // or new Date(transaction.date) if type is Date
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

export const getAccounts = async (userId: string) => {
  try {
    const response = await plaidClient.accountsGet({
      access_token: userId,
    });

    return parseStringify(response.data.accounts);
  } catch (error) {
    console.error('An error occurred while getting accounts:', error);
    throw new AppError(
	  'GET_ACCOUNTS_FAILED',
	  'Failed to retrieve accounts',
	  500
    );
  }
};
