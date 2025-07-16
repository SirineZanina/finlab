import { PermissionOnRole } from './permissionOnRole';
import { RoleType } from './roleType';

export type UserRole = {
	id: string;
	roleType: RoleType;
	permissions: PermissionOnRole[];
}
