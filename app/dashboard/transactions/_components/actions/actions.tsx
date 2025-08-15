'use client';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
// Features
import { useDeleteTransaction } from '@/features/transactions/api/use-delete-transaction';
// Hooks
import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transaction';
import { useConfirm } from '@/hooks/use-confirm/use-confirm';
// Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
// Types
import { ActionsProps } from './actions.types';

export const Actions = ({ id }: ActionsProps) => {

  const [ConfirmDialog, confirm] = useConfirm ({
    defaultTitle: 'Are you sure?',
    defaultMessage: 'You are about to delete this transaction.'
  });;

  const deleteMutation = useDeleteTransaction(id);
  const { onOpen } = useOpenTransaction();

  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMutation.mutate();
    }
  };

  return (
    <>
      <ConfirmDialog />
	 <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className='size-8 p-0'>
            <MoreHorizontal className='size-4' />
		  </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={() => onOpen(id)}
          >
            <Edit className='size-4' />
			Edit
		  </DropdownMenuItem>
		   <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
          >
            <Trash className='size-4' />
			Delete
		  </DropdownMenuItem>

        </DropdownMenuContent>

      </DropdownMenu>
    </>
  );
};
