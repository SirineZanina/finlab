import { cva } from 'class-variance-authority';

export const boxVariant = cva(
  'shrink-0 rounded-xl p-3 shadow-sm border',
  {
    variants: {
      variant: {
        default: 'bg-blue-50 border-blue-200',
        success: 'bg-primary-100 border-primary-200',
        danger: 'bg-error-100 border-error-200',
        warning: 'bg-orange-50 border-orange-200',
        info: 'bg-blue-50 border-blue-200',
        purple: 'bg-purple-50 border-purple-200',
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

export const iconVariant = cva(
  'size-6',
  {
    variants: {
      variant: {
        default: 'text-blue-600',
        success: 'text-primary-600',
        danger: 'text-error-500',
        warning: 'text-orange-500',
        info: 'text-blue-500',
        purple: 'text-purple-500',
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);
