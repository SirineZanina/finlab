import { Account } from './account';
import { Transaction } from './transaction';

export type Business = {
	id: string;
	name: string;
	industry: BusinessIndustry;
	accounts: Account[];
	transactions: Transaction[];
}

export const BusinessIndustries = [
  'FINANCE',
  'TECHNOLOGY',
  'HEALTHCARE',
  'EDUCATION',
  'RETAIL',
  'MANUFACTURING',
  'REAL_ESTATE',
  'HOSPITALITY',
  'TRANSPORTATION',
  'OTHER',
];

export type BusinessIndustry = typeof BusinessIndustries[number];
