import { JSX, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ConfirmOptions, UseConfirmProps } from './use-confirm.types';

export const useConfirm = ({
  defaultTitle,
  defaultMessage
}: UseConfirmProps ) : [() => JSX.Element, (options?: Partial<ConfirmOptions>) => Promise<boolean>] => {
  // State to hold the promise and options for confirmation dialog
  // This will be used to resolve the promise when the user confirms or cancels
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
    options: ConfirmOptions;
      } | null>(null);

  const confirm = (options?: Partial<ConfirmOptions>) => new Promise<boolean>((resolve) => {
    setPromise({
      resolve,
      options: {
        title: options?.title || defaultTitle,
        message: options?.message || defaultMessage
      }
    });
  });

  const handleClose = () => {
    promise?.resolve(false); // Resolve with false when closed without confirmation
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
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
          <DialogTitle>{promise?.options.title}</DialogTitle>
          <DialogDescription>{promise?.options.message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className='pt-2'>
          <Button
            onClick={handleCancel}
            variant='outline'
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant='destructive' // Changed to destructive for delete actions
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmationDialog, confirm];
};
