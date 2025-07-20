import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
    },
    username: process.env.PLAID_CLIENT_ID,
    password: process.env.PLAID_SECRET,
  }
});

export const plaidClient = new PlaidApi(configuration);

