'use server';

import { CountryCode, LinkTokenCreateRequest, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from 'plaid';
import { plaidClient } from '../plaid';
import { prisma } from '../prisma';
import { revalidatePath } from 'next/cache';
import { addMultipleAccountsFromPlaid } from './dwolla.actions';
import { createBankAccount } from './account.actions';
import { AppError } from '../errors/appError';
import { ExchangePublicTokenProps, User } from '@/types/client/user';
import { encryptId, parseStringify } from '../utils';

export const createLinkToken = async (user: User) => {
  const tokenParams: LinkTokenCreateRequest = {
    user: {
      client_user_id: user.id,
    },
    client_name: `${user.firstName} ${user.lastName}`,
    products: ['auth', 'transactions'] as Products[],
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

  } catch (error) {
    console.error('Plaid API Error: ', error);
    throw new AppError('CREATE_LINK_TOKEN_FAILED', 'Failed to create link token', 500);
  }
};

export const exchangePublicToken = async ({
  publicToken,
  user
}: ExchangePublicTokenProps) => {
  try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    if (!response.data.access_token || !response.data.item_id) {
      throw new AppError('EXCHANGE_PUBLIC_TOKEN_FAILED', 'Failed to exchange public token', 500);
    }

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountsData = accountsResponse.data.accounts;

    // ===== NEW: Create funding sources for ALL accounts =====
    const plaidAccountsForDwolla = [];

    for (const account of accountsData) {
      // Create processor token for each account
      const request: ProcessorTokenCreateRequest = {
        access_token: accessToken,
        account_id: account.account_id,
        processor: 'dwolla' as ProcessorTokenCreateRequestProcessorEnum,
      };

      const processorTokenResponse = await plaidClient.processorTokenCreate(request);
      const processorToken = processorTokenResponse.data.processor_token;

      // Prepare account data for Dwolla
      plaidAccountsForDwolla.push({
        processorToken,
        bankName: account.name, // e.g., "Chase Bank"
        accountType: account.subtype || account.type, // e.g., "checking", "savings"
        accountId: account.account_id,
        accountName: account.official_name || account.name,
      });
    }

    // Use the new function to create multiple funding sources
    const fundingSourceUrls = await addMultipleAccountsFromPlaid(
      user.dwollaCustomerId,
      plaidAccountsForDwolla
    );

    console.log(`Created ${fundingSourceUrls.length} funding sources:`, fundingSourceUrls);

    // Create bank record (using the first account for backward compatibility)
    const primaryFundingSourceUrl = fundingSourceUrls[0];
    if (!primaryFundingSourceUrl) {
      throw new AppError('CREATE_FUNDING_SOURCE_FAILED', 'Failed to create any funding sources', 500);
    }

    const bank = await createBankAccount({
      userId: user.id,
      businessId: user.businessId,
      plaidBankId: itemId,
      plaidId: accountsData[0].account_id,
      accessToken,
      fundingSourceUrl: primaryFundingSourceUrl,
      shareableId: encryptId(accountsData[0].account_id),
    });

    // Fetch transactions for the last 30 days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date();

    const transactionsResponse = await plaidClient.transactionsGet({
      access_token: accessToken,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
    });

    const transactions = transactionsResponse.data.transactions;

    // Create account records for each account
    const plaidToDbIdMap: Record<string, string> = {};

    await Promise.all(
      accountsData.map(async (accountData) => {
        const createdAccount = await prisma.account.create({
          data: {
            name: accountData.name,
            businessId: user.businessId,
            bankId: bank.id,
            plaidId: accountData.account_id,
          },
        });

        plaidToDbIdMap[accountData.account_id] = createdAccount.id;
        return createdAccount;
      })
    );

    // Prepare all transactions for insertion
    const transactionsToInsert = transactions.map((tx) => ({
      accountId: plaidToDbIdMap[tx.account_id],
      name: tx.name,
      amount: tx.amount,
      category: tx.personal_finance_category?.primary || '',
      pending: tx.pending,
      paymentChannel: tx.payment_channel || 'online',
      type: tx.amount < 0 ? 'debit' : 'credit',
      createdAt: new Date(tx.date).toISOString(),
      image: tx.logo_url,
    }));

    // Insert all transactions
    const transactionCreateResult = await prisma.transaction.createMany({
      data: transactionsToInsert,
      skipDuplicates: true,
    });

    if (!transactionCreateResult) {
      throw new AppError('CREATE_TRANSACTION_FAILED', 'Failed to create transactions', 500);
    }

    // Revalidate the path
    revalidatePath('/dashboard');

    return parseStringify({
      publicTokenExchange: 'complete',
      fundingSourcesCreated: fundingSourceUrls.length,
    });
  } catch (error) {
    console.error('An error occurred while exchanging token:', error);
    throw new AppError('EXCHANGE_PUBLIC_TOKEN_FAILED', 'Failed to exchange public token', 500);
  }
};
