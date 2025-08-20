import { getCurrentUser } from '@/app/(auth)/_lib/currentUser';
import BankList from './bankList/bankList';

const BanksPage = async () => {
  const loggedInUser = await getCurrentUser({ withFullUser: true });
  if (!loggedInUser) return null; // or redirect to login

  return <BankList user={loggedInUser} />;
};

export default BanksPage;
