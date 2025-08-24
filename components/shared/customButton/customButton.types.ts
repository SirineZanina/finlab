import { buttonVariants } from '@/components/ui/button';
import { VariantProps } from 'class-variance-authority';
import React from 'react';

export type CustomButtonProps = {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  modern?: boolean;
  enhanced?: 'gradient' | 'glow' | 'elevated' | null;
  fullWidth?: boolean;
} & VariantProps<typeof buttonVariants> & React.ComponentProps<'button'>
