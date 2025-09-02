'use server';

import { CountryCode, LinkTokenCreateRequest, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from 'plaid';
import { plaidClient } from '../plaid';
import { prisma } from '../prisma';
import { revalidatePath } from 'next/cache';
import { addMultipleAccountsFromPlaid } from './dwolla.actions';
import { AppError } from '../errors/appError';
import { encryptId, parseStringify } from '../utils';
import { getDefaultCurrency } from '@/prisma/seed';
import { ExchangePublicTokenProps, User } from '@/types/client/entities';

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

    console.log(`Access Token: ${accessToken}`);
    console.log(`Item ID: ${itemId}`);

    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountsData = accountsResponse.data.accounts;

    console.log('Accounts data from Plaid:', accountsData);

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

      plaidAccountsForDwolla.push({
        processorToken,
        accountOfficialName: account.official_name || '',
        accountName: account.name,
        accountType: account.type,
        accountId: account.account_id,
      });
    }

    // Use the new function to create multiple funding sources
    const fundingSourceUrls = await addMultipleAccountsFromPlaid(
      user.dwollaCustomerId,
      plaidAccountsForDwolla
    );

    const fundingSourceMap = new Map(
      fundingSourceUrls.map(url => [url.accountId, url.fundingSourceUrl])
    );

    const currencyCodes = [...new Set(accountsData.map(account =>
      account.balances.iso_currency_code || 'USD'
    ))];

    const currencies = await prisma.currency.findMany({
      where: { code: { in: currencyCodes } }
    });

    const defaultCurrency = await getDefaultCurrency();
    const currencyMap = new Map(currencies.map(c => [c.code, c.id]));

    const data = accountsData.map((account) => {
      const currencyCode = account.balances.iso_currency_code || 'USD';
      const currencyId = currencyMap.get(currencyCode) || defaultCurrency?.id;

      if (!currencyId) {
        throw new AppError('CURRENCY_ID_NOT_FOUND', `Currency ID not found for code: ${currencyCode}`, 500);
      }

      return {
        businessId: user.businessId,
        name: account.name,
        officialName: account.official_name || '',
        type: account.type,
        subtype: account.subtype,
        plaidId: account.account_id,
        accessToken,
        fundingSourceUrl: fundingSourceMap.get(account.account_id),
        shareableId: encryptId(account.account_id),
        bankId: itemId,
        currencyId,
      };
    });

    console.log('dwolla plaid accounts:', plaidAccountsForDwolla);

    console.log('Accounts created:', data);

    const result = await prisma.account.createMany({
      data: data,
      skipDuplicates: true,
    });

    if (!result) {
	  throw new AppError('CREATE_ACCOUNT_FAILED', 'Failed to create accounts', 500);
    }

    const createdAccounts = await prisma.account.findMany({
      where: {
        plaidId: { in: accountsData.map(a => a.account_id) }
      }
    });

    console.log('Created accounts:', createdAccounts);

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

    // Create categories from Plaid transactions and get category mapping
    const categoryMap: Record<string, string> = {};
    const uniqueCategories = new Set<string>();

    transactions.forEach(tx => {
      if (tx.personal_finance_category?.primary) {
        uniqueCategories.add(tx.personal_finance_category.primary);
      }
    });

    // Create categories in database
    for (const categoryName of uniqueCategories) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          name: categoryName,
        }
      });

      if (!existingCategory) {
        const newCategory = await prisma.category.create({
          data: {
            name: categoryName,
          },
        });
        categoryMap[categoryName] = newCategory.id;
      } else {
        categoryMap[categoryName] = existingCategory.id;
      }
    }

    // Prepare all transactions for insertion
    const transactionsToInsert = transactions.map((tx) => ({
      accountId: plaidToDbIdMap[tx.account_id],
      name: tx.name,
      amount: Math.round(tx.amount * 100), // Convert to cents (Int)
      payee: tx.merchant_name || tx.name, // Add required payee field
      date: new Date(tx.date), // Add required date field
      paymentChannel: tx.payment_channel || 'online',
      pending: tx.pending,
      image: tx.logo_url,
      categoryId: tx.personal_finance_category?.primary ? categoryMap[tx.personal_finance_category.primary] : null,
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
