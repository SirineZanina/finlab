'use server';

import { AddFundingSourceParams, CreateFundingSourceOptions, NewDwollaCustomerParams, TransferParams } from '@/types/dwolla';
import { Client } from 'dwolla-v2';
import { AppError } from '../errors/appError';

const getEnvironment = (): 'production' | 'sandbox' => {
  const environment = process.env.DWOLLA_ENV as string;

  switch (environment) {
  case 'sandbox':
    return 'sandbox';
  case 'production':
    return 'production';
  default:
    throw new Error(
      'Dwolla environment should either be set to `sandbox` or `production`'
    );
  }
};

const dwollaClient = new Client({
  environment: getEnvironment(),
  key: process.env.DWOLLA_KEY as string,
  secret: process.env.DWOLLA_SECRET as string,
});

// Create a Dwolla Funding Source using a Plaid Processor Token
export const createFundingSource = async (
  options: CreateFundingSourceOptions
) => {
  try {
    return await dwollaClient
      .post(`customers/${options.customerId}/funding-sources`, {
        name: options.fundingSourceName,
        plaidToken: options.plaidToken,
      })
      .then((res) => res.headers.get('location'));
  } catch (err) {
    console.error('Creating a Funding Source Failed: ', err);
  }
};

export const createOnDemandAuthorization = async () => {
  try {
    const onDemandAuthorization = await dwollaClient.post(
      'on-demand-authorizations'
    );
    const authLink = onDemandAuthorization.body._links;
    return authLink;
  } catch (err) {
    console.error('Creating an On Demand Authorization Failed: ', err);
  }
};

export const createDwollaCustomer = async (
  newCustomer: NewDwollaCustomerParams
) => {
  try {
    const payload = {
      firstName: newCustomer.firstName,
      lastName: newCustomer.lastName,
      email: newCustomer.email,
      type: 'personal',
      address1: newCustomer.address1,
      city: newCustomer.city,
      state: newCustomer.state,
      postalCode: newCustomer.postalCode,
      dateOfBirth: newCustomer.dateOfBirth,
      ssn: newCustomer.ssn,
      phone: newCustomer.phoneNumber,
    };

    return await dwollaClient
      .post('customers', payload)
      .then((res) => res.headers.get('location'));
  } catch (err) {
    console.error('Creating a Personal Dwolla Customer Failed: ', err);
    throw err;
  }
};

export const createTransfer = async ({
  sourceFundingSourceUrl,
  destinationFundingSourceUrl,
  amount,
}: TransferParams) => {
  try {
    const requestBody = {
      _links: {
        source: {
          href: sourceFundingSourceUrl,
        },
        destination: {
          href: destinationFundingSourceUrl,
        },
      },
      amount: {
        currency: 'USD',
        value: amount,
      },
    };
    console.log('Dwolla request body:', JSON.stringify(requestBody, null, 2));

    return await dwollaClient
      .post('transfers', requestBody)
      .then((res) => res.headers.get('location'));
  } catch (err) {
    console.error('Transfer fund failed: ', err);
    throw new AppError('TRANSFER_FAILED', 'Failed to create transfer', 500);
  }
};

export const deactivateDwollaCustomer = async (customerUrl: string) => {
  try {
    return await dwollaClient.post(customerUrl, { status: 'deactivated' });
  } catch (err) {
    console.error('Deactivating a Dwolla Customer Failed: ', err);
  }
};

// Improved addFundingSource function
export const addFundingSource = async ({
  dwollaCustomerId,
  processorToken,
  accountName,
  accountType = '',
  accountId = '',
}: AddFundingSourceParams) => {
  try {
    const fundingSources = await dwollaClient.get(
      `customers/${dwollaCustomerId}/funding-sources`
    );

    // Create a unique name that includes account type
    const uniqueFundingSourceName = accountType
      ? `${accountName} ${accountType}`
      : accountName;

    // More specific matching - check by name AND account details
    const existingFundingSource = fundingSources.body._embedded['funding-sources'].find(
      (source: any) => {
        // Match by exact name
        if (source.name === uniqueFundingSourceName) {
          return true;
        }

        // If we have accountId, we could also match by that
        // (you'd need to store this metadata somewhere)
        return false;
      }
    );

    if (existingFundingSource) {
      console.log(`Funding source already exists: ${uniqueFundingSourceName}`);
      return existingFundingSource._links.self.href;
    }

    console.log(`Creating new funding source: ${uniqueFundingSourceName}`);

    // create dwolla auth link
    const dwollaAuthLinks = await createOnDemandAuthorization();

    // add funding source to the dwolla customer & get the funding source url
    const fundingSourceOptions = {
      customerId: dwollaCustomerId,
      fundingSourceName: uniqueFundingSourceName, // Use unique name
      plaidToken: processorToken,
      _links: dwollaAuthLinks,
    };

    return await createFundingSource(fundingSourceOptions);
  } catch (err) {
    console.error('Add funding source failed: ', err);
    throw new AppError('ADD_FUNDING_SOURCE_FAILED', 'Failed to add funding source', 500);
  }
};

export const addMultipleAccountsFromPlaid = async (
  dwollaCustomerId: string,
  plaidAccounts: Array<{
    processorToken: string;
    accountOfficialName: string;
    accountName: string;
    accountType: string;
    accountId: string;
  }>
) => {
  const results: Array<{
    accountId: string;
    fundingSourceUrl: string | null;
  }> = [];

  for (const account of plaidAccounts) {
    try {
      const fundingSourceUrl = await addFundingSource({
        dwollaCustomerId,
        processorToken: account.processorToken,
        accountName: account.accountName,
        accountType: account.accountType,
        accountId: account.accountId,
      });

      results.push({
        accountId: account.accountId,
        fundingSourceUrl: fundingSourceUrl || null,
      });
    } catch (err) {
      console.error(`Failed to add funding source for ${account.accountName} ${account.accountType}:`, err);
      results.push({
        accountId: account.accountId,
        fundingSourceUrl: null,
      });
    }
  }

  return results;
};
