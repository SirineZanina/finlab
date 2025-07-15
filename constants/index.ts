import HomeIcon from '@/components/assets/icons/homeIcon';
import DollarCircle from '@/components/assets/icons/dollarCircleIcon';
import Transaction from '@/components/assets/icons/transactionIcon';
import MoneySend from '@/components/assets/icons/moneySendIcon';

export const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7; // 7 days
export const COOKIE_SESSION_KEY = 'session-id';

export const sidebarLinks = [
  {
    icon: HomeIcon,
    route: '/dashboard',
    label: 'Home',
    position: 'top',
  },
  {
    icon: DollarCircle,
    route: '/dashboard/banks',
    label: 'My Banks',
    position: 'top',
  },
  {
    icon: Transaction,
    route: '/dashboard/transactions',
    label: 'Transactions',
    position: 'top',
  },
  {
    icon:  MoneySend,
    route: '/dashboard/payment-transfer',
    label: 'Transfer Funds',
    position: 'top',
  },
];
