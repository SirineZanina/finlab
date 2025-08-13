import { sidebarLinks } from '@/constants';
import { User } from '@/types/client/user';

export type SidebarItemProps = {
	item: typeof sidebarLinks[number];
	isActive: boolean;
	onClick?: () => void;
	hasSubmenu?: boolean;
	submenuItems?: SubMenuItem[];
	isSidebarExpanded?: boolean;
	user: User
}

export type SubMenuItem = {
	label: string;
	route: string;
};
