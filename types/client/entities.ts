export interface Account {
  id: string;
  name: string;
  businessId: string;
  bankId: string | null;
  plaidId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
}

export type Transaction = {
	id: string;
	name: string;
	account: Pick<Account, 'id' | 'name'>;
	category: Category | null;
	amount: number;
	notes: string | null;
	payee: string;
	date: string; // ISO date string
}

export type PlaidTransaction = {
	id: string;
	name: string;
	account: Pick<Account, 'id' | 'name'>;
	amount: number;
	payee: string;
	date: string; // ISO date string
	pending?: boolean;
	image?: string | null;
	category?: string | null; // Category name or null if not categorized
}

export type Country = {
  id: string;
  code: string; // US, TN, GB, etc.
  name: string; // "United States", "Tunisia", "United Kingdom"
  flagUrl: string;
  dialCode: string;
  phoneFormat: string; // "+1 (###) ###-####"
}

export type LoginParams = {
	email: string;
	password: string;
}

// ===================================

export type User = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	address: Address;
	phoneNumber: string;

	dwollaCustomerUrl: string;
	dwollaCustomerId: string;
	profilePhotoUrl?: string | null;

	roleId: string;
	businessId: string;
}

export type Address = {
	id: string;
	street: string;
	city: string;
	state: string;
	postalCode: string;
	countryId: string;
}

export enum BusinessIndustries {
	TECHNOLOGY = 'Technology',
	FINANCE = 'Finance',
	HEALTHCARE = 'Healthcare',
	RETAIL = 'Retail',
	MANUFACTURING = 'Manufacturing',
	EDUCATION = 'Education',
	HOSPITALITY = 'Hospitality',
	CONSTRUCTION = 'Construction',
	REAL_ESTATE = 'Real Estate',
	TRANSPORTATION = 'Transportation',
	OTHER = 'Other',
}

// =================== PLAID ===========================
export type ExchangePublicTokenProps = {
  publicToken: string;
  user: User;
}
