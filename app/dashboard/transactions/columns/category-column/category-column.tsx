// icons
import { TriangleAlertIcon } from 'lucide-react';
// utils
import { cn } from '@/lib/utils';
// hooks
import { useOpenCategory } from '@/features/categories/hooks/use-open-category';
import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transaction';
// types
import { CategoryColumnProps } from './category-column.types';

const CategoryColumn = ({
  id,
  category,
  categoryId
} : CategoryColumnProps) => {

  const { onOpen: onOpenCategory } = useOpenCategory();
  const { onOpen: onOpenTransaction } = useOpenTransaction();

  const onClick = () => {
    if (!categoryId) {
	  onOpenTransaction(id);
	  return;
    }
    onOpenCategory(categoryId);
  };

  return (
    <div
      onClick={onClick}
	  className={cn('flex items-center cursor-pointer hover:underline font-medium',
        !category && 'text-rose-500'
	  )}
    >
      {category
	  	? category
        : (
          <div className='flex items-center justify-center gap-2'>
            <TriangleAlertIcon className='size-4 shrink-0 text-rose-500' />
				Uncategorized
          </div>
        )
      }
    </div>
  );
};

export default CategoryColumn;
