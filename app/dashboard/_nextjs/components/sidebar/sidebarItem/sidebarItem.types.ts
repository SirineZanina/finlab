import { sidebarLinks } from '@/constants';

export type SidebarItemProps = {
	item: typeof sidebarLinks[number];
	isActive: boolean;
	onClick?: () => void;
	hasSubmenu?: boolean;
	submenuItems?: SubMenuItem[];
	isSidebarExpanded?: boolean;
}

export type SubMenuItem = {
	label: string;
	route: string;
};
