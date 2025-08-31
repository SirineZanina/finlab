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

export type SignUpParams = {
	firstName: string;
	lastName: string;
	businessName: string;
	businessIndustry: string;
	countryId: string;
	currencyId: string;
	phoneNumber: string;
	roleType: string;
	email: string;
	password: string;
}
// ===================================

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
	address?: Address | null;
	phoneNumber: string;

	dwollaCustomerUrl?: string | null;
	dwollaCustomerId?: string | null;
	profilePhotoUrl?: string | null;

	roleId: string;
	businessId: string;
	  verified: boolean;

}

export type Address = {
	id: string;
	street: string;
	city: string;
	state: string;
	postalCode: string;
	countryId: string;
}

export type UserRole = {
	id: string;
	roleType: RoleType;
	permissions: PermissionOnRole[];
}

export enum RoleType {
	ADMIN = 'ADMIN',
  OWNER = 'OWNER',
  ACCOUNTANT = 'ACCOUNTANT',
  MEMBER = 'MEMBER',
}

export enum Permission  {
	VIEW_TRANSACTIONS = 'VIEW_TRANSACTIONS',
	CREATE_TRANSACTIONS = 'CREATE_TRANSACTIONS',
	EDIT_TRANSACTIONS = 'EDIT_TRANSACTIONS',
	DELETE_TRANSACTIONS = 'DELETE_TRANSACTIONS',
	EXPORT_REPORTS = 'EXPORT_REPORTS',
	MANAGE_USERS = 'MANAGE_USERS',
	MANAGE_BUDGETS = 'MANAGE_BUDGETS',
}

export type PermissionOnRole = {
	id: string;
	permission: Permission;
	roleId: string;
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
