import React from 'react';
import AuthForm from '../nextjs/components/authForm/authForm';

const SignIn = () => {
  return (
    <section className='flex-center size-full max-sm:px-6'>
      <AuthForm type="sign-in" />
    </section>
  );
};

export default SignIn;
