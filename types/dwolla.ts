export type CreateFundingSourceOptions = {
  customerId: string; // Dwolla Customer ID
  fundingSourceName: string; // Dwolla Funding Source Name
  plaidToken: string; // Plaid Account Processor Token
  _links: object; // Dwolla On Demand Authorization Link
}

export type NewDwollaCustomerParams = {
 	firstName: string;
	lastName: string;
	businessName: string;
	businessIndustry: string;
	address1: string;
	type: 'personal'; // only personal customers
  	city: string;
    state: string;
    postalCode: string;
    dateOfBirth: string; // YYYY-MM-DD
    ssn: string; // last 4 digits of SSN
	country: string;
	phoneNumber: string;
	roleType: string;
	email: string;
};

export type TransferParams = {
  sourceFundingSourceUrl: string;
  destinationFundingSourceUrl: string;
  amount: string;
};

export interface AddFundingSourceParams {
  dwollaCustomerId: string;
  processorToken: string;
  accountName: string;
  accountType?: string; // 'checking', 'savings', etc.
  accountId?: string; // Plaid account ID for uniqueness
}
