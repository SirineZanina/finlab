'use client';

import z from 'zod';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import CustomInput from '@/components/shared/customInput/customInput';
import CustomSelect from '@/components/shared/customSelect/customSelect';
import { LoaderIcon } from '@/components/assets/icons/loaderIcon';
import AuthCardCta from './authCardCta';
import CompanyLogo from '@/components/shared/companyLogo/companyLogo';

import { useAuthForm } from './authForm.hooks';
import { authFormSchema } from '../../schema';

import { signIn, signUp } from '@/lib/actions/user.actions';
import { RoleType } from '@/types/client/user';
import { BusinessIndustries } from '@/types/client/business';
import { useGetCurrencies } from '@/features/currencies/api/use-get-currencies';
import { useGetCountries } from '@/features/countries/api/use-get-countries';
import { Select } from '@/components/shared/select/select';

const AuthForm = ({ type }: { type: string }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  const currencies = useGetCurrencies();

  const currencyOptions = currencies.data?.map(currency => ({
    value: currency.id,
    label: currency.name,
  })) || [];

  const countries = useGetCountries();

  const countryOptions = countries.data?.map(country => ({
    value: country.id,
    label: country.name,
  })) || [];

  const onSubmit = async (data: z.infer<typeof formSchema>) => {

    setIsLoading(true);
    setError(null);

    try {
      if (type === 'sign-up') {
        const userData = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          email: data.email!,
          password: data.password!,
          businessName: data.businessName!,
          businessIndustry: data.businessIndustry!,

		  currencyId: data.currencyId!,
          phoneNumber: data.phoneNumber!,
          roleType: data.roleType!,

		  street: data.street!,
		  city: data.city!,
		  state: data.state!,
		  postalCode: data.postalCode!,
		  countryId: data.countryId!,

        };

        await signUp(userData);

        // Redirect to sign-in page after successful sign-up
        router.push('/sign-in');
      }

      if (type === 'sign-in') {

        const result = await signIn(data);

        if (result?.success) {
          router.refresh();
          router.push('/dashboard');

        }
      }
    } catch (error: any) {
      console.error('Error during form submission:', error);
      console.error('Error message:', error?.message);
      console.error('Error type:', typeof error);

      setError(error?.message || 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
      console.log('Form submission completed, loading set to false');
    }
  };
  console.log('🎯 onSubmit function defined:', typeof onSubmit);

  const renderFormFields = () => (
    <>
      {type === 'sign-up' && (
        <>
          <div className='grid lg:grid-cols-2 w-full gap-4'>
            <CustomInput control={form.control} name="firstName" label="First Name" placeholder="Enter your first name" />
            <CustomInput control={form.control} name="lastName" label="Last Name" placeholder="Enter your last name" />
            <CustomInput control={form.control} name="businessName" label="Business Name" placeholder="Enter your business name" />
            <CustomSelect control={form.control} name="businessIndustry" label="Business Industry" placeholder="Select your business industry" options={businessIndustryOptions} />
            <CustomInput control={form.control} name="phoneNumber" label="Phone Number" placeholder="+11101" />
            <CustomInput control={form.control} name="street" label="Street" placeholder="Street" />
            <CustomInput control={form.control} name="city" label="City" placeholder="City" />
			 <CustomInput control={form.control} name="state" label="State" placeholder="State" />
            <CustomInput control={form.control} name="postalCode" label="Postal code" placeholder='postal code' />
            <FormField
              name='countryId'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onChange={field.onChange}
                      options={countryOptions}
                      placeholder='Select a country'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
			 <FormField
              name='currencyId'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onChange={field.onChange}
                      options={currencyOptions}
                      placeholder='Select a currency'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
      <div className="grid grid-cols-2 h-screen">
        {/* Left Panel */}
        <div className="col-span-2 lg:col-span-1 p-10">
          <CompanyLogo />
          <div className="flex justify-center flex-col h-full">
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold tracking-tight">
                {type === 'sign-in' ? 'Sign In' : 'Sign Up'}
              </h1>
              <div className="flex items-center gap-1">
                <p className="text-[14px] font-normal text-gray-600">
                  {type === 'sign-in'
                    ? 'Welcome back! Please sign in to continue'
                    : 'Create a new account to get started'}
                </p>
                <Link className="form-link" href={type === 'sign-in' ? '/sign-up' : '/sign-in'}>
                  {type === 'sign-in' ? 'Sign Up' : 'Sign In'}
                </Link>
              </div>
            </div>

            <div className="justify-center mt-8">
              <Form {...form}>
                <form onSubmit={(e) => {
                  console.log('📤 Form onSubmit triggered');

                  try {
                    console.log('📋 Form values:', form.getValues());
                    console.log('📋 Form errors:', form.formState.errors);
                    console.log('📋 Form valid?', form.formState.isValid);

                    console.log('🎯 About to call form.handleSubmit');

                    const handleSubmitResult = form.handleSubmit(
                      (data) => {
                        console.log('✅ Form validation passed, calling onSubmit with data:', data);
                        return onSubmit(data);
                      },
                      (errors) => {
                        console.log('❌ Form validation failed:', errors);
                      }
                    );

                    console.log('🎯 handleSubmit function created, calling with event');
                    handleSubmitResult(e);

                  } catch (error) {
                    console.error('💥 Error in form submission:', error);
                  }
                }}>
                  {renderFormFields()}

                  {/* Show any errors */}
                  {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <div className='flex gap-4 flex-col mt-6'>
                    <div className="flex flex-col gap-4">
                      <Button
                        className="form-btn"
                        type="submit"
                        disabled={isLoading}
                        onClick={() => console.log('🔘 Submit button clicked!')}
                      >
                        {isLoading ? (
                          <>
                            <LoaderIcon className="size-4 animate-spin" />
                            {type === 'sign-up' ? 'Creating Account...' : 'Signing In...'}
                          </>
                        ) : type === 'sign-in' ? 'Sign In' : 'Sign Up'}
                      </Button>
                    </div>
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
              <h3 className="text-4xl font-semibent">Introducing new features</h3>
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
