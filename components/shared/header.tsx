'use client';
import React from 'react';
import HeaderBox from './headerBox/headerBox';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();

  const subPath = pathname.replace('/dashboard', '').split('/').filter(Boolean)[0];
  const pathLocation = subPath
    ? subPath
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    : 'Home';

  const subtitlesMap: Record<string, string> = {
    home: 'Track your financial performance at a glance',
    banks: 'Manage your bank accounts and connections efficiently',
    accounts: 'Overview of all your financial accounts in one place',
    categories: 'Organize and categorize your spending patterns',
    transactions: 'Complete history of your financial transactions',
    'transaction-history': 'View and analyze your complete transaction history',
    'transfer-funds': 'Send money securely between accounts and contacts',
    'payment-transfer': 'Transfer funds securely to any destination',
    sales: 'Track your revenue and sales performance',
    'connect-bank': 'Connect your bank accounts for automatic sync',
    settings: 'Customize your preferences and account settings',
  };

  const subtitle = subtitlesMap[subPath?.toLowerCase() || 'home'] ?? 'Manage your financial data effectively';

  return (
    <header className="w-full">
      <HeaderBox
        pathLocation={pathLocation}
        subtitle={subtitle}
      />
    </header>
  );
};

export default Header;
