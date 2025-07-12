import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authFormSchema } from '../../schema';

export function useAuthForm(type: string) {
  const schema = authFormSchema(type);

  const baseDefaults = {
    email: '',
    password: '',
  };

  const signUpDefaults = {
    firstName: '',
    lastName: '',
    businessName: '',
    businessIndustry: '',
    country: '',
    phoneNumber: '',
    roleType: '',
  };

  return useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: type === 'sign-up'
      ? { ...baseDefaults, ...signUpDefaults }
      : baseDefaults,
  });
}
