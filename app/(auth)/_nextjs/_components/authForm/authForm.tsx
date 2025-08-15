'use client';

import z from 'zod';
import React, { useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import CustomInput from '@/components/shared/customInput/customInput';
import CustomSelect from '@/components/shared/customSelect/customSelect';
import { LoaderIcon } from '@/components/assets/icons/loaderIcon';
import { GoogleIcon } from '@/components/assets/icons/googleIcon';
import AuthCardCta from './authCardCta';
import CompanyLogo from '@/components/shared/companyLogo/companyLogo';

import { useAuthForm } from './authForm.hooks';
import { authFormSchema } from '../../schema';

import { signIn, signUp } from '@/lib/actions/user.actions';
import { RoleType, User } from '@/types/client/user';
import { BusinessIndustries } from '@/types/client/business';

const AuthForm = ({ type }: { type: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User>();

  const form = useAuthForm(type);
  const formSchema = authFormSchema(type);

  const roleOptions = Object.values(RoleType).map(role => ({
    value: role,
    label: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
  }));

  const businessIndustryOptions = BusinessIndustries.map(industry => ({
    value: industry,
    label: industry.charAt(0).toUpperCase() + industry.slice(1).toLowerCase(),
  }));

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      if (type === 'sign-up') {
        const userData = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          email: data.email!,
          password: data.password!,
          businessName: data.businessName!,
          businessIndustry: data.businessIndustry!,
          country: data.country!,
          phoneNumber: data.phoneNumber!,
          roleType: data.roleType!,
        };

        const user = await signUp(userData);
        setUser(user);
      }

      if (type === 'sign-in') {
        await signIn(data);
      }
    } catch (error) {
      console.error('Error during form submission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormFields = () => (
    <>
      {type === 'sign-up' && (
        <>
		   <div className='grid lg:grid-cols-2 w-full gap-4'>
            <CustomInput control={form.control} name="firstName" label="First Name" placeholder="Enter your first name" />
            <CustomInput control={form.control} name="lastName" label="Last Name" placeholder="Enter your last name" />
            <CustomInput control={form.control} name="businessName" label="Business Name" placeholder="Enter your business name" />
            <CustomSelect control={form.control} name="businessIndustry" label="Business Industry" placeholder="Select your business industry" options={businessIndustryOptions} />
            <CustomInput control={form.control} name="country" label="Country" placeholder="Example: USA" />
            <CustomInput control={form.control} name="phoneNumber" label="Phone Number" placeholder="+11101" />
          </div>
          <CustomSelect control={form.control} name="roleType" label="Role" placeholder="Select your role" options={roleOptions} />
	 	</>

      )}
      <div className='flex flex-col gap-4'>
        <CustomInput control={form.control} name="email" label="Email" placeholder="Enter your email" type="email" />
        <CustomInput control={form.control} name="password" label="Password" placeholder="Enter your password" type="password" />
	  </div>
    </>
  );

  return (
    <section>
      <div className="grid grid-cols-2 h-screen  ">
        {/* Left Panel */}
        <div className="col-span-2 lg:col-span-1 p-10">
          <CompanyLogo />
          <div className="flex justify-center flex-col h-full">
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold tracking-tight">
                {user ? 'Link Account' : type === 'sign-in' ? 'Sign In' : 'Sign Up'}
              </h1>
              <div className="flex items-center gap-1">
                <p className="text-[14px] font-normal text-gray-600">
                  {user
                    ? 'Link your account to continue'
                    : type === 'sign-in'
                      ? 'Welcome back! Please sign in to continue'
                      : 'Create a new account to get started'}
                </p>
                {!user && (
                  <Link className="form-link" href={type === 'sign-in' ? '/sign-up' : '/sign-in'}>
                    {type === 'sign-in' ? 'Sign Up' : 'Sign In'}
                  </Link>
                )}
              </div>
            </div>
            {/* <div className="flex flex-col gap-4 mt-6">
              <PlaidLink
                user={user}
                variant="primary"
              />
            </div> */}
            <div className="justify-center mt-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  {renderFormFields()}

                  <div className='flex gap-4 flex-col mt-6'>
                    <div className="flex flex-col gap-4">
                      <Button className="form-btn" type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <LoaderIcon className="size-4 animate-spin" />
                            Loading...
                          </>
                        ) : type === 'sign-in' ? 'Sign In' : 'Sign Up'}
                      </Button>
                    </div>

                    <div className="flex items-center">
                      <hr className="flex-grow border-t border-gray-300" />
                      <span className="text-sm text-gray-500">OR</span>
                      <hr className="flex-grow border-t border-gray-300" />
                    </div>

                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <GoogleIcon className="size-5" />
                      Continue with Google
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="hidden lg:flex lg:col-span-1 relative overflow-hidden bg-primary-800 text-white p-10">
          <div className="absolute top-[-120px] right-[-120px] size-[500px] bg-white/20 rounded-full z-0" />
          <div className="flex justify-center flex-col max-w-[550px] mx-auto z-10">
            <AuthCardCta />
            <div className="flex flex-col items-center text-center justify-center gap-5 mt-20">
              <h3 className="text-4xl font-semibold">Introducing new features</h3>
              <p className="text-base text-white">
                Analyzing previous trends ensures that businesses always make the right decision. And as the scale of the decision and its impact magnifies...
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthForm;
