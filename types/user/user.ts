import { Business } from '../business/business';
import { UserRole } from './userRole';

export type User = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	salt: string;
	profilePhotoUrl?: string;
	country: string;
	phoneNumber: string;
	role: UserRole;
	businesses: Business[];
};
