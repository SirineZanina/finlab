'use client';
import { LoaderIcon } from '@/components/assets/icons/loaderIcon';
import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
  text: string;
}
export default function SubmitButton({ text }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (

    <Button className='form-btn' type="submit" disabled={pending}>
      {pending ? (
        <>
          <LoaderIcon />
		Loading...
        </>
      ):
        text
      }
    </Button>

  );
}
