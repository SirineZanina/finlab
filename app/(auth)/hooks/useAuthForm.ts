import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authFormSchema } from '../nextjs/components/authForm/authForm.utils';

export function useAuthForm(type: string) {
  const schema = authFormSchema(type);

  return useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
}
