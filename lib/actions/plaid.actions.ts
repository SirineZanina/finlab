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

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;
    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountsData = accountsResponse.data.accounts;

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
    const plaidToDbIdMap: Record<string, string> = {};

    await Promise.all(
      accountsData.map(async (accountData) => {
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

        plaidToDbIdMap[accountData.account_id] = createdAccount.id;
        return createdAccount;
      })
    );

    // 2. Prepare all transactions for insertion
    const transactionsToInsert = transactions.map((tx) => ({
      accountId: plaidToDbIdMap[tx.account_id],
      name: tx.name,
      amount: tx.amount,
      date: new Date(tx.date).toISOString(),
      category: tx.personal_finance_category?.primary || '',
      pending: tx.pending,
      paymentChannel: tx.payment_channel || 'online',
      senderId: user.id,
      senderBankId: plaidToDbIdMap[tx.account_id],
      receiverId: '', // unknown for Plaid transactions
      receiverBankId: '', // unknown for Plaid transactions
    }));

    // 3. Insert all transactions in one go
    const reponse = await prisma.transaction.createMany({
      data: transactionsToInsert,
	  skipDuplicates: true, // Skip duplicates if any

    });

    if (!reponse) {
	  throw new AppError('CREATE_TRANSACTION_FAILED', 'Failed to create transactions', 500);
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
