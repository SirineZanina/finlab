import { Permission } from './permission';
import { UserRole } from './userRole';

export type PermissionOnRole = {
	id: string;
	permission: Permission;
	roleId: string;
	role: UserRole
}
