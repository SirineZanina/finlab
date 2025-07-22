import React, { useCallback, useEffect, useState } from 'react';
import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from 'react-plaid-link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PlaidLinkProps } from './plaidLink.types';
import { createLinkToken, exchangePublicToken } from '@/lib/actions/plaid.actions';
import ConnectBankIcon from '@/components/assets/icons/connectBankIcon';

const PlaidLink = ({ user, variant } : PlaidLinkProps) => {

  const router = useRouter();

  const [token, setToken] = useState('');

  useEffect(() => {
    const getLinkToken = async () => {
      if (user) {
        const data = await createLinkToken(user);
        setToken(data?.linkToken);
      }
    };
    getLinkToken();
  }, [user]);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: string) => {
    if (!public_token) {
	  console.error('No public token received');
	  return;
    }
    await exchangePublicToken({
      publicToken: public_token,
      user
    });

    router.push('/dashboard');
  }, [user, router]);

  const config: PlaidLinkOptions ={
    token,
    onSuccess
  };

  const { open, ready } = usePlaidLink(config);
  return (
    <>
      { variant === 'primary' ?
        (<Button
          onClick={() => open()}
		  disabled={!ready}
          variant='default'
		  className='plaidlink-primary'
		  >
			Connect bank
        </Button>)
        : variant === 'ghost' ?
          <Button onClick={() => open()} variant='ghost' className='plaidlink-ghost'>
            <ConnectBankIcon />
            <p className='hidden text-base font-semibold text-secondary-500 xl:block'>
				Connect bank
            </p>
          </Button>
          : (
            <button onClick={() => open()}>
			  <p>
				Connect bank
			  </p>
            </button>
          )
      }
    </>
  );
};

export default PlaidLink;
