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

export type AddFundingSourceParams = {
  dwollaCustomerId: string;
  processorToken: string;
  bankName: string;
};
