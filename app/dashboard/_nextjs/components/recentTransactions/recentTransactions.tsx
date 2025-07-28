'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Account } from '@/types/account';
import { BankTabItem } from './bankTabItem/bankTabItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BankInfo from './bankInfo/bankInfo';
import TransactionsTable from './transactionsTable/transactionsTable';
import { Pagination } from './pagination/pagination';
import { RecentTransactionsProps } from './recentTransactions.types';

const RecentTransactions = ({
  accounts,
  initialTransactions,
  accountId,
  page = 1,
}: RecentTransactionsProps) => {
  const router = useRouter();
  const [transactions, setTransactions] = useState(initialTransactions);
  const [currentAccountId, setCurrentAccountId] = useState(accountId);
  const [loading, setLoading] = useState(false);

  const rowsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = transactions.slice(
    indexOfFirstTransaction, indexOfLastTransaction
  );

  const handleTabChange = async (newAccountId: string) => {
    if (newAccountId === currentAccountId) return;

    setLoading(true);
    setCurrentAccountId(newAccountId);

    console.log('Fetching transactions for account:', newAccountId);

    try {
      // Update URL
      router.push(`/dashboard?id=${newAccountId}&page=1`);

      // Fetch transactions for the new account
      const response = await fetch(`/api/accounts/${newAccountId}/transactions`);

	  console.log('Response from transactions API:', response);

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Optionally show error to user
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="recent-transactions">
      <header className="flex items-center justify-between">
        <h2 className="recent-transactions-label">Recent transactions</h2>
        <Link
          href={`/dashboard/transaction-history?id=${currentAccountId}&page=${page}`}
          className="view-all-btn"
        >
          View all
        </Link>
      </header>
      <Tabs
        value={currentAccountId}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="recent-transactions-tablist">
          {accounts.map((account: Account) => (
            <TabsTrigger key={account.id} value={account.id} className='' >
              <BankTabItem
                key={account.id}
                account={account}
                accountId={currentAccountId}
              />
            </TabsTrigger>
          ))}
        </TabsList>

        {accounts.map((account: Account) => (
          <TabsContent
            value={account.id}
            key={account.id}
            className="space-y-4"
          >
            <BankInfo
              account={account}
              accountId={currentAccountId}
              type="full"
            />

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <TransactionsTable transactions={currentTransactions} />
            )}

            {totalPages > 1 && !loading && (
              <div className="my-4 w-full">
                <Pagination totalPages={totalPages} page={page} />
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default RecentTransactions;
