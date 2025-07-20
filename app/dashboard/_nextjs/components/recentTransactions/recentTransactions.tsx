import Link from 'next/link';

import { Account } from '@/types/account';
import { RecentTransactionsProps } from './recentTransactions.types';
import { BankTabItem } from './bankTabItem/bankTabItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BankInfo from './bankInfo/bankInfo';
import TransactionsTable from './transactionsTable/transactionsTable';
import { Pagination } from './pagination/pagination';

const RecentTransactions = ({
  accounts,
  transactions = [],
  accountId,
  page = 1,
}: RecentTransactionsProps) => {
  const rowsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  console.log('Transactions:', transactions);
  console.log('Account ID:', accountId);

  const currentTransactions = transactions.slice(
    indexOfFirstTransaction, indexOfLastTransaction
  );

  return (
    <section className="recent-transactions">
      <header className="flex items-center justify-between">
        <h2 className="recent-transactions-label">Recent transactions</h2>
        <Link
          href={`/transaction-history/?id=${accountId}`}
          className="view-all-btn"
        >
          View all
        </Link>
      </header>

      <Tabs defaultValue={accountId} className="w-full">
        <TabsList className="recent-transactions-tablist">
          {accounts.map((account: Account) => (
            <TabsTrigger key={account.id} value={account.id} className='' >
              <BankTabItem
                key={account.id}
                account={account}
                accountId={accountId}
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
              accountId={accountId}
              type="full"
            />

            <TransactionsTable transactions={currentTransactions} />

            {totalPages > 1 && (
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
