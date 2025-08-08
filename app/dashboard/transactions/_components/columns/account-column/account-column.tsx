import { useOpenAccount } from '@/features/accounts/hooks/use-open-account';
// types
import { AccountColumnProps } from './account-column.types';

const AccountColumn = ({
  account,
  accountId
}: AccountColumnProps) => {

  const { onOpen: onOpenAccount } = useOpenAccount();

  const onClick = () => {
    onOpenAccount(accountId);
  };
  return (
    <div
	  className='flex items-center cursor-pointer hover:underline font-medium'
	  onClick={onClick}
    >
	  {account}
    </div>

  );
};

export default AccountColumn;
