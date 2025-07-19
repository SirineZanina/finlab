import React, { useCallback, useEffect, useState } from 'react';
import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from 'react-plaid-link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PlaidLinkProps } from './plaidLink.types';
import { createLinkToken } from '@/lib/actions/plaid.actions';

const PlaidLink = ({ user, variant } : PlaidLinkProps) => {

  const router = useRouter();

  const [token, setToken] = useState('');

  useEffect(() => {
    const getLinkToken = async () => {
      if (user) {
        const data = await createLinkToken(user);
        //   setToken(data?.linkToken);
      }
    };
    getLinkToken();
  }, []);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: string) => {
    // await exchangePublicToken({
    //   publicToken: public_token,
    //   user
    // })

    router.push('/');
  }, [user]);

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
          variant='default'>
			Connect bank
        </Button>)
        : variant === 'ghost' ?
          <Button>
		Connect bank
          </Button>
          : (
            <Button>
			Connect bank
            </Button>
          )
      }

    </>
  );
};

export default PlaidLink;
