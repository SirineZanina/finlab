import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { formatAmount } from '@/lib/utils';
import { SearchParamProps } from '@/types/pagination';
import React from 'react';
import TransactionsTable from '../_nextjs/components/recentTransactions/transactionsTable/transactionsTable';
import { Pagination } from '../_nextjs/components/recentTransactions/pagination/pagination';

const TransactionHistory = async ({ params } : SearchParamProps) => {
  const { id, page} = await params;

  const currentPage = Number(page as string) || 1;

  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts(loggedIn.id);

  if(!accounts) return;

  const accountsData = accounts?.data;
  const accountId = (id as string) || accountsData[0]?.id;

  const account = await getAccount({ accountId });

  const rowsPerPage = 10;
  const totalPages = Math.ceil(account?.transactions.length / rowsPerPage);

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
            <p className="text-sm text-primary-900">
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
