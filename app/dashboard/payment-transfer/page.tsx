import React from 'react';
import { getCurrentUser } from '@/app/(auth)/_nextjs/currentUser';
// import { getAccounts } from '@/lib/actions/bank.actions';

const PaymentTransfer = async () => {

  const loggedInUser = await getCurrentUser({ withFullUser: true});
  if (!loggedInUser) return;
  //   const accountsResult = await getAccounts(loggedInUser.id);

  return (
    <section className='payment-transfer'>
      <section className=''>
        {/* <PaymentTransferForm accounts={accountsResult.data} /> */}
      </section>
    </section>
  );
};

export default PaymentTransfer;
