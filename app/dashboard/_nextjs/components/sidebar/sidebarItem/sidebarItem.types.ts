import { sidebarLinks } from '@/constants';

export type SidebarItemProps = {
	item: typeof sidebarLinks[number];
	isActive: boolean;
	onClick?: () => void;
	className?: string;
}
