import { VariantProps } from 'class-variance-authority';
import { boxVariant, iconVariant } from './dataCard.utils';
import { IconType } from 'react-icons';

type BoxVariant = VariantProps<typeof boxVariant>;
type IconVariant = VariantProps<typeof iconVariant>;

export interface DataCardProps extends BoxVariant, IconVariant {
  icon: IconType
  title: string;
  value?: number;
  dateRange: string;
  percentageChange?: number;
}
