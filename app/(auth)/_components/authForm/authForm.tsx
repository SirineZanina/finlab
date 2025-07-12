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

import CustomInput from '../customInput/customInput';
import { LoaderIcon } from '@/components/assets/icons/loaderIcon';
import AuthCardCta from './authCardCta';
import { GoogleIcon } from '@/components/assets/icons/googleIcon';
import { FacebookIcon } from '@/components/assets/icons/facebookIcon';
import { authFormSchema } from '../../schema';
import { signIn, signUp } from '../../actions';
import { Controller } from 'react-hook-form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BusinessIndustries } from '@/types/businessIndustry';
import { RoleTypes } from '@/types/roleType';

import CustomSelect from '../customSelect/customSelect';
import { RoleType } from '@prisma/client';

const AuthForm = ({ type }: { type: string }) => {
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
          password: data.password,
        });
        if (response) router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = Object.values(RoleType).map((role) => ({
    value: role,
    label: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
  }));

  const businessIndustryOptions = BusinessIndustries.map((industry) => ({
    value: industry,
    label: industry.charAt(0).toUpperCase() + industry.slice(1).toLowerCase(),
  }));

  return (
    <section>
      <div className="grid grid-cols-2 h-screen">
        <div className="col-span-2 md:col-span-1 py-8 mx-30">
          <Link href="/" className="cursor-pointer flex items-center gap-2">
            <FinlabIcon className="w-7 h-7" />
            <FinlabLogo className="w-12" />
          </Link>

          <div className='flex justify-center flex-col h-full'>
		   <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold tracking-tight">
                {type === 'sign-up' ? 'Create an account' : 'Sign in to your account'}
              </h1>

              <div className="flex items-center gap-1">
                <p className="text-14 font-normal text-gray-600">
                  {type === 'sign-in' ? "Don't have an account?" : 'Already have an account?'}
                </p>
                <Link className="form-link" href={type === 'sign-in' ? '/sign-up' : '/sign-in'}>
                  {type === 'sign-in' ? 'Sign Up' : 'Sign In'}
                </Link>
              </div>
            </div>

            <div className="justify-center mt-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="">
                  <div className='flex flex-col gap-6'>
                    {type === 'sign-up' && (
                      <>
                        <div className="flex gap-4">
                          <CustomInput control={form.control} name="firstName" label="First Name" placeholder="Enter your first name" />
                          <CustomInput control={form.control} name="lastName" label="Last Name" placeholder="Enter your last name" />
                        </div>
                        <div className="flex gap-4">
                          <CustomInput control={form.control} name="businessName" label="Business Name" placeholder="Enter your business name" />
                          <CustomSelect control={form.control} name="businessIndustry" label="Business Industry" placeholder="Select your business industry" options={businessIndustryOptions} />
                        </div>

                        <div className="flex gap-4">
                          <CustomInput control={form.control} name="country" label="Country" placeholder="Example: USA" />
                          <CustomInput control={form.control} name="phoneNumber" label="Phone Number" placeholder="+11101" />
                        </div>
                        <CustomSelect control={form.control} name="roleType" label="Role" placeholder="Select your role" options={roleOptions} />
                      </>
                    )}

                    <CustomInput control={form.control} name="email" label="Email" placeholder="Enter your email" />
                    <CustomInput control={form.control} name="password" label="Password" placeholder="Enter your password" />
                  </div>

                  <div className="flex flex-col gap-4 mt-6">
                    <Button className="form-btn" type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <LoaderIcon className="size-4 animate-spin mr-2" />
                    Loading...
                        </>
                      ) : type === 'sign-in' ? 'Sign In' : 'Sign Up'}
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 my-4">
                    <hr className="flex-grow border-t border-gray-300" />
                    <span className="text-sm text-gray-500">OR</span>
                    <hr className="flex-grow border-t border-gray-300" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 flex items-center gap-2 justify-center"
                    >
                      <GoogleIcon className="size-5" />
					Continue with Google
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 flex items-center gap-2 justify-center"
                    >
                      <FacebookIcon className="size-5" />
    				Continue with Facebook
                    </Button>
                  </div>

                </form>
              </Form>
            </div>
	   </div>
        </div>
        <div className="hidden md:flex md:col-span-1 relative overflow-hidden bg-primary-800 text-white p-10">
          <div className="absolute top-[-120px] right-[-120px] size-[500px] bg-white/20 rounded-full z-0" />
          <div className='flex justify-center flex-col max-w-[550px] mx-auto'>
			 <AuthCardCta />
            <div className='flex flex-col items-center text-center justify-center gap-5 mt-20'>
              <h3 className="text-4xl font-semibold">Introducing new features</h3>
              <p className="text-base text-white">
				Analyzing previous trends ensures that businesses always make the right decision. And as the scale of the decision and it’s impact magnifies...              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

  );
};

export default AuthForm;
