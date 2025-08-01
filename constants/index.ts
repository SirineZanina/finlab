import HomeIcon from '@/components/assets/icons/homeIcon';
import DollarCircle from '@/components/assets/icons/dollarCircleIcon';
import Transaction from '@/components/assets/icons/transactionIcon';
import MoneySend from '@/components/assets/icons/moneySendIcon';
import EnterpriseIcon  from '@/components/assets/icons/enterpriseIcon';
import SettingsIcon from '@/components/assets/icons/settingsIcon';
import ConnectBankIcon from '@/components/assets/icons/connectBankIcon';
import AccountIcon from '@/components/assets/icons/accountIcon';

export const sidebarLinks = [
  {
    icon: HomeIcon,
    route: '/dashboard',
    label: 'Home',
    position: 'top',
  },
  {
    icon: AccountIcon,
    route: '/dashboard/accounts',
    label: 'Accounts',
    position: 'top',
  },
  {
    icon: DollarCircle,
    route: '/dashboard/banks',
    label: 'Banks',
    position: 'top',
  },
  {
    icon: Transaction,
    route: '/dashboard/transaction-history',
    label: 'Transaction History',
    position: 'top',
  },
  {
    icon:  MoneySend,
    route: '/dashboard/payment-transfer',
    label: 'Transfer Funds',
    position: 'top',
  },
  {
    icon: EnterpriseIcon,
    route: '/dashboard/sales',
    label: 'Sales',
    position: 'top',
    hasSubmenu: true,
    submenu: {
      items : [
        {
		  label: 'Sales Overview',
		  route: '/dashboard/sales/overview'
        },
        {
		  label: 'Sales Reports',
		  route: '/dashboard/sales/reports'
        }
      ]
    }
  },
  {
    icon: SettingsIcon,
    route: '/dashboard/settings',
    label: 'Settings',
    position: 'bottom',
  },
  {
    icon: ConnectBankIcon,
    route: '#',
    label: 'Connect Bank',
    position: 'top',
    isPlaid: true,
  }

];
