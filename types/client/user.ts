export type SignUpParams = {
	firstName: string;
	lastName: string;
	businessName: string;
	businessIndustry: string;
	country: string;
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
	email: string;
	dwollaCustomerUrl: string;
	dwollaCustomerId: string;
	firstName: string;
	lastName: string;
	businessId: string;
	country: string;
	phoneNumber: string;
  	roleId: string;
	profilePhotoUrl?: string | null;
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

// =================== PLAID ===========================
export type ExchangePublicTokenProps = {
  publicToken: string;
  user: User;
}
