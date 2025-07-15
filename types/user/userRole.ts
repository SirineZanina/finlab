import { PermissionOnRole } from './permissionOnRole';
import { RoleType } from './roleType';
import { User } from './user';

export type UserRole = {
	id: string;
	roleType: RoleType;
	permissions: PermissionOnRole[];
	users: User[];
}
