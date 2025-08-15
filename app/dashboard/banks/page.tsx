import { getCurrentUser } from '@/app/(auth)/_nextjs/currentUser';
import { getAccounts } from '@/lib/actions/bank.actions';
import BankCard from '../account-details/bankSection/bankCard/bankCard';
import { Account } from '@/types/client/entities';

const Banks = async () => {

  const loggedInUser = await getCurrentUser({ withFullUser: true });
  if (!loggedInUser) return;

  const accounts = await getAccounts(loggedInUser.id);

  return (
    <section className="flex">
      <div className='my-banks'>
        <h2 className='header-2'>
			 Your cards
        </h2>
        <div className='flex flex-wrap gap-6'>
          {accounts && accounts.data.map((account : Account) =>(
            <BankCard
              key={account.id}
              account={account}
              username={`${loggedInUser.firstName} ${loggedInUser.lastName}`}
              showBalance={true}
			  />
          ) )}
        </div>

      </div>

    </section>

  );
};

export default Banks;
