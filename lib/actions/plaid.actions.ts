'use server';

import { CountryCode, LinkTokenCreateRequest, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from 'plaid';
import { plaidClient } from '../plaid';
import {  encryptId, parseStringify } from '../utils';
import { ExchangePublicTokenProps, User } from '@/types/user';
import { AppError } from '../errors/appError';
import { addFundingSource } from './dwolla.actions';
import { revalidatePath } from 'next/cache';
import { createBankAccount } from './account.actions';
import { prisma } from '../prisma';

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

    if (!response.data.access_token || !response.data.item_id) {
	  throw new AppError('EXCHANGE_PUBLIC_TOKEN_FAILED', 'Failed to exchange public token', 500);
    }

    console.log('Access Token:', response.data.access_token);
    console.log('Item ID:', response.data.item_id);

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;
    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountsData = accountsResponse.data.accounts;

    console.log('Account Data:', accountsData);

	 // Create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountsData[0].account_id,
      processor: 'dwolla' as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(request);
    const processorToken = processorTokenResponse.data.processor_token;

    // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountsData[0].name,
    });

    console.log('Funding Source URL:', fundingSourceUrl);

    // If the funding source URL is not created, throw an error
    if (!fundingSourceUrl) throw Error;

    // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and shareableId ID
    const bank = await createBankAccount({
      userId: user.id,
      businessId: user.businessId,
      plaidBankId: itemId,
      plaidAccountId: accountsData[0].account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountsData[0].account_id),
    });

    // Fetch transactions for the last 30 days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // 30 days ago
    const endDate = new Date();

    const transactionsResponse = await plaidClient.transactionsGet({
      access_token: accessToken,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
    });

    const transactions = transactionsResponse.data.transactions;
    console.log('Transactions:', transactions);

    // Create account records for each account
    for (const accountData of accountsData) {
      const createdAccount = await prisma.account.create({
        data: {
          name: accountData.name,
          availableBalance: accountData.balances.available || 0,
          currentBalance: accountData.balances.current || 0,
          officialName: accountData.official_name || '',
          mask: accountData.mask || '',
          institutionId: accountsResponse.data.item.institution_id || '',
          type: accountData.type.toUpperCase(),
          subtype: accountData.subtype || '',
          shareableId: encryptId(accountData.account_id),
          businessId: user.businessId,
          bankId: bank.id,
          plaidAccountId: accountData.account_id,
        },
      });

      // Insert transactions for this account
      const accountTransactions = transactions.filter(
        (tx) => tx.account_id === accountData.account_id
      );

      for (const tx of accountTransactions) {
        await prisma.transaction.create({
          data: {
            accountId: createdAccount.id,
            name: tx.name,
            amount: tx.amount,
            date: tx.date,
            category: tx.personal_finance_category?.primary || '',
            pending: tx.pending,
            paymentChannel: tx.payment_channel || 'online',
            senderId: user.id,              // the current user
            senderBankId: createdAccount.id, // your bank account record in DB
            receiverId: '',               // unknown for Plaid transactions
            receiverBankId: '',           // unknown for Plaid transactions
          },
        });
      }
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
