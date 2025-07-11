'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import z from 'zod';
// components
import { FinlabIcon } from '@/components/assets/logos/finlabIcon';
import { FinlabLogo } from '@/components/assets/logos/finlabLogo';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
// hooks
import { useRouter } from 'next/navigation';
import { useAuthForm } from './authForm.hooks';
import { authFormSchema } from './authForm.schema';
import { signIn, signUp } from './authForm.actions';
import CustomInput from '../customInput/customInput';
import { LoaderIcon } from '@/components/assets/icons/loaderIcon';

const AuthForm = ({ type } : { type: string}) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useAuthForm(type);
  const formSchema = authFormSchema(type);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (type === 'sign-up') {
        const newUser = await signUp(data);
        // setUser(newUser);
      }
      if (type === 'sign-in') {
        const response = await signIn({
        	email: data.email,
        	password: data.password
        });
        if (response) router.push('/dashboard');
      }
    }
    catch (error) {
      console.error('Error during form submission:', error);
    } finally {
      setIsLoading(false);

    }
  };

  return (
    <section className="auth-form">
      <header className='flex flex-col gap-5 md:gap-8'>
        <Link href="/" className="cursor-pointer flex items-center gap-2">
          <FinlabIcon className="w-7 h-7" />
          <FinlabLogo className="w-12" />
        </Link>
        <div className='flex flex-col gap-1 md:gap-3'>
          <h1 className='text-24 lg:text-36 font-semibold text-gray-900'>
            {user
              ? 'Link Account'
              : type === 'sign-in'
                ? 'Sign In'
                : 'Sign Up'
            }
            <p className='text-16 font-normal text-gray-600'>
              {user
                ? 'Link your existing account to continue'
                : 'Please enter your details to continue'
              }
            </p>
          </h1>
        </div>
      </header>
      {user ? (
        <div className='flex flex-col gap-4'>
          {/* BANK ACCOUNT */}
        </div>
      )
        : (
          <>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {type === 'sign-up' && (
                  <>
                    <div className='flex gap-4'>
                      <CustomInput control={form.control} name='firstName' label="First Name" placeholder="Enter your first name"  />
                      <CustomInput control={form.control} name='lastName' label="First Name" placeholder="Enter your last name"  />
                    </div>
                    <CustomInput control={form.control} name='businessName' label="Business Name" placeholder="Enter your business name"  />
                    <CustomInput control={form.control} name='businessIndustry' label="Business Industry" placeholder="Enter your business industry"  />
                    <div className='flex gap-4'>
                      <CustomInput control={form.control} name='country' label="State" placeholder="Example: USA"  />
                      <CustomInput control={form.control} name='phoneNumber' label="Phone Number" placeholder="+11101" />
                    </div>
                  </>
                )}
                <CustomInput control={form.control} name='email' label="Email" placeholder="Enter your email"  />
                <CustomInput control={form.control} name='password' label="Password" placeholder="Enter your password"  />

                <div className='flex flex-col gap-4'>
                  <Button className='form-btn' type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <LoaderIcon className="w-8 h-8 mr-2 animate-spin" />
											Loading...
                      </>

                    ) : type === 'sign-in' ? 'Sign In' : 'Sign Up'}
                  </Button>
                </div>
              </form>
            </Form>
            <footer className="flex justify-center gap-1">
              <p className='text-14 font-normal text-gray-600'>
                {type === 'sign-in'
                  ? "Don't have an account?"
                  : 'Already have an account?'}
              </p>
              <Link className='form-link' href={type === 'sign-in' ? '/sign-up' : '/sign-in'}>
                {type === 'sign-in' ? 'Sign Up' : 'Sign In'}
              </Link>
            </footer>
          </>
        )
      }
    </section>
  );
};

export default AuthForm;
