'use client';
import z from 'zod';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import CustomInput from '@/components/shared/customInput/customInput';
import { LoaderIcon } from '@/components/assets/icons/loaderIcon';
import { signIn } from '@/lib/actions/user.actions';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn(data);
      if (result?.success) {
        router.refresh();
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Error during sign in:', error);
      setError(error?.message || 'An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <div className="flex justify-center flex-col h-full">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Sign In</h1>
          <div className="flex items-center gap-1">
            <p className="text-[14px] font-normal text-gray-600">
                  Welcome back! Please sign in to continue
            </p>
            <Link className="form-link" href="/onboarding/account-type">
                  Create Account
            </Link>
          </div>
        </div>

        <div className="justify-center mt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='flex flex-col gap-4'>
                <CustomInput
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                />
                <CustomInput
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                />
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className='flex gap-4 flex-col mt-6'>
                <Button
                  className="form-btn"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoaderIcon className="size-4 animate-spin" />
                          Signing In...
                    </>
                  ) : 'Sign In'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

    </section>
  );
};

export default SignInForm;
