import { JSX, useRef, useState } from 'react';
// Features
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { useCreateAccount } from '@/features/accounts/api/use-create-account';
// Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/shared/select/select';

export const useSelectAccount = () : [() => JSX.Element, () =>
	Promise<string | undefined>] => {

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();

  const onCreateAccount = (name: string, bankId: string, currencyId: string) =>
    accountMutation.mutate({
      name,
      bankId,
      currencyId
    });

  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id
  }));

  const [promise, setPromise] = useState<{
    resolve: (value: string | undefined) => void
      } | null>(null);

  const selectValue = useRef<string>('');

  const confirm = () => new Promise<string | undefined>((resolve) => {
    setPromise({ resolve });
  });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(selectValue.current);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(undefined);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <Dialog
      open={promise !== null}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
			Select account
          </DialogTitle>
          <DialogDescription>
			Please select an account to continue.
		  </DialogDescription>
        </DialogHeader>
        <Select
          placeholder='Select an account'
		  options={accountOptions}
		  onCreate={onCreateAccount}
          onChange={(value) => selectValue.current = value ?? ''}
		  disabled={accountQuery.isLoading || accountMutation.isPending}
		  >

        </Select>
        <DialogFooter className='pt-2'>
          <Button
            onClick={handleCancel}
            variant='outline'
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmationDialog, confirm];
};
