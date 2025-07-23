import React from 'react';
import TransactionsTable from '../_nextjs/components/recentTransactions/transactionsTable/transactionsTable';
import { Pagination } from '../_nextjs/components/recentTransactions/pagination/pagination';
import { formatAmount } from '@/lib/utils';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getCurrentUser } from '@/app/(auth)/_nextjs/currentUser';

const TransactionHistory = async ({ searchParams }: {
  searchParams: Promise<{ id?: string; page?: string }>;
}) => {
  const { id, page } = await searchParams;
  const currentPage = Number(page) || 1;

  const loggedIn = await getCurrentUser({ withFullUser: true });
  if (!loggedIn) return;

  const accounts = await getAccounts(loggedIn.id);
  if (!accounts) return;

  const accountsData = accounts?.data;
  const accountId = (id as string) || accountsData[0]?.id;

  const account = await getAccount(accountId);

  const rowsPerPage = 10;
  const totalPages = Math.ceil((account?.transactions.length || 0) / rowsPerPage);

  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = account?.transactions.slice(
    indexOfFirstTransaction, indexOfLastTransaction
  );

  return (
    <div className="transactions">
      <div className="space-y-6">
        <div className="transactions-account">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-white">{account?.data.name}</h2>
            <p className="text-sm font-medium text-primary-100">
              {account?.data.officialName}
            </p>
            <p className="text-sm font-semibold tracking-[1.1px] text-white">
              ●●●● ●●●● ●●●● {account?.data.mask}
            </p>
          </div>

          <div className='transactions-account-balance'>
            <p className="text-sm">Current balance</p>
            <p className="text-2xl text-center font-bold">{formatAmount(account?.data.currentBalance)}</p>
          </div>
        </div>

        <section className="flex w-full flex-col gap-6">
          <TransactionsTable
            transactions={currentTransactions}
          />

          {/* Debug: Always show pagination info */}
          {/* <div className="text-sm text-gray-500">
            Debug: Total Pages = {totalPages}, Current Page = {currentPage}
          </div> */}

          {/* <div className="my-4 w-full">
            <Pagination totalPages={totalPages} page={currentPage} />
          </div> */}

          {totalPages > 1 && (
            <div className="my-4 w-full">
              <Pagination totalPages={totalPages} page={currentPage} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TransactionHistory;
