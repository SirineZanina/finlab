'use server';

import { CountryCode, LinkTokenCreateRequest, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from 'plaid';
import { plaidClient } from '../plaid';
import { encryptId, parseStringify } from '../utils';
import { ExchangePublicTokenProps, User } from '@/types/user';
import { addFundingSource } from './dwolla.actions';
import { createBankAccount } from './account.actions';
import { revalidatePath } from 'next/cache';
import { prisma } from '../prisma';
import { AppError } from '../errors/appError';
import { AccountType } from '@prisma/client';

export const createLinkToken = async (user: User) => {
  const tokenParams: LinkTokenCreateRequest = {
    user: {
      client_user_id: user.id,
    },
    client_name: `${user.firstName} ${user.lastName}`,
    products: ['auth','transactions'] as Products[],
    language: 'en',
    country_codes: ['US'] as CountryCode[],
    client_id: process.env.PLAID_CLIENT_ID as string,
    secret: process.env.PLAID_SECRET as string,
  };

  try {
    const response = await plaidClient.linkTokenCreate(tokenParams);
    return parseStringify({
      linkToken: response.data.link_token
    });

  } catch (error: any) {
    console.error('Plaid API Error: ', error.response.data);
  }
};

export const exchangePublicToken = async({
  publicToken,
  user
}: ExchangePublicTokenProps) => {
  try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountsData = accountsResponse.data.accounts;

    // Create a bank record
    const bank = await prisma.bank.create({
      data: {
        plaidBankId: itemId,
        accessToken: accessToken,
        plaidAccountId: accountsData[0].account_id, // Assuming at least one account
        fundingSourceUrl: '', // You might need to handle this differently
        shareableId: '', // You might need to handle this differently
        userId: user.id,
      },
    });

    // Create account records for each account
    for (const accountData of accountsData) {
      await prisma.account.create({
        data: {
          name: accountData.name,
          availableBalance: accountData.balances.available || 0,
          currentBalance: accountData.balances.current || 0,
          officialName: accountData.official_name || '',
          mask: accountData.mask || '',
          institutionId: accountsResponse.data.item.institution_id || '',
          type: accountData.type.toUpperCase() as any,
          subtype: accountData.subtype || '',
          shareableId: '', // You might need to handle this differently
          businessId: user.businessId,
          bankId: bank.id,
        },
      });
    }

    // Revalidate the path
    revalidatePath('/dashboard');

    // return a success message
    return parseStringify({
      publicTokenExchange: 'complete'
    });

  } catch (error) {
    console.error('An error occured while creating exchanging token:', error);
    throw new AppError('EXCHANGE_PUBLIC_TOKEN_FAILED', 'Failed to exchange public token', 500);
  }
};
